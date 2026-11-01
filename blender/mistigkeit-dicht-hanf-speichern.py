# Mistigkeit 1–3 (Dome 2.11.2026) für die dichten Strohböden (strohboxenboden-<a–e>-<Maß>-dicht.blend) und die Hanfböden (hanfboxenboden-<a–e>-<Maß>.blend), gleiche Regeln wie strohboxenboden-mistigkeit1/2/3-speichern.py:
# Stufe 1: Haufen mit 18 cm auf 5 cm platt · Stufe 2: zusätzlich 14-cm-Haufen ausgeblendet · Stufe 3: zusätzlich 10-cm-Haufen ausgeblendet. Ohne Eimer, Heu, Äpfel.
# Ergebnis: strohboxenboden-<a–e>-<Maß>-dicht-mistigkeit-<1–3>.blend und hanfboxenboden-<a–e>-<Maß>-mistigkeit-<1–3>.blend.   Aufruf: blender -b --python blender/mistigkeit-dicht-hanf-speichern.py -- <Projektordner>
import bpy, sys, random
PROJ = sys.argv[sys.argv.index("--") + 1]
for basis in ("strohboxenboden-{n}-{m}-dicht", "hanfboxenboden-{n}-{m}"):
    for k, (name, mass, n) in enumerate([("a", "3x3", 68), ("b", "3x4", 90), ("c", "4x4", 120), ("d", "4x5", 150), ("e", "5x5", 188)]):
        quelle = f"{PROJ}/blender/" + basis.format(n=name, m=mass)
        for stufe in (1, 2, 3):
            bpy.ops.wm.open_mainfile(filepath=quelle + ".blend")
            random.seed(200 + k); hoehen = ([18, 14, 10] * (n // 3 + 1))[:n]; random.shuffle(hoehen)   # gleiche Reihenfolge wie beim Bauen
            platt = weg = 0
            for i, h in enumerate(hoehen, 1):
                for suf in ("koerper", "halme"):
                    o = bpy.data.objects.get(f"box{name.upper()}_haufen_{i:02d}_{suf}")
                    if not o: continue
                    if h == 18: o.scale.z = 5.0 / 18.0; platt += 1
                    elif (h == 14 and stufe >= 2) or (h == 10 and stufe >= 3): o.hide_viewport = True; o.hide_render = True; weg += 1
            ziel = f"{quelle}-mistigkeit-{stufe}.blend"; bpy.ops.wm.save_as_mainfile(filepath=ziel)
            print("GESPEICHERT", ziel.split("/")[-1], "platt:", platt // 2, "ausgeblendet:", weg // 2, "von", n)
