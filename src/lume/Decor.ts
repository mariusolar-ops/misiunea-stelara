// Decorul fiecărei teme (doar de privit, nu se atinge).
// Fiecare decor e făcut din puține obiecte, ca să nu încetinească telefonul.
import * as THREE from 'three';
import { creeazaDetaliiCer } from './DetaliiCer';

export type Tema = 'luna' | 'asteroizi' | 'statie' | 'vulcan' | 'gaura' | 'nebuloasa' | 'laborator' | 'gheata' | 'fortareata' | 'cometa' | 'gravitatie' | 'turn' | 'aur'
  | 'magnetic' | 'portale' | 'labirint' | 'meteori' | 'nori' | 'ocean' | 'curcubeu' | 'ozn' | 'bomboane' | 'disco' | 'biblioteca' | 'parc' | 'ciuperci' | 'atelier' | 'muzica' | 'marte' | 'sah' | 'sera' | 'saturn' | 'ceas' | 'jucarii';

export interface Decor {
  obiect: THREE.Object3D;
  /** Culoarea cerului pentru tema asta */
  fundal: number;
  /** Animație opțională (ex. asteroizi care se rotesc) */
  anima?: (timp: number) => void;
}

export function creeazaDecor(tema: Tema): Decor {
  // decorul temei + detaliile de pe cer (planete, galaxie, stele căzătoare, OZN), comune tuturor
  const d = decorTema(tema);
  const detalii = creeazaDetaliiCer(tema);
  const grup = new THREE.Group();
  grup.add(d.obiect, detalii.obiect);
  return { obiect: grup, fundal: d.fundal, anima: (timp) => { d.anima?.(timp); detalii.anima(timp); } };
}

function decorTema(tema: Tema): Decor {
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
    case 'magnetic': return decorMagnetic();
    case 'portale': return decorPortale();
    case 'labirint': return decorLabirint();
    case 'meteori': return decorMeteori();
    case 'nori': return decorNori();
    case 'ocean': return decorOcean();
    case 'curcubeu': return decorCurcubeu();
    case 'ozn': return decorOzn();
    case 'bomboane': return decorBomboane();
    case 'disco': return decorDisco();
    case 'biblioteca': return decorBiblioteca();
    case 'parc': return decorParc();
    case 'ciuperci': return decorCiuperci();
    case 'atelier': return decorAtelier();
    case 'muzica': return decorMuzica();
    case 'marte': return decorMarte();
    case 'sah': return decorSah();
    case 'sera': return decorSera();
    case 'saturn': return decorSaturn();
    case 'ceas': return decorCeas();
    case 'jucarii': return decorJucarii();
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

function decorMagnetic(): Decor {
  // Un magnet uriaș în formă de U și inele de energie mov care pulsează
  const grup = new THREE.Group();
  const rosu = new THREE.MeshLambertMaterial({ color: 0xd8304a }), arg = new THREE.MeshLambertMaterial({ color: 0xd8dce8 });
  const magnet = new THREE.Group();
  const baza = new THREE.Mesh(new THREE.BoxGeometry(40, 10, 10), rosu); baza.position.y = -15;
  for (const x of [-15, 15]) {
    const brat = new THREE.Mesh(new THREE.BoxGeometry(10, 30, 10), rosu); brat.position.set(x, 5, 0); magnet.add(brat);
    const varf = new THREE.Mesh(new THREE.BoxGeometry(10.2, 8, 10.2), arg); varf.position.set(x, 24, 0); magnet.add(varf);
  }
  magnet.add(baza);
  magnet.position.set(-80, 10, -150);
  magnet.rotation.y = 0.5;
  grup.add(magnet);
  const inele: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const inel = new THREE.Mesh(new THREE.TorusGeometry(25 + i * 12, 0.6, 6, 40),
      new THREE.MeshBasicMaterial({ color: 0xb070ff, transparent: true, opacity: 0.4 }));
    inel.position.set(40, 20, -170);
    inele.push(inel);
    grup.add(inel);
  }
  return { obiect: grup, fundal: 0x120826, anima: (timp) => inele.forEach((inel, i) => { inel.scale.setScalar(1 + ((timp * 0.3 + i / 3) % 1) * 0.5); (inel.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - ((timp * 0.3 + i / 3) % 1)); }) };
}

function decorPortale(): Decor {
  // Portale uriașe care se învârt în depărtare
  const grup = new THREE.Group();
  const portale: THREE.Mesh[] = [];
  for (const [x, y, z, r, c] of [[-70, 30, -140, 22, 0x8a6cff], [80, 10, -170, 30, 0x2ee6d6], [0, 60, -260, 40, 0xff5fa8]] as const) {
    const p = new THREE.Mesh(new THREE.TorusGeometry(r, 2, 8, 40), new THREE.MeshBasicMaterial({ color: c }));
    p.position.set(x, y, z);
    portale.push(p);
    grup.add(p);
    const interior = new THREE.Mesh(new THREE.CircleGeometry(r, 32), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.15, depthWrite: false }));
    interior.position.set(x, y, z);
    grup.add(interior);
  }
  return { obiect: grup, fundal: 0x0e0620, anima: (timp) => portale.forEach((p, i) => { p.rotation.z = timp * (0.3 + i * 0.1); }) };
}

function decorLabirint(): Decor {
  // Cristale uriașe în jur și o planetă de cristal dedesubt
  const grup = planetaCuPete(0x6ab0d8, 0x9ae8ff, 0x204a60);
  const mat = new THREE.MeshLambertMaterial({ color: 0x9ae8ff, emissive: 0x1a5a70, flatShading: true });
  for (let i = 0; i < 10; i++) {
    const u = (i / 10) * Math.PI * 2;
    const c = new THREE.Mesh(new THREE.OctahedronGeometry(1, 0), mat);
    c.scale.set(4, 12 + (i % 3) * 6, 4);
    c.position.set(Math.cos(u) * 70, -10, Math.sin(u) * 70 - 20);
    c.rotation.y = u;
    grup.add(c);
  }
  return { obiect: grup, fundal: 0x061628 };
}

