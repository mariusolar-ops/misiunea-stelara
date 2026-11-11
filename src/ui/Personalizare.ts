// Ecranul „Personalizează”: culori, stil (băiat/fată, coafură, haine), animal de companie,
// magazinul de accesorii și super-puterile.
// Panoul stă în dreapta, iar personajul se vede în stânga, întors spre tine.
import type { Progres } from '../joc/Salvare';
import { salveaza } from '../joc/Salvare';
import type { CuloriPersonaj, AspectPersonaj } from '../joc/Personaj';
import { CATALOG } from '../joc/Accesorii';
import { ANIMALE } from '../joc/Animal';
import { PUTERI } from '../joc/Puteri';
import { sunete } from '../audio/Sunete';
import { EFECTE, PRET_CUFAR, NUME_CATEGORII, deschideCufar, type CategorieEfect } from '../joc/Efecte';
import { arataCufar } from './AnimatieCufar';
import { areTotul, catMaiLipseste } from '../joc/Recompense';
import { t } from '../i18n';

const container = document.getElementById('meniu')!;

// Paletele de culori
const HAINE = [
  0x9ec5ee, 0x2ee6d6, 0x1d2a6b, 0x4a6fd8, 0xe84a4a, 0x8a1f2f, 0xff9a3c, 0xffd23f,
  0x4ccf6a, 0x1f6b3a, 0x8a6cff, 0xff5fa8, 0xffc2d9, 0x8b5a2b, 0xd9c7a0, 0x8a8f99,
  0x2a2a33, 0xf2f2f2,
];
const PAR = [0x6b4529, 0x231a14, 0xe0b45a, 0xb5532a, 0x8a6a4a, 0xd8d8d8, 0x2ee6d6, 0xff5fa8, 0x8a6cff];
const PIELE = [0xf5cfa0, 0xe8b88a, 0xc68c5c, 0x8d5a3a];
const BLANA = [0xb8692a, 0xf0a050, 0x2e2a28, 0xf2f2f2, 0xe0a845, 0x8a8f99, 0xe8e2d4];

type Tab = 'culori' | 'stil' | 'animal' | 'magazin' | 'puteri' | 'cufar';
const TABURI: [Tab, string][] = [['culori', '🎨 Culori'], ['stil', '👕 Stil'], ['animal', '🐾 Animal'], ['magazin', '🛒 Magazin'], ['puteri', '⚡ Puteri'], ['cufar', '🎁 Cufăr']];

const hex = (c: number) => '#' + c.toString(16).padStart(6, '0');

export class Personalizare {
  private tab: Tab = 'culori';
  private scroll = 0;

  constructor(
    private progres: Progres,
    /** Se apelează după orice schimbare, ca personajul să se actualizeze */
    private laSchimbare: () => void,
    /** Butonul „Gata” */
    private laIesire: () => void,
  ) {}

  arata() {
    container.classList.add('lateral');
    const p = this.progres;
    container.innerHTML = `
      <div class="panou">
        <div class="antet">
          <h2>${t('Personalizează')}</h2>
          <div class="portofel"><span class="moneda-mica"></span>${p.portofel}</div>
        </div>
        <div class="taburi">${TABURI.map(([id, text]) => `<button data-tab="${id}" class="${this.tab === id ? 'activ' : ''}">${text.split(' ')[0]} ${t(text.split(' ').slice(1).join(' '))}</button>`).join('')}</div>
        <div class="continut"></div>
        <button class="mare gata">${t('Gata')}</button>
      </div>`;
    container.querySelectorAll<HTMLButtonElement>('.taburi button').forEach((b) =>
      b.addEventListener('click', () => { this.tab = b.dataset.tab as Tab; this.scroll = 0; sunete.click(); this.arata(); }));
    container.querySelector('.gata')!.addEventListener('click', () => {
      container.classList.remove('lateral');
      this.laIesire();
    });
    const continut = container.querySelector<HTMLElement>('.continut')!;
    ({ culori: () => this.culori(continut), stil: () => this.stil(continut), animal: () => this.animal(continut),
      magazin: () => this.magazin(continut), puteri: () => this.puteri(continut), cufar: () => this.cufar(continut) })[this.tab]();
    // păstrăm poziția derulării după ce redesenăm
    continut.scrollTop = this.scroll;
    continut.addEventListener('scroll', () => { this.scroll = continut.scrollTop; });
  }

