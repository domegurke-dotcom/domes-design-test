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

- **E6 Heunetz (Dome 2.11.):** Auch das Heunetz (Box Stufe 3, `HEUNETZ_SPAR` 0,9, Modell `blender/heunetz.blend` von Pro) zeigt die Tagesmenge Heu: das Netz ist je nach Menge dünn, halb oder prall gefüllt, und über seiner Fassung (Vorschlag: Netz fasst etwa 8 kg) bleibt es prall. Gleiche Regel wie beim Heuhaufen (`Skala = Kubikwurzel(kg / 60 / 0,025)`, Heu 60 kg/m³). Dazu ein Blender-Skript wie `heuhaufen-nur-heu.py` für das Netz und Stufenbilder (z. B. 2, 4, 6, 8 kg). Hängt am Futterplan-Heu (siehe Frage 5): je mehr echtes Heu der Plan vorsieht, desto voller das Netz.

## Antworten von Dome (2.11.2026, alle fünf Fragen entschieden)
1. **Mischfutter:** nach Vorschlag – die Hauptsorte (größte Menge) bestimmt das Bild, bei Mischungen gemischte Körner (`eimer-mischungen.blend`).
2. **Eimer je Boxstufe:** der Eimer, der der jeweiligen Box zugeteilt ist (das Spiel nimmt das Modell, das die Boxstufe ohnehin zeigt).
3. **Anzeige:** als **Blase**, gut erkennbar; sie darf kurzzeitig das Pferd verdecken.
4. **Heuhaufen** wächst im Stallbild nach der Tagesmenge: **ja**.
5. **Heunetz-Fassung:** nach Vorschlag (8 kg, darüber prall; bei weniger schlaff bzw. halb leer); Boxstufe 1 und 2 ohne Netz: der Heuhaufen zeigt die Menge.
6. **Futterplan an echte Werte:** **ja** – siehe unten, Teil davon ist schon umgesetzt (v940).

**Wichtig (Dome 2.11.): Die Etappen E1–E6 für den Ein- bzw. Umbau ins Spiel werden NICHT gestartet, erst wenn wir die 3D-Eimer usw. ins Spiel nehmen.**

## Futterplan an echte Werte (v940, Dome 2.11.: ja)
Umgesetzt: Heu 6 → 7 MJ/kg (auch staubiges Heu), Heulage 7 → 8, Heucobs 7 → 8, Luzerne 8 → 9 (alle Raufutter gleich +1, Stroh bleibt 5), Öl 30 → 35 MJ/kg; `tagesRationStandard` rechnet mit `FUTTER.heu.e`. Folge: Arbeitspferde bekommen weniger Heu (Friese leichte Arbeit etwa 10,9 statt 12,7 kg) und mehr Kraftfutter, wenn die Energie nicht reicht.
**Noch nicht umgesetzt (Rückfrage nötig):** Friese, Quarter, Paint, Appaloosa als „leichtfuttrig“ – die Liste `LEICHTFUTTRIG` steuert auch die Hufrehe-Warnung im Frühling (`reheGefaehrdet`), diese Rassen dürften dann im Frühling nicht mehr auf die Weide. Das ist eine große Spielfolge.

## Dateien
`blender/eimer-fuellung.py` (Füllung, Parameter `EIMER`, `FUTTER`, `KG`), `blender/eimer-stufe1-12l.blend`, `blender/eimer-stufe2-12l.blend`, `blender/FUELLMENGEN.md` (Tabellen, Dichten, Entscheidungen), `blender/strohlib.py` (`freihalten`), `blender/boxboeden-stroh.blend` und `blender/strohboxenboden-<a–e>-<Maß>.blend` (Einstreu je Boxgröße), `blender/BOXMASSE.md`.
