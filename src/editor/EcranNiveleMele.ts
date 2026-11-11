// Ecranul „Nivelurile mele”: lista nivelurilor construite, cu Editează / Joacă / Șterge.
import { t } from '../i18n';
import { sunete } from '../audio/Sunete';
import { incarcaNiveleMele, salveazaNiveleMele, nivelNou, areFinal, inDefinitie, MAX_NIVELE, type NivelPropriu } from './NiveleMele';
import type { DefinitieNivel } from '../nivele/tipuri';

const container = document.getElementById('meniu')!;

export interface ActiuniNiveleMele {
  editeaza(n: NivelPropriu): void;
  joaca(def: DefinitieNivel, n: NivelPropriu): void;
  inapoi(): void;
}

function text(s: string) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

export function arataNiveleMele(a: ActiuniNiveleMele) {
  const lista = incarcaNiveleMele();
  container.innerHTML = `
    <h2>🛠️ ${t('Nivelurile mele')}</h2>
    <p class="sfat">${t('Construiește-ți propriile niveluri! Ele rămân doar pe telefonul tău.')}</p>
    <div class="lista-nivele-mele"></div>`;
  const el = container.querySelector('.lista-nivele-mele')!;
  for (const n of lista) {
    const card = document.createElement('div');
    card.className = 'card-nivel-meu';
    card.innerHTML = `<b>${text(n.nume)}</b><span>${n.obiecte.length} ${t('obiecte')}</span>`;
    const butoane = document.createElement('div');
    butoane.className = 'rand-butoane';
    const b = (eticheta: string, f: () => void, dezactivat = false) => {
      const x = document.createElement('button');
      x.className = 'mic-buton'; x.innerHTML = eticheta; x.disabled = dezactivat;
      x.addEventListener('click', () => { sunete.click(); f(); });
      butoane.append(x);
    };
    b('✏️', () => a.editeaza(n));
    b('▶', () => a.joaca(inDefinitie(n), n), !areFinal(n));
    b('🗑️', () => {
      if (!confirm(t('Ștergi nivelul „{nume}”?', { nume: n.nume }))) return;
      salveazaNiveleMele(incarcaNiveleMele().filter((x) => x.id !== n.id));
      arataNiveleMele(a);
    });
    card.append(butoane);
    el.append(card);
  }
  if (lista.length < MAX_NIVELE) {
    const nou = document.createElement('button');
    nou.className = 'card-nivel-meu nou';
    nou.innerHTML = `<span class="plus">＋</span>${t('Nivel nou')}`;
    nou.addEventListener('click', () => {
      sunete.click();
      const n = nivelNou(lista.length + 1);
      salveazaNiveleMele([...incarcaNiveleMele(), n]);
      a.editeaza(n);
    });
    el.append(nou);
  }
  const inapoi = document.createElement('button');
  inapoi.className = 'mic-buton inapoi';
  inapoi.textContent = '‹ ' + t('Înapoi');
  inapoi.addEventListener('click', () => { sunete.click(); a.inapoi(); });
  container.append(inapoi);
}

/** Salvează (sau înlocuiește) un nivel în listă */
export function salveazaNivelMeu(n: NivelPropriu) {
  const lista = incarcaNiveleMele();
  const i = lista.findIndex((x) => x.id === n.id);
  if (i >= 0) lista[i] = n; else lista.push(n);
  salveazaNiveleMele(lista);
}
