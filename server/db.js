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
    image: 'https://th.bing.com/th/id/OIP.TMYbE-IzytLDO1SqPwbVFAHaHa?w=700&c=7&r=0&o=5',
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
    image: 'https://th.bing.com/th/id/OIP.WfyZvp1dgPebtAYnoy64NAHaFj?w=700&c=7&r=0&o=5',
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
    image: 'https://th.bing.com/th/id/OIP.-vFSInopfgf7QeNbmgWzPAHaE8?w=700&c=7&r=0&o=5',
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
    image: 'https://th.bing.com/th/id/OIP.xtm8aXo8iRE6RfhK4LVP4AHaE-?w=700&c=7&r=0&o=5',
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
    image: 'https://th.bing.com/th/id/OIP.OGSvey-eGn5SZZvJ7gAY_wHaHa?w=700&c=7&r=0&o=5',
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
    image: 'https://th.bing.com/th/id/OIP.8z2LUFxECcMBcbDIPOxwXgHaHa?w=700&c=7&r=0&o=5',
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
    image: 'https://th.bing.com/th/id/OIP.v9zkV6Q0tp0d9WhgKaPZUAHaEN?w=700&c=7&r=0&o=5',
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
    image: 'https://th.bing.com/th/id/OIP.Er2Yunq5GlWbgonkTXIAbgHaGd?w=700&c=7&r=0&o=5',
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
    image: 'https://th.bing.com/th/id/OIP.vM1HfJqIlvSocG1umxRJawHaHa?w=700&c=7&r=0&o=5',
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
    image: 'https://th.bing.com/th/id/OIP.Smdv4ZPfOzuyeU8i1IxSGwHaEK?w=700&c=7&r=0&o=5',
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
    image: 'https://th.bing.com/th/id/OIP.d-SBS1yHh-X4j3RIYDzfOgHaFN?w=700&c=7&r=0&o=5',
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
    image: 'https://th.bing.com/th/id/OIP.jatZttBqmWTSWd2rm0HN1wHaHa?w=700&c=7&r=0&o=5',
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
    image: 'https://th.bing.com/th/id/OIP._3Js5gVhPw1gb7PEJiw2KAHaHa?w=700&c=7&r=0&o=5',
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
    image: 'https://th.bing.com/th/id/OIP.GTNIA4wwPJ1X2M5c21AjwAHaEK?w=700&c=7&r=0&o=5',
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
    // Upgrade existing built-in recipes with Ficha Técnica fields & exact dish images if still using old Unsplash URLs
    const updateBuiltIn = db.prepare(`
      UPDATE recipes
      SET image = ?,
          source = ?,
          portion_weight = ?,
          plating_instructions = ?,
          specific_instructions = ?
      WHERE id = ? AND (plating_instructions = '' OR image LIKE '%unsplash.com%')
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
