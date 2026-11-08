// Interfața de deasupra jocului: monede, cronometru, mesaje și ecranul de final.

const el = (id: string) => document.getElementById(id)!;

/** Transformă secundele în „m:ss” (ex: 83 -> „1:23”) */
export function formatTimp(secunde: number) {
  const m = Math.floor(secunde / 60);
  const s = Math.floor(secunde % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export class Hud {
  private monede = el('nr-monede');
  private cutieMonede = el('hud-monede');
  private timp = el('hud-timp');
  private mesaj = el('mesaj');
  private ecranFinal = el('ecran-final');
  private timerMesaj = 0;

  seteazaMonede(luate: number, total: number, cuEfect = false) {
    this.monede.textContent = `${luate}/${total}`;
    if (cuEfect) {
      // repornim animația de „puls”
      this.cutieMonede.classList.remove('puls');
      void this.cutieMonede.offsetWidth;
      this.cutieMonede.classList.add('puls');
    }
  }

  seteazaTimp(secunde: number) {
    this.timp.textContent = formatTimp(secunde);
  }

  arataMesaj(text: string, secunde = 1.5) {
    this.mesaj.textContent = text;
    this.mesaj.classList.add('vizibil');
    clearTimeout(this.timerMesaj);
    this.timerMesaj = window.setTimeout(() => this.mesaj.classList.remove('vizibil'), secunde * 1000);
  }

  /** Ecranul „Felicitări!”. Stelele: 1 = ai terminat, 2 = jumătate din monede, 3 = toate */
  arataFinal(numeNivel: string, secunde: number, monede: number, total: number) {
    const stele = monede === total ? 3 : monede >= total / 2 ? 2 : 1;
    el('final-nivel').textContent = `Ai terminat „${numeNivel}”`;
    el('final-stele').innerHTML = [1, 2, 3]
      .map((i) => `<span class="stea${i <= stele ? ' plina' : ''}">★</span>`).join('');
    el('final-timp').textContent = formatTimp(secunde);
    el('final-monede').textContent = `${monede}/${total}`;
    this.ecranFinal.classList.add('vizibil');
  }

  ascundeFinal() {
    this.ecranFinal.classList.remove('vizibil');
  }
}
