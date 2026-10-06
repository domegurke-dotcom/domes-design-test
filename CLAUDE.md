# Pferdezucht-Spiel („Zuchtstall“) – Notizen für Claude

Browser-Pferdezuchtspiel auf Deutsch, läuft auf Handy und PC.
Live: https://domegurke-dotcom.github.io/domes-design-test/ (GitHub Pages, Branch `main`).
Spielerin/Auftraggeberin: **Dome** – zeichnet Teile selbst in Krita/Inkscape (Pferdeköpfe, Schöpfe, Fell-SVGs).
Mit Dome immer **auf Deutsch** sprechen, freundlich, knapp; am Ende kurz sagen, was sich geändert hat.

## Feste Regeln von Dome (immer beachten)
- **Immer wie in echt:** Behandlungen, Abläufe und Zahlen sollen der echten Pferdehaltung entsprechen. Wenn etwas unrealistisch ist, erst nachfragen.
- **Bei Unstimmigkeiten, Unrealistischem oder falschen Infos erst nachfragen**, ob weitergemacht werden soll („mir ist xy aufgefallen …“). Nicht eigenmächtig Spielmechanik ändern, die nicht verlangt wurde – vorschlagen und fragen. Selbst festgelegte Zahlen am Ende einer Etappe nennen.
- **Jede Änderung testen.** Screenshots in allen Ansichten (PC, Handy quer, Handy hochkant, z. B. 1366×768, 844×390, 390×844) nur bei Änderungen am Aussehen oder Layout – reine Logik-Änderungen per Test-Skript prüfen.
- **Enzyklopädie immer aktuell halten** (Reiter „Vererbung“ und „Berechnungen zum Nachschlagen“ sind nur im Adminmodus sichtbar – dort Zahlen/Regeln eintragen).
- Versteckte Genetik (Farbgene, Erbkrankheiten, Veranlagungen, Hufqualität) **nie** in Akte/Abstammungsschein zeigen – nur über Labortests bzw. im Adminmodus.
- Rassen einstellen (Pferde aus der Rassenliste) nur im Adminmodus.
- Kamera-Aussparung (safe-area) in allen Layouts beachten.
- Anzeige-/Interaktionsboxen dürfen sich nicht überdecken.
- Nach Aktionen nicht aus der Ansicht werfen (z. B. Schere bleibt offen, Bieten aus Brief → zurück zum Brief).
- Emojis, die es erst seit Kurzem gibt (z. B. 🪮, 🪝), auf älteren Handys nicht verwenden – lieber kleine SVG-Zeichnung (`KAMM_ICO`, `HUFKR_ICO`).
- **Noch warten, bis Dome es sagt:** weitere Rassen (Knabstrupper, Appaloosa, Noriker, Paint Horse), Inzucht-Auswirkungen, Vererbung von Abzeichen/Kopfform/Kopfgröße.
- Grundsatz: Kommen neue Rassen dazu, bekommen sie ihre Erbkrankheiten, Eigenheiten, Hufqualität, Körperbau (Gewicht) und Futtertyp gleich mit.

## Pläne (in dieser Reihenfolge)
- `PLAN-WERTE.md` – Werte, Charakter, Training, Disziplinen, Turniere, Fohlenschau. Etappen 1–5 und 6a fertig. **Als Nächstes 6b** (Rennen mit Jockey, Distanz mit Tierarztkontrolle, Tölt, Championate/International, Reiterprofil, LK verbessert das eigene Training, Decktaxe, Turniererfolge bei Marktpferden), **dann 6c Fohlenschau** (Abschnitt 8b: nur Fohlen bei Fuß, Sommer/Herbst, rassetypisch, Mischlinge in offener Klasse, platzierte Fohlen auch auf dem Pferdemarkt).
- `PLAN-KRANKHEITEN.md` – Spieltempo, Mitarbeiter (inkl. Nachtrag B3 Azubi/Ausbilder), Befunde, Behandlung, Hufe, Ansteckung, AKU, Erbkrankheiten. **Alle Etappen A–H fertig.**
- `PLAN-FUETTERUNG.md` – F1–F5. **Erst nach Werte-Etappe 6**, vorher Dome fragen „Mit Fütterung F1 weitermachen?“.
- Nach jeder Etappe: testen, hochladen, Dome eine Test-Anleitung mit ausgeschriebenen Wegen geben, auf Rückmeldung warten, Etappe im Plan abhaken.

