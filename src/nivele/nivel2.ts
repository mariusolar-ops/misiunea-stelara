// NIVELUL 2 – Inelul de asteroizi
// Nou: platforme care se mișcă (stânga-dreapta, înainte-înapoi și lifturi care urcă).
// Sfat: așteaptă platforma să vină spre tine, apoi sari.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const DREAPTA = Math.PI / 2;
const PIATRA = 0x9a8878;      // culoare de asteroid
const PIATRA2 = 0x7d6f63;

export const nivel2: DefinitieNivel = {
  nume: 'Inelul de asteroizi',
  tema: 'asteroizi',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    // --- Partea 1: pietre, unele se plimbă stânga-dreapta ---
    bloc(0, 0, 0, 8, 8, PIATRA),
    bloc(0, 0, -7, 3, 3, PIATRA2),
    mobila(bloc(-3, 0, -12.5, 3, 3, C.portocaliu), [6, 0, 0], 4),
    bloc(0, 0, -18, 3, 3, PIATRA2),
    mobila(bloc(-3, 0, -23.5, 3, 3, C.portocaliu), [6, 0, 0], 3.5, 0.5),
    bloc(0, 0, -31, 7, 7, C.turcoaz),                       // steagul 1

    // --- Partea 2: liftul și platforma care vine și pleacă ---
    mobila(bloc(0, 0, -37.5, 3, 3, C.mov), [0, 4, 0], 5),   // lift
    bloc(0, 4, -43, 3, 4, PIATRA),
    bloc(4, 4.6, -48, 2.5, 2.5, PIATRA2),
    mobila(bloc(4, 4.6, -53, 2.5, 2.5, C.portocaliu), [0, 0, -5], 4),
    bloc(4, 4.6, -63, 3, 3, PIATRA),
    bloc(4, 4.6, -70, 7, 7, C.turcoaz),                     // steagul 2

    // --- Partea 3: spre dreapta, trei pietre care alunecă pe rând ---
    mobila(bloc(10, 4.6, -72, 2.5, 2.5, C.portocaliu), [0, 0, 4], 3),
    mobila(bloc(15, 4.6, -68, 2.5, 2.5, C.portocaliu), [0, 0, -4], 3),
    mobila(bloc(20, 4.6, -72, 2.5, 2.5, C.portocaliu), [0, 0, 4], 3),
    bloc(26, 5.2, -70, 4, 4, PIATRA),
    bloc(33, 5.2, -70, 7, 7, C.turcoaz),                    // steagul 3

    // --- Partea 4: liftul mare și ultima piatră care te duce la poartă ---
    bloc(33, 6, -76.5, 2.5, 2.5, PIATRA2),
    mobila(bloc(33, 6, -81, 2.5, 2.5, C.mov), [0, 4, 0], 4), // lift
    bloc(33, 10, -86, 3, 3, PIATRA),
    mobila(bloc(29, 10, -91, 2.5, 2.5, C.portocaliu), [-6, 0, 0], 4),
    bloc(18, 10, -91, 7, 7, C.turcoaz),                     // finalul
  ],

  steaguri: [
    { poz: [-2.2, 0, -31], directie: ÎNAINTE },
    { poz: [1.8, 4.6, -70], directie: DREAPTA },
    { poz: [33, 5.2, -67.8], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([0, 1, -2], [0, 1, -3.5], 2),
    monedaPe(0, 0, -7),
    [0, 1.2, -12.5],
    monedaPe(0, 0, -18),
    [0, 1.2, -23.5],
    ...linieMonede([0, 6.5, -36.5], [0, 6.5, -38.5], 2),   // sus, deasupra liftului
    monedaPe(0, 4, -43),
    monedaPe(4, 4.6, -48),
    [4, 5.8, -55.5],
    monedaPe(4, 4.6, -63),
    [10, 5.8, -70],
    [15, 5.8, -70],
    [20, 5.8, -70],
    monedaPe(26, 5.2, -70),
    monedaPe(33, 6, -76.5),
    [33, 9, -81],
    monedaPe(33, 10, -86),
    [26, 11.2, -91],
    ...linieMonede([20.5, 11, -93], [20.5, 11, -89], 3),
  ],

  final: { poz: [17, 10, -91], directie: DREAPTA },
};
