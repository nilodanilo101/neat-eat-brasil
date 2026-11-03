import express from 'express';
import path from 'node:path';
import os from 'node:os';
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
  resetMarketPricesToDefault,
  addOrUpsertMarketPrice,
  recalcRecipesCost,
  stockFridgeFromInvoice,
} from './db.js';
import { CURRENT_VERSION, RELEASE_NOTES } from './changelog.js';
import { CACHE_DIR, cacheRecipeImage } from './imageCache.js';
import { renderMobileShoppingPageHtml } from './mobileShoppingHtml.js';
import { parseSefazUrl, parseSefazHtml, parseSefazText, getDemoSefazInvoice } from './sefazParser.js';
import { CANONICAL_INGREDIENTS, computeCulinaryPortionCost } from './ingredientMatcher.js';
import { ROBUST_RECIPE_VAULT, isDishTooSimilarToExisting } from './suggestionEngine.js';
import { runFullCatalogUpgrade } from './fullCatalogUpgrade.js';
import { parseRecipeWithGemini } from './geminiService.js';
import { searchOpenFoodFacts } from './openFoodFactsService.js';
import { searchHighResDishPhotos } from './foodImageService.js';
import { calculateRecipeNutritionTaco, findTacoNutrition } from './tacoDatabase.js';
import { extractRecipeFromHtml, extractStepTimerSeconds } from './recipeWebScraper.js';
import { diversifyRecipeStepPhotos, resolveAccurateDishImage } from './stepPhotoMapper.js';
import { CULINARY_MANUAL, areCulinaryIngredientsEquivalent, enrichStepWithCulinaryWisdom } from './culinaryKnowledgeEngine.js';

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
  const accurateDishImage = resolveAccurateDishImage('', title, dishImage);
  let photoPool = [];
  try {
    const found = await searchExactDishPhotos(title, ingredients);
    if (Array.isArray(found) && found.length > 0) {
      photoPool.push(...found);
    }
  } catch {
    // fallback
  }
  if (accurateDishImage) photoPool.push(accurateDishImage);

  const uniquePool = Array.from(new Set(photoPool.filter(Boolean)));
  let baseDetails = Array.isArray(providedStepDetails) ? providedStepDetails : [];

  if (uniquePool.length >= 2 && baseDetails.length === 0) {
    baseDetails = (steps || []).map((_, i) => ({
      image: uniquePool[i % uniquePool.length],
    }));
  }

  return diversifyRecipeStepPhotos(
    steps,
    baseDetails,
    accurateDishImage || uniquePool[0] || '/dishes/rec-5.jpg',
    '',
    title
  );
}

function isItemInFridge(ingName, fridgeItems) {
  if (!ingName || !Array.isArray(fridgeItems)) return false;
  const target = (ingName || '').toLowerCase().trim();
  for (const f of fridgeItems) {
    if (areCulinaryIngredientsEquivalent(ingName, f.name)) return true;
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
    culinaryManual: CULINARY_MANUAL,
    totals: {
      grossTotal: Number(grossTotal.toFixed(2)),
      fridgeSavings: Number(fridgeSavings.toFixed(2)),
      netToBuyTotal: Number(netToBuyTotal.toFixed(2)),
      budgetRemaining: Number((user.weekly_budget - netToBuyTotal).toFixed(2)),
    },
  };
}

let syncingDailyDate = null;

