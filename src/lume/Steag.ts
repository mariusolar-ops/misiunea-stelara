// Steagul de checkpoint. Gri când nu l-ai atins, turcoaz după ce treci pe lângă el.
// Când cazi, revii la ultimul steag atins.
import * as THREE from 'three';

const CUB = new THREE.BoxGeometry(1, 1, 1);
const GRI = 0x8a90a8;
const TURCOAZ = 0x2ee6d6;

export class Steag {
  obiect = new THREE.Group();
  activ = false;
  private panza: THREE.Mesh;
  private materialPanza = new THREE.MeshLambertMaterial({ color: GRI });
  private timpActivare = -1;

  constructor(public poz: THREE.Vector3, public directie: number) {
    const stalp = new THREE.Mesh(CUB, new THREE.MeshLambertMaterial({ color: 0xe8ecf5 }));
    stalp.scale.set(0.12, 2.8, 0.12);
    stalp.position.y = 1.4;
    const baza = new THREE.Mesh(CUB, new THREE.MeshLambertMaterial({ color: 0x4a5070 }));
    baza.scale.set(0.6, 0.2, 0.6);
    baza.position.y = 0.1;
    this.panza = new THREE.Mesh(CUB, this.materialPanza);
    this.panza.scale.set(1, 0.6, 0.06);
    this.panza.position.set(0.56, 2.4, 0);
    this.obiect.add(stalp, baza, this.panza);
    this.obiect.position.copy(poz);
  }

  /** E personajul destul de aproape ca să „atingă” steagul? */
  atins(pozJucator: THREE.Vector3) {
    const dx = pozJucator.x - this.poz.x, dz = pozJucator.z - this.poz.z;
    return dx * dx + dz * dz < 2.5 * 2.5 && Math.abs(pozJucator.y - this.poz.y) < 2.5;
  }

  activeaza(timp: number) {
    this.activ = true;
    this.timpActivare = timp;
    this.materialPanza.color.set(TURCOAZ);
    this.materialPanza.emissive.set(0x0a5a54);
  }

  actualizeaza(timp: number) {
    // pânza flutură ușor; după activare face un mic „salt” de bucurie
    this.panza.rotation.y = Math.sin(timp * 3 + this.poz.x) * 0.25;
    if (this.timpActivare >= 0) {
      const t = timp - this.timpActivare;
      this.panza.scale.y = 0.6 * (1 + Math.max(0, 0.5 - t) * 1.2);
    }
  }
}
