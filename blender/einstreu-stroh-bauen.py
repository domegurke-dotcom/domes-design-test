# Einstreu Stroh (Boxenboden) in zwei Ebenen – Blender 5.x, läuft ohne Fenster:
#   blender -b --python einstreu-stroh-bauen.py -- <Projektordner> <Vorschau.png>
# Ebene 1: flacher Boden mit Muster aus flach liegenden Halmen (darauf stehen Eimer, Pferd …)
# Ebene 2: kleine, lockere Heuhaufen in verschiedenen Größen (höchstens 2/3 Eimerhöhe)
# Maßstab wie die anderen Modelle: 1 Einheit ≈ 0,79 cm → Box 3,5 × 3,5 m = 443 Einheiten
import bpy, bmesh, math, random, sys
from mathutils import Vector, Matrix

PROJ, VORSCHAU = sys.argv[sys.argv.index("--") + 1], sys.argv[sys.argv.index("--") + 2]
random.seed(23)
bpy.ops.wm.read_factory_settings(use_empty=True)
B = 443.0
wurzel = bpy.data.collections.new("Einstreu_Stroh"); bpy.context.scene.collection.children.link(wurzel)
eb1 = bpy.data.collections.new("Ebene1_Boden"); eb2 = bpy.data.collections.new("Ebene2_Haufen"); wurzel.children.link(eb1); wurzel.children.link(eb2)

def srgb(x): x = x / 255; return x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4
def mat(name, rgb):
    c = tuple(srgb(x) for x in rgb); m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = c + (1,); b.inputs["Roughness"].default_value = 0.8; m.diffuse_color = c + (1,); return m
TINTE = mat("tinte", (0, 0, 0)); TINTE.use_backface_culling = True
GRUND = mat("stroh_grund", (178, 126, 44))
HAUFEN = mat("stroh_haufen_koerper", (222, 170, 74))
HALM = [mat("halm_gold", (236, 190, 86)), mat("halm_hell", (250, 218, 132)), mat("halm_bernstein", (214, 150, 50)), mat("halm_blass", (252, 236, 176)), mat("halm_dunkel", (176, 118, 36))]
GEWICHT = [30, 26, 20, 14, 10]
BODEN_GEW = [28, 8, 30, 4, 30]; HAUFEN_GEW = [18, 38, 8, 32, 4]   # Boden etwas dunkler, Haufen heller – so heben sie sich ab
def farbe(gew=None): return random.choices(range(5), gew or BODEN_GEW)[0]
def kontur(o, dicke, versatz):
    m = o.modifiers.new("kontur", "SOLIDIFY"); m.thickness = dicke; m.offset = 1; m.use_flip_normals = True; m.use_rim = False; m.material_offset = versatz

def halm(bm, mi, basis, richtung, laenge, breite, segmente, haengen, roll):
    """Ein Halm als schmales, leicht gebogenes Band (beidseitig sichtbar). richtung = Laufrichtung, haengen = Durchhang der Spitze."""
    r = richtung.normalized(); s = r.cross(Vector((0, 0, 1)))
    if s.length < 0.05: s = Vector((1, 0, 0))
    s = (Matrix.Rotation(roll, 3, r) @ s.normalized()).normalized()
    reihe = []
    for i in range(segmente + 1):
        t = i / segmente; p = basis + r * laenge * t + Vector((0, 0, -1)) * haengen * laenge * t * t; w = breite * (1 - 0.55 * t) / 2
        reihe.append((bm.verts.new(p - s * w), bm.verts.new(p + s * w)))
    for i in range(segmente):
        a, b = reihe[i]; c, d = reihe[i + 1]
        a2, b2, c2, d2 = (bm.verts.new(v.co) for v in (a, b, c, d))   # eigene Punkte für die Rückseite (bmesh erlaubt keine doppelten Flächen)
        for vs in ((a, b, d, c), (c2, d2, b2, a2)):   # Vorder- und Rückseite
            f = bm.faces.new(vs); f.material_index = mi; f.smooth = False

def objekt(name, bm, sammlung, materialien):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for m in materialien: me.materials.append(m)
    o = bpy.data.objects.new(name, me); sammlung.objects.link(o); return o

