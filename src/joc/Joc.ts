// Bucla principală a jocului: în fiecare cadru citește comenzile, mișcă personajul,
// mută camera și desenează.
import * as THREE from 'three';
import { creeazaScena } from '../lume/Scena';
import { Platforma } from '../lume/Platforma';
import { Jucator } from './Jucator';
import { CameraUrmarire } from './CameraUrmarire';
import { Intrari } from '../control/Intrari';
import { pornesteAtingere } from '../control/Atingere';
import type { DefinitieNivel } from '../nivele/tipuri';

const PAS_FIZICA = 1 / 120;   // fizica rulează în pași mici, ca să nu treacă prin platforme
const INALTIME_CADERE = -25;  // sub înălțimea asta personajul „cade” și revine

export class Joc {
  private intrari = new Intrari();
  private grafica: ReturnType<typeof creeazaScena>;
  private jucator: Jucator;
  private camera: CameraUrmarire;
  private platforme: Platforma[] = [];
  private nivel!: DefinitieNivel;
  private ceas = new THREE.Clock();
  private timp = 0;
  private rezervaFizica = 0;
  private elMesaj = document.getElementById('mesaj')!;
  private elFps = document.getElementById('fps')!;
  private cadre = 0;
  private timpFps = 0;
  private timerMesaj = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.grafica = creeazaScena(canvas);
    this.jucator = new Jucator(this.grafica.scena);
    this.camera = new CameraUrmarire(this.grafica.camera);
    pornesteAtingere(this.intrari);
  }

  incarcaNivel(def: DefinitieNivel) {
    // scoatem platformele vechi
    for (const p of this.platforme) this.grafica.scena.remove(p.obiect);
    this.nivel = def;
    this.platforme = def.platforme.map((d) => new Platforma(d));
    for (const p of this.platforme) this.grafica.scena.add(p.obiect);
    this.revino();
  }

  /** Personajul revine la start (mai târziu: la ultimul steag) */
  private revino() {
    const dir = this.nivel.directieStart ?? 0;
    this.jucator.teleporteaza(new THREE.Vector3(...this.nivel.start), dir);
    // camera stă în spatele personajului (pe partea opusă direcției în care privește)
    this.camera.unghi = dir + Math.PI;
    this.camera.sari(this.jucator.poz);
  }

  arataMesaj(text: string, secunde = 1.5) {
    this.elMesaj.textContent = text;
    this.elMesaj.classList.add('vizibil');
    clearTimeout(this.timerMesaj);
    this.timerMesaj = window.setTimeout(() => this.elMesaj.classList.remove('vizibil'), secunde * 1000);
  }

  porneste() {
    this.ceas.start();
    this.grafica.renderer.setAnimationLoop(() => this.cadru());
  }

  private cadru() {
    // dt limitat: dacă telefonul „sughite”, nu sărim prin platforme
    const dt = Math.min(this.ceas.getDelta(), 1 / 20);
    this.timp += dt;

    this.intrari.actualizeaza();
    const rot = this.intrari.iaRotireCamera();
    this.camera.roteste(rot.x, rot.y);
    let sari = this.intrari.iaSari();

    // fizica în pași mici și egali
    this.rezervaFizica += dt;
    while (this.rezervaFizica >= PAS_FIZICA) {
      for (const p of this.platforme) p.actualizeaza(PAS_FIZICA, this.timp);
      this.jucator.actualizeaza(PAS_FIZICA, this.intrari, this.camera.unghi, this.platforme, sari);
      sari = false;
      this.rezervaFizica -= PAS_FIZICA;
    }

    // a căzut în gol?
    if (this.jucator.poz.y < INALTIME_CADERE) {
      this.arataMesaj('Ai căzut! Mai încearcă!');
      this.revino();
    }

    this.jucator.deseneaza(dt, this.platforme);
    this.camera.actualizeaza(this.jucator.poz, dt);
    this.grafica.renderer.render(this.grafica.scena, this.grafica.camera);

    // contor de cadre pe secundă (ca să vedem dacă merge fluid)
    this.cadre++;
    this.timpFps += dt;
    if (this.timpFps >= 1) {
      this.elFps.textContent = `${Math.round(this.cadre / this.timpFps)} FPS`;
      this.cadre = 0;
      this.timpFps = 0;
    }
  }
}
