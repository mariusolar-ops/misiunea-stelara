// Jucătorul: leagă personajul (ce se vede) de fizică (cum se mișcă).
import * as THREE from 'three';
import { Personaj } from './Personaj';
import { misca, solulDeSub, ocupat } from './Fizica';
import type { Platforma, EfectCalcare } from '../lume/Platforma';
import type { Intrari } from '../control/Intrari';
import type { PuteriActive } from './Puteri';

// Reglaje de „senzație” – le putem ajusta ușor
const VITEZA_MERS = 7.5;       // unități pe secundă
const ACCELERATIE = 40;        // cât de repede pornește / se oprește
const ACCELERATIE_AER = 22;    // în aer controlezi puțin mai greu
const ACCELERATIE_GHEATA = 5;  // pe gheață aluneci: pornești și te oprești greu
const GRAVITATIE = 34;
const VITEZA_SARITURA = 12.5;  // => sare cam 2,3 unități în sus
const VITEZA_MAX_CADERE = 40;
const TIMP_COYOTE = 0.1;       // mai poți sări o clipă după ce ai ieșit de pe margine
const TIMP_MEMORIE_SARI = 0.12; // dacă apeși SARI puțin înainte să aterizezi, tot sare
// Super-puteri
const FACTOR_SUPER_SARITURA = 1.32; // => cam 4 unități în sus
const FACTOR_VITEZA = 1.35;
const VITEZA_ZBOR = 5.5;            // cât de repede urci când zbori
export const ENERGIE_ZBOR = 1.6;    // câte secunde poți zbura până aterizezi din nou

export class Jucator {
  personaj = new Personaj();
  poz = new THREE.Vector3();
  viteza = new THREE.Vector3();
  /** Împingerea de la banda rulantă (se pune la fiecare pas cât stai pe bandă) */
  impingere = new THREE.Vector3();
  peSol = false;
  /** Devine true când personajul sare (pentru sunet); Joc îl resetează */
  aSarit = false;
  /** Super-puterile pornite */
  puteri: PuteriActive = { saritura: false, viteza: false, dubla: false, zbor: false, teleport: false };
  /** Energia de zbor rămasă (secunde) */
  energie = ENERGIE_ZBOR;
  /** True cât timp zboară acum */
  zboara = false;
  private dublaFolosita = false;
  /** Gravitația nivelului (1 = normală, 0.4 = gravitație mică) */
  gravitatie = 1;
  /** Cât de tare a aterizat în ultimul pas (0 = n-a aterizat). Joc îl citește și îl resetează. */
  aterizare = 0;
  /** E lipit de un perete magnetic? */
  peZid = false;
  private normalaZid = new THREE.Vector3();
  /** După ce sari de pe perete, o clipă nu te mai lipești (ca să nu te prinzi iar de același perete) */
  private timpDetasare = 0;
  /** Stă pe gheață? (atunci alunecă) */
  private peGheata = false;
  private platformaSub: Platforma | null = null;
  private timpInAer = 0;
  private timpDeLaSari = 99;
  private umbra: THREE.Mesh;
  /** Unghiul spre care privește personajul */
  directie = 0;

