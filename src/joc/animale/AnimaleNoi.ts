// Animalele noi (ideea lui Mihai): cal, măgar, găină, șopârlă, porc, tigru, girafă,
// crocodil, porumbel, pinguin și flamingo. Toate din cuburi, toate privesc spre +z.
import * as THREE from 'three';
import { cub, picior, coada, inchis, NEGRU, type Model } from './ajutor';

const ALB = 0xffffff;
const GALBEN_CIOC = 0xffb020;

/** Ochi mici negri, de o parte și de alta a capului */
function ochi(g: THREE.Object3D, x: number, y: number, z: number) {
  g.add(cub(0.05, 0.06, 0.02, NEGRU, -x, y, z), cub(0.05, 0.06, 0.02, NEGRU, x, y, z));
}

/** Ochi pe laterale (cai, păsări) */
function ochiLaterali(g: THREE.Object3D, x: number, y: number, z: number) {
  g.add(cub(0.02, 0.06, 0.06, NEGRU, -x, y, z), cub(0.02, 0.06, 0.06, NEGRU, x, y, z));
}

/** Patru picioare de patruped */
function patruPicioare(x: number, z: number, y: number, l: number, culoare: number, copita?: number) {
  return [[-x, z], [x, z], [-x, -z], [x, -z]].map(([px, pz]) => picior(px, y, pz, l, y, culoare, copita));
}

export function cal(c: number): Model {
  const g = new THREE.Group();
  const coama = inchis(c, 0.45);
  g.add(cub(0.42, 0.42, 0.95, c, 0, 0.82, 0));                    // corp
  g.add(cub(0.24, 0.5, 0.26, c, 0, 1.12, 0.46));                  // gât
  g.add(cub(0.07, 0.56, 0.3, coama, 0, 1.14, 0.38));              // coama
  const cap = new THREE.Group();
  cap.position.set(0, 1.36, 0.6);
  cap.add(cub(0.24, 0.26, 0.48, c, 0, 0, 0.08));                  // cap lung
  cap.add(cub(0.2, 0.18, 0.08, inchis(c, 0.8), 0, -0.04, 0.33));  // botul
  cap.add(cub(0.06, 0.14, 0.05, c, -0.07, 0.18, -0.08), cub(0.06, 0.14, 0.05, c, 0.07, 0.18, -0.08)); // urechi
  ochiLaterali(cap, 0.125, 0.05, 0.04);
  g.add(cap);
  const picioare = patruPicioare(0.14, 0.34, 0.62, 0.11, c, 0x2a2420);
  const cd = coada(0, 0.95, -0.48, cub(0.1, 0.55, 0.1, coama, 0, -0.27, -0.05));
  cd.rotation.x = 0.35;
  g.add(...picioare, cd);
  return { grup: g, picioare, coada: cd, cap, distanta: 2.1 };
}

export function magar(): Model {
  const g = new THREE.Group();
  const gri = 0x8f8a88, deschis = 0xd8d4d0;
  g.add(cub(0.38, 0.36, 0.78, gri, 0, 0.66, 0));
  g.add(cub(0.22, 0.36, 0.22, gri, 0, 0.92, 0.36));
  g.add(cub(0.05, 0.4, 0.2, NEGRU, 0, 0.96, 0.32));               // coama scurtă
  const cap = new THREE.Group();
  cap.position.set(0, 1.08, 0.5);
  cap.add(cub(0.22, 0.24, 0.4, gri, 0, 0, 0.06));
  cap.add(cub(0.2, 0.16, 0.1, deschis, 0, -0.05, 0.27));          // bot alb
  cap.add(cub(0.07, 0.34, 0.06, gri, -0.08, 0.27, -0.06));        // urechi LUNGI
  cap.add(cub(0.07, 0.34, 0.06, gri, 0.08, 0.27, -0.06));
  ochiLaterali(cap, 0.115, 0.04, 0.04);
  g.add(cap);
  const picioare = patruPicioare(0.12, 0.28, 0.48, 0.1, gri, 0x3a3432);
  const cd = coada(0, 0.78, -0.4, cub(0.05, 0.35, 0.05, gri, 0, -0.17, 0), cub(0.08, 0.1, 0.08, NEGRU, 0, -0.37, 0));
  cd.rotation.x = 0.3;
  g.add(...picioare, cd);
  return { grup: g, picioare, coada: cd, cap, distanta: 1.8 };
}

