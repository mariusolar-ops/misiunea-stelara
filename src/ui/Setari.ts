// Ecranul „Setări”: volumul efectelor și al muzicii, muzica pornită/oprită,
// în ce parte stă joystick-ul, cât de mari sunt butoanele și cât de repede se rotește camera.
import { salveaza, type Progres, type Setari } from '../joc/Salvare';
import { seteazaVolumEfecte, sunete } from '../audio/Sunete';
import { seteazaMuzica, seteazaVolumMuzica } from '../audio/Muzica';

const container = document.getElementById('meniu')!;

/** Aplică setările peste tot (sunet, muzică, aranjarea butoanelor) */
export function aplicaSetari(s: Setari) {
  seteazaVolumEfecte(s.volumEfecte / 100);
  seteazaVolumMuzica(s.volumMuzica / 100);
  seteazaMuzica(s.muzica);
  const b = document.body.classList;
  b.toggle('joystick-dreapta', s.joystick === 'dreapta');
  b.remove('butoane-mici', 'butoane-mari');
  if (s.marimeButoane !== 'normale') b.add(`butoane-${s.marimeButoane}`);
}

/** Cât de repede se rotește camera la tras cu degetul */
export function sensibilitateCamera(s: Setari) {
  return s.camera === 'lenta' ? 0.0035 : s.camera === 'rapida' ? 0.009 : 0.006;
}

export class EcranSetari {
  constructor(private progres: Progres, private laIesire: () => void, private laSchimbare: () => void) {}

  arata() {
    const s = this.progres.setari;
    const optiuni = <K extends keyof Setari>(cheie: K, lista: [Setari[K], string][]) =>
      lista.map(([v, text]) => `<button class="optiune ${s[cheie] === v ? 'aleasa' : ''}" data-cheie="${cheie}" data-valoare="${v}">${text}</button>`).join('');

    container.innerHTML = `
      <h2>⚙️ Setări</h2>
      <div class="setari">
        <label class="rand-setare"><span>🔊 Volum efecte</span>
          <input type="range" min="0" max="100" step="5" value="${s.volumEfecte}" data-volum="volumEfecte" /><b>${s.volumEfecte}%</b></label>
        <label class="rand-setare"><span>🎵 Volum muzică</span>
          <input type="range" min="0" max="100" step="5" value="${s.volumMuzica}" data-volum="volumMuzica" /><b>${s.volumMuzica}%</b></label>
        <div class="rand-setare"><span>🎶 Muzică</span><div class="bule">${optiuni('muzica', [[true, 'Pornită'], [false, 'Oprită']])}</div></div>
        <div class="rand-setare"><span>🕹️ Joystick</span><div class="bule">${optiuni('joystick', [['stanga', '⬅️ În stânga'], ['dreapta', 'În dreapta ➡️']])}</div></div>
        <div class="rand-setare"><span>🔘 Butoane</span><div class="bule">${optiuni('marimeButoane', [['mici', 'Mici'], ['normale', 'Normale'], ['mari', 'Mari']])}</div></div>
        <div class="rand-setare"><span>🎥 Cameră</span><div class="bule">${optiuni('camera', [['lenta', 'Lentă'], ['normala', 'Normală'], ['rapida', 'Rapidă']])}</div></div>
      </div>`;

    const inapoi = document.createElement('button');
    inapoi.className = 'mic-buton inapoi';
    inapoi.textContent = '‹ Înapoi';
    inapoi.addEventListener('click', () => { sunete.click(); this.laIesire(); });
    container.append(inapoi);

    // glisoarele de volum: se aplică pe loc, cu un sunet de probă la final
    container.querySelectorAll<HTMLInputElement>('input[type=range]').forEach((r) => {
      const cheie = r.dataset.volum as 'volumEfecte' | 'volumMuzica';
      r.addEventListener('input', () => {
        s[cheie] = Number(r.value);
        (r.nextElementSibling as HTMLElement).textContent = `${r.value}%`;
        aplicaSetari(s);
      });
      r.addEventListener('change', () => { salveaza(this.progres); if (cheie === 'volumEfecte') sunete.moneda(); });
    });

    container.querySelectorAll<HTMLButtonElement>('button.optiune').forEach((b) =>
      b.addEventListener('click', () => {
        const cheie = b.dataset.cheie as keyof Setari;
        const v = b.dataset.valoare!;
        (s as unknown as Record<string, unknown>)[cheie] = v === 'true' ? true : v === 'false' ? false : v;
        aplicaSetari(s);
        salveaza(this.progres);
        this.laSchimbare();
        sunete.click();
        this.arata();
      }));
  }
}
