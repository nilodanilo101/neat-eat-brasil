/**
 * stepPhotoMapper.js
 * Mapeador de fotografias operacionais gastronômicas por etapa do preparo.
 * Garante que NENHUMA receita apresente fotos repetidas ao longo dos passos,
 * associando cada momento culinário (mise en place, corte, fogo/selagem,
 * salteado, molho, forno e empratamento) a fotografias operacionais técnicas distintas.
 */

export const PHOTO_LIBRARY = {
  miseEnPlace: [
    '/dishes/steps/bowl-mexicano/step-1.webp',
    '/dishes/steps/crepioca/step-1.webp',
    '/dishes/steps/frango-legumes/step-1.webp',
    '/dishes/steps/caldo-verde/step-1.webp',
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
    '/dishes/steps/caldo-verde/step-4.webp',
    '/dishes/steps/frango-legumes/step-6.webp',
    '/dishes/steps/carne-abobora/step-4.webp',
    '/dishes/steps/caldo-verde/step-5.webp',
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
 * Normaliza um conjunto de etapas de receita, garantindo fotos 100% variadas e fiéis
 */
export function diversifyRecipeStepPhotos(steps = [], existingStepDetails = [], heroImage = '') {
  if (!Array.isArray(steps) || steps.length === 0) return [];

  // Detecta se todas as fotos existentes são idênticas (bug anterior)
  const existingImages = (existingStepDetails || []).map((s) => s?.image).filter(Boolean);
  const areAllIdentical =
    existingImages.length >= 2 &&
    existingImages.every((img) => img === existingImages[0]);

  const usedPhotos = new Set();
  // Hero image fica reservado para a etapa final
  if (steps.length > 1 && heroImage) {
    usedPhotos.add(heroImage);
  }

  return steps.map((stepText, idx) => {
    const existing = existingStepDetails ? existingStepDetails[idx] : null;
    const isLastStep = idx === steps.length - 1;

    let finalPhoto = null;
    if (isLastStep && heroImage) {
      // O último passo sempre mostra a foto canônica do prato finalizado
      finalPhoto = heroImage;
    } else if (existing?.image && !areAllIdentical && !usedPhotos.has(existing.image) && existing.image !== heroImage) {
      finalPhoto = existing.image;
    } else {
      finalPhoto = resolveStepPhoto(stepText, idx, steps.length, heroImage, usedPhotos);
    }

    usedPhotos.add(finalPhoto);

    return {
      ...(existing || {}),
      stepNumber: idx + 1,
      section:
        existing?.section ||
        (idx === 0
          ? 'Mise en Place & Pré-preparo'
          : idx === steps.length - 1
          ? 'Finalização & Empratamento'
          : 'Cocção & Ponto Ideal'),
      text: stepText,
      image: finalPhoto,
      alt: existing?.alt || `Passo ${idx + 1}: ${stepText.slice(0, 50)}...`,
      tip:
        existing?.tip ||
        (idx === 0
          ? 'Pese todos os insumos e organize os utensílios na bancada.'
          : idx === steps.length - 1
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
  'sug-19': '/dishes/sug-16.jpg',
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
  if (t.includes('caesar') || t.includes('salada caesar')) return '/dishes/sug-16.jpg';
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

