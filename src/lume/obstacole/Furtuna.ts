// Furtuna mov: un perete uriaș de nori violet care înaintează încet în spatele tău.
// Dacă te ajunge, te întorci la steag (și furtuna se dă înapoi și mai așteaptă puțin).
// Merge mai încet decât alergi, deci dacă nu stai pe loc, scapi de ea.
import * as THREE from 'three';
import type { Obstacol, CorpObstacol, EfectObstacol } from './Obstacol';
import type { Punct } from '../../nivele/tipuri';

export interface DefFurtuna {
  tip: 'furtuna';
  /** Unde e marginea furtunii la început (pe z; furtuna vine din spate, spre -z) */
  start: Punct;
  /** Cât de repede înaintează (tu alergi cu 7,5) */
  viteza: number;
  /** Câte secunde așteaptă înainte să pornească */
  intarziere: number;
}

const LATIME = 90, INALTIME = 70, ADANCIME = 60;

export class Furtuna implements Obstacol {
  obiect = new THREE.Group();
  private z: number;
  private asteapta: number;
  private nori: THREE.Mesh[] = [];
  private fulger: THREE.MeshBasicMaterial;

  constructor(private def: DefFurtuna) {
    this.z = def.start[2];
    this.asteapta = def.intarziere;
    const g = this.obiect;
    // peretele de nori: cutie mov transparentă, se vede și când ești înăuntru
    const perete = new THREE.Mesh(
      new THREE.BoxGeometry(LATIME, INALTIME, ADANCIME),
      new THREE.MeshBasicMaterial({ color: 0x8a3aff, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide }),
    );
    perete.position.z = ADANCIME / 2;
    g.add(perete);
    // marginea furtunii: o ceață mov mai deschisă, cu 8 unități înainte –
    // când camera intră în ea, ecranul se colorează mov: e semnul că furtuna e aproape!
    const margine = new THREE.Mesh(
      new THREE.BoxGeometry(LATIME, INALTIME, 8),
      new THREE.MeshBasicMaterial({ color: 0xa860ff, transparent: true, opacity: 0.14, depthWrite: false, side: THREE.DoubleSide }),
    );
    margine.position.z = -4;
    g.add(margine);
    // nori mai închiși, care se învârt pe marginea furtunii
    const matNor = new THREE.MeshBasicMaterial({ color: 0x5a1a9a, transparent: true, opacity: 0.55, depthWrite: false });
    for (let i = 0; i < 14; i++) {
      const n = new THREE.Mesh(new THREE.SphereGeometry(4 + (i % 3) * 2, 8, 6), matNor);
      n.position.set(-40 + (i / 13) * 80, -10 + (i % 4) * 9, 1.5);
      g.add(n);
      this.nori.push(n);
    }
    // fulgerul care sclipește din când în când
    this.fulger = new THREE.MeshBasicMaterial({ color: 0xe8d0ff, transparent: true, opacity: 0, depthWrite: false });
    const f = new THREE.Mesh(new THREE.BoxGeometry(0.6, 30, 0.6), this.fulger);
    f.position.set(6, 5, 0.5);
    f.rotation.z = 0.25;
    g.add(f);
    g.position.set(def.start[0], def.start[1], this.z);
  }

  /** Când te întorci la steag: furtuna se dă înapoi în spatele tău și așteaptă puțin */
  reseteaza(pozJucator: THREE.Vector3) {
    this.z = Math.max(this.z, pozJucator.z + 16);
    this.asteapta = this.def.intarziere;
    this.obiect.position.z = this.z;
  }

  actualizeaza(j: CorpObstacol, timp: number, dt: number): EfectObstacol {
    this.nori.forEach((n, i) => { n.position.y = -10 + (i % 4) * 9 + Math.sin(timp * 1.3 + i) * 2; n.rotation.y = timp * 0.5 + i; });
    this.fulger.opacity = Math.sin(timp * 2.3) > 0.97 ? 0.9 : 0;
    if (j.poz.y < -100) return null; // în meniu
    this.obiect.position.y = j.poz.y;   // furtuna e înaltă: ține pasul cu tine pe înălțime
    if (this.asteapta > 0) { this.asteapta -= dt; return null; }
    this.z -= this.def.viteza * dt;
    this.obiect.position.z = this.z;
    return this.z <= j.poz.z + 0.3 ? 'furtuna' : null;
  }
}
