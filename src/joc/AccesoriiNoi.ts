// Cele 30 de accesorii noi (ideea lui Mihai), toate din cuburi.
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
const lucios = (c: number) => ({ emissive: new THREE.Color(c).multiplyScalar(0.35) });
const AUR = 0xffd23f, NEGRU = 0x1c1c24, ALB = 0xffffff;

export const ACCESORII_NOI: Accesoriu[] = [
  // ---------- FAȚĂ ----------
  { id: 'masca-erou', nume: 'Mască de erou', emoji: '🦸', pret: 20, slot: 'fata', construieste: () => grup(
    cub(0.56, 0.12, 0.03, 0x2a4fd8, 0, 0.04, 0.275),
    cub(0.08, 0.05, 0.03, 0x2a4fd8, -0.3, 0.06, 0.24), cub(0.08, 0.05, 0.03, 0x2a4fd8, 0.3, 0.06, 0.24)) },
  { id: 'ochelari-3d', nume: 'Ochelari 3D', emoji: '👓', pret: 15, slot: 'fata', construieste: () => grup(
    cub(0.56, 0.04, 0.03, ALB, 0, 0.1, 0.275),
    cub(0.18, 0.12, 0.03, 0xe84a4a, -0.12, 0.04, 0.28, { transparent: true, opacity: 0.8 }),
    cub(0.18, 0.12, 0.03, 0x2ee6d6, 0.12, 0.04, 0.28, { transparent: true, opacity: 0.8 })) },
  { id: 'ochelari-inimi', nume: 'Ochelari cu inimioare', emoji: '😍', pret: 25, slot: 'fata', construieste: () => {
    const g = grup(cub(0.56, 0.03, 0.03, 0xff5fa8, 0, 0.1, 0.275));
    for (const x of [-0.12, 0.12]) g.add(cub(0.08, 0.1, 0.03, 0xff3a7a, x - 0.035, 0.06, 0.28), cub(0.08, 0.1, 0.03, 0xff3a7a, x + 0.035, 0.06, 0.28), cub(0.08, 0.08, 0.03, 0xff3a7a, x, 0.0, 0.28));
    return g; } },
  { id: 'nas-clovn', nume: 'Nas de clovn', emoji: '🤡', pret: 10, slot: 'fata', construieste: () => grup(cub(0.12, 0.12, 0.12, 0xe82a2a, 0, -0.04, 0.3, lucios(0xe82a2a))) },
  { id: 'barba', nume: 'Barbă', emoji: '🧔', pret: 20, slot: 'fata', construieste: () => grup(
    cub(0.54, 0.18, 0.06, 0x5a3418, 0, -0.2, 0.25), cub(0.4, 0.14, 0.06, 0x5a3418, 0, -0.33, 0.24), cub(0.06, 0.3, 0.3, 0x5a3418, -0.27, -0.12, 0.1), cub(0.06, 0.3, 0.3, 0x5a3418, 0.27, -0.12, 0.1)) },
  { id: 'ochelari-schi', nume: 'Ochelari de schi', emoji: '🥽', pret: 30, slot: 'fata', construieste: () => grup(
    cub(0.6, 0.06, 0.6, NEGRU, 0, 0.05, 0), cub(0.48, 0.16, 0.04, 0xff9a3c, 0, 0.05, 0.285, { emissive: 0x6a3000, transparent: true, opacity: 0.85 })) },
  // ---------- CAP ----------
  { id: 'coif', nume: 'Coif de cavaler', emoji: '⚔️', pret: 60, slot: 'cap', construieste: () => grup(
    cub(0.62, 0.62, 0.62, 0xb8c0d0, 0, 0.04, 0), cub(0.4, 0.05, 0.03, NEGRU, 0, 0.06, 0.315), cub(0.06, 0.24, 0.24, 0xe84a4a, 0, 0.46, -0.04)) },
  { id: 'cowboy', nume: 'Pălărie de cowboy', emoji: '🤠', pret: 35, slot: 'cap', construieste: () => grup(
    cub(0.9, 0.05, 0.8, 0x8b5a2b, 0, 0.36, 0), cub(0.2, 0.08, 0.8, 0x8b5a2b, -0.42, 0.42, 0), cub(0.2, 0.08, 0.8, 0x8b5a2b, 0.42, 0.42, 0),
    cub(0.48, 0.24, 0.46, 0x8b5a2b, 0, 0.5, 0), cub(0.5, 0.06, 0.48, NEGRU, 0, 0.42, 0)) },
  { id: 'caciula', nume: 'Căciulă cu moț', emoji: '🧶', pret: 20, slot: 'cap', construieste: () => grup(
    cub(0.58, 0.24, 0.58, 0xe84a4a, 0, 0.34, 0), cub(0.6, 0.08, 0.6, ALB, 0, 0.22, 0), cub(0.16, 0.16, 0.16, ALB, 0, 0.52, 0)) },
  { id: 'unicorn', nume: 'Corn de unicorn', emoji: '🦄', pret: 50, slot: 'cap', construieste: () => grup(
    cub(0.12, 0.14, 0.12, 0xffd8ec, 0, 0.32, 0.12), cub(0.09, 0.14, 0.09, 0xffd23f, 0, 0.44, 0.13, lucios(AUR)), cub(0.05, 0.12, 0.05, 0xffffff, 0, 0.56, 0.14)) },
  { id: 'aureola', nume: 'Aureolă', emoji: '😇', pret: 45, slot: 'cap', construieste: () => {
    const g = new THREE.Group();
    const inel = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 6, 20), new THREE.MeshBasicMaterial({ color: 0xfff0a0 }));
    inel.rotation.x = Math.PI / 2; inel.position.y = 0.55; g.add(inel);
    g.userData.pluteste = true; return g; } },
  { id: 'urechi-pisica', nume: 'Urechi de pisică', emoji: '🐱', pret: 15, slot: 'cap', construieste: () => grup(
    cub(0.14, 0.14, 0.08, NEGRU, -0.17, 0.36, 0), cub(0.14, 0.14, 0.08, NEGRU, 0.17, 0.36, 0),
    cub(0.07, 0.08, 0.02, 0xff9ac0, -0.17, 0.35, 0.045), cub(0.07, 0.08, 0.02, 0xff9ac0, 0.17, 0.35, 0.045)) },
  { id: 'vrajitor', nume: 'Pălărie de vrăjitor', emoji: '🧙', pret: 55, slot: 'cap', construieste: () => grup(
    cub(0.8, 0.05, 0.8, 0x3a2a8b, 0, 0.32, 0), cub(0.5, 0.2, 0.5, 0x3a2a8b, 0, 0.44, 0), cub(0.34, 0.2, 0.34, 0x3a2a8b, 0.03, 0.62, 0),
    cub(0.18, 0.2, 0.18, 0x3a2a8b, 0.07, 0.8, 0), cub(0.1, 0.1, 0.02, AUR, 0, 0.46, 0.26, lucios(AUR))) },
  { id: 'casca-constructor', nume: 'Cască de constructor', emoji: '👷', pret: 25, slot: 'cap', construieste: () => grup(
    cub(0.6, 0.22, 0.6, 0xffc020, 0, 0.36, 0), cub(0.64, 0.04, 0.72, 0xffc020, 0, 0.26, 0.04), cub(0.08, 0.06, 0.62, 0xe0a000, 0, 0.49, 0)) },
  { id: 'fundita', nume: 'Fundiță', emoji: '🎀', pret: 15, slot: 'cap', construieste: () => grup(
    cub(0.16, 0.14, 0.06, 0xff5fa8, -0.12, 0.38, 0), cub(0.16, 0.14, 0.06, 0xff5fa8, 0.12, 0.38, 0), cub(0.08, 0.08, 0.08, 0xff3a7a, 0, 0.38, 0)) },
  { id: 'coronita', nume: 'Coroniță de flori', emoji: '🌸', pret: 30, slot: 'cap', construieste: () => {
    const g = new THREE.Group();
    const culori = [0xff5fa8, 0xffd23f, ALB, 0x8a6cff];
    for (let i = 0; i < 10; i++) { const u = (i / 10) * Math.PI * 2; g.add(cub(0.09, 0.09, 0.09, culori[i % 4], Math.sin(u) * 0.3, 0.28, Math.cos(u) * 0.3)); }
    return g; } },
  // ---------- SPATE ----------
  { id: 'aripi-inger', nume: 'Aripi de înger', emoji: '🪽', pret: 90, slot: 'spate', construieste: () => {
    const g = new THREE.Group();
    for (const parte of [-1, 1]) {
      const a = new THREE.Group(); a.position.set(parte * 0.12, 0.25, -0.08);
      for (const [x, h, y] of [[0.28, 0.5, 0], [0.56, 0.42, 0.08], [0.82, 0.3, 0.16]]) a.add(cub(0.3, h, 0.05, ALB, parte * x, y, 0));
      a.userData.parte = parte; g.add(a);
    }
    g.userData.aripi = true; return g; } },
  { id: 'aripi-fluture', nume: 'Aripi de fluture', emoji: '🦋', pret: 70, slot: 'spate', construieste: () => {
    const g = new THREE.Group();
    for (const parte of [-1, 1]) {
      const a = new THREE.Group(); a.position.set(parte * 0.08, 0.1, -0.08);
      a.add(cub(0.46, 0.42, 0.04, 0xff9a3c, parte * 0.28, 0.16, 0), cub(0.34, 0.3, 0.04, 0x8a6cff, parte * 0.24, -0.2, 0), cub(0.12, 0.12, 0.05, NEGRU, parte * 0.34, 0.2, 0));
      a.userData.parte = parte; g.add(a);
    }
    g.userData.aripi = true; return g; } },
  { id: 'ghiozdan', nume: 'Ghiozdan', emoji: '🎒', pret: 25, slot: 'spate', construieste: () => grup(
    cub(0.5, 0.56, 0.22, 0x2a8fd8, 0, 0, -0.12), cub(0.36, 0.2, 0.06, 0x1a6fb8, 0, -0.12, -0.25), cub(0.06, 0.06, 0.02, AUR, 0, -0.06, -0.285)) },
  { id: 'chitara', nume: 'Chitară', emoji: '🎸', pret: 45, slot: 'spate', construieste: () => {
    const g = grup(cub(0.42, 0.42, 0.1, 0xc8702a, 0, -0.14, -0.1), cub(0.1, 0.1, 0.11, NEGRU, 0, -0.1, -0.1), cub(0.08, 0.62, 0.06, 0x5a3418, 0, 0.36, -0.1), cub(0.14, 0.12, 0.06, 0x5a3418, 0, 0.7, -0.1));
    g.rotation.z = 0.5; return g; } },
  // ---------- UMĂR ----------
  { id: 'dragon', nume: 'Dragon mic', emoji: '🐉', pret: 100, slot: 'umar', construieste: () => {
    const g = grup(
      cub(0.18, 0.18, 0.3, 0x3fbf5a, 0, 0.1, 0), cub(0.16, 0.14, 0.16, 0x3fbf5a, 0, 0.24, 0.14), cub(0.04, 0.04, 0.01, 0xffd23f, -0.05, 0.27, 0.22), cub(0.04, 0.04, 0.01, 0xffd23f, 0.05, 0.27, 0.22),
      cub(0.04, 0.08, 0.04, 0xffd23f, -0.05, 0.34, 0.1), cub(0.04, 0.08, 0.04, 0xffd23f, 0.05, 0.34, 0.1),
      cub(0.3, 0.04, 0.16, 0x2a8f4a, -0.2, 0.16, 0), cub(0.3, 0.04, 0.16, 0x2a8f4a, 0.2, 0.16, 0), cub(0.06, 0.06, 0.26, 0x3fbf5a, 0, 0.06, -0.24));
    g.userData.papagal = true; return g; } },
  { id: 'bufnita', nume: 'Bufniță', emoji: '🦉', pret: 65, slot: 'umar', construieste: () => {
    const g = grup(cub(0.24, 0.3, 0.2, 0x8b5a2b, 0, 0.15, 0), cub(0.2, 0.16, 0.02, 0xd8b890, 0, 0.12, 0.105),
      cub(0.08, 0.08, 0.02, ALB, -0.06, 0.24, 0.105), cub(0.08, 0.08, 0.02, ALB, 0.06, 0.24, 0.105), cub(0.04, 0.04, 0.01, NEGRU, -0.06, 0.24, 0.115), cub(0.04, 0.04, 0.01, NEGRU, 0.06, 0.24, 0.115),
      cub(0.04, 0.05, 0.03, 0xffa020, 0, 0.19, 0.12), cub(0.05, 0.08, 0.05, 0x8b5a2b, -0.09, 0.33, 0), cub(0.05, 0.08, 0.05, 0x8b5a2b, 0.09, 0.33, 0));
    g.userData.papagal = true; return g; } },
  { id: 'stea-plutitoare', nume: 'Stea plutitoare', emoji: '⭐', pret: 40, slot: 'umar', construieste: () => {
    const g = new THREE.Group();
    const s = grup(cub(0.24, 0.24, 0.24, AUR, 0, 0, 0, lucios(AUR)), cub(0.24, 0.24, 0.24, AUR, 0, 0, 0, lucios(AUR)));
    s.children[1].rotation.set(Math.PI / 4, Math.PI / 4, 0);
    s.position.y = 0.5; g.add(s); g.userData.pluteste = true; return g; } },
  // ---------- CORP ----------
  { id: 'vesta', nume: 'Vestă', emoji: '🦺', pret: 30, slot: 'corp', construieste: () => grup(
    cub(0.84, 0.66, 0.46, 0xff7a20, 0, 0, 0), cub(0.86, 0.06, 0.48, 0xe8f0a0, 0, -0.12, 0, lucios(0xe8f0a0)), cub(0.86, 0.06, 0.48, 0xe8f0a0, 0, 0.1, 0, lucios(0xe8f0a0)),
    cub(0.16, 0.6, 0.02, 0xf0f0f0, 0, 0, 0.235)) },
  { id: 'papion', nume: 'Papion', emoji: '🎩', pret: 15, slot: 'corp', construieste: () => grup(
    cub(0.12, 0.1, 0.03, 0xe84a4a, -0.07, 0.3, 0.225), cub(0.12, 0.1, 0.03, 0xe84a4a, 0.07, 0.3, 0.225), cub(0.05, 0.06, 0.04, 0xa82a2a, 0, 0.3, 0.23)) },
  { id: 'lant', nume: 'Lanț de aur', emoji: '📿', pret: 80, slot: 'corp', construieste: () => {
    const g = new THREE.Group();
    for (let i = 0; i < 9; i++) { const u = -0.8 + (i / 8) * 1.6; g.add(cub(0.06, 0.06, 0.03, AUR, Math.sin(u) * 0.24, 0.3 - Math.cos(u) * 0.24, 0.225, lucios(AUR))); }
    g.add(cub(0.12, 0.12, 0.03, AUR, 0, 0.0, 0.228, lucios(AUR)));
    return g; } },
  { id: 'esarfa', nume: 'Eșarfă', emoji: '🧣', pret: 20, slot: 'corp', construieste: () => grup(
    cub(0.86, 0.12, 0.48, 0x2ee6d6, 0, 0.33, 0), cub(0.14, 0.4, 0.04, 0x2ee6d6, 0.18, 0.08, 0.24), cub(0.15, 0.04, 0.05, ALB, 0.18, -0.08, 0.245)) },
  { id: 'medalie', nume: 'Medalie', emoji: '🥇', pret: 35, slot: 'corp', construieste: () => grup(
    cub(0.05, 0.3, 0.02, 0xe84a4a, -0.07, 0.2, 0.222), cub(0.05, 0.3, 0.02, 0x2a4fd8, 0.07, 0.2, 0.222), cub(0.16, 0.16, 0.03, AUR, 0, 0.0, 0.226, lucios(AUR))) },
  // ---------- MÂNĂ ----------
  { id: 'bagheta', nume: 'Baghetă magică', emoji: '🪄', pret: 50, slot: 'mana', construieste: () => {
    const g = grup(cub(0.05, 0.05, 0.5, NEGRU, 0, 0, 0.2), cub(0.06, 0.06, 0.08, ALB, 0, 0, 0.46));
    const s = cub(0.14, 0.14, 0.14, AUR, 0, 0, 0.54, lucios(AUR)); s.rotation.set(0.7, 0.7, 0); g.add(s);
    g.userData.scanteie = s; return g; } },
  { id: 'inghetata', nume: 'Înghețată', emoji: '🍦', pret: 20, slot: 'mana', construieste: () => grup(
    cub(0.1, 0.22, 0.1, 0xd8a050, 0, 0.06, 0.06), cub(0.16, 0.12, 0.16, 0xff9ac0, 0, 0.22, 0.06), cub(0.12, 0.1, 0.12, 0xf8f0e0, 0, 0.33, 0.06), cub(0.04, 0.04, 0.04, 0xe84a4a, 0, 0.4, 0.06)) },
  { id: 'lanterna', nume: 'Lanternă', emoji: '🔦', pret: 25, slot: 'mana', construieste: () => grup(
    cub(0.1, 0.1, 0.32, 0x4a5070, 0, 0, 0.12), cub(0.14, 0.14, 0.06, 0x9aa6bd, 0, 0, 0.3), cub(0.1, 0.1, 0.02, 0xfff8b0, 0, 0, 0.335, { emissive: 0xfff0a0 })) },
];
