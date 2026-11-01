/**
 * sefazParser.js
 * Extrator e parser de cupons fiscais / NFC-e (SEFAZ Brasil)
 * Suporta URL direta, HTML completo e texto copiado de cupom.
 */

import { enrichScrapedItem } from './ingredientMatcher.js';

/**
 * Converte string brasileira de valor numérico ("5,89" ou "1.250,50") para Float
 */
function parseBrNumber(str) {
  if (!str) return 0;
  if (typeof str === 'number') return str;
  // Remove R$, espaços e caracteres não numéricos exceto . e ,
  const clean = str.replace(/[R$\s]/g, '').trim();
  if (clean.includes(',') && clean.includes('.')) {
    // Ex: "1.250,50" -> "1250.50"
    return parseFloat(clean.replace(/\./g, '').replace(',', '.'));
  }
  if (clean.includes(',')) {
    // Ex: "5,89" -> "5.89"
    return parseFloat(clean.replace(',', '.'));
  }
  return parseFloat(clean) || 0;
}

/**
 * Extrai texto limpo de tags HTML
 */
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Parser de HTML da SEFAZ (compatível com SP, RJ, MG, RS, PR, BA, DF e padrão ENCAT)
 */
export function parseSefazHtml(html) {
  if (!html || typeof html !== 'string') {
    throw new Error('Conteúdo HTML da SEFAZ vazio ou inválido.');
  }

  // 1. Extração do Supermercado / Razão Social
  let supermarket = 'Supermercado';
  const supMatch =
    html.match(/<span class="txtTopo">([^<]+)<\/span>/i) ||
    html.match(/<div class="txtTopo">([^<]+)<\/div>/i) ||
    html.match(/<h2[^>]*class="[^"]*topo[^"]*"[^>]*>([^<]+)<\/h2>/i) ||
    html.match(/<td[^>]*class="xNome"[^>]*>([^<]+)<\/td>/i) ||
    html.match(/<div id="u20"[^>]*>([^<]+)<\/div>/i) ||
    html.match(/Raz[aã]o Social:?\s*<strong[^>]*>([^<]+)<\/strong>/i) ||
    html.match(/<title>([^<]+)<\/title>/i);

  if (supMatch && supMatch[1]) {
    supermarket = stripHtml(supMatch[1]);
  }

  // 2. Extração da Data da Compra
  let purchaseDate = new Date().toISOString().split('T')[0];
  const dateMatch =
    html.match(/(\d{2}\/\d{2}\/\d{4})/i) ||
    html.match(/Emiss[aã]o:?\s*(\d{2}\/\d{2}\/\d{4})/i);
  if (dateMatch && dateMatch[1]) {
    const [d, m, y] = dateMatch[1].split('/');
    purchaseDate = `${y}-${m}-${d}`;
  }

  // 3. Extração dos Itens da Tabela
  const rawItems = [];

  // Padrão 1: Tabela ENCAT / SP / RJ com classes .txtTit, .Rqtd, .RUN, .RvlUnit, .valor
  const rowRegex = /<tr[^>]*id="(?:Item\s*\+\s*\d+|[^"]*item[^"]*)"[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;
  let hasRowMatches = false;

  while ((match = rowRegex.exec(html)) !== null) {
    hasRowMatches = true;
    const rowHtml = match[1];

    const nameMatch =
      rowHtml.match(/<span[^>]*class="txtTit[^"]*"[^>]*>([\s\S]*?)<\/span>/i) ||
      rowHtml.match(/<td[^>]*class="xProd"[^>]*>([\s\S]*?)<\/td>/i);

    const qtdMatch =
      rowHtml.match(/Qtde\.:?\s*<\/b>\s*([\d,\.]+)/i) ||
      rowHtml.match(/<span[^>]*class="Rqtd"[^>]*>[\s\S]*?([\d,\.]+)<\/span>/i) ||
      rowHtml.match(/<td[^>]*class="qCom"[^>]*>([\s\S]*?)<\/td>/i);

    const unitMatch =
      rowHtml.match(/UN:\s*<\/b>\s*([A-Za-z]+)/i) ||
      rowHtml.match(/<span[^>]*class="RUN"[^>]*>[\s\S]*?([A-Za-z]+)<\/span>/i) ||
      rowHtml.match(/<td[^>]*class="uCom"[^>]*>([\s\S]*?)<\/td>/i);

    const unitPriceMatch =
      rowHtml.match(/Vl\.\s*Unit\.:?\s*<\/b>\s*([\d,\.]+)/i) ||
      rowHtml.match(/<span[^>]*class="RvlUnit"[^>]*>[\s\S]*?([\d,\.]+)<\/span>/i) ||
      rowHtml.match(/<td[^>]*class="vUnCom"[^>]*>([\s\S]*?)<\/td>/i);

    const totalPriceMatch =
      rowHtml.match(/<span[^>]*class="valor"[^>]*>([\d,\.]+)<\/span>/i) ||
      rowHtml.match(/<td[^>]*class="vProd"[^>]*>([\d,\.]+)<\/td>/i);

    if (nameMatch) {
      rawItems.push({
        name: stripHtml(nameMatch[1]),
        quantity: parseBrNumber(qtdMatch ? qtdMatch[1] : '1'),
        unit: unitMatch ? stripHtml(unitMatch[1]) : 'un',
        unitPrice: parseBrNumber(unitPriceMatch ? unitPriceMatch[1] : '0'),
        totalPrice: parseBrNumber(totalPriceMatch ? totalPriceMatch[1] : '0'),
      });
    }
  }

  // Padrão 2: Se não pegou por linhas específicas de ID, varre todas as <tr> de tabelas
  if (!hasRowMatches || rawItems.length === 0) {
    const genericTrRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    while ((match = genericTrRegex.exec(html)) !== null) {
      const rowHtml = match[1];
      if (!rowHtml.includes('Qtde') && !rowHtml.includes('qCom') && !rowHtml.includes('txtTit')) continue;

      const nameMatch =
        rowHtml.match(/<span[^>]*class="txtTit[^"]*"[^>]*>([\s\S]*?)<\/span>/i) ||
        rowHtml.match(/<td[^>]*class="xProd"[^>]*>([\s\S]*?)<\/td>/i) ||
        rowHtml.match(/<td[^>]*>([A-Z0-9\s\.\-\/]{4,50})<\/td>/i);

      const qtdMatch = rowHtml.match(/([\d,\.]+)\s*(?:UN|KG|L|PT|CX)/i) || rowHtml.match(/Qtde\.:?\s*([\d,\.]+)/i);
      const unitMatch = rowHtml.match(/\b(KG|UN|L|ML|G|CX|PT|DZ|PC)\b/i);
      const valMatch = rowHtml.match(/R\$\s*([\d,\.]+)/i) || rowHtml.match(/<span class="valor">([\d,\.]+)<\/span>/i);

      if (nameMatch && (qtdMatch || valMatch)) {
        rawItems.push({
          name: stripHtml(nameMatch[1]),
          quantity: parseBrNumber(qtdMatch ? qtdMatch[1] : '1'),
          unit: unitMatch ? unitMatch[1] : 'un',
          unitPrice: 0,
          totalPrice: parseBrNumber(valMatch ? valMatch[1] : '0'),
        });
      }
    }
  }

  // 4. Se ainda assim não encontrou itens estruturados em tags, aplica o parser de texto no HTML desprovido de tags
  if (rawItems.length === 0) {
    const textContent = stripHtml(html);
    const textParsed = parseSefazText(textContent);
    return textParsed;
  }

  // Enriquece os itens com o matcher culinário
  const items = rawItems.map(enrichScrapedItem);
  const totalValue = items.reduce((acc, i) => acc + i.totalPrice, 0);

  return {
    supermarket,
    purchaseDate,
    totalValue: Number(totalValue.toFixed(2)),
    itemsCount: items.length,
    foodItemsCount: items.filter((i) => !i.isNonFood).length,
    items,
  };
}

/**
 * Parser de texto livre de cupom fiscal / NFC-e (quando o usuário cola o texto puro copiado)
 */
export function parseSefazText(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Texto da nota fiscal não informado.');
  }

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  let supermarket = 'Supermercado';
  let purchaseDate = new Date().toISOString().split('T')[0];

  // Tenta extrair razão social nas primeiras linhas
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const l = lines[i];
    if (l.length > 3 && !l.includes('NFC-e') && !l.includes('DANFE') && !l.includes('CNPJ') && !l.match(/^\d+$/)) {
      supermarket = l.replace(/[0-9\.\-\/]/g, '').trim() || supermarket;
      break;
    }
  }

  // Tenta extrair data
  const dateMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);
  if (dateMatch) {
    const [d, m, y] = dateMatch[1].split('/');
    purchaseDate = `${y}-${m}-${d}`;
  }

  const rawItems = [];

  // Padrão de linha com quantidade, unidade e valor
  // Ex: "ARROZ BRANCO T1 CAMIL 1KG Qtde.: 2 UN Vl.Unit.: 5,89 Vl.Total: 11,78"
  // Ex: "PEITO DE FRANGO KG 1,450 KG X 21,90 = 31,75"
  const itemLineRegex =
    /(.*?)(?:Qtde|Qtd|QTD)[\.:]?\s*([\d,\.]+)\s*([A-Za-z]{1,4})?\s*(?:Vl\.\s*Unit|Unit)[\.:]?\s*([\d,\.]+)\s*(?:Vl\.\s*Total|Total)?[\.:]?\s*([\d,\.]+)/i;

  const altItemRegex =
    /(.*?)\s+(\d+(?:[\.,]\d+)?)\s*(KG|UN|L|ML|G|CX|PT|DZ|PC)\s*(?:X|\*)\s*([\d,\.]+)\s+([\d,\.]+)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Testa padrão 1 (linha única detalhada)
    let m = line.match(itemLineRegex);
    if (m) {
      rawItems.push({
        name: m[1].replace(/^\d+[\s\.\-]+/, '').trim(),
        quantity: parseBrNumber(m[2]),
        unit: m[3],
        unitPrice: parseBrNumber(m[4]),
        totalPrice: parseBrNumber(m[5]),
      });
      continue;
    }

    // Testa padrão 2 (formato comercial compacto: NOME QTD UN X UNIT TOT)
    m = line.match(altItemRegex);
    if (m) {
      rawItems.push({
        name: m[1].replace(/^\d+[\s\.\-]+/, '').trim(),
        quantity: parseBrNumber(m[2]),
        unit: m[3],
        unitPrice: parseBrNumber(m[4]),
        totalPrice: parseBrNumber(m[5]),
      });
      continue;
    }

    // Testa padrão em duas linhas: Linha 1 = Nome, Linha 2 = "1,000 UN X 5,89 = 5,89"
    if (i < lines.length - 1) {
      const nextLine = lines[i + 1];
      const multiMatch = nextLine.match(/([\d,\.]+)\s*(KG|UN|L|ML|G|CX|PT)\s*(?:X|\*)\s*([\d,\.]+)\s*(?:=)?\s*([\d,\.]+)/i);
      if (multiMatch && line.length > 3 && !line.includes('TOTAL') && !line.includes('SUBTOTAL')) {
        rawItems.push({
          name: line.replace(/^\d+[\s\.\-]+/, '').trim(),
          quantity: parseBrNumber(multiMatch[1]),
          unit: multiMatch[2],
          unitPrice: parseBrNumber(multiMatch[3]),
          totalPrice: parseBrNumber(multiMatch[4]),
        });
        i++; // Pula a linha de detalhe
        continue;
      }
    }
  }

  // Se não capturou pelos formatos acima, faz um scan por linhas que contenham preços
  if (rawItems.length === 0) {
    for (const line of lines) {
      if (line.includes('TOTAL') || line.includes('TROCO') || line.includes('VALOR PAGO') || line.includes('ICMS')) continue;
      const priceMatches = line.match(/\b\d{1,3}(?:[\.,]\d{2})\b/g);
      if (priceMatches && priceMatches.length >= 1 && line.length > 8) {
        const total = parseBrNumber(priceMatches[priceMatches.length - 1]);
        const cleanName = line.replace(/[\d,\.]+/g, '').replace(/[R$\*X\-:]/g, '').trim();
        if (cleanName.length > 3 && total > 0) {
          rawItems.push({
            name: cleanName,
            quantity: 1,
            unit: 'un',
            unitPrice: total,
            totalPrice: total,
          });
        }
      }
    }
  }

  const items = rawItems.map(enrichScrapedItem);
  const totalValue = items.reduce((acc, i) => acc + i.totalPrice, 0);

  return {
    supermarket,
    purchaseDate,
    totalValue: Number(totalValue.toFixed(2)),
    itemsCount: items.length,
    foodItemsCount: items.filter((i) => !i.isNonFood).length,
    items,
  };
}

