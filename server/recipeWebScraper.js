/**
 * recipeWebScraper.js
 * Extrator web gastronômico profissional de receitas culinárias.
 * Extrai Schema.org JSON-LD (HowToStep com fotos individuais dos passos, tempos e insumos)
 * e possui fallback para análise semântica de HTML/DOM para sites brasileiros e internacionais.
 */

import { computeCulinaryPortionCost } from './ingredientMatcher.js';

/**
 * Converte duração ISO 8601 (ex: PT1H15M, PT45M) para minutos numéricos
 */
export function parseDurationISO(iso) {
  if (!iso || typeof iso !== 'string') return 0;
  const h = iso.match(/(\d+)\s*H/i);
  const m = iso.match(/(\d+)\s*M/i);
  return (h ? parseInt(h[1], 10) * 60 : 0) + (m ? parseInt(m[1], 10) : 0);
}

/**
 * Extrai segundos de timer de um texto de passo culinário
 */
export function extractStepTimerSeconds(text = '') {
  if (!text) return 120;
  const t = text.toLowerCase();

  // "1 hora e 20 minutos" ou "1h30"
  const hrMinMatch = t.match(/(\d+)\s*(?:hora|horas|h)\s*(?:e\s*)?(\d+)?\s*(?:minuto|minutos|min)?/i);
  if (hrMinMatch) {
    const hours = parseInt(hrMinMatch[1], 10) || 0;
    const mins = parseInt(hrMinMatch[2], 10) || 0;
    if (hours > 0) return Math.min(7200, (hours * 60 + mins) * 60);
  }

  // "45 minutos" ou "10 a 15 minutos"
  const minRangeMatch = t.match(/(\d+)\s*(?:a|à|-)\s*(\d+)\s*(?:minuto|minutos|min)/i);
  if (minRangeMatch) {
    return parseInt(minRangeMatch[2], 10) * 60;
  }

  const minMatch = t.match(/(\d+)\s*(?:minuto|minutos|min)/i);
  if (minMatch) {
    return parseInt(minMatch[1], 10) * 60;
  }

  // "40 segundos"
  const secMatch = t.match(/(\d+)\s*(?:segundo|segundos|seg|s)\b/i);
  if (secMatch) {
    return Math.max(20, parseInt(secMatch[1], 10));
  }

  return 120; // default 2 min
}

/**
 * Normaliza e categoriza um ingrediente textual para o formato estruturado do NeatEat
 */
export function parseIngredientLine(rawLine = '') {
  let str = String(rawLine).trim();
  if (!str) return null;

  // Remove marcações de lista e numeração inicial
  str = str.replace(/^[-•*–—]\s*/, '').replace(/^\d+[\.\)]\s*/, '').trim();

  // Caso 1: "Nome do insumo (1,5 kg)" ou "Molho de tomate (2 sachês)"
  const parenMatch = str.match(/^(.+?)\s*\(([\d,\.]+)\s*([a-zA-Zçãéíóú\s]+)\)$/i);
  if (parenMatch) {
    const name = parenMatch[1].trim();
    const amt = parseFloat(parenMatch[2].replace(',', '.'));
    const unit = parenMatch[3].trim();
    return classifyIngredient(name, amt, unit);
  }

  // Frações brasileiras comuns: 1/2, 1/4, 3/4
  const fracMatch = str.match(/^(\d+)\/(\d+)\s*(.*)/);
  if (fracMatch) {
    const val = parseInt(fracMatch[1], 10) / parseInt(fracMatch[2], 10);
    str = `${val} ${fracMatch[3]}`;
  }

  // Caso 2: "1 colher de chá de cominho em pó", "2 dentes de alho", "500 gramas de acém"
  const measureMatch = str.match(
    /^([\d,\.]+)\s*(colheres?\s+de\s+sopa|colheres?\s+de\s+ch[aá]|colheres?\s+de\s+sobremesa|colheres?\s+de\s+caf[eé]|x[ií]caras?|copos?|dentes?|latas?|sach[eê]s?|pacotes?|ma[çc]os?|gramas?|quilos?|kg|g|ml|l|unidades?|un|fatias?|fio|pitada)?\s*(?:de\s+|do\s+|da\s+|dos\s+|das\s+)?(.*)/i
  );

  if (measureMatch) {
    const amt = parseFloat(measureMatch[1].replace(',', '.')) || 1;
    let unit = measureMatch[2]?.toLowerCase().trim() || 'un';
    let name = measureMatch[3]?.trim() || str;

    if (unit.includes('sopa')) unit = 'colher de sopa';
    else if (unit.includes('chá') || unit.includes('cha')) unit = 'colher de chá';
    else if (unit.includes('sobremesa')) unit = 'colher de sobremesa';
    else if (unit.includes('café') || unit.includes('cafe')) unit = 'colher de café';
    else if (unit.includes('xícara') || unit.includes('xicara')) unit = 'xícara';
    else if (unit.includes('grama') || unit === 'g') unit = 'g';
    else if (unit.includes('quilo') || unit === 'kg') unit = 'kg';
    else if (unit.includes('dente')) unit = 'dente';
    else if (unit.includes('fatia')) unit = 'fatia';

    return classifyIngredient(name.replace(/\([^)]*\)/g, '').trim(), amt, unit);
  }

  // Fallback para itens a gosto ou sem número explícito
  return classifyIngredient(str.replace(/\([^)]*\)/g, '').trim(), 1, 'a gosto');
}

