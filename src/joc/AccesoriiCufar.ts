// Accesoriile care NU se cumpără: se găsesc doar în cufere (ideea lui Mihai: „muuulte accesorii în cufere”).
// Multe sunt în stilul lumii din cuburi. Toate sunt făcute din cuburi colorate, desenate din cod.
// Locuri: „cap”/„fata” = centrul capului, „spate” = mijlocul spatelui, „umar” = deasupra umărului stâng,
// „corp” = mijlocul pieptului (fața corpului e la z = 0.21), „mana” = în palma dreaptă.
import * as THREE from 'three';
import type { Accesoriu } from './Accesorii';

const CUB = new THREE.BoxGeometry(1, 1, 1);
function cub(l: number, h: number, a: number, culoare: number, x = 0, y = 0, z = 0, extra: THREE.MeshLambertMaterialParameters = {}) {
  const m = new THREE.Mesh(CUB, new THREE.MeshLambertMaterial({ color: culoare, ...extra }));
  m.scale.set(l, h, a);
  m.position.set(x, y, z);
  return m;
}
function grup(...copii: THREE.Object3D[]) { const g = new THREE.Group(); g.add(...copii); return g; }
const lucios = (c: number) => ({ emissive: new THREE.Color(c).multiplyScalar(0.4) });
const AUR = 0xffd23f, NEGRU = 0x1c1c24, ALB = 0xffffff, TURCOAZ = 0x2ee6d6;

/** Un accesoriu din cufăr (preț 0, nu apare de vânzare) */
const dinCufar = (a: Omit<Accesoriu, 'pret' | 'dinCufar'>): Accesoriu => ({ ...a, pret: 0, dinCufar: true });

