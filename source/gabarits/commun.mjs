/* Gabarit commun : head, en-tête, menu, pied de page, barre fixe du téléphone, voile, intro.
   Les conventions data-* sont celles que lisent le socle JavaScript et l'audit (voir le README). */
import { html, brut } from '../../outils/gabarit.mjs';
import { logoMot, logoIntro, picto, lienTel } from './elements.mjs';

const navigation = (c) => c.site.navigation.filter((cle) => c.pages[cle] && (c.pages[cle].langues || c.langues).includes(c.l));

function tete(c) {
  const p = c.page, cle = p.cle;
  const titre = c.s(`pages.${cle}.titre`), description = c.s(`pages.${cle}.description`);
  const ici = c.abs(c.url(cle));
  const imagePartage = c.abs(`/assets/partage/${p.partage === false ? 'accueil' : cle}-${c.l}.jpg`);
  const autres = c.alternatives(cle);
  const structure = c.donnees.structure ? JSON.stringify(c.donnees.structure).replace(/</g, '\\u003c') : '';
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titre}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${ici}">
${autres.length > 1 ? autres.map((a) => html`<link rel="alternate" hreflang="${a.l}" href="${c.abs(a.url)}">\n`) : ''}${autres.length > 1 ? html`<link rel="alternate" hreflang="x-default" href="${c.abs(c.alternatives(cle)[0].url)}">` : ''}
<style>${brut(c.critique.css)}</style>
<script>${brut(c.critique.js)}</script>
${(c.site.polices || []).map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>\n`)}<link rel="stylesheet" href="${c.asset('css/socle.css')}">
<link rel="stylesheet" href="${c.asset('css/site.css')}">
<link rel="modulepreload" href="${c.asset('js/site.js')}">
<link rel="modulepreload" href="${c.asset('js/socle/index.js')}">
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script type="module" src="${c.asset('js/site.js')}"></script>
<meta name="theme-color" content="${c.site.couleurs.theme || c.site.couleurs.fond}">
<link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${c.site.nom}">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${ici}">
<meta property="og:image" content="${imagePartage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${c.s(`pages.${p.partage === false ? 'accueil' : cle}.partageAlt`)}">
<meta name="twitter:card" content="summary_large_image">
${structure ? html`<script type="application/ld+json">${brut(structure)}</script>` : ''}
</head>`;
}

function entete(c) {
  return html`<header data-entete>
  <div class="entete-rangee">
    <a class="entete-logo" href="${c.url('accueil')}" aria-label="${c.s('commun.logoAccueil')}" data-libelle="${c.libelle('accueil')}"${c.page.cle === 'accueil' ? brut(' aria-current="page"') : ''}>
      ${logoMot('logo-mot', c.s('commun.logoAccueil'))}
    </a>
    <nav data-nav aria-label="${c.s('commun.navigation')}">
      <ul>${navigation(c).filter((k) => k !== 'accueil').map((k) => html`<li>${c.lien(k)}</li>`)}</ul>
    </nav>
    <div class="entete-actions">
      <a class="bouton bouton--appel" href="tel:${c.site.contact.telephoneLien}" data-magnetique>${picto('tel')}<span class="appel-court">${c.t('commun.appeler')}</span><span class="appel-long">${c.site.contact.telephone}</span></a>
      <button type="button" data-menu-bouton aria-controls="menu" aria-expanded="false" data-libelle-ouvrir="${c.s('commun.menu')}" data-libelle-fermer="${c.s('commun.fermer')}"><span data-libelle-bouton>${c.t('commun.menu')}</span></button>
    </div>
  </div>
</header>
<div id="menu" data-menu role="dialog" aria-modal="true" aria-label="${c.s('commun.menu')}">
  <div class="menu-grille">
    <ul>${navigation(c).map((k, i) => html`<li style="--i:${i}">${c.lien(k, { classe: 'menu-lien' })}</li>`)}</ul>
    <div class="menu-contact">
      <p class="menu-titre">${c.t('commun.menuContact')}</p>
      <p>${lienTel(c, { classe: 'bouton' })}</p>
      <p><a class="lien-fil" href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
      <p>${c.t('commun.zone')}</p>
      <p><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></p>
    </div>
  </div>
</div>`;
}

