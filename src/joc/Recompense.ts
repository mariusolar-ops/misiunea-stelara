// Recompensa supremă (ideea lui Mihai): când ai TOATE accesoriile din magazin și TOATE efectele
// din cufere, primești costumul de aur, titlul „Bogatul anului” și pisica Kiwi (cu coroană de aur).
import type { Progres } from './Salvare';
import { CATALOG } from './Accesorii';
import { EFECTE } from './Efecte';

// Ce se numără pentru recompensă: accesoriile din magazin și efectele (urme, sărituri, aterizări, pași).
// Accesoriile care se găsesc doar în cufere și stilurile de mers sunt „bonus”: nu se numără.
const deNumarat = () => ({
  accesorii: CATALOG.filter((a) => !a.secret && !a.dinCufar),
  efecte: EFECTE.filter((e) => e.categorie !== 'mers'),
});

/** Are tot ce se poate cumpăra și tot ce iese din cufere? (odată câștigată, recompensa rămâne) */
export function areTotul(p: Progres) {
  if (p.titluri.includes('bogat')) return true;
  const { accesorii, efecte } = deNumarat();
  return accesorii.every((a) => p.cumparate.includes(a.id)) && efecte.every((e) => p.efecte.detinute.includes(e.id));
}

/** Cât mai are de adunat (pentru indiciu) */
export function catMaiLipseste(p: Progres) {
  const { accesorii, efecte } = deNumarat();
  return {
    accesorii: accesorii.filter((a) => !p.cumparate.includes(a.id)).length,
    efecte: efecte.filter((e) => !p.efecte.detinute.includes(e.id)).length,
  };
}
