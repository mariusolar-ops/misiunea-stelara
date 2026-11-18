// Butonul pe care calci (pentru nivelurile-puzzle): e roșu și ridicat; când calci pe el
// se apasă, se face verde și rămâne apăsat.
import * as THREE from 'three';

const CUB = new THREE.BoxGeometry(1, 1, 1);

export class Buton {
  obiect = new THREE.Group();
  apasat = false;
  private capac: THREE.Mesh;
  private matCapac: THREE.MeshLambertMaterial;
  private lumina: THREE.Mesh;
  private timpApasare = -1;

  constructor(public poz: THREE.Vector3) {
    const baza = new THREE.Mesh(CUB, new THREE.MeshLambertMaterial({ color: 0x4a4f6a }));
    baza.scale.set(1.5, 0.12, 1.5); baza.position.y = 0.06;
    this.matCapac = new THREE.MeshLambertMaterial({ color: 0xe8303a, emissive: 0x501010 });
    this.capac = new THREE.Mesh(CUB, this.matCapac);
    this.capac.scale.set(1, 0.22, 1); this.capac.position.y = 0.23;
    // o coloană de lumină deasupra, ca să-l vezi de departe
    this.lumina = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 6, 12, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xff5f6a, transparent: true, opacity: 0.25, depthWrite: false, side: THREE.DoubleSide }));
    this.lumina.position.y = 3.2;
    this.obiect.add(baza, this.capac, this.lumina);
    this.obiect.position.copy(poz);
  }

  atins(pozJucator: THREE.Vector3) {
    if (this.apasat) return false;
    const dx = pozJucator.x - this.poz.x, dz = pozJucator.z - this.poz.z;
    const dy = pozJucator.y - this.poz.y;
    return dx * dx + dz * dz < 0.8 && dy > -0.3 && dy < 1;
  }

  apasa(timp: number) {
    this.apasat = true;
    this.timpApasare = timp;
    this.matCapac.color.set(0x4ccf6a);
    this.matCapac.emissive.set(0x1a5a2a);
    (this.lumina.material as THREE.MeshBasicMaterial).color.set(0x4ccf6a);
  }

  actualizeaza(timp: number) {
    if (!this.apasat) {
      this.matCapac.emissive.setRGB(0.3 + 0.2 * Math.sin(timp * 5), 0.05, 0.05);
      return;
    }
    const k = Math.min(1, (timp - this.timpApasare) / 0.2);
    this.capac.scale.y = 0.22 - k * 0.14;
    this.capac.position.y = 0.23 - k * 0.07;
    (this.lumina.material as THREE.MeshBasicMaterial).opacity = 0.25 * (1 - Math.min(1, (timp - this.timpApasare) / 1.5));
  }
}
