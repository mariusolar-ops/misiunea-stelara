// NIVELUL SECRET 2 – Templul de aur
// Se deschide doar după ce găsești toate cele 4 stele de aur din nivelurile 6, 7, 8 și 9.
// Un nivel greu și strălucitor, cu de toate: trambulină, platformă mobilă, laser rotativ,
// pendule, blocuri care dispar și o bandă cu laser.
import type { DefinitieNivel } from './tipuri';
import { bloc, mobila, dispare, trambulina, banda, laserX, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const AUR = 0xe0b040;
const AUR2 = 0xc8962a;

export const nivelSecret2: DefinitieNivel = {
  nume: 'Templul de aur',
  tema: 'aur',
  esteSecret: true,
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 8, AUR),
    trambulina(0, 0, -6.5, 3, 3),
    bloc(0, 5, -12.5, 3, 3, AUR2),
    mobila(bloc(-3, 5, -18.5, 2.5, 2.5, C.portocaliu), [6, 0, 0], 3),
    bloc(0, 5, -24, 3, 3, AUR2),
    bloc(0, 5, -31, 6, 6, C.turcoaz),               // steagul 1
    bloc(0, 5, -41, 8, 8, AUR),                      // camera cu laser rotativ
    bloc(0, 6.5, -41, 1, 1, AUR2, 1.5),              // stâlpul laserului
    bloc(0, 5, -52, 2, 10, AUR2),                    // puntea cu pendule
    bloc(0, 5, -62, 6, 6, C.turcoaz),               // steagul 2
    dispare(bloc(0, 5.6, -68, 2.5, 2.5, C.roz)),
    dispare(bloc(0, 6.2, -72, 2.5, 2.5, C.roz)),
    dispare(bloc(0, 6.8, -76, 2.5, 2.5, C.roz)),
    banda(0, 6.8, -84, 3, 10, 0, 3),                 // vine spre tine…
    bloc(0, 6.8, -95, 8, 8, AUR),                    // finalul
  ],

  obstacole: [
    { tip: 'laserRotativ', centru: [0, 5.45, -41], raza: 3.8, viteza: 2.2 },
    { tip: 'pendul', pivot: [0, 9.6, -49.5], lungime: 4, amplitudine: 0.9, perioada: 2.2, axa: 'x' },
    { tip: 'pendul', pivot: [0, 9.6, -54.5], lungime: 4, amplitudine: 0.9, perioada: 2.2, faza: 0.5, axa: 'x' },
    laserX(-84, 7.3, -1.5, 1.5),                     // …și are un laser jos pe ea: sari!
  ],

  steaguri: [
    { poz: [-2.2, 5, -31], directie: ÎNAINTE },
    { poz: [-2.2, 5, -62], directie: ÎNAINTE },
  ],

  monede: [
    ...linieMonede([-2, 1, -2], [2, 1, -2], 3),
    ...linieMonede([0, 2.5, -6.5], [0, 5.5, -6.5], 3),
    monedaPe(0, 5, -12.5), [0, 6.2, -18.5], monedaPe(0, 5, -24),
    ...linieMonede([-3, 6, -38], [3, 6, -38], 3), ...linieMonede([-3, 6, -44], [3, 6, -44], 3),
    ...linieMonede([0, 6, -48], [0, 6, -56], 4),
    monedaPe(0, 5.6, -68), monedaPe(0, 6.2, -72), monedaPe(0, 6.8, -76),
    ...linieMonede([0, 7.8, -80], [0, 7.8, -88], 4),
    ...linieMonede([-3, 7.8, -93], [3, 7.8, -93], 3),
  ],

  final: { poz: [0, 6.8, -96], directie: ÎNAINTE },
};
