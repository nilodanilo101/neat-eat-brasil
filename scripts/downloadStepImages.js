import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const RECIPES_CONFIG = [
  { id: 'rec-1', dir: 'crepioca', slug: 'crepioca-de-queijo-com-tomate-e-oregano' },
  { id: 'rec-2', dir: 'overnight-oats', slug: 'overnight-oats-com-cacau-e-banana' },
  { id: 'rec-3', dir: 'ovos-mexidos', slug: 'ovos-mexidos' },
  { id: 'rec-4', dir: 'cuscuz', slug: 'cuscuz-nordestino' },
  { id: 'rec-5', dir: 'frango-grelhado', slug: 'file-de-frango-grelhado' },
  { id: 'rec-6', dir: 'carne-abobora', slug: 'carne-moida-com-abobora' },
  { id: 'rec-7', dir: 'escondidinho', slug: 'escondidinho-de-frango' },
  { id: 'rec-8', dir: 'strogonoff', slug: 'strogonoff-vegetariano' },
  { id: 'rec-9', dir: 'tilapia', slug: 'tilapia-grelhada' },
  { id: 'rec-10', dir: 'omelete', slug: 'omelete-de-forno-com-legumes' },
  { id: 'rec-11', dir: 'caldo-verde', slug: 'caldo-verde-com-mandioquinha' },
  { id: 'rec-12', dir: 'macarrao-alho-oleo', slug: 'macarrao-ao-alho-e-oleo' },
  { id: 'rec-13', dir: 'bowl-mexicano', slug: 'burrito-de-carne' },
  { id: 'rec-14', dir: 'frango-legumes', slug: 'frango-com-legumes' },
];

const BASE_OUT = path.resolve('public/dishes/steps');

async function processRecipe(r) {
  const targetDir = path.join(BASE_OUT, r.dir);
  fs.mkdirSync(targetDir, { recursive: true });

  const url = `https://www.receiteria.com.br/receita/${r.slug}/`;
  console.log(`Processing ${r.id} (${r.slug})...`);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
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
    const srcM = block.match(/src="([^"]+)"/);
    const sourceM = block.match(/<source\s+srcset="([^"]+)"/);

    if (dataFullM) imgUrl = dataFullM[1];
    else if (sourceM) imgUrl = sourceM[1].split(' ')[0];
    else if (srcM) imgUrl = srcM[1];

    const altM = block.match(/alt="([^"]+)"/);
    const textM = block.match(/class="ds-step__text">([\s\S]*?)<\/span>/);
    const alt = altM ? altM[1].trim() : '';
    const text = textM ? textM[1].replace(/<[^>]+>/g, '').trim() : '';

    if (imgUrl && !imgUrl.includes('logo') && !imgUrl.includes('icon')) {
      const tempPath = path.join(targetDir, `temp-${stepIdx}.jpg`);
      const finalWebp = path.join(targetDir, `step-${stepIdx}.webp`);

      try {
        const imgRes = await fetch(imgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
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
  for (const r of RECIPES_CONFIG) {
    allResults[r.id] = await processRecipe(r);
  }
  fs.writeFileSync(
    path.resolve('scripts/extractedSteps.json'),
    JSON.stringify(allResults, null, 2),
    'utf-8'
  );
  console.log('Finished processing all recipes! Results written to scripts/extractedSteps.json');
}

run();
