const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1025,height:850}});await p.goto('file://'+process.cwd()+'/avatare.svg');
const res=await p.evaluate(()=>{
 const defs=document.querySelector('defs');const defMap={};[...defs.children].forEach(d=>{if(d.id)defMap[d.id]=d;});
 const refs=el=>{const s=el.outerHTML,r=new Set();for(const m of s.matchAll(/url\(#([^)]+)\)/g))r.add(m[1]);for(const m of s.matchAll(/href="#([^"]+)"/g))r.add(m[1]);return r;};
 const out=[];
 ['layer3','layer4'].forEach(lid=>{[...document.getElementById(lid).children].filter(k=>k.tagName==='g').forEach(g=>out.push({gs:lid==='layer3'?'w':'m',g}));});
 const all=out.map(o=>o.g);
 return out.map((o,i)=>{ all.forEach((g,j)=>g.style.display=i===j?'':'none'); const q=o.g.getBoundingClientRect(); const bb=[q.x,q.y,q.width,q.height];
  o.g.style.display='';
  const used=new Set(),todo=[...refs(o.g)];while(todo.length){const id=todo.pop();if(used.has(id)||!defMap[id])continue;used.add(id);refs(defMap[id]).forEach(r=>todo.push(r));}
  const defsTxt=[...defs.children].filter(d=>used.has(d.id)).map(d=>d.outerHTML).join('');
  return {gs:o.gs,id:o.g.id,bb,defs:defsTxt,body:o.g.outerHTML,ids:[...used]}; });
});
fs.writeFileSync('roh.json',JSON.stringify(res));console.log(res.length,res.map(r=>Math.round(r.defs.length/1000)+'k/'+Math.round(r.body.length/1000)+'k').join(' '));
await b.close()})();