export function gaina(c: number): Model {
  const g = new THREE.Group();
  g.add(cub(0.3, 0.3, 0.38, c, 0, 0.36, 0));                       // corp rotunjor
  g.add(cub(0.06, 0.18, 0.26, inchis(c, 0.88), -0.17, 0.38, -0.02)); // aripi
  g.add(cub(0.06, 0.18, 0.26, inchis(c, 0.88), 0.17, 0.38, -0.02));
  const cap = new THREE.Group();
  cap.position.set(0, 0.6, 0.14);
  cap.add(cub(0.18, 0.2, 0.18, c, 0, 0, 0));
  cap.add(cub(0.06, 0.1, 0.14, 0xe02a2a, 0, 0.14, 0));            // creasta roșie
  cap.add(cub(0.06, 0.05, 0.08, GALBEN_CIOC, 0, -0.01, 0.12));    // cioc
  cap.add(cub(0.04, 0.07, 0.03, 0xe02a2a, 0, -0.08, 0.1));        // bărbița roșie
  ochiLaterali(cap, 0.09, 0.04, 0.03);
  g.add(cap);
  const picioare = [picior(-0.07, 0.22, 0, 0.04, 0.22, GALBEN_CIOC), picior(0.07, 0.22, 0, 0.04, 0.22, GALBEN_CIOC)];
  const cd = coada(0, 0.48, -0.2, cub(0.12, 0.2, 0.08, inchis(c, 0.9), 0, 0.06, -0.02));
  cd.rotation.x = -0.4;
  g.add(...picioare, cd);
  return { grup: g, picioare, coada: cd, cap, distanta: 1.2 };
}

export function soparla(): Model {
  const g = new THREE.Group();
  const verde = 0x3fbf6a, burta = 0xb8f08a;
  g.add(cub(0.22, 0.12, 0.5, verde, 0, 0.12, 0));
  g.add(cub(0.18, 0.04, 0.42, burta, 0, 0.06, 0));
  for (const z of [-0.12, 0.06]) g.add(cub(0.24, 0.02, 0.06, 0x2a8f4a, 0, 0.185, z)); // dungi pe spate
  const cap = new THREE.Group();
  cap.position.set(0, 0.14, 0.3);
  cap.add(cub(0.16, 0.1, 0.18, verde, 0, 0, 0));
  ochiLaterali(cap, 0.08, 0.03, 0.02);
  g.add(cap);
  // picioare în lateral, scurte
  const picioare = [[-0.15, 0.16], [0.15, 0.16], [-0.15, -0.16], [0.15, -0.16]].map(([x, z]) => picior(x, 0.08, z, 0.06, 0.08, verde));
  const cd = coada(0, 0.12, -0.25, cub(0.1, 0.08, 0.32, verde, 0, 0, -0.15), cub(0.06, 0.05, 0.22, verde, 0, 0, -0.42));
  g.add(...picioare, cd);
  return { grup: g, picioare, coada: cd, distanta: 1.1 };
}

export function porc(): Model {
  const g = new THREE.Group();
  const roz = 0xf5a0b0;
  g.add(cub(0.42, 0.36, 0.6, roz, 0, 0.36, 0));
  g.add(cub(0.32, 0.3, 0.26, roz, 0, 0.42, 0.38));                // cap
  g.add(cub(0.16, 0.12, 0.06, 0xe07a90, 0, 0.38, 0.53));          // râtul
  g.add(cub(0.03, 0.04, 0.01, 0x9a3a50, -0.035, 0.38, 0.565), cub(0.03, 0.04, 0.01, 0x9a3a50, 0.035, 0.38, 0.565)); // nări
  ochi(g, 0.08, 0.5, 0.515);
  g.add(cub(0.09, 0.1, 0.04, 0xe07a90, -0.12, 0.6, 0.36), cub(0.09, 0.1, 0.04, 0xe07a90, 0.12, 0.6, 0.36)); // urechi
  const picioare = patruPicioare(0.13, 0.2, 0.18, 0.1, roz);
  // codiță încârlionțată
  const cd = coada(0, 0.44, -0.32,
    cub(0.04, 0.04, 0.08, roz, 0, 0, -0.03), cub(0.04, 0.08, 0.04, roz, 0, 0.05, -0.07), cub(0.06, 0.04, 0.04, roz, 0.03, 0.09, -0.05));
  g.add(...picioare, cd);
  return { grup: g, picioare, coada: cd, distanta: 1.4 };
}