function classifyIngredient(rawName, amount, unit) {
  const cleanName = rawName
    .replace(/^de\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  const lower = cleanName.toLowerCase();
  let aisle = 'Mercearia';

  if (
    lower.includes('carne') ||
    lower.includes('acém') ||
    lower.includes('acem') ||
    lower.includes('patinho') ||
    lower.includes('frango') ||
    lower.includes('peixe') ||
    lower.includes('tilápia') ||
    lower.includes('alcatra') ||
    lower.includes('músculo') ||
    lower.includes('costela') ||
    lower.includes('bacon') ||
    lower.includes('linguiça') ||
    lower.includes('calabresa') ||
    lower.includes('pernil')
  ) {
    aisle = 'Açougue';
  } else if (
    lower.includes('queijo') ||
    lower.includes('leite') ||
    lower.includes('ovo') ||
    lower.includes('requeijão') ||
    lower.includes('manteiga') ||
    lower.includes('iogurte') ||
    lower.includes('creme de leite') ||
    lower.includes('ricota')
  ) {
    aisle = 'Laticínios e Ovos';
  } else if (
    lower.includes('tomate') ||
    lower.includes('cebola') ||
    lower.includes('alho') ||
    lower.includes('pimentão') ||
    lower.includes('pimentao') ||
    lower.includes('cenoura') ||
    lower.includes('batata') ||
    lower.includes('mandioca') ||
    lower.includes('cheiro-verde') ||
    lower.includes('cebolinha') ||
    lower.includes('coentro') ||
    lower.includes('couve') ||
    lower.includes('abobrinha') ||
    lower.includes('banana') ||
    lower.includes('limão') ||
    lower.includes('limao')
  ) {
    aisle = 'Hortifruti';
  } else if (
    lower.includes('cominho') ||
    lower.includes('páprica') ||
    lower.includes('paprica') ||
    lower.includes('orégano') ||
    lower.includes('tempero') ||
    lower.includes('canela') ||
    lower.includes('pimenta') ||
    lower.includes('louro')
  ) {
    aisle = 'Temperos';
  }

  return {
    name: cleanName || 'Ingrediente',
    amount: Number(amount) || 1,
    unit: unit || 'un',
    aisle,
    basePrice: 1.5,
  };
}

/**
 * Extrai Schema.org Recipe JSON-LD de uma string HTML
 */
function extractSchemaRecipe(html) {
  const jsonLdMatches = [
    ...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ];

  for (const m of jsonLdMatches) {
    try {
      const data = JSON.parse(m[1].trim());
      if (data['@type'] === 'Recipe') return data;
      if (Array.isArray(data['@type']) && data['@type'].includes('Recipe')) return data;
      if (Array.isArray(data['@graph'])) {
        const found = data['@graph'].find(
          (g) => g['@type'] === 'Recipe' || (Array.isArray(g['@type']) && g['@type'].includes('Recipe'))
        );
        if (found) return found;
      }
    } catch {
      // continua procurando nos outros blocos
    }
  }
  return null;
}

/**
 * Desempacota as instruções Schema.org em array linear de passos com textos e fotos
 */
function unrollInstructions(rawInstructions = [], pageUrl = '') {
  const steps = [];

  const processItem = (item, currentSection = '') => {
    if (!item) return;

    if (typeof item === 'string') {
      const clean = item.replace(/<[^>]+>/g, '').trim();
      if (clean.length > 5) {
        steps.push({
          text: clean,
          image: null,
          section: currentSection || 'Preparo da Receita',
        });
      }
      return;
    }

    if (item['@type'] === 'HowToSection' && Array.isArray(item.itemListElement)) {
      const secName = item.name || currentSection || 'Etapa do Preparo';
      item.itemListElement.forEach((sub) => processItem(sub, secName));
      return;
    }

    if (item['@type'] === 'HowToStep' || item.text) {
      const text = String(item.text || item.description || '')
        .replace(/<[^>]+>/g, '')
        .trim();
      if (text.length > 5) {
        let imageUrl = null;
        if (typeof item.image === 'string') imageUrl = item.image;
        else if (item.image?.url) imageUrl = item.image.url;
        else if (Array.isArray(item.image) && item.image[0]) {
          imageUrl = typeof item.image[0] === 'string' ? item.image[0] : item.image[0].url;
        }

        // Corrige URLs relativas
        if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
          try {
            imageUrl = new URL(imageUrl, pageUrl).href;
          } catch {}
        }

        steps.push({
          text,
          image: imageUrl,
          section: currentSection || item.name || 'Preparo da Receita',
        });
      }
    }
  };

  if (Array.isArray(rawInstructions)) {
    rawInstructions.forEach((i) => processItem(i));
  } else if (typeof rawInstructions === 'string') {
    processItem(rawInstructions);
  }

  return steps;
}

