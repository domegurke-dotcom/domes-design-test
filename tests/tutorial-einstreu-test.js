// Tutorial 2 „Richtig füttern“ (v862, Dome 27.10.): am Ende die Box einstreuen – Ring Pflege → Einstreu ändern → Späne, danach Erklärung
// Start (Domes PC, siehe CLAUDE.md): node tests/tutorial-einstreu-test.js [BxH]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '1366x768').split('x').map(Number);
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { try { localStorage.setItem('zuchtstall-boxfenster', '1'); } catch (e) { } });
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; tutorialStart({ ...spiel.spieler }, 7, null, 'anf', 1); }); await pg.waitForTimeout(1500);
  await pg.evaluate(() => { const T = spiel.tutorial, K = tutListe()[T.kap]; T.schritt = K.schritte.findIndex(s => s[0] === 'Versorgung öffnen'); futterkammer().lager.spaene = 20; spiel.boxen[0].einstreu = 'spaene'; });
  await pg.waitForTimeout(800);
  const st = () => pg.evaluate(() => { const T = spiel.tutorial, K = tutListe()[T.kap], bl = document.getElementById('hinweisBlase'); return { s: T.schritt, nach: T.nach, titel: (K.schritte[T.schritt] || [''])[0], fertig: T.geschafft === T.kap, blase: bl && !bl.hidden ? bl.textContent.slice(0, 90) : '' }; });
  const klick = async sel => { const el = await pg.$(sel); if (!el) return false; await el.scrollIntoViewIfNeeded().catch(() => { }); await pg.waitForTimeout(300); const r = await el.boundingBox(); if (!r) return false; await pg.mouse.click(r.x + r.width / 2, r.y + r.height / 2); await pg.waitForTimeout(500); return true; };
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  const s0 = await st(); ok('Schritt „Versorgung öffnen“ wird gezeigt', s0.titel === 'Versorgung öffnen' && /Einstreu/.test(s0.blase), s0.blase);
  if (!(await klick('#kopfRinge [data-vstab="heute"]:not([hidden])')) || (await st()).titel === 'Versorgung öffnen') await klick('.bx-bal[data-vstab="heute"]'); const s1 = await st(); ok('Ring öffnet die Versorgung', s1.titel === 'Einstreu ändern', s1.titel);
  if (process.env.LAUT) console.log('vor ändern', JSON.stringify(await pg.evaluate(() => { const a = document.getElementById('einstreuAendern'); if (!a) return 'kein Knopf'; const r = a.getBoundingClientRect(), e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { r: [Math.round(r.x), Math.round(r.y), Math.round(r.width)], oben: e && (e.id || e.className), tab: bxTab }; })));
  await klick('#einstreuAendern'); const s2 = await st(); ok('„ändern“ öffnet die Einstreu-Wahl', s2.titel === 'Späne wählen', s2.titel);
  await klick('[data-estreu="spaene"]'); await pg.waitForTimeout(600); const s3 = await st(); ok('Späne gewählt → Erklärung danach', s3.nach === s2.s && /nackt|Einstreu/.test(s3.blase), s3.blase);
  await klick('#hinweisBlase p'); await pg.waitForTimeout(800); const s4 = await st(); ok('Kapitel geschafft', s4.fertig, JSON.stringify(s4));
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(`${W}x${H}\n` + out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
