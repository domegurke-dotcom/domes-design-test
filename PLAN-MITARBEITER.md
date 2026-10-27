# Auftrag: Mitarbeiter – Stärken sichtbar machen, Berufe trennen, Lernen, Azubi, Urlaub und Kalender (kopierfertig, eigenständig)

Auftraggeberin ist Dome. Alles auf Deutsch, Wege mit ausgeschriebenen Menüpfaden angeben (Beispiel: „Hauptmenü - Hofverwaltung - Mitarbeiter“). Geplant im Projekt-Chat am 26.10.2026, Code-Stand beim Planen v852.

Feste Regeln: Version bei jeder Auslieferung hochzählen (`SPIEL_VERSION`, `?v=`, `version.json`), `UEBERGABE.md` mitpflegen, Etappe für Etappe auf `main` hochladen, am Ende jeder Etappe sagen, was fertig und was offen ist. Speicherstände abwärtskompatibel halten (fehlende Felder mit Standardwerten füllen). Enzyklopädie „Berechnungen zum Nachschlagen“ (nur Admin) mit allen neuen Zahlen aktuell halten. Jede neue Funktion bekommt gleich einen Hinweisblasen-Eintrag, einen Stufen-Eintrag und ein Tutorial-Stück (steht unten in Etappe S9). Alle Symbole sind Emojis, nichts selbst zeichnen.

**Zuerst:** Diesen Auftrag als `PLAN-MITARBEITER.md` ins Repo legen und Dome kurz bestätigen. Dann den Ist-Stand prüfen (siehe Abschnitt 1) und nur ergänzen, was fehlt.

## 1. Ist-Stand (v852), nicht neu bauen
1. 7 Wissensbereiche `WISSEN` (futter, klima, haut, huf, zucht, verhalten, ruecken), Erfahrung 0–100 je Mitarbeiter (`m.wissen`), Balken mit Zahl im Mitarbeiter-Dialog und bei Bewerbungen (`wissenHTML`), Eigenschaften als Kärtchen mit Erklärung (`MA_EIGEN`, `eigHTML`), Spieler-Erfahrung („Deine eigene Erfahrung“, Start überall 10).
2. Aufgaben je Beruf (`MA_AUFGABEN`, `MA_AUFGABEN_TYP`), Häkchen je Mitarbeiter zum Abschalten (`maDarf`), Wünsche je Pferd (`WUNSCH`), Whiteboard mit Mitarbeiter-Karten und `b.maPlan` (von Hand zugeteilt), `maZuteilung`.
3. Erfahrung wirkt schon: Krankheit bemerken (aufmerksam, Bereich), Einschätzung (`einschaetzen`, „sicher/vermute/keine Ahnung“), Behandlung (vergessen, falsche Stufe), Ansteckung (ab 50 steckt er beim Versorgen kein anderes Pferd an), Rücken-Training (`trainerFaktor` 0,8–1,2), Verhalten ab 30 (Vorlieben des Pferdes), Schonen bei bekanntem Befund.
4. Lernen: `maLernt` (bremst je höher der Wert, `lernbegierig` ×1,5), täglich im Arbeitsablauf. Azubis: `FACH`, `ausbilderListe`, Prüfung, Fachrichtungen. Urlaub zufällig (`URLAUB_CHANCE`), Krankheit, Kündigung, Zufriedenheit.
5. Nur der Kalender der Turniere existiert (`turnierKalender`), keine Kalender-Ansicht.

## 2. Etappen
S1 Stärken anzeigen · S2 Berufe, Startwerte, Grenzen, Lerntempo · S3 Vorteile je Bereich · S4 Whiteboard-Passung · S5 Lehrgänge · S6 Azubi · S7 Probezeit und Urlaub · S8 Kalender · S9 Hinweisblasen, Tutorial, Stufen, Tests.