## Dateien
- `index.html` – gesamte Oberfläche und Spiellogik (ein großer `<script>`-Block + `<style>`).
- `pferd.js` – SVG-Pferdezeichnung (`zeichnePferd`), `FARBEN` (Proxy, baut Muster-IDs wie `ov_`, `tv_`, `tg_`, `fs_`, `sb_`, `sk_`), `RASSEN`, `KLASSEN`, `FARBBESCHREIBUNG`, `PROFIL`, `CHARAKTER`, `WERTE_KOERPER`/`WERTE_KOPF`, `erzeugeWerte`, `erzeugePflege`.
- `kopfteile.js`, `kopfalter.js` – Domes gezeichnete Köpfe/Schöpfe (`RASSE_KOPF` in pferd.js ordnet Rassen zu; Andalusier, Marwari, Tinker haben noch den Spielkopf).
- `version.json` – aktuelle Version.
- `werte/` – Bilder zur Ausbildungsskala.
- Speicherstand: `localStorage["zuchtstall-v2"]` → Objekt `spiel`.

## Versionierung (bei JEDER Auslieferung)
- `SPIEL_VERSION = "NNN"` in index.html, `?v=NNN` (3 Stellen in index.html) und `version.json` gemeinsam hochzählen. Die Version steht klein unten im Startmenü.
- Letzte Version bei Aktualisierung dieser Datei: **203**.

## Testen
- Playwright (Chromium vorinstalliert) – Skript lädt `index.html` per `file://`, Spiel starten: `#smNeu` → `#chName`, `#chHof` ausfüllen → `#chLos`. Admin: `spiel.admin = true`.
- Vor dem Ausliefern Syntax prüfen (jeden `<script>`-Block mit `new Function(...)`, `node --check pferd.js`) und Screenshots in den drei Ansichten ansehen.
- Testlink für Dome (falls GitHub Pages hängt): Artifact „Zuchtstall Testversion“ (index.html mit eigenem `<title>` + pferd.js, kopfteile.js, kopfalter.js, version.json), bei jeder Version neu veröffentlichen.

