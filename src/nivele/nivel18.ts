// NIVELUL 18 – Vulcanul care erupe
// Marea de lavă de dedesubt URCĂ și COBOARĂ. Când e jos, grăbește-te pe drumul de jos;
// când începe să urce, fugi sus, la steaguri (acolo lava nu ajunge niciodată).
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, lavaCareUrca, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const STANCA = 0x4a3438;
const STANCA2 = 0x6a4a44;

export const nivel18: DefinitieNivel = {
  nume: 'Vulcanul care erupe',
  tema: 'vulcan',
  start: [0, 7, 1],
  directieStart: ÎNAINTE,

  platforme: [
    // marea de lavă: urcă de la -1 până la 6 și coboară, în 16 secunde
    lavaCareUrca(0, -1, -50, 70, 130, 7, 16),
    bloc(0, 7, 0, 8, 8, STANCA),                          // start, deasupra lavei
    // drumul de jos 1
    bloc(0, 2, -9, 3, 3, STANCA2),
    bloc(0, 2, -14.5, 3, 3, STANCA2),
    bloc(3, 2, -20, 3, 3, STANCA2),
    bloc(0, 3, -25.5, 3, 3, STANCA2),
    bloc(0, 4.5, -30.5, 3, 3, STANCA),
    bloc(0, 6, -35, 3, 3, STANCA),
    bloc(0, 7.5, -41, 6, 6, C.turcoaz),                   // steagul 1 (sigur)
    // drumul de jos 2
    bloc(0, 3, -49, 3, 3, STANCA2),
    bloc(-4, 3, -54, 3, 3, STANCA2),
    mobila(bloc(0, 3, -60, 3, 3, C.portocaliu), [0, 0, -4], 3),
    bloc(0, 4.5, -68, 3, 3, STANCA),
    bloc(0, 6, -73, 3, 3, STANCA),
    bloc(0, 7.5, -79, 6, 6, C.turcoaz),                   // steagul 2 (sigur)
    // urcarea finală
    bloc(0, 8.3, -85.5, 2.5, 2.5, STANCA),
    bloc(3, 9.1, -89.5, 2.5, 2.5, STANCA),
    bloc(0, 9.9, -93.5, 2.5, 2.5, STANCA),
    bloc(0, 9.9, -101, 7, 7, C.turcoaz),                  // finalul
  ],

  indicii: [
    { poz: [0, 7, -1], raza: 3, text: 'Lava urcă și coboară! Treci când e jos.' },
  ],

  steaguri: [
    { poz: [-2, 7.5, -41], directie: ÎNAINTE },
    { poz: [-2, 7.5, -79], directie: ÎNAINTE },
  ],

  monede: [
    monedaPe(0, 2, -9), monedaPe(0, 2, -14.5), monedaPe(3, 2, -20), monedaPe(0, 3, -25.5), monedaPe(0, 4.5, -30.5), monedaPe(0, 6, -35),
    monedaPe(0, 3, -49), monedaPe(-4, 3, -54), [0, 4.2, -62], monedaPe(0, 4.5, -68), monedaPe(0, 6, -73),
    monedaPe(0, 8.3, -85.5), monedaPe(3, 9.1, -89.5), monedaPe(0, 9.9, -93.5),
    ...linieMonede([-2.5, 10.9, -99], [2.5, 10.9, -99], 3),
  ],

  final: { poz: [0, 9.9, -102.5], directie: ÎNAINTE },
};
