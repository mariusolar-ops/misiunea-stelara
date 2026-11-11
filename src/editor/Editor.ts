// Constructorul de niveluri (ideea lui Mihai): pui blocuri pe o grilă, apeși „Testează” și joci.
// Cum se folosește:
//  - alegi o unealtă jos (bloc, trambulină, lavă, monedă, steag, portal…)
//  - ATINGI ecranul ca să pui unealta în pătrățelul acela
//  - TRAGI cu degetul ca să muți camera
//  - ▲ ▼ schimbă înălțimea la care pui blocurile (grila arată înălțimea curentă)
// Nivelurile se salvează doar pe telefon – nu se pot posta nicăieri.
import * as THREE from 'three';
import { t } from '../i18n';
import { sunete } from '../audio/Sunete';
import type { DefinitieNivel } from '../nivele/tipuri';
import {
  UNELTE, OBIECTE_MICI, TEME_EDITOR, MAX_OBIECTE, U, inDefinitie, areFinal,
  type NivelPropriu, type Unealta, type ObiectEditor,
} from './NiveleMele';

/** Ce îi cere constructorul jocului */
export interface GazdaEditor {
  scena: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Arată nivelul (ca previzualizare) în spatele constructorului */
  arataPreviz(def: DefinitieNivel): void;
  /** Pornește nivelul ca să-l joci */
  testeaza(def: DefinitieNivel): void;
  /** Salvează nivelul */
  salveaza(n: NivelPropriu): void;
  /** Ieșire (înapoi la „Nivelurile mele”) */
  iesire(): void;
}

const INALTIME_MIN = -4, INALTIME_MAX = 16;

export class Editor {
  private el: HTMLDivElement;
  private unealta: Unealta = 'bloc';
  private inaltime = 0;
  private tinta = new THREE.Vector3(0, 0, -8);
  private zoom = 1;
  private grila: THREE.GridHelper;
  private istoric: ObiectEditor[][] = [];
  private apasare: { x: number; y: number; t: number } | null = null;
  private razaCautare = new THREE.Raycaster();
  private ascultatori: [string, EventListener][] = [];

  constructor(private nivel: NivelPropriu, private gazda: GazdaEditor) {
    this.grila = new THREE.GridHelper(48, 24, 0x2ee6d6, 0x4a5a9a);
    (this.grila.material as THREE.Material).transparent = true;
    (this.grila.material as THREE.Material).opacity = 0.6;
    gazda.scena.add(this.grila);
    this.el = document.createElement('div');
    this.el.id = 'editor';
    document.body.append(this.el);
    document.body.classList.add('mod-editor');
    this.deseneazaUI();
    this.reconstruieste();

    // atingerea pe ecran (pe canvas): dacă degetul aproape nu s-a mișcat, punem unealta
    const canvas = document.getElementById('scena')!;
    const jos = (e: Event) => { const p = e as PointerEvent; this.apasare = { x: p.clientX, y: p.clientY, t: performance.now() }; };
    const sus = (e: Event) => {
      const p = e as PointerEvent;
      if (this.apasare && Math.hypot(p.clientX - this.apasare.x, p.clientY - this.apasare.y) < 12) this.atinge(p.clientX, p.clientY);
      this.apasare = null;
    };
    canvas.addEventListener('pointerdown', jos);
    canvas.addEventListener('pointerup', sus);
    this.ascultatori = [['pointerdown', jos], ['pointerup', sus]];
  }

  /** Închide constructorul (scoate grila, butoanele și ascultătorii) */
  inchide() {
    const canvas = document.getElementById('scena')!;
    for (const [n, f] of this.ascultatori) canvas.removeEventListener(n, f);
    this.gazda.scena.remove(this.grila);
    this.el.remove();
    document.body.classList.remove('mod-editor');
  }

  /** În fiecare cadru: camera privește de sus, din spate, spre ținta pe care o muți cu degetul */
  cadru(rot: { x: number; y: number }) {
    const k = 0.035 * this.zoom;
    this.tinta.x -= rot.x * k;
    this.tinta.z -= rot.y * k;
    const cam = this.gazda.camera;
    cam.position.set(this.tinta.x, this.inaltime + 15 * this.zoom, this.tinta.z + 11 * this.zoom);
    cam.lookAt(this.tinta.x, this.inaltime, this.tinta.z);
    // grila stă la înălțimea curentă și urmează camera (în pași de un pătrățel)
    this.grila.position.set(Math.round(this.tinta.x / U) * U + U / 2, this.inaltime + 0.02, Math.round(this.tinta.z / U) * U + U / 2);
  }

