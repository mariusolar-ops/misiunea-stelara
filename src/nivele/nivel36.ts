// NIVELUL 36 – Fabrica de vreme (nivel automat)
// Aici se face vremea pentru toate planetele! Fiecare cameră are altă vreme:
// fulgere care clipesc, zăpadă pe care aluneci, vânt care te împinge,
// un nor de ploaie care te ridică și nori pufoși care se destramă sub picioare.
// La final te așteaptă curcubeul.
import type { DefinitieNivel } from './tipuri';
import { bloc, dispare, gheata, laserX, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const NOR = 0xe8f0ff;
const NOR_GRI = 0x9aa4b8;
const ZAPADA = 0xf4fbff;

export const nivel36: DefinitieNivel = {
  nume: 'Fabrica de vreme',
  tema: 'vreme',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, NOR),
    bloc(0, 0, -11, 4, 12, NOR_GRI),                       // camera cu fulgere
    bloc(0, 0, -22, 6, 6, C.turcoaz),                      // steagul 1
    gheata(0, 0, -31, 3, 8),                               // camera cu zăpadă
    { ...gheata(0, 1, -38.5, 3, 3), culoare: ZAPADA },
    bloc(0, 1, -46, 3.6, 10, NOR_GRI),                     // camera cu vânt
    bloc(0, 1, -55, 6, 6, C.turcoaz),                      // steagul 2
    bloc(0, 7, -66.5, 4, 5, NOR),                          // sus, unde te duce norul de ploaie
    // nori pufoși care se destramă
    dispare(bloc(-2, 7, -73, 2.5, 2.5, NOR)),
    dispare(bloc(2, 7, -77, 2.5, 2.5, NOR)),
    dispare(bloc(-2, 7, -81, 2.5, 2.5, NOR)),
    bloc(0, 7, -88, 8, 8, C.turcoaz),                      // curcubeul de la final
  ],

  obstacole: [
    // fulgerele clipesc pe rând
    laserX(-7.5, 0.6, -2, 2, { clipeste: { perioada: 1.8, pornit: 0.45 } }),
    laserX(-11, 0.6, -2, 2, { clipeste: { perioada: 1.8, pornit: 0.45, faza: 0.33 } }),
    laserX(-14.5, 0.6, -2, 2, { clipeste: { perioada: 1.8, pornit: 0.45, faza: 0.66 } }),
    // vântul te împinge spre dreapta
    { tip: 'vant', poz: [0, 3, -46], dim: [14, 6, 10], forta: [2.5, 0] },
    // norul de ploaie te ridică
    { tip: 'curent', poz: [0, -7, -62], raza: 2, inaltime: 13.2, forta: 14 },
  ],

  indicii: [
    { poz: [0, 0, -2], raza: 2.5, text: 'Treci când fulgerul se stinge!' },
    { poz: [0, 1, -55], raza: 2.5, text: 'Intră sub norul de ploaie – te ridică!' },
  ],

  steaguri: [
    { poz: [-2, 0, -22], directie: ÎNAINTE },
    { poz: [-2, 1, -55], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([0, 1, -6], [0, 1, -16], 3),
    monedaPe(0, 0, -28), monedaPe(0, 0, -34), monedaPe(0, 1, -38.5),
    ...linieMonede([0, 2, -42], [0, 2, -50], 3),
    ...linieMonede([0, 3, -62], [0, 6, -62], 2), monedaPe(0, 7, -66.5),
    monedaPe(-2, 7, -73), monedaPe(2, 7, -77), monedaPe(-2, 7, -81),
    ...linieMonede([-2.5, 8, -86], [2.5, 8, -86], 3),
  ],

  final: { poz: [0, 7, -91.5], directie: ÎNAINTE },
};
