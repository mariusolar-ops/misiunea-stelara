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

  /** Ecranul „Felicitări!”, cu stele (1–3), timp, monede și butoanele potrivite */
  arataFinal(o: { nume: string; timp: number; monede: number; total: number; stele: number; record: boolean; ultimul: boolean; textUrmator?: string; nota?: string }) {
    el('final-titlu').textContent = o.ultimul ? 'Bravo, cosmonaut Mihai!' : 'Felicitări, Mihai!';
    el('final-nivel').textContent = o.ultimul
      ? 'Ai terminat toate nivelurile! 🚀'
      : `Ai terminat „${o.nume}”`;
    if (o.nota) el('final-nivel').textContent = o.nota;
    el('final-stele').innerHTML = [1, 2, 3]
      .map((i) => `<span class="stea${i <= o.stele ? ' plina' : ''}">★</span>`).join('');
    el('final-timp').textContent = formatTimp(o.timp);
    el('final-monede').textContent = `${o.monede}/${o.total}`;
    el('final-record').textContent = o.record ? 'Record nou de timp!' : '';
    el('buton-urmator').classList.toggle('ascuns', o.ultimul);
    el('buton-urmator').textContent = o.textUrmator ?? 'Nivelul următor';
    this.ecranFinal.classList.add('vizibil');
  }

  ascundeFinal() {
    this.ecranFinal.classList.remove('vizibil');
  }
}
