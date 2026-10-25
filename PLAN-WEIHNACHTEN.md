# Plan: Weihnachten am Hof (nur geplant – Dome, 24.10.2026)

Dome: „a–c alle tolle Ideen“; belohnt wird nach **Zufriedenheit und Ruf, nicht nach Kontostand** (Dome: ok); die vorhandene geheime Weihnachtsspende für Anfänger/Fortgeschrittene bleibt wie sie ist. Dazu **Weihnachtsgeld für Mitarbeiter** – abhängig von Betriebszugehörigkeit, Krankheitstagen und übernommener Arbeit. Alle Zahlen unten sind **Vorschläge von Claude**, Bau erst nach Domes Ja.

Zeitpunkt: letzter Tag im Winter vor dem Jahreswechsel (Briefe am Morgen „24.12.“ = Winter, vorletzter Tag), je Hof.

## A · Weihnachtsgeschenke der Einsteller (echt: Trinkgeld/Geschenke ans Stallteam)
- Je Einsteller nach **Zufriedenheit im Jahresschnitt** (`e.zufr`, Mittel über das Jahr – neu mitschreiben): ≥ 80 → 60–100 €, 60–79 → 25–50 €, 45–59 → Karte ohne Geld, < 45 → nichts. Wer weniger als 1 Jahreszeit da war: Hälfte.
- **Ein Sammelbrief** „Weihnachtsgrüße der Einsteller“ mit kurzen Sätzen je Besitzer („Danke, dass Flocke so gut versorgt wird!“), Gesamtsumme gebucht als „Pension: Weihnachtsgeschenke“.
- Knopf im Brief: „Ans Team weitergeben“ (Summe geht an die Mitarbeiter, Zufriedenheit +3 je Mitarbeiter) oder behalten.

## B · „Stall des Jahres“ (Reit- und Fahrverein / Zuchtverband)
- Bewertung im Winter aus: Pension-Ansehen (`ruf`), Zufriedenheit der Einsteller im Mittel, Veterinäramt ohne Vorfall im Jahr, Turnier-/Fohlenschau-Erfolge des Jahres, Zustand der Gebäude.
- Stufen: Anerkennung (Urkunde, +2 Ansehen) · Bronze 500 € · Silber 1.500 € · Gold 3.000 € (+5/+8/+12 Ansehen), Plakette am Hof (Hofplan/Hof-Übersicht), Brief vom Verein. Schlechtes Jahr: kein Preis, freundlicher Hinweisbrief, was fehlte.

## C · Sponsor nach Ruf
- Ab gutem Ruf (Pension-Ansehen ≥ 140) bietet ein Futterhändler/Sattler ein Sponsoring fürs nächste Jahr an: wählbar **1.000 € einmalig** oder **Futtergutschein 1.500 €** (in der Futterkammer verrechnet) gegen „Werbebanner am Reitplatz“ (sichtbar im Hofplan/Reitplatz-Kachel). Fällt der Ruf im Jahr unter 110, endet das Sponsoring.

## D · Weihnachtsgeld für Mitarbeiter (Ausgabe)
- Fenster im Winter „Weihnachtsgeld?“ mit Vorschlag je Mitarbeiter: Grundbetrag = ¼ Monats… im Spiel **25 % des Gehalts je Jahreszeit**, dazu
  - Betriebszugehörigkeit: je volles Jahr +5 % (höchstens +25 %), unter 1 Jahreszeit nichts,
  - Krankheitstage im Jahr: je Tag −5 % (höchstens −50 %),
  - übernommene Arbeit (eingesprungen, Nachtdienst, Ausbilder, Turnierbegleitung): je Mal +3 % (höchstens +15 %).
- Spieler wählt: **alle wie vorgeschlagen / selbst anpassen / keins**. Wirkung auf die versteckte Zufriedenheit: gezahlt +8 bis +15 (je nach Höhe), keins −10 (wer lange da ist, mehr).
- Neu mitzuschreiben: Krankheitstage je Jahr (`m.krankTage`), Einspringen/Sonderarbeit je Jahr (`m.extra`).

## Stand
- **D Weihnachtsgeld gebaut (v826, Claude Pro, Dome 25.10.: „bauen“)** – Zahlen wie oben vorgeschlagen (`WG` in index.html), Zufriedenheit: Vorschlag +8, doppelt +15, weniger anteilig (mind. +2); keins −10, je volles Jahr −2 mehr (höchstens −16). „Eingesprungen“ = Überstunden für einen fehlenden Kollegen (`m.ueberstunden`), dazu Nachtdienst, Turnierbegleitung als Reiter, angeleitete Azubis. Ein Fenster mit Eingabefeld je Mitarbeiter (Vorschlag vorausgefüllt, Summe live) ersetzt die drei Knöpfe „wie vorgeschlagen / selbst anpassen / keins“. Nicht beantwortet bis zum Jahreswechsel: Frage verfällt ohne Folgen. Test `tests/weihnachtsgeld-test.js`.
- **A–C (Einsteller-Geschenke, Stall des Jahres, Sponsor) noch nicht gebaut** – Auftrag war nur das Weihnachtsgeld.

## Etappen (Vorschlag)
1. D Weihnachtsgeld (Zähler, Fenster, Wirkung) · 2. A Einsteller-Geschenke · 3. B Stall des Jahres · 4. C Sponsor · dann Hinweise/Enzyklopädie (bzn) und Tests.
