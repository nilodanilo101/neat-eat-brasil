import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  db,
  initDb,
  getAllRecipes,
  generateSmartMealPlan,
  getSuggestionsState,
  getTodayDateKey,
  getMarketPrices,
  getGroceryHistory,
  saveGroceryInvoice,
  calibrateMarketPrices,
  updateMarketPrice,
  recalcRecipesCost,
  stockFridgeFromInvoice,
} from './db.js';
import { CURRENT_VERSION, RELEASE_NOTES } from './changelog.js';
import { CACHE_DIR } from './imageCache.js';
import { parseSefazUrl, parseSefazHtml, parseSefazText, getDemoSefazInvoice } from './sefazParser.js';
import { CANONICAL_INGREDIENTS, computeCulinaryPortionCost } from './ingredientMatcher.js';
import { ROBUST_RECIPE_VAULT } from './suggestionEngine.js';
import { parseRecipeWithGemini } from './geminiService.js';
import { searchOpenFoodFacts } from './openFoodFactsService.js';
import { searchHighResDishPhotos } from './foodImageService.js';
import { calculateRecipeNutritionTaco, findTacoNutrition } from './tacoDatabase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function searchExactDishPhotos(dishTitle, _ingredients = []) {
  try {
    const userRow = db.prepare('SELECT unsplash_access_key FROM users ORDER BY id ASC LIMIT 1').get();
    const unsplashKey = userRow?.unsplash_access_key || process.env.UNSPLASH_ACCESS_KEY;
    const clean = String(dishTitle || '').replace(/\([^)]*\)/g, ' ').trim();
    const photos = await searchHighResDishPhotos(clean, unsplashKey);
    if (Array.isArray(photos) && photos.length > 0) {
      return photos.slice(0, 6).map((u) => (u.startsWith('/') ? u : `/api/image-proxy?url=${encodeURIComponent(u)}`));
    }
  } catch (err) {
    console.error('Erro ao buscar foto culinária do prato:', err);
  }
  return ['/dishes/rec-5.jpg'];
}

async function ensureRecipeStepDetails(title, steps, ingredients, providedStepDetails = [], dishImage = '') {
  let photoPool = [];
  try {
    const found = await searchExactDishPhotos(title, ingredients);
    if (Array.isArray(found) && found.length > 0) {
      photoPool.push(...found);
    }
  } catch {
    // fallback
  }
  if (dishImage) photoPool.push(dishImage);
  if (photoPool.length === 0) photoPool.push('/dishes/rec-5.jpg');

  return (steps || []).map((stepText, idx) => {
    const existing = Array.isArray(providedStepDetails) ? providedStepDetails[idx] : null;
    if (existing && existing.image && String(existing.image).trim()) {
      return {
        ...existing,
        stepNumber: idx + 1,
        text: stepText,
      };
    }
    const photo = photoPool[idx % photoPool.length];
    return {
      stepNumber: idx + 1,
      section:
        existing?.section ||
        (idx === 0
          ? 'Mise en Place'
          : idx === steps.length - 1
          ? 'Finalização & Empratamento'
          : 'Preparo e Cocção'),
      text: stepText,
      image: photo,
      alt: existing?.alt || `Passo ${idx + 1}: ${stepText.slice(0, 60)}...`,
      tip:
        existing?.tip ||
        (idx === 0
          ? 'Pese e prepare todos os insumos antes de ligar o fogo.'
          : idx === steps.length - 1
          ? 'Verifique a temperatura e o sal antes de empratar.'
          : 'Mantenha o fogo constante para cozinhar de forma homogênea.'),
      isKeyFrame: true,
      timerSeconds: existing?.timerSeconds || 120,
    };
  });
}

function isItemInFridge(ingName, fridgeItems) {
  const target = (ingName || '').toLowerCase().trim();
  for (const f of fridgeItems) {
    const fName = (f.name || '').toLowerCase().trim();
    if (fName === target) return true;
    if (fName.length >= 4 && target.includes(fName)) return true;
    if (target.length >= 4 && fName.includes(target)) return true;
  }
  return false;
}

function buildShoppingList(mealPlan, allRecipes, householdSize, fridgeItems, checkedMap) {
  const recipeMap = new Map(allRecipes.map((r) => [r.id, r]));
  const aggregated = new Map();

  for (const item of mealPlan) {
    const recipe = recipeMap.get(item.recipe_id);
    if (!recipe) continue;

    const scale = householdSize / (recipe.servings || 1);
    for (const ing of recipe.ingredients) {
      const key = ing.name.toLowerCase().trim();
      const existing = aggregated.get(key);
      const scaledAmount = Number(ing.amount || 0) * scale;
      const scaledPrice = Number(ing.basePrice || 0) * scale;

      if (existing) {
        existing.amount = Number((existing.amount + scaledAmount).toFixed(1));
        existing.estimatedPrice = Number((existing.estimatedPrice + scaledPrice).toFixed(2));
        existing.Occurrences = (existing.Occurrences || 0) + 1;
        existing.occurrences = existing.Occurrences;
        if (!existing.recipesUsed.includes(recipe.title)) {
          existing.recipesUsed.push(recipe.title);
        }
      } else {
        const inFridge = isItemInFridge(ing.name, fridgeItems);
        aggregated.set(key, {
          key,
          name: ing.name,
          amount: Number(scaledAmount.toFixed(1)),
          unit: ing.unit || 'g',
          aisle: ing.aisle || 'Mercearia',
          estimatedPrice: Number(scaledPrice.toFixed(2)),
          inFridge,
          checked: Boolean(checkedMap.get(key)) || inFridge,
          Occurrences: 1,
          occurrences: 1,
          recipesUsed: [recipe.title],
        });
      }
    }
  }

  return Array.from(aggregated.values()).sort(
    (a, b) => a.aisle.localeCompare(b.aisle) || a.name.localeCompare(b.name)
  );
}

/**
 * Validador Anti-SSRF: Bloqueia requisições para IPs privados, loopback ou redes internas
 */
export function isPrivateOrBlockedUrl(rawUrl = '') {
  try {
    const u = new URL(rawUrl);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      return true;
    }
    const host = u.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host === '[::1]' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      host.endsWith('.onion')
    ) {
      return true;
    }
    // Bloqueia faixas privadas e link-local
    if (/^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
    if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
    if (/^169\.254\.\d{1,3}\.\d{1,3}$/.test(host)) return true;

    return false;
  } catch {
    return true;
  }
}

/**
 * Mascara chaves secretas para não vazar credenciais cruas no frontend
 */
