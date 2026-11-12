// NIVELUL 23 – Parcul de distracții (nivel automat)
// Un parc de distracții pe o planetă: urci în vagonul de montagne russe care te duce peste un gol
// mare, sari pe castelul gonflabil (trambuline colorate), treci printre „corăbiile” care se
// balansează, urci cu turnul de cădere liberă și cobori pe tobogan până la final.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, trambulina, banda, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const ASFALT = 0x4a4a6a;
const ROSU = 0xe8304a;

export const nivel23: DefinitieNivel = {
  nume: 'Parcul de distracții',
  tema: 'parc',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 8, ASFALT),
    mobila(bloc(0, 0, -8, 3, 3, ROSU), [0, 0, -14], 5),       // vagonul de montagne russe
    bloc(0, 0, -26, 4, 4, ASFALT),
    bloc(0, 0, -33, 6, 6, C.turcoaz),                        // steagul 1
    // castelul gonflabil
    trambulina(0, 0, -40, 3, 3, 15, 0xff5fa8),
    trambulina(0, 1.5, -46, 3, 3, 15, 0xffd23f),
    trambulina(0, 3, -52, 3, 3, 15, 0x2ee6d6),
    bloc(0, 5, -58, 4, 4, ASFALT),
    bloc(0, 5, -66, 2, 10, 0x8b5a2b),                         // puntea „corăbiilor”
    bloc(0, 5, -76, 6, 6, C.turcoaz),                        // steagul 2
    mobila(bloc(0, 5, -84, 3, 3, 0x8a6cff), [0, 6, 0], 4),   // turnul de cădere liberă
    bloc(0, 11, -90, 3, 3, ASFALT),
    banda(0, 11, -98, 3, 10, 0, -3),                         // toboganul
    bloc(0, 11, -109, 8, 8, C.turcoaz),                      // finalul
  ],

  obstacole: [
    // „corăbiile” care se balansează înainte-înapoi peste punte
    { tip: 'pendul', pivot: [0, 9.6, -63.5], lungime: 3.8, amplitudine: 1.0, perioada: 2.6, axa: 'z' },
    { tip: 'pendul', pivot: [0, 9.6, -68.5], lungime: 3.8, amplitudine: 1.0, perioada: 2.6, faza: 0.5, axa: 'z' },
  ],

  indicii: [
    { poz: [0, 0, 1], raza: 3, text: 'Urcă în vagonul roșu – te duce peste gol!' },
  ],

  steaguri: [
    { poz: [-2, 0, -33], directie: ÎNAINTE },
    { poz: [-2, 5, -76], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([0, 1.2, -11], [0, 1.2, -19], 3),
    monedaPe(0, 0, -26),
    [0, 3, -40], [0, 4.5, -46], [0, 6, -52], monedaPe(0, 5, -58),
    ...linieMonede([0, 6, -62], [0, 6, -70], 3),
    [0, 9, -84], monedaPe(0, 11, -90),
    ...linieMonede([0, 12, -95], [0, 12, -101], 3),
    ...linieMonede([-2.5, 12, -107], [2.5, 12, -107], 3),
  ],

  final: { poz: [0, 11, -110.5], directie: ÎNAINTE },
};
