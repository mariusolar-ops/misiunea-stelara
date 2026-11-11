// NIVELUL 17 – Planeta ocean
// Ești sub apă! Gravitația e mică (plutești), bulele te ridică, curenții marini te împing
// într-o parte, iar pe fundul mării sunt arici de mare care ies și intră (nu-i atinge!).
import type { DefinitieNivel } from './tipuri';
import { bloc, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const NISIP = 0xe0d0a0;
const CORAL = 0xff7a8a;
const CORAL2 = 0xffa05a;

export const nivel17: DefinitieNivel = {
  nume: 'Planeta ocean',
  tema: 'ocean',
  gravitatie: 0.5,
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 8, NISIP),
    bloc(0, 1, -10, 3, 3, CORAL),
    bloc(0, 2.5, -17, 3, 3, CORAL2),
    bloc(5, 2.5, -24, 3, 3, CORAL),
    bloc(0, 3, -32, 6, 6, C.turcoaz),                     // steagul 1
    bloc(0, 11, -44, 5, 5, CORAL2),                       // sus, unde te duc bulele
    bloc(0, 11, -53, 4, 8, NISIP),                        // cu arici de mare
    bloc(0, 11, -62, 6, 6, C.turcoaz),                    // steagul 2
    bloc(0, 11, -70, 2.5, 2.5, CORAL),
    bloc(0, 11, -77, 2.5, 2.5, CORAL2),
    bloc(0, 11, -84, 2.5, 2.5, CORAL),
    bloc(0, 11, -92, 8, 8, C.turcoaz),                    // finalul
  ],

  obstacole: [
    { tip: 'curent', poz: [0, -6, -39], raza: 2, inaltime: 17, forta: 12 },          // coloana de bule
    { tip: 'cristale', poz: [0, 11, -51], dim: [4, 1.4], perioada: 3 },              // arici de mare
    { tip: 'cristale', poz: [0, 11, -55], dim: [4, 1.4], perioada: 3, faza: 0.5 },
    { tip: 'vant', poz: [0, 13, -77], dim: [14, 8, 18], forta: [-4, 0] },            // curent marin
  ],

  indicii: [
    { poz: [0, 3, -32], raza: 3, text: 'Intră în coloana de bule ca să urci!' },
  ],

  steaguri: [
    { poz: [-2, 3, -32], directie: ÎNAINTE },
    { poz: [-2, 11, -62], directie: ÎNAINTE },
  ],

  monede: [
    [0, 3.5, -5], monedaPe(0, 1, -10), [0, 5, -13.5], monedaPe(0, 2.5, -17), [2.5, 5.5, -20.5], monedaPe(5, 2.5, -24),
    ...linieMonede([0, 4, -39], [0, 10, -39], 4),
    monedaPe(0, 11, -44), monedaPe(0, 11, -53),
    monedaPe(0, 11, -70), monedaPe(0, 11, -77), monedaPe(0, 11, -84),
    [0, 14, -73.5], [0, 14, -80.5],
    ...linieMonede([-2.5, 12, -90], [2.5, 12, -90], 3),
  ],

  final: { poz: [0, 11, -93.5], directie: ÎNAINTE },
};
