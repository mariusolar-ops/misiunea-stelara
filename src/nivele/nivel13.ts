// NIVELUL 13 – Cele 10 portale (ideea lui Mihai)
// Camera 1: 10 portale – 9 greșite, 1 corect.  Camera 2: 5 portale – 4 greșite, 1 corect.
// Camera 3: 2 portale – 1 corect, 1 greșit. Portalul greșit te trimite la începutul camerei.
// Portalele corecte sunt mereu aceleași, așa că le poți ține minte.
// Indiciu: steluța din vârful portalului corect se învârte INVERS față de celelalte!
// Dacă termini fără nicio greșeală, se deschide un nivel secret.
import type { DefinitieNivel, Punct } from './tipuri';
import type { DefTeleport } from '../lume/obstacole/Teleport';
import { bloc, linieMonede, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const PODEA = 0x3a2a6b;

// unde ajungi în fiecare cameră
const START_1: Punct = [0, 0.1, -9];
const START_2: Punct = [0, 0.1, -41];
const START_3: Punct = [0, 0.1, -61];
const FINAL: Punct = [0, 0.1, -81];

/** Un rând de portale; doar cel cu numărul „corect” te duce mai departe */
function rand(nr: number, corect: number, z: number, pas: number, inapoi: Punct, inainte: Punct): DefTeleport[] {
  return Array.from({ length: nr }, (_, i) => ({
    tip: 'teleport' as const,
    poz: [(i - (nr - 1) / 2) * pas, 0, z] as Punct,
    spre: i === corect ? inainte : inapoi,
    corect: i === corect,
  }));
}

export const nivel13: DefinitieNivel = {
  nume: 'Cele 10 portale',
  tema: 'portale',
  nivelPortale: true,
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 8, PODEA),
    bloc(0, 0, -14, 28, 14, PODEA),                 // camera 1
    bloc(0, 0, -45, 16, 12, PODEA),                 // camera 2
    bloc(0, 0, -64, 10, 10, PODEA),                 // camera 3
    bloc(0, 0, -84, 8, 8, C.turcoaz),               // finalul
  ],

  obstacole: [
    ...rand(10, 6, -20, 2.6, START_1, START_2),
    ...rand(5, 1, -50, 2.6, START_2, START_3),
    ...rand(2, 1, -68, 4, START_3, FINAL),
  ],

  indicii: [
    { poz: [0, 0, -9], raza: 3, text: 'Alege portalul corect! Uită-te bine la steluțe…' },
  ],

  steaguri: [],

  monede: [
    ...linieMonede([-10, 1, -10], [10, 1, -10], 6),
    ...linieMonede([-6, 1, -42], [6, 1, -42], 4),
    ...linieMonede([-3, 1, -61], [3, 1, -61], 3),
    ...linieMonede([-2.5, 1, -82], [2.5, 1, -82], 3),
  ],

  final: { poz: [0, 0, -86], directie: ÎNAINTE },
};
