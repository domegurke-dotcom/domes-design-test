# Auftrag: Veterinäramt und Tierhalteverbot, Speicher aufräumen

Quelle: Projekt-Chat mit Dome, 20.10.2026. Alle Punkte sind von Dome entschieden. Zahlen, die als „Vorschlag“ markiert sind, dürfen nach Tests angepasst werden, dann bitte Dome Bescheid geben.

**Stand:** P1 fertig (v599); der Rest ist offen (wird nach jeder Etappe nachgeführt).

## Fortschritt
| Etappe | Inhalt | Stand |
|---|---|---|
| P1 | Post: wichtige Briefe nie löschen | **fertig (v599)**, Test `tests/post-test.js` |
| V1 | Vorfälle, Stufen, gerechte Ausnahmen | **fertig (v600)**, Test `tests/veterinaer-test.js`; selbst gesetzt: `KLINIK_TOD` 4 %/Tag, `KLINIK_BEFUND` 20 €, Klinik-Ziel aus Altersgrenze und Krankheitsdecke |
| V2 | Kontrollen, Auflagen, Meldungen | **fertig (v601)**; selbst gesetzt: Meldechance von Einsteller/Tierarzt/Hufschmied 50 % je Besuch |
| V3 | Tierhalteverbot und Spielende | **fertig (v602)** |
| V4 | Vom Tierarzt erlösen lassen | **fertig (v603)**; selbst gesetzt: welche Leiden „keine Heilung“ sind (`KEINE_HEILUNG`) |
| P2 | Speicheranzeige und „Speicher aufräumen“ | **fertig (v604)**; die „Rücksicherung“ gibt es seit v522 nicht mehr (Ersatz: Platz „Verloren“) |
| T | Tutorial, Hinweisblasen, Enzyklopädie | offen |

## Ist-Stand (gelesen in v596)
1. Tod durch Vernachlässigung (Entkräftung oder unbehandelte Krankheit, nur eigene Pferde) schreibt den Namen in `spiel.vernachlaessigt`; `tierschutzEinsatz()` bucht dann `STRAFE_VERNACHLAESSIGUNG` (2.000 €), Ansehen Tierschutzverein −5, und beschlagnahmt alle Pferde mit Gesundheit ≤ 30 % (außer `altersschwach(p)` = `gesundheitMax(p) <= 40`, also erst ab etwa 33 Jahren, und außer Klinik). Pensionspferde gehen an den Besitzer zurück.
2. Beschlagnahmte Pferde: `tierschutzKlinik()` päppelt **jedes** Pferd um 16 %/Tag bis 75 % hoch, danach 2 Jahreszeiten Rückkauf (halber Marktwert + Klinikkosten).
3. Fohlen ohne eigene Box: Hinweis, letzte Warnung, Abholung durch den Tierschutz.
4. Es wird nichts gezählt, es gibt keine Steigerung und kein Verbot.
5. Post: `brief()` kürzt `spiel.post` auf 120 Briefe und löscht die ältesten; nur `typ === "jahresbericht"` ist geschützt. **Briefe mit Stern (`b.stern`) werden mitgelöscht** (Fehler, Dome will wichtige Briefe nie verlieren).
6. Archiv (`spiel.archiv`) höchstens 40 Pferde, Bestenlisten-Pferde geschützt. Friedhof unbegrenzt, ganzes Pferd gespeichert (für Stammbaum). `p.erfolge` letzte 60, `p.bilanz` und `p.schleifen` ein Pferdeleben lang. Spielstände werden gepackt gespeichert (LZString).
7. Es gibt kein Einschläfern/Erlösen im Spiel.

---

