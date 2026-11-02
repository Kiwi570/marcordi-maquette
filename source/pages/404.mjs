/* Page 404 : « Cette page s'est débranchée. » Le câble de l'image se balance (une fois), bouton « Rebrancher ». */
import { html } from '../../outils/gabarit.mjs';
import { surtitre, lienTel } from '../gabarits/elements.mjs';

export const page = { cle: '404', fichier: '404', partage: false };

export default (c) => html`
<section class="page-tete introuvable" id="debut">
  ${c.media({ nom: 'grok/404-ouverture', alt: c.s('introuvable.alt'), cadrage: '68% 60%', cadrageMobile: '30% 75%', priorite: true, classe: 'tete-media', sizes: '100vw' })}
  <div class="tete-degrade" aria-hidden="true"></div>
  <div class="tete-texte conteneur">
    ${surtitre('secteur', c.s('introuvable.surtitre'))}
    <h1 class="tete-titre"><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${c.t('introuvable.titre')}</span></span></h1>
    <p class="tete-actions" data-anime="gsap">
      ${c.lien('accueil', { classe: 'bouton', texte: c.t('introuvable.retour'), attrs: 'data-action-principale data-magnetique' })}
      ${lienTel(c, { classe: 'bouton bouton--contour' })}
    </p>
    <p class="tete-info" data-info-cle data-anime="gsap">${c.t('introuvable.texte')}</p>
  </div>
</section>
`;
