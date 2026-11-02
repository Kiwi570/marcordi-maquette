/* Effets propres à marcordi (direction « Le fil »). Le socle gère l'ouverture, les transitions, l'en-tête,
   le menu, le mode calme, les boucles, les mesures et les formulaires : ce fichier ne contient que ce qui est
   propre au client. Aucune lecture de mise en page pendant le défilement : tout est mesuré au chargement,
   au redimensionnement et quand la hauteur change (événement socle:rafraichi), puis gardé. */
import { demarrer, etat, rafraichir, quand, aller } from './socle/index.js?v=1';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
if (gsap && window.SplitText) gsap.registerPlugin(window.SplitText);
const doc = document.documentElement;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calme = () => etat.calme;
const souris = matchMedia('(hover: hover) and (pointer: fine)').matches;
const NB = ' ';
const euros = (n) => (Math.abs(n - Math.round(n)) < 0.001 ? String(Math.round(n)) : n.toFixed(2).replace('.', ',')) + NB + '€';
const duree = (h) => { const e = Math.floor(h), m = Math.round((h - e) * 60); return e ? `${e}${NB}h${m ? NB + String(m).padStart(2, '0') : ''}` : `${m}${NB}min`; };
const normaliser = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’'`\-]/g, ' ').replace(/\bst(e?)\b/g, 'saint$1').replace(/\s+/g, ' ').trim();
const remplir = (modele, vars) => modele.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
/* Apparition unique quand l'élément entre à l'écran (classe ajoutée, jamais retirée). */
function quandVisible(el, fn, seuil = 0.3) {
  if (!el) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.disconnect(); fn(); } }), { threshold: seuil });
  io.observe(el);
}

/* ------------------------------------------------------------------ Intro : « marc » + câble + « ordi » */
const intro = { pret: false };
function preparerIntro() {
  const svg = $('.intro-svg');
  if (!svg) return;
  const marcFin = parseFloat(svg.dataset.marcFin), ordiDebut = parseFloat(svg.dataset.ordiDebut);
  Object.assign(intro, {
    svg, tagSvg: $('.intro-tag-svg'), fond: $('.intro-fond'), marc: $('.intro-marc'), ordi: $('.intro-ordi'),
    cable: $('.intro-cable'), prise: $('.intro-prise'), etincelle: $('.intro-etincelle'), tag: $('.intro-tag'),
    marcFin, ordiDebut, mot: svg.dataset.mot.split(' ').map(Number), vb: svg.dataset.vb.split(' ').map(Number), pret: true,
  });
}

/* Le câble part du « c » de « marc » et finit dans la prise ; sa courbe pend selon la distance. */
function dessinerCable(s) {
  const A = { x: intro.marcFin - 1 + s.tm, y: -25 };
  const ang = (s.rot * Math.PI) / 180;
  const queue = { x: s.px - 12 * Math.cos(ang), y: s.py - 12 * Math.sin(ang) };
  const d = Math.hypot(queue.x - A.x, queue.y - A.y);
  const pend = Math.min(48, 10 + d * 0.22) * s.mou;
  intro.cable.setAttribute('d', `M${A.x.toFixed(1)} ${A.y.toFixed(1)} C${(A.x + 18).toFixed(1)} ${(A.y + pend).toFixed(1)} ${(queue.x - 18 * Math.cos(ang) - 6).toFixed(1)} ${(queue.y + pend * 0.9 - 18 * Math.sin(ang)).toFixed(1)} ${queue.x.toFixed(1)} ${queue.y.toFixed(1)}`);
  intro.prise.setAttribute('transform', `translate(${s.px.toFixed(1)} ${s.py.toFixed(1)}) rotate(${s.rot.toFixed(1)})`);
}

function timelineIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (!intro.pret) return tl;
  const E = 112;
  const depart = { x: intro.marcFin - E + 10, y: 26 };
  const arrivee = { x: intro.ordiDebut + E - 2, y: -25 };
  const s = { tm: -E, to: E, u: 0, px: depart.x, py: depart.y, rot: 90, mou: 1 };
  const maj = () => {
    const u = s.u;
    /* La prise suit un arc au-dessus du trajet, du point de départ (pendante) à l'entrée du « o ». */
    const cx = (depart.x + arrivee.x) / 2, cy = Math.min(depart.y, arrivee.y) - 46;
    const bx = (1 - u) * (1 - u) * depart.x + 2 * (1 - u) * u * cx + u * u * arrivee.x;
    const by = (1 - u) * (1 - u) * depart.y + 2 * (1 - u) * u * cy + u * u * arrivee.y;
    s.px = bx + (s.to - E); s.py = by;
    dessinerCable(s);
  };
  intro.marc.style.transform = `translateX(${-E}px)`;
  intro.ordi.style.transform = `translateX(${E}px)`;
  maj();
  /* 0,1 s → 0,62 s : la prise file vers « ordi » en se redressant. */
  tl.to(s, { u: 1, rot: 0, duration: 0.52, ease: 'power2.inOut', onUpdate: maj }, 0.1)
    /* 0,62 s : clic, la prise s'enfiche ; une étincelle douce (une seule) ; « ordi » s'allume. */
    .to(s, { to: E + 5, duration: 0.1, ease: 'power2.in', onUpdate: maj }, 0.62)
    .fromTo(intro.etincelle, { opacity: 0, scale: 0.6, x: arrivee.x + 4, y: arrivee.y, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1.25, duration: 0.12, ease: 'power2.out' }, 0.7)
    .to(intro.etincelle, { opacity: 0, scale: 1.6, duration: 0.25, ease: 'power1.out' }, 0.82)
    .fromTo('.intro-ordi path', { fill: '#C7C0B4' }, { fill: '#1D2125', duration: 0.25, ease: 'none' }, 0.7)
    /* 0,78 s → 1,2 s : les deux mots se rejoignent en « marcordi », le câble se rétracte. */
    .to(s, { tm: 0, to: 5, mou: 0.15, duration: 0.38, ease: 'power3.inOut', onUpdate: () => { intro.marc.style.transform = `translateX(${s.tm}px)`; intro.ordi.style.transform = `translateX(${s.to - 5}px)`; maj(); } }, 0.74)
    .to([intro.cable, intro.prise], { opacity: 0, duration: 0.14, ease: 'none' }, 0.96)
    /* 1 s → 1,3 s : « Aidant Numérique » s'écrit dessous. */
    .fromTo(intro.tag, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.3, ease: 'power2.out' }, 1.0);
  /* 1,3 s → 1,8 s : le logo file dans l'en-tête ; le panneau se retire vers le haut. */
  const cible = $('.entete-logo .logo-mot');
  const r = intro.svg.getBoundingClientRect();
  if (cible && r.width) {
    const h = cible.getBoundingClientRect();
    const k = r.width / intro.vb[2];
    const L = r.left + (intro.mot[0] - intro.vb[0]) * k, T = r.top + (intro.mot[1] - intro.vb[1]) * k, W = intro.mot[2] * k;
    const sc = h.width / W;
    tl.to(intro.svg, { x: h.left - r.left - (L - r.left) * sc, y: h.top - r.top - (T - r.top) * sc, scale: sc, transformOrigin: '0 0', duration: 0.5, ease: 'power3.inOut' }, 1.3);
  }
  tl.to(intro.fond, { yPercent: -100, duration: 0.5, ease: 'power3.inOut' }, 1.32)
    .to(intro.tagSvg, { y: () => -window.innerHeight, duration: 0.5, ease: 'power3.inOut' }, 1.32);
  arriveePremierEcran(tl, 1.3);
  return tl;
}

/* ------------------------------------------------------------------ Premier écran (accueil et pages intérieures) */
const PE = { lignes: '.hero-ligne, .tete-ligne', media: '.hero-media, .tete-media', suite: '.hero-actions, .tete-actions, .hero-info, .tete-info, .hero-intro, .tete-intro' };
function arriveePremierEcran(tl, t0 = 0) {
  if (!gsap) return;
  if ($(PE.media)) tl.fromTo(PE.media, { clipPath: 'inset(49.5% 0% 49.5% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'power4.inOut' }, t0);
  if ($(PE.lignes)) tl.fromTo(PE.lignes, { yPercent: 108, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.75, stagger: 0.09 }, t0 + 0.12);
  const suite = $$(PE.suite);
  if (suite.length) tl.fromTo(suite, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.05 }, t0 + 0.28);
}
function etatFinalPremierEcran() {
  if (!gsap) return;
  gsap.set(PE.lignes + ', ' + PE.suite, { clearProps: 'transform,opacity' });
  $$(PE.media).forEach((m) => { m.style.clipPath = 'inset(0% 0% 0% 0%)'; });
}

/* Parallaxe douce de la photo d'ouverture : l'image est agrandie de plus que son déplacement. */
function parallaxeOuverture() {
  if (!gsap || !ST || calme()) return;
  $$('.hero-media img, .tete-media img').forEach((img) => {
    const sec = img.closest('section');
    gsap.fromTo(img, { yPercent: 0, scale: 1.1 }, { yPercent: 7, scale: 1.1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: true } });
  });
}

