// Meniurile jocului: principal, alegerea nivelului și pauza.
// Sunt construite din cod, în elementul #meniu.
import type { Progres } from '../joc/Salvare';
import { NR_NIVELE_NORMALE, ORDINE_NORMALA, SECRETE, numarAfisat, secretDeschis } from '../nivele';
import type { DefinitieNivel } from '../nivele/tipuri';
import { formatTimp } from './Hud';
import { sunete } from '../audio/Sunete';
import { esteInstalat, instaleaza } from '../pwa/Instalare';
import { esteEveniment, textEveniment } from '../joc/Eveniment';
import { cautaTitlu } from '../joc/Titluri';
import { t } from '../i18n';

export interface ActiuniMeniu {
  joacaNivel(index: number): void;
  continua(): void;
  reincepe(): void;
  personalizeaza(): void;
  comutaSunet(): boolean;
  clasament(): void;
  /** Deschide setările; „inapoi” e ecranul la care revii după */
  setari(inapoi: () => void): void;
  titluri(inapoi: () => void): void;
  construieste(): void;
  developer(): void;
  noutati(): void;
  esteNivelPropriu(): boolean;
  inapoiLaConstructor(): void;
}

const container = document.getElementById('meniu')!;

/** Creează un buton cu text și acțiune */
function buton(text: string, clasa: string, apasare: () => void, dezactivat = false) {
  const b = document.createElement('button');
  b.className = clasa;
  b.innerHTML = text;
  b.disabled = dezactivat;
  b.addEventListener('click', () => { sunete.click(); apasare(); });
  return b;
}

function stele(n: number) {
  return [1, 2, 3].map((i) => `<span class="${i <= n ? 'plina' : ''}">★</span>`).join('');
}

export class Meniu {
  /** Pagina deschisă la „Alege nivelul” */
  private paginaNivele = 0;

  constructor(private nivele: DefinitieNivel[], private actiuni: ActiuniMeniu) {}

  ascunde() { container.innerHTML = ''; }

  arataPrincipal(p: Progres) {
    container.innerHTML = `
      <h1><span class="titlu-mic">Mihai:</span><span>${t('Misiunea Stelară')}</span></h1>
      ${cautaTitlu(p.titluAles) ? `<div class="titlu-meniu">${cautaTitlu(p.titluAles)!.emoji} ${p.nume} – ${t(cautaTitlu(p.titluAles)!.nume)}</div>` : ''}
      <div class="rand-butoane">
        <div class="portofel"><span class="moneda-mica"></span>${p.portofel}</div>
        <div class="eveniment ${esteEveniment() ? 'activ' : ''}">${textEveniment()}</div>
      </div>`;
    // ușa secretă: 5 atingeri la rând pe „Mihai:” deschid modul developer
    let atingeri = 0, ultima = 0;
    container.querySelector('.titlu-mic')!.addEventListener('click', () => {
      const acum = performance.now();
      atingeri = acum - ultima < 800 ? atingeri + 1 : 1;
      ultima = acum;
      if (atingeri >= 5) { atingeri = 0; this.actiuni.developer(); }
    });
    const coloana = document.createElement('div');
    coloana.className = 'coloana-butoane';
    // „Joacă” pornește primul nivel neterminat (sau ultimul, dacă le-ai terminat pe toate)
    const urmator = ORDINE_NORMALA[Math.min(p.deblocate, NR_NIVELE_NORMALE) - 1];
    coloana.append(
      buton(t('JOACĂ'), 'mare', () => this.actiuni.joacaNivel(urmator)),
    );
    // sub JOACĂ: trei butoane pe un rând
    const rand = document.createElement('div');
    rand.className = 'rand-butoane';
    rand.append(
      buton(t('Alege nivelul'), 'mic-buton', () => this.arataNivele(p)),
      buton(t('Personalizează'), 'mic-buton', () => this.actiuni.personalizeaza()),
      buton('🏆 ' + t('Clasament'), 'mic-buton', () => this.actiuni.clasament()),
      buton('🛠️ ' + t('Construiește'), 'mic-buton', () => this.actiuni.construieste()),
    );
    coloana.append(rand);
    container.append(coloana);
    // butonul de instalare (doar dacă nu e deja instalat ca aplicație)
    if (!esteInstalat()) {
      container.append(buton('📲 ' + t('Instalează pe telefon'), 'mic-buton buton-instalare', async () => {
        if (!(await instaleaza())) this.arataInstructiuni(p);
      }));
    }
    // butonul de sunet, în colțul din dreapta-sus
    const sunet = buton(p.sunet ? '🔊' : '🔇', 'buton-sunet', () => {
      sunet.textContent = this.actiuni.comutaSunet() ? '🔊' : '🔇';
    });
    sunet.setAttribute('aria-label', t('Sunet'));
    const setari = buton('⚙️', 'buton-sunet buton-setari', () => this.actiuni.setari(() => this.arataPrincipal(p)));
    setari.setAttribute('aria-label', t('Setări'));
    const titluri = buton('🏅', 'buton-sunet buton-titluri', () => this.actiuni.titluri(() => this.arataPrincipal(p)));
    titluri.setAttribute('aria-label', t('Titluri'));
    const carte = buton('📒', 'buton-sunet buton-noutati', () => this.actiuni.noutati());
    carte.setAttribute('aria-label', t('Noutăți'));
    container.append(sunet, setari, titluri, carte);
  }