function pied(c) {
  return html`<footer class="pied" id="pied">
  <div class="conteneur pied-grille">
    <div class="pied-marque">
      <a class="pied-logo" href="${c.url('accueil')}" data-libelle="${c.libelle('accueil')}"><img src="/assets/images/logo.svg" alt="${c.s('commun.logoAccueil')}" width="395" height="112"></a>
      <p>${c.t('commun.piedTexte')}</p>
    </div>
    <div>
      <p class="pied-titre">${c.t('commun.contact')}</p>
      <ul>
        <li>${lienTel(c, { classe: 'lien-fil' })}</li>
        <li><a class="lien-fil" href="mailto:${c.site.contact.email}">${picto('mail')}<span>${c.site.contact.email}</span></a></li>
        <li class="pied-ligne">${picto('repere')}<span>${c.site.contact.adresse}, ${c.t('commun.zoneCourt')}</span></li>
      </ul>
    </div>
    <nav aria-label="${c.s('commun.sommaire')}">
      <p class="pied-titre">${c.t('commun.sommaire')}</p>
      <ul>${navigation(c).map((k) => html`<li>${c.lien(k, { classe: 'lien-fil' })}</li>`)}<li>${c.lien('mentions-legales', { classe: 'lien-fil' })}</li></ul>
    </nav>
    <div>
      <p class="pied-titre">${c.t('commun.suivre')}</p>
      <ul>${c.site.reseaux.map((r) => html`<li><a class="lien-fil" href="${r.url}" target="_blank" rel="noopener">${r.nom}${picto('externe', 'picto picto--petit')}<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span></a></li>`)}</ul>
      <p class="pied-titre pied-titre--second">${c.t('commun.confort')}</p>
      <ul>
        <li><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></li>
        <li><a class="lien-fil" href="#haut" data-sans-transition>${c.t('commun.retourHaut')}</a></li>
      </ul>
    </div>
  </div>
  <div class="conteneur pied-bas"><p>${c.t('commun.maquette')}</p><p>© ${c.site.nom} · SIRET ${c.site.contact.siret}</p></div>
</footer>`;
}

function barre(c) {
  const a = c.site.actionEntete;
  return html`<div data-barre-fixe>
  ${lienTel(c, { classe: 'bouton', texte: c.s('commun.appeler') })}
  ${a ? html`<a class="bouton bouton--contour" href="${c.url(a.page, a.ancre || '')}" data-libelle="${c.libelle(a.page)}">${c.t('commun.actionEntete')}</a>` : ''}
</div>`;
}

function voile(c) {
  return html`<div data-voile aria-hidden="true"><div class="voile-contenu">
  <svg class="voile-cable" viewBox="0 0 400 40" preserveAspectRatio="none" focusable="false"><path d="M0 20 C 90 20 110 34 170 34 S 250 20 300 20 H 400"/></svg>
  <img src="/assets/images/logo-clair.svg" alt="" width="395" height="112"><span data-voile-libelle>${c.libelle(c.page.cle)}</span></div></div>`;
}

export function page(c, contenu) {
  return html`<!doctype html>
<html lang="${c.l}" data-v="${c.v}" data-gabarit="${c.page.gabarit || c.page.cle}" data-page="${c.page.cle}"${c.site.curseur ? brut(' data-curseur') : ''}>
${tete(c)}
<body id="haut">
${voile(c)}
<div class="ouverture-panneau" data-ouverture data-gouttiere="${c.site.couleurs.ouverture}" aria-hidden="true">
  <div class="intro-fond"></div>
  <div class="intro-scene">${logoIntro()}</div>
</div>
<a class="evitement" href="#contenu">${c.t('commun.evitement')}</a>
${entete(c)}
<main id="contenu" tabindex="-1"${c.page.sansAction ? brut(' data-sans-action') : ''}>
${contenu}
</main>
${pied(c)}
${barre(c)}
</body>
</html>`;
}