## S1 – Stärken anzeigen (klein/mittel)
1. **Bereich „Stallklima“ heißt ab jetzt „Stallhygiene“** (kurz im Balken, lang „Stallhygiene & Atemwege“), Symbol 🧹 Besen. Gemeint: saubere Boxen und Einstreu, Staub und Ammoniak in der Luft (Husten). Den Schlüssel `klima` im Code nicht umbenennen (Speicherstände), nur die Anzeige und die Enzyklopädie.
2. Symbole der Bereiche: Fütterung 🌾, Stallhygiene 🧹, Haut & Fell 🧴, Hufe 🦶, Zucht 🍼, Verhalten 🧠, Rücken 🏇, Einsteller 🗣️ (8. Bereich, siehe Punkt 8).
3. **Stufen-Wörter** nach Wert: 0–19 Anfänger, 20–39 Grundkenntnisse, 40–59 erfahren, 60–79 sehr erfahren, 80–100 Experte. Die Zahlen bleiben sichtbar wie heute (Dome: nicht ersetzen); das Wort kommt dazu (Tippen auf einen Balken, siehe S3, und in Meldungen).
4. **Stärken:** Bei jedem Mitarbeiter (auch Azubi, auch der Spieler in „Deine eigene Erfahrung“) werden die **1–2 höchsten Bereiche** hervorgehoben: goldener Balken, ⭐, ganz oben in der Liste. Dazu eine Zeile über den Eigenschaften „Stark in: Fütterung, Stallhygiene“. Die Stärken ändern sich mit den Werten (jedes Mal neu berechnen). **Bei Gleichstand aller Bereiche (z. B. Spieler am Anfang, alles 10) kein Stern**, stattdessen der Text „noch keine Stärke, wächst mit deiner Arbeit“. Gilt auch bei Bewerbungen.
5. **Bewerbungen bleiben wie heute** (Balken, alle Eigenschaften sichtbar, nichts wird verschwiegen – Dome, 26.10.), nur mit ⭐ und „Stark in“. Gilt auch bei Bewerbungen für Gleichstand (kein Stern).
6. **Whiteboard:** In der Mitarbeiter-Karte unten (z. B. „Leon, Stallbursche, 1 von 3 Boxen“) stehen neben dem Namen die Symbole der 1–2 Stärken.
7. **Mitarbeiter-Karte Hofverwaltung - Mitarbeiter:** Reihenfolge: Name/Beruf/Gehalt, Aufgaben-Häkchen, „Stark in …“, Eigenschaften, Balken (Stärken zuerst, golden).
8. **8. Bereich „Umgang mit Einstellern“ 🗣️** (Schlüssel `einsteller`): nur für Pferdewirt Haltung und Service und für den Stallmeister im Pensionsstall; bei allen anderen Berufen **gar kein Balken**. Startwerte: Pferdewirt Haltung 40, Stallmeister 30. Gelernt wird bei der Arbeit an Einsteller-Pferden. Wirkung siehe S3.
9. **Spieler lernt in allen Bereichen, in denen er selbst arbeitet:** Füttern → Fütterung, Misten/Einstreuen → Stallhygiene, Putzen/Waschen/Mähne → Haut, Hufe auskratzen → Hufe, Training/Longieren → Rücken, Geburt/Fohlen-ABC → Zucht, Bodenarbeit → Verhalten (heute nur Fütterung, Stallklima, Haut).

## S2 – Berufe, Startwerte, Grenzen, Lerntempo (groß)
1. **Beruf umbenennen:** „Pferdewirt Zucht und Haltung“ → **„Pferdewirt Pferdezucht“** (echte Fachrichtung seit 2010). „Pferdewirt Haltung und Service“ bleibt. Gespeicherte Mitarbeiter bekommen nur den neuen Namen. Alle Texte und die Enzyklopädie anpassen.
2. **Berufsbereiche („Stark in“) und Dienste** (Dome will, dass nicht jeder alles kann):

