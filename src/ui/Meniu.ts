// Meniurile jocului: principal, alegerea nivelului și pauza.
// Sunt construite din cod, în elementul #meniu.
import { areToateSecretele, NR_STELE_SECRETE, type Progres } from '../joc/Salvare';
import { NR_NIVELE_NORMALE, INDEX_SECRET, ORDINE_NORMALA, numarAfisat } from '../nivele';
import type { DefinitieNivel } from '../nivele/tipuri';
import { formatTimp } from './Hud';
import { sunete } from '../audio/Sunete';
import { esteInstalat, instaleaza } from '../pwa/Instalare';
import { esteEveniment, textEveniment } from '../joc/Eveniment';

export interface ActiuniMeniu {
  joacaNivel(index: number): void;
  continua(): void;
  reincepe(): void;
  personalizeaza(): void;
  comutaSunet(): boolean;
  clasament(): void;
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
    container.append(sunet);
  }

  arataNivele(p: Progres) {
    container.innerHTML = '<h2>Alege nivelul</h2>';
    container.append(buton('‹ Înapoi', 'mic-buton inapoi', () => this.arataPrincipal(p)));
    const rand = document.createElement('div');
    rand.className = 'rand-nivele';
    // întâi nivelurile normale, în ordinea de joc, apoi cel secret
    [...ORDINE_NORMALA, INDEX_SECRET].forEach((i, loc) => {
      const n = this.nivele[i];
      const esteSecret = i === INDEX_SECRET;
      const deschis = esteSecret ? areToateSecretele(p) : loc < p.deblocate;
      const rez = p.nivele[i];
      const card = document.createElement('button');
      card.className = 'card-nivel' + (deschis ? '' : ' blocat') + (esteSecret ? ' secret' : '');
      card.disabled = !deschis;
      if (deschis) {
        card.innerHTML = `<span class="nr">${numarAfisat(i)}</span><span class="nume">${n.nume}</span>
           <span class="stele">${stele(rez?.stele ?? 0)}</span>
           <span class="timp">${rez ? 'Record: ' + formatTimp(rez.timp) : ''}</span>`;
        card.addEventListener('click', () => this.actiuni.joacaNivel(i));
      } else if (esteSecret) {
        // nivelul secret: doar semne de întrebare și câte stele secrete ai găsit
        card.innerHTML = `<span class="nr">?</span><span class="nume">Nivel secret</span>
           <span class="stele-secrete">${'★'.repeat(p.secrete.length)}<span class="goale">${'★'.repeat(NR_STELE_SECRETE - p.secrete.length)}</span></span>
           <span class="timp">Găsește stelele mov!</span>`;
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
      buton('Meniul principal', 'mic-buton', () => this.arataPrincipal(p)),
    );
    container.append(coloana);
  }
}
