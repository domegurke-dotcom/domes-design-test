// v844 (Dome 25.10.): jeder Klick auf dem Klemmbrett führt dorthin, wo man die Aufgabe erledigt (Bild, Putzkiste, Orte, Futter, Gesundheit, Einstreu)
// Aufruf: NODE_PATH=/opt/node22/lib/node_modules node tests/klemmbrett-test.js [BxH]
const { chromium } = require('playwright'); const [W, H] = (process.argv[2] || '1366x768').split('x').map(Number);
const R = [], ok = (n, v, d) => R.push((v ? '✓ ' : '✗ ') + n + (v || d == null ? '' : ' – ' + d));
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H }, hasTouch: W < 1000 });
  await pg.addInitScript(() => { localStorage.setItem("zuchtstall-boxfenster", "1"); });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + __dirname + '/../index.html'); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 50000;
    const L = futterkammer().lager; L.heu = 500; L.hafer = 50; L.mineral = 20;
    const mk = (i, n) => { const p = neuesPferd({ rein: true, rasse: "hannoveraner", geschlecht: "Wallach", alter: 8, name: n }); p.pflege = erzeugePflege(p); spiel.boxen[i].pferd = p; return p; };
    const a = mk(0, "Eigen"), q = mk(1, "Pension");
    spiel.einsteller = [{ eid: "e1", vn: "Anna", nn: "X", pferdId: q.id, leistungen: { putzen: true, einstreu: true }, haltung: "weide", preis: 200, zufr: 70 }]; q.einsteller = "e1";
    spiel.boxen.forEach(x => { if (x.pferd) { x.krippeVoll = false; x.kraftVoll = false; x.mistig = true; x.wasserTag = -1; x.pferd.dreck = { fell: 60, maehne: 60 }; } });
    const bf = befundNeu(a, "husten", 2, "Test"); if (bf) { delete bf.inkub; bf.bemerkt = { von: "du", tag: spiel.tag }; }
    window.__frei = () => { document.getElementById('dlg').hidden = true; spiel.hofFenster = []; try { blaseWeg(); } catch (e) {} };
    aktBox = 0; zeigeSchirm(null); zeigeStall(); zeigeTag(); });
  const heute = async i => { await pg.evaluate(i => { __frei(); bxFensterZu && bxFensterZu(); aktBox = i; zeigeStall(); bxFensterAuf("versorgung", "heute"); }, i); await pg.waitForTimeout(400); };
  const zeilen = () => pg.evaluate(() => [...document.querySelectorAll('#info [data-kb]')].map(z => ({ kb: z.dataset.kb, txt: z.innerText.replace(/\s+/g, ' ').trim(), aus: z.disabled })));
  const klick = async txt => { for (let v = 0; v < 3; v++) { try { const loc = pg.locator('#info [data-kb]', { hasText: txt }).first(); if (!(await loc.count())) return false; await loc.scrollIntoViewIfNeeded({ timeout: 3000 }); await loc.click({ timeout: 3000 }); await pg.waitForTimeout(400); return true; } catch (e) { await pg.waitForTimeout(300); } } return false; };
  const puls = () => pg.evaluate(() => { const d = document.querySelector('.bxpuls'); if (!d) return null; const r = d.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  // --- eigenes Pferd in der Box ---
  await heute(0); const Z0 = await zeilen(); ok('Klemmbrett eigenes Pferd hat Zeilen', Z0.length >= 6, JSON.stringify(Z0));
  const roh = () => pg.evaluate(() => { document.querySelectorAll('.bxpuls').forEach(d => d.remove()); const x = spiel.boxen[0]; x.krippeVoll = false; x.kraftVoll = false; x.mistig = true; x.mistStufe = 1; x.wasserTag = -1; });
  const klickKb = async kb => { for (let v = 0; v < 3; v++) { try { const loc = pg.locator(`#info [data-kb="${kb}"]:not([disabled])`).first(); if (!(await loc.count())) return false; await loc.scrollIntoViewIfNeeded({ timeout: 3000 }); await loc.click({ timeout: 3000 }); await pg.waitForTimeout(400); return true; } catch (e) { await pg.waitForTimeout(300); } } return false; };
  for (const [kb, name, pruef] of [["heu", "Heu", "B().krippeVoll"], ["krippe", "Kraftfutter", "B().kraftVoll"], ["wasser", "Wasser", "B().wasserTag === spiel.tag"], ["mist", "Misten", "!B().mistig"]]) {
    await roh(); await heute(0); if (!Z0.some(z => z.kb === kb)) continue;
    const da = await klickKb(kb), pt = await puls(); ok(`„${name}“ antippen: Fenster zu, Stelle im Bild leuchtet`, da && !!pt && !(await pg.evaluate(() => document.body.classList.contains('infoOffen'))));
    if (!pt) continue; await pg.evaluate(() => __frei());
    if (kb === "mist") { const ap = await pg.evaluate(() => { const e = [...document.querySelectorAll('#mist *')].map(x => x.getBoundingClientRect()).find(r => r.width > 2 && r.height > 2); return e ? { x: e.left + e.width / 2, y: e.top + e.height / 2 } : null; }); if (ap) { pt.x = ap.x; pt.y = ap.y; } }   // einen Apfel antippen, nicht die Lücke dazwischen
    for (let k = 0; k < 4 && !(await pg.evaluate(new Function('return ' + pruef))); k++) { await pg.mouse.click(pt.x, pt.y); await pg.waitForTimeout(400); await pg.evaluate(() => __frei()); }
    ok(`„${name}“: die leuchtende Stelle antippen erledigt die Aufgabe`, await pg.evaluate(new Function('return ' + pruef)), await pg.evaluate(p => { const e = document.elementFromPoint(p.x, p.y); return e ? (e.getAttribute('class') || e.id || e.tagName) : '-'; }, pt)); }
  await heute(0); await klick("Putzen"); ok('„Putzen“ antippen öffnet die Putz-Werkzeuge', await pg.evaluate(() => putzModus === true && !!document.querySelector('[data-bxtool]')));
  await heute(0); await klick("Hufe auskratzen"); ok('„Hufe auskratzen“ antippen öffnet die Putz-Werkzeuge mit Hufkratzer', await pg.evaluate(() => putzModus === true && !!document.querySelector('[data-bxtool="huf"], [data-bxtool="hufkratzer"]')), await pg.evaluate(() => [...document.querySelectorAll('[data-bxtool]')].map(x => x.dataset.bxtool).join(',')));
  await heute(0); const kr = Z0.find(z => /Krank\?|Behandlung/.test(z.txt)); ok('Krankheit steht auf dem Klemmbrett', !!kr, JSON.stringify(Z0.map(z => z.txt)));
  if (kr) { await heute(0); await klickKb('gesund'); ok('Krankheit antippen öffnet Versorgung · Gesundheit', await pg.evaluate(() => document.getElementById('info').dataset.vstab === 'gesund' && document.body.classList.contains('infoOffen')), await pg.evaluate(() => (document.getElementById('info').dataset.vstab || '-') + ' offen:' + document.body.classList.contains('infoOffen') + ' ' + document.getElementById('info').innerText.replace(/\s+/g, ' ').slice(0, 120))); }
  // Termine kurz, Infos hinter dem i (v844)
  await heute(0); { const t = await pg.evaluate(() => { const li = [...document.querySelectorAll('.kb-tliste > li')]; return { n: li.length, kurz: li.every(x => !x.querySelector('.kb-tinfo') || x.querySelector('.kb-tinfo').hidden), name: li.map(x => x.querySelector('.txt').innerText.trim()) }; });
    ok('Termine stehen kurz auf dem Klemmbrett (Infos zu)', t.n === 4 && t.kurz && !t.name.some(n => /zuletzt|Tierarzt\)|Hufschmied\)/.test(n)), JSON.stringify(t));
    await pg.locator('.kb-tliste [data-kbinfo]').first().click(); await pg.waitForTimeout(200);
    ok('Info-Knopf klappt die Infos auf', await pg.evaluate(() => { const i = document.querySelector('.kb-tliste .kb-tinfo'); return !!i && !i.hidden && /zuletzt/.test(i.innerText); })); }
  // --- Pensionspferd ---
  await heute(1); const Z1 = await zeilen(); ok('Klemmbrett Pensionspferd zeigt die Besitzer-Aufgaben', Z1.some(z => /Weidegang/.test(z.txt)), JSON.stringify(Z1.map(z => z.txt)));
  const ziel = async (txt, pruefJS, name) => { await heute(1); const da = await klick(txt); ok(`Pension: „${name}“ ${da ? 'führt zum richtigen Ort' : 'fehlt auf dem Klemmbrett'}`, da && await pg.evaluate(new Function('return ' + pruefJS)), await pg.evaluate(() => (document.getElementById('info').dataset.fenster || '-') + ' / ' + (document.getElementById('dlg').hidden ? 'kein Dialog' : document.getElementById('dlgInhalt').innerText.slice(0, 60)))); };
  await ziel('Weidegang', `document.getElementById('info').dataset.fenster === 'orte' && !!document.querySelector('#info [data-ort="weide"], #info [data-okort="weide"]')`, 'Weidegang → Orte (Weide)');
  if (Z1.some(z => /Futterplan nach Wunsch/.test(z.txt) && !z.aus)) await ziel('Futterplan nach Wunsch', `!document.getElementById('dlg').hidden && /Fütterung|Futter/.test(document.getElementById('dlgInhalt').innerText)`, 'Futterplan nach Wunsch → Fütterung');
  await ziel('Pflege', `putzModus === true && !!document.querySelector('[data-bxtool]')`, 'Pflege → Putz-Werkzeuge');
  if (Z1.some(z => /Einstreu/.test(z.txt) && !z.aus)) await ziel('Einstreu', `!!document.querySelector('#einstreuAendern.bxblink')`, 'bessere Einstreu → Einstreu ändern');
  // alle Zeilen haben ein bekanntes Ziel
  const bek = ['heu', 'krippe', 'wasser', 'mist', 'putz', 'gesund', 'besitzer', 'orte', 'fuettern', 'einstreu'];
  ok('jede Klemmbrett-Zeile hat ein bekanntes Ziel', [...Z0, ...Z1].every(z => bek.includes(z.kb)), JSON.stringify([...Z0, ...Z1].filter(z => !bek.includes(z.kb))));
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
