# Zuchtstall – Werte-System: Auftrag für die Coding-Sitzung

Stand: 5.10.2026, Spielversion 160. Mit Dome geplant und abgestimmt.
Ausführliche Gesprächsnotizen: `werte/plan.md` *(liegt noch im Planungsprojekt, nicht im Repo)*. Bilder zur Ausbildungsskala: `werte/ausbildungsskala-phasen.png`, `werte/ausbildungsskala-haltung.png`.

## Stand der Umsetzung

- [x] Etappe 1 – Werte-Grundlage (v161, Alter und Name „Eigenschaften“ in v162, von Dome getestet)
- [x] Etappe 2 – Charakter → Wohlbefinden (v164, von Dome getestet; Admin „Charakter selbst wählen“ in v165)
- [x] Etappe 2b – Weide und Herde (v166–168, von Dome getestet)
- [x] Etappe 3 – Vorlieben und Reaktionen (v169–171, Sprechblasen und seltenere Vorlieben; von Dome getestet)
- [x] Etappe 4 – Training daheim (v198, von Claude per Skript getestet – 54 Prüfungen; Dome macht später einen Gesamttest) · Krankheiten-Plan A–H ist erledigt. Mit Dome abgestimmt: Spieler hat erstmal nur Reitplatz und Gelände (Admin: alle Orte), jede Stufe der Ausbildungsskala einzeln gespeichert, Bereiter nach Plan **oder** „entscheidet selbst“.
- [x] Etappe 5 – Disziplinen (v200, von Claude per Skript getestet). Mit Dome abgestimmt: eigener Stand je Disziplin (Springen, Western, Gelände/Kondition), Western-Stufen Einsteiger/Rookie/Novice/Intermediate/Open, Springhöhe ≈ 0,95 × Stockmaß.
- [~] Etappe 6 – Turniere · **6a fertig (v202–203, von Claude per Skript getestet, inkl. 3 Jahre Langzeit-Simulation):** Turnierkalender (Hofturnier, Regional, Groß; Freiluft/Halle), Nennen über beide Pferdeanhänger bis zum Vortag, Turniertag unterwegs, Ergebnis am nächsten Tag per Brief (Dome), Dressur/Springen/Vielseitigkeit/Western/Gelassenheit, Reiter-LK je Disziplin mit Startrechten und Aufstieg, Tagesform und Turnierstress, Preisgeld/Schleifen, Erfolge in Akte und Marktwert. **Offen 6b:** Rennen (mit Jockey), Distanz (Tierarztkontrolle), Tölt, Championate/International, Reiterprofil in der Hofverwaltung, LK verbessert das eigene Training, Decktaxe durch Erfolge – · **Danach kommt `PLAN-FUETTERUNG.md` (Etappen F1–F5) – eine Werte-Etappe 7 gibt es nicht. Vorher Dome fragen: „Mit Fütterung F1 weitermachen?“ (Dome, 5.10.2026).**

**Ziel:** Alles greift ineinander. Charakter, körperliche und mentale Werte, Versorgung (Wohlbefinden), Training, Ausbildung, Gangwerk, Disziplinen und Turniere beeinflussen sich gegenseitig. Jedes Pferd soll ein echtes Spezialtalent haben statt überall gut zu sein.

**Wichtig für die Umsetzung:** Das ist ein großes Paket. Bitte in Etappen (siehe Abschnitt 10) umsetzen, nach jeder Etappe auf `main` hochladen. Speicherstände abwärtskompatibel halten (fehlende Werte für alte Pferde aus Rasse + Zufall erzeugen). Enzyklopädie (Berechnungen zum Nachschlagen) mit allen Zahlen aktualisieren. Bei Unklarheiten erst bei Dome nachfragen.

---

## 0. Ablauf – bitte Dome Schritt für Schritt anleiten

Dome arbeitet zum ersten Mal mit so einem großen Plan. Bitte führe Dome aktiv durch den Ablauf und sag bei jedem Schritt, was als Nächstes zu tun ist.

