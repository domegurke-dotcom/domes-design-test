// v841: Ringe oben öffnen draußen (Weide) denselben Reiter wie in der Box, mit „Zurück in die Box“; Klemmbrett ohne Bildcode
const { chromium } = require('playwright'); const R = [], ok = (n, v, d) => R.push((v ? '✓ ' : '✗ ') + n + (v || d == null ? '' : ' – ' + d));
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } });
  await pg.addInitScript(() => { localStorage.setItem("zuchtstall-boxfenster", "1"); });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + __dirname + '/../index.html'); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false;
    const mk = (i, n) => { const p = neuesPferd({ rein: true, rasse: "quarter", geschlecht: "Wallach", alter: 8, name: n }); p.pflege = erzeugePflege(p); spiel.boxen[i].pferd = p; return p; };
    const a = mk(0, "Innen"), q = mk(1, "Draussen"); const e = (n, p) => ({ eid: n, vn: "Anna", nn: n, pferdId: p.id, leistungen: { putzen: true }, haltung: "weide", preis: 200, zufr: 70 });
    spiel.einsteller = [e("e1", a), e("e2", q)]; a.einsteller = "e1"; q.einsteller = "e2";
    const w = weiden()[0]; q.weide = { seit: spiel.tag, wid: w.wid }; aktBox = 0; zeigeSchirm(null); zeigeStall(); zeigeTag(); });
  for (const bx of [0, 1]) { await pg.evaluate(i => { aktBox = i; zeigeStall(); }, bx); await pg.waitForTimeout(500);
    for (let r = 0; r < 3; r++) { await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.hofFenster = []; }); const kr = await pg.$$('#kopfRinge .kring'); if (!kr[r]) { console.log(bx, r, "kein Ring"); continue; } await kr[r].click({ force: true }); await pg.waitForTimeout(400);
      const st = await pg.evaluate(() => ({ titel: (document.querySelector('#info .info-kopf') || {}).innerText, tab: [...document.querySelectorAll('#info [data-vstab].an, #info [data-vstab].aktiv, #info [data-vstab][aria-selected="true"]')].map(x => x.dataset.vstab).join(","), anfang: (document.getElementById('info').innerText || "").replace(/\s+/g, " ").slice(0, 160), offen: document.body.classList.contains('infoOffen') }));
      ok(`${bx ? 'draußen' : 'Box'}: Ring ${r + 1} öffnet Reiter ${['gesund', 'heute', 'besitzer'][r]}`, st.tab === ['gesund', 'heute', 'besitzer'][r], st.tab); if (bx) ok(`draußen: Ring ${r + 1} zeigt „ist auf der Weide“ und nicht die alte Weide-Karte`, /ist auf der Weide 🏠 Zurück in die Box/.test(st.anfang) && !/Gerade ist kein anderes/.test(st.anfang), st.anfang);
      if (r === 1) ok(`${bx ? 'draußen' : 'Box'}: Klemmbrett ohne Bildcode`, !/viewBox/.test(await pg.evaluate(() => document.getElementById('info').innerText)));
      await pg.keyboard.press('Escape'); await pg.waitForTimeout(300); } }
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; aktBox = 1; zeigeStall(); }); await pg.waitForTimeout(400);
  const kr = await pg.$$('#kopfRinge .kring'); await kr[0].click({ force: true }); await pg.waitForTimeout(400);
  const k = await pg.$('#vsHeim'); ok('Knopf „Zurück in die Box“ da', !!k); if (k) { await k.click({ force: true }); await pg.waitForTimeout(400); ok('Knopf holt das Pferd zurück', !(await pg.evaluate(() => !!B().pferd.weide))); }
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
