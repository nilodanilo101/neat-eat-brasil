import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.NEATEAT_DATA_DIR || __dirname;
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, 'neateat.sqlite');
export const db = new DatabaseSync(dbPath);

const INITIAL_RECIPES = [
  // CAFÉ DA MANHÃ
  {
    id: 'rec-1',
    title: 'Crepioca Proteica com Queijo Coalho e Tomate',
    category: 'Café da Manhã',
    prepTime: 10,
    servings: 1,
    calories: 320,
    protein: 21,
    carbs: 24,
    fat: 14,
    tags: ['Rápido', 'Sem Glúten', 'Vegetariano', 'Alta Proteína', 'Econômico'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/crepioca-de-queijo-com-tomate-e-oregano-capa.png',
    source: 'Ficha Técnica NeatEat Brasil',
    portionWeight: '210g por porção',
    platingInstructions:
      'Dobrar a crepioca em meia-lua no centro de um prato raso branco aquecido, deixando o queijo coalho levemente gratinado visível na borda. Finalizar com orégano fresco polvilhado e fio leve de azeite.',
    specificInstructions:
      'Utilizar frigideira antiaderente de 20cm em fogo médio-baixo para não ressecar a massa. Consumir imediatamente após o preparo (não recomendado congelar). Alergênicos: contém ovo e derivados de leite.',
    ingredients: [
      { name: 'Goma de tapioca', amount: 40, unit: 'g', aisle: 'Mercearia', basePrice: 0.95 },
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
      { name: 'Queijo coalho ou minas', amount: 40, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 2.40 },
      { name: 'Tomate', amount: 50, unit: 'g', aisle: 'Hortifruti', basePrice: 0.65 },
      { name: 'Orégano', amount: 2, unit: 'g', aisle: 'Temperos', basePrice: 0.15 },
    ],
    steps: [
      'Bata os ovos com a goma de tapioca e uma pitada de sal usando um fouet até obter mistura homogênea sem grumos.',
      'Despeje em frigideira antiaderente aquecida em fogo médio-baixo.',
      'Quando firmar a base (cerca de 2 minutos), vire, distribua o queijo coalho, o tomate em cubos sem sementes e o orégano.',
      'Dobre ao meio em formato de meia-lua e doure por mais 1 minuto de cada lado até o queijo derreter.'
    ]
  },
  {
    id: 'rec-2',
    title: 'Overnight Oats de Banana, Aveia e Pasta de Amendoim',
    category: 'Café da Manhã',
    prepTime: 5,
    servings: 1,
    calories: 380,
    protein: 15,
    carbs: 52,
    fat: 12,
    tags: ['Vegetariano', 'Econômico', 'Rápido'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/overnight-oats-1.jpg',
    source: 'Ficha Técnica NeatEat Brasil',
    portionWeight: '310g por porção',
    platingInstructions:
      'Montar em camadas visíveis em pote de vidro hermético (Mason Jar de 350ml): base de aveia hidratada, camada intermediária de banana em rodelas de 0,5cm e topo finalizado com swirl de pasta de amendoim e canela polvilhada.',
    specificInstructions:
      'Manter sob refrigeração (4°C) por no mínimo 4 horas antes de servir. Validade na geladeira: até 48 horas. Alergênicos: contém amendoim, aveia e leite.',
    ingredients: [
      { name: 'Aveia em flocos', amount: 50, unit: 'g', aisle: 'Mercearia', basePrice: 0.85 },
      { name: 'Leite integral ou vegetal', amount: 150, unit: 'ml', aisle: 'Laticínios e Ovos', basePrice: 1.10 },
      { name: 'Banana nanica', amount: 1, unit: 'un', aisle: 'Hortifruti', basePrice: 0.90 },
      { name: 'Pasta de amendoim', amount: 20, unit: 'g', aisle: 'Mercearia', basePrice: 1.20 },
      { name: 'Canela em pó', amount: 2, unit: 'g', aisle: 'Temperos', basePrice: 0.15 },
    ],
    steps: [
      'No pote de vidro, misture a aveia em flocos, o leite e metade da canela em pó.',
      'Disponha as rodelas de banana nanica sobre a base hidratada.',
      'Finalize com a colherada de pasta de amendoim no topo e polvilhe o restante da canela.',
      'Tampe e refrigere durante a noite (mínimo 4 horas) antes do serviço.'
    ]
  },
  {
    id: 'rec-3',
    title: 'Ovos Mexidos Cremosos com Pão Francês e Mamão',
    category: 'Café da Manhã',
    prepTime: 8,
    servings: 1,
    calories: 360,
    protein: 18,
    carbs: 38,
    fat: 14,
    tags: ['Vegetariano', 'Econômico', 'Rápido'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/ovos-mexidos-perfeitos.jpg',
    source: 'Ficha Técnica NeatEat Brasil',
    portionWeight: '260g por porção',
    platingInstructions:
      'Servir o pão francês aberto e levemente tostado na manteiga à esquerda do prato, recheado ou ladeado pelos ovos mexidos brilhantes e úmidos. À direita, dispor o mamão papaia cortado em cubos regulares.',
    specificInstructions:
      'Ponto de cocção crítico: retirar a frigideira do fogo alguns segundos antes do ponto final, pois o calor residual termina o cozimento mantendo a cremosidade. Alergênicos: contém glúten, ovo e lactose.',
    ingredients: [
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
      { name: 'Pão francês', amount: 1, unit: 'un', aisle: 'Padaria', basePrice: 0.95 },
      { name: 'Mamão papaia', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 1.40 },
      { name: 'Manteiga', amount: 10, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 0.65 },
    ],
    steps: [
      'Derreta a manteiga em fogo baixo em frigideira antiaderente.',
      'Adicione os ovos levemente batidos com uma pitada de sal.',
      'Mexa continuamente com espátula de silicone do centro para as bordas em fogo baixo até obter textura aveludada.',
      'Sirva imediatamente acompanhado do pão francês aquecido e do mamão papaia em cubos.'
    ]
  },
  {
    id: 'rec-4',
    title: 'Cuscuz Nordestino com Ovo Estrelado e Coentro',
    category: 'Café da Manhã',
    prepTime: 12,
    servings: 1,
    calories: 340,
    protein: 14,
    carbs: 45,
    fat: 11,
    tags: ['Sem Glúten', 'Sem Lactose', 'Vegetariano', 'Econômico'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/cuscuz-com-ovo.jpg',
    source: 'Ficha Técnica NeatEat Brasil',
    portionWeight: '240g por porção',
    platingInstructions:
      'Desenformar o cuscuz quente no centro de um prato fundo ou tigela de barro, posicionar os dois ovos estrelados com gema mole no topo e finalizar com coentro fresco picado e fio de azeite.',
    specificInstructions:
      'A hidratação prévia do flocão (10 minutos de descanso antes de ir ao vapor) é indispensável para garantir flocos macios e úmidos. Alergênicos: contém ovo.',
    ingredients: [
      { name: 'Flocão de milho', amount: 70, unit: 'g', aisle: 'Mercearia', basePrice: 0.55 },
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
      { name: 'Azeite de oliva', amount: 5, unit: 'ml', aisle: 'Mercearia', basePrice: 0.45 },
      { name: 'Cheiro-verde / Coentro', amount: 10, unit: 'g', aisle: 'Hortifruti', basePrice: 0.30 },
    ],
    steps: [
      'Misture o flocão de milho com 70ml de água filtrada e uma pitada de sal; deixe hidratar por 10 minutos.',
      'Transfira para a cuscuzeira sem compactar a massa e cozinhe no vapor por 8 minutos após ferver.',
      'Frite os ovos no azeite mantendo a clara firme e a gema cremosa.',
      'Monte o cuscuz no prato, sobreponha os ovos e finalize com coentro picado.'
    ]
  },

  // ALMOÇO
  {
    id: 'rec-5',
    title: 'PF Brasileiro: Frango Grelhado, Arroz, Feijão Carioca e Salada',
    category: 'Almoço',
    prepTime: 25,
    servings: 2,
    calories: 540,
    protein: 42,
    carbs: 58,
    fat: 12,
    tags: ['Sem Glúten', 'Sem Lactose', 'Alta Proteína', 'Econômico'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/file-de-frango-grelhado.jpeg',
    source: 'Ficha Técnica NeatEat Brasil',
    portionWeight: '420g por porção',
    platingInstructions:
      'Enformar o arroz branco em aro de 8cm na posição 10h do prato, servir o feijão carioca encorpado em ramequim lateral (ou às 2h), dispor o filé de peito de frango grelhado com marcas de grelha às 6h e a salada fresca de alface e tomate na lateral.',
    specificInstructions:
      'Grelhar o frango em chapa bem quente (180°C) por 3 a 4 minutos de cada lado para selar os sucos internos sem ressecar. Conservação em marmita: até 3 dias refrigerado ou 30 dias congelado (exceto a salada crua).',
    ingredients: [
      { name: 'Peito de frango', amount: 300, unit: 'g', aisle: 'Açougue', basePrice: 6.90 },
      { name: 'Arroz branco', amount: 150, unit: 'g', aisle: 'Mercearia', basePrice: 1.20 },
      { name: 'Feijão carioca cozido', amount: 200, unit: 'g', aisle: 'Mercearia', basePrice: 1.90 },
      { name: 'Alface americana', amount: 80, unit: 'g', aisle: 'Hortifruti', basePrice: 1.30 },
      { name: 'Tomate', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 1.30 },
      { name: 'Alho', amount: 10, unit: 'g', aisle: 'Hortifruti', basePrice: 0.40 },
    ],
    steps: [
      'Tempere os filés de peito de frango com alho picado, sal e pimenta; deixe marinar por 10 minutos.',
      'Grelhe os filés em frigideira quente até dourarem de ambos os lados.',
      'Cozinhe o arroz branco com alho refogado até secar e aqueça o feijão carioca.',
      'Monte o prato seguindo o padrão de empratamento e finalize com a salada higienizada.'
    ]
  },
  {
    id: 'rec-6',
    title: 'Picadinho de Carne Moída com Abóbora Cabotiá e Arroz Integral',
    category: 'Almoço',
    prepTime: 30,
    servings: 2,
    calories: 510,
    protein: 36,
    carbs: 48,
    fat: 16,
    tags: ['Sem Glúten', 'Sem Lactose', 'Alta Proteína', 'Econômico'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/carne-moida-com-abobora-capa.png',
    source: 'Ficha Técnica NeatEat Brasil',
    portionWeight: '390g por porção',
    platingInstructions:
      'Servir em bowl fundo ou prato meia-aba: metade com arroz soltinho e metade com o picadinho úmido de carne moída e cubos íntegros de abóbora cabotiá. Finalizar com cheiro-verde picado finamente no topo.',
    specificInstructions:
      'Cortar a abóbora cabotiá em cubos padronizados de 2x2cm para cozimento uniforme sem desmanchar. Excelente para congelamento em porções individuais por até 60 dias.',
    ingredients: [
      { name: 'Carne moída (patinho ou acém)', amount: 300, unit: 'g', aisle: 'Açougue', basePrice: 10.50 },
      { name: 'Abóbora cabotiá', amount: 250, unit: 'g', aisle: 'Hortifruti', basePrice: 2.10 },
      { name: 'Arroz branco', amount: 140, unit: 'g', aisle: 'Mercearia', basePrice: 1.15 },
      { name: 'Cebola', amount: 80, unit: 'g', aisle: 'Hortifruti', basePrice: 0.65 },
      { name: 'Alho', amount: 10, unit: 'g', aisle: 'Hortifruti', basePrice: 0.40 },
      { name: 'Cheiro-verde / Coentro', amount: 15, unit: 'g', aisle: 'Hortifruti', basePrice: 0.40 },
    ],
    steps: [
      'Em panela aquecida, doure a carne moída sem mexer nos primeiros 2 minutos para criar crosta caramelizada (reação de Maillard).',
      'Adicione a cebola em brunoise e o alho picado, refogando por 3 minutos.',
      'Acrescente a abóbora cabotiá em cubos e 100ml de água quente; tampe e cozinhe em fogo médio por 12 minutos até amaciar.',
      'Desligue o fogo, salpique o cheiro-verde e sirva acompanhado do arroz.'
    ]
  },
  {
    id: 'rec-7',
    title: 'Escondidinho de Mandioca com Frango Desfiado',
    category: 'Almoço',
    prepTime: 35,
    servings: 2,
    calories: 560,
    protein: 38,
    carbs: 54,
    fat: 18,
    tags: ['Sem Glúten', 'Alta Proteína', 'Econômico'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/escondidinho-de-frango-capa.png',
    source: 'Ficha Técnica NeatEat Brasil',
    portionWeight: '380g por porção',
    platingInstructions:
      'Montar em refratário individual de cerâmica (ramequim oval de 400ml): base de frango desfiado suculento (160g), cobertura alisada de purê de mandioca (190g) e camada superior de queijo muçarela (30g) gratinada até borbulhar e dourar.',
    specificInstructions:
      'Retirar o pavio central fibroso da mandioca antes de amassar para garantir textura lisa do purê. Gratinar a 220°C nos últimos 8 minutos. Alergênicos: contém lactose.',
    ingredients: [
      { name: 'Mandioca (aipim) descascada', amount: 350, unit: 'g', aisle: 'Hortifruti', basePrice: 3.20 },
      { name: 'Peito de frango', amount: 280, unit: 'g', aisle: 'Açougue', basePrice: 6.40 },
      { name: 'Molho de tomate', amount: 100, unit: 'g', aisle: 'Mercearia', basePrice: 1.10 },
      { name: 'Queijo muçarela', amount: 60, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 3.10 },
      { name: 'Cebola', amount: 60, unit: 'g', aisle: 'Hortifruti', basePrice: 0.50 },
    ],
    steps: [
      'Cozinhe a mandioca na pressão por 15 minutos até ficar macia, retire os fios centrais e amasse formando um purê cremoso.',
      'Refogue o peito de frango cozido e desfiado com a cebola picada e o molho de tomate até encorpar.',
      'Em refratário, disponha o recheio de frango, cubra com o purê de mandioca e finalize com a muçarela ralada.',
      'Leve ao forno preaquecido a 220°C por 10 minutos para gratinar.'
    ]
  },
  {
    id: 'rec-8',
    title: 'Strogonoff Econômico de Grão-de-Bico e Cogumelos com Batata Assada',
    category: 'Almoço',
    prepTime: 25,
    servings: 2,
    calories: 470,
    protein: 19,
    carbs: 62,
    fat: 14,
    tags: ['Vegetariano', 'Sem Glúten', 'Econômico'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/strogonoff-de-grao-de-bico-com-shitake.jpg',
    source: 'Ficha Técnica NeatEat Brasil',
    portionWeight: '400g por porção',
    platingInstructions:
      'Dispor o arroz branco moldado de um lado do prato raso, servir o strogonoff cremoso ao centro-direito e posicionar as batatas rústicas assadas crocantes no topo para preservar a textura.',
    specificInstructions:
      'Nunca ferver o molho após adicionar o creme de leite para evitar talhar. As batatas devem ser adicionadas ao prato apenas no momento do passe para não amolecerem.',
    ingredients: [
      { name: 'Grão-de-bico cozido', amount: 260, unit: 'g', aisle: 'Mercearia', basePrice: 3.80 },
      { name: 'Molho de tomate', amount: 150, unit: 'g', aisle: 'Mercearia', basePrice: 1.50 },
      { name: 'Creme de leite', amount: 100, unit: 'g', aisle: 'Mercearia', basePrice: 2.10 },
      { name: 'Batata inglesa', amount: 250, unit: 'g', aisle: 'Hortifruti', basePrice: 2.20 },
      { name: 'Arroz branco', amount: 120, unit: 'g', aisle: 'Mercearia', basePrice: 1.00 },
      { name: 'Cebola', amount: 60, unit: 'g', aisle: 'Hortifruti', basePrice: 0.50 },
    ],
    steps: [
      'Corte as batatas em palitos finos e asse a 200°C (ou Airfryer por 15 minutos) até ficarem douradas e crocantes.',
      'Refogue a cebola picada, adicione o grão-de-bico cozido e o molho de tomate, apurando por 5 minutos.',
      'Desligue o fogo, incorpore o creme de leite mexendo delicadamente e ajuste o sal.',
      'Emprate com o arroz branco e finalize com as batatas crocantes.'
    ]
  },
  {
    id: 'rec-9',
    title: 'Tilápia Grelhada ao Limão com Purê de Batata e Brócolis',
    category: 'Almoço',
    prepTime: 22,
    servings: 2,
    calories: 450,
    protein: 39,
    carbs: 42,
    fat: 12,
    tags: ['Sem Glúten', 'Alta Proteína', 'Rápido'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/file-de-tilapia-grelhado-na-manteiga.jpeg',
    source: 'Ficha Técnica NeatEat Brasil',
    portionWeight: '380g por porção',
    platingInstructions:
      'Fazer uma lágrima (swoosh) de purê de batata na base do prato com o dorso da colher, acomodar o filé de tilápia dourado levemente sobreposto ao purê e dispor os floretes de brócolis verde-vivo na lateral com uma rodela de limão taiti.',
    specificInstructions:
      'Branquear o brócolis no vapor por exatos 4 minutos e dar choque térmico rápido para manter a cor verde vibrante e a textura al dente. Alergênicos: contém peixe.',
    ingredients: [
      { name: 'Filé de tilápia', amount: 300, unit: 'g', aisle: 'Peixaria', basePrice: 13.90 },
      { name: 'Batata inglesa', amount: 300, unit: 'g', aisle: 'Hortifruti', basePrice: 2.60 },
      { name: 'Brócolis ninja', amount: 200, unit: 'g', aisle: 'Hortifruti', basePrice: 3.50 },
      { name: 'Limão taiti', amount: 1, unit: 'un', aisle: 'Hortifruti', basePrice: 0.45 },
      { name: 'Azeite de oliva', amount: 10, unit: 'ml', aisle: 'Mercearia', basePrice: 0.90 },
    ],
    steps: [
      'Tempere os filés de tilápia com suco de limão taiti, sal e pimenta-do-reino recém-moída.',
      'Grelhe em frigideira antiaderente bem quente com um fio de azeite por 3 minutos de cada lado até formar crosta dourada.',
      'Cozinhe as batatas e passe pelo espremedor, emulsionando com um fio de azeite e água quente do cozimento.',
      'Cozinhe os floretes de brócolis no vapor por 4 minutos e monte o prato conforme padrão.'
    ]
  },

  // JANTAR
  {
    id: 'rec-10',
    title: 'Omelete de Forno com Abobrinha, Cenoura e Queijo',
    category: 'Jantar',
    prepTime: 20,
    servings: 2,
    calories: 310,
    protein: 22,
    carbs: 11,
    fat: 19,
    tags: ['Low Carb', 'Vegetariano', 'Sem Glúten', 'Econômico', 'Rápido'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/omelete-de-forno-com-legumes.jpg',
    source: 'Ficha Técnica NeatEat Brasil',
    portionWeight: '240g por porção',
    platingInstructions:
      'Cortar a omelete assada em fatia triangular alta (estilo frittata italiana), posicionar no centro do prato com o topo gratinado voltado para cima e decorar com fios de cenoura ou ervas frescas.',
    specificInstructions:
      'Espremer levemente a abobrinha ralada em pano limpo ou peneira antes de incorporar aos ovos para evitar excesso de água na cocção. Alergênicos: contém ovo e lactose.',
    ingredients: [
      { name: 'Ovo', amount: 4, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 3.60 },
      { name: 'Abobrinha italiana', amount: 150, unit: 'g', aisle: 'Hortifruti', basePrice: 1.40 },
      { name: 'Cenoura', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 0.85 },
      { name: 'Queijo muçarela', amount: 50, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 2.60 },
      { name: 'Cebola', amount: 50, unit: 'g', aisle: 'Hortifruti', basePrice: 0.45 },
    ],
    steps: [
      'Rale a abobrinha e a cenoura no ralo grosso, retire o excesso de umidade da abobrinha e pique a cebola finamente.',
      'Bata os 4 ovos até espumarem e incorpore os legumes e metade do queijo muçarela.',
      'Despeje em assadeira pequena untada (ou frigideira de fundo triplo tampada) e cubra com o restante do queijo.',
      'Asse a 190°C por 15 minutos até inflar e dourar a superfície.'
    ]
  },
  {
    id: 'rec-11',
    title: 'Caldo Verde Fit de Mandioquinha com Frango Desfiado e Couve',
    category: 'Jantar',
    prepTime: 25,
    servings: 2,
    calories: 380,
    protein: 31,
    carbs: 40,
    fat: 9,
    tags: ['Sem Glúten', 'Sem Lactose', 'Alta Proteína', 'Econômico'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/sopa-de-mandioquinha-0.jpg',
    source: 'Ficha Técnica NeatEat Brasil',
    portionWeight: '350ml (340g) por porção',
    platingInstructions:
      'Servir o caldo cremoso bem quente (75°C) em cumbuca de porcelana funda, posicionar um ninho de couve fatiada chiffonade no centro e finalizar com fio em espiral de azeite extravirgem.',
    specificInstructions:
      'A couve deve entrar apenas no último minuto com o fogo já desligado para manter a cor verde-esmeralda e a crocância suave. Pode ser congelado por até 90 dias (adicionar a couve fresca apenas ao reaquecer).',
    ingredients: [
      { name: 'Mandioquinha (batata-baroa)', amount: 250, unit: 'g', aisle: 'Hortifruti', basePrice: 3.90 },
      { name: 'Peito de frango', amount: 220, unit: 'g', aisle: 'Açougue', basePrice: 5.10 },
      { name: 'Couve manteiga', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 1.50 },
      { name: 'Alho', amount: 10, unit: 'g', aisle: 'Hortifruti', basePrice: 0.40 },
      { name: 'Azeite de oliva', amount: 10, unit: 'ml', aisle: 'Mercearia', basePrice: 0.90 },
    ],
    steps: [
      'Cozinhe a mandioquinha descascada em água com sal até amaciar e bata no liquidificador com a água do cozimento até obter creme liso.',
      'Em uma panela, doure o alho no azeite, adicione o frango cozido e desfiado e despeje o creme de mandioquinha.',
      'Deixe apurar por 3 minutos em fogo baixo, desligue e incorpore a couve manteiga fatiada bem fininha.',
      'Sirva em cumbuca aquecida finalizado com fio de azeite.'
    ]
  },
  {
    id: 'rec-12',
    title: 'Macarrão ao Alho, Óleo, Brócolis e Iscas de Frango',
    category: 'Jantar',
    prepTime: 18,
    servings: 2,
    calories: 490,
    protein: 34,
    carbs: 58,
    fat: 13,
    tags: ['Sem Lactose', 'Alta Proteína', 'Econômico', 'Rápido'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/macarrao-com-brocolis-00-1.jpg',
    source: 'Ficha Técnica NeatEat Brasil',
    portionWeight: '340g por porção',
    platingInstructions:
      'Enrolar o espaguete com pinça culinária e concha formando um ninho alto no centro do prato fundo, distribuir as iscas de frango douradas e os floretes de brócolis ao redor e finalizar com lâminas de alho dourado no topo.',
    specificInstructions:
      'Reservar 60ml da água do cozimento da massa (rica em amido) para emulsionar o azeite na frigideira e garantir brilho ao macarrão. Alergênicos: contém glúten.',
    ingredients: [
      { name: 'Macarrão espaguete ou penne', amount: 180, unit: 'g', aisle: 'Mercearia', basePrice: 1.80 },
      { name: 'Peito de frango', amount: 240, unit: 'g', aisle: 'Açougue', basePrice: 5.50 },
      { name: 'Brócolis ninja', amount: 180, unit: 'g', aisle: 'Hortifruti', basePrice: 3.10 },
      { name: 'Alho', amount: 15, unit: 'g', aisle: 'Hortifruti', basePrice: 0.60 },
      { name: 'Azeite de oliva', amount: 15, unit: 'ml', aisle: 'Mercearia', basePrice: 1.35 },
    ],
    steps: [
      'Cozinhe o macarrão em água salgada abundante até ficar al dente; adicione os floretes de brócolis nos últimos 3 minutos.',
      'Em frigideira larga, salteie as iscas de frango no azeite até dourarem e adicione o alho laminado em fogo médio para não amargar.',
      'Transfira a massa e o brócolis direto para a frigideira com meia concha da água do cozimento, salteando por 1 minuto.',
      'Emprate em formato de ninho alto com as iscas e o brócolis no topo.'
    ]
  },
  {
    id: 'rec-13',
    title: 'Bowl Mexicano Brasileiro (Arroz, Feijão, Carne Moída e Tomate)',
    category: 'Jantar',
    prepTime: 20,
    servings: 2,
    calories: 520,
    protein: 35,
    carbs: 49,
    fat: 20,
    tags: ['Sem Glúten', 'Sem Lactose', 'Alta Proteína'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/lomo-saltado.jpg',
    source: 'Ficha Técnica NeatEat Brasil',
    portionWeight: '370g por porção',
    platingInstructions:
      'Montar em bowl redondo dividido visualmente em 4 quadrantes sobre base de arroz: carne moída temperada, feijão encorpado e tomate em cubos estilo pico de gallo, com gomo de limão taiti posicionado no centro.',
    specificInstructions:
      'Temperar o tomate picado apenas na hora da montagem para não soltar líquido excessivo sobre o arroz.',
    ingredients: [
      { name: 'Carne moída (patinho ou acém)', amount: 250, unit: 'g', aisle: 'Açougue', basePrice: 8.75 },
      { name: 'Feijão carioca cozido', amount: 180, unit: 'g', aisle: 'Mercearia', basePrice: 1.70 },
      { name: 'Arroz branco', amount: 120, unit: 'g', aisle: 'Mercearia', basePrice: 1.00 },
      { name: 'Tomate', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 1.30 },
      { name: 'Limão taiti', amount: 1, unit: 'un', aisle: 'Hortifruti', basePrice: 0.45 },
    ],
    steps: [
      'Refogue a carne moída em fogo alto até ficar bem soltinha e dourada.',
      'Aqueça o arroz e o feijão separadamente.',
      'Corte o tomate em cubos pequenos sem sementes e tempere com gotas de limão.',
      'Monte o bowl em setores organizados e finalize com um gomo de limão.'
    ]
  },
  {
    id: 'rec-14',
    title: 'Frigideira Low Carb de Frango, Abobrinha e Tomate Cereja',
    category: 'Jantar',
    prepTime: 15,
    servings: 2,
    calories: 330,
    protein: 38,
    carbs: 12,
    fat: 14,
    tags: ['Low Carb', 'Sem Glúten', 'Sem Lactose', 'Alta Proteína', 'Rápido', 'Econômico'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/abobrinha-recheada-com-frango.jpeg',
    source: 'Ficha Técnica NeatEat Brasil',
    portionWeight: '310g por porção',
    platingInstructions:
      'Servir em prato raso pré-aquecido dispondo os cubos dourados de frango entremeados com as meias-luas de abobrinha al dente e os tomates levemente tostados, regando com o próprio suco de deglaçagem da frigideira.',
    specificInstructions:
      'Não sobrepor os cubos de frango na frigideira para garantir que grelhem em vez de cozinhar no vapor. Tempo máximo de cocção da abobrinha: 4 minutos.',
    ingredients: [
      { name: 'Peito de frango', amount: 300, unit: 'g', aisle: 'Açougue', basePrice: 6.90 },
      { name: 'Abobrinha italiana', amount: 200, unit: 'g', aisle: 'Hortifruti', basePrice: 1.85 },
      { name: 'Tomate', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.50 },
      { name: 'Azeite de oliva', amount: 10, unit: 'ml', aisle: 'Mercearia', basePrice: 0.90 },
      { name: 'Orégano', amount: 3, unit: 'g', aisle: 'Temperos', basePrice: 0.20 },
    ],
    steps: [
      'Corte o peito de frango em cubos padronizados de 2,5cm e doure em frigideira bem quente com azeite por 6 minutos.',
      'Adicione a abobrinha cortada em meia-lua de 0,5cm e salteie em fogo alto por 3 minutos.',
      'Junte o tomate em cubos grandes e o orégano, salteando por mais 1 minuto apenas para aquecer.',
      'Sirva imediatamente preservando a textura crocante da abobrinha.'
    ]
  }
];

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      household_code TEXT NOT NULL,
      weekly_budget REAL NOT NULL DEFAULT 250.0,
      supermarket_id TEXT NOT NULL DEFAULT 'atacadao',
      dietary_filter TEXT NOT NULL DEFAULT 'Todas',
      household_size INTEGER NOT NULL DEFAULT 2,
      last_seen_version TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      prep_time INTEGER NOT NULL,
      servings INTEGER NOT NULL,
      calories INTEGER NOT NULL,
      protein INTEGER NOT NULL,
      carbs INTEGER NOT NULL,
      fat INTEGER NOT NULL,
      tags_json TEXT NOT NULL,
      image TEXT NOT NULL,
      source TEXT NOT NULL,
      ingredients_json TEXT NOT NULL,
      steps_json TEXT NOT NULL,
      portion_weight TEXT NOT NULL DEFAULT '350g por porção',
      plating_instructions TEXT NOT NULL DEFAULT '',
      specific_instructions TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS meal_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day TEXT NOT NULL,
      slot TEXT NOT NULL,
      recipe_id TEXT NOT NULL,
      UNIQUE(day, slot)
    );

    CREATE TABLE IF NOT EXISTS fridge_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL DEFAULT 'Hortifruti'
    );

    CREATE TABLE IF NOT EXISTS shopping_state (
      item_key TEXT PRIMARY KEY,
      checked INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS suggestion_swipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      suggestion_id TEXT UNIQUE NOT NULL,
      action TEXT NOT NULL,
      recipe_json TEXT NOT NULL,
      swiped_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Safe migrations for existing databases
  const safeMigrations = [
    `ALTER TABLE users ADD COLUMN last_seen_version TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE recipes ADD COLUMN portion_weight TEXT NOT NULL DEFAULT '350g por porção'`,
    `ALTER TABLE recipes ADD COLUMN plating_instructions TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE recipes ADD COLUMN specific_instructions TEXT NOT NULL DEFAULT ''`,
  ];
  for (const sql of safeMigrations) {
    try {
      db.exec(sql);
    } catch {
      // Column already exists
    }
  }

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    db.prepare(`
      INSERT INTO users (name, email, household_code, weekly_budget, supermarket_id, dietary_filter, household_size)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('Família Silva', 'familia@neateat.com.br', 'NEAT-BR-8492', 250.0, 'atacadao', 'Todas', 2);
  }

  const recipeCount = db.prepare('SELECT COUNT(*) as count FROM recipes').get().count;
  if (recipeCount === 0) {
    const insertRecipe = db.prepare(`
      INSERT INTO recipes (
        id, title, category, prep_time, servings, calories, protein, carbs, fat,
        tags_json, image, source, ingredients_json, steps_json,
        portion_weight, plating_instructions, specific_instructions
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const r of INITIAL_RECIPES) {
      insertRecipe.run(
        r.id,
        r.title,
        r.category,
        r.prepTime,
        r.servings,
        r.calories,
        r.protein,
        r.carbs,
        r.fat,
        JSON.stringify(r.tags),
        r.image,
        r.source,
        JSON.stringify(r.ingredients),
        JSON.stringify(r.steps),
        r.portionWeight,
        r.platingInstructions,
        r.specificInstructions
      );
    }
  } else {
    // Upgrade existing built-in recipes with Ficha Técnica fields & exact dish images if still using old Unsplash or Bing URLs
    const updateBuiltIn = db.prepare(`
      UPDATE recipes
      SET image = ?,
          source = ?,
          portion_weight = ?,
          plating_instructions = ?,
          specific_instructions = ?
      WHERE id = ? AND (plating_instructions = '' OR image LIKE '%unsplash.com%' OR image LIKE '%bing.com%')
    `);
    for (const r of INITIAL_RECIPES) {
      updateBuiltIn.run(
        r.image,
        r.source,
        r.portionWeight,
        r.platingInstructions,
        r.specificInstructions,
        r.id
      );
    }
  }

  const fridgeCount = db.prepare('SELECT COUNT(*) as count FROM fridge_items').get().count;
  if (fridgeCount === 0) {
    const insertFridge = db.prepare('INSERT OR IGNORE INTO fridge_items (name, category) VALUES (?, ?)');
    insertFridge.run('Ovo', 'Laticínios e Ovos');
    insertFridge.run('Arroz branco', 'Mercearia');
    insertFridge.run('Alho', 'Hortifruti');
    insertFridge.run('Azeite de oliva', 'Mercearia');
  }

  const planCount = db.prepare('SELECT COUNT(*) as count FROM meal_plans').get().count;
  if (planCount === 0) {
    generateSmartMealPlan(250.0, 'Todas', 2);
  }
}

export function getAllRecipes() {
  const rows = db.prepare('SELECT * FROM recipes ORDER BY rowid DESC').all();
  return rows.map((r) => {
    const ingredients = JSON.parse(r.ingredients_json);
    const totalBaseCost = ingredients.reduce((sum, ing) => sum + Number(ing.basePrice || 0), 0);
    const costPerServing = totalBaseCost / (r.servings || 1);
    return {
      id: r.id,
      title: r.title,
      category: r.category,
      prepTime: r.prep_time,
      servings: r.servings,
      calories: r.calories,
      protein: r.protein,
      carbs: r.carbs,
      fat: r.fat,
      tags: JSON.parse(r.tags_json),
      image: r.image,
      source: r.source,
      ingredients,
      steps: JSON.parse(r.steps_json),
      portionWeight: r.portion_weight || '350g por porção',
      platingInstructions:
        r.plating_instructions ||
        'Dispor a porção centralizada em prato aquecido e finalizar com ervas frescas.',
      specificInstructions:
        r.specific_instructions ||
        'Manter sob refrigeração até o momento do preparo. Verificar ponto de sal antes do serviço.',
      baseCost: Number(totalBaseCost.toFixed(2)),
      costPerServing: Number(costPerServing.toFixed(2)),
    };
  });
}

export function generateSmartMealPlan(weeklyBudget, dietaryFilter, householdSize = 2) {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const slots = ['Café da Manhã', 'Almoço', 'Jantar'];
  const allRecipes = getAllRecipes();
  if (allRecipes.length === 0) return;

  const matchesDiet = (r) => {
    if (!dietaryFilter || dietaryFilter === 'Todas') return true;
    return r.tags.includes(dietaryFilter);
  };

  let eligible = allRecipes.filter(matchesDiet);
  if (eligible.length < 3) eligible = allRecipes;

  db.exec('DELETE FROM meal_plans');
  const insertSlot = db.prepare('INSERT INTO meal_plans (day, slot, recipe_id) VALUES (?, ?, ?)');

  let runningTotal = 0;

  for (let dIdx = 0; dIdx < days.length; dIdx++) {
    const day = days[dIdx];
    for (const slot of slots) {
      let pool = eligible.filter((r) => r.category === slot);
      if (pool.length === 0) pool = eligible;

      const scored = pool.map((r) => {
        const slotCost = r.costPerServing * householdSize;
        return { recipe: r, slotCost };
      });

      const remainingSlots = (days.length - dIdx) * 3 - slots.indexOf(slot);
      const maxAllowedSlotCost = Math.max(4, (weeklyBudget - runningTotal) / Math.max(1, remainingSlots));

      const affordable = scored.filter((s) => s.slotCost <= maxAllowedSlotCost * 1.15);
      const candidateList = affordable.length > 0 ? affordable : scored.sort((a, b) => a.slotCost - b.slotCost);

      const chosen = candidateList[(dIdx + slots.indexOf(slot)) % candidateList.length];
      runningTotal += chosen.slotCost;
      insertSlot.run(day, slot, chosen.recipe.id);
    }
  }
}

export const SUGGESTION_RECIPES = [
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
    image: 'https://www.receiteria.com.br/wp-content/uploads/pao-de-queijo-de-frigideira-capa.png',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '160g por porção',
    platingInstructions:
      'Dobrar ao meio ou servir em disco dourado em prato de cerâmica aquecido, exibindo o queijo derretido no interior.',
    specificInstructions:
      'Assar em fogo baixo com frigideira antiaderente tampada nos primeiros 3 minutos para crescer uniformemente.',
    ingredients: [
      { name: 'Polvilho doce ou goma de tapioca', amount: 40, unit: 'g', aisle: 'Mercearia', basePrice: 0.90 },
      { name: 'Ovo', amount: 1, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 0.95 },
      { name: 'Queijo minas meia cura ou muçarela', amount: 45, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 2.40 },
      { name: 'Requeijão cremoso', amount: 25, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 1.10 },
    ],
    steps: [
      'Bata o ovo com o requeijão, o polvilho e uma pitada de sal até obter massa lisa.',
      'Incorpore o queijo ralado e despeje em frigideira antiaderente levemente untada.',
      'Doure dos dois lados em fogo baixo até formar crosta dourada de pão de queijo.',
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
    image: 'https://www.receiteria.com.br/wp-content/uploads/panqueca-de-banana-fit-com-aveia.jpeg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '210g por porção',
    platingInstructions:
      'Empilhar dois discos médios centralizados no prato, finalizar com rodelas de banana fresca, fio de mel e canela polvilhada.',
    specificInstructions:
      'Utilizar bananas bem maduras (casca pintada) para garantir dulçor natural sem necessidade de açúcar refinado.',
    ingredients: [
      { name: 'Banana nanica', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.10 },
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
      { name: 'Aveia em flocos', amount: 35, unit: 'g', aisle: 'Mercearia', basePrice: 0.85 },
      { name: 'Canela em pó', amount: 3, unit: 'g', aisle: 'Temperos', basePrice: 0.25 },
    ],
    steps: [
      'Amasse a banana e misture vigorosamente com os ovos, a aveia e a canela.',
      'Aqueça uma frigideira antiaderente em fogo baixo e forme discos pequenos.',
      'Doure por 2 minutos de cada lado e sirva empilhado.',
    ],
  },
  {
    id: 'sug-3',
    title: 'Tapioca Recheada com Queijo e Ovo Cremoso',
    category: 'Café da Manhã',
    prepTime: 8,
    servings: 1,
    calories: 330,
    protein: 19,
    carbs: 31,
    fat: 14,
    tags: ['Sem Glúten', 'Rápido', 'Alta Proteína', 'Vegetariano'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/tapioca-de-queijo-com-ovo-e1693489568393.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '190g por porção',
    platingInstructions:
      'Fechar a tapioca em meia-lua com o queijo gratinando nas bordas e finalizar com orégano seco.',
    specificInstructions:
      'Peneirar a goma de tapioca diretamente na frigideira quente para obter textura fina e maleável.',
    ingredients: [
      { name: 'Goma de tapioca', amount: 65, unit: 'g', aisle: 'Mercearia', basePrice: 1.30 },
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
      { name: 'Queijo muçarela', amount: 40, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 2.10 },
      { name: 'Orégano seco', amount: 2, unit: 'g', aisle: 'Temperos', basePrice: 0.15 },
    ],
    steps: [
      'Espalhe a goma de tapioca na frigideira aquecida até unir em disco.',
      'Adicione os ovos mexidos cremosos e as fatias de queijo sobre metade do disco.',
      'Dobre ao meio, deixe o queijo derreter por 1 minuto e sirva imediatamente.',
    ],
  },
  {
    id: 'sug-4',
    title: 'Vitamina Cremosa de Abacate com Aveia',
    category: 'Café da Manhã',
    prepTime: 5,
    servings: 1,
    calories: 340,
    protein: 12,
    carbs: 29,
    fat: 19,
    tags: ['Rápido', 'Vegetariano', 'Sem Glúten', 'Econômico'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/vitamina-de-abacate-0.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '350ml por porção',
    platingInstructions:
      'Servir em copo alto resfriado com farelo fino de aveia e hortelã fresca no topo.',
    specificInstructions:
      'Bater com leite gelado e pedras de gelo no momento do serviço para evitar oxidação do abacate.',
    ingredients: [
      { name: 'Abacate maduro', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.90 },
      { name: 'Leite integral', amount: 200, unit: 'ml', aisle: 'Laticínios e Ovos', basePrice: 1.30 },
      { name: 'Aveia em flocos', amount: 25, unit: 'g', aisle: 'Mercearia', basePrice: 0.65 },
      { name: 'Mel ou adoçante', amount: 10, unit: 'g', aisle: 'Mercearia', basePrice: 0.45 },
    ],
    steps: [
      'Coloque a polpa de abacate gelada, o leite, a aveia e o mel no liquidificador.',
      'Bata em velocidade alta por 45 segundos até atingir textura aveludada.',
      'Sirva imediatamente em copo resfriado.',
    ],
  },
  {
    id: 'sug-5',
    title: 'Bolo de Caneca de Banana e Cacau Sem Leite',
    category: 'Café da Manhã',
    prepTime: 7,
    servings: 1,
    calories: 275,
    protein: 11,
    carbs: 38,
    fat: 8,
    tags: ['Sem Lactose', 'Rápido', 'Econômico', 'Vegetariano'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/bolo-de-caneca-sem-leite-capa.jpeg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '165g por porção',
    platingInstructions:
      'Servir na própria caneca de porcelana ou desenformado em prato de sobremesa com fios de calda de cacau.',
    specificInstructions:
      'Não ultrapassar 2 minutos de cocção no micro-ondas para preservar a umidade interna da massa.',
    ingredients: [
      { name: 'Banana nanica', amount: 90, unit: 'g', aisle: 'Hortifruti', basePrice: 0.85 },
      { name: 'Ovo', amount: 1, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 0.95 },
      { name: 'Aveia em flocos', amount: 30, unit: 'g', aisle: 'Mercearia', basePrice: 0.75 },
      { name: 'Cacau em pó 100%', amount: 12, unit: 'g', aisle: 'Mercearia', basePrice: 0.95 },
    ],
    steps: [
      'Amasse bem a banana dentro de uma caneca grande e misture o ovo.',
      'Adicione a aveia, o cacau em pó e meia colher de chá de fermento químico.',
      'Asse por 1 minuto e 45 segundos em potência alta e sirva quente.',
    ],
  },
  {
    id: 'sug-6',
    title: 'Avocado Toast Brasileiro com Ovo Cremoso',
    category: 'Café da Manhã',
    prepTime: 10,
    servings: 1,
    calories: 325,
    protein: 14,
    carbs: 26,
    fat: 18,
    tags: ['Rápido', 'Vegetariano'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/avocado-toast-com-ovo-2.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '185g por porção',
    platingInstructions:
      'Montar sobre fatia rústica tostada, espalhar o creme de abacate temperado com limão e posicionar o ovo no topo.',
    specificInstructions:
      'Temperar a pasta de abacate com gotas de limão taiti imediatamente após amassar para manter o verde vibrante.',
    ingredients: [
      { name: 'Pão integral', amount: 60, unit: 'g', aisle: 'Padaria', basePrice: 1.40 },
      { name: 'Abacate maduro', amount: 85, unit: 'g', aisle: 'Hortifruti', basePrice: 1.50 },
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
      { name: 'Limão taiti', amount: 15, unit: 'ml', aisle: 'Hortifruti', basePrice: 0.25 },
    ],
    steps: [
      'Toste o pão integral na frigideira até ficar crocante.',
      'Amasse o abacate com gotas de limão, sal e pimenta-do-reino.',
      'Espalhe sobre a torrada, finalize com os ovos preparados na hora e sirva.',
    ],
  },
  {
    id: 'sug-7',
    title: 'Baião de Dois Nordestino com Queijo Coalho',
    category: 'Almoço',
    prepTime: 30,
    servings: 3,
    calories: 520,
    protein: 29,
    carbs: 54,
    fat: 19,
    tags: ['Econômico', 'Alta Proteína', 'Sem Glúten'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/baiao-de-dois.jpeg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '390g por porção',
    platingInstructions:
      'Enformar em aro redondo ou tigela de barro, coroar com cubos dourados de queijo coalho e coentro fresco picado.',
    specificInstructions:
      'Cozinhar o arroz no próprio caldo do feijão para absorver cor, sabor e manter o prato úmido.',
    ingredients: [
      { name: 'Arroz branco', amount: 220, unit: 'g', aisle: 'Mercearia', basePrice: 1.65 },
      { name: 'Feijão carioca cozido', amount: 260, unit: 'g', aisle: 'Mercearia', basePrice: 2.30 },
      { name: 'Queijo coalho', amount: 150, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 6.50 },
      { name: 'Linguiça calabresa ou bacon em cubos', amount: 120, unit: 'g', aisle: 'Açougue', basePrice: 4.80 },
      { name: 'Cebola', amount: 80, unit: 'g', aisle: 'Hortifruti', basePrice: 0.65 },
    ],
    steps: [
      'Doure a calabresa em cubos com cebola e alho até liberar aroma.',
      'Junte o arroz, o feijão cozido com seu caldo e cozinhe até ficar cremoso.',
      'Misture metade do queijo coalho na panela e finalize o topo com cubos grelhados.',
    ],
  },
  {
    id: 'sug-8',
    title: 'Picadinho de Carne Bovina com Legumes da Horta',
    category: 'Almoço',
    prepTime: 35,
    servings: 3,
    calories: 430,
    protein: 35,
    carbs: 34,
    fat: 15,
    tags: ['Alta Proteína', 'Sem Glúten', 'Sem Lactose', 'Econômico'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/picadinho-de-carne-com-legumes-capa.png',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '380g por porção',
    platingInstructions:
      'Servir o picadinho encorpado na metade principal do prato fundo aquecido, acompanhado de arroz branco soltinho.',
    specificInstructions:
      'Selar os cubos de carne em lotes pequenos em fogo forte antes de adicionar água para garantir molho escuro e saboroso.',
    ingredients: [
      { name: 'Carne bovina em cubos (acém ou patinho)', amount: 450, unit: 'g', aisle: 'Açougue', basePrice: 16.20 },
      { name: 'Cenoura', amount: 140, unit: 'g', aisle: 'Hortifruti', basePrice: 1.15 },
      { name: 'Batata inglesa', amount: 200, unit: 'g', aisle: 'Hortifruti', basePrice: 1.60 },
      { name: 'Tomate', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.10 },
      { name: 'Cebola', amount: 90, unit: 'g', aisle: 'Hortifruti', basePrice: 0.70 },
    ],
    steps: [
      'Sele os cubos de carne em panela bem quente com fio de azeite até dourarem.',
      'Acrescente cebola, alho e tomate picados para deglaçar o fundo da panela.',
      'Adicione água quente, a cenoura e a batata em cubos e cozinhe até ficarem macios e o caldo encorpar.',
    ],
  },
  {
    id: 'sug-9',
    title: 'Frango Xadrez Oriental com Pimentões',
    category: 'Almoço',
    prepTime: 22,
    servings: 2,
    calories: 390,
    protein: 38,
    carbs: 28,
    fat: 13,
    tags: ['Alta Proteína', 'Rápido', 'Sem Lactose'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/frango-xadrez-10.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '340g por porção',
    platingInstructions:
      'Dispor o frango xadrez brilhante com pimentões coloridos ainda crocantes e finalizar com amendoim ou castanha torrada.',
    specificInstructions:
      'Saltear os pimentões e a cebola em pétalas por apenas 2 minutos em fogo alto para manterem textura al dente.',
    ingredients: [
      { name: 'Peito de frango', amount: 350, unit: 'g', aisle: 'Açougue', basePrice: 7.90 },
      { name: 'Pimentão colorido', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.80 },
      { name: 'Cebola', amount: 90, unit: 'g', aisle: 'Hortifruti', basePrice: 0.70 },
      { name: 'Amendoim torrado sem pele', amount: 35, unit: 'g', aisle: 'Mercearia', basePrice: 1.10 },
      { name: 'Arroz branco', amount: 140, unit: 'g', aisle: 'Mercearia', basePrice: 1.10 },
    ],
    steps: [
      'Corte o peito de frango em cubos de 2,5cm e sele em frigideira ampla bem quente.',
      'Adicione a cebola e os pimentões cortados em quadrados e salteie rapidamente.',
      'Envolva no molho aromático encorpado, finalize com o amendoim crocante e sirva com arroz.',
    ],
  },
  {
    id: 'sug-10',
    title: 'Moqueca Capixaba de Peixe com Coentro Fresco',
    category: 'Almoço',
    prepTime: 28,
    servings: 2,
    calories: 370,
    protein: 36,
    carbs: 24,
    fat: 14,
    tags: ['Alta Proteína', 'Sem Glúten', 'Sem Lactose'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/moqueca-de-peixe-com-camarao.jpeg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '360g por porção',
    platingInstructions:
      'Apresentar as postas de peixe íntegras banhadas pelo molho avermelhado de tomate e urucum, finalizadas com coentro e cebolinha.',
    specificInstructions:
      'Não mexer com colher após dispor os filés de peixe; apenas girar a panela pelas alças para não quebrar as postas.',
    ingredients: [
      { name: 'Filé de tilápia', amount: 350, unit: 'g', aisle: 'Peixaria', basePrice: 14.50 },
      { name: 'Tomate', amount: 180, unit: 'g', aisle: 'Hortifruti', basePrice: 1.60 },
      { name: 'Cebola', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 0.80 },
      { name: 'Azeite de oliva', amount: 15, unit: 'ml', aisle: 'Mercearia', basePrice: 1.10 },
      { name: 'Arroz branco', amount: 130, unit: 'g', aisle: 'Mercearia', basePrice: 1.05 },
    ],
    steps: [
      'Tempere os filés de peixe com limão, alho e sal por 10 minutos.',
      'Monte camadas de rodelas de cebola, tomate e peixe na panela com fio de azeite e colorau.',
      'Tampe e cozinhe em fogo médio por 15 minutos até o molho apurar.',
    ],
  },
  {
    id: 'sug-11',
    title: 'Bobó de Frango Cremoso com Mandioca',
    category: 'Almoço',
    prepTime: 30,
    servings: 3,
    calories: 460,
    protein: 33,
    carbs: 46,
    fat: 14,
    tags: ['Econômico', 'Alta Proteína', 'Sem Glúten'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/bobo-de-frango-capa.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '370g por porção',
    platingInstructions:
      'Servir em prato fundo aquecido com textura cremosa aveludada e finalizar com cheiro-verde picado.',
    specificInstructions:
      'Bater a mandioca cozida ainda quente com o próprio caldo do cozimento para obter creme liso sem grumos.',
    ingredients: [
      { name: 'Peito de frango', amount: 400, unit: 'g', aisle: 'Açougue', basePrice: 8.90 },
      { name: 'Mandioca descascada', amount: 350, unit: 'g', aisle: 'Hortifruti', basePrice: 2.90 },
      { name: 'Leite de coco', amount: 150, unit: 'ml', aisle: 'Mercearia', basePrice: 2.80 },
      { name: 'Tomate', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.10 },
      { name: 'Cebola', amount: 80, unit: 'g', aisle: 'Hortifruti', basePrice: 0.65 },
    ],
    steps: [
      'Cozinhe a mandioca até ficar macia e bata no liquidificador formando um creme.',
      'Refogue o frango em cubos ou tiras com cebola, alho e tomate.',
      'Incorpore o creme de mandioca e o leite de coco, apure por 5 minutos e sirva.',
    ],
  },
  {
    id: 'sug-12',
    title: 'Arroz de Forno Cremoso com Frango Desfiado',
    category: 'Almoço',
    prepTime: 25,
    servings: 3,
    calories: 475,
    protein: 31,
    carbs: 48,
    fat: 16,
    tags: ['Econômico', 'Alta Proteína', 'Sem Glúten'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/arroz-de-forno-com-frango-capa.png',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '360g por porção',
    platingInstructions:
      'Retirar porção retangular firme do refratário preservando a camada superior de queijo muçarela gratinado.',
    specificInstructions:
      'Ideal para aproveitamento nobre de arroz já cozido; gratinar nos últimos 8 minutos em forno a 220°C.',
    ingredients: [
      { name: 'Peito de frango', amount: 350, unit: 'g', aisle: 'Açougue', basePrice: 7.90 },
      { name: 'Arroz branco', amount: 240, unit: 'g', aisle: 'Mercearia', basePrice: 1.80 },
      { name: 'Queijo muçarela', amount: 100, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 4.90 },
      { name: 'Requeijão cremoso', amount: 100, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 3.40 },
      { name: 'Tomate', amount: 100, unit: 'g', aisle: 'Hortifruti', basePrice: 0.90 },
    ],
    steps: [
      'Refogue o frango desfiado com tomate, cebola e envolva com o requeijão e o arroz cozido.',
      'Transfira para refratário, cubra com a muçarela e leve ao forno até borbulhar e dourar.',
    ],
  },
  {
    id: 'sug-13',
    title: 'Panqueca Caseira de Carne Moída ao Molho Sugo',
    category: 'Jantar',
    prepTime: 25,
    servings: 2,
    calories: 440,
    protein: 29,
    carbs: 38,
    fat: 17,
    tags: ['Econômico', 'Alta Proteína'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/panqueca-de-carne-moida.jpeg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '320g por porção',
    platingInstructions:
      'Posicionar dois rolos de panqueca lado a lado no centro do prato, cobrir a faixa central com molho de tomate rústico e queijo gratinado.',
    specificInstructions:
      'Escorrer eventual excesso de líquido da carne moída antes de enrolar para manter a massa firme.',
    ingredients: [
      { name: 'Carne moída (patinho ou acém)', amount: 280, unit: 'g', aisle: 'Açougue', basePrice: 9.80 },
      { name: 'Ovo', amount: 2, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
      { name: 'Leite integral', amount: 180, unit: 'ml', aisle: 'Laticínios e Ovos', basePrice: 1.15 },
      { name: 'Tomate', amount: 160, unit: 'g', aisle: 'Hortifruti', basePrice: 1.45 },
      { name: 'Queijo muçarela', amount: 50, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 2.50 },
    ],
    steps: [
      'Prepare discos finos de massa na frigideira e reserve.',
      'Recheie com a carne moída bem temperada, enrole e cubra com molho de tomate e queijo para gratinar.',
    ],
  },
  {
    id: 'sug-14',
    title: 'Caldo Verde Português com Batata e Couve Fina',
    category: 'Jantar',
    prepTime: 25,
    servings: 3,
    calories: 320,
    protein: 14,
    carbs: 36,
    fat: 12,
    tags: ['Econômico', 'Sem Glúten', 'Sem Lactose'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/caldo-verde-capa.jpeg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '350ml por porção',
    platingInstructions:
      'Servir fumegante em cumbuca de porcelana, finalizar com rodelas douradas no centro e um fio de azeite extravirgem.',
    specificInstructions:
      'Adicionar a couve cortada em chiffonade finíssima apenas com o fogo já desligado para manter a cor verde viva.',
    ingredients: [
      { name: 'Batata inglesa', amount: 450, unit: 'g', aisle: 'Hortifruti', basePrice: 3.60 },
      { name: 'Couve manteiga', amount: 120, unit: 'g', aisle: 'Hortifruti', basePrice: 1.90 },
      { name: 'Linguiça calabresa', amount: 140, unit: 'g', aisle: 'Açougue', basePrice: 5.20 },
      { name: 'Cebola', amount: 70, unit: 'g', aisle: 'Hortifruti', basePrice: 0.55 },
      { name: 'Azeite de oliva', amount: 15, unit: 'ml', aisle: 'Mercearia', basePrice: 1.10 },
    ],
    steps: [
      'Cozinhe as batatas com cebola e alho e bata até formar um creme aveludado.',
      'Junte a calabresa dourada em rodelas, ferva por 2 minutos, desligue o fogo e incorpore a couve fatiada fina.',
    ],
  },
  {
    id: 'sug-15',
    title: 'Quiche Leve de Alho-Poró com Queijo Minas',
    category: 'Jantar',
    prepTime: 30,
    servings: 3,
    calories: 350,
    protein: 18,
    carbs: 24,
    fat: 19,
    tags: ['Vegetariano', 'Econômico'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/quiche-de-alho-poro-capa.png',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '220g por porção',
    platingInstructions:
      'Servir fatia triangular alta e dourada acompanhada de folhas verdes frescas temperadas com azeite.',
    specificInstructions:
      'Aguardar 5 minutos fora do forno antes de fatiar para estabilizar o creme de ovos e queijo.',
    ingredients: [
      { name: 'Alho-poró fresco', amount: 160, unit: 'g', aisle: 'Hortifruti', basePrice: 3.90 },
      { name: 'Ovo', amount: 3, unit: 'un', aisle: 'Laticínios e Ovos', basePrice: 2.70 },
      { name: 'Queijo minas ou muçarela', amount: 120, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 5.40 },
      { name: 'Aveia em flocos', amount: 80, unit: 'g', aisle: 'Mercearia', basePrice: 1.80 },
      { name: 'Manteiga sem sal', amount: 35, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 1.90 },
    ],
    steps: [
      'Refogue o alho-poró em rodelas finas na manteiga até amaciar.',
      'Forre a forma com a base leve, despeje o creme de ovos com queijo e alho-poró e asse até dourar.',
    ],
  },
  {
    id: 'sug-16',
    title: 'Salada Caesar Completa com Tiras de Frango Grelhado',
    category: 'Jantar',
    prepTime: 15,
    servings: 2,
    calories: 345,
    protein: 36,
    carbs: 16,
    fat: 14,
    tags: ['Alta Proteína', 'Low Carb', 'Rápido'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/salada-caesar-com-frango.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '290g por porção',
    platingInstructions:
      'Montar cama volumosa de alface crocante, dispor as tiras de frango douradas em leque no topo, croutons e lascas de queijo.',
    specificInstructions:
      'Envolver as folhas no molho apenas no instante de servir para preservar a crocância.',
    ingredients: [
      { name: 'Peito de frango', amount: 300, unit: 'g', aisle: 'Açougue', basePrice: 6.90 },
      { name: 'Alface americana ou romana', amount: 180, unit: 'g', aisle: 'Hortifruti', basePrice: 2.80 },
      { name: 'Pão integral (para croutons)', amount: 50, unit: 'g', aisle: 'Padaria', basePrice: 1.20 },
      { name: 'Queijo parmesão ou muçarela', amount: 40, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 2.90 },
      { name: 'Iogurte natural integral', amount: 80, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 1.60 },
    ],
    steps: [
      'Grelhe o peito de frango temperado e corte em tiras suculentas.',
      'Toste cubos de pão na frigideira com fio de azeite e alho.',
      'Misture as folhas rasgadas com o molho cremoso, disponha o frango e finalize com croutons e queijo.',
    ],
  },
  {
    id: 'sug-17',
    title: 'Wrap Integral de Frango com Salada Crocante',
    category: 'Jantar',
    prepTime: 12,
    servings: 2,
    calories: 365,
    protein: 31,
    carbs: 33,
    fat: 11,
    tags: ['Rápido', 'Alta Proteína', 'Econômico'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/wrap-de-frango-kim-07.jpg',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '260g por porção',
    platingInstructions:
      'Cortar o wrap fechado ao meio em ângulo diagonal de 45° para exibir as camadas internas coloridas.',
    specificInstructions:
      'Selar a dobra do wrap na frigideira quente por 40 segundos para não abrir durante o serviço.',
    ingredients: [
      { name: 'Peito de frango', amount: 260, unit: 'g', aisle: 'Açougue', basePrice: 5.95 },
      { name: 'Massa de wrap ou pão folha', amount: 120, unit: 'g', aisle: 'Padaria', basePrice: 3.80 },
      { name: 'Tomate', amount: 90, unit: 'g', aisle: 'Hortifruti', basePrice: 0.85 },
      { name: 'Cenoura', amount: 70, unit: 'g', aisle: 'Hortifruti', basePrice: 0.60 },
      { name: 'Requeijão cremoso', amount: 50, unit: 'g', aisle: 'Laticínios e Ovos', basePrice: 1.80 },
    ],
    steps: [
      'Espalhe o requeijão sobre o disco de wrap, adicione o frango grelhado em tiras, cenoura ralada e tomate.',
      'Enrole firmemente dobrando as laterais e doure rapidamente na frigideira.',
    ],
  },
  {
    id: 'sug-18',
    title: 'Creme Termogênico de Abóbora com Gengibre e Frango',
    category: 'Jantar',
    prepTime: 22,
    servings: 2,
    calories: 315,
    protein: 28,
    carbs: 26,
    fat: 9,
    tags: ['Low Carb', 'Sem Glúten', 'Sem Lactose', 'Alta Proteína'],
    image: 'https://www.receiteria.com.br/wp-content/uploads/creme-de-abobora-com-gengibre-e-frango.png',
    source: 'Ficha Técnica — Sugestão Curada',
    portionWeight: '340g por porção',
    platingInstructions:
      'Servir o creme liso alaranjado em bowl aquecido e dispor o frango desfiado dourado em destaque no centro.',
    specificInstructions:
      'Ralar o gengibre fresco no final do cozimento para preservar o aroma cítrico e picante.',
    ingredients: [
      { name: 'Abóbora cabotiá', amount: 350, unit: 'g', aisle: 'Hortifruti', basePrice: 2.60 },
      { name: 'Peito de frango', amount: 240, unit: 'g', aisle: 'Açougue', basePrice: 5.50 },
      { name: 'Cebola', amount: 70, unit: 'g', aisle: 'Hortifruti', basePrice: 0.55 },
      { name: 'Gengibre fresco', amount: 10, unit: 'g', aisle: 'Hortifruti', basePrice: 0.35 },
      { name: 'Azeite de oliva', amount: 10, unit: 'ml', aisle: 'Mercearia', basePrice: 0.80 },
    ],
    steps: [
      'Cozinhe a abóbora em cubos com cebola e gengibre até amaciar e processe até virar creme aveludado.',
      'Sirva nas tigelas coroando com o peito de frango desfiado dourado no azeite.',
    ],
  },
];

export function getSuggestionsState() {
  const existingRecipes = getAllRecipes();
  const existingTitles = new Set(existingRecipes.map((r) => r.title.toLowerCase().trim()));
  const existingIds = new Set(existingRecipes.map((r) => r.id));

  const swipedRows = db.prepare('SELECT * FROM suggestion_swipes ORDER BY id DESC').all();
  const swipedMap = new Map(swipedRows.map((row) => [row.suggestion_id, row]));

  const available = [];
  let dismissedCount = 0;

  for (const sug of SUGGESTION_RECIPES) {
    const swipe = swipedMap.get(sug.id);
    if (swipe?.action === 'left') {
      dismissedCount++;
      continue;
    }
    if (swipe?.action === 'right' || existingIds.has(sug.id) || existingTitles.has(sug.title.toLowerCase().trim())) {
      continue;
    }

    const totalBaseCost = sug.ingredients.reduce((sum, ing) => sum + Number(ing.basePrice || 0), 0);
    const costPerServing = totalBaseCost / (sug.servings || 1);
    available.push({
      ...sug,
      baseCost: Number(totalBaseCost.toFixed(2)),
      costPerServing: Number(costPerServing.toFixed(2)),
    });
  }

  const lastSwipeRow = swipedRows[0] || null;
  const lastSwipe = lastSwipeRow
    ? {
        suggestionId: lastSwipeRow.suggestion_id,
        action: lastSwipeRow.action,
        recipe: JSON.parse(lastSwipeRow.recipe_json),
      }
    : null;

  return {
    suggestions: available,
    dismissedCount,
    lastSwipe,
  };
}
