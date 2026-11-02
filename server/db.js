import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.NEATEAT_DATA_DIR || __dirname;
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, 'neateat.sqlite');
export const db = new DatabaseSync(dbPath);

import { INITIAL_RECIPES } from "./recipesData.js";
import { CANONICAL_INGREDIENTS, computeCulinaryPortionCost } from "./ingredientMatcher.js";
import {
  ROBUST_RECIPE_VAULT,
  computeUserTasteProfile,
  enrichAndRankSuggestions,
} from "./suggestionEngine.js";

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      household_code TEXT NOT NULL,
      weekly_budget REAL NOT NULL DEFAULT 250.0,
      supermarket_id TEXT NOT NULL DEFAULT 'atacadao',
      dietary_filter TEXT NOT NULL DEFAULT 'Todas',
      household_size INTEGER NOT NULL DEFAULT 2,
      last_seen_version TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      prep_time INTEGER NOT NULL,
      servings INTEGER NOT NULL,
      calories INTEGER NOT NULL,
      protein INTEGER NOT NULL,
      carbs INTEGER NOT NULL,
      fat INTEGER NOT NULL,
      tags_json TEXT NOT NULL,
      image TEXT NOT NULL,
      source TEXT NOT NULL,
      ingredients_json TEXT NOT NULL,
      steps_json TEXT NOT NULL,
      portion_weight TEXT NOT NULL DEFAULT '350g por porção',
      plating_instructions TEXT NOT NULL DEFAULT '',
      specific_instructions TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS meal_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day TEXT NOT NULL,
      slot TEXT NOT NULL,
      recipe_id TEXT NOT NULL,
      UNIQUE(day, slot)
    );

    CREATE TABLE IF NOT EXISTS fridge_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL DEFAULT 'Hortifruti'
    );

    CREATE TABLE IF NOT EXISTS shopping_state (
      item_key TEXT PRIMARY KEY,
      checked INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS suggestion_swipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      suggestion_id TEXT UNIQUE NOT NULL,
      action TEXT NOT NULL,
      recipe_json TEXT NOT NULL,
      swiped_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS daily_discovered_recipes (
      id TEXT PRIMARY KEY,
      date_added TEXT NOT NULL,
      recipe_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ingredient_market_prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ingredient_key TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      aisle TEXT NOT NULL DEFAULT 'Mercearia',
      std_unit TEXT NOT NULL DEFAULT 'kg',
      last_unit_price REAL NOT NULL,
      avg_unit_price REAL NOT NULL,
      sample_count INTEGER NOT NULL DEFAULT 1,
      last_supermarket TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS grocery_invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supermarket TEXT NOT NULL,
      purchase_date TEXT NOT NULL,
      total_value REAL NOT NULL,
      items_count INTEGER NOT NULL DEFAULT 0,
      items_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_meal_plans_day_slot ON meal_plans(day, slot);
    CREATE INDEX IF NOT EXISTS idx_suggestion_swipes_id ON suggestion_swipes(suggestion_id);
    CREATE INDEX IF NOT EXISTS idx_market_prices_key ON ingredient_market_prices(ingredient_key);
  `);

  try {
    db.exec('PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL;');
  } catch {
    // Ignore if WAL not supported
  }

  // Safe migrations for existing databases
  const safeMigrations = [
    `ALTER TABLE users ADD COLUMN last_seen_version TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE users ADD COLUMN last_discovery_date TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE recipes ADD COLUMN portion_weight TEXT NOT NULL DEFAULT '350g por porção'`,
    `ALTER TABLE recipes ADD COLUMN plating_instructions TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE recipes ADD COLUMN specific_instructions TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE recipes ADD COLUMN sections_json TEXT NOT NULL DEFAULT '[]'`,
    `ALTER TABLE recipes ADD COLUMN step_details_json TEXT NOT NULL DEFAULT '[]'`,
    `ALTER TABLE recipes ADD COLUMN chef_tips_json TEXT NOT NULL DEFAULT '{}'`,
    `ALTER TABLE fridge_items ADD COLUMN amount REAL NOT NULL DEFAULT 1.0`,
    `ALTER TABLE fridge_items ADD COLUMN unit TEXT NOT NULL DEFAULT 'un'`,
    `ALTER TABLE fridge_items ADD COLUMN last_updated TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE users ADD COLUMN gemini_api_key TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE users ADD COLUMN unsplash_access_key TEXT NOT NULL DEFAULT ''`,
  ];
  for (const sql of safeMigrations) {
    try {
      db.exec(sql);
    } catch {
      // Column already exists
    }
  }

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    db.prepare(`
      INSERT INTO users (name, email, household_code, weekly_budget, supermarket_id, dietary_filter, household_size)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('Família Silva', 'familia@neateat.com.br', 'NEAT-BR-8492', 250.0, 'atacadao', 'Todas', 2);
  }

  const upsertRecipe = db.prepare(`
    INSERT INTO recipes (
      id, title, category, prep_time, servings, calories, protein, carbs, fat,
      tags_json, image, source, ingredients_json, steps_json,
      portion_weight, plating_instructions, specific_instructions,
      sections_json, step_details_json, chef_tips_json
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      category = excluded.category,
      prep_time = excluded.prep_time,
      servings = excluded.servings,
      calories = excluded.calories,
      protein = excluded.protein,
      carbs = excluded.carbs,
      fat = excluded.fat,
      tags_json = excluded.tags_json,
      image = excluded.image,
      source = excluded.source,
      ingredients_json = excluded.ingredients_json,
      steps_json = excluded.steps_json,
      portion_weight = excluded.portion_weight,
      plating_instructions = excluded.plating_instructions,
      specific_instructions = excluded.specific_instructions,
      sections_json = excluded.sections_json,
      step_details_json = excluded.step_details_json,
      chef_tips_json = excluded.chef_tips_json
  `);

  for (const r of INITIAL_RECIPES) {
    upsertRecipe.run(
      r.id,
      r.title,
      r.category,
      r.prepTime,
      r.servings,
      r.calories,
      r.protein,
      r.carbs,
      r.fat,
      JSON.stringify(r.tags),
      r.image,
      r.source,
      JSON.stringify(r.ingredients),
      JSON.stringify(r.steps),
      r.portionWeight || "350g por porção",
      r.platingInstructions || "",
      r.specificInstructions || "",
      JSON.stringify(r.sections || []),
      JSON.stringify(r.stepDetails || []),
      JSON.stringify(r.chefTips || {})
    );
  }

  const fridgeCount = db.prepare('SELECT COUNT(*) as count FROM fridge_items').get().count;
  if (fridgeCount === 0) {
    const insertFridge = db.prepare('INSERT OR IGNORE INTO fridge_items (name, category) VALUES (?, ?)');
    insertFridge.run('Ovo', 'Laticínios e Ovos');
    insertFridge.run('Arroz branco', 'Mercearia');
    insertFridge.run('Alho', 'Hortifruti');
    insertFridge.run('Azeite de oliva', 'Mercearia');
  }

  const planCount = db.prepare('SELECT COUNT(*) as count FROM meal_plans').get().count;
  if (planCount === 0) {
    generateSmartMealPlan(250.0, 'Todas', 2);
  }

  // Sincroniza / Inicializa Preços Canônicos de Mercado (Referência Nacional CEASA/PROCON)
  const insertPrice = db.prepare(`
    INSERT INTO ingredient_market_prices (
      ingredient_key, display_name, aisle, std_unit, last_unit_price, avg_unit_price, sample_count, last_supermarket, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, 0, 'Referência Oficial NeatEat', CURRENT_TIMESTAMP)
    ON CONFLICT(ingredient_key) DO NOTHING
  `);

  for (const item of CANONICAL_INGREDIENTS) {
    insertPrice.run(
      item.key,
      item.name,
      item.aisle,
      item.stdUnit,
      item.defaultPricePerKg,
      item.defaultPricePerKg
    );
  }

  // Inicializa o reservatório robusto de sugestões e descobertas
  const discoveredCount = db.prepare('SELECT COUNT(*) as count FROM daily_discovered_recipes').get().count;
  if (discoveredCount === 0) {
    const todayKey = getTodayDateKey();
    const insertDiscovered = db.prepare(`
      INSERT OR IGNORE INTO daily_discovered_recipes (id, date_added, recipe_json)
      VALUES (?, ?, ?)
    `);
    for (const item of ROBUST_RECIPE_VAULT) {
      insertDiscovered.run(item.id, todayKey, JSON.stringify(item));
    }
  }

  // Migração segura: garante que nenhuma receita em daily_discovered_recipes tenha passos genéricos ou fique sem stepDetails
  try {
    const dailyRows = db.prepare('SELECT id, recipe_json FROM daily_discovered_recipes').all();
    for (const row of dailyRows) {
      const r = JSON.parse(row.recipe_json);
      const isGeneric = (r.steps && r.steps.length <= 3 && r.steps.some(s => s.includes('Separe e pese') || s.includes('Prepare o insumo')));
      const needsStepDetails = !r.stepDetails || r.stepDetails.length === 0;
      if (isGeneric || needsStepDetails) {
        const vaultMatch = ROBUST_RECIPE_VAULT.find(
          (v) => v.title.toLowerCase().trim() === r.title.toLowerCase().trim() || v.id === r.id
        );
        const stepsToUse = vaultMatch && vaultMatch.steps ? vaultMatch.steps : r.steps;
        r.steps = stepsToUse;
        r.stepDetails = stepsToUse.map((stepText, idx) => ({
          stepNumber: idx + 1,
          section: idx === 0 ? 'Mise en Place' : idx === stepsToUse.length - 1 ? 'Finalização & Empratamento' : 'Preparo e Cocção',
          text: stepText,
          image: r.image || '/dishes/rec-5.jpg',
          alt: `Passo ${idx + 1}: ${stepText.slice(0, 50)}...`,
          tip: idx === 0 ? 'Pese e organize os insumos na bancada.' : 'Mantenha fogo constante para cozimento uniforme.',
          isKeyFrame: true,
          timerSeconds: 120,
        }));
        db.prepare('UPDATE daily_discovered_recipes SET recipe_json = ? WHERE id = ?').run(JSON.stringify(r), row.id);
      }
    }
  } catch {}

  // Recalcula custos das receitas com os preços gastronômicos de referência
  try {
    recalcRecipesCost();
  } catch (err) {
    console.error('Aviso ao recalcular receitas:', err);
  }
}

