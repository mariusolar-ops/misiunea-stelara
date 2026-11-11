// NIVELUL 20 – Fabrica de bomboane (nivel automat, ziua 1)
// O fabrică de dulciuri în spațiu: benzi rulante care te duc înainte (și una care te împinge
// într-o parte!), trambuline de jeleu, acadele uriașe care se balansează, blocuri de ciocolată
// care se topesc (dispar) și cristale de zahăr care ies din podea.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, trambulina, banda, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const ROZ = 0xffb8d8;
const VANILIE = 0xfff0c8;
const CIOCOLATA = 0x7a4a2a;
const JELEU = 0xff5f8a;

export const nivel20: DefinitieNivel = {
  nume: 'Fabrica de bomboane',
  tema: 'bomboane',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 8, ROZ),
    banda(0, 0, -10, 4, 10, 0, -3),                       // banda fabricii te duce înainte
    trambulina(0, 0, -18, 3, 3, 20, JELEU),               // jeleu săltăreț
    bloc(0, 4, -24, 3, 3, VANILIE),
    bloc(0, 4, -32, 2, 10, ROZ),                          // puntea cu acadele
    bloc(0, 4, -41, 6, 6, C.turcoaz),                     // steagul 1
    dispare(bloc(0, 4, -47.5, 2.5, 2.5, CIOCOLATA)),      // ciocolata se topește!
    dispare(bloc(0, 4.6, -51.5, 2.5, 2.5, CIOCOLATA)),
    dispare(bloc(0, 5.2, -55.5, 2.5, 2.5, CIOCOLATA)),
    banda(0, 5.2, -63, 3, 8, 2.5, 0),                     // banda care te împinge spre dreapta
    bloc(0, 5.2, -72, 6, 6, C.turcoaz),                   // steagul 2
    mobila(bloc(-3, 5.2, -79, 3, 3, VANILIE), [6, 0, 0], 3),
    bloc(0, 5.2, -86, 4, 6, ROZ),                         // cu cristale de zahăr
    bloc(0, 5.2, -95, 8, 8, C.turcoaz),                   // finalul
  ],

  obstacole: [
    // acadele uriașe care se balansează peste punte
    { tip: 'pendul', pivot: [0, 8.4, -29.5], lungime: 3.8, amplitudine: 0.95, perioada: 2.4, axa: 'x' },
    { tip: 'pendul', pivot: [0, 8.4, -34.5], lungime: 3.8, amplitudine: 0.95, perioada: 2.4, faza: 0.5, axa: 'x' },
    // cristale de zahăr
    { tip: 'cristale', poz: [0, 5.2, -85], dim: [4, 1.5], perioada: 2.6 },
    { tip: 'cristale', poz: [0, 5.2, -87.5], dim: [4, 1.5], perioada: 2.6, faza: 0.5 },
  ],

  indicii: [
    { poz: [0, 0, 1], raza: 3, text: 'Atenție: ciocolata se topește!' },
  ],

  steaguri: [
    { poz: [-2, 4, -41], directie: ÎNAINTE },
    { poz: [-2, 5.2, -72], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([0, 1, -6], [0, 1, -14], 3),
    [0, 3, -18], monedaPe(0, 4, -24),
    ...linieMonede([0, 5, -28], [0, 5, -36], 3),
    monedaPe(0, 4, -47.5), monedaPe(0, 4.6, -51.5), monedaPe(0, 5.2, -55.5),
    ...linieMonede([-0.5, 6.2, -60], [-0.5, 6.2, -66], 3),
    [0, 6.4, -79], monedaPe(0, 5.2, -86),
    ...linieMonede([-2.5, 6.2, -93], [2.5, 6.2, -93], 3),
  ],

  final: { poz: [0, 5.2, -96.5], directie: ÎNAINTE },
};