| Beruf | Berufsbereiche | Startwerte Berufsbereiche | übrige Startwerte NEU (alt) | Dienste |
|---|---|---|---|---|
| Azubi | je Fachrichtung (`FACH.lernt`) | alle 5 | 5 | Stalldienst: Füttern, Misten, Weidegang, Abäppeln · oder Putz-Einsatz: Putzen, Waschen, Mähne · oder Mitlaufen (S6) |
| Stallbursche | Fütterung, Stallhygiene | 30 / 25 | 5 (10) | Füttern, Misten, Weidegang, Abäppeln |
| Pferdepfleger | Haut, Hufe, Verhalten | 35 / 25 / 25 | 10 (15) | Putzen, Waschen, Mähne, Decke (Einsteller), Behandlung, Geburt-Nachtdienst. **Nicht mehr:** Abäppeln, leichte Arbeit |
| Pferdewirt Pferdezucht | Zucht, Haut, Fütterung | 50 / 40 / 40 | Hufe 25 (40), Verhalten 25 (40), Stallhygiene 20 (40), Rücken 10 (20) | Putzen, Fohlen-ABC, Geburt-Nachtdienst (besser als der Pfleger durch den höheren Zuchtwert), Behandlung, Decke, **leichte Arbeit** |
| Pferdewirt Haltung und Service | Haut, Verhalten, Fütterung, Einsteller | 35 / 35 / 35 / 40 | Hufe 20, Stallhygiene 20 (35), Zucht 10 (20), Rücken 10 (15) | Putzen, Waschen, Mähne, Decke, **leichte Arbeit**, Behandlung, Service für Einsteller |
| Bereiter | Rücken, Hufe, Verhalten | 50 / 40 / 35 | 10 (20) | Training |
| Renntrainer | Rücken, Verhalten, Hufe, Fütterung | 55 / 40 / 35 / 35 | 10 (25) | Rennpferde trainieren |
| Westerntrainer | Rücken, Verhalten, Hufe | 50 / 45 / 30 | 10 (25) | Westernpferde trainieren |
| Futterexperte | Fütterung | 80 | Stallhygiene 25 (40), Rest 10 (25) | Futterpläne |
| Hofhelfer | keiner | – | 5 (10) | Gebäude ausbessern |
| Stallmeister | alle (Allrounder) | 40 | – | Koordination, Hufschmied-Termine, Decke |

   Die neuen Startwerte gelten nur für **neue Bewerber** (sie streuen wie bisher darum, erfahrene Bewerber bis +25 % Gehalt). Angestellte behalten ihre Werte.
3. **Abäppeln:** Der Pfleger äppelt nicht mehr ab (seit v664 steht es in `aepflerN` und `MA_AUFGABEN_TYP.pfleger`), nur Stallbursche und Azubi im Stalldienst, also alle, die Boxen misten. **Leichte Arbeit** (Bodenarbeit, Freiarbeit, Spaziergang, Longieren, `pflegerLeicht`) machen jetzt beide Pferdewirte statt des Pflegers; ist keiner da, macht es wie bisher der Bereiter (`pflegerLeichtDa` prüfen und anpassen). Der Pferdepfleger lernt dazu auch bei **Hufen** (heute nur Haut und Verhalten).
4. **Grenzen:** In den Berufsbereichen kommt man bis 100 (Experte). In allen anderen Bereichen ist bei **50** Schluss (erfahren), mit Lehrgang (S5) bei **75**. Der **Stallmeister** kommt überall bis 75. Der **Spieler** hat keine Grenze. Hofhelfer: alle Bereiche Grenze 50 (kein Berufsbereich). Wer schon über seiner Grenze liegt (alte Spielstände), behält den Wert und lernt nur nicht weiter. Erreicht jemand seine Grenze, kommt einmal eine Meldung (Blase, S9).
5. **Lerntempo gleich in allen Spieltempi (4/7/10).** Heute lernt jeder pro Spieltag, darum kommt ein Azubi nach 3 Jahren bei Tempo 4/7/10 nur auf etwa 22/33/42 und Experten gibt es praktisch nie. Lernen künftig **je Jahreszeit** rechnen (oder die Tageswerte durch `tpj()` teilen). Zielwerte (Spielbalance prüfen und Faktoren einstellen):
   a. Fachkraft in ihren Berufsbereichen: „erfahren“ (40) nach etwa 1 Jahr, „sehr erfahren“ (60) nach 3–4 Jahren, Experte (80) nach 8–10 Jahren.
   b. Azubi nach 3 Jahren Ausbildung: in den Bereichen der Fachrichtung 40–50 (so wie ein durchschnittlicher neuer Bewerber, Pflicht-Lehrgänge eingerechnet), in den übrigen 15–20.
   c. `lernbegierig`, Lehrgänge (S5) und Lernen vom Kollegen machen es schneller.
