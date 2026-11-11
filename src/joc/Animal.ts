// Animalul de companie: câine, pisică, iepure, capră sau zebră – toate din cuburi.
// Aleargă după personaj. Nu are fizică proprie – doar „plutește” lin spre un loc din spatele lui,
// așa că nu cade niciodată și nu încurcă jocul.
import * as THREE from 'three';

export type TipAnimal = 'caine' | 'pisica' | 'iepure' | 'capra' | 'zebra'
  | 'cal' | 'magar' | 'gaina' | 'soparla' | 'porc' | 'tigru' | 'girafa' | 'crocodil' | 'porumbel' | 'pinguin' | 'flamingo' | 'kiwi';

export interface InfoAnimal {
  tip: TipAnimal;
  nume: string;
  emoji: string;
  /** Culoarea de pornire a blănii */
  culoare: number;
  /** Se poate schimba culoarea? (zebra are dungi fixe) */
  recolorabil: boolean;
  /** Animal secret: apare doar după recompensa supremă */
  secret?: boolean;
}

export const ANIMALE: InfoAnimal[] = [
  { tip: 'caine', nume: 'Cățel', emoji: '🐶', culoare: 0xb8692a, recolorabil: true },
  { tip: 'pisica', nume: 'Pisică', emoji: '🐱', culoare: 0xf0a050, recolorabil: true },
  { tip: 'iepure', nume: 'Iepuraș', emoji: '🐰', culoare: 0xf2f2f2, recolorabil: true },
  { tip: 'capra', nume: 'Capră', emoji: '🐐', culoare: 0xe8e2d4, recolorabil: true },
  { tip: 'zebra', nume: 'Zebră', emoji: '🦓', culoare: 0xffffff, recolorabil: false },
  // animalele noi (ideea lui Mihai)
  { tip: 'cal', nume: 'Cal', emoji: '🐴', culoare: 0x8b4a22, recolorabil: true },
  { tip: 'magar', nume: 'Măgar', emoji: '🫏', culoare: 0x8f8a88, recolorabil: false },
  { tip: 'gaina', nume: 'Găină', emoji: '🐔', culoare: 0xf5f0e8, recolorabil: true },
  { tip: 'soparla', nume: 'Șopârlă', emoji: '🦎', culoare: 0x3fbf6a, recolorabil: false },
  { tip: 'porc', nume: 'Porc', emoji: '🐷', culoare: 0xf5a0b0, recolorabil: false },
  { tip: 'tigru', nume: 'Tigru', emoji: '🐯', culoare: 0xf08a2a, recolorabil: false },
  { tip: 'girafa', nume: 'Girafă', emoji: '🦒', culoare: 0xf0c060, recolorabil: false },
  { tip: 'crocodil', nume: 'Crocodil', emoji: '🐊', culoare: 0x3f7a3a, recolorabil: false },
  { tip: 'porumbel', nume: 'Porumbel', emoji: '🕊️', culoare: 0x9aa0b0, recolorabil: false },
  { tip: 'pinguin', nume: 'Pinguin', emoji: '🐧', culoare: 0x1c1c28, recolorabil: false },
  { tip: 'flamingo', nume: 'Flamingo', emoji: '🦩', culoare: 0xff7ab0, recolorabil: false },
  // pisica Kiwi: gri, cu coroană de aur – recompensa supremă
  { tip: 'kiwi', nume: 'Kiwi', emoji: '😺', culoare: 0x8a8f99, recolorabil: false, secret: true },
];

import { cub, picior, coada, inchis, NEGRU, type Model } from './animale/ajutor';
import * as noi from './animale/AnimaleNoi';

// --- Rețetele: fiecare animal privește spre +z ---

function caine(c: number): Model {
  const g = new THREE.Group();
  g.add(cub(0.36, 0.32, 0.8, c, 0, 0.36, 0));                 // corp lung (ca un șoricar)
  g.add(cub(0.34, 0.32, 0.32, c, 0, 0.62, 0.45));             // cap
  g.add(cub(0.2, 0.15, 0.18, c, 0, 0.55, 0.66));              // bot
  g.add(cub(0.09, 0.07, 0.04, NEGRU, 0, 0.6, 0.76));          // nas
  g.add(cub(0.05, 0.06, 0.02, NEGRU, -0.09, 0.69, 0.615));    // ochi
  g.add(cub(0.05, 0.06, 0.02, NEGRU, 0.09, 0.69, 0.615));
  g.add(cub(0.07, 0.28, 0.16, inchis(c), -0.2, 0.56, 0.43));  // urechi lăsate
  g.add(cub(0.07, 0.28, 0.16, inchis(c), 0.2, 0.56, 0.43));
  const picioare = [[-0.12, 0.28], [0.12, 0.28], [-0.12, -0.28], [0.12, -0.28]].map(([x, z]) => picior(x, 0.22, z, 0.1, 0.22, c));
  const cd = coada(0, 0.46, -0.4, cub(0.07, 0.07, 0.28, inchis(c), 0, 0.06, -0.12));
  cd.rotation.x = 0.6;
  g.add(...picioare, cd);
  return { grup: g, picioare, coada: cd, distanta: 1.4 };
}

