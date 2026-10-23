import json, re
R = json.load(open('roh.json'))
def clean(s, ids):
    s = re.sub(r'\s+(inkscape|sodipodi):[a-zA-Z\-]+="[^"]*"', '', s)
    s = re.sub(r'\s+style=""', '', s)
    def idrep(m): return m.group(0) if m.group(1) in ids else ''
    s = re.sub(r'\s+id="([^"]*)"', idrep, s)
    s = re.sub(r'\s+', ' ', s); s = re.sub(r'> <', '><', s)
    s = re.sub(r'(\d+\.\d{2})\d+', r'\1', s)   # Zahlen auf 2 Nachkommastellen
    return s
W = 480; H = 590; Y0 = 48
out = {'w': [], 'm': []}
for r in R:
    ids = set(r['ids'])
    x, y, w, h = r['bb']
    cx = x + w / 2
    vb = f"{cx - W/2:.0f} {Y0} {W} {H}"
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">' + ('<defs>' + clean(r['defs'], ids) + '</defs>' if r['defs'] else '') + clean(r['body'], ids) + '</svg>'
    out[r['gs']].append(svg)
print(len(out['w']), len(out['m']), sum(len(s) for s in out['w']+out['m']))
js = '// Domes Mitarbeiter-Avatare (aus avatare.svg, 23.10.2026) – w = Frauen, m = Männer; nicht von Hand ändern, siehe werkzeuge/avatare-export.md\nwindow.MA_BILDER = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n'
open('avatare.js', 'w').write(js)
for gs in 'wm':
    for i, s in enumerate(out[gs]): open(f'a-{gs}{i+1}.svg', 'w').write(s)
