# Auftrag: Hinweisblasen, Spielumfang je Erfahrungsstufe und Tutorials

**Stand:** 20.10.2026, im Projekt-Chat mit Dome geplant (Themen 5, 5b, 5c), Code-Stand beim Planen v553. Reihenfolge: T1 → T2 → T3 → T4 → T5 → T6. Dies sind **drei zusammenhängende Themen**; 5b (Stufen) kommt vor 5c (Tutorials), weil die Tutorials auf den Stufen aufbauen. Dazu gehören drei Anhänge: **Anhang A** Hinweis-Katalog und -Texte (`PLAN-HINWEISE-TEXTE.md`), **Anhang B** Tutorial-Kapitel (`PLAN-TUTORIAL.md`), **Anhang C** Stufen-Tabelle (`PLAN-STUFEN.md`). Wo unten „Katalog“, „Texte“, „Tabelle“ oder „Kapitel“ steht, sind diese Anhänge gemeint.

**Wann umsetzen (Dome, 20.10.2026):** Dieser Plan ändert den Spielablauf stark, besonders T2 (versteckt Funktionen). **Das ganze Thema erst nach B4, R2–R4 und dem Waschplatz (`PLAN-WASCHPLATZ.md`) beginnen** (Reihenfolge = wie die Themen hereinkamen), damit sich nichts überschneidet und die Tipps (Dispo, Raritäten, Speicherplätze, Waschplatz/Solarium) gleich den fertigen Stand beschreiben. Danach T1 → T6 in Reihenfolge; T2 erst, wenn T1 fertig und hochgeladen ist. T2 und T4 sind groß → Opus empfohlen.

## Zuerst (beim Start dieses Themas)
1. In `CLAUDE.md` gibt es dazu die feste Regel: **Jede neue Funktion bekommt gleich einen Tipp-Eintrag und einen Stufen-Eintrag** (ab welcher Erfahrungsstufe sichtbar). Sie gilt ab Beginn von T1.
2. Etappe für Etappe umsetzen, abhaken, nach jeder Etappe auf `main` hochladen.

## Ist-Stand (v553)
1. Einsteiger-Tipps als **Fenster** (`TIPPS`, `tippPruefen`, `tippMerken`, `spiel.tipps`, `tippsAus`, `tippWarte`, `tippStart`): 24 Einträge, je Spielstand einmal, im Start- und Charaktermenü gesperrt, alte Spielstände aus.
2. **Info-Sprechblasen** im Stall-/Koppelbild (weiß, verschwinden nach dem ersten Antippen), **Pferde-Sprechblasen** (`reaktionZeigen`).
3. **Erfahrungsstufe** schon im Charaktermenü (`data-stufe`, `spiel.spieler.stufe` = `anf` / `fort` / `exp`), wirkt nur auf die Weihnachtsspende (`SPENDE`, `weihnachtsSpende`).
4. Charaktermenü → `chLos` → Immobilienmenü (`immobilienHTML`, nur alter Pensionsstall am Anfang); Hauptmenü-Kacheln `hmStall`, `hmMarkt`, `hmHof`, `hmEnzy`, `hmAnh`, `hmGnade`, `hmFried`, `hmImmo`.

## Entscheidungen (Dome, 19./20.10.2026)

