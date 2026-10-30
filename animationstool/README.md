# Animationstool (Dome + Claude Team, Start 31.10.2026)

2D-Werkzeug für Bewegungsabläufe der Spielpferde, **nur für den PC** (Maus und Tastatur). Öffnen: `animationstool/index.html` im Browser (lokal per Doppelklick oder über GitHub Pages unter `…/animationstool/`). Lädt `../pferd.js` und `../kopfneu.js` – das Pferd im Hintergrund ist dieselbe Zeichnung wie im Spiel. Das Spiel selbst ändert sich dadurch nicht.

## Was es kann (Stand 31.10.)
- **Strichfigur** auf dem Spielpferd: Widerrist, Kruppe, Genick, Nase, Schweif; je Vorderbein Buggelenk, Ellbogen, Vorderfußwurzel, Fesselkopf, Huf; je Hinterbein Hüftgelenk, Knie, Sprunggelenk, Fesselkopf, Huf. Gelenke mit der Maus ziehen; „Knochenlänge halten“ dreht das Gelenk samt allem darunter um sein Elterngelenk, der Widerrist verschiebt das ganze Pferd.
- **Keyframes:** Ziehen zwischen zwei Keyframes legt automatisch einen neuen an. Dazwischen wird über die Winkel der Knochen gerechnet (Knochen bleiben gleich lang).
- **Vorlagen** Schritt, Trab, Galopp (Rechts-/Linksgalopp) aus der Fußfolge der PDFs (horsesandus): Stützfolge Schritt 3:2:3:2, Trab 2:0:2:0, Galopp 1:3:2:3:1:0, Takt-Reihenfolge wie im PDF. Schulterblatt und Becken schwingen mit (`MITSCHWINGEN`).
- **Gangbild:** Stützphase je Bein als Balken (Farben wie in den PDF-Bildern: hinten links rot, vorne links grün, hinten rechts blau, vorne rechts orange), Hufe am Boden je Zeitpunkt, Vergleich mit der Stützfolge aus dem PDF (✓/✗), Takte.
- **Jetzt-Anzeige:** Ein-/Zwei-/Dreibeinstütze, Schwebephase; je Bein „fußt auf / belastet / fußt ab / Schwebe“.
- **Hufspuren von oben** (links oben, rechts unten) mit Schrittlänge und Übertreten in cm (cm aus dem mittleren Stockmaß der Rasse).
- **Vorlagebild** (z. B. aus `pdfs/Bilder`) unter die Bühne legen, verschieben, Mausrad = Größe, spiegeln, Deckkraft.
- **Rasse wechseln** überträgt die Bewegung (gleiche Winkel, Knochen im Verhältnis; Hufe am Boden bleiben am Boden).
- **Speichern:** automatisch im Browser (`localStorage["animationstool-v1"]`), als Datei (`.json`, `typ: zuchtstall-animation`), Datei laden. Koordinaten wie `pferd.js` (Pferd schaut nach links, Boden y = 0, oben negativ).
- Tasten: Leertaste, ← →, `,` `.`, K, Entf, Strg+Z/C/V.

## Grenzen / offen
- Die Vorlagen-Schritte sind kürzer als in echt (Schritt ca. 106 cm statt 160–180 cm, Trab ca. 165 cm, Galopp ca. 189 cm beim Hannoveraner), und im Schritt landet der Hinterhuf ca. 30 cm hinter dem Vorderhuf statt in oder vor seiner Spur. Grund: am Ende der Stützphase muss das Bein gestreckt den Boden erreichen; Abrollen über die Zehe, Durchtreten der Fessel und stärkeres Mitschwingen von Schulter/Becken fehlen noch. Von Hand je Keyframe korrigierbar.
- Noch keine Tölt-, Pass-, Running-Walk-Vorlagen (Bilder dafür liegen in `pdfs/Bilder`).
- Die Bewegung wird noch nicht im Spiel benutzt; das Spielpferd im Hintergrund bewegt sich nicht mit.

## Test
`tests/animationstool-test.js <Scratchpad-Ordner>` (Windows-PC: Startbefehl wie in `CLAUDE.md`, Abschnitt „Testen“) – Stützfolgen aller Vorlagen, Ziehen, Rückgängig, Abspielen, Speichern/Laden, Rassenwechsel, Vorlagebild, Neuladen (17 Prüfungen).
