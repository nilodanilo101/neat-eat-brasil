/**
 * ingredientMatcher.js
 * Mapeia termos comerciais de cupons fiscais / NFC-e para ingredientes canônicos do NeatEat Brasil
 */

// Lista de ingredientes culinários canônicos reconhecidos no NeatEat
export const CANONICAL_INGREDIENTS = [
  // Açougue / Carnes / Ovos
  { key: 'carne_moida', name: 'Carne moída (acém ou patinho)', aisle: 'Açougue', stdUnit: 'kg', defaultPricePerKg: 38.00, keywords: ['carne moida', 'moida', 'acem moido', 'patinho moido', 'acem', 'patinho', 'musculo moido'] },
  { key: 'frango_peito', name: 'Peito de frango', aisle: 'Açougue', stdUnit: 'kg', defaultPricePerKg: 22.50, keywords: ['peito frango', 'peito de frango', 'file peito', 'frango file', 'sassami', 'filezinho de frango'] },
  { key: 'frango_coxa', name: 'Coxa e sobrecoxa de frango', aisle: 'Açougue', stdUnit: 'kg', defaultPricePerKg: 16.90, keywords: ['sobrecoxa', 'coxa frango', 'coxa sobrecoxa'] },
  { key: 'carne_bovina_bife', name: 'Carne bovina em tiras/bifes', aisle: 'Açougue', stdUnit: 'kg', defaultPricePerKg: 42.00, keywords: ['alcatra', 'contra file', 'coxao mole', 'coxao duro', 'bife bovino'] },
  { key: 'bacon', name: 'Bacon em cubos/fatias', aisle: 'Açougue', stdUnit: 'kg', defaultPricePerKg: 36.00, keywords: ['bacon', 'toucinho defumado'] },
  { key: 'calabresa', name: 'Linguiça calabresa defumada', aisle: 'Açougue', stdUnit: 'kg', defaultPricePerKg: 28.00, keywords: ['calabresa', 'linguica calabresa', 'defumada'] },
  { key: 'ovos', name: 'Ovos brancos/vermelhos', aisle: 'Açougue', stdUnit: 'un', defaultPricePerKg: 0.85, keywords: ['ovos', 'ovo branco', 'ovo vermelho', 'cartela ovo', 'ovos dz', 'ovos cx'] },

  // Laticínios
  { key: 'queijo_mussarela', name: 'Queijo mussarela', aisle: 'Laticínios', stdUnit: 'kg', defaultPricePerKg: 46.00, keywords: ['mussarela', 'mucarela', 'queijo mucarela', 'queijo mussarela'] },
  { key: 'queijo_parmesao', name: 'Queijo parmesão ralado', aisle: 'Laticínios', stdUnit: 'kg', defaultPricePerKg: 75.00, keywords: ['parmesao', 'parmesan', 'queijo ralado'] },
  { key: 'queijo_coalho', name: 'Queijo coalho', aisle: 'Laticínios', stdUnit: 'kg', defaultPricePerKg: 48.00, keywords: ['coalho', 'queijo coalho'] },
  { key: 'manteiga', name: 'Manteiga com/sem sal', aisle: 'Laticínios', stdUnit: 'kg', defaultPricePerKg: 45.00, keywords: ['manteiga', 'manteiga primeira qualidade', 'manteiga pote', 'manteiga tablete'] },
  { key: 'creme_leite', name: 'Creme de leite', aisle: 'Laticínios', stdUnit: 'kg', defaultPricePerKg: 18.00, keywords: ['creme de leite', 'creme leite', 'creme uht'] },
  { key: 'leite_integral', name: 'Leite integral', aisle: 'Laticínios', stdUnit: 'l', defaultPricePerKg: 5.20, keywords: ['leite integral', 'leite uht', 'leite liq', 'leite piracanjuba', 'leite itambe', 'leite ninho'] },
  { key: 'requeijao', name: 'Requeijão cremoso', aisle: 'Laticínios', stdUnit: 'kg', defaultPricePerKg: 35.00, keywords: ['requeijao', 'requeijao crem'] },
  { key: 'iogurte_natural', name: 'Iogurte natural desnatado', aisle: 'Laticínios', stdUnit: 'kg', defaultPricePerKg: 15.00, keywords: ['iogurte', 'iogurte natural'] },

  // Hortifruti
  { key: 'cebola', name: 'Cebola amarela/branca', aisle: 'Hortifruti', stdUnit: 'kg', defaultPricePerKg: 5.50, keywords: ['cebola', 'cebola nac', 'cebola branca', 'cebola amarela'] },
  { key: 'alho', name: 'Alho a granel/cartela', aisle: 'Hortifruti', stdUnit: 'kg', defaultPricePerKg: 28.00, keywords: ['alho', 'alho granel', 'alho roxo', 'alho descascado'] },
  { key: 'tomate', name: 'Tomate comum/italiano/cereja', aisle: 'Hortifruti', stdUnit: 'kg', defaultPricePerKg: 8.90, keywords: ['tomate', 'tomate italia', 'tomate salada', 'tomate cereja', 'tomate debora'] },
  { key: 'cenoura', name: 'Cenoura', aisle: 'Hortifruti', stdUnit: 'kg', defaultPricePerKg: 6.20, keywords: ['cenoura', 'cenoura nac'] },
  { key: 'abobrinha', name: 'Abobrinha italiana', aisle: 'Hortifruti', stdUnit: 'kg', defaultPricePerKg: 6.90, keywords: ['abobrinha', 'abobrinha italia'] },
  { key: 'batata', name: 'Batata inglesa/monalisa', aisle: 'Hortifruti', stdUnit: 'kg', defaultPricePerKg: 6.50, keywords: ['batata', 'batata monalisa', 'batata lavada', 'batata inglesa'] },
  { key: 'batata_doce', name: 'Batata doce', aisle: 'Hortifruti', stdUnit: 'kg', defaultPricePerKg: 5.80, keywords: ['batata doce'] },
  { key: 'mandioca', name: 'Mandioca / Aipim / Macaxeira', aisle: 'Hortifruti', stdUnit: 'kg', defaultPricePerKg: 5.50, keywords: ['mandioca', 'aipim', 'macaxeira'] },
  { key: 'banana', name: 'Banana prata/nanica', aisle: 'Hortifruti', stdUnit: 'kg', defaultPricePerKg: 6.90, keywords: ['banana', 'banana prata', 'banana nanica'] },
  { key: 'maca', name: 'Maçã gala/fuji', aisle: 'Hortifruti', stdUnit: 'kg', defaultPricePerKg: 9.90, keywords: ['maca', 'maca gala', 'maca fuji'] },
  { key: 'limao', name: 'Limão taiti', aisle: 'Hortifruti', stdUnit: 'kg', defaultPricePerKg: 5.90, keywords: ['limao', 'limao taiti'] },
  { key: 'pimentao', name: 'Pimentão verde/vermelho', aisle: 'Hortifruti', stdUnit: 'kg', defaultPricePerKg: 10.50, keywords: ['pimentao', 'pimentao verde', 'pimentao verm'] },
  { key: 'cheiro_verde', name: 'Cheiro verde / Salsinha e Cebolinha', aisle: 'Hortifruti', stdUnit: 'un', defaultPricePerKg: 3.00, keywords: ['cheiro verde', 'salsa', 'salsinha', 'cebolinha', 'coentro'] },
  { key: 'couve', name: 'Couve manteiga', aisle: 'Hortifruti', stdUnit: 'un', defaultPricePerKg: 4.00, keywords: ['couve', 'couve manteiga'] },
  { key: 'brocolis', name: 'Brócolis ninja/comum', aisle: 'Hortifruti', stdUnit: 'kg', defaultPricePerKg: 14.00, keywords: ['brocolis', 'brocolis ninja'] },

  // Grãos, Farinhas e Cereais
  { key: 'arroz', name: 'Arroz agulhinha / parboilizado', aisle: 'Grãos e Cereais', stdUnit: 'kg', defaultPricePerKg: 6.20, keywords: ['arroz', 'arroz t1', 'arroz agulhinha', 'arroz tipo 1', 'arroz camil', 'arroz tio joao', 'arroz parboilizado'] },
  { key: 'arroz_integral', name: 'Arroz integral', aisle: 'Grãos e Cereais', stdUnit: 'kg', defaultPricePerKg: 7.50, keywords: ['arroz integral'] },
  { key: 'feijao_carioca', name: 'Feijão carioca', aisle: 'Grãos e Cereais', stdUnit: 'kg', defaultPricePerKg: 7.90, keywords: ['feijao carioca', 'feijao carioquinha', 'feijao camil', 'feijao kicaldo'] },
  { key: 'feijao_preto', name: 'Feijão preto', aisle: 'Grãos e Cereais', stdUnit: 'kg', defaultPricePerKg: 8.20, keywords: ['feijao preto'] },
  { key: 'macarrao', name: 'Macarrão espaguete / penne / parafuso', aisle: 'Grãos e Cereais', stdUnit: 'kg', defaultPricePerKg: 7.80, keywords: ['macarrao', 'massa espaguete', 'massa penne', 'massa parafuso', 'espaguete', 'penne', 'parafuso'] },
  { key: 'aveia', name: 'Aveia em flocos', aisle: 'Grãos e Cereais', stdUnit: 'kg', defaultPricePerKg: 12.00, keywords: ['aveia', 'aveia flocos', 'farinha aveia'] },
  { key: 'tapioca', name: 'Goma de tapioca hidratada', aisle: 'Grãos e Cereais', stdUnit: 'kg', defaultPricePerKg: 11.50, keywords: ['tapioca', 'goma tapioca', 'massa tapioca'] },
  { key: 'farinha_trigo', name: 'Farinha de trigo', aisle: 'Grãos e Cereais', stdUnit: 'kg', defaultPricePerKg: 5.50, keywords: ['farinha trigo', 'trigo t1'] },

  // Mercearia / Enlatados / Óleos
  { key: 'oleo_soja', name: 'Óleo de soja / girassol', aisle: 'Mercearia', stdUnit: 'l', defaultPricePerKg: 6.50, keywords: ['oleo soja', 'oleo soya', 'oleo liza', 'oleo girassol', 'oleo vegetal'] },
  { key: 'azeite_oliva', name: 'Azeite de oliva extravirgem', aisle: 'Mercearia', stdUnit: 'l', defaultPricePerKg: 52.00, keywords: ['azeite', 'azeite oliva', 'azeite extravirgem', 'azeite borges', 'azeite andorinha', 'azeite gallo'] },
  { key: 'molho_tomate', name: 'Molho de tomate / Extrato', aisle: 'Mercearia', stdUnit: 'kg', defaultPricePerKg: 8.50, keywords: ['molho tomate', 'extrato tomate', 'passata', 'tomate pelado', 'pomarola', 'fugini'] },
  { key: 'milho_conserva', name: 'Milho verde em conserva', aisle: 'Mercearia', stdUnit: 'kg', defaultPricePerKg: 12.00, keywords: ['milho verde', 'milho lata', 'milho conserva'] },
  { key: 'ervilha_conserva', name: 'Ervilha em conserva', aisle: 'Mercearia', stdUnit: 'kg', defaultPricePerKg: 11.00, keywords: ['ervilha', 'ervilha lata'] },
  { key: 'azeitona', name: 'Azeitona verde fatiada / sem caroço', aisle: 'Mercearia', stdUnit: 'kg', defaultPricePerKg: 32.00, keywords: ['azeitona', 'azeitona verde', 'azeitona fatiada'] },
  { key: 'cafe', name: 'Café torrado e moído', aisle: 'Mercearia', stdUnit: 'kg', defaultPricePerKg: 38.00, keywords: ['cafe', 'cafe moido', 'cafe pilao', 'cafe melitta', 'cafe 3 coracoes'] },
  { key: 'acucar', name: 'Açúcar refinado / cristal', aisle: 'Mercearia', stdUnit: 'kg', defaultPricePerKg: 4.80, keywords: ['acucar', 'acucar refinado', 'acucar cristal', 'acucar uniao'] },
  { key: 'sal', name: 'Sal refinado', aisle: 'Temperos', stdUnit: 'kg', defaultPricePerKg: 2.80, keywords: ['sal refinado', 'sal cisne', 'sal marinho'] },
  { key: 'oregano', name: 'Orégano desidratado', aisle: 'Temperos', stdUnit: 'kg', defaultPricePerKg: 80.00, keywords: ['oregano'] },
];