## Wichtige Spielsysteme (Stand v203)
- **Zeit:** Jahreszeiten (Frühling, Sommer, Herbst, Winter), `tpj()` Tage pro Jahreszeit 4/7/10 (Standard 7, alte Spielstände auf 7 umgestellt). Kalender-Anker `spiel.kal` = {tag, i}, damit ein Tempowechsel das Datum nicht verschiebt. Nur das Sozialverhalten wird umgerechnet (`proTag`, Bezug 7); alles andere gilt pro Tag/Nacht. `naechsteNacht()` ist der Tageswechsel; bei `datum().t === 1` laufen die Jahreszeit-Funktionen.
- **Zucht:** Tragzeit 4 Jahreszeiten. Deckstation (Gestütshengste) nur Frühling/Sommer, eigene Hengste immer. Zuchtalter Stuten bis 20, Hengste bis 25. Befunde sperren die Zucht (`zuchtSperre`).
- **Genetik:** E, A (A>At>a), F, Sty, Cr, D, Z, Rn, To, O, Lp, Patn, G, Dm (DMRT3). Versteckte Veranlagungen `ex` (grauTempo, apfel, fliegen, fliegenAb, maehne, ton, ow, sonne, kurve). Gefährliche Gene in `GEFAHR_GENE` (O, Lp) – Warnung nur, wenn mind. ein Partner positiv getestet ist.
- **Erbkrankheiten (Etappe H):** `ERBKRANK` (Träger-Anteil je Rasse, dominant/rezessiv, Folge), versteckt in `p.erb`, vererbt mit `erbVererben`, Folgen `erbGeburt`/`erbTodPruefen`/`erbJahreszeit`. Labortest prüft die Rassen ab 12,5 % (`laborPreis`, +30 € je weitere Rasse). Warnung `erbGefahr` nur bei positivem Test. Veranlagungen `VERANLAGUNG` (Ekzem, Kehlkopfpfeifen, OCD) in `p.vl`; Melanome an Gen G.
- **Overo-Namen:** ohne Gentest „Braunschecke“ usw., mit Test „(Overo)“/„(Tovero)“ (`farbName`).
- **Labor** (ppf – Ort – Labor): Fellfarben 120 €, Erbkrankheiten 60 € (+30 € je weitere Rasse), Gangpferde 50 €, Abstammung 80 €. Gemachte Tests erhöhen den Marktwert um ihre Kosten (`testWert`).
- **Werte (Werte-Etappen 1–3):** 10 Körper- und 5 Kopfwerte (`WERTE_KOERPER`, `WERTE_KOPF`) mit Anlage (vererbt, nur Admin sieht Obergrenzen) und Ist-Wert; Alter (`altersFaktor`, `werteAltern`). Charakter → Wohlbefinden (`charE`, `wohlNacht`, `wohlAendern`, `p.wohlLog`). Weide und Herde (`herdeNacht`, Sozialverhalten, Streit, ungeplante Bedeckung). Vorlieben (`VORLIEBEN`, `vorliebe`, `reaktion` mit Sprechblase `reaktionZeigen`). Reiter im Steckbrief „Eigenschaften“.
- **Pferdemarkt:** Privatanzeigen, Pferdehändler, Auktionshaus, Fohlenauktion (Sommer/Herbst), Gestüte, Tierschutz (inkl. Notfallpferde). Saisonpreise Frühling ×1,1 · Sommer ×1,05 · Herbst ×1 · Winter ×0,9.
  - Auktionshaus: Höchstgebot wie eBay (`duMax`), Gegenbieter-Limits über `npcLimit` (65 % 0,7–1,3×, 22 % 1,3–2×, 9 % 2–3,5×, 4 % 3,5–6× Marktwert). Gebote nur bis zum frei verfügbaren Geld (`gebundenesGeld`).
  - Eigener Verkauf: Festpreis (`festChance`, Regler 50–160 %, nie unter 4 %, Preisvorschläge per Brief) oder Auktion (Start ½ Marktwert, 2 Jahreszeiten, Abbruchstrafe ½ letztes Gebot). Dome will die eigene Auktion so lassen. Zubehör mitgeben möglich (Gebrauchtwert). Manche Käufer machen eine AKU (`kaeuferAku`).
  - Notfallpferde: im ersten Jahr kein Verkauf/Gnadenhof, nur Rückgabe an den Tierschutz ohne Erstattung.
