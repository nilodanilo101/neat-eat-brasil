// ============================================================================
// BASE NUTRICIONAL BRASILEIRA OFICIAL (TACO - UNICAMP / TBCA - USP)
// Valores médios laboratoriais oficiais por 100g de alimento pronto/cru
// ============================================================================

export const TACO_NUTRITIONAL_DATA = [
  // --- CEREAIS, GRÃOS E TUBÉRCULOS ---
  { name: 'Arroz branco cozido', category: 'Cereais', kcal: 128, protein: 2.5, carbs: 28.1, fat: 0.2, fiber: 1.6, sodium: 1 },
  { name: 'Arroz integral cozido', category: 'Cereais', kcal: 124, protein: 2.6, carbs: 25.8, fat: 1.0, fiber: 2.7, sodium: 1 },
  { name: 'Feijão carioca cozido', category: 'Leguminosas', kcal: 76, protein: 4.8, carbs: 13.6, fat: 0.5, fiber: 8.5, sodium: 2 },
  { name: 'Feijão preto cozido', category: 'Leguminosas', kcal: 77, protein: 4.5, carbs: 14.0, fat: 0.5, fiber: 8.4, sodium: 2 },
  { name: 'Feijão fradinho cozido', category: 'Leguminosas', kcal: 82, protein: 5.1, carbs: 14.8, fat: 0.6, fiber: 7.2, sodium: 3 },
  { name: 'Grão-de-bico cozido', category: 'Leguminosas', kcal: 128, protein: 7.0, carbs: 20.1, fat: 2.4, fiber: 5.4, sodium: 6 },
  { name: 'Lentilha cozida', category: 'Leguminosas', kcal: 93, protein: 6.3, carbs: 16.3, fat: 0.5, fiber: 7.9, sodium: 4 },
  { name: 'Batata inglesa cozida', category: 'Tubérculos', kcal: 52, protein: 1.2, carbs: 11.9, fat: 0.1, fiber: 1.3, sodium: 3 },
  { name: 'Batata-doce cozida', category: 'Tubérculos', kcal: 77, protein: 0.6, carbs: 18.4, fat: 0.1, fiber: 2.2, sodium: 10 },
  { name: 'Mandioca cozida (aipim)', category: 'Tubérculos', kcal: 125, protein: 0.6, carbs: 30.1, fat: 0.3, fiber: 1.6, sodium: 2 },
  { name: 'Mandioquinha (batata-baroa) cozida', category: 'Tubérculos', kcal: 80, protein: 0.9, carbs: 18.9, fat: 0.2, fiber: 1.8, sodium: 11 },
  { name: 'Inhame cozido', category: 'Tubérculos', kcal: 97, protein: 1.5, carbs: 23.2, fat: 0.2, fiber: 1.7, sodium: 7 },
  { name: 'Goma de tapioca hidratada', category: 'Farináceos', kcal: 240, protein: 0.1, carbs: 60.0, fat: 0.0, fiber: 0.5, sodium: 1 },
  { name: 'Flocão de milho (cuscuz cozido)', category: 'Cereais', kcal: 112, protein: 2.2, carbs: 24.5, fat: 0.7, fiber: 2.0, sodium: 2 },
  { name: 'Aveia em flocos', category: 'Cereais', kcal: 394, protein: 13.9, carbs: 66.6, fat: 8.5, fiber: 9.1, sodium: 5 },
  { name: 'Farinha de mandioca torrada', category: 'Farináceos', kcal: 365, protein: 1.2, carbs: 87.9, fat: 0.3, fiber: 6.5, sodium: 1 },
  { name: 'Farinha de trigo branca', category: 'Farináceos', kcal: 360, protein: 9.8, carbs: 75.1, fat: 1.4, fiber: 2.3, sodium: 1 },
  { name: 'Pão francês de sal', category: 'Padaria', kcal: 300, protein: 8.0, carbs: 58.7, fat: 3.1, fiber: 2.3, sodium: 648 },
  { name: 'Pão de forma integral', category: 'Padaria', kcal: 253, protein: 9.4, carbs: 49.9, fat: 3.7, fiber: 6.9, sodium: 504 },
  { name: 'Macarrão cozido', category: 'Massas', kcal: 141, protein: 4.8, carbs: 28.5, fat: 0.9, fiber: 1.8, sodium: 1 },

  // --- CARNES BOVINAS, AVES, SUÍNOS E PEIXES (Cortes Brasileiros) ---
  { name: 'Peito de frango cozido/grelhado', category: 'Aves', kcal: 163, protein: 31.5, carbs: 0.0, fat: 3.2, fiber: 0.0, sodium: 54 },
  { name: 'Coxa de frango sem pele cozida', category: 'Aves', kcal: 167, protein: 26.9, carbs: 0.0, fat: 6.4, fiber: 0.0, sodium: 89 },
  { name: 'Sobrecoxa de frango sem pele assada', category: 'Aves', kcal: 185, protein: 24.2, carbs: 0.0, fat: 9.8, fiber: 0.0, sodium: 95 },
  { name: 'Carne bovina patinho cozido/moído', category: 'Carnes Bovinas', kcal: 219, protein: 35.9, carbs: 0.0, fat: 7.3, fiber: 0.0, sodium: 53 },
  { name: 'Carne bovina acém cozido de panela', category: 'Carnes Bovinas', kcal: 212, protein: 26.7, carbs: 0.0, fat: 10.9, fiber: 0.0, sodium: 61 },
  { name: 'Carne bovina alcatra grelhada', category: 'Carnes Bovinas', kcal: 241, protein: 31.9, carbs: 0.0, fat: 11.6, fiber: 0.0, sodium: 58 },
  { name: 'Carne bovina músculo cozido', category: 'Carnes Bovinas', kcal: 194, protein: 31.2, carbs: 0.0, fat: 6.7, fiber: 0.0, sodium: 51 },
  { name: 'Carne bovina contrafilé grelhado', category: 'Carnes Bovinas', kcal: 278, protein: 30.5, carbs: 0.0, fat: 16.3, fiber: 0.0, sodium: 55 },
  { name: 'Carne bovina filé mignon grelhado', category: 'Carnes Bovinas', kcal: 220, protein: 32.8, carbs: 0.0, fat: 8.8, fiber: 0.0, sodium: 56 },
  { name: 'Carne-seca cozida e dessalgada', category: 'Carnes Bovinas', kcal: 248, protein: 26.9, carbs: 0.0, fat: 14.8, fiber: 0.0, sodium: 1200 },
  { name: 'Lombo suíno assado', category: 'Carnes Suínas', kcal: 210, protein: 35.7, carbs: 0.0, fat: 6.4, fiber: 0.0, sodium: 64 },
  { name: 'Bisteca suína grelhada', category: 'Carnes Suínas', kcal: 265, protein: 29.8, carbs: 0.0, fat: 15.2, fiber: 0.0, sodium: 70 },
  { name: 'Linguiça calabresa defumada', category: 'Embutidos', kcal: 320, protein: 18.0, carbs: 2.5, fat: 26.8, fiber: 0.0, sodium: 1350 },
  { name: 'Filé de tilápia grelhado', category: 'Pescados', kcal: 128, protein: 26.1, carbs: 0.0, fat: 2.7, fiber: 0.0, sodium: 52 },
  { name: 'Salmão fresco grelhado', category: 'Pescados', kcal: 229, protein: 24.3, carbs: 0.0, fat: 14.0, fiber: 0.0, sodium: 61 },
  { name: 'Atum sólido em conserva', category: 'Pescados', kcal: 166, protein: 26.2, carbs: 0.0, fat: 6.1, fiber: 0.0, sodium: 360 },
  { name: 'Sardinha em conserva', category: 'Pescados', kcal: 208, protein: 24.6, carbs: 0.0, fat: 11.4, fiber: 0.0, sodium: 490 },
  { name: 'Camarão cozido', category: 'Pescados', kcal: 90, protein: 19.5, carbs: 0.9, fat: 0.8, fiber: 0.0, sodium: 148 },

  // --- OVOS E LATICÍNIOS ---
  { name: 'Ovo de galinha inteiro cozido', category: 'Ovos', kcal: 146, protein: 13.3, carbs: 0.6, fat: 9.5, fiber: 0.0, sodium: 146 },
  { name: 'Clara de ovo cozida', category: 'Ovos', kcal: 52, protein: 11.2, carbs: 0.7, fat: 0.2, fiber: 0.0, sodium: 166 },
  { name: 'Leite integral UHT', category: 'Laticínios', kcal: 60, protein: 3.1, carbs: 4.8, fat: 3.2, fiber: 0.0, sodium: 49 },
  { name: 'Leite desnatado UHT', category: 'Laticínios', kcal: 35, protein: 3.2, carbs: 4.9, fat: 0.1, fiber: 0.0, sodium: 52 },
  { name: 'Iogurte natural integral', category: 'Laticínios', kcal: 63, protein: 3.8, carbs: 4.7, fat: 3.4, fiber: 0.0, sodium: 50 },
  { name: 'Queijo minas frescal', category: 'Laticínios', kcal: 264, protein: 17.4, carbs: 3.2, fat: 20.2, fiber: 0.0, sodium: 310 },
  { name: 'Queijo minas meia cura', category: 'Laticínios', kcal: 321, protein: 21.2, carbs: 1.5, fat: 25.6, fiber: 0.0, sodium: 560 },
  { name: 'Queijo muçarela', category: 'Laticínios', kcal: 282, protein: 22.2, carbs: 3.1, fat: 20.1, fiber: 0.0, sodium: 590 },
  { name: 'Queijo prato', category: 'Laticínios', kcal: 360, protein: 22.7, carbs: 1.9, fat: 29.1, fiber: 0.0, sodium: 580 },
  { name: 'Queijo parmesão ralado', category: 'Laticínios', kcal: 453, protein: 35.6, carbs: 1.7, fat: 33.5, fiber: 0.0, sodium: 1680 },
  { name: 'Queijo coalho', category: 'Laticínios', kcal: 340, protein: 23.5, carbs: 1.5, fat: 26.5, fiber: 0.0, sodium: 750 },
  { name: 'Ricota fresca', category: 'Laticínios', kcal: 140, protein: 12.6, carbs: 3.8, fat: 8.1, fiber: 0.0, sodium: 84 },
  { name: 'Requeijão cremoso tradicional', category: 'Laticínios', kcal: 257, protein: 9.6, carbs: 2.4, fat: 23.4, fiber: 0.0, sodium: 510 },
  { name: 'Creme de leite tradicional', category: 'Laticínios', kcal: 221, protein: 2.1, carbs: 4.0, fat: 22.1, fiber: 0.0, sodium: 62 },
  { name: 'Manteiga sem sal', category: 'Laticínios', kcal: 726, protein: 0.4, carbs: 0.1, fat: 82.4, fiber: 0.0, sodium: 11 },

  // --- HORTALIÇAS, LEGUMES E VERDURAS ---
  { name: 'Abobrinha italiana cozida', category: 'Hortaliças', kcal: 15, protein: 1.1, carbs: 3.0, fat: 0.2, fiber: 1.6, sodium: 1 },
  { name: 'Abóbora cabotiá cozida', category: 'Hortaliças', kcal: 48, protein: 1.4, carbs: 10.8, fat: 0.5, fiber: 2.5, sodium: 2 },
  { name: 'Cenoura cozida', category: 'Hortaliças', kcal: 30, protein: 0.8, carbs: 6.7, fat: 0.2, fiber: 2.6, sodium: 33 },
  { name: 'Chuchu cozido', category: 'Hortaliças', kcal: 17, protein: 0.4, carbs: 3.9, fat: 0.1, fiber: 1.0, sodium: 1 },
  { name: 'Brócolis cozido no vapor', category: 'Hortaliças', kcal: 25, protein: 2.1, carbs: 4.4, fat: 0.5, fiber: 2.9, sodium: 12 },
  { name: 'Couve-flor cozida', category: 'Hortaliças', kcal: 19, protein: 1.2, carbs: 3.9, fat: 0.2, fiber: 2.1, sodium: 16 },
  { name: 'Couve manteiga refogada', category: 'Hortaliças', kcal: 90, protein: 2.9, carbs: 8.7, fat: 5.7, fiber: 3.1, sodium: 115 },
  { name: 'Espinafre cozido', category: 'Hortaliças', kcal: 16, protein: 2.0, carbs: 2.6, fat: 0.2, fiber: 2.1, sodium: 39 },
  { name: 'Tomate cru', category: 'Hortaliças', kcal: 15, protein: 1.1, carbs: 3.1, fat: 0.2, fiber: 1.2, sodium: 1 },
  { name: 'Cebola crua', category: 'Hortaliças', kcal: 39, protein: 1.7, carbs: 8.9, fat: 0.1, fiber: 2.2, sodium: 2 },
  { name: 'Alho cru', category: 'Hortaliças', kcal: 113, protein: 7.0, carbs: 23.9, fat: 0.2, fiber: 4.3, sodium: 18 },
  { name: 'Alface americana/crespa crua', category: 'Hortaliças', kcal: 11, protein: 1.3, carbs: 1.7, fat: 0.2, fiber: 1.8, sodium: 9 },
  { name: 'Rúcula crua', category: 'Hortaliças', kcal: 13, protein: 1.8, carbs: 2.2, fat: 0.1, fiber: 1.7, sodium: 9 },
  { name: 'Pimentão vermelho/verde', category: 'Hortaliças', kcal: 21, protein: 1.0, carbs: 4.9, fat: 0.2, fiber: 1.6, sodium: 2 },
  { name: 'Quiabo cozido', category: 'Hortaliças', kcal: 22, protein: 1.9, carbs: 4.6, fat: 0.1, fiber: 2.6, sodium: 4 },
  { name: 'Palmito pupunha cozido', category: 'Hortaliças', kcal: 36, protein: 2.2, carbs: 6.8, fat: 0.5, fiber: 2.8, sodium: 21 },
  { name: 'Molho de tomate caseiro', category: 'Molhos', kcal: 32, protein: 1.3, carbs: 6.2, fat: 0.4, fiber: 1.4, sodium: 230 },

  // --- FRUTAS BRASILEIRAS ---
  { name: 'Banana nanica/prata crua', category: 'Frutas', kcal: 89, protein: 1.3, carbs: 22.8, fat: 0.3, fiber: 2.0, sodium: 1 },
  { name: 'Maçã gala/fuji com casca', category: 'Frutas', kcal: 56, protein: 0.3, carbs: 15.2, fat: 0.2, fiber: 1.3, sodium: 1 },
  { name: 'Laranja pera fresca', category: 'Frutas', kcal: 37, protein: 1.0, carbs: 8.9, fat: 0.1, fiber: 0.8, sodium: 1 },
  { name: 'Mamão papaia', category: 'Frutas', kcal: 40, protein: 0.5, carbs: 10.4, fat: 0.1, fiber: 1.0, sodium: 2 },
  { name: 'Abacate fresco', category: 'Frutas', kcal: 96, protein: 1.2, carbs: 6.0, fat: 8.4, fiber: 6.3, sodium: 2 },
  { name: 'Manga palmer/tommy', category: 'Frutas', kcal: 64, protein: 0.4, carbs: 16.7, fat: 0.2, fiber: 1.6, sodium: 2 },
  { name: 'Limão tahiti (suco)', category: 'Frutas', kcal: 29, protein: 1.1, carbs: 9.3, fat: 0.3, fiber: 0.4, sodium: 2 },

  // --- ÓLEOS, GORDURAS E OLEAGINOSAS ---
  { name: 'Azeite de oliva extra virgem', category: 'Óleos e Gorduras', kcal: 884, protein: 0.0, carbs: 0.0, fat: 100.0, fiber: 0.0, sodium: 0 },
  { name: 'Óleo de soja/girassol', category: 'Óleos e Gorduras', kcal: 884, protein: 0.0, carbs: 0.0, fat: 100.0, fiber: 0.0, sodium: 0 },
  { name: 'Azeite de dendê', category: 'Óleos e Gorduras', kcal: 884, protein: 0.0, carbs: 0.0, fat: 100.0, fiber: 0.0, sodium: 0 },
  { name: 'Leite de coco tradicional', category: 'Óleos e Gorduras', kcal: 197, protein: 2.0, carbs: 2.8, fat: 21.3, fiber: 2.2, sodium: 15 },
  { name: 'Castanha-de-caju torrada', category: 'Oleaginosas', kcal: 570, protein: 18.5, carbs: 29.1, fat: 46.3, fiber: 3.7, sodium: 14 },
  { name: 'Amendoim torrado sem sal', category: 'Oleaginosas', kcal: 544, protein: 22.5, carbs: 20.3, fat: 43.9, fiber: 8.0, sodium: 5 },
];

