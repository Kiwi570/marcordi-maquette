/* Éléments dessinés communs à toutes les pages de marcordi : logo, connecteurs du fil, pictogrammes.
   Tout est en SVG en ligne (aucune image à charger), décoratif (aria-hidden) sauf le logo. */
import { readFileSync } from 'node:fs';
import { html, brut } from '../../outils/gabarit.mjs';

const logo = JSON.parse(readFileSync(new URL('./logo-donnees.json', import.meta.url), 'utf8'));
export const logoDonnees = logo;
const vb = (b) => b.map((v) => v.toFixed(1)).join(' ');

/* Mot-symbole « marcordi » : « marc » en gris, « ordi » en encre (logo du client redessiné en vectoriel). */
export function logoMot(classe = 'logo-mot', titre = 'marcordi') {
  return brut(`<svg class="${classe}" viewBox="${vb(logo.vbMot)}" role="img" aria-label="${titre}"><path class="logo-marc" d="${logo.marc.d}"/><path class="logo-ordi" d="${logo.ordi.d}"/></svg>`);
}

/* Scène de l'intro : « marc » et « ordi » séparés, le câble, la prise, l'étincelle et la ligne « Aidant Numérique ».
   Les positions sont en unités du logo (ligne de base à 0) ; site.js les anime. */
export function logoIntro() {
  const [mx, my, mw, mh] = logo.vbMot;
  /* Même repère pour les deux dessins : le mot-symbole (qui file ensuite dans l'en-tête) et la ligne « Aidant Numérique »
     (qui part avec le panneau). Marge de 150 unités de chaque côté pour écarter les mots, 70 en dessous pour le câble. */
  const vbi = [mx - 150, my - 16, mw + 300, mh + 92].map((v) => v.toFixed(1)).join(' ');
  const attrs = `data-marc-fin="${logo.marc.avance}" data-ordi-debut="${logo.ordi.bbox[0]}" data-mot="${logo.vbMot.join(' ')}" data-vb="${vbi}"`;
  return brut(`<svg class="intro-svg" viewBox="${vbi}" ${attrs} aria-hidden="true" focusable="false">
<path class="intro-cable" d="" fill="none"/>
<g class="intro-marc"><path d="${logo.marc.d}"/></g>
<g class="intro-ordi"><path d="${logo.ordi.d}"/></g>
<g class="intro-prise"><rect x="-12" y="-7" width="13" height="14" rx="3"/><path d="M1 -3.4h6M1 3.4h6" fill="none"/></g>
<g class="intro-etincelle" data-ephemere><path d="M0 -12v-9M9 -9l6 -6M-9 -9l-6 -6M12 0h8M-12 0h-8" fill="none"/></g>
</svg><svg class="intro-tag-svg" viewBox="${vbi}" aria-hidden="true" focusable="false"><g class="intro-tag"><path d="${logo.tagD}"/></g></svg>`);
}

/* Connecteurs : le fil vient s'y brancher depuis la gauche (bord gauche du dessin, à mi-hauteur). */
const formes = {
  secteur: '<rect x="14" y="3" width="22" height="18" rx="5"/><circle cx="22" cy="12" r="1.8"/><circle cx="29" cy="12" r="1.8"/><path d="M2 12h12"/>',
  usb: '<rect x="14" y="6" width="24" height="12" rx="6"/><rect x="19" y="10" width="14" height="4" rx="2"/><path d="M2 12h12"/>',
  hdmi: '<path d="M14 6h24v8l-4 4H18l-4-4z"/><path d="M19 10h14"/><path d="M2 12h12"/>',
  rj45: '<rect x="14" y="4" width="22" height="16" rx="2"/><path d="M21 20v-4h8v4M19 8h12"/><path d="M2 12h12"/>',
  jack: '<rect x="14" y="8" width="16" height="8" rx="4"/><path d="M30 12h8M35 9v6"/><path d="M2 12h12"/>',
  chargeur: '<rect x="14" y="5" width="18" height="14" rx="4"/><path d="M32 9h6M32 15h6M21 8l-3 5h5l-3 5"/><path d="M2 12h12"/>',
};
export function prise(type = 'secteur') {
  return brut(`<span class="prise" data-prise="${type}" aria-hidden="true"><svg viewBox="0 0 44 24" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${formes[type] || formes.secteur}</g><circle class="prise-voyant" cx="41" cy="12" r="2.2"/></svg></span>`);
}

/* Surtitre avec son connecteur : point d'accroche du fil pour la section. */
export const surtitre = (type, texte) => html`<p class="surtitre">${prise(type)}<span>${texte}</span></p>`;

/* Pictogrammes d'interface (trait, couleur du texte). */
const pictos = {
  tel: '<path d="M6.6 3h3l1.6 4.2-2 1.4a11 11 0 0 0 5.2 5.2l1.4-2 4.2 1.6v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.2 2 2 0 0 1 6.6 3z"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  fleche: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  coche: '<path d="m5 12.5 4.2 4.2L19 7"/>',
  maison: '<path d="M4 11.5 12 5l8 6.5V20H4z"/><path d="M10 20v-5h4v5"/>',
  distance: '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/><path class="onde" d="M20.5 8.5a6 6 0 0 1 0 7"/><path class="onde" d="M3.5 8.5a6 6 0 0 0 0 7"/>',
  table: '<path d="M3 10h18M6 10v9M18 10v9"/><circle cx="8" cy="6" r="1.8"/><circle cx="16" cy="6" r="1.8"/>',
  repere: '<path d="M12 21s-6.5-6.2-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  horloge: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  externe: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
};
export function picto(nom, classe = 'picto') {
  return brut(`<svg class="${classe}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${pictos[nom] || ''}</g></svg>`);
}

/* Fil du site : tracé calculé par site.js d'après la position des connecteurs de la page. */
export const fil = () => brut('<svg class="fil" data-fil aria-hidden="true" focusable="false" data-audit-ignorer><path class="fil-fond" d=""/><path class="fil-trace" d=""/><circle class="fil-tete" r="5" cx="-20" cy="-20"/></svg>');

/* Lien d'appel : le numéro en clair, lisible et cliquable. */
export function lienTel(c, { classe = 'bouton', texte, attrs = '' } = {}) {
  return html`<a class="${classe}" href="tel:${c.site.contact.telephoneLien}"${brut(attrs ? ' ' + attrs : '')}>${picto('tel')}<span>${texte ?? c.site.contact.telephone}</span></a>`;
}

/* Prix au format français : 30 €, 62,50 €. */
export const euros = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',')) + ' €';
