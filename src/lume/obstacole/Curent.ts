// Curentul de aer: o coloană care te ridică în sus cât timp ești în ea.
// Se vede ca un cilindru transparent cu inele care urcă.
import * as THREE from 'three';
import type { CorpObstacol, EfectObstacol, Obstacol } from './Obstacol';
import type { Punct } from '../../nivele/tipuri';

export interface DefCurent {
  tip: 'curent';
  /** Centrul bazei coloanei [x, jos, z] */
  poz: Punct;
  raza: number;
  inaltime: number;
  /** Cât de repede te ridică (unități pe secundă) */
  forta: number;
}

const GRAVITATIE = 34;      // aceeași ca la personaj
const PESTE_VARF = 1.3;     // cât de sus te aruncă peste vârful coloanei

const MAT_COLOANA = new THREE.MeshBasicMaterial({ color: 0x9ffcf3, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide });
const MAT_INEL = new THREE.MeshBasicMaterial({ color: 0xd8fffb, transparent: true, opacity: 0.55, depthWrite: false });

export class Curent implements Obstacol {
  obiect = new THREE.Group();
  private inele: THREE.Mesh[] = [];
  private inauntru = false;

  constructor(private def: DefCurent) {
    const [x, y, z] = def.poz;
    const coloana = new THREE.Mesh(new THREE.CylinderGeometry(def.raza, def.raza, def.inaltime, 16, 1, true), MAT_COLOANA);
    coloana.position.set(x, y + def.inaltime / 2, z);
    this.obiect.add(coloana);
    const formaInel = new THREE.TorusGeometry(def.raza * 0.85, 0.05, 4, 20).rotateX(Math.PI / 2);
    for (let i = 0; i < 4; i++) {
      const inel = new THREE.Mesh(formaInel, MAT_INEL);
      inel.position.set(x, y, z);
      this.inele.push(inel);
      this.obiect.add(inel);
    }
  }

  actualizeaza(j: CorpObstacol, timp: number): EfectObstacol {
    const [x, y, z] = this.def.poz;
    // inelele urcă continuu
    this.inele.forEach((inel, i) => {
      const t = ((timp * 0.5 + i / this.inele.length) % 1);
      inel.position.y = y + t * this.def.inaltime;
      inel.scale.setScalar(1 - t * 0.3);
    });
    const inauntru = Math.hypot(j.poz.x - x, j.poz.z - z) < this.def.raza &&
      j.poz.y > y - 1 && j.poz.y < y + this.def.inaltime;
    const intrat = inauntru && !this.inauntru;
    this.inauntru = inauntru;
    if (inauntru) {
      // te ridică repede, dar încetinește aproape de vârf: așa ajungi mereu cam la aceeași înălțime
      const varf = y + this.def.inaltime + PESTE_VARF;
      const vTinta = Math.min(this.def.forta, Math.sqrt(2 * GRAVITATIE * Math.max(0, varf - j.poz.y)));
      j.viteza.y = Math.max(j.viteza.y, vTinta);
    }
    return intrat ? 'vant' : null;
  }
}
