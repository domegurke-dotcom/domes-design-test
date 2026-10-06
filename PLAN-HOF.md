# Auftrag für die Coding-Sitzung: Hof-Ausbau (Stand 6.10.2026, Code v208)

## Stand der Umsetzung

Plan gespeichert bei Spielversion 208. **Noch nicht starten:** erst nach Fütterung F5. Dann Dome fragen „Mit Hof-Ausbau H1 weitermachen?“ und auf Domes Ja warten.

- [ ] Etappe H1 – Neuer Spielstart, Immobilien-Menü, Kredit (groß)
- [ ] Etappe H2 – Hof-Struktur, Land, Hofplan (groß)
- [ ] Etappe H3 – Bauen, Stufen, Verfall (groß)
- [ ] Etappe H4 – Umbau-Folgen (mittel)
- [ ] Etappe H5 – Pension und Einsteller (groß)
- [ ] Etappe H6 – Weiden, Gras, Futterwiese, Einstreu (mittel)
- [ ] Etappe H7 – Stallarten: Bedingungen, Vorteile, Strafe (groß)
- [ ] Etappe H8 – Hausturnier und Verkaufsrennen (mittel)

---

Von Dome geplant und bestätigt. Details und Begründungen: `werte/hof-ausbau-ideen.md` im Projektordner. Turnier-Stand, auf dem das aufbaut: `werte/turniere-stand-v208.md`.
Wie immer: in Etappen umsetzen, nach jeder Etappe testet Dome (Handy und PC). Vorher Aufwand je Etappe einschätzen.

**Zuerst:** Diesen Plan als `PLAN-HOF.md` ins Repo speichern und auf `main` hochladen. In `PLAN-FUETTERUNG.md` einen Hinweis ergänzen, dass `PLAN-HOF.md` (Etappen H1–H8) nach Fütterung F5 kommt. Dome kurz bestätigen, dass der Plan gespeichert ist. Am Ende jeder Etappe sagen, was fertig und was offen ist, und die Etappe in `PLAN-HOF.md` abhaken. Neue Systeme in `CLAUDE.md` unter „Wichtige Spielsysteme“ und in der Enzyklopädie (Berechnungen zum Nachschlagen) nachtragen.

**Jetzt nur speichern, noch nicht umsetzen.** Reihenfolge (Dome): Werte-Etappen 3 → Krankheiten A–H mit Azubi-Nachtrag → Werte-Etappen 4–6 (inkl. 6c Fohlenschau) → Fütterung F1–F5 → **dieser Hof-Ausbau H1–H8**. Nach Fütterung F5 Dome fragen „Mit Hof-Ausbau H1 weitermachen?“ und auf Domes Ja warten.
Voraussetzungen: Mitarbeiter und Stallart-Feld (Azubi-Nachtrag, jetziger Hof gilt dort als Zuchtstall – wird hier ersetzt), Befunde/Ansteckung/Quarantäne-Ankerpunkt (A–H), Herde/Sozialverhalten (2b), Training daheim und Turniere (4–6), Futterkammer mit Feld für Lagergröße (F1).

**Wichtig – Speicherstände:** Ausnahme von der Regel „abwärtskompatibel“: Alte Spielstände werden gelöscht (Dome, bewusst entschieden). Beim Laden eines alten Stands Hinweis „Für den Hof-Ausbau ist ein neues Spiel nötig“, dann neu starten.

**Bestand heute:** Startgeld 5.000 €, Boxen per + / − in der Boxenübersicht, Hofverwaltung mit Hof, Finanzen, Außer Haus (externe Aufzucht/Ausbildung), Mitarbeiter, Postfach, Einstellungen; externer Gnadenhof (`spiel.gnadenhof`); Turniere für alle offen.