/* ------------------------------------------------------------------ Le fil : un câble de cuivre qui se branche sur chaque section */
/* Le tracé est calculé ici (aucune mesure de longueur par le navigateur, coûteuse sur téléphone) :
   un seul trait qui descend dans la marge, entre dans chaque connecteur et en ressort par le même chemin.
   pathLength reçoit la longueur calculée, pour que le pointillé suive exactement nos unités. */
function lefil() {
  const svg = $('[data-fil]');
  if (!svg) return;
  const main = $('main');
  const trace = $('.fil-trace', svg), tete = $('.fil-tete', svg), fond = $('.fil-fond', svg);
  let ech = [], total = 0, haut = 0, branches = [], raf = 0, depart = calme() ? 1 : 0, mesure = 0;
  const prises = () => $$('main .surtitre .prise').filter((p) => !p.closest('.etapes') && p.offsetParent !== null);
  const bez = (p0, p1, p2, p3, t) => { const u = 1 - t; return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3; };

  function mesurer() {
    const mr = main.getBoundingClientRect();
    haut = mr.top + window.scrollY;
    const cont = $('main .conteneur');
    const gauche = cont ? cont.getBoundingClientRect().left - mr.left : 24;
    const mx = Math.max(7, Math.round(gauche / 2));
    const pts = prises().map((p) => { const r = p.getBoundingClientRect(); return { p, x: r.left - mr.left + 2, y: r.top - mr.top + r.height / 2 }; });
    ech = []; branches = []; total = 0; lefil.max = 0;
    if (!pts.length) { trace.setAttribute('d', ''); return; }
    let y = Math.max(0, pts[0].y - 260), max = -Infinity;
    let d = `M${mx} ${y.toFixed(1)}`;
    const ajouter = (x, yy) => {
      const der = ech[ech.length - 1];
      if (der) total += Math.hypot(x - der.x, yy - der.py);
      max = Math.max(max, yy);
      ech.push({ l: total, y: max, x, py: yy });
    };
    ajouter(mx, y);
    pts.forEach((q) => {
      const j = Math.max(y, q.y - 74);
      for (let yy = y + 12; yy < j; yy += 12) ajouter(mx, yy);
      ajouter(mx, j);
      const c1 = [mx, q.y - 18], c2 = [q.x - 46, q.y];
      d += ` V${j.toFixed(1)} C${c1[0]} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
      for (let k = 1; k <= 16; k++) ajouter(bez(mx, c1[0], c2[0], q.x, k / 16), bez(j, c1[1], c2[1], q.y, k / 16));
      branches.push({ p: q.p, l: total, fait: q.p.classList.contains('branche') });
      /* Retour par le même chemin (invisible : déjà tracé), puis la descente continue. */
      d += ` C${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${c1[0]} ${c1[1].toFixed(1)} ${mx} ${j.toFixed(1)}`;
      for (let k = 1; k <= 16; k++) ajouter(bez(q.x, c2[0], c1[0], mx, k / 16), bez(q.y, c2[1], c1[1], j, k / 16));
      y = j;
    });
    trace.setAttribute('d', d);
    trace.setAttribute('pathLength', total.toFixed(1));
    trace.style.strokeDasharray = `${total.toFixed(1)} ${total.toFixed(1)}`;
    if (fond) fond.setAttribute('d', d);
    maj();
  }
  function longueurPour(y) {
    if (!ech.length) return 0;
    let a = 0, b = ech.length - 1;
    if (y <= ech[0].y) return 0;
    if (y >= ech[b].y) return total;
    while (b - a > 1) { const m = (a + b) >> 1; if (ech[m].y <= y) a = m; else b = m; }
    /* Dans une branche (connecteur), la hauteur ne monte presque plus : on avance jusqu'au bout de ce palier. */
    while (a + 1 < ech.length && ech[a + 1].y <= y) a++;
    return ech[a].l;
  }
  function pointPour(l) {
    let a = 0, b = ech.length - 1;
    while (b - a > 1) { const m = (a + b) >> 1; if (ech[m].l <= l) a = m; else b = m; }
    return ech[a];
  }
  function maj() {
    raf = 0;
    if (!total) return;
    const y = window.scrollY + window.innerHeight * 0.66 - haut;
    const l = calme() ? total : Math.max(lefil.max * depart, Math.min(total, longueurPour(y) * depart));
    if (depart >= 1) lefil.max = Math.max(lefil.max, l);
    trace.style.strokeDashoffset = String((total - l).toFixed(1));
    if (tete) {
      const e = pointPour(l);
      if (e) tete.setAttribute('transform', `translate(${(e.x + 20).toFixed(1)} ${(e.py + 20).toFixed(1)})`);
      tete.style.opacity = l > 2 && l < total - 2 ? '1' : '0';
    }
    branches.forEach((b) => {
      if (!b.fait && l >= b.l - 4) {
        b.fait = true;
        b.p.classList.add('branche');
        if (!calme()) { b.p.classList.add('etincelle'); setTimeout(() => b.p.classList.remove('etincelle'), 800); }
      }
    });
  }
  const plusTard = () => { clearTimeout(mesure); mesure = setTimeout(mesurer, 120); };
  window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(maj); }, { passive: true });
  window.addEventListener('resize', plusTard, { passive: true });
  quand('rafraichi', plusTard);
  /* Première mesure à l'ouverture (la page est encore couverte par l'intro ou le voile) ; le fil se déroule ensuite. */
  quand('pret', ({ mode }) => {
    mesurer();
    if (calme() || !gsap || mode === 'retour' || mode === 'calme' || mode === 'secours' || mode === 'section') { depart = 1; maj(); return; }
    gsap.fromTo(lefil.etat, { v: 0 }, { v: 1, duration: 1.1, ease: 'power2.inOut', onUpdate: () => { depart = lefil.etat.v; maj(); } });
  });
  lefil.mesurer = mesurer;
}
lefil.etat = { v: 0 };
lefil.max = 0;

/* ------------------------------------------------------------------ « Quel est votre souci ? » : le bon fil se démêle */
function souci() {
  const sec = $('#souci');
  if (!sec) return;
  const boutons = $$('[data-souci]', sec), brins = $$('[data-brin]', sec), reponses = $$('[data-reponse]', sec);
  function choisir(id, focus = false) {
    boutons.forEach((b) => {
      const on = b.dataset.souci === id;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    reponses.forEach((r) => r.toggleAttribute('data-actif', r.dataset.reponse === id));
    brins.forEach((p) => {
      const on = p.dataset.brin === id;
      p.classList.toggle('actif', on);
      const cible = on ? p.dataset.droit : p.dataset.emmele;
      if (calme() || !gsap) p.setAttribute('d', cible);
      else gsap.to(p, { attr: { d: cible }, duration: on ? 0.9 : 0.6, ease: 'power3.inOut', overwrite: true });
    });
    const r = $(`[data-reponse="${id}"]`, sec);
    if (r && gsap && !calme()) gsap.fromTo(r, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'transform,opacity' });
  }
  boutons.forEach((b) => b.addEventListener('click', () => choisir(b.dataset.souci)));
  const groupe = $('[role="radiogroup"]', sec);
  groupe.addEventListener('keydown', (e) => {
    const i = boutons.findIndex((b) => b.getAttribute('aria-checked') === 'true');
    let n = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % boutons.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + boutons.length) % boutons.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = boutons.length - 1;
    if (n === null) return;
    e.preventDefault();
    choisir(boutons[n].dataset.souci, true);
  });
}

/* ------------------------------------------------------------------ Deux familles : l'écran fêlé se répare au défilement */
function familles() {
  const fele = $('[data-fele]');
  if (!fele) return;
  if (calme()) { fele.classList.add('repare'); return; }
  quandVisible(fele, () => setTimeout(() => fele.classList.add('repare'), 250), 0.3);
}

/* ------------------------------------------------------------------ Cartes inclinées et boutons magnétiques (souris seulement) */
function inclinaisons() {
  if (!souris || !gsap || calme()) return;
  $$('[data-incline]').forEach((el) => {
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    let r = null;
    el.addEventListener('pointerenter', () => { r = el.getBoundingClientRect(); });
    el.addEventListener('pointermove', (e) => {
      if (!r || e.pointerType !== 'mouse') return;
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * 7); rx(-py * 6);
    });
    el.addEventListener('pointerleave', () => { r = null; rx(0); ry(0); });
  });
}
function magnetiques() {
  if (!souris || !gsap || calme()) return;
  $$('[data-magnetique]').forEach((el) => {
    const qx = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    const qy = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
    let r = null;
    el.addEventListener('pointerenter', () => { r = el.getBoundingClientRect(); });
    el.addEventListener('pointermove', (e) => {
      if (!r || e.pointerType !== 'mouse') return;
      qx(((e.clientX - r.left) / r.width - 0.5) * 12);
      qy(((e.clientY - r.top) / r.height - 0.5) * 10);
    });
    el.addEventListener('pointerleave', () => { r = null; qx(0); qy(0); });
  });
}

/* ------------------------------------------------------------------ Zone des 25 km : la carte s'allume, la commune se relie au centre */
function trouverCommune(saisie, liste) {
  const n = normaliser(saisie);
  if (!n) return null;
  const options = $$('option', liste);
  const o = options.find((x) => normaliser(x.value) === n) || options.find((x) => normaliser(x.value).startsWith(n) && n.length >= 4);
  return o ? { nom: o.value, km: parseFloat(o.dataset.km) } : false;
}
function messageZone(porteur, res) {
  const m = (k) => porteur.dataset['msg' + k[0].toUpperCase() + k.slice(1)] || '';
  if (res === null) return { texte: m('vide'), classe: '' };
  if (res === false) return { texte: m('inconnue'), classe: 'dehors' };
  if (res.km === 0) return { texte: m('centre'), classe: 'dedans' };
  const km = String(Math.round(res.km));
  return res.km <= 25 ? { texte: remplir(m('dedans'), { commune: res.nom, km }), classe: 'dedans' } : { texte: remplir(m('dehors'), { commune: res.nom, km }), classe: 'dehors' };
}
function zone() {
  const carte = $('[data-zone-carte]');
  if (carte) quandVisible(carte, () => carte.classList.add('allumee'), 0.25);
  $$('.fiche-visuel').forEach((fiche) => quandVisible(fiche, () => fiche.classList.add('allumee'), 0.3));
  const form = $('[data-zone-recherche]');
  if (!form) return;
  const champ = $('input', form), sortie = $('[data-zone-resultat]', form), liste = $('#liste-communes');
  const ligne = $('[data-zone-ligne]'), cible = $('[data-zone-cible]');
  let choisi = null;
  const verifier = () => {
    const res = trouverCommune(champ.value, liste);
    const { texte, classe } = messageZone(form, res);
    sortie.textContent = texte;
    sortie.className = 'zone-resultat' + (classe ? ' ' + classe : '');
    if (choisi) choisi.classList.remove('choisi');
    choisi = null;
    if (res && carte) {
      const pt = $$('[data-commune]', carte).find((p) => p.dataset.commune === res.nom);
      if (pt) {
        choisi = pt; pt.classList.add('choisi');
        const x = pt.getAttribute('cx'), y = pt.getAttribute('cy');
        ligne.setAttribute('x2', x); ligne.setAttribute('y2', y); cible.setAttribute('cx', x); cible.setAttribute('cy', y);
        carte.classList.add('cible', 'allumee');
      } else carte.classList.remove('cible');
    } else if (carte) carte.classList.remove('cible');
  };
  form.addEventListener('submit', (e) => { e.preventDefault(); verifier(); });
  champ.addEventListener('change', verifier);
}

/* ------------------------------------------------------------------ Apparitions ponctuelles : cachet, portrait, réseau, prise finale */
function apparitionsPonctuelles() {
  $$('.cachet').forEach((c) => quandVisible(c, () => c.classList.add('tamponne'), 0.5));
  $$('.marco-portrait').forEach((p) => quandVisible(p, () => p.classList.add('enroule'), 0.4));
  $$('.services-visuel').forEach((s) => quandVisible(s, () => s.classList.add('relie'), 0.3));
  $$('.fin-visuel').forEach((f) => quandVisible(f, () => setTimeout(() => f.classList.add('branche'), 150), 0.45));
}

/* ------------------------------------------------------------------ Étapes : scène épinglée, le fil traverse quatre connecteurs */
function etapes() {
  const sec = $('.etapes');
  if (!sec) return;
  const trace = $('.etapes-fil-trace', sec), liste = $$('.etape', sec);
  const fini = () => { sec.classList.add('fini'); liste.forEach((l) => l.classList.add('active')); };
  if (!gsap || !ST || calme()) { fini(); return; }
  const suivre = (p) => liste.forEach((l, i) => l.classList.toggle('active', p >= i / liste.length + 0.02 || p > 0.98));
  ST.matchMedia({
    '(min-width: 761px) and (min-height: 521px)': () => {
      const tw = gsap.fromTo(trace, { strokeDashoffset: 1 }, {
        strokeDashoffset: 0, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top top', end: '+=70%', pin: true, anticipatePin: 1, scrub: 0.5, invalidateOnRefresh: true, onUpdate: (s) => suivre(s.progress), onLeave: fini },
      });
      return () => tw.scrollTrigger && tw.scrollTrigger.kill();
    },
    '(max-width: 760px), (max-height: 520px)': () => {
      const tw = gsap.fromTo(trace, { strokeDashoffset: 1 }, {
        strokeDashoffset: 0, ease: 'none',
        scrollTrigger: { trigger: '.etapes-liste', start: 'top 75%', end: 'bottom 55%', scrub: 0.5, onUpdate: (s) => suivre(s.progress), onLeave: fini },
      });
      return () => tw.scrollTrigger && tw.scrollTrigger.kill();
    },
  });
}

/* ------------------------------------------------------------------ Questions fréquentes : ouverture et fermeture animées */
function faq() {
  $$('.faq-item').forEach((d) => {
    const s = $('summary', d), corps = $('.faq-reponse', d);
    s.addEventListener('click', (e) => {
      if (calme() || !corps.animate) return;
      e.preventDefault();
      if (d.dataset.anime === '1') return;
      d.dataset.anime = '1';
      const ouvrir = !d.open;
      if (ouvrir) d.open = true;
      const h = corps.scrollHeight;
      const a = corps.animate([{ height: (ouvrir ? 0 : h) + 'px' }, { height: (ouvrir ? h : 0) + 'px' }], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' });
      a.onfinish = () => { if (!ouvrir) d.open = false; delete d.dataset.anime; rafraichir(); };
    });
  });
}

/* ------------------------------------------------------------------ Prestations : filtres gardés dans l'adresse */
function filtres() {
  const zone = $('[data-filtres]');
  if (!zone) return;
  const boutons = $$('[data-filtre]', zone), cartes = $$('[data-catalogue] .prestation[data-famille]'), compte = $('[data-filtres-compte]');
  const tuile = $('[data-tuile-appel]');
  /* La tuile d'appel occupe la place qui reste sur la dernière rangée (jamais de trou). */
  const completer = () => {
    if (!tuile) return;
    const cols = getComputedStyle(grille).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
    const n = cartes.filter((c) => !c.classList.contains('masquee')).length;
    tuile.style.setProperty('--reste', String(cols - (n % cols) || cols));
  };
  window.addEventListener('resize', () => requestAnimationFrame(completer), { passive: true });
  const grille = $('[data-catalogue]');
  function appliquer(f, { pousser = true, animer = true } = {}) {
    const avantY = grille.getBoundingClientRect().top;
    boutons.forEach((b) => b.setAttribute('aria-pressed', b.dataset.filtre === f ? 'true' : 'false'));
    const visibles = [];
    cartes.forEach((c) => { const v = f === 'tout' || c.dataset.famille === f; c.classList.toggle('masquee', !v); if (v) visibles.push(c); });
    const n = visibles.length;
    compte.textContent = n === 1 ? compte.dataset.modeleUn : remplir(compte.dataset.modele, { n });
    if (pousser) {
      const u = new URL(location.href);
      if (f === 'tout') u.searchParams.delete('famille'); else u.searchParams.set('famille', f);
      history.replaceState(null, '', u.pathname + u.search + u.hash);
    }
    if (animer && gsap && !calme()) gsap.fromTo(visibles, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.42, stagger: 0.04, ease: 'power2.out', clearProps: 'transform,opacity' });
    completer();
    rafraichir();
    /* La liste a raccourci et son début est passé au-dessus de l'écran : on y revient. */
    if (avantY < 0) aller(zone, { instant: calme() });
  }
  boutons.forEach((b) => b.addEventListener('click', () => appliquer(b.dataset.filtre)));
  const p = new URLSearchParams(location.search).get('famille');
  const cible = location.hash ? cartes.find((c) => '#' + c.id === decodeURIComponent(location.hash)) : null;
  if (p && boutons.some((b) => b.dataset.filtre === p) && !(cible && cible.dataset.famille !== p)) appliquer(p, { pousser: false, animer: false });
  else completer();
}

/* ------------------------------------------------------------------ Estimateur : on tire le câble, le prix suit */
const estimer = (h) => (h < 1 ? { niveau: 0, prix: 30 } : h < 4 ? { niveau: 1, prix: 25 * h } : { niveau: 2, prix: 20 * h });
function estimateur() {
  const boite = $('[data-estimateur]');
  if (!boite) return;
  const tarifs = JSON.parse(boite.dataset.tarifs);
  const champ = $('input[type="range"]', boite), sortie = $('[data-duree]', boite), total = $('.estimateur-total', boite);
  const prix = $('[data-total-prix]', boite), detail = $('[data-total-detail]', boite), fil = $('.curseur-cable', boite), lien = $('[data-lien-estimation]', boite);
  const maj = () => {
    const h = parseFloat(champ.value), e = estimer(h), t = tarifs[e.niveau];
    const min = parseFloat(champ.min), max = parseFloat(champ.max);
    fil.style.setProperty('--p', String((h - min) / (max - min)));
    sortie.textContent = duree(h);
    champ.setAttribute('aria-valuetext', duree(h));
    prix.textContent = euros(e.prix);
    detail.textContent = e.niveau === 0 ? `${t.niveau} · ${boite.dataset.forfait}` : `${t.niveau} · ${duree(h)} × ${euros(t.prix)}`;
    total.dataset.total = String(e.prix);
    if (lien) { const u = new URL(lien.href, location.href); u.searchParams.set('duree', String(h)); lien.href = u.pathname + u.search + u.hash; }
  };
  champ.addEventListener('input', maj);
  $$('[data-pas]', boite).forEach((b) => b.addEventListener('click', () => {
    const v = Math.min(parseFloat(champ.max), Math.max(parseFloat(champ.min), parseFloat(champ.value) + parseFloat(b.dataset.pas)));
    champ.value = String(v);
    maj();
  }));
  maj();
}

/* ------------------------------------------------------------------ Rendez-vous : cinq étapes, récapitulatif en direct */
function rendezVous() {
  const f = $('[data-etapes]');
  if (!f) return;
  const etapesF = $$('[data-etape-form]', f), prog = $$('[data-progression]', f), cadre = $('[data-etapes-cadre]', f), courant = $('[data-etape-courante]', f);
  const R = (k) => $(`[data-recap-${k}]`);
  const liste = $('#liste-communes-rdv'), commune = $('[data-commune]', f), sortieZone = $('[data-zone-resultat]', f);
  let i = 0;
  const vide = f.dataset.vide;

  function erreur(champ, message) {
    const id = 'erreur-' + (champ.id || champ.name);
    let p = document.getElementById(id);
    if (!message) { if (p) p.textContent = ''; champ.removeAttribute('aria-invalid'); return; }
    if (!p) {
      p = document.createElement('p'); p.id = id; p.className = 'champ-erreur'; p.setAttribute('aria-live', 'polite');
      (champ.closest('.champ') || champ.parentElement).appendChild(p);
      champ.setAttribute('aria-describedby', [champ.getAttribute('aria-describedby'), id].filter(Boolean).join(' '));
    }
    p.textContent = message; champ.setAttribute('aria-invalid', 'true');
  }
  function lieu() { const r = $('input[name="lieu"]:checked', f); return r ? r.value : ''; }
  function valide(n) {
    if (n === 1) {
      const s = $('select[name="prestation"]', f);
      erreur(s, s.value ? '' : f.dataset.erreurPrestation);
      if (!s.value) { s.focus(); return false; }
    }
    if (n === 2) {
      const besoin = lieu() !== 'distance' && !commune.value.trim();
      erreur(commune, besoin ? f.dataset.erreurCommune : '');
      if (besoin) { commune.focus(); return false; }
    }
    return true;
  }
  function afficher(n, focus = true) {
    const avant = cadre.offsetHeight;
    i = n;
    etapesF.forEach((e, k) => e.classList.toggle('courante', k === n));
    prog.forEach((p, k) => { p.classList.toggle('faite', k < n); p.classList.toggle('courante', k === n); });
    courant.textContent = remplir(courant.dataset.modele, { n: n + 1 });
    const apres = cadre.offsetHeight;
    if (!calme() && cadre.animate && avant !== apres) cadre.animate([{ height: avant + 'px', overflow: 'hidden' }, { height: apres + 'px', overflow: 'hidden' }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
    if (focus) {
      const premier = $('input:not([type="hidden"]), select, textarea', etapesF[n]);
      const r = f.getBoundingClientRect();
      if (r.top < 0) aller(f, { instant: calme() });
      if (premier) premier.focus({ preventScroll: true });
    }
    rafraichir();
  }
  f.addEventListener('click', (e) => {
    if (e.target.closest('[data-suivant]')) { if (valide(i)) afficher(Math.min(4, i + 1)); }
    else if (e.target.closest('[data-precedent]')) afficher(Math.max(0, i - 1));
  });
  /* Entrée dans un champ : passe à l'étape suivante au lieu d'envoyer le formulaire avant la fin. */
  f.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && i < 4 && e.target.matches('input:not([type="checkbox"]):not([type="radio"])')) { e.preventDefault(); if (valide(i)) afficher(i + 1); }
  });

  const verifierCommune = () => {
    if (!commune.value.trim()) { sortieZone.textContent = ''; sortieZone.className = 'zone-resultat'; return; }
    const res = trouverCommune(commune.value, liste);
    const { texte, classe } = messageZone(f, res);
    sortieZone.textContent = texte; sortieZone.className = 'zone-resultat' + (classe ? ' ' + classe : '');
  };
  commune.addEventListener('change', verifierCommune);

  const ecrire = (k, v) => { const el = R(k); el.textContent = v || vide; el.classList.toggle('vide', !v); };
  function recap() {
    const l = $('input[name="lieu"]:checked', f);
    ecrire('lieu', l ? $('strong', l.parentElement).textContent : '');
    const s = $('select[name="prestation"]', f);
    ecrire('prestation', s.value && s.selectedOptions[0] ? s.selectedOptions[0].textContent : '');
    ecrire('commune', commune.value.trim());
    const jours = $$('input[name="jours"]:checked', f).map((x) => x.value);
    const moments = $$('input[name="moments"]:checked', f).map((x) => $('span', x.parentElement).textContent.toLowerCase());
    ecrire('dispo', [...jours, ...moments].join(', '));
    const d = parseFloat(($('[data-champ-duree]', f) || {}).value);
    const ligne = $('[data-recap-estimation-ligne]');
    if (d >= 0.5 && d <= 12) {
      ligne.hidden = false;
      R('estimation').textContent = remplir(f.dataset.modeleEstimation, { duree: duree(d), prix: euros(estimer(d).prix) });
    } else ligne.hidden = true;
  }
  f.addEventListener('input', recap);
  f.addEventListener('change', recap);
  recap();
  if (commune.value) verifierCommune();
}

/* ------------------------------------------------------------------ Citation d'À propos : les mots arrivent un à un (une fois) */
function citation() {
  const p = $('[data-citation]');
  if (!p || !gsap || !window.SplitText || calme() || etat.arrivee === 'retour') return;
  const st = new window.SplitText(p, { type: 'words', wordsClass: 'mot' });
  gsap.set(st.words, { opacity: 0.18 });
  quandVisible(p, () => gsap.to(st.words, { opacity: 1, duration: 0.5, stagger: 0.045, ease: 'power1.out' }), 0.5);
  quand('retour', () => gsap.set(st.words, { opacity: 1 }));
}

/* ------------------------------------------------------------------ Démarrage */
demarrer({
  preparer() {
    preparerIntro();
    lefil();
    souci();
    familles();
    zone();
    apparitionsPonctuelles();
    etapes();
    faq();
    filtres();
    estimateur();
    rendezVous();
    citation();
    inclinaisons();
    magnetiques();
    parallaxeOuverture();
  },
  /* Intro complète (environ 2,2 s) : la prise relie « marc » à « ordi », le logo file dans l'en-tête,
     le panneau se retire et le premier écran s'allume. */
  jouer() {
    if (!gsap) return null;
    return timelineIntro();
  },
  /* État final (retour arrière, mode calme, secours) : tout est en place, sans animation. */
  etatFinal() {
    etatFinalPremierEcran();
  },
  /* Arrivée par un lien interne : le premier écran s'allume pendant que le voile se retire. */
  arrivee() {
    if (!gsap) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    arriveePremierEcran(tl, 0.05);
  },
});
