/**
 * stepPhotoMapper.js
 * Mapeador de fotografias operacionais gastronômicas por etapa do preparo.
 * Garante que NENHUMA receita apresente fotos repetidas ao longo dos passos,
 * associando cada momento culinário (mise en place, corte, fogo/selagem,
 * salteado, molho, forno e empratamento) a fotografias operacionais técnicas distintas.
 */

export const FOLDER_STEP_COUNTS = {
  'arroz-forno': 12,
  'bife-acebolado': 10,
  'bowl-mexicano': 10,
  'bowl-quinoa': 7,
  'caldo-verde': 9,
  'canja-frango': 9,
  'carne-abobora': 5,
  'carne-panela': 7,
  'crepioca': 5,
  'cuscuz': 6,
  'escondidinho': 10,
  'feijoada': 7,
  'frango-grelhado': 7,
  'frango-legumes': 10,
  'frango-xadrez': 10,
  'hamburguer-fit': 10,
  'macarrao-alho-oleo': 6,
  'mingau-aveia': 6,
  'moqueca-banana': 8,
  'omelete': 6,
  'overnight-oats': 6,
  'ovos-mexidos': 6,
  'panqueca-banana': 7,
  'panqueca-espinafre': 12,
  'pao-queijo': 5,
  'picadinho-carne': 10,
  'salada-caesar': 7,
  'salmao-grelhado': 7,
  'sanduiche-frango': 5,
  'sopa-abobora': 14,
  'strogonoff': 9,
  'sufle-legumes': 9,
  'tapioca': 6,
  'tilapia': 9,
};

export const RECIPE_STEP_FOLDERS = {
  'rec-1': 'crepioca',
  'rec-2': 'overnight-oats',
  'rec-3': 'ovos-mexidos',
  'rec-4': 'cuscuz',
  'rec-5': 'frango-grelhado',
  'rec-6': 'picadinho-carne',
  'rec-7': 'escondidinho',
  'rec-8': 'strogonoff',
  'rec-9': 'tilapia',
  'rec-10': 'omelete',
  'rec-11': 'caldo-verde',
  'rec-12': 'macarrao-alho-oleo',
  'rec-13': 'bowl-mexicano',
  'rec-14': 'frango-legumes',
  'rec-15': 'arroz-forno',
  'rec-custom-1793631230767': 'carne-panela',

  'sug-1': 'pao-queijo',
  'sug-2': 'panqueca-banana',
  'sug-3': 'tapioca',
  'sug-4': 'crepioca',
  'sug-5': 'cuscuz',
  'sug-6': 'sanduiche-frango',
  'sug-7': 'mingau-aveia',
  'sug-8': 'omelete',
  'sug-9': 'frango-xadrez',
  'sug-10': 'carne-panela',
  'sug-11': 'picadinho-carne',
  'sug-12': 'tilapia',
  'sug-13': 'escondidinho',
  'sug-14': 'bife-acebolado',
  'sug-15': 'feijoada',
  'sug-16': 'sopa-abobora',
  'sug-17': 'omelete',
  'sug-18': 'caldo-verde',
  'sug-19': 'salada-caesar',
  'sug-20': 'hamburguer-fit',
  'sug-21': 'panqueca-espinafre',
  'sug-22': 'moqueca-banana',
  'sug-23': 'sufle-legumes',
  'sug-24': 'canja-frango',
  'sug-25': 'strogonoff',
  'sug-26': 'salmao-grelhado',
  'sug-27': 'bowl-quinoa',

  // Daily suggestions
  'sug-daily-2026-10-31-1': 'panqueca-espinafre',
  'sug-daily-2026-10-31-2': 'strogonoff',
  'sug-daily-2026-11-01-1': 'carne-panela',
  'sug-daily-2026-11-01-2': 'sanduiche-frango',
  'sug-daily-2026-11-02-1': 'sufle-legumes',
  'sug-daily-2026-11-02-2': 'omelete',
};

