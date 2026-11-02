# Strohpellets-Boxenböden A–E (Dome 2.11.2026, Fotos Strohpellets): Kopie von strohboxenboden-<a–e>-<Maß>.blend (Original bleibt), Pellets statt Halme:
# kleine Zylinder (≈ 6–7 mm dick, 8–25 mm lang, hellbeige), dichte körnige Schicht, niedrige Haufen (≈ 10/8/6 cm). Die Pellets zerfallen mit der Mistigkeit zu Krümeln:
# jedes Pellet hat eine Zerfallsstufe (1, 2 oder 3); Objekte heißen dafür …__bis<N> (Pellets, sichtbar bis Mistigkeit N) und …__ab<N> (Krümel, sichtbar ab Mistigkeit N).
# Ergebnis: blender/pelletsboxenboden-<a–e>-<Maß>.blend.   Aufruf: blender -b --python blender/pelletsboxenboden-speichern.py -- <Projektordner> [a b …]
import bpy, sys, math, random, json
from mathutils import Vector
import numpy as np
_a = sys.argv[sys.argv.index("--") + 1:]; PROJ = _a[0]; NUR = _a[1:] or list("abcde")
exec(open(f"{PROJ}/blender/strohlib.py").read(), globals())
PELLET = [(226, 207, 170), (210, 186, 144), (236, 221, 187), (194, 167, 124), (178, 148, 106)]   # hellbeige, sandbraun, blass, dunkler, selten dunkelbraun (Fotos 1–3)
GEW = [28, 30, 22, 14, 6]
KRUEMEL = [(214, 190, 148), (222, 200, 160), (206, 180, 138), (190, 162, 118), (232, 214, 180)]   # Sand wie im Dome-Foto: cremig-hell, 3 = weiche Schattentöne, 4 = ganz helle Stellen; wird mit der Mistigkeit dunkler
KMP = 1.0   # TEST (Dome 2.11.): Haufenhöhen wie beim Stroh 18 / 14 / 10 cm; vorher 10.0 / 18.0 = 10 / 7,8 / 5,6 cm
ZERFALL = [0.25, 0.25, 0.25]   # Anteil, der ab Mistigkeit 1 / 2 / 3 zu Sand wird: 25 % / 50 % / 75 % (kumuliert), die restlichen 25 % bleiben ganze Pellets (Dome 2.11.); frisch gar kein Sand
KR_JE = 4   # Krümel je Pellet: kleine, körnige Teilchen wie grober Sand (Dome)
CELL = 1.5; HMAX = 9.0; W0 = 2.0   # lockerer wie die Späne (Dome 2.11.): höhere Streuhöhe, Pellets liegen unterschiedlich hoch auf und lehnen schräg an   # Höhenraster, höchste Streuhöhe über der Platte, Plattenoberseite
def pellet(V, F, MI, mi, p, r, L, w):   # Dachprisma (Dreiecksquerschnitt) mit zwei Stirnflächen, 6 gemeinsame Punkte
    r = r.normalized(); s = r.cross(Vector((0, 0, 1)))
    s = s.normalized() if s.length > 0.05 else Vector((1, 0, 0)); n = s.cross(r).normalized()
    if n.z < 0: n = -n
    k = len(V)
    for t in (0.0, 1.0):
        c = p + r * (L * t); V.extend([(c - s * w / 2)[:], (c + s * w / 2)[:], (c + n * w * 0.8)[:]])
    F.extend([(k, k + 2, k + 5, k + 3), (k + 2, k + 1, k + 4, k + 5), (k, k + 1, k + 2), (k + 3, k + 5, k + 4)]); MI.extend([mi] * 4)
