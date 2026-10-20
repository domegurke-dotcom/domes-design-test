# Auftrag: Turnier-Schleifen und Pinnwand (kopierfertig, eigenständig)

Quelle: Projekt-Chat (Dome, 20.10.2026), von Dome an Claude Pro weitergegeben. **Stand: geplant, noch nichts gebaut – Dome sagt, wann es losgeht.**

Auftraggeberin ist Dome. Alles auf Deutsch, Wege mit ausgeschriebenen Menüpfaden angeben (Beispiel: „Hauptmenü - Stall - Box - Pinnwand“).
Die Bilder liegen im Repo auf dem Branch `entwurf-schleifen-bilder` im Ordner `entwuerfe/schleifen-bilder/` (Schleifen als SVG, Übersicht, Pinnwand, Box-Stufe-3-Vorschau, Brief-Beispiel, Zeichen-Skript `gen2.py`). Zuerst `uebersicht.png` ansehen: jede Reihe ist eine Stufe, ganz rechts in Reihe 1 die braune Teilnehmerschleife, dazu `champion.svg`.

## 1. Was Dome will (kurz)
1. Statt der Emojis 🥇🥈🥉🎀 gibt es echte Turnierschleifen (Rosetten), nach den Farben der FN: Platz 1 Gold, 2 Silber, 3 Weiß, 4 Blau, 5 Rot, 6 Grün, dazu die braune Teilnehmerschleife (Hufeisen).
2. Die Schleife ist im Ergebnisbrief groß und gut zu sehen.
3. In der Box hängt an der Rückwand rechts neben Fenster/Tür eine Pinnwand mit allen gesammelten Schleifen des Pferdes. Antippen öffnet sie groß vor der Box.
4. Neue Funktionen kommen in Tutorial, Hinweisblasen, Stufen-Tabelle und Enzyklopädie (feste Regel von Dome).

## 2. Welche Schleife gibt es wann
**Platz (je Prüfung):**
1. Platz 1 bis 6: Farbe nach Platz (Gold, Silber, Weiß, Blau, Rot, Grün).
2. Platziert, aber Platz 7 oder schlechter (platziert = bestes Viertel, mindestens 3, das gibt es bei großen Feldern bis etwa Platz 10): braune Teilnehmerschleife, auf jedem Turnier.
3. Nicht platziert: braune Teilnehmerschleife nur auf dem Haus- und Hofturnier (`art: "hof"`, also Hausturnier und Hofturnier). Auf allen anderen Turnieren nichts.
4. Ausgeschieden (Distanzritt Tierarzt, `aus`): nie eine Schleife.
5. Hat die Prüfung einen Titel (`P.titel`, Platz 1 bei Championat, Fohlenchampion): statt der goldenen Platz-1-Schleife die blau-goldene Champion-Schleife (`champion.svg`).

**Stufe (je Turnierart, bestimmt das Aussehen):**
1. Stufe 1, einfache Rosette, Zahl in der Mitte: Hausturnier und Hofturnier.
2. Stufe 2, doppelte Rosette, Zahl in der Mitte: Regionales Turnier, Westernturnier, Distanzritt, Gangpferdeturnier, Renntag, Fohlenschau.
3. Stufe 3, doppelte Rosette mit Goldring, Pferdekopf statt Zahl: Großes Turnier (auch Großes Westernturnier, das ist meine Wahl, bitte Dome nennen).
4. Stufe 4, dreifache Rosette mit Goldrand und goldenem Mittelband, Pferdekopf statt Zahl: Championat und International.
5. Hallenturniere haben die Stufe ihrer Turnierart. Die braune Schleife gibt es in allen vier Stufen (immer mit Hufeisen).

Insgesamt gibt es 29 Schleifenbilder: 4 Stufen mal Platz 1 bis 6 plus braun, plus Champion.

## 3. Bilder im Spiel
1. Schleifen als eine kleine JS-Funktion `schleifeSVG(stufe, platz, champion, px)` zeichnen, die das Skript `gen2.py` nachbaut (alle Maße, Farben und Verläufe stehen dort; 32×32-Raster). Keine 29 fertigen SVGs in den Code kopieren, Gradient-IDs je Stufe und Farbe eindeutig halten, damit mehrere Schleifen auf einer Seite sich nicht stören.
2. Neue Emojis meiden (Regel von Dome), die Schleifen sind reine SVG.