1. **Zuerst:** Diesen Plan als `PLAN-WERTE.md` ins Repo speichern (zusammen mit den beiden Bildern zur Ausbildungsskala, falls Dome sie hochlädt) und auf `main` hochladen. Dome kurz bestätigen, dass der Plan gespeichert ist.
2. **Immer nur eine Etappe** (Abschnitt 10) auf einmal. Vor dem Start Aufwand einschätzen (klein/mittel/groß) und Dome sagen, was in der Etappe passiert.
3. Nach jeder Etappe: testen (Test-Skript, bei Aussehen-Änderungen Screenshots in allen Ansichten), auf `main` hochladen, Version hochzählen.
4. **Dann Dome eine kurze Test-Anleitung geben:** genau welche Menüwege Dome im Spiel öffnen soll und worauf achten (ausgeschrieben, z. B. „Hauptmenü - Stall - Box - Steckbrief - Charakter: ist dort Sensibilität zu sehen?“). Auch sagen, dass Dome die Seite neu laden soll.
5. **Auf Domes Rückmeldung warten.** Erst wenn Dome sagt, dass alles passt, nach „weiter mit Etappe X“ fragen. Wünsche und Fehler zuerst beheben.
6. Am Ende jeder Etappe sagen: was fertig ist, was noch offen ist, welche Etappe als Nächstes kommt. In `PLAN-WERTE.md` die erledigte Etappe abhaken, damit spätere Sitzungen den Stand kennen.
7. Fällt beim Bauen etwas auf, das im Plan fehlt, unklar oder unrealistisch ist: nicht selbst entscheiden, sondern Dome fragen (Dome kann es im Planungsprojekt klären und den Plan ergänzt zurückbringen).
8. Nach Etappe 6 Dome sagen, dass die Werte-Planung umgesetzt ist und die nächsten Themen (Fütterung, Hof-Ausbau, Ausrüstung) im Planungsprojekt besprochen werden können.

## 1. Werte-Gruppen

1. **Charakter** (nur vererbt, unveränderlich, Skala 3–97, wie bisher `CHARAKTER` in pferd.js):
   1. Temperament (ruhig ↔ temperamentvoll)
   2. Mut (scheu ↔ mutig)
   3. **Neugier** (verträumt ↔ neugierig) – umbenannt aus „Wachheit“, Schlüssel im Speicherstand übernehmen
   4. Menschenbezug (eigenständig ↔ verschmust)
   5. Arbeitswille (eigensinnig ↔ leistungsbereit)
   6. Nervenstärke (nervös ↔ gelassen)
   7. **NEU: Sensibilität** (robust ↔ sensibel)
2. **Körperliche Werte** (0–100; vererbte Obergrenze aus Rasse + Eltern, Training füllt bis zur Grenze auf):
   1. Kraft = Hinterhandkraft (Sprungkraft, Versammlung halten, Western: enge Wendungen und schnelle Starts)
   2. Ausdauer
   3. Geschwindigkeit (nur vererbt, kaum trainierbar)
   4. Beschleunigung
   5. Wendigkeit (enge Kurven)
   6. Beweglichkeit (Bewegungsumfang, Geschmeidigkeit)
   7. Koordination (z. B. Hindernis richtig anreiten, Stangenarbeit)
   8. Zähigkeit (Belastung, schwierige Bedingungen)
   9. Regeneration (Erholung nach Training)
   10. Konstitution (nur vererbt; Robustheit) – ersetzt einen zweiten „Gesundheit“-Wert, Gesundheit bleibt unter Versorgung
3. **Mentale Werte** (0–100):
   1. Lernfähigkeit (nur vererbt; ersetzt das bisherige versteckte `talent`)
   2. Konzentration (Lektionen fehlerfrei durchziehen) – trainierbar bis zur Obergrenze
   3. Reaktionsfähigkeit (schnelle Abfolgen, z. B. Sprungkombinationen) – trainierbar bis zur Obergrenze
   4. Vertrauen (nur erarbeitet: Pflege, Zeit; schneller bei verschmusten Pferden)
   5. Gehorsam (nur erarbeitet: durch Ausbildung)
