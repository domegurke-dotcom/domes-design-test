# Pferdeäpfel in Blender (Dome 2.11.2026): drei verschiedene Äpfel als Vorlagen, dazu Streuen auf Fläche A „so, dass man am nächsten Morgen misten müsste“.
# Maßstab: 1 Einheit = 0,79 cm. Zeichenstil: Workbench, Materialfarben, schwarze Kontur (Solidify „kontur“, Material „tinte“) wie die anderen Modelle.
#   Typ 1 „rund“      – fester, runder Apfel (typisch bei Heufütterung), 6–7 cm
#   Typ 2 „weich“     – etwas flacher und feuchter (frisch, viel Gras/Weide), mit kurzen Halmen darin wie im Foto
#   Typ 3 „hart“      – klein, dunkel, trocken (wenig Wasser)
# Ohne Fenster:  blender -b --python blender/pferdeaepfel-bauen.py -- <Projektordner>   → speichert blender/pferdeaepfel.blend + testseiten/pferdeaepfel.glb (nur die drei Vorlagen)
# Im offenen Fenster: Variable STREUEN = True setzen (Fläche A, Sammlung Box_A_3x3m) – die Vorlagen werden gebaut und auf der Fläche verteilt.
import bpy, bmesh, math, random, sys
from mathutils import Vector, Matrix, noise

PROJ = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "C:/Users/dome_/Documents/domes-design-test-git"
STREUEN = globals().get("STREUEN", False)
exec(open(PROJ + "/blender/strohlib.py", encoding="utf-8").read(), globals())

TYPEN = {   # Name: (Halbachsen x, y, z in Einheiten, Farbe, Unebenheit, Halme)
    "rund": ((4.6, 3.9, 3.5), (104, 88, 40), 0.35, 0),
    "weich": ((6.0, 4.6, 2.3), (88, 74, 32), 0.55, 14),
    "hart": ((3.3, 3.0, 2.8), (66, 53, 28), 0.30, 0),
}

def apfel_bauen(name, sammlung, typ, seed):
    (ax, ay, az), farbe_rgb, rauh, halme = TYPEN[typ]
    random.seed(seed); M = mat("apfel_" + typ, farbe_rgb); T = mat("tinte", (0, 0, 0)); T.use_backface_culling = True
    bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=3, radius=1.0)
    for v in bm.verts:
        n = noise.noise(Vector((v.co.x * 1.6 + seed, v.co.y * 1.6, v.co.z * 1.6))) * rauh
        r = 1.0 + n * 0.5
        v.co = Vector((v.co.x * ax * r, v.co.y * ay * r, max(v.co.z * az * r, -az * 0.45)))   # Unterseite flach, liegt auf dem Boden
    for f in bm.faces: f.material_index = 0; f.smooth = True
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    me.materials.append(M); me.materials.append(T)
    if halme:   # kurze orange Halme, die oben herausschauen (frischer, weicher Apfel)
        Hm = mat("apfel_halm", (196, 122, 48)); V, F, MI = [], [], []
        for i in range(halme):
            a = random.uniform(0, math.tau); r = random.uniform(0.15, 0.8)
            p = Vector((math.cos(a) * ax * r, math.sin(a) * ay * r, az * (1 - r * r) ** 0.5 * 0.9))
            rich = Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(0.3, 1.0)))
            halm(V, F, MI, 0, p, rich, random.uniform(2.0, 3.6), 0.5, 1, 0.1, random.uniform(0, 3))
        n0 = len(me.vertices); me.materials.clear(); me.materials.append(M); me.materials.append(T); me.materials.append(Hm)
        bm2 = bmesh.new(); bm2.from_mesh(me)
        vs = [bm2.verts.new(c) for c in V]
        for f in F:
            try: ff = bm2.faces.new([vs[i] for i in f]); ff.material_index = 2
            except ValueError: pass
        bm2.to_mesh(me); bm2.free()
    o = bpy.data.objects.new(name, me); sammlung.objects.link(o)
    m = o.modifiers.new("kontur", "SOLIDIFY"); m.thickness = 0.5; m.offset = 1; m.use_flip_normals = True; m.use_rim = False; m.material_offset = 1 if not halme else 1
    return o

def vorlagen(sammlung):
    return [apfel_bauen(f"pferdeapfel_{t}", sammlung, t, 11 + i) for i, t in enumerate(TYPEN)]

