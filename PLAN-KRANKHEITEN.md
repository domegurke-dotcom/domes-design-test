# Auftrag für die Coding-Sitzung: Spieltempo, Mitarbeiter, Krankheiten (Stand 5.10.2026, Code v168)

Von Dome geplant und bestätigt. Details und Begründungen: `werte/krankheiten-plan.md` und `werte/mitarbeiter-plan.md` im Projektordner *(liegen noch im Planungsprojekt, nicht im Repo)*.
Wie immer: in Etappen umsetzen, nach jeder Etappe testet Dome. Speicherstände abwärtskompatibel halten (fehlende Felder mit Standardwerten). Vorher Aufwand je Etappe einschätzen.

## Stand der Umsetzung

Plan gespeichert bei Spielversion 173.

- [x] Etappe A – Spieltempo (klein) – v174, von Dome getestet. Kalender-Anker `spiel.kal` (Datum bleibt beim Umstellen), Hinweisbrief „Neues Spieltempo“. Dome: −2 % für überfällige Hufe (`HUF_STRAFE`) bleibt aus, bis es den Hufschmied gibt (Etappe E).
- [x] Etappe B – Mitarbeiter (groß) – v175/176, von Dome getestet
  - [x] B1 (v175): Berufe Azubi/Stallbursche/Pferdepfleger/Pferdewirt/Bereiter/Stallmeister, Stallgröße, Bewerbungen je Jahreszeit, 7 Wissensbereiche + Spieler-Erfahrung, Eigenschaften, Nachtdienst bei Geburten. Dome: noch keine Stallart (Pferdewirt/Bereiter ab 9 Boxen); Nachtdienst = kleiner Vorteil (Fohlen gesund, ohne Aufsicht 15 % schwach); Azubi füttert/mistet 2 Boxen mit Fehlern; Bereiter bewegt 3 Pferde (Wohl +5, kein Boxentag). Hofhelfer, Futterexperte, Hufschmied, Osteopath noch „bald“.
  - [x] B2 (v176): versteckte Zufriedenheit, Urlaub (Dome: einmal im Jahr 1–3 Tage, Antrag per Brief), krank 1–3 Tage, Kündigung unter 25, Vertretung durch Kollegen (+1 Box, Überstunden). Stallqualität wirkt erst mit dem Hof-Ausbau.
  - [~] B3 (v181, Test durch Dome offen): Azubi braucht Ausbilder, Ausbilderschein, Ausbildungsdauer und Abschlussprüfung, Fachrichtungen je Stallart, Pferdewirt Haltung und Service. Abschlussprüfung: Chance (Schnitt der 4 Bereiche der Fachrichtung − 8) ÷ 22. Renn-/Westernjobs nur im Plan vorgemerkt.
- [~] Etappe C – Befunde, Anzeichen, Einschätzung (groß) – v177, Test durch Dome offen. Dome: Tierarzt behandelt bis Etappe D gleich mit (Hausbesuch 80 € + Behandlung, Kolik-OP 3.000 €); etwa 1–2 Befunde pro Pferd und Jahr; alte Stallapotheke bleibt bis D. Annahme (vertrauen/selbst einschätzen) wirkt erst mit eigenen Behandlungen (D). Lahmheit durch Überlastung und Bereiter-Früherkennung beim Training: Ankerpunkt `befundBremse` für Etappe 4.
- [~] Etappe D – Behandlung und Stallapotheke (mittel) – v178, Test durch Dome offen. Dome: Gewicht sichtbar („ca. … kg“, 5 Dosisstufen nach Gewichtsklasse); Behandlungen durch Spieler oder als Plan durch Pfleger/Pferdewirt; Tierarzt = Diagnose + Erstbehandlung + Plan + Rezept; neue Apotheke ersetzt die alte.
- [~] Etappe E – Hufe und Hufschmied (mittel) – v182, Test durch Dome offen. Anfahrt 20 € je Besuch, Eisen verlieren 1 %/Nacht. Dome (v183/184): Dauerauftrag mit wählbarem Rhythmus je Pferd (wie der Hufschmied empfiehlt oder ½/1/2 Jahreszeiten zum Sparen), einzeln rufen geht immer; Stallmeister legt nur Termine zusammen. Empfehlung erst nach 3 Besuchen (vorher 1 Jahreszeit). Hufgröße vorne/hinten misst der Hufschmied nur auf Anfrage (10 €), steht dann im Steckbrief; Hufschuhe in der Ausrüstung je Pferd als Paar vorne/hinten (90 €). **Für Etappe 4 (Gelände):** Hufschuhe nutzen sich ab; zu klein → Scheuerstelle (leichte Verletzung, Haut, wird ohne Pflege schlimmer), zu groß → verrutschen → Stolpern, kleines Lahmheitsrisiko. `HUF_STRAFE` ersetzt durch Risiko-Faktor für zu lange Hufe.
- [ ] Etappe F – Ansteckung, Quarantäne, Vorsorge (mittel)
- [ ] Etappe G – Ankaufsuntersuchung (mittel)
- [ ] Etappe H – Erbkrankheiten (mittel)

