// NIVELUL 8 – Fortăreața robotului
// Cel mai greu nivel normal: lasere rotative, pendule pe o punte îngustă, gheață cu cristale,
// curent de aer, lasere care clipesc și blocuri care dispar.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, gheata, laserX, laserZ, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const DREAPTA = Math.PI / 2;
const METAL = 0x4a4258;
const METAL2 = 0x6a5f7d;

export const nivel8: DefinitieNivel = {
  nume: 'Fortăreața robotului',
  tema: 'fortareata',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    // --- Partea 1: laserul rotativ și platforma mobilă ---
    bloc(0, 0, 0, 8, 8, METAL),
    bloc(0, 0, -10, 8, 8, METAL2),
    bloc(0, 1.5, -10, 1, 1, METAL, 1.5),                 // stâlpul laserului
    mobila(bloc(-3, 0, -18.5, 2.5, 2.5, C.portocaliu), [6, 0, 0], 3.5),
    bloc(0, 0, -23.5, 3, 3, METAL2),
    bloc(0, 0, -30, 6, 6, C.turcoaz),                    // steagul 1

    // --- Partea 2: puntea cu pendule ---
    bloc(0, 0, -40, 2, 12, METAL2),
    bloc(0, 0, -50, 5, 5, METAL),
    bloc(0, 0, -58, 6, 6, C.turcoaz),                    // steagul 2

    // --- Partea 3: spre dreapta – gheață, cristale, curent de aer ---
    gheata(8, 0, -58, 8, 4),
    bloc(19, 6, -58, 5, 4, METAL2),
    bloc(25, 6, -58, 3, 3, METAL),
    bloc(32, 6, -58, 6, 6, C.turcoaz),                   // steagul 3

    // --- Partea 4: ultima cameră și blocurile care dispar ---
    bloc(32, 6, -67, 6, 10, METAL2),
    bloc(32, 7.5, -66, 1, 1, METAL, 1.5),                // stâlpul laserului
    dispare(bloc(32, 6.6, -75.5, 2.5, 2.5, C.roz)),
    dispare(bloc(32, 7.2, -79.5, 2.5, 2.5, C.roz)),
    bloc(32, 7.2, -87, 7, 7, C.turcoaz),                 // finalul
  ],

  obstacole: [
    { tip: 'laserRotativ', centru: [0, 0.45, -10], raza: 3.8, viteza: 2.0 },
    { tip: 'pendul', pivot: [0, 4.6, -37], lungime: 4, amplitudine: 0.9, perioada: 2.2, axa: 'x' },
    { tip: 'pendul', pivot: [0, 4.6, -41], lungime: 4, amplitudine: 0.9, perioada: 2.2, faza: 0.33, axa: 'x' },
    { tip: 'pendul', pivot: [0, 4.6, -45], lungime: 4, amplitudine: 0.9, perioada: 2.2, faza: 0.66, axa: 'x' },
    laserX(-50, 1.0, -2.5, 2.5, { clipeste: { perioada: 2.2 } }),
    { tip: 'cristale', poz: [8, 0, -58], dim: [1.6, 4], perioada: 2.6 },
    { tip: 'curent', poz: [14.5, -6, -58], raza: 2, inaltime: 13.2, forta: 14 },
    // peste golul de după curent: sari când laserul e stins
    laserZ(22.25, 7.2, -59.5, -56.5, { clipeste: { perioada: 2 } }),
    { tip: 'laserRotativ', centru: [32, 6.45, -66], raza: 2.9, viteza: -2.4 },
    laserX(-70.5, 7.0, 29, 35, { clipeste: { perioada: 2 } }),
  ],

  steaguri: [
    { poz: [-2, 0, -30], directie: ÎNAINTE },
    { poz: [-2, 0, -58], directie: DREAPTA },
    { poz: [32, 6, -55.8], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([-3, 1, -7], [3, 1, -7], 3),
    ...linieMonede([-3, 1, -13], [3, 1, -13], 3),
    [0, 1.2, -18.5],
    monedaPe(0, 0, -23.5),
    ...linieMonede([0, 1, -35], [0, 1, -45], 4),
    monedaPe(0, 0, -50),
    ...linieMonede([5, 1, -58], [11, 1, -58], 3),
    ...linieMonede([14.5, 2, -58], [14.5, 7, -58], 3),
    monedaPe(19, 6, -58),
    monedaPe(25, 6, -58),
    ...linieMonede([30, 7, -63], [30, 7, -71], 3),
    monedaPe(32, 6.6, -75.5),
    monedaPe(32, 7.2, -79.5),
    ...linieMonede([30, 8.2, -85], [34, 8.2, -85], 3),
  ],

  final: { poz: [32, 7.2, -88], directie: ÎNAINTE },
};
