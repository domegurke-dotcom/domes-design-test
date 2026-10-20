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

**Von:** Claude Team · **An:** Claude Pro · **Stand:** v605, 20.10.2026 (Abend)

Die Nachricht von Claude Pro (v597, Fragen durchgehen) ist gelesen und übernommen. Dome hat die offenen Fragen beantwortet („so lassen“, Details unten), dann den **Auftrag aus dem Projekt-Chat** (`PLAN-TIERHALTEVERBOT-SPEICHER.md`) vorgezogen. **Phase D (großer Test) startet erst nach Domes „weiter“.**

### Was in dieser Sitzung passiert ist (je Etappe ein eigener Commit auf dem Branch `claude/elegant-einstein-gxcam1`)
| Version | Inhalt |
|---|---|
| v598 | Merkmale M5 vollständig (nichts weglassen, Dome): Fremd-Vergleich (bei fremden Pferden Interieur nur grob), Blasen `merkVorschau`/`merkFohlenschau`, Pferdebild in der Rassenansicht mit den gewählten Exterieur-Werten (`wahlBauOpt`), Kryptorchismus-Haken im Admin; Reiter-Test-Toleranz. Vermerk: Zeilen Behang/Ohren in den Rassemerkmalen später (Inkscape 0d) |
| v599 | Post P1: Grenze 300, ⭐/ungelesen/Jahresbericht/offene Aktion nie gelöscht, Hinweisbrief, Blase ab 250 |
| v600 | Veterinäramt V1: Vorfälle, Stufen (Verbot beim 3., Anfänger 4.), Strafen 2.000/5.000 €, gerechte Ausnahmen, Verjährung, Klinik für Beschlagnahmte umgebaut, Zeile in Hofverwaltung – Hof |
| v601 | V2: Kontrollen, Auflagen mit Frist (≥ 7 Tage), Nachkontrolle, Meldungen (anonym, Einsteller, Tierarzt, Hufschmied) |
| v602 | V3: Tierhalteverbot → Spiel verloren (Abschlussbilanz, Vorfälle, Tipps, Jahresbericht-Zeile) |
| v603 | V4: Vom Tierarzt erlösen lassen (250 €, Friedhof, kein Vorfall, Pension nur mit Zustimmung) |
| v604 | P2: Speicheranzeige (gelb 70 %, rot 90 %), „Speicher aufräumen“ (Briefe, Spam, Platz „Verloren“, Friedhof/Archiv: Details löschen oder ganz löschen) |
| v605 | T: Anfänger-Tutorial 13 Kapitel, Fortgeschrittenen-Kapitel „Veterinäramt und Erlösen“, 6 neue Blasen, 2 Enzyklopädie-Einträge, bzn |

Neue Tests: `tests/post-test.js`, `tests/veterinaer-test.js` (~4 % zufällige Wackler bei „Behandelt/Neukauf/altes Pferd“ – bekannt, Wiederholung grün), `tests/speicher-test.js`; angepasst `merkmale-test`, `jahresbericht-test`, `tutorial-test` (Fortgeschrittenen-Tutorial 1/10), `reiter-test` (Toleranz). Tutorial-Spieler anf 390×844 / 844×390 / 1366×768 und fort 390×844 grün (844×390 hängt selten zufällig bei „Hufe“).

### Domes Antworten (20.10.) – eingearbeitet
Fragen 1–12 aus `OFFENE-FRAGEN.md`: alles „so lassen“. 3a geklärt: auch der feste Bereiter kostet 60 € (Zusatzleistung), trainiert aber am nächsten Morgen normal (v606). 6a ja, 6d Beurteilungsschema als Bild im Bereich Exterieur (noch nicht eingebaut – Branch `entwurf-merkmale-bilder`), 10c Vermerk, 10e Tekkiner-Glanz so lassen, 11 alles Geplante nachbauen (erledigt v598).

### Test-Anleitung (Wege ausgeschrieben)
1. **Veterinäramt-Zeile:** Hauptmenü – Hofverwaltung – Hof: Zeile „Veterinäramt: unauffällig“; antippen öffnet das Fenster (Adminmodus: ➕ Vorfall, 🔍 Kontrolle jetzt).
2. **Vorfall provozieren:** ein Pferd mit 1 % Gesundheit hungern lassen (Adminmodus: Gesundheit setzen) und „Tag beenden“: Brief „Veterinäramt: Verwarnung“, Strafe 2.000 €, bei beschlagnahmten Pferden zusätzlich Brief vom Tierschutzverein.
3. **Kontrolle/Auflage:** Adminmodus – Veterinäramt-Fenster – „Kontrolle jetzt“ bei einer ungemisteten Box (3 Tage) → Brief mit Box und Pferd, Auflage mit Frist.
4. **Erlösen:** altes Pferd (ab ca. 34 Jahren) unter 20 % → Box – Pferdepflege – Versorgung: Knopf „Vom Tierarzt erlösen lassen“ (250 €).
5. **Speicher:** Hofverwaltung – Einstellungen: Anzeige „Speicher: x von ca. 5 MB“ und „🧹 Speicher aufräumen“.
6. **Post:** Briefe mit ⭐ bleiben, auch bei über 300 Briefen.
7. **Tutorial:** Charaktermenü – „Erst das Tutorial“: 13 Kapitel; im Fortgeschrittenen-Tutorial das neue Kapitel „Veterinäramt und Erlösen“.

### Offen
1. **Domes Abnahme** von v598–v605 und aller Phasen A–C (siehe die Test-Anleitungen von Claude Pro weiter unten in Git: UEBERGABE-Verlauf).
2. **Phase D (großer Test)** wartet auf Domes „weiter“. Große Tests nur mit ihrer Erlaubnis, vorher Variante fragen (`BILDER=aus|fehler|alle`).
3. Dome hat bestätigt (20.10.): **auf `main` hochladen**. Stand v606 liegt auf `main` und auf dem Branch `claude/elegant-einstein-gxcam1`.
4. Zahlen, die Claude selbst gesetzt hat (Meldechance 50 %, Klinik-Tod 4 %/Tag, KEINE_HEILUNG-Liste …): `OFFENE-FRAGEN.md` Nr. 2.
5. Wisch-/Ziehgefühl und Handy-Tests kann nur Dome prüfen.
