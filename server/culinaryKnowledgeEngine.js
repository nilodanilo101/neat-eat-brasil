/**
 * culinaryKnowledgeEngine.js
 * Cérebro e Memória Gastronômica Canônica do NeatEat Brasil (v4.0.0)
 * 
 * Condensa os conhecimentos fundamentais das cinco obras primas da gastronomia:
 * 1. "Chef Profissional" (Culinary Institute of America - CIA)
 * 2. "Todas as Técnicas Culinárias" (Le Cordon Bleu)
 * 3. "Fundamentos da Cozinha Italiana Clássica" (Marcella Hazan)
 * 4. "Cozinha de Estar" (Rita Lobo)
 * 5. "Manual Prático de Confeitaria" (Senac / Diego Rodrigues Costa)
 */

import { CANONICAL_INGREDIENTS, normalizeText, matchCanonicalIngredient } from './ingredientMatcher.js';

// ============================================================================
// 1. COMPARADOR DE SINÔNIMOS GASTRONÔMICOS (CANONICAL INGREDIENT EQUIVALENCE)
// Entende que carne moída, acém moído e patinho moído são a mesma entidade culinária.
// ============================================================================

export function areCulinaryIngredientsEquivalent(nameA = '', nameB = '') {
  if (!nameA || !nameB) return false;
  const a = normalizeText(nameA);
  const b = normalizeText(nameB);
  if (a === b) return true;
  if (a.length >= 4 && b.includes(a)) return true;
  if (b.length >= 4 && a.includes(b)) return true;

  const matchA = matchCanonicalIngredient(nameA);
  const matchB = matchCanonicalIngredient(nameB);

  if (matchA && matchB && matchA.key === matchB.key) {
    return true;
  }

  // Tratamentos específicos de cortes de carne moída
  const isGroundMeatA = a.includes('moida') || a.includes('moido');
  const isGroundMeatB = b.includes('moida') || b.includes('moido');
  if (isGroundMeatA && isGroundMeatB) {
    const beefCuts = ['acem', 'patinho', 'musculo', 'paleta', 'coxao', 'carne'];
    const hasBeefCutA = beefCuts.some(c => a.includes(c));
    const hasBeefCutB = beefCuts.some(c => b.includes(c));
    if (hasBeefCutA && hasBeefCutB) return true;
  }

  // Tratamentos específicos de aves
  const isChickenA = a.includes('frango') || a.includes('sassami') || a.includes('peito');
  const isChickenB = b.includes('frango') || b.includes('sassami') || b.includes('peito');
  if (isChickenA && isChickenB && (a.includes('file') || a.includes('sassami') || a.includes('peito')) && (b.includes('file') || b.includes('sassami') || b.includes('peito'))) {
    return true;
  }

  // Tratamentos de alho e cebola
  if ((a.includes('alho') && b.includes('alho')) && !a.includes('poro') && !b.includes('poro')) return true;
  if (a.includes('cebola') && b.includes('cebola') && !a.includes('cebolinha') && !b.includes('cebolinha')) return true;

  // Batatas
  if (a.includes('batata') && b.includes('batata') && !a.includes('doce') && !b.includes('doce')) return true;

  // Tomates
  if (a.includes('tomate') && b.includes('tomate')) return true;

  return false;
}

// ============================================================================
// 2. MANUAL GASTRONÔMICO DO CHEF (BASE ENCICLOPÉDICA PARA A INTERFACE)
// ============================================================================

