> **An Coding:** Diese Datei enthält **zwei komplette Aufträge in einem Stück**: **Thema 6 „Karte Merkmale“** (Hauptteil und Anhänge A, B, C) und **Thema 9 „Reiter-Erfahrung“** (Hauptteil und Anhang A). Jeder Teil beginnt mit einer Zeile `=== TEIL … ===` und sagt, unter welchem Dateinamen er im Repo gespeichert wird. Reihenfolge der Umsetzung: frei, aber beide ändern dieselben Formeln (Marktwert, Turnierwert), siehe Hinweis im Hauptteil von Thema 9. Die Bilder zu Thema 6 liegen auf dem Branch `entwurf-merkmale-bilder` (Ordner `entwuerfe/merkmale/`). Die Hinweise und das Tutorial werden gerade vom Claude-Team überarbeitet, die Texte in den Anhängen B (Thema 6) und A (Thema 9) so in das aktuelle System einbauen.

Inhalt:
1. Thema 6: Hauptteil → `PLAN-MERKMALE.md`
2. Thema 6: Anhang A Tabellen → `PLAN-MERKMALE-TABELLEN.md`
3. Thema 6: Anhang B Texte → `PLAN-MERKMALE-TEXTE.md`
4. Thema 6: Anhang C Zeichenliste → unten an `BEI-INKSCAPE-BEARBEITEN.md` anhängen (Abschnitt 1)
5. Thema 9: Hauptteil → `PLAN-REITER.md`
6. Thema 9: Anhang A Texte → `PLAN-REITER-TEXTE.md`




=== TEIL 1 von 6: Thema 6 – Hauptteil – speichern als PLAN-MERKMALE.md ===

# Auftrag für die Coding-Sitzung: Karte „Merkmale“ (Beurteilungsbogen wie beim Zuchtverband)

**Stand:** 20.10.2026, im Projekt-Chat mit Dome geplant (Runden 1–3), Code-Stand beim Planen v575. Reihenfolge: M1 → M2 → M3 → M4 → M5.

**Wann umsetzen (Dome, 20.10.2026):** Die Themen 1–5 (Spielstand, Bilanz, Raritäten, Waschplatz, Hinweise/Stufen/Tutorial) sind schon gebaut. Es gibt keine Wartezeit. Die Hinweise und das Tutorial werden gerade vom Claude-Team überarbeitet: Anhang B so einbauen, wie die Hinweise jetzt im Code funktionieren (`PLAN-HINWEISE.md`, `TIPPS`/Blasen-System, `STUFE_NEU`, `tutorialStart`), und bei Widerspruch den neuen Stand gewinnen lassen.

## Zuerst speichern
1. Diese Datei im Repo als `PLAN-MERKMALE.md` speichern, Anhang A als `PLAN-MERKMALE-TABELLEN.md`, Anhang B als `PLAN-MERKMALE-TEXTE.md`.
2. Anhang C (Zeichenliste) in `BEI-INKSCAPE-BEARBEITEN.md` unten anhängen (Dome führt dort ihre Liste).
3. In `PROJEKT-CHAT-THEMEN.md` Punkt 6 („Neue Karte Merkmale“): „geplant → PLAN-MERKMALE.md“. Neue Punkte anlegen: **„Körung, Stutenschau, Hengstleistungsprüfung“** (Dome, 20.10.2026, später planen; hängt an der Zuchtbuch-Klasse unten) und **„Rücken, Fesselung, Stellung und Huf im Pferdebild sichtbar“** (wartet auf Domes überarbeiteten Körper). `PROJEKT-CHAT.md` aktualisieren.
4. `Kuerzel.md`: neues Kürzel **Merkmale / mkm** = Box - stb - Merkmale; **gw, eig, Charakter** sind jetzt Abschnitte darin (Box - stb - Merkmale - Gangwerk usw.).
5. Etappe für Etappe umsetzen, abhaken, nach jeder Etappe auf `main` hochladen. Regel aus Thema 5 gilt: jede neue Funktion bekommt gleich Tipp-Eintrag und Stufen-Eintrag.

## Ist-Stand (v575)
1. Box - Steckbrief hat die Reiter Daten, Genetik, Aufschlüsselung (nur Admin), Gangwerk, Eigenschaften, Charakter, Ausbildung (Leiste in `zeigeAkte`, `aktenReiter` = `steckbrief` / `genetik` / `aufschl` / `gang` / `werte` / `charakter` / `ausbildung`).
2. „⚖️ Vergleichen mit …“ (`vglKopf`, `vergleichPferd`, `vergleichId`) gibt es bei Gangwerk, Eigenschaften, Charakter und Ausbildung, aber nur mit eigenen Pferden (`alleEigenenPferde`). Zwei Balken übereinander (`.balken.vgl`, `.vgl-b`).
3. Daten zeigt Stockmaß, Kopf (`kopfName(kopfVon(p))`), Abzeichen, Beine, Maul, Zeichnung, Augen, Gewicht, Besonderheit (Zwergwuchs `p.zwerg`), Hufgröße (`p.hufGr`).
4. Die Zeichnung (`zeichnePferd` in `pferd.js`) hat je Rasse Stellschrauben `R.k`: `len`, `depth`, `legT`, `neck`, `nAng`, `crest`, `croup`, `hq` u. a. Reihenfolge dort: `{ ...R.k, ...ALTERS_K(stufe, R.k), ...(opt.k || {}) }`. **Wichtig:** `opt.k` überschreibt die Fohlen-/Jährlings-Proportionen. Darum dafür **nicht** `opt.k` nehmen, sondern eine neue Option `opt.bau` (siehe M1).
5. Vererbung von Werten: `erben()` mit `ERB_SCHLUESSEL`, Herkunft je Wert in `H` (`H.gang`, `H.charakter`, `H.anlage`, `H.ex`), Anzeige im Admin-Reiter Aufschlüsselung (`AUFSCHL_TEILE`, Teil „Größe & Exterieur“, Teil „Mutationen“). `werteErgaenzen(p)` füllt alte Pferde nach.
6. Gebissfehler gibt es schon: Veranlagung `biss` (versteckt), `p.gebissFehler` (nach Zahnbehandlung oder Ankaufsuntersuchung bekannt), Zahnbehandlung zweimal im Jahr.
7. Fohlenschau: `fohlenNoten` (Typ, Körperbau, Schritt, Trab, Eindruck), Kopf-Fehler `KOPF_WERT`, `KOPF_TYPNOTE`, `WEISS_RASSE`, `fjordWeissFehler`.
8. Marktwert `marktwert(p)` mit `abstFaktor`; Stufen `frei(f)`, `STUFE()`, `STUFE_NEU`; Adminmodus `spiel.admin`.

## Entscheidungen (Dome, 20.10.2026)

### Aufbau der Karte (M2)
1. Neuer Reiter **Merkmale** in Box - Steckbrief, zwischen Genetik und Ausbildung. Neue Leiste: **Daten, Genetik, Aufschlüsselung (Admin), Merkmale, Ausbildung.** Die Reiter Gangwerk, Eigenschaften, Charakter fallen als eigene Reiter weg. Intern bleiben `aktenReiter = "gang" | "werte" | "charakter"` gültig und öffnen Merkmale mit dem passenden Abschnitt aufgeklappt (damit Training, Hinweise, Tutorial und Tests nicht brechen).
2. Die Karte ist ein **Beurteilungsbogen** mit **Aufklapp-Bereichen** (Akkordeon, Pfeil ▶/▼ wie in der Enzyklopädie „Berechnungen zum Nachschlagen“). Reihenfolge: **1. Gesamteindruck** · **2. Exterieur** · **3. Farbe & Abzeichen** · **4. Gangwerk** · **5. Interieur** (Unterbereiche **Charakter** und **Eigenschaften** mit Körper und Kopf) · **6. Rassemerkmale** · **7. Besonderheiten**. Beim Öffnen der Karte ist nur „Gesamteindruck“ offen; welche Bereiche offen sind, merkt sich das Spiel pro Spielstand (`spiel.merkOffen`).
3. Oben in der Karte einmal „⚖️ Vergleichen mit …“ (`vglKopf`); der Vergleich gilt für alle Bereiche.
4. **Was in Merkmale gehört, steht nicht mehr in Daten.** Aus Daten wandern: Stockmaß, Kopf, Gewicht, Besonderheit (Zwergwuchs), Hufgröße (→ Exterieur) und Abzeichen, Beine, Maul, Zeichnung, Augen (→ Farbe & Abzeichen). In Daten bleiben: Name, Rasse, Farbe, Geschlecht, Alter, Geboren, Fohlenschau, Plaketten, Fohlen, Zucht, Auslauf, Befunde, Marktwert. Die Admin-Aufschlüsselung bleibt, wo sie ist, und zeigt auch die neuen Exterieur-Werte samt Herkunft.
5. Darstellung je Merkmal wie die Charakter-Skala: Balken zwischen zwei Gegensätzen, Marke für das Pferd, kleine Raute für das **Zuchtziel der Rasse**, rechts ein Wort („ideal“, „leichte Abweichung“, „deutlicher Fehler“, „starker Fehler“, bei den neutralen Merkmalen die Stufe wie „kurz“, „lang“). Beim Vergleich zweite Marke in der Vergleichsfarbe.
6. **Gesamteindruck:** Zuchtverbands-Noten in halben Noten: **Typ, Körperbau, Bewegung, Interieur, Gesamt** (Gesamt mit einer Kommastelle) und Zuchtbuch-Klasse (nur Stuten, siehe M4), darunter 2–3 Sätze „Stärken / Schwächen“.

