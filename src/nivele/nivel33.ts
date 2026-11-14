// NIVELUL 33 – Cascada cosmică (nivel automat)
// O cascadă care curge dintr-un nor de stele! Traversează râul ai cărui curenți
// te trag într-o parte și în cealaltă, sari pe buștenii care plutesc, urcă treptele
// cascadei contra apei care te împinge înapoi, lasă-te ridicat de vârtejul de apă
// și ai grijă pe pietrele ude și alunecoase de la final.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, banda, gheata, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const IARBA = 0x4ab05a;
const APA = 0x3a9adf;
const LEMN = 0x8a5a3a;
const PIATRA = 0x7a8a9a;

/** Apă care curge: o bandă rulantă colorată în albastru */
const apa = (x: number, sus: number, z: number, l: number, a: number, vx: number, vz: number) =>
  ({ ...banda(x, sus, z, l, a, vx, vz), culoare: APA });

export const nivel33: DefinitieNivel = {
  nume: 'Cascada cosmică',
  tema: 'cascada',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, IARBA),
    // râul: curentul te trage la dreapta, apoi la stânga
    apa(0, 0, -9, 6, 8, 3, 0),
    apa(0, 0, -16, 6, 6, -3, 0),
    bloc(0, 0, -23, 4, 4, PIATRA),
    bloc(0, 0, -30, 6, 6, C.turcoaz),                      // steagul 1
    // buștenii care plutesc
    mobila(bloc(-3, 0, -37.5, 3, 3, LEMN), [6, 0, 0], 3),
    mobila(bloc(3, 0, -43, 3, 3, LEMN), [-6, 0, 0], 3.5),
    bloc(0, 0, -49, 3, 3, PIATRA),
    // treptele cascadei: apa te împinge înapoi
    apa(0, 1, -55, 3, 4, 0, 2.5),
    apa(0, 2, -60, 3, 4, 0, 2.5),
    apa(0, 3, -65, 3, 4, 0, 2.5),
    bloc(0, 4, -70, 6, 6, C.turcoaz),                      // steagul 2
    bloc(0, 10, -81.5, 4, 5, PIATRA),                      // sus, unde te duce vârtejul
    // pietre ude – aluneci!
    gheata(-1.5, 10, -87, 2.5, 2.5),
    gheata(1.5, 10, -91, 2.5, 2.5),
    bloc(0, 10, -98, 8, 8, C.turcoaz),                     // finalul, sus pe cascadă
  ],

  obstacole: [
    // vârtejul de apă te ridică
    { tip: 'curent', poz: [0, -4, -77], raza: 2, inaltime: 13.2, forta: 14 },
  ],

  indicii: [
    { poz: [0, 0, -2], raza: 2.5, text: 'Curentul te trage – ține-te pe mijloc!' },
    { poz: [0, 0, -49], raza: 2, text: 'Urcă pe cascadă – apa te împinge înapoi!' },
  ],

  steaguri: [
    { poz: [-2, 0, -30], directie: ÎNAINTE },
    { poz: [-2, 4, -70], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([0, 1, -6], [0, 1, -18], 4), monedaPe(0, 0, -23),
    [0, 1.2, -37.5], [0, 1.2, -43], monedaPe(0, 0, -49),
    monedaPe(0, 1, -55), monedaPe(0, 2, -60), monedaPe(0, 3, -65),
    ...linieMonede([0, 6, -77], [0, 9, -77], 2), monedaPe(0, 10, -81.5),
    monedaPe(-1.5, 10, -87), monedaPe(1.5, 10, -91),
    ...linieMonede([-2.5, 11, -96], [2.5, 11, -96], 3),
  ],

  final: { poz: [0, 10, -101.5], directie: ÎNAINTE },
};
