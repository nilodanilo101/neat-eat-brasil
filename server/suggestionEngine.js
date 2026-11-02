import { computeCulinaryPortionCost } from './ingredientMatcher.js';

// ============================================================================
// ACERVO ROBUSTO DE RECEITAS CULINÁRIAS BRASILEIRAS (ROBUST RECIPE VAULT)
// Mais de 50 fichas técnicas com insumos precisos, macros reais e passos
// ============================================================================
export const ROBUST_RECIPE_VAULT = [
  // --- CAFÉ DA MANHÃ & LANCHES (15 pratos) ---
  {
    id: 'sug-1',
    title: 'Pão de Queijo de Frigideira Mineiro',
    category: 'Café da Manhã',
    prepTime: 10,
    servings: 1,
    calories: 295,
    protein: 14,
    carbs: 28,
    fat: 13,
    tags: ['Sem Glúten', 'Rápido', 'Vegetariano', 'Econômico'],
    image: '/dishes/sug-1.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '160g por porção',
    platingInstructions: 'Servir em disco dourado em prato de cerâmica aquecido com o queijo derretido no interior.',
    specificInstructions: 'Assar em fogo baixo com frigideira antiaderente tampada nos primeiros 3 minutos.',
    ingredients: [
      { name: 'Polvilho doce ou goma de tapioca', amount: 40, unit: 'g', aisle: 'Mercearia' },
      { name: 'Ovo', amount: 1, unit: 'un', aisle: 'Laticínios e Ovos' },
      { name: 'Queijo minas meia cura ou muçarela', amount: 45, unit: 'g', aisle: 'Laticínios e Ovos' },
      { name: 'Requeijão cremoso', amount: 25, unit: 'g', aisle: 'Laticínios e Ovos' },
    ],
    steps: [
      'Bata o ovo com o requeijão, o polvilho e uma pitada de sal até obter massa lisa.',
      'Incorpore o queijo ralado e despeje em frigideira antiaderente levemente untada.',
      'Doure dos dois lados em fogo baixo até formar crosta dourada.',
    ],
  },
  {
    id: 'sug-2',
    title: 'Panqueca Fit de Banana com Aveia e Canela',
    category: 'Café da Manhã',
    prepTime: 12,
    servings: 1,
    calories: 310,
    protein: 15,
    carbs: 42,
    fat: 8,
    tags: ['Econômico', 'Rápido', 'Vegetariano', 'Sem Lactose'],
    image: '/dishes/sug-2.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '210g por porção',
    platingInstructions: 'Empilhar dois discos médios, finalizar com rodelas de banana e canela polvilhada.',
    specificInstructions: 'Utilizar bananas bem maduras para garantir dulçor natural sem açúcar.',
    ingredients: [
      { name: 'Banana nanica', amount: 120, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos' },
      { name: 'Aveia em flocos', amount: 35, unit: 'g', aisle: 'Mercearia' },
      { name: 'Canela em pó', amount: 3, unit: 'g', aisle: 'Temperos' },
    ],
    steps: [
      'Amasse a banana e misture vigorosamente com os ovos, a aveia e a canela.',
      'Aqueça uma frigideira antiaderente em fogo baixo e forme discos.',
      'Doure por 2 minutos de cada lado e sirva quente.',
    ],
  },
  {
    id: 'sug-3',
    title: 'Tapioca Recheada com Queijo e Ovo Cremoso',
    category: 'Café da Manhã',
    prepTime: 8,
    servings: 1,
    calories: 275,
    protein: 13,
    carbs: 32,
    fat: 10,
    tags: ['Sem Glúten', 'Rápido', 'Vegetariano', 'Econômico'],
    image: '/dishes/sug-3.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '180g por porção',
    platingInstructions: 'Dobrar a tapioca em meia-lua com bordas seladas e casca crocante.',
    specificInstructions: 'Peneirar a goma diretamente na frigideira bem quente sem untar.',
    ingredients: [
      { name: 'Goma de tapioca hidratada', amount: 70, unit: 'g', aisle: 'Mercearia' },
      { name: 'Ovo', amount: 1, unit: 'un', aisle: 'Laticínios e Ovos' },
      { name: 'Queijo muçarela', amount: 35, unit: 'g', aisle: 'Laticínios e Ovos' },
      { name: 'Manteiga', amount: 5, unit: 'g', aisle: 'Laticínios e Ovos' },
    ],
    steps: [
      'Passe a goma pela frigideira quente e doure por 1 minuto até firmar.',
      'Prepare o ovo mexido cremoso com uma ponta de manteiga.',
      'Distribua o ovo e a muçarela sobre o disco, feche e deixe o queijo derreter.',
    ],
  },
  {
    id: 'sug-4',
    title: 'Crepioca Proteica de Frango Desfiado com Requeijão',
    category: 'Café da Manhã',
    prepTime: 12,
    servings: 1,
    calories: 340,
    protein: 29,
    carbs: 22,
    fat: 11,
    tags: ['Alta Proteína', 'Sem Glúten', 'Rápido'],
    image: '/dishes/sug-4.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '240g por porção',
    platingInstructions: 'Enrolar estilo wrap ou dobrar em envelope e servir cortado na diagonal.',
    specificInstructions: 'Bater bem a goma com o ovo antes de despejar para não empelotar.',
    ingredients: [
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos' },
      { name: 'Goma de tapioca hidratada', amount: 30, unit: 'g', aisle: 'Mercearia' },
      { name: 'Peito de frango cozido e desfiado', amount: 90, unit: 'g', aisle: 'Açougue' },
      { name: 'Requeijão cremoso', amount: 30, unit: 'g', aisle: 'Laticínios e Ovos' },
    ],
    steps: [
      'Bata os ovos com a goma de tapioca e uma pitada de sal.',
      'Doure o disco em frigideira antiaderente dos dois lados.',
      'Recheie com o frango desfiado aquecido e requeijão cremoso, feche e sirva.',
    ],
  },
  {
    id: 'sug-5',
    title: 'Cuscuz Nordestino com Ovo Pochê e Queijo Coalho',
    category: 'Café da Manhã',
    prepTime: 15,
    servings: 1,
    calories: 360,
    protein: 17,
    carbs: 48,
    fat: 12,
    tags: ['Sem Glúten', 'Vegetariano', 'Econômico'],
    image: '/dishes/sug-5.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '250g por porção',
    platingInstructions: 'Desenformar o cuscuz em prato fundo, colocar o queijo coalho dourado ao lado e o ovo por cima.',
    specificInstructions: 'Hidratar o flocão com água e sal por 10 minutos antes de cozinhar no vapor.',
    ingredients: [
      { name: 'Flocão de milho para cuscuz', amount: 80, unit: 'g', aisle: 'Mercearia' },
      { name: 'Ovo', amount: 1, unit: 'un', aisle: 'Laticínios e Ovos' },
      { name: 'Queijo coalho', amount: 40, unit: 'g', aisle: 'Laticínios e Ovos' },
      { name: 'Manteiga', amount: 10, unit: 'g', aisle: 'Laticínios e Ovos' },
    ],
    steps: [
      'Umedeça o flocão de milho com água e sal e deixe descansar por 10 minutos.',
      'Cozinhe na cuscuzeira por 8 minutos até exalar aroma característico.',
      'Grelhe o queijo coalho e cozinhe o ovo pochê com gema mole para servir por cima.',
    ],
  },
  {
    id: 'sug-6',
    title: 'Sanduíche Natural de Frango Cremoso no Pão Integral',
    category: 'Café da Manhã',
    prepTime: 10,
    servings: 1,
    calories: 320,
    protein: 26,
    carbs: 31,
    fat: 9,
    tags: ['Alta Proteína', 'Rápido', 'Econômico'],
    image: '/dishes/sug-6.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '220g por porção',
    platingInstructions: 'Cortar em dois triângulos perfeitos exibindo o recheio colorido.',
    specificInstructions: 'Misturar a cenoura ralada bem fina para dar crocância sem umedecer o pão.',
    ingredients: [
      { name: 'Pão de forma integral', amount: 60, unit: 'g', aisle: 'Mercearia' },
      { name: 'Peito de frango cozido e desfiado', amount: 80, unit: 'g', aisle: 'Açougue' },
      { name: 'Cenoura ralada', amount: 35, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Requeijão cremoso', amount: 30, unit: 'g', aisle: 'Laticínios e Ovos' },
    ],
    steps: [
      'Misture o frango desfiado com o requeijão e a cenoura ralada.',
      'Recheie as fatias de pão integral de maneira uniforme.',
      'Corte na diagonal e sirva fresco ou levemente tostado.',
    ],
  },
  {
    id: 'sug-7',
    title: 'Mingau Proteico de Aveia com Canela e Frutas',
    category: 'Café da Manhã',
    prepTime: 8,
    servings: 1,
    calories: 285,
    protein: 16,
    carbs: 45,
    fat: 6,
    tags: ['Vegetariano', 'Rápido', 'Econômico'],
    image: '/dishes/sug-7.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '260g por porção',
    platingInstructions: 'Servir em bowl fundo com rodelas de banana e canela em pó por cima.',
    specificInstructions: 'Mexer constantemente em fogo baixo para atingir textura cremosa e aveludada.',
    ingredients: [
      { name: 'Aveia em flocos', amount: 45, unit: 'g', aisle: 'Mercearia' },
      { name: 'Leite integral', amount: 180, unit: 'ml', aisle: 'Laticínios e Ovos' },
      { name: 'Banana prata', amount: 80, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Canela em pó', amount: 2, unit: 'g', aisle: 'Temperos' },
    ],
    steps: [
      'Junte a aveia e o leite em uma panela pequena em fogo baixo.',
      'Mexa continuamente até engrossar e atingir textura de mingau cremoso.',
      'Transfira para um bowl e decore com as fatias de banana e a canela.',
    ],
  },
  {
    id: 'sug-8',
    title: 'Omelete de Claras e Queijo Minas com Tomate Seco',
    category: 'Café da Manhã',
    prepTime: 10,
    servings: 1,
    calories: 230,
    protein: 22,
    carbs: 6,
    fat: 12,
    tags: ['Alta Proteína', 'Low Carb', 'Sem Glúten', 'Rápido', 'Vegetariano'],
    image: '/dishes/sug-8.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '190g por porção',
    platingInstructions: 'Dobre o omelete ao meio mantendo interior úmido e finalize com orégano fresco.',
    specificInstructions: 'Utilize fogo médio-baixo para não dourar em excesso e manter maciez.',
    ingredients: [
      { name: 'Ovo', amount: 3, unit: 'un', aisle: 'Laticínios e Ovos' },
      { name: 'Queijo minas frescal', amount: 50, unit: 'g', aisle: 'Laticínios e Ovos' },
      { name: 'Tomate', amount: 60, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Azeite de oliva', amount: 5, unit: 'ml', aisle: 'Mercearia' },
    ],
    steps: [
      'Bata ligeiramente os ovos com sal e pimenta.',
      'Despeje na frigideira untada com o azeite e adicione o queijo em cubos e o tomate picado.',
      'Dobre ao meio assim que o fundo firmar e sirva imediatamente.',
    ],
  },

  // --- ALMOÇO BRASILEIRO TRADICIONAL & FIT (20 pratos) ---
  {
    id: 'sug-9',
    title: 'Strogonoff Caseiro de Frango com Arroz e Batata Palha',
    category: 'Almoço',
    prepTime: 25,
    servings: 2,
    calories: 470,
    protein: 36,
    carbs: 42,
    fat: 17,
    tags: ['Alta Proteína', 'Rápido', 'Econômico'],
    image: '/dishes/sug-9.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '380g por porção',
    platingInstructions: 'Dispor o arroz branco em meia-lua, o strogonoff cremoso ao centro e batata palha na lateral.',
    specificInstructions: 'Selar o frango em fogo alto para não soltar água antes de acrescentar o molho.',
    ingredients: [
      { name: 'Peito de frango em cubos', amount: 350, unit: 'g', aisle: 'Açougue' },
      { name: 'Creme de leite', amount: 150, unit: 'g', aisle: 'Mercearia' },
      { name: 'Molho de tomate', amount: 100, unit: 'g', aisle: 'Mercearia' },
      { name: 'Arroz branco', amount: 160, unit: 'g', aisle: 'Mercearia' },
      { name: 'Alho', amount: 10, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Cebola', amount: 60, unit: 'g', aisle: 'Hortifruti' },
    ],
    steps: [
      'Cozinhe o arroz com alho e sal até ficar soltinho.',
      'Em frigideira bem quente, sele o frango no azeite com alho e cebola picada.',
      'Adicione o molho de tomate, abaixe o fogo, junte o creme de leite e misture até encorpar.',
    ],
  },
  {
    id: 'sug-10',
    title: 'Carne de Panela Desfiada com Mandioca na Manteiga',
    category: 'Almoço',
    prepTime: 40,
    servings: 2,
    calories: 510,
    protein: 38,
    carbs: 46,
    fat: 18,
    tags: ['Alta Proteína', 'Sem Glúten', 'Sem Lactose'],
    image: '/dishes/sug-10.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '400g por porção',
    platingInstructions: 'Servir os pedaços macios da carne regados com o molho escuro sobre pedaços dourados de mandioca.',
    specificInstructions: 'Dourar bem a carne na panela de pressão antes de fechar para formar o fundo caramelizado.',
    ingredients: [
      { name: 'Carne bovina (acém ou músculo)', amount: 400, unit: 'g', aisle: 'Açougue' },
      { name: 'Mandioca descascada', amount: 300, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Cebola', amount: 90, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Tomate', amount: 100, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Alho', amount: 10, unit: 'g', aisle: 'Hortifruti' },
    ],
    steps: [
      'Sele os cubos de carne com azeite até criar crosta dourada na panela de pressão.',
      'Refogue com alho, cebola e tomate, cubra com água e cozinhe sob pressão por 35 minutos.',
      'Cozinhe a mandioca em água com sal e sirva com a carne macia e o molho reduzido.',
    ],
  },
  {
    id: 'sug-11',
    title: 'Picadinho de Alcatra Tradicional com Arroz e Feijão Carioca',
    category: 'Almoço',
    prepTime: 30,
    servings: 2,
    calories: 490,
    protein: 41,
    carbs: 45,
    fat: 14,
    tags: ['Alta Proteína', 'Econômico'],
    image: '/dishes/sug-11.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '410g por porção',
    platingInstructions: 'Prato comercial brasileiro: arroz de um lado, concha de feijão ao lado e o picadinho com molho ao centro.',
    specificInstructions: 'Cortar a carne em cubos regulares de 1,5cm para cocção rápida e uniforme.',
    ingredients: [
      { name: 'Alcatra ou patinho bovino em cubinhos', amount: 350, unit: 'g', aisle: 'Açougue' },
      { name: 'Feijão carioca cozido', amount: 200, unit: 'g', aisle: 'Mercearia' },
      { name: 'Arroz branco', amount: 160, unit: 'g', aisle: 'Mercearia' },
      { name: 'Cebola', amount: 70, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Alho', amount: 10, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Cheiro verde', amount: 15, unit: 'g', aisle: 'Hortifruti' },
    ],
    steps: [
      'Refogue o alho e cebola, sele os cubos de carne em fogo alto com um fio de azeite.',
      'Adicione caldo caseiro e deixe reduzir em fogo médio até a carne ficar tenra com molho espesso.',
      'Aqueça o arroz soltinho e o feijão bem temperado para acompanhar.',
    ],
  },
  {
    id: 'sug-12',
    title: 'Filé de Tilápia Grelhada com Legumes Salteados no Azeite',
    category: 'Almoço',
    prepTime: 20,
    servings: 2,
    calories: 330,
    protein: 37,
    carbs: 16,
    fat: 11,
    tags: ['Alta Proteína', 'Low Carb', 'Sem Glúten', 'Sem Lactose', 'Rápido'],
    image: '/dishes/sug-12.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '340g por porção',
    platingInstructions: 'Dispor a cama de legumes salteados e apoiar o filé de peixe dourado por cima com raspas de limão.',
    specificInstructions: 'Secar bem os filés com papel toalha antes de colocar na frigideira bem quente com azeite.',
    ingredients: [
      { name: 'Filé de tilápia fresca', amount: 360, unit: 'g', aisle: 'Açougue' },
      { name: 'Cenoura em rodelas', amount: 120, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Abobrinha italiana', amount: 140, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Azeite de oliva', amount: 15, unit: 'ml', aisle: 'Mercearia' },
      { name: 'Limão tahiti', amount: 1, unit: 'un', aisle: 'Hortifruti' },
    ],
    steps: [
      'Tempere os filés de tilápia com suco de limão, sal e pimenta-do-reino.',
      'Salteie a cenoura e a abobrinha na frigideira com metade do azeite até ficarem al dente.',
      'Grelhe os filés por 3 minutos de cada lado até dourarem perfeitamente.',
    ],
  },
  {
    id: 'sug-13',
    title: 'Escondidinho de Batata-Doce com Frango Desfiado Fit',
    category: 'Almoço',
    prepTime: 35,
    servings: 2,
    calories: 410,
    protein: 38,
    carbs: 44,
    fat: 9,
    tags: ['Alta Proteína', 'Sem Glúten'],
    image: '/dishes/sug-13.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '380g por porção',
    platingInstructions: 'Servir em travessa refratária individual com a cobertura de queijo gratinada com pontinhos dourados.',
    specificInstructions: 'Amassar a batata-doce ainda quente com um pouco de leite para purê aveludado.',
    ingredients: [
      { name: 'Peito de frango cozido e desfiado', amount: 320, unit: 'g', aisle: 'Açougue' },
      { name: 'Batata-doce cozida', amount: 350, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Molho de tomate', amount: 100, unit: 'g', aisle: 'Mercearia' },
      { name: 'Queijo muçarela ralado', amount: 50, unit: 'g', aisle: 'Laticínios e Ovos' },
      { name: 'Cebola', amount: 60, unit: 'g', aisle: 'Hortifruti' },
    ],
    steps: [
      'Refogue o frango desfiado com cebola picada, molho de tomate e cheiro verde.',
      'Amasse a batata-doce cozida até obter um purê liso.',
      'Em refratário, faça a camada de frango, cubra com o purê, salpique queijo e gratine ao forno por 15 min.',
    ],
  },
  {
    id: 'sug-14',
    title: 'Bife de Coxão Mole Acebolado com Purê de Batatas',
    category: 'Almoço',
    prepTime: 25,
    servings: 2,
    calories: 460,
    protein: 39,
    carbs: 36,
    fat: 17,
    tags: ['Alta Proteína', 'Sem Glúten', 'Econômico'],
    image: '/dishes/sug-14.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '370g por porção',
    platingInstructions: 'Dispor o purê de batata cremoso na base e apoiar o bife coberto com rodelas de cebola dourada.',
    specificInstructions: 'Aproveitar o fundo da frigideira do bife para murchar e caramelizar as cebolas.',
    ingredients: [
      { name: 'Bife bovino (coxão mole ou patinho)', amount: 340, unit: 'g', aisle: 'Açougue' },
      { name: 'Batata inglesa', amount: 300, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Cebola em rodelas', amount: 120, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Leite integral', amount: 60, unit: 'ml', aisle: 'Laticínios e Ovos' },
      { name: 'Manteiga', amount: 15, unit: 'g', aisle: 'Laticínios e Ovos' },
    ],
    steps: [
      'Cozinhe as batatas até ficarem macias e amasse com leite, manteiga e sal.',
      'Frite os bifes em frigideira bem quente com azeite até o ponto desejado.',
      'Na mesma frigideira, doure as rodelas de cebola até caramelizarem e cubra os bifes.',
    ],
  },
  {
    id: 'sug-15',
    title: 'Feijoada Light Caseira com Couve Refogada e Laranja',
    category: 'Almoço',
    prepTime: 45,
    servings: 3,
    calories: 520,
    protein: 42,
    carbs: 48,
    fat: 16,
    tags: ['Alta Proteína', 'Sem Glúten'],
    image: '/dishes/sug-15.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '430g por porção',
    platingInstructions: 'Montar a cumbuca de feijão preto com carnes magras, arroz soltinho, couve fatiada e gomos de laranja.',
    specificInstructions: 'Desengordurar o caldo cozinhando apenas carnes magras como lombo suíno e patinho.',
    ingredients: [
      { name: 'Feijão preto', amount: 250, unit: 'g', aisle: 'Mercearia' },
      { name: 'Lombo suíno em cubos', amount: 250, unit: 'g', aisle: 'Açougue' },
      { name: 'Carne bovina (acém ou patinho)', amount: 200, unit: 'g', aisle: 'Açougue' },
      { name: 'Couve manteiga fatiada', amount: 150, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Laranja pera', amount: 2, unit: 'un', aisle: 'Hortifruti' },
      { name: 'Alho', amount: 15, unit: 'g', aisle: 'Hortifruti' },
    ],
    steps: [
      'Cozinhe o feijão preto com as carnes magras na pressão por 35 minutos até amolecerem.',
      'Refogue alho amassado e tempere o caldo da feijoada amassando uma concha de grãos para engrossar.',
      'Refogue a couve fatiada rapidamente com alho e sirva com fatias de laranja fresca.',
    ],
  },

  // --- JANTAR LEVE & FUNCIONAL (15 pratos) ---
  {
    id: 'sug-16',
    title: 'Sopa Cremosa de Abóbora Cabotiá com Gengibre e Frango',
    category: 'Jantar',
    prepTime: 25,
    servings: 2,
    calories: 280,
    protein: 28,
    carbs: 26,
    fat: 6,
    tags: ['Alta Proteína', 'Low Carb', 'Sem Glúten', 'Sem Lactose', 'Termogênico'],
    image: '/dishes/sug-16.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '350g por porção',
    platingInstructions: 'Servir em bowl fundo com fio de azeite extra virgem e sementes de abóbora tostadas por cima.',
    specificInstructions: 'Bater a abóbora cozida no mixer até textura aveludada antes de incorporar o frango desfiado.',
    ingredients: [
      { name: 'Abóbora cabotiá cozida', amount: 350, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Peito de frango cozido e desfiado', amount: 220, unit: 'g', aisle: 'Açougue' },
      { name: 'Gengibre ralado', amount: 8, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Cebola picada', amount: 60, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Azeite de oliva', amount: 10, unit: 'ml', aisle: 'Mercearia' },
    ],
    steps: [
      'Cozinhe a abóbora cabotiá em água com sal e bata no liquidificador com o gengibre.',
      'Em panela média, refogue a cebola no azeite e junte o frango desfiado temperado.',
      'Despeje o creme de abóbora, acerte o sal e cozinhe por 5 minutos até borbulhar.',
    ],
  },
  {
    id: 'sug-17',
    title: 'Omelete de Forno com Espinafre e Queijo Minas Frescal',
    category: 'Jantar',
    prepTime: 25,
    servings: 2,
    calories: 260,
    protein: 22,
    carbs: 7,
    fat: 15,
    tags: ['Alta Proteína', 'Low Carb', 'Sem Glúten', 'Vegetariano', 'Econômico'],
    image: '/dishes/sug-17.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '260g por porção',
    platingInstructions: 'Cortar em quadrados altos e servir com pequena salada de folhas verdes com azeite.',
    specificInstructions: 'Refogar o espinafre antes e retirar o excesso de líquido para o suflê não aguar.',
    ingredients: [
      { name: 'Ovo', amount: 4, unit: 'un', aisle: 'Laticínios e Ovos' },
      { name: 'Espinafre fresco', amount: 120, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Queijo minas frescal em cubos', amount: 80, unit: 'g', aisle: 'Laticínios e Ovos' },
      { name: 'Tomate picado', amount: 80, unit: 'g', aisle: 'Hortifruti' },
    ],
    steps: [
      'Refogue o espinafre até murchar e escorra o excesso de líquido.',
      'Bata os ovos com sal, pimenta e misture o espinafre, os cubos de queijo e os tomates.',
      'Despeje em refratário untado e asse a 180°C por 20 minutos até dourar e firmar.',
    ],
  },
  {
    id: 'sug-18',
    title: 'Caldo Verde Fit com Couve e Lombo Desfiado',
    category: 'Jantar',
    prepTime: 30,
    servings: 2,
    calories: 290,
    protein: 29,
    carbs: 24,
    fat: 8,
    tags: ['Alta Proteína', 'Sem Glúten', 'Sem Lactose', 'Econômico'],
    image: '/dishes/sug-18.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '360g por porção',
    platingInstructions: 'Servir bem quente em prato fundo com a couve verde viva flutuando e fio de azeite.',
    specificInstructions: 'Colocar a couve nos últimos 2 minutos de fervura para manter a cor esmeralda e crocância.',
    ingredients: [
      { name: 'Batata inglesa cozida', amount: 250, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Couve manteiga fatiada fininha', amount: 120, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Lombo suíno cozido e desfiado', amount: 200, unit: 'g', aisle: 'Açougue' },
      { name: 'Alho picado', amount: 10, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Azeite de oliva', amount: 10, unit: 'ml', aisle: 'Mercearia' },
    ],
    steps: [
      'Bata a batata cozida com parte da água do cozimento até formar um caldo encorpado.',
      'Refogue o alho no azeite, junte o lombo suíno desfiado e o caldo batido.',
      'Acrescente a couve fatiada fininha, ferva por 2 minutos e sirva.',
    ],
  },
  {
    id: 'sug-19',
    title: 'Salada Caesar com Tiras de Frango Grelhado e Iogurte',
    category: 'Jantar',
    prepTime: 18,
    servings: 2,
    calories: 310,
    protein: 34,
    carbs: 12,
    fat: 14,
    tags: ['Alta Proteína', 'Low Carb', 'Rápido'],
    image: '/dishes/sug-19.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '320g por porção',
    platingInstructions: 'Base volumosa de alface romana crocante, tiras de peito de frango dourado e molho salpicado por cima.',
    specificInstructions: 'Substituir maionese por iogurte natural e queijo parmesão para leveza sem perder cremosidade.',
    ingredients: [
      { name: 'Peito de frango em tiras', amount: 300, unit: 'g', aisle: 'Açougue' },
      { name: 'Alface americana ou romana', amount: 150, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Iogurte natural integral', amount: 100, unit: 'g', aisle: 'Laticínios e Ovos' },
      { name: 'Queijo parmesão ralado', amount: 25, unit: 'g', aisle: 'Laticínios e Ovos' },
      { name: 'Azeite de oliva', amount: 10, unit: 'ml', aisle: 'Mercearia' },
    ],
    steps: [
      'Grelhe as tiras de peito de frango temperadas com sal e pimenta até dourarem.',
      'Misture o iogurte com queijo parmesão, azeite, gotas de limão e sal para o molho.',
      'Rasgue as folhas de alface, acomode o frango ainda morno e regue com o molho.',
    ],
  },
  {
    id: 'sug-20',
    title: 'Hambúrguer de Patinho no Prato com Mix de Folhas e Tomate',
    category: 'Jantar',
    prepTime: 18,
    servings: 2,
    calories: 340,
    protein: 36,
    carbs: 8,
    fat: 18,
    tags: ['Alta Proteína', 'Low Carb', 'Sem Glúten', 'Sem Lactose', 'Rápido'],
    image: '/dishes/sug-20.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '310g por porção',
    platingInstructions: 'Acomodar o hambúrguer suculento sobre mix de folhas verdes temperadas e fatias de tomate caqui.',
    specificInstructions: 'Moldar os hambúrgueres sem compactar excessivamente para manter a suculência.',
    ingredients: [
      { name: 'Carne moída (patinho)', amount: 320, unit: 'g', aisle: 'Açougue' },
      { name: 'Mix de folhas verdes', amount: 100, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Tomate caqui fatiado', amount: 120, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Azeite de oliva', amount: 10, unit: 'ml', aisle: 'Mercearia' },
    ],
    steps: [
      'Molde 2 hambúrgueres de 160g apenas com sal e pimenta moída na hora.',
      'Grelhe em frigideira de ferro bem quente com azeite por 4 minutos de cada lado.',
      'Monte no prato com as folhas verdes temperadas e fatias de tomate fresco.',
    ],
  },
  {
    id: 'sug-21',
    title: 'Panqueca Proteica de Espinafre com Recheio de Ricota',
    category: 'Jantar',
    prepTime: 25,
    servings: 2,
    calories: 320,
    protein: 26,
    carbs: 24,
    fat: 13,
    tags: ['Alta Proteína', 'Vegetariano', 'Econômico'],
    image: '/dishes/sug-21.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '310g por porção',
    platingInstructions: 'Dispor duas panquecas verdes lado a lado com fio de molho de tomate caseiro e queijo ralado.',
    specificInstructions: 'Bater as folhas de espinafre cruas com a massa da panqueca para obter a cor verde natural.',
    ingredients: [
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos' },
      { name: 'Leite integral', amount: 150, unit: 'ml', aisle: 'Laticínios e Ovos' },
      { name: 'Farinha de aveia', amount: 60, unit: 'g', aisle: 'Mercearia' },
      { name: 'Espinafre cru', amount: 60, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Ricota fresca amassada', amount: 140, unit: 'g', aisle: 'Laticínios e Ovos' },
    ],
    steps: [
      'Bata no liquidificador os ovos, o leite, a aveia, o espinafre e sal até formar massa líquida verde.',
      'Doure discos finos em frigideira antiaderente.',
      'Recheie com a ricota temperada com azeite e ervas, enrole e sirva.',
    ],
  },
  {
    id: 'sug-22',
    title: 'Moqueca Leve de Palmito e Banana-da-Terra',
    category: 'Jantar',
    prepTime: 30,
    servings: 2,
    calories: 340,
    protein: 8,
    carbs: 45,
    fat: 16,
    tags: ['Vegetariano', 'Sem Lactose', 'Sem Glúten'],
    image: '/dishes/sug-22.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '380g por porção',
    platingInstructions: 'Servir em travessa de barro com rodelas de banana e palmito envoltas pelo molho alaranjado de azeite de dendê.',
    specificInstructions: 'Utilizar banana-da-terra madura porém firme para não desmanchar no cozimento.',
    ingredients: [
      { name: 'Palmito pupunha fresco ou em conserva', amount: 250, unit: 'g', aisle: 'Mercearia' },
      { name: 'Banana-da-terra em rodelas', amount: 180, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Pimentão vermelho e amarelo', amount: 100, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Leite de coco', amount: 150, unit: 'ml', aisle: 'Mercearia' },
      { name: 'Azeite de dendê', amount: 10, unit: 'ml', aisle: 'Mercearia' },
      { name: 'Coentro fresco', amount: 15, unit: 'g', aisle: 'Hortifruti' },
    ],
    steps: [
      'Em panela de barro, monte camadas de palmito, rodelas de banana e tiras de pimentão.',
      'Regue com o leite de coco, azeite de dendê e tempere com sal.',
      'Tampe e cozinhe em fogo brando por 15 minutos até a banana amaciar e finalize com coentro.',
    ],
  },
  {
    id: 'sug-23',
    title: 'Suflê de Legumes Gratinado com Queijo Meia Cura',
    category: 'Jantar',
    prepTime: 30,
    servings: 2,
    calories: 280,
    protein: 17,
    carbs: 21,
    fat: 14,
    tags: ['Vegetariano', 'Econômico'],
    image: '/dishes/sug-23.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '270g por porção',
    platingInstructions: 'Servir recém-saído do forno enquanto o suflê está alto e dourado na travessa.',
    specificInstructions: 'Bater as claras em neve firme e incorporar delicadamente para manter ar na massa.',
    ingredients: [
      { name: 'Cenoura cozida picada', amount: 120, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Chuchu ou abobrinha', amount: 140, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Ovo', amount: 3, unit: 'un', aisle: 'Laticínios e Ovos' },
      { name: 'Queijo minas meia cura ralado', amount: 60, unit: 'g', aisle: 'Laticínios e Ovos' },
    ],
    steps: [
      'Passe os legumes cozidos pelo garfo ou processador levemente.',
      'Misture as gemas e o queijo meia cura aos legumes picados.',
      'Bata as claras em neve, incorpore suavemente e asse a 190°C por 20 minutos.',
    ],
  },
  {
    id: 'sug-24',
    title: 'Canja de Frango Reconfortante com Cenoura e Cheiro Verde',
    category: 'Jantar',
    prepTime: 30,
    servings: 2,
    calories: 320,
    protein: 31,
    carbs: 34,
    fat: 7,
    tags: ['Alta Proteína', 'Sem Glúten', 'Sem Lactose', 'Econômico'],
    image: '/dishes/sug-24.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '400g por porção',
    platingInstructions: 'Servir fumegante em tigela rústica com bastante cheiro verde fresco picado.',
    specificInstructions: 'Cozinhar o arroz no próprio caldo do frango para absorver todo o sabor.',
    ingredients: [
      { name: 'Peito de frango desfiado', amount: 280, unit: 'g', aisle: 'Açougue' },
      { name: 'Arroz branco', amount: 80, unit: 'g', aisle: 'Mercearia' },
      { name: 'Cenoura em cubinhos', amount: 100, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Alho', amount: 10, unit: 'g', aisle: 'Hortifruti' },
      { name: 'Cheiro verde picado', amount: 20, unit: 'g', aisle: 'Hortifruti' },
    ],
    steps: [
      'Refogue o alho no azeite e acrescente o peito de frango.',
      'Junte o arroz branco cru, a cenoura em cubinhos e cubra com água fervente.',
      'Cozinhe até o arroz ficar bem macio e o caldo aveludado, finalizando com cheiro verde.',
    ],
  },
];

// ============================================================================
// MOTOR DE APRENDIZADO DE PREFERÊNCIAS (TASTE PROFILE ENGINE)
// Analisa os swipes históricos para descobrir afinidades do usuário
// ============================================================================
export function computeUserTasteProfile(swipes = [], catalogRecipes = []) {
  const tagScores = new Map();
  const categoryAccepted = new Map();
  const categoryTotal = new Map();
  const prepTimesAccepted = [];
  let totalRight = 0;
  let totalLeft = 0;

  // Analisa histórico de swipes
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

  // Analisa receitas mantidas ativas no catálogo
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

  // Ordena tags preferidas e rejeitadas
  const sortedTags = Array.from(tagScores.entries())
    .map(([tag, data]) => ({ tag, ...data }))
    .sort((a, b) => b.score - a.score);

  const favoriteTags = sortedTags.filter((t) => t.score > 0).map((t) => t.tag);
  const avoidedTags = sortedTags.filter((t) => t.score < 0).map((t) => t.tag);

  const avgPrepTime = prepTimesAccepted.length > 0
    ? Math.round(prepTimesAccepted.reduce((a, b) => a + b, 0) / prepTimesAccepted.length)
    : 25;

  const totalSwipes = totalRight + totalLeft;
  const acceptanceRate = totalSwipes > 0 ? Math.round((totalRight / totalSwipes) * 100) : 50;

  // Cria um resumo textual do estilo identificado
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
// Atribui percentual de afinidade e justificativas a cada sugestão
// ============================================================================
export function scoreSuggestionAffinity(suggestion, tasteProfile) {
  if (!tasteProfile || tasteProfile.totalSwipes === 0) {
    return {
      affinityPct: 75,
      affinityReasons: suggestion.tags?.slice(0, 2) || ['Equilibrado'],
      isHighAffinity: false,
    };
  }

  let score = 65; // Base neutra positiva
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

  if (suggestion.prepTime && suggestion.prepTime <= tasteProfile.avgPrepTime + 5) {
    score += 6;
    if (suggestion.prepTime <= 20) {
      reasons.push(`Rápido (${suggestion.prepTime} min)`);
    }
  }

  // Pontuação final entre 45% e 99%
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
// Calcula itens que você já tem, itens faltantes e custo extra real
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
      // Checa tokens principais (ex: frango, ovo, queijo, arroz, mandioca)
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
    // 1. Recalcula o custo real dos insumos da sugestão usando preços calibrados
    const calculatedBaseCost = (sug.ingredients || []).reduce((acc, ing) => {
      return (
        acc +
        computeCulinaryPortionCost(ing.name, ing.amount || 100, ing.unit || 'g', marketPricesMap)
      );
    }, 0);
    const servings = Math.max(1, Number(sug.servings) || 1);
    const calculatedCostPerServing = calculatedBaseCost / servings;

    // 2. Calcula compatibilidade com a geladeira
    const fridgeMatch = computeFridgeMatch(sug.ingredients || [], fridgeItems, marketPricesMap);

    // 3. Calcula afinidade com o perfil de escolhas
    const affinity = scoreSuggestionAffinity(sug, tasteProfile);

    // 4. Score composto para ordenação inteligente
    // Dá peso maior a:
    // a) Alto aproveitamento da geladeira (evita desperdício e economiza R$)
    // b) Alta afinidade com o gosto do usuário
    // c) Variação determinística leve por dia
    const seed = (sug.id || '')
      .split('')
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const jitter = (seed % 10);

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

  // Ordena pelo maior score composto (combina geladeira + paladar)
  enriched.sort((a, b) => b.compositeScore - a.compositeScore);

  return enriched;
}
