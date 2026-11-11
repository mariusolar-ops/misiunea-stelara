// Personajul din cuburi: cap, corp, două mâini, două picioare.
// Se poate alege: băiat sau fată, coafura, modelul tricoului, pantaloni / fustă și culorile.
// Mâinile și picioarele au „încheietura” sus (umăr / șold), ca să se balanseze natural.
import * as THREE from 'three';
import type { Slot } from './Accesorii';

export interface CuloriPersonaj {
  piele: number;
  tricou: number;    // corpul și mânecile
  pantaloni: number; // pantalonii sau fusta
  pantofi: number;
  par: number;
  detalii: number;   // dungi, desene pe tricou, funde, nasturi
}

export type Gen = 'baiat' | 'fata';
export type Coafura = 'scurt' | 'lung' | 'coada' | 'codite' | 'creasta';
export type ModelTricou = 'simplu' | 'dungi' | 'stea' | 'fulger' | 'hanorac' | 'camasa';
export type ModelPantaloni = 'lungi' | 'scurti' | 'fusta';

export interface AspectPersonaj {
  gen: Gen;
  coafura: Coafura;
  tricou: ModelTricou;
  pantaloni: ModelPantaloni;
  /** Costumul de aur (recompensa supremă) */
  costumAur?: boolean;
}

// Culorile de pornire, după hainele lui Mihai: tricou și pantaloni bleu, adidași închiși
export const CULORI_IMPLICITE: CuloriPersonaj = {
  piele: 0xf5cfa0,
  tricou: 0x9ec5ee,    // bleu
  pantaloni: 0xb3cdec, // bleu deschis
  pantofi: 0x3a2f55,   // mov închis
  par: 0x6b4529,       // șaten
  detalii: 0xffffff,
};

export const ASPECT_IMPLICIT: AspectPersonaj = { gen: 'baiat', coafura: 'scurt', tricou: 'simplu', pantaloni: 'lungi' };

const CUB = new THREE.BoxGeometry(1, 1, 1);

/** Un cub colorat, cu mărimea și poziția date */
function cub(l: number, h: number, a: number, culoare: number, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(CUB, new THREE.MeshLambertMaterial({ color: culoare }));
  m.scale.set(l, h, a);
  m.position.set(x, y, z);
  return m;
}

/** O culoare puțin mai închisă (pentru buzunare, umbre) */
function mai_inchis(c: number, k = 0.75) {
  return new THREE.Color(c).multiplyScalar(k).getHex();
}

export class Personaj {
  obiect = new THREE.Group();     // tot personajul (poziția = la tălpi)
  private corpGrup = new THREE.Group(); // se înclină puțin când fuge
  private manaSt = new THREE.Group();
  private manaDr = new THREE.Group();
  private piciorSt = new THREE.Group();
  private piciorDr = new THREE.Group();
  private faza = 0; // pentru animația de mers
  /** Locurile unde se prind accesoriile */
  private sloturi: Record<Slot, THREE.Group> = { cap: new THREE.Group(), fata: new THREE.Group(), spate: new THREE.Group(), umar: new THREE.Group() };

  constructor(culori: CuloriPersonaj = CULORI_IMPLICITE, aspect: AspectPersonaj = ASPECT_IMPLICIT) {
    this.obiect.add(this.corpGrup);
    this.construieste(culori, aspect);
  }

  /** (Re)construiește tot personajul cu culorile și aspectul date */
  construieste(culoriAlese: CuloriPersonaj, a: AspectPersonaj) {
    // costumul de aur: hainele devin aurii și strălucesc
    const AUR = 0xffc83a, AUR2 = 0xe0a020;
    const c = a.costumAur ? { ...culoriAlese, tricou: AUR, pantaloni: AUR2, pantofi: 0xfff0b0, detalii: 0xffffff } : culoriAlese;
    // golim tot ce era înainte (și eliberăm materialele)
    this.corpGrup.traverse((o) => { if (o instanceof THREE.Mesh) (o.material as THREE.Material).dispose(); });
    this.corpGrup.clear();
    this.manaSt = new THREE.Group();
    this.manaDr = new THREE.Group();
    this.piciorSt = new THREE.Group();
    this.piciorDr = new THREE.Group();

    this.construiestePicioare(c, a);
    this.construiesteCorp(c, a);
    this.construiesteMaini(c, a);

    // Capul
    this.corpGrup.add(cub(0.52, 0.52, 0.52, c.piele, 0, 1.68, 0));
    this.corpGrup.add(this.creeazaFata(a.gen));
    this.corpGrup.add(this.creeazaPar(c, a.coafura));

    // sloturile pentru accesorii: capul și fața la centrul capului, spatele la mijlocul spatelui
    for (const s of Object.values(this.sloturi)) s.clear();
    this.sloturi.cap.position.set(0, 1.68, 0);
    this.sloturi.fata.position.set(0, 1.68, 0);
    this.sloturi.spate.position.set(0, 1.05, a.tricou === 'hanorac' ? -0.27 : -0.21);
    this.sloturi.umar.position.set(-0.53, 1.42, 0);
    this.corpGrup.add(this.piciorSt, this.piciorDr, this.manaSt, this.manaDr,
      this.sloturi.cap, this.sloturi.fata, this.sloturi.spate, this.sloturi.umar);
    if (a.costumAur) {
      this.corpGrup.traverse((o) => {
        if (!(o instanceof THREE.Mesh)) return;
        const m = o.material as THREE.MeshLambertMaterial;
        if (m.color.getHex() === AUR || m.color.getHex() === AUR2) m.emissive.set(0x5a3c00);
      });
    }
  }

