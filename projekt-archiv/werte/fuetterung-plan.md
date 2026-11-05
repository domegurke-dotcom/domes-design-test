# Fütterung – Planung mit Dome (Start 5.10.2026, 23:11)

Bestand: Füttern = Krippe voll (ein Klick), hungrig −19 Gesundheit/Nacht; Heu auf der Weide im Winter und am letzten Herbsttag. Ankerpunkte: Futter-Faktor (vorerst neutral) für Energie, Wohlbefinden, Gesundheit, Training; Kolik/Hufrehe-Risiko (Krankheiten-Plan); Futterexperte (Mitarbeiter-Plan); Bauer, Futterwiese, Heu zukaufen (Hof-Ausbau-Ideen).

## Runde 1 – Entscheidungen Dome (5.10.2026, 23:22)
Code-Stand beim Nachsehen: v182 (Coding-Sitzung setzt schon Krankheiten/Mitarbeiter um). Es gibt Körpertypen dünn/sportlich/normal/dick (pferd.js, im Test-Reiter wählbar), Ausrüstung „Futter“ (Heu, Hafer, Mineralfutter), `futterFaktor()` = 1 als Platzhalter.
1. Futterplan pro Pferd ja (Box - Pferdepflege - Versorgung - Futterplan); täglicher Fütter-Klick bleibt, Stallbursche füttert nach Plan.
2. Spezialfutter (nach OP, Krankheit, Immunschwäche usw.) kann nur ein Futterexperte zusammenstellen. Dome fragt: kommt er wie Hufschmied/Tierarzt? (Vorschlag: extern auf Termin, fest nur in großen Ställen.)
3. Detailgrad: sehr genau, mit Nährwerten.
4. Futterzustand: vorhandene Körpertypen-Darstellung nutzen.
5. Futtervorrat/Futterkammer jetzt planen; in der Ausrüstung gibt es schon Futter.
6. Korrektur: staubiges Heu → Husten nur bei anfälligen Pferden.
Offen: leicht-/schwerfuttrige Rassen (nicht beantwortet).

## Runde 2 – Entscheidungen Dome (5.10.2026, 23:31) – alles ja
1. Futterzustand 1–9 im Hintergrund, Anzeige über vorhandene Körperbilder: 1–3 dünn, 4–6 normal, 7–9 dick; „sportlich“ = Muskeln aus Training bei Futterzustand 4–6.
2. Versteckte, vererbte Veranlagung „empfindliche Atemwege“: nur diese Pferde husten von staubigem Heu; dauerhaft staubiges Heu → chronischer Husten (Pferdeasthma).
3. Futterexperte extern auf Termin (Beratung je Pferd, Rechnung), fest angestellt nur in großen Ställen. Spezialfutter nur durch ihn (nach OP/Kolik, Hufrehe, Cushing, PSSM, Magengeschwür, Senioren, Immunschwäche).
4. Nährwerte je Futtermittel: Energie, Eiweiß, Rohfaser, Zucker/Stärke, Mineralien/Vitamine. Bedarf je Pferd berechnet; Futterplan zeigt Balken „Bedarf gedeckt“; zu viel/zu wenig wirkt.
5. Futterkammer: Einkauf im Futterhandel unter Ausrüstung - Futter, täglicher Verbrauch, leerer Vorrat → Warnbrief, Pferd bekommt nichts. Größere Lager mit Hof-Ausbau.
6. Rassen leicht-/schwerfuttrig: ja (Haflinger, Fjord, Shetty, Isi, Tinker leichtfuttrig; Vollblut, Araber, Achal-Tekkiner schwerfuttrig).
7. Futterplan unter Box - Pferdepflege - Versorgung - Futterplan.

## Recherche Preise und Nährwerte (5.10.2026)
Preise (Deutschland, Stand Okt. 2026):
- Heu: Rundballen ca. 129 €/t, Quaderballen ca. 147 €/t, Kleinballen ca. 248 €/t (heupreis.de) → ca. 0,13–0,25 €/kg.
- Stroh: Kleinballen ca. 127 €/t, Rundballen ca. 164 €/t, Quader ca. 153 €/t (strohpreis.de).
- Futterkosten gesamt: ca. 80–200 € pro Pferd und Monat (pferde1.com).
- Geschätzt (nicht belegt): Heulage 0,20–0,30 €/kg, Hafer 0,40–0,60 €/kg, Müsli 1,00–1,50 €/kg, Pellets 0,60–1,00 €/kg, Mineralfutter 3–6 €/kg (50–100 g/Tag).
Nährwerte:
- Heu ca. 6 MJ ME/kg (agrobs.de). Hafer ca. 10,8–12 MJ/kg, 10–12 % Eiweiß, 40–45 % Stärke, 10–12 % Rohfaser (agrobs.de, stroeh.de).
- Geschätzt: Heu 8–10 % Eiweiß, ca. 30 % Rohfaser, ca. 10 % Zucker; Heulage ca. 7 MJ; Stroh ca. 5 MJ, 3 % Eiweiß, 40 % Rohfaser; Müsli 11–12 MJ, viel Zucker/Stärke; Luzerne 7–8 MJ, 16 % Eiweiß; Öl sehr energiereich.
Bedarf und Grenzen:
- Erhaltung 600-kg-Warmblut ca. 63 MJ ME/Tag (equine74.com), entspricht ca. 0,52 MJ × Gewicht^0,75.
- Raufutter mind. 1,5 kg je 100 kg Gewicht; Kraftfutter max. 0,3 kg je 100 kg pro Mahlzeit; Stärke max. 1 g je kg Gewicht pro Mahlzeit; Öl max. 1 g je kg/Tag (equine74.com).
- Hafer max. 0,5 kg je 100 kg/Tag, max. 2 kg pro Mahlzeit, auf 2–3 Mahlzeiten verteilen (stroeh.de).
Spiel: Kosten laufen schon pro Tag (Aufzucht 15 €, Ausbildung 35 €, Klinik 60 € pro Tag).

