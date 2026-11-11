// NIVELUL 12 – Pereții magnetici (ideea lui Mihai: „să mergi pe pereți”)
// Pereții MOV sunt magnetici: sari spre ei și te lipești. Cât alergi pe lângă ei, nu cazi.
// Apasă SARI ca să sari de pe perete spre partea cealaltă.
//  1) un perete lung lângă un gol mare  2) pereți pe rând, stânga–dreapta
//  3) „hornul”: urci sărind de pe un perete pe altul  4) alergare pe perete, cu laser
import type { DefinitieNivel } from './tipuri';
import { bloc, perete, laserX, linieMonede, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const METAL = 0x4a3f6a;

export const nivel12: DefinitieNivel = {
  nume: 'Pereții magnetici',
  tema: 'magnetic',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 8, METAL),
    // 1) golul mare, cu un perete magnetic în stânga
    perete(-2.8, -2, -10.5, 0.6, 7, 14),
    bloc(0, 0, -20, 6, 6, C.turcoaz),                   // steagul 1

    // 2) pereți pe rând: stânga, dreapta, stânga
    perete(-2.8, -3, -28, 0.6, 9, 8),
    perete(2.8, -3, -35, 0.6, 9, 8),
    perete(-2.8, -3, -42, 0.6, 9, 8),
    bloc(0, 0, -50, 6, 6, C.turcoaz),                   // steagul 2

    // 3) hornul: doi pereți față în față – urci sărind de pe unul pe altul
    bloc(0, 0, -58, 3.2, 6, METAL),
    perete(-1.9, 0, -58, 0.6, 14, 6),
    perete(1.9, 0, -58, 0.6, 14, 6),
    bloc(0, 14, -64.5, 9, 5, C.turcoaz),                // steagul 3, sus (lată, ca să prinzi ușor ieșirea din horn)

    // 4) alergare pe un perete lung, cu un laser care clipește
    perete(2.8, 10, -75, 0.6, 8, 14),
    bloc(0, 14, -87, 7, 7, C.turcoaz),                  // finalul
  ],

  obstacole: [
    laserX(-75, 15.6, 1.2, 2.5, { clipeste: { perioada: 2.2, pornit: 0.4 } }),
  ],

  indicii: [
    { poz: [0, 0, -2], raza: 3, text: 'Sari spre peretele mov și aleargă pe el!' },
    { poz: [0, 0, -58], raza: 2, text: 'Sari de pe un perete pe altul ca să urci!' },
  ],

  steaguri: [
    { poz: [-2, 0, -20], directie: ÎNAINTE },
    { poz: [-2, 0, -50], directie: ÎNAINTE },
    { poz: [-2, 14, -64.5], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([-1.9, 2, -6], [-1.9, 2, -15], 4),        // pe lângă primul perete
    ...linieMonede([-1.9, 2, -26], [-1.9, 2, -30], 2),
    ...linieMonede([1.9, 2.5, -33], [1.9, 2.5, -37], 2),
    ...linieMonede([-1.9, 3, -40], [-1.9, 3, -44], 2),
    ...linieMonede([0, 3, -58], [0, 12, -58], 4),            // în horn
    ...linieMonede([1.9, 15.5, -70], [1.9, 15.5, -80], 4),
    ...linieMonede([-2.5, 15, -86], [2.5, 15, -86], 3),
  ],

  final: { poz: [0, 14, -88.5], directie: ÎNAINTE },
};
