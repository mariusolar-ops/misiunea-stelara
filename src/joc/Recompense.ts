// Recompensa supremă (ideea lui Mihai): când ai TOATE accesoriile din magazin și TOATE efectele
// din cufere, primești costumul de aur, titlul „Bogatul anului” și pisica Kiwi (cu coroană de aur).
import type { Progres } from './Salvare';
import { CATALOG } from './Accesorii';
import { EFECTE } from './Efecte';

/** Are tot ce se poate cumpăra și tot ce iese din cufere? */
export function areTotul(p: Progres) {
  const toateAccesoriile = CATALOG.filter((a) => !a.secret).every((a) => p.cumparate.includes(a.id));
  const toateEfectele = EFECTE.every((e) => p.efecte.detinute.includes(e.id));
  return toateAccesoriile && toateEfectele;
}

/** Cât mai are de adunat (pentru indiciu) */
export function catMaiLipseste(p: Progres) {
  return {
    accesorii: CATALOG.filter((a) => !a.secret && !p.cumparate.includes(a.id)).length,
    efecte: EFECTE.filter((e) => !p.efecte.detinute.includes(e.id)).length,
  };
}
