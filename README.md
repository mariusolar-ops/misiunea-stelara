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

## Ce conține

- 5 niveluri: Baza de pe Lună, Inelul de asteroizi, Stația spațială, Luna vulcanică, Lângă gaura neagră
- Platforme care se mișcă, blocuri care dispar, lavă, trambuline, benzi rulante
- Steaguri de checkpoint, monede, cronometru, stele (1–3) și recorduri
- Personalizare: culori + 8 accesorii din cuburi, un cățeluș care te urmează
- Sunete generate din cod (Web Audio), cu buton de sunet pornit/oprit
- Tot ce se vede e desenat din cod: nicio imagine sau model descărcat

## Pentru cine modifică jocul

- `src/nivele/` – fiecare nivel e în fișierul lui (`nivel1.ts` … `nivel5.ts`).
  Pentru un nivel nou: copiază un fișier, schimbă platformele și adaugă-l în `src/nivele/index.ts`.
- `src/lume/` – platforme, steaguri, monede, decor
- `src/joc/` – personajul, fizica, camera, salvarea, accesoriile
- `src/ui/` – meniuri, ecrane, interfața
- `scripts/genereaza-iconite.mjs` – desenează iconița (pixel-art) din cod

Comenzi: `npm install`, apoi `npm run dev` (test local) sau `npm run build`.
La fiecare push pe `main`, GitHub Actions construiește și publică jocul pe GitHub Pages.
Adaugă `?fps` la adresă ca să vezi contorul de cadre pe secundă.