export function getDedicatedStepFolder(id = '', title = '') {
  if (id && RECIPE_STEP_FOLDERS[id]) {
    return RECIPE_STEP_FOLDERS[id];
  }
  const t = (title || '').toLowerCase();
  if (t.includes('canja')) return 'canja-frango';
  if (t.includes('xadrez')) return 'frango-xadrez';
  if (t.includes('caesar') || t.includes('salada caesar')) return 'salada-caesar';
  if (t.includes('carne de panela') || t.includes('carne louca') || t.includes('acém') || t.includes('acem')) return 'carne-panela';
  if (t.includes('bife acebolado') || t.includes('bife')) return 'bife-acebolado';
  if (t.includes('feijoada')) return 'feijoada';
  if (t.includes('hambúrguer') || t.includes('hamburguer') || t.includes('patinho no prato')) return 'hamburguer-fit';
  if (t.includes('suflê') || t.includes('sufle')) return 'sufle-legumes';
  if (t.includes('moqueca')) return 'moqueca-banana';
  if (t.includes('espinafre')) return 'panqueca-espinafre';
  if (t.includes('panqueca de banana') || t.includes('panqueca')) return 'panqueca-banana';
  if (t.includes('sanduíche') || t.includes('sanduiche') || t.includes('sanduiche natural')) return 'sanduiche-frango';
  if (t.includes('salmão') || t.includes('salmao')) return 'salmao-grelhado';
  if (t.includes('quinoa')) return 'bowl-quinoa';
  if (t.includes('pão de queijo') || t.includes('pao de queijo')) return 'pao-queijo';
  if (t.includes('mingau')) return 'mingau-aveia';
  if (t.includes('tapioca')) return 'tapioca';
  if (t.includes('picadinho') || t.includes('carne com abóbora')) return 'picadinho-carne';
  if (t.includes('sopa de abóbora') || t.includes('sopa de abobora') || t.includes('creme de abóbora')) return 'sopa-abobora';
  if (t.includes('escondidinho')) return 'escondidinho';
  if (t.includes('arroz de forno') || t.includes('arroz ao forno')) return 'arroz-forno';
  if (t.includes('ovos mexidos') || t.includes('mexido')) return 'ovos-mexidos';
  if (t.includes('omelete')) return 'omelete';
  if (t.includes('crepioca')) return 'crepioca';
  if (t.includes('cuscuz')) return 'cuscuz';
  if (t.includes('strogonoff')) return 'strogonoff';
  if (t.includes('tilápia') || t.includes('tilapia') || t.includes('peixe')) return 'tilapia';
  if (t.includes('overnight') || t.includes('iogurte com aveia')) return 'overnight-oats';
  if (t.includes('macarrão') || t.includes('macarrao') || t.includes('massa')) return 'macarrao-alho-oleo';
  if (t.includes('caldo verde')) return 'caldo-verde';
  if (t.includes('bowl mexicano') || t.includes('mexicano')) return 'bowl-mexicano';
  if (t.includes('frango grelhado') || t.includes('filé de frango')) return 'frango-grelhado';
  if (t.includes('frango e legumes') || t.includes('frango')) return 'frango-legumes';
  return null;
}

