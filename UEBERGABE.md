# Übergabe zwischen den Claude-Konten

Dome arbeitet abwechselnd mit zwei Claude-Konten am Spiel: **Claude Team** und **Claude Pro**.
Diese Datei ist der Austausch zwischen beiden – damit das jeweils andere Konto beim nächsten Start weiß, was passiert ist.

## Regeln für diese Datei
1. Beim Start einer Sitzung diese Datei lesen.
2. Steht unten als Absender **das andere Konto**: Infos lesen und übernehmen (CLAUDE.md, Pläne und Code sind schon aktuell – die Datei erklärt nur, was neu ist). Danach den Abschnitt „Nachricht“ **löschen**.
3. Am Ende der eigenen Sitzung (bzw. wenn Dome wechseln will) den Abschnitt „Nachricht“ neu schreiben: Absender = eigenes Konto, was gemacht wurde, was offen ist, worauf zu achten ist. Hochladen auf `main`.
4. Steht als Absender **das eigene Konto**, hat das andere Konto noch nicht gelesen – nichts löschen, nur ergänzen.
5. Weißt du nicht, welches Konto du bist: Dome kurz fragen.
6. Bilder (z. B. Entwürfe, Screenshots) dürfen für die Übergabe in den Projektordner, wenn sie wichtig sind – sobald sie nicht mehr gebraucht werden, wieder löschen (Dome, 18.10.2026). Sonst Test-Screenshots nur im Scratchpad.

---

## Nachricht

### Sitzung 24.10. (Preise) – v805 (Claude Team, Sonnet) – für Pro
Dome wollte die Futterkammer-Preise und andere Preise real prüfen. **v805:** Heu/Einstreu/Mineral, Unterhalt, Tierarzt, Beschlag, Boxenstall, Reitplatz, Reithalle, Land, Bauland, Pacht neu (Tabelle alt/neu/echt in `PREISE-VERGLEICH.md`, Rückweg dort). Paddockboxen und Makler-Preise habe ich mitgezogen (Verhältnis). **Offen (Dome fragen):** (1) Kaufpreis des Start-Hofs (20.000 €, Sachwert mit neuen Preisen 30.266 €) und andere Immobilien (`IMMOBILIEN`, Makler-Hofstelle 8.000) – nicht angefasst; (2) ✅ v808 Preise der übrigen Gebäude und Immobilien/Makler umgesetzt (`PREISE-VERGLEICH.md`); **offen: Mietpreise** (Abfohlbox-Aufpreis, Ammenstute, Beritt, Aufzucht) – Dome will sie besprechen; (3) Löhne und Pension sind laut Dome abgeschlossen; zwei Zeitmaßstäbe bleiben Projekt-Chat-Thema; (4) ✅ v806: `tests/dispo-test.js` repariert, „Wohnhaus“ heißt „Büro“. Tests angepasst: hofplan (11.250 €), heu-vorschlag (0,18 €/kg). Preise ändern keine Mechanik, alte Spielstände behalten ihre Gebäude-Preise.


