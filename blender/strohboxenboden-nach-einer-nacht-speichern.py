# Einstreu nach einer Nacht (Dome 2.11.2026): aus den frisch eingestreuten Einzelböden (strohboxenboden-<a–e>-<Maß>.blend) werden die Haufen, die frisch 18 cm hoch waren
# (ein Drittel), auf 5 cm platt getreten (Skala z = 5/18); die Haufen mit 14 und 10 cm bleiben. Ohne Eimer, ohne Heu, ohne Pferdeäpfel (die verteilt das Spiel später zufällig, nie in andere Objekte).
# Ergebnis: blender/strohboxenboden-<a–e>-<Maß>-nach-einer-nacht.blend
# Aufruf ohne Fenster: blender -b --python blender/strohboxenboden-morgen-speichern.py -- <Projektordner>
import bpy, sys, random
PROJ = sys.argv[sys.argv.index("--") + 1]
for k, (name, mass, n) in enumerate([("a", "3x3", 68), ("b", "3x4", 90), ("c", "4x4", 120), ("d", "4x5", 150), ("e", "5x5", 188)]):
    bpy.ops.wm.open_mainfile(filepath=f"{PROJ}/blender/strohboxenboden-{name}-{mass}.blend")
    random.seed(200 + k); hoehen = ([18, 14, 10] * (n // 3 + 1))[:n]; random.shuffle(hoehen)   # gleiche Reihenfolge wie beim Bauen (boxenboeden-bauen.py)
    platt = 0
    for i, h in enumerate(hoehen, 1):
        if h != 18: continue
        for suf in ("koerper", "halme"):
            o = bpy.data.objects.get(f"box{name.upper()}_haufen_{i:02d}_{suf}")
            if o: o.scale.z = 5.0 / 18.0; platt += 1
    ziel = f"{PROJ}/blender/strohboxenboden-{name}-{mass}-nach-einer-nacht.blend"
    bpy.ops.wm.save_as_mainfile(filepath=ziel)
    print("GESPEICHERT", ziel, "platt:", platt // 2, "von", n)
