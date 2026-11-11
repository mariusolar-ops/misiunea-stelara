// Perete magnetic (mov, cu dungi care strălucesc): dacă sari în el, te lipești și poți alerga pe el.
// Apasă SARI ca să sari de pe perete (spre partea cealaltă).
import * as THREE from 'three';
import { Platforma, type DefinitiePlatforma } from '../Platforma';

const MATERIAL = new THREE.MeshLambertMaterial({ color: 0x8a3aff, emissive: 0x2a0a60 });

export class PereteMagnetic extends Platforma {
  constructor(def: DefinitiePlatforma) {
    super({ ...def, culoare: def.culoare ?? 0xc08aff }, MATERIAL);
    this.magnetic = true;
    // dungi luminoase de-a lungul peretelui (pe ambele fețe lungi)
    const [l, h, a] = def.dim;
    const lungPeX = l >= a;
    const dunga = new THREE.MeshBasicMaterial({ color: 0xe0b0ff });
    for (const y of [-0.25, 0.25]) {
      const d = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), dunga);
      // dimensiunile copiilor sunt relative la cutia platformei (care e scalată)
      d.scale.set(lungPeX ? 1.001 : 1.06, 0.06 / Math.max(h, 0.1) * 2, lungPeX ? 1.06 : 1.001);
      d.position.y = y;
      this.obiect.add(d);
    }
  }

  anima(timp: number) {
    MATERIAL.emissive.setRGB(0.16 + Math.sin(timp * 3) * 0.06, 0.04, 0.38 + Math.sin(timp * 3) * 0.08);
  }
}
