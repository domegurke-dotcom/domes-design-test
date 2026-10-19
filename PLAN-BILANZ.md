# Auftrag für die Coding-Sitzung: Dispo, Jahresbericht und Spiel-verloren-Bilanz

**Stand:** 19.10.2026, im Projekt-Chat mit Dome geplant (Fragen 1–42), Code-Stand beim Planen v513 (jetzt v546). **Voraussetzung:** `PLAN-SPIELSTAND.md` (Thema 1) ist umgesetzt, vor allem S1 (Speicherplätze, Autospeicher) und S4 (Zähler je Jahreszeit). Reihenfolge: B1 → B2 → B3 → B4 → B5.
Alle Fragen sind beantwortet.

**Fortschritt:** B1 fertig (v547, Abnahmetest `tests/dispo-test.js`; Dome 19.10.: Kreditrate darf ins Dispo, erst über −2.000 € Mahnung; Kolik-OP immer erlaubt; Aufzucht/Ausbildung bei jedem Minus gesperrt) · mit 2 Höfen noch nicht getestet · B2 Teil 1 fertig (v548, `tests/chronik-test.js`: Zähler je Hof, Turnier-Klassen, Kontostand hoch/tief, Abgaben, Pfändung, Höfe) · B2 Teil 2 fertig (v549, `tests/bestenliste-test.js`, Anzeige hvw – Hof – Übersicht) · B3 fertig (v554, `tests/jahresbericht-test.js`; Hofkauf/Eigenanteil/Kredit zählen nicht als Gewinn/Verlust) · B5 fertig (v555, `tests/bild-test.js`; `bilanzBildTeilen` für B4 wiederverwendbar) · **B4 offen (Opus)** · B2 offen · B3 offen · B4 offen · B5 offen

## Ist-Stand (v513)
1. Einziger Verlust-Weg: `kreditJahreszeit()` → 3 offene Raten (`KREDIT.verpasst`) → `pfaendung(k)` (Pferde zu ¾ Wert) → reicht nicht → `zwangsversteigerung(k)`; bei mehreren Höfen wird nur der aktive Hof entfernt (`spiel.hofWeg`), beim letzten Hof wird `spiel.verloren` gesetzt → `spielVerloren()` zeigt kurzes Fenster, löscht Spielstand und Post.
2. Ohne Kredit kann das Konto beliebig tief ins Minus; Rechnungen (Klinik, Aufzucht, Tierarzt …) werden abgebucht. Futterkauf prüft schon `(spiel.geld || 0) < kosten` → „Nicht genug Geld.“
3. Mitarbeiter: Gehalt zu Jahreszeit-Beginn (`mitarbeiterJahreszeit`), ist das Konto am Jahreszeit-Ende noch im Minus (`maKnappPruefen`), kündigt er und behält das letzte Gehalt.
4. Aufklappbares gibt es schon als `<details>`; Akkordeon im Jahresbericht genauso bauen.

## Etappe B1 – Dispo, Käufe sperren, zweiter Verlust-Weg (mittel)
Regeln (Dome, 19.10.2026), alles **je Hofkonto** (das zentrale Konto hat keinen Dispo):
1. **Dispo-Rahmen −2.000 €.** Konstante `DISPO = { rahmen: 2000, zins: 0.12, jzMinus: 2 }`.
2. **Zinsen:** im Minus 12 % im Jahr, abgerechnet je Jahreszeit (Buchung „Dispo: Zinsen“, Finanzen unter „Bank“).
3. **Käufe sperren:** Liegt das Konto bei oder unter −2.000 €, ist alles gesperrt, was der Spieler **selbst kauft**: Futter, Einstreu, Medikamente, Pferde (Markt, Auktion, Gestüte, Tierschutz), Bauen, Land, Ausrüstung, Labor. Meldung: „Dein Konto ist im Dispo am Limit (−2.000 €). Erst Geld einnehmen oder Raten zahlen.“ Bis −2.000 € wird normal gekauft (bestehende `Nicht genug Geld`-Prüfungen so umbauen, dass sie `geld + DISPO.rahmen` statt `geld` verwenden; Admin ohne Grenze).
4. **Weiterlaufend auch unter −2.000 €:** Rechnungen (Tierarzt, Klinik, Aufzucht, Ausbildung), Gehälter, Kreditraten, Pensions-Erstattungen. In echt behandelt der Tierarzt im Notfall trotzdem.
5. **Warnbrief „Futter ist alle“** von der **Hofverwaltung** (nicht vom Stallpersonal), wenn Futter ausgeht und wegen Sperre nichts gekauft werden kann; danach greifen die bisherigen Folgen (Hunger, Tierschutz).
6. **Ablauf bis zum Verlieren** (neues Objekt `hof.dispo = { jzMinus, drohung }`, geprüft zu Beginn jeder Jahreszeit):
   1. Konto im Minus am Jahreszeit-Beginn → `jzMinus++`, sonst 0.
   2. Ist das Konto **unter −2.000 €** oder `jzMinus ≥ 2`: Brief der Bank „Kündigung des Kontos angedroht – eine Jahreszeit Zeit“ (`drohung = jzJetzt()`), Ansehen der Bank −5.
   3. Ist nach **einer Jahreszeit** (`drohung` + 1) das Konto weiter im Minus (unter −2.000 € oder `jzMinus ≥ 2`): **Pfändung** wie beim Kredit (`pfaendung`, Pferde zu ¾ Wert, Erlös aufs Konto).
   4. Ist das Konto danach noch im Minus: **Insolvenz** → derselbe Ablauf wie `zwangsversteigerung`: bei mehreren Höfen verschwindet nur dieser Hof, beim letzten Hof ist das Spiel verloren (Grund „Insolvenz“).
   5. Kommt das Konto zwischendurch ins Plus, wird `jzMinus` und `drohung` zurückgesetzt, Brief „Entwarnung“.
