// Salvarea progresului pe telefon (localStorage). Nimic nu pleacă pe internet.
import { CULORI_IMPLICITE, type CuloriPersonaj } from './Personaj';
import type { Slot } from './Accesorii';

// Dacă browserul nu permite salvarea (ex. mod incognito), jocul merge oricum, doar nu ține minte.

const CHEIE = 'misiunea-stelara-v1';

export interface RezultatNivel {
  stele: number;     // cele mai multe stele obținute (1–3)
  timp: number;      // cel mai bun timp, în secunde
  monede: number;    // cele mai multe monede strânse într-o tură
}

export interface Progres {
  /** Câte niveluri sunt deschise (1 = doar primul) */
  deblocate: number;
  /** Rezultatele pe fiecare nivel (după număr: 0, 1, 2...) */
  nivele: Record<number, RezultatNivel>;
  /** Monedele strânse în total – se cheltuie în magazin */
  portofel: number;
  /** Culorile alese pentru personaj */
  culori: CuloriPersonaj;
  /** Culoarea cățelului */
  culoareCatel: number;
  /** Accesoriile cumpărate (după id) */
  cumparate: string[];
  /** Ce poartă acum, pe fiecare slot */
  echipate: Partial<Record<Slot, string>>;
  /** Sunetul pornit sau oprit */
  sunet: boolean;
  /** În ce niveluri a găsit steaua secretă (numerele nivelurilor: 0, 1, ...) */
  secrete: number[];
  /** Numele jucătorului (apare în clasament) */
  nume: string;
  /** Scorurile prietenilor, adăugate cu „codul de scor” */
  prieteni: Prieten[];
}

/** Un prieten din clasament: numele lui, cel mai bun timp și stelele pe fiecare nivel */
export interface Prieten {
  nume: string;
  timpi: (number | null)[];
  stele: number[];
}

/** Câte stele secrete există (câte una în fiecare nivel normal) */
export const NR_STELE_SECRETE = 5;

/** A găsit toate stelele secrete? (atunci se deschide nivelul secret și accesoriul secret) */
export function areToateSecretele(p: Progres) {
  return p.secrete.length >= NR_STELE_SECRETE;
}

function progresNou(): Progres {
  return {
    deblocate: 1, nivele: {}, portofel: 0,
    culori: { ...CULORI_IMPLICITE }, culoareCatel: 0xb8692a,
    cumparate: [], echipate: {}, sunet: true,
    secrete: [], nume: 'Mihai', prieteni: [],
  };
}

export function incarca(): Progres {
  try {
    const text = localStorage.getItem(CHEIE);
    if (!text) return progresNou();
    const nou = progresNou();
    const citit = JSON.parse(text);
    return { ...nou, ...citit, culori: { ...nou.culori, ...citit.culori } };
  } catch {
    return progresNou();
  }
}

export function salveaza(p: Progres) {
  try { localStorage.setItem(CHEIE, JSON.stringify(p)); } catch { /* nu e grav */ }
}

/** Stelele: 1 = ai terminat, 2 = cel puțin jumătate din monede, 3 = toate monedele */
export function calculeazaStele(monede: number, total: number) {
  return monede === total ? 3 : monede >= total / 2 ? 2 : 1;
}

/**
 * Înregistrează un nivel terminat: păstrează cele mai bune rezultate,
 * deschide nivelul următor și adaugă monedele în portofel.
 * Întoarce true dacă e un timp record.
 */
export function inregistreazaFinal(p: Progres, index: number, timp: number, monede: number, total: number, nrNivele: number) {
  const vechi = p.nivele[index];
  const stele = calculeazaStele(monede, total);
  const record = !vechi || timp < vechi.timp;
  p.nivele[index] = {
    stele: Math.max(stele, vechi?.stele ?? 0),
    timp: Math.min(timp, vechi?.timp ?? Infinity),
    monede: Math.max(monede, vechi?.monede ?? 0),
  };
  p.deblocate = Math.min(nrNivele, Math.max(p.deblocate, index + 2));
  p.portofel += monede;
  salveaza(p);
  return { stele, record: record && !!vechi };
}
