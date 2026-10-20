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

**Von:** Claude Team · **An:** Claude Pro (oder die nächste Team-Sitzung) · **Stand:** v546, 19.10.2026

> **Hinweis für Claude Pro:** Claude Team (diese Sitzung) ist noch **aktiv** und ergänzt diese Nachricht laufend. Bitte noch nichts löschen und nicht an `index.html` arbeiten, solange hier „Team aktiv“ steht – sonst überschneiden sich die Änderungen. Dome sagt Bescheid, wenn Team fertig ist (dann den Hinweis hier entfernen).
> (Hinweis „Team aktiv“ erledigt – siehe Fortschritt Nachtsitzung unten.)

Alles liegt auf `main` (Branch `claude/admiring-bell-s50jlb` ist gleich). Details zu jeder Version stehen in CLAUDE.md (v523–v541), Zahlen auch in der Enzyklopädie (bzn, nur Admin).

### Was in dieser Sitzung passiert ist
- **Studien** (Plan `PLAN-STUDIEN.md`, erledigt): Krankheitstest 28 Rassen × 4 Spieler (`studie-daten/zweite-studie-v534/`), Zuchttest (`tests/zucht-studie.js`, `tests/zucht-auswertung.js`, `studie-daten/zucht-studie-v534/`), Kontrolle nach den Änderungen (`studie-daten/v535-kontrolle/`). Bericht und Bewertung: `STUDIE-GESUNDHEIT.md`.
- **v535** Krankheiten: Druse/Atemwege seltener, Tod trotz Behandlung, Altersschwäche später (ab 22 J., viele Pferde werden 30). **Zucht wie in echt:** Natursprung/Besamung, Trächtigkeitsuntersuchung, Rosse, Fohlenrosse, Embryoverlust/Verfohlen/Totgeburt, Winterruhe, Leopard-Hinweis.
- **v536** stille Rosse, Natursprung erst wenn das Fohlen steht, ungemistete Box −4, Hengste weniger einsam, Besamung so sicher wie Natursprung.
- **v537** Tiefgefriersamen (nur Deckstation), Folgen der Nachtblindheit (Lp/Lp).
- **v538–v541:** Fehler „sicher tragend“ behoben, nach leerer Untersuchung sofort wieder deckbar, Wartezeiten nach Spieltempo (`WARTE_TEMPO`), schwere Kolik ohne OP stirbt zu 85 % (mit OP 25 %).
- **Neuer Test:** `tests/zucht-test.js` (Deck-Fenster, Untersuchung, stille Rosse, Geburt, Fohlenrosse, Kolik-OP, alle 3 Tempi; ~1 Min). Spielstand-Test (S1–S4, Aufnahmen) und Krankheiten-Test (Bewegung als Behandlung) sind grün.

### Offen
- **Stand 19.10. (spätere Sitzung):** Claude Team hat v535–v546 per `tests/zucht-test.js` (alles grün) und per Oberfläche (Stall → Box → Genetik → Verpaaren → Natursprung, PC/quer/hoch, keine Fehler) für Dome geprüft; Dome: „passt so“. Nichts geändert außer CLAUDE.md (Abschnitte sortiert).
- **Domes Test von v535–v541** im Spiel (Zucht: Decken, Untersuchung, Geburts-Brief; Kolik-OP). Claude Team hat alles per Skript getestet, aber nicht auf dem Handy.
- Handy-Test Dateiname ohne Umlaut (Spielstand downloaden) – im Test-Chromium nicht prüfbar.
- Noch nicht gemacht (nur gesagt): Hufrehe-Tod eher hoch (0,6 je 100 Pferdejahre) – Dome fand es ok; Kolik ohne OP 85 % ist beschlossen.
- **v542/v543:** Pensionsstuten laufen jetzt durch die neue Zucht (Besitzer züchten selbst, `pensionZuchtNacht`); im Pensionsstall selten (4 % Züchter), im Zuchtstall 25 %; tragende Pensionsstuten ziehen in die Abfohlbox (v544) und zahlen je nach Boxstufe 5/10/15 € je Tag Aufpreis und freuen sich darüber (v546). Offen: Dome hat es noch nicht im Spiel getestet.
- Araber-Zuchtrichtungen → LFS je Richtung, Hautpilz an der Mähne ohne eigene Regel, Selbstbehandler kann ohne Rezeptmittel Kolik/Hufrehe/Sehne nicht behandeln (siehe PLAN-STUDIEN.md), Domes Inkscape-Liste wie bisher.
- Dome fragt oft nach „wie in echt“: Wenn Zahlen angepasst werden, vorher mit einem kleinen Skript prüfen und Dome die Zahlen nennen.

