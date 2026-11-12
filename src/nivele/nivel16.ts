// NIVELUL 16 – Norii săltăreți
// Norii albi sunt moi: când sari pe ei, te aruncă în sus. Unii plutesc dintr-o parte în alta,
// iar pe la mijloc bate un vânt puternic care te împinge spre dreapta – ține joystick-ul spre stânga!
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, trambulina, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const NOR = 0xf4f0ff;
const NOR_ROZ = 0xffd8ec;

export const nivel16: DefinitieNivel = {
  nume: 'Norii săltăreți',
  tema: 'nori',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 8, NOR),
    trambulina(0, 0, -7, 3, 3, 15, NOR_ROZ),
    bloc(0, 3, -13, 3, 3, NOR),
    mobila(bloc(-3, 3, -19, 3, 3, NOR_ROZ), [6, 0, 0], 4),
    trambulina(0, 3, -25, 3, 3, 15, NOR_ROZ),
    bloc(0, 6, -31, 3, 3, NOR),
    bloc(0, 6, -38, 6, 6, C.turcoaz),                    // steagul 1
    // norii mici din vânt
    bloc(0, 6, -45, 2.5, 2.5, NOR),
    bloc(0, 6, -50, 2.5, 2.5, NOR),
    bloc(0, 6, -55, 2.5, 2.5, NOR),
    bloc(0, 6, -62, 6, 6, C.turcoaz),                    // steagul 2
    // trei nori săltăreți la rând, peste gol
    trambulina(0, 6, -70, 3, 3, 15, NOR_ROZ),
    trambulina(0, 6, -78, 3, 3, 15, NOR_ROZ),
    trambulina(0, 6, -86, 3, 3, 15, NOR_ROZ),
    bloc(0, 8, -94, 8, 8, C.turcoaz),                    // finalul
  ],

  obstacole: [
    { tip: 'vant', poz: [0, 8, -50], dim: [14, 8, 14], forta: [4, 0] },
  ],

  indicii: [
    { poz: [0, 6, -38], raza: 3, text: 'Vânt puternic! Ține joystick-ul spre stânga.' },
  ],

  steaguri: [
    { poz: [-2, 6, -38], directie: ÎNAINTE },
    { poz: [-2, 6, -62], directie: ÎNAINTE },
  ],

  monede: [
    [0, 3, -7], monedaPe(0, 3, -13), [0, 4.2, -19], [0, 6, -25], monedaPe(0, 6, -31),
    monedaPe(0, 6, -45), monedaPe(0, 6, -50), monedaPe(0, 6, -55),
    [0, 9.5, -70], [0, 10, -74], [0, 9.5, -78], [0, 10, -82], [0, 9.5, -86],
    ...linieMonede([-2.5, 9, -92], [2.5, 9, -92], 3),
  ],

  final: { poz: [0, 8, -95.5], directie: ÎNAINTE },
};