// Palavras-chave indicando produtos NÃO alimentícios (limpeza, higiene, pet, etc.)
export const NON_FOOD_KEYWORDS = [
  'sabao', 'detergente', 'amaciante', 'desinfetante', 'agua sanitaria', 'alvejante',
  'papel higienico', 'papel toalha', 'guardanapo', 'esponja', 'la de aco', 'bombril',
  'shampoo', 'condicionador', 'sabonete', 'creme dental', 'escova dente', 'desodorante',
  'laco', 'vassoura', 'rodo', 'saco lixo', 'inseticida', 'lampada', 'pilha', 'carvao',
  'racao', 'petiscos cao', 'areia gato', 'fralda', 'absorvente', 'copo descartavel'
];

/**
 * Remove acentos, pontuações e converte para minúsculas
 */
export function normalizeText(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Identifica se o item é alimentício ou de limpeza/higiene
 */
export function isNonFoodItem(rawName) {
  const norm = normalizeText(rawName);
  return NON_FOOD_KEYWORDS.some((kw) => norm.includes(kw));
}

/**
 * Normaliza unidades de medida da NFC-e para o padrão do NeatEat
 */
export function normalizeUnit(rawUnit, rawQty) {
  const u = (rawUnit || '').trim().toUpperCase();
  if (['KG', 'KILO', 'QUILO'].includes(u)) return 'kg';
  if (['G', 'GR', 'GRAMA', 'GRAMAS'].includes(u)) return 'g';
  if (['L', 'LT', 'LITRO', 'LITROS'].includes(u)) return 'l';
  if (['ML'].includes(u)) return 'ml';
  if (['UN', 'UND', 'UNIDADE', 'PC', 'PCA', 'CX', 'PCT', 'PT', 'DZ'].includes(u)) return 'un';
  return 'un';
}

/**
 * Encontra a melhor correspondência de ingrediente canônico no NeatEat
 */
export function matchCanonicalIngredient(rawName) {
  const norm = normalizeText(rawName);

  let bestMatch = null;
  let bestScore = 0;

  for (const item of CANONICAL_INGREDIENTS) {
    for (const kw of item.keywords) {
      const normKw = normalizeText(kw);
      if (norm.includes(normKw)) {
        const score = normKw.length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = item;
        }
      }
    }
  }

  return bestMatch;
}

