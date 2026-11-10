// Seria zilnică: dacă intri în joc în zile la rând, primești un premiu în fiecare zi,
// iar în a 7-a zi un cufăr gratis. Dacă sari o zi, seria o ia de la capăt.
// Totul după ceasul telefonului – fără internet.
import { salveaza, type Progres } from './Salvare';
import { deschideCufar, type Efect } from './Efecte';

/** Monedele pentru zilele 1–6 (ziua 7 = cufăr) */
export const MONEDE_PE_ZI = [10, 15, 20, 25, 30, 40];
const MONEDE_IN_LOC_DE_CUFAR = 100;

export interface StareZilnica {
  /** Ultima zi în care ai primit premiul (ex. „2026-11-10”) */
  ultimaZi: string | null;
  /** Câte zile la rând */
  serie: number;
}

export interface PremiuZilnic {
  /** Ziua din ciclul de 7 (1..7) */
  zi: number;
  serie: number;
  monede: number;
  /** Doar în ziua 7: efectul din cufăr (null dacă le ai pe toate – atunci primești monede) */
  cufar: boolean;
  efect: Efect | null;
}

function textZi(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Se apelează la pornirea jocului. Dacă azi n-ai primit încă premiul, îl dă și îl salvează.
 * Întoarce premiul (ca să-l arătăm) sau null dacă l-ai primit deja azi.
 */
export function verificaZiua(p: Progres, acum = new Date()): PremiuZilnic | null {
  const azi = textZi(acum);
  const z = p.zilnic;
  if (z.ultimaZi === azi) return null;
  const ieri = new Date(acum);
  ieri.setDate(ieri.getDate() - 1);
  z.serie = z.ultimaZi === textZi(ieri) ? z.serie + 1 : 1;
  z.ultimaZi = azi;
  const zi = ((z.serie - 1) % 7) + 1;
  const premiu: PremiuZilnic = { zi, serie: z.serie, monede: 0, cufar: zi === 7, efect: null };
  if (zi === 7) {
    premiu.efect = deschideCufar(p.efecte);
    if (!premiu.efect) premiu.monede = MONEDE_IN_LOC_DE_CUFAR;
  } else {
    premiu.monede = MONEDE_PE_ZI[zi - 1];
  }
  p.portofel += premiu.monede;
  salveaza(p);
  return premiu;
}
