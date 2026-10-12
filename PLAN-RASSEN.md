# Plan: Veredler-Rassen (nach dem Hof-Ausbau H1–H8) – ✅ umgesetzt in v316 (alle 7 Rassen, Abnahme durch Dome offen)

Aus OFFENE-FRAGEN.md hierher verschoben (12.10.2026) – Domes Antworten stehen unten, alles beantwortet. Erst starten, wenn der Hof-Ausbau fertig ist.

## 📌 Notiz von Dome (7.10.2026) – Veredler-Rassen: erst NACH dem Hof-Ausbau (H1–H8) starten (Dome, 7.10.2026)
Wenn alle Fütterungsfragen beantwortet sind, Dome Bescheid geben: **Alle fehlenden Rassen ergänzen, die für die Veredelung bestehender Rassen im Spiel wichtig sind** – jeweils komplett mit Fell- und Farbmustern, Erbkrankheiten, Eigenheiten/Veranlagungen, Hufqualität, Körperbau (Gewicht), Futtertyp usw. (Grundsatz aus CLAUDE.md).
Kandidaten (vor dem Start mit Dome abstimmen, Aufwand je Rasse nennen):
- Tinker: Clydesdale, Fell-Pony, Dales-Pony, Welsh Cob (bisher nur Shire im Spiel)
- Hannoveraner: Trakehner (und andere Warmblüter, die im Zuchtprogramm erlaubt sind)
- weitere Veredler bestehender Rassen bei der Planung prüfen (z. B. Shagya-Araber, Anglo-Araber)

### Vorplanung Veredler-Rassen (Claude, 6.10.2026 abends – noch nichts umsetzen)
Jede neue Rasse kommt komplett: `RASSEN` (Größe, Farben, Profil, Charakter), Farbgene `RASSE_GENE`, Erbkrankheiten `ERBKRANK`, Veranlagungen, Hufqualität `HUF_RASSE`, Körperbau/Gewicht `BAU`, Futtertyp (`LEICHTFUTTRIG`/`SCHWERFUTTRIG`), Gangwerk, Disziplin-Eignung, Marktpreise, `VEREDELUNG`-Eintrag, Enzyklopädie. Kopf: Spielkopf, bis Dome einen zeichnet.

| Rasse | veredelt | Besonderheiten | Aufwand |
|---|---|---|---|
| **Trakehner** | Hannoveraner (im Zuchtprogramm erlaubt) | 160–170 cm, alle Grundfarben + Schimmel, edel, Springen/Dressur; Erbkrankheit: keine rassetypische (WFFS-Träger möglich) | ca. 4–5 % |
| **Clydesdale** | Tinker | 163–183 cm, Braun/Rappe/Fuchs mit viel Weiß (Sabino), Roan; Erbkrankheiten CPL (Chronisch progressives Lymphödem, Fesselbehang), PSSM1 selten; Hufe groß, Futter leichtfuttrig | ca. 6–7 % (Sabino-Muster neu) |
| **Welsh Cob (Sektion D)** | Tinker | ab 137 cm, alle Farben inkl. Palomino/Creme, Falbe; robust, leichtfuttrig, Hufrehe-gefährdet; Trab mit viel Aktion | ca. 5 % |
| **Fell-Pony** | Tinker | 132–142 cm, meist Rappe, Braun, Grau; sehr robust, leichtfuttrig, Erbkrankheit Fell-Pony-Syndrom (FIS, tödlich bei Fohlen, rezessiv) | ca. 5–6 % |
| **Dales-Pony** | Tinker | 140–148 cm, meist Rappe/Braun, weiße Abzeichen erlaubt; Erbkrankheit FIS wie Fell (Herkunft verwandt) | ca. 4 % (teilt FIS mit Fell) |
| *Anglo-Araber* (optional) | Hannoveraner (erlaubt) | Kreuzung Vollblut × Araber, beide schon im Spiel → nur Rasse-Eintrag + Zuchtbuchregel | ca. 2–3 % |
| *Shagya-Araber* (optional) | Haflinger/Hannoveraner (teils erlaubt) | 150–160 cm, viele Schimmel, Araber-Erbkrankheiten | ca. 4 % |

**Reihenfolge-Vorschlag:** 1. Trakehner (meist genutzter Veredler, einfach), 2. Welsh Cob, 3. Clydesdale, 4. Fell + Dales zusammen (gemeinsame Erbkrankheit FIS), optional Anglo-Araber. Gesamt Kern (5 Rassen) ca. 24–27 %.
**Fragen:** (a) Welche Rassen genau? (b) Sollen neue Rassen auch auf dem Pferdemarkt/bei Gestüten erscheinen oder nur über die Deckstation? *Empfehlung: beides, wie die anderen Rassen.* (c) Kopf: zeichnest du die neuen Köpfe, oder erst Spielkopf? *Empfehlung: erst Spielkopf, Köpfe nach und nach.*

**✅ Domes Antworten Rassen (6.10.2026):** (a) **alle genannten** (Trakehner, Welsh Cob, Clydesdale, Fell-Pony, Dales-Pony, Anglo-Araber, Shagya-Araber) – genauso umfangreich wie die bestehenden: Zucht, Eigenschaften, Genetik, Reinrassigkeit/Zuchtbuch, Erbkrankheiten, Anfälligkeiten/Veranlagungen, Hufqualität, Gewicht, Futtertyp usw. (b) wie die bestehenden Rassen behandeln (Markt, Gestüte, Deckstation …). (c) erst Spielkopf, Domes Köpfe nach und nach. Start erst nach H8.

## 📝 Danach (Domes Wünsche vom 12.10.2026 nachts – erst NACH den Veredler-Rassen umsetzen)
1. **Pension – tragende Stute in der Anfrage nennen:** Ist das Pensionspferd eine tragende Stute, soll die Einstellerin das schon im Anfrage-Brief sagen (und im „Ansehen“ der Anfrage sichtbar machen).
2. **Pension – Bereiter bei „Bewegen“:** Box – ppf – vsg zeigt bei gebuchtem „Bewegen“ „🏇 Bereiter 0/2“, aber ohne angestellten Bereiter ist unklar, wie man einen bekommt. Lösung: Hinweis/Knopf, wo man einen Bereiter einstellt oder extern bucht (`BEREITER_EXTERN`), und der Spieler selbst soll mit passendem Reiter-Level (LK) als Bereiter einspringen können.
3. **Futter mit auf die Koppel:** Wurde die Krippe in der Box gefüllt und das Pferd dann auf die Weide oder den Sandpaddock gestellt, soll das Kraftfutter mit in den Futtereimer auf der Koppel wandern (statt in der Box liegen zu bleiben, vgl. `rausAusBox`/`zurueckInBox`, `[data-keimer]`).
