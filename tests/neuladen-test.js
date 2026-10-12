// Neuladen-Test (v307): Spielstände mit Pferden draußen (Weide, Sandpaddock, Pensionspferde, Fohlen) speichern, neu laden, weiterspielen.
// Start (im Repo-Ordner): NODE_PATH=/opt/node22/lib/node_modules node tests/neuladen-test.js
// Erwartet: jede Zeile „✓“ und am Ende „alles ok“.
const { chromium } = require('playwright');
const path = require('path');
const FAELLE = {
  'eigenes Pferd auf der Weide': () => { const p = neu('Wiese'); aufWeide(p, boxVon(p), null, weiden()[0].wid); return p; },
  'eigenes Pferd im Sandpaddock': () => { const p = neu('Sand'); paddockDa(); rausAusBox(boxVon(p)); p.paddock = { seit: spiel.tag, pid: 'gpdT' }; return p; },
  'Pensionspferd auf der Weide': () => { const p = einsteller(); aufWeide(p, boxVon(p), null, weiden()[0].wid); return p; },
  'Pensionspferd im Sandpaddock': () => { const p = einsteller(); paddockDa(); rausAusBox(boxVon(p)); p.paddock = { seit: spiel.tag, pid: 'gpdT' }; return p; },
  'Pensionspferd nachmittags draußen': () => { const p = einsteller(); p.weideNachm = { tag: spiel.tag, ma: 'x', name: 'Test' }; return p; },
  'Weide-Pferd mit gelöschter Weide': () => { const p = neu('Weg'); aufWeide(p, boxVon(p), null, weiden()[0].wid); p.weide.wid = 'w-gibts-nicht'; return p; },
  'Paddock-Pferd mit gelöschtem Paddock': () => { const p = neu('Weg2'); rausAusBox(boxVon(p)); p.paddock = { seit: spiel.tag, pid: 'gibts-nicht' }; return p; },
};
(async () => {
  const b = await chromium.launch(); const L = [];
  for (const [name] of Object.entries(FAELLE)) {
    const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = [];
    pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
    await pg.click('#smNeu'); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(200); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(200);
    await pg.evaluate(src => {
      window.zu = () => { $('dlg').hidden = true; };
      window.boxVon = p => spiel.boxen.find(x => x.pferd && x.pferd.id === p.id);
      window.neu = n => { const p = neuesPferd({ rasse: 'haflinger', geschlecht: 'Stute', alter: 7, name: n }); pferdEinstellen(p, 2000, 'Händler'); zu(); const bx = spiel.boxen.find(x => x.pferd && x.pferd.name === n); delete bx.quar; return bx.pferd; };
      window.einsteller = () => { pensionAnfrageNeu(); const a = spiel.pensionAnfragen[spiel.pensionAnfragen.length - 1]; a.bluttest = 'vorher'; pensionAnnehmen(a); a.tag = spiel.tag - 1; pensionEinzug(); zu(); const bx = spiel.boxen.find(x => x.pferd && x.pferd.einsteller); delete bx.quar; return bx.pferd; };
      window.paddockDa = () => { if (!gebaeude().some(g => g.gid === 'gpdT')) gebaeude().push({ gid: 'gpdT', typ: 'sandpaddock', stufe: 1, zustand: 100 }); };
      spiel.hof.weideHa = Math.max(spiel.hof.weideHa || 0, 2); spiel.anlage.weide = true;
      const p = eval('(' + src + ')')(); aktBox = spiel.boxen.indexOf(boxVon(p)); spiel.aktBox = aktBox; speichern();
    }, FAELLE[name].toString());
    await pg.reload(); await pg.waitForTimeout(800);
    const start = await pg.evaluate(() => { const s = document.getElementById('smWeiter'); return !!(s && s.offsetParent !== null && !s.disabled); });
    let weiter = false;
    if (start) { await pg.click('#smWeiter'); await pg.waitForTimeout(400);
      weiter = await pg.evaluate(() => { zeigeAkte(); zeigeStall(); tagBeenden(); return true; }).catch(e => { errs.push(e.message); return false; }); await pg.waitForTimeout(2500); }
    L.push([start && weiter && !errs.length ? '✓' : '✗', name, start ? '' : 'kein Startmenü', errs.join(' | ')]);
    await pg.close();
  }
  L.forEach(x => console.log(x.filter(Boolean).join('  ')));
  console.log(L.every(x => x[0] === '✓') ? 'alles ok' : 'FEHLER');
  await b.close();
})();
