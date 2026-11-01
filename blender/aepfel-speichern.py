# Pferdeäpfel in die Mistigkeitsböden einsetzen (Dome 2.11.2026): Positionen kommen aus der Testseite (blender/testseiten/boxenboden.html, Export nach blender/testseiten/boxenboden/aepfel-<stroh|hanf>-a-<1–3>.json),
# die Äpfel sind die Vorlagen pferdeapfel-rund|weich|hart.blend. Ergebnis: <boden>-mistigkeit-<1–3>-aepfel.blend (die Dateien ohne Äpfel bleiben).
# Nach Dome: Stufe 1 = 3–5 Haufen + 3–5 einzelne Äpfel (Stufe 2/3: das Doppelte/Dreifache), Haufen aus 12–20 Äpfeln, die aufeinander liegen und teils ineinander gehen.
# Aufruf: blender -b --python blender/aepfel-speichern.py -- <Projektordner>
import bpy, sys, json
from mathutils import Matrix
PROJ = sys.argv[sys.argv.index("--") + 1]
C = Matrix(((1, 0, 0), (0, 0, -1), (0, 1, 0))).to_4x4()   # three (y oben) → Blender (z oben): (x, y, z)_B = (x, -z, y)_three
for datei, mat_ in (("hanfboxenboden-a-3x3", "hanf"), ("strohboxenboden-a-3x3", "stroh")):
    for st in (1, 2, 3):
        bpy.ops.wm.open_mainfile(filepath=f"{PROJ}/blender/{datei}-mistigkeit-{st}.blend")
        liste = json.load(open(f"{PROJ}/blender/testseiten/boxenboden/aepfel-{mat_}-a-{st}.json"))
        vorlage = {}
        for t in ("rund", "weich", "hart"):
            with bpy.data.libraries.load(f"{PROJ}/blender/pferdeapfel-{t}.blend") as (src, dst): dst.objects = list(src.objects)
            vorlage[t] = [o for o in dst.objects if o is not None][0]
        sam = bpy.data.collections.new("Pferdeaepfel"); bpy.context.scene.collection.children.link(sam)
        for i, a in enumerate(liste):
            m3 = Matrix([[a["m"][c * 4 + r] for c in range(4)] for r in range(4)])   # three-Matrix (spaltenweise) → Zeilenform
            mb = C @ m3 @ C.inverted()
            o = vorlage[a["typ"]].copy(); o.name = f"apfel_{i + 1:03d}"; sam.objects.link(o); o.matrix_world = mb
        for v in vorlage.values(): bpy.data.objects.remove(v, do_unlink=True)
        ziel = f"{PROJ}/blender/{datei}-mistigkeit-{st}-aepfel.blend"; bpy.ops.wm.save_as_mainfile(filepath=ziel)
        print("GESPEICHERT", ziel.split("/")[-1], len(liste), "Äpfel")
