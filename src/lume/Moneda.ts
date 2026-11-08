// Moneda de aur care se rotește. O strângi trecând prin ea.
import * as THREE from 'three';

// Toate monedele folosesc aceeași formă și același material (economie)
const FORMA = new THREE.CylinderGeometry(0.38, 0.38, 0.1, 16).rotateX(Math.PI / 2);
const MATERIAL = new THREE.MeshLambertMaterial({ color: 0xffd23f, emissive: 0x6a4a00 });

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