## Etappe V1 – Vorfälle, Stufen und gerechte Ausnahmen (mittel)
1. **Neuer Absender „Veterinäramt“** (Amtstierarzt) für Kontrollen, Strafen, Auflagen und das Verbot. Der **Tierschutzverein** bleibt für Abholung, Klinik und Rückkauf zuständig. Briefe mit „Sie“ wie alle Behördenbriefe. Eigener Brieftyp für die Post-Ordner und Spam-Regeln (nie Spam).
2. **Neues Objekt** `spiel.veterinaer = { vorfaelle: [{ tag, art, hid, text }], stufe, kontrollen: [], auflage: null, naechsteKontrolle: null }`. Gilt für die **Person, also alle Höfe zusammen**; jeder Vorfall merkt sich den Hof (`hid`). Kontrolliert wird nur der Hof, auf dem es passiert ist.
3. **Ein Vorfall ist:**
   1. Tod durch Vernachlässigung (Entkräftung oder unbehandelte Krankheit, wie heute),
   2. Beschlagnahme wegen Gesundheit ≤ 30 % (siehe Punkt 6),
   3. Fohlen ohne eigene Box vom Tierschutz abgeholt,
   4. Pensionspferd vernachlässigt (Tod oder Beschlagnahme), zusätzlich zu den heutigen Folgen (Vertrag weg, Ansehen −15, Schadenersatz),
   5. nicht erfüllte Auflage bei der Nachkontrolle (Etappe V2).
   **Alles, was am selben Spieltag passiert, ist zusammen nur ein Vorfall** (Beispiel: Bella stirbt und Max und Luna werden beschlagnahmt = 1 Vorfall).
4. **Stufen** (Anzahl der gültigen Vorfälle):
   1. 1. Vorfall: Verwarnung, Strafe 2.000 € (wie bisher), Kontrolle angekündigt.
   2. 2. Vorfall: Strafe 5.000 € (Vorschlag), Auflagen und Kontrollen.
   3. Danach: Brief „Letzte Warnung: Beim nächsten Vorfall wird ein Tierhalteverbot ausgesprochen.“
   4. 3. Vorfall: **Tierhalteverbot** (Etappe V3).
   **Anfänger** (Erfahrungsstufe Anfänger) bekommen das Verbot erst beim **4.** Vorfall (Strafe beim 3. Vorfall wieder 5.000 €, danach letzte Warnung). Fortgeschrittene und Experten beim 3.
   Strafen werden wie heute abgebucht und dürfen das Konto ins Minus/den Dispo bringen.
5. **Verjährung:** Nach **2 Spieljahren ohne neuen Vorfall** fällt der älteste Vorfall weg (Stufe sinkt). Brief vom Veterinäramt: „Die Akte zu Ihrem Betrieb wurde entlastet.“
6. **Was nicht als Vernachlässigung zählt** (kein Vorfall, keine Beschlagnahme, kein Brief vom Tierschutz):
   1. Das Pferd ist **in Behandlung** (Tierarzt gerufen und Behandlungsplan läuft, oder Behandlung aus der Stallapotheke läuft).
   2. Das Pferd ist **alt** und seine Gesundheit geht nur wegen des Alters nicht höher (Gesundheit liegt nahe an `gesundheitMax(p)`, z. B. höchstens 10 Punkte darunter, Vorschlag), nicht erst ab `altersschwach`.
   3. Das Pferd hat eine **chronische oder unheilbare Krankheit**, die behandelt wird.
   4. Pferde in Klinik, Aufzuchtstation oder Ausbildungsstall.
   5. Neu gekaufte Pferde in ihren **ersten 7 Spieltagen** (Notfallpferde kommen schon schlecht an).
   6. Tod trotz Behandlung (wie heute schon, v532).
   Liegt ein Pferd unter 30 % und gilt einer dieser Gründe, schreibt der Amtstierarzt bei einer Kontrolle nur: „Der Zustand von {Name} ist nachvollziehbar, das Pferd ist in Behandlung.“
