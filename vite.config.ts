import { defineConfig, type Plugin } from 'vite';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// Pe GitHub Pages jocul stă la adresa https://<utilizator>.github.io/<repo>/
// În GitHub Actions variabila GITHUB_REPOSITORY are forma "utilizator/repo",
// așa că luăm de acolo numele repo-ului și îl punem ca „base”.
// Local (npm run dev) folosim rădăcina "/".
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = repo ? `/${repo}/` : '/';

// Fișierele din „public” care trebuie să meargă și offline
const FISIERE_PUBLICE = [
  'manifest.webmanifest',
  'iconite/icon-32.png', 'iconite/icon-180.png', 'iconite/icon-192.png', 'iconite/icon-512.png',
];

/**
 * Construiește service worker-ul (sw.js) la build, cu lista exactă a fișierelor jocului,
 * ca să poată fi salvate toate pe telefon din prima.
 */
function serviceWorker(): Plugin {
  return {
    name: 'service-worker-joc',
    apply: 'build',
    generateBundle(_optiuni, pachet) {
      const fisiere = ['./', './index.html', ...Object.keys(pachet).filter((f) => f !== 'index.html').map((f) => './' + f),
        ...FISIERE_PUBLICE.map((f) => './' + f)];
      const versiune = createHash('sha1').update(fisiere.join('|')).digest('hex').slice(0, 10);
      const sablon = readFileSync('src/pwa/sw-sablon.js', 'utf8');
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: sablon.replace('__VERSIUNE__', versiune).replace('__FISIERE__', JSON.stringify(fisiere, null, 2)),
      });
    },
  };
}

export default defineConfig({
  base,
  plugins: [serviceWorker()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
  },
});
