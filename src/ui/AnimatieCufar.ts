// Deschiderea unui cufăr: îl atingi de 3 ori. La fiecare atingere cufărul tremură, crapă
// și iese încă o rază de lumină. La a treia atingere se deschide și apare premiul.
// O folosesc atât magazinul de cufere, cât și cufărul gratis din ziua a 7-a a seriei zilnice.
import { NUME_CATEGORII, type Efect } from '../joc/Efecte';
import { sunete } from '../audio/Sunete';
import { t } from '../i18n';

/** Premiul: un efect nou, sau (dacă le ai pe toate) monede */
export interface PremiuCufar { efect?: Efect | null; monede?: number }

// crăpăturile (linii în zig-zag), una nouă la fiecare atingere
const CRAPATURI = [
  'M50 10 L44 28 L54 40 L46 56',
  'M20 40 L34 46 L30 60 L42 70',
  'M82 36 L68 48 L74 62 L62 76',
];

export function arataCufar(premiu: PremiuCufar, laInchidere: () => void) {
  const strat = document.createElement('div');
  strat.className = 'strat-cufar';
  strat.innerHTML = `
    <div class="cufar-3-atingeri">
      <div class="raze"></div>
      <div class="cufar-mare-static">🎁
        <svg class="crapaturi" viewBox="0 0 100 100" preserveAspectRatio="none"></svg>
      </div>
      <div class="indiciu-cufar">${t('Atinge cufărul!')} <b>0/3</b></div>
    </div>`;
  document.body.append(strat);
  let atingeri = 0;
  const cufar = strat.querySelector<HTMLElement>('.cufar-mare-static')!;
  const raze = strat.querySelector<HTMLElement>('.raze')!;
  const svg = strat.querySelector('svg')!;
  const contor = strat.querySelector('b')!;
  strat.querySelector('.cufar-3-atingeri')!.addEventListener('click', () => {
    if (atingeri >= 3) return;
    atingeri++;
    contor.textContent = `${atingeri}/3`;
    // tremură
    cufar.classList.remove('tremura-o-data'); void cufar.offsetWidth; cufar.classList.add('tremura-o-data');
    // o crăpătură nouă
    svg.insertAdjacentHTML('beforeend', `<path d="${CRAPATURI[atingeri - 1]}" />`);
    // o rază de lumină nouă (rotită diferit)
    const r = document.createElement('div');
    r.className = 'raza';
    r.style.transform = `rotate(${[-35, 25, 90][atingeri - 1]}deg)`;
    raze.append(r);
    // sunet: tot mai sus
    sunete.crapa(atingeri);
    if (atingeri === 3) setTimeout(() => deschide(), 450);
  });

  function deschide() {
    sunete.cufar();
    strat.querySelector('.cufar-3-atingeri')!.classList.add('explodeaza');
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
    }, 600);
  }
}
