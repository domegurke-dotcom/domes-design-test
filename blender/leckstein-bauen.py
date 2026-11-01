# Salzleckstein (Himalaya-Salz mit Loch und Hanfschnur) – Blender 5.x, läuft ohne Fenster:
#   blender -b --python leckstein.py -- <Projektordner> <Vorschau.png>
import bpy, bmesh, math, random, sys
from mathutils import Vector, noise

PROJ, VORSCHAU = sys.argv[sys.argv.index("--") + 1], sys.argv[sys.argv.index("--") + 2]
random.seed(11)
bpy.ops.wm.read_factory_settings(use_empty=True)
col = bpy.data.collections.new("Leckstein"); bpy.context.scene.collection.children.link(col)

def objekt(name, me):
    o = bpy.data.objects.new(name, me); col.objects.link(o); return o

# ---------- Salzbrocken: Tonne (runder Querschnitt, flache Enden), Loch genau in der Mitte, raue Oberfläche; Lochachse = y ----------
BX, BY, BZ = 6.65, 8.23, 6.65   # Halbachsen (Modelleinheiten; 1 Einheit = 0,79 cm): Domes Maße 10,5 cm dick und 13 cm lang (Lochachse), 2 kg (≈ 0,95 Liter Steinsalz)
N = 4.0                      # Superellipsoid: >2 macht die Enden flacher und die Kanten runder (Tonnenform); 4,0 passt zu Domes 2 kg bei 10,5 × 13 cm
bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=5, radius=1.0)
for v in bm.verts:
    p = v.co.copy(); k = (abs(p.x) ** N + abs(p.y) ** N + abs(p.z) ** N) ** (1 / N); p = p / k   # auf die Superellipsoid-Fläche
    q = Vector((p.x * BX, p.y * BY, p.z * BZ))
    r = 1 + 0.05 * noise.noise(q * 0.2 + Vector((3, 1, 7)))   # leicht unregelmäßig, aber gleichmäßig dick rund ums Loch
    v.co = Vector((q.x * r, q.y * r, q.z * r))
me = bpy.data.meshes.new("salz"); bm.to_mesh(me); bm.free()
salz = objekt("salz", me)
bpy.context.view_layer.objects.active = salz; salz.select_set(True)
# Bruchflächen: viele kleine Ebenen schneiden Ecken und Kanten ab (wie gebrochenes Steinsalz)
def schnitt(rich, tiefe):
    rich = Vector(rich).normalized(); rd = 1 / (abs(rich.x / BX) ** N + abs(rich.y / BY) ** N + abs(rich.z / BZ) ** N) ** (1 / N)
    bpy.ops.mesh.primitive_cube_add(size=60, location=rich * (rd * tiefe + 30)); c = bpy.context.active_object
    c.rotation_euler = rich.to_track_quat("Z", "Y").to_euler()
    m = salz.modifiers.new("schnitt", "BOOLEAN"); m.object = c; m.operation = "DIFFERENCE"; m.solver = "EXACT"
    bpy.context.view_layer.objects.active = salz; bpy.ops.object.modifier_apply(modifier=m.name); bpy.data.objects.remove(c, do_unlink=True)
# Loch quer durch, genau in der Mitte (gleicher Abstand zum Rand)
HZ = 0.0
bpy.ops.mesh.primitive_cylinder_add(vertices=28, radius=2.7, depth=30, location=(0, 0, HZ), rotation=(math.pi / 2, 0, 0))
loch = bpy.context.active_object; loch.name = "loch"
bo = salz.modifiers.new("loch", "BOOLEAN"); bo.object = loch; bo.operation = "DIFFERENCE"; bo.solver = "EXACT"
bpy.context.view_layer.objects.active = salz; bpy.ops.object.modifier_apply(modifier=bo.name)
bpy.data.objects.remove(loch, do_unlink=True)
# gleichmäßige Dreiecksstruktur über den ganzen Stein (wie Domes Vorbild): erst gleichmäßig neu vernetzen, dann zu unregelmäßigen Dreiecken zusammenfassen
rm = salz.modifiers.new("neu", "REMESH"); rm.mode = "VOXEL"; rm.voxel_size = 0.5
bpy.context.view_layer.objects.active = salz; bpy.ops.object.modifier_apply(modifier=rm.name)
dc = salz.modifiers.new("dreiecke", "DECIMATE"); dc.ratio = 0.05; dc.use_collapse_triangulate = True
bpy.ops.object.modifier_apply(modifier=dc.name)
# raue, kristalline Oberfläche: Beulen und Splitter, dann flach schattieren
bm = bmesh.new(); bm.from_mesh(salz.data)
for v in bm.verts:
    v.co += v.normal * (0.34 * noise.noise(v.co * 1.5 + Vector((5, 8, 1))) + 0.12 * noise.noise(v.co * 3.5 + Vector((2, 6, 9))))