7. **Mitarbeiter-Fehler** zählen immer für den Halter (wie in echt).
8. **Beschlagnahmte Pferde in der Klinik** (`tierschutzKlinik()` umbauen): Sie werden nur so gesund, wie Alter und Krankheiten es erlauben: höchstens bis `gesundheitMax(p)`, Krankheiten werden in der Klinik normal behandelt (Kosten in `t.kosten`), chronische bleiben. Ziel bleibt 75 % oder der eigene Höchstwert, wenn der darunter liegt. Erreicht ein Pferd das Ziel nicht, ist es **nach 1 Jahreszeit** trotzdem zurückkaufbar, wenn es nicht schlechter wird. **Stirbt es in der Klinik:** Brief vom Tierschutzverein, Pferd kommt auf **deinen Pferdefriedhof** (es war dein Pferd), kein neuer Vorfall.
9. **Anzeige:** Hofverwaltung - Hof: Zeile **„Veterinäramt: unauffällig / verwarnt / unter Auflagen / letzte Warnung“**, antippbar: Liste der gültigen Vorfälle mit Datum und Hof, offene Auflage mit Frist, wann der älteste Vorfall verjährt. „Letzte Warnung“ in Rot.
10. **Adminmodus:** Stufe und Vorfälle sehen, Vorfall hinzufügen/entfernen, Kontrolle sofort auslösen (für Tests).

## Etappe V2 – Kontrollen, Auflagen und Meldungen (mittel)
1. **Drei Anlässe für eine Kontrolle:**
   1. Nach jedem Vorfall: an einem **zufälligen Tag in den nächsten 2 Jahreszeiten** (damit es auch bei Tempo 4 Tage nicht direkt nach der Klinik ist).
   2. Nach einer **Meldung**: innerhalb von **7 Spieltagen**.
   3. **Nachkontrolle** nach einer Auflage: am Tag nach Fristende.
2. **Meldungen** (lösen eine Kontrolle aus, sind selbst kein Vorfall):
   1. Einsteller, Tierarzt und Hufschmied melden, wenn sie einen Mangel sehen (Einsteller bei Besuch, Tierarzt/Hufschmied bei einem Termin auf dem Hof).
   2. **Anonyme Meldung** (Nachbar, Spaziergänger, Futterlieferant): Gibt es auf dem Hof gerade einen Mangel (Liste in Punkt 4), besteht jeden Tag eine Chance von **5 % je Mangel, höchstens 25 % am Tag** (Vorschlag), dass jemand anruft. Höchstens eine offene Meldung gleichzeitig.
   3. Brief vom Veterinäramt: „Uns liegt ein Hinweis zur Tierhaltung auf {Hof} vor. Wir werden Ihren Betrieb in den nächsten Tagen kontrollieren.“ Nie, von wem.
   4. Ein Tod fällt immer auf (das tote Pferd muss abgeholt werden), dafür braucht es keine Meldung.
3. **Uhrzeit:** Die Kontrolle läuft **tagsüber nach der Morgenrunde** (nachdem die Mitarbeiter gearbeitet haben). Was am Morgen normal ist, zählt nie (Morgenmist, leere Krippe vor dem Füttern).
4. **Was als Mangel zählt** (je Box, je Pferd):
   1. **Mist:** `b.mistStufe` 3 oder mehr (2 Tage nicht gemistet). Stufe 1 ist normaler Morgenmist, Stufe 2 ein Tag.
   2. **Futter:** in den letzten 3 Nächten mindestens 2-mal hungrig ins Bett (`!b.krippeVoll` in der Nacht). Dafür neues kleines Feld je Box, z. B. `b.hungerNaechte` (letzte 3 Nächte als Bits).
   3. **Wasser:** in den letzten 2 Nächten kein Wasser (nur Boxstufe 1, wo der Eimer gefüllt werden muss; `b.wasserTag`).
   4. **Dreck:** `zuLangeDreckig(p)` (länger als eine Jahreszeit nicht geputzt).
   5. **Hufe:** Hufschmied mehr als 4 Wochen (echte Tage, umgerechnet) überfällig.
   6. **Krankheit:** Befund „mittel“ oder schlimmer und nicht in Behandlung.
   7. **Fohlen ohne eigene Box** (ab der 3. Jahreszeit).
   8. **Gesundheit unter 30 %** ohne einen Grund aus V1 Punkt 6.
