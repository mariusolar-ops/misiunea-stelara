// NIVELUL 6 (SECRET) – Nebuloasa secretă
// Se deschide doar după ce găsești toate cele 5 stele secrete.
// Un nivel-recompensă: plin de monede, cu trambuline, platforme care se încrucișează,
// o bandă care te duce înainte și o scară curcubeu până la poartă.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, trambulina, banda, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const CURCUBEU = [0xff5f5f, 0xff9a3c, 0xffd23f, 0xa6f04a, 0x2ee6d6, 0x8a6cff];
const PASTEL = 0xc9b8ff;

export const nivel6: DefinitieNivel = {
  nume: 'Nebuloasa secretă',
  tema: 'nebuloasa',
  esteSecret: true,
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    // --- Partea 1: trambuline în sus ---
    bloc(0, 0, 0, 8, 8, PASTEL),
    trambulina(0, 0, -6.5, 3, 3),
    bloc(0, 5, -12.5, 3, 3, C.roz),
    trambulina(0, 3, -18, 3, 3),
    bloc(0, 8, -24, 3, 3, C.roz),
    bloc(0, 8, -31, 7, 7, C.turcoaz),                    // steagul 1

    // --- Partea 2: două platforme care se încrucișează, banda și blocuri care dispar ---
    mobila(bloc(-4, 8, -38, 2.5, 2.5, C.portocaliu), [8, 0, 0], 4),
    mobila(bloc(4, 8, -43, 2.5, 2.5, C.portocaliu), [-8, 0, 0], 4),
    banda(0, 8, -50, 3, 8, 0, -3),                       // te duce înainte!
    dispare(bloc(0, 8, -56.5, 2.5, 2.5, C.roz)),
    dispare(bloc(0, 8.6, -60.5, 2.5, 2.5, C.roz)),
    bloc(0, 8.6, -67, 7, 7, C.turcoaz),                  // steagul 2

    // --- Partea 3: scara curcubeu ---
    ...CURCUBEU.slice(0, 5).map((c, i) => bloc(0, 9.4 + i * 0.8, -73 - i * 3.5, 3, 2, c)),
    bloc(0, 12.6, -94, 8, 8, CURCUBEU[5]),               // finalul
  ],

  steaguri: [
    { poz: [-2.2, 8, -31], directie: ÎNAINTE },
    { poz: [-2.2, 8.6, -67], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([-2, 1, -1], [2, 1, -1], 3),
    ...linieMonede([0, 2.5, -6.5], [0, 5.5, -6.5], 3),   // un turn de monede deasupra trambulinei
    monedaPe(0, 5, -12.5),
    ...linieMonede([0, 5.5, -18], [0, 8.5, -18], 3),
    monedaPe(0, 8, -24),
    ...linieMonede([-2, 9, -29], [2, 9, -33], 4),
    [0, 9.2, -38],
    [0, 9.2, -43],
    ...linieMonede([0, 9, -47], [0, 9, -53], 4),
    monedaPe(0, 8, -56.5),
    monedaPe(0, 8.6, -60.5),
    ...CURCUBEU.slice(0, 5).map((_, i) => monedaPe(0, 9.4 + i * 0.8, -73 - i * 3.5)),
    ...linieMonede([-2.5, 13.6, -91], [2.5, 13.6, -91], 4),
  ],

  final: { poz: [0, 12.6, -95], directie: ÎNAINTE },
};
