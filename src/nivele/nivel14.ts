// NIVELUL 14 – Labirintul de cristal
// Un labirint mare, cu pereți de cristal prea înalți ca să sari peste ei. Găsește ieșirea!
// În „fundăturile” labirintului sunt ascunse monede. Camera stă mai sus, ca să vezi drumul.
// Labirintul e făcut din cod (cu numere „la întâmplare”, dar mereu același).
import type { DefinitieNivel, Punct } from './tipuri';
import type { DefinitiePlatforma } from '../lume/Platforma';
import { bloc, CULORI as C } from './ajutoare';

const CELULE = 8;            // 8 x 8 camere
const U = 1.7;               // mărimea unui pătrățel din grilă
const N = CELULE * 2 + 1;    // grila: pereți + camere
const INALTIME_PERETE = 4.6;
const CRISTAL = 0x9ae8ff;

/** Generator de numere „la întâmplare”, dar mereu aceleași */
function aleator(samanta: number) {
  return () => { samanta = (samanta * 1103515245 + 12345) & 0x7fffffff; return samanta / 0x7fffffff; };
}

// --- construim labirintul (algoritmul „mergi înainte, întoarce-te când nu mai poți”) ---
const grila: boolean[][] = Array.from({ length: N }, () => Array(N).fill(true)); // true = perete
const rnd = aleator(7);
const vizitat = new Set<string>();
const stiva: [number, number][] = [[0, 0]];
vizitat.add('0,0');
grila[1][1] = false;
while (stiva.length) {
  const [cx, cy] = stiva[stiva.length - 1];
  const vecini = ([[1, 0], [-1, 0], [0, 1], [0, -1]] as const)
    .map(([dx, dy]) => [cx + dx, cy + dy] as [number, number])
    .filter(([x, y]) => x >= 0 && y >= 0 && x < CELULE && y < CELULE && !vizitat.has(`${x},${y}`));
  if (!vecini.length) { stiva.pop(); continue; }
  const [nx, ny] = vecini[Math.floor(rnd() * vecini.length)];
  grila[cy * 2 + 1 + (ny - cy)][cx * 2 + 1 + (nx - cx)] = false; // deschidem peretele dintre ele
  grila[ny * 2 + 1][nx * 2 + 1] = false;
  vizitat.add(`${nx},${ny}`);
  stiva.push([nx, ny]);
}
// ieșirea: în peretele de jos, lângă colțul opus intrării
grila[N - 1][N - 2] = false;

/** Poziția unui pătrățel din grilă (labirintul e „în fața” startului) */
const pozX = (gx: number) => (gx - (N - 1) / 2) * U;
const pozZ = (gy: number) => -6 - gy * U;

// pereții: lipim pătrățelele vecine de pe același rând într-un singur bloc lung (mai puține obiecte)
const pereti: DefinitiePlatforma[] = [];
for (let gy = 0; gy < N; gy++) {
  let gx = 0;
  while (gx < N) {
    if (!grila[gy][gx]) { gx++; continue; }
    let lung = 1;
    while (gx + lung < N && grila[gy][gx + lung]) lung++;
    pereti.push(bloc(pozX(gx + (lung - 1) / 2), INALTIME_PERETE, pozZ(gy), lung * U, U, CRISTAL, INALTIME_PERETE));
    gx += lung;
  }
}

// monedele: în fundături (camere cu un singur drum)
const monede: Punct[] = [];
for (let cy = 0; cy < CELULE; cy++) for (let cx = 0; cx < CELULE; cx++) {
  const gx = cx * 2 + 1, gy = cy * 2 + 1;
  const deschise = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => !grila[gy + dy][gx + dx]).length;
  if (deschise === 1 && !(cx === 0 && cy === 0)) monede.push([pozX(gx), 1, pozZ(gy)]);
}

const marime = N * U;
const iesireZ = pozZ(N - 1);

export const nivel14: DefinitieNivel = {
  nume: 'Labirintul de cristal',
  tema: 'labirint',
  start: [pozX(1), 0, -2],
  directieStart: Math.PI,
  camera: { inaltime: 1.0, distanta: 9 },
  // monedele sunt multe, dar pentru 3 stele ajung 10
  monedePentru3Stele: Math.min(10, monede.length),

  platforme: [
    bloc(pozX(1), 0, -1, 6, 8, 0x3a5a8a),                              // de aici intri
    bloc(0, 0, pozZ((N - 1) / 2), marime, marime, 0x2a3a6a),           // podeaua labirintului
    // o deschidere în peretele de sus (intrarea): peretele de sus e construit fără pătrățelul [1]
    ...pereti.filter((p) => !(Math.abs(p.poz[2] - pozZ(0)) < 0.01 && p.poz[0] - p.dim[0] / 2 <= pozX(1) && p.poz[0] + p.dim[0] / 2 >= pozX(1))),
    ...((): DefinitiePlatforma[] => {
      // reconstruim peretele de sus fără pătrățelul intrării
      return [bloc(pozX(0), INALTIME_PERETE, pozZ(0), U, U, CRISTAL, INALTIME_PERETE),
        bloc(pozX(2 + (N - 3) / 2), INALTIME_PERETE, pozZ(0), (N - 2) * U, U, CRISTAL, INALTIME_PERETE)];
    })(),
    bloc(pozX(N - 2), 0, iesireZ - 4, 6, 6, C.turcoaz),                // după ieșire: finalul
  ],

  indicii: [
    { poz: [pozX(1), 0, -2], raza: 3, text: 'Găsește ieșirea din labirint!' },
  ],

  steaguri: [],
  monede,

  final: { poz: [pozX(N - 2), 0, iesireZ - 4.5], directie: Math.PI },
};
