// NIVELUL 1 – Baza de pe Lună
// Nivel ușor, care te învață jocul: sărituri peste goluri, scări, pietre în zig-zag,
// o bârnă îngustă și un zid de sărit. Trei steaguri de checkpoint.
import type { DefinitieNivel } from './tipuri';
import { bloc, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;      // spre -z
const DREAPTA = Math.PI / 2;  // spre +x

export const nivel1: DefinitieNivel = {
  nume: 'Baza de pe Lună',
  tema: 'luna',
  start: [0, 0, 2],
  directieStart: ÎNAINTE,

  platforme: [
    // --- Partea 1: start, goluri mici și scări ---
    bloc(0, 0, 0, 10, 10, C.gri),
    bloc(0, 0, -8.5, 3, 3, C.lime),
    bloc(0, 0, -13.5, 3, 3, C.lime),
    bloc(0, 1, -18.5, 4, 3, C.portocaliu),
    bloc(0, 2, -22.5, 4, 3, C.portocaliu),
    bloc(0, 2, -29, 7, 7, C.turcoaz),            // steagul 1
    bloc(-6, 3.5, -29, 2, 2, C.roz),             // secret: monede bonus

    // --- Partea 2: zig-zag și bârna îngustă ---
    bloc(3.5, 2.6, -36, 2.5, 2.5, C.gri),
    bloc(0, 3.2, -40, 2.5, 2.5, C.gri),
    bloc(-3.5, 3.8, -44, 2.5, 2.5, C.gri),
    bloc(0, 4.4, -48, 2.5, 2.5, C.gri),
    bloc(0, 4.4, -54.5, 1.2, 8, C.roz),          // bârna
    bloc(0, 4.4, -62.5, 7, 7, C.turcoaz),        // steagul 2

    // --- Partea 3: spre dreapta, cu un zid de sărit ---
    bloc(7, 5, -62.5, 2.5, 2.5, C.lime),
    bloc(11, 5.6, -62.5, 2.5, 2.5, C.lime),
    bloc(15, 6.2, -62.5, 2.5, 2.5, C.lime),
    bloc(21, 6.2, -62.5, 6, 4, C.gri),
    bloc(21, 7.4, -62.5, 1, 4, C.portocaliu, 1.2), // zidul
    bloc(29, 6.2, -62.5, 7, 7, C.turcoaz),       // steagul 3

    // --- Partea 4: stâlpi tot mai sus, până la poartă ---
    bloc(29, 7, -68.5, 2, 2, C.mov),
    bloc(29, 7.8, -72.5, 2, 2, C.mov),
    bloc(25.5, 8.6, -75, 2, 2, C.mov),
    bloc(21.5, 9.4, -75, 2, 2, C.mov),
    bloc(14, 9.4, -75, 8, 8, C.turcoaz),         // finalul
  ],

  steaguri: [
    { poz: [-2.2, 2, -29], directie: ÎNAINTE },
    { poz: [-2.2, 4.4, -62.5], directie: DREAPTA },
    { poz: [29, 6.2, -60.2], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([0, 1, -1], [0, 1, -4], 3),
    monedaPe(0, 0, -8.5),
    [0, 2.2, -11],                               // în aer, între pietre
    monedaPe(0, 0, -13.5),
    monedaPe(0, 1, -18.5),
    monedaPe(0, 2, -22.5),
    ...linieMonede([-6, 4.5, -28.4], [-6, 4.5, -29.6], 3), // bonusul secret
    monedaPe(3.5, 2.6, -36),
    monedaPe(0, 3.2, -40),
    monedaPe(-3.5, 3.8, -44),
    monedaPe(0, 4.4, -48),
    ...linieMonede([0, 5.4, -51.5], [0, 5.4, -57.5], 4),
    monedaPe(7, 5, -62.5),
    monedaPe(11, 5.6, -62.5),
    monedaPe(15, 6.2, -62.5),
    [21, 8.9, -62.5],                            // deasupra zidului
    monedaPe(29, 7, -68.5),
    monedaPe(29, 7.8, -72.5),
    monedaPe(25.5, 8.6, -75),
    monedaPe(21.5, 9.4, -75),
  ],

  final: { poz: [12, 9.4, -75], directie: DREAPTA },
};
