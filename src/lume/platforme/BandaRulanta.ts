// Bandă rulantă: te împinge într-o parte cât timp stai pe ea.
// Dungile de pe ea sunt desenate din cod și „curg” în direcția benzii.
import * as THREE from 'three';
import { Platforma, type DefinitiePlatforma, type CorpJucator, type EfectCalcare } from '../Platforma';

/**
 * Textura cu dungi: „peX” = dungile stau în picioare (banda merge pe x).
 * Dacă banda are o culoare a ei (ex. albastru pentru apă), dungile sunt în nuanțe de culoarea aceea.
 */
function texturaDungi(peX: boolean, culoare?: number) {
  if (culoare === 0xffd23f) culoare = undefined;   // galbenul e aspectul obișnuit al benzii
  const c = document.createElement('canvas');
  c.width = peX ? 64 : 16; c.height = peX ? 16 : 64;
  const g = c.getContext('2d')!;
  const fond = culoare === undefined ? '#3a4058' : '#' + new THREE.Color(culoare).multiplyScalar(0.7).getHexString();
  const dunga = culoare === undefined ? '#ffd23f' : '#' + new THREE.Color(culoare).lerp(new THREE.Color(0xffffff), 0.45).getHexString();
  g.fillStyle = fond; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = dunga;
  if (peX) g.fillRect(0, 0, 18, 16); else g.fillRect(0, 0, 16, 18);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.NearestFilter;
  return t;
}
const texturi: Record<string, THREE.CanvasTexture> = {};

export class BandaRulanta extends Platforma {
  private vx: number;
  private vz: number;
  private textura: THREE.Texture;
  private peX: boolean;

  constructor(def: DefinitiePlatforma) {
    const [vx, vz] = def.viteza ?? [0, 2];
    const peX = Math.abs(vx) > Math.abs(vz);
    const cheie = (peX ? 'x' : 'z') + (def.culoare ?? '');
    texturi[cheie] ??= texturaDungi(peX, def.culoare);
    const textura = texturi[cheie].clone();
    // pe fața de sus a cutiei: u merge pe x, v merge pe z (invers)
    if (peX) textura.repeat.set(def.dim[0], 1);
    else textura.repeat.set(1, def.dim[2]);
    textura.needsUpdate = true;
    super({ ...def, culoare: def.culoare ?? 0xffd23f }, new THREE.MeshLambertMaterial({ map: textura }));
    this.vx = vx; this.vz = vz; this.textura = textura; this.peX = peX;
  }

  laCalcare(j: CorpJucator, _timp: number): EfectCalcare {
    j.impingere.set(this.vx, 0, this.vz);
    return null;
  }

  anima(timp: number) {
    // dungile se mișcă cu viteza benzii
    if (this.peX) this.textura.offset.x = -timp * this.vx;
    else this.textura.offset.y = timp * this.vz;
  }
}
