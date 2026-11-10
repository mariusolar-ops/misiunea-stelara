// Fereastra seriei zilnice: cele 7 zile, ziua de azi și premiul.
import type { PremiuZilnic } from '../joc/Zilnic';
import { MONEDE_PE_ZI } from '../joc/Zilnic';
import { arataCufar } from './AnimatieCufar';
import { sunete } from '../audio/Sunete';
import { t } from '../i18n';

export function arataPremiuZilnic(p: PremiuZilnic, laInchidere: () => void) {
  const strat = document.createElement('div');
  strat.className = 'strat-cufar';
  const zile = Array.from({ length: 7 }, (_, i) => {
    const nr = i + 1;
    const clasa = nr < p.zi ? 'trecuta' : nr === p.zi ? 'azi' : '';
    const premiu = nr === 7 ? '🎁' : `<span class="moneda-mica"></span>${MONEDE_PE_ZI[i]}`;
    return `<div class="zi ${clasa}"><span class="nr-zi">${t('Ziua {n}', { n: nr })}</span><span class="premiu-zi">${premiu}</span>${nr < p.zi ? '<span class="bifa">✓</span>' : ''}</div>`;
  }).join('');
  strat.innerHTML = `
    <div class="premiu zilnic">
      <div class="categorie-premiu">🔥 ${p.serie === 1 ? t('Serie: 1 zi') : t('Serie: {n} zile la rând', { n: p.serie })}</div>
      <div class="nume-premiu">${p.cufar ? t('Ziua 7: cufăr gratis!') : t('Premiul zilei: +{n} monede', { n: p.monede })}</div>
      <div class="rand-zile">${zile}</div>
      <p class="sfat">${t('Intră în fiecare zi! În a 7-a zi primești un cufăr.')}</p>
      <button class="mare">${p.cufar ? t('Deschide cufărul') : t('Ia premiul')}</button>
    </div>`;
  document.body.append(strat);
  strat.querySelector('button')!.addEventListener('click', () => {
    strat.remove();
    if (p.cufar) arataCufar({ efect: p.efect, monede: p.monede }, laInchidere);
    else { sunete.moneda(); laInchidere(); }
  });
}
