// v838: Stallbursche mistet den Sandpaddock in der Morgenrunde – morgens ist er sauber
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + __dirname + '/../index.html'); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const r = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.admin = true; spiel.geld = 99999;
    gebaeude().push({ gid: 'gp1', typ: 'sandpaddock', stufe: 1, zustand: 100 }); (spiel.anlage = spiel.anlage || {}).paddock = true;
    const pd = paddocks()[0]; if (!pd) return { kein: true };
    const p = neuesPferd({ rein: true, rasse: "quarter", geschlecht: "Wallach", alter: 8, name: "Joker" }); p.pflege = erzeugePflege(p); spiel.boxen[0].pferd = p;
    const ohne = (() => { pd.mist = 3; spiel.mitarbeiter = []; paddockMistenMorgen(); return pd.mist; })();
    spiel.mitarbeiter = [{ id: "m1", name: "Jakob", typ: "stallbursche", ab: jzJetzt(), bis: null, gehalt: 300, zufr: 70, w: false, wissen: {}, eig: [] }];
    pd.mist = 3; const da = aktive("stallbursche").length; paddockMistenMorgen(); const mit = pd.mist;
    pd.mist = 0; p.paddock = { seit: spiel.tag, pid: pd.gid }; spiel.boxen[0].krippeVoll = true; let nacht = null, fehl = null; try { naechsteNacht(); nacht = paddocks()[0].mist || 0; } catch (e) { fehl = String(e); }
    return { ohne, da, mit, nacht, fehl }; });
  const ok = (n, v) => console.log((v ? "✓ " : "✗ ") + n);
  if (r.kein) { ok("Sandpaddock gebaut", false); } else {
  ok("ohne Mitarbeiter bleibt der Mist liegen", r.ohne === 3); ok("Stallbursche ist da", r.da === 1); ok("Stallbursche mistet morgens den Sandpaddock", r.mit === 0); ok("nach einer echten Nacht ist der Sandpaddock morgens sauber", r.nacht === 0); }
  ok("keine Fehler " + errs.join(";"), !errs.length); console.log(JSON.stringify(r));
  await b.close(); })();