**Zuerst:** Diesen Plan als `PLAN-KRANKHEITEN.md` ins Repo speichern und auf `main` hochladen; in `PLAN-WERTE.md` einen Hinweis ergänzen, dass vor Etappe 4 erst `PLAN-KRANKHEITEN.md` (A–H) kommt. Dome kurz bestätigen, dass der Plan gespeichert ist. Am Ende jeder Etappe sagen, was fertig und was offen ist, und die Etappe in `PLAN-KRANKHEITEN.md` abhaken. Neue Systeme (Tempo, Mitarbeiter, Befunde usw.) auch in `CLAUDE.md` unter „Wichtige Spielsysteme“ nachtragen.

**Reihenfolge (Dome, 5.10.2026):** Diese Etappen A–H kommen jetzt, vor Werte-Etappe 4 (Training daheim). Was Training braucht (Lahmheit durch Überlastung, Bereiter beim Training), nur als Ankerpunkt vorbereiten und mit Etappe 4 aktivieren.

**Grundsatz:** Kommen neue Rassen dazu, werden ihre Erbkrankheiten und Eigenheiten immer mit eingebaut.

## Etappe A – Spieltempo (klein)
1. `spiel.tempo` neu: 4 schnell / 7 Standard / 10 langsam (bisher 3/4/5).
2. Nur die Sozialisierung wird auf das Tempo umgerechnet (`proTag`, ist schon so, Bezug auf 7 anpassen). Alles andere bleibt pro Tag/Nacht wie bisher.
3. Bestehende Spielstände auf 7 umstellen, mit kurzem Hinweisbrief.
4. Vorsorge-Intervalle (Huf 42/56, Wurmkur 90, Zahn 365 Tage) auf Jahreszeiten umstellen (siehe Etappe E/F).

## Etappe B – Mitarbeiter (groß)
1. Stallgrößen: klein bis 8 Boxen, mittel 9–19, groß ab 20.
2. Jobs und Gehalt pro Jahreszeit: Azubi 100 €, Stallbursche 300 €, Pferdepfleger 330 €, Pferdewirt Zucht und Haltung 360 €, Bereiter 420 €, Stallmeister 500 €. Erfahrene Bewerber bis +25 %. Nachtzuschlag 30 €/Nacht.
   1. Stallbursche: füttern, misten, einstreuen.
   2. Pferdepfleger: putzen, Mähne/Schopf, Hufe auskratzen, Weide. Nachtdienst bei Geburten im kleinen/mittleren Stall.
   3. Pferdewirt Zucht und Haltung: Rosse, Trächtigkeit, Geburt, Fohlen; Nachtdienst im großen Stall.
   4. Stallmeister: koordiniert, Stallburschen schaffen dadurch 5 statt 3 Boxen; legt Hufschmied-Termine zusammen.
   5. Bereiter: trainiert, bewegt Pferde auch im Roundpen; bemerkt Lahmheit/Rücken/Leistungseinbruch früh.
   6. Azubi: günstig, lernt nur mit Anleitung (Pferdewirt oder Stallmeister), anfangs mehr Fehler.
   7. Hofhelfer: repariert Gebäude (Hof-Ausbau).
   8. Später: Berittmeister (mit Turnieren/eigenem Ausbildungsstall), Futterexperte (mit Fütterung).
   9. Extern auf Termin: Tierarzt (immer), Hufschmied, Osteopath, Sattler, Pferdezahnarzt, Physiotherapeut. Hufschmied/Osteopath fest anstellbar nur bei großem Stall und mind. 2 Ställen.
