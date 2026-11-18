// NIVELUL 40 – Lumea din cuburi (cerut de Mihai: „elemente ca în jocurile cu cuburi”)
// Totul e făcut din blocuri pixelate: iarbă, pământ, piatră, lemn, frunze, nisip.
// Sari din bloc în bloc, treci podul de scânduri peste lavă, intră în mină pe lângă
// minereul de cristal, ferește-te de blocurile de nisip care cad, sari pe blocul
// săltăreț, mergi contra apei care curge și urcă în copacul uriaș până la portal.
// (Toate blocurile sunt desenate din cod – nimic copiat din alt joc.)
import type { DefinitieNivel } from './tipuri';
import type { DefinitiePlatforma } from '../lume/Platforma';
import type { Pixeli } from '../lume/TexturiPixeli';
import { bloc, dispare, lava, trambulina, banda, linieMonede, monedaPe } from './ajutoare';

const ÎNAINTE = Math.PI;

/** Un bloc pixelat; „margine” e culoarea dungilor de pe muchii */
function cub(x: number, sus: number, z: number, l: number, a: number, pixeli: Pixeli, margine = 0x2a2a2a, h = 1): DefinitiePlatforma {
  return { ...bloc(x, sus, z, l, a, margine, h), pixeli };
}

export const nivel40: DefinitieNivel = {
  nume: 'Lumea din cuburi',
  tema: 'cuburi',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    cub(0, 0, 0, 8, 6, 'iarba', 0x3a6a2a),
    // blocuri pe rând, din unul în altul
    cub(0, 0, -5, 1.5, 1.5, 'iarba', 0x3a6a2a),
    cub(0, 1, -8, 1.5, 1.5, 'pamant', 0x4a3220),
    cub(1.5, 2, -10.5, 1.5, 1.5, 'iarba', 0x3a6a2a),
    cub(0, 2, -13.5, 1.5, 1.5, 'piatra', 0x4a4a4a),
    // podul de scânduri peste lavă
    cub(0, 2, -19, 2, 8, 'scanduri', 0x6a4a28),
    lava(0, -2, -19, 8, 8),
    cub(0, 2, -27, 6, 6, 'iarba', 0x2ee6d6),               // steagul 1
    // mina: piatră, minereu și blocuri de nisip care cad
    cub(0, 2, -34, 3, 3, 'piatra', 0x4a4a4a),
    dispare(bloc(-1.5, 2, -38.5, 2, 2, 0xe0d090)),
    dispare(bloc(1.5, 2, -41.5, 2, 2, 0xe0d090)),
    dispare(bloc(-1.5, 2, -44.5, 2, 2, 0xe0d090)),
    cub(0, 2, -49, 3, 3, 'minereu', 0x2ee6d6),
    trambulina(0, 2, -54, 2, 2, 18, 0x7ad04a),             // blocul săltăreț
    cub(0, 5, -59.5, 3, 3, 'lemn', 0x4a321c),
    { ...banda(0, 5, -66, 3, 8, 0, 2.5), culoare: 0x3a6adf }, // apa care curge spre tine
    cub(0, 5, -74, 6, 6, 'iarba', 0x2ee6d6),               // steagul 2
    // urcarea în copacul uriaș, pe blocuri de frunze
    cub(-1.5, 6, -80, 2, 2, 'frunze', 0x1e4a16),
    cub(1.5, 7, -83, 2, 2, 'frunze', 0x1e4a16),
    cub(-1.5, 8, -86, 2, 2, 'frunze', 0x1e4a16),
    cub(1.5, 9, -89, 2, 2, 'frunze', 0x1e4a16),
    cub(0, 9, -95, 8, 8, 'cristal', 0x2ee6d6),            // vârful copacului, cu portalul
  ],

  indicii: [
    { poz: [0, 0, -2], raza: 2.5, text: 'Sari din bloc în bloc!' },
    { poz: [0, 2, -34], raza: 2, text: 'Blocurile de nisip cad – fugi repede!' },
    { poz: [0, 5, -59.5], raza: 2, text: 'Apa curge spre tine – fugi contra ei!' },
  ],

  steaguri: [
    { poz: [-2, 2, -27], directie: ÎNAINTE },
    { poz: [-2, 5, -74], directie: ÎNAINTE },
  ],

  monede: [
    monedaPe(0, 0, -5), monedaPe(0, 1, -8), monedaPe(1.5, 2, -10.5), monedaPe(0, 2, -13.5),
    ...linieMonede([0, 3, -16], [0, 3, -22], 3),
    monedaPe(0, 2, -34),
    monedaPe(-1.5, 2, -38.5), monedaPe(1.5, 2, -41.5), monedaPe(-1.5, 2, -44.5),
    monedaPe(0, 2, -49), [0, 6, -54], monedaPe(0, 5, -59.5),
    ...linieMonede([0, 6, -63], [0, 6, -69], 3),
    monedaPe(-1.5, 6, -80), monedaPe(1.5, 7, -83), monedaPe(-1.5, 8, -86), monedaPe(1.5, 9, -89),
    ...linieMonede([-2.5, 10, -93], [2.5, 10, -93], 3),
  ],

  final: { poz: [0, 9, -98.5], directie: ÎNAINTE },
};
