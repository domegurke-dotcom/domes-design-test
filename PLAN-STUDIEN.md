# Plan der großen Studien (Stand v534, 19.10.2026)

## A) Krankheitstest, zweiter Durchlauf (alle 28 Rassen, 4 Spieler)
Ziel: Vergleich **erste Studie (v531)** mit **neuer Studie (v534)** und Bewertung (zu viel Pflegearbeit? Häufigkeit/Schwere/Verlauf/Behandlung realistisch?).

**Erste Studie (Grunddaten im Repo):** `studie-daten/erste-studie-v531/` (je Rasse `<rasse>.json`, `_alle.json`, `_tabelle.md`). Spieler 1/2/3 mit den damaligen Definitionen: Spieler 1 schlecht (Futter .85/Wasser .65–.7 im ersten Test, kein Tierarzt unter Grad 4, Boxenruhe blieb stehen), Spieler 2 mittel (Tierarzt .4/Tag), Spieler 3 gut. Ergebnis und Bewertung: `STUDIE-GESUNDHEIT.md`.

**Neue Definitionen (v534):** siehe `tests/gesundheit-studie.js` (`STUFEN`) und `STUDIE-GESUNDHEIT.md`:
- 3 gut: alles 100 %, Tierarzt am selben Tag, Vorsorge pünktlich, Klinik ja.
- 2 mittel: Tierarzt .6/Tag (= 1–2 Tage), sonst wie vorher (Dome: bleibt so).
- 1 schlecht: Futter/Wasser .85, Tierarzt erst ab Grad 4, Klinik für 50 % der Pferde, Boxenruhe endet.
- 4 selbst: wie 3, behandelt die ersten 2 Tage mit freien Mitteln selbst, Tierarzt nach Misserfolg oder ab Grad 3.

**Befehle** (je Rasse ~40 s je Stufe-Paar; im Hintergrund laufen lassen, mit Monitor beobachten):
```
mkdir -p $SCRATCH/studie6
for r in <alle 28 Rassen>; do STUFEN=3,2,1,4 NODE_PATH=/opt/node22/lib/node_modules node tests/gesundheit-studie.js $SCRATCH/studie6 $r; done
node tests/gesundheit-auswertung.js $SCRATCH/studie6      # Text
node tests/gesundheit-auswertung.js $SCRATCH/studie6 --json > $SCRATCH/neu.json
node tests/gesundheit-auswertung.js studie-daten/erste-studie-v531 --json > $SCRATCH/alt.json
```
Rassen: andalusier angloaraber appaloosa araber barockpinto clydesdale dales fell fjord friese haflinger hannoveraner isi knabstrupper lewitzer lipizzaner marwari noriker paint quarter shagya shetty shire tekke tinker trakehner vollblut welshcob.
(Hinweis: `gesundheit-auswertung.js` druckt Stufen 3,2,1 – Stufe 4 in der Textausgabe ergänzen: `[3,2,1,4]`.)

**Ergebnis:** Vergleichstabelle alt/neu je Stufe (Befunde/PJ, krank-%, Ø Grad, schwer-%, Heilung, Tod-%, Tierarzt/PJ, Kosten, Arbeit) + Bewertung „wie in echt?“ + Auffälligkeiten (Rassen, Alter) in `STUDIE-GESUNDHEIT.md` nachtragen, Ergebnisse (JSON) nach `studie-daten/zweite-studie-v5xx/`.
Nicht eigenmächtig Mechanik ändern – Auffälliges nummeriert an Dome melden.

## B) Zuchttest (danach, alle Rassen)
Plan in `STUDIE-GESUNDHEIT.md` (Abschnitt Zucht): je Rasse 10 Zuchtstuten + Hengst/Deckstation, 3–5 Jahre, gute Pflege. Messen: Trächtigkeitsrate (echt ca. 60–70 %/Saison), Fohlen je Stute, Geburtsprobleme, Erbkrankheiten mit/ohne Gentest, Fohlenkrankheiten/-verluste bis Absetzen (echt ca. 5–10 %), Waisen. Vergleich mit echten Werten, Bericht an Dome. Skript neu (`tests/zucht-studie.js`) auf Basis von `gesundheit-studie.js`.

## Offen daneben
Domes Abnahme S1–S4/Bewegung/Aufnahmen/Speichern&Laden; Handy-Test Dateiname ohne Umlaute; Araber-Zuchtrichtungen (LFS); Inkscape-Liste; Hautpilz an der Mähne ohne eigene Regel; Selbstbehandler kann ohne Rezeptmittel Kolik/Hufrehe/Sehne nicht behandeln.