## Etappe H1 – Neuer Spielstart, Immobilien-Menü, Kredit (groß)
1. Startmenü - Neustart → Charakterauswahl (ohne Hofname) → Immobilien-Menü statt Hauptmenü.
2. Immobilien als große, schöne Kacheln (blasses Bild eines Reiterhofs). Am Anfang nur kaufbar: „Alter Pensionsstall“ (6 baufällige Boxen = Stufe 1, Reitplatz, Gelände, ca. 2 ha: Hofstelle mit Reitplatz + 1 ha Weide). Alle anderen ausgegraut.
3. Kauf: Preis 20.000 €. Startkapital 15.000 €: 10.000 € Eigenanteil, 10.000 € Kredit → 5.000 € bleiben. Hofname wird beim Kauf eingegeben. Danach normales Hauptmenü.
4. Kredit: ca. 4 % Zinsen, Rate jede Jahreszeit über 5 Jahre (ca. 550 €). Nicht bezahlt → Mahnung wie bei Rechnungen; nach 3 verpassten Raten Zwangsversteigerung des Hofs (Spiel verloren). Weitere Kredite unter Hauptmenü - Hofverwaltung - Finanzen - Bank.
5. Ausgegraute Immobilien werden frei, wenn der erste Kredit zur Hälfte abbezahlt und genug Eigenanteil da ist.
6. Start immer als Pensionsstall.

## Etappe H2 – Hof-Struktur, Land, Hofplan (groß)
1. Bis zu 5 Ställe, jeder ein eigener Standort mit eigenen Anlagen (nichts wird geteilt) und eigener Kasse. Alle laufen real parallel und werden im Immobilien-Menü gemeinsam verwaltet (Wechsel zwischen den Höfen).
2. Neuer Standort: leeres Grundstück oder fertiger Hof vom Makler (Zustand zufällig); das Angebot wechselt 1× im Jahr.
3. Hauptmenü - Hofverwaltung - Hof bekommt die Bereiche Hofplan, Bauen, Land, Futterkammer.
4. Land: kaufen 1.000 €/ha oder pachten 20 € je ha und Jahreszeit.
5. Geld zwischen Höfen nur über Spenden an den eigenen Gnadenhof und interne Rechnungen (eigener Ausbildungsstall berechnet nur den Selbstkostenpreis: Futter, Einstreu, Lohnanteil, ohne Gewinn).
6. Pferde ziehen per Pferdeanhänger zwischen eigenen Höfen um (neues Ziel „eigener Hof“ in `ANHAENGER`/`ANH_ZIEL`, beide Anhänger). Mitarbeiter gehören immer zu einem Hof.

## Etappe H3 – Bauen, Stufen, Verfall (groß)
1. Neubau nur als ganzes Gebäude oder Abschnitt, keine einzelnen Boxen (das + / − in der Boxenübersicht entfällt). Stallgebäude: Erstbau 6 Boxen, Anbau 4, mehr in 2er-Schritten wählbar. Paddockboxen ebenso (Erstbau 6, Anbau 4).
2. 3 Stufen (baufällig, ordentlich, komfortabel): wirken auf Wohlbefinden, Verletzungsrisiko, Mitarbeiter-Zufriedenheit und Pensionspreis.
3. Baubar (Preise Stufe 1 / 2 / 3):
   1. Stall Erstbau 6 Boxen 2.400 / 3.800 / 6.000 €, Anbau 4 Boxen 1.600 / 2.600 / 4.000 €, je 2 Boxen mehr 800 / 1.300 / 2.000 €
   2. Paddockboxen 6 Stück 3.100 / 5.000 / 7.800 €, Anbau 4 Stück 2.100 / 3.300 / 5.200 €
   3. Reitplatz 2.000 / 3.000 / 4.500 €, Roundpen 400 / 700 / 1.000 €, Trail-Parcours 500 / 800 / 1.200 €
   4. Reithalle 10.000 / 15.000 / 22.000 €
   5. Rennbahn (nur Rennstall, Sand oder Gras wählbar): Sand 6.000 / 9.000 / 13.000 €, Gras 4.500 / 7.000 / 10.000 €
   6. Weide einzäunen je ha 200 / 300 / 450 €, Sandpaddock 300 / 500 / 700 €, Waschplatz 300 / 500 / 800 €, Sattelkammer 500 / 800 / 1.200 €
   7. Futter- und Strohlager 1.500 / 2.500 / 4.000 € (höhere Stufe = mehr Platz, weniger Verderb; nutzt das Lagergrößen-Feld aus F1)
   8. Quarantänestall 2 Boxen 1.500 / 2.400 / 3.600 € (Neuzugänge dort: kein Ansteckungsrisiko)
   9. Abfohlbox einzeln 600 / 900 / 1.400 €; im Zuchtstall 5 Abfohlboxen 2.500 / 4.000 / 6.000 €; Aufzucht-Offenstall mit Fohlenweide 3.000 / 4.500 / 7.000 € + Land
   10. Futterwiese = Land + Weide einzäunen
