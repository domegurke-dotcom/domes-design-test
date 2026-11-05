# Offene Fragen an Dome

Nur noch Fragen, die **nicht** beantwortet sind. Beantwortete Fragen werden entfernt (Domes Antworten stehen dann im jeweiligen Plan als Aufgabe).
Zu jeder Frage steht die Lösung, die Claude vorerst gewählt hat.

## Noch offen – bitte entscheiden
Die offenen Punkte stehen in den Abschnitten darunter. Zeichen-Aufgaben stehen in `BEI-INKSCAPE-BEARBEITEN.md`, große Themen in `PROJEKT-CHAT.md`.

## Nachtrag 23.10.2026 (Claude Team)
- **Thema Spieltempo abstimmen (Dome 23.10.; 5.11.: „neuer Testlauf, nicht jetzt, später“):** Tempo 4/7/10 muss insgesamt besser aufeinander abgestimmt werden – Krankheitsrisiko und Heilzeit (Studie: bei Tempo 10 ≈ 2,8 Befunde/Pferd/Jahr gegen ≈ 1,8 bei Tempo 7, Heilung 7 statt 3,5 Tage, 2 von 6 Läufen mit Tierhalteverbot), außerdem Pensionseinnahmen usw. Noch nichts geändert; gemeinsam mit Dome durchgehen (Zahlen: `STUDIE`-Läufe `TEMPO=… EXPERTE=1 STUFEN=2 tests/gesundheit-studie.js`).

## Nachtsitzung 23.10.2026 (Claude Team) – Hinweis zu Tests
- **Hinweis (Dome 5.11.: „testen und lösen, nachher“):** `tests/weiden-oberflaeche-test.js` hängt (Zeitüberschreitung) – auch schon vor dieser Sitzung, der Test ist veraltet. `tests/tutorial-test.js` hat einen roten Punkt („Danach Immobilienmenü, Testhof weg …“), ebenfalls schon vorher. Beide später prüfen und reparieren.

## Seltene Farben (Claude Team, 23.10.2026) – Rest
- **Traumfarben-Liste:** schon seit v733 im Code (Dominant White, Creme, Silber, Splash, Sabino, Leopard, Roan, Tobiano, Overo, Brindle, Falbe; beim Fjord auch Rot-/Mausfalbe; je Rasse nur die, die dort selten sind). In Domes Abnahme am 5.11. bestätigt. Nichts offen, außer Dome will Kombinationen ergänzen.

