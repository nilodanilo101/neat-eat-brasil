// ============================================================================
// SERVIÇO DE CONSULTA OPEN FOOD FACTS (BRASIL)
// 100% Gratuito, sem autenticação, com dados de marcas, rótulos e pesos
// ============================================================================

export async function searchOpenFoodFacts(query = '') {
  const clean = String(query).trim();
  if (!clean || clean.length < 2) return [];

  const isBarcode = /^\d{8,14}$/.test(clean);

  // Se for código de barras (EAN-13, EAN-8)
  if (isBarcode) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(clean)}.json`,
        {
          headers: {
            'User-Agent': 'NeatEatBrasil/2.0 (app@neateat.com.br)',
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.status === 1 && json.product) {
          return [formatProduct(json.product)];
        }
      }
    } catch {
      // fallback to text search
    }
  }

  // Busca textual em produtos cadastrados no Brasil
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const url = `https://br.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      clean
    )}&search_simple=1&action=process&json=1&page_size=8`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'NeatEatBrasil/2.0 (app@neateat.com.br)',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const products = Array.isArray(data.products) ? data.products : [];
      return products
        .filter((p) => p.product_name && p.product_name.trim().length > 2)
        .slice(0, 6)
        .map(formatProduct);
    }
  } catch (err) {
    console.warn('Open Food Facts consulta offline ou lenta:', err.message);
  }

  return [];
}

function formatProduct(p) {
  const nutriments = p.nutriments || {};
  return {
    code: p.code || '',
    name: p.product_name || p.product_name_pt || 'Produto sem nome',
    brand: p.brands || 'Marca não informada',
    quantity: p.quantity || '',
    packaging: p.packaging || '',
    categories: Array.isArray(p.categories_tags)
      ? p.categories_tags.map((c) => c.replace(/^[a-z]{2}:/, '')).slice(0, 3)
      : [],
    nova_group: p.nova_group || null, // 1: In natura, 2: Culinário, 3: Processado, 4: Ultraprocessado
    nutriscore_grade: p.nutriscore_grade ? p.nutriscore_grade.toUpperCase() : null,
    image_url: p.image_front_small_url || p.image_front_url || p.image_url || '',
    nutriments: {
      kcal_100g: Math.round(Number(nutriments['energy-kcal_100g'] || nutriments.energy_100g / 4.184) || 0),
      protein_100g: Number((nutriments.proteins_100g || 0).toFixed(1)),
      carbs_100g: Number((nutriments.carbohydrates_100g || 0).toFixed(1)),
      fat_100g: Number((nutriments.fat_100g || 0).toFixed(1)),
      fiber_100g: Number((nutriments.fiber_100g || 0).toFixed(1)),
      sodium_100g: Number((nutriments.sodium_100g || 0).toFixed(2)),
    },
  };
}