export const CULINARY_MANUAL = {
  version: '4.0.0',
  title: 'Manual Gastronômico do Chef',
  subtitle: 'Fundamentos Culinários do CIA, Le Cordon Bleu, Marcella Hazan, Rita Lobo e Senac',
  sections: [
    {
      id: 'fogo_calor',
      title: 'Física da Cocção & Termodinâmica',
      icon: 'Flame',
      origin: 'The Culinary Institute of America (CIA) & Le Cordon Bleu',
      summary: 'Como o calor transforma alimentos através de reações físico-químicas precisas.',
      topics: [
        {
          name: 'Reação de Maillard & Selagem Perfeita',
          rule: 'Aqueça a panela até quase soltar fumaça antes da gordura. Seque a proteína com papel toalha.',
          explanation:
            'A Reação de Maillard (caramelização de proteínas e aminoácidos com açúcares redutores) só ocorre acima de 140°C e na AUSÊNCIA de água superficial. Se a carne estiver úmida ou a panela fria, a proteína irá cozinhar no próprio vapor cinzento em vez de dourar, perdendo suculência e complexidade de sabor.',
          tip: 'Não mexa na proteína nos primeiros 2 minutos de contato com a frigideira. Deixe a crosta dourada descolar naturalmente.',
        },
        {
          name: 'Deglaçagem & O Poder do Fond',
          rule: 'Nunca lave a panela com crostinha dourada no fundo: ali reside a alma do molho.',
          explanation:
            'O "fond" (crosta caramelizada de sucos concentrados de proteína) contém os compostos aromáticos mais ricos da cocção. A deglaçagem com vinho seco, caldo caseiro ou vinagre/água dissolve esses sólidos, criando molhos acetinados sem necessidade de pós químicos.',
          tip: 'Abaixe o fogo, adicione o líquido frio ou morno e raspe firmemente o fundo com colher de pau ou espátula de silicone resistente ao calor.',
        },
        {
          name: 'Carryover Cooking & O Repouso Obrigatório da Carne',
          rule: 'Toda carne grelhada ou assada DEVE descansar de 3 a 7 minutos antes de ser fatiada.',
          explanation:
            'Durante o fogo alto, as fibras musculares se contraem violentamente e empurram todos os sucos para o núcleo térmico do corte. Se você cortar imediatamente, esse líquido vaza todo na tábua e a carne seca. Durante o repouso na tábua morna, o calor residual redistribui os sucos e relaxa as fibras musculares.',
          tip: 'Mantenha a peça sobre uma tábua morna de madeira, coberta frouxamente com folha de papel alumínio (sem fechar hermeticamente para não amolecer a crosta).',
        },
      ],
    },
    {
      id: 'bases_italianas',
      title: 'A Construção do Sabor Italiano',
      icon: 'Sparkles',
      origin: 'Fundamentos da Cozinha Italiana Clássica — Marcella Hazan',
      summary: 'O sabor não é uma cobertura adicionada no fim; ele é construído desde a base.',
      topics: [
        {
          name: 'A Tríade: Il Battuto, Soffritto e Insaporire',
          rule: 'A cebola entra primeiro; o alho entra depois. Nunca queime o alho.',
          explanation:
            'No Soffritto clássico, a cebola tem alto teor de água e açúcares, necessitando de minutos em fogo brando para ficar translúcida e adocicada. O alho possui pouca água e queima em segundos. Colocar ambos juntos queima o alho e deixa o prato com amargor rançoso.',
          tip: 'Refogue a cebola picada no azeite até murchar; só então junte o alho fatiado ou amassado e cozinhe por apenas 40 segundos até perfumar.',
        },
        {
          name: 'Mantecatura: O Segredo da Emulsão da Massa e Risoto',
          rule: 'Nunca escorra a água da massa direto na pia: reserve 1 concha da água turva do cozimento.',
          explanation:
            'A água do cozimento é rica em amido gelatinizado. Quando batida vigorosamente fora do fogo com azeite extravirgem ou manteiga gelada e queijo ralado (mantecatura), o amido une a gordura e a água em uma emulsão aveludada que abraça a massa, dispensando creme de leite.',
          tip: 'Termine de cozinhar a massa dentro da frigideira do molho por 1 minuto em fogo alto com uma concha da água do cozimento antes de desligar e fazer a mantecatura.',
        },
      ],
    },
    {
      id: 'vegetais_tecnica',
      title: 'Técnica de Vegetais & Branqueamento',
      icon: 'Salad',
      origin: 'Le Cordon Bleu — Técnicas Culinárias',
      summary: 'Preservação de clorofila, nutrientes e textura al dente impecável.',
      topics: [
        {
          name: 'Branqueamento com Choque Térmico (Shocking)',
          rule: 'Cozinhe em água fervente com bastante sal por 2 minutos e mergulhe em tigela com água e pedras de gelo.',
          explanation:
            'O sal na água fervente preserva os sais minerais e a cor verde intensa. O banho de gelo imediato estanca instantaneamente a condução térmica interna, impedindo que os vegetais (brócolis, vagens, couve, ervilhas) fiquem moles e acinzentados.',
          tip: 'Escorra bem o vegetal frio sobre papel toalha antes de saltear no azeite ou manteiga para não espirrar e não criar vapor indesejado.',
        },
        {
          name: 'Geometria dos Cortes de Chef',
          rule: 'Cortes uniformes garantem tempo de cocção idêntico para todos os pedaços na panela.',
          explanation:
            'Brunoise (cubos de 2 a 3 mm), Julienne (tiras finas de 3 mm x 5 cm), Chiffonade (tiras finas de folhas enroladas) e Macedoine (cubos de 5 mm) não são preciosismo estético: quando pedaços têm tamanhos desiguais, os menores queimam antes dos maiores amaciarem.',
          tip: 'Apoie sempre a ponta dos dedos em formato de "garra de urso" sobre o alimento para apoiar a lateral da lâmina da faca com segurança total.',
        },
      ],
    },
    {
      id: 'caldos_domesticos',
      title: 'Caldos Caseiros & Desperdício Zero',
      icon: 'Soup',
      origin: 'Cozinha de Estar — Rita Lobo',
      summary: 'Bases aromáticas vivas feitas na pressão sem aditivos químicos ou excesso de sódio.',
      topics: [
        {
          name: 'O Fim do Caldo em Cubo: Caldo Dourado na Pressão',
          rule: 'Aparas de cenoura, talos de salsinha, cascas de cebola e carcaças de frango rendem ouro líquido.',
          explanation:
            'Caldos ultraprocessados contêm até 70% de sal, glutamato monossódico e gordura hidrogenada que mascaram o paladar. Um caldo caseiro feito na panela de pressão em 30 minutos extrai colágeno e compostos aromáticos naturais solúveis em água.',
          tip: 'Guarde um saco no congelador para ir acumulando pontas de cenoura, talos de cheiro-verde e cascas de cebola higienizadas. Quando encher, cubra com água na pressão e faça 2 litros de caldo base para a semana inteira.',
        },
        {
          name: 'Mise en Place sem Estresse para a Rotina',
          rule: 'Tire tudo da geladeira e pique antes de ligar a primeira chama do fogão.',
          explanation:
            'Cozinhar sob pressão de tempo enquanto pica legumes na tábua com o alho queimando na panela é a maior causa de erros e frustração culinária. Pesar e separar os insumos em potinhos transforma a cozinha em um processo tranquilo e prazeroso.',
          tip: 'Use potes de vidro empilháveis para deixar os aromáticos prontos na bancada antes de iniciar.',
        },
      ],
    },
    {
      id: 'confeitaria_precisao',
      title: 'Precisão e Equilíbrio da Confeitaria',
      icon: 'Scale',
      origin: 'Manual Prático de Confeitaria — Senac / Diego Lozano',
      summary: 'A confeitaria como química exata: temperatura, aeração e hidratação.',
      topics: [
        {
          name: 'Pesagem por Massa vs Volume',
          rule: 'Em sobremesas, massas e pães, utilize balança digital em gramas em vez de xícaras.',
          explanation:
            'Uma xícara de farinha pode variar de 120g a 160g dependendo do quão compactada está no recipiente, desequilibrando a proporção de glúten e gordura da receita.',
          tip: 'Zere a balança (função Tara) com a tigela vazia e pese cada insumo sequencialmente para economizar louça.',
        },
      ],
    },
  ],
};