  constructor(scena: THREE.Scene) {
    scena.add(this.personaj.obiect);
    // Pata de umbră de sub personaj: un cerc închis la culoare, semi-transparent
    this.umbra = new THREE.Mesh(
      new THREE.CircleGeometry(0.5, 16),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4, depthWrite: false }),
    );
    this.umbra.rotation.x = -Math.PI / 2;
    scena.add(this.umbra);
  }

  /** Pune personajul într-un loc (start sau checkpoint) */
  /**
   * Puterea „Teleportare”: te mută până la 4 unități în fața ta.
   * Nu te poate băga într-un perete sau într-o platformă (încearcă mai aproape dacă e ocupat).
   */
  teleportInainte(platforme: Platforma[]) {
    const dx = Math.sin(this.directie), dz = Math.cos(this.directie);
    for (const d of [4, 3, 2, 1]) {
      const tinta = this.poz.clone().add(new THREE.Vector3(dx * d, 0.05, dz * d));
      if (!ocupat(tinta, platforme)) {
        this.poz.copy(tinta);
        this.viteza.y = Math.max(this.viteza.y, 0);
        this.peZid = false;
        return true;
      }
    }
    return false;
  }

  teleporteaza(p: THREE.Vector3, directie = 0) {
    this.poz.copy(p);
    this.viteza.set(0, 0, 0);
    this.directie = directie;
    this.platformaSub = null;
    this.impingere.set(0, 0, 0);
    this.energie = ENERGIE_ZBOR;
    this.peZid = false;
  }

  /**
   * @param unghiCamera spre ce parte privește camera (ca „înainte” să fie mereu de la cameră încolo)
   */
  actualizeaza(dt: number, intrari: Intrari, unghiCamera: number, platforme: Platforma[], sariAcum: boolean, timp: number): EfectCalcare {
    // 1) Dacă platforma de sub noi s-a mișcat, ne mișcăm și noi cu ea
    if (this.platformaSub && this.peSol) {
      this.poz.add(this.platformaSub.deplasare);
    }

    // 2) Direcția dorită, raportată la cameră
    const ix = intrari.mers.x, iy = intrari.mers.y;
    const sin = Math.sin(unghiCamera), cos = Math.cos(unghiCamera);
    // „înainte” = dinspre cameră spre personaj
    const dx = ix * cos - iy * sin;
    const dz = -ix * sin - iy * cos;
    const putere = Math.min(1, Math.hypot(ix, iy));

    const acc = (this.peSol ? (this.peGheata ? ACCELERATIE_GHEATA : ACCELERATIE) : ACCELERATIE_AER) * dt;
    const vMers = VITEZA_MERS * (this.puteri.viteza ? FACTOR_VITEZA : 1);
    const tintaX = dx * vMers, tintaZ = dz * vMers;
    this.viteza.x += THREE.MathUtils.clamp(tintaX - this.viteza.x, -acc, acc);
    this.viteza.z += THREE.MathUtils.clamp(tintaZ - this.viteza.z, -acc, acc);

    // 3) Săritura (cu „coyote time” și memorie a apăsării, ca să fie iertător)
    if (sariAcum) this.timpDeLaSari = 0; else this.timpDeLaSari += dt;
    this.timpInAer = this.peSol ? 0 : this.timpInAer + dt;
    const vSaritura = VITEZA_SARITURA * (this.puteri.saritura ? FACTOR_SUPER_SARITURA : 1);
    if (this.peSol) { this.dublaFolosita = false; this.energie = Math.min(ENERGIE_ZBOR, this.energie + dt * 2); }

    // 3-zid) Pe peretele magnetic: alergi pe el, aluneci foarte încet și poți sări de pe el
    this.timpDetasare = Math.max(0, this.timpDetasare - dt);
    if (this.peZid) {
      const n = this.normalaZid;
      const vn = this.viteza.x * n.x + this.viteza.z * n.z; // cât de repede te miști dinspre perete
      if (dx * n.x + dz * n.z > 0.6 && putere > 0.5) {
        this.peZid = false; // tragi de joystick în partea cealaltă: te desprinzi
      } else if (sariAcum) {
        // săritura de pe perete: în sus și în partea opusă peretelui
        this.viteza.x += n.x * (9 - vn);
        this.viteza.z += n.z * (9 - vn);
        this.viteza.y = vSaritura;
        this.peZid = false;
        this.timpDetasare = 0.25;
        this.timpDeLaSari = 99;
        this.dublaFolosita = false;
        this.aSarit = true;
      } else {
        // o mică „atracție” spre perete, ca să rămâi lipit cât alergi pe lângă el
        this.viteza.x -= n.x * (vn + 3);
        this.viteza.z -= n.z * (vn + 3);
      }
    }

    if (this.timpDeLaSari < TIMP_MEMORIE_SARI && this.timpInAer < TIMP_COYOTE) {
      this.viteza.y = vSaritura;
      this.aSarit = true;
      this.timpDeLaSari = 99;
      this.timpInAer = TIMP_COYOTE; // nu mai sare a doua oară din aer
      this.peSol = false;
    }

    // 3b) Săritura dublă: o apăsare nouă pe SARI în aer
    else if (sariAcum && !this.peSol && this.puteri.dubla && !this.dublaFolosita) {
      this.viteza.y = vSaritura * 0.9;
      this.dublaFolosita = true;
      this.timpDeLaSari = 99;
      this.aSarit = true;
    }

    // 3c) Zborul: ții apăsat SARI în aer și urci încet, cât ai energie
    this.zboara = false;
    if (this.puteri.zbor && !this.peSol && intrari.sariTinut && this.energie > 0 && this.viteza.y < VITEZA_ZBOR) {
      this.zboara = true;
      this.energie = Math.max(0, this.energie - dt);
      this.viteza.y = VITEZA_ZBOR;
    }

    // 4) Gravitația (nu trage în jos cât timp zbori)
    // pe perete: dacă alergi pe lângă el, rămâi la aceeași înălțime; dacă stai, aluneci încet în jos
    if (this.peZid && this.viteza.y <= 0) {
      const n = this.normalaZid, vn = this.viteza.x * n.x + this.viteza.z * n.z;
      const deLungul = Math.hypot(this.viteza.x - n.x * vn, this.viteza.z - n.z * vn); // viteza de-a lungul peretelui
      this.viteza.y = deLungul > 2.5 ? 0 : -0.8;
    }
    else if (!this.zboara) this.viteza.y = Math.max(this.viteza.y - GRAVITATIE * this.gravitatie * dt, -VITEZA_MAX_CADERE);

    // 5) Mișcarea, cu coliziuni
    const pas = this.viteza.clone().add(this.impingere).multiplyScalar(dt);
    this.impingere.set(0, 0, 0);
    const eraPeSol = this.peSol, vitezaCadere = -this.viteza.y;
    const rez = misca(this.poz, this.viteza, pas, platforme);
    if (rez.peSol && !eraPeSol && vitezaCadere > 9) this.aterizare = vitezaCadere;
    this.peSol = rez.peSol;
    this.platformaSub = rez.platformaSub;
    // ne-am lipit (sau am rămas lipiți) de un perete magnetic?
    if (rez.perete && !rez.peSol && this.timpDetasare <= 0) {
      if (!this.peZid) this.dublaFolosita = false;
      this.peZid = true;
      this.normalaZid.copy(rez.perete);
    } else if (!rez.perete || rez.peSol) {
      this.peZid = false;
    }

    // 5b) Efectul platformei pe care am aterizat (lavă, trambulină, bandă...)
    let efect: EfectCalcare = null;
    if (rez.platformaSub) {
      efect = rez.platformaSub.laCalcare(this, timp);
      this.peGheata = efect === 'gheata';
      if (efect === 'trambulina') { this.peSol = false; this.platformaSub = null; this.timpInAer = TIMP_COYOTE; }
    }

    // 6) Întoarcem personajul spre direcția de mers
    const vOriz = Math.hypot(this.viteza.x, this.viteza.z);
    if (vOriz > 0.5 && putere > 0.1) {
      const tinta = Math.atan2(this.viteza.x, this.viteza.z);
      let dif = tinta - this.directie;
      dif = Math.atan2(Math.sin(dif), Math.cos(dif)); // cel mai scurt drum
      this.directie += dif * Math.min(1, 14 * dt);
    }
    return efect;
  }

  /** Actualizează ce se vede (o dată pe cadru) */
  deseneaza(dt: number, platforme: Platforma[]) {
    this.personaj.obiect.position.copy(this.poz);
    this.personaj.obiect.rotation.y = this.directie;
    const vOriz = Math.min(1, Math.hypot(this.viteza.x, this.viteza.z) / VITEZA_MERS);
    this.personaj.animeaza(dt, this.peZid ? Math.max(vOriz, 0.6) : vOriz, !this.peSol && !this.peZid, this.viteza.y > 0, this.zboara);
    // pe perete: personajul se apleacă spre perete
    const o = this.personaj.obiect;
    o.rotation.order = 'YXZ';
    let aplecare = 0;
    if (this.peZid) {
      const dreaptaX = Math.cos(this.directie), dreaptaZ = -Math.sin(this.directie);
      aplecare = -(this.normalaZid.x * dreaptaX + this.normalaZid.z * dreaptaZ) * 0.5;
    }
    o.rotation.z += (aplecare - o.rotation.z) * Math.min(1, dt * 10);

    // umbra stă pe platforma de dedesubt și se micșorează cu cât ești mai sus
    const sol = solulDeSub(this.poz, platforme);
    if (sol === null) {
      this.umbra.visible = false;
    } else {
      this.umbra.visible = true;
      this.umbra.position.set(this.poz.x, sol + 0.02, this.poz.z);
      const s = THREE.MathUtils.clamp(1 - (this.poz.y - sol) / 10, 0.35, 1);
      this.umbra.scale.setScalar(s);
    }
  }
}
