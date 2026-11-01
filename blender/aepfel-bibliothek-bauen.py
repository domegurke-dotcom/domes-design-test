# Pferdeäpfel-Bibliothek (Dome 2.11.2026): EINE Datei mit allen Äpfeln einzeln und allen Haufen-Varianten, damit das Spiel sie nach Bedarf auf die Einstreu legen kann
# (Einstreu liegt getrennt: <stroh|hanf|spaene>boxenboden-<a–e>-<Maß>[-mistigkeit-<1–3>].blend).
# Inhalt (Sammlungen):
#   Aepfel_Einzeln   – je Pferdegröße (kalt, warm, pony, fohlen) und Apfeltyp (rund, weich, hart) ein Apfel: apfel_<groesse>_<typ>
#   Haufen           – je Pferdegröße HAUFEN_N ganze Haufen (12–20 Äpfel, aufeinander gestapelt, teils ineinander, mit Schwerkraft): haufen_<groesse>_<nr> (Empty mit den Äpfeln als Kinder, Boden bei z = 0)
#   Verstreut        – je Pferdegröße VERSTREUT_N Haufen, die mit der Mistigkeit zerfallen sind (gleiche Äpfel leicht verteilt, einzeln auf dem Boden): verstreut_<groesse>_<nr>
# Größen (Apfelgröße, Kubikwurzel des Gewichts, Warmblut = 1): kalt 1,15 · warm 1,0 · pony 0,8 · fohlen 0,6. Stute mit Fohlen: Haufen der Stutengröße plus Haufen der Fohlengröße.
# Maßstab: 1 Einheit = 0,79 cm wie bei der Einstreu. Origin eines Haufens = Mitte am Boden (z = 0 = Oberfläche der Streu).
# Aufruf: blender -b --python blender/aepfel-bibliothek-bauen.py -- <Projektordner>
import bpy, sys, math, random
from mathutils import Vector
PROJ = sys.argv[sys.argv.index("--") + 1]
GROESSEN = {"kalt": 1.15, "warm": 1.0, "pony": 0.8, "fohlen": 0.6}
TYPEN = ("rund", "weich", "hart"); TW = {"rund": [5, 3, 2], "weich": [2, 7, 1]}   # Typ-Gewichte: normal / Fohlen (meist weich)
HAUFEN_N, VERSTREUT_N = 8, 6

bpy.ops.wm.read_factory_settings(use_empty=True)
vorlage = {}
for t in TYPEN:
    with bpy.data.libraries.load(f"{PROJ}/blender/pferdeapfel-{t}.blend") as (src, dst): dst.objects = list(src.objects)
    vorlage[t] = [o for o in dst.objects if o is not None][0]
def hoehe_grundflaeche(o):   # Ursprung = Mitte der Unterseite; Durchmesser über die Ausdehnung
    xs = [v.co.x for v in o.data.vertices]; ys = [v.co.y for v in o.data.vertices]; zs = [v.co.z for v in o.data.vertices]
    return max(max(xs) - min(xs), max(ys) - min(ys)), min(zs)
GR, ZMIN = hoehe_grundflaeche(vorlage["rund"])   # Apfeldurchmesser (Einheiten)

root = bpy.context.scene.collection
def sammlung(name):
    c = bpy.data.collections.new(name); root.children.link(c); return c
c_ein, c_hau, c_ver = sammlung("Aepfel_Einzeln"), sammlung("Haufen"), sammlung("Verstreut")
# Vorlagen selbst nicht in der Szene lassen
for o in vorlage.values(): o.hide_viewport = o.hide_render = True
def typ_waehlen(R, grname):
    w = TW["weich" if grname == "fohlen" else "rund"]; return random.choices(TYPEN, w)[0]
def neuer_apfel(sam, name, typ, gs, ort, rot, elter=None):
    o = vorlage[typ].copy(); o.name = name; o.hide_viewport = o.hide_render = False; sam.objects.link(o)
    o.scale = (gs, gs, gs); o.location = ort; o.rotation_euler = rot
    if elter: o.parent = elter
    return o