function decorMeteori(): Decor {
  // O ploaie de meteoriți care cad încontinuu, departe, cu cozi de foc
  const grup = planetaCuPete(0x5a4a44, 0x2a1a18, 0x401000);
  const meteori: { m: THREE.Group; faza: number; x: number; z: number }[] = [];
  const piatra = new THREE.MeshLambertMaterial({ color: 0x7a5a4a, flatShading: true });
  const foc = new THREE.MeshBasicMaterial({ color: 0xff7a2f, transparent: true, opacity: 0.6, depthWrite: false });
  for (let i = 0; i < 6; i++) {
    const m = new THREE.Group();
    m.add(new THREE.Mesh(new THREE.DodecahedronGeometry(3, 0), piatra));
    const coada = new THREE.Mesh(new THREE.ConeGeometry(2.6, 16, 8).translate(0, 8, 0), foc);
    m.add(coada);
    m.rotation.z = 0.6;
    meteori.push({ m, faza: i / 6, x: -100 + i * 40, z: -120 - (i % 3) * 50 });
    grup.add(m);
  }
  return {
    obiect: grup, fundal: 0x140a0a,
    anima: (timp) => meteori.forEach((o) => { const t = (timp * 0.12 + o.faza) % 1; o.m.position.set(o.x - t * 80, 120 - t * 160, o.z); }),
  };
}

function decorNori(): Decor {
  // Nori pufoși, roz și albi, care plutesc încet (fiecare nor = câteva sfere)
  const grup = new THREE.Group();
  const nori: THREE.Group[] = [];
  const mat = [new THREE.MeshLambertMaterial({ color: 0xffffff }), new THREE.MeshLambertMaterial({ color: 0xffd8ec })];
  for (let i = 0; i < 12; i++) {
    const nor = new THREE.Group();
    for (let k = 0; k < 4; k++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(5 + (k % 2) * 3, 10, 8), mat[i % 2]);
      b.position.set(k * 6 - 9, (k % 2) * 2, 0);
      nor.add(b);
    }
    const u = (i / 12) * Math.PI * 2;
    nor.position.set(Math.cos(u) * (60 + (i % 3) * 30), -15 + (i % 4) * 12, Math.sin(u) * (60 + (i % 3) * 30) - 40);
    nori.push(nor);
    grup.add(nor);
  }
  return { obiect: grup, fundal: 0x2a2a6a, anima: (timp) => nori.forEach((n, i) => { n.position.y += Math.sin(timp * 0.5 + i) * 0.01; n.rotation.y = Math.sin(timp * 0.1 + i) * 0.2; }) };
}

function decorOcean(): Decor {
  // Fundul mării: alge care se leagănă, pești care înoată în cerc și bule care urcă
  const grup = planetaCuPete(0xd8c890, 0xb8a870);
  const algeMat = new THREE.MeshLambertMaterial({ color: 0x2a9a5a, flatShading: true });
  const alge: THREE.Mesh[] = [];
  for (let i = 0; i < 16; i++) {
    const a = new THREE.Mesh(new THREE.ConeGeometry(1.2, 14 + (i % 4) * 4, 5), algeMat);
    const u = (i / 16) * Math.PI * 2;
    a.position.set(Math.cos(u) * (30 + (i % 3) * 12), -32, Math.sin(u) * (30 + (i % 3) * 12) - 45);
    alge.push(a);
    grup.add(a);
  }
  const pesti = new THREE.Group();
  const culoriPesti = [0xffa020, 0xff5fa8, 0x2ee6d6, 0xffd23f];
  for (let i = 0; i < 14; i++) {
    const p = new THREE.Group();
    const c = culoriPesti[i % 4];
    p.add(new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 0.5), new THREE.MeshLambertMaterial({ color: c })));
    const coada = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.2), new THREE.MeshLambertMaterial({ color: c }));
    coada.position.x = -1;
    p.add(coada);
    const u = (i / 14) * Math.PI * 2;
    p.position.set(Math.cos(u) * 25, -5 + (i % 5) * 4, Math.sin(u) * 25);
    p.rotation.y = -u;
    pesti.add(p);
  }
  pesti.position.z = -45;
  grup.add(pesti);
  const nr = 250, poz = new Float32Array(nr * 3);
  for (let i = 0; i < nr; i++) { poz[i * 3] = (Math.random() - 0.5) * 70; poz[i * 3 + 1] = Math.random() * 50 - 20; poz[i * 3 + 2] = -Math.random() * 100 + 10; }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(poz, 3));
  const bule = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xcff8ff, size: 4, sizeAttenuation: false, transparent: true, opacity: 0.6 }));
  grup.add(bule);
  return {
    obiect: grup, fundal: 0x05304a,
    anima: (timp) => {
      alge.forEach((a, i) => { a.rotation.z = Math.sin(timp + i) * 0.15; });
      pesti.rotation.y = -timp * 0.15;
      bule.position.y = (timp * 2) % 50;
    },
  };
}

function decorCurcubeu(): Decor {
  // Curcubee uriașe pe cer (jumătăți de inele colorate)
  const grup = new THREE.Group();
  const culori = [0xff5f5f, 0xff9a3c, 0xffd23f, 0x4ccf6a, 0x2ee6d6, 0x8a6cff];
  for (const [x, z, s, rot] of [[0, -200, 1, 0], [-150, -60, 0.6, 1.2], [140, -100, 0.7, -1]] as const) {
    culori.forEach((c, i) => {
      const arc = new THREE.Mesh(new THREE.TorusGeometry((70 - i * 4) * s, 2 * s, 6, 40, Math.PI), new THREE.MeshBasicMaterial({ color: c }));
      arc.position.set(x, -30, z);
      arc.rotation.y = rot;
      grup.add(arc);
    });
  }
  return { obiect: grup, fundal: 0x1a0a3a };
}

