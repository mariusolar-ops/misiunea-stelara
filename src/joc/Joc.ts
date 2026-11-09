// Bucla principală a jocului: în fiecare cadru citește comenzile, mișcă personajul,
// verifică monedele / steagurile / lava / poarta, mută camera și desenează.
import * as THREE from 'three';
import { creeazaScena } from '../lume/Scena';
import { Jucator } from './Jucator';
import { Animal } from './Animal';
import { CameraUrmarire } from './CameraUrmarire';
import { Nivel } from './Nivel';
import { incarca, inregistreazaFinal, salveaza, areToateSecretele, NR_STELE_SECRETE, type Progres } from './Salvare';
import { puteriDin } from './Puteri';
import { esteEveniment, textEveniment } from './Eveniment';
import { ENERGIE_ZBOR } from './Jucator';
import { cautaAccesoriu, type Slot } from './Accesorii';
import { Personalizare } from '../ui/Personalizare';
import { Clasament } from '../ui/Clasament';
import { sunete, seteazaSunet } from '../audio/Sunete';
import { Intrari } from '../control/Intrari';
import { pornesteAtingere } from '../control/Atingere';
import { Hud } from '../ui/Hud';
import { Meniu } from '../ui/Meniu';
import { NIVELE, NR_NIVELE_NORMALE, INDEX_SECRET, ORDINE_NORMALA, numarAfisat, urmatorulNormal } from '../nivele';

const PAS_FIZICA = 1 / 120;   // fizica rulează în pași mici, ca să nu treacă prin platforme
const INALTIME_CADERE = -25;  // sub înălțimea asta personajul „cade” și revine la steag

/** În ce „moment” e jocul: în meniu, jucând, pe pauză sau la ecranul de final */
type Stare = 'meniu' | 'joaca' | 'pauza' | 'final' | 'personalizare';

export class Joc {
  private intrari = new Intrari();
  private grafica: ReturnType<typeof creeazaScena>;
  jucator: Jucator;
  private animal: Animal;
  /** Era eveniment x2 când a început nivelul? (dacă da, primește dublu chiar dacă se termină între timp) */
  private eraEveniment = false;
  private ultimaVerificareEveniment = 0;
  camera: CameraUrmarire;
  nivel: Nivel | null = null;
  private indexNivel = 0;
  /** Ce nivel pornește butonul „Nivelul următor” */
  private urmatorul = 1;
  private hud = new Hud();
  private meniu: Meniu;
  progres: Progres = incarca();
  private ceas = new THREE.Clock();
  private timp = 0;
  private rezervaFizica = 0;
  private stare: Stare = 'meniu';
  private cronometru = 0;
  private elInterfata = document.getElementById('interfata')!;
  private elSunet = document.getElementById('buton-sunet')!;
  private elFps = document.getElementById('fps')!;
  /** Contorul de FPS apare doar dacă adresa conține ?fps (pentru teste) */
  private aratFps = new URLSearchParams(location.search).has('fps');
  private cadre = 0;
  private timpFps = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.grafica = creeazaScena(canvas);
    this.jucator = new Jucator(this.grafica.scena);
    this.animal = new Animal(this.grafica.scena);
    this.camera = new CameraUrmarire(this.grafica.camera);
    pornesteAtingere(this.intrari);

    this.meniu = new Meniu(NIVELE, {
      joacaNivel: (i) => this.joacaNivel(i),
      continua: () => this.continua(),
      reincepe: () => this.joacaNivel(this.indexNivel),
      personalizeaza: () => this.personalizeaza(),
      comutaSunet: () => this.comutaSunet(),
      clasament: () => new Clasament(this.progres, NIVELE, () => areToateSecretele(this.progres), () => this.arataMeniu()).arata(),
    });

    // Aspectul salvat (culori, accesorii, cățel) și sunetul
    this.aplicaAspect();
    seteazaSunet(this.progres.sunet);
    this.elSunet.textContent = this.progres.sunet ? '🔊' : '🔇';
    this.elSunet.addEventListener('click', () => this.comutaSunet());

    // Butoanele din joc și de pe ecranul de final
    document.getElementById('buton-pauza')!.addEventListener('click', () => this.pauza());
    document.getElementById('buton-din-nou')!.addEventListener('click', () => this.joacaNivel(this.indexNivel));
    document.getElementById('buton-urmator')!.addEventListener('click', () => this.joacaNivel(this.urmatorul));
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

  /** Redesenează meniul principal (ex. când apare butonul de instalare) */
  reimprospateazaMeniu() {
    if (this.stare === 'meniu') this.meniu.arataPrincipal(this.progres);
  }

  joacaNivel(index: number) {
    if (index < 0 || index >= NIVELE.length) return;
    this.incarcaNivel(index);
    this.meniu.ascunde();
    this.hud.ascundeFinal();
    this.elInterfata.classList.remove('ascuns');
    this.stare = 'joaca';
    this.eraEveniment = esteEveniment();
    this.hud.seteazaEveniment(this.eraEveniment);
    this.hud.arataMesaj(this.eraEveniment ? '🔥 Eveniment: monede x2!' : `Nivelul ${numarAfisat(index)}: ${NIVELE[index].nume}`, 2.5);
  }

