# Eimer-Füllung nach Menge (Dome 1.11.: „der Heuhaufen und die Füllung der Eimer müssen sich nach der im Futterplan eingestellten Menge richten“).
# Füllt Eimer Stufe 1 (rund) oder Eimer Stufe 2 (halbrund) mit Hafer, Müsli, Mineralfutter oder Rübenschnitzeln – die Füllhöhe ergibt sich aus der Menge in kg
# über das Innenvolumen des Eimers und die Schüttdichte. Oberfläche immer eben (kein Berg), nie über der Füllgrenze. Nimmt Pros Körner und Materialien aus eimer-alle.blend.
# Parameter (vor dem Lauf setzen): EIMER = "stufe1" | "stufe2", FUTTER = "hafer" | "muesli" | "mineral" | "ruebe", KG = Menge im Eimer, PARENT = Name des Empties (Füllung wandert mit).
# NUR_TABELLE = True rechnet nur die Füllhöhen aus (für blender/FUELLMENGEN.md und das Spiel). Läuft im offenen Fenster (werkzeuge/blender-senden.js) oder ohne Fenster.
import bpy, bmesh, math, random
from mathutils import Vector, Matrix, noise

QUELLE = "C:/Users/dome_/Documents/domes-design-test-git/blender/eimer-alle.blend"
EIMER = globals().get("EIMER", "stufe2"); FUTTER = globals().get("FUTTER", "muesli"); KG = globals().get("KG", 2.0)
PARENT = globals().get("PARENT"); NUR_TABELLE = globals().get("NUR_TABELLE", False)
random.seed(77)
LITER_PRO_E3 = 0.79 ** 3 / 1000.0      # 1 Modelleinheit = 0,79 cm  →  1 Einheit³ = 0,000493 Liter
# Dome 1.11.: BEIDE Eimer fassen bis zur Füllgrenze (Rand − 1,2) genau 12 Liter. Dafür werden die Eimer gleichmäßig skaliert: Stufe 1 war zu klein (8,6 l → größer), Stufe 2 zu groß (18,7 l → kleiner).
FASSUNG_L = 12.0
# Füllgrenze = die Linie, die Dome früher festgelegt hat: Wasserspiegel in Pros Modellen wasser-stufe1.glb (z = 25,2–25,6) und wasser-stufe2.glb (z = 31,4–31,8), „bis unter den Rand“ (sonst schwarzer Konturstreifen)
FUELLGRENZE_Z = {"stufe1": 24.0, "stufe2": 33.0}   # Dome 1.11.: Stufe 1 etwas niedriger (war 25,4), Stufe 2 etwas höher (war 31,4)
EIMER_SKALA = {}   # wird in festlegen() aus dem Fassungsvermögen berechnet
DICHTE = {"hafer": 0.50, "muesli": 0.40, "mineral": 0.65, "ruebe": 0.25}   # Schüttdichte kg je Liter (Schätzung nach üblichen Werten)
# Stücke je Flächeneinheit (aus Pros Füllungen für den runden Eimer abgeleitet: Stücke ÷ 876 Einheiten²)
SORTEN = {"hafer": {"dunkel": .27, "hell": .27, "mittel": .27}, "muesli": {"flocken": .258, "gelb": .17, "orange": .045, "pellets": .17, "rot": .10},
          "mineral": {"dunkel": .39, "hell": .39, "mittel": .39}, "ruebe": {"dunkel": .365, "hell": .365, "mittel": .365}}
BASIS = {"hafer": "hafer_haufen", "muesli": "muesli_haufen", "mineral": "mineral_haufen", "ruebe": "ruebe_haufen"}

def lerp(tab, z):
    for (z0, w0), (z1, w1) in zip(tab, tab[1:]):
        if z <= z1: return w0 + (w1 - w0) * max(0.0, (z - z0) / (z1 - z0))
    return tab[-1][1]