### T1 – Hinweisblasen statt Fenster (mittel)
1. **Blasen am Bildschirm** (kleiner Pfeil auf Knopf oder Bild, blockieren nichts, Antippen = weg) ersetzen die Tipp-Fenster. Fenster nur noch für wenige große Hinweise (Spielstart, Geld wird knapp).
2. **Leitfaden-Modus** für Handlungen beim ersten Mal (Füttern, Weide, Putzen, Tierarzt, Futterplan, Pension, Bauen …): die Blase begleitet **Schritt für Schritt**, nennt **den nächsten Schritt und warum**, zählt **nicht** gegen das Tageslimit und wird nie während der Handlung weggeblendet.
3. **Nebentipps** (alles andere): höchstens **1 Blase pro Ansicht** und **3 pro Spieltag**, nie während Dialogen, Aktionen oder dem Tagwechsel, nur **eine Blase** gleichzeitig.
4. **Roter Faden** für die ersten Tage (feste Reihenfolge, jeder Schritt erst, wenn der vorige gesehen oder erledigt ist): Pferd ansehen, füttern, Wasser, misten, putzen, Tag beenden, Post lesen, Futterplan, Pension, Geld im Blick.
5. **Auslöser:** beim ersten Öffnen einer Ansicht **und** beim ersten Mal, wenn etwas passiert (erster Brief, erste Rechnung, erste Krankheit, erster Dispo, Weihnachtsspende, Mahnung, Kredit). Dazu ein leuchtender Ring um den gemeinten Knopf.
6. **Bedienhinweise** (Tippen, Ziehen, Zurück über den Box-Kopf, **Geld oben links = Finanzen**, Zoomen, Scrollen, ☰-Menü) **einzeln**, beim ersten Mal, wenn man die Stelle braucht, **kein Rundgang am Anfang**.
7. **Länge:** höchstens 2 Sätze, Knopf „Mehr dazu“ öffnet den passenden Eintrag im neuen Enzyklopädie-Bereich **„Einsteiger-Wissen“** (Futterarten, Training, Krankheiten einfach erklärt).
8. **Ton:** einfache Wörter, Fachbegriffe sofort erklärt, Alltagsvergleich, **keine Kindersprache**, nie Grundwissen über Pferde, sondern was fürs Spielen wichtig ist und **wie realistisch es ist**. Du-Form. Nie versteckte Werte zeigen.
9. **Aussehen:** Hinweisblasen sehen anders aus als die Pferde-Sprechblasen (💡, andere Farbe). Sie dürfen **keine Anzeigeboxen überdecken**, sitzen automatisch oben oder unten und beachten die Kamera-Aussparung (safe-area).
10. **Nachlesen:** ☰ → ganz unten „Hilfe“ (Liste aller gesehenen Tipps); Hofverwaltung - Einstellungen: „Tipps aus/an“ und „Tipps zurücksetzen“. Ausschalten gilt auch für „Hinweise, die man schon kennt“ (siehe T5).
11. **Start:** Blasen auch im Charakter- und Immobilienmenü (bisher gesperrt).
12. **Bestehende 24 Tipps** prüfen und neu schreiben (veraltet: Spiel speichern, Kredit, Geld); der ganze Spielumfang wird geprüft (Waschplatz, Solarium, Dispo, Speicherplätze, Raritäten …). Katalog mit 41 Themen und 40 Texten: `PLAN-HINWEISE-TEXTE.md` (Anhang A). Dome: Katalog „passt erstmal so“.
13. **Stufen:** Anfänger bekommen alle Tipps zu den freigeschalteten Themen (inkl. Pferdewissen, soweit spielrelevant), Fortgeschrittene die zu den für sie wichtigen Themen und Regeln, Experten nur auf Wunsch (Einstellungen).

### T2 – Spielumfang je Erfahrungsstufe (groß, Tabelle in `PLAN-STUFEN.md`, Anhang C)
14. **Stufe gilt pro Spielstand** (`spiel.spieler.stufe`), **jederzeit hoch und auch herunter** (in Hofverwaltung - Einstellungen). Nach 1 Jahr Brief „Bereit für mehr?“ (nur wenn Anfänger/Fortgeschritten). Herunterstellen: **nichts geht verloren**, Laufendes läuft weiter (trächtige Stute, Fohlen, Gentest-Ergebnisse, weitere Höfe, Gebäude), nur **Neues wird gesperrt** und die Krankheitshäufigkeit sinkt.
15. Zentrale Prüfung `frei(funktion)` und Konstante `STUFEN = { anf: {...}, fort: {...}, exp: {...} }`; gesperrte Dinge werden **versteckt** (keine Kachel, keine Briefe dazu, keine Blase). Beim Hochstellen erscheinen neue Funktionen mit Blase.
16. **Krankheiten:** Faktor je Stufe auf das Risiko (Anfänger 0,25 · Fortgeschritten 0,6 · Experte 1) plus Liste erlaubter Krankheiten. **Anfänger:** nur Husten, Erkältung, kleine Verletzung, Mauke, kein Tod durch Krankheit (nur Alter). **Fortgeschritten:** Katalog etwa zur Hälfte, ohne Erbkrankheiten. **Experte:** alle.
17. **Anfänger:** nur alter Pensionsstall, ein Hof; **eigene Zucht gesperrt**; Labor gesperrt; **Fütterung:** fester Standardplan, der Futterexperte füllt den Plan; Heu, Kraftfutter und Wasser; **Futter einkaufen in der Futterkammer bleibt Sache des Spielers**; **Training** nur Roundpen, Reitplatz, Gelände mit festem Pfad (Bereiter); Turniere nur Hofturnier/E-Prüfungen; Märkte: Tierschutz und Händler (kein Auktionshaus); Mitarbeiter: Stallbursche, Pferdepfleger (Bereiter im Tutorial erklärt); **Bauen** nur Boxen anbauen, Box-Stufen erhöhen, Weide (auch **als Futterwiese umstellbar**), Reitplatz; **behandeln** darf man (Tierarzt, Stallapotheke).
18. **Fortgeschritten:** Makler-Höfe (bis 2), alle Märkte, Zucht, Labor (Fellfarben, Erbkrankheiten), Futterplan selbst, Training selbst, Turniere bis M, Bereiter, Weihnachtsspende 2.500 €. **Experte:** alles, keine Spende.