  /** Pune pe personaj culorile și accesoriile salvate */
  private aplicaAspect() {
    const p = this.progres;
    this.jucator.personaj.construieste(p.culori, p.aspect);
    this.animal.schimba(p.animal, p.culoareAnimal);
    this.animal.teleporteaza(this.jucator.poz, this.jucator.directie);
    this.jucator.puteri = puteriDin(p.puteriActive);
    for (const slot of ['cap', 'fata', 'spate'] as Slot[]) {
      const a = cautaAccesoriu(p.echipate[slot]);
      this.jucator.personaj.puneAccesoriu(slot, a ? a.construieste() : null);
    }
  }

  private personalizeaza() {
    this.stare = 'personalizare';
    // personajul stă la start, întors spre noi
    this.revino();
    new Personalizare(this.progres, () => this.aplicaAspect(), () => {
      this.camera.distanta = 8;
      this.camera.inaltime = 0.38;
      this.camera.camera.clearViewOffset();
      this.revino();
      this.arataMeniu();
    }).arata();
    this.camera.unghi = this.jucator.directie; // camera în fața personajului
    this.camera.distanta = 4.2;
    this.camera.inaltime = 0.12;
  }

  /** Pornește / oprește sunetul (și ține minte alegerea) */
  private comutaSunet() {
    this.progres.sunet = !this.progres.sunet;
    seteazaSunet(this.progres.sunet);
    salveaza(this.progres);
    this.elSunet.textContent = this.progres.sunet ? '🔊' : '🔇';
    return this.progres.sunet;
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
    this.nivel = new Nivel(NIVELE[index], this.progres.secrete.includes(index));
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
    this.animal.teleporteaza(this.jucator.poz, dir);
    // camera stă în spatele personajului (pe partea opusă direcției în care privește)
    this.camera.unghi = dir + Math.PI;
    this.camera.sari(this.jucator.poz);
  }

  /** Mihai a găsit steaua secretă din nivelul ăsta */
  private gasesteSecret() {
    const p = this.progres;
    if (!p.secrete.includes(this.indexNivel)) p.secrete.push(this.indexNivel);
    sunete.secret();
    if (areToateSecretele(p)) {
      // surpriza: accesoriul secret + nivelul secret
      if (!p.cumparate.includes('aripi')) p.cumparate.push('aripi');
      this.hud.arataMesaj('Toate stelele secrete! Ai deblocat o surpriză! ✨', 4);
    } else {
      this.hud.arataMesaj(`Stea secretă găsită! (${p.secrete.length}/${NR_STELE_SECRETE})`, 2.5);
    }
    salveaza(p); // o salvăm imediat, chiar dacă nu termini nivelul
  }

