/**
 * culinaryKnowledge.js
 * Cérebro e Memória Gastronômica Canônica do NeatEat Brasil (v4.0.0)
 * 
 * Síntese prática das obras fundamentais:
 * - Chef Profissional (The Culinary Institute of America - CIA)
 * - Todas as Técnicas Culinárias (Le Cordon Bleu)
 * - Fundamentos da Cozinha Italiana Clássica (Marcella Hazan)
 * - Cozinha de Estar (Rita Lobo)
 * - Manual Prático de Confeitaria (Senac / Diego Lozano)
 */

export function normalizeIngredientName(raw = '') {
  return String(raw || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Inteligência Gastronômica de Sinônimos Culinários
 * Compreende cortes e formas que representam a mesma entidade gastronômica:
 * Ex: "carne moída", "acém moído", "patinho moído", "músculo moído" -> EQUIVALENTES
 * Ex: "filé de frango", "peito de frango", "sassami" -> EQUIVALENTES
 */
export function areCulinaryIngredientsEquivalent(nameA = '', nameB = '') {
  if (!nameA || !nameB) return false;
  const a = normalizeIngredientName(nameA);
  const b = normalizeIngredientName(nameB);
  if (a === b) return true;
  if (a.length >= 4 && b.includes(a)) return true;
  if (b.length >= 4 && a.includes(b)) return true;

  // 1. CARNE BOVINA MOÍDA
  const isGroundA = a.includes('moida') || a.includes('moido') || a.includes('picadinho');
  const isGroundB = b.includes('moida') || b.includes('moido') || b.includes('picadinho');
  if (isGroundA && isGroundB) {
    const beefWords = ['acem', 'patinho', 'musculo', 'paleta', 'coxao', 'carne', 'alcatra', 'primeira', 'segunda'];
    const hasBeefA = beefWords.some((w) => a.includes(w));
    const hasBeefB = beefWords.some((w) => b.includes(w));
    if (hasBeefA && hasBeefB) return true;
  }
  // Se um diz apenas "carne moida" e o outro cita o corte moido (ex: "acem moido")
  if ((a.includes('carne moida') || a.includes('carne bovina moida')) && (b.includes('moido') || b.includes('moida'))) return true;
  if ((b.includes('carne moida') || b.includes('carne bovina moida')) && (a.includes('moido') || a.includes('moida'))) return true;

  // 2. AVES & FRANGO
  const isChickenA = a.includes('frango') || a.includes('sassami') || a.includes('peito de frango') || a.includes('file de frango');
  const isChickenB = b.includes('frango') || b.includes('sassami') || b.includes('peito de frango') || b.includes('file de frango');
  if (isChickenA && isChickenB) {
    const cuts = ['file', 'peito', 'sassami', 'desfiado', 'cubos', 'tiras'];
    const cutA = cuts.some((c) => a.includes(c));
    const cutB = cuts.some((c) => b.includes(c));
    if (cutA && cutB) return true;
    if (a.includes('frango') && b.includes('frango') && !a.includes('coxa') && !b.includes('coxa') && !a.includes('asa') && !b.includes('asa')) return true;
  }

  // 3. AROMÁTICOS: ALHO & CEBOLA
  if (a.includes('alho') && b.includes('alho') && !a.includes('poro') && !b.includes('poro')) return true;
  if (a.includes('cebola') && b.includes('cebola') && !a.includes('cebolinha') && !b.includes('cebolinha')) return true;

  // 4. BATATAS & TUBÉRCULOS
  if (a.includes('batata') && b.includes('batata') && !a.includes('doce') && !b.includes('doce')) return true;
  if (a.includes('batata doce') && b.includes('batata doce')) return true;
  if ((a.includes('mandioca') || a.includes('aipim') || a.includes('macaxeira')) && (b.includes('mandioca') || b.includes('aipim') || b.includes('macaxeira'))) return true;

  // 5. TOMATES
  if (a.includes('tomate') && b.includes('tomate')) return true;

  // 6. ARROZ & FEIJÃO
  if (a.includes('arroz') && b.includes('arroz') && !a.includes('integral') && !b.includes('integral')) return true;
  if (a.includes('feijao carioca') && b.includes('feijao carioca')) return true;
  if (a.includes('feijao preto') && b.includes('feijao preto')) return true;

  // 7. QUEIJOS
  if ((a.includes('mussarela') || a.includes('mozarela')) && (b.includes('mussarela') || b.includes('mozarela'))) return true;
  if (a.includes('parmesao') && b.includes('parmesao')) return true;

  // 8. OVOS
  if (a.includes('ovo') && b.includes('ovo')) return true;

  // 9. AZEITE & ÓLEO
  if (a.includes('azeite') && b.includes('azeite')) return true;

  return false;
}

export const CULINARY_MANUAL = {
  version: '4.0.0',
  title: 'Manual Gastronômico do Chef',
  subtitle: 'Fundamentos Culinários do CIA, Le Cordon Bleu, Marcella Hazan, Rita Lobo e Senac',
  sections: [
    {
      id: 'fogo_calor',
      title: 'Física da Cocção & Termodinâmica',
      icon: 'Flame',
      color: 'from-amber-500/20 to-orange-600/20 text-amber-400 border-amber-500/30',
      origin: 'The Culinary Institute of America (CIA) & Le Cordon Bleu',
      summary: 'Como o calor transforma alimentos através de reações físico-químicas precisas.',
      topics: [
        {
          name: 'Reação de Maillard & Selagem Perfeita',
          rule: 'Aqueça a panela até quase soltar fumaça antes da gordura. Seque a proteína com papel toalha.',
          explanation:
            'A Reação de Maillard (caramelização de proteínas e aminoácidos com açúcares redutores) só ocorre acima de 140°C e na AUSÊNCIA de água superficial. Se a carne estiver úmida ou a panela fria, a proteína irá cozinhar no próprio vapor cinzento em vez de dourar, perdendo suculência e complexidade de sabor.',
          tip: 'Não mexa na proteína nos primeiros 2 minutos de contato com a frigideira. Deixe a crosta dourada descolar naturalmente da superfície.',
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
      color: 'from-emerald-500/20 to-teal-600/20 text-emerald-400 border-emerald-500/30',
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
      color: 'from-lime-500/20 to-green-600/20 text-lime-400 border-lime-500/30',
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
      color: 'from-amber-500/20 to-yellow-600/20 text-yellow-400 border-yellow-500/30',
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
      color: 'from-pink-500/20 to-rose-600/20 text-rose-400 border-rose-500/30',
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

export function enrichStepWithCulinaryWisdom(stepText = '', stepIndex = 0, totalSteps = 6, dishTitle = '') {
  const t = String(stepText || '').toLowerCase();
  const d = String(dishTitle || '').toLowerCase();

  // 1. CARNES, BIFES E GRELHADOS: REAÇÃO DE MAILLARD
  if (t.includes('selar') || t.includes('grelhar') || t.includes('dourar o frango') || t.includes('dourar a carne') || t.includes('dourar a linguiça')) {
    return {
      tip: 'Técnica CIA/Cordon Bleu: seque a proteína com papel toalha antes de ir à panela. Não mexa nos primeiros 2 minutos para permitir a reação de Maillard e a formação do fundo dourado.',
      highlight: 'Maillard & Selagem',
      icon: 'Flame',
    };
  }

  // 2. DESCANSO OBRIGATÓRIO DE CARNES
  if (t.includes('fatie') || t.includes('cortar em tiras') || t.includes('descansar')) {
    if (d.includes('bife') || d.includes('frango') || d.includes('carne') || d.includes('lombo') || d.includes('linguiça')) {
      return {
        tip: 'Técnica CIA (Carryover Cooking): deixe a carne descansar por 3 a 5 minutos na tábua morna antes de fatiar para que os sucos relaxem e se redistribuam pelo corte.',
        highlight: 'Repouso da Carne',
        icon: 'Clock',
      };
    }
  }

  // 3. BASE AROMÁTICA / SOFFRITTO
  if (t.includes('cebola') && (t.includes('alho') || t.includes('refogar') || t.includes('dourar'))) {
    return {
      tip: 'Regra de Ouro Marcella Hazan: refogue a cebola primeiro até amaciar e ficar translúcida. Só então adicione o alho picado para não queimar nem amargar.',
      highlight: 'Soffritto Tradicional',
      icon: 'Sparkles',
    };
  }

  // 4. DEGLAÇAGEM COM FUNDO DE SABOR
  if (t.includes('água') || t.includes('caldo') || t.includes('vinho') || t.includes('molho')) {
    if (t.includes('fundo') || t.includes('junte') || t.includes('misture raspando') || t.includes('panela')) {
      return {
        tip: 'Técnica Francesa Le Cordon Bleu: ao despejar o líquido, raspe bem o fundo da panela com a colher para dissolver a crosta dourada (fond) diretamente no molho.',
        highlight: 'Deglaçagem & Fond',
        icon: 'Sparkles',
      };
    }
  }

  // 5. MASSAS, RISOTOS E EMULSÃO
  if (d.includes('macarrão') || d.includes('espaguete') || d.includes('pasta') || d.includes('risoto')) {
    if (t.includes('água') || t.includes('escorra') || t.includes('cozinhe')) {
      return {
        tip: 'Técnica Hazan: cozinhe a massa al dente em água salgada abundante e reserve meia concha da água turva do cozimento para aveludar o molho.',
        highlight: 'Cocção Al Dente',
        icon: 'Flame',
      };
    }
    if (t.includes('finaliz') || t.includes('manteiga') || t.includes('queijo') || t.includes('mistur')) {
      return {
        tip: 'Mantecatura: mexa energicamente fora do fogo com azeite ou manteiga fria e uma colherada da água do cozimento para criar uma emulsão brilhante.',
        highlight: 'Mantecatura Aveludada',
        icon: 'Sparkles',
      };
    }
  }

  // 6. VEGETAIS VERDES E LEGUMES
  if (t.includes('brócolis') || t.includes('couve') || t.includes('vagem') || t.includes('espinafre') || t.includes('ervilha')) {
    if (t.includes('ferver') || t.includes('cozinh') || t.includes('vapor')) {
      return {
        tip: 'Técnica Cordon Bleu (Shocking): cozinhe rapidamente em água fervente com sal e dê choque térmico em água gelada para fixar a clorofila verde viva e a crocância.',
        highlight: 'Choque Térmico',
        icon: 'Sparkles',
      };
    }
  }

  // 7. ETAPA INICIAL (MISE EN PLACE)
  if (stepIndex === 0) {
    return {
      tip: 'Mise en Place Rita Lobo: higienize, pique e separe todos os insumos em recipientes antes de acender o fogo. A tranquilidade no preparo evita que ingredientes passem do ponto.',
      highlight: 'Mise en Place',
      icon: 'Sparkles',
    };
  }

  // 8. ETAPA FINAL (EMPRATAMENTO)
  if (stepIndex === totalSteps - 1) {
    return {
      tip: 'Apresentação Cordon Bleu: emprate garantindo altura centralizada, contraste de cores e um fio de azeite fresco para realçar o brilho antes de servir.',
      highlight: 'Empratamento de Chef',
      icon: 'Sparkles',
    };
  }

  return {
    tip: 'Mantenha controle atento de temperatura para cocção homogênea e preserve as texturas naturais dos insumos.',
    highlight: 'Controle de Cocção',
    icon: 'Flame',
  };
}
