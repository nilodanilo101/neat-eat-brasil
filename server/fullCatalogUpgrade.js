import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { ROBUST_RECIPE_VAULT } from './suggestionEngine.js';
import { diversifyRecipeStepPhotos } from './stepPhotoMapper.js';

// Dicionário canônico de títulos curtos
const SHORT_TITLES = {
  'sug-1': 'Pão de Queijo de Frigideira',
  'sug-2': 'Panqueca de Banana e Aveia',
  'sug-3': 'Tapioca com Queijo e Ovo',
  'sug-4': 'Crepioca de Frango Cremosa',
  'sug-5': 'Cuscuz com Queijo Coalho',
  'sug-6': 'Sanduíche de Frango Cremoso',
  'sug-7': 'Mingau de Aveia com Frutas',
  'sug-8': 'Omelete de Claras com Queijo',
  'sug-9': 'Frango Xadrez',
  'sug-10': 'Carne de Panela com Mandioca',
  'sug-11': 'Picadinho com Arroz e Feijão',
  'sug-12': 'Tilápia com Legumes Salteados',
  'sug-13': 'Escondidinho de Frango e Batata',
  'sug-14': 'Bife Acebolado com Purê',
  'sug-15': 'Feijoada Light Caseira',
  'sug-16': 'Sopa de Abóbora com Frango',
  'sug-17': 'Omelete de Forno com Espinafre',
  'sug-18': 'Caldo Verde com Lombo',
  'sug-19': 'Salada Caesar com Frango',
  'sug-20': 'Hambúrguer de Patinho no Prato',
  'sug-21': 'Panqueca de Espinafre com Ricota',
  'sug-22': 'Moqueca de Palmito com Banana',
  'sug-23': 'Suflê de Legumes Gratinado',
  'sug-24': 'Canja de Frango Reconfortante',
  'sug-25': 'Strogonoff de Frango',
  'sug-26': 'Salmão com Brócolis e Purê',
  'sug-27': 'Bowl de Quinoa com Frango',

  // Diárias
  'sug-daily-2026-10-31-1': 'Panqueca de Espinafre com Frango',
  'sug-daily-2026-10-31-2': 'Strogonoff de Frango',
  'sug-daily-2026-11-01-1': 'Carne de Panela com Mandioca',
  'sug-daily-2026-11-01-2': 'Sanduíche de Frango Cremoso',
  'sug-daily-2026-11-02-1': 'Suflê de Legumes Gratinado',
  'sug-daily-2026-11-02-2': 'Omelete com Queijo Minas',

  // Recs iniciais
  'rec-1': 'Crepioca com Queijo Coalho',
  'rec-2': 'Overnight Oats de Banana',
  'rec-3': 'Ovos Mexidos com Pão Francês',
  'rec-4': 'Cuscuz com Ovo Estrelado',
  'rec-5': 'PF de Frango Grelhado',
  'rec-6': 'Picadinho com Abóbora',
  'rec-7': 'Escondidinho de Frango',
  'rec-8': 'Strogonoff de Grão-de-Bico',
  'rec-9': 'Tilápia com Purê e Brócolis',
  'rec-10': 'Omelete de Forno com Legumes',
  'rec-11': 'Caldo Verde com Frango',
  'rec-12': 'Macarrão com Frango e Brócolis',
  'rec-13': 'Bowl Mexicano com Carne',
  'rec-14': 'Frigideira de Frango e Legumes',
  'rec-15': 'Arroz de Forno com Carne Moída',
};

