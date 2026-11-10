// NIVELUL 11 – Turnul spre stele
// Urci în spirală în jurul unui turn uriaș, până în vârf. Pe drum: blocuri care dispar,
// platforme care urcă și coboară și două lasere care se învârt în jurul turnului.
import type { DefinitieNivel, Punct } from './tipuri';
import type { DefinitiePlatforma } from '../lume/Platforma';
import { bloc, mobila, dispare, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const TURN = 0x3a4a7a;
const TREAPTA = 0x7fa0e0;

// Spirala: 24 de trepte în jurul turnului (centrul la z = -30), fiecare cu 1,1 mai sus
const CENTRU_Z = -30;
const RAZA = 5.4;   // destul de departe încât treptele să nu intre în colțurile turnului
const PAS_UNGHI = (50 * Math.PI) / 180;
const NR_TREPTE = 24;

function treapta(i: number) {
  const u = i * PAS_UNGHI;
  return { x: RAZA * Math.sin(u), y: 1.1 * (i + 1), z: CENTRU_Z + RAZA * Math.cos(u), u };
}
/** Direcția în care urci spirala, într-un punct (ca să revii cu fața spre drum după o cădere) */
function directie(u: number) { return Math.atan2(Math.cos(u), -Math.sin(u)); }

const STEAGURI = [7, 15];      // treptele mai mari, cu steag
const DISPAR = [4, 5, 12, 13, 21];
const MOBILE = [10, 19];

const trepte: DefinitiePlatforma[] = [];
const monede: Punct[] = [];
for (let i = 0; i < NR_TREPTE; i++) {
  const t = treapta(i);
  const mare = STEAGURI.includes(i);
  const marime = mare ? 3.2 : 2.5;
  const culoare = mare ? C.turcoaz : DISPAR.includes(i) ? C.roz : MOBILE.includes(i) ? C.portocaliu : TREAPTA;
  let p = bloc(t.x, t.y, t.z, marime, marime, culoare);
  if (DISPAR.includes(i)) p = dispare(p);
  if (MOBILE.includes(i)) p = mobila(bloc(t.x, t.y - 0.8, t.z, marime, marime, culoare), [0, 1.6, 0], 3);
  trepte.push(p);
  monede.push(monedaPe(t.x, t.y, t.z));
}

export const nivel11: DefinitieNivel = {
  nume: 'Turnul spre stele',
  tema: 'turn',
  start: [0, 0, -18.5],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, -20, 8, 6, TREAPTA),                 // de aici pornești
    bloc(0, 28, -30, 5, 5, TURN, 40),               // turnul (vârful lui e finalul)
    ...trepte,
  ],

  obstacole: [
    // două lasere care se învârt în jurul turnului, la înălțimea a două trepte
    { tip: 'laserRotativ', centru: [0, treapta(9).y + 0.45, CENTRU_Z], raza: 7.2, viteza: 1.1 },
    { tip: 'laserRotativ', centru: [0, treapta(18).y + 0.45, CENTRU_Z], raza: 7.2, viteza: -1.3 },
  ],

  steaguri: STEAGURI.map((i) => {
    const t = treapta(i);
    return { poz: [t.x, t.y, t.z] as Punct, directie: directie(t.u) };
  }),

  monede: [...monede, [-1.5, 29, -30], [1.5, 29, -30]],

  final: { poz: [0, 28, -30], directie: 0 },
};