### T3 – Tutorials (groß, Kapitel in `PLAN-TUTORIAL.md`, Anhang B)
19. **Anfänger-Tutorial** kommt **vor** dem Immobilienmenü (Charakter → Tutorial → Immobilien); in einem **Testhof mit Testgeld, der danach verschwindet**, der echte Spielstand startet frisch.
20. **Ein Testpferd nach dem anderen**, **Überblendung** zum nächsten; man bleibt erst **nur in der Boxenansicht**, Menüs und Knöpfe schalten sich Kapitel für Kapitel frei. Jedes Pferd hat ein **Ziel**. **Dauer 2 Tage je Pferd, aber abhängig vom Thema** (7. Kapitel kann kürzer sein). Das Tutorial läuft unabhängig vom Spieltempo (Tage fest).
21. **12 Kapitel:** Versorgen, Putzen/Weide, Futter und Einkaufen, krankes Pony (Tierarzt und selbst behandeln), Training, Pension, Mitarbeiter, Bauen (Box-Stufe erhöhen), Turnier, Markt (kaufen und verkaufen), Geld und Post, Speichern. **Box-Stufen 1–3** nebenbei erwähnen (Kapitel 1) und in Kapitel 8 erklären, wo man die Stufe erhöht und was es bringt (Hofverwaltung - Hof - Bauen, Gummimatten). Nicht überfordern.
22. **Überspringen** für alle: ein einzelnes Kapitel oder alles. Wer überspringt, bekommt am Spielstart **alle** Blasen. Wer es macht, wird am Ende gefragt: „Sollen die Hinweise, die du schon kennst, im eigenen Spiel nochmal kommen?“ (ja/nein). In den Einstellungen jederzeit ausschaltbar.
23. **Fortgeschrittenen-Tutorial** (Zucht, Gentests, freier Futterplan, Auktionshaus, Makler-Hof, Ausbildungsskala, Turniere bis M, erweiterte Krankheiten) und **Experten-Tutorial** (alles, was bei Fortgeschritten noch gesperrt war: Erbkrankheiten, Championat/International, alle Höfe, Raritäten, Stallarten, Rassen) **nur zum Nachholen beim Aufstieg**, nicht Pflicht. Beim Hochstellen kommt ein Fenster „Tutorial jetzt machen?“ (ja / später / nein). **Jedes Tutorial lässt sich jederzeit wiederholen**, ohne Spielstand oder Hof zu verlieren (läuft immer im eigenen Testhof).
24. Experten bekommen Tipps und Tutorial zu allem, was bei Fortgeschritten gesperrt war; sonst keine Tipps (aber einschaltbar).

