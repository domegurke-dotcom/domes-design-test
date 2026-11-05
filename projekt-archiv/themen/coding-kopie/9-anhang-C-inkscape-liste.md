> **An Coding:** Anhang C zum Auftrag „Karte Merkmale“ (Thema 6). **Abschnitt 1** unten ans Ende von `BEI-INKSCAPE-BEARBEITEN.md` anhängen (Domes Zeichenliste, Überschrift „Neu für die Karte Merkmale (Thema 6)“). **Abschnitt 2** ist ein Vorschlag, wie ihr euch beide die Arbeit erleichtert; prüft beim Start, was in eurer Umgebung geht, und tragt das Ergebnis in `CLAUDE.md` ein.

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