bm.to_mesh(salz.data); bm.free()
salz.data.polygons.foreach_set("use_smooth", [False] * len(salz.data.polygons))
# ---------- Zeichenstil wie im Spiel: flache Farbflächen (Workbench), schwarze Kontur als umgestülpte Hülle ("tinte") ----------
def srgb(x): x = x / 255; return x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4
def mat(name, rgb):
    c = tuple(srgb(x) for x in rgb); m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = c + (1,); b.inputs["Roughness"].default_value = 0.8; m.diffuse_color = c + (1,); return m
TINTE = mat("tinte", (0, 0, 0)); TINTE.use_backface_culling = True
SALZ = [mat("salz_dunkel", (255, 118, 80)), mat("salz_orange", (255, 156, 112)), mat("salz_rosa", (255, 196, 176)), mat("salz_weiss", (255, 244, 232)), mat("salz_hellrosa", (255, 226, 212))]
salz.data.materials.clear()
for m in SALZ + [TINTE] * 5: salz.data.materials.append(m)   # Plätze 5–9: Tinte für die Kontur (material_offset 5)
for pl in salz.data.polygons:   # fleckig: Orange und Rosa in Wolken, weiße Kristallflecken
    c = pl.center; v = noise.noise(c * 0.3 + Vector((1, 2, 3))); w = noise.noise(c * 0.45 + Vector((4, 4, 4)))
    pl.material_index = 3 if w > 0.3 else (4 if w > 0.18 else (2 if v > 0.14 else (0 if v < -0.1 else 1)))
def kontur(o, dicke, versatz):
    m = o.modifiers.new("kontur", "SOLIDIFY"); m.thickness = dicke; m.offset = 1; m.use_flip_normals = True; m.use_rim = False; m.material_offset = versatz
kontur(salz, 0.3, 5)

# ---------- Hanfschnur: dreifach verdrillte Schlaufe durch das Loch ----------
def catmull(pts, n=14, geschlossen=True):
    out = []; m = len(pts)
    for i in range(m if geschlossen else m - 1):
        p0, p1, p2, p3 = pts[(i - 1) % m], pts[i], pts[(i + 1) % m], pts[(i + 2) % m]
        for j in range(n):
            t = j / n
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    return out
Y = lambda y, z: Vector((0.3, y, z))
# Schwerkraft: der Stein hängt unter dem Knoten, das Seil liegt im Loch oben auf (Seilradius ≈ 0,5), läuft an den Stirnflächen hoch bis zur Oberkante
# und zieht von dort straff geradlinig zum Knoten. Ecken werden nur leicht abgerundet (Chaikin), damit die Stränge gespannt bleiben.
RZ = 2.7 - 0.5   # Seilmitte im Loch: Lochradius minus Seilradius
ecken = [Y(8.0, RZ), Y(9.1, RZ + 0.7), Y(9.1, 7.2), Y(0, 28.4), Y(-9.1, 7.2), Y(-9.1, RZ + 0.7), Y(-8.0, RZ), Y(0, RZ)]
def chaikin(punkte, runden):
    for _ in range(runden):
        neu = []
        for i in range(len(punkte)):
            p, q = punkte[i], punkte[(i + 1) % len(punkte)]
            neu += [p * 0.9 + q * 0.1, p * 0.1 + q * 0.9]
        punkte = neu
    return punkte
def dichter(punkte, schritt=0.6):   # gleichmäßig viele Punkte entlang der geraden Stücke
    out = []
    for i in range(len(punkte)):
        p, q = punkte[i], punkte[(i + 1) % len(punkte)]; n = max(1, int((q - p).length / schritt))
        out += [p.lerp(q, j / n) for j in range(n)]
    return out
