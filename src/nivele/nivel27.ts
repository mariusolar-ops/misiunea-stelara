// NIVELUL 27 – Furtuna de nisip de pe Marte (nivel automat)
// Pe planeta roșie bate vântul! Treci pe un pod îngust în timp ce furtuna
// te împinge într-o parte, lasă-te ridicat de un vârtej de praf, sari pe pietrele
// care se scufundă în nisip și ajungi la roverul care te așteaptă la final.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const NISIP = 0xd0703a;
const STANCA = 0x9a4a2a;
const PIATRA = 0x7a5a4a;

export const nivel27: DefinitieNivel = {
  nume: 'Furtuna de nisip de pe Marte',
  tema: 'marte',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, NISIP),
    bloc(0, 0, -8, 4, 6, NISIP),
    bloc(0, 1, -14, 3, 3, STANCA),
    bloc(0, 2, -19, 3, 3, STANCA),
    bloc(0, 2, -28, 3.6, 12, STANCA),                       // podul bătut de vânt
    bloc(0, 2, -39, 6, 6, C.turcoaz),                     // steagul 1
    bloc(0, 8, -50.5, 4, 5, STANCA),                      // sus, unde te duce vârtejul
    dispare(bloc(-2, 8, -57, 2.5, 2.5, PIATRA)),          // pietrele se scufundă!
    dispare(bloc(2, 8, -61, 2.5, 2.5, PIATRA)),
    dispare(bloc(-2, 8, -65, 2.5, 2.5, PIATRA)),
    bloc(0, 8, -71, 6, 6, C.turcoaz),                     // steagul 2
    mobila(bloc(-3, 8, -78, 3, 3, NISIP), [6, 0, 0], 3.5), // dună care alunecă
    bloc(0, 8, -83.5, 3, 3, STANCA),
    bloc(0, 8, -89, 2.5, 4, STANCA),                      // a doua rafală
    bloc(0, 8, -96, 8, 8, C.turcoaz),                     // la rover
  ],

  obstacole: [
    // furtuna împinge spre stânga pe pod
    { tip: 'vant', poz: [0, 4, -28], dim: [14, 6, 12], forta: [-2.5, 0] },
    // vârtejul de praf te ridică (pășește în el de pe marginea platformei)
    { tip: 'curent', poz: [0, -6, -46], raza: 2, inaltime: 13.2, forta: 14 },
    // a doua rafală împinge spre dreapta
    { tip: 'vant', poz: [0, 10, -88], dim: [12, 6, 6], forta: [3, 0] },
  ],

  indicii: [
    { poz: [0, 2, -19], raza: 2.5, text: 'Vântul te împinge – ține-te spre dreapta!' },
    { poz: [0, 2, -39], raza: 2.5, text: 'Intră în vârtejul de praf – te ridică!' },
  ],

  steaguri: [
    { poz: [-2, 2, -39], directie: ÎNAINTE },
    { poz: [-2, 8, -71], directie: ÎNAINTE },
  ],

  monede: [
    monedaPe(0, 0, -8), monedaPe(0, 1, -14), monedaPe(0, 2, -19),
    ...linieMonede([0, 3, -24], [0, 3, -32], 3),
    ...linieMonede([0, 1, -46], [0, 6, -46], 3), monedaPe(0, 8, -50.5),
    monedaPe(-2, 8, -57), monedaPe(2, 8, -61), monedaPe(-2, 8, -65),
    [0, 9.2, -78], monedaPe(0, 8, -83.5), monedaPe(0, 8, -89),
    ...linieMonede([-2.5, 9, -94], [2.5, 9, -94], 3),
  ],

  final: { poz: [0, 8, -99.5], directie: ÎNAINTE },
};
