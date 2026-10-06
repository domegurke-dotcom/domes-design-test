# Auftrag für die Coding-Sitzung: Fütterung (Stand 5.10.2026, Code v182)

Von Dome geplant und bestätigt. Details, Begründungen und Quellen: `werte/fuetterung-plan.md` im Projektordner *(liegt noch im Planungsprojekt, nicht im Repo)*.
Wie immer: in Etappen umsetzen, nach jeder Etappe testet Dome (Handy und PC). Speicherstände abwärtskompatibel halten (fehlende Felder mit Standardwerten). Vorher Aufwand je Etappe einschätzen.

## Stand der Umsetzung

Plan gespeichert bei Spielversion 185. **Noch nicht starten:** erst wenn Werte-Etappe 6 fertig ist. Dann Dome fragen „Mit Fütterung F1 weitermachen?“ und auf Domes Ja warten.

**Domes Ja liegt vor (6.10.2026, 06:10):** Nach Etappe 6c (Fohlenschau) die komplette Fütterung F1–F5 umsetzen; Dome testet am Ende alles zusammen. Fragen, die man später beantworten kann → empfohlene Lösung nehmen und in `OFFENE-FRAGEN.md` notieren; Fragen, ohne die man nicht sinnvoll weiterbauen kann → anhalten und auf Dome warten.

**Danach (Dome, 6.10.2026):** Nach Etappe F5 kommt `PLAN-HOF.md` (Hof-Ausbau, Etappen H1–H8). Vorher Dome fragen „Mit Hof-Ausbau H1 weitermachen?“ und auf Domes Ja warten. Hinweis für F1: die Futterkammer bekommt ein Feld für die Lagergröße – das nutzt später das Futter- und Strohlager aus H3.

- [x] Etappe F1 – Futterkammer und Futterhandel (mittel) · v210, von Claude per Skript getestet; offene Detailfragen in OFFENE-FRAGEN.md
- [x] Etappe F2 – Futterplan, Bedarf, Nährwerte (groß) · v211, von Claude per Skript getestet
- [ ] Etappe F3 – Futterzustand und Auswirkungen (groß)
- [ ] Etappe F4 – Atemwege, Leckerli, Futterumstellung (klein)
- [ ] Etappe F5 – Futterexperte und Spezialfutter (mittel)

**Jetzt nur speichern, noch nicht umsetzen:** Mit F1 erst starten, wenn Werte-Etappe 6 fertig ist. Eine Werte-Etappe 7 gibt es nicht: Nach Etappe 6 ist der nächste Schritt F1 aus `PLAN-FUETTERUNG.md`. Dann Dome fragen „Mit Fütterung F1 weitermachen?“ und auf Domes Ja warten.

**Zuerst:** Diesen Plan als `PLAN-FUETTERUNG.md` ins Repo speichern und auf `main` hochladen. In `PLAN-WERTE.md` einen Hinweis ergänzen, dass `PLAN-FUETTERUNG.md` (Etappen F1–F5) nach Werte-Etappe 6 kommt. Dome kurz bestätigen, dass der Plan gespeichert ist. Am Ende jeder Etappe sagen, was fertig und was offen ist, und die Etappe in `PLAN-FUETTERUNG.md` abhaken. Neue Systeme auch in `CLAUDE.md` unter „Wichtige Spielsysteme“ nachtragen.

**Reihenfolge (Dome, 5.10.2026):** Werte-Etappen 3, dann Krankheiten A–H mit Azubi-Nachtrag, dann Werte-Etappen 4–6, dann diese Fütterung F1–F5. Voraussetzungen aus A–H: Kolik/Hufrehe/Cushing mit Futter-Faktor (`futterFaktor()`, bisher 1), Mitarbeiter (Stallbursche füttert), Befunde.

