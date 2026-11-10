// Muzica spațială, compusă din cod (Web Audio) – nicio melodie descărcată.
// Trei „instrumente” simple: un pad moale (acorduri lungi), un bas și un arpegiu cu ecou.
// Acordurile se repetă într-o buclă de 16 secunde: La minor – Fa – Do – Sol.
import { contextAudio, sunetPornit } from './Sunete';

const NOTE = { A2: 110, C3: 130.8, D3: 146.8, E3: 164.8, F2: 87.3, G2: 98, A3: 220, B3: 246.9, C4: 261.6, D4: 293.7, E4: 329.6, F4: 349.2, G4: 392, A4: 440, B4: 493.9, C5: 523.3, D5: 587.3, E5: 659.3, G5: 784 };
const ACORDURI = [
  { bas: NOTE.A2, pad: [NOTE.A3, NOTE.C4, NOTE.E4], arp: [NOTE.A4, NOTE.C5, NOTE.E5, NOTE.C5] },
  { bas: NOTE.F2, pad: [NOTE.F4, NOTE.A3, NOTE.C4], arp: [NOTE.F4, NOTE.A4, NOTE.C5, NOTE.A4] },
  { bas: NOTE.C3, pad: [NOTE.C4, NOTE.E4, NOTE.G4], arp: [NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5] },
  { bas: NOTE.G2, pad: [NOTE.B3, NOTE.D4, NOTE.G4], arp: [NOTE.G4, NOTE.B4, NOTE.D5, NOTE.B4] },
];
const DURATA_ACORD = 4;      // secunde
const PAS_ARPEGIU = 0.5;     // o notă la jumătate de secundă

let iesire: GainNode | null = null;   // volumul muzicii
let ecou: DelayNode | null = null;
let filtru: BiquadFilterNode | null = null;
let pornita = true;
let volum = 0.5;
let urmatoareaNota = 0;              // când trebuie programată următoarea notă de arpegiu
let indexArp = 0;
let ceas: number | null = null;

function pregateste(ctx: AudioContext) {
  if (iesire) return;
  iesire = ctx.createGain();
  iesire.gain.value = volum * 0.35;
  iesire.connect(ctx.destination);
  // un filtru care face sunetul mai moale, „de spațiu”
  filtru = ctx.createBiquadFilter();
  filtru.type = 'lowpass';
  filtru.frequency.value = 1400;
  filtru.connect(iesire);
  // ecoul pentru arpegiu
  ecou = ctx.createDelay(1);
  ecou.delayTime.value = 0.375;
  const reintoarcere = ctx.createGain();
  reintoarcere.gain.value = 0.38;
  ecou.connect(reintoarcere).connect(ecou);
  ecou.connect(filtru);
}

/** O notă: formă, frecvență, început, durată, volum, ataca (cât de încet pornește) */
function nota(ctx: AudioContext, tip: OscillatorType, f: number, t0: number, durata: number, vol: number, atac: number, spre: AudioNode) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = tip;
  osc.frequency.value = f;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + atac);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + durata);
  osc.connect(g).connect(spre);
  osc.start(t0);
  osc.stop(t0 + durata + 0.05);
}

/** Programează notele pentru următoarele câteva zecimi de secundă (rulează des, e foarte ieftin) */
function programeaza() {
  const ctx = contextAudio();
  if (!ctx || ctx.state !== 'running' || !pornita || !sunetPornit() || document.hidden) return;
  pregateste(ctx);
  if (urmatoareaNota < ctx.currentTime) urmatoareaNota = ctx.currentTime + 0.1;
  while (urmatoareaNota < ctx.currentTime + 0.3) {
    const t = urmatoareaNota;
    const pasiPeAcord = DURATA_ACORD / PAS_ARPEGIU;
    const acord = ACORDURI[Math.floor(indexArp / pasiPeAcord) % ACORDURI.length];
    const pozInAcord = indexArp % pasiPeAcord;
    if (pozInAcord === 0) {
      // început de acord: pad + bas
      for (const f of acord.pad) {
        nota(ctx, 'triangle', f, t, DURATA_ACORD + 0.6, 0.12, 1.2, filtru!);
        nota(ctx, 'sine', f * 1.005, t, DURATA_ACORD + 0.6, 0.08, 1.4, filtru!);
      }
      nota(ctx, 'sine', acord.bas, t, DURATA_ACORD, 0.3, 0.3, filtru!);
    }
    // arpegiul: nu cântă chiar pe fiecare pas, ca să „respire”
    if (pozInAcord % 4 !== 3) {
      nota(ctx, 'sine', acord.arp[pozInAcord % acord.arp.length], t, 0.45, 0.12, 0.02, ecou!);
    }
    indexArp++;
    urmatoareaNota += PAS_ARPEGIU;
  }
}

/** Pornește programatorul muzicii (o singură dată) */
export function pornesteMuzica() {
  if (ceas === null) ceas = window.setInterval(programeaza, 100);
}

export function seteazaMuzica(da: boolean) {
  pornita = da;
}

/** Volumul muzicii, de la 0 la 1 */
export function seteazaVolumMuzica(v: number) {
  volum = v;
  if (iesire) iesire.gain.value = v * 0.35;
}
