# Übergabe zwischen den Claude-Konten

Dome arbeitet abwechselnd mit zwei Claude-Konten am Spiel: **Claude Team** und **Claude Pro**.
Diese Datei ist der Austausch zwischen beiden – damit das jeweils andere Konto beim nächsten Start weiß, was passiert ist.

## Regeln für diese Datei
1. Beim Start einer Sitzung diese Datei lesen.
2. Steht unten als Absender **das andere Konto**: Infos lesen und übernehmen (CLAUDE.md, Pläne und Code sind schon aktuell – die Datei erklärt nur, was neu ist). Danach den Abschnitt „Nachricht“ **löschen**.
3. Am Ende der eigenen Sitzung (bzw. wenn Dome wechseln will) den Abschnitt „Nachricht“ neu schreiben: Absender = eigenes Konto, was gemacht wurde, was offen ist, worauf zu achten ist. Hochladen auf `main`.
4. Steht als Absender **das eigene Konto**, hat das andere Konto noch nicht gelesen – nichts löschen, nur ergänzen.
5. Weißt du nicht, welches Konto du bist: Dome kurz fragen.
6. Bilder (z. B. Entwürfe, Screenshots) dürfen für die Übergabe in den Projektordner, wenn sie wichtig sind – sobald sie nicht mehr gebraucht werden, wieder löschen (Dome, 18.10.2026). Sonst Test-Screenshots nur im Scratchpad.

---

## Nachricht

**Von:** Claude Pro · **An:** Claude Team · **Stand:** v499, 19.10.2026

- Nachricht von Claude Team gelesen und übernommen.
- **v490 erledigt: Kante Ohr/Kopf.** Die Ohren bekommen jetzt dieselbe Kopf-Schattierung (sh-Verlauf, Glanz, Rußanflug, Fliegentupfen) über eine Maske aus der Ohrform (`schattOhr` in `zeichnePferd`, Maske in `kopfNeuSVG`; Linien bleiben scharf). Die feste Aufhellung +13 % und `ohrFell` sind raus. Mit Playwright gezoomt geprüft (Tekkiner Rußfalbe/Dunkelbrauner/Palomino, Hannoveraner Dunkelbrauner/Schwarzbrauner, Araber Fuchs) – kein Absatz mehr am Ohransatz.
- Offen bleibt nur, was Dome zeichnet (`BEI-INKSCAPE-BEARBEITEN.md` 0, 0b, 0c, 1c, 4b) und Domes Rassen-Testliste.
- **v491:** Tekkiner-Glanz auf dunklen Farben war zu hart → dort getönt, schwächer, weichere Übergänge (`mt-`-Verlauf in pferd.js).
- PRE-Schimmel: harte Kante Kopf/Hals kommt aus Domes Ebene `schopf-maehne-uebergang` (in Mähnenfarbe, gerader Rand auf dem Hals) → in `BEI-INKSCAPE-BEARBEITEN.md` 1d eingetragen; im Code nichts geändert.
- **v492:** Kontur schwarz, Ohr über Mähne, Übergänge (Roan/Lp/Fliegenschimmel/Ruß), Lichtflecke als Verlauf. Neues Prüfskript `tests/optik-pruefung.js` (siehe CLAUDE.md) – bei Optik-Änderungen immer laufen lassen.
- **v493:** Bend-Or-Stufen in der Rassenansicht, Varianten-Hinweis auch mit Muster. Dome: Halsübergänge sind jetzt gut.
- **v494:** Bend-Or-Flecken frei über den ganzen Körper verteilt.
- **v495:** Rassenansicht – Scheckungen nur noch in der Muster-Spalte, nicht bei den Grundfarben.
- **v496:** Bend-Or-Lage (vorn/Mitte/hinten/Kombis/überall) als vererbte Anlage, in der Rassenansicht durchschaltbar.
- **v497:** Wenigpunkt-Stufen wirken jetzt.
- **v498:** Frost sah aus wie Lackschimmel (Lack-Anteil nicht zurückgesetzt) – behoben.
- **v499:** Birdcatcher/Snowflake unterscheidbar. Offen: Dome wählt Brindle-Zusatzvariante (Vorschau dezent/fein/nur teilweise gezeigt, noch nicht eingebaut).
