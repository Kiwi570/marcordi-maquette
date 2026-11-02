# marcordi : maquette du site

Maquette du futur site de **marcordi**, aidant numérique à Marigny-Marmande (37), direction artistique « Le fil » :
papier crème, encre et fil de cuivre ; un câble relie « marc » à « ordi » dans l'intro, puis court le long de chaque page
et se branche sur chaque section.

Adresse prévue : https://marcordi-maquette.vercel.app (maquette non indexée par les moteurs de recherche).

## Pages

| Page | Contenu |
|---|---|
| Accueil `/` | Premier écran, « Quel est votre souci ? », deux familles de services, trois façons d'intervenir, carte des 25 km avec vérification de commune, tarifs en bref, Marco, quatre étapes, questions fréquentes, appel final |
| Prestations `/prestations` | Les 10 prestations, filtrables par famille (`?famille=informatique`), appareils et démarches, appel final |
| Tarifs `/tarifs` | Grille des 3 niveaux, estimateur « tirez le câble », devis gratuit |
| À propos `/a-propos` | Marco Hubin, sa démarche (ses propres mots), fiche en bref |
| Rendez-vous `/rendez-vous` | Téléphone, demande de rendez-vous simulée en 5 étapes, coordonnées |
| Mentions légales `/mentions-legales` | Fiche à compléter, éditeur, hébergeur, crédits, confidentialité |
| 404 | « Cette page s'est débranchée. » |

Liens profonds : `/rendez-vous?prestation=cv#demande` préremplit le formulaire ; `/rendez-vous?duree=2#demande` reprend l'estimation ;
`/prestations#recuperation` ouvre une fiche.

## Travailler sur la maquette

Le projet part du socle commun des maquettes (voir `socle` dans la skill) :

- textes : `donnees/textes/fr.json` ; données : `donnees/*.json` (prestations, soucis, tarifs, questions, communes, services) ;
- pages : `source/pages/*.mjs`, gabarits : `source/gabarits/` ; style : `assets/css/site.css` ; effets : `assets/js/site.js` ;
- générer les pages : `node outils/generer.mjs`, puis les images de partage : `node outils/images-partage.mjs` ;
- auditer : `node _audit/audit.mjs` (rapport dans `_audit/rapport/rapport.md`) ;
- images reçues : `python3 outils/images.py recu/lot.json` ; logo vectoriel : `python3 outils/logo.py <figtree-300.woff> <figtree-400.woff>`.

Ne jamais modifier à la main les pages générées (`index.html`, `prestations.html`…).

## Choix et points à faire valider par Marco

- **Logo** redessiné en vectoriel d'après le JPG du site actuel, avec la police Figtree (licence OFL), proche de l'original
  (Marianne, police de la marque de l'État, à ne pas réutiliser). Le fichier source du logo est bienvenu.
- **Prix** : la grille de la page Tarifs du site actuel sert de référence (30 € forfait express de moins d'1 h déplacement
  compris, 25 €/h de 1 h à 4 h, 20 €/h à partir de 4 h). La réservation en ligne actuelle annonce 1 h à 25 €, sur place comme à
  distance : écart à trancher. À 4 h exactement, l'estimateur retient le niveau 3. Déplacement pour les niveaux 2 et 3 : à confirmer.
- **Crédit d'impôt « services à la personne »** : non affiché (rien sur le site actuel). Si marcordi est déclaré, l'assistance
  informatique à domicile peut y ouvrir droit : à vérifier avec Marco avant toute mention.
- **Bouton de don PayPal** : retiré de la maquette.
- **Adresse** : seule la commune est affichée (fiche INSEE non diffusible).
- **Zone** : 102 communes à moins de 25 km à vol d'oiseau du centre de Marigny-Marmande (données geo.api.gouv.fr) ;
  Chinon (28 km) et Loudun (29 km) sont juste en dehors. À confirmer pour les communes en limite.
- **Portrait** : 400 px seulement ; un portrait plus grand serait un vrai plus.
- **Réseaux sociaux** : Instagram, Facebook et LinkedIn repris du site actuel ; à confirmer qu'ils sont toujours utilisés.
- **Chiffres** : la police du texte (Atkinson Hyperlegible) a un zéro barré ; les chiffres sont affichés en Figtree pour que le numéro de téléphone se lise sans hésiter.
- **Images Grok** à refaire si possible : `404-ouverture.jpg` et `tarifs-ouverture.jpg` montrent une prise américaine.

## Audit

`node _audit/audit.mjs` (environ 20 min ici). Deux ajustements du script pour ce projet :
- un lien e-mail ou un compte de réseau social au nom de marcordi n'est plus compté comme « lien vers le site actuel »
  (seuls les liens web vers le domaine marcordi.fr le sont) ;
- le bouton Menu est actionné directement dans le parcours du mode calme (l'en-tête caché en descendant le rendait inaccessible au clic simulé).
Parcours propres au projet : `_audit/parcours.mjs` (estimateur, filtres, rendez-vous, zone, souci).

## À la mise en ligne définitive

À retirer :
- la consigne `noindex` : balise robots dans `source/gabarits/commun.mjs` et en-tête `X-Robots-Tag` dans `vercel.json` ;
- le caractère simulé du formulaire de rendez-vous (le brancher sur un vrai envoi) et la mention « Maquette » ;
- toutes les mentions « à compléter » (paiement, tiers-lieux, adresse, directeur de la publication, politique de confidentialité) ;
- l'adresse `marcordi-maquette.vercel.app` dans `donnees/site.json` et `donnees/structure.json` (remplacer par le vrai domaine).

À garder :
- la mention « Illustration générée » sur toutes les images créées par IA, et la phrase correspondante dans les crédits.
