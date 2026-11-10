// Magazinul de accesorii: pălării, cască, antene, ochelari, mantie, rucsac-rachetă...
// Toate sunt făcute din cuburi colorate. Se cumpără cu monedele strânse în joc
// (NU cu bani adevărați).
import * as THREE from 'three';

/** Unde se pune un accesoriu: pe cap, pe față sau în spate */
export type Slot = 'cap' | 'fata' | 'spate' | 'umar';
export const SLOTURI: Slot[] = ['cap', 'fata', 'spate', 'umar'];

export interface Accesoriu {
  id: string;
  nume: string;
  emoji: string;
  pret: number;
  slot: Slot;
  construieste: () => THREE.Object3D;
  /** Accesoriu secret: nu se cumpără, se câștigă (cu toate stelele secrete) */
  secret?: boolean;
}

const CUB = new THREE.BoxGeometry(1, 1, 1);

function cub(l: number, h: number, a: number, culoare: number, x = 0, y = 0, z = 0, extra: THREE.MeshLambertMaterialParameters = {}) {
  const m = new THREE.Mesh(CUB, new THREE.MeshLambertMaterial({ color: culoare, ...extra }));
  m.scale.set(l, h, a);
  m.position.set(x, y, z);
  return m;
}

function grup(...copii: THREE.Object3D[]) {
  const g = new THREE.Group();
  g.add(...copii);
  return g;
}

