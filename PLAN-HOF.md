# Auftrag für die Coding-Sitzung: Hof-Ausbau (Stand 6.10.2026, Code v208)

## Stand der Umsetzung

Plan gespeichert bei Spielversion 208. **Noch nicht starten:** erst nach Fütterung F5. Dann Dome fragen „Mit Hof-Ausbau H1 weitermachen?“ und auf Domes Ja warten.

**Domes Ja liegt vor (7.10.2026, Spielversion 220):** Fütterung F1–F5 und alle offenen Fragen dazu sind fertig. In einer neuen Sitzung mit **H1** starten. Nach jeder Etappe testen, hochladen, Testlink erneuern, Dome eine Test-Anleitung geben. Volumen-Schätzung: H1–H4 sicher, H5 vielleicht, H6–H8 eher im nächsten Volumen. **Danach** (nach H8) kommen die fehlenden Veredler-Rassen (Notiz unten in `OFFENE-FRAGEN.md`).

- [x] Etappe H1 – Neuer Spielstart, Immobilien-Menü, Kredit (groß) – v221, von Claude per Skript getestet, Domes Test steht noch aus
- [x] Etappe H2 – Hof-Struktur, Land, Hofplan (groß) – v222, von Claude per Skript getestet, Domes Test steht noch aus
- [x] Etappe H3 – Bauen, Stufen, Verfall (groß) – v223, von Claude per Skript getestet, Domes Test steht noch aus
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

## Domes Testanmerkungen (6.10.2026 abends) – vor bzw. mit H5 abarbeiten
- [x] T1 Fehler: Stute mit Fohlen bei Fuß kaufen (Markt, Tierschutz …): vor dem Kauf zeigt Nachkommen/Abstammungsschein des Fohlens eine andere Mutter und andere Genetik; erst nach dem Kauf passt es. Fohlen muss immer das echte Fohlen der Stute sein (klein–mittel, ca. 3 %)
- [ ] T2 Stall → Bauen als eigenes Fenster mit Rücksprung zum Stall (klein, ca. 2 %)
- [x] T3 stb – Eigenschaften: Hinweise „angeboren“/„erarbeitet“ nur im Adminmodus (klein, ca. 1 %)
- [x] T4 stb – asb – Disziplinen: Charakter-Zeile verständlicher („temperamentvoll +, nervös −“ = Regel, „+5 %“ = Wirkung bei diesem Pferd) (klein, ca. 1 %)
- [ ] T5 hvw – Hof – Futterkammer: Einkaufskorb mit Gesamtsumme; Korb öffnen → Liste mit Preisen, einzeln entfernen, Summe, Kauf bestätigen/abbrechen, Rücksprung zur Futterkammer (mittel, ca. 4 %)
- [x] T6 Futterkammer: nach Klick auf +kg nicht nach oben springen (klein, ca. 1 %)
- [x] T7 Box – Menü ☰: unter „Hauptmenü“ „Hofverwaltung“ einfügen, „Postfach“ entfernen (klein, ca. 1 %)
- [ ] T8 Charakter – Vorlieben: Grundbedürfnisse (Putzen, Füttern …) bei Abneigung nur sehr geringer Malus, nie schlechter als vorher; Vorlieben bedienen wirkt aufs Vertrauen; hohes Vertrauen schwächt Abneigungen (mittel, ca. 4 %)
- [ ] T9 asr – Putzkiste: „Streicheln“ wie Bürste/Kamm (Wischen) und als Vorliebe im Charakter (mittel, ca. 4 %)
- [x] T11 Futterplan: Info-Knopf ℹ️ zu den Mahlzeiten (was bewirken 2 oder 3) (klein)
- [ ] T10 Krippe gefüllt, dann Weide: Futter darf nicht verloren gehen (Vorschlag siehe Chat, Domes Antwort abwarten) (klein, ca. 2–3 %)