  private construiestePicioare(c: CuloriPersonaj, a: AspectPersonaj) {
    // încheietura la șold (y = 0.7)
    this.piciorSt.position.set(-0.2, 0.7, 0);
    this.piciorDr.position.set(0.2, 0.7, 0);
    for (const g of [this.piciorSt, this.piciorDr]) {
      if (a.pantaloni === 'lungi') {
        g.add(cub(0.34, 0.56, 0.38, c.pantaloni, 0, -0.28, 0));
      } else if (a.pantaloni === 'scurti') {
        g.add(cub(0.35, 0.26, 0.39, c.pantaloni, 0, -0.13, 0));
        g.add(cub(0.3, 0.3, 0.32, c.piele, 0, -0.41, 0));
      } else {
        // sub fustă: picioarele (piele)
        g.add(cub(0.28, 0.56, 0.3, c.piele, 0, -0.28, 0));
      }
      g.add(cub(0.36, 0.15, 0.46, c.pantofi, 0, -0.625, 0.04)); // adidașii
    }
    if (a.pantaloni === 'fusta') {
      // fusta: două „etaje”, mai largă jos
      this.corpGrup.add(cub(0.84, 0.16, 0.46, c.pantaloni, 0, 0.66, 0));
      this.corpGrup.add(cub(0.96, 0.18, 0.56, c.pantaloni, 0, 0.5, 0));
      this.corpGrup.add(cub(0.98, 0.04, 0.58, c.detalii, 0, 0.42, 0)); // tivul
    }
  }

  private construiesteCorp(c: CuloriPersonaj, a: AspectPersonaj) {
    const g = this.corpGrup;
    g.add(cub(0.8, 0.7, 0.42, c.tricou, 0, 1.05, 0));
    const fata = 0.215; // fața din față a corpului (z)
    switch (a.tricou) {
      case 'dungi':
        for (const y of [0.82, 1.02, 1.22]) g.add(cub(0.82, 0.08, 0.44, c.detalii, 0, y, 0));
        break;
      case 'stea': // o stea din 5 cuburi pe piept
        g.add(cub(0.1, 0.1, 0.02, c.detalii, 0, 1.12, fata));
        g.add(cub(0.3, 0.07, 0.02, c.detalii, 0, 1.12, fata));
        g.add(cub(0.07, 0.3, 0.02, c.detalii, 0, 1.08, fata));
        g.add(cub(0.07, 0.12, 0.02, c.detalii, -0.07, 0.95, fata));
        g.add(cub(0.07, 0.12, 0.02, c.detalii, 0.07, 0.95, fata));
        break;
      case 'fulger': // un fulger în zig-zag
        g.add(cub(0.08, 0.2, 0.02, c.detalii, 0.06, 1.2, fata));
        g.add(cub(0.18, 0.06, 0.02, c.detalii, 0.0, 1.09, fata));
        g.add(cub(0.08, 0.22, 0.02, c.detalii, -0.06, 0.97, fata));
        break;
      case 'hanorac':
        g.add(cub(0.5, 0.36, 0.14, c.tricou, 0, 1.36, -0.26));            // gluga pe spate
        g.add(cub(0.5, 0.16, 0.02, mai_inchis(c.tricou), 0, 0.86, fata)); // buzunarul
        g.add(cub(0.03, 0.18, 0.02, c.detalii, -0.08, 1.24, fata + 0.005)); // șnururi
        g.add(cub(0.03, 0.18, 0.02, c.detalii, 0.08, 1.24, fata + 0.005));
        break;
      case 'camasa':
        g.add(cub(0.14, 0.08, 0.03, c.detalii, -0.1, 1.38, fata));       // gulerul
        g.add(cub(0.14, 0.08, 0.03, c.detalii, 0.1, 1.38, fata));
        for (const y of [1.22, 1.06, 0.9]) g.add(cub(0.05, 0.05, 0.02, c.detalii, 0, y, fata)); // nasturi
        break;
    }
  }

