# Speichert die beiden Futtereimer mit ihrer neuen Größe und der 12-Liter-Füllgrenze als eigene Dateien (Dome, 1.11.2026):
#   blender/eimer-stufe1-12l.blend  (+ testseiten/eimer-stufe1-12l.glb)  – runder Eimer, Skala laut eimer-fuellung.py (Füllgrenze 12 l), Hafer bis zur Füllgrenze
#   blender/eimer-stufe2-12l.blend  (+ testseiten/eimer-stufe2-12l.glb)  – grüner halbrunder Eimer, Müsli bis zur Füllgrenze
# Aufruf ohne Fenster: blender -b --python blender/eimer-12l-speichern.py -- <Projektordner>
import bpy, sys
PROJ = sys.argv[sys.argv.index("--") + 1]
SK = {"stufe1": 1.126, "stufe2": 0.878}   # nur Kontrolle; die echte Skala berechnet eimer-fuellung.py aus Füllgrenze und 12 Litern

def einen(quelle, halter_name, eimer, futter, kg, ziel):
    bpy.ops.wm.open_mainfile(filepath=f"{PROJ}/blender/{quelle}.blend")
    halter = bpy.data.objects.new(halter_name, None); halter.empty_display_type = "PLAIN_AXES"; bpy.context.scene.collection.objects.link(halter)
    for o in list(bpy.data.objects):
        if o.type != "CAMERA" and o is not halter: o.parent = halter   # alle Eimerteile (und Pros alte Füllung, die das Skript ersetzt) hängen am Halter
    ns = {"PARENT": halter_name, "EIMER": eimer, "FUTTER": futter, "KG": kg, "STAND_Z": 0.45, "__name__": "eimer_fuellung"}
    exec(open(f"{PROJ}/blender/eimer-fuellung.py", encoding="utf-8").read(), ns)
    print("ERGEBNIS", ziel, ns["result"], "Skala", round(halter.scale.x, 3))
    sc = bpy.context.scene; sc.render.engine = "BLENDER_WORKBENCH"; sc.display.shading.show_backface_culling = True
    bpy.ops.wm.save_as_mainfile(filepath=f"{PROJ}/blender/{ziel}.blend")
    for m in bpy.data.materials:   # glTF liest nur Materialien mit Principled am Ausgang; Pros zweiter Ausgang (Cycles -> Diffuse) machte Stahl/Gummi/Rand/Innen farblos -> erst nach dem Speichern der .blend entfernen
        if m.use_nodes and m.node_tree:
            for x in [x for x in m.node_tree.nodes if x.bl_idname == "ShaderNodeOutputMaterial" and x.target == "CYCLES"]: m.node_tree.nodes.remove(x)
            for x in m.node_tree.nodes:   # der glTF-Export ignoriert Ausgänge mit Ziel EEVEE -> auf "ALL"
                if x.bl_idname == "ShaderNodeOutputMaterial": x.target = "ALL"
    bpy.ops.object.select_all(action="SELECT")
    for o in bpy.data.objects:
        if o.type == "CAMERA": o.select_set(False)
    bpy.ops.export_scene.gltf(filepath=f"{PROJ}/blender/testseiten/{ziel}.glb", export_format="GLB", use_selection=True, export_apply=True)

einen("eimer-hafer", "futtereimer_hafer", "stufe1", "hafer", 6.0, "eimer-stufe1-12l")
einen("eimer-stufe2", "futtereimer_stufe2", "stufe2", "muesli", 4.8, "eimer-stufe2-12l")