4. Bauzeiten (Standardtempo, 1 Jahr = 4 Jahreszeiten): Roundpen, Sandpaddock, Waschplatz, Weide einzäunen 2–3 Tage; Paddockbox-Abschnitt, Sattelkammer, Abfohlbox ½ Jahreszeit; Stallabschnitt, Reitplatz, Lager, Quarantänestall 1 Jahreszeit; Reithalle 2–3 Jahreszeiten; Rennbahn Sand ½ Jahreszeit, Gras ½ Jahreszeit + 1 Jahreszeit bis das Gras trägt. Im Winter ruhen Außenarbeiten (Reitplatz, Weide, Rennbahn), Innenausbau läuft.
5. Stufe erhöhen (Umbau): Preisunterschied + 20 %, immer abschnittsweise, halbe Neubauzeit, Boxen solange gesperrt.
6. Unterhalt 1 % des Baupreises je Jahreszeit. Verfall: Zustand sinkt jede Jahreszeit (Stufe 1 schneller); Reparatur durch Hofhelfer (Mitarbeiter-Plan) oder Handwerker (ca. 10 % des Baupreises).
7. Start-Hof: Reitplatz und Gelände. Longieren auf dem Reitplatz möglich (kein Roundpen), stört aber andere Reiter, z. B. Einsteller (Zufriedenheit sinkt). Roundpen und Reithalle müssen gebaut werden.

## Etappe H4 – Umbau-Folgen (mittel)
1. Einsteller bekommen 1 Jahreszeit vorher einen Brief. Umzug in freie Boxen/Paddockboxen; sonst wählt der Spieler je Einsteller: 30 % Nachlass (Pferd übergangsweise auf Weide/Sandpaddock) oder Vertrag ruht (keine Einnahme). Ohne Lösung sinkt die Zufriedenheit stark, manche kündigen.
2. Baulärm stresst nervöse Pferde im ganzen Hof (Wohlbefinden etwas niedriger), alte Pferde auf dem Gnadenhof stärker.
3. Eigene Pferde ohne freie Box → Weide/Sandpaddock oder per Anhänger zum anderen eigenen Hof. Fehlt eine Stallart-Bedingung nur wegen des Umbaus, ruht die Frist.
4. Zuchtstall: Abfohlboxen nicht umbaubar, solange eine Stute in der letzten Jahreszeit vor der Geburt ist (Warnung). Umbau Aufzucht-Offenstall → Fohlen auf Fohlenweide oder gegen Geld in externe Aufzucht.
5. Ausbildungs-/Westernstall: Kundenpferde wie Einsteller. Umbau Reitplatz/Halle → Training nur Roundpen/Gelände, langsamer lernen. Rennstall: Umbau Rennbahn → nur Gelände, Rennform sinkt etwas. Gnadenhof: Spendenaufruf für den Umbau bringt einmalig mehr Spenden.

