# Vier Boxenböden mit Stroh-Einstreu (Ebene 1 Boden, Ebene 2 lockere Haufen 18/14/10 cm je ein Drittel), Dome 2.11.2026.
# Maße siehe BOXMASSE.md (Länge × Breite, Länge entlang x): A 3 x 3, B 4 x 3, C 4 x 4, D 5 x 4, E 5 x 5 m, 2,5 m Abstand. Bodenbedeckung mind. 90 % (frisch eingestreut). Vor jedem Boden steht Name + Größe.
# Im offenen Fenster: Skript ausführen (fügt hinzu). Ohne Fenster: blender -b --python boxenboeden-bauen.py -- <Projektordner>  (speichert boxboeden-stroh.blend/.glb)
import bpy, sys, math, random
PROJ = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "C:/Users/dome_/Documents/domes-design-test-git"
exec(open(PROJ + "/blender/strohlib.py", encoding="utf-8").read(), globals())
EINH = 126.6   # Einheiten je Meter
BOEDEN = [("A", 3, 3), ("B", 4, 3), ("C", 4, 4), ("D", 5, 4), ("E", 5, 5)]   # (Name, Länge m, Breite m)
LUECKE = 2.5 * EINH; X0 = 540.0   # erster Boden beginnt rechts neben dem 3,5-m-Boden
FLAECHE0, HAUFEN0 = 443.0 ** 2, 92   # Dichte wie beim 3,5-m-Boden mit 92 Haufen
def beschriftung(sam, text, x, y, M):
    c = bpy.data.curves.new("txt_" + text, "FONT"); c.body = text; c.size = 36; c.align_x = "CENTER"; c.extrude = 1.0
    o = bpy.data.objects.new("beschriftung_" + text.split()[0], c); sam.objects.link(o); o.location = (x, y, 2.0); o.data.materials.append(M["tinte"]); return o
M = materialien(); wurzel = bpy.data.collections.new("Boxboeden_Stroh"); bpy.context.scene.collection.children.link(wurzel)
x_links = X0; bericht = []
for k, (name, ml, mb) in enumerate(BOEDEN):
    BX, BY = round(ml * EINH), round(mb * EINH); cx = x_links + BX / 2; x_links += BX + LUECKE
    sam = bpy.data.collections.new(f"Box_{name}_{ml}x{mb}m"); wurzel.children.link(sam)
    boden_bauen(sam, f"box{name}", BX, BY, cx, 0, M, seed=10 + k)
    n = round(HAUFEN0 * BX * BY / FLAECHE0); random.seed(200 + k)
    hoehen = ([18, 14, 10] * (n // 3 + 1))[:n]; random.shuffle(hoehen)
    radien = [random.uniform(34, 46) if h == 18 else random.uniform(26, 34) if h == 14 else random.uniform(16, 24) for h in hoehen]
    pos, radien, bed = verteilen(BX, BY, radien, seed=30 + k)
    for i in range(n):
        haufen_bauen(sam, f"box{name}_haufen_", i + 1, cx + float(pos[i][0]), float(pos[i][1]), radien[i], hoehen[i] / E, M, seed=9000 + 100 * k + i)
    beschriftung(sam, f"{name}  {ml} x {mb} m", cx, -BY / 2 - 40, M)
    bericht.append((name, f"{ml}x{mb}", BX, BY, n, round(bed * 100)))
if "--" in sys.argv:   # ohne Fenster: Szene wie die anderen Modelle, speichern, exportieren
    sc = bpy.context.scene; sc.render.engine = "BLENDER_WORKBENCH"; sh = sc.display.shading
    sh.light = "STUDIO"; sh.studio_light = "paint.sl"; sh.color_type = "MATERIAL"; sh.show_specular_highlight = False; sh.show_object_outline = False; sh.show_backface_culling = True
    bpy.ops.wm.save_as_mainfile(filepath=PROJ + "/blender/boxboeden-stroh.blend")
    bpy.ops.export_scene.gltf(filepath=PROJ + "/blender/testseiten/boxboeden-stroh.glb", export_format="GLB", export_apply=True)
result = {"boeden": bericht}
print("FERTIG", bericht)