// Pentru „cap” și „fata”, (0,0,0) e centrul capului; capul are 0,52 pe fiecare latură.
// Pentru „spate”, (0,0,0) e mijlocul spatelui. Pentru „umar”, (0,0,0) e deasupra umărului stâng.
export const CATALOG: Accesoriu[] = [
  {
    id: 'sapca', nume: 'Șapcă', emoji: '🧢', pret: 10, slot: 'cap',
    construieste: () => grup(
      cub(0.6, 0.2, 0.6, 0xe84a4a, 0, 0.36, 0),
      cub(0.58, 0.05, 0.3, 0xe84a4a, 0, 0.28, 0.4),
      cub(0.1, 0.06, 0.1, 0xffffff, 0, 0.48, 0),
    ),
  },
  {
    id: 'ochelari', nume: 'Ochelari de soare', emoji: '🕶️', pret: 15, slot: 'fata',
    construieste: () => grup(
      cub(0.56, 0.04, 0.03, 0x111111, 0, 0.1, 0.275),
      cub(0.19, 0.13, 0.03, 0x1a1a2e, -0.12, 0.04, 0.28),
      cub(0.19, 0.13, 0.03, 0x1a1a2e, 0.12, 0.04, 0.28),
      cub(0.04, 0.04, 0.3, 0x111111, -0.28, 0.1, 0.13),
      cub(0.04, 0.04, 0.3, 0x111111, 0.28, 0.1, 0.13),
    ),
  },
  {
    id: 'antene', nume: 'Antene de extraterestru', emoji: '📡', pret: 20, slot: 'cap',
    construieste: () => grup(
      cub(0.04, 0.38, 0.04, 0x9aa6bd, -0.15, 0.52, 0),
      cub(0.04, 0.38, 0.04, 0x9aa6bd, 0.15, 0.52, 0),
      cub(0.12, 0.12, 0.12, 0x2ee6d6, -0.15, 0.74, 0, { emissive: 0x0a5a54 }),
      cub(0.12, 0.12, 0.12, 0x2ee6d6, 0.15, 0.74, 0, { emissive: 0x0a5a54 }),
    ),
  },
  {
    id: 'joben', nume: 'Joben', emoji: '🎩', pret: 30, slot: 'cap',
    construieste: () => grup(
      cub(0.72, 0.05, 0.72, 0x1c1c24, 0, 0.4, 0),
      cub(0.46, 0.5, 0.46, 0x1c1c24, 0, 0.66, 0),
      cub(0.47, 0.08, 0.47, 0xe84a4a, 0, 0.47, 0),
    ),
  },
  {
    id: 'mantie', nume: 'Mantie de erou', emoji: '🦸', pret: 35, slot: 'spate',
    construieste: () => {
      // mantia se prinde sus, la umeri, și flutură când alergi
      const prindere = new THREE.Group();
      prindere.position.set(0, 0.32, -0.02);
      prindere.add(cub(0.74, 1.05, 0.04, 0xd8304a, 0, -0.52, -0.02));
      prindere.add(cub(0.8, 0.08, 0.06, 0xffd23f, 0, 0, 0));
      prindere.userData.flutura = true;
      return prindere;
    },
  },
  {
    id: 'casca', nume: 'Cască de astronaut', emoji: '👨‍🚀', pret: 45, slot: 'cap',
    construieste: () => grup(
      cub(0.76, 0.1, 0.76, 0xf2f4f8, 0, 0.42, 0),
      cub(0.76, 0.8, 0.1, 0xf2f4f8, 0, 0.02, -0.33),
      cub(0.1, 0.8, 0.76, 0xf2f4f8, -0.33, 0.02, 0),
      cub(0.1, 0.8, 0.76, 0xf2f4f8, 0.33, 0.02, 0),
      cub(0.76, 0.12, 0.76, 0x2ee6d6, 0, -0.34, 0),  // gulerul
      cub(0.58, 0.58, 0.02, 0x9ffcf3, 0, 0.04, 0.335, { transparent: true, opacity: 0.3 }), // vizieră
      cub(0.04, 0.2, 0.04, 0x9aa6bd, 0.2, 0.55, 0),
      cub(0.08, 0.08, 0.08, 0xff9a3c, 0.2, 0.67, 0, { emissive: 0x803000 }),
    ),
  },
  {
    id: 'racheta', nume: 'Rucsac-rachetă', emoji: '🚀', pret: 55, slot: 'spate',
    construieste: () => {
      const g = grup(
        cub(0.5, 0.5, 0.12, 0x9aa6bd, 0, 0.05, -0.06),
        cub(0.2, 0.6, 0.22, 0xf2f4f8, -0.15, 0.02, -0.2),
        cub(0.2, 0.6, 0.22, 0xf2f4f8, 0.15, 0.02, -0.2),
        cub(0.2, 0.12, 0.22, 0xe84a4a, -0.15, 0.36, -0.2),
        cub(0.2, 0.12, 0.22, 0xe84a4a, 0.15, 0.36, -0.2),
      );
      // flăcările de jos (pâlpâie)
      const flacara = grup(
        cub(0.14, 0.22, 0.14, 0xff9a3c, -0.15, -0.38, -0.2, { emissive: 0xc04000 }),
        cub(0.14, 0.22, 0.14, 0xff9a3c, 0.15, -0.38, -0.2, { emissive: 0xc04000 }),
      );
      g.add(flacara);
      g.userData.flacara = flacara;
      return g;
    },
  },
  {
    id: 'coroana', nume: 'Coroană de aur', emoji: '👑', pret: 80, slot: 'cap',
    construieste: () => {
      const aur = 0xffd23f;
      const g = grup(
        cub(0.6, 0.14, 0.06, aur, 0, 0.42, 0.27, { emissive: 0x5a4000 }),
        cub(0.6, 0.14, 0.06, aur, 0, 0.42, -0.27, { emissive: 0x5a4000 }),
        cub(0.06, 0.14, 0.6, aur, -0.27, 0.42, 0, { emissive: 0x5a4000 }),
        cub(0.06, 0.14, 0.6, aur, 0.27, 0.42, 0, { emissive: 0x5a4000 }),
        cub(0.08, 0.06, 0.03, 0xe84a4a, 0, 0.42, 0.3),   // rubin
      );
      // zimții coroanei
      for (const [x, z] of [[-0.27, 0.27], [0.27, 0.27], [-0.27, -0.27], [0.27, -0.27], [0, 0.27], [0, -0.27]])
        g.add(cub(0.08, 0.12, 0.08, aur, x, 0.55, z, { emissive: 0x5a4000 }));
      return g;
    },
  },
  {
    id: 'aripi', nume: 'Aripi de stea', emoji: '✨', pret: 0, slot: 'spate', secret: true,
    construieste: () => {
      // două aripi din cuburi turcoaz și aurii, care bat ușor din aripi
      const g = new THREE.Group();
      for (const parte of [-1, 1]) {
        const aripa = new THREE.Group();
        aripa.position.set(parte * 0.12, 0.25, -0.08);
        const pene: [number, number, number, number][] = [
          [0.3, 0.42, 0x2ee6d6, 0], [0.62, 0.32, 0x9ffcf3, 0.06], [0.9, 0.22, 0xffd23f, 0.12],
        ];
        for (const [x, h, c, y] of pene)
          aripa.add(cub(0.34, h, 0.05, c, parte * x, y, 0, { emissive: c, emissiveIntensity: 0.25 }));
        aripa.userData.parte = parte;
        g.add(aripa);
      }
      g.userData.aripi = true;
      return g;
    },
  },
  // --- accesorii noi (ideile lui Mihai) ---
  {
    id: 'mustata', nume: 'Mustață', emoji: '🥸', pret: 10, slot: 'fata',
    construieste: () => grup(
      cub(0.22, 0.06, 0.03, 0x3a2410, 0, -0.08, 0.28),
      cub(0.08, 0.05, 0.03, 0x3a2410, -0.14, -0.1, 0.28),
      cub(0.08, 0.05, 0.03, 0x3a2410, 0.14, -0.1, 0.28),
    ),
  },
  {
    id: 'bandana', nume: 'Bandană', emoji: '🥷', pret: 15, slot: 'cap',
    construieste: () => {
      const rosu = 0xd8304a;
      const g = grup(
        cub(0.58, 0.13, 0.58, rosu, 0, 0.17, 0),
        cub(0.1, 0.1, 0.06, rosu, 0, 0.17, -0.31),            // nodul
        cub(0.08, 0.22, 0.04, rosu, -0.06, 0.04, -0.33),        // capetele care atârnă
        cub(0.08, 0.18, 0.04, rosu, 0.07, 0.06, -0.33),
      );
      // buline albe
      for (const [x, z] of [[-0.18, 0.295], [0.05, 0.295], [0.22, 0.295]]) g.add(cub(0.05, 0.05, 0.01, 0xffffff, x, 0.17, z));
      return g;
    },
  },
  {
    id: 'casti', nume: 'Căști audio', emoji: '🎧', pret: 25, slot: 'cap',
    construieste: () => grup(
      cub(0.08, 0.1, 0.5, 0x2a2a33, 0, 0.44, 0),               // arcul de deasupra
      cub(0.06, 0.34, 0.08, 0x2a2a33, -0.31, 0.24, 0),
      cub(0.06, 0.34, 0.08, 0x2a2a33, 0.31, 0.24, 0),
      cub(0.1, 0.22, 0.22, 0x2ee6d6, -0.31, 0.0, 0),          // căștile
      cub(0.1, 0.22, 0.22, 0x2ee6d6, 0.31, 0.0, 0),
    ),
  },
  {
    id: 'pirat', nume: 'Pălărie de pirat', emoji: '🏴‍☠️', pret: 40, slot: 'cap',
    construieste: () => grup(
      cub(0.86, 0.06, 0.5, 0x1c1c24, 0, 0.38, 0),              // borul
      cub(0.56, 0.24, 0.42, 0x1c1c24, 0, 0.52, 0),
      cub(0.2, 0.18, 0.12, 0x1c1c24, -0.38, 0.48, 0),          // colțurile ridicate
      cub(0.2, 0.18, 0.12, 0x1c1c24, 0.38, 0.48, 0),
      cub(0.12, 0.12, 0.02, 0xffffff, 0, 0.52, 0.215),          // craniu mic și simpatic
      cub(0.03, 0.03, 0.01, 0x1c1c24, -0.03, 0.54, 0.227),
      cub(0.03, 0.03, 0.01, 0x1c1c24, 0.03, 0.54, 0.227),
    ),
  },
  {
    id: 'balon-aur', nume: 'Balon de aur', emoji: '🎈', pret: 60, slot: 'umar',
    construieste: () => {
      const g = new THREE.Group();
      g.add(cub(0.02, 1.1, 0.02, 0xffffff, 0, 0.55, 0));        // sfoara
      const balon = grup(
        cub(0.46, 0.52, 0.46, 0xffd23f, 0, 0, 0, { emissive: 0x6a4a00 }),
        cub(0.36, 0.62, 0.36, 0xffd23f, 0, 0, 0, { emissive: 0x6a4a00 }),
        cub(0.1, 0.08, 0.1, 0xe0a800, 0, -0.33, 0),             // nodul
        cub(0.08, 0.14, 0.02, 0xfff3c0, -0.1, 0.12, 0.24),       // luciu
      );
      balon.position.y = 1.4;
      g.add(balon);
      g.userData.balon = true;
      return g;
    },
  },
  {
    id: 'papagal', nume: 'Papagal', emoji: '🦜', pret: 70, slot: 'umar',
    construieste: () => {
      const g = grup(
        cub(0.2, 0.26, 0.2, 0x3fbf5a, 0, 0.13, 0),               // corp
        cub(0.18, 0.16, 0.18, 0xe84a4a, 0, 0.33, 0.02),          // cap
        cub(0.07, 0.06, 0.1, 0xffd23f, 0, 0.31, 0.15),           // cioc
        cub(0.04, 0.04, 0.01, 0x111111, -0.07, 0.36, 0.1),        // ochi
        cub(0.04, 0.04, 0.01, 0x111111, 0.07, 0.36, 0.1),
        cub(0.06, 0.22, 0.16, 0x2a8fd8, -0.12, 0.13, -0.02),     // aripi
        cub(0.06, 0.22, 0.16, 0x2a8fd8, 0.12, 0.13, -0.02),
        cub(0.08, 0.06, 0.26, 0x2a8fd8, 0, 0.0, -0.18),          // coada
      );
      g.userData.papagal = true;
      return g;
    },
  },
];

export function cautaAccesoriu(id: string | undefined) {
  return CATALOG.find((a) => a.id === id);
}
