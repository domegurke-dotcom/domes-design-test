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
> **Team aktiv** (Stand v546, 19.10.2026)

Alles liegt auf `main` (Branch `claude/admiring-bell-s50jlb` ist gleich). Details zu jeder Version stehen in CLAUDE.md (v523–v541), Zahlen auch in der Enzyklopädie (bzn, nur Admin).

### Was in dieser Sitzung passiert ist
- **Studien** (Plan `PLAN-STUDIEN.md`, erledigt): Krankheitstest 28 Rassen × 4 Spieler (`studie-daten/zweite-studie-v534/`), Zuchttest (`tests/zucht-studie.js`, `tests/zucht-auswertung.js`, `studie-daten/zucht-studie-v534/`), Kontrolle nach den Änderungen (`studie-daten/v535-kontrolle/`). Bericht und Bewertung: `STUDIE-GESUNDHEIT.md`.
- **v535** Krankheiten: Druse/Atemwege seltener, Tod trotz Behandlung, Altersschwäche später (ab 22 J., viele Pferde werden 30). **Zucht wie in echt:** Natursprung/Besamung, Trächtigkeitsuntersuchung, Rosse, Fohlenrosse, Embryoverlust/Verfohlen/Totgeburt, Winterruhe, Leopard-Hinweis.
- **v536** stille Rosse, Natursprung erst wenn das Fohlen steht, ungemistete Box −4, Hengste weniger einsam, Besamung so sicher wie Natursprung.
- **v537** Tiefgefriersamen (nur Deckstation), Folgen der Nachtblindheit (Lp/Lp).
- **v538–v541:** Fehler „sicher tragend“ behoben, nach leerer Untersuchung sofort wieder deckbar, Wartezeiten nach Spieltempo (`WARTE_TEMPO`), schwere Kolik ohne OP stirbt zu 85 % (mit OP 25 %).
- **Neuer Test:** `tests/zucht-test.js` (Deck-Fenster, Untersuchung, stille Rosse, Geburt, Fohlenrosse, Kolik-OP, alle 3 Tempi; ~1 Min). Spielstand-Test (S1–S4, Aufnahmen) und Krankheiten-Test (Bewegung als Behandlung) sind grün.

### Offen
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
