// ============================================================================
// SERVIÇO DE FOTOGRAFIA CULINÁRIA PROFISSIONAL (UNSPLASH / GOURMET FOOD API)
// Fotos em alta resolução, iluminação de estúdio e enquadramento gastronômico
// ============================================================================

const TRANSLATION_MAP = {
  arroz: 'rice',
  feijao: 'beans',
  frango: 'roasted chicken',
  carne: 'beef steak',
  peixe: 'fish fillet',
  tilapia: 'grilled tilapia',
  salmao: 'grilled salmon',
  ovo: 'eggs',
  omelete: 'omelette',
  panqueca: 'pancakes',
  salada: 'salad bowl',
  sopa: 'warm soup',
  caldo: 'broth soup',
  mandioca: 'cassava',
  batata: 'potatoes',
  abobora: 'pumpkin soup',
  cuscuz: 'couscous',
  tapioca: 'crepe flatbread',
  strogonoff: 'stroganoff',
  hamburguer: 'burger plate',
  macarrao: 'pasta dish',
  espaguete: 'spaghetti',
  lasanha: 'lasagna',
  torta: 'savory pie',
  sanduiche: 'gourmet sandwich',
};

function translateCulinaryQuery(dishTitle = '') {
  const norm = String(dishTitle)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const words = norm.split(/\s+/).filter(Boolean);
  const englishTerms = [];

  for (const w of words) {
    if (TRANSLATION_MAP[w]) {
      englishTerms.push(TRANSLATION_MAP[w]);
    }
  }

  if (englishTerms.length > 0) {
    return englishTerms.join(' ') + ' delicious food plate gourmet';
  }
  return norm + ' food recipe plate';
}

export async function searchHighResDishPhotos(dishTitle = '', unsplashKey = process.env.UNSPLASH_ACCESS_KEY) {
  const cleanTitle = String(dishTitle).trim();
  if (!cleanTitle) return [];

  // 1. Tenta API oficial do Unsplash se a chave estiver configurada
  if (unsplashKey && unsplashKey.trim()) {
    try {
      const q = translateCulinaryQuery(cleanTitle);
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        q
      )}&per_page=6&orientation=landscape`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${unsplashKey.trim()}`,
        },
      });

      if (res.ok) {
        const json = await res.json();
        const photos = (json.results || []).map((r) => r.urls?.regular || r.urls?.small).filter(Boolean);
        if (photos.length > 0) return photos;
      }
    } catch (err) {
      console.warn('Unsplash API request failed, usando fonte culinária alternativa:', err.message);
    }
  }

  // 2. Busca gastronômica alternativa com enquadramento culinário
  try {
    const res = await fetch(
      'https://www.receiteria.com.br/?s=' + encodeURIComponent(cleanTitle.replace(/\([^)]*\)/g, ' ').trim()),
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        },
      }
    );
    if (res.ok) {
      const html = await res.text();
      const matches = [
        ...html.matchAll(
          /https:\/\/www\.receiteria\.com\.br\/wp-content\/uploads\/[^"'\s>]+\.(?:jpg|jpeg|png|webp)/gi
        ),
      ]
        .map((m) => m[0].replace(/-\d+x\d+\.(jpg|jpeg|png|webp)$/i, '.$1'))
        .filter(
          (u) =>
            !u.includes('logo') &&
            !u.includes('icon') &&
            !u.includes('avatar') &&
            !u.includes('banner')
        );

      const unique = [...new Set(matches)];
      if (unique.length > 0) {
        return unique.slice(0, 6).map((u) => `/api/image-proxy?url=${encodeURIComponent(u)}`);
      }
    }
  } catch {
    // fallback
  }

  return ['/dishes/rec-5.jpg'];
}
