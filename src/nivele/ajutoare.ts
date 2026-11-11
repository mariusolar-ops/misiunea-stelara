// Mici unelte ca nivelurile să se scrie ușor.
import type { DefinitiePlatforma } from '../lume/Platforma';
import type { Punct } from './tipuri';
import type { DefLaser } from '../lume/obstacole/Laser';

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

// --- Platforme speciale (primesc un „bloc” și îi schimbă tipul) ---

/** Platformă care se mișcă: „cat” = cât se deplasează [x, y, z], „perioada” = secunde dus-întors */
export function mobila(b: DefinitiePlatforma, cat: Punct, perioada: number, faza = 0): DefinitiePlatforma {
  return { ...b, tip: 'miscare', miscare: { cat, perioada, faza } };
}

/** Bloc care dispare după ce calci pe el */
export function dispare(b: DefinitiePlatforma): DefinitiePlatforma {
  return { ...b, tip: 'dispare' };
}

/** Lavă: te trimite înapoi la steag */
export function lava(x: number, sus: number, z: number, l: number, a: number): DefinitiePlatforma {
  return { ...bloc(x, sus, z, l, a, 0xff7a2f), tip: 'lava' };
}

/** Trambulină: te aruncă în sus (forța 20 = cam 6 unități înălțime) */
export function trambulina(x: number, sus: number, z: number, l: number, a: number, forta = 20, culoare: number = CULORI.lime): DefinitiePlatforma {
  return { ...bloc(x, sus, z, l, a, culoare, 0.6), tip: 'trambulina', forta };
}

/** Bandă rulantă: te împinge cu viteza [vx, vz] */
export function banda(x: number, sus: number, z: number, l: number, a: number, vx: number, vz: number): DefinitiePlatforma {
  return { ...bloc(x, sus, z, l, a, 0xffd23f), tip: 'banda', viteza: [vx, vz] };
}

/** Gheață: aluneci pe ea */
export function gheata(x: number, sus: number, z: number, l: number, a: number): DefinitiePlatforma {
  return { ...bloc(x, sus, z, l, a, 0x9fdcff), tip: 'gheata' };
}

// --- Lasere (raze drepte) ---
type ExtraLaser = Pick<DefLaser, 'clipeste' | 'miscare'>;

/** Laser de-a curmezișul drumului, pe direcția x (de la x1 la x2), la adâncimea z și înălțimea y */
export function laserX(z: number, y: number, x1: number, x2: number, extra: ExtraLaser = {}): DefLaser {
  return { tip: 'laser', a: [x1, y, z], b: [x2, y, z], ...extra };
}

/** Laser de-a curmezișul drumului, pe direcția z (de la z1 la z2), la x și înălțimea y */
export function laserZ(x: number, y: number, z1: number, z2: number, extra: ExtraLaser = {}): DefLaser {
  return { tip: 'laser', a: [x, y, z1], b: [x, y, z2], ...extra };
}

/**
 * Perete magnetic (mov): poți alerga pe el și sări de pe el.
 * @param jos  de la ce înălțime începe peretele
 * @param h    cât de înalt e
 * @param l,a  grosimea/lungimea pe x și pe z (unul din ele e subțire, ex. 0.6)
 */
export function perete(x: number, jos: number, z: number, l: number, h: number, a: number): DefinitiePlatforma {
  return { ...bloc(x, jos + h, z, l, a, 0x8a3aff, h), tip: 'perete' };
}

/** O mare de lavă care urcă și coboară (vulcanul care erupe): „cat” = cât urcă, „perioada” = secunde */
export function lavaCareUrca(x: number, sus: number, z: number, l: number, a: number, cat: number, perioada: number): DefinitiePlatforma {
  return { ...bloc(x, sus, z, l, a, 0xff7a2f, 12), tip: 'lava', miscare: { cat: [0, cat, 0], perioada } };
}