  private construiesteMaini(c: CuloriPersonaj, a: AspectPersonaj) {
    // încheietura la umăr (y = 1.35)
    this.manaSt.position.set(-0.53, 1.35, 0);
    this.manaDr.position.set(0.53, 1.35, 0);
    for (const g of [this.manaSt, this.manaDr]) {
      if (a.tricou === 'hanorac' || a.tricou === 'camasa') {
        // mâneci lungi + palma
        g.add(cub(0.28, 0.6, 0.32, c.tricou, 0, -0.26, 0));
        g.add(cub(0.22, 0.12, 0.26, c.piele, 0, -0.62, 0));
      } else {
        g.add(cub(0.3, 0.28, 0.34, c.tricou, 0, -0.08, 0));   // mânecă scurtă
        g.add(cub(0.24, 0.44, 0.28, c.piele, 0, -0.42, 0));    // brațul
      }
    }
  }

  /** Fața: totul e pus pe partea din față a capului (spre +z) */
  private creeazaFata(gen: Gen) {
    const f = new THREE.Group();
    f.position.set(0, 1.68, 0.262);
    for (const x of [-0.12, 0.12]) {
      f.add(cub(0.13, 0.13, 0.01, 0xffffff, x, 0.03, 0));                  // albul ochiului
      f.add(cub(0.07, 0.09, 0.012, 0x2b1a0e, x + 0.015, 0.02, 0.006));     // pupila
      f.add(cub(0.025, 0.025, 0.014, 0xffffff, x + 0.03, 0.045, 0.012));   // sclipire
      f.add(cub(0.13, 0.035, 0.012, 0x4a2a12, x, 0.135, 0.002));           // sprânceana
      f.add(cub(0.07, 0.04, 0.008, 0xf29a9a, x * 1.45, -0.075, 0));        // obrajii
      if (gen === 'fata') {
        // gene: două cubulețe la colțul de sus al ochiului
        const colt = x < 0 ? -1 : 1;
        f.add(cub(0.04, 0.025, 0.014, 0x1a0f08, x + colt * 0.075, 0.09, 0.004));
        f.add(cub(0.03, 0.025, 0.014, 0x1a0f08, x + colt * 0.09, 0.11, 0.004));
      }
    }
    f.add(cub(0.05, 0.06, 0.04, 0xe8b88a, 0, -0.04, 0.01));                 // năsuc
    const gura = gen === 'fata' ? 0xc0446a : 0x8a2f2f;
    f.add(cub(0.14, 0.035, 0.01, gura, 0, -0.14, 0));                       // zâmbet
    f.add(cub(0.035, 0.035, 0.01, gura, -0.085, -0.115, 0));
    f.add(cub(0.035, 0.035, 0.01, gura, 0.085, -0.115, 0));
    return f;
  }

  /** Părul, după coafura aleasă (centrul grupului = centrul capului) */
  private creeazaPar(c: CuloriPersonaj, coafura: Coafura) {
    const p = new THREE.Group();
    p.position.set(0, 1.68, 0);
    const h = c.par;
    const breton = () => {
      p.add(cub(0.56, 0.08, 0.08, h, 0, 0.2, 0.25));
      p.add(cub(0.18, 0.13, 0.08, h, -0.14, 0.16, 0.26));
    };
    if (coafura === 'creasta') {
      // creastă: o fâșie înaltă pe mijlocul capului
      p.add(cub(0.14, 0.22, 0.6, h, 0, 0.36, -0.02));
      p.add(cub(0.14, 0.12, 0.12, h, 0, 0.5, 0.18));
      return p;
    }
    // „căciula” de bază: creștet, spate, laterale
    p.add(cub(0.56, 0.14, 0.56, h, 0, 0.3, 0));
    p.add(cub(0.56, 0.4, 0.08, h, 0, 0.1, -0.27));
    p.add(cub(0.06, 0.26, 0.5, h, -0.28, 0.14, -0.02));
    p.add(cub(0.06, 0.26, 0.5, h, 0.28, 0.14, -0.02));
    breton();
    switch (coafura) {
      case 'scurt':
        p.add(cub(0.12, 0.12, 0.12, h, 0.08, 0.4, 0.05)); // moț
        break;
      case 'lung':
        p.add(cub(0.6, 0.62, 0.1, h, 0, -0.18, -0.28));    // păr lung pe spate, până la umeri
        p.add(cub(0.07, 0.58, 0.36, h, -0.29, -0.08, -0.08));
        p.add(cub(0.07, 0.58, 0.36, h, 0.29, -0.08, -0.08));
        break;
      case 'coada':
        p.add(cub(0.14, 0.12, 0.08, c.detalii, 0, 0.18, -0.33)); // elasticul
        p.add(cub(0.16, 0.16, 0.2, h, 0, 0.14, -0.44));
        p.add(cub(0.14, 0.4, 0.14, h, 0, -0.1, -0.5));            // coada care atârnă
        break;
      case 'codite':
        for (const x of [-1, 1]) {
          p.add(cub(0.06, 0.1, 0.12, c.detalii, x * 0.32, 0.12, -0.08)); // funde
          p.add(cub(0.16, 0.32, 0.16, h, x * 0.4, -0.04, -0.08));
          p.add(cub(0.12, 0.16, 0.12, h, x * 0.42, -0.26, -0.08));
        }
        break;
    }
    return p;
  }

