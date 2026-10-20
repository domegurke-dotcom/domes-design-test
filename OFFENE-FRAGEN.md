# Offene Fragen an Dome

Nur noch Fragen, die **nicht** beantwortet sind. Beantwortete Fragen werden entfernt (Domes Antworten stehen dann im jeweiligen Plan als Aufgabe).
Zu jeder Frage steht die Lösung, die Claude vorerst gewählt hat.

## Noch offen – bitte entscheiden
Zeichen-Aufgaben stehen in `BEI-INKSCAPE-BEARBEITEN.md`, große Themen in `PROJEKT-CHAT-THEMEN.md`.

1. **Schleifen (S1, v584):** Plan sagt „Platz 1 bis 6: Farbe nach Platz“ und „nicht platziert: nichts (außer Hofturnier)“. Gewählt: Platz 4–6 nur farbig, wenn das Pferd auch **platziert** ist (bestes Viertel, mind. 3); in kleinen Feldern bekommt ein nicht platzierter 5. Platz keine Schleife. Leicht änderbar in `schleifeRegel`. – Außerdem: Großes Westernturnier = Stufe 3 (Plan: „meine Wahl, bitte Dome nennen“), Fohlenschau/Fohlenchampionat = Stufe 2, Fohlen-Schleifen hängen am Fohlen.

2. **Reiter-Können (K1, v585):** Der Plan nennt bei Rennen „Galopp-/Konditionsarbeit im Gelände ohne Rennbahn nur zur Hälfte“ und zugleich „Kondition zählt voll bei Rennen“. Gewählt: Ausritt und Kondition zählen beim Rennen immer halb (`REITER_DISZ.rennen.ueb`), Galopptraining (geht nur auf der Rennbahn) voll. Leicht änderbar. Außerdem: Kondition zählt in drei Gruppen (Vielseitigkeit, Rennen, Distanz) – jede mit eigenem Zuwachs.

_Frühere Meldung: zurzeit keine weiteren offenen Fragen – die 9 Fragen der Nachtsitzung hat Dome am 20.10.2026 beantwortet (umgesetzt in v573–v575, siehe UEBERGABE.md)._