export const PHOTO_LIBRARY = {
  miseEnPlace: [
    '/dishes/steps/bowl-mexicano/step-1.webp',
    '/dishes/steps/crepioca/step-1.webp',
    '/dishes/steps/frango-legumes/step-1.webp',
    '/dishes/steps/escondidinho/step-1.webp',
    '/dishes/steps/carne-abobora/step-1.webp',
    '/dishes/steps/tilapia/step-1.webp',
    '/dishes/steps/ovos-mexidos/step-1.webp',
    '/dishes/steps/overnight-oats/step-1.webp',
  ],
  cutsAndPrep: [
    '/dishes/steps/frango-legumes/step-2.webp',
    '/dishes/steps/bowl-mexicano/step-4.webp',
    '/dishes/steps/frango-grelhado/step-5.webp',
    '/dishes/steps/tilapia/step-2.webp',
    '/dishes/steps/carne-abobora/step-2.webp',
    '/dishes/steps/strogonoff/step-1.webp',
    '/dishes/steps/ovos-mexidos/step-2.webp',
    '/dishes/steps/omelete/step-2.webp',
  ],
  searingAndHeat: [
    '/dishes/steps/frango-grelhado/step-4.webp',
    '/dishes/steps/strogonoff/step-2.webp',
    '/dishes/steps/tilapia/step-5.webp',
    '/dishes/steps/carne-abobora/step-2.webp',
    '/dishes/steps/crepioca/step-3.webp',
    '/dishes/steps/macarrao-alho-oleo/step-4.webp',
    '/dishes/steps/ovos-mexidos/step-4.webp',
  ],
  sauteAndVeggies: [
    '/dishes/steps/frango-legumes/step-5.webp',
    '/dishes/steps/strogonoff/step-3.webp',
    '/dishes/steps/tilapia/step-4.webp',
    '/dishes/steps/carne-abobora/step-3.webp',
    '/dishes/steps/macarrao-alho-oleo/step-5.webp',
    '/dishes/steps/bowl-mexicano/step-6.webp',
  ],
  sauceAndSimmer: [
    '/dishes/steps/strogonoff/step-5.webp',
    '/dishes/steps/frango-legumes/step-6.webp',
    '/dishes/steps/carne-abobora/step-4.webp',
    '/dishes/steps/strogonoff/step-6.webp',
  ],
  bakingAndFinishing: [
    '/dishes/steps/arroz-forno/step-10.webp',
    '/dishes/steps/escondidinho/step-10.webp',
    '/dishes/steps/arroz-forno/step-12.webp',
    '/dishes/steps/crepioca/step-5.webp',
    '/dishes/steps/cuscuz/step-6.webp',
    '/dishes/steps/frango-legumes/step-7.webp',
    '/dishes/steps/bowl-mexicano/step-10.webp',
  ],
};

export function resolveStepPhoto(
  stepText = '',
  stepIndex = 0,
  totalSteps = 6,
  heroImage = '',
  usedPhotos = new Set()
) {
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === totalSteps - 1;

  // O último passo recebe a foto oficial do prato pronto empratado
  if (isLastStep && heroImage) {
    return heroImage;
  }

  const text = String(stepText || '').toLowerCase();
  let pool = PHOTO_LIBRARY.sauteAndVeggies;

  if (
    isFirstStep ||
    text.includes('pese') ||
    text.includes('separe') ||
    text.includes('mise en place') ||
    text.includes('organize')
  ) {
    pool = PHOTO_LIBRARY.miseEnPlace;
  } else if (
    text.includes('grelh') ||
    text.includes('sel') ||
    text.includes('dour') ||
    text.includes('chapa') ||
    text.includes('fogo alto') ||
    text.includes('wok') ||
    text.includes('frigideira')
  ) {
    pool = PHOTO_LIBRARY.searingAndHeat;
  } else if (
    text.includes('cort') ||
    text.includes('pique') ||
    text.includes('fatie') ||
    text.includes('marin') ||
    text.includes('tempere') ||
    text.includes('desfie') ||
    text.includes('amasse') ||
    text.includes('esprema') ||
    text.includes('higieniz')
  ) {
    pool = PHOTO_LIBRARY.cutsAndPrep;
  } else if (
    text.includes('molho') ||
    text.includes('caldo') ||
    text.includes('cozinh') ||
    text.includes('ferv') ||
    text.includes('creme') ||
    text.includes('apur') ||
    text.includes('shoyu') ||
    text.includes('amido')
  ) {
    pool = PHOTO_LIBRARY.sauceAndSimmer;
  } else if (
    text.includes('refog') ||
    text.includes('saltei') ||
    text.includes('cebola') ||
    text.includes('alho') ||
    text.includes('legume') ||
    text.includes('piment')
  ) {
    pool = PHOTO_LIBRARY.sauteAndVeggies;
  } else if (
    text.includes('forno') ||
    text.includes('gratin') ||
    text.includes('refrat') ||
    text.includes('mont') ||
    text.includes('enrol') ||
    text.includes('dobre') ||
    text.includes('bowl')
  ) {
    pool = PHOTO_LIBRARY.bakingAndFinishing;
  }

  // 1º critério: Busca no pool específico uma foto não usada
  for (let offset = 0; offset < pool.length; offset++) {
    const candidate = pool[(stepIndex + offset) % pool.length];
    if (!usedPhotos.has(candidate) && candidate !== heroImage) {
      return candidate;
    }
  }

  // 2º critério: Se o pool esgotou, busca em todos os pools uma foto não usada
  const allPools = Object.values(PHOTO_LIBRARY).flat();
  for (let offset = 0; offset < allPools.length; offset++) {
    const candidate = allPools[(stepIndex * 3 + offset) % allPools.length];
    if (!usedPhotos.has(candidate) && candidate !== heroImage) {
      return candidate;
    }
  }

  // 3º critério: Fallback seguro
  return pool[stepIndex % pool.length];
}

