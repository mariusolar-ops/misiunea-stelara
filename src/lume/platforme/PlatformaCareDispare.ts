// Bloc care dispare: după ce calci pe el clipește puțin, apoi dispare câteva secunde.
import { Platforma, type CorpJucator, type EfectCalcare } from '../Platforma';

const TIMP_CLIPIRE = 0.7;   // cât clipește înainte să dispară
const TIMP_DISPARUT = 2.5;  // cât stă dispărut

export class PlatformaCareDispare extends Platforma {
  private stare: 'normal' | 'clipeste' | 'disparut' = 'normal';
  private timpStare = 0;

  laCalcare(_j: CorpJucator, timp: number): EfectCalcare {
    if (this.stare === 'normal') { this.stare = 'clipeste'; this.timpStare = timp; }
    return null;
  }

  actualizeaza(_dt: number, timp: number) {
    const t = timp - this.timpStare;
    if (this.stare === 'clipeste' && t > TIMP_CLIPIRE) {
      this.stare = 'disparut'; this.timpStare = timp; this.solid = false;
    } else if (this.stare === 'disparut' && t > TIMP_DISPARUT) {
      this.stare = 'normal'; this.solid = true;
    }
  }

  anima(timp: number) {
    const t = timp - this.timpStare;
    if (this.stare === 'clipeste') this.obiect.visible = Math.floor(t * 14) % 2 === 0;
    else this.obiect.visible = this.stare === 'normal';
  }

  reseteaza() { this.stare = 'normal'; this.solid = true; this.obiect.visible = true; }
}