3. Bewerbung unter Hauptmenü - Hofverwaltung - Mitarbeiter: 2–3 Bewerber pro Stelle mit Name, Gehalt, Erfahrung, Eigenschaften. Wer sich bewirbt, hängt von Stallgröße und Stallart ab: Azubi/Stallbursche/Pferdepfleger überall; Pferdewirt ab mittel (Zuchtstall ab klein); Bereiter ab mittel (Ausbildungsstall ab klein); Stallmeister nur groß.
4. 7 Wissensbereiche, Erfahrung 0–100: Fütterung/Verdauung, Stallklima/Atemwege, Haut/Fell/Wunden, Hufe/Bewegung, Zucht/Geburt/Fohlen, Verhalten, Rücken/Training. Tägliche Arbeit steigert den passenden Bereich.
5. Startwerte: Azubi alles 5; Stallbursche Fütterung 30, Stallklima 25, Rest 10; Pferdepfleger Haut 35, Hufe 25, Verhalten 25, Rest 15; Pferdewirt Pflegebereiche 40, Zucht 50, Rücken 20; Bereiter Rücken 50, Hufe 40, Verhalten 35, Rest 20; Stallmeister alles 40. Bewerber streuen darum. Spieler hat eigene Erfahrung, Start alles 10.
6. Eigenschaften (0–2 je Mitarbeiter, nicht jeder hat eine, keine Gegensätze): zuverlässig, schusselig (vergisst mal eine Box), ruhige Hand (Pferde vertrauen mehr), ungeduldig (weniger), aufmerksam (bemerkt Anzeichen früher), fleißig (+1 Box), lernbegierig (schneller Erfahrung), Nachteule (Nachtdienst ohne Unzufriedenheit).
7. Versteckte Zufriedenheit (Gehalt, Arbeitslast, Nachtdienste, Stallqualität); Spieler sieht nur ungefähr („wirkt unzufrieden“). Urlaub 10 Tage/Jahr per Brief-Antrag (Ablehnen senkt Zufriedenheit; Arbeit bleibt liegen oder andere übernehmen und schaffen weniger). Krank 1–3 Tage, öfter bei Überlastung. Kündigung per Brief zum Ende der Jahreszeit bei niedriger Zufriedenheit.

### Nachtrag zu Etappe B: Azubi, Ausbilder, Fachrichtungen, neue Stallarten (Dome, 5.10.2026, Code v177)

Von Dome geplant und bestätigt. Details: `werte/mitarbeiter-plan.md` im Projektordner *(liegt noch im Planungsprojekt)*. Etappe B ist schon fertig → wird als eigene kleine Etappe **B3** umgesetzt.

**Anlass:** Zurzeit (v177) arbeitet der Azubi auch ganz ohne Ausbilder und lernt dann nur nichts. Im kleinen Stall hat er nie einen Ausbilder, weil Pferdewirte sich erst ab 9 Boxen und Stallmeister erst ab 20 bewerben. Das soll sich ändern.

#### 1. Ausbilder
1. Einen Azubi kann man nur einstellen, wenn ein Ausbilder da ist.
2. Ausbilder sind: Pferdewirt, Stallmeister, im Ausbildungsstall auch der Bereiter, und der Spieler selbst mit Ausbilderschein.
3. Ausbilderschein: einmaliger Kurs für ca. 500 € unter Hauptmenü - Hofverwaltung - Mitarbeiter. Der Pferdepfleger zählt nicht als Ausbilder.
4. Kleiner Stall: Azubis gibt es dort nur, wenn der Spieler den Ausbilderschein hat.
5. Pferdewirt, Stallmeister und Bereiter betreuen höchstens 2 Azubis, der Spieler 1.

#### 2. Wenn der Ausbilder fehlt
1. Ausbilder krank oder im Urlaub: Der Azubi arbeitet weiter, lernt aber nichts und vergisst öfter eine Box (+10 %).
2. Ausbilder kündigt: Der Azubi bleibt noch 1 Jahreszeit. Gibt es bis dahin keinen neuen Ausbilder, bricht er die Ausbildung ab und verabschiedet sich per Brief.

