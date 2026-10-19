// Auswertung der Zucht-Studie: node tests/zucht-auswertung.js <Ordner>
const fs=require('fs'),path=require('path');const dir=process.argv[2];const TPJ=7;
const G={};const rasse={};
fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort().forEach(f=>{const e=JSON.parse(fs.readFileSync(path.join(dir,f)));
 Object.entries(e.varianten).forEach(([v,L])=>{const X=(G[v]=G[v]||{laeufe:0,vers:0,tr:0,vE:0,tE:0,vD:0,tD:0,saisonN:0,saisonT:0,saisonS:[0,0,0,0],saisonST:[0,0,0,0],fohlen:0,verfohlt:0,erbTot:0,lw:0,erbTod:0,schwach:0,tod:[],befunde:0,befundeBeiFuss:0,befArt:{},erb:0,erbArt:{},sperre:{},warn:0,aus:0,stutenTot:[],ts:0,waise:0,intervall:[],deck:0,ta:0,erwartet:{},geb1:0,fehler:new Set(),abfohl:0,schwachAbf:0});
  const R=(rasse[e.rasse]=rasse[e.rasse]||{});const RR=(R[v]=R[v]||{fohlen:0,tr:0,vers:0,tot:0,erb:0,schwach:0,l:0});
  L.forEach(M=>{X.laeufe++;RR.l++;X.vers+=M.versuche;X.tr+=M.tragend;X.vE+=M.versucheEigen;X.tE+=M.tragendEigen;X.vD+=M.versucheDeck;X.tD+=M.tragendDeck;RR.vers+=M.versuche;RR.tr+=M.tragend;
   Object.values(M.saison).forEach(s=>{X.saisonN++;X.saisonS[s.s]++;if(s.tragend){X.saisonT++;X.saisonST[s.s]++;}});
   X.fohlen+=M.fohlen.length;RR.fohlen+=M.fohlen.length;X.verfohlt+=M.verfohlt;X.warn+=M.warnung;X.aus+=M.ausweich;X.ts+=M.tierschutz||0;X.deck+=M.kosten.deck;X.ta+=M.kosten.tierarzt;
   Object.keys(M.fehler).forEach(k=>X.fehler.add(k));(M.seitenFehler||[]).forEach(k=>X.fehler.add('Seite: '+k));
   Object.entries(M.sperre).forEach(([k,n])=>X.sperre[k]=(X.sperre[k]||0)+n);M.stutenTot.forEach(s=>X.stutenTot.push(s.ursache));
   const gebJe={};M.fohlen.forEach(o=>{(gebJe[o.mutter]=gebJe[o.mutter]||[]).push(o.tag);if(o.erbTot)X.erbTot++;if(o.lw)X.lw++;if(o.erbTod)X.erbTod++;if(o.ges0!=null&&o.ges0<100){X.schwach++;RR.schwach++;if(o.abfohl)X.schwachAbf++;}if(o.abfohl)X.abfohl++;if(o.waise)X.waise++;
    const krank=o.erb.filter(k=>M.erwartet[k]&&true);if(o.erb.length){X.erb++;RR.erb++;o.erb.forEach(k=>X.erbArt[M.erbNamen[k]||k]=(X.erbArt[M.erbNamen[k]||k]||0)+1);}
    if(o.tod){X.tod.push([o.tod.ursache,o.tod.alterTage]);RR.tot++;}
    o.befunde.forEach(b=>{X.befunde++;if(b.beiFuss)X.befundeBeiFuss++;const n=M.krankNamen[b.art]||b.art;X.befArt[n]=(X.befArt[n]||0)+1;});});
   Object.values(gebJe).forEach(t=>{t.sort((a,b)=>a-b);for(let i=1;i<t.length;i++)X.intervall.push((t[i]-t[i-1])/TPJ);});
   Object.entries(M.erwartet).forEach(([k,w])=>{X.erwartet[M.erbNamen[k]||k]=X.erwartet[M.erbNamen[k]||k]||[];X.erwartet[M.erbNamen[k]||k].push(w.betroffen);});
  });});});
