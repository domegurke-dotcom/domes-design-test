# Müsli-Füllung für den Eimer Stufe 2 (halbrund, flache Rückseite bei y = 0, offene Seite nach -y).
# Nimmt die Müsli-Stücke und Materialien aus blender/eimer-alle.blend (von Pro für den runden Eimer gebaut), baut einen eigenen D-förmigen Haufen
# und streut die Stücke passend dazu. Läuft IM offenen Blender-Fenster (über werkzeuge/blender-senden.js) oder per Wrapper ohne Fenster.
# Vor dem Lauf kann PARENT = "<Name eines Empties>" gesetzt sein (Füllung wandert mit dem Eimer), sonst liegt sie im Ursprung.
import bpy, bmesh, math, random
from mathutils import Vector, Matrix, noise

QUELLE = "C:/Users/dome_/Documents/Projekt Pferdespiel/domes-design-test-git/blender/eimer-alle.blend"
PARENT = globals().get("PARENT")
random.seed(31)
A, TIEFE = 24.4, 34.2            # Innenmaße: Halbachse x, Tiefe nach -y (Wand 1,0 abgezogen)
RIM, RAND_Z, SPITZE_Z = 37.0, 33.6, 34.8   # Oberkante des Eimers, Füllhöhe an der Wand, Füllhöhe in der Mitte – Dome 1.11.: bei Eimer Stufe 2 nie ein Berg, flach und ebenmäßig, unter dem Rand
ANZAHL = {"flocken": 380, "gelb": 250, "orange": 66, "pellets": 250, "rot": 150}   # Dichte wie im runden Eimer (≈ 660 Stücke je 876 Flächeneinheiten), hier ≈ 1,65 × so viel Fläche

def innen(x, y, zuschlag=0.0): return y <= -0.4 and (x / (A + zuschlag)) ** 2 + (y / (TIEFE + zuschlag)) ** 2 <= 1
def hoehe(x, y):
    e = (1 - math.hypot(x / A, y / TIEFE)) * 24    # Abstand zur runden Wand (grob)
    d = min(e, -y - 0.4)                           # Abstand zur flachen Rückwand
    t = max(0.0, min(1.0, d / 14)); t = t * t * (3 - 2 * t)
    return RAND_Z + (SPITZE_Z - RAND_Z) * t + 0.3 * noise.noise(Vector((x * 0.12, y * 0.12, 3.0)))

# Vorlagen aus Pros Datei holen (Objekte bringen ihre Materialien mit)
with bpy.data.libraries.load(QUELLE, link=False) as (von, nach):
    nach.objects = [n for n in von.objects if n.startswith("korn_muesli_") or n == "muesli_haufen"]
vorlagen = {o.name: o for o in nach.objects}
ziel = bpy.data.collections.get("Futtereimer_Stufe2") if PARENT else bpy.context.scene.collection
for c_alt in [c for c in bpy.data.collections if c.name.startswith("Muesli_Stufe2")]: bpy.data.collections.remove(c_alt)
col = bpy.data.collections.new("Muesli_Stufe2"); (ziel or bpy.context.scene.collection).children.link(col)
halter = bpy.data.objects.get(PARENT) if PARENT else None
for o in [o for o in bpy.data.objects if o.name.startswith("muesli_s2_")]: bpy.data.objects.remove(o, do_unlink=True)

def neues_objekt(name, bm, materialien, dicke):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for m in materialien: me.materials.append(m)
    o = bpy.data.objects.new(name, me); col.objects.link(o)
    mod = o.modifiers.new("kontur", "SOLIDIFY"); mod.thickness = dicke; mod.offset = 1; mod.use_flip_normals = True; mod.use_rim = False; mod.material_offset = 1
    if halter: o.parent = halter
    return o

# D-förmiger Haufen (Höhenfeld, in der Mitte höher), Kontur wie bei den anderen Müsli-Teilen
h = vorlagen["muesli_haufen"]; basis, tinte = h.material_slots[0].material, h.material_slots[1].material
S = 1.6; nx, ny = int(2 * A / S) + 2, int(TIEFE / S) + 2
bm = bmesh.new(); gitter = {}
for i in range(nx):
    for j in range(ny):
        x, y = -A + i * S, -TIEFE + j * S
        if innen(x, y, 0.8): gitter[(i, j)] = bm.verts.new((x, y, hoehe(x, y)))
for (i, j) in list(gitter):
    q = [gitter.get((i, j)), gitter.get((i + 1, j)), gitter.get((i + 1, j + 1)), gitter.get((i, j + 1))]
    if all(q):
        f = bm.faces.new(q); f.smooth = False; f.material_index = 0
neues_objekt("muesli_s2_haufen", bm, [basis, tinte], 0.3)

# Stücke streuen (jede Sorte ein Objekt, je zwei Formen als Vorlage)
for sorte, n in ANZAHL.items():
    v0, v1 = vorlagen[f"korn_muesli_{sorte}_0"], vorlagen[f"korn_muesli_{sorte}_1"]
    mat, tt = v0.material_slots[0].material, v0.material_slots[1].material
    bm = bmesh.new(); plaetze = 0
    while plaetze < n:
        x, y = random.uniform(-A + 1.2, A - 1.2), random.uniform(-TIEFE + 1.2, -0.8)
        if not innen(x, y, -1.2): continue
        vor = random.choice((v0, v1)); drehung = Matrix.Rotation(random.uniform(0, math.tau), 3, "Z") @ Matrix.Rotation(random.uniform(-0.45, 0.45), 3, "X") @ Matrix.Rotation(random.uniform(-0.45, 0.45), 3, "Y")
        pos = Vector((x, y, hoehe(x, y) + random.uniform(0.15, 0.55)))
        vv = [bm.verts.new(drehung @ p.co + pos) for p in vor.data.vertices]
        for pl in vor.data.polygons:
            try: f = bm.faces.new([vv[k] for k in pl.vertices]); f.material_index = 0; f.smooth = False
            except ValueError: pass
        plaetze += 1
    neues_objekt(f"muesli_s2_{sorte}", bm, [mat, tt], 0.1)

# Vorlagen aufräumen
for o in list(vorlagen.values()): bpy.data.objects.remove(o, do_unlink=True)
for me in [m for m in bpy.data.meshes if m.users == 0]: bpy.data.meshes.remove(me)
result = {"objekte": [o.name for o in bpy.data.objects if o.name.startswith("muesli_s2_")]}
