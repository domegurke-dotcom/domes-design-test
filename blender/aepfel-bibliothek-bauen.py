# Pferdeäpfel-Bibliothek (Dome 2.11.2026): EINE Datei mit allen Äpfeln einzeln und allen Haufen-Varianten, damit das Spiel sie nach Bedarf auf die Einstreu legen kann
# (Einstreu liegt getrennt: <stroh|hanf|spaene>boxenboden-<a–e>-<Maß>[-mistigkeit-<1–3>].blend).
# Inhalt (Sammlungen):
#   Aepfel_Einzeln   – je Pferdegröße (kalt, warm, pony, fohlen) und Apfeltyp (rund, weich, hart) ein Apfel: apfel_<groesse>_<typ>
#   Haufen           – je Pferdegröße HAUFEN_N ganze Haufen (12–20 Äpfel), mit der Blender-Physik gefallen und liegengeblieben (Schwerkraft, Reibung), Äpfel gehen leicht ineinander
#                      (simuliert mit 87 % Größe, danach auf 100 % gesetzt): haufen_<groesse>_<nr> (Empty mit den Äpfeln als Kinder, Boden bei z = 0)
#   Verstreut        – je Pferdegröße VERSTREUT_N Haufen, die mit der Mistigkeit zerfallen sind (gleiche Äpfel leicht verteilt, einzeln auf dem Boden): verstreut_<groesse>_<nr>
# Größen (Apfelgröße, Kubikwurzel des Gewichts, Warmblut = 1): kalt 1,15 · warm 1,0 · pony 0,8 · fohlen 0,6. Stute mit Fohlen: Haufen der Stutengröße plus Haufen der Fohlengröße.
# Maßstab: 1 Einheit = 0,79 cm wie bei der Einstreu. Origin eines Haufens = Mitte am Boden (z = 0 = Oberfläche der Streu).
# Zusätzlich: blender/testseiten/boxenboden/aepfel-bibliothek.json (Matrizen je Apfel im Koordinatensystem der Testseite, y oben) – die Testseite legt dieselben Haufen auf die Streu.
# Aufruf: blender -b --python blender/aepfel-bibliothek-bauen.py -- <Projektordner>
import bpy, sys, math, random, json
from mathutils import Vector, Matrix, Euler
PROJ = sys.argv[sys.argv.index("--") + 1]
GROESSEN = {"kalt": 1.15, "warm": 1.0, "pony": 0.8, "fohlen": 0.6}
TYPEN = ("rund", "weich", "hart"); TW = {"normal": [5, 3, 2], "fohlen": [2, 7, 1]}
HAUFEN_N, VERSTREUT_N = 8, 6; SIM = 0.82; FRAMES = 150

bpy.ops.wm.read_factory_settings(use_empty=True)
vorlage = {}
for t in TYPEN:
    with bpy.data.libraries.load(f"{PROJ}/blender/pferdeapfel-{t}.blend") as (src, dst): dst.objects = list(src.objects)
    vorlage[t] = [o for o in dst.objects if o is not None][0]
xs = [v.co.x for v in vorlage["rund"].data.vertices]; ys = [v.co.y for v in vorlage["rund"].data.vertices]
GR = max(max(xs) - min(xs), max(ys) - min(ys))   # Apfeldurchmesser (Einheiten)
scn = bpy.context.scene; root = scn.collection
def sammlung(name):
    c = bpy.data.collections.new(name); root.children.link(c); return c
c_ein, c_hau, c_ver = sammlung("Aepfel_Einzeln"), sammlung("Haufen"), sammlung("Verstreut")
for o in vorlage.values(): o.hide_viewport = o.hide_render = True
def neuer_apfel(sam, name, typ, s, ort, rot, elter=None):
    o = vorlage[typ].copy(); o.name = name; o.hide_viewport = o.hide_render = False; sam.objects.link(o)
    o.scale = (s, s, s); o.location = ort; o.rotation_euler = rot
    if elter: o.parent = elter
    return o
for gname, gs in GROESSEN.items():
    for t in TYPEN: neuer_apfel(c_ein, f"apfel_{gname}_{t}", t, gs, (0, 0, 0), (0, 0, 0))

