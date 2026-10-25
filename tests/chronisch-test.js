// v837: bekannter chronischer Befund meldet sich nicht dauernd (Denkblase/roter Punkt), erst wieder, wenn er schlimmer wird
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } });
  await pg.addInitScript(() => { localStorage.setItem("zuchtstall-boxfenster", "1"); });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + __dirname + '/../index.html'); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const r = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false;
    const p = neuesPferd({ rein: true, rasse: "andalusier", geschlecht: "Wallach", alter: 12, name: "Paul" }); p.pflege = erzeugePflege(p); spiel.boxen[0].pferd = p; aktBox = 0;
    const x = befundNeu(p, "melanom", 2, "Schimmel"); delete x.inkub; x.bemerkt = { von: "du", tag: spiel.tag };
    const st = () => { const D = bxDaten(p, spiel.boxen[0]); return [D.offen.length > 0]; };
    const a = st()[0]; x.diagnose = spiel.tag; x.tierarzt = true; x.beh = true; const b = st()[0]; x.grad = 3; const c = st()[0]; x.gradOk = 3; const d = st()[0];
    return { neu: a, bekannt: b, schlimmer: c, nachTierarzt: d }; });
  const ok = (n, v) => console.log((v ? "✓ " : "✗ ") + n);
  ok("neu bemerkt meldet sich", r.neu); ok("bekannt chronisch ruhig", !r.bekannt); ok("schlimmer meldet sich wieder", r.schlimmer); ok("nach Tierarzt wieder ruhig", !r.nachTierarzt); ok("keine Fehler " + errs.join(";"), !errs.length);
  await b.close(); })();