### Achtung
- **Neue Spieler-Aktionen mit `prot("…", { p, o, b })` zählen.**
- Kommentare in Skript-Ersetzungen nur am Zeilenende (siehe CLAUDE.md „Falle“). Beim Einfügen von `${…}` in Texte auf den Typ der Anführungszeichen achten (Backticks!) – ist in v541 einmal passiert, `new Function`-Syntaxprüfung vor jedem Upload fängt es.
- Test-Läufe von Studien nie parallel zu Änderungen an `index.html` (die Läufe laden die Datei neu).

### Nächste Sitzung (Claude Team, Sonnet reicht für kleine Dinge, Opus für große Umbauten)
- Dome gibt den Startsatz. Erst `UEBERGABE.md`, `CLAUDE.md` lesen, dann Domes Rückmeldung zum Test von v535–v541 abarbeiten.

### Nachtrag Claude Team, 20.10.2026 (Stand v557) – gleiche Sitzung wie oben, ergänzt
**Fertig und auf `main` (alle mit Test, Plan-Dateien und CLAUDE.md sind aktuell):**
- **v547 Dispo** (`PLAN-BILANZ.md` B1, `tests/dispo-test.js`): Konto bis −2.000 €, 12 % Zinsen, Käufe gesperrt, Kreditrate darf ins Dispo, Androhung → Pfändung → Insolvenz.
- **v548–v553 Hofchronik + Bestenliste + Lebensbilanz** (B2): Zähler je Hof (`spiel.chronik`), 3 beste/3 wertvollste Pferde je Hof (anklickbar, im Archiv geschützt), Bilanz je Pferd `p.bilanz` nach Disziplin und Klasse (Rennen/Tölt/Distanz mit Prüfungsnamen, Meisterschaft/International eigene Zeilen, getrennte Summen), Anzeige im Steckbrief.
- **v554 Jahresbericht** (B3, `tests/jahresbericht-test.js`), **v555 Bilanz als Bild** (B5, `tests/bild-test.js`).
- **v556/v557 Seltenheit** (R1 aus `PLAN-RARITAETEN.md`, `tests/seltenheit-test.js`, Rang-Tabelle per `werkzeuge/seltenheit-schwellen.js`).

**Offen (Dome hat auf Sonnet gearbeitet; für diese Opus empfohlen):**
- **B4 Spiel-verloren-Bilanz und „Nur ansehen“** (groß): Abschlussfenster mit Tipps, Platz „Verloren“, Nur-ansehen-Modus (nichts änderbar). `bilanzBildTeilen`, `bestenListen`, `jahresDaten`, `jbHofHTML` sind wiederverwendbar.
- **R2 Raritäten-Markt** (groß), dann **R3** (Preise/Auktion) und **R4** (eigene Raritäten anbieten). Voraussetzungen (Dispo, Chronik, Seltenheit) sind da.
- Fragen an Dome stehen in der Antwort der Sitzung (20.10.); Antworten bitte hier und in den Plänen nachtragen.

