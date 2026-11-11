// Extraterestrul care te fugărește (într-o farfurie zburătoare)! Zboară spre tine puțin mai încet
// decât alergi tu. Dacă te prinde, te întorci la ultimul steag – iar el pornește din nou, din spatele tău.
import * as THREE from 'three';
import type { CorpObstacol, EfectObstacol, Obstacol } from './Obstacol';
import type { Punct } from '../../nivele/tipuri';

export interface DefExtraterestru {
  tip: 'extraterestru';
  /** De unde pornește prima dată */
  start: Punct;
  /** Cât de repede zboară (tu alergi cu 7,5) */
  viteza: number;
  /** Câte secunde așteaptă înainte să pornească după tine */
  intarziere: number;
}

const CUB = new THREE.BoxGeometry(1, 1, 1);
function cub(l: number, h: number, a: number, c: number, x: number, y: number, z: number, extra: THREE.MeshLambertMaterialParameters = {}) {
  const m = new THREE.Mesh(CUB, new THREE.MeshLambertMaterial({ color: c, ...extra }));
  m.scale.set(l, h, a); m.position.set(x, y, z); return m;
}

export class Extraterestru implements Obstacol {
  obiect = new THREE.Group();
  private poz: THREE.Vector3;
  private asteapta: number;
  private lumini: THREE.Mesh[] = [];
  private ultimaVerificare = -1;

  constructor(private def: DefExtraterestru) {
    this.poz = new THREE.Vector3(...def.start);
    this.asteapta = def.intarziere;
    const g = this.obiect;
    // farfuria
    const farfurie = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.5, 0.35, 14), new THREE.MeshLambertMaterial({ color: 0xb8c0d0 }));
    farfurie.position.y = -0.55;
    g.add(farfurie);
    for (let i = 0; i < 6; i++) {
      const u = (i / 6) * Math.PI * 2;
      const l = cub(0.18, 0.12, 0.18, 0xffd23f, Math.cos(u) * 1.3, -0.62, Math.sin(u) * 1.3, { emissive: 0x806000 });
      this.lumini.push(l); g.add(l);
    }
    // extraterestrul: cap verde, ochi mari negri, antene
    g.add(cub(0.5, 0.36, 0.4, 0x6ad04a, 0, -0.2, 0));                        // corp
    g.add(cub(0.62, 0.54, 0.54, 0x7ae05a, 0, 0.25, 0));                      // cap mare
    g.add(cub(0.18, 0.2, 0.02, 0x111111, -0.14, 0.28, 0.275), cub(0.18, 0.2, 0.02, 0x111111, 0.14, 0.28, 0.275));
    g.add(cub(0.05, 0.05, 0.01, 0xffffff, -0.1, 0.33, 0.29), cub(0.05, 0.05, 0.01, 0xffffff, 0.18, 0.33, 0.29));
    g.add(cub(0.16, 0.04, 0.02, 0x2a6a1a, 0, 0.08, 0.275));                  // zâmbet poznaș
    g.add(cub(0.04, 0.3, 0.04, 0x6ad04a, -0.16, 0.66, 0), cub(0.04, 0.3, 0.04, 0x6ad04a, 0.16, 0.66, 0));
    g.add(cub(0.1, 0.1, 0.1, 0xff5fa8, -0.16, 0.84, 0, { emissive: 0x801040 }), cub(0.1, 0.1, 0.1, 0xff5fa8, 0.16, 0.84, 0, { emissive: 0x801040 }));
    // cupola de sticlă
    const cupola = new THREE.Mesh(new THREE.SphereGeometry(0.8, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x9ffcf3, transparent: true, opacity: 0.25, depthWrite: false }));
    cupola.position.y = -0.4;
    g.add(cupola);
    g.position.copy(this.poz);
  }

  /** Când te întorci la steag: extraterestrul reapare în spatele tău și așteaptă puțin */
  reseteaza(pozJucator: THREE.Vector3, directie: number) {
    this.poz.set(pozJucator.x - Math.sin(directie) * 14, pozJucator.y + 3, pozJucator.z - Math.cos(directie) * 14);
    this.asteapta = 2.5;
    this.obiect.position.copy(this.poz);
  }

  actualizeaza(j: CorpObstacol, timp: number, dt: number): EfectObstacol {
    this.lumini.forEach((l, i) => { l.visible = Math.floor(timp * 8 + i) % 2 === 0; });
    this.obiect.rotation.y = Math.sin(timp * 2) * 0.3;
    if (j.poz.y < -100) return null; // în meniu (nu e niciun jucător)
    if (this.ultimaVerificare < 0) this.ultimaVerificare = timp;
    if (this.asteapta > 0) {
      this.asteapta -= dt;
      this.obiect.position.y = this.poz.y + Math.sin(timp * 3) * 0.2;
      return null;
    }
    // zboară spre jucător (puțin deasupra lui)
    const tinta = j.poz.clone().setY(j.poz.y + 1.3);
    const dir = tinta.sub(this.poz);
    const dist = dir.length();
    if (dist > 0.01) this.poz.addScaledVector(dir.normalize(), Math.min(dist, this.def.viteza * dt));
    this.obiect.position.set(this.poz.x, this.poz.y + Math.sin(timp * 3) * 0.15, this.poz.z);
    if (dist > 0.3) this.obiect.lookAt(j.poz.x, this.poz.y, j.poz.z);
    return dist < 1.2 ? 'prins' : null;
  }
}
