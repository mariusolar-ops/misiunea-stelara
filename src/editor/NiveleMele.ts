// „Nivelurile mele”: nivelurile făcute de jucător în constructor.
// Stau DOAR pe telefon (localStorage). Nu se trimit nicăieri și nu se pot posta.
import type { DefinitieNivel, Punct } from '../nivele/tipuri';
import type { DefinitiePlatforma } from '../lume/Platforma';
import type { Tema } from '../lume/Decor';
import { bloc, trambulina, lava, gheata, dispare, mobila, perete, CULORI as C } from '../nivele/ajutoare';

const CHEIE = 'misiunea-stelara-nivele-mele';
export const MAX_NIVELE = 8;
export const MAX_OBIECTE = 300;
/** Mărimea unui pătrățel din grila constructorului */
export const U = 2;

export type Unealta = 'bloc' | 'trambulina' | 'lava' | 'gheata' | 'dispare' | 'mobil' | 'perete' | 'moneda' | 'steag' | 'final' | 'sterge';

export const UNELTE: { id: Unealta; emoji: string; nume: string }[] = [
  { id: 'bloc', emoji: '🟦', nume: 'Bloc' },
  { id: 'trambulina', emoji: '🟩', nume: 'Trambulină' },
  { id: 'lava', emoji: '🔥', nume: 'Lavă' },
  { id: 'gheata', emoji: '🧊', nume: 'Gheață' },
  { id: 'dispare', emoji: '🩷', nume: 'Bloc care dispare' },
  { id: 'mobil', emoji: '↔️', nume: 'Platformă mobilă' },
  { id: 'perete', emoji: '🧲', nume: 'Perete magnetic' },
  { id: 'moneda', emoji: '🪙', nume: 'Monedă' },
  { id: 'steag', emoji: '🚩', nume: 'Steag' },
  { id: 'final', emoji: '🌀', nume: 'Portal de final' },
  { id: 'sterge', emoji: '🧽', nume: 'Radieră' },
];

/** Obiectele „mici” (monede, steaguri, portal) stau deasupra blocurilor, în același pătrățel */
export const OBIECTE_MICI: Unealta[] = ['moneda', 'steag', 'final'];

export interface ObiectEditor { x: number; z: number; h: number; tip: Unealta }

export interface NivelPropriu {
  id: string;
  nume: string;
  tema: Tema;
  obiecte: ObiectEditor[];
}

export const TEME_EDITOR: Tema[] = ['luna', 'nori', 'ocean', 'gheata', 'vulcan', 'curcubeu', 'nebuloasa', 'asteroizi', 'statie'];

export function incarcaNiveleMele(): NivelPropriu[] {
  try { return JSON.parse(localStorage.getItem(CHEIE) || '[]'); } catch { return []; }
}

export function salveazaNiveleMele(lista: NivelPropriu[]) {
  try { localStorage.setItem(CHEIE, JSON.stringify(lista)); } catch { /* nu e grav */ }
}

export function nivelNou(nr: number): NivelPropriu {
  return { id: Date.now().toString(36), nume: `Nivelul meu ${nr}`, tema: 'luna', obiecte: [] };
}

/** Culoarea blocurilor depinde de înălțime, ca să se vadă ușor ce e mai sus */
const CULORI_INALTIME = [C.mov, C.turcoaz, C.lime, C.portocaliu, C.roz, 0x4a6fd8, 0xffd23f];

/** Transformă nivelul desenat în constructor într-un nivel care se poate juca */
export function inDefinitie(n: NivelPropriu): DefinitieNivel {
  const platforme: DefinitiePlatforma[] = [bloc(0, 0, 0, 6, 6, C.turcoaz)]; // platforma de start
  const monede: Punct[] = [];
  const steaguri: DefinitieNivel['steaguri'] = [];
  let final: DefinitieNivel['final'] = { poz: [0, -999, 0], directie: Math.PI }; // fără portal: ascuns
  for (const o of n.obiecte) {
    const x = o.x * U, z = o.z * U, h = o.h;
    switch (o.tip) {
      case 'bloc': platforme.push(bloc(x, h, z, U, U, CULORI_INALTIME[((h % 7) + 7) % 7])); break;
      case 'trambulina': platforme.push(trambulina(x, h, z, U, U)); break;
      case 'lava': platforme.push(lava(x, h, z, U, U)); break;
      case 'gheata': platforme.push(gheata(x, h, z, U, U)); break;
      case 'dispare': platforme.push(dispare(bloc(x, h, z, U, U, C.roz))); break;
      case 'mobil': platforme.push(mobila(bloc(x - U, h, z, U, U, C.portocaliu), [U * 2, 0, 0], 4)); break;
      case 'perete': platforme.push(perete(x, h - 1, z, U, 4, U)); break;
      case 'moneda': monede.push([x, h + 1, z]); break;
      case 'steag': steaguri.push({ poz: [x, h, z], directie: Math.PI }); break;
      case 'final': final = { poz: [x, h, z], directie: Math.PI }; break;
    }
  }
  return { nume: n.nume, tema: n.tema, start: [0, 0, 0], directieStart: Math.PI, platforme, monede, steaguri, final };
}

export function areFinal(n: NivelPropriu) {
  return n.obiecte.some((o) => o.tip === 'final');
}
