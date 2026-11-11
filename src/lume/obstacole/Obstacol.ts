// Obstacolele sunt lucruri prin care NU calci: lasere, pendule, curenți de aer, cristale.
// Fiecare verifică singur dacă l-a atins pe personaj și spune ce s-a întâmplat.
import * as THREE from 'three';

/** Ce trebuie să știe un obstacol despre personaj */
export interface CorpObstacol {
  poz: THREE.Vector3;     // la tălpi
  viteza: THREE.Vector3;
}

/**
 * laser / cristal = personajul se întoarce la steag
 * lovitura = l-a împins un pendul (doar pentru sunet)
 * vant = a intrat într-un curent de aer (doar pentru sunet)
 */
export type EfectObstacol = 'laser' | 'cristal' | 'lovitura' | 'vant' | 'portal-bun' | 'portal-gresit' | null;

export interface Obstacol {
  obiect: THREE.Object3D;
  /** Mișcă obstacolul și verifică personajul (la fiecare pas de fizică) */
  actualizeaza(j: CorpObstacol, timp: number, dt: number): EfectObstacol;
}

/** Distanța de la punctul p la segmentul [a, b] */
export function distantaLaSegment(p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3) {
  const ab = b.clone().sub(a);
  const t = THREE.MathUtils.clamp(p.clone().sub(a).dot(ab) / Math.max(ab.lengthSq(), 1e-6), 0, 1);
  return p.distanceTo(a.clone().addScaledVector(ab, t));
}
