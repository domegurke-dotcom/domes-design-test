# Strohboxenböden A–E mit ~99,5 % Bedeckung (Dome 2.11.2026): aus strohboxenboden-<a–e>-<Maß>-roh.blend (boxboeden-einzeln-speichern.py) – Haufen neu verteilt, bis ×1,4 breiter, Halme neu gelegt.
# Ergebnis: blender/strohboxenboden-<a–e>-<Maß>.blend (die Rohdateien -roh bleiben)
import bpy, sys
PROJ = sys.argv[sys.argv.index("--") + 1]
exec(open(f"{PROJ}/blender/strohlib.py").read(), globals())
for j, (name, mass) in enumerate([("a", "3x3"), ("b", "3x4"), ("c", "4x4"), ("d", "4x5"), ("e", "5x5")]):
    bpy.ops.wm.open_mainfile(filepath=f"{PROJ}/blender/strohboxenboden-{name}-{mass}-roh.blend")
    P = "box" + name.upper(); b = bpy.data.objects[f"{P}_boden"]; M = materialien()
    BX = max(v.co.x for v in b.data.vertices) * 2; BY = max(v.co.y for v in b.data.vertices) * 2
    alt = []
    for k in range(1, 1000):
        ko = bpy.data.objects.get(f"{P}_haufen_{k:02d}_koerper")
        if not ko: break
        xs = [v.co.x for v in ko.data.vertices]; ys = [v.co.y for v in ko.data.vertices]; zs = [v.co.z for v in ko.data.vertices]
        alt.append((k, max(abs(min(xs)), max(xs)), max(abs(min(ys)), max(ys)), (max(zs) - 1.5) / 0.7, ko.users_collection[0]))
    pos, R, bed = verteilen(BX, BY, [max(a[1], a[2]) for a in alt], seed=42 + j, ziel=0.995)
    for i, (k, r, ry, H, sam) in enumerate(alt):
        for suf in ("koerper", "halme"):
            o = bpy.data.objects[f"{P}_haufen_{k:02d}_{suf}"]; bpy.data.objects.remove(o, do_unlink=True)
        f = R[i] / max(r, ry); haufen_bauen(sam, f"{P}_haufen_", k, pos[i][0], pos[i][1], r * f, H, M, ry=ry * f)
    ziel = f"{PROJ}/blender/strohboxenboden-{name}-{mass}.blend"; bpy.ops.wm.save_as_mainfile(filepath=ziel)
    print("GESPEICHERT", ziel.split("/")[-1], "Haufen:", len(alt), "Bedeckung:", round(bed, 4), "max. Breitenfaktor:", round(float((R / [max(a[1], a[2]) for a in alt]).max()), 2))