6. **Vom Kollegen lernen:** Wer im selben Stall mit einem Experten (80+) arbeitet, lernt in dessen Bereich etwas schneller (Vorschlag +25 %).
7. **Lernen nach Aufgabe:** Welche Arbeit welchen Bereich steigert: Füttern → Fütterung, Misten/Einstreuen → Stallhygiene, Putzen/Mähne/Waschen → Haut, Hufe auskratzen/Weidegang → Hufe, Rosse/Geburt/Fohlen → Zucht, Umgang/Verladen/Bodenarbeit → Verhalten, Bewegen/Training → Rücken. Pferde mit passendem Befund bringen etwas mehr (wie heute bei Behandlung).
8. **Aufstiegs-Meldung:** Steigt jemand in die nächste Stufe, kommt eine kurze Meldung (Blase oder Brief an die Hofverwaltung): „Leon ist jetzt sehr erfahren in Fütterung: In seinen Boxen gibt es 10 % seltener Kolik.“ Sie nennt immer den neuen Vorteil (siehe S3). Am Jahreszeitende steht im Mitarbeiter-Dialog „seit letzter Jahreszeit: +2 Stufen“.

## S3 – Vorteile je Bereich (mittel)
1. Heute wirkt Erfahrung nur über Bemerken, Einschätzen, Behandeln, Ansteckung, Rücken-Training und Verhalten (siehe Abschnitt 1). **Dazu kommt je Bereich ein spürbarer Vorteil** ab „sehr erfahren“ (60) / „Experte“ (80):
   a. Fütterung: Kolik −10 % / −20 %
   b. Stallhygiene: Husten −10 % / −20 %
   c. Haut & Fell: Putzen bringt +1 / +2 Wohlbefinden mehr, Mauke und Sommerekzem seltener
   d. Hufe: Hufprobleme und Lahmheit −10 % / −20 %
   e. Zucht: weniger Probleme bei der Geburt, das Fohlen-ABC geht schneller
   f. Verhalten: Vertrauen des Pferdes wächst +10 % / +20 % schneller
   g. Rücken: bleibt wie heute
   h. Einsteller: Einsteller sind zufriedener, kündigen seltener Zusatzleistungen und buchen öfter dazu
   Die genauen Zahlen sind Startwerte (Dome kann sie ändern), in die Enzyklopädie eintragen.
2. **Für welche Pferde:** Grundsätzlich nur für die Pferde, die der Mitarbeiter an dem Tag versorgt (seine Boxen laut Whiteboard). Ausnahmen: Futterexperte gilt mit Fütterung für alle Pferde, für die er den Futterplan gemacht hat; Pferdewirt Haltung und Service gilt mit Einsteller für alle Einsteller des Hofs; **Stallmeister gilt im ganzen Stallgebäude, aber nur mit halber Stärke** (Beispiel: sein Vorteil für Kolik von −10 % wirkt dort als −5 %, weil er überblickt statt selbst zu füttern). Mitarbeiter wirken nur auf dem Hof, auf dem sie arbeiten.
3. **Mehrere Vorteile:** Verschiedene Bereiche zählen alle zusammen (tragende Stute mit Husten: Zucht vom Pferdewirt, Stallhygiene vom Stallburschen, Haut vom Pfleger gleichzeitig). **Derselbe Bereich von zwei Leuten wird nicht addiert, es zählt der bessere** (Fütterungs-Experte −20 % plus Stallmeister −5 % ergibt −20 %).
4. **Wo steht der Vorteil:** Tippen auf einen Balken im Mitarbeiter-Dialog zeigt, was er auf seiner Stufe kann und was die nächste Stufe bringt (mit Stufen-Wort). Die Aufstiegs-Meldung (S2 Punkt 8) nennt den Vorteil.

## S4 – Whiteboard: wer passt zu welchem Pferd (mittel)
1. **Beim Ziehen einer Mitarbeiter-Karte** auf das Whiteboard (oder Antippen der Karte und dann einer Box) leuchten die Boxen **grün** (er passt gut zu diesem Pferd) und **gelb** (ihm fehlt Erfahrung). Keine Farbe, wenn das Pferd nichts Besonderes hat.
2. **In der Box** steht neben dem zugeteilten Namen ein grüner Haken oder ein gelbes Zeichen **mit einem oder zwei Schlagwörtern**. Antippen zeigt den Grund ausführlich, z. B. „Leon kennt sich mit Fütterung aus, gut für Paul (Kolik)“.
3. **Zustand des Pferdes → passender Bereich:**
   a. Husten oder Staub-Befund → Stallhygiene
   b. Kolik, zu dünn oder zu dick → Fütterung
   c. Mauke, Wunde, Ekzem oder sehr dreckig → Haut & Fell
   d. Lahm, Hufprobleme oder Hufschmied-Termin → Hufe
   e. Tragende Stute, Rosse oder Fohlen bei Fuß → Zucht
   f. Nervöses, schwieriges oder junges, rohes Pferd → Verhalten
   g. Pferd im Training oder mit Rückenbefund → Rücken
   Einsteller-Pferd → Einsteller (nur bei Mitarbeitern mit diesem Bereich).