## Etappen
1. **T1 Blasen-System (mittel):** Blasen-Bauteil mit Pfeil und Ring, Leitfaden-Modus, Limits, Auslöser, Hilfe im ☰-Menü, Einstellungen, Enzyklopädie „Einsteiger-Wissen“, bestehende Tipps ablösen (Punkte 1–13).
2. **T2 Stufen (groß):** `STUFEN`, `frei()`, Sperren verstecken, Krankheiten-Faktor, Hochstellen/Herunterstellen, Brief „Bereit für mehr?“, Anfänger-Futterplan/Training-Pfad (Punkte 14–18).
3. **T3 Texte (mittel):** alle 40 Blasen aus `PLAN-HINWEISE-TEXTE.md` einbauen, Stufen-Zuordnung A/F/E.
4. **T4 Anfänger-Tutorial (groß):** Testhof, Kapitel mit Zielen, Überblendung, Freischalten der Menüs, Überspringen, Abschlussfrage (Punkte 19–22).
5. **T5 Weitere Tutorials (mittel):** Fortgeschrittenen- und Experten-Tutorial, Aufstiegs-Fenster, Wiederholen aus den Einstellungen (Punkte 23–24).
6. **T6 Tests und Bilder (klein):** Prüfung des ganzen Spielumfangs auf neue Funktionen, Screenshots.

## Testen
1. Blasen: Leitfaden beim ersten Füttern/Weide wird nicht abgeschnitten oder gezählt; Nebentipps-Limit (1 pro Ansicht, 3 pro Tag); keine Blase während Dialog, Aktion oder Tagwechsel; Ring auf dem richtigen Knopf; Position oben/unten ohne Überdeckung, mit Kamera-Aussparung.
2. Hilfe-Liste, „Mehr dazu“ öffnet die Enzyklopädie, Tipps zurücksetzen, aus/an.
3. Stufen: Anfänger sieht keine Zucht, kein Labor, kein Auktionshaus; Krankheiten nur die erlaubten und seltener; hoch und herunter; nichts geht verloren; Brief „Bereit für mehr?“.
4. Tutorial: Überblendung, nur Boxenansicht, Ziele, Überspringen einzeln und ganz, Abschlussfrage, Testhof wird gelöscht, Spielstand startet frisch; Wiederholen ohne Verlust.
5. Alte Spielstände: neue Felder fehlen = Standardwerte; vorhandene Stufe bleibt; Tipps aus (wie bisher), einschaltbar.
6. Screenshots in 1366×768, 844×390, 390×844 für Blasen, Tutorial und Charakter-/Immobilienmenü.

## Noch nicht von Dome ausdrücklich bestätigt (bitte im Test mit ihr klären)
1. Einzelheiten der Stufen-Tabelle außer den oben genannten (Höfe-Anzahl, Turnierklassen je Stufe, Märkte, Mitarbeiter, Wetter).
2. Genaue Texte (Entwurf zum Gegenlesen).
3. Kapitelzahl und -reihenfolge des Anfänger-Tutorials sind „ausbaufähig“, Dome will **alle Bereiche** abgedeckt sehen (inkl. Zuchtstation und Verkauf; Zucht nur im Fortgeschrittenen-Tutorial).

## Hinweise von Claude Team beim Speichern (20.10.2026)
- Katalog hat 41 Themen, Texte nur 40 (Thema 41 „Raritäten, Friedhof, Hof wechseln, Spiel verloren“ kommt erst beim ersten Auftreten – dort bei T3 nachfragen).
- Die Weihnachtsspende (`SPENDE`) bleibt wie bisher an der Stufe hängen, Stufen-Prüfung `frei()` darf sie nicht verändern.

## Fortschritt
- **T1 fertig** (v568, Claude Team Nachtsitzung, `tests/hinweise-test.js`): `HINWEISE` (Katalog mit Ziel-Selektor, „Mehr dazu“, Stufe), `blaseZeigen`/`blaseWeg`/`blasePosition` (Pfeil oben/unten, im Stallbild lieber darüber, Ring), `LEITFADEN` + `leitfadenSchritt`, `hinweisPruefen` (ersetzt `tippPruefen`, Limits 1 je Ansicht/3 je Tag in `spiel.hinweisZaehler`), `hinweisAnsicht`, Start-Blasen im Charakter-/Immobilienmenü (`startBlasen`, `startWarte`), ☰ → Hilfe (`hilfeZeigen`), Enzyklopädie `ENZY.einsteiger`. Die meisten Texte aus Anhang A sind schon drin (vorgezogen aus T3), auf den aktuellen Stand geprüft (Speichern über ☰, Dispo, Raritäten, Waschplatz).
- T2–T6 offen. **T2 ändert den Spielablauf stark** (Funktionen verstecken): Stufen-Sperre nur für neue Spiele (OFFENE-FRAGEN.md 8).
