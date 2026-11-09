// Cristalele: ies din podea și intră la loc, pe rând. Când sunt afară, nu le atinge!
// Înainte să iasă, tremură puțin – ăsta e semnalul să te grăbești.
import * as THREE from 'three';
import type { CorpObstacol, EfectObstacol, Obstacol } from './Obstacol';
import type { Punct } from '../../nivele/tipuri';

export interface DefCristale {
  tip: 'cristale';
  /** Centrul zonei, la nivelul podelei [x, sus, z] */
  poz: Punct;
  /** Mărimea zonei [pe x, pe z] */
  dim: [number, number];
  perioada: number;
  faza?: number;
}

const FORMA = new THREE.ConeGeometry(0.22, 0.8, 5);
const MAT = new THREE.MeshLambertMaterial({ color: 0x6ff0ff, emissive: 0x1a7a90 });
const INALTIME = 0.8;

export class Cristale implements Obstacol {
  obiect = new THREE.Group();
  private ridicare = 0; // 0 = în podea, 1 = afară de tot

  constructor(private def: DefCristale) {
    const [x, y, z] = def.poz;
    const [l, a] = def.dim;
    const nx = Math.max(1, Math.round(l / 0.6)), nz = Math.max(1, Math.round(a / 0.6));
    for (let i = 0; i < nx; i++) for (let k = 0; k < nz; k++) {
      const c = new THREE.Mesh(FORMA, MAT);
      c.position.set(x - l / 2 + (i + 0.5) * (l / nx), 0, z - a / 2 + (k + 0.5) * (a / nz));
      c.rotation.y = (i * 7 + k * 3) % 5;
      this.obiect.add(c);
    }
    this.obiect.position.y = y;
  }

  actualizeaza(j: CorpObstacol, timp: number): EfectObstacol {
    const t = (((timp / this.def.perioada) + (this.def.faza ?? 0)) % 1 + 1) % 1;
    // 0..0.45 afară, 0.45..0.55 intră, 0.55..0.9 în podea, 0.9..1 tremură și ies
    let tinta = t < 0.45 ? 1 : t < 0.9 ? 0 : 0.12;
    if (t >= 0.9) tinta += Math.sin(timp * 60) * 0.05;
    this.ridicare += (tinta - this.ridicare) * 0.35;
    for (const c of this.obiect.children) {
      c.scale.y = Math.max(0.05, this.ridicare);
      c.position.y = (INALTIME * this.ridicare) / 2 - 0.05;
    }
    if (this.ridicare < 0.5) return null;
    const [x, y, z] = this.def.poz;
    const [l, a] = this.def.dim;
    const inZona = Math.abs(j.poz.x - x) < l / 2 + 0.3 && Math.abs(j.poz.z - z) < a / 2 + 0.3;
    return inZona && j.poz.y < y + INALTIME * this.ridicare - 0.05 ? 'cristal' : null;
  }
}
