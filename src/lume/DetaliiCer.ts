// Detalii pe cer, pentru TOATE nivelurile (ideea lui Mihai: „mai detaliate, cum ar fi planetele”):
//  - 2-3 planete în culorile temei: unele cu inele, unele cu o lună care se învârte în jurul lor
//  - o galaxie în spirală, departe (o singură bucată de puncte – foarte ieftin)
//  - stele căzătoare din când în când
//  - un OZN prietenos sau un satelit care trece pe cer
// Fiecare temă primește alt „aranjament”, dar mereu același (nu se schimbă la fiecare joc).
import * as THREE from 'three';

/** Numere „la întâmplare”, dar mereu aceleași pentru aceeași temă */
function generator(samanta: string) {
  let h = 2166136261;
  for (const c of samanta) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETE: Record<string, number[]> = {
  luna: [0x8a9ac8, 0xd8a070, 0x6ad0c8], asteroizi: [0xc9774a, 0x9a8878, 0x6a8fd8],
  statie: [0x2f6fd6, 0xd8d0b0, 0xff9a3c], vulcan: [0xff5a1f, 0x8a3a2a, 0xffb04a],
  gaura: [0x8a6cff, 0xff5fa8, 0x3a2a6b], nebuloasa: [0xff5fa8, 0x8a6cff, 0x2ee6d6],
  laborator: [0x2ee6d6, 0x4a6fd8, 0xff2a4a], gheata: [0xbfe8ff, 0x6a9fd8, 0xffffff],
  fortareata: [0xb03a3a, 0x6a6f8a, 0xffb02e], cometa: [0x3f8f8a, 0x9ffcf3, 0xd8a070],
  gravitatie: [0xb59be0, 0xffd0a0, 0x7ad0ff], turn: [0x7fa0e0, 0xffd23f, 0xff5fa8],
  aur: [0xffc23f, 0xd8a83a, 0xfff0b0],
  magnetic: [0x8a3aff, 0xd8304a, 0xc0c8e0], portale: [0x8a6cff, 0x2ee6d6, 0xff5fa8],
  labirint: [0x9ae8ff, 0x4a8fd8, 0xffffff], meteori: [0x8a5a3a, 0xff7a2f, 0x6a6a7a],
  nori: [0xffd8ec, 0x9ec5ee, 0xffffff], ocean: [0x2ee6d6, 0x2a6fd8, 0xffd23f],
  curcubeu: [0xff5f5f, 0xffd23f, 0x2ee6d6], ozn: [0x6ad04a, 0xb8c0d0, 0xff5fa8], bomboane: [0xff5fa8, 0xffd23f, 0x2ee6d6],
};

export interface Detalii {
  obiect: THREE.Object3D;
  anima: (timp: number) => void;
}

export function creeazaDetaliiCer(tema: string): Detalii {
  const rnd = generator(tema);
  const paleta = PALETE[tema] ?? [0x8a9ac8, 0xd8a070, 0x6ad0c8];
  const grup = new THREE.Group();
  const animatii: ((timp: number) => void)[] = [];

  // --- planete ---
  const nrPlanete = 2 + Math.floor(rnd() * 2);
  for (let i = 0; i < nrPlanete; i++) {
    const unghi = rnd() * Math.PI * 2;
    const dist = 230 + rnd() * 120;
    const raza = 10 + rnd() * 22;
    const poz = new THREE.Vector3(Math.cos(unghi) * dist, 20 + rnd() * 90, Math.sin(unghi) * dist - 60);
    const culoare = paleta[i % paleta.length];
    const planeta = new THREE.Mesh(
      new THREE.SphereGeometry(raza, 20, 14),
      new THREE.MeshLambertMaterial({ color: culoare, emissive: new THREE.Color(culoare).multiplyScalar(0.25), flatShading: rnd() < 0.5 }),
    );
    planeta.position.copy(poz);
    grup.add(planeta);
    // o „bandă” mai închisă, ca la planetele gazoase
    const banda = new THREE.Mesh(new THREE.CylinderGeometry(raza * 1.003, raza * 1.003, raza * 0.25, 20, 1, true),
      new THREE.MeshLambertMaterial({ color: new THREE.Color(culoare).multiplyScalar(0.7) }));
    banda.position.copy(poz);
    grup.add(banda);
    if (rnd() < 0.55) {
      const inel = new THREE.Mesh(new THREE.RingGeometry(raza * 1.4, raza * 2.1, 40),
        new THREE.MeshBasicMaterial({ color: paleta[(i + 1) % paleta.length], side: THREE.DoubleSide, transparent: true, opacity: 0.45, depthWrite: false }));
      inel.position.copy(poz);
      inel.rotation.set(1.1 + rnd() * 0.6, rnd(), rnd() * 0.5);
      grup.add(inel);
    }
    if (rnd() < 0.6) {
      // o lună mică ce se învârte în jurul planetei
      const luna = new THREE.Mesh(new THREE.SphereGeometry(raza * 0.22, 10, 8), new THREE.MeshLambertMaterial({ color: 0xcfd4e0 }));
      grup.add(luna);
      const orbita = raza * 2.6, viteza = 0.1 + rnd() * 0.15, faza = rnd() * 6;
      animatii.push((timp) => luna.position.set(
        poz.x + Math.cos(timp * viteza + faza) * orbita, poz.y + Math.sin(timp * viteza + faza) * orbita * 0.3, poz.z + Math.sin(timp * viteza + faza) * orbita));
    }
  }

  // --- galaxie în spirală ---
  const n = 700;
  const pozGal = new Float32Array(n * 3), culGal = new Float32Array(n * 3);
  const c1 = new THREE.Color(paleta[0]), c2 = new THREE.Color(0xffffff), c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const brat = i % 2, r = Math.pow(rnd(), 0.6) * 40;
    const u = r * 0.18 + brat * Math.PI + (rnd() - 0.5) * 0.5;
    pozGal[i * 3] = Math.cos(u) * r; pozGal[i * 3 + 1] = (rnd() - 0.5) * 3; pozGal[i * 3 + 2] = Math.sin(u) * r;
    c.copy(c2).lerp(c1, r / 40);
    culGal.set([c.r, c.g, c.b], i * 3);
  }
  const geoGal = new THREE.BufferGeometry();
  geoGal.setAttribute('position', new THREE.BufferAttribute(pozGal, 3));
  geoGal.setAttribute('color', new THREE.BufferAttribute(culGal, 3));
  const galaxie = new THREE.Points(geoGal, new THREE.PointsMaterial({ size: 2, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.85 }));
  const ug = rnd() * Math.PI * 2;
  galaxie.position.set(Math.cos(ug) * 330, 110 + rnd() * 60, Math.sin(ug) * 330 - 60);
  galaxie.rotation.set(0.9 + rnd() * 0.6, 0, rnd());
  grup.add(galaxie);
  animatii.push((timp) => { galaxie.rotation.y = timp * 0.02; });

  // --- stele căzătoare (două, care trec din când în când) ---
  const matStea = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
  for (let i = 0; i < 2; i++) {
    const stea = new THREE.Mesh(new THREE.BoxGeometry(14, 0.35, 0.35), matStea);
    grup.add(stea);
    const perioada = 7 + rnd() * 6, faza = rnd() * perioada;
    const start = new THREE.Vector3((rnd() - 0.5) * 300, 120 + rnd() * 60, -150 - rnd() * 150);
    const dir = new THREE.Vector3(1, -0.45, 0.2).normalize();
    stea.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
    animatii.push((timp) => {
      const t = ((timp + faza) % perioada) / 1.2; // zboară 1,2 secunde, apoi pauză
      stea.visible = t < 1;
      if (t < 1) stea.position.copy(start).addScaledVector(dir, t * 160);
    });
  }

  // --- OZN prietenos sau satelit ---
  const vehicul = new THREE.Group();
  if (rnd() < 0.5) {
    const corp = new THREE.Mesh(new THREE.CylinderGeometry(3, 4.5, 1.2, 12), new THREE.MeshLambertMaterial({ color: 0xb8c0d0 }));
    const cupola = new THREE.Mesh(new THREE.SphereGeometry(1.8, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x9ffcf3, transparent: true, opacity: 0.7 }));
    cupola.position.y = 0.5;
    vehicul.add(corp, cupola);
    const lumini = new THREE.MeshBasicMaterial({ color: 0xffd23f });
    for (let k = 0; k < 6; k++) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), lumini);
      l.position.set(Math.cos((k / 6) * Math.PI * 2) * 3.8, -0.2, Math.sin((k / 6) * Math.PI * 2) * 3.8);
      vehicul.add(l);
    }
  } else {
    const corp = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 3), new THREE.MeshLambertMaterial({ color: 0xd8d8e0 }));
    const panou = new THREE.MeshLambertMaterial({ color: 0x2a4fb8, emissive: 0x0a1540 });
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(7, 0.2, 2.4), panou); p1.position.x = -4.5;
    const p2 = p1.clone(); p2.position.x = 4.5;
    const antena = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.5, 0.2), new THREE.MeshBasicMaterial({ color: 0xff4a3a }));
    antena.position.y = 2;
    vehicul.add(corp, p1, p2, antena);
  }
  grup.add(vehicul);
  const raza = 140 + rnd() * 60, inaltime = 55 + rnd() * 40, viteza = 0.03 + rnd() * 0.03;
  animatii.push((timp) => {
    vehicul.position.set(Math.cos(timp * viteza) * raza, inaltime + Math.sin(timp * 0.7) * 3, Math.sin(timp * viteza) * raza - 60);
    vehicul.rotation.y = timp * 0.6;
  });

  return { obiect: grup, anima: (timp) => animatii.forEach((f) => f(timp)) };
}
