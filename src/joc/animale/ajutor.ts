// Unelte comune pentru „rețetele” de animale (toate sunt făcute din cuburi).
import * as THREE from 'three';

const CUB = new THREE.BoxGeometry(1, 1, 1);
export const NEGRU = 0x151515;

/** Ce întoarce fiecare „rețetă” de animal */
export interface Model {
  grup: THREE.Group;
  picioare: THREE.Object3D[];
  coada: THREE.Object3D;
  /** Iepurele țopăie în loc să meargă */
  topaie?: boolean;
  /** Pinguinul se leagănă dintr-o parte în alta */
  legana?: boolean;
  /** Capul (păsările dau din cap când merg) */
  cap?: THREE.Object3D;
  /** Cât de departe stă în spatele personajului */
  distanta: number;
}

export function cub(l: number, h: number, a: number, culoare: number, x: number, y: number, z: number) {
  const m = new THREE.Mesh(CUB, new THREE.MeshLambertMaterial({ color: culoare }));
  m.scale.set(l, h, a);
  m.position.set(x, y, z);
  return m;
}

/** Un picior cu încheietura sus, ca să se poată mișca */
export function picior(x: number, y: number, z: number, l: number, h: number, culoare: number, copita?: number) {
  const p = new THREE.Group();
  p.position.set(x, y, z);
  p.add(cub(l, h, l, culoare, 0, -h / 2, 0));
  if (copita !== undefined) p.add(cub(l * 1.05, 0.06, l * 1.05, copita, 0, -h + 0.03, 0));
  return p;
}

/** Coada, prinsă de corp într-un punct */
export function coada(x: number, y: number, z: number, ...bucati: THREE.Mesh[]) {
  const c = new THREE.Group();
  c.position.set(x, y, z);
  c.add(...bucati);
  return c;
}

export function inchis(c: number, k = 0.65) { return new THREE.Color(c).multiplyScalar(k).getHex(); }

