// Alege ce fel de platformă să construiască, după „tip”.
import { Platforma, type DefinitiePlatforma } from '../Platforma';
import { PlatformaMobila } from './PlatformaMobila';
import { PlatformaCareDispare } from './PlatformaCareDispare';
import { Lava } from './Lava';
import { Trambulina } from './Trambulina';
import { BandaRulanta } from './BandaRulanta';

export function creeazaPlatforma(def: DefinitiePlatforma): Platforma {
  switch (def.tip) {
    case 'miscare': return new PlatformaMobila(def);
    case 'dispare': return new PlatformaCareDispare(def);
    case 'lava': return new Lava(def);
    case 'trambulina': return new Trambulina(def);
    case 'banda': return new BandaRulanta(def);
    default: return new Platforma(def);
  }
}
