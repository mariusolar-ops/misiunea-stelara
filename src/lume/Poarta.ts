// Poarta de final: un arc turcoaz din cuburi, cu „energie” în mijloc.
// Treci prin ea și nivelul e gata!
import * as THREE from 'three';

const CUB = new THREE.BoxGeometry(1, 1, 1);

export class Poarta {
  obiect = new THREE.Group();
  private energie: THREE.Mesh;
  private inele: THREE.Mesh[] = [];
  private lumini: THREE.Mesh[] = [];

  constructor(public poz: THREE.Vector3, directie: number) {
    const mat = new THREE.MeshLambertMaterial({ color: 0x2ee6d6, emissive: 0x0a5a54 });
    const matAur = new THREE.MeshLambertMaterial({ color: 0xffd23f, emissive: 0x6a4a00 });
    const stalpSt = new THREE.Mesh(CUB, mat); stalpSt.scale.set(0.6, 4, 0.6); stalpSt.position.set(-2, 2, 0);
    const stalpDr = new THREE.Mesh(CUB, mat); stalpDr.scale.set(0.6, 4, 0.6); stalpDr.position.set(2, 2, 0);
    const sus = new THREE.Mesh(CUB, mat); sus.scale.set(4.6, 0.6, 0.6); sus.position.set(0, 4.2, 0);
    const stea = new THREE.Mesh(CUB, matAur); stea.scale.set(0.7, 0.7, 0.7); stea.position.set(0, 5, 0);
    stea.rotation.z = Math.PI / 4;
    this.energie = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 3.9),
      new THREE.MeshBasicMaterial({ color: 0x9ffcf3, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }),
    );
    this.energie.position.y = 1.95;
    this.obiect.add(stalpSt, stalpDr, sus, stea, this.energie);
    // vârtejul: trei inele care se învârt în sensuri diferite
    const culori = [0x2ee6d6, 0x8a6cff, 0xffffff];
    [1.55, 1.15, 0.75].forEach((r, i) => {
      const inel = new THREE.Mesh(new THREE.TorusGeometry(r, 0.07, 6, 28),
        new THREE.MeshBasicMaterial({ color: culori[i], transparent: true, opacity: 0.8 }));
      inel.position.y = 1.95;
      this.inele.push(inel);
      this.obiect.add(inel);
    });
    // lumini care urcă pe stâlpi
    const matLumina = new THREE.MeshBasicMaterial({ color: 0xffd23f });
    for (const x of [-2, 2]) for (let k = 0; k < 5; k++) {
      const l = new THREE.Mesh(CUB, matLumina);
      l.scale.set(0.66, 0.12, 0.66);
      l.position.set(x, 0.4 + k * 0.8, 0);
      this.lumini.push(l);
      this.obiect.add(l);
    }
    this.obiect.position.copy(poz);
    this.obiect.rotation.y = directie;
  }

  atinsa(pozJucator: THREE.Vector3) {
    const dx = pozJucator.x - this.poz.x, dz = pozJucator.z - this.poz.z;
    return dx * dx + dz * dz < 1.6 * 1.6 && Math.abs(pozJucator.y - this.poz.y) < 2;
  }

  actualizeaza(timp: number) {
    (this.energie.material as THREE.MeshBasicMaterial).opacity = 0.25 + Math.sin(timp * 4) * 0.12;
    this.inele.forEach((inel, i) => {
      inel.rotation.z = timp * (i % 2 ? -2 : 1.5) * (1 + i * 0.4);
      inel.rotation.y = Math.sin(timp * 1.3 + i) * 0.4;
      inel.scale.setScalar(1 + Math.sin(timp * 3 + i * 2) * 0.06);
    });
    // luminile se aprind pe rând, de jos în sus
    this.lumini.forEach((l, i) => { l.visible = Math.floor(timp * 6 - (i % 5)) % 5 !== 0; });
  }
}

/** Locul de unde „curg” scânteile portalului (centrul lui) */
export function centruPoarta(p: Poarta) {
  return p.poz.clone().setY(p.poz.y + 1.95);
}
