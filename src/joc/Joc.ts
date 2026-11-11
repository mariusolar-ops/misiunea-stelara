// Bucla principală a jocului: în fiecare cadru citește comenzile, mișcă personajul,
// verifică monedele / steagurile / lava / poarta, mută camera și desenează.
import * as THREE from 'three';
import { creeazaScena } from '../lume/Scena';
import { Jucator } from './Jucator';
import { Animal, areToateAnimalele, type TipAnimal } from './Animal';
import { CameraUrmarire } from './CameraUrmarire';
import { Nivel } from './Nivel';
import { incarca, inregistreazaFinal, salveaza, type Progres } from './Salvare';
import { puteriDin } from './Puteri';
import { esteEveniment, textEveniment } from './Eveniment';
import { ENERGIE_ZBOR } from './Jucator';
import { cautaAccesoriu, construiesteColorat, SLOTURI } from './Accesorii';
import { Personalizare } from '../ui/Personalizare';
import { Clasament } from '../ui/Clasament';
import { sunete, seteazaSunet } from '../audio/Sunete';
import { Editor } from '../editor/Editor';
import { EcranDeveloper } from '../ui/Developer';
import { arataNiveleMele, salveazaNivelMeu } from '../editor/EcranNiveleMele';
import type { NivelPropriu } from '../editor/NiveleMele';
import type { DefinitieNivel } from '../nivele/tipuri';
import { calculeazaStele } from './Salvare';
import { pornesteMuzica } from '../audio/Muzica';
import { Particule } from '../lume/Particule';
import { emiteUrma, efectAterizare, confettiFinal } from './Efecte';
import { centruPoarta } from '../lume/Poarta';
import { EcranSetari, aplicaSetari, sensibilitateCamera } from '../ui/Setari';
import { EcranTitluri, anuntaTitluri, anuntaRecompensaSuprema } from '../ui/Titluri';
import { titluriNoi } from './Titluri';
import { verificaZiua } from './Zilnic';
import { arataPremiuZilnic } from '../ui/Zilnic';
import { Intrari } from '../control/Intrari';
import { pornesteAtingere } from '../control/Atingere';
import { Hud } from '../ui/Hud';
import { Meniu } from '../ui/Meniu';
import { NIVELE, NR_NIVELE_NORMALE, SECRETE, ORDINE_NORMALA, numarAfisat, urmatorulNormal, grupaSecret, secretDeschis, esteNivelSecret } from '../nivele';
import { t } from '../i18n';

const PAS_FIZICA = 1 / 120;   // fizica rulează în pași mici, ca să nu treacă prin platforme
const INALTIME_CADERE = -25;  // sub înălțimea asta personajul „cade” și revine la steag

/** În ce „moment” e jocul: în meniu, jucând, pe pauză sau la ecranul de final */
type Stare = 'meniu' | 'joaca' | 'pauza' | 'final' | 'personalizare' | 'editor';

export class Joc {
  private intrari = new Intrari();
  private grafica: ReturnType<typeof creeazaScena>;
  jucator: Jucator;
  private animal: Animal;
  /** Animalul în care te-ai transformat (dacă te-ai transformat) */
  private avatar: Animal | null = null;
  private particule: Particule;
  /** Timp acumulat pentru urma din spatele personajului */
  private timpUrma = 0;
  /** Pentru sunetele de pași */
  private timpPas = 0;
  private timpPortal = 0;
  /** Când s-a terminat nivelul (pentru dansul de victorie și artificii) */
  private timpFinal = 0;
  private ultimulArtificiu = 0;
  /** Câte portale greșite a ales în tura asta (la nivelul cu portale) */
  private greseliPortale = 0;
  private ultimTeleport = -9;
  /** Constructorul de niveluri: nivelul la care lucrezi și definiția lui jucabilă (index -1) */
  private editor: Editor | null = null;
  private nivelPropriu: NivelPropriu | null = null;
  private defPropriu: DefinitieNivel | null = null;
  private pasStang = true;
  private timerFinal = 0;
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
    this.animal.laSaritura = () => { if (this.stare === 'joaca') sunete.minge(); };
    this.particule = new Particule(this.grafica.scena);
    this.camera = new CameraUrmarire(this.grafica.camera);
    pornesteAtingere(this.intrari);

