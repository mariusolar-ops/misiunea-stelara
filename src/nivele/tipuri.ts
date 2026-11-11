// Cum arată definiția unui nivel. Fiecare nivel stă în fișierul lui (nivel1.ts, nivel2.ts ...)
// și e doar o listă de date – ușor de citit și de modificat.
import type { DefinitiePlatforma } from '../lume/Platforma';
import type { Tema } from '../lume/Decor';
import type { DefinitieObstacol } from '../lume/obstacole';

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
  /** Obstacole: lasere, pendule, curenți de aer, cristale (opțional) */
  obstacole?: DefinitieObstacol[];
  /** Mesaje care apar o dată, când treci printr-un loc (ex. la o răscruce) */
  indicii?: { poz: Punct; raza: number; text: string }[];
  /** Câte monede trebuie pentru 3 stele (implicit: toate). Folositor când sunt mai multe drumuri. */
  monedePentru3Stele?: number;
  /** Nivelul cu portale: numărăm greșelile (fără greșeli = se deschide un nivel secret) */
  nivelPortale?: boolean;
  /** Camera de la început (ex. mai de sus, la labirint) */
  camera?: { inaltime?: number; distanta?: number };
  /** Gravitația (1 = normală, 0.4 = gravitație mică: sari foarte sus și plutești). Implicit 1 */
  gravitatie?: number;
  /** Steaua secretă ascunsă în nivel (opțional) */
  secret?: Punct;
  /** True pentru nivelul secret (apare doar după ce strângi toate stelele secrete) */
  esteSecret?: boolean;
}
