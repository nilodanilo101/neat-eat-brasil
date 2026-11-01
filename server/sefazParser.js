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

  // Verifica se o HTML é uma mensagem de rejeição do firewall da Fazenda (F5 BIG-IP)
  if (
    html.includes('Request Rejected') ||
    html.includes('The requested URL was rejected') ||
    html.includes('support ID is')
  ) {
    throw new Error(
      'O portal da Fazenda bloqueou a conexão direta com firewall (F5 BIG-IP). Abra o link no seu navegador ou celular, copie o texto dos produtos da nota fiscal e cole na aba "Colar Texto do Cupom".'
    );
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

  // Verifica se o texto é uma mensagem de rejeição de WAF / Firewall da Fazenda
  if (
    text.includes('Request Rejected') ||
    text.includes('The requested URL was rejected') ||
    text.includes('support ID is')
  ) {
    throw new Error(
      'A página da SEFAZ foi bloqueada pelo firewall do governo estadual (F5 BIG-IP). Abra o link no seu navegador ou celular, copie o texto dos produtos da nota fiscal e cole aqui diretamente.'
    );
  }

  const rawLines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  let supermarket = 'Supermercado';
  let purchaseDate = new Date().toISOString().split('T')[0];

  // Extrair Razão Social nas primeiras linhas
  for (let i = 0; i < Math.min(8, rawLines.length); i++) {
    const l = rawLines[i];
    if (
      l.length > 3 &&
      !l.match(/NFC-e|DANFE|CNPJ|IE:|DOCUMENTO|CHAVE|CONSUMIDOR|VIA|ESTRATO|CONSULTA|SEFAZ|FAZENDA/i) &&
      !l.match(/^\d+$/)
    ) {
      supermarket = l.replace(/[0-9\.\-\/]/g, '').trim() || supermarket;
      break;
    }
  }

  // Extrair data da compra (dd/mm/aaaa)
  const dateMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);
  if (dateMatch) {
    const [d, m, y] = dateMatch[1].split('/');
    purchaseDate = `${y}-${m}-${d}`;
  }

  const rawItems = [];
  const consumedLines = new Set();

  // ESTRATÉGIA 1: DETECTOR DE BLOCO SEFAZ (na mesma linha ou em linhas separadas)
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (consumedLines.has(i)) continue;

    // Caso A: Qtde e Vl.Unit na mesma linha
    const combinedMatch = line.match(
      /(?:Qtde|Qtd)[\.:\s]*([0-9]+(?:[,\.][0-9]+)?)[,\s]*(?:UN:?\s*([A-Za-z]+))?[,\s]*(?:Vl\.?\s*Unit\.?|Unit)[\.:\s]*([0-9]+(?:[,\.][0-9]+)?)/i
    );

    // Caso B: Qtde na linha i (ex: "Qtde.: 2,000" ou "Qtde: 1")
    const qtyOnlyMatch = line.match(/^(?:Qtde|Qtd)[\.:\s]*([0-9]+(?:[,\.][0-9]+)?)/i);

    if (combinedMatch || qtyOnlyMatch) {
      let qty = 0;
      let unit = 'un';
      let unitPrice = 0;
      let totalPrice = 0;
      const matchedIdxs = [i];

      if (combinedMatch) {
        qty = parseBrNumber(combinedMatch[1]);
        unit = combinedMatch[2] || 'un';
        unitPrice = parseBrNumber(combinedMatch[3]);
      } else {
        qty = parseBrNumber(qtyOnlyMatch[1]);
        // Tenta achar UN e Vl.Unit nas próximas linhas
        for (let j = i; j <= Math.min(rawLines.length - 1, i + 4); j++) {
          const next = rawLines[j];
          const unM = next.match(/(?:^|\s)UN:?\s*([A-Za-z]+)/i) || next.match(/^UN\s+([A-Za-z]+)$/i);
          if (unM && unit === 'un') {
            unit = unM[1];
            matchedIdxs.push(j);
          }
          const vUnitM = next.match(/(?:Vl\.?\s*Unit\.?|Unit)[\.:\s]*([0-9]+(?:[,\.][0-9]+)?)/i);
          if (vUnitM && !unitPrice) {
            unitPrice = parseBrNumber(vUnitM[1]);
            matchedIdxs.push(j);
          }
        }
      }

      // Procura o Nome do produto nas 1 a 4 linhas anteriores
      let name = '';
      for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
        const prev = rawLines[j];
        if (consumedLines.has(j)) break;
        if (prev.includes('Código') || prev.match(/^[0-9]+$/)) continue;
        if (prev.match(/Valor total|Total|Qtde|Qtd/i)) break;
        name = prev;
        matchedIdxs.push(j);
        break;
      }

      // Procura o Valor Total nas 1 a 5 linhas seguintes
      for (let j = i; j <= Math.min(rawLines.length - 1, i + 5); j++) {
        const next = rawLines[j];
        const totM = next.match(/(?:Valor total|Total|Vl\.?\s*Total)[\.:\s]*(?:R\$\s*)?([0-9]+(?:[,\.][0-9]+)?)/i);
        if (totM) {
          totalPrice = parseBrNumber(totM[1]);
          matchedIdxs.push(j);
          break;
        }
        // Se a linha tem apenas "Valor total", o número está na linha seguinte
        if (next.match(/^Valor total$/i) && j + 1 < rawLines.length) {
          const numM = rawLines[j + 1].match(/^(?:R\$\s*)?([0-9]+(?:[,\.][0-9]+)?)$/);
          if (numM) {
            totalPrice = parseBrNumber(numM[1]);
            matchedIdxs.push(j);
            matchedIdxs.push(j + 1);
            break;
          }
        }
      }

      if (!totalPrice && qty && unitPrice) totalPrice = Number((qty * unitPrice).toFixed(2));
      if (!unitPrice && qty && totalPrice) unitPrice = Number((totalPrice / qty).toFixed(2));

      if (name && (totalPrice > 0 || qty > 0)) {
        rawItems.push({
          name: name.replace(/^[0-9\.\-\s]+/, '').trim(),
          quantity: qty || 1,
          unit,
          unitPrice,
          totalPrice,
        });
        matchedIdxs.forEach((idx) => consumedLines.add(idx));
      }
    }
  }

  // ESTRATÉGIA 2: LINHA TABULADA / PLANILHA (Ex: "1 78912345 ARROZ CAMIL 1KG 2,000 UN 5,89 11,78" ou com tabs)
  const tabOrSpaceRegex =
    /^(?:(?:\d+[\t\s]+)?(?:[0-9]{7,14}[\t\s]+)?)?(.*?)(?:[\t\s]{2,}|\t|\s+)([0-9]{1,4}(?:[,\.][0-9]{1,3})?)[\t\s]*(UN|KG|L|ML|G|CX|PT|DZ|PC|UND|KILO)?(?:[\t\s]+(?:R\$\s*)?([0-9]+(?:[,\.][0-9]{2})))?[\t\s]+(?:R\$\s*)?([0-9]+(?:[,\.][0-9]{2}))\s*$/i;

  for (let i = 0; i < rawLines.length; i++) {
    if (consumedLines.has(i)) continue;
    const line = rawLines[i];
    if (line.match(/^(?:total|subtotal|troco|imposto|tributo|cartao|dinheiro|chave|protocolo)/i)) continue;
    const m = line.match(tabOrSpaceRegex);
    if (m) {
      const name = m[1].replace(/^[0-9\.\-\s]+/, '').trim();
      const quantity = parseBrNumber(m[2]);
      const unit = m[3] || 'un';
      let unitPrice = parseBrNumber(m[4] || '0');
      const totalPrice = parseBrNumber(m[5]);
      if (!unitPrice && quantity && totalPrice) unitPrice = Number((totalPrice / quantity).toFixed(2));

      if (name.length > 2 && totalPrice > 0) {
        rawItems.push({ name, quantity: quantity || 1, unit, unitPrice, totalPrice });
        consumedLines.add(i);
      }
    }
  }

  // ESTRATÉGIA 3: MULTIPLICAÇÃO EM 2 LINHAS (Linha 1: Nome, Linha 2: "2 UN X 5,89 = 11,78")
  const xLineRegex =
    /^([0-9]+(?:[,\.][0-9]+)?)\s*(UN|KG|L|ML|G|CX|PT|DZ|PC)?\s*(?:X|\*)\s*([0-9]+(?:[,\.][0-9]+)?)\s*(?:=)?\s*([0-9]+(?:[,\.][0-9]+)?)$/i;

  for (let i = 1; i < rawLines.length; i++) {
    if (consumedLines.has(i)) continue;
    const line = rawLines[i];
    const m = line.match(xLineRegex);
    if (m) {
      const prevLine = rawLines[i - 1];
      if (!consumedLines.has(i - 1) && prevLine.length > 2 && !prevLine.match(/total/i)) {
        const name = prevLine.replace(/^[0-9\.\-\s]+/, '').trim();
        const quantity = parseBrNumber(m[1]);
        const unit = m[2] || 'un';
        const unitPrice = parseBrNumber(m[3]);
        const totalPrice = parseBrNumber(m[4]);
        rawItems.push({ name, quantity, unit, unitPrice, totalPrice });
        consumedLines.add(i);
        consumedLines.add(i - 1);
      }
    }
  }

  // ESTRATÉGIA 4: NOTAÇÃO NATURAL / LISTA RÁPIDA (Ex: "Tomate 1.5kg 12,00" ou "Ovos 2dz 20,00")
  const simpleTrailingRegex =
    /^(.*?)\s+([0-9]+(?:[,\.][0-9]+)?)\s*(KG|UN|L|ML|G|CX|PT|DZ|PC|KILO|UND)?\s+(?:R\$\s*)?([0-9]+(?:[,\.][0-9]+)?)\s*$/i;

  for (let i = 0; i < rawLines.length; i++) {
    if (consumedLines.has(i)) continue;
    const line = rawLines[i];
    if (line.match(/^(?:total|subtotal|troco|cartao|emissao|cnpj|imposto|tributo|cpf|chave|via)/i)) continue;
    const m = line.match(simpleTrailingRegex);
    if (m) {
      const name = m[1].replace(/^[0-9\.\-\s]+/, '').trim();
      const quantity = parseBrNumber(m[2]);
      const unit = m[3] || 'un';
      const totalPrice = parseBrNumber(m[4]);
      if (name.length > 1 && quantity > 0 && totalPrice > 0) {
        const unitPrice = Number((totalPrice / quantity).toFixed(2));
        rawItems.push({ name, quantity, unit, unitPrice, totalPrice });
        consumedLines.add(i);
      }
    }
  }

  // ESTRATÉGIA 5: QUANTIDADE NA FRENTE (Ex: "1.5kg peito de frango 33,00" ou "2 cx leite 10,00" ou "3x feijão 21,00")
  const leadingQtyRegex =
    /^([0-9]+(?:[,\.][0-9]+)?)\s*(KG|UN|L|ML|G|CX|PT|DZ|PC|KILO|UND|X)?\s+(?:de\s+)?(.*?)\s+(?:R\$\s*)?([0-9]+(?:[,\.][0-9]+)?)\s*$/i;

  for (let i = 0; i < rawLines.length; i++) {
    if (consumedLines.has(i)) continue;
    const line = rawLines[i];
    if (line.match(/^(?:total|subtotal|troco|cartao|emissao|cnpj|imposto|tributo)/i)) continue;
    const m = line.match(leadingQtyRegex);
    if (m) {
      const quantity = parseBrNumber(m[1]);
      let unit = m[2] || 'un';
      if (unit.toUpperCase() === 'X') unit = 'un';
      const name = m[3].replace(/^[0-9\.\-\s]+/, '').trim();
      const totalPrice = parseBrNumber(m[4]);
      if (name.length > 1 && quantity > 0 && totalPrice > 0) {
        const unitPrice = Number((totalPrice / quantity).toFixed(2));
        rawItems.push({ name, quantity, unit, unitPrice, totalPrice });
        consumedLines.add(i);
      }
    }
  }

  // ESTRATÉGIA 6: NOME E PREÇO APENAS (Ex: "Azeite Borges R$ 46,90" ou "Café Pilão 18,50")
  const namePriceOnlyRegex =
    /^(.*?)\s+(?:R\$\s*)?([0-9]+[,\.][0-9]{2})\s*$/i;

  for (let i = 0; i < rawLines.length; i++) {
    if (consumedLines.has(i)) continue;
    const line = rawLines[i];
    if (line.match(/^(?:total|subtotal|troco|cartao|emissao|cnpj|imposto|tributo|chave|consumidor|pagamento|forma)/i)) continue;
    const m = line.match(namePriceOnlyRegex);
    if (m) {
      const name = m[1].replace(/^[0-9\.\-\s]+/, '').trim();
      const totalPrice = parseBrNumber(m[2]);
      if (name.length > 2 && totalPrice > 0) {
        rawItems.push({
          name,
          quantity: 1,
          unit: 'un',
          unitPrice: totalPrice,
          totalPrice,
        });
        consumedLines.add(i);
      }
    }
  }

  if (rawItems.length === 0) {
    throw new Error(
      'Nenhum produto foi reconhecido no texto informado. Cole o texto contendo os nomes dos produtos, quantidades e preços.'
    );
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
