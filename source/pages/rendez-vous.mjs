/* Rendez-vous et contact : téléphone en premier, demande de rendez-vous simulée en cinq étapes
   (préremplie par l'adresse : ?prestation=…, ?duree=…), récapitulatif en direct, coordonnées. */
import { html, brut } from '../../outils/gabarit.mjs';
import { surtitre, picto, fil, lienTel, euros } from '../gabarits/elements.mjs';
import { messagesZone } from './accueil.mjs';

export const page = { cle: 'rendez-vous', fichier: 'rendez-vous', imagePartage: 'grok/rendez-vous-ouverture-1168.webp' };

export default (c) => {
  const f = (k, v) => c.t('rdv.form.' + k, v);
  const lieux = [['domicile', 'maison'], ['tiers', 'table'], ['distance', 'distance']];
  const etapes = ['e1', 'e2', 'e3', 'e4', 'e5'];
  const nav = (n) => html`<div class="form-nav">
    ${n > 1 ? html`<button type="button" class="bouton bouton--contour" data-precedent>${f('precedent')}</button>` : ''}
    ${n < 5 ? html`<button type="button" class="bouton" data-suivant>${f('suivant')}${picto('fleche')}</button>` : html`<button type="submit" class="bouton">${f('envoyer')}</button>`}
  </div>`;
  return html`
${fil()}
<section class="page-tete" id="debut">
  ${c.media({ nom: 'grok/rendez-vous-ouverture', alt: c.s('rdv.tete.alt'), cadrage: '65% 60%', cadrageMobile: '55% 72%', priorite: true, classe: 'tete-media', sizes: '100vw' })}
  <div class="tete-degrade" aria-hidden="true"></div>
  <div class="tete-texte conteneur">
    ${surtitre('secteur', c.s('rdv.tete.surtitre'))}
    <h1 class="tete-titre"><span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${c.t('rdv.tete.titre')}</span></span></h1>
    <p class="tete-actions" data-anime="gsap">
      ${lienTel(c, { classe: 'bouton', texte: c.s('rdv.tete.appeler'), attrs: 'data-action-principale data-magnetique' })}
      <a class="bouton bouton--contour" href="#demande">${c.t('rdv.tete.formulaire')}</a>
    </p>
    <p class="tete-info" data-info-cle data-anime="gsap">${c.t('rdv.tete.info')}</p>
    <p class="tete-intro" data-anime="gsap">${c.t('rdv.tete.texte')}<br><a class="lien-fil lien-fort" href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
  </div>
</section>

<section class="demande" id="demande">
  <div class="conteneur">
    ${surtitre('usb', c.s('rdv.form.surtitre'))}
    <h2 data-anime>${f('titre')}</h2>
    <p class="demande-deroule" data-anime>${f('deroule')}</p>
    <div class="demande-grille">
      <form class="formulaire etapes-formulaire" data-formulaire data-etapes action="#demande" novalidate ${brut(messagesZone(c))} data-erreur-commune="${c.s('rdv.form.erreurCommune')}" data-erreur-prestation="${c.s('rdv.form.erreurPrestation')}" data-modele-estimation="${c.s('rdv.form.estimation')}" data-vide="${c.s('rdv.form.recapVide')}">
        <ol class="progression" aria-hidden="true">${etapes.map((e, i) => html`<li data-progression="${i + 1}"${i === 0 ? brut(' class="courante"') : ''}><span class="progression-barre"></span><span class="progression-libelle">${f(e)}</span></li>`)}</ol>
        <p class="etape-courante" data-etape-courante data-modele="${c.s('rdv.form.etape')}" aria-live="polite">${f('etape', { n: 1 })}</p>
        <p class="simule">${f('simule')}</p>
        <input type="hidden" name="duree" value="" data-champ-duree>
        <div class="etapes-cadre" data-etapes-cadre>
        <fieldset class="etape-form courante" data-etape-form="1">
          <legend>${f('e1')}</legend>
          <div class="choix-lieu">${lieux.map(([k, ic]) => html`<label class="carte-choix"><input type="radio" name="lieu" value="${k}"${k === 'domicile' ? brut(' checked') : ''}><span class="carte-choix-corps">${picto(ic)}<strong>${f(k)}</strong><small>${f(k + 'Aide')}</small></span></label>`)}</div>
          ${nav(1)}
        </fieldset>
        <fieldset class="etape-form" data-etape-form="2">
          <legend>${f('e2')}</legend>
          <div class="champ"><label for="f-prestation">${f('prestation')}</label>
            <select id="f-prestation" name="prestation" required>
              <option value="" selected>${f('choisir')}</option>
              ${['informatique', 'administratif'].map((fam) => html`<optgroup label="${c.s('commun.familles.' + fam)}">${c.donnees.prestations.filter((p) => p.famille === fam).map((p) => html`<option value="${p.id}">${p.titre}</option>`)}</optgroup>`)}
              <option value="autre">${f('autre')}</option>
            </select></div>
          ${nav(2)}
        </fieldset>
        <fieldset class="etape-form" data-etape-form="3">
          <legend>${f('e3')}</legend>
          <div class="champ"><label for="f-commune">${f('commune')}</label>
            <input id="f-commune" name="commune" list="liste-communes-rdv" autocomplete="address-level2" aria-describedby="f-commune-aide" data-commune>
            <p class="champ-aide" id="f-commune-aide">${f('communeAide')}</p>
            <p class="zone-resultat" data-zone-resultat role="status"></p></div>
          <datalist id="liste-communes-rdv">${c.donnees.communes.map((x) => html`<option value="${x.n}" data-km="${x.d}"></option>`)}</datalist>
          ${nav(3)}
        </fieldset>
        <fieldset class="etape-form" data-etape-form="4">
          <legend>${f('e4')}</legend>
          <fieldset class="sous-groupe"><legend>${f('jours')}</legend>
            <div class="cases">${c.donnees.services.jours.map((j) => html`<label class="case"><input type="checkbox" name="jours" value="${j}"><span>${j}</span></label>`)}</div>
          </fieldset>
          <fieldset class="sous-groupe"><legend>${f('moments')}</legend>
            <div class="cases"><label class="case"><input type="checkbox" name="moments" value="matin"><span>${f('matin')}</span></label><label class="case"><input type="checkbox" name="moments" value="apres-midi"><span>${f('apresmidi')}</span></label></div>
          </fieldset>
          <p class="champ-aide">${f('rappel')}</p>
          ${nav(4)}
        </fieldset>
        <fieldset class="etape-form" data-etape-form="5">
          <legend>${f('e5')}</legend>
          <div class="champs-duo">
            <div class="champ"><label for="f-prenom">${f('prenom')}</label><input id="f-prenom" name="prenom" autocomplete="given-name" required></div>
            <div class="champ"><label for="f-nom">${f('nom')}</label><input id="f-nom" name="nom" autocomplete="family-name" required></div>
          </div>
          <div class="champs-duo">
            <div class="champ"><label for="f-tel">${f('tel')}</label><input id="f-tel" name="tel" type="tel" autocomplete="tel" inputmode="tel" required></div>
            <div class="champ"><label for="f-email">${f('email')}</label><input id="f-email" name="email" type="email" autocomplete="email"></div>
          </div>
          <div class="champ"><label for="f-message">${f('message')}</label><textarea id="f-message" name="message" rows="4"></textarea></div>
          <p class="mention-donnees">${c.tb('rdv.form.donnees')}</p>
          ${nav(5)}
          <p data-message-envoi data-texte="${c.s('rdv.form.envoye')}" role="status" tabindex="-1" hidden></p>
        </fieldset>
        </div>
      </form>
      <aside class="recap" aria-labelledby="recap-titre" data-recap>
        ${c.media({ nom: 'grok/rendez-vous-porte', alt: c.s('rdv.coord.alt'), cadrage: '50% 45%', classe: 'recap-media', sizes: '(max-width: 900px) 100vw, 30vw' })}
        <h3 id="recap-titre">${f('recap')}</h3>
        <dl>
          <div><dt>${f('recapOu')}</dt><dd data-recap-lieu>${f('domicile')}</dd></div>
          <div><dt>${f('recapSouci')}</dt><dd data-recap-prestation class="vide">${f('recapVide')}</dd></div>
          <div><dt>${f('recapCommune')}</dt><dd data-recap-commune class="vide">${f('recapVide')}</dd></div>
          <div><dt>${f('recapDispo')}</dt><dd data-recap-dispo class="vide">${f('recapVide')}</dd></div>
          <div data-recap-estimation-ligne hidden><dt>${f('recapEstimation')}</dt><dd data-recap-estimation data-prix></dd></div>
        </dl>
        <p class="recap-tel">${lienTel(c, { classe: 'lien-fil lien-fort' })}</p>
      </aside>
    </div>
  </div>
</section>

<section class="coordonnees" id="coordonnees">
  <div class="conteneur coordonnees-grille">
    <div class="fiche-visuel coordonnees-visuel" data-visuel>
      <svg viewBox="-30 -30 60 60" role="img" aria-label="${c.s('apropos.fiche.visuel')}" focusable="false">
        <circle class="zone-cercle" r="25" pathLength="1"/>
        ${c.donnees.communes.filter((x) => x.d > 0 && x.d <= 25).map((x) => html`<circle class="zone-point dedans" cx="${x.x}" cy="${x.y}" r="0.6" style="--d:${(x.d / 34).toFixed(2)}"/>`)}
        <circle class="zone-centre" r="1.6"/>
      </svg>
      <p>${c.lien('accueil', { ancre: 'zone', classe: 'lien-fil lien-fort', texte: html`${c.t('apropos.fiche.carte')}${picto('fleche')}` })}</p>
    </div>
    <div>
      ${surtitre('rj45', c.s('rdv.coord.surtitre'))}
      <h2 data-anime>${c.t('rdv.coord.titre')}</h2>
      <dl class="fiche-liste">
        <div><dt>${c.t('rdv.coord.telephone')}</dt><dd><a class="lien-fil lien-fort" href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></dd></div>
        <div><dt>${c.t('rdv.coord.email')}</dt><dd><a class="lien-fil" href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></dd></div>
        <div><dt>${c.t('rdv.coord.zone')}</dt><dd>${c.t('commun.zone')}</dd></div>
        <div><dt>${c.t('rdv.coord.reseaux')}</dt><dd class="reseaux">${c.site.reseaux.map((r) => html`<a class="lien-fil" href="${r.url}" target="_blank" rel="noopener">${r.nom}${picto('externe', 'picto picto--petit')}<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span></a>`)}</dd></div>
      </dl>
    </div>
  </div>
</section>
`;
};
