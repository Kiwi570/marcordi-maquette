/* Accueil : premier écran, « Quel est votre souci ? », deux familles, trois façons, zone des 25 km,
   tarifs en bref, Marco, étapes (scène épinglée sur ordinateur), questions fréquentes, appel final. */
import { html, brut } from '../../outils/gabarit.mjs';
import { surtitre, picto, fil, lienTel, euros, prise } from '../gabarits/elements.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'grok/accueil-ouverture-1168.webp' };

/* Nœud de câbles : un brin par souci, emmêlé au départ ; site.js le redresse vers la réponse.
   Les deux tracés ont la même structure (M + 2 courbes) pour que l'un se transforme en l'autre. */
function brins(soucis) {
  let graine = 7;
  const alea = () => ((graine = (graine * 16807) % 2147483647) / 2147483647);
  const r = (a, b) => Math.round(a + alea() * (b - a));
  return soucis.map((s, i) => {
    const y0 = 34 + i * 36;
    const emmele = `M0 ${y0} C${r(90, 300)} ${r(20, 300)} ${r(60, 330)} ${r(30, 290)} ${r(170, 250)} ${r(110, 210)} C${r(80, 330)} ${r(10, 310)} ${r(200, 360)} ${r(40, 290)} 400 160`;
    const droit = `M0 ${y0} C110 ${y0} 150 160 230 160 C280 160 340 160 400 160`;
    return { id: s.id, emmele, droit };
  });
}

/* Carte de la zone : les communes en kilomètres autour de Marigny-Marmande (centre 0,0). */
const REPERES = {
  'Marigny-Marmande': ['centre'], Richelieu: ['h'], 'Châtellerault': ['b'], "L'Île-Bouchard": ['g'], Descartes: ['h'],
  'Sainte-Maure-de-Touraine': ['h', 'secondaire'], Chinon: ['h', 'secondaire'], 'Lencloître': ['g', 'secondaire'], 'Dangé-Saint-Romain': ['b', 'secondaire'],
};
/* Messages de la vérification de commune (textes du fichier de langue, espaces insécables compris). */
export const messagesZone = (c) => ['centre', 'dedans', 'dehors', 'inconnue', 'vide'].map((k) => `data-msg-${k}="${c.s('commun.zoneMessages.' + k).replace(/"/g, '&quot;')}"`).join(' ');