# ---------- Ebene 1: flache Grundplatte + flach liegende Halme (Muster) ----------
bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
for v in bm.verts: v.co = Vector((v.co.x * B, v.co.y * B, v.co.z * 4.0 - 2.0))   # Oberseite bei z = 0
for f in bm.faces: f.material_index = 0
platte = objekt("stroh_ebene1_boden", bm, eb1, [GRUND, TINTE]); kontur(platte, 1.2, 1)
bm = bmesh.new()
for i in range(12000):
    a = random.uniform(0, math.tau); p = random.uniform(-0.09, 0.09)
    halm(bm, farbe(BODEN_GEW), Vector((random.uniform(-B / 2 + 8, B / 2 - 8), random.uniform(-B / 2 + 8, B / 2 - 8), random.uniform(0.3, 2.4))),
         Vector((math.cos(a), math.sin(a), math.tan(p))), random.uniform(16, 34), random.uniform(1.5, 2.3), 1, 0.04, random.uniform(-0.5, 0.5))
muster = objekt("stroh_ebene1_muster", bm, eb1, HALM)

# ---------- Ebene 2: kleine, lockere Heuhaufen in verschiedenen Größen (keine Grasbüschel) ----------
# Höhe nie über 2/3 der Eimerhöhe (Eimer Stufe 1, auf 12 Liter skaliert: 32,4 Einheiten → höchstens 21,6). Die Halme liegen kreuz und quer auf der Haufenform, lose abgehoben.
EIMER_H = 28.8 * 1.126; MAX_H = EIMER_H * 2 / 3   # Eimer Stufe 1 auf 12 Liter vergrößert (Skala 1,126, Füllgrenze 12 Liter) → Höhe 32,4, Grenze 21,6
GROESSEN = [(14, 22, 0.30), (24, 36, 0.45), (40, 56, 0.25)]   # (Radius von, bis, Anteil) – kleine, mittlere, große Haufen
# Dome 1.11.: die Haufen so anordnen, dass kaum Freifläche bleibt. Rasterzellen (8 Einheiten) zeigen, was noch frei ist; jeder neue Haufen kommt auf eine freie Stelle
# (Haufen dürfen ineinander übergehen), bis höchstens 3 % frei sind. Am Rand werden die Haufen kleiner, damit sie nicht über die Platte ragen.
ZELLE = 8.0; NZ = int(B / ZELLE)
frei = {(i, j) for i in range(NZ) for j in range(NZ)}
def zentrum(i, j): return (-B / 2 + (i + 0.5) * ZELLE, -B / 2 + (j + 0.5) * ZELLE)
orte = []
while len(frei) > 0.03 * NZ * NZ and len(orte) < 170:
    i, j = random.choice(sorted(frei)); x, y = zentrum(i, j)
    rmin, rmax, _ = random.choices(GROESSEN, [g[2] for g in GROESSEN])[0]
    r = random.uniform(rmin, rmax)
    rand_abstand = B / 2 - max(abs(x), abs(y))                      # Abstand der Zelle zum Plattenrand
    r = max(10.0, min(r, 1.8 * rand_abstand + 10))
    x = max(-B / 2 + r * 0.45, min(B / 2 - r * 0.45, x)); y = max(-B / 2 + r * 0.45, min(B / 2 - r * 0.45, y))
    hoehe = min(MAX_H, 5.0 + (r - 14) / (56 - 14) * (MAX_H - 5.0)) * random.uniform(0.85, 1.0)   # größer = höher, aber nie über der Grenze
    orte.append((x, y, r, hoehe))
    for zi, zj in list(frei):
        cx, cy = zentrum(zi, zj)
        if math.hypot(cx - x, cy - y) <= r * 0.85: frei.discard((zi, zj))
