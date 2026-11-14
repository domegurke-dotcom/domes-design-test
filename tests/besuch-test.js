// Etappe M3 (v1032): Besuche vor Ort – Fahrtkosten und Zeit nach Entfernung, ansehen/vorführen, kaufen mit Anhänger oder Transport,
// Termine aus der Lokalzeitung (Pferdemarkt, Auktion), Privatkauf aus der Ferne mit Transport, Tierschutz mit echtem Ort. Mit echten Klicks.
// Start: [GROESSE=390x844] NODE_PATH=<playwright> node tests/besuch-test.js [Bilderordner] · Erwartet: „alles ok“.
const { chromium } = require('playwright'); const path = require('path'); const ORD = process.argv[2];
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: (([w, h]) => ({ width: w, height: h }))((process.env.GROESSE || '1366x768').split('x').map(Number)) }); pg.on('pageerror', e => errs.push(e.message));
  const L = [], ok = (n, c, x = '') => L.push((c ? '✓ ' : '✗ ') + n + (x !== '' ? ' (' + x + ')' : ''));
  const bild = async n => { if (ORD) await pg.screenshot({ path: ORD + '/' + n + '.png' }); };
  const dlgText = () => pg.evaluate(() => document.getElementById('dlg').hidden ? '' : document.getElementById('dlg').innerText);
  const knopf = async t => { await pg.click(`#dlgKnoepfe button:has-text("${t}")`); await pg.waitForTimeout(350); };
  const kachel = async (i, aktion) => { const l = await pg.$$('#nebenSchirm .paar'); await l[i].click(); await pg.waitForTimeout(300); const t = await dlgText(); if (aktion && !new RegExp(aktion.wenn).test(t)) await knopf(aktion.knopf); };
  const versorgen = () => pg.evaluate(() => spiel.boxen.forEach(x => { if (x.pferd) { x.krippeVoll = true; x.mistig = false; x.mistStufe = 0; if (x.pferd.pflege) x.pferd.pflege.gesundheit = Math.max(80, x.pferd.pflege.gesundheit); } }));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(400);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.waitForTimeout(200);
  await pg.selectOption('#kaufLand', '09'); await pg.waitForTimeout(100); await pg.selectOption('#kaufOrt', 'Landshut'); await pg.waitForTimeout(100);
  await pg.fill('#kaufName', 'Besuchshof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 80000; spiel.admin = false;
    VET.verbotAb = Object.fromEntries(Object.keys(VET.verbotAb).map(k => [k, 99])); });
  // 1. Kosten und Zeit nach Entfernung
  const k = await pg.evaluate(() => ({ kurz: besuchKosten(40, false), tag: besuchKosten(200, true), zwei: besuchKosten(400, false), t: transportPreis(30), t2: transportPreis(300) }));
  ok('40 km Auto: 24 € und ein Tagesabschnitt', k.kurz.summe === 24 && k.kurz.d === 'kurz', JSON.stringify(k.kurz));
  ok('200 km Anhänger: 200 + 65 € und ganzer Tag', k.tag.summe === 265 && k.tag.d === 'tag', JSON.stringify(k.tag));
  ok('400 km Auto: 240 € + Hotel 90 €, zwei Tage', k.zwei.summe === 330 && k.zwei.d === 'zwei', JSON.stringify(k.zwei));
  ok('Transport mindestens 120 €, 300 km = 540 €', k.t === 120 && k.t2 === 540, k.t + ' / ' + k.t2);
  // 2. Privatanzeige aus der Ferne kaufen → Transport, Ankunft morgen
  await pg.evaluate(() => zeigeMarkt(null)); await pg.waitForTimeout(300); await pg.click('[data-mb="privat"]'); await pg.waitForTimeout(300);
  await pg.click('#nebenSchirm .paar'); await pg.waitForTimeout(300);
  let d = await dlgText(); if (!/von privat/.test(d)) { await knopf('Kaufen'); d = await dlgText(); }
  ok('Inserat: Standort, Transport und Hinfahren', /Steht in/.test(d) && /Transportunternehmen/.test(d) && /Hinfahren/.test(d), d.slice(0, 160).replace(/\s+/g, ' '));
  await bild('m3-inserat');
  const v1 = await pg.evaluate(() => ({ g: spiel.geld, n: spiel.boxen.filter(x => x.pferd).length, h: marktNeu().privat.filter(h => !(spiel.marktGekauft || []).includes(h.id))[0] }));
  await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const r2 = await pg.evaluate(v => ({ abz: v.g - spiel.geld, imp: (spiel.importe || []).length, ank: (spiel.importe || [])[0] && spiel.importe[0].ankunft === spiel.tag + 1, n: spiel.boxen.filter(x => x.pferd).length, t: document.getElementById('dlg').innerText, soll: v.h.preis + transportPreis(besuchOrt(v.h).km) }), v1);
  ok('Fernkauf: Preis + Transport, Pferd kommt morgen', r2.abz === r2.soll && r2.imp === 1 && r2.ank && r2.n === v1.n && /morgen/.test(r2.t), r2.abz + ' / ' + r2.soll);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; }); await versorgen();
  await pg.evaluate(() => naechsteNacht()); await pg.waitForTimeout(200);
  const r2b = await pg.evaluate(() => ({ n: spiel.boxen.filter(x => x.pferd).length, imp: (spiel.importe || []).length, brief: (spiel.post || []).some(p => /ist angekommen/.test(p.betreff || p.titel || '')) }));
  ok('nächster Morgen: Pferd steht im Stall, Brief kam', r2b.n === v1.n + 1 && r2b.imp === 0 && r2b.brief, JSON.stringify(r2b));
  // 3. Privatanzeige besuchen (mit Anhänger): ansehen, vorführen, kaufen, Heimfahrt
  await pg.evaluate(() => { marktBereich = 'privat'; zeigeMarkt('privat'); }); await pg.waitForTimeout(300);
  const ziel = await pg.evaluate(() => { const L = marktNeu().privat.filter(h => !(spiel.marktGekauft || []).includes(h.id)).map(h => ({ id: h.id, km: besuchOrt(h).km })).sort((a, b) => a.km - b.km); return L[0]; });
  await pg.evaluate(id => { privatKaufen(marktNeu().privat.find(h => h.id === id)); }, ziel.id); await pg.waitForTimeout(300);
  await knopf('Hinfahren'); d = await dlgText();
  ok('Fahrt-Fenster: Auto und Anhänger, Dauer', /Mit dem Auto/.test(d) && /Mit Pferdeanhänger/.test(d) && /(Tagesabschnitt|ganzen Tag|zwei Tage)/.test(d), d.slice(0, 140).replace(/\s+/g, ' '));
  await bild('m3-fahrt');
  const g3 = await pg.evaluate(() => spiel.geld); await knopf('Mit Pferdeanhänger');
  const r3 = await pg.evaluate((a) => ({ B: spiel.besuch, abz: a.g - spiel.geld, soll: besuchKosten(a.km, true).summe, text: document.getElementById('nebenSchirm').innerText }), { g: g3, km: ziel.km });
  ok('Besuch läuft, Fahrt bezahlt', r3.B && r3.B.anh && r3.abz === r3.soll && /Heimfahren/.test(r3.text), r3.abz + ' / ' + r3.soll + ' · ' + (r3.B && r3.B.d));
  await bild('m3-besuch');
  await kachel(0, { wenn: 'Genau ansehen', knopf: 'Ansehen' });
  await knopf('Genau ansehen'); await knopf('Vorführen lassen'); d = await dlgText();
  ok('Eindruck nach Ansehen und Vorführen', /Dein Eindruck/.test(d) && /(wirkt|Zustand)/.test(d) && !/Genau ansehen/.test(d) && !/Vorführen lassen/.test(d), d.match(/Dein Eindruck[\s\S]{0,140}/)[0].replace(/\s+/g, ' '));
  await bild('m3-eindruck');
  const n3 = await pg.evaluate(() => spiel.boxen.filter(x => x.pferd).length); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const r3b = await pg.evaluate(() => ({ n: spiel.boxen.filter(x => x.pferd).length, t: document.getElementById('dlg').innerText }));
  ok('mit Anhänger: Pferd gleich im Stall', r3b.n === n3 + 1 && /Willkommen/.test(r3b.t), r3b.t.slice(0, 50).replace(/\s+/g, ' '));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeMarkt(); }); await pg.waitForTimeout(300);
  const tag3 = await pg.evaluate(() => spiel.tag); await pg.click('#besuchHeim'); await pg.waitForTimeout(2600);
  const r3c = await pg.evaluate(t => ({ weg: !spiel.besuch, tage: spiel.tag - t }), tag3);
  const sollTage = { kurz: 0, tag: 1, zwei: 2 }[r3.B.d];
  ok('Heimfahrt: Tage passend zur Entfernung', r3c.weg && r3c.tage === sollTage, r3c.tage + ' / ' + sollTage + ' (' + r3.B.d + ')');
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; }); await versorgen();
  // 4. Termin aus der Lokalzeitung: Pferdemarkt Ingolstadt (monatlich) – am Termintag hinfahren
  await pg.evaluate(() => { const Z = zeitungDaten(); Z.abo = true; zeitungZustellen(Z); const t = [0, 1].flatMap(i => regionTermine(jzJetzt() + i)).find(x => x.tag > spiel.tag && x.art === 'markt'); while (spiel.tag < t.tag) { spiel.boxen.forEach(x => { if (x.pferd) { x.krippeVoll = true; x.mistig = false; } }); naechsteNacht(); } spiel.hof.zeitung.abo = true; zeitungZustellen(spiel.hof.zeitung); marktBereich = 'zeitung'; zeigeMarkt('zeitung'); });
  await pg.waitForTimeout(400);
  const tk = await pg.$$eval('[data-ztermin]', l => l.map(x => x.dataset.ztermin));
  ok('Zeitung: Termin heute mit Knopf Hinfahren', tk.length >= 1, tk.join(', '));
  await bild('m3-zeitung-termin');
  await pg.click('[data-ztermin]'); await pg.waitForTimeout(300); await knopf('Mit dem Auto');
  const r4 = await pg.evaluate(() => ({ B: spiel.besuch, n: document.querySelectorAll('#nebenSchirm .paar').length, text: document.getElementById('nebenSchirm').innerText }));
  ok('Pferdemarkt vor Ort: Händler und Privatleute', r4.B && r4.B.art === 'termin' && r4.n >= 6 && r4.B.pferde.some(h => h.standplatz === 'Händler') && r4.B.pferde.some(h => h.standplatz === 'Privat'), r4.n + ' Pferde · ' + (r4.B && r4.B.km) + ' km');
  await bild('m3-pferdemarkt');
  // ohne Anhänger kaufen → Transport morgen
  await kachel(0, { wenn: 'verlangt werden', knopf: 'Ansehen' });
  const imp4 = await pg.evaluate(() => (spiel.importe || []).length); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const r4b = await pg.evaluate(() => ({ imp: (spiel.importe || []).length, t: document.getElementById('dlg').innerText }));
  ok('ohne Anhänger: Transportunternehmen bringt das Pferd morgen', r4b.imp === imp4 + 1 && /morgen/.test(r4b.t), r4b.t.slice(0, 80).replace(/\s+/g, ' '));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });
  // zweiter langer Besuch am selben Tag geht nicht
  await pg.evaluate(() => { const B = spiel.besuch; delete spiel.besuch; besuchStart({ art: 'termin', t: { art: 'auktion', n: 'Verdener Auktion', ort: 'Verden (Aller)' }, ort: 'Verden (Aller)', km: 400, name: 'Verdener Auktion' }); spiel.besuch = B; });
  d = await dlgText(); ok('am selben Tag keine zweite lange Fahrt', /Heute nicht mehr/.test(d), d.slice(0, 60).replace(/\s+/g, ' '));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeMarkt(); }); await pg.waitForTimeout(200);
  await pg.click('#besuchHeim'); await pg.waitForTimeout(2600); await pg.evaluate(() => { document.getElementById('dlg').hidden = true; }); await versorgen();
  // 5. Auktion weit weg (zwei Tage): mitbieten, Zuschlag, Transport, zwei Nächte
  await pg.evaluate(() => { besuchStart({ art: 'termin', t: { art: 'auktion', n: 'Verdener Auktion', ort: 'Verden (Aller)' }, ort: 'Verden (Aller)', km: 400, name: 'Verdener Auktion' }); });
  d = await dlgText(); ok('Auktion 400 km: zwei Tage mit Hotel', /zwei Tage/.test(d) && /Hotel/.test(d), d.slice(0, 120).replace(/\s+/g, ' '));
  await knopf('Mit dem Auto');
  const r5 = await pg.evaluate(() => { const B = spiel.besuch; B.lose[0].max = B.lose[0].start; B.lose[1].max = B.lose[1].start * 100; return { n: B.lose.length, rasse: B.lose.every(a => a.pferd.rasse === 'hannoveraner') }; });
  ok('Auktion: Lose aus dem Verband (Hannoveraner)', r5.n >= 6 && r5.rasse, r5.n);
  await pg.evaluate(() => zeigeMarkt()); await pg.waitForTimeout(300); await bild('m3-auktion');
  await kachel(0, { wenn: 'Dein Limit', knopf: 'Mitbieten' });
  await pg.evaluate(() => { const r = document.getElementById('bbLimit'); r.value = r.max; r.oninput(); }); await knopf('Mitbieten');
  const r5b = await pg.evaluate(() => ({ a: spiel.besuch.lose[0], schritt: bietSchritt(spiel.besuch.lose[0]), t: document.getElementById('dlg').innerText, imp: (spiel.importe || []).slice(-1)[0] }));
  ok('Zuschlag: ein Schritt über dem Mitbieter, Lieferung morgen', r5b.a.weg === 'du' && r5b.a.preis === r5b.a.start + r5b.schritt && /Zuschlag/.test(r5b.t) && r5b.imp && r5b.imp.pferd.id === r5b.a.pferd.id, r5b.a.preis);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeMarkt(); }); await pg.waitForTimeout(200);
  await kachel(1, { wenn: 'Dein Limit', knopf: 'Mitbieten' }); await knopf('Mitbieten');
  const r5c = await pg.evaluate(() => spiel.besuch.lose[1]);
  ok('überboten: Los geht an einen anderen Bieter', r5c.weg === 'fremd', r5c.preis);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeMarkt(); }); await pg.waitForTimeout(200); await bild('m3-auktion-nach');
  const tag5 = await pg.evaluate(() => spiel.tag); await versorgen(); await pg.click('#besuchHeim'); await pg.waitForTimeout(2600);
  const r5d = await pg.evaluate((t) => ({ tage: spiel.tag - t, da: spiel.boxen.some(x => x.pferd && x.pferd.id === (spiel.marktGekauft || []).slice(-1)[0]) }), tag5);
  ok('Heimfahrt nach zwei Tagen, ersteigertes Pferd ist da', r5d.tage === 2 && r5d.da, JSON.stringify(r5d));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; }); await versorgen();
  // 6. Fohlenauktion: nur mit Auto, Fohlen kommt zu Beginn der nächsten Jahreszeit
  await pg.evaluate(() => { besuchStart({ art: 'termin', t: { art: 'fohlen', n: 'Kaltblut-Fohlenmarkt', ort: 'Rottenbuch' }, ort: 'Rottenbuch', km: 45, name: 'Kaltblut-Fohlenmarkt' }); });
  d = await dlgText(); ok('Fohlenauktion: kein Anhänger, Hinweis Absetzen', !/Mit Pferdeanhänger/.test(d) && /Absetzen/.test(d));
  await knopf('Mit dem Auto');
  const r6 = await pg.evaluate(() => { const B = spiel.besuch, a = B.lose[0]; a.max = a.start; besuchBieten(a); const r = document.getElementById('bbLimit'); r.value = r.max; return { kalt: B.lose.every(x => x.pferd.rasse === 'noriker'), fohlen: B.lose.every(x => x.fohlen) }; });
  await knopf('Mitbieten');
  const r6b = await pg.evaluate(() => { const I = spiel.importe.slice(-1)[0]; return { ank: I.ankunft === jzStartTag(jzJetzt() + 1), t: document.getElementById('dlg').innerText }; });
  ok('Fohlen: Kaltblut, kommt nach dem Absetzen', r6.kalt && r6.fohlen && r6b.ank && /nächsten Jahreszeit/.test(r6b.t), JSON.stringify(r6));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; besuchHeim(); document.getElementById('dlg').hidden = true; });
  // 6b. 2-Tage-Fahrt mit dem Mond beenden = auch zwei Nächte
  await versorgen(); await pg.evaluate(() => { spiel.besuchHeute = null; besuchStart({ art: 'termin', t: { art: 'auktion', n: 'Holsteiner Frühjahrsauktion', ort: 'Elmshorn' }, ort: 'Elmshorn', km: 600, name: 'Holsteiner Frühjahrsauktion' }); });
  await knopf('Mit dem Auto'); const r6c = await pg.evaluate(() => ({ t: spiel.tag, hol: spiel.besuch.lose.every(a => a.pferd.rasse === 'holsteiner') })); await versorgen();
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; tagBeenden(); }); await pg.waitForTimeout(2600);
  const r6d = await pg.evaluate(t => ({ tage: spiel.tag - t, weg: !spiel.besuch }), r6c.t);
  ok('Holsteiner Auktion verkauft Holsteiner', r6c.hol); ok('2-Tage-Fahrt mit dem Mond beendet: zwei Tage', r6d.tage === 2 && r6d.weg, JSON.stringify(r6d));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });
  // 7. Tierschutz: echter Ort und Hinfahren
  await pg.evaluate(() => { marktBereich = 'tierschutz'; zeigeMarkt('tierschutz'); }); await pg.waitForTimeout(300);
  const tsK = await pg.$$eval('#nebenSchirm .paar', l => l.map(x => x.innerText.replace(/\s+/g, ' ')));
  ok('Tierschutz-Pferde mit Ort und km', tsK.length > 0 && tsK.every(t => /🐾 .+ · \d+ km/.test(t)), tsK[0]);
  if (tsK.length) { await pg.click('#nebenSchirm .paar'); await pg.waitForTimeout(300); d = await dlgText(); if (!/aufnehmen\?/.test(d)) { await knopf('Aufnehmen'); d = await dlgText(); }
    ok('Tierschutz: Knopf Hinfahren', /Hinfahren/.test(d), d.slice(0, 60).replace(/\s+/g, ' ')); }
  await bild('m3-tierschutz');
  ok('keine Fehler auf der Seite', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log(L.join('\n')); console.log(L.some(x => x.startsWith('✗')) ? 'FEHLER' : 'alles ok'); await b.close();
})();
