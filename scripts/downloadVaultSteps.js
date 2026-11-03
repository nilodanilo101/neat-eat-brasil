import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const RECIPES_TO_DOWNLOAD = [
  { id: 'sug-24', dir: 'canja-frango', slug: 'canja-de-galinha-simples' },
  { id: 'sug-9', dir: 'frango-xadrez', slug: 'frango-xadrez-simples' },
  { id: 'sug-19', dir: 'salada-caesar', slug: 'salada-caesar-tradicional' },
  { id: 'sug-10', dir: 'carne-panela', slug: 'carne-de-panela-com-mandioca' },
  { id: 'sug-15', dir: 'feijoada', slug: 'feijoada-simples' },
  { id: 'sug-14', dir: 'bife-acebolado', slug: 'bife-acebolado' },
  { id: 'sug-20', dir: 'hamburguer-fit', slug: 'hamburguer-artesanal' },
  { id: 'sug-23', dir: 'sufle-legumes', slug: 'sufle-de-legumes' },
  { id: 'sug-22', dir: 'moqueca-banana', slug: 'moqueca-de-palmito' },
  { id: 'sug-21', dir: 'panqueca-espinafre', slug: 'panqueca-de-espinafre-com-frango' },
  { id: 'sug-6', dir: 'sanduiche-frango', slug: 'sanduiche-natural-de-frango' },
  { id: 'sug-26', dir: 'salmao-grelhado', slug: 'salmao-grelhado' },
  { id: 'sug-27', dir: 'bowl-quinoa', slug: 'salada-de-quinoa' },
  { id: 'sug-1', dir: 'pao-queijo', slug: 'pao-de-queijo-de-frigideira' },
  { id: 'sug-2', dir: 'panqueca-banana', slug: 'panqueca-de-banana-fit' },
  { id: 'sug-7', dir: 'mingau-aveia', slug: 'mingau-de-aveia-fit' },
  { id: 'sug-3', dir: 'tapioca', slug: 'tapioca-com-ovo' },
  { id: 'sug-11', dir: 'picadinho-carne', slug: 'picadinho-de-carne' },
  { id: 'sug-16', dir: 'sopa-abobora', slug: 'sopa-de-abobora-com-frango' },
];

const BASE_OUT = path.resolve('public/dishes/steps');

async function processRecipe(r) {
  const targetDir = path.join(BASE_OUT, r.dir);
  fs.mkdirSync(targetDir, { recursive: true });

  const url = `https://www.receiteria.com.br/receita/${r.slug}/`;
  console.log(`Processing ${r.id} (${r.slug})...`);
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
  });
  if (!res.ok) {
    console.error(`Failed to fetch ${url}: ${res.status}`);
    return [];
  }
  const html = await res.text();
  const stepLis = [...html.matchAll(/<li\s+id="passo\d+"[^>]*>([\s\S]*?)<\/li>/gi)];
  console.log(`  Found ${stepLis.length} steps in ${r.slug}`);

  const extracted = [];
  let stepIdx = 1;

  for (const match of stepLis) {
    const block = match[1];
    let imgUrl = null;
    const dataFullM = block.match(/data-full="([^"]+)"/);
    const sourceM = block.match(/<source\s+srcset="([^"]+)"/);
    const srcM = block.match(/src="([^"]+)"/);

    if (dataFullM) imgUrl = dataFullM[1];
    else if (sourceM) imgUrl = sourceM[1].split(' ')[0];
    else if (srcM) imgUrl = srcM[1];

    const altM = block.match(/alt="([^"]+)"/);
    const textM = block.match(/class="ds-step__text">([\s\S]*?)<\/span>/);
    const alt = altM ? altM[1].trim() : '';
    const text = textM ? textM[1].replace(/<[^>]+>/g, '').trim() : '';

    if (imgUrl && !imgUrl.includes('logo') && !imgUrl.includes('icon') && !imgUrl.includes('avatar')) {
      const tempPath = path.join(targetDir, `temp-${stepIdx}.jpg`);
      const finalWebp = path.join(targetDir, `step-${stepIdx}.webp`);

      try {
        const imgRes = await fetch(imgUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            'Referer': 'https://www.receiteria.com.br/',
          },
        });
        if (imgRes.ok) {
          const buf = Buffer.from(await imgRes.arrayBuffer());
          fs.writeFileSync(tempPath, buf);

          // Convert to WebP using cwebp
          execSync(`/opt/homebrew/bin/cwebp -q 80 "${tempPath}" -o "${finalWebp}"`, { stdio: 'ignore' });
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

          extracted.push({
            stepNumber: stepIdx,
            image: `/dishes/steps/${r.dir}/step-${stepIdx}.webp`,
            alt: alt || text.slice(0, 80),
            originalText: text,
          });
          console.log(`    Downloaded step-${stepIdx}.webp`);
          stepIdx++;
        }
      } catch (err) {
        console.error(`    Error downloading step ${stepIdx}:`, err.message);
      }
    }
  }

  return extracted;
}

async function run() {
  const allResults = {};
  for (const r of RECIPES_TO_DOWNLOAD) {
    allResults[r.id] = await processRecipe(r);
  }
  fs.writeFileSync(
    path.resolve('scripts/vaultStepsExtracted.json'),
    JSON.stringify(allResults, null, 2),
    'utf-8'
  );
  console.log('Finished downloading all authentic steps! Output saved to scripts/vaultStepsExtracted.json');
}

run();
