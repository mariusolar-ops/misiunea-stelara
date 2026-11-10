// Meniurile jocului: principal, alegerea nivelului și pauza.
// Sunt construite din cod, în elementul #meniu.
import type { Progres } from '../joc/Salvare';
import { NR_NIVELE_NORMALE, ORDINE_NORMALA, SECRETE, numarAfisat, secretDeschis } from '../nivele';
import type { DefinitieNivel } from '../nivele/tipuri';
import { formatTimp } from './Hud';
import { sunete } from '../audio/Sunete';
import { esteInstalat, instaleaza } from '../pwa/Instalare';
import { esteEveniment, textEveniment } from '../joc/Eveniment';
import { cautaTitlu } from '../joc/Titluri';

export interface ActiuniMeniu {
  joacaNivel(index: number): void;
  continua(): void;
  reincepe(): void;
  personalizeaza(): void;
  comutaSunet(): boolean;
  clasament(): void;
  /** Deschide setările; „inapoi” e ecranul la care revii după */
  setari(inapoi: () => void): void;
  titluri(inapoi: () => void): void;
}

const container = document.getElementById('meniu')!;

/** Creează un buton cu text și acțiune */
function buton(text: string, clasa: string, apasare: () => void, dezactivat = false) {
  const b = document.createElement('button');
  b.className = clasa;
  b.innerHTML = text;
  b.disabled = dezactivat;
  b.addEventListener('click', () => { sunete.click(); apasare(); });
  return b;
}

function stele(n: number) {
  return [1, 2, 3].map((i) => `<span class="${i <= n ? 'plina' : ''}">★</span>`).join('');
}

export class Meniu {
  constructor(private nivele: DefinitieNivel[], private actiuni: ActiuniMeniu) {}

  ascunde() { container.innerHTML = ''; }

  arataPrincipal(p: Progres) {
    container.innerHTML = `
      <h1>Mihai:<span>Misiunea Stelară</span></h1>
      ${cautaTitlu(p.titluAles) ? `<div class="titlu-meniu">${cautaTitlu(p.titluAles)!.emoji} ${p.nume} – ${cautaTitlu(p.titluAles)!.nume}</div>` : ''}
      <div class="rand-butoane">
        <div class="portofel"><span class="moneda-mica"></span>${p.portofel}</div>
        <div class="eveniment ${esteEveniment() ? 'activ' : ''}">${textEveniment()}</div>
      </div>`;
    const coloana = document.createElement('div');
    coloana.className = 'coloana-butoane';
    // „Joacă” pornește primul nivel neterminat (sau ultimul, dacă le-ai terminat pe toate)
    const urmator = ORDINE_NORMALA[Math.min(p.deblocate, NR_NIVELE_NORMALE) - 1];
    coloana.append(
      buton('JOACĂ', 'mare', () => this.actiuni.joacaNivel(urmator)),
    );
    // sub JOACĂ: trei butoane pe un rând
    const rand = document.createElement('div');
    rand.className = 'rand-butoane';
    rand.append(
      buton('Alege nivelul', 'mic-buton', () => this.arataNivele(p)),
      buton('Personalizează', 'mic-buton', () => this.actiuni.personalizeaza()),
      buton('🏆 Clasament', 'mic-buton', () => this.actiuni.clasament()),
    );
    coloana.append(rand);
    container.append(coloana);
    // butonul de instalare (doar dacă nu e deja instalat ca aplicație)
    if (!esteInstalat()) {
      container.append(buton('📲 Instalează pe telefon', 'mic-buton buton-instalare', async () => {
        if (!(await instaleaza())) this.arataInstructiuni(p);
      }));
    }
    // butonul de sunet, în colțul din dreapta-sus
    const sunet = buton(p.sunet ? '🔊' : '🔇', 'buton-sunet', () => {
      sunet.textContent = this.actiuni.comutaSunet() ? '🔊' : '🔇';
    });
    sunet.setAttribute('aria-label', 'Sunet');
    const setari = buton('⚙️', 'buton-sunet buton-setari', () => this.actiuni.setari(() => this.arataPrincipal(p)));
    setari.setAttribute('aria-label', 'Setări');
    const titluri = buton('🏅', 'buton-sunet buton-titluri', () => this.actiuni.titluri(() => this.arataPrincipal(p)));
    titluri.setAttribute('aria-label', 'Titluri');
    container.append(sunet, setari, titluri);
  }

