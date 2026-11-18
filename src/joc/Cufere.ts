// Ce iese dintr-un cufăr: un efect (urmă, săritură, aterizare, pași), un stil de mers
// sau un accesoriu care se găsește doar în cufere. Mereu ceva ce NU ai încă.
import type { Progres } from './Salvare';
import { EFECTE, type Efect } from './Efecte';
import { CATALOG, type Accesoriu } from './Accesorii';

export interface Castig { efect?: Efect; accesoriu?: Accesoriu }

/** Câte lucruri mai sunt de găsit în cufere */
export function ramaseInCufere(p: Progres) {
  const efecte = EFECTE.filter((e) => !p.efecte.detinute.includes(e.id)).length;
  const accesorii = CATALOG.filter((a) => a.dinCufar && !p.cumparate.includes(a.id)).length;
  return efecte + accesorii;
}

/** Deschide un cufăr: alege la întâmplare ceva ce nu ai și ți-l și pune. null = le ai pe toate */
export function deschideCufarComplet(p: Progres): Castig | null {
  const efecte = EFECTE.filter((e) => !p.efecte.detinute.includes(e.id));
  const accesorii = CATALOG.filter((a) => a.dinCufar && !p.cumparate.includes(a.id));
  const total = efecte.length + accesorii.length;
  if (total === 0) return null;
  const i = Math.floor(Math.random() * total);
  if (i < efecte.length) {
    const e = efecte[i];
    p.efecte.detinute.push(e.id);
    p.efecte[e.categorie] = e.id;
    return { efect: e };
  }
  const a = accesorii[i - efecte.length];
  p.cumparate.push(a.id);
  p.echipate[a.slot] = a.id;
  return { accesoriu: a };
}
