// NIVELUL 43 – Simulatorul de univers (cerut de Mihai: un nivel ca jocurile-simulator cu planete)
// Ești într-un univers-jucărie: planetele se învârt pe orbite în jurul unui soare,
// comete trec în viteză, o gaură neagră te trage spre ea și lunile se rotesc
// în jurul unei planete de foc. Urcă pe planete și lasă-te dus de orbită!
//  - nu atinge soarele sau planeta de foc (te trimit înapoi, ca lava)
import type { DefinitieNivel } from './tipuri';
import type { DefMeteor } from '../lume/obstacole/Meteor';
import { bloc, lava, planeta, linieMonede, monedaPe, CULORI as C } from './ajutoare';

const ÎNAINTE = Math.PI;
const STATIE = 0x5a6488;
const PUNTE = 0x3a4468;

const cometa = (de: [number, number, number], la: [number, number, number], perioada: number, faza = 0): DefMeteor =>
  ({ tip: 'meteor', de, la, raza: 1.1, perioada, faza });

export const nivel43: DefinitieNivel = {
  nume: 'Simulatorul de univers',
  tema: 'univers',
  start: [0, 0, 1],
  directieStart: ÎNAINTE,

  platforme: [
    bloc(0, 0, 0, 8, 6, STATIE),                             // stația de pornire
    bloc(0, 0, -7, 3, 3, PUNTE),
    // sistemul solar: două planete pe orbită în jurul soarelui
    lava(0, 0, -18, 4, 4),                                    // soarele (fierbinte!)
    planeta(0, 0, -18, 7, 12, 0, 3, 0x3a8adf),               // planeta albastră
    planeta(0, 0, -18, 7, 12, 0.5, 3, 0x5acf5a),             // planeta verde
    bloc(0, 0, -29, 3, 3, PUNTE),
    bloc(0, 0, -34, 6, 6, C.turcoaz),                        // steagul 1
    bloc(0, 0, -45, 4, 12, PUNTE),                           // podul cu comete
    bloc(0, 0, -58, 3.6, 10, PUNTE),                         // lângă gaura neagră
    bloc(0, 0, -68, 6, 6, C.turcoaz),                        // steagul 2
    bloc(0, 1.5, -73.5, 3, 2, PUNTE),
    // planeta de foc și cele trei luni ale ei (se învârt invers)
    lava(0, 3, -82, 4, 4),
    planeta(0, 3, -82, 6.5, -9, 0, 2.5, 0xc8c8d8),
    planeta(0, 3, -82, 6.5, -9, 0.33, 2.5, 0xa8a8c0),
    planeta(0, 3, -82, 6.5, -9, 0.66, 2.5, 0xd8d0c0),
    bloc(0, 3, -94, 8, 8, C.turcoaz),                        // marginea universului: finalul
  ],

  obstacole: [
    // cometele trec prin fața ta
    cometa([-14, 1.1, -42], [14, 1.1, -42], 3),
    cometa([14, 1.1, -47.5], [-14, 1.1, -47.5], 2.6, 0.5),
    // gaura neagră te trage spre stânga
    { tip: 'vant', poz: [0, 2, -58], dim: [14, 6, 10], forta: [-2.5, 0] },
  ],

  indicii: [
    { poz: [0, 0, -7], raza: 2, text: 'Urcă pe o planetă și lasă-te dus de orbită!' },
    { poz: [0, 0, -34], raza: 2.5, text: 'Ferește-te de comete!' },
    { poz: [0, 0, -51], raza: 2.5, text: 'Gaura neagră te trage – ține-te spre dreapta!' },
  ],

  steaguri: [
    { poz: [-2, 0, -34], directie: ÎNAINTE },
    { poz: [-2, 0, -68], directie: ÎNAINTE },
  ],

  monede: [
    monedaPe(0, 0, -7),
    [5, 1.2, -13], [-5, 1.2, -23], [7, 1.2, -18], monedaPe(0, 0, -29),
    ...linieMonede([0, 1, -40], [0, 1, -50], 4),
    ...linieMonede([0, 1, -55], [0, 1, -61], 3),
    monedaPe(0, 1.5, -73.5),
    [6.5, 4.2, -82], [-6.5, 4.2, -82], [0, 4.2, -88.5],
    ...linieMonede([-2.5, 4, -92], [2.5, 4, -92], 3),
  ],

  final: { poz: [0, 3, -97.5], directie: ÎNAINTE },
};