#### 3. Dauer, Gehalt, Abschluss
1. Die Ausbildung dauert 3 Spieljahre. Gehalt pro Jahreszeit: 1. Jahr 100 €, 2. Jahr 120 €, 3. Jahr 135 €.
2. Am Ende kommt die Abschlussprüfung per Brief, das Ergebnis hängt von der gesammelten Erfahrung ab.
   1. Bestanden: als Fachkraft übernehmen (Gehalt der Fachkraft, Erfahrung und Eigenschaften bleiben) oder er geht.
   2. Durchgefallen: ½ Jahr Verlängerung, dann neuer Versuch.

#### 4. Fachrichtung je Stallart
Die Fachrichtungen gibt es so auch in echt: Pferdewirt mit fünf Fachrichtungen.
1. Ausbildungsstall → Klassische Reitausbildung → wird Bereiter.
2. Zuchtstall → Pferdezucht → wird Pferdewirt Zucht und Haltung.
3. Pensionsstall und Gnadenhof → Pferdehaltung und Service → wird Pferdewirt Haltung und Service.
4. Rennstall → Pferderennen → wird Rennreiter oder Rennpfleger.
5. Westernstall → Spezialreitweisen → wird Westerntrainer.
6. Wer mehrere Stallarten hat, wählt die Fachrichtung beim Einstellen. Angeboten wird nur, was zu den eigenen Ställen passt.
7. Solange es noch keine Stallarten gibt (kommt mit dem Hof-Ausbau): ein Feld für die Stallart vorbereiten, der jetzige Hof gilt als Zuchtstall.

#### 5. Neuer Job
1. Pferdewirt Haltung und Service: 340 € pro Jahreszeit (zwischen Pferdepfleger und Pferdewirt Zucht). Versorgt und pflegt, kümmert sich um Einsteller. Bewirbt sich in Pensionsställen und auf dem Gnadenhof.

#### 6. Neue Stallarten (für den Hof-Ausbau, Jobs jetzt schon vormerken)
1. Rennstall:
   1. Rennpfleger 330 €: pflegt, bereitet Rennen vor und begleitet; Wissensbereich Hufe/Beine stark.
   2. Rennreiter (Jockey) 380 € + 10 % vom Preisgeld bei Sieg. Nur leichte Bewerber; das Gewicht muss zum Rennen passen. Bei Trabrennen Trabrennfahrer.
   3. Rennpferdetrainer 500 €: übernimmt im Rennstall die Rolle des Stallmeisters, plant Training und Rennen.
2. Westernstall:
   1. Normaler Pferdepfleger.
   2. Westerntrainer 420 € (wie Bereiter): Reining, Trail, Pleasure.
3. Gangpferdestall (Tölt, Pass): später als eigene Stallart, wenn es mehr Gangpferderassen gibt.

## Etappe C – Befunde, Anzeichen, Einschätzung (groß)
1. Gesundheit bleibt Gesamtwert; dazu Befundliste je Pferd (Art, Schweregrad, Heilungsdauer, Ursache) – baut auf dem vorhandenen `befund` auf (jetzt nur einer, wird Liste). Befunde senken Gesundheit/Wohlbefinden, sperren/bremsen Training, Turnier, Zucht, senken Marktwert; alte Befunde bleiben im Steckbrief.
2. Arten: Verletzungen; Lahmheit Grad 1–5 (Überlastung, Hufe, Folge von Verletzung, Alter); akut: Kolik, Husten, Hufrehe, Mauke, Erkältung, Druse; chronisch/Alter: Arthrose, Sommerekzem, Cushing.
3. Risiko: Konstitution schützt vor Krankheit, Zähigkeit vor Überlastung, Regeneration verkürzt Heilung; Alter, schlechtes Wohlbefinden, Schmutz, Jahreszeit erhöhen. Kolik/Hufrehe fragen einen Futter-Faktor ab (vorerst neutral).
4. Härte: ohne Behandlung wird es schlimmer; tödlich nur bei schweren, zu lange unbehandelten oder falsch behandelten Fällen, vorher mindestens eine deutliche Warnung.
5. Anzeichen zuerst als Sprechblase (allgemeines, austauschbares System – später Animationen; auch für Etappe 3 „Reaktionen“ nutzbar).
6. Ein Mitarbeiter (oder der Spieler selbst, wenn er das Pferd an dem Tag versorgt/angeschaut hat – manchmal sogar vor einem ungeübten Mitarbeiter) bemerkt es und meldet eine Einschätzung mit Sicherheit („sicher“ / „vermute“ / „keine Ahnung“). Trefferquote nach Erfahrung im passenden Bereich.
7. Spieler wählt unter Hauptmenü - Stall - Box - Pferdepflege - Versorgung: Mitarbeiter vertrauen / anderen Mitarbeiter fragen / selbst einschätzen (Verdacht aus Liste) / Tierarzt (Hausbesuch, sichere Diagnose; Schweres wie Kolik-OP in die Klinik).
8. Erfahrung erst, wenn die echte Ursache klar ist (Diagnose oder Behandlung wirkt): wer bemerkt/eingeschätzt hat am meisten, Spieler immer etwas (am meisten bei eigener Einschätzung), wer behandelt etwas, auch falsche Einschätzungen zählen.
9. Kein automatischer Notdienst. Warnbrief nur, wenn der Tierarzt den Fall schon kannte.