### Exterieur-Werte (M1)
7. Zwölf Werte je Pferd, `p.bau = { rahmen, halsL, halsA, schulter, ruecken, kruppe, muskel, fundament, fessel, stV, stH, huf }`, jeder 0–100 (Pole und Wörter: Anhang A). Dazu bleiben Größe (Stockmaß), Kopf (Kopfform, schon vererbt) und Gewicht wie bisher. Angezeigt werden die Zeilen: Rahmen, Typ (Note), Hals (Länge und Aufsatz), Schulter/Widerrist, Rücken, Kruppe, Bemuskelung, Röhrbein/Gelenke („Fundament“), Fesselung, Stellung vorne, Stellung hinten, Huf, Gesamteindruck (Note).
8. **Zuchtziel je Rasse:** `BAU_ZIEL[rasse][merkmal]` = Mitte, Streuung `BAU_S = 15` für alle. Startwerte nach Rassengruppen in Anhang A (Dome liest die Tabelle gegen; die Tabelle steht nur im Code, im Adminmodus wird sie angezeigt). Mischlinge: Mitte aus den Rasseanteilen (`anteile`) gewichtet.
9. **Abweichung** `d = |Wert − Ziel| / BAU_S`. Stufen: **ideal** d < 0,7 · **leichte Abweichung** < 1,75 (kein Abzug) · **deutlicher Fehler** < 2,33 (etwa 6 %) · **starker Fehler** ≥ 2,33 (etwa 2 %). Hinweis: Das ist Normalverteilung; per Test die Anteile messen.
10. **Vererbung:** Kind = Mitte der Eltern + 0,2 × (Zuchtziel des Fohlens − Mitte der Eltern) + Zufall (Normal, Streuung 0,6 × `BAU_S`); mit 3 % zusätzlich Mutation (±1,5 bis ±2,5 × `BAU_S`). Herkunft je Merkmal in `H.bau[k] = { wert, quelle: "Schnitt der Eltern" | "Mutation", von }` (Admin-Aufschlüsselung, Teil „Größe & Exterieur“, und „Mutationen“).
11. **Fest ab Geburt:** alle Werte außer `muskel` und `huf`. **Bemuskelung** (Ist-Wert `muskelIst(p)`) = Anlage + 0,4 × (Kraft-Ist − Kraft-Anlage) − 3 × (4 − Futterzustand), wenn Futterzustand unter 4, Alter und Krankheit mindern (Boxenruhe, lange Krankheit −5), 0–100. **Huf** (`hufIst(p)`): Abweichung vom Zuchtziel × 0,7 bei guter Hufpflege (Hufschmied-Termine eingehalten, Hufe ausgekratzt), × 1,5 bei vernachlässigter (Namen im Code bei Hufschmied/Hufe prüfen, v317 ff.). Bei Fohlen und Jährlingen steht „Fohlen wachsen noch – endgültig mit 3 Jahren“; die Werte zeigen die Anlage.
12. **Alte Spielstände, Markt, Deckstation, Archiv, Friedhof:** `bauErgaenzen(p)` (wie `werteErgaenzen`) würfelt einmal aus, fest mit Seed `p.id + "-bau"`, ohne Brief. Es muss überall funktionieren, wo es Pferde ohne `p.bau` gibt (Eltern in `ahnen`, Marktpferde, Hengste der Deckstation, Raritäten). Marktpferde und Deckhengste: stabil (gleicher Seed, gleiches Pferd).
13. **Pferdebild:** neue Option `opt.bau` in `zeichnePferd`, wirkt **nach** `ALTERS_K` als Faktor auf `k`, höchstens ±15 % vom Rassenwert: `rahmen` → `len` (und `depth` halb), `halsL` → `neck`, `halsA` → `nAng`, `kruppe` → `croup`, `fundament` → `legT`, `muskel` (Ist) → `hq` und etwas `crest`. Schulter, Rücken, Fesselung, Stellung und Huf bleiben vorerst nur in Karte und Text, bis Domes überarbeiteter Körper steht. Aufrufer von `zeichnePferd` für Pferde (Stall, Steckbrief, Markt, Kopfbild-Kacheln) geben `bauOpt(p)` mit; Enzyklopädie/Rassenansicht ohne.

### Wirkungen (M3, maßvoll)
14. **Noten** (Formeln, Zahlen per Test abstimmen): Merkmalnote `n = 9 − 2,5 × d` (3 … 9,5, halbe Noten). **Körperbau** = gewichteter Schnitt der zwölf Merkmale (Gewicht 1,5 für Fundament, Fesselung, Stellung vorne/hinten, Rücken, Kruppe; sonst 1). **Typ** = bisherige Typ-Formel aus `fohlenNoten` (herausziehen als `typNote(p)`), minus 0,5 je Rassemerkmal-Verstoß (höchstens −1,5). **Bewegung** = Schnitt aus Schritt, Trab, Galopp (bei Tölt-/Passpferden Tölt statt Galopp) der gezeigten Gangwerte (`gangGezeigt`), bei Fohlen die Veranlagung; Hahnentritt −1. **Interieur** = 3 + 7 × M / 100 mit M = Schnitt aus Arbeitswille, Nervenstärke, Menschenbezug, Mut (Charakter, hoch = gut) und Lernfähigkeit, Konzentration, Gehorsam. **Gesamt** = 0,2 Typ + 0,3 Körperbau + 0,3 Bewegung + 0,2 Interieur. Der Schnitt aller Körperbau-Noten soll bei etwa 7,0 liegen (wie bisher bei der Fohlenschau); das `9 − 2,5·d` bei Abweichung nachjustieren.
15. **Fohlenschau:** Körperbau-Note aus dem neuen Körperbau (statt `fund`), Typnote aus `typNote`; danach den Anteil Prämienfohlen (ab 7,5) vorher/nachher messen, er soll gleich bleiben (± 3 Prozentpunkte).
16. **Marktwert:** deutlicher Fehler −3 %, starker Fehler −6 % je Merkmal, zusammen höchstens −25 %. Stärken (d < 0,4): +0,7 % je Merkmal, höchstens +8 %. Dazu Rassemerkmale (M4), Besonderheiten, Zuchtbuch-Klasse. Gesamt nie unter 60 % und nicht über +25 % des bisherigen Werts. Reihenfolge: nach `abstFaktor`.
17. **Disziplinen:** Disziplin-Wert × (1 + 0,04 × Σ w · s), `s = clamp(1 − d/1,5, −1, 1)` je Merkmal, Gewichte `w` (Summe 1) je Disziplin in Anhang A, also höchstens ±4 %. Gilt für alle Disziplinen in `DISZ` (Turnier, Fohlen nicht).
18. **Gesundheit:** bei deutlichem / starkem Fehler Risikofaktor ×1,3 / ×1,7 in der Nachtberechnung für die zugehörigen bestehenden Befunde: Stellung vorne/hinten, Fesselung, Fundament → Sehnen-, Fesselträger-, Gelenk-Befunde; Huf → Huf-Befunde (Strahlfäule, Hufrehe, Hufgeschwür); Rücken → Rückenbefund, falls es einen gibt. Namen im Code suchen, nichts Neues erfinden. Auch hier gilt die Stufen-Regel (Anfänger ×0,25 usw.), weil der Faktor auf das Basisrisiko wirkt.

### Rassemerkmale, Besonderheiten, Zucht (M4)
19. **Rassemerkmale** (Aufklappbereich): je Zeile ✓ / „untypisch, aber erlaubt“ / ✗ (Verstoß): Größe im Rahmen (Stockmaß gegen `h` der Rasse), Farbe erlaubt (`R.farben`), Abzeichen erlaubt (`WEISS_RASSE`: strenge Rassen Friese, Fell, Fjord, Dales), Kopfform typisch (`KOPFFORM_RASSE`), Ohren, Behang/Fesselbehang, Gangart/Tölt (Islandpferd), Besonderheiten (Metallglanz Tekkiner, Marwari-Ohren), Gesamtabweichung der zwölf Exterieur-Zielwerte. **Verstoß:** Typnote −0,5, Marktwert −5 %. **Schwerer Verstoß = „nicht zuchtbuchfähig“** (Farbe nicht zugelassen, bei strengen Rassen zu viel Weiß): Marktwert −15 % (ersetzt die 5 %, nicht addiert), Typnote −0,5 je Verstoß. Mischlinge sind ausgenommen („Mischling – keine Rassenprüfung“). **Nie versteckte Gene zeigen:** nur sichtbare Merkmale; eine Farbe, die erst ein Gentest zeigt, fließt erst nach dem Test ein.
20. **Besonderheiten** (Aufklappbereich): **Gebissfehler** (gibt es schon; erst sichtbar, wenn `p.gebissFehler`, Marktwert −3 %), **Hahnentritt** (neu, 0,3 %, sichtbar sofort; Bewegung −1, Marktwert −15 %; vererbt sich zu 10 % mit einem betroffenen Elternteil, 30 % mit zwei), **Kryptorchismus** (neu, nur Hengste, 1 %, sichtbar erst ab 2 Jahren, bei der Ankaufsuntersuchung oder nach Tierarzt; Zuchtausschluss `zuchtSperre`, Marktwert −20 %, vererbt 15 % / 40 %; Kastration löst es: Wallach ohne Abzug, der OP-Preis bleibt wie bisher), **Zwergwuchs** (gibt es). Datenfeld `p.besond = { hahn, krypt }`. Hahnentritt und Kryptorchismus gehören in die Ankaufsuntersuchung (`AKU`) und in die Vererbungs-Aufschlüsselung (Admin). Anfänger sieht nur „auffälliger Fehler“ im Satz, Fortgeschritten die Namen, Experte zusätzlich „Neue Anlage: Hals länger als bei den Eltern“ aus den Mutationen (`H.bau[k].quelle === "Mutation"`).
21. **Zuchtbuch-Klasse** (nur Anzeige und Marktwert; Stuten ab 3 Jahren, Rasse mit Zuchtbuch, kein Mischling): Gesamt ≥ 8,0 **Hauptstutbuch** (+5 % Marktwert), ≥ 7,0 **Stutbuch I** (+2 %), ≥ 6,0 **Stutbuch II** (±0), darunter **Vorbuch** (−3 %). Hengste: keine Zeile, stattdessen „Körung kommt später“. Körung, Stutenschau und Hengstleistungsprüfung sind ein eigenes späteres Thema.
22. **Verpaaren-Vorschau** (Box - Steckbrief - Genetik - Verpaaren mit …, ab Fortgeschritten, nur Wörter, nie Zahlen, nie Gene): höchstens 4 Zeilen je Paar: **„gleicht aus: Hals“**, wenn einer ≥ 1,5 Abweichung auf einer Seite hat und der Partner auf der Gegenseite liegt (d ≥ 0,7); **„verstärkt: Rücken“**, wenn beide dieselbe Abweichung ≥ 1,2 haben („beide steile Schulter – Fohlen wahrscheinlich auch“); **„Risiko: Gebissfehler / Hahnentritt / Kryptorchismus bei beiden“**, wenn beide betroffen und bekannt sind; **„Fohlen nicht zuchtbuchfähig möglich“**, wenn ein sichtbarer schwerer Verstoß in einem vererbbaren sichtbaren Merkmal vorliegt (Abzeichen, Größe, Kopfform). Jede Hengst-Kachel in der Deckstation und in „Eigene Zucht“ bekommt einen Knopf **„⚖️ Merkmale“**, der die Karte des Hengstes (Lese-Modus) mit der Stute als Vergleich öffnet.
23. **Vergleichen mit Fremden:** im Markt-Steckbrief (Lese-Modus) zeigt „Vergleichen mit …“ die eigenen Pferde; in der Deckstation wie oben. Vor dem Kauf sieht man Exterieur, Gangwerk, Rassemerkmale und Besonderheiten sofort (wie beim Ansehen in echt), das Interieur bei fremden Pferden nur grob („eher ruhig“); genau erst im eigenen Stall.