print("FREI", round(100 * len(frei) / (NZ * NZ), 1), "% bei", len(orte), "Haufen")
def normiert(v): return v.normalized() if v.length > 1e-6 else Vector((0, 0, 1))
for n, (cx, cy, r, H) in enumerate(orte, 1):
    ry = r * random.uniform(0.8, 1.1); kuppel = H * 0.7   # niedriger Haufenkörper, der Rest der Höhe kommt von den lose aufliegenden Halmen
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=10, radius=1.0)
    for v in bm.verts: v.co = Vector((v.co.x * r, v.co.y * ry, max(v.co.z, -0.1) * kuppel + 1.5))
    for f in bm.faces: f.material_index = 0
    kb = objekt(f"stroh_haufen_{n:02d}_koerper", bm, eb2, [HAUFEN, TINTE]); kb.location = (cx, cy, 0); kontur(kb, 0.8, 1)
    bm = bmesh.new()
    for i in range(int(r * r * 0.22)):   # weniger Halme je Haufen, weil sich die Haufen überlappen
        th = math.acos(random.random() ** 0.8) * 0.93; w = random.uniform(0, math.tau)   # eher oben auf dem Haufen
        p = Vector((r * math.sin(th) * math.cos(w), ry * math.sin(th) * math.sin(w), kuppel * math.cos(th) + 1.5))
        nrm = normiert(Vector((math.sin(th) * math.cos(w) / r, math.sin(th) * math.sin(w) / ry, math.cos(th) / kuppel)))
        zufall = Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1)))
        tang = normiert(zufall - nrm * zufall.dot(nrm))              # kreuz und quer entlang der Oberfläche
        anh = math.radians(random.uniform(0, 38))                    # lose: ein Stück von der Oberfläche abgehoben
        rich = normiert(tang * math.cos(anh) + nrm * math.sin(anh))
        laenge = random.uniform(15, 28) * (0.75 + 0.25 * min(1, r / 40))
        if p.z + laenge * rich.z - 0.28 * laenge > H:               # nie über die Höhengrenze
            zc = max(-0.2, min(rich.z, (H - p.z + 0.28 * laenge) / laenge)); hor = Vector((rich.x, rich.y, 0)); hor = hor.normalized() if hor.length > 1e-6 else Vector((1, 0, 0))
            rich = hor * math.sqrt(1 - zc * zc) + Vector((0, 0, zc))   # nur die Steigung verringern, Länge bleibt 1 (sonst richtet die Normierung steile Halme wieder auf)
        halm(bm, farbe(HAUFEN_GEW), p, rich, laenge, random.uniform(1.4, 2.1), 2, 0.28, random.uniform(-0.9, 0.9))
    hl = objekt(f"stroh_haufen_{n:02d}_halme", bm, eb2, HALM); hl.location = (cx, cy, 0)

# Dome 1.11.: jeder fünfte Haufen ist wieder gelöscht (zum Nachschauen waren sie erst ausgeblendet) – 147 → 118 Haufen
import re
for o in [o for o in bpy.data.objects if re.match(r"stroh_haufen_([0-9]+)_", o.name) and int(re.match(r"stroh_haufen_([0-9]+)_", o.name).group(1)) % 5 == 0]: bpy.data.objects.remove(o, do_unlink=True)
# ---------- Szene wie bei den anderen Blender-Modellen ----------
bpy.ops.object.select_all(action="DESELECT")
sc = bpy.context.scene; sc.render.engine = "BLENDER_WORKBENCH"; sh = sc.display.shading
sh.light = "STUDIO"; sh.studio_light = "paint.sl"; sh.color_type = "MATERIAL"; sh.show_specular_highlight = False; sh.show_cavity = False
sh.show_object_outline = False; sh.show_backface_culling = True
sc.view_settings.view_transform = "Standard"; sc.display.render_aa = "8"; sc.render.film_transparent = True
sc.render.resolution_x, sc.render.resolution_y = 1000, 760
cam = bpy.data.objects.new("c", bpy.data.cameras.new("c")); sc.collection.objects.link(cam); sc.camera = cam
cam.data.type = "ORTHO"; cam.data.ortho_scale = 640; cam.location = (430, -520, 400)
cam.rotation_euler = (Vector((0, 0, 0)) - cam.location).to_track_quat("-Z", "Y").to_euler()
w = bpy.data.worlds.new("w"); sc.world = w; w.color = (0.93, 0.9, 0.84)

# ---------- speichern, exportieren, Vorschau ----------
bpy.ops.wm.save_as_mainfile(filepath=PROJ + "/blender/einstreu-stroh.blend")
bpy.ops.object.select_all(action="SELECT"); cam.select_set(False)
bpy.ops.export_scene.gltf(filepath=PROJ + "/blender/testseiten/einstreu-stroh.glb", export_format="GLB", use_selection=True, export_apply=True)
sc.render.film_transparent = False
sc.render.filepath = VORSCHAU; bpy.ops.render.render(write_still=True)
print("FERTIG Haufen:", len(orte), "Halme Ebene 1:", len(muster.data.polygons) // 2)