4. **Energie** ist kein Wert, sondern ein Tagesvorrat: Training leert ihn, über Nacht füllt er sich je nach Regeneration.
5. Obergrenzen realistisch: Ein Shetty springt nie wie ein Vollblut, egal wie viel trainiert wird. Kraft relativ zur Größe (Ponys sind kräftig); absolute Sprunghöhe begrenzt durch Stockmaß.
6. Anzeige: Box - Steckbrief bekommt eine Karte für körperliche und mentale Werte (Balken wie Gangwerk). **Name: „Eigenschaften“ (Kürzel eig).** Spieler sehen nur den aktuellen Wert, die Obergrenze sieht nur der Admin.
7. **Alter** (mit Dome abgestimmt): erreichbar ist Anlage × Altersfaktor.
   - Wachstum: unter 1 Jahr 40 %, 1 J. 55 %, 2 J. 70 %, 3 J. 80 %, 4 J. 90 %, ab 5 J. 100 % (Lernfähigkeit ohne Wachstumsgrenze).
   - Abbau je Jahr (anteilig je Jahreszeit): die ersten 5 Jahre −3 %, danach −5 %, nie unter 20 %.
   - Beginn: früh ab 12 (Geschwindigkeit, Beschleunigung, Regeneration), normal ab 13 (Kraft, Ausdauer, Wendigkeit, Beweglichkeit, Koordination, Zähigkeit, Konzentration, Reaktionsfähigkeit), spät ab 18 (Konstitution, Lernfähigkeit). Vertrauen und Gehorsam altern nicht.
   - Werte über der Altersgrenze sinken zu Beginn jeder Jahreszeit auf diese Grenze.
   - Etappe 4: regelmäßiges Training bremst den Abbau im Alter etwas.
8. Startstand der trainierbaren Werte (bis Training daheim kommt): Altersgrenze × (60 % + ab 3 Jahren bis zu 30 % je nach Ausbildungsstand). Bestehende Pferde behalten ihre alten Gangnoten (Dome beginnt einen neuen Spielstand).

## 2. Charakter → Wohlbefinden

Nur ausgeprägte Werte wirken (unter 30 oder über 70), je extremer desto stärker, die Mitte ist neutral.
1. Temperament: temperamentvoll braucht Bewegung, Boxtage kosten mehr Wohlbefinden; ruhig verträgt die Box besser.
2. Mut: scheu → Neues stresst (fremde Herde, Gelände, Anhänger, Klinik, Reithalle); mutig freut sich über Gelände und Sprunghindernisse.
3. Neugier: neugierig braucht Abwechslung (immer dieselbe Arbeit → Langeweile), mag Gelände; verträumt mag Routine.
4. Menschenbezug: verschmust freut sich mehr übers Putzen und vermisst es; eigenständig ist die Herde wichtiger.
5. Arbeitswille: leistungsbereit vermisst Arbeit an freien Tagen; eigensinnig mag zu viel Training nicht.
6. Nervenstärke: nervös leidet bei Lärm, Turnier, Anhänger, Klinik, neuer Herde; gelassen steckt das weg.
7. Sensibilität: steuert Reaktionen auf Ausrüstung, Decken, Putzen, Hilfen; sensible Pferde sind dafür besser in der Dressurarbeit.
8. Weide = Herde: Alle eigenen Pferde auf der Weide sind eine Herde. Nach einigen gemeinsamen Weidetagen kennen sie sich; vorher Eingewöhnung, die bei scheuen und nervösen Pferden aufs Wohlbefinden drückt.
9. Haltungsformen (künftig): Box (einzeln), Box mit Paddock (klein, Sand, kein Gras, Pferd geht selbst rein und raus), Weide (Herde).

## 2b. Weide und Herde (mit Dome besprochen, 6.10.2026)

