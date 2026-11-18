// Ușa care se deschide când apeși toate butoanele: un perete înalt cu un lacăt și câte
// un beculeț pentru fiecare buton (se aprinde verde când apeși butonul).
// Când se deschide, urcă în sus și dispare – acum poți trece.
import * as THREE from 'three';
import { Platforma, type DefinitiePlatforma } from '../Platforma';

export class Usa extends Platforma {
  private becuri: THREE.MeshBasicMaterial[] = [];
  private timpDeschidere = -1;
  private jos: number;

  constructor(def: DefinitiePlatforma, nrButoane: number) {
    super(def);
    this.jos = def.poz[1];
    const [l, h] = def.dim;
    // lacătul și becurile stau pe fața dinspre jucător; grupul e scalat cu „dim”,
    // așa că le punem într-un grup separat, care nu se scalează
    const fata = new THREE.Group();
    const lacat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.2), new THREE.MeshLambertMaterial({ color: 0xffd23f, emissive: 0x5a4000 }));
    lacat.position.set(0, 0, 0);
    const toarta = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 6, 16, Math.PI), new THREE.MeshLambertMaterial({ color: 0xc8c8d8 }));
    toarta.position.set(0, 0.4, 0);
    fata.add(lacat, toarta);
    for (let i = 0; i < nrButoane; i++) {
      const m = new THREE.MeshBasicMaterial({ color: 0xe8303a });
      this.becuri.push(m);
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), m);
      b.position.set((i - (nrButoane - 1) / 2) * 0.8, 1.3, 0);
      fata.add(b);
    }
    fata.position.set(def.poz[0], def.poz[1] - h / 2 + 2.2, def.poz[2] + def.dim[2] / 2 + 0.12);
    this.extra.add(fata);
    void l;
  }

  /** Obiectele care nu se scalează (lacătul, becurile) – Nivel le adaugă în scenă */
  extra = new THREE.Group();

  /** Câte butoane sunt apăsate: aprinde becurile */
  seteazaApasate(n: number) {
    this.becuri.forEach((m, i) => m.color.set(i < n ? 0x4ccf6a : 0xe8303a));
  }

  deschide(timp: number) { if (this.timpDeschidere < 0) this.timpDeschidere = timp; }

  actualizeaza(_dt: number, timp: number) {
    if (this.timpDeschidere < 0) return;
    const k = Math.min(1, (timp - this.timpDeschidere) / 1.5);
    // urcă în sus și apoi nu mai e solidă
    const dy = k * k * 9;
    this.obiect.position.y = this.jos + dy;
    this.extra.position.y = dy;
    this.actualizeazaCutia();
    if (k > 0.35) this.solid = false;
    if (k >= 1) { this.obiect.visible = false; this.extra.visible = false; }
  }
}