/**
 * Busca e processa uma URL direta da SEFAZ
 */
export async function parseSefazUrl(targetUrl) {
  if (!targetUrl || typeof targetUrl !== 'string') {
    throw new Error('URL da SEFAZ não fornecida.');
  }

  const cleanUrl = targetUrl.trim();
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    throw new Error('A URL da nota fiscal deve começar com http:// ou https://');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const res = await fetch(cleanUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`A SEFAZ retornou erro HTTP ${res.status}: ${res.statusText}`);
    }

    const html = await res.text();
    return parseSefazHtml(html);
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Tempo limite esgotado ao conectar com a SEFAZ (12s). Tente colar o texto ou HTML da página.');
    }
    throw new Error(`Não foi possível ler a URL da SEFAZ diretamente: ${err.message}. Você pode colar o texto ou HTML da nota com 1 clique.`);
  }
}

/**
 * Gera um cupom de demonstração do mundo real para testes imediatos
 */
export function getDemoSefazInvoice() {
  const demoItems = [
    { name: 'ARROZ BRANCO CAMIL T1 1KG', quantity: 2, unit: 'un', unitPrice: 5.89, totalPrice: 11.78 },
    { name: 'FEIJAO CARIOCA KICALDO 1KG', quantity: 1, unit: 'un', unitPrice: 7.49, totalPrice: 7.49 },
    { name: 'PEITO DE FRANGO FILE RESF KG', quantity: 1.45, unit: 'kg', unitPrice: 21.90, totalPrice: 31.75 },
    { name: 'CARNE MOIDA ACEM BOV RESF KG', quantity: 0.82, unit: 'kg', unitPrice: 36.90, totalPrice: 30.26 },
    { name: 'TOMATE ITALIA KG', quantity: 0.95, unit: 'kg', unitPrice: 8.90, totalPrice: 8.45 },
    { name: 'CEBOLA NACIONAL KG', quantity: 0.65, unit: 'kg', unitPrice: 5.49, totalPrice: 3.57 },
    { name: 'OVOS BRANCOS GRANDES DZ', quantity: 2, unit: 'un', unitPrice: 9.80, totalPrice: 19.60 },
    { name: 'AZEITE EXTRA VIRGEM BORGES 500ML', quantity: 1, unit: 'un', unitPrice: 46.90, totalPrice: 46.90 },
    { name: 'QUEIJO MUSSARELA FATIADO KG', quantity: 0.35, unit: 'kg', unitPrice: 48.00, totalPrice: 16.80 },
    { name: 'LEITE INTEGRAL UHT PIRACANJUBA 1L', quantity: 4, unit: 'l', unitPrice: 4.89, totalPrice: 19.56 },
    { name: 'SABAO EM PO OMO LAVAGEM PERFEITA 1.6KG', quantity: 1, unit: 'un', unitPrice: 22.90, totalPrice: 22.90 },
    { name: 'DETERGENTE LIQUIDO YPE 500ML', quantity: 2, unit: 'un', unitPrice: 2.39, totalPrice: 4.78 },
  ];

  const items = demoItems.map(enrichScrapedItem);
  const totalValue = items.reduce((acc, i) => acc + i.totalPrice, 0);

  return {
    supermarket: 'Atacadão Supermercados S.A.',
    purchaseDate: new Date().toISOString().split('T')[0],
    totalValue: Number(totalValue.toFixed(2)),
    itemsCount: items.length,
    foodItemsCount: items.filter((i) => !i.isNonFood).length,
    items,
    isDemo: true,
  };
}