function decorOzn(): Decor {
  // Planeta verde a extratereștrilor, cu farfurii zburătoare care se rotesc pe cer
  const grup = planetaCuPete(0x3a8a4a, 0x6ad04a, 0x103010);
  const farfurii: THREE.Group[] = [];
  for (let i = 0; i < 6; i++) {
    const f = new THREE.Group();
    f.add(new THREE.Mesh(new THREE.CylinderGeometry(3, 4.5, 1, 12), new THREE.MeshLambertMaterial({ color: 0xb8c0d0 })));
    const cupola = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x9ffcf3, transparent: true, opacity: 0.6 }));
    cupola.position.y = 0.4;
    f.add(cupola);
    const raza = new THREE.Mesh(new THREE.ConeGeometry(4, 20, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xc0ffa0, transparent: true, opacity: 0.12, depthWrite: false }));
    raza.position.y = -10.5;
    f.add(raza);
    farfurii.push(f);
    grup.add(f);
  }
  return {
    obiect: grup, fundal: 0x0a1a12,
    anima: (timp) => farfurii.forEach((f, i) => {
      const u = timp * 0.08 + (i / 6) * Math.PI * 2;
      f.position.set(Math.cos(u) * (90 + i * 10), 30 + (i % 3) * 15 + Math.sin(timp + i) * 2, Math.sin(u) * (90 + i * 10) - 50);
      f.rotation.y = timp;
    }),
  };
}

function decorBomboane(): Decor {
  // Acadele uriașe, bastoane de bomboane cu dungi și jeleuri care plutesc
  const grup = new THREE.Group();
  const acadele: THREE.Group[] = [];
  const culori = [0xff5fa8, 0x2ee6d6, 0xffd23f, 0x8a6cff];
  for (let i = 0; i < 6; i++) {
    const a = new THREE.Group();
    const bat = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 40, 8), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    bat.position.y = -20;
    a.add(bat);
    for (let k = 0; k < 3; k++) {
      const inel = new THREE.Mesh(new THREE.TorusGeometry(3 + k * 3, 1.6, 6, 24), new THREE.MeshLambertMaterial({ color: k % 2 ? 0xffffff : culori[i % 4] }));
      a.add(inel);
    }
    const u = (i / 6) * Math.PI * 2;
    a.position.set(Math.cos(u) * 70, 10 + (i % 3) * 8, Math.sin(u) * 70 - 50);
    acadele.push(a);
    grup.add(a);
  }
  // bastoane de bomboane: cuburi roșii și albe pe rând, cu „cârligul” sus
  for (let i = 0; i < 4; i++) {
    const b = new THREE.Group();
    for (let k = 0; k < 10; k++) {
      const c = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 2), new THREE.MeshLambertMaterial({ color: k % 2 ? 0xffffff : 0xe82a2a }));
      c.position.y = k * 3 - 30;
      b.add(c);
    }
    for (let k = 0; k < 3; k++) {
      const c = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshLambertMaterial({ color: k % 2 ? 0xe82a2a : 0xffffff }));
      c.position.set(k * 2, 1 + (k === 2 ? -2 : 0), 0);
      b.add(c);
    }
    b.position.set(-90 + i * 60, 0, -150 - (i % 2) * 40);
    grup.add(b);
  }
  // jeleuri care plutesc (o singură bucată)
  const n = 30;
  const jeleuri = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1.4, 1.6, 8), new THREE.MeshLambertMaterial({ color: 0xffffff }), n);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const u = Math.random() * Math.PI * 2, r = 40 + Math.random() * 80;
    p.set(Math.cos(u) * r, -20 + Math.random() * 50, Math.sin(u) * r - 50);
    q.setFromEuler(new THREE.Euler(Math.random(), Math.random() * 3, Math.random()));
    s.setScalar(1.5 + Math.random() * 2);
    jeleuri.setMatrixAt(i, m.compose(p, q, s));
    jeleuri.setColorAt(i, c.setHSL(Math.random(), 0.8, 0.6));
  }
  grup.add(jeleuri);
  return {
    obiect: grup, fundal: 0x3a1a3a,
    anima: (timp) => { acadele.forEach((a, i) => { a.rotation.z = timp * 0.3 * (i % 2 ? 1 : -1); }); jeleuri.rotation.y = timp * 0.02; },
  };
}

function decorDisco(): Decor {
  // Un glob disco uriaș din oglinzi mici (o singură bucată) și reflectoare colorate care se rotesc
  const grup = new THREE.Group();
  const n = 260, raza = 14;
  const oglinzi = new THREE.InstancedMesh(new THREE.BoxGeometry(1.6, 1.6, 0.3), new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x303040 }), n);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, 1), p = new THREE.Vector3(), c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    // puncte distribuite uniform pe sferă (spirala Fibonacci)
    const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), u = i * 2.39996;
    p.set(Math.cos(u) * r * raza, y * raza, Math.sin(u) * r * raza);
    q.setFromRotationMatrix(new THREE.Matrix4().lookAt(p, new THREE.Vector3(), THREE.Object3D.DEFAULT_UP));
    oglinzi.setMatrixAt(i, m.compose(p, q, s));
    oglinzi.setColorAt(i, c.setHSL(0.6 + Math.random() * 0.1, 0.2, 0.6 + Math.random() * 0.4));
  }
  const glob = new THREE.Group();
  glob.add(oglinzi);
  glob.position.set(0, 55, -60);
  grup.add(glob);
  // reflectoare: conuri transparente colorate care se rotesc din jurul globului
  const reflectoare: THREE.Mesh[] = [];
  [0xff5fa8, 0x2ee6d6, 0xffd23f, 0x8a6cff].forEach((col, i) => {
    const con = new THREE.Mesh(new THREE.ConeGeometry(10, 70, 16, 1, true).translate(0, -35, 0),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.08, depthWrite: false, side: THREE.DoubleSide }));
    con.position.copy(glob.position);
    con.userData.faza = (i / 4) * Math.PI * 2;
    reflectoare.push(con);
    grup.add(con);
  });
  return {
    obiect: grup, fundal: 0x12081e,
    anima: (timp) => {
      glob.rotation.y = timp * 0.4;
      reflectoare.forEach((r) => { r.rotation.set(0.5 * Math.sin(timp * 0.7 + r.userData.faza), 0, 0.6 * Math.cos(timp * 0.5 + r.userData.faza)); });
    },
  };
}