  private salveazaSiAplica() {
    salveaza(this.progres);
    this.laSchimbare();
    this.arata();
  }

  /** Un rând cu etichetă și conținut */
  private rand(eticheta: string, ...copii: HTMLElement[]) {
    const r = document.createElement('div');
    r.className = 'rand-culori';
    r.innerHTML = `<span class="eticheta-culoare">${t(eticheta)}</span>`;
    const c = document.createElement('div');
    c.className = 'bule';
    c.append(...copii);
    r.append(c);
    return r;
  }

  /** Un rând de buline colorate */
  private randCulori(eticheta: string, paleta: number[], curenta: number, alege: (c: number) => void) {
    return this.rand(eticheta, ...paleta.map((c) => {
      const b = document.createElement('button');
      b.className = 'bula' + (c === curenta ? ' aleasa' : '');
      b.style.background = hex(c);
      b.setAttribute('aria-label', t(eticheta));
      b.addEventListener('click', () => { alege(c); sunete.click(); this.salveazaSiAplica(); });
      return b;
    }));
  }

  /** Un rând de butoane-text (ex. coafurile) */
  private randOptiuni<T extends string>(eticheta: string, optiuni: [T, string][], curenta: T, alege: (v: T) => void) {
    return this.rand(eticheta, ...optiuni.map(([v, text]) => {
      const b = document.createElement('button');
      b.className = 'optiune' + (v === curenta ? ' aleasa' : '');
      b.textContent = t(text);
      b.addEventListener('click', () => { alege(v); sunete.click(); this.salveazaSiAplica(); });
      return b;
    }));
  }

  private culori(el: HTMLElement) {
    const c = this.progres.culori;
    const seteaza = (parte: keyof CuloriPersonaj) => (v: number) => { c[parte] = v; };
    el.append(
      this.randCulori('Tricou', HAINE, c.tricou, seteaza('tricou')),
      this.randCulori(this.progres.aspect.pantaloni === 'fusta' ? 'Fustă' : this.progres.aspect.pantaloni === 'rochie' ? 'Rochie' : 'Pantaloni', HAINE, c.pantaloni, seteaza('pantaloni')),
      this.randCulori('Detalii', HAINE, c.detalii, seteaza('detalii')),
      this.randCulori('Adidași', HAINE, c.pantofi, seteaza('pantofi')),
      this.randCulori('Păr', PAR, c.par, seteaza('par')),
      this.randCulori('Piele', PIELE, c.piele, seteaza('piele')),
    );
  }

  private stil(el: HTMLElement) {
    const a = this.progres.aspect;
    const seteaza = <K extends keyof AspectPersonaj>(k: K) => (v: AspectPersonaj[K]) => { a[k] = v; };
    el.append(
      this.randOptiuni('Personaj', [['baiat', '👦 Băiat'], ['fata', '👧 Fată']], a.gen, (v) => {
        a.gen = v;
        // o coafură potrivită ca punct de plecare (se poate schimba oricând)
        if (v === 'fata' && a.coafura === 'scurt') a.coafura = 'lung';
        if (v === 'baiat' && (a.coafura === 'lung' || a.coafura === 'codite')) a.coafura = 'scurt';
      }),
      this.randOptiuni('Coafură', [['scurt', 'Scurt'], ['lung', 'Lung'], ['coada', 'Coadă'], ['codite', 'Codițe'], ['creasta', 'Creastă']], a.coafura, seteaza('coafura')),
      this.randOptiuni('Tricou', [['simplu', 'Simplu'], ['dungi', 'Dungi'], ['stea', 'Stea'], ['fulger', 'Fulger'], ['hanorac', 'Hanorac'], ['camasa', 'Cămașă'], ['maieu', 'Maieu'], ['geaca', 'Geacă']], a.tricou, seteaza('tricou')),
      this.randOptiuni('Jos', [['lungi', 'Pantaloni lungi'], ['scurti', 'Pantaloni scurți'], ['blugi', 'Blugi'], ['fusta', 'Fustă'], ['rochie', 'Rochie']], a.pantaloni, seteaza('pantaloni')),
    );
    // costumul de aur (recompensa supremă)
    if (areTotul(this.progres)) {
      el.append(this.randOptiuni('Costum de aur', [['da', '✨ Pornit'], ['nu', 'Oprit']], a.costumAur ? 'da' : 'nu', (v) => { a.costumAur = v === 'da'; }));
    } else {
      el.append(this.indiciuRecompensa());
    }
    const sfat = document.createElement('p');
    sfat.className = 'sfat';
    sfat.textContent = t('Culorile pentru dungi, stea, fulger și funde le alegi la „Culori” → „Detalii”.');
    el.append(sfat);
  }

