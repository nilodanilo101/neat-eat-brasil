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

    let finalPhoto = null;
    // Se a foto existente já for variada e não utilizada nesta receita, preserva
    if (existing?.image && !areAllIdentical && !usedPhotos.has(existing.image)) {
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
