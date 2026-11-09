// NIVELUL 4 – Luna vulcanică
// Nou: lavă (te trimite la steag) și blocuri care dispar după ce calci pe ele.
// Sfat: pe blocurile roz nu sta mult – sari repede mai departe!
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, lava, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const DREAPTA = Math.PI / 2;
const STANCA = 0x5e4a4e;
const STANCA2 = 0x4a3b3f;

export const nivel4: DefinitieNivel = {
  nume: 'Luna vulcanică',
  tema: 'vulcan',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    // --- Partea 1: pietre peste un râu de lavă ---
    bloc(0, 0, 0, 8, 8, STANCA),
    lava(0, -0.6, -13, 10, 18),
    bloc(-2, 0, -7, 2, 2, STANCA2),
    bloc(2, 0, -11, 2, 2, STANCA2),
    bloc(-1, 0, -15, 2, 2, STANCA2),
    bloc(2.5, 0, -19, 2, 2, STANCA2),
    bloc(0, 0, -25, 4, 4, STANCA),
    bloc(0, 0, -32, 7, 7, C.turcoaz),                   // steagul 1

    // --- Partea 2: blocuri care dispar, peste lavă ---
    lava(0, -0.6, -45, 10, 19),
    dispare(bloc(0, 0, -38.5, 2.5, 2.5, C.roz)),
    dispare(bloc(1.5, 0, -42.5, 2.5, 2.5, C.roz)),
    dispare(bloc(-1.5, 0, -46.5, 2.5, 2.5, C.roz)),
    dispare(bloc(0, 0, -50.5, 2.5, 2.5, C.roz)),
    bloc(0, 0, -58, 7, 7, C.turcoaz),                   // steagul 2

    // --- Partea 3: spre dreapta, o piatră care plutește și blocuri care dispar ---
    lava(15.5, -0.6, -58, 24, 10),
    mobila(bloc(7, 0, -58, 2.5, 2.5, STANCA2), [6, 0, 0], 3.5),
    dispare(bloc(17, 0, -58, 2.5, 2.5, C.roz)),
    dispare(bloc(21, 0.6, -58, 2.5, 2.5, C.roz)),
    dispare(bloc(25, 1.2, -58, 2.5, 2.5, C.roz)),
    bloc(31, 1.2, -58, 6, 6, C.turcoaz),                // steagul 3

    // --- Partea 4: urcarea finală peste lavă ---
    lava(31, -0.6, -72, 12, 22),
    bloc(31, 2, -64.25, 2.5, 2.5, STANCA),
    bloc(28, 2.8, -68.5, 2.5, 2.5, STANCA),
    dispare(bloc(31, 3.6, -72.5, 2.5, 2.5, C.roz)),
    bloc(34, 4.4, -76.5, 2.5, 2.5, STANCA),
    dispare(bloc(31, 5.2, -80.5, 2.5, 2.5, C.roz)),
    bloc(31, 5.2, -88, 7, 7, C.turcoaz),                // finalul
  ],

  steaguri: [
    { poz: [-2.2, 0, -32], directie: ÎNAINTE },
    { poz: [-2.2, 0, -58], directie: DREAPTA },
    { poz: [31, 1.2, -55.8], directie: ÎNAINTE },
  ],

  monede: [
    monedaPe(-2, 0, -7),
    monedaPe(2, 0, -11),
    monedaPe(-1, 0, -15),
    monedaPe(2.5, 0, -19),
    ...linieMonede([0, 1, -24], [0, 1, -26], 2),
    monedaPe(0, 0, -38.5),
    monedaPe(1.5, 0, -42.5),
    monedaPe(-1.5, 0, -46.5),
    monedaPe(0, 0, -50.5),
    [10, 1.4, -58],
    monedaPe(17, 0, -58),
    monedaPe(21, 0.6, -58),
    monedaPe(25, 1.2, -58),
    monedaPe(31, 2, -64.25),
    monedaPe(28, 2.8, -68.5),
    monedaPe(31, 3.6, -72.5),
    monedaPe(34, 4.4, -76.5),
    monedaPe(31, 5.2, -80.5),
    ...linieMonede([29, 6.2, -86], [33, 6.2, -86], 3),
  ],

  final: { poz: [31, 5.2, -89], directie: ÎNAINTE },
};