Von Dome entschieden. **Endgültige Zahlen (von Dome bestätigt):** Heu nötig im Winter und am letzten Herbsttag · Weide-Wohlbefinden +15, Winter +8, allein +6 · Bedeckung 25 % pro Nacht je Stute, Warnung nur beim allerersten Mal · Sozialverhalten wie unten, pro Jahreszeit ausgeglichen (× 4 ÷ Tage pro Jahreszeit) · Bedeckung und Streit werden NICHT nach Tagen pro Jahreszeit umgerechnet · Streit höher: Paarwert 0–12 %, Sozialverhalten bis +8 %, temperamentvoll/eigensinnig bis +5 %, zwei Hengste +35 %, Streit −10 Wohlbefinden, 20 % Verletzung. Nachträglich (v168): Hengstkampf, wenn Stuten (ab 2 J.) dabei sind, +20 % und 35 % Verletzungsgefahr; Fahrtstress getrennt – nervös: Fahrt −14·e, fremder Ort −6·e · scheu: Fahrt −6·e, fremder Ort −12·e (zusammen, gelassen bremst bis zur Hälfte). Ursprüngliche Vorschläge:

**A. Weide-Regeln überarbeiten**
1. Winter (und letzter Herbst-Tag?) kaum Gras: auf der Weide muss Heu zugefüttert werden, sonst gilt das Pferd als hungrig (−19 Gesundheit, −8 Wohlbefinden wie in der Box). *Vorschlag:* Heu auf der Weide über einen Knopf „Heu auf die Weide“ in der Weide-Ansicht; der Stallbursche erledigt es für seine Boxen mit.
2. Wohlbefinden auf der Weide nicht immer +15: Winter +8 (Kälte, Matsch).
3. Gesundheit auf der Weide mit Risiko: Streit in der Herde kann verletzen (siehe C4).

**B. Allein auf der Weide**
- Allein nur +8 statt +15. Eigenständig (e) macht das nichts (+7·e zurück); verschmust, scheu, nervös zusätzlich −4·e (max. der drei).

**C. Herde – wer passt zusammen**
1. **Hengst + Stute zusammen:** ungeplante Bedeckung möglich. *Vorschlag:* pro gemeinsamer Nacht Chance 25 % (Hengst ab 2 Jahren, Stute im Zuchtalter 3–20, nicht tragend, Deckzeit egal). Ob sie dann tragend wird, entscheidet wie beim normalen Decken das **Wohlbefinden** (40 % + 55 % × Wohlbefinden; Durchschnitt beider). Warnung beim Rausstellen. Fohlen hat den Hengst als Vater, Brief „ungeplant gedeckt“ erst, wenn die Trächtigkeit auffällt (z. B. nach 1 Jahreszeit)?
2. **Hengste ab 3 Jahren** nur allein oder mit Wallachen; mit anderen Hengsten Rangkämpfe (Streit-Chance stark erhöht), mit Stuten siehe C1.
3. **Sozialverhalten** (neuer versteckter Wert 0–100, Admin sieht ihn): steigt bis 3 Jahre durch Herdenzeit. *Vorschlag:* pro Tag in der Aufzuchtstation +2 (beste Lösung: viele Fohlen/Jungpferde, wenige Erwachsene), pro Tag auf der eigenen Weide mit mind. 2 anderen Fohlen/Jungpferden +1,5, mit weniger Jungtieren +0,5, bei der Mutter +0,3. Start 20. **Kastration** beeinflusst das Verhalten: früh kastriert (bis 2 Jahre) → Hengstverhalten verschwindet ganz; später kastriert → bleibt zum Teil (Streit-Chance mit Hengsten/Wallachen ×1,5, „hengstiges Verhalten“ bei Stuten möglich, aber keine Bedeckung).
4. **Unverträglichkeit:** Manche Paare mögen sich nicht (fester Zufallswert je Paar + Charakter + Sozialverhalten). *Vorschlag:* Streit-Chance pro Nacht = Grundwert je Paar (0–8 %) + schlechtes Sozialverhalten (bis +6 %) + temperamentvoll/eigensinnig (bis +3 %) + Hengst-Rangkampf (+20 %). Streit: beide −8 Wohlbefinden; 15 % der Streits → Verletzung (Gesundheit −10 bis −25). Meldung als Brief/Hinweis („Fee und Rocky haben sich gestritten“). Spieler muss die beiden trennen (eins in die Box holen).
5. **Ankerpunkte für später (Krankheiten):** Verletzungen und Krankheiten bekommen einen eigenen Eintrag am Pferd (z. B. `p.befund = { art: "lahm" | "biss" | …, seit, schwere }`), der später Lahmheit, Behandlung beim Tierarzt, Trainingspause und Turniersperre auslösen kann. Jetzt nur anlegen und anzeigen, noch keine Folgen außer Gesundheit.

