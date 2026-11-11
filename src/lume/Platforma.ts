// O platformă = o cutie pe care poți sta.
// Ține minte și „cutia de coliziune” (Box3), folosită de fizică.
// Platformele speciale (care se mișcă, dispar, lavă, trambulină, bandă) sunt în folderul „platforme”.
import * as THREE from 'three';

export type TipPlatforma = 'normal' | 'miscare' | 'dispare' | 'lava' | 'trambulina' | 'banda' | 'gheata' | 'perete';

export interface DefinitiePlatforma {
  /** Centrul platformei [x, y, z] */
  poz: [number, number, number];
  /** Mărimea [lățime, înălțime, adâncime] */
  dim: [number, number, number];
  /** Culoarea (opțional) */
  culoare?: number;
  tip?: TipPlatforma;
  /** Doar pentru „miscare”: cât se deplasează, în câte secunde face drumul dus-întors, și decalajul */
  miscare?: { cat: [number, number, number]; perioada: number; faza?: number };
  /** Doar pentru „trambulina”: cât de tare aruncă în sus */
  forta?: number;
  /** Doar pentru „banda”: viteza benzii pe x și pe z */
  viteza?: [number, number];
}

/** Ce are nevoie o platformă să „știe” despre jucător când acesta stă pe ea */
export interface CorpJucator {
  viteza: THREE.Vector3;
  /** Împingere în plus (de la bandă), în unități pe secundă */
  impingere: THREE.Vector3;
}

/** Ce se poate întâmpla când calci pe o platformă */
export type EfectCalcare = 'lava' | 'trambulina' | 'gheata' | null;

// Geometria unui cub e refolosită de toate platformele (economie de memorie)
export const CUB = new THREE.BoxGeometry(1, 1, 1);
const MARGINI = new THREE.EdgesGeometry(CUB);

// Materialele se refolosesc pe culori
const materiale = new Map<number, THREE.MeshLambertMaterial>();
const materialeMargini = new Map<number, THREE.LineBasicMaterial>();

export function materialCuloare(culoare: number) {
  let m = materiale.get(culoare);
  if (!m) { m = new THREE.MeshLambertMaterial({ color: culoare }); materiale.set(culoare, m); }
  return m;
}
export function materialMargine(culoare: number) {
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
  corp: THREE.Mesh;
  cutie = new THREE.Box3();
  /** Dacă e false, personajul trece prin ea (ex. un bloc care a dispărut) */
  solid = true;
  /** Perete magnetic: poți alerga pe el și sări de pe el */
  magnetic = false;
  /** Cât s-a mișcat platforma în ultimul pas – ca să-l ducă pe personaj cu ea */
  deplasare = new THREE.Vector3();

  constructor(def: DefinitiePlatforma, material?: THREE.Material) {
    const culoare = def.culoare ?? 0x2ee6d6;
    const grup = new THREE.Group();
    this.corp = new THREE.Mesh(CUB, material ?? materialCuloare(culoare));
    const margini = new THREE.LineSegments(MARGINI, materialMargine(culoare));
    grup.add(this.corp, margini);
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

  /** Se apelează la fiecare pas de fizică (platformele speciale fac mai mult aici) */
  actualizeaza(_dt: number, _timp: number) {}

  /** Se apelează cât timp personajul stă pe platformă */
  laCalcare(_j: CorpJucator, _timp: number): EfectCalcare { return null; }

  /** Animații doar de privit (o dată pe cadru) */
  anima(_timp: number) {}

  /** Readuce platforma la starea de început (când reîncepi nivelul) */
  reseteaza() {}
}