# 1) Einzeläpfel
for gname, gs in GROESSEN.items():
    for t in TYPEN: neuer_apfel(c_ein, f"apfel_{gname}_{t}", t, gs, (0, 0, 0), (0, 0, 0))
# 2) Haufen und verstreute Haufen (Schwerkraft: Apfel liegt auf dem Boden oder auf mindestens zwei Äpfeln darunter, zwischen ihnen)
def haufen_plaetze(gname, gs, k):
    rho = 0.27 * GR * gs; r = GR * gs * (0.55 + 0.045 * k); aep = []
    for _ in range(k):
        for _t in range(120):
            rr = r * random.random() ** 0.8; a = random.uniform(0, math.tau); x, y = math.cos(a) * rr, math.sin(a) * rr
            if not all(math.hypot(q[0] - x, q[1] - y) > GR * gs * 0.2 for q in aep): continue
            zc = rho
            for q in aep:
                d = math.hypot(q[0] - x, q[1] - y)
                if d < 2 * rho: zc = max(zc, q[2] + math.sqrt(4 * rho * rho - d * d))
            if zc > rho + 0.05:
                st = [q for q in aep if math.hypot(q[0] - x, q[1] - y) < 2 * rho and q[2] < zc - 0.1 and abs(q[2] + math.sqrt(4 * rho * rho - math.hypot(q[0] - x, q[1] - y) ** 2) - zc) < 0.2 * rho]
                if len(st) < 2: continue
                if math.hypot(sum(q[0] for q in st) / len(st) - x, sum(q[1] for q in st) / len(st) - y) > 0.8 * rho: continue
            aep.append((x, y, zc)); break
    return [(x, y, zc - rho) for x, y, zc in aep]
def verstreut_plaetze(gname, gs, k):
    aep = []
    for _ in range(k):
        for _t in range(80):
            rr = GR * gs * (0.8 + 2.4 * math.sqrt(random.random())); a = random.uniform(0, math.tau); x, y = math.cos(a) * rr, math.sin(a) * rr
            if all(math.hypot(q[0] - x, q[1] - y) > GR * gs * 0.85 for q in aep): aep.append((x, y, 0.0)); break
    return aep
for gname, gs in GROESSEN.items():
    for n in range(1, HAUFEN_N + VERSTREUT_N + 1):
        ganz = n <= HAUFEN_N; random.seed(1000 * list(GROESSEN).index(gname) + n)
        k = 12 + random.randint(0, 8); sam = c_hau if ganz else c_ver
        name = f"haufen_{gname}_{n}" if ganz else f"verstreut_{gname}_{n - HAUFEN_N}"
        emp = bpy.data.objects.new(name, None); emp.empty_display_type = "PLAIN_AXES"; emp.empty_display_size = GR * gs; sam.objects.link(emp)
        plaetze = haufen_plaetze(gname, gs, k) if ganz else verstreut_plaetze(gname, gs, k)
        for i, (x, y, zb) in enumerate(plaetze):
            typ = typ_waehlen(random, gname); s = gs * (0.9 + 0.2 * random.random()); kipp = 0.9 if ganz else 0.4
            neuer_apfel(sam, f"{name}_apfel_{i + 1:02d}", typ, s, (x, y, zb - 0.3), ((random.random() - .5) * kipp, (random.random() - .5) * kipp, random.uniform(0, math.tau)), emp)
        emp["aepfel"] = len(plaetze); emp["groesse"] = gname; emp["art"] = "ganz" if ganz else "verstreut"
bpy.context.scene["einheit_cm"] = 0.79
ziel = f"{PROJ}/blender/pferdeaepfel-bibliothek.blend"; bpy.ops.wm.save_as_mainfile(filepath=ziel)
print("GESPEICHERT pferdeaepfel-bibliothek.blend", len(c_ein.objects), "Einzeläpfel,", HAUFEN_N * 4, "Haufen,", VERSTREUT_N * 4, "verstreut")
