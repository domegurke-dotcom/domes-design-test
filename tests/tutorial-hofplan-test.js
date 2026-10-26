// Tutorial T-D/T-E (v859): Anfänger-Kapitel „Hofausbau“ mit echten Klicks – Hofplan, Kreis, Reparieren mit ✔, Anbau mit Blaupause, Verschieben, Bauland – und „erst tippen, dann erklären“
// Start (Domes PC, siehe CLAUDE.md): node tests/tutorial-hofplan-test.js [BxH]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '1366x768').split('x').map(Number);
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { try { localStorage.setItem('zuchtstall-boxfenster', '1'); } catch (e) { } });
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const k = TUT.findIndex(x => x.n === 'Hofausbau'); tutorialStart({ ...spiel.spieler }, 7, null, 'anf', k); });
  await pg.waitForTimeout(1500); if (process.env.LAUT) console.log('Start', JSON.stringify(await pg.evaluate(() => ({ t: !!spiel.tutorial, kap: spiel.tutorial && spiel.tutorial.kap }))));
  const out = [], ok = (n, c, x) => { const l = (c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''); out.push(l); if (process.env.LAUT) console.log(l); };
  const st = () => pg.evaluate(() => { const T = spiel.tutorial, K = tutListe()[T.kap], bl = document.getElementById('hinweisBlase'); return { s: T.schritt, nach: T.nach, titel: K.schritte[Math.min(T.schritt, K.schritte.length - 1)][0], fertig: T.geschafft === T.kap, blase: bl && !bl.hidden ? bl.textContent.slice(0, 120) : '' }; });
  const warte = async (fn, ms = 4000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const s = await st(); if (fn(s)) return s; await pg.waitForTimeout(150); } return await st(); };
  let verdeckt = 0;
  const klick = async sel => { let el = await pg.$(sel); if (!el) return false; await el.scrollIntoViewIfNeeded().catch(() => { }); await pg.waitForTimeout(400); el = await pg.$(sel); if (!el) return false; const r = await el.boundingBox(); if (!r) return false;
    if (!sel.includes('hinweisBlase') && await pg.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!(e && e.closest('#hinweisBlase')); }, [r.x + r.width / 2, r.y + r.height / 2])) { verdeckt++; await pg.mouse.click(r.x + r.width / 2, r.y + r.height / 2); await pg.waitForTimeout(300); }   // wie eine Spielerin: liegt die Blase darüber, erst sie wegtippen
    await pg.mouse.click(r.x + r.width / 2, r.y + r.height / 2); await pg.waitForTimeout(350); return true; };   // erst hinscrollen, kurz warten (die Blase richtet sich aus), dann an die neue Stelle tippen
  const blaseWeiter = async () => { await pg.waitForTimeout(500); await klick('#hinweisBlase p'); };
  const schritt = async (name, sel, mitNach) => { const s0 = await st(); if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + '/' + W + 'x' + H + '-' + s0.s + '.png' }); if (process.env.LAUT) await pg.evaluate(() => { if (window.__ev) return; window.__ev = []; ['pointerdown', 'mousedown', 'pointerup', 'click'].forEach(t => window.addEventListener(t, e => { const x = e.target; window.__ev.push(t + ':' + (x.tagName || '') + (x.id ? '#' + x.id : '') + (typeof x.className === 'string' && x.className ? '.' + x.className.split(' ')[0] : '') + (x.getAttribute && x.getAttribute('aria-label') ? '[' + x.getAttribute('aria-label') + ']' : '')); }, true)); });
    const da = await klick(sel); if (process.env.LAUT) console.log('Ereignisse', JSON.stringify(await pg.evaluate(() => window.__ev.splice(0)))); let s = await warte(x => mitNach ? x.nach === s0.s : x.s > s0.s);
    if (mitNach && process.env.BILD && s.nach !== s0.s) { await pg.screenshot({ path: process.env.BILD + '/' + W + 'x' + H + '-' + s0.s + '-nach.png' }); console.log('Zustand', JSON.stringify(await pg.evaluate(() => ({ oben: (() => { const a = document.querySelector('.plan-radial [data-ri][aria-label*="Anbauen"]'); if (!a) return 'kein Knopf'; const r = a.getBoundingClientRect(), e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return (e && (e.id || e.className || e.tagName)) + ' @' + Math.round(r.x) + ',' + Math.round(r.y); })(), blase: (() => { const b = document.getElementById('hinweisBlase'); return b ? b.hidden + '|' + b.style.cssText.slice(0, 80) : '-'; })(), erl: (() => { const a = document.querySelector('.plan-radial [data-ri][aria-label*="Anbauen"]'), h = document.querySelector('.plan-leiste.radial [data-anbau]'); return [a && tutErlaubt(a), h && tutErlaubt(h), !!h]; })(), pv: !!planVorschau, dlg: document.getElementById('dlg').hidden ? '' : document.getElementById('dlgInhalt').textContent.slice(0, 100), wahl: planWahl })))); console.log('JS-Klick', JSON.stringify(await pg.evaluate(() => { const a = document.querySelector('.plan-radial [data-ri][aria-label*="Anbauen"]'); let f = null; try { a.click(); } catch (e) { f = e.message; } return { pv: !!planVorschau, f, ri: a && a.dataset.ri, n: document.querySelectorAll('.plan-leiste.radial .plan-kn button, .plan-leiste.radial [data-pdreh], .plan-leiste.radial [data-pinfo]').length, lab: [...document.querySelectorAll('.plan-radial [data-ri]')].map(x => x.dataset.ri + x.getAttribute('aria-label')).join(',') }; }))); }
    if (mitNach) { const zeigt = s.nach === s0.s && s.blase.length > 0, txt = s.blase; await blaseWeiter(); s = await warte(x => x.s > s0.s); ok(name + ': erst tippen, dann Erklärung', da && zeigt && s.s > s0.s, `${s0.titel} → ${s.titel} | ${zeigt ? 'Erklärung: ' + txt.slice(0, 70) : 'keine Erklärung'}`); }
    else ok(name, da && s.s > s0.s, `${s0.titel} → ${s.titel}`); if (process.env.BILD && s.s <= s0.s) { await pg.screenshot({ path: process.env.BILD + '/' + W + 'x' + H + '-' + s0.s + '-nach.png' }); console.log('Zustand', JSON.stringify(await pg.evaluate(() => ({ oben: (() => { const a = document.querySelector('.plan-radial [data-ri][aria-label*="Anbauen"]'); if (!a) return 'kein Knopf'; const r = a.getBoundingClientRect(), e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return (e && (e.id || e.className || e.tagName)) + ' @' + Math.round(r.x) + ',' + Math.round(r.y); })(), blase: (() => { const b = document.getElementById('hinweisBlase'); return b ? b.hidden + '|' + b.style.cssText.slice(0, 80) : '-'; })(), pv: !!planVorschau, dlg: document.getElementById('dlg').hidden ? '' : document.getElementById('dlgInhalt').textContent.slice(0, 100), wahl: planWahl })))); } return s; };
  await schritt('Hofverwaltung', '#hmHof');
  if ((await st()).titel === 'Hof') await schritt('Hof', '[data-hr="hof"]');   // ist der Reiter Hof schon offen, ist der Schritt von selbst erledigt
  await schritt('Hofplan', '[data-hbereich="plan"]', true);
  await schritt('Stall antippen', '#planSvg [data-ptyp="stall"]', true);
  await schritt('Reparieren im Kreis', '.plan-radial [data-ri][aria-label*="Reparieren"]', true);
  await schritt('✔ bestätigt die Reparatur', '.plan-radial [data-vr="ok"]');
  await schritt('OK', '#dlgKnoepfe button[data-txt="OK"]');
  if (!(await pg.$('.plan-radial [data-ri][aria-label*="Anbauen"]'))) await klick('#planSvg [data-ptyp="stall"]');
  await schritt('Anbauen im Kreis → Blaupause', '.plan-radial [data-ri][aria-label*="Anbauen"]', true);
  await schritt('Blaupause antippen', '#planSvg [data-ptyp="stall"]', true);
  await schritt('✔ bestätigt den Anbau', '.plan-radial [data-vr="ok"]', true);
  // Verschieben: ein anderes Gebäude mit der Maus ziehen (verschiedene Richtungen, bis es passt)
  { const s0 = await st(); const ziel = await pg.$('#planSvg [data-ptyp]:not([data-ptyp="stall"])'); let bewegt = false;
    if (ziel) { const r = await ziel.boundingBox(); for (const [dx, dy] of [[0, 60], [0, -60], [80, 0], [-80, 0], [0, 120], [120, 0], [0, -120], [-120, 0]]) { await pg.mouse.move(r.x + r.width / 2, r.y + r.height / 2); await pg.mouse.down(); await pg.waitForTimeout(250); await pg.mouse.move(r.x + r.width / 2 + dx / 2, r.y + r.height / 2 + dy / 2, { steps: 4 }); await pg.mouse.move(r.x + r.width / 2 + dx, r.y + r.height / 2 + dy, { steps: 4 }); await pg.mouse.up(); await pg.waitForTimeout(500); const s = await st(); if (s.nach === s0.s) { bewegt = true; break; } } }
    const s1 = await st(); const zeigt = s1.nach === s0.s && s1.blase.length > 0; await blaseWeiter(); const s2 = await warte(x => x.s > s0.s); ok('Verschieben: ziehen, dann Erklärung', bewegt && zeigt && s2.s > s0.s, `${s0.titel} → ${s2.titel}`); }
  await schritt('Bauland kaufen', '[data-plkauf]', true);
  await schritt('Abbrechen', '[data-plab]');
  { const s0 = await st(); await blaseWeiter(); const s = await warte(x => x.fertig); ok('Kapitel geschafft', s.fertig, s0.titel + ' → ' + (s.fertig ? 'geschafft' : s.titel)); }
  const k = await pg.evaluate(() => { const g = gebaeude().find(x => x.typ === 'stall' && !x.anbau); return { rep: !!(g && g.rep), anbau: gebaeude().some(x => x.anbau && x.bau) }; });
  ok('Stall repariert und Anbau beauftragt', k.rep && k.anbau, JSON.stringify(k));
  out.push('ℹ Blase lag über dem Ziel (erst weggetippt): ' + verdeckt + '×');
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(`${W}x${H}\n` + out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
