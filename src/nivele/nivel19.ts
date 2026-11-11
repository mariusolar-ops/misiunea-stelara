// NIVELUL 19 – Fuga de extraterestru (ideea lui Mihai)
// Un extraterestru poznaș te fugărește cu farfuria lui zburătoare! Zboară puțin mai încet decât alergi,
// așa că nu te opri: blocurile care dispar, platformele care se mișcă și trambulinele te încetinesc.
// Dacă te prinde, te întorci la steag (și el pornește iar din spatele tău).
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, trambulina, banda, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const VERDE = 0x3a6a4a;
const VERDE2 = 0x4a8a5a;

export const nivel19: DefinitieNivel = {
  nume: 'Fuga de extraterestru',
  tema: 'ozn',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 8, VERDE),
    bloc(0, 0, -10, 4, 12, VERDE2),
    dispare(bloc(-1.5, 0, -18.5, 2.5, 2.5, C.roz)),
    dispare(bloc(1.5, 0, -22.5, 2.5, 2.5, C.roz)),
    bloc(0, 0, -30, 5, 6, VERDE2),
    mobila(bloc(-3, 0, -37, 3, 3, C.portocaliu), [6, 0, 0], 3),
    bloc(0, 0, -43, 6, 6, C.turcoaz),                     // steagul 1
    trambulina(0, 0, -50, 3, 3),
    bloc(0, 5, -56, 4, 4, VERDE2),
    bloc(0, 5, -64, 3, 8, VERDE),
    banda(0, 5, -74, 3, 8, 0, -3),                         // te ajută să fugi!
    bloc(0, 5, -83, 6, 6, C.turcoaz),                     // steagul 2
    bloc(0, 5.8, -89.5, 3, 3, VERDE2),
    bloc(0, 6.6, -94.5, 3, 3, VERDE2),
    dispare(bloc(0, 6.6, -99.5, 3, 3, C.roz)),
    bloc(0, 6.6, -107, 8, 8, C.turcoaz),                  // finalul
  ],

  obstacole: [
    { tip: 'extraterestru', start: [0, 3, 14], viteza: 6, intarziere: 3 },
  ],

  indicii: [
    { poz: [0, 0, 1], raza: 3, text: 'Fugi! Te fugărește un extraterestru!' },
  ],

  steaguri: [
    { poz: [-2, 0, -43], directie: ÎNAINTE },
    { poz: [-2, 5, -83], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([0, 1, -6], [0, 1, -14], 3),
    monedaPe(-1.5, 0, -18.5), monedaPe(1.5, 0, -22.5), monedaPe(0, 0, -30), [0, 1.2, -37],
    [0, 3, -50], monedaPe(0, 5, -56), ...linieMonede([0, 6, -61], [0, 6, -67], 3),
    ...linieMonede([0, 6, -71], [0, 6, -77], 3),
    monedaPe(0, 5.8, -89.5), monedaPe(0, 6.6, -94.5), monedaPe(0, 6.6, -99.5),
    ...linieMonede([-2.5, 7.6, -105], [2.5, 7.6, -105], 3),
  ],

  final: { poz: [0, 6.6, -108.5], directie: ÎNAINTE },
};
