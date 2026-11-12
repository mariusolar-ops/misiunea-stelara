// NIVELUL 24 – Pădurea de ciuperci luminoase (nivel automat)
// O pădure magică de pe o lună: sari pe ciuperci-trambulină (roșii cu buline), mergi pe frunze
// care plutesc, lasă-te ridicat de o coloană de puf de păpădie și ferește-te de ghimpii
// care ies din pământ. Pe cer: ciuperci uriașe care strălucesc și licurici.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, trambulina, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const PAMANT = 0x5a3a2a;
const MUSCHI = 0x3a8a4a;
const FRUNZA = 0x5acf5a;
const CIUPERCA = 0xe8303a;

export const nivel24: DefinitieNivel = {
  nume: 'Pădurea de ciuperci luminoase',
  tema: 'ciuperci',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 8, PAMANT),
    trambulina(0, 0, -5.5, 3, 3, 18, CIUPERCA),           // ciupercă săltăreață (lipită de start)
    bloc(0, 3, -11.5, 3, 3, MUSCHI),
    trambulina(0, 3, -14.5, 3, 3, 18, CIUPERCA),
    bloc(0, 6, -20.5, 3, 3, MUSCHI),
    bloc(0, 6, -26, 3, 3, MUSCHI),
    bloc(0, 6, -32, 6, 6, C.turcoaz),                     // steagul 1
    // frunzele care plutesc
    mobila(bloc(-3, 6, -38.5, 3, 3, FRUNZA), [6, 0, 0], 3.5),
    mobila(bloc(3, 6, -44, 3, 3, FRUNZA), [-6, 0, 0], 3.5),
    bloc(0, 6, -50, 4, 4, MUSCHI),
    bloc(0, 12, -60.5, 4, 5, MUSCHI),                     // sus, unde te duce pufulețul
    bloc(0, 12, -68, 6, 6, C.turcoaz),                    // steagul 2
    bloc(0, 12, -77, 4, 8, PAMANT),                       // poteca cu ghimpi
    bloc(0, 12, -88, 8, 8, C.turcoaz),                    // finalul
  ],

  obstacole: [
    // coloana de puf de păpădie: pășește în ea din marginea platformei și te ridică
    { tip: 'curent', poz: [0, -2, -56], raza: 2, inaltime: 13.2, forta: 14 },
    // ghimpii care ies din pământ, pe rând
    { tip: 'cristale', poz: [0, 12, -75.5], dim: [4, 1.5], perioada: 2.8 },
    { tip: 'cristale', poz: [0, 12, -78.5], dim: [4, 1.5], perioada: 2.8, faza: 0.5 },
  ],

  indicii: [
    { poz: [0, 6, -50], raza: 2.5, text: 'Pășește în pufulețul de păpădie – te ridică sus!' },
  ],

  steaguri: [
    { poz: [-2, 6, -32], directie: ÎNAINTE },
    { poz: [-2, 12, -68], directie: ÎNAINTE },
  ],

  monede: [
    [0, 3, -5.5], monedaPe(0, 3, -11.5), [0, 6, -14.5], monedaPe(0, 6, -20.5), monedaPe(0, 6, -26),
    [0, 7.2, -38.5], [0, 7.2, -44], monedaPe(0, 6, -50),
    ...linieMonede([0, 4, -56], [0, 11, -56], 4),
    monedaPe(0, 12, -60.5), monedaPe(0, 12, -77),
    ...linieMonede([-2.5, 13, -86], [2.5, 13, -86], 3),
  ],

  final: { poz: [0, 12, -89.5], directie: ÎNAINTE },
};
