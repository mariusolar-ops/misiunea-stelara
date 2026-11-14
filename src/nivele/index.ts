// Lista tuturor nivelurilor. ATENȚIE: ordinea din NIVELE nu se schimbă niciodată,
// pentru că progresul salvat pe telefon ține minte nivelurile după poziția din listă.
// Nivelurile noi se adaugă mereu la SFÂRȘIT, iar ordinea în care se joacă e în ORDINE_NORMALA.
import { nivel1 } from './nivel1';
import { nivel2 } from './nivel2';
import { nivel3 } from './nivel3';
import { nivel4 } from './nivel4';
import { nivel5 } from './nivel5';
import { nivelSecret } from './nivelSecret';
import { nivel6 } from './nivel6';
import { nivel7 } from './nivel7';
import { nivel8 } from './nivel8';
import { nivel9 } from './nivel9';
import { nivel10 } from './nivel10';
import { nivel11 } from './nivel11';
import { nivelSecret2 } from './nivelSecret2';
import { nivel12 } from './nivel12';
import { nivel13 } from './nivel13';
import { nivel14 } from './nivel14';
import { nivel15 } from './nivel15';
import { nivel16 } from './nivel16';
import { nivel17 } from './nivel17';
import { nivel18 } from './nivel18';
import { nivelSecret3 } from './nivelSecret3';
import { nivel19 } from './nivel19';
import { nivel20 } from './nivel20';
import { nivel21 } from './nivel21';
import { nivel22 } from './nivel22';
import { nivel23 } from './nivel23';
import { nivel24 } from './nivel24';
import { nivel25 } from './nivel25';
import { nivel26 } from './nivel26';
import { nivel27 } from './nivel27';
import { nivel28 } from './nivel28';
import { nivel29 } from './nivel29';
import { nivel30 } from './nivel30';
import { nivel31 } from './nivel31';
import { nivel32 } from './nivel32';

export const NIVELE = [
  nivel1, nivel2, nivel3, nivel4, nivel5, nivelSecret, nivel6, nivel7, nivel8, nivel9, nivel10, nivel11, nivelSecret2,
  nivel12, nivel13, nivel14, nivel15, nivel16, nivel17, nivel18, nivelSecret3,
  nivel19, nivel20, nivel21, nivel22, nivel23, nivel24, nivel25, nivel26, nivel27, nivel28, nivel29, nivel30, nivel31, nivel32,
];

/** Poziția primului nivel secret în listă (apare doar după ce găsești toate stelele secrete mov) */
export const INDEX_SECRET = 5;

/**
 * Nivelurile secrete: fiecare se deschide când găsești stelele din anumite niveluri.
 *  - Nebuloasa secretă: stelele MOV din nivelurile 1–5
 *  - Templul de aur: stelele de AUR din nivelurile 6–9
 *  - Dimensiunea portalelor: termini „Cele 10 portale” fără nicio greșeală
 */
export const SECRETE: { index: number; nivele: number[]; culoare: number; numeStea: string; emoji: string; realizare?: string }[] = [
  { index: 5, nivele: [0, 1, 2, 3, 4], culoare: 0xd36bff, numeStea: 'Stea secretă', emoji: '✨' },
  { index: 12, nivele: [6, 7, 8, 9], culoare: 0xffc23f, numeStea: 'Stea de aur', emoji: '🌟' },
  // al treilea nivel secret nu are stele: se deschide dacă termini nivelul cu portale fără greșeli
  { index: 20, nivele: [], culoare: 0x8a6cff, numeStea: '', emoji: '🔐', realizare: 'portale-perfect' },
];

/** Grupa de stele secrete din care face parte un nivel (sau undefined) */
export function grupaSecret(indexNivel: number) {
  return SECRETE.find((s) => s.nivele.includes(indexNivel));
}

/** Este nivelul (secret) cu poziția „index” deschis? */
export function secretDeschis(p: { secrete: number[]; realizari?: string[] }, index: number) {
  const g = SECRETE.find((s) => s.index === index);
  if (!g) return false;
  if (g.realizare) return (p.realizari ?? []).includes(g.realizare);
  return g.nivele.every((n) => p.secrete.includes(n));
}

/** E nivel secret? */
export function esteNivelSecret(index: number) {
  return SECRETE.some((s) => s.index === index);
}

/** Ordinea în care se joacă nivelurile normale (pozițiile din NIVELE) */
export const ORDINE_NORMALA = [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];

/** Câte niveluri „normale” sunt (fără cel secret) */
export const NR_NIVELE_NORMALE = ORDINE_NORMALA.length;

/** Numărul afișat pe ecran pentru un nivel (ex. „6”), sau ✨ pentru cel secret */
export function numarAfisat(index: number) {
  const s = SECRETE.find((x) => x.index === index);
  return s ? s.emoji : String(ORDINE_NORMALA.indexOf(index) + 1);
}

/** Nivelul care urmează după acesta în ordinea normală (sau null dacă e ultimul) */
export function urmatorulNormal(index: number): number | null {
  const poz = ORDINE_NORMALA.indexOf(index);
  return poz >= 0 && poz < ORDINE_NORMALA.length - 1 ? ORDINE_NORMALA[poz + 1] : null;
}
