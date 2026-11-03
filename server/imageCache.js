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

/**
 * Baixa e armazena permanentemente em cache local uma imagem de receita com nome personalizado.
 * Garante disponibilidade 100% offline, sem dependência de proxy ou latência de rede.
 */
export async function cacheRecipeImage(imageUrl, preferredFilename = '') {
  if (!imageUrl || typeof imageUrl !== 'string') return null;
  if (imageUrl.startsWith('/dishes/') || imageUrl.startsWith('/cache/')) return imageUrl;

  try {
    let cleanUrl = imageUrl.trim();
    if (cleanUrl.startsWith('/api/image-proxy?url=')) {
      const parsed = new URL('http://127.0.0.1' + cleanUrl);
      cleanUrl = decodeURIComponent(parsed.searchParams.get('url') || cleanUrl);
    }
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) return null;

    let ext = '.jpg';
    try {
      const uPath = new URL(cleanUrl).pathname;
      const parsedExt = path.extname(uPath);
      if (parsedExt && parsedExt.length <= 5) ext = parsedExt;
    } catch {}

    const filename = preferredFilename ? `${preferredFilename}${ext}` : `${hashUrl(cleanUrl)}${ext}`;
    const filePath = path.join(CACHE_DIR, filename);

    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      if (stat.size > 1000) {
        return `/cache/step-images/${filename}`;
      }
    }

    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    };
    if (cleanUrl.includes('receiteria')) {
      headers['Referer'] = 'https://www.receiteria.com.br/';
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(cleanUrl, { headers, signal: controller.signal, redirect: 'follow' });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length > 500) {
      fs.writeFileSync(filePath, buffer);
      enforceLruLimit();
      return `/cache/step-images/${filename}`;
    }
  } catch (err) {
    console.warn('[ImageCache] Falha ao baixar imagem remota:', err.message);
  }
  return null;
}

export { CACHE_DIR };
