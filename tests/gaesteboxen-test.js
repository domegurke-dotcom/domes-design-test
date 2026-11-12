// Etappe 4 (Dome 12.11.2026): Gästeboxen für Gaststuten der Deckhengste – Zahl je Hof im Deckhengst-Fenster (− / +), Haken je Stall im Whiteboard,
// reservierte Boxen nimmt die Pension nicht, Gaststute zieht nur in erlaubte Ställe, höchstens so viele gleichzeitig, 0 = nur zum Decktag
// BILDER_ORDNER=<Scratchpad-Ordner> speichert Bilder
const { chromium } = require('playwright'); const path = require('path');
const ORD = process.env.BILDER_ORDNER;
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const out = []; const ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x));
  const bild = async n => { if (ORD) await pg.screenshot({ path: path.join(ORD, n + '.png') }); };
  const klick = async sel => { const r = await pg.evaluate(s => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel); await pg.waitForTimeout(150); if (!r) out.push('✗ Klick fehlt: ' + sel); return r; };
  const Z = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 80000; spiel.kal = null; spiel.tag = 1; spiel.turniere = spiel.turniere || []; zbBestand();
    const Rg = pensionRegeln(); Rg.offen = true; Rg.max = 99; Rg.ansehen = 100;
    const alt = gebaeude().find(g => g.typ === 'stall'); gebaeude().push({ gid: 'gs2', typ: 'stall', stufe: 1, zustand: 100, boxen: 2 }); spiel.boxen.push({ pferd: null, geb: 'gs2', stufe: 1 }, { pferd: null, geb: 'gs2', stufe: 1 });
    spiel.boxen.forEach(bx => { if (!bx.geb) bx.geb = alt.gid; });
    const H = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 8, name: 'Hektor' }); H.anteile = { hannoveraner: 100 }; H.pflege = erzeugePflege(H); H.werte = H.werte || erzeugeWerte(H); H.pflege.gesundheit = 100; H.hb = { s: 'end', tag: 1 }; spiel.boxen[0].pferd = H; window.H = H;
    return { alt: alt.gid, frei: spiel.boxen.filter(boxFrei).length }; });

  // ohne angebotenen Hengst: nichts reserviert
  let r = await pg.evaluate(() => ({ res: spiel.boxen.filter(gastReserviert).length, pens: spiel.boxen.filter(pensionBoxFrei).length }));
  ok('Hengst nicht angeboten: keine Box reserviert', r.res === 0 && r.pens > 0, JSON.stringify(r));

  // Deckhengst-Fenster: anbieten, Gästeboxen − / +
  await pg.evaluate(() => deckhengstDialog(H, null)); await klick('#dhAn');
  r = await pg.evaluate(() => ({ zahl: gastBoxenZahl(), txt: $('dlg').textContent, res: spiel.boxen.filter(gastReserviert).length, pens: spiel.boxen.filter(pensionBoxFrei).length, frei: spiel.boxen.filter(boxFrei).length }));
  ok('Standard 2 Gästeboxen, Text im Fenster', r.zahl === 2 && /Gästeboxen/.test(r.txt) && /Pensions-Anfragen nehmen sie nicht/.test(r.txt), r.txt.slice(0, 80));
  ok('Angeboten: 2 Boxen reserviert, Pension hat 2 weniger', r.res === 2 && r.pens === r.frei - 2, JSON.stringify(r));
  await bild('etappe4-deckhengst-gaesteboxen');
  await klick('[data-dhgast="1"]'); r = await pg.evaluate(() => [gastBoxenZahl(), spiel.boxen.filter(gastReserviert).length]); ok('Plus: 3 Gästeboxen, 3 reserviert', r[0] === 3 && r[1] === 3, r.join());
  for (let i = 0; i < 4; i++) await klick('[data-dhgast="-1"]');
  r = await pg.evaluate(() => ({ z: gastBoxenZahl(), res: spiel.boxen.filter(gastReserviert).length, txt: $('dlg').textContent })); ok('Minus bis 0: keine reserviert, Text „nur am Decktag“', r.z === 0 && r.res === 0 && /nur am Decktag vorbei/.test(r.txt), JSON.stringify({ z: r.z, res: r.res }));
  await bild('etappe4-keine-gaesteboxen');
  r = await pg.evaluate(() => { const rnd = Math.random; Math.random = () => 0.01; let gast = 0; for (let i = 0; i < 5; i++) { delete H.deckFremd.anfrageTag; spiel.tag = 1 + i; deckhengstTag(); } Math.random = rnd; spiel.tag = 1; return (spiel.deckAnfragen || []).filter(a => a.gast).length; });
  ok('0 Gästeboxen: keine Anfrage mit Übernachtung', r === 0, r);
  await klick('[data-dhgast="1"]'); await klick('[data-dhgast="1"]'); await pg.evaluate(() => { $('dlg').hidden = true; });

  // Pension: reservierte Boxen sieht Hof → Pension, neue Einsteller ziehen nicht hinein
  r = await pg.evaluate(() => { const ziele = new Set(); for (let i = 0; i < 40; i++) { const z = pensionZielBox({ leistungen: {}, art: null }); ziele.add(z); } const res = spiel.boxen.map((b, i) => gastReserviert(b) ? i : -1).filter(i => i >= 0); return { ziele: [...ziele], res }; });
  ok('Pension nimmt keine reservierte Gästebox', r.res.length === 2 && !r.ziele.some(z => r.res.includes(z)), JSON.stringify(r));

  // Whiteboard: Haken je Stall
  await pg.evaluate(() => { stallAlt = false; spiel.stallAnsicht = 'board'; wbSicht = 'boxen'; document.querySelectorAll('.schirm.offen').forEach(x => x.classList.remove('offen')); zeigeBoxen(); try { zeigeWhiteboard(); } catch (e) { } });
  r = await pg.evaluate(() => document.querySelectorAll('[data-wbgast]').length); ok('Whiteboard: Haken „Gaststuten“ je Stall (2)', r === 2, r);
  if (ORD) { await pg.evaluate(() => { const e = document.querySelector('[data-wbgast]'); if (e) e.scrollIntoView({ block: 'center' }); }); await bild('etappe4-whiteboard'); }
  await klick(`[data-wbgast="${Z.alt}"]`);
  r = await pg.evaluate(a => ({ nein: !!gebaeude().find(x => x.gid === a).gastNein, res: spiel.boxen.filter(gastReserviert).map(b => b.geb) }), Z.alt);
  ok('Alter Stall abgewählt: Gästeboxen nur noch im 2. Stall', r.nein && r.res.length === 2 && r.res.every(g => g === 'gs2'), JSON.stringify(r));

  // Gaststute zieht in eine erlaubte Gästebox; zweite gleichzeitig nur bis zur Zahl
  r = await pg.evaluate(() => { const mkA = (id, tag) => ({ id, pid: H.id, hid: aktivHid(), tag, art: 'natur', gast: true, taxe: 400, besitzer: 'Anna Berg', w: true, stute: { name: 'Gast' + id, rasse: 'hannoveraner', alter: 8, stufe: 'Hauptstutbuch', q: 0.5 }, status: 'ok' });
    (spiel.deckAnfragen = spiel.deckAnfragen || []).push(mkA('g1', 3), mkA('g2', 3), mkA('g3', 3)); spiel.tag = 2; dhGastTag();
    const G = spiel.boxen.filter(b => b.pferd && b.pferd.gastStute).map(b => b.geb); return { geb: G, nur: spiel.deckAnfragen.filter(a => /^g\d/.test(a.id) && !a.gast).length }; });
  ok('Gaststuten nur in Gästeboxen des erlaubten Stalls, höchstens 2', r.geb.length === 2 && r.geb.every(g => g === 'gs2') && r.nur === 1, JSON.stringify(r));
  r = await pg.evaluate(() => ({ res: spiel.boxen.filter(gastReserviert).length, frei: gastPlatzFrei() })); ok('Belegt: nichts mehr reserviert, kein Platz frei', r.res === 0 && !r.frei, JSON.stringify(r));

  // Hof → Pension: Hinweis „für Gaststuten frei gehalten“ (wenn reserviert)
  await pg.evaluate(() => { spiel.boxen.forEach(b => { if (b.pferd && b.pferd.gastStute) { const e = einstellerVon(b.pferd); pensionAuszug(e, 'Test'); } }); });
  r = await pg.evaluate(() => { try { return { n: spiel.boxen.filter(gastReserviert).length, html: pensionHTML ? pensionHTML() : '' }; } catch (e) { return { n: spiel.boxen.filter(gastReserviert).length, html: 'Fehler ' + e.message }; } });
  ok('Hof → Pension zeigt die frei gehaltenen Gästeboxen', r.n === 2 && /für Gaststuten frei gehalten/.test(r.html), r.html.slice(0, 80));

  if (ORD) { await pg.setViewportSize({ width: 390, height: 844 }); await pg.evaluate(() => deckhengstDialog(H, null)); await bild('etappe4-handy-hoch'); await pg.setViewportSize({ width: 844, height: 390 }); await bild('etappe4-handy-quer'); }
  out.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