**Achtung:** `jahresbericht()` läuft im Jahreszeit-Block nach `hoefeVersteigern()` nur im Frühling Tag 1; Brief-Typ `jahresbericht` wird nie automatisch gelöscht (Post-Limit überspringt ihn). Bilanz-Schlüssel: `p.bilanzV = 3`. Große Tests (Etappen-, Hof-Gesamt-, Neuladen-Test) wurden in dieser Sitzung **nicht** gelaufen – bei Bedarf einmal laufen lassen (kostet Volumen, Dome vorher fragen).


### Nachtrag Claude Team, 20.10.2026 (Stand v559) – neue Sitzung folgt
**Fertig (auf `main`):** v558 (Seltenheit: selten < 3 %, Charakter raus, Mischlinge ohne Seltenheit, Symbol hinter dem Namen, Jahresbericht-Pferdezahl nur Stall), v559 (Gen-Schwelle je Rasse `SELTEN_MERKMAL_RASSE`, ca. 4 % je Rasse; Haflinger bleibt bei 0,7 %). Dazu nur Dokumentation: `PLAN-WASCHPLATZ.md`, `PLAN-HINWEISE.md` (+ Anhänge `PLAN-HINWEISE-TEXTE.md`, `PLAN-TUTORIAL.md`, `PLAN-STUFEN.md`), `PROJEKT-CHAT-THEMEN.md` Punkte 14/17/18, neuer Abschnitt „Selbstständig arbeiten“ in `CLAUDE.md`.
**Reihenfolge (Dome):** B4 (Spiel-verloren-Bilanz, Opus) → R2–R4 (Raritäten-Markt, Opus) → Waschplatz W1–W6 (Sonnet) → Hinweise/Stufen/Tutorials T1–T6 (T2/T4 Opus). Immer erst Überblick/Aufwand/Modell, auf klares „Ja“ warten.
**Offen/Fragen an Dome:** Solarium-Bilder sind von Dome freigegeben (20.10.); Zahlen im Waschplatz-Plan („Von Projekt-Chat ergänzt“) bestätigen lassen; Katalog-Thema 41 ohne Text.


---

## Fortschritt Nachtsitzung 20.10.2026 (Claude Team, Opus, selbstständig)
Auftrag von Dome (20.10., 3:30 Uhr): „Starte mit allem, was nach Plan offen ist, so weit wie es geht.“ Selbststarts um 7:05 und 12:05 Uhr (12:05: höchstens 50 % Volumen) sind als Erinnerung eingerichtet.
Reihenfolge: **B4 → R2 → R3 → R4 → Waschplatz W1–W6 → Hinweise T1–T6**. Fragen zur Spielmechanik → `OFFENE-FRAGEN.md` (empfohlene Lösung gebaut, leicht änderbar).
Bricht die Sitzung ab, kann **Claude Pro** hier weitermachen (Dome: Stand nach **jeder** Etappe sichern – feste Regel in CLAUDE.md): Stand steht in der Liste unten (wird nach jedem Schritt aktualisiert), Code liegt auf `main`.

| Schritt | Stand |
|---|---|
| B4 Spiel-verloren-Bilanz + Nur ansehen | **fertig v560** (`tests/verloren-test.js` grün, Screenshots angesehen) |
| R2 + R3 Raritäten-Markt mit Preisen und Auktion | **fertig v561** (`tests/raritaeten-test.js` grün) |
| R4 Eigene Raritäten anbieten | **fertig v562** |
| Waschplatz W1+W2 | **fertig v563** (`tests/waschplatz-test.js`) |
| Waschplatz W3 Solarium | **fertig v564** |
| Waschplatz W4 Pfleger/Einsteller | **fertig v565** |
| Waschplatz W5 Fohlen | **fertig v566** |
| Waschplatz W6 Bilder, Matten | **fertig v567** |
| Hinweise T1 Blasen-System | **fertig v568** (`tests/hinweise-test.js`) |
| Hinweise T2 Stufen | **fertig v569** (`tests/stufen-test.js`; nur neue Spiele) |
| Hinweise T3 Texte | **fertig v570** |
| Hinweise T4 Anfänger-Tutorial | **fertig v571** (`tests/tutorial-test.js`) |
| Hinweise T5 (Fortgeschrittenen-/Experten-Tutorial) | **fertig v572** |
| Hinweise T6 Gesamtprüfung | **erledigt** (ESLint ohne Fehler, Screenshots) |