  private terminaNivel() {
    const nivel = this.nivel!;
    this.stare = 'final';
    const dublu = this.eraEveniment || esteEveniment();
    const { stele, record, castig } = inregistreazaFinal(
      this.progres, this.indexNivel, this.cronometru, nivel.monedeLuate, nivel.totalMonede,
      ORDINE_NORMALA.indexOf(this.indexNivel), NR_NIVELE_NORMALE, dublu ? 2 : 1);
    // ce urmează: nivelul normal următor; după ultimul, nivelul secret (dacă e deschis)
    const secretDeschis = areToateSecretele(this.progres);
    const urm = urmatorulNormal(this.indexNivel);
    const ultimulNormal = this.indexNivel === ORDINE_NORMALA[ORDINE_NORMALA.length - 1];
    this.urmatorul = urm ?? (ultimulNormal && secretDeschis ? INDEX_SECRET : -1);
    this.hud.arataFinal({
      nume: nivel.def.nume, timp: this.cronometru, monede: nivel.monedeLuate, total: nivel.totalMonede,
      stele, record, castig, dublu, numeJucator: this.progres.nume,
      ultimul: this.urmatorul < 0,
      textUrmator: this.urmatorul === INDEX_SECRET ? 'Nivelul secret ✨' : 'Nivelul următor',
      nota: ultimulNormal && !secretDeschis
        ? `Ai terminat toate nivelurile! Dar ai găsit toate stelele secrete? (${this.progres.secrete.length}/${NR_STELE_SECRETE})`
        : this.indexNivel === INDEX_SECRET ? 'Ai terminat nivelul secret! Ești un adevărat explorator! ✨' : undefined,
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

    if (this.stare === 'meniu' && this.timp - this.ultimaVerificareEveniment > 1) {
      this.ultimaVerificareEveniment = this.timp;
      const e = document.querySelector('#meniu .eveniment');
      if (e) { e.textContent = textEveniment(); e.classList.toggle('activ', esteEveniment()); }
    }
    if (this.stare === 'meniu') {
      // în meniu camera se rotește încet în jurul personajului, ca o prezentare
      this.camera.unghi += dt * 0.15;
    } else if (this.stare === 'personalizare') {
      // personajul se vede în stânga ecranului (panoul e în dreapta) și se rotește încet;
      // cu degetul îl poți întoarce cum vrei
      this.camera.unghi += dt * 0.3 - rot.x * 0.006;
      const w = window.innerWidth, h = window.innerHeight;
      this.camera.camera.setViewOffset(w, h, w * 0.25, 0, w, h);
    } else {
      this.camera.roteste(rot.x, rot.y);
    }

    if (this.stare === 'personalizare') {
      // personajul stă cuminte pe platformă (fizică fără comenzi, ca să stea pe sol)
      this.intrari.mers.x = 0; this.intrari.mers.y = 0;
      this.rezervaFizica += dt;
      while (this.rezervaFizica >= PAS_FIZICA) {
        this.jucator.actualizeaza(PAS_FIZICA, this.intrari, this.camera.unghi, nivel.platforme, false, this.timp);
        this.rezervaFizica -= PAS_FIZICA;
      }
      this.jucator.aSarit = false;
    }

    if (this.stare === 'joaca') {
      // fizica în pași mici și egali
      this.rezervaFizica += dt;
      let peLava = false;
      let atinsDe: 'laser' | 'cristal' | null = null;
      while (this.rezervaFizica >= PAS_FIZICA) {
        nivel.actualizeaza(PAS_FIZICA, this.timp);
        const efect = this.jucator.actualizeaza(PAS_FIZICA, this.intrari, this.camera.unghi, nivel.platforme, sari, this.timp);
        if (efect === 'lava') peLava = true;
        // obstacolele (lasere, pendule, curenți, cristale)
        const ob = nivel.actualizeazaObstacole(this.jucator, this.timp, PAS_FIZICA);
        if (ob === 'laser' || ob === 'cristal') atinsDe = ob;
        else if (ob === 'lovitura') sunete.lovitura();
        else if (ob === 'vant') sunete.vant();
        if (efect === 'trambulina') sunete.trambulina();
        if (this.jucator.aSarit) { sunete.saritura(); this.jucator.aSarit = false; }
        sari = false;
        this.rezervaFizica -= PAS_FIZICA;
      }

      this.cronometru += dt;
      this.hud.seteazaTimp(this.cronometru);
      this.hud.seteazaEnergie(this.jucator.puteri.zbor ? this.jucator.energie / ENERGIE_ZBOR : null);
      // evenimentul x2 poate începe în timpul nivelului
      if (this.timp - this.ultimaVerificareEveniment > 1) {
        this.ultimaVerificareEveniment = this.timp;
        if (esteEveniment() && !this.eraEveniment) {
          this.eraEveniment = true;
          this.hud.seteazaEveniment(true);
          this.hud.arataMesaj('🔥 A început evenimentul: monede x2!', 2.5);
        }
      }

      // ce a atins personajul?
      const ev = nivel.verifica(this.jucator.poz, this.timp);
      if (ev.monedeNoi) { this.hud.seteazaMonede(nivel.monedeLuate, nivel.totalMonede, true); sunete.moneda(); }
      if (ev.steagNou) { this.hud.arataMesaj('Steag atins!'); sunete.steag(); }
      if (ev.secretNou) this.gasesteSecret();
      if (ev.final) { this.terminaNivel(); sunete.final(); }

      const unde = nivel.steaguri.some((s) => s.activ) ? 'la steag' : 'la start';
      if (peLava) {
        this.hud.arataMesaj(`Au, lavă fierbinte! Înapoi ${unde}.`);
        sunete.lava();
        this.revino();
      } else if (atinsDe === 'laser') {
        this.hud.arataMesaj(`Zap! Laserul te-a trimis înapoi ${unde}.`);
        sunete.laser();
        this.revino();
      } else if (atinsDe === 'cristal') {
        this.hud.arataMesaj(`Au, cristale ascuțite! Înapoi ${unde}.`);
        sunete.lava();
        this.revino();
      } else if (this.jucator.poz.y < INALTIME_CADERE) {
        this.hud.arataMesaj(`Ai căzut! Înapoi ${unde}.`);
        sunete.cadere();
        this.revino();
      }
    } else if (this.stare === 'meniu') {
      // platformele și obstacolele se mișcă și în spatele meniului
      nivel.actualizeaza(dt, this.timp);
      nivel.actualizeazaObstacole({ poz: new THREE.Vector3(0, -999, 0), viteza: new THREE.Vector3() }, this.timp, dt);
    }

    nivel.anima(this.timp);
    this.jucator.deseneaza(dt, nivel.platforme);
    this.animal.actualizeaza(dt, this.jucator.poz, this.jucator.directie, this.timp);
    this.camera.actualizeaza(this.jucator.poz, dt);
    this.grafica.renderer.render(this.grafica.scena, this.grafica.camera);

    // contor de cadre pe secundă (ca să vedem dacă merge fluid)
    this.cadre++;
    this.timpFps += dt;
    if (this.timpFps >= 1) {
      if (this.aratFps) this.elFps.textContent = `${Math.round(this.cadre / this.timpFps)} FPS`;
      this.cadre = 0;
      this.timpFps = 0;
    }
  }
}