    this.meniu = new Meniu(NIVELE, {
      joacaNivel: (i) => this.joacaNivel(i),
      continua: () => this.continua(),
      reincepe: () => this.joacaNivel(this.indexNivel),
      construieste: () => this.arataNiveleMele(),
      developer: () => new EcranDeveloper(this.progres, () => { this.aplicaAspect(); this.verificaTitluri(); }, () => this.arataMeniu()).arata(),
      esteNivelPropriu: () => this.indexNivel === -1 && !!this.nivelPropriu,
      inapoiLaConstructor: () => { if (this.nivelPropriu) this.deschideEditor(this.nivelPropriu); },
      personalizeaza: () => this.personalizeaza(),
      comutaSunet: () => this.comutaSunet(),
      titluri: (inapoi) => new EcranTitluri(this.progres, inapoi).arata(),
      setari: (inapoi) => new EcranSetari(this.progres, inapoi, () => this.aplicaSetari()).arata(),
      clasament: () => new Clasament(this.progres, NIVELE, (i) => secretDeschis(this.progres, i), () => this.arataMeniu()).arata(),
    });

    // Aspectul salvat (culori, accesorii, cățel) și sunetul
    this.aplicaAspect();
    seteazaSunet(this.progres.sunet);
    this.aplicaSetari();
    pornesteMuzica();
    this.elSunet.textContent = this.progres.sunet ? '🔊' : '🔇';
    this.elSunet.addEventListener('click', () => this.comutaSunet());
    // butonul de zoom: aproape → normal → departe
    document.getElementById('buton-zoom')!.addEventListener('click', () => {
      const z = this.camera.zoomJucator;
      this.camera.zoomJucator = z < 0.8 ? 1 : z < 1.3 ? 1.6 : 0.6;
      sunete.click();
    });

