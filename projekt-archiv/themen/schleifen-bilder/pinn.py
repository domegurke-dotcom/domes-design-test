import re, cairosvg, random
def inner(name):
    s=open(f"neu/{name}.svg").read()
    return re.sub(r'^<svg[^>]*>|</svg>$','',s)
def pinnwand(namen, x=266, y=72, w=72, h=56, uid="p"):
    out=[f'<g id="pinnwand">',
      f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="#8f6a45" stroke="#2b1d14" stroke-width="1.4"/>',
      f'<rect x="{x+3.5}" y="{y+3.5}" width="{w-7}" height="{h-7}" rx="1.5" fill="#c8955a" stroke="#2b1d14" stroke-width=".8"/>']
    random.seed(4)
    for _ in range(26):
        out.append(f'<circle cx="{x+5+random.random()*(w-10):.1f}" cy="{y+5+random.random()*(h-10):.1f}" r=".6" fill="#a8743f" opacity=".7"/>')
    cols,rows,pitch_x,pitch_y,sz=4,3,16.5,15.8,13.5
    ox=x+(w-cols*pitch_x)/2; oy=y+5
    pins=["#d33a3a","#2f6fd1","#f2c418","#2e9b4f"]
    for i,n in enumerate(namen[:cols*rows]):
        c,r=i%cols,i//cols
        cx=ox+c*pitch_x+pitch_x/2; top=oy+r*pitch_y
        rot=[-3,2,-1.5,3,0,-2.5][i%6]
        out.append(f'<g transform="rotate({rot} {cx:.1f} {top:.1f})"><svg x="{cx-sz/2:.1f}" y="{top-0.5:.1f}" width="{sz}" height="{sz}" viewBox="0 0 32 32">{inner(n)}</svg>'
                   f'<circle cx="{cx:.1f}" cy="{top+0.6:.1f}" r="1.5" fill="{pins[i%4]}" stroke="#2b1d14" stroke-width=".6"/><circle cx="{cx-.4:.1f}" cy="{top:.1f}" r=".45" fill="#fff" opacity=".8"/></g>')
    out.append('</g>')
    return "".join(out)
beispiel=["champion","stufe3-1-gold","stufe2-1-gold","stufe2-2-silber","stufe1-3-weiss","stufe1-teilnehmer-braun","stufe2-4-blau","stufe1-5-rot","stufe1-6-gruen","stufe1-teilnehmer-braun"]
open("pinnwand.svg","w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="262 78 80 76" width="80" height="76">{pinnwand(beispiel)}</svg>')
cairosvg.svg2png(url="pinnwand.svg",write_to="pinnwand.png",output_width=480,output_height=456,background_color="white")
for s in (1,3):
    b=open(f"box{s}.svg").read()
    b=b.replace("</svg>",pinnwand(beispiel)+"</svg>")
    # Schild und Plaketten andeuten
    b=b.replace("</svg>",'<rect x="170" y="40" width="60" height="18" rx="3" fill="#fffaf0" stroke="#2b1d14" stroke-width="1.6"/><text x="200" y="53.5" text-anchor="middle" font-size="11" font-weight="700" font-family="sans-serif">Box 1</text></svg>')
    open(f"box{s}-pinnwand.svg","w").write(b)
    cairosvg.svg2png(bytestring=b.encode(),write_to=f"box{s}-pinnwand.png",output_width=800,output_height=600)

open("pinnwand-fragment.svg","w").write(pinnwand(beispiel))
