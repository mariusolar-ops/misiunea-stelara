// Portal de teleportare (pentru nivelul cu portale): un cerc cu vârtej.
// Cel CORECT te duce mai departe; cele GREȘITE te trimit înapoi la începutul încercării.
// Toate arată la fel… doar steluța din vârful celui corect se învârte invers (indiciu pentru cine e atent!).
import * as THREE from 'three';
import type { CorpObstacol, EfectObstacol, Obstacol } from './Obstacol';
import type { Punct } from '../../nivele/tipuri';

export interface DefTeleport {
  tip: 'teleport';
  /** Unde stă portalul (la nivelul podelei) */
  poz: Punct;
  /** Unde te trimite */
  spre: Punct;
  /** E portalul bun? */
  corect: boolean;
  /** Spre ce parte e întors portalul (radiani) */
  directie?: number;
}

const CUB = new THREE.BoxGeometry(1, 1, 1);
const MAT_RAMA = new THREE.MeshLambertMaterial({ color: 0x8a6cff, emissive: 0x2a1a60 });
const MAT_STEA = new THREE.MeshBasicMaterial({ color: 0xffd23f });

export class Teleport implements Obstacol {
  obiect = new THREE.Group();
  private inele: THREE.Mesh[] = [];
  private stea: THREE.Mesh;
  private poz: THREE.Vector3;
  private spre: THREE.Vector3;
  private ultima = -9;

  constructor(private def: DefTeleport) {
    this.poz = new THREE.Vector3(...def.poz);
    this.spre = new THREE.Vector3(...def.spre);
    const g = this.obiect;
    for (const x of [-1.1, 1.1]) {
      const s = new THREE.Mesh(CUB, MAT_RAMA);
      s.scale.set(0.35, 2.8, 0.35);
      s.position.set(x, 1.4, 0);
      g.add(s);
    }
    const sus = new THREE.Mesh(CUB, MAT_RAMA);
    sus.scale.set(2.55, 0.35, 0.35);
    sus.position.y = 2.8;
    g.add(sus);
    ['#2ee6d6', '#ff5fa8', '#ffffff'].forEach((c, i) => {
      const inel = new THREE.Mesh(new THREE.TorusGeometry(0.85 - i * 0.25, 0.06, 5, 22),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.85 }));
      inel.position.y = 1.35;
      this.inele.push(inel);
      g.add(inel);
    });
    this.stea = new THREE.Mesh(CUB, MAT_STEA);
    this.stea.scale.setScalar(0.32);
    this.stea.position.y = 3.25;
    g.add(this.stea);
    g.position.copy(this.poz);
    g.rotation.y = def.directie ?? 0;
  }

  actualizeaza(j: CorpObstacol, timp: number): EfectObstacol {
    this.inele.forEach((inel, i) => { inel.rotation.z = timp * (2 + i) * (i % 2 ? -1 : 1); });
    // indiciul: steaua portalului corect se învârte în sens invers
    this.stea.rotation.y = timp * (this.def.corect ? -2 : 2);
    this.stea.rotation.x = 0.6;
    // ai intrat în portal?
    const local = j.poz.clone().sub(this.poz).applyAxisAngle(THREE.Object3D.DEFAULT_UP, -(this.def.directie ?? 0));
    if (Math.abs(local.x) < 0.8 && Math.abs(local.z) < 0.5 && local.y > -0.5 && local.y < 2 && timp - this.ultima > 1) {
      this.ultima = timp;
      j.poz.copy(this.spre);
      j.viteza.set(0, 0, 0);
      return this.def.corect ? 'portal-bun' : 'portal-gresit';
    }
    return null;
  }
}
