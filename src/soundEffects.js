/**
 * soundEffects.js
 * Sintetizador harmônico nativo de alta gastronomia via Web Audio API.
 * Sem arquivos de áudio externos, latência zero (0ms), 0 KB de espaço em disco.
 */

let audioCtx = null;
let soundEnabled = true;

// Carrega preferência do usuário do localStorage
try {
  const saved = localStorage.getItem('neateat_sound_enabled');
  if (saved !== null) {
    soundEnabled = saved === 'true';
  }
} catch {
  // Ignora se localStorage indisponível
}

// Inicializa ou restaura o AudioContext após interação do usuário (respeita autoplay)
function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);
  try {
    localStorage.setItem('neateat_sound_enabled', String(soundEnabled));
  } catch {
    // ignore
  }
}

export function toggleSound() {
  const next = !soundEnabled;
  setSoundEnabled(next);
  if (next) {
    playPopCheck(0.2); // Toca um sonzinho sutil confirmando a ativação
  }
  return next;
}

/**
 * 1. CAMPAINHA DE SERVIÇO DO CHEF (SERVICE BELL)
 * Tocado ao concluir um prato ou passar para a finalização ("Voilá!")
 * Sintetiza o clássico "Ding!" brilhante de latão de balcão de restaurante.
 */
export function playChefServiceBell(volume = 0.45) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Frequência fundamental de sineta de latão (~E6 / 1318.5 Hz) + harmônicos inarmônicos
  const frequencies = [1318.5, 2637, 3955.5, 5274];
  const gains = [0.55, 0.22, 0.12, 0.05];
  const decays = [1.8, 1.2, 0.7, 0.4];

  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = idx === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Envelope percussivo característico de sino
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(gains[idx] * volume, now + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decays[idx]);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + decays[idx] + 0.05);
  });
}

/**
 * 2. ALARME DO TIMER DE COZIMENTO (BISTRÔ TIMER)
 * Tocado quando o tempo de cozimento zera.
 * 3 toques duplos elegantes (ding-ding... ding-ding... ding-ding).
 */
export function playCookingTimerAlarm(volume = 0.35) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const baseTime = ctx.currentTime;
  const beeps = [0, 0.13, 0.55, 0.68, 1.1, 1.23];

  beeps.forEach((offset, idx) => {
    const t = baseTime + offset;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    // Segundo toque ligeiramente mais agudo para dar musicalidade
    const freq = idx % 2 === 0 ? 1760 : 2093; // A6 -> C7
    osc.frequency.setValueAtTime(freq, t);

    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.exponentialRampToValueAtTime(volume, t + 0.004);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);
  });
}

/**
 * 3. POP & CHECK (LISTA DE COMPRAS & MARCAÇÃO)
 * Tocado ao marcar/desmarcar insumos no mercado ou despensa.
 * Clique de gota/madeira ultra sutil e satisfatório (~75ms).
 */
export function playPopCheck(volume = 0.22) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = 'sine';
  // Pitch glide rápido (587 Hz -> 880 Hz)
  osc.frequency.setValueAtTime(587, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.035);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.003);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.08);
}

/**
 * 4. CHIME DE ABASTECIMENTO (NFC-E & GELADEIRA)
 * Tocado ao confirmar compras e calibrar preços.
 * Acorde arpejado ascendente harmônico brilhante (C5 -> E5 -> G5 -> C6).
 */
export function playStockFridgeChime(volume = 0.3) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // Dó, Mi, Sol, Dó
  const step = 0.07;

  notes.forEach((freq, idx) => {
    const t = now + idx * step;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    const isLast = idx === notes.length - 1;
    const decay = isLast ? 0.65 : 0.25;
    const noteGain = (isLast ? 1.0 : 0.7) * volume;

    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.exponentialRampToValueAtTime(noteGain, t + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + decay);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + decay + 0.05);
  });
}
