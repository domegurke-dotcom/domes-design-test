# Plan: Tutorial-Umbau (Dome 25.10.2026 – „plane ihn“)

Anlass: Aufnahme 9 (Trollhof) und Domes Rückmeldungen. **Noch nichts gebaut.** Reihenfolge und Umfang bitte mit Dome abstimmen, dann je Etappe bauen, testen, hochladen, auf Rückmeldung warten.

## Ziele (Dome)
1. **Texte kurz** (alle drei Tutorials: Anfänger, Fortgeschrittene, Experten): „sämtliche Texte sind zu lang … man hört irgendwann auf zu lesen“. Wichtigstes in 1–2 Sätzen, **Schlüsselwörter fett**; Hintergrund nur hinter „Mehr dazu“ / Info-Knopf.
2. **Erst tippen, dann erklären:** Der Spieler tippt zuerst auf das Ziel („Tippe auf …“), die Erklärung dazu erscheint **erst dort**, wo er gelandet ist – nicht schon vorher auf dem Weg dorthin.
3. **Hofplan richtig erklären** (Kapitel „Hofausbau“, Aufnahme 9: „die komplette Bedienung des Hofplans wurde nicht erklärt, der Spieler konnte nichts testen und wurde nicht durch die Kreissymbole geleitet“): Gebäude antippen → Kreis → Reparieren/Ausbauen/Anbauen/Namen/Abreißen/Infos; Bauland antippen; Ziehen/Drehen; Blaupause + ✔-Bestätigung mit Preis/Bauzeit. Der Spieler soll jedes davon einmal selbst tun (mit Rücknahme-Möglichkeit).
4. Pferdeköpfe der Reiter im Plan beginnen **oben links** im Gebäude/der Anlage (Dome, Aufnahme 9; `planReiterKoepfe`).

## Etappen
- **T-A: Textstil + Pilotkapitel.** Regeln festlegen (max. 2 Sätze je Schritt, Schlüsselwörter `<b>`, Rest in „Mehr dazu“), Kapitel 1 „Versorgen und Pflegen“ und 2 „Richtig füttern“ des Anfänger-Tutorials umschreiben. Dome sieht sich den Stil an.
- **T-B: restliche Anfänger-Kapitel** (3–15) im selben Stil.
- **T-C: Fortgeschrittene** (9 Kapitel) und **Experten**.
- **T-D: „Erst tippen, dann erklären“.** In `TUT`/`TUT_FORT`/`TUT_EXP` stehen Titel/Text je Schritt; Schritt-Feld S[4]/S[5] regeln, was zusätzlich erlaubt ist. Umbau: die Blase vor dem Antippen nur noch „Tippe auf X“ (kurz), die Erklärung wird als nächster Info-Schritt **nach** dem Antippen gezeigt (`tutIn`/Schritt-Hook). Betrifft viele Schritte – zusammen mit T-A bis T-C schreiben, nicht getrennt.
- **T-E: Hofplan-Kapitel neu** (siehe Ziel 3), Reiterköpfe oben links.
- **T-F: Test.** Tutorial-Spieler anf/fort/exp in 390×844, 844×390, 1366×768 (nur zusammen mit dem großen Test oder auf Domes Ansage), `tests/tutorial-test.js`.

## Offene Punkte, die ins gleiche Paket passen
- „Kapitel wiederholen“ setzt Box und Lager zurück (Aufnahme 9, Kap. 2): Wiederholen soll den Stand des Kapitels herstellen, ohne gekauftes Futter/Einstreu zu verlieren.
- Bürste im Tutorial 1.8 (nicht nachgestellt) – mit echtem Gerät prüfen.
- „✔ weiter“ links statt rechts – seit v850 behoben.
- Sprechblasen verdecken sich (Kap. 4.1 „Woran du es merkst“): Blasen im Stall nacheinander statt gleichzeitig.
- „Sarkoid“-Text mit ⚠️ im Tierschutz: kurz erklären, was das Zeichen bedeutet (Befund beim ersten Blick).

## Aufwand und Modell
Groß (T-A bis T-F zusammen mehrere Sitzungen). Empfehlung: Opus für T-D/T-E (Mechanik und Hofplan), Sonnet für die reine Textarbeit T-A bis T-C. Vorher Überblick und ein klares „Ja“ von Dome (Regel „Wie weit allein“).