const p=(a,b)=>b?(a/b*100).toFixed(1)+' %':'–';
Object.entries(G).forEach(([v,X])=>{const st=X.laeufe*10;const iv={};X.intervall.forEach(x=>iv[x]=(iv[x]||0)+1);
 const tb=X.tod.filter(([,t])=>t<=2*TPJ).length;
 console.log(`\n=== Variante ${v} (${X.laeufe} Läufe, ${st} Stuten × 4 Jahre)`);
 console.log(`Deckversuche ${X.vers}, tragend ${X.tr} = ${p(X.tr,X.vers)} je Versuch (eigener Hengst ${p(X.tE,X.vE)}, Deckstation ${p(X.tD,X.vD)})`);
 console.log(`Stute-Jahreszeiten mit Deckversuch ${X.saisonN}, davon tragend ${p(X.saisonT,X.saisonN)}; nach Jahreszeit (Fr/So/He/Wi): ${X.saisonS.map((n,i)=>`${n}:${p(X.saisonST[i],n)}`).join(' · ')}`);
 console.log(`Fohlen ${X.fohlen} = ${(X.fohlen/st).toFixed(2)} je Stute in 4 Jahren (${(X.fohlen/st/3).toFixed(2)} je Stute und Jahr ab Jahr 2); Abstand zwischen 2 Geburten (Jahreszeiten): ${JSON.stringify(iv)}`);
 console.log(`verfohlt ${X.verfohlt} · Totgeburt (Erbkrankheit) ${X.erbTot} · Lethal White ${X.lw} · später tödliche Erbkrankheit ${X.erbTod} · schwach geboren ${X.schwach} (${p(X.schwach,X.fohlen)}; davon in Abfohlbox ${X.schwachAbf} von ${X.abfohl}) · Waisen ${X.waise} · zum Tierschutz ${X.ts}`);
 console.log(`Fohlen gestorben ${X.tod.length} (${p(X.tod.length,X.fohlen)}), davon bis Absetzen ${tb}: ${JSON.stringify(X.tod)}`);
 console.log(`Fohlen mit Erbkrankheit (betroffen/Anlage) ${X.erb} ${JSON.stringify(X.erbArt)}`);
 console.log(`Befunde der Fohlen bis 1 Jahr: ${X.befunde} (${(X.befunde/Math.max(1,X.fohlen)).toFixed(2)} je Fohlen), davon bei Fuß ${X.befundeBeiFuss}: ${Object.entries(X.befArt).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,n])=>k+' '+n).join(', ')}`);
 console.log(`Zuchtsperre (Stuten-Tage): ${JSON.stringify(X.sperre)} · Warnungen ${X.warn} · anderer Hengst ${X.aus} · Stuten tot ${JSON.stringify(X.stutenTot)}`);
 console.log(`Decktaxe je Lauf ${Math.round(X.deck/X.laeufe)} € · Tierarzt je Lauf ${Math.round(X.ta/X.laeufe)} €${X.fehler.size?' · FEHLER '+[...X.fehler].join('; '):''}`);
 console.log(`erwartet betroffen je Fohlen (Rasse, Mittel): ${Object.entries(X.erwartet).map(([k,a])=>k+' '+(a.reduce((x,y)=>x+y,0)/a.length*100).toFixed(2)+'%').join(', ')}`);});
console.log('\n| Rasse | A Fohlen/Lauf | A tragend/Versuch | B Fohlen/Lauf | B tragend/Versuch | Fohlen tot A/B | erbbetroffen A/B | schwach A/B |');
Object.entries(rasse).forEach(([r,R])=>{const a=R.A||{},b=R.B||{};console.log(`| ${r} | ${(a.fohlen/a.l).toFixed(1)} | ${p(a.tr,a.vers)} | ${(b.fohlen/b.l).toFixed(1)} | ${p(b.tr,b.vers)} | ${a.tot}/${b.tot} | ${a.erb}/${b.erb} | ${a.schwach}/${b.schwach} |`);});
