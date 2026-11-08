// Fizica simplă a jocului: personajul e o „cutie” care nu poate intra în platforme.
// Mișcăm pe rând pe X, apoi pe Z, apoi pe Y. Dacă dăm de o platformă, ne oprim lângă ea.
import * as THREE from 'three';
import type { Platforma } from '../lume/Platforma';

export const LATIME_JUCATOR = 0.7;   // cât de lată e cutia personajului
export const INALTIME_JUCATOR = 1.9; // cât de înaltă

const cutieJucator = new THREE.Box3();

function puneCutia(poz: THREE.Vector3) {
  const j = LATIME_JUCATOR / 2;
  cutieJucator.min.set(poz.x - j, poz.y, poz.z - j);
  cutieJucator.max.set(poz.x + j, poz.y + INALTIME_JUCATOR, poz.z + j);
}

function seSuprapun(a: THREE.Box3, b: THREE.Box3) {
  // „<” strict: dacă doar se ating, nu e coliziune
  return a.min.x < b.max.x && a.max.x > b.min.x &&
         a.min.y < b.max.y && a.max.y > b.min.y &&
         a.min.z < b.max.z && a.max.z > b.min.z;
}

export interface RezultatMiscare {
  peSol: boolean;
  /** Platforma pe care stă personajul (sau null dacă e în aer) */
  platformaSub: Platforma | null;
  /** True dacă s-a lovit cu capul de ceva */
  lovitSus: boolean;
}

/**
 * Mută personajul cu „pas” și îl oprește la platforme.
 * Modifică direct `poz` și, când e cazul, `viteza.y`.
 */
export function misca(
  poz: THREE.Vector3,
  viteza: THREE.Vector3,
  pas: THREE.Vector3,
  platforme: Platforma[],
): RezultatMiscare {
  const rez: RezultatMiscare = { peSol: false, platformaSub: null, lovitSus: false };
  const j = LATIME_JUCATOR / 2;

  // --- pe X ---
  poz.x += pas.x;
  puneCutia(poz);
  for (const p of platforme) {
    if (!seSuprapun(cutieJucator, p.cutie)) continue;
    if (pas.x > 0) poz.x = p.cutie.min.x - j - 0.001;
    else if (pas.x < 0) poz.x = p.cutie.max.x + j + 0.001;
    puneCutia(poz);
  }

  // --- pe Z ---
  poz.z += pas.z;
  puneCutia(poz);
  for (const p of platforme) {
    if (!seSuprapun(cutieJucator, p.cutie)) continue;
    if (pas.z > 0) poz.z = p.cutie.min.z - j - 0.001;
    else if (pas.z < 0) poz.z = p.cutie.max.z + j + 0.001;
    puneCutia(poz);
  }

  // --- pe Y (sus/jos) ---
  poz.y += pas.y;
  puneCutia(poz);
  for (const p of platforme) {
    if (!seSuprapun(cutieJucator, p.cutie)) continue;
    if (pas.y <= 0) {
      // cădem pe platformă
      poz.y = p.cutie.max.y;
      viteza.y = 0;
      rez.peSol = true;
      rez.platformaSub = p;
    } else {
      // ne lovim cu capul
      poz.y = p.cutie.min.y - INALTIME_JUCATOR - 0.001;
      viteza.y = 0;
      rez.lovitSus = true;
    }
    puneCutia(poz);
  }

  return rez;
}

/** Cea mai înaltă suprafață aflată sub personaj (pentru pata de umbră) */
export function solulDeSub(poz: THREE.Vector3, platforme: Platforma[]): number | null {
  let cel = -Infinity;
  for (const p of platforme) {
    const c = p.cutie;
    if (poz.x >= c.min.x && poz.x <= c.max.x && poz.z >= c.min.z && poz.z <= c.max.z &&
        c.max.y <= poz.y + 0.05 && c.max.y > cel) {
      cel = c.max.y;
    }
  }
  return cel === -Infinity ? null : cel;
}
