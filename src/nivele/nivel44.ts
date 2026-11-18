// NIVELUL 44 – Ușa cu trei butoane (cerut de Mihai: un nivel-puzzle cu 3 butoane și o ușă)
// Ajungi într-o piață cu o ușă mare, încuiată. Pe ușă sunt 3 becuri roșii.
// Ca să se deschidă, trebuie să calci pe cele 3 butoane roșii, puse pe 3 drumuri diferite:
//  - în STÂNGA: platforme care plutesc dintr-o parte în alta
//  - în DREAPTA: blocuri care se prăbușesc (fugi repede!)
//  - SUS, în spate: o scară până pe un turn, păzit de o rază laser
// Fiecare buton apăsat aprinde un bec verde. La al treilea, ușa urcă și poți ajunge la final.
// Dacă și cazi, butoanele rămân apăsate și revii la steagul din piață.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, laserX, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const PIATRA = 0x8a8aa8;
const PIATRA2 = 0x6a6a88;
const ZID = 0x4a4a68;
const AUR = 0xffd23f;

export const nivel44: DefinitieNivel = {
  nume: 'Ușa cu trei butoane',
  tema: 'puzzle',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, PIATRA),
    bloc(0, 0, -7, 3, 4, PIATRA2),
    bloc(0, 0, -16, 14, 10, PIATRA),                         // piața
    // zidul cu ușa (ușa e în mijloc, între cele două bucăți de zid)
    bloc(-4.7, 7, -23, 5, 0.8, ZID, 7),
    bloc(4.7, 7, -23, 5, 0.8, ZID, 7),
    bloc(0, 0, -26.5, 4, 11, PIATRA2),                       // culoarul de după ușă (lipit de piață)
    bloc(0, 0, -35, 6, 6, C.turcoaz),                        // finalul

    // butonul 1 – în stânga: platforme care plutesc
    mobila(bloc(-10.5, 0, -16, 3, 3, PIATRA2), [-6, 0, 0], 4),
    bloc(-21, 0, -16, 4, 4, PIATRA),
    // butonul 2 – în dreapta: blocuri care se prăbușesc
    dispare(bloc(9, 0, -16, 2.5, 2.5, AUR)),
    dispare(bloc(12.5, 0, -16, 2.5, 2.5, AUR)),
    dispare(bloc(16, 0, -16, 2.5, 2.5, AUR)),
    bloc(20.5, 0, -16, 4, 4, PIATRA),
    // butonul 3 – sus, în spate: scara până pe turn
    bloc(5, 1, -8.5, 2.5, 2.5, PIATRA2),
    bloc(5, 2, -5, 2.5, 2.5, PIATRA2),
    bloc(5.5, 3, -1.5, 2.5, 2.5, PIATRA2),
    bloc(5.5, 4, 2, 2.5, 2.5, PIATRA2),
    bloc(5.5, 5, 6, 4, 4, PIATRA),
  ],

  butoane: [
    [-21, 0, -16],
    [20.5, 0, -16],
    [5.5, 5, 7],
  ],

  usa: { poz: [0, 0, -23], dim: [4.4, 7, 0.8] },

  obstacole: [
    // raza care păzește butonul de pe turn: urcă și coboară
    laserX(5, 5.4, 3.5, 7.5, { miscare: { cat: [0, 2.2, 0], perioada: 2.6 } }),
  ],

  indicii: [
    { poz: [0, 0, -12], raza: 3, text: 'Apasă cele 3 butoane roșii ca să deschizi ușa!' },
    { poz: [5, 1, -8.5], raza: 1.5, text: 'Urcă scara până pe turn!' },
  ],

  steaguri: [
    { poz: [-3, 0, -13], directie: ÎNAINTE },
  ],

  monede: [
    monedaPe(0, 0, -7),
    [-10.5, 1.2, -16], [-15, 1.2, -16], monedaPe(-21, 0, -18),
    monedaPe(9, 0, -16), monedaPe(12.5, 0, -16), monedaPe(16, 0, -16), monedaPe(20.5, 0, -18),
    monedaPe(5, 1, -8.5), monedaPe(5, 2, -5), monedaPe(5.5, 3, -1.5), monedaPe(5.5, 4, 2),
    ...linieMonede([0, 1, -24.5], [0, 1, -31], 3),
    ...linieMonede([-2, 1, -34], [2, 1, -34], 3),
  ],

  final: { poz: [0, 0, -37.5], directie: ÎNAINTE },
};
