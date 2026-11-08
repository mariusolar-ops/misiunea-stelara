import { defineConfig } from 'vite';

// Pe GitHub Pages jocul stă la adresa https://<utilizator>.github.io/<repo>/
// În GitHub Actions variabila GITHUB_REPOSITORY are forma "utilizator/repo",
// așa că luăm de acolo numele repo-ului și îl punem ca „base”.
// Local (npm run dev) folosim rădăcina "/".
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = repo ? `/${repo}/` : '/';

export default defineConfig({
  base,
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
  },
});