def physik(apfel_liste, sam, gref):
    """Fallen lassen und liegenbleiben lassen (Blender-Starrkörper). Gibt die Matrizen am Ende zurück."""
    for w in [scn.rigidbody_world] if scn.rigidbody_world else []: bpy.ops.rigidbody.world_remove()
    bpy.ops.rigidbody.world_add(); rbw = scn.rigidbody_world; rbw.substeps_per_frame = 10; rbw.solver_iterations = 20
    boden = bpy.data.objects.new("boden_sim", None); sam.objects.link(boden)
    # flache Schale (Mitte z = 0, nach außen leicht ansteigend), damit die Äpfel zur Mitte rollen und liegenbleiben; außerhalb eben
    import bmesh
    tiefe = 0.4 * gref; rmax = 2.0 * gref; N = 24; bm = bmesh.new(); mitte = bm.verts.new((0, 0, 0))
    ringe = [[bm.verts.new((math.cos(j / N * math.tau) * rr * gref, math.sin(j / N * math.tau) * rr * gref, tiefe * (rr * gref / rmax) ** 2)) for j in range(N)] for rr in (0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4)]
    for j in range(N): bm.faces.new((mitte, ringe[0][j], ringe[0][(j + 1) % N]))
    for a in range(len(ringe) - 1):
        for j in range(N): bm.faces.new((ringe[a][j], ringe[a + 1][j], ringe[a + 1][(j + 1) % N], ringe[a][(j + 1) % N]))
    aussen = [bm.verts.new((math.cos(j / N * math.tau) * 400, math.sin(j / N * math.tau) * 400, tiefe)) for j in range(N)]
    for j in range(N): bm.faces.new((ringe[-1][j], aussen[j], aussen[(j + 1) % N], ringe[-1][(j + 1) % N]))
    me = bpy.data.meshes.new("boden_sim"); bm.to_mesh(me); bm.free()
    ground = bpy.data.objects.new("boden_sim_mesh", me); sam.objects.link(ground)
    bpy.context.view_layer.objects.active = ground; ground.select_set(True); bpy.ops.rigidbody.object_add(type="PASSIVE"); ground.rigid_body.collision_shape = "MESH"; ground.rigid_body.friction = 4.0; ground.rigid_body.restitution = 0.0
    for o in apfel_liste:
        bpy.context.view_layer.objects.active = o; o.select_set(True); bpy.ops.rigidbody.object_add(type="ACTIVE")
        rb = o.rigid_body; rb.collision_shape = "CONVEX_HULL"; rb.friction = 4.0; rb.restitution = 0.0; rb.linear_damping = 0.9; rb.angular_damping = 0.98   # Pferdeäpfel sind keine Steine: leicht matschig, bleiben aufeinander liegen (hohe Reibung, kaum Rollen); rb.mass = 1.0
        rb.use_margin = True; rb.collision_margin = 0.0
    scn.frame_start = 1; scn.frame_end = FRAMES
    for f in range(1, FRAMES + 1): scn.frame_set(f)
    res = [o.matrix_world.copy() for o in apfel_liste]
    for o in apfel_liste:   # festschreiben, Starrkörper entfernen
        o.select_set(True); bpy.context.view_layer.objects.active = o; bpy.ops.rigidbody.object_remove()
    bpy.ops.rigidbody.world_remove(); bpy.data.objects.remove(ground, do_unlink=True); bpy.data.objects.remove(boden, do_unlink=True)
    scn.frame_set(1)
    return res