/**
 * Normaliza um conjunto de etapas de receita, garantindo fotos 100% autênticas, dedicadas e fiéis
 */
export function diversifyRecipeStepPhotos(
  steps = [],
  existingStepDetails = [],
  heroImage = '',
  recipeId = '',
  recipeTitle = ''
) {
  if (!Array.isArray(steps) || steps.length === 0) return [];

  const canonicalHero = resolveAccurateDishImage(recipeId, recipeTitle, heroImage);
  const dedicatedFolder = getDedicatedStepFolder(recipeId, recipeTitle);

  // Se a receita possui pasta técnica dedicada com fotografias do próprio prato
  if (dedicatedFolder && FOLDER_STEP_COUNTS[dedicatedFolder]) {
    const totalFolderSteps = FOLDER_STEP_COUNTS[dedicatedFolder];

    return steps.map((stepText, idx) => {
      const existing = existingStepDetails ? existingStepDetails[idx] : null;
      const isLastStep = idx === steps.length - 1;

      let photo;
      if (isLastStep && canonicalHero) {
        // A etapa final sempre recebe a fotografia canônica do prato pronto
        photo = canonicalHero;
      } else {
        // Etapas operacionais sequenciais dedicadas: step-1, step-2, ...
        const stepNum = (idx % (totalFolderSteps - 1)) + 1;
        photo = `/dishes/steps/${dedicatedFolder}/step-${stepNum}.webp`;
      }

      return {
        ...(existing || {}),
        stepNumber: idx + 1,
        section:
          existing?.section ||
          (idx === 0
            ? 'Mise en Place & Pré-preparo'
            : isLastStep
            ? 'Finalização & Empratamento'
            : 'Cocção & Ponto Ideal'),
        text: stepText,
        image: photo,
        alt: existing?.alt || `Passo ${idx + 1}: ${stepText.slice(0, 50)}...`,
        tip:
          existing?.tip ||
          (idx === 0
            ? 'Pese todos os insumos e organize os utensílios na bancada.'
            : isLastStep
            ? 'Verifique o ponto de sal e a temperatura antes do serviço.'
            : 'Mantenha controle atento de temperatura para cocção homogênea.'),
        isKeyFrame: true,
        timerSeconds: existing?.timerSeconds || 120,
      };
    });
  }

  // Detecta se todas as fotos existentes são idênticas (bug anterior) ou contaminadas por calabresa cruzada
  const existingImages = (existingStepDetails || []).map((s) => s?.image).filter(Boolean);
  const areAllIdentical =
    existingImages.length >= 2 &&
    existingImages.every((img) => img === existingImages[0]);

  const usedPhotos = new Set();
  if (steps.length > 1 && canonicalHero) {
    usedPhotos.add(canonicalHero);
  }

  return steps.map((stepText, idx) => {
    const existing = existingStepDetails ? existingStepDetails[idx] : null;
    const isLastStep = idx === steps.length - 1;

    let finalPhoto = null;
    if (isLastStep && canonicalHero) {
      finalPhoto = canonicalHero;
    } else if (
      existing?.image &&
      !areAllIdentical &&
      !existing.image.includes('caldo-verde/step-5') &&
      !usedPhotos.has(existing.image) &&
      existing.image !== canonicalHero
    ) {
      finalPhoto = existing.image;
    } else {
      finalPhoto = resolveStepPhoto(stepText, idx, steps.length, canonicalHero, usedPhotos);
    }

    usedPhotos.add(finalPhoto);

    return {
      ...(existing || {}),
      stepNumber: idx + 1,
      section:
        existing?.section ||
        (idx === 0
          ? 'Mise en Place & Pré-preparo'
          : isLastStep
          ? 'Finalização & Empratamento'
          : 'Cocção & Ponto Ideal'),
      text: stepText,
      image: finalPhoto,
      alt: existing?.alt || `Passo ${idx + 1}: ${stepText.slice(0, 50)}...`,
      tip:
        existing?.tip ||
        (idx === 0
          ? 'Pese todos os insumos e organize os utensílios na bancada.'
          : isLastStep
          ? 'Verifique o ponto de sal e a temperatura antes do serviço.'
          : 'Mantenha controle atento de temperatura para cocção homogênea.'),
      isKeyFrame: true,
      timerSeconds: existing?.timerSeconds || 120,
    };
  });
}