function maskSecretKey(key = '') {
  const str = String(key || '').trim();
  if (!str) return '';
  if (str.length <= 8) return '••••••••';
  return str.slice(0, 4) + '••••••••' + str.slice(-4);
}

function getFullState() {
  const user = db.prepare('SELECT * FROM users ORDER BY id ASC LIMIT 1').get();
  const allUsers = db.prepare('SELECT id, name, email, household_code FROM users ORDER BY id ASC').all();
  const recipes = getAllRecipes();
  const mealPlan = db.prepare('SELECT day, slot, recipe_id FROM meal_plans').all();
  const fridgeItems = db.prepare('SELECT id, name, category, amount, unit, last_updated FROM fridge_items ORDER BY name ASC').all();
  const checkedRows = db.prepare('SELECT item_key, checked FROM shopping_state').all();
  const checkedMap = new Map(checkedRows.map((r) => [r.item_key, r.checked === 1]));

  const shoppingList = buildShoppingList(
    mealPlan,
    recipes,
    user.household_size,
    fridgeItems,
    checkedMap
  );

  const grossTotal = shoppingList.reduce((acc, item) => acc + item.estimatedPrice, 0);
  const fridgeSavings = shoppingList
    .filter((item) => item.inFridge)
    .reduce((acc, item) => acc + item.estimatedPrice, 0);
  const netToBuyTotal = Math.max(0, grossTotal - fridgeSavings);
  const marketPrices = getMarketPrices();
  const groceryHistory = getGroceryHistory();
  const suggestionsState = getSuggestionsState(fridgeItems, marketPrices);

  // Proteção de privacidade: mascara chaves de API secretas
  const safeUser = user
    ? {
        ...user,
        has_gemini_key: Boolean(user.gemini_api_key && user.gemini_api_key.trim()),
        has_unsplash_key: Boolean(user.unsplash_access_key && user.unsplash_access_key.trim()),
        gemini_api_key_masked: maskSecretKey(user.gemini_api_key),
        unsplash_access_key_masked: maskSecretKey(user.unsplash_access_key),
        gemini_api_key: '',
        unsplash_access_key: '',
      }
    : null;

  return {
    user: safeUser,
    allUsers,
    recipes,
    mealPlan,
    fridgeItems,
    marketPrices,
    groceryHistory,
    shoppingList,
    suggestions: suggestionsState.suggestions,
    dismissedSuggestionsCount: suggestionsState.dismissedCount,
    lastSuggestionSwipe: suggestionsState.lastSwipe,
    discoveryDate: suggestionsState.discoveryDate,
    tasteProfile: suggestionsState.tasteProfile,
    releaseNotes: RELEASE_NOTES,
    currentVersion: CURRENT_VERSION,
    totals: {
      grossTotal: Number(grossTotal.toFixed(2)),
      fridgeSavings: Number(fridgeSavings.toFixed(2)),
      netToBuyTotal: Number(netToBuyTotal.toFixed(2)),
      budgetRemaining: Number((user.weekly_budget - netToBuyTotal).toFixed(2)),
    },
  };
}

const DAILY_ROTATION_THEMES = [
  {
    title: 'Strogonoff Caseiro de Frango com Batata Palha',
    category: 'Almoço',
    prepTime: 25,
    servings: 3,
    calories: 460,
    protein: 34,
    carbs: 38,
    fat: 18,
    tags: ['Alta Proteína', 'Rápido', 'Econômico'],
    portionWeight: '360g por porção',
    ingredients: [
      { name: 'Peito de frango', amount: 450, unit: 'g', aisle: 'Açougue', basePrice: 9.90 },
      { name: 'Creme de leite', amount: 200, unit: 'g', aisle: 'Mercearia', basePrice: 3.50 },
      { name: 'Molho de tomate', amount: 120, unit: 'g', aisle: 'Mercearia', basePrice: 1.80 },
      { name: 'Arroz branco', amount: 200, unit: 'g', aisle: 'Mercearia', basePrice: 1.50 },
    ],
  },
  {
    title: 'Carne de Panela Desfiada com Mandioca Cozida',
    category: 'Almoço',
    prepTime: 40,
    servings: 3,
    calories: 490,
    protein: 37,
    carbs: 42,
    fat: 19,
    tags: ['Alta Proteína', 'Sem Glúten', 'Sem Lactose'],
    portionWeight: '390g por porção',
    ingredients: [
      { name: 'Carne bovina (acém)', amount: 500, unit: 'g', aisle: 'Açougue', basePrice: 17.50 },
      { name: 'Mandioca descascada', amount: 350, unit: 'g', aisle: 'Hortifruti', basePrice: 2.90 },
      { name: 'Cebola', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 0.90 },
      { name: 'Tomate', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.10 },
    ],
  },
  {
    title: 'Suflê Leve de Legumes com Queijo Gratinado',
    category: 'Jantar',
    prepTime: 30,
    servings: 2,
    calories: 310,
    protein: 18,
    carbs: 22,
    fat: 16,
    tags: ['Vegetariano', 'Econômico'],
    portionWeight: '250g por porção',
    ingredients: [
      { name: 'Cenoura', amount: 150, unit: 'g', aisle: 'Hortifruti', basePrice: 1.20 },
      { name: 'Chuchu ou abobrinha', amount: 150, unit: 'g', aisle: 'Hortifruti', basePrice: 1.30 },
      { name: 'Ovo', amount: 3, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 2.70 },
      { name: 'Queijo muçarela', amount: 80, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 3.90 },
    ],
  },
  {
    title: 'Panqueca Proteica de Espinafre com Frango e Ricota',
    category: 'Jantar',
    prepTime: 25,
    servings: 2,
    calories: 375,
    protein: 33,
    carbs: 28,
    fat: 13,
    tags: ['Alta Proteína', 'Econômico'],
    portionWeight: '310g por porção',
    ingredients: [
      { name: 'Peito de frango', amount: 300, unit: 'g', aisle: 'Açougue', basePrice: 6.90 },
      { name: 'Espinafre ou couve', amount: 80, unit: 'g', aisle: 'Hortifruti', basePrice: 1.80 },
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
      { name: 'Leite integral', amount: 160, unit: 'ml', aisle: 'Laticínios e Ovos', basePrice: 1.10 },
    ],
  },
  {
    title: 'Sanduíche Natural de Frango Cremoso no Pão Integral',
    category: 'Café da Manhã',
    prepTime: 10,
    servings: 2,
    calories: 320,
    protein: 24,
    carbs: 32,
    fat: 10,
    tags: ['Rápido', 'Alta Proteína', 'Econômico'],
    portionWeight: '210g por porção',
    ingredients: [
      { name: 'Pão integral', amount: 120, unit: 'g', aisle: 'Padaria', basePrice: 2.80 },
      { name: 'Peito de frango', amount: 200, unit: 'g', aisle: 'Açougue', basePrice: 4.60 },
      { name: 'Cenoura', amount: 80, unit: 'g', aisle: 'Hortifruti', basePrice: 0.65 },
      { name: 'Requeijão cremoso', amount: 60, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 2.10 },
    ],
  },
  {
    title: 'Omelete Recheado com Queijo Minas e Ervas Finas',
    category: 'Café da Manhã',
    prepTime: 8,
    servings: 1,
    calories: 285,
    protein: 21,
    carbs: 5,
    fat: 19,
    tags: ['Low Carb', 'Sem Glúten', 'Rápido', 'Alta Proteína', 'Vegetariano'],
    portionWeight: '180g por porção',
    ingredients: [
      { name: 'Ovo', amount: 3, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 2.70 },
      { name: 'Queijo minas frescal', amount: 50, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 2.40 },
      { name: 'Tomate', amount: 60, unit: 'g', aisle: 'Hortifruti', basePrice: 0.55 },
    ],
  },
];