- **Ankaufsuntersuchung (Etappe G):** `AKU` klein/mittel/groß (200/500/1.000 €) in jedem Kauf-/Bieten-Fenster, Ergebnis sofort + Protokoll-Brief. Versteckte Befunde je Herkunft (`akuFunde`, `AKU_RISIKO`), Verhandeln (`AKU_VERHANDELN`), beim Kauf kommen sie mit (`akuUebernehmen`; Händler verdecken Lahmheit manchmal mit Schmerzmittel). Blutprobe einlagern `p.blutprobe` (`probePruefen`, Händler erstattet ½).
- **Briefe:** immer „Sie“; Du-Angebot nach 6 Briefen eines Absenders, aber nur ab 180 Punkten geheimem Ansehen (`ruf`, Start 100, Skala 0–200, ±5 je Kontakt); fällt es bei Duz-Partnern auf 100 oder darunter, wird das „Du“ zurückgezogen. Ansehen nie zeigen (nur Admin). Stern-Ordner „Wichtig“. Texte mit `{du-Form|Sie-Form}`. Pferdenamen anklickbar (`briefLinks`). Aktions-Knöpfe (`aktion`): duzen, bieten, kaufangebot, rechnung, urlaub, azubi, befund (Zum Pferd / Tierarzt / vertrauen).
- **Rechnungen** (`rechnungStellen`, `rechnungenTag`, `externJahreszeit`): Zahlungsziel 2 Tage → Mahnung (+10 %, mind. 20 €) → nach 5 Tagen Abbuchung + 20 % (mind. 50 €). Neue Rechnung desselben Absenders ersetzt die alte. Absender u. a. Tierarztpraxis, Hufschmied, Aufzuchtstation, Ausbildungsstall.
- **Klinik:** stationär bis 75 %; bei ≤ 30 % erholt sich ein Pferd nur noch dort. Kastration 450 € inkl. 2 Tage → Wallach (`geburtsGeschlecht`). Kolik-OP 3.000 € inkl. 3 Tage.
- **Pflege:** Schmutz (`p.dreck`), Putzen durch Wischen im Stallbild (Bürste, Kamm, Hufkratzer mit 4 Hufunterseiten; `wischStart`), Pferdepfleger putzt automatisch. Bis −15 % Marktwert, > 1 Jahreszeit verdreckt −3 % Gesundheit/Tag. Wohlbefinden wirkt auf Lerntempo (`wohlFaktor`) und Fruchtbarkeit. Eigenes Putzzeug je Pferd (`p.putzzeug`).
- **Weide** (Ort → Weide, `p.weide`): Gesundheit/Tag Frühling +10, Sommer +12, Herbst +7, Winter +5; Heu nötig im Winter und am letzten Herbsttag. Am selben Tag zurück: Krippe/Mist wie vorher (`vonWeideHolen`). Gesperrt bei Boxenruhe und Quarantäne.
- **Pferdeanhänger** (beide aus `ANHAENGER`/`ANH_ZIEL` – neue Ziele nur dort eintragen).
- **Befunde (Etappe C):** `p.befunde` (art, grad 1–5, ursache, bemerkt, meldungen, vermutung, diagnose, tierarzt/hufschmied), alte in `p.befundAlt`. Katalog `KRANK`. `befundeNacht` (neu, Verlauf, Wirkung, Tod nur nach Warnung `gewarnt`), `befundeMorgen` (Mitarbeiter bemerken, `einschaetzen`), `anzeichenBeimBesuch` (Sprechblase), `befundAufklaeren` (Erfahrung). Etwa 1,5 Befunde pro Pferd und Jahr.
- **Behandlung (Etappe D):** `gewicht(p)`, Anzeige `gewichtAnzeige`, 5 Dosisstufen `DOSIS`. Stallapotheke `APO` (frei kaufbar in `spiel.apotheke`, Rezeptmittel je Pferd in `p.rezept`). Aktionen `AKTION`, `behandeln(p, k, stufe, wer)`, Wirkung über `HILFT`/`SCHADET` → `behandlungsWert` (× Mitwirkung). Tierarzt: Hausbesuch 80 €, Diagnose + Erstbehandlung (zählt für den Tag) + `PLAN` + Rezept (4 Dosen). Hufschmied gibt nur Rat ohne Rezeptmittel (`hufschmiedRat`). Behandlungsplan an Pfleger/Pferdewirt `p.behPlan` (`planVorlage`). Überdosis → Befund „vergiftung“. Vorsorge-Knöpfe (Impfung 60 €, Zahn 70 €, Wurmkur) erst, wenn bald fällig.
- **Hufe (Etappe E):** `hufQ(p)` (Rasse `HUF_RASSE`, vererbt), `hufW(p)` → `hufIntervall`. Hufschmied (Barhuf 30, Beschlag 140, Hufe messen 10, Anfahrt 20 € einmal am Tag), Dauerauftrag `p.hufAuftrag` mit Rhythmus `p.hufRhythmus` (Empfehlung erst nach 3 Besuchen `p.hufBesuche`), Stallmeister legt Termine zusammen. `hufLaenge`/`hufZuLang` als Risiko. Auskratzen `p.ausgekratzt`. Strahlfäule, Hufabszess, Hornspalt, Eisen verlieren. Hufgröße `p.hufGr`, Hufschuhe je Pferd `p.hufschuhe.vorne/hinten` (Einsatz erst mit Training im Gelände).
- **Ansteckung (Etappe F):** `ANSTECKEND` (Wege weide/luft/kontakt/traenke/putzzeug/traeger), Inkubation `b.inkub`, `ansteckungNacht`, `beruehrt(p, wer, wie)`, Neuzugänge `neuzugang`. Quarantäne `p.quarantaene` (1 Jahreszeit), Mitarbeiter nur für ein Pferd `m.nurFuer`. Blutbild klein 40 / groß 120 € (`blutbildNehmen`, Ergebnis nach 2 Tagen, auch wenn das Pferd weg ist).
- **Lager** (hvw – Hof): `spiel.lager` (Putzzeug, Hufschuhe) – `zubehoerInsLager` bei Verkauf, Rückgabe, Abgabe, Gnadenhof und Tod; weitergeben, spenden an Gnadenhof/Tierschutz (Sympathie +3) oder wegwerfen.
- **Mitarbeiter (hvw – mab):** Stallgröße klein ≤ 8, mittel 9–19, groß ≥ 20 Boxen (`stallGroesse`). Berufe in `MA_TYP`: Azubi (100/120/135 €, braucht Ausbilder), Stallbursche 300 € (3 Boxen, mit Stallmeister 5), Pferdepfleger 330 €, Pferdewirt Zucht und Haltung 360 € (ab mittel), Pferdewirt Haltung und Service 340 € (nur Pension/Gnadenhof), Bereiter 420 € (ab mittel, bewegt Pferde), Stallmeister 500 € (ab groß). Bewerber je Jahreszeit (`bewerber`), 7 Wissensbereiche (`WISSEN`, Spieler `spiel.wissen`), Eigenschaften `MA_EIGEN`. Versteckte Zufriedenheit `zufr`, Urlaub einmal im Jahr 1–3 Tage, krank 1–3 Tage, Kündigung unter 25. Nachtdienst bei Geburten 30 €.
- **Azubi (B3):** nur mit freiem Ausbilderplatz (`freierAusbilder`: Pferdewirt/Stallmeister je 2, Bereiter nur im Ausbildungsstall, Spieler mit `spiel.ausbilderschein` 500 € je 1). Ausbildung 3 Jahre, Abschlussprüfung (`azubisJahreszeit`), Übernahme per Brief. Fachrichtungen `FACH` nach `spiel.stallarten` (bis zum Hof-Ausbau `["zucht"]`).
- **Hofverwaltung-Reiter:** Hof (mit Lager), Finanzen (nach Jahreszeit gruppiert), Außer Haus, Mitarbeiter (mit Hufschmied-Kachel und Ausbilderschein), Postfach, Einstellungen. Boxen bauen/entfernen mit + / − in der Boxenübersicht im Stall.
- **Training daheim (Werte-Etappe 4):** ppf – Ort – Reitplatz/Gelände (Spieler; Roundpen/Reithalle nur Admin bis zum Hof-Ausbau). Übungen `UEBUNG` (Ort, Mindestalter, Energie, Zuwachs für Skala `sk`, Werte `w`, Disziplin-Stand `d`), `trainieren(p, k, ort, m)` mit Trainingsbericht `p.trainHeute`. Energie `energie(p)`/`energieMax(p)` (an Gesundheit, Wohlbefinden und Krankheit gekoppelt, auch unbemerkt „wirkt matt“), Nacht `trainingNacht`. Ausbildungsskala je Stufe in `p.skala` (`skalaGrenze`: 20-%-Regel, Schub-/Tragkraft), Phasen-Klammern in stb – asb. Gangwerk-Bonus `gangGezeigt`/`gangBonus` (`p.gangStangen`). Übertraining, Winter ohne Aufwärmen, Hufschuhe im Gelände, Altersbremse `p.fit`. Bereiter: Plan `p.trainPlan` (Häkchen) oder „entscheidet selbst“ (`bereiterWahl`). Ausbildungsstall `ausbildungsstallTag`. Tempo-Regler `TRAIN_SK`, `TRAIN_W`, `TRAIN_D`, `AUSB_X`. Reiten geht noch ohne Sattel/Trense – wird Pflicht, sobald die Ausrüstung kommt (Dome).
- **Disziplinen (Werte-Etappe 5):** `DISZ` (11 Disziplinen mit Anteilen, Charakter ±10 %, Ausbildungsstand), `diszWert(p, k)` = (0,65 × Werte + 0,35 × Stand) × Charakter, eigener Stand `p.disz` (springen, western, gelaende), Stufen E–S bzw. Einsteiger–Open (`STUFE_STAND`, `STUFE_WERT`), Springhöhe ≈ 0,95 × Stockmaß. Marktwert nach bester Disziplin (`besteDisz`).
- **Turniere (Werte-Etappe 6a):** Kalender `spiel.turniere` (`turnierKalender`, Hofturnier/Regional/Groß, Winter Halle), Nennen über beide Pferdeanhänger (`turnierDialog`, `nennSperre`) bis zum Vortag; Turniertag `turnierMorgen` (Pferd unterwegs `p.turnier`), Ergebnis `turnierNacht` → Brief am nächsten Tag. Reiter-LK je Disziplin `spiel.lk` (`LK_STUFEN`, Aufstieg `lkErfolg`). Erfolge `p.erfolge` in stb – asb und im Marktwert (`erfolgWert`). Stuten mit Fohlen bei Fuß und hochtragende nicht, tragend keine Sprünge.
- **Noch offen aus der Vorbereitung:** `futterFaktor()` (bis zur Fütterung 1).

