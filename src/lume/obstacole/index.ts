// Alege ce obstacol să construiască, după „tip”.
import { Laser, LaserRotativ, type DefLaser, type DefLaserRotativ } from './Laser';
import { Pendul, type DefPendul } from './Pendul';
import { Curent, type DefCurent } from './Curent';
import { Cristale, type DefCristale } from './Cristale';
import type { Obstacol } from './Obstacol';

export type DefinitieObstacol = DefLaser | DefLaserRotativ | DefPendul | DefCurent | DefCristale;
export type { Obstacol, EfectObstacol } from './Obstacol';

export function creeazaObstacol(def: DefinitieObstacol): Obstacol {
  switch (def.tip) {
    case 'laser': return new Laser(def);
    case 'laserRotativ': return new LaserRotativ(def);
    case 'pendul': return new Pendul(def);
    case 'curent': return new Curent(def);
    case 'cristale': return new Cristale(def);
  }
}
