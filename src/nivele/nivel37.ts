// NIVELUL 37 – Templul din junglă (nivel automat)
// Pe o planetă verde, plină de copaci uriași, e ascuns un templu vechi!
// Treci râul de lavă pe pietrele care se scufundă și ies la loc (sari repede!),
// strecoară-te pe pod printre trunchiurile care se leagănă, urcă treptele
// piramidei, sari cu frunza-trambulină și ajungi la statuia de aur.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, lava, trambulina, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const TEMPLU = 0x9a8a6a;
const TEMPLU2 = 0x7a8a5a;
const PIATRA = 0x6a6a5a;
const FRUNZA = 0x4ac05a;

/** Piatră care se scufundă încet în lavă și iese la loc */
const piatra = (x: number, z: number, faza: number) =>
  mobila(bloc(x, 0, z, 2.5, 2.5, PIATRA), [0, -1.4, 0], 3.6, faza);

export const nivel37: DefinitieNivel = {
  nume: 'Templul din junglă',
  tema: 'jungla',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, TEMPLU),
    // râul de lavă și pietrele care se scufundă
    lava(0, -1, -12, 8, 12),
    piatra(-1.5, -6, 0),
    piatra(1.5, -10, 0.25),
    piatra(-1.5, -14, 0.5),
    piatra(1.5, -18, 0.75),
    bloc(0, 0, -23, 4, 4, TEMPLU2),
    bloc(0, 0, -29, 6, 6, C.turcoaz),                      // steagul 1
    bloc(0, 0, -40, 2.5, 12, TEMPLU),                      // podul cu trunchiuri
    // treptele piramidei
    ...[1, 2, 3, 4].map((k) => bloc(0, k, -46 - k * 3, 4, 2, k % 2 ? TEMPLU2 : TEMPLU)),
    bloc(0, 4, -63, 6, 6, C.turcoaz),                      // steagul 2
    trambulina(0, 4, -70, 3, 3, 18, FRUNZA),               // frunza-trambulină
    bloc(0, 7, -76, 3, 3, TEMPLU2),
    dispare(bloc(-2, 7, -81, 2.5, 2.5, PIATRA)),           // pietre care se prăbușesc
    dispare(bloc(2, 7, -85, 2.5, 2.5, PIATRA)),
    bloc(0, 7, -92, 8, 8, C.turcoaz),                      // statuia de aur
  ],

  obstacole: [
    // trunchiurile de copac se leagănă peste pod
    { tip: 'pendul', pivot: [0, 4.4, -37.5], lungime: 3.8, amplitudine: 0.95, perioada: 2.5, axa: 'x' },
    { tip: 'pendul', pivot: [0, 4.4, -42.5], lungime: 3.8, amplitudine: 0.95, perioada: 2.5, faza: 0.5, axa: 'x' },
  ],

  indicii: [
    { poz: [0, 0, -2], raza: 2.5, text: 'Pietrele se scufundă în lavă – sari repede!' },
  ],

  steaguri: [
    { poz: [-2, 0, -29], directie: ÎNAINTE },
    { poz: [-2, 4, -63], directie: ÎNAINTE },
  ],

  monede: [
    [-1.5, 1.5, -6], [1.5, 1.5, -10], [-1.5, 1.5, -14], [1.5, 1.5, -18], monedaPe(0, 0, -23),
    ...linieMonede([0, 1, -35], [0, 1, -45], 3),
    ...[1, 2, 3, 4].map((k) => monedaPe(0, k, -46 - k * 3)),
    [0, 8, -70], monedaPe(0, 7, -76),
    monedaPe(-2, 7, -81), monedaPe(2, 7, -85),
    ...linieMonede([-2.5, 8, -90], [2.5, 8, -90], 3),
  ],

  final: { poz: [0, 7, -95.5], directie: ÎNAINTE },
};