## 4. Wo die Schleifen die Emojis ersetzen
Überall, wo heute 🥇🥈🥉🎀 stehen:
1. Turnier-Ergebnisbrief (Brief „Ergebnis: Pferd beim Turnier“): Schleife groß (58 Pixel) links neben jeder Prüfungszeile, siehe `brief-beispiel.png`. Die Texte „🥇 Sieg“, „🥈 2. Platz“, „🥉 3. Platz“ und „Schleife 🎀“ fallen weg (Text bleibt: „Sieg“, „2. Platz von 16 …“). Das Preisgeld bleibt als zweite Zeile.
2. Fohlenschau- und Championat-Ergebniszeile (heute 🏆 „Champion!“ und 🎀 „platziert“): ebenfalls Schleife links. Die 🏅 „Stallplakette“ bleibt.
3. Box - Steckbrief - Ausbildung - Erfolge (Liste mit 🥇🥈🥉🎀▫️): kleine Schleife (22 Pixel), ausgeschiedene weiter mit ❌.
4. Erfolgstabelle mit den Spaltenköpfen 🥇 🥈 🥉: dort die Stufe-1-Schleifen Gold, Silber, Weiß (je 20 Pixel).
5. Bleiben wie sie sind: 🏅 in der Bestenliste und 🏆 „auf dem Turnier“.
6. **Wichtig für den Brief:** Briefe stehen als Text im Spielstand. Keine SVGs in den Brieftext schreiben (das bläht die Post auf). Stattdessen im Text einen kurzen Platzhalter wie `[[S:2:1]]` (Stufe, Platz; `[[S:2:0]]` braun, `[[S:c]]` Champion) speichern und beim Anzeigen des Briefs durch das SVG ersetzen. Die Schleife erscheint im Brief am nächsten Tag, wenn er ankommt. Alte Briefe mit Emojis bleiben unverändert.

## 5. Schleifen speichern (ein Pferdeleben lang)
1. Neues Feld je Pferd, z. B. `p.schleifen`: Liste mit Einträgen `{ st: Stufe 1–4, pl: Platz 1–6 oder 0 für braun, c: true für Champion, von: Starterzahl, platz: echter Platz, pruef: Prüfungsname, turnier: Turniername, tag: Spieltag }`. Keine Obergrenze wie bei `p.erfolge` (die wird bei 60 abgeschnitten), nur ein hoher Schutz (z. B. 300).
2. Der Eintrag entsteht an derselben Stelle wie der Eintrag in `p.erfolge`, nach den Regeln aus Abschnitt 2. Fohlenschau und Championat auch.
3. Das Feld hängt am Pferd und wandert mit (Boxwechsel, Absetzen, Verkauf, Kauf), wie die Stallplaketten.
4. **Einmalige Übernahme alter Spielstände:** Für vorhandene Pferde aus den bestehenden `erfolge`-Einträgen (Turnierart, Platz, platziert, Titel) `schleifen` nachbauen, einmal je Spielstand (Versionsmarke setzen). Einträge „beim Vorbesitzer“ zählen mit. Spielstand Export/Import und die Neuladen-Prüfung dürfen nicht kaputtgehen.
5. Tote Pferde: wie bei den Stallplaketten keine Pinnwand in der Box; die Liste der Schleifen bleibt im Datensatz.

