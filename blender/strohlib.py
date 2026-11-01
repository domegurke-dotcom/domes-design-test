# Gemeinsame Bausteine für die Stroh-Einstreu in Blender (Dome): Materialien, Halm, Haufen (Ebene 2), Boden (Ebene 1), gleichmäßige Verteilung.
# Wird mit exec(open("blender/strohlib.py").read(), globals()) geladen (Aufrufer: boxenboeden-bauen.py, haufen-dazu.py).
# Maßstab: 1 Modelleinheit = 0,79 cm. Zeichenstil: Workbench, Studio-Licht, Materialfarben, schwarze Kontur (Solidify „kontur“, Material „tinte“).
import bpy, bmesh, math, random
from mathutils import Vector, Matrix

E = 0.79   # cm je Einheit
def srgb(x): x = x / 255; return x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4
def mat(name, rgb):
    m = bpy.data.materials.get(name)
    if m: return m
    c = tuple(srgb(x) for x in rgb); m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = c + (1,); b.inputs["Roughness"].default_value = 0.8; m.diffuse_color = c + (1,); return m
def materialien():
    t = mat("tinte", (0, 0, 0)); t.use_backface_culling = True
    return {"tinte": t, "grund": mat("stroh_grund", (178, 126, 44)), "haufen": mat("stroh_haufen_koerper", (222, 170, 74)),
            "halme": [mat("halm_gold", (236, 190, 86)), mat("halm_hell", (250, 218, 132)), mat("halm_bernstein", (214, 150, 50)), mat("halm_blass", (252, 236, 176)), mat("halm_dunkel", (176, 118, 36))]}
BODEN_GEW = [28, 8, 30, 4, 30]; HAUFEN_GEW = [18, 38, 8, 32, 4]   # Boden etwas dunkler, Haufen heller – so heben sie sich ab
def farbe(gew): return random.choices(range(5), gew)[0]
def kontur(o, dicke, versatz):
    m = o.modifiers.new("kontur", "SOLIDIFY"); m.thickness = dicke; m.offset = 1; m.use_flip_normals = True; m.use_rim = False; m.material_offset = versatz

def halm(V, F, MI, mi, basis, richtung, laenge, breite, segmente, haengen, roll):
    """Ein Halm als schmales, leicht gebogenes Band, beidseitig sichtbar (eigene Punkte für die Rückseite). V/F/MI sind Listen (Punkte, Flächen, Materialnummern)."""
    r = richtung.normalized(); s = r.cross(Vector((0, 0, 1)))
    if s.length < 0.05: s = Vector((1, 0, 0))
    s = (Matrix.Rotation(roll, 3, r) @ s.normalized()).normalized(); reihe = []
    for i in range(segmente + 1):
        t = i / segmente; p = basis + r * laenge * t + Vector((0, 0, -1)) * haengen * laenge * t * t; w = breite * (1 - 0.55 * t) / 2
        reihe.append(((p - s * w)[:], (p + s * w)[:]))
    for i in range(segmente):
        a, b = reihe[i]; c, d = reihe[i + 1]; k = len(V); V.extend([a, b, c, d, a, b, c, d])
        F.append((k, k + 1, k + 3, k + 2)); MI.append(mi); F.append((k + 6, k + 7, k + 5, k + 4)); MI.append(mi)
def mesh_objekt(name, V, F, MI, sammlung, mats):
    me = bpy.data.meshes.new(name); me.from_pydata(V, [], F); me.update()
    for m in mats: me.materials.append(m)
    me.polygons.foreach_set("material_index", MI); me.polygons.foreach_set("use_smooth", [False] * len(F))
    o = bpy.data.objects.new(name, me); sammlung.objects.link(o); return o
def normiert(v): return v.normalized() if v.length > 1e-6 else Vector((0, 0, 1))