## Etappe H5 – Pension und Einsteller (groß)
1. Einsteller fragen per Brief an, wenn Boxen frei sind; Häufigkeit nach Stufe, Anlagen (Halle, Roundpen), Ansehen, Preis und Hofregeln.
2. Pensionspreis je Box und Jahreszeit: Richtwert Stufe 1 ca. 150 €, Stufe 2 ca. 250 €, Stufe 3 ca. 400 €; Spieler kann anpassen, teurer = weniger Anfragen.
3. Pensionspferde: echte Pferde mit Steckbrief, nicht verkaufbar/züchtbar/trainierbar. Spieler (oder Mitarbeiter) füttert, tränkt (Eimer), mistet, Weidegang. Besitzer legt fest: Weide oder Sandpaddock. Hengste nur in Paddockboxen oder – wenn mehrere Sandpaddocks da sind – im Sandpaddock mit einem Wallach.
4. Besitzer kommen selbst zum Putzen und Reiten und belegen dabei den Reitplatz.
5. Zusatzleistungen gegen Aufpreis (nur wenn angeboten; jeder Einsteller bucht unabhängig und unterschiedlich): putzen, Pferdepfleger, bewegen (Bereiter), Decke wechseln, Medikamente geben, Paddockbox statt Box, bessere Einstreu.
6. Versteckte Zufriedenheit je Einsteller (wie Ansehen, nur Admin sieht Zahl): sinkt durch Hunger, Mist, Verletzung, Ansteckung, vollen Reitplatz/Longieren, Umbau ohne Lösung; steigt durch Stufe, Halle, Service, Hausturniere. Niedrig → Beschwerdebrief → Kündigung zum Ende der Jahreszeit.
7. Krankes Pensionspferd: Brief an den Besitzer, der zahlt den Tierarzt. Hofregel Bluttest: vorher einreichen / nachreichen / nicht nötig – strenger = weniger Anfragen, weniger Ansteckungsrisiko.
8. Bezahlung automatisch zu Beginn jeder Jahreszeit, manchmal verspätet (Mahnung wie bei Rechnungen). Finanzen: eigene Zeile „Pension“.

## Etappe H6 – Weiden, Gras, Futterwiese, Einstreu (mittel)
1. Weidebedarf 0,5 ha je Großpferd, 0,25 ha je Pony/Kleinpferd. Mehrere Weiden je Hof, jede mit eigener Gruppe; Spieler teilt zu; Herdenregeln (Etappe 2b) gelten je Weide.
2. Grasstand je Weide 0–100 % als Balken. Nachwachsen: Frühling stark, Sommer mittel, Herbst wenig, Winter nicht.
3. Überbesetzt: Gras schneller weg; leer → Heu zufüttern, sonst hungrig. Trittschäden/Matsch → mehr Mauke und Strahlfäule, mehr Wurmdruck und Streit; Weide erholt sich langsamer.
4. Weidepflege: abäppeln (senkt Wurmrisiko; Spieler oder Pferdepfleger), Weide sperren/ruhen lassen, im Frühling nachsäen.
5. Futterwiese (ca. 0,5 ha je Pferd für Winterheu): Bauer mäht 1–2× im Sommer gegen Lohn, Heu ins Heulager so viel hineinpasst, Rest an den Bauern verkaufen. Ohne Futterwiese Heu beim Bauern kaufen.
6. Hufrehe-gefährdete Pferde: Warnung im Frühling, wenn sie auf der Weide statt im Sandpaddock stehen.
7. Haltung je Pferd: Box, Paddockbox (Sand, rein/raus nach Lust), Weide (Herde), Sandpaddock.
8. Einstreu: Stroh (günstig, staubt, wird angeknabbert), Späne (staubarm, mittel), Pellets (sehr saugfähig, staubarm, teurer), Leinstroh/Hanf (staubarm, teuer). Staub → Husten (besonders „empfindliche Atemwege“ aus F4), nass/schlecht gemistet → Strahlfäule. Lager im Strohlager, täglicher Verbrauch beim Misten, Kauf beim Bauern oder in der Futterkammer; leer → ohne Einstreu, Wohlbefinden sinkt.