## 3. Vorlieben und Reaktionen

1. Jedes Pferd hat versteckte Vorlieben und Abneigungen, größtenteils aus dem Charakter, ein kleiner Teil zufällig.
2. Jede Spieleraktion (Putzen, Füttern, Ort, Training, später Ausrüstung) löst eine passende Reaktion aus: zunächst kurzer Text (z. B. „legt die Ohren an und weicht zurück“), dazu Wohlbefinden ±, ggf. gebremstes Training. Später ersetzen Animationen die Texte (Kopf wegziehen, in der Paddockbox weggehen, Ohren anlegen, Schweifschlagen, mit dem Vorderhuf betteln, wütend aufstampfen).
2a. **Bis die Animationen kommen, erscheinen die Reaktionen als Sprechblase am Pferd im Stallbild** (z. B. „*schließt genießerisch die Augen*“); ist das Pferd nicht in der Box (Weide, Anhänger), an der Boxentür. Wohlbefinden ändert sich je Aktion nur einmal am Tag. (Dome, v170)
3. Dem Spieler wird vorher NICHT gesagt, was das Pferd mag. Entdeckte Vorlieben erscheinen erst, wenn man sie erlebt hat: Knopf „Vorlieben“ in Box - Steckbrief - Charakter.
4. Ausrüstung (Trense, Reithalfter, Sattel, Decken …) kommt später als eigener Schritt. **Dome, 6.10.2026: Sobald die Ausrüstung kommt, sind Sattel und Trense Pflicht zum Reiten (bis dahin geht Reiten ohne).** Das Vorlieben-System so bauen, dass neue Gegenstände einfach als Vorlieben-Ziel dazukommen. Beispiel für später: Sensible Pferde mögen keine Trense mit kombiniertem Reithalfter, lieber einfache Trense ohne Reithalfter, und keine Regen-/Winterdecke.

## 4. Lerntempo

1. Lerntempo = Lernfähigkeit × Wohlbefinden (bestehender `wohlFaktor`) × Charakter × Vorliebe für die Übung.
2. Charakter beim Training mentaler Werte: leistungsbereit → Gehorsam und Konzentration schneller; verschmust → Vertrauen schneller; nervös → Reaktionsfähigkeit langsamer.
3. Ungeliebtes, Ungekonntes oder gerade Neues kostet mehr Energie als Lektionen, die das Pferd mag und kann. Übertraining senkt Wohlbefinden und Gesundheit.

## 5. Trainingsorte (Box - Pferdepflege - Ort)

1. **Roundpen:** Bodenarbeit, Longieren, Freiarbeit, Stangenarbeit. Trainiert Vertrauen, Gehorsam, Takt, Losgelassenheit; Stangenarbeit zusätzlich Gangwerk, Koordination, Konzentration. Auch für junge, scheue und eigensinnige Pferde.
2. **Reitplatz:** Dressur-, Spring-, Westernarbeit, Doppellongenarbeit (trainiert Versammlung). Bei Regen/Winter schwächere Wirkung. Longieren möglich, behindert aber andere Reiter.
3. **Reithalle:** wie Reitplatz, wetterunabhängig – aber scheue/ängstliche Pferde fürchten sie (sehen die anderen Pferde nicht, fühlen sich eingeschlossen).
4. **Gelände:** Ausritt, Kondition, Geländesprünge. Trainiert Ausdauer, Zähigkeit, Kraft, Koordination. Mutige und neugierige Pferde lieben es, scheue stresst es.
5. **Trainingseinheit kombinierbar**, z. B. Aufwärmen an der Longe (im Winter wichtig) → Arbeit → Ausritt als Belohnung. Begrenzung über Energie statt fester Anzahl pro Tag.
6. Nach jeder Einheit kurzer Trainingsbericht (z. B. „Takt +2, Kraft +1“), damit Fortschritt sichtbar ist.
7. Bereiter (Hofverwaltung - Mitarbeiter, aktuell „bald“) kann später übernehmen; externer Ausbildungsstall bleibt als teure, schnelle Lösung.
8. Welche Orte am Anfang da sind und was gebaut werden muss, gehört zum Hof-Ausbau (siehe `werte/hof-ausbau-ideen.md`, noch nicht ausgeplant). Laut Dome startet man mit Reitplatz und kleiner Weide.

