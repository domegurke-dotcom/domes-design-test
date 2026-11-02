# Heuhaufen aus reinem Heu (kein Futterstroh, kein Staub) in Blender – nach Pros Testseite blender/testseiten/heuhaufen.html:
# gleicher Haufenkörper (heuhaufen_koerper aus heunetz.blend) und dieselbe Halmverteilung (4300 liegen am Hang, 800 ragen an den Spitzen heraus, 400 liegen lose rundum),
# Halm-Vorlagen halm_heu_gruen / _oliv / _braun (50 / 25 / 25 %), Haufenfarbe wie „Nur Heu“ (#55601f).
# Läuft im offenen Blender-Fenster (werkzeuge/blender-senden.js) oder in einer geladenen Datei. Vor dem Lauf kann POS = (x, y, z) gesetzt sein.
import bpy, math, random
from mathutils import Vector, Matrix, Quaternion

QUELLE = "C:/Users/dome_/Documents/Projekt Pferdespiel/domes-design-test-git/blender/heunetz.blend"
POS = globals().get("POS", (50.0, 110.0, 2.0))   # z = 2,0: der Haufen liegt auf Ebene 1 der Einstreu (Halme dort bis etwa z = 2,7), nicht auf der Grundplatte
DICHTE_HEU = 60.0      # kg je m³ lose geschüttetes Heu (Schätzung)
VOL0_M3 = 0.0250       # Volumen von Pros Originalhaufen (Maßstab 1 Einheit = 0,79 cm, per Integral der Höhenfunktion gerechnet)
# Größe nach Menge (Dome 1.11.): TAGESMENGE_KG = Raufutter-Tagesmenge aus dem Futterplan → Skalierung = Kubikwurzel(Volumen / Originalvolumen), Volumen = kg / Dichte.
# Ohne TAGESMENGE_KG gilt SKALA (Dome 1.11.: dreimal so groß wie das Original; entspricht bei dieser Dichte etwa 40 kg).
TAGESMENGE_KG = globals().get("TAGESMENGE_KG")
SKALA = ((TAGESMENGE_KG / DICHTE_HEU / VOL0_M3) ** (1 / 3)) if TAGESMENGE_KG else globals().get("SKALA", 3.0)
random.seed(26102026)
R = random.random
AX, AY = 50, 31
GIPFEL = [(7, 0, 25, 13, 15), (-16, 3, 17, 17, 14), (-36, 0, 6, 11, 10)]   # (x, y, Höhe, Breite x, Breite y): Spitze rechts, lange flache Seite links
def einzel(x, y):
    re = math.hypot(x / AX, y / AY)
    if re >= 1: return 0.0
    f = (1 - re * re) ** 0.55
    h = sum(a * math.exp(-((x - cx) ** 2 / (2 * sx * sx) + (y - cy) ** 2 / (2 * sy * sy))) for cx, cy, a, sx, sy in GIPFEL)
    return h * f * (1 + 0.07 * math.sin(0.5 * x + 2 * math.cos(0.4 * y)))
KX, KY, KS, KW = 22, -20, 0.62, 0.6   # zweiter, kleiner Haufen vorne rechts
def hoehe(x, y):
    h1 = einzel(x, y); h2 = KS * einzel((x - KX) / KS, (y - KY) / KS)
    if h1 <= 0 and h2 <= 0: return 0.0
    return math.log(math.exp(KW * h1) + math.exp(KW * h2) - 1) / KW
def nahe(x, y, f): return math.hypot(x / AX, y / AY) < f or math.hypot((x - KX) / (AX * KS), (y - KY) / (AY * KS)) < f
def zufall_punkt(f):
    while True:
        x, y = -52 + 108 * R(), -44 + 76 * R()
        if nahe(x, y, f): return x, y