export function tigru(): Model {
  const g = new THREE.Group();
  const port = 0xf08a2a;
  g.add(cub(0.38, 0.34, 0.85, port, 0, 0.5, 0));
  for (const z of [-0.3, -0.12, 0.06, 0.24]) g.add(cub(0.4, 0.06, 0.05, NEGRU, 0, 0.66, z), cub(0.39, 0.2, 0.05, NEGRU, 0, 0.52, z + 0.02)); // dungi
  const cap = new THREE.Group();
  cap.position.set(0, 0.68, 0.48);
  cap.add(cub(0.34, 0.3, 0.3, port, 0, 0, 0));
  cap.add(cub(0.22, 0.12, 0.08, ALB, 0, -0.08, 0.17));            // botul alb
  cap.add(cub(0.06, 0.04, 0.02, 0xd06070, 0, -0.03, 0.21));       // nasul
  cap.add(cub(0.08, 0.08, 0.04, port, -0.12, 0.18, -0.02), cub(0.08, 0.08, 0.04, port, 0.12, 0.18, -0.02)); // urechi
  cap.add(cub(0.03, 0.08, 0.01, NEGRU, 0, 0.11, 0.155));          // dungă pe frunte
  ochi(cap, 0.08, 0.05, 0.155);
  g.add(cap);
  const picioare = patruPicioare(0.12, 0.3, 0.33, 0.11, port);
  const cd = coada(0, 0.6, -0.42, cub(0.06, 0.06, 0.45, port, 0, 0, -0.2), cub(0.07, 0.07, 0.08, NEGRU, 0, 0, -0.44));
  cd.rotation.x = -0.5;
  g.add(...picioare, cd);
  return { grup: g, picioare, coada: cd, distanta: 1.8 };
}

export function girafa(): Model {
  const g = new THREE.Group();
  const galben = 0xf0c060, pata = 0x9a5a20;
  g.add(cub(0.42, 0.42, 0.75, galben, 0, 1.15, 0));
  g.add(cub(0.2, 1.0, 0.2, galben, 0, 1.75, 0.3));                 // gâtul FOARTE lung
  // pete maro
  for (const [x, y, z] of [[0.215, 1.2, 0.1], [-0.215, 1.1, -0.15], [0.215, 1.05, -0.2], [-0.215, 1.25, 0.18], [0.105, 1.7, 0.3], [-0.105, 1.95, 0.3]])
    g.add(cub(0.02, 0.12, 0.12, pata, x, y, z));
  const cap = new THREE.Group();
  cap.position.set(0, 2.3, 0.42);
  cap.add(cub(0.2, 0.2, 0.36, galben, 0, 0, 0.06));
  cap.add(cub(0.04, 0.14, 0.04, pata, -0.06, 0.16, -0.05), cub(0.04, 0.14, 0.04, pata, 0.06, 0.16, -0.05)); // cornițele
  ochiLaterali(cap, 0.105, 0.04, 0.04);
  g.add(cap);
  const picioare = patruPicioare(0.14, 0.26, 0.95, 0.09, galben, 0x4a3420);
  const cd = coada(0, 1.25, -0.38, cub(0.04, 0.4, 0.04, galben, 0, -0.2, 0), cub(0.07, 0.1, 0.07, NEGRU, 0, -0.42, 0));
  g.add(...picioare, cd);
  return { grup: g, picioare, coada: cd, cap, distanta: 2.3 };
}