// Passo a passo rico e detalhado para cada receita do catálogo
const DETAILED_STEPS_CATALOG = {
  'sug-9': [
    'Faça o mise en place cortando 350g de peito de frango em cubos regulares de 2,5 cm. Pique os pimentões e a cebola em quadrados médios (pétalas) e pique o alho fino.',
    'Em uma tigela funda, tempere os cubos de frango com 2 colheres de shoyu, alho picado e pimenta-do-reino moída. Deixe marinar por 10 minutos para absorver o tempero.',
    'Aqueça uma wok ou frigideira grande com um fio de óleo em fogo alto até fumegar levemente. Despeje o frango em camada única e sele por 4 a 5 minutos até dourar por fora sem ressecar.',
    'Adicione a cebola em pétalas e os pimentões coloridos na panela quente. Salteie vigorosamente em fogo alto por 2 a 3 minutos mantendo os vegetais firmes e crocantes ao dente.',
    'Em um copo separado, dissolva o amido de milho em 60 ml de água fria com o restante do shoyu. Despeje na frigideira fervente e mexa por 1 minuto até o molho encorpar e formar uma película brilhante e aveludada.',
    'Desligue o fogo, misture o amendoim torrado crocante e a cebolinha picada, e sirva imediatamente bem quente acompanhado de arroz branco.'
  ],
  'sug-daily-2026-10-31-2': [
    'Corte o peito de frango em tiras médias de 3 cm. Pique a cebola em cubinhos finos e amasse o alho.',
    'Tempere as tiras de frango com sal, alho, pimenta-do-reino e algumas gotas de limão.',
    'Aqueça uma frigideira funda com o azeite em fogo alto e doure o frango em duas etapas para não juntar água.',
    'Junte a cebola picada ao frango dourado e refogue por 2 minutos até murchar e dourar.',
    'Adicione o molho de tomate, a mostarda e uma pitada de noz-moscada, cozinhando em fogo baixo por 5 minutos.',
    'Abaixe o fogo para o mínimo, adicione o creme de leite e mexa delicadamente até homogeneizar sem deixar ferver.',
    'Sirva imediatamente com arroz branco e batata palha bem crocante disposta ao lado.'
  ],
  'sug-daily-2026-11-01-2': [
    'Em uma tigela média, junte 180g de peito de frango cozido e desfiado finamente com 50g de requeijão cremoso light.',
    'Adicione a cenoura ralada bem fina e tempere com cheiro-verde picado, gotas de limão e pimenta-do-reino.',
    'Misture vigorosamente com uma colher até obter um patê cremoso e homogêneo com textura consistente.',
    'Disponha as fatias de pão integral na bancada e distribua folhas limpas e secas de alface sobre a base.',
    'Espalhe uma camada farta do recheio cremoso de frango, feche com a outra fatia de pão e pressione suavemente.',
    'Corte o sanduíche em diagonal com faca de serra e sirva imediatamente ou embale em papel-manteiga para levar.'
  ],
  'sug-daily-2026-10-31-1': [
    'Higienize as folhas de espinafre e bata no liquidificador com 2 ovos, 60g de farinha de aveia, 80ml de leite e sal até formar massa líquida verde homogênea.',
    'Em uma tigela, amasse 150g de ricota fresca com garfo e misture com 150g de peito de frango cozido desfiado, azeite, sal e orégano.',
    'Aqueça uma frigideira antiaderente levemente untada e prepare discos médios de panqueca assando por 1 minuto de cada lado.',
    'Distribua o recheio proteico de frango e ricota no centro de cada disco de panqueca verde e enrole firmemente.',
    'Acomode as panquecas em um refratário, regue com molho de tomate caseiro e polvilhe queijo parmesão por cima.',
    'Leve ao forno por 8 a 10 minutos para gratinar e sirva imediatamente bem quente.'
  ],
  'sug-daily-2026-11-02-1': [
    'Pique a cenoura e a abobrinha em cubinhos pequenos ou rale no ralo grosso. Pique a cebola e o alho bem finos.',
    'Em uma panela, refogue a cebola e o alho em um fio de azeite e adicione os legumes, salteando por 3 minutos até secar a água.',
    'Em uma tigela, bata 3 gemas com 100ml de leite desnatado, 2 colheres de farinha de aveia, sal, noz-moscada e 40g de queijo meia cura ralado.',
    'Em outra tigela limpa e seca, bata as 3 claras em neve com batedeira ou fouet até formarem picos firmes e brilhantes.',
    'Misture os legumes refogados à massa de gemas e incorpore delicadamente as claras em neve em três partes com espátula.',
    'Despeje em refratário untado, polvilhe queijo por cima e asse em forno a 190°C por 20 minutos até estufar alto, dourado e fofo.'
  ],
  'sug-daily-2026-11-02-2': [
    'Separe 3 ovos frescos, 50g de queijo minas frescal cortado em cubinhos, meio tomate picado sem sementes e orégano fresco.',
    'Quebre os 3 ovos em uma tigela funda, tempere com sal fino, pimenta-do-reino e bata com garfo ou fouet por 1 minuto até espumar.',
    'Aqueça uma frigideira antiaderente de 20 cm em fogo brando com umas gotas de azeite de oliva.',
    'Despeje os ovos batidos espalhando por todo o fundo e cozinhe em fogo baixo por 2 a 3 minutos até as bordas firmarem e o centro amornar.',
    'Distribua os cubos de queijo minas e os tomates picados sobre uma das metades da omelete e polvilhe o orégano fresco.',
    'Dobre a outra metade por cima formando uma meia-lua, abaixe o fogo para o mínimo por mais 1 minuto para o queijo aquecer e derreter suavemente, e sirva imediatamente.'
  ],
  'rec-3': [
    'Separe 3 ovos frescos, 15g de manteiga de qualidade, 1 pão francês fresco e 100g de mamão formosa fatiado.',
    'Quebre os 3 ovos em uma tigela funda, tempere com sal fino e bata suavemente com um garfo por 20 segundos apenas para romper as gemas sem aerar.',
    'Corte o pão francês ao meio e toste a face interna na frigideira quente com uma ponta de manteiga até ficar dourado e crocante.',
    'Em frigideira antiaderente em fogo bem baixo, derreta os 15g de manteiga e despeje os ovos batidos.',
    'Com uma espátula de silicone, faça movimentos circulares lentos das bordas para o centro, cozinhando em fogo brando até formar dobras aveludadas.',
    'Retire da frigideira quando os ovos ainda estiverem ligeiramente úmidos (o calor residual atinge o ponto exato) e sirva sobre o pão tostado com mamão fresco.'
  ],
  'rec-4': [
    'Meça 80g de flocão de milho, 60ml de água filtrada, uma pitada de sal marinho, 2 ovos frescos e cheiro-verde picado.',
    'Em uma tigela de cerâmica, regue o flocão de milho com a água e o sal, misturando com as pontas dos dedos até obter textura de areia de praia úmida.',
    'Cubra a tigela com um pano limpo e deixe o flocão descansar por 10 minutos para absorver todo o líquido e hidratar as fibras.',
    'Adicione água no compartimento inferior da cuscuzeira até a marca indicada e transfira a massa com colher, acomodando sem compactar.',
    'Tampe e leve ao fogo médio por 8 minutos até subir o aroma perfumado e a massa firmar fofa e macia.',
    'Frite os ovos em frigideira com fio de azeite deixando a gema mole e brilhante, desenforme o cuscuz no prato e monte os ovos por cima com cheiro-verde.'
  ],
  'rec-5': [
    'Limpe e corte 300g de peito de frango em filés médios uniformes. Pique 2 dentes de alho e esprema o suco de meio limão fresco.',
    'Tempere os filés com alho picado, suco de limão, sal refinado e pimenta-do-reino moída na hora, deixando tomar gosto por 5 minutos.',
    'Aqueça uma frigideira de fundo grosso com 10ml de azeite em fogo médio-alto até começar a estalar suavemente.',
    'Acomode os filés na frigideira sem sobrepor e grelhe por 3 a 4 minutos sem mexer para formar crosta dourada saborosa.',
    'Vire os filés e doure o outro lado por mais 3 minutos até atingir 74°C no centro, garantindo máxima suculência.',
    'Aqueça o arroz branco soltinho e o feijão carioca com caldo denso em panelas separadas.',
    'Monte o prato clássico: arroz branco em um terço, feijão ao lado, filé grelhado fatiado e salada fresca de alface e tomate temperada na hora.'
  ],
  'rec-8': [
    'Higienize e corte 200g de batata em palitos finos com casca. Seque com pano de prato, envolva com azeite e sal e asse a 220°C por 25 minutos até dourarem crocantes.',
    'Escorra e lave 250g de grão-de-bico cozido. Lamine 150g de cogumelos frescos e pique meia cebola em cubinhos finos.',
    'Aqueça uma panela funda com azeite em fogo médio e refogue a cebola picada até ficar translúcida e aromática.',
    'Junte os cogumelos laminados e salteie por 3 minutos até dourarem suavemente e liberarem seus aromas terrosos.',
    'Adicione o grão-de-bico cozido, 100g de molho de tomate caseiro e 1 colher de mostarda, cozinhando em fogo brando por 6 minutos para apurar.',
    'Desligue o fogo, misture 150g de creme de leite homogeneizando o molho aveludado e acerte o sal.',
    'Sirva quente com arroz branco e as batatas palha assadas crocantes por cima.'
  ],
  'rec-9': [
    'Descasque 250g de batata e cozinhe em água fervente com sal por 15 minutos até ficar bem macia ao toque do garfo.',
    'Escorra a batata, passe pelo espremedor ainda quente e incorpore 50ml de leite morno e um fio de azeite até obter purê sedoso e liso.',
    'Cozinhe 150g de floretes de brócolis no vapor sobre água fervente por 4 minutos até ficarem verde-vivos e crocantes ao dente.',
    'Tempere 300g de filés de tilápia fresca com suco de limão, sal, pimenta-branca e uma pitada de raspas de limão siciliano.',
    'Aqueça uma frigideira antiaderente com um fio de azeite em fogo alto e grelhe os filés por 3 minutos de um lado até dourar.',
    'Vire com espátula delicadamente e doure o outro lado por mais 2 minutos sem deixar ressecar as fibras macias do peixe.',
    'Monte o prato com o purê aveludado na base, o filé de tilápia dourado e os floretes de brócolis regados com azeite.'
  ],
  'rec-10': [
    'Lave e rale meia abobrinha média e meia cenoura no ralo grosso. Corte 60g de queijo minas em cubinhos.',
    'Refogue os legumes ralados rapidamente em frigideira com gotas de azeite por 2 minutos para secar o excesso de líquido.',
    'Em uma tigela média, quebre 4 ovos, junte sal refinado, orégano e 1 colher de café de fermento químico em pó.',
    'Bata com fouet por 1 minuto até a mistura ficar bem espumosa e dobrar levemente de volume.',
    'Misture os legumes e o queijo minas aos ovos batidos e transfira para um refratário pequeno untado.',
    'Asse a 190°C por 18 a 20 minutos até estufar dourado, firme e perfumado.'
  ],
  'rec-11': [
    'Descasque 300g de mandioquinha, corte em rodelas médias e pique o alho fino. Fatie 100g de couve em tiras finíssimas.',
    'Cozinhe a mandioquinha em 600ml de água fervente com sal por 15 minutos até ficar bem macia.',
    'Transfira a mandioquinha com o líquido para o liquidificador e bata por 1 minuto até virar creme amarelo liso e sedoso.',
    'Em panela funda, doure o alho no azeite e junte 200g de peito de frango cozido e desfiado, refogando por 2 minutos.',
    'Despeje o creme de mandioquinha sobre o frango e deixe levantar fervura suave por 3 minutos.',
    'Adicione a couve fatiada finíssima, cozinhe por apenas 2 minutos para amaciar mantendo a cor verde-viva e sirva fumegante.'
  ],
  'rec-12': [
    'Ferva 2 litros de água com 1 colher de sal grosso em panela grande.',
    'Corte 260g de peito de frango em iscas finas e tempere com sal, alho picado e pimenta.',
    'Cozinhe 160g de macarrão e adicione os brócolis nos últimos 3 minutos na mesma água.',
    'Grelhe as iscas de frango em frigideira quente com azeite por 4 minutos até dourarem.',
    'Junte alho laminado ao frango e refogue por 1 minuto até perfumar sem queimar.',
    'Escorra a massa e os brócolis com um pouco da água e salteie tudo junto na frigideira do frango até emulsionar.'
  ],
  'rec-13': [
    'Pese 260g de patinho moído e separe os temperos: cominho em pó, páprica defumada, sal e alho picado.',
    'Aqueça uma frigideira com azeite em fogo alto e refogue a carne moída até secar e dourar intensamente.',
    'Aqueça 150g de arroz branco cozido soltinho e 150g de feijão preto temperado com louro e alho.',
    'Corte 1 tomate maduro em cubinhos e fatie meio abacate maduro em lâminas finas, regando com gotas de limão fresco para não escurecer.',
    'Em dois bowls fundos, disponha o arroz em um quadrante e o feijão preto com caldo no quadrante oposto.',
    'Acomode a carne moída refogada e finalize com os cubinhos de tomate e as fatias de abacate temperadas com flor de sal.'
  ],
  'rec-14': [
    'Corte 300g de peito de frango em cubos regulares de 2 cm e tempere com alho picado, sal fino e pimenta-do-reino.',
    'Lave 1 abobrinha média e corte em meias-luas de 0,5 cm. Higienize 100g de tomates-cereja mantendo inteiros.',
    'Aqueça uma frigideira ampla com 15ml de azeite em fogo alto e acomode os cubos de frango em camada única.',
    'Grelhe por 4 a 5 minutos sem mexer no início até formar crosta dourada e selar a umidade interna.',
    'Afaste o frango para as bordas da frigideira, coloque as meias-luas de abobrinha no centro e salteie por 3 minutos em fogo médio.',
    'Junte os tomates-cereja inteiros e o orégano fresco, salteando tudo junto por mais 2 minutos até os tomates estalarem a pele.',
    'Finalize com folhas de manjericão fresco e sirva imediatamente direto da frigideira fumegante.'
  ],
};