function pisica(c: number): Model {
  const g = new THREE.Group();
  g.add(cub(0.3, 0.28, 0.6, c, 0, 0.34, 0));
  g.add(cub(0.32, 0.28, 0.28, c, 0, 0.56, 0.36));             // cap
  g.add(cub(0.09, 0.11, 0.06, c, -0.1, 0.75, 0.38));          // urechi ascuțite
  g.add(cub(0.09, 0.11, 0.06, c, 0.1, 0.75, 0.38));
  g.add(cub(0.05, 0.06, 0.02, 0xf2a0b0, -0.1, 0.74, 0.412));  // interiorul urechilor
  g.add(cub(0.05, 0.06, 0.02, 0xf2a0b0, 0.1, 0.74, 0.412));
  g.add(cub(0.06, 0.07, 0.02, 0x3fbf5a, -0.08, 0.6, 0.505));  // ochi verzi
  g.add(cub(0.06, 0.07, 0.02, 0x3fbf5a, 0.08, 0.6, 0.505));
  g.add(cub(0.05, 0.04, 0.02, 0xf27a9a, 0, 0.53, 0.51));      // năsuc roz
  g.add(cub(0.34, 0.012, 0.012, 0xffffff, 0, 0.51, 0.51));     // mustăți
  g.add(cub(0.34, 0.012, 0.012, 0xffffff, 0, 0.49, 0.51));
  const picioare = [[-0.09, 0.2], [0.09, 0.2], [-0.09, -0.2], [0.09, -0.2]].map(([x, z]) => picior(x, 0.2, z, 0.09, 0.2, c));
  // coada lungă, ridicată
  const cd = coada(0, 0.42, -0.3, cub(0.06, 0.06, 0.5, c, 0, 0, -0.22), cub(0.07, 0.07, 0.1, inchis(c, 0.8), 0, 0, -0.48));
  cd.rotation.x = -0.9;
  g.add(...picioare, cd);
  return { grup: g, picioare, coada: cd, distanta: 1.3 };
}

function iepure(c: number): Model {
  const g = new THREE.Group();
  g.add(cub(0.34, 0.32, 0.42, c, 0, 0.28, 0));
  g.add(cub(0.28, 0.28, 0.28, c, 0, 0.52, 0.22));             // cap
  for (const x of [-0.07, 0.07]) {
    g.add(cub(0.07, 0.38, 0.05, c, x, 0.84, 0.2));            // urechi lungi
    g.add(cub(0.04, 0.3, 0.01, 0xf2a0b0, x, 0.84, 0.226));
    g.add(cub(0.05, 0.06, 0.02, NEGRU, x * 1.2, 0.56, 0.362)); // ochi
  }
  g.add(cub(0.05, 0.04, 0.02, 0xf27a9a, 0, 0.49, 0.365));     // năsuc
  g.add(cub(0.06, 0.05, 0.01, 0xffffff, 0, 0.44, 0.365));     // dinți
  const picioare = [
    picior(-0.1, 0.14, 0.14, 0.08, 0.14, c), picior(0.1, 0.14, 0.14, 0.08, 0.14, c),
    picior(-0.12, 0.16, -0.12, 0.12, 0.16, c), picior(0.12, 0.16, -0.12, 0.12, 0.16, c),
  ];
  const cd = coada(0, 0.32, -0.24, cub(0.14, 0.14, 0.12, 0xffffff, 0, 0, -0.02)); // codiță pufoasă
  g.add(...picioare, cd);
  return { grup: g, picioare, coada: cd, topaie: true, distanta: 1.2 };
}

