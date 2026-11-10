// NIVELUL 10 – Asteroidul cu gravitație mică (ideea lui Mihai!)
// Aici gravitația e mică: sari de 2,5 ori mai sus și plutești mult în aer.
// De aceea golurile sunt URIAȘE. Atenție la laserul din mijlocul celui mai mare salt!
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, trambulina, laserX, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const ROCA = 0xa89bc9;
const ROCA2 = 0x8576b0;

export const nivel10: DefinitieNivel = {
  nume: 'Asteroidul cu gravitație mică',
  tema: 'gravitatie',
  gravitatie: 0.4,
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 8, ROCA),
    bloc(0, 2, -12, 3, 3, ROCA2),
    bloc(0, 5, -21, 3, 3, ROCA2),
    bloc(5, 4, -30, 3, 3, ROCA2),
    bloc(0, 4, -40, 6, 6, C.turcoaz),                     // steagul 1
    mobila(bloc(-4, 6, -51, 3, 3, C.portocaliu), [8, 0, 0], 5),
    bloc(0, 9, -61, 3, 3, ROCA2),
    bloc(0, 9, -73, 3, 3, ROCA2),                         // după cel mai mare salt
    bloc(0, 9, -84, 6, 6, C.turcoaz),                     // steagul 2
    trambulina(0, 9, -93, 3, 3, 12),
    bloc(0, 13, -103, 3, 3, ROCA2),
    dispare(bloc(0, 13, -112, 2.5, 2.5, C.roz)),
    dispare(bloc(4, 15, -121, 2.5, 2.5, C.roz)),
    bloc(0, 15, -131, 8, 8, C.turcoaz),                   // finalul
  ],

  obstacole: [
    // laserul din mijlocul saltului mare: sari când e stins!
    laserX(-67, 15.3, -3, 3, { clipeste: { perioada: 3 } }),
  ],

  steaguri: [
    { poz: [-2, 4, -40], directie: ÎNAINTE },
    { poz: [-2, 9, -84], directie: ÎNAINTE },
  ],

  // monedele sunt sus, în arcul săriturilor – le iei din zbor
  monede: [
    [0, 6, -6], [0, 8, -8.5],
    [0, 9, -16.5], monedaPe(0, 5, -21),
    [2.5, 10, -25.5], monedaPe(5, 4, -30),
    [2.5, 9.5, -35],
    [0, 11, -46], monedaPe(0, 6, -51),
    [0, 13.5, -56], monedaPe(0, 9, -61),
    [0, 16.2, -67], monedaPe(0, 9, -73),
    [0, 14, -78.5],
    [0, 13, -93], [0, 15, -97.5], monedaPe(0, 13, -103),
    [0, 18, -107.5], [2, 19, -116.5], monedaPe(4, 15, -121),
    [-2.5, 16, -129], [2.5, 16, -129],
  ],

  final: { poz: [0, 15, -132], directie: ÎNAINTE },
};
