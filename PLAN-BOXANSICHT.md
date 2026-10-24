# Plan: Boxansicht ohne Scrollen (nur geplant, noch nichts gebaut – Dome, 24.10.2026)

**Ziel (Dome):** Das Pferd soll sich im **Vollbild** versorgen lassen, **ohne nach unten zu scrollen** – **intuitiv und übersichtlich**. Neu: Symbole wie im Hofplan-Kreismenü; Orte, Ausrüstung usw. öffnen ein **Fenster mit Rücksprung** in die Box. Dome: „erstmal nur reden und planen, nichts bauen“. Start erst nach ihrem ausdrücklichen Ja.

Entwürfe (Bilder, nur Vorschläge, kein Spielcode): `entwuerfe-boxansicht/` – **blatt9-gesamtentwurf.png** (9.1–9.6, beschriftet), **blatt10-wo-steckt-was.png** (10.1–10.5), blatt10-5-quer-plaketten.png (10.5 neu), blatt8-andere-ideen.png (Ideen, die nicht gewählt wurden, 8.2 und 8.4 teilweise).

## Beschlossen (Dome, im Gespräch)
- **Symbole rund, klein, halbtransparent**; **Quer/PC:** je 3 am linken und rechten Rand (Versorgung, Putzen, Füttern | Orte, Ausrüstung, Tierarzt/Steckbrief), nichts auf dem Pferd, nichts auf Schild „Box 1“ oder den Pfeilen. **Hochkant:** Symbolreihe **unter** dem Boxbild (Stufe 2/3 haben klickbare Dinge im Bild: Heunetz, Pinnwand, Kamera …), nichts darauf.
- **Statusanzeige auf einen Blick:** Gesundheit, Wohlbefinden und „Versorgung heute x von y“ (bei Pensionspferden stattdessen **Besitzerwünsche x von y**). Quer/PC als **Ringe in der Kopfleiste**, Hochkant als **drei Balken unter dem Bild** (gut so, Dome 5.1).
- **Kranke Pferde:** **kein roter Bildschirm** (Dome). Stattdessen roter Gesundheitsring/-balken, **Denkblase** („Mir geht’s nicht gut – ich huste“), rote Punkte an Versorgung/Tierarzt, **Plaketten** (Befund, Boxenruhe, Quarantäne, Empfehlung vom Mitarbeiter, Besitzer fragen) – quer links und rechts vom Schild „Box 1“, hochkant unter den Balken. Bleibt wie heute: nur **bemerkte** Dinge werden gezeigt, nichts Verstecktes.
- **Eingangsanzeige „Heute bei <Pferd>“** (Klemmbrett-Idee 8.2): nur **Anzeige**, Antippen öffnet die vorhandene Funktion – **kein Abhaken** (Dome).
- **Versorgung als Fenster mit 3 Seiten:** **Heute** (Fütterung heute, Empfehlung des Mitarbeiters übernehmen/ablehnen, Ampel-Kacheln), **Gesundheit** (Befund mit Selbst einschätzen/Tierarzt/Besitzer fragen/Mitarbeiter-Vorschlag, Plan des Tierarztes, Behandlung, Boxenruhe, Quarantäne, Ansteckung & Labor), **Besitzer** (nur Pensionspferde: Wünsche mit ✔/✗, Besitzer informieren). Ampel-Kacheln wie Blatt 3 (Dome: „sehr gut“).
- **Putzkiste:** Symbol antippen → **Werkzeuge im Kreis** um das Pferd (Bürste, Kamm, Hufkratzer, Schere, Streicheln, ✕ in der Mitte) → danach wie heute am Pferd wischen.
- **Orte quer/PC:** die **kleine Hofkarte bleibt** (Dome), als Fenster so groß wie die Boxansicht, **zugeschnitten auf die Gebäude** (mehr Bauland, weniger Gras), **Doppeltipp = Zoom**, Minikarte unten links, Weide/Gelände als Pfeile am Rand; Rücksprung in die Box. **Hochkant: Kacheln** (die Karte ist dort zu klein).
- Die Sprechblasen „Füttern“ im Bild entfallen (Eimer und Heu bleiben antippbar); „Füttern“ ist ein Symbol.
- **Seiten wie ein Buch (8.4)** nur für Hochkant, später als Idee (nicht im ersten Entwurf).

## Offene Punkte / Risiken
1. **Kleine Handys** (z. B. 360 × 640, Querformat ~ 667 px): Plaketten müssen zu Symbol + Zahl schrumpfen, Heute-Liste einklappbar – Regel nötig.
2. **Besitzerwünsche zusammenrechnen** („4 von 5 erfüllt“): neue Zusammenfassung aus `pensionAufgaben`, Weidegang-Quote (`weideFrei`), Futterplan, gebuchten Leistungen, Mähnenlänge – Zahlen/Regeln mit Dome festlegen.
3. **Stufen-Sperren** (`frei()`/`freiStufe`): welche Symbole sieht ein Anfänger? Vorschlag: Anfänger Versorgung, Putzen, Orte, Steckbrief (+ Tierarzt bei Befund); Ausrüstung ab Fortgeschritten wie bisher prüfen.
4. **Tutorial, Hinweisblasen, Ziel-Selektoren und Tests** zeigen heute auf Reiter (`[data-m="pflege"]`, `[data-r="gesundheit"|"ausruestung"|"platz"]`) – alles muss auf die neuen Symbole/Fenster umgestellt werden (großer Aufwand, Tutorial-Spieler nur mit dem großen Test).
5. Quer/PC: Prüfen, ob die Randsymbole in Boxstufe 2/3 klickbare Bereiche (Pinnwand, Kamera, Leckstein) verdecken – im Entwurf liegen sie außerhalb der Mitte (links/rechts neben dem Pferd).
6. Karte zoomen: Doppeltipp (Touch) und Mausrad/Doppelklick (PC) – `zoomInit` existiert schon (Steckbrief/Rassenansicht), muss für die Plan-Karte angepasst werden.
7. Kreismenü wie im Hofplan (`planRadial`) als Vorbild für die Putzkiste; Wischen am Pferd (`wischStart`) bleibt unverändert.
8. Bestehende Funktionen, die erhalten bleiben müssen (Dome-Frage): Fütterung heute, Behandlungsplan, Befunde, Behandlung/Boxenruhe, Mitarbeiter-Empfehlungen, Besitzer informieren, Quarantäne/Labor, Besitzerwünsche – im Entwurf 10.1–10.5 zugeordnet.

## Etappen (Vorschlag, Opus, jeweils testen, hochladen, Test-Anleitung, auf Rückmeldung warten)
- **B1 Gerüst:** Symbole (quer Ränder / hochkant Reihe), Statusringe/-balken, Plaketten, Denkblase bei Befund; alte Reiter bleiben erreichbar (Umschalter), „Füttern“-Blasen weg.
- **B2 Fenster:** Versorgung (3 Seiten), Orte (Karte zugeschnitten + Zoom bzw. Kacheln), Ausrüstung, Steckbrief als Fenster mit Rücksprung; alte Reiter-Ansicht entfernen.
- **B3 Putzkiste-Kreis, Heute-Liste, Besitzerwünsche** (Regeln mit Dome).
- **B4 Tutorial, Hinweise, Enzyklopädie, Tests** und großer Test (nur mit Domes Okay und Bilder-Variante).

## Zu klären vor dem Start
Reihenfolge/Etappe, Stufen-Sperren (Punkt 3), Regeln für Besitzerwünsche (Punkt 2), Verhalten auf kleinen Handys (Punkt 1).