## Etappe H1 – Neuer Spielstart, Immobilien-Menü, Kredit (groß)
1. Startmenü - Neustart → Charakterauswahl (ohne Hofname) → Immobilien-Menü statt Hauptmenü.
2. Immobilien als große, schöne Kacheln (blasses Bild eines Reiterhofs). Am Anfang nur kaufbar: „Alter Pensionsstall“ (6 baufällige Boxen = Stufe 1, Reitplatz, Gelände, ca. 2 ha: Hofstelle mit Reitplatz + 1 ha Weide). Alle anderen ausgegraut.
3. Kauf: Preis 20.000 €. Startkapital 15.000 €: 10.000 € Eigenanteil, 10.000 € Kredit → 5.000 € bleiben. Hofname wird beim Kauf eingegeben. Danach normales Hauptmenü.
4. Kredit: ca. 4 % Zinsen, Rate jede Jahreszeit über 5 Jahre (ca. 550 €). Nicht bezahlt → Mahnung wie bei Rechnungen; nach 3 verpassten Raten Zwangsversteigerung des Hofs (Spiel verloren). Weitere Kredite unter Hauptmenü - Hofverwaltung - Finanzen - Bank.
5. Ausgegraute Immobilien werden frei, wenn der erste Kredit zur Hälfte abbezahlt und genug Eigenanteil da ist.
6. Start immer als Pensionsstall.

**Umsetzung H1 (v221) – selbst festgelegte Zahlen:** Ausgegraute Immobilien: Leeres Grundstück 5 ha 5.000 €, Resthof mit Scheune (8 Boxen, 4 ha) 35.000 €, Kleines Gestüt (10 Boxen, 8 ha) 55.000 €, Reitanlage mit Halle (16 Boxen, 6 ha) 80.000 € – Kauf erst ab H2. „Genug Eigenanteil“ = die Hälfte des Kaufpreises auf dem Hofkonto. Hofkredit-Rate genau 554,15 € (20 Raten, 1.083,07 € Zinsen gesamt). Rate wird zu Beginn jeder Jahreszeit automatisch abgebucht (erste Rate in der Jahreszeit nach dem Kauf), Mahngebühr wie bei Rechnungen (10 %, mind. 20 €) je verpasster Rate. Weitere Kredite: bis 80 % des Immobilienwerts minus Restschuld (am Anfang 6.000 €), 1.000-€-Schritte, 2/3/5 Jahre, ebenfalls 4 %, nicht bei offener Rate. Hauptmenü hat die neue Kachel „Immobilien“. Die 6 Start-Boxen tragen `stufe: 1`; + / − in der Boxenübersicht bleibt bis H3.

## Etappe H2 – Hof-Struktur, Land, Hofplan (groß)
1. Bis zu 5 Ställe, jeder ein eigener Standort mit eigenen Anlagen (nichts wird geteilt) und eigener Kasse. Alle laufen real parallel und werden im Immobilien-Menü gemeinsam verwaltet (Wechsel zwischen den Höfen).
2. Neuer Standort: leeres Grundstück oder fertiger Hof vom Makler (Zustand zufällig); das Angebot wechselt 1× im Jahr.
3. Hauptmenü - Hofverwaltung - Hof bekommt die Bereiche Hofplan, Bauen, Land, Futterkammer.
4. Land: kaufen 1.000 €/ha oder pachten 20 € je ha und Jahreszeit.
5. Geld zwischen Höfen nur über Spenden an den eigenen Gnadenhof und interne Rechnungen (eigener Ausbildungsstall berechnet nur den Selbstkostenpreis: Futter, Einstreu, Lohnanteil, ohne Gewinn).
6. Pferde ziehen per Pferdeanhänger zwischen eigenen Höfen um (neues Ziel „eigener Hof“ in `ANHAENGER`/`ANH_ZIEL`, beide Anhänger). Mitarbeiter gehören immer zu einem Hof.

**Umsetzung H2 (v222):** Bis zu 5 Höfe, jeder mit eigener Kasse, Boxen, Anlagen, Mitarbeitern, Futterkammer, Lager, Rechnungen, Krediten und Verkaufsanzeigen; alle laufen jede Nacht. Immobilien-Menü: eigene Höfe (antippen = wechseln) + Makler (1 Grundstück + 3 Höfe, wechselt jährlich). Hofverwaltung – Hof: Übersicht, Hofplan, Bauen (Hinweis auf H3), Land, Futterkammer. Land kaufen 1.000 €/ha, pachten 20 €/ha je Jahreszeit. Pferdeanhänger – Eigener Hof. Sondertilgung (Domes Wunsch nach H1). + / − in der Boxenübersicht bleibt bis H3 (Dome). Offene Punkte dazu in `OFFENE-FRAGEN.md` (Abschnitt Hof-Ausbau).

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
   7a. *(Nachtrag Claude v218, Dome 7.10.2026)* **Heudampfer** fürs Futterlager (Preis noch festlegen): setzt `spiel.anlage.heudampfer = true` – Heu wässern/bedampfen kostet dann keine Arbeitszeit mehr (beim Stallburschen sonst 1½ Boxen).
   8. Quarantänestall 2 Boxen 1.500 / 2.400 / 3.600 € (Neuzugänge dort: kein Ansteckungsrisiko)
   9. Abfohlbox einzeln 600 / 900 / 1.400 €; im Zuchtstall 5 Abfohlboxen 2.500 / 4.000 / 6.000 €; Aufzucht-Offenstall mit Fohlenweide 3.000 / 4.500 / 7.000 € + Land
   10. Futterwiese = Land + Weide einzäunen
