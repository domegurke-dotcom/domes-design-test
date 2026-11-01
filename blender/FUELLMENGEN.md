# Füllmengen: Heuhaufen und Futtereimer nach Menge (Dome, 1.11.2026)

**Vorgabe von Dome (für das Spiel wichtig):** Der Heuhaufen muss sich in der Größe nach der im Futterplan eingestellten Tagesmenge richten. Ebenso die Füllung der Eimer (Füllvolumen). Beide Futtereimer fassen bis zur **Füllgrenze genau 12 Liter**. Die Füllung ist immer **eben** (nie ein Berg) und nie über der Füllgrenze.

Maßstab: 1 Modelleinheit = 0,79 cm, also 1 Einheit³ = 0,000493 Liter. Alle Zahlen sind Schätzungen von Claude, die Schüttdichten stammen aus üblichen Werten.

**Entscheidung Dome 2.11.:** Heuhaufen **und** Eimer zeigen die **Tagesmenge** aus dem Futterplan. Übersteigt die Tagesmenge das Volumen des Eimers (12 Liter), wird optisch nur bis 12 Liter gefüllt. Beispiel Friese (8 Jahre, fit, 600 kg): Heu 10 kg (Skala 1,88), Hafer 2 kg = 4 Liter. Fläche A (3 × 3 m) mit Eimer und Heuhaufen: Position Eimer (620, 100), Heu (800, −40).

## Heuhaufen (Raufutter, `blender/heuhaufen-nur-heu.py`)

- Originalhaufen von Pro (`heunetz.blend`, `heuhaufen_koerper`): Volumen **0,0250 m³ = 25 Liter**, etwa 100 Einheiten (79 cm) breit und 32 hoch.
- Dichte lose geschüttetes Heu: **60 kg/m³** (Spanne 40–80). Damit sind 25 Liter etwa **1,5 kg**.
- Größe: `skala = Kubikwurzel(kg / 60 / 0,0250)`, gleichmäßig in x, y und z (bleibt dieselbe Form, Halme wachsen mit).

| Tagesmenge Heu | Volumen | Skala |
|---|---|---|
| 1,5 kg | 25 l | 1,00 |
| 5 kg | 83 l | 1,49 |
| 8 kg | 133 l | 1,75 |
| 10 kg | 167 l | 1,88 |
| 12 kg | 200 l | 2,00 |
| 15 kg | 250 l | 2,15 |
| 20 kg | 333 l | 2,37 |
| 40,5 kg | 675 l | 3,00 (Domes Wunschgröße, „dreimal so groß“) |

- JavaScript fürs Spiel: `const skala = Math.cbrt(kg / 60 / 0.025);`
- Der Haufen liegt auf **Ebene 1** der Einstreu (Grundhöhe z = 2,0).
- **Offen (Frage an Dome):** Soll „dreimal so groß“ die Größe für die normale Tagesration sein? Bei echter Dichte entspricht das etwa 40 kg, eine echte Tagesration von 10 kg gibt Skala 1,9.

## Futtereimer (`blender/eimer-fuellung.py`)

- **Fehler gefunden und behoben (Dome 2.11.):** Eimer Stufe 1 hatte eine dunkle Innenscheibe (Material „innen“) knapp unter dem Rand (z = 22). Sie verdeckte jede Füllung darunter, also alles unter etwa 10 Litern Hafer – nur ein fast voller Eimer war sichtbar. Die Scheibe liegt jetzt auf dem Eimerboden (z = 0,9, Skala 0,8). Eimer Stufe 2 hat keine solche Scheibe (geprüft mit 1,5 kg Müsli von oben).

- **Prüfung (Dome 2.11.):** Futter durch die Wand wird jetzt mit Strahlen vom Innenraum gegen die echte Eimerwand geprüft (alle Eckpunkte der Füllung samt Kontur). Ergebnis: kein Punkt über der Wand (größter Überstand −0,02 Stufe 1, −0,1 Stufe 2). Früher war das Wandprofil von Stufe 2 aus Eckpunkten geschätzt und viel zu weit (24,8 statt 20,5 bei z = 32).
- Füllgrenze (Dome 1.11.: Pros Wasserlinie 25,4 / 31,4 als Ausgangspunkt, dann „Stufe 1 etwas niedriger, Stufe 2 etwas höher“): Eimer Stufe 1 bei **z = 24,0**, Eimer Stufe 2 bei **z = 34,4** (erst 31,4, dann 33,0, Dome: noch etwas höher) (jeweils im unskalierten Modell, gleichmäßig mit dem Eimer skaliert). Die Werte stehen in `FUELLGRENZE_Z` in `eimer-fuellung.py` und lassen sich dort nachziehen.
- Damit sie bei **12 Litern** liegt, sind die Eimer skaliert: **Stufe 1 × 1,126** (Höhe 32,4 Einheiten ≈ 25,6 cm), **Stufe 2 × 0,951**. Der unskalierte Eimer fasste bis zu diesen Linien 8,4 l (Stufe 1) und 14,0 l (Stufe 2).
- Eimer Stufe 1 (rund): innen 13,5 Einheiten Radius am Boden bis 18,0 am Rand; Stufe 2 (halbrund, Rückseite gerade): Halbachse x 18,5 (unten) bis 20,7 (z = 34) und Tiefe 27,4 bis 30,7, Rückwand bei y = −1,0 (Messwerte mit Strahlen gegen das Modell, Tabelle `A2`/`B2`/`BK` in `eimer-fuellung.py`).
- Schüttdichte kg je Liter: **Hafer 0,50**, **Müsli 0,40**, **Mineralfutter 0,65**, **Rübenschnitzel 0,25**.
- Höchstmenge (12 Liter): Hafer 6,0 kg, Müsli 4,8 kg, Mineral 7,8 kg, Rübenschnitzel 3,0 kg.
- Füllhöhe (im unskalierten Modell, z von unten) je Liter:

