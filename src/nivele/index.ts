// Lista tuturor nivelurilor, în ordine. Ca să adaugi un nivel nou:
// fă un fișier nivelX.ts după modelul celorlalte și pune-l aici.
import { nivel1 } from './nivel1';
import { nivel2 } from './nivel2';
import { nivel3 } from './nivel3';
import { nivel4 } from './nivel4';
import { nivel5 } from './nivel5';
import { nivel6 } from './nivel6';

// Ultimul (nivel6) e nivelul SECRET: apare doar după ce găsești toate stelele secrete.
export const NIVELE = [nivel1, nivel2, nivel3, nivel4, nivel5, nivel6];

/** Câte niveluri „normale” sunt (fără cel secret) */
export const NR_NIVELE_NORMALE = 5;
/** Poziția nivelului secret în listă */
export const INDEX_SECRET = 5;
