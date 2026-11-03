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
 * Limpa o nome do insumo removendo quantidades, frações, unidades e observações
 */
export function cleanIngredientName(raw = '') {
  let str = String(raw || '').trim();
  // Remove parênteses com observações ou pesos
  str = str.replace(/\s*\([^)]*\)/g, '').trim();
  // Remove termos como 'a gosto', 'ou a gosto', 'opcional'
  str = str.replace(/\b(?:a\s+gosto|ou\s+a\s+gosto|opcional)\b/gi, '').trim();
  // Remove números e frações iniciais
  str = str.replace(/^[\d,./]+\s*/, '');
  // Remove unidades iniciais que possam ter restado
  str = str.replace(/^(?:colher(?:es)?\s+(?:de\s+)?(?:sopa|ch[aá]|sobremesa|caf[eé])|colher(?:es)?|x[ií]caras?\s*(?:de\s+ch[aá])?|copos?|dentes?|latas?|sach[eê]s?|pacotes?|ma[çc]os?|gramas?|quilos?|\bkg\b|\bg\b|\bml\b|\blitros?\b|\bl\b|unidades?|\bun\b|fatias?|fio|pitadas?)\s*/i, '');
  // Remove preposições iniciais (de, do, da, dos, das)
  str = str.replace(/^(?:de\s+|do\s+|da\s+|dos\s+|das\s+)/i, '');
  str = str.trim();
  if (str.length > 0) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
}

/**
 * Normaliza e categoriza um ingrediente textual para o formato estruturado do NeatEat
 */
export function parseIngredientLine(rawLine = '') {
  let str = String(rawLine || '').trim();
  if (!str) return null;

  // Remove marcações de lista e numeração inicial
  str = str.replace(/^[-•*–—]\s*/, '').replace(/^\d+[\.\)]\s*/, '').trim();

  let name = '';
  let amount = 1;
  let unit = 'un';

  // 1. Verifica se há parêntese com peso ou volume métrico específico: ex: (500 gramas), (45 ml), (4 gramas), (240 ml)
  let parenWeight = null;
  const parenMatch = str.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const inside = parenMatch[1].trim();
    const parenNumMatch = inside.match(/^([\d,.]+)\s*([a-zA-Zçãéíóú]+)$/i);
    if (parenNumMatch) {
      const pAmt = parseFloat(parenNumMatch[1].replace(',', '.'));
      let u = parenNumMatch[2].toLowerCase();
      if (u === 'gramas' || u === 'g') u = 'g';
      else if (u === 'ml') u = 'ml';
      else if (u === 'kg' || u === 'quilos') u = 'kg';
      else if (u === 'litros' || u === 'l') u = 'l';
      parenWeight = { amount: pAmt, unit: u };
    }
  }

  // 2. Frações culinárias: 1/2, 1/4, 3/4
  const fracMatch = str.match(/^(\d+)\/(\d+)\s*(.*)/);
  if (fracMatch) {
    const val = parseInt(fracMatch[1], 10) / parseInt(fracMatch[2], 10);
    str = `${val} ${fracMatch[3]}`;
  }

  // 3. Tenta casamento com unidades explícitas usando colher(?:es)?
  const unitRegex = /^([\d,.]+)\s*(colher(?:es)?\s+(?:de\s+)?(?:sopa|ch[aá]|sobremesa|caf[eé])|colher(?:es)?|x[ií]caras?\s*(?:de\s+ch[aá])?|copos?|dentes?|latas?|sach[eê]s?|pacotes?|ma[çc]os?|gramas?|quilos?|\bkg\b|\bg\b|\bml\b|\blitros?\b|\bl\b|unidades?|\bun\b|fatias?|fio|pitadas?)\s*(?:de\s+|do\s+|da\s+|dos\s+|das\s+)?(.*)/i;
  const matchWithUnit = str.match(unitRegex);

  if (matchWithUnit) {
    amount = parseFloat(matchWithUnit[1].replace(',', '.')) || 1;
    const rawUnit = matchWithUnit[2].toLowerCase().trim();
    if (rawUnit.includes('sopa')) unit = 'colher de sopa';
    else if (rawUnit.includes('sobremesa')) unit = 'colher de sobremesa';
    else if (rawUnit.includes('chá') || rawUnit.includes('cha')) unit = 'colher de chá';
    else if (rawUnit.includes('café') || rawUnit.includes('cafe')) unit = 'colher de café';
    else if (rawUnit.includes('xícara') || rawUnit.includes('xicara')) unit = 'xícara';
    else if (rawUnit.includes('grama') || rawUnit === 'g') unit = 'g';
    else if (rawUnit.includes('quilo') || rawUnit === 'kg') unit = 'kg';
    else if (rawUnit.includes('dente')) unit = 'dente';
    else if (rawUnit.includes('fatia')) unit = 'fatia';
    else if (rawUnit.includes('lata')) unit = 'lata';
    else if (rawUnit.includes('sachê') || rawUnit.includes('sache')) unit = 'sachê';
    else if (rawUnit.includes('pacote')) unit = 'pacote';
    else if (rawUnit.includes('maço') || rawUnit.includes('maco')) unit = 'maço';
    else if (rawUnit === 'ml') unit = 'ml';
    else if (rawUnit === 'l' || rawUnit.includes('litro')) unit = 'l';
    else unit = 'un';

    name = cleanIngredientName(matchWithUnit[3]);
  } else {
    // Tenta número sem unidade explícita: ex: "3 cebolas", "2 tomates", "5 batatas"
    const numOnlyMatch = str.match(/^([\d,.]+)\s*(?:de\s+)?(.*)/i);
    if (numOnlyMatch) {
      amount = parseFloat(numOnlyMatch[1].replace(',', '.')) || 1;
      unit = 'un';
      name = cleanIngredientName(numOnlyMatch[2]);
    } else {
      name = cleanIngredientName(str);
      if (str.toLowerCase().includes('a gosto')) {
        unit = 'a gosto';
        amount = 1;
      }
    }
  }

  // Se houver especificação métrica mais precisa nos parênteses, aplicamos ao amount e unit
  if (parenWeight) {
    amount = parenWeight.amount;
    unit = parenWeight.unit;
  }

  name = cleanIngredientName(name);

  // Normalização de nomes e plurais comuns
  if (name.toLowerCase() === 'batatas') name = 'Batata';
  if (name.toLowerCase() === 'cebolas') name = 'Cebola';
  if (name.toLowerCase() === 'tomates') name = 'Tomate';
  if (name.toLowerCase() === 'dentes de alho') name = 'Alho';

  return classifyIngredient(name, amount, unit);
}

function classifyIngredient(rawName, amount, unit) {
  const cleanName = cleanIngredientName(rawName);
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
    lower.includes('salsinha') ||
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
    lower.includes('chimichurri') ||
    lower.includes('tempero') ||
    lower.includes('canela') ||
    lower.includes('pimenta') ||
    lower.includes('sal') ||
    lower.includes('louro')
  ) {
    aisle = 'Temperos';
  }

  const isWater = lower === 'água' || lower === 'agua';

  return {
    name: cleanName || 'Ingrediente',
    amount: Number(amount) || 1,
    unit: unit || 'un',
    aisle,
    isWater,
    basePrice: isWater ? 0 : 1.5,
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