/**
 * Processa um item bruto de cupom e enriquece com dados canônicos
 */
export function enrichScrapedItem(rawItem) {
  const nonFood = isNonFoodItem(rawItem.name);
  const matched = !nonFood ? matchCanonicalIngredient(rawItem.name) : null;
  const unit = normalizeUnit(rawItem.unit, rawItem.quantity);
  const quantity = Number(rawItem.quantity) || 1;
  const totalPrice = Number(rawItem.totalPrice) || 0;
  const unitPrice = Number(rawItem.unitPrice) || (quantity > 0 ? totalPrice / quantity : 0);

  // Calcula preço padrão equivalente (ex: R$ / kg ou R$ / un)
  let pricePerStdUnit = unitPrice;
  if (unit === 'g') {
    pricePerStdUnit = unitPrice * 1000;
  } else if (unit === 'ml') {
    pricePerStdUnit = unitPrice * 1000;
  }

  return {
    name: rawItem.name,
    rawName: rawItem.name,
    code: rawItem.code || '',
    quantity,
    unit,
    unitPrice: Number(unitPrice.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2)),
    isNonFood: nonFood,
    stockInFridge: !nonFood, // Sugere guardar na geladeira apenas alimentos
    matchedKey: matched?.key || null,
    matchedName: matched?.name || (nonFood ? 'Não Alimentício (Limpeza/Higiene)' : rawItem.name),
    canonicalName: matched?.name || rawItem.name,
    aisle: nonFood ? 'Limpeza e Utilidades' : (matched?.aisle || 'Mercearia'),
    stdUnit: matched?.stdUnit || unit,
    pricePerStdUnit: Number(pricePerStdUnit.toFixed(2)),
    defaultPricePerKg: matched?.defaultPricePerKg || null,
    priceVariationPct: matched?.defaultPricePerKg
      ? Math.round(((pricePerStdUnit - matched.defaultPricePerKg) / matched.defaultPricePerKg) * 100)
      : null,
  };
}
