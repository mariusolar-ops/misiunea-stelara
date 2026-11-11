// Lavă: dacă o atingi, revii la ultimul steag. Strălucește și „pulsează”.
import * as THREE from 'three';
import { Platforma, type DefinitiePlatforma, type CorpJucator, type EfectCalcare } from '../Platforma';

// Un singur material pentru toată lava din nivel – îl animăm o dată
const MATERIAL_LAVA = new THREE.MeshLambertMaterial({ color: 0xff5a1f, emissive: 0xc22a00 });

export class Lava extends Platforma {
  private start: THREE.Vector3;
  constructor(private def: DefinitiePlatforma) {
    super({ ...def, culoare: def.culoare ?? 0xff7a2f }, MATERIAL_LAVA);
    this.start = new THREE.Vector3(...def.poz);
  }

  /** Lava care urcă și coboară (vulcanul care erupe), dacă are „miscare” */
  actualizeaza(_dt: number, timp: number) {
    const m = this.def.miscare;
    if (!m) return;
    const k = 0.5 - 0.5 * Math.cos(((timp / m.perioada) + (m.faza ?? 0)) * Math.PI * 2);
    const noua = this.start.clone().add(new THREE.Vector3(...m.cat).multiplyScalar(k));
    this.deplasare.subVectors(noua, this.obiect.position);
    this.obiect.position.copy(noua);
    this.actualizeazaCutia();
  }

  laCalcare(_j: CorpJucator, _timp: number): EfectCalcare { return 'lava'; }

  anima(timp: number) {
    const k = 0.5 + 0.5 * Math.sin(timp * 3);
    MATERIAL_LAVA.emissive.setRGB(0.6 + 0.3 * k, 0.12 + 0.12 * k, 0);
  }
}