    // Butoanele din joc și de pe ecranul de final
    document.getElementById('buton-pauza')!.addEventListener('click', () => this.pauza());
    document.getElementById('buton-din-nou')!.addEventListener('click', () => this.joacaNivel(this.indexNivel));
    document.getElementById('buton-urmator')!.addEventListener('click', () => this.joacaNivel(this.urmatorul));
    document.getElementById('buton-meniu-final')!.addEventListener('click', () => {
      // după un nivel construit de tine, „Meniu” te duce înapoi în constructor
      if (this.indexNivel === -1 && this.nivelPropriu) this.deschideEditor(this.nivelPropriu);
      else this.arataMeniu();
    });
    // Dacă ieși din aplicație în timpul jocului, punem pauză singuri
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.pauza(); });

    // În spatele meniului se vede primul nivel
    this.incarcaNivel(0);
    this.arataMeniu();
  }

  arataMeniu() {
    this.inchideEditor();
    if (this.indexNivel === -1) this.incarcaNivel(0); // în spatele meniului: un nivel adevărat
    this.stare = 'meniu';
    this.hud.ascundeFinal();
    this.elInterfata.classList.add('ascuns');
    this.meniu.arataPrincipal(this.progres);
  }

  /** Redesenează meniul principal (ex. când apare butonul de instalare) */
  reimprospateazaMeniu() {
    if (this.stare === 'meniu') this.meniu.arataPrincipal(this.progres);
  }

  /** „Nivelurile mele” (constructorul de niveluri) */
  arataNiveleMele() {
    this.inchideEditor();
    this.stare = 'meniu';
    this.hud.ascundeFinal();
    this.elInterfata.classList.add('ascuns');
    arataNiveleMele({
      editeaza: (n) => this.deschideEditor(n),
      joaca: (def, n) => { this.nivelPropriu = n; this.defPropriu = def; this.joacaNivel(-1); },
      inapoi: () => this.arataMeniu(),
    });
  }

  private deschideEditor(n: NivelPropriu) {
    this.inchideEditor();
    this.nivelPropriu = n;
    this.meniu.ascunde();
    this.hud.ascundeFinal();
    this.elInterfata.classList.add('ascuns');
    this.stare = 'editor';
    this.editor = new Editor(n, {
      scena: this.grafica.scena,
      camera: this.grafica.camera,
      arataPreviz: (def) => { this.defPropriu = def; this.incarcaNivel(-1); },
      testeaza: (def) => { this.inchideEditor(); this.defPropriu = def; this.joacaNivel(-1); },
      salveaza: (x) => salveazaNivelMeu(x),
      iesire: () => this.arataNiveleMele(),
    });
  }

  /** Developer invincibil: lava, laserele și cristalele nu te mai trimit înapoi */
  private devInvincibil() {
    return this.progres.dev.activ && this.progres.dev.invincibil;
  }

  private inchideEditor() {
    this.editor?.inchide();
    this.editor = null;
  }

  joacaNivel(index: number) {
    if (index === -1 ? !this.defPropriu : index < 0 || index >= NIVELE.length) return;
    this.incarcaNivel(index);
    this.meniu.ascunde();
    this.hud.ascundeFinal();
    this.elInterfata.classList.remove('ascuns');
    this.stare = 'joaca';
    this.eraEveniment = esteEveniment();
    this.hud.seteazaEveniment(this.eraEveniment);
    this.hud.arataMesaj(this.eraEveniment ? '🔥 ' + t('Eveniment: monede x2!') : (index === -1 ? '🛠️ ' + this.defPropriu!.nume : t('Nivelul {n}: {nume}', { n: numarAfisat(index), nume: t(NIVELE[index].nume) })), 2.5);
  }

  /** Anunță titlurile nou câștigate (dacă sunt) */
  verificaTitluri() {
    const noi = titluriNoi(this.progres);
    if (!noi.length) return;
    salveaza(this.progres);
    // la recompensa supremă arătăm doar fereastra mare (titlurile sunt oricum în lista 🏅)
    if (noi.some((x) => x.id === 'bogat')) anuntaRecompensaSuprema();
    else anuntaTitluri(noi);
  }

  /** La pornire: premiul zilei din seria zilnică (o dată pe zi) */
  verificaZiua() {
    const premiu = verificaZiua(this.progres);
    if (!premiu) return;
    arataPremiuZilnic(premiu, () => { this.verificaTitluri(); this.reimprospateazaMeniu(); });
  }

  /** Volum, muzică, controale, viteza camerei */
  private aplicaSetari() {
    aplicaSetari(this.progres.setari);
    this.camera.sensibilitate = sensibilitateCamera(this.progres.setari);
  }

  /** Pune pe personaj culorile și accesoriile salvate */
  private aplicaAspect() {
    const p = this.progres;
    this.jucator.personaj.construieste(p.culori, p.aspect);
    this.animal.schimba(p.animal, p.culoareAnimal);
    this.animal.teleporteaza(this.jucator.poz, this.jucator.directie);
    this.jucator.puteri = puteriDin(p.puteriActive);
    // transformarea în animal
    if (this.avatar) { this.grafica.scena.remove(this.avatar.obiect); this.avatar = null; }
    const tr = p.transformare && areToateAnimalele(p.cumparate) ? p.transformare as TipAnimal : null;
    if (tr) {
      this.avatar = new Animal(this.grafica.scena, tr);
      this.avatar.avatar = true;
      this.avatar.obiect.scale.setScalar(1.8);
    }
    this.jucator.personaj.obiect.visible = !tr;
    document.getElementById('buton-teleport')!.classList.toggle('ascuns', !this.jucator.puteri.teleport);
    if (p.dev.activ && p.dev.zborInfinit) this.jucator.puteri.zbor = true;
    for (const slot of SLOTURI) {
      const a = cautaAccesoriu(p.echipate[slot]);
      this.jucator.personaj.puneAccesoriu(slot, a ? construiesteColorat(a, p.culoriAccesorii[a.id]) : null);
    }
  }

  private personalizeaza() {
    this.stare = 'personalizare';
    // personajul stă la start, întors spre noi
    this.revino();
    new Personalizare(this.progres, () => { this.aplicaAspect(); this.verificaTitluri(); }, () => {
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
    this.aplicaSetari();
    pornesteMuzica();
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
    const def = index === -1 ? this.defPropriu! : NIVELE[index];
    this.nivel = new Nivel(def, this.progres.secrete.includes(index), grupaSecret(index)?.culoare);
    this.grafica.scena.add(this.nivel.grup);
    this.jucator.gravitatie = def.gravitatie ?? 1;
    this.greseliPortale = 0;
    // camera de început a nivelului (ex. mai de sus la labirint)
    this.camera.inaltime = def.camera?.inaltime ?? 0.38;
    this.camera.distanta = def.camera?.distanta ?? 8;
    (this.grafica.scena.background as THREE.Color).set(this.nivel.decor.fundal);
    this.cronometru = 0;
    this.hud.seteazaTimp(0);
    this.hud.seteazaMonede(0, this.nivel.tintaMonede);
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
    this.nivel.reseteazaObstacole(this.jucator.poz, dir);
  }

  /** Mihai a găsit steaua secretă din nivelul ăsta */
  private gasesteSecret() {
    const p = this.progres;
    if (!p.secrete.includes(this.indexNivel)) p.secrete.push(this.indexNivel);
    sunete.secret();
    const g = grupaSecret(this.indexNivel)!;
    const gasite = g.nivele.filter((n) => p.secrete.includes(n)).length;
    if (gasite === g.nivele.length) {
      // surpriza: nivelul secret (și, la stelele mov, accesoriul secret)
      if (g.index === SECRETE[0].index && !p.cumparate.includes('aripi')) p.cumparate.push('aripi');
      this.hud.arataMesaj(t('Toate stelele! Ai deblocat un nivel secret!') + ' ' + g.emoji, 4);
    } else {
      this.hud.arataMesaj(t(g.numeStea + ' găsită!') + ` (${gasite}/${g.nivele.length})`, 2.5);
    }
    salveaza(p); // o salvăm imediat, chiar dacă nu termini nivelul
  }

  private terminaNivel() {
    const nivel = this.nivel!;
    this.stare = 'final';
    if (this.indexNivel === -1) { this.terminaNivelPropriu(); return; }
    const dublu = this.eraEveniment || esteEveniment();
    let portalePerfect = false;
    if (nivel.def.nivelPortale && this.greseliPortale === 0 && !this.progres.realizari.includes('portale-perfect')) {
      this.progres.realizari.push('portale-perfect');
      portalePerfect = true;
    }
    const { stele, record, castig } = inregistreazaFinal(
      this.progres, this.indexNivel, this.cronometru, nivel.monedeLuate, nivel.tintaMonede,
      ORDINE_NORMALA.indexOf(this.indexNivel), NR_NIVELE_NORMALE, dublu ? 2 : 1);
    // ce urmează: nivelul normal următor; după ultimul, nivelurile secrete deschise (pe rând)
    const urm = urmatorulNormal(this.indexNivel);
    const ultimulNormal = this.indexNivel === ORDINE_NORMALA[ORDINE_NORMALA.length - 1];
    const secreteDeschise = SECRETE.filter((x) => secretDeschis(this.progres, x.index)).map((x) => x.index);
    const dupaSecret = secreteDeschise.find((x) => x > this.indexNivel && esteNivelSecret(this.indexNivel));
    this.urmatorul = urm ?? (ultimulNormal ? secreteDeschise[0] ?? -1 : dupaSecret ?? -1);
    const stelePeGrupe = SECRETE.map((x) => `${x.emoji} ${x.nivele.filter((n) => this.progres.secrete.includes(n)).length}/${x.nivele.length}`).join('  ');
    // întâi sărbătorim: confetti + „Nivel terminat!”, apoi (după o clipă) apare ecranul de final
    confettiFinal(this.particule, this.jucator.poz);
    this.hud.arataMesaj(portalePerfect ? '🔐 ' + t('Fără nicio greșeală! Ai deblocat un nivel secret!') : '🎉 ' + t('Nivel terminat!') + ' 🎉', portalePerfect ? 3 : 1.4);
    const final = {
      nume: nivel.def.nume, timp: this.cronometru, monede: nivel.monedeLuate, total: nivel.tintaMonede,
      stele, record, castig, dublu, numeJucator: this.progres.nume,
      ultimul: this.urmatorul < 0,
      textUrmator: esteNivelSecret(this.urmatorul) ? `${t('Nivelul secret')} ${numarAfisat(this.urmatorul)}` : t('Nivelul următor'),
      nota: ultimulNormal && secreteDeschise.length < SECRETE.length
        ? `${t('Ai terminat toate nivelurile! Dar ai găsit toate stelele secrete?')} ${stelePeGrupe}`
        : esteNivelSecret(this.indexNivel) ? `${t('Ai terminat un nivel secret! Ești un adevărat explorator!')} ${numarAfisat(this.indexNivel)}` : undefined,
    };
    clearTimeout(this.timerFinal);
    this.timpFinal = this.timp;
    this.ultimulArtificiu = this.timp;
    this.timerFinal = window.setTimeout(() => {
      if (this.stare === 'final') this.hud.arataFinal(final);
      this.verificaTitluri();
    }, 2300);
  }

  /** Final pentru un nivel construit de tine: sărbătoare, dar monedele nu intră în portofel */
  private terminaNivelPropriu() {
    const nivel = this.nivel!;
    confettiFinal(this.particule, this.jucator.poz);
    this.hud.arataMesaj('🎉 ' + t('Nivel terminat!') + ' 🎉', 1.4);
    this.timpFinal = this.timp;
    this.ultimulArtificiu = this.timp;
    clearTimeout(this.timerFinal);
    this.timerFinal = window.setTimeout(() => {
      if (this.stare !== 'final') return;
      this.hud.arataFinal({
        nume: nivel.def.nume, timp: this.cronometru, monede: nivel.monedeLuate, total: nivel.tintaMonede,
        stele: calculeazaStele(nivel.monedeLuate, nivel.tintaMonede), record: false, numeJucator: this.progres.nume,
        ultimul: true, nota: '🛠️ ' + t('Nivelul tău e gata! (monedele din nivelurile tale nu intră în portofel)'),
      });
    }, 2300);
  }

  /** Animația de victorie: personajul dansează, camera se învârte în jurul lui, artificii pe cer */
  private sarbatoare(dt: number) {
    const t = this.timp - this.timpFinal;
    this.jucator.personaj.sarbatoreste(this.timp);
    this.camera.unghi += dt * (t < 2.3 ? 1.4 : 0.3);
    this.camera.distanta += (5 - this.camera.distanta) * Math.min(1, dt * 2);
    this.camera.inaltime += (0.22 - this.camera.inaltime) * Math.min(1, dt * 2);
    if (t < 2.6 && this.timp - this.ultimulArtificiu > 0.32) {
      this.ultimulArtificiu = this.timp;
      const u = Math.random() * Math.PI * 2;
      const poz = this.jucator.poz.clone().add(new THREE.Vector3(Math.cos(u) * 4, 5 + Math.random() * 3, Math.sin(u) * 4));
      const culori = [[0xff5f5f, 0xffd23f], [0x2ee6d6, 0xffffff], [0x8a6cff, 0xff5fa8], [0x4ccf6a, 0xffd23f]][Math.floor(Math.random() * 4)];
      this.particule.explozie(poz, 26, culori, 5, 0.15, 3, 1.2);
      sunete.artificiu();
    }
  }

  /** Urma din spatele personajului, efectul la aterizare și particulele */
  private efecteVizuale(dt: number) {
    const ef = this.progres.efecte;
    const j = this.jucator;
    if (ef.urma && (this.stare === 'joaca' || this.stare === 'personalizare' || this.stare === 'meniu')) {
      // în joc: urmă deasă când te miști; în meniu: câte puțin, ca să se vadă cum arată
      const seMisca = Math.hypot(j.viteza.x, j.viteza.z) > 1 || !j.peSol;
      const pauza = this.stare === 'joaca' ? (seMisca ? 0.03 : 0.25) : 0.12;
      this.timpUrma += dt;
      while (this.timpUrma > pauza) { emiteUrma(ef.urma, this.particule, j.poz, this.timp); this.timpUrma -= pauza; }
    }
    // sunete de pași (din cufere): mai des când alergi mai repede
    const vit = Math.hypot(j.viteza.x, j.viteza.z);
    if (ef.pasi && this.stare === 'joaca' && j.peSol && vit > 1.5) {
      this.timpPas += dt * Math.min(1.3, vit / 7.5);
      if (this.timpPas > 0.3) { this.timpPas = 0; sunete.pas(ef.pasi.slice(2), this.pasStang); this.pasStang = !this.pasStang; }
    } else this.timpPas = 0.25; // primul pas se aude imediat
    if (j.aterizare > 0) {
      if (ef.aterizare && this.stare === 'joaca') { efectAterizare(ef.aterizare, this.particule, j.poz, j.aterizare); sunete.aterizare(); }
      j.aterizare = 0;
    }
    // scântei care urcă din portalul de la final
    if (this.nivel && (this.stare === 'joaca' || this.stare === 'meniu')) {
      this.timpPortal += dt;
      if (this.timpPortal > 0.09) {
        this.timpPortal = 0;
        const c = centruPoarta(this.nivel.poarta);
        // un punct la întâmplare în rama portalului (ținem cont și de cum e întoarsă poarta)
        const local = new THREE.Vector3((Math.random() - 0.5) * 3.2, (Math.random() - 0.5) * 3.4, (Math.random() - 0.5) * 0.4);
        c.add(local.applyAxisAngle(THREE.Object3D.DEFAULT_UP, this.nivel.poarta.obiect.rotation.y));
        this.particule.emite(c, new THREE.Vector3(0, 1.5, 0), Math.random() < 0.5 ? 0x9ffcf3 : 0xffd23f, 1, 0.12);
      }
    }
    this.particule.actualizeaza(dt);
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

    // zoom cu două degete (sau rotița mouse-ului)
    if (this.intrari.zoom !== 1) {
      this.camera.zoomJucator = THREE.MathUtils.clamp(this.camera.zoomJucator / this.intrari.zoom, 0.45, 2.2);
      this.intrari.zoom = 1;
    }
    // puterea „Teleportare”
    if (this.intrari.teleportApasat) {
      this.intrari.teleportApasat = false;
      if (this.stare === 'joaca' && this.jucator.puteri.teleport && this.timp - this.ultimTeleport > 1) {
        const de = this.jucator.poz.clone();
        if (this.jucator.teleportInainte(nivel.platforme)) {
          this.ultimTeleport = this.timp;
          this.particule.explozie(de.setY(de.y + 1), 14, [0x8a6cff, 0x2ee6d6], 3, 0.14, 0, 0.6);
          this.particule.explozie(this.jucator.poz.clone().setY(this.jucator.poz.y + 1), 14, [0xffffff, 0x2ee6d6], 3, 0.14, 0, 0.6);
          sunete.teleport();
        }
      }
    }

    if (this.stare === 'joaca') {
      // fizica în pași mici și egali
      this.rezervaFizica += dt;
      let peLava = false;
      let atinsDe: 'laser' | 'cristal' | 'prins' | null = null;
      let portal: 'portal-bun' | 'portal-gresit' | null = null;
      while (this.rezervaFizica >= PAS_FIZICA) {
        nivel.actualizeaza(PAS_FIZICA, this.timp);
        const efect = this.jucator.actualizeaza(PAS_FIZICA, this.intrari, this.camera.unghi, nivel.platforme, sari, this.timp);
        if (efect === 'lava') peLava = true;
        // obstacolele (lasere, pendule, curenți, cristale)
        const ob = nivel.actualizeazaObstacole(this.jucator, this.timp, PAS_FIZICA);
        if ((ob === 'laser' || ob === 'cristal' || ob === 'prins') && !this.devInvincibil()) atinsDe = ob;
        else if (ob === 'portal-bun' || ob === 'portal-gresit') portal = ob;
        else if (ob === 'lovitura') sunete.lovitura();
        else if (ob === 'vant') sunete.vant();
        if (efect === 'trambulina') sunete.trambulina();
        if (this.jucator.aSarit) { sunete.sarituraVarianta(this.progres.efecte.saritura?.slice(2) ?? 'clasic'); this.jucator.aSarit = false; }
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
          this.hud.arataMesaj('🔥 ' + t('A început evenimentul: monede x2!'), 2.5);
        }
      }

      // ce a atins personajul?
      const ev = nivel.verifica(this.jucator.poz, this.timp);
      // scântei aurii unde era moneda, artificii la steag
      for (const pm of ev.pozMonede) this.particule.explozie(pm, 8, [0xffd23f, 0xffffff], 2.5, 0.1, 6, 0.5);
      if (ev.pozSteag) {
        this.particule.explozie(ev.pozSteag.clone().setY(ev.pozSteag.y + 2.9), 30, [0x2ee6d6, 0xffd23f, 0xffffff, 0x8a6cff], 5, 0.16, 6, 1.3);
        this.particule.inel(ev.pozSteag.clone().setY(ev.pozSteag.y + 0.05), 0x2ee6d6, 0.3, 3, 0.8, 0.9);
      }
      if (ev.monedeNoi) { this.hud.seteazaMonede(nivel.monedeLuate, nivel.tintaMonede, true); sunete.moneda(); }
      if (ev.steagNou) { this.hud.arataMesaj(t('Steag atins!')); sunete.steag(); }
      if (ev.secretNou) this.gasesteSecret();
      if (ev.indiciu) this.hud.arataMesaj(t(ev.indiciu), 3);
      if (ev.final) { this.terminaNivel(); sunete.final(); }

      const laSteag = nivel.steaguri.some((s) => s.activ);
      if (this.devInvincibil()) peLava = false;
      // zbor nelimitat (developer): energia nu se termină
      if (this.progres.dev.activ && this.progres.dev.zborInfinit) this.jucator.energie = ENERGIE_ZBOR;
      if (peLava) {
        this.hud.arataMesaj(t(laSteag ? 'Au, lavă fierbinte! Înapoi la steag.' : 'Au, lavă fierbinte! Înapoi la start.'));
        sunete.lava();
        this.revino();
      } else if (atinsDe === 'laser') {
        this.hud.arataMesaj(t(laSteag ? 'Zap! Laserul te-a trimis înapoi la steag.' : 'Zap! Laserul te-a trimis înapoi la start.'));
        sunete.laser();
        this.revino();
      } else if (portal) {
        // teleportat: camera și animalul vin după personaj
        this.camera.sari(this.jucator.poz);
        this.animal.teleporteaza(this.jucator.poz, this.jucator.directie);
        this.particule.explozie(this.jucator.poz.clone().setY(this.jucator.poz.y + 1), 20, [0x8a6cff, 0x2ee6d6, 0xffffff], 4, 0.14, 6, 0.8);
        if (portal === 'portal-bun') { this.hud.arataMesaj(t('Portalul corect! Mergi mai departe!')); sunete.secret(); }
        else { this.greseliPortale++; this.hud.arataMesaj(t('Portal greșit! Mai încearcă.')); sunete.cadere(); }
      } else if (atinsDe === 'prins') {
        this.hud.arataMesaj(t(laSteag ? 'Te-a prins extraterestrul! Înapoi la steag.' : 'Te-a prins extraterestrul! Înapoi la start.'));
        sunete.cadere();
        this.revino();
      } else if (atinsDe === 'cristal') {
        this.hud.arataMesaj(t(laSteag ? 'Au, cristale ascuțite! Înapoi la steag.' : 'Au, cristale ascuțite! Înapoi la start.'));
        sunete.lava();
        this.revino();
      } else if (this.jucator.poz.y < INALTIME_CADERE) {
        this.hud.arataMesaj(t(laSteag ? 'Ai căzut! Înapoi la steag.' : 'Ai căzut! Înapoi la start.'));
        sunete.cadere();
        this.revino();
      }
    } else if (this.stare === 'meniu' || this.stare === 'editor') {
      // platformele și obstacolele se mișcă și în spatele meniului (și în constructor)
      nivel.actualizeaza(dt, this.timp);
      nivel.actualizeazaObstacole({ poz: new THREE.Vector3(0, -999, 0), viteza: new THREE.Vector3() }, this.timp, dt);
    }

    nivel.anima(this.timp);
    this.efecteVizuale(dt);
    this.jucator.deseneaza(dt, nivel.platforme);
    if (this.stare === 'final') this.sarbatoare(dt);
    this.animal.actualizeaza(dt, this.jucator.poz, this.jucator.directie, this.timp);
    this.avatar?.actualizeaza(dt, this.jucator.poz, this.jucator.directie, this.timp);
    if (this.stare === 'editor') this.editor?.cadru(rot);
    else this.camera.actualizeaza(this.jucator.poz, dt);
    this.grafica.renderer.render(this.grafica.scena, this.grafica.camera);

    // contor de cadre pe secundă (ca să vedem dacă merge fluid)
    this.cadre++;
    this.timpFps += dt;
    if (this.timpFps >= 1) {
      if (this.aratFps || (this.progres.dev.activ && this.progres.dev.fps)) this.elFps.textContent = `${Math.round(this.cadre / this.timpFps)} FPS`;
      this.cadre = 0;
      this.timpFps = 0;
    }
  }
}
