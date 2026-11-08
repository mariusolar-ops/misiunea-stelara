// O platformă = o cutie pe care poți sta.
// Ține minte și „cutia de coliziune” (Box3), folosită de fizică.
import * as THREE from 'three';

export interface DefinitiePlatforma {
  /** Centrul platformei [x, y, z] */
  poz: [number, number, number];
  /** Mărimea [lățime, înălțime, adâncime] */
  dim: [number, number, number];
  /** Culoarea (opțional) */
  culoare?: number;
}

// Geometria unui cub e refolosită de toate platformele (economie de memorie)
const CUB = new THREE.BoxGeometry(1, 1, 1);
const MARGINI = new THREE.EdgesGeometry(CUB);

// Materialele se refolosesc pe culori
const materiale = new Map<number, THREE.MeshLambertMaterial>();
const materialeMargini = new Map<number, THREE.LineBasicMaterial>();

function material(culoare: number) {
  let m = materiale.get(culoare);
  if (!m) { m = new THREE.MeshLambertMaterial({ color: culoare }); materiale.set(culoare, m); }
  return m;
}
function materialMargine(culoare: number) {
  let m = materialeMargini.get(culoare);
  if (!m) {
    // marginile sunt o variantă mai deschisă a culorii – efect „neon”
    const c = new THREE.Color(culoare).lerp(new THREE.Color(0xffffff), 0.55);
    m = new THREE.LineBasicMaterial({ color: c });
    materialeMargini.set(culoare, m);
  }
  return m;
}

export class Platforma {
  obiect: THREE.Object3D;
  cutie = new THREE.Box3();
  /** Cât s-a mișcat platforma în ultimul cadru – ca să-l ducă pe personaj cu ea */
  deplasare = new THREE.Vector3();

  constructor(def: DefinitiePlatforma) {
    const culoare = def.culoare ?? 0x2ee6d6;
    const grup = new THREE.Group();
    const corp = new THREE.Mesh(CUB, material(culoare));
    const margini = new THREE.LineSegments(MARGINI, materialMargine(culoare));
    grup.add(corp, margini);
    grup.scale.set(...def.dim);
    grup.position.set(...def.poz);
    this.obiect = grup;
    this.actualizeazaCutia();
  }

  actualizeazaCutia() {
    const p = this.obiect.position, s = this.obiect.scale;
    this.cutie.min.set(p.x - s.x / 2, p.y - s.y / 2, p.z - s.z / 2);
    this.cutie.max.set(p.x + s.x / 2, p.y + s.y / 2, p.z + s.z / 2);
  }

  /** Se apelează în fiecare cadru (platformele speciale vor face mai mult aici) */
  actualizeaza(_dt: number, _timp: number) {}
}