4. **Grün**, wenn der passende Bereich eine Stärke ist (ab „erfahren“ 40). **Gelb („wenig Erfahrung“)**, wenn der passende Bereich unter 20 liegt (Anfänger).
5. **Eigenschaften zählen mit:** „ruhige Hand“ passt grün zu nervösen und jungen Pferden, „aufmerksam“ grün zu kranken Pferden; „ungeduldig“ gelb bei nervösen oder jungen Pferden, „schusselig“ gelb bei kranken Pferden.
6. **Schlagwörter** immer „Bereich oder Eigenschaft – Grund“: „✅ Fütterung – Kolik“, „✅ ruhige Hand – nervös“, „✅ aufmerksam – krank“, „⚠️ wenig Erfahrung – Husten“, „⚠️ ungeduldig – Jungpferd“, „⚠️ schusselig – krank“.
7. Die Zeichen sind nur Hinweise, die Zuteilung bleibt frei. Keine versteckten Werte zeigen.

## S5 – Lehrgänge (mittel, ab Fortgeschritten)
1. Unter Hauptmenü - Hofverwaltung - Mitarbeiter - (Mitarbeiter antippen) - Fortbildung: je Bereich ein Kurs, **150 €, 2 Tage weg** (der Mitarbeiter fehlt wie im Urlaub, Kollegen übernehmen), **+10** im Bereich. Höchstens 1 Kurs pro Jahreszeit und Person. Ein Kurs hebt auch die Grenze (S2 Punkt 4) in Fremdbereichen von 50 auf 75.
2. **Lehrgänge haben feste Termine:** Man bucht für die **nächste Jahreszeit**; je Bereich gibt es 1–2 Termine, manche sind ausgebucht oder ein Bereich wird in der Jahreszeit nicht angeboten („nicht immer“). Selten (10 %) sagt der Veranstalter ab: Brief und Geld zurück. Gebuchte Lehrgänge stehen im Kalender (S8); Urlaub darf nicht darauf fallen.
3. Der Spieler kann selbst Kurse machen (gleiche Kosten, ohne Fehltage).
4. Azubis: siehe S6.