async function syncDailyDiscoveryBatchOncePerDay() {
  const todayKey = getTodayDateKey();
  if (syncingDailyDate === todayKey) return;

  const existingToday = db
    .prepare('SELECT COUNT(*) as count FROM daily_discovered_recipes WHERE date_added = ?')
    .get(todayKey).count;
  if (existingToday >= 5) {
    syncingDailyDate = todayKey;
    return;
  }

  syncingDailyDate = todayKey;
  const daySeed = Number(todayKey.replace(/-/g, '')) || 1;
  const vaultPool = ROBUST_RECIPE_VAULT;
  const existingRecipes = getAllRecipes();
  const catalogTitles = existingRecipes.map((r) => r.title);

  const picks = [];
  for (let offset = 0; offset < vaultPool.length && picks.length < 6; offset++) {
    const candidate = vaultPool[(daySeed + offset * 7) % vaultPool.length];
    if (
      !isDishTooSimilarToExisting(candidate.title, catalogTitles) &&
      !isDishTooSimilarToExisting(candidate.title, picks.map((p) => p.title))
    ) {
      picks.push(candidate);
    }
  }

  for (let i = 0; i < picks.length; i++) {
    const item = picks[i];
    const id = `sug-daily-${todayKey}-${i + 1}`;
    const heroImage = item.image || '/dishes/rec-5.jpg';

    const finalStepDetails = await ensureRecipeStepDetails(
      item.title,
      item.steps,
      item.ingredients,
      item.stepDetails || [],
      heroImage
    );

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
      image: heroImage,
      source: `Ficha Técnica — Descoberta do Dia (${todayKey.split('-').reverse().join('/')})`,
      portionWeight: item.portionWeight || '320g por porção',
      platingInstructions:
        item.platingInstructions ||
        'Dispor a porção centralizada em prato aquecido garantindo apresentação limpa e finalizar com ervas frescas.',
      specificInstructions:
        item.specificInstructions ||
        'Manter insumos refrigerados a 4°C até o preparo e respeitar as gramaturas do mise en place.',
      ingredients: item.ingredients,
      steps: item.steps,
      stepDetails: finalStepDetails,
      sections: item.sections || [
        { name: 'Mise en Place & Pré-preparo', stepRange: [1, 2] },
        { name: 'Preparo & Cocção', stepRange: [3, Math.max(3, item.steps.length)] },
      ],
      chefTips: item.chefTips || {
        intro: `Ficha técnica padronizada de ${item.title}.`,
        storage: 'Manter refrigerado por até 3 dias em pote hermeticamente fechado.',
        secret: 'O controle atento da temperatura do fogo preserva a umidade dos insumos.',
      },
    };

    db.prepare(`
      INSERT OR REPLACE INTO daily_discovered_recipes (id, date_added, recipe_json)
      VALUES (?, ?, ?)
    `).run(id, todayKey, JSON.stringify(recipeObj));
  }
}

export function getLocalIpAddress() {
  try {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
  } catch {}
  return '127.0.0.1';
}

