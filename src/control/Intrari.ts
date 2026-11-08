// Starea comenzilor într-un singur loc.
// Joystick-ul, butonul SARI, degetul pe ecran și tastatura (pentru test pe calculator)
// scriu aici, iar jocul doar citește.

export class Intrari {
  /** Direcția de mers, fiecare între -1 și 1 (x = stânga/dreapta, y = înainte/înapoi) */
  mers = { x: 0, y: 0 };
  /** Devine true în momentul în care se apasă SARI (jocul îl resetează după ce îl citește) */
  sariApasat = false;
  /** Cât s-a rotit camera din deget de la ultimul cadru (în pixeli) */
  rotireCamera = { x: 0, y: 0 };

  // Tastele ținute apăsate (doar pentru calculator)
  private taste = new Set<string>();
  // Mișcarea venită de la joystick, separat de tastatură
  joystick = { x: 0, y: 0 };

  constructor() {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      this.taste.add(e.code);
      if (e.code === 'Space') this.sariApasat = true;
    });
    window.addEventListener('keyup', (e) => this.taste.delete(e.code));
    window.addEventListener('blur', () => this.taste.clear());
  }

  /** Se apelează o dată pe cadru: combină tastatura cu joystick-ul */
  actualizeaza() {
    let x = 0, y = 0;
    if (this.taste.has('KeyW') || this.taste.has('ArrowUp')) y += 1;
    if (this.taste.has('KeyS') || this.taste.has('ArrowDown')) y -= 1;
    if (this.taste.has('KeyA') || this.taste.has('ArrowLeft')) x -= 1;
    if (this.taste.has('KeyD') || this.taste.has('ArrowRight')) x += 1;
    const lung = Math.hypot(x, y);
    if (lung > 0) { x /= lung; y /= lung; }
    // Dacă nu se apasă nimic pe tastatură, folosim joystick-ul
    this.mers.x = lung > 0 ? x : this.joystick.x;
    this.mers.y = lung > 0 ? y : this.joystick.y;
  }

  /** Citește și golește rotirea camerei acumulată */
  iaRotireCamera() {
    const r = { ...this.rotireCamera };
    this.rotireCamera.x = 0;
    this.rotireCamera.y = 0;
    return r;
  }

  /** Citește și resetează apăsarea pe SARI */
  iaSari() {
    const s = this.sariApasat;
    this.sariApasat = false;
    return s;
  }
}
