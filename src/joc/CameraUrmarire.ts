// Camera „third person”: stă în spatele personajului și se rotește cu degetul.
import * as THREE from 'three';

const SENSIBILITATE = 0.006;   // cât de repede se rotește la tras cu degetul
const DISTANTA = 8;  // distanța obișnuită față de personaj
const UNGHI_SUS_MIN = -0.15;   // cât de jos poate coborî camera
const UNGHI_SUS_MAX = 1.2;     // cât de sus (aproape de deasupra)

export class CameraUrmarire {
  /** Rotirea în jurul personajului (stânga/dreapta) */
  unghi = 0;
  /** Cât de sus e camera (în radiani) */
  inaltime = 0.38;
  /** Cât de departe stă camera (se apropie la Personalizare) */
  distanta = DISTANTA;
  /** Cât de repede se rotește la tras cu degetul (din Setări) */
  sensibilitate = SENSIBILITATE;
  private tinta = new THREE.Vector3();

  constructor(public camera: THREE.PerspectiveCamera) {}

  roteste(dx: number, dy: number) {
    this.unghi -= dx * this.sensibilitate;
    this.inaltime = THREE.MathUtils.clamp(this.inaltime + dy * this.sensibilitate, UNGHI_SUS_MIN, UNGHI_SUS_MAX);
  }

  /** Mută camera imediat (fără alunecare), ex. după ce personajul revine la checkpoint */
  sari(poz: THREE.Vector3) {
    this.tinta.copy(poz).y += 1.4;
    this.actualizeaza(poz, 1);
  }

  actualizeaza(poz: THREE.Vector3, dt: number) {
    // ținta alunecă lin după personaj
    const dorit = poz.clone(); dorit.y += 1.4;
    this.tinta.lerp(dorit, Math.min(1, dt * 10));

    const oriz = Math.cos(this.inaltime) * this.distanta;
    this.camera.position.set(
      this.tinta.x + Math.sin(this.unghi) * oriz,
      this.tinta.y + Math.sin(this.inaltime) * this.distanta + 0.6,
      this.tinta.z + Math.cos(this.unghi) * oriz,
    );
    this.camera.lookAt(this.tinta);
  }
}
