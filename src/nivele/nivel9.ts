// NIVELUL 9 – Răscrucea cometei (ideea lui Mihai!)
// Două răscruci: de fiecare dată alegi drumul.
//  - Răscrucea 1: STÂNGA = drumul cu trambuline și bandă (mai ușor)
//                 DREAPTA = drumul îngust cu pendul și laser (mai greu)
//  - Răscrucea 2: STÂNGA = curent de aer și gheață
//                 DREAPTA = coridorul cu lasere și o trambulină
// Drumurile se întâlnesc la steaguri. Pe fiecare drum sunt la fel de multe monede,
// așa că poți lua 3 stele pe oricare.
import type { DefinitieNivel } from './tipuri';
import { bloc, trambulina, banda, gheata, laserX, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const PIATRA = 0x6f8fb0;
const VERDE = 0x4ccf6a;     // drumurile mai ușoare
const ROSU = 0xe84a4a;      // drumurile mai grele

export const nivel9: DefinitieNivel = {
  nume: 'Răscrucea cometei',
  tema: 'cometa',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,
  monedePentru3Stele: 20, // 6 comune + 8 pe primul drum ales + 6 pe al doilea

  platforme: [
    bloc(0, 0, 0, 8, 8, PIATRA),
    bloc(0, 0, -9, 10, 6, PIATRA),                    // răscrucea 1
    // stâlpi colorați care arată drumurile: verde = ușor, roșu = greu
    bloc(-4.5, 1.5, -11.5, 0.6, 0.6, VERDE, 1.5),
    bloc(4.5, 1.5, -11.5, 0.6, 0.6, ROSU, 1.5),

    // --- Drumul 1 STÂNGA (ușor): pietre, trambulină, bandă ---
    bloc(-8, 0, -15, 3, 3, VERDE),
    bloc(-8, 0, -20.5, 3, 3, VERDE),
    trambulina(-8, 0, -26, 3, 3),
    bloc(-8, 5, -32, 3, 3, VERDE),
    bloc(-3.5, 4, -32, 1.5, 1.5, PIATRA),              // ascunzătoarea stelei de aur, între drumuri
    banda(-8, 5, -39, 3, 8, 0, -2.5),                  // te duce înainte
    bloc(-8, 5, -47, 5, 5, C.turcoaz),                 // steag pe drumul din stânga
    bloc(-5, 5, -51.5, 2, 2, VERDE),

    // --- Drumul 1 DREAPTA (greu): pietre mici, punte cu pendul și laser ---
    bloc(8, 0, -15, 2, 2, ROSU),
    bloc(8, 0.8, -19.5, 2, 2, ROSU),
    bloc(8, 1.6, -27, 2, 8, ROSU),                     // puntea îngustă
    bloc(8, 2.4, -35, 2, 2, ROSU),
    bloc(5, 3.2, -39, 2, 2, ROSU),
    bloc(4, 4.1, -43.5, 2, 2, ROSU),
    bloc(3, 5, -48.5, 2, 2, ROSU),

    // --- Locul unde se întâlnesc drumurile (și răscrucea 2) ---
    bloc(0, 5, -56, 8, 6, C.turcoaz),

    // --- Drumul 2 STÂNGA: curent de aer, apoi gheață ---
    bloc(-6, 5, -62, 3, 3, VERDE),
    bloc(-6, 10, -71.5, 4, 5, VERDE),                  // începe chiar la marginea curentului
    gheata(-6, 10, -80, 3, 8),
    bloc(-5, 10, -87, 2.5, 2.5, VERDE),

    // --- Drumul 2 DREAPTA: coridorul cu lasere și trambulina ---
    bloc(6, 5, -62, 3, 3, ROSU),
    bloc(6, 5, -72, 3, 14, ROSU),
    trambulina(6, 5, -82, 3, 3),
    bloc(4, 10, -87, 2.5, 2.5, ROSU),

    bloc(0, 10, -94, 8, 8, C.turcoaz),                 // finalul
  ],

  obstacole: [
    // drumul 1 dreapta
    { tip: 'pendul', pivot: [8, 5.6, -27], lungime: 4, amplitudine: 0.9, perioada: 2.4, axa: 'x' },
    laserX(-24, 2.6, 7, 9, { clipeste: { perioada: 2 } }),
    // drumul 2 stânga: curentul de aer
    { tip: 'curent', poz: [-6, -3, -67], raza: 2, inaltime: 13, forta: 14 },
    // drumul 2 dreapta: coridorul cu lasere
    laserX(-67, 5.5, 4.5, 7.5),
    laserX(-70.5, 6.0, 4.5, 7.5, { clipeste: { perioada: 2.2 } }),
    laserX(-74, 5.4, 4.5, 7.5, { miscare: { cat: [0, 2.4, 0], perioada: 2.6 } }),
  ],

  // ce drum ai ales: monedele de pe celălalt drum dispar (ca să nu le poți lua pe toate)
  alegeri: [
    { grup: 1, poz: [-8, 0, -15], raza: 1.8, ascunde: { x: [2, 20], z: [-52, -13] } },
    { grup: 1, poz: [8, 0, -15], raza: 1.3, ascunde: { x: [-20, -2], z: [-53, -13] } },
    { grup: 2, poz: [-6, 5, -62], raza: 1.8, ascunde: { x: [2, 20], z: [-89, -60] } },
    { grup: 2, poz: [6, 5, -62], raza: 1.8, ascunde: { x: [-20, -2], z: [-89, -60] } },
  ],

  indicii: [
    { poz: [0, 0, -9], raza: 3, text: 'Alege drumul! Verde = ușor, roșu = greu' },
    { poz: [0, 5, -56], raza: 3, text: 'Încă o răscruce! Aer sau lasere?' },
  ],

  steaguri: [
    { poz: [-8, 5, -47], directie: ÎNAINTE },
    { poz: [0, 5, -57.5], directie: ÎNAINTE },
  ],

  monede: [
    // comune
    ...linieMonede([0, 1, -3], [0, 1, -8], 3),
    ...linieMonede([-2.5, 11, -92], [2.5, 11, -92], 3),
    // drumul 1 stânga (8)
    monedaPe(-8, 0, -15), monedaPe(-8, 0, -20.5), [-8, 3.5, -26], monedaPe(-8, 5, -32),
    ...linieMonede([-8, 6, -36], [-8, 6, -42], 3), monedaPe(-5, 5, -51.5),
    // drumul 1 dreapta (8)
    monedaPe(8, 0, -15), monedaPe(8, 0.8, -19.5), ...linieMonede([8, 2.6, -24], [8, 2.6, -30], 3),
    monedaPe(8, 2.4, -35), monedaPe(5, 3.2, -39), monedaPe(3, 5, -48.5),
    // drumul 2 stânga (6)
    monedaPe(-6, 5, -62), ...linieMonede([-6, 6, -67], [-6, 10, -67], 2), monedaPe(-6, 10, -71.5),
    monedaPe(-6, 10, -80), monedaPe(-5, 10, -87),
    // drumul 2 dreapta (6)
    monedaPe(6, 5, -62), ...linieMonede([6, 6, -66], [6, 6, -77], 3), [6, 8, -82], monedaPe(4, 10, -87),
  ],

  final: { poz: [0, 10, -95], directie: ÎNAINTE },

  // Steaua de aur: pe o piatră mică între cele două drumuri
  secret: [-3.5, 5.2, -32],
};
