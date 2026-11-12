// NIVELUL 21 – Discoteca spațială (nivel automat)
// Un ring de dans cu plăci colorate care dispar dacă stai pe ele (nu te opri din dans!),
// un coridor cu lasere care clipesc pe rând, ca un val pe ritmul muzicii, trambulină,
// o platformă care dansează stânga-dreapta și un laser rotativ ca o lumină de discotecă.
import type { DefinitieNivel, Punct } from './tipuri';
import type { DefinitiePlatforma } from '../lume/Platforma';
import { bloc, mobila, dispare, trambulina, laserX, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const PODEA = 0x2a1a4a;
const CULORI_RING = [0xff5fa8, 0x2ee6d6, 0xffd23f, 0x8a6cff];

// ringul de dans: 3 x 4 plăci care dispar
const ring: DefinitiePlatforma[] = [];
const moneziRing: Punct[] = [];
for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
  const x = (c - 1) * 2.5, z = -6.25 - r * 2.5;
  ring.push(dispare(bloc(x, 0, z, 2.5, 2.5, CULORI_RING[(r + c) % 4])));
  if ((r + c) % 2 === 0) moneziRing.push(monedaPe(x, 0, z));
}

export const nivel21: DefinitieNivel = {
  nume: 'Discoteca spațială',
  tema: 'disco',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 8, PODEA),
    ...ring,
    bloc(0, 0, -20, 6, 6, C.turcoaz),                     // steagul 1
    bloc(0, 0, -31, 4, 12, PODEA),                        // coridorul cu lasere
    bloc(0, 0, -42, 6, 6, C.turcoaz),                     // steagul 2
    trambulina(0, 0, -49, 3, 3, 20, C.roz),
    bloc(0, 5, -55, 3, 3, PODEA),
    mobila(bloc(-3, 5, -61, 3, 3, C.portocaliu), [6, 0, 0], 2.4),
    bloc(0, 5, -69, 8, 8, PODEA),                         // ringul cu laserul rotativ
    bloc(0, 6.5, -69, 1, 1, 0xd8dce8, 1.5),               // stâlpul lui
    bloc(0, 5, -79, 8, 8, C.turcoaz),                     // finalul
  ],

  obstacole: [
    // valul de lasere: se aprind pe rând, unul după altul
    laserX(-27, 0.5, -2, 2, { clipeste: { perioada: 1.6, pornit: 0.5, faza: 0 } }),
    laserX(-30, 0.5, -2, 2, { clipeste: { perioada: 1.6, pornit: 0.5, faza: 0.25 } }),
    laserX(-33, 0.5, -2, 2, { clipeste: { perioada: 1.6, pornit: 0.5, faza: 0.5 } }),
    laserX(-36, 0.5, -2, 2, { clipeste: { perioada: 1.6, pornit: 0.5, faza: 0.75 } }),
    { tip: 'laserRotativ', centru: [0, 5.45, -69], raza: 3.8, viteza: 2 },
  ],

  indicii: [
    { poz: [0, 0, 1], raza: 3, text: 'Dansează! Plăcile dispar dacă stai pe ele.' },
  ],

  steaguri: [
    { poz: [-2, 0, -20], directie: ÎNAINTE },
    { poz: [-2, 0, -42], directie: ÎNAINTE },
  ],

  monede: [
    ...moneziRing,
    monedaPe(0, 0, -27), monedaPe(0, 0, -30), monedaPe(0, 0, -33), monedaPe(0, 0, -36),
    [0, 3, -49], monedaPe(0, 5, -55), [0, 6.2, -61],
    monedaPe(-3, 5, -66), monedaPe(3, 5, -66), monedaPe(-3, 5, -72), monedaPe(3, 5, -72),
    monedaPe(-2.5, 5, -77), monedaPe(2.5, 5, -77),
  ],

  final: { poz: [0, 5, -80.5], directie: ÎNAINTE },
};
