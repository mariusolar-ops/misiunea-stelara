// Decorul fiecărei teme (doar de privit, nu se atinge).
// Fiecare decor e făcut din puține obiecte, ca să nu încetinească telefonul.
import * as THREE from 'three';

export type Tema = 'luna' | 'asteroizi' | 'statie' | 'vulcan' | 'gaura' | 'nebuloasa';

export interface Decor {
  obiect: THREE.Object3D;
  /** Culoarea cerului pentru tema asta */
  fundal: number;
  /** Animație opțională (ex. asteroizi care se rotesc) */
  anima?: (timp: number) => void;
}

export function creeazaDecor(tema: Tema): Decor {
  switch (tema) {
    case 'luna': return decorLuna();
    case 'asteroizi': return decorAsteroizi();
    case 'statie': return decorStatie();
    case 'vulcan': return decorVulcan();
    case 'gaura': return decorGauraNeagra();
    case 'nebuloasa': return decorNebuloasa();
  }
}

/** Un punct la întâmplare pe partea de sus a unei sfere */
function punctSus(centru: THREE.Vector3, raza: number, minU = 0.75) {
  const u = minU + Math.random() * (1 - minU), t = Math.random() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  const n = new THREE.Vector3(s * Math.cos(t), u, s * Math.sin(t));
  return { poz: centru.clone().addScaledVector(n, raza), normala: n };
}

/** O planetă mare dedesubt, cu „pete” (cratere sau lavă) */
function planetaCuPete(culoare: number, culoarePete: number, emisivPete = 0x000000) {
  const grup = new THREE.Group();
  const centru = new THREE.Vector3(0, -265, -40);
  const planeta = new THREE.Mesh(
    new THREE.SphereGeometry(220, 32, 20),
    new THREE.MeshLambertMaterial({ color: culoare, flatShading: true }),
  );
  planeta.position.copy(centru);
  grup.add(planeta);
  const matPata = new THREE.MeshLambertMaterial({ color: culoarePete, emissive: emisivPete });
  for (let i = 0; i < 14; i++) {
    const pata = new THREE.Mesh(new THREE.CircleGeometry(6 + Math.random() * 14, 14), matPata);
    const { poz, normala } = punctSus(centru, 220.5);
    pata.position.copy(poz);
    pata.lookAt(poz.clone().add(normala));
    grup.add(pata);
  }
  return grup;
}

function decorLuna(): Decor {
  return { obiect: planetaCuPete(0x9a9fb3, 0x6d7287), fundal: 0x0b0f2e };
}

function decorAsteroizi(): Decor {
  // 120 de pietre într-un inel mare – desenate toate deodată (InstancedMesh)
  const n = 120;
  const pietre = new THREE.InstancedMesh(
    new THREE.DodecahedronGeometry(1, 0),
    new THREE.MeshLambertMaterial({ color: 0x8c7b6b, flatShading: true }),
    n,
  );
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const unghi = Math.random() * Math.PI * 2;
    const raza = 90 + Math.random() * 60;
    p.set(Math.cos(unghi) * raza, -10 + (Math.random() - 0.5) * 30, Math.sin(unghi) * raza - 40);
    q.setFromEuler(new THREE.Euler(Math.random() * 3, Math.random() * 3, Math.random() * 3));
    s.setScalar(2 + Math.random() * 7);
    pietre.setMatrixAt(i, m.compose(p, q, s));
  }
  const grup = new THREE.Group();
  grup.add(pietre);
  // o planetă maro-roșcată departe
  const planeta = new THREE.Mesh(new THREE.SphereGeometry(50, 24, 16), new THREE.MeshLambertMaterial({ color: 0xc9774a }));
  planeta.position.set(60, -80, -200);
  grup.add(planeta);
  return {
    obiect: grup,
    fundal: 0x120d2a,
    anima: (timp) => { pietre.rotation.y = timp * 0.01; },
  };
}

function decorStatie(): Decor {
  const grup = new THREE.Group();
  const alb = new THREE.MeshLambertMaterial({ color: 0xdfe6f2 });
  const panou = new THREE.MeshLambertMaterial({ color: 0x2a4fb8, emissive: 0x0a1540 });
  const lumina = new THREE.MeshBasicMaterial({ color: 0x2ee6d6 });
  // modulele mari ale stației (cilindri), departe în jur
  const pozitii: [number, number, number][] = [[-60, -20, -60], [70, -10, -90], [-40, 10, -160]];
  for (const [x, y, z] of pozitii) {
    const modul = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 40, 16), alb);
    modul.position.set(x, y, z);
    modul.rotation.z = Math.PI / 2;
    grup.add(modul);
    // panouri solare de o parte și de alta
    for (const d of [-1, 1]) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(14, 0.5, 30), panou);
      p.position.set(x, y, z + d * 26);
      grup.add(p);
    }
    // inel de lumini turcoaz
    const inel = new THREE.Mesh(new THREE.TorusGeometry(8.4, 0.5, 6, 20), lumina);
    inel.position.set(x, y, z);
    inel.rotation.y = Math.PI / 2;
    grup.add(inel);
  }
  // Pământul albastru jos de tot
  const pamant = new THREE.Mesh(new THREE.SphereGeometry(200, 32, 20), new THREE.MeshLambertMaterial({ color: 0x2f6fd6, emissive: 0x0a1e45 }));
  pamant.position.set(0, -260, -80);
  grup.add(pamant);
  return { obiect: grup, fundal: 0x070b24 };
}