def haufen_bauen(sammlung, praefix, nr, cx, cy, r, H, M, ry=None, seed=None):
    """Ein kleiner lockerer Heuhaufen (Körper + Halme) bei (cx, cy), Radius r, Höhe H (Einheiten). Die Halme liegen kreuz und quer, nie über H."""
    random.seed(seed if seed is not None else 1000 + nr)
    ry = ry or r * random.uniform(0.8, 1.1); kuppel = H * 0.7
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=10, radius=1.0)
    for v in bm.verts: v.co = Vector((v.co.x * r, v.co.y * ry, max(v.co.z, -0.1) * kuppel + 1.5))
    for f in bm.faces: f.material_index = 0; f.smooth = False
    name = f"{praefix}{nr:02d}"; me = bpy.data.meshes.new(name + "_koerper"); bm.to_mesh(me); bm.free()
    me.materials.append(M["haufen"]); me.materials.append(M["tinte"])
    kb = bpy.data.objects.new(name + "_koerper", me); sammlung.objects.link(kb); kb.location = (cx, cy, 0); kontur(kb, 0.8, 1)
    V, F, MI = [], [], []
    for i in range(int(r * r * 0.22)):
        th = math.acos(random.random() ** 0.8) * 0.93; w = random.uniform(0, math.tau)
        p = Vector((r * math.sin(th) * math.cos(w), ry * math.sin(th) * math.sin(w), kuppel * math.cos(th) + 1.5))
        nrm = normiert(Vector((math.sin(th) * math.cos(w) / r, math.sin(th) * math.sin(w) / ry, math.cos(th) / kuppel)))
        zufall = Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1)))
        tang = normiert(zufall - nrm * zufall.dot(nrm)); anh = math.radians(random.uniform(0, 38))
        rich = normiert(tang * math.cos(anh) + nrm * math.sin(anh)); laenge = random.uniform(15, 28) * (0.75 + 0.25 * min(1, r / 40))
        if p.z + laenge * rich.z - 0.28 * laenge > H:
            zc = max(-0.2, min(rich.z, (H - p.z + 0.28 * laenge) / laenge)); hor = Vector((rich.x, rich.y, 0)); hor = hor.normalized() if hor.length > 1e-6 else Vector((1, 0, 0))
            rich = hor * math.sqrt(1 - zc * zc) + Vector((0, 0, zc))
        halm(V, F, MI, farbe(HAUFEN_GEW), p, rich, laenge, random.uniform(1.4, 2.1), 2, 0.28, random.uniform(-0.9, 0.9))
    hl = mesh_objekt(name + "_halme", V, F, MI, sammlung, M["halme"]); hl.location = (cx, cy, 0)
    return kb, hl

def boden_bauen(sammlung, praefix, BX, BY, ox, oy, M, anzahl=None, seed=5):
    """Ebene 1: flache Grundplatte BX (Länge, x) × BY (Breite, y) (Einheiten) mit Kontur und flach liegenden Halmen als Muster, Mitte bei (ox, oy)."""
    random.seed(seed)
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts: v.co = Vector((v.co.x * BX, v.co.y * BY, v.co.z * 4.0 - 2.0))
    for f in bm.faces: f.material_index = 0
    me = bpy.data.meshes.new(praefix + "_boden"); bm.to_mesh(me); bm.free(); me.materials.append(M["grund"]); me.materials.append(M["tinte"])
    platte = bpy.data.objects.new(praefix + "_boden", me); sammlung.objects.link(platte); platte.location = (ox, oy, 0); kontur(platte, 1.2, 1)
    n = anzahl or int(BX * BY * 12000 / (443.0 * 443.0)); V, F, MI = [], [], []
    for i in range(n):
        a = random.uniform(0, math.tau); p = random.uniform(-0.09, 0.09)
        halm(V, F, MI, farbe(BODEN_GEW), Vector((random.uniform(-BX / 2 + 8, BX / 2 - 8), random.uniform(-BY / 2 + 8, BY / 2 - 8), random.uniform(0.3, 2.4))),
             Vector((math.cos(a), math.sin(a), math.tan(p))), random.uniform(16, 34), random.uniform(1.5, 2.3), 1, 0.04, random.uniform(-0.5, 0.5))
    mu = mesh_objekt(praefix + "_muster", V, F, MI, sammlung, M["halme"]); mu.location = (ox, oy, 0)
    return platte, mu

def verteilen(BX, BY, radien, seed=3, runden=25, jitter=0.22, ziel=0.90):
    """Gleichmäßig und trotzdem zufällig über die Fläche BX × BY verteilen (Lloyd-Verteilung, danach zufälliges Verrücken).
    Die Haufen werden so weit vergrößert (Radius, nicht Höhe), bis mindestens ziel (0–1) der Fläche bedeckt ist. Gibt Positionen, Radien und Bedeckung zurück."""
    import numpy as np
    rng = np.random.default_rng(seed); R0 = np.array(radien, dtype=float); K = len(R0); Z = 6.0
    xs = -BX / 2 + (np.arange(int(BX / Z)) + 0.5) * Z; ys = -BY / 2 + (np.arange(int(BY / Z)) + 0.5) * Z; cells = np.array([(x, y) for x in xs for y in ys])
    def bed(pos, R): d = np.hypot(cells[:, None, 0] - pos[None, :, 0], cells[:, None, 1] - pos[None, :, 1]) - R[None, :] * 0.85; return float((d.min(1) <= 0).mean())
    f = 1.0
    while True:
        R = R0 * f; pos = rng.uniform(-1, 1, (K, 2)) * np.array([BX, BY]) * 0.45
        for _ in range(runden):
            d = np.hypot(cells[:, None, 0] - pos[None, :, 0], cells[:, None, 1] - pos[None, :, 1]) - R[None, :] * 0.7; n = d.argmin(1)
            for k in range(K):
                m = n == k
                if m.any(): lx, ly = BX / 2 - R[k] * 0.45, BY / 2 - R[k] * 0.45; c = 0.5 * pos[k] + 0.5 * cells[m].mean(0); pos[k] = [max(-lx, min(lx, c[0])), max(-ly, min(ly, c[1]))]
        lim = np.stack([BX / 2 - R * 0.45, BY / 2 - R * 0.45], 1); pos = np.clip(pos + rng.uniform(-jitter, jitter, (K, 2)) * R[:, None], -lim, lim)
        b = bed(pos, R)
        if b >= ziel or f > 1.6: return pos, R, b
        f += 0.05

