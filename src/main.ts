// Punctul de pornire al jocului „Mihai: Misiunea Stelară”
import './ui/stil.css';
import { Joc } from './joc/Joc';
import { nivel1 } from './nivele/nivel1';

const canvas = document.getElementById('scena') as HTMLCanvasElement;
const joc = new Joc(canvas);
joc.incarcaNivel(nivel1);
joc.porneste();

// Doar în timpul dezvoltării: acces la joc din consolă, pentru teste
if (import.meta.env.DEV) (window as unknown as { joc: Joc }).joc = joc;

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
  joc.reincepe(); // cronometrul pornește de abia acum
  joc.arataMesaj('Ajunge la poarta turcoaz!', 2.5);
});
