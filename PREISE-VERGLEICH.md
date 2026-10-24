# Preise: alt, neu, echt (Dome, 24.10.2026, v805)

Zum Zurückgehen: die „Alt“-Spalte zeigt, was vor v805 im Spiel stand. Gerechnet wird in „je Jahreszeit“ = 7 Spieltage (so rechnet das Spiel bei Futter und Einstreu). „Echt“ = echter Betrag für 7 Tage bzw. echter Einmal-Preis (Quellen dünn: Shop-Preise, Kleinanzeigen, eigene Kenntnis).

## Von Dome gewählt (v805 umgesetzt)

| Posten | Alt | Neu | Echt (Spanne) |
|---|---|---|---|
| Heu, €/kg (`FUTTER.heu`) → je Pferd 70 kg je Jz | 0,20 → 14 € | 0,30 → 21 € | 17–25 € |
| Heu staubig, €/kg (mitgezogen) | 0,15 | 0,22 | – |
| Heulage, €/kg (mitgezogen, bleibt teurer als Heu) | 0,25 | 0,35 | – |
| Einstreu Späne, €/kg und kg je Box und Tag (`FUTTER.spaene`, `EINSTREU.spaene`) → je Box und Jz | 0,35 und 3 kg → 7,35 € | 0,50 und 4 kg → 14 € | 14 € |
| Einstreu Stroh, €/kg (`FUTTER.streuStroh`) → je Box und Jz (7 kg am Tag) | 0,10 → 4,90 € | 0,15 → 7,35 € | 7 € |
| Mineralfutter, €/kg (`FUTTER.mineral`) → je Pferd und Jz (0,1 kg am Tag) | 4,00 → 2,80 € | 2,20 → 1,54 € | 1,50 € |
| Gebäudeunterhalt je Jz (`UNTERHALT`), je 1.000 € Baupreis | 1 % = 10 € | 0,5 % = 5 € | 5 € |
| Tierarzt Hausbesuch (`TIERARZT_BESUCH`; wirkt auch in der AKU) | 80 € | 60 € | 40–80 € |
| Hufschmied Beschlag (`HUF_PREIS.beschlag`) | 140 € | 100 € | 100–130 € |
| Boxenstall je Box, Stufe 1 / 2 / 3 (`BAUTEN.stall.jeBox`) | 400 / 1.000 / 2.400 € | 1.500 / 3.000 / 6.000 € | 5.000–10.000 € |
| Boxenstall Erstbau 6 Boxen | 2.400 / 6.000 / 14.400 € | 9.000 / 18.000 / 36.000 € | – |
| Boxenstall Anbau 2 Boxen | 800 / 2.000 / 4.800 € | 3.000 / 6.000 / 12.000 € | – |
| Paddockboxenstall je Box (von Claude mitgezogen, Verhältnis ≈ 1,3) | 525 / 1.300 / 3.100 € | 2.000 / 4.000 / 8.000 € | – |
| Paddockboxenstall Erstbau 6 Boxen | 3.100 / 7.800 / 18.700 € | 12.000 / 24.000 / 48.000 € | – |
| Paddockboxenstall Anbau 2 Boxen | 1.050 / 2.600 / 6.200 € | 4.000 / 8.000 / 16.000 € | – |
| Reitplatz Stufe 1 / 2 / 3 | 2.000 / 3.000 / 4.500 € | 2.000 / 8.000 / 15.000 € | 30.000–60.000 € (20×40 m) |
| Reithalle Stufe 1 / 2 / 3 | 10.000 / 15.000 / 22.000 € | 10.000 / 40.000 / 100.000 € | 200.000 € und mehr |
| Weideland je ha (`LAND_PREIS`) | 1.000 € | 5.000 € | 15.000–40.000 € |
| Bauland je ha (`BAULAND_PREIS`) | 3.000 € | 25.000 € | 100.000 € und mehr |
| Pacht je ha: Jahr / je Jahreszeit (`PACHT_PREIS`) | 80 € / 20 € | 300 € / 75 € | 250–400 € im Jahr |
| Makler-Preise je Box (`MAKLER_PREIS.box` Stufe 1/2/3, mitgezogen) | 1.000 / 1.600 / 2.500 € | 1.500 / 3.000 / 6.000 € | – |
| Makler Reitplatz / Reithalle (mitgezogen, Stufe 1/2/3) | 2.000 / 3.000 / 4.500 € und 10.000 / 15.000 / 22.000 € | 2.000 / 8.000 / 15.000 € und 10.000 / 40.000 / 100.000 € | – |

Folgen: Verkaufserlös Bauland 90 % = 22.500 €/ha, Weideland 4.500 €/ha. Alte Spielstände behalten die Baupreise ihrer schon gebauten Gebäude (`g.preis`), neue Bauten und Land kosten den neuen Preis. Die AKU-Preise sinken um 20 € (Besuch ist Baustein).

## Bleibt unverändert (zur Information, echt bemessen wäre anders)

| Posten | Spiel | Echt (7 Tage bzw. Einmal) |
|---|---|---|
| Pension Stallbox einfach / ordentlich / Premium je Jz | 150 / 400 / 750 € | 70 / 185 / 345 € |
| Stallbursche / Pfleger / Pferdewirt / Bereiter je Jz | 300 / 330 / 360 / 420 € | 600–690 / 600–690 / 750–830 / 800 € |
| Azubi je Jz | 100–135 € | 250–300 € |
| Boxen je Mitarbeiter | 3 | 15–20 |
| Heucobs / Luzerne €/kg | 0,60 / 0,70 | 1,10–1,60 / 1,10 |
| Späne-Pellets / Leinstroh €/kg | 0,40 / 0,60 | 0,45–0,60 / 0,55–1,30 |
| Quarantänestall- und Abfohlstall-Box (je Box Stufe 1) | 600 / 500 € | wie Boxenstall |
| Kredit | 4 % im Jahr, 10 Jahre (40 Raten, 10.000 € → 304,56 € je Jz) | 3,5–5 % |

## Startausstattung „Alter Pensionsstall“ mit den neuen Preisen

Kaufpreis im Spiel: **20.000 €** (Hofwert 20.000 €, davon 10.000 € Kredit, 10.000 € eigen; Start-Kapital 15.000 € → 5.000 € auf dem Konto).

| Teil | Alt | Neu |
|---|---|---|
| Boxenstall 6 einfache Boxen | 2.400 € | 9.000 € |
| Reitplatz Stufe 1 | 2.000 € | 2.000 € |
| Weidezaun 1 ha | 200 € | 200 € |
| Büro (Bürowagen, Verwaltung Stufe 1) | 1.500 € | 1.500 € |
| Heu- und Strohlager (Grundlager) | 0 € | 0 € |
| Gebäude zusammen | 6.100 € | 12.700 € |
| Bauland 0,5 ha | 1.500 € | 12.500 € |
| Weideland 1 ha | 1.000 € | 5.000 € |
| Land zusammen | 2.500 € | 17.500 € |
| Startvorrat (140 kg Heu, 100 kg Stroh, 3 kg Mineral, 1 Leckstein) | 52 € | 66 € |
| **Summe** | **8.652 €** | **30.266 €** |

Nicht bewertet: Wohnhaus/Hofplatz, Gelände (Wege), Pferdeanhänger. Der Kaufpreis von 20.000 € liegt damit mit den neuen Preisen **unter** dem Sachwert (alt: darüber). Offene Frage an Dome: Kaufpreis anpassen (und damit Kredit, Startgeld, andere Immobilien/Makler)?