def huelle_xy(objekte, rand=1.5, zmax=None):
    """Umriss (konvexe Hülle in der Draufsicht, Weltkoordinaten) einer Gruppe von Objekten, um rand Einheiten nach außen versetzt. Gibt Liste von (x, y) zurück."""
    import numpy as np
    pts = []
    for o in objekte:
        if o.type != "MESH": continue
        M = np.array(o.matrix_world); v = np.empty(len(o.data.vertices) * 3); o.data.vertices.foreach_get("co", v); v = v.reshape(-1, 3)
        w = v @ M[:3, :3].T + M[:3, 3]
        if zmax is not None: w = w[w[:, 2] <= zmax]
        pts.extend(map(tuple, w[:, :2]))
    P = sorted(set((round(x, 2), round(y, 2)) for x, y in pts))
    kreuz = lambda o, p, q: (p[0] - o[0]) * (q[1] - o[1]) - (p[1] - o[1]) * (q[0] - o[0])
    unten, oben = [], []
    for p in P:
        while len(unten) >= 2 and kreuz(unten[-2], unten[-1], p) <= 0: unten.pop()
        unten.append(p)
    for p in reversed(P):
        while len(oben) >= 2 and kreuz(oben[-2], oben[-1], p) <= 0: oben.pop()
        oben.append(p)
    H = unten[:-1] + oben[:-1]; cx = sum(p[0] for p in H) / len(H); cy = sum(p[1] for p in H) / len(H)
    out = []
    for x, y in H:
        d = math.hypot(x - cx, y - cy) or 1.0; out.append((x + (x - cx) / d * rand, y + (y - cy) / d * rand))
    return out

def freihalten(stroh_objekte, hindernisse, rand=1.5):
    """Dome 2.11.: Stroh (Ebene 2) geht nie in andere Objekte hinein, nur bis ran. Löscht alle Flächen der Stroh-Objekte, die mit einem Punkt innerhalb des Umrisses
    (Draufsicht, +rand) eines Hindernisses liegen. hindernisse: Liste von Objektgruppen (je Gruppe ein Umriss, z. B. Eimer, Heuhaufen). Gibt die Zahl der gelöschten Flächen zurück."""
    import numpy as np
    polys = [huelle_xy(g, rand) for g in hindernisse]
    def innen(P, pts):   # Punkte im konvexen Polygon (Hülle gegen den Uhrzeigersinn)
        ok = np.ones(len(pts), dtype=bool); n = len(P)
        for i in range(n):
            (x1, y1), (x2, y2) = P[i], P[(i + 1) % n]
            ok &= (x2 - x1) * (pts[:, 1] - y1) - (y2 - y1) * (pts[:, 0] - x1) >= 0
        return ok
    geloescht = 0
    for o in stroh_objekte:
        if o.type != "MESH" or not len(o.data.polygons): continue
        M = np.array(o.matrix_world); v = np.empty(len(o.data.vertices) * 3); o.data.vertices.foreach_get("co", v); v = v.reshape(-1, 3)
        w = (v @ M[:3, :3].T + M[:3, 3])[:, :2]; drin = np.zeros(len(w), dtype=bool)
        for P in polys: drin |= innen(P, w)
        if not drin.any(): continue
        bm = bmesh.new(); bm.from_mesh(o.data); bm.verts.ensure_lookup_table()
        weg = [f for f in bm.faces if any(drin[vv.index] for vv in f.verts)]
        bmesh.ops.delete(bm, geom=weg, context="FACES"); bmesh.ops.delete(bm, geom=[vv for vv in bm.verts if not vv.link_faces], context="VERTS")
        bm.to_mesh(o.data); bm.free(); o.data.update(); geloescht += len(weg)
    return geloescht
