import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

// Padrão Culinário Gastronômico Enriquecido para Receitas Centrais
const RECIPE_UPGRADES = {
  // FRANGO XADREZ
  'sug-9': {
    title: 'Frango Xadrez',
    category: 'Almoço',
    prepTime: 22,
    servings: 2,
    calories: 390,
    protein: 38,
    carbs: 26,
    fat: 13,
    tags: ['Alta Proteína', 'Tirzepatida', 'Rápido', 'Sem Lactose'],
    image: '/dishes/frango-xadrez.jpg',
    source: 'Ficha Técnica NeatEat Brasil — Padrão Gastronômico',
    portionWeight: '320g por porção',
    platingInstructions: 'Servir o frango xadrez brilhante em prato raso aquecido, salpicado com amendoim torrado crocante e cebolinha verde fresca, com arroz soltinho ao lado.',
    specificInstructions: 'Saltear os pimentões e a cebola em fogo alto por apenas 2 a 3 minutos para manter crocância e cores vivas. Dissolver o amido em água fria para não empelotar.',
    ingredients: [
      { name: 'Peito de frango em cubos', amount: 350, unit: 'g', aisle: 'Açougue', basePrice: 8.01 },
      { name: 'Pimentão vermelho e amarelo', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.19 },
      { name: 'Cebola em pétalas', amount: 90, unit: 'g', aisle: 'Hortifruti', basePrice: 0.52 },
      { name: 'Alho picado', amount: 15, unit: 'g', aisle: 'Hortifruti', basePrice: 0.30 },
      { name: 'Molho shoyu tradicional', amount: 45, unit: 'ml', aisle: 'Mercearia', basePrice: 0.85 },
      { name: 'Amido de milho', amount: 15, unit: 'g', aisle: 'Mercearia', basePrice: 0.25 },
      { name: 'Amendoim torrado sem pele', amount: 35, unit: 'g', aisle: 'Mercearia', basePrice: 0.70 },
      { name: 'Óleo de gergelim ou azeite', amount: 15, unit: 'ml', aisle: 'Mercearia', basePrice: 0.90 },
      { name: 'Cebolinha fresca picada', amount: 15, unit: 'g', aisle: 'Hortifruti', basePrice: 0.35 }
    ],
    steps: [
      'Faça o mise en place cortando 350g de peito de frango em cubos regulares de 2,5 cm. Pique os pimentões e a cebola em quadrados médios (pétalas) e pique o alho fino.',
      'Em uma tigela funda, tempere os cubos de frango com 2 colheres de shoyu, alho picado e pimenta-do-reino moída. Deixe marinar por 10 minutos para absorver o tempero.',
      'Aqueça uma wok ou frigideira grande com um fio de óleo em fogo alto até fumegar levemente. Despeje o frango em camada única e sele por 4 a 5 minutos até dourar por fora sem ressecar.',
      'Adicione a cebola em pétalas e os pimentões coloridos na panela quente. Salteie vigorosamente em fogo alto por 2 a 3 minutos mantendo os vegetais firmes e crocantes ao dente.',
      'Em um copo separado, dissolva o amido de milho em 60 ml de água fria com o restante do shoyu. Despeje na frigideira fervente e mexa por 1 minuto até o molho encorpar e formar uma película brilhante e aveludada.',
      'Desligue o fogo, misture o amendoim torrado crocante e a cebolinha picada, e sirva imediatamente bem quente acompanhado de arroz branco.'
    ],
    stepDetails: [
      {
        stepNumber: 1,
        section: 'Mise en Place & Cortes',
        text: 'Faça o mise en place cortando 350g de peito de frango em cubos regulares de 2,5 cm. Pique os pimentões e a cebola em quadrados médios (pétalas) e pique o alho fino.',
        image: '/dishes/frango-xadrez.jpg',
        alt: 'Mise en place com peito de frango em cubos, pimentões coloridos e cebola em pétalas.',
        tip: 'Cortar os vegetais e o frango em tamanhos uniformes garante cocção homogênea na wok.',
        isKeyFrame: true,
        timerSeconds: 300
      },
      {
        stepNumber: 2,
        section: 'Marinada Aromática',
        text: 'Em uma tigela funda, tempere os cubos de frango com 2 colheres de shoyu, alho picado e pimenta-do-reino moída. Deixe marinar por 10 minutos para absorver o tempero.',
        image: '/dishes/frango-xadrez.jpg',
        alt: 'Cubos de frango marinando em shoyu e aromáticos.',
        tip: 'A marinada amacia as fibras do frango e garante sabor profundo até o centro dos cubos.',
        isKeyFrame: false,
        timerSeconds: 600
      },
      {
        stepNumber: 3,
        section: 'Selagem em Alta Temperatura',
        text: 'Aqueça uma wok ou frigideira grande com um fio de óleo em fogo alto até fumegar levemente. Despeje o frango em camada única e sele por 4 a 5 minutos até dourar por fora sem ressecar.',
        image: '/dishes/frango-xadrez.jpg',
        alt: 'Cubos de frango dourando na frigideira quente em fogo alto.',
        tip: 'Não mexa o frango nos primeiros 2 minutos para criar a crosta dourada e selar a umidade.',
        isKeyFrame: true,
        timerSeconds: 240
      },
      {
        stepNumber: 4,
        section: 'Salteado de Legumes al Dente',
        text: 'Adicione a cebola em pétalas e os pimentões coloridos na panela quente. Salteie vigorosamente em fogo alto por 2 a 3 minutos mantendo os vegetais firmes e crocantes ao dente.',
        image: '/dishes/frango-xadrez.jpg',
        alt: 'Pimentões vermelhos e amarelos salteando com cebola junto ao frango dourado.',
        tip: 'Mantenha fogo máximo para que os legumes tostem levemente sem soltar água.',
        isKeyFrame: true,
        timerSeconds: 150
      },
      {
        stepNumber: 5,
        section: 'Molho Aveludado & Brilho',
        text: 'Em um copo separado, dissolva o amido de milho em 60 ml de água fria com o restante do shoyu. Despeje na frigideira fervente e mexa por 1 minuto até o molho encorpar e formar uma película brilhante e aveludada.',
        image: '/dishes/frango-xadrez.jpg',
        alt: 'Molho oriental encorpando e caramelizando o frango e os vegetais.',
        tip: 'A água para dissolver o amido deve estar estritamente fria ou em temperatura ambiente.',
        isKeyFrame: true,
        timerSeconds: 90
      },
      {
        stepNumber: 6,
        section: 'Finalização Crocante & Serviço',
        text: 'Desligue o fogo, misture o amendoim torrado crocante e a cebolinha picada, e sirva imediatamente bem quente acompanhado de arroz branco.',
        image: '/dishes/frango-xadrez.jpg',
        alt: 'Frango xadrez finalizado com amendoins dourados crocantes e cheiro verde.',
        tip: 'Adicione o amendoim apenas no final com o fogo apagado para preservar sua textura ultra-crocante.',
        isKeyFrame: true,
        timerSeconds: 60
      }
    ],
    sections: [
      { name: 'Mise en Place & Marinada', stepRange: [1, 2] },
      { name: 'Cocção na Wok & Molho', stepRange: [3, 5] },
      { name: 'Finalização Crocante', stepRange: [6, 6] }
    ],
    chefTips: {
      intro: 'O clássico frango xadrez é um dos maiores aliados de quem busca refeições ricas em proteína magra com muito sabor e digestibilidade leve.',
      storage: 'Conservar na geladeira em pote fechado por até 3 dias. Para reaquecer mantendo a crocância dos pimentões, use fogo alto por 2 minutos na frigideira.',
      secret: 'O óleo de gergelim torrado colocado na finalização confere o autêntico aroma asiático de restaurante.'
    }
  },

  // STROGONOFF DE FRANGO
  'sug-daily-2026-10-31-2': {
    title: 'Strogonoff de Frango',
    category: 'Almoço',
    prepTime: 25,
    servings: 3,
    calories: 450,
    protein: 36,
    carbs: 34,
    fat: 16,
    tags: ['Alta Proteína', 'Rápido', 'Econômico'],
    image: '/dishes/sug-9.jpg',
    source: 'Ficha Técnica NeatEat Brasil — Padrão Gastronômico',
    portionWeight: '340g por porção',
    platingInstructions: 'Dispor o arroz branco em meia-lua, o strogonoff cremoso aveludado no centro e batata palha fresca na lateral.',
    specificInstructions: 'Selar o frango em fogo bem alto para reter sucos antes de incorporar o molho. Adicionar o creme de leite em fogo baixo sem ferver.',
    ingredients: [
      { name: 'Peito de frango em tiras ou cubos', amount: 450, unit: 'g', aisle: 'Açougue', basePrice: 10.3 },
      { name: 'Creme de leite leve', amount: 200, unit: 'g', aisle: 'Mercearia', basePrice: 3.5 },
      { name: 'Molho de tomate caseiro', amount: 120, unit: 'g', aisle: 'Mercearia', basePrice: 1.02 },
      { name: 'Mostarda amarela ou dijon', amount: 20, unit: 'g', aisle: 'Mercearia', basePrice: 0.50 },
      { name: 'Cebola picada', amount: 70, unit: 'g', aisle: 'Hortifruti', basePrice: 0.40 },
      { name: 'Alho picado', amount: 10, unit: 'g', aisle: 'Hortifruti', basePrice: 0.20 },
      { name: 'Azeite de oliva', amount: 15, unit: 'ml', aisle: 'Mercearia', basePrice: 0.90 },
      { name: 'Batata palha crocante', amount: 40, unit: 'g', aisle: 'Mercearia', basePrice: 1.20 }
    ],
    steps: [
      'Corte o peito de frango em tiras médias de 3 cm. Pique a cebola em cubinhos finos e amasse o alho.',
      'Tempere as tiras de frango com sal, alho, pimenta-do-reino e algumas gotas de limão.',
      'Aqueça uma frigideira funda com o azeite em fogo alto e doure o frango em duas etapas para não juntar água.',
      'Junte a cebola picada ao frango dourado e refogue por 2 minutos até murchar e dourar.',
      'Adicione o molho de tomate, a mostarda e uma pitada de noz-moscada, cozinhando em fogo baixo por 5 minutos.',
      'Abaixe o fogo para o mínimo, adicione o creme de leite e mexa delicadamente até homogeneizar sem deixar ferver.',
      'Sirva imediatamente com arroz branco e batata palha bem crocante disposta ao lado.'
    ],
    stepDetails: [
      {
        stepNumber: 1,
        section: 'Mise en Place & Corte',
        text: 'Corte o peito de frango em tiras médias de 3 cm. Pique a cebola em cubinhos finos e amasse o alho.',
        image: '/dishes/sug-9.jpg',
        alt: 'Peito de frango cortado em tiras e aromáticos picados.',
        tip: 'Tiras uniformes garantem que o frango cozinhe por igual sem ressecar.',
        isKeyFrame: true,
        timerSeconds: 240
      },
      {
        stepNumber: 2,
        section: 'Tempero & Marinada',
        text: 'Tempere as tiras de frango com sal, alho, pimenta-do-reino e algumas gotas de limão.',
        image: '/dishes/sug-9.jpg',
        alt: 'Frango temperado descansando com aromáticos.',
        tip: 'Evite excesso de ácido para não cozinhar as fibras a frio antes de ir ao fogo.',
        isKeyFrame: false,
        timerSeconds: 300
      },
      {
        stepNumber: 3,
        section: 'Selagem em Alta Temperatura',
        text: 'Aqueça uma frigideira funda com o azeite em fogo alto e doure o frango em duas etapas para não juntar água.',
        image: '/dishes/sug-9.jpg',
        alt: 'Frango dourando na frigideira quente.',
        tip: 'Dividir em duas etapas impede que a temperatura da panela caia e o frango cozinhe na própria água.',
        isKeyFrame: true,
        timerSeconds: 300
      },
      {
        stepNumber: 4,
        section: 'Refogado Aromático',
        text: 'Junte a cebola picada ao frango dourado e refogue por 2 minutos até murchar e dourar.',
        image: '/dishes/sug-9.jpg',
        alt: 'Cebola refogando com o frango dourado.',
        tip: 'Raspe o fundo da panela para soltar os açúcares caramelizados da carne.',
        isKeyFrame: false,
        timerSeconds: 120
      },
      {
        stepNumber: 5,
        section: 'Apuração do Molho',
        text: 'Adicione o molho de tomate, a mostarda e uma pitada de noz-moscada, cozinhando em fogo baixo por 5 minutos.',
        image: '/dishes/sug-9.jpg',
        alt: 'Molho de tomate e mostarda encorpando na panela.',
        tip: 'Deixar o molho apurar equilibra a acidez do tomate antes de receber o creme.',
        isKeyFrame: true,
        timerSeconds: 300
      },
      {
        stepNumber: 6,
        section: 'Finalização Cremosa',
        text: 'Abaixe o fogo para o mínimo, adicione o creme de leite e mexa delicadamente até homogeneizar sem deixar ferver.',
        image: '/dishes/sug-9.jpg',
        alt: 'Creme de leite adicionado ao strogonoff formando molho rosé aveludado.',
        tip: 'Ferver o creme de leite pode talhar a emulsão; mantenha sempre em fogo brando.',
        isKeyFrame: true,
        timerSeconds: 120
      },
      {
        stepNumber: 7,
        section: 'Montagem & Serviço',
        text: 'Sirva imediatamente com arroz branco e batata palha bem crocante disposta ao lado.',
        image: '/dishes/sug-9.jpg',
        alt: 'Prato montado com strogonoff cremoso, arroz branco e batata palha crocante.',
        tip: 'Coloque a batata palha na hora de servir para que ela não amoleça com o vapor do molho.',
        isKeyFrame: true,
        timerSeconds: 60
      }
    ],
    sections: [
      { name: 'Mise en Place & Selagem', stepRange: [1, 3] },
      { name: 'Cocção do Molho', stepRange: [4, 5] },
      { name: 'Cremosidade & Serviço', stepRange: [6, 7] }
    ],
    chefTips: {
      intro: 'O strogonoff de frango é o prato mais afetivo do almoço brasileiro e fica incrivelmente leve quando preparado com corte magro.',
      storage: 'Conservar na geladeira por até 3 dias. Reaquecer em fogo brando mexendo sempre.',
      secret: 'Um toque sutil de mostarda dijon eleva a complexidade do molho sem torná-lo picante.'
    }
  },

  // SANDUÍCHE DE FRANGO CREMOSO
  'sug-daily-2026-11-01-2': {
    title: 'Sanduíche de Frango Cremoso',
    category: 'Café da Manhã',
    prepTime: 10,
    servings: 2,
    calories: 310,
    protein: 26,
    carbs: 28,
    fat: 9,
    tags: ['Alta Proteína', 'Tirzepatida', 'Rápido', 'Econômico'],
    image: '/dishes/sug-6.jpg',
    source: 'Ficha Técnica NeatEat Brasil — Padrão Gastronômico',
    portionWeight: '220g por porção',
    platingInstructions: 'Cortar na diagonal em dois triângulos perfeitos exibindo o recheio colorido e aerado.',
    specificInstructions: 'Ralar a cenoura bem fininha e escorrer o excesso de líquido para manter o pão macio e sequinho.',
    ingredients: [
      { name: 'Pão de forma integral', amount: 100, unit: 'g', aisle: 'Padaria', basePrice: 1.80 },
      { name: 'Peito de frango cozido e desfiado', amount: 180, unit: 'g', aisle: 'Açougue', basePrice: 4.20 },
      { name: 'Requeijão cremoso light', amount: 50, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 1.75 },
      { name: 'Cenoura ralada bem fina', amount: 40, unit: 'g', aisle: 'Hortifruti', basePrice: 0.35 },
      { name: 'Folhas de alface americana ou rúcula', amount: 30, unit: 'g', aisle: 'Hortifruti', basePrice: 0.60 },
      { name: 'Cheiro-verde picadinho', amount: 10, unit: 'g', aisle: 'Hortifruti', basePrice: 0.25 }
    ],
    steps: [
      'Em uma tigela média, coloque o peito de frango cozido e bem desfiado.',
      'Junte a cenoura ralada bem fininha e o cheiro-verde fresco picado.',
      'Adicione o requeijão cremoso e tempere com uma pitada de sal fino e pimenta-do-reino.',
      'Misture com um garfo até formar um patê cremoso e úmido na medida certa.',
      'Acomode as folhas de alface lavadas e secas sobre as fatias de pão integral e espalhe generosamente o recheio de frango.',
      'Feche os sanduíches pressionando suavemente, corte na diagonal em dois triângulos e sirva fresco.'
    ],
    stepDetails: [
      {
        stepNumber: 1,
        section: 'Preparo da Base',
        text: 'Em uma tigela média, coloque o peito de frango cozido e bem desfiado.',
        image: '/dishes/sug-6.jpg',
        alt: 'Peito de frango desfiado em tigela limpa.',
        tip: 'Desfiar o frango ainda morno facilita obter fibras finas e macias.',
        isKeyFrame: true,
        timerSeconds: 120
      },
      {
        stepNumber: 2,
        section: 'Legumes & Frescor',
        text: 'Junte a cenoura ralada bem fininha e o cheiro-verde fresco picado.',
        image: '/dishes/sug-6.jpg',
        alt: 'Cenoura ralada fininha e ervas frescas incorporadas ao frango.',
        tip: 'A cenoura confere crocância natural e betacaroteno sem adicionar calorias.',
        isKeyFrame: false,
        timerSeconds: 90
      },
      {
        stepNumber: 3,
        section: 'Cremosidade & Liga',
        text: 'Adicione o requeijão cremoso e tempere com uma pitada de sal fino e pimenta-do-reino.',
        image: '/dishes/sug-6.jpg',
        alt: 'Requeijão cremoso adicionado ao frango e legumes.',
        tip: 'Você também pode usar creme de ricota ou iogurte grego natural para variar a textura.',
        isKeyFrame: true,
        timerSeconds: 60
      },
      {
        stepNumber: 4,
        section: 'Homogeneização do Patê',
        text: 'Misture com um garfo até formar um patê cremoso e úmido na medida certa.',
        image: '/dishes/sug-6.jpg',
        alt: 'Recheio de frango cremoso completamente integrado.',
        tip: 'A consistência deve ser firme o bastante para não escorrer para fora do pão.',
        isKeyFrame: true,
        timerSeconds: 90
      },
      {
        stepNumber: 5,
        section: 'Montagem em Camadas',
        text: 'Acomode as folhas de alface lavadas e secas sobre as fatias de pão integral e espalhe generosamente o recheio de frango.',
        image: '/dishes/sug-6.jpg',
        alt: 'Fatias de pão com alface crocante recebendo a camada de frango.',
        tip: 'A folha de alface serve como barreira de proteção para que o pão não absorva umidade excessiva.',
        isKeyFrame: true,
        timerSeconds: 90
      },
      {
        stepNumber: 6,
        section: 'Corte & Apresentação',
        text: 'Feche os sanduíches pressionando suavemente, corte na diagonal em dois triângulos e sirva fresco.',
        image: '/dishes/sug-6.jpg',
        alt: 'Sanduíche cortado ao meio exibindo camadas verdes e recheio cremoso.',
        tip: 'Use faca de serra afiada em movimento de vaivém para um corte limpo sem amassar.',
        isKeyFrame: true,
        timerSeconds: 60
      }
    ],
    sections: [
      { name: 'Preparo do Recheio', stepRange: [1, 4] },
      { name: 'Montagem & Serviço', stepRange: [5, 6] }
    ],
    chefTips: {
      intro: 'Perfeito para café da manhã ou lanche intermediário de altíssima densidade proteica e digestão leve para quem usa Tirzepatida.',
      storage: 'Pode ser embalado individualmente em papel-manteiga ou plástico filme e guardado na geladeira por até 48h.',
      secret: 'Secar muito bem a alface com papel-toalha garante que o pão continue fofo e sem murchar.'
    }
  },

  // CARNE DE PANELA COM MANDIOCA
  'sug-daily-2026-11-01-1': {
    title: 'Carne de Panela com Mandioca',
    category: 'Almoço',
    prepTime: 40,
    servings: 3,
    calories: 430,
    protein: 38,
    carbs: 32,
    fat: 14,
    tags: ['Alta Proteína', 'Tirzepatida', 'Econômico'],
    image: '/dishes/sug-10.jpg',
    source: 'Ficha Técnica NeatEat Brasil — Padrão Gastronômico',
    portionWeight: '350g por porção',
    platingInstructions: 'Servir a carne desfiando com pedaços macios de mandioca envolvidos no molho escuro brilhante.',
    specificInstructions: 'Selar bem a carne em fogo alto para criar a crosta dourada base do caldo antes de tampar a pressão.',
    ingredients: [
      { name: 'Carne bovina em cubos (acém ou músculo)', amount: 450, unit: 'g', aisle: 'Açougue', basePrice: 13.5 },
      { name: 'Mandioca em toletes', amount: 250, unit: 'g', aisle: 'Hortifruti', basePrice: 1.8 },
      { name: 'Cebola picada', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 0.6 },
      { name: 'Tomate maduro em cubos', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 0.9 },
      { name: 'Alho picado', amount: 15, unit: 'g', aisle: 'Hortifruti', basePrice: 0.3 },
      { name: 'Azeite de oliva', amount: 15, unit: 'ml', aisle: 'Mercearia', basePrice: 0.9 },
      { name: 'Cheiro-verde picado', amount: 15, unit: 'g', aisle: 'Hortifruti', basePrice: 0.4 }
    ],
    steps: [
      'Corte a carne em cubos médios de 3 a 4 cm e tempere com alho, sal e pimenta-do-reino.',
      'Aqueça a panela de pressão com o azeite em fogo alto e doure os pedaços de carne por todos os lados.',
      'Junte a cebola picada e o tomate, refogando até a cebola caramelizar no fundo da panela.',
      'Cubra com 300 ml de água quente, tampe a panela e cozinhe sob pressão por 25 minutos.',
      'Despressurize com segurança, adicione a mandioca descascada em toletes e cozinhe por mais 10 minutos sob pressão até desmanchar.',
      'Abra a panela, deixe o caldo ferver por 3 minutos para encorpar e finalizar com cheiro-verde fresco.'
    ],
    stepDetails: [
      {
        stepNumber: 1,
        section: 'Mise en Place & Tempero',
        text: 'Corte a carne em cubos médios de 3 a 4 cm e tempere com alho, sal e pimenta-do-reino.',
        image: '/dishes/sug-10.jpg',
        alt: 'Carne bovina cortada em cubos temperada na tigela.',
        tip: 'Cubos maiores mantêm a suculência interna intacta durante o cozimento sob pressão.',
        isKeyFrame: true,
        timerSeconds: 300
      },
      {
        stepNumber: 2,
        section: 'Selagem em Fogo Alto',
        text: 'Aqueça a panela de pressão com o azeite em fogo alto e doure os pedaços de carne por todos os lados.',
        image: '/dishes/sug-10.jpg',
        alt: 'Cubos de carne selando na panela de pressão quente.',
        tip: 'O dourado intenso do fundo da panela é o que dará a cor escura característica do molho.',
        isKeyFrame: true,
        timerSeconds: 300
      },
      {
        stepNumber: 3,
        section: 'Refogado dos Aromáticos',
        text: 'Junte a cebola picada e o tomate, refogando até a cebola caramelizar no fundo da panela.',
        image: '/dishes/sug-10.jpg',
        alt: 'Cebola e tomate refogando junto com a carne dourada.',
        tip: 'A acidez natural do tomate ajuda a deglacear o fundo da panela.',
        isKeyFrame: false,
        timerSeconds: 180
      },
      {
        stepNumber: 4,
        section: 'Cocção sob Pressão (Carne)',
        text: 'Cubra com 300 ml de água quente, tampe a panela e cozinhe sob pressão por 25 minutos.',
        image: '/dishes/sug-10.jpg',
        alt: 'Carne cozinhando sob pressão com caldo aromático.',
        tip: 'Use fogo médio após pegar pressão para cozimento uniforme das fibras.',
        isKeyFrame: true,
        timerSeconds: 1500
      },
      {
        stepNumber: 5,
        section: 'Cocção da Mandioca',
        text: 'Despressurize com segurança, adicione a mandioca descascada em toletes e cozinhe por mais 10 minutos sob pressão até desmanchar.',
        image: '/dishes/sug-10.jpg',
        alt: 'Toletes de mandioca adicionados à panela com a carne macia.',
        tip: 'A mandioca absorve o caldo saboroso da carne e amacia rapidamente.',
        isKeyFrame: true,
        timerSeconds: 600
      },
      {
        stepNumber: 6,
        section: 'Redução do Molho & Finalização',
        text: 'Abra a panela, deixe o caldo ferver por 3 minutos para encorpar e finalizar com cheiro-verde fresco.',
        image: '/dishes/sug-10.jpg',
        alt: 'Prato fumegante com carne desmanchando e mandioca cremosa.',
        tip: 'O amido liberado pela mandioca engrossa o caldo naturalmente sem necessidade de farinhas.',
        isKeyFrame: true,
        timerSeconds: 180
      }
    ],
    sections: [
      { name: 'Selagem & Aromáticos', stepRange: [1, 3] },
      { name: 'Pressão & Cozimento', stepRange: [4, 5] },
      { name: 'Redução & Serviço', stepRange: [6, 6] }
    ],
    chefTips: {
      intro: 'Prato clássico da culinária caseira brasileira, fornece colágeno, ferro e carboidrato de baixo índice glicêmico.',
      storage: 'Excelente para marmita e congela com perfeição por até 30 dias em pote hermético.',
      secret: 'Cozinhar a mandioca no caldo da própria carne faz toda a diferença no sabor final.'
    }
  }
};

