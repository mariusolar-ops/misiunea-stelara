// Ecranul „Titluri”: toate titlurile, câștigate sau nu, și alegerea celui care apare lângă nume.
// Tot aici e și anunțul „🏅 Titlu nou!”.
import { salveaza, type Progres } from '../joc/Salvare';
import { TITLURI, type Titlu } from '../joc/Titluri';
import { sunete } from '../audio/Sunete';
import { t } from '../i18n';

const container = document.getElementById('meniu')!;

export class EcranTitluri {
  constructor(private progres: Progres, private laIesire: () => void) {}

  arata() {
    const p = this.progres;
    container.innerHTML = `<h2>🏅 ${t('Titluri')}</h2><p class="sfat">${t('Atinge un titlu câștigat ca să apară lângă numele tău.')}</p>`;
    const grila = document.createElement('div');
    grila.className = 'grila-titluri';
    for (const ti of TITLURI) {
      const are = p.titluri.includes(ti.id);
      const b = document.createElement('button');
      b.className = 'card-titlu' + (are ? '' : ' blocat') + (p.titluAles === ti.id ? ' ales' : '');
      b.disabled = !are;
      b.innerHTML = `<span class="emoji">${are ? ti.emoji : '🔒'}</span><span class="nume">${t(ti.nume)}</span><span class="cum">${are ? (p.titluAles === ti.id ? t('Ales') + ' ✓' : t('Câștigat')) : t(ti.cum)}</span>`;
      b.addEventListener('click', () => { p.titluAles = ti.id; salveaza(p); sunete.click(); this.arata(); });
      grila.append(b);
    }
    container.append(grila);
    const inapoi = document.createElement('button');
    inapoi.className = 'mic-buton inapoi';
    inapoi.textContent = '‹ ' + t('Înapoi');
    inapoi.addEventListener('click', () => { sunete.click(); this.laIesire(); });
    container.append(inapoi);
  }
}

/** Anunțul care apare sus, câteva secunde, când câștigi un titlu */
export function anuntaTitluri(titluri: Titlu[]) {
  // dacă sunt multe deodată (ex. prima pornire după o actualizare), le anunțăm pe toate într-unul singur
  if (titluri.length > 2) {
    const el = document.createElement('div');
    el.className = 'anunt-titlu';
    el.innerHTML = `<span class="emoji">🏅</span><div><small>${titluri.map((t) => t.emoji).join(' ')}</small><b>${t('Ai câștigat {n} titluri noi!', { n: titluri.length })}</b></div>`;
    document.body.append(el);
    sunete.secret();
    setTimeout(() => el.remove(), 4000);
    return;
  }
  titluri.forEach((ti, i) => setTimeout(() => {
    const el = document.createElement('div');
    el.className = 'anunt-titlu';
    el.innerHTML = `<span class="emoji">${ti.emoji}</span><div><small>🏅 ${t('Titlu nou!')}</small><b>${t(ti.nume)}</b></div>`;
    document.body.append(el);
    sunete.secret();
    setTimeout(() => el.remove(), 3500);
  }, i * 3700));
}

/** Fereastra mare pentru recompensa supremă: costum de aur + titlu + Kiwi */
export function anuntaRecompensaSuprema() {
  const strat = document.createElement('div');
  strat.className = 'strat-cufar';
  strat.innerHTML = `
    <div class="premiu">
      <div class="emoji-premiu">👑</div>
      <div class="categorie-premiu">${t('Ai adunat TOT!')}</div>
      <div class="nume-premiu">${t('Costumul de aur, titlul „Bogatul anului” și pisica Kiwi sunt ale tale!')}</div>
      <p class="sfat">${t('Le găsești la Personalizează → Stil și Animal.')}</p>
      <button class="mare">${t('Super!')}</button>
    </div>`;
  document.body.append(strat);
  sunete.cufar();
  strat.querySelector('button')!.addEventListener('click', () => strat.remove());
}