def kruemel(V, F, MI, mi, c, r, L, w, z0):   # KR_JE kleine Dreiecke dort, wo das Pellet lag (leicht tiefer, unregelmäßig)
    r = r.normalized()
    for _ in range(KR_JE):
        t = random.uniform(-0.35 * L, 1.35 * L); q = c + r * t + Vector((random.uniform(-w, w) * 1.5, random.uniform(-w, w) * 1.5, 0)); q.z = z0 + random.uniform(-0.1, 0.6)   # locker: breiter gestreut und unterschiedlich hoch (Dome: leichter = weniger dicht)
        sz = random.uniform(0.35, 0.7); a = random.uniform(0, math.tau); k = len(V)
        for j in range(3):
            aa = a + j * math.tau / 3 + random.uniform(-0.5, 0.5); rr = sz * random.uniform(0.5, 0.9)
            V.append((q.x + math.cos(aa) * rr, q.y + math.sin(aa) * rr, q.z + random.uniform(-0.12, 0.18)))
        F.append((k, k + 1, k + 2)); MI.append(mi)
def fraktal(nx, ny, skalen, gew, rng):   # unregelmäßiges, mehrstufiges Wertrauschen (kein Wellenmuster): weiche Übergänge, aber nie gleichmäßig
    out = np.zeros((nx, ny))
    for sk, g in zip(skalen, gew):
        gx = int(nx / sk) + 3; gy = int(ny / sk) + 3; R = rng.random((gx, gy)); xs = np.arange(nx) / sk; ys = np.arange(ny) / sk
        ix = xs.astype(int); iy = ys.astype(int); fx = xs - ix; fy = ys - iy; fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy)
        a = R[ix][:, iy]; b = R[ix + 1][:, iy]; c = R[ix][:, iy + 1]; d = R[ix + 1][:, iy + 1]
        out += g * ((a * (1 - fx)[:, None] + b * fx[:, None]) * (1 - fy)[None, :] + (c * (1 - fx)[:, None] + d * fx[:, None]) * fy[None, :])
    return out / sum(gew)
class Gruppen:   # sammelt Pellets (nach Zerfallsstufe) und Krümel (nach Zerfallsstufe) getrennt
    def __init__(s, mp, mk): s.mp = mp; s.mk = mk; s.p = {d: ([], [], []) for d in (1, 2, 3, 4)}; s.k = {d: ([], [], []) for d in (1, 2, 3, 4)}; s.n = 0
    def neu(s, pos, r, L, w, z0, d=None, kr=True):   # d = Zerfallsstufe (Ebene 1: aus dem Feld), kr = Krümel-Dreiecke dazu (nur an Haufen; der Boden bekommt eine Sandschicht)
        d = d or random.choices((1, 2, 3, 4), ZERFALL + [1.0 - sum(ZERFALL)])[0]   # 4 = zerfällt nie
        mi = random.choices(range(5), GEW)[0]; V, F, MI = s.p[d]; pellet(V, F, MI, mi, pos, r, L, w); s.n += 1
        if not kr: return
        V, F, MI = s.k[d]; kruemel(V, F, MI, random.choices(range(5), GEW)[0], pos + r.normalized() * (L / 2), r, L / 2, w, z0)
    def objekte(s, name, sam, loc):
        for d in (1, 2, 3, 4):
            V, F, MI = s.p[d]
            if F: mesh_objekt(f"{name}_p__bis{d - 1}", V, F, MI, sam, s.mp).location = loc
            V, F, MI = s.k[d]
            if F and d < 4: mesh_objekt(f"{name}_k__ab{d}", V, F, MI, sam, s.mk).location = loc
