# Hanf-/Leinstroh-Boxenböden A–E (Dome 2.11.2026): jeweils eine KOPIE von strohboxenboden-<a–e>-<Maß>.blend (die Strohdatei bleibt unverändert),
# Hanfsplitter und -nadeln statt Halme (Mischung aus vier Fotos), Haufen so verteilt, dass Ebene 1 zu ~99,5 % bedeckt ist (Haufen dafür in der Breite bis ×1,25).
# Ergebnis: blender/hanfboxenboden-<a–e>-<Maß>.blend.   Aufruf: blender -b --python blender/hanfboxenboden-speichern.py -- <Projektordner>
import bpy, sys, math, random
from mathutils import Vector
_a = sys.argv[sys.argv.index("--") + 1:]; PROJ = _a[0]; NUR = _a[1:] or list("abcde")   # optional: nur diese Böden, z. B. -- <Ordner> a
exec(open(f"{PROJ}/blender/strohlib.py").read(), globals())
HANF = [(236, 226, 204), (220, 205, 172), (196, 176, 136), (166, 148, 118), (204, 172, 108), (204, 206, 150), (104, 84, 58), (178, 180, 142), (152, 156, 116), (198, 198, 164)]
GEW = [24, 28, 22, 12, 8, 3, 3]; NADEL_GEW = [30, 40, 30]
KOMPAKT = 0.75   # Foto 5: Hanf liegt kompakter als Stroh – flachere, breite Haufen (Höhe ×0,75), viel mehr Teilchen, meist dünne Nadeln
PATCH = [0]   # 1 = helle Stelle, -1 = dunkle Stelle (Ebene 1)
DUNKEL_F = [2.0, 2.0, 1.2, 1.2, 1.0]   # Gewichte für helle/dunkle Flecken je Farbe (nur erste fünf Farben)
def gew():
    if PATCH[0] == 0: return GEW
    return [g * (DUNKEL_F[i] if PATCH[0] > 0 and i in (0, 3) else 1.0 / DUNKEL_F[i] if PATCH[0] < 0 and i in (2, 4) else 1.0) if i < 5 else g for i, g in enumerate(GEW)]
def warp(x, y, t, ph):   # Haufen laufen unregelmäßig aus (Dome 2.11.): Umriss je Winkel verschieden, unten breiter als oben (t = 0 oben, 1 unten)
    a = math.atan2(y, x); s = (1 + 0.22 * math.sin(2 * a + ph[0]) + 0.16 * math.sin(3 * a + ph[1]) + 0.10 * math.sin(5 * a + ph[2])) * (1 + 0.3 * t * t)
    return x * s, y * s
def masse(chip=False, sc=1.0, pn=0.75):   # Maße eines Teilchens: (Nadel?, Länge, Breite) in Einheiten
    if not chip and random.random() < pn: return (True, random.uniform(1.2, 4.0) / E * sc, random.uniform(0.08, 0.2) / E * sc)
    return (False, random.uniform(1.5, 5.5) / E * sc, random.uniform(0.3, 0.9) / E * sc)
def splitter(V, F, MI, p, rich, mh, chip=False, sc=1.0, pn=0.75, dim=None):   # gibt die Fläche des Teilchens zurück
    nadel, l, b = dim or masse(chip, sc, pn)
    halm(V, F, MI, (7 + random.choices(range(3), NADEL_GEW)[0]) if nadel else random.choices(range(7), gew())[0], p, rich, l, b, 1, 0.0, random.uniform(-1.2, 1.2)); return l * b
