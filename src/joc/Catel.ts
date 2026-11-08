// Cățelușul lui Mihai: maro, din cuburi, cu urechi lăsate. Aleargă după personaj.
// Nu are fizică proprie – doar „plutește” lin spre un loc din spatele lui Mihai,
// așa că nu cade niciodată și nu încurcă jocul.
import * as THREE from 'three';

const MARO = 0xb8692a;
const MARO_INCHIS = 0x7a4216;
const CUB = new THREE.BoxGeometry(1, 1, 1);
const materiale = new Map<number, THREE.MeshLambertMaterial>();

function cub(l: number, h: number, a: number, culoare: number, x: number, y: number, z: number) {
  let mat = materiale.get(culoare);
  if (!mat) { mat = new THREE.MeshLambertMaterial({ color: culoare }); materiale.set(culoare, mat); }
  const m = new THREE.Mesh(CUB, mat);
  m.scale.set(l, h, a);
  m.position.set(x, y, z);
  return m;
}

export class Catel {
  obiect = new THREE.Group();
  private picioare: THREE.Object3D[] = [];
  private coada: THREE.Object3D;
  private faza = 0;
  private directie = 0;

  constructor(scena: THREE.Scene) {
    const o = this.obiect;
    // corp lung (ca un șoricar) – privește spre +z
    o.add(cub(0.36, 0.32, 0.8, MARO, 0, 0.36, 0));
    // cap + bot + nas negru
    o.add(cub(0.34, 0.32, 0.32, MARO, 0, 0.62, 0.45));
    o.add(cub(0.2, 0.15, 0.18, MARO, 0, 0.55, 0.66));
    o.add(cub(0.09, 0.07, 0.04, 0x111111, 0, 0.6, 0.76));
    // ochi
    o.add(cub(0.05, 0.06, 0.02, 0x111111, -0.09, 0.69, 0.615));
    o.add(cub(0.05, 0.06, 0.02, 0x111111, 0.09, 0.69, 0.615));
    // urechi lăsate pe lângă cap
    o.add(cub(0.07, 0.28, 0.16, MARO_INCHIS, -0.2, 0.56, 0.43));
    o.add(cub(0.07, 0.28, 0.16, MARO_INCHIS, 0.2, 0.56, 0.43));
    // picioare scurte (încheietura sus, ca să se miște)
    for (const [x, z] of [[-0.12, 0.28], [0.12, 0.28], [-0.12, -0.28], [0.12, -0.28]]) {
      const p = new THREE.Group();
      p.position.set(x, 0.22, z);
      p.add(cub(0.1, 0.22, 0.1, MARO, 0, -0.11, 0));
      this.picioare.push(p);
      o.add(p);
    }
    // coada
    this.coada = new THREE.Group();
    this.coada.position.set(0, 0.46, -0.4);
    this.coada.add(cub(0.07, 0.07, 0.28, MARO_INCHIS, 0, 0.06, -0.12));
    this.coada.rotation.x = 0.6;
    o.add(this.coada);
    scena.add(o);
  }

  /** Îl pune imediat lângă Mihai (la start sau după o cădere) */
  teleporteaza(pozMihai: THREE.Vector3, directieMihai: number) {
    this.obiect.position.set(
      pozMihai.x - Math.sin(directieMihai) * 1.4 + Math.cos(directieMihai) * 0.8,
      pozMihai.y,
      pozMihai.z - Math.cos(directieMihai) * 1.4 - Math.sin(directieMihai) * 0.8,
    );
    this.directie = directieMihai;
  }

  actualizeaza(dt: number, pozMihai: THREE.Vector3, directieMihai: number, timp: number) {
    // locul dorit: puțin în spatele și în dreapta lui Mihai
    const tinta = new THREE.Vector3(
      pozMihai.x - Math.sin(directieMihai) * 1.4 + Math.cos(directieMihai) * 0.8,
      pozMihai.y,
      pozMihai.z - Math.cos(directieMihai) * 1.4 - Math.sin(directieMihai) * 0.8,
    );
    const p = this.obiect.position;
    const inainte = p.clone();
    const dist = p.distanceTo(tinta);
    // dacă a rămas foarte în urmă (ex. Mihai a căzut), sare direct lângă el
    if (dist > 15) this.teleporteaza(pozMihai, directieMihai);
    else p.lerp(tinta, Math.min(1, dt * 6));

    // întoarce capul în direcția în care aleargă
    const dx = p.x - inainte.x, dz = p.z - inainte.z;
    const viteza = Math.hypot(dx, dz) / Math.max(dt, 0.001);
    if (viteza > 0.6) {
      let dif = Math.atan2(dx, dz) - this.directie;
      dif = Math.atan2(Math.sin(dif), Math.cos(dif));
      this.directie += dif * Math.min(1, dt * 10);
    }
    this.obiect.rotation.y = this.directie;

    // picioarele aleargă, coada dă din ea tot timpul (e un cățel fericit)
    const k = Math.min(1, viteza / 6);
    this.faza += dt * (8 + k * 10);
    this.picioare.forEach((pic, i) => (pic.rotation.x = Math.sin(this.faza + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI : 0)) * 0.8 * k));
    this.coada.rotation.y = Math.sin(timp * 14) * 0.5;
  }
}