## S6 – Azubi (groß)
1. **Einstellen nur im Herbst.** Azubi-Bewerbungen kommen im Sommer und nur, wenn ein freier Ausbilder da ist; Ausbildungsbeginn ist immer im Herbst. In den anderen Jahreszeiten keine Azubi-Bewerber.
2. **Ausbilder wählen:** Beim Einstellen aus den freien Ausbildern wählen (der passende steht oben). Später im Azubi-Dialog wechselbar, wenn beim anderen ein Platz frei ist. Passender Ausbilder: Pferdewirt Pferdezucht für Fachrichtung Pferdezucht, Pferdewirt Haltung und Service für Pferdehaltung und Service, Bereiter für Klassische Reitausbildung, Stallmeister passt immer; passend lernt der Azubi normal, unpassend ×0,7. Er lernt umso schneller, je erfahrener der Ausbilder im jeweiligen Bereich ist. (Heute bekommt er automatisch den ersten freien Ausbilder.)
3. **Der Spieler als Ausbilder** (Ausbilderschein): Der Azubi lernt in den Bereichen, in denen der Spieler an dem Tag selbst gearbeitet hat (Füttern → Fütterung usw., S1 Punkt 9), und zwar so schnell, wie es der Erfahrung des Spielers entspricht. Er fehlt dabei nicht im Stall.
4. **Lernen aller Bereiche:** 1. Jahr Grundausbildung: lernt in allen 7 Bereichen ein bisschen (Fachrichtung Haltung und Service auch Einsteller). 2. und 3. Jahr Fachrichtung: Bereiche der Fachrichtung schnell, die anderen langsam weiter.
5. **Drei Einsätze statt zwei:** Stalldienst, Putz-Einsatz oder **Mitlaufen beim Ausbilder** (neue Wahl im Azubi-Dialog und am Whiteboard, jederzeit wechselbar). Er arbeitet dann nicht im Stall und lernt mehr, aber nur in den Bereichen seines Ausbilders (Pferdewirt Pferdezucht: Geburt, Fohlen-ABC; Bereiter: Training). Ein Ausbilder kann einen Azubi gleichzeitig mitnehmen. **Jeder Wechsel des Dienstes gilt erst ab dem nächsten Morgen** (die Arbeit läuft jeden Morgen, der Azubi hat heute schon gearbeitet); im Dialog steht „ab morgen: Mitlaufen“.
6. **Azubi im Putz-Einsatz** putzt, wäscht und kürzt Mähne/Schopf (ab dem 1. Jahr). **Azubi im Stalldienst** füttert, mistet, Weidegang, äppelt ab.
7. **Pflicht-Lehrgang** 1 pro Ausbildungsjahr kommt automatisch per Brief (150 €, 2 Tage weg); in den Zielwerten aus S2 Punkt 5b schon eingerechnet. **Freiwillige Lehrgänge** zusätzlich wie bei Fachkräften (höchstens 1 pro Jahreszeit, +10); mit vielen kommt er auf etwa 55–65 und ist dann besser als ein normaler Bewerber. Grenzen wie in S2 Punkt 4 mit den Berufsbereichen des künftigen Berufs.
8. **Berufsschule:** einmal pro Ausbildungsjahr im Winter, 2 Tage; der Azubi steht dann als abwesend am Whiteboard, ein Kollege springt ein wie bei Urlaub. Er lernt Theorie (+2 in allen Bereichen), auch ohne Ausbilder. Vorher kurzer Brief. Keine Kosten. Im Kalender sichtbar.
9. **Urlaub nur im Sommer.** Nach der Prüfung bekommt er wie bisher Gehalt und Werte (Berufsbereiche 40–50, übrige 15–20, siehe S2).

## S7 – Probezeit und Urlaub (mittel/groß)
1. **Probezeit** für alle neu eingestellten Fachkräfte (nicht Azubis): **2 Jahreszeiten ab Arbeitsbeginn, kein Urlaub**. Im Mitarbeiter-Dialog steht „Probezeit bis Winter 2001“. Gehalt **75 % nur in der 1. Jahreszeit der Probezeit** (Einarbeitung), ab der 2. Jahreszeit 100 % (Dome, 26.10.). In der 1. Jahreszeit schafft er **1 Box weniger** (Einarbeitung). **Kündigung in der Probezeit ist fristlos und gilt sofort**, von beiden Seiten (Brief). Bestehende Mitarbeiter haben keine Probezeit.
2. **Urlaub:** etwa 10 % des Jahres, als **1 Block in einer Jahreszeit** seiner Wahl: Tempo 4: 2 Tage, Tempo 7: 3 Tage, Tempo 10: 4 Tage pro Jahr. Der Azubi nimmt nur im Sommer. Anspruch erst nach der Probezeit. Ersetzt den zufälligen Urlaub (`URLAUB_CHANCE`, `urlaubJahr`, 1–3 Tage, Antrag 2 Tage vorher).
3. **Urlaubsplanung per Sammelbrief:** Zu Beginn jeder Jahreszeit kommt **ein Brief „Urlaubsplanung“ mit allen Urlaubswünschen** für die nächste Jahreszeit. Alle Wünsche stehen sofort **gestrichelt und transparent im Kalender** (S8). Dort kann man jeden Wunsch **um wenige Tage verschieben** (Tempo 4: ±1, Tempo 7: ±2, Tempo 10: ±3), genehmigen, **in die nächste Jahreszeit verschieben** oder ablehnen. Verschieben in die nächste Jahreszeit ärgert den Mitarbeiter deutlich weniger als Ablehnen (Dome, 26.10.: z. B. wenn drei gleichzeitig weg wollen): Zufriedenheit −1 statt −5 bei Ablehnen. Der verschobene Wunsch bekommt in der nächsten Jahreszeit **Vorrang** und darf dann nicht noch einmal verschoben werden (nur genehmigen oder ablehnen). Der Urlaubsanspruch verfällt nicht, auch wenn der Block dadurch ins nächste Jahr rutscht. **Azubi-Urlaub kann nicht verschoben und nicht abgelehnt werden** (Schutzstatus, Dome 26.10.): Er bekommt seinen Sommerurlaub, im Plan nur „genehmigen“. Dann „Plan abschicken“. Ein verschobener Wunsch wird je nach Zufriedenheit angenommen oder nicht. Manche Wünsche sind „fest“ (z. B. Hochzeit): nur genehmigen oder ablehnen. Was zu Beginn der Jahreszeit noch offen ist, gilt als genehmigt (wie bisher). Im Kalender (und im Brief) sieht man, was dann ansteht: Turnier, erwartete Geburt, Urlaub eines Kollegen, Lehrgang. **Warnung**, wenn zwei aus demselben Beruf gleichzeitig weg wollen. Urlaub darf nicht auf einen gebuchten Lehrgang fallen.
4. **Anzeige im Mitarbeiter-Dialog** (kein Zähler, weil es ein Block ist): „Urlaub 2001: noch nicht geplant“, „beantragt für Sommer“, „genehmigt, Sommer, 3 Tage“, „genommen“.
5. Krankheit und Kündigung (Zufriedenheit) bleiben wie bisher.