function capra(c: number): Model {
  const g = new THREE.Group();
  g.add(cub(0.36, 0.34, 0.7, c, 0, 0.58, 0));
  g.add(cub(0.18, 0.3, 0.2, c, 0, 0.82, 0.3));                // gâtul
  g.add(cub(0.26, 0.26, 0.32, c, 0, 0.98, 0.44));             // cap
  g.add(cub(0.05, 0.2, 0.05, 0x6b6560, -0.08, 1.2, 0.36));    // coarne
  g.add(cub(0.05, 0.2, 0.05, 0x6b6560, 0.08, 1.2, 0.36));
  g.add(cub(0.05, 0.06, 0.12, 0x6b6560, -0.08, 1.29, 0.3));
  g.add(cub(0.05, 0.06, 0.12, 0x6b6560, 0.08, 1.29, 0.3));
  g.add(cub(0.16, 0.05, 0.08, c, -0.2, 1.02, 0.4));           // urechi în lateral
  g.add(cub(0.16, 0.05, 0.08, c, 0.2, 1.02, 0.4));
  g.add(cub(0.05, 0.05, 0.02, NEGRU, -0.08, 1.03, 0.605));    // ochi
  g.add(cub(0.05, 0.05, 0.02, NEGRU, 0.08, 1.03, 0.605));
  g.add(cub(0.08, 0.14, 0.05, inchis(c, 0.85), 0, 0.8, 0.56)); // bărbiță
  const picioare = [[-0.12, 0.26], [0.12, 0.26], [-0.12, -0.26], [0.12, -0.26]].map(([x, z]) => picior(x, 0.42, z, 0.09, 0.42, c, 0x4a4540));
  const cd = coada(0, 0.72, -0.35, cub(0.07, 0.14, 0.06, c, 0, 0.06, 0));
  cd.rotation.x = -0.4;
  g.add(...picioare, cd);
  return { grup: g, picioare, coada: cd, distanta: 1.7 };
}

function zebra(): Model {
  const ALB = 0xf6f6f2;
  const g = new THREE.Group();
  g.add(cub(0.4, 0.38, 0.85, ALB, 0, 0.72, 0));
  for (const z of [-0.3, -0.12, 0.06, 0.24]) g.add(cub(0.42, 0.4, 0.06, NEGRU, 0, 0.72, z)); // dungi
  g.add(cub(0.2, 0.42, 0.22, ALB, 0, 1.02, 0.4));              // gâtul
  g.add(cub(0.21, 0.06, 0.23, NEGRU, 0, 0.94, 0.4));
  g.add(cub(0.21, 0.06, 0.23, NEGRU, 0, 1.1, 0.4));
  g.add(cub(0.06, 0.46, 0.24, NEGRU, 0, 1.08, 0.36));          // coama
  g.add(cub(0.22, 0.22, 0.42, ALB, 0, 1.24, 0.6));             // cap
  g.add(cub(0.23, 0.05, 0.43, NEGRU, 0, 1.28, 0.6));
  g.add(cub(0.2, 0.16, 0.12, NEGRU, 0, 1.18, 0.84));           // bot negru
  g.add(cub(0.05, 0.05, 0.02, NEGRU, -0.115, 1.3, 0.66));      // ochi (pe laterale)
  g.add(cub(0.05, 0.05, 0.02, NEGRU, 0.115, 1.3, 0.66));
  g.add(cub(0.06, 0.14, 0.05, ALB, -0.07, 1.42, 0.5));         // urechi
  g.add(cub(0.06, 0.14, 0.05, ALB, 0.07, 1.42, 0.5));
  const picioare = [[-0.13, 0.3], [0.13, 0.3], [-0.13, -0.3], [0.13, -0.3]].map(([x, z]) => {
    const p = picior(x, 0.54, z, 0.1, 0.54, ALB, NEGRU);
    p.add(cub(0.11, 0.06, 0.11, NEGRU, 0, -0.22, 0));          // dungă pe picior
    return p;
  });
  const cd = coada(0, 0.86, -0.43, cub(0.04, 0.4, 0.04, ALB, 0, -0.2, 0), cub(0.07, 0.12, 0.07, NEGRU, 0, -0.42, 0));
  cd.rotation.x = 0.25;
  g.add(...picioare, cd);
  return { grup: g, picioare, coada: cd, distanta: 1.9 };
}