4. Bauzeiten (Standardtempo, 1 Jahr = 4 Jahreszeiten): Roundpen, Sandpaddock, Waschplatz, Weide einzäunen 2–3 Tage; Paddockbox-Abschnitt, Sattelkammer, Abfohlbox ½ Jahreszeit; Stallabschnitt, Reitplatz, Lager, Quarantänestall 1 Jahreszeit; Reithalle 2–3 Jahreszeiten; Rennbahn Sand ½ Jahreszeit, Gras ½ Jahreszeit + 1 Jahreszeit bis das Gras trägt. Im Winter ruhen Außenarbeiten (Reitplatz, Weide, Rennbahn), Innenausbau läuft.
5. Stufe erhöhen (Umbau): Preisunterschied + 20 %, immer abschnittsweise, halbe Neubauzeit, Boxen solange gesperrt.
6. Unterhalt 1 % des Baupreises je Jahreszeit. Verfall: Zustand sinkt jede Jahreszeit (Stufe 1 schneller); Reparatur durch Hofhelfer (Mitarbeiter-Plan) oder Handwerker (ca. 10 % des Baupreises).
7. Start-Hof: Reitplatz und Gelände. Longieren auf dem Reitplatz möglich (kein Roundpen), stört aber andere Reiter, z. B. Einsteller (Zufriedenheit sinkt). Roundpen und Reithalle müssen gebaut werden.

**Nachtrag H2 (Dome, v223):** kein Startgeld mehr – zentrales Konto (Immobilien → Verwaltung), jeder Hof kann dorthin überweisen, Eigenanteil neuer Höfe kommt von dort. Briefe anderer Höfe: roter Umschlag links neben dem gelben, Post aller Höfe in der Verwaltung; Warnbrief, wenn auf einem anderen Hof nicht versorgt wurde. Zwangsversteigerung nur des betroffenen Hofs (Dome: ja).

**Umsetzung H3 (v223):** Bauen unter Hofverwaltung → Hof → Bauen (Katalog wie oben, Rennbahn/Aufzucht-Offenstall/5 Abfohlboxen erst mit H7), + / − in der Boxenübersicht entfernt (Knopf „Bauen“). Gebäude je Hof in `spiel.gebaeude` (Abschnitte: Erstbau und jeder Anbau einzeln). Umbau nur mit leeren Boxen – die Lösungen für belegte Boxen kommen mit H4. Hofhelfer als Mitarbeiter. Selbst festgelegte Zahlen in `OFFENE-FRAGEN.md`.

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

### H5 – Feinplanung (Claude, 6.10.2026 abends – Fragen unten bis Sonntag beantworten)
**Datenmodell (je Hof, in `HOF_FELDER`):**
- `spiel.einsteller` = Liste `{ eid, name, w (Frau/Mann), pid (Pferd), box (Box-Nr.), preis (je Jz), leistungen {putzen, pfleger, bewegen, decke, medizin, paddockbox, einstreu}, zufr 0–100 (versteckt, Admin sieht Zahl), seit (Jz), haltung "weide"/"sandpaddock", bluttest, kuendigt (Jz) }`.
- Pensionspferd = echtes Pferd in der Box mit `p.einsteller = eid` (`p.fremd`): Steckbrief ja; Verkaufen, Decken, Training, Anhänger, Gnadenhof gesperrt (über die vorhandenen Sperren `abgabeSperre`, `trainSperre`, Deckdialog). Box zählt als belegt.
- Hofregeln je Hof `spiel.hof.regeln = { bluttest: "vorher" | "nachreichen" | "keiner", preis: {1,2,3} }` (Pensionspreis je Box-Stufe, frei einstellbar).

