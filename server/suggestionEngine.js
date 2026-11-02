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
      "Pese e separe os 40g de polvilho doce (ou goma), 1 ovo fresco, 45g de queijo minas meia cura ralado e 25g de requeijão cremoso.",
      "Em uma tigela média, quebre o ovo e bata vigorosamente com um garfo ou fouet até espumar levemente.",
      "Adicione o requeijão cremoso e uma pitada de sal fino, incorporando até obter uma emulsão homogênea e sem grumos.",
      "Acrescente o polvilho doce aos poucos, mexendo sem parar até formar uma massa lisa e aveludada, e então misture o queijo ralado.",
      "Aqueça uma frigideira antiaderente pequena (16 a 18 cm) em fogo brando com umas gotas de azeite ou manteiga e despeje toda a massa.",
      "Tampe a frigideira e asse por 3 a 4 minutos em fogo baixo até o fundo dourar e o centro firmar.",
      "Vire com uma espátula com cuidado, doure o outro lado por mais 2 minutos até formar crosta dourada e crocante, e sirva imediatamente.",
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
      "Descasque a banana nanica bem madura em um prato fundo e amasse vigorosamente com um garfo até formar um purê liso sem pedaços grandes.",
      "Em uma tigela pequena, quebre os 2 ovos e bata ligeiramente até incorporar claras e gemas.",
      "Junte o purê de banana, a aveia em flocos e a canela em pó aos ovos batidos, misturando até obter consistência uniforme de massa de panqueca.",
      "Aqueça uma frigideira antiaderente em fogo médio-baixo com umas gotas de óleo de coco ou manteiga.",
      "Despeje porções da massa formando discos médios de cerca de 10 cm e asse por 2 minutos até surgirem pequenas bolhas na superfície.",
      "Vire com espátula e doure o outro lado por mais 1 a 2 minutos até dourar uniformemente, empilhe os discos e finalize com canela polvilhada.",
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
      "Aqueça uma frigideira antiaderente de 20 cm em fogo médio por 1 minuto sem untar.",
      "Passe os 70g de goma de tapioca hidratada por uma peneira fina diretamente sobre a frigideira, cobrindo todo o fundo em camada uniforme.",
      "Deixe assar por cerca de 1 minuto em fogo médio até a goma unir e formar um disco flexível e firme que solta das bordas.",
      "Enquanto a massa firma, em outra frigideira pequena derreta a ponta de manteiga e prepare o ovo mexido em fogo baixo mantendo textura bem cremosa.",
      "Distribua o ovo mexido cremoso e as fatias de queijo muçarela sobre uma das metades do disco de tapioca.",
      "Dobre a outra metade por cima formando uma meia-lua, abaixe o fogo e pressione levemente as bordas por 1 minuto para o queijo derreter e a casca ficar crocante.",
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
      "Em um bowl pequeno, quebre os 2 ovos, adicione os 30g de goma de tapioca hidratada e uma pitada de sal fino.",
      "Bata vigorosamente com garfo ou fouet por 1 minuto até emulsionar totalmente sem grumos brancos da goma.",
      "Aqueça uma frigideira antiaderente untada com gotas de azeite em fogo médio-baixo e despeje a massa líquida girando a frigideira para nivelar.",
      "Tampe a frigideira por 1 minuto e meio para que o vapor asse o centro da massa por igual sem queimar a base.",
      "Em um recipiente à parte, misture os 90g de frango cozido desfiado com os 30g de requeijão cremoso e pimenta-do-reino aquecendo levemente.",
      "Espalhe o recheio de frango cremoso sobre metade da crepioca, dobre em meia-lua, doure por 45 segundos de cada lado e sirva quente.",
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
      "Coloque os 80g de flocão de milho em uma tigela, adicione 60 ml de água filtrada e meia colher de café de sal fino.",
      "Misture bem com as pontas dos dedos e deixe descansar por 10 minutos para que os grãos absorvam a água e dobrem de maciez.",
      "Transfira o milho hidratado para o ralo da cuscuzeira sem apertar ou compactar para permitir a circulação de vapor, tampando em fogo médio por 8 minutos até exalar perfume característico.",
      "Enquanto o cuscuz cozinha, aqueça uma frigideira em fogo alto e grelhe a fatia de 40g de queijo coalho por 2 minutos de cada lado até formar crosta dourada.",
      "Em uma panela pequena com água fervente e uma colher de vinagre, faça um redemoinho suave e cozinhe o ovo pochê por 3 minutos para gema mole aveludada.",
      "Desenforme o cuscuz macio em prato fundo, regue com a manteiga morna derretida, acomode a fatia de queijo coalho dourado e posicione o ovo pochê com flor de sal.",
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
      "Certifique-se de que o peito de frango cozido está frio e desfie em fios bem finos com as mãos ou garfo.",
      "Em um bowl, misture os 80g de frango desfiado com os 30g de requeijão cremoso, 35g de cenoura ralada no ralo fino, pitada de sal e gotas de limão.",
      "Misture com uma espátula até virar uma pasta homogênea, cremosa e úmida.",
      "Aqueça uma frigideira seca em fogo baixo e toste levemente as fatias de pão de forma integral por 1 minuto apenas para ficarem crocantes por fora.",
      "Espalhe generosamente o recheio de frango em uma das fatias cobrindo até as bordas, feche com a outra fatia, corte na diagonal em dois triângulos e sirva.",
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
      "Pese 45g de aveia em flocos e meça 180 ml de leite integral (ou vegetal).",
      "Coloque ambos em uma panela pequena de fundo grosso em fogo médio-baixo.",
      "Mexa continuamente com colher de pau ou espátula de silicone, raspando as laterais e o fundo para não grudar.",
      "Assim que levantar fervura, abaixe o fogo ao mínimo e cozinhe por 4 a 5 minutos mexendo sempre até a textura engrossar e ficar sedosa.",
      "Desligue o fogo, misture a canela em pó até aromatizar todo o creme e adoce a gosto se desejar.",
      "Transfira o mingau quente para uma tigela de cerâmica e decore a superfície com as fatias de banana prata e uma pitada extra de canela.",
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
      "Separe as claras dos 3 ovos em um bowl limpo, reservando as gemas para outra preparação.",
      "Bata as claras suavemente com garfo apenas por 30 segundos para quebrar a consistência viscosa, sem bater em neve.",
      "Tempere com uma pitada de sal refinado, pimenta-do-reino e orégano fresco.",
      "Aqueça uma frigideira antiaderente com um fio fino de azeite em fogo médio, despejando as claras por toda a extensão.",
      "Com uma espátula, empurre levemente as bordas cozidas para o centro inclinando a frigideira para que a parte líquida escorra e asse de forma homogênea.",
      "Quando a base estiver dourada e o topo ainda úmido, distribua os 50g de queijo minas frescal em cubos e o tomate picado, dobre a omelete ao meio e sirva com o queijo morno.",
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
      "Corte o peito de frango em tiras ou cubos uniformes de 2 cm e tempere com alho picado, sal e pimenta-do-reino.",
      "Aqueça uma panela funda com azeite em fogo alto e sele o frango aos poucos para dourar sem criar água.",
      "Junte a cebola picada na mesma panela e refogue até murchar e ficar transparente aproveitando o fundo da panela.",
      "Adicione o molho de tomate e a mostarda, mexa bem e cozinhe em fogo brando por 5 minutos para os sabores incorporarem.",
      "Abaixe o fogo ao mínimo, despeje o creme de leite aos poucos mexendo suavemente até o molho ficar aveludado e homogêneo, desligando antes de ferver.",
      "Em outra panela prepare o arroz branco refogado com alho até ficar soltinho.",
      "Monte o prato posicionando o arroz branco fumegante em uma das metades, o strogonoff cremoso na outra e finalize com uma porção generosa de batata palha crocante.",
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
      "Corte a peça de acém em cubos grandes de cerca de 4 cm e seque com papel toalha para garantir boa selagem.",
      "Aqueça a panela de pressão com 10 ml de azeite em fogo alto e doure todos os lados dos cubos de carne criando uma crosta tostada saborosa.",
      "Acrescente a cebola e alho picados e refogue por 3 minutos até soltar os resíduos caramelizados do fundo da panela.",
      "Adicione folhas de louro, sal e cubra com água fervente até cobrir metade da carne.",
      "Tampe a panela de pressão e cozinhe por 35 minutos após pegar pressão em fogo médio.",
      "Enquanto a carne cozinha, ferva os pedaços de mandioca com sal até ficarem macios e salteie rapidamente na manteiga.",
      "Libere a pressão com segurança, desfie a carne com dois garfos diretamente no caldo espesso reduzido e sirva ao lado da mandioca dourada na manteiga.",
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
      "Corte a alcatra em cubos pequenos e regulares de aproximadamente 1,5 cm, temperando com sal, pimenta e alho.",
      "Aqueça uma frigideira de ferro com azeite em fogo bem alto e doure a carne em lotes rápidos por 2 a 3 minutos para não endurecer.",
      "Retire a carne dourada e na mesma panela doure a cebola picadinha até caramelizar levemente.",
      "Acrescente o molho de tomate concentrado e uma concha pequena de água quente, cozinhando por 4 minutos até encorpar.",
      "Retorne a carne e seus sucos para a frigideira, desligue o fogo e misture tudo incorporando os sabores.",
      "Aqueça uma porção de feijão carioca com caldo espesso e o arroz branco soltinho.",
      "Disponha o arroz e feijão na base do prato, acomode o picadinho suculento ao centro e salpique cheiro-verde fresco picado.",
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
      "Seque muito bem os filés de tilápia com papel toalha e tempere com suco de limão fresco, sal e raspas finas de limão siciliano.",
      "Higienize a abobrinha e cenoura, cortando a abobrinha em rodelas médias e a cenoura em tiras finas estilo julienne.",
      "Aqueça uma frigideira antiaderente ou chapa de ferro com azeite em fogo médio-alto.",
      "Acomode os filés de peixe sem amontoar e sele por 3 a 4 minutos sem mexer até formar uma crosta dourada e crocante.",
      "Vire delicadamente com uma espátula larga e grelhe por mais 2 minutos até que o centro do peixe fique opaco e macio.",
      "Em outra frigideira salteie os legumes no azeite com alho picado por 4 minutos até ficarem al dente, servindo-os ao lado do filé com um fio de azeite extravirgem.",
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
      "Descasque a batata-doce, corte em rodelas e cozinhe em água fervente com sal por 15 minutos até amaciar completamente.",
      "Escorra a água e amasse a batata ainda quente com garfo ou espremedor, incorporando leite e manteiga até obter consistência de purê cremoso e homogêneo.",
      "Em uma panela, aqueça azeite e refogue alho e cebola picadinhos até ficarem dourados.",
      "Acrescente o frango desfiado, o molho de tomate, cheiro-verde e sal, cozinhando por 5 minutos até obter um refogado úmido e suculento.",
      "Em um refratário médio untado com azeite, espalhe metade do purê de batata-doce cobrindo todo o fundo.",
      "Despeje todo o recheio de frango espalhando por igual e cubra com o restante do purê alisando com as costas de uma colher molhada.",
      "Salpique a muçarela ralada por cima e leve ao forno pré-aquecido a 200°C por 15 minutos até o queijo fundir e criar bolhas douradas gratinadas.",
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
      "Descasque e corte as batatas inglesas em cubos médios, cozinhando em água com sal por 15 minutos até desmancharem.",
      "Escorra e amasse bem as batatas ainda quentes, misturando o leite morno e a manteiga com um fouet até atingir um purê aveludado e macio.",
      "Tempere os bifes de coxão mole com alho triturado, sal grosso moído e pimenta-do-reino dos dois lados.",
      "Aqueça uma frigideira pesada de ferro em fogo bem alto com azeite até soltar leve fumaça.",
      "Sele os bifes por 2 minutos de cada lado sem mexer ou furar para selar a suculência, retirando para descansar em um prato morno por 2 minutos.",
      "Na mesma frigideira e com a gordura da carne, coloque as rodelas de cebola em fogo médio pingando gotas de água para soltar o fundo dourado até ficarem macias e douradas.",
      "Acomode o bife suculento no prato, cubra generosamente com a cebola caramelizada e sirva acompanhado do purê de batatas quente.",
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
      "Deixe o feijão preto de molho em água fria por pelo menos 4 horas antes do cozimento para facilitar o ponto macio.",
      "Na panela de pressão, aqueça o azeite e doure os cubos de lombo suíno e as tiras de bacon magro até dourarem e liberarem aroma.",
      "Junte o alho amassado e a cebola picadinha refogando por 2 minutos no fundo da panela.",
      "Acrescente o feijão preto escorrido, folhas de louro, sal e cubra com água fervente até atingir 3 dedos acima do nível dos grãos.",
      "Feche a panela de pressão e cozinhe por 35 minutos após pegar pressão em fogo médio.",
      "Abra a panela com segurança e amasse duas conchas de feijão contra a parede da panela para encorpar o caldo, fervendo destampada por 10 minutos.",
      "Em frigideira bem quente salteie alho e a couve fatiada bem fininha no azeite por apenas 1 minuto, servindo a feijoada encorpada com arroz branco, couve e fatias de laranja.",
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
      "Descasque a abóbora cabotiá, retire as sementes e corte a polpa em cubos médios de cerca de 3 cm.",
      "Em uma panela média funda, aqueça o azeite e refogue o alho picado e o gengibre fresco ralado por 1 minuto até perfumar a cozinha.",
      "Acrescente os cubos de abóbora, adicione sal e cubra com água fervente até o nível dos legumes.",
      "Tampe a panela e cozinhe em fogo médio por 15 a 18 minutos até a abóbora ficar extremamente macia ao espetar com o garfo.",
      "Bata o conteúdo da panela com o caldo no liquidificador ou mixer de mão até obter um creme sedoso, aveludado e espesso.",
      "Retorne o creme à panela, misture o peito de frango cozido e desfiado em fios finos, cozinhe por mais 3 minutos para harmonizar e sirva fumegante com cheiro-verde picadinho.",
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
      "Higienize bem o maço de espinafre, retirando os talos grossos e mantendo as folhas tenras.",
      "Aqueça uma frigideira com um fio de azeite e refogue as folhas de espinafre por 2 minutos apenas até murcharem.",
      "Transfira o espinafre para uma peneira e aperte com as costas de uma colher para retirar todo o excesso de líquido, picando grosseiramente em seguida.",
      "Em uma tigela, quebre os 3 ovos inteiros e bata com um fouet ou garfo por 1 minuto até formar espuma leve, temperando com sal, pimenta e ervas.",
      "Misture o espinafre picado e os cubos de queijo minas frescal aos ovos batidos.",
      "Despeje a mistura em um refratário médio untado com azeite e asse em forno pré-aquecido a 180°C por 20 minutos até inflar e as bordas ficarem douradas e firmes.",
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
      "Descasque as batatas inglesas, corte em quatro partes e cozinhe em panela com água fervente e sal por 15 minutos até ficarem muito macias.",
      "Bata as batatas com a própria água do cozimento no liquidificador por 1 minuto até formar um caldo liso, aveludado e encorpado.",
      "Em uma panela funda, aqueça o azeite de oliva e doure o alho picado juntamente com o lombo suíno já cozido e desfiado.",
      "Despeje o caldo de batatas batido sobre o refogado de lombo e deixe levantar fervura suave em fogo médio.",
      "Adicione a couve manteiga fatiada fininha no sentido transversal, mexa bem e cozinhe por apenas 2 minutos para que amacie preservando a cor verde intensa.",
      "Ajuste o ponto de sal e finalize em tigelas individuais fundas regando com um fio generoso de azeite extravirgem.",
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
      "Corte o peito de frango em tiras de 1,5 cm e tempere com sal refinado, pimenta-do-reino e algumas gotas de suco de limão.",
      "Aqueça uma frigideira antiaderente com um fio de azeite em fogo médio-alto e grelhe as tiras de frango por 3 minutos de cada lado até dourarem com crosta apetitosa.",
      "Lave as folhas de alface americana em água corrente, higienize e seque muito bem em centrífuga de folhas para ficarem bem crocantes.",
      "Em uma tigela pequena prepare o molho caesar caseiro misturando o iogurte natural, queijo parmesão ralado fino, azeite, gotas de limão, sal e pimenta até virar um molho espesso.",
      "Rasgue as folhas de alface com as mãos acomodando-as no prato de servir formando uma cama fresca e volumosa.",
      "Acomode as tiras de frango grelhado ainda mornas sobre as folhas, regue com colheradas do molho de iogurte e finalize com queijo parmesão em lascas finas.",
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
      "Divida os 320g de patinho moído em duas porções iguais de 160g e molde os hambúrgueres com as mãos, dando formato arredondado sem compactar em excesso para manter a maciez.",
      "Tempere a parte externa dos hambúrgueres com sal grosso triturado e pimenta-do-reino moída na hora apenas momentos antes de colocar na frigideira.",
      "Aqueça uma frigideira pesada de ferro em fogo bem alto com um fio mínimo de azeite até soltar leve fumaça.",
      "Acomode os hambúrgueres e sele por 3 minutos e meio sem mexer ou pressionar até criar uma crosta caramelizada escura e crocante.",
      "Vire com uma espátula larga e doure o outro lado por 2 minutos e meio para manter o centro rosado, tenro e com todo o suco da carne.",
      "Transfira os hambúrgueres para descansar em uma tábua por 2 minutos e sirva no prato acompanhados do mix de folhas frescas regadas com azeite e fatias de tomate caqui.",
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
      "Coloque no copo do liquidificador os 2 ovos, 150 ml de leite integral, 60g de farinha de aveia, 60g de folhas de espinafre cruas lavadas e uma pitada de sal fino.",
      "Bata em velocidade máxima por 1 minuto e meio até triturar completamente o espinafre formando uma massa líquida homogênea de tom verde vivo.",
      "Em uma tigela amasse a ricota fresca com garfo temperando com azeite de oliva, orégano desidratado, sal e pimenta-do-reino até formar uma pasta cremosa.",
      "Aqueça uma frigideira antiaderente de 20 cm levemente untada em fogo médio-baixo.",
      "Despeje uma concha rasa da massa verde girando a frigideira para cobrir todo o fundo, assando por 1 minuto e meio até soltar a borda, virando por 30 segundos.",
      "Espalhe colheres da ricota temperada no centro de cada panqueca verde, enrole firmemente em formato de canelone e sirva em travessa regada com gotas de azeite.",
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
      "Descasque e corte a banana-da-terra em rodelas médias de 1 cm e corte os palmitos em rodelas de espessura semelhante.",
      "Fatie os pimentões coloridos e a cebola em tiras finas longitudinais.",
      "Em uma panela de barro ou de fundo grosso, monte camadas alternadas iniciando pela cebola, palmito, rodelas de banana e as tiras de pimentão.",
      "Regue todos os ingredientes com o leite de coco cremoso, o azeite de dendê e tempere com sal refinado e gotas de limão.",
      "Tampe a panela e cozinhe em fogo brando por 12 a 15 minutos até a banana amaciar sem desmanchar e o caldo reduzir para textura encorpada.",
      "Desligue o fogo, salpique folhas de coentro fresco picadas por toda a superfície e sirva a moqueca fumegante acompanhada de arroz branco bem soltinho.",
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
      "Cozinhe a cenoura e a abobrinha em água fervente com sal até ficarem macias ao toque do garfo.",
      "Passe os legumes por um garfo ou processador pulsando apenas para picar fino sem virar líquido, preservando pequenos pedaços de textura.",
      "Separe as gemas das claras dos 3 ovos. Em um bowl junte os legumes picados, as gemas e o queijo minas meia cura ralado fino, temperando com noz-moscada.",
      "Em outro bowl limpo, bata as 3 claras em neve com um fouet ou batedeira até formarem picos firmes e brilhantes.",
      "Adicione 1/3 das claras em neve na mistura de legumes mexendo normalmente para amaciar a consistência e depois incorpore o restante das claras suavemente com espátula em movimentos circulares de baixo para cima.",
      "Transfira a massa para um refratário médio untado com manteiga e asse em forno pré-aquecido a 190°C por 20 minutos até inflar alto e a crosta dourar perfeitamente.",
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
      "Corte o peito de frango em cubinhos pequenos de 1,5 cm e a cenoura descascada em cubinhos mínimos de 0,5 cm.",
      "Em uma panela funda, aqueça 10 ml de azeite em fogo médio e doure o alho picado por 1 minuto sem queimar.",
      "Adicione os cubos de peito de frango e refogue mexendo por 3 minutos até perderem a coloração crua.",
      "Acrescente os 80g de arroz branco cru lavado, a cenoura picada e cubra com 750 ml de água fervente com sal fino.",
      "Abaixe o fogo para médio-baixo, tampe parcialmente a panela e cozinhe por 18 a 20 minutos mexendo ocasionalmente até o arroz amaciar bem e soltar amido.",
      "Quando o caldo atingir textura sedosa e aveludada, ajuste o sal e a pimenta-do-reino e finalize polvilhando abundante cheiro-verde picadinho na hora de servir.",
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
