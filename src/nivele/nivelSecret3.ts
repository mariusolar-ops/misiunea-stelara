// NIVELUL SECRET 3 – Dimensiunea portalelor
// Se deschide doar dacă termini „Cele 10 portale” fără nicio greșeală.
// Un drum curcubeu cu pereți magnetici, portale (toate bune!) care te duc pe insule plutitoare,
// trambuline și un horn de pereți magnetici la final.
import type { DefinitieNivel } from './tipuri';
import { bloc, perete, trambulina, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const CURCUBEU = [0xff5f5f, 0xff9a3c, 0xffd23f, 0x4ccf6a, 0x2ee6d6, 0x8a6cff];

export const nivelSecret3: DefinitieNivel = {
  nume: 'Dimensiunea portalelor',
  tema: 'curcubeu',
  esteSecret: true,
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 8, CURCUBEU[5]),
    bloc(0, 0, -8, 3, 3, CURCUBEU[0]),
    bloc(0, 0.8, -13, 3, 3, CURCUBEU[1]),
    bloc(0, 1.6, -18, 3, 3, CURCUBEU[2]),
    perete(-2.8, -2, -27, 0.6, 7, 12),                     // alergi pe perete peste gol
    bloc(0, 1.6, -37, 5, 5, C.turcoaz),                    // steagul 1 + portalul
    // insula 2 (aici te duce portalul)
    bloc(30, 0, -12, 8, 8, CURCUBEU[3]),
    trambulina(30, 0, -19, 3, 3),
    bloc(30, 5, -25, 3, 3, CURCUBEU[4]),                   // al doilea portal
    // insula 3: hornul magnetic
    bloc(60, 0, -12, 8, 8, C.turcoaz),                     // steagul 2
    bloc(60, 0, -21, 3.2, 6, CURCUBEU[5]),
    perete(58.1, 0, -21, 0.6, 12, 6),
    perete(61.9, 0, -21, 0.6, 12, 6),
    bloc(60, 12, -27.5, 6, 5, CURCUBEU[0]),
    bloc(60, 12, -36, 8, 8, C.turcoaz),                    // finalul
  ],

  obstacole: [
    { tip: 'teleport', poz: [0, 1.6, -39], spre: [30, 0.1, -10], corect: true },
    { tip: 'teleport', poz: [30, 5, -26], spre: [60, 0.1, -10], corect: true },
  ],

  steaguri: [
    { poz: [-2, 1.6, -37], directie: ÎNAINTE },
    { poz: [58, 0, -12], directie: ÎNAINTE },
  ],

  monede: [
    monedaPe(0, 0, -8), monedaPe(0, 0.8, -13), monedaPe(0, 1.6, -18),
    ...linieMonede([-1.9, 3.5, -23], [-1.9, 3.5, -31], 4),
    ...linieMonede([28, 1, -10], [32, 1, -10], 3), [30, 4, -19], monedaPe(30, 5, -25),
    ...linieMonede([60, 2, -21], [60, 10, -21], 4),
    ...linieMonede([57.5, 13, -34], [62.5, 13, -34], 3),
  ],

  final: { poz: [60, 12, -37.5], directie: ÎNAINTE },
};
