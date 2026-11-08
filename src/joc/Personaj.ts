// Personajul din cuburi: cap, corp, două mâini, două picioare.
// Mâinile și picioarele au „încheietura” sus (umăr / șold), ca să se balanseze natural.
import * as THREE from 'three';

export interface CuloriPersonaj {
  piele: number;
  tricou: number;    // corpul și mânecile
  pantaloni: number;
  pantofi: number;
  par: number;
}

// Culorile de pornire, după hainele lui Mihai: tricou și pantaloni bleu, adidași închiși
export const CULORI_IMPLICITE: CuloriPersonaj = {
  piele: 0xf5cfa0,
  tricou: 0x9ec5ee,    // bleu
  pantaloni: 0xb3cdec, // bleu deschis
  pantofi: 0x3a2f55,   // mov închis
  par: 0x6b4529,       // șaten
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
  private par: THREE.Group;
  private corp: THREE.Mesh;
  private manaSt = new THREE.Group();
  private manaDr = new THREE.Group();
  private piciorSt = new THREE.Group();
  private piciorDr = new THREE.Group();
  private faza = 0; // pentru animația de mers
  // bucățile care se recolorează la Personalizare
  private pantaloni: THREE.Mesh[] = [];
  private pantofi: THREE.Mesh[] = [];
  private maneci: THREE.Mesh[] = [];
  private brate: THREE.Mesh[] = [];

  constructor(culori: CuloriPersonaj = CULORI_IMPLICITE) {
    this.obiect.add(this.corpGrup);

    // Picioare: încheietura la șold (y = 0.7). Fiecare = pantalon + adidas
    this.piciorSt.position.set(-0.2, 0.7, 0);
    this.piciorDr.position.set(0.2, 0.7, 0);
    for (const g of [this.piciorSt, this.piciorDr]) {
      const pantalon = cub(0.34, 0.56, 0.38, culori.pantaloni, 0, -0.28, 0);
      const pantof = cub(0.36, 0.15, 0.46, culori.pantofi, 0, -0.625, 0.04);
      this.pantaloni.push(pantalon);
      this.pantofi.push(pantof);
      g.add(pantalon, pantof);
    }

    // Corpul (tricoul)
    this.corp = cub(0.8, 0.7, 0.42, culori.tricou, 0, 1.05, 0);

    // Mâini: încheietura la umăr (y = 1.35). Mânecă scurtă de tricou + braț
    this.manaSt.position.set(-0.53, 1.35, 0);
    this.manaDr.position.set(0.53, 1.35, 0);
    for (const g of [this.manaSt, this.manaDr]) {
      const maneca = cub(0.3, 0.28, 0.34, culori.tricou, 0, -0.08, 0);
      const brat = cub(0.24, 0.44, 0.28, culori.piele, 0, -0.42, 0);
      this.maneci.push(maneca);
      this.brate.push(brat);
      g.add(maneca, brat);
    }

    // Capul de băiețel: păr șaten, ochi mari, sprâncene, năsuc, obraji și zâmbet
    this.cap = cub(0.52, 0.52, 0.52, culori.piele, 0, 1.68, 0);
    const fata = this.creeazaFata();
    this.par = this.creeazaPar(culori.par);

    this.corpGrup.add(this.piciorSt, this.piciorDr, this.corp, this.manaSt, this.manaDr, this.cap, fata, this.par);
  }

  /** Fața: totul e pus pe partea din față a capului (spre +z) */
  private creeazaFata() {
    const f = new THREE.Group();
    f.position.set(0, 1.68, 0.262);
    // ochi: albul ochiului + pupila puțin mai în față
    for (const x of [-0.12, 0.12]) {
      f.add(cub(0.13, 0.13, 0.01, 0xffffff, x, 0.03, 0));
      f.add(cub(0.07, 0.09, 0.012, 0x2b1a0e, x + 0.015, 0.02, 0.006));
      f.add(cub(0.025, 0.025, 0.014, 0xffffff, x + 0.03, 0.045, 0.012)); // sclipire
      // sprâncene
      f.add(cub(0.13, 0.035, 0.012, 0x4a2a12, x, 0.135, 0.002));
      // obraji rozalii
      f.add(cub(0.07, 0.04, 0.008, 0xf29a9a, x * 1.45, -0.075, 0));
    }
    // năsuc
    f.add(cub(0.05, 0.06, 0.04, 0xe8b88a, 0, -0.04, 0.01));
    // zâmbet: o linie + colțurile ridicate
    f.add(cub(0.14, 0.035, 0.01, 0x8a2f2f, 0, -0.14, 0));
    f.add(cub(0.035, 0.035, 0.01, 0x8a2f2f, -0.085, -0.115, 0));
    f.add(cub(0.035, 0.035, 0.01, 0x8a2f2f, 0.085, -0.115, 0));
    return f;
  }

  /** Părul: o „căciulă” de cuburi pe creștet, la spate, pe laterale și un breton */
  private creeazaPar(culoare: number) {
    const p = new THREE.Group();
    p.position.set(0, 1.68, 0);
    p.add(cub(0.56, 0.14, 0.56, culoare, 0, 0.3, 0));        // creștet
    p.add(cub(0.56, 0.4, 0.08, culoare, 0, 0.1, -0.27));     // spate
    p.add(cub(0.06, 0.26, 0.5, culoare, -0.28, 0.14, -0.02)); // laterale
    p.add(cub(0.06, 0.26, 0.5, culoare, 0.28, 0.14, -0.02));
    p.add(cub(0.56, 0.08, 0.08, culoare, 0, 0.2, 0.25));     // breton
    p.add(cub(0.18, 0.13, 0.08, culoare, -0.14, 0.16, 0.26)); // șuviță
    p.add(cub(0.12, 0.12, 0.12, culoare, 0.08, 0.4, 0.05));  // moț
    return p;
  }

  /** Schimbă culorile (folosit la Personalizare) */
  seteazaCulori(c: CuloriPersonaj) {
    const vopseste = (m: THREE.Object3D, culoare: number) =>
      ((m as THREE.Mesh).material as THREE.MeshLambertMaterial).color.set(culoare);
    vopseste(this.cap, c.piele);
    vopseste(this.corp, c.tricou);
    this.brate.forEach((m) => vopseste(m, c.piele));
    this.maneci.forEach((m) => vopseste(m, c.tricou));
    this.pantaloni.forEach((m) => vopseste(m, c.pantaloni));
    this.pantofi.forEach((m) => vopseste(m, c.pantofi));
    this.par.children.forEach((m) => vopseste(m, c.par));
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
