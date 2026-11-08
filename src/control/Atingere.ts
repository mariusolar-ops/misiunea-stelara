// Comenzile cu degetul:
//  - joystick în stânga-jos (merge cu mai multe degete în același timp)
//  - butonul SARI în dreapta-jos
//  - oriunde altundeva: tragi cu degetul ca să rotești camera
import { Intrari } from './Intrari';

const RAZA_JOYSTICK = 60; // cât de departe se poate trage butonul joystick-ului (pixeli)

export function pornesteAtingere(intrari: Intrari) {
  const baza = document.getElementById('joystick')!;
  const buton = document.getElementById('joystick-buton')!;
  const sari = document.getElementById('buton-sari')!;

  let degetJoystick: number | null = null;
  let centruJoystick = { x: 0, y: 0 };
  // Degetele care rotesc camera: id -> ultima poziție
  const degeteCamera = new Map<number, { x: number; y: number }>();

  // Butonul SARI are propriul ascultător
  sari.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    intrari.sariApasat = true;
    sari.classList.add('apasat');
  });
  const ridicaSari = () => sari.classList.remove('apasat');
  sari.addEventListener('pointerup', ridicaSari);
  sari.addEventListener('pointercancel', ridicaSari);
  sari.addEventListener('pointerleave', ridicaSari);

  // Zona joystick-ului: tot sfertul din stânga-jos, ca să fie ușor de nimerit
  function eInZonaJoystick(x: number, y: number) {
    return x < window.innerWidth * 0.4 && y > window.innerHeight * 0.4;
  }

  function mutaJoystick(x: number, y: number) {
    let dx = x - centruJoystick.x;
    let dy = y - centruJoystick.y;
    const dist = Math.hypot(dx, dy);
    if (dist > RAZA_JOYSTICK) { dx = (dx / dist) * RAZA_JOYSTICK; dy = (dy / dist) * RAZA_JOYSTICK; }
    buton.style.transform = `translate(${dx}px, ${dy}px)`;
    // y pe ecran crește în jos, dar „înainte” e în sus
    intrari.joystick.x = dx / RAZA_JOYSTICK;
    intrari.joystick.y = -dy / RAZA_JOYSTICK;
  }

  function elibereazaJoystick() {
    degetJoystick = null;
    buton.style.transform = '';
    intrari.joystick.x = 0;
    intrari.joystick.y = 0;
  }

  window.addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).closest('button')) return; // butoanele se ocupă singure
    if (degetJoystick === null && e.pointerType !== 'mouse' && eInZonaJoystick(e.clientX, e.clientY)) {
      degetJoystick = e.pointerId;
      const r = baza.getBoundingClientRect();
      centruJoystick = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      mutaJoystick(e.clientX, e.clientY);
    } else {
      degeteCamera.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }
  });

  window.addEventListener('pointermove', (e) => {
    if (e.pointerId === degetJoystick) {
      mutaJoystick(e.clientX, e.clientY);
      return;
    }
    const ultima = degeteCamera.get(e.pointerId);
    if (ultima) {
      intrari.rotireCamera.x += e.clientX - ultima.x;
      intrari.rotireCamera.y += e.clientY - ultima.y;
      ultima.x = e.clientX;
      ultima.y = e.clientY;
    }
  });

  const ridica = (e: PointerEvent) => {
    if (e.pointerId === degetJoystick) elibereazaJoystick();
    degeteCamera.delete(e.pointerId);
  };
  window.addEventListener('pointerup', ridica);
  window.addEventListener('pointercancel', ridica);
}
