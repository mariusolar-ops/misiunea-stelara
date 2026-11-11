// Super-puterile: se cumpără cu monedele din joc și se pot porni sau opri oricând
// (ca să poți juca și „greu”, fără ele).

export type IdPutere = 'p-saritura' | 'p-viteza' | 'p-dubla' | 'p-zbor' | 'p-teleport';

export interface Putere {
  id: IdPutere;
  nume: string;
  emoji: string;
  descriere: string;
  pret: number;
}

export const PUTERI: Putere[] = [
  { id: 'p-saritura', nume: 'Super-săritură', emoji: '🦘', descriere: 'Sari mult mai sus', pret: 40 },
  { id: 'p-viteza', nume: 'Viteză', emoji: '⚡', descriere: 'Alergi mai repede', pret: 50 },
  { id: 'p-dubla', nume: 'Săritură dublă', emoji: '🌀', descriere: 'Mai sari o dată în aer', pret: 80 },
  { id: 'p-teleport', nume: 'Teleportare', emoji: '🌀', descriere: 'Apasă butonul 🌀 ca să te teleportezi în față', pret: 150 },
  { id: 'p-zbor', nume: 'Zbor', emoji: '🕊️', descriere: 'Ține apăsat SARI în aer ca să zbori', pret: 1000 },
];

/** Ce puteri are personajul acum (pentru fizică) */
export interface PuteriActive {
  saritura: boolean;
  viteza: boolean;
  dubla: boolean;
  zbor: boolean;
  teleport: boolean;
}

export function puteriDin(active: string[]): PuteriActive {
  return {
    saritura: active.includes('p-saritura'),
    viteza: active.includes('p-viteza'),
    dubla: active.includes('p-dubla'),
    zbor: active.includes('p-zbor'),
    teleport: active.includes('p-teleport'),
  };
}
