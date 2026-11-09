// Service worker: păstrează jocul pe telefon, ca să meargă și fără internet.
// Lista de fișiere și versiunea de mai jos sunt completate automat la build (vezi vite.config.ts).
// Nu trimite nimic pe internet – doar își descarcă propriile fișiere ale jocului.

const CACHE = 'misiunea-stelara-__VERSIUNE__';
const FISIERE = __FISIERE__;

// La instalare: descărcăm toate fișierele jocului
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FISIERE)).then(() => self.skipWaiting()));
});

// La activare: ștergem versiunile vechi ale jocului
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((chei) => Promise.all(chei.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const cerere = e.request;
  if (cerere.method !== 'GET' || new URL(cerere.url).origin !== location.origin) return;

  if (cerere.mode === 'navigate') {
    // Pagina principală: încercăm întâi internetul (ca să primim versiunea nouă),
    // iar dacă nu e internet, folosim copia salvată.
    e.respondWith(fetch(cerere).catch(() => caches.match('./index.html', { ignoreVary: true }).then((r) => r || caches.match('./', { ignoreVary: true }))));
    return;
  }
  // Restul fișierelor: din copia salvată, iar dacă lipsesc, de pe internet
  // (ignoreVary: unele servere trimit antetul „Vary” și altfel copia salvată n-ar fi găsită)
  e.respondWith(caches.match(cerere, { ignoreVary: true }).then((r) => r || fetch(cerere)));
});