## S8 – Kalender (groß)
1. Neuer Reiter **„Kalender“ unter Hauptmenü - Hofverwaltung** (ein Kalender je Hof, mit dem üblichen Hof-Wechsel). Er soll **echt wie ein Wandkalender mit Kacheln aussehen**: ein Blatt je Jahreszeit, eine Kachel je Tag.
2. **Spieltempo beachten:** Tempo 4 = 4 große Kacheln in einer Reihe, Tempo 7 = 7 Kacheln in einer Reihe, Tempo 10 = 2 Reihen à 5. In jeder Kachel: Tag, bis zu 3 Symbole und „+2“, wenn es mehr sind. Heute ist farbig umrandet. Pfeile blättern **bis zu 3 Jahreszeiten voraus** (nicht nur die nächste). Tippen auf einen Tag zeigt die Einzelheiten.
3. **Inhalt:**
   a. Mitarbeiter: Urlaub (beantragt gestrichelt, genehmigt), Berufsschule, Lehrgänge (gebucht, Pflicht-Lehrgang), Ende der Probezeit, Abschlussprüfung, Arbeitsbeginn neuer Leute
   b. Turniere: nur die **gemeldeten** und das eigene Hausturnier (der ganze Turnierkalender bleibt, wo er ist)
   c. Pferde: Hufschmied-Termine, erwartete Geburten, Deckstation-Termine, Rückkehr aus Klinik, Aufzucht oder Ausbildungsstall
   d. Geld: fällige Rechnungen, Ende eigener Auktionen, **Gehaltstag** (= der Tag zu Beginn jeder Jahreszeit, an dem alle Gehälter abgebucht werden; zeigt, wie viel Geld an dem Tag da sein muss)
4. Das Datenmodell offen und erweiterbar halten (Liste von Terminen mit Tag, Art, Symbol, Text, Hof), damit später weitere Dinge hineinkommen. Auf Kamera-Aussparung (safe-area) achten, Anzeigeboxen dürfen sich nicht überdecken.

## S9 – Hinweisblasen, Tutorial, Stufen, Tests
1. **Hinweisblasen** (einmalig beim ersten Mal, höchstens 2 Sätze, im bestehenden Blasen-System; wenn das System aus dem Hinweise-Auftrag noch nicht gebaut ist, die bestehenden Tipp-Fenster nutzen):
   a. Mitarbeiter-Dialog: „⭐ zeigt seine Stärken. Tipp auf einen Balken, dann siehst du, was er dadurch kann.“
   b. Bewerbung: „Vergleiche die Balken. Schwächen verraten Bewerber nicht immer.“
   c. Whiteboard: „Grün heißt, er passt gut zu diesem Pferd, gelb heißt, ihm fehlt Erfahrung. Tipp aufs Zeichen für den Grund.“
   d. Erster Aufstieg: „Dein Mitarbeiter ist besser geworden! In seinen Boxen wirkt sich das ab jetzt aus.“
   e. Berufsgrenze erreicht: „Leon ist bei Hufen an seiner Grenze. Mit einem Lehrgang kommt er weiter.“
   f. Azubi mitlaufen: „Er lernt die Arbeit seines Ausbilders, fehlt dann aber im Stall.“
   g. Eigene Erfahrung: „Auch du lernst: Was du selbst machst, darin wirst du erfahrener.“
   h. Kalender: „Hier siehst du alle Termine. Urlaubswünsche stehen gestrichelt drin, bis du entschieden hast.“
