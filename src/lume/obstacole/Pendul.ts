// Pendulul: un bloc greu care se balansează dintr-o parte în alta și te împinge.
// Nu „doare” – doar te dă la o parte (și poate cazi de pe platformă!).
import * as THREE from 'three';
import type { CorpObstacol, EfectObstacol, Obstacol } from './Obstacol';
import type { Punct } from '../../nivele/tipuri';

const CUB = new THREE.BoxGeometry(1, 1, 1);
const MAT_BLOC = new THREE.MeshLambertMaterial({ color: 0xffb02e });
const MAT_DUNGA = new THREE.MeshLambertMaterial({ color: 0x2a2a33 });
const MAT_FUNIE = new THREE.MeshLambertMaterial({ color: 0x9aa6bd });
const FORTA_IMPINGERE = 16;
const MARIME = 1.2;

export interface DefPendul {
  tip: 'pendul';
  /** Punctul de care atârnă */
  pivot: Punct;
  lungime: number;
  /** Cât de larg se balansează (radiani, ex. 1 = cam 57°) */
  amplitudine: number;
  perioada: number;
  faza?: number;
  /** În ce direcție se balansează */
  axa: 'x' | 'z';
}

export class Pendul implements Obstacol {
  obiect = new THREE.Group();
  private brat = new THREE.Group(); // se rotește în jurul pivotului
  private pivot: THREE.Vector3;
  private centru = new THREE.Vector3();
  private ultimaLovitura = -9;

  constructor(private def: DefPendul) {
    this.pivot = new THREE.Vector3(...def.pivot);
    this.brat.position.copy(this.pivot);
    const funie = new THREE.Mesh(CUB, MAT_FUNIE);
    funie.scale.set(0.08, def.lungime, 0.08);
    funie.position.y = -def.lungime / 2;
    const bloc = new THREE.Mesh(CUB, MAT_BLOC);
    bloc.scale.setScalar(MARIME);
    bloc.position.y = -def.lungime;
    const dunga = new THREE.Mesh(CUB, MAT_DUNGA);
    dunga.scale.set(MARIME + 0.02, 0.2, MARIME + 0.02);
    dunga.position.y = -def.lungime;
    this.brat.add(funie, bloc, dunga);
    // suportul de sus
    const suport = new THREE.Mesh(CUB, MAT_FUNIE);
    suport.scale.set(def.axa === 'x' ? 0.3 : 1.4, 0.3, def.axa === 'x' ? 1.4 : 0.3);
    suport.position.copy(this.pivot);
    this.obiect.add(this.brat, suport);
  }

  actualizeaza(j: CorpObstacol, timp: number): EfectObstacol {
    const d = this.def;
    const faza = ((timp / d.perioada) + (d.faza ?? 0)) * Math.PI * 2;
    const unghi = d.amplitudine * Math.sin(faza);
    // rotim brațul în planul în care se balansează
    if (d.axa === 'x') this.brat.rotation.set(0, 0, unghi); else this.brat.rotation.set(-unghi, 0, 0);
    const lateral = Math.sin(unghi) * d.lungime;
    this.centru.set(
      this.pivot.x + (d.axa === 'x' ? lateral : 0),
      this.pivot.y - Math.cos(unghi) * d.lungime,
      this.pivot.z + (d.axa === 'z' ? lateral : 0),
    );
    // atinge personajul? (comparăm cu mijlocul personajului)
    const dx = j.poz.x - this.centru.x, dz = j.poz.z - this.centru.z;
    const dy = (j.poz.y + 0.95) - this.centru.y;
    if (Math.abs(dy) < 1.5 && Math.hypot(dx, dz) < 0.95 && timp - this.ultimaLovitura > 0.6) {
      this.ultimaLovitura = timp;
      // îl împingem în direcția în care se mișcă pendulul
      const sens = Math.sign(Math.cos(faza)) || 1;
      const dirX = d.axa === 'x' ? sens : 0, dirZ = d.axa === 'z' ? sens : 0;
      j.viteza.x = dirX * FORTA_IMPINGERE;
      j.viteza.z = dirZ * FORTA_IMPINGERE;
      j.viteza.y = 7;
      return 'lovitura';
    }
    return null;
  }
}
