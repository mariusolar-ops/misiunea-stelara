// NIVELUL 32 – Camera cu jucării uriașe (nivel automat)
// Ai ajuns mic-mic într-o cameră cu jucării uriașe care plutesc prin spațiu!
// Urcă pe cuburile colorate, lasă-te aruncat de cutia cu arc, sari pe yo-yo-urile
// care urcă și coboară, ferește-te de raza titirezului, calcă repede pe piesele
// de domino care cad și prinde mașinuța care te duce la final.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, trambulina, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const PODEA = 0xe8c89a;
const ROSU = 0xff5f5f;
const VERDE = 0x5acf5a;
const ALBASTRU = 0x2a6fd8;
const GALBEN = 0xffd23f;
const DOMINO = 0xf4f4f8;

export const nivel32: DefinitieNivel = {
  nume: 'Camera cu jucării uriașe',
  tema: 'jucarii',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, PODEA),
    // cuburile colorate, ca o scară
    bloc(0, 1, -6, 3, 3, ROSU),
    bloc(2.5, 2, -10, 3, 3, VERDE),
    bloc(0, 3, -14, 3, 3, ALBASTRU),
    bloc(-2.5, 4, -18, 3, 3, GALBEN),
    trambulina(0, 4, -23, 3, 3, 20, ROSU),               // cutia cu arc
    bloc(0, 9, -30, 6, 6, C.turcoaz),                     // steagul 1
    // yo-yo-urile: urcă și coboară, pe rând
    mobila(bloc(0, 7, -37, 3, 3, C.mov), [0, 3, 0], 3),
    mobila(bloc(0, 7, -42, 3, 3, C.roz), [0, 3, 0], 3, 0.5),
    bloc(0, 9, -47, 4, 4, VERDE),
    bloc(0, 9, -55, 8, 8, PODEA),                         // masa titirezului
    bloc(0, 9, -64, 6, 6, C.turcoaz),                     // steagul 2
    // piesele de domino cad după ce treci
    dispare(bloc(-2, 9, -70, 2.5, 2.5, DOMINO)),
    dispare(bloc(2, 9, -74, 2.5, 2.5, DOMINO)),
    dispare(bloc(-2, 9, -78, 2.5, 2.5, DOMINO)),
    mobila(bloc(-3, 9, -84, 3, 3, ALBASTRU), [6, 0, 0], 3), // mașinuța
    bloc(0, 9, -91, 8, 8, C.turcoaz),                     // finalul
  ],

  obstacole: [
    // titirezul se învârte repede pe masă
    { tip: 'laserRotativ', centru: [0, 9.45, -55], raza: 3.8, viteza: 2.2 },
  ],

  indicii: [
    { poz: [-2.5, 4, -18], raza: 2, text: 'Cutia cu arc te aruncă sus!' },
    { poz: [0, 9, -30], raza: 2.5, text: 'Sari pe yo-yo când e la fel de sus ca tine!' },
  ],

  steaguri: [
    { poz: [-2, 9, -30], directie: ÎNAINTE },
    { poz: [-2, 9, -64], directie: ÎNAINTE },
  ],

  monede: [
    monedaPe(0, 1, -6), monedaPe(2.5, 2, -10), monedaPe(0, 3, -14), monedaPe(-2.5, 4, -18),
    [0, 8, -23],
    [0, 9.5, -37], [0, 9.5, -42], monedaPe(0, 9, -47),
    monedaPe(-3, 9, -52), monedaPe(3, 9, -58),
    monedaPe(-2, 9, -70), monedaPe(2, 9, -74), monedaPe(-2, 9, -78),
    [0, 10.2, -84],
    ...linieMonede([-2.5, 10, -89], [2.5, 10, -89], 3),
  ],

  final: { poz: [0, 9, -94.5], directie: ÎNAINTE },
};
