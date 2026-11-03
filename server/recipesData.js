/**
 * Catálogo Oficial de Fichas Técnicas & Receitas do NeatEat Brasil
 * Padrão Gastronômico com Títulos Curtos, Seções, Passos Operacionais Detalhados,
 * Fotos Individuais por Passo e Foco em Saúde e Qualidade (Inclui Aliados Tirzepatida / Mounjaro)
 */

export const INITIAL_RECIPES = [
  {
    "id": "rec-1",
    "title": "Crepioca com Queijo Coalho",
    "category": "Café da Manhã",
    "prepTime": 10,
    "servings": 1,
    "calories": 320,
    "protein": 24,
    "carbs": 24,
    "fat": 13,
    "tags": [
      "Tirzepatida",
      "Alta Proteína",
      "Rápido",
      "Sem Glúten",
      "Vegetariano",
      "Econômico",
      "Passo a Passo com Fotos"
    ],
    "image": "/dishes/rec-1.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "210g por porção",
    "platingInstructions": "Dobrar a crepioca em meia-lua no centro de um prato raso branco aquecido, deixando o queijo coalho levemente gratinado visível na borda. Finalizar com orégano fresco polvilhado e fio leve de azeite.",
    "specificInstructions": "Utilizar frigideira antiaderente de 20cm em fogo médio-baixo para não ressecar a massa. Consumir imediatamente após o preparo.",
    "sections": [
      {
        "name": "Massa e Emulsão",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Recheio e Dobra",
        "stepRange": [
          3,
          5
        ]
      }
    ],
    "chefTips": {
      "intro": "Você pode substituir o queijo coalho por ricota temperada ou queijo minas padrão, reduzindo gorduras saturadas sem perder a cremosidade.",
      "storage": "A crepioca pronta deve ser consumida imediatamente. A mistura líquida de ovos com goma pode ser guardada na geladeira em pote fechado por até 24 horas.",
      "secret": "O segredo da crepioca macia e flexível é usar fogo brando e tampar a frigideira por 45 segundos logo após despejar a massa para que o vapor asse o centro por igual."
    },
    "ingredients": [
      {
        "section": "Massa",
        "name": "Goma de tapioca",
        "amount": 40,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 0.95
      },
      {
        "section": "Massa",
        "name": "Ovo",
        "amount": 2,
        "unit": "un",
        "aisle": "Laticínios e Ovos",
        "basePrice": 1.8
      },
      {
        "section": "Recheio",
        "name": "Queijo coalho ou minas",
        "amount": 40,
        "unit": "g",
        "aisle": "Laticínios e Ovos",
        "basePrice": 2.4
      },
      {
        "section": "Recheio",
        "name": "Tomate",
        "amount": 50,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 0.65
      },
      {
        "section": "Recheio",
        "name": "Orégano",
        "amount": 2,
        "unit": "g",
        "aisle": "Temperos",
        "basePrice": 0.15
      }
    ],
    "steps": [
      "Pese os 40g de goma de tapioca e separe os 2 ovos frescos, o queijo coalho em cubos ou fatias e o tomate sem sementes.",
      "Quebre os 2 ovos em uma tigela média, adicione uma pitada de sal fino e a goma de tapioca, batendo com garfo ou fouet por 1 minuto até formar emulsão homogênea e sem grumos.",
      "Aqueça uma frigideira antiaderente untada com gotas de azeite em fogo médio-baixo e despeje toda a massa cobrindo o fundo.",
      "Tampe a frigideira por 45 segundos até a massa firmar o centro e soltar das bordas sem queimar.",
      "Distribua o queijo coalho e os cubinhos de tomate em uma das metades, dobre em meia-lua e pressione por 1 minuto para fundir o queijo."
    ],
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place",
        "text": "Pese os 40g de goma de tapioca e separe os 2 ovos frescos, o queijo coalho em cubos ou fatias e o tomate sem sementes.",
        "image": "/dishes/steps/crepioca/step-2.webp",
        "alt": "Insumos medidos na bancada para a crepioca.",
        "tip": "Tirar as sementes do tomate evita umidade excessiva na massa.",
        "isKeyFrame": true,
        "timerSeconds": 60
      },
      {
        "stepNumber": 2,
        "section": "Massa e Emulsão",
        "text": "Quebre os 2 ovos em uma tigela média, adicione uma pitada de sal fino e a goma de tapioca, batendo com garfo ou fouet por 1 minuto até formar emulsão homogênea e sem grumos.",
        "image": "/dishes/steps/crepioca/step-2.webp",
        "alt": "Massa líquida de ovo, goma de tapioca e sal batida até ficar homogênea.",
        "tip": "Bater bem incorpora ar, tornando a crepioca mais fofinha e leve.",
        "isKeyFrame": false,
        "timerSeconds": 60
      },
      {
        "stepNumber": 3,
        "section": "Cocção em Fogo Brando",
        "text": "Aqueça uma frigideira antiaderente untada com gotas de azeite em fogo médio-baixo e despeje toda a massa cobrindo o fundo.",
        "image": "/dishes/steps/crepioca/step-3.webp",
        "alt": "Frigideira antiaderente untada com a massa da crepioca espalhada no fundo.",
        "tip": "A frigideira não pode estar excessivamente quente para não queimar o fundo antes de cozinhar por cima.",
        "isKeyFrame": false,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Abafamento a Vapor",
        "text": "Tampe a frigideira por 45 segundos até a massa firmar o centro e soltar das bordas sem queimar.",
        "image": "/dishes/steps/crepioca/step-4.webp",
        "alt": "Frigideira tampada para o vapor assar o centro da crepioca por igual.",
        "tip": "O vapor interno é o segredo para a textura elástica e macia sem ressecar.",
        "isKeyFrame": true,
        "timerSeconds": 45
      },
      {
        "stepNumber": 5,
        "section": "Recheio e Dobra",
        "text": "Distribua o queijo coalho e os cubinhos de tomate em uma das metades, dobre em meia-lua e pressione por 1 minuto para fundir o queijo.",
        "image": "/dishes/steps/crepioca/step-5.webp",
        "alt": "Crepioca dobrada em meia-lua dourada com queijo fundido pronta para servir.",
        "tip": "Pressione levemente com uma espátula de silicone para selar as bordas.",
        "isKeyFrame": true,
        "timerSeconds": 60
      }
    ]
  },
  {
    "id": "rec-2",
    "title": "Overnight Oats de Banana",
    "category": "Café da Manhã",
    "prepTime": 5,
    "servings": 1,
    "calories": 360,
    "protein": 22,
    "carbs": 48,
    "fat": 9,
    "tags": [
      "Tirzepatida",
      "Alta Proteína",
      "Vegetariano",
      "Econômico",
      "Rápido",
      "Meal Prep",
      "Passo a Passo com Fotos"
    ],
    "image": "/dishes/rec-2.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "280g por porção",
    "platingInstructions": "Servir diretamente no pote de vidro hermético ou em taça de sobremesa com as rodelas de banana e chia decorando o topo.",
    "specificInstructions": "Deixar refrigerando por pelo menos 4 horas (idealmente 8 horas durante a noite) para hidratação perfeita da aveia.",
    "sections": [
      {
        "name": "Base e Mistura",
        "stepRange": [
          1,
          3
        ]
      },
      {
        "name": "Refrigeração e Serviço",
        "stepRange": [
          4,
          5
        ]
      }
    ],
    "chefTips": {
      "intro": "O overnight oats é a preparação perfeita para meal prep semanal, economizando tempo nas manhãs corridas.",
      "storage": "Conservar na geladeira em pote fechado por até 4 dias.",
      "secret": "A semente de chia cria um gel natural que confere a consistência idêntica à de um pudim artesanal."
    },
    "ingredients": [
      {
        "section": "Base",
        "name": "Aveia em flocos finos",
        "amount": 40,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 0.6
      },
      {
        "section": "Base",
        "name": "Leite desnatado ou vegetal",
        "amount": 120,
        "unit": "ml",
        "aisle": "Laticínios e Ovos",
        "basePrice": 0.8
      },
      {
        "section": "Base",
        "name": "Iogurte natural desnatado",
        "amount": 80,
        "unit": "g",
        "aisle": "Laticínios e Ovos",
        "basePrice": 1.5
      },
      {
        "section": "Topo",
        "name": "Banana madura fatiada",
        "amount": 80,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 0.6
      },
      {
        "section": "Topo",
        "name": "Sementes de chia e canela",
        "amount": 10,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 0.4
      }
    ],
    "steps": [
      "Em um pote de vidro de 350ml, coloque os 40g de aveia em flocos e 1 colher de sementes de chia.",
      "Despeje os 120ml de leite e adicione os 80g de iogurte natural desnatado com uma pitada de canela em pó.",
      "Misture vigorosamente com uma colher até que todos os flocos de aveia estejam embebidos no líquido cremoso.",
      "Acomode metade das rodelas de banana sobre a mistura, feche o pote hermeticamente e leve à geladeira por no mínimo 4 horas.",
      "Pela manhã, abra o pote, finalize com o restante da banana fresca fatiada e uma pitada extra de canela antes de servir."
    ],
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place Secos",
        "text": "Em um pote de vidro de 350ml, coloque os 40g de aveia em flocos e 1 colher de sementes de chia.",
        "image": "/dishes/steps/overnight-oats/step-1.webp",
        "alt": "Pote de vidro com aveia e chia.",
        "tip": "A chia garante absorção completa e fibras solúveis benéficas.",
        "isKeyFrame": true,
        "timerSeconds": 30
      },
      {
        "stepNumber": 2,
        "section": "Adição de Líquidos",
        "text": "Despeje os 120ml de leite e adicione os 80g de iogurte natural desnatado com uma pitada de canela em pó.",
        "image": "/dishes/steps/overnight-oats/step-2.webp",
        "alt": "Leite e iogurte adicionados ao pote.",
        "tip": "Usar iogurte desnatado aumenta a proteína sem gordura excessiva.",
        "isKeyFrame": false,
        "timerSeconds": 30
      },
      {
        "stepNumber": 3,
        "section": "Emulsão & Hidratação",
        "text": "Misture vigorosamente com uma colher até que todos os flocos de aveia estejam embebidos no líquido cremoso.",
        "image": "/dishes/steps/overnight-oats/step-3.webp",
        "alt": "Mistura homogênea de aveia, chia, leite e iogurte.",
        "tip": "Raspe o fundo para não deixar aveia seca acumulada.",
        "isKeyFrame": true,
        "timerSeconds": 45
      },
      {
        "stepNumber": 4,
        "section": "Refrigeração Noturna",
        "text": "Acomode metade das rodelas de banana sobre a mistura, feche o pote hermeticamente e leve à geladeira por no mínimo 4 horas.",
        "image": "/dishes/steps/overnight-oats/step-4.webp",
        "alt": "Pote fechado pronto para repouso na geladeira.",
        "tip": "O repouso de 8 horas extrai a cremosidade máxima.",
        "isKeyFrame": false,
        "timerSeconds": 60
      },
      {
        "stepNumber": 5,
        "section": "Finalização & Serviço",
        "text": "Pela manhã, abra o pote, finalize com o restante da banana fresca fatiada e uma pitada extra de canela antes de servir.",
        "image": "/dishes/steps/overnight-oats/step-5.webp",
        "alt": "Overnight oats cremoso com banana fresca por cima pronto para consumo.",
        "tip": "Consuma gelado ou deixe 5 minutos em temperatura ambiente.",
        "isKeyFrame": true,
        "timerSeconds": 30
      }
    ]
  },
  {
    "id": "rec-3",
    "title": "Ovos Mexidos com Pão Francês",
    "category": "Café da Manhã",
    "prepTime": 10,
    "servings": 1,
    "calories": 310,
    "protein": 21,
    "carbs": 28,
    "fat": 13,
    "tags": [
      "Tirzepatida",
      "Alta Proteína",
      "Vegetariano",
      "Econômico",
      "Rápido",
      "Clássico",
      "Passo a Passo com Fotos"
    ],
    "image": "/dishes/rec-3.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "250g por porção",
    "platingInstructions": "Dispor o pão tostado dourado ao centro, os ovos mexidos aveludados e brilhantes por cima e as fatias de mamão fresco ao lado.",
    "specificInstructions": "Ovos mexidos de hotel exigem controle de calor brando: nunca cozinhe em fogo alto.",
    "sections": [
      {
        "name": "Mise en Place & Tostagem",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Cocção Lenta dos Ovos",
        "stepRange": [
          3,
          4
        ]
      },
      {
        "name": "Finalização & Empratamento",
        "stepRange": [
          5,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "Ovos mexidos de padrão hoteleiro internacional baseiam-se na coagulação lenta das proteínas do ovo sem ressecar.",
      "storage": "Prepare e sirva imediatamente.",
      "secret": "Tire a frigideira do fogo 30 segundos antes do ponto final: o calor residual atinge a textura cremosa perfeita."
    },
    "ingredients": [
      {
        "section": "Ovos",
        "name": "Ovo",
        "amount": 3,
        "unit": "un",
        "aisle": "Laticínios e Ovos",
        "basePrice": 2.7
      },
      {
        "section": "Ovos",
        "name": "Manteiga",
        "amount": 10,
        "unit": "g",
        "aisle": "Laticínios e Ovos",
        "basePrice": 0.8
      },
      {
        "section": "Acompanhamento",
        "name": "Pão francês",
        "amount": 1,
        "unit": "un",
        "aisle": "Padaria",
        "basePrice": 0.9
      },
      {
        "section": "Acompanhamento",
        "name": "Mamão formosa",
        "amount": 100,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 1.2
      },
      {
        "section": "Ovos",
        "name": "Sal refinado",
        "amount": 2,
        "unit": "g",
        "aisle": "Temperos",
        "basePrice": 0.1
      }
    ],
    "steps": [
      "Separe 3 ovos frescos, 10g de manteiga de qualidade, 1 pão francês fresco e 100g de mamão formosa fatiado.",
      "Corte o pão francês ao meio e toste a face interna na frigideira quente com uma ponta de manteiga até ficar dourado e crocante.",
      "Quebre os 3 ovos em uma tigela funda, tempere com sal fino e bata suavemente com um garfo por 20 segundos apenas para romper as gemas sem aerar.",
      "Em frigideira antiaderente em fogo bem baixo, derreta a manteiga e despeje os ovos batidos.",
      "Com uma espátula de silicone, faça movimentos circulares lentos das bordas para o centro, cozinhando em fogo brando até formar dobras aveludadas.",
      "Retire da frigideira quando os ovos ainda estiverem ligeiramente úmidos e sirva sobre o pão tostado acompanhado de mamão fresco."
    ],
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Cortes",
        "text": "Separe 3 ovos frescos, 10g de manteiga de qualidade, 1 pão francês fresco e 100g de mamão formosa fatiado.",
        "image": "/dishes/steps/ovos-mexidos/step-2.webp",
        "alt": "Ingredientes organizados na bancada.",
        "tip": "Usar ovos em temperatura ambiente garante coagulação uniforme.",
        "isKeyFrame": true,
        "timerSeconds": 60
      },
      {
        "stepNumber": 2,
        "section": "Tostagem do Pão",
        "text": "Corte o pão francês ao meio e toste a face interna na frigideira quente com uma ponta de manteiga até ficar dourado e crocante.",
        "image": "/dishes/steps/ovos-mexidos/step-6.webp",
        "alt": "Pão francês tostado dourado.",
        "tip": "A casca crocante sustenta a umidade dos ovos sem amolecer.",
        "isKeyFrame": false,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Batimento Suave",
        "text": "Quebre os 3 ovos em uma tigela funda, tempere com sal fino e bata suavemente com um garfo por 20 segundos apenas para romper as gemas sem aerar.",
        "image": "/dishes/steps/ovos-mexidos/step-2.webp",
        "alt": "Ovos batidos suavemente na tigela.",
        "tip": "Não bata excessivamente para não criar bolhas de ar grandes.",
        "isKeyFrame": true,
        "timerSeconds": 30
      },
      {
        "stepNumber": 4,
        "section": "Cocção Lenta",
        "text": "Em frigideira antiaderente em fogo bem baixo, derreta a manteiga e despeje os ovos batidos.",
        "image": "/dishes/steps/ovos-mexidos/step-4.webp",
        "alt": "Ovos cozinhando lentamente em fogo baixo.",
        "tip": "O fogo deve ser o mais baixo possível do fogão.",
        "isKeyFrame": false,
        "timerSeconds": 150
      },
      {
        "stepNumber": 5,
        "section": "Movimentos em Espiral",
        "text": "Com uma espátula de silicone, faça movimentos circulares lentos das bordas para o centro, cozinhando em fogo brando até formar dobras aveludadas.",
        "image": "/dishes/steps/ovos-mexidos/step-4.webp",
        "alt": "Espátula formando ondas aveludadas nos ovos.",
        "tip": "Se a panela chiar alto, levante-a por 5 segundos para esfriar.",
        "isKeyFrame": true,
        "timerSeconds": 90
      },
      {
        "stepNumber": 6,
        "section": "Empratamento Imediato",
        "text": "Retire da frigideira quando os ovos ainda estiverem ligeiramente úmidos e sirva sobre o pão tostado acompanhado de mamão fresco.",
        "image": "/dishes/steps/ovos-mexidos/step-6.webp",
        "alt": "Ovos mexidos cremosos servidos sobre o pão com mamão ao lado.",
        "tip": "Sirva em prato morno para manter a temperatura ideal.",
        "isKeyFrame": true,
        "timerSeconds": 30
      }
    ]
  },
  {
    "id": "rec-4",
    "title": "Cuscuz com Ovo Estrelado",
    "category": "Café da Manhã",
    "prepTime": 18,
    "servings": 1,
    "calories": 340,
    "protein": 16,
    "carbs": 46,
    "fat": 10,
    "tags": [
      "Econômico",
      "Regional",
      "Rápido",
      "Vegetariano",
      "Passo a Passo com Fotos"
    ],
    "image": "/dishes/rec-4.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "260g por porção",
    "platingInstructions": "Desenformar o cuscuz no centro do prato, acomodar o ovo estrelado com gema mole no topo e finalizar com cheiro-verde fresco e fio de azeite.",
    "specificInstructions": "Respeitar os 10 minutos de hidratação do flocão antes de levar ao fogo para garantir textura macia e fofa.",
    "sections": [
      {
        "name": "Hidratação e Cozimento do Cuscuz",
        "stepRange": [
          1,
          3
        ]
      },
      {
        "name": "Ovo Estrelado e Montagem",
        "stepRange": [
          4,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "O cuscuz de milho é um dos carboidratos mais limpos, econômicos e versáteis da culinária brasileira.",
      "storage": "O cuscuz cozido dura até 3 dias na geladeira em pote hermético.",
      "secret": "O segredo do cuscuz fofo é nunca apertar a massa ao colocar na cuscuzeira: acomode com a colher suavemente."
    },
    "ingredients": [
      {
        "section": "Cuscuz",
        "name": "Flocão de milho",
        "amount": 80,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 0.7
      },
      {
        "section": "Cuscuz",
        "name": "Água filtrada",
        "amount": 60,
        "unit": "ml",
        "aisle": "Mercearia",
        "basePrice": 0.1
      },
      {
        "section": "Cuscuz",
        "name": "Sal refinado",
        "amount": 2,
        "unit": "g",
        "aisle": "Temperos",
        "basePrice": 0.1
      },
      {
        "section": "Topo",
        "name": "Ovo",
        "amount": 2,
        "unit": "un",
        "aisle": "Laticínios e Ovos",
        "basePrice": 1.8
      },
      {
        "section": "Topo",
        "name": "Azeite de oliva",
        "amount": 10,
        "unit": "ml",
        "aisle": "Mercearia",
        "basePrice": 0.6
      },
      {
        "section": "Finalização",
        "name": "Cheiro-verde ou coentro",
        "amount": 10,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 0.4
      }
    ],
    "steps": [
      "Meça 80g de flocão de milho, 60ml de água filtrada, uma pitada de sal marinho, 2 ovos frescos e cheiro-verde picado.",
      "Em uma tigela de cerâmica, regue o flocão de milho com a água e o sal, misturando com as pontas dos dedos até obter textura de areia de praia úmida.",
      "Cubra a tigela com um pano limpo e deixe o flocão descansar por 10 minutos para absorver todo o líquido e hidratar as fibras.",
      "Adicione água no compartimento inferior da cuscuzeira e transfira a massa com colher, acomodando sem compactar.",
      "Tampe e leve ao fogo médio por 8 minutos até subir o aroma perfumado e a massa firmar fofa e macia.",
      "Frite os ovos em frigideira com fio de azeite deixando a gema mole, desenforme o cuscuz no prato e monte os ovos por cima com cheiro-verde."
    ],
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place",
        "text": "Meça 80g de flocão de milho, 60ml de água filtrada, uma pitada de sal marinho, 2 ovos frescos e cheiro-verde picado.",
        "image": "/dishes/steps/cuscuz/step-2.webp",
        "alt": "Insumos pesados para o cuscuz.",
        "tip": "Usar água em temperatura ambiente para hidratar.",
        "isKeyFrame": true,
        "timerSeconds": 60
      },
      {
        "stepNumber": 2,
        "section": "Hidratação dos Grânulos",
        "text": "Em uma tigela de cerâmica, regue o flocão de milho com a água e o sal, misturando com as pontas dos dedos até obter textura de areia de praia úmida.",
        "image": "/dishes/steps/cuscuz/step-2.webp",
        "alt": "Flocão de milho umedecido.",
        "tip": "A textura deve soltar facilmente dos dedos.",
        "isKeyFrame": false,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Descanso e Expansão",
        "text": "Cubra a tigela com um pano limpo e deixe o flocão descansar por 10 minutos para absorver todo o líquido e hidratar as fibras.",
        "image": "/dishes/steps/cuscuz/step-2.webp",
        "alt": "Tigela descansando coberta.",
        "tip": "O descanso evita que o cuscuz fique ressecado.",
        "isKeyFrame": true,
        "timerSeconds": 600
      },
      {
        "stepNumber": 4,
        "section": "Montagem na Cuscuzeira",
        "text": "Adicione água no compartimento inferior da cuscuzeira e transfira a massa com colher, acomodando sem compactar.",
        "image": "/dishes/steps/cuscuz/step-5.webp",
        "alt": "Massa acomodada na cuscuzeira.",
        "tip": "Não pressione para o vapor circular livremente.",
        "isKeyFrame": false,
        "timerSeconds": 60
      },
      {
        "stepNumber": 5,
        "section": "Cocção a Vapor",
        "text": "Tampe e leve ao fogo médio por 8 minutos até subir o aroma perfumado e a massa firmar fofa e macia.",
        "image": "/dishes/steps/cuscuz/step-5.webp",
        "alt": "Cuscuz cozinhando no vapor.",
        "tip": "O aroma perfumado de milho indica que está pronto.",
        "isKeyFrame": true,
        "timerSeconds": 480
      },
      {
        "stepNumber": 6,
        "section": "Ovos Estrelados & Serviço",
        "text": "Frite os ovos em frigideira com fio de azeite deixando a gema mole, desenforme o cuscuz no prato e monte os ovos por cima com cheiro-verde.",
        "image": "/dishes/steps/cuscuz/step-6.webp",
        "alt": "Cuscuz servido com ovos estrelados e coentro fresco.",
        "tip": "A gema cremosa se mistura ao cuscuz quente.",
        "isKeyFrame": true,
        "timerSeconds": 180
      }
    ]
  },
  {
    "id": "rec-5",
    "title": "PF de Frango Grelhado",
    "category": "Almoço",
    "prepTime": 25,
    "servings": 2,
    "calories": 490,
    "protein": 42,
    "carbs": 52,
    "fat": 11,
    "tags": [
      "Tirzepatida",
      "Alta Proteína",
      "Equilibrado",
      "Clássico Brasileiro",
      "Econômico",
      "Passo a Passo com Fotos"
    ],
    "image": "/dishes/rec-5.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "420g por porção",
    "platingInstructions": "Disposição tradicional brasileira: arroz branco soltinho, feijão carioca cremoso, filé de frango fatiado no centro e salada fresca temperada.",
    "specificInstructions": "Grelhar o frango em frigideira bem quente para criar crosta dourada saborosa mantendo suculência interna.",
    "sections": [
      {
        "name": "Mise en Place & Marinada",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Grelhado Perfeito",
        "stepRange": [
          3,
          5
        ]
      },
      {
        "name": "Montagem do Prato Feito",
        "stepRange": [
          6,
          7
        ]
      }
    ],
    "chefTips": {
      "intro": "O Prato Feito brasileiro é nutricionalmente perfeito: proteína magra, carboidrato complexo e feijão com aminoácidos complementares.",
      "storage": "O frango grelhado e o feijão duram 3 dias refrigerados em potes separados.",
      "secret": "Deixar o filé de frango descansar 2 minutos na tábua antes de cortar retém todos os sucos internos."
    },
    "ingredients": [
      {
        "section": "Frango",
        "name": "Peito de frango em filés",
        "amount": 300,
        "unit": "g",
        "aisle": "Açougue",
        "basePrice": 6.9
      },
      {
        "section": "Base",
        "name": "Arroz branco cozido",
        "amount": 150,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 1.2
      },
      {
        "section": "Base",
        "name": "Feijão carioca cozido",
        "amount": 150,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 1.4
      },
      {
        "section": "Salada",
        "name": "Alface e tomate frescos",
        "amount": 100,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 1.1
      },
      {
        "section": "Tempero",
        "name": "Alho, limão e azeite",
        "amount": 15,
        "unit": "ml",
        "aisle": "Mercearia",
        "basePrice": 0.8
      }
    ],
    "steps": [
      "Limpe e corte 300g de peito de frango em filés médios uniformes. Pique 2 dentes de alho e esprema o suco de meio limão fresco.",
      "Tempere os filés com alho picado, suco de limão, sal refinado e pimenta-do-reino moída na hora, deixando tomar gosto por 5 minutos.",
      "Aqueça uma frigideira de fundo grosso com 10ml de azeite em fogo médio-alto até começar a estalar suavemente.",
      "Acomode os filés na frigideira sem sobrepor e grelhe por 3 a 4 minutos sem mexer para formar crosta dourada saborosa.",
      "Vire os filés e doure o outro lado por mais 3 minutos até atingir 74°C no centro, garantindo máxima suculência.",
      "Aqueça o arroz branco soltinho e o feijão carioca com caldo denso em panelas separadas.",
      "Monte o prato clássico: arroz branco em um terço, feijão ao lado, filé grelhado fatiado e salada fresca de alface e tomate temperada na hora."
    ],
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place",
        "text": "Limpe e corte 300g de peito de frango em filés médios uniformes. Pique 2 dentes de alho e esprema o suco de meio limão fresco.",
        "image": "/dishes/steps/pf-frango/step-1.webp",
        "alt": "Filés de frango e temperos preparados.",
        "tip": "Filés com espessura homogênea cozinham no mesmo tempo.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Marinada Rápida",
        "text": "Tempere os filés com alho picado, suco de limão, sal refinado e pimenta-do-reino moída na hora, deixando tomar gosto por 5 minutos.",
        "image": "/dishes/steps/pf-frango/step-1.webp",
        "alt": "Filés marinando com alho e limão.",
        "tip": "O limão amacia as fibras e confere frescor.",
        "isKeyFrame": false,
        "timerSeconds": 300
      },
      {
        "stepNumber": 3,
        "section": "Aquecimento da Frigideira",
        "text": "Aqueça uma frigideira de fundo grosso com 10ml de azeite em fogo médio-alto até começar a estalar suavemente.",
        "image": "/dishes/steps/pf-frango/step-2.webp",
        "alt": "Frigideira aquecendo com azeite.",
        "tip": "A frigideira deve chiar assim que o frango encostar.",
        "isKeyFrame": false,
        "timerSeconds": 60
      },
      {
        "stepNumber": 4,
        "section": "Selagem em Alta Temperatura",
        "text": "Acomode os filés na frigideira sem sobrepor e grelhe por 3 a 4 minutos sem mexer para formar crosta dourada saborosa.",
        "image": "/dishes/steps/pf-frango/step-2.webp",
        "alt": "Filés de frango dourando na frigideira quente.",
        "tip": "Não mexa nos primeiros minutos para criar a crosta dourada.",
        "isKeyFrame": true,
        "timerSeconds": 240
      },
      {
        "stepNumber": 5,
        "section": "Ponto Suculento",
        "text": "Vire os filés e doure o outro lado por mais 3 minutos até atingir 74°C no centro, garantindo máxima suculência.",
        "image": "/dishes/steps/pf-frango/step-2.webp",
        "alt": "Filés virados com crosta dourada perfeita.",
        "tip": "Deixe descansar 2 minutos antes de fatiar para não perder líquido.",
        "isKeyFrame": true,
        "timerSeconds": 180
      },
      {
        "stepNumber": 6,
        "section": "Aquecimento da Base",
        "text": "Aqueça o arroz branco soltinho e o feijão carioca com caldo denso em panelas separadas.",
        "image": "/dishes/steps/pf-frango/step-3.webp",
        "alt": "Arroz e feijão aquecendo fumegantes.",
        "tip": "Um feijão com caldo espesso une todo o prato feito.",
        "isKeyFrame": false,
        "timerSeconds": 120
      },
      {
        "stepNumber": 7,
        "section": "Montagem do Prato Feito",
        "text": "Monte o prato clássico: arroz branco em um terço, feijão ao lado, filé grelhado fatiado e salada fresca de alface e tomate temperada na hora.",
        "image": "/dishes/steps/pf-frango/step-3.webp",
        "alt": "PF clássico montado harmoniosamente no prato.",
        "tip": "Sirva com folhas frescas bem secas e temperadas com azeite e flor de sal.",
        "isKeyFrame": true,
        "timerSeconds": 60
      }
    ]
  },
  {
    "id": "rec-6",
    "title": "Picadinho com Abóbora",
    "category": "Almoço",
    "prepTime": 30,
    "servings": 2,
    "calories": 460,
    "protein": 36,
    "carbs": 45,
    "fat": 14,
    "tags": [
      "Alta Proteína",
      "Rico em Fibras",
      "Econômico",
      "Conforto",
      "Passo a Passo com Fotos"
    ],
    "image": "/dishes/rec-6.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "400g por porção",
    "platingInstructions": "Dispor a carne refogada avermelhada com os cubos macios de abóbora sobre o arroz integral com cheiro-verde.",
    "specificInstructions": "Cozinhar a abóbora até ficar macia na ponta do garfo sem desmanchar.",
    "sections": [
      {
        "name": "Preparo dos Insumos",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Refogado e Cocção da Carne",
        "stepRange": [
          3,
          4
        ]
      },
      {
        "name": "Finalização e Serviço",
        "stepRange": [
          5,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "A abóbora cabotiá adiciona dulçor natural, fibras solúveis e betacaroteno ao picadinho de carne.",
      "storage": "Dura 3 dias na geladeira em pote fechado ou até 30 dias congelado.",
      "secret": "Selar bem a carne moída até secar a água e dourar garante molho escuro e rico."
    },
    "ingredients": [
      {
        "section": "Carne",
        "name": "Carne moída (acém ou patinho)",
        "amount": 300,
        "unit": "g",
        "aisle": "Açougue",
        "basePrice": 7.8
      },
      {
        "section": "Legumes",
        "name": "Abóbora cabotiá em cubos",
        "amount": 200,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 1.6
      },
      {
        "section": "Base",
        "name": "Arroz integral cozido",
        "amount": 160,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 1.4
      },
      {
        "section": "Aromáticos",
        "name": "Cebola, alho e tomate",
        "amount": 80,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 0.9
      },
      {
        "section": "Finalização",
        "name": "Cheiro-verde picado",
        "amount": 15,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 0.35
      }
    ],
    "steps": [
      "Descasque e corte 200g de abóbora cabotiá em cubos médios de 2 cm. Pique cebola, alho e cheiro-verde.",
      "Aqueça uma panela funda com azeite em fogo alto e refogue a carne moída temperada com sal e pimenta até secar o líquido.",
      "Junte a cebola picada e o alho amassado à carne dourada, refogando por 2 minutos até ficarem translúcidos.",
      "Adicione os cubos de abóbora, 1 colher de extrato de tomate e 150ml de água fervente.",
      "Abaixe o fogo, tampe a panela e cozinhe por 12 a 15 minutos até a abóbora amaciar e o molho reduzir encorpado.",
      "Acerte o sal, salpique cheiro-verde fresco picado e sirva fumegante com arroz integral soltinho."
    ],
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place",
        "text": "Descasque e corte 200g de abóbora cabotiá em cubos médios de 2 cm. Pique cebola, alho e cheiro-verde.",
        "image": "/dishes/rec-6.jpg",
        "alt": "Abóbora em cubos e temperos picados.",
        "tip": "Cortar a abóbora em cubos uniformes garante cozimento igual.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Selagem da Carne",
        "text": "Aqueça uma panela funda com azeite em fogo alto e refogue a carne moída temperada com sal e pimenta até secar o líquido.",
        "image": "/dishes/rec-6.jpg",
        "alt": "Carne moída dourando na panela.",
        "tip": "Deixe secar todo o líquido para caramelizar os açúcares da carne.",
        "isKeyFrame": false,
        "timerSeconds": 300
      },
      {
        "stepNumber": 3,
        "section": "Refogado Aromático",
        "text": "Junte a cebola picada e o alho amassado à carne dourada, refogando por 2 minutos até ficarem translúcidos.",
        "image": "/dishes/rec-6.jpg",
        "alt": "Cebola e alho refogando com a carne.",
        "tip": "Refogar no fundo da panela solta os sabores caramelizados.",
        "isKeyFrame": false,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Inclusão da Abóbora",
        "text": "Adicione os cubos de abóbora, 1 colher de extrato de tomate e 150ml de água fervente.",
        "image": "/dishes/rec-6.jpg",
        "alt": "Cubos de abóbora adicionados ao picadinho.",
        "tip": "Use água quente para não interromper a cocção.",
        "isKeyFrame": true,
        "timerSeconds": 60
      },
      {
        "stepNumber": 5,
        "section": "Cocção em Fogo Brando",
        "text": "Abaixe o fogo, tampe a panela e cozinhe por 12 a 15 minutos até a abóbora amaciar e o molho reduzir encorpado.",
        "image": "/dishes/rec-6.jpg",
        "alt": "Picadinho apurando com tampa semiaberta.",
        "tip": "A abóbora deve ficar macia sem virar purê.",
        "isKeyFrame": false,
        "timerSeconds": 720
      },
      {
        "stepNumber": 6,
        "section": "Finalização Fresca",
        "text": "Acerte o sal, salpique cheiro-verde fresco picado e sirva fumegante com arroz integral soltinho.",
        "image": "/dishes/rec-6.jpg",
        "alt": "Prato finalizado com cheiro-verde e arroz integral.",
        "tip": "Colocar o cheiro-verde com o fogo desligado mantém a cor viva.",
        "isKeyFrame": true,
        "timerSeconds": 60
      }
    ]
  },
  {
    "id": "rec-7",
    "title": "Escondidinho de Frango",
    "category": "Almoço",
    "prepTime": 35,
    "servings": 2,
    "calories": 420,
    "protein": 36,
    "carbs": 44,
    "fat": 12,
    "tags": [
      "Tirzepatida",
      "Para Família",
      "Sem Glúten",
      "Conforto",
      "Alta Proteína",
      "Passo a Passo com Fotos"
    ],
    "image": "/dishes/rec-7.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "380g por porção",
    "platingInstructions": "Servir gratinado com queijo dourado em travessa de cerâmica borbulhante e cheiro-verde salpicado.",
    "specificInstructions": "Amassar a mandioca ainda bem quente para garantir purê sedoso e liso.",
    "sections": [
      {
        "name": "Purê de Mandioca",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Refogado de Frango",
        "stepRange": [
          3,
          4
        ]
      },
      {
        "name": "Montagem e Forno",
        "stepRange": [
          5,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "O escondidinho com purê de mandioca e frango desfiado é um ícone reconfortante da cozinha afetiva brasileira.",
      "storage": "Pode ser congelado por até 60 dias montado cru ou já gratinado.",
      "secret": "Um toque de noz-moscada ralada no purê de mandioca eleva o perfil sensorial do prato."
    },
    "ingredients": [
      {
        "section": "Massa",
        "name": "Mandioca cozida",
        "amount": 350,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 2.2
      },
      {
        "section": "Recheio",
        "name": "Peito de frango cozido e desfiado",
        "amount": 260,
        "unit": "g",
        "aisle": "Açougue",
        "basePrice": 5.9
      },
      {
        "section": "Recheio",
        "name": "Molho de tomate caseiro",
        "amount": 100,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 0.9
      },
      {
        "section": "Gratinado",
        "name": "Queijo muçarela ou queijo minas",
        "amount": 40,
        "unit": "g",
        "aisle": "Laticínios e Ovos",
        "basePrice": 2.4
      },
      {
        "section": "Aromáticos",
        "name": "Alho, cebola e azeite",
        "amount": 20,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 0.7
      }
    ],
    "steps": [
      "Cozinhe a mandioca descascada na água com sal por 20 minutos até amaciar totalmente a ponto de desmanchar.",
      "Escorra a mandioca, retire o fio central rígido e passe pelo espremedor ainda quente com 40ml de leite morno até obter purê aveludado.",
      "Em uma panela, aqueça o azeite e refogue cebola e alho picados até dourarem.",
      "Junte o frango desfiado, o molho de tomate, sal e cheiro-verde, cozinhando por 5 minutos até apurar e secar o excesso de líquido.",
      "Em um refratário médio, espalhe todo o frango refogado no fundo e cubra com o purê de mandioca nivelando com as costas da colher.",
      "Polvilhe o queijo ralado por cima e asse em forno a 200°C por 15 minutos até gratinar em crosta dourada."
    ],
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Cozimento da Mandioca",
        "text": "Cozinhe a mandioca descascada na água com sal por 20 minutos até amaciar totalmente a ponto de desmanchar.",
        "image": "/dishes/rec-7.jpg",
        "alt": "Mandioca cozinhando na água fervente.",
        "tip": "A mandioca deve estar muito macia para espremer fácil.",
        "isKeyFrame": true,
        "timerSeconds": 1200
      },
      {
        "stepNumber": 2,
        "section": "Purê Sedoso",
        "text": "Escorra a mandioca, retire o fio central rígido e passe pelo espremedor ainda quente com 40ml de leite morno até obter purê aveludado.",
        "image": "/dishes/rec-7.jpg",
        "alt": "Mandioca espremida com leite morno formando purê liso.",
        "tip": "Retirar o fio central evita fibras duras no purê.",
        "isKeyFrame": true,
        "timerSeconds": 180
      },
      {
        "stepNumber": 3,
        "section": "Refogado Aromático",
        "text": "Em uma panela, aqueça o azeite e refogue cebola e alho picados até dourarem.",
        "image": "/dishes/rec-7.jpg",
        "alt": "Alho e cebola dourando no azeite.",
        "tip": "Deixe o alho dourar sem queimar para dar aroma.",
        "isKeyFrame": false,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Recheio de Frango Suculento",
        "text": "Junte o frango desfiado, o molho de tomate, sal e cheiro-verde, cozinhando por 5 minutos até apurar e secar o excesso de líquido.",
        "image": "/dishes/rec-7.jpg",
        "alt": "Frango desfiado refogado no molho de tomate.",
        "tip": "O recheio deve ficar úmido, mas sem caldo líquido solto.",
        "isKeyFrame": true,
        "timerSeconds": 300
      },
      {
        "stepNumber": 5,
        "section": "Montagem em Camadas",
        "text": "Em um refratário médio, espalhe todo o frango refogado no fundo e cubra com o purê de mandioca nivelando com as costas da colher.",
        "image": "/dishes/rec-7.jpg",
        "alt": "Purê de mandioca cobrindo o recheio de frango no refratário.",
        "tip": "Alise com as costas de uma colher molhada para acabamento plano.",
        "isKeyFrame": false,
        "timerSeconds": 120
      },
      {
        "stepNumber": 6,
        "section": "Gratinado ao Forno",
        "text": "Polvilhe o queijo ralado por cima e asse em forno a 200°C por 15 minutos até gratinar em crosta dourada.",
        "image": "/dishes/rec-7.jpg",
        "alt": "Escondidinho dourado gratinado com queijo borbulhante.",
        "tip": "Ligue o grill nos últimos 3 minutos para tostar o queijo.",
        "isKeyFrame": true,
        "timerSeconds": 900
      }
    ]
  },
  {
    "id": "rec-8",
    "title": "Strogonoff de Grão-de-Bico",
    "category": "Almoço",
    "prepTime": 25,
    "servings": 2,
    "calories": 390,
    "protein": 17,
    "carbs": 46,
    "fat": 14,
    "tags": [
      "Vegetariano",
      "Econômico",
      "Sem Glúten",
      "Conforto",
      "Passo a Passo com Fotos"
    ],
    "image": "/dishes/rec-8.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "360g por porção",
    "platingInstructions": "Servir com arroz branco em meia-lua, o strogonoff cremoso no centro e a batata assada crocante ao lado.",
    "specificInstructions": "Secar bem os palitos de batata antes de assar com azeite para garantir crocância máxima sem fritura.",
    "sections": [
      {
        "name": "Batata Palha Assada Crocante",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Refogado e Cogumelos",
        "stepRange": [
          3,
          4
        ]
      },
      {
        "name": "Molho Aveludado & Serviço",
        "stepRange": [
          5,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "O strogonoff vegetariano de grão-de-bico com cogumelos surpreende pela textura aveludada e saciedade profunda.",
      "storage": "Conserve em pote fechado por até 3 dias na geladeira.",
      "secret": "O toque de mostarda dijon e noz-moscada confere a complexidade do strogonoff tradicional."
    },
    "ingredients": [
      {
        "section": "Principal",
        "name": "Grão-de-bico cozido",
        "amount": 250,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 2.8
      },
      {
        "section": "Principal",
        "name": "Cogumelos frescos ou champignon",
        "amount": 120,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 3.5
      },
      {
        "section": "Molho",
        "name": "Molho de tomate caseiro",
        "amount": 100,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 0.9
      },
      {
        "section": "Molho",
        "name": "Creme de leite leve",
        "amount": 150,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 2.5
      },
      {
        "section": "Crocante",
        "name": "Batata palha assada",
        "amount": 40,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 1.2
      }
    ],
    "steps": [
      "Higienize e corte 200g de batata em palitos finos com casca. Seque com pano, envolva com azeite e sal e asse a 220°C por 20 minutos até ficarem crocantes.",
      "Escorra e lave 250g de grão-de-bico cozido. Lamine 120g de cogumelos frescos e pique meia cebola fina.",
      "Aqueça uma panela funda com azeite em fogo médio e refogue a cebola picada até ficar translúcida e aromática.",
      "Junte os cogumelos laminados e salteie por 3 minutos até dourarem suavemente e liberarem seus aromas terrosos.",
      "Adicione o grão-de-bico cozido, 100g de molho de tomate caseiro e 1 colher de mostarda, cozinhando em fogo brando por 6 minutos para apurar.",
      "Desligue o fogo, misture 150g de creme de leite homogeneizando o molho aveludado e sirva quente com arroz branco e batata palha assada."
    ],
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Batata Palha Assada",
        "text": "Higienize e corte 200g de batata em palitos finos com casca. Seque com pano, envolva com azeite e sal e asse a 220°C por 20 minutos até ficarem crocantes.",
        "image": "/dishes/rec-8.jpg",
        "alt": "Batatas finas assando douradas e crocantes no forno.",
        "tip": "Secar bem os palitos com pano de prato limpo é o segredo da crocância sem óleo.",
        "isKeyFrame": true,
        "timerSeconds": 1200
      },
      {
        "stepNumber": 2,
        "section": "Mise en Place dos Insumos",
        "text": "Escorra e lave 250g de grão-de-bico cozido. Lamine 120g de cogumelos frescos e pique meia cebola fina.",
        "image": "/dishes/rec-8.jpg",
        "alt": "Grão-de-bico escorrido, cogumelos laminados e cebola picada.",
        "tip": "Lavar o grão-de-bico em conserva remove o excesso de sódio.",
        "isKeyFrame": false,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Base Aromática",
        "text": "Aqueça uma panela funda com azeite em fogo médio e refogue a cebola picada até ficar translúcida e aromática.",
        "image": "/dishes/rec-8.jpg",
        "alt": "Cebola refogando suavemente no azeite.",
        "tip": "Não deixe queimar a cebola para não amargar o molho claro.",
        "isKeyFrame": false,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Salteado de Cogumelos",
        "text": "Junte os cogumelos laminados e salteie por 3 minutos até dourarem suavemente e liberarem seus aromas terrosos.",
        "image": "/dishes/rec-8.jpg",
        "alt": "Cogumelos frescos salteando na panela.",
        "tip": "Saltear em fogo alto evita que soltem água demais.",
        "isKeyFrame": true,
        "timerSeconds": 180
      },
      {
        "stepNumber": 5,
        "section": "Apuramento do Grão-de-Bico",
        "text": "Adicione o grão-de-bico cozido, 100g de molho de tomate caseiro e 1 colher de mostarda, cozinhando em fogo brando por 6 minutos para apurar.",
        "image": "/dishes/rec-8.jpg",
        "alt": "Grão-de-bico cozinhando no molho de tomate aromático.",
        "tip": "Cozinhar alguns minutos faz o grão-de-bico absorver o tempero.",
        "isKeyFrame": false,
        "timerSeconds": 360
      },
      {
        "stepNumber": 6,
        "section": "Molho Aveludado & Serviço",
        "text": "Desligue o fogo, misture 150g de creme de leite homogeneizando o molho aveludado e sirva quente com arroz branco e batata palha assada.",
        "image": "/dishes/rec-8.jpg",
        "alt": "Strogonoff cremoso aveludado servido com arroz e batata palha crocante.",
        "tip": "Adicione o creme de leite sempre com o fogo apagado para não talhar.",
        "isKeyFrame": true,
        "timerSeconds": 60
      }
    ]
  },
  {
    "id": "rec-9",
    "title": "Tilápia com Purê e Brócolis",
    "category": "Almoço",
    "prepTime": 25,
    "servings": 2,
    "calories": 340,
    "protein": 36,
    "carbs": 26,
    "fat": 9,
    "tags": [
      "Tirzepatida",
      "Peixes & Frutos do Mar",
      "Leve",
      "Sem Glúten",
      "Alta Proteína",
      "Passo a Passo com Fotos"
    ],
    "image": "/dishes/rec-9.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "320g por porção",
    "platingInstructions": "Dispor o purê de batatas sedoso na base, o filé de tilápia com crosta dourada por cima e os floretes de brócolis ao lado.",
    "specificInstructions": "Secar bem os filés de peixe antes de grelhar e cozinhar o brócolis no vapor apenas até ficar al dente.",
    "sections": [
      {
        "name": "Purê de Batata Sedoso",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Brócolis no Vapor",
        "stepRange": [
          3,
          3
        ]
      },
      {
        "name": "Grelhado da Tilápia & Montagem",
        "stepRange": [
          4,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "A tilápia grelhada é uma das proteínas mais digestíveis e magras, ideal para quem precisa de saciedade sem peso gástrico.",
      "storage": "Consumir fresco preferencialmente; se sobrar, guardar por até 24h na geladeira.",
      "secret": "Grelhar em frigideira bem quente com fio de azeite sem mexer por 3 minutos sela os sucos internos e cria crosta dourada."
    },
    "ingredients": [
      {
        "section": "Peixe",
        "name": "Filés de tilápia fresca",
        "amount": 300,
        "unit": "g",
        "aisle": "Peixaria",
        "basePrice": 8.5
      },
      {
        "section": "Guarnição",
        "name": "Batata inglesa cozida",
        "amount": 250,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 1.5
      },
      {
        "section": "Legumes",
        "name": "Brócolis frescos em floretes",
        "amount": 150,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 2.1
      },
      {
        "section": "Aromáticos",
        "name": "Azeite, limão e sal refinado",
        "amount": 15,
        "unit": "ml",
        "aisle": "Mercearia",
        "basePrice": 0.8
      }
    ],
    "steps": [
      "Descasque 250g de batata e cozinhe em água fervente com sal por 15 minutos até ficar bem macia ao toque do garfo.",
      "Escorra a batata, passe pelo espremedor ainda quente e incorpore 50ml de leite morno e um fio de azeite até obter purê sedoso e liso.",
      "Cozinhe 150g de floretes de brócolis no vapor sobre água fervente por 4 minutos até ficarem verde-vivos e crocantes ao dente.",
      "Tempere 300g de filés de tilápia fresca com suco de limão, sal, pimenta-branca e uma pitada de raspas de limão siciliano.",
      "Aqueça uma frigideira antiaderente com um fio de azeite em fogo alto e grelhe os filés por 3 minutos de um lado até dourar.",
      "Vire com espátula delicadamente e doure o outro lado por mais 2 minutos sem deixar ressecar as fibras macias do peixe, montando o prato em seguida."
    ],
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Cozimento da Batata",
        "text": "Descasque 250g de batata e cozinhe em água fervente com sal por 15 minutos até ficar bem macia ao toque do garfo.",
        "image": "/dishes/rec-9.jpg",
        "alt": "Batatas cozinhando em água com sal.",
        "tip": "Cozinhe com sal para temperar a batata desde o interior.",
        "isKeyFrame": true,
        "timerSeconds": 900
      },
      {
        "stepNumber": 2,
        "section": "Purê Sedoso",
        "text": "Escorra a batata, passe pelo espremedor ainda quente e incorpore 50ml de leite morno e um fio de azeite até obter purê sedoso e liso.",
        "image": "/dishes/rec-9.jpg",
        "alt": "Purê de batata sendo trabalhado com espátula até ficar aveludado.",
        "tip": "Usar leite morno mantém a temperatura e evita textura pegajosa.",
        "isKeyFrame": false,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Brócolis no Vapor",
        "text": "Cozinhe 150g de floretes de brócolis no vapor sobre água fervente por 4 minutos até ficarem verde-vivos e crocantes ao dente.",
        "image": "/dishes/rec-9.jpg",
        "alt": "Brócolis verde-esmeralda cozinhando no vapor.",
        "tip": "O cozimento rápido no vapor preserva os nutrientes e a cor vibrante.",
        "isKeyFrame": true,
        "timerSeconds": 240
      },
      {
        "stepNumber": 4,
        "section": "Tempero Cítrico da Tilápia",
        "text": "Tempere 300g de filés de tilápia fresca com suco de limão, sal, pimenta-branca e uma pitada de raspas de limão siciliano.",
        "image": "/dishes/rec-9.jpg",
        "alt": "Filés de tilápia temperados com raspas de limão.",
        "tip": "Tempere o peixe apenas minutos antes de grelhar para o limão não cozinhar a carne a frio.",
        "isKeyFrame": false,
        "timerSeconds": 60
      },
      {
        "stepNumber": 5,
        "section": "Grelhado em Alta Temperatura",
        "text": "Aqueça uma frigideira antiaderente com um fio de azeite em fogo alto e grelhe os filés por 3 minutos de um lado até dourar.",
        "image": "/dishes/rec-9.jpg",
        "alt": "Filé de tilápia dourando na frigideira antiaderente.",
        "tip": "Não mexa o peixe nos primeiros minutos para não quebrar a crosta.",
        "isKeyFrame": true,
        "timerSeconds": 180
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Montagem",
        "text": "Vire com espátula delicadamente e doure o outro lado por mais 2 minutos sem deixar ressecar as fibras macias do peixe, montando o prato em seguida.",
        "image": "/dishes/rec-9.jpg",
        "alt": "Prato montado com filé de tilápia dourado, purê sedoso e floretes de brócolis.",
        "tip": "Finalize com um fio leve de azeite extra virgem sobre o peixe e os legumes.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "rec-10",
    "title": "Omelete de Forno com Legumes",
    "category": "Jantar",
    "prepTime": 25,
    "servings": 2,
    "calories": 270,
    "protein": 24,
    "carbs": 8,
    "fat": 15,
    "tags": [
      "Tirzepatida",
      "Low Carb",
      "Vegetariano",
      "Rápido",
      "Econômico",
      "Passo a Passo com Fotos"
    ],
    "image": "/dishes/rec-10.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "260g por porção",
    "platingInstructions": "Cortar em fatias quadradas altas e firmes decoradas com folhas de manjericão fresco e fio de azeite.",
    "specificInstructions": "Bater os ovos até espumar bem para dar aeração ao suflê de forno.",
    "sections": [
      {
        "name": "Mise en Place dos Legumes",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Batimento dos Ovos e Emulsão",
        "stepRange": [
          3,
          4
        ]
      },
      {
        "name": "Forno e Gratinado",
        "stepRange": [
          5,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "A omelete de forno é prática para refeições leves à noite e permite reaproveitar sobras de legumes da geladeira.",
      "storage": "Guarde na geladeira por até 3 dias em pote hermético. Reaqueça no forno ou micro-ondas.",
      "secret": "Uma colher de café de fermento em pó faz a omelete estufar alta e fofa como um suflê."
    },
    "ingredients": [
      {
        "section": "Ovos",
        "name": "Ovos frescos",
        "amount": 4,
        "unit": "un",
        "aisle": "Laticínios e Ovos",
        "basePrice": 3.6
      },
      {
        "section": "Legumes",
        "name": "Abobrinha e cenoura raladas",
        "amount": 160,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 1.4
      },
      {
        "section": "Queijo",
        "name": "Queijo minas frescal em cubos",
        "amount": 60,
        "unit": "g",
        "aisle": "Laticínios e Ovos",
        "basePrice": 2.5
      },
      {
        "section": "Aromáticos",
        "name": "Orégano, azeite e sal",
        "amount": 10,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 0.5
      }
    ],
    "steps": [
      "Lave e rale meia abobrinha e meia cenoura no ralo grosso. Corte o queijo minas em cubinhos pequenos.",
      "Refogue os legumes ralados em uma frigideira com gotas de azeite por 2 minutos apenas para evaporar o excesso de líquido.",
      "Em uma tigela média, quebre os 4 ovos, adicione sal fino, orégano e 1 colher de café de fermento em pó.",
      "Bata com fouet vigorosamente por 1 minuto até a mistura dobrar de volume e ficar bem espumosa.",
      "Misture delicadamente os legumes refogados e o queijo minas aos ovos batidos e despeje em refratário untado.",
      "Leve ao forno pré-aquecido a 190°C por 18 a 20 minutos até estufar dourada e firme ao toque."
    ],
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place dos Legumes",
        "text": "Lave e rale meia abobrinha e meia cenoura no ralo grosso. Corte o queijo minas em cubinhos pequenos.",
        "image": "/dishes/rec-10.jpg",
        "alt": "Abobrinha e cenoura raladas com cubos de queijo.",
        "tip": "Ralar no lado grosso mantém pedaços visíveis e textura no corte.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Secagem dos Legumes",
        "text": "Refogue os legumes ralados em uma frigideira com gotas de azeite por 2 minutos apenas para evaporar o excesso de líquido.",
        "image": "/dishes/rec-10.jpg",
        "alt": "Legumes ralados salteando rapidamente na frigideira.",
        "tip": "Evaporar a água da abobrinha evita que o fundo da omelete fique mole.",
        "isKeyFrame": false,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Tempero dos Ovos",
        "text": "Em uma tigela média, quebre os 4 ovos, adicione sal fino, orégano e 1 colher de café de fermento em pó.",
        "image": "/dishes/rec-10.jpg",
        "alt": "Ovos na tigela temperados com orégano e fermento.",
        "tip": "O fermento garante crescimento uniforme sem desmanchar.",
        "isKeyFrame": false,
        "timerSeconds": 30
      },
      {
        "stepNumber": 4,
        "section": "Aeração dos Ovos",
        "text": "Bata com fouet vigorosamente por 1 minuto até a mistura dobrar de volume e ficar bem espumosa.",
        "image": "/dishes/rec-10.jpg",
        "alt": "Ovos batidos espumosos e aerados.",
        "tip": "Quanto mais ar incorporar, mais fofo será o resultado final.",
        "isKeyFrame": true,
        "timerSeconds": 60
      },
      {
        "stepNumber": 5,
        "section": "Incorporação Delicada",
        "text": "Misture delicadamente os legumes refogados e o queijo minas aos ovos batidos e despeje em refratário untado.",
        "image": "/dishes/rec-10.jpg",
        "alt": "Mistura transferida para o refratário untado com azeite.",
        "tip": "Incorpore com espátula de silicone em movimentos suaves.",
        "isKeyFrame": false,
        "timerSeconds": 60
      },
      {
        "stepNumber": 6,
        "section": "Forno & Crescimento",
        "text": "Leve ao forno pré-aquecido a 190°C por 18 a 20 minutos até estufar dourada e firme ao toque.",
        "image": "/dishes/rec-10.jpg",
        "alt": "Omelete de forno alta e dourada saindo do forno.",
        "tip": "Espete um palito no centro: se sair limpo, está no ponto exato.",
        "isKeyFrame": true,
        "timerSeconds": 1100
      }
    ]
  },
  {
    "id": "rec-11",
    "title": "Caldo Verde com Frango",
    "category": "Jantar",
    "prepTime": 25,
    "servings": 2,
    "calories": 280,
    "protein": 29,
    "carbs": 26,
    "fat": 7,
    "tags": [
      "Tirzepatida",
      "Conforto",
      "Sopas & Caldos",
      "Sem Glúten",
      "Econômico",
      "Passo a Passo com Fotos"
    ],
    "image": "/dishes/rec-11.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "360g por porção",
    "platingInstructions": "Servir bem quente em cumbuca funda regado com fio generoso de azeite extra virgem.",
    "specificInstructions": "Adicionar a couve fina apenas nos minutos finais de cozimento para manter a tonalidade verde-viva.",
    "sections": [
      {
        "name": "Base Aveludada de Mandioquinha",
        "stepRange": [
          1,
          3
        ]
      },
      {
        "name": "Frango Dourado & Couve Chiffonade",
        "stepRange": [
          4,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "O caldo verde reconfortante na versão com peito de frango desfiado é levíssimo, aquecedor e muito rico em proteínas.",
      "storage": "Dura 3 dias refrigerado e congela perfeitamente por até 30 dias.",
      "secret": "Bater a mandioquinha cozida no liquidificador cria uma emulsão sedosa sem precisar de creme de leite."
    },
    "ingredients": [
      {
        "section": "Base",
        "name": "Mandioquinha ou batata cozida",
        "amount": 300,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 2.4
      },
      {
        "section": "Proteína",
        "name": "Peito de frango cozido e desfiado",
        "amount": 200,
        "unit": "g",
        "aisle": "Açougue",
        "basePrice": 4.8
      },
      {
        "section": "Verdura",
        "name": "Couve-manteiga fatiada fina",
        "amount": 100,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 1.2
      },
      {
        "section": "Aromáticos",
        "name": "Alho, cebola, azeite e sal",
        "amount": 20,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 0.7
      }
    ],
    "steps": [
      "Descasque e corte 300g de mandioquinha em rodelas médias. Pique o alho e fatie a couve finíssima em tiras chiffonade.",
      "Cozinhe a mandioquinha em 600ml de água fervente com sal e 1 dente de alho por 15 minutos até ficar bem macia.",
      "Transfira a mandioquinha com o líquido para o liquidificador e bata por 1 minuto até formar um caldo liso e aveludado.",
      "Em uma panela funda, doure o alho e a cebola picada no azeite e acrescente o peito de frango desfiado, salteando por 2 minutos.",
      "Despeje o caldo de mandioquinha sobre o frango refogado e deixe levantar fervura suave em fogo brando por 3 minutos.",
      "Junte a couve-manteiga fatiada fina, mexa por apenas 2 minutos para amaciar mantendo a cor verde-viva e sirva fumegante."
    ],
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place",
        "text": "Descasque e corte 300g de mandioquinha em rodelas médias. Pique o alho e fatie a couve finíssima em tiras chiffonade.",
        "image": "/dishes/rec-11.jpg",
        "alt": "Mandioquinha fatiada e couve em tiras finas.",
        "tip": "Enrolar as folhas de couve como um charuto facilita o corte fino.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Cozimento da Mandioquinha",
        "text": "Cozinhe a mandioquinha em 600ml de água fervente com sal e 1 dente de alho por 15 minutos até ficar bem macia.",
        "image": "/dishes/rec-11.jpg",
        "alt": "Mandioquinha fervendo na panela com dente de alho.",
        "tip": "O alho cozido junto com a mandioquinha suaviza o sabor e perfuma o caldo.",
        "isKeyFrame": false,
        "timerSeconds": 900
      },
      {
        "stepNumber": 3,
        "section": "Emulsão Sedosa no Liquidificador",
        "text": "Transfira a mandioquinha com o líquido para o liquidificador e bata por 1 minuto até formar um caldo liso e aveludado.",
        "image": "/dishes/rec-11.jpg",
        "alt": "Caldo de mandioquinha batido amarelo e cremoso.",
        "tip": "Retire a tampa central do liquidificador para deixar o vapor escapar com segurança.",
        "isKeyFrame": true,
        "timerSeconds": 60
      },
      {
        "stepNumber": 4,
        "section": "Refogado do Frango",
        "text": "Em uma panela funda, doure o alho e a cebola picada no azeite e acrescente o peito de frango desfiado, salteando por 2 minutos.",
        "image": "/dishes/rec-11.jpg",
        "alt": "Frango desfiado refogando no alho e azeite.",
        "tip": "Dourar o frango no alho dá sabor profundo à sopa.",
        "isKeyFrame": false,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "União do Caldo",
        "text": "Despeje o caldo de mandioquinha sobre o frango refogado e deixe levantar fervura suave em fogo brando por 3 minutos.",
        "image": "/dishes/rec-11.jpg",
        "alt": "Caldo e frango unindo fervura na panela.",
        "tip": "Mexa com colher de pau raspando o fundo.",
        "isKeyFrame": false,
        "timerSeconds": 180
      },
      {
        "stepNumber": 6,
        "section": "Couve & Empratamento",
        "text": "Junte a couve-manteiga fatiada fina, mexa por apenas 2 minutos para amaciar mantendo a cor verde-viva e sirva fumegante.",
        "image": "/dishes/rec-11.jpg",
        "alt": "Caldo verde finalizado fumegante na tigela com fio de azeite.",
        "tip": "Sirva com um fio de azeite extra virgem fresco no prato.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "rec-12",
    "title": "Macarrão com Frango e Brócolis",
    "category": "Almoço",
    "prepTime": 20,
    "servings": 2,
    "calories": 430,
    "protein": 34,
    "carbs": 48,
    "fat": 12,
    "tags": [
      "Alta Proteína",
      "Prato Único",
      "Econômico",
      "Rápido",
      "Passo a Passo com Fotos"
    ],
    "image": "/dishes/rec-12.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "380g por porção",
    "platingInstructions": "Servir o macarrão brilhante ao alho e óleo com as iscas de frango douradas e floretes de brócolis integrados e queijo ralado.",
    "specificInstructions": "Cozinhar a massa 1 minuto a menos que a embalagem para terminar de saltear junto com o frango no azeite.",
    "sections": [
      {
        "name": "Cozimento da Massa & Brócolis",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Grelhado das Iscas de Frango",
        "stepRange": [
          3,
          4
        ]
      },
      {
        "name": "Alho, Óleo e Salteado Final",
        "stepRange": [
          5,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "A clássica massa alho e óleo ganha equilíbrio nutricional perfeito com a adição de peito de frango grelhado e brócolis.",
      "storage": "Conservar na geladeira por até 2 dias em pote fechado.",
      "secret": "Adicionar 2 colheres da água do cozimento da massa ao saltear o azeite com alho cria uma emulsão brilhante que envolve o macarrão."
    },
    "ingredients": [
      {
        "section": "Massa",
        "name": "Macarrão penne ou espaguete",
        "amount": 160,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 1.6
      },
      {
        "section": "Proteína",
        "name": "Peito de frango em iscas",
        "amount": 260,
        "unit": "g",
        "aisle": "Açougue",
        "basePrice": 5.9
      },
      {
        "section": "Vegetal",
        "name": "Brócolis frescos em floretes",
        "amount": 140,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 1.9
      },
      {
        "section": "Aromáticos",
        "name": "Alho laminado e azeite",
        "amount": 20,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 0.9
      }
    ],
    "steps": [
      "Coloque 2 litros de água para ferver com 1 colher de sopa de sal grosso em panela grande.",
      "Corte o peito de frango em iscas finas e tempere com sal fino, alho picado e pimenta-do-reino.",
      "Cozinhe o macarrão na água fervente e, nos últimos 3 minutos de cozimento da massa, adicione os floretes de brócolis na mesma água.",
      "Enquanto isso, aqueça uma frigideira ampla com azeite em fogo alto e doure as iscas de frango por 4 minutos até dourarem intensamente.",
      "Junte o alho laminado ao frango e refogue por 1 minuto até perfumar dourado sem queimar.",
      "Escorra a massa e os brócolis preservando 3 colheres da água, transfira para a frigideira do frango e salteie vigorosamente até o azeite emulsionar brilhante."
    ],
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Água do Cozimento",
        "text": "Coloque 2 litros de água para ferver com 1 colher de sopa de sal grosso em panela grande.",
        "image": "/dishes/rec-12.jpg",
        "alt": "Água fervendo em abundância.",
        "tip": "A água do macarrão deve ser salgada como a água do mar.",
        "isKeyFrame": false,
        "timerSeconds": 300
      },
      {
        "stepNumber": 2,
        "section": "Mise en Place das Iscas",
        "text": "Corte o peito de frango em iscas finas e tempere com sal fino, alho picado e pimenta-do-reino.",
        "image": "/dishes/rec-12.jpg",
        "alt": "Iscas de frango fatiadas e temperadas.",
        "tip": "Cortar em iscas finas faz o frango dourar rápido sem ressecar.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 3,
        "section": "Cozimento Inteligente Massa + Brócolis",
        "text": "Cozinhe o macarrão na água fervente e, nos últimos 3 minutos de cozimento da massa, adicione os floretes de brócolis na mesma água.",
        "image": "/dishes/rec-12.jpg",
        "alt": "Macarrão e brócolis cozinhando na mesma panela.",
        "tip": "Cozinhar os brócolis na mesma panela economiza gás e tempo.",
        "isKeyFrame": true,
        "timerSeconds": 480
      },
      {
        "stepNumber": 4,
        "section": "Selagem das Iscas",
        "text": "Enquanto isso, aqueça uma frigideira ampla com azeite em fogo alto e doure as iscas de frango por 4 minutos até dourarem intensamente.",
        "image": "/dishes/rec-12.jpg",
        "alt": "Iscas de frango dourando na frigideira bem quente.",
        "tip": "Mantenha fogo alto para não juntar água.",
        "isKeyFrame": true,
        "timerSeconds": 240
      },
      {
        "stepNumber": 5,
        "section": "Alho Dourado Perfumado",
        "text": "Junte o alho laminado ao frango e refogue por 1 minuto até perfumar dourado sem queimar.",
        "image": "/dishes/rec-12.jpg",
        "alt": "Lâminas de alho dourando no azeite com o frango.",
        "tip": "O alho laminado frita suavemente e perfuma todo o azeite.",
        "isKeyFrame": false,
        "timerSeconds": 60
      },
      {
        "stepNumber": 6,
        "section": "Emulsão & Salteado Final",
        "text": "Escorra a massa e os brócolis preservando 3 colheres da água, transfira para a frigideira do frango e salteie vigorosamente até o azeite emulsionar brilhante.",
        "image": "/dishes/rec-12.jpg",
        "alt": "Massa brilhante envolvida no alho e azeite com frango e brócolis.",
        "tip": "O amido da água do cozimento forma um molho sedoso em volta da massa.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "rec-13",
    "title": "Bowl Mexicano com Carne",
    "category": "Almoço",
    "prepTime": 20,
    "servings": 2,
    "calories": 460,
    "protein": 34,
    "carbs": 48,
    "fat": 15,
    "tags": [
      "Gorduras Boas",
      "Equilibrado",
      "Bowl Funcional",
      "Colorido",
      "Alta Proteína",
      "Passo a Passo com Fotos"
    ],
    "image": "/dishes/rec-13.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "390g por porção",
    "platingInstructions": "Disposição em quadrantes coloridos: arroz em um lado, feijão preto ao lado, carne moída temperada, fatias de abacate fresco e cubinhos de tomate.",
    "specificInstructions": "Temperar a carne com páprica defumada e cominho para garantir o aroma autêntico.",
    "sections": [
      {
        "name": "Refogado da Carne com Especiarias",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Preparo dos Vegetais Frescos",
        "stepRange": [
          3,
          4
        ]
      },
      {
        "name": "Montagem em Quadrantes",
        "stepRange": [
          5,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "O bowl reúne fibras do feijão preto, carboidrato de baixo índice glicêmico e gorduras monoinsaturadas saudáveis do abacate.",
      "storage": "Montar com o abacate fresco na hora de consumir.",
      "secret": "Umas gotas de limão fresco sobre o abacate realçam o sabor e evitam a oxidação escura."
    },
    "ingredients": [
      {
        "section": "Proteína",
        "name": "Carne moída magra (patinho)",
        "amount": 260,
        "unit": "g",
        "aisle": "Açougue",
        "basePrice": 6.8
      },
      {
        "section": "Base",
        "name": "Arroz branco cozido",
        "amount": 150,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 1.2
      },
      {
        "section": "Base",
        "name": "Feijão preto cozido",
        "amount": 150,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 1.4
      },
      {
        "section": "Fresco",
        "name": "Abacate maduro fatiado",
        "amount": 80,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 1.6
      },
      {
        "section": "Fresco",
        "name": "Tomate e cebola picados",
        "amount": 80,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 0.9
      }
    ],
    "steps": [
      "Pese 260g de patinho moído e separe os temperos: cominho em pó, páprica defumada, sal e alho picado.",
      "Aqueça uma frigideira com fio de azeite em fogo alto e refogue a carne moída temperada até secar e dourar intensamente.",
      "Aqueça 150g de arroz branco cozido soltinho e 150g de feijão preto temperado com louro e alho.",
      "Corte 1 tomate maduro em cubinhos e fatie meio abacate maduro em lâminas finas, regando com gotas de limão fresco.",
      "Em dois bowls fundos, disponha o arroz em um quadrante e o feijão preto com caldo no quadrante oposto.",
      "Acomode a carne moída refogada e finalize com os cubinhos de tomate e as fatias de abacate temperadas com flor de sal."
    ],
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place Aromático",
        "text": "Pese 260g de patinho moído e separe os temperos: cominho em pó, páprica defumada, sal e alho picado.",
        "image": "/dishes/rec-13.jpg",
        "alt": "Carne moída e especiarias organizadas.",
        "tip": "A combinação de cominho e páprica dá a assinatura latina.",
        "isKeyFrame": true,
        "timerSeconds": 60
      },
      {
        "stepNumber": 2,
        "section": "Refogado da Carne",
        "text": "Aqueça uma frigideira com fio de azeite em fogo alto e refogue a carne moída temperada até secar e dourar intensamente.",
        "image": "/dishes/rec-13.jpg",
        "alt": "Carne moída dourando intensamente na frigideira.",
        "tip": "Deixe dourar bem para criar sabor profundo.",
        "isKeyFrame": true,
        "timerSeconds": 300
      },
      {
        "stepNumber": 3,
        "section": "Base Quente",
        "text": "Aqueça 150g de arroz branco cozido soltinho e 150g de feijão preto temperado com louro e alho.",
        "image": "/dishes/rec-13.jpg",
        "alt": "Arroz e feijão preto aquecidos.",
        "tip": "Um feijão preto bem temperado com alho amarrado ancora o prato.",
        "isKeyFrame": false,
        "timerSeconds": 120
      },
      {
        "stepNumber": 4,
        "section": "Frescor & Cortes",
        "text": "Corte 1 tomate maduro em cubinhos e fatie meio abacate maduro em lâminas finas, regando com gotas de limão fresco.",
        "image": "/dishes/rec-13.jpg",
        "alt": "Tomate em cubinhos e abacate fatiado em lâminas.",
        "tip": "O limão evita que o abacate oxide e mantém sua cor verde-clara.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Montagem dos Quadrantes",
        "text": "Em dois bowls fundos, disponha o arroz em um quadrante e o feijão preto com caldo no quadrante oposto.",
        "image": "/dishes/rec-13.jpg",
        "alt": "Base de arroz e feijão montada no bowl.",
        "tip": "Organizar por cores cria contraste visual apetitoso.",
        "isKeyFrame": false,
        "timerSeconds": 60
      },
      {
        "stepNumber": 6,
        "section": "Finalização & Empratamento",
        "text": "Acomode a carne moída refogada e finalize com os cubinhos de tomate e as fatias de abacate temperadas com flor de sal.",
        "image": "/dishes/rec-13.jpg",
        "alt": "Bowl mexicano colorido completo com abacate, carne e tomate.",
        "tip": "Sirva com folhas frescas de coentro ou salsa por cima.",
        "isKeyFrame": true,
        "timerSeconds": 60
      }
    ]
  },
  {
    "id": "rec-14",
    "title": "Frigideira de Frango e Legumes",
    "category": "Jantar",
    "prepTime": 18,
    "servings": 2,
    "calories": 320,
    "protein": 36,
    "carbs": 12,
    "fat": 14,
    "tags": [
      "Tirzepatida",
      "Low Carb",
      "Rápido",
      "Sem Glúten",
      "Econômico",
      "One-Pan",
      "Passo a Passo com Fotos"
    ],
    "image": "/dishes/rec-14.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "320g por porção",
    "platingInstructions": "Servir diretamente na frigideira rústica ou em prato raso aquecido, com folhas de manjericão fresco salpicadas no topo.",
    "specificInstructions": "Selar o frango em fogo alto para criar crosta sem mexer antes de adicionar a abobrinha e os tomates-cereja.",
    "sections": [
      {
        "name": "Cortes e Mise en Place",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Selagem do Frango",
        "stepRange": [
          3,
          4
        ]
      },
      {
        "name": "Salteado de Legumes & Finalização",
        "stepRange": [
          5,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "O método one-pan (uma só panela) concentra os açúcares naturais dos legumes e reduz a louça pós-refeição a zero.",
      "storage": "Conservar na geladeira por até 3 dias em pote vedado.",
      "secret": "Adicionar os tomates-cereja inteiros nos últimos minutos faz com que estourem na boca liberando suco doce e ácido."
    },
    "ingredients": [
      {
        "section": "Proteína",
        "name": "Peito de frango em cubos",
        "amount": 300,
        "unit": "g",
        "aisle": "Açougue",
        "basePrice": 6.9
      },
      {
        "section": "Legumes",
        "name": "Abobrinha média em meias-luas",
        "amount": 150,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 1.2
      },
      {
        "section": "Legumes",
        "name": "Tomates-cereja inteiros",
        "amount": 100,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 1.6
      },
      {
        "section": "Aromáticos",
        "name": "Azeite de oliva e alho",
        "amount": 15,
        "unit": "ml",
        "aisle": "Mercearia",
        "basePrice": 0.9
      },
      {
        "section": "Ervas",
        "name": "Manjericão e orégano frescos",
        "amount": 10,
        "unit": "g",
        "aisle": "Hortifruti",
        "basePrice": 0.4
      }
    ],
    "steps": [
      "Corte 300g de peito de frango em cubos regulares de 2 cm e tempere com alho picado, sal fino e pimenta-do-reino.",
      "Lave 1 abobrinha média e corte em meias-luas de 0,5 cm. Higienize 100g de tomates-cereja mantendo inteiros.",
      "Aqueça uma frigideira ampla com 15ml de azeite em fogo alto e acomode os cubos de frango em camada única.",
      "Grelhe por 4 minutos sem mexer no início até formar crosta dourada e selar a umidade interna.",
      "Afaste o frango para as bordas da frigideira, coloque as meias-luas de abobrinha no centro e salteie por 3 minutos em fogo médio.",
      "Junte os tomates-cereja inteiros e o orégano fresco, salteando tudo junto por mais 2 minutos até os tomates estalarem a pele."
    ],
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Mise en Place & Cortes",
        "text": "Corte 300g de peito de frango em cubos regulares de 2 cm e tempere com alho picado, sal fino e pimenta-do-reino.",
        "image": "/dishes/rec-14.jpg",
        "alt": "Cubos de frango temperados na tigela.",
        "tip": "Cubos regulares cozinham por igual sem ressecar.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 2,
        "section": "Corte dos Legumes",
        "text": "Lave 1 abobrinha média e corte em meias-luas de 0,5 cm. Higienize 100g de tomates-cereja mantendo inteiros.",
        "image": "/dishes/rec-14.jpg",
        "alt": "Abobrinha em meias-luas e tomates-cereja lavados.",
        "tip": "Manter os tomates inteiros evita que soltem água excessiva na frigideira.",
        "isKeyFrame": false,
        "timerSeconds": 60
      },
      {
        "stepNumber": 3,
        "section": "Aquecimento & Selagem",
        "text": "Aqueça uma frigideira ampla com 15ml de azeite em fogo alto e acomode os cubos de frango em camada única.",
        "image": "/dishes/rec-14.jpg",
        "alt": "Frango acomodado em camada única na frigideira quente.",
        "tip": "Não sobreponha os cubos para que dourem em vez de cozinhar no vapor.",
        "isKeyFrame": false,
        "timerSeconds": 60
      },
      {
        "stepNumber": 4,
        "section": "Crosta Dourada",
        "text": "Grelhe por 4 minutos sem mexer no início até formar crosta dourada e selar a umidade interna.",
        "image": "/dishes/rec-14.jpg",
        "alt": "Cubos de frango dourados por baixo.",
        "tip": "A crosta dourada caramelizada é onde está todo o sabor.",
        "isKeyFrame": true,
        "timerSeconds": 240
      },
      {
        "stepNumber": 5,
        "section": "Salteado da Abobrinha",
        "text": "Afaste o frango para as bordas da frigideira, coloque as meias-luas de abobrinha no centro e salteie por 3 minutos em fogo médio.",
        "image": "/dishes/rec-14.jpg",
        "alt": "Abobrinha salteando no centro da frigideira quente.",
        "tip": "A abobrinha doura rapidamente no calor residual do frango.",
        "isKeyFrame": true,
        "timerSeconds": 180
      },
      {
        "stepNumber": 6,
        "section": "Tomates Estalados & Finalização",
        "text": "Junte os tomates-cereja inteiros e o orégano fresco, salteando tudo junto por mais 2 minutos até os tomates estalarem a pele.",
        "image": "/dishes/rec-14.jpg",
        "alt": "Frigideira completa e colorida fumegante pronta para servir.",
        "tip": "Finalize com folhas de manjericão fresco imediatamente antes de servir.",
        "isKeyFrame": true,
        "timerSeconds": 120
      }
    ]
  },
  {
    "id": "rec-15",
    "title": "Arroz de Forno com Carne Moída",
    "category": "Almoço",
    "prepTime": 35,
    "servings": 3,
    "calories": 450,
    "protein": 32,
    "carbs": 48,
    "fat": 14,
    "tags": [
      "Para Família",
      "Prato Único",
      "Forno",
      "Econômico",
      "Passo a Passo com Fotos"
    ],
    "image": "/dishes/rec-15.jpg",
    "source": "Ficha Técnica NeatEat Brasil",
    "portionWeight": "410g por porção",
    "platingInstructions": "Cortar em porções quadradas generosas exibindo as camadas úmidas de arroz, carne moída e queijo gratinado.",
    "specificInstructions": "Umedecer o arroz com molho de tomate antes de levar ao forno para não ressecar durante o gratinado.",
    "sections": [
      {
        "name": "Refogado da Carne Moída",
        "stepRange": [
          1,
          2
        ]
      },
      {
        "name": "Montagem em Camadas",
        "stepRange": [
          3,
          4
        ]
      },
      {
        "name": "Forno e Gratinado",
        "stepRange": [
          5,
          6
        ]
      }
    ],
    "chefTips": {
      "intro": "O arroz de forno é o maior campeão contra o desperdício alimentar, transformando sobras em um banquete de restaurante.",
      "storage": "Conservar por até 3 dias na geladeira em pote fechado ou congelar por 30 dias.",
      "secret": "Colocar fatias de queijo muçarela entre as camadas de arroz e no topo garante queijo fundido por toda a fatia."
    },
    "ingredients": [
      {
        "section": "Base",
        "name": "Arroz branco cozido",
        "amount": 300,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 2.2
      },
      {
        "section": "Carne",
        "name": "Carne moída refogada",
        "amount": 300,
        "unit": "g",
        "aisle": "Açougue",
        "basePrice": 7.8
      },
      {
        "section": "Molho",
        "name": "Molho de tomate caseiro",
        "amount": 150,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 1.3
      },
      {
        "section": "Cobertura",
        "name": "Queijo muçarela fatiado",
        "amount": 80,
        "unit": "g",
        "aisle": "Laticínios e Ovos",
        "basePrice": 4.8
      },
      {
        "section": "Legumes",
        "name": "Milho e ervilha frescos",
        "amount": 80,
        "unit": "g",
        "aisle": "Mercearia",
        "basePrice": 1.2
      }
    ],
    "steps": [
      "Refogue a carne moída com cebola, alho, molho de tomate e milho em uma panela funda por 8 minutos até virar molho espesso.",
      "Separe o arroz branco cozido em uma tigela e misture 2 colheres do molho para umedecer os grãos.",
      "Unte um refratário médio com umas gotas de azeite e espalhe metade do arroz umedecido no fundo.",
      "Distribua todo o refogado de carne moída com milho sobre o arroz, cobrindo com fatias de queijo muçarela.",
      "Cubra com o restante do arroz e finalize com mais queijo muçarela e orégano por cima.",
      "Asse em forno a 200°C por 15 a 18 minutos até o queijo borbulhar e dourar formando crosta crocante."
    ],
    "stepDetails": [
      {
        "stepNumber": 1,
        "section": "Refogado da Carne",
        "text": "Refogue a carne moída com cebola, alho, molho de tomate e milho em uma panela funda por 8 minutos até virar molho espesso.",
        "image": "/dishes/rec-15.jpg",
        "alt": "Carne moída refogada no molho com milho.",
        "tip": "O molho deve ser denso para não encharcar o fundo do refratário.",
        "isKeyFrame": true,
        "timerSeconds": 480
      },
      {
        "stepNumber": 2,
        "section": "Umedecimento do Arroz",
        "text": "Separe o arroz branco cozido em uma tigela e misture 2 colheres do molho para umedecer os grãos.",
        "image": "/dishes/rec-15.jpg",
        "alt": "Arroz branco misturado suavemente com molho.",
        "tip": "Misturar um pouco de molho evita que o arroz fique seco após assar.",
        "isKeyFrame": false,
        "timerSeconds": 60
      },
      {
        "stepNumber": 3,
        "section": "Primeira Camada",
        "text": "Unte um refratário médio com umas gotas de azeite e espalhe metade do arroz umedecido no fundo.",
        "image": "/dishes/rec-15.jpg",
        "alt": "Camada de arroz no fundo do refratário.",
        "tip": "Espalhe uniformemente sem apertar os grãos.",
        "isKeyFrame": false,
        "timerSeconds": 60
      },
      {
        "stepNumber": 4,
        "section": "Recheio Farto & Queijo",
        "text": "Distribua todo o refogado de carne moída com milho sobre o arroz, cobrindo com fatias de queijo muçarela.",
        "image": "/dishes/rec-15.jpg",
        "alt": "Camada generosa de carne moída e queijo.",
        "tip": "O queijo no meio cria uma camada cremosa ao cortar.",
        "isKeyFrame": true,
        "timerSeconds": 120
      },
      {
        "stepNumber": 5,
        "section": "Fechamento & Cobertura",
        "text": "Cubra com o restante do arroz e finalize com mais queijo muçarela e orégano por cima.",
        "image": "/dishes/rec-15.jpg",
        "alt": "Topo do arroz de forno coberto com queijo e orégano.",
        "tip": "O orégano confere aroma irresistível de forno de pizza.",
        "isKeyFrame": false,
        "timerSeconds": 60
      },
      {
        "stepNumber": 6,
        "section": "Gratinado ao Forno",
        "text": "Asse em forno a 200°C por 15 a 18 minutos até o queijo borbulhar e dourar formando crosta crocante.",
        "image": "/dishes/rec-15.jpg",
        "alt": "Arroz de forno borbulhante e dourado saindo do forno.",
        "tip": "Deixe descansar 5 minutos antes de cortar as fatias quadradas.",
        "isKeyFrame": true,
        "timerSeconds": 1000
      }
    ]
  }
];