## Runde 3 – Entscheidungen Dome (5.10.2026, 23:39) – alles ja
1. Echte Futterpreise pro Spieltag (wie Aufzucht/Klinik pro Tag); normales Pferd ca. 2–4 €/Tag.
2. Futterplan mit 2–3 Mahlzeiten; ein Klick füttert den Tagesplan; zu viel Kraftfutter pro Mahlzeit → Kolikrisiko.
3. Futterkammer für den ganzen Hof unter Hofverwaltung - Hof - Futterkammer (Einkauf dort); Kachel Ausrüstung - Futter in der Box zeigt den Plan des Pferdes und führt zum Futterplan.

## Runde 4 – Entscheidungen Dome (5.10.2026, 23:46) – alles ja
### 1. Futtermittel im Futterhandel (Werte je kg; Preise gerundet nach Recherche oben)
| Futter | Energie MJ | Eiweiß % | Rohfaser % | Zucker/Stärke % | Preis €/kg | Hinweis |
|---|---|---|---|---|---|---|
| Heu | 6 | 9 | 30 | 10 | 0,20 | Grundfutter; Qualität gut/staubig |
| Heulage | 7 | 10 | 28 | 8 | 0,25 | staubarm, gut bei empfindlichen Atemwegen |
| Futterstroh | 5 | 3 | 40 | 2 | 0,15 | für leichtfuttrige zum Strecken |
| Heucobs | 7 | 9 | 28 | 8 | 0,60 | Senioren, Zahnprobleme (einweichen) |
| Luzerne | 8 | 16 | 25 | 5 | 0,70 | viel Eiweiß: Fohlen, Stuten, Sport |
| Rübenschnitzel | 10 | 9 | 18 | 5 | 0,90 | Energie ohne Stärke |
| Hafer | 11 | 11 | 11 | 45 | 0,50 | klassisches Kraftfutter |
| Pellets | 11 | 13 | 12 | 25 | 0,80 | ausgewogenes Kraftfutter |
| Müsli | 12 | 12 | 8 | 35 | 1,20 | lecker, viel Zucker |
| Öl | 30 | 0 | 0 | 0 | 3,00 | max. 1 g je kg Gewicht/Tag |
| Mineralfutter | 0 | – | – | – | 4,00 | 50–100 g/Tag, deckt Mineralien/Vitamine |
| Salzleckstein | 0 | – | – | – | 2 € je Stück | hält ca. 1 Jahreszeit |
| Möhren/Äpfel | 2 | 1 | 10 | 70 | 0,50 | Leckerli |
| Leckerli | 12 | 8 | 5 | 50 | 5,00 | Leckerli |
Weide: Gras zählt als Futter (Frühling/Sommer ersetzt Gras einen Teil des Heus; Frühjahrsgras viel Zucker → Hufrehe-Risiko bei leichtfuttrigen und dicken Pferden).
Beispiel 600-kg-Warmblut, leichte Arbeit: 10 kg Heu (2,00 €) + 1 kg Hafer (0,50 €) + 100 g Mineral (0,40 €) = ca. 2,90 €/Tag.

### 2. Bedarf je Pferd
- Energie Erhaltung = 0,52 MJ × Gewicht^0,75 (600 kg ≈ 63 MJ).
- Zuschläge: leichte Arbeit +25 %, mittlere +50 %, schwere (Rennen, Vielseitigkeit) +100 %; tragend letzte Jahreszeit +20 %; säugend +70 %; Jungpferd im Wachstum +30 %; Winter auf der Weide +10 %.
- Rasse: leichtfuttrig −15 %, schwerfuttrig +15 %.
- Eiweiß: ca. 10 % der Ration, Fohlen/säugende Stuten 14 %.
- Rohfaser: mind. 1,5 kg Raufutter je 100 kg Gewicht.
- Zucker/Stärke: max. 1 g Stärke je kg Gewicht pro Mahlzeit.
- Mineralien: gedeckt mit Mineralfutter oder Salzleckstein + gutem Heu.

### 3. Auswirkungen (Prüfung täglich, Wirkung über mehrere Tage)
- Energie über 110 % → Futterzustand steigt; unter 90 % → sinkt (ca. 1 Stufe je 5 Tage).
- Futterzustand 1–2: Gesundheit, Energie, Leistung sinken, Immunschwäche. 8–9: Hufrehe-/EMS-Risiko, Gelenke, Leistung sinkt.
- Zu wenig Raufutter: Kolik- und Magengeschwür-Risiko, Langeweile (Koppen, Weben).
- Zu viel Zucker/Stärke: Kolik, Hufrehe, „Hafer sticht“ (Gehorsam/Ruhe sinkt).
- Eiweiß zu wenig: Muskeln bauen ab, Fohlen wachsen schlechter; zu viel: belastet Leber/Nieren.
- Mineralien fehlen: Fell stumpf, Hufe brüchig, Fohlen Entwicklungsstörungen.

### 4. Leckerli
Max. 3 pro Tag: Vertrauen/Bindung +; mehr → Eigenheit „bettelt/schnappt“ und Zucker zählt mit.

### 5. Futterumstellung
Neuer Futterplan wird automatisch über 3 Spieltage umgestellt. Sofort umstellen geht nur mit Warnung (Kolikrisiko).

### 6. Futterexperte
Beratung 80 € je Pferd (echte Futterberatung ca. 60–120 €, geschätzt), erstellt Spezialfutterplan.
