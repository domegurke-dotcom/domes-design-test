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

- **Innenwand Stufe 2 (Dome 2.11.):** bei z = 34 verengt sich die Wand um 1,4 (Wulst unter dem Rand), dort ragte Futter durch; das Profil in `eimer-fuellung.py` kennt das jetzt (größter Überstand −0,34, also innen).
- Füllgrenze (Dome 1.11.: Pros Wasserlinie 25,4 / 31,4 als Ausgangspunkt, dann „Stufe 1 etwas niedriger, Stufe 2 etwas höher“): Eimer Stufe 1 bei **z = 24,0**, Eimer Stufe 2 bei **z = 34,4** (erst 31,4, dann 33,0, Dome: noch etwas höher) (jeweils im unskalierten Modell, gleichmäßig mit dem Eimer skaliert). Die Werte stehen in `FUELLGRENZE_Z` in `eimer-fuellung.py` und lassen sich dort nachziehen.
- Damit sie bei **12 Litern** liegt, sind die Eimer skaliert: **Stufe 1 × 1,126** (Höhe 32,4 Einheiten ≈ 25,6 cm), **Stufe 2 × 0,879**. Der unskalierte Eimer fasste bis zu diesen Linien 8,4 l (Stufe 1) und 17,7 l (Stufe 2).
- Eimer Stufe 1 (rund): innen 13,5 Einheiten Radius am Boden bis 18,0 am Rand; Stufe 2 (halbrund, Rückseite gerade): Halbachse x 18,4 bis 24,8 und Tiefe 27,2 bis 34,8.
- Schüttdichte kg je Liter: **Hafer 0,50**, **Müsli 0,40**, **Mineralfutter 0,65**, **Rübenschnitzel 0,25**.
- Höchstmenge (12 Liter): Hafer 6,0 kg, Müsli 4,8 kg, Mineral 7,8 kg, Rübenschnitzel 3,0 kg.
- Füllhöhe (im unskalierten Modell, z von unten) je Liter:

| Liter | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 |
|---|---|---|---|---|---|---|---|---|---|
| Eimer Stufe 1 | 3,3 | 5,6 | 7,8 | 9,9 | 11,9 | 13,8 | 17,5 | 20,9 | 24,0 |
| Eimer Stufe 2 | 4,7 | 8,1 | 11,3 | 14,4 | 17,3 | 20,0 | 25,1 | 29,9 | 34,4 |

- Liter = Menge in kg ÷ Schüttdichte. Über 12 Liter bleibt die Füllung an der Füllgrenze.
- Die obersten Körner ragen etwa 1,2 Einheiten über die Oberfläche; das Skript senkt die Oberfläche entsprechend ab, damit sie genau an der Füllgrenze enden.
- **Menge je Mahlzeit oder Tagesmenge?** Das Spiel begrenzt Kraftfutter **je Mahlzeit** auf 0,5 % des Körpergewichts (`kraftMahl = Gewicht × 0,005`; 600 kg → 3 kg, 900 kg Kaltblut → 4,5 kg) und verteilt die Tagesmenge auf 2 oder 3 Mahlzeiten. **Je Mahlzeit** passt es fast immer in 12 Liter (Hafer 4,5 kg = 9 l, Müsli 4,5 kg = 11 l). Nur eingeweichtes Futter (Rübenschnitzel, Heucobs) könnte darüber kommen. Die **Tagesmenge** kann dagegen über 12 Liter gehen (600 kg, 3 Mahlzeiten, bis 9 kg Hafer = 18 l). **Empfehlung: Eimer zeigt die Menge je Mahlzeit**, bei mehr als 12 Litern bleibt die Füllung an der Füllgrenze.

## Strohhaufen (Einstreu Ebene 2, `blender/einstreu-stroh-bauen.py`)

- **84 Haufen**, etwa 1/3 (18 von ihnen) auf **Maximalhöhe** und **9 Haufen (1/9) auf 20 cm = 25,3 Einheiten** (Dome 2.11.; das liegt über der Grenze, die übrigen bleiben darunter). Zustand in `einstreu-haufen-zustand.json`.
- Sonst höchstens **2/3 der Höhe von Eimer Stufe 1**: Eimer 28,8 × 1,126 = 32,4 Einheiten hoch, also höchstens 21,6. Der höchste Haufen ist 19,2 hoch.

## Wie beides im Blender-Fenster läuft

Alle drei Skripte laufen im offenen Blender-Fenster über `node werkzeuge/blender-senden.js <datei.py>`. Vor dem Lauf werden die Parameter gesetzt:
- Heu: `TAGESMENGE_KG = 10` (oder `SKALA = 3.0`), optional `POS`.
- Füllung: `EIMER = "stufe1"` oder `"stufe2"`, `FUTTER = "hafer" | "muesli" | "mineral" | "ruebe"`, `KG = …`, `PARENT = "futtereimer_hafer"` oder `"futtereimer_stufe2"`. Mit `NUR_TABELLE = True` kommt nur die Tabelle zurück.
