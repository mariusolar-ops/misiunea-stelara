// NIVELUL 22 – Biblioteca plutitoare (nivel automat)
// O bibliotecă în spațiu: urci pe scări din cărți colorate, iei liftul-carte, treci pe o punte
// pe care un ventilator uriaș suflă spre stânga, sari pe pagini care zboară (dispar) și te
// ferești de creioanele uriașe care se balansează.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const LEMN = 0x8b5a2b;
const PAGINA = 0xfaf6e8;
const CARTI = [0xd8304a, 0x2a6fd8, 0x3fbf5a, 0xffc23f];

export const nivel22: DefinitieNivel = {
  nume: 'Biblioteca plutitoare',
  tema: 'biblioteca',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 8, LEMN),
    // scara din cărți
    bloc(0, 0.8, -7, 3, 2, CARTI[0]),
    bloc(0, 1.6, -10.5, 3, 2, CARTI[1]),
    bloc(0, 2.4, -14, 3, 2, CARTI[2]),
    mobila(bloc(0, 2.4, -19, 3, 3, CARTI[3]), [0, 4, 0], 4),   // cartea-lift
    bloc(0, 6.4, -24.5, 4, 4, CARTI[0]),
    bloc(0, 6.4, -32, 6, 6, C.turcoaz),                          // steagul 1
    bloc(0, 6.4, -42, 2, 12, LEMN),                              // puntea cu vânt (ține-te spre dreapta!)
    bloc(0, 6.4, -53, 6, 6, C.turcoaz),                          // steagul 2
    // paginile care zboară (dispar)
    dispare(bloc(-2, 7, -59.5, 2.5, 2.5, PAGINA)),
    dispare(bloc(1, 7.6, -63.5, 2.5, 2.5, PAGINA)),
    dispare(bloc(-1, 8.2, -67.5, 2.5, 2.5, PAGINA)),
    bloc(0, 8.2, -75, 2, 10, CARTI[1]),                          // raftul cu creioane
    bloc(0, 8.2, -86, 8, 8, C.turcoaz),                          // finalul
  ],

  obstacole: [
    { tip: 'vant', poz: [0, 8, -42], dim: [10, 6, 12], forta: [-3.5, 0] },
    { tip: 'pendul', pivot: [0, 12.4, -72.5], lungime: 3.8, amplitudine: 0.9, perioada: 2.3, axa: 'x' },
    { tip: 'pendul', pivot: [0, 12.4, -77.5], lungime: 3.8, amplitudine: 0.9, perioada: 2.3, faza: 0.5, axa: 'x' },
  ],

  indicii: [
    { poz: [0, 6.4, -32], raza: 3, text: 'Ventilatorul suflă spre stânga – ține-te spre dreapta!' },
  ],

  steaguri: [
    { poz: [-2, 6.4, -32], directie: ÎNAINTE },
    { poz: [-2, 6.4, -53], directie: ÎNAINTE },
  ],

  monede: [
    monedaPe(0, 0.8, -7), monedaPe(0, 1.6, -10.5), monedaPe(0, 2.4, -14), [0, 5.5, -19], monedaPe(0, 6.4, -24.5),
    ...linieMonede([0.5, 7.4, -38], [0.5, 7.4, -46], 3),
    monedaPe(-2, 7, -59.5), monedaPe(1, 7.6, -63.5), monedaPe(-1, 8.2, -67.5),
    ...linieMonede([0, 9.2, -71], [0, 9.2, -79], 3),
    ...linieMonede([-2.5, 9.2, -84], [2.5, 9.2, -84], 3),
  ],

  final: { poz: [0, 8.2, -87.5], directie: ÎNAINTE },
};
