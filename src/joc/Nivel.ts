// Un nivel „construit”: platformele, steagurile, monedele și poarta, puse în scenă.
// Tot aici verificăm ce atinge personajul.
import * as THREE from 'three';
import type { Platforma } from '../lume/Platforma';
import { creeazaPlatforma } from '../lume/platforme';
import { Steag } from '../lume/Steag';
import { Moneda } from '../lume/Moneda';
import { Poarta } from '../lume/Poarta';
import { SteaSecreta } from '../lume/SteaSecreta';
import { creeazaDecor, type Decor } from '../lume/Decor';
import type { DefinitieNivel } from '../nivele/tipuri';

export interface Evenimente {
  steagNou: boolean;
  secretNou: boolean;
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

  /** Verifică ce a atins personajul în acest cadru */
  verifica(poz: THREE.Vector3, timp: number): Evenimente {
    const ev: Evenimente = { steagNou: false, secretNou: false, monedeNoi: 0, final: false };
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