5. **Ergebnis:**
   1. Keine Mängel: Brief „Kontrolle ohne Beanstandung“. Nichts passiert.
   2. Mängel: Brief mit **allen Mängeln mit Box und Pferd**, z. B. „Box 3 (Luna): seit 3 Tagen nicht gemistet“, und einer **Auflage** mit Frist bis Ende der Jahreszeit, **mindestens 7 Spieltage**, egal welches Tempo. Die Auflage steht in der Veterinäramt-Zeile (V1 Punkt 9).
   3. Nachkontrolle: Sind die genannten Mängel behoben und keine neuen schweren dazugekommen, ist die Auflage erfüllt. Sonst **neuer Vorfall**.
6. Pensionsansehen: Eine Kontrolle mit Mängeln senkt das Pensionsansehen leicht (−3, Vorschlag), eine ohne Mängel nicht.

## Etappe V3 – Tierhalteverbot und Spielende (mittel)
1. Das Verbot gilt für die Person, also **alle Höfe**.
2. Brief vom Veterinäramt „Tierhalteverbot“ mit allen Vorfällen. Dann:
   1. Alle eigenen Pferde (auch Gnadenhof, extern, Fohlen) werden fortgenommen und vom Tierschutz vermittelt, **kein Erlös**.
   2. Pensionspferde gehen an ihre Besitzer zurück.
   3. **Das Spiel ist verloren**, genauso wie bei der Zwangsversteigerung (`spielVerloren()`): Autospeicher wird gelöscht, Speicherplätze 1 und 2 bleiben, „Vom letzten Speicherstand neu starten“, ältere Dateien dürfen immer geladen werden.
3. **Abschlussfenster und Bilanz:** Grund „Tierhalteverbot“; in der Bilanz eine Liste aller Vorfälle mit Datum und Hof; in `abschlussTipps()` passende Tipps, z. B. „Ein Stallbursche hätte Futter und Mist zuverlässig erledigt“, „Kranke Pferde sofort vom Tierarzt behandeln lassen“.
4. **Jahresbericht** (`jahresbericht()`): neue Zeile „Veterinäramt: {n} Vorfälle, {k} Kontrollen ({m} ohne Mängel)“ für das vergangene Jahr. Zähler in den unsichtbaren Spielzählern ergänzen.

## Etappe V4 – Vom Tierarzt erlösen lassen (klein)
1. Neue Möglichkeit in der Box beim Tierarzt: **„Vom Tierarzt erlösen lassen“**, nur sichtbar, wenn
   1. der Tierarzt bei einer Untersuchung „keine Heilung mehr möglich“ festgestellt hat (neuer Befundtext bei unheilbaren, schweren Fällen), oder
   2. das Pferd altersschwach ist und unter 20 % Gesundheit liegt.
2. Sicherheitsfrage mit Namen. Kosten **250 €** (Tierarzt und Abholung; in echt etwa 150–400 €), Finanzen „Tierarzt: Erlösen“.
3. Kein Vorfall. Pferd kommt auf den Pferdefriedhof, Todesursache „vom Tierarzt erlöst ({Grund})“. Fohlen bei Fuß wie beim normalen Tod der Stute (Waise).
4. **Pensionspferde** nur mit Zustimmung des Besitzers: Brief an den Einsteller, Antwort am nächsten Tag (Zustimmung), dann wie oben, Kosten trägt der Besitzer.
5. Lässt man ein Pferd, für das Erlösen möglich ist, weiter leiden, ist das keine eigene Strafe; es gilt nur der normale Ablauf (in Behandlung = keine Vernachlässigung).

---

## Etappe P1 – Post: wichtige Briefe nie löschen (klein)
1. **Fehler beheben:** Beim automatischen Kürzen nie löschen: Briefe mit Stern (`b.stern`), Jahresberichte, Briefe mit offener Rechnung oder offener Aktion (Knopf im Brief noch nicht erledigt), und **nie ungelesene** Briefe.
2. Grenze von 120 auf **300** Briefe erhöhen. Darüber werden zuerst die **ältesten gelesenen Briefe ohne Stern** gelöscht.
3. **Hinweisblase ab 250 Briefen** (einmal): „Deine Post ist bald voll. Ab 300 Briefen werden die ältesten gelesenen Briefe ohne ⭐ gelöscht. Wichtige Briefe mit ⭐ markieren.“
4. **Beim ersten automatischen Löschen** ein Brief der Hofverwaltung: „{n} alte, gelesene Briefe ohne ⭐ wurden gelöscht, weil die Post voll war. Briefe mit ⭐ bleiben immer.“ Danach höchstens einmal pro Spieljahr so ein Brief.
5. Kein Dauertext im Post-Fenster (Dome).

