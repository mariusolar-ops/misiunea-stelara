// NIVELUL 25 – Atelierul de rachete (nivel automat)
// Un atelier uriaș unde se construiesc rachete: mergi CONTRA unei benzi rulante,
// urci cu liftul, treci pe o grindă printre cârligele macaralei care se leagănă,
// sari pe plăcile de metal care se desprind și te strecori printr-un scanner laser.
// La final, rampa de lansare te aruncă sus, la racheta lui Mihai!
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, banda, trambulina, laserX, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const METAL = 0x8a93a8;
const GRINDA = 0xffb020;     // galben de șantier
const PLACA = 0x5a6278;
const RAMPA = 0xff5f5f;

export const nivel25: DefinitieNivel = {
  nume: 'Atelierul de rachete',
  tema: 'atelier',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 8, METAL),
    banda(0, 0, -9, 3, 8, 0, 2.5),                        // banda merge ÎNAPOI – fugi contra ei!
    bloc(0, 0, -16, 4, 4, METAL),
    mobila(bloc(0, 0, -21, 3, 3, GRINDA), [0, 6, 0], 5),   // liftul
    bloc(0, 6, -26, 4, 4, METAL),
    bloc(0, 6, -32, 6, 6, C.turcoaz),                     // steagul 1
    bloc(0, 6, -42, 2, 12, GRINDA),                       // grinda cu cârlige
    dispare(bloc(-2, 6, -52, 2.5, 2.5, PLACA)),           // plăcile se desprind!
    dispare(bloc(2, 6, -56, 2.5, 2.5, PLACA)),
    dispare(bloc(-2, 6, -60, 2.5, 2.5, PLACA)),
    bloc(0, 6, -66, 6, 6, C.turcoaz),                     // steagul 2
    bloc(0, 6, -73, 4, 6, METAL),                         // scannerul
    trambulina(0, 6, -78, 4, 4, 20, RAMPA),               // rampa de lansare
    bloc(0, 11, -86, 8, 8, C.turcoaz),                    // la rachetă
  ],

  obstacole: [
    // cârligele macaralei se leagănă de-a curmezișul grinzii
    { tip: 'pendul', pivot: [0, 10.4, -39], lungime: 3.8, amplitudine: 0.95, perioada: 2.6, axa: 'x' },
    { tip: 'pendul', pivot: [0, 10.4, -44], lungime: 3.8, amplitudine: 0.95, perioada: 2.6, faza: 0.5, axa: 'x' },
    // scannerul: o rază care urcă și coboară, și una care clipește
    laserX(-71.5, 6.4, -2, 2, { miscare: { cat: [0, 2.2, 0], perioada: 3 } }),
    laserX(-74.5, 7, -2, 2, { clipeste: { perioada: 2.2 } }),
  ],

  indicii: [
    { poz: [0, 0, -3], raza: 2.5, text: 'Banda merge înapoi – fugi contra ei!' },
    { poz: [0, 6, -66], raza: 2.5, text: 'Treci prin scanner când raza e sus!' },
  ],

  steaguri: [
    { poz: [-2, 6, -32], directie: ÎNAINTE },
    { poz: [-2, 6, -66], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([0, 1, -6], [0, 1, -12], 3), monedaPe(0, 0, -16),
    ...linieMonede([0, 2, -21], [0, 6, -21], 3), monedaPe(0, 6, -26),
    ...linieMonede([0, 7, -37], [0, 7, -47], 4),
    monedaPe(-2, 6, -52), monedaPe(2, 6, -56), monedaPe(-2, 6, -60),
    [0, 9, -78],
    ...linieMonede([-2.5, 12, -84], [2.5, 12, -84], 3),
  ],

  final: { poz: [0, 11, -89.5], directie: ÎNAINTE },
};