## 6. Ausbildungsskala und Gangwerk

1. Ausbildungsskala bleibt (Takt → Losgelassenheit → Anlehnung → Schwung → Geraderichtung → Versammlung, bestehende 20-%-Regel), steigt jetzt auch durch Training daheim.
2. Phasen als Klammern anzeigen (Bild 1): Gewöhnungsphase 1–3, Entwicklung der Schubkraft 2–5, Entwicklung der Tragkraft 4–6.
3. Gewöhnungsphase geht schneller mit Vertrauen, Gehorsam und ruhigem, nervenstarkem Charakter.
4. Schubkraft = Kraft + Gangwerk; Tragkraft = Kraft + Körperbau (barocke Rassen wie Lipizzaner, Andalusier, Friese stark; Vollblut schwächer – bestehender Rassenfaktor `dress` in `PROFIL`). Stufen 4–6 können nur so hoch steigen, wie Schub-/Tragkraft es zulassen.
5. Gangwerk bleibt in Wertnoten. **Noten senken:** Rassen-Grundwerte in `PROFIL.gang` um ca. 1,5 senken, Streuung etwas erhöhen. Ziel: meist 5,5–7, eine 8 hat etwa jedes 20. Pferd, ab 8,5 nur Ausnahmepferde. (Aktuell z. B. Hannoveraner 8/8/8, Vollblut-Galopp 9 – zu hoch.)
6. Vererbte Note = Veranlagung. Ausbildung und Stangenarbeit heben die gezeigte Note um bis zu +0,5, erst bei sehr hoher Ausbildung +1. Anzeige z. B. „Trab 7,5 (Veranlagung 7)“. Vererbt wird nur die Veranlagung.
7. Körperhaltung je Ausbildungsstand (Bild 2: von lang/vorwärts-abwärts bis aufgerichtet/versammelt) nur im Training, nicht im Stall – kommt später mit den Animationen.

## 7. Disziplinen

Anzeige in Box - Steckbrief - **Ausbildung**: oben Grundausbildung (Ausbildungsskala mit Phasen), darunter Balken aller Disziplinen, jede zum Aufklappen mit Klasse/Stand und Details.

Disziplin-Wert = gewichtete Werte (Anteile in %) + Charakter-Zu-/Abschlag (max. ±10 %) + Ausbildungsstand in der Disziplin. Bei Turnieren zusätzlich × Tagesform (Wohlbefinden, Gesundheit, Energie). Gangwerk = Schnitt aus Schritt, Trab, Galopp. Die Gewichte sind Startwerte zum Feinjustieren.

1. **Englisch**
   1. Dressur: Gangwerk 20, Beweglichkeit 20, Konzentration 20, Tragkraft 15, Gehorsam 15, Lernfähigkeit 10 · sensibel/ruhig +, nervös −
   2. Springen: Kraft 25, Koordination 20, Reaktionsfähigkeit 15, Galoppnote 10, Vertrauen 10, Beschleunigung 5, Wendigkeit 5, Konzentration 5, Ausdauer 5 · Mut ++, nervös − · Höhe durch Stockmaß begrenzt
   3. Vielseitigkeit: Dressurteil 25, Springteil 35, Geländeteil 40 (Ausdauer, Zähigkeit, Koordination, Kraft) · Mut ++
2. **Western**
   1. Reining: Wendigkeit 25, Beschleunigung 20, Kraft 20 (Sliding Stop, Spins), Gehorsam 20, Reaktionsfähigkeit 15 · ruhig/gelassen +
   2. Pleasure: Gangwerk 30 (ruhig, taktrein), Gehorsam 25, Konzentration 20, Beweglichkeit 10, Vertrauen 15 · ruhig ++, temperamentvoll −
   3. Trail: Koordination 25, Konzentration 25, Vertrauen 20, Gehorsam 15, Wendigkeit 15 · gelassen ++, scheu −
