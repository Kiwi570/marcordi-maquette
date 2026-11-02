/* Mentions légales et confidentialité : fiche récapitulative à compléter, éditeur, hébergeur, crédits
   (illustrations générées), confidentialité. Barre de lecture et sommaire qui suit la lecture. */
import { html } from '../../outils/gabarit.mjs';
import { fil } from '../gabarits/elements.mjs';

export const page = { cle: 'mentions-legales', fichier: 'mentions-legales', imagePartage: 'grok/mentions-ouverture-1168.webp', sansAction: true };

const sections = ['fiche', 'editeur', 'hebergeur', 'credits', 'confidentialite'];

export default (c) => html`
<div data-barre-lecture aria-hidden="true"></div>
<section class="page-tete page-tete--court" id="debut">
  ${c.media({ nom: 'grok/mentions-ouverture', alt: c.s('mentions.alt'), cadrage: '65% 62%', cadrageMobile: '60% 70%', priorite: true, classe: 'tete-media', sizes: '100vw' })}
  <div class="tete-degrade" aria-hidden="true"></div>
  <div class="tete-texte conteneur">
    <h1 class="tete-titre"><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${c.t('mentions.titre')}</span></span></h1>
    <p class="tete-intro" data-anime="gsap">${c.t('mentions.texte')}</p>
  </div>
</section>
<div class="texte-long conteneur" data-sans-visuel>
  <nav class="sommaire-mentions" data-sommaire aria-label="${c.s('commun.sommaire')}"><ul>${sections.map((s) => html`<li><a href="#${s}" data-sans-transition>${c.t(`mentions.${s}.titre`)}</a></li>`)}</ul></nav>
  <div class="texte-long-corps">
  ${sections.map((s) => html`<section id="${s}" data-sans-visuel class="${s === 'fiche' ? 'fiche-completer' : ''}"><h2>${c.t(`mentions.${s}.titre`)}</h2><p>${c.t(`mentions.${s}.texte`)}</p></section>`)}
  </div>
</div>
`;
