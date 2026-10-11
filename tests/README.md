# Tests

## Gesamttest Hof-Ausbau (`hof-gesamttest.js`)
Spielt mit Playwright (Chromium) ein neues Spiel über gut 2 Spieljahre durch: Pensionsstall kaufen, 4 Pferde, Stallbursche und Hofhelfer, Bauaufträge, Land, Sondertilgung, zentrales Konto, zweiten Hof beim Makler kaufen, Umzug per Anhänger, auf beiden Höfen spielen, Speichern und Neuladen. Ab H5: Pension auf Hof 1 (bis 4 Einsteller, Anfragen werden wie vom Spieler zugesagt, Pensionspferde täglich geputzt/ausgekratzt) – geprüft wird: jeder Einsteller hat genau ein Pferd im Stall, jedes Pensionspferd einen Einsteller, Reservierungen nur für zugesagte Anfragen, kein Pensionspferd auf dem eigenen Friedhof. Die Zeile „Pension“ im Protokoll zeigt Einsteller, Zufriedenheit und Ansehen.

In jedem Prüfschritt (`pruefe`) wird kontrolliert:
- Kasse jedes Hofs = Startgeld + alle Buchungen in den Finanzen
- Kredite: Summe − getilgt = Restschuld, nie negativ
- Boxen fortlaufend nummeriert, kein Pferd in gesperrter Box, Gebäude-Boxen = Boxen im Stall
- Bauland nicht überbelegt, Weide nicht größer als Weideland, Futterlager nie negativ
- kein Pferd doppelt auf mehreren Höfen, zentrales Konto = Kontoauszug

Starten (im Repo-Ordner):
```
NODE_PATH=/opt/node22/lib/node_modules node tests/hof-gesamttest.js
```
Erwartet: jede Zeile im Protokoll endet mit `"ok"`, am Ende `Fehler []`. Bei neuen Etappen (H5, H4 …) die Prüfungen und den Ablauf ergänzen.

## Etappen-Test (`etappen-test.js`) – Abnahmetest für Dome
Spielt Domes Test-Anleitungen für Fütterung F1–F5 und Hof-Ausbau H1–H5 nach, in allen drei Ansichten (PC 1366×768, Handy quer 844×390, Handy hochkant 390×844): Spielstart über die Oberfläche, Kredit und Rate, Futter kaufen/Lieferung/Füttern/leeres Heu, Futterplan und Bedarf, Futterzustand, Leckerli, Futterumstellung, Futterexperte, zweiter Hof (erst nach halber Tilgung), Hof wechseln, Bauen mit neuen Boxen, Verfall/Unterhalt, Pensionsanfrage bis Einzug und Pensionsgeld, Umbau-Folgen H4 (Vorlauf 1 Jahreszeit, Weide/Nachlass, Kündigung ohne Lösung, Reitplatz im Umbau, Rückkehr nach dem Umbau), Weiden H6a (neue Weide, Gras, Matsch, Heu bei wenig Gras, Abäppeln, Sperren); dazu werden alle Bereiche der Hofverwaltung geöffnet und der Spielstand neu geladen.

Starten (im Repo-Ordner):
```
NODE_PATH=/opt/node22/lib/node_modules node tests/etappen-test.js
```
Erwartet: jede Zeile beginnt mit „✓“, am Ende `Fehler []` und `alles ok`. Bei neuen Etappen (H4, H6 …) ergänzen.

## Oberflächen-Test Weiden (`weiden-oberflaeche-test.js`)
Klickt wie eine Spielerin: hvw – Hof – Land → 2 ha Weideland kaufen, Bauen → „Weide einzäunen“ als neue Weide, danach „Weide 1 vergrößern“, dann zwei Pferde über Box – ppf – Ort – Weide mit dem Auswahl-Fenster auf verschiedene Weiden. Ausgabe: Weiden nach jedem Schritt und wo die Pferde stehen; am Ende `Fehler []`.
