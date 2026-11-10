// Evenimentul „Monede x2”: în primele 15 minute din fiecare oră, monedele strânse valorează dublu.
// Merge după ceasul telefonului, deci și fără internet.
import { t } from '../i18n';

const DURATA_MINUTE = 15;

/** Este acum eveniment? */
export function esteEveniment(acum = new Date()) {
  return acum.getMinutes() < DURATA_MINUTE;
}

/** Câte secunde mai sunt până se termină evenimentul (dacă e acum) sau până începe următorul */
export function secundePanaLaSchimbare(acum = new Date()) {
  const sec = acum.getMinutes() * 60 + acum.getSeconds();
  return esteEveniment(acum) ? DURATA_MINUTE * 60 - sec : 3600 - sec;
}

/** Text scurt pentru meniu: „🔥 Monede x2! Încă 12:34” sau „⏰ Monede x2 peste 34 min” */
export function textEveniment(acum = new Date()) {
  const s = secundePanaLaSchimbare(acum);
  if (esteEveniment(acum)) {
    const m = Math.floor(s / 60), r = s % 60;
    return '🔥 ' + t('Monede x2! Încă {timp}', { timp: `${m}:${r.toString().padStart(2, '0')}` });
  }
  const m = Math.ceil(s / 60);
  return '⏰ ' + t('Monede x2 peste {m} min', { m });
}
