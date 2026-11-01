# Jeder Pferdeapfel als eigene Datei, damit das Spiel sie einzeln verteilen kann (Dome 2.11.2026):
#   blender/pferdeapfel-<rund|weich|hart>.blend  (+ testseiten/pferdeapfel-<typ>.glb)
# Ursprung = Mitte der Unterseite (z = 0), der Apfel liegt flach auf dem Boden; Kontur (Solidify „kontur“) ist dabei. Maßstab 1 Einheit = 0,79 cm.
# Aufruf ohne Fenster: blender -b --python blender/pferdeaepfel-einzeln-speichern.py -- <Projektordner>
import bpy, sys
PROJ = sys.argv[sys.argv.index("--") + 1]
for i, typ in enumerate(("rund", "weich", "hart")):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    ns = {"__name__": "aepfel"}
    exec(open(PROJ + "/blender/pferdeaepfel-bauen.py", encoding="utf-8").read().split("if STREUEN:")[0], ns)   # nur Definitionen (Typen, apfel_bauen, Bibliothek), nichts streuen
    sam = bpy.data.collections.new("Pferdeapfel"); bpy.context.scene.collection.children.link(sam)
    o = ns["apfel_bauen"](f"pferdeapfel_{typ}", sam, typ, 11 + i)
    zmin = min(v.co.z for v in o.data.vertices)
    for v in o.data.vertices: v.co.z -= zmin   # Unterseite auf z = 0
    o.data.update()
    sc = bpy.context.scene; sc.render.engine = "BLENDER_WORKBENCH"; sh = sc.display.shading
    sh.light = "STUDIO"; sh.studio_light = "paint.sl"; sh.color_type = "MATERIAL"; sh.show_object_outline = False; sh.show_backface_culling = True
    bpy.ops.wm.save_as_mainfile(filepath=f"{PROJ}/blender/pferdeapfel-{typ}.blend")
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.gltf(filepath=f"{PROJ}/blender/testseiten/pferdeapfel-{typ}.glb", export_format="GLB", use_selection=True, export_apply=True)
    print("GESPEICHERT", typ, [round(c, 1) for c in o.dimensions])