export function crocodil(): Model {
  const g = new THREE.Group();
  const verde = 0x3f7a3a, burta = 0xa8c870;
  g.add(cub(0.42, 0.2, 0.8, verde, 0, 0.22, 0));
  g.add(cub(0.38, 0.05, 0.75, burta, 0, 0.11, 0));
  for (const z of [-0.25, -0.05, 0.15, 0.32]) g.add(cub(0.08, 0.06, 0.08, 0x2a5a28, 0, 0.35, z)); // solzi pe spate
  const cap = new THREE.Group();
  cap.position.set(0, 0.24, 0.5);
  cap.add(cub(0.3, 0.12, 0.5, verde, 0, 0.02, 0.16));               // botul lung
  cap.add(cub(0.28, 0.06, 0.46, burta, 0, -0.06, 0.16));
  for (const x of [-0.13, 0.13]) for (const z of [0.05, 0.2, 0.35]) cap.add(cub(0.03, 0.04, 0.03, ALB, x, -0.03, z)); // dințișori
  cap.add(cub(0.08, 0.08, 0.08, verde, -0.1, 0.1, -0.04), cub(0.08, 0.08, 0.08, verde, 0.1, 0.1, -0.04)); // ochii ridicați
  cap.add(cub(0.04, 0.04, 0.02, 0xf0e030, -0.1, 0.11, 0.005), cub(0.04, 0.04, 0.02, 0xf0e030, 0.1, 0.11, 0.005));
  g.add(cap);
  const picioare = [[-0.24, 0.24], [0.24, 0.24], [-0.24, -0.24], [0.24, -0.24]].map(([x, z]) => picior(x, 0.14, z, 0.1, 0.14, verde));
  const cd = coada(0, 0.22, -0.4, cub(0.26, 0.14, 0.4, verde, 0, 0, -0.18), cub(0.14, 0.1, 0.4, verde, 0, 0, -0.55));
  g.add(...picioare, cd);
  return { grup: g, picioare, coada: cd, distanta: 1.9 };
}

export function porumbel(): Model {
  const g = new THREE.Group();
  const gri = 0x9aa0b0;
  g.add(cub(0.24, 0.24, 0.36, gri, 0, 0.3, 0));
  g.add(cub(0.05, 0.14, 0.26, 0x7a8090, -0.14, 0.32, -0.04), cub(0.05, 0.14, 0.26, 0x7a8090, 0.14, 0.32, -0.04)); // aripi
  g.add(cub(0.26, 0.06, 0.02, 0x404050, 0, 0.27, -0.1), cub(0.26, 0.06, 0.02, 0x404050, 0, 0.27, -0.03)); // dunguțe închise pe aripi
  const cap = new THREE.Group();
  cap.position.set(0, 0.5, 0.14);
  cap.add(cub(0.16, 0.16, 0.16, gri, 0, 0, 0));
  cap.add(cub(0.17, 0.1, 0.12, 0x4ab08a, 0, -0.1, -0.02));        // gâtul verde-mov lucios
  cap.add(cub(0.04, 0.03, 0.08, 0xd8b0a0, 0, -0.01, 0.11));        // cioc
  ochiLaterali(cap, 0.08, 0.03, 0.03);
  g.add(cap);
  const picioare = [picior(-0.06, 0.17, 0, 0.04, 0.17, 0xe05a5a), picior(0.06, 0.17, 0, 0.04, 0.17, 0xe05a5a)];
  const cd = coada(0, 0.32, -0.18, cub(0.16, 0.04, 0.18, 0x7a8090, 0, 0, -0.08), cub(0.17, 0.04, 0.04, 0x303040, 0, 0, -0.17));
  g.add(...picioare, cd);
  return { grup: g, picioare, coada: cd, cap, distanta: 1.2 };
}