export function getAllRecipes() {
  const rows = db.prepare('SELECT * FROM recipes ORDER BY rowid DESC').all();
  return rows.map((r) => {
    const ingredients = JSON.parse(r.ingredients_json);
    const totalBaseCost = ingredients.reduce((sum, ing) => sum + Number(ing.basePrice || 0), 0);
    const costPerServing = totalBaseCost / (r.servings || 1);
    let sections = [];
    try {
      sections = r.sections_json ? JSON.parse(r.sections_json) : [];
    } catch {}
    let stepDetails = [];
    try {
      stepDetails = r.step_details_json ? JSON.parse(r.step_details_json) : [];
    } catch {}
    let chefTips = null;
    try {
      chefTips = r.chef_tips_json ? JSON.parse(r.chef_tips_json) : null;
    } catch {}

    return {
      id: r.id,
      title: r.title,
      category: r.category,
      prepTime: r.prep_time,
      servings: r.servings,
      calories: r.calories,
      protein: r.protein,
      carbs: r.carbs,
      fat: r.fat,
      tags: JSON.parse(r.tags_json),
      image: r.image,
      source: r.source,
      ingredients,
      steps: JSON.parse(r.steps_json),
      stepDetails,
      sections,
      chefTips,
      portionWeight: r.portion_weight || '350g por porção',
      platingInstructions:
        r.plating_instructions ||
        'Dispor a porção centralizada em prato aquecido e finalizar com ervas frescas.',
      specificInstructions:
        r.specific_instructions ||
        'Manter sob refrigeração até o momento do preparo. Verificar ponto de sal antes do serviço.',
      baseCost: Number(totalBaseCost.toFixed(2)),
      costPerServing: Number(costPerServing.toFixed(2)),
    };
  });
}

