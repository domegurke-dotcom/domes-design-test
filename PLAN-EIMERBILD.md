# PLAN-EIMERBILD – Futtereimer von oben zeigen (Dome, 2.11.2026)

**Status: nur geplant, nichts im Spiel gebaut.** Entschieden mit Dome am 2.11.2026. Baut auf den Blender-Modellen in `blender/` auf (`eimer-fuellung.py`, `eimer-stufe1-12l.blend`, `eimer-stufe2-12l.blend`, `FUELLMENGEN.md`).

## Ziel
Das Spiel ist 2D, die Eimer stehen im Stallbild von der Seite – die Füllung liegt hinter der Wand und ist unsichtbar. Eine kleine **Draufsicht von oben** zeigt die echte Menge und gibt dem 2D-Spiel Tiefe. Die Füllung wird **nicht** immer „voll“ gezeichnet (Dome: immer wie in echt, die Menge kommt aus dem Futterplan).

## Festgelegt (Dome)
- Der Eimer zeigt die **Tagesmenge** aus dem Futterplan (nicht die Menge je Mahlzeit). Übersteigt sie 12 Liter, wird nur bis 12 Liter gefüllt (Füllgrenze), nie darüber.
- Füllung immer **eben** (kein Berg), nie über der Füllgrenze, nie durch die Wand.
- Einstreu (Ebene 2) geht nicht in den Eimer; beim Heuhaufen darf sie hinein (`freihalten` in `strohlib.py`).
- Heuhaufen richtet sich ebenfalls nach der Tagesmenge (`Skala = Kubikwurzel(kg / 60 / 0,025)`).

## Umsetzung in Etappen
- **E1 Bilder aus Blender:** Skript `blender/eimerbilder-bauen.py` (neu): für jeden Eimer (Stufe 1 rund/Hafer, Stufe 2 halbrund/Müsli, später weitere Sorten und Mischungen) je einen Füllstand rendern – Draufsicht schräg von oben (wie `eimer-nah.png`), transparenter Hintergrund, Workbench-Stil wie das Spiel (schwarze Kontur). Füllstände: leer, 1, 2, 3, 4, 6, 9, 12 Liter (das Spiel nimmt den nächsten). Ausgabe als PNG/WebP in einen Ordner `eimerbilder/` (klein halten, Größe 160–240 px, Dome entscheidet die Größe).
- **E2 Eimer-Fenster im Spiel:** Eimer im Stallbild antippen (und im Füttern-Fenster) → kleines Rundbild + Text „2 kg Hafer · 4 von 12 Litern“. Das Bild wählt `eimerBild(sorte, liter)` über die Tabelle `LITER_JE_KG` (Hafer 0,5 kg/l, Müsli 0,4, Mineral 0,65, Rübenschnitzel 0,25 – steht in `FUELLMENGEN.md`).
- **E3 Stallbild:** Der Eimer zeigt nur Zustand **leer** oder **gefüllt** (ein paar Körner am Rand oder ein kurzer Streifen) – keine echte Menge, damit der Berg-Eindruck nie entsteht.
- **E4 Futterplan:** Neben der Menge steht dasselbe Rundbild, damit man beim Einstellen sieht, wie voll der Eimer wird.
- **E5 Hinweis/Stufen/Enzyklopädie/Tutorial:** Neue Funktion bekommt einen Eintrag in `HINWEISE` und `ERFAHRUNG_STUFEN`/`frei()` (ab Anfänger sichtbar, weil es nur anzeigt), Einsteiger-Wissen „Futtereimer“, ein Satz im Tutorial „Richtig füttern“.
- **Tests:** kleiner Test `tests/eimerbild-test.js` (richtiger Füllstand je Menge, Deckel bei 12 Litern, Bild vorhanden, Fenster schließt, Rücksprung zur Box).

## Offene Fragen an Dome (vor E1/E2)
1. **Mischfutter:** Der Futterplan mischt mehrere Sorten (Hafer, Luzerne, Rübenschnitzel, Öl, Mineral). Ein Eimerbild je Mischung ist zu viel. Vorschlag: eine **Hauptsorte** (größte Menge) bestimmt das Bild, bei Mischungen gemischte Körner (`blender/eimer-mischungen.blend` von Pro nutzen).
2. **Eimer je Boxstufe:** Welcher Eimer gehört zu Box Stufe 2 und 3 (heute gibt es die zwei Modelle Stufe 1 rund und Stufe 2 halbrund)? Stufe 3?
3. **Größe/Format** des Rundbilds und ob es in der Box als kleine Blase oder als Fenster erscheint.
4. **Heu:** Soll der Heuhaufen im Stallbild ebenfalls nach der Tagesmenge wachsen (Skala 1,0 bis ~2,4)? Die Zeichnung des Haufens im 2D-Spiel (`raufutterBild`) müsste dafür Stufen bekommen.
5. **Futterplan an echte Werte:** Vorher klären (Frage an Dome vom 2.11.): Heu 6 → 7 MJ/kg, Öl 30 → 35 MJ/kg, leichtfuttrige Rassen (Friese, Quarter, Paint, Appaloosa). Die Mengen im Bild folgen dem Futterplan, der Plan sollte vorher stimmen.

## Dateien
`blender/eimer-fuellung.py` (Füllung, Parameter `EIMER`, `FUTTER`, `KG`), `blender/eimer-stufe1-12l.blend`, `blender/eimer-stufe2-12l.blend`, `blender/FUELLMENGEN.md` (Tabellen, Dichten, Entscheidungen), `blender/strohlib.py` (`freihalten`), `blender/boxboeden-stroh.blend` und `blender/strohboxenboden-<a–e>-<Maß>.blend` (Einstreu je Boxgröße), `blender/BOXMASSE.md`.