let syncingDailyDate = null;

async function syncDailyDiscoveryBatchOncePerDay() {
  const todayKey = getTodayDateKey();
  if (syncingDailyDate === todayKey) return;

  const existingToday = db
    .prepare('SELECT COUNT(*) as count FROM daily_discovered_recipes WHERE date_added = ?')
    .get(todayKey).count;
  if (existingToday > 0) {
    syncingDailyDate = todayKey;
    return;
  }

  syncingDailyDate = todayKey;
  const daySeed = Number(todayKey.replace(/-/g, '')) || 1;
  const vaultPool = ROBUST_RECIPE_VAULT.length > 0 ? ROBUST_RECIPE_VAULT : DAILY_ROTATION_THEMES;
  const idx1 = daySeed % vaultPool.length;
  const idx2 = (daySeed + 7) % vaultPool.length;
  const idx3 = (daySeed + 13) % vaultPool.length;
  const picks = [vaultPool[idx1], vaultPool[idx2], vaultPool[idx3]];

  for (let i = 0; i < picks.length; i++) {
    const item = picks[i];
    const id = `sug-daily-${todayKey}-${i + 1}`;
    const photos = await searchExactDishPhotos(item.title, item.ingredients);
    const recipeObj = {
      id,
      title: item.title,
      category: item.category,
      prepTime: item.prepTime,
      servings: item.servings,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      tags: item.tags,
      image: photos[0] || '/dishes/rec-5.jpg',
      source: `Ficha Técnica — Descoberta do Dia (${todayKey.split('-').reverse().join('/')})`,
      portionWeight: item.portionWeight,
      platingInstructions:
        'Dispor a porção centralizada em prato aquecido garantindo apresentação limpa e finalizar com ervas frescas.',
      specificInstructions:
        'Manter insumos refrigerados a 4°C até o preparo e respeitar as gramaturas do mise en place.',
      ingredients: item.ingredients,
      steps: [
        'Separe e pese todos os insumos conforme a ficha técnica.',
        'Prepare o insumo principal em fogo médio até atingir o ponto ideal.',
        'Finalize a montagem conforme o padrão de serviço e sirva imediatamente.',
      ],
    };

    db.prepare(`
      INSERT OR REPLACE INTO daily_discovered_recipes (id, date_added, recipe_json)
      VALUES (?, ?, ?)
    `).run(id, todayKey, JSON.stringify(recipeObj));
  }
}