## 6. Pinnwand in der Box
Bilder: `boxen-pinnwand-neu.png` (Vorschau direkt aus dem Spiel gerendert, mit den Maßen unten), `box3-spiel.png` (Stand heute), `pinnlib.py` (zeichnet die Pinnwand als SVG-Fragment).
1. Die Pinnwand erscheint, sobald das Pferd in der Box seine erste Schleife hat. Sie zeigt die Schleifen des Pferdes in der Box (nicht die des Fohlens).
2. Lage: Die Pinnwand ist 60 breit und 55 hoch (Box-Koordinaten, viewBox 400×300), Kork mit Holzrahmen, **3 Spalten mal 3 Reihen (9 Plätze)**, Schleifen mit bunten Stecknadeln, leicht schief (−3° bis +3°). Sie liegt **immer hinter dem Pferd, nie davor**: sie gehört in die Wand-Ebene der Box (also unter dem Pferdebild, den Sprechblasen und Boxenelementen davor), das Pferd darf sie teilweise verdecken (Domes Wunsch).
   1. **Höhe:** Ursprünglich lag die Mittellinie einer 70 hohen Pinnwand auf der Mitte des rechten Fensterrahmens (Mitte seiner senkrechten Länge). Dome wollte sie dann unten um eine Reihe kürzer: die **Oberkante bleibt** an dieser Stelle, die Pinnwand ist 55 hoch (die untere Reihe fehlt).
   2. **Seitlich:** der Abstand zwischen rechtem Fensterrahmen (rechte Außenkante) und Pinnwand ist gleich dem Abstand zwischen Pinnwand und rechtem Wandpfeiler (linke Kante des Pfeilers bei x 337).
   3. Gemessene Werte (obere linke Ecke der Pinnwand): Stufe 1 x 260,5 y 86 (rechter Rahmen x 235–244, y 92–150); Stufe 2 x 266,5 y 84 (Rahmen x 247–256, y 84–154); Stufe 3 x 272,5 y 82 (Rahmen x 259–268, y 76–158); Paddockbox in allen Stufen wie Stufe 2 (x 266,5 y 84, Türpfosten rechts x 247–256). Bitte nachmessen und bei Abweichung die Regel 1 und 2 gelten lassen.
   4. Die Stallplaketten oben neben dem Boxschild bleiben, die Pinnwand liegt darunter. Vorschau: `boxen-pinnwand-neu.png` (oben Stufe 3 normal, Paddock, Abfohl; unten Stufe 2, Stufe 1, Paddock Stufe 1).
3. **Paddockbox (Tür statt Fenster) und Abfohlbox:** Die Pinnwand kommt in alle Box-Arten. Sie wird in die Wand-Gruppe der Box eingefügt (nicht lose darüber), dann macht sie die Abfohlbox-Verkleinerung der Rückwand (`abfHinten`, Faktor 0,8) automatisch mit und liegt dort ganz auf der Rückwand. Bei der Paddockbox bleibt sie an derselben Stelle rechts neben der Tür. In der Abfohlbox hängt die Rotlichtlampe direkt rechts daneben und berührt die untere rechte Ecke der Pinnwand, die Lampe bleibt davor. Vorschau: `boxen-abfohl-pinnwand.png`.
   **Leckstein:** In allen Boxen hängt der Salzleckstein links vom Fenster (bzw. der Tür) statt rechts: in `boxstufen.js` `LECK(306, 132)` auf etwa `LECK(108, 132)` ändern (alle Stufen, Paddockbox, Abfohlbox). In Box Stufe 3 hängt er rechts neben dem Heunetz (Heunetz etwa x 70–113, linker Fensterrahmen etwa x 127), er soll das Heunetz nicht überdecken, bitte genau nachmessen und leicht verschieben. Das Pferd steht mit dem Kopf links, der Leckstein ist dort teils verdeckt, das ist gewollt.