export function generateSmartMealPlan(weeklyBudget, dietaryFilter, householdSize = 2) {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const slots = ['Café da Manhã', 'Almoço', 'Jantar'];
  const allRecipes = getAllRecipes();
  if (allRecipes.length === 0) return;

  const matchesDiet = (r) => {
    if (!dietaryFilter || dietaryFilter === 'Todas') return true;
    return r.tags.includes(dietaryFilter);
  };

  let eligible = allRecipes.filter(matchesDiet);
  if (eligible.length < 3) eligible = allRecipes;

  db.exec('DELETE FROM meal_plans');
  const insertSlot = db.prepare('INSERT INTO meal_plans (day, slot, recipe_id) VALUES (?, ?, ?)');

  let runningTotal = 0;
  const usedCounts = new Map();

  for (let dIdx = 0; dIdx < days.length; dIdx++) {
    const day = days[dIdx];
    for (const slot of slots) {
      let pool = eligible.filter((r) => r.category === slot);
      if (pool.length === 0) pool = eligible;

      const scored = pool.map((r) => {
        const slotCost = r.costPerServing * householdSize;
        return { recipe: r, slotCost };
      });

      const remainingSlots = (days.length - dIdx) * 3 - slots.indexOf(slot);
      const maxAllowedSlotCost = Math.max(4, (weeklyBudget - runningTotal) / Math.max(1, remainingSlots));

      const affordable = scored.filter((s) => s.slotCost <= maxAllowedSlotCost * 1.15);
      const candidateList = (affordable.length > 0 ? affordable : scored).sort((a, b) => {
        const uA = usedCounts.get(a.recipe.id) || 0;
        const uB = usedCounts.get(b.recipe.id) || 0;
        if (uA !== uB) return uA - uB;
        return a.slotCost - b.slotCost;
      });

      const chosen = candidateList[(dIdx + slots.indexOf(slot)) % Math.min(3, candidateList.length)];
      runningTotal += chosen.slotCost;
      usedCounts.set(chosen.recipe.id, (usedCounts.get(chosen.recipe.id) || 0) + 1);
      insertSlot.run(day, slot, chosen.recipe.id);
    }
  }
}