export async function startServer(options = {}) {
  initDb();
  syncDailyDiscoveryBatchOncePerDay().catch(() => {});

  const {
    port = process.env.PORT || 3000,
    isPackaged = false,
    distPath = path.join(__dirname, '..', 'dist'),
    appVersion = CURRENT_VERSION,
    sessionToken = process.env.NEATEAT_SESSION_TOKEN || '',
  } = options;

  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // ============================================================================
  // MIDDLEWARE DE SEGURANÇA: CABEÇALHOS HTTP E ANTI-CSRF / SESSION TOKEN
  // ============================================================================
  app.use((req, res, next) => {
    // Cabeçalhos de Segurança Padrão
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self' http://127.0.0.1:* ws://127.0.0.1:*; img-src 'self' data: blob: http://127.0.0.1:* https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' http://127.0.0.1:* ws://127.0.0.1:*; script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
    );

    // Validação de Token Secreto de Sessão em rotas /api/* (Anti-CSRF / Navegadores Externos)
    if (sessionToken && req.path.startsWith('/api')) {
      const clientToken = req.headers['x-neateat-token'] || req.query.token;
      if (clientToken !== sessionToken) {
        return res.status(403).json({
          error: 'Acesso não autorizado. Token de sessão de segurança ausente ou inválido.',
        });
      }
    }
    next();
  });

  app.use('/cache/step-images', express.static(CACHE_DIR, { maxAge: '7d' }));

  app.get('/api/state', (_req, res) => {
    syncDailyDiscoveryBatchOncePerDay().catch(() => {});
    res.json({
      ...getFullState(),
      currentVersion: appVersion || CURRENT_VERSION,
    });
  });

  app.get('/api/recipes/search-image', async (req, res) => {
    const q = String(req.query.q || '').trim();
    if (!q) return res.json({ images: [] });
    const images = await searchExactDishPhotos(q);
    res.json({ images });
  });

  // PROXY DE IMAGENS COM VALIDAÇÃO ANTI-SSRF E MIME-TYPE ESTREITO
  app.get('/api/image-proxy', async (req, res) => {
    const targetUrl = String(req.query.url || '').trim();
    if (!targetUrl || isPrivateOrBlockedUrl(targetUrl)) {
      return res.redirect('/dishes/rec-5.jpg');
    }
    try {
      const urlObj = new URL(targetUrl);
      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      };
      if (urlObj.hostname.includes('receiteria')) {
        headers['Referer'] = 'https://www.receiteria.com.br/';
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const upstream = await fetch(targetUrl, { headers, signal: controller.signal });
      clearTimeout(timeoutId);

      if (!upstream.ok) {
        return res.redirect('/dishes/rec-5.jpg');
      }

      const contentType = (upstream.headers.get('content-type') || '').toLowerCase();
      const allowedImageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
      const isValidImage = allowedImageMimes.some((m) => contentType.includes(m));
      if (!isValidImage) {
        return res.redirect('/dishes/rec-5.jpg');
      }

      const buf = Buffer.from(await upstream.arrayBuffer());
      res.setHeader('Content-Type', contentType.split(';')[0]);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.send(buf);
    } catch {
      res.redirect('/dishes/rec-5.jpg');
    }
  });

  // OPEN FOOD FACTS (CONSULTA DE RÓTULOS, MARCAS E CÓDIGO DE BARRAS)
  app.get('/api/open-food-facts/search', async (req, res) => {
    const q = String(req.query.q || '').trim();
    if (!q) return res.json({ products: [] });
    const products = await searchOpenFoodFacts(q);
    res.json({ products });
  });

  // UNSPLASH & FOTOGRAFIA CULINÁRIA PROFISSIONAL EM ALTA RESOLUÇÃO
  app.get('/api/recipes/search-food-photos', async (req, res) => {
    const q = String(req.query.q || '').trim();
    if (!q) return res.json({ photos: [] });
    const userRow = db.prepare('SELECT unsplash_access_key FROM users ORDER BY id ASC LIMIT 1').get();
    const unsplashKey = userRow?.unsplash_access_key || process.env.UNSPLASH_ACCESS_KEY;
    const photos = await searchHighResDishPhotos(q, unsplashKey);
    res.json({ photos });
  });

  // BASE NUTRICIONAL BRASILEIRA OFICIAL (TACO / TBCA)
  app.post('/api/nutrition/calculate', (req, res) => {
    const { ingredients = [], servings = 1 } = req.body;
    const nutrition = calculateRecipeNutritionTaco(ingredients, servings);
    res.json(nutrition);
  });

  // CONFIGURAÇÃO DE CHAVES DE API DO USUÁRIO (GEMINI E UNSPLASH) COM PROTEÇÃO DE PRIVACIDADE
  app.put('/api/user/api-keys', (req, res) => {
    const { gemini_api_key, unsplash_access_key } = req.body;
    const user = db.prepare('SELECT id, gemini_api_key, unsplash_access_key FROM users ORDER BY id ASC LIMIT 1').get();
    if (user) {
      let nextGemini = user.gemini_api_key;
      let nextUnsplash = user.unsplash_access_key;

      if (gemini_api_key !== undefined) {
        const val = String(gemini_api_key).trim();
        if (val === '__CLEAR__') {
          nextGemini = '';
        } else if (val && !val.includes('•') && !val.includes('*')) {
          nextGemini = val;
        }
      }

      if (unsplash_access_key !== undefined) {
        const val = String(unsplash_access_key).trim();
        if (val === '__CLEAR__') {
          nextUnsplash = '';
        } else if (val && !val.includes('•') && !val.includes('*')) {
          nextUnsplash = val;
        }
      }

      db.prepare(`
        UPDATE users
        SET gemini_api_key = ?, unsplash_access_key = ?
        WHERE id = ?
      `).run(nextGemini, nextUnsplash, user.id);
    }
    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  // TINDER-STYLE SUGGESTION SWIPE (LEFT = PASS, RIGHT = ADD TO CATALOG)
  app.post('/api/suggestions/swipe', (req, res) => {
    const { suggestion, direction } = req.body;
    if (!suggestion || !suggestion.id || !['left', 'right'].includes(direction)) {
      return res.status(400).json({ error: 'Dados de swipe inválidos.' });
    }

    db.prepare(`
      INSERT INTO suggestion_swipes (suggestion_id, action, recipe_json, swiped_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(suggestion_id) DO UPDATE SET
        action = excluded.action,
        recipe_json = excluded.recipe_json,
        swiped_at = CURRENT_TIMESTAMP
    `).run(suggestion.id, direction, JSON.stringify(suggestion));

    if (direction === 'right') {
      db.prepare(`
        INSERT OR REPLACE INTO recipes (
          id, title, category, prep_time, servings, calories, protein, carbs, fat,
          tags_json, image, source, ingredients_json, steps_json,
          portion_weight, plating_instructions, specific_instructions
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        suggestion.id,
        suggestion.title,
        suggestion.category || 'Almoço',
        Number(suggestion.prepTime) || 20,
        Math.max(1, Number(suggestion.servings) || 1),
        Number(suggestion.calories) || 0,
        Number(suggestion.protein) || 0,
        Number(suggestion.carbs) || 0,
        Number(suggestion.fat) || 0,
        JSON.stringify(Array.isArray(suggestion.tags) ? suggestion.tags : ['Econômico']),
        suggestion.image,
        suggestion.source || 'Ficha Técnica — Sugestão Aprovada',
        JSON.stringify(suggestion.ingredients || []),
        JSON.stringify(suggestion.steps || []),
        suggestion.portionWeight || '350g por porção',
        suggestion.platingInstructions || 'Servir em prato aquecido com montagem centralizada.',
        suggestion.specificInstructions || 'Respeitar as gramaturas e temperaturas da ficha técnica.'
      );
    }

    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  // UNDO LAST SUGGESTION SWIPE
  app.post('/api/suggestions/undo', (_req, res) => {
    const lastRow = db.prepare('SELECT * FROM suggestion_swipes ORDER BY id DESC LIMIT 1').get();
    if (lastRow) {
      db.prepare('DELETE FROM suggestion_swipes WHERE id = ?').run(lastRow.id);
      if (lastRow.action === 'right') {
        db.prepare('DELETE FROM recipes WHERE id = ?').run(lastRow.suggestion_id);
      }
    }
    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  // RESET DISMISSED SUGGESTIONS (REVER DESCARTADAS)
  app.post('/api/suggestions/reset-dismissed', (_req, res) => {
    db.prepare("DELETE FROM suggestion_swipes WHERE action = 'left'").run();
    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  app.post('/api/changelog/seen', (req, res) => {
    const version = req.body.version || appVersion || CURRENT_VERSION;
    const current = db.prepare('SELECT * FROM users ORDER BY id ASC LIMIT 1').get();
    db.prepare('UPDATE users SET last_seen_version = ? WHERE id = ?').run(version, current.id);
    res.json({
      ...getFullState(),
      currentVersion: appVersion || CURRENT_VERSION,
    });
  });

  app.post('/api/profile', (req, res) => {
    const { weekly_budget, dietary_filter, household_size, name } = req.body;
    const current = db.prepare('SELECT * FROM users ORDER BY id ASC LIMIT 1').get();

    db.prepare(`
      UPDATE users
      SET weekly_budget = ?,
          dietary_filter = ?,
          household_size = ?,
          name = ?
      WHERE id = ?
    `).run(
      weekly_budget ?? current.weekly_budget,
      dietary_filter ?? current.dietary_filter,
      household_size ?? current.household_size,
      name ?? current.name,
      current.id
    );

    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  app.post('/api/plan/generate', (req, res) => {
    const current = db.prepare('SELECT * FROM users ORDER BY id ASC LIMIT 1').get();
    const budget = req.body.weekly_budget ?? current.weekly_budget;
    const diet = req.body.dietary_filter ?? current.dietary_filter;
    const size = req.body.household_size ?? current.household_size;

    db.prepare(`
      UPDATE users
      SET weekly_budget = ?, dietary_filter = ?, household_size = ?
      WHERE id = ?
    `).run(budget, diet, size, current.id);

    generateSmartMealPlan(Number(budget), diet, Number(size));
    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  app.post('/api/plan/slot', (req, res) => {
    const { day, slot, recipe_id } = req.body;
    db.prepare(`
      INSERT INTO meal_plans (day, slot, recipe_id)
      VALUES (?, ?, ?)
      ON CONFLICT(day, slot) DO UPDATE SET recipe_id = excluded.recipe_id
    `).run(day, slot, recipe_id);

    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  // ADICIONAR OU INCREMENTAR ITEM NA GELADEIRA (EX: DO OPEN FOOD FACTS OU FORMULÁRIO)
  app.post('/api/fridge', (req, res) => {
    const { name, category = 'Mercearia', amount = 1, unit = 'un' } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Nome inválido' });
    const trimmed = name.trim();
    const numAmount = Math.max(0.1, Number(amount) || 1);
    const trimmedUnit = String(unit || 'un').trim();
    const existing = db.prepare('SELECT id, amount FROM fridge_items WHERE LOWER(name) = LOWER(?)').get(trimmed);

    if (existing) {
      db.prepare(`
        UPDATE fridge_items
        SET amount = ROUND(amount + ?, 2),
            unit = ?,
            last_updated = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(numAmount, trimmedUnit, existing.id);
    } else {
      db.prepare(`
        INSERT INTO fridge_items (name, category, amount, unit, last_updated)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(trimmed, category, numAmount, trimmedUnit);
    }

    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  app.post('/api/fridge/toggle', (req, res) => {
    const { name, category = 'Mercearia' } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Nome inválido' });
    const trimmed = name.trim();
    const existing = db.prepare('SELECT id FROM fridge_items WHERE LOWER(name) = LOWER(?)').get(trimmed);

    if (existing) {
      db.prepare('DELETE FROM fridge_items WHERE id = ?').run(existing.id);
    } else {
      db.prepare('INSERT INTO fridge_items (name, category) VALUES (?, ?)').run(trimmed, category);
    }

    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  app.post('/api/fridge/clear', (_req, res) => {
    db.prepare('DELETE FROM fridge_items').run();
    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  app.post('/api/shopping/toggle', (req, res) => {
    const { itemKey } = req.body;
    const existing = db.prepare('SELECT checked FROM shopping_state WHERE item_key = ?').get(itemKey);
    const nextVal = existing && existing.checked === 1 ? 0 : 1;
    db.prepare(`
      INSERT INTO shopping_state (item_key, checked)
      VALUES (?, ?)
      ON CONFLICT(item_key) DO UPDATE SET checked = excluded.checked
    `).run(itemKey, nextVal);

    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  // ============================================================================
  // ENDPOINTS DE NOTA FISCAL (SEFAZ / NFC-e) & CALIBRAGEM DE PREÇOS
  // ============================================================================

  // 1. Processar URL / HTML / Texto ou Demonstração da SEFAZ
  app.post('/api/sefaz/parse', async (req, res) => {
    try {
      const { url, html, rawText, isDemo } = req.body;

      let invoice;
      if (isDemo) {
        invoice = getDemoSefazInvoice();
      } else if (url && url.trim()) {
        const cleanUrl = url.trim();
        if (isPrivateOrBlockedUrl(cleanUrl)) {
          return res.status(400).json({ error: 'URL da nota fiscal bloqueada por motivos de segurança (endereço local ou privado).' });
        }
        invoice = await parseSefazUrl(cleanUrl);
      } else if (html && html.trim()) {
        invoice = parseSefazHtml(html.trim());
      } else if (rawText && rawText.trim()) {
        const trimmed = rawText.trim();
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
          if (isPrivateOrBlockedUrl(trimmed)) {
            return res.status(400).json({ error: 'URL da nota fiscal bloqueada por motivos de segurança (endereço local ou privado).' });
          }
          invoice = await parseSefazUrl(trimmed);
        } else if (trimmed.startsWith('<html') || trimmed.startsWith('<!DOCTYPE') || (trimmed.includes('<span') && trimmed.includes('</span>')) || trimmed.includes('<tr')) {
          invoice = parseSefazHtml(trimmed);
        } else {
          invoice = parseSefazText(trimmed);
        }
      } else {
        return res.status(400).json({ error: 'Nenhum dado fornecido (informe URL, HTML ou Texto da nota fiscal).' });
      }

      res.json({
        success: true,
        invoice,
        canonicalIngredients: CANONICAL_INGREDIENTS,
      });
    } catch (err) {
      console.error('Erro ao processar nota fiscal:', err);
      res.status(500).json({ error: err.message || 'Erro ao processar cupom fiscal' });
    }
  });

  // 2. Confirmar Nota: Calibrar Preços + Abastecer Geladeira + Baixar Compras
  app.post('/api/sefaz/confirm', (req, res) => {
    try {
      const { supermarket, purchaseDate, totalValue, items = [] } = req.body;
      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Nenhum item para confirmar.' });
      }

      // Salva nota no histórico
      const invoiceId = saveGroceryInvoice({ supermarket, purchaseDate, totalValue, items });

      // Calibra preços médios dos insumos
      const calibratedCount = calibrateMarketPrices(items, supermarket);

      // Abastece a geladeira com quantidades reais
      const stockedCount = stockFridgeFromInvoice(items);

      // Dá baixa na lista de compras para os insumos alimentícios estocados
      const markShopping = db.prepare(`
        INSERT INTO shopping_state (item_key, checked)
        VALUES (?, 1)
        ON CONFLICT(item_key) DO UPDATE SET checked = 1
      `);
      for (const it of items) {
        if (it.stockInFridge && it.matchedKey) {
          markShopping.run(it.matchedKey);
        }
      }

      res.json({
        success: true,
        invoiceId,
        calibratedCount,
        stockedCount,
        ...getFullState(),
        currentVersion: appVersion || CURRENT_VERSION,
      });
    } catch (err) {
      console.error('Erro ao confirmar nota fiscal:', err);
      res.status(500).json({ error: err.message || 'Erro ao confirmar calibragem' });
    }
  });

  // 3. Obter Histórico de Cupons Fiscais
  app.get('/api/sefaz/history', (_req, res) => {
    res.json({ history: getGroceryHistory() });
  });

  // 4. Obter Preços Médios Calibrados de Mercado
  app.get('/api/market-prices', (_req, res) => {
    res.json({ prices: getMarketPrices() });
  });

  // 5. Ajustar Preço Médio Manualmente
  app.put('/api/market-prices/:key', (req, res) => {
    const { key } = req.params;
    const { price, supermarket } = req.body;
    const numPrice = Number(price);
    if (!key || isNaN(numPrice) || numPrice <= 0) {
      return res.status(400).json({ error: 'Preço inválido para o insumo.' });
    }
    const updatedPrices = updateMarketPrice(key, numPrice, supermarket || 'Ajuste Manual do Usuário');
    res.json({
      success: true,
      message: 'Preço do insumo atualizado e fichas técnicas recalculadas.',
      prices: updatedPrices,
      fullState: getFullState(),
    });
  });

  // 6. Forçar Recálculo de Custos em Lote
  app.post('/api/market-prices/recalculate', (_req, res) => {
    try {
      recalcRecipesCost();
      res.json({
        success: true,
        message: 'Todas as fichas técnicas foram recalculadas com os preços médios mais recentes.',
        fullState: getFullState(),
      });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao recalcular custos: ' + err.message });
    }
  });

  // CREATE NEW RECIPE (FICHA TÉCNICA DE RESTAURANTE)
  app.post('/api/recipes', async (req, res) => {
    const {
      title,
      category = 'Almoço',
      prepTime = 20,
      servings = 2,
      calories = 420,
      protein = 25,
      carbs = 40,
      fat = 14,
      tags = ['Econômico'],
      image = '',
      source = 'Ficha Técnica Própria',
      portionWeight = '350g por porção',
      platingInstructions = '',
      specificInstructions = '',
      ingredients = [],
      steps = [],
      sections = [],
      stepDetails = [],
      chefTips = {},
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'O nome do prato é obrigatório.' });
    }

    let finalImage = image ? image.trim() : '';
    if (!finalImage) {
      const foundPhotos = await searchExactDishPhotos(title.trim(), ingredients);
      finalImage = foundPhotos[0];
    }

    const id = 'rec-ft-' + Date.now();
    const validIngredients = Array.isArray(ingredients) && ingredients.length > 0
      ? ingredients.map((ing) => ({
          name: String(ing.name || 'Ingrediente').trim(),
          amount: Number(ing.amount) || 100,
          unit: String(ing.unit || 'g').trim(),
          aisle: String(ing.aisle || 'Mercearia').trim(),
          basePrice: Number(ing.basePrice) || 1.0,
        }))
      : [{ name: 'Ingrediente principal', amount: 200, unit: 'g', aisle: 'Mercearia', basePrice: 5.0 }];

    const validSteps = Array.isArray(steps) && steps.length > 0
      ? steps.map((s) => String(s).trim()).filter(Boolean)
      : ['Prepare os insumos conforme a ficha técnica e finalize o prato.'];

    const finalStepDetails = await ensureRecipeStepDetails(
      title.trim(),
      validSteps,
      validIngredients,
      stepDetails,
      finalImage
    );

    const finalTags = Array.isArray(tags) ? [...tags] : ['Econômico'];
    if (!finalTags.includes('Passo a Passo com Fotos')) {
      finalTags.push('Passo a Passo com Fotos');
    }

    db.prepare(`
      INSERT INTO recipes (
        id, title, category, prep_time, servings, calories, protein, carbs, fat,
        tags_json, image, source, ingredients_json, steps_json,
        portion_weight, plating_instructions, specific_instructions,
        sections_json, step_details_json, chef_tips_json
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title.trim(),
      category,
      Number(prepTime) || 20,
      Math.max(1, Number(servings) || 1),
      Number(calories) || 0,
      Number(protein) || 0,
      Number(carbs) || 0,
      Number(fat) || 0,
      JSON.stringify(finalTags),
      finalImage,
      source || 'Ficha Técnica Própria',
      JSON.stringify(validIngredients),
      JSON.stringify(validSteps),
      portionWeight || '350g por porção',
      platingInstructions || 'Servir em prato aquecido com montagem centralizada.',
      specificInstructions || 'Respeitar as gramaturas e temperaturas da ficha técnica.',
      JSON.stringify(Array.isArray(sections) ? sections : []),
      JSON.stringify(finalStepDetails),
      JSON.stringify(typeof chefTips === 'object' && chefTips !== null ? chefTips : {})
    );

    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  // UPDATE EXISTING RECIPE (FICHA TÉCNICA DE RESTAURANTE)
  app.put('/api/recipes/:id', async (req, res) => {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Receita não encontrada.' });
    }

    const {
      title,
      category,
      prepTime,
      servings,
      calories,
      protein,
      carbs,
      fat,
      tags,
      image,
      source,
      portionWeight,
      platingInstructions,
      specificInstructions,
      ingredients,
      steps,
      sections,
      stepDetails,
      chefTips,
    } = req.body;

    const nextTitle = title ? title.trim() : existing.title;
    const nextIngredients = Array.isArray(ingredients)
      ? ingredients.map((ing) => ({
          name: String(ing.name || 'Ingrediente').trim(),
          amount: Number(ing.amount) || 0,
          unit: String(ing.unit || 'g').trim(),
          aisle: String(ing.aisle || 'Mercearia').trim(),
          basePrice: Number(ing.basePrice) || 0,
        }))
      : JSON.parse(existing.ingredients_json);

    let finalImage = image !== undefined ? String(image).trim() : existing.image;
    if (!finalImage) {
      const foundPhotos = await searchExactDishPhotos(nextTitle, nextIngredients);
      finalImage = foundPhotos[0];
    }

    const nextSteps = Array.isArray(steps)
      ? steps.map((s) => String(s).trim()).filter(Boolean)
      : JSON.parse(existing.steps_json);

    const finalStepDetails = await ensureRecipeStepDetails(
      nextTitle,
      nextSteps,
      nextIngredients,
      stepDetails,
      finalImage
    );

    const finalTags = Array.isArray(tags) ? [...tags] : JSON.parse(existing.tags_json);
    if (!finalTags.includes('Passo a Passo com Fotos')) {
      finalTags.push('Passo a Passo com Fotos');
    }

    db.prepare(`
      UPDATE recipes
      SET title = ?,
          category = ?,
          prep_time = ?,
          servings = ?,
          calories = ?,
          protein = ?,
          carbs = ?,
          fat = ?,
          tags_json = ?,
          image = ?,
          source = ?,
          ingredients_json = ?,
          steps_json = ?,
          portion_weight = ?,
          plating_instructions = ?,
          specific_instructions = ?,
          sections_json = ?,
          step_details_json = ?,
          chef_tips_json = ?
      WHERE id = ?
    `).run(
      nextTitle,
      category ?? existing.category,
      Number(prepTime ?? existing.prep_time),
      Math.max(1, Number(servings ?? existing.servings)),
      Number(calories ?? existing.calories),
      Number(protein ?? existing.protein),
      Number(carbs ?? existing.carbs),
      Number(fat ?? existing.fat),
      JSON.stringify(finalTags),
      finalImage,
      source ?? existing.source,
      JSON.stringify(nextIngredients),
      JSON.stringify(nextSteps),
      portionWeight ?? existing.portion_weight,
      platingInstructions ?? existing.plating_instructions,
      specificInstructions ?? existing.specific_instructions,
      JSON.stringify(Array.isArray(sections) ? sections : JSON.parse(existing.sections_json || '[]')),
      JSON.stringify(finalStepDetails),
      JSON.stringify(typeof chefTips === 'object' && chefTips !== null ? chefTips : JSON.parse(existing.chef_tips_json || '{}')),
      id
    );

    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  // DELETE RECIPE
  app.delete('/api/recipes/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM recipes WHERE id = ?').run(id);

    // If any meal plan slot used this recipe, replace with another available recipe
    const fallback = db.prepare('SELECT id FROM recipes LIMIT 1').get();
    if (fallback) {
      db.prepare('UPDATE meal_plans SET recipe_id = ? WHERE recipe_id = ?').run(fallback.id, id);
    } else {
      db.prepare('DELETE FROM meal_plans WHERE recipe_id = ?').run(id);
    }

    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  // IMPORT RECIPE VIA DIRECT URL EXCLUSIVELY
  app.post('/api/recipes/import', async (req, res) => {
    const { input, category = 'Almoço' } = req.body;
    if (!input || !input.trim()) {
      return res.status(400).json({ error: 'Informe o link da receita.' });
    }

    const raw = input.trim();
    const isUrl = raw.startsWith('http://') || raw.startsWith('https://');
    if (!isUrl || isPrivateOrBlockedUrl(raw)) {
      return res.status(400).json({
        error:
          'Apenas links públicos válidos são aceitos (iniciando com http:// ou https://). Endereços privados ou locais são bloqueados por segurança.',
      });
    }

    let title = 'Receita Importada';
    let source = 'Web';
    let heroImage = '';
    let pageHtml = '';

    try {
      const urlObj = new URL(raw);
      source = urlObj.hostname.replace('www.', '');
      const slug = urlObj.pathname.split('/').filter(Boolean).pop() || 'receita-especial';
      title = slug
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      // Baixa a página da receita
      const pageRes = await fetch(raw, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      if (pageRes.ok) {
        pageHtml = await pageRes.text();
        const ogTitle = pageHtml.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
        const h1Title = pageHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        const pageTitle = ogTitle ? ogTitle[1] : (h1Title ? h1Title[1].replace(/<[^>]+>/g, '').trim() : null);
        if (pageTitle && pageTitle.length > 3) {
          title = pageTitle.split('|')[0].split('-')[0].trim();
        }
        const ogImageM = pageHtml.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
        if (ogImageM && ogImageM[1]) {
          heroImage = ogImageM[1];
        }
      }
    } catch {
      // continua
    }

    // 1. TENTA EXTRAÇÃO PROFISSIONAL VIA GEMINI API (GOOGLE AI)
    const userSettings = db.prepare('SELECT gemini_api_key, unsplash_access_key FROM users ORDER BY id ASC LIMIT 1').get();
    const geminiKey = userSettings?.gemini_api_key || process.env.GEMINI_API_KEY;

    let geminiResult = null;
    if (pageHtml && geminiKey) {
      geminiResult = await parseRecipeWithGemini(pageHtml, raw, geminiKey);
    }

    let rawIngs = [];
    let importSteps = [];
    let finalCategory = category;
    let prepTime = 25;
    let servings = 2;
    let tags = ['Econômico', 'Rápido', 'Importada', 'Passo a Passo com Fotos'];
    let platingInstructions = '';
    let specificInstructions = '';

    if (geminiResult) {
      title = geminiResult.title || title;
      finalCategory = geminiResult.category || category;
      prepTime = Number(geminiResult.prepTime) || 25;
      servings = Math.max(1, Number(geminiResult.servings) || 2);
      if (Array.isArray(geminiResult.tags) && geminiResult.tags.length > 0) {
        tags = [...new Set([...tags, ...geminiResult.tags])];
      }
      platingInstructions = geminiResult.platingInstructions || '';
      specificInstructions = geminiResult.specificInstructions || '';
      rawIngs = geminiResult.ingredients || [];
      importSteps = geminiResult.steps || [];
    }

    // Fallback de ingredientes se o Gemini não estiver configurado
    if (rawIngs.length === 0) {
      const lower = title.toLowerCase();
      if (lower.includes('frango')) {
        rawIngs.push({ name: 'Peito de frango', amount: 300, unit: 'g', aisle: 'Açougue' });
      }
      if (lower.includes('carne') || lower.includes('bife') || lower.includes('patinho') || lower.includes('bolonhesa')) {
        rawIngs.push({ name: 'Carne moída (acém ou patinho)', amount: 300, unit: 'g', aisle: 'Açougue' });
      }
      if (lower.includes('ovo') || lower.includes('omelete') || lower.includes('panqueca')) {
        rawIngs.push({ name: 'Ovo', amount: 3, unit: 'un', aisle: 'Laticínios e Ovos' });
      }
      if (lower.includes('queijo') || lower.includes('pizza') || lower.includes('lasanha') || lower.includes('gratinado')) {
        rawIngs.push({ name: 'Queijo muçarela', amount: 80, unit: 'g', aisle: 'Laticínios e Ovos' });
      }
      if (lower.includes('macarrão') || lower.includes('pasta') || lower.includes('espaguete')) {
        rawIngs.push({ name: 'Macarrão espaguete ou penne', amount: 200, unit: 'g', aisle: 'Mercearia' });
      }
      if (lower.includes('arroz') || lower.includes('risoto')) {
        rawIngs.push({ name: 'Arroz branco', amount: 150, unit: 'g', aisle: 'Mercearia' });
      }
      if (lower.includes('batata') || lower.includes('nhoque') || lower.includes('purê')) {
        rawIngs.push({ name: 'Batata inglesa', amount: 250, unit: 'g', aisle: 'Hortifruti' });
      }

      if (rawIngs.length === 0) {
        rawIngs.push(
          { name: 'Tomate', amount: 120, unit: 'g', aisle: 'Hortifruti' },
          { name: 'Cebola', amount: 80, unit: 'g', aisle: 'Hortifruti' },
          { name: 'Alho', amount: 10, unit: 'g', aisle: 'Hortifruti' },
          { name: 'Azeite de oliva', amount: 15, unit: 'ml', aisle: 'Mercearia' },
          { name: 'Queijo coalho ou minas', amount: 80, unit: 'g', aisle: 'Laticínios e Ovos' }
        );
      } else {
        rawIngs.push(
          { name: 'Cebola', amount: 60, unit: 'g', aisle: 'Hortifruti' },
          { name: 'Alho', amount: 10, unit: 'g', aisle: 'Hortifruti' },
          { name: 'Azeite de oliva', amount: 10, unit: 'ml', aisle: 'Mercearia' }
        );
      }
    }

    if (importSteps.length === 0) {
      importSteps = [
        'Realize o mise en place pesando e higienizando todos os insumos conforme a ficha técnica.',
        'Aqueça a frigideira ou panela no fogo médio com o azeite e refogue os ingredientes principais até dourarem.',
        'Cozinhe até o ponto ideal, ajuste o sal e os temperos, e finalize a montagem do prato com ervas frescas.'
      ];
    }

    // 2. CALIBRAÇÃO INTELIGENTE DE CUSTOS VIA PREÇOS DE MERCADO
    const currentMarketPrices = getMarketPrices();
    const marketMap = new Map(currentMarketPrices.map((mp) => [mp.ingredient_key, mp]));
    const ingredients = rawIngs.map((ing) => ({
      ...ing,
      basePrice: computeCulinaryPortionCost(ing.name, ing.amount, ing.unit, marketMap),
    }));

    // 3. CÁLCULO NUTRICIONAL BRASILEIRO OFICIAL (TACO / TBCA)
    const tacoNutrition = calculateRecipeNutritionTaco(ingredients, servings);
    const calories = tacoNutrition.perServing.calories || geminiResult?.calories || 420;
    const protein = tacoNutrition.perServing.protein || geminiResult?.protein || 28;
    const carbs = tacoNutrition.perServing.carbs || geminiResult?.carbs || 36;
    const fat = tacoNutrition.perServing.fat || geminiResult?.fat || 14;

    const cleanTitle = title.length > 65 ? title.slice(0, 62) + '...' : title;
    const exactPhotos = await searchExactDishPhotos(cleanTitle, ingredients);
    const finalHero = heroImage
      ? (heroImage.startsWith('/api') || heroImage.startsWith('/dishes') ? heroImage : `/api/image-proxy?url=${encodeURIComponent(heroImage)}`)
      : exactPhotos[0];
    const totalWeightGrams = ingredients.reduce((s, i) => s + (Number(i.amount) || 0), 0);
    const portionWeight = geminiResult?.portionWeight || `${Math.max(180, Math.round(totalWeightGrams / servings))}g por porção`;

    const id = 'rec-custom-' + Date.now();

    const finalStepDetails = await ensureRecipeStepDetails(
      cleanTitle,
      importSteps,
      ingredients,
      [],
      finalHero
    );

    const sections = [
      { name: 'Mise en Place & Pré-preparo', stepRange: [1, 1] },
      { name: 'Cocção & Finalização', stepRange: [2, Math.max(2, importSteps.length)] },
    ];

    const chefTips = {
      intro: `Receita de ${cleanTitle} com ficha técnica calibrada segundo a Tabela Nutricional Brasileira (TACO) e custos médios de mercado.`,
      storage: 'Manter refrigerado em pote hermético de vidro por até 3 dias. Reaquecer em fogo brando.',
      secret: 'O preparo e pesagem prévia dos insumos evita desperdício e garante sabor uniforme.',
    };

    if (!platingInstructions) {
      platingInstructions = `Dispor a porção (${portionWeight}) no centro de um prato aquecido, garantindo volume e altura, e finalizar com ervas frescas e fio de azeite.`;
    }
    if (!specificInstructions) {
      specificInstructions = 'Manter os insumos perecíveis refrigerados a 4°C até o preparo. Consumir em até 48h se mantido refrigerado.';
    }

    db.prepare(`
      INSERT INTO recipes (
        id, title, category, prep_time, servings, calories, protein, carbs, fat,
        tags_json, image, source, ingredients_json, steps_json,
        portion_weight, plating_instructions, specific_instructions,
        sections_json, step_details_json, chef_tips_json
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      cleanTitle,
      finalCategory,
      prepTime,
      servings,
      calories,
      protein,
      carbs,
      fat,
      JSON.stringify(tags),
      finalHero,
      source,
      JSON.stringify(ingredients),
      JSON.stringify(importSteps),
      portionWeight,
      platingInstructions,
      specificInstructions,
      JSON.stringify(sections),
      JSON.stringify(finalStepDetails),
      JSON.stringify(chefTips)
    );

    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, household_code } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Preencha nome e e-mail' });
    }
    const code = household_code?.trim() || `NEAT-BR-${Math.floor(1000 + Math.random() * 9000)}`;
    const current = db.prepare('SELECT * FROM users ORDER BY id ASC LIMIT 1').get();
    db.prepare('UPDATE users SET name = ?, email = ?, household_code = ? WHERE id = ?').run(
      name.trim(),
      email.trim(),
      code,
      current.id
    );
    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  if (isPackaged || process.env.NODE_ENV === 'production') {
    app.use(express.static(distPath));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  return new Promise((resolve) => {
    const server = app.listen(port, '127.0.0.1', () => {
      const actualPort = server.address().port;
      console.log(`NeatEat Brasil server running at http://127.0.0.1:${actualPort}`);
      resolve({ server, port: actualPort });
    });
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  startServer();
}
