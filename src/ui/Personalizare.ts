// Ecranul „Personalizează”: culori pentru Mihai și cățel + magazinul de accesorii.
// Panoul stă în dreapta, iar personajul se vede în stânga, întors spre tine.
import type { Progres } from '../joc/Salvare';
import { salveaza } from '../joc/Salvare';
import type { CuloriPersonaj } from '../joc/Personaj';
import { CATALOG } from '../joc/Accesorii';
import { sunete } from '../audio/Sunete';

const container = document.getElementById('meniu')!;

// Paletele de culori din care alege Mihai
const HAINE = [0x9ec5ee, 0x2ee6d6, 0xe84a4a, 0x4ccf6a, 0xffd23f, 0xff9a3c, 0x8a6cff, 0xff5fa8, 0x2a2a33, 0xf2f2f2, 0x1d2a6b, 0x3a2f55];
const PAR = [0x6b4529, 0x231a14, 0xe0b45a, 0xb5532a, 0x2ee6d6, 0xff5fa8];
const PIELE = [0xf5cfa0, 0xe8b88a, 0xc68c5c, 0x8d5a3a];
const BLANA = [0xb8692a, 0x2e2a28, 0xf0ebe0, 0xe0a845, 0x8a8f99];

const hex = (c: number) => '#' + c.toString(16).padStart(6, '0');

export class Personalizare {
  private tab: 'culori' | 'magazin' = 'culori';

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
          <h2>Personalizează</h2>
          <div class="portofel"><span class="moneda-mica"></span>${p.portofel}</div>
        </div>
        <div class="taburi">
          <button data-tab="culori" class="${this.tab === 'culori' ? 'activ' : ''}">🎨 Culori</button>
          <button data-tab="magazin" class="${this.tab === 'magazin' ? 'activ' : ''}">🛒 Magazin</button>
        </div>
        <div class="continut"></div>
        <button class="mare gata">Gata</button>
      </div>`;
    container.querySelectorAll<HTMLButtonElement>('.taburi button').forEach((b) =>
      b.addEventListener('click', () => { this.tab = b.dataset.tab as 'culori' | 'magazin'; sunete.click(); this.arata(); }));
    container.querySelector('.gata')!.addEventListener('click', () => {
      container.classList.remove('lateral');
      this.laIesire();
    });
    const continut = container.querySelector<HTMLElement>('.continut')!;
    if (this.tab === 'culori') this.culori(continut); else this.magazin(continut);
  }

  private salveazaSiAplica() {
    salveaza(this.progres);
    this.laSchimbare();
  }

  /** Un rând de buline colorate */
  private rand(eticheta: string, paleta: number[], curenta: number, alege: (c: number) => void) {
    const r = document.createElement('div');
    r.className = 'rand-culori';
    r.innerHTML = `<span class="eticheta-culoare">${eticheta}</span>`;
    const bule = document.createElement('div');
    bule.className = 'bule';
    for (const c of paleta) {
      const b = document.createElement('button');
      b.className = 'bula' + (c === curenta ? ' aleasa' : '');
      b.style.background = hex(c);
      b.setAttribute('aria-label', eticheta);
      b.addEventListener('click', () => { alege(c); sunete.click(); this.salveazaSiAplica(); this.arata(); });
      bule.append(b);
    }
    r.append(bule);
    return r;
  }

  private culori(el: HTMLElement) {
    const c = this.progres.culori;
    const seteaza = (parte: keyof CuloriPersonaj) => (v: number) => { c[parte] = v; };
    el.append(
      this.rand('Tricou', HAINE, c.tricou, seteaza('tricou')),
      this.rand('Pantaloni', HAINE, c.pantaloni, seteaza('pantaloni')),
      this.rand('Adidași', HAINE, c.pantofi, seteaza('pantofi')),
      this.rand('Păr', PAR, c.par, seteaza('par')),
      this.rand('Piele', PIELE, c.piele, seteaza('piele')),
      this.rand('Cățel', BLANA, this.progres.culoareCatel, (v) => { this.progres.culoareCatel = v; }),
    );
  }

  private magazin(el: HTMLElement) {
    const p = this.progres;
    const grila = document.createElement('div');
    grila.className = 'grila-magazin';
    for (const a of CATALOG) {
      const cumparat = p.cumparate.includes(a.id);
      const purtat = p.echipate[a.slot] === a.id;
      const card = document.createElement('div');
      card.className = 'card-accesoriu' + (purtat ? ' purtat' : '');
      card.innerHTML = `<span class="emoji">${a.emoji}</span><span class="nume">${a.nume}</span>`;
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
          this.arata();
        });
      } else {
        b.textContent = purtat ? 'Scoate' : 'Pune';
        b.className = purtat ? 'scoate' : 'pune';
        b.addEventListener('click', () => {
          if (purtat) delete p.echipate[a.slot]; else p.echipate[a.slot] = a.id;
          sunete.click();
          this.salveazaSiAplica();
          this.arata();
        });
      }
      card.append(b);
      grila.append(card);
    }
    el.append(grila);
    if (p.portofel < Math.min(...CATALOG.filter((a) => !p.cumparate.includes(a.id)).map((a) => a.pret))) {
      const sfat = document.createElement('p');
      sfat.className = 'sfat';
      sfat.textContent = 'Strânge monede în niveluri ca să cumperi accesorii!';
      el.append(sfat);
    }
  }
}
