/* Image de partage 1200×630 de chaque page (photo, logo, accroche, polices et couleurs du site).
   outils/images-partage.mjs photographie ces pages et écrit assets/partage/<page>-<langue>.jpg. */
import { html, brut } from '../../outils/gabarit.mjs';

export function page(c) {
  const cle = c.page.cle;
  const image = c.page.imagePartage || c.site.imagePartage;
  return html`<!doctype html>
<html lang="${c.l}"><head><meta charset="utf-8">
<link rel="stylesheet" href="/assets/css/socle.css"><link rel="stylesheet" href="/assets/css/site.css">
<style>${brut(`:root{--fond:${c.site.couleurs.fond};--texte:${c.site.couleurs.texte}}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:var(--fond);color:var(--texte)}
.carte{display:grid;grid-template-columns:600px 600px;width:1200px;height:630px}
.carte-texte{display:flex;flex-direction:column;justify-content:space-between;padding:60px 56px 56px 64px;position:relative}
.carte-texte .logo{width:250px;height:auto}
.carte-titre{font-family:var(--police-titres);font-weight:600;font-size:60px;line-height:1.04;margin:0;text-wrap:balance;letter-spacing:-.01em}
.carte-pied{display:flex;align-items:center;gap:16px;margin:0;font-size:22px;font-weight:700;white-space:nowrap}
.carte-pied span{display:block;width:64px;height:6px;border-radius:3px;background:#C2662F}
.carte-image{background:center/cover no-repeat;position:relative}
.carte-image::after{content:'Illustration générée';position:absolute;right:14px;bottom:14px;padding:4px 10px;border-radius:999px;background:rgba(0,0,0,.66);color:#fff;font:600 15px/1.3 var(--police-texte)}`)}</style>
</head><body>
<div class="carte">
  <div class="carte-texte">
    <img class="logo" src="/assets/images/logo.svg" alt="">
    <p class="carte-titre">${c.t(`pages.${cle}.accroche`)}</p>
    <p class="carte-pied"><span></span>${c.site.contact.telephone} · Marigny-Marmande</p>
  </div>
  <div class="carte-image" style="background-image:url('/assets/images/${image}')"></div>
</div>
</body></html>`;
}
