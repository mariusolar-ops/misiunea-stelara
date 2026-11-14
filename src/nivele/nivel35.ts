// NIVELUL 35 – Mina de pe asteroid (nivel automat)
// O mină veche de cristale, săpată într-un asteroid! Treci prin tunelul din care
// cad pietricele (uită-te la umbra lor!), urcă în vagonetul care merge pe șine,
// apoi în liftul minei, ferește-te de cristalele care ies din pământ
// și treci repede peste scândurile podului care cad.
import type { DefinitieNivel } from './tipuri';
import type { DefMeteor } from '../lume/obstacole/Meteor';
import { bloc, mobila, dispare, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const PIATRA = 0x6a5a4a;
const PIATRA2 = 0x7a6a58;
const VAGONET = 0x9a6a3a;
const LIFT = 0xc8a040;
const SCANDURA = 0xa8784a;

/** O pietricică ce cade din tavanul tunelului, drept în jos */
function pietricica(x: number, z: number, perioada: number, faza = 0): DefMeteor {
  return { tip: 'meteor', de: [x, 11, z], la: [x, -3, z], raza: 0.8, perioada, faza };
}

export const nivel35: DefinitieNivel = {
  nume: 'Mina de pe asteroid',
  tema: 'mina',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, PIATRA),
    bloc(0, 0, -12, 4, 16, PIATRA2),                       // tunelul cu pietricele
    bloc(0, 0, -24, 6, 6, C.turcoaz),                      // steagul 1
    mobila(bloc(0, 0, -31, 3, 4, VAGONET), [0, 0, -14], 7),// vagonetul pe șine
    bloc(0, 0, -51, 4, 4, PIATRA),
    mobila(bloc(0, 0, -57, 3, 3, LIFT), [0, 6, 0], 5),     // liftul minei
    bloc(0, 6, -62, 4, 4, PIATRA2),
    bloc(0, 6, -70, 4, 8, PIATRA),                         // cristalele care ies din pământ
    bloc(0, 6, -78, 6, 6, C.turcoaz),                      // steagul 2
    // podul cu scânduri care cad
    dispare(bloc(0, 6, -84, 3, 2, SCANDURA)),
    dispare(bloc(0, 6, -87, 3, 2, SCANDURA)),
    dispare(bloc(0, 6, -90, 3, 2, SCANDURA)),
    bloc(0, 6, -96, 8, 8, C.turcoaz),                      // ieșirea din mină
  ],

  obstacole: [
    pietricica(0, -8, 1.8),
    pietricica(-1, -12.5, 2.2, 0.4),
    pietricica(1, -17, 2, 0.7),
    { tip: 'cristale', poz: [0, 6, -68], dim: [4, 1.5], perioada: 2.8 },
    { tip: 'cristale', poz: [0, 6, -72], dim: [4, 1.5], perioada: 2.8, faza: 0.5 },
  ],

  indicii: [
    { poz: [0, 0, -2], raza: 2.5, text: 'Ai grijă la pietricelele care cad!' },
    { poz: [0, 0, -24], raza: 2.5, text: 'Urcă în vagonet!' },
  ],

  steaguri: [
    { poz: [-2, 0, -24], directie: ÎNAINTE },
    { poz: [-2, 6, -78], directie: ÎNAINTE },
  ],

  monede: [
    monedaPe(-1, 0, -6), monedaPe(1, 0, -10), monedaPe(-1, 0, -15), monedaPe(1, 0, -19),
    [0, 1.2, -31], [0, 1.2, -38], [0, 1.2, -45], monedaPe(0, 0, -51),
    ...linieMonede([0, 2, -57], [0, 6, -57], 3), monedaPe(0, 6, -62),
    monedaPe(0, 6, -70),
    monedaPe(0, 6, -84), monedaPe(0, 6, -87), monedaPe(0, 6, -90),
    ...linieMonede([-2.5, 7, -94], [2.5, 7, -94], 3),
  ],

  final: { poz: [0, 6, -99.5], directie: ÎNAINTE },
};