  /** Pune un accesoriu într-un slot (sau îl golește, cu null) */
  puneAccesoriu(slot: Slot, obiect: THREE.Object3D | null) {
    this.sloturi[slot].clear();
    if (obiect) this.sloturi[slot].add(obiect);
  }

  /** Mantia flutură, flăcările rachetei pâlpâie, aripile bat */
  private animeazaAccesorii(viteza: number, inAer: boolean, zboara: boolean) {
    const t = performance.now() / 1000;
    for (const o of this.sloturi.spate.children) {
      if (o.userData.flutura) o.rotation.x = 0.08 + viteza * 0.7 + (inAer ? 0.5 : 0) + Math.sin(t * 9) * 0.05 * (viteza + 0.3);
      if (o.userData.aripi) {
        // aripile bat mai repede în aer (și foarte repede când zbori)
        const bataie = Math.sin(t * (zboara ? 22 : inAer ? 14 : 4)) * (inAer ? 0.5 : 0.2);
        for (const a of o.children) a.rotation.y = (a.userData.parte as number) * (-0.35 + bataie);
      }
      const f = o.userData.flacara as THREE.Object3D | undefined;
      if (f) f.scale.y = (zboara ? 2.6 : inAer ? 1.6 : 0.7) + Math.sin(t * 30) * 0.25;
    }
    for (const o of this.sloturi.umar.children) {
      // balonul se leagănă și rămâne puțin în urmă când alergi; papagalul dă din cap
      if (o.userData.balon) { o.rotation.x = 0.15 + viteza * 0.5 + Math.sin(t * 2) * 0.08; o.rotation.z = Math.sin(t * 1.3) * 0.12; }
      if (o.userData.papagal) o.rotation.y = Math.sin(t * 3) * 0.4;
    }
  }

  /**
   * Animația: viteza (0..1) decide cât de tare balansează mâinile și picioarele.
   * În aer, mâinile se ridică și picioarele se strâng puțin. Când zboară, ține mâinile în lateral.
   */
  /** Dansul de victorie: țopăie, ridică mâinile și le flutură (se apelează după animeaza) */
  sarbatoreste(timp: number) {
    const t = timp * 8;
    this.corpGrup.position.y = Math.abs(Math.sin(t)) * 0.28;
    this.corpGrup.rotation.x = 0;
    this.manaSt.rotation.set(-2.7 + Math.sin(t) * 0.35, 0, -0.35 - Math.sin(t) * 0.25);
    this.manaDr.rotation.set(-2.7 - Math.sin(t) * 0.35, 0, 0.35 + Math.sin(t) * 0.25);
    this.piciorSt.rotation.x = Math.sin(t) * 0.3;
    this.piciorDr.rotation.x = -Math.sin(t) * 0.3;
  }

  animeaza(dt: number, viteza: number, inAer: boolean, urca: boolean, zboara = false) {
    this.animeazaAccesorii(viteza, inAer, zboara);
    const lerp = (a: number, b: number, k: number) => a + (b - a) * Math.min(1, k * dt);
    let picior = 0, mana = 0, aplecare = 0;

    if (inAer) {
      this.faza = 0;
      const tinta = zboara ? -0.2 : urca ? -2.6 : -2.2;
      const lateral = zboara ? 1.3 : 0.3;
      this.manaSt.rotation.x = lerp(this.manaSt.rotation.x, tinta, 14);
      this.manaDr.rotation.x = lerp(this.manaDr.rotation.x, tinta, 14);
      this.manaSt.rotation.z = lerp(this.manaSt.rotation.z, -lateral, 14);
      this.manaDr.rotation.z = lerp(this.manaDr.rotation.z, lateral, 14);
      this.piciorSt.rotation.x = lerp(this.piciorSt.rotation.x, zboara ? 0.2 : -0.5, 14);
      this.piciorDr.rotation.x = lerp(this.piciorDr.rotation.x, zboara ? 0.2 : 0.3, 14);
      this.corpGrup.rotation.x = lerp(this.corpGrup.rotation.x, zboara ? 0.25 : 0, 10);
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