### Stand am Ende der Nachtsitzung (20.10.2026, ca. 4:45 Uhr deutscher Zeit, v572)
**Alle Etappen der Reihenfolge sind umgesetzt und auf `main`:** B4 (v560), R2–R4 (v561/v562), Waschplatz W1–W6 (v563–v567), Hinweise/Stufen/Tutorials T1–T6 (v568–v572). Jede Etappe hat einen eigenen Test (`tests/verloren-test.js`, `raritaeten-test.js`, `waschplatz-test.js`, `hinweise-test.js`, `stufen-test.js`, `tutorial-test.js`), alle grün; die bestehenden kleinen Tests (Spielstand, Dispo, Chronik, Bestenliste, Jahresbericht, Bild, Seltenheit, Krankheiten, Zucht) laufen weiter grün.
**Für die nächste Sitzung (Team oder Pro):**
1. Mit Dome `OFFENE-FRAGEN.md` Punkte 1–9 durchgehen (Entscheidungen der Nacht), danach anpassen und beantwortete Fragen löschen.
2. Dome testet im Spiel: neues Spiel als Anfänger (Tutorial, Blasen, Stufen), Raritäten-Markt (ab Sommer), Waschplatz/Solarium bauen, Spiel verlieren → Abschlussbilanz → „Letzten Stand ansehen“.
3. Große Tests (Etappen-, Hof-Gesamt-, Neuladen-Test) wurden **nicht** gelaufen – vorher Dome fragen. Achtung: neue Spiele haben seit v569 die Stufen-Sperre (Standard Anfänger) → in großen Tests nach dem Start `spiel.stufenAn = false` setzen.
4. Selbststart 7:05 ist gelaufen; den Selbststart um 12:05 hat Dome abgesagt (Routine gelöscht).
5. **7:05-Start (20.10.2026) erledigt:** Stand v572 auf `main` geprüft, Stufen- und Tutorial-Test grün, nichts Neues angefangen. Es fehlen nur Domes Antworten (OFFENE-FRAGEN 1–9) und ihr Test.

### Domes Antworten beim Durchgehen (20.10.2026) – Umsetzung (Claude Team, Vormittag)
| Punkt | Stand |
|---|---|
| Alte Spielstände → Experte (umschaltbar) | ✅ v573 |
| Raritäten: eigene Auktion startet beim Raritäten-Marktwert | ✅ v573 |
| Raritäten: Auktion läuft ab dem 1. Gebot `tpj()` Tage (auch übers Marktjahr), ohne Spieler keine Gebote | ✅ v573 |
| Raritäten: mehr „selten“ (`RAR.stufe` 0,92/0,06/0,02 → ca. 65/31/4 %) | ✅ v573 |
| Anfänger: fester Futterplan, Charakter-Details aus, keine Pfändung im 1. Jahr, Training fester Weg (2–3 empfohlene Übungen entlang der Skala) | ⏳ als Nächstes |
| Abstammungs-Zuschlag Marktwert (Eltern/Großeltern-Erfolge, Prämien-/Championfohlen machen Eltern wertvoller, max. ca. +50 %, wirkt bei Jungen am stärksten) | ⏳ danach |
| Tutorial-Balken Handy quer verschieben (deckt ~30 px Stall) | ⏳ danach |

Domes Antworten (Original):
- Stufen-Sperre / alte Spielstände: alte Spielstände werden automatisch zu **Experten** und können im Menü umschalten.
- Raritäten-Markt, eigene Pferde verkaufen: Auktion startet beim **Raritäten-Marktwert** des Pferdes (nicht bei der Hälfte).
