import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const dbs = [
  path.join(process.cwd(), 'server', 'neateat.sqlite'),
  '/Users/nilodanilo101/Library/Application Support/neat-eat-br/neateat.sqlite',
];

const userCacheDir = '/Users/nilodanilo101/Library/Application Support/neat-eat-br/cache/step-images';
const localCacheDir = path.join(process.cwd(), 'server', 'cache', 'step-images');

if (!fs.existsSync(userCacheDir)) fs.mkdirSync(userCacheDir, { recursive: true });
if (!fs.existsSync(localCacheDir)) fs.mkdirSync(localCacheDir, { recursive: true });

// Copia imagens do cache local para o userCacheDir
if (fs.existsSync(localCacheDir)) {
  const files = fs.readdirSync(localCacheDir);
  for (const f of files) {
    fs.copyFileSync(path.join(localCacheDir, f), path.join(userCacheDir, f));
  }
}

// Garante também cópia de salada-caesar.jpg e omelete-com-queijo.jpg para dist/dishes se dist existir
const distDishes = path.join(process.cwd(), 'dist', 'dishes');
const publicDishes = path.join(process.cwd(), 'public', 'dishes');
if (fs.existsSync(distDishes)) {
  for (const img of ['salada-caesar.jpg', 'omelete-com-queijo.jpg']) {
    const src = path.join(publicDishes, img);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(distDishes, img));
    }
  }
}

const cleanIngredients = [
  { name: 'Linguiça toscana', amount: 1, unit: 'kg', aisle: 'Açougue', basePrice: 22.9 },
  { name: 'Batata', amount: 500, unit: 'g', aisle: 'Hortifruti', basePrice: 3.25 },
  { name: 'Azeite', amount: 45, unit: 'ml', aisle: 'Mercearia', basePrice: 2.43 },
  { name: 'Alho', amount: 3, unit: 'dente', aisle: 'Hortifruti', basePrice: 0.69 },
  { name: 'Chimichurri', amount: 4, unit: 'g', aisle: 'Temperos', basePrice: 0.05 },
  { name: 'Cebola', amount: 3, unit: 'un', aisle: 'Hortifruti', basePrice: 2.61 },
  { name: 'Tomate', amount: 2, unit: 'un', aisle: 'Hortifruti', basePrice: 2.55 },
  { name: 'Pimentão verde', amount: 0.5, unit: 'un', aisle: 'Hortifruti', basePrice: 0.74 },
  { name: 'Páprica doce', amount: 1, unit: 'colher de sopa', aisle: 'Temperos', basePrice: 0.25 },
  { name: 'Água', amount: 240, unit: 'ml', aisle: 'Mercearia', basePrice: 0 },
  { name: 'Salsinha', amount: 1, unit: 'a gosto', aisle: 'Hortifruti', basePrice: 0.05 },
  { name: 'Cebolinha', amount: 1, unit: 'a gosto', aisle: 'Hortifruti', basePrice: 0.05 },
];

const cleanSteps = [
  'Organize sua bancada e os ingredientes! Solte os gomos de linguiça, corte a cebola e o pimentão em fatias. Pique o alho e o cheiro-verde finamente, mas o tomate em cubinhos. Descasque e corte as batatas em pedaços médios.',
  'Numa panela de pressão em fogo alto, adicione e aqueça o azeite. Coloque a linguiça e deixe dourar de todos os lados, por aproximadamente 5 minutos.',
  'Adicione o alho à linguiça já dourada e deixe fritar levemente.',
  'Entre com a cebola fatiada, o tomate, páprica doce, chimichurri, sal, o pimentão fatiado, assim como as batatas. Misture tudo para incorporar os sabores.',
  'Cozinhe por cerca de 5 minutos até o tomate começar a murchar.',
  'Adicione água, misture novamente e tampe a panela de pressão. Após pegar pressão, abaixe o fogo e cozinhe por aproximadamente 12 minutos.',
  'Desligue o fogo e deixe a pressão sair naturalmente. Abra a panela com cuidado e finalize com cheiro-verde, misturando bem.',
  'Se desejar um molho mais encorpado, deixe cozinhar sem tampa por mais 3 minutinhos antes de servir.',
  'E está pronto! Sirva com aquele arroz branquinho bem quentinho.',
];

