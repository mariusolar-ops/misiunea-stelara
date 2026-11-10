// Salvarea progresului pe telefon (localStorage). Nimic nu pleacă pe internet.
import { CULORI_IMPLICITE, ASPECT_IMPLICIT, type CuloriPersonaj, type AspectPersonaj } from './Personaj';
import type { TipAnimal } from './Animal';
import { EFECTE_IMPLICITE, type StareEfecte } from './Efecte';
import { limbaTelefonului, type Limba } from '../i18n';
import type { Slot } from './Accesorii';

// Dacă browserul nu permite salvarea (ex. mod incognito), jocul merge oricum, doar nu ține minte.

const CHEIE = 'misiunea-stelara-v1';

export interface RezultatNivel {
  stele: number;     // cele mai multe stele obținute (1–3)
  timp: number;      // cel mai bun timp, în secunde
  monede: number;    // cele mai multe monede strânse într-o tură
}

export interface Progres {
  /** Câte niveluri normale sunt deschise, în ordinea de joc (1 = doar primul) */
  deblocate: number;
  /** Rezultatele pe fiecare nivel (după număr: 0, 1, 2...) */
  nivele: Record<number, RezultatNivel>;
  /** Monedele strânse în total – se cheltuie în magazin */
  portofel: number;
  /** Culorile alese pentru personaj */
  culori: CuloriPersonaj;
  /** Băiat/fată, coafura, modelul hainelor */
  aspect: AspectPersonaj;
  /** Animalul de companie și culoarea lui */
  animal: TipAnimal;
  culoareAnimal: number;
  /** Super-puterile pornite (cele cumpărate stau în „cumparate”) */
  puteriActive: string[];
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
  /** Efectele din cufere (urme, sunete de săritură, aterizări) */
  efecte: StareEfecte;
  /** Setările (volum, muzică, controale) */
  setari: Setari;
  /** Seria zilnică */
  zilnic: { ultimaZi: string | null; serie: number };
  /** Titlurile câștigate (după id) și cel ales să apară lângă nume */
  titluri: string[];
  titluAles: string | null;
}

export interface Setari {
  volumEfecte: number;   // 0..100
  volumMuzica: number;   // 0..100
  muzica: boolean;
  /** În ce parte stă joystick-ul */
  joystick: 'stanga' | 'dreapta';
  marimeButoane: 'mici' | 'normale' | 'mari';
  camera: 'lenta' | 'normala' | 'rapida';
  /** Limba jocului */
  limba: Limba;
}

export const SETARI_IMPLICITE: Setari = {
  volumEfecte: 80, volumMuzica: 50, muzica: true, joystick: 'stanga', marimeButoane: 'normale', camera: 'normala',
  limba: limbaTelefonului(),
};

/** Un prieten din clasament: numele lui, cel mai bun timp și stelele pe fiecare nivel */
export interface Prieten {
  nume: string;
  timpi: (number | null)[];
  stele: number[];
  /** Titlul ales de prieten (id), dacă are */
  titlu?: string;
}

function progresNou(): Progres {
  return {
    deblocate: 1, nivele: {}, portofel: 0,
    culori: { ...CULORI_IMPLICITE }, aspect: { ...ASPECT_IMPLICIT },
    animal: 'caine', culoareAnimal: 0xb8692a, puteriActive: [],
    cumparate: [], echipate: {}, sunet: true,
    secrete: [], nume: 'Mihai', prieteni: [],
    efecte: { ...EFECTE_IMPLICITE, detinute: [] }, setari: { ...SETARI_IMPLICITE },
    zilnic: { ultimaZi: null, serie: 0 }, titluri: [], titluAles: null,
  };
}

export function incarca(): Progres {
  try {
    const text = localStorage.getItem(CHEIE);
    if (!text) return progresNou();
    const nou = progresNou();
    const citit = JSON.parse(text);
    const p: Progres = {
      ...nou, ...citit,
      culori: { ...nou.culori, ...citit.culori }, aspect: { ...nou.aspect, ...citit.aspect },
      efecte: { ...nou.efecte, ...citit.efecte }, setari: { ...nou.setari, ...citit.setari },
      zilnic: { ...nou.zilnic, ...citit.zilnic },
    };
    // din versiunea veche: culoarea cățelului se numea altfel
    if (typeof citit.culoareCatel === 'number' && citit.culoareAnimal === undefined) p.culoareAnimal = citit.culoareCatel;
    // înainte erau doar 5 niveluri: cine l-a terminat pe al 5-lea are acum deschis nivelul 6 (cel nou)
    if (p.nivele[4] && p.deblocate < 6) p.deblocate = 6;
    return p;
  } catch {
    return progresNou();
  }
}

export function salveaza(p: Progres) {
  try { localStorage.setItem(CHEIE, JSON.stringify(p)); } catch { /* nu e grav */ }
}

/** Stelele: 1 = ai terminat, 2 = cel puțin jumătate din monede, 3 = toate monedele */
export function calculeazaStele(monede: number, total: number) {
  return monede >= total ? 3 : monede >= total / 2 ? 2 : 1;
}

/**
 * Înregistrează un nivel terminat: păstrează cele mai bune rezultate,
 * deschide nivelul următor și adaugă monedele în portofel (dublu în timpul evenimentului x2).
 * Întoarce true dacă e un timp record.
 */
export function inregistreazaFinal(p: Progres, index: number, timp: number, monede: number, total: number,
  /** Locul nivelului în ordinea de joc (-1 pentru nivelul secret) */ loc: number, nrNivele: number, multiplicator = 1) {
  const vechi = p.nivele[index];
  const stele = calculeazaStele(monede, total);
  const record = !vechi || timp < vechi.timp;
  p.nivele[index] = {
    stele: Math.max(stele, vechi?.stele ?? 0),
    timp: Math.min(timp, vechi?.timp ?? Infinity),
    monede: Math.max(monede, vechi?.monede ?? 0),
  };
  if (loc >= 0) p.deblocate = Math.min(nrNivele, Math.max(p.deblocate, loc + 2));
  const castig = monede * multiplicator;
  p.portofel += castig;
  salveaza(p);
  return { stele, record: record && !!vechi, castig };
}