## Etappe H7 – Stallarten: Bedingungen, Vorteile, Strafe (groß)
1. Stallart je Hof frei wählbar (auch mehrmals dieselbe): Pensionsstall, Zuchtstall, Ausbildungsstall, Gnadenhof, Rennstall, Westernstall (Gangpferdestall später). Ersetzt das vorbereitete Stallart-Feld aus dem Azubi-Nachtrag (Fachrichtungen, Bewerber je Stallart).
2. Bedingung nicht mehr erfüllt → Warnbrief, 1 Jahreszeit Frist → Statusverlust und Rückzahlung der Förderung des letzten Jahres („hohe Strafe“).
3. Je Stallart:
   1. Pensionsstall: Bedingung mind. die Hälfte der Boxen an Einsteller. Vorteile: mehr Anfragen, Zusatzleistungen, Pferdewirt Haltung und Service, Hausturniere.
   2. Zuchtstall: mind. 1 Deckhengst, 2 Zuchtstuten, Abfohlbox(en), Aufzucht-Offenstall. Vorteile: Laborrabatt 25 %, eigene Hengste als Deckhengst für fremde Stuten (Decktaxe-Einnahmen), günstigere Fohlenauktion, Fohlen wachsen in der Herde auf. Aufzucht-Offenstall: bis zu 10 Fohlen + mind. eine ältere Stute ohne Fohlen; Durchschalten wie bei den Boxen, aber mit eigenem Hintergrund (alle zusammen im Offenstall); ersetzt die externe Aufzucht, kostet nur Futter, Sozialverhalten steigt wie in der Aufzuchtstation. Ohne Zuchtstall gibt es nur eine einzelne Abfohlbox.
   3. Ausbildungsstall: Reitplatz + Roundpen oder Halle, mind. 1 Bereiter. Vorteile: fremde Pferde zur Ausbildung annehmen (Einnahmen), eigene Pferde lernen schneller, Hausturniere mit E und A, später Reitunterricht. Eigene Pferde anderer Höfe zum Selbstkostenpreis.
   4. Gnadenhof: nur alte, kranke oder Notfallpferde, keine Zucht, kein Verkauf. Vorteile: Spenden (Briefe), Patenschaften, Tierarztrabatt, Spenden der eigenen anderen Höfe, Ansehen beim Tierschutz. Der externe Gnadenhof bleibt zusätzlich bestehen.
   5. Rennstall: Rennbahn, mind. 2 Rennpferde, Rennpferdetrainer. Vorteile: keine Trainergebühr (ohne Rennstall ca. 100 € je Rennen), halbes Jockey-Reitgeld, Verkaufsrennen, Jockeys.
   6. Westernstall: Reitplatz mit Trail-Parcours, mind. 2 Westernpferde, Westerntrainer. Vorteile: schnelleres Westerntraining, halbes Nenngeld bei Westernturnieren, später Westernunterricht.
4. Turniere bleiben für alle offen; die Stallart bringt nur Vorteile, keine Sperre.

## Etappe H8 – Hausturnier und Verkaufsrennen (mittel)
1. Hausturnier (Pensions- und Ausbildungsstall): 1× je Jahreszeit auf dem eigenen Hof, Termin im Turnierkalender. Prüfungen vom Hofturnier (Wettbewerbe, Gelassenheit), Ausbildungsstall zusätzlich E und A. Bedingung: Reitplatz, im Winter Reithalle. Kosten 300–600 € (Richter, Parcours). Einnahmen: Nenngelder der Gaststarter (Starterfeld wie bei Turnieren). Folgen: mehr Ansehen, neue Einsteller-/Beritt-Anfragen; eigene Pferde und Pferde der Einsteller starten mit (Einsteller zufriedener).
2. Verkaufsrennen (nur Rennstall): Prüfung an Renntagen. Jedes Pferd startet mit festem Verkaufspreis; nach dem Rennen kann jeder es zu diesem Preis kaufen – das eigene kann also weg sein (Brief, Geld kommt), fremde Starter kann man kaufen.

## Später / nicht in diesem Plan
1. Gangpferdestall (wenn es mehr Gangpferderassen gibt), Trabrennbahn (mit Rasse Traber).
2. Ausrüstung (eigener Plan), Sattelkammer dann mit Funktion.