export default (c) => {
  const P = Object.fromEntries(c.donnees.prestations.map((p) => [p.id, p]));
  const soucis = c.donnees.soucis;
  const traces = brins(soucis);
  const communes = c.donnees.communes;
  const dedans = communes.filter((x) => x.d <= 25).length;
  const tarifs = c.donnees.tarifs;
  const etapes = [1, 2, 3, 4];
  const famille = (f) => c.donnees.prestations.filter((p) => p.famille === f);
  return html`
${fil()}
<section class="hero" id="debut">
  ${c.media({ nom: 'grok/accueil-ouverture', alt: c.s('accueil.hero.alt'), cadrage: '72% 55%', cadrageMobile: '60% 78%', priorite: true, classe: 'hero-media', sizes: '100vw' })}
  <div class="hero-degrade" aria-hidden="true"></div>
  <div class="hero-texte conteneur">
    ${surtitre('secteur', c.s('accueil.hero.surtitre'))}
    <h1 class="hero-titre">${['ligne1', 'ligne2', 'ligne3'].map((k) => html`<span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('accueil.hero.' + k)}</span></span>`)}</h1>
    <p class="hero-actions" data-anime="gsap">
      ${lienTel(c, { classe: 'bouton', texte: c.s('accueil.hero.appeler'), attrs: 'data-action-principale data-magnetique' })}
      ${c.lien('rendez-vous', { ancre: 'demande', classe: 'bouton bouton--contour', texte: c.t('commun.rendezVous') })}
    </p>
    <p class="hero-info" data-info-cle data-anime="gsap">${picto('repere')}<span>${c.t('accueil.hero.info')}</span></p>
    <p class="hero-intro" data-anime="gsap">${c.t('accueil.hero.texte')}</p>
  </div>
</section>

<section class="souci" id="souci">
  <div class="conteneur souci-grille">
    <div class="souci-tete">
      ${surtitre('usb', c.s('accueil.souci.surtitre'))}
      <h2 data-anime>${c.t('accueil.souci.titre')}</h2>
      <p data-anime>${c.t('accueil.souci.texte')}</p>
      <div class="souci-choix" role="radiogroup" aria-label="${c.s('accueil.souci.groupe')}">
        ${soucis.map((s, i) => html`<button type="button" class="puce" role="radio" aria-checked="${i === 0 ? 'true' : 'false'}" tabindex="${i === 0 ? '0' : '-1'}" data-souci="${s.id}">${s.texte}</button>`)}
      </div>
    </div>
    <div class="souci-noeud" data-visuel>
      <svg viewBox="0 0 400 320" role="img" aria-label="${c.s('accueil.souci.noeud')}" focusable="false">
        ${traces.map((t, i) => html`<path class="brin${i === 0 ? ' actif' : ''}" data-brin="${t.id}" data-emmele="${t.emmele}" data-droit="${t.droit}" d="${brut(i === 0 ? t.droit : t.emmele)}"/>`)}
        <g class="noeud-prise" transform="translate(400 160)"><rect x="-26" y="-14" width="26" height="28" rx="6"/><path d="M0 -6h10M0 6h10"/></g>
      </svg>
    </div>
    <div class="souci-reponses">
      ${soucis.map((s, i) => {
        const p = P[s.prestation];
        return html`<article class="souci-reponse" id="reponse-${s.id}" data-reponse="${s.id}"${i === 0 ? brut(' data-actif') : ''} aria-labelledby="reponse-titre-${s.id}">
        <p class="etiquette">${c.t('commun.familles.' + p.famille)}</p>
        <h3 id="reponse-titre-${s.id}">${p.titre}</h3>
        <p>${p.texte}</p>
        <p class="souci-prix">${c.t('accueil.souci.prix')}</p>
        <p class="souci-actions">
          ${c.lien('rendez-vous', { ancre: 'demande', params: `prestation=${p.id}`, classe: 'bouton', texte: c.t('commun.demanderPrestation') })}
          ${c.lien('prestations', { ancre: p.id, classe: 'lien-fil lien-fort', texte: html`${c.t('commun.voirDetail')}${picto('fleche')}` })}
        </p>
      </article>`;
      })}
    </div>
  </div>
</section>

<section class="familles" id="familles">
  <div class="conteneur">
    ${surtitre('hdmi', c.s('accueil.familles.surtitre'))}
    <h2 data-anime>${c.t('accueil.familles.titre')}</h2>
    <div class="familles-grille">
      <article class="famille">
        <div class="famille-media fele" data-fele>
          ${c.media({ nom: 'grok/accueil-informatique', alt: c.s('accueil.familles.infoAlt'), cadrage: '60% 65%', classe: 'famille-image', sizes: '(max-width: 760px) 100vw, 45vw' })}
          <svg class="fissures" viewBox="0 0 100 125" preserveAspectRatio="none" aria-hidden="true" focusable="false" data-ephemere>
            <path pathLength="1" d="M58 40 L44 22 L40 6"/><path pathLength="1" d="M58 40 L74 30 L96 34"/><path pathLength="1" d="M58 40 L62 62 L54 84 L58 120"/>
            <path pathLength="1" d="M58 40 L36 52 L8 48"/><path pathLength="1" d="M62 62 L82 72 L98 92"/><path pathLength="1" d="M44 22 L26 24"/>
          </svg>
        </div>
        <div class="famille-texte">
          <h3>${c.t('commun.familles.informatique')}</h3>
          <p>${c.t('accueil.familles.infoTexte')}</p>
          <ul class="liste-coches">${famille('informatique').map((p) => html`<li data-anime>${picto('coche', 'coche')}${c.lien('prestations', { ancre: p.id, texte: p.titre, classe: 'lien-fil' })}</li>`)}</ul>
        </div>
      </article>
      <article class="famille">
        <div class="famille-media">
          ${c.media({ nom: 'grok/accueil-demarches', alt: c.s('accueil.familles.adminAlt'), cadrage: '55% 45%', classe: 'famille-image', sizes: '(max-width: 760px) 100vw, 45vw' })}
        </div>
        <div class="famille-texte">
          <h3>${c.t('commun.familles.administratif')}</h3>
          <p>${c.t('accueil.familles.adminTexte')}</p>
          <ul class="liste-coches">${famille('administratif').map((p) => html`<li data-anime>${picto('coche', 'coche')}${c.lien('prestations', { ancre: p.id, texte: p.titre, classe: 'lien-fil' })}</li>`)}</ul>
        </div>
      </article>
    </div>
    <p class="suite">${c.lien('prestations', { classe: 'bouton bouton--contour', texte: html`${c.t('accueil.familles.tout')}${picto('fleche')}` })}</p>
  </div>
</section>

<section class="facons" id="facons">
  <div class="conteneur">
    ${surtitre('rj45', c.s('accueil.facons.surtitre'))}
    <h2 data-anime>${c.t('accueil.facons.titre')}</h2>
    <div class="facons-grille">
      ${[['domicile', 'maison', 'grok/accueil-domicile', '45% 60%'], ['distance', 'distance', 'grok/accueil-distance', '55% 55%'], ['tiers', 'table', 'grok/accueil-tiers-lieu', '50% 55%']].map(([k, ic, img, cad]) => html`
      <article class="facon" data-incline>
        ${c.media({ nom: img, alt: c.s(`accueil.facons.${k}Alt`), cadrage: cad, classe: 'facon-media', sizes: '(max-width: 760px) 100vw, 30vw' })}
        <div class="facon-texte">
          <span class="facon-picto facon-picto--${k}">${picto(ic)}</span>
          <h3>${c.t(`accueil.facons.${k}`)}</h3>
          <p>${c.t(`accueil.facons.${k}Texte`)}</p>
        </div>
      </article>`)}
    </div>
  </div>
</section>

<section class="zone" id="zone">
  <div class="conteneur zone-grille">
    <div class="zone-texte">
      ${surtitre('jack', c.s('accueil.zone.surtitre'))}
      <h2 data-anime>${c.t('accueil.zone.titre')}</h2>
      <p data-anime>${c.t('accueil.zone.texte', { n: dedans })}</p>
      <form class="zone-recherche" data-zone-recherche action="#zone" role="search" ${brut(messagesZone(c))}>
        <label for="zone-commune">${c.t('accueil.zone.label')}</label>
        <div class="zone-champ">
          <input id="zone-commune" name="commune" list="liste-communes" autocomplete="off" placeholder="${c.s('accueil.zone.placeholder')}" enterkeyhint="search">
          <button type="submit" class="bouton">${c.t('accueil.zone.verifier')}</button>
        </div>
        <p class="zone-resultat" data-zone-resultat role="status">${c.t('commun.zoneMessages.vide')}</p>
      </form>
      <datalist id="liste-communes">${communes.map((x) => html`<option value="${x.n}" data-km="${x.d}"></option>`)}</datalist>
      <ul class="zone-legende"><li>${c.t('accueil.zone.legendeDedans')}</li><li class="dehors">${c.t('accueil.zone.legendeDehors')}</li></ul>
      <p class="zone-note">${c.t('accueil.zone.note')}</p>
    </div>
    <div class="zone-carte" data-visuel data-zone-carte>
      <svg viewBox="-34 -34 68 68" role="img" aria-label="${c.s('accueil.zone.carte', { n: dedans })}" focusable="false">
        <circle class="zone-anneau" r="10"/><circle class="zone-anneau" r="20"/>
        <circle class="zone-cercle" r="25" pathLength="1"/>
        <g class="zone-points">${communes.filter((x) => x.d > 0).map((x) => html`<circle class="zone-point${x.d <= 25 ? ' dedans' : ''}" cx="${x.x}" cy="${x.y}" r="${x.p > 3000 ? 0.85 : 0.55}" style="--d:${(x.d / 34).toFixed(2)}" data-commune="${x.n}" data-km="${x.d}"/>`)}</g>
        <line class="zone-ligne" x1="0" y1="0" x2="0" y2="0" data-zone-ligne/>
        <circle class="zone-cible" r="1.4" cx="0" cy="0" data-zone-cible/>
        <circle class="zone-centre" r="1.3"/>
      </svg>
      ${communes.filter((x) => REPERES[x.n]).map((x) => html`<span class="zone-etiquette zone-etiquette--${REPERES[x.n][0]}${REPERES[x.n][1] ? ' ' + REPERES[x.n][1] : ''}${x.d > 25 ? ' dehors' : ''}" style="left:${(((x.x + 34) / 68) * 100).toFixed(2)}%;top:${(((x.y + 34) / 68) * 100).toFixed(2)}%" data-repere>${x.n}${x.d > 0 ? html` <small>${String(Math.round(x.d))} km</small>` : ''}</span>`)}
      <span class="zone-rayon" aria-hidden="true">${c.t('accueil.zone.km')}</span>
    </div>
  </div>
</section>

<section class="tarifs-apercu sombre" id="tarifs">
  <div class="conteneur">
    ${surtitre('chargeur', c.s('accueil.tarifs.surtitre'))}
    <h2 data-anime>${c.t('accueil.tarifs.titre')}</h2>
    <div class="tarifs-apercu-grille">
      <ol class="cables">
        ${tarifs.map((t) => html`<li class="cable-ligne" data-anime style="--l:${t.longueur}">
          <span class="cable" aria-hidden="true"><span class="cable-fil"></span>${prise('secteur')}</span>
          <div class="cable-texte">
            <p class="cable-niveau">${t.niveau} · ${t.duree}</p>
            <p class="cable-prix" data-prix><strong><span data-compteur="${t.prix}">${String(t.prix)}</span>&nbsp;€</strong> <span>${t.unite === 'forfait' ? 'forfait, ' + t.note.toLowerCase() : 'de l’heure'}</span></p>
          </div>
        </li>`)}
      </ol>
      <div class="cachet" data-visuel>
        <p class="cachet-haut">${c.t('accueil.tarifs.cachet')}</p>
        <p class="cachet-bas">${c.t('accueil.tarifs.cachet2')}</p>
      </div>
    </div>
    <p class="tarifs-note">${c.t('accueil.tarifs.note')}</p>
    <p>${c.lien('tarifs', { ancre: 'estimateur', classe: 'bouton bouton--clair', texte: html`${c.t('accueil.tarifs.estimer')}${picto('fleche')}` })}</p>
  </div>
</section>

<section class="marco" id="marco">
  <div class="marco-bandeau">${c.media({ nom: 'grok/accueil-marco-fond', alt: c.s('accueil.marco.fondAlt'), cadrage: '50% 60%', classe: 'marco-fond', sizes: '100vw' })}</div>
  <div class="conteneur marco-grille">
    <div class="marco-portrait" data-superpose>
      <svg class="marco-anneau" viewBox="0 0 120 120" aria-hidden="true" focusable="false"><circle cx="60" cy="60" r="57" pathLength="1"/></svg>
      ${c.media({ nom: 'marco-portrait', alt: c.s('accueil.marco.alt'), cadrage: '50% 40%', classe: 'portrait', sizes: '240px' })}
    </div>
    <div class="marco-texte">
      ${surtitre('secteur', c.s('accueil.marco.surtitre'))}
      <h2 data-anime>${c.t('accueil.marco.titre')}</h2>
      <p data-anime>${c.t('accueil.marco.texte')}</p>
      <p class="badges" data-anime><span class="badge">${c.t('accueil.marco.devis')}</span><span class="badge" lang="en" data-typo-ignorer>${c.t('accueil.marco.anglais')}</span></p>
      <p data-anime>${c.lien('a-propos', { classe: 'bouton bouton--contour', texte: html`${c.t('accueil.marco.lien')}${picto('fleche')}` })}</p>
    </div>
  </div>
</section>

<section class="etapes ecran" id="etapes" data-entete-cache>
  <div class="conteneur etapes-grille">
    ${c.media({ nom: 'grok/accueil-intervention', alt: c.s('accueil.etapes.alt'), cadrage: '40% 45%', classe: 'etapes-media', sizes: '(max-width: 760px) 100vw, 40vw' })}
    <div class="etapes-texte">
      ${surtitre('usb', c.s('accueil.etapes.surtitre'))}
      <h2>${c.t('accueil.etapes.titre')}</h2>
      <ol class="etapes-liste">
        <svg class="etapes-fil" aria-hidden="true" focusable="false" preserveAspectRatio="none" viewBox="0 0 10 100"><path class="etapes-fil-fond" d="M5 0 V100"/><path class="etapes-fil-trace" d="M5 0 V100" pathLength="1"/></svg>
        ${etapes.map((n) => html`<li class="etape" data-etape="${n}"><span class="etape-num" aria-hidden="true">${String(n)}</span><div><h3>${c.t(`accueil.etapes.e${n}`)}</h3><p>${c.t(`accueil.etapes.e${n}t`)}</p></div></li>`)}
      </ol>
    </div>
  </div>
</section>

<section class="faq" id="faq">
  <div class="conteneur faq-grille">
    <div>
      ${surtitre('jack', c.s('accueil.faq.surtitre'))}
      <h2 data-anime>${c.t('accueil.faq.titre')}</h2>
      <div class="faq-liste">
        ${c.donnees.faq.map((f) => html`<details class="faq-item" id="faq-${f.id}"${f.langue ? brut(` lang="${f.langue}"`) : ''}>
          <summary${f.langue ? brut(' data-typo-ignorer') : ''}><span>${f.langue ? brut(f.q) : f.q}</span><span class="faq-plus" aria-hidden="true"></span></summary>
          <div class="faq-reponse"><p${f.langue ? brut(' data-typo-ignorer') : ''}>${f.langue ? brut(f.r) : f.r}</p></div>
        </details>`)}
      </div>
    </div>
    ${c.media({ nom: 'grok/accueil-faq', alt: c.s('accueil.faq.alt'), cadrage: '45% 65%', classe: 'faq-media', sizes: '(max-width: 760px) 100vw, 35vw' })}
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
        <a class="lien-fil" href="mailto:${c.site.contact.email}">${picto('mail')}<span>${c.t('commun.ecrire')}</span></a>
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
