// Cum arată definiția unui nivel. Fiecare nivel stă în fișierul lui (nivel1.ts, nivel2.ts ...)
// și e doar o listă de date – ușor de citit și de modificat.
import type { DefinitiePlatforma } from '../lume/Platforma';

export interface DefinitieNivel {
  nume: string;
  /** Unde apare personajul la început [x, y, z] */
  start: [number, number, number];
  /** Spre ce parte privește la start (radiani) */
  directieStart?: number;
  platforme: DefinitiePlatforma[];
}
