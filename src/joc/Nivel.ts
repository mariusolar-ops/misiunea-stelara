// Un nivel „construit”: platformele, steagurile, monedele și poarta, puse în scenă.
// Tot aici verificăm ce atinge personajul.
import * as THREE from 'three';
import type { Platforma } from '../lume/Platforma';
import { creeazaPlatforma } from '../lume/platforme';
import { Steag } from '../lume/Steag';
import { Moneda } from '../lume/Moneda';
import { Poarta } from '../lume/Poarta';
import { SteaSecreta } from '../lume/SteaSecreta';
import { creeazaObstacol, type Obstacol, type EfectObstacol } from '../lume/obstacole';
import type { CorpObstacol } from '../lume/obstacole/Obstacol';
import { creeazaDecor, type Decor } from '../lume/Decor';
import type { DefinitieNivel } from '../nivele/tipuri';

export interface Evenimente {
  steagNou: boolean;
  secretNou: boolean;
  /** Textul unui indiciu, dacă tocmai a trecut pe lângă unul */
  indiciu: string | null;
  monedeNoi: number;
  final: boolean;
}

export class Nivel {
  grup = new THREE.Group();
  platforme: Platforma[];
  steaguri: Steag[];
  monede: Moneda[];
  poarta: Poarta;
  steaSecreta: SteaSecreta | null = null;
  obstacole: Obstacol[];
  decor: Decor;
  /** Locul unde revii când cazi (start sau ultimul steag) */
  punctReintoarcere: THREE.Vector3;
  directieReintoarcere: number;
  monedeLuate = 0;

  /** @param secretGasit dacă steaua secretă a acestui nivel a fost deja găsită */
  constructor(public def: DefinitieNivel, secretGasit = false) {
    this.platforme = def.platforme.map((d) => creeazaPlatforma(d));
    this.steaguri = def.steaguri.map((s) => new Steag(new THREE.Vector3(...s.poz), s.directie));
    this.monede = def.monede.map((m) => new Moneda(new THREE.Vector3(...m)));
    this.poarta = new Poarta(new THREE.Vector3(...def.final.poz), def.final.directie);

    for (const p of this.platforme) this.grup.add(p.obiect);
    this.obstacole = (def.obstacole ?? []).map((o) => creeazaObstacol(o));
    for (const o of this.obstacole) this.grup.add(o.obiect);
    for (const s of this.steaguri) this.grup.add(s.obiect);
    for (const m of this.monede) this.grup.add(m.obiect);
    if (def.secret) {
      this.steaSecreta = new SteaSecreta(new THREE.Vector3(...def.secret), secretGasit);
      this.grup.add(this.steaSecreta.obiect);
    }
    this.decor = creeazaDecor(def.tema);
    this.grup.add(this.poarta.obiect, this.decor.obiect);

    this.punctReintoarcere = new THREE.Vector3(...def.start);
    this.directieReintoarcere = def.directieStart;
  }

  get totalMonede() { return this.monede.length; }
  /** Câte monede trebuie pentru 3 stele (la nivelul cu două drumuri nu se pot lua toate deodată) */
  get tintaMonede() { return this.def.monedePentru3Stele ?? this.monede.length; }
  private indiciiAratate = new Set<number>();

  /** Verifică ce a atins personajul în acest cadru */
  verifica(poz: THREE.Vector3, timp: number): Evenimente {
    const ev: Evenimente = { steagNou: false, secretNou: false, indiciu: null, monedeNoi: 0, final: false };
    for (const [i, ind] of (this.def.indicii ?? []).entries()) {
      if (this.indiciiAratate.has(i)) continue;
      const dx = poz.x - ind.poz[0], dz = poz.z - ind.poz[2];
      if (dx * dx + dz * dz < ind.raza * ind.raza && Math.abs(poz.y - ind.poz[1]) < 2) {
        this.indiciiAratate.add(i);
        ev.indiciu = ind.text;
      }
    }
    if (this.steaSecreta?.atinsa(poz)) { this.steaSecreta.ia(timp); ev.secretNou = true; }
    for (const m of this.monede) {
      if (!m.luata && m.atinsa(poz)) { m.ia(timp); this.monedeLuate++; ev.monedeNoi++; }
    }
    for (const s of this.steaguri) {
      if (!s.activ && s.atins(poz)) {
        s.activeaza(timp);
        this.punctReintoarcere.copy(s.poz);
        this.directieReintoarcere = s.directie;
        ev.steagNou = true;
      }
    }
    if (this.poarta.atinsa(poz)) ev.final = true;
    return ev;
  }

  actualizeaza(dt: number, timp: number) {
    for (const p of this.platforme) p.actualizeaza(dt, timp);
  }

  /**
   * Mișcă obstacolele și verifică dacă l-au atins pe personaj.
   * Întoarce cel mai important efect (laserul și cristalele contează mai mult decât un pendul).
   */
  actualizeazaObstacole(j: CorpObstacol, timp: number, dt: number): EfectObstacol {
    let rez: EfectObstacol = null;
    for (const o of this.obstacole) {
      const e = o.actualizeaza(j, timp, dt);
      if (e === 'laser' || e === 'cristal') rez = e;
      else if (e && !rez) rez = e;
    }
    return rez;
  }

  /** Animațiile decorative (o dată pe cadru, nu în pașii de fizică) */
  anima(timp: number) {
    for (const s of this.steaguri) s.actualizeaza(timp);
    for (const m of this.monede) if (m.obiect.visible) m.actualizeaza(timp);
    for (const p of this.platforme) p.anima(timp);
    this.poarta.actualizeaza(timp);
    this.steaSecreta?.actualizeaza(timp);
    this.decor.anima?.(timp);
  }
}