## Whiteboard und Orte (Claude Team, v764) – Stand nach Domes Antworten 5.11.
- **Rückfrage beim Rausstellen (getestet, echtes Spiel):** Plan „bleibt in der Box“ + Klick auf Weide → das Fenster „Im Whiteboard eintragen: Täglich / Alle 2 Tage / Nur heute“ kommt ✓. Sagt der Plan Weide, nimmt das Spiel die Weide aus dem Plan (seit v720, keine Hand-Auswahl), also kann man dort keine andere Weide wählen – die vermutete „Lücke Weide 1 / Weide 2“ gibt es nicht. Plan Sandpaddock und Klick auf Weide (oder umgekehrt) fragt vorher „Laut Whiteboard anders geplant“ (nach Code, nicht durchgespielt).
- **Pferd zurück in die Box holen (Dome 5.11.):** Steht im Whiteboard „Weide“, bleibt der Plan „Weide 1“ stehen (nur für heute in der Box). Zwischen Boxen ziehen ändert das Whiteboard (so schon gebaut). **Offen – zur Bestätigung:** Bei Whiteboard „Box“: ist der Wunsch nicht erfüllt, weil das Pferd draußen steht, soll das im Boxen-Whiteboard angezeigt werden (z. B. kleines Zeichen „Plan: Box – heute draußen“). Ist das so gemeint?
- **Neu gewünscht (Dome 5.11., „ja, aber erst nachher“):** neue Kreisauswahl „Fohlen“ links in der Box-Ansicht; erscheint bei einer Stute mit Fohlen bei Fuß und bei Waisenfohlen; roter Punkt = Fohlen-ABC bzw. „Duschen üben“ heute noch nicht gemacht, grüner Punkt = erledigt; **„Duschen üben“ nur anzeigen, wenn ein Waschplatz gebaut ist.** Braucht Hinweisblase, Stufen-Eintrag, Tutorial-Stück, Enzyklopädie-Eintrag und Tests. Steht als Nr. 29 in `Themenliste.md`.
## Hofplan (Claude Team, 24.10.2026) – Stand nach Domes Antworten 5.11.
Alles bestätigt oder erledigt. **Verkauf von Bauland, Weideland und Hof jetzt 95 %** (`HOF_VERKAUF` 0,95, v944; vorher 90 %; Dome 5.11. nach Recherche: Verkäufer zahlen real meist Makler ca. 3,57 %, Notar und Grunderwerbsteuer der Käufer, Nettoerlös ca. 95–97 %).
## Sitzung 27.10. (Claude Pro) – noch offen
- **Noch nicht gebaut (Dome 5.11.):** Der Mitarbeiter-Kalender ist gebaut, nur die Deckstation-Termine fehlen – im Projekt (Deckhengst/Deckstation) besprechen. Schlechter Sattel als Schub-Auslöser kommt in das Projekt „Ausrüstung und Sachpreise“ (Themenliste Nr. 13).
- **Texte So verläuft es** (neun chronische Krankheiten, Liste `CHRON` im Code) – Dome liest durch.

## Lizenzen / Trainer-Scheine (Dome 5.11.)
Keine Frage mehr hier: Trainer A–C sind für Amateure, nicht für gelernte Pferdewirte. Das Thema steht jetzt bei den Projekten (PROJEKT-CHAT.md Punkt 30, Themenliste.md Nr. 27 zusammen mit Nr. 24), mit dem Vermerk, dass vorher echt recherchiert wird.

## Gangpferdestall (v884/v885, Claude Pro 27.10.) – Stand nach Dome 5.11.
Ovalbahn-Preise und -Maße sowie Gangpferd = Tölt oder Pass ab 4 Jahren mit Nenngeld ×0,5 und Training ×1,2: von Dome bestätigt (5.11.).
- **Rennbahn-Info:** nannte 0,8 ha, der Code rechnet 2 ha (`PLATZ.rennbahn`). Real: keine allgemeine Norm gefunden; 1.000 m Umlauf × 20 m Breite = 2 ha ist plausibel. **Text in v944 auf 2 ha geändert.**
- **Pferdewirt Spezialreitweisen (Dome 5.11.: „nicht einstellbar → ändern“, dann „Westernbauten nur für Experten: ja“):** schon so seit v886 – Rennbahn, Ovalbahn und Trail-Parcours sind für Fortgeschrittene gesperrt (`bauen: "ohneRenn"`) und die Berufe Renntrainer und Pferdewirt Spezialreitweisen auch (`ma: "ohneTrainer"`); der Hinweis von v884/885 war überholt. Nichts zu ändern.
- Offen: Hinweisblase für den Gangpferdestall fehlt (Dome 5.11.: später).
- Nächstes Thema laut Dome: Lizenzen (`PROJEKT-CHAT.md` Punkt 30) – erst im Projekt-Chat planen.
## Gehälter der Mitarbeiter (Dome 27.10., umgesetzt v892–v894) – selbst gesetzte Zahlen
**Umgesetzt in v892 (30.10.)**, auch der Pfleger steigt nach Wissensstand (Dome). Selbst gesetzte Zahlen: Pfleger 250 + 10 € je Zuschlag, Pferdewirte 400 (Reitausbildung/Spezialreitweisen/Rennen 450) + 20 € je Zuschlag; Brief ab 20 € Unterschied, Zustimmen +5 / Ablehnen −8 Zufriedenheit und 2 Jahreszeiten Pause, keine Antwort −4. Pferdewirtschaftsmeister: Dome 30.10. „sinnvoll anpassen“ → v893/v894 Grundgehalt 750 € (Dome) + 25 € je Zuschlag (selbst gesetzt).

