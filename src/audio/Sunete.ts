// Efectele sonore, generate din cod cu Web Audio (fără fișiere audio descărcate).
// Fiecare sunet = unul sau mai multe „bipuri” scurte cu frecvența care se schimbă.

let ctx: AudioContext | null = null;
let volumGeneral: GainNode | null = null;
let pornit = true;
let notaXilofon = 0;
/** Volumul efectelor, 0..1 (din Setări) */
let volumEfecte = 0.8;
const VOLUM_MAXIM = 0.45;

/** Browserele permit sunetul doar după prima atingere – îl pregătim atunci */
export function pregatesteSunetul() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    volumGeneral = ctx.createGain();
    volumGeneral.gain.value = VOLUM_MAXIM * volumEfecte;
    volumGeneral.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
}

/** Contextul audio (îl folosește și muzica). Poate fi null până la prima atingere. */
export function contextAudio() { return ctx; }

/** Volumul efectelor, de la 0 la 1 */
export function seteazaVolumEfecte(v: number) {
  volumEfecte = v;
  if (volumGeneral) volumGeneral.gain.value = VOLUM_MAXIM * v;
}

export function seteazaSunet(da: boolean) { pornit = da; }
export function sunetPornit() { return pornit; }

/**
 * Un bip: formă de undă, frecvența de început și de sfârșit, durata, când începe (secunde de acum).
 */
function bip(tip: OscillatorType, de: number, la: number, durata: number, peste = 0, volum = 1) {
  if (!pornit || !ctx || !volumGeneral) return;
  const t0 = ctx.currentTime + peste;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = tip;
  osc.frequency.setValueAtTime(de, t0);
  osc.frequency.exponentialRampToValueAtTime(la, t0 + durata);
  // volum: pornește repede, se stinge lin (fără „pocnituri”)
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(volum, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + durata);
  osc.connect(g).connect(volumGeneral);
  osc.start(t0);
  osc.stop(t0 + durata + 0.02);
}