export function pinguin(): Model {
  const g = new THREE.Group();
  const negru = 0x1c1c28;
  g.add(cub(0.34, 0.5, 0.3, negru, 0, 0.36, 0));
  g.add(cub(0.26, 0.42, 0.02, ALB, 0, 0.33, 0.155));               // burta albă
  g.add(cub(0.05, 0.3, 0.16, negru, -0.19, 0.36, 0), cub(0.05, 0.3, 0.16, negru, 0.19, 0.36, 0)); // aripioare
  const cap = new THREE.Group();
  cap.position.set(0, 0.7, 0.02);
  cap.add(cub(0.28, 0.22, 0.26, negru, 0, 0, 0));
  cap.add(cub(0.06, 0.06, 0.02, ALB, -0.07, 0.03, 0.135), cub(0.06, 0.06, 0.02, ALB, 0.07, 0.03, 0.135)); // albul ochilor
  ochi(cap, 0.07, 0.03, 0.15);
  cap.add(cub(0.08, 0.05, 0.1, 0xffa020, 0, -0.04, 0.17));        // cioc portocaliu
  g.add(cap);
  const picioare = [picior(-0.08, 0.1, 0.04, 0.1, 0.1, 0xffa020), picior(0.08, 0.1, 0.04, 0.1, 0.1, 0xffa020)];
  const cd = coada(0, 0.14, -0.15, cub(0.14, 0.05, 0.08, negru, 0, 0, -0.03));
  g.add(...picioare, cd);
  return { grup: g, picioare, coada: cd, legana: true, distanta: 1.2 };
}

export function flamingo(): Model {
  const g = new THREE.Group();
  const roz = 0xff7ab0;
  g.add(cub(0.26, 0.24, 0.42, roz, 0, 1.0, 0));
  g.add(cub(0.06, 0.16, 0.3, 0xff5a9a, -0.15, 1.02, -0.04), cub(0.06, 0.16, 0.3, 0xff5a9a, 0.15, 1.02, -0.04)); // aripi
  g.add(cub(0.08, 0.36, 0.08, roz, 0, 1.28, 0.18));                // gâtul (în S)
  g.add(cub(0.08, 0.08, 0.14, roz, 0, 1.44, 0.24));
  g.add(cub(0.08, 0.3, 0.08, roz, 0, 1.62, 0.3));
  const cap = new THREE.Group();
  cap.position.set(0, 1.8, 0.33);
  cap.add(cub(0.13, 0.12, 0.14, roz, 0, 0, 0));
  cap.add(cub(0.05, 0.08, 0.14, ALB, 0, -0.04, 0.13));             // cioc alb, îndoit…
  cap.add(cub(0.05, 0.08, 0.05, NEGRU, 0, -0.1, 0.19));            // …cu vârf negru
  ochiLaterali(cap, 0.065, 0.02, 0.01);
  g.add(cap);
  // picioare lungi și subțiri
  const picioare = [picior(-0.05, 0.88, 0, 0.035, 0.88, 0xff9ac0), picior(0.05, 0.88, 0, 0.035, 0.88, 0xff9ac0)];
  const cd = coada(0, 1.02, -0.22, cub(0.16, 0.06, 0.12, 0xff5a9a, 0, 0, -0.04));
  g.add(...picioare, cd);
  return { grup: g, picioare, coada: cd, cap, distanta: 1.6 };
}

/** Minge de baschet (ideea lui Mihai): portocalie, cu linii negre, sare tot timpul după tine */
export function mingeBaschet(): Model {
  const g = new THREE.Group();
  const minge = new THREE.Group();
  const port = 0xf07a20;
  // o „sferă” din trei cuburi încrucișate, ca să pară rotundă
  minge.add(cub(0.5, 0.5, 0.5, port, 0, 0, 0));
  minge.add(cub(0.56, 0.4, 0.4, port, 0, 0, 0), cub(0.4, 0.56, 0.4, port, 0, 0, 0), cub(0.4, 0.4, 0.56, port, 0, 0, 0));
  // liniile negre
  minge.add(cub(0.58, 0.03, 0.58, NEGRU, 0, 0, 0), cub(0.03, 0.58, 0.58, NEGRU, 0, 0, 0), cub(0.58, 0.58, 0.03, NEGRU, 0, 0, 0));
  minge.position.y = 0.3;
  g.add(minge);
  const cd = new THREE.Group(); // nu are coadă 🙂
  return { grup: g, picioare: [], coada: cd, minge, distanta: 1.3 };
}
