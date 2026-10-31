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

export const SUPERMARKETS = [
  {
    id: 'atacadao',
    name: 'Atacadão',
    tagline: 'Menor preço no atacado e varejo',
    multiplier: 0.84,
    color: '#F97316',
    badge: 'Mais Econômico (-16%)',
  },
  {
    id: 'assai',
    name: 'Assaí Atacadista',
    tagline: 'Economia para compras da semana',
    multiplier: 0.87,
    color: '#DC2626',
    badge: 'Atacado (-13%)',
  },
  {
    id: 'dia',
    name: 'Supermercado Dia',
    tagline: 'Marca própria com ótimo custo-benefício',
    multiplier: 0.92,
    color: '#EF4444',
    badge: 'Custo-Benefício (-8%)',
  },
  {
    id: 'carrefour',
    name: 'Carrefour',
    tagline: 'Grande variedade e ofertas semanais',
    multiplier: 1.0,
    color: '#2563EB',
    badge: 'Preço Base',
  },
  {
    id: 'paodeacucar',
    name: 'Pão de Açúcar',
    tagline: 'Linha premium, orgânicos e importados',
    multiplier: 1.24,
    color: '#16A34A',
    badge: 'Premium (+24%)',
  },
];

const INITIAL_RECIPES = [
  // CAFÉ DA MANHÃ
  {
    id: 'rec-1',
    title: 'Crepioca Proteica com Queijo Coalho e Tomate',
    category: 'Café da Manhã',
    prepTime: 10,
    servings: 1,
    calories: 320,
    protein: 21,
    carbs: 24,
    fat: 14,
    tags: ['Rápido', 'Sem Glúten', 'Vegetariano', 'Alta Proteína', 'Econômico'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    source: 'NeatEat Brasil Original',
    ingredients: [
      { name: 'Goma de tapioca', amount: 40, unit: 'g', aisle: 'Mercearia', basePrice: 0.95 },
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
      { name: 'Queijo coalho ou minas', amount: 40, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 2.40 },
      { name: 'Tomate', amount: 50, unit: 'g', aisle: 'Hortifruti', basePrice: 0.65 },
      { name: 'Orégano', amount: 2, unit: 'g', aisle: 'Temperos', basePrice: 0.15 },
    ],
    steps: [
      'Bata os ovos com a goma de tapioca e uma pitada de sal até ficar homogêneo.',
      'Despeje em frigideira antiaderente aquecida em fogo médio.',
      'Quando firmar, adicione o queijo, o tomate picado e o orégano, dobre ao meio e doure dos dois lados.'
    ]
  },
  {
    id: 'rec-2',
    title: 'Overnight Oats de Banana, Aveia e Pasta de Amendoim',
    category: 'Café da Manhã',
    prepTime: 5,
    servings: 1,
    calories: 380,
    protein: 15,
    carbs: 52,
    fat: 12,
    tags: ['Vegetariano', 'Econômico', 'Rápido'],
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80',
    source: 'NeatEat Brasil Original',
    ingredients: [
      { name: 'Aveia em flocos', amount: 50, unit: 'g', aisle: 'Mercearia', basePrice: 0.85 },
      { name: 'Leite integral ou vegetal', amount: 150, unit: 'ml', aisle: 'Laticínios e Ovos', basePrice: 1.10 },
      { name: 'Banana nanica', amount: 1, unit: 'un', aisle: 'Hortifruti', basePrice: 0.90 },
      { name: 'Pasta de amendoim', amount: 20, unit: 'g', aisle: 'Mercearia', basePrice: 1.20 },
      { name: 'Canela em pó', amount: 2, unit: 'g', aisle: 'Temperos', basePrice: 0.15 },
    ],
    steps: [
      'Em um pote de vidro, misture a aveia, o leite e a canela.',
      'Adicione rodelas de banana e a pasta de amendoim por cima.',
      'Deixe na geladeira durante a noite ou por pelo menos 2 horas antes de consumir.'
    ]
  },
  {
    id: 'rec-3',
    title: 'Ovos Mexidos Cremosos com Pão Francês e Mamão',
    category: 'Café da Manhã',
    prepTime: 8,
    servings: 1,
    calories: 360,
    protein: 18,
    carbs: 38,
    fat: 14,
    tags: ['Vegetariano', 'Econômico', 'Rápido'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    source: 'NeatEat Brasil Original',
    ingredients: [
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
      { name: 'Pão francês', amount: 1, unit: 'un', aisle: 'Padaria', basePrice: 0.95 },
      { name: 'Mamão papaia', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 1.40 },
      { name: 'Manteiga', amount: 10, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 0.65 },
    ],
    steps: [
      'Derreta a manteiga em fogo baixo e adicione os ovos batidos.',
      'Mexa delicadamente até obter textura cremosa.',
      'Sirva no pão francês quentinho acompanhado de mamão picado.'
    ]
  },
  {
    id: 'rec-4',
    title: 'Cuscuz Nordestino com Ovo Estrelado e Coentro',
    category: 'Café da Manhã',
    prepTime: 12,
    servings: 1,
    calories: 340,
    protein: 14,
    carbs: 45,
    fat: 11,
    tags: ['Sem Glúten', 'Sem Lactose', 'Vegetariano', 'Econômico'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    source: 'NeatEat Brasil Original',
    ingredients: [
      { name: 'Flocão de milho', amount: 70, unit: 'g', aisle: 'Mercearia', basePrice: 0.55 },
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
      { name: 'Azeite de oliva', amount: 5, unit: 'ml', aisle: 'Mercearia', basePrice: 0.45 },
      { name: 'Cheiro-verde / Coentro', amount: 10, unit: 'g', aisle: 'Hortifruti', basePrice: 0.30 },
    ],
    steps: [
      'Hidrate o flocão de milho com água e sal por 10 minutos.',
      'Cozinhe na cuscuzeira por 8 minutos.',
      'Frite os ovos no azeite e sirva sobre o cuscuz com cheiro-verde picado.'
    ]
  },

  // ALMOÇO
  {
    id: 'rec-5',
    title: 'PF Brasileiro: Frango Grelhado, Arroz, Feijão Carioca e Salada',
    category: 'Almoço',
    prepTime: 25,
    servings: 2,
    calories: 540,
    protein: 42,
    carbs: 58,
    fat: 12,
    tags: ['Sem Glúten', 'Sem Lactose', 'Alta Proteína', 'Econômico'],
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
    source: 'NeatEat Brasil Original',
    ingredients: [
      { name: 'Peito de frango', amount: 300, unit: 'g', aisle: 'Açougue', basePrice: 6.90 },
      { name: 'Arroz branco', amount: 150, unit: 'g', aisle: 'Mercearia', basePrice: 1.20 },
      { name: 'Feijão carioca cozido', amount: 200, unit: 'g', aisle: 'Mercearia', basePrice: 1.90 },
      { name: 'Alface americana', amount: 80, unit: 'g', aisle: 'Hortifruti', basePrice: 1.30 },
      { name: 'Tomate', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 1.30 },
      { name: 'Alho', amount: 10, unit: 'g', aisle: 'Hortifruti', basePrice: 0.40 },
    ],
    steps: [
      'Tempere os filés de peito de frango com alho, sal e limão e grelhe até dourar.',
      'Cozinhe o arroz soltinho e aqueça o feijão temperado com alho.',
      'Monte o prato com a salada fresca de alface e tomate.'
    ]
  },
  {
    id: 'rec-6',
    title: 'Picadinho de Carne Moída com Abóbora Cabotiá e Arroz Integral',
    category: 'Almoço',
    prepTime: 30,
    servings: 2,
    calories: 510,
    protein: 36,
    carbs: 48,
    fat: 16,
    tags: ['Sem Glúten', 'Sem Lactose', 'Alta Proteína', 'Econômico'],
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
    source: 'NeatEat Brasil Original',
    ingredients: [
      { name: 'Carne moída (patinho ou acém)', amount: 300, unit: 'g', aisle: 'Açougue', basePrice: 10.50 },
      { name: 'Abóbora cabotiá', amount: 250, unit: 'g', aisle: 'Hortifruti', basePrice: 2.10 },
      { name: 'Arroz branco', amount: 140, unit: 'g', aisle: 'Mercearia', basePrice: 1.15 },
      { name: 'Cebola', amount: 80, unit: 'g', aisle: 'Hortifruti', basePrice: 0.65 },
      { name: 'Alho', amount: 10, unit: 'g', aisle: 'Hortifruti', basePrice: 0.40 },
      { name: 'Cheiro-verde / Coentro', amount: 15, unit: 'g', aisle: 'Hortifruti', basePrice: 0.40 },
    ],
    steps: [
      'Refogue a carne moída com cebola e alho até ficar bem dourada.',
      'Adicione a abóbora em cubos e um pouco de água, tampando até a abóbora amaciar.',
      'Finalize com cheiro-verde e sirva com arroz.'
    ]
  },
  {
    id: 'rec-7',
    title: 'Escondidinho de Mandioca com Frango Desfiado',
    category: 'Almoço',
    prepTime: 35,
    servings: 2,
    calories: 560,
    protein: 38,
    carbs: 54,
    fat: 18,
    tags: ['Sem Glúten', 'Alta Proteína', 'Econômico'],
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80',
    source: 'NeatEat Brasil Original',
    ingredients: [
      { name: 'Mandioca (aipim) descascada', amount: 350, unit: 'g', aisle: 'Hortifruti', basePrice: 3.20 },
      { name: 'Peito de frango', amount: 280, unit: 'g', aisle: 'Açougue', basePrice: 6.40 },
      { name: 'Molho de tomate', amount: 100, unit: 'g', aisle: 'Mercearia', basePrice: 1.10 },
      { name: 'Queijo muçarela', amount: 60, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 3.10 },
      { name: 'Cebola', amount: 60, unit: 'g', aisle: 'Hortifruti', basePrice: 0.50 },
    ],
    steps: [
      'Cozinhe a mandioca na pressão até desmanchar e amasse formando um purê rústico.',
      'Refogue o frango cozido e desfiado com cebola e molho de tomate.',
      'Monte camadas do frango e purê de mandioca, cubra com muçarela e gratine.'
    ]
  },
  {
    id: 'rec-8',
    title: 'Strogonoff Econômico de Grão-de-Bico e Cogumelos com Batata Assada',
    category: 'Almoço',
    prepTime: 25,
    servings: 2,
    calories: 470,
    protein: 19,
    carbs: 62,
    fat: 14,
    tags: ['Vegetariano', 'Sem Glúten', 'Econômico'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    source: 'NeatEat Brasil Original',
    ingredients: [
      { name: 'Grão-de-bico cozido', amount: 260, unit: 'g', aisle: 'Mercearia', basePrice: 3.80 },
      { name: 'Molho de tomate', amount: 150, unit: 'g', aisle: 'Mercearia', basePrice: 1.50 },
      { name: 'Creme de leite', amount: 100, unit: 'g', aisle: 'Mercearia', basePrice: 2.10 },
      { name: 'Batata inglesa', amount: 250, unit: 'g', aisle: 'Hortifruti', basePrice: 2.20 },
      { name: 'Arroz branco', amount: 120, unit: 'g', aisle: 'Mercearia', basePrice: 1.00 },
      { name: 'Cebola', amount: 60, unit: 'g', aisle: 'Hortifruti', basePrice: 0.50 },
    ],
    steps: [
      'Corte as batatas em palitos finos e asse até ficarem douradas e crocantes.',
      'Refogue a cebola, adicione o grão-de-bico e o molho de tomate.',
      'Desligue o fogo, incorpore o creme de leite e sirva com arroz branco.'
    ]
  },
  {
    id: 'rec-9',
    title: 'Tilápia Grelhada ao Limão com Purê de Batata e Brócolis',
    category: 'Almoço',
    prepTime: 22,
    servings: 2,
    calories: 450,
    protein: 39,
    carbs: 42,
    fat: 12,
    tags: ['Sem Glúten', 'Alta Proteína', 'Rápido'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    source: 'NeatEat Brasil Original',
    ingredients: [
      { name: 'Filé de tilápia', amount: 300, unit: 'g', aisle: 'Peixaria', basePrice: 13.90 },
      { name: 'Batata inglesa', amount: 300, unit: 'g', aisle: 'Hortifruti', basePrice: 2.60 },
      { name: 'Brócolis ninja', amount: 200, unit: 'g', aisle: 'Hortifruti', basePrice: 3.50 },
      { name: 'Limão taiti', amount: 1, unit: 'un', aisle: 'Hortifruti', basePrice: 0.45 },
      { name: 'Azeite de oliva', amount: 10, unit: 'ml', aisle: 'Mercearia', basePrice: 0.90 },
    ],
    steps: [
      'Tempere os filés de tilápia com suco de limão, sal e pimenta e grelhe no azeite por 3 minutos de cada lado.',
      'Cozinhe as batatas e amasse com um fio de azeite e água do cozimento.',
      'Cozinhe o brócolis no vapor por 5 minutos e sirva junto.'
    ]
  },

  // JANTAR
  {
    id: 'rec-10',
    title: 'Omelete de Forno com Abobrinha, Cenoura e Queijo',
    category: 'Jantar',
    prepTime: 20,
    servings: 2,
    calories: 310,
    protein: 22,
    carbs: 11,
    fat: 19,
    tags: ['Low Carb', 'Vegetariano', 'Sem Glúten', 'Econômico', 'Rápido'],
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=600&q=80',
    source: 'NeatEat Brasil Original',
    ingredients: [
      { name: 'Ovo', amount: 4, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 3.60 },
      { name: 'Abobrinha italiana', amount: 150, unit: 'g', aisle: 'Hortifruti', basePrice: 1.40 },
      { name: 'Cenoura', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 0.85 },
      { name: 'Queijo muçarela', amount: 50, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 2.60 },
      { name: 'Cebola', amount: 50, unit: 'g', aisle: 'Hortifruti', basePrice: 0.45 },
    ],
    steps: [
      'Rale a abobrinha e a cenoura e pique a cebola finamente.',
      'Bata os ovos, misture os legumes e o queijo.',
      'Leve ao forno ou frigideira tampada por 15 minutos até dourar.'
    ]
  },
  {
    id: 'rec-11',
    title: 'Caldo Verde Fit de Mandioquinha com Frango Desfiado e Couve',
    category: 'Jantar',
    prepTime: 25,
    servings: 2,
    calories: 380,
    protein: 31,
    carbs: 40,
    fat: 9,
    tags: ['Sem Glúten', 'Sem Lactose', 'Alta Proteína', 'Econômico'],
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    source: 'NeatEat Brasil Original',
    ingredients: [
      { name: 'Mandioquinha (batata-baroa)', amount: 250, unit: 'g', aisle: 'Hortifruti', basePrice: 3.90 },
      { name: 'Peito de frango', amount: 220, unit: 'g', aisle: 'Açougue', basePrice: 5.10 },
      { name: 'Couve manteiga', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 1.50 },
      { name: 'Alho', amount: 10, unit: 'g', aisle: 'Hortifruti', basePrice: 0.40 },
      { name: 'Azeite de oliva', amount: 10, unit: 'ml', aisle: 'Mercearia', basePrice: 0.90 },
    ],
    steps: [
      'Cozinhe a mandioquinha e bata no liquidificador com a água do cozimento.',
      'Junte o frango desfiado refogado no alho.',
      'Finalize com a couve fatiada bem fininha nos últimos 2 minutos.'
    ]
  },
  {
    id: 'rec-12',
    title: 'Macarrão ao Alho, Óleo, Brócolis e Iscas de Frango',
    category: 'Jantar',
    prepTime: 18,
    servings: 2,
    calories: 490,
    protein: 34,
    carbs: 58,
    fat: 13,
    tags: ['Sem Lactose', 'Alta Proteína', 'Econômico', 'Rápido'],
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    source: 'NeatEat Brasil Original',
    ingredients: [
      { name: 'Macarrão espaguete ou penne', amount: 180, unit: 'g', aisle: 'Mercearia', basePrice: 1.80 },
      { name: 'Peito de frango', amount: 240, unit: 'g', aisle: 'Açougue', basePrice: 5.50 },
      { name: 'Brócolis ninja', amount: 180, unit: 'g', aisle: 'Hortifruti', basePrice: 3.10 },
      { name: 'Alho', amount: 15, unit: 'g', aisle: 'Hortifruti', basePrice: 0.60 },
      { name: 'Azeite de oliva', amount: 15, unit: 'ml', aisle: 'Mercearia', basePrice: 1.35 },
    ],
    steps: [
      'Cozinhe o macarrão al dente e adicione os floretes de brócolis nos últimos 3 minutos.',
      'Doure as iscas de frango e o alho laminado no azeite.',
      'Envolva a massa e o brócolis na frigideira com um pouco da água do cozimento.'
    ]
  },
  {
    id: 'rec-13',
    title: 'Bowl Mexicano Brasileiro (Arroz, Feijão Preto, Carne Moída e Abacate)',
    category: 'Jantar',
    prepTime: 20,
    servings: 2,
    calories: 520,
    protein: 35,
    carbs: 49,
    fat: 20,
    tags: ['Sem Glúten', 'Sem Lactose', 'Alta Proteína'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    source: 'NeatEat Brasil Original',
    ingredients: [
      { name: 'Carne moída (patinho ou acém)', amount: 250, unit: 'g', aisle: 'Açougue', basePrice: 8.75 },
      { name: 'Feijão carioca cozido', amount: 180, unit: 'g', aisle: 'Mercearia', basePrice: 1.70 },
      { name: 'Arroz branco', amount: 120, unit: 'g', aisle: 'Mercearia', basePrice: 1.00 },
      { name: 'Tomate', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 1.30 },
      { name: 'Limão taiti', amount: 1, unit: 'un', aisle: 'Hortifruti', basePrice: 0.45 },
    ],
    steps: [
      'Refogue a carne moída bem temperada.',
      'Monte a tigela com base de arroz, feijão e carne.',
      'Finalize com vinagrete de tomate e suco de limão fresco.'
    ]
  },
  {
    id: 'rec-14',
    title: 'Frigideira Low Carb de Frango, Abobrinha e Tomate Cereja',
    category: 'Jantar',
    prepTime: 15,
    servings: 2,
    calories: 330,
    protein: 38,
    carbs: 12,
    fat: 14,
    tags: ['Low Carb', 'Sem Glúten', 'Sem Lactose', 'Alta Proteína', 'Rápido', 'Econômico'],
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    source: 'NeatEat Brasil Original',
    ingredients: [
      { name: 'Peito de frango', amount: 300, unit: 'g', aisle: 'Açougue', basePrice: 6.90 },
      { name: 'Abobrinha italiana', amount: 200, unit: 'g', aisle: 'Hortifruti', basePrice: 1.85 },
      { name: 'Tomate', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.50 },
      { name: 'Azeite de oliva', amount: 10, unit: 'ml', aisle: 'Mercearia', basePrice: 0.90 },
      { name: 'Orégano', amount: 3, unit: 'g', aisle: 'Temperos', basePrice: 0.20 },
    ],
    steps: [
      'Corte o peito de frango em cubos e doure na frigideira quente com azeite.',
      'Adicione a abobrinha em meia-lua e o tomate em cubos.',
      'Salteie por 5 minutos, tempere com orégano e sirva.'
    ]
  }
];

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
      household_size INTEGER NOT NULL DEFAULT 2
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
      steps_json TEXT NOT NULL
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
  `);

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    db.prepare(`
      INSERT INTO users (name, email, household_code, weekly_budget, supermarket_id, dietary_filter, household_size)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('Família Silva', 'familia@neateat.com.br', 'NEAT-BR-8492', 250.0, 'atacadao', 'Todas', 2);
  }

  const recipeCount = db.prepare('SELECT COUNT(*) as count FROM recipes').get().count;
  if (recipeCount === 0) {
    const insertRecipe = db.prepare(`
      INSERT INTO recipes (id, title, category, prep_time, servings, calories, protein, carbs, fat, tags_json, image, source, ingredients_json, steps_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const r of INITIAL_RECIPES) {
      insertRecipe.run(
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
        JSON.stringify(r.steps)
      );
    }
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
    generateSmartMealPlan(250.0, 'atacadao', 'Todas', 2);
  }
}

export function getAllRecipes() {
  const rows = db.prepare('SELECT * FROM recipes ORDER BY rowid ASC').all();
  return rows.map((r) => {
    const ingredients = JSON.parse(r.ingredients_json);
    const totalBaseCost = ingredients.reduce((sum, ing) => sum + Number(ing.basePrice || 0), 0);
    const costPerServing = totalBaseCost / (r.servings || 1);
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
      baseCost: Number(totalBaseCost.toFixed(2)),
      costPerServing: Number(costPerServing.toFixed(2)),
    };
  });
}

export function generateSmartMealPlan(weeklyBudget, supermarketId, dietaryFilter, householdSize = 2) {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const slots = ['Café da Manhã', 'Almoço', 'Jantar'];
  const market = SUPERMARKETS.find((m) => m.id === supermarketId) || SUPERMARKETS[0];
  const allRecipes = getAllRecipes();

  const matchesDiet = (r) => {
    if (!dietaryFilter || dietaryFilter === 'Todas') return true;
    return r.tags.includes(dietaryFilter);
  };

  let eligible = allRecipes.filter(matchesDiet);
  if (eligible.length < 3) eligible = allRecipes;

  db.exec('DELETE FROM meal_plans');
  const insertSlot = db.prepare('INSERT INTO meal_plans (day, slot, recipe_id) VALUES (?, ?, ?)');

  let runningTotal = 0;

  for (let dIdx = 0; dIdx < days.length; dIdx++) {
    const day = days[dIdx];
    for (const slot of slots) {
      let pool = eligible.filter((r) => r.category === slot);
      if (pool.length === 0) pool = eligible;

      const scored = pool.map((r) => {
        const slotCost = r.costPerServing * householdSize * market.multiplier;
        return { recipe: r, slotCost };
      });

      const remainingSlots = (days.length - dIdx) * 3 - slots.indexOf(slot);
      const maxAllowedSlotCost = Math.max(4, (weeklyBudget - runningTotal) / Math.max(1, remainingSlots));

      const affordable = scored.filter((s) => s.slotCost <= maxAllowedSlotCost * 1.15);
      const candidateList = affordable.length > 0 ? affordable : scored.sort((a, b) => a.slotCost - b.slotCost);

      const chosen = candidateList[(dIdx + slots.indexOf(slot)) % candidateList.length];
      runningTotal += chosen.slotCost;
      insertSlot.run(day, slot, chosen.recipe.id);
    }
  }
}
