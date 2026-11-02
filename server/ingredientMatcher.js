/**
 * ingredientMatcher.js
 * Inteligência Gastronômica & Calibragem de Preços Médios do NeatEat Brasil
 * Mapeia termos comerciais de cupons fiscais / NFC-e, notas e links para ingredientes canônicos,
 * com detecção de embalagens múltiplas, filtro anti-outliers e conversor culinário de porções.
 */

// Dicionário gastronômico canônico brasileiro expandido (~100 insumos essenciais)
export const CANONICAL_INGREDIENTS = [
  // ==========================================
  // 1. Açougue, Aves, Carnes, Peixes e Ovos
  // ==========================================
  {
    key: 'carne_moida',
    name: 'Carne moída (acém ou patinho)',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 36.90,
    minRealisticPrice: 18.00,
    maxRealisticPrice: 65.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 1.0,
    keywords: [
      'carne moida', 'moida', 'acem moido', 'patinho moido', 'acem', 'patinho',
      'musculo moido', 'coxao mole moido', 'paleta moida', 'carne bovina moida'
    ],
  },
  {
    key: 'frango_peito',
    name: 'Peito de frango (filés ou sassami)',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 22.90,
    minRealisticPrice: 12.00,
    maxRealisticPrice: 42.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 1.0,
    keywords: [
      'peito frango', 'peito de frango', 'file peito', 'frango file', 'sassami',
      'filezinho frango', 'filezinho de frango', 'peito s/osso', 'peito sem osso', 'file de peito'
    ],
  },
  {
    key: 'frango_coxa',
    name: 'Coxa e sobrecoxa de frango',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 15.90,
    minRealisticPrice: 8.00,
    maxRealisticPrice: 30.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 1.0,
    keywords: ['sobrecoxa', 'coxa frango', 'coxa sobrecoxa', 'coxa de frango', 'frango coxa', 'coxinha da asa'],
  },
  {
    key: 'frango_inteiro',
    name: 'Frango inteiro congelado/resfriado',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 12.90,
    minRealisticPrice: 7.00,
    maxRealisticPrice: 24.00,
    unitWeightGrams: 2000,
    defaultPackMultiplier: 2.0,
    keywords: ['frango inteiro', 'frango congelado', 'frango resfriado', 'frango a passarinho'],
  },
  {
    key: 'carne_bovina_bife',
    name: 'Carne bovina em bifes (alcatra / contrafilé / patinho)',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 44.90,
    minRealisticPrice: 25.00,
    maxRealisticPrice: 85.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 1.0,
    keywords: [
      'alcatra', 'contra file', 'contrafile', 'coxao mole', 'coxao duro', 'bife bovino',
      'maminha', 'fraldinha', 'baby beef', 'patinho bife', 'file mignon'
    ],
  },
  {
    key: 'carne_bovina_panela',
    name: 'Carne bovina em cubos para panela (músculo / acém)',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 32.90,
    minRealisticPrice: 18.00,
    maxRealisticPrice: 55.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 1.0,
    keywords: ['musculo', 'acem pedaco', 'carne de panela', 'costela bovina', 'paleta bovina'],
  },
  {
    key: 'carne_suina_lombo',
    name: 'Lombo ou bisteca suína',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 23.90,
    minRealisticPrice: 13.00,
    maxRealisticPrice: 45.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 1.0,
    keywords: ['lombo suino', 'bisteca suina', 'pernil suino', 'costelinha suina', 'file mignon suino'],
  },
  {
    key: 'bacon',
    name: 'Bacon em cubos ou fatias',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 38.90,
    minRealisticPrice: 20.00,
    maxRealisticPrice: 70.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 0.25,
    keywords: ['bacon', 'toucinho defumado', 'bacon fatiado', 'bacon pedaco', 'bacon cubos'],
  },
  {
    key: 'calabresa',
    name: 'Linguiça calabresa defumada',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 29.90,
    minRealisticPrice: 16.00,
    maxRealisticPrice: 55.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 0.4,
    keywords: ['calabresa', 'linguica calabresa', 'defumada', 'calabresa sadia', 'calabresa perdigao'],
  },
  {
    key: 'linguica_fresca',
    name: 'Linguiça toscana de pernil',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 22.90,
    minRealisticPrice: 12.00,
    maxRealisticPrice: 40.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 0.7,
    keywords: ['linguica toscana', 'toscana', 'linguica pernil', 'linguica de frango'],
  },
  {
    key: 'peixe_tilapia',
    name: 'Filé de tilápia fresco / congelado',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 39.90,
    minRealisticPrice: 22.00,
    maxRealisticPrice: 65.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 0.5,
    keywords: ['tilapia', 'file tilapia', 'file de tilapia', 'tilapia congelada', 'peixe tilapia'],
  },
  {
    key: 'peixe_salmao',
    name: 'Filé de salmão fresco',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 79.90,
    minRealisticPrice: 45.00,
    maxRealisticPrice: 130.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 0.5,
    keywords: ['salmao', 'file salmao', 'salmao fresco', 'salmao pedaco'],
  },
  {
    key: 'peixe_merluza',
    name: 'Filé de merluza ou pescada',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 29.90,
    minRealisticPrice: 16.00,
    maxRealisticPrice: 50.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 0.8,
    keywords: ['merluza', 'file merluza', 'pescada', 'cacao', 'file pescada'],
  },
  {
    key: 'camarao',
    name: 'Camarão limpo (cinza ou rosa)',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 68.00,
    minRealisticPrice: 35.00,
    maxRealisticPrice: 120.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 0.4,
    keywords: ['camarao', 'camarao limpo', 'camarao cinza', 'camarao descascado'],
  },
  {
    key: 'atum_lata',
    name: 'Atum sólido ou ralado em conserva',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 42.00,
    minRealisticPrice: 24.00,
    maxRealisticPrice: 75.00,
    unitWeightGrams: 170,
    defaultPackMultiplier: 0.17,
    keywords: ['atum ralado', 'atum solido', 'atum oleo', 'atum natural', 'atum gomes da costa', 'atum coqueiro'],
  },
  {
    key: 'sardinha_lata',
    name: 'Sardinha em lata em óleo ou molho',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 32.00,
    minRealisticPrice: 18.00,
    maxRealisticPrice: 60.00,
    unitWeightGrams: 125,
    defaultPackMultiplier: 0.125,
    keywords: ['sardinha oleo', 'sardinha molho', 'sardinha lata', 'sardinha coqueiro'],
  },
  {
    key: 'presunto',
    name: 'Presunto cozido fatiado',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 32.00,
    minRealisticPrice: 18.00,
    maxRealisticPrice: 55.00,
    unitWeightGrams: 25,
    defaultPackMultiplier: 0.2,
    keywords: ['presunto', 'presunto cozido', 'presunto fatiado', 'presunto sadia', 'apresuntado'],
  },
  {
    key: 'peito_peru',
    name: 'Peito de peru defumado fatiado',
    aisle: 'Açougue',
    stdUnit: 'kg',
    defaultPricePerKg: 56.00,
    minRealisticPrice: 32.00,
    maxRealisticPrice: 90.00,
    unitWeightGrams: 25,
    defaultPackMultiplier: 0.2,
    keywords: ['peito de peru', 'peito peru', 'blanquet'],
  },
  {
    key: 'ovos',
    name: 'Ovos brancos ou vermelhos (unidade)',
    aisle: 'Açougue',
    stdUnit: 'un',
    defaultPricePerKg: 0.85,
    minRealisticPrice: 0.45,
    maxRealisticPrice: 1.60,
    unitWeightGrams: 55,
    defaultPackMultiplier: 30,
    keywords: [
      'ovos', 'ovo branco', 'ovo vermelho', 'cartela ovo', 'ovos dz', 'ovos cx',
      'cartela de ovos', 'bandeja de ovos', 'ovo caipira', 'ovos caipiras', 'duzia de ovos'
    ],
  },

  // ==========================================
  // 2. Laticínios e Derivados
  // ==========================================
  {
    key: 'queijo_mussarela',
    name: 'Queijo mussarela fatiado ou peça',
    aisle: 'Laticínios',
    stdUnit: 'kg',
    defaultPricePerKg: 46.90,
    minRealisticPrice: 28.00,
    maxRealisticPrice: 75.00,
    unitWeightGrams: 25,
    defaultPackMultiplier: 0.2,
    keywords: ['mussarela', 'mucarela', 'queijo mucarela', 'queijo mussarela', 'mozzarella'],
  },
  {
    key: 'queijo_prato',
    name: 'Queijo prato fatiado',
    aisle: 'Laticínios',
    stdUnit: 'kg',
    defaultPricePerKg: 48.90,
    minRealisticPrice: 30.00,
    maxRealisticPrice: 80.00,
    unitWeightGrams: 25,
    defaultPackMultiplier: 0.2,
    keywords: ['queijo prato', 'prato lanche', 'prato fatiado'],
  },
  {
    key: 'queijo_parmesao',
    name: 'Queijo parmesão ralado ou cunha',
    aisle: 'Laticínios',
    stdUnit: 'kg',
    defaultPricePerKg: 79.90,
    minRealisticPrice: 45.00,
    maxRealisticPrice: 140.00,
    unitWeightGrams: 50,
    defaultPackMultiplier: 0.05,
    keywords: ['parmesao', 'parmesan', 'queijo ralado', 'parmesao ralado', 'parmigiano'],
  },
  {
    key: 'queijo_coalho',
    name: 'Queijo coalho em espeto ou bloco',
    aisle: 'Laticínios',
    stdUnit: 'kg',
    defaultPricePerKg: 45.90,
    minRealisticPrice: 26.00,
    maxRealisticPrice: 75.00,
    unitWeightGrams: 60,
    defaultPackMultiplier: 0.4,
    keywords: ['coalho', 'queijo coalho', 'espeto coalho'],
  },
  {
    key: 'queijo_minas',
    name: 'Queijo minas frescal ou padrão',
    aisle: 'Laticínios',
    stdUnit: 'kg',
    defaultPricePerKg: 42.90,
    minRealisticPrice: 24.00,
    maxRealisticPrice: 70.00,
    unitWeightGrams: 30,
    defaultPackMultiplier: 0.5,
    keywords: ['minas frescal', 'queijo minas', 'queijo branco', 'minas padrao'],
  },
  {
    key: 'queijo_ricota',
    name: 'Ricota fresca',
    aisle: 'Laticínios',
    stdUnit: 'kg',
    defaultPricePerKg: 26.90,
    minRealisticPrice: 15.00,
    maxRealisticPrice: 48.00,
    unitWeightGrams: 30,
    defaultPackMultiplier: 0.4,
    keywords: ['ricota', 'ricota fresca', 'creme de ricota'],
  },
  {
    key: 'manteiga',
    name: 'Manteiga de primeira qualidade com/sem sal',
    aisle: 'Laticínios',
    stdUnit: 'kg',
    defaultPricePerKg: 48.00,
    minRealisticPrice: 28.00,
    maxRealisticPrice: 85.00,
    unitWeightGrams: 15,
    defaultPackMultiplier: 0.2,
    keywords: ['manteiga', 'manteiga primeira qualidade', 'manteiga pote', 'manteiga tablete', 'manteiga aviacao'],
  },
  {
    key: 'margarina',
    name: 'Margarina vegetal com sal',
    aisle: 'Laticínios',
    stdUnit: 'kg',
    defaultPricePerKg: 14.00,
    minRealisticPrice: 8.00,
    maxRealisticPrice: 28.00,
    unitWeightGrams: 15,
    defaultPackMultiplier: 0.5,
    keywords: ['margarina', 'qualy', 'delicia', 'doriana', 'margarina cremosa'],
  },
  {
    key: 'creme_leite',
    name: 'Creme de leite UHT ou lata',
    aisle: 'Laticínios',
    stdUnit: 'kg',
    defaultPricePerKg: 17.50,
    minRealisticPrice: 10.00,
    maxRealisticPrice: 32.00,
    unitWeightGrams: 200,
    defaultPackMultiplier: 0.2,
    keywords: ['creme de leite', 'creme leite', 'creme uht', 'creme nestle', 'creme piracanjuba'],
  },
  {
    key: 'leite_condensado',
    name: 'Leite condensado semidesnatado ou integral',
    aisle: 'Laticínios',
    stdUnit: 'kg',
    defaultPricePerKg: 18.90,
    minRealisticPrice: 11.00,
    maxRealisticPrice: 35.00,
    unitWeightGrams: 395,
    defaultPackMultiplier: 0.395,
    keywords: ['leite condensado', 'leite moca', 'leite cond', 'condensado piracanjuba', 'condensado itambe'],
  },
  {
    key: 'leite_integral',
    name: 'Leite integral líquido UHT',
    aisle: 'Laticínios',
    stdUnit: 'l',
    defaultPricePerKg: 5.30,
    minRealisticPrice: 3.20,
    maxRealisticPrice: 9.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 1.0,
    keywords: ['leite integral', 'leite uht', 'leite liq', 'leite piracanjuba', 'leite itambe', 'leite ninho', 'leite integral uht'],
  },
  {
    key: 'leite_desnatado',
    name: 'Leite desnatado ou semidesnatado UHT',
    aisle: 'Laticínios',
    stdUnit: 'l',
    defaultPricePerKg: 5.40,
    minRealisticPrice: 3.20,
    maxRealisticPrice: 9.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 1.0,
    keywords: ['leite desnatado', 'leite semidesnatado', 'leite semi'],
  },
  {
    key: 'requeijao',
    name: 'Requeijão cremoso tradicional',
    aisle: 'Laticínios',
    stdUnit: 'kg',
    defaultPricePerKg: 34.90,
    minRealisticPrice: 18.00,
    maxRealisticPrice: 65.00,
    unitWeightGrams: 20,
    defaultPackMultiplier: 0.2,
    keywords: ['requeijao', 'requeijao crem', 'requeijao tradicional', 'requeijao pocoes', 'requeijao nestle'],
  },
  {
    key: 'iogurte_natural',
    name: 'Iogurte natural desnatado ou integral',
    aisle: 'Laticínios',
    stdUnit: 'kg',
    defaultPricePerKg: 14.90,
    minRealisticPrice: 8.00,
    maxRealisticPrice: 32.00,
    unitWeightGrams: 170,
    defaultPackMultiplier: 0.17,
    keywords: ['iogurte', 'iogurte natural', 'iogurte desnatado', 'iogurte integral'],
  },

  // ==========================================
  // 3. Hortifruti, Legumes, Verduras e Frutas
  // ==========================================
  {
    key: 'cebola',
    name: 'Cebola amarela ou branca',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 5.80,
    minRealisticPrice: 2.50,
    maxRealisticPrice: 14.00,
    unitWeightGrams: 110,
    defaultPackMultiplier: 1.0,
    keywords: ['cebola', 'cebola nac', 'cebola branca', 'cebola amarela', 'cebola pera'],
  },
  {
    key: 'cebola_roxa',
    name: 'Cebola roxa',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 8.90,
    minRealisticPrice: 4.00,
    maxRealisticPrice: 18.00,
    unitWeightGrams: 110,
    defaultPackMultiplier: 1.0,
    keywords: ['cebola roxa'],
  },
  {
    key: 'alho',
    name: 'Alho a granel ou cartela',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 29.90,
    minRealisticPrice: 15.00,
    maxRealisticPrice: 60.00,
    unitWeightGrams: 5,
    defaultPackMultiplier: 0.2,
    keywords: ['alho', 'alho granel', 'alho roxo', 'alho descascado', 'cartela alho', 'dente de alho'],
  },
  {
    key: 'tomate',
    name: 'Tomate italiano / salada / carmem',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 8.50,
    minRealisticPrice: 3.50,
    maxRealisticPrice: 18.00,
    unitWeightGrams: 120,
    defaultPackMultiplier: 1.0,
    keywords: ['tomate', 'tomate italia', 'tomate salada', 'tomate carmem', 'tomate debora', 'tomate maduro'],
  },
  {
    key: 'tomate_cereja',
    name: 'Tomate cereja ou sweet grape',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 22.00,
    minRealisticPrice: 12.00,
    maxRealisticPrice: 45.00,
    unitWeightGrams: 15,
    defaultPackMultiplier: 0.18,
    keywords: ['tomate cereja', 'sweet grape', 'tomatinho'],
  },
  {
    key: 'cenoura',
    name: 'Cenoura',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 6.20,
    minRealisticPrice: 2.80,
    maxRealisticPrice: 14.00,
    unitWeightGrams: 120,
    defaultPackMultiplier: 1.0,
    keywords: ['cenoura', 'cenoura nac'],
  },
  {
    key: 'batata',
    name: 'Batata inglesa / monalisa lavada',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 6.50,
    minRealisticPrice: 2.80,
    maxRealisticPrice: 15.00,
    unitWeightGrams: 150,
    defaultPackMultiplier: 1.0,
    keywords: ['batata', 'batata monalisa', 'batata lavada', 'batata inglesa'],
  },
  {
    key: 'batata_doce',
    name: 'Batata-doce roxa ou branca',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 5.80,
    minRealisticPrice: 2.50,
    maxRealisticPrice: 13.00,
    unitWeightGrams: 180,
    defaultPackMultiplier: 1.0,
    keywords: ['batata doce', 'batata-doce'],
  },
  {
    key: 'mandioquinha',
    name: 'Mandioquinha / Batata-baroa',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 13.90,
    minRealisticPrice: 6.00,
    maxRealisticPrice: 28.00,
    unitWeightGrams: 100,
    defaultPackMultiplier: 1.0,
    keywords: ['mandioquinha', 'batata baroa', 'batata-baroa'],
  },
  {
    key: 'mandioca',
    name: 'Mandioca / Aipim / Macaxeira',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 5.50,
    minRealisticPrice: 2.50,
    maxRealisticPrice: 14.00,
    unitWeightGrams: 250,
    defaultPackMultiplier: 1.0,
    keywords: ['mandioca', 'aipim', 'macaxeira', 'mandioca descascada'],
  },
  {
    key: 'abobrinha',
    name: 'Abobrinha italiana ou menina',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 6.90,
    minRealisticPrice: 2.80,
    maxRealisticPrice: 16.00,
    unitWeightGrams: 200,
    defaultPackMultiplier: 1.0,
    keywords: ['abobrinha', 'abobrinha italia', 'abobrinha verde'],
  },
  {
    key: 'chuchu',
    name: 'Chuchu verde',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 4.50,
    minRealisticPrice: 1.80,
    maxRealisticPrice: 10.00,
    unitWeightGrams: 200,
    defaultPackMultiplier: 1.0,
    keywords: ['chuchu', 'chuchu verde'],
  },
  {
    key: 'abobora',
    name: 'Abóbora cabotiá / japonesa / moranga',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 4.90,
    minRealisticPrice: 2.00,
    maxRealisticPrice: 12.00,
    unitWeightGrams: 500,
    defaultPackMultiplier: 1.5,
    keywords: ['abobora', 'cabotia', 'abobora japonesa', 'moranga', 'abobora cabotia'],
  },
  {
    key: 'berinjela',
    name: 'Berinjela comum',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 6.50,
    minRealisticPrice: 2.80,
    maxRealisticPrice: 15.00,
    unitWeightGrams: 250,
    defaultPackMultiplier: 1.0,
    keywords: ['berinjela', 'beringela'],
  },
  {
    key: 'pimentao',
    name: 'Pimentão verde',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 9.90,
    minRealisticPrice: 4.00,
    maxRealisticPrice: 20.00,
    unitWeightGrams: 150,
    defaultPackMultiplier: 1.0,
    keywords: ['pimentao', 'pimentao verde'],
  },
  {
    key: 'brocolis',
    name: 'Brócolis ninja ou comum',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 13.90,
    minRealisticPrice: 6.00,
    maxRealisticPrice: 28.00,
    unitWeightGrams: 300,
    defaultPackMultiplier: 0.35,
    keywords: ['brocolis', 'brocolis ninja'],
  },
  {
    key: 'couve_flor',
    name: 'Couve-flor fresca',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 12.90,
    minRealisticPrice: 5.50,
    maxRealisticPrice: 26.00,
    unitWeightGrams: 400,
    defaultPackMultiplier: 0.45,
    keywords: ['couve flor', 'couve-flor'],
  },
  {
    key: 'beterraba',
    name: 'Beterraba fresca',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 5.90,
    minRealisticPrice: 2.50,
    maxRealisticPrice: 14.00,
    unitWeightGrams: 130,
    defaultPackMultiplier: 1.0,
    keywords: ['beterraba'],
  },
  {
    key: 'espinafre',
    name: 'Espinafre fresco (maço)',
    aisle: 'Hortifruti',
    stdUnit: 'un',
    defaultPricePerKg: 4.50,
    minRealisticPrice: 2.00,
    maxRealisticPrice: 10.00,
    unitWeightGrams: 200,
    defaultPackMultiplier: 1.0,
    keywords: ['espinafre', 'espinafre maco'],
  },
  {
    key: 'couve',
    name: 'Couve-manteiga fatiada ou maço',
    aisle: 'Hortifruti',
    stdUnit: 'un',
    defaultPricePerKg: 3.50,
    minRealisticPrice: 1.50,
    maxRealisticPrice: 8.00,
    unitWeightGrams: 200,
    defaultPackMultiplier: 1.0,
    keywords: ['couve', 'couve manteiga', 'couve fatiada'],
  },
  {
    key: 'alface',
    name: 'Alface americana / crespa / lisa (pé)',
    aisle: 'Hortifruti',
    stdUnit: 'un',
    defaultPricePerKg: 3.50,
    minRealisticPrice: 1.50,
    maxRealisticPrice: 8.00,
    unitWeightGrams: 200,
    defaultPackMultiplier: 1.0,
    keywords: ['alface', 'alface americana', 'alface crespa', 'alface lisa', 'alface romana'],
  },
  {
    key: 'rucula',
    name: 'Rúcula fresca (maço)',
    aisle: 'Hortifruti',
    stdUnit: 'un',
    defaultPricePerKg: 3.80,
    minRealisticPrice: 1.80,
    maxRealisticPrice: 9.00,
    unitWeightGrams: 150,
    defaultPackMultiplier: 1.0,
    keywords: ['rucula'],
  },
  {
    key: 'cheiro_verde',
    name: 'Cheiro-verde (salsinha e cebolinha) ou coentro (maço)',
    aisle: 'Hortifruti',
    stdUnit: 'un',
    defaultPricePerKg: 2.50,
    minRealisticPrice: 1.00,
    maxRealisticPrice: 6.00,
    unitWeightGrams: 80,
    defaultPackMultiplier: 1.0,
    keywords: ['cheiro verde', 'salsa', 'salsinha', 'cebolinha', 'coentro', 'cheiro-verde'],
  },
  {
    key: 'pepino',
    name: 'Pepino japonês ou comum',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 6.20,
    minRealisticPrice: 2.50,
    maxRealisticPrice: 14.00,
    unitWeightGrams: 150,
    defaultPackMultiplier: 1.0,
    keywords: ['pepino', 'pepino japones', 'pepino comum'],
  },
  {
    key: 'banana',
    name: 'Banana nanica ou prata',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 6.90,
    minRealisticPrice: 3.00,
    maxRealisticPrice: 15.00,
    unitWeightGrams: 120,
    defaultPackMultiplier: 1.0,
    keywords: ['banana', 'banana prata', 'banana nanica', 'banana caturra'],
  },
  {
    key: 'maca',
    name: 'Maçã gala ou fuji',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 9.90,
    minRealisticPrice: 4.50,
    maxRealisticPrice: 20.00,
    unitWeightGrams: 150,
    defaultPackMultiplier: 1.0,
    keywords: ['maca', 'maca gala', 'maca fuji', 'maca nacional'],
  },
  {
    key: 'limao',
    name: 'Limão taiti ou siciliano',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 5.90,
    minRealisticPrice: 2.50,
    maxRealisticPrice: 15.00,
    unitWeightGrams: 70,
    defaultPackMultiplier: 1.0,
    keywords: ['limao', 'limao taiti', 'limao siciliano'],
  },
  {
    key: 'laranja',
    name: 'Laranja pera ou bahia',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 5.20,
    minRealisticPrice: 2.00,
    maxRealisticPrice: 12.00,
    unitWeightGrams: 160,
    defaultPackMultiplier: 1.0,
    keywords: ['laranja', 'laranja pera', 'laranja suco'],
  },
  {
    key: 'abacate',
    name: 'Abacate maduro ou avocado',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 8.90,
    minRealisticPrice: 3.80,
    maxRealisticPrice: 22.00,
    unitWeightGrams: 300,
    defaultPackMultiplier: 1.0,
    keywords: ['abacate', 'avocado'],
  },
  {
    key: 'morango',
    name: 'Morango fresco',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 24.00,
    minRealisticPrice: 12.00,
    maxRealisticPrice: 48.00,
    unitWeightGrams: 25,
    defaultPackMultiplier: 0.25,
    keywords: ['morango', 'morango bandeja', 'morangos'],
  },
  {
    key: 'mamao',
    name: 'Mamão formosa ou papaya',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 7.90,
    minRealisticPrice: 3.50,
    maxRealisticPrice: 18.00,
    unitWeightGrams: 400,
    defaultPackMultiplier: 1.0,
    keywords: ['mamao', 'mamao papaya', 'mamao formosa'],
  },
  {
    key: 'manga',
    name: 'Manga palmer ou tommy',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 7.90,
    minRealisticPrice: 3.50,
    maxRealisticPrice: 18.00,
    unitWeightGrams: 350,
    defaultPackMultiplier: 1.0,
    keywords: ['manga', 'manga palmer', 'manga tommy'],
  },
  {
    key: 'abacaxi',
    name: 'Abacaxi pérola (unidade)',
    aisle: 'Hortifruti',
    stdUnit: 'un',
    defaultPricePerKg: 6.90,
    minRealisticPrice: 3.50,
    maxRealisticPrice: 15.00,
    unitWeightGrams: 1200,
    defaultPackMultiplier: 1.0,
    keywords: ['abacaxi', 'abacaxi perola'],
  },
  {
    key: 'gengibre',
    name: 'Gengibre fresco',
    aisle: 'Hortifruti',
    stdUnit: 'kg',
    defaultPricePerKg: 18.00,
    minRealisticPrice: 8.00,
    maxRealisticPrice: 40.00,
    unitWeightGrams: 20,
    defaultPackMultiplier: 0.2,
    keywords: ['gengibre'],
  },

  // ==========================================
  // 4. Grãos, Cereais, Massas e Farinhas
  // ==========================================
  {
    key: 'arroz',
    name: 'Arroz branco agulhinha / parboilizado',
    aisle: 'Grãos e Cereais',
    stdUnit: 'kg',
    defaultPricePerKg: 6.40,
    minRealisticPrice: 3.50,
    maxRealisticPrice: 13.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 5.0,
    keywords: ['arroz', 'arroz t1', 'arroz agulhinha', 'arroz tipo 1', 'arroz camil', 'arroz tio joao', 'arroz parboilizado'],
  },
  {
    key: 'arroz_integral',
    name: 'Arroz integral tipo 1',
    aisle: 'Grãos e Cereais',
    stdUnit: 'kg',
    defaultPricePerKg: 7.80,
    minRealisticPrice: 4.50,
    maxRealisticPrice: 16.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 1.0,
    keywords: ['arroz integral'],
  },
  {
    key: 'feijao_carioca',
    name: 'Feijão carioca tipo 1',
    aisle: 'Grãos e Cereais',
    stdUnit: 'kg',
    defaultPricePerKg: 7.90,
    minRealisticPrice: 4.00,
    maxRealisticPrice: 16.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 1.0,
    keywords: ['feijao carioca', 'feijao carioquinha', 'feijao camil', 'feijao kicaldo'],
  },
  {
    key: 'feijao_preto',
    name: 'Feijão preto tipo 1',
    aisle: 'Grãos e Cereais',
    stdUnit: 'kg',
    defaultPricePerKg: 8.20,
    minRealisticPrice: 4.50,
    maxRealisticPrice: 16.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 1.0,
    keywords: ['feijao preto'],
  },
  {
    key: 'macarrao',
    name: 'Macarrão espaguete / penne / parafuso',
    aisle: 'Grãos e Cereais',
    stdUnit: 'kg',
    defaultPricePerKg: 7.80,
    minRealisticPrice: 4.00,
    maxRealisticPrice: 18.00,
    unitWeightGrams: 500,
    defaultPackMultiplier: 0.5,
    keywords: [
      'macarrao', 'massa espaguete', 'massa penne', 'massa parafuso',
      'espaguete', 'penne', 'parafuso', 'barilla', 'renata', 'dona benta', 'massa sêmola'
    ],
  },
  {
    key: 'aveia',
    name: 'Aveia em flocos finos ou grossos',
    aisle: 'Grãos e Cereais',
    stdUnit: 'kg',
    defaultPricePerKg: 12.50,
    minRealisticPrice: 6.00,
    maxRealisticPrice: 25.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 0.45,
    keywords: ['aveia', 'aveia flocos', 'farinha aveia', 'farelo aveia', 'quaker'],
  },
  {
    key: 'tapioca',
    name: 'Goma de tapioca hidratada',
    aisle: 'Grãos e Cereais',
    stdUnit: 'kg',
    defaultPricePerKg: 11.90,
    minRealisticPrice: 5.50,
    maxRealisticPrice: 24.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 0.5,
    keywords: ['tapioca', 'goma tapioca', 'massa tapioca', 'da terrinha'],
  },
  {
    key: 'flocao_milho',
    name: 'Flocão de milho para cuscuz',
    aisle: 'Grãos e Cereais',
    stdUnit: 'kg',
    defaultPricePerKg: 6.90,
    minRealisticPrice: 3.50,
    maxRealisticPrice: 14.00,
    unitWeightGrams: 500,
    defaultPackMultiplier: 0.5,
    keywords: ['flocao milho', 'flocao de milho', 'milharina', 'cuscuz', 'flocao'],
  },
  {
    key: 'farinha_trigo',
    name: 'Farinha de trigo tradicional / especial',
    aisle: 'Grãos e Cereais',
    stdUnit: 'kg',
    defaultPricePerKg: 5.40,
    minRealisticPrice: 3.00,
    maxRealisticPrice: 12.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 1.0,
    keywords: ['farinha trigo', 'trigo t1', 'farinha de trigo', 'dona benta', 'sol'],
  },
  {
    key: 'farinha_mandioca',
    name: 'Farinha de mandioca crua / torrada / farofa pronta',
    aisle: 'Grãos e Cereais',
    stdUnit: 'kg',
    defaultPricePerKg: 7.50,
    minRealisticPrice: 3.80,
    maxRealisticPrice: 16.00,
    unitWeightGrams: 500,
    defaultPackMultiplier: 0.5,
    keywords: ['farinha mandioca', 'farofa pronta', 'farinha torrada', 'yoki farofa'],
  },
  {
    key: 'amido_milho',
    name: 'Amido de milho (Maizena)',
    aisle: 'Grãos e Cereais',
    stdUnit: 'kg',
    defaultPricePerKg: 14.00,
    minRealisticPrice: 7.00,
    maxRealisticPrice: 28.00,
    unitWeightGrams: 500,
    defaultPackMultiplier: 0.5,
    keywords: ['amido de milho', 'amido milho', 'maizena'],
  },
  {
    key: 'grao_bico',
    name: 'Grão-de-bico cru ou cozido',
    aisle: 'Grãos e Cereais',
    stdUnit: 'kg',
    defaultPricePerKg: 14.90,
    minRealisticPrice: 7.50,
    maxRealisticPrice: 30.00,
    unitWeightGrams: 500,
    defaultPackMultiplier: 0.5,
    keywords: ['grao de bico', 'grao-de-bico'],
  },

  // ==========================================
  // 5. Mercearia, Óleos, Conservas e Molhos
  // ==========================================
  {
    key: 'azeite_oliva',
    name: 'Azeite de oliva extravirgem',
    aisle: 'Mercearia',
    stdUnit: 'l',
    defaultPricePerKg: 54.00,
    minRealisticPrice: 28.00,
    maxRealisticPrice: 110.00,
    unitWeightGrams: 15,
    defaultPackMultiplier: 0.5,
    keywords: ['azeite', 'azeite oliva', 'azeite extravirgem', 'azeite borges', 'azeite andorinha', 'azeite gallo'],
  },
  {
    key: 'oleo_soja',
    name: 'Óleo de soja ou girassol refinado',
    aisle: 'Mercearia',
    stdUnit: 'l',
    defaultPricePerKg: 6.80,
    minRealisticPrice: 4.00,
    maxRealisticPrice: 14.00,
    unitWeightGrams: 15,
    defaultPackMultiplier: 0.9,
    keywords: ['oleo soja', 'oleo soya', 'oleo liza', 'oleo girassol', 'oleo vegetal'],
  },
  {
    key: 'molho_tomate',
    name: 'Molho de tomate ou extrato de tomate',
    aisle: 'Mercearia',
    stdUnit: 'kg',
    defaultPricePerKg: 8.90,
    minRealisticPrice: 4.50,
    maxRealisticPrice: 20.00,
    unitWeightGrams: 300,
    defaultPackMultiplier: 0.3,
    keywords: ['molho tomate', 'extrato tomate', 'passata', 'tomate pelado', 'pomarola', 'fugini', 'elefante'],
  },
  {
    key: 'milho_conserva',
    name: 'Milho verde em conserva',
    aisle: 'Mercearia',
    stdUnit: 'kg',
    defaultPricePerKg: 12.50,
    minRealisticPrice: 6.00,
    maxRealisticPrice: 25.00,
    unitWeightGrams: 280,
    defaultPackMultiplier: 0.28,
    keywords: ['milho verde', 'milho lata', 'milho conserva', 'milho quero', 'milho bonduelle'],
  },
  {
    key: 'ervilha_conserva',
    name: 'Ervilha em conserva',
    aisle: 'Mercearia',
    stdUnit: 'kg',
    defaultPricePerKg: 11.50,
    minRealisticPrice: 5.50,
    maxRealisticPrice: 24.00,
    unitWeightGrams: 280,
    defaultPackMultiplier: 0.28,
    keywords: ['ervilha', 'ervilha lata', 'ervilha conserva'],
  },
  {
    key: 'azeitona',
    name: 'Azeitona verde fatiada ou sem caroço',
    aisle: 'Mercearia',
    stdUnit: 'kg',
    defaultPricePerKg: 32.00,
    minRealisticPrice: 16.00,
    maxRealisticPrice: 65.00,
    unitWeightGrams: 170,
    defaultPackMultiplier: 0.17,
    keywords: ['azeitona', 'azeitona verde', 'azeitona fatiada', 'azeitona sem caroco'],
  },
  {
    key: 'palmito',
    name: 'Palmito picado ou toletes',
    aisle: 'Mercearia',
    stdUnit: 'kg',
    defaultPricePerKg: 42.00,
    minRealisticPrice: 22.00,
    maxRealisticPrice: 90.00,
    unitWeightGrams: 300,
    defaultPackMultiplier: 0.3,
    keywords: ['palmito', 'palmito acai', 'palmito pupunha'],
  },
  {
    key: 'cogumelo_champignon',
    name: 'Cogumelos champignon em conserva',
    aisle: 'Mercearia',
    stdUnit: 'kg',
    defaultPricePerKg: 38.00,
    minRealisticPrice: 18.00,
    maxRealisticPrice: 75.00,
    unitWeightGrams: 180,
    defaultPackMultiplier: 0.18,
    keywords: ['champignon', 'cogumelo', 'shimeji', 'cogumelos'],
  },
  {
    key: 'shoyu',
    name: 'Molho de soja shoyu tradicional',
    aisle: 'Mercearia',
    stdUnit: 'l',
    defaultPricePerKg: 18.00,
    minRealisticPrice: 9.00,
    maxRealisticPrice: 40.00,
    unitWeightGrams: 15,
    defaultPackMultiplier: 0.15,
    keywords: ['shoyu', 'molho shoyu', 'sakura', 'kikkoman'],
  },
  {
    key: 'mostarda',
    name: 'Mostarda amarela ou dijon',
    aisle: 'Mercearia',
    stdUnit: 'kg',
    defaultPricePerKg: 16.00,
    minRealisticPrice: 8.00,
    maxRealisticPrice: 38.00,
    unitWeightGrams: 15,
    defaultPackMultiplier: 0.2,
    keywords: ['mostarda', 'mostarda amarela', 'heinz mostarda'],
  },
  {
    key: 'maionese',
    name: 'Maionese tradicional',
    aisle: 'Mercearia',
    stdUnit: 'kg',
    defaultPricePerKg: 15.00,
    minRealisticPrice: 8.00,
    maxRealisticPrice: 35.00,
    unitWeightGrams: 15,
    defaultPackMultiplier: 0.5,
    keywords: ['maionese', 'hellmanns', 'heinz maionese'],
  },
  {
    key: 'ketchup',
    name: 'Ketchup tradicional',
    aisle: 'Mercearia',
    stdUnit: 'kg',
    defaultPricePerKg: 14.00,
    minRealisticPrice: 7.00,
    maxRealisticPrice: 32.00,
    unitWeightGrams: 15,
    defaultPackMultiplier: 0.4,
    keywords: ['ketchup', 'heinz ketchup'],
  },
  {
    key: 'vinagre',
    name: 'Vinagre de maçã / vinho / álcool',
    aisle: 'Mercearia',
    stdUnit: 'l',
    defaultPricePerKg: 4.80,
    minRealisticPrice: 2.50,
    maxRealisticPrice: 12.00,
    unitWeightGrams: 15,
    defaultPackMultiplier: 0.75,
    keywords: ['vinagre', 'vinagre maca', 'vinagre vinho', 'vinagre alcool'],
  },
  {
    key: 'cafe',
    name: 'Café torrado e moído tradicional',
    aisle: 'Mercearia',
    stdUnit: 'kg',
    defaultPricePerKg: 38.00,
    minRealisticPrice: 20.00,
    maxRealisticPrice: 80.00,
    unitWeightGrams: 500,
    defaultPackMultiplier: 0.5,
    keywords: ['cafe', 'cafe moido', 'cafe pilao', 'cafe melitta', 'cafe 3 coracoes', 'cafe torrado'],
  },
  {
    key: 'acucar',
    name: 'Açúcar refinado ou cristal',
    aisle: 'Mercearia',
    stdUnit: 'kg',
    defaultPricePerKg: 4.90,
    minRealisticPrice: 2.80,
    maxRealisticPrice: 10.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 1.0,
    keywords: ['acucar', 'acucar refinado', 'acucar cristal', 'acucar uniao', 'acucar demerara'],
  },
  {
    key: 'mel',
    name: 'Mel puro de abelhas',
    aisle: 'Mercearia',
    stdUnit: 'kg',
    defaultPricePerKg: 48.00,
    minRealisticPrice: 25.00,
    maxRealisticPrice: 110.00,
    unitWeightGrams: 15,
    defaultPackMultiplier: 0.25,
    keywords: ['mel', 'mel puro', 'mel abelha'],
  },
  {
    key: 'pasta_amendoim',
    name: 'Pasta de amendoim integral',
    aisle: 'Mercearia',
    stdUnit: 'kg',
    defaultPricePerKg: 24.00,
    minRealisticPrice: 14.00,
    maxRealisticPrice: 55.00,
    unitWeightGrams: 20,
    defaultPackMultiplier: 0.5,
    keywords: ['pasta amendoim', 'pasta de amendoim', 'manteiga de amendoim'],
  },
  {
    key: 'pao_frances',
    name: 'Pão francês tradicional',
    aisle: 'Padaria',
    stdUnit: 'kg',
    defaultPricePerKg: 18.00,
    minRealisticPrice: 10.00,
    maxRealisticPrice: 32.00,
    unitWeightGrams: 50,
    defaultPackMultiplier: 0.3,
    keywords: ['pao frances', 'pao de sal', 'pao d agua', 'pao massinha'],
  },
  {
    key: 'pao_forma',
    name: 'Pão de forma tradicional ou integral',
    aisle: 'Padaria',
    stdUnit: 'kg',
    defaultPricePerKg: 16.00,
    minRealisticPrice: 9.00,
    maxRealisticPrice: 32.00,
    unitWeightGrams: 25,
    defaultPackMultiplier: 0.45,
    keywords: ['pao de forma', 'pao forma', 'pao integral', 'wickbold', 'pullman'],
  },

  // ==========================================
  // 6. Temperos, Condimentos e Ervas
  // ==========================================
  {
    key: 'sal',
    name: 'Sal refinado iodado ou marinho',
    aisle: 'Temperos',
    stdUnit: 'kg',
    defaultPricePerKg: 2.80,
    minRealisticPrice: 1.50,
    maxRealisticPrice: 8.00,
    unitWeightGrams: 1000,
    defaultPackMultiplier: 1.0,
    keywords: ['sal refinado', 'sal cisne', 'sal marinho', 'sal iodado', 'sal grosso'],
  },
  {
    key: 'oregano',
    name: 'Orégano desidratado',
    aisle: 'Temperos',
    stdUnit: 'kg',
    defaultPricePerKg: 75.00,
    minRealisticPrice: 35.00,
    maxRealisticPrice: 160.00,
    unitWeightGrams: 2,
    defaultPackMultiplier: 0.01,
    keywords: ['oregano'],
  },
  {
    key: 'canela_po',
    name: 'Canela em pó ou pau',
    aisle: 'Temperos',
    stdUnit: 'kg',
    defaultPricePerKg: 70.00,
    minRealisticPrice: 35.00,
    maxRealisticPrice: 150.00,
    unitWeightGrams: 2,
    defaultPackMultiplier: 0.02,
    keywords: ['canela em po', 'canela po', 'canela pau', 'canela'],
  },
  {
    key: 'pimenta_reino',
    name: 'Pimenta-do-reino moída ou grão',
    aisle: 'Temperos',
    stdUnit: 'kg',
    defaultPricePerKg: 65.00,
    minRealisticPrice: 30.00,
    maxRealisticPrice: 140.00,
    unitWeightGrams: 2,
    defaultPackMultiplier: 0.02,
    keywords: ['pimenta do reino', 'pimenta reino', 'pimenta-do-reino'],
  },
  {
    key: 'paprica',
    name: 'Páprica doce / defumada / picante',
    aisle: 'Temperos',
    stdUnit: 'kg',
    defaultPricePerKg: 55.00,
    minRealisticPrice: 25.00,
    maxRealisticPrice: 120.00,
    unitWeightGrams: 3,
    defaultPackMultiplier: 0.03,
    keywords: ['paprica', 'paprica doce', 'paprica defumada', 'paprica picante'],
  },
  {
    key: 'cominho',
    name: 'Cominho em pó',
    aisle: 'Temperos',
    stdUnit: 'kg',
    defaultPricePerKg: 55.00,
    minRealisticPrice: 25.00,
    maxRealisticPrice: 120.00,
    unitWeightGrams: 2,
    defaultPackMultiplier: 0.03,
    keywords: ['cominho'],
  },
  {
    key: 'curry',
    name: 'Curry em pó',
    aisle: 'Temperos',
    stdUnit: 'kg',
    defaultPricePerKg: 60.00,
    minRealisticPrice: 28.00,
    maxRealisticPrice: 130.00,
    unitWeightGrams: 3,
    defaultPackMultiplier: 0.03,
    keywords: ['curry'],
  },
  {
    key: 'curcuma',
    name: 'Cúrcuma / Açafrão-da-terra',
    aisle: 'Temperos',
    stdUnit: 'kg',
    defaultPricePerKg: 48.00,
    minRealisticPrice: 22.00,
    maxRealisticPrice: 110.00,
    unitWeightGrams: 3,
    defaultPackMultiplier: 0.05,
    keywords: ['curcuma', 'acafrao', 'acafrao da terra'],
  },
  {
    key: 'fermento_quimico',
    name: 'Fermento químico em pó para bolos',
    aisle: 'Temperos',
    stdUnit: 'kg',
    defaultPricePerKg: 36.00,
    minRealisticPrice: 18.00,
    maxRealisticPrice: 80.00,
    unitWeightGrams: 10,
    defaultPackMultiplier: 0.1,
    keywords: ['fermento quimico', 'fermento bolo', 'po royal', 'dr oetker fermento'],
  },
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
 * Normaliza strings removendo acentos e pontuação
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
 * Normaliza unidades de medida da NFC-e / Receita
 */
export function normalizeUnit(rawUnit, _rawQty) {
  const u = (rawUnit || '').trim().toUpperCase();
  if (['KG', 'KILO', 'QUILO'].includes(u)) return 'kg';
  if (['G', 'GR', 'GRAMA', 'GRAMAS'].includes(u)) return 'g';
  if (['L', 'LT', 'LITRO', 'LITROS'].includes(u)) return 'l';
  if (['ML'].includes(u)) return 'ml';
  if (['UN', 'UND', 'UNIDADE', 'UNIDADES', 'PC', 'PCA', 'CX', 'PCT', 'PT', 'DZ', 'DUZIA'].includes(u)) return 'un';
  return 'un';
}

/**
 * Extrai embalagem e tamanho do pacote do nome comercial do produto
 * Ex: "ARROZ CAMIL 5KG" -> 5 kg
 * Ex: "MACARRAO 500G" -> 0.5 kg
 * Ex: "OVOS BRANCOS 30 UN" -> 30 un
 * Ex: "AZEITE BORGES 500ML" -> 0.5 L
 * Ex: "CREME DE LEITE 200G" -> 0.2 kg
 */
export function extractPackageMultiplier(rawName, rawUnit, canonical) {
  const norm = normalizeText(rawName);

  // 1. Dúzia de ovos
  if (norm.includes('duzia') || norm.includes(' dz') || rawUnit.toLowerCase() === 'dz') {
    return { multiplier: 12, unit: 'un' };
  }

  // 2. Múltiplas unidades (ex: "30 un", "30un", "20 un", "10 un", "c/30", "cx 30")
  const unMatch = norm.match(/(?:c\/?|com\s*|\s)(\d{1,3})\s*(?:un|und|unidades|ovos)\b/);
  if (unMatch && canonical?.stdUnit === 'un') {
    const val = Number(unMatch[1]);
    if (val > 1 && val <= 60) return { multiplier: val, unit: 'un' };
  }

  // 3. Quilos (ex: "5kg", "5 kg", "2.5kg")
  const kgMatch = norm.match(/(\d+(?:[,\.]\d+)?)\s*kg\b/);
  if (kgMatch) {
    const val = parseFloat(kgMatch[1].replace(',', '.'));
    if (val > 0) return { multiplier: val, unit: 'kg' };
  }

  // 4. Gramas (ex: "500g", "400g", "200g", "395g", "170g")
  const gMatch = norm.match(/(\d+(?:[,\.]\d+)?)\s*(?:g|gr)\b/);
  if (gMatch) {
    const val = parseFloat(gMatch[1].replace(',', '.'));
    if (val > 0) return { multiplier: val / 1000, unit: 'kg' };
  }

  // 5. Litros (ex: "1l", "1 l", "2l")
  const lMatch = norm.match(/(\d+(?:[,\.]\d+)?)\s*l\b/);
  if (lMatch) {
    const val = parseFloat(lMatch[1].replace(',', '.'));
    if (val > 0) return { multiplier: val, unit: 'l' };
  }

  // 6. Mililitros (ex: "900ml", "500ml", "200ml", "150ml")
  const mlMatch = norm.match(/(\d+(?:[,\.]\d+)?)\s*ml\b/);
  if (mlMatch) {
    const val = parseFloat(mlMatch[1].replace(',', '.'));
    if (val > 0) return { multiplier: val / 1000, unit: 'l' };
  }

  // Fallback: se vendido por UN mas o canônico usa padrão embalagem
  if ((rawUnit === 'un' || rawUnit === 'pct' || rawUnit === 'cx') && canonical?.defaultPackMultiplier) {
    return { multiplier: canonical.defaultPackMultiplier, unit: canonical.stdUnit };
  }

  return { multiplier: 1.0, unit: canonical?.stdUnit || 'kg' };
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
      // Checa se a palavra-chave está contida no nome com fronteira de palavra
      const regex = new RegExp(`(^|\\s)${normKw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}(\\s|$)`, 'i');
      if (regex.test(norm) || norm.includes(normKw)) {
        // Prioriza palavras-chave mais longas e específicas
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
 * Processa um item bruto de cupom e enriquece com dados canônicos calibrados
 */
export function enrichScrapedItem(rawItem) {
  const nonFood = isNonFoodItem(rawItem.name);
  const matched = !nonFood ? matchCanonicalIngredient(rawItem.name) : null;
  const unit = normalizeUnit(rawItem.unit, rawItem.quantity);
  const quantity = Number(rawItem.quantity) || 1;
  const totalPrice = Number(rawItem.totalPrice) || 0;
  const rawUnitPrice = Number(rawItem.unitPrice) || (quantity > 0 ? totalPrice / quantity : 0);

  // Inteligência de Embalagem: Detecta tamanho de pacote para normalizar para R$ / kg, R$ / L ou R$ / un
  const packInfo = extractPackageMultiplier(rawItem.name, unit, matched);
  let pricePerStdUnit = rawUnitPrice;

  if (unit === 'g') {
    pricePerStdUnit = rawUnitPrice * 1000;
  } else if (unit === 'ml') {
    pricePerStdUnit = rawUnitPrice * 1000;
  } else if (unit === 'un' || unit === 'cx' || unit === 'pct') {
    if (packInfo.multiplier > 0 && packInfo.multiplier !== 1.0) {
      pricePerStdUnit = rawUnitPrice / packInfo.multiplier;
    }
  }

  // Filtro Anti-Outliers: Evita que erros de leitura ataulem a média histórica
  if (matched && matched.minRealisticPrice && matched.maxRealisticPrice) {
    if (pricePerStdUnit < matched.minRealisticPrice * 0.4) {
      pricePerStdUnit = matched.minRealisticPrice;
    } else if (pricePerStdUnit > matched.maxRealisticPrice * 2.5) {
      pricePerStdUnit = matched.maxRealisticPrice;
    }
  }

  return {
    name: rawItem.name,
    rawName: rawItem.name,
    code: rawItem.code || '',
    quantity,
    unit,
    unitPrice: Number(rawUnitPrice.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2)),
    isNonFood: nonFood,
    stockInFridge: !nonFood,
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

/**
 * Calculador Culinário de Custo de Insumo
 * Converte qualquer quantidade e unidade culinária de receita para o custo exato em R$,
 * usando a média móvel do banco de dados ou a referência canônica oficial.
 */
export function computeCulinaryPortionCost(ingredientName, amount, unit, marketPricesMap) {
  const normName = normalizeText(ingredientName);
  const amt = Number(amount) || 0;
  if (amt <= 0) return 0.05;

  // Busca no Map de preços de mercado
  let priceEntry = null;
  for (const [key, mp] of marketPricesMap.entries()) {
    const normKey = key.replace(/_/g, ' ');
    if (normName.includes(normKey) || normKey.includes(normName)) {
      priceEntry = mp;
      break;
    }
  }

  // Se não encontrou no banco, busca nos canônicos
  let unitPrice = priceEntry ? Number(priceEntry.avg_unit_price) : 0;
  let stdUnit = priceEntry ? priceEntry.std_unit : 'kg';
  let unitWeightGrams = 150;

  if (!priceEntry) {
    const matched = matchCanonicalIngredient(ingredientName);
    if (matched) {
      unitPrice = matched.defaultPricePerKg;
      stdUnit = matched.stdUnit;
      unitWeightGrams = matched.unitWeightGrams || 150;
    } else {
      // Default genérico culinário
      unitPrice = 12.00;
      stdUnit = 'kg';
    }
  }

  const u = (unit || '').toLowerCase().trim();

  // 1. Gramas em base Kg
  if (['g', 'gr', 'gramas', 'grama'].includes(u)) {
    return Number(((amt / 1000) * unitPrice).toFixed(2));
  }

  // 2. Quilos
  if (['kg', 'kilo', 'quilo'].includes(u)) {
    return Number((amt * unitPrice).toFixed(2));
  }

  // 3. Mililitros em base Litro
  if (['ml'].includes(u)) {
    return Number(((amt / 1000) * unitPrice).toFixed(2));
  }

  // 4. Litros
  if (['l', 'lt', 'litro', 'litros'].includes(u)) {
    return Number((amt * unitPrice).toFixed(2));
  }

  // 5. Colheres de Sopa (~15g ou 15ml)
  if (['colher', 'colheres', 'colher de sopa', 'colheres de sopa', 'cs', 'c. sopa'].includes(u)) {
    return Number(Math.max(0.08, amt * 0.015 * unitPrice).toFixed(2));
  }

  // 6. Colheres de Chá (~5g ou 5ml)
  if (['colher de cha', 'colheres de cha', 'colher de chá', 'colheres de chá', 'cc', 'c. cha'].includes(u)) {
    return Number(Math.max(0.04, amt * 0.005 * unitPrice).toFixed(2));
  }

  // 7. Colheres de Sobremesa (~10g ou 10ml)
  if (['colher de sobremesa', 'colheres de sobremesa'].includes(u)) {
    return Number(Math.max(0.06, amt * 0.010 * unitPrice).toFixed(2));
  }

  // 8. Colheres de Café (~2.5g)
  if (['colher de cafe', 'colher de café'].includes(u)) {
    return Number(Math.max(0.03, amt * 0.0025 * unitPrice).toFixed(2));
  }

  // 9. Xícaras ou Copos (~150g seco ou 240ml líquido)
  if (['xicara', 'xicara de cha', 'xícara', 'xícaras', 'copo', 'copos'].includes(u)) {
    const factor = stdUnit === 'l' ? 0.240 : 0.150;
    return Number(Math.max(0.20, amt * factor * unitPrice).toFixed(2));
  }

  // 10. Dentes de alho (~5g)
  if (['dente', 'dentes', 'dente de alho'].includes(u)) {
    return Number(Math.max(0.08, amt * 0.005 * unitPrice).toFixed(2));
  }

  // 11. Pitada ou a gosto (~1g)
  if (['pitada', 'pitadas', 'a gosto'].includes(u)) {
    return 0.05;
  }

  // 12. Fatias (~25g para frios, 35g para pão)
  if (['fatia', 'fatias'].includes(u)) {
    return Number(Math.max(0.15, amt * 0.025 * unitPrice).toFixed(2));
  }

  // 13. Unidades
  if (stdUnit === 'un') {
    return Number((amt * unitPrice).toFixed(2));
  }

  // Unidade de produto vendido por Kg (ex: 1 cebola = 110g, 1 tomate = 120g)
  const portionKg = (unitWeightGrams / 1000) * amt;
  return Number(Math.max(0.15, portionKg * unitPrice).toFixed(2));
}