7. **Mitarbeiter (Dome):** Kündigung bleibt wie bisher (`maKnappPruefen`): sobald das Konto am Jahreszeit-Ende im Minus ist, kündigt der Mitarbeiter, auch innerhalb des Dispos. **Kein** neuer Warnbrief an die Mitarbeiter: Dome will das als Überraschung (Fragen 41 und 42).
8. **Anzeige:** Hofverwaltung - Finanzen und Hof-Übersicht zeigen bei Minus „Dispo: −850 € von 2.000 €“ (gelb ab −1.000 €, rot ab −1.500 €).
9. **Enzyklopädie/bzn:** Dispo-Regeln, Zinssatz, Fristen eintragen.

## Etappe B2 – Hofchronik-Daten (klein; baut auf S4 aus PLAN-SPIELSTAND)
Zähler je Jahreszeit (`spiel.protokoll`) für die Bilanz um diese Felder ergänzen (je Hof getrennt, `hid` im Schlüssel):
1. Pferde: gekauft (je Markt: Privat, Händler, Auktion, Gestüt, Tierschutz), gezüchtet (Fohlen geboren), verkauft, abgegeben (Gnadenhof, Tierschutz), verstorben, gepfändet.
2. Turniere: Starts, Siege und Platzierungen **je Klasse** (E, A, L, M, S …, auch Western/Rennen/Distanz mit ihrer Klassen-Bezeichnung), höchste erreichte Klasse.
3. Finanzen: bleiben aus `finanzen`/`finanzSaison` (nicht doppelt führen); zusätzlich höchster Kontostand und tiefster Kontostand je Jahreszeit.
4. Höfe: gekauft, verloren (mit Name, Jahreszeit).
5. Pferde-Bestenliste **(Dome 19.10.: je Hof die 3 besten und die 3 wertvollsten Pferde)**: Mini-Eintrag je Pferd (Pferde-Nummer, Name, Rasse, Erfolgspunkte, Wert), „beste“ = meiste Erfolge (Siege zählen mehr als Platzierungen), „wertvollste“ = Marktwert; nur eigene Pferde (keine Pensionspferde). Auswertung zu Beginn jeder Jahreszeit und wenn ein Pferd den Hof verlässt (`archivieren`, `begraben`). **Der Name ist anklickbar wie im Abstammungsschein** (`leseAkte` über `pferdePool()`): damit das auch nach Verkauf geht, sind die Pferde der Bestenliste im `spiel.archiv` vor dem 40er-Limit geschützt (höchstens 6 je Hof); verstorbene liegen schon komplett auf dem Friedhof. Bei Pferden, die nicht mehr beim Spieler sind, steht **„Stand beim Verkauf“** (bzw. „beim Abgang“) dabei.
6. Alte Spielstände: Felder fehlen → in der Anzeige „–“; was sich aus Finanzen, Friedhof und Turnieren nachrechnen lässt, wird nachgerechnet.

## Etappe B3 – Jahresbericht per Post (mittel)
1. **Wann:** Am ersten Tag jedes neuen Jahres (Frühling, Tag 1) kommt ein Brief mit der Bilanz des **letzten Jahres**, Vergleich zum Vorjahr (↑/↓), darunter „seit Spielbeginn“.
2. **Absender:** „Hofverwaltung“ (Dome, nicht Steuerbüro).
3. **Kurz halten (Dome):** Oben nur 6 Kacheln: Gewinn/Verlust, Kontostand, Pferdezahl, Turniere (Siege/Platzierungen), größte Ausgabe, größte Einnahme. Alles andere (Pferde-Bewegungen, Turniere je Klasse, Finanzen im Detail, Höfe, bestes Pferd) in einem **Akkordeon** (`<details>`-Abschnitte, jeweils zugeklappt, gleiches Aussehen wie die vorhandenen `<details>`).
4. **Mehrere Höfe:** Ein Brief; oben „Alle Höfe zusammen“, darunter jeder Hof als aufklappbarer Abschnitt.
5. **Postfach:** Eigener Ordner „Jahresberichte“ (neben „Wichtig“). Jahresberichte werden **nie automatisch gelöscht** und zählen nicht zur Aufräum-Aktion des Themas „Speicherplatz“.
6. Im ersten Spieljahr kommt noch kein Bericht (nichts zum Vergleichen); der erste kommt zu Beginn des 2. Jahres.
7. Knopf **„🖼️ Als Bild teilen“** am Brief (siehe B5).
8. **Ein Hof wird versteigert, das Spiel geht weiter:** Brief „Hofverwaltung“ mit kleiner Bilanz nur für diesen Hof (Grund, Dauer, Pferde, Turniere, Finanzen).