const cleanStepDetails = cleanSteps.map((text, idx) => ({
  stepNumber: idx + 1,
  section:
    idx === 0
      ? 'Mise en Place & Pré-preparo'
      : idx === cleanSteps.length - 1
      ? 'Finalização & Empratamento'
      : 'Cocção na Panela de Pressão',
  text,
  image: `/cache/step-images/recipe-rec-custom-1793710910951-step-${idx + 1}.jpg`,
  alt: `Passo ${idx + 1}: ${text.slice(0, 50)}...`,
  tip:
    idx === 0
      ? 'Higienize e corte todos os vegetais com antecedência.'
      : idx === 1
      ? 'Deixe a linguiça dourar bem para criar fundo de sabor na panela.'
      : idx === 5
      ? 'Conte o tempo de 12 minutos somente após a panela chiar com pressão.'
      : 'Ajuste o sal e sirva com cheiro-verde fresco salpicado.',
  isKeyFrame: true,
  timerSeconds: idx === 1 ? 300 : idx === 4 ? 300 : idx === 5 ? 720 : idx === 7 ? 180 : 120,
}));

for (const dbPath of dbs) {
  if (!fs.existsSync(dbPath)) continue;
  console.log('Migrando banco:', dbPath);
  const db = new DatabaseSync(dbPath);

  // 1. Atualiza receita Linguiça com batata
  const check = db.prepare("SELECT id FROM recipes WHERE title LIKE '%lingui%' OR id = 'rec-custom-1793710910951'").get();
  if (check) {
    db.prepare(`
      UPDATE recipes
      SET title = 'Linguiça com batata',
          image = '/cache/step-images/recipe-rec-custom-1793710910951-hero.jpg',
          tags_json = ?,
          ingredients_json = ?,
          steps_json = ?,
          step_details_json = ?
      WHERE id = ?
    `).run(
      JSON.stringify(['Almoço', 'Econômico', 'Rápido', 'Importada']),
      JSON.stringify(cleanIngredients),
      JSON.stringify(cleanSteps),
      JSON.stringify(cleanStepDetails),
      check.id
    );
    console.log('Receita Linguiça com batata atualizada com sucesso no banco:', check.id);
  }

  // 2. Remove 'Passo a Passo com Fotos' de todas as receitas
  const allRecipes = db.prepare('SELECT id, tags_json FROM recipes').all();
  for (const r of allRecipes) {
    try {
      const tags = JSON.parse(r.tags_json || '[]');
      if (tags.includes('Passo a Passo com Fotos')) {
        const filtered = tags.filter((t) => t !== 'Passo a Passo com Fotos');
        db.prepare('UPDATE recipes SET tags_json = ? WHERE id = ?').run(JSON.stringify(filtered), r.id);
      }
    } catch {}
  }

  // 3. Atualiza Salada Caesar e Omelete com imagens corretas se estiverem no banco
  db.prepare(`
    UPDATE recipes
    SET image = '/dishes/salada-caesar.jpg'
    WHERE title LIKE '%salada caesar%' AND image LIKE '%sug-16%'
  `).run();

  db.prepare(`
    UPDATE recipes
    SET image = '/dishes/omelete-com-queijo.jpg'
    WHERE title LIKE '%omelete com queijo%'
  `).run();

  // 4. Limpa sugestões diárias duplicadas para 2026-11-03 para gerar pilha limpa e rica
  try {
    db.prepare("DELETE FROM daily_discovered_recipes WHERE date_added = '2026-11-03'").run();
  } catch {}

  db.close();
}

console.log('Migração concluída com sucesso!');