export function runDatabaseMigration(dbInstance) {
  console.log('Iniciando migração de banco de dados para v3.0 padronizada...');

  // 1. Dicionário de títulos curtos padronizados
  const TITLE_MAP = {
    'Sanduíche Natural de Frango Cremoso no Pão Integral': 'Sanduíche de Frango Cremoso',
    'Strogonoff Caseiro de Frango com Batata Palha': 'Strogonoff de Frango',
    'Strogonoff Caseiro de Frango com Arroz e Batata Palha': 'Strogonoff de Frango',
    'Frango Xadrez Oriental com Pimentões': 'Frango Xadrez',
    'Crepioca Proteica com Queijo Coalho e Tomate': 'Crepioca com Queijo Coalho',
    'Overnight Oats de Banana, Aveia e Pasta de Amendoim': 'Overnight Oats de Banana',
    'Ovos Mexidos Cremosos com Pão Francês e Mamão': 'Ovos Mexidos com Pão Francês',
    'Cuscuz Nordestino com Ovo Estrelado e Coentro': 'Cuscuz com Ovo Estrelado',
    'PF Brasileiro: Frango Grelhado, Arroz, Feijão Carioca e Salada': 'PF de Frango Grelhado',
    'Picadinho de Carne Moída com Abóbora Cabotiá e Arroz Integral': 'Picadinho com Abóbora',
    'Escondidinho de Mandioca com Frango Desfiado': 'Escondidinho de Frango',
    'Strogonoff Econômico de Grão-de-Bico e Cogumelos com Batata Assada': 'Strogonoff de Grão-de-Bico',
    'Tilápia Grelhada ao Limão com Purê de Batata e Brócolis': 'Tilápia com Purê e Brócolis',
    'Omelete de Forno com Abobrinha, Cenoura e Queijo': 'Omelete de Forno com Legumes',
    'Caldo Verde Fit de Mandioquinha com Frango Desfiado e Couve': 'Caldo Verde com Frango',
    'Macarrão ao Alho, Óleo, Brócolis e Iscas de Frango': 'Macarrão com Frango e Brócolis',
    'Bowl Mexicano Brasileiro (Arroz, Feijão Preto, Carne Moída e Abacate)': 'Bowl Mexicano com Carne',
    'Frigideira Low Carb de Frango, Abobrinha e Tomate Cereja': 'Frigideira de Frango e Legumes',
    'Carne de Panela Desfiada com Mandioca Cozida': 'Carne de Panela com Mandioca',
    'Suflê Leve de Legumes com Queijo Gratinado': 'Suflê de Legumes Gratinado',
    'Omelete Recheado com Queijo Minas e Ervas Finas': 'Omelete com Queijo Minas',
    'Carne louca com miolo de acém': 'Carne Louca'
  };

  // 2. Atualiza títulos e imagens de receitas no banco
  const recipes = dbInstance.prepare('SELECT * FROM recipes').all();
  for (const r of recipes) {
    let nextTitle = TITLE_MAP[r.title] || r.title;
    let nextImage = r.image;
    let nextSteps = null;
    let nextStepDetails = null;
    let nextSections = null;
    let nextChefTips = null;
    let nextTags = JSON.parse(r.tags_json || '[]');

    // Corrige fotos quebradas específicas
    if (r.id === 'sug-daily-2026-10-31-2' || nextTitle.includes('Strogonoff')) {
      nextTitle = 'Strogonoff de Frango';
      nextImage = '/dishes/sug-9.jpg';
      const up = RECIPE_UPGRADES['sug-daily-2026-10-31-2'];
      nextSteps = up.steps;
      nextStepDetails = up.stepDetails;
      nextSections = up.sections;
      nextChefTips = up.chefTips;
      if (!nextTags.includes('Tirzepatida')) nextTags.push('Tirzepatida');
    } else if (r.id === 'sug-daily-2026-11-01-2' || nextTitle.includes('Sanduíche')) {
      nextTitle = 'Sanduíche de Frango Cremoso';
      nextImage = '/dishes/sug-6.jpg';
      const up = RECIPE_UPGRADES['sug-daily-2026-11-01-2'];
      nextSteps = up.steps;
      nextStepDetails = up.stepDetails;
      nextSections = up.sections;
      nextChefTips = up.chefTips;
      if (!nextTags.includes('Tirzepatida')) nextTags.push('Tirzepatida');
    } else if (r.id === 'sug-9' || nextTitle.includes('Xadrez')) {
      nextTitle = 'Frango Xadrez';
      nextImage = '/dishes/frango-xadrez.jpg';
      const up = RECIPE_UPGRADES['sug-9'];
      nextSteps = up.steps;
      nextStepDetails = up.stepDetails;
      nextSections = up.sections;
      nextChefTips = up.chefTips;
      if (!nextTags.includes('Tirzepatida')) nextTags.push('Tirzepatida');
    } else if (r.id === 'sug-daily-2026-11-01-1' || nextTitle.includes('Carne de Panela')) {
      nextTitle = 'Carne de Panela com Mandioca';
      nextImage = '/dishes/sug-10.jpg';
      const up = RECIPE_UPGRADES['sug-daily-2026-11-01-1'];
      nextSteps = up.steps;
      nextStepDetails = up.stepDetails;
      nextSections = up.sections;
      nextChefTips = up.chefTips;
      if (!nextTags.includes('Tirzepatida')) nextTags.push('Tirzepatida');
    } else if (r.id === 'sug-daily-2026-11-02-1' || nextTitle.includes('Suflê')) {
      nextTitle = 'Suflê de Legumes Gratinado';
      nextImage = '/dishes/sug-23.jpg';
    } else if (r.id === 'sug-daily-2026-11-02-2' || nextTitle.includes('Omelete')) {
      nextTitle = 'Omelete com Queijo Minas';
      nextImage = '/dishes/sug-8.jpg';
      if (!nextTags.includes('Tirzepatida')) nextTags.push('Tirzepatida');
    }

    // Marca receitas aliadas da Tirzepatida por critérios nutricionais
    if (r.protein >= 24 && r.fat <= 16 && !nextTags.includes('Tirzepatida')) {
      nextTags.push('Tirzepatida');
    }

    // Se a receita tem passos genéricos ou poucos passos e não foi atualizada acima
    let currentSteps = JSON.parse(r.steps_json || '[]');
    let currentDetails = JSON.parse(r.step_details_json || '[]');

    if (!nextSteps) {
      nextSteps = currentSteps;
    }
    if (!nextStepDetails) {
      if (currentDetails && currentDetails.length >= nextSteps.length) {
        nextStepDetails = currentDetails;
      } else {
        nextStepDetails = nextSteps.map((stepText, idx) => ({
          stepNumber: idx + 1,
          section: idx === 0 ? 'Mise en Place' : idx === nextSteps.length - 1 ? 'Finalização' : 'Preparo',
          text: stepText,
          image: nextImage || '/dishes/rec-5.jpg',
          alt: `Passo ${idx + 1}: ${nextTitle}`,
          tip: 'Mantenha fogo moderado e controle de tempo para textura perfeita.',
          isKeyFrame: true,
          timerSeconds: 120
        }));
      }
    }

    dbInstance.prepare(`
      UPDATE recipes
      SET title = ?, image = ?, steps_json = ?, step_details_json = ?, tags_json = ?
      WHERE id = ?
    `).run(
      nextTitle,
      nextImage,
      JSON.stringify(nextSteps),
      JSON.stringify(nextStepDetails),
      JSON.stringify(nextTags),
      r.id
    );

    if (nextSections) {
      dbInstance.prepare('UPDATE recipes SET sections_json = ? WHERE id = ?').run(JSON.stringify(nextSections), r.id);
    }
    if (nextChefTips) {
      dbInstance.prepare('UPDATE recipes SET chef_tips_json = ? WHERE id = ?').run(JSON.stringify(nextChefTips), r.id);
    }
  }

  // 3. Atualiza daily_discovered_recipes
  const dailyRows = dbInstance.prepare('SELECT id, recipe_json FROM daily_discovered_recipes').all();
  for (const row of dailyRows) {
    try {
      const parsed = JSON.parse(row.recipe_json);
      if (TITLE_MAP[parsed.title]) {
        parsed.title = TITLE_MAP[parsed.title];
      }
      if (parsed.id === 'sug-daily-2026-10-31-2' || parsed.title.includes('Strogonoff')) {
        parsed.image = '/dishes/sug-9.jpg';
        parsed.title = 'Strogonoff de Frango';
        const up = RECIPE_UPGRADES['sug-daily-2026-10-31-2'];
        parsed.steps = up.steps;
        parsed.stepDetails = up.stepDetails;
      } else if (parsed.id === 'sug-daily-2026-11-01-2' || parsed.title.includes('Sanduíche')) {
        parsed.image = '/dishes/sug-6.jpg';
        parsed.title = 'Sanduíche de Frango Cremoso';
        const up = RECIPE_UPGRADES['sug-daily-2026-11-01-2'];
        parsed.steps = up.steps;
        parsed.stepDetails = up.stepDetails;
      } else if (parsed.id === 'sug-daily-2026-11-01-1' || parsed.title.includes('Carne de Panela')) {
        parsed.image = '/dishes/sug-10.jpg';
        parsed.title = 'Carne de Panela com Mandioca';
        const up = RECIPE_UPGRADES['sug-daily-2026-11-01-1'];
        parsed.steps = up.steps;
        parsed.stepDetails = up.stepDetails;
      }

      // Garante que stepDetails exista
      if (!parsed.stepDetails || parsed.stepDetails.length === 0) {
        parsed.stepDetails = (parsed.steps || []).map((stepText, idx) => ({
          stepNumber: idx + 1,
          section: idx === 0 ? 'Mise en Place' : idx === parsed.steps.length - 1 ? 'Finalização' : 'Preparo',
          text: stepText,
          image: parsed.image || '/dishes/rec-5.jpg',
          alt: `Passo ${idx + 1}: ${parsed.title}`,
          tip: 'Ajuste os temperos ao seu paladar.',
          isKeyFrame: true,
          timerSeconds: 120
        }));
      }

      dbInstance.prepare('UPDATE daily_discovered_recipes SET recipe_json = ? WHERE id = ?').run(JSON.stringify(parsed), row.id);
    } catch (e) {}
  }

  console.log('Migração concluída com sucesso!');
}

// Execução direta nos dois bancos (dev e Application Support)
const dbPaths = [
  path.resolve('./server/neateat.sqlite'),
  '/Users/nilodanilo101/Library/Application Support/neat-eat-br/neateat.sqlite'
];

for (const p of dbPaths) {
  if (fs.existsSync(p)) {
    console.log(`Aplicando migração em: ${p}`);
    const db = new DatabaseSync(p);
    runDatabaseMigration(db);
    db.close();
  }
}
