// Moneda de aur care se rotește. O strângi trecând prin ea.
import * as THREE from 'three';

import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Forma monedei, făcută o singură dată și folosită de toate monedele:
 * discul + o margine + o stea în relief pe fiecare față. Totul e lipit într-o singură formă
 * (cu două „grupe” de material), ca să fie ieftin de desenat.
 */
function formaMoneda() {
  const disc = new THREE.CylinderGeometry(0.38, 0.38, 0.1, 18).rotateX(Math.PI / 2);
  const margine = new THREE.TorusGeometry(0.36, 0.035, 4, 18);
  const relief: THREE.BufferGeometry[] = [];
  for (const z of [0.055, -0.055]) {
    // steaua: o cruce mare + o cruce mică rotită (8 colțuri)
    relief.push(new THREE.BoxGeometry(0.42, 0.08, 0.03).translate(0, 0, z));
    relief.push(new THREE.BoxGeometry(0.08, 0.42, 0.03).translate(0, 0, z));
    relief.push(new THREE.BoxGeometry(0.26, 0.07, 0.03).rotateZ(Math.PI / 4).translate(0, 0, z));
    relief.push(new THREE.BoxGeometry(0.26, 0.07, 0.03).rotateZ(-Math.PI / 4).translate(0, 0, z));
  }
  const curat = (g: THREE.BufferGeometry) => { g.deleteAttribute('uv'); return g.index ? g.toNonIndexed() : g; };
  const corp = mergeGeometries([disc, margine].map(curat));
  const stea = mergeGeometries(relief.map(curat));
  return mergeGeometries([corp!, stea!], true)!; // grupa 0 = aur, grupa 1 = aur închis
}

// Toate monedele folosesc aceeași formă și aceleași materiale (economie)
const FORMA = formaMoneda();
const MATERIAL = [
  new THREE.MeshLambertMaterial({ color: 0xffd23f, emissive: 0x6a4a00 }),
  new THREE.MeshLambertMaterial({ color: 0xffb800, emissive: 0x8a5a00 }),
];

export class Moneda {
  obiect: THREE.Mesh;
  luata = false;
  private timpLuare = -1;

  constructor(public poz: THREE.Vector3) {
    this.obiect = new THREE.Mesh(FORMA, MATERIAL);
    this.obiect.position.copy(poz);
  }

  /** Personajul (de la tălpi până la cap) trece prin monedă? */
  atinsa(pozJucator: THREE.Vector3) {
    const dx = pozJucator.x - this.poz.x, dz = pozJucator.z - this.poz.z;
    const dy = this.poz.y - pozJucator.y;
    return dx * dx + dz * dz < 0.9 * 0.9 && dy > -0.4 && dy < 2.3;
  }

  ia(timp: number) {
    this.luata = true;
    this.timpLuare = timp;
  }

  actualizeaza(timp: number) {
    if (!this.luata) {
      this.obiect.rotation.y = timp * 3 + this.poz.x;
      this.obiect.position.y = this.poz.y + Math.sin(timp * 2.5 + this.poz.z) * 0.12;
      return;
    }
    // animație scurtă când o iei: urcă, se învârte repede și se micșorează
    const t = timp - this.timpLuare;
    if (t > 0.35) { this.obiect.visible = false; return; }
    this.obiect.rotation.y += 0.5;
    this.obiect.position.y = this.poz.y + t * 5;
    this.obiect.scale.setScalar(1 - t / 0.35);
  }

  /** Repune moneda (când reîncepi nivelul) */
  reseteaza() {
    this.luata = false;
    this.timpLuare = -1;
    this.obiect.visible = true;
    this.obiect.scale.setScalar(1);
  }
}
