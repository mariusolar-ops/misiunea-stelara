// Meniurile jocului: principal, alegerea nivelului și pauza.
// Sunt construite din cod, în elementul #meniu.
import type { Progres } from '../joc/Salvare';
import type { DefinitieNivel } from '../nivele/tipuri';
import { formatTimp } from './Hud';
import { sunete } from '../audio/Sunete';

export interface ActiuniMeniu {
  joacaNivel(index: number): void;
  continua(): void;
  reincepe(): void;
  personalizeaza(): void;
  comutaSunet(): boolean;
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
      <div class="portofel"><span class="moneda-mica"></span>${p.portofel}</div>`;
    const coloana = document.createElement('div');
    coloana.className = 'coloana-butoane';
    // „Joacă” pornește primul nivel neterminat (sau ultimul, dacă le-ai terminat pe toate)
    const urmator = Math.min(p.deblocate, this.nivele.length) - 1;
    coloana.append(
      buton('JOACĂ', 'mare', () => this.actiuni.joacaNivel(urmator)),
      buton('Alege nivelul', 'mic-buton', () => this.arataNivele(p)),
      buton('Personalizează', 'mic-buton', () => this.actiuni.personalizeaza()),
    );
    container.append(coloana);
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
    this.nivele.forEach((n, i) => {
      const deschis = i < p.deblocate;
      const rez = p.nivele[i];
      const card = document.createElement('button');
      card.className = 'card-nivel' + (deschis ? '' : ' blocat');
      card.disabled = !deschis;
      card.innerHTML = deschis
        ? `<span class="nr">${i + 1}</span><span class="nume">${n.nume}</span>
           <span class="stele">${stele(rez?.stele ?? 0)}</span>
           <span class="timp">${rez ? 'Record: ' + formatTimp(rez.timp) : ''}</span>`
        : `<span class="nr">${i + 1}</span><span class="nume">${n.nume}</span><span class="lacat">🔒</span><span class="timp"></span>`;
      if (deschis) card.addEventListener('click', () => this.actiuni.joacaNivel(i));
      rand.append(card);
    });
    container.append(rand);
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