function decorBiblioteca(): Decor {
  // Cărți uriașe care plutesc și se deschid și se închid încet, plus creioane uriașe
  const grup = new THREE.Group();
  const carti: { st: THREE.Group; dr: THREE.Group }[] = [];
  const culori = [0xd8304a, 0x2a6fd8, 0x3fbf5a, 0xffc23f, 0x8a6cff];
  for (let i = 0; i < 7; i++) {
    const carte = new THREE.Group();
    const coperta = new THREE.MeshLambertMaterial({ color: culori[i % 5] });
    const pagini = new THREE.MeshLambertMaterial({ color: 0xfaf6e8 });
    const parti = [-1, 1].map((sens) => {
      const jum = new THREE.Group();
      const cop = new THREE.Mesh(new THREE.BoxGeometry(10, 0.6, 14), coperta);
      cop.position.x = sens * 5;
      const pag = new THREE.Mesh(new THREE.BoxGeometry(9.4, 1, 13.4), pagini);
      pag.position.set(sens * 5, 0.75, 0);
      jum.add(cop, pag);
      carte.add(jum);
      return jum;
    });
    const u = (i / 7) * Math.PI * 2;
    carte.position.set(Math.cos(u) * 80, -10 + (i % 3) * 18, Math.sin(u) * 80 - 50);
    carte.rotation.set(0.4, -u, 0);
    carti.push({ st: parti[0], dr: parti[1] });
    grup.add(carte);
  }
  for (let i = 0; i < 4; i++) {
    const creion = new THREE.Group();
    const corp = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 30, 6), new THREE.MeshLambertMaterial({ color: culori[i] }));
    const varf = new THREE.Mesh(new THREE.ConeGeometry(1.5, 5, 6), new THREE.MeshLambertMaterial({ color: 0xf0d0a0 }));
    varf.position.y = -17.5; varf.rotation.x = Math.PI;
    const guma = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 3, 6), new THREE.MeshLambertMaterial({ color: 0xff9ac0 }));
    guma.position.y = 16.5;
    creion.add(corp, varf, guma);
    creion.position.set(-100 + i * 65, 20, -170);
    creion.rotation.z = 0.5 - i * 0.3;
    grup.add(creion);
  }
  return {
    obiect: grup, fundal: 0x1a1230,
    anima: (timp) => carti.forEach((c, i) => {
      const deschis = 0.3 + 0.3 * Math.sin(timp * 0.5 + i);
      c.st.rotation.z = deschis; c.dr.rotation.z = -deschis;
    }),
  };
}

function decorParc(): Decor {
  // O roată mare (cu cabine colorate care stau mereu drepte), un carusel și baloane care urcă
  const grup = planetaCuPete(0x4a8a5a, 0x3a6a4a);
  const roata = new THREE.Group();
  roata.add(new THREE.Mesh(new THREE.TorusGeometry(30, 0.8, 6, 48), new THREE.MeshLambertMaterial({ color: 0xe8e8f0 })));
  const cabine: THREE.Mesh[] = [];
  const culori = [0xe8304a, 0xffd23f, 0x2ee6d6, 0xff5fa8, 0x8a6cff, 0x4ccf6a];
  for (let i = 0; i < 12; i++) {
    const u = (i / 12) * Math.PI * 2;
    const spita = new THREE.Mesh(new THREE.BoxGeometry(0.4, 30, 0.4), new THREE.MeshLambertMaterial({ color: 0xc8c8d0 }));
    spita.position.set(Math.cos(u) * 15, Math.sin(u) * 15, 0);
    spita.rotation.z = u - Math.PI / 2;
    roata.add(spita);
    const cab = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshLambertMaterial({ color: culori[i % 6] }));
    cab.userData.u = u;
    cabine.push(cab);
    grup.add(cab);
  }
  roata.position.set(-60, 20, -150);
  grup.add(roata);
  const picior = new THREE.Mesh(new THREE.BoxGeometry(3, 60, 3), new THREE.MeshLambertMaterial({ color: 0xc8c8d0 }));
  picior.position.set(-60, -10, -152);
  grup.add(picior);
  // carusel
  const carusel = new THREE.Group();
  carusel.add(new THREE.Mesh(new THREE.ConeGeometry(16, 8, 12), new THREE.MeshLambertMaterial({ color: 0xff5fa8 })));
  carusel.children[0].position.y = 12;
  carusel.add(new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 1.5, 12), new THREE.MeshLambertMaterial({ color: 0xffd23f })));
  for (let i = 0; i < 8; i++) {
    const u = (i / 8) * Math.PI * 2;
    const cal = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 4), new THREE.MeshLambertMaterial({ color: culori[i % 6] }));
    cal.position.set(Math.cos(u) * 12, 3, Math.sin(u) * 12);
    carusel.add(cal);
  }
  carusel.position.set(70, -20, -120);
  grup.add(carusel);
  // baloane
  const baloane: THREE.Mesh[] = [];
  for (let i = 0; i < 12; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(2, 8, 6), new THREE.MeshLambertMaterial({ color: culori[i % 6] }));
    b.position.set(-80 + i * 15, 0, -90 - (i % 3) * 30);
    b.userData.faza = i * 7;
    baloane.push(b);
    grup.add(b);
  }
  return {
    obiect: grup, fundal: 0x101a3a,
    anima: (timp) => {
      roata.rotation.z = timp * 0.12;
      cabine.forEach((c) => { const u = c.userData.u + timp * 0.12; c.position.set(-60 + Math.cos(u) * 30, 20 + Math.sin(u) * 30 - 2.5, -150); });
      carusel.rotation.y = timp * 0.5;
      baloane.forEach((b) => { b.position.y = ((timp * 3 + b.userData.faza) % 80) - 20; });
    },
  };
}

