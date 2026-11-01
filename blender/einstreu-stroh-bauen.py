# Einstreu Stroh (Boxenboden) in zwei Ebenen – Blender 5.x, läuft ohne Fenster:
#   blender -b --python einstreu-stroh-bauen.py -- <Projektordner> <Vorschau.png>
# Ebene 1: flacher Boden mit Muster aus flach liegenden Halmen (darauf stehen Eimer, Pferd …)
# Ebene 2: einzelne aufgelockerte Bereiche (Haufen) mit aufgestellten, abgespreizten Halmen
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
HAUFEN = mat("stroh_haufen_koerper", (196, 142, 52))
HALM = [mat("halm_gold", (236, 190, 86)), mat("halm_hell", (250, 218, 132)), mat("halm_bernstein", (214, 150, 50)), mat("halm_blass", (252, 236, 176)), mat("halm_dunkel", (176, 118, 36))]
GEWICHT = [30, 26, 20, 14, 10]
def farbe(): return random.choices(range(5), GEWICHT)[0]
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
for i in range(7500):
    a = random.uniform(0, math.tau); p = random.uniform(-0.09, 0.09)
    halm(bm, farbe(), Vector((random.uniform(-B / 2 + 8, B / 2 - 8), random.uniform(-B / 2 + 8, B / 2 - 8), random.uniform(0.3, 2.4))),
         Vector((math.cos(a), math.sin(a), math.tan(p))), random.uniform(16, 34), random.uniform(1.5, 2.3), 1, 0.04, random.uniform(-0.5, 0.5))
muster = objekt("stroh_ebene1_muster", bm, eb1, HALM)

# ---------- Ebene 2: einzelne aufgelockerte Bereiche ----------
orte = []
for versuch in range(400):
    if len(orte) >= 13: break
    r = random.uniform(30, 58); x = random.uniform(-B / 2 + r + 10, B / 2 - r - 10); y = random.uniform(-B / 2 + r + 10, B / 2 - r - 10)
    if all(math.hypot(x - ox, y - oy) > r + orr + 14 for ox, oy, orr in orte): orte.append((x, y, r))
for n, (cx, cy, r) in enumerate(orte, 1):
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=10, radius=1.0)
    for v in bm.verts: v.co = Vector((v.co.x * r * 1.0, v.co.y * r * 1.0, max(v.co.z, -0.1) * r * 0.2 + 2.0))
    for f in bm.faces: f.material_index = 0
    kb = objekt(f"stroh_haufen_{n:02d}_koerper", bm, eb2, [HAUFEN, TINTE]); kb.location = (cx, cy, 0); kontur(kb, 0.9, 1)
    bm = bmesh.new()
    for i in range(int(r * r * 0.26)):
        rb = r * math.sqrt(random.random()) ** 1.15; w = random.uniform(0, math.tau); bx, by = rb * math.cos(w), rb * math.sin(w)
        az = w + random.gauss(0, 1.15); nach_innen = rb / r
        pitch = max(math.radians(8), math.radians(72 - 50 * nach_innen) + random.gauss(0, 0.22))
        rich = Vector((math.cos(az) * math.cos(pitch), math.sin(az) * math.cos(pitch), math.sin(pitch)))
        halm(bm, farbe(), Vector((bx, by, random.uniform(2.0, 5.0))), rich, max(10, 30 - 11 * nach_innen + random.uniform(-5, 5)), random.uniform(1.4, 2.1), 2, 0.28, random.uniform(-0.9, 0.9))
    hl = objekt(f"stroh_haufen_{n:02d}_halme", bm, eb2, HALM); hl.location = (cx, cy, 0)

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