function decorVulcan(): Decor {
  const grup = planetaCuPete(0x4a2e2e, 0xff5a1f, 0xb02000); // planetă închisă cu „lacuri” de lavă
  // câțiva vulcani (conuri) la orizont, cu vârf aprins
  const munte = new THREE.MeshLambertMaterial({ color: 0x3a2626, flatShading: true });
  const varf = new THREE.MeshBasicMaterial({ color: 0xff7a2f });
  for (const [x, z, h] of [[-90, -120, 50], [80, -150, 70], [-30, -220, 60]]) {
    const con = new THREE.Mesh(new THREE.ConeGeometry(h * 0.8, h, 7), munte);
    con.position.set(x, -45 + h / 2, z);
    grup.add(con);
    const foc = new THREE.Mesh(new THREE.ConeGeometry(h * 0.15, h * 0.15, 7), varf);
    foc.position.set(x, -45 + h - h * 0.07, z);
    grup.add(foc);
  }
  return { obiect: grup, fundal: 0x1a0812 };
}

function decorGauraNeagra(): Decor {
  const grup = new THREE.Group();
  const centru = new THREE.Vector3(10, 8, -240);
  // gaura neagră: o sferă neagră cu un disc colorat care se rotește în jurul ei
  const gaura = new THREE.Mesh(new THREE.SphereGeometry(30, 24, 16), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  gaura.position.copy(centru);
  grup.add(gaura);
  const disc = new THREE.Mesh(
    new THREE.RingGeometry(36, 90, 48, 1),
    new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, transparent: true, opacity: 0.85 }),
  );
  // culori de la portocaliu (lângă gaură) la mov (spre margine)
  const poz = disc.geometry.attributes.position;
  const culori = new Float32Array(poz.count * 3);
  const c1 = new THREE.Color(0xffb04a), c2 = new THREE.Color(0x8a6cff), c = new THREE.Color();
  for (let i = 0; i < poz.count; i++) {
    const r = Math.hypot(poz.getX(i), poz.getY(i));
    c.copy(c1).lerp(c2, (r - 36) / 54);
    culori.set([c.r, c.g, c.b], i * 3);
  }
  disc.geometry.setAttribute('color', new THREE.BufferAttribute(culori, 3));
  disc.position.copy(centru);
  disc.rotation.x = -Math.PI / 2.6;
  grup.add(disc);
  // un inel subțire luminos chiar pe marginea găurii
  const halou = new THREE.Mesh(new THREE.RingGeometry(30, 33, 48), new THREE.MeshBasicMaterial({ color: 0xffe2a8, side: THREE.DoubleSide }));
  halou.position.copy(centru);
  grup.add(halou);
  return {
    obiect: grup,
    fundal: 0x0a0418,
    anima: (timp) => { disc.rotation.z = timp * 0.15; halou.lookAt(0, 10, 0); },
  };
}

function decorNebuloasa(): Decor {
  // Nori colorați de gaz (sfere mari, aproape transparente) – arată ca o nebuloasă
  const grup = new THREE.Group();
  const nori: [number, number, number, number, number][] = [
    [-120, 20, -200, 70, 0xff5fa8], [90, -10, -230, 80, 0x8a6cff], [0, 60, -300, 90, 0x2ee6d6],
    [-60, -60, -150, 60, 0xffb04a], [150, 50, -120, 55, 0xd36bff],
  ];
  for (const [x, y, z, r, c] of nori) {
    const nor = new THREE.Mesh(
      new THREE.SphereGeometry(r, 16, 12),
      new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.18, depthWrite: false }),
    );
    nor.position.set(x, y, z);
    grup.add(nor);
    // un miez mai luminos în fiecare nor
    const miez = new THREE.Mesh(
      new THREE.SphereGeometry(r * 0.45, 12, 8),
      new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.25, depthWrite: false }),
    );
    miez.position.set(x, y, z);
    grup.add(miez);
  }
  return { obiect: grup, fundal: 0x1a0b33, anima: (timp) => { grup.rotation.y = Math.sin(timp * 0.05) * 0.1; } };
}
