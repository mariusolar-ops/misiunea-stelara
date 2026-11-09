// „Codul de scor”: un text scurt cu numele și cele mai bune rezultate ale jucătorului.
// Mihai îl trimite unui prieten (de ex. pe WhatsApp), iar prietenul îl adaugă în jocul lui.
// Jocul NU trimite nimic singur pe internet – codul îl trimite doar omul, dacă vrea.
//
// Formatul: MS-<date>-<control>
//   <date> = „nume|timpi|stele” codat în base64 (timpii în zecimi de secundă)
//   <control> = 2 caractere care prind greșelile de copiere
import type { Prieten, Progres } from './Salvare';

import { NIVELE } from '../nivele';

// câte niveluri sunt în cod (codurile vechi, cu mai puține, merg în continuare)
const NR_NIVELE = NIVELE.length;
const LUNGIME_NUME = 14;

/** Păstrează doar litere (și cu diacritice), cifre și spații; maxim 14 caractere */
export function curataNume(text: string) {
  return text.replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim().slice(0, LUNGIME_NUME);
}

function control(text: string) {
  let h = 7;
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) % 1296; // 36 * 36
  return h.toString(36).padStart(2, '0').toUpperCase();
}

function inBase64(text: string) {
  const octeti = new TextEncoder().encode(text);
  let bin = '';
  octeti.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function dinBase64(text: string) {
  const bin = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

/** Codul jucătorului de pe telefonul ăsta */
export function codulMeu(p: Progres) {
  const timpi = Array.from({ length: NR_NIVELE }, (_, i) => {
    const t = p.nivele[i]?.timp;
    return t === undefined ? '' : String(Math.round(t * 10));
  });
  const stele = Array.from({ length: NR_NIVELE }, (_, i) => p.nivele[i]?.stele ?? 0);
  const date = `${curataNume(p.nume) || 'Jucător'}|${timpi.join(',')}|${stele.join('')}`;
  const b64 = inBase64(date);
  return `MS-${b64}-${control(b64)}`;
}

/** Citește codul unui prieten. Întoarce null dacă e greșit (copiat incomplet, inventat etc.) */
export function citesteCod(cod: string): Prieten | null {
  try {
    const m = cod.trim().match(/^MS-([A-Za-z0-9_-]+)-([0-9A-Z]{2})$/);
    if (!m || control(m[1]) !== m[2]) return null;
    const [nume, timpiText, steleText] = dinBase64(m[1]).split('|');
    const numeCurat = curataNume(nume ?? '');
    if (!numeCurat || timpiText === undefined || steleText === undefined) return null;
    const timpi = timpiText.split(',').slice(0, NR_NIVELE).map((t) => {
      const n = Number(t);
      return t === '' || !Number.isFinite(n) || n <= 0 || n > 360000 ? null : n / 10;
    });
    while (timpi.length < NR_NIVELE) timpi.push(null);
    const stele = Array.from({ length: NR_NIVELE }, (_, i) => Math.min(3, Math.max(0, Number(steleText[i]) || 0)));
    return { nume: numeCurat, timpi, stele };
  } catch {
    return null;
  }
}
