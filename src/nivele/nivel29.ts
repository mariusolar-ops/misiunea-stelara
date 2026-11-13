// NIVELUL 29 – Sera spațială (nivel automat)
// O seră uriașă cu plante de pe alte planete, sub o cupolă de sticlă.
// Sari pe flori-trambulină, aleargă pe peretele de liane (e „magnetic”, ca în nivelul
// cu pereți), alunecă pe frunzele ude, lasă-te ridicat de jetul stropitoarei
// și calcă repede pe petalele care cad.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, trambulina, gheata, perete, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const GHIVECI = 0xc8603a;
const FRUNZA = 0x4ac05a;
const LIANA = 0x2a8a3a;
const FLOARE = 0xff5fa8;
const FLOARE2 = 0xffd23f;
const PETALA = 0xffa0d0;

export const nivel29: DefinitieNivel = {
  nume: 'Sera spațială',
  tema: 'sera',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, GHIVECI),
    trambulina(0, 0, -6, 3, 3, 18, FLOARE),               // floare săltăreață
    bloc(0, 3, -12, 3, 3, FRUNZA),
    trambulina(0, 3, -16.5, 3, 3, 18, FLOARE2),
    bloc(0, 6, -22.5, 3, 3, FRUNZA),
    bloc(0, 6, -29, 6, 6, C.turcoaz),                     // steagul 1
    { ...perete(-2.8, 4, -39.5, 0.6, 7, 14), culoare: LIANA }, // peretele de liane
    bloc(0, 6, -49, 6, 6, FRUNZA),
    gheata(0, 6, -56, 3, 8),                              // frunze ude – aluneci!
    mobila(bloc(-3, 6, -64, 3, 3, FRUNZA), [6, 0, 0], 3.5),
    bloc(0, 6, -70, 6, 6, C.turcoaz),                     // steagul 2
    bloc(0, 12, -81.5, 4, 5, FRUNZA),                     // sus, unde te duce jetul
    dispare(bloc(-2, 12, -88, 2.5, 2.5, PETALA)),         // petalele cad!
    dispare(bloc(2, 12, -92, 2.5, 2.5, PETALA)),
    dispare(bloc(-2, 12, -96, 2.5, 2.5, PETALA)),
    bloc(0, 12, -103, 8, 8, C.turcoaz),                   // floarea uriașă de la final
  ],

  obstacole: [
    // jetul de apă al stropitoarei te ridică
    { tip: 'curent', poz: [0, -2, -77], raza: 2, inaltime: 13.2, forta: 14 },
  ],

  indicii: [
    { poz: [0, 6, -29], raza: 2.5, text: 'Sari spre liane și aleargă pe ele!' },
    { poz: [0, 6, -70], raza: 2.5, text: 'Intră în jetul de apă – te duce sus!' },
  ],

  steaguri: [
    { poz: [-2, 6, -29], directie: ÎNAINTE },
    { poz: [-2, 6, -70], directie: ÎNAINTE },
  ],

  monede: [
    [0, 3, -6], monedaPe(0, 3, -12), [0, 6, -16.5], monedaPe(0, 6, -22.5),
    ...linieMonede([-1.9, 8, -35], [-1.9, 8, -44], 4),
    monedaPe(0, 6, -49), monedaPe(0, 6, -56), [0, 7.2, -64],
    ...linieMonede([0, 7, -77], [0, 11, -77], 3),
    monedaPe(-2, 12, -88), monedaPe(2, 12, -92), monedaPe(-2, 12, -96),
    ...linieMonede([-2.5, 13, -101], [2.5, 13, -101], 3),
  ],

  final: { poz: [0, 12, -106.5], directie: ÎNAINTE },
};