  private animal(el: HTMLElement) {
    const p = this.progres;
    const deblocat = areTotul(p);
    el.append(this.randOptiuni('Animal', ANIMALE.filter((a) => !a.secret || deblocat).map((a) => [a.tip, `${a.emoji} ${t(a.nume)}`]), p.animal, (v) => {
      p.animal = v;
      p.culoareAnimal = ANIMALE.find((a) => a.tip === v)!.culoare; // culoarea lui obișnuită
    }));
    if (!deblocat) el.append(this.indiciuRecompensa());
    if (ANIMALE.find((a) => a.tip === p.animal)?.recolorabil) {
      el.append(this.randCulori('Blană', BLANA, p.culoareAnimal, (v) => { p.culoareAnimal = v; }));
    }
  }

  private magazin(el: HTMLElement) {
    const p = this.progres;
    const grila = document.createElement('div');
    grila.className = 'grila-magazin';
    for (const a of CATALOG) {
      const cumparat = p.cumparate.includes(a.id);
      const purtat = p.echipate[a.slot] === a.id;
      const card = document.createElement('div');
      card.className = 'card-accesoriu' + (purtat ? ' purtat' : '') + (a.secret ? ' secret' : '');
      if (a.secret && !cumparat) {
        // accesoriul secret: nu se vinde, se câștigă cu toate stelele secrete
        card.innerHTML = `<span class="emoji">❓</span><span class="nume">${t('Secret')}</span><span class="indiciu">${t('Găsește toate stelele mov ascunse')}</span>`;
        grila.append(card);
        continue;
      }
      card.innerHTML = `<span class="emoji">${a.emoji}</span><span class="nume">${t(a.nume)}</span>`;
      const b = document.createElement('button');
      if (!cumparat) {
        b.innerHTML = `<span class="moneda-mica"></span> ${a.pret}`;
        b.className = 'cumpara';
        b.disabled = p.portofel < a.pret;
        b.addEventListener('click', () => {
          if (p.portofel < a.pret) return;
          p.portofel -= a.pret;
          p.cumparate.push(a.id);
          p.echipate[a.slot] = a.id; // îl și pune pe el imediat
          sunete.cumparare();
          this.salveazaSiAplica();
        });
      } else {
        b.textContent = purtat ? t('Scoate') : t('Pune');
        b.className = purtat ? 'scoate' : 'pune';
        b.addEventListener('click', () => {
          if (purtat) delete p.echipate[a.slot]; else p.echipate[a.slot] = a.id;
          sunete.click();
          this.salveazaSiAplica();
        });
      }
      card.append(b);
      grila.append(card);
    }
    el.append(grila);
  }

  private puteri(el: HTMLElement) {
    const p = this.progres;
    const grila = document.createElement('div');
    grila.className = 'grila-magazin';
    for (const pu of PUTERI) {
      const cumparat = p.cumparate.includes(pu.id);
      const pornita = p.puteriActive.includes(pu.id);
      const card = document.createElement('div');
      card.className = 'card-accesoriu putere' + (pornita ? ' purtat' : '');
      card.innerHTML = `<span class="emoji">${pu.emoji}</span><span class="nume">${t(pu.nume)}</span><span class="indiciu">${t(pu.descriere)}</span>`;
      const b = document.createElement('button');
      if (!cumparat) {
        b.innerHTML = `<span class="moneda-mica"></span> ${pu.pret}`;
        b.className = 'cumpara';
        b.disabled = p.portofel < pu.pret;
        b.addEventListener('click', () => {
          if (p.portofel < pu.pret) return;
          p.portofel -= pu.pret;
          p.cumparate.push(pu.id);
          p.puteriActive.push(pu.id); // pornită imediat
          sunete.cumparare();
          this.salveazaSiAplica();
        });
      } else {
        b.textContent = pornita ? t('Pornită') + ' ✓' : t('Oprită');
        b.className = pornita ? 'pune' : 'scoate';
        b.addEventListener('click', () => {
          p.puteriActive = pornita ? p.puteriActive.filter((x) => x !== pu.id) : [...p.puteriActive, pu.id];
          sunete.click();
          this.salveazaSiAplica();
        });
      }
      card.append(b);
      grila.append(card);
    }
    el.append(grila);
    const sfat = document.createElement('p');
    sfat.className = 'sfat';
    sfat.textContent = t('Poți opri puterile oricând, dacă vrei să joci mai greu.');
    el.append(sfat);
  }

