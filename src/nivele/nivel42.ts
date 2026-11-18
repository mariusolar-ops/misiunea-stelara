// NIVELUL 42 – Piesele care cad (cerut de Mihai: un nivel ca jocul cu piese care cad și linii)
// Totul e făcut din piese de câte 4 cuburi: L, T, S, Z, pătratul și linia.
//  1) mergi pe un drum din piese culcate
//  2) piese care urcă și coboară din cer – sari pe ele când sunt jos
//  3) „linii complete” care se sparg după ce calci pe ele
//  4) urci un turn din piese stivuite până la linia de final
// (Formele, culorile și desenele sunt făcute din cod – nimic copiat.)
import type { DefinitieNivel } from './tipuri';
import type { DefinitiePlatforma } from '../lume/Platforma';
import { bloc, mobila, dispare, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const L = 1.5;                       // mărimea unui cub dintr-o piesă
const GRILA = 0x2a2f4a;
// culorile pieselor (ale noastre)
const ROSU = 0xff5f6a, PORTOCALIU = 0xff9a3c, GALBEN = 0xffd23f, VERDE = 0x5acf5a, TURCOAZ = 0x2ee6d6, ALBASTRU = 0x3a7aff, MOV = 0xa86cff;

type Celula = [number, number];     // [coloana (spre dreapta), rândul (spre înainte)]
// formele pieselor
const T: Celula[] = [[-1, 0], [0, 0], [1, 0], [0, 1]];
const I: Celula[] = [[0, 0], [0, 1], [0, 2], [0, 3]];
const IORIZ: Celula[] = [[-1, 0], [0, 0], [1, 0], [2, 0]];
const LP: Celula[] = [[0, 0], [0, 1], [0, 2], [1, 2]];
const Z: Celula[] = [[0, 0], [1, 0], [1, 1], [2, 1]];
const O: Celula[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
const J: Celula[] = [[0, 0], [0, 1], [-1, 1], [-1, 2]];

/** O piesă culcată: fiecare cub e un bloc; (x, z) = unde stă primul cub, „sus” = înălțimea */
function piesa(forma: Celula[], x: number, sus: number, z: number, culoare: number): DefinitiePlatforma[] {
  return forma.map(([c, r]) => bloc(x + c * L, sus, z - r * L, L, L, culoare));
}
/** O piesă care urcă și coboară (toate cuburile ei se mișcă împreună) */
function piesaCareCade(forma: Celula[], x: number, sus: number, z: number, culoare: number, faza: number) {
  return piesa(forma, x, sus, z, culoare).map((b) => mobila(b, [0, 6, 0], 5, faza));
}
/** O linie completă din 5 cuburi, care se sparge după ce calci pe ea */
function linie(x: number, sus: number, z: number, culoare: number) {
  return [-2, -1, 0, 1, 2].map((c) => dispare(bloc(x + c * L, sus, z, L, L, culoare)));
}

export const nivel42: DefinitieNivel = {
  nume: 'Piesele care cad',
  tema: 'piese',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, GRILA),
    // 1) drumul din piese culcate
    ...piesa(T, 0, 0, -3.75, MOV),
    ...piesa(I, 0, 0, -8.25, TURCOAZ),
    ...piesa(LP, 0, 1, -15.75, PORTOCALIU),
    ...piesa(Z, 1.5, 2, -21.75, ROSU),
    bloc(3, 2, -28, 6, 6, C.turcoaz),                         // steagul 1
    // 2) piese care urcă și coboară din cer
    ...piesaCareCade(O, 2.25, 2, -32.25, GALBEN, 0),
    ...piesaCareCade(T, 3, 2, -37.75, MOV, 0.33),
    ...piesaCareCade(IORIZ, 2.25, 2, -42.25, TURCOAZ, 0.66),
    bloc(3, 2, -47, 4, 4, GRILA),
    // 3) liniile complete care se sparg
    ...linie(3, 2, -51.5, ALBASTRU),
    ...linie(3, 2, -54.5, VERDE),
    ...linie(3, 2, -57.5, ROSU),
    bloc(3, 2, -63, 6, 6, C.turcoaz),                         // steagul 2
    // 4) turnul din piese stivuite
    ...piesa(LP.slice(0, 3), 3, 3, -67.75, PORTOCALIU),
    ...piesa(O, 3, 4, -72.25, GALBEN),
    ...piesa(T, 3.75, 5, -76.75, MOV),
    ...piesa(J, 3.75, 6, -81.25, ALBASTRU),
    bloc(3, 7, -88, 8, 8, C.turcoaz),                         // linia de final
  ],

  indicii: [
    { poz: [0, 0, -1], raza: 2.5, text: 'Mergi pe piese din cuburi!' },
    { poz: [3, 2, -28], raza: 2.5, text: 'Piesele cad și urcă – sari pe ele când sunt jos!' },
    { poz: [3, 2, -47], raza: 2, text: 'Liniile complete se sparg – fugi repede!' },
  ],

  steaguri: [
    { poz: [1, 2, -28], directie: ÎNAINTE },
    { poz: [1, 2, -63], directie: ÎNAINTE },
  ],

  monede: [
    monedaPe(0, 0, -5.25), ...linieMonede([0, 1, -8.25], [0, 1, -12.75], 3),
    monedaPe(1.5, 1, -18.75), monedaPe(3, 2, -23.25),
    [3, 3.2, -33], [3, 3.2, -39.25], [3, 3.2, -42.25], monedaPe(3, 2, -47),
    monedaPe(0, 2, -51.5), monedaPe(6, 2, -54.5), monedaPe(3, 2, -57.5),
    monedaPe(3, 3, -69.25), monedaPe(4.5, 4, -73.75), monedaPe(3.75, 5, -76.75), monedaPe(2.25, 6, -82.75),
    ...linieMonede([0.5, 8, -86], [5.5, 8, -86], 4),
  ],

  final: { poz: [3, 7, -91.5], directie: ÎNAINTE },
};