export async function startServer(options = {}) {
  initDb();
  try {
    const dbPath = path.join(process.env.NEATEAT_DATA_DIR || __dirname, 'neateat.sqlite');
    runFullCatalogUpgrade(dbPath);
  } catch (err) {
    console.warn('Aviso no auto-upgrade de catálogo:', err.message);
  }
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
    // Permite carregamento de tags <img> estáticas e proxy de mídia
    if (sessionToken && req.path.startsWith('/api') && req.path !== '/api/image-proxy') {
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

  app.get('/api/mobile-info', (req, res) => {
    const ip = getLocalIpAddress();
    const actualPort = req.socket.localPort || port;
    const tokenQuery = sessionToken ? `?token=${encodeURIComponent(sessionToken)}` : '';
    res.json({
      localIp: ip,
      port: actualPort,
      mobileUrl: `http://${ip}:${actualPort}/mercado${tokenQuery}`,
      sessionToken: sessionToken || '',
    });
  });

  app.get('/mercado', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderMobileShoppingPageHtml());
  });

  app.get('/api/state', (_req, res) => {
    syncDailyDiscoveryBatchOncePerDay().catch(() => {});
    res.json({
      ...getFullState(),
      currentVersion: appVersion || CURRENT_VERSION,
    });
  });

  app.get('/api/culinary-manual', (_req, res) => {
    res.json(CULINARY_MANUAL);
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
      return res.status(404).end();
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
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const upstream = await fetch(targetUrl, { headers, signal: controller.signal, redirect: 'follow' });
      clearTimeout(timeoutId);

      if (!upstream.ok) {
        return res.status(404).end();
      }

      const contentType = (upstream.headers.get('content-type') || '').toLowerCase();
      const allowedImageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
      const isValidImage = allowedImageMimes.some((m) => contentType.includes(m));
      if (!isValidImage) {
        return res.status(404).end();
      }

      const buf = Buffer.from(await upstream.arrayBuffer());
      res.setHeader('Content-Type', contentType.split(';')[0]);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.send(buf);
    } catch {
      res.status(404).end();
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
    let suggestion = req.body.suggestion || req.body.recipe;
    let direction = req.body.direction;
    if (!direction && req.body.action) {
      direction = req.body.action === 'like' ? 'right' : req.body.action === 'dismiss' ? 'left' : req.body.action;
    }
    const sugId = suggestion?.id || req.body.suggestionId;
    if (!suggestion && sugId) {
      suggestion = ROBUST_RECIPE_VAULT.find((v) => v.id === sugId);
    }
    if (!suggestion || !sugId || !['left', 'right'].includes(direction)) {
      return res.status(400).json({ error: 'Dados de swipe inválidos.' });
    }

    db.prepare(`
      INSERT INTO suggestion_swipes (suggestion_id, action, recipe_json, swiped_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(suggestion_id) DO UPDATE SET
        action = excluded.action,
        recipe_json = excluded.recipe_json,
        swiped_at = CURRENT_TIMESTAMP
    `).run(sugId, direction, JSON.stringify(suggestion));

    suggestion.image = resolveAccurateDishImage(sugId, suggestion.title, suggestion.image);

    if (direction === 'right') {
      const stepDetailsJson = JSON.stringify(
        diversifyRecipeStepPhotos(
          suggestion.steps || [],
          suggestion.stepDetails || [],
          suggestion.image,
          suggestion.id || sugId,
          suggestion.title
        )
      );
      const sectionsJson = JSON.stringify(
        suggestion.sections || [
          { name: 'Mise en Place & Pré-preparo', stepRange: [1, 2] },
          { name: 'Preparo & Cocção', stepRange: [3, Math.max(3, (suggestion.steps || []).length)] },
        ]
      );
      const chefTipsJson = JSON.stringify(
        suggestion.chefTips || {
          intro: `Ficha técnica padronizada de ${suggestion.title}.`,
          storage: 'Armazenar sob refrigeração por até 3 dias em pote vedado.',
          secret: 'Respeitar a temperatura do fogo e a ordem do mise en place.',
        }
      );

      db.prepare(`
        INSERT OR REPLACE INTO recipes (
          id, title, category, prep_time, servings, calories, protein, carbs, fat,
          tags_json, image, source, ingredients_json, steps_json,
          portion_weight, plating_instructions, specific_instructions,
          sections_json, step_details_json, chef_tips_json
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        suggestion.specificInstructions || 'Respeitar as gramaturas e temperaturas da ficha técnica.',
        sectionsJson,
        stepDetailsJson,
        chefTipsJson
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
    const {
      weekly_budget,
      dietary_filter,
      household_size,
      name,
      cooking_strategy,
      prioritize_fridge,
    } = req.body;
    const current = db.prepare('SELECT * FROM users ORDER BY id ASC LIMIT 1').get();

    db.prepare(`
      UPDATE users
      SET weekly_budget = ?,
          dietary_filter = ?,
          household_size = ?,
          name = ?,
          cooking_strategy = ?,
          prioritize_fridge = ?
      WHERE id = ?
    `).run(
      weekly_budget ?? current.weekly_budget,
      dietary_filter ?? current.dietary_filter,
      household_size ?? current.household_size,
      name ?? current.name,
      cooking_strategy ?? current.cooking_strategy ?? 'varied',
      prioritize_fridge !== undefined ? (prioritize_fridge ? 1 : 0) : (current.prioritize_fridge ?? 0),
      current.id
    );

    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  app.post('/api/plan/generate', (req, res) => {
    const current = db.prepare('SELECT * FROM users ORDER BY id ASC LIMIT 1').get();
    const budget = req.body.weekly_budget ?? req.body.budget ?? current?.weekly_budget ?? 300;
    const diet = req.body.dietary_filter ?? req.body.preference ?? req.body.diet ?? current?.dietary_filter ?? 'Todas';
    const size = req.body.household_size ?? req.body.householdSize ?? current?.household_size ?? 2;
    const strategy = req.body.cooking_strategy ?? req.body.cookingStrategy ?? current?.cooking_strategy ?? 'varied';
    const fridge = req.body.prioritize_fridge ?? req.body.prioritizeFridge ?? Boolean(current?.prioritize_fridge);

    if (current) {
      db.prepare(`
        UPDATE users
        SET weekly_budget = ?, dietary_filter = ?, household_size = ?, cooking_strategy = ?, prioritize_fridge = ?
        WHERE id = ?
      `).run(Number(budget), String(diet), Number(size), String(strategy), fridge ? 1 : 0, current.id);
    }

    generateSmartMealPlan(Number(budget), String(diet), Number(size), String(strategy), Boolean(fridge));
    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  app.post('/api/plan/slot', (req, res) => {
    const day = req.body.day;
    const slot = req.body.slot;
    const recipe_id = req.body.recipe_id || req.body.recipeId;

    if (!day || !slot || !recipe_id) {
      return res.status(400).json({ error: 'Parâmetros inválidos: day, slot e recipe_id são obrigatórios.' });
    }

    const recipeExists = db.prepare('SELECT id FROM recipes WHERE id = ?').get(recipe_id);
    if (!recipeExists) {
      return res.status(404).json({ error: `Receita com ID "${recipe_id}" não encontrada no catálogo.` });
    }

    db.prepare(`
      INSERT INTO meal_plans (day, slot, recipe_id)
      VALUES (?, ?, ?)
      ON CONFLICT(day, slot) DO UPDATE SET recipe_id = excluded.recipe_id
    `).run(day, slot, recipe_id);

    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  });

  // ADICIONAR OU INCREMENTAR ITEM NA GELADEIRA / INGREDIENTES
  const postFridgeHandler = (req, res) => {
    const { name, category = 'Mercearia', amount = 1, unit = 'un' } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Nome inválido' });
    const trimmed = name.trim();
    const numAmount = Math.max(0.01, Number(amount) || 1);
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
  };
  app.post('/api/fridge', postFridgeHandler);
  app.post('/api/ingredients', postFridgeHandler);

  // EDITAR QUANTIDADE, UNIDADE E NOME DE UM INGREDIENTE ESPECÍFICO
  const putFridgeHandler = (req, res) => {
    const { id } = req.params;
    const { name, amount, unit, category } = req.body;
    const numAmount = Math.max(0, parseFloat(amount) || 0);
    const trimmedUnit = String(unit || 'un').trim();
    const trimmedName = String(name || '').trim();

    const existing = db.prepare('SELECT id FROM fridge_items WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Ingrediente não encontrado' });
    }

    if (trimmedName) {
      db.prepare(`
        UPDATE fridge_items
        SET name = ?,
            amount = ?,
            unit = ?,
            category = COALESCE(?, category),
            last_updated = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(trimmedName, numAmount, trimmedUnit, category || null, id);
    } else {
      db.prepare(`
        UPDATE fridge_items
        SET amount = ?,
            unit = ?,
            category = COALESCE(?, category),
            last_updated = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(numAmount, trimmedUnit, category || null, id);
    }

    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  };
  app.put('/api/fridge/:id', putFridgeHandler);
  app.put('/api/ingredients/:id', putFridgeHandler);

  // EXCLUIR INGREDIENTE ESPECÍFICO POR ID
  const deleteFridgeHandler = (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM fridge_items WHERE id = ?').run(id);
    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  };
  app.delete('/api/fridge/:id', deleteFridgeHandler);
  app.delete('/api/ingredients/:id', deleteFridgeHandler);

  const toggleFridgeHandler = (req, res) => {
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
  };
  app.post('/api/fridge/toggle', toggleFridgeHandler);
  app.post('/api/ingredients/toggle', toggleFridgeHandler);

  const clearFridgeHandler = (_req, res) => {
    db.prepare('DELETE FROM fridge_items').run();
    res.json({ ...getFullState(), currentVersion: appVersion || CURRENT_VERSION });
  };
  app.post('/api/fridge/clear', clearFridgeHandler);
  app.post('/api/ingredients/clear', clearFridgeHandler);

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
    const fullState = getFullState();
    res.json({
      success: true,
      message: 'Preço do insumo atualizado e fichas técnicas recalculadas.',
      prices: updatedPrices,
      fullState,
      ...fullState,
      currentVersion: appVersion || CURRENT_VERSION,
    });
  });

  // 5.1 Adicionar Novo Insumo Personalizado
  app.post('/api/market-prices', (req, res) => {
    const { name, aisle, std_unit, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
    }
    const updatedPrices = addOrUpsertMarketPrice({ name, aisle, std_unit, price });
    const fullState = getFullState();
    res.json({
      success: true,
      message: `Ingrediente "${name}" cadastrado e fichas técnicas calibradas.`,
      prices: updatedPrices,
      fullState,
      ...fullState,
      currentVersion: appVersion || CURRENT_VERSION,
    });
  });

  // 5.2 Restaurar Preços Padrão CEASA/PROCON
  app.post('/api/market-prices/reset', (_req, res) => {
    try {
      const updatedPrices = resetMarketPricesToDefault();
      const fullState = getFullState();
      res.json({
        success: true,
        message: 'Preços de referência restaurados para os padrões oficiais CEASA/PROCON.',
        prices: updatedPrices,
        fullState,
        ...fullState,
        currentVersion: appVersion || CURRENT_VERSION,
      });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao restaurar preços padrão: ' + err.message });
    }
  });

  // 6. Forçar Recálculo de Custos em Lote
  app.post('/api/market-prices/recalculate', (_req, res) => {
    try {
      recalcRecipesCost();
      const fullState = getFullState();
      res.json({
        success: true,
        message: 'Todas as fichas técnicas foram recalculadas com os preços médios mais recentes.',
        fullState,
        ...fullState,
        currentVersion: appVersion || CURRENT_VERSION,
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

    const finalTags = (Array.isArray(tags) ? [...tags] : ['Econômico'])
      .filter((t) => t !== 'Passo a Passo com Fotos');

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

    const finalTags = (Array.isArray(tags) ? [...tags] : JSON.parse(existing.tags_json))
      .filter((t) => t !== 'Passo a Passo com Fotos');

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

    let rawIngs = [];
    let importSteps = [];
    let providedStepDetails = [];
    let finalCategory = category;
    let prepTime = 25;
    let servings = 2;
    let tags = ['Econômico', 'Rápido', 'Importada'];
    let platingInstructions = '';
    let specificInstructions = '';

    // 1. EXTRAÇÃO GASTRONÔMICA ESTRUTURADA VIA SCHEMA.ORG JSON-LD E DOM SEMÂNTICO (RECEITERIA)
    let webScraped = null;
    if (pageHtml) {
      try {
        webScraped = extractRecipeFromHtml(pageHtml, raw);
        if (webScraped) {
          if (webScraped.title) title = webScraped.title;
          if (webScraped.heroImage) heroImage = webScraped.heroImage;
          if (webScraped.prepTime) prepTime = webScraped.prepTime;
          if (webScraped.servings) servings = webScraped.servings;
          if (Array.isArray(webScraped.ingredients) && webScraped.ingredients.length > 0) {
            rawIngs = webScraped.ingredients;
          }
          if (Array.isArray(webScraped.rawSteps) && webScraped.rawSteps.length > 0) {
            importSteps = webScraped.rawSteps.map((s) => s.text);
            providedStepDetails = webScraped.rawSteps;
          }
        }
      } catch (err) {
        console.warn('Erro na extração web estruturada da receita:', err.message);
      }
    }

    // 2. TENTA ENRIQUECIMENTO PROFISSIONAL VIA GEMINI API (GOOGLE AI)
    const userSettings = db.prepare('SELECT gemini_api_key, unsplash_access_key FROM users ORDER BY id ASC LIMIT 1').get();
    const geminiKey = userSettings?.gemini_api_key || process.env.GEMINI_API_KEY;

    let geminiResult = null;
    if (pageHtml && geminiKey) {
      geminiResult = await parseRecipeWithGemini(pageHtml, raw, geminiKey);
    }

    if (geminiResult) {
      title = geminiResult.title || title;
      finalCategory = geminiResult.category || category;
      prepTime = Number(geminiResult.prepTime) || prepTime || 25;
      servings = Math.max(1, Number(geminiResult.servings) || servings || 2);
      if (Array.isArray(geminiResult.tags) && geminiResult.tags.length > 0) {
        tags = [...new Set([...tags, ...geminiResult.tags])];
      }
      platingInstructions = geminiResult.platingInstructions || '';
      specificInstructions = geminiResult.specificInstructions || '';
      if (rawIngs.length === 0 && Array.isArray(geminiResult.ingredients) && geminiResult.ingredients.length > 0) {
        rawIngs = geminiResult.ingredients;
      }
      // Se a extração web não encontrou passos, usa os passos do Gemini
      if (importSteps.length === 0 && Array.isArray(geminiResult.steps) && geminiResult.steps.length > 0) {
        importSteps = geminiResult.steps;
        providedStepDetails = geminiResult.steps.map((text, idx) => ({
          stepNumber: idx + 1,
          section:
            idx === 0
              ? 'Mise en Place'
              : idx === geminiResult.steps.length - 1
              ? 'Finalização & Empratamento'
              : 'Preparo e Cocção',
          text,
          image: null,
          alt: `Passo ${idx + 1}: ${text.slice(0, 50)}...`,
          tip: 'Respeite a ordem técnica dos insumos e o ponto indicado.',
          isKeyFrame: true,
          timerSeconds: extractStepTimerSeconds(text),
        }));
      }
    }

    // Fallback de ingredientes se o Gemini e o scraper não estiverem disponíveis
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

    const hasGenericOrFewSteps =
      importSteps.length < 4 ||
      importSteps.some(
        (s) =>
          s.includes('Separe e pese todos os insumos conforme a ficha técnica') ||
          s.includes('Prepare o insumo principal em fogo médio')
      );

    if (hasGenericOrFewSteps) {
      const topIngs = rawIngs.map((i) => i.name).slice(0, 3).join(', ') || 'principais insumos';
      importSteps = [
        `Mise en place profissional: pese e higienize cuidadosamente todos os insumos selecionados (${topIngs}), organizando tudo na bancada de trabalho com utensílios higienizados.`,
        `Preparo dos aromáticos: pique a cebola em cubos regulares e lamine o alho fino para liberar os óleos essenciais que servem de base gastronômica ao prato.`,
        `Selagem em temperatura controlada: aqueça uma panela ou frigideira de fundo grosso com azeite em fogo médio-alto e sele a proteína ou insumo principal até formar crosta dourada saborosa.`,
        `Incorporação de sabores: adicione os aromáticos e legumes, refogando em fogo brando até dourarem e absorverem os sucos caramelizados do fundo da panela.`,
        `Cocção e apuramento: cozinhe em temperatura moderada com a panela semitampada, ajustando o ponto de sal e pimenta até que a textura fique suculenta e aveludada.`,
        `Finalização gastronômica: desligue o fogo, salpique ervas frescas picadas na hora (cheiro-verde ou manjericão) e sirva imediatamente bem quente com empratamento harmonioso.`,
      ];
    }

    // 3. CALIBRAÇÃO INTELIGENTE DE CUSTOS VIA PREÇOS DE MERCADO (ÁGUA = R$ 0,00)
    const currentMarketPrices = getMarketPrices();
    const marketMap = new Map(currentMarketPrices.map((mp) => [mp.ingredient_key, mp]));
    const ingredients = rawIngs.map((ing) => {
      const isWater = ing.isWater || ing.name.toLowerCase() === 'água' || ing.name.toLowerCase() === 'agua';
      return {
        ...ing,
        basePrice: isWater ? 0 : computeCulinaryPortionCost(ing.name, ing.amount, ing.unit, marketMap),
      };
    });

    // 4. CÁLCULO NUTRICIONAL BRASILEIRO OFICIAL (TACO / TBCA)
    const tacoNutrition = calculateRecipeNutritionTaco(ingredients, servings);
    const calories = tacoNutrition.perServing.calories || geminiResult?.calories || 420;
    const protein = tacoNutrition.perServing.protein || geminiResult?.protein || 28;
    const carbs = tacoNutrition.perServing.carbs || geminiResult?.carbs || 36;
    const fat = tacoNutrition.perServing.fat || geminiResult?.fat || 14;

    const cleanTitle = title.split(/[-|–]/)[0].trim().slice(0, 65);
    const id = 'rec-custom-' + Date.now();

    // 5. BAIXA E SALVA IMAGEM HERO EM CACHE LOCAL (100% OFFLINE E IMUNE A BLOQUEIOS)
    let finalHero = null;
    if (heroImage) {
      finalHero = await cacheRecipeImage(heroImage, `${id}-hero`);
    }
    if (!finalHero) {
      const exactPhotos = await searchExactDishPhotos(cleanTitle, ingredients);
      finalHero = exactPhotos[0] || resolveAccurateDishImage(id, cleanTitle, heroImage);
    }

    // 6. PROCESSA E BAIXA FOTOS REAIS DO PASSO A PASSO
    const hasScrapedStepPhotos = providedStepDetails.some((s) => s?.image && typeof s.image === 'string' && s.image.length > 5);
    let finalStepDetails = [];

    if (hasScrapedStepPhotos) {
      // Usa as fotos originais reais de cada passo extraídas da fonte (ex: Receiteria)
      for (let idx = 0; idx < importSteps.length; idx++) {
        const stepText = importSteps[idx];
        const origStep = providedStepDetails[idx];
        let stepImg = null;

        if (origStep?.image) {
          stepImg = await cacheRecipeImage(origStep.image, `${id}-step-${idx + 1}`);
        }
        if (!stepImg && idx === importSteps.length - 1) {
          stepImg = finalHero;
        }

        finalStepDetails.push({
          stepNumber: idx + 1,
          section:
            origStep?.section ||
            (idx === 0
              ? 'Mise en Place & Pré-preparo'
              : idx === importSteps.length - 1
              ? 'Finalização & Empratamento'
              : 'Cocção & Ponto Ideal'),
          text: stepText,
          image: stepImg,
          alt: `Passo ${idx + 1}: ${stepText.slice(0, 50)}...`,
          tip:
            idx === 0
              ? 'Pese todos os insumos e organize os utensílios na bancada.'
              : idx === importSteps.length - 1
              ? 'Sirva em temperatura ideal com apresentação harmoniosa.'
              : 'Mantenha controle atento de temperatura para cocção homogênea.',
          isKeyFrame: true,
          timerSeconds: extractStepTimerSeconds(stepText),
        });
      }
    } else {
      finalStepDetails = await ensureRecipeStepDetails(
        cleanTitle,
        importSteps,
        ingredients,
        providedStepDetails,
        finalHero
      );
    }

    const totalWeightGrams = ingredients.reduce((s, i) => s + (Number(i.amount) || 0), 0);
    const portionWeight = geminiResult?.portionWeight || `${Math.max(180, Math.round(totalWeightGrams / servings))}g por porção`;

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
      server: { middlewareMode: true, hmr: { port: 0 } },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  return new Promise((resolve) => {
    const server = app.listen(port, '0.0.0.0', () => {
      const actualPort = server.address().port;
      const localIp = getLocalIpAddress();
      console.log(`NeatEat Brasil server running at http://127.0.0.1:${actualPort}`);
      console.log(`Modo Mercado disponível no celular em: http://${localIp}:${actualPort}/mercado`);
      resolve({ server, port: actualPort });
    });
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  startServer();
}
