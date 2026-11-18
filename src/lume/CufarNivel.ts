// Un cufăr pus într-un nivel (ideea lui Mihai, în lumea din cuburi): îl atingi și se deschide GRATIS.
// Dă un efect, un stil de mers sau un accesoriu. Fiecare cufăr se poate deschide o singură dată.
import * as THREE from 'three';

const CUB = new THREE.BoxGeometry(1, 1, 1);
function cub(l: number, h: number, a: number, culoare: number, x: number, y: number, z: number, emisiv = 0) {
  const m = new THREE.Mesh(CUB, new THREE.MeshLambertMaterial({ color: culoare, emissive: emisiv }));
  m.scale.set(l, h, a);
  m.position.set(x, y, z);
  return m;
}

export class CufarNivel {
  obiect = new THREE.Group();
  deschis = false;
  private capac = new THREE.Group();
  private stralucire: THREE.Mesh;
  private timpDeschidere = -1;

  constructor(public poz: THREE.Vector3) {
    const lemn = 0x9a6a3a, lemnInchis = 0x5e3e1e, fier = 0x3a3a44, aur = 0xffd23f;
    // cutia (cu dungi de lemn mai închis, ca un cufăr din cuburi)
    this.obiect.add(cub(1, 0.6, 0.8, lemn, 0, 0.3, 0));
    this.obiect.add(cub(1.02, 0.08, 0.82, lemnInchis, 0, 0.12, 0), cub(1.02, 0.08, 0.82, lemnInchis, 0, 0.5, 0));
    // capacul se rotește în spate când se deschide
    this.capac.position.set(0, 0.6, -0.4);
    this.capac.add(cub(1, 0.28, 0.8, lemn, 0, 0.14, 0.4), cub(1.02, 0.06, 0.82, fier, 0, 0.26, 0.4));
    this.capac.add(cub(0.16, 0.2, 0.06, aur, 0, 0.02, 0.82, 0x6a4a00));      // lacătul de aur
    this.obiect.add(this.capac);
    // strălucirea aurie de deasupra (ca să-l vezi de departe)
    this.stralucire = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), new THREE.MeshBasicMaterial({ color: aur }));
    this.stralucire.position.y = 1.4;
    this.obiect.add(this.stralucire);
    this.obiect.position.copy(poz);
  }

  atins(pozJucator: THREE.Vector3) {
    if (this.deschis) return false;
    const dx = pozJucator.x - this.poz.x, dz = pozJucator.z - this.poz.z;
    const dy = pozJucator.y - this.poz.y;
    return dx * dx + dz * dz < 1.6 && dy > -0.5 && dy < 2;
  }

  deschide(timp: number) { this.deschis = true; this.timpDeschidere = timp; }

  /** Cufăr deschis altă dată: apare deschis și gol */
  arataDejaDeschis() { this.deschis = true; this.capac.rotation.x = -1.9; this.stralucire.visible = false; }

  actualizeaza(timp: number) {
    if (!this.deschis) {
      this.stralucire.position.y = 1.4 + Math.sin(timp * 3) * 0.12;
      this.stralucire.rotation.y = timp * 2;
      this.obiect.rotation.z = Math.sin(timp * 6) * 0.02;   // tremură puțin: „deschide-mă!”
      return;
    }
    if (this.timpDeschidere >= 0) {
      const k = Math.min(1, (timp - this.timpDeschidere) / 0.4);
      this.capac.rotation.x = -1.9 * k;
      this.stralucire.position.y = 1.4 + k * 2;
      this.stralucire.visible = k < 1;
      this.obiect.rotation.z = 0;
    }
  }
}