export const CANONICAL_DISH_IMAGES = {
  // Vault de sugestões
  'sug-1': '/dishes/sug-1.jpg',
  'sug-2': '/dishes/sug-2.jpg',
  'sug-3': '/dishes/sug-3.jpg',
  'sug-4': '/dishes/crepioca-frango.jpg',
  'sug-5': '/dishes/cuscuz-queijo.jpg',
  'sug-6': '/dishes/sanduiche-frango.jpg',
  'sug-7': '/dishes/sug-20.jpg',
  'sug-8': '/dishes/omelete-com-queijo.jpg',
  'sug-9': '/dishes/frango-xadrez.jpg',
  'sug-10': '/dishes/carne-panela-mandioca.jpg',
  'sug-11': '/dishes/picadinho-carne.jpg',
  'sug-12': '/dishes/rec-9.jpg',
  'sug-13': '/dishes/rec-7.jpg',
  'sug-14': '/dishes/bife-acebolado.jpg',
  'sug-15': '/dishes/feijoada-light.png',
  'sug-16': '/dishes/sug-18.jpg',
  'sug-17': '/dishes/rec-10.jpg',
  'sug-18': '/dishes/sug-14.jpg',
  'sug-19': '/dishes/salada-caesar.jpg',
  'sug-20': '/dishes/hamburguer-fit.jpg',
  'sug-21': '/dishes/panqueca-espinafre.jpg',
  'sug-22': '/dishes/moqueca-banana.jpg',
  'sug-23': '/dishes/sufle-legumes.jpg',
  'sug-24': '/dishes/canja-frango.jpg',
  'sug-25': '/dishes/sug-9.jpg',
  'sug-26': '/dishes/salmao-grelhado.png',
  'sug-27': '/dishes/bowl-quinoa.jpg',

  // Sugestões diárias
  'sug-daily-2026-10-31-1': '/dishes/panqueca-espinafre.jpg',
  'sug-daily-2026-10-31-2': '/dishes/sug-9.jpg',
  'sug-daily-2026-11-01-1': '/dishes/carne-panela-mandioca.jpg',
  'sug-daily-2026-11-01-2': '/dishes/sanduiche-frango.jpg',
  'sug-daily-2026-11-02-1': '/dishes/sufle-legumes.jpg',
  'sug-daily-2026-11-02-2': '/dishes/omelete-com-queijo.jpg',

  // Catálogo base de receitas
  'rec-1': '/dishes/rec-1.jpg',
  'rec-2': '/dishes/rec-2.jpg',
  'rec-3': '/dishes/rec-3.jpg',
  'rec-4': '/dishes/rec-4.jpg',
  'rec-5': '/dishes/rec-5.jpg',
  'rec-6': '/dishes/rec-6.jpg',
  'rec-7': '/dishes/rec-7.jpg',
  'rec-8': '/dishes/rec-8.jpg',
  'rec-9': '/dishes/rec-9.jpg',
  'rec-10': '/dishes/rec-10.jpg',
  'rec-11': '/dishes/rec-11.jpg',
  'rec-12': '/dishes/rec-12.jpg',
  'rec-13': '/dishes/rec-13.jpg',
  'rec-14': '/dishes/rec-14.jpg',
  'rec-15': '/dishes/arroz-de-forno-carne-moida.webp',
};

