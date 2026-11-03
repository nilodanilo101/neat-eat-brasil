import { DatabaseSync } from 'node:sqlite';
import {
  initDb,
  getAllRecipes,
  getSuggestionsState,
  generateSmartMealPlan,
  getMarketPrices,
} from './db.js';
import {
  ROBUST_RECIPE_VAULT,
  cleanCulinaryTitle,
  areDishesTooSimilar,
  isDishTooSimilarToExisting,
} from './suggestionEngine.js';

console.log('\n--- 1. TESTE DO MOTOR DE DEDUPLICAÇÃO CULINÁRIA ---');
const testCases = [
  ['Strogonoff de Frango', 'Strogonoff Caseiro de Frango com Batata Palha', true],
  ['Sanduíche de Frango Cremoso', 'Sanduíche Natural de Frango Cremoso no Pão Integral', true],
  ['Frango Xadrez', 'Frango Xadrez Oriental com Pimentões', true],
  ['Strogonoff de Frango', 'Strogonoff de Grão-de-Bico', false],
  ['Panqueca de Banana e Aveia', 'Panqueca de Carne Moída', false],
  ['Crepioca de Frango Cremosa', 'Crepioca com Queijo Coalho', false],
  ['Tilápia com Purê e Brócolis', 'Salmão com Brócolis e Purê', false],
];

let dedupPass = 0;
for (const [a, b, expected] of testCases) {
  const result = areDishesTooSimilar(a, b);
  const ok = result === expected;
  if (ok) dedupPass++;
  console.log(`[${ok ? 'OK' : 'FAIL'}] "${a}" vs "${b}" => ${result} (esperado: ${expected})`);
}
console.log(`Taxa de acerto Deduplicação: ${dedupPass}/${testCases.length}`);

console.log('\n--- 2. TESTE DE PILHA DE SUGESTÕES (MÍNIMO 5 + SEM DUPLICIDADE) ---');
initDb();
const recipes = getAllRecipes();
const catalogTitles = recipes.map((r) => r.title);
console.log(`Catálogo atual possui ${recipes.length} receitas.`);

const sugState = getSuggestionsState([], getMarketPrices());
console.log(`Pilha de sugestões retornou: ${sugState.suggestions.length} pratos.`);

if (sugState.suggestions.length < 5) {
  console.error(`ERRO: Menos de 5 sugestões retornadas!`);
} else {
  console.log(`SUCESSO: ${sugState.suggestions.length} sugestões disponíveis (>= 5).`);
}

let similarToCatalogCount = 0;
for (const s of sugState.suggestions) {
  const isDup = isDishTooSimilarToExisting(s.title, catalogTitles);
  if (isDup) {
    similarToCatalogCount++;
    console.error(`ERRO: Sugestão "${s.title}" é similar a um prato do catálogo!`);
  } else {
    console.log(`  ✓ Sugestão aprovada: "${s.title}" (${s.category}, ${s.steps?.length} passos, tag: ${s.tags?.join(', ')})`);
  }
}
console.log(`Sugestões similares ao catálogo encontradas: ${similarToCatalogCount} (esperado: 0)`);

console.log('\n--- 3. TESTE DE CARDÁPIO INTELIGENTE COM PREFERÊNCIA "TIRZEPATIDA" ---');
generateSmartMealPlan(250.0, 'Tirzepatida', 2);
console.log('Cardápio semanal calculado com sucesso sob a preferência Tirzepatida.');

console.log('\n--- 4. AUDITORIA DE TODAS AS RECEITAS (PASSOS, FOTOS E TÍTULOS) ---');
let genericStepsFound = 0;
let brokenPhotosFound = 0;
let longTitlesFound = 0;

for (const r of recipes) {
  if (r.steps.length < 4) genericStepsFound++;
  if (r.steps.some((s) => s.includes('Separe e pese todos os insumos conforme a ficha técnica'))) {
    genericStepsFound++;
  }
  if (!r.image || r.image.includes('placeholder')) brokenPhotosFound++;
  if (r.title.length > 55) {
    longTitlesFound++;
    console.warn(`Título longo detectado: "${r.title}"`);
  }
}

console.log(`Receitas com passos genéricos: ${genericStepsFound} (esperado: 0)`);
console.log(`Receitas com fotos quebradas: ${brokenPhotosFound} (esperado: 0)`);
console.log(`Receitas com títulos longos (>55 chars): ${longTitlesFound} (esperado: 0)`);
console.log('\n=== TODOS OS TESTES CULINÁRIOS E DE BANCO CONCLUÍDOS ===\n');