  arataNivele(p: Progres) {
    container.innerHTML = `<h2>${t('Alege nivelul')}</h2>`;
    container.append(buton('‹ ' + t('Înapoi'), 'mic-buton inapoi', () => this.arataPrincipal(p)));
    // paginile: câte 10 niveluri, plus una cu nivelurile secrete
    const nrPagini = Math.ceil(ORDINE_NORMALA.length / 10);
    const pagini = Array.from({ length: nrPagini }, (_, k) => `${k * 10 + 1}–${Math.min(ORDINE_NORMALA.length, (k + 1) * 10)}`).concat(['🔐 ' + t('Secrete')]);
    const taburi = document.createElement('div');
    taburi.className = 'taburi taburi-nivele';
    pagini.forEach((eticheta, k) => {
      const b = buton(eticheta, k === this.paginaNivele ? 'activ' : '', () => { this.paginaNivele = k; this.arataNivele(p); });
      taburi.append(b);
    });
    container.append(taburi);
    const rand = document.createElement('div');
    rand.className = 'rand-nivele';
    // întâi nivelurile normale, în ordinea de joc, apoi cele secrete
    const toate = [...ORDINE_NORMALA, ...SECRETE.map((x) => x.index)];
    toate.forEach((i, loc) => {
      const pagina = loc < ORDINE_NORMALA.length ? Math.floor(loc / 10) : nrPagini;
      if (pagina !== this.paginaNivele) return;
      const n = this.nivele[i];
      const grupa = SECRETE.find((x) => x.index === i);
      const esteSecret = !!grupa;
      const deschis = esteSecret ? secretDeschis(p, i) : loc < p.deblocate;
      const rez = p.nivele[i];
      const card = document.createElement('button');
      card.className = 'card-nivel' + (deschis ? '' : ' blocat') + (esteSecret ? (i === SECRETE[1].index ? ' secret aur' : i === SECRETE[2].index ? ' secret portal' : ' secret') : '');
      card.disabled = !deschis;
      if (deschis) {
        card.innerHTML = `<span class="nr">${numarAfisat(i)}</span><span class="nume">${t(n.nume)}</span>
           <span class="stele">${stele(rez?.stele ?? 0)}</span>
           <span class="timp">${rez ? t('Record') + ': ' + formatTimp(rez.timp) : ''}</span>`;
        card.addEventListener('click', () => this.actiuni.joacaNivel(i));
      } else if (grupa && grupa.realizare) {
        // nivelul secret cu portale: fără stele, doar indiciul
        card.innerHTML = `<span class="nr">?</span><span class="nume">${t('Nivel secret')}</span><span class="lacat">🔐</span>
           <span class="timp">${t('Termină „Cele 10 portale” fără nicio greșeală!')}</span>`;
      } else if (grupa) {
        // nivelul secret: doar semne de întrebare și câte stele ai găsit din grupa lui
        const gasite = grupa.nivele.filter((x) => p.secrete.includes(x)).length;
        card.innerHTML = `<span class="nr">?</span><span class="nume">${t('Nivel secret')}</span>
           <span class="stele-secrete">${'★'.repeat(gasite)}<span class="goale">${'★'.repeat(grupa.nivele.length - gasite)}</span></span>
           <span class="timp">${i === SECRETE[0].index ? t('Găsește stelele mov! (nivelurile 1–5)') : t('Găsește stelele de aur! (nivelurile 6–9)')}</span>`;
      } else {
        card.innerHTML = `<span class="nr">${numarAfisat(i)}</span><span class="nume">${t(n.nume)}</span><span class="lacat">🔒</span><span class="timp"></span>`;
      }
      rand.append(card);
    });
    container.append(rand);
  }

  /** Pașii de instalare, pentru părinte (când Chrome nu oferă butonul direct) */
  arataInstructiuni(p: Progres) {
    container.innerHTML = `
      <h2>${t('Instalează pe telefon')}</h2>
      <ol class="pasi">
        <li>${t('Apasă pe <b>cele 3 puncte ⋮</b> din dreapta-sus în Chrome.')}</li>
        <li>${t('Alege <b>„Instalează aplicația”</b> sau <b>„Adaugă pe ecranul de pornire”</b>.')}</li>
        <li>${t('Apasă <b>„Instalează”</b>.')}</li>
        <li>${t('Iconița cu Mihai apare pe ecran. De acum jocul merge și <b>fără internet</b>!')}</li>
      </ol>`;
    container.append(buton('‹ ' + t('Înapoi'), 'mic-buton inapoi', () => this.arataPrincipal(p)));
  }

  arataPauza(p: Progres) {
    container.innerHTML = `<h2>${t('Pauză')}</h2>`;
    const coloana = document.createElement('div');
    coloana.className = 'coloana-butoane';
    coloana.append(
      buton(t('Continuă'), 'mare', () => this.actiuni.continua()),
      buton(t('Începe nivelul din nou'), 'mic-buton', () => this.actiuni.reincepe()),
      buton('⚙️ ' + t('Setări'), 'mic-buton', () => this.actiuni.setari(() => this.arataPauza(p))),
      ...(this.actiuni.esteNivelPropriu() ? [buton('🛠️ ' + t('Înapoi la constructor'), 'mic-buton', () => this.actiuni.inapoiLaConstructor())] : []),
      buton(t('Meniul principal'), 'mic-buton', () => this.arataPrincipal(p)),
    );
    container.append(coloana);
  }
}
