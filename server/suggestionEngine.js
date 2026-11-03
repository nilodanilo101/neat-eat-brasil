import { computeCulinaryPortionCost } from './ingredientMatcher.js';


// ============================================================================
// DEDUPLICAÇÃO INTELIGENTE DE PRATOS (CULINARY DEDUPLICATION ALGORITHM)
// Evita pratos idênticos ou extremamente semelhantes no catálogo e na pilha
// ============================================================================
export function cleanCulinaryTitle(raw = '') {
  return String(raw || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(caseiro|caseira|facil|rapido|rapida|fit|fitness|delicioso|deliciosa|perfeito|perfeita|tradicional|especial|simples|cremoso|cremosa|completo|completa|ao|com|de|da|do|dos|das|no|na|nos|nas|para|em|e|molho|leves|frescas|fresco|crocante|gratinado|gratinada)\b/gi, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function areDishesTooSimilar(titleA = '', titleB = '') {
  const normA = cleanCulinaryTitle(titleA);
  const normB = cleanCulinaryTitle(titleB);
  if (!normA || !normB) return false;
  if (normA === normB) return true;
  if (normA.includes(normB) || normB.includes(normA)) return true;

  const wordsA = normA.split(' ').filter((w) => w.length > 2);
  const wordsB = normB.split(' ').filter((w) => w.length > 2);
  if (wordsA.length === 0 || wordsB.length === 0) return false;

  const dishTypes = [
    'strogonoff', 'panqueca', 'omelete', 'tapioca', 'crepioca', 'sanduiche',
    'salada', 'arroz', 'feijao', 'frango', 'carne', 'peixe', 'tilapia',
    'salmao', 'moqueca', 'sopa', 'caldo', 'quiche', 'hamburguer', 'torta',
    'nhoque', 'cuscuz', 'picadinho', 'escondidinho', 'bobo', 'lasanha',
    'bowl', 'mingau', 'sufle'
  ];

  const typeA = wordsA.find((w) => dishTypes.includes(w));
  const typeB = wordsB.find((w) => dishTypes.includes(w));

  if (typeA && typeB && typeA === typeB) {
    const overlap = wordsA.filter((w) => wordsB.includes(w));
    if (overlap.length >= 2) return true;
  }

  const setB = new Set(wordsB);
  const intersection = wordsA.filter((w) => setB.has(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size;
  const jaccard = union > 0 ? intersection / union : 0;
  return jaccard >= 0.55;
}

export function isDishTooSimilarToExisting(title = '', existingTitles = []) {
  if (!title) return false;
  for (const existing of existingTitles) {
    if (areDishesTooSimilar(title, existing)) return true;
  }
  return false;
}


// ============================================================================
// ACERVO ROBUSTO DE RECEITAS CULINÁRIAS BRASILEIRAS (ROBUST RECIPE VAULT)
// Fichas técnicas com insumos precisos, macros reais, passos ricos e fotos
// ============================================================================
export const ROBUST_RECIPE_VAULT = [
  {
    "id": "sug-1",
    "title": "Pão de Queijo de Frigideira",
    "category": "Café da Manhã",
    "prepTime": 10,
    "servings": 1,
    "calories": 295,
    "protein": 14,
    "carbs": 28,
    "fat": 13,
    "tags": [
      "Sem Glúten",
      "Rápido",
      "Vegetariano",
      "Econômico"
    ],
    "image": "/dishes/sug-1.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "160g por porção",
    "platingInstructions": "Servir em disco dourado em prato de cerâmica aquecido com o queijo derretido no interior.",
    "specificInstructions": "Assar em fogo baixo com frigideira antiaderente tampada nos primeiros 3 minutos.",
    "ingredients": [
      {
        "name": "Polvilho doce ou goma de tapioca",
        "amount": 40,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Ovo",
        "amount": 1,
        "unit": "un",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Queijo minas meia cura ou muçarela",
        "amount": 45,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Requeijão cremoso",
        "amount": 25,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      }
    ],
    "steps": [
      "Pese e separe os 40g de polvilho doce, 1 ovo fresco, 45g de queijo minas meia cura ralado e 25g de requeijão cremoso.",
      "Em uma tigela média, quebre o ovo e bata vigorosamente com um garfo ou fouet até espumar levemente.",
      "Adicione o requeijão cremoso e uma pitada de sal fino, incorporando até obter uma emulsão homogênea e sem grumos.",
      "Acrescente o polvilho doce aos poucos, mexendo sem parar até formar uma massa lisa e aveludada, e então misture o queijo ralado.",
      "Aqueça uma frigideira antiaderente pequena (16 a 18 cm) em fogo brando com umas gotas de azeite e despeje toda a massa.",
      "Tampe a frigideira e asse por 3 a 4 minutos em fogo baixo até o fundo dourar e o centro firmar.",
      "Vire com uma espátula com cuidado, doure o outro lado por mais 2 minutos até formar crosta dourada e crocante, e sirva imediatamente."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          6
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          7,
          7
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Pão de Queijo de Frigideira.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Pese e separe os 40g de polvilho doce, 1 ovo fresco, 45g de queijo minas meia cura ralado e 25g de requeijão cremoso.",
        "image": "/dishes/steps/pao-queijo/step-1.webp",
        "alt": "Passo 1: Pese e separe os 40g de polvilho doce, 1 ovo fresc...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Em uma tigela média, quebre o ovo e bata vigorosamente com um garfo ou fouet até espumar levemente.",
        "image": "/dishes/steps/pao-queijo/step-2.webp",
        "alt": "Passo 2: Em uma tigela média, quebre o ovo e bata vigorosam...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Adicione o requeijão cremoso e uma pitada de sal fino, incorporando até obter uma emulsão homogênea e sem grumos.",
        "image": "/dishes/steps/pao-queijo/step-3.webp",
        "alt": "Passo 3: Adicione o requeijão cremoso e uma pitada de sal f...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Acrescente o polvilho doce aos poucos, mexendo sem parar até formar uma massa lisa e aveludada, e então misture o queijo ralado.",
        "image": "/dishes/steps/pao-queijo/step-4.webp",
        "alt": "Passo 4: Acrescente o polvilho doce aos poucos, mexendo sem...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Aqueça uma frigideira antiaderente pequena (16 a 18 cm) em fogo brando com umas gotas de azeite e despeje toda a massa.",
        "image": "/dishes/steps/pao-queijo/step-1.webp",
        "alt": "Passo 5: Aqueça uma frigideira antiaderente pequena (16 a 1...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Cocção & Ponto Ideal",
        "text": "Tampe a frigideira e asse por 3 a 4 minutos em fogo baixo até o fundo dourar e o centro firmar.",
        "image": "/dishes/steps/pao-queijo/step-2.webp",
        "alt": "Passo 6: Tampe a frigideira e asse por 3 a 4 minutos em fog...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 7,
        "section": "Finalização & Empratamento",
        "text": "Vire com uma espátula com cuidado, doure o outro lado por mais 2 minutos até formar crosta dourada e crocante, e sirva imediatamente.",
        "image": "/dishes/sug-1.jpg",
        "alt": "Passo 7: Vire com uma espátula com cuidado, doure o outro l...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-2",
    "title": "Panqueca de Banana e Aveia",
    "category": "Café da Manhã",
    "prepTime": 12,
    "servings": 1,
    "calories": 310,
    "protein": 15,
    "carbs": 42,
    "fat": 8,
    "tags": [
      "Econômico",
      "Rápido",
      "Vegetariano",
      "Sem Lactose"
    ],
    "image": "/dishes/sug-2.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "210g por porção",
    "platingInstructions": "Empilhar dois discos médios, finalizar com rodelas de banana e canela polvilhada.",
    "specificInstructions": "Utilizar bananas bem maduras para garantir dulçor natural sem açúcar.",
    "ingredients": [
      {
        "name": "Banana nanica",
        "amount": 120,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Ovo",
        "amount": 2,
        "unit": "un",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Aveia em flocos",
        "amount": 35,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Canela em pó",
        "amount": 3,
        "unit": "g",
        "aisle": "Temperos"
      }
    ],
    "steps": [
      "Descasque a banana nanica bem madura em um prato fundo e amasse vigorosamente com um garfo até formar um purê liso sem pedaços grandes.",
      "Em uma tigela pequena, quebre os 2 ovos e bata ligeiramente até incorporar claras e gemas.",
      "Junte o purê de banana, a aveia em flocos e a canela em pó aos ovos batidos, misturando até obter consistência uniforme de massa de panqueca.",
      "Aqueça uma frigideira antiaderente em fogo médio-baixo com umas gotas de óleo de coco ou manteiga.",
      "Despeje porções da massa formando discos médios de cerca de 10 cm e asse por 2 minutos até surgirem pequenas bolhas na superfície.",
      "Vire com espátula e doure o outro lado por mais 1 a 2 minutos até dourar uniformemente, empilhe os discos e finalize com canela polvilhada."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Panqueca de Banana e Aveia.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Descasque a banana nanica bem madura em um prato fundo e amasse vigorosamente com um garfo até formar um purê liso sem pedaços grandes.",
        "image": "/dishes/steps/panqueca-banana/step-1.webp",
        "alt": "Passo 1: Descasque a banana nanica bem madura em um prato f...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Em uma tigela pequena, quebre os 2 ovos e bata ligeiramente até incorporar claras e gemas.",
        "image": "/dishes/steps/panqueca-banana/step-2.webp",
        "alt": "Passo 2: Em uma tigela pequena, quebre os 2 ovos e bata lig...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Junte o purê de banana, a aveia em flocos e a canela em pó aos ovos batidos, misturando até obter consistência uniforme de massa de panqueca.",
        "image": "/dishes/steps/panqueca-banana/step-3.webp",
        "alt": "Passo 3: Junte o purê de banana, a aveia em flocos e a cane...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Aqueça uma frigideira antiaderente em fogo médio-baixo com umas gotas de óleo de coco ou manteiga.",
        "image": "/dishes/steps/panqueca-banana/step-4.webp",
        "alt": "Passo 4: Aqueça uma frigideira antiaderente em fogo médio-b...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Despeje porções da massa formando discos médios de cerca de 10 cm e asse por 2 minutos até surgirem pequenas bolhas na superfície.",
        "image": "/dishes/steps/panqueca-banana/step-5.webp",
        "alt": "Passo 5: Despeje porções da massa formando discos médios de...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Vire com espátula e doure o outro lado por mais 1 a 2 minutos até dourar uniformemente, empilhe os discos e finalize com canela polvilhada.",
        "image": "/dishes/sug-2.jpg",
        "alt": "Passo 6: Vire com espátula e doure o outro lado por mais 1 ...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-3",
    "title": "Tapioca com Queijo e Ovo",
    "category": "Café da Manhã",
    "prepTime": 8,
    "servings": 1,
    "calories": 275,
    "protein": 13,
    "carbs": 32,
    "fat": 10,
    "tags": [
      "Sem Glúten",
      "Rápido",
      "Vegetariano",
      "Econômico"
    ],
    "image": "/dishes/sug-3.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "180g por porção",
    "platingInstructions": "Dobrar a tapioca em meia-lua com bordas seladas e casca crocante.",
    "specificInstructions": "Peneirar a goma diretamente na frigideira bem quente sem untar.",
    "ingredients": [
      {
        "name": "Goma de tapioca hidratada",
        "amount": 70,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Ovo",
        "amount": 1,
        "unit": "un",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Queijo muçarela",
        "amount": 35,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Manteiga",
        "amount": 5,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      }
    ],
    "steps": [
      "Aqueça uma frigideira antiaderente de 20 cm em fogo médio por 1 minuto sem untar.",
      "Passe os 70g de goma de tapioca hidratada por uma peneira fina diretamente sobre a frigideira, cobrindo todo o fundo em camada uniforme.",
      "Deixe assar por cerca de 1 minuto em fogo médio até a goma unir e formar um disco flexível e firme que solta das bordas.",
      "Enquanto a massa firma, em outra frigideira pequena derreta a ponta de manteiga e prepare o ovo mexido em fogo baixo mantendo textura bem cremosa.",
      "Distribua o ovo mexido cremoso e as fatias de queijo muçarela sobre uma das metades do disco de tapioca.",
      "Dobre a outra metade por cima formando uma meia-lua, abaixe o fogo e pressione levemente as bordas por 1 minuto para o queijo derreter e a casca ficar crocante."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Tapioca com Queijo e Ovo.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Aqueça uma frigideira antiaderente de 20 cm em fogo médio por 1 minuto sem untar.",
        "image": "/dishes/steps/tapioca/step-1.webp",
        "alt": "Passo 1: Aqueça uma frigideira antiaderente de 20 cm em fog...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Passe os 70g de goma de tapioca hidratada por uma peneira fina diretamente sobre a frigideira, cobrindo todo o fundo em camada uniforme.",
        "image": "/dishes/steps/tapioca/step-2.webp",
        "alt": "Passo 2: Passe os 70g de goma de tapioca hidratada por uma ...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Deixe assar por cerca de 1 minuto em fogo médio até a goma unir e formar um disco flexível e firme que solta das bordas.",
        "image": "/dishes/steps/tapioca/step-3.webp",
        "alt": "Passo 3: Deixe assar por cerca de 1 minuto em fogo médio at...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Enquanto a massa firma, em outra frigideira pequena derreta a ponta de manteiga e prepare o ovo mexido em fogo baixo mantendo textura bem cremosa.",
        "image": "/dishes/steps/tapioca/step-4.webp",
        "alt": "Passo 4: Enquanto a massa firma, em outra frigideira pequen...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Distribua o ovo mexido cremoso e as fatias de queijo muçarela sobre uma das metades do disco de tapioca.",
        "image": "/dishes/steps/tapioca/step-5.webp",
        "alt": "Passo 5: Distribua o ovo mexido cremoso e as fatias de quei...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Dobre a outra metade por cima formando uma meia-lua, abaixe o fogo e pressione levemente as bordas por 1 minuto para o queijo derreter e a casca ficar crocante.",
        "image": "/dishes/sug-3.jpg",
        "alt": "Passo 6: Dobre a outra metade por cima formando uma meia-lu...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-4",
    "title": "Crepioca de Frango Cremosa",
    "category": "Café da Manhã",
    "prepTime": 12,
    "servings": 1,
    "calories": 340,
    "protein": 30,
    "carbs": 24,
    "fat": 12,
    "tags": [
      "Alta Proteína",
      "Tirzepatida",
      "Sem Glúten",
      "Rápido"
    ],
    "image": "/dishes/crepioca-frango.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "230g por porção",
    "platingInstructions": "Apresentar em rolinho ou meia-lua fatiada ao meio revelando o recheio de frango fumegante.",
    "specificInstructions": "Bater bem a goma com o ovo para não ficar com cheiro de ovo na casca.",
    "ingredients": [
      {
        "name": "Goma de tapioca hidratada",
        "amount": 40,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Ovo",
        "amount": 2,
        "unit": "un",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Peito de frango cozido e desfiado",
        "amount": 100,
        "unit": "g",
        "aisle": "Açougue"
      },
      {
        "name": "Requeijão cremoso light",
        "amount": 30,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      }
    ],
    "steps": [
      "Em uma tigela pequena, bata 2 ovos com 40g de goma de tapioca e uma pitada de sal com garfo até homogeneizar completamente.",
      "Em outro recipiente, misture 100g de frango desfiado temperado com 30g de requeijão light e aqueça por 30 segundos no micro-ondas para amornar o recheio.",
      "Unte levemente uma frigideira antiaderente de 22 cm com fio de azeite e leve ao fogo médio.",
      "Despeje a mistura de ovo e tapioca, girando a frigideira para espalhar uniformemente como uma massa fina de crepe.",
      "Asse por cerca de 2 minutos até a parte inferior dourar e a parte superior firmar por completo.",
      "Coloque o recheio de frango cremoso no centro, dobre em meia-lua ou enrole firmemente e sirva imediatamente bem quente."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Crepioca de Frango Cremosa.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Em uma tigela pequena, bata 2 ovos com 40g de goma de tapioca e uma pitada de sal com garfo até homogeneizar completamente.",
        "image": "/dishes/steps/crepioca/step-1.webp",
        "alt": "Passo 1: Em uma tigela pequena, bata 2 ovos com 40g de goma...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Em outro recipiente, misture 100g de frango desfiado temperado com 30g de requeijão light e aqueça por 30 segundos no micro-ondas para amornar o recheio.",
        "image": "/dishes/steps/crepioca/step-2.webp",
        "alt": "Passo 2: Em outro recipiente, misture 100g de frango desfia...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Unte levemente uma frigideira antiaderente de 22 cm com fio de azeite e leve ao fogo médio.",
        "image": "/dishes/steps/crepioca/step-3.webp",
        "alt": "Passo 3: Unte levemente uma frigideira antiaderente de 22 c...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Despeje a mistura de ovo e tapioca, girando a frigideira para espalhar uniformemente como uma massa fina de crepe.",
        "image": "/dishes/steps/crepioca/step-4.webp",
        "alt": "Passo 4: Despeje a mistura de ovo e tapioca, girando a frig...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Asse por cerca de 2 minutos até a parte inferior dourar e a parte superior firmar por completo.",
        "image": "/dishes/steps/crepioca/step-1.webp",
        "alt": "Passo 5: Asse por cerca de 2 minutos até a parte inferior d...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Coloque o recheio de frango cremoso no centro, dobre em meia-lua ou enrole firmemente e sirva imediatamente bem quente.",
        "image": "/dishes/crepioca-frango.jpg",
        "alt": "Passo 6: Coloque o recheio de frango cremoso no centro, dob...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-5",
    "title": "Cuscuz com Queijo Coalho",
    "category": "Café da Manhã",
    "prepTime": 15,
    "servings": 1,
    "calories": 330,
    "protein": 16,
    "carbs": 44,
    "fat": 10,
    "tags": [
      "Sem Glúten",
      "Vegetariano",
      "Econômico"
    ],
    "image": "/dishes/cuscuz-queijo.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "220g por porção",
    "platingInstructions": "Desenformar no prato raso com o ovo pochê sobre o cuscuz e a fatia de queijo coalho dourada ao lado.",
    "specificInstructions": "Hidratar o flocão de milho por no mínimo 10 minutos antes de cozinhar no vapor.",
    "ingredients": [
      {
        "name": "Flocão de milho",
        "amount": 60,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Água com sal para hidratar",
        "amount": 50,
        "unit": "ml",
        "aisle": "Mercearia"
      },
      {
        "name": "Queijo coalho em fatia",
        "amount": 40,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Ovo",
        "amount": 1,
        "unit": "un",
        "aisle": "Laticínios e Ovos"
      }
    ],
    "steps": [
      "Coloque os 60g de flocão de milho em uma tigela, adicione uma pitada de sal e regue com 50ml de água, misturando com os dedos até virar areia úmida.",
      "Deixe o flocão descansar por 10 minutos para absorver o líquido e hidratar os grânulos.",
      "Acomode o flocão hidratado na cuscuzeira individual sem apertar para o vapor circular livremente, tampe e cozinhe por 8 minutos.",
      "Enquanto o cuscuz cozinha, aqueça uma frigideira antiaderente e doure a fatia de queijo coalho por 2 minutos de cada lado até tostar.",
      "Na mesma frigideira ou em água fervente com vinagre, prepare o ovo até a clara firmar e a gema continuar cremosa.",
      "Desenforme o cuscuz fofo no prato, acomode o queijo coalho dourado e posicione o ovo sobre o cuscuz finalizando com cheiro-verde."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Cuscuz com Queijo Coalho.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Coloque os 60g de flocão de milho em uma tigela, adicione uma pitada de sal e regue com 50ml de água, misturando com os dedos até virar areia úmida.",
        "image": "/dishes/steps/cuscuz/step-1.webp",
        "alt": "Passo 1: Coloque os 60g de flocão de milho em uma tigela, a...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Deixe o flocão descansar por 10 minutos para absorver o líquido e hidratar os grânulos.",
        "image": "/dishes/steps/cuscuz/step-2.webp",
        "alt": "Passo 2: Deixe o flocão descansar por 10 minutos para absor...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Acomode o flocão hidratado na cuscuzeira individual sem apertar para o vapor circular livremente, tampe e cozinhe por 8 minutos.",
        "image": "/dishes/steps/cuscuz/step-3.webp",
        "alt": "Passo 3: Acomode o flocão hidratado na cuscuzeira individua...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Enquanto o cuscuz cozinha, aqueça uma frigideira antiaderente e doure a fatia de queijo coalho por 2 minutos de cada lado até tostar.",
        "image": "/dishes/steps/cuscuz/step-4.webp",
        "alt": "Passo 4: Enquanto o cuscuz cozinha, aqueça uma frigideira a...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Na mesma frigideira ou em água fervente com vinagre, prepare o ovo até a clara firmar e a gema continuar cremosa.",
        "image": "/dishes/steps/cuscuz/step-5.webp",
        "alt": "Passo 5: Na mesma frigideira ou em água fervente com vinagr...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Desenforme o cuscuz fofo no prato, acomode o queijo coalho dourado e posicione o ovo sobre o cuscuz finalizando com cheiro-verde.",
        "image": "/dishes/cuscuz-queijo.jpg",
        "alt": "Passo 6: Desenforme o cuscuz fofo no prato, acomode o queij...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-6",
    "title": "Sanduíche de Frango Cremoso",
    "category": "Café da Manhã",
    "prepTime": 10,
    "servings": 2,
    "calories": 320,
    "protein": 26,
    "carbs": 32,
    "fat": 9,
    "tags": [
      "Alta Proteína",
      "Tirzepatida",
      "Rápido",
      "Econômico"
    ],
    "image": "/dishes/sanduiche-frango.jpg",
    "source": "Ficha Técnica NeatEat Brasil — Padrão Gastronômico",
    "portionWeight": "220g por porção",
    "platingInstructions": "Cortar em diagonal para exibir as camadas coloridas de frango desfiado cremoso e cenoura fresca.",
    "specificInstructions": "Misturar o requeijão no frango ainda morno para emulsionar perfeitamente.",
    "ingredients": [
      {
        "name": "Pão integral fatiado",
        "amount": 100,
        "unit": "g",
        "aisle": "Padaria"
      },
      {
        "name": "Peito de frango cozido e desfiado",
        "amount": 180,
        "unit": "g",
        "aisle": "Açougue"
      },
      {
        "name": "Cenoura ralada fina",
        "amount": 60,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Requeijão cremoso light",
        "amount": 50,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Folhas de alface fresca",
        "amount": 30,
        "unit": "g",
        "aisle": "Hortifruti"
      }
    ],
    "steps": [
      "Em uma tigela média, junte 180g de peito de frango cozido e desfiado finamente com 50g de requeijão cremoso light.",
      "Adicione a cenoura ralada bem fina e tempere com cheiro-verde picado, gotas de limão e pimenta-do-reino.",
      "Misture vigorosamente com uma colher até obter um patê cremoso e homogêneo com textura consistente.",
      "Disponha as fatias de pão integral na bancada e distribua folhas limpas e secas de alface sobre a base.",
      "Espalhe uma camada farta do recheio cremoso de frango, feche com a outra fatia de pão e pressione suavemente.",
      "Corte o sanduíche em diagonal com faca de serra e sirva imediatamente ou embale em papel-manteiga para levar."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Sanduíche de Frango Cremoso.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Em uma tigela média, junte 180g de peito de frango cozido e desfiado finamente com 50g de requeijão cremoso light.",
        "image": "/dishes/steps/sanduiche-frango/step-1.webp",
        "alt": "Passo 1: Em uma tigela média, junte 180g de peito de frango...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Adicione a cenoura ralada bem fina e tempere com cheiro-verde picado, gotas de limão e pimenta-do-reino.",
        "image": "/dishes/steps/sanduiche-frango/step-2.webp",
        "alt": "Passo 2: Adicione a cenoura ralada bem fina e tempere com c...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Misture vigorosamente com uma colher até obter um patê cremoso e homogêneo com textura consistente.",
        "image": "/dishes/steps/sanduiche-frango/step-3.webp",
        "alt": "Passo 3: Misture vigorosamente com uma colher até obter um ...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Disponha as fatias de pão integral na bancada e distribua folhas limpas e secas de alface sobre a base.",
        "image": "/dishes/steps/sanduiche-frango/step-4.webp",
        "alt": "Passo 4: Disponha as fatias de pão integral na bancada e di...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Espalhe uma camada farta do recheio cremoso de frango, feche com a outra fatia de pão e pressione suavemente.",
        "image": "/dishes/steps/sanduiche-frango/step-1.webp",
        "alt": "Passo 5: Espalhe uma camada farta do recheio cremoso de fra...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Corte o sanduíche em diagonal com faca de serra e sirva imediatamente ou embale em papel-manteiga para levar.",
        "image": "/dishes/sanduiche-frango.jpg",
        "alt": "Passo 6: Corte o sanduíche em diagonal com faca de serra e ...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-7",
    "title": "Mingau de Aveia com Frutas",
    "category": "Café da Manhã",
    "prepTime": 8,
    "servings": 1,
    "calories": 280,
    "protein": 12,
    "carbs": 46,
    "fat": 6,
    "tags": [
      "Vegetariano",
      "Rápido",
      "Econômico"
    ],
    "image": "/dishes/sug-20.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "250g por porção",
    "platingInstructions": "Servir em tigela funda com rodelas de banana e morango em leque por cima e canela polvilhada.",
    "specificInstructions": "Cozinhar em fogo baixo mexendo sem parar com espátula raspando o fundo para não grudar.",
    "ingredients": [
      {
        "name": "Aveia em flocos finos",
        "amount": 40,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Leite desnatado ou vegetal",
        "amount": 200,
        "unit": "ml",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Banana fatiada",
        "amount": 80,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Canela em pó",
        "amount": 2,
        "unit": "g",
        "aisle": "Temperos"
      }
    ],
    "steps": [
      "Pese os 40g de aveia em flocos e meça os 200ml de leite em um copo graduado.",
      "Em uma panela pequena, misture a aveia e o leite com uma pitada sutil de sal para realçar o dulçor.",
      "Leve ao fogo médio até começar a ferver suavemente, mexendo sem parar com espátula ou colher de pau.",
      "Abaixe o fogo para o mínimo e cozinhe por 3 a 4 minutos até a aveia absorver o líquido e o mingau ficar espesso e aveludado.",
      "Desligue o fogo e transfira o mingau quente imediatamente para um bowl de cerâmica.",
      "Decore o topo com as rodelas de banana fresca, polvilhe a canela em pó por cima e sirva morno."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Mingau de Aveia com Frutas.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Pese os 40g de aveia em flocos e meça os 200ml de leite em um copo graduado.",
        "image": "/dishes/steps/mingau-aveia/step-1.webp",
        "alt": "Passo 1: Pese os 40g de aveia em flocos e meça os 200ml de ...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Em uma panela pequena, misture a aveia e o leite com uma pitada sutil de sal para realçar o dulçor.",
        "image": "/dishes/steps/mingau-aveia/step-2.webp",
        "alt": "Passo 2: Em uma panela pequena, misture a aveia e o leite c...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Leve ao fogo médio até começar a ferver suavemente, mexendo sem parar com espátula ou colher de pau.",
        "image": "/dishes/steps/mingau-aveia/step-3.webp",
        "alt": "Passo 3: Leve ao fogo médio até começar a ferver suavemente...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Abaixe o fogo para o mínimo e cozinhe por 3 a 4 minutos até a aveia absorver o líquido e o mingau ficar espesso e aveludado.",
        "image": "/dishes/steps/mingau-aveia/step-4.webp",
        "alt": "Passo 4: Abaixe o fogo para o mínimo e cozinhe por 3 a 4 mi...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Desligue o fogo e transfira o mingau quente imediatamente para um bowl de cerâmica.",
        "image": "/dishes/steps/mingau-aveia/step-5.webp",
        "alt": "Passo 5: Desligue o fogo e transfira o mingau quente imedia...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Decore o topo com as rodelas de banana fresca, polvilhe a canela em pó por cima e sirva morno.",
        "image": "/dishes/sug-20.jpg",
        "alt": "Passo 6: Decore o topo com as rodelas de banana fresca, pol...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-8",
    "title": "Omelete de Claras com Queijo",
    "category": "Café da Manhã",
    "prepTime": 10,
    "servings": 1,
    "calories": 230,
    "protein": 28,
    "carbs": 6,
    "fat": 10,
    "tags": [
      "Alta Proteína",
      "Tirzepatida",
      "Low Carb",
      "Sem Glúten",
      "Rápido",
      "Vegetariano"
    ],
    "image": "/dishes/omelete-com-queijo.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "200g por porção",
    "platingInstructions": "Dobrar em meia-lua dourada brilhante com folhas de manjericão fresco decorando o prato.",
    "specificInstructions": "Usar fogo baixo para cozinhar as claras sem ressecar ou dourar excessivamente.",
    "ingredients": [
      {
        "name": "Claras de ovo",
        "amount": 4,
        "unit": "un",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Ovo inteiro",
        "amount": 1,
        "unit": "un",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Queijo minas frescal em cubinhos",
        "amount": 40,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Tomate seco ou cereja",
        "amount": 30,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Orégano fresco",
        "amount": 2,
        "unit": "g",
        "aisle": "Temperos"
      }
    ],
    "steps": [
      "Separe 4 claras e 1 ovo inteiro em uma tigela funda e pique os tomates e o queijo minas.",
      "Bata os ovos energicamente com um fouet ou garfo por 1 minuto até incorporar bastante ar e espumar levemente.",
      "Tempere a mistura com sal fino, pimenta-do-reino moída na hora e orégano.",
      "Aqueça uma frigideira antiaderente de 20 cm em fogo baixo com um fio de azeite e despeje os ovos batidos.",
      "Cozinhe em fogo brando por cerca de 3 minutos, puxando suavemente as bordas com espátula para o centro.",
      "Quando o centro estiver quase firme, distribua o queijo e o tomate sobre uma metade, dobre em meia-lua e sirva imediatamente."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Omelete de Claras com Queijo.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Separe 4 claras e 1 ovo inteiro em uma tigela funda e pique os tomates e o queijo minas.",
        "image": "/dishes/steps/omelete/step-1.webp",
        "alt": "Passo 1: Separe 4 claras e 1 ovo inteiro em uma tigela fund...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Bata os ovos energicamente com um fouet ou garfo por 1 minuto até incorporar bastante ar e espumar levemente.",
        "image": "/dishes/steps/omelete/step-2.webp",
        "alt": "Passo 2: Bata os ovos energicamente com um fouet ou garfo p...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Tempere a mistura com sal fino, pimenta-do-reino moída na hora e orégano.",
        "image": "/dishes/steps/omelete/step-3.webp",
        "alt": "Passo 3: Tempere a mistura com sal fino, pimenta-do-reino m...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Aqueça uma frigideira antiaderente de 20 cm em fogo baixo com um fio de azeite e despeje os ovos batidos.",
        "image": "/dishes/steps/omelete/step-4.webp",
        "alt": "Passo 4: Aqueça uma frigideira antiaderente de 20 cm em fog...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Cozinhe em fogo brando por cerca de 3 minutos, puxando suavemente as bordas com espátula para o centro.",
        "image": "/dishes/steps/omelete/step-5.webp",
        "alt": "Passo 5: Cozinhe em fogo brando por cerca de 3 minutos, pux...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Quando o centro estiver quase firme, distribua o queijo e o tomate sobre uma metade, dobre em meia-lua e sirva imediatamente.",
        "image": "/dishes/omelete-com-queijo.jpg",
        "alt": "Passo 6: Quando o centro estiver quase firme, distribua o q...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-9",
    "title": "Frango Xadrez",
    "category": "Almoço",
    "prepTime": 22,
    "servings": 2,
    "calories": 390,
    "protein": 38,
    "carbs": 26,
    "fat": 13,
    "tags": [
      "Alta Proteína",
      "Tirzepatida",
      "Rápido",
      "Sem Lactose"
    ],
    "image": "/dishes/frango-xadrez.jpg",
    "source": "Ficha Técnica NeatEat Brasil — Padrão Gastronômico",
    "portionWeight": "320g por porção",
    "platingInstructions": "Servir o frango xadrez brilhante em prato raso aquecido, salpicado com amendoim torrado crocante e cebolinha verde fresca, com arroz soltinho ao lado.",
    "specificInstructions": "Saltear os pimentões e a cebola em fogo alto por apenas 2 a 3 minutos para manter crocância e cores vivas. Dissolver o amido em água fria para não empelotar.",
    "ingredients": [
      {
        "name": "Peito de frango em cubos",
        "amount": 350,
        "unit": "g",
        "aisle": "Açougue"
      },
      {
        "name": "Pimentão vermelho e amarelo",
        "amount": 120,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Cebola em pétalas",
        "amount": 90,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Alho picado",
        "amount": 15,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Molho shoyu tradicional",
        "amount": 45,
        "unit": "ml",
        "aisle": "Mercearia"
      },
      {
        "name": "Amido de milho",
        "amount": 15,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Amendoim torrado sem pele",
        "amount": 35,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Óleo de gergelim ou azeite",
        "amount": 15,
        "unit": "ml",
        "aisle": "Mercearia"
      },
      {
        "name": "Cebolinha fresca picada",
        "amount": 15,
        "unit": "g",
        "aisle": "Hortifruti"
      }
    ],
    "steps": [
      "Faça o mise en place cortando 350g de peito de frango em cubos regulares de 2,5 cm. Pique os pimentões e a cebola em quadrados médios (pétalas) e pique o alho fino.",
      "Em uma tigela funda, tempere os cubos de frango com 2 colheres de shoyu, alho picado e pimenta-do-reino moída. Deixe marinar por 10 minutos para absorver o tempero.",
      "Aqueça uma wok ou frigideira grande com um fio de óleo em fogo alto até fumegar levemente. Despeje o frango em camada única e sele por 4 a 5 minutos até dourar por fora sem ressecar.",
      "Adicione a cebola em pétalas e os pimentões coloridos na panela quente. Salteie vigorosamente em fogo alto por 2 a 3 minutos mantendo os vegetais firmes e crocantes ao dente.",
      "Em um copo separado, dissolva o amido de milho em 60 ml de água fria com o restante do shoyu. Despeje na frigideira fervente e mexa por 1 minuto até o molho encorpar e formar uma película brilhante e aveludada.",
      "Desligue o fogo, misture o amendoim torrado crocante e a cebolinha picada, e sirva imediatamente bem quente acompanhado de arroz branco."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Frango Xadrez.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Faça o mise en place cortando 350g de peito de frango em cubos regulares de 2,5 cm. Pique os pimentões e a cebola em quadrados médios (pétalas) e pique o alho fino.",
        "image": "/dishes/steps/frango-xadrez/step-1.webp",
        "alt": "Passo 1: Faça o mise en place cortando 350g de peito de fra...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Em uma tigela funda, tempere os cubos de frango com 2 colheres de shoyu, alho picado e pimenta-do-reino moída. Deixe marinar por 10 minutos para absorver o tempero.",
        "image": "/dishes/steps/frango-xadrez/step-2.webp",
        "alt": "Passo 2: Em uma tigela funda, tempere os cubos de frango co...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Aqueça uma wok ou frigideira grande com um fio de óleo em fogo alto até fumegar levemente. Despeje o frango em camada única e sele por 4 a 5 minutos até dourar por fora sem ressecar.",
        "image": "/dishes/steps/frango-xadrez/step-3.webp",
        "alt": "Passo 3: Aqueça uma wok ou frigideira grande com um fio de ...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Adicione a cebola em pétalas e os pimentões coloridos na panela quente. Salteie vigorosamente em fogo alto por 2 a 3 minutos mantendo os vegetais firmes e crocantes ao dente.",
        "image": "/dishes/steps/frango-xadrez/step-4.webp",
        "alt": "Passo 4: Adicione a cebola em pétalas e os pimentões colori...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Em um copo separado, dissolva o amido de milho em 60 ml de água fria com o restante do shoyu. Despeje na frigideira fervente e mexa por 1 minuto até o molho encorpar e formar uma película brilhante e aveludada.",
        "image": "/dishes/steps/frango-xadrez/step-5.webp",
        "alt": "Passo 5: Em um copo separado, dissolva o amido de milho em ...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Desligue o fogo, misture o amendoim torrado crocante e a cebolinha picada, e sirva imediatamente bem quente acompanhado de arroz branco.",
        "image": "/dishes/frango-xadrez.jpg",
        "alt": "Passo 6: Desligue o fogo, misture o amendoim torrado crocan...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-10",
    "title": "Carne de Panela com Mandioca",
    "category": "Almoço",
    "prepTime": 45,
    "servings": 3,
    "calories": 460,
    "protein": 36,
    "carbs": 42,
    "fat": 15,
    "tags": [
      "Alta Proteína",
      "Tirzepatida",
      "Sem Glúten",
      "Sem Lactose"
    ],
    "image": "/dishes/carne-panela-mandioca.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "380g por porção",
    "platingInstructions": "Dispor a carne de panela fumegante ao lado dos pedaços de mandioca macia brilhando no molho com cheiro-verde picado.",
    "specificInstructions": "Selar bem os cubos de carne em fogo alto antes de tampar a panela de pressão.",
    "ingredients": [
      {
        "name": "Músculo ou acém bovino em cubos",
        "amount": 450,
        "unit": "g",
        "aisle": "Açougue"
      },
      {
        "name": "Mandioca descascada em toletes",
        "amount": 300,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Cebola picada",
        "amount": 100,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Alho amassado",
        "amount": 15,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Tomate maduro picado",
        "amount": 120,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Cheiro-verde picado",
        "amount": 20,
        "unit": "g",
        "aisle": "Hortifruti"
      }
    ],
    "steps": [
      "Corte o acém em cubos grandes de 4 cm e tempere com sal, alho amassado e pimenta-do-reino moída.",
      "Aqueça a panela de pressão com um fio de azeite em fogo alto e sele os cubos de carne por 6 a 8 minutos até dourarem intensamente por todos os lados.",
      "Adicione a cebola picada e o tomate maduro, refogando no fundo da panela por 3 minutos até soltar todos os caramelos da carne.",
      "Cubra a carne com água quente até a metade dos cubos, tampe a panela de pressão e cozinhe por 30 minutos após pegar pressão.",
      "Despressurize com segurança, abra a panela, adicione os toletes de mandioca e acerte o sal do caldo.",
      "Tampe novamente e cozinhe por mais 12 minutos na pressão até a mandioca amaciar e o caldo engrossar aveludado.",
      "Finalize com bastante cheiro-verde fresco picado e sirva com arroz branco soltinho."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          6
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          7,
          7
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Carne de Panela com Mandioca.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Corte o acém em cubos grandes de 4 cm e tempere com sal, alho amassado e pimenta-do-reino moída.",
        "image": "/dishes/steps/carne-panela/step-1.webp",
        "alt": "Passo 1: Corte o acém em cubos grandes de 4 cm e tempere co...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Aqueça a panela de pressão com um fio de azeite em fogo alto e sele os cubos de carne por 6 a 8 minutos até dourarem intensamente por todos os lados.",
        "image": "/dishes/steps/carne-panela/step-2.webp",
        "alt": "Passo 2: Aqueça a panela de pressão com um fio de azeite em...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Adicione a cebola picada e o tomate maduro, refogando no fundo da panela por 3 minutos até soltar todos os caramelos da carne.",
        "image": "/dishes/steps/carne-panela/step-3.webp",
        "alt": "Passo 3: Adicione a cebola picada e o tomate maduro, refoga...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Cubra a carne com água quente até a metade dos cubos, tampe a panela de pressão e cozinhe por 30 minutos após pegar pressão.",
        "image": "/dishes/steps/carne-panela/step-4.webp",
        "alt": "Passo 4: Cubra a carne com água quente até a metade dos cub...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Despressurize com segurança, abra a panela, adicione os toletes de mandioca e acerte o sal do caldo.",
        "image": "/dishes/steps/carne-panela/step-5.webp",
        "alt": "Passo 5: Despressurize com segurança, abra a panela, adicio...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Cocção & Ponto Ideal",
        "text": "Tampe novamente e cozinhe por mais 12 minutos na pressão até a mandioca amaciar e o caldo engrossar aveludado.",
        "image": "/dishes/steps/carne-panela/step-6.webp",
        "alt": "Passo 6: Tampe novamente e cozinhe por mais 12 minutos na p...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 7,
        "section": "Finalização & Empratamento",
        "text": "Finalize com bastante cheiro-verde fresco picado e sirva com arroz branco soltinho.",
        "image": "/dishes/carne-panela-mandioca.jpg",
        "alt": "Passo 7: Finalize com bastante cheiro-verde fresco picado e...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-11",
    "title": "Picadinho com Arroz e Feijão",
    "category": "Almoço",
    "prepTime": 30,
    "servings": 2,
    "calories": 470,
    "protein": 38,
    "carbs": 48,
    "fat": 14,
    "tags": [
      "Alta Proteína",
      "Econômico"
    ],
    "image": "/dishes/picadinho-carne.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "400g por porção",
    "platingInstructions": "Disposição tradicional brasileira: picadinho ao molho no centro, arroz branco e feijão carioca ao lado.",
    "specificInstructions": "Cortar a carne em cubos bem pequenos de 1,5 cm para cozinhar rápido sem endurecer.",
    "ingredients": [
      {
        "name": "Alcatra ou coxão mole em cubinhos",
        "amount": 300,
        "unit": "g",
        "aisle": "Açougue"
      },
      {
        "name": "Cenoura em cubinhos",
        "amount": 80,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Cebola e alho",
        "amount": 60,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Extrato de tomate",
        "amount": 30,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Arroz e feijão para acompanhar",
        "amount": 200,
        "unit": "g",
        "aisle": "Mercearia"
      }
    ],
    "steps": [
      "Corte a carne em cubinhos regulares de 1,5 cm e corte a cenoura em cubinhos pequenos do mesmo tamanho.",
      "Tempere a carne com alho picado, sal fino e pimenta-do-reino moída na hora.",
      "Aqueça uma panela de fundo grosso com azeite em fogo alto e sele a carne rapidamente em duas remessas para não juntar líquido.",
      "Junte a cebola picada na mesma panela e refogue por 2 minutos até dourar no fundo da panela.",
      "Adicione a cenoura em cubinhos, o extrato de tomate e 100ml de água fervente, raspando o fundo com colher de pau.",
      "Abaixe o fogo, tampe e deixe cozinhar em fogo brando por 15 minutos até a cenoura ficar macia e o molho encorpar.",
      "Finalize com salsinha fresca picada e sirva acompanhado do clássico arroz branco e feijão carioca."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          6
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          7,
          7
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Picadinho com Arroz e Feijão.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Corte a carne em cubinhos regulares de 1,5 cm e corte a cenoura em cubinhos pequenos do mesmo tamanho.",
        "image": "/dishes/steps/picadinho-carne/step-1.webp",
        "alt": "Passo 1: Corte a carne em cubinhos regulares de 1,5 cm e co...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Tempere a carne com alho picado, sal fino e pimenta-do-reino moída na hora.",
        "image": "/dishes/steps/picadinho-carne/step-2.webp",
        "alt": "Passo 2: Tempere a carne com alho picado, sal fino e piment...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Aqueça uma panela de fundo grosso com azeite em fogo alto e sele a carne rapidamente em duas remessas para não juntar líquido.",
        "image": "/dishes/steps/picadinho-carne/step-3.webp",
        "alt": "Passo 3: Aqueça uma panela de fundo grosso com azeite em fo...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Junte a cebola picada na mesma panela e refogue por 2 minutos até dourar no fundo da panela.",
        "image": "/dishes/steps/picadinho-carne/step-4.webp",
        "alt": "Passo 4: Junte a cebola picada na mesma panela e refogue po...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Adicione a cenoura em cubinhos, o extrato de tomate e 100ml de água fervente, raspando o fundo com colher de pau.",
        "image": "/dishes/steps/picadinho-carne/step-5.webp",
        "alt": "Passo 5: Adicione a cenoura em cubinhos, o extrato de tomat...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Cocção & Ponto Ideal",
        "text": "Abaixe o fogo, tampe e deixe cozinhar em fogo brando por 15 minutos até a cenoura ficar macia e o molho encorpar.",
        "image": "/dishes/steps/picadinho-carne/step-6.webp",
        "alt": "Passo 6: Abaixe o fogo, tampe e deixe cozinhar em fogo bran...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 7,
        "section": "Finalização & Empratamento",
        "text": "Finalize com salsinha fresca picada e sirva acompanhado do clássico arroz branco e feijão carioca.",
        "image": "/dishes/picadinho-carne.jpg",
        "alt": "Passo 7: Finalize com salsinha fresca picada e sirva acompa...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-12",
    "title": "Tilápia com Legumes Salteados",
    "category": "Almoço",
    "prepTime": 20,
    "servings": 2,
    "calories": 330,
    "protein": 34,
    "carbs": 18,
    "fat": 11,
    "tags": [
      "Alta Proteína",
      "Tirzepatida",
      "Low Carb",
      "Sem Glúten",
      "Sem Lactose",
      "Rápido"
    ],
    "image": "/dishes/rec-9.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "310g por porção",
    "platingInstructions": "Posicionar o filé de tilápia com crosta dourada sobre uma cama de legumes salteados coloridos.",
    "specificInstructions": "Secar bem os filés de peixe com papel-toalha antes de grelhar para obter crosta perfeita.",
    "ingredients": [
      {
        "name": "Filé de tilápia fresca",
        "amount": 320,
        "unit": "g",
        "aisle": "Peixaria"
      },
      {
        "name": "Abobrinha em rodelas finas",
        "amount": 100,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Cenoura em lâminas finas",
        "amount": 80,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Tomate-cereja",
        "amount": 60,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Azeite de oliva e limão",
        "amount": 20,
        "unit": "ml",
        "aisle": "Mercearia"
      }
    ],
    "steps": [
      "Seque bem os filés de tilápia com papel-toalha e tempere com suco de limão fresco, sal marinho e raspas de limão.",
      "Lave e corte a abobrinha em meias-luas e a cenoura em tiras bem finas no mandoline.",
      "Aqueça uma frigideira grande com 1 colher de azeite em fogo médio e adicione os legumes, salteando por 4 minutos até dourarem mantendo crocância.",
      "Junte os tomates-cereja inteiros aos legumes, salteie por mais 1 minuto até a pele estalar suavemente, retire e reserve aquecidos.",
      "Na mesma frigideira bem quente com mais um fio de azeite, acomode os filés de tilápia e grelhe por 3 minutos de um lado sem mexer.",
      "Vire com espátula com delicadeza e doure o outro lado por mais 2 minutos até o peixe atingir ponto suculento e sirva sobre os legumes."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Tilápia com Legumes Salteados.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Seque bem os filés de tilápia com papel-toalha e tempere com suco de limão fresco, sal marinho e raspas de limão.",
        "image": "/dishes/steps/tilapia/step-1.webp",
        "alt": "Passo 1: Seque bem os filés de tilápia com papel-toalha e t...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Lave e corte a abobrinha em meias-luas e a cenoura em tiras bem finas no mandoline.",
        "image": "/dishes/steps/tilapia/step-2.webp",
        "alt": "Passo 2: Lave e corte a abobrinha em meias-luas e a cenoura...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Aqueça uma frigideira grande com 1 colher de azeite em fogo médio e adicione os legumes, salteando por 4 minutos até dourarem mantendo crocância.",
        "image": "/dishes/steps/tilapia/step-3.webp",
        "alt": "Passo 3: Aqueça uma frigideira grande com 1 colher de azeit...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Junte os tomates-cereja inteiros aos legumes, salteie por mais 1 minuto até a pele estalar suavemente, retire e reserve aquecidos.",
        "image": "/dishes/steps/tilapia/step-4.webp",
        "alt": "Passo 4: Junte os tomates-cereja inteiros aos legumes, salt...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Na mesma frigideira bem quente com mais um fio de azeite, acomode os filés de tilápia e grelhe por 3 minutos de um lado sem mexer.",
        "image": "/dishes/steps/tilapia/step-5.webp",
        "alt": "Passo 5: Na mesma frigideira bem quente com mais um fio de ...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Vire com espátula com delicadeza e doure o outro lado por mais 2 minutos até o peixe atingir ponto suculento e sirva sobre os legumes.",
        "image": "/dishes/rec-9.jpg",
        "alt": "Passo 6: Vire com espátula com delicadeza e doure o outro l...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-13",
    "title": "Escondidinho de Frango e Batata",
    "category": "Almoço",
    "prepTime": 35,
    "servings": 2,
    "calories": 420,
    "protein": 35,
    "carbs": 45,
    "fat": 12,
    "tags": [
      "Alta Proteína",
      "Sem Glúten"
    ],
    "image": "/dishes/rec-7.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "360g por porção",
    "platingInstructions": "Gratinar até formar casquinha dourada crocante de queijo e servir em refratário individual de cerâmica.",
    "specificInstructions": "Adicionar um pouco de leite morno ao purê de batata para garantir consistência sedosa e fácil de espalhar.",
    "ingredients": [
      {
        "name": "Peito de frango cozido e desfiado",
        "amount": 250,
        "unit": "g",
        "aisle": "Açougue"
      },
      {
        "name": "Batata-doce ou inglesa cozida",
        "amount": 350,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Molho de tomate caseiro",
        "amount": 100,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Queijo muçarela ou queijo minas",
        "amount": 40,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Azeite e temperos frescos",
        "amount": 15,
        "unit": "ml",
        "aisle": "Mercearia"
      }
    ],
    "steps": [
      "Cozinhe as batatas descascadas em água fervente com sal por 15 minutos até ficarem bem macias.",
      "Escorra a água, passe as batatas pelo espremedor ainda quentes e incorpore 50ml de leite morno e um fio de azeite até obter purê liso.",
      "Em uma panela, aqueça o azeite e refogue cebola e alho até dourar, adicionando o frango desfiado e o molho de tomate.",
      "Cozinhe o recheio de frango por 5 minutos até apurar bem o sabor e secar o excesso de líquido.",
      "Em um refratário que vá ao forno, espalhe todo o frango refogado em camada uniforme no fundo.",
      "Cubra com o purê de batatas nivelando com as costas de uma colher e polvilhe o queijo ralado por cima.",
      "Leve ao forno pré-aquecido a 200°C por 12 a 15 minutos até o queijo derreter e dourar em crosta crocante."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          6
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          7,
          7
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Escondidinho de Frango e Batata.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Cozinhe as batatas descascadas em água fervente com sal por 15 minutos até ficarem bem macias.",
        "image": "/dishes/steps/escondidinho/step-1.webp",
        "alt": "Passo 1: Cozinhe as batatas descascadas em água fervente co...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Escorra a água, passe as batatas pelo espremedor ainda quentes e incorpore 50ml de leite morno e um fio de azeite até obter purê liso.",
        "image": "/dishes/steps/escondidinho/step-2.webp",
        "alt": "Passo 2: Escorra a água, passe as batatas pelo espremedor a...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Em uma panela, aqueça o azeite e refogue cebola e alho até dourar, adicionando o frango desfiado e o molho de tomate.",
        "image": "/dishes/steps/escondidinho/step-3.webp",
        "alt": "Passo 3: Em uma panela, aqueça o azeite e refogue cebola e ...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Cozinhe o recheio de frango por 5 minutos até apurar bem o sabor e secar o excesso de líquido.",
        "image": "/dishes/steps/escondidinho/step-4.webp",
        "alt": "Passo 4: Cozinhe o recheio de frango por 5 minutos até apur...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Em um refratário que vá ao forno, espalhe todo o frango refogado em camada uniforme no fundo.",
        "image": "/dishes/steps/escondidinho/step-5.webp",
        "alt": "Passo 5: Em um refratário que vá ao forno, espalhe todo o f...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Cocção & Ponto Ideal",
        "text": "Cubra com o purê de batatas nivelando com as costas de uma colher e polvilhe o queijo ralado por cima.",
        "image": "/dishes/steps/escondidinho/step-6.webp",
        "alt": "Passo 6: Cubra com o purê de batatas nivelando com as costa...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 7,
        "section": "Finalização & Empratamento",
        "text": "Leve ao forno pré-aquecido a 200°C por 12 a 15 minutos até o queijo derreter e dourar em crosta crocante.",
        "image": "/dishes/rec-7.jpg",
        "alt": "Passo 7: Leve ao forno pré-aquecido a 200°C por 12 a 15 min...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-14",
    "title": "Bife Acebolado com Purê",
    "category": "Almoço",
    "prepTime": 25,
    "servings": 2,
    "calories": 450,
    "protein": 36,
    "carbs": 38,
    "fat": 16,
    "tags": [
      "Alta Proteína",
      "Sem Glúten",
      "Econômico"
    ],
    "image": "/dishes/bife-acebolado.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "380g por porção",
    "platingInstructions": "Dispor o bife com as cebolas caramelizadas cobrindo a carne e o purê cremoso moldado com colher ao lado.",
    "specificInstructions": "Grelhar a carne em frigideira fumegante sem mexer para criar crosta profunda de sabor (Reação de Maillard).",
    "ingredients": [
      {
        "name": "Bifes de coxão mole ou alcatra",
        "amount": 300,
        "unit": "g",
        "aisle": "Açougue"
      },
      {
        "name": "Cebola grande cortada em rodelas",
        "amount": 150,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Batatas cozidas para o purê",
        "amount": 300,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Manteiga e leite para o purê",
        "amount": 40,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Azeite de oliva e sal marinho",
        "amount": 15,
        "unit": "ml",
        "aisle": "Mercearia"
      }
    ],
    "steps": [
      "Esprema as batatas cozidas ainda quentes em uma panela, junte a manteiga, o leite morno e sal, batendo com espátula até obter purê aveludado.",
      "Seque os bifes de carne com papel-toalha e tempere ambos os lados com sal fino e pimenta-do-reino moída.",
      "Aqueça uma frigideira de ferro ou fundo grosso com azeite em fogo alto até fumegar levemente.",
      "Acomode os bifes sem sobrepor e grelhe por 2 minutos de cada lado até criar uma crosta dourada intensa, retirando e reservando aquecidos.",
      "Na mesma frigideira com o fundo dourado da carne, adicione as rodelas de cebola e 2 colheres de água.",
      "Refogue em fogo médio raspando o fundo da frigideira por 4 minutos até as cebolas caramelizarem douradas e macias.",
      "Cubra os bifes com a cebola caramelizada fumegante e sirva acompanhado do purê de batatas cremoso."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          6
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          7,
          7
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Bife Acebolado com Purê.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Esprema as batatas cozidas ainda quentes em uma panela, junte a manteiga, o leite morno e sal, batendo com espátula até obter purê aveludado.",
        "image": "/dishes/steps/bife-acebolado/step-1.webp",
        "alt": "Passo 1: Esprema as batatas cozidas ainda quentes em uma pa...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Seque os bifes de carne com papel-toalha e tempere ambos os lados com sal fino e pimenta-do-reino moída.",
        "image": "/dishes/steps/bife-acebolado/step-2.webp",
        "alt": "Passo 2: Seque os bifes de carne com papel-toalha e tempere...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Aqueça uma frigideira de ferro ou fundo grosso com azeite em fogo alto até fumegar levemente.",
        "image": "/dishes/steps/bife-acebolado/step-3.webp",
        "alt": "Passo 3: Aqueça uma frigideira de ferro ou fundo grosso com...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Acomode os bifes sem sobrepor e grelhe por 2 minutos de cada lado até criar uma crosta dourada intensa, retirando e reservando aquecidos.",
        "image": "/dishes/steps/bife-acebolado/step-4.webp",
        "alt": "Passo 4: Acomode os bifes sem sobrepor e grelhe por 2 minut...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Na mesma frigideira com o fundo dourado da carne, adicione as rodelas de cebola e 2 colheres de água.",
        "image": "/dishes/steps/bife-acebolado/step-5.webp",
        "alt": "Passo 5: Na mesma frigideira com o fundo dourado da carne, ...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Cocção & Ponto Ideal",
        "text": "Refogue em fogo médio raspando o fundo da frigideira por 4 minutos até as cebolas caramelizarem douradas e macias.",
        "image": "/dishes/steps/bife-acebolado/step-6.webp",
        "alt": "Passo 6: Refogue em fogo médio raspando o fundo da frigidei...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 7,
        "section": "Finalização & Empratamento",
        "text": "Cubra os bifes com a cebola caramelizada fumegante e sirva acompanhado do purê de batatas cremoso.",
        "image": "/dishes/bife-acebolado.jpg",
        "alt": "Passo 7: Cubra os bifes com a cebola caramelizada fumegante...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-15",
    "title": "Feijoada Light Caseira",
    "category": "Almoço",
    "prepTime": 50,
    "servings": 3,
    "calories": 490,
    "protein": 38,
    "carbs": 46,
    "fat": 16,
    "tags": [
      "Alta Proteína",
      "Sem Glúten"
    ],
    "image": "/dishes/feijoada-light.png",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "420g por porção",
    "platingInstructions": "Apresentar em cumbuca rústica com a couve refogada verde brilhante e rodelas de laranja fresca ao lado.",
    "specificInstructions": "Usar carnes magras como lombo suíno e carne-seca dessalgada para manter perfil leve e saudável.",
    "ingredients": [
      {
        "name": "Feijão preto demolhado",
        "amount": 250,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Lombo suíno em cubos magros",
        "amount": 200,
        "unit": "g",
        "aisle": "Açougue"
      },
      {
        "name": "Carne-seca magra dessalgada",
        "amount": 150,
        "unit": "g",
        "aisle": "Açougue"
      },
      {
        "name": "Couve-manteiga fatiada fina",
        "amount": 100,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Alho, cebola e folhas de louro",
        "amount": 60,
        "unit": "g",
        "aisle": "Hortifruti"
      }
    ],
    "steps": [
      "Deixe o feijão preto de molho em água por 8 horas e dessalgue a carne-seca em cubos trocando a água na geladeira.",
      "Em uma panela de pressão com um fio de azeite, doure o lombo suíno em cubos e a carne-seca.",
      "Adicione o feijão preto escorrido, folhas de louro e cubra com água nova até passar 4 dedos acima dos grãos.",
      "Tampe e cozinhe na pressão por 30 minutos após chiar, desligando e deixando a pressão sair naturalmente.",
      "Em outra panela, doure bastante alho picado em azeite, adicione 2 conchas do feijão cozido e amasse com garfo para formar base cremosa.",
      "Retorne essa base para a panela de feijoada e ferva em fogo médio destampada por 10 minutos para encorpar o caldo.",
      "Refogue a couve fatiada no alho por 1 minuto e sirva a feijoada com arroz, couve e rodelas de laranja."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          6
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          7,
          7
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Feijoada Light Caseira.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Deixe o feijão preto de molho em água por 8 horas e dessalgue a carne-seca em cubos trocando a água na geladeira.",
        "image": "/dishes/steps/feijoada/step-1.webp",
        "alt": "Passo 1: Deixe o feijão preto de molho em água por 8 horas ...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Em uma panela de pressão com um fio de azeite, doure o lombo suíno em cubos e a carne-seca.",
        "image": "/dishes/steps/feijoada/step-2.webp",
        "alt": "Passo 2: Em uma panela de pressão com um fio de azeite, dou...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Adicione o feijão preto escorrido, folhas de louro e cubra com água nova até passar 4 dedos acima dos grãos.",
        "image": "/dishes/steps/feijoada/step-3.webp",
        "alt": "Passo 3: Adicione o feijão preto escorrido, folhas de louro...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Tampe e cozinhe na pressão por 30 minutos após chiar, desligando e deixando a pressão sair naturalmente.",
        "image": "/dishes/steps/feijoada/step-4.webp",
        "alt": "Passo 4: Tampe e cozinhe na pressão por 30 minutos após chi...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Em outra panela, doure bastante alho picado em azeite, adicione 2 conchas do feijão cozido e amasse com garfo para formar base cremosa.",
        "image": "/dishes/steps/feijoada/step-5.webp",
        "alt": "Passo 5: Em outra panela, doure bastante alho picado em aze...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Cocção & Ponto Ideal",
        "text": "Retorne essa base para a panela de feijoada e ferva em fogo médio destampada por 10 minutos para encorpar o caldo.",
        "image": "/dishes/steps/feijoada/step-6.webp",
        "alt": "Passo 6: Retorne essa base para a panela de feijoada e ferv...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 7,
        "section": "Finalização & Empratamento",
        "text": "Refogue a couve fatiada no alho por 1 minuto e sirva a feijoada com arroz, couve e rodelas de laranja.",
        "image": "/dishes/feijoada-light.png",
        "alt": "Passo 7: Refogue a couve fatiada no alho por 1 minuto e sir...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-16",
    "title": "Sopa de Abóbora com Frango",
    "category": "Jantar",
    "prepTime": 25,
    "servings": 2,
    "calories": 280,
    "protein": 29,
    "carbs": 26,
    "fat": 7,
    "tags": [
      "Alta Proteína",
      "Tirzepatida",
      "Low Carb",
      "Sem Glúten",
      "Sem Lactose",
      "Termogênico"
    ],
    "image": "/dishes/sug-18.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "350g por porção",
    "platingInstructions": "Servir em bowl fundo com fio de azeite extra virgem, sementes de abóbora tostadas e cheiro-verde.",
    "specificInstructions": "Bater a abóbora cozida com o caldo do cozimento no liquidificador para atingir textura de velouté ultra suave.",
    "ingredients": [
      {
        "name": "Abóbora cabotiá descascada em cubos",
        "amount": 350,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Peito de frango cozido e desfiado",
        "amount": 200,
        "unit": "g",
        "aisle": "Açougue"
      },
      {
        "name": "Gengibre fresco ralado",
        "amount": 10,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Cebola e alho picados",
        "amount": 50,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Azeite de oliva e sal",
        "amount": 10,
        "unit": "ml",
        "aisle": "Mercearia"
      }
    ],
    "steps": [
      "Pique a abóbora cabotiá em cubos médios de 3 cm e rale 1 colher de café de gengibre fresco.",
      "Em uma panela média, refogue a cebola picada e o alho em azeite até dourarem suavemente.",
      "Adicione a abóbora em cubos, o gengibre ralado e cubra com 400ml de água fervente e uma pitada de sal.",
      "Cozinhe em fogo médio com a panela semi-tampada por 15 minutos até a abóbora ficar macia a ponto de desmanchar.",
      "Bata o conteúdo da panela no liquidificador ou com mixer de imersão até virar um creme aveludado e uniforme.",
      "Volte o creme para a panela, adicione o frango cozido desfiado, acerte o sal e cozinhe por mais 3 minutos para aquecer bem antes de servir."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Sopa de Abóbora com Frango.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Pique a abóbora cabotiá em cubos médios de 3 cm e rale 1 colher de café de gengibre fresco.",
        "image": "/dishes/steps/sopa-abobora/step-1.webp",
        "alt": "Passo 1: Pique a abóbora cabotiá em cubos médios de 3 cm e ...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Em uma panela média, refogue a cebola picada e o alho em azeite até dourarem suavemente.",
        "image": "/dishes/steps/sopa-abobora/step-2.webp",
        "alt": "Passo 2: Em uma panela média, refogue a cebola picada e o a...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Adicione a abóbora em cubos, o gengibre ralado e cubra com 400ml de água fervente e uma pitada de sal.",
        "image": "/dishes/steps/sopa-abobora/step-3.webp",
        "alt": "Passo 3: Adicione a abóbora em cubos, o gengibre ralado e c...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Cozinhe em fogo médio com a panela semi-tampada por 15 minutos até a abóbora ficar macia a ponto de desmanchar.",
        "image": "/dishes/steps/sopa-abobora/step-4.webp",
        "alt": "Passo 4: Cozinhe em fogo médio com a panela semi-tampada po...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Bata o conteúdo da panela no liquidificador ou com mixer de imersão até virar um creme aveludado e uniforme.",
        "image": "/dishes/steps/sopa-abobora/step-5.webp",
        "alt": "Passo 5: Bata o conteúdo da panela no liquidificador ou com...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Volte o creme para a panela, adicione o frango cozido desfiado, acerte o sal e cozinhe por mais 3 minutos para aquecer bem antes de servir.",
        "image": "/dishes/sug-18.jpg",
        "alt": "Passo 6: Volte o creme para a panela, adicione o frango coz...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-17",
    "title": "Omelete de Forno com Espinafre",
    "category": "Jantar",
    "prepTime": 25,
    "servings": 2,
    "calories": 270,
    "protein": 26,
    "carbs": 8,
    "fat": 15,
    "tags": [
      "Alta Proteína",
      "Tirzepatida",
      "Low Carb",
      "Sem Glúten",
      "Vegetariano",
      "Econômico"
    ],
    "image": "/dishes/rec-10.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "250g por porção",
    "platingInstructions": "Cortar em fatias quadradas altas e firmes decoradas com folhas frescas de rúcula ou manjericão.",
    "specificInstructions": "Refogar o espinafre antes de misturar aos ovos para eliminar o excesso de líquido e não murchar o suflê.",
    "ingredients": [
      {
        "name": "Ovos inteiros frescos",
        "amount": 4,
        "unit": "un",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Claras de ovo",
        "amount": 2,
        "unit": "un",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Folhas de espinafre higienizadas",
        "amount": 120,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Queijo minas frescal em cubos",
        "amount": 80,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Fermento químico em pó",
        "amount": 5,
        "unit": "g",
        "aisle": "Mercearia"
      }
    ],
    "steps": [
      "Higienize as folhas de espinafre, rasgue com as mãos e refogue em frigideira quente por 2 minutos até murcharem e secarem a água.",
      "Em uma tigela ampla, bata os 4 ovos inteiros e as 2 claras com garfo ou fouet até aerarem e dobrarem levemente de volume.",
      "Incorpore uma pitada de sal fino, noz-moscada ralada e o fermento químico em pó aos ovos batidos.",
      "Adicione o espinafre refogado e os cubinhos de queijo minas frescal, misturando delicadamente com espátula.",
      "Transfira a mistura para um refratário médio untado com azeite de oliva.",
      "Asse em forno pré-aquecido a 180°C por 18 a 20 minutos até a omelete estufar dourada e passar no teste do palito."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Omelete de Forno com Espinafre.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Higienize as folhas de espinafre, rasgue com as mãos e refogue em frigideira quente por 2 minutos até murcharem e secarem a água.",
        "image": "/dishes/steps/omelete/step-1.webp",
        "alt": "Passo 1: Higienize as folhas de espinafre, rasgue com as mã...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Em uma tigela ampla, bata os 4 ovos inteiros e as 2 claras com garfo ou fouet até aerarem e dobrarem levemente de volume.",
        "image": "/dishes/steps/omelete/step-2.webp",
        "alt": "Passo 2: Em uma tigela ampla, bata os 4 ovos inteiros e as ...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Incorpore uma pitada de sal fino, noz-moscada ralada e o fermento químico em pó aos ovos batidos.",
        "image": "/dishes/steps/omelete/step-3.webp",
        "alt": "Passo 3: Incorpore uma pitada de sal fino, noz-moscada rala...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Adicione o espinafre refogado e os cubinhos de queijo minas frescal, misturando delicadamente com espátula.",
        "image": "/dishes/steps/omelete/step-4.webp",
        "alt": "Passo 4: Adicione o espinafre refogado e os cubinhos de que...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Transfira a mistura para um refratário médio untado com azeite de oliva.",
        "image": "/dishes/steps/omelete/step-5.webp",
        "alt": "Passo 5: Transfira a mistura para um refratário médio untad...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Asse em forno pré-aquecido a 180°C por 18 a 20 minutos até a omelete estufar dourada e passar no teste do palito.",
        "image": "/dishes/rec-10.jpg",
        "alt": "Passo 6: Asse em forno pré-aquecido a 180°C por 18 a 20 min...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-18",
    "title": "Caldo Verde com Lombo",
    "category": "Jantar",
    "prepTime": 25,
    "servings": 2,
    "calories": 290,
    "protein": 28,
    "carbs": 27,
    "fat": 8,
    "tags": [
      "Alta Proteína",
      "Tirzepatida",
      "Sem Glúten",
      "Sem Lactose",
      "Econômico"
    ],
    "image": "/dishes/sug-14.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "360g por porção",
    "platingInstructions": "Servir bem quente em cumbuca funda regado com fio generoso de azeite extra virgem.",
    "specificInstructions": "Cortar a couve em tiras finíssimas (chiffonade) e adicionar somente nos minutos finais de cozimento.",
    "ingredients": [
      {
        "name": "Batata inglesa descascada",
        "amount": 300,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Couve-manteiga em tiras finas",
        "amount": 100,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Lombo suíno magro desfiado ou em tiras",
        "amount": 200,
        "unit": "g",
        "aisle": "Açougue"
      },
      {
        "name": "Alho picado e cebola",
        "amount": 40,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Azeite de oliva e sal",
        "amount": 15,
        "unit": "ml",
        "aisle": "Mercearia"
      }
    ],
    "steps": [
      "Descasque e corte as batatas em cubos, cozinhando em água com sal e 1 dente de alho por 15 minutos até desmancharem.",
      "Bata as batatas com a própria água do cozimento no liquidificador até obter um caldo cremoso e translúcido.",
      "Em uma panela funda, doure o lombo suíno magro picadinho com azeite e alho até ficar bem dourado e aromático.",
      "Despeje o creme de batatas na panela do lombo, misture bem e deixe levantar fervura suave por 3 minutos.",
      "Adicione a couve-manteiga cortada bem fina ao caldo fervente, mexendo por apenas 2 minutos para amaciar mantendo a cor verde-viva.",
      "Acerte o sal, desligue o fogo e sirva imediatamente com um fio de azeite de oliva por cima."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Caldo Verde com Lombo.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Descasque e corte as batatas em cubos, cozinhando em água com sal e 1 dente de alho por 15 minutos até desmancharem.",
        "image": "/dishes/steps/caldo-verde/step-1.webp",
        "alt": "Passo 1: Descasque e corte as batatas em cubos, cozinhando ...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Bata as batatas com a própria água do cozimento no liquidificador até obter um caldo cremoso e translúcido.",
        "image": "/dishes/steps/caldo-verde/step-2.webp",
        "alt": "Passo 2: Bata as batatas com a própria água do cozimento no...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Em uma panela funda, doure o lombo suíno magro picadinho com azeite e alho até ficar bem dourado e aromático.",
        "image": "/dishes/steps/caldo-verde/step-3.webp",
        "alt": "Passo 3: Em uma panela funda, doure o lombo suíno magro pic...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Despeje o creme de batatas na panela do lombo, misture bem e deixe levantar fervura suave por 3 minutos.",
        "image": "/dishes/steps/caldo-verde/step-4.webp",
        "alt": "Passo 4: Despeje o creme de batatas na panela do lombo, mis...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Adicione a couve-manteiga cortada bem fina ao caldo fervente, mexendo por apenas 2 minutos para amaciar mantendo a cor verde-viva.",
        "image": "/dishes/steps/caldo-verde/step-5.webp",
        "alt": "Passo 5: Adicione a couve-manteiga cortada bem fina ao cald...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Acerte o sal, desligue o fogo e sirva imediatamente com um fio de azeite de oliva por cima.",
        "image": "/dishes/sug-14.jpg",
        "alt": "Passo 6: Acerte o sal, desligue o fogo e sirva imediatament...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-19",
    "title": "Salada Caesar com Frango",
    "category": "Jantar",
    "prepTime": 15,
    "servings": 1,
    "calories": 340,
    "protein": 36,
    "carbs": 14,
    "fat": 14,
    "tags": [
      "Alta Proteína",
      "Tirzepatida",
      "Low Carb",
      "Rápido"
    ],
    "image": "/dishes/sug-16.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "280g por porção",
    "platingInstructions": "Dispor as folhas de alface no fundo do prato, as tiras de frango dourado mornas por cima e lascas de parmesão no topo.",
    "specificInstructions": "Grelhar o peito de frango bem seco para dourar rápido e manter o centro macio e suculento.",
    "ingredients": [
      {
        "name": "Peito de frango em filé",
        "amount": 180,
        "unit": "g",
        "aisle": "Açougue"
      },
      {
        "name": "Alface romana higienizada",
        "amount": 120,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Iogurte natural desnatado",
        "amount": 40,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Queijo parmesão em lascas",
        "amount": 15,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Azeite, mostarda e limão",
        "amount": 15,
        "unit": "ml",
        "aisle": "Mercearia"
      }
    ],
    "steps": [
      "Tempere o filé de peito de frango com sal, pimenta-do-reino moída na hora e gotas de suco de limão.",
      "Aqueça uma frigideira com um fio de azeite em fogo médio-alto e grelhe o frango por 3 a 4 minutos de cada lado até dourar.",
      "Transfira o frango para uma tábua, deixe descansar por 2 minutos para assentar os sucos e corte em tiras diagonais de 1 cm.",
      "Em uma tigelinha, faça o molho batendo o iogurte natural, azeite, mostarda, suco de limão e uma pitadinha de sal com garfo.",
      "Rasgue as folhas de alface romana higienizadas e secas em um prato fundo ou bowl amplo.",
      "Acomode as tiras de frango grelhado mornas sobre a alface, regue com o molho de iogurte e finalize com as lascas de parmesão."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Salada Caesar com Frango.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Tempere o filé de peito de frango com sal, pimenta-do-reino moída na hora e gotas de suco de limão.",
        "image": "/dishes/steps/salada-caesar/step-1.webp",
        "alt": "Passo 1: Tempere o filé de peito de frango com sal, pimenta...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Aqueça uma frigideira com um fio de azeite em fogo médio-alto e grelhe o frango por 3 a 4 minutos de cada lado até dourar.",
        "image": "/dishes/steps/salada-caesar/step-2.webp",
        "alt": "Passo 2: Aqueça uma frigideira com um fio de azeite em fogo...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Transfira o frango para uma tábua, deixe descansar por 2 minutos para assentar os sucos e corte em tiras diagonais de 1 cm.",
        "image": "/dishes/steps/salada-caesar/step-3.webp",
        "alt": "Passo 3: Transfira o frango para uma tábua, deixe descansar...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Em uma tigelinha, faça o molho batendo o iogurte natural, azeite, mostarda, suco de limão e uma pitadinha de sal com garfo.",
        "image": "/dishes/steps/salada-caesar/step-4.webp",
        "alt": "Passo 4: Em uma tigelinha, faça o molho batendo o iogurte n...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Rasgue as folhas de alface romana higienizadas e secas em um prato fundo ou bowl amplo.",
        "image": "/dishes/steps/salada-caesar/step-5.webp",
        "alt": "Passo 5: Rasgue as folhas de alface romana higienizadas e s...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Acomode as tiras de frango grelhado mornas sobre a alface, regue com o molho de iogurte e finalize com as lascas de parmesão.",
        "image": "/dishes/sug-16.jpg",
        "alt": "Passo 6: Acomode as tiras de frango grelhado mornas sobre a...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-20",
    "title": "Hambúrguer de Patinho no Prato",
    "category": "Jantar",
    "prepTime": 18,
    "servings": 1,
    "calories": 360,
    "protein": 38,
    "carbs": 8,
    "fat": 18,
    "tags": [
      "Alta Proteína",
      "Tirzepatida",
      "Low Carb",
      "Sem Glúten",
      "Sem Lactose",
      "Rápido"
    ],
    "image": "/dishes/hamburguer-fit.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "290g por porção",
    "platingInstructions": "Apresentar o hambúrguer alto com queijo derretido no topo e salada verde colorida ao redor.",
    "specificInstructions": "Moldar a carne sem apertar excessivamente e temperar com sal apenas no momento de ir para a chapa quente.",
    "ingredients": [
      {
        "name": "Carne moída magra (patinho)",
        "amount": 180,
        "unit": "g",
        "aisle": "Açougue"
      },
      {
        "name": "Mix de folhas verdes",
        "amount": 60,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Tomate fatiado",
        "amount": 60,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Queijo muçarela ou queijo prato",
        "amount": 25,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Azeite e sal grosso moído",
        "amount": 10,
        "unit": "ml",
        "aisle": "Mercearia"
      }
    ],
    "steps": [
      "Pese os 180g de patinho moído e molde com as mãos em formato de disco alto de cerca de 2,5 cm de espessura.",
      "Tempere a face superior do hambúrguer generosamente com sal grosso moído e pimenta-do-reino.",
      "Aqueça uma frigideira de ferro em fogo alto com umas gotas de azeite até soltar leve fumaça.",
      "Acomode o hambúrguer e sele por 3 minutos sem mexer para formar crosta escura e saborosa.",
      "Vire a carne, salgue o outro lado, coloque a fatia de queijo por cima, tampe a frigideira e asse por mais 2 minutos.",
      "Transfira o hambúrguer suculento para o prato, monte o mix de folhas frescas e fatias de tomate ao lado temperados com azeite e sirva."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Hambúrguer de Patinho no Prato.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Pese os 180g de patinho moído e molde com as mãos em formato de disco alto de cerca de 2,5 cm de espessura.",
        "image": "/dishes/steps/hamburguer-fit/step-1.webp",
        "alt": "Passo 1: Pese os 180g de patinho moído e molde com as mãos ...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Tempere a face superior do hambúrguer generosamente com sal grosso moído e pimenta-do-reino.",
        "image": "/dishes/steps/hamburguer-fit/step-2.webp",
        "alt": "Passo 2: Tempere a face superior do hambúrguer generosament...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Aqueça uma frigideira de ferro em fogo alto com umas gotas de azeite até soltar leve fumaça.",
        "image": "/dishes/steps/hamburguer-fit/step-3.webp",
        "alt": "Passo 3: Aqueça uma frigideira de ferro em fogo alto com um...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Acomode o hambúrguer e sele por 3 minutos sem mexer para formar crosta escura e saborosa.",
        "image": "/dishes/steps/hamburguer-fit/step-4.webp",
        "alt": "Passo 4: Acomode o hambúrguer e sele por 3 minutos sem mexe...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Vire a carne, salgue o outro lado, coloque a fatia de queijo por cima, tampe a frigideira e asse por mais 2 minutos.",
        "image": "/dishes/steps/hamburguer-fit/step-5.webp",
        "alt": "Passo 5: Vire a carne, salgue o outro lado, coloque a fatia...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Transfira o hambúrguer suculento para o prato, monte o mix de folhas frescas e fatias de tomate ao lado temperados com azeite e sirva.",
        "image": "/dishes/hamburguer-fit.jpg",
        "alt": "Passo 6: Transfira o hambúrguer suculento para o prato, mon...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-21",
    "title": "Panqueca de Espinafre com Ricota",
    "category": "Jantar",
    "prepTime": 25,
    "servings": 2,
    "calories": 310,
    "protein": 22,
    "carbs": 28,
    "fat": 12,
    "tags": [
      "Alta Proteína",
      "Vegetariano",
      "Econômico"
    ],
    "image": "/dishes/panqueca-espinafre.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "320g por porção",
    "platingInstructions": "Dispor as panquecas recheadas lado a lado, cobertas com molho de tomate rústico e gratinadas.",
    "specificInstructions": "Bater o espinafre cru com leite e ovos no liquidificador para obter massa verde homogênea e maleável.",
    "ingredients": [
      {
        "name": "Espinafre fresco",
        "amount": 80,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Ovos inteiros",
        "amount": 2,
        "unit": "un",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Farinha de aveia ou trigo",
        "amount": 60,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Ricota fresca esfarelada",
        "amount": 150,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Molho de tomate caseiro",
        "amount": 120,
        "unit": "g",
        "aisle": "Mercearia"
      }
    ],
    "steps": [
      "No liquidificador, bata o espinafre, os ovos, a farinha de aveia, 100ml de leite e uma pitada de sal até virar massa líquida verde e uniforme.",
      "Em uma tigela, amasse a ricota com um garfo e tempere com azeite, sal, noz-moscada e cheiro-verde.",
      "Aqueça uma frigideira antiaderente levemente untada e prepare discos finos de panqueca assando por 1 minuto de cada lado.",
      "Distribua porções fartas do creme de ricota no centro de cada disco de panqueca e enrole firmemente formando cilindros.",
      "Acomode as panquecas lado a lado em um refratário e cubra com o molho de tomate caseiro aquecido.",
      "Polvilhe uma pitada de parmesão por cima e leve ao forno por 8 minutos para aquecer e gratinar antes de servir."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Panqueca de Espinafre com Ricota.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "No liquidificador, bata o espinafre, os ovos, a farinha de aveia, 100ml de leite e uma pitada de sal até virar massa líquida verde e uniforme.",
        "image": "/dishes/steps/panqueca-espinafre/step-1.webp",
        "alt": "Passo 1: No liquidificador, bata o espinafre, os ovos, a fa...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Em uma tigela, amasse a ricota com um garfo e tempere com azeite, sal, noz-moscada e cheiro-verde.",
        "image": "/dishes/steps/panqueca-espinafre/step-2.webp",
        "alt": "Passo 2: Em uma tigela, amasse a ricota com um garfo e temp...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Aqueça uma frigideira antiaderente levemente untada e prepare discos finos de panqueca assando por 1 minuto de cada lado.",
        "image": "/dishes/steps/panqueca-espinafre/step-3.webp",
        "alt": "Passo 3: Aqueça uma frigideira antiaderente levemente untad...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Distribua porções fartas do creme de ricota no centro de cada disco de panqueca e enrole firmemente formando cilindros.",
        "image": "/dishes/steps/panqueca-espinafre/step-4.webp",
        "alt": "Passo 4: Distribua porções fartas do creme de ricota no cen...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Acomode as panquecas lado a lado em um refratário e cubra com o molho de tomate caseiro aquecido.",
        "image": "/dishes/steps/panqueca-espinafre/step-5.webp",
        "alt": "Passo 5: Acomode as panquecas lado a lado em um refratário ...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Polvilhe uma pitada de parmesão por cima e leve ao forno por 8 minutos para aquecer e gratinar antes de servir.",
        "image": "/dishes/panqueca-espinafre.jpg",
        "alt": "Passo 6: Polvilhe uma pitada de parmesão por cima e leve ao...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-22",
    "title": "Moqueca de Palmito com Banana",
    "category": "Almoço",
    "prepTime": 30,
    "servings": 2,
    "calories": 340,
    "protein": 10,
    "carbs": 48,
    "fat": 12,
    "tags": [
      "Vegetariano",
      "Sem Lactose",
      "Sem Glúten"
    ],
    "image": "/dishes/moqueca-banana.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "380g por porção",
    "platingInstructions": "Apresentar em panela de barro fumegante com as rodelas de banana e palmito envoltas no molho avermelhado.",
    "specificInstructions": "Adicionar a banana-da-terra apenas nos últimos 5 minutos de cozimento para que não desmanche.",
    "ingredients": [
      {
        "name": "Palmito pupunha em rodelas",
        "amount": 250,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Banana-da-terra fatiada",
        "amount": 150,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Pimentões coloridos e cebola",
        "amount": 120,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Leite de coco leve",
        "amount": 150,
        "unit": "ml",
        "aisle": "Mercearia"
      },
      {
        "name": "Azeite de dendê e coentro",
        "amount": 15,
        "unit": "ml",
        "aisle": "Mercearia"
      }
    ],
    "steps": [
      "Corte o palmito pupunha em rodelas grossas e a banana-da-terra em fatias diagonais de 1,5 cm.",
      "Em uma panela de barro ou fundo largo, monte camadas com cebola em rodelas, pimentões coloridos e o palmito.",
      "Regue com o leite de coco misturado ao molho de tomate, sal e 1 colher de café de azeite de dendê.",
      "Tampe a panela e cozinhe em fogo médio por 12 minutos até os pimentões murcharem e o molho incorporar.",
      "Acomode as fatias de banana-da-terra por cima do molho fervente e cozinhe por mais 5 minutos com panela tampada.",
      "Desligue o fogo, salpique folhas frescas de coentro ou cheiro-verde e sirva acompanhado de arroz branco soltinho."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Moqueca de Palmito com Banana.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Corte o palmito pupunha em rodelas grossas e a banana-da-terra em fatias diagonais de 1,5 cm.",
        "image": "/dishes/steps/moqueca-banana/step-1.webp",
        "alt": "Passo 1: Corte o palmito pupunha em rodelas grossas e a ban...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Em uma panela de barro ou fundo largo, monte camadas com cebola em rodelas, pimentões coloridos e o palmito.",
        "image": "/dishes/steps/moqueca-banana/step-2.webp",
        "alt": "Passo 2: Em uma panela de barro ou fundo largo, monte camad...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Regue com o leite de coco misturado ao molho de tomate, sal e 1 colher de café de azeite de dendê.",
        "image": "/dishes/steps/moqueca-banana/step-3.webp",
        "alt": "Passo 3: Regue com o leite de coco misturado ao molho de to...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Tampe a panela e cozinhe em fogo médio por 12 minutos até os pimentões murcharem e o molho incorporar.",
        "image": "/dishes/steps/moqueca-banana/step-4.webp",
        "alt": "Passo 4: Tampe a panela e cozinhe em fogo médio por 12 minu...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Acomode as fatias de banana-da-terra por cima do molho fervente e cozinhe por mais 5 minutos com panela tampada.",
        "image": "/dishes/steps/moqueca-banana/step-5.webp",
        "alt": "Passo 5: Acomode as fatias de banana-da-terra por cima do m...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Desligue o fogo, salpique folhas frescas de coentro ou cheiro-verde e sirva acompanhado de arroz branco soltinho.",
        "image": "/dishes/moqueca-banana.jpg",
        "alt": "Passo 6: Desligue o fogo, salpique folhas frescas de coentr...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-23",
    "title": "Suflê de Legumes Gratinado",
    "category": "Almoço",
    "prepTime": 35,
    "servings": 2,
    "calories": 290,
    "protein": 15,
    "carbs": 22,
    "fat": 14,
    "tags": [
      "Vegetariano",
      "Econômico"
    ],
    "image": "/dishes/sufle-legumes.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "300g por porção",
    "platingInstructions": "Servir imediatamente ao sair do forno enquanto o suflê está alto, fofo e dourado.",
    "specificInstructions": "Bater as claras em neve firme e incorporar delicadamente com espátula fazendo movimentos circulares de baixo para cima.",
    "ingredients": [
      {
        "name": "Cenoura e abobrinha raladas",
        "amount": 200,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Ovos frescos (gemas e claras separadas)",
        "amount": 3,
        "unit": "un",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Queijo minas meia cura ralado",
        "amount": 60,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Leite morno com farinha",
        "amount": 100,
        "unit": "ml",
        "aisle": "Laticínios e Ovos"
      },
      {
        "name": "Manteiga e sal",
        "amount": 15,
        "unit": "g",
        "aisle": "Laticínios e Ovos"
      }
    ],
    "steps": [
      "Refogue a cenoura e a abobrinha raladas na manteiga por 3 minutos até secarem a água, deixando amornar.",
      "Separe as claras das gemas dos 3 ovos em tigelas distintas.",
      "Misture as gemas aos legumes refogados com o leite morno, a farinha, o queijo ralado, sal e noz-moscada.",
      "Bata as 3 claras em neve com batedeira ou fouet até formarem picos firmes e brilhantes.",
      "Incorpore as claras em neve à mistura de legumes em três etapas, mexendo de baixo para cima delicadamente para não perder o ar.",
      "Despeje em um refratário untado e asse a 190°C por 20 a 25 minutos até crescer alto, dourar a crosta e servir logo em seguida."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Suflê de Legumes Gratinado.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Refogue a cenoura e a abobrinha raladas na manteiga por 3 minutos até secarem a água, deixando amornar.",
        "image": "/dishes/steps/sufle-legumes/step-1.webp",
        "alt": "Passo 1: Refogue a cenoura e a abobrinha raladas na manteig...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Separe as claras das gemas dos 3 ovos em tigelas distintas.",
        "image": "/dishes/steps/sufle-legumes/step-2.webp",
        "alt": "Passo 2: Separe as claras das gemas dos 3 ovos em tigelas d...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Misture as gemas aos legumes refogados com o leite morno, a farinha, o queijo ralado, sal e noz-moscada.",
        "image": "/dishes/steps/sufle-legumes/step-3.webp",
        "alt": "Passo 3: Misture as gemas aos legumes refogados com o leite...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Bata as 3 claras em neve com batedeira ou fouet até formarem picos firmes e brilhantes.",
        "image": "/dishes/steps/sufle-legumes/step-4.webp",
        "alt": "Passo 4: Bata as 3 claras em neve com batedeira ou fouet at...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Incorpore as claras em neve à mistura de legumes em três etapas, mexendo de baixo para cima delicadamente para não perder o ar.",
        "image": "/dishes/steps/sufle-legumes/step-5.webp",
        "alt": "Passo 5: Incorpore as claras em neve à mistura de legumes e...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Despeje em um refratário untado e asse a 190°C por 20 a 25 minutos até crescer alto, dourar a crosta e servir logo em seguida.",
        "image": "/dishes/sufle-legumes.jpg",
        "alt": "Passo 6: Despeje em um refratário untado e asse a 190°C por...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-24",
    "title": "Canja de Frango Reconfortante",
    "category": "Jantar",
    "prepTime": 30,
    "servings": 2,
    "calories": 310,
    "protein": 30,
    "carbs": 34,
    "fat": 6,
    "tags": [
      "Alta Proteína",
      "Tirzepatida",
      "Sem Glúten",
      "Sem Lactose",
      "Econômico"
    ],
    "image": "/dishes/canja-frango.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "380g por porção",
    "platingInstructions": "Servir em tigela funda bem fumegante com cheiro-verde fresco salpicado e gotas de limão.",
    "specificInstructions": "Cozinhar o arroz no próprio caldo de cozimento do frango para absorver todo o sabor.",
    "ingredients": [
      {
        "name": "Peito de frango em cubos pequenos",
        "amount": 250,
        "unit": "g",
        "aisle": "Açougue"
      },
      {
        "name": "Arroz branco cru",
        "amount": 60,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Cenoura em cubinhos pequenos",
        "amount": 80,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Batata em cubinhos",
        "amount": 100,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Alho, cebola e cheiro-verde",
        "amount": 40,
        "unit": "g",
        "aisle": "Hortifruti"
      }
    ],
    "steps": [
      "Corte o peito de frango, a cenoura e a batata em cubinhos pequenos regulares de 1 cm.",
      "Em uma panela funda, doure o alho e a cebola picada com um fio de azeite e junte os cubos de frango.",
      "Refogue por 4 minutos até o frango selar por completo e dourar suavemente.",
      "Adicione a cenoura, a batata, os 60g de arroz branco lavado e cubra com 800ml de água fervente e sal.",
      "Abaixe o fogo, semi-tampe a panela e cozinhe por 18 a 20 minutos mexendo ocasionalmente até o arroz e os legumes ficarem macios.",
      "Desligue o fogo, salpique uma porção farta de salsinha e cebolinha fresca picada e sirva bem quente com gotas de limão."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Canja de Frango Reconfortante.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Corte o peito de frango, a cenoura e a batata em cubinhos pequenos regulares de 1 cm.",
        "image": "/dishes/steps/canja-frango/step-1.webp",
        "alt": "Passo 1: Corte o peito de frango, a cenoura e a batata em c...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Em uma panela funda, doure o alho e a cebola picada com um fio de azeite e junte os cubos de frango.",
        "image": "/dishes/steps/canja-frango/step-2.webp",
        "alt": "Passo 2: Em uma panela funda, doure o alho e a cebola picad...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Refogue por 4 minutos até o frango selar por completo e dourar suavemente.",
        "image": "/dishes/steps/canja-frango/step-3.webp",
        "alt": "Passo 3: Refogue por 4 minutos até o frango selar por compl...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Adicione a cenoura, a batata, os 60g de arroz branco lavado e cubra com 800ml de água fervente e sal.",
        "image": "/dishes/steps/canja-frango/step-4.webp",
        "alt": "Passo 4: Adicione a cenoura, a batata, os 60g de arroz bran...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Abaixe o fogo, semi-tampe a panela e cozinhe por 18 a 20 minutos mexendo ocasionalmente até o arroz e os legumes ficarem macios.",
        "image": "/dishes/steps/canja-frango/step-5.webp",
        "alt": "Passo 5: Abaixe o fogo, semi-tampe a panela e cozinhe por 1...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Desligue o fogo, salpique uma porção farta de salsinha e cebolinha fresca picada e sirva bem quente com gotas de limão.",
        "image": "/dishes/canja-frango.jpg",
        "alt": "Passo 6: Desligue o fogo, salpique uma porção farta de sals...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-25",
    "title": "Strogonoff de Frango",
    "category": "Almoço",
    "prepTime": 25,
    "servings": 3,
    "calories": 440,
    "protein": 36,
    "carbs": 34,
    "fat": 16,
    "tags": [
      "Alta Proteína",
      "Tirzepatida",
      "Rápido",
      "Econômico"
    ],
    "image": "/dishes/sug-9.jpg",
    "source": "Ficha Técnica NeatEat Brasil — Padrão Gastronômico",
    "portionWeight": "340g por porção",
    "platingInstructions": "Dispor o arroz branco em meia-lua, o strogonoff cremoso aveludado no centro e batata palha fresca na lateral.",
    "specificInstructions": "Selar o frango em fogo bem alto para reter sucos antes de incorporar o molho. Adicionar o creme de leite em fogo baixo sem ferver.",
    "ingredients": [
      {
        "name": "Peito de frango em tiras ou cubos",
        "amount": 450,
        "unit": "g",
        "aisle": "Açougue"
      },
      {
        "name": "Creme de leite leve",
        "amount": 200,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Molho de tomate caseiro",
        "amount": 120,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Mostarda amarela ou dijon",
        "amount": 20,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Cebola picada",
        "amount": 70,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Alho picado",
        "amount": 10,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Azeite de oliva",
        "amount": 15,
        "unit": "ml",
        "aisle": "Mercearia"
      },
      {
        "name": "Batata palha crocante",
        "amount": 40,
        "unit": "g",
        "aisle": "Mercearia"
      }
    ],
    "steps": [
      "Corte o peito de frango em tiras médias de 3 cm. Pique a cebola em cubinhos finos e amasse o alho.",
      "Tempere as tiras de frango com sal, alho, pimenta-do-reino e algumas gotas de limão.",
      "Aqueça uma frigideira funda com o azeite em fogo alto e doure o frango em duas etapas para não juntar água.",
      "Junte a cebola picada ao frango dourado e refogue por 2 minutos até murchar e dourar.",
      "Adicione o molho de tomate, a mostarda e uma pitada de noz-moscada, cozinhando em fogo baixo por 5 minutos.",
      "Abaixe o fogo para o mínimo, adicione o creme de leite e mexa delicadamente até homogeneizar sem deixar ferver.",
      "Sirva imediatamente com arroz branco e batata palha bem crocante disposta ao lado."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          6
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          7,
          7
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Strogonoff de Frango.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Corte o peito de frango em tiras médias de 3 cm. Pique a cebola em cubinhos finos e amasse o alho.",
        "image": "/dishes/steps/strogonoff/step-1.webp",
        "alt": "Passo 1: Corte o peito de frango em tiras médias de 3 cm. P...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Tempere as tiras de frango com sal, alho, pimenta-do-reino e algumas gotas de limão.",
        "image": "/dishes/steps/strogonoff/step-2.webp",
        "alt": "Passo 2: Tempere as tiras de frango com sal, alho, pimenta-...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Aqueça uma frigideira funda com o azeite em fogo alto e doure o frango em duas etapas para não juntar água.",
        "image": "/dishes/steps/strogonoff/step-3.webp",
        "alt": "Passo 3: Aqueça uma frigideira funda com o azeite em fogo a...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Junte a cebola picada ao frango dourado e refogue por 2 minutos até murchar e dourar.",
        "image": "/dishes/steps/strogonoff/step-4.webp",
        "alt": "Passo 4: Junte a cebola picada ao frango dourado e refogue ...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Adicione o molho de tomate, a mostarda e uma pitada de noz-moscada, cozinhando em fogo baixo por 5 minutos.",
        "image": "/dishes/steps/strogonoff/step-5.webp",
        "alt": "Passo 5: Adicione o molho de tomate, a mostarda e uma pitad...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Cocção & Ponto Ideal",
        "text": "Abaixe o fogo para o mínimo, adicione o creme de leite e mexa delicadamente até homogeneizar sem deixar ferver.",
        "image": "/dishes/steps/strogonoff/step-6.webp",
        "alt": "Passo 6: Abaixe o fogo para o mínimo, adicione o creme de l...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 7,
        "section": "Finalização & Empratamento",
        "text": "Sirva imediatamente com arroz branco e batata palha bem crocante disposta ao lado.",
        "image": "/dishes/sug-9.jpg",
        "alt": "Passo 7: Sirva imediatamente com arroz branco e batata palh...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-26",
    "title": "Salmão com Brócolis e Purê",
    "category": "Almoço",
    "prepTime": 22,
    "servings": 2,
    "calories": 380,
    "protein": 35,
    "carbs": 22,
    "fat": 14,
    "tags": [
      "Alta Proteína",
      "Tirzepatida",
      "Sem Glúten",
      "Peixes & Frutos do Mar",
      "Rápido"
    ],
    "image": "/dishes/salmao-grelhado.png",
    "source": "Ficha Técnica NeatEat Brasil — Aliado Tirzepatida",
    "portionWeight": "290g por porção",
    "platingInstructions": "Dispor o purê de batata sedoso na base, o filé de salmão com crosta crocante por cima e floretes de brócolis verde-vivos ao lado.",
    "specificInstructions": "Grelhar o salmão com a pele para baixo primeiro para liberar sua gordura saudável natural e criar crosta dourada.",
    "ingredients": [
      {
        "name": "Filé de salmão fresco",
        "amount": 300,
        "unit": "g",
        "aisle": "Peixaria"
      },
      {
        "name": "Brócolis frescos em floretes",
        "amount": 160,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Batata inglesa cozida",
        "amount": 200,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Azeite de oliva e limão siciliano",
        "amount": 15,
        "unit": "ml",
        "aisle": "Mercearia"
      },
      {
        "name": "Alho picado e sal fino",
        "amount": 10,
        "unit": "g",
        "aisle": "Hortifruti"
      }
    ],
    "steps": [
      "Descasque e cozinhe as batatas em água com sal por 12 minutos até ficarem bem macias.",
      "Passe as batatas pelo espremedor e incorpore 30ml de leite desnatado e um fio de azeite até obter purê leve e aveludado.",
      "Cozinhe os floretes de brócolis no vapor por 4 minutos até ficarem al dente e com tonalidade verde-esmeralda vibrante.",
      "Seque os filés de salmão com papel-toalha e tempere com sal marinho, raspas de limão siciliano e pimenta-do-reino.",
      "Aqueça uma frigideira antiaderente em fogo alto com umas gotas de azeite e acomode o salmão com a pele para baixo por 4 minutos.",
      "Vire com espátula delicadamente e doure o outro lado por mais 2 minutos mantendo o centro rosado e suculento.",
      "Monte o prato com o purê aveludado, acomode o filé de salmão grelhado e os floretes de brócolis regados com azeite."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          6
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          7,
          7
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Salmão com Brócolis e Purê.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Descasque e cozinhe as batatas em água com sal por 12 minutos até ficarem bem macias.",
        "image": "/dishes/steps/salmao-grelhado/step-1.webp",
        "alt": "Passo 1: Descasque e cozinhe as batatas em água com sal por...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Passe as batatas pelo espremedor e incorpore 30ml de leite desnatado e um fio de azeite até obter purê leve e aveludado.",
        "image": "/dishes/steps/salmao-grelhado/step-2.webp",
        "alt": "Passo 2: Passe as batatas pelo espremedor e incorpore 30ml ...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Cozinhe os floretes de brócolis no vapor por 4 minutos até ficarem al dente e com tonalidade verde-esmeralda vibrante.",
        "image": "/dishes/steps/salmao-grelhado/step-3.webp",
        "alt": "Passo 3: Cozinhe os floretes de brócolis no vapor por 4 min...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Seque os filés de salmão com papel-toalha e tempere com sal marinho, raspas de limão siciliano e pimenta-do-reino.",
        "image": "/dishes/steps/salmao-grelhado/step-4.webp",
        "alt": "Passo 4: Seque os filés de salmão com papel-toalha e temper...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Aqueça uma frigideira antiaderente em fogo alto com umas gotas de azeite e acomode o salmão com a pele para baixo por 4 minutos.",
        "image": "/dishes/steps/salmao-grelhado/step-5.webp",
        "alt": "Passo 5: Aqueça uma frigideira antiaderente em fogo alto co...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Cocção & Ponto Ideal",
        "text": "Vire com espátula delicadamente e doure o outro lado por mais 2 minutos mantendo o centro rosado e suculento.",
        "image": "/dishes/steps/salmao-grelhado/step-6.webp",
        "alt": "Passo 6: Vire com espátula delicadamente e doure o outro la...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 7,
        "section": "Finalização & Empratamento",
        "text": "Monte o prato com o purê aveludado, acomode o filé de salmão grelhado e os floretes de brócolis regados com azeite.",
        "image": "/dishes/salmao-grelhado.png",
        "alt": "Passo 7: Monte o prato com o purê aveludado, acomode o filé...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "sug-27",
    "title": "Bowl de Quinoa com Frango",
    "category": "Almoço",
    "prepTime": 20,
    "servings": 2,
    "calories": 360,
    "protein": 36,
    "carbs": 32,
    "fat": 9,
    "tags": [
      "Alta Proteína",
      "Tirzepatida",
      "Sem Glúten",
      "Sem Lactose",
      "Rápido"
    ],
    "image": "/dishes/bowl-quinoa.jpg",
    "source": "Ficha Técnica NeatEat Brasil — Aliado Tirzepatida",
    "portionWeight": "310g por porção",
    "platingInstructions": "Dispor a quinoa soltinha na base do bowl, o peito de frango grelhado fatiado em leque e legumes coloridos ao redor.",
    "specificInstructions": "Lavar a quinoa em peneira fina antes do cozimento para remover saponinas naturais que causam amargor.",
    "ingredients": [
      {
        "name": "Peito de frango grelhado em tiras",
        "amount": 280,
        "unit": "g",
        "aisle": "Açougue"
      },
      {
        "name": "Quinoa em grãos cozida",
        "amount": 160,
        "unit": "g",
        "aisle": "Mercearia"
      },
      {
        "name": "Tomate-cereja ao meio",
        "amount": 80,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Pepino japonês em rodelas",
        "amount": 80,
        "unit": "g",
        "aisle": "Hortifruti"
      },
      {
        "name": "Azeite, limão e orégano fresco",
        "amount": 15,
        "unit": "ml",
        "aisle": "Mercearia"
      }
    ],
    "steps": [
      "Cozinhe a quinoa em água fervente com sal por 12 minutos na proporção de 2 partes de água para 1 de quinoa até soltar o germe espiralado.",
      "Escorra qualquer excesso de líquido e solte os grãos de quinoa com um garfo, deixando amornar.",
      "Tempere os filés de frango com limão, alho e sal, grelhando em frigideira bem quente por 3 minutos de cada lado até dourar.",
      "Fatie o frango grelhado em tiras diagonais uniformes de 1 cm.",
      "Higienize os tomates-cereja e o pepino japonês, cortando os tomates ao meio e o pepino em rodelas finas.",
      "Monte em dois bowls fundos: base de quinoa fofa, tiras de frango grelhado de um lado e legumes frescos do outro, regando com molho leve de azeite e limão."
    ],
    "sections": [
      {
        "name": "Mise en Place & Preparo",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção & Ponto Ideal",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          6,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ficha técnica operacional padronizada para Bowl de Quinoa com Frango.",
      "storage": "Manter sob refrigeração a 4°C por até 3 dias em pote hermeticamente vedado.",
      "secret": "O controle preciso do fogo e o descanso prévio dos insumos garantem textura gastronômica impecável."
    },
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Pré-preparo",
        "text": "Cozinhe a quinoa em água fervente com sal por 12 minutos na proporção de 2 partes de água para 1 de quinoa até soltar o germe espiralado.",
        "image": "/dishes/steps/bowl-quinoa/step-1.webp",
        "alt": "Passo 1: Cozinhe a quinoa em água fervente com sal por 12 m...",
        "tip": "Pese todos os insumos e organize os utensílios na bancada.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cocção & Ponto Ideal",
        "text": "Escorra qualquer excesso de líquido e solte os grãos de quinoa com um garfo, deixando amornar.",
        "image": "/dishes/steps/bowl-quinoa/step-2.webp",
        "alt": "Passo 2: Escorra qualquer excesso de líquido e solte os grã...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cocção & Ponto Ideal",
        "text": "Tempere os filés de frango com limão, alho e sal, grelhando em frigideira bem quente por 3 minutos de cada lado até dourar.",
        "image": "/dishes/steps/bowl-quinoa/step-3.webp",
        "alt": "Passo 3: Tempere os filés de frango com limão, alho e sal, ...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Cocção & Ponto Ideal",
        "text": "Fatie o frango grelhado em tiras diagonais uniformes de 1 cm.",
        "image": "/dishes/steps/bowl-quinoa/step-4.webp",
        "alt": "Passo 4: Fatie o frango grelhado em tiras diagonais uniform...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Cocção & Ponto Ideal",
        "text": "Higienize os tomates-cereja e o pepino japonês, cortando os tomates ao meio e o pepino em rodelas finas.",
        "image": "/dishes/steps/bowl-quinoa/step-5.webp",
        "alt": "Passo 5: Higienize os tomates-cereja e o pepino japonês, co...",
        "tip": "Mantenha controle atento de temperatura para cocção homogênea.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Monte em dois bowls fundos: base de quinoa fofa, tiras de frango grelhado de um lado e legumes frescos do outro, regando com molho leve de azeite e limão.",
        "image": "/dishes/bowl-quinoa.jpg",
        "alt": "Passo 6: Monte em dois bowls fundos: base de quinoa fofa, t...",
        "tip": "Verifique o ponto de sal e a temperatura antes do serviço.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  }
];

// ============================================================================
// ANÁLISE DE PALADAR E HISTÓRICO DE ESCOLHAS (USER TASTE PROFILE)
// ============================================================================
export function computeUserTasteProfile(swipes = [], catalogRecipes = []) {
  const tagScores = new Map();
  const categoryTotal = new Map();
  const categoryAccepted = new Map();
  const prepTimesAccepted = [];

  let totalRight = 0;
  let totalLeft = 0;

  for (const sw of swipes) {
    let recipe = null;
    try {
      recipe = typeof sw.recipe_json === 'string' ? JSON.parse(sw.recipe_json) : sw.recipe_json;
    } catch {
      continue;
    }
    if (!recipe) continue;

    const isRight = sw.action === 'right';
    if (isRight) totalRight++;
    else totalLeft++;

    const cat = recipe.category || 'Almoço';
    categoryTotal.set(cat, (categoryTotal.get(cat) || 0) + 1);
    if (isRight) {
      categoryAccepted.set(cat, (categoryAccepted.get(cat) || 0) + 1);
      if (recipe.prepTime) prepTimesAccepted.push(Number(recipe.prepTime));
    }

    const tags = Array.isArray(recipe.tags) ? recipe.tags : [];
    for (const t of tags) {
      const current = tagScores.get(t) || { accepted: 0, rejected: 0, score: 0 };
      if (isRight) {
        current.accepted++;
        current.score += 2;
      } else {
        current.rejected++;
        current.score -= 1;
      }
      tagScores.set(t, current);
    }
  }

  for (const rec of catalogRecipes) {
    const tags = Array.isArray(rec.tags) ? rec.tags : [];
    for (const t of tags) {
      const current = tagScores.get(t) || { accepted: 0, rejected: 0, score: 0 };
      current.accepted += 1;
      current.score += 1;
      tagScores.set(t, current);
    }
    if (rec.prepTime) prepTimesAccepted.push(Number(rec.prepTime));
  }

  const sortedTags = Array.from(tagScores.entries())
    .map(([tag, data]) => ({ tag, ...data }))
    .sort((a, b) => b.score - a.score);

  const favoriteTags = sortedTags.filter((t) => t.score > 0).map((t) => t.tag);
  const avoidedTags = sortedTags.filter((t) => t.score < 0).map((t) => t.tag);

  const avgPrepTime =
    prepTimesAccepted.length > 0
      ? Math.round(prepTimesAccepted.reduce((a, b) => a + b, 0) / prepTimesAccepted.length)
      : 25;

  const totalSwipes = totalRight + totalLeft;
  const acceptanceRate = totalSwipes > 0 ? Math.round((totalRight / totalSwipes) * 100) : 50;

  let styleSummary = 'Explorando sabores';
  if (favoriteTags.length > 0) {
    styleSummary = favoriteTags.slice(0, 2).join(' • ');
  } else if (totalSwipes === 0) {
    styleSummary = 'Cardápio Balanceado & Prático';
  }

  return {
    favoriteTags,
    avoidedTags,
    avgPrepTime,
    totalSwipes,
    acceptedCount: totalRight,
    passedCount: totalLeft,
    acceptanceRate,
    styleSummary,
  };
}

// ============================================================================
// CÁLCULO DE AFINIDADE (SUGGESTION AFFINITY SCORING)
// ============================================================================
export function scoreSuggestionAffinity(suggestion, tasteProfile) {
  if (!tasteProfile || tasteProfile.totalSwipes === 0) {
    return {
      affinityPct: 75,
      affinityReasons: suggestion.tags?.slice(0, 2) || ['Equilibrado'],
      isHighAffinity: false,
    };
  }

  let score = 65;
  const reasons = [];

  const tags = Array.isArray(suggestion.tags) ? suggestion.tags : [];
  for (const t of tags) {
    if (tasteProfile.favoriteTags.includes(t)) {
      score += 10;
      reasons.push(t);
    } else if (tasteProfile.avoidedTags.includes(t)) {
      score -= 12;
    }
  }

  if (suggestion.category && tasteProfile.favoriteTags.includes(suggestion.category)) {
    score += 8;
  }

  if (suggestion.prepTime && suggestion.prepTime <= tasteProfile.avgPrepTime + 5) {
    score += 6;
    if (suggestion.prepTime <= 20) {
      reasons.push(`Rápido (${suggestion.prepTime} min)`);
    }
  }

  const affinityPct = Math.min(99, Math.max(45, Math.round(score)));
  const isHighAffinity = affinityPct >= 80;

  return {
    affinityPct,
    affinityReasons: reasons.length > 0 ? reasons.slice(0, 3) : ['Boa opção'],
    isHighAffinity,
  };
}

// ============================================================================
// MATCH INTELIGENTE COM A GELADEIRA (SMART FRIDGE INVENTORY MATCHER)
// ============================================================================
function normalizeIngredientName(name = '') {
  return String(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .trim();
}

export function computeFridgeMatch(ingredients = [], fridgeItems = [], marketPricesMap = new Map()) {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return {
      matchedCount: 0,
      totalCount: 0,
      matchPct: 0,
      matchedItems: [],
      missingItems: [],
      missingCost: 0,
      fridgeSavings: 0,
      status: 'none',
      badgeText: 'Sem insumos',
      badgeColor: 'slate',
    };
  }

  const normalizedFridge = (fridgeItems || []).map((f) => ({
    raw: f,
    clean: normalizeIngredientName(f.name),
  }));

  const matchedItems = [];
  const missingItems = [];
  let missingCost = 0;
  let fridgeSavings = 0;

  for (const ing of ingredients) {
    const cleanIng = normalizeIngredientName(ing.name);
    const ingTokens = cleanIng.split(/\s+/).filter((t) => t.length >= 3);

    let foundInFridge = false;

    for (const f of normalizedFridge) {
      if (f.clean === cleanIng) {
        foundInFridge = true;
        break;
      }
      if (f.clean.length >= 4 && (cleanIng.includes(f.clean) || f.clean.includes(cleanIng))) {
        foundInFridge = true;
        break;
      }
      const tokenMatch = ingTokens.some((t) => f.clean.includes(t));
      if (tokenMatch) {
        foundInFridge = true;
        break;
      }
    }

    const estimatedItemPrice = computeCulinaryPortionCost(
      ing.name,
      ing.amount || 100,
      ing.unit || 'g',
      marketPricesMap
    );

    if (foundInFridge) {
      matchedItems.push({ ...ing, inFridge: true, estimatedPrice: estimatedItemPrice });
      fridgeSavings += estimatedItemPrice;
    } else {
      missingItems.push({ ...ing, inFridge: false, estimatedPrice: estimatedItemPrice });
      missingCost += estimatedItemPrice;
    }
  }

  const totalCount = ingredients.length;
  const matchedCount = matchedItems.length;
  const matchPct = totalCount > 0 ? Math.round((matchedCount / totalCount) * 100) : 0;

  let status = 'low';
  let badgeText = '🛒 Insumos a comprar';
  let badgeColor = 'slate';

  if (matchPct >= 75) {
    status = 'high';
    badgeText = `🔥 ${matchPct}% na geladeira • Falta só R$ ${missingCost.toFixed(2)}`;
    badgeColor = 'emerald';
  } else if (matchPct >= 40) {
    status = 'medium';
    badgeText = `🧊 ${matchPct}% na geladeira • Faltam R$ ${missingCost.toFixed(2)}`;
    badgeColor = 'sky';
  } else if (matchPct > 0) {
    badgeText = `🌱 ${matchPct}% na geladeira • Faltam R$ ${missingCost.toFixed(2)}`;
    badgeColor = 'slate';
  }

  return {
    matchedCount,
    totalCount,
    matchPct,
    matchedItems,
    missingItems,
    missingCost: Number(missingCost.toFixed(2)),
    fridgeSavings: Number(fridgeSavings.toFixed(2)),
    status,
    badgeText,
    badgeColor,
  };
}

// ============================================================================
// ENRIQUECIMENTO E ORDENAÇÃO DINÂMICA DO DECK DE SUGESTÕES
// ============================================================================
export function enrichAndRankSuggestions(
  pool = [],
  fridgeItems = [],
  tasteProfile = null,
  marketPricesMap = new Map(),
  todayKey = ''
) {
  const enriched = pool.map((sug) => {
    const calculatedBaseCost = (sug.ingredients || []).reduce((acc, ing) => {
      return (
        acc +
        computeCulinaryPortionCost(ing.name, ing.amount || 100, ing.unit || 'g', marketPricesMap)
      );
    }, 0);
    const servings = Math.max(1, Number(sug.servings) || 1);
    const calculatedCostPerServing = calculatedBaseCost / servings;

    const fridgeMatch = computeFridgeMatch(sug.ingredients || [], fridgeItems, marketPricesMap);
    const affinity = scoreSuggestionAffinity(sug, tasteProfile);

    const seed = (sug.id || '')
      .split('')
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const jitter = seed % 10;

    const compositeScore =
      fridgeMatch.matchPct * 0.45 +
      affinity.affinityPct * 0.40 +
      jitter * 1.5;

    return {
      ...sug,
      baseCost: Number(calculatedBaseCost.toFixed(2)),
      costPerServing: Number(calculatedCostPerServing.toFixed(2)),
      fridgeMatch,
      affinity,
      compositeScore,
    };
  });

  enriched.sort((a, b) => b.compositeScore - a.compositeScore);
  return enriched;
}