## Zusammenarbeit
- Dome testet im Browser auf dem Handy und am PC und schickt Screenshots mit Wünschen.
- Änderungen klein und nachvollziehbar halten, alte Funktionen nicht kaputt machen, Speicherstände abwärtskompatibel lassen (fehlende Felder mit Standardwerten auffüllen).
- Änderungen direkt auf den Branch `main` hochladen (kein extra Branch, kein Pull Request) – Dome möchte das so.
- Vor dem Start Aufwand jeder Aufgabe kurz einschätzen (klein/mittel/groß). Nennt Dome ihr Restvolumen, sagen, was davon reinpasst, und mit dem Wichtigsten anfangen. Nach jeder fertigen Teilaufgabe auf `main` hochladen, am Ende sagen, was offen ist.
- Dome plant größere Themen in einem Claude-Projekt-Chat. Wenn ein Thema fertig ist oder Dome danach fragt: einen Zusammenfassungstext für den Projekt-Chat geben.
- Diese Datei darf Claude nicht selbst ändern – Dome trägt Änderungen ein; Claude gibt ihr dafür Texte oder eine fertige Datei.

## Kürzel von Dome (Wege im Spiel)
Dome schreibt Wege mit diesen Kürzeln; Unterbereiche schreibt sie aus (z. B. „pmk - Pferdehändler“, „asr - Putzkiste“).
- **Hauptmenü/hm** · **Startmenü/start** · **Menü** = Hamburger-Menü ☰ oben rechts · **Brief-Popup** = Brief über den gelben Umschlag oben rechts
- **Stall** = hm - stall (Boxenübersicht) · **Box** = hm - stall - box
- **Steckbrief/stb** (Box): **Daten**, **Genetik**, **Aufschlüsselung/afs**, **Gangwerk/gw**, **Eigenschaften/eig**, **Charakter**, **Ausbildung/asb** (≠ Ausbildungsstall, der wird ausgeschrieben)
- **Pferdepflege/ppf** (Box): **Versorgung/vsg** (früher „Gesundheit“), **Ausrüstung/asr**, **Ort**, **Test** (nur Admin)
- **Pferdeanhänger/pah** = BEIDE Anhänger (Box - ppf - Ort - Pferdeanhänger und hm - Pferdeanhänger), immer gleich halten; nur der im hm hat Mehrfachauswahl
- **Pferdemarkt/pmk** · **Hofverwaltung/hvw**: **Hof**, **Finanzen**, **Außer Haus**, **Mitarbeiter/mab**, **Postfach/Post**, **Einstellungen/esg**
- **Enzyklopädie/enz**: **Rassen**, **Rassenansicht/ras** (Rassen-Kachel, z. B. Araber, mit Stockmaßbild und Admin-Genwahl), **Vererbung/vrb** und **Berechnungen zum Nachschlagen/bzn** (beide nur Admin)
- **Gnadenhof/gdh** · **Pferdefriedhof/pfh**
- **Rücksprung** = nach Abschließen oder Abbrechen einer Aktion zurück in die Ansicht, in der sie gestartet wurde (wie beim Brief-Popup)