for j, (name, mass) in enumerate([("a", "3x3"), ("b", "3x4"), ("c", "4x4"), ("d", "4x5"), ("e", "5x5")]):
    if name not in NUR: continue
    bpy.ops.wm.open_mainfile(filepath=f"{PROJ}/blender/strohboxenboden-{name}-{mass}.blend")
    for i, c in enumerate(PELLET):
        m = mat(f"pellet_{i}", c); cc = tuple(srgb(x) for x in c) + (1,); m.diffuse_color = cc; m.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = cc
    for i, c in enumerate(KRUEMEL):
        m = mat(f"pellet_kr_{i}", c); cc = tuple(srgb(x) for x in c) + (1,); m.diffuse_color = cc; m.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = cc
    mp = [bpy.data.materials[f"pellet_{i}"] for i in range(5)]; mk = [bpy.data.materials[f"pellet_kr_{i}"] for i in range(5)]
    grund = mat("pellet_grund", (178, 150, 110)); haufenm = mat("pellet_haufen_koerper", (182, 154, 114))   # Lücken zwischen den Pellets sind dunkel wie Schatten (heller wirkten sie wie Sand, Dome)
    P = "box" + name.upper(); b = bpy.data.objects[f"{P}_boden"]; b.data.materials[0] = grund
    BX = max(v.co.x for v in b.data.vertices) * 2; BY = max(v.co.y for v in b.data.vertices) * 2
    ks = []; R0 = []
    for k in range(1, 1000):
        ko = bpy.data.objects.get(f"{P}_haufen_{k:02d}_koerper")
        if not ko: break
        xs = [v.co.x for v in ko.data.vertices]; ys = [v.co.y for v in ko.data.vertices]
        for md in [m_ for m_ in ko.modifiers if m_.name == "kontur"]: ko.modifiers.remove(md)   # keine schwarze Kontur am Haufenkörper (schimmerte zwischen den Pellets durch, Dome)
        ko["r0"] = max(abs(min(xs)), max(xs)); ko["ry0"] = max(abs(min(ys)), max(ys)); ko.data.materials[0] = haufenm; ks.append(ko); R0.append(max(ko["r0"], ko["ry0"]))
    pos, R, bed = verteilen(BX, BY, R0, seed=42 + j, ziel=0.995)
    sam = bpy.data.objects[f"{P}_muster"].users_collection[0]; loc0 = bpy.data.objects[f"{P}_boden"].location.copy()
    random.seed(11 + j); hg = {}
    hh = lambda x, y: hg.get((int(x // CELL), int(y // CELL)), W0)
    def hset(x, y, v):
        kk = (int(x // CELL), int(y // CELL))
        if v > hg.get(kk, W0): hg[kk] = v
    SZ = 1.0; NXS = int(BX / SZ); NYS = int(BY / SZ); rngs = np.random.default_rng(900 + j); pf = [random.uniform(0, math.tau) for _ in range(6)]
    gx_, gy_ = np.meshgrid(np.arange(NXS) * SZ - BX / 2 + SZ / 2, np.arange(NYS) * SZ - BY / 2 + SZ / 2, indexing="ij")
    lf = fraktal(NXS, NYS, [70, 31, 14, 6, 3], [1.0, 0.9, 0.7, 0.6, 0.5], rngs)   # unregelmäßige Flecken mit ausgefransten Rändern (Dome: nicht symmetrisch, an den Rändern verwischt)
    score = 0.78 * (lf - lf.min()) / (lf.max() - lf.min()) + 0.22 * rngs.random((NXS, NYS)); q1, q2, q3 = np.quantile(score, [ZERFALL[0], ZERFALL[0] + ZERFALL[1], sum(ZERFALL)])
    dfeld = np.where(score < q1, 1, np.where(score < q2, 2, np.where(score < q3, 3, 4)))   # Zerfallsstufe je Zelle
    dvon = lambda x, y: int(dfeld[min(NXS - 1, max(0, int((x + BX / 2) / SZ))), min(NYS - 1, max(0, int((y + BY / 2) / SZ)))])
    cover = np.zeros((int(BX / 0.5) + 2, int(BY / 0.5) + 2), dtype=bool); G1 = Gruppen(mp, mk)
    def lege(x, y):   # ein Pellet fällt auf das, was darunter liegt (beide Enden auf der Platte, nichts hängt über, kaum geneigt)
        L = 1.0 + 2.3 * random.random() ** 1.4; w = random.uniform(0.76, 0.9)
        for _ in range(10):
            a = random.uniform(0, math.tau); dx, dy = math.cos(a) * L / 2, math.sin(a) * L / 2
            if abs(x + dx) <= BX / 2 - 1 and abs(x - dx) <= BX / 2 - 1 and abs(y + dy) <= BY / 2 - 1 and abs(y - dy) <= BY / 2 - 1: break
        else: return
        pts = [(x - dx, y - dy), (x, y), (x + dx, y + dy)]; h0, hm, h1 = [hh(px, py) for px, py in pts]
        lock_ = random.uniform(0.0, 1.3) ** 1.3   # locker: manche liegen höher auf (kleine Hohlräume), manche lehnen schräg an anderen
        zs = min(max(h0, hm) + 0.05 + lock_ * random.random(), W0 + HMAX); ze = min(max(h1, hm) + 0.05 + lock_ * random.random(), W0 + HMAX)
        if ze - zs > 0.7 * L: zs = ze - 0.7 * L
        if zs - ze > 0.7 * L: ze = zs - 0.7 * L
        G1.neu(Vector((x - dx, y - dy, zs)), Vector((math.cos(a), math.sin(a), (ze - zs) / L)), L, w, (zs + ze) / 2, dvon(x, y), False)
        for (px, py), zz in zip(pts, (zs, (zs + ze) / 2, ze)): hset(px, py, zz + 0.8)
        for q in (0.0, 0.25, 0.5, 0.75, 1.0):
            cx_ = int((x - dx + 2 * dx * q + BX / 2) / 0.5); cy_ = int((y - dy + 2 * dy * q + BY / 2) / 0.5); cover[cx_:cx_ + 2, cy_:cy_ + 2] = True
    # Ebene 1: Raster (jede Zelle ein Pellet, zufällige Richtung) deckt die Platte, danach Zufall bis zur Zielfläche (Höhen entstehen durch Stapeln)
    GR = 1.12
    for gx in np.arange(-BX / 2 + 2, BX / 2 - 1, GR):
        for gy in np.arange(-BY / 2 + 2, BY / 2 - 1, GR): lege(gx + random.uniform(-0.6, 0.6), gy + random.uniform(-0.6, 0.6))
    for _ in range(int(BX * BY / 6.0)):
        x, y = random.uniform(-BX / 2 + 2, BX / 2 - 2), random.uniform(-BY / 2 + 2, BY / 2 - 2); lege(x, y)
    for _ in range(40):   # Lücken füllen (Dome: dunkle Flächen ohne Pelletstruktur): wo noch nichts liegt, kommt ein Pellet hin
        leer = np.argwhere(~cover[4:-4, 4:-4])
        if len(leer) < 20: break
        for ix_, iy_ in leer[np.random.default_rng(len(leer)).permutation(len(leer))[:max(20, len(leer) // 6)]]: lege((ix_ + 4) * 0.5 - BX / 2 + random.uniform(-0.2, 0.2), (iy_ + 4) * 0.5 - BY / 2 + random.uniform(-0.2, 0.2))
    inn = cover[4:-4, 4:-4]; print("Ebene 1: Pellets", G1.n, "Bedeckung", round(float(inn.mean()), 4))
    json.dump({"cell": CELL, "hg": [[k_[0], k_[1], round(v, 2)] for k_, v in hg.items()]}, open(f"{PROJ}/blender/testseiten/boxenboden/hoehe-pellets-{name}.json", "w"))
    alt = bpy.data.objects[f"{P}_muster"]; bpy.data.objects.remove(alt, do_unlink=True); G1.objekte(f"{P}_muster", sam, loc0)
    # Sandschicht (Dome 2.11.: ab Mistigkeit 2/3 geht die Pelletform verloren, sandartig): feines Gitter (1 Einheit ≈ 8 mm) mit Zufallsfarben und rauer Höhe, je Zerfallsstufe ein Objekt (sichtbar ab Stufe d)
    vz = {}; HN = fraktal(NXS + 2, NYS + 2, [55, 24, 11, 5], [1.0, 0.8, 0.6, 0.4], rngs); CN = fraktal(NXS, NYS, [45, 19, 8, 4], [1.0, 0.8, 0.6, 0.5], rngs); cq = np.quantile(CN, [0.2, 0.5, 0.8])
    def vh(ix, iy):   # Hügel und Mulden (Foto 5): große Wellen + mittlere Klumpen + Zufall + einzelne tiefe Löcher
        if (ix, iy) not in vz:
            x = ix * SZ - BX / 2; y = iy * SZ - BY / 2
            w_ = (HN[min(ix, NXS + 1), min(iy, NYS + 1)] - 0.5) * 2.6   # Hügel und Mulden aus Rauschen (keine Wellen)
            z_ = max(W0 + 0.3, hh(x, y) - 0.4) + 0.45 * w_ + random.uniform(-0.03, 0.03)   # der Sand liegt auf der Höhe der Pelletschicht (sonst schweben lose Pellets und Haufen darüber, Dome: Schwerkraft)
            vz[(ix, iy)] = max(W0 + 0.15, z_)
        return vz[(ix, iy)]
    for d in (1, 2, 3):
        idx = {}; V = []; F = []; MI = []
        for ix in range(NXS):
            for iy in range(NYS):
                if dfeld[ix, iy] != d: continue
                q = []
                for (a, b_) in ((ix, iy), (ix + 1, iy), (ix + 1, iy + 1), (ix, iy + 1)):
                    if (a, b_) not in idx: idx[(a, b_)] = len(V); V.append((a * SZ - BX / 2, b_ * SZ - BY / 2, vh(a, b_)))
                    q.append(idx[(a, b_)])
                cv = CN[min(ix, NXS - 1), min(iy, NYS - 1)] + random.uniform(-0.09, 0.09)   # Ton aus Rauschen plus Körnung: weiche, unregelmäßige Übergänge
                F.append(tuple(q)); MI.append(3 if cv < cq[0] else 4 if cv > cq[2] else 0 if cv < cq[1] else 1)
        if F: mesh_objekt(f"{P}_muster_k__ab{d}", V, F, MI, sam, mk).location = loc0
    print("Sandzellen:", int((dfeld == 1).sum()), int((dfeld == 2).sum()), int((dfeld == 3).sum()), "bleiben Pellets:", int((dfeld == 4).sum()))
    for i, ko in enumerate(ks):
        f = R[i] / R0[i]; ko.location = (pos[i][0], pos[i][1], 0); ko.scale = (f, f, 1)
        for v in ko.data.vertices: v.co.z *= KMP
        ph = [random.Random(31 * (i + 1) + q + 100 * j).uniform(0, math.tau) for q in range(3)]; zs_ = [v.co.z for v in ko.data.vertices]; zlo, zhi = min(zs_), max(zs_)
        LX, LY = BX / 2 - 2, BY / 2 - 2; kl = lambda w_, g: max(-g, min(g, w_))
        def warp(x, y, t, ph):   # Haufen laufen unregelmäßig aus
            a = math.atan2(y, x); s = (1 + 0.22 * math.sin(2 * a + ph[0]) + 0.16 * math.sin(3 * a + ph[1]) + 0.10 * math.sin(5 * a + ph[2])) * (1 + 0.3 * t * t)
            return x * s, y * s
        for v in ko.data.vertices:
            v.co.x, v.co.y = warp(v.co.x, v.co.y, 1 - (v.co.z - zlo) / max(1e-6, zhi - zlo), ph)
            v.co.x = (kl(pos[i][0] + f * v.co.x, LX) - pos[i][0]) / f; v.co.y = (kl(pos[i][1] + f * v.co.y, LY) - pos[i][1]) / f
        k = i + 1; r = ko["r0"] * f; ry = ko["ry0"] * f; kuppel = max(v.co.z for v in ko.data.vertices) - 1.5 * KMP
        random.seed(7000 + 100 * j + k); G = Gruppen(mp, mk)
        NP_ = max(8, int(r * ry * 3.0))
        for ip_ in range(NP_):   # Pellets auf der Haufenfläche gleichmäßig verteilt (Sonnenblumen-Muster, weniger Lücken), liegen entlang der Hangfläche
            th = math.asin(min(1.0, math.sqrt((ip_ + 0.5) / NP_) * 0.95)); w_ = ip_ * 2.399963 + random.uniform(-0.35, 0.35)
            p = Vector((r * math.sin(th) * math.cos(w_), ry * math.sin(th) * math.sin(w_), kuppel * math.cos(th) + 1.5 * KMP))
            px_, py_ = warp(p.x, p.y, 1 - min(1, max(0, (p.z - 1.5 * KMP) / kuppel)), ph); p = Vector((kl(pos[i][0] + px_, LX) - pos[i][0], kl(pos[i][1] + py_, LY) - pos[i][1], p.z))
            nrm = normiert(Vector((math.sin(th) * math.cos(w_) / r, math.sin(th) * math.sin(w_) / ry, math.cos(th) / kuppel)))
            zu = Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1))); tang = normiert(zu - nrm * zu.dot(nrm))
            rc_ = normiert(tang + nrm * random.uniform(-0.05, 0.1))
            zmax2_ = 0.8 if random.random() < 0.1 else 0.5   # einzelne stehen schräg nach oben, die meisten liegen
            if rc_.z > zmax2_ or rc_.z < -0.4:
                hr_ = Vector((rc_.x, rc_.y, 0)); hr_ = hr_.normalized() if hr_.length > 1e-6 else Vector((1, 0, 0)); zc_ = max(-0.4, min(zmax2_, rc_.z)); rc_ = hr_ * math.sqrt(1 - zc_ * zc_) + Vector((0, 0, zc_))
            Lp = 1.0 + 2.3 * random.random() ** 1.4; G.neu(p + nrm * (0.1 + random.uniform(0.0, 0.9)) - rc_ * (Lp / 2), rc_, Lp, random.uniform(0.76, 0.9), p.z)
        for _ in range(int(r * ry * 0.3)):   # lose Pellets rund um den Haufen, liegen auf der Streu (Höhenraster)
            a_ = random.uniform(0, math.tau); rr = random.uniform(0.95, 1.6); x_, y_ = warp(r * rr * math.cos(a_), ry * rr * math.sin(a_), 1, ph); b_ = random.uniform(0, math.tau)
            if abs(pos[i][0] + x_) > LX or abs(pos[i][1] + y_) > LY: continue
            Lp = 1.0 + 2.3 * random.random() ** 1.4; zz = hh(pos[i][0] + x_, pos[i][1] + y_) + 0.1
            G.neu(Vector((x_, y_, zz)), Vector((math.cos(b_), math.sin(b_), 0.0)), Lp, random.uniform(0.76, 0.9), zz)
        alt_ = bpy.data.objects.get(f"{P}_haufen_{k:02d}_halme")
        if alt_: bpy.data.objects.remove(alt_, do_unlink=True)   # die Strohhalme der Vorlage entfallen
        G.objekte(f"{P}_haufen_{k:02d}", ko.users_collection[0], (pos[i][0], pos[i][1], 0))
    ziel = f"{PROJ}/blender/pelletsboxenboden-{name}-{mass}.blend"; bpy.context.preferences.filepaths.save_version = 0; bpy.ops.wm.save_as_mainfile(filepath=ziel, compress=True)
    print("GESPEICHERT", ziel.split("/")[-1], "Haufen:", len(ks), "Bedeckung Haufen:", round(bed, 4))
