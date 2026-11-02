/* Prestations : la liste réelle du site actuel, filtrable par famille (filtre gardé dans l'adresse),
   chaque fiche reliée au formulaire prérempli ; appareils et démarches ; appel final. */
import { html, brut } from '../../outils/gabarit.mjs';
import { surtitre, picto, fil, lienTel } from '../gabarits/elements.mjs';

export const page = { cle: 'prestations', fichier: 'prestations', imagePartage: 'grok/prestations-ouverture-1168.webp' };

export default (c) => {
  const prestations = c.donnees.prestations;
  const s = c.donnees.services;
  /* Schéma : les appareils et les démarches reliés au même fil, autour de « vous ». */
  const noeuds = [...s.appareils.map((n, i) => ({ n, a: -150 + i * 24, r: 118, type: 'app' })), ...s.organismes.map((n, i) => ({ n, a: 22 + i * 20, r: 118, type: 'org' }))];
  return html`
${fil()}
<section class="page-tete" id="debut">
  ${c.media({ nom: 'grok/prestations-ouverture', alt: c.s('prestations.tete.alt'), cadrage: '72% 60%', cadrageMobile: '45% 72%', priorite: true, classe: 'tete-media', sizes: '100vw' })}
  <div class="tete-degrade" aria-hidden="true"></div>
  <div class="tete-texte conteneur">
    ${surtitre('usb', c.s('prestations.tete.surtitre'))}
    <h1 class="tete-titre"><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${c.t('prestations.tete.titre')}</span></span></h1>
    <p class="tete-actions" data-anime="gsap">
      ${c.lien('rendez-vous', { ancre: 'demande', classe: 'bouton', texte: c.t('commun.devisGratuit'), attrs: 'data-action-principale data-magnetique' })}
      ${lienTel(c, { classe: 'bouton bouton--contour' })}
    </p>
    <p class="tete-info" data-info-cle data-anime="gsap">${c.t('prestations.tete.info')}</p>
    <p class="tete-intro" data-anime="gsap">${c.t('prestations.tete.texte')}</p>
  </div>
</section>

<section class="catalogue" id="liste">
  <div class="conteneur">
    ${surtitre('hdmi', c.s('prestations.liste.surtitre'))}
    <h2 data-anime>${c.t('prestations.liste.titre')}</h2>
    <div class="filtres" role="group" aria-label="${c.s('prestations.liste.filtres')}" data-filtres>
      <button type="button" class="puce" aria-pressed="true" data-filtre="tout">${c.t('prestations.liste.tout')} <span class="puce-compte">${String(prestations.length)}</span></button>
      ${['informatique', 'administratif'].map((f) => html`<button type="button" class="puce" aria-pressed="false" data-filtre="${f}">${c.t('commun.familles.' + f)} <span class="puce-compte">${String(prestations.filter((p) => p.famille === f).length)}</span></button>`)}
    </div>
    <p class="filtres-compte" role="status" data-filtres-compte data-modele="${c.s('prestations.liste.compte')}" data-modele-un="${c.s('prestations.liste.compteUn')}">${c.t('prestations.liste.compte', { n: prestations.length })}</p>
    <div class="catalogue-grille" data-catalogue>
      ${prestations.map((p) => html`<article class="prestation" id="${p.id}" data-famille="${p.famille}" data-incline>
        ${c.media({ nom: p.image, alt: p.alt, cadrage: p.cadrage, classe: 'prestation-media', sizes: '(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 30vw' })}
        <div class="prestation-texte">
          <p class="etiquette">${c.t('commun.familles.' + p.famille)}</p>
          <h3>${p.titre}</h3>
          <p>${p.texte}</p>
          <p class="prestation-action">${c.lien('rendez-vous', { ancre: 'demande', params: `prestation=${p.id}`, classe: 'lien-fil lien-fort', texte: html`${c.t('commun.demanderPrestation')}${picto('fleche')}` })}</p>
        </div>
      </article>`)}
      <article class="prestation prestation--appel" data-tuile-appel>
        <h3>${c.t('prestations.liste.tuileTitre')}</h3>
        <p>${c.t('prestations.liste.tuileTexte')}</p>
        <p>${lienTel(c, { classe: 'bouton bouton--clair', texte: c.s('commun.appelerMarco') })}</p>
      </article>
    </div>
  </div>
</section>

<section class="services" id="appareils">
  <div class="conteneur services-grille">
    <div class="services-texte">
      ${surtitre('rj45', c.s('prestations.services.surtitre'))}
      <h2 data-anime>${c.t('prestations.services.titre')}</h2>
      <p data-anime>${c.t('prestations.services.texte')}</p>
      <h3>${c.t('prestations.services.appareils')}</h3>
      <ul class="pastilles">${s.appareils.map((a) => html`<li>${a}</li>`)}</ul>
      <h3>${c.t('prestations.services.organismes')}</h3>
      <ul class="pastilles pastilles--cuivre">${s.organismes.map((a) => html`<li>${a}</li>`)}</ul>
    </div>
    <div class="services-visuel" data-visuel>
      <svg viewBox="-160 -160 320 320" role="img" aria-label="${c.s('prestations.services.visuel')}" focusable="false">
        <circle class="reseau-orbite" r="118"/>
        ${noeuds.map((x, i) => {
          const a = (x.a * Math.PI) / 180, px = Math.cos(a) * x.r, py = Math.sin(a) * x.r;
          const cx = Math.cos(a) * 40, cy = Math.sin(a) * 40;
          return html`<path class="reseau-lien reseau-lien--${x.type}" pathLength="1" style="--i:${i}" d="${brut(`M0 0 Q${cx.toFixed(1)} ${(cy + 26).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)}`)}"/><circle class="reseau-noeud reseau-noeud--${x.type}" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="7" style="--i:${i}"/>`;
        })}
        <text class="reseau-legende" x="0" y="-136" text-anchor="middle">${c.t('prestations.services.appareils')}</text>
        <text class="reseau-legende reseau-legende--org" x="0" y="150" text-anchor="middle">${c.t('prestations.services.organismes')}</text>
        <circle class="reseau-centre" r="30"/>
        <text class="reseau-vous" y="7" text-anchor="middle">vous</text>
      </svg>
    </div>
  </div>
</section>

<section class="fin sombre" id="fin">
  <div class="conteneur fin-grille">
    <div class="fin-texte">
      ${surtitre('secteur', c.s('prestations.fin.surtitre'))}
      <h2 data-anime>${c.t('prestations.fin.titre')}</h2>
      <p data-anime>${c.t('prestations.fin.texte')}</p>
      <p class="fin-numero" data-anime><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></p>
      <p class="fin-actions" data-anime>
        ${lienTel(c, { classe: 'bouton bouton--clair', texte: c.s('commun.appelerMarco'), attrs: 'data-magnetique data-branchement' })}
        ${c.lien('rendez-vous', { ancre: 'demande', classe: 'bouton bouton--contour', texte: c.t('commun.devisGratuit') })}
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
