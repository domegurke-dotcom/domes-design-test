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
        z = max(hh(px, py) for px, py in pts) + 0.2   # liegt auf dem höchsten Punkt darunter
        fl = math.sin(x / 45 + ph[0]) * math.sin(y / 41 + ph[1]); gew = HAUFEN_GEW if fl > 0.3 else [34, 2, 34, 1, 45] if fl < -0.3 else BODEN_GEW
        halm(V, F, MI, farbe(gew), Vector((x, y, z)), Vector((ca, sa, random.uniform(-0.05, 0.05))), L, random.uniform(1.5, 2.3), 1, 0.04, random.uniform(-0.5, 0.5))
        for px, py in pts: hset(px, py, z + 0.4)
    alt = bpy.data.objects[f"{P}_muster"]; sam = alt.users_collection[0]; loc = alt.location.copy(); bpy.data.objects.remove(alt, do_unlink=True)
    mesh_objekt(f"{P}_muster", V, F, MI, sam, M["halme"]).location = loc
    ziel = f"{PROJ}/blender/strohboxenboden-{name}-{mass}.blend"; bpy.ops.wm.save_as_mainfile(filepath=ziel)
    print("GESPEICHERT", ziel.split("/")[-1], len(MI) // 2, "Halme")
