# Pferdeäpfel in die Mistigkeitsböden einsetzen (Dome 2.11.2026): Positionen kommen aus der Testseite (blender/testseiten/boxenboden.html, Knopf „In Blender speichern“ → blender/testseiten/boxenboden/aepfel-<stroh|hanf|spaene>-<a–e>-<pferd>-<1–3>.json),
# die Äpfel sind die Vorlagen pferdeapfel-rund|weich|hart.blend. Ergebnis: <boden>-mistigkeit-<1–3>-aepfel-<pferd>.blend (die Dateien ohne Äpfel bleiben).
# Pferd: kalt, warm, pony, fohlen, stute, kaltfo, ponyfo. Stufe 1 = 3–5 Haufen + 3–5 einzelne Äpfel je Pferd (Stufe 2/3: dazu jeweils neue, jeder zweite Haufen zerfällt), Äpfel liegen aufeinander und gehen teils ineinander.
# Aufruf: blender -b --python blender/aepfel-speichern.py -- <Projektordner> <stroh|hanf|spaene> <a–e> <pferd>
import bpy, sys, json
from mathutils import Matrix
PROJ, MAT, GR, PFERD = sys.argv[sys.argv.index("--") + 1:][:4]
MASS = {"a": "3x3", "b": "3x4", "c": "4x4", "d": "4x5", "e": "5x5"}[GR]
C = Matrix(((1, 0, 0), (0, 0, -1), (0, 1, 0))).to_4x4()   # three (y oben) → Blender (z oben): (x, y, z)_B = (x, -z, y)_three
datei = f"{MAT}boxenboden-{GR}-{MASS}"
for st in (1, 2, 3):
    bpy.ops.wm.open_mainfile(filepath=f"{PROJ}/blender/{datei}-mistigkeit-{st}.blend")
    liste = json.load(open(f"{PROJ}/blender/testseiten/boxenboden/aepfel-{MAT}-{GR}-{PFERD}-{st}.json"))
    vorlage = {}
    for t in ("rund", "weich", "hart"):
        with bpy.data.libraries.load(f"{PROJ}/blender/pferdeapfel-{t}.blend") as (src, dst): dst.objects = list(src.objects)
        vorlage[t] = [o for o in dst.objects if o is not None][0]
    sam = bpy.data.collections.new("Pferdeaepfel"); bpy.context.scene.collection.children.link(sam)
    for i, a in enumerate(liste):
        m3 = Matrix([[a["m"][c * 4 + r] for c in range(4)] for r in range(4)])   # three-Matrix (spaltenweise) → Zeilenform
        o = vorlage[a["typ"]].copy(); o.name = f"apfel_{i + 1:03d}"; sam.objects.link(o); o.matrix_world = C @ m3 @ C.inverted()
    for v in vorlage.values(): bpy.data.objects.remove(v, do_unlink=True)
    ziel = f"{PROJ}/blender/{datei}-mistigkeit-{st}-aepfel-{PFERD}.blend"; bpy.ops.wm.save_as_mainfile(filepath=ziel)
    print("GESPEICHERT", ziel.split("/")[-1], len(liste), "Äpfel")
