/* À propos : Marco Hubin, sa démarche (ses propres mots), la fiche en bref avec la zone des 25 km. */
import { html } from '../../outils/gabarit.mjs';
import { surtitre, picto, fil, lienTel } from '../gabarits/elements.mjs';

export const page = { cle: 'a-propos', fichier: 'a-propos', imagePartage: 'grok/a-propos-ouverture-1168.webp' };

export default (c) => {
  const lignes = ['nom', 'lieu', 'zone', 'devis', 'langues', 'statut'];
  const communes = c.donnees.communes.filter((x) => x.d > 0 && x.d <= 25);
  return html`
${fil()}
<section class="page-tete" id="debut">
  ${c.media({ nom: 'grok/a-propos-ouverture', alt: c.s('apropos.tete.alt'), cadrage: '65% 55%', cadrageMobile: '40% 70%', priorite: true, classe: 'tete-media', sizes: '100vw' })}
  <div class="tete-degrade" aria-hidden="true"></div>
  <div class="tete-texte conteneur">
    ${surtitre('secteur', c.s('apropos.tete.surtitre'))}
    <h1 class="tete-titre"><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${c.t('apropos.tete.titre')}</span></span></h1>
    <p class="tete-actions" data-anime="gsap">
      ${lienTel(c, { classe: 'bouton', texte: c.s('apropos.tete.appeler'), attrs: 'data-action-principale data-magnetique' })}
      ${c.lien('rendez-vous', { ancre: 'demande', classe: 'bouton bouton--contour', texte: c.t('commun.rendezVous') })}
    </p>
    <p class="tete-info" data-info-cle data-anime="gsap">${picto('repere')}<span>${c.t('apropos.tete.info')}</span></p>
    <p class="tete-intro" data-anime="gsap">${c.t('apropos.tete.texte')}</p>
  </div>
</section>

<section class="demarche" id="demarche">
  <div class="conteneur demarche-grille">
    <div class="demarche-portrait">
      <div class="marco-portrait">
        <svg class="marco-anneau" viewBox="0 0 120 120" aria-hidden="true" focusable="false"><circle cx="60" cy="60" r="57" pathLength="1"/></svg>
        ${c.media({ nom: 'marco-portrait', alt: c.s('apropos.demarche.alt'), cadrage: '50% 40%', classe: 'portrait', sizes: '280px' })}
      </div>
    </div>
    <div class="demarche-texte">
      ${surtitre('usb', c.s('apropos.demarche.surtitre'))}
      <h2 data-anime>${c.t('apropos.demarche.titre')}</h2>
      <figure class="citation">
        <blockquote><p data-citation>«&nbsp;${c.t('apropos.demarche.citation')}&nbsp;»</p></blockquote>
        <figcaption>${c.t('apropos.demarche.auteur')}</figcaption>
      </figure>
      <p data-anime>${c.t('apropos.demarche.texte')}</p>
      <p data-anime>${c.lien('prestations', { classe: 'lien-fil lien-fort', texte: html`${c.t('pages.prestations.nav')}${picto('fleche')}` })}</p>
    </div>
    ${c.media({ nom: 'grok/a-propos-village', alt: c.s('apropos.demarche.villageAlt'), cadrage: '40% 50%', classe: 'demarche-village', sizes: '(max-width: 760px) 100vw, 30vw' })}
  </div>
</section>

<section class="fiche" id="fiche">
  <div class="conteneur fiche-grille">
    <div>
      ${surtitre('rj45', c.s('apropos.fiche.surtitre'))}
      <h2 data-anime>${c.t('apropos.fiche.titre')}</h2>
      <dl class="fiche-liste">
        ${lignes.map((k) => html`<div data-anime><dt>${c.t('apropos.fiche.' + k)}</dt><dd>${c.t('apropos.fiche.' + k + 'V')}</dd></div>`)}
      </dl>
    </div>
    <div class="fiche-visuel" data-visuel>
      <svg viewBox="-30 -30 60 60" role="img" aria-label="${c.s('apropos.fiche.visuel')}" focusable="false">
        <circle class="zone-cercle" r="25" pathLength="1"/>
        ${communes.map((x) => html`<circle class="zone-point dedans" cx="${x.x}" cy="${x.y}" r="0.6" style="--d:${(x.d / 34).toFixed(2)}"/>`)}
        <circle class="zone-centre" r="1.6"/>
      </svg>
      <p>${c.lien('accueil', { ancre: 'zone', classe: 'lien-fil lien-fort', texte: html`${c.t('apropos.fiche.carte')}${picto('fleche')}` })}</p>
    </div>
  </div>
</section>

<section class="fin sombre" id="fin">
  <div class="conteneur fin-grille">
    <div class="fin-texte">
      ${surtitre('secteur', c.s('accueil.fin.surtitre'))}
      <h2 data-anime>${c.t('accueil.fin.titre')}</h2>
      <p data-anime>${c.t('accueil.fin.texte')}</p>
      <p class="fin-numero" data-anime><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></p>
      <p class="fin-actions" data-anime>
        ${lienTel(c, { classe: 'bouton bouton--clair', texte: c.s('commun.appelerMarco'), attrs: 'data-magnetique data-branchement' })}
        ${c.lien('rendez-vous', { ancre: 'demande', classe: 'bouton bouton--contour', texte: c.t('commun.rendezVous') })}
      </p>
    </div>
    <div class="fin-visuel" data-visuel aria-hidden="true">
      <svg viewBox="0 0 320 320" focusable="false">
        <rect class="fin-socle" x="196" y="110" width="92" height="100" rx="18"/><circle class="fin-trou" cx="230" cy="148" r="6"/><circle class="fin-trou" cx="254" cy="148" r="6"/><circle class="fin-voyant" cx="242" cy="186" r="5"/>
        <path class="fin-cable" pathLength="1" d="M-10 290 C 60 290 40 160 120 160 L150 160"/>
        <g class="fin-prise"><rect x="150" y="142" width="40" height="36" rx="8"/><path d="M190 152h14M190 168h14"/></g>
      </svg>
    </div>
  </div>
</section>
`;
};
