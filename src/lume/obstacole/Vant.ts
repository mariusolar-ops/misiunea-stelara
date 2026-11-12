// Zona de vânt: te împinge într-o parte cât timp ești în ea (și în aer, și pe jos).
// Se vede ca niște dungi albe care „zboară” în direcția vântului.
import * as THREE from 'three';
import type { CorpObstacol, EfectObstacol, Obstacol } from './Obstacol';
import type { Punct } from '../../nivele/tipuri';

export interface DefVant {
  tip: 'vant';
  /** Centrul zonei */
  poz: Punct;
  /** Mărimea zonei [x, y, z] */
  dim: Punct;
  /** Direcția și puterea vântului [x, z] (unități pe secundă) */
  forta: [number, number];
}

const MAT = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, depthWrite: false });

export class Vant implements Obstacol {
  obiect = new THREE.Group();
  private dungi: { m: THREE.Mesh; faza: number; y: number; lat: number }[] = [];
  private inauntru = false;

  constructor(private def: DefVant) {
    const [fx, fz] = def.forta;
    const pex = Math.abs(fx) > Math.abs(fz);
    for (let i = 0; i < 10; i++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(pex ? 1.4 : 0.05, 0.05, pex ? 0.05 : 1.4), MAT);
      this.dungi.push({ m, faza: Math.random(), y: (Math.random() - 0.5) * def.dim[1], lat: (Math.random() - 0.5) * (pex ? def.dim[2] : def.dim[0]) });
      this.obiect.add(m);
    }
  }

  actualizeaza(j: CorpObstacol, timp: number): EfectObstacol {
    const [x, y, z] = this.def.poz, [l, h, a] = this.def.dim, [fx, fz] = this.def.forta;
    const pex = Math.abs(fx) > Math.abs(fz);
    const sens = Math.sign(pex ? fx : fz) || 1;
    for (const d of this.dungi) {
      const t = ((timp * 0.6 + d.faza) % 1) - 0.5;
      d.m.position.set(pex ? x + t * l * sens : x + d.lat, y + d.y, pex ? z + d.lat : z + t * a * sens);
    }
    const in_ = Math.abs(j.poz.x - x) < l / 2 && Math.abs(j.poz.z - z) < a / 2 && j.poz.y + 1 > y - h / 2 && j.poz.y < y + h / 2;
    // vântul te mută direct (ca banda rulantă), așa că trebuie să ții joystick-ul împotriva lui
    if (in_ && j.impingere) { j.impingere.x += fx; j.impingere.z += fz; }
    const intrat = in_ && !this.inauntru;
    this.inauntru = in_;
    return intrat ? 'vant' : null;
  }
}
