// Decorul fiecărei teme (doar de privit, nu se atinge).
// Fiecare decor e făcut din puține obiecte, ca să nu încetinească telefonul.
import * as THREE from 'three';

export type Tema = 'luna' | 'asteroizi' | 'statie' | 'vulcan' | 'gaura' | 'nebuloasa' | 'laborator' | 'gheata' | 'fortareata' | 'cometa' | 'gravitatie' | 'turn' | 'aur';

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
    case 'laborator': return decorLaborator();
    case 'gheata': return decorGheata();
    case 'fortareata': return decorFortareata();
    case 'cometa': return decorCometa();
    case 'gravitatie': return decorGravitatie();
    case 'turn': return decorTurn();
    case 'aur': return decorAur();
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

function decorLaborator(): Decor {
  // Un laborator plutitor: o grilă uriașă de lumini dedesubt și stâlpi cu dungi de neon
  const grup = new THREE.Group();
  const grila = new THREE.GridHelper(400, 60, 0x2ee6d6, 0x1a3a6a);
  grila.position.y = -30;
  grup.add(grila);
  const stalp = new THREE.MeshLambertMaterial({ color: 0x2a3150 });
  const neon = new THREE.MeshBasicMaterial({ color: 0xff2a4a });
  for (const [x, z] of [[-30, -20], [30, -40], [-35, -70], [40, -90], [-25, -110], [15, 25]]) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(4, 60, 4), stalp);
    s.position.set(x, 0, z);
    grup.add(s);
    for (const y of [-10, 5, 20]) {
      const d = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.4, 4.2), neon);
      d.position.set(x, y, z);
      grup.add(d);
    }
  }
  return { obiect: grup, fundal: 0x050a1a };
}

function decorGheata(): Decor {
  // O planetă înghețată dedesubt, cristale de gheață care plutesc și fulgi care cad încet
  const grup = planetaCuPete(0xcfe8ff, 0x9fc8ee);
  const n = 40;
  const cristale = new THREE.InstancedMesh(
    new THREE.OctahedronGeometry(1, 0),
    new THREE.MeshLambertMaterial({ color: 0xbff4ff, emissive: 0x205a70, flatShading: true }),
    n,
  );
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), p = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const u = Math.random() * Math.PI * 2, r = 50 + Math.random() * 90;
    p.set(Math.cos(u) * r, -15 + Math.random() * 50, Math.sin(u) * r - 50);
    q.setFromEuler(new THREE.Euler(Math.random(), Math.random() * 3, Math.random()));
    sc.set(1.5, 3 + Math.random() * 5, 1.5);
    cristale.setMatrixAt(i, m.compose(p, q, sc));
  }
  grup.add(cristale);
  // fulgi de zăpadă: 400 de puncte care cad (o singură bucată – foarte ieftin)
  const nr = 400;
  const poz = new Float32Array(nr * 3);
  for (let i = 0; i < nr; i++) {
    poz[i * 3] = (Math.random() - 0.5) * 80;
    poz[i * 3 + 1] = Math.random() * 40 - 10;
    poz[i * 3 + 2] = -Math.random() * 100 + 10;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(poz, 3));
  const fulgi = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 3, sizeAttenuation: false }));
  grup.add(fulgi);
  return {
    obiect: grup,
    fundal: 0x0a1630,
    anima: (timp) => { fulgi.position.y = -((timp * 1.5) % 40); fulgi.position.x = Math.sin(timp * 0.3) * 2; },
  };
}

function decorFortareata(): Decor {
  // Turnurile fortăreței, cu ferestre roșii, și capul uriaș al robotului în depărtare
  const grup = new THREE.Group();
  const zid = new THREE.MeshLambertMaterial({ color: 0x2e2838 });
  const fereastra = new THREE.MeshBasicMaterial({ color: 0xff4a3a });
  for (const [x, z, h] of [[-25, -20, 50], [25, -35, 70], [-30, -65, 60], [45, -80, 55], [-20, -100, 80]]) {
    const turn = new THREE.Mesh(new THREE.BoxGeometry(8, h, 8), zid);
    turn.position.set(x, h / 2 - 30, z);
    grup.add(turn);
    for (let y = -20; y < h - 30; y += 9) {
      const f = new THREE.Mesh(new THREE.BoxGeometry(8.2, 1.2, 2), fereastra);
      f.position.set(x, y, z);
      grup.add(f);
    }
  }
  // capul robotului (prietenos) – departe, în spatele porții
  const cap = new THREE.Group();
  const metal = new THREE.MeshLambertMaterial({ color: 0x6a6f8a });
  cap.add(new THREE.Mesh(new THREE.BoxGeometry(40, 32, 30), metal));
  const ochi = new THREE.MeshBasicMaterial({ color: 0x2ee6d6 });
  for (const x of [-9, 9]) {
    const o = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 1), ochi);
    o.position.set(x, 4, 15.2);
    cap.add(o);
  }
  const gura = new THREE.Mesh(new THREE.BoxGeometry(20, 3, 1), ochi);
  gura.position.set(0, -8, 15.2);
  cap.add(gura);
  const antena = new THREE.Mesh(new THREE.BoxGeometry(2, 12, 2), metal);
  antena.position.y = 22;
  cap.add(antena);
  const bec = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), fereastra);
  bec.position.y = 30;
  cap.add(bec);
  cap.position.set(30, 20, -200);
  grup.add(cap);
  return {
    obiect: grup,
    fundal: 0x14080e,
    anima: (timp) => { bec.visible = Math.floor(timp * 2) % 2 === 0; },
  };
}

