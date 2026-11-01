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
} from './db.js';
import { CURRENT_VERSION, RELEASE_NOTES } from './changelog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function searchExactDishPhotos(dishTitle, _ingredients = []) {
  const fetchFromReceiteria = async (q) => {
    const res = await fetch(
      'https://www.receiteria.com.br/?s=' + encodeURIComponent(q),
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        },
      }
    );
    const html = await res.text();
    const matches = [
      ...html.matchAll(
        /https:\/\/www\.receiteria\.com\.br\/wp-content\/uploads\/[^"'\s>]+\.(?:jpg|jpeg|png)/gi
      ),
    ]
      .map((m) => m[0].replace(/-\d+x\d+\.(jpg|jpeg|png)$/i, '.$1'))
      .filter(
        (u) =>
          !u.includes('logo') &&
          !u.includes('icon') &&
          !u.includes('avatar') &&
          !u.includes('banner')
      );
    return [...new Set(matches)];
  };

  try {
    const clean = String(dishTitle || '')
      .replace(/\([^)]*\)/g, ' ')
      .trim();
    let results = await fetchFromReceiteria(clean);
    if (results.length === 0) {
      const firstWords = clean.split(/\s+/).slice(0, 2).join(' ');
      if (firstWords) {
        results = await fetchFromReceiteria(firstWords);
      }
    }
    if (results.length > 0) {
      return results
        .slice(0, 6)
        .map((u) => `/api/image-proxy?url=${encodeURIComponent(u)}`);
    }
  } catch (err) {
    console.error('Erro ao buscar foto culinária do prato:', err);
  }
  return ['/dishes/rec-5.jpg'];
}

function buildShoppingList(mealPlan, allRecipes, householdSize, fridgeItems, checkedMap) {
  const recipeMap = new Map(allRecipes.map((r) => [r.id, r]));
  const fridgeSet = new Set(fridgeItems.map((f) => f.name.toLowerCase().trim()));
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
        existing.Occurrences += 1;
        if (!existing.recipesUsed.includes(recipe.title)) {
          existing.recipesUsed.push(recipe.title);
        }
      } else {
        const inFridge = fridgeSet.has(key);
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
          recipesUsed: [recipe.title],
        });
      }
    }
  }

  return Array.from(aggregated.values()).sort(
    (a, b) => a.aisle.localeCompare(b.aisle) || a.name.localeCompare(b.name)
  );
}

