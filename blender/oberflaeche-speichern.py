# Oberfläche der Streu je Stufe (Dome 2.11.2026: die Äpfel müssen auf der Streu liegen, nicht darüber schweben und nicht darunter stecken):
# misst in den Mistigkeit-Dateien (ohne Äpfel) mit Strahlen von oben die sichtbare Oberfläche (Boden, Muster, Haufen, Halme/Hanf/Späne, ausgeblendete und platt getretene Haufen berücksichtigt, ohne die schwarze Kontur)
# und legt sie als Höhenraster ab: blender/testseiten/boxenboden/oberflaeche-<stroh|hanf|spaene>-<a–e>-<1–3>.json {cell, x0, y0, nx, ny, z[]}. Die Testseite legt die Äpfel darauf.
# Aufruf: blender -b --python blender/oberflaeche-speichern.py -- <Projektordner> [a b …] [stroh hanf spaene]
import bpy, sys, json
import numpy as np
from mathutils import bvhtree, Vector
_a = sys.argv[sys.argv.index("--") + 1:]; PROJ = _a[0]; GRS = [x for x in _a[1:] if x in list("abcde")] or list("abcde"); MATS = [x for x in _a[1:] if x in ("stroh", "hanf", "spaene")] or ["stroh", "hanf", "spaene"]; EINS = "ebene1" in _a   # "ebene1": nur die Bodenschicht (Ebene 1) ohne Haufen, aus der frischen Datei → oberflaeche1-<mat>-<gr>.json (Äpfel liegen auf Ebene 1)
MASS = {"a": "3x3", "b": "3x4", "c": "4x4", "d": "4x5", "e": "5x5"}; CELL = 2.0
for mat in MATS:
    for gr in GRS:
        for st in ((0,) if EINS else (1, 2, 3)):
            bpy.ops.wm.open_mainfile(filepath=f"{PROJ}/blender/{mat}boxenboden-{gr}-{MASS[gr]}" + ("" if EINS else f"-mistigkeit-{st}") + ".blend")
            V = []; T = []; n0 = 0
            for o in bpy.data.objects:
                if o.type != "MESH" or o.hide_viewport or o.hide_get() or not o.name.startswith("box" + gr.upper() + "_") or (EINS and "_haufen_" in o.name): continue
                me = o.data; me.calc_loop_triangles()
                if not len(me.loop_triangles): continue
                v = np.empty(len(me.vertices) * 3); me.vertices.foreach_get("co", v); v = v.reshape(-1, 3)
                M = np.array(o.matrix_world); w = v @ M[:3, :3].T + M[:3, 3]
                t = np.empty(len(me.loop_triangles) * 3, dtype=np.int32); me.loop_triangles.foreach_get("vertices", t)
                V.append(w); T.append(t.reshape(-1, 3) + n0); n0 += len(w)
            Vall = np.concatenate(V); Tall = np.concatenate(T)
            bvh = bvhtree.BVHTree.FromPolygons([tuple(p) for p in Vall.tolist()], [tuple(p) for p in Tall.tolist()])
            bx = Vall[:, 0].max() - Vall[:, 0].min(); by = Vall[:, 1].max() - Vall[:, 1].min()
            b = bpy.data.objects[f"box{gr.upper()}_boden"]; BX = max(vv.co.x for vv in b.data.vertices) * 2; BY = max(vv.co.y for vv in b.data.vertices) * 2
            x0, y0 = -BX / 2, -BY / 2; nx, ny = int(BX / CELL) + 1, int(BY / CELL) + 1; Z = []
            for iy in range(ny):
                for ix in range(nx):
                    hit = bvh.ray_cast(Vector((x0 + (ix + 0.5) * CELL, y0 + (iy + 0.5) * CELL, 500.0)), Vector((0, 0, -1)))
                    Z.append(round(hit[0].z, 1) if hit[0] is not None else 2.0)
            json.dump({"cell": CELL, "x0": x0, "y0": y0, "nx": nx, "ny": ny, "z": Z}, open(f"{PROJ}/blender/testseiten/boxenboden/oberflaeche" + ("1" if EINS else "") + f"-{mat}-{gr}" + ("" if EINS else f"-{st}") + ".json", "w"))
            print("OBERFLAECHE", mat, gr, st, nx, ny, "max", max(Z))
