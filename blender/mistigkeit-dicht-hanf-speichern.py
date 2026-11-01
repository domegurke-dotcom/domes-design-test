# Mistigkeit 1–3 (Dome 2.11.2026) für die dichten Strohböden (strohboxenboden-<a–e>-<Maß>-dicht.blend) und die Hanfböden (hanfboxenboden-<a–e>-<Maß>.blend), gleiche Regeln wie strohboxenboden-mistigkeit1/2/3-speichern.py:
# Stufe 1: Haufen mit 18 cm auf 5 cm platt · Stufe 2: zusätzlich 14-cm-Haufen ausgeblendet · Stufe 3: zusätzlich 10-cm-Haufen ausgeblendet. Ohne Eimer, Heu, Äpfel.
# Ergebnis: strohboxenboden-<a–e>-<Maß>-dicht-mistigkeit-<1–3>.blend und hanfboxenboden-<a–e>-<Maß>-mistigkeit-<1–3>.blend.   Aufruf: blender -b --python blender/mistigkeit-dicht-hanf-speichern.py -- <Projektordner>
import bpy, sys, random
srgb = lambda x: ((x / 255) / 12.92 if x / 255 <= 0.04045 else (((x / 255) + 0.055) / 1.055) ** 2.4)
_a = sys.argv[sys.argv.index("--") + 1:]; PROJ = _a[0]; NUR = _a[1:] or list("abcde"); MATS = [m for m in ("stroh", "hanf") if m in _a] or ["stroh", "hanf"]   # optional: Böden und Material, z. B. -- <Ordner> a hanf
for basis in [b for b in ("strohboxenboden-{n}-{m}", "hanfboxenboden-{n}-{m}") if any(b.startswith(m) for m in MATS)]:
    for k, (name, mass, n) in enumerate([("a", "3x3", 68), ("b", "3x4", 90), ("c", "4x4", 120), ("d", "4x5", 150), ("e", "5x5", 188)]):
        if name not in NUR: continue
        quelle = f"{PROJ}/blender/" + basis.format(n=name, m=mass)
        for stufe in (1, 2, 3):
            bpy.ops.wm.open_mainfile(filepath=quelle + ".blend")
            random.seed(200 + k); hoehen = ([18, 14, 10] * (n // 3 + 1))[:n]; random.shuffle(hoehen)   # gleiche Reihenfolge wie beim Bauen
            platt = weg = 0
            if "hanf" in basis:   # Hanf wird mit der Mistigkeit dunkler (Dome, Foto): Farben zur braun-grauen Zielfarbe
                w = [0, 0.22, 0.45, 0.68][stufe]
                for m in bpy.data.materials:
                    if m.name.startswith("hanf") and m.node_tree:
                        c = m.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value; z = [srgb(x) for x in (110, 84, 62)]
                        nc = tuple(c[i] + (z[i] - c[i]) * w for i in range(3)) + (1,); m.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = nc; m.diffuse_color = nc
            for i, h in enumerate(hoehen, 1):
                for suf in ("koerper", "halme"):
                    o = bpy.data.objects.get(f"box{name.upper()}_haufen_{i:02d}_{suf}")
                    if not o: continue
                    if h == 18: o.scale.z = 5.0 / (18.0 * (0.75 if "hanf" in basis else 1.0)); platt += 1
                    elif (h == 14 and stufe >= 2) or (h == 10 and stufe >= 3): o.hide_viewport = True; o.hide_render = True; weg += 1
            ziel = f"{quelle}-mistigkeit-{stufe}.blend"; bpy.ops.wm.save_as_mainfile(filepath=ziel)
            print("GESPEICHERT", ziel.split("/")[-1], "platt:", platt // 2, "ausgeblendet:", weg // 2, "von", n)