function getFullState() {
  const user = db.prepare('SELECT * FROM users ORDER BY id ASC LIMIT 1').get();
  const allUsers = db.prepare('SELECT id, name, email, household_code FROM users ORDER BY id ASC').all();
  const recipes = getAllRecipes();
  const mealPlan = db.prepare('SELECT day, slot, recipe_id FROM meal_plans').all();
  const fridgeItems = db.prepare('SELECT id, name, category FROM fridge_items ORDER BY name ASC').all();
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
  const suggestionsState = getSuggestionsState();

  return {
    user,
    allUsers,
    recipes,
    mealPlan,
    fridgeItems,
    shoppingList,
    suggestions: suggestionsState.suggestions,
    dismissedSuggestionsCount: suggestionsState.dismissedCount,
    lastSuggestionSwipe: suggestionsState.lastSwipe,
    discoveryDate: suggestionsState.discoveryDate,
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
  const idx1 = daySeed % DAILY_ROTATION_THEMES.length;
  const idx2 = (daySeed + 3) % DAILY_ROTATION_THEMES.length;
  const picks = [DAILY_ROTATION_THEMES[idx1], DAILY_ROTATION_THEMES[idx2]];

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
  } = options;

  const app = express();
  app.use(express.json({ limit: '10mb' }));

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

  app.get('/api/image-proxy', async (req, res) => {
    const targetUrl = String(req.query.url || '').trim();
    if (!targetUrl.startsWith('https://')) {
      return res.redirect('/dishes/rec-5.jpg');
    }
    try {
      const upstream = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Referer: 'https://www.receiteria.com.br/',
        },
      });
      if (!upstream.ok) {
        return res.redirect('/dishes/rec-5.jpg');
      }
      const contentType = upstream.headers.get('content-type') || 'image/jpeg';
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(buf);
    } catch {
      res.redirect('/dishes/rec-5.jpg');
    }
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

    db.prepare(`
      INSERT INTO recipes (
        id, title, category, prep_time, servings, calories, protein, carbs, fat,
        tags_json, image, source, ingredients_json, steps_json,
        portion_weight, plating_instructions, specific_instructions
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      JSON.stringify(Array.isArray(tags) ? tags : ['Econômico']),
      finalImage,
      source || 'Ficha Técnica Própria',
      JSON.stringify(validIngredients),
      JSON.stringify(validSteps),
      portionWeight || '350g por porção',
      platingInstructions || 'Servir em prato aquecido com montagem centralizada.',
      specificInstructions || 'Respeitar as gramaturas e temperaturas da ficha técnica.'
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
          specific_instructions = ?
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
      JSON.stringify(Array.isArray(tags) ? tags : JSON.parse(existing.tags_json)),
      finalImage,
      source ?? existing.source,
      JSON.stringify(nextIngredients),
      JSON.stringify(nextSteps),
      portionWeight ?? existing.portion_weight,
      platingInstructions ?? existing.plating_instructions,
      specificInstructions ?? existing.specific_instructions,
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

  // AI IMPORT RECIPE WITH EXACT DISH PHOTO & FICHA TÉCNICA
  app.post('/api/recipes/import', async (req, res) => {
    const { input, category = 'Almoço' } = req.body;
    if (!input || !input.trim()) {
      return res.status(400).json({ error: 'Informe uma URL ou descrição da receita' });
    }

    const raw = input.trim();
    const isUrl = raw.startsWith('http://') || raw.startsWith('https://');
    let title = raw;
    let source = 'Ficha Técnica Importada via IA';

    if (isUrl) {
      try {
        const urlObj = new URL(raw);
        source = urlObj.hostname.replace('www.', '');
        const slug = urlObj.pathname.split('/').filter(Boolean).pop() || 'receita-especial';
        title = slug
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
      } catch {
        title = 'Receita Importada da Web';
      }
    }

    const lower = title.toLowerCase();
    const ingredients = [];

    if (lower.includes('frango')) {
      ingredients.push({ name: 'Peito de frango', amount: 300, unit: 'g', aisle: 'Açougue', basePrice: 6.90 });
    }
    if (lower.includes('carne') || lower.includes('bife') || lower.includes('patinho') || lower.includes('bolonhesa')) {
      ingredients.push({ name: 'Carne moída (patinho ou acém)', amount: 300, unit: 'g', aisle: 'Açougue', basePrice: 10.50 });
    }
    if (lower.includes('ovo') || lower.includes('omelete') || lower.includes('panqueca')) {
      ingredients.push({ name: 'Ovo', amount: 3, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 2.70 });
    }
    if (lower.includes('queijo') || lower.includes('pizza') || lower.includes('lasanha') || lower.includes('gratinado')) {
      ingredients.push({ name: 'Queijo muçarela', amount: 80, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 3.90 });
    }
    if (lower.includes('macarrão') || lower.includes('pasta') || lower.includes('espaguete')) {
      ingredients.push({ name: 'Macarrão espaguete ou penne', amount: 200, unit: 'g', aisle: 'Mercearia', basePrice: 2.10 });
    }
    if (lower.includes('arroz') || lower.includes('risoto')) {
      ingredients.push({ name: 'Arroz branco', amount: 150, unit: 'g', aisle: 'Mercearia', basePrice: 1.30 });
    }
    if (lower.includes('batata') || lower.includes('nhoque') || lower.includes('purê')) {
      ingredients.push({ name: 'Batata inglesa', amount: 250, unit: 'g', aisle: 'Hortifruti', basePrice: 2.30 });
    }

    if (ingredients.length === 0) {
      ingredients.push(
        { name: 'Tomate', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.50 },
        { name: 'Cebola', amount: 80, unit: 'g', aisle: 'Hortifruti', basePrice: 0.70 },
        { name: 'Alho', amount: 10, unit: 'g', aisle: 'Hortifruti', basePrice: 0.40 },
        { name: 'Azeite de oliva', amount: 15, unit: 'ml', aisle: 'Mercearia', basePrice: 1.20 },
        { name: 'Queijo coalho ou minas', amount: 80, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 3.80 }
      );
    } else {
      ingredients.push(
        { name: 'Cebola', amount: 60, unit: 'g', aisle: 'Hortifruti', basePrice: 0.55 },
        { name: 'Alho', amount: 10, unit: 'g', aisle: 'Hortifruti', basePrice: 0.40 },
        { name: 'Azeite de oliva', amount: 10, unit: 'ml', aisle: 'Mercearia', basePrice: 0.90 }
      );
    }

    const cleanTitle = title.length > 65 ? title.slice(0, 62) + '...' : title;
    const exactPhotos = await searchExactDishPhotos(cleanTitle, ingredients);
    const totalWeightGrams = ingredients.reduce((s, i) => s + (Number(i.amount) || 0), 0);
    const portionWeight = `${Math.max(180, Math.round(totalWeightGrams / 2))}g por porção`;

    const id = 'rec-custom-' + Date.now();
    const tags = ['Econômico', 'Rápido', 'Importada'];

    db.prepare(`
      INSERT INTO recipes (
        id, title, category, prep_time, servings, calories, protein, carbs, fat,
        tags_json, image, source, ingredients_json, steps_json,
        portion_weight, plating_instructions, specific_instructions
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      cleanTitle,
      category,
      20,
      2,
      440,
      28,
      42,
      15,
      JSON.stringify(tags),
      exactPhotos[0],
      source,
      JSON.stringify(ingredients),
      JSON.stringify([
        'Realize o mise en place pesando todos os insumos conforme a ficha técnica.',
        'Refogue os aromáticos base no azeite até dourarem.',
        'Incorpore os insumos principais, cozinhe em fogo médio por 15 minutos e ajuste o sal antes de empratar.'
      ]),
      portionWeight,
      `Dispor a porção (${portionWeight}) no centro de um prato aquecido, garantindo volume e altura, e finalizar com ervas frescas e fio de azeite.`,
      'Manter os insumos perecíveis refrigerados a 4°C até o preparo. Consumir em até 48h se mantido refrigerado em recipiente hermético.'
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
