# Einstreu Stufe 2 der Mistigkeit (Dome 2.11.2026): nicht gemistet, zwei Nächte um. Aus den frisch eingestreuten Einzelböden (strohboxenboden-<a–e>-<Maß>.blend):
# das Drittel mit 18 cm ist auf 5 cm platt getreten (Skala z = 5/18), das Drittel mit 14 cm ist ausgeblendet (nicht gelöscht), das Drittel mit 10 cm bleibt.
# Ohne Eimer, Heu und Pferdeäpfel (die verteilt das Spiel später zufällig, nie in andere Objekte; mehr Äpfel als bei Stufe 1).
# Ergebnis: blender/strohboxenboden-<a–e>-<Maß>-mistigkeit-2.blend   (Stufe 1 = …-nach-einer-nacht.blend)
# Aufruf ohne Fenster: blender -b --python blender/strohboxenboden-mistigkeit2-speichern.py -- <Projektordner>
import bpy, sys, random
PROJ = sys.argv[sys.argv.index("--") + 1]
for k, (name, mass, n) in enumerate([("a", "3x3", 68), ("b", "3x4", 90), ("c", "4x4", 120), ("d", "4x5", 150), ("e", "5x5", 188)]):
    bpy.ops.wm.open_mainfile(filepath=f"{PROJ}/blender/strohboxenboden-{name}-{mass}.blend")
    random.seed(200 + k); hoehen = ([18, 14, 10] * (n // 3 + 1))[:n]; random.shuffle(hoehen)   # gleiche Reihenfolge wie beim Bauen (boxenboeden-bauen.py)
    platt = weg = 0
    for i, h in enumerate(hoehen, 1):
        for suf in ("koerper", "halme"):
            o = bpy.data.objects.get(f"box{name.upper()}_haufen_{i:02d}_{suf}")
            if not o: continue
            if h == 18: o.scale.z = 5.0 / 18.0; platt += 1
            elif h == 14: o.hide_viewport = True; o.hide_render = True; weg += 1
    ziel = f"{PROJ}/blender/strohboxenboden-{name}-{mass}-mistigkeit-2.blend"
    bpy.ops.wm.save_as_mainfile(filepath=ziel)
    print("GESPEICHERT", ziel.split("/")[-1], "platt:", platt // 2, "ausgeblendet:", weg // 2, "von", n)