pfad = dichter(chaikin(ecken, 2))
laenge = sum((pfad[(i + 1) % len(pfad)] - pfad[i]).length for i in range(len(pfad)))
steigung = laenge / round(laenge / 3.4)
seilteile = []
def strang(punkte, nr, versatz, radius, geschlossen, name):
    cu = bpy.data.curves.new(name, "CURVE"); cu.dimensions = "3D"; cu.bevel_depth = radius; cu.bevel_resolution = 2; cu.resolution_u = 1
    sp = cu.splines.new("POLY"); sp.points.add(len(punkte) - 1); sp.use_cyclic_u = geschlossen
    s = 0.0; X = Vector((1, 0, 0))
    for i, p in enumerate(punkte):
        nxt = punkte[(i + 1) % len(punkte)]; tvec = (nxt - p)
        if i and True: s += (p - punkte[i - 1]).length
        T = tvec.normalized(); B = T.cross(X).normalized()
        a = 2 * math.pi * s / steigung + 2 * math.pi * nr / 3
        o = p + (X * math.cos(a) + B * math.sin(a)) * versatz
        sp.points[i].co = (o.x, o.y, o.z, 1)
    ob = objekt(name, cu); seilteile.append(ob); return ob
for k in range(3): strang(pfad, k, 0.27, 0.25, True, f"seil_strang{k}")
# Knoten oben und zwei Enden mit Knoten (wie auf dem Foto)
def knoten(pos, r, name):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=10, radius=r, location=pos, scale=(1, 1, 0.8))
    o = bpy.context.active_object; o.name = name; col.objects.link(o); bpy.context.scene.collection.objects.unlink(o); seilteile.append(o)
    o.data.polygons.foreach_set("use_smooth", [True] * len(o.data.polygons)); return o
knoten((0.3, 0, 27.4), 1.25, "seil_knoten")
for sgn in (-1, 1):   # lose Enden hängen nach unten, vor und hinter dem Strang
    ende = [Vector((0.3, 0, 27.4)), Vector((0.3 + sgn * 1.6, sgn * 1.2, 25.4)), Vector((0.3 + sgn * 2.2, sgn * 1.5, 22.4))]
    kurve = catmull(ende, 8, False) + [ende[-1]]
    for k in range(3): strang(kurve, k, 0.2, 0.18, False, f"seil_ende{sgn}_{k}")
    knoten((0.3 + sgn * 2.2, sgn * 1.5, 21.9), 0.95, f"seil_endknoten{sgn}")
# alles Seil in ein Objekt
bpy.ops.object.select_all(action="DESELECT")
for o in seilteile:
    if o.type == "CURVE":
        bpy.context.view_layer.objects.active = o; o.select_set(True); bpy.ops.object.convert(target="MESH")
    o.select_set(True)
bpy.context.view_layer.objects.active = seilteile[0]; bpy.ops.object.join(); seil = bpy.context.active_object; seil.name = "seil"
seil.data.polygons.foreach_set("use_smooth", [True] * len(seil.data.polygons))
seil.data.materials.append(mat("seil_hanf", (255, 238, 178))); seil.data.materials.append(TINTE)
kontur(seil, 0.15, 1)

# ---------- Szene wie bei den anderen Blender-Modellen: Workbench, Studio-Licht, Materialfarben, orthografische Kamera ----------
bpy.ops.object.select_all(action="DESELECT")
sc = bpy.context.scene; sc.render.engine = "BLENDER_WORKBENCH"; sh = sc.display.shading
sh.light = "STUDIO"; sh.studio_light = "paint.sl"; sh.color_type = "MATERIAL"; sh.show_specular_highlight = False; sh.show_cavity = False; sh.show_object_outline = False; sh.show_backface_culling = True   # wie bei den anderen Modellen: nötig für die Kontur
sc.view_settings.view_transform = "Standard"; sc.display.render_aa = "8"; sc.render.film_transparent = True
sc.render.resolution_x, sc.render.resolution_y = 700, 900
cam = bpy.data.objects.new("c", bpy.data.cameras.new("c")); sc.collection.objects.link(cam); sc.camera = cam
cam.data.type = "ORTHO"; cam.data.ortho_scale = 52; cam.location = (66, -42, 26)
cam.rotation_euler = (Vector((0.3, 0, 13)) - cam.location).to_track_quat("-Z", "Y").to_euler()
w = bpy.data.worlds.new("w"); sc.world = w; w.color = (0.93, 0.9, 0.84)

# ---------- speichern, exportieren, Vorschau ----------
bpy.ops.wm.save_as_mainfile(filepath=PROJ + "/blender/leckstein.blend")
bpy.ops.object.select_all(action="SELECT"); cam.select_set(False)
bpy.ops.export_scene.gltf(filepath=PROJ + "/blender/testseiten/leckstein.glb", export_format="GLB", use_selection=True, export_apply=True)
sc.render.film_transparent = False   # nur für das Vorschaubild
sc.render.filepath = VORSCHAU; bpy.ops.render.render(write_still=True)
print("FERTIG", len(salz.data.polygons), len(seil.data.polygons))
