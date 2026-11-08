// Nivelul de test din Etapa 1: câteva platforme ca să încerci mersul și săriturile.
import type { DefinitieNivel } from './tipuri';

const TURCOAZ = 0x2ee6d6;
const PORTOCALIU = 0xff9a3c;
const LIME = 0xa6f04a;
const ROZ = 0xff5fa8;
const MOV = 0x8a6cff;

export const nivelTest: DefinitieNivel = {
  nume: 'Platforma de test',
  start: [0, 0.5, 0],
  directieStart: Math.PI,
  platforme: [
    // Baza de pornire, mare
    { poz: [0, -0.5, 0], dim: [10, 1, 10], culoare: MOV },

    // Drum drept, cu goluri mici între platforme
    { poz: [0, -0.5, -9], dim: [3, 1, 3], culoare: TURCOAZ },
    { poz: [0, -0.5, -14], dim: [3, 1, 3], culoare: TURCOAZ },
    { poz: [0, -0.5, -19.5], dim: [3, 1, 3], culoare: TURCOAZ },

    // Scări în sus
    { poz: [0, 0.3, -25], dim: [4, 1, 3], culoare: PORTOCALIU },
    { poz: [0, 1.5, -28.5], dim: [4, 1, 3], culoare: PORTOCALIU },
    { poz: [0, 2.7, -32], dim: [4, 1, 3], culoare: PORTOCALIU },

    // Platformă mare de odihnă
    { poz: [0, 2.7, -39], dim: [8, 1, 8], culoare: MOV },

    // Pietre mici în zig-zag (mai greu)
    { poz: [5, 2.7, -45], dim: [2, 1, 2], culoare: LIME },
    { poz: [1, 3.3, -49], dim: [2, 1, 2], culoare: LIME },
    { poz: [-3, 3.9, -53], dim: [2, 1, 2], culoare: LIME },
    { poz: [0, 4.5, -57.5], dim: [2, 1, 2], culoare: LIME },

    // Bârnă îngustă
    { poz: [0, 4.5, -64], dim: [1, 1, 9], culoare: ROZ },

    // Platforma finală
    { poz: [0, 4.5, -73], dim: [9, 1, 9], culoare: TURCOAZ },
    // un mic „podium” pe ea
    { poz: [0, 5.5, -75], dim: [3, 1, 3], culoare: PORTOCALIU },

    // Un tavan jos peste baza de pornire, ca să încerci să te lovești cu capul
    { poz: [3.5, 3, 3.5], dim: [3, 0.5, 3], culoare: ROZ },
  ],
};