export const SUGGESTION_RECIPES = ROBUST_RECIPE_VAULT;

export function getTodayDateKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function ensureDailyDiscoveryRefresh() {
  const todayKey = getTodayDateKey();
  const user = db.prepare('SELECT id, last_discovery_date FROM users ORDER BY id ASC LIMIT 1').get();
  if (!user) return { refreshedToday: false, todayKey };

  if (user.last_discovery_date !== todayKey) {
    // 1x por dia: renova a pilha de descobertas liberando pratos descartados em dias anteriores e rotacionando o lote do dia
    db.prepare(
      "DELETE FROM suggestion_swipes WHERE action = 'left' AND substr(swiped_at, 1, 10) < ?"
    ).run(todayKey);
    db.prepare('UPDATE users SET last_discovery_date = ? WHERE id = ?').run(todayKey, user.id);
    return { refreshedToday: true, todayKey };
  }

  return { refreshedToday: false, todayKey };
}

export function getSuggestionsState(fridgeItems = [], marketPrices = []) {
  const { todayKey } = ensureDailyDiscoveryRefresh();

  const existingRecipes = getAllRecipes();
  const existingTitles = new Set(existingRecipes.map((r) => r.title.toLowerCase().trim()));
  const existingIds = new Set(existingRecipes.map((r) => r.id));

  const swipedRows = db.prepare('SELECT * FROM suggestion_swipes ORDER BY id DESC').all();
  const swipedMap = new Map(swipedRows.map((row) => [row.suggestion_id, row]));

  // Calcula o perfil de escolhas do usuário com base no histórico real
  const tasteProfile = computeUserTasteProfile(swipedRows, existingRecipes);

  const discoveredRows = db
    .prepare('SELECT * FROM daily_discovered_recipes ORDER BY date_added DESC')
    .all();
  const discoveredPool = discoveredRows
    .map((r) => {
      try {
        return JSON.parse(r.recipe_json);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const combinedPool = [...discoveredPool, ...SUGGESTION_RECIPES];
  const seenPoolIds = new Set();

  const available = [];
  let dismissedCount = 0;

  for (const sug of combinedPool) {
    if (seenPoolIds.has(sug.id)) continue;
    seenPoolIds.add(sug.id);

    const swipe = swipedMap.get(sug.id);
    if (swipe?.action === 'left') {
      dismissedCount++;
      continue;
    }
    if (
      swipe?.action === 'right' ||
      existingIds.has(sug.id) ||
      existingTitles.has(sug.title.toLowerCase().trim())
    ) {
      continue;
    }

    available.push(sug);
  }

  // Constrói mapa de preços médios calibrados
  const marketPricesMap = new Map();
  for (const p of marketPrices) {
    const key = p.ingredient_key || p.key;
    if (key) {
      marketPricesMap.set(key, p);
    }
  }

  // Enriquece e ranqueia com match de geladeira e afinidade de paladar
  const enrichedSuggestions = enrichAndRankSuggestions(
    available,
    fridgeItems,
    tasteProfile,
    marketPricesMap,
    todayKey
  );

  const lastSwipeRow = swipedRows[0] || null;
  const lastSwipe = lastSwipeRow
    ? {
        suggestionId: lastSwipeRow.suggestion_id,
        action: lastSwipeRow.action,
        recipe: JSON.parse(lastSwipeRow.recipe_json),
      }
    : null;

  return {
    suggestions: enrichedSuggestions,
    dismissedCount,
    lastSwipe,
    discoveryDate: todayKey,
    tasteProfile,
  };
}

// ============================================================================
// CALIBRAÇÃO DE PREÇOS REAIS & GESTÃO DE CUPONS FISCAIS (SEFAZ / NFC-e)
// ============================================================================

export function getMarketPrices() {
  return db.prepare('SELECT * FROM ingredient_market_prices ORDER BY display_name ASC').all();
}

export function saveGroceryInvoice({ supermarket, purchaseDate, totalValue, items }) {
  const stmt = db.prepare(`
    INSERT INTO grocery_invoices (supermarket, purchase_date, total_value, items_count, items_json)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    supermarket || 'Supermercado',
    purchaseDate || new Date().toISOString().split('T')[0],
    Number(totalValue) || 0,
    items?.length || 0,
    JSON.stringify(items || [])
  );
  return result.lastInsertRowid;
}

export function getGroceryHistory() {
  const rows = db.prepare('SELECT * FROM grocery_invoices ORDER BY id DESC LIMIT 20').all();
  return rows.map((r) => ({
    id: r.id,
    supermarket: r.supermarket,
    purchaseDate: r.purchase_date,
    totalValue: r.total_value,
    itemsCount: r.items_count,
    items: JSON.parse(r.items_json || '[]'),
    createdAt: r.created_at,
  }));
}

export function calibrateMarketPrices(items, supermarket = '') {
  const upsertPrice = db.prepare(`
    INSERT INTO ingredient_market_prices (
      ingredient_key, display_name, aisle, std_unit, last_unit_price, avg_unit_price, sample_count, last_supermarket, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, 1, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(ingredient_key) DO UPDATE SET
      last_unit_price = excluded.last_unit_price,
      avg_unit_price = CASE
        WHEN ingredient_market_prices.sample_count <= 0 THEN excluded.last_unit_price
        ELSE ROUND(((ingredient_market_prices.avg_unit_price * MIN(ingredient_market_prices.sample_count, 8)) + excluded.last_unit_price) / (MIN(ingredient_market_prices.sample_count, 8) + 1), 2)
      END,
      sample_count = ingredient_market_prices.sample_count + 1,
      last_supermarket = excluded.last_supermarket,
      updated_at = CURRENT_TIMESTAMP
  `);

  let calibratedCount = 0;
  for (const item of items) {
    if (!item.matchedKey || item.isNonFood || !item.pricePerStdUnit || item.pricePerStdUnit <= 0) continue;
    upsertPrice.run(
      item.matchedKey,
      item.matchedName || item.rawName,
      item.aisle || 'Mercearia',
      item.stdUnit || 'kg',
      Number(item.pricePerStdUnit),
      Number(item.pricePerStdUnit),
      supermarket || 'Supermercado'
    );
    calibratedCount++;
  }

  // Após calibrar os preços médios no mercado, recalcula os custos nas fichas técnicas com precisão culinária
  try {
    recalcRecipesCost();
  } catch (err) {
    console.error('Erro ao recalcular receitas:', err);
  }

  return calibratedCount;
}

export function updateMarketPrice(key, newPrice, supermarket = 'Ajuste Manual do Usuário') {
  const price = Number(newPrice);
  if (!key || isNaN(price) || price <= 0) return null;

  const stmt = db.prepare(`
    UPDATE ingredient_market_prices
    SET last_unit_price = ?,
        avg_unit_price = ?,
        sample_count = CASE WHEN sample_count <= 0 THEN 1 ELSE sample_count + 1 END,
        last_supermarket = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE ingredient_key = ?
  `);
  stmt.run(price, price, supermarket, key);

  try {
    recalcRecipesCost();
  } catch (err) {
    console.error('Erro ao recalcular receitas após ajuste:', err);
  }

  return getMarketPrices();
}

export function stockFridgeFromInvoice(items) {
  const findFridge = db.prepare('SELECT id, amount, unit FROM fridge_items WHERE LOWER(name) = LOWER(?)');
  const updateFridge = db.prepare('UPDATE fridge_items SET amount = ROUND(amount + ?, 2), unit = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?');
  const insertFridge = db.prepare('INSERT INTO fridge_items (name, category, amount, unit, last_updated) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)');

  let stockedCount = 0;
  for (const item of items) {
    if (!item.stockInFridge) continue;
    const itemName = item.matchedName || item.rawName;
    const category = item.aisle || 'Hortifruti';
    let amount = Number(item.quantity) || 1;
    let unit = (item.unit || 'un').toLowerCase();

    const existing = findFridge.get(itemName.trim());
    if (existing) {
      const exUnit = (existing.unit || 'un').toLowerCase();
      if (exUnit === 'kg' && unit === 'g') {
        amount = amount / 1000;
        unit = 'kg';
      } else if (exUnit === 'g' && unit === 'kg') {
        amount = amount * 1000;
        unit = 'g';
      } else if (exUnit === 'l' && unit === 'ml') {
        amount = amount / 1000;
        unit = 'l';
      } else if (exUnit === 'ml' && unit === 'l') {
        amount = amount * 1000;
        unit = 'ml';
      }
      updateFridge.run(amount, unit, existing.id);
    } else {
      insertFridge.run(itemName.trim(), category, amount, unit);
    }
    stockedCount++;
  }

  return stockedCount;
}

export function recalcRecipesCost() {
  const marketPrices = db.prepare('SELECT ingredient_key, display_name, std_unit, avg_unit_price FROM ingredient_market_prices').all();
  if (marketPrices.length === 0) return;

  const priceMap = new Map();
  for (const mp of marketPrices) {
    priceMap.set(mp.ingredient_key, mp);
  }

  const recipes = db.prepare('SELECT id, servings, ingredients_json FROM recipes').all();
  const updateRecipe = db.prepare('UPDATE recipes SET ingredients_json = ? WHERE id = ?');

  for (const r of recipes) {
    let ingList = [];
    try {
      ingList = JSON.parse(r.ingredients_json || '[]');
    } catch {
      continue;
    }

    let modified = false;
    for (const ing of ingList) {
      const calculatedPrice = computeCulinaryPortionCost(
        ing.name,
        ing.amount,
        ing.unit,
        priceMap
      );

      if (calculatedPrice > 0 && Math.abs(calculatedPrice - (Number(ing.basePrice) || 0)) > 0.02) {
        ing.basePrice = calculatedPrice;
        modified = true;
      }
    }

    if (modified) {
      updateRecipe.run(JSON.stringify(ingList), r.id);
    }
  }
}