export const ACCESORII_CUFAR: Accesoriu[] = [
  // ---------- CAP ----------
  dinCufar({ id: 'c-bloc-iarba', nume: 'Bloc de iarbă pe cap', emoji: '🟩', slot: 'cap', construieste: () => grup(
    cub(0.56, 0.42, 0.56, 0x7a5232, 0, 0.5, 0), cub(0.58, 0.14, 0.58, 0x5aa83a, 0, 0.74, 0),
    cub(0.1, 0.1, 0.02, 0x4e9832, -0.15, 0.62, 0.285), cub(0.1, 0.1, 0.02, 0x4e9832, 0.12, 0.6, 0.285)) }),
  dinCufar({ id: 'c-casca-pixel', nume: 'Cască de miner', emoji: '⛑️', slot: 'cap', construieste: () => grup(
    cub(0.6, 0.24, 0.6, 0xffc020, 0, 0.36, 0), cub(0.14, 0.12, 0.06, 0xfff8b0, 0, 0.36, 0.32, { emissive: 0xfff0a0 })) }),
  dinCufar({ id: 'c-coroana-cristal', nume: 'Coroană de cristal', emoji: '💎', slot: 'cap', culoarePrincipala: TURCOAZ, construieste: () => {
    const g = new THREE.Group();
    for (const [x, z] of [[-0.22, 0.22], [0.22, 0.22], [-0.22, -0.22], [0.22, -0.22], [0, 0.26], [0, -0.26], [-0.26, 0], [0.26, 0]]) {
      const c = cub(0.1, 0.22, 0.1, TURCOAZ, x, 0.42, z, lucios(TURCOAZ)); c.rotation.y = 0.785; g.add(c);
    }
    return g; } }),
  dinCufar({ id: 'c-ciuperca', nume: 'Pălărie-ciupercă', emoji: '🍄', slot: 'cap', construieste: () => {
    const g = grup(cub(0.86, 0.22, 0.86, 0xe8303a, 0, 0.42, 0), cub(0.6, 0.12, 0.6, 0xe8303a, 0, 0.58, 0));
    for (const [x, z] of [[-0.25, 0.2], [0.2, -0.15], [0.05, 0.3], [-0.1, -0.3]]) g.add(cub(0.12, 0.04, 0.12, ALB, x, 0.645, z));
    return g; } }),
  dinCufar({ id: 'c-viking', nume: 'Coif cu coarne', emoji: '🐂', slot: 'cap', construieste: () => grup(
    cub(0.62, 0.3, 0.62, 0x9aa6bd, 0, 0.34, 0), cub(0.64, 0.06, 0.64, 0x8b5a2b, 0, 0.22, 0),
    cub(0.12, 0.1, 0.1, 0xf4ecd8, -0.38, 0.42, 0), cub(0.1, 0.18, 0.1, 0xf4ecd8, -0.46, 0.54, 0),
    cub(0.12, 0.1, 0.1, 0xf4ecd8, 0.38, 0.42, 0), cub(0.1, 0.18, 0.1, 0xf4ecd8, 0.46, 0.54, 0)) }),
  dinCufar({ id: 'c-bucatar', nume: 'Bonetă de bucătar', emoji: '👨‍🍳', slot: 'cap', construieste: () => grup(
    cub(0.58, 0.14, 0.58, ALB, 0, 0.32, 0), cub(0.66, 0.3, 0.66, ALB, 0, 0.54, 0), cub(0.5, 0.14, 0.5, 0xf0f0f0, 0, 0.74, 0)) }),
  dinCufar({ id: 'c-iepure', nume: 'Urechi de iepuraș', emoji: '🐇', slot: 'cap', construieste: () => grup(
    cub(0.1, 0.42, 0.06, ALB, -0.12, 0.5, 0), cub(0.1, 0.42, 0.06, ALB, 0.12, 0.5, 0),
    cub(0.05, 0.3, 0.02, 0xff9ac0, -0.12, 0.5, 0.035), cub(0.05, 0.3, 0.02, 0xff9ac0, 0.12, 0.5, 0.035)) }),
  dinCufar({ id: 'c-planeta', nume: 'Planetă care se învârte', emoji: '🪐', slot: 'cap', construieste: () => {
    const g = new THREE.Group();
    const p = grup(cub(0.2, 0.2, 0.2, 0xff9a3c, 0, 0, 0, lucios(0xff9a3c)));
    const inel = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.02, 4, 16), new THREE.MeshBasicMaterial({ color: 0xffe0a0 }));
    inel.rotation.x = 1.2; p.add(inel); p.position.set(0.25, 0.62, 0);
    g.add(p); g.userData.pluteste = true; return g; } }),
  // ---------- FAȚĂ ----------
  dinCufar({ id: 'c-ochelari-pixel', nume: 'Ochelari pixelați', emoji: '😎', slot: 'fata', construieste: () => {
    const g = grup(cub(0.56, 0.06, 0.03, NEGRU, 0, 0.1, 0.28));
    for (const x of [-0.18, -0.12, -0.06, 0.06, 0.12, 0.18]) g.add(cub(0.06, 0.06, 0.03, NEGRU, x, 0.04, 0.28));
    g.add(cub(0.06, 0.06, 0.03, NEGRU, -0.15, -0.02, 0.28), cub(0.06, 0.06, 0.03, NEGRU, 0.09, -0.02, 0.28), cub(0.04, 0.04, 0.03, ALB, -0.18, 0.04, 0.29), cub(0.04, 0.04, 0.03, ALB, 0.06, 0.04, 0.29));
    return g; } }),
  dinCufar({ id: 'c-ochelari-stea', nume: 'Ochelari-stea', emoji: '🤩', slot: 'fata', construieste: () => {
    const g = grup(cub(0.56, 0.03, 0.03, AUR, 0, 0.1, 0.275));
    for (const x of [-0.13, 0.13]) { const a = cub(0.16, 0.16, 0.03, AUR, x, 0.05, 0.28, lucios(AUR)); const b = cub(0.16, 0.16, 0.03, AUR, x, 0.05, 0.28, lucios(AUR)); b.rotation.z = 0.785; g.add(a, b); }
    return g; } }),
  dinCufar({ id: 'c-monoclu', nume: 'Monoclu', emoji: '🧐', slot: 'fata', construieste: () => {
    const g = new THREE.Group();
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 4, 14), new THREE.MeshLambertMaterial({ color: AUR }));
    r.position.set(0.12, 0.05, 0.285); g.add(r, cub(0.01, 0.3, 0.01, AUR, 0.2, -0.1, 0.285)); return g; } }),
  dinCufar({ id: 'c-scafandru', nume: 'Mască de scafandru', emoji: '🤿', slot: 'fata', construieste: () => grup(
    cub(0.6, 0.06, 0.6, NEGRU, 0, 0.06, 0), cub(0.46, 0.2, 0.04, 0x9fdcff, 0, 0.06, 0.29, { transparent: true, opacity: 0.6 }),
    cub(0.06, 0.4, 0.06, 0xffd23f, 0.3, 0.2, 0.05)) }),
  // ---------- SPATE ----------
  dinCufar({ id: 'c-aripi-dragon', nume: 'Aripi de dragon', emoji: '🐲', slot: 'spate', culoarePrincipala: 0x8a3aff, construieste: () => {
    const g = new THREE.Group();
    for (const parte of [-1, 1]) {
      const a = new THREE.Group(); a.position.set(parte * 0.12, 0.25, -0.08);
      a.add(cub(0.08, 0.08, 0.06, 0x3a1a6a, parte * 0.1, 0.25, 0), cub(0.5, 0.06, 0.06, 0x3a1a6a, parte * 0.35, 0.28, 0));
      for (const [x, h] of [[0.2, 0.5], [0.4, 0.4], [0.6, 0.28]]) a.add(cub(0.2, h, 0.03, 0x8a3aff, parte * x, 0.28 - h / 2, 0));
      a.userData.parte = parte; g.add(a);
    }
    g.userData.aripi = true; return g; } }),
  dinCufar({ id: 'c-rucsac-cufar', nume: 'Rucsac-cufăr', emoji: '🧰', slot: 'spate', construieste: () => grup(
    cub(0.5, 0.42, 0.26, 0x8b5a2b, 0, 0, -0.14), cub(0.52, 0.06, 0.28, 0x4a2a10, 0, 0.06, -0.14), cub(0.08, 0.1, 0.02, AUR, 0, 0.02, -0.285, lucios(AUR))) }),
  dinCufar({ id: 'c-aripi-libelula', nume: 'Aripi de libelulă', emoji: '🪰', slot: 'spate', construieste: () => {
    const g = new THREE.Group();
    for (const parte of [-1, 1]) {
      const a = new THREE.Group(); a.position.set(parte * 0.08, 0.2, -0.08);
      a.add(cub(0.6, 0.14, 0.02, 0xbff4ff, parte * 0.34, 0.12, 0, { transparent: true, opacity: 0.6 }), cub(0.5, 0.12, 0.02, 0xbff4ff, parte * 0.3, -0.06, 0, { transparent: true, opacity: 0.6 }));
      a.userData.parte = parte; g.add(a);
    }
    g.userData.aripi = true; return g; } }),
  dinCufar({ id: 'c-mantie-stele', nume: 'Mantie cu stele', emoji: '🌌', slot: 'spate', construieste: () => {
    const prindere = new THREE.Group(); prindere.position.set(0, 0.32, -0.02);
    prindere.add(cub(0.74, 1.05, 0.04, 0x1a1a5a, 0, -0.52, -0.02));
    for (const [x, y] of [[-0.2, -0.3], [0.15, -0.5], [-0.05, -0.8], [0.25, -0.2], [-0.25, -0.7]]) prindere.add(cub(0.06, 0.06, 0.02, AUR, x, y, -0.05, lucios(AUR)));
    prindere.add(cub(0.8, 0.08, 0.06, AUR, 0, 0, 0));
    prindere.userData.flutura = true; return prindere; } }),
  // ---------- UMĂR ----------
  dinCufar({ id: 'c-mini-robot', nume: 'Mini-robot', emoji: '🤖', slot: 'umar', construieste: () => {
    const g = grup(cub(0.2, 0.2, 0.18, 0xb8c0d0, 0, 0.12, 0), cub(0.16, 0.12, 0.14, 0xb8c0d0, 0, 0.3, 0),
      cub(0.04, 0.04, 0.01, TURCOAZ, -0.04, 0.31, 0.075, lucios(TURCOAZ)), cub(0.04, 0.04, 0.01, TURCOAZ, 0.04, 0.31, 0.075, lucios(TURCOAZ)),
      cub(0.02, 0.1, 0.02, 0x9aa6bd, 0, 0.41, 0), cub(0.05, 0.05, 0.05, 0xe84a4a, 0, 0.47, 0, lucios(0xe84a4a)));
    g.userData.papagal = true; return g; } }),
  dinCufar({ id: 'c-nor', nume: 'Norișor care plouă', emoji: '🌧️', slot: 'umar', construieste: () => {
    const g = new THREE.Group();
    const nor = grup(cub(0.34, 0.14, 0.22, 0xe8eef8, 0, 0, 0), cub(0.2, 0.12, 0.18, 0xe8eef8, -0.06, 0.1, 0), cub(0.16, 0.1, 0.16, 0xe8eef8, 0.08, 0.08, 0));
    for (const x of [-0.1, 0, 0.1]) nor.add(cub(0.02, 0.08, 0.02, 0x6ab0ff, x, -0.14, 0));
    nor.position.y = 0.6; g.add(nor); g.userData.pluteste = true; return g; } }),
  dinCufar({ id: 'c-puisor', nume: 'Puișor', emoji: '🐥', slot: 'umar', construieste: () => {
    const g = grup(cub(0.18, 0.16, 0.18, 0xffe040, 0, 0.08, 0), cub(0.14, 0.12, 0.14, 0xffe040, 0, 0.22, 0.03),
      cub(0.06, 0.04, 0.06, 0xff9a3c, 0, 0.21, 0.12), cub(0.03, 0.03, 0.01, NEGRU, -0.04, 0.25, 0.1), cub(0.03, 0.03, 0.01, NEGRU, 0.04, 0.25, 0.1));
    g.userData.papagal = true; return g; } }),
  // ---------- CORP ----------
  dinCufar({ id: 'c-centura', nume: 'Centură de campion', emoji: '🏆', slot: 'corp', construieste: () => grup(
    cub(0.86, 0.12, 0.48, 0x8b2a2a, 0, -0.24, 0), cub(0.24, 0.18, 0.03, AUR, 0, -0.24, 0.245, lucios(AUR)), cub(0.08, 0.08, 0.02, 0xe84a4a, 0, -0.24, 0.262)) }),
  dinCufar({ id: 'c-colier-cristal', nume: 'Colier de cristal', emoji: '💠', slot: 'corp', culoarePrincipala: TURCOAZ, construieste: () => {
    const g = new THREE.Group();
    for (let i = 0; i < 7; i++) { const u = -0.7 + (i / 6) * 1.4; g.add(cub(0.04, 0.04, 0.02, 0xc8d0e0, Math.sin(u) * 0.22, 0.3 - Math.cos(u) * 0.2, 0.225)); }
    const c = cub(0.1, 0.1, 0.04, TURCOAZ, 0, 0.06, 0.23, lucios(TURCOAZ)); c.rotation.z = 0.785; g.add(c);
    return g; } }),
  // ---------- MÂNĂ ----------
  dinCufar({ id: 'c-tarnacop', nume: 'Târnăcop de cristal', emoji: '⛏️', slot: 'mana', culoarePrincipala: TURCOAZ, construieste: () => {
    const g = grup(cub(0.05, 0.05, 0.55, 0x8b5a2b, 0, 0, 0.22), cub(0.5, 0.08, 0.08, TURCOAZ, 0, 0, 0.5, lucios(TURCOAZ)),
      cub(0.08, 0.08, 0.08, TURCOAZ, -0.27, -0.04, 0.47, lucios(TURCOAZ)), cub(0.08, 0.08, 0.08, TURCOAZ, 0.27, -0.04, 0.47, lucios(TURCOAZ)));
    return g; } }),
  dinCufar({ id: 'c-torta', nume: 'Torță', emoji: '🔥', slot: 'mana', construieste: () => {
    const g = grup(cub(0.06, 0.06, 0.36, 0x8b5a2b, 0, 0, 0.14));
    const f = grup(cub(0.1, 0.1, 0.1, 0xffd23f, 0, 0, 0, { emissive: 0xffa000 }), cub(0.06, 0.06, 0.06, 0xff7a2f, 0, 0, 0.06, { emissive: 0xc04000 }));
    f.position.z = 0.36; g.add(f); return g; } }),
  dinCufar({ id: 'c-acadea', nume: 'Acadea uriașă', emoji: '🍭', slot: 'mana', construieste: () => {
    const g = grup(cub(0.04, 0.04, 0.4, ALB, 0, 0, 0.16));
    const r = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 16), new THREE.MeshLambertMaterial({ color: 0xff5fa8 }));
    r.rotation.x = Math.PI / 2; r.position.z = 0.44;
    const s = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 4, 14), new THREE.MeshLambertMaterial({ color: ALB }));
    s.position.z = 0.47; g.add(r, s); return g; } }),
];
