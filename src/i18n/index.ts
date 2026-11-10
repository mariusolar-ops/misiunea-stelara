// Traducerile jocului. Textul „cheie” e chiar textul în română,
// iar în traduceri.ts e același text în engleză, franceză, spaniolă și germană.
// În texte pot fi „locuri libere” ca {n} sau {nume}, completate la afișare.
import { TRADUCERI } from './traduceri';

export type Limba = 'ro' | 'en' | 'fr' | 'es' | 'de';

export const LIMBI: { cod: Limba; nume: string; steag: string }[] = [
  { cod: 'ro', nume: 'Română', steag: '🇷🇴' },
  { cod: 'en', nume: 'English', steag: '🇬🇧' },
  { cod: 'fr', nume: 'Français', steag: '🇫🇷' },
  { cod: 'es', nume: 'Español', steag: '🇪🇸' },
  { cod: 'de', nume: 'Deutsch', steag: '🇩🇪' },
];

const POZITIE: Record<Exclude<Limba, 'ro'>, number> = { en: 0, fr: 1, es: 2, de: 3 };

let limba: Limba = 'ro';

/** Limba telefonului, dacă o avem; altfel româna */
export function limbaTelefonului(): Limba {
  const cod = (navigator.language || 'ro').slice(0, 2) as Limba;
  return LIMBI.some((l) => l.cod === cod) ? cod : 'ro';
}

export function limbaCurenta() { return limba; }

/** Schimbă limba și traduce textele fixe din pagină (cele cu atributul data-t) */
export function seteazaLimba(l: Limba) {
  limba = l;
  document.documentElement.lang = l;
  document.querySelectorAll<HTMLElement>('[data-t]').forEach((el) => { el.textContent = t(el.dataset.t!); });
  document.querySelectorAll<HTMLElement>('[data-t-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.tAria!)));
}

/** Traduce un text (scris în română), completând locurile libere {x} */
export function t(text: string, param?: Record<string, string | number>) {
  let r = limba === 'ro' ? text : TRADUCERI[text]?.[POZITIE[limba]] ?? text;
  if (param) for (const [k, v] of Object.entries(param)) r = r.split(`{${k}}`).join(String(v));
  return r;
}