export const sunete = {
  saritura: () => bip('square', 280, 560, 0.13, 0, 0.35),
  moneda: () => { bip('square', 988, 988, 0.07, 0, 0.3); bip('square', 1319, 1319, 0.16, 0.07, 0.3); },
  steag: () => [523, 659, 784, 1047].forEach((f, i) => bip('triangle', f, f, 0.14, i * 0.09, 0.6)),
  trambulina: () => bip('sine', 180, 900, 0.3, 0, 0.8),
  cadere: () => bip('triangle', 600, 140, 0.45, 0, 0.6),
  lava: () => { bip('sawtooth', 300, 90, 0.35, 0, 0.3); bip('triangle', 500, 160, 0.4, 0.05, 0.5); },
  final: () => [523, 659, 784, 659, 784, 1047].forEach((f, i) => bip('triangle', f, f, i === 5 ? 0.5 : 0.15, i * 0.13, 0.7)),
  cumparare: () => [784, 988, 1175, 1568].forEach((f, i) => bip('square', f, f, 0.09, i * 0.06, 0.25)),
  secret: () => [659, 831, 988, 1319, 1661, 1976].forEach((f, i) => bip('sine', f, f * 1.01, 0.35, i * 0.08, 0.5)),
  laser: () => { bip('sawtooth', 1400, 180, 0.22, 0, 0.35); bip('square', 900, 120, 0.25, 0.03, 0.2); },
  lovitura: () => bip('square', 220, 70, 0.18, 0, 0.6),
  vant: () => bip('triangle', 200, 700, 0.5, 0, 0.35),
  /** Sunetul de săritură, după varianta aleasă (din cufere) */
  sarituraVarianta: (v: string) => {
    switch (v) {
      case 'boing': bip('sine', 150, 620, 0.25, 0, 0.7); break;
      case 'laser': bip('square', 1300, 260, 0.14, 0, 0.25); break;
      case 'robot': bip('square', 420, 420, 0.06, 0, 0.3); bip('square', 640, 640, 0.07, 0.06, 0.3); break;
      case 'pian': bip('triangle', 1047, 1047, 0.3, 0, 0.6); bip('sine', 2094, 2094, 0.15, 0, 0.2); break;
      case 'bula': bip('sine', 380, 1300, 0.09, 0, 0.6); break;
      case 'fluier': bip('sine', 900, 2200, 0.25, 0, 0.4); break;
      case 'arcade': [523, 659, 784, 1047].forEach((f, i) => bip('square', f, f, 0.05, i * 0.04, 0.2)); break;
      case 'miau': bip('triangle', 700, 1100, 0.12, 0, 0.5); bip('triangle', 1100, 600, 0.22, 0.12, 0.5); break;
      case 'racheta': bip('sawtooth', 120, 900, 0.35, 0, 0.18); break;
      default: bip('square', 280, 560, 0.13, 0, 0.35);
    }
  },
  /** Un pas, după varianta aleasă (din cufere). „stang” alternează puțin sunetul */
  pas: (v: string, stang: boolean) => {
    const k = stang ? 1 : 1.12;
    switch (v) {
      case 'scartait': bip('sine', 900 * k, 1500 * k, 0.07, 0, 0.35); bip('sine', 1400 * k, 800 * k, 0.07, 0.07, 0.3); break;
      case 'toba': bip('triangle', 150 * k, 60, 0.12, 0, 0.8); break;
      case 'clopotei': bip('sine', 1568 * k, 1568 * k, 0.18, 0, 0.25); bip('sine', 2093 * k, 2093 * k, 0.14, 0.02, 0.15); break;
      case 'robot': bip('square', 260 * k, 220 * k, 0.07, 0, 0.18); bip('sawtooth', 120, 90, 0.05, 0.05, 0.12); break;
      case 'bule': bip('sine', 320 * k, 900 * k, 0.07, 0, 0.45); break;
      case 'xilofon': { notaXilofon = (notaXilofon + 1) % 5; const f = [523, 587, 659, 784, 880][notaXilofon]; bip('sine', f, f, 0.2, 0, 0.45); bip('triangle', f * 2, f * 2, 0.08, 0, 0.15); break; }
      case 'cal': bip('triangle', 900 * k, 600 * k, 0.04, 0, 0.5); bip('triangle', 800 * k, 500 * k, 0.04, 0.09, 0.4); break;
      case 'gelatina': bip('sine', 200 * k, 380 * k, 0.12, 0, 0.5); bip('sine', 380 * k, 240 * k, 0.1, 0.06, 0.3); break;
      case 'zapada': bip('sawtooth', 1800 * k, 900 * k, 0.05, 0, 0.12); bip('square', 1200 * k, 700 * k, 0.04, 0.03, 0.08); break;
    }
  },
  aterizare: () => bip('triangle', 160, 60, 0.18, 0, 0.6),
  cufar: () => {
    // tobă: câteva bătăi tot mai repezi, apoi fanfară
    [0, 0.25, 0.45, 0.6, 0.72, 0.82, 0.9].forEach((t) => bip('triangle', 120, 80, 0.08, t, 0.7));
    [523, 659, 784, 1047, 1319].forEach((f, i) => bip('square', f, f, 0.18, 1.0 + i * 0.08, 0.3));
  },
  artificiu: () => { bip('triangle', 200, 1400, 0.25, 0, 0.25); bip('square', 1800, 600, 0.3, 0.22, 0.12); },
  minge: () => bip('sine', 140, 70, 0.08, 0, 0.35),
  teleport: () => { bip('sine', 300, 2000, 0.15, 0, 0.4); bip('sine', 2000, 600, 0.15, 0.12, 0.3); },
  /** Crăpătura cufărului (tot mai sus la fiecare atingere) */
  crapa: (n: number) => { bip('square', 300 + n * 180, 150 + n * 90, 0.12, 0, 0.35); bip('triangle', 900 + n * 300, 1300 + n * 300, 0.25, 0.05, 0.3); },
  /** Sunet de extratereștri la intrarea în joc (ca un teremin care face „uiu-uiu”) */
  extraterestri: () => {
    if (!pornit || !ctx || !volumGeneral) return;
    const t0 = ctx.currentTime, osc = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lfoG = ctx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(500, t0); osc.frequency.linearRampToValueAtTime(900, t0 + 1.2);
    lfo.frequency.value = 7; lfoG.gain.value = 60;
    lfo.connect(lfoG).connect(osc.frequency);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.35, t0 + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.5);
    osc.connect(g).connect(volumGeneral);
    osc.start(t0); lfo.start(t0); osc.stop(t0 + 1.6); lfo.stop(t0 + 1.6);
    [1200, 1500, 1100].forEach((f, i) => bip('square', f, f * 1.2, 0.06, 1.3 + i * 0.09, 0.12)); // „bip-bip-bip”
  },
  click: () => bip('triangle', 700, 500, 0.05, 0, 0.4),
};
