# PLAN-HOFPLAN – Hof wirklich planen (Raster, Platzieren, Bauen im Plan)

Stand 24.10.2026 – von Dome beschrieben und beantwortet (Thema 25 in `PROJEKT-CHAT-THEMEN.md`). **Dome 24.10. nachts: „Ja für alle Etappen“ – Fragen sammeln (OFFENE-FRAGEN.md), am Ende gesammelt an Dome.** Fortschritt: **H1 fertig (v752)**.

## Idee in einem Satz
In hvw → Hof → Hofplan wird der Hof auf einem Raster selbst geplant (Gebäude und Anlagen ziehen, drehen, anbauen, ausbauen, abreißen); in Box → Ort zeigt dieselbe Zeichnung die Anlage, und man tippt dort das Ziel an (Reitplatz → Training, Parkplatz → Pferdeanhänger …).

## Grundstück und Raster
- Bauland = **Rechteck, breiter als hoch**, mit 1×1-Raster. **1 Kachel = 5 × 5 m** (25 m²). **Start 0,5 ha** = 20 × 10 Kacheln (100 × 50 m) – **von Dome bestätigt (24.10.)**; gilt nur für **neue Spiele** (heute `bauHa: 1` + Hofplatz 0,2 ha). **Alte Spielstände behalten ihre jetzige Hektarzahl.** Rechenbeispiel: Stall 10 Boxen ≈ 300 m² (`PLATZ.stall` 0,003 ha je Box), Reitplatz 20×40 m = 32 Kacheln, Sandpaddock 400 m².
- **Unbebautes Bauland kann man wieder verkaufen** (Dome, 24.10.): wie bei Gebäuden und Anlagen – Bauland-Stück lange gedrückt halten → verschieben/umplatzieren; **einmal antippen → „Verkaufen“** (nur unbebaute Fläche; Erlös/Preis wie beim Land-Verkauf, heute 90 %, `Land einzeln verkaufen`).
- **Weiteres Bauland:** in 0,5-ha-Stücken zukaufen; beim Kauf wählt man, ob es **unten, rechts oder links** angebaut wird (das Rechteck wächst).
- **Rennbahn (2 ha) wächst durch Zukauf:** man kauft so viel Bauland dazu, bis sie passt (Raster wächst entsprechend).
- **Wege:** der freie Platz zwischen den Gebäuden ist der Weg – der Zuschlag `WEGE_ZUSCHLAG` +30 % entfällt.
- **Weiden und Wiesen** liegen **unter** dem bebaubaren Feld (nicht bebaubar, nur gezeigt); sie bekommen später vielleicht eine eigene Anpassung. Sie bleiben im Ort-Bild anklickbar.

## Gebäude und Anlagen
- Jedes Gebäude/jede Anlage hat einen **Grundriss aus Rasterfeldern im richtigen Maßstab** (Stall, Paddockboxenstall, Quarantäne, Abfohlstall, Reitplatz, Reithalle, Roundpen, Sandpaddock, Waschplatz, Solarium, Lager, Trail, Rennbahn, Parkplatz = Pferdeanhänger …) und lässt sich **drehen**.
- **Neu Gekauftes/Gebautes** (Kaufen/Beauftragen bleibt in hvw → Hof → Bauen) liegt zuerst im Feld **„zum Bauen“** neben dem Plan und wird von dort auf das Raster gesetzt.
- **Verschieben nur im Hofplan:** Gebäude gedrückt halten, dann Quadrat für Quadrat ziehen (auf dem Handy wie beim Whiteboard und beim Umstellen der Boxen – `boxZiehenInit`/`wbZiehenInit` als Vorbild; Zoom und Verschieben im Plan).
- **Gebäude antippen (nur im Hofplan)** → Auswahl **Anbauen · Ausbauen · Reparieren · Abreißen** (Abreißen: heute `ABRISS` 20 %, 2–3 Tage, Teil-Abriss in Schritten).
- **Anbau = das Gebäude wird in der Länge größer** (wie ein echter Stall, an den angebaut wird), kein Nachbargebäude. Dadurch bleibt das „Verschmelzen“ (v707) von selbst richtig. Ausbau (höhere Stufe) kann den Grundriss ebenfalls vergrößern (z. B. Reitplatz 20×40 → 20×60 → 40×80 m). Wird die Grundfläche größer, muss man gegebenenfalls umplatzieren.

## Farben beim Planen
- **Grün** = keine Überschneidung mit anderen Gebäuden/Anlagen (Platzieren/Erweiterung möglich).
- **Rot** = Überschneidung.
- **Orange** = **bestätigte Baustelle**; beim Abriss ist der **Rückbau orange, aber nur die Fläche, die wirklich abgerissen wird**.
- **Blau gibt es nicht mehr** (war zuerst für den Blueprint gedacht).
- Ablauf Anbau/Ausbau: neue Fläche wird gezeichnet (grün oder rot), man kann die anderen Gebäude noch verschieben, bis es passt, dann **Bau bestätigen** → orange (Bauzeit läuft wie bisher).

## Box → Ort
- Zeigt denselben Hofplan, **nicht veränderbar**; **Ziel antippen** (Reitplatz → Trainingsauswahl, Parkplatz → Pferdeanhänger, Waschplatz, Weide …). Nichts ziehen.
- Ändert man die Aufstellung im Hofplan, ändert sich die Ort-Darstellung.
- **Alte Spielstände:** alle Gebäude und Anlagen liegen im Feld „zum Bauen“. Man muss sie erst platzieren, bevor man die Ort-Kachel (Box → Versorgung) wieder benutzen kann – **keine automatische Aufstellung**, kein Geschenk-Bauland.

## Stufen, Tutorial, Hinweise
- **Anfänger: selber bauen, mit Anweisungen** (Tutorial-Kapitel, Hinweisblasen, Einsteiger-Wissen, Enzyklopädie). Neue Funktionen bekommen laut CLAUDE.md gleich Tipp- und Stufen-Eintrag.
- **Whiteboard gehört nicht dazu** (dort geht es um Zuteilung, nicht um Lage).

## Etappen (Vorschlag)
1. ✅ **H1 (v752) – Raster, Grundstück, Platzieren:** Plan-Daten (`hof.plan`), Rechteck 20 × 10, Feld „zum Bauen“, Ziehen/Drehen/Überschneidung (grün/rot), Maßstab aus `PLATZ`, Übernahme alter Spielstände (alles im Feld), Sperre der Ort-Kachel bis platziert.
2. **H2 – Anbauen/Ausbauen/Reparieren/Abreißen im Plan:** Auswahl beim Antippen, längeres Gebäude, Bestätigen (orange), Rückbau (orange, nur abgerissene Fläche), Verschmelzen/Teil-Umbau/Abriss an das Raster anpassen.
3. **H3 – Box → Ort aus dem Plan:** Ansicht mit antippbaren Zielen, Parkplatz = Pferdeanhänger.
4. **H4 – Bauland zukaufen:** 0,5 ha, Seite wählen (unten/rechts/links), Rennbahn über Zukauf.
5. **H5 – Anfänger, Tutorial, Hinweise, Stufen, Enzyklopädie, Tests** (inkl. Tutorial-Spieler, Handy quer/hochkant).

## Bewusst offen / beim Bau klären
- Genaue Grundrisse je Gebäude/Stufe (Kachel-Maße) und Form des Parkplatzes; Zahlen werden von Claude vorgeschlagen und genannt.
- Wie sehen Wiesen/Weiden unter dem Bauland aus (später eigene Anpassung).