function decorCiuperci(): Decor {
  // Ciuperci uriașe care strălucesc (pălării colorate cu buline) și licurici care clipesc
  const grup = planetaCuPete(0x2a4a3a, 0x3a6a4a);
  const palarii: THREE.MeshLambertMaterial[] = [];
  const culori = [0xe8303a, 0x8a6cff, 0x2ee6d6, 0xff9a3c, 0xff5fa8];
  for (let i = 0; i < 9; i++) {
    const c = new THREE.Group();
    const h = 20 + (i % 3) * 10;
    const picior = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3.5, h, 8), new THREE.MeshLambertMaterial({ color: 0xf0e8d8 }));
    picior.position.y = h / 2;
    const mat = new THREE.MeshLambertMaterial({ color: culori[i % 5], emissive: new THREE.Color(culori[i % 5]).multiplyScalar(0.3) });
    palarii.push(mat);
    const palarie = new THREE.Mesh(new THREE.SphereGeometry(10, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat);
    palarie.position.y = h;
    c.add(picior, palarie);
    for (let k = 0; k < 5; k++) {
      const u = (k / 5) * Math.PI * 2, v = 0.6;
      const bulina = new THREE.Mesh(new THREE.SphereGeometry(1.4, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      bulina.position.set(Math.cos(u) * Math.sin(v) * 10, h + Math.cos(v) * 10, Math.sin(u) * Math.sin(v) * 10);
      c.add(bulina);
    }
    const u = (i / 9) * Math.PI * 2;
    c.position.set(Math.cos(u) * 75, -45, Math.sin(u) * 75 - 50);
    grup.add(c);
  }
  // licurici: puncte galbene care plutesc
  const nr = 160, poz = new Float32Array(nr * 3);
  for (let i = 0; i < nr; i++) { poz[i * 3] = (Math.random() - 0.5) * 60; poz[i * 3 + 1] = Math.random() * 25 - 2; poz[i * 3 + 2] = -Math.random() * 100 + 5; }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(poz, 3));
  const licurici = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xfff080, size: 4, sizeAttenuation: false, transparent: true }));
  grup.add(licurici);
  return {
    obiect: grup, fundal: 0x08141a,
    anima: (timp) => {
      palarii.forEach((m, i) => m.emissive.set(culori[i % 5]).multiplyScalar(0.25 + 0.15 * Math.sin(timp * 1.5 + i)));
      (licurici.material as THREE.PointsMaterial).opacity = 0.5 + 0.5 * Math.sin(timp * 3);
      licurici.position.y = Math.sin(timp * 0.5) * 1.5;
    },
  };
}

function decorAtelier(): Decor {
  // Rachete pe rampele de lansare, cu lumini care clipesc și scântei de sudură
  const grup = planetaCuPete(0x3a3f52, 0x50566e);
  const lumini: THREE.MeshBasicMaterial[] = [];
  const culori = [0xff5f5f, 0x2ee6d6, 0xffd23f, 0x8a6cff, 0xff9a3c];
  for (let i = 0; i < 7; i++) {
    const r = new THREE.Group();
    const corp = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 30, 12), new THREE.MeshLambertMaterial({ color: 0xe8ecf4 }));
    corp.position.y = 15;
    const varf = new THREE.Mesh(new THREE.ConeGeometry(4, 10, 12), new THREE.MeshLambertMaterial({ color: culori[i % 5] }));
    varf.position.y = 35;
    r.add(corp, varf);
    for (let k = 0; k < 3; k++) {
      const aripa = new THREE.Mesh(new THREE.BoxGeometry(0.8, 8, 6), new THREE.MeshLambertMaterial({ color: culori[i % 5] }));
      const u = (k / 3) * Math.PI * 2;
      aripa.position.set(Math.cos(u) * 5, 4, Math.sin(u) * 5);
      aripa.rotation.y = -u;
      r.add(aripa);
    }
    const hublou = new THREE.Mesh(new THREE.SphereGeometry(1.6, 8, 6), new THREE.MeshBasicMaterial({ color: 0x9fdcff }));
    hublou.position.set(0, 22, 3.8);
    r.add(hublou);
    // turnul de lansare de lângă rachetă, cu o lumină sus
    const turn = new THREE.Mesh(new THREE.BoxGeometry(3, 42, 3), new THREE.MeshLambertMaterial({ color: 0xffb020 }));
    turn.position.set(8, 21, 0);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff3030 });
    lumini.push(mat);
    const lumina = new THREE.Mesh(new THREE.SphereGeometry(1.2, 6, 4), mat);
    lumina.position.set(8, 43, 0);
    r.add(turn, lumina);
    const u = (i / 7) * Math.PI * 2;
    r.position.set(Math.cos(u) * 80, -45, Math.sin(u) * 80 - 45);
    grup.add(r);
  }
  // scântei de sudură: puncte portocalii care sar
  const nr = 120, poz = new Float32Array(nr * 3);
  for (let i = 0; i < nr; i++) { poz[i * 3] = (Math.random() - 0.5) * 50; poz[i * 3 + 1] = Math.random() * 20 - 3; poz[i * 3 + 2] = -Math.random() * 95 + 5; }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(poz, 3));
  const scantei = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffa040, size: 3, sizeAttenuation: false, transparent: true }));
  grup.add(scantei);
  return {
    obiect: grup, fundal: 0x0c1020,
    anima: (timp) => {
      lumini.forEach((m, i) => m.color.set(Math.sin(timp * 3 + i) > 0 ? 0xff3030 : 0x401010));
      (scantei.material as THREE.PointsMaterial).opacity = 0.4 + 0.6 * Math.abs(Math.sin(timp * 7));
      scantei.position.y = Math.sin(timp * 0.7) * 1.2;
    },
  };
}

function decorMuzica(): Decor {
  // Note muzicale uriașe care plutesc și discuri care se învârt, cu lumini de concert
  const grup = planetaCuPete(0x2a1f45, 0x3f2f66);
  const culori = [0xff5fa8, 0x2ee6d6, 0xffd23f, 0x8a6cff, 0xa6f04a];
  const note: THREE.Group[] = [];
  for (let i = 0; i < 8; i++) {
    const n = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: culori[i % 5], emissive: new THREE.Color(culori[i % 5]).multiplyScalar(0.3) });
    const cap = new THREE.Mesh(new THREE.SphereGeometry(4, 12, 8), mat);
    cap.scale.set(1.3, 1, 1);
    const coada = new THREE.Mesh(new THREE.BoxGeometry(1, 18, 1), mat);
    coada.position.set(4.5, 9, 0);
    const steag = new THREE.Mesh(new THREE.BoxGeometry(5, 1.4, 1), mat);
    steag.position.set(7, 17, 0);
    steag.rotation.z = -0.5;
    n.add(cap, coada, steag);
    const u = (i / 8) * Math.PI * 2;
    n.position.set(Math.cos(u) * 70, 10 + (i % 3) * 12, Math.sin(u) * 70 - 50);
    n.lookAt(0, n.position.y, -50);
    grup.add(n);
    note.push(n);
  }
  // două discuri mari care se învârt
  const discuri: THREE.Mesh[] = [];
  for (const [x, z] of [[-60, -20], [60, -90]]) {
    const d = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 1.5, 32), new THREE.MeshLambertMaterial({ color: 0x1a1a24 }));
    const eticheta = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 1.7, 20), new THREE.MeshLambertMaterial({ color: 0xff5f5f }));
    d.add(eticheta);
    d.position.set(x, -20, z);
    d.rotation.x = 0.35;
    grup.add(d);
    discuri.push(d);
  }
  return {
    obiect: grup, fundal: 0x120a24,
    anima: (timp) => {
      note.forEach((n, i) => { n.position.y = 10 + (i % 3) * 12 + Math.sin(timp * 1.2 + i) * 3; });
      discuri.forEach((d, i) => { d.rotation.y = timp * (i ? -0.6 : 0.6); });
    },
  };
}

