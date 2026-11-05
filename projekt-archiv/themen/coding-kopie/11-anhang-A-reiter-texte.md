> **An Coding:** Anhang A zum Auftrag „Reiter-Erfahrung“ (Thema 9). Als `PLAN-REITER-TEXTE.md` im Repo speichern. Zahlen sind Startwerte zum Feinjustieren. Die Hinweise und das Tutorial werden gerade vom Claude-Team überarbeitet: Einträge so in das aktuelle System einbauen; Texte und Auslöser bleiben.

# Anhang A: Tabellen, Texte, Hinweise zur Reiter-Erfahrung

## 1. Tabelle `REITER_DISZ` (Gruppen)
| Gruppe | Disziplinen (`DISZ`-Schlüssel) | LK | Übungen, die das Können trainieren (`UEBUNG`, Schlüssel prüfen) |
|---|---|---|---|
| `dressur` | dressur | ja | longieren, doppellonge, dressur |
| `springen` | springen | ja | stangen, springen |
| `vielseitigkeit` | vielseitigkeit | ja | gelaendesprung, kondition |
| `western` | reining, pleasure, trail | ja | western, trailarbeit |
| `rennen` | galopprennen, trabrennen, passrennen | nein | Galopp- und Konditionsarbeit im Gelände |
| `distanz` | distanz | nein | ausritt, kondition |
| `gangpferde` | toelt | nein | toeltarbeit, passtraining |
Fehlende Übungen nicht erfinden: was in `UEBUNG` keiner Gruppe passt, zählt nicht fürs Können (nur Reitunterricht und Turniere). Neue Disziplinen: eine Zeile ergänzen (siehe Auftrag Punkt 17).

## 2. Prüfanforderung je Klasse (Können nötig, damit der Reiter nichts verliert)
| Klasse | Anforderung |
|---|---|
| Wettbewerb, Hofturnier, Aufbauprüfung, Gelassenheit | 10 |
| E (Western: Einsteiger) | 10 |
| A (Rookie) | 30 |
| L (Novice) | 50 |
| M (Intermediate) | 70 |
| S (Open) | 85 |
| Anglo-Araber-Rennen Kl. C / B | 30 / 50 |
| Galopprennen und Araberrennen | 50 (Verkaufsrennen 30) |
| Trabrennen | 50 |
| Passrennen 250 m | 50 |
| Tölt Einsteiger / D / C / B / A | 10 / 30 / 50 / 70 / 85 |
| Distanzritt bis 20 km / bis 40 km / bis 80 km / darüber | 10 / 30 / 50 / 70 |
Der **Stand des Pferdes** in einer Disziplin ist die Anforderung der Klasse, die es dort erreicht hat (E 10 … S 85, nicht ausgebildet 0).

## 3. Hinweisblasen (6, Ton wie überall: Du-Form, höchstens zwei Sätze, Alltagsvergleich, „Mehr dazu“ → Einsteiger-Wissen, Eintrag „Reiter-Können“)
| Nr | Auslöser | Stufe | Text |
|---|---|---|---|
| R1 | Hofverwaltung - Reiter zum ersten Mal geöffnet | alle | „Hier siehst du, wie gut du reitest. Das Können wächst, wenn du trainierst, Turniere reitest oder Reitunterricht nimmst.“ |
| R2 | erstes eigenes Reiten im Training | Anfänger, Fortgeschritten | „Dein Können bestimmt, wie gut dein Training wirkt. Ist ein Pferd weiter als du, bremst es dich aus.“ |
| R3 | Reitunterricht zum ersten Mal sichtbar | alle | „Reitunterricht kostet Geld, bringt dir aber am Anfang am meisten. Ab Können 60 lernst du mehr auf Turnieren und mit schwierigeren Pferden.“ |
| R4 | Nennen mit Reiterwahl zum ersten Mal | Fortgeschritten, Experte | „Du kannst auch einen anderen Reiter nennen, wenn dein Pferd besser ist als du. Dann zählt dessen Können, und der Erfolg gehört dem Pferd.“ |
| R5 | LK-Aufstieg wartet auf Können, erstes Mal | Fortgeschritten, Experte | „Für die nächste LK reichen Siege allein nicht, dein Können muss auch mitkommen. Training und Reitunterricht helfen dir dabei.“ |
| R6 | Pferd ist erstmals eine Klasse weiter als du (je Pferd und Disziplin einmal, siehe Auftrag 8) | alle | „{Name} ist weiter als du. Dein Training bremst {ihn/sie}: Reitunterricht oder ein anderer Reiter beim Nennen helfen.“ |
Dazu ein Hinweis, wenn man zum ersten Mal ein Rennen selbst reiten kann (Fortgeschritten, Experte): „Du kannst Rennen auch selbst reiten, wenn dein Können reicht. Das spart das Reitgeld, aber ein schwacher Reiter holt weniger aus dem Pferd.“
Nebentipps-Limit wie bei allen Nebentipps (eine Blase je Ansicht, drei je Tag, nie im Dialog).