## Etappe B4 – Spiel-verloren-Bilanz und „Nur ansehen“ (groß)
1. **Abschlussfenster** (ersetzt den heutigen Text in `spielVerloren`): Grund (Kredit, Insolvenz/Dispo) und Datum; Spieldauer (Jahre, Jahreszeiten); Kacheln mit den Zahlen aus B2; darunter aufklappbare Details; Kurve „Kontostand über die Zeit“ (aus `finanzSaison`); bestes Pferd (meiste Erfolge) und wertvollstes Pferd; **1–3 Tipps passend zum Spielverlauf**, regelbasiert (z. B. „Personalkosten waren 60 % deiner Ausgaben“, „Du hast 3 Jahreszeiten im Minus gespielt“).
2. **Knöpfe:** „Vom letzten Speicherstand neu starten“ (Platz, Hof, Datum), „Neues Spiel“, „Letzten Stand ansehen“, „Zum Startmenü“; dazu „🖼️ Als Bild teilen“.
3. **Letzter Stand zum Ansehen:** der Stand **kurz vor der Pfändung** (Kopie von `spiel` unmittelbar vor `pfaendung`/`zwangsversteigerung`). Liegt auf eigenem Platz **„Verloren“** (immer nur der letzte; kommt zu Platz 1/2/Autospeicher aus S1 dazu), gepackt wie die anderen.
4. **Nur-ansehen-Modus:** Band oben „🔨 Nur ansehen, Spiel verloren“; Stall, Boxen, Steckbriefe, Finanzen, Post, Friedhof, Enzyklopädie und Jahresberichte lassen sich öffnen; **alle Knöpfe mit Aktion sind gesperrt** (ausgegraut mit Hinweis), die Zeit läuft nicht weiter (kein „Tag beenden“, kein Autospeichern auf Platz 1/2). Technisch: ein Flag `ansehen` im geladenen Spiel, das `speichern()` und alle Aktions-Funktionen abfängt; Test, dass nichts verändert wird.
5. **Post bleibt** im verlorenen Stand erhalten (bisher `spiel.post = []` in `spielVerloren` entfernen).
6. Startmenü zeigt den Platz „Verloren“: „🔨 Sonnenhof, verloren in Jahr 5 Herbst · ansehen“. Er lässt sich als Datei speichern und wieder laden (dann ebenfalls nur ansehen, Dateityp wie S2 mit Kennzeichen `verloren: true`).
7. Der Autospeicher des verlorenen Spiels wird gelöscht, die Speicherplätze 1 und 2 bleiben (Dome); weiterspielen geht nur über „Vom letzten Speicherstand neu starten“ oder ein anderes Spiel.

## Etappe B5 – Bilanz als Bild teilen (klein/mittel)
1. Abschlussbilanz **und** Jahresbericht lassen sich als Bild teilen (Dome, 19.10.2026).
2. Bild (PNG, ca. 1080 × 1350): Hofname, Zeitraum, die 6 Kacheln, **bestes Pferd als Bild** (mit `zeichnePferd`), Spielname/Version unten klein. Keine versteckten Werte.
3. Zeichnen per `<canvas>` oder SVG → PNG. Handy: `navigator.share({ files })` (Telegram, E-Mail), PC: Download. Dateiname `Zuchtstall_<Hofname>_Bilanz_<Zeitraum>.png`.

## Testen
1. Dispo: Konto auf −500, −1.999, −2.001 setzen; Käufe erlaubt/gesperrt, Rechnungen laufen weiter, Zinsen, Brief „Kündigung angedroht“, nach einer Jahreszeit Pfändung, danach Insolvenz; Entwarnung bei Plus; mit 2 Höfen (nur ein Hof weg).
2. Mitarbeiter kündigt bei Minus am Jahreszeit-Ende wie bisher.
3. Jahresbericht: kommt zu Beginn von Jahr 2, 3 …; ein Hof und zwei Höfe; Akkordeon; Ordner „Jahresberichte“; Aufräumen löscht ihn nicht.
4. Verlieren: Fenster, Tipps, „Vom letzten Speicherstand neu starten“, „Nur ansehen“ (nichts änderbar, Zeit steht, Speicherplätze unverändert), Platz „Verloren“ als Datei speichern und laden.
5. Bild: erzeugen, auf Handy teilen, am PC herunterladen.
6. Alte Spielstände ohne Zähler: Bilanz zeigt „–“ bzw. nachgerechnete Werte, keine Fehler.
7. Screenshots in PC 1366×768, Handy quer 844×390, Handy hochkant 390×844 für Abschlussfenster, Jahresbericht und Nur-ansehen-Band.
