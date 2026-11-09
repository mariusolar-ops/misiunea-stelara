// NIVELUL 5 – Lângă gaura neagră
// Cel mai greu nivel: de toate – platforme care se mișcă, blocuri care dispar,
// trambuline peste lavă și benzi rulante înguste.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, lava, trambulina, banda, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const DREAPTA = Math.PI / 2;
const VIOLET = 0x4a3a8b;
const VIOLET2 = 0x5e4ab0;

export const nivel5: DefinitieNivel = {
  nume: 'Lângă gaura neagră',
  tema: 'gaura',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    // --- Partea 1: platformă care se plimbă, blocuri care dispar ---
    bloc(0, 0, 0, 8, 8, VIOLET),
    mobila(bloc(-3, 0, -7.5, 2.5, 2.5, C.portocaliu), [6, 0, 0], 3),
    dispare(bloc(0, 0.6, -12.5, 2, 2, C.roz)),
    dispare(bloc(0, 1.2, -16.5, 2, 2, C.roz)),
    mobila(bloc(0, 1.2, -21, 2.5, 2.5, C.portocaliu), [0, 0, -5], 3.5),
    bloc(0, 1.2, -33, 6, 6, C.turcoaz),                   // steagul 1

    // --- Partea 2: trambuline peste lavă și o bandă îngustă ---
    lava(0, -2, -48, 14, 24),
    trambulina(0, 0, -39.5, 2.5, 2.5),
    bloc(0, 4.5, -45.5, 2.5, 2.5, VIOLET2),
    banda(0, 4.5, -52, 2.5, 8, 2.5, 0),                   // te împinge într-o parte!
    trambulina(0, 2.5, -59.5, 2.5, 2.5),
    bloc(0, 7, -67, 6, 6, C.turcoaz),                     // steagul 2

    // --- Partea 3: spre dreapta – blocuri care dispar, lift, platformă mobilă ---
    lava(18, -2, -67, 26, 12),
    dispare(bloc(5.5, 7, -67, 2, 2, C.roz)),
    dispare(bloc(9.5, 7.6, -67, 2, 2, C.roz)),
    dispare(bloc(13.5, 8.2, -67, 2, 2, C.roz)),
    mobila(bloc(17.5, 8.2, -67, 2.5, 2.5, C.mov), [0, 4, 0], 4), // lift
    bloc(22.5, 12.2, -67, 2.5, 2.5, VIOLET2),
    mobila(bloc(27.5, 12.2, -67, 2.5, 2.5, C.portocaliu), [0, 0, 4], 3),
    bloc(34, 12.2, -67, 6, 6, C.turcoaz),                 // steagul 3

    // --- Partea 4: spre gaura neagră ---
    dispare(bloc(34, 12.8, -72.5, 2, 2, C.roz)),
    mobila(bloc(34, 12.8, -77.5, 2, 2, C.portocaliu), [-5, 0, 0], 3),
    bloc(29, 13.4, -82.5, 2, 2, VIOLET2),
    trambulina(29, 13.4, -87, 2.5, 2.5),
    banda(29, 18, -94, 3, 8, 0, 3),                       // vine spre tine
    bloc(29, 18, -103, 7, 7, C.turcoaz),                  // finalul
  ],

  steaguri: [
    { poz: [-2, 1.2, -33], directie: ÎNAINTE },
    { poz: [-2, 7, -67], directie: DREAPTA },
    { poz: [34, 12.2, -64.8], directie: ÎNAINTE },
  ],

  monede: [
    [0, 1.2, -7.5],
    monedaPe(0, 0.6, -12.5),
    monedaPe(0, 1.2, -16.5),
    [0, 2.4, -23.5],
    [0, 3.5, -39.5],
    monedaPe(0, 4.5, -45.5),
    ...linieMonede([-0.5, 5.5, -49], [-0.5, 5.5, -55], 3),
    [0, 6, -59.5],
    monedaPe(5.5, 7, -67),
    monedaPe(9.5, 7.6, -67),
    monedaPe(13.5, 8.2, -67),
    [17.5, 11, -67],
    monedaPe(22.5, 12.2, -67),
    [27.5, 13.4, -65],
    monedaPe(34, 12.8, -72.5),
    [31.5, 14, -77.5],
    monedaPe(29, 13.4, -82.5),
    [29, 17, -87],
    ...linieMonede([29, 19, -91], [29, 19, -97], 3),
  ],

  final: { poz: [29, 18, -104], directie: ÎNAINTE },
};
