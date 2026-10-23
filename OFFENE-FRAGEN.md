# Offene Fragen an Dome

Nur noch Fragen, die **nicht** beantwortet sind. Beantwortete Fragen werden entfernt (Domes Antworten stehen dann im jeweiligen Plan als Aufgabe).
Zu jeder Frage steht die Lösung, die Claude vorerst gewählt hat.

## Noch offen – bitte entscheiden
Zeichen-Aufgaben stehen in `BEI-INKSCAPE-BEARBEITEN.md`, große Themen in `PROJEKT-CHAT-THEMEN.md`.

1. **Selbst gesetzte Zahlen im Veterinäramt-/Speicher-Auftrag (v599–v605)** – bitte ansehen, alles leicht änderbar:
   - Meldechance bei Einsteller, Tierarzt und Hufschmied: **50 % je Besuch**, wenn sie einen Mangel sehen (`VET2.melde`). Anonym: 5 % je Mangel, höchstens 25 % am Tag (aus dem Auftrag).
   - Beschlagnahme-Klinik: Behandlung **20 € je Krankheit und Tag** (`KLINIK_BEFUND`), Tod in der Klinik **4 % je Tag**, nur bei chronisch schwer kranken (Grad ≥ 4) oder sehr alten Pferden (Altersgrenze ≤ 25 %) und solange sie unter 50 % sind (`KLINIK_TOD`). Ziel = Minimum aus 75 %, Altersgrenze und Krankheitsdecke.
   - „Keine Heilung mehr möglich“ (für Erlösen): Röhrbeinbruch, Megaösophagus, Aortenwandschwäche, HERDA, Ataxie ab Grad 4 (schwer), alle anderen chronischen Krankheiten erst bei Grad 5 (`KEINE_HEILUNG`).
   - Alt-Ausnahme: Gesundheit höchstens 10 Punkte unter der Altersgrenze **und** höchstens 30 % (`VET.altNah`).
   - Hufe überfällig als Mangel: mehr als 4 Wochen = 4/13 Jahreszeit über dem Hufschmied-Intervall.
2. **Hinweise zum Auftrag:** (a) Die „Rücksicherung“ gibt es seit v522 nicht mehr; statt dessen kann der Platz „Verloren“ aufgeräumt werden. (b) Der Stammbaum eines Pferdes speichert die Eltern-Daten selbst – Details eines gelöschten Vorfahren gehen dort nicht verloren, nur sein Steckbrief; die Warnung beim Aufräumen sagt das so. (c) Pferde mit Erfolgen und die 3 wertvollsten Pferde kommen beim Tod automatisch in die Bestenliste – dafür fragt das Aufräumen zusätzlich. (d) Experten sehen die neuen Blasen nur, wenn „Tipps“ in den Einstellungen an sind (Experten haben Tipps standardmäßig aus).

_Reitunterricht (Dome 20.10., v606): auch der feste Bereiter kostet 60 € (Zusatzleistung), trainiert aber am nächsten Morgen normal. Frühere Antworten (Dome, 20.10.2026): Fragen 1–12 der Nachtsitzung beantwortet („so lassen“); Nachbau v598: Fremd-Vergleich (Interieur nur grob), Blasen merkVorschau/merkFohlenschau, Pferdebild und Kryptorchismus im Admin, Reiter-Test-Toleranz. Offen vermerkt: Zeilen Behang/Ohren in den Rassemerkmalen (siehe PLAN-MERKMALE.md und BEI-INKSCAPE-BEARBEITEN.md)._


## Nachtrag 23.10.2026 (Claude Team)
- **Thema Spieltempo abstimmen (Dome 23.10.):** Tempo 4/7/10 muss insgesamt besser aufeinander abgestimmt werden – Krankheitsrisiko und Heilzeit (Studie: bei Tempo 10 ≈ 2,8 Befunde/Pferd/Jahr gegen ≈ 1,8 bei Tempo 7, Heilung 7 statt 3,5 Tage, 2 von 6 Läufen mit Tierhalteverbot), außerdem Pensionseinnahmen usw. Noch nichts geändert; gemeinsam mit Dome durchgehen (Zahlen: `STUDIE`-Läufe `TEMPO=… EXPERTE=1 STUFEN=2 tests/gesundheit-studie.js`).

## Nachtsitzung 23.10.2026 (Claude Team, Rest der Wunschliste) – selbst gesetzt, bitte ansehen
- **Pension Paddockbox (v680):** Aufpreis je Stufe startet bei 50 € (wie bisher), einstellbar 0–300 €; teurer = seltener gewünscht (Faktor 50 € ÷ Aufpreis, zwischen 0,25 und 1,5). Neuer Aufpreis gilt nur für neue Verträge. **Achtung alte Spielstände:** die bisherige Platz-Grenze gilt jetzt nur noch für normale Boxen, Paddockboxen stehen auf „alle“ – wer vorher z. B. „höchstens 3“ hatte, kann jetzt zusätzlich Paddockboxen vermieten.
- **Sandpaddock (v681):** Fläche 150 m² je Großpferd wie bisher, Bedarf nach Größe = 150 m² × (Stockmaß ÷ 160 cm)², begrenzt 68–195 m² (Shetty ≈ 68, Haflinger ≈ 128, Warmblut ≈ 165, Shire ≈ 190 m²). Vergrößern je Platz 150/250/450 € (Stufenpreis ÷ Plätze). Zu voll (nur von Hand möglich): Wohlbefinden −2 je Nacht und Verletzungen ×1,5, ab 150 % −4 und ×2,2. Bisher passten auf Stufe 1 genau 2 Pferde jeder Größe – jetzt z. B. 4 Shettys, aber nur 1 Shire.
- **Hinweis:** `tests/weiden-oberflaeche-test.js` hängt (Zeitüberschreitung) – auch schon vor dieser Sitzung, der Test ist veraltet. `tests/tutorial-test.js` hat einen roten Punkt („Danach Immobilienmenü, Testhof weg …“), ebenfalls schon vorher.