## Etappe P2 – Speicheranzeige und „Speicher aufräumen“ (mittel)
1. **Anzeige** in Hofverwaltung - Einstellungen: „Speicher: 0,6 von ca. 5 MB belegt“ mit Balken (alle Schlüssel des Spiels zusammen: Autospeicher, Platz 1, Platz 2, Rücksicherung, Turnier-Sortierung). Ab **70 %** gelb mit Hinweis, ab **90 %** rote Meldung mit Knopf „💾 Jetzt als Datei sichern“ (wie die Meldung bei fehlgeschlagenem Speichern).
2. **Aufräumen nur auf Knopfdruck, nie von allein.** Knopf „🧹 Speicher aufräumen“ öffnet ein Fenster mit Häkchen:
   1. gelesene Briefe ohne Stern, älter als 2 Spieljahre (Sternbriefe, Jahresberichte, offene Rechnungen/Aktionen nie),
   2. Spam-Ordner leeren,
   3. Rücksicherung löschen,
   4. Friedhof und/oder Archiv aufräumen (Punkt 3).
   Neben jedem Punkt steht, wie viel frei wird. Vor dem Löschen Sicherheitsfrage mit Summe („Es werden ca. 120 KB frei. Sicher?“). Danach sofort speichern.
3. **Friedhof und Archiv aufräumen:** Liste aller Pferde mit Häkchen und ungefährer Größe je Pferd. Filter: „gestorben/verkauft vor mehr als {X} Jahren“, „ohne Nachkommen bei dir“, „ohne Turniererfolge“. Je Pferd zwei Möglichkeiten:
   1. **„Details löschen, Grabstein bleibt“**: Name, Rasse, Geschlecht, Farbe, Geburts-/Todesdatum, Todesursache und Lebensbilanz (`p.bilanz`, Schleifen-Anzahl) bleiben, Werte/Gene/Erfolge-Liste/Bildteile werden entfernt.
   2. **„ganz löschen“**.
   **Warnung**, wenn ein gewähltes Pferd Vorfahre eines Pferdes ist, das du noch hast: „Im Stammbaum von Fips steht dann nur noch der Name, ohne Werte und Farbe.“ **Pferde aus der Bestenliste** lassen sich nur mit einer zusätzlichen Sicherheitsfrage löschen. Stammbaum, Vererbung, Bestenliste und Friedhof müssen mit gekürzten Pferden fehlerfrei weiterlaufen (fehlende Felder abfangen).
4. Detail-Liste `p.erfolge` (letzte 60) bleibt wie sie ist; Bilanz und Schleifen bleiben ein Pferdeleben lang.
5. **Hinweisblase ab 70 %** (einmal): „Dein Speicher wird voll. Unter Hofverwaltung - Einstellungen kannst du aufräumen oder als Datei sichern.“

---

## Etappe T – Tutorial, Hinweisblasen, Enzyklopädie (klein)
Feste Regel von Dome: jede Änderung kommt auch ins Tutorial und in die Hinweisblasen.
1. **Anfänger-Tutorial (13 Kapitel):**
   1. Kapitel 1 „Versorgen“: „Werden Pferde schlecht versorgt, kontrolliert das Veterinäramt. Wer wiederholt Pferde vernachlässigt, bekommt ein Tierhalteverbot, dann ist das Spiel vorbei.“
   2. Kapitel 4 „Krankes Pony“: „Ein krankes Pferd in Behandlung gilt nie als vernachlässigt.“
   3. Kapitel 12 „Geld“ (Post): „Wichtige Briefe mit ⭐ markieren, die werden nie gelöscht.“
   4. Kapitel 13 „Speichern“: „Unter Hofverwaltung - Einstellungen siehst du, wie voll dein Speicher ist, und kannst aufräumen.“
