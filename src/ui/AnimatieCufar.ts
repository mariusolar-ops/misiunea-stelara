// Animația de deschidere a unui cufăr: cufărul tremură, apoi „explodează” și apare premiul.
// O folosesc atât magazinul de cufere, cât și cufărul gratis din ziua a 7-a a seriei zilnice.
import { NUME_CATEGORII, type Efect } from '../joc/Efecte';
import { sunete } from '../audio/Sunete';
import { t } from '../i18n';

/** Premiul: un efect nou, sau (dacă le ai pe toate) monede */
export interface PremiuCufar { efect?: Efect | null; monede?: number }

export function arataCufar(premiu: PremiuCufar, laInchidere: () => void) {
  sunete.cufar();
  const strat = document.createElement('div');
  strat.className = 'strat-cufar';
  strat.innerHTML = `<div class="cufar-mare">🎁</div>`;
  document.body.append(strat);
  setTimeout(() => {
    const e = premiu.efect;
    strat.innerHTML = e
      ? `<div class="premiu">
          <div class="emoji-premiu">${e.emoji}</div>
          <div class="categorie-premiu">${t(NUME_CATEGORII[e.categorie])}: ${t('nou!')}</div>
          <div class="nume-premiu">${t(e.nume)}</div>
          <button class="mare">${t('Super!')}</button>
        </div>`
      : `<div class="premiu">
          <div class="emoji-premiu">🪙</div>
          <div class="categorie-premiu">${t('Ai deja toate efectele!')}</div>
          <div class="nume-premiu">${t('+{n} monede', { n: premiu.monede ?? 0 })}</div>
          <button class="mare">${t('Super!')}</button>
        </div>`;
    if (e?.categorie === 'saritura') sunete.sarituraVarianta(e.id.slice(2));
    if (e?.categorie === 'pasi') { sunete.pas(e.id.slice(2), true); setTimeout(() => sunete.pas(e.id.slice(2), false), 280); }
    strat.querySelector('button')!.addEventListener('click', () => { strat.remove(); laInchidere(); });
  }, 1100);
}
