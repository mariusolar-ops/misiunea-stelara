// Efectele sonore, generate din cod cu Web Audio (fără fișiere audio descărcate).
// Fiecare sunet = unul sau mai multe „bipuri” scurte cu frecvența care se schimbă.

let ctx: AudioContext | null = null;
let volumGeneral: GainNode | null = null;
let pornit = true;
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
      default: bip('square', 280, 560, 0.13, 0, 0.35);
    }
  },
  aterizare: () => bip('triangle', 160, 60, 0.18, 0, 0.6),
  cufar: () => {
    // tobă: câteva bătăi tot mai repezi, apoi fanfară
    [0, 0.25, 0.45, 0.6, 0.72, 0.82, 0.9].forEach((t) => bip('triangle', 120, 80, 0.08, t, 0.7));
    [523, 659, 784, 1047, 1319].forEach((f, i) => bip('square', f, f, 0.18, 1.0 + i * 0.08, 0.3));
  },
  click: () => bip('triangle', 700, 500, 0.05, 0, 0.4),
};
