# Späne-Boxenböden A–E (Dome 2.11.2026, Fotos Holzspäne): Kopie von strohboxenboden-<a–e>-<Maß>.blend (Original bleibt), Hobelspäne statt Halme: gewellte, dünne, helle Flocken (cremeweiß bis pfirsich/hellorange),
# weich und locker, flache unregelmäßig auslaufende Haufen (Höhe ×0,7), Ebene 1 mit Klumpen. Haufen so verteilt, dass Ebene 1 zu ~99,5 % bedeckt ist.
# Ergebnis: blender/spaeneboxenboden-<a–e>-<Maß>.blend.   Aufruf: blender -b --python blender/spaeneboxenboden-speichern.py -- <Projektordner> [a b …]
import bpy, sys, math, random
from mathutils import Vector
_a = sys.argv[sys.argv.index("--") + 1:]; PROJ = _a[0]; NUR = _a[1:] or list("abcde")   # optional: nur diese Böden, z. B. -- <Ordner> a
exec(open(f"{PROJ}/blender/strohlib.py").read(), globals())
SPAENE = [(246, 228, 196), (238, 204, 160), (226, 178, 118), (250, 240, 214), (206, 154, 98)]   # cremeweiß, pfirsich, hellorange, blass, dunkler (selten)
GEW = [30, 30, 20, 14, 6]; HANF = SPAENE
KOMPAKT = 0.7   # Späne liegen locker, aber als flache Schicht: niedrigere Haufen als Stroh
PATCH = [0]   # 1 = helle Stelle, -1 = dunkle Stelle (Ebene 1)
DUNKEL_F = [2.2, 2.0, 1.0, 1.4, 0.8]   # Gewichte für helle/dunkle Flecken je Farbe (nur erste fünf Farben)
def gew():
    if PATCH[0] == 0: return GEW
    return [g * (DUNKEL_F[i] if PATCH[0] > 0 and i in (0, 3) else 1.0 / DUNKEL_F[i] if PATCH[0] < 0 and i in (2, 4) else 1.0) if i < 5 else g for i, g in enumerate(GEW)]
def warp(x, y, t, ph):   # Haufen laufen unregelmäßig aus (Dome 2.11.): Umriss je Winkel verschieden, unten breiter als oben (t = 0 oben, 1 unten)
    a = math.atan2(y, x); s = (1 + 0.22 * math.sin(2 * a + ph[0]) + 0.16 * math.sin(3 * a + ph[1]) + 0.10 * math.sin(5 * a + ph[2])) * (1 + 0.3 * t * t)
    return x * s, y * s
def splitter(V, F, MI, p, rich, mh):   # Hobelspan: dünn, gewellt (zwei Segmente, hängt durch), mal klein mal größer
    kl = random.random() < 0.35; l = random.uniform(0.6, 1.6) / E if kl else random.uniform(1.4, 4.2) / E; b = random.uniform(0.4, 1.0) / E if kl else random.uniform(0.6, 1.6) / E
    halm(V, F, MI, random.choices(range(5), gew())[0], p, rich, l, b, 2, random.uniform(0.15, 0.45), random.uniform(-1.5, 1.5))
for j, (name, mass) in enumerate([("a", "3x3"), ("b", "3x4"), ("c", "4x4"), ("d", "4x5"), ("e", "5x5")]):
    if name not in NUR: continue
    bpy.ops.wm.open_mainfile(filepath=f"{PROJ}/blender/strohboxenboden-{name}-{mass}.blend")
    for i, c in enumerate(HANF):
        m = mat(f"spaene_{i}", c); cc = tuple(srgb(x) for x in c) + (1,); m.diffuse_color = cc; m.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = cc
    mh = [bpy.data.materials[f"spaene_{i}"] for i in range(len(SPAENE))]; grund = mat("spaene_grund", (214, 172, 118)); haufenm = mat("spaene_haufen_koerper", (232, 200, 152))
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
    for _ in range(int(BX * BY / 1800)):
        if random.random() < 0.6: cx, cy, cs = random.choice(klumpen); x, y = random.gauss(cx, cs), random.gauss(cy, cs)
        else: x, y = random.uniform(-BX / 2, BX / 2), random.uniform(-BY / 2, BY / 2)
        if abs(x) > BX / 2 - 6 or abs(y) > BY / 2 - 6: continue
        a = random.uniform(0, math.tau); dx, dy = math.cos(a) * LT / 2, math.sin(a) * LT / 2
        hs, he = hh(x - dx, y - dy), hh(x + dx, y + dy); hm = hh(x, y); zs = max(hs, hm) + 0.2; ze = max(he, hm) + 0.2
        fl = math.sin(x / 45 + ph[4]) * math.sin(y / 41 + ph[5]); PATCH[0] = 1 if fl > 0.3 else -1 if fl < -0.3 else 0
        splitter(V, F, MI, Vector((x - dx, y - dy, zs)), Vector((math.cos(a), math.sin(a), max(-0.5, min(0.5, (ze - zs) / LT)))), mh)
        for t_, zz in ((-1, zs), (0, (zs + ze) / 2), (1, ze)): hset(x + dx * t_, y + dy * t_, zz + 0.35)
    PATCH[0] = 0
    import json; json.dump({"cell": CELL, "hg": [[k[0], k[1], round(v, 2)] for k, v in hg.items()]}, open(f"{PROJ}/blender/testseiten/boxenboden/hoehe-spaene-{name}.json", "w"))   # Höhenraster der Ebene 1: darauf liegen die Pferdeäpfel
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
        for _ in range(int(r * ry * 1.5)):
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
    ziel = f"{PROJ}/blender/spaeneboxenboden-{name}-{mass}.blend"; bpy.ops.wm.save_as_mainfile(filepath=ziel)
    print("GESPEICHERT", ziel.split("/")[-1], "Haufen:", len(ks), "Bedeckung:", round(bed, 4), "max. Breitenfaktor:", round(float((R / R0).max()), 2))
