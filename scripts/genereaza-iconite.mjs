// Desenează iconița jocului din cod (pixel-art: capul lui Mihai pe cerul cu stele)
// și o salvează ca fișiere PNG în public/iconite. Rulează automat înainte de build.
// Nu folosește nicio bibliotecă: doar Node.js (zlib pentru comprimarea PNG).
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';

// Culorile din desen
const CULORI = {
  '.': [11, 15, 46],      // cerul (fundal)
  '*': [255, 255, 255],   // stea albă
  '+': [46, 230, 214],    // stea turcoaz
  H: [107, 69, 41],       // păr șaten
  S: [245, 207, 160],     // piele
  W: [255, 255, 255],     // albul ochilor
  P: [43, 26, 14],        // pupile
  B: [74, 42, 18],        // sprâncene
  C: [242, 154, 154],     // obraji
  M: [138, 47, 47],       // gura
  N: [232, 184, 138],     // năsuc
  T: [158, 197, 238],     // tricou bleu
  G: [255, 210, 63],      // monedă aurie
};

// Desenul pe o grilă de 32 x 32. Capul e în mijloc (ca să încapă și în iconițele rotunde).
const DESEN = [
  '................................',
  '..*.........................+...',
  '.........+......................',
  '.....................*..........',
  '...............................*',
  '.*..............................',
  '..........HHHHHHHHHHHH..........',
  '........HHHHHHHHHHHHHHHH....*...',
  '.......HHHHHHHHHHHHHHHHHH.......',
  '...+...HHHHHHHHHHHHHHHHHH.......',
  '.......HHSSSHHHHHHHSSSSHH.......',
  '.......HSSSSSSSSSSSSSSSSH.......',
  '.......HSSBBBSSSSSSBBBSSH.......',
  '.......HSSWWPSSSSSSWWPSSH.....+.',
  '.......HSSWWPSSSSSSWWPSSH.......',
  '..*....SSSSSSSSNNSSSSSSSS.......',
  '.......SSCCSSSSSSSSSSCCSS.......',
  '.......SSSSSMSSSSSSMSSSSS....*..',
  '.......SSSSSSMMMMMMSSSSSS.......',
  '.......SSSSSSSSSSSSSSSSSS.......',
  '.........SSSSSSSSSSSSSS.........',
  '.+.........TTTTTTTTTT...........',
  '........TTTTTTTTTTTTTTTT........',
  '.......TTTTTTTTTTTTTTTTTT.......',
  '.......TTTTTTTTTTTTTTTTTT...GG..',
  '.....*.TTTTTTTTTTTTTTTTTT..GGGG.',
  '.......TTTTTTTTTTTTTTTTTT...GG..',
  '................................',
  '...+.........................*..',
  '..............*.................',
  '................................',
  '................................',
];

// --- Scrierea unui fișier PNG, de mână ---
const TABEL_CRC = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = TABEL_CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function bucata(tip, date) {
  const lung = Buffer.alloc(4); lung.writeUInt32BE(date.length);
  const tipDate = Buffer.concat([Buffer.from(tip), date]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(tipDate));
  return Buffer.concat([lung, tipDate, crc]);
}
function png(marime) {
  const randuri = [];
  for (let y = 0; y < marime; y++) {
    const rand = Buffer.alloc(1 + marime * 4); // primul octet = filtrul (0 = fără)
    const gy = Math.floor((y * 32) / marime);
    for (let x = 0; x < marime; x++) {
      const gx = Math.floor((x * 32) / marime);
      const [r, g, b] = CULORI[DESEN[gy][gx]];
      rand.set([r, g, b, 255], 1 + x * 4);
    }
    randuri.push(rand);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(marime, 0); ihdr.writeUInt32BE(marime, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8 biți, RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bucata('IHDR', ihdr),
    bucata('IDAT', deflateSync(Buffer.concat(randuri))),
    bucata('IEND', Buffer.alloc(0)),
  ]);
}

// verificare: toate rândurile trebuie să aibă exact 32 de caractere
DESEN.forEach((r, i) => { if (r.length !== 32) throw new Error(`Rândul ${i} are ${r.length} caractere`); });

mkdirSync('public/iconite', { recursive: true });
for (const m of [32, 180, 192, 512]) writeFileSync(`public/iconite/icon-${m}.png`, png(m));
console.log('Iconițe generate în public/iconite');
