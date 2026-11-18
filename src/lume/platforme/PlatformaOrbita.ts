// Platformă care se învârte în cerc, ca o planetă pe orbită în jurul unui soare.
// Te duce cu ea cât stai pe ea (ca platforma mobilă), doar că pe un cerc.
import * as THREE from 'three';
import { Platforma, type DefinitiePlatforma } from '../Platforma';

export class PlatformaOrbita extends Platforma {
  private centru: THREE.Vector3;
  private raza: number;
  private perioada: number;
  private faza: number;
  private noua = new THREE.Vector3();

  constructor(def: DefinitiePlatforma) {
    super(def);
    const o = def.orbita!;
    this.centru = new THREE.Vector3(o.centru[0], def.poz[1], o.centru[1]);
    this.raza = o.raza;
    this.perioada = o.perioada;
    this.faza = o.faza ?? 0;
    this.actualizeaza(0, 0);
    this.deplasare.set(0, 0, 0);
  }

  actualizeaza(_dt: number, timp: number) {
    // unghiul crește încet: o tură întreagă în „perioada” secunde (minus = invers)
    const u = ((timp / this.perioada) + this.faza) * Math.PI * 2;
    this.noua.set(this.centru.x + Math.sin(u) * this.raza, this.centru.y, this.centru.z + Math.cos(u) * this.raza);
    this.deplasare.subVectors(this.noua, this.obiect.position);
    this.obiect.position.copy(this.noua);
    this.actualizeazaCutia();
  }
}
