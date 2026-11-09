// Steaua secretă: mov-roz, strălucitoare, făcută din două cuburi rotite (arată ca o stea cu 8 colțuri).
// E ascunsă în fiecare nivel, departe de drumul obișnuit.
import * as THREE from 'three';

const CUB = new THREE.BoxGeometry(0.55, 0.55, 0.55);

export class SteaSecreta {
  obiect = new THREE.Group();
  luata = false;
  private timpLuare = -1;
  private material: THREE.MeshLambertMaterial;

  /** @param dejaGasita dacă a fost găsită altă dată: apare ca o „fantomă” transparentă */
  constructor(public poz: THREE.Vector3, public dejaGasita: boolean) {
    this.material = new THREE.MeshLambertMaterial({
      color: 0xd36bff, emissive: 0x7a1fb0,
      transparent: dejaGasita, opacity: dejaGasita ? 0.3 : 1,
    });
    const a = new THREE.Mesh(CUB, this.material);
    const b = new THREE.Mesh(CUB, this.material);
    a.rotation.set(Math.PI / 4, 0, Math.PI / 4);
    b.rotation.set(0, Math.PI / 4, 0);
    // un miez auriu mic
    const miez = new THREE.Mesh(CUB, new THREE.MeshBasicMaterial({ color: 0xffe28a }));
    miez.scale.setScalar(0.45);
    this.obiect.add(a, b, miez);
    this.obiect.position.copy(poz);
  }

  atinsa(pozJucator: THREE.Vector3) {
    if (this.luata || this.dejaGasita) return false;
    const dx = pozJucator.x - this.poz.x, dz = pozJucator.z - this.poz.z;
    const dy = this.poz.y - pozJucator.y;
    return dx * dx + dz * dz < 1 && dy > -0.4 && dy < 2.4;
  }

  ia(timp: number) { this.luata = true; this.timpLuare = timp; }

  actualizeaza(timp: number) {
    if (!this.luata) {
      this.obiect.rotation.y = timp * 2;
      this.obiect.rotation.x = Math.sin(timp * 1.3) * 0.4;
      this.obiect.position.y = this.poz.y + Math.sin(timp * 2) * 0.18;
      // „pulsează” ca să atragă privirea
      this.material.emissive.setRGB(0.45 + Math.sin(timp * 5) * 0.2, 0.1, 0.7);
      return;
    }
    const t = timp - this.timpLuare;
    if (t > 0.8) { this.obiect.visible = false; return; }
    this.obiect.rotation.y += 0.6;
    this.obiect.position.y = this.poz.y + t * 4;
    this.obiect.scale.setScalar(1 + t * 1.5);
  }
}
