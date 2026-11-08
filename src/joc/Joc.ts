// Bucla principală a jocului: în fiecare cadru citește comenzile, mișcă personajul,
// verifică monedele / steagurile / poarta, mută camera și desenează.
import * as THREE from 'three';
import { creeazaScena } from '../lume/Scena';
import { Jucator } from './Jucator';
import { Catel } from './Catel';
import { CameraUrmarire } from './CameraUrmarire';
import { Nivel } from './Nivel';
import { Intrari } from '../control/Intrari';
import { pornesteAtingere } from '../control/Atingere';
import { Hud } from '../ui/Hud';
import type { DefinitieNivel } from '../nivele/tipuri';

const PAS_FIZICA = 1 / 120;   // fizica rulează în pași mici, ca să nu treacă prin platforme
const INALTIME_CADERE = -25;  // sub înălțimea asta personajul „cade” și revine la steag

type Stare = 'joaca' | 'final';

export class Joc {
  private intrari = new Intrari();
  private grafica: ReturnType<typeof creeazaScena>;
  jucator: Jucator;
  private catel: Catel;
  camera: CameraUrmarire;
  nivel: Nivel | null = null;
  private hud = new Hud();
  private ceas = new THREE.Clock();
  private timp = 0;
  private rezervaFizica = 0;
  private stare: Stare = 'joaca';
  /** Cât a durat nivelul până acum (secunde) */
  private cronometru = 0;
  private elFps = document.getElementById('fps')!;
  private cadre = 0;
  private timpFps = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.grafica = creeazaScena(canvas);
    this.jucator = new Jucator(this.grafica.scena);
    this.catel = new Catel(this.grafica.scena);
    this.camera = new CameraUrmarire(this.grafica.camera);
    pornesteAtingere(this.intrari);
    document.getElementById('buton-din-nou')!.addEventListener('click', () => this.reincepe());
  }

  incarcaNivel(def: DefinitieNivel) {
    if (this.nivel) this.grafica.scena.remove(this.nivel.grup);
    this.nivel = new Nivel(def);
    this.grafica.scena.add(this.nivel.grup);
    this.cronometru = 0;
    this.stare = 'joaca';
    this.hud.ascundeFinal();
    this.hud.seteazaMonede(0, this.nivel.totalMonede);
    this.revino();
  }

  /** Joacă același nivel de la capăt (monede și steaguri resetate) */
  reincepe() {
    if (this.nivel) this.incarcaNivel(this.nivel.def);
  }

  /** Personajul revine la ultimul steag atins (sau la start) */
  private revino() {
    if (!this.nivel) return;
    const dir = this.nivel.directieReintoarcere;
    this.jucator.teleporteaza(this.nivel.punctReintoarcere, dir);
    this.catel.teleporteaza(this.jucator.poz, dir);
    // camera stă în spatele personajului (pe partea opusă direcției în care privește)
    this.camera.unghi = dir + Math.PI;
    this.camera.sari(this.jucator.poz);
  }

  arataMesaj(text: string, secunde = 1.5) {
    this.hud.arataMesaj(text, secunde);
  }

  porneste() {
    this.ceas.start();
    this.grafica.renderer.setAnimationLoop(() => this.cadru());
  }

  private cadru() {
    // dt limitat: dacă telefonul „sughite”, nu sărim prin platforme
    const dt = Math.min(this.ceas.getDelta(), 1 / 20);
    this.timp += dt;
    const nivel = this.nivel;
    if (!nivel) return;

    this.intrari.actualizeaza();
    const rot = this.intrari.iaRotireCamera();
    this.camera.roteste(rot.x, rot.y);
    let sari = this.intrari.iaSari();

    if (this.stare === 'joaca') {
      // fizica în pași mici și egali
      this.rezervaFizica += dt;
      while (this.rezervaFizica >= PAS_FIZICA) {
        nivel.actualizeaza(PAS_FIZICA, this.timp);
        this.jucator.actualizeaza(PAS_FIZICA, this.intrari, this.camera.unghi, nivel.platforme, sari);
        sari = false;
        this.rezervaFizica -= PAS_FIZICA;
      }

      this.cronometru += dt;
      this.hud.seteazaTimp(this.cronometru);

      // ce a atins personajul?
      const ev = nivel.verifica(this.jucator.poz, this.timp);
      if (ev.monedeNoi) this.hud.seteazaMonede(nivel.monedeLuate, nivel.totalMonede, true);
      if (ev.steagNou) this.hud.arataMesaj('Steag atins!');
      if (ev.final) {
        this.stare = 'final';
        this.hud.arataFinal(nivel.def.nume, this.cronometru, nivel.monedeLuate, nivel.totalMonede);
      }

      // a căzut în gol?
      if (this.jucator.poz.y < INALTIME_CADERE) {
        this.hud.arataMesaj('Ai căzut! Înapoi la steag.');
        this.revino();
      }
    }

    nivel.anima(this.timp);
    this.jucator.deseneaza(dt, nivel.platforme);
    this.catel.actualizeaza(dt, this.jucator.poz, this.jucator.directie, this.timp);
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
