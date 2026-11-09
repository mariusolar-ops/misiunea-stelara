// Instalarea jocului ca aplicație pe telefon (PWA) și pornirea modului offline.

/** Evenimentul pe care Chrome îl dă când jocul poate fi instalat */
interface CerereInstalare extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let cerere: CerereInstalare | null = null;

/** Pornește service worker-ul (doar în versiunea publicată, nu în timpul dezvoltării) */
export function pornestePwa(laSchimbare: () => void) {
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
        // dacă nu merge, jocul funcționează oricum (doar nu și offline)
      });
    });
  }
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // nu arătăm bannerul automat; îl arătăm când apasă butonul nostru
    cerere = e as CerereInstalare;
    laSchimbare();
  });
  window.addEventListener('appinstalled', () => { cerere = null; laSchimbare(); });
}

/** Rulează deja ca aplicație instalată (de pe iconița de pe ecran)? */
export function esteInstalat() {
  return matchMedia('(display-mode: fullscreen)').matches || matchMedia('(display-mode: standalone)').matches;
}

/**
 * Încearcă instalarea directă (fereastra Chrome „Instalează”).
 * Întoarce false dacă nu se poate – atunci arătăm instrucțiunile.
 */
export async function instaleaza(): Promise<boolean> {
  if (!cerere) return false;
  await cerere.prompt();
  await cerere.userChoice;
  cerere = null;
  return true;
}
