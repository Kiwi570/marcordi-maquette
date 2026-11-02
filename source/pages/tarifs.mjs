/* Tarifs : la grille du site actuel (référence choisie), l'estimateur « tirez le câble », le devis gratuit. */
import { html } from '../../outils/gabarit.mjs';
import { surtitre, picto, fil, lienTel, prise, euros } from '../gabarits/elements.mjs';

export const page = { cle: 'tarifs', fichier: 'tarifs', imagePartage: 'grok/tarifs-ouverture-1168.webp' };

/* Règle de calcul, identique à celle de site.js : moins d'1 h → forfait ; de 1 h à moins de 4 h → 25 €/h ; 4 h et plus → 20 €/h. */
export const estimer = (h) => (h < 1 ? { niveau: 0, prix: 30 } : h < 4 ? { niveau: 1, prix: 25 * h } : { niveau: 2, prix: 20 * h });
const duree = (h) => { const e = Math.floor(h), m = Math.round((h - e) * 60); return e ? `${e} h${m ? ' ' + String(m).padStart(2, '0') : ''}` : `${m} min`; };

export default (c) => {
  const T = c.donnees.tarifs;
  const depart = 1.5, est = estimer(depart);
  return html`
${fil()}
<section class="page-tete" id="debut">
  ${c.media({ nom: 'grok/tarifs-ouverture', alt: c.s('tarifs.tete.alt'), cadrage: '72% 55%', cadrageMobile: '45% 65%', priorite: true, classe: 'tete-media', sizes: '100vw' })}
  <div class="tete-degrade" aria-hidden="true"></div>
  <div class="tete-texte conteneur">
    ${surtitre('chargeur', c.s('tarifs.tete.surtitre'))}
    <h1 class="tete-titre"><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${c.t('tarifs.tete.titre')}</span></span></h1>
    <p class="tete-actions" data-anime="gsap">
      <a class="bouton" href="#estimateur" data-action-principale data-magnetique>${c.t('tarifs.tete.estimer')}</a>
      ${c.lien('rendez-vous', { ancre: 'demande', classe: 'bouton bouton--contour', texte: c.t('commun.devisGratuit') })}
    </p>
    <p class="tete-info" data-info-cle data-prix data-anime="gsap">${c.t('tarifs.tete.info')}</p>
    <p class="tete-intro" data-anime="gsap">${c.t('tarifs.tete.texte')}</p>
  </div>
</section>

<section class="grille-tarifs" id="grille">
  <div class="conteneur">
    ${surtitre('secteur', c.s('tarifs.grille.surtitre'))}
    <h2 data-anime>${c.t('tarifs.grille.titre')}</h2>
    <ol class="niveaux" data-visuel>
      ${T.map((t, i) => html`<li class="niveau" data-anime style="--l:${t.longueur}">
        <p class="niveau-nom">${t.niveau}${t.id === 'express' ? ' · ' + t.nom : ''}</p>
        <p class="niveau-duree">${picto('horloge')}<span>${t.duree}</span></p>
        <p class="niveau-prix" data-prix><strong>${String(t.prix)}&nbsp;€</strong> <span>${t.unite}</span></p>
        <p class="niveau-note">${t.note}</p>
        <span class="niveau-cable" aria-hidden="true"><span class="cable-fil"></span>${prise(['usb', 'secteur', 'rj45'][i])}</span>
      </li>`)}
    </ol>
  </div>
</section>

<section class="estimateur sombre" id="estimateur">
  <div class="conteneur estimateur-grille">
    <div class="estimateur-texte">
      ${surtitre('jack', c.s('tarifs.estimateur.surtitre'))}
      <h2 data-anime>${c.t('tarifs.estimateur.titre')}</h2>
      <p data-anime>${c.t('tarifs.estimateur.texte')}</p>
    </div>
    <div class="estimateur-outil" data-estimateur data-tarifs="${JSON.stringify(T.map((t) => ({ niveau: t.niveau, prix: t.prix })))}" data-forfait="${c.s('tarifs.estimateur.forfait')}">
      <label class="estimateur-label" for="duree">${c.t('tarifs.estimateur.duree')}&nbsp;: <output for="duree" data-duree>${duree(depart)}</output></label>
      <div class="curseur-cable" data-visuel>
        <span class="curseur-cable-fond" aria-hidden="true"></span>
        <span class="curseur-cable-fil" aria-hidden="true" data-cable-fil></span>
        <input type="range" id="duree" name="duree" min="0.5" max="8" step="0.5" value="${String(depart)}" aria-valuetext="${duree(depart)}">
      </div>
      <p class="estimateur-pas"><button type="button" data-pas="-0.5" aria-label="${c.s('tarifs.estimateur.moins')}">− 30 min</button><button type="button" data-pas="0.5" aria-label="${c.s('tarifs.estimateur.plus')}">+ 30 min</button></p>
      <p class="curseur-graduations" aria-hidden="true"><span>30 min</span><span>1 h</span><span>4 h</span><span>8 h</span></p>
      <div class="estimateur-total" data-total="${est.prix}" aria-live="polite">
        <p class="estimateur-total-label">${c.t('tarifs.estimateur.total')}</p>
        <p class="estimateur-prix" data-prix><span data-total-prix>${euros(est.prix)}</span></p>
        <p class="estimateur-detail" data-total-detail>${T[est.niveau].niveau} · ${duree(depart)} × ${euros(T[est.niveau].prix)}</p>
      </div>
      <p class="estimateur-note">${c.t('tarifs.estimateur.note')}</p>
      <p class="estimateur-note">${c.t('tarifs.estimateur.deplacement')}</p>
      <p>${c.lien('rendez-vous', { ancre: 'demande', params: `duree=${depart}`, classe: 'bouton bouton--clair', texte: c.t('tarifs.estimateur.demander'), attrs: 'data-lien-estimation' })}</p>
    </div>
  </div>
</section>

<section class="devis" id="devis">
  <div class="conteneur devis-grille">
    ${c.media({ nom: 'grok/tarifs-devis', alt: c.s('tarifs.devis.alt'), cadrage: '45% 55%', classe: 'devis-media', sizes: '(max-width: 760px) 100vw, 40vw' })}
    <div>
      ${surtitre('usb', c.s('tarifs.devis.surtitre'))}
      <h2 data-anime>${c.t('tarifs.devis.titre')}</h2>
      <p data-anime>${c.t('tarifs.devis.texte')}</p>
      <p class="a-completer" data-anime>${c.t('tarifs.devis.paiement')}</p>
      <p class="devis-actions" data-anime>
        ${c.lien('rendez-vous', { ancre: 'demande', classe: 'bouton', texte: c.t('commun.devisGratuit') })}
        ${lienTel(c, { classe: 'bouton bouton--contour' })}
      </p>
    </div>
  </div>
</section>
`;
};
