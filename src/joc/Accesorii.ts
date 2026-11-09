// Magazinul de accesorii: pălării, cască, antene, ochelari, mantie, rucsac-rachetă...
// Toate sunt făcute din cuburi colorate. Se cumpără cu monedele strânse în joc
// (NU cu bani adevărați).
import * as THREE from 'three';

/** Unde se pune un accesoriu: pe cap, pe față sau în spate */
export type Slot = 'cap' | 'fata' | 'spate';

export interface Accesoriu {
  id: string;
  nume: string;
  emoji: string;
  pret: number;
  slot: Slot;
  construieste: () => THREE.Object3D;
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
// Pentru „spate”, (0,0,0) e mijlocul spatelui.
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
];

export function cautaAccesoriu(id: string | undefined) {
  return CATALOG.find((a) => a.id === id);
}
