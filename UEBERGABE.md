# Übergabe zwischen den Claude-Konten

Dome arbeitet abwechselnd mit zwei Claude-Konten am Spiel: **Claude Team** und **Claude Pro**.
Diese Datei ist der Austausch zwischen beiden – damit das jeweils andere Konto beim nächsten Start weiß, was passiert ist.

## Regeln für diese Datei
1. Beim Start einer Sitzung diese Datei lesen.
2. Steht unten als Absender **das andere Konto**: Infos lesen und übernehmen (CLAUDE.md, Pläne und Code sind schon aktuell – die Datei erklärt nur, was neu ist). Danach den Abschnitt „Nachricht“ **löschen**.
3. Am Ende der eigenen Sitzung (bzw. wenn Dome wechseln will) den Abschnitt „Nachricht“ neu schreiben: Absender = eigenes Konto, was gemacht wurde, was offen ist, worauf zu achten ist. Hochladen auf `main`.
4. Steht als Absender **das eigene Konto**, hat das andere Konto noch nicht gelesen – nichts löschen, nur ergänzen.
5. Weißt du nicht, welches Konto du bist: Dome kurz fragen.

---

## Nachricht

**Von:** Claude Team · **An:** Claude Pro · **Stand:** v439, 18.10.2026

Hallo Claude Pro! Seit v424/v425 (deine Köpfe-Etappe 1) habe ich v426–v439 gebaut. CLAUDE.md ist aktuell (Stand v439) – **Claude pflegt die CLAUDE.md jetzt selbst** (Dome, 18.10.). Dome hat noch ca. 15 % Volumen bei mir übrig gehabt, darum geht es bei dir weiter.

### Deine Aufgabe: Scheckmuster Schritt 2
Alles steht in **`PLAN-SCHECKUNG.md`** (Abschnitt „Schritt 2“): neue Muster Rabicano, Birdcatcher-Tupfen, Bend-Or-Flecken, Brindle und Dominant White (neues Gen W, W/W nicht lebensfähig) – mit Häufigkeiten, Vererbung und Zeichnung, von Dome freigegeben. Dome mag keine harten, geraden Kanten (weiche, unregelmäßige Ränder). Vor dem Einbau hat Dome die Entwürfe als Bilder gesehen – die Zeichnung soll so aussehen wie dort beschrieben. Bei Unklarheiten Dome fragen.

### Was ich gemacht habe (Kurzfassung, Details in CLAUDE.md)
- v426–v434: Köpfe Etappe 2+3 (Kopf-/Beinabzeichen mit Vererbung, Maulfärbung, Augen, Splashed White mit Hörtest, Zebrastreifen, Ohrgröße je Rasse, Fjord-Farbschläge, Dunkelfuchs, Hellfalbe, Aalstrich im Schopf, Admin-Auswahl, Abzeichen-Varianten).
- v435: Aufräumen (ESLint, ungenutzter Code, Test-Screenshots gelöscht).
- v436/v437: Kopfleiste beim Drehen des Handys (kein Durchblitzen, kein Herauszoomen in Chrome/Firefox Android).
- v438: **Kopfgröße wie in echt** je Rasse (`KOPF_REAL` × `KOPF_STIL` 1,2, neue Köpfe × `KOPF_GROESSE` 1,15) – bei Körper-Änderungen nur diese Werte anpassen.
- v439: **Scheckmuster Schritt 1** – 3 Stufen (`ex.muster`, `opt.musterStufe`) für alle vorhandenen Muster, unruhige Beinabzeichen-Ränder.

### Offen
- Scheckmuster Schritt 2 (s. o.).
- Domes Zeichnungen laut `BEI-INKSCAPE-BEARBEITEN.md` (Laterne: Form + Verlauf, Milchmaul, Krötenmaul, dunkles Maul größer) – nach dem Hochladen `NODE_PATH=/opt/node22/lib/node_modules node werkzeuge/kopf-export.js`.

### Worauf achten
- `//`-Kommentar nie mitten in einer Zeile. Test-Screenshots nie im Projektordner speichern (Scratchpad).
- Neue `ex`-Werte in `EX_GRENZEN`/`EX_NAME` und in `exVon` für alte Spielstände auffüllen.
- Dome: kurze Antworten, realistisch („nur wenn es real so ist“), erst Bilder zeigen, dann einbauen; bei Unstimmigkeiten fragen.
