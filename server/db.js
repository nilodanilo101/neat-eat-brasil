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

export const SUGGESTION_RECIPES = [
  {
    id: 'sug-1',
    title: 'Pão de Queijo de Frigideira Mineiro',
    category: 'Café da Manhã',
    prepTime: 10,
    servings: 1,
    calories: 295,
    protein: 14,
    carbs: 28,
    fat: 13,
    tags: ['Sem Glúten', 'Rápido', 'Vegetariano', 'Econômico'],
    image: '/dishes/sug-1.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '160g por porção',
    platingInstructions:
      'Dobrar ao meio ou servir em disco dourado em prato de cerâmica aquecido, exibindo o queijo derretido no interior.',
    specificInstructions:
      'Assar em fogo baixo com frigideira antiaderente tampada nos primeiros 3 minutos para crescer uniformemente.',
    ingredients: [
      { name: 'Polvilho doce ou goma de tapioca', amount: 40, unit: 'g', aisle: 'Mercearia', basePrice: 0.90 },
      { name: 'Ovo', amount: 1, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 0.95 },
      { name: 'Queijo minas meia cura ou muçarela', amount: 45, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 2.40 },
      { name: 'Requeijão cremoso', amount: 25, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 1.10 },
    ],
    steps: [
      'Bata o ovo com o requeijão, o polvilho e uma pitada de sal até obter massa lisa.',
      'Incorpore o queijo ralado e despeje em frigideira antiaderente levemente untada.',
      'Doure dos dois lados em fogo baixo até formar crosta dourada de pão de queijo.',
    ],
  },
  {
    id: 'sug-2',
    title: 'Panqueca Fit de Banana com Aveia e Canela',
    category: 'Café da Manhã',
    prepTime: 12,
    servings: 1,
    calories: 310,
    protein: 15,
    carbs: 42,
    fat: 8,
    tags: ['Econômico', 'Rápido', 'Vegetariano', 'Sem Lactose'],
    image: '/dishes/sug-2.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '210g por porção',
    platingInstructions:
      'Empilhar dois discos médios centralizados no prato, finalizar com rodelas de banana fresca, fio de mel e canela polvilhada.',
    specificInstructions:
      'Utilizar bananas bem maduras (casca pintada) para garantir dulçor natural sem necessidade de açúcar refinado.',
    ingredients: [
      { name: 'Banana nanica', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.10 },
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
      { name: 'Aveia em flocos', amount: 35, unit: 'g', aisle: 'Mercearia', basePrice: 0.85 },
      { name: 'Canela em pó', amount: 3, unit: 'g', aisle: 'Temperos', basePrice: 0.25 },
    ],
    steps: [
      'Amasse a banana e misture vigorosamente com os ovos, a aveia e a canela.',
      'Aqueça uma frigideira antiaderente em fogo baixo e forme discos pequenos.',
      'Doure por 2 minutos de cada lado e sirva empilhado.',
    ],
  },
  {
    id: 'sug-3',
    title: 'Tapioca Recheada com Queijo e Ovo Cremoso',
    category: 'Café da Manhã',
    prepTime: 8,
    servings: 1,
    calories: 330,
    protein: 19,
    carbs: 31,
    fat: 14,
    tags: ['Sem Glúten', 'Rápido', 'Alta Proteína', 'Vegetariano'],
    image: '/dishes/sug-3.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '190g por porção',
    platingInstructions:
      'Fechar a tapioca em meia-lua com o queijo gratinando nas bordas e finalizar com orégano seco.',
    specificInstructions:
      'Peneirar a goma de tapioca diretamente na frigideira quente para obter textura fina e maleável.',
    ingredients: [
      { name: 'Goma de tapioca', amount: 65, unit: 'g', aisle: 'Mercearia', basePrice: 1.30 },
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
      { name: 'Queijo muçarela', amount: 40, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 2.10 },
      { name: 'Orégano seco', amount: 2, unit: 'g', aisle: 'Temperos', basePrice: 0.15 },
    ],
    steps: [
      'Espalhe a goma de tapioca na frigideira aquecida até unir em disco.',
      'Adicione os ovos mexidos cremosos e as fatias de queijo sobre metade do disco.',
      'Dobre ao meio, deixe o queijo derreter por 1 minuto e sirva imediatamente.',
    ],
  },
  {
    id: 'sug-4',
    title: 'Vitamina Cremosa de Abacate com Aveia',
    category: 'Café da Manhã',
    prepTime: 5,
    servings: 1,
    calories: 340,
    protein: 12,
    carbs: 29,
    fat: 19,
    tags: ['Rápido', 'Vegetariano', 'Sem Glúten', 'Econômico'],
    image: '/dishes/sug-4.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '350ml por porção',
    platingInstructions:
      'Servir em copo alto resfriado com farelo fino de aveia e hortelã fresca no topo.',
    specificInstructions:
      'Bater com leite gelado e pedras de gelo no momento do serviço para evitar oxidação do abacate.',
    ingredients: [
      { name: 'Abacate maduro', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.90 },
      { name: 'Leite integral', amount: 200, unit: 'ml', aisle: 'Laticínios e Ovos', basePrice: 1.30 },
      { name: 'Aveia em flocos', amount: 25, unit: 'g', aisle: 'Mercearia', basePrice: 0.65 },
      { name: 'Mel ou adoçante', amount: 10, unit: 'g', aisle: 'Mercearia', basePrice: 0.45 },
    ],
    steps: [
      'Coloque a polpa de abacate gelada, o leite, a aveia e o mel no liquidificador.',
      'Bata em velocidade alta por 45 segundos até atingir textura aveludada.',
      'Sirva imediatamente em copo resfriado.',
    ],
  },
  {
    id: 'sug-5',
    title: 'Bolo de Caneca de Banana e Cacau Sem Leite',
    category: 'Café da Manhã',
    prepTime: 7,
    servings: 1,
    calories: 275,
    protein: 11,
    carbs: 38,
    fat: 8,
    tags: ['Sem Lactose', 'Rápido', 'Econômico', 'Vegetariano'],
    image: '/dishes/sug-5.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '165g por porção',
    platingInstructions:
      'Servir na própria caneca de porcelana ou desenformado em prato de sobremesa com fios de calda de cacau.',
    specificInstructions:
      'Não ultrapassar 2 minutos de cocção no micro-ondas para preservar a umidade interna da massa.',
    ingredients: [
      { name: 'Banana nanica', amount: 90, unit: 'g', aisle: 'Hortifruti', basePrice: 0.85 },
      { name: 'Ovo', amount: 1, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 0.95 },
      { name: 'Aveia em flocos', amount: 30, unit: 'g', aisle: 'Mercearia', basePrice: 0.75 },
      { name: 'Cacau em pó 100%', amount: 12, unit: 'g', aisle: 'Mercearia', basePrice: 0.95 },
    ],
    steps: [
      'Amasse bem a banana dentro de uma caneca grande e misture o ovo.',
      'Adicione a aveia, o cacau em pó e meia colher de chá de fermento químico.',
      'Asse por 1 minuto e 45 segundos em potência alta e sirva quente.',
    ],
  },
  {
    id: 'sug-6',
    title: 'Avocado Toast Brasileiro com Ovo Cremoso',
    category: 'Café da Manhã',
    prepTime: 10,
    servings: 1,
    calories: 325,
    protein: 14,
    carbs: 26,
    fat: 18,
    tags: ['Rápido', 'Vegetariano'],
    image: '/dishes/sug-6.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '185g por porção',
    platingInstructions:
      'Montar sobre fatia rústica tostada, espalhar o creme de abacate temperado com limão e posicionar o ovo no topo.',
    specificInstructions:
      'Temperar a pasta de abacate com gotas de limão taiti imediatamente após amassar para manter o verde vibrante.',
    ingredients: [
      { name: 'Pão integral', amount: 60, unit: 'g', aisle: 'Padaria', basePrice: 1.40 },
      { name: 'Abacate maduro', amount: 85, unit: 'g', aisle: 'Hortifruti', basePrice: 1.50 },
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
      { name: 'Limão taiti', amount: 15, unit: 'ml', aisle: 'Hortifruti', basePrice: 0.25 },
    ],
    steps: [
      'Toste o pão integral na frigideira até ficar crocante.',
      'Amasse o abacate com gotas de limão, sal e pimenta-do-reino.',
      'Espalhe sobre a torrada, finalize com os ovos preparados na hora e sirva.',
    ],
  },
  {
    id: 'sug-7',
    title: 'Baião de Dois Nordestino com Queijo Coalho',
    category: 'Almoço',
    prepTime: 30,
    servings: 3,
    calories: 520,
    protein: 29,
    carbs: 54,
    fat: 19,
    tags: ['Econômico', 'Alta Proteína', 'Sem Glúten'],
    image: '/dishes/sug-7.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '390g por porção',
    platingInstructions:
      'Enformar em aro redondo ou tigela de barro, coroar com cubos dourados de queijo coalho e coentro fresco picado.',
    specificInstructions:
      'Cozinhar o arroz no próprio caldo do feijão para absorver cor, sabor e manter o prato úmido.',
    ingredients: [
      { name: 'Arroz branco', amount: 220, unit: 'g', aisle: 'Mercearia', basePrice: 1.65 },
      { name: 'Feijão carioca cozido', amount: 260, unit: 'g', aisle: 'Mercearia', basePrice: 2.30 },
      { name: 'Queijo coalho', amount: 150, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 6.50 },
      { name: 'Linguiça calabresa ou bacon em cubos', amount: 120, unit: 'g', aisle: 'Açougue', basePrice: 4.80 },
      { name: 'Cebola', amount: 80, unit: 'g', aisle: 'Hortifruti', basePrice: 0.65 },
    ],
    steps: [
      'Doure a calabresa em cubos com cebola e alho até liberar aroma.',
      'Junte o arroz, o feijão cozido com seu caldo e cozinhe até ficar cremoso.',
      'Misture metade do queijo coalho na panela e finalize o topo com cubos grelhados.',
    ],
  },
  {
    id: 'sug-8',
    title: 'Picadinho de Carne Bovina com Legumes da Horta',
    category: 'Almoço',
    prepTime: 35,
    servings: 3,
    calories: 430,
    protein: 35,
    carbs: 34,
    fat: 15,
    tags: ['Alta Proteína', 'Sem Glúten', 'Sem Lactose', 'Econômico'],
    image: '/dishes/sug-8.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '380g por porção',
    platingInstructions:
      'Servir o picadinho encorpado na metade principal do prato fundo aquecido, acompanhado de arroz branco soltinho.',
    specificInstructions:
      'Selar os cubos de carne em lotes pequenos em fogo forte antes de adicionar água para garantir molho escuro e saboroso.',
    ingredients: [
      { name: 'Carne bovina em cubos (acém ou patinho)', amount: 450, unit: 'g', aisle: 'Açougue', basePrice: 16.20 },
      { name: 'Cenoura', amount: 140, unit: 'g', aisle: 'Hortifruti', basePrice: 1.15 },
      { name: 'Batata inglesa', amount: 200, unit: 'g', aisle: 'Hortifruti', basePrice: 1.60 },
      { name: 'Tomate', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.10 },
      { name: 'Cebola', amount: 90, unit: 'g', aisle: 'Hortifruti', basePrice: 0.70 },
    ],
    steps: [
      'Sele os cubos de carne em panela bem quente com fio de azeite até dourarem.',
      'Acrescente cebola, alho e tomate picados para deglaçar o fundo da panela.',
      'Adicione água quente, a cenoura e a batata em cubos e cozinhe até ficarem macios e o caldo encorpar.',
    ],
  },
  {
    id: 'sug-9',
    title: 'Frango Xadrez Oriental com Pimentões',
    category: 'Almoço',
    prepTime: 22,
    servings: 2,
    calories: 390,
    protein: 38,
    carbs: 28,
    fat: 13,
    tags: ['Alta Proteína', 'Rápido', 'Sem Lactose'],
    image: '/dishes/sug-9.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '340g por porção',
    platingInstructions:
      'Dispor o frango xadrez brilhante com pimentões coloridos ainda crocantes e finalizar com amendoim ou castanha torrada.',
    specificInstructions:
      'Saltear os pimentões e a cebola em pétalas por apenas 2 minutos em fogo alto para manterem textura al dente.',
    ingredients: [
      { name: 'Peito de frango', amount: 350, unit: 'g', aisle: 'Açougue', basePrice: 7.90 },
      { name: 'Pimentão colorido', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.80 },
      { name: 'Cebola', amount: 90, unit: 'g', aisle: 'Hortifruti', basePrice: 0.70 },
      { name: 'Amendoim torrado sem pele', amount: 35, unit: 'g', aisle: 'Mercearia', basePrice: 1.10 },
      { name: 'Arroz branco', amount: 140, unit: 'g', aisle: 'Mercearia', basePrice: 1.10 },
    ],
    steps: [
      'Corte o peito de frango em cubos de 2,5cm e sele em frigideira ampla bem quente.',
      'Adicione a cebola e os pimentões cortados em quadrados e salteie rapidamente.',
      'Envolva no molho aromático encorpado, finalize com o amendoim crocante e sirva com arroz.',
    ],
  },
  {
    id: 'sug-10',
    title: 'Moqueca Capixaba de Peixe com Coentro Fresco',
    category: 'Almoço',
    prepTime: 28,
    servings: 2,
    calories: 370,
    protein: 36,
    carbs: 24,
    fat: 14,
    tags: ['Alta Proteína', 'Sem Glúten', 'Sem Lactose'],
    image: '/dishes/sug-10.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '360g por porção',
    platingInstructions:
      'Apresentar as postas de peixe íntegras banhadas pelo molho avermelhado de tomate e urucum, finalizadas com coentro e cebolinha.',
    specificInstructions:
      'Não mexer com colher após dispor os filés de peixe; apenas girar a panela pelas alças para não quebrar as postas.',
    ingredients: [
      { name: 'Filé de tilápia', amount: 350, unit: 'g', aisle: 'Peixaria', basePrice: 14.50 },
      { name: 'Tomate', amount: 180, unit: 'g', aisle: 'Hortifruti', basePrice: 1.60 },
      { name: 'Cebola', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 0.80 },
      { name: 'Azeite de oliva', amount: 15, unit: 'ml', aisle: 'Mercearia', basePrice: 1.10 },
      { name: 'Arroz branco', amount: 130, unit: 'g', aisle: 'Mercearia', basePrice: 1.05 },
    ],
    steps: [
      'Tempere os filés de peixe com limão, alho e sal por 10 minutos.',
      'Monte camadas de rodelas de cebola, tomate e peixe na panela com fio de azeite e colorau.',
      'Tampe e cozinhe em fogo médio por 15 minutos até o molho apurar.',
    ],
  },
  {
    id: 'sug-11',
    title: 'Bobó de Frango Cremoso com Mandioca',
    category: 'Almoço',
    prepTime: 30,
    servings: 3,
    calories: 460,
    protein: 33,
    carbs: 46,
    fat: 14,
    tags: ['Econômico', 'Alta Proteína', 'Sem Glúten'],
    image: '/dishes/sug-11.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '370g por porção',
    platingInstructions:
      'Servir em prato fundo aquecido com textura cremosa aveludada e finalizar com cheiro-verde picado.',
    specificInstructions:
      'Bater a mandioca cozida ainda quente com o próprio caldo do cozimento para obter creme liso sem grumos.',
    ingredients: [
      { name: 'Peito de frango', amount: 400, unit: 'g', aisle: 'Açougue', basePrice: 8.90 },
      { name: 'Mandioca descascada', amount: 350, unit: 'g', aisle: 'Hortifruti', basePrice: 2.90 },
      { name: 'Leite de coco', amount: 150, unit: 'ml', aisle: 'Mercearia', basePrice: 2.80 },
      { name: 'Tomate', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.10 },
      { name: 'Cebola', amount: 80, unit: 'g', aisle: 'Hortifruti', basePrice: 0.65 },
    ],
    steps: [
      'Cozinhe a mandioca até ficar macia e bata no liquidificador formando um creme.',
      'Refogue o frango em cubos ou tiras com cebola, alho e tomate.',
      'Incorpore o creme de mandioca e o leite de coco, apure por 5 minutos e sirva.',
    ],
  },
  {
    id: 'sug-12',
    title: 'Arroz de Forno Cremoso com Frango Desfiado',
    category: 'Almoço',
    prepTime: 25,
    servings: 3,
    calories: 475,
    protein: 31,
    carbs: 48,
    fat: 16,
    tags: ['Econômico', 'Alta Proteína', 'Sem Glúten'],
    image: '/dishes/sug-12.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '360g por porção',
    platingInstructions:
      'Retirar porção retangular firme do refratário preservando a camada superior de queijo muçarela gratinado.',
    specificInstructions:
      'Ideal para aproveitamento nobre de arroz já cozido; gratinar nos últimos 8 minutos em forno a 220°C.',
    ingredients: [
      { name: 'Peito de frango', amount: 350, unit: 'g', aisle: 'Açougue', basePrice: 7.90 },
      { name: 'Arroz branco', amount: 240, unit: 'g', aisle: 'Mercearia', basePrice: 1.80 },
      { name: 'Queijo muçarela', amount: 100, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 4.90 },
      { name: 'Requeijão cremoso', amount: 100, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 3.40 },
      { name: 'Tomate', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 0.90 },
    ],
    steps: [
      'Refogue o frango desfiado com tomate, cebola e envolva com o requeijão e o arroz cozido.',
      'Transfira para refratário, cubra com a muçarela e leve ao forno até borbulhar e dourar.',
    ],
  },
  {
    id: 'sug-13',
    title: 'Panqueca Caseira de Carne Moída ao Molho Sugo',
    category: 'Jantar',
    prepTime: 25,
    servings: 2,
    calories: 440,
    protein: 29,
    carbs: 38,
    fat: 17,
    tags: ['Econômico', 'Alta Proteína'],
    image: '/dishes/sug-13.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '320g por porção',
    platingInstructions:
      'Posicionar dois rolos de panqueca lado a lado no centro do prato, cobrir a faixa central com molho de tomate rústico e queijo gratinado.',
    specificInstructions:
      'Escorrer eventual excesso de líquido da carne moída antes de enrolar para manter a massa firme.',
    ingredients: [
      { name: 'Carne moída (patinho ou acém)', amount: 280, unit: 'g', aisle: 'Açougue', basePrice: 9.80 },
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
      { name: 'Leite integral', amount: 180, unit: 'ml', aisle: 'Laticínios e Ovos', basePrice: 1.15 },
      { name: 'Tomate', amount: 160, unit: 'g', aisle: 'Hortifruti', basePrice: 1.45 },
      { name: 'Queijo muçarela', amount: 50, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 2.50 },
    ],
    steps: [
      'Prepare discos finos de massa na frigideira e reserve.',
      'Recheie com a carne moída bem temperada, enrole e cubra com molho de tomate e queijo para gratinar.',
    ],
  },
  {
    id: 'sug-14',
    title: 'Caldo Verde Português com Batata e Couve Fina',
    category: 'Jantar',
    prepTime: 25,
    servings: 3,
    calories: 320,
    protein: 14,
    carbs: 36,
    fat: 12,
    tags: ['Econômico', 'Sem Glúten', 'Sem Lactose'],
    image: '/dishes/sug-14.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '350ml por porção',
    platingInstructions:
      'Servir fumegante em cumbuca de porcelana, finalizar com rodelas douradas no centro e um fio de azeite extravirgem.',
    specificInstructions:
      'Adicionar a couve cortada em chiffonade finíssima apenas com o fogo já desligado para manter a cor verde viva.',
    ingredients: [
      { name: 'Batata inglesa', amount: 450, unit: 'g', aisle: 'Hortifruti', basePrice: 3.60 },
      { name: 'Couve manteiga', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.90 },
      { name: 'Linguiça calabresa', amount: 140, unit: 'g', aisle: 'Açougue', basePrice: 5.20 },
      { name: 'Cebola', amount: 70, unit: 'g', aisle: 'Hortifruti', basePrice: 0.55 },
      { name: 'Azeite de oliva', amount: 15, unit: 'ml', aisle: 'Mercearia', basePrice: 1.10 },
    ],
    steps: [
      'Cozinhe as batatas com cebola e alho e bata até formar um creme aveludado.',
      'Junte a calabresa dourada em rodelas, ferva por 2 minutos, desligue o fogo e incorpore a couve fatiada fina.',
    ],
  },
  {
    id: 'sug-15',
    title: 'Quiche Leve de Alho-Poró com Queijo Minas',
    category: 'Jantar',
    prepTime: 30,
    servings: 3,
    calories: 350,
    protein: 18,
    carbs: 24,
    fat: 19,
    tags: ['Vegetariano', 'Econômico'],
    image: '/dishes/sug-15.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '220g por porção',
    platingInstructions:
      'Servir fatia triangular alta e dourada acompanhada de folhas verdes frescas temperadas com azeite.',
    specificInstructions:
      'Aguardar 5 minutos fora do forno antes de fatiar para estabilizar o creme de ovos e queijo.',
    ingredients: [
      { name: 'Alho-poró fresco', amount: 160, unit: 'g', aisle: 'Hortifruti', basePrice: 3.90 },
      { name: 'Ovo', amount: 3, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 2.70 },
      { name: 'Queijo minas ou muçarela', amount: 120, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 5.40 },
      { name: 'Aveia em flocos', amount: 80, unit: 'g', aisle: 'Mercearia', basePrice: 1.80 },
      { name: 'Manteiga sem sal', amount: 35, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 1.90 },
    ],
    steps: [
      'Refogue o alho-poró em rodelas finas na manteiga até amaciar.',
      'Forre a forma com a base leve, despeje o creme de ovos com queijo e alho-poró e asse até dourar.',
    ],
  },
  {
    id: 'sug-16',
    title: 'Salada Caesar Completa com Tiras de Frango Grelhado',
    category: 'Jantar',
    prepTime: 15,
    servings: 2,
    calories: 345,
    protein: 36,
    carbs: 16,
    fat: 14,
    tags: ['Alta Proteína', 'Low Carb', 'Rápido'],
    image: '/dishes/sug-16.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '290g por porção',
    platingInstructions:
      'Montar cama volumosa de alface crocante, dispor as tiras de frango douradas em leque no topo, croutons e lascas de queijo.',
    specificInstructions:
      'Envolver as folhas no molho apenas no instante de servir para preservar a crocância.',
    ingredients: [
      { name: 'Peito de frango', amount: 300, unit: 'g', aisle: 'Açougue', basePrice: 6.90 },
      { name: 'Alface americana ou romana', amount: 180, unit: 'g', aisle: 'Hortifruti', basePrice: 2.80 },
      { name: 'Pão integral (para croutons)', amount: 50, unit: 'g', aisle: 'Padaria', basePrice: 1.20 },
      { name: 'Queijo parmesão ou muçarela', amount: 40, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 2.90 },
      { name: 'Iogurte natural integral', amount: 80, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 1.60 },
    ],
    steps: [
      'Grelhe o peito de frango temperado e corte em tiras suculentas.',
      'Toste cubos de pão na frigideira com fio de azeite e alho.',
      'Misture as folhas rasgadas com o molho cremoso, disponha o frango e finalize com croutons e queijo.',
    ],
  },
  {
    id: 'sug-17',
    title: 'Wrap Integral de Frango com Salada Crocante',
    category: 'Jantar',
    prepTime: 12,
    servings: 2,
    calories: 365,
    protein: 31,
    carbs: 33,
    fat: 11,
    tags: ['Rápido', 'Alta Proteína', 'Econômico'],
    image: '/dishes/sug-17.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '260g por porção',
    platingInstructions:
      'Cortar o wrap fechado ao meio em ângulo diagonal de 45° para exibir as camadas internas coloridas.',
    specificInstructions:
      'Selar a dobra do wrap na frigideira quente por 40 segundos para não abrir durante o serviço.',
    ingredients: [
      { name: 'Peito de frango', amount: 260, unit: 'g', aisle: 'Açougue', basePrice: 5.95 },
      { name: 'Massa de wrap ou pão folha', amount: 120, unit: 'g', aisle: 'Padaria', basePrice: 3.80 },
      { name: 'Tomate', amount: 90, unit: 'g', aisle: 'Hortifruti', basePrice: 0.85 },
      { name: 'Cenoura', amount: 70, unit: 'g', aisle: 'Hortifruti', basePrice: 0.60 },
      { name: 'Requeijão cremoso', amount: 50, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
    ],
    steps: [
      'Espalhe o requeijão sobre o disco de wrap, adicione o frango grelhado em tiras, cenoura ralada e tomate.',
      'Enrole firmemente dobrando as laterais e doure rapidamente na frigideira.',
    ],
  },
  {
    id: 'sug-18',
    title: 'Creme Termogênico de Abóbora com Gengibre e Frango',
    category: 'Jantar',
    prepTime: 22,
    servings: 2,
    calories: 315,
    protein: 28,
    carbs: 26,
    fat: 9,
    tags: ['Low Carb', 'Sem Glúten', 'Sem Lactose', 'Alta Proteína'],
    image: '/dishes/sug-18.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '340g por porção',
    platingInstructions:
      'Servir o creme liso alaranjado em bowl aquecido e dispor o frango desfiado dourado em destaque no centro.',
    specificInstructions:
      'Ralar o gengibre fresco no final do cozimento para preservar o aroma cítrico e picante.',
    ingredients: [
      { name: 'Abóbora cabotiá', amount: 350, unit: 'g', aisle: 'Hortifruti', basePrice: 2.60 },
      { name: 'Peito de frango', amount: 240, unit: 'g', aisle: 'Açougue', basePrice: 5.50 },
      { name: 'Cebola', amount: 70, unit: 'g', aisle: 'Hortifruti', basePrice: 0.55 },
      { name: 'Gengibre fresco', amount: 10, unit: 'g', aisle: 'Hortifruti', basePrice: 0.35 },
      { name: 'Azeite de oliva', amount: 10, unit: 'ml', aisle: 'Mercearia', basePrice: 0.80 },
    ],
    steps: [
      'Cozinhe a abóbora em cubos com cebola e gengibre até amaciar e processe até virar creme aveludado.',
      'Sirva nas tigelas coroando com o peito de frango desfiado dourado no azeite.',
    ],
  },
  {
    id: 'sug-19',
    title: 'Waffle Crocante de Pão de Queijo Mineiro',
    category: 'Café da Manhã',
    prepTime: 12,
    servings: 2,
    calories: 305,
    protein: 15,
    carbs: 29,
    fat: 14,
    tags: ['Sem Glúten', 'Rápido', 'Vegetariano', 'Econômico'],
    image: '/dishes/sug-19.jpg',
    source: 'Ficha Técnica — Descoberta Diária',
    portionWeight: '175g por porção',
    platingInstructions:
      'Servir dois waffles dourados dispostos diagonalmente em prato raso aquecido com manteiga derretendo nas cavidades.',
    specificInstructions:
      'Pré-aquecer a máquina de waffle ou sanduicheira por 3 minutos antes de despejar a massa para garantir casca crocante.',
    ingredients: [
      { name: 'Polvilho doce', amount: 100, unit: 'g', aisle: 'Mercearia', basePrice: 1.90 },
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
      { name: 'Queijo muçarela ou meia cura', amount: 80, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 3.90 },
      { name: 'Leite integral', amount: 80, unit: 'ml', aisle: 'Laticínios e Ovos', basePrice: 0.65 },
    ],
    steps: [
      'Bata o leite, os ovos, o polvilho e uma pitada de sal até obter mistura homogênea.',
      'Incorpore o queijo ralado e asse na máquina de waffle até dourar.',
    ],
  },
  {
    id: 'sug-20',
    title: 'Mingau Cremoso de Aveia com Banana Caramelizada',
    category: 'Café da Manhã',
    prepTime: 10,
    servings: 1,
    calories: 315,
    protein: 13,
    carbs: 48,
    fat: 8,
    tags: ['Econômico', 'Rápido', 'Vegetariano'],
    image: '/dishes/sug-20.jpg',
    source: 'Ficha Técnica — Descoberta Diária',
    portionWeight: '280g por porção',
    platingInstructions:
      'Servir em cumbuca funda aquecida, dispor rodelas de banana douradas em meia-lua e polvilhar canela.',
    specificInstructions:
      'Mexer continuamente em fogo brando para liberar o amido da aveia e criar textura aveludada.',
    ingredients: [
      { name: 'Aveia em flocos', amount: 45, unit: 'g', aisle: 'Mercearia', basePrice: 1.05 },
      { name: 'Leite integral', amount: 220, unit: 'ml', aisle: 'Laticínios e Ovos', basePrice: 1.40 },
      { name: 'Banana nanica', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 0.90 },
      { name: 'Canela em pó', amount: 3, unit: 'g', aisle: 'Temperos', basePrice: 0.25 },
    ],
    steps: [
      'Cozinhe a aveia no leite em fogo baixo mexendo por 5 minutos até engrossar.',
      'Doure as rodelas de banana na frigideira com canela e disponha sobre o mingau.',
    ],
  },
  {
    id: 'sug-21',
    title: 'Feijão Tropeiro Mineiro Completo com Couve',
    category: 'Almoço',
    prepTime: 25,
    servings: 3,
    calories: 510,
    protein: 28,
    carbs: 49,
    fat: 21,
    tags: ['Econômico', 'Alta Proteína', 'Sem Lactose'],
    image: '/dishes/sug-21.jpg',
    source: 'Ficha Técnica — Descoberta Diária',
    portionWeight: '380g por porção',
    platingInstructions:
      'Servir em prato rústico aquecido, guarnecer com couve refogada fina na lateral e ovos mexidos dourados no topo.',
    specificInstructions:
      'Cozinhar o feijão al dente e escorrer todo o caldo para que o tropeiro fique úmido porém soltinho.',
    ingredients: [
      { name: 'Feijão carioca cozido (grãos firmes)', amount: 350, unit: 'g', aisle: 'Mercearia', basePrice: 3.10 },
      { name: 'Farinha de mandioca torrada', amount: 120, unit: 'g', aisle: 'Mercearia', basePrice: 1.40 },
      { name: 'Linguiça calabresa', amount: 160, unit: 'g', aisle: 'Açougue', basePrice: 5.90 },
      { name: 'Ovo', amount: 3, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 2.70 },
      { name: 'Couve manteiga', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 1.60 },
    ],
    steps: [
      'Doure a calabresa em cubos com cebola e alho, junte os ovos e mexa até cozinharem.',
      'Adicione o feijão escorrido, a couve fatiada fina e incorpore a farinha de mandioca aos poucos.',
    ],
  },
  {
    id: 'sug-22',
    title: 'Lasanha Leve de Abobrinha com Carne Moída e Queijo',
    category: 'Almoço',
    prepTime: 35,
    servings: 3,
    calories: 385,
    protein: 32,
    carbs: 18,
    fat: 20,
    tags: ['Low Carb', 'Sem Glúten', 'Alta Proteína'],
    image: '/dishes/sug-22.jpg',
    source: 'Ficha Técnica — Descoberta Diária',
    portionWeight: '360g por porção',
    platingInstructions:
      'Cortar fatia quadrada estruturada exibindo as lâminas de abobrinha intercaladas com bolonhesa e topo gratinado.',
    specificInstructions:
      'Grelhar rapidamente as lâminas de abobrinha antes da montagem para retirar o excesso de água.',
    ingredients: [
      { name: 'Abobrinha italiana', amount: 400, unit: 'g', aisle: 'Hortifruti', basePrice: 3.60 },
      { name: 'Carne moída (patinho ou acém)', amount: 350, unit: 'g', aisle: 'Açougue', basePrice: 12.20 },
      { name: 'Tomate', amount: 220, unit: 'g', aisle: 'Hortifruti', basePrice: 1.95 },
      { name: 'Queijo muçarela', amount: 140, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 6.80 },
    ],
    steps: [
      'Fatie a abobrinha no sentido do comprimento e sele rapidamente em frigideira quente.',
      'Intercale camadas de abobrinha, carne moída ao molho de tomate e queijo muçarela e leve ao forno para gratinar.',
    ],
  },
  {
    id: 'sug-23',
    title: 'Torta Cremosa de Frango de Liquidificador',
    category: 'Jantar',
    prepTime: 35,
    servings: 4,
    calories: 410,
    protein: 27,
    carbs: 36,
    fat: 16,
    tags: ['Econômico', 'Alta Proteína'],
    image: '/dishes/sug-23.jpg',
    source: 'Ficha Técnica — Descoberta Diária',
    portionWeight: '260g por porção',
    platingInstructions:
      'Servir fatia retangular dourada exibindo o recheio cremoso de frango desfiado com milho e ervas.',
    specificInstructions:
      'Deixar descansar por 8 minutos após sair do forno para corte limpo e uniforme das porções.',
    ingredients: [
      { name: 'Peito de frango', amount: 400, unit: 'g', aisle: 'Açougue', basePrice: 8.90 },
      { name: 'Ovo', amount: 3, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 2.70 },
      { name: 'Leite integral', amount: 250, unit: 'ml', aisle: 'Laticínios e Ovos', basePrice: 1.60 },
      { name: 'Farinha de trigo ou aveia', amount: 180, unit: 'g', aisle: 'Mercearia', basePrice: 1.50 },
      { name: 'Requeijão cremoso', amount: 100, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 3.40 },
    ],
    steps: [
      'Refogue o frango desfiado com temperos e requeijão até ficar cremoso.',
      'Bata a massa no liquidificador, despeje metade na forma, distribua o recheio, cubra e asse até dourar.',
    ],
  },
  {
    id: 'sug-24',
    title: 'Nhoque Caseiro de Batata-Doce ao Molho Rústico',
    category: 'Jantar',
    prepTime: 30,
    servings: 2,
    calories: 395,
    protein: 14,
    carbs: 62,
    fat: 9,
    tags: ['Econômico', 'Vegetariano'],
    image: '/dishes/sug-24.jpg',
    source: 'Ficha Técnica — Descoberta Diária',
    portionWeight: '330g por porção',
    platingInstructions:
      'Dispor os nhoques macios no centro do prato fundo, banhar com molho de tomate fresco e folhas de manjericão.',
    specificInstructions:
      'Assar ou cozinhar a batata-doce com casca para absorver menos água e exigir menos farinha na massa.',
    ingredients: [
      { name: 'Batata-doce', amount: 400, unit: 'g', aisle: 'Hortifruti', basePrice: 3.20 },
      { name: 'Aveia em flocos ou farinha', amount: 90, unit: 'g', aisle: 'Mercearia', basePrice: 1.90 },
      { name: 'Tomate', amount: 250, unit: 'g', aisle: 'Hortifruti', basePrice: 2.20 },
      { name: 'Queijo parmesão ou muçarela', amount: 40, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 2.80 },
    ],
    steps: [
      'Amasse a batata-doce cozida ainda morna e incorpore a farinha até formar massa macia.',
      'Modele os nhoques, cozinhe em água fervente até subirem e sirva com molho de tomate rústico.',
    ],
  },
];

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

export function getSuggestionsState() {
  const { todayKey } = ensureDailyDiscoveryRefresh();

  const existingRecipes = getAllRecipes();
  const existingTitles = new Set(existingRecipes.map((r) => r.title.toLowerCase().trim()));
  const existingIds = new Set(existingRecipes.map((r) => r.id));

  const swipedRows = db.prepare('SELECT * FROM suggestion_swipes ORDER BY id DESC').all();
  const swipedMap = new Map(swipedRows.map((row) => [row.suggestion_id, row]));

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

    const totalBaseCost = sug.ingredients.reduce((sum, ing) => sum + Number(ing.basePrice || 0), 0);
    const costPerServing = totalBaseCost / (sug.servings || 1);
    available.push({
      ...sug,
      baseCost: Number(totalBaseCost.toFixed(2)),
      costPerServing: Number(costPerServing.toFixed(2)),
    });
  }

  // Ordenação determinística diária (muda 1x por dia com base na data YYYY-MM-DD)
  available.sort((a, b) => {
    const scoreA = hashSeed(`${todayKey}:${a.id}`);
    const scoreB = hashSeed(`${todayKey}:${b.id}`);
    return scoreA - scoreB;
  });

  const lastSwipeRow = swipedRows[0] || null;
  const lastSwipe = lastSwipeRow
    ? {
        suggestionId: lastSwipeRow.suggestion_id,
        action: lastSwipeRow.action,
        recipe: JSON.parse(lastSwipeRow.recipe_json),
      }
    : null;

  return {
    suggestions: available,
    dismissedCount,
    lastSwipe,
    discoveryDate: todayKey,
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
      avg_unit_price = ROUND(((ingredient_market_prices.avg_unit_price * ingredient_market_prices.sample_count) + excluded.last_unit_price) / (ingredient_market_prices.sample_count + 1), 2),
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
      supermarket || ''
    );
    calibratedCount++;
  }

  // Após calibrar os preços médios no mercado, recalcula os custos nas fichas técnicas
  try {
    recalcRecipesCost();
  } catch (err) {
    console.error('Erro ao recalcular receitas:', err);
  }

  return calibratedCount;
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
      const normName = ing.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      for (const [key, mp] of priceMap.entries()) {
        const normKey = key.replace(/_/g, ' ');
        if (normName.includes(normKey) || normKey.includes(normName)) {
          const amount = Number(ing.amount) || 0;
          let calculatedPrice = ing.basePrice;
          if (ing.unit === 'g' && mp.std_unit === 'kg') {
            calculatedPrice = Number(((amount / 1000) * mp.avg_unit_price).toFixed(2));
          } else if (ing.unit === 'kg' && mp.std_unit === 'kg') {
            calculatedPrice = Number((amount * mp.avg_unit_price).toFixed(2));
          } else if (ing.unit === 'ml' && mp.std_unit === 'l') {
            calculatedPrice = Number(((amount / 1000) * mp.avg_unit_price).toFixed(2));
          } else if (ing.unit === 'l' && mp.std_unit === 'l') {
            calculatedPrice = Number((amount * mp.avg_unit_price).toFixed(2));
          } else if (['un', 'dente', 'folhas', 'colher'].includes(ing.unit)) {
            calculatedPrice = Number(Math.max(0.2, (amount * (mp.avg_unit_price / 10))).toFixed(2));
          }

          if (calculatedPrice > 0 && calculatedPrice !== ing.basePrice) {
            ing.basePrice = calculatedPrice;
            modified = true;
          }
          break;
        }
      }
    }

    if (modified) {
      updateRecipe.run(JSON.stringify(ingList), r.id);
    }
  }
}
