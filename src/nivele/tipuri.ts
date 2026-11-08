// Cum arată definiția unui nivel. Fiecare nivel stă în fișierul lui (nivel1.ts, nivel2.ts ...)
// și e doar o listă de date – ușor de citit și de modificat.
import type { DefinitiePlatforma } from '../lume/Platforma';
import type { Tema } from '../lume/Decor';

export type Punct = [number, number, number];

export interface DefinitieNivel {
  nume: string;
  tema: Tema;
  /** Unde apare personajul la început */
  start: Punct;
  /** Spre ce parte privește la start (radiani; Math.PI = înainte, spre -z) */
  directieStart: number;
  platforme: DefinitiePlatforma[];
  /** Steagurile de checkpoint: unde stau și spre ce parte te uiți când revii la ele */
  steaguri: { poz: Punct; directie: number }[];
  /** Monedele (poziția fiecăreia, în aer) */
  monede: Punct[];
  /** Poarta de final */
  final: { poz: Punct; directie: number };
}
