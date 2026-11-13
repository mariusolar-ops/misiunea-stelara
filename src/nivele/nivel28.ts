// NIVELUL 28 – Tabla de șah cosmică (nivel automat)
// O tablă de șah uriașă care plutește prin spațiu. Pe tablă, unele pătrățele sunt
// de lavă – calcă doar pe cele albe și negre! Apoi treci de turnurile care alunecă
// (ca tura la șah), sari peste raza reginei care se învârte, urcă în „L”
// ca un cal de șah și traversează a doua tablă, unde unele pătrățele se prăbușesc.
import type { DefinitieNivel } from './tipuri';
import type { DefinitiePlatforma } from '../lume/Platforma';
import type { Punct } from './tipuri';
import { bloc, mobila, dispare, lava, monedaPe, linieMonede, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const ALB = 0xf0eee6;
const NEGRU = 0x34344a;
const TURN = 0x8a6cff;
const CAL = 0xffd23f;

/**
 * Construiește o tablă din rânduri de text:
 *  '.' = pătrățel bun (alb/negru pe rând), 'L' = lavă, 'D' = pătrățel care se prăbușește
 * Primul rând e cel mai aproape de tine.
 */
function tabla(randuri: string[], sus: number, z0: number): { platforme: DefinitiePlatforma[]; monede: Punct[] } {
  const platforme: DefinitiePlatforma[] = [];
  const monede: Punct[] = [];
  randuri.forEach((rand, r) => {
    [...rand].forEach((ch, c) => {
      const x = (c - 2) * 2, z = z0 - r * 2;
      const culoare = (r + c) % 2 ? NEGRU : ALB;
      if (ch === 'L') platforme.push(lava(x, sus, z, 2, 2));
      else if (ch === 'D') platforme.push(dispare(bloc(x, sus, z, 2, 2, culoare)));
      else {
        platforme.push(bloc(x, sus, z, 2, 2, culoare));
        if ((r + c) % 3 === 0) monede.push(monedaPe(x, sus, z));
      }
    });
  });
  return { platforme, monede };
}

// prima tablă: găsește drumul prin lavă
const tabla1 = tabla([
  'LL.LL',
  'L..LL',
  'L.LLL',
  'L...L',
  'LLL.L',
  'LL..L',
], 0, -5);

// a doua tablă: două coloane, cu pătrățele care se prăbușesc
const tabla2 = tabla([
  'L.L.L',
  'LDLDL',
  'L.L.L',
  'LDLDL',
  'L.L.L',
  'L...L',
], 4, -72);

export const nivel28: DefinitieNivel = {
  nume: 'Tabla de șah cosmică',
  tema: 'sah',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, ALB),
    ...tabla1.platforme,
    bloc(0, 0, -20, 6, 6, C.turcoaz),                     // steagul 1
    // turnurile alunecă dintr-o parte în alta, ca tura la șah
    mobila(bloc(-4, 0, -27, 3, 3, TURN), [8, 0, 0], 3.5),
    mobila(bloc(4, 0, -32, 3, 3, TURN), [-8, 0, 0], 3.5),
    bloc(0, 0, -37, 3, 3, NEGRU),
    bloc(0, 0, -44, 8, 8, ALB),                           // pătratul reginei
    // săritura calului: în „L”, tot mai sus
    bloc(2, 1, -51, 2.5, 2.5, CAL),
    bloc(-2, 2, -54, 2.5, 2.5, CAL),
    bloc(2, 3, -57, 2.5, 2.5, CAL),
    bloc(-2, 4, -60, 2.5, 2.5, CAL),
    bloc(0, 4, -66, 6, 6, C.turcoaz),                     // steagul 2
    ...tabla2.platforme,
    bloc(0, 4, -88, 8, 8, C.turcoaz),                     // finalul – șah mat!
  ],

  obstacole: [
    // raza reginei se învârte pe pătratul ei
    { tip: 'laserRotativ', centru: [0, 0.45, -44], raza: 3.8, viteza: 1.8 },
  ],

  indicii: [
    { poz: [0, 0, -2], raza: 2.5, text: 'Nu călca pe pătrățelele de lavă!' },
    { poz: [0, 0, -37], raza: 2, text: 'Sari peste raza reginei!' },
  ],

  steaguri: [
    { poz: [-2, 0, -20], directie: ÎNAINTE },
    { poz: [-2, 4, -66], directie: ÎNAINTE },
  ],

  monede: [
    ...tabla1.monede,
    [0, 1.2, -27], [0, 1.2, -32], monedaPe(0, 0, -37),
    monedaPe(-3, 0, -41), monedaPe(3, 0, -47),
    monedaPe(2, 1, -51), monedaPe(-2, 2, -54), monedaPe(2, 3, -57), monedaPe(-2, 4, -60),
    ...tabla2.monede,
    ...linieMonede([-2.5, 5, -86], [2.5, 5, -86], 3),
  ],

  final: { poz: [0, 4, -91.5], directie: ÎNAINTE },
};