R1 = [(0.8, 13.5), (4.0, 14.0), (12.0, 15.1), (20.0, 16.4), (24.8, 17.6), (25.7, 18.0)]   # Innenradius Eimer Stufe 1 nach Höhe
A2 = [(1.0, 18.4), (32.2, 24.8), (40.0, 24.8)]; B2 = [(1.0, 27.2), (32.2, 34.8), (40.0, 34.8)]   # Innenmaße Eimer Stufe 2: Halbachse x, Tiefe nach -y
Z0, RIM = (0.8, 25.7) if EIMER == "stufe1" else (1.0, 37.0)
HMAX = FUELLGRENZE_Z[EIMER]
def flaeche(z):
    if EIMER == "stufe1": return math.pi * lerp(R1, z) ** 2
    return math.pi * lerp(A2, z) * lerp(B2, z) / 2
def liter_roh(h):   # Volumen des unskalierten Modells in Litern
    v, z = 0.0, Z0
    while z < h: v += flaeche(z + 0.05) * 0.1; z += 0.1
    return v * LITER_PRO_E3
def liter_bis(h): return liter_roh(h) * EIMER_SKALA[EIMER] ** 3
def festlegen(e):
    global EIMER, Z0, RIM, HMAX
    EIMER = e; Z0, RIM = (0.8, 25.7) if e == "stufe1" else (1.0, 37.0); HMAX = FUELLGRENZE_Z[e]
    EIMER_SKALA[e] = (FASSUNG_L / liter_roh(HMAX)) ** (1 / 3)
festlegen(EIMER)
def hoehe_fuer_liter(liter):
    z, v = Z0, 0.0; ziel = liter / (LITER_PRO_E3 * EIMER_SKALA[EIMER] ** 3)
    while z < HMAX and v < ziel: v += flaeche(z + 0.05) * 0.1; z += 0.1
    return min(z, HMAX), v >= ziel - 1e-6

if NUR_TABELLE:
    out = {}
    for e in ("stufe1", "stufe2"):
        festlegen(e)
        out[e] = {"fassungsvermoegen_liter_bis_Fuellgrenze": round(liter_bis(HMAX), 1), "fuellgrenze_z": HMAX, "skala_des_eimers": round(EIMER_SKALA[e], 3),
                  "hoehe_je_liter": {str(l): round(hoehe_fuer_liter(l)[0], 1) for l in (1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20)}}
    result = out