### Stufen, Admin, Hinweise (M2/M5)
24. **Stufen** (`frei()` / `STUFE()`, neue Schlüssel `merkBalken`, `merkNoten`, `merkVorschau`; `STUFE_NEU` ergänzen): **Anfänger:** Gangwerk-Noten und Eigenschaften-Balken wie bisher (fürs Training nötig), Charakter wie bisher nur Vorlieben/Abneigungen, **Exterieur und Rassemerkmale nur als 2–3 Sätze „Stärken / Schwächen“** (Satzbau in Anhang A), Besonderheiten nur als „auffälliger Fehler“, kein Verpaaren, aber Vergleichen. **Fortgeschritten:** dazu Exterieur-Balken, Charakter-Skalen, Rassemerkmale, Besonderheiten mit Namen, Verpaaren-Vorschau. **Experte:** dazu Zuchtverbands-Noten, Zuchtbuch-Klasse, Mutations-Hinweise. **Adminmodus:** zusätzlich Zahlen (Wert, Ziel, `d`).
25. **Hinweisblasen, Tutorial, Enzyklopädie, bzn, Rassenansicht-Admin „Merkmale selbst wählen“:** siehe Anhang B.
26. Alles Neue beachtet die Regeln aus `CLAUDE.md`: Kamera-Aussparung, Anzeigeboxen überdecken sich nicht, Zoomen im Steckbrief unverändert.

## Etappen
1. **M1 Exterieur-Daten (mittel):** `p.bau`, `BAU_ZIEL`, `bauErgaenzen`, Vererbung samt `H.bau`, Mutationen, Aufschlüsselung (Admin), `opt.bau` im Bild, Muskel-/Huf-Ist. Alte Spielstände auffüllen.
2. **M2 Karte (groß):** neuer Reiter, Aufklapp-Bereiche, Balken, Noten, Sätze, Daten bereinigen, Gangwerk/Eigenschaften/Charakter einbinden, Vergleichen, Stufen, Kürzel, Weiterleitung der alten Reiter.
3. **M3 Wirkungen (mittel):** Noten, Fohlenschau, Marktwert, Disziplinen, Gesundheit; Verteilungen messen.
4. **M4 Rassemerkmale, Besonderheiten, Zuchtbuch (mittel):** Punkte 19–21, AKU, Zuchtsperre.
5. **M5 Verpaaren, Fremd-Vergleich, Hinweise, Tutorial, Enzyklopädie, bzn, Admin (mittel):** Punkte 22–25.

## Testen
1. `tests/merkmale-test.js`: Verteilung der Fehlerstufen (deutlich etwa 4–8 %, stark etwa 1–3 % je Merkmal, mehrere hundert Pferde je Rasse), Vererbung (Kind liegt nahe der Eltern-Mitte, Mutation etwa 3 %), alte Pferde ohne `p.bau` (Spielstand laden), Marktpferde stabil, Noten (Körperbau-Schnitt etwa 7,0), Marktwert-Grenzen (−25 % / +8 % / 60 %), Bild: Fohlen behalten ihre Proportionen, ±15 %, Disziplin ±4 %, Gesundheit ×1,3 / ×1,7.
2. Karte: alle Aufklapp-Bereiche, Merken des offenen Zustands, Vergleichen (eigenes, Markt, Deckstation), Stufen (Anfänger Sätze und Balken für Gangwerk/Eigenschaften, Fortgeschritten Balken, Experte Noten), alte Reiter-Namen öffnen den richtigen Abschnitt, Daten ohne Doppeltes.
3. Screenshots in PC (1366×768), Handy quer (844×390) und hochkant (390×844), Kamera-Aussparung.
4. Rassemerkmale: Friese mit viel Weiß = schwerer Verstoß, Mischling ohne Prüfung, versteckte Gene tauchen nirgends auf.
5. Aufschlüsselung (Admin): neue Werte samt Herkunft und Mutation; bzn und Enzyklopädie aktuell halten.



=== TEIL 2 von 6: Thema 6 – Anhang A (Tabellen) – speichern als PLAN-MERKMALE-TABELLEN.md ===

# Anhang A: Tabellen zur Karte „Merkmale“

## 1. Die zwölf Exterieur-Werte (0–100, 50 = Skalenmitte; das Zuchtziel der Rasse ist die Raute)
| Schlüssel | Zeile in der Karte | links (0) | rechts (100) | Stufenwörter (von links nach rechts, bezogen auf das Zuchtziel) |
|---|---|---|---|---|
| `rahmen` | Rahmen | gedrungen | gestreckt | sehr gedrungen · gedrungen · ausgewogen · gestreckt · sehr gestreckt |
| `halsL` | Hals: Länge | kurz | lang | sehr kurz · kurz · mittel · lang · sehr lang |
| `halsA` | Hals: Aufsatz | tief aufgesetzt | hoch aufgesetzt | sehr tief · tief · mittel · hoch · sehr hoch aufgesetzt |
| `schulter` | Schulter / Widerrist | steil | schräg | sehr steil · steil · mittel · schräg · sehr schräg |
| `ruecken` | Rücken | durchhängend | aufgewölbt | stark durchhängend · weich · fest · leicht aufgewölbt · stark aufgewölbt |
| `kruppe` | Kruppe | abfallend | waagerecht | stark abfallend · abfallend · mittel · fast waagerecht · waagerecht |
| `muskel` | Bemuskelung (Ist-Wert) | schwach | kräftig | sehr schwach · schwach · normal · kräftig · sehr kräftig |
| `fundament` | Röhrbein / Gelenke | fein | stark | sehr fein · fein · mittel · stark · sehr stark |
| `fessel` | Fesselung | steil | weich | sehr steil · steil · mittel · weich · sehr weich |
| `stV` | Stellung vorne | zeheneng | zehenweit | stark zeheneng · zeheneng · gerade · zehenweit · stark zehenweit |
| `stH` | Stellung hinten | fassbeinig | kuhhessig | stark fassbeinig · fassbeinig · gerade · kuhhessig · stark kuhhessig |
| `huf` | Huf (Ist-Wert) | steil (Bockhuf) | flach (Flachhuf) | sehr steil · steil · normal · flach · sehr flach |

Stufenwort aus dem Vorzeichen und der Größe von `(Wert − Ziel) / BAU_S`: bis −2 und darunter 1. Wort, −2 bis −0,7 2. Wort, ±0,7 3. Wort, +0,7 bis +2 4. Wort, darüber 5. Wort. Das Wort sagt, wo das Pferd liegt, die Stufe daneben („ideal“, „leichte Abweichung“, „deutlicher Fehler“, „starker Fehler“) sagt, wie weit vom Zuchtziel.

**Zeile „Typ“ und „Gesamteindruck“** sind Noten (kein Balken). **Zeile „Hals“** zeigt Länge und Aufsatz als zwei Balken untereinander.

## 2. Zuchtziel je Rassengruppe (Mitte in Punkten; Streuung `BAU_S = 15` für alle)
`stV` und `stH` sind bei allen Rassen 50 (gerade). Einzelne Abweichungen stehen unter der Tabelle.

| Gruppe (Rassen) | rahmen | halsL | halsA | schulter | ruecken | kruppe | muskel | fundament | fessel | huf |
|---|---|---|---|---|---|---|---|---|---|---|
| Edel (araber, shagya, angloaraber, vollblut, tekke, marwari) | 62 | 62 | 64 | 62 | 45 | 62 | 45 | 42 | 55 | 50 |
| Warmblut (hannoveraner, trakehner) | 55 | 60 | 58 | 65 | 55 | 55 | 55 | 55 | 55 | 50 |
| Barock (friese, andalusier, lipizzaner, barockpinto, knabstrupper) | 42 | 55 | 70 | 55 | 50 | 38 | 58 | 55 | 58 | 50 |
| Western (quarter, paint, appaloosa) | 42 | 42 | 38 | 58 | 48 | 45 | 72 | 55 | 50 | 50 |
| Kaltblut (shire, clydesdale, noriker) | 45 | 42 | 55 | 48 | 50 | 40 | 68 | 72 | 48 | 55 |
| Cob und kräftige Ponys (tinker, welshcob, fell, dales, haflinger, lewitzer, fjord) | 38 | 42 | 52 | 50 | 48 | 40 | 62 | 62 | 48 | 55 |
| Isländer (isi) | 42 | 50 | 58 | 55 | 50 | 42 | 60 | 62 | 48 | 55 |
| Kleinpony (shetty) | 38 | 38 | 50 | 45 | 48 | 40 | 60 | 60 | 45 | 55 |

Einzelne Abweichungen: Vollblut `halsA` 50, `halsL` 58, `fundament` 45 · Araber `ruecken` 38 (kurzer Rücken, in echt oft ein Wirbel weniger) · Friese `fundament` 58, `fessel` 60 · Andalusier/Lipizzaner `muskel` 60 · Quarter `kruppe` 42 · Tinker/Fell/Dales `fundament` 66 · Fjord `halsL` 38.
Mischlinge: Mitte als gewichteter Schnitt der Zuchtziele nach Rasseanteil. Im Adminmodus nur angezeigt; ein Pferd bekommt seine Werte dort über „Merkmale selbst wählen“ (Anhang B).

## 3. Disziplin-Gewichte (Summe 1 je Disziplin; Wirkung höchstens ±4 %)
| Disziplin (`DISZ`-Schlüssel) | Gewichte |
|---|---|
| `dressur` | halsL .15 · halsA .15 · schulter .20 · ruecken .15 · kruppe .15 · fessel .10 · muskel .10 |
| `springen` | kruppe .20 · schulter .15 · ruecken .15 · fundament .15 · muskel .15 · stV .10 · stH .10 |
| `vielseitigkeit` | ruecken .15 · fundament .20 · schulter .15 · kruppe .15 · muskel .15 · stV .10 · stH .10 |
| `galopprennen` | schulter .20 · kruppe .20 · muskel .20 · fundament .20 · rahmen .10 · fessel .10 |
| `trabrennen` | kruppe .20 · fundament .25 · stV .15 · stH .15 · schulter .15 · rahmen .10 |
| `passrennen` | rahmen .20 · kruppe .20 · fundament .20 · ruecken .15 · fessel .10 · stV .075 · stH .075 |
| `toelt` | halsL .15 · halsA .20 · schulter .20 · ruecken .20 · kruppe .15 · fessel .10 |
| `reining` | kruppe .25 · muskel .25 · ruecken .15 · stH .15 · fundament .10 · schulter .10 |
| `pleasure` | schulter .25 · ruecken .20 · halsA .15 · fessel .15 · stV .15 · stH .10 |
| `trail` | fundament .25 · stV .20 · stH .20 · huf .20 · fessel .15 |
| `distanz` | fundament .25 · huf .20 · stV .15 · stH .15 · fessel .15 · ruecken .10 |
Weitere Disziplinen in `DISZ`, die hier fehlen: Gewichte wie die ähnlichste Disziplin übernehmen.

