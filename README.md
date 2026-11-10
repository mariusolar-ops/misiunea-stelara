# Mihai: Misiunea Stelară 🚀

Un joc 3D de sărituri prin spațiu („obby”), făcut pentru Mihai.
Merge în browserul telefonului și se poate instala ca aplicație, cu mers și fără internet.

**Joacă aici:** https://mariusolar-ops.github.io/misiunea-stelara/

## Cum îl instalezi pe telefonul Android

1. Deschide linkul de mai sus în **Chrome**.
2. În meniul jocului apasă **📲 Instalează pe telefon**, apoi **Instalează**.
   - Dacă nu apare fereastra: apasă pe **cele 3 puncte ⋮** din dreapta-sus în Chrome
     și alege **„Instalează aplicația”** sau **„Adaugă pe ecranul de pornire”**.
3. Pe ecranul telefonului apare iconița cu Mihai. De acum jocul pornește pe tot ecranul,
   pe orizontală, și merge **și fără internet**.

Actualizările vin singure: când telefonul are internet și deschizi jocul, ia versiunea nouă
(uneori e nevoie să-l închizi și să-l deschizi încă o dată).

## Siguranță

- Fără multiplayer, fără chat, fără conturi.
- Fără reclame și fără cumpărături cu bani reali (magazinul folosește doar monedele din joc).
- Nu colectează date și nu trimite nimic pe internet. Progresul stă doar pe telefon (localStorage).
- Clasamentul cu prietenii merge prin **coduri de scor**: jucătorul își copiază codul (nume + timpi + stele)
  și îl trimite el, de mână, cui vrea (ex. pe WhatsApp). Jocul nu trimite nimic singur.

## Ce conține

- 11 niveluri: Baza de pe Lună, Inelul de asteroizi, Stația spațială, Luna vulcanică, Lângă gaura neagră,
  Laboratorul cu lasere, Planeta de gheață, Fortăreața robotului, Răscrucea cometei (cu două drumuri),
  Asteroidul cu gravitație mică, Turnul spre stele + 2 niveluri secrete (Nebuloasa secretă, Templul de aur)
- 5 stele secrete mov (nivelurile 1–5) deblochează „Aripi de stea” și Nebuloasa secretă;
  4 stele de aur (nivelurile 6–9) deblochează Templul de aur
- Clasament (total stele + cel mai bun timp pe fiecare nivel) cu prietenii adăugați prin cod
- Platforme care se mișcă, blocuri care dispar, lavă, trambuline, benzi rulante, gheață
- Obstacole: lasere (fixe, care clipesc, care se mișcă, rotative), pendule, curenți de aer, cristale
- Steaguri de checkpoint, monede, cronometru, stele (1–3) și recorduri
- Personalizare: băiat sau fată, 5 coafuri, 6 modele de tricou, pantaloni lungi/scurți sau fustă, 18 culori
- 8 accesorii din cuburi + un animal de companie la alegere: câine, pisică, iepuraș, capră sau zebră
- Super-puteri cumpărate cu monedele din joc: super-săritură, viteză, săritură dublă, zbor
  (se pot opri oricând, pentru joc „greu”)
- Cufere surpriză (100 de monede din joc): urme în spatele personajului, sunete de săritură, efecte la aterizare
- Muzică spațială compusă din cod și ecran de Setări (volum, muzică, joystick stânga/dreapta, mărime butoane, cameră)
- Serie zilnică (monede în fiecare zi, cufăr gratis în ziua a 7-a) și titluri pentru realizări
- Jocul e în 5 limbi: română, engleză, franceză, spaniolă, germană (Setări → Limbă)
- Eveniment „Monede x2” în primele 15 minute din fiecare oră (după ceasul telefonului)
- Sunete generate din cod (Web Audio), cu buton de sunet pornit/oprit
- Tot ce se vede e desenat din cod: nicio imagine sau model descărcat

## Pentru cine modifică jocul

- `src/nivele/` – fiecare nivel e în fișierul lui (`nivel1.ts` … `nivel11.ts`, `nivelSecret.ts`).
  Pentru un nivel nou: copiază un fișier, schimbă platformele și adaugă-l în `src/nivele/index.ts`
  (la SFÂRȘITUL listei NIVELE, apoi în ORDINE_NORMALA – așa progresul salvat rămâne corect).
- `src/lume/obstacole/` – lasere, pendule, curenți de aer, cristale
- `src/i18n/` – traducerile; un text nou se scrie în cod cu `t('Text în română')`
  și se adaugă un rând în `src/i18n/traduceri.ts`
- `src/lume/` – platforme, steaguri, monede, decor
- `src/joc/` – personajul, fizica, camera, salvarea, accesoriile
- `src/ui/` – meniuri, ecrane, interfața
- `scripts/genereaza-iconite.mjs` – desenează iconița (pixel-art) din cod

Comenzi: `npm install`, apoi `npm run dev` (test local) sau `npm run build`.
La fiecare push pe `main`, GitHub Actions construiește și publică jocul pe GitHub Pages.
Adaugă `?fps` la adresă ca să vezi contorul de cadre pe secundă.