/** Kiwi: o pisică gri cu o coroană de aur pe cap și un clopoțel auriu la gât */
function kiwi(): Model {
  const m = pisica(0x8a8f99);
  const aur = 0xffd23f;
  const coroana = new THREE.Group();
  coroana.position.set(0, 0.74, 0.36);
  coroana.add(cub(0.3, 0.07, 0.3, aur, 0, 0, 0));
  for (const [x, z] of [[-0.12, 0.12], [0.12, 0.12], [-0.12, -0.12], [0.12, -0.12], [0, 0.12]]) coroana.add(cub(0.06, 0.1, 0.06, aur, x, 0.08, z));
  coroana.add(cub(0.05, 0.05, 0.02, 0xe84a4a, 0, 0.01, 0.155));            // un rubin
  coroana.traverse((o) => { if (o instanceof THREE.Mesh) (o.material as THREE.MeshLambertMaterial).emissive.set(0x5a4000); });
  m.grup.add(coroana);
  m.grup.add(cub(0.34, 0.05, 0.3, 0xe84a4a, 0, 0.44, 0.3));              // zgărdiță roșie
  m.grup.add(cub(0.07, 0.07, 0.07, aur, 0, 0.39, 0.45));                  // clopoțel
  return m;
}

export class Animal {
  obiect = new THREE.Group();
  private model!: Model;
  private faza = 0;
  private directie = 0;

  constructor(scena: THREE.Scene, tip: TipAnimal = 'caine', culoare = 0xb8692a) {
    this.schimba(tip, culoare);
    scena.add(this.obiect);
  }

  /** Schimbă animalul (sau culoarea lui) */
  schimba(tip: TipAnimal, culoare: number) {
    this.obiect.traverse((o) => { if (o instanceof THREE.Mesh) (o.material as THREE.Material).dispose(); });
    this.obiect.clear();
    const retete: Record<TipAnimal, () => Model> = {
      caine: () => caine(culoare), pisica: () => pisica(culoare), iepure: () => iepure(culoare),
      capra: () => capra(culoare), zebra: () => zebra(),
      cal: () => noi.cal(culoare), magar: () => noi.magar(), gaina: () => noi.gaina(culoare),
      soparla: () => noi.soparla(), porc: () => noi.porc(), tigru: () => noi.tigru(),
      girafa: () => noi.girafa(), crocodil: () => noi.crocodil(), porumbel: () => noi.porumbel(),
      pinguin: () => noi.pinguin(), flamingo: () => noi.flamingo(), kiwi: () => kiwi(),
    };
    this.model = (retete[tip] ?? retete.caine)();
    this.obiect.add(this.model.grup);
  }

  /** Locul unde vrea să stea: puțin în spatele și în dreapta personajului */
  private loc(poz: THREE.Vector3, dir: number) {
    const d = this.model.distanta;
    return new THREE.Vector3(
      poz.x - Math.sin(dir) * d + Math.cos(dir) * 0.8,
      poz.y,
      poz.z - Math.cos(dir) * d - Math.sin(dir) * 0.8,
    );
  }

  /** Îl pune imediat lângă personaj (la start sau după o cădere) */
  teleporteaza(pozMihai: THREE.Vector3, directieMihai: number) {
    this.obiect.position.copy(this.loc(pozMihai, directieMihai));
    this.directie = directieMihai;
  }

  actualizeaza(dt: number, pozMihai: THREE.Vector3, directieMihai: number, timp: number) {
    const tinta = this.loc(pozMihai, directieMihai);
    const p = this.obiect.position;
    const inainte = p.clone();
    // dacă a rămas foarte în urmă (ex. personajul a căzut), sare direct lângă el
    if (p.distanceTo(tinta) > 15) this.teleporteaza(pozMihai, directieMihai);
    else p.lerp(tinta, Math.min(1, dt * 6));

    // se întoarce în direcția în care aleargă
    const dx = p.x - inainte.x, dz = p.z - inainte.z;
    const viteza = Math.hypot(dx, dz) / Math.max(dt, 0.001);
    if (viteza > 0.6) {
      let dif = Math.atan2(dx, dz) - this.directie;
      dif = Math.atan2(Math.sin(dif), Math.cos(dif));
      this.directie += dif * Math.min(1, dt * 10);
    }
    this.obiect.rotation.y = this.directie;

    const k = Math.min(1, viteza / 6);
    this.faza += dt * (8 + k * 10);
    if (this.model.topaie) {
      // iepurele țopăie: tot corpul sare
      this.model.grup.position.y = Math.abs(Math.sin(this.faza * 0.7)) * 0.3 * k;
    } else {
      this.model.picioare.forEach((pic, i) =>
        (pic.rotation.x = Math.sin(this.faza + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI : 0)) * 0.8 * k));
    }
    this.model.coada.rotation.y = Math.sin(timp * 12) * 0.45; // dă din coadă
    // pinguinul se leagănă când merge; păsările și caii dau din cap
    if (this.model.legana) this.model.grup.rotation.z = Math.sin(this.faza) * 0.2 * k;
    if (this.model.cap) this.model.cap.rotation.x = Math.sin(this.faza * 2) * 0.12 * k;
  }
}