| Liter | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 |
|---|---|---|---|---|---|---|---|---|---|
| Eimer Stufe 1 | 3,3 | 5,6 | 7,8 | 9,9 | 11,9 | 13,8 | 17,5 | 20,9 | 24,0 |
| Eimer Stufe 2 | 4,1 | 7,2 | 10,2 | 13,1 | 16,0 | 18,8 | 24,2 | 29,4 | 34,4 |

- Liter = Menge in kg ÷ Schüttdichte. Über 12 Liter bleibt die Füllung an der Füllgrenze.
- Die obersten Körner ragen etwa 1,2 Einheiten über die Oberfläche; das Skript senkt die Oberfläche entsprechend ab, damit sie genau an der Füllgrenze enden.
- **Menge je Mahlzeit oder Tagesmenge?** Das Spiel begrenzt Kraftfutter **je Mahlzeit** auf 0,5 % des Körpergewichts (`kraftMahl = Gewicht × 0,005`; 600 kg → 3 kg, 900 kg Kaltblut → 4,5 kg) und verteilt die Tagesmenge auf 2 oder 3 Mahlzeiten. **Je Mahlzeit** passt es fast immer in 12 Liter (Hafer 4,5 kg = 9 l, Müsli 4,5 kg = 11 l). Nur eingeweichtes Futter (Rübenschnitzel, Heucobs) könnte darüber kommen. Die **Tagesmenge** kann dagegen über 12 Liter gehen (600 kg, 3 Mahlzeiten, bis 9 kg Hafer = 18 l). **Entscheidung Dome 2.11.: Eimer zeigt die Tagesmenge**, bei mehr als 12 Litern bleibt die Füllung an der Füllgrenze.

## Einstreu Ebene 2 und andere Objekte (Dome 2.11.)

Stroh geht **nie in andere Objekte hinein, nur bis ran** (Eimer, später Leckstein, Heunetz …). **Ausnahme Heuhaufen (Dome 2.11.): dort darf die Ebene 2 hinein.** Umsetzung: `freihalten(stroh_objekte, hindernisse, rand)` in `blender/strohlib.py` – löscht alle Strohflächen der Ebene 2 (Haufenkörper und Halme), die mit einem Punkt im Umriss (Draufsicht, +1,5 Einheiten) eines Hindernisses liegen. Wird nach dem Aufstellen von Eimer, Heu usw. aufgerufen; bei Fläche A im Fenster nur mit Eimer 1 geschehen (1.154 Flächen entfernt). Ebene 1 (flacher Boden) bleibt unter dem Eimer, weil er darauf steht.

## Einstreu am nächsten Morgen (Dome 2.11.)

Das Stroh Ebene 2 wird über Nacht **platter**: die Haufen, die frisch auf 18 cm waren (ein Drittel), gehen auf **5 cm** zurück (Skala z = 5/18; erst 14 cm, dann Dome: 5 cm). Dazu liegen Pferdeäpfel (`pferdeaepfel-bauen.py`). Frisch eingestreut: Bedeckung mindestens 90 %, Haufen 18/14/10 cm.

## Strohhaufen (Einstreu Ebene 2, `blender/einstreu-stroh-bauen.py`)

- **84 Haufen** (Dome 2.11.): je ein Drittel auf **18 cm** (22,8 Einheiten, die größeren Haufen), **14 cm** (17,7) und **10 cm** (12,7, die kleineren), je 28 Haufen. Zustand in `einstreu-haufen-zustand.json`.
- Maximalhöhe jetzt **18 cm** (22,8 Einheiten). Die frühere Grenze 2/3 der Eimerhöhe (21,6) gilt nicht mehr.

## Wie beides im Blender-Fenster läuft

Alle drei Skripte laufen im offenen Blender-Fenster über `node werkzeuge/blender-senden.js <datei.py>`. Vor dem Lauf werden die Parameter gesetzt:
- Heu: `TAGESMENGE_KG = 10` (oder `SKALA = 3.0`), optional `POS`.
- Füllung: `EIMER = "stufe1"` oder `"stufe2"`, `FUTTER = "hafer" | "muesli" | "mineral" | "ruebe"`, `KG = …`, `PARENT = "futtereimer_hafer"` oder `"futtereimer_stufe2"`. Mit `NUR_TABELLE = True` kommt nur die Tabelle zurück.