function decorCometa(): Decor {
  // O cometă mare care trece pe cer, cu coadă lungă, și o planetă verde-albăstruie dedesubt
  const grup = planetaCuPete(0x3f8f8a, 0x2c6a66);
  const cometa = new THREE.Group();
  const cap = new THREE.Mesh(new THREE.IcosahedronGeometry(8, 0), new THREE.MeshBasicMaterial({ color: 0xe8fbff }));
  const coada = new THREE.Mesh(
    new THREE.ConeGeometry(9, 90, 16, 1, true).rotateZ(-Math.PI / 2).translate(45, 0, 0),
    new THREE.MeshBasicMaterial({ color: 0x9ffcf3, transparent: true, opacity: 0.25, depthWrite: false, side: THREE.DoubleSide }),
  );
  cometa.add(cap, coada);
  cometa.position.set(-60, 70, -220);
  cometa.rotation.z = -0.35;
  grup.add(cometa);
  return {
    obiect: grup, fundal: 0x071428,
    anima: (timp) => { cap.rotation.y = timp * 0.5; cometa.position.x = -60 + Math.sin(timp * 0.05) * 30; },
  };
}

function decorGravitatie(): Decor {
  // Pietre care plutesc încet în sus și în jos, și o planetă mare cu inel, aproape
  const d = decorAsteroizi();
  const grup = d.obiect as THREE.Group;
  const planeta = new THREE.Mesh(new THREE.SphereGeometry(70, 28, 18), new THREE.MeshLambertMaterial({ color: 0xb59be0 }));
  planeta.position.set(-120, 10, -180);
  const inel = new THREE.Mesh(new THREE.RingGeometry(95, 125, 48),
    new THREE.MeshBasicMaterial({ color: 0xe0d0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.4 }));
  inel.position.copy(planeta.position);
  inel.rotation.set(1.2, 0.3, 0);
  grup.add(planeta, inel);
  return { obiect: grup, fundal: 0x170f2e, anima: (timp) => { d.anima?.(timp); grup.position.y = Math.sin(timp * 0.4) * 2; } };
}

function decorTurn(): Decor {
  // Inele mari care se învârt în jurul turnului, la înălțimi diferite
  const grup = new THREE.Group();
  const inele: THREE.Mesh[] = [];
  const culori = [0x2ee6d6, 0x8a6cff, 0xff5fa8];
  [6, 16, 26].forEach((y, i) => {
    const inel = new THREE.Mesh(new THREE.TorusGeometry(13, 0.25, 6, 48),
      new THREE.MeshBasicMaterial({ color: culori[i], transparent: true, opacity: 0.6 }));
    inel.position.set(0, y, -30);
    inel.rotation.x = Math.PI / 2;
    inele.push(inel);
    grup.add(inel);
  });
  const nori = planetaCuPete(0x6a7fb8, 0x4a5f98);
  grup.add(nori);
  return {
    obiect: grup, fundal: 0x0b1a3a,
    anima: (timp) => inele.forEach((inel, i) => { inel.rotation.z = timp * (0.2 + i * 0.1); inel.rotation.x = Math.PI / 2 + Math.sin(timp * 0.3 + i) * 0.15; }),
  };
}

function decorAur(): Decor {
  // Piramide de aur la orizont și un soare auriu
  const grup = new THREE.Group();
  const aur = new THREE.MeshLambertMaterial({ color: 0xd8a83a, emissive: 0x3a2400, flatShading: true });
  for (const [x, z, h] of [[-70, -130, 60], [60, -160, 80], [-20, -220, 100], [110, -90, 45]]) {
    const p = new THREE.Mesh(new THREE.ConeGeometry(h * 0.75, h, 4), aur);
    p.position.set(x, h / 2 - 40, z);
    p.rotation.y = Math.PI / 4;
    grup.add(p);
  }
  const soare = new THREE.Mesh(new THREE.SphereGeometry(25, 20, 14), new THREE.MeshBasicMaterial({ color: 0xffe28a }));
  soare.position.set(40, 60, -250);
  grup.add(soare);
  return { obiect: grup, fundal: 0x1a1206 };
}
