// Bucla principală a jocului: în fiecare cadru citește comenzile, mișcă personajul,
// verifică monedele / steagurile / lava / poarta, mută camera și desenează.
import * as THREE from 'three';
import { creeazaScena } from '../lume/Scena';
import { Jucator } from './Jucator';
import { Catel } from './Catel';
import { CameraUrmarire } from './CameraUrmarire';
import { Nivel } from './Nivel';
import { incarca, inregistreazaFinal, type Progres } from './Salvare';
import { Intrari } from '../control/Intrari';
import { pornesteAtingere } from '../control/Atingere';
import { Hud } from '../ui/Hud';
import { Meniu } from '../ui/Meniu';
import { NIVELE } from '../nivele';

const PAS_FIZICA = 1 / 120;   // fizica rulează în pași mici, ca să nu treacă prin platforme
const INALTIME_CADERE = -25;  // sub înălțimea asta personajul „cade” și revine la steag

/** În ce „moment” e jocul: în meniu, jucând, pe pauză sau la ecranul de final */
type Stare = 'meniu' | 'joaca' | 'pauza' | 'final';

export class Joc {
  private intrari = new Intrari();
  private grafica: ReturnType<typeof creeazaScena>;
  jucator: Jucator;
  private catel: Catel;
  camera: CameraUrmarire;
  nivel: Nivel | null = null;
  private indexNivel = 0;
  private hud = new Hud();
  private meniu: Meniu;
  progres: Progres = incarca();
  private ceas = new THREE.Clock();
  private timp = 0;
  private rezervaFizica = 0;
  private stare: Stare = 'meniu';
  private cronometru = 0;
  private elInterfata = document.getElementById('interfata')!;
  private elFps = document.getElementById('fps')!;
  private cadre = 0;
  private timpFps = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.grafica = creeazaScena(canvas);
    this.jucator = new Jucator(this.grafica.scena);
    this.catel = new Catel(this.grafica.scena);
    this.camera = new CameraUrmarire(this.grafica.camera);
    pornesteAtingere(this.intrari);

    this.meniu = new Meniu(NIVELE, {
      joacaNivel: (i) => this.joacaNivel(i),
      continua: () => this.continua(),
      reincepe: () => this.joacaNivel(this.indexNivel),
    });

    // Butoanele din joc și de pe ecranul de final
    document.getElementById('buton-pauza')!.addEventListener('click', () => this.pauza());
    document.getElementById('buton-din-nou')!.addEventListener('click', () => this.joacaNivel(this.indexNivel));
    document.getElementById('buton-urmator')!.addEventListener('click', () => this.joacaNivel(this.indexNivel + 1));
    document.getElementById('buton-meniu-final')!.addEventListener('click', () => this.arataMeniu());
    // Dacă ieși din aplicație în timpul jocului, punem pauză singuri
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.pauza(); });

    // În spatele meniului se vede primul nivel
    this.incarcaNivel(0);
    this.arataMeniu();
  }

  arataMeniu() {
    this.stare = 'meniu';
    this.hud.ascundeFinal();
    this.elInterfata.classList.add('ascuns');
    this.meniu.arataPrincipal(this.progres);
  }

  joacaNivel(index: number) {
    if (index >= NIVELE.length) return;
    this.incarcaNivel(index);
    this.meniu.ascunde();
    this.hud.ascundeFinal();
    this.elInterfata.classList.remove('ascuns');
    this.stare = 'joaca';
    this.hud.arataMesaj(`Nivelul ${index + 1}: ${NIVELE[index].nume}`, 2.5);
  }

  private pauza() {
    if (this.stare !== 'joaca') return;
    this.stare = 'pauza';
    this.meniu.arataPauza(this.progres);
  }

  private continua() {
    this.meniu.ascunde();
    this.stare = 'joaca';
    this.ceas.getDelta(); // nu numărăm timpul cât a stat pe pauză
  }

  private incarcaNivel(index: number) {
    if (this.nivel) this.grafica.scena.remove(this.nivel.grup);
    this.indexNivel = index;
    this.nivel = new Nivel(NIVELE[index]);
    this.grafica.scena.add(this.nivel.grup);
    (this.grafica.scena.background as THREE.Color).set(this.nivel.decor.fundal);
    this.cronometru = 0;
    this.hud.seteazaTimp(0);
    this.hud.seteazaMonede(0, this.nivel.totalMonede);
    this.revino();
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

  private terminaNivel() {
    const nivel = this.nivel!;
    this.stare = 'final';
    const { stele, record } = inregistreazaFinal(
      this.progres, this.indexNivel, this.cronometru, nivel.monedeLuate, nivel.totalMonede, NIVELE.length);
    this.hud.arataFinal({
      nume: nivel.def.nume, timp: this.cronometru, monede: nivel.monedeLuate, total: nivel.totalMonede,
      stele, record, ultimul: this.indexNivel === NIVELE.length - 1,
    });
  }

  porneste() {
    this.ceas.start();
    this.grafica.renderer.setAnimationLoop(() => this.cadru());
  }

  private cadru() {
    // dt limitat: dacă telefonul „sughite”, nu sărim prin platforme
    const dt = Math.min(this.ceas.getDelta(), 1 / 20);
    const nivel = this.nivel;
    if (!nivel) return;
    if (this.stare === 'pauza') return; // pe pauză nu desenăm nimic – economisim bateria

    this.timp += dt;
    this.intrari.actualizeaza();
    const rot = this.intrari.iaRotireCamera();
    let sari = this.intrari.iaSari();

    if (this.stare === 'meniu') {
      // în meniu camera se rotește încet în jurul personajului, ca o prezentare
      this.camera.unghi += dt * 0.15;
    } else {
      this.camera.roteste(rot.x, rot.y);
    }

    if (this.stare === 'joaca') {
      // fizica în pași mici și egali
      this.rezervaFizica += dt;
      let peLava = false;
      while (this.rezervaFizica >= PAS_FIZICA) {
        nivel.actualizeaza(PAS_FIZICA, this.timp);
        const efect = this.jucator.actualizeaza(PAS_FIZICA, this.intrari, this.camera.unghi, nivel.platforme, sari, this.timp);
        if (efect === 'lava') peLava = true;
        sari = false;
        this.rezervaFizica -= PAS_FIZICA;
      }

      this.cronometru += dt;
      this.hud.seteazaTimp(this.cronometru);

      // ce a atins personajul?
      const ev = nivel.verifica(this.jucator.poz, this.timp);
      if (ev.monedeNoi) this.hud.seteazaMonede(nivel.monedeLuate, nivel.totalMonede, true);
      if (ev.steagNou) this.hud.arataMesaj('Steag atins!');
      if (ev.final) this.terminaNivel();

      const unde = nivel.steaguri.some((s) => s.activ) ? 'la steag' : 'la start';
      if (peLava) {
        this.hud.arataMesaj(`Au, lavă fierbinte! Înapoi ${unde}.`);
        this.revino();
      } else if (this.jucator.poz.y < INALTIME_CADERE) {
        this.hud.arataMesaj(`Ai căzut! Înapoi ${unde}.`);
        this.revino();
      }
    } else if (this.stare === 'meniu') {
      // platformele se mișcă și în spatele meniului
      nivel.actualizeaza(dt, this.timp);
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