3. **Rennsport**
   1. Galopprennen: Geschwindigkeit 35, Beschleunigung 25, Ausdauer 20, Kraft 10, Galoppnote 10 · temperamentvoll +, nervös −
   2. Trabrennen: wie Galopprennen, aber Trabnote statt Galoppnote (Traber als Rasse kommt später)
   3. Passrennen: Passnote 35, Geschwindigkeit 25, Beschleunigung 20, Ausdauer 10, Konzentration 10 (nur Pferde mit Pass)
4. **Gangpferde**
   1. Tölt: Töltnote 40, Takt (Ausbildungsskala) 20, Tragkraft 20, Konzentration 10, Gehorsam 10 · etwas Temperament (Vorwärtsdrang) +
5. **Distanz:** Ausdauer 35, Regeneration 25, Zähigkeit 20, Konstitution 10, Schritt-/Trabnote 10 · gelassen +, sehr temperamentvoll − · Tierarztkontrollen (Puls, Lahmheit): erschöpft oder nicht ganz gesund → Ausschluss
6. Eigener Ausbildungsstand je Disziplin: Dressur und Springen Klassen E–S, Western eigene Stufen, Rennen/Distanz/Vielseitigkeit/Tölt nach Leistung.
7. Marktwert (`marktwert()` in index.html) zählt künftig vor allem die beste Disziplin, damit ein Spezialist mehr wert ist als ein Allrounder.

## 8. Turniere

1. Start über Pferdeanhänger - Turnier (beide Anhänger; Kachel steht schon als „bald“ in `ANH_ZIEL`).
2. Turnierkalender: Freiluftsaison Frühling–Herbst, im Winter Hallenturniere; Rennen und Distanzritte eigene Termine.
3. Turnierstufen:
   1. Hofturnier (Breitensport nach WBO): zum Reinschnuppern, Namen machen, an die Atmosphäre gewöhnen; nur Schleifen, keine Geldpreise; auch Gelassenheitsprüfungen
   2. Regionales Turnier: Klasse E–L; Klasse E ohne Preisgeld, ab A mit Preisgeld
   3. Großes Turnier: bis Klasse S, höhere Preisgelder
   4. Championate: Landesmeisterschaft, Bundeschampionat (junge Pferde 4–6 J.), Deutsche Meisterschaft – nur mit Qualifikation
   5. International: hohe Preisgelder, erst für Pferde in hohen Klassen
4. Startrechte (nach FN, vereinfacht):
   1. Der **Spieler** hat eine Reiter-Leistungsklasse (LK 7 → LK 1), die mit Erfolgen steigt: LK 7 → E · LK 6 → E, A · LK 5 → A, L · LK 4 → A–M · LK 3 → A–S · LK 2/1 durch Erfolge in M/S.
      - Die LK gilt **je Disziplin** (wie bei der FN getrennt für Dressur und Springen), der Aufstieg passiert nur in der Disziplin, in der der Spieler Erfolge hat.
      - Höhere LK in einer Disziplin = der Spieler trainiert Pferde in dieser Disziplin selbst besser (schnellerer Trainingsfortschritt).
   2. **Pferde** haben keine Klasse; einzelne Ausschreibungen haben eigene Grenzen (z. B. Alter, bisherige Siege).
   3. Ein Pferd darf auf einem Turnier nur in zwei benachbarten Klassen starten.
   4. Aufbauprüfungen für junge Pferde (4–6 J.) sind für jede LK offen.
   5. Turnierstart ab 4 Jahren.
5. Nenngeld steigt mit der Klasse.
6. Ergebnis zunächst rechnerisch: Disziplin-Wert × Tagesform + kleine Zufallsstreuung; Turnierstress (Nervenstärke, Mut, Vorlieben) wirkt mit. Ausgabe als Wertnote bzw. Platzierung/Zeit.
7. Erfolge stehen in der Akte, steigern Marktwert und bei Hengsten die Decktaxe.
8. Turnier kostet viel Energie; Anhängerfahrt und Trubel stressen nervöse/scheue Pferde. Danach Erholung nach Vorlieben: leichtes Training, Weide, entspannter Ausritt, Boxenruhe oder Roundpen.
9. Später: selbst reiten/steuern mit Animationen (z. B. Gelände im Jump'n'Run-Stil: Pferd läuft, Klick zum Springen; auch Ausreiten daheim) oder bessere realistische 2D-Darstellung.