function decorMarte(): Decor {
  // Planeta roșie: stânci înalte, un rover cu antenă, două luni mici și praf purtat de vânt
  const grup = planetaCuPete(0xb84a2a, 0xd06a3a);
  for (let i = 0; i < 10; i++) {
    const h = 15 + (i % 4) * 8;
    const stanca = new THREE.Mesh(new THREE.CylinderGeometry(4 + (i % 3), 7 + (i % 2) * 2, h, 7), new THREE.MeshLambertMaterial({ color: i % 2 ? 0x9a4a2a : 0xb85a32 }));
    const u = (i / 10) * Math.PI * 2 + 0.3;
    stanca.position.set(Math.cos(u) * 70, -45 + h / 2, Math.sin(u) * 70 - 50);
    grup.add(stanca);
  }
  // roverul, departe în fața ta
  const rover = new THREE.Group();
  const corp = new THREE.Mesh(new THREE.BoxGeometry(12, 4, 8), new THREE.MeshLambertMaterial({ color: 0xe8ecf4 }));
  corp.position.y = 5;
  rover.add(corp);
  for (const [x, z] of [[-5, -4.5], [0, -4.5], [5, -4.5], [-5, 4.5], [0, 4.5], [5, 4.5]]) {
    const roata = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 1.2, 10), new THREE.MeshLambertMaterial({ color: 0x2a2a38 }));
    roata.rotation.x = Math.PI / 2;
    roata.position.set(x, 1.8, z);
    rover.add(roata);
  }
  const antena = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 6), new THREE.MeshLambertMaterial({ color: 0xc3c7d6 }));
  antena.position.set(4, 10, 0);
  const lumina = new THREE.MeshBasicMaterial({ color: 0x2ee6d6 });
  const bec = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 6), lumina);
  bec.position.set(4, 13.5, 0);
  rover.add(antena, bec);
  rover.position.set(18, -20, -120);
  grup.add(rover);
  // două luni mici (ca Phobos și Deimos)
  for (const [x, y, r] of [[-70, 60, 6], [80, 75, 4]]) {
    const l = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), new THREE.MeshLambertMaterial({ color: 0x8a7a6a }));
    l.position.set(x, y, -150);
    grup.add(l);
  }
  // praful purtat de vânt
  const nr = 220, poz = new Float32Array(nr * 3);
  for (let i = 0; i < nr; i++) { poz[i * 3] = (Math.random() - 0.5) * 60; poz[i * 3 + 1] = Math.random() * 20 - 3; poz[i * 3 + 2] = -Math.random() * 105 + 5; }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(poz, 3));
  const praf = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xf0a060, size: 3, sizeAttenuation: false, transparent: true, opacity: 0.7 }));
  grup.add(praf);
  return {
    obiect: grup, fundal: 0x2a1410,
    anima: (timp) => {
      praf.position.x = ((timp * 6) % 30) - 15;
      lumina.color.set(Math.sin(timp * 4) > 0 ? 0x2ee6d6 : 0x0a3a3a);
    },
  };
}

function decorSah(): Decor {
  // Piese de șah uriașe (albe și negre) care plutesc încet în jurul tablei
  const grup = planetaCuPete(0x2a2a38, 0x4a4a62);
  const piese: THREE.Group[] = [];
  const fa = (alb: boolean, tip: number) => {
    const mat = new THREE.MeshLambertMaterial({ color: alb ? 0xf0eee6 : 0x34344a });
    const p = new THREE.Group();
    const baza = new THREE.Mesh(new THREE.CylinderGeometry(5, 6, 3, 14), mat);
    const corp = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 4, 12, 12), mat);
    corp.position.y = 7.5;
    p.add(baza, corp);
    if (tip === 0) {        // pion: o bilă sus
      const cap = new THREE.Mesh(new THREE.SphereGeometry(3.2, 12, 8), mat);
      cap.position.y = 15;
      p.add(cap);
    } else if (tip === 1) { // tură: un turn cu creneluri
      const varf = new THREE.Mesh(new THREE.CylinderGeometry(4, 3.5, 4, 14), mat);
      varf.position.y = 15;
      p.add(varf);
      for (let k = 0; k < 4; k++) {
        const cr = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2, 1.6), mat);
        const u = (k / 4) * Math.PI * 2;
        cr.position.set(Math.cos(u) * 3, 18, Math.sin(u) * 3);
        p.add(cr);
      }
    } else {                // rege: o cruce sus
      const cap = new THREE.Mesh(new THREE.SphereGeometry(3.5, 12, 8), mat);
      cap.position.y = 15;
      const v = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5, 1.2), new THREE.MeshLambertMaterial({ color: 0xffd23f }));
      v.position.y = 20.5;
      const o = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.2, 1.2), new THREE.MeshLambertMaterial({ color: 0xffd23f }));
      o.position.y = 21;
      p.add(cap, v, o);
    }
    return p;
  };
  for (let i = 0; i < 8; i++) {
    const p = fa(i % 2 === 0, i % 3);
    const u = (i / 8) * Math.PI * 2;
    p.position.set(Math.cos(u) * 70, -10 + (i % 3) * 10, Math.sin(u) * 70 - 45);
    grup.add(p);
    piese.push(p);
  }
  return {
    obiect: grup, fundal: 0x14141f,
    anima: (timp) => {
      piese.forEach((p, i) => { p.position.y = -10 + (i % 3) * 10 + Math.sin(timp * 0.8 + i) * 2.5; p.rotation.y = timp * 0.2 * (i % 2 ? 1 : -1); });
    },
  };
}

