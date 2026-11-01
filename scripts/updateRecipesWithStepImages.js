import fs from 'node:fs';
import path from 'node:path';

const STEP_IMAGES_MAPPING = {
  'rec-1': [
    { stepNumber: 1, image: '/dishes/steps/crepioca/step-2.webp', alt: 'Massa líquida de ovo, goma de tapioca e sal batida até ficar homogênea.' },
    { stepNumber: 2, image: '/dishes/steps/crepioca/step-3.webp', alt: 'Frigideira antiaderente untada com a massa da crepioca espalhada no fundo.' },
    { stepNumber: 3, image: '/dishes/steps/crepioca/step-4.webp', alt: 'Queijo coalho, cubinhos de tomate e orégano distribuídos na metade da crepioca.' },
    { stepNumber: 4, image: '/dishes/steps/crepioca/step-5.webp', alt: 'Crepioca dobrada em meia-lua dourada com queijo fundido pronta para servir.' },
  ],
  'rec-2': [
    { stepNumber: 1, image: '/dishes/steps/overnight-oats/step-2.webp', alt: 'Aveia em flocos, leite e canela misturados no fundo do pote de vidro.' },
    { stepNumber: 2, image: '/dishes/steps/overnight-oats/step-5.webp', alt: 'Rodelas frescas de banana nanica dispostas sobre a camada de aveia.' },
    { stepNumber: 3, image: '/dishes/steps/overnight-oats/step-3.webp', alt: 'Pasta de amendoim colocada no centro e finalizada com canela polvilhada.' },
    { stepNumber: 4, image: '/dishes/steps/overnight-oats/step-6.webp', alt: 'Pote hermético de overnight oats cremoso após resfriar na geladeira.' },
  ],
  'rec-3': [
    { stepNumber: 1, image: '/dishes/steps/ovos-mexidos/step-2.webp', alt: 'Ovos caipiras quebrados na tigela batidos suavemente com garfo.' },
    { stepNumber: 2, image: '/dishes/steps/ovos-mexidos/step-4.webp', alt: 'Ovos cozinhando lentamente na manteiga derretida com espátula de silicone.' },
    { stepNumber: 3, image: '/dishes/steps/ovos-mexidos/step-6.webp', alt: 'Ovos mexidos cremosos aveludados servidos com pão tostado e mamão.' },
  ],
  'rec-4': [
    { stepNumber: 1, image: '/dishes/steps/cuscuz/step-2.webp', alt: 'Flocão de milho hidratando com água e sal em tigela de cerâmica.' },
    { stepNumber: 2, image: '/dishes/steps/cuscuz/step-5.webp', alt: 'Massa fofa transferida para o cesto da cuscuzeira para cozinhar no vapor.' },
    { stepNumber: 3, image: '/dishes/steps/cuscuz/step-6.webp', alt: 'Cuscuz nordestino macio desenformado e coberto com ovo estrelado e coentro.' },
  ],
  'rec-5': [
    { stepNumber: 1, image: '/dishes/steps/frango-grelhado/step-2.webp', alt: 'Filés de peito de frango marinando com alho, suco de limão e especiarias.' },
    { stepNumber: 2, image: '/dishes/steps/frango-grelhado/step-5.webp', alt: 'Filé de frango dourando em frigideira de fundo grosso com crosta suculenta.' },
    { stepNumber: 3, image: '/dishes/steps/frango-grelhado/step-7.webp', alt: 'PF montado com arroz branco soltinho, feijão carioca, frango fatiado e salada.' },
  ],
  'rec-6': [
    { stepNumber: 1, image: '/dishes/steps/carne-abobora/step-1.webp', alt: 'Cebola picada e alho refogando no azeite quente até dourarem.' },
    { stepNumber: 2, image: '/dishes/steps/carne-abobora/step-2.webp', alt: 'Carne moída refogada com páprica e temperos até secar e caramelizar.' },
    { stepNumber: 3, image: '/dishes/steps/carne-abobora/step-3.webp', alt: 'Cubos de abóbora cabotiá cozinhando no caldo da carne moída até amaciar.' },
    { stepNumber: 4, image: '/dishes/steps/carne-abobora/step-5.webp', alt: 'Picadinho de carne moída com abóbora brilhante salpicado com cheiro-verde.' },
  ],
  'rec-7': [
    { stepNumber: 1, image: '/dishes/steps/escondidinho/step-4.webp', alt: 'Mandioca cozida amassada com manteiga formando um purê liso e macio.' },
    { stepNumber: 2, image: '/dishes/steps/escondidinho/step-3.webp', alt: 'Frango desfiado refogado no molho de tomate aromático e cheiro-verde.' },
    { stepNumber: 3, image: '/dishes/steps/escondidinho/step-7.webp', alt: 'Montagem do escondidinho na travessa refratária com camadas de purê e frango.' },
    { stepNumber: 4, image: '/dishes/steps/escondidinho/step-10.webp', alt: 'Escondidinho coberto com queijo gratinado dourado borbulhante saindo do forno.' },
  ],
  'rec-8': [
    { stepNumber: 1, image: '/dishes/steps/strogonoff/step-1.webp', alt: 'Batatas palito com casca temperadas no azeite assando no forno crocantes.' },
    { stepNumber: 2, image: '/dishes/steps/strogonoff/step-5.webp', alt: 'Grão-de-bico, cogumelos fatiados e molho de tomate cozinhando na panela.' },
    { stepNumber: 3, image: '/dishes/steps/strogonoff/step-9.webp', alt: 'Strogonoff cremoso aveludado servido com arroz branco e batata assada.' },
  ],
  'rec-9': [
    { stepNumber: 1, image: '/dishes/steps/tilapia/step-2.webp', alt: 'Batatas cozidas amassadas e emulsionadas com leite morno até formar purê liso.' },
    { stepNumber: 2, image: '/dishes/steps/tilapia/step-6.webp', alt: 'Floretes frescos de brócolis cozinhando no vapor até atingirem ponto al dente.' },
    { stepNumber: 3, image: '/dishes/steps/tilapia/step-7.webp', alt: 'Filés de tilápia grelhando na frigideira com azeite até dourarem por igual.' },
  ],
  'rec-10': [
    { stepNumber: 1, image: '/dishes/steps/omelete/step-1.webp', alt: 'Abobrinha e cenoura raladas no ralo grosso espremidas para retirar a água.' },
    { stepNumber: 2, image: '/dishes/steps/omelete/step-3.webp', alt: 'Ovos batidos incorporados aos legumes ralados e queijo com orégano.' },
    { stepNumber: 3, image: '/dishes/steps/omelete/step-6.webp', alt: 'Omelete de forno alta e fofa dourada na superfície após assar a 180°C.' },
  ],
  'rec-11': [
    { stepNumber: 1, image: '/dishes/steps/caldo-verde/step-3.webp', alt: 'Mandioquinha cozida batida no liquidificador até obter creme denso e sedoso.' },
    { stepNumber: 2, image: '/dishes/steps/caldo-verde/step-4.webp', alt: 'Alho e cebola dourados no azeite com frango desfiado bem temperado.' },
    { stepNumber: 3, image: '/dishes/steps/caldo-verde/step-7.webp', alt: 'Creme de mandioquinha fervido com o frango e finalizado com a couve fatiada.' },
  ],
  'rec-12': [
    { stepNumber: 1, image: '/dishes/steps/macarrao-alho-oleo/step-2.webp', alt: 'Macarrão cozido em água fervente com floretes de brócolis escorridos al dente.' },
    { stepNumber: 2, image: '/dishes/steps/macarrao-alho-oleo/step-4.webp', alt: 'Iscas de frango dourando no azeite quente com lâminas perfumadas de alho.' },
    { stepNumber: 3, image: '/dishes/steps/macarrao-alho-oleo/step-6.webp', alt: 'Macarrão e brócolis salteados no alho e óleo emulsionados com água do cozimento.' },
  ],
  'rec-13': [
    { stepNumber: 1, image: '/dishes/steps/bowl-mexicano/step-6.webp', alt: 'Carne moída refogando em fogo alto com azeite, cominho, páprica e alho.' },
    { stepNumber: 2, image: '/dishes/steps/bowl-mexicano/step-4.webp', alt: 'Arroz branco e feijão preto aquecidos e temperados no capricho.' },
    { stepNumber: 3, image: '/dishes/steps/bowl-mexicano/step-10.webp', alt: 'Bowl mexicano montado em 4 quadrantes com fatias de abacate regadas com limão.' },
  ],
  'rec-14': [
    { stepNumber: 1, image: '/dishes/steps/frango-legumes/step-6.webp', alt: 'Cubos de filé de frango dourando na frigideira grande em azeite bem quente.' },
    { stepNumber: 2, image: '/dishes/steps/frango-legumes/step-7.webp', alt: 'Meias-luas de abobrinha e alho laminado salteando no centro da frigideira.' },
    { stepNumber: 3, image: '/dishes/steps/frango-legumes/step-10.webp', alt: 'Tomates-cereja estalados salteados com o frango e a abobrinha salpicados de orégano.' },
  ],
};

