// NIVELUL 41 – Insula furtunii (cerut de Mihai: „să fie ca în jocurile cu insulă și furtună”)
// Pornești de pe autobuzul zburător (ținut de un balon), sari pe insulă și FUGI:
// în spatele tău vine o furtună mov care înaintează încet! Urcă rampa de lemn
// construită în trepte, sari cu platforma de lansare, treci peste acoperișurile
// turnurilor, strânge monedele de lângă cuferele aurii și ajungi la zona sigură.
// Fără arme – doar alergi, sari și scapi de furtună. (Totul e desenat din cod.)
import type { DefinitieNivel } from './tipuri';
import { bloc, dispare, trambulina, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const AUTOBUZ = 0x2a8ad8;
const IARBA = 0x5ab84a;
const LEMN = 0xc8945a;
const ACOPERIS = 0x9a5a8a;
const LANSARE = 0x2ee6d6;

export const nivel41: DefinitieNivel = {
  nume: 'Insula furtunii',
  tema: 'insula',
  start: [0, 20, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 20, 0, 4, 8, AUTOBUZ),                         // autobuzul zburător
    bloc(0, 0, -14, 10, 10, IARBA),                         // locul de aterizare
    // rampa de lemn construită în trepte
    ...[1, 2, 3, 4].map((k) => bloc(0, k, -18 - k * 2, 3, 2, LEMN)),
    bloc(0, 4, -31, 3, 8, LEMN),                            // podul de scânduri
    bloc(0, 4, -39, 6, 6, C.turcoaz),                       // steagul 1
    trambulina(0, 4, -46, 3, 3, 24, LANSARE),               // platforma de lansare
    bloc(0, 11, -56, 6, 6, ACOPERIS),                       // acoperișul primului turn
    // acoperișurile turnurilor, din unul în altul
    bloc(-2, 11, -63, 2.5, 2.5, ACOPERIS),
    bloc(2, 12, -67, 2.5, 2.5, ACOPERIS),
    bloc(-2, 11, -71, 2.5, 2.5, ACOPERIS),
    bloc(0, 11, -78, 6, 6, C.turcoaz),                      // steagul 2
    dispare(bloc(0, 11, -83.5, 3, 2.5, LEMN)),              // scândura care cade
    bloc(0, 11, -90, 8, 8, C.turcoaz),                      // zona sigură
  ],

  obstacole: [
    // furtuna mov: pornește din spate după câteva secunde
    { tip: 'furtuna', start: [0, 0, 18], viteza: 4.2, intarziere: 4 },
  ],

  indicii: [
    { poz: [0, 20, 1], raza: 3, text: 'Sari din autobuz! Apoi fugi de furtună!' },
    { poz: [0, 4, -39], raza: 2.5, text: 'Platforma de lansare te aruncă sus!' },
    { poz: [0, 11, -90], raza: 3, text: 'Victorie! Ai scăpat de furtună!' },
  ],

  steaguri: [
    { poz: [-2, 4, -39], directie: ÎNAINTE },
    { poz: [-2, 11, -78], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([0, 21, -2], [0, 14, -9], 3),
    monedaPe(-3, 0, -12), monedaPe(3, 0, -16),               // lângă cuferele aurii
    ...[1, 2, 3, 4].map((k) => monedaPe(0, k, -18 - k * 2)),
    ...linieMonede([0, 5, -28], [0, 5, -34], 3),
    [0, 8, -46], [0, 13, -51],
    monedaPe(0, 11, -56),
    monedaPe(-2, 11, -63), monedaPe(2, 12, -67), monedaPe(-2, 11, -71),
    monedaPe(0, 11, -83.5),
    ...linieMonede([-2.5, 12, -88], [2.5, 12, -88], 3),
  ],

  final: { poz: [0, 11, -93.5], directie: ÎNAINTE },
};