function normalizeLookup(name = '') {
  return String(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .trim();
}

/**
 * Busca o item mais compatível na Tabela TACO/TBCA
 */
export function findTacoNutrition(ingredientName = '') {
  const clean = normalizeLookup(ingredientName);
  if (!clean) return null;

  // 1. Match exato
  for (const item of TACO_NUTRITIONAL_DATA) {
    if (normalizeLookup(item.name) === clean) return item;
  }

  // 2. Match por inclusão
  for (const item of TACO_NUTRITIONAL_DATA) {
    const itemNorm = normalizeLookup(item.name);
    if (clean.includes(itemNorm) || itemNorm.includes(clean)) return item;
  }

  // 3. Match por tokens essenciais
  const tokens = clean.split(/\s+/).filter((t) => t.length >= 4);
  for (const t of tokens) {
    for (const item of TACO_NUTRITIONAL_DATA) {
      if (normalizeLookup(item.name).includes(t)) return item;
    }
  }

  return null;
}

/**
 * Calcula os macronutrientes científicos de uma receita com base na TACO
 * Converte colheres, xícaras, unidades e gramas para a composição nutricional de 100g.
 */
export function calculateRecipeNutritionTaco(ingredients = [], servings = 1) {
  let totalKcal = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalSodium = 0;
  let matchedCount = 0;

  for (const ing of ingredients) {
    const tacoItem = findTacoNutrition(ing.name);
    if (!tacoItem) continue;
    matchedCount++;

    const amt = Number(ing.amount) || 0;
    const unit = String(ing.unit || 'g').toLowerCase().trim();

    // Converte para gramas aproximadas
    let grams = amt;
    if (unit === 'kg' || unit === 'l') grams = amt * 1000;
    else if (unit === 'ml') grams = amt * 1.0;
    else if (unit === 'un' || unit === 'unidade' || unit === 'ovo' || unit === 'ovos') {
      grams = amt * (tacoItem.category === 'Ovos' ? 50 : 120);
    } else if (unit.includes('colher') && unit.includes('sopa')) grams = amt * 15;
    else if (unit.includes('colher') && unit.includes('chá')) grams = amt * 5;
    else if (unit.includes('xícara') || unit.includes('copo')) grams = amt * 180;
    else if (unit.includes('dente')) grams = amt * 5;
    else if (unit.includes('fatia')) grams = amt * 30;

    const factor = grams / 100;
    totalKcal += tacoItem.kcal * factor;
    totalProtein += tacoItem.protein * factor;
    totalCarbs += tacoItem.carbs * factor;
    totalFat += tacoItem.fat * factor;
    totalFiber += tacoItem.fiber * factor;
    totalSodium += tacoItem.sodium * factor;
  }

  const s = Math.max(1, Number(servings) || 1);

  return {
    servings: s,
    totalRecipe: {
      calories: Math.round(totalKcal),
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat),
      fiber: Math.round(totalFiber),
      sodium_mg: Math.round(totalSodium),
    },
    perServing: {
      calories: Math.round(totalKcal / s),
      protein: Math.round(totalProtein / s),
      carbs: Math.round(totalCarbs / s),
      fat: Math.round(totalFat / s),
      fiber: Math.round(totalFiber / s),
      sodium_mg: Math.round(totalSodium / s),
    },
    tacoMatchedIngredients: matchedCount,
    totalIngredients: ingredients.length,
    confidencePct: ingredients.length > 0 ? Math.round((matchedCount / ingredients.length) * 100) : 0,
  };
}