2. **Tutorial, Kapitel 7 „Mitarbeiter“** (bestehendes Anfänger-Tutorial mit Testpferden, falls schon gebaut, sonst im Plan vermerken): Das Testpferd hat leichten Husten. Ziel: zwei Bewerber vergleichen, den mit der Stärke Stallhygiene einstellen und ihn am Whiteboard auf das Testpferd ziehen, bis der grüne Haken kommt. Zum Schluss einmal den Kalender öffnen.
3. **Stufen (Anfänger / Fortgeschritten / Experte):** Stärken, Balken, Whiteboard-Zeichen und Kalender gibt es für alle Stufen. **Lehrgänge und das Mitlaufen des Azubis gibt es ab Fortgeschritten.**
4. **Enzyklopädie** (Berechnungen zum Nachschlagen, nur Admin): Stufen-Wörter, Berufstabelle (S2), Grenzen, Lerntempo und Zielwerte, Vorteile je Bereich (S3), Passung (S4), Lehrgänge, Probezeit, Urlaub, Kalender. Den Abschnitt „Erfahrung“ und „Azubi und Ausbilder“ aktualisieren (neuer Bereichsname, neue Regeln).
5. **Testen:** Skript-Test (Playwright, `file://`): Stärken bei Gleichstand ohne Stern; Berufsgrenzen 50/75/100, Stallmeister 75; Lerntempo-Simulation 3 Jahre bei Tempo 4/7/10 (ähnliche Werte); Vorteile addieren nicht doppelt im selben Bereich; Whiteboard-Passung (grün/gelb mit Schlagwort); Lehrgang buchen, Absage, Urlaub nicht auf Lehrgang; Azubi nur im Herbst einstellen, Ausbilder wählen, Mitlaufen ab nächstem Morgen; Probezeit (kein Urlaub, 75 %, sofort kündigen); Urlaubs-Sammelbrief mit Verschieben; Kalender in Tempo 4/7/10. Alter Spielstand lädt ohne Fehler (Name Pferdewirt, `klima` bleibt, fehlender 8. Bereich nur bei Service-Berufen). Screenshots in allen drei Ansichten (PC 1366×768, Handy quer 844×390, Handy hochkant 390×844) für Mitarbeiter-Dialog, Whiteboard, Kalender.

## Nicht in diesem Auftrag (später)
Osteopath, Physiotherapeut, Pferdezahnarzt, Sattler (externe Fachleute auf Termin) sind ein eigenes Thema. Prioritäten/Rangfolge der Aufgaben und eine feste Zuordnung Mitarbeiter ↔ Pferd gibt es im Spiel schon teilweise (Whiteboard-Zuteilung, `nurFuer`); Dome wollte dazu nichts Neues.

## Stand
- Vom Projekt-Chat übernommen (Claude Pro, 27.10.2026).
- **S1 (v860), S2 (v862), S3 (v863), S4 (v865), S5 (v866), S6 (v867), S7 (v868), S8 (v869), S9 (v870) fertig – Auftrag komplett.** S9 Tutorial: Anfänger-Kapitel „Mitarbeiter“ mit Stallhygiene-Bewerber und Kalender; **nicht gebaut:** Husten-Testpferd und Whiteboard-Ziehen bis zum grünen Haken (Anfänger haben kein Whiteboard, bräuchte den Tutorial-Spieler-Test – Dome fragen). S8 noch ohne Deckstation und Rückkehr aus Aufzucht/Ausbildungsstall. S7: Urlaubsplanung vorerst als Fenster aus dem Sammelbrief, Kalender-Anzeige kommt mit S8. In S6 nicht gebaut: Einsatz-Wahl am Whiteboard (nur im Azubi-Dialog).
- **Nachtrag v875 (Dome 27.10.):** Azubi-Einsatz auch am Whiteboard; Kalender mit Rückkehr aus Aufzucht/Ausbildungsstall; Anfänger-Tutorial Mitarbeiter mit Husten-Pferd Hanna und Whiteboard. Offen: Kalender ohne Deckstation-Termine.