export function runFullCatalogUpgrade(dbPath) {
  if (!fs.existsSync(dbPath)) {
    console.log(`Arquivo não encontrado: ${dbPath}`);
    return;
  }

  console.log(`\n========================================`);
  console.log(`Executando Upgrade Completo em: ${dbPath}`);
  console.log(`========================================`);

  const db = new DatabaseSync(dbPath);

  // 1. Atualizar todas as receitas em `recipes`
  const recipes = db.prepare('SELECT * FROM recipes').all();
  console.log(`Encontradas ${recipes.length} receitas para processamento...`);

  for (const r of recipes) {
    let title = SHORT_TITLES[r.id] || r.title;
    let image = r.image;
    let steps = JSON.parse(r.steps_json || '[]');
    let stepDetails = JSON.parse(r.step_details_json || '[]');
    let tags = JSON.parse(r.tags_json || '[]');

    // Atualiza steps ricos se cadastrado no DETAILED_STEPS_CATALOG
    if (DETAILED_STEPS_CATALOG[r.id]) {
      steps = DETAILED_STEPS_CATALOG[r.id];
    } else {
      const vaultMatch = ROBUST_RECIPE_VAULT.find((v) => v.id === r.id);
      if (vaultMatch && vaultMatch.steps && vaultMatch.steps.length >= 5) {
        steps = vaultMatch.steps;
        if (vaultMatch.image) image = vaultMatch.image;
      }
    }

    // Casos específicos de imagem / título
    if (r.id === 'sug-daily-2026-10-31-2' || title.includes('Strogonoff de Frango')) {
      title = 'Strogonoff de Frango';
      image = '/dishes/sug-9.jpg';
      if (!tags.includes('Tirzepatida')) tags.push('Tirzepatida');
    } else if (r.id === 'sug-daily-2026-11-01-2' || title.includes('Sanduíche')) {
      title = 'Sanduíche de Frango Cremoso';
      image = '/dishes/sug-6.jpg';
      if (!tags.includes('Tirzepatida')) tags.push('Tirzepatida');
    } else if (r.id === 'sug-9' || title.includes('Xadrez')) {
      title = 'Frango Xadrez';
      image = '/dishes/frango-xadrez.jpg';
      steps = DETAILED_STEPS_CATALOG['sug-9'];
      if (!tags.includes('Tirzepatida')) tags.push('Tirzepatida');
    } else if (r.id === 'sug-daily-2026-11-01-1' || title.includes('Carne de Panela')) {
      title = 'Carne de Panela com Mandioca';
      image = '/dishes/sug-10.jpg';
      if (!tags.includes('Tirzepatida')) tags.push('Tirzepatida');
    } else if (r.id === 'rec-8') {
      title = 'Strogonoff de Grão-de-Bico';
      image = '/dishes/rec-8.jpg';
    }

    // Regra Tirzepatida: alta proteína com teor de gordura controlado
    if (r.protein >= 24 && r.fat <= 16 && !tags.includes('Tirzepatida')) {
      tags.push('Tirzepatida');
    }

    // Enriquecer stepDetails garantindo fotografias variadas para cada etapa
    stepDetails = diversifyRecipeStepPhotos(steps, stepDetails, image || '/dishes/rec-5.jpg');

    db.prepare(`
      UPDATE recipes
      SET title = ?, image = ?, steps_json = ?, step_details_json = ?, tags_json = ?
      WHERE id = ?
    `).run(
      title,
      image,
      JSON.stringify(steps),
      JSON.stringify(stepDetails),
      JSON.stringify(tags),
      r.id
    );
  }

  // 2. Atualizar daily_discovered_recipes
  const dailyRows = db.prepare('SELECT id, recipe_json FROM daily_discovered_recipes').all();
  for (const row of dailyRows) {
    try {
      const p = JSON.parse(row.recipe_json);
      if (SHORT_TITLES[p.id]) p.title = SHORT_TITLES[p.id];
      if (p.id === 'sug-daily-2026-10-31-2' || p.title.includes('Strogonoff')) {
        p.title = 'Strogonoff de Frango';
        p.image = '/dishes/sug-9.jpg';
        p.steps = DETAILED_STEPS_CATALOG['sug-daily-2026-10-31-2'];
      } else if (p.id === 'sug-daily-2026-11-01-2' || p.title.includes('Sanduíche')) {
        p.title = 'Sanduíche de Frango Cremoso';
        p.image = '/dishes/sug-6.jpg';
        p.steps = DETAILED_STEPS_CATALOG['sug-daily-2026-11-01-2'];
      } else if (p.id === 'sug-daily-2026-11-01-1' || p.title.includes('Carne de Panela')) {
        p.title = 'Carne de Panela com Mandioca';
        p.image = '/dishes/sug-10.jpg';
      } else if (p.id === 'sug-9' || p.title.includes('Xadrez')) {
        p.title = 'Frango Xadrez';
        p.image = '/dishes/frango-xadrez.jpg';
        p.steps = DETAILED_STEPS_CATALOG['sug-9'];
      }

      if (DETAILED_STEPS_CATALOG[p.id]) {
        p.steps = DETAILED_STEPS_CATALOG[p.id];
      } else if (p.steps && p.steps.length < 4) {
        const v = ROBUST_RECIPE_VAULT.find((vault) => vault.id === p.id);
        if (v && v.steps) p.steps = v.steps;
      }

      p.stepDetails = diversifyRecipeStepPhotos(p.steps, p.stepDetails, p.image || '/dishes/rec-5.jpg');

      db.prepare('UPDATE daily_discovered_recipes SET recipe_json = ? WHERE id = ?').run(
        JSON.stringify(p),
        row.id
      );
    } catch {}
  }

  // 3. Limpar / Atualizar suggestion_swipes
  const swipeRows = db.prepare('SELECT id, suggestion_id, recipe_json FROM suggestion_swipes').all();
  for (const s of swipeRows) {
    try {
      const p = JSON.parse(s.recipe_json);
      if (SHORT_TITLES[p.id]) p.title = SHORT_TITLES[p.id];
      if (DETAILED_STEPS_CATALOG[p.id]) p.steps = DETAILED_STEPS_CATALOG[p.id];
      if (p.id === 'sug-9' || p.title.includes('Xadrez')) {
        p.title = 'Frango Xadrez';
        p.image = '/dishes/frango-xadrez.jpg';
        p.steps = DETAILED_STEPS_CATALOG['sug-9'];
      }
      p.stepDetails = diversifyRecipeStepPhotos(p.steps, p.stepDetails, p.image || '/dishes/rec-5.jpg');
      db.prepare('UPDATE suggestion_swipes SET recipe_json = ? WHERE id = ?').run(
        JSON.stringify(p),
        s.id
      );
    } catch {}
  }

  db.close();
  console.log(`Upgrade finalizado com sucesso em: ${dbPath}`);
}

const targets = [
  path.resolve('./server/neateat.sqlite'),
  '/Users/nilodanilo101/Library/Application Support/neat-eat-br/neateat.sqlite',
];

for (const t of targets) {
  runFullCatalogUpgrade(t);
}