## 4. Sätze „Stärken / Schwächen“ (Anfänger, und als Zeile im Gesamteindruck für alle)
Stärken = die zwei Merkmale mit dem kleinsten `d` (nur wenn `d` < 0,5), Schwächen = die zwei mit dem größten `d` (nur wenn deutlicher oder starker Fehler; „leichte Abweichung“ wird nicht genannt). Satz:
- Beides vorhanden: „Stärken: gute Schulter und gute Kruppe. Schwächen: zu steiler Rücken und zu kurzer Hals.“
- Keine Schwäche: „Stärken: … Keine auffälligen Schwächen.“
- Keine Stärke: „Keine besonderen Stärken. Schwächen: …“
- Weder noch: „Ein durchschnittliches Pferd ohne auffällige Stärken oder Schwächen.“

Wörter für **Stärken** (Merkmal → Wortgruppe): rahmen „guter Rahmen“, halsL „gut proportionierter Hals“, halsA „guter Halsaufsatz“, schulter „gute Schulter“, ruecken „guter Rücken“, kruppe „gute Kruppe“, muskel „gute Bemuskelung“, fundament „gutes Fundament“, fessel „gute Fesselung“, stV „gerade Stellung vorne“, stH „gerade Stellung hinten“, huf „gute Hufe“.
Wörter für **Schwächen**: „zu“ + Wort des Pols, in dessen Richtung das Pferd abweicht, z. B. „zu steile Schulter“, „zu kurzer Hals“, „zu tief aufgesetzter Hals“, „zu weiche Fesselung“, „zeheneng vorne“, „kuhhessig hinten“, „zu flache Hufe“, „durchhängender Rücken“, „zu schwache Bemuskelung“, „zu feines Fundament“, „abfallende Kruppe“, „zu gestreckter Rahmen“.

Rassemerkmale (Anfänger): „Passt gut zur Rasse.“ oder „Nicht typisch für die Rasse: <Zeilen mit ✗ oder untypisch>.“ Besonderheiten (Anfänger): „Auffälliger Fehler: bitte vom Tierarzt ansehen lassen.“ (nur bei bekannten Besonderheiten).

## 5. Rassemerkmale-Zeilen (Aufklappbereich Fortgeschritten und Experte)
| Zeile | Quelle im Code | ✓ | untypisch, aber erlaubt | ✗ Verstoß | schwerer Verstoß (nicht zuchtbuchfähig) |
|---|---|---|---|---|---|
| Größe im Rahmen | Stockmaß gegen `h` der Rasse | im Bereich | bis 3 cm außerhalb | mehr als 3 cm außerhalb | – |
| Farbe erlaubt | `R.farben` (sichtbare Farbe; Gene erst nach Gentest) | erlaubt | – | – | nicht zugelassen |
| Abzeichen | `WEISS_RASSE`, `fjordWeissFehler` | im Standard | etwas viel Weiß | zu viel Weiß | strenge Rassen (Friese, Fell, Fjord, Dales) mit großem Abzeichen oder Beinweiß |
| Kopfform | `KOPFFORM_RASSE` | typisch | andere gerade/leichte Form | Schafs-/Schweinskopf | – |
| Ohren | `OHR_RASSE` | typisch | abweichend | – | – |
| Behang | Rassenwert `feather` | typisch | – | fehlt bei Rassen, die ihn verlangen | – |
| Gangart | Tölt/Pass bei Islandpferden | Viergänger/Fünfgänger je Rasse | – | Tölt fehlt | – |
| Besonderheiten | Metallglanz (Tekkiner), Marwari-Ohren | vorhanden | – | fehlt | – |
| Exterieur insgesamt | Schnitt der zwölf `d` | Schnitt unter 1 | Schnitt 1–1,5 | Schnitt über 1,5 | – |

Wirkung: ✗ Typnote −0,5 und Marktwert −5 %; schwerer Verstoß: Marktwert −15 % (ersetzt die 5 %), Typnote −0,5 je Verstoß, höchstens −1,5 insgesamt. Mischlinge (unter 99 % Rassenanteil): „Mischling – keine Rassenprüfung“.

## 6. Besonderheiten
| Besonderheit | Häufigkeit | Sichtbar | Vererbung | Wirkung |
|---|---|---|---|---|
| Gebissfehler (Ober-/Unterbiss), gibt es schon (`biss`) | wie bisher | erst wenn `p.gebissFehler` bekannt | wie bisher | Zahnbehandlung 2× im Jahr, Marktwert −3 % |
| Hahnentritt (neu) | 0,3 % | sofort | 10 % mit einem betroffenen Elternteil, 30 % mit zwei | Bewegung −1, Marktwert −15 % |
| Kryptorchismus (neu, nur Hengste) | 1 % | ab 2 Jahren, bei Ankaufsuntersuchung oder Tierarzt | 15 % / 40 % | Zuchtausschluss, Marktwert −20 %; nach Kastration kein Abzug |
| Zwergwuchs (gibt es) | wie bisher | sofort | wie bisher | wie bisher |

## 7. Zuchtbuch-Klasse (Stuten ab 3 Jahren, Rasse mit Zuchtbuch, kein Mischling)
| Gesamtnote | Klasse | Marktwert |
|---|---|---|
| ab 8,0 | Hauptstutbuch | +5 % |
| ab 7,0 | Stutbuch I | +2 % |
| ab 6,0 | Stutbuch II | ±0 |
| darunter | Vorbuch | −3 % |
Hengste: „Körung kommt später“.



=== TEIL 3 von 6: Thema 6 – Anhang B (Texte) – speichern als PLAN-MERKMALE-TEXTE.md ===

# Anhang B: Hinweisblasen, Tutorial, Enzyklopädie und Admin zur Karte „Merkmale“

Ton wie überall: Du-Form, höchstens zwei Sätze, einfache Wörter, Alltagsvergleich, keine Kindersprache, nie versteckte Werte. Alle Blasen haben „Mehr dazu“ → Enzyklopädie, Bereich „Einsteiger-Wissen“, Eintrag **„Beurteilungsbogen“** (Text unten). `{Name}`, `{er/sie}` wie in den anderen Texten ersetzen.

## 1. Neue Hinweisblasen (8)
| Nr | Auslöser | Stufe | Text |
|---|---|---|---|
| M1 | Karte Merkmale zum ersten Mal geöffnet (Anfänger) | Anfänger | „Hier steht, wie {Name} gebaut ist, so wie ein Zuchtrichter es beschreibt. Lies die Stärken und Schwächen: Sie bestimmen, was {er/sie} später gut kann.“ |
| M1b | dasselbe, Fortgeschritten/Experte | Fortgeschritten, Experte | „Jeder Balken liegt zwischen zwei Gegensätzen. Die kleine Raute zeigt, was bei dieser Rasse ideal ist: Je näher dein Pferd daran liegt, desto besser.“ |
| M2 | erster Tipp auf „Vergleichen mit …“ in Merkmale | alle | „Mit ‚Vergleichen mit …‘ legst du zwei Pferde nebeneinander. So siehst du schnell, welches besser zum Training oder zur Zucht passt.“ |
| M3 | Verpaaren-Dialog zum ersten Mal mit Vorschau | Fortgeschritten, Experte | „Hier steht, was der Hengst bei deiner Stute ausgleicht und was er verstärkt. Haben beide denselben Fehler, geben sie ihn oft weiter.“ |
| M4 | erstes eigenes Pferd (gekauft oder geboren) mit deutlichem oder starkem Fehler, beim ersten Öffnen seiner Karte | alle | „{Name} hat einen auffälligen Fehler. Das ist kein Weltuntergang, aber es kostet etwas Marktwert und kann {ihn/sie} anfälliger machen.“ |
| M5 | Huf mit deutlichem Fehler oder Hufschmied überfällig bei auffälligem Huf, erstes Mal | alle | „Die Hufe von {Name} weichen vom Idealen ab. Regelmäßige Hufschmied-Termine machen sie besser, Vernachlässigung macht sie schlechter.“ |
| M6 | Bemuskelung unter dem Zuchtziel (deutlicher Fehler), erstes Mal | alle | „{Name} ist schwach bemuskelt. Training und gutes Futter bauen Muskeln auf, Krankheit und Boxenruhe bauen sie ab.“ |
| M7 | erste Nennung zur Fohlenschau (ab dann auch für Anfänger der Stufe, falls Fohlenschau freigeschaltet) | Fortgeschritten, Experte | „Die Noten der Fohlenschau kommen aus Körperbau, Typ und Gängen. Schau vorher in die Karte Merkmale, dann weißt du, was die Richter sehen.“ |
| M8 | erster schwerer Rassemerkmal-Verstoß in der Karte | Fortgeschritten, Experte | „{Name} verstößt gegen den Standard der Rasse und ist nicht zuchtbuchfähig. Das senkt den Wert, und Fohlen können dasselbe erben.“ |

Regeln wie bei allen Nebentipps (höchstens eine Blase pro Ansicht, drei pro Tag, nie im Dialog). M1/M1b sitzen am Reiter „Merkmale“ mit Ring um den Reiter. Alte Texte, die „Karte Gangwerk“, „Karte Eigenschaften“ oder „Karte Charakter“ sagen, ändern auf „Merkmale – Gangwerk / Interieur“ (Suche in Tipps, Blasen, Tutorial-Texten, Enzyklopädie, bzn, Briefen).

## 2. Stufen-Zeilen (für `STUFE_NEU` und die Stufen-Tabelle)
| Stufe | Neu freigeschaltet (Wortlaut für das „Neu freigeschaltet“-Fenster) |
|---|---|
| Fortgeschritten | „Merkmale als Balken (Exterieur, Charakter), Rassemerkmale, Besonderheiten und die Vorschau beim Verpaaren“ |
| Experte | „Zuchtverbands-Noten, Zuchtbuch-Klasse und Hinweise auf neue Anlagen bei den Fohlen“ |

## 3. Tutorial
**Anfänger-Tutorial:** kein neues Kapitel. Kapitel 1 („Box, Heu, Pferd ansehen“) bekommt am Ende zwei Sätze und eine Blase auf den Reiter Merkmale: „Unter Merkmale siehst du, wie dein Pferd gebaut ist und was es gut kann. Fürs Erste reicht der Satz mit Stärken und Schwächen.“ Dauer des Kapitels bleibt.