2. **Fortgeschrittenen-Tutorial**, Teil Krankheiten: Erlösen lassen (wann es möglich ist, dass es keine Vernachlässigung ist).
3. **Neue Hinweisblasen** (je einmal, Texte):
   1. Erster Brief vom Veterinäramt: „Das Veterinäramt prüft, ob deine Pferde gut versorgt sind. Deinen Stand siehst du unter Hofverwaltung - Hof.“
   2. Erste Auflage: „Behebe die Mängel bis zur Frist, sonst zählt es als neuer Vorfall.“
   3. „Letzte Warnung“: rote Blase am Hof-Knopf: „Letzte Warnung vom Veterinäramt: Beim nächsten Vorfall verlierst du alle Pferde.“
   4. Erste Möglichkeit zum Erlösen: „Der Tierarzt kann ein Pferd erlösen, das nicht mehr gesund wird. Das ist keine Vernachlässigung.“
   5. Post ab 250 Briefen (P1 Punkt 3).
   6. Speicher ab 70 % (P2 Punkt 5).
   Alle in die Hinweis-Liste der Hilfe (☰ - Hilfe) und in die Erfahrungsstufen-Regeln aufnehmen (gelten für alle Stufen).
4. **Enzyklopädie:** Einträge „Veterinäramt und Tierhalteverbot“ (Vorfälle, Stufen, Ausnahmen, Kontrollen, Verjährung, Anfänger 4 statt 3) und „Speicher und Aufräumen“ (Post-Grenze, Sternbriefe, Anzeige, Aufräumen). Zahlen im Adminbereich „Berechnungen zum Nachschlagen“.

## Tests
1. Test-Skript Veterinäramt: Tod durch Hunger → 1 Vorfall, 2.000 €, Kontrolle geplant in den nächsten 2 Jahreszeiten; Tod + 2 Beschlagnahmen am selben Tag = 1 Vorfall; 3 Vorfälle (Anfänger 4) → Verbot, Spiel verloren, Speicherplätze bleiben; Verjährung nach 2 Jahren.
2. Ausnahmen: Pferd in Behandlung mit 25 % → keine Beschlagnahme, kein Vorfall; altes Pferd nahe Höchstwert → nichts; Neukauf in den ersten 7 Tagen → nichts.
3. Kontrolle: Morgenmist (Stufe 1) und leere Krippe am Morgen zählen nicht; Stufe 3 zählt; Auflage mit Frist mindestens 7 Spieltage bei Tempo 4; Nachkontrolle mit/ohne Mängel.
4. Anonyme Meldung: ohne Mängel nie, mit Mängeln irgendwann; Kontrolle innerhalb 7 Tagen.
5. Klinik: altes/chronisch krankes Pferd wird nicht über den eigenen Höchstwert gepäppelt, nach 1 Jahreszeit zurückkaufbar; Tod in der Klinik → eigener Friedhof.
6. Erlösen: nur bei „keine Heilung“ oder altersschwach unter 20 %, 250 €, Friedhof, kein Vorfall; Pensionspferd nur mit Zustimmung.
7. Post: 310 Briefe erzeugen, Sternbriefe, ungelesene, Jahresberichte und offene Rechnungen bleiben; Blase bei 250; Brief beim ersten Löschen.
8. Aufräumen: Größenanzeige stimmt ungefähr; „Details löschen“ eines Vorfahren → Stammbaum, Friedhof, Bestenliste ohne Fehler; Neuladen-Prüfung und Datei speichern/laden weiter in Ordnung.
9. Mehrere Höfe: Vorfälle zählen gemeinsam, Kontrolle nur auf dem betroffenen Hof.
10. Screenshots in den drei Ansichten nur für die neuen Fenster (Veterinäramt-Zeile, Aufräumen-Fenster, Speicheranzeige).