// ============================================================================
// 3. ENRIQUECEDOR INTELIGENTE DE PASSOS COM TÉCNICAS REAIS DE CHEF
// ============================================================================

export function enrichStepWithCulinaryWisdom(stepText = '', stepIndex = 0, totalSteps = 6, dishTitle = '') {
  const t = String(stepText || '').toLowerCase();
  const d = String(dishTitle || '').toLowerCase();

  // 1. CARNES, BIFES E GRELHADOS: REAÇÃO DE MAILLARD & CONTROLE DE UMIDADE
  if (t.includes('selar') || t.includes('grelhar') || t.includes('dourar o frango') || t.includes('dourar a carne') || t.includes('dourar a linguiça')) {
    return {
      tip: 'Técnica CIA/Cordon Bleu: seque a proteína com papel toalha antes de ir à panela. Não mexa nos primeiros 2 minutos para permitir a reação de Maillard e a formação do fundo dourado.',
      highlight: 'Maillard & Selagem',
    };
  }

  // 2. DESCANSO OBRIGATÓRIO DE CARNES
  if (t.includes('fatie') || t.includes('cortar em tiras') || t.includes('descansar')) {
    if (d.includes('bife') || d.includes('frango') || d.includes('carne') || d.includes('lombo') || d.includes('linguiça')) {
      return {
        tip: 'Técnica CIA (Carryover Cooking): deixe a carne descansar por 3 a 5 minutos na tábua morna antes de fatiar para que os sucos relaxem e se redistribuam pelo corte.',
        highlight: 'Repouso da Carne',
      };
    }
  }

  // 3. BASE AROMÁTICA / SOFFRITTO
  if (t.includes('cebola') && (t.includes('alho') || t.includes('refogar') || t.includes('dourar'))) {
    return {
      tip: 'Regra de Ouro Marcella Hazan: refogue a cebola primeiro até amaciar e ficar translúcida. Só então adicione o alho picado para não queimar nem amargar.',
      highlight: 'Soffritto Tradicional',
    };
  }

  // 4. DEGLAÇAGEM COM FUNDO DE SABOR
  if (t.includes('água') || t.includes('caldo') || t.includes('vinho') || t.includes('molho')) {
    if (t.includes('fundo') || t.includes('junte') || t.includes('misture raspando') || t.includes('panela')) {
      return {
        tip: 'Técnica Francesa Le Cordon Bleu: ao despejar o líquido, raspe bem o fundo da panela com a colher para dissolver a crosta dourada (fond) diretamente no molho.',
        highlight: 'Deglaçagem & Fond',
      };
    }
  }

  // 5. MASSAS, RISOTOS E EMULSÃO
  if (d.includes('macarrão') || d.includes('espaguete') || d.includes('pasta') || d.includes('risoto')) {
    if (t.includes('água') || t.includes('escorra') || t.includes('cozinhe')) {
      return {
        tip: 'Técnica Hazan: cozinhe a massa al dente em água salgada abundante e reserve meia concha da água turva do cozimento para aveludar o molho.',
        highlight: 'Cocção Al Dente',
      };
    }
    if (t.includes('finaliz') || t.includes('manteiga') || t.includes('queijo') || t.includes('mistur')) {
      return {
        tip: 'Mantecatura: mexa energicamente fora do fogo com azeite ou manteiga fria e uma colherada da água do cozimento para criar uma emulsão brilhante.',
        highlight: 'Mantecatura Aveludada',
      };
    }
  }

  // 6. VEGETAIS VERDES E LEGUMES
  if (t.includes('brócolis') || t.includes('couve') || t.includes('vagem') || t.includes('espinafre') || t.includes('ervilha')) {
    if (t.includes('ferver') || t.includes('cozinh') || t.includes('vapor')) {
      return {
        tip: 'Técnica Cordon Bleu (Shocking): cozinhe rapidamente em água fervente com sal e dê choque térmico em água gelada para fixar a clorofila verde viva e a crocância.',
        highlight: 'Choque Térmico',
      };
    }
  }

  // 7. ETAPA INICIAL (MISE EN PLACE)
  if (stepIndex === 0) {
    return {
      tip: 'Mise en Place Rita Lobo: higienize, pique e separe todos os insumos em recipientes antes de acender o fogo. A tranquilidade no preparo evita que ingredientes passem do ponto.',
      highlight: 'Mise en Place',
    };
  }

  // 8. ETAPA FINAL (EMPRATAMENTO)
  if (stepIndex === totalSteps - 1) {
    return {
      tip: 'Apresentação Cordon Bleu: emprate garantindo altura centralizada, contraste de cores e um fio de azeite fresco para realçar o brilho antes de servir.',
      highlight: 'Empratamento de Chef',
    };
  }

  return {
    tip: 'Mantenha controle atento de temperatura para cocção homogênea e preserve as texturas naturais dos insumos.',
    highlight: 'Controle de Cocção',
  };
}
