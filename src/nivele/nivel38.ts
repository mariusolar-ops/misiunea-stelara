// NIVELUL 38 – Circul cosmic (nivel automat)
// Bun venit la circul dintre stele! Mergi pe sârmă ca un funambul, sari pe
// trambulinele de circ, prinde trapezul care te poartă peste arenă, sari peste
// bastonul jonglerului care se învârte și la final… intri în tun și zbori la aplauze!
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, trambulina, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const ARENA = 0xd8303a;
const SARMA = 0xf4e0b0;
const ALB = 0xf4f4f8;
const ALBASTRU = 0x2a6fd8;
const TRAPEZ = 0xffd23f;
const TUN = 0x3a3a4a;

export const nivel38: DefinitieNivel = {
  nume: 'Circul cosmic',
  tema: 'circ',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, ARENA),
    bloc(0, 0, -12, 1, 14, SARMA),                         // sârma funambulului
    bloc(0, 0, -22, 4, 4, ALB),
    trambulina(-2, 0, -28, 3, 3, 18, ALBASTRU),            // trambulinele de circ
    bloc(2, 3, -34, 3, 3, ALB),
    trambulina(-2, 3, -39.5, 3, 3, 18, ALBASTRU),
    bloc(0, 6, -46, 6, 6, C.turcoaz),                      // steagul 1
    mobila(bloc(0, 6, -53, 3, 3, TRAPEZ), [0, 0, -8], 5),  // trapezul
    bloc(0, 6, -66, 4, 4, ALB),
    bloc(0, 6, -74, 8, 8, ARENA),                          // arena jonglerului
    bloc(0, 6, -83, 6, 6, C.turcoaz),                      // steagul 2
    trambulina(0, 6, -90, 3, 3, 24, TUN),                  // tunul!
    bloc(0, 13, -99, 8, 8, C.turcoaz),                     // aplauze!
  ],

  obstacole: [
    // bastonul jonglerului se învârte
    { tip: 'laserRotativ', centru: [0, 6.45, -74], raza: 3.8, viteza: 1.9 },
  ],

  indicii: [
    { poz: [0, 0, -2], raza: 2.5, text: 'Mergi drept pe sârmă!' },
    { poz: [0, 6, -83], raza: 2.5, text: 'Intră în tun – zbori la final!' },
  ],

  steaguri: [
    { poz: [-2, 6, -46], directie: ÎNAINTE },
    { poz: [-2, 6, -83], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([0, 1, -6], [0, 1, -18], 5), monedaPe(0, 0, -22),
    [-2, 4, -28], monedaPe(2, 3, -34), [-2, 7, -39.5],
    [0, 7.2, -53], [0, 7.2, -59], monedaPe(0, 6, -66),
    monedaPe(-3, 6, -71), monedaPe(3, 6, -77),
    [0, 11, -91], [0, 14, -95],
    ...linieMonede([-2.5, 14, -98], [2.5, 14, -98], 3),
  ],

  final: { poz: [0, 13, -102.5], directie: ÎNAINTE },
};
