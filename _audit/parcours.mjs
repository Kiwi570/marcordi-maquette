/* Parcours propres à marcordi : estimateur (totaux vérifiés par le calcul), filtres des prestations (gardés dans
   l'adresse), demande de rendez-vous en étapes (préremplissage, erreurs, zone, envoi simulé sans double envoi),
   vérification de commune sur la carte, sélecteur « Quel est votre souci ? ». */
export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  const estimer = (h) => (h < 1 ? 30 : h < 4 ? 25 * h : 20 * h);

  /* Estimateur : le prix affiché égale la grille pour chaque durée, et reste visible pendant qu'on fait glisser. */
  {
    const { ctx, page } = await contexte({ taille: T('390×844') });
    try {
      await page.goto(BASE + '/tarifs#estimateur', { waitUntil: 'load' });
      await attendrePret(page);
      for (const h of [0.5, 1, 2.5, 3.5, 4, 6, 8]) {
        const r = await page.evaluate((h) => {
          const c = document.querySelector('#duree');
          c.value = String(h); c.dispatchEvent(new Event('input', { bubbles: true }));
          const t = document.querySelector('[data-total]'), b = t.getBoundingClientRect();
          return { affiche: parseFloat(t.dataset.total), texte: document.querySelector('[data-total-prix]').textContent, lien: document.querySelector('[data-lien-estimation]').getAttribute('href') };
        }, h);
        if (Math.abs(r.affiche - estimer(h)) > 0.005) R.echec('estimateur', `${h} h : ${r.affiche} € affichés au lieu de ${estimer(h)} €`, { page: '/tarifs', taille: '390×844' });
        else R.ok('estimateur');
        if (!r.lien.includes('duree=' + h)) R.echec('estimateur', `le lien « demander un devis » ne reprend pas la durée (${r.lien})`, { page: '/tarifs' });
      }
      await page.locator('#duree').scrollIntoViewIfNeeded();
      const visible = await page.evaluate(() => { const b = document.querySelector('[data-total]').getBoundingClientRect(); const r = document.querySelector('#duree').getBoundingClientRect(); return b.top < innerHeight && r.top >= 0; });
      if (!visible) R.regarder('estimateur', 'le total n’est pas visible en même temps que le curseur', { page: '/tarifs', taille: '390×844' });
    } finally { await ctx.close(); }
  }

  /* Filtres des prestations : nombre de fiches, adresse partageable, retour à « Tout voir ». */
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      await page.goto(BASE + '/prestations?famille=administratif#liste', { waitUntil: 'load' });
      await attendrePret(page);
      const compter = () => page.evaluate(() => document.querySelectorAll('[data-catalogue] .prestation[data-famille]:not(.masquee)').length);
      let n = await compter();
      if (n !== 5) R.echec('filtres', `?famille=administratif : ${n} fiches au lieu de 5`, { page: '/prestations' }); else R.ok('filtres');
      await page.click('[data-filtre="informatique"]'); await attendre(500);
      n = await compter();
      const url = page.url();
      if (n !== 5 || !url.includes('famille=informatique')) R.echec('filtres', `filtre informatique : ${n} fiches, adresse ${url}`, { page: '/prestations' }); else R.ok('filtres');
      await page.click('[data-filtre="tout"]'); await attendre(500);
      n = await compter();
      if (n !== 10 || page.url().includes('famille=')) R.echec('filtres', `Tout voir : ${n} fiches, adresse ${page.url()}`, { page: '/prestations' }); else R.ok('filtres');
    } finally { await ctx.close(); }
  }

  /* Demande de rendez-vous : préremplie par l'adresse, erreurs à côté du champ, zone vérifiée, envoi simulé une seule fois. */
  {
    const { ctx, page } = await contexte({ taille: T('390×844') });
    try {
      await page.goto(BASE + '/rendez-vous?prestation=cv&duree=2#demande', { waitUntil: 'load' });
      await attendrePret(page);
      const pre = await page.evaluate(() => ({ p: document.querySelector('#f-prestation').value, recap: document.querySelector('[data-recap-prestation]').textContent, est: document.querySelector('[data-recap-estimation]').textContent }));
      if (pre.p !== 'cv') R.echec('rendez-vous', `prestation non préremplie (${pre.p})`, { page: '/rendez-vous' }); else R.ok('rendez-vous');
      if (!/50/.test(pre.est)) R.echec('rendez-vous', `estimation du récapitulatif inattendue (« ${pre.est} » pour 2 h)`, { page: '/rendez-vous' }); else R.ok('rendez-vous');
      const suivant = async () => { await page.locator('.etape-form.courante [data-suivant]').click(); await attendre(450); };
      await suivant(); await suivant();
      await suivant();
      const err = await page.evaluate(() => ({ etape: document.querySelector('.etape-form.courante').dataset.etapeForm, invalide: document.querySelector('#f-commune').getAttribute('aria-invalid'), msg: (document.getElementById('erreur-f-commune') || {}).textContent }));
      if (err.etape !== '3' || err.invalide !== 'true' || !err.msg) R.echec('rendez-vous', `commune vide à domicile : pas d’erreur (${JSON.stringify(err)})`, { page: '/rendez-vous' }); else R.ok('rendez-vous');
      await page.fill('#f-commune', 'richelieu'); await page.locator('#f-commune').dispatchEvent('change'); await attendre(200);
      const zone = await page.textContent('.etape-form.courante [data-zone-resultat]');
      if (!/dans la zone/.test(zone)) R.echec('rendez-vous', `zone de Richelieu : « ${zone} »`, { page: '/rendez-vous' }); else R.ok('rendez-vous');
      await suivant(); await suivant();
      await page.fill('#f-prenom', 'Test'); await page.fill('#f-nom', 'Audit'); await page.fill('#f-tel', '06 00 00 00 00');
      await page.locator('[type="submit"]').dblclick();
      await attendre(400);
      const fin = await page.evaluate(() => ({ msg: !document.querySelector('[data-message-envoi]').hidden, desactive: document.querySelector('[type="submit"]').disabled }));
      if (!fin.msg || !fin.desactive) R.echec('rendez-vous', `envoi simulé : ${JSON.stringify(fin)}`, { page: '/rendez-vous' }); else R.ok('rendez-vous');
    } finally { await ctx.close(); }
  }

  /* Carte de la zone et sélecteur de souci (accueil). */
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      await page.goto(BASE + '/#zone', { waitUntil: 'load' });
      await attendrePret(page);
      for (const [nom, attendu] of [['Chinon', /hors de la zone/], ['chatellerault', /dans la zone/], ['Paris', /introuvable/]]) {
        await page.fill('#zone-commune', nom);
        await page.locator('[data-zone-recherche] button').click(); await attendre(200);
        const t = await page.textContent('[data-zone-recherche] [data-zone-resultat]');
        if (!attendu.test(t)) R.echec('zone', `${nom} : « ${t} »`, { page: '/' }); else R.ok('zone');
      }
      await page.locator('[data-souci="photos"]').click(); await attendre(300);
      const s = await page.evaluate(() => ({ visible: !!document.querySelector('#reponse-photos[data-actif]'), coche: document.querySelector('[data-souci="photos"]').getAttribute('aria-checked') }));
      if (!s.visible || s.coche !== 'true') R.echec('souci', `choix « photos » : ${JSON.stringify(s)}`, { page: '/' }); else R.ok('souci');
    } finally { await ctx.close(); }
  }
}
