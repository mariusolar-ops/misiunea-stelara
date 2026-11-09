// Ecranul „Clasament”: rezultatele lui Mihai și ale prietenilor adăugați cu cod.
// Totul stă pe telefon. Codurile se trimit doar de mână (copiere / „Trimite”).
import { salveaza, type Progres } from '../joc/Salvare';
import { codulMeu, citesteCod, curataNume } from '../joc/CodScor';
import { formatTimp } from './Hud';
import { sunete } from '../audio/Sunete';
import type { DefinitieNivel } from '../nivele/tipuri';

const container = document.getElementById('meniu')!;

/** Scapă de caracterele speciale HTML (numele vin de la alți oameni) */
function text(s: string) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

interface Rand { nume: string; tu: boolean; timp: number | null; stele: number; index: number }

export class Clasament {
  /** -1 = clasamentul total (după stele), altfel numărul nivelului */
  private tab = -1;
  private mesaj = '';

  constructor(
    private progres: Progres,
    private nivele: DefinitieNivel[],
    private esteDeschisSecret: () => boolean,
    private laIesire: () => void,
  ) {}

  arata() {
    const p = this.progres;
    // nivelul secret apare în clasament doar dacă l-ai deschis
    const nrTaburi = this.esteDeschisSecret() ? this.nivele.length : this.nivele.length - 1;
    const taburi = [`<button data-tab="-1" class="${this.tab === -1 ? 'activ' : ''}">⭐ Total</button>`]
      .concat(Array.from({ length: nrTaburi }, (_, i) =>
        `<button data-tab="${i}" class="${this.tab === i ? 'activ' : ''}">${this.nivele[i].esteSecret ? '✨' : i + 1}</button>`))
      .join('');

    container.innerHTML = `
      <div class="clasament">
        <div class="coloana-lista">
          <h2>🏆 Clasament</h2>
          <div class="taburi taburi-mici">${taburi}</div>
          <div class="subtitlu">${this.tab === -1 ? 'Cine are cele mai multe stele' : 'Cel mai bun timp: ' + text(this.nivele[this.tab].nume)}</div>
          <ol class="lista">${this.randuri()}</ol>
        </div>
        <div class="coloana-coduri">
          <label>Numele tău
            <input id="nume-jucator" maxlength="14" value="${text(p.nume)}" autocomplete="off" />
          </label>
          <div class="eticheta-mica">Codul tău (trimite-l prietenilor)</div>
          <div class="cod" id="codul-meu">${codulMeu(p)}</div>
          <div class="rand-butoane">
            <button class="mic-buton" id="copiaza">📋 Copiază</button>
            ${'share' in navigator ? '<button class="mic-buton" id="trimite">📤 Trimite</button>' : ''}
          </div>
          <label>Codul unui prieten
            <input id="cod-prieten" placeholder="MS-..." autocomplete="off" autocapitalize="off" spellcheck="false" />
          </label>
          <button class="mare" id="adauga">Adaugă prieten</button>
          <div class="mesaj-cod">${text(this.mesaj)}</div>
        </div>
      </div>`;

    const inapoi = document.createElement('button');
    inapoi.className = 'mic-buton inapoi';
    inapoi.textContent = '‹ Înapoi';
    inapoi.addEventListener('click', () => { sunete.click(); this.laIesire(); });
    container.append(inapoi);

    container.querySelectorAll<HTMLButtonElement>('.taburi button').forEach((b) =>
      b.addEventListener('click', () => { this.tab = Number(b.dataset.tab); sunete.click(); this.arata(); }));

    // schimbarea numelui
    const camp = container.querySelector<HTMLInputElement>('#nume-jucator')!;
    camp.addEventListener('change', () => {
      p.nume = curataNume(camp.value) || 'Mihai';
      salveaza(p);
      this.arata();
    });

    container.querySelector('#copiaza')!.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(codulMeu(p)); this.mesaj = 'Codul a fost copiat!'; }
      catch { this.mesaj = 'Ține apăsat pe cod ca să-l copiezi.'; }
      sunete.click();
      this.arata();
    });
    container.querySelector('#trimite')?.addEventListener('click', () => {
      sunete.click();
      navigator.share({ text: `Codul meu din Misiunea Stelară: ${codulMeu(p)}` }).catch(() => {});
    });

    container.querySelector('#adauga')!.addEventListener('click', () => {
      const cod = container.querySelector<HTMLInputElement>('#cod-prieten')!.value;
      const prieten = citesteCod(cod);
      if (!prieten) {
        this.mesaj = 'Codul nu e bun. Verifică să fie copiat întreg.';
      } else if (cod.trim() === codulMeu(p)) {
        this.mesaj = 'Ăsta e chiar codul tău! 😄';
      } else {
        // dacă prietenul există deja (același nume), îi actualizăm scorul
        const vechi = p.prieteni.findIndex((x) => x.nume.toLowerCase() === prieten.nume.toLowerCase());
        if (vechi >= 0) p.prieteni[vechi] = prieten; else p.prieteni.push(prieten);
        salveaza(p);
        this.mesaj = vechi >= 0 ? `Scorul lui ${prieten.nume} a fost actualizat!` : `${prieten.nume} a fost adăugat!`;
        sunete.steag();
      }
      this.arata();
    });

    // ștergerea unui prieten
    container.querySelectorAll<HTMLButtonElement>('.sterge').forEach((b) =>
      b.addEventListener('click', () => {
        const i = Number(b.dataset.index);
        const nume = p.prieteni[i]?.nume;
        if (nume && confirm(`Ștergi pe ${nume} din clasament?`)) {
          p.prieteni.splice(i, 1);
          salveaza(p);
          this.arata();
        }
      }));
  }

  /** Rândurile clasamentului pentru tab-ul curent */
  private randuri() {
    const p = this.progres;
    const totiNoi: Rand[] = [{
      nume: p.nume, tu: true, index: -1,
      timp: this.tab >= 0 ? p.nivele[this.tab]?.timp ?? null : null,
      stele: this.tab >= 0 ? p.nivele[this.tab]?.stele ?? 0
        : Object.values(p.nivele).reduce((s, r) => s + r.stele, 0),
    }];
    p.prieteni.forEach((f, i) => totiNoi.push({
      nume: f.nume, tu: false, index: i,
      timp: this.tab >= 0 ? f.timpi[this.tab] : null,
      stele: this.tab >= 0 ? f.stele[this.tab] : f.stele.reduce((s, x) => s + x, 0),
    }));

    let lista = totiNoi;
    if (this.tab >= 0) {
      // pe nivel: doar cine l-a terminat, după timp
      lista = lista.filter((r) => r.timp !== null).sort((a, b) => a.timp! - b.timp!);
    } else {
      lista = lista.sort((a, b) => b.stele - a.stele);
    }
    if (lista.length === 0) return '<li class="gol">Încă nimeni n-a terminat nivelul ăsta.</li>';

    const medalii = ['🥇', '🥈', '🥉'];
    const randuri = lista.map((r, loc) => `
      <li class="${r.tu ? 'tu' : ''}">
        <span class="loc">${medalii[loc] ?? loc + 1}</span>
        <span class="nume-rand">${text(r.nume)}${r.tu ? ' <small>(tu)</small>' : ''}</span>
        <span class="valoare">${this.tab >= 0 ? formatTimp(r.timp!) : r.stele + ' ⭐'}</span>
        ${r.tu ? '<span class="sterge-loc"></span>' : `<button class="sterge" data-index="${r.index}" aria-label="Șterge">✕</button>`}
      </li>`).join('');
    const indemn = p.prieteni.length === 0
      ? '<li class="gol">Adaugă codul unui prieten ca să vă întreceți!</li>' : '';
    return randuri + indemn;
  }
}
