# Füllmengen: Heuhaufen und Futtereimer nach Menge (Dome, 1.11.2026)

**Vorgabe von Dome (für das Spiel wichtig):** Der Heuhaufen muss sich in der Größe nach der im Futterplan eingestellten Tagesmenge richten. Ebenso die Füllung der Eimer (Füllvolumen). Beide Futtereimer fassen bis zur **Füllgrenze genau 12 Liter**. Die Füllung ist immer **eben** (nie ein Berg) und nie über der Füllgrenze.

Maßstab: 1 Modelleinheit = 0,79 cm, also 1 Einheit³ = 0,000493 Liter. Alle Zahlen sind Schätzungen von Claude, die Schüttdichten stammen aus üblichen Werten.

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

- Füllgrenze = Wasserlinie in Pros Modellen (Dome hatte sie früher festgelegt): Eimer Stufe 1 bei z = 25,4, Eimer Stufe 2 bei z = 31,4 (jeweils im unskalierten Modell, gleichmäßig mit dem Eimer skaliert).
- Damit sie bei **12 Litern** liegt, sind die Eimer skaliert: **Stufe 1 × 1,097**, **Stufe 2 × 0,913**. Der leere, unskalierte Eimer fasste bis dorthin 9,8 l (Stufe 1) und 14,2 l (Stufe 2).
- Eimer Stufe 1 (rund): innen 13,5 Einheiten Radius am Boden bis 18,0 am Rand; Stufe 2 (halbrund, Rückseite gerade): Halbachse x 18,4 bis 24,8 und Tiefe 27,2 bis 34,8.
- Schüttdichte kg je Liter: **Hafer 0,50**, **Müsli 0,40**, **Mineralfutter 0,65**, **Rübenschnitzel 0,25**.
- Höchstmenge (12 Liter): Hafer 6,0 kg, Müsli 4,8 kg, Mineral 7,8 kg, Rübenschnitzel 3,0 kg.
- Füllhöhe (im unskalierten Modell, z von unten) je Liter:

| Liter | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 |
|---|---|---|---|---|---|---|---|---|---|
| Eimer Stufe 1 | 3,5 | 5,9 | 8,3 | 10,5 | 12,7 | 14,7 | 18,6 | 22,2 | 25,4 |
| Eimer Stufe 2 | 4,3 | 7,4 | 10,3 | 13,1 | 15,7 | 18,2 | 23,0 | 27,3 | 31,4 |

- Liter = Menge in kg ÷ Schüttdichte. Über 12 Liter bleibt die Füllung an der Füllgrenze.
- Die obersten Körner ragen etwa 1,2 Einheiten über die Oberfläche; das Skript senkt die Oberfläche entsprechend ab, damit sie genau an der Füllgrenze enden.
- **Offen (Frage an Dome):** Zeigt der Eimer die Menge **je Mahlzeit** (so wird die Krippe ja bei jeder Fütterung neu gefüllt) oder die Tagesmenge? Ist die Menge je Mahlzeit gemeint, rechnet das Spiel kg je Mahlzeit.

## Strohhaufen (Einstreu Ebene 2, `blender/einstreu-stroh-bauen.py`)

- Höchstens **2/3 der Höhe von Eimer Stufe 1**: Eimer 28,8 × 1,097 = 31,6 Einheiten hoch, also höchstens 21,1. Der höchste Haufen ist 18,8 hoch.

## Wie beides im Blender-Fenster läuft

Alle drei Skripte laufen im offenen Blender-Fenster über `node werkzeuge/blender-senden.js <datei.py>`. Vor dem Lauf werden die Parameter gesetzt:
- Heu: `TAGESMENGE_KG = 10` (oder `SKALA = 3.0`), optional `POS`.
- Füllung: `EIMER = "stufe1"` oder `"stufe2"`, `FUTTER = "hafer" | "muesli" | "mineral" | "ruebe"`, `KG = …`, `PARENT = "futtereimer_hafer"` oder `"futtereimer_stufe2"`. Mit `NUR_TABELLE = True` kommt nur die Tabelle zurück.
