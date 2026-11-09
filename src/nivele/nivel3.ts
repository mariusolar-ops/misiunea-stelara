// NIVELUL 3 – Stația spațială
// Nou: benzi rulante (te împing) și trambuline (te aruncă sus).
// Sfat: pe banda care vine spre tine, fugi și nu te opri!
import type { DefinitieNivel } from './tipuri';
import { bloc, banda, trambulina, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const DREAPTA = Math.PI / 2;
const ALB = 0xdfe6f2;
const METAL = 0x9aa6bd;

export const nivel3: DefinitieNivel = {
  nume: 'Stația spațială',
  tema: 'statie',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    // --- Partea 1: benzi rulante ---
    bloc(0, 0, 0, 8, 8, ALB),
    banda(0, 0, -10, 3, 12, 0, 3),          // te împinge înapoi
    bloc(0, 0, -19, 4, 4, METAL),
    banda(0, 0, -27, 4, 10, 3, 0),          // te împinge spre dreapta
    bloc(0, 0, -38, 7, 7, C.turcoaz),       // steagul 1

    // --- Partea 2: trambuline ---
    trambulina(0, 0, -45, 3, 3),
    bloc(0, 5, -51, 4, 4, ALB),
    bloc(0, 5, -57, 3, 3, METAL),
    trambulina(0, 3, -62, 3, 3),
    bloc(5, 8, -62, 2, 2, METAL),             // ascunzătoare SECRETĂ: sari în dreapta de pe trambulină
    bloc(0, 8, -68, 4, 4, ALB),
    bloc(0, 8, -76, 7, 7, C.turcoaz),       // steagul 2

    // --- Partea 3: spre dreapta, bandă + trambulină + bandă rapidă ---
    banda(9, 8, -76, 10, 3, -3, 0),         // vine spre tine
    trambulina(17, 8, -76, 3, 3),
    bloc(23, 12, -76, 4, 4, ALB),
    banda(31, 12, -76, 10, 3, 4, 0),        // te duce repede înainte – atenție la capăt!
    bloc(41, 12, -76, 6, 6, C.turcoaz),     // steagul 3

    // --- Partea 4: ultima trambulină și banda de la final ---
    trambulina(41, 10, -83, 3, 3),
    bloc(41, 15, -89.5, 3, 3, METAL),
    banda(41, 15, -97, 3, 8, 0, 3),
    bloc(41, 15, -106, 7, 7, C.turcoaz),    // finalul
  ],

  steaguri: [
    { poz: [-2.2, 0, -38], directie: ÎNAINTE },
    { poz: [-2.2, 8, -76], directie: DREAPTA },
    { poz: [41, 12, -73.8], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([0, 1, -6], [0, 1, -14], 3),
    monedaPe(0, 0, -19),
    ...linieMonede([-1, 1, -24], [-1, 1, -30], 3),
    [0, 4, -45],                             // în aer, deasupra trambulinei
    monedaPe(0, 5, -51),
    monedaPe(0, 5, -57),
    [0, 7, -62],
    monedaPe(0, 8, -68),
    ...linieMonede([6, 9, -76], [12, 9, -76], 3),
    [17, 12, -76],
    monedaPe(23, 12, -76),
    ...linieMonede([28, 13, -76], [34, 13, -76], 3),
    [41, 14, -83],
    monedaPe(41, 15, -89.5),
    ...linieMonede([41, 16, -94], [41, 16, -100], 3),
  ],

  final: { poz: [41, 15, -107], directie: ÎNAINTE },

  // Steaua secretă (adună-le pe toate 5 ca să deblochezi o surpriză!)
  secret: [5, 9.2, -62],
};
