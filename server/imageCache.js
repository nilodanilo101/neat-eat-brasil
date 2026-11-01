import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.NEATEAT_DATA_DIR || __dirname;
const CACHE_DIR = path.join(dataDir, 'cache', 'step-images');

// Limite estrito de 30 MB para cache rotativo de imagens
const MAX_CACHE_BYTES = 30 * 1024 * 1024;

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function hashUrl(url) {
  return crypto.createHash('md5').update(url).digest('hex');
}

/**
 * Retorna o caminho do arquivo em cache ou baixa sob demanda respeitando a cota máxima de 30 MB (LRU).
 */
export async function getOrFetchCachedImage(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith('http')) {
    return imageUrl;
  }

  const hash = hashUrl(imageUrl);
  const ext = path.extname(new URL(imageUrl).pathname) || '.webp';
  const filePath = path.join(CACHE_DIR, `${hash}${ext}`);

  if (fs.existsSync(filePath)) {
    // Atualiza mtime para marcar como recentemente acessado (LRU)
    const now = new Date();
    fs.utimesSync(filePath, now, now);
    return `/cache/step-images/${hash}${ext}`;
  }

  // Baixa a imagem
  try {
    const res = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'NeatEat-Brasil/1.0 (+https://neateat.com.br)',
      },
    });
    if (!res.ok) return imageUrl;

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Executa rotação LRU se ultrapassou o teto de 30MB
    enforceLruLimit();

    return `/cache/step-images/${hash}${ext}`;
  } catch (err) {
    console.warn('[ImageCache] Falha ao baixar imagem remota:', err.message);
    return imageUrl;
  }
}

/**
 * Remove os arquivos mais antigos quando o diretório ultrapassa MAX_CACHE_BYTES
 */
export function enforceLruLimit() {
  try {
    const files = fs.readdirSync(CACHE_DIR).map((name) => {
      const p = path.join(CACHE_DIR, name);
      const stat = fs.statSync(p);
      return { path: p, size: stat.size, mtime: stat.mtimeMs };
    });

    let totalSize = files.reduce((acc, f) => acc + f.size, 0);
    if (totalSize <= MAX_CACHE_BYTES) return;

    // Ordena do mais antigo para o mais recente
    files.sort((a, b) => a.mtime - b.mtime);

    for (const f of files) {
      if (totalSize <= MAX_CACHE_BYTES * 0.8) break; // Reduz para 80% da cota
      try {
        fs.unlinkSync(f.path);
        totalSize -= f.size;
      } catch {
        // Ignora
      }
    }
  } catch (err) {
    console.warn('[ImageCache] Erro ao aplicar LRU:', err.message);
  }
}

export { CACHE_DIR };
