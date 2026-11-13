// NIVELUL 30 – Trenulețul de pe inelele lui Saturn (nivel automat)
// Pe inelele lui Saturn circulă vagoane spațiale! Urcă din gară în vagonul care
// te duce singur înainte, coboară la peron, treci pe sub raza care urcă și coboară,
// pășește pe bucățile de gheață din inel, prinde vagonul care merge de-a curmezișul,
// apoi pe cel care te duce la ultima gară și sari cu trambulina la final.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, gheata, trambulina, laserX, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const GARA = 0xc8b48a;
const VAGON = 0xff5f5f;
const VAGON2 = 0x2a6fd8;
const VAGON3 = 0xffb020;

export const nivel30: DefinitieNivel = {
  nume: 'Trenulețul de pe inelele lui Saturn',
  tema: 'saturn',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, GARA),                             // gara de plecare
    mobila(bloc(0, 0, -8, 4, 6, VAGON), [0, 0, -20], 8),   // vagonul 1: înainte–înapoi
    bloc(0, 0, -35, 6, 6, C.turcoaz),                      // peronul 1 (steagul 1)
    // bucățile de gheață din inel
    gheata(-2, 0, -43, 3, 4),
    gheata(2, 0, -48, 3, 4),
    gheata(-2, 0, -53, 3, 4),
    mobila(bloc(-4, 0, -59, 4, 4, VAGON2), [8, 0, 0], 5),  // vagonul 2: de-a curmezișul
    mobila(bloc(4, 0, -66, 4, 6, VAGON3), [0, 0, -12], 7), // vagonul 3: înainte
    bloc(4, 0, -85, 6, 6, C.turcoaz),                      // peronul 2 (steagul 2)
    trambulina(2, 0, -92, 3, 3, 20),
    bloc(0, 5, -100, 8, 8, C.turcoaz),                     // gara de sosire
  ],

  obstacole: [
    // raza de la ieșirea din peronul 1: urcă și coboară
    laserX(-37.5, 0.4, -3, 3, { miscare: { cat: [0, 2.2, 0], perioada: 3 } }),
  ],

  indicii: [
    { poz: [0, 0, -1], raza: 2.5, text: 'Urcă în vagon – te duce singur!' },
    { poz: [-2, 0, -53], raza: 2, text: 'Așteaptă vagonul albastru!' },
  ],

  steaguri: [
    { poz: [-2, 0, -35], directie: ÎNAINTE },
    { poz: [2, 0, -85], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([0, 1.2, -8], [0, 1.2, -28], 4),
    monedaPe(2, 0, -35),
    monedaPe(-2, 0, -43), monedaPe(2, 0, -48), monedaPe(-2, 0, -53),
    [0, 1.2, -59], [4, 1.2, -70], [4, 1.2, -76],
    [2, 4, -92],
    ...linieMonede([-2.5, 6, -98], [2.5, 6, -98], 3),
  ],

  final: { poz: [0, 5, -103.5], directie: ÎNAINTE },
};