export function resolveAccurateDishImage(id = '', title = '', fallbackImage = '') {
  if (id && CANONICAL_DISH_IMAGES[id]) return CANONICAL_DISH_IMAGES[id];
  const t = (title || '').toLowerCase();
  if (t.includes('caesar') || t.includes('salada caesar')) return '/dishes/salada-caesar.jpg';
  if (t.includes('omelete de forno')) return '/dishes/rec-10.jpg';
  if (t.includes('omelete')) return '/dishes/omelete-com-queijo.jpg';
  if (t.includes('sandu') || t.includes('sanduíche')) return '/dishes/sanduiche-frango.jpg';
  if (t.includes('carne de panela')) return '/dishes/carne-panela-mandioca.jpg';
  if (t.includes('picadinho com arroz') || t.includes('picadinho tradicional')) return '/dishes/picadinho-carne.jpg';
  if (t.includes('bife acebolado')) return '/dishes/bife-acebolado.jpg';
  if (t.includes('feijoada')) return '/dishes/feijoada-light.png';
  if (t.includes('sopa de abóbora') || t.includes('creme de abóbora')) return '/dishes/sug-18.jpg';
  if (t.includes('caldo verde')) return '/dishes/sug-14.jpg';
  if (t.includes('hambúrguer') || t.includes('hamburguer')) return '/dishes/hamburguer-fit.jpg';
  if (t.includes('panqueca de espinafre')) return '/dishes/panqueca-espinafre.jpg';
  if (t.includes('moqueca de palmito') || t.includes('moqueca de banana')) return '/dishes/moqueca-banana.jpg';
  if (t.includes('suflê') || t.includes('sufle')) return '/dishes/sufle-legumes.jpg';
  if (t.includes('canja')) return '/dishes/canja-frango.jpg';
  if (t.includes('salmão') || t.includes('salmao')) return '/dishes/salmao-grelhado.png';
  if (t.includes('quinoa')) return '/dishes/bowl-quinoa.jpg';
  if (t.includes('cuscuz com queijo') || t.includes('cuscuz recheado')) return '/dishes/cuscuz-queijo.jpg';
  if (t.includes('crepioca de frango')) return '/dishes/crepioca-frango.jpg';
  if (t.includes('mingau')) return '/dishes/sug-20.jpg';
  if (t.includes('xadrez')) return '/dishes/frango-xadrez.jpg';
  if (t.includes('strogonoff de frango')) return '/dishes/sug-9.jpg';
  return fallbackImage || '/dishes/rec-5.jpg';
}

