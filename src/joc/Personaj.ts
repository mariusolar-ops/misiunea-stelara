// Personajul din cuburi: cap, corp, două mâini, două picioare.
// Mâinile și picioarele au „încheietura” sus (umăr / șold), ca să se balanseze natural.
import * as THREE from 'three';

export interface CuloriPersonaj {
  cap: number;
  corp: number;
  maini: number;
  picioare: number;
}

export const CULORI_IMPLICITE: CuloriPersonaj = {
  cap: 0xf5cfa0,     // piele
  corp: 0x2ee6d6,    // turcoaz – culoarea preferată a lui Mihai
  maini: 0x2ee6d6,
  picioare: 0x1d2a6b, // albastru închis
};

const CUB = new THREE.BoxGeometry(1, 1, 1);

/** Un cub colorat, cu mărimea și poziția date */
function cub(l: number, h: number, a: number, culoare: number, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(CUB, new THREE.MeshLambertMaterial({ color: culoare }));
  m.scale.set(l, h, a);
  m.position.set(x, y, z);
  return m;
}

export class Personaj {
  obiect = new THREE.Group();     // tot personajul (poziția = la tălpi)
  private corpGrup = new THREE.Group(); // se înclină puțin când fuge
  private cap: THREE.Mesh;
  private corp: THREE.Mesh;
  private manaSt = new THREE.Group();
  private manaDr = new THREE.Group();
  private piciorSt = new THREE.Group();
  private piciorDr = new THREE.Group();
  private faza = 0; // pentru animația de mers

  constructor(culori: CuloriPersonaj = CULORI_IMPLICITE) {
    this.obiect.add(this.corpGrup);

    // Picioare: încheietura la șold (y = 0.7), cubul atârnă în jos
    this.piciorSt.position.set(-0.2, 0.7, 0);
    this.piciorDr.position.set(0.2, 0.7, 0);
    this.piciorSt.add(cub(0.34, 0.7, 0.38, culori.picioare, 0, -0.35, 0));
    this.piciorDr.add(cub(0.34, 0.7, 0.38, culori.picioare, 0, -0.35, 0));

    // Corpul
    this.corp = cub(0.8, 0.7, 0.42, culori.corp, 0, 1.05, 0);

    // Mâini: încheietura la umăr (y = 1.35)
    this.manaSt.position.set(-0.53, 1.35, 0);
    this.manaDr.position.set(0.53, 1.35, 0);
    this.manaSt.add(cub(0.26, 0.68, 0.3, culori.maini, 0, -0.3, 0));
    this.manaDr.add(cub(0.26, 0.68, 0.3, culori.maini, 0, -0.3, 0));

    // Capul, cu ochi și zâmbet (cubulețe mici) – fața privește spre +z
    this.cap = cub(0.52, 0.52, 0.52, culori.cap, 0, 1.68, 0);
    const fata = new THREE.Group();
    fata.position.set(0, 1.68, 0.261);
    fata.add(cub(0.08, 0.1, 0.02, 0x111111, -0.12, 0.06, 0));
    fata.add(cub(0.08, 0.1, 0.02, 0x111111, 0.12, 0.06, 0));
    fata.add(cub(0.22, 0.05, 0.02, 0x7a2a2a, 0, -0.1, 0));

    this.corpGrup.add(this.piciorSt, this.piciorDr, this.corp, this.manaSt, this.manaDr, this.cap, fata);
  }

  /** Schimbă culorile (folosit la Personalizare) */
  seteazaCulori(c: CuloriPersonaj) {
    (this.cap.material as THREE.MeshLambertMaterial).color.set(c.cap);
    (this.corp.material as THREE.MeshLambertMaterial).color.set(c.corp);
    for (const g of [this.manaSt, this.manaDr])
      ((g.children[0] as THREE.Mesh).material as THREE.MeshLambertMaterial).color.set(c.maini);
    for (const g of [this.piciorSt, this.piciorDr])
      ((g.children[0] as THREE.Mesh).material as THREE.MeshLambertMaterial).color.set(c.picioare);
  }

  /**
   * Animația: viteza (0..1) decide cât de tare balansează mâinile și picioarele.
   * În aer, mâinile se ridică și picioarele se strâng puțin.
   */
  animeaza(dt: number, viteza: number, inAer: boolean, urca: boolean) {
    const lerp = (a: number, b: number, k: number) => a + (b - a) * Math.min(1, k * dt);
    let picior = 0, mana = 0, aplecare = 0;

    if (inAer) {
      // poză de săritură
      this.faza = 0;
      const tinta = urca ? -2.6 : -2.2;
      this.manaSt.rotation.x = lerp(this.manaSt.rotation.x, tinta, 14);
      this.manaDr.rotation.x = lerp(this.manaDr.rotation.x, tinta, 14);
      this.manaSt.rotation.z = lerp(this.manaSt.rotation.z, -0.3, 14);
      this.manaDr.rotation.z = lerp(this.manaDr.rotation.z, 0.3, 14);
      this.piciorSt.rotation.x = lerp(this.piciorSt.rotation.x, -0.5, 14);
      this.piciorDr.rotation.x = lerp(this.piciorDr.rotation.x, 0.3, 14);
      this.corpGrup.rotation.x = lerp(this.corpGrup.rotation.x, 0, 10);
      return;
    }

    if (viteza > 0.05) {
      this.faza += dt * (6 + viteza * 8);
      picior = Math.sin(this.faza) * 0.9 * viteza;
      mana = picior;
      aplecare = 0.12 * viteza;
    }
    this.piciorSt.rotation.x = lerp(this.piciorSt.rotation.x, picior, 20);
    this.piciorDr.rotation.x = lerp(this.piciorDr.rotation.x, -picior, 20);
    this.manaSt.rotation.x = lerp(this.manaSt.rotation.x, -mana, 20);
    this.manaDr.rotation.x = lerp(this.manaDr.rotation.x, mana, 20);
    this.manaSt.rotation.z = lerp(this.manaSt.rotation.z, 0, 14);
    this.manaDr.rotation.z = lerp(this.manaDr.rotation.z, 0, 14);
    this.corpGrup.rotation.x = lerp(this.corpGrup.rotation.x, aplecare, 10);
    // un mic „țopăit” în timpul mersului
    this.corpGrup.position.y = viteza > 0.05 ? Math.abs(Math.sin(this.faza)) * 0.06 * viteza : 0;
  }
}