4. **Box Stufe 3:** Das goldene Pferde-Namensschild (in `boxstufen.js` das `<rect x="266" y="98" …>` mit `<text class="sName">`) fällt weg, die Pinnwand hängt an dieser Stelle. Das weiße „Box 1“-Schild oben in der Mitte bleibt (es ist der Knopf zur Boxenübersicht). Der Pferdename steht weiter in der Pferde-Akte. Den Code, der `.sName` füllt, entsprechend aufräumen.
5. An der Wand hängen höchstens die besten 9. Reihenfolge: Champion, dann Stufe 4 bis 1 (höhere Stufe zuerst), innerhalb gleicher Stufe Platz 1 bis 6, braune zuletzt, bei Gleichstand die neueste zuerst. Diese Reihenfolge gilt an der Wand immer.
6. Antippen der Pinnwand (auch mit Tastatur/Fokus, der Rest der Box bleibt bedienbar): öffnet die große Pinnwand vor der Box (siehe `pinnwand-gross.png`): Hintergrund abgedunkelt, großer Korkrahmen, alle Schleifen des Pferdes, 5 pro Reihe (4 auf schmalem Handy hochkant), senkrecht scrollbar, ✕-Knopf oben rechts und Tipp neben die Pinnwand schließen sie. Anzeige- und Interaktionsboxen dürfen sich nicht überdecken, Kamera-Aussparung beachten.
7. Tipp auf eine Schleife in der großen Pinnwand zeigt eine kleine Blase: „Prüfung · Platz von Starterzahl“, Turnier, Jahreszeit und Jahr (z. B. „Dressur Kl. L · 1. Platz von 14 / Regionales Turnier Hügelhof / Frühling, Jahr 3“).
8. **Sortierung in der großen Pinnwand:** oben ein Umschalter „nach Jahr“ und „nach Klasse“.
   1. „nach Jahr“ (Standard): Überschrift je Jahr, neuestes Jahr zuerst; innerhalb eines Jahres Reihenfolge wie Punkt 5.
   2. „nach Klasse“: ohne Jahresüberschriften, Reihenfolge wie Punkt 5.
   3. **Die letzte Auswahl des Spielers wird gespeichert** (im Spielstand bei den Einstellungen, ein Wert für alle Pferde und Höfe) und beim nächsten Öffnen wieder eingestellt.

## 7. Tutorial, Hinweisblasen, Stufen, Enzyklopädie (feste Regel von Dome)
Dome hat am 20.10.2026 festgelegt: **Jede Änderung aus allen Themen wird auch im Tutorial und in den Hinweisblasen ergänzt.** Für diesen Auftrag:
1. Tutorial: im Turnier-Teil einen kurzen Absatz ergänzen: Schleifenfarben, Stufen je Turnierart, Pinnwand in der Box, wo man sie antippt.
2. Hinweisblase (einmalig, nach der ersten Schleife eines Spielers): „Sturmwind hat seine erste Schleife! Sie hängt jetzt an der Pinnwand in der Box (Hauptmenü - Stall - Box, rechts neben dem Fenster). Tippe darauf, dann siehst du alle Schleifen.“ (Pferdename einsetzen).
3. Ein Tipp-Eintrag und ein Stufen-Eintrag (ab welcher Erfahrungsstufe sichtbar) für die Pinnwand, wie bei neuen Funktionen üblich. Die Schleifen selbst sind für alle Stufen sichtbar, die Pinnwand-Hinweisblase erst, wenn der Spieler Turniere sieht.
4. Enzyklopädie: neuer Abschnitt „Turnierschleifen“ mit der Farbtabelle (Platz 1 Gold bis Platz 6 Grün, braun = Teilnehmer, Platz 7 und schlechter), der Stufentabelle (Turnierart zu Stufe) und dem Hinweis auf die Pinnwand. Die Kalender-Beschreibung „Hofturnier … nur Schleifen“ bleibt.

## 8. Prüfen und festhalten
1. Kleiner Playwright-Test: Zuordnung Turnierart/Platz zur Schleife (alle Regeln aus Abschnitt 2, inkl. Ausgeschieden, Teilnehmer nur auf Haus-/Hofturnier, Champion), Übernahme alter Spielstände, Platzhalter im Brief wird ersetzt, Sortierung und gespeicherte Auswahl. Keine großen Tests ohne Rückfrage.
2. Screenshots in den drei Ansichten (PC 1366×768, Handy quer 844×390, Handy hochkant 390×844) für Box Stufe 1 bis 3 mit Pinnwand, große Pinnwand und Ergebnisbrief.
3. Version erhöhen, `CLAUDE.md`, Übergabe-Datei und Plan nachführen, Dome eine Test-Anleitung mit ausgeschriebenen Wegen geben.
4. Auffälliges am Ende sagen, z. B. dass das Hausturnier heute nur Dressur-, Stilspring-, Westernreiter-Wettbewerb und Gelassenheit hat (Hausturnier-Varianten für Westernturnier, Distanzritt und Gangpferde sind ein eigenes späteres Thema, hier nicht bauen).
