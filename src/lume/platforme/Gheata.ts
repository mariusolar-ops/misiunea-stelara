// Gheață: pe ea aluneci – pornești greu și te oprești greu. Atenție la margini!
import * as THREE from 'three';
import { Platforma, type DefinitiePlatforma, type CorpJucator, type EfectCalcare } from '../Platforma';

const MATERIAL_GHEATA = new THREE.MeshLambertMaterial({ color: 0xcfefff, emissive: 0x1a4a66 });

export class Gheata extends Platforma {
  constructor(def: DefinitiePlatforma) {
    super({ ...def, culoare: def.culoare ?? 0x9fdcff }, MATERIAL_GHEATA);
  }
  laCalcare(_j: CorpJucator, _timp: number): EfectCalcare { return 'gheata'; }
}
