// Platformă care se mișcă dus-întors, lin (încetinește la capete).
import * as THREE from 'three';
import { Platforma, type DefinitiePlatforma } from '../Platforma';

export class PlatformaMobila extends Platforma {
  private start: THREE.Vector3;
  private cat: THREE.Vector3;
  private perioada: number;
  private faza: number;

  constructor(def: DefinitiePlatforma) {
    super(def);
    this.start = new THREE.Vector3(...def.poz);
    this.cat = new THREE.Vector3(...(def.miscare?.cat ?? [0, 0, 0]));
    this.perioada = def.miscare?.perioada ?? 4;
    this.faza = def.miscare?.faza ?? 0;
  }

  actualizeaza(_dt: number, timp: number) {
    // k merge lin de la 0 la 1 și înapoi
    const k = 0.5 - 0.5 * Math.cos(((timp / this.perioada) + this.faza) * Math.PI * 2);
    const noua = this.start.clone().addScaledVector(this.cat, k);
    this.deplasare.subVectors(noua, this.obiect.position);
    this.obiect.position.copy(noua);
    this.actualizeazaCutia();
  }
}