def platz(art):
    if art == "boden":
        while True:
            x, y = zufall_punkt(1.5)
            if hoehe(x, y) <= 0.5: break
        z = hoehe(x, y) + 0.25; n = Vector((0, 0, 1)); hang = None
    else:
        if art == "ragt" and R() < 0.55:   # Schopf: viele Halme stehen an den beiden Spitzen
            if R() < 0.62: x, y = 7 + (R() + R() - 1) * 13, (R() + R() - 1) * 9
            else: x, y = KX + 7 * KS + (R() + R() - 1) * 7, KY + (R() + R() - 1) * 5
        else:
            while True:
                x, y = zufall_punkt(0.97)
                if hoehe(x, y) >= 0.8: break
        z = hoehe(x, y) + (0.4 if art == "ragt" else 0.5)
        e = 0.6; gx = (hoehe(x + e, y) - hoehe(x - e, y)) / (2 * e); gy = (hoehe(x, y + e) - hoehe(x, y - e)) / (2 * e)
        n = Vector((-gx, -gy, 1)).normalized(); hang = (math.atan2(-gy, -gx), math.hypot(gx, gy)) if art == "liegt" else None   # Halme fließen vom Gipfel nach unten
    a = R() * math.tau
    if hang and hang[1] > 0.05: a = hang[0] + (R() - 0.5) * 1.0
    t = n.cross(Vector((math.cos(a), math.sin(a), 0.3))).normalized(); b = n.cross(t)
    heb = 0.6 + 0.8 * R() if art == "ragt" else (R() - 0.5) * 0.5
    q = Quaternion(b, heb) @ Quaternion(t, (R() - 0.5) * 0.6)
    T, N = q @ t, q @ n
    lang = 0.55 + 0.6 * R(); dick = 0.45 if art == "boden" else 0.42 + 0.2 * R()
    M = Matrix(((T.x, N.cross(T).x, N.x), (T.y, N.cross(T).y, N.y), (T.z, N.cross(T).z, N.z)))   # Halm: x entlang, y quer, z nach oben (Vorlage)
    return M, Vector((x, y, z)), lang, dick

def srgb(x): x = x / 255; return x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4

with bpy.data.libraries.load(QUELLE, link=False) as (von, nach):
    nach.objects = ["heuhaufen_koerper", "halm_heu_gruen", "halm_heu_oliv", "halm_heu_braun"]
V = {o.name: o for o in nach.objects}
for o in [o for o in bpy.data.objects if o.get("heuhaufen_heu")]: bpy.data.objects.remove(o, do_unlink=True)
for c in [c for c in bpy.data.collections if c.name == "Heuhaufen_Heu"]: bpy.data.collections.remove(c)
col = bpy.data.collections.new("Heuhaufen_Heu"); bpy.context.scene.collection.children.link(col)
halter = bpy.data.objects.new("heuhaufen_heu", None); halter.empty_display_type = "PLAIN_AXES"; halter["heuhaufen_heu"] = 1; halter.location = POS; halter.scale = (SKALA, SKALA, SKALA); col.objects.link(halter)
koerper = V["heuhaufen_koerper"]; col.objects.link(koerper); koerper.parent = halter; koerper["heuhaufen_heu"] = 1
basis = koerper.material_slots[0].material; c = tuple(srgb(x) for x in (85, 96, 31)) + (1,)   # Haufenfarbe „Nur Heu“
basis.diffuse_color = c
if basis.node_tree and "Principled BSDF" in basis.node_tree.nodes: basis.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = c

plaetze = [platz("liegt") for _ in range(4300)] + [platz("ragt") for _ in range(800)] + [platz("boden") for _ in range(400)]
sorten = [("gruen", 0.50), ("oliv", 0.25), ("braun", 0.25)]
gruppen = {n: ([], []) for n, _ in sorten}
for M, pos, lang, dick in plaetze:
    w = R(); name = sorten[-1][0]
    for n, a in sorten:
        if w <= a: name = n; break
        w -= a
    vorlage = V["halm_heu_" + name]; verts, faces = gruppen[name]; k = len(verts)
    S = Matrix.Diagonal((lang, dick, dick))
    verts.extend((M @ (S @ p.co) + pos)[:] for p in vorlage.data.vertices)
    faces.extend(tuple(k + i for i in pl.vertices) for pl in vorlage.data.polygons)
for name, (verts, faces) in gruppen.items():
    vorlage = V["halm_heu_" + name]
    me = bpy.data.meshes.new("heu_halme_" + name); me.from_pydata(verts, [], faces); me.update()
    for m in vorlage.data.materials: me.materials.append(m)
    me.polygons.foreach_set("use_smooth", [False] * len(me.polygons))
    o = bpy.data.objects.new("heu_halme_" + name, me); col.objects.link(o); o.parent = halter; o["heuhaufen_heu"] = 1
for n in ("halm_heu_gruen", "halm_heu_oliv", "halm_heu_braun"): bpy.data.objects.remove(V[n], do_unlink=True)
for me in [m for m in bpy.data.meshes if m.users == 0]: bpy.data.meshes.remove(me)
result = {"halme": len(plaetze), "objekte": [o.name for o in col.objects]}