## 8a. Ankerpunkte für später (jetzt schon mitdenken, nicht ausbauen)

1. **Ausrüstung:** Jedes Pferd bekommt Ausrüstungs-Plätze (Zäumung/Trense und Reithalfter, Sattel, Gamaschen/Bandagen, Decke). Jeder Gegenstand kann später (a) Vorlieben/Abneigungen auslösen, (b) Training und Disziplin-Werte beeinflussen (z. B. Gamaschen schützen im Gelände, Westernsattel nur für Western), (c) zum Wohlbefinden beitragen. Training und Turnier sollen den Platz „Ausrüstung“ schon abfragen können, auch wenn er noch leer ist.
2. **Fütterung:** **Vorlieben je Futtersorte** (Dome, v171): Jede Futtersorte (Heu, Heulage, Gras, Hafer, Müsli, Pellets, Mineralfutter, Leckerlis …) wird ein eigenes Vorlieben-Ziel – manche Pferde mögen eher das eine, andere das andere. Bis dahin gibt es nur „Füttern“ allgemein. Energie, Wohlbefinden, Gesundheit und Training sollen einen Futter-Faktor abfragen können (vorerst neutral = 1). Später Futterplan aus Raufutter (Heu, Heulage, Gras), Kraftfutter (Hafer, Müsli, Pellets), Mineralfutter und Zusätzen; Wirkung u. a. auf Energie, Kraftaufbau, Temperament/Konzentration, Regeneration, Gesundheit, Hufrehe-Risiko. Gehört zum Hof-Ausbau (Bauer, Futterwiese).
3. **Reiterprofil des Spielers:** eigener Reiter „Reiter“ in Hofverwaltung mit Avatar, Name und LK je Disziplin (von Dome bestätigt).

## 9. Ausdrücklich später (nicht jetzt bauen)

1. Ausrüstung (Trense, Reithalfter, Sattel, Decken) – eigener Schritt.
2. Animationen statt Reaktionstexte, Körperhaltung im Training, selbst reiten.
3. Hof-Ausbau, Pensionsstall, mehrere Ställe, Paddockboxen, Gebäudestufen, Weide-/Futterwirtschaft, Einstreu, Krankheiten (siehe `werte/hof-ausbau-ideen.md`).
4. Weitere Rassen (z. B. Traber) – erst wenn Dome es sagt.
5. Fohlenschau – steht weiter auf „warten, bis Dome es sagt“.

## 10. Vorgeschlagene Etappen

1. **Werte-Grundlage:** Charakter um Sensibilität ergänzen, Wachheit → Neugier, körperliche und mentale Werte mit Obergrenzen je Rasse anlegen und vererben, `talent` → Lernfähigkeit, Gangwerk-Noten senken. Anzeige im Steckbrief. Alte Speicherstände auffüllen.
2. **Charakter → Wohlbefinden** inkl. Herde/Eingewöhnung auf der Weide.
2b. **Weide und Herde** (Abschnitt 2b): Winterheu, Wohlbefinden je Jahreszeit, allein auf der Weide, ungeplante Bedeckung, Hengste, Sozialverhalten, Kastrationszeitpunkt, Unverträglichkeit/Streit/Verletzung, Ankerpunkt für Krankheiten.
3. **Vorlieben und Reaktionen** (Texte) mit Knopf „Vorlieben“.
4. **Training daheim:** Orte Roundpen, Reitplatz, Gelände (Reithalle über Ausbau), Energie, kombinierte Einheiten, Trainingsbericht, Ausbildungsskala mit Phasen und Kraft-Grenzen, Gangwerk-Bonus, Training bremst den Altersabbau, Wohlbefinden (`wohlFaktor`) wirkt aufs Lerntempo.
5. **Disziplinen** mit Formeln, Anzeige in der Karte Ausbildung, neuer Marktwert.
6. **Turniere** mit Kalender, Stufen, Reiter-LK, Ergebnissen und Erfolgen in der Akte.