if STREUEN:
    bpy.context.view_layer.update()
    sam = bpy.data.collections.get("Pferdeaepfel") or bpy.data.collections.new("Pferdeaepfel")
    if sam.name not in bpy.context.scene.collection.children: bpy.context.scene.collection.children.link(sam)
    for o in list(sam.objects): bpy.data.objects.remove(o, do_unlink=True)
    vor = vorlagen(sam)
    for o in vor: o.hide_viewport = True; o.hide_render = True   # Vorlagen bleiben versteckt, die Äpfel sind Kopien (teilen das Mesh)
    box = bpy.data.collections["Box_A_3x3m"]
    eimer = [o for o in bpy.data.collections["Futtereimer_Hafer"].objects if o.type == "MESH"]; heu = [o for o in bpy.data.collections["Heuhaufen_Heu"].objects if o.type == "MESH"]
    heu_poly = huelle_xy(heu, 20.0)
    def im_heu(x, y):
        n = len(heu_poly)
        return all((heu_poly[(i + 1) % n][0] - heu_poly[i][0]) * (y - heu_poly[i][1]) - (heu_poly[(i + 1) % n][1] - heu_poly[i][1]) * (x - heu_poly[i][0]) >= 0 for i in range(n))
    BX, BY, CX = 380, 380, 730.0
    random.seed(4711); haufen = []
    versuche = 0
    while len(haufen) < 5 and versuche < 2000:
        versuche += 1; x, y = CX + random.uniform(-BX / 2 + 40, BX / 2 - 40), random.uniform(-BY / 2 + 40, BY / 2 - 40)
        if math.hypot(x - 620, y - 100) < 60 or im_heu(x, y) or any(math.hypot(x - h[0], y - h[1]) < 70 for h in haufen): continue
        haufen.append((x, y, random.choice((9, 7, 11, 6, 8))))
    gruppen = []
    for hi, (hx, hy, n) in enumerate(haufen):
        typ_haupt = random.choice(list(TYPEN)); gruppe = []
        for k in range(n):
            lage = 1 if k < n * 0.65 else 2   # unten die meisten, oben ein paar daraufgelegt
            w = random.uniform(0, math.tau); r = random.uniform(2.0, 8.0) * (1.0 if lage == 1 else 0.5)
            t = typ_haupt if random.random() < 0.7 else random.choice(list(TYPEN))
            quelle = next(o for o in vor if o.name.endswith(t))
            a = bpy.data.objects.new(f"apfel_{hi + 1}_{k + 1}", quelle.data); sam.objects.link(a)
            a.location = (hx + math.cos(w) * r, hy + math.sin(w) * r, 2.4 + (0.0 if lage == 1 else 3.2))
            a.rotation_euler = (random.uniform(-0.25, 0.25), random.uniform(-0.25, 0.25), random.uniform(0, math.tau))
            s = random.uniform(0.9, 1.15); a.scale = (s, s, s)
            m = a.modifiers.new("kontur", "SOLIDIFY"); m.thickness = 0.5; m.offset = 1; m.use_flip_normals = True; m.use_rim = False; m.material_offset = 1
            gruppe.append(a)
        gruppen.append(gruppe)
    einzeln = []   # ein paar einzelne, weggerollte Äpfel
    for k in range(7):
        for _ in range(200):
            x, y = CX + random.uniform(-BX / 2 + 30, BX / 2 - 30), random.uniform(-BY / 2 + 30, BY / 2 - 30)
            if math.hypot(x - 620, y - 100) < 50 or im_heu(x, y): continue
            break
        t = random.choice(list(TYPEN)); quelle = next(o for o in vor if o.name.endswith(t))
        a = bpy.data.objects.new(f"apfel_einzeln_{k + 1}", quelle.data); sam.objects.link(a)
        a.location = (x, y, 2.4); a.rotation_euler = (0, 0, random.uniform(0, math.tau))
        m = a.modifiers.new("kontur", "SOLIDIFY"); m.thickness = 0.5; m.offset = 1; m.use_flip_normals = True; m.use_rim = False; m.material_offset = 1
        einzeln.append(a); gruppen.append([a])
    bpy.context.view_layer.update()
    stroh = [o for o in box.objects if "_haufen_" in o.name]
    weg = freihalten(stroh, gruppen[:len(haufen)], 5.0) + freihalten(stroh, gruppen[len(haufen):], 2.5)   # Haufen: Stroh weggedrückt, ringsum frei (so bleiben die Äpfel sichtbar); einzelne Äpfel etwas weniger   # das Stroh geht nicht in die Äpfel hinein (Dome), unter dem Haufen liegt nur der flache Boden
    for a in sam.objects:
        for m in a.modifiers:
            if m.type == "SOLIDIFY": m.show_viewport = True
    result = {"haufen": [(round(h[0]), round(h[1]), h[2]) for h in haufen], "einzeln": len(einzeln), "aepfel": len(sam.objects) - len(vor), "stroh_flaechen_geloescht": weg}

elif "--" in sys.argv:   # ohne Fenster: nur die drei Vorlagen speichern
    bpy.ops.wm.read_factory_settings(use_empty=True)
    exec(open(PROJ + "/blender/strohlib.py", encoding="utf-8").read(), globals())
    sam = bpy.data.collections.new("Pferdeaepfel_Vorlagen"); bpy.context.scene.collection.children.link(sam)
    vor = vorlagen(sam)
    for i, o in enumerate(vor): o.location = (i * 16.0, 0, 0)
    sc = bpy.context.scene; sc.render.engine = "BLENDER_WORKBENCH"; sh = sc.display.shading
    sh.light = "STUDIO"; sh.studio_light = "paint.sl"; sh.color_type = "MATERIAL"; sh.show_object_outline = False; sh.show_backface_culling = True
    bpy.ops.wm.save_as_mainfile(filepath=PROJ + "/blender/pferdeaepfel.blend")
    bpy.ops.export_scene.gltf(filepath=PROJ + "/blender/testseiten/pferdeaepfel.glb", export_format="GLB", export_apply=True)
    print("FERTIG", [o.name for o in vor])
