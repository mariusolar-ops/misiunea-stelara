// Salvarea progresului pe telefon (localStorage). Nimic nu pleacă pe internet.
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
}

function progresNou(): Progres {
  return { deblocate: 1, nivele: {}, portofel: 0 };
}

export function incarca(): Progres {
  try {
    const text = localStorage.getItem(CHEIE);
    if (!text) return progresNou();
    return { ...progresNou(), ...JSON.parse(text) };
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