for j, (name, mass) in enumerate([("a", "3x3"), ("b", "3x4"), ("c", "4x4"), ("d", "4x5"), ("e", "5x5")]):
    if name not in NUR: continue
    bpy.ops.wm.open_mainfile(filepath=f"{PROJ}/blender/strohboxenboden-{name}-{mass}.blend")
    for i, c in enumerate(HANF):
        m = mat(f"hanf_{i}", c); cc = tuple(srgb(x) for x in c) + (1,); m.diffuse_color = cc; m.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = cc
    mh = [bpy.data.materials[f"hanf_{i}"] for i in range(10)]; grund = mat("hanf_grund", (160, 142, 108)); haufenm = mat("hanf_haufen_koerper", (200, 182, 142))
    P = "box" + name.upper(); b = bpy.data.objects[f"{P}_boden"]; b.data.materials[0] = grund
    BX = max(v.co.x for v in b.data.vertices) * 2; BY = max(v.co.y for v in b.data.vertices) * 2
    ks = []; R0 = []
    for k in range(1, 1000):
        ko = bpy.data.objects.get(f"{P}_haufen_{k:02d}_koerper")
        if not ko: break
        xs = [v.co.x for v in ko.data.vertices]; ys = [v.co.y for v in ko.data.vertices]
        ko["r0"] = max(abs(min(xs)), max(xs)); ko["ry0"] = max(abs(min(ys)), max(ys)); ko.data.materials[0] = haufenm; ks.append(ko); R0.append(max(ko["r0"], ko["ry0"]))
    pos, R, bed = verteilen(BX, BY, R0, seed=42 + j, ziel=0.995)
    def ersetze(nm, V, F, MI, loc):
        alt = bpy.data.objects[nm]; sam = alt.users_collection[0]; bpy.data.objects.remove(alt, do_unlink=True); mesh_objekt(nm, V, F, MI, sam, mh).location = loc
    random.seed(11 + j); V, F, MI = [], [], []   # Ebene 1 mit viel Struktur (Dome 2.11.): Hügel und Mulden, Klumpen, hellere und dunklere Flecken, Teile stehen schräg
    ph = [random.uniform(0, math.tau) for _ in range(6)]
    klumpen = [(random.uniform(-BX / 2, BX / 2), random.uniform(-BY / 2, BY / 2), random.uniform(14, 36)) for _ in range(int(BX * BY / 1800))]
    CELL = 3.0; hg = {}   # Höhenraster: jedes Teilchen fällt auf das, was darunter liegt (Schwerkraft, Dome 2.11.) – nichts schwebt, Struktur entsteht durch Stapeln
    hh = lambda x, y: hg.get((int(x // CELL), int(y // CELL)), 2.0)
    def hset(x, y, v):
        k = (int(x // CELL), int(y // CELL))
        if v > hg.get(k, 2.0): hg[k] = v
    LT = 3.5   # angenommene Teilchenlänge für die Auflage (Einheiten)
    def lege(x, y, chip=False):   # ein Teilchen fällt auf das, was darunter liegt (echte Länge, liegt auf dem höchsten Punkt, kaum geneigt – nichts schwebt); gibt die Fläche zurück
        dim = masse(chip, 1.4, 0.4); L = dim[1]; a = random.uniform(0, math.tau); dx, dy = math.cos(a) * L / 2, math.sin(a) * L / 2
        pts = [(x + dx * t_, y + dy * t_) for t_ in (-1.0, -0.5, 0.0, 0.5, 1.0)]; hs_ = [hh(px, py) for px, py in pts]
        zs = max(hs_[0], hs_[1], hs_[2]) + 0.2; ze = max(hs_[2], hs_[3], hs_[4]) + 0.2; zm = max(zs, ze)   # beide Hälften liegen auf; die Mitte auf dem Höheren
        zs = max(zs, zm - 0.25 * L); ze = max(ze, zm - 0.25 * L)
        fl = math.sin(x / 45 + ph[4]) * math.sin(y / 41 + ph[5]); PATCH[0] = 1 if fl > 0.3 else -1 if fl < -0.3 else 0
        fl_ = splitter(V, F, MI, Vector((x - dx, y - dy, zs)), Vector((math.cos(a), math.sin(a), max(-0.15, min(0.15, (ze - zs) / L)))), mh, chip, 1.4, 0.0, dim)
        for (px, py), zz in zip(pts, (zs, (3 * zs + ze) / 4, (zs + ze) / 2, (zs + 3 * ze) / 4, ze)): hset(px, py, zz + 0.35)
        return fl_
    # Ebene 1 deckt die Bodenplatte ganz ab (Dome: schöne Übergänge wie beim Stroh): erst ein Raster, in jeder Zelle ein größeres Teilchen, dann Zufall und Klumpen bis zur Zielfläche
    for gx in range(int(-BX / 2 + 5), int(BX / 2 - 5), 4):
        for gy in range(int(-BY / 2 + 5), int(BY / 2 - 5), 4): lege(gx + random.uniform(-2, 2), gy + random.uniform(-2, 2), True)
    flaeche = 0.0; ziel_ = 1.2 * BX * BY
    while flaeche < ziel_:
        if random.random() < 0.6: cx, cy, cs = random.choice(klumpen); x, y = random.gauss(cx, cs), random.gauss(cy, cs)
        else: x, y = random.uniform(-BX / 2, BX / 2), random.uniform(-BY / 2, BY / 2)
        if abs(x) > BX / 2 - 6 or abs(y) > BY / 2 - 6: continue
        flaeche += lege(x, y)
    PATCH[0] = 0
    import json; json.dump({"cell": CELL, "hg": [[k[0], k[1], round(v, 2)] for k, v in hg.items()]}, open(f"{PROJ}/blender/testseiten/boxenboden/hoehe-hanf-{name}.json", "w"))   # Höhenraster der Ebene 1: darauf liegen die Pferdeäpfel
    ersetze(f"{P}_muster", V, F, MI, b.location)
    for i, ko in enumerate(ks):
        f = R[i] / R0[i]; ko.location = (pos[i][0], pos[i][1], 0); ko.scale = (f, f, 1)
        for v in ko.data.vertices: v.co.z *= KOMPAKT
        ph = [random.Random(31 * (i + 1) + q + 100 * j).uniform(0, math.tau) for q in range(3)]; zs_ = [v.co.z for v in ko.data.vertices]; zlo, zhi = min(zs_), max(zs_)
        LX, LY = BX / 2 - 2, BY / 2 - 2; kl = lambda w, g: max(-g, min(g, w))   # nichts über den Boxenrand hinaus
        for v in ko.data.vertices:
            v.co.x, v.co.y = warp(v.co.x, v.co.y, 1 - (v.co.z - zlo) / max(1e-6, zhi - zlo), ph)
            v.co.x = (kl(pos[i][0] + f * v.co.x, LX) - pos[i][0]) / f; v.co.y = (kl(pos[i][1] + f * v.co.y, LY) - pos[i][1]) / f
        k = i + 1; r = ko["r0"] * f; ry = ko["ry0"] * f; kuppel = max(v.co.z for v in ko.data.vertices) - 1.5 * KOMPAKT
        random.seed(7000 + 100 * j + k); V, F, MI = [], [], []
        for _ in range(int(r * ry * 2.0)):
            th = math.acos(random.random() ** 0.8) * 0.95; w = random.uniform(0, math.tau)
            p = Vector((r * math.sin(th) * math.cos(w), ry * math.sin(th) * math.sin(w), kuppel * math.cos(th) + 1.5 * KOMPAKT))
            px_, py_ = warp(p.x, p.y, 1 - min(1, max(0, (p.z - 1.5 * KOMPAKT) / kuppel)), ph); p = Vector((kl(pos[i][0] + px_, LX) - pos[i][0], kl(pos[i][1] + py_, LY) - pos[i][1], p.z))
            nrm = normiert(Vector((math.sin(th) * math.cos(w) / r, math.sin(th) * math.sin(w) / ry, math.cos(th) / kuppel)))
            zu = Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1))); tang = normiert(zu - nrm * zu.dot(nrm))
            splitter(V, F, MI, p + nrm * 0.2, normiert(tang + nrm * random.uniform(-0.05, 0.12) + Vector((random.uniform(-.2, .2), random.uniform(-.2, .2), random.uniform(-.08, .08)))), mh)
        for _ in range(int(r * ry * 0.5)):   # loses Hanf, das rund um den Haufen ausläuft
            a_ = random.uniform(0, math.tau); rr = random.uniform(0.95, 1.7); x_, y_ = warp(r * rr * math.cos(a_), ry * rr * math.sin(a_), 1, ph); b_ = random.uniform(0, math.tau)
            if abs(pos[i][0] + x_) > LX or abs(pos[i][1] + y_) > LY: continue
            splitter(V, F, MI, Vector((x_, y_, random.uniform(2.3, 2.6))), Vector((math.cos(b_), math.sin(b_), random.uniform(-.15, .15))), mh)
        ersetze(f"{P}_haufen_{k:02d}_halme", V, F, MI, (pos[i][0], pos[i][1], 0))
    ziel = f"{PROJ}/blender/hanfboxenboden-{name}-{mass}.blend"; bpy.ops.wm.save_as_mainfile(filepath=ziel)
    print("GESPEICHERT", ziel.split("/")[-1], "Haufen:", len(ks), "Bedeckung:", round(bed, 4), "max. Breitenfaktor:", round(float((R / R0).max()), 2))
