# Speichert jeden Boxenboden (A–E) aus boxboeden-stroh.blend als eigene Datei, Boden-Mitte im Ursprung (0, 0): blender/boxboden-<a–e>-<Länge>x<Breite>.blend (Dome 2.11.2026)
# Aufruf ohne Fenster: blender -b --python blender/boxboeden-einzeln-speichern.py -- <Projektordner>
import bpy, sys
PROJ = sys.argv[sys.argv.index("--") + 1]
QUELLE = PROJ + "/blender/boxboeden-stroh.blend"
for name, mass in [("A", "3x3"), ("B", "3x4"), ("C", "4x4"), ("D", "4x5"), ("E", "5x5")]:
    bpy.ops.wm.open_mainfile(filepath=QUELLE)
    for c in list(bpy.data.collections["Boxboeden_Stroh"].children):
        if not c.name.startswith(f"Box_{name}_"):
            for o in list(c.objects): bpy.data.objects.remove(o, do_unlink=True)
            bpy.data.collections.remove(c)
    cx = bpy.data.objects[f"box{name}_boden"].location.x
    for o in bpy.data.objects:
        if o.parent is None: o.location.x -= cx   # Boden-Mitte in den Ursprung
    ziel = f"{PROJ}/blender/boxboden-{name.lower()}-{mass}.blend"
    bpy.ops.wm.save_as_mainfile(filepath=ziel)
    print("GESPEICHERT", ziel, len(bpy.data.objects), "Boden bei", round(bpy.data.objects[f"box{name}_boden"].location.x, 2))
