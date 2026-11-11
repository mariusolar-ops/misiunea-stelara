// Modul developer (pentru Mihai): se deschide atingând de 5 ori „Mihai:” în meniu și scriind codul secret.
// Deblochează tot, dă monede, zbor nelimitat, invincibilitate și contorul de FPS.
import { salveaza, type Progres } from '../joc/Salvare';
import { ORDINE_NORMALA, SECRETE } from '../nivele';
import { sunete } from '../audio/Sunete';
import { t } from '../i18n';

const container = document.getElementById('meniu')!;

// codul nu e scris direct, ca să nu-l vadă oricine se uită în cod (e doar o mică „încuietoare”)
const HASH_COD = '512281ea';
function hash(text: string) {
  let h = 0x811c9dc5;
  for (const c of text.trim().toUpperCase()) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, '0');
}

export class EcranDeveloper {
  private mesaj = '';
  constructor(private p: Progres, private laSchimbare: () => void, private laIesire: () => void) {}

  arata() {
    if (!this.p.dev.activ) { this.ceCod(); return; }
    const d = this.p.dev;
    container.innerHTML = `
      <div class="panou-dev">
        <h2>👨‍💻 ${t('Mod developer')}</h2>
        <div class="grila-dev">
          <button class="mic-buton" data-a="tot">🔓 ${t('Deblochează tot')}</button>
          <button class="mic-buton" data-a="bani">🪙 +1000 ${t('monede')}</button>
          <button class="mic-buton ${d.zborInfinit ? 'pornit' : ''}" data-a="zbor">🕊️ ${t('Zbor nelimitat')}</button>
          <button class="mic-buton ${d.invincibil ? 'pornit' : ''}" data-a="invincibil">🛡️ ${t('Invincibil')}</button>
          <button class="mic-buton ${d.fps ? 'pornit' : ''}" data-a="fps">📊 FPS</button>
          <button class="mic-buton" data-a="opreste">⛔ ${t('Oprește modul developer')}</button>
        </div>
        <div class="mesaj-dev">${this.mesaj}</div>
      </div>`;
    this.butonInapoi();
    container.querySelectorAll<HTMLButtonElement>('[data-a]').forEach((b) => b.addEventListener('click', () => this.actiune(b.dataset.a!)));
  }

  private ceCod() {
    container.innerHTML = `
      <div class="panou-dev">
        <h2>🔐 ${t('Cod secret')}</h2>
        <input type="password" maxlength="20" autocomplete="off" />
        <button class="mare">${t('Intră')}</button>
        <div class="mesaj-dev">${this.mesaj}</div>
      </div>`;
    this.butonInapoi();
    const camp = container.querySelector('input')!;
    const incearca = () => {
      if (hash(camp.value) === HASH_COD) {
        this.p.dev.activ = true;
        salveaza(this.p);
        sunete.secret();
        this.mesaj = t('Bun venit, developer!');
        this.laSchimbare();
      } else {
        sunete.cadere();
        this.mesaj = t('Cod greșit!');
      }
      this.arata();
    };
    container.querySelector('button.mare')!.addEventListener('click', incearca);
    camp.addEventListener('keydown', (e) => { if (e.key === 'Enter') incearca(); });
  }

  private butonInapoi() {
    const b = document.createElement('button');
    b.className = 'mic-buton inapoi';
    b.textContent = '‹ ' + t('Înapoi');
    b.addEventListener('click', () => { sunete.click(); this.laIesire(); });
    container.append(b);
  }

  private actiune(a: string) {
    const p = this.p, d = p.dev;
    sunete.click();
    switch (a) {
      case 'tot':
        p.deblocate = ORDINE_NORMALA.length;
        for (const s of SECRETE) for (const n of s.nivele) if (!p.secrete.includes(n)) p.secrete.push(n);
        if (!p.realizari.includes('portale-perfect')) p.realizari.push('portale-perfect');
        if (!p.cumparate.includes('aripi')) p.cumparate.push('aripi');
        this.mesaj = t('Toate nivelurile sunt deschise!');
        break;
      case 'bani': p.portofel += 1000; sunete.moneda(); this.mesaj = `+1000 🪙 (${p.portofel})`; break;
      case 'zbor': d.zborInfinit = !d.zborInfinit; this.mesaj = ''; break;
      case 'invincibil': d.invincibil = !d.invincibil; this.mesaj = ''; break;
      case 'fps': d.fps = !d.fps; this.mesaj = ''; break;
      case 'opreste': d.activ = false; d.zborInfinit = false; d.invincibil = false; this.mesaj = ''; salveaza(p); this.laSchimbare(); this.laIesire(); return;
    }
    salveaza(p);
    this.laSchimbare();
    this.arata();
  }
}