## Sitzung 30.10. (Claude Team) – Farben und Gene v915–v918 – Stand nach Dome 5.11.
Von Dome bestätigt (5.11.): nd1-Häufigkeit je Rasse, Smoky Black leicht bräunlich, Champagne-Häufigkeit (Quarter/Paint .004, Appaloosa .003), Hellfuchs (Sandy Chestnut) ≈ 25 % der Fuchsfohlen.
- **Zu Hellfuchs (Dome 5.11.: „sind das auch in real Hellfalben beim Norweger?“):** Nein, das sind zwei getrennte Dinge: Hellfuchs ist ein hellerer Rotton bei Füchsen (kein Falb-Gen). Der Fjord ist in echt immer ein Falbe (Dun) in fünf Schattierungen laut Rassestandard (u. a. Braunfalbe, Rotfalbe, Graufalbe, Gelbfalbe, Weißfalbe); Häufigkeiten je Schattierung habe ich nicht gefunden. Die Fjord-Hellfalbe im Spiel hängt am Falbton (`ex.ton`), nicht am Hellfuchs.
- **Splashed White (Dome 5.11.: „ich brauche was Reales“, dann „ja“ zur Kopplung an die Weißausdehnung) – umgesetzt in v944:** Es gibt keine veröffentlichten Prozentzahlen (Hauswirth et al. 2012, Wikipedia gelesen). Belegt ist nur: viele oder die meisten Splash-Pferde hören normal, „einige, aber nicht alle“ sind taub, vor allem sehr weiße; ein ganz weißes Pferd mit zwei Splash-Varianten war taub. **Im Spiel jetzt:** Taubheit nur bei Splash-Pferden mit viel Weiß (15 %) oder fast weiß (40 %), bei zwei Splash-Allelen mindestens 50 %, SW2 mal 1,5 (`TAUB_STUFE`, `TAUB_ZWEI`, `TAUB_SW2`; vorher fest 8 %/20 %/SW2 40 %). **Alle Zahlen bleiben Schätzungen** – im Test (rund 600 Pferde): wenig/typisch Weiß 0 %, viel Weiß 11 %, fast weiß 36 %.
## Reste aus den gelöschten Plan-Dateien (5.11.2026, Fly – Aufräumen der PLAN-*.md; Originale im Git-Verlauf, auf dem Branch `projekt-archiv-sicherung` und im Sicherungsordner; weiteres Offenes: `arbeitsordner\Projekte\01-Projektchat\Offenes-und-Infos-aus-den-Auftraegen.md`)
- **Hinweise/Stufen (aus PLAN-HINWEISE):** Stufen gelten nur für neue Spiele (`spiel.stufenAn`); Tutorial-Band im Handy quer liegt ca. 30 px über dem Boxbild. Die Stufen-Tabelle und die Abnahme der Hinweise/Tutorials sind von Dome am 5.11. bestätigt.
- **Mitarbeiter-Kalender (aus PLAN-MITARBEITER):** noch ohne Deckstation-Termine (Stand v875).
- **Offenstall, nicht gebaut (aus PLAN-OFFENSTALL):** Gruppen-Übung (steht in PROJEKT-CHAT.md Punkt 27), eigene Gruppen-Kachel mit Blättern in der Stallansicht, Gruppenüberschriften im Whiteboard, Tutorial-Info.
- **Tutorial-Umbau** (`PLAN-TUTORIAL-UMBAU.md` bleibt): T-F offen, Offene Punkte stehen dort.
- **Eimerbild** (`PLAN-EIMERBILD.md` bleibt): wartet auf die 3D-Eimer.