// NIVELUL 39 – Parada finală (nivel automat – ultimul din serie!)
// O sărbătoare cu artificii pentru toate nivelurile noi: câte puțin din fiecare!
// Bandă rulantă, trambulină, coridor cu lasere, pod cu pendule, platformă care
// alunecă, un curent care te ridică, pietre care cad și, la final, artificii!
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, banda, trambulina, laserX, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const MOV = 0x6a4aaa;
const ROZ = 0xff5fa8;
const GALBEN = 0xffd23f;
const VERDE = 0x5acf5a;
const PORTOCALIU = 0xff9a3c;

export const nivel39: DefinitieNivel = {
  nume: 'Parada finală',
  tema: 'finala',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, MOV),
    banda(0, 0, -9, 3, 8, 0, -3),                          // banda te duce înainte
    trambulina(0, 0, -16, 3, 3, 18, ROZ),
    bloc(0, 3, -22, 3, 3, GALBEN),
    bloc(0, 3, -30, 3, 10, MOV),                           // coridorul cu lasere
    bloc(0, 3, -39, 6, 6, C.turcoaz),                      // steagul 1
    bloc(0, 3, -50, 2.5, 10, VERDE),                       // podul cu pendule
    mobila(bloc(-3, 3, -59, 3, 3, PORTOCALIU), [6, 0, 0], 3.5),
    bloc(0, 3, -65, 4, 4, ROZ),
    bloc(0, 3, -72, 6, 6, C.turcoaz),                      // steagul 2
    bloc(0, 9, -83.5, 4, 5, GALBEN),                       // sus, unde te duce curentul
    dispare(bloc(-2, 9, -90, 2.5, 2.5, VERDE)),
    dispare(bloc(2, 9, -94, 2.5, 2.5, PORTOCALIU)),
    bloc(0, 9, -101, 8, 8, C.turcoaz),                     // scena cu artificii
  ],

  obstacole: [
    laserX(-28, 3.5, -1.5, 1.5, { clipeste: { perioada: 2 } }),
    laserX(-32, 3.4, -1.5, 1.5, { miscare: { cat: [0, 2.2, 0], perioada: 3 } }),
    { tip: 'pendul', pivot: [0, 7.4, -48], lungime: 3.8, amplitudine: 0.95, perioada: 2.4, axa: 'x' },
    { tip: 'pendul', pivot: [0, 7.4, -52], lungime: 3.8, amplitudine: 0.95, perioada: 2.4, faza: 0.5, axa: 'x' },
    { tip: 'curent', poz: [0, -5, -79], raza: 2, inaltime: 13.2, forta: 14 },
  ],

  indicii: [
    { poz: [0, 0, -2], raza: 2.5, text: 'Marea paradă: câte puțin din toate!' },
    { poz: [0, 9, -101], raza: 3, text: 'Bravo! Ai terminat parada!' },
  ],

  steaguri: [
    { poz: [-2, 3, -39], directie: ÎNAINTE },
    { poz: [-2, 3, -72], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([0, 1, -6], [0, 1, -12], 3),
    [0, 4, -16], monedaPe(0, 3, -22),
    monedaPe(0, 3, -26), monedaPe(0, 3, -30), monedaPe(0, 3, -34),
    ...linieMonede([0, 4, -46], [0, 4, -54], 3),
    [0, 4.2, -59], monedaPe(0, 3, -65),
    ...linieMonede([0, 5, -79], [0, 8, -79], 2), monedaPe(0, 9, -83.5),
    monedaPe(-2, 9, -90), monedaPe(2, 9, -94),
    ...linieMonede([-3, 10, -99], [3, 10, -99], 4),
  ],

  final: { poz: [0, 9, -104.5], directie: ÎNAINTE },
};
