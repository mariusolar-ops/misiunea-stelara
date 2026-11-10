// Titlurile: le câștigi pentru realizări (primul nivel, 5 niveluri, toate nivelurile etc.)
// Titlul ales apare lângă numele tău în meniu, la final și în clasamentul prietenilor.
import type { Progres } from './Salvare';
import { ORDINE_NORMALA, SECRETE } from '../nivele';

export interface Titlu {
  id: string;
  nume: string;
  emoji: string;
  /** Cum îl câștigi (apare la titlurile încă blocate) */
  cum: string;
  areTitlul: (p: Progres) => boolean;
}

const terminate = (p: Progres) => ORDINE_NORMALA.filter((i) => p.nivele[i]).length;
const toateStelele = (p: Progres, g: number) => SECRETE[g].nivele.every((n) => p.secrete.includes(n));

export const TITLURI: Titlu[] = [
  { id: 'incepator', nume: 'Cosmonaut începător', emoji: '🚀', cum: 'Termină primul nivel', areTitlul: (p) => terminate(p) >= 1 },
  { id: 'explorator', nume: 'Explorator', emoji: '🧭', cum: 'Termină 5 niveluri', areTitlul: (p) => terminate(p) >= 5 },
  { id: 'stapan', nume: 'Stăpânul galaxiei', emoji: '👑', cum: 'Termină toate nivelurile', areTitlul: (p) => terminate(p) >= ORDINE_NORMALA.length },
  { id: 'vanator', nume: 'Vânător de stele', emoji: '🔮', cum: 'Găsește toate stelele mov', areTitlul: (p) => toateStelele(p, 0) },
  { id: 'auriu', nume: 'Căutător de aur', emoji: '🌟', cum: 'Găsește toate stelele de aur', areTitlul: (p) => toateStelele(p, 1) },
  { id: 'perfect', nume: 'Perfecționist', emoji: '💎', cum: 'Ia 3 stele la 5 niveluri', areTitlul: (p) => Object.values(p.nivele).filter((r) => r.stele >= 3).length >= 5 },
  { id: 'colectionar', nume: 'Colecționar', emoji: '🎁', cum: 'Adună 10 efecte din cufere', areTitlul: (p) => p.efecte.detinute.length >= 10 },
  { id: 'fidel', nume: 'Prieten fidel', emoji: '🔥', cum: 'Intră în joc 7 zile la rând', areTitlul: (p) => p.zilnic.serie >= 7 },
];

export function cautaTitlu(id: string | null | undefined) {
  return TITLURI.find((t) => t.id === id);
}

/**
 * Verifică ce titluri noi a câștigat jucătorul. Le adaugă în progres și le întoarce
 * (ca să le anunțăm). Dacă n-avea niciun titlu ales, îl alege automat pe primul nou.
 */
export function titluriNoi(p: Progres): Titlu[] {
  const noi = TITLURI.filter((t) => !p.titluri.includes(t.id) && t.areTitlul(p));
  for (const t of noi) p.titluri.push(t.id);
  if (noi.length && !p.titluAles) p.titluAles = noi[0].id;
  return noi;
}