**Fortgeschrittenen-Tutorial, neues Kapitel „Merkmale lesen, vergleichen, Partner wählen“** (nur zum Nachholen, 2 Tage, Testhof, Testgeld; Pferde mit festen Werten, kein Zufall):
- Testpferde: Stute **Tutti** (Warmblut-Typ: Schulter 36, Hals lang 72, Rest nahe am Ziel), Hengst **Bruno** (Schulter 72, Hals 40, Rest nahe am Ziel), Hengst **Max** (Schulter 30, Hals 62).
- Ziel: „Finde den Hengst, der die Schwäche von Tutti ausgleicht.“
- Tag 1: Karte Merkmale öffnen, die Aufklapp-Bereiche zeigen (Gesamteindruck, Exterieur, Gangwerk, Interieur), Tuttis Schwäche (steile Schulter) finden, mit Bruno vergleichen.
- Tag 2: Verpaaren mit … öffnen, die Vorschau zu Bruno („gleicht aus: Schulter“) und Max („verstärkt: Schulter“) lesen, den passenden Hengst wählen.
- Abschluss-Satz: „Gute Züchter schauen nicht nur auf das schönste Pferd, sondern darauf, was zum eigenen Pferd passt.“

**Experten-Tutorial, neues Kapitel „Zuchtverbands-Noten, Rassestandard, Zuchtbuch“** (nur zum Nachholen, 2 Tage):
- Testpferde: Friesen-Stute **Lotta** (großes weißes Abzeichen, schwerer Verstoß), Hannoveraner-Stute **Mara** (Gesamtnote 7,4 = Stutbuch I).
- Ziel: „Finde heraus, warum Lotta nicht zuchtbuchfähig ist, und lies Maras Zuchtbuch-Klasse.“
- Tag 1: Gesamteindruck mit den Noten (Typ, Körperbau, Bewegung, Interieur, Gesamt), Rassemerkmale bei Lotta (✗ Abzeichen) und was der Verstoß kostet.
- Tag 2: Zuchtbuch-Klasse bei Mara, Hinweis auf Neue Anlage bei Maras Fohlen (Mutation), Vergleich beider Stuten.

## 4. Enzyklopädie (öffentlich): Eintrag „Beurteilungsbogen“ (Einsteiger-Wissen)
„**Beurteilungsbogen.** Zuchtverbände beschreiben Pferde nach einem festen Bogen. Das Spiel macht es genauso: Unter Box - Steckbrief - Merkmale beschreibt jeder Balken ein Merkmal zwischen zwei Gegensätzen, zum Beispiel Hals kurz bis lang. Die kleine Raute zeigt, was für die Rasse ideal ist. Ein Kaltblut darf einen kürzeren Hals haben als ein Araber, ohne dass das ein Fehler ist.

**Noten.** Zuchtrichter vergeben Noten von 1 bis 10 (ab Experte sichtbar): Typ (wie rassetypisch), Körperbau (Rücken, Kruppe, Fundament …), Bewegung (Schritt, Trab, Galopp), Interieur (Charakter und Einstellung zur Arbeit) und Gesamt.

**Fehler.** Ein leichter Unterschied zum Ideal ist normal und kostet nichts. Ein deutlicher Fehler kostet etwas Marktwert und macht Sehnen, Gelenke oder Hufe anfälliger; ein starker Fehler noch mehr. Bemuskelung und Huf verändern sich durch Pflege, Training und Futter, alles andere ist von Geburt an festgelegt.

**Zucht.** Pferde geben Merkmale an die Fohlen weiter, meist als Mittelwert der Eltern. Zwei Pferde mit demselben Fehler geben ihn oft weiter, ein Partner mit dem Gegenteil gleicht aus. Selten entsteht ein ganz neues Merkmal (Mutation).

**Rassemerkmale.** Jede Rasse hat einen Standard für Größe, Farbe, Abzeichen und Kopf. Wer deutlich dagegen verstößt, ist ‚nicht zuchtbuchfähig‘ und weniger wert.“

## 5. Berechnungen zum Nachschlagen (bzn, nur Admin): Absatz „Karte Merkmale (Thema 6)“
Inhalt: die Zwölf-Werte-Tabelle mit Polen (Anhang A, Abschnitt 1), `BAU_S = 15`, Fehlerstufen (d-Grenzen 0,7 / 1,75 / 2,33), Vererbungsformel (Mitte der Eltern + 0,2 × Regression, Streuung 0,6 × `BAU_S`, 3 % Mutation ±1,5 bis ±2,5 × `BAU_S`), Notenformeln (`n = 9 − 2,5 × d`, Gruppen, Gesamt 0,2/0,3/0,3/0,2), Marktwert (−3 % / −6 % je Fehler bis −25 %, +0,7 % je Stärke bis +8 %, Rassemerkmale −5 % / −15 %, Besonderheiten, Zuchtbuch ±), Disziplin ±4 % (Gewichte), Gesundheit ×1,3 / ×1,7, Muskel- und Huf-Formel, Zuchtziel-Tabelle (`BAU_ZIEL`), Besonderheiten mit Häufigkeit und Vererbung, Zuchtbuch-Schwellen. Die Zahlen aus den Konstanten lesen (`${…}`), nicht von Hand einsetzen.

## 6. Adminmodus
- **Rassenansicht (enz - Rassen - eine Rasse antippen):** neuer Bereich **„Merkmale selbst wählen“** wie „Krankheiten selbst wählen“: zwölf Schieber (Wert 0–100, daneben das Zuchtziel der Rasse und die Stufe), Besonderheiten zum Anhaken (Hahnentritt, Kryptorchismus nur bei Hengst), Knopf „Zufall“. Das Pferdebild in der Rassenansicht zeigt die gewählten Werte (`opt.bau`).
- **Karte Merkmale im Adminmodus:** neben jedem Balken die Zahl (Wert, Ziel, `d`), bei Bemuskelung und Huf Anlage und Ist-Wert.
- **Zuchtziel-Tabelle** (`BAU_ZIEL`) steht im Code und in bzn; Änderungen macht Dome über den Projekt-Chat.



=== TEIL 4 von 6: Thema 6 – Anhang C (Zeichenliste) – speichern als (Abschnitt 1 an BEI-INKSCAPE-BEARBEITEN.md anhängen) ===

# Anhang C: Zeichenliste für Dome und Werkzeug-Vorschläge

## 1. Neu für die Karte „Merkmale“ (Thema 6, Dome, 20.10.2026) – für `BEI-INKSCAPE-BEARBEITEN.md`: Punkte 3, 4 und 5 sind für Dome, Punkte 1 und 2 hat Claude schon gezeichnet

