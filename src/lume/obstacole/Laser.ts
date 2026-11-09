// Laserul: o rază roșie subțire între două „emițătoare”. Dacă o atingi, te întorci la steag.
// Poate fi: fix, care clipește (pornit/oprit), care se mișcă (sus-jos / stânga-dreapta),
// sau rotativ (se învârte în jurul unui stâlp, ca acele unui ceas).
import * as THREE from 'three';
import { distantaLaSegment, type CorpObstacol, type EfectObstacol, type Obstacol } from './Obstacol';
import type { Punct } from '../../nivele/tipuri';

const CUB = new THREE.BoxGeometry(1, 1, 1);
const MAT_RAZA = new THREE.MeshBasicMaterial({ color: 0xff2a4a });
const MAT_HALOU = new THREE.MeshBasicMaterial({ color: 0xff5a7a, transparent: true, opacity: 0.3, depthWrite: false });
const MAT_EMITATOR = new THREE.MeshLambertMaterial({ color: 0x4a5070 });
const RAZA_LOVIRE = 0.42; // cât de aproape trebuie să fii de rază ca să te atingă (jumătate din personaj + raza)
const AX_X = new THREE.Vector3(1, 0, 0);

export interface DefLaser {
  tip: 'laser';
  a: Punct;
  b: Punct;
  /** Clipește: perioada (secunde), cât din timp e pornit (0..1), decalajul */
  clipeste?: { perioada: number; pornit?: number; faza?: number };
  /** Se mișcă dus-întors cu „cat” [x, y, z] în „perioada” secunde */
  miscare?: { cat: Punct; perioada: number; faza?: number };
}

export interface DefLaserRotativ {
  tip: 'laserRotativ';
  /** Centrul (stâlpul în jurul căruia se învârte) */
  centru: Punct;
  /** Lungimea razei */
  raza: number;
  /** Viteza de rotire (radiani pe secundă; minus = invers) */
  viteza: number;
  faza?: number;
}

/** Rază + halou, orientate între două puncte */
class Raza {
  grup = new THREE.Group();
  private miez = new THREE.Mesh(CUB, MAT_RAZA);
  private halou = new THREE.Mesh(CUB, MAT_HALOU);
  constructor() { this.grup.add(this.miez, this.halou); }
  pune(a: THREE.Vector3, b: THREE.Vector3, opacitate = 1) {
    const dir = b.clone().sub(a);
    const lung = dir.length();
    this.grup.position.copy(a).addScaledVector(dir, 0.5);
    this.grup.quaternion.setFromUnitVectors(AX_X, dir.normalize());
    this.miez.scale.set(lung, 0.07 * opacitate, 0.07 * opacitate);
    this.halou.scale.set(lung, 0.24, 0.24);
    this.halou.visible = opacitate > 0.5;
  }
}

/** Ating raza? Verificăm câteva puncte de-a lungul personajului, de la tălpi la cap */
function atinge(j: CorpObstacol, a: THREE.Vector3, b: THREE.Vector3) {
  const p = new THREE.Vector3();
  for (let h = 0.1; h <= 1.85; h += 0.25) {
    p.set(j.poz.x, j.poz.y + h, j.poz.z);
    if (distantaLaSegment(p, a, b) < RAZA_LOVIRE) return true;
  }
  return false;
}

export class Laser implements Obstacol {
  obiect = new THREE.Group();
  private raza = new Raza();
  private emA = new THREE.Mesh(CUB, MAT_EMITATOR);
  private emB = new THREE.Mesh(CUB, MAT_EMITATOR);
  private a0: THREE.Vector3;
  private b0: THREE.Vector3;
  private a = new THREE.Vector3();
  private b = new THREE.Vector3();

  constructor(private def: DefLaser) {
    this.a0 = new THREE.Vector3(...def.a);
    this.b0 = new THREE.Vector3(...def.b);
    for (const e of [this.emA, this.emB]) e.scale.setScalar(0.32);
    this.obiect.add(this.raza.grup, this.emA, this.emB);
  }

  actualizeaza(j: CorpObstacol, timp: number): EfectObstacol {
    // poziția (dacă se mișcă)
    const m = this.def.miscare;
    const k = m ? 0.5 - 0.5 * Math.cos(((timp / m.perioada) + (m.faza ?? 0)) * Math.PI * 2) : 0;
    this.a.copy(this.a0); this.b.copy(this.b0);
    if (m) { this.a.x += m.cat[0] * k; this.a.y += m.cat[1] * k; this.a.z += m.cat[2] * k;
             this.b.x += m.cat[0] * k; this.b.y += m.cat[1] * k; this.b.z += m.cat[2] * k; }
    this.emA.position.copy(this.a);
    this.emB.position.copy(this.b);

    // pornit / oprit (cu o licărire de avertizare chiar înainte să pornească)
    let pornit = true, avertizare = false;
    const c = this.def.clipeste;
    if (c) {
      const t = (((timp / c.perioada) + (c.faza ?? 0)) % 1 + 1) % 1;
      const procent = c.pornit ?? 0.5;
      pornit = t < procent;
      avertizare = !pornit && t > 0.88;
    }
    this.raza.grup.visible = pornit || (avertizare && Math.floor(timp * 20) % 2 === 0);
    this.raza.pune(this.a, this.b, pornit ? 1 : 0.4);
    return pornit && atinge(j, this.a, this.b) ? 'laser' : null;
  }
}

export class LaserRotativ implements Obstacol {
  obiect = new THREE.Group();
  private raza = new Raza();
  private centru: THREE.Vector3;
  private a = new THREE.Vector3();
  private b = new THREE.Vector3();

  constructor(private def: DefLaserRotativ) {
    this.centru = new THREE.Vector3(...def.centru);
    // emițătorul din capătul razei (se învârte cu ea)
    this.obiect.add(this.raza.grup);
  }

  actualizeaza(j: CorpObstacol, timp: number): EfectObstacol {
    const u = timp * this.def.viteza + (this.def.faza ?? 0);
    const dx = Math.cos(u), dz = Math.sin(u);
    // raza pornește de la marginea stâlpului (0,6) și merge până la capăt
    this.a.set(this.centru.x + dx * 0.6, this.centru.y, this.centru.z + dz * 0.6);
    this.b.set(this.centru.x + dx * this.def.raza, this.centru.y, this.centru.z + dz * this.def.raza);
    this.raza.pune(this.a, this.b);
    return atinge(j, this.a, this.b) ? 'laser' : null;
  }
}
