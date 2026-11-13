// NIVELUL 26 – Pianul cosmic (nivel automat)
// O scenă de concert care plutește prin spațiu: mergi pe clapele unui pian uriaș
// care urcă și coboară ca un val, sari pe tobe-trambulină, ferește-te de bagheta
// dirijorului care se învârte, calcă pe notele muzicale care dispar și urcă
// scara-xilofon pe sub metronomul care se leagănă.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, trambulina, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const SCENA = 0x3a2a5a;
const ALB = 0xf4f4f8;
const NEGRU = 0x2a2a38;
const TOBA = 0xff5f5f;
const NOTA = 0xffd23f;
const XILOFON = [0xff5f5f, 0xff9a3c, 0xffd23f, 0xa6f04a];

/** Clapele pianului: albe și negre pe rând, fiecare urcă și coboară puțin după cealaltă (un val) */
const clape = Array.from({ length: 8 }, (_, i) =>
  mobila(bloc(0, 0, -5 - i * 2, 6, 1.8, i % 2 ? NEGRU : ALB), [0, 1.5, 0], 2.4, i * 0.12));

export const nivel26: DefinitieNivel = {
  nume: 'Pianul cosmic',
  tema: 'muzica',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, SCENA),
    ...clape,
    bloc(0, 0, -23, 4, 4, SCENA),
    trambulina(0, 0, -28, 3, 3, 18, TOBA),                // toba săltăreață
    bloc(0, 3, -34, 3, 3, SCENA),
    trambulina(0, 3, -39, 3, 3, 18, TOBA),
    bloc(0, 6, -45, 6, 6, C.turcoaz),                     // steagul 1
    bloc(0, 6, -55, 8, 8, SCENA),                         // scena dirijorului
    dispare(bloc(-2, 6, -63, 2.5, 2.5, NOTA)),            // notele muzicale dispar!
    dispare(bloc(2, 6, -67, 2.5, 2.5, NOTA)),
    dispare(bloc(-2, 6, -71, 2.5, 2.5, NOTA)),
    bloc(0, 6, -77, 6, 6, C.turcoaz),                     // steagul 2
    // scara-xilofon: fiecare treaptă altă culoare
    ...XILOFON.map((c, i) => bloc(0, 7 + i, -83 - i * 3, 3, 2, c)),
    bloc(0, 10, -99, 8, 8, C.turcoaz),                    // finalul – aplauze!
  ],

  obstacole: [
    // bagheta dirijorului se învârte pe scenă
    { tip: 'laserRotativ', centru: [0, 6.45, -55], raza: 3.8, viteza: 1.6 },
    // metronomul uriaș se leagănă peste scara-xilofon
    { tip: 'pendul', pivot: [0, 13.4, -87.5], lungime: 3.8, amplitudine: 0.95, perioada: 2.2, axa: 'x' },
  ],

  indicii: [
    { poz: [0, 0, -2], raza: 2.5, text: 'Clapele urcă și coboară – mergi pe val!' },
    { poz: [0, 6, -45], raza: 2.5, text: 'Sari peste bagheta dirijorului!' },
  ],

  steaguri: [
    { poz: [-2, 6, -45], directie: ÎNAINTE },
    { poz: [-2, 6, -77], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([-2, 2.5, -6], [2, 2.5, -18], 4), monedaPe(0, 0, -23),
    [0, 4, -28], monedaPe(0, 3, -34), [0, 7, -39],
    monedaPe(-3, 6, -52), monedaPe(3, 6, -58),
    monedaPe(-2, 6, -63), monedaPe(2, 6, -67), monedaPe(-2, 6, -71),
    ...XILOFON.map((_, i) => monedaPe(0, 7 + i, -83 - i * 3)),
    ...linieMonede([-2.5, 11, -97], [2.5, 11, -97], 3),
  ],

  final: { poz: [0, 10, -102.5], directie: ÎNAINTE },
};