function decorSera(): Decor {
  // Cupola de sticlă a serei, flori uriașe care se leagănă și polen care plutește
  const grup = planetaCuPete(0x2a5a3a, 0x3a7a4a);
  // arcele de sticlă ale cupolei
  const sticla = new THREE.MeshBasicMaterial({ color: 0x9fe8ff, transparent: true, opacity: 0.25, depthWrite: false });
  for (let i = 0; i < 6; i++) {
    const arc = new THREE.Mesh(new THREE.TorusGeometry(70, 0.8, 6, 40, Math.PI), sticla);
    arc.position.set(0, -20, -55);
    arc.rotation.y = (i / 6) * Math.PI;
    grup.add(arc);
  }
  const flori: THREE.Group[] = [];
  const culori = [0xff5fa8, 0xffd23f, 0x8a6cff, 0xff9a3c, 0x2ee6d6];
  for (let i = 0; i < 9; i++) {
    const f = new THREE.Group();
    const h = 25 + (i % 3) * 8;
    const tulpina = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.3, h, 6), new THREE.MeshLambertMaterial({ color: 0x3a9a4a }));
    tulpina.position.y = h / 2;
    f.add(tulpina);
    const mat = new THREE.MeshLambertMaterial({ color: culori[i % 5], emissive: new THREE.Color(culori[i % 5]).multiplyScalar(0.2) });
    for (let k = 0; k < 6; k++) {
      const petala = new THREE.Mesh(new THREE.SphereGeometry(3, 8, 6), mat);
      petala.scale.set(1.6, 0.4, 0.8);
      const u = (k / 6) * Math.PI * 2;
      petala.position.set(Math.cos(u) * 4, h, Math.sin(u) * 4);
      petala.rotation.y = -u;
      f.add(petala);
    }
    const mijloc = new THREE.Mesh(new THREE.SphereGeometry(2.2, 8, 6), new THREE.MeshLambertMaterial({ color: 0xffe080 }));
    mijloc.position.y = h + 0.5;
    f.add(mijloc);
    const u = (i / 9) * Math.PI * 2;
    f.position.set(Math.cos(u) * 60, -40, Math.sin(u) * 60 - 55);
    grup.add(f);
    flori.push(f);
  }
  // polen
  const nr = 160, poz = new Float32Array(nr * 3);
  for (let i = 0; i < nr; i++) { poz[i * 3] = (Math.random() - 0.5) * 50; poz[i * 3 + 1] = Math.random() * 25 - 2; poz[i * 3 + 2] = -Math.random() * 110 + 5; }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(poz, 3));
  const polen = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xfff6a0, size: 3, sizeAttenuation: false, transparent: true, opacity: 0.8 }));
  grup.add(polen);
  return {
    obiect: grup, fundal: 0x0a1a14,
    anima: (timp) => {
      flori.forEach((f, i) => { f.rotation.z = Math.sin(timp * 0.7 + i) * 0.06; f.rotation.y = timp * 0.15; });
      polen.position.y = Math.sin(timp * 0.6) * 1.5;
    },
  };
}

function decorSaturn(): Decor {
  // Saturn uriaș, cu inele, pe cer; bucăți de gheață din inel care se rotesc încet
  const grup = new THREE.Group();
  const planeta = new THREE.Mesh(new THREE.SphereGeometry(45, 32, 20), new THREE.MeshLambertMaterial({ color: 0xe8c88a }));
  // dungi pe planetă
  for (let i = -2; i <= 2; i++) {
    const dunga = new THREE.Mesh(new THREE.TorusGeometry(45 * Math.cos(i * 0.28), 1.6, 6, 40), new THREE.MeshLambertMaterial({ color: i % 2 ? 0xc8a06a : 0xf0dcae }));
    dunga.rotation.x = Math.PI / 2;
    dunga.position.y = 45 * Math.sin(i * 0.28);
    planeta.add(dunga);
  }
  const inel = new THREE.Mesh(new THREE.RingGeometry(58, 85, 64), new THREE.MeshBasicMaterial({ color: 0xd8c8a0, side: THREE.DoubleSide, transparent: true, opacity: 0.55 }));
  inel.rotation.x = Math.PI / 2;
  const saturn = new THREE.Group();
  saturn.add(planeta, inel);
  saturn.position.set(-90, 40, -180);
  saturn.rotation.z = 0.35;
  grup.add(saturn);
  // bucăți de gheață care plutesc în jurul drumului (o parte din inele)
  const ghete = new THREE.Group();
  const mat = new THREE.MeshLambertMaterial({ color: 0xcfeaff });
  for (let i = 0; i < 40; i++) {
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(1 + Math.random() * 2.5, 0), mat);
    const u = Math.random() * Math.PI * 2, r = 38 + Math.random() * 30;
    b.position.set(Math.cos(u) * r, -16 + Math.random() * 6, Math.sin(u) * r - 55);
    ghete.add(b);
  }
  grup.add(ghete);
  // o lună mică
  const luna = new THREE.Mesh(new THREE.SphereGeometry(6, 12, 10), new THREE.MeshLambertMaterial({ color: 0xa8b0c0 }));
  luna.position.set(80, 50, -140);
  grup.add(luna);
  return {
    obiect: grup, fundal: 0x0a0e22,
    anima: (timp) => {
      inel.rotation.z = timp * 0.05;
      ghete.rotation.y = timp * 0.03;
      ghete.children.forEach((g, i) => { g.rotation.x = timp * 0.3 + i; g.rotation.y = timp * 0.2 + i; });
    },
  };
}