## Etappe D – Behandlung und Stallapotheke (mittel)
1. Behandlungen als tägliche Aktionen unter Box - Pferdepflege - Versorgung: Boxenruhe, Schritt führen, kühlen, Verband, Medikament.
2. Stallapotheke: einfache Mittel selbst kaufen (Wundsalbe, Kühlgel, Verband); starke Mittel (Schmerzmittel, Antibiotika, Kortison) nur über Tierarzt-Rezept.
3. Dosis in 5 festen Stufen, richtig je nach Gewicht (Rasse/Größe; Werte noch festzulegen). Tierarzt dosiert immer richtig. Zu wenig → wirkt nicht; zu viel → Vergiftung (neuer Befund, im schlimmsten Fall Tod); falsches Mittel → keine Wirkung + Nebenwirkung.
4. Mitwirkung: hohes Vertrauen → gut behandelbar; wenig Vertrauen, scheu, nervös → wehrt sich, Behandlung wirkt schlechter/dauert länger. Charakter wirkt (temperamentvoll leidet unter Boxenruhe).

## Etappe E – Hufe und Hufschmied (mittel)
1. Hufqualität vererbt (stabil/normal/instabil), Rasse wirkt mit (Robustpferde hart, Vollblut dünne Wände); instabil: Risse, Bröckeln, Eisen öfter verloren. Nur Admin sieht den Wert.
2. Hufwachstum vererbt: normal 1× pro Jahreszeit Hufschmied, schnell 2×, langsam alle 2 Jahreszeiten.
3. Barhuf ca. 30 €, Beschlag ca. 140 €; Beschlag lohnt bei viel Gelände/hartem Boden und instabilen Hufen. Hufschuhe als günstige Alternative (Ausrüstung) mit Zustand 100 % → sinkt je Einsatz (Gelände/harter Boden schneller), 0 % kaputt, falsche Größe → Scheuerstellen.
4. Termin verpasst → Hufe zu lang → Stolpern, Risse, mehr Lahmheitsrisiko (ersetzt das bisherige −2 ab Tag 56).
5. Hufe auskratzen als tägliche Pflege; ohne Auskratzen + nasse Einstreu/Matsch → Strahlfäule.
6. Hufkrankheiten: Strahlfäule, Hufabszess, Hornspalt, Hufrehe.
7. Termin unter Box - Pferdepflege - Versorgung - Hufschmied oder für mehrere Pferde unter Hofverwaltung - Mitarbeiter. Dauerauftrag: kommt automatisch im Rhythmus bis zur Kündigung, Rechnung per Brief. Ohne Dauerauftrag Erinnerungsbrief. Stallmeister legt alle Termine auf einen Tag (Anfahrt nur einmal) und passt den Rhythmus je Pferd an.

