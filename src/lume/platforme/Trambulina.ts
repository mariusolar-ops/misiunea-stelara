// Trambulină: te aruncă sus în aer când aterizezi pe ea.
import { Platforma, type DefinitiePlatforma, type CorpJucator, type EfectCalcare } from '../Platforma';

export class Trambulina extends Platforma {
  private forta: number;
  private inaltimeNormala: number;
  private timpSaritura = -9;

  constructor(def: DefinitiePlatforma) {
    super({ ...def, culoare: def.culoare ?? 0xa6f04a });
    this.forta = def.forta ?? 20;
    this.inaltimeNormala = def.dim[1];
  }

  laCalcare(j: CorpJucator, timp: number): EfectCalcare {
    j.viteza.y = this.forta;
    this.timpSaritura = timp;
    return 'trambulina';
  }

  anima(timp: number) {
    // se turtește puțin și revine, ca un arc
    const t = timp - this.timpSaritura;
    const turtire = t < 0.3 ? Math.sin((t / 0.3) * Math.PI) * 0.35 : 0;
    this.obiect.scale.y = this.inaltimeNormala * (1 - turtire);
  }
}