**Ablauf:**
- *Täglich* (`hofNacht`): Anfrage-Chance je freier Box ≈ 3 % × Stufe (1/1,4/2) × (+30 % Reithalle, +10 % Roundpen) × Ansehen-Faktor × Preisfaktor (Richtwert = 1; 25 % teurer → halb so viele) × Bluttest (vorher 0,7 / nachreichen 0,9 / keiner 1). Anfrage kommt als Brief mit „Annehmen / Ablehnen“ (Aktion `einsteller`), Pferd kommt am nächsten Tag (Quarantänebox, wenn vorhanden; „vorher“: Bluttest liegt bei, keine eingeschleppte Krankheit).
- *Versorgung*: Spieler oder Mitarbeiter füttert, tränkt, mistet wie bei eigenen Pferden (Futter aus der eigenen Futterkammer – im Pensionspreis enthalten), Weidegang/Sandpaddock nach Wunsch des Besitzers.
- *Besitzer-Besuch*: an ~60 % der Tage, putzt (Dreck weg) und reitet → Reitplatz an dem Tag belegt; longiert der Spieler am selben Tag auf dem Reitplatz → Zufriedenheit −2.
- *Jahreszeit*: Bezahlung zu Beginn (Finanzen „Pension“), 10 % zahlen verspätet (Mahnung wie bei Rechnungen, nach 2 Mahnungen Kündigung + Zufriedenheit egal). Zufriedenheit < 35 → Beschwerdebrief, < 20 → Kündigung zum Ende der Jahreszeit.
- *Krank*: Befund beim Pensionspferd → Brief an den Besitzer (kein Brief an Spieler nötig, nur Hinweis), Tierarzt rechnet direkt mit dem Besitzer ab (keine Buchung beim Hof). Ansteckung von/zu eigenen Pferden wie gehabt.

**Zahlen (Richtwerte, in echt ca. 250–600 € im Monat, im Spiel verkleinert wie Gehälter):**
- Pensionspreis je Box und Jahreszeit: Stufe 1 **150 €**, Stufe 2 **250 €**, Stufe 3 **400 €** (aus dem Plan). Paddockbox +50 €.
- Zusatzleistungen je Jahreszeit: Putzen 40 €, Pferdepfleger (Mähne, Hufe auskratzen) 60 €, Bewegen durch Bereiter 120 €, Decke wechseln 20 €, Medikamente geben 20 €, bessere Einstreu 30 € – nur buchbar, wenn angeboten (Pfleger/Bereiter angestellt bzw. Spieler macht es selbst).
- Zufriedenheit: Start 70. Je Tag: hungrig −5, Box nicht gemistet −3, verdreckt (> ½ Jz) −1, Verletzung/Ansteckung −10 einmalig, Reitplatz belegt −2; +0,2 je Tag gut versorgt, Stufe 3 +0,2, Reithalle +0,1, gebuchte Leistung erledigt +0,3. Hausturnier (H8) +5.
- Wirkung auf Einnahmen: 6 Boxen Stufe 1 voll = 900 € je Jahreszeit (deckt Rate 304,56 € + Futter).

**Anbindung:** `HOF_FELDER` + `einsteller`; `hofNacht` → `pensionTag()`, Jahreszeit → `pensionJahreszeit()`; Briefe mit `hid`; Finanzen-Posten „Pension“, „Pension: Zusatzleistungen“; Pensionsstall-Bedingung H7 = Hälfte der Boxen an Einsteller; Pferdewirt Haltung und Service versorgt Einsteller besonders gut (+Zufriedenheit). Gesamttest: Einsteller-Boxen nie doppelt, Pension-Buchungen in der Kasse.

**Offene Fragen H5 (mit Empfehlung):**
1. Füttert der Hof das Pensionspferd aus der eigenen Futterkammer (im Preis enthalten)? *Empfehlung: ja, wie in echt (Vollpension).*
2. Darf der Spieler das Pensionspferd reiten/trainieren? *Empfehlung: nein, nur über die gebuchte Leistung „Bewegen“ (Bereiter).*
3. Sollen Einsteller-Pferde auch Hengste sein können (nur Paddockbox/Sandpaddock mit Wallach, laut Plan)? *Empfehlung: ja, selten (10 %), Anfrage nur, wenn eine Paddockbox frei ist.*
4. Zahlungsverzug: 10 % zahlen verspätet. *Empfehlung: ja, 2 Tage Ziel wie Rechnungen.*
5. Kündigungsfrist des Spielers: Kann der Spieler einem Einsteller kündigen? *Empfehlung: ja, zum Ende der Jahreszeit, Ansehen −5.*
6. Zusatzleistungen ohne Mitarbeiter: Darf der Spieler selbst „Putzen“ anbieten (dann muss er täglich putzen)? *Empfehlung: ja, mit Aufgabenliste im Stall (vergessen → Zufriedenheit −).*