**Bestand heute:** Füttern = Krippe voll (ein Klick), hungrig −19 Gesundheit/Nacht; Heu auf der Weide im Winter und am letzten Herbsttag. Körpertypen dünn/sportlich/normal/dick in `pferd.js`. Ausrüstung-Kachel „Futter“ (Heu, Hafer, Mineralfutter). Kosten laufen pro Tag (`KOSTEN`).

*Hinweis aus der Coding-Sitzung (v185):* Inzwischen gibt es außerdem Kolik-Risiko durch Hunger und überfällige Zahnkontrolle, Hufrehe auf der Frühlingsweide, Wurmbefall, eine Stallapotheke (`APO`) und den Ankerpunkt `futterFaktor()` in `befundRisiko`. Diese beim Einbau mitberücksichtigen.

## Etappe F1 – Futterkammer und Futterhandel (mittel)
1. Eine Futterkammer für den ganzen Hof: Hauptmenü - Hofverwaltung - Hof - Futterkammer. Dort Vorrat je Futtersorte sehen und im Futterhandel kaufen.
2. Futtersorten mit Werten je kg (Energie MJ / Eiweiß % / Rohfaser % / Zucker-Stärke % / Preis €):
   1. Heu 6 / 9 / 30 / 10 / 0,20 (Qualität gut oder staubig)
   2. Heulage 7 / 10 / 28 / 8 / 0,25 (staubarm)
   3. Futterstroh 5 / 3 / 40 / 2 / 0,15
   4. Heucobs 7 / 9 / 28 / 8 / 0,60 (Senioren, Zahnprobleme)
   5. Luzerne 8 / 16 / 25 / 5 / 0,70
   6. Rübenschnitzel 10 / 9 / 18 / 5 / 0,90
   7. Hafer 11 / 11 / 11 / 45 / 0,50
   8. Pellets 11 / 13 / 12 / 25 / 0,80
   9. Müsli 12 / 12 / 8 / 35 / 1,20
   10. Öl 30 / 0 / 0 / 0 / 3,00 (max. 1 g je kg Körpergewicht pro Tag)
   11. Mineralfutter 0 / – / – / – / 4,00 (50–100 g/Tag, deckt Mineralien/Vitamine)
   12. Salzleckstein 2 € je Stück, hält ca. 1 Jahreszeit
   13. Möhren/Äpfel 2 / 1 / 10 / 70 / 0,50 (Leckerli)
   14. Leckerli 12 / 8 / 5 / 50 / 5,00
3. Täglicher Verbrauch nach den Futterplänen, Kosten echt pro Spieltag (normales Pferd ca. 2–4 €/Tag; Beispiel 600 kg: 10 kg Heu + 1 kg Hafer + 100 g Mineral = ca. 2,90 €).
4. Vorrat leer → Warnbrief, das Pferd bekommt diese Sorte nicht.
5. Größere Lager kommen später mit dem Hof-Ausbau (Feld für Lagergröße vorbereiten).
6. Kachel Hauptmenü - Stall - Box - Ausrüstung - Futter zeigt, was dieses Pferd bekommt, und führt zum Futterplan.

## Etappe F2 – Futterplan, Bedarf, Nährwerte (groß)
1. Futterplan je Pferd: Hauptmenü - Stall - Box - Pferdepflege - Versorgung - Futterplan. 2–3 Mahlzeiten mit Sorten und Mengen.
2. Der tägliche Fütter-Klick bleibt: ein Klick füttert den Tagesplan; der Stallbursche füttert nach Plan. Ohne Plan: Standardplan (Heu + Mineral).
3. Bedarf je Pferd berechnen:
   1. Energie Erhaltung = 0,52 MJ × Gewicht^0,75 (600 kg ≈ 63 MJ). Gewicht aus der vorhandenen Funktion `gewicht(p)`; der Futterzustand verschiebt es (z. B. ±3 % je Stufe von 5 weg).
   2. Zuschläge: Arbeit leicht +25 %, mittel +50 %, schwer +100 %; tragend in der letzten Jahreszeit +20 %; säugend +70 %; Jungpferd im Wachstum +30 %; Winter auf der Weide +10 %.
   3. Rasse: leichtfuttrig −15 % (Haflinger, Fjord, Shetty, Isländer, Tinker), schwerfuttrig +15 % (Vollblut, Araber, Achal-Tekkiner). Neue Rassen bekommen diesen Wert mit.
   4. Eiweiß ca. 10 % der Ration, Fohlen und säugende Stuten 14 %.
   5. Raufutter mind. 1,5 kg je 100 kg Gewicht.
   6. Stärke max. 1 g je kg Gewicht pro Mahlzeit; Kraftfutter max. 0,3 kg je 100 kg pro Mahlzeit.
   7. Mineralien gedeckt durch Mineralfutter oder Salzleckstein mit gutem Heu.