  private deseneazaUI() {
    const n = this.nivel;
    const temaIdx = TEME_EDITOR.indexOf(n.tema);
    this.el.innerHTML = `
      <div class="bara-sus">
        <button class="mic-buton" data-a="iesire">‹ ${t('Gata')}</button>
        <input class="nume-nivel" maxlength="20" value="${n.nume.replace(/"/g, '')}" />
        <button class="mic-buton" data-a="tema">🎨 ${temaIdx + 1}/${TEME_EDITOR.length}</button>
        <div class="inaltime">
          <button class="mic-buton" data-a="jos">▼</button>
          <span>${t('Înălțime')}: <b>${this.inaltime}</b></span>
          <button class="mic-buton" data-a="sus">▲</button>
        </div>
        <button class="mic-buton" data-a="zoom">🔍</button>
        <button class="mic-buton" data-a="anuleaza" ${this.istoric.length ? '' : 'disabled'}>↩️</button>
        <button class="mare" data-a="testeaza">▶ ${t('Testează')}</button>
      </div>
      <div class="mesaj-editor"></div>
      <div class="bara-jos">
        ${UNELTE.map((u) => `<button class="unealta ${u.id === this.unealta ? 'aleasa' : ''}" data-u="${u.id}"><span>${u.emoji}</span>${t(u.nume)}</button>`).join('')}
        <span class="numar-obiecte">${n.obiecte.length}/${MAX_OBIECTE}</span>
      </div>`;
    this.el.querySelectorAll<HTMLButtonElement>('[data-u]').forEach((b) => b.addEventListener('click', () => {
      this.unealta = b.dataset.u as Unealta; sunete.click(); this.deseneazaUI();
    }));
    this.el.querySelectorAll<HTMLButtonElement>('[data-a]').forEach((b) => b.addEventListener('click', () => this.actiune(b.dataset.a!)));
    const nume = this.el.querySelector<HTMLInputElement>('.nume-nivel')!;
    nume.addEventListener('change', () => {
      n.nume = nume.value.replace(/[<>"]/g, '').trim().slice(0, 20) || n.nume;
      this.gazda.salveaza(n);
    });
  }

  private mesaj(text: string) {
    const m = this.el.querySelector('.mesaj-editor')!;
    m.textContent = text;
    m.classList.add('vizibil');
    setTimeout(() => m.classList.remove('vizibil'), 2000);
  }

  private actiune(a: string) {
    sunete.click();
    const n = this.nivel;
    switch (a) {
      case 'iesire': this.gazda.salveaza(n); this.gazda.iesire(); return;
      case 'tema': n.tema = TEME_EDITOR[(TEME_EDITOR.indexOf(n.tema) + 1) % TEME_EDITOR.length]; this.reconstruieste(); break;
      case 'sus': this.inaltime = Math.min(INALTIME_MAX, this.inaltime + 1); break;
      case 'jos': this.inaltime = Math.max(INALTIME_MIN, this.inaltime - 1); break;
      case 'zoom': this.zoom = this.zoom > 1.6 ? 0.7 : this.zoom + 0.45; break;
      case 'anuleaza': {
        const vechi = this.istoric.pop();
        if (vechi) { n.obiecte = vechi; this.reconstruieste(); }
        break;
      }
      case 'testeaza':
        if (!areFinal(n)) { this.mesaj(t('Pune întâi portalul de final 🌀!')); return; }
        this.gazda.salveaza(n);
        this.gazda.testeaza(inDefinitie(n));
        return;
    }
    this.deseneazaUI();
  }

  /** Ai atins ecranul: găsim pătrățelul de pe grilă și punem acolo unealta aleasă */
  private atinge(x: number, y: number) {
    const ndc = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
    this.razaCautare.setFromCamera(ndc, this.gazda.camera);
    const plan = new THREE.Plane(new THREE.Vector3(0, 1, 0), -this.inaltime);
    const punct = new THREE.Vector3();
    if (!this.razaCautare.ray.intersectPlane(plan, punct)) return;
    const cx = Math.round(punct.x / U), cz = Math.round(punct.z / U), h = this.inaltime;
    const n = this.nivel;
    const mic = OBIECTE_MICI.includes(this.unealta);
    const acelasiLoc = (o: ObiectEditor) => o.x === cx && o.z === cz && o.h === h;
    // pe platforma de start (3x3 pătrățele în mijloc, la înălțimea 0) nu punem blocuri
    if (!mic && this.unealta !== 'sterge' && h <= 0 && h >= -1 && Math.abs(cx) <= 1 && Math.abs(cz) <= 1) {
      this.mesaj(t('Aici e platforma de start!'));
      return;
    }
    this.istoric.push(n.obiecte.map((o) => ({ ...o })));
    if (this.istoric.length > 40) this.istoric.shift();
    if (this.unealta === 'sterge') {
      n.obiecte = n.obiecte.filter((o) => !acelasiLoc(o));
    } else {
      if (n.obiecte.length >= MAX_OBIECTE) { this.mesaj(t('Ai pus prea multe obiecte!')); this.istoric.pop(); return; }
      // în fiecare pătrățel: un singur bloc și un singur obiect mic; portalul de final e unul singur
      n.obiecte = n.obiecte.filter((o) => !(acelasiLoc(o) && OBIECTE_MICI.includes(o.tip) === mic));
      if (this.unealta === 'final') n.obiecte = n.obiecte.filter((o) => o.tip !== 'final');
      n.obiecte.push({ x: cx, z: cz, h, tip: this.unealta });
    }
    sunete.pas('toba', true);
    this.reconstruieste();
    this.deseneazaUI();
  }

  private reconstruieste() {
    this.gazda.arataPreviz(inDefinitie(this.nivel));
    this.gazda.salveaza(this.nivel);
  }
}