## Etappe F – Ansteckung, Quarantäne, Vorsorge (mittel)
1. Ansteckend: Druse, Influenza, Herpes (bei tragenden Stuten Verfohlen), Hautpilz (auch über gemeinsame Putzkiste → eigenes Putzzeug je Pferd), Würmer.
2. Neuzugänge bringen manchmal etwas mit: Gestüt gering, Privat/Auktionshaus mittel, Händler/Tierschutz höher. Ansteckend schon einige Tage vor den Anzeichen.
3. Verbreitung: Weide hoch; Stallluft (Husten/Influenza) im ganzen Stall, je näher die Box, desto höher; Kontakt (Druse, Pilz, Würmer) über Nachbarbox, Tränke, Putzzeug, Mistgabel; Herpes Luft + Kontakt. Mitarbeiter tragen weiter (krank → gesund); zuverlässige/erfahrene versorgen das kranke Pferd zuletzt; Spieler kann einen Mitarbeiter nur für das kranke Pferd einteilen.
4. Quarantäne ohne Quarantänestall: eigene Box, kein Weidegang, eigene Putzkiste für 1 Jahreszeit (senkt Risiko). Quarantänestall (Hof-Ausbau) = kein Risiko.
5. Blutbild beim Tierarzt, Ergebnis nach 2 Tagen: klein ca. 40 € (Entzündung ja/nein), groß ca. 120 € (konkrete Krankheit).
6. Vorsorge (auf Jahreszeiten umgestellt): Impfung (Influenza, Herpes) senkt Ansteckung und schwere Verläufe; Wurmkur, Zahnarzt, Hufschmied senken Risiken.

## Etappe G – Ankaufsuntersuchung (mittel)
1. Freiwillig am Pferdemarkt: klein ca. 200 € (Herz, Lunge, Augen, Gangbild), mittel ca. 500 € (+ Beugeproben, Longe, kleines Blutbild), groß ca. 1.000 € (+ Röntgen, großes Blutbild).
2. Gefunden wird nur, was die Stufe prüft; Erbkrankheiten nur mit dazugebuchtem Labortest. Gekaufte Pferde können Befunde mitbringen.
3. Protokoll per Brief, Röntgenklassen I–IV; danach kaufen, Preis verhandeln oder ablehnen.
4. Händler verstecken manchmal etwas (Schmerzmittel vor dem Termin); Blutprobe einlagern ca. 50 €, später prüfbar.
5. Beim eigenen Verkauf machen manche Käufer eine AKU; Befunde senken den Preis.

## Etappe H – Erbkrankheiten (mittel)
1. Gentest-nachweisbar: Hannoveraner WFFS; Araber SCID, CA; Friese Zwergwuchs, Wasserkopf; Quarter Horse HYPP (dominant), HERDA, PSSM; Shire/Tinker PSSM; Shetty Zwergwuchs; Achal-Tekkiner Naked Foal Syndrome.
2. Rezessive wie Lethal White (`GEFAHR_GENE`): Träger gesund, Träger × Träger → ¼ krank; Warnung bei Verpaarung nur, wenn mind. ein Partner getestet.
3. Labortest Erbkrankheiten prüft alle Krankheiten der Rasse(n); Mischlinge zahlen mehr (je Rassenanteil).
4. Veranlagungen ohne Gentest (vererbt, nur höheres Risiko): Sommerekzem (Isi, Tinker, Haflinger), Kehlkopfpfeifen (Vollblut, Warmblut), OCD/Chips (nur Röntgen), Melanome bei Schimmeln (Lipizzaner, Andalusier; an Schimmel-Gen G gekoppelt). Haltung wirkt (Ekzemerdecke, weniger Weide in der Dämmerung).

## Abhängigkeiten
1. Fütterung (noch zu planen): Kolik/Hufrehe-Risiko, Futterexperte.
2. Hof-Ausbau: Quarantänestall, Stallarten, mehrere Ställe, Hofhelfer.
3. Ausrüstung: Hufschuhe, Sattler/Sattelanpassung (Druckstellen, Rücken), Ekzemerdecke.
4. Training daheim (Werte-Etappe 4): Überlastungs-Lahmheit, Bereiter.
5. Azubi braucht einen Ausbilder → geplant, siehe Nachtrag zu Etappe B (B3).
6. Pensionspferde / Pensionsstall (noch zu planen): wie Angestellte mit Pensionspferden umgehen (versorgen sie die mit, Extra-Aufwand, Verantwortung bei Krankheit/Verletzung) – Dome, 5.10.2026.