  private cufar(el: HTMLElement) {
    const p = this.progres;
    const ef = p.efecte;
    const ramase = EFECTE.length - ef.detinute.length;
    // cufărul
    const zona = document.createElement('div');
    zona.className = 'zona-cufar';
    zona.innerHTML = `<span class="cufar-mic">🎁</span>
      <div class="text-cufar"><b>${t('Cufăr surpriză')}</b><span>${ramase > 0 ? t('Mai ai {n} efecte de descoperit', { n: ramase }) : t('Le ai pe toate!') + ' 🏆'}</span></div>`;
    const b = document.createElement('button');
    b.className = 'cumpara';
    b.innerHTML = ramase > 0 ? `${t('Deschide')} <span class="moneda-mica"></span> ${PRET_CUFAR}` : t('Gata!');
    b.disabled = ramase === 0 || p.portofel < PRET_CUFAR;
    b.addEventListener('click', () => {
      if (p.portofel < PRET_CUFAR) return;
      const castigat = deschideCufar(ef);
      if (!castigat) return;
      p.portofel -= PRET_CUFAR;
      salveaza(p);
      arataCufar({ efect: castigat }, () => this.salveazaSiAplica());
    });
    zona.append(b);
    el.append(zona);

    // ce ai și ce folosești, pe categorii
    for (const cat of ['urma', 'saritura', 'pasi', 'aterizare'] as CategorieEfect[]) {
      const ale = EFECTE.filter((e) => e.categorie === cat);
      const optiuni: HTMLElement[] = [];
      const fara = document.createElement('button');
      fara.className = 'optiune' + (ef[cat] === null ? ' aleasa' : '');
      fara.textContent = cat === 'saritura' || cat === 'pasi' ? t('Obișnuit') : t('Fără');
      fara.addEventListener('click', () => { ef[cat] = null; sunete.click(); this.salveazaSiAplica(); });
      optiuni.push(fara);
      for (const e of ale) {
        const o = document.createElement('button');
        const are = ef.detinute.includes(e.id);
        o.className = 'optiune' + (ef[cat] === e.id ? ' aleasa' : '') + (are ? '' : ' necunoscut');
        o.textContent = are ? `${e.emoji} ${t(e.nume)}` : '❓';
        o.disabled = !are;
        o.addEventListener('click', () => {
          ef[cat] = e.id;
          if (cat === 'saritura') sunete.sarituraVarianta(e.id.slice(2));
          else if (cat === 'pasi') { sunete.pas(e.id.slice(2), true); setTimeout(() => sunete.pas(e.id.slice(2), false), 280); }
          else sunete.click();
          this.salveazaSiAplica();
        });
        optiuni.push(o);
      }
      el.append(this.rand(NUME_CATEGORII[cat], ...optiuni));
    }
  }

  /** Indiciul pentru recompensa supremă: ce mai trebuie adunat */
  private indiciuRecompensa() {
    const lipsa = catMaiLipseste(this.progres);
    const p = document.createElement('p');
    p.className = 'sfat indiciu-aur';
    p.textContent = '🔒 ' + t('Costumul de aur, titlul „Bogatul anului” și pisica Kiwi: adună toate accesoriile și toate efectele din cufere! (mai ai {a} accesorii și {e} efecte)', { a: lipsa.accesorii, e: lipsa.efecte });
    return p;
  }
}
