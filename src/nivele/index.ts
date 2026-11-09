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

export const NIVELE = [nivel1, nivel2, nivel3, nivel4, nivel5, nivelSecret, nivel6, nivel7, nivel8];

/** Poziția nivelului secret în listă (apare doar după ce găsești toate stelele secrete) */
export const INDEX_SECRET = 5;

/** Ordinea în care se joacă nivelurile normale (pozițiile din NIVELE) */
export const ORDINE_NORMALA = [0, 1, 2, 3, 4, 6, 7, 8];

/** Câte niveluri „normale” sunt (fără cel secret) */
export const NR_NIVELE_NORMALE = ORDINE_NORMALA.length;

/** Numărul afișat pe ecran pentru un nivel (ex. „6”), sau ✨ pentru cel secret */
export function numarAfisat(index: number) {
  return index === INDEX_SECRET ? '✨' : String(ORDINE_NORMALA.indexOf(index) + 1);
}

/** Nivelul care urmează după acesta în ordinea normală (sau null dacă e ultimul) */
export function urmatorulNormal(index: number): number | null {
  const poz = ORDINE_NORMALA.indexOf(index);
  return poz >= 0 && poz < ORDINE_NORMALA.length - 1 ? ORDINE_NORMALA[poz + 1] : null;
}
