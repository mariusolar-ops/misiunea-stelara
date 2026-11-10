// NIVELUL 6 – Laboratorul cu lasere
// Nou: lasere! Cele joase le sari, cele care clipesc le treci când sunt stinse,
// cele care urcă și coboară le treci pe dedesubt sau pe deasupra, iar laserul rotativ îl sari când vine.
// Dacă atingi un laser, te întorci la ultimul steag.
import type { DefinitieNivel } from './tipuri';
import { bloc, laserX, laserZ, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const DREAPTA = Math.PI / 2;
const OTEL = 0x5a6799;
const PANOU = 0x3a4366;

export const nivel6: DefinitieNivel = {
  nume: 'Laboratorul cu lasere',
  tema: 'laborator',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    // --- Partea 1: coridorul cu lasere ---
    bloc(0, 0, 0, 8, 8, OTEL),
    bloc(0, 0, -13, 5, 18, PANOU),
    bloc(0, 0, -27.5, 7, 7, C.turcoaz),               // steagul 1

    // --- Partea 2: sărituri printre lasere și camera cu laserul rotativ ---
    bloc(0, 0, -35.5, 3, 3, OTEL),
    bloc(0, 0.6, -40.5, 3, 3, OTEL),
    bloc(0, 1.2, -45.5, 3, 3, OTEL),
    bloc(0, 1.2, -54, 9, 9, PANOU),                  // camera rotativă
    bloc(0, 2.7, -54, 1, 1, OTEL, 1.5),              // stâlpul din mijloc (ocolește-l!)
    bloc(0, 1.2, -63, 6, 6, C.turcoaz),               // steagul 2

    // --- Partea 3: spre dreapta – „valul” de lasere și gardul care urcă ---
    bloc(10, 1.2, -63, 12, 4, PANOU),
    bloc(20, 1.8, -63, 2.5, 2.5, OTEL),
    bloc(24, 2.4, -63, 2.5, 2.5, OTEL),
    bloc(31, 2.4, -63, 8, 8, C.turcoaz),              // finalul
  ],

  obstacole: [
    // coridor: două lasere joase (sari peste), unul care clipește, unul care urcă și coboară
    laserX(-8, 0.5, -2.5, 2.5),
    laserX(-12, 0.5, -2.5, 2.5),
    laserX(-16, 1.0, -2.5, 2.5, { clipeste: { perioada: 2.4 } }),
    laserX(-20, 0.4, -2.5, 2.5, { miscare: { cat: [0, 2.2, 0], perioada: 3 } }),
    // peste golul de după steagul 1: sari când e stins
    laserX(-32.5, 1.6, -2, 2, { clipeste: { perioada: 2 } }),
    // o rază verticală care măturã platforma
    { tip: 'laser', a: [-1.5, 0.6, -40.5], b: [-1.5, 3.2, -40.5], miscare: { cat: [3, 0, 0], perioada: 2.6 } },
    // laserul rotativ din cameră
    { tip: 'laserRotativ', centru: [0, 1.65, -54], raza: 4.3, viteza: 1.6 },
    // „valul”: trei lasere care clipesc pe rând
    laserZ(7, 2.2, -65, -61, { clipeste: { perioada: 2, faza: 0 } }),
    laserZ(10, 2.2, -65, -61, { clipeste: { perioada: 2, faza: 0.33 } }),
    laserZ(13, 2.2, -65, -61, { clipeste: { perioada: 2, faza: 0.66 } }),
    laserZ(15, 1.7, -65, -61),
    // gardul de la final: urcă și coboară – treci pe dedesubt când e sus
    laserZ(29.5, 2.8, -67, -59, { miscare: { cat: [0, 2.4, 0], perioada: 2.5 } }),
  ],

  steaguri: [
    { poz: [-2.2, 0, -27.5], directie: ÎNAINTE },
    { poz: [-2, 1.2, -63], directie: DREAPTA },
  ],

  monede: [
    ...linieMonede([0, 1, -6], [0, 1, -22], 6),
    monedaPe(0, 0, -35.5),
    monedaPe(0, 0.6, -40.5),
    monedaPe(0, 1.2, -45.5),
    ...linieMonede([-3.5, 2.2, -51], [-3.5, 2.2, -57], 3),
    ...linieMonede([3.5, 2.2, -51], [3.5, 2.2, -57], 3),
    ...linieMonede([5.5, 2.2, -63], [14, 2.2, -63], 4),
    monedaPe(20, 1.8, -63),
    monedaPe(24, 2.4, -63),
    ...linieMonede([28, 3.4, -65], [28, 3.4, -61], 3),
  ],

  final: { poz: [33, 2.4, -63], directie: DREAPTA },

  // Steaua de aur: chiar pe stâlpul laserului rotativ! Sari pe el când trece laserul.
  secret: [0, 3.9, -54],
};
