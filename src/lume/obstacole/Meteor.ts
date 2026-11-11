// Meteorul: o piatră mare care se rostogolește pe drum, iar și iar, de la un capăt la altul.
// Dacă te lovește, te împinge (și poate cazi!). Ferește-te în lateral sau sari peste el.
import * as THREE from 'three';
import type { CorpObstacol, EfectObstacol, Obstacol } from './Obstacol';
import type { Punct } from '../../nivele/tipuri';

export interface DefMeteor {
  tip: 'meteor';
  /** De unde pornește și unde ajunge (centrul pietrei) */
  de: Punct;
  la: Punct;
  raza: number;
  /** În câte secunde face drumul */
  perioada: number;
  faza?: number;
}

const MAT = new THREE.MeshLambertMaterial({ color: 0x7a5a4a, flatShading: true, emissive: 0x2a0a00 });
const MAT_FOC = new THREE.MeshBasicMaterial({ color: 0xff7a2f, transparent: true, opacity: 0.5, depthWrite: false });

export class Meteor implements Obstacol {
  obiect = new THREE.Group();
  private piatra: THREE.Mesh;
  private de: THREE.Vector3;
  private la: THREE.Vector3;
  private dir: THREE.Vector3;
  private ultima = -9;

  constructor(private def: DefMeteor) {
    this.de = new THREE.Vector3(...def.de);
    this.la = new THREE.Vector3(...def.la);
    this.dir = this.la.clone().sub(this.de).normalize();
    this.piatra = new THREE.Mesh(new THREE.DodecahedronGeometry(def.raza, 0), MAT);
    const foc = new THREE.Mesh(new THREE.DodecahedronGeometry(def.raza * 1.15, 0), MAT_FOC);
    this.obiect.add(this.piatra, foc);
    this.piatra.userData.foc = foc;
  }

  actualizeaza(j: CorpObstacol, timp: number): EfectObstacol {
    const t = (((timp / this.def.perioada) + (this.def.faza ?? 0)) % 1 + 1) % 1;
    const p = this.de.clone().lerp(this.la, t);
    // apare și dispare la capete (se micșorează), ca să nu „sară” dintr-un loc în altul
    const k = Math.min(1, t * 10, (1 - t) * 10);
    this.obiect.position.copy(p);
    this.obiect.scale.setScalar(Math.max(0.01, k));
    // se rostogolește în direcția în care merge
    this.piatra.rotation.set(t * this.de.distanceTo(this.la) / this.def.raza * (this.dir.z < 0 ? -1 : 1), 0, -t * 6 * this.dir.x);
    const dx = j.poz.x - p.x, dz = j.poz.z - p.z, dy = j.poz.y + 0.95 - p.y;
    if (k > 0.8 && Math.hypot(dx, dz) < this.def.raza * k + 0.4 && Math.abs(dy) < this.def.raza + 0.9 && timp - this.ultima > 0.6) {
      this.ultima = timp;
      // te împinge în direcția în care merge meteorul (și puțin în sus)
      j.viteza.x = this.dir.x * 14 + Math.sign(dx || 1) * 3;
      j.viteza.z = this.dir.z * 14;
      j.viteza.y = 7;
      return 'lovitura';
    }
    return null;
  }
}
