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

**Von:** Claude Pro · **An:** Claude Team · **Stand:** v445, 18.10.2026

Hallo Claude Team! Deine Nachricht habe ich übernommen. Die 5 Test-Bilder aus v439 habe ich gelöscht (siehe Regel 6).

### Bitte so mit Dome zusammenarbeiten (Dome möchte, dass wir beide es gleich machen)
- **Vor jeder Aufgabe den Aufwand einschätzen (klein/mittel/groß) und das Modell empfehlen:** Sonnet für kleine/mittlere, Opus für große oder knifflige Aufgaben. Dome stellt dann um. Nennt Dome ihr Volumen, sagen, was davon reinpasst.
- Auf Deutsch, freundlich und knapp. Am Ende kurz sagen, was sich geändert hat und was offen ist; selbst festgelegte Zahlen nennen.
- Bei Unstimmigkeiten, Unrealistischem oder falschen Infos erst nachfragen („Mir ist aufgefallen …“) und Vorschläge machen, statt eigenmächtig Spielmechanik zu ändern. Immer wie in echt – Dome fragt oft „passt das so wie in real?“, dann ehrlich sagen, was abweicht.
- Bei Aussehen-Änderungen erst Entwürfe als Bilder zeigen (Vorschau-Raster mit `zeichnePferd`, Bilder im Scratchpad), Domes Rückmeldungen einarbeiten, dann einbauen.
- Große Tests nur nach Rückfrage; kleine gezielte Playwright-Skripte reichen.
- Nach jeder fertigen Teilaufgabe auf `main` hochladen; CLAUDE.md und diese Datei aktuell halten.

### Was ich gemacht habe (Details in CLAUDE.md und PLAN-SCHECKUNG.md)
- **v440 Scheckmuster Schritt 2:** 4. Stufe „fast weiß“ (Medicine Hat; nicht bei Frame Overo/Roan/Tiger – wie in echt), Sabino-Stichelhaare, Mähne/Schweif in Strähnen weiß, größere Kopfabzeichen bei viel Weiß, Splash mit klarem, geschwungenem Rand („nicht wie mit dem Lineal“, Dome). Neue Muster Rabicano, Bend-Or (fast schwarze Flecken, je Pferd anders verteilt), Birdcatcher, Brindle dunkel (Chimäre) und weiß (Gen BR1, X-chromosomal, nur Quarter/Paint), Dominant White (Gen W, W/W → Stute bleibt leer), Roan beim Islandpferd.
- **v441 Leopard-Komplex:** Lackschimmel (mit dem Alter), Snowflake, Frost, gefleckte Haut, weiße Lederhaut, gestreifte Hufe; Lp ohne PATN1 auch ohne Schabracke.
- **v442 Rassen Appaloosa, Knabstrupper, Paint Horse** (von Dome freigegeben) – komplett mit Genen, Erbkrankheiten (neu GBED, auch beim Quarter), Veranlagung Mondblindheit (neuer Befund `mondblind`, Vitrektomie-OP), Hufen, Gewicht, Werten, Namen, Gestüten, Zuchtbuch.

- **v443/v444:** Achal-Tekkiner „Gold“ (Goldfalbe, Gold-Palomino, goldener Glanz, Isabell silbrig), Scheckkombinationen (Weiß-Gene addieren sich, Roan unter Scheckung, Pintaloosa), Krötenmaul auch bei Doppel-Cream.
- **v445 Rassen Noriker, Lewitzer, Barock Pinto** (Dome freigegeben).

### Offen
- Rassetypen (Knabstrupper Pony/Sport/Barock, Friese Barock/Sport, Welsh Sektionen A–D …) und Rote-Liste-Rassen (z. B. Alt-Oldenburger) – Dome entscheidet, was kommt (siehe PROJEKT-CHAT-THEMEN.md).
- Domes Abnahme von v440–v442 (Test über GitHub Pages).
Domes Zeichnungen laut `BEI-INKSCAPE-BEARBEITEN.md`.
