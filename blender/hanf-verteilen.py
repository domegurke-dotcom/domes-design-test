# Haufen (Ebene 2) von Box A so verteilen, dass Ebene 1 bedeckt ist (Dome 2.11.2026): neue Lloyd-Verteilung, Haufen bei Bedarf in der Breite vergrößert, Hanf-Splitter neu gelegt.
import bpy, math, random
from mathutils import Vector
exec(open(r"C:\Users\dome_\Documents\domes-design-test-git\blender\strohlib.py").read(), globals())
# Mischung aus Foto 1 (Kies König: sandbeige, grau, kürzer) und Foto 2 (hell elfenbein, lang und schmal, chaotisch gelegt), Dome 2.11.2026
HANF = [(236, 226, 204), (220, 205, 172), (196, 176, 136), (166, 148, 118), (176, 142, 92), (204, 206, 150), (104, 84, 58), (178, 180, 142), (152, 156, 116), (198, 198, 164)]   # + grünlich-graue Nadeln (Foto 3)   # elfenbein, sandbeige, hellbraun, grau, braun, blassgrün (selten), dunkel (selten)
GEW = [24, 28, 22, 12, 8, 3, 3]; NADEL_GEW = [30, 40, 30]
for i, c in enumerate(HANF): m = mat(f"hanf_{i}", c); cc = tuple(srgb(x) for x in c) + (1,); m.diffuse_color = cc; m.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = cc
P = "boxA"; mh = [bpy.data.materials[f"hanf_{i}"] for i in range(10)]
b = bpy.data.objects[f"{P}_boden"]; BX = max(v.co.x for v in b.data.vertices) * 2; BY = max(v.co.y for v in b.data.vertices) * 2
ks = []; R0 = []
for k in range(1, 400):
    ko = bpy.data.objects.get(f"{P}_haufen_{k:02d}_koerper")
    if not ko: break
    xs = [v.co.x for v in ko.data.vertices]; ys = [v.co.y for v in ko.data.vertices]; zs = [v.co.z for v in ko.data.vertices]
    if k == 1 or True: ko["r0"] = ko.get("r0", max(abs(min(xs)), max(xs))); ko["ry0"] = ko.get("ry0", max(abs(min(ys)), max(ys)))
    ks.append(ko); R0.append(max(ko["r0"], ko["ry0"]))
pos, R, bed = verteilen(BX, BY, R0, seed=42, ziel=0.99)
def splitter(V, F, MI, p, rich):
    if random.random() < 0.4:   # dünne, kurze Nadeln wie beim Häcksel auf Foto 3
        halm(V, F, MI, 7 + random.choices(range(3), NADEL_GEW)[0], p, rich, random.uniform(1.2, 3.5) / E, random.uniform(0.1, 0.22) / E, 1, 0.0, random.uniform(-1.2, 1.2)); return
    l, w = random.uniform(1.5, 5.5) / E, random.uniform(0.3, 0.9) / E; halm(V, F, MI, random.choices(range(7), GEW)[0], p, rich, l, w, 1, 0.0, random.uniform(-1.2, 1.2))
for i, ko in enumerate(ks):
    f = R[i] / R0[i]; ko.location = (pos[i][0], pos[i][1], 0); ko.scale = (f, f, 1)
    k = i + 1; r = ko["r0"] * f; ry = ko["ry0"] * f; kuppel = max(v.co.z for v in ko.data.vertices) - 1.5
    random.seed(7000 + k); V, F, MI = [], [], []
    for _ in range(int(r * ry * 1.4)):
        th = math.acos(random.random() ** 0.8) * 0.95; w = random.uniform(0, math.tau)
        p = Vector((r * math.sin(th) * math.cos(w), ry * math.sin(th) * math.sin(w), kuppel * math.cos(th) + 1.5))
        nrm = normiert(Vector((math.sin(th) * math.cos(w) / r, math.sin(th) * math.sin(w) / ry, math.cos(th) / kuppel)))
        zu = Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1))); tang = normiert(zu - nrm * zu.dot(nrm))
        splitter(V, F, MI, p + nrm * 0.3, normiert(tang + nrm * random.uniform(-0.2, 0.8) + Vector((random.uniform(-.4, .4), random.uniform(-.4, .4), random.uniform(-.3, .3)))))
    nm = f"{P}_haufen_{k:02d}_halme"; alt = bpy.data.objects[nm]; sam = alt.users_collection[0]; bpy.data.objects.remove(alt, do_unlink=True)
    o = mesh_objekt(nm, V, F, MI, sam, mh); o.location = (pos[i][0], pos[i][1], 0)
random.seed(11); V, F, MI = [], [], []
for _ in range(int(BX * BY / 55)):
    a = random.uniform(0, math.tau); splitter(V, F, MI, Vector((random.uniform(-BX / 2 + 4, BX / 2 - 4), random.uniform(-BY / 2 + 4, BY / 2 - 4), random.uniform(0.3, 2.4))), Vector((math.cos(a), math.sin(a), random.uniform(-0.3, 0.3))))
alt = bpy.data.objects[f"{P}_muster"]; sam = alt.users_collection[0]; bpy.data.objects.remove(alt, do_unlink=True); mesh_objekt(f"{P}_muster", V, F, MI, sam, mh).location = b.location
result = {"bedeckung": bed, "faktor_max": float((R / R0).max()), "haufen": len(ks)}
