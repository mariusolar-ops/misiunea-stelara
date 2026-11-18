// Texturi „pixelate” (16×16 pătrățele), desenate din cod – pentru blocurile din lumea din cuburi.
// Fiecare bloc are fețe diferite: iarba are sus verde, pe laterale pământ cu o dungă verde, jos pământ.
import * as THREE from 'three';

export type Pixeli = 'iarba' | 'pamant' | 'piatra' | 'lemn' | 'scanduri' | 'frunze' | 'nisip' | 'minereu' | 'cristal';

/** Un generator de numere „la întâmplare” care dă mereu aceleași numere (ca blocurile să arate la fel de fiecare dată) */
function aleator(samanta: number) {
  let s = samanta;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

/** Desenează 16×16 pixeli: „culoare(x, y, r)” spune ce culoare are fiecare pixel */
function deseneaza(samanta: number, culoare: (x: number, y: number, r: number) => string) {
  const c = document.createElement('canvas');
  c.width = c.height = 16;
  const g = c.getContext('2d')!;
  const r = aleator(samanta);
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    g.fillStyle = culoare(x, y, r());
    g.fillRect(x, y, 1, 1);
  }
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const alege = (r: number, culori: string[]) => culori[Math.floor(r * culori.length)];
const PAMANT = ['#7a5232', '#8a5e3a', '#6a4628', '#946a42'];
const IARBA = ['#5aa83a', '#68b844', '#4e9832', '#74c24e'];

// fiecare „față” de bloc e o textură separată, făcută o singură dată
const fete: Record<string, () => THREE.CanvasTexture> = {
  iarbaSus: () => deseneaza(11, (_x, _y, r) => alege(r, IARBA)),
  iarbaLat: () => deseneaza(12, (_x, y, r) => (y < 3 || (y < 5 && r < 0.45) ? alege(r, IARBA) : alege(r, PAMANT))),
  pamant: () => deseneaza(13, (_x, _y, r) => alege(r, PAMANT)),
  piatra: () => deseneaza(14, (_x, _y, r) => alege(r, ['#8a8a8a', '#7a7a7a', '#9a9a9a', '#6e6e6e', '#858585'])),
  lemnLat: () => deseneaza(15, (x, _y, r) => (x % 4 === 0 ? '#4a321c' : alege(r, ['#6a4a2a', '#5e4024', '#74522e']))),
  lemnSus: () => deseneaza(16, (x, y) => {
    const d = Math.max(Math.abs(x - 7.5), Math.abs(y - 7.5));
    return d > 6.5 ? '#5e4024' : Math.floor(d) % 2 ? '#b8905a' : '#a07a48';
  }),
  scanduri: () => deseneaza(17, (_x, y, r) => (y % 4 === 3 ? '#7a5a32' : alege(r, ['#b88a52', '#c4965c', '#a87e4a']))),
  frunze: () => deseneaza(18, (_x, _y, r) => (r < 0.12 ? '#1e4a16' : alege(r, ['#3a8a2a', '#2e7a22', '#46982e', '#347e26']))),
  nisip: () => deseneaza(19, (_x, _y, r) => alege(r, ['#e8d89a', '#dccc8a', '#f0e2a8', '#d4c482'])),
  minereu: () => deseneaza(20, (x, y, r) => {
    // pete albastre-turcoaz pe piatră (minereu de cristal stelar)
    const pata = ((x * 7 + y * 13) % 11 === 0) || ((x * 5 + y * 3) % 17 === 0 && r < 0.7);
    return pata ? alege(r, ['#2ee6d6', '#5af0e4', '#1ab8aa']) : alege(r, ['#8a8a8a', '#7a7a7a', '#9a9a9a']);
  }),
  cristal: () => deseneaza(21, (x, y, r) => ((x + y) % 5 === 0 ? '#e0fffb' : alege(r, ['#2ee6d6', '#3ad8f0', '#5af0e4']))),
};
const texturi = new Map<string, THREE.CanvasTexture>();
function textura(nume: string) {
  let t = texturi.get(nume);
  if (!t) { t = fete[nume](); texturi.set(nume, t); }
  return t;
}

/** Ce față are blocul pe fiecare parte: [laterale, sus, jos] */
const FETE: Record<Pixeli, [string, string, string]> = {
  iarba: ['iarbaLat', 'iarbaSus', 'pamant'],
  pamant: ['pamant', 'pamant', 'pamant'],
  piatra: ['piatra', 'piatra', 'piatra'],
  lemn: ['lemnLat', 'lemnSus', 'lemnSus'],
  scanduri: ['scanduri', 'scanduri', 'scanduri'],
  frunze: ['frunze', 'frunze', 'frunze'],
  nisip: ['nisip', 'nisip', 'nisip'],
  minereu: ['minereu', 'minereu', 'minereu'],
  cristal: ['cristal', 'cristal', 'cristal'],
};

const materiale = new Map<string, THREE.MeshLambertMaterial>();
/** Un material cu textura repetată de „rx × ry” ori (ca pătrățelele să rămână pătrate pe blocuri mari) */
function material(nume: string, rx: number, ry: number, emisiv = false) {
  const cheie = `${nume}:${rx}:${ry}`;
  let m = materiale.get(cheie);
  if (!m) {
    const t = textura(nume).clone();
    t.repeat.set(rx, ry);
    t.needsUpdate = true;
    m = new THREE.MeshLambertMaterial({ map: t, emissive: emisiv ? 0x0a4a44 : 0x000000 });
    materiale.set(cheie, m);
  }
  return m;
}

/**
 * Materialele pentru cele 6 fețe ale unui bloc de mărimea „dim”
 * (ordinea fețelor la cub: dreapta, stânga, sus, jos, față, spate).
 * Fiecare pătrățel de textură = 1 unitate, deci un bloc mare arată ca mai multe blocuri lipite.
 */
export function materialePixeli(tip: Pixeli, dim: [number, number, number]): THREE.Material[] {
  const [lat, sus, jos] = FETE[tip];
  const r = (v: number) => Math.max(1, Math.round(v));
  const [x, y, z] = dim.map(r) as [number, number, number];
  const em = tip === 'minereu' || tip === 'cristal';
  return [
    material(lat, z, y, em), material(lat, z, y, em),
    material(sus, x, z, em), material(jos, x, z, em),
    material(lat, x, y, em), material(lat, x, y, em),
  ];
}
