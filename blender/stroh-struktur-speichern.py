# Stroh, Ebene 1 mit mehr Struktur (Dome 2.11.2026, wie bei Hanf und Späne): Halme fallen auf das, was darunter liegt (Höhenraster, Schwerkraft – nichts schwebt),
# 60 % der Halme in Klumpen, hellere und dunklere Flecken. Überschreibt das Muster (boxA_muster) in strohboxenboden-<a–e>-<Maß>.blend; die Haufen (Ebene 2) bleiben.
# Aufruf: blender -b --python blender/stroh-struktur-speichern.py -- <Projektordner> [a b …]
import bpy, sys, math, random
from mathutils import Vector
_a = sys.argv[sys.argv.index("--") + 1:]; PROJ = _a[0]; NUR = _a[1:] or list("abcde")
exec(open(f"{PROJ}/blender/strohlib.py").read(), globals())
for j, (name, mass) in enumerate([("a", "3x3"), ("b", "3x4"), ("c", "4x4"), ("d", "4x5"), ("e", "5x5")]):
    if name not in NUR: continue
    bpy.ops.wm.open_mainfile(filepath=f"{PROJ}/blender/strohboxenboden-{name}-{mass}.blend")
    P = "box" + name.upper(); b = bpy.data.objects[f"{P}_boden"]; M = materialien()
    BX = max(v.co.x for v in b.data.vertices) * 2; BY = max(v.co.y for v in b.data.vertices) * 2
    random.seed(50 + j); V, F, MI = [], [], []
    ph = [random.uniform(0, math.tau) for _ in range(2)]
    klumpen = [(random.uniform(-BX / 2, BX / 2), random.uniform(-BY / 2, BY / 2), random.uniform(14, 36)) for _ in range(int(BX * BY / 1800))]
    CELL = 3.0; hg = {}
    hh = lambda x, y: hg.get((int(x // CELL), int(y // CELL)), 2.0)
    def hset(x, y, v):
        k = (int(x // CELL), int(y // CELL))
        if v > hg.get(k, 2.0): hg[k] = v
    for _ in range(int(BX * BY * 12000 / (443.0 * 443.0))):
        if random.random() < 0.6: cx, cy, cs = random.choice(klumpen); x, y = random.gauss(cx, cs), random.gauss(cy, cs)
        else: x, y = random.uniform(-BX / 2, BX / 2), random.uniform(-BY / 2, BY / 2)
        if abs(x) > BX / 2 - 10 or abs(y) > BY / 2 - 10: continue
        L = random.uniform(16, 34); a = random.uniform(0, math.tau); ca, sa = math.cos(a), math.sin(a)
        pts = [(x + ca * L * t, y + sa * L * t) for t in (0.0, 0.25, 0.5, 0.75, 1.0)]
        zs = [hh(px, py) + 0.2 for px, py in pts]   # Halm legt sich über das, was darunter liegt (hängt durch, nichts schwebt): Höhe je Punkt, nicht tiefer als 1,2 unter dem Nachbarn (Halme sind steif)
        for _ in range(3):
            for i in range(5): zs[i] = max(zs[i], (zs[i - 1] - 1.2) if i > 0 else 0, (zs[i + 1] - 1.2) if i < 4 else 0)
        fl = math.sin(x / 45 + ph[0]) * math.sin(y / 41 + ph[1]); gew = HAUFEN_GEW if fl > 0.3 else [34, 2, 34, 1, 45] if fl < -0.3 else BODEN_GEW
        ci = farbe(gew); br = random.uniform(1.5, 2.3); ro = random.uniform(-0.5, 0.5)
        for i in range(4):   # vier angeschlossene Stücke folgen dem Höhenverlauf
            p0 = Vector((pts[i][0], pts[i][1], zs[i])); p1 = Vector((pts[i + 1][0], pts[i + 1][1], zs[i + 1])); d = p1 - p0
            halm(V, F, MI, ci, p0, d, d.length, br, 1, 0.0, ro)
        for (px, py), zz in zip(pts, zs): hset(px, py, zz + 0.4)
    import json; json.dump({"cell": CELL, "hg": [[k[0], k[1], round(v, 2)] for k, v in hg.items()]}, open(f"{PROJ}/blender/testseiten/boxenboden/hoehe-stroh-{name}.json", "w"))   # Höhenraster der Ebene 1: darauf liegen die Pferdeäpfel
    alt = bpy.data.objects[f"{P}_muster"]; sam = alt.users_collection[0]; loc = alt.location.copy(); bpy.data.objects.remove(alt, do_unlink=True)
    mesh_objekt(f"{P}_muster", V, F, MI, sam, M["halme"]).location = loc
    # Ebene 2 (Haufen): Halme liegen an der Oberfläche statt abzustehen (Schwerkraft, Dome 2.11.): Neigung höchstens 10° von der Fläche weg
    n = 0; k = 0
    while True:
        k += 1; ko = bpy.data.objects.get(f"{P}_haufen_{k:02d}_koerper")
        if not ko: break
        xs = [v.co.x for v in ko.data.vertices]; ys = [v.co.y for v in ko.data.vertices]; zs = [v.co.z for v in ko.data.vertices]
        r = max(abs(min(xs)), max(xs)); ry = max(abs(min(ys)), max(ys)); kuppel = max(zs) - 1.5; H = kuppel / 0.7
        LX, LY = BX / 2 - 2, BY / 2 - 2   # Dome 2.11.: Haufenkörper und Halme nicht über den Boxenrand hinaus (Umriss sauber quadratisch wie bei Hanf und Späne)
        for v in ko.data.vertices:
            v.co.x = max(-LX, min(LX, ko.location.x + v.co.x)) - ko.location.x; v.co.y = max(-LY, min(LY, ko.location.y + v.co.y)) - ko.location.y
        random.seed(900 + 100 * j + k); V, F, MI = [], [], []
        for q_ in range(int(r * ry * 0.42) + int(r * ry * 0.30)):   # die letzten 0,30 liegen am unteren Rand der Haufen, damit der Körper dort nicht frei liegt
            th = math.acos(random.random() ** 0.8) * 0.93 if q_ < int(r * ry * 0.42) else random.uniform(0.95, 1.45); w = random.uniform(0, math.tau)
            p = Vector((r * math.sin(th) * math.cos(w), ry * math.sin(th) * math.sin(w), kuppel * math.cos(th) + 1.5))
            p.x = max(-LX, min(LX, ko.location.x + p.x)) - ko.location.x; p.y = max(-LY, min(LY, ko.location.y + p.y)) - ko.location.y
            nrm = normiert(Vector((math.sin(th) * math.cos(w) / r, math.sin(th) * math.sin(w) / ry, math.cos(th) / kuppel)))
            zu = Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1))); tang = normiert(zu - nrm * zu.dot(nrm)); anh = math.radians(random.uniform(0, 10))
            rich = normiert(tang * math.cos(anh) + nrm * math.sin(anh)); laenge = random.uniform(15, 28) * (0.75 + 0.25 * min(1, r / 40))
            zmax = 0.9 if random.random() < 0.08 else 0.22   # Dome: nur einzelne Halme stehen nach oben, die meisten liegen (höchstens ~13° steigend)
            if rich.z > zmax or rich.z < -0.4:
                hor = Vector((rich.x, rich.y, 0)); hor = hor.normalized() if hor.length > 1e-6 else Vector((1, 0, 0)); zc = max(-0.4, min(zmax, rich.z)); rich = hor * math.sqrt(1 - zc * zc) + Vector((0, 0, zc))
            px_, py_ = ko.location.x + p.x, ko.location.y + p.y   # Halme enden nie über dem Boxenrand (dort würden sie hängen)
            for _ in range(8):
                if abs(px_ + rich.x * laenge) <= BX / 2 - 2 and abs(py_ + rich.y * laenge) <= BY / 2 - 2: break
                laenge *= 0.7
            halm(V, F, MI, farbe(HAUFEN_GEW), p + nrm * 0.3, rich, laenge, random.uniform(1.4, 2.1), 2, 0.06, random.uniform(-0.9, 0.9))
        alt = bpy.data.objects[f"{P}_haufen_{k:02d}_halme"]; sam = alt.users_collection[0]; loc = alt.location.copy(); bpy.data.objects.remove(alt, do_unlink=True)
        mesh_objekt(f"{P}_haufen_{k:02d}_halme", V, F, MI, sam, M["halme"]).location = loc; n += 1
    ziel = f"{PROJ}/blender/strohboxenboden-{name}-{mass}.blend"; bpy.context.preferences.filepaths.save_version = 0; bpy.ops.wm.save_as_mainfile(filepath=ziel, compress=True)
    print("GESPEICHERT", ziel.split("/")[-1], len(MI) // 2, "Halme")
