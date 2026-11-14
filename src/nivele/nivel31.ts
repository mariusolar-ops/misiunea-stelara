// NIVELUL 31 – Ceasul cosmic (nivel automat)
// Ești înăuntrul unui ceas uriaș care plutește prin spațiu! Urcă pe pistoanele
// care se ridică și coboară, sari peste limbile ceasului care se învârt pe cadran
// (una încet, alta repede, în sens invers), treci printre pendule, urcă pe ușițele
// cucului care se închid după tine și prinde rotița care alunecă până la final.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const ALAMA = 0xc8a040;
const CUPRU = 0xb86a3a;
const CADRAN = 0xf4ecd8;
const LEMN = 0x8a5a3a;

export const nivel31: DefinitieNivel = {
  nume: 'Ceasul cosmic',
  tema: 'ceas',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, ALAMA),
    // pistoanele: urcă și coboară pe rând
    mobila(bloc(0, 0, -6, 3, 3, CUPRU), [0, 2, 0], 2.4),
    mobila(bloc(0, 1, -10.5, 3, 3, CUPRU), [0, 2, 0], 2.4, 0.33),
    mobila(bloc(0, 2, -15, 3, 3, CUPRU), [0, 2, 0], 2.4, 0.66),
    bloc(0, 4, -20, 4, 4, ALAMA),
    bloc(0, 4, -27, 6, 6, C.turcoaz),                     // steagul 1
    bloc(0, 4, -38, 10, 10, CADRAN),                      // cadranul ceasului
    bloc(0, 4, -50, 2.5, 10, ALAMA),                      // coridorul cu pendule
    bloc(0, 4, -60, 6, 6, C.turcoaz),                     // steagul 2
    // ușițele cucului: se închid după ce treci
    dispare(bloc(-2, 5, -66, 2.5, 2.5, LEMN)),
    dispare(bloc(2, 6, -70, 2.5, 2.5, LEMN)),
    dispare(bloc(-2, 7, -74, 2.5, 2.5, LEMN)),
    mobila(bloc(-3, 8, -80, 3, 3, CUPRU), [6, 0, 0], 3.5),  // rotița care alunecă
    bloc(0, 8, -87, 8, 8, C.turcoaz),                     // finalul – a bătut ora!
  ],

  obstacole: [
    // limbile ceasului: cea mică încet, cea mare repede și invers
    { tip: 'laserRotativ', centru: [0, 4.45, -38], raza: 4.6, viteza: 0.6 },
    { tip: 'laserRotativ', centru: [0, 4.45, -38], raza: 4.6, viteza: -1.4, faza: Math.PI },
    // pendulele
    { tip: 'pendul', pivot: [0, 8.4, -48], lungime: 3.8, amplitudine: 0.95, perioada: 2.4, axa: 'x' },
    { tip: 'pendul', pivot: [0, 8.4, -52.5], lungime: 3.8, amplitudine: 0.95, perioada: 2.4, faza: 0.5, axa: 'x' },
  ],

  indicii: [
    { poz: [0, 0, -1], raza: 2.5, text: 'Sari pe piston când e jos!' },
    { poz: [0, 4, -27], raza: 2.5, text: 'Sari peste limbile ceasului!' },
  ],

  steaguri: [
    { poz: [-2, 4, -27], directie: ÎNAINTE },
    { poz: [-2, 4, -60], directie: ÎNAINTE },
  ],

  monede: [
    [0, 2.5, -6], [0, 3.5, -10.5], [0, 4.5, -15], monedaPe(0, 4, -20),
    monedaPe(-3.5, 4, -34.5), monedaPe(3.5, 4, -34.5), monedaPe(-3.5, 4, -41.5), monedaPe(3.5, 4, -41.5),
    ...linieMonede([0, 5, -46], [0, 5, -54], 3),
    monedaPe(-2, 5, -66), monedaPe(2, 6, -70), monedaPe(-2, 7, -74),
    [0, 9.2, -80],
    ...linieMonede([-2.5, 9, -85], [2.5, 9, -85], 3),
  ],

  final: { poz: [0, 8, -90.5], directie: ÎNAINTE },
};