function decorCeas(): Decor {
  // Cadrane de ceas uriașe cu limbi care se mișcă și roți dințate care se învârt
  const grup = planetaCuPete(0x3a2f22, 0x5a4a32);
  const limbi: { mica: THREE.Object3D; mare: THREE.Object3D }[] = [];
  const pozCadrane: [number, number, number, number][] = [[-70, 30, -90, 28], [75, 20, -60, 20], [10, 55, -170, 40]];
  for (const [x, y, z, r] of pozCadrane) {
    const c = new THREE.Group();
    const fata = new THREE.Mesh(new THREE.CircleGeometry(r, 40), new THREE.MeshBasicMaterial({ color: 0xf4ecd8 }));
    const rama = new THREE.Mesh(new THREE.TorusGeometry(r, r * 0.06, 8, 40), new THREE.MeshLambertMaterial({ color: 0xc8a040 }));
    c.add(fata, rama);
    for (let k = 0; k < 12; k++) {
      const u = (k / 12) * Math.PI * 2;
      const semn = new THREE.Mesh(new THREE.BoxGeometry(r * 0.06, r * 0.16, 0.5), new THREE.MeshBasicMaterial({ color: 0x2a2a38 }));
      semn.position.set(Math.sin(u) * r * 0.82, Math.cos(u) * r * 0.82, 0.3);
      semn.rotation.z = -u;
      c.add(semn);
    }
    const fa = (lung: number, gros: number) => {
      const pivot = new THREE.Group();
      const l = new THREE.Mesh(new THREE.BoxGeometry(gros, lung, 0.5), new THREE.MeshBasicMaterial({ color: 0x2a2a38 }));
      l.position.set(0, lung / 2, 0.6);
      pivot.add(l);
      c.add(pivot);
      return pivot;
    };
    limbi.push({ mica: fa(r * 0.5, r * 0.07), mare: fa(r * 0.75, r * 0.045) });
    c.position.set(x, y, z);
    c.lookAt(0, y * 0.5, -40);
    grup.add(c);
  }
  // roți dințate
  const roti: THREE.Group[] = [];
  const mat = new THREE.MeshLambertMaterial({ color: 0xb86a3a });
  for (let i = 0; i < 6; i++) {
    const r = 6 + (i % 3) * 3;
    const roata = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1.5, 20), mat);
    disc.rotation.x = Math.PI / 2;
    roata.add(disc);
    for (let k = 0; k < 12; k++) {
      const u = (k / 12) * Math.PI * 2;
      const dinte = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 1.5), mat);
      dinte.position.set(Math.cos(u) * (r + 0.8), Math.sin(u) * (r + 0.8), 0);
      dinte.rotation.z = u;
      roata.add(dinte);
    }
    const u = (i / 6) * Math.PI * 2 + 0.4;
    roata.position.set(Math.cos(u) * 85, -25 + (i % 2) * 12, Math.sin(u) * 85 - 45);
    roata.lookAt(0, roata.position.y, -45);
    grup.add(roata);
    roti.push(roata);
  }
  return {
    obiect: grup, fundal: 0x14100c,
    anima: (timp) => {
      limbi.forEach(({ mica, mare }, i) => { mica.rotation.z = -timp * 0.1 - i; mare.rotation.z = -timp * 1.2 - i * 2; });
      roti.forEach((r, i) => { r.rotateZ((i % 2 ? 1 : -1) * 0.01); });
    },
  };
}

function decorJucarii(): Decor {
  // Jucării uriașe care plutesc: un ursuleț, mingi colorate și un cub cu fețe colorate
  const grup = planetaCuPete(0x6a4a8a, 0x8a6aaa);
  const lam = (c: number) => new THREE.MeshLambertMaterial({ color: c });
  const jucarii: THREE.Object3D[] = [];
  // ursulețul
  const urs = new THREE.Group();
  const blana = lam(0xb8804a), bot = lam(0xe8c89a), ochi = lam(0x1a1a24);
  const corp = new THREE.Mesh(new THREE.SphereGeometry(10, 16, 12), blana);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(7, 16, 12), blana);
  cap.position.y = 14;
  urs.add(corp, cap);
  for (const x of [-5, 5]) {
    const ureche = new THREE.Mesh(new THREE.SphereGeometry(2.6, 10, 8), blana);
    ureche.position.set(x, 20, 0);
    const o = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 6), ochi);
    o.position.set(x * 0.45, 15.5, 6.3);
    const mana = new THREE.Mesh(new THREE.SphereGeometry(3.5, 10, 8), blana);
    mana.position.set(x * 2, 3, 2);
    const picior = new THREE.Mesh(new THREE.SphereGeometry(4, 10, 8), blana);
    picior.position.set(x * 1.2, -8, 4);
    urs.add(ureche, o, mana, picior);
  }
  const botul = new THREE.Mesh(new THREE.SphereGeometry(2.6, 10, 8), bot);
  botul.position.set(0, 12.5, 6);
  urs.add(botul);
  urs.position.set(-60, 5, -80);
  urs.lookAt(0, 5, -40);
  grup.add(urs);
  jucarii.push(urs);
  // mingi colorate (cu o dungă)
  const culori = [0xff5f5f, 0xffd23f, 0x2ee6d6, 0x5acf5a, 0x8a6cff];
  for (let i = 0; i < 5; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(5, 14, 10), lam(culori[i]));
    const dunga = new THREE.Mesh(new THREE.TorusGeometry(5, 0.7, 6, 24), lam(0xffffff));
    m.add(dunga);
    const u = (i / 5) * Math.PI * 2 + 1;
    m.position.set(Math.cos(u) * 65, 10 + i * 4, Math.sin(u) * 65 - 50);
    grup.add(m);
    jucarii.push(m);
  }
  // cubul cu fețe colorate (3x3x3 cubulețe)
  const cub = new THREE.Group();
  const fete = [0xff5f5f, 0x2a6fd8, 0xffd23f, 0x5acf5a, 0xff9a3c, 0xf4f4f8];
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.6, 3.6), lam(fete[(x + y * 2 + z * 3 + 9) % 6]));
    c.position.set(x * 3.8, y * 3.8, z * 3.8);
    cub.add(c);
  }
  cub.position.set(60, 25, -110);
  grup.add(cub);
  jucarii.push(cub);
  return {
    obiect: grup, fundal: 0x1a1030,
    anima: (timp) => {
      jucarii.forEach((j, i) => { j.position.y += Math.sin(timp * 1.1 + i) * 0.02; });
      cub.rotation.set(timp * 0.3, timp * 0.4, 0);
      urs.rotation.z = Math.sin(timp * 0.6) * 0.1;
    },
  };
}
