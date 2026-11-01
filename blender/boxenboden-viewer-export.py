# GLB + Haufen-Daten für die Testseite blender/testseiten/boxenboden.html (Dome 2.11.2026): je Material (stroh/hanf) und Größe (a–e) eine GLB der frisch eingestreuten Fassung
# (Mistigkeit schaltet die Seite selbst: 18-cm-Haufen platt, 14/10-cm-Haufen aus) und eine JSON mit Haufen (x, y, Radien, Höhe in cm, 0,79 cm je Einheit).
# Ergebnis: blender/testseiten/boxenboden/<stroh|hanf>-<a–e>.glb/.json (nicht in Git, siehe .gitignore).
# Aufruf: blender -b --python blender/boxenboden-viewer-export.py -- <Projektordner> [a b …]
import bpy, sys, random, json
a = sys.argv[sys.argv.index("--") + 1:]; PROJ = a[0]; NUR_STROH = "stroh" in a; NUR_HANF = "hanf" in a; NUR_SPAENE = "spaene" in a; WAHL = [x for x in a[1:] if x in "abcde"] or ["a", "b", "c", "d", "e"]   # Wort "stroh" = nur Stroh (Hanf B–E werden später angepasst)
GR = {"a": ("3x3", 68), "b": ("3x4", 90), "c": ("4x4", 120), "d": ("4x5", 150), "e": ("5x5", 188)}
for mat_ in ("strohboxenboden", "hanfboxenboden", "spaeneboxenboden"):
    for k, name in enumerate("abcde"):
        if name not in WAHL or (NUR_STROH and mat_.startswith("hanf")) or (NUR_HANF and not mat_.startswith("hanf")) or (NUR_SPAENE and not mat_.startswith("spaene")): continue
        mass, n = GR[name]
        bpy.ops.wm.open_mainfile(filepath=f"{PROJ}/blender/{mat_}-{name}-{mass}.blend")
        random.seed(200 + k); hoehen = ([18, 14, 10] * (n // 3 + 1))[:n]; random.shuffle(hoehen)
        P = "box" + name.upper(); haufen = []
        for i, h in enumerate(hoehen, 1):
            ko = bpy.data.objects[f"{P}_haufen_{i:02d}_koerper"]
            xs = [(ko.matrix_world @ v.co).x for v in ko.data.vertices]; ys = [(ko.matrix_world @ v.co).y for v in ko.data.vertices]
            haufen.append({"i": i, "x": round(ko.location.x, 2), "y": round(ko.location.y, 2), "rx": round((max(xs) - min(xs)) / 2, 2), "ry": round((max(ys) - min(ys)) / 2, 2), "h": h})
        b = bpy.data.objects[f"{P}_boden"]
        bx = max(v.co.x for v in b.data.vertices) * 2; by = max(v.co.y for v in b.data.vertices) * 2
        for o in list(bpy.data.objects):
            if not o.name.startswith(P + "_"): bpy.data.objects.remove(o, do_unlink=True)
        out = f"{PROJ}/blender/testseiten/boxenboden/{'hanf' if mat_.startswith('hanf') else 'spaene' if mat_.startswith('spaene') else 'stroh'}-{name}"
        json.dump({"bx": bx, "by": by, "mass": mass, "haufen": haufen, "hanf": mat_.startswith("hanf"), "kompakt": 0.75 if mat_.startswith("hanf") else 0.7 if mat_.startswith("spaene") else 1, "mat": mat_[:-10]}, open(out + ".json", "w"))
        bpy.ops.export_scene.gltf(filepath=out + ".glb", export_format="GLB", export_apply=True, export_texcoords=False, export_normals=("stroh" in out), export_cameras=False, export_lights=False, use_selection=False)
        print("EXPORT", out.split("/")[-1], len(haufen))
