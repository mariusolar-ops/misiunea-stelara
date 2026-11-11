// NIVELUL 15 – Valea meteoriților
// Meteoriți uriași se rostogolesc spre tine! Ferește-te în lateral, ascunde-te în nișe
// sau sari la momentul potrivit. Dacă te lovește unul, te împinge (și poți cădea).
import type { DefinitieNivel } from './tipuri';
import type { DefMeteor } from '../lume/obstacole/Meteor';
import { bloc, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const PIATRA = 0x6a5a5a;
const PIATRA2 = 0x8a7464;

function meteor(de: [number, number, number], la: [number, number, number], perioada: number, faza = 0, raza = 1.1): DefMeteor {
  return { tip: 'meteor', de, la, raza, perioada, faza };
}

export const nivel15: DefinitieNivel = {
  nume: 'Valea meteoriților',
  tema: 'meteori',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 8, PIATRA),
    // 1) podul lung, cu meteoriți pe două benzi și nișe în lateral unde te poți ascunde
    bloc(0, 0, -15.5, 8, 23, PIATRA2),
    bloc(-5.5, 0, -12, 3, 3, PIATRA), bloc(5.5, 0, -12, 3, 3, PIATRA),
    bloc(-5.5, 0, -21, 3, 3, PIATRA), bloc(5.5, 0, -21, 3, 3, PIATRA),
    bloc(0, 0, -32, 6, 6, C.turcoaz),                    // steagul 1
    // 2) pietre în linie, cu meteoriți care trec prin lateral
    bloc(0, 0, -39.5, 3, 3, PIATRA2),
    bloc(0, 0, -45, 3, 3, PIATRA2),
    bloc(0, 0, -50.5, 3, 3, PIATRA2),
    bloc(0, 0, -58, 6, 6, C.turcoaz),                    // steagul 2
    // 3) scara pe care se rostogolesc meteoriții în jos
    ...[0, 1, 2, 3, 4, 5].map((k) => bloc(0, 0.8 * k, -64 - k * 3, 6, 3, k % 2 ? PIATRA : PIATRA2)),
    bloc(0, 4.8, -85, 8, 8, C.turcoaz),                  // finalul
  ],

  obstacole: [
    meteor([-2, 1.1, -27], [-2, 1.1, -5], 3),
    meteor([2, 1.1, -27], [2, 1.1, -5], 3.4, 0.5),
    meteor([-14, 1.1, -45], [14, 1.1, -45], 2.6),
    meteor([14, 1.1, -50.5], [-14, 1.1, -50.5], 2.9, 0.4),
    meteor([-1.5, 6.2, -82], [-1.5, 1.2, -62], 2.8),
    meteor([1.5, 6.2, -82], [1.5, 1.2, -62], 2.8, 0.5),
  ],

  indicii: [
    { poz: [0, 0, -3], raza: 3, text: 'Atenție la meteoriți! Ascunde-te în nișele din lateral.' },
  ],

  steaguri: [
    { poz: [-2, 0, -32], directie: ÎNAINTE },
    { poz: [-2, 0, -58], directie: ÎNAINTE },
  ],

  monede: [
    monedaPe(-5.5, 0, -12), monedaPe(5.5, 0, -12), monedaPe(-5.5, 0, -21), monedaPe(5.5, 0, -21),
    ...linieMonede([0, 1, -8], [0, 1, -24], 5),
    monedaPe(0, 0, -39.5), monedaPe(0, 0, -45), monedaPe(0, 0, -50.5),
    ...[0, 1, 2, 3, 4, 5].map((k) => monedaPe(k % 2 ? 2.2 : -2.2, 0.8 * k, -64 - k * 3)),
    ...linieMonede([-2.5, 5.8, -83], [2.5, 5.8, -83], 3),
  ],

  final: { poz: [0, 4.8, -86.5], directie: ÎNAINTE },
};
