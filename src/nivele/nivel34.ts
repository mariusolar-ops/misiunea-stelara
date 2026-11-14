// NIVELUL 34 – Acoperișurile orașului neon (nivel automat)
// Noapte într-un oraș al viitorului, plin de lumini colorate! Sari de pe un acoperiș
// pe altul, prinde drona care te duce peste stradă, ferește-te de razele
// reflectoarelor care urcă și coboară, lasă-te ridicat de aerul ventilatorului
// și calcă repede pe firmele luminoase care se sting.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, laserX, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const ACOPERIS = 0x4a4f6a;
const ACOPERIS2 = 0x5a5068;
const DRONA = 0x2ee6d6;
const NEON1 = 0xff5fa8;
const NEON2 = 0x8a6cff;

export const nivel34: DefinitieNivel = {
  nume: 'Acoperișurile orașului neon',
  tema: 'oras',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, ACOPERIS),
    // acoperișuri de înălțimi diferite
    bloc(0, 0, -9, 5, 6, ACOPERIS2),
    bloc(2, 1.5, -16, 4, 4, ACOPERIS),
    bloc(-2, 0.5, -22, 4, 4, ACOPERIS2),
    bloc(0, 2, -28, 4, 4, ACOPERIS),
    bloc(0, 2, -35, 6, 6, C.turcoaz),                      // steagul 1
    mobila(bloc(0, 2, -42, 3, 3, DRONA), [0, 0, -6], 4),   // drona peste stradă
    bloc(0, 2, -54, 4, 4, ACOPERIS2),
    bloc(0, 2, -62, 4, 8, ACOPERIS),                       // acoperișul cu reflectoare
    bloc(0, 2, -71, 6, 6, C.turcoaz),                      // steagul 2
    bloc(0, 8, -82.5, 4, 5, ACOPERIS2),                    // sus, unde te duce ventilatorul
    // firmele luminoase se sting după ce treci
    dispare(bloc(-2, 8, -89, 2.5, 2.5, NEON1)),
    dispare(bloc(2, 8, -93, 2.5, 2.5, NEON2)),
    bloc(0, 8, -100, 8, 8, C.turcoaz),                     // finalul – cel mai înalt bloc!
  ],

  obstacole: [
    // razele reflectoarelor urcă și coboară
    laserX(-60, 2.4, -2, 2, { miscare: { cat: [0, 2.2, 0], perioada: 2.6 } }),
    laserX(-64, 2.4, -2, 2, { miscare: { cat: [0, 2.2, 0], perioada: 2.6, faza: 0.5 } }),
    // aerul ventilatorului te ridică
    { tip: 'curent', poz: [0, -6, -78], raza: 2, inaltime: 13.2, forta: 14 },
  ],

  indicii: [
    { poz: [0, 2, -35], raza: 2.5, text: 'Prinde drona – te duce peste stradă!' },
    { poz: [0, 2, -71], raza: 2.5, text: 'Intră în aerul ventilatorului!' },
  ],

  steaguri: [
    { poz: [-2, 2, -35], directie: ÎNAINTE },
    { poz: [-2, 2, -71], directie: ÎNAINTE },
  ],

  monede: [
    monedaPe(0, 0, -9), monedaPe(2, 1.5, -16), monedaPe(-2, 0.5, -22), monedaPe(0, 2, -28),
    [0, 3.2, -42], [0, 3.2, -48], monedaPe(0, 2, -54),
    monedaPe(0, 2, -58.5), monedaPe(0, 2, -62), monedaPe(0, 2, -65.5),
    ...linieMonede([0, 4, -78], [0, 7, -78], 2), monedaPe(0, 8, -82.5),
    monedaPe(-2, 8, -89), monedaPe(2, 8, -93),
    ...linieMonede([-2.5, 9, -98], [2.5, 9, -98], 3),
  ],

  final: { poz: [0, 8, -103.5], directie: ÎNAINTE },
};
