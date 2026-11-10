// Ecranul „Titluri”: toate titlurile, câștigate sau nu, și alegerea celui care apare lângă nume.
// Tot aici e și anunțul „🏅 Titlu nou!”.
import { salveaza, type Progres } from '../joc/Salvare';
import { TITLURI, type Titlu } from '../joc/Titluri';
import { sunete } from '../audio/Sunete';

const container = document.getElementById('meniu')!;

export class EcranTitluri {
  constructor(private progres: Progres, private laIesire: () => void) {}

  arata() {
    const p = this.progres;
    container.innerHTML = `<h2>🏅 Titluri</h2><p class="sfat">Atinge un titlu câștigat ca să apară lângă numele tău.</p>`;
    const grila = document.createElement('div');
    grila.className = 'grila-titluri';
    for (const t of TITLURI) {
      const are = p.titluri.includes(t.id);
      const b = document.createElement('button');
      b.className = 'card-titlu' + (are ? '' : ' blocat') + (p.titluAles === t.id ? ' ales' : '');
      b.disabled = !are;
      b.innerHTML = `<span class="emoji">${are ? t.emoji : '🔒'}</span><span class="nume">${t.nume}</span><span class="cum">${are ? (p.titluAles === t.id ? 'Ales ✓' : 'Câștigat') : t.cum}</span>`;
      b.addEventListener('click', () => { p.titluAles = t.id; salveaza(p); sunete.click(); this.arata(); });
      grila.append(b);
    }
    container.append(grila);
    const inapoi = document.createElement('button');
    inapoi.className = 'mic-buton inapoi';
    inapoi.textContent = '‹ Înapoi';
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
    el.innerHTML = `<span class="emoji">🏅</span><div><small>${titluri.map((t) => t.emoji).join(' ')}</small><b>Ai câștigat ${titluri.length} titluri noi!</b></div>`;
    document.body.append(el);
    sunete.secret();
    setTimeout(() => el.remove(), 4000);
    return;
  }
  titluri.forEach((t, i) => setTimeout(() => {
    const el = document.createElement('div');
    el.className = 'anunt-titlu';
    el.innerHTML = `<span class="emoji">${t.emoji}</span><div><small>🏅 Titlu nou!</small><b>${t.nume}</b></div>`;
    document.body.append(el);
    sunete.secret();
    setTimeout(() => el.remove(), 3500);
  }, i * 3700));
}