### Sitzung 24.10. (spät) – v769–v803 (Claude Team, Sonnet) – Stand für Pro
Alles auf `main`, Details je Version in `CLAUDE.md` (v769–v803). Kurz:
- **Whiteboard/Orte:** Plan ↔ Standort immer synchron, roter Rahmen = Orientierung (bleibt auch im freien Quoten-Rahmen, Tooltip erklärt), gesperrte Weide mit rotem Kreuz und „Aussaat – noch x Tage“, grüner Zielrahmen um die ganze Weide-Karte (täglich), **neu v800: Zeile „🧺 Versorgung heute“ (✔/✗ Heu, Futter, Wasser, Misten) bei jedem Pferd**.
- **Pension:** Richtwerte 150/400/750 (Box), Paddockbox 190/500/940, Zusatzleistungen angepasst (alte Spielstände behalten eigene Preise, zu niedrige werden einmal still angehoben), Einsteller-Kacheln. **Weide-/Sandpaddock-Wunsch mit Quote je Jahreszeit** (`WEIDE_QUOTE` 0,7/0,85/0,5/**0,4**, `weideFrei`, ein Tag immer frei); hinter dem Wunsch „(bisher/mindestens)“ (`weideStandTxt`, `weideMin`), auch im Winter sichtbar.
- **Hofplan:** Bau-Bestätigung per Kreis (✔ mit Preis + Bauzeit, rotes ✕), Sandpaddock nur über Ausbauen (kein Vergrößern mehr), Roundpen 12/18/24 m (3/4/5 Kacheln).
- **Sonstiges:** Pferd in allen Boxen ganz vorn (Objekte bleiben antippbar), Update-Fenster Stufe 5 und 6 veröffentlicht (`NEUES_STAND` 794).
**Selbst gesetzte Zahlen (Dome informieren):** Winterquote 40 %, ein freier Tag je Jahreszeit (`WEIDE_FREI_MIN`), Roundpen-Raster aufgerundet (12 m → 15 m).
**v804 ✅ Boxnummern je Gebäude überall** (Dome: ohne Gebäudenamen; `bnr(i)`, neue Texte nie mit `i + 1`).
**Offen / auf Dome warten:** (1) Neues Update-Fenster für v799–v803? (nur auf Domes Ansage). (3) Große Tests nur mit Domes Ja + Bilder-Variante; Tutorial-Spieler nur zusammen damit. (4) Pferdefriedhof-Idee (Thema 26) erst nach Domes Ja.
**Regeln von Dome (24.10.):** Übergabe bei jeder Auslieferung pflegen; bei missverständlichen Wünschen erst nachfragen, nicht raten.
**Achtung:** nach jeder Änderung alle Skriptblöcke mit `node --check` prüfen; Kommentare nur am Zeilenende.

### Aufnahme von Dome (24.10., v762) – Etappe 1+2 fertig (Claude Team, v763/v764)
Dome hat 14 Meldungen aufgenommen (`Zuchtstall_test-der-neuesten-funktionen…json`). Abgesprochen: 3 Etappen, Etappe 2 mit Opus. **Etappe 1 ✅ v763:** Fressdauer 5 s, Pinnwand größer, Weide im Ort-Plan anklickbar, Büro = Labor (umbenannt), Spielumfang-Schalter weg, „Tutorials“ mit Liste aller Kapitel (Meldungen 1, 2, 3, 6-Teil, 13, 14).
**Etappe 2 ✅ v764 (Opus):** „Orte“, Kacheln unter dem Plan weg (nur Fallback für Ungeplantes), Zurück immer zu „Orte“, Umstellen mit Rückfrage zwischen allen Boxarten (Einstreu/Futter/Wasser ziehen mit – der Fehler steckte in der Box-wechseln-Liste), Weide ↔ Sandpaddock mit Rückfrage und Whiteboard-Abgleich. Selbst entschiedene Punkte in `OFFENE-FRAGEN.md` („Aufnahme 24.10. – Etappe 2“). Tests: `orte-test` 39/39 in 3 Ansichten, hofplan/sandpaddock/whiteboard/tutorial/stufen grün, Tutorial-Spieler anf+fort 390×844 ✓. **Als Nächstes: Etappe 3 mit Sonnet – Dome schaltet um.**
**Nachtrag v765 (Opus, Dome):** Titel „Stall“ im Whiteboard → alte Stallansicht mit Ziehen (gekoppelt), zurück über Titel/„📋 Whiteboard“. **Neue Regel:** Tutorial-Tests nur noch mit dem großen Test oder auf Domes Ansage. `wuensche-test`/`weiden-oberflaeche-test` an den Weide-Pfeil angepasst.
**Etappe 3 ✅ v768 (Sonnet):** Kreis-Menü im Hofplan, Reiterköpfe auf den Plätzen, roter Rahmen im Whiteboard. Dazu v766/v767 (Stall: Pferde draußen umstellbar, Wünsche nur mit passendem Mitarbeiter). **Alle 14 Meldungen der Aufnahme sind umgesetzt – Dome testet.** Neue Idee von Dome: Pferdefriedhof als Gebäude → `PROJEKT-CHAT-THEMEN.md` Punkt 26 (noch nicht beschlossen, auf Dome warten).

### Stand davor (Claude Team, 24.10. – v762)
**Fertig seit dem Hofplan:** v761 Luzerne im Heu- und Strohlager (Dome: ja); v762 Update-Fenster Stufe 4 (`NEUES_STAND` 761, Datum 24.10.2026: Hofplan, Verwaltung ⚠️, Lagerung ⚠️; alles andere von Dome abgelehnt – nie wieder anbieten, Liste in CLAUDE.md bei v762); Test `aufnahme-fixes-test` repariert (Zufallsschlüssel `data-k` beim Bildvergleich ignoriert, kein Spielfehler). Selbst gesetzte Zahlen (Verwaltung +4/+8, Futterkammer 200/350/600 kg + 30 je Box, Büro-Maße und Preise) hat Dome bestätigt („so lassen“).
**Offen / auf Dome warten:** (1) Große Tests (etappen-test, hof-gesamttest, neuladen-test) – für den Hofplan angepasst, nie gelaufen; erst fragen, welche Bilder-Variante (aus/fehler/alle). (2) Alle Preise nochmal durchgehen (`PROJEKT-CHAT-THEMEN.md` Punkt 12). (3) Domes Abnahme des Hofplans. (4) Möglicher Zusatz: eigene Sorte „Luzerne-Cobs“ für die Futterkammer – nur auf Wunsch. (5) Nächstes Update-Fenster: nur Änderungen ab v762, und nur auf Domes Ansage. Tutorial-Spieler immer allein laufen lassen.

### Sitzung 24.10. nachts – Hofplan-Etappen (Claude Team, Opus) – Fortschritt
Dome: „Ja für alle Etappen, Fragen sammeln und am Ende rausgeben“; Wecker 6:05 prüft, ob alles fertig ist, sonst weiter.
| Etappe | Stand |
|---|---|
| H1 Raster, Platzieren (+ Feinraster 1 m / 25 m) | ✅ v752 |
| H2 Anbauen/Ausbauen/Reparieren/Abreißen im Plan | ✅ v753 |
| H3 Box → Ort aus dem Plan | ✅ v754 |
| H4 Bauland zukaufen/verkaufen/verschieben | ✅ v754 |
| H5 Tutorial, Hinweise, Stufen, Enzyklopädie, Tests | ✅ v754 (Enzyklopädie am PC 5 Spalten nebenbei, Dome) |
Fragen stehen in `OFFENE-FRAGEN.md` („Hofplan-Etappen“). Große Tests (etappen/hof-gesamttest) sind angepasst (`planAutoSetzen()` nach `bauStarten`), aber nicht gelaufen (nur nach Domes Ja).
**Tests:** `tests/hofplan-test.js` grün in 3 Ansichten; Tutorial-Spieler anf 390×844 ✓, fort 390×844 ✓, anf 844×390 ✓ (3 Läufe, v758). Der feste Hänger bei „Einstellen“ ist behoben (Fenster-Ziel wird ins Sichtfeld geholt), der zufällige bei „Hufe“ trat nur auf, wenn nebenbei andere Tests liefen – Tutorial-Spieler immer allein laufen lassen.
**v759 (Dome-Antworten 2):** Verwaltung wirkt (Ansehen +4/+8 ab v760, Mitarbeiter-Zufriedenheit +1/+2 ab Stufe 2), Lagerung wie in echt (Kraftfutter in den Futterkammern der Ställe, Raufutter/Einstreu im Heu- und Strohlager); Preise: alles nochmal anschauen (Thema 12). Zahlen in OFFENE-FRAGEN.md.
**v758 (Dome-Antworten):** Futterkammer im Stall, Verwaltung als Gebäude (Büro Stufe 1–3), Bauland aus 0,5-ha-Rechtecken (auch alte Spielstände), Ort-Plan mit Pfeilen für Weide/Gelände, Sandpaddock gezielt – siehe OFFENE-FRAGEN.md.
**Nebenbei (Dome-Aufnahme/Wünsche):** v755 Whiteboard (automatisch zugeteilte Mitarbeiter mit ✕ entfernbar = „niemand“, Weidepferde zählen als versorgt), v756 Whiteboard zeigt alle gebuchten Pensions-Extras, Enzyklopädie am PC 5 Spalten (v754).
**Danach (Dome):** Update-Fenster – ✅ erledigt in v762.

### Sitzung 24.10. – v733–v751 (Claude Team, Sonnet), alles auf `main`
Thema: Pferdeköpfe/Randabstand und **realistische Fellfarben nach Studien**. Details je Version in `CLAUDE.md` (v733–v751).
- Kopfbilder überall gleich zugeschnitten (`kopfBild`/`kopfAuto`/`enzAuto`), Seitenrand-Breite für alle Enzyklopädie-Reiter, Pferdeanhänger und Whiteboard.
- Neue Gene Hellfalbe `Hf` (Fjord), Mushroom `Mu`, Pearl `Prl`; Tricolor-Name; Rassen-Häufigkeiten nach UC-Davis-Studie, Noriker-Bachelorarbeit, Durward-Akhurst-Supplement (nur belastbare Zahlen; Begründung je Version in CLAUDE.md).
- **Seltenheit:** ganze Fellfarbe zählt als selten, wenn höchstens 1 % der Rasse sie hat (`farbMerkmal`, `FARBE_SELTEN`), nur wenn kein einzelnes Gen schon selten ist (Dome: „ja“). Raritäten-Markt: zweites Angebot einer Rasse wiederholt nicht das Gen des ersten/Vorjahrs.
- Haflinger-Rußgen .3 → .12 (Dome: ja), Quarter-Cream .07, Clydesdale E .8/A .72, Quarter DMRT3 .052.
- **Fehler gelernt:** Backticks in bzn-Texten (Template-Literal) brechen das Spiel – `<code>` nehmen; nach jeder Änderung alle Skriptblöcke mit `new Function` prüfen.

**Offen / auf Dome warten (nichts davon ohne ihre Ansage bauen):**
1. Hofplan als Raster: ✅ H1–H5 fertig (v752–v754), Abnahme steht aus.
2. Update-Fenster: ✅ erledigt (v762).
3. Möglicher Zusatz: Tobiano bei Warmblütern (laut Review vorhanden, ohne Zahl) – nur auf Wunsch.
4. Alte Punkte aus der Nachricht darunter (Fragen 1–4 vom 23.10.) sind weiter unbeantwortet.

---

### (Ältere Nachricht, Stand v722)

**Von:** Claude Team · **An:** Claude Pro (oder neue Team-Sitzung) · **Stand:** v722, 23.10.2026

### Sitzung 23.10. (Abend) – v708–v722, alles auf `main`
Domes Wünsche zu Whiteboard, Mitarbeitern, Waschplatz/Solarium sind umgesetzt (Details je Version in `CLAUDE.md`):
| Thema | Version |
|---|---|
| Seitenrand ⅓ kleiner, Pacht-Zäune verschmelzen, Weide-Tritt/Matsch | v708–v713 |
| Whiteboard: Boxen/Weiden-Plan je Jahreszeit, Holzrahmen, Geschlecht, Chips mit ✕ (auch Pension), Übersicht als Bildschirmfoto/„Noch offen“-Liste | v703–v722 |
| Mitarbeiter-Avatare (Dome-Blatt `avatare.js`) in hvw, Whiteboard, Briefen | v715/v716 |
| Pension Waschen/Solarium geprüft + Fehler behoben (Aufgaben, Abrechnung, Pfleger nötig), Pferdeshampoo mit Glanz, Wäsche vergessen ärgert Besitzer | v716–v718 |
| Wünsche an die Mitarbeiter je eigenem Pferd (Haken im Whiteboard), Shampoo-Kauf in der Futterkammer | v719 |
| Box-Ansicht Weide aufgeräumt, Weide/Sandpaddock nur per Whiteboard (ab Fortgeschritten), Mitarbeiterfotos nach Platz | v720 |
| Sattelkammer ausgegraut, Whiteboard-Navigation (Stall → immer Übersicht, „‹ Whiteboard Übersicht“) | v721/v722 |
| Rahmenfarbe verrät die versteckte Chemie nicht mehr (orange = gestern gestritten, rot = 3× gestritten) | v722 |

**Offene Fragen an Dome (Antwort steht aus):**
1. Soll der Steckbrief bei Pensionspferden zusätzlich „heute laut Plan: …“ zeigen? (Dome fragte zweimal „wie meinst du das?“ – einfach erklärt, noch kein Ja.)
2. Haken-Liste im Whiteboard: aufklappbar machen? (Dome schaut sich das an und sagt Bescheid – nicht von selbst fragen, sie meldet sich.)
3. „Heute gefressen“ fehlt in der Weide-Karte (auf Dome-Wunsch entfernt) – bei Bedarf als kleine Zeile zurück.
4. Shampoo: soll das Personal sparsamer sein (nur Pensionspferde mit Leistung)? Hinweis bei leerem Vorrat ist da (Brief).

**Nachtrag (gleiches Konto, Sitzung 23.10. spät) – v723:** Fress-Animation (Heu → Kopf zum Boden mit Grasestellung der Beine, Kraftfutter → Kopf zur Krippe, nacheinander; Weide: Pferde grasen ab und zu ~30 s), Whiteboard-Weiden mit größerer Schrift. Test `tests/fress-test.js` grün in 3 Ansichten. Offen/zu fragen: Animation auch bei matten Pferden (waagerecht/tief)? Grasen am Hofplan/Ort-Koppel? v724: matte Pferde fressen aus ihrer Haltung, 40+40 Mitarbeiter-Namen. **Offen:** Dome will die Schimmel-Anlagen (`ex.grauTempo`, `kurve`, `maehne`) in Seltenheit und Raritäten-Markt – Vorschlag mit Zahlen liegt bei ihr, Antwort abwarten.

**Nachtrag v729:** Scheckung „fast weiß“ ist eine Seltenheit und kommt auf den Raritäten-Markt (Details bei v729 in CLAUDE.md). **Nachtrag v726:** Schimmel-Anlagen als Seltenheit + Raritäten-Markt (Kombination „weiß mit 18 J. / bleibt dunkelgrau / Mähne früh weiß“, ab v728 nur noch die komplette Kombination, ≈ 1,6× pro Marktjahr, `RAR.schimmel` regelt es; Fellfarben-Test zeigt die Anlagen; Anteile selbst gesetzt), Zaun-Abgleich (Weide 5 ha vs. Bauen 4 ha), Whiteboard-Schrift, „Noch offen“ bei überlasteten Mitarbeitern. Projekt-Chat-Thema 25 (Hofplan als Raster) eingetragen, Dome erklärt noch. Update-Fenster: für v726 nichts veröffentlicht (nächste Auswahl ab v726).

**Hinweise für die nächste Sitzung:** `NEUES_STAND` ist jetzt 724 (drittes Update-Fenster nach Domes Auswahl, v725). Nicht ausgewählte Punkte nie wieder anbieten (Liste in CLAUDE.md bei v725), nächste Auswahl erst ab v725. Große Tests liefen heute nicht (nur kleine Tests + Tutorial-Spieler fort 390×844 grün). `version.json` war seit v708 leer (behoben v716) – beim Hochzählen immer `echo '{ "version": "NNN" }' > version.json` benutzen, nie `open(..., 'w')` vor dem Lesen.

---
### Protokoll (Details je Version, chronologisch)
**Tutorial-Überarbeitung nach Domes Test von v597 (Etappen A–D inzwischen alle fertig, siehe oben; Einzelheiten):**
- **Antworten von Dome:** (1) Natursprung/Besamung: Zahlen so lassen (in echt ähnliche Chance, Unterschied bei Kosten/Verletzung/Hengstwahl) – nur im Tutorial erklären. (2) Boxstufen im Tutorial: alle Schritte mit sichtbarer Box zählen, in drei gleiche, aufsteigende Drittel teilen (Stufe 1, 2, 3), für alle Erfahrungsstufen. (3) Pferd lehnt Hustensaft beim ersten Mal ab, Tutorial zeigt, was dann zu tun ist.
- **Etappe A (Opus):** Tutorial-Pferde immer versorgt (Heu, Krippe, Wasser, Einstreu), Spieler füttert/mistet/putzt selbst; Kamm-Ziel (Hinweis zeigte neben das Pferd statt auf Mähne/Schweif); Steckbrief/Daten/Merkmale erklären und freigeben; Box-1-Klick zum Stall sperren; zu früh gesetzte Haken (Anfänger Kap. 8, Fort Kap. 1); Pferde-Sprechblase bleibt bis gelesen; Blase auf Brief-Popup, Info im Brief „am besten gleich bezahlen“, Stern anklickbar; Heunetz-leer-Bild Stufe 3, Kraftfutter-Krippe wie Stufe 2; **echter Spielfehler: Turnier-Nennen-Akkordeon öffnet alle genannten Turniere, Infofeld kommt immer wieder**; Pferdebild auch verschiebbar (Zoom); einheitlicher Kaufweg (Pferd direkt anzeigen, auch bei Deckanzeigen).
- **Etappe B (Sonnet, Anfänger Kap. 1–6):** Einstreu kaufen/auffüllen; Kap. 3 über zwei Tage mit Hustensaft (Stallapotheke, Weigern); Bereiter-Satz Kap. 4 klären; Kap. 5 Pferdevorschau im Brief, „Zwei Pferde“ hinein, Ende mit voller Versorgung; neues Kapitel Hauptmenü (Gnadenhof, Friedhof, alle Hofverwaltungs-Karten); Mitarbeiter ohne Einschränkung auf einen Stallburschen.
- **Etappe C (Opus, Anfänger Kap. 7–12):** Hofausbau (+ Anbau gegen Neu bauen, Reparieren – tut7 war „nutzlos“); Turnier mit Nennen, Zeitsprung, Ergebnis-Post; **Waschen: Reihenfolge nass → Shampoo → ausspülen im Spiel erzwingen (Mechanik prüfen) und im Tutorial**; Pferdeanhänger im Hauptmenü mit Beispielpferden (2 Fohlen zur Aufzuchtstation) und echtem Hofkauf; Pferdemarkt/Tierschutz (wo beschlagnahmte Pferde stehen, Steckbrief, Abstammungsschein, Pferd unter 30 %); Bank (weiterer Kredit, vorzeitige Rückzahlung).
- **Etappe D (Sonnet, Fortgeschrittene):** Kap. 2+3 zusammenlegen (Exterieur öffnen, Hengst-Klick hängt), Decken-Infos anklickbar, Kap. 4 endet mit Gentest-Ergebnis, Futterplan erklären und beendbar (altes Infobläschen weg), Auktionshaus im Hauptmenü, Pferd ersteigern.
- **Fertig in v607:** Anzeige „seit NaN Tagen bemerkt (von undefined)“ im Kapitel „Krankes Pony“ behoben (Tutorial setzte `bemerkt = true` statt `{von, tag}`).
- **Fertig in v608:** Turnier-Nennen: Karten und Disziplin-Gruppen klappen nur noch auf, was die Spielerin selbst geöffnet bzw. gerade genannt hat (vorher öffneten sich nach jedem Nennen alle genannten Turniere). Das „Infofeld, das immer wiederkommt“ ist noch nicht untersucht (vermutlich Einsteiger-Tipp `tippMerken("turnier")`).
- **Fertig in v609:** Wasch-Reihenfolge im Spiel erzwungen (Domes Wunsch): Shampoo nur bei nassem Pferd (sonst Hinweis, nichts verbraucht) → einschäumen (`p.schaum`, 1 Anwendung) → erneut „Abspritzen“ = ausspülen, erst dann Glanz (`p.fellGlanz`). Tutorial „Waschen“ (Fort) um „Shampoo“ und „Abspülen“ erweitert, bzn-Absatz, Test `tests/shampoo-test.js`, `tutorial-spieler.js` wischt auch bei „Shampoo/Abspülen“. Offen/auffällig: Schaum bleibt über Nacht ohne Folge (nur Tagesmerker) – Dome fragen, ob Shampoo-Reste schaden sollen; Anfänger-Tutorial hat noch keinen Wasch-Teil (kommt mit Etappe C).
- **Fertig in v610:** Boxschild (Klick zur Boxenübersicht) im Tutorial nur erlaubt, wenn der Schritt es nennt (`tutErlaubt`, nicht mehr über `#stall`); Turnier-Kapitel (Anfänger) zählt nur eine Nennung des eigenen Tutorial-Pferdes; Fort-Kapitel „Reiter-Können“ war durch `fertig: () => true` sofort „geschafft“ (Info-Schritte übersprungen) → `false`. **Nicht gelöst:** Kamm-Auslöser (Dome: reagiert links/rechts neben dem Pferd statt auf Mähne/Schweif) – `wischBewegen`, Bedingung `oben || hinten` bei `w.tool === "kamm"` (Mähne = obere 45 %, Schweif/Kopf = äußere 25 % links/rechts des `#pferdPlatz`-Rahmens); braucht Blick auf das Bild, Zonen evtl. an echte Mähnen-/Schweifposition koppeln. Pferdebild verschieben (Zoom) ebenfalls offen.
- **Fertig in v611:** Pferdebild im Tutorial-Fenster (`.sb-bild`, `#leseBild`) zoomen/verschieben ist immer erlaubt (die Tutorial-Klicksperre blockierte es; Verschieben mit der Maus im normalen Spiel funktionierte schon – Dome-Fehler war wohl die Sperre, auf dem Handy bitte gegenprüfen).
- **Fertig in v612:** leeres Heunetz in der Stufe-3-Box wird durchsichtig und schlaff gezeichnet (CSS `#stall.leer .sHeunetz`, Screenshot geprüft in 844×390). **Noch offen:** Kraftfutter-Krippe Stufe 3 „wie Stufe 2“ (Dome) – unklar, welches Aussehen gemeint ist (Stufe 3 hat einen hängenden Futtereimer); Pferde-Sprechblase im Tutorial bleibt bis gelesen; Infofeld nach Turnier-Nennen; Steckbrief/Daten/Merkmale im Tutorial erklären.
- **Fertig in v613:** Kraftfutter in der Stufe-3-Krippe als exakt dieselbe Futter-Ebene wie in Stufe 2 (`heuBerg` aus index.html in `boxstufen.js` kopiert, Klasse `sFutter`, Krippe unverändert, v614, verschwindet bei `kraftLeer`). Damit ist der Punkt „Krippe/Heunetz Stufe 3“ erledigt.
- **Fertig in v617:** Anfänger-Kapitel 1: Steckbrief-Schritte erklärt (neue Info-Schritte „Daten“ und „Was steht in Merkmale?“, „Merkmale“-Schritt gibt beide Reiter `steckbrief`/`merkmale` frei). Tutorial-Spieler anf 390×844 und `tutorial-test` grün. **Noch offen (klein):** Pferde-Sprechblase im Tutorial bleibt bis gelesen (unklar, welche Blase gemeint ist – Stall-Sprechblasen sind im Tutorial seit v577 aus), Infofeld nach Turnier-Nennen, Kamm-Auslöser.
- **Fertig in v618–v620:** Husten-Sprechblase im Tutorial-Kapitel „Krankes Pony“ bleibt, bis sie angetippt wird (`reaktionZeigen`, nur in diesem Kapitel; `#sprechblase` in `TUT_IMMER`; Kapitelstart zeigt „hustet ab und zu“). Kamm zählt nur über Mähne (`.maehnePfad`, neu in pferd.js) und Schweif (`.schweif`) plus 14 px Rand, sonst alte Zonen als Rückfall (`wischBewegen`). Tutorial-Spieler anf 390×844 grün. **Zurückgestellt (Dome 20.10.):** „Infofeld nach dem Turnier-Nennen, das immer wiederkommt“ – keiner der vier Kandidaten (Reiter-LK-Text, „Prüfungen ausgeblendet“, Einsteiger-Tipp, Nennen-Warnung) ist das gemeinte Feld; Dome liefert später einen Screenshot, Kamm-Zone auf dem Handy gegenprüfen.
- **Fertig in v621 (Etappe B, Teil 1):** Tutorial-Pferde in Kap. 3 und 4 zu Kapitelbeginn versorgt (`tutVersorgt`: Heu, Futter, Wasser, Mist, Einstreu Späne); `tutLagerFuellen` füllt auch Späne (30 kg) und legt die Einstreu der Boxen fest (sonst öffnete sich das Einstreu-Auswahlfenster schon in Kap. 1); Kap. 2 „Richtig füttern“: neuer Schritt „Einstreu in den Korb“ (20 kg Späne, Lager hat nur 3 kg für eine Nacht, Schritt VOR „Einkaufskorb“). Tutorial-Spieler anf 390×844 grün. **Etappe B noch offen:** Kap. 3 über zwei Tage mit Hustensaft (Pferd lehnt einmal ab), Bereiter-Satz Kap. 4, Kap. 5 Pferdevorschau im Brief + „Zwei Pferde“ + volle Versorgung, neues Hauptmenü-Kapitel, Mitarbeiter ohne Einschränkung, Boxstufen nach Dritteln (Dome: alle Schritte mit sichtbarer Box in drei gleiche aufsteigende Drittel).
- **Fertig in v622 (Etappe B, Teil 2):** Kap. 3 „Krankes Pony“ läuft jetzt über zwei Tage: Tierarzt → Brief → „Nächster Tag“ (Husten heilt nicht von selbst, `heilt` wird per Schritt-Hook gehalten) → Versorgung → Fütterung heute → Futterkammer → Hustensaft kaufen (Stallapotheke in der Futterkammer; Medizinkiste ist im Ausrüstungs-Reiter nicht erreichbar) → zurück → Geben (Medikamente geben → Hustensaft → Dosis; beim ersten Mal wehrt sich Krümel: `p.tutWehr` in `behandeln`) → Info „Wenn sich das Pferd wehrt“. `fertig: () => false`. Tutorial-Spieler wartet bei mehrstufigen Schritten länger (`gleich > 9`). Tutorial-Spieler anf 390×844 grün (nicht getestet: fort, 844×390, 1366×768). **Etappe B noch offen:** Bereiter-Satz Kap. 4, Kap. 5 Pferdevorschau im Brief + „Zwei Pferde“ + volle Versorgung, neues Hauptmenü-Kapitel, Mitarbeiter ohne Einschränkung, Boxstufen nach Dritteln.
- **Fertig in v623:** Überbleibsel „Medizinkiste“ im Ausrüstungs-Reiter entfernt (Dome: kann weg; Stallapotheke ist seit v259–v267 in der Futterkammer): Programmzweig `medModus`, `apothekeHTML`, Klick-Handler `#medKachel`/`#medZurueck`/`[data-apokauf]` in der Akte. Stallapotheke in der Futterkammer (`apothekeKammerHTML`) unverändert. Tutorial-Spieler anf 390×844 grün.
- **Fertig in v624–v626 (Etappe B, Teil 3):** Anfänger-Kap. 4 „Training“: Texte „Du und dein Pferd“ und „Bereiter“ verständlicher (Bereiter = Mitarbeiter, den man später einstellt). Kap. 5 „Pension“: Stern im Brief anklickbar (S[5] `[data-stern]`), neuer Info-Schritt „Pferd vorab ansehen“, Schritte „Zur Box“ und „Was du für den Einsteller tust“ (Klickschritte Heu/Futter/Wasser/Misten gingen nicht: bei Pensionspferden macht der Besitzer alles Ungebuchte, `pensionDarf`), `fertig: () => false`. Tutorial-Spieler anf 390×844 grün. **Etappe B noch offen:** „Zwei Pferde“ ins Pension-Kapitel (Dome: Tut 11 kann bei Tut 5 mit rein), neues Hauptmenü-Kapitel zwischen Pension und Mitarbeiter (Gnadenhof, Friedhof, alle Hofverwaltungs-Karten), Mitarbeiter ohne Einschränkung auf einen Stallburschen/anderen Mitarbeiter anschauen, Boxstufen nach Dritteln (alle Schritte mit sichtbarer Box in drei gleiche aufsteigende Drittel).
- **v627 / Fund beim Pension-Kapitel:** Dome: Heu, Kraftfutter und Wasser füllt sie bei Pensionspferden selbst auf (stimmt: `#heuhaufen`-Handler hat keine `fremd`-Sperre) – der Text im Info-Schritt „Was du für den Einsteller tust“ ist korrigiert. **Warum die Klickschritte hingen:** Im Tutorial bleiben Pferde früherer Kapitel in den Boxen stehen (beim Pension-Kapitel: Flocke in Box 1 Stufe 3, Krümel in Box 2), `tutPensionBox()` fand Flocke statt des Einstellers und der Einsteller stand ggf. in einer anderen Box. Für Klickschritte beim Einsteller müssen die Boxen zu Kapitelbeginn geleert werden (`spiel.boxen` zurücksetzen) und `[data-zubox]` die Einsteller-Box treffen. Tests: `tests/tutorial-spieler.js` hat bei `LAUT=1` nun eine Zusatzausgabe „Heu-Zustand“ beim Schritt „Heu“.
- **v628 (Dome-Spielstand: Pensionsanfrage angenommen, Box „reserviert“, Pferd zog nie ein, nicht kündbar, nicht sichtbar):** Ursache unbekannt (Spielstand nicht vorhanden – Dome schickt ggf. „Spielstand downloaden“-Datei). Verdacht: Reservierung `b.reserviert` ohne passende `spiel.pensionAnfragen`-Eintrag (`angenommen`) bzw. ohne Pferd in `spiel.extern`. Reparatur: `pensionAnfragenTag()` (nachts) gibt verwaiste Reservierungen frei. Test `tests/reservierung-test.js`. Falls die Anfrage noch existiert, aber nie einzieht: `pensionEinzug` (Bedingung `a.angenommen && a.tag < spiel.tag`, `pensionZielBox`, Ausnahme im forEach) mit dem Spielstand untersuchen.
- **Entscheidung Dome (20.10.):** Boxen zu Kapitelbeginn im Tutorial NICHT leeren – bleibt so (Pferde früherer Kapitel stehen weiter in den Boxen). Daher keine Klickschritte für das Pensionspferd; der Info-Schritt im Pension-Kapitel reicht.
- **v629 (Dome-Spielstand, Fortsetzung):** Nachtliche Bereinigung (v628) hat nicht geholfen → die Anfrage existiert noch, zieht aber nicht ein. Neuer Knopf „🔓 Reservierung aufheben“ in der leeren reservierten Box (`reservierungHaengt`: keine angenommene Anfrage dazu oder seit > 2 Tagen angenommen; löscht Anfrage + Reservierung). Ursache weiterhin unbekannt – Spielstand/Box-Text von Dome erbeten (siehe `pensionEinzug`). Test `tests/reservierung-test.js` (9 Prüfungen).
- Hinweis: `tests/tutorial-test.js` erwartet, dass nach der ersten Blase Schritt „Heu geben“ kommt – Reihenfolge der ersten Kapitel-1-Schritte nicht verschieben. Phase D (großer Test) wartet weiter auf Domes „weiter“.

---

**v809 (Claude Team, 24.10.):** Mietpreise (Abfohlbox, Beritt, Aufzucht fremd) wie von Dome angenommen. Großer Test mit BILDER=fehler: Etappen-Test 351 ✓, Neuladen-Test 7 ✓. Offen: Makler-Bauland-Anteil bleibt vorerst, Zeitmaßstab/Löhne/Pension = Projekt-Chat, Update-Fenster nur auf Domes Ansage.

**Zeitmaßstäbe (Dome 24.10.):** Idee, Kredit/Unterhalt/Pacht auf 7 Tage umzurechnen, abgelehnt. Alles bleibt wie es ist.

**v810 (Claude Team, 24.10.):** Sandpaddock-Preise auf echte Werte (6.000/15.000/30.000 €). sandpaddock-test grün.

**v811 (Claude Team, 24.10.):** Sandpaddock-Preise halbiert (3.000/7.500/15.000 €). sandpaddock-test grün.

**v812 (Claude Team, 24.10.):** Pension-Richtwerte 200/400/1.000 (Paddockbox 250/500/1.250); alte Spielstände stille Anhebung (`R.anpassV` 2) + Update-Fenster Stufe 7 (NEUES_STAND 811). Tests neues-popup, pension-paddock angepasst.

**v813 (Claude Team, 24.10.):** Zeile „Einnahmen“ in hvw – Hof – Pension entfernt. Offen: Aufzucht-Offenstall mit 10/25/50 Plätzen (Vorschlag Preise 15.000/40.000/90.000 €) wartet auf Domes Ja.

**Plan Offenstall (Claude Team, 24.10.):** `PLAN-OFFENSTALL.md` geschrieben (nur Plan, nichts gebaut). Nächster Schritt: Dome beantwortet die 4 offenen Fragen und sagt Ja, dann Etappe 1.

**Plan Offenstall (24.10.):** Dome-Antworten eingetragen (Nachfrage gleich, Arbeit je Gruppe, keine alten Spielstände betroffen). Noch kein Bau-Ja.

**Plan Offenstall (24.10.):** Gruppeneinteilung von Dome bestätigt, Bau auf später verschoben – nicht anfangen, bis Dome Ja sagt.

**Plan Boxansicht (Claude Team, 24.10.):** `PLAN-BOXANSICHT.md` + Bilder `entwuerfe-boxansicht/` (Gesamtentwurf 9.x, wo steckt was 10.x). Dome hat die Entwürfe gebilligt („ja“), Bau aber noch nicht freigegeben. Nächster Schritt: Dome klärt Punkte 1–3 im Plan und sagt Ja zu B1.

**Plan Boxansicht (24.10.):** Beschlüsse ergänzt: Besitzerwünsche ohne Hufschmied, mit Zusatzleistungen; Fenster dürfen scrollen; **Bau-Reihenfolge PC → mobil → Tutorial**; Reitplatz mit 5 Besitzern (Bild 11); Stufen-Tabelle als Vorschlag.