## 4. Brief „{Name} ist jetzt weiter als du“ (Auftrag 8c, einmal je Pferd und Disziplin)
- **Absender:** der Ausbildungsstall (Name des Stalls), oder dein Bereiter, wenn er das Pferd trainiert hat; Anrede nach den Regeln des Spiels (`{du|Sie}`).
- **Betreff:** „{Name} ist jetzt weiter als {du|Sie}“
- **Text:** „{Name} hat bei uns die Klasse <Klasse> in <Disziplin> erreicht. Das ist eine Klasse weiter, als {du reitest|Sie reiten}. Das hat Folgen: Trainiert {du|Sie} {ihn/sie} selbst, lernt {er/sie} langsamer, weil {du|Sie} {ihn/sie} bremsen, und {er/sie} verliert etwas Vertrauen. Auf Turnieren zählt {dein|Ihr} Können: Je größer der Abstand, desto weniger holt {ihr|Sie} aus {ihm/ihr} heraus. Was hilft: Reitunterricht nehmen, beim Nennen einen Bereiter oder Profi als Reiter wählen oder {ihn/sie} an jemanden verkaufen, der {ihn/sie} fordern kann.“
- Beim Anmelden im Ausbildungsstall (Auftrag 11): „Du reitest erst <Klasse>. Kommt {Name} mit <Ziel> zurück, bremst dein Training, und du darfst {ihn/sie} erst mit LK <x> in <Ziel> starten.“

## 5. Tutorial
- **Anfänger-Tutorial, Kapitel 5 (Training):** zwei Sätze und eine Blase: „Wie gut ein Training wirkt, hängt auch von dir ab. Ist ein Pferd weiter als du, bremst es dich; Reitunterricht hilft am Anfang am meisten.“ Das Testpferd im Kapitel ist **weiter als du** (Stand L, dein Können 10), damit die Blase R6 gleich gezeigt wird; im Testhof ist Reitunterricht 60 € vom Testgeld und gibt +0,8 (doppelt: 1,6).
- **Fortgeschrittenen-Tutorial, neues Kapitel „Reiter-Können, Unterricht, Reiterwahl“** (nur zum Nachholen, 2 Tage, Testhof): Testpferd **Bella** (Stand A, Dressur) und **Ferro** (Stand M, Dressur). Ziel: „Bring Ferro ins Turnier, ohne dass dein Können ihn ausbremst.“ Tag 1: Hofverwaltung - Reiter öffnen, Können-Balken lesen, mit Bella trainieren (gutes Training), mit Ferro trainieren (bremst), eine Reitstunde nehmen. Tag 2: Ferro im Dressur-Turnier nennen und beim Nennen **Bereiter** statt „du“ wählen, das Ergebnis per Brief lesen. Abschluss: „Ein Pferd, das weiter ist als du, muss nicht weg: Lass es von jemandem reiten, der besser ist, und lerne an einem Pferd, das dich fordert.“
- **Experten-Tutorial:** kein neues Kapitel; ein Satz bei Rennen: „Du kannst Rennen selbst reiten, wenn dein Können reicht.“

## 6. Enzyklopädie (öffentlich), Eintrag „Reiter-Können“ (Einsteiger-Wissen)
„**Reiter-Können.** Jeder Reiter kann mehr oder weniger gut reiten, je Disziplin getrennt. Dein Können (0 bis 100) wächst durch Training, Turniere und Reitunterricht. Es wächst schnell am Anfang und langsamer, je besser du schon bist.

**Pferd und Reiter.** Ein Pferd lernt am besten bei einem Reiter, der etwas weiter ist als es selbst. Ist das Pferd weiter als der Reiter, bremst es das Training und verliert Vertrauen. Auf Turnieren holt ein Reiter, dessen Können zur Klasse passt, das Beste aus dem Pferd; fehlt Können, bleibt das Ergebnis dahinter.

**Leistungsklasse (LK).** Die LK sagt, in welchen Klassen du starten darfst (Dressur, Springen, Vielseitigkeit, Western). Sie steigt mit Erfolgen, aber nur, wenn dein Können mitgekommen ist.

**Bereiter und Profis.** Du kannst ein Pferd beim Nennen von deinem Bereiter oder einem Profi reiten lassen. Dann zählt deren Können. Der Erfolg gehört dem Pferd.“

## 7. Berechnungen zum Nachschlagen (bzn, nur Admin): Absatz „Reiter-Können (Thema 9)“
Inhalt: `REITER_DISZ` mit Gruppen, Prüfanforderung je Klasse, Wachstum (Training, Turnier mit Klassenfaktor, Unterricht, Abnahme `1 − Können/120`), Alt-Umrechnung LK → Können, Abstandsfaktor (Punkte ×1,2 / 1,1 / 1,0 / 0,8 / 0,5 / 0,25, Vertrauen −0,1 / −0,3), Turnier-`reiterF`-Formel, LK-Schwellen, Reiterwahl und Kosten, Platzhalter-Können der Ausbildungsställe, Startrecht Rennen. Zahlen aus den Konstanten lesen (`${…}`), nicht von Hand einsetzen.

## 8. Stufen-Zeilen (`STUFE_NEU`)
| Stufe | Neu freigeschaltet |
|---|---|
| Fortgeschritten | „Reiter-Können als Balken, Reiter wählen beim Nennen, Rennen selbst reiten“ |
| Experte | „genaue Zuwächse des Reiter-Könnens und alle Rechenwerte“ |

## 9. Nachtrag (20.10.2026, nach Rückfrage von Coding)
1. **Kondition zählt in mehreren Gruppen.** Eine Übung darf in `REITER_DISZ` bei mehreren Gruppen stehen (Liste statt einer Gruppe); der Zuwachs gilt voll in jeder. Betroffen: `kondition` bei `vielseitigkeit`, `rennen` und `distanz`.
2. **Galopptraining und Rennbahn.** Mit dem Gebäude „Rennbahn“ wächst das Können `rennen` voll durch Galopptraining. Ohne Rennbahn zählen Galopp- und Konditionsarbeit im Gelände (Ausritt) zur Hälfte (Faktor 0,5). Das Startrecht „Rennen selbst reiten“ bei Können 30 bleibt; Turniere und Reitunterricht zählen wie überall voll.
3. Beide Punkte sind Vorschläge und gelten als Standard, bis Dome etwas anderes sagt.