Bis eine Zeichnung da ist, baut Claude Platzhalter (Emoji oder Text), die Karte funktioniert also schon vorher. Hochladen wie immer: Dateien in den Ordner `entwuerfe/merkmale/` im Repo (Dateinamen genau wie unten), Claude baut sie ein. Stil wie die Raritäten-Symbole (`raritaet-*.svg`): `viewBox="0 0 128 128"`, Linienfarbe wie die Kontur im Spiel (#090609), Füllung flach oder mit leichtem Verlauf, auf Handy-Größe (ca. 48 px) lesbar.

### 1 und 2. Zuchtbuch-Siegel und Beurteilungsschema: **schon fertig, von Claude gezeichnet** (Dome, 20.10.2026: „mach das selbst“)
- Die Dateien kommen als Branch `entwurf-merkmale-bilder` im Repo, Ordner `entwuerfe/merkmale/` (SVG und PNG), nicht in diese Nachricht. Coding baut sie ein und darf nichts umzeichnen; Dome kann sie später in Inkscape verbessern (dann wie unten hochladen).
- `zuchtbuch-hauptstutbuch.svg` (gold, Krone, rote Schleife) · `zuchtbuch-stutbuch1.svg` (silber, „I“, blaue Schleife) · `zuchtbuch-stutbuch2.svg` (bronze, „II“, grüne Schleife) · `zuchtbuch-vorbuch.svg` (schlicht grau, „V“, ohne Schleife). `viewBox` 0 0 128 128, ohne Schriftarten (Zahlen als Formen), auch bei 48 px lesbar. Sie erscheinen in der Karte Merkmale (Gesamteindruck, nur Experte) und hinter dem Namen im Steckbrief.
- `schema-pferd.svg`: Pferd (dasselbe Bild wie im Spiel, Hannoveraner, heller Schimmel) mit acht antippbaren Zonen. Ebenen-Namen: `zone-kopf`, `zone-hals`, `zone-schulter`, `zone-ruecken`, `zone-kruppe`, `zone-vorhand-bein`, `zone-hinterhand-bein`, `zone-huf`. Die Zonen sind farbige, halbtransparente Flächen (`fill-opacity` .30); im Spiel sind sie unsichtbar, die Zone des angetippten Merkmals leuchtet auf. Die nummerierte Gruppe `beschriftung` ist nur für die Ansicht gedacht und im Spiel auszublenden (Texte kommen aus dem Spiel). Zuordnung Merkmal → Zone: Kopf → `zone-kopf`; Hals Länge und Aufsatz → `zone-hals`; Schulter/Widerrist → `zone-schulter`; Rücken → `zone-ruecken`; Kruppe → `zone-kruppe`; Rahmen und Bemuskelung → ganzer Körper (alle Zonen hell); Fundament, Fesselung, Stellung vorne → `zone-vorhand-bein`; Stellung hinten → `zone-hinterhand-bein`; Huf → `zone-huf`.
- Das Schema nutzt die Zeichnung von `zeichnePferd`; wenn Dome den Körper ändert, muss es neu erzeugt werden (Skript: Pferd rendern, Zonen als Polygone darüberlegen; Koordinaten stehen im SVG).

### 3. Stellung vorne und hinten (Schemabilder, zehn kleine Symbole)
- In der Seitenansicht sieht man Zehenenge, Zehenweite, Fass- und Kuhhessigkeit nicht; darum kleine Schema-Bilder von **vorne** (Vorderbeine) und von **hinten** (Hinterbeine) in der Karte:
  - Vorne: `stellung-v-1.svg` (stark zeheneng), `-2` (zeheneng), `-3` (gerade), `-4` (zehenweit), `-5` (stark zehenweit).
  - Hinten: `stellung-h-1.svg` (stark fassbeinig), `-2` (fassbeinig), `-3` (gerade), `-4` (kuhhessig), `-5` (stark kuhhessig).
- Zwei bis vier einfache Linien (Beine mit Huf), keine Pferdefarbe. Die Stufe 3 wird im Spiel als Referenz neben das Pferd gelegt.

### 4. Huf (Schemabilder, drei kleine Symbole)
- Seitenansicht von Fessel und Huf: `huf-steil.svg` (Bockhuf), `huf-normal.svg`, `huf-flach.svg` (Flachhuf). Sie ersetzen bei Fortgeschrittenen den Satz „zu steile Hufe“ durch ein Bild.

### 5. Später, wenn dein neuer Körper steht: Körper in Teilen
- Damit Hals, Schulter, Rücken, Kruppe und Fesselung im Pferdebild sichtbar unterschiedlich werden können (siehe Thema „Rücken, Fesselung, Stellung und Huf im Pferdebild“), bitte den neuen Körper in **benannten Ebenen** zeichnen: `hals`, `schulter-widerrist`, `rumpf`, `kruppe`, `vorderbein`, `hinterbein`, `fessel-vorne`, `fessel-hinten`, `huf-vorne`, `huf-hinten`, und die **Übergänge als Ankerpunkte** (Widerrist, Rückenmitte, Kruppenspitze, Halsansatz, Genick) als kleine Kreise in einer Ebene `anker`. Dann kann das Spiel die Teile gegeneinander verschieben, ohne dass Kanten reißen.
- Wenn du lieber erst mal alles von Hand fertig zeichnest, ist das in Ordnung: sag Bescheid, dann plant Claude die Zerlegung später.

## 2. Werkzeuge, die die Arbeit erleichtern (Vorschlag)

Nur kostenlose Programme. Wie weit Coding sie nutzen kann, hängt von seiner Umgebung ab; **beim Start einmal prüfen** (`which inkscape ffmpeg rsvg-convert`, und ob Playwright/Chromium laufen) und das Ergebnis in `CLAUDE.md` notieren.

1. **Chromium über Playwright (meist schon da):** Zeichnungen aus dem Spiel (`zeichnePferd`) rendern und als PNG speichern. Damit entstehen Vorschau-Raster und Screenshots, ohne dass Dome etwas bedienen muss. Ausbauen: `werkzeuge/merkmale-raster.js` zeichnet für eine Rasse alle zwölf Exterieur-Werte bei 0 / 25 / 50 / 75 / 100 in einem Raster; Dome sieht sofort, wie weit das Bild gehen darf.
2. **Ebenen-Prüfer für Domes Inkscape-Dateien:** `werkzeuge/svg-pruefen.js` (wie `kopf-export.js`): liest eine hochgeladene SVG, prüft die Ebenen-Namen gegen diese Liste und meldet fehlende oder falsch geschriebene, bevor eingebaut wird. Spart Rückfragen.
3. **SVGO** (npm, kostenlos) vor dem Einbauen auf Domes SVGs laufen lassen: kleinere Dateien, die `index.html` ist schon über 2 MB.
4. **Inkscape** (Dome, kostenlos) bleibt das Zeichenprogramm. Falls es in Codings Umgebung installierbar ist (`inkscape --export-type=png datei.svg` im Stapel), kann es Domes Dateien direkt prüfen und Vorschaubilder erzeugen; sonst reicht Chromium.
5. **Animation:** Für Bewegung im Spiel genügt **SVG/CSS-Animation** direkt im Code, dafür ist kein Programm nötig. Für Vorschau-Filme: Einzelbilder per Playwright speichern und mit **ffmpeg** zu GIF oder MP4 machen. Zum Selbstzeichnen von Frame-Animationen: **Krita** (hat Dome), alternativ **Synfig Studio** oder **Pencil2D**. Blender (3D) ist für dieses Projekt zu groß.
6. **Screenshot-Prüfung:** `tests/optik-pruefung.js` weiter nutzen (PC 1366×768, Handy quer 844×390, hochkant 390×844).



=== TEIL 5 von 6: Thema 9 – Hauptteil – speichern als PLAN-REITER.md ===

# Auftrag für die Coding-Sitzung: Reiter-Erfahrung (Reiter-Können)

**Stand:** 20.10.2026, im Projekt-Chat mit Dome geplant (Runden 1–2), Code-Stand beim Planen v577. Etappen K1 → K2 → K3 → K4.

**Kurz:** Bisher steigt nur die Reiter-LK durch Turniererfolge, Training gibt pauschal +4 % je LK-Stufe, und der Reiter verändert ein Turnierergebnis nur um −5 % … +4 %. Neu: ein **Reiter-Können (0–100) je Disziplin**, das durch Training, Turniere und Reitunterricht wächst und **Training und Turnier wirklich bestimmt**: Ein Reiter, der weiter ist als das Pferd, trainiert es besser; ein Pferd, das weiter ist als der Reiter, bremst. Ein schwacher Reiter holt auch aus einem guten Pferd wenig heraus.

**Wann umsetzen:** Reihenfolge frei (Themen 1–5 sind gebaut). Die Merkmale-Karte (`PLAN-MERKMALE.md`) und dieses Thema ändern beide dieselben Formeln (`marktwert`, Turnier-Wert in `turnierNacht`, Disziplin-Wert): wer später kommt, übernimmt die Faktoren des anderen in die Formel, nichts überschreiben.

## Zuerst speichern
1. Diese Datei im Repo als `PLAN-REITER.md`, Anhang A als `PLAN-REITER-TEXTE.md`.
2. In `PROJEKT-CHAT-THEMEN.md` Punkt 7 („Reiter-Erfahrung“): „geplant → PLAN-REITER.md“. Zwei **neue Punkte** anlegen:
   - **„Ponys: Reiter, Gewicht, Fahren“** (Dome, 20.10.2026, später planen): Erwachsene können Ponys und Shettys in echt nicht reiten (Gewichtsgrenze etwa 20 % des Pferdegewichts, Pony-Turniere sind für Kinder). Mögliche Wege: Kinder oder Jugendliche als Reiter, Fahren (Kutsche), beides. Bis dahin starten Ponys wie alle Pferde, daran ändert dieses Thema nichts.
   - Zu „Aufzucht- und Ausbildungsstall außer Haus“ ergänzen (Dome, 20.10.2026): **je Disziplin mehrere Ausbildungsställe zur Auswahl (günstig, moderat, teuer)**, das Pferd lernt je nach Stall mehr oder weniger; ein Westernpferd gehört in einen Western-Ausbildungsstall. Dieses Thema nimmt bis dahin Platzhalter-Können 65 / 80 / 92 (siehe 15).
3. In `CLAUDE.md` eine feste Regel: **Wird eine Disziplin neu angelegt oder umgebaut (`DISZ`), muss die Reiter-Tabelle `REITER_DISZ` mit angepasst werden** (Gruppe, Prüfanforderung je Klasse, Übungen, LK ja/nein).
4. Etappe für Etappe umsetzen, abhaken, nach jeder Etappe auf `main` hochladen. Die Regel aus Thema 5 gilt: jede neue Funktion bekommt gleich Tipp- und Stufen-Eintrag.

## Ist-Stand (v577)
1. `lkVon(g)`, `spiel.lk[g]` (7 → 1) für die Gruppen `dressur`, `springen`, `vielseitigkeit`, `western` (`LK_GRUPPE`, `LK_NAME`); Startrechte `LK_STUFEN`; Aufstieg `lkErfolg(g, stufe, platz)` mit `LK_REGEL` und `spiel.lkErfolge`.
2. Training selbst: `reiterFaktor(k) = 1 + 0,04 × (7 − LK)` über `UEB_LK` (nur Dressur/Springen/Vielseitigkeit/Western-Übungen); im Faktor `F` der Trainingsberechnung (`trainieren`, Zeile mit `trainerFaktor(m) : reiterFaktor(k)`). Mitarbeiter: `trainerFaktor(m) = 0,8 + 0,4 × wissen.ruecken / 100`.
3. Turnier: in `turnierNacht` `reiterF = profi ? 1,04 : 0,95 + 0,015 × (7 − LK)` im Produkt des Turnierwerts; `profi` = Ausbildungsstall stellt das Pferd vor („reitet wie LK 2“). Rennen: Jockey (`REITGELD` 80 €, `P.jockey`), Distanz/Tölt/Pass ohne LK.
4. Reiterprofil: `reiterHTML()` in Hofverwaltung - Reiter (Avatar, LK-Tabelle, Turnierbilanz). `spielerBereiter()` (LK ≤ `SPIELER_BEREITER_LK` in allen vier Gruppen) erlaubt es, Pensionspferde zu bewegen. `BEREITER_EINHEIT` 35 € je Reiteinheit; fester Bereiter nur im Ausbildungsstall, sonst „Bereiter nach Bedarf“ (`festerBereiter()`).
5. Das Pferd hat Ausbildungsstand je Disziplin (`ausbildungsKlasse`, `klasseIndex`, `KLASSEN`, Disziplin-Stand `U.d`).
6. Erfahrungsstufen: `frei(f)` / `STUFE()` / `STUFE_NEU`; Anfänger trainiert über festen Pfad (`ANF_WEG`).

## Entscheidungen (Dome, 20.10.2026)

### K1 – Reiter-Können (Daten, Wachstum)
1. **Können 0–100 je Disziplin-Gruppe** in `spiel.reiter.koennen[gruppe]`, Gruppen laut Tabelle `REITER_DISZ` (Anhang A, Abschnitt 1): `dressur`, `springen`, `vielseitigkeit`, `western` (Reining, Pleasure, Trail), `rennen` (Galopp-, Trab-, Passrennen), `distanz`, `gangpferde` (Tölt). **LK** gibt es weiter nur für die ersten vier (Startrecht, Aufstieg wie bisher). Das Können gilt je Spielstand, nicht je Hof.
2. **Wachstum** (alle Zuwächse × `(1 − Können / 120)`, also langsamer je höher das Können):
   - **Training selbst geritten:** +0,15 je Einheit. Ist das Pferd in der Disziplin weniger als 10 Punkte unter deinem Können (Prüfanforderung der Ausbildungsklasse, Punkt 5), voller Zuwachs, sonst ein Drittel (zu leichte Pferde bringen dich nicht weiter).
   - **Turnier selbst geritten:** Start +0,3, Platzierung +0,8, Sieg +1,5, mal Klassenfaktor (Wettbewerb/Hofturnier 0,5 · E 1,0 · A 1,25 · L 1,5 · M 1,75 · S 2,0, Western entsprechend).
   - **Reitunterricht:** +0,8, bei Können unter 30 doppelt, wirkt nur bis Können 60 (Punkt 9).
   - Verlernen gibt es nicht (nur Wachstum).
3. **Übungen → Gruppe** über `UEB_LK` erweitern: Dressur-/Springen-/Vielseitigkeit-/Western-Übungen wie bisher, dazu Trail-Arbeit → `western`, Galopp- und Konditionsarbeit im Gelände → `rennen`, Ausritt und Kondition → `distanz`, Tölt-/Passübungen → `gangpferde`. Die genauen Schlüssel in `UEBUNG` selbst prüfen; was keiner Gruppe zugeordnet ist, zählt nicht.
4. **Alte Spielstände:** einmal beim Laden (`reiterErgaenzen()`): Können der vier LK-Gruppen aus der LK: LK 7 = 10, 6 = 22, 5 = 38, 4 = 52, 3 = 66, 2 = 80, 1 = 92; Rennen, Distanz, Gangpferde = 10. Ohne Brief, danach fest.
5. **Prüfanforderung** je Klasse (Tabelle in Anhang A, Abschnitt 2): englische Klassen E 10 · A 30 · L 50 · M 70 · S 85, Western Einsteiger 10 · Rookie 30 · Novice 50 · Intermediate 70 · Open 85; Wettbewerb/Hofturnier und Aufbauprüfungen 10; Rennen, Distanz und Tölt Anforderung nach Klasse bzw. Länge (Anhang A). **Stand des Pferdes** in einer Disziplin = Prüfanforderung der Klasse, die es dort erreicht hat (Ausbildungsklasse bzw. Disziplin-Stand); junge oder unausgebildete Pferde 0.

### K2 – Training und Reitunterricht
6. **Abstandsfaktor beim Training** `v = (Können − Stand des Pferdes) / 20` (eine Klasse ≈ 20 Punkte). Faktor nach `v` (zwischen den Punkten linear): `v ≥ 2` → ×1,2 · `v = 1` → ×1,1 · `v = 0` → ×1,0 · `v = −1` → ×0,8 · `v = −2` → ×0,5 · `v ≤ −3` → ×0,25. Bei `v ≤ −1` sinkt das **Vertrauen** des Pferdes um 0,1 je Einheit, bei `v ≤ −2` um 0,3. **Ersetzt** `reiterFaktor` (+4 % je LK). Für Mitarbeiter (`m`): `trainerFaktor(m)` bleibt, der Abstandsfaktor kommt dazu; das Können des Mitarbeiters ist sein `wissen.ruecken` (0–100), im Ausbildungsstall plus 10, höchstens 95. Ein Bereiter bildet also kein Pferd aus, das viel weiter ist als er.
7. **Reitunterricht:** Aktion in Hofverwaltung - Reiter (Knopf „🎓 Reitunterricht“, Disziplin wählen). Extern **60 € je Stunde**; beim eigenen Bereiter oder Ausbilder (fest angestellt) kostenlos, aber seine Trainingseinheit dieses Tages entfällt. Höchstens 1 Stunde je Tag und Disziplin, wirkt bis Können 60 (darüber: Hinweis „Mehr lernst du jetzt auf Turnieren und mit schwierigeren Pferden“). **Ab Anfänger freigeschaltet** (Dome: Anfänger brauchen ihn am meisten). Buchen über `buchen(...)`, Eintrag im Spielprotokoll `prot("Reitunterricht", …)`.
8. **Hinweis „Dein Pferd ist besser als du“** (Dome, 20.10.): Bedingung `v ≤ −1` für das Pferd in der Disziplin. Einmal **je Pferd und Disziplin** (Merker `p.hinw.besser[gruppe]`, nie bei jedem Turnier neu), an diesen Stellen: **a)** Anfänger-Tutorial, Kapitel Training (Satz und Blase, Anhang A); **b)** beim Kauf (Pferdemarkt, Händler, Tierschutz) als Zeile im Steckbrief „Dieses Pferd ist weiter als du“, Kaufen bleibt erlaubt; **c)** Brief vom Bereiter oder Ausbildungsstall, wenn das Pferd von dort zurückkommt (Anhang A); **d)** Blase beim ersten Training mit diesem Pferd; **e)** Warnfenster beim Turnier-Nennen. Dauerhafte Zeilen (Ort-Reiter beim Pferd, Nennen-Zeile mit Können) sind keine Hinweise und bleiben immer sichtbar.

