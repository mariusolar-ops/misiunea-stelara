// Cartea cu noutăți 📒 (ideea lui Mihai): toate actualizările jocului, cele mai noi primele.
// Când apare o actualizare nouă și intri în joc, îți arată singură ce e nou.
// CA SĂ ADAUGI O NOUTATE: pune un rând nou SUS în lista NOUTATI (cu o „versiune” nouă).
import { salveaza, type Progres } from '../joc/Salvare';
import { sunete } from '../audio/Sunete';
import { t } from '../i18n';

export interface Noutate { versiune: string; data: string; titlu: string; lucruri: string[] }

export const NOUTATI: Noutate[] = [
  { versiune: '2026-11-13e', data: '13 noiembrie', titlu: 'Nivel nou: Trenulețul de pe inelele lui Saturn', lucruri: [
    '🚃 Trenulețul de pe inelele lui Saturn: vagoane care te duc singure, gheață din inele, o rază la peron și Saturn uriaș pe cer',
  ] },
  { versiune: '2026-11-13d', data: '13 noiembrie', titlu: 'Nivel nou: Sera spațială', lucruri: [
    '🌺 Sera spațială: flori-trambulină, perete de liane pe care alergi, frunze ude, jetul stropitoarei și petale care cad',
  ] },
  { versiune: '2026-11-13c', data: '13 noiembrie', titlu: 'Nivel nou: Tabla de șah cosmică', lucruri: [
    '♟️ Tabla de șah cosmică: pătrățele de lavă, turnuri care alunecă, raza reginei, săritura calului și pătrățele care se prăbușesc',
  ] },
  { versiune: '2026-11-13b', data: '13 noiembrie', titlu: 'Nivel nou: Furtuna de nisip de pe Marte', lucruri: [
    '🌪️ Furtuna de nisip de pe Marte: vânt care te împinge pe pod, vârtej de praf care te ridică, pietre care se scufundă și un rover',
  ] },
  { versiune: '2026-11-13a', data: '13 noiembrie', titlu: 'Nivel nou: Pianul cosmic', lucruri: [
    '🎹 Pianul cosmic: clape care urcă și coboară ca un val, tobe-trambulină, bagheta dirijorului și un metronom uriaș',
  ] },
  { versiune: '2026-11-12c', data: '12 noiembrie', titlu: 'Nivel nou: Atelierul de rachete', lucruri: [
    '🚀 Atelierul de rachete: bandă care merge înapoi, lift, cârlige de macara, plăci care se desprind și un scanner laser',
  ] },
  { versiune: '2026-11-12b', data: '12 noiembrie', titlu: 'Buguri reparate și cartea cu noutăți', lucruri: [
    '📒 Cartea cu noutăți (asta!)',
    '🐛 Nivelul cu două drumuri: monedele de pe drumul neales dispar',
    '🌬️ Vântul te împinge de-adevăratelea',
    '🎁 Cufărul se deschide din 3 atingeri, cu crăpături și raze de lumină',
    '⚙️ Setări pe secțiuni și niveluri pe pagini',
    '🕹️ Joystick și buton SARI mai frumoase',
    '🌀 Teleportarea: 300 de monede, o dată la 10 secunde · 🕊️ Zborul: 800',
    '👽 Sunet de extratereștri la intrare și muzică nouă în meniu',
  ] },
  { versiune: '2026-11-12a', data: '11–12 noiembrie', titlu: 'Niveluri noi în fiecare zi', lucruri: [
    '🍭 Fabrica de bomboane', '🪩 Discoteca spațială', '📚 Biblioteca plutitoare',
    '🎡 Parcul de distracții', '🍄 Pădurea de ciuperci luminoase',
  ] },
  { versiune: '2026-11-11b', data: '11 noiembrie', titlu: 'Transformări și extratereștri', lucruri: [
    '🎁 16 efecte noi în cufere', '🎨 Accesorii care își schimbă culoarea',
    '🐼 5 animale noi – și te poți transforma în ele!', '🌀 Puterea Teleportare',
    '👽 Nivelul „Fuga de extraterestru”', '🔍 Zoom cu două degete',
  ] },
  { versiune: '2026-11-11a', data: '11 noiembrie', titlu: 'Constructorul de niveluri', lucruri: [
    '🛠️ Construiește-ți propriile niveluri', '🎀 31 de accesorii noi', '👕 Maieu, geacă, blugi, rochie',
    '🏀 Minge de baschet', '👨‍💻 Modul developer',
  ] },
  { versiune: '2026-11-10', data: '10 noiembrie', titlu: 'Multe idei de la Mihai', lucruri: [
    '🧲 Pereții magnetici', '🌀 Cele 10 portale', '🗺️ 5 niveluri noi și 3 niveluri secrete',
    '👑 Costumul de aur, „Bogatul anului” și pisica Kiwi', '🔥 Seria zilnică și titluri', '🌍 5 limbi',
  ] },
  { versiune: '2026-11-09', data: '9 noiembrie', titlu: 'Prima versiune', lucruri: [
    '🚀 5 niveluri, monede, steaguri, magazin, cățeluș', '📲 Se instalează pe telefon și merge fără internet',
  ] },
];

const container = document.getElementById('meniu')!;

/** Cartea completă (din butonul 📒) */
export function arataNoutati(laIesire: () => void) {
  container.innerHTML = `
    <h2>📒 ${t('Noutăți')}</h2>
    <div class="lista-noutati">${NOUTATI.map((n) => `
      <div class="noutate"><div class="antet-noutate"><b>${n.titlu}</b><span>${n.data}</span></div>
      <ul>${n.lucruri.map((l) => `<li>${l}</li>`).join('')}</ul></div>`).join('')}</div>`;
  const b = document.createElement('button');
  b.className = 'mic-buton inapoi';
  b.textContent = '‹ ' + t('Înapoi');
  b.addEventListener('click', () => { sunete.click(); laIesire(); });
  container.append(b);
}

/** La pornire: dacă e o actualizare pe care n-ai văzut-o, îți arată ce e nou */
export function arataNoutatiNoi(p: Progres, laToate: () => void) {
  const ultima = NOUTATI[0];
  if (p.ultimaVersiune === ultima.versiune) return;
  const eraJucator = !!p.ultimaVersiune || Object.keys(p.nivele).length > 0;
  p.ultimaVersiune = ultima.versiune;
  salveaza(p);
  if (!eraJucator) return; // un jucător nou nu are nevoie de noutăți
  const strat = document.createElement('div');
  strat.className = 'strat-cufar';
  strat.innerHTML = `
    <div class="premiu noutati-noi">
      <div class="emoji-premiu">📒</div>
      <div class="categorie-premiu">${t('Ce e nou?')}</div>
      <div class="nume-premiu">${ultima.titlu}</div>
      <ul>${ultima.lucruri.map((l) => `<li>${l}</li>`).join('')}</ul>
      <div class="rand-butoane"><button class="mic-buton toate">${t('Toate noutățile')}</button><button class="mare">${t('Super!')}</button></div>
    </div>`;
  document.body.append(strat);
  strat.querySelector('.mare')!.addEventListener('click', () => strat.remove());
  strat.querySelector('.toate')!.addEventListener('click', () => { strat.remove(); laToate(); });
}