  arataNivele(p: Progres) {
    container.innerHTML = '<h2>Alege nivelul</h2>';
    container.append(buton('‹ Înapoi', 'mic-buton inapoi', () => this.arataPrincipal(p)));
    const rand = document.createElement('div');
    rand.className = 'rand-nivele';
    // întâi nivelurile normale, în ordinea de joc, apoi cele secrete
    [...ORDINE_NORMALA, ...SECRETE.map((x) => x.index)].forEach((i, loc) => {
      const n = this.nivele[i];
      const grupa = SECRETE.find((x) => x.index === i);
      const esteSecret = !!grupa;
      const deschis = esteSecret ? secretDeschis(p.secrete, i) : loc < p.deblocate;
      const rez = p.nivele[i];
      const card = document.createElement('button');
      card.className = 'card-nivel' + (deschis ? '' : ' blocat') + (esteSecret ? (i === SECRETE[1].index ? ' secret aur' : ' secret') : '');
      card.disabled = !deschis;
      if (deschis) {
        card.innerHTML = `<span class="nr">${numarAfisat(i)}</span><span class="nume">${n.nume}</span>
           <span class="stele">${stele(rez?.stele ?? 0)}</span>
           <span class="timp">${rez ? 'Record: ' + formatTimp(rez.timp) : ''}</span>`;
        card.addEventListener('click', () => this.actiuni.joacaNivel(i));
      } else if (grupa) {
        // nivelul secret: doar semne de întrebare și câte stele ai găsit din grupa lui
        const gasite = grupa.nivele.filter((x) => p.secrete.includes(x)).length;
        card.innerHTML = `<span class="nr">?</span><span class="nume">Nivel secret</span>
           <span class="stele-secrete">${'★'.repeat(gasite)}<span class="goale">${'★'.repeat(grupa.nivele.length - gasite)}</span></span>
           <span class="timp">${i === SECRETE[0].index ? 'Găsește stelele mov! (nivelurile 1–5)' : 'Găsește stelele de aur! (nivelurile 6–9)'}</span>`;
      } else {
        card.innerHTML = `<span class="nr">${numarAfisat(i)}</span><span class="nume">${n.nume}</span><span class="lacat">🔒</span><span class="timp"></span>`;
      }
      rand.append(card);
    });
    container.append(rand);
  }

  /** Pașii de instalare, pentru părinte (când Chrome nu oferă butonul direct) */
  arataInstructiuni(p: Progres) {
    container.innerHTML = `
      <h2>Instalează pe telefon</h2>
      <ol class="pasi">
        <li>Apasă pe <b>cele 3 puncte ⋮</b> din dreapta-sus în Chrome.</li>
        <li>Alege <b>„Instalează aplicația”</b> sau <b>„Adaugă pe ecranul de pornire”</b>.</li>
        <li>Apasă <b>„Instalează”</b>.</li>
        <li>Iconița cu Mihai apare pe ecran. De acum jocul merge și <b>fără internet</b>!</li>
      </ol>`;
    container.append(buton('‹ Înapoi', 'mic-buton inapoi', () => this.arataPrincipal(p)));
  }

  arataPauza(p: Progres) {
    container.innerHTML = '<h2>Pauză</h2>';
    const coloana = document.createElement('div');
    coloana.className = 'coloana-butoane';
    coloana.append(
      buton('Continuă', 'mare', () => this.actiuni.continua()),
      buton('Începe nivelul din nou', 'mic-buton', () => this.actiuni.reincepe()),
      buton('⚙️ Setări', 'mic-buton', () => this.actiuni.setari(() => this.arataPauza(p))),
      buton('Meniul principal', 'mic-buton', () => this.arataPrincipal(p)),
    );
    container.append(coloana);
  }
}
