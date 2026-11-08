// Punctul de pornire al jocului „Mihai: Misiunea Stelară”
import './ui/stil.css';
import { Joc } from './joc/Joc';
import { nivelTest } from './nivele/test';

const canvas = document.getElementById('scena') as HTMLCanvasElement;
const joc = new Joc(canvas);
joc.incarcaNivel(nivelTest);
joc.porneste();

/** Încearcă ecran complet + blocare pe orizontală (merge pe Android în Chrome) */
async function ecranComplet() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    }
    const orientare = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
    await orientare.lock?.('landscape');
  } catch {
    // unele browsere nu permit – nu e grav, jocul merge oricum
  }
}

const ecranStart = document.getElementById('ecran-start')!;
document.getElementById('buton-start')!.addEventListener('click', () => {
  ecranComplet();
  ecranStart.style.display = 'none';
  joc.arataMesaj('Ajunge la capăt!', 2.5);
});