## Etappe H6 – Weiden, Gras, Futterwiese, Einstreu (mittel)
1. Weidebedarf 0,5 ha je Großpferd, 0,25 ha je Pony/Kleinpferd. Mehrere Weiden je Hof, jede mit eigener Gruppe; Spieler teilt zu; Herdenregeln (Etappe 2b) gelten je Weide.
2. Grasstand je Weide 0–100 % als Balken. Nachwachsen: Frühling stark, Sommer mittel, Herbst wenig, Winter nicht.
3. Überbesetzt: Gras schneller weg; leer → Heu zufüttern, sonst hungrig. Trittschäden/Matsch → mehr Mauke und Strahlfäule, mehr Wurmdruck und Streit; Weide erholt sich langsamer.
4. Weidepflege: abäppeln (senkt Wurmrisiko; Spieler oder Pferdepfleger), Weide sperren/ruhen lassen, im Frühling nachsäen.
5. Futterwiese (ca. 0,5 ha je Pferd für Winterheu): Bauer mäht 1–2× im Sommer gegen Lohn, Heu ins Heulager so viel hineinpasst, Rest an den Bauern verkaufen. Ohne Futterwiese Heu beim Bauern kaufen.
6. Hufrehe-gefährdete Pferde: Warnung im Frühling, wenn sie auf der Weide statt im Sandpaddock stehen.
7. Haltung je Pferd: Box, Paddockbox (Sand, rein/raus nach Lust), Weide (Herde), Sandpaddock.
8. Einstreu: Stroh (günstig, staubt, wird angeknabbert), Späne (staubarm, mittel), Pellets (sehr saugfähig, staubarm, teurer), Leinstroh/Hanf (staubarm, teuer). Staub → Husten (besonders „empfindliche Atemwege“ aus F4), nass/schlecht gemistet → Strahlfäule. Lager im Strohlager, täglicher Verbrauch beim Misten, Kauf beim Bauern oder in der Futterkammer; leer → ohne Einstreu, Wohlbefinden sinkt.

**✅ Domes Antworten H5 (6.10.2026):** 1 ja (Vollpension aus eigener Futterkammer) · 2 nein (nur über „Bewegen“ durch Bereiter) · 3 ja (Hengste selten, nur mit freier Paddockbox) · 4 ja (10 % verspätet, Mahnung wie Rechnungen) · 5 ja (Kündigung zum Jz-Ende, Ansehen −5) · 6 ja (Spieler bietet selbst an, Aufgabenliste, Vergessen → Zufriedenheit −).