/**
 * Extrator principal que processa qualquer página HTML de receita
 */
export function extractRecipeFromHtml(html = '', pageUrl = '') {
  if (!html || typeof html !== 'string') return null;

  // 1. Tenta Schema.org JSON-LD oficial (Receiteria, TudoGostoso, Panelinha, Cybercook, etc.)
  const schema = extractSchemaRecipe(html);

  if (schema) {
    const rawSteps = unrollInstructions(schema.recipeInstructions, pageUrl);
    const rawIngs = (schema.recipeIngredient || [])
      .map(parseIngredientLine)
      .filter(Boolean);

    // Extrai imagem principal
    let heroImage = '';
    if (typeof schema.image === 'string') heroImage = schema.image;
    else if (schema.image?.url) heroImage = schema.image.url;
    else if (Array.isArray(schema.image) && schema.image[0]) {
      heroImage = typeof schema.image[0] === 'string' ? schema.image[0] : schema.image[0].url;
    }

    // Extrai tempos e rendimento
    const totalMinutes =
      parseDurationISO(schema.totalTime) ||
      parseDurationISO(schema.cookTime) + parseDurationISO(schema.prepTime) ||
      35;
    const servingsMatch = String(schema.recipeYield || '').match(/\d+/);
    const servings = servingsMatch ? parseInt(servingsMatch[0], 10) : 4;

    if (rawSteps.length >= 2 || rawIngs.length >= 2) {
      return {
        title: String(schema.name || '').replace(/<[^>]+>/g, '').trim(),
        description: String(schema.description || '').replace(/<[^>]+>/g, '').trim(),
        heroImage,
        prepTime: totalMinutes,
        servings: Math.max(1, servings),
        ingredients: rawIngs,
        rawSteps, // [{ text, image, section }]
        isFullExtraction: true,
      };
    }
  }

  // 2. Fallback: Varredura Semântica de HTML (se o site não usar JSON-LD)
  const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  const h1Title = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = ogTitle ? ogTitle[1] : (h1Title ? h1Title[1].replace(/<[^>]+>/g, '').trim() : 'Receita Culinária');

  const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  const heroImage = ogImage ? ogImage[1] : '';

  // Procura por listas ordenadas de modo de preparo
  const domSteps = [];
  const stepMatches = [
    ...html.matchAll(/<(?:li|p|div)[^>]*(?:class=["'][^"']*(?:step|passo|instru|preparo)[^"']*["'])[^>]*>([\s\S]*?)<\/(?:li|p|div)>/gi),
  ];

  for (const sm of stepMatches) {
    const text = sm[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length > 15 && !text.toLowerCase().includes('comentário') && !text.toLowerCase().includes('publicidade')) {
      // Procura foto interna na tag
      const imgMatch = sm[0].match(/<img[^>]*src=["']([^"']+)["']/i);
      domSteps.push({
        text,
        image: imgMatch ? imgMatch[1] : null,
        section: 'Modo de Preparo',
      });
    }
  }

  return {
    title: title.split('|')[0].split('-')[0].trim(),
    heroImage,
    prepTime: 30,
    servings: 2,
    ingredients: [],
    rawSteps: domSteps,
    isFullExtraction: domSteps.length >= 3,
  };
}
