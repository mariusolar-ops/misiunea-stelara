// Lavă: dacă o atingi, revii la ultimul steag. Strălucește și „pulsează”.
import * as THREE from 'three';
import { Platforma, type DefinitiePlatforma, type CorpJucator, type EfectCalcare } from '../Platforma';

// Un singur material pentru toată lava din nivel – îl animăm o dată
const MATERIAL_LAVA = new THREE.MeshLambertMaterial({ color: 0xff5a1f, emissive: 0xc22a00 });

export class Lava extends Platforma {
  constructor(def: DefinitiePlatforma) {
    super({ ...def, culoare: def.culoare ?? 0xff7a2f }, MATERIAL_LAVA);
  }

  laCalcare(_j: CorpJucator, _timp: number): EfectCalcare { return 'lava'; }

  anima(timp: number) {
    const k = 0.5 + 0.5 * Math.sin(timp * 3);
    MATERIAL_LAVA.emissive.setRGB(0.6 + 0.3 * k, 0.12 + 0.12 * k, 0);
  }
}
