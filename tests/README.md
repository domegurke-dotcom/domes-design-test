# Tests

## Gesamttest Hof-Ausbau (`hof-gesamttest.js`)
Spielt mit Playwright (Chromium) ein neues Spiel über gut 2 Spieljahre durch: Pensionsstall kaufen, 4 Pferde, Stallbursche und Hofhelfer, Bauaufträge, Land, Sondertilgung, zentrales Konto, zweiten Hof beim Makler kaufen, Umzug per Anhänger, auf beiden Höfen spielen, Speichern und Neuladen.

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
