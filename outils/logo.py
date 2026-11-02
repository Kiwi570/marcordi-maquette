#!/usr/bin/env python3
"""Redessine le logo typographique de marcordi en vectoriel (d'après le JPG du site actuel).
Police : Figtree (OFL), proche de la police d'origine (Marianne, réservée à la marque de l'État).
Écrit source/gabarits/logo-donnees.json (tracés en unités, ligne de base à 0) et les fichiers SVG du logo.
Usage : python3 outils/logo.py <figtree-300.woff> <figtree-400.woff>"""
import json, sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

RACINE = Path(__file__).resolve().parent.parent

def mot(fichier, texte, taille, x0=0.0, espacement=0.0, y0=0.0):
    f = TTFont(fichier); gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f['head'].unitsPerEm
    k = taille / upm
    pen = SVGPathPen(gs); bp = BoundsPen(gs)
    x = x0
    for ch in texte:
        g = cmap[ord(ch)]
        t = (k, 0, 0, -k, x, y0)
        gs[g].draw(TransformPen(pen, t)); gs[g].draw(TransformPen(bp, t))
        x += gs[g].width * k + espacement
    d = pen.getCommands()
    # Arrondi des coordonnées pour alléger les fichiers.
    import re
    d = re.sub(r'-?\d+\.\d+', lambda m: f"{float(m.group()):.1f}".rstrip('0').rstrip('.'), d)
    return {"d": d, "bbox": [round(v, 1) for v in bp.bounds], "avance": round(x - x0, 1)}

leger, normal = sys.argv[1], sys.argv[2]
T = 100  # taille du mot-symbole (unités)
marc = mot(leger, "marc", T)
ordi = mot(leger, "ordi", T, x0=marc["avance"])
total = marc["avance"] + ordi["avance"]
tag = mot(normal, "Aidant Numérique", T * 0.265)
tag_x = (total - tag["avance"]) / 2
tag = mot(normal, "Aidant Numérique", T * 0.265, x0=tag_x)
donnees = {"marc": marc, "ordi": ordi, "tag": tag, "largeur": round(total, 1)}
(RACINE / "source/gabarits/logo-donnees.json").write_text(json.dumps(donnees))

# Boîtes : mot-symbole seul, et logo complet avec la ligne « Aidant Numérique ».
x0 = min(marc["bbox"][0], 0); x1 = max(ordi["bbox"][2], total)
y0 = min(marc["bbox"][1], ordi["bbox"][1]); y1 = max(marc["bbox"][3], ordi["bbox"][3])
m = 2
vb_mot = (x0 - m, y0 - m, x1 - x0 + 2 * m, y1 - y0 + 2 * m)
ty = y1 + 28  # ligne de base de la ligne secondaire
tag2 = mot(normal, "Aidant Numérique", T * 0.265, x0=tag_x, y0=ty)
def decaler(d, dy):
    import re
    out = []; toks = re.findall(r'[MLQCZz]|-?\d+(?:\.\d+)?', d); i = 0; cmd = None; paire = 0
    for t in toks:
        if t in 'MLQCZz': cmd = t; paire = 0; out.append(t); continue
        v = float(t)
        if paire % 2 == 1: v += dy
        paire += 1; out.append(f"{v:.1f}".rstrip('0').rstrip('.'))
    return ' '.join(out)
tag_d = tag2["d"]
yb = ty + 8
vb_complet = (x0 - m, y0 - m, x1 - x0 + 2 * m, yb - y0 + 2 * m)

def svg(vb, couleurs, avec_tag, titre="marcordi"):
    vbs = ' '.join(f"{v:.1f}" for v in vb)
    corps = f'<path fill="{couleurs[0]}" d="{marc["d"]}"/><path fill="{couleurs[1]}" d="{ordi["d"]}"/>'
    if avec_tag: corps += f'<path fill="{couleurs[2]}" d="{tag_d}"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vbs}" width="{vb[2]:.0f}" height="{vb[3]:.0f}" role="img" aria-label="{titre}"><title>{titre}</title>{corps}</svg>\n'

img = RACINE / "assets/images"
(img / "logo.svg").write_text(svg(vb_complet, ["#6E6A64", "#1D2125", "#1D2125"], True))
(img / "logo-mot.svg").write_text(svg(vb_mot, ["#6E6A64", "#1D2125"], False))
(img / "logo-clair.svg").write_text(svg(vb_complet, ["#B7B1A8", "#F3EEE4", "#F3EEE4"], True))
donnees.update({"vbMot": [round(v, 1) for v in vb_mot], "vbComplet": [round(v, 1) for v in vb_complet], "tagD": tag_d})
(RACINE / "source/gabarits/logo-donnees.json").write_text(json.dumps(donnees))
print("logo :", vb_mot, vb_complet)

# Icône : « m » (gris, comme « marc ») et « o » (crème, comme « ordi ») sur fond encre.
m_ = mot(normal, "m", 64)
o_ = mot(normal, "o", 64, x0=m_["avance"] - 1)
largeur = o_["bbox"][2] - m_["bbox"][0]
cx = 64 - largeur / 2 - m_["bbox"][0]
hauteur = m_["bbox"][3] - m_["bbox"][1]
cy = 64 + hauteur / 2 - m_["bbox"][3]
ic = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">'
      f'<rect width="128" height="128" rx="28" fill="#1D2125"/>'
      f'<g transform="translate({cx:.1f} {cy:.1f})"><path fill="#B7B1A8" d="{m_["d"]}"/><path fill="#F3EEE4" d="{o_["d"]}"/></g>'
      f'<rect x="34" y="94" width="60" height="5" rx="2.5" fill="#C2662F"/></svg>\n')
(img / "favicon.svg").write_text(ic)
print("icône écrite")
