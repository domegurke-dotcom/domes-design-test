import math, cairosvg, os
F = {
 "1-gold":   ("#f2c418","#9a700a","#fff4a0","1"),
 "2-silber": ("#c3c9d2","#6f7782","#f7f9fb","2"),
 "3-weiss":  ("#f2f2ec","#8f8f88","#ffffff","3"),
 "4-blau":   ("#2f6fd1","#183c80","#b3cfff","4"),
 "5-rot":    ("#d33a3a","#831a1a","#ffb6ae","5"),
 "6-gruen":  ("#2e9b4f","#185a2c","#b0e9c3","6"),
 "teilnehmer-braun": ("#8a5a32","#4a2e15","#d9b48c","H"),
}
GOLD=("#f2c418","#9a700a","#fff4a0")
KOPF = "M6.3,0.2 L7.1,2.1 C8.4,2.9 9.3,4.6 9.6,7.0 L9.6,9.9 L5.4,9.9 C5.2,8.8 4.9,8.0 4.4,7.5 C3.6,8.0 2.8,8.6 1.9,8.7 C1.0,8.8 0.4,8.3 0.4,7.6 C0.5,6.6 1.6,5.3 2.6,3.9 C3.3,2.9 4.2,2.0 5.0,1.6 Z"
def ring(cx,cy,ro,ri,n,rot=0):
    p=[]
    for i in range(2*n):
        r=ro if i%2==0 else ri; a=math.pi*i/n+rot
        p.append(f"{cx+r*math.sin(a):.2f},{cy-r*math.cos(a):.2f}")
    return " ".join(p)
def tail(ang,col,dark,lang=30.5):
    return (f'<g transform="rotate({ang} 16 14)"><path d="M13.4,14 L18.6,14 L18.6,{lang} L16,{lang-1.9} L13.4,{lang} Z" fill="{col}" stroke="{dark}" stroke-width=".7" stroke-linejoin="round"/>'
            f'<path d="M14.8,16 L14.8,{lang-1.7}" stroke="#fff" stroke-width=".5" opacity=".35"/></g>')
def mitte(sym,dark,goldrand=False):
    s=f'<circle cx="16" cy="13" r="6.2" fill="#fffdf4" stroke="{"#c9960f" if goldrand else dark}" stroke-width="{1.3 if goldrand else .8}"/>'
    if sym=="K":
        s+=f'<g transform="translate(11.9,8.8) scale(.82)"><path d="{KOPF}" fill="{dark}"/><circle cx="4.6" cy="3.9" r=".5" fill="#fffdf4"/></g>'
    elif sym=="V":
        s+=f'<path d="M12.6,13.3 L15.1,15.8 L19.6,10.6" fill="none" stroke="{dark}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
    elif sym=="H":
        s+=f'<path d="M13.3,16.4 L13.0,12.6 A3.05,3.05 0 1 1 19.0,12.6 L18.7,16.4" fill="none" stroke="{dark}" stroke-width="1.7" stroke-linecap="round"/>'
        s+=''.join(f'<circle cx="{x}" cy="{y}" r=".35" fill="#fffdf4"/>' for x,y in [(13.1,14.6),(13.3,11.3),(18.9,14.6),(18.7,11.3)])
    else:
        s+=f'<text x="16" y="16.6" text-anchor="middle" font-family="Georgia, \'Times New Roman\', serif" font-weight="bold" font-size="9.5" fill="{dark}">{sym}</text>'
    return s
def rosette(gid,base,dark,light,sym,stufe):
    s=f'<defs><radialGradient id="{gid}" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="{light}"/><stop offset=".55" stop-color="{base}"/><stop offset="1" stop-color="{dark}"/></radialGradient></defs>'
    gb,gd,gl=GOLD
    if stufe=="champion":
        s+=tail(-24,"#1f3f8f","#0f2050")+tail(24,"#1f3f8f","#0f2050")+tail(0,gb,gd)
        s+=f'<polygon points="{ring(16,13,13.4,11.2,28)}" fill="#1f3f8f" stroke="#0f2050" stroke-width=".7" stroke-linejoin="round"/>'
        s+=f'<polygon points="{ring(16,13,11.0,9.2,24,.06)}" fill="url(#{gid})" stroke="{dark}" stroke-width=".6" stroke-linejoin="round"/>'
    elif stufe==1:
        s+=tail(-18,base,dark)+tail(18,base,dark)
        s+=f'<polygon points="{ring(16,13,12.6,10.4,24)}" fill="url(#{gid})" stroke="{dark}" stroke-width=".7" stroke-linejoin="round"/>'
    elif stufe==2:
        s+=tail(-18,base,dark)+tail(18,base,dark)
        s+=f'<polygon points="{ring(16,13,13.4,11.6,30)}" fill="{base}" stroke="{dark}" stroke-width=".6" stroke-linejoin="round"/>'
        s+=f'<polygon points="{ring(16,13,11.3,9.6,24,.07)}" fill="url(#{gid})" stroke="{dark}" stroke-width=".6" stroke-linejoin="round"/>'
    elif stufe==3:
        s+=tail(-20,base,dark,31.2)+tail(20,base,dark,31.2)
        s+=f'<polygon points="{ring(16,13,13.6,11.8,30)}" fill="{base}" stroke="{dark}" stroke-width=".6" stroke-linejoin="round"/>'
        s+=f'<circle cx="16" cy="13" r="11.4" fill="none" stroke="{gb}" stroke-width="1.1"/>'
        s+=f'<polygon points="{ring(16,13,11.0,9.4,24,.07)}" fill="url(#{gid})" stroke="{dark}" stroke-width=".6" stroke-linejoin="round"/>'
    elif stufe==4:
        s+=tail(-22,base,dark,31.4)+tail(0,gb,gd,31.4)+tail(22,base,dark,31.4)
        s+=f'<polygon points="{ring(16,13,14.0,12.4,32)}" fill="{gb}" stroke="{gd}" stroke-width=".6" stroke-linejoin="round"/>'
        s+=f'<polygon points="{ring(16,13,12.3,10.7,28,.05)}" fill="{base}" stroke="{dark}" stroke-width=".6" stroke-linejoin="round"/>'
        s+=f'<polygon points="{ring(16,13,10.5,9.0,24,.1)}" fill="url(#{gid})" stroke="{dark}" stroke-width=".6" stroke-linejoin="round"/>'
    if stufe!=1:
        pass
    s+=f'<polygon points="{ring(16,13,8.6,7.4,18,.09)}" fill="{light}" stroke="{dark}" stroke-width=".5" stroke-linejoin="round" opacity=".9"/>'
    s+=mitte(sym,dark,goldrand=stufe in (3,4,"champion"))
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">{s}</svg>'
def save(name,svg,d):
    open(f"{d}/{name}.svg","w").write(svg)
    cairosvg.svg2png(bytestring=svg.encode(),write_to=f"{d}/{name}.png",output_width=128,output_height=128)
    cairosvg.svg2png(bytestring=svg.encode(),write_to=f"{d}/k_{name}.png",output_width=32,output_height=32)
out="neu"; os.makedirs(out,exist_ok=True)
for f in os.listdir(out): os.remove(f"{out}/{f}")
for st in (1,2,3,4):
    for k,(b,d,l,n) in F.items():
        sym = n if (st in (1,2) or n=="H") else "K"
        save(f"stufe{st}-{k}", rosette(f"g{st}{k[:3]}",b,d,l,sym,st), out)
save("champion", rosette("gch",*GOLD,"K","champion"), out)