C = Matrix(((1, 0, 0), (0, 0, -1), (0, 1, 0))).to_4x4()
def mat3(mb): return C.inverted() @ mb @ C   # Blender (z oben) → Testseite (y oben)
daten = {"einheit_cm": 0.79, "apfel_durchmesser": GR, "groessen": GROESSEN, "haufen": {}, "verstreut": {}}
for gname, gs in GROESSEN.items():
    gi = list(GROESSEN).index(gname); daten["haufen"][gname] = []; daten["verstreut"][gname] = []
    for n in range(1, HAUFEN_N + VERSTREUT_N + 1):
        ganz = n <= HAUFEN_N; random.seed(1000 * gi + n); k = 12 + random.randint(0, 2); sam = c_hau if ganz else c_ver
        name = f"haufen_{gname}_{n}" if ganz else f"verstreut_{gname}_{n - HAUFEN_N}"
        emp = bpy.data.objects.new(name, None); emp.empty_display_type = "PLAIN_AXES"; emp.empty_display_size = GR * gs; sam.objects.link(emp)
        tw = TW["fohlen" if gname == "fohlen" else "normal"]; liste = []
        for i in range(k):
            typ = random.choices(TYPEN, tw)[0]; s = gs * (0.9 + 0.2 * random.random())
            if ganz:   # Startlage ohne Überlappung: Schicht 1 Ring um die Mitte, darüber versetzte Schichten; sie fallen von knapp oben
                kap = [6, 5, 3]; sch = 0; rest = i
                while rest >= kap[sch]: rest -= kap[sch]; sch += 1
                anz = min(kap[sch], k - sum(kap[:sch])); a = (rest / max(1, anz)) * math.tau + sch * 0.5 + random.uniform(-0.3, 0.3)
                rr = GR * gs * (1.45, 0.9, 0.75)[sch] * random.uniform(0.95, 1.12) if anz > 1 else 0.0   # Schichten ohne Überlappung, jede höher und enger; einzelne ganz oben in der Mitte
                ort = (math.cos(a) * rr, math.sin(a) * rr, GR * gs * (0.45 + 1.2 * sch)); rot = (0.0, 0.0, random.uniform(0, math.tau)); sc = s * SIM
            else:      # einzeln auf dem Boden, leicht verteilt, fast flach
                for _t in range(80):
                    rr = GR * gs * (0.8 + 2.4 * math.sqrt(random.random())); a = random.uniform(0, math.tau); p = (math.cos(a) * rr, math.sin(a) * rr)
                    if all(math.hypot(q.location.x - p[0], q.location.y - p[1]) > GR * gs * 0.85 for q in liste): break
                ort = (p[0], p[1], 0.0); rot = (random.uniform(-0.2, 0.2), random.uniform(-0.2, 0.2), random.uniform(0, math.tau)); sc = s
            liste.append(neuer_apfel(sam, f"{name}_apfel_{i + 1:02d}", typ, sc, ort, rot, None))
        if ganz:
            mats = physik(liste, sam, GR * gs)
            for o, m in zip(liste, mats): o.matrix_basis = m; o.scale = o.scale / SIM   # nach der Simulation auf volle Größe: die Äpfel gehen leicht ineinander
            for o in liste:   # matschig: Äpfel, auf denen andere liegen, sind etwas zusammengedrückt (flacher, breiter)
                if any(q is not o and q.location.z > o.location.z + 0.3 * GR * gs and math.hypot(q.location.x - o.location.x, q.location.y - o.location.y) < 0.9 * GR * gs for q in liste): o.scale = (o.scale.x * 1.05, o.scale.y * 1.05, o.scale.z * 0.88)
            cx = sum(o.location.x for o in liste) / k; cy = sum(o.location.y for o in liste) / k
            for o in liste: o.location.x -= cx; o.location.y -= cy
        for o in liste: o.parent = emp
        emp["aepfel"] = k; emp["groesse"] = gname; emp["art"] = "ganz" if ganz else "verstreut"
        daten["haufen" if ganz else "verstreut"][gname].append([{"typ": [t for t in TYPEN if vorlage[t].data == o.data][0], "m": [round(v, 4) for col in zip(*mat3(o.matrix_basis)) for v in col]} for o in liste])
scn["einheit_cm"] = 0.79
bpy.context.preferences.filepaths.save_version = 0; bpy.ops.wm.save_as_mainfile(filepath=f"{PROJ}/blender/pferdeaepfel-bibliothek.blend")
json.dump(daten, open(f"{PROJ}/blender/testseiten/boxenboden/aepfel-bibliothek.json", "w"))
print("GESPEICHERT pferdeaepfel-bibliothek.blend", len(c_ein.objects), "Einzeläpfel,", HAUFEN_N * 4, "Haufen,", VERSTREUT_N * 4, "verstreut")