else:
    liter = KG / DICHTE[FUTTER]; h, passt = hoehe_fuer_liter(liter)
    def innen(x, y, zuschlag=0.0):
        if EIMER == "stufe1": return x * x + y * y <= (lerp(R1, h) + zuschlag) ** 2
        return y <= -0.4 and (x / (lerp(A2, h) + zuschlag)) ** 2 + (y / (lerp(B2, h) + zuschlag)) ** 2 <= 1
    KORN_UEBERSTAND = 1.6 if FUTTER == "muesli" else 1.2   # die obersten Körner ragen etwa so weit über die Oberfläche → Oberfläche so tiefer, dass die Körner genau an der Füllgrenze enden
    def oberflaeche(x, y): return h - KORN_UEBERSTAND + 0.22 * noise.noise(Vector((x * 0.14, y * 0.14, 5.0)))
    for o in [o for o in bpy.data.objects if o.name.startswith("korn_")]: bpy.data.objects.remove(o, do_unlink=True)   # Reste eines abgebrochenen Laufs
    for o in [o for o in bpy.data.objects if o.name.startswith("hafer_") and EIMER == "stufe1" and PARENT and bpy.data.objects.get(PARENT) and o.parent == bpy.data.objects.get(PARENT)]: bpy.data.objects.remove(o, do_unlink=True)   # Pros fest gebaute Hafer-Füllung ersetzen (vor dem Laden, sonst bekommen die neuen Vorlagen Namen mit .001)
    with bpy.data.libraries.load(QUELLE, link=False) as (von, nach):
        nach.objects = [n for n in von.objects if n.startswith(f"korn_{FUTTER}_") or n == BASIS[FUTTER]]
    V = {o.name.split(".0")[0]: o for o in nach.objects}   # Namen ohne .001-Endung
    halter = bpy.data.objects.get(PARENT) if PARENT else None
    if halter: halter.scale = (EIMER_SKALA[EIMER],) * 3; halter.location.z = 1.6   # Eimer steht auf Ebene 1 der Einstreu
    for o in [o for o in bpy.data.objects if o.name.startswith(f"fuellung_{EIMER}_")]: bpy.data.objects.remove(o, do_unlink=True)
    for c in [c for c in bpy.data.collections if c.name.startswith((f"Fuellung_{EIMER}", "Muesli_Stufe2"))]: bpy.data.collections.remove(c)
    for o in [o for o in bpy.data.objects if o.name.startswith("muesli_s2_") and EIMER == "stufe2"]: bpy.data.objects.remove(o, do_unlink=True)
    if EIMER == "stufe1":   # Pros fest gebaute Hafer-Füllung ersetzen
        for o in [o for o in bpy.data.objects if o.name.startswith("hafer_") and (halter is None or o.parent == halter)]: bpy.data.objects.remove(o, do_unlink=True)
    ziel = (bpy.data.collections.get("Futtereimer_Hafer" if EIMER == "stufe1" else "Futtereimer_Stufe2") if PARENT else None) or bpy.context.scene.collection
    col = bpy.data.collections.new(f"Fuellung_{EIMER}"); ziel.children.link(col)
    def neues_objekt(name, bm, materialien, dicke):
        me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
        for m in materialien: me.materials.append(m)
        o = bpy.data.objects.new(name, me); col.objects.link(o)
        mod = o.modifiers.new("kontur", "SOLIDIFY"); mod.thickness = dicke; mod.offset = 1; mod.use_flip_normals = True; mod.use_rim = False; mod.material_offset = 1
        if halter: o.parent = halter
        return o
    b = V[BASIS[FUTTER]]; basis_mat, tinte = b.material_slots[0].material, b.material_slots[1].material
    S = 1.5; ext = 40; n = int(2 * ext / S) + 1; bm = bmesh.new(); gitter = {}
    for i in range(n):
        for j in range(n):
            x, y = -ext + i * S, -ext + j * S
            if innen(x, y, 0.6): gitter[(i, j)] = bm.verts.new((x, y, oberflaeche(x, y)))
    for (i, j) in list(gitter):
        q = [gitter.get((i, j)), gitter.get((i + 1, j)), gitter.get((i + 1, j + 1)), gitter.get((i, j + 1))]
        if all(q): f = bm.faces.new(q); f.smooth = False; f.material_index = 0
    neues_objekt(f"fuellung_{EIMER}_basis", bm, [basis_mat, tinte], 0.3)
    flaeche_oben = flaeche(h)
    for sorte, dichte in SORTEN[FUTTER].items():
        v0, v1 = V[f"korn_{FUTTER}_{sorte}_0"], V[f"korn_{FUTTER}_{sorte}_1"]; mat, tt = v0.material_slots[0].material, v0.material_slots[1].material
        bm = bmesh.new(); plaetze = 0; anzahl = int(dichte * flaeche_oben)
        while plaetze < anzahl:
            x, y = random.uniform(-ext, ext), random.uniform(-ext, ext)
            if not innen(x, y, -1.2): continue
            vor = random.choice((v0, v1)); drehung = Matrix.Rotation(random.uniform(0, math.tau), 3, "Z") @ Matrix.Rotation(random.uniform(-0.45, 0.45), 3, "X") @ Matrix.Rotation(random.uniform(-0.45, 0.45), 3, "Y")
            pos = Vector((x, y, oberflaeche(x, y) + random.uniform(0.15, 0.55)))
            vv = [bm.verts.new(drehung @ p.co + pos) for p in vor.data.vertices]
            for pl in vor.data.polygons:
                try: f = bm.faces.new([vv[k] for k in pl.vertices]); f.material_index = 0; f.smooth = False
                except ValueError: pass
            plaetze += 1
        neues_objekt(f"fuellung_{EIMER}_{sorte}", bm, [mat, tt], 0.1)
    for o in list(V.values()): bpy.data.objects.remove(o, do_unlink=True)
    for me in [m for m in bpy.data.meshes if m.users == 0]: bpy.data.meshes.remove(me)
    result = {"eimer": EIMER, "futter": FUTTER, "kg": KG, "liter": round(liter, 2), "fuellhoehe": round(h, 1), "rand": RIM, "passt_komplett": passt,
              "fassungsvermoegen_liter": round(liter_bis(HMAX), 1), "max_kg_dieses_futters": round(liter_bis(HMAX) * DICHTE[FUTTER], 1)}