const filePath = path.resolve('server/recipesData.js');
let src = fs.readFileSync(filePath, 'utf-8');

// For each recipe, replace its stepDetails block
for (const [recId, stepList] of Object.entries(STEP_IMAGES_MAPPING)) {
  for (const s of stepList) {
    // Search for:
    // stepNumber: ${s.stepNumber},
    // section: '...',
    // text: '...',
    // And ensure image: '${s.image}',\n alt: '${s.alt}', is present
    const regex = new RegExp(
      `(id:\\s*['"]${recId}['"][\\s\\S]*?stepNumber:\\s*${s.stepNumber},[\\s\\S]*?text:\\s*(['"][^'"]+['"]),)([\\s\\S]*?)(tip:)`,
      'i'
    );

    src = src.replace(regex, (match, p1, p2, p3, p4) => {
      if (p3.includes('image:')) return match; // already has image
      const imageLine = `\n        image: '${s.image}',\n        alt: '${s.alt.replace(/'/g, "\\'")}',`;
      return `${p1}${imageLine}${p3}${p4}`;
    });
  }

  // Also add 'Passo a Passo com Fotos' to tags if not present
  const tagRegex = new RegExp(
    `(id:\\s*['"]${recId}['"][\\s\\S]*?tags:\\s*\\[)([^\\]]+)(\\])`,
    'i'
  );
  src = src.replace(tagRegex, (match, t1, t2, t3) => {
    if (t2.includes('Passo a Passo com Fotos')) return match;
    return `${t1}${t2}, 'Passo a Passo com Fotos'${t3}`;
  });
}

fs.writeFileSync(filePath, src, 'utf-8');
console.log('Successfully updated server/recipesData.js with step images and tags!');
