# Hanf/Leinstroh statt Stroh (Dome 2.11.2026, Foto Kies König): Der Strohboxenboden A im offenen Fenster bekommt statt der langen Halme kurze, breite Hanfschäben
# (Splitter 1,5–5 cm lang, 0,4–1,1 cm breit, beige/hellbraun/grau, einzelne dunkle). Körper der Haufen und Bodenplatte bleiben, nur Farben ändern sich. Läuft über werkzeug/blender-senden.js.
import bpy, math, random
from mathutils import Vector
exec(open(r"C:\Users\dome_\Documents\domes-design-test-git\blender\strohlib.py").read(), globals())
PRAEFIX = "boxA"
HANF = [(216, 201, 163), (185, 164, 122), (157, 143, 120), (232, 217, 160), (92, 74, 53)]   # beige, hellbraun, grau, blassgelb, dunkelbraun (selten)
GEW = [34, 28, 18, 16, 4]
mh = [mat(f"hanf_{i}", c) for i, c in enumerate(HANF)]
grund = mat("hanf_grund", (160, 142, 108)); haufenm = mat("hanf_haufen_koerper", (200, 182, 142))
def span(): return random.uniform(1.5, 5.0) / E, random.uniform(0.4, 1.1) / E   # Länge, Breite in Einheiten
def splitter(V, F, MI, p, rich, flach=False):
    l, b = span(); halm(V, F, MI, random.choices(range(5), GEW)[0], p, rich, l, b, 1, 0.0, random.uniform(-1.2, 1.2))
def ersetzen(o, mats):
    o.data.materials.clear()
    for m in mats: o.data.materials.append(m)
def neu(name, V, F, MI, mats, loc):
    alt = bpy.data.objects.get(name)
    sam = alt.users_collection[0]; bpy.data.objects.remove(alt, do_unlink=True)
    o = mesh_objekt(name, V, F, MI, sam, mats); o.location = loc; return o
tinte = bpy.data.materials["tinte"]
# Bodenplatte + Haufenkörper umfärben
b = bpy.data.objects[f"{PRAEFIX}_boden"]; BX = max(v.co.x for v in b.data.vertices) * 2; BY = max(v.co.y for v in b.data.vertices) * 2
b.data.materials[0] = grund
# Muster (Ebene 1): viele kleine flache Splitter
random.seed(11); V, F, MI = [], [], []
for i in range(int(BX * BY / 70)):
    a = random.uniform(0, math.tau); splitter(V, F, MI, Vector((random.uniform(-BX / 2 + 4, BX / 2 - 4), random.uniform(-BY / 2 + 4, BY / 2 - 4), random.uniform(0.3, 2.4))), Vector((math.cos(a), math.sin(a), random.uniform(-0.1, 0.1))))
neu(f"{PRAEFIX}_muster", V, F, MI, mh, b.location)
# Haufen
n = 0
for k in range(1, 400):
    kn = f"{PRAEFIX}_haufen_{k:02d}_koerper"; ko = bpy.data.objects.get(kn)
    if not ko: break
    ko.data.materials[0] = haufenm
    xs = [v.co.x for v in ko.data.vertices]; ys = [v.co.y for v in ko.data.vertices]; zs = [v.co.z for v in ko.data.vertices]
    r = max(abs(min(xs)), max(xs)); ry = max(abs(min(ys)), max(ys)); kuppel = max(zs) - 1.5
    random.seed(5000 + k); V, F, MI = [], [], []
    for i in range(int(r * ry * 1.4)):
        th = math.acos(random.random() ** 0.8) * 0.95; w = random.uniform(0, math.tau)
        p = Vector((r * math.sin(th) * math.cos(w), ry * math.sin(th) * math.sin(w), kuppel * math.cos(th) + 1.5))
        nrm = normiert(Vector((math.sin(th) * math.cos(w) / r, math.sin(th) * math.sin(w) / ry, math.cos(th) / kuppel)))
        zu = Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1))); tang = normiert(zu - nrm * zu.dot(nrm))
        splitter(V, F, MI, p + nrm * 0.3, normiert(tang + nrm * random.uniform(0, 0.35)))
    neu(f"{PRAEFIX}_haufen_{k:02d}_halme", V, F, MI, mh, ko.location); n += 1
result = {"haufen": n, "boden": [BX, BY]}
