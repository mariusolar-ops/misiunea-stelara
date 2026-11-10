// Punctul de pornire al jocului „Mihai: Misiunea Stelară”
import './ui/stil.css';
import { Joc } from './joc/Joc';
import { pregatesteSunetul } from './audio/Sunete';
import { pornestePwa } from './pwa/Instalare';

const canvas = document.getElementById('scena') as HTMLCanvasElement;
const joc = new Joc(canvas);
joc.porneste();
// premiul zilei (seria zilnică), la o clipă după pornire
setTimeout(() => { joc.verificaZiua(); joc.verificaTitluri(); }, 800);

// Aplicație instalabilă + offline. Când apare posibilitatea de instalare, reîmprospătăm meniul.
pornestePwa(() => joc.reimprospateazaMeniu());

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

// La prima atingere a unui buton din meniu trecem pe tot ecranul
document.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('#meniu button, #ecran-final button')) ecranComplet();
});

// Sunetul se poate porni doar după ce copilul atinge ecranul (regulă a browserelor)
window.addEventListener('pointerdown', pregatesteSunetul);
