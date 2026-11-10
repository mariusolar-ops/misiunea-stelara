// NIVELUL 7 – Planeta de gheață
// Nou: gheață (aluneci!), pendule care te împing, curenți de aer care te ridică sus
// și cristale care ies din podea pe rând.
import type { DefinitieNivel } from './tipuri';
import { bloc, gheata, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const ZAPADA = 0xf2f8ff;
const STANCA = 0x8fa8c8;

export const nivel7: DefinitieNivel = {
  nume: 'Planeta de gheață',
  tema: 'gheata',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    // --- Partea 1: gheață și primul pendul ---
    bloc(0, 0, 0, 8, 8, ZAPADA),
    gheata(0, 0, -10, 4, 12),
    bloc(0, 0, -19.5, 3, 3, STANCA),
    gheata(0, 0, -26, 3, 7),
    bloc(0, 0, -33, 6, 6, C.turcoaz),                 // steagul 1

    // --- Partea 2: curentul de aer și cristalele ---
    bloc(0, 6, -45, 4, 6, STANCA),                    // începe chiar la marginea curentului
    bloc(3.8, 8, -39.8, 1.5, 1.5, STANCA),            // ascunzătoarea stelei de aur (lângă vârful curentului)
    bloc(0, 6, -53, 4, 8, ZAPADA),
    bloc(0, 6, -62, 6, 6, C.turcoaz),                 // steagul 2

    // --- Partea 3: gheață cu două pendule, apoi încă un curent de aer ---
    gheata(0, 6, -70, 3, 8),
    bloc(0, 11, -81.5, 4, 5, STANCA),
    bloc(0, 11, -90, 7, 7, C.turcoaz),                // finalul
  ],

  obstacole: [
    { tip: 'pendul', pivot: [0, 5.2, -26], lungime: 4.4, amplitudine: 1.0, perioada: 2.6, axa: 'x' },
    // curentul te ridică din golul de după steagul 1 până pe platforma de sus
    { tip: 'curent', poz: [0, -8, -39.8], raza: 2.2, inaltime: 15.5, forta: 14 },
    { tip: 'cristale', poz: [0, 6, -51.2], dim: [4, 1.6], perioada: 3 },
    { tip: 'cristale', poz: [0, 6, -54.8], dim: [4, 1.6], perioada: 3, faza: 0.5 },
    { tip: 'pendul', pivot: [0, 11.2, -68], lungime: 4.4, amplitudine: 1.0, perioada: 2.4, axa: 'x' },
    { tip: 'pendul', pivot: [0, 11.2, -72], lungime: 4.4, amplitudine: 1.0, perioada: 2.4, faza: 0.5, axa: 'x' },
    // alunecă de pe gheață direct în curent!
    { tip: 'curent', poz: [0, -2, -77], raza: 2, inaltime: 14.2, forta: 14 },
  ],

  steaguri: [
    { poz: [-2, 0, -33], directie: ÎNAINTE },
    { poz: [-2, 6, -62], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([0, 1, -6], [0, 1, -14], 3),
    monedaPe(0, 0, -19.5),
    ...linieMonede([0, 1, -23.5], [0, 1, -28.5], 2),
    ...linieMonede([0, 2, -39.8], [0, 8, -39.8], 4),      // în curentul de aer
    monedaPe(0, 6, -45),
    monedaPe(0, 6, -53),
    ...linieMonede([0, 7, -67], [0, 7, -73], 3),
    ...linieMonede([0, 8, -77], [0, 12, -77], 3),         // în al doilea curent
    monedaPe(0, 11, -81.5),
    ...linieMonede([-2.5, 12, -88], [2.5, 12, -88], 3),
  ],

  final: { poz: [0, 11, -91], directie: ÎNAINTE },

  // Steaua de aur: sus, lângă curentul de aer – lasă-te dus spre dreapta
  secret: [3.8, 9.2, -39.8],
};