### H6 – Feinplanung (Claude, 6.10.2026 abends)
**Schon da (nicht neu bauen):** `weideHa`, Weide einzäunen (H3), Weide-zu-klein-Warnung (0,5 / 0,25 ha), Hufrehe-Warnung, Anweiden, Weide-Energie je Jahreszeit (`WEIDE_ENERGIE`), staubiges Heu (`staubNacht`), Futterverderb, Herde (`herdeNacht`).
**Datenmodell:** je Hof `spiel.weiden = [{ wid, name, ha, gras 0–100, matsch 0–100, gesperrt, nachgesaet }]`; `p.weide = { seit, wid }`; `weideHa` = Summe (abwärtskompatibel: alte Höfe bekommen eine Weide mit ganzem `weideHa`). Herdenregeln je Weide (`herdeNacht` je `wid`).
**Gras (Standardtempo, je Tag):** Nachwachsen je ha Frühling +8, Sommer +5, Herbst +2, Winter 0 Punkte; Verbrauch je Großpferd 4 Punkte / ha, Pony 2 (also 0,5 ha je Großpferd im Sommer ≈ ausgeglichen). Gras < 20 → Gras zählt nur noch halb als Futter (Heu zufüttern, sonst hungrig wie bisher). Überbesetzt (Bedarf > ha) → Matsch +5/Tag (Herbst/Winter ×2): Mauke/Strahlfäule ×1,5, Würmer ×1,3, Streit ×1,3, Nachwachsen −50 %.
**Weidepflege:** Abäppeln (Spieler oder Pferdepfleger, 1 Weide/Tag) → Würmer ×0,6 für 1 Jz; Weide sperren (wächst ohne Verbrauch, Matsch −5/Tag); Nachsäen im Frühling 30 €/ha → Gras +30, Nachwachsen +25 % für 1 Jahr.
**Futterwiese:** eingezäuntes Weideland als „Futterwiese“ markieren; Bauer mäht im Sommer (1. Schnitt Tag 1, 2. Schnitt Tag 5 bei gutem Gras), Ertrag **150 kg Heu je ha und Schnitt** (im Spieltempo verkleinert: 1 Pferd frisst im Spiel ca. 280 kg Heu im Jahr), Lohn **15 € je ha und Schnitt**; ins Heulager so viel passt, Rest an den Bauern zu 0,12 €/kg. Ohne Futterwiese: Heu im Futterhandel (wie bisher).
**Einstreu** (Lager `futter.lager`, Verbrauch beim Misten je Box und Tag): Stroh 7 kg à 0,10 € (staubt: Husten ×1,3, wird angeknabbert), Späne 3 kg à 0,35 € (staubarm), Pellets 2 kg à 0,40 € (sehr saugfähig: Strahlfäule ×0,7), Leinstroh/Hanf 3 kg à 0,60 € (staubarm, saugfähig). Ohne Einstreu: Wohlbefinden −3/Nacht, Strahlfäule ×2. „Empfindliche Atemwege“ (F4): Stroh ×2 statt ×1,3. Startvorrat 100 kg Stroh. Mitarbeiter streuen mit ein (Stallbursche).
**Haltung je Pferd:** Box, Paddockbox (H3, rein/raus nach Lust), Weide (Herde), Sandpaddock (H3) – Auswahl unter ppf – Ort.

**Offene Fragen H6 (mit Empfehlung):**
1. Mehrere Weiden: neue Weide beim Einzäunen als eigene Weide anlegen oder vergrößern? *Empfehlung: beim Einzäunen wählen („neue Weide“ / „Weide X vergrößern“).*
2. Pferde auf Pachtland: darf gepachtetes Weideland eingezäunt werden? *Empfehlung: ja (in echt üblich), Zaun bleibt beim Ende der Pacht nicht erhalten.*
3. Einstreu-Wahl je Box oder je Hof? *Empfehlung: je Hof mit Ausnahme je Box (z. B. Späne für Pferde mit empfindlichen Atemwegen).*
4. Heu von der Futterwiese: Qualität zufällig (bei Regen staubiges Heu)? *Empfehlung: ja, 20 % Regen-Schnitt → „staubig“.*

**✅ Domes Antworten H6 (6.10.2026):** 1 wie empfohlen (beim Einzäunen wählen: neue Weide / Weide X vergrößern) · 2 ja (Pachtland darf eingezäunt werden, Zaun endet mit der Pacht) · 3 **je Box**: erst wenn ein Pferd in die Box kommt, wird neu eingestreut – dann Frage, welche Einstreu; ist nur eine Sorte im Lager, wird sie automatisch genommen · 4 ja (20 % Regen-Schnitt → staubiges Heu).

## Etappe H7 – Stallarten: Bedingungen, Vorteile, Strafe (groß)
1. Stallart je Hof frei wählbar (auch mehrmals dieselbe): Pensionsstall, Zuchtstall, Ausbildungsstall, Gnadenhof, Rennstall, Westernstall (Gangpferdestall später). Ersetzt das vorbereitete Stallart-Feld aus dem Azubi-Nachtrag (Fachrichtungen, Bewerber je Stallart).
2. Bedingung nicht mehr erfüllt → Warnbrief, 1 Jahreszeit Frist → Statusverlust und Rückzahlung der Förderung des letzten Jahres („hohe Strafe“).
   - **Nachtrag (Dome, 6.10.2026): Schonfrist.** Nach dem Kauf eines Hofs oder einem Wechsel der Stallart gilt 1 Jahr Schonfrist. In der Zeit gibt es keine Strafe, Förderung und Vorteile aber erst, sobald die Bedingung erfüllt ist. Ist sie nach dem Jahr nicht erfüllt, folgt der normale Warnbrief mit 1 Jahreszeit Frist.
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
