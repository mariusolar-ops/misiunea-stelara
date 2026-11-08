// Scena 3D: desenatorul (renderer), lumini, stele și planete în fundal.
// Totul e ales să fie ieftin pentru un telefon mediu:
//  - fără umbre calculate (folosim o „pată” de umbră sub personaj)
//  - materiale simple (Lambert / Basic)
//  - rezoluție limitată pe ecranele foarte dense
import * as THREE from 'three';

export function creeazaScena(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  // Pe telefoane cu ecran foarte dens nu desenăm la rezoluția maximă – economisim mult
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scena = new THREE.Scene();
  scena.background = new THREE.Color(0x0b0f2e);

  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Lumini: una „de cer” care colorează blând totul și un „soare” care dă volum
  scena.add(new THREE.HemisphereLight(0xbfd8ff, 0x2a1f4d, 1.4));
  const soare = new THREE.DirectionalLight(0xffffff, 1.6);
  soare.position.set(30, 50, 20);
  scena.add(soare);

  adaugaStele(scena);
  adaugaPlanete(scena);

  // Când se schimbă mărimea ecranului (ex: rotire telefon)
  const redimensioneaza = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', redimensioneaza);

  return { renderer, scena, camera };
}

/** 1500 de stele – toate desenate dintr-o singură bucată, foarte ieftin */
function adaugaStele(scena: THREE.Scene) {
  const n = 1500;
  const poz = new Float32Array(n * 3);
  const culori = new Float32Array(n * 3);
  const c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    // punct la întâmplare pe o sferă mare
    const u = Math.random() * 2 - 1;
    const t = Math.random() * Math.PI * 2;
    const r = 400;
    const s = Math.sqrt(1 - u * u);
    poz[i * 3] = r * s * Math.cos(t);
    poz[i * 3 + 1] = r * u;
    poz[i * 3 + 2] = r * s * Math.sin(t);
    // majoritatea albe, câteva turcoaz sau gălbui
    const alege = Math.random();
    c.set(alege < 0.7 ? 0xffffff : alege < 0.85 ? 0x9ffcf3 : 0xffe2a8);
    culori.set([c.r, c.g, c.b], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(poz, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(culori, 3));
  const mat = new THREE.PointsMaterial({ size: 2, sizeAttenuation: false, vertexColors: true });
  scena.add(new THREE.Points(geo, mat));
}

/** Câteva planete departe, doar de decor (nu le atingi) */
function adaugaPlanete(scena: THREE.Scene) {
  // Planeta mare cu inel, portocalie
  const planeta = new THREE.Mesh(
    new THREE.SphereGeometry(40, 24, 16),
    new THREE.MeshLambertMaterial({ color: 0xff9a3c, emissive: 0x4a1c00 }),
  );
  planeta.position.set(-160, 40, -260);
  scena.add(planeta);
  const inel = new THREE.Mesh(
    new THREE.RingGeometry(55, 75, 48),
    new THREE.MeshBasicMaterial({ color: 0xffd29a, side: THREE.DoubleSide, transparent: true, opacity: 0.55 }),
  );
  inel.position.copy(planeta.position);
  inel.rotation.set(Math.PI / 2.4, 0.3, 0);
  scena.add(inel);

  // Luna turcoaz, mai mică
  const luna = new THREE.Mesh(
    new THREE.SphereGeometry(14, 20, 14),
    new THREE.MeshLambertMaterial({ color: 0x2ee6d6, emissive: 0x053c38 }),
  );
  luna.position.set(180, 70, -150);
  scena.add(luna);

  // O planetă roz, departe în spate
  const roz = new THREE.Mesh(
    new THREE.SphereGeometry(22, 20, 14),
    new THREE.MeshLambertMaterial({ color: 0xff5fa8, emissive: 0x3a0820 }),
  );
  roz.position.set(120, -30, 260);
  scena.add(roz);
}
