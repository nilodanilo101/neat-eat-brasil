import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, initDb, SUPERMARKETS, getAllRecipes, generateSmartMealPlan } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function buildShoppingList(mealPlan, allRecipes, supermarket, householdSize, fridgeItems, checkedMap) {
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
      const scaledAmount = ing.amount * scale;
      const scaledPrice = ing.basePrice * scale * supermarket.multiplier;

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
          unit: ing.unit,
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

  return Array.from(aggregated.values()).sort((a, b) => a.aisle.localeCompare(b.aisle) || a.name.localeCompare(b.name));
}

function getFullState() {
  const user = db.prepare('SELECT * FROM users ORDER BY id ASC LIMIT 1').get();
  const allUsers = db.prepare('SELECT id, name, email, household_code FROM users ORDER BY id ASC').all();
  const supermarket = SUPERMARKETS.find((m) => m.id === user.supermarket_id) || SUPERMARKETS[0];
  const recipes = getAllRecipes();
  const mealPlan = db.prepare('SELECT day, slot, recipe_id FROM meal_plans').all();
  const fridgeItems = db.prepare('SELECT id, name, category FROM fridge_items ORDER BY name ASC').all();
  const checkedRows = db.prepare('SELECT item_key, checked FROM shopping_state').all();
  const checkedMap = new Map(checkedRows.map((r) => [r.item_key, r.checked === 1]));

  const shoppingList = buildShoppingList(
    mealPlan,
    recipes,
    supermarket,
    user.household_size,
    fridgeItems,
    checkedMap
  );

  const grossTotal = shoppingList.reduce((acc, item) => acc + item.estimatedPrice, 0);
  const fridgeSavings = shoppingList
    .filter((item) => item.inFridge)
    .reduce((acc, item) => acc + item.estimatedPrice, 0);
  const netToBuyTotal = Math.max(0, grossTotal - fridgeSavings);

  return {
    user,
    allUsers,
    supermarkets: SUPERMARKETS,
    currentSupermarket: supermarket,
    recipes,
    mealPlan,
    fridgeItems,
    shoppingList,
    totals: {
      grossTotal: Number(grossTotal.toFixed(2)),
      fridgeSavings: Number(fridgeSavings.toFixed(2)),
      netToBuyTotal: Number(netToBuyTotal.toFixed(2)),
      budgetRemaining: Number((user.weekly_budget - netToBuyTotal).toFixed(2)),
    },
  };
}

export async function startServer(options = {}) {
  initDb();

  const {
    port = process.env.PORT || 3000,
    isPackaged = false,
    distPath = path.join(__dirname, '..', 'dist'),
    appVersion = '1.0.0',
    onCheckUpdates = null,
    getUpdateStatus = () => ({ status: 'idle', message: 'App atualizado', version: appVersion }),
  } = options;

  const app = express();
  app.use(express.json());

  app.get('/api/state', (_req, res) => {
    res.json({
      ...getFullState(),
      updater: getUpdateStatus(),
    });
  });

  app.post('/api/updater/check', async (_req, res) => {
    if (onCheckUpdates) {
      await onCheckUpdates();
    }
    res.json(getUpdateStatus());
  });

  app.post('/api/profile', (req, res) => {
    const { weekly_budget, supermarket_id, dietary_filter, household_size, name } = req.body;
    const current = db.prepare('SELECT * FROM users ORDER BY id ASC LIMIT 1').get();

    db.prepare(`
      UPDATE users
      SET weekly_budget = ?,
          supermarket_id = ?,
          dietary_filter = ?,
          household_size = ?,
          name = ?
      WHERE id = ?
    `).run(
      weekly_budget ?? current.weekly_budget,
      supermarket_id ?? current.supermarket_id,
      dietary_filter ?? current.dietary_filter,
      household_size ?? current.household_size,
      name ?? current.name,
      current.id
    );

    res.json({ ...getFullState(), updater: getUpdateStatus() });
  });

  app.post('/api/plan/generate', (req, res) => {
    const current = db.prepare('SELECT * FROM users ORDER BY id ASC LIMIT 1').get();
    const budget = req.body.weekly_budget ?? current.weekly_budget;
    const market = req.body.supermarket_id ?? current.supermarket_id;
    const diet = req.body.dietary_filter ?? current.dietary_filter;
    const size = req.body.household_size ?? current.household_size;

    db.prepare(`
      UPDATE users
      SET weekly_budget = ?, supermarket_id = ?, dietary_filter = ?, household_size = ?
      WHERE id = ?
    `).run(budget, market, diet, size, current.id);

    generateSmartMealPlan(Number(budget), market, diet, Number(size));
    res.json({ ...getFullState(), updater: getUpdateStatus() });
  });

  app.post('/api/plan/slot', (req, res) => {
    const { day, slot, recipe_id } = req.body;
    db.prepare(`
      INSERT INTO meal_plans (day, slot, recipe_id)
      VALUES (?, ?, ?)
      ON CONFLICT(day, slot) DO UPDATE SET recipe_id = excluded.recipe_id
    `).run(day, slot, recipe_id);

    res.json({ ...getFullState(), updater: getUpdateStatus() });
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

    res.json({ ...getFullState(), updater: getUpdateStatus() });
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

    res.json({ ...getFullState(), updater: getUpdateStatus() });
  });

  app.post('/api/recipes/import', (req, res) => {
    const { input, category = 'Almoço' } = req.body;
    if (!input || !input.trim()) {
      return res.status(400).json({ error: 'Informe uma URL ou descrição da receita' });
    }

    const raw = input.trim();
    const isUrl = raw.startsWith('http://') || raw.startsWith('https://');
    let title = raw;
    let source = 'Importado via IA NeatEat';

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

    const lower = raw.toLowerCase();
    const ingredients = [];

    if (lower.includes('frango')) {
      ingredients.push({ name: 'Peito de frango', amount: 300, unit: 'g', aisle: 'Açougue', basePrice: 6.90 });
    }
    if (lower.includes('carne') || lower.includes('bife') || lower.includes('patinho')) {
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

    const id = 'rec-custom-' + Date.now();
    const tags = ['Econômico', 'Rápido', 'Importada'];

    db.prepare(`
      INSERT INTO recipes (id, title, category, prep_time, servings, calories, protein, carbs, fat, tags_json, image, source, ingredients_json, steps_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title.length > 65 ? title.slice(0, 62) + '...' : title,
      category,
      20,
      2,
      440,
      28,
      42,
      15,
      JSON.stringify(tags),
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      source,
      JSON.stringify(ingredients),
      JSON.stringify([
        'Separe e higienize todos os ingredientes importados pela IA do NeatEat.',
        'Refogue os temperos base no azeite até dourarem.',
        'Adicione os ingredientes principais, cozinhe em fogo médio por 15 minutos e sirva quente.'
      ])
    );

    res.json({ ...getFullState(), updater: getUpdateStatus() });
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
    res.json({ ...getFullState(), updater: getUpdateStatus() });
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

// Run standalone if invoked directly via `node server/index.js`
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  startServer();
}