4. Futterplan zeigt Balken „Bedarf gedeckt“ für Energie, Eiweiß, Rohfaser, Zucker/Stärke, Mineralien/Vitamine (zu wenig / passt / zu viel).
5. Weide zählt als Futter: Im Frühling und Sommer ersetzt Gras einen Teil des Heus.

## Etappe F3 – Futterzustand und Auswirkungen (groß)
1. Futterzustand 1–9 im Hintergrund. Anzeige über die vorhandenen Körperbilder: 1–3 dünn, 4–6 normal, 7–9 dick; „sportlich“ = Muskeln aus Training bei 4–6.
2. Prüfung täglich, Wirkung über mehrere Tage: Energie über 110 % → Futterzustand steigt, unter 90 % → sinkt (ca. 1 Stufe je 5 Tage).
3. Futterzustand 1–2: Gesundheit, Energie, Leistung sinken, Immunschwäche. 8–9: Risiko Hufrehe/EMS, Gelenke belastet, Leistung sinkt.
4. Zu wenig Raufutter: Risiko Kolik und Magengeschwür, Langeweile (Koppen, Weben).
5. Zu viel Zucker/Stärke: Kolik, Hufrehe, „Hafer sticht“ (Gehorsam und Ruhe sinken). Zu viel Kraftfutter in einer Mahlzeit → Kolikrisiko.
6. Eiweiß zu wenig: Muskeln bauen ab, Fohlen wachsen schlechter. Zu viel: belastet Leber/Nieren.
7. Mineralien fehlen: Fell stumpf, Hufe brüchig (Huf-System aus Etappe E), Fohlen mit Entwicklungsstörungen.
8. Frühjahrsgras hat viel Zucker → Hufrehe-Risiko bei leichtfuttrigen und dicken Pferden.
9. `futterFaktor()` liefert jetzt echte Werte an Energie, Wohlbefinden, Gesundheit, Training und das Kolik/Hufrehe/Cushing-Risiko.

## Etappe F4 – Atemwege, Leckerli, Futterumstellung (klein)
1. Versteckte, vererbte Veranlagung „empfindliche Atemwege“. Nur diese Pferde husten von staubigem Heu; dauerhaft staubiges Heu → chronischer Husten (Pferdeasthma, Befund). Heulage oder gewässertes Heu hilft.
2. Leckerli: bis 3 pro Tag stärken Vertrauen/Bindung. Mehr → Eigenheit „bettelt/schnappt“, Zucker zählt mit.
3. Futterumstellung: neuer Plan wird automatisch über 3 Spieltage umgestellt. Sofort umstellen geht nur mit Warnung (Kolikrisiko).

## Etappe F5 – Futterexperte und Spezialfutter (mittel)
1. Futterexperte extern auf Termin (wie Hufschmied/Tierarzt): Beratung 80 € je Pferd, Rechnung per Brief. Fest angestellt nur im großen Stall (ab 20 Boxen).
2. Spezialfutter kann nur er zusammenstellen: nach OP oder Kolik, Hufrehe, Cushing, PSSM, Magengeschwür, Senioren, Immunschwäche. Er legt den Spezialplan im Futterplan an.
