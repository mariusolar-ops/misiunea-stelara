// Mici unelte ca nivelurile să se scrie ușor.
import type { DefinitiePlatforma } from '../lume/Platforma';
import type { Punct } from './tipuri';

// Paleta de culori a jocului
export const CULORI = {
  turcoaz: 0x2ee6d6,
  portocaliu: 0xff9a3c,
  lime: 0xa6f04a,
  roz: 0xff5fa8,
  mov: 0x8a6cff,
  gri: 0xc3c7d6,
  griInchis: 0x7d8299,
};

/**
 * O platformă dată prin „unde e fața de sus”, nu prin centru – mult mai ușor de gândit.
 * @param x,z  centrul pe orizontală
 * @param sus  înălțimea suprafeței pe care calci
 * @param l,a  lățimea (pe x) și adâncimea (pe z)
 * @param h    grosimea (implicit 1)
 */
export function bloc(x: number, sus: number, z: number, l: number, a: number, culoare: number, h = 1): DefinitiePlatforma {
  return { poz: [x, sus - h / 2, z], dim: [l, h, a], culoare };
}

/** n monede puse la distanțe egale între punctele a și b (inclusiv capetele) */
export function linieMonede(a: Punct, b: Punct, n: number): Punct[] {
  const rez: Punct[] = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    rez.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
  }
  return rez;
}

/** O monedă care plutește deasupra unei platforme (la 1 unitate peste suprafață) */
export function monedaPe(x: number, sus: number, z: number): Punct {
  return [x, sus + 1, z];
}
