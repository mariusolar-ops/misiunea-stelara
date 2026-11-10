// Efectele din cufere: urme în spatele personajului, sunete de săritură și efecte la aterizare.
// Un cufăr costă 100 de monede (din joc) și îți dă mereu un efect pe care NU îl ai încă.
import * as THREE from 'three';
import type { Particule } from '../lume/Particule';

export type CategorieEfect = 'urma' | 'saritura' | 'aterizare';

export interface Efect {
  id: string;
  categorie: CategorieEfect;
  nume: string;
  emoji: string;
}

export const PRET_CUFAR = 100;

export const EFECTE: Efect[] = [
  // urme
  { id: 'u-stele', categorie: 'urma', nume: 'Stele aurii', emoji: '⭐' },
  { id: 'u-curcubeu', categorie: 'urma', nume: 'Curcubeu', emoji: '🌈' },
  { id: 'u-foc', categorie: 'urma', nume: 'Foc', emoji: '🔥' },
  { id: 'u-zapada', categorie: 'urma', nume: 'Fulgi de zăpadă', emoji: '❄️' },
  { id: 'u-neon', categorie: 'urma', nume: 'Neon turcoaz', emoji: '💠' },
  { id: 'u-inimi', categorie: 'urma', nume: 'Inimioare', emoji: '💖' },
  // sunete de săritură
  { id: 's-boing', categorie: 'saritura', nume: 'Boing', emoji: '🎈' },
  { id: 's-laser', categorie: 'saritura', nume: 'Pew pew', emoji: '🔫' },
  { id: 's-robot', categorie: 'saritura', nume: 'Robot', emoji: '🤖' },
  { id: 's-pian', categorie: 'saritura', nume: 'Pian', emoji: '🎹' },
  { id: 's-bula', categorie: 'saritura', nume: 'Bulă', emoji: '🫧' },
  // efecte la aterizare
  { id: 'a-crater', categorie: 'aterizare', nume: 'Crater', emoji: '🕳️' },
  { id: 'a-unda', categorie: 'aterizare', nume: 'Undă de șoc', emoji: '💫' },
  { id: 'a-stele', categorie: 'aterizare', nume: 'Ploaie de stele', emoji: '✨' },
  { id: 'a-confetti', categorie: 'aterizare', nume: 'Confetti', emoji: '🎉' },
];

export const NUME_CATEGORII: Record<CategorieEfect, string> = {
  urma: 'Urmă', saritura: 'Săritură', aterizare: 'Aterizare',
};

/** Ce efecte are jucătorul și pe care le folosește acum */
export interface StareEfecte {
  detinute: string[];
  urma: string | null;
  saritura: string | null;
  aterizare: string | null;
}

export const EFECTE_IMPLICITE: StareEfecte = { detinute: [], urma: null, saritura: null, aterizare: null };

/** Deschide un cufăr: alege la întâmplare un efect pe care nu-l ai. null = le ai pe toate */
export function deschideCufar(stare: StareEfecte): Efect | null {
  const ramase = EFECTE.filter((e) => !stare.detinute.includes(e.id));
  if (ramase.length === 0) return null;
  const e = ramase[Math.floor(Math.random() * ramase.length)];
  stare.detinute.push(e.id);
  stare[e.categorie] = e.id; // îl și pune imediat
  return e;
}

const CONFETTI = [0xff5f5f, 0xffd23f, 0x4ccf6a, 0x2ee6d6, 0x8a6cff, 0xff5fa8];
const tmp = new THREE.Vector3();
const vit = new THREE.Vector3();
const culoare = new THREE.Color();

/** Lansează particulele de urmă (se apelează des, cât timp personajul se mișcă) */
export function emiteUrma(id: string, part: Particule, poz: THREE.Vector3, timp: number) {
  tmp.set(poz.x + (Math.random() - 0.5) * 0.4, poz.y + 0.3 + Math.random() * 0.8, poz.z + (Math.random() - 0.5) * 0.4);
  vit.set((Math.random() - 0.5) * 0.6, 0, (Math.random() - 0.5) * 0.6);
  switch (id) {
    case 'u-stele': vit.y = 0.5; part.emite(tmp, vit, Math.random() < 0.7 ? 0xffd23f : 0xffffff, 0.8, 0.16); break;
    case 'u-curcubeu': culoare.setHSL((timp * 0.6) % 1, 0.9, 0.6); part.emite(tmp, vit, culoare, 0.9, 0.2); break;
    case 'u-foc': vit.y = 1.8; part.emite(tmp, vit, Math.random() < 0.5 ? 0xff7a2f : 0xffd23f, 0.55, 0.2); break;
    case 'u-zapada': vit.y = -0.4; part.emite(tmp, vit, 0xffffff, 1.2, 0.12); break;
    case 'u-neon': part.emite(tmp, vit, Math.random() < 0.6 ? 0x2ee6d6 : 0x9ffcf3, 0.7, 0.14); break;
    case 'u-inimi': vit.y = 0.9; part.emite(tmp, vit, Math.random() < 0.5 ? 0xff5fa8 : 0xff3a5a, 0.9, 0.18); break;
  }
}

/** Efectul la aterizare (după o cădere de la înălțime) */
export function efectAterizare(id: string, part: Particule, poz: THREE.Vector3, putere: number) {
  const k = Math.min(1.5, putere / 15);
  tmp.set(poz.x, poz.y + 0.03, poz.z);
  switch (id) {
    case 'a-crater':
      part.inel(tmp, 0x2a2430, 0.3, 1.1 + k * 0.4, 1.6, 0.85);
      part.explozie(tmp, 12, [0x8a8f99, 0x6d7287, 0xb8bccc], 3 + k * 2, 0.2, 18, 0.8);
      break;
    case 'a-unda':
      part.inel(tmp, 0x2ee6d6, 0.3, 3 + k, 0.6, 0.9);
      break;
    case 'a-stele':
      part.explozie(tmp, 16, [0xffd23f, 0xffffff], 4 + k * 2, 0.16, 10, 1);
      break;
    case 'a-confetti':
      part.explozie(tmp, 20, CONFETTI, 4 + k * 2, 0.15, 9, 1.2);
      break;
  }
}

/** Confetti mare la terminarea unui nivel */
export function confettiFinal(part: Particule, poz: THREE.Vector3) {
  tmp.set(poz.x, poz.y + 1.2, poz.z);
  part.explozie(tmp, 80, CONFETTI, 7, 0.2, 8, 2.2);
}