### K3 – Turnier und Rennen
9. **Turnier-Reiterfaktor** `reiterF` mit `q = Können des Reiters / Prüfanforderung der Klasse` (Anforderung mindestens 10): `reiterF = 0,80 + 0,20 × min(1, q) + 0,08 × min(1, max(0, q − 1))`, also ×0,80 (Können fehlt stark) bis ×1,08 (Können doppelt so hoch wie verlangt). **Ersetzt** `0,95 + 0,015 × (7 − LK)` und `profi ? 1,04`. Im Nennen-Dialog zeigt eine Zeile: „Dein Können reicht für diese Klasse“ / „knapp (−x %)“ / „fehlt: du holst deutlich weniger aus {Name} heraus“.
10. **Reiter wählen beim Nennen** (Claude-Vorschlag, Dome hat nicht widersprochen, ab Fortgeschritten; Anfänger reitet selbst): du selbst · dein **Bereiter** (Name, sein Können; fest angestellt kostenlos, aber er trainiert an dem Tag nicht; „Bereiter nach Bedarf“ 2 Einheiten = 70 €) · **Profi von außen** (Können 85, 150 € Reitgeld). Es zählen Können und Startrecht des gewählten Reiters (Startrecht für Bereiter/Profi: Anforderung der Klasse ≤ Können + 10; deine LK-Grenze gilt nur, wenn du selbst reitest). **Erfolge zählen für das Pferd** (`p.erfolge`, Marktwert), nicht für deine LK und dein Können.
11. **Ausbildungsstall außer Haus** (Pferd wird dort ausgebildet und stellt sich vor, `profi`): Platzhalter-Können je Stall **günstig 65 · moderat 80 · teuer 92** (der heutige eine Ausbildungsstall = moderat, 80), Spezialisten in ihrer Disziplin, unabhängig von deinem Können (deren Training läuft nach den bisherigen Regeln des Ausbildungsstalls). Beim **Anmelden** erscheint eine Warnung, wenn das Ziel weiter ist als du: „Du reitest erst L. Kommt {Name} mit M zurück, bremst dein Training, und du darfst es erst mit LK 3 in M starten.“ Dazu der Brief aus 8c bei der Rückkehr. Die Tabelle der Ställe füllt später das Thema „Ausbildungsstall außer Haus“.
12. **Rennen selbst reiten:** Galopp-, Trab- und Passrennen kann der Spieler selbst reiten (Können `rennen`, **ohne LK**). Startrecht ab Können 30 (wie eine Amateurlizenz). Selbst reiten spart das Reitgeld (`REITGELD` 80 €), den Jockey kann man jederzeit weiter nehmen. Kein Sturzrisiko für den Reiter und keine Gewichtsgrenzen (eigenes Thema, falls gewünscht). Distanz und Tölt/Pass: Können zählt über den `reiterF`, **kein** Startrecht gesperrt.
13. **LK-Aufstieg** zusätzlich zur Erfolgsregel (`LK_REGEL`): nur wenn das Können der Gruppe die Schwelle erreicht hat: LK 6 ab 15 · LK 5 ab 30 · LK 4 ab 45 · LK 3 ab 60 · LK 2 ab 75 · LK 1 ab 90. Reichen die Erfolge, fehlt aber Können, sammeln sie sich weiter und eine Blase (Anhang A) erklärt es.

### K4 – Anzeige, Stufen, Hinweise
14. **Hofverwaltung - Reiter** (`reiterHTML`): je Gruppe Zeile mit LK (nur vier), **Können-Balken**, Schwelle zur nächsten LK, Wirkung („Training bei Pferden auf deinem Stand +10 %“), Knopf Reitunterricht. Im **Ort-Reiter** (Training) beim Pferd ein Satz: „Du bist eine Klasse weiter: gutes Training“ / „Dieses Pferd ist weiter als du: das bremst“ (bei Mitarbeiter-Training: der Satz zum Mitarbeiter).
15. **Stufen** (`frei()`, neue Schlüssel `reiterBalken`, `reiterZahlen`, `STUFE_NEU` ergänzen): **Anfänger:** nur LK und der Satz im Training, Reitunterricht freigeschaltet. **Fortgeschritten:** Können-Balken, Schwellen, Reiter wählen beim Nennen. **Experte:** zusätzlich die genauen Zuwächse (Tooltip) und Zahlen. **Adminmodus:** zusätzlich Zahlen und die Rechenwerte.
16. **Texte** (Blasen, Briefe, Tutorial, Enzyklopädie, bzn): Anhang A. Hinweise und Tutorial werden gerade vom Claude-Team überarbeitet: Einträge so in das jeweils aktuelle System einbauen; bei Widerspruch gewinnt der neue Stand, die Texte und Auslöser bleiben.
17. **Spätere Überarbeitung der Disziplinen:** Alle Zahlen zum Reiter (Gruppe, Anforderung je Klasse, Übungen, LK ja/nein) stehen in einer Tabelle `REITER_DISZ` (Anhang A, Abschnitt 1–2). Eine neue oder umgebaute Disziplin braucht nur eine Zeile; die Formeln bleiben.

## Etappen
1. **K1 Können (mittel):** `spiel.reiter.koennen`, `REITER_DISZ`, Wachstum, `reiterErgaenzen` (alte Spielstände), Anzeige der Zahlen im Adminmodus.
2. **K2 Training und Unterricht (mittel):** Abstandsfaktor statt `reiterFaktor`, Mitarbeiter, Vertrauen, Reitunterricht, Hinweis 8a/8b/8d, Ort-Reiter-Satz.
3. **K3 Turnier und Rennen (mittel/groß):** `reiterF`, Reiter wählen, Profi-Können je Ausbildungsstall, Warnung beim Anmelden, Rennen selbst reiten, LK-Schwellen, Brief 8c und Nennen-Warnung 8e.
4. **K4 Anzeige, Stufen, Hinweise, Tutorial (mittel):** Reiter-Seite, Stufen, Blasen, Tutorial-Ergänzungen, Enzyklopädie, bzn.

## Testen
1. `tests/reiter-test.js`: alter Spielstand → Können aus LK; Wachstum (Training, Turnier, Unterricht, Abnahme bei hohem Können, Deckel Unterricht bei 60); Abstandsfaktor (Reiter 2 Klassen weiter, gleich, Pferd 1, 2, 3 weiter, Vertrauen sinkt); Mitarbeiter-Training mit niedrigem und hohem Können; Turnier-Reiterfaktor (q = 0,2 / 1 / 2); Reiter wählen (Bereiter, Profi, Kosten, Erfolge nur beim Pferd); Rennen selbst reiten (Startrecht ab 30, Reitgeld gespart); LK-Aufstieg wartet auf Können; Hinweis 8 nur einmal je Pferd und Disziplin.
2. Oberfläche in PC (1366×768), Handy quer (844×390) und hochkant (390×844): Hofverwaltung - Reiter, Reitunterricht-Fenster, Ort-Reiter-Satz, Nennen-Dialog mit Reiterwahl und Warnzeile, Kauf-Zeile „weiter als du“.
3. Stufen: Anfänger sieht LK, Satz und Unterricht, keine Balken; Fortgeschritten Balken und Reiterwahl; Experte Zuwächse.
4. Spielprotokoll (`prot`) und `CLAUDE.md`, Enzyklopädie und bzn aktuell halten.



=== TEIL 6 von 6: Thema 9 – Anhang A (Texte) – speichern als PLAN-REITER-TEXTE.md ===

# Anhang A: Tabellen, Texte, Hinweise zur Reiter-Erfahrung

## 1. Tabelle `REITER_DISZ` (Gruppen)
| Gruppe | Disziplinen (`DISZ`-Schlüssel) | LK | Übungen, die das Können trainieren (`UEBUNG`, Schlüssel prüfen) |
|---|---|---|---|
| `dressur` | dressur | ja | longieren, doppellonge, dressur |
| `springen` | springen | ja | stangen, springen |
| `vielseitigkeit` | vielseitigkeit | ja | gelaendesprung, kondition |
| `western` | reining, pleasure, trail | ja | western, trailarbeit |
| `rennen` | galopprennen, trabrennen, passrennen | nein | Galopp- und Konditionsarbeit im Gelände |
| `distanz` | distanz | nein | ausritt, kondition |
| `gangpferde` | toelt | nein | toeltarbeit, passtraining |
Fehlende Übungen nicht erfinden: was in `UEBUNG` keiner Gruppe passt, zählt nicht fürs Können (nur Reitunterricht und Turniere). Neue Disziplinen: eine Zeile ergänzen (siehe Auftrag Punkt 17).

## 2. Prüfanforderung je Klasse (Können nötig, damit der Reiter nichts verliert)
| Klasse | Anforderung |
|---|---|
| Wettbewerb, Hofturnier, Aufbauprüfung, Gelassenheit | 10 |
| E (Western: Einsteiger) | 10 |
| A (Rookie) | 30 |
| L (Novice) | 50 |
| M (Intermediate) | 70 |
| S (Open) | 85 |
| Anglo-Araber-Rennen Kl. C / B | 30 / 50 |
| Galopprennen und Araberrennen | 50 (Verkaufsrennen 30) |
| Trabrennen | 50 |
| Passrennen 250 m | 50 |
| Tölt Einsteiger / D / C / B / A | 10 / 30 / 50 / 70 / 85 |
| Distanzritt bis 20 km / bis 40 km / bis 80 km / darüber | 10 / 30 / 50 / 70 |
Der **Stand des Pferdes** in einer Disziplin ist die Anforderung der Klasse, die es dort erreicht hat (E 10 … S 85, nicht ausgebildet 0).

## 3. Hinweisblasen (6, Ton wie überall: Du-Form, höchstens zwei Sätze, Alltagsvergleich, „Mehr dazu“ → Einsteiger-Wissen, Eintrag „Reiter-Können“)
| Nr | Auslöser | Stufe | Text |
|---|---|---|---|
| R1 | Hofverwaltung - Reiter zum ersten Mal geöffnet | alle | „Hier siehst du, wie gut du reitest. Das Können wächst, wenn du trainierst, Turniere reitest oder Reitunterricht nimmst.“ |
| R2 | erstes eigenes Reiten im Training | Anfänger, Fortgeschritten | „Dein Können bestimmt, wie gut dein Training wirkt. Ist ein Pferd weiter als du, bremst es dich aus.“ |
| R3 | Reitunterricht zum ersten Mal sichtbar | alle | „Reitunterricht kostet Geld, bringt dir aber am Anfang am meisten. Ab Können 60 lernst du mehr auf Turnieren und mit schwierigeren Pferden.“ |
| R4 | Nennen mit Reiterwahl zum ersten Mal | Fortgeschritten, Experte | „Du kannst auch einen anderen Reiter nennen, wenn dein Pferd besser ist als du. Dann zählt dessen Können, und der Erfolg gehört dem Pferd.“ |
| R5 | LK-Aufstieg wartet auf Können, erstes Mal | Fortgeschritten, Experte | „Für die nächste LK reichen Siege allein nicht, dein Können muss auch mitkommen. Training und Reitunterricht helfen dir dabei.“ |
| R6 | Pferd ist erstmals eine Klasse weiter als du (je Pferd und Disziplin einmal, siehe Auftrag 8) | alle | „{Name} ist weiter als du. Dein Training bremst {ihn/sie}: Reitunterricht oder ein anderer Reiter beim Nennen helfen.“ |
Dazu ein Hinweis, wenn man zum ersten Mal ein Rennen selbst reiten kann (Fortgeschritten, Experte): „Du kannst Rennen auch selbst reiten, wenn dein Können reicht. Das spart das Reitgeld, aber ein schwacher Reiter holt weniger aus dem Pferd.“
Nebentipps-Limit wie bei allen Nebentipps (eine Blase je Ansicht, drei je Tag, nie im Dialog).

## 4. Brief „{Name} ist jetzt weiter als du“ (Auftrag 8c, einmal je Pferd und Disziplin)
- **Absender:** der Ausbildungsstall (Name des Stalls), oder dein Bereiter, wenn er das Pferd trainiert hat; Anrede nach den Regeln des Spiels (`{du|Sie}`).
- **Betreff:** „{Name} ist jetzt weiter als {du|Sie}“
- **Text:** „{Name} hat bei uns die Klasse <Klasse> in <Disziplin> erreicht. Das ist eine Klasse weiter, als {du reitest|Sie reiten}. Das hat Folgen: Trainiert {du|Sie} {ihn/sie} selbst, lernt {er/sie} langsamer, weil {du|Sie} {ihn/sie} bremsen, und {er/sie} verliert etwas Vertrauen. Auf Turnieren zählt {dein|Ihr} Können: Je größer der Abstand, desto weniger holt {ihr|Sie} aus {ihm/ihr} heraus. Was hilft: Reitunterricht nehmen, beim Nennen einen Bereiter oder Profi als Reiter wählen oder {ihn/sie} an jemanden verkaufen, der {ihn/sie} fordern kann.“
- Beim Anmelden im Ausbildungsstall (Auftrag 11): „Du reitest erst <Klasse>. Kommt {Name} mit <Ziel> zurück, bremst dein Training, und du darfst {ihn/sie} erst mit LK <x> in <Ziel> starten.“

## 5. Tutorial
- **Anfänger-Tutorial, Kapitel 5 (Training):** zwei Sätze und eine Blase: „Wie gut ein Training wirkt, hängt auch von dir ab. Ist ein Pferd weiter als du, bremst es dich; Reitunterricht hilft am Anfang am meisten.“ Das Testpferd im Kapitel ist **weiter als du** (Stand L, dein Können 10), damit die Blase R6 gleich gezeigt wird; im Testhof ist Reitunterricht 60 € vom Testgeld und gibt +0,8 (doppelt: 1,6).
- **Fortgeschrittenen-Tutorial, neues Kapitel „Reiter-Können, Unterricht, Reiterwahl“** (nur zum Nachholen, 2 Tage, Testhof): Testpferd **Bella** (Stand A, Dressur) und **Ferro** (Stand M, Dressur). Ziel: „Bring Ferro ins Turnier, ohne dass dein Können ihn ausbremst.“ Tag 1: Hofverwaltung - Reiter öffnen, Können-Balken lesen, mit Bella trainieren (gutes Training), mit Ferro trainieren (bremst), eine Reitstunde nehmen. Tag 2: Ferro im Dressur-Turnier nennen und beim Nennen **Bereiter** statt „du“ wählen, das Ergebnis per Brief lesen. Abschluss: „Ein Pferd, das weiter ist als du, muss nicht weg: Lass es von jemandem reiten, der besser ist, und lerne an einem Pferd, das dich fordert.“
- **Experten-Tutorial:** kein neues Kapitel; ein Satz bei Rennen: „Du kannst Rennen selbst reiten, wenn dein Können reicht.“

## 6. Enzyklopädie (öffentlich), Eintrag „Reiter-Können“ (Einsteiger-Wissen)
„**Reiter-Können.** Jeder Reiter kann mehr oder weniger gut reiten, je Disziplin getrennt. Dein Können (0 bis 100) wächst durch Training, Turniere und Reitunterricht. Es wächst schnell am Anfang und langsamer, je besser du schon bist.

**Pferd und Reiter.** Ein Pferd lernt am besten bei einem Reiter, der etwas weiter ist als es selbst. Ist das Pferd weiter als der Reiter, bremst es das Training und verliert Vertrauen. Auf Turnieren holt ein Reiter, dessen Können zur Klasse passt, das Beste aus dem Pferd; fehlt Können, bleibt das Ergebnis dahinter.

**Leistungsklasse (LK).** Die LK sagt, in welchen Klassen du starten darfst (Dressur, Springen, Vielseitigkeit, Western). Sie steigt mit Erfolgen, aber nur, wenn dein Können mitgekommen ist.

**Bereiter und Profis.** Du kannst ein Pferd beim Nennen von deinem Bereiter oder einem Profi reiten lassen. Dann zählt deren Können. Der Erfolg gehört dem Pferd.“

## 7. Berechnungen zum Nachschlagen (bzn, nur Admin): Absatz „Reiter-Können (Thema 9)“
Inhalt: `REITER_DISZ` mit Gruppen, Prüfanforderung je Klasse, Wachstum (Training, Turnier mit Klassenfaktor, Unterricht, Abnahme `1 − Können/120`), Alt-Umrechnung LK → Können, Abstandsfaktor (Punkte ×1,2 / 1,1 / 1,0 / 0,8 / 0,5 / 0,25, Vertrauen −0,1 / −0,3), Turnier-`reiterF`-Formel, LK-Schwellen, Reiterwahl und Kosten, Platzhalter-Können der Ausbildungsställe, Startrecht Rennen. Zahlen aus den Konstanten lesen (`${…}`), nicht von Hand einsetzen.

## 8. Stufen-Zeilen (`STUFE_NEU`)
| Stufe | Neu freigeschaltet |
|---|---|
| Fortgeschritten | „Reiter-Können als Balken, Reiter wählen beim Nennen, Rennen selbst reiten“ |
| Experte | „genaue Zuwächse des Reiter-Könnens und alle Rechenwerte“ |

## 9. Nachtrag (20.10.2026, nach Rückfrage von Coding)
1. **Kondition zählt in mehreren Gruppen.** Eine Übung darf in `REITER_DISZ` bei mehreren Gruppen stehen (Liste statt einer Gruppe); der Zuwachs gilt voll in jeder. Betroffen: `kondition` bei `vielseitigkeit`, `rennen` und `distanz`.
2. **Galopptraining und Rennbahn.** Mit dem Gebäude „Rennbahn“ wächst das Können `rennen` voll durch Galopptraining. Ohne Rennbahn zählen Galopp- und Konditionsarbeit im Gelände (Ausritt) zur Hälfte (Faktor 0,5). Das Startrecht „Rennen selbst reiten“ bei Können 30 bleibt; Turniere und Reitunterricht zählen wie überall voll.
3. Beide Punkte sind Vorschläge und gelten als Standard, bis Dome etwas anderes sagt.
