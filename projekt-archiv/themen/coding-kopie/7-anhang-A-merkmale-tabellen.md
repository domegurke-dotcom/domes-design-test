> **An Coding:** Anhang A zum Auftrag „Karte Merkmale“ (Thema 6). Als `PLAN-MERKMALE-TABELLEN.md` im Repo speichern. Alle Zahlen sind Startwerte zum Feinjustieren; Dome liest die Rassentabelle noch gegen.

# Anhang A: Tabellen zur Karte „Merkmale“

## 1. Die zwölf Exterieur-Werte (0–100, 50 = Skalenmitte; das Zuchtziel der Rasse ist die Raute)
| Schlüssel | Zeile in der Karte | links (0) | rechts (100) | Stufenwörter (von links nach rechts, bezogen auf das Zuchtziel) |
|---|---|---|---|---|
| `rahmen` | Rahmen | gedrungen | gestreckt | sehr gedrungen · gedrungen · ausgewogen · gestreckt · sehr gestreckt |
| `halsL` | Hals: Länge | kurz | lang | sehr kurz · kurz · mittel · lang · sehr lang |
| `halsA` | Hals: Aufsatz | tief aufgesetzt | hoch aufgesetzt | sehr tief · tief · mittel · hoch · sehr hoch aufgesetzt |
| `schulter` | Schulter / Widerrist | steil | schräg | sehr steil · steil · mittel · schräg · sehr schräg |
| `ruecken` | Rücken | durchhängend | aufgewölbt | stark durchhängend · weich · fest · leicht aufgewölbt · stark aufgewölbt |
| `kruppe` | Kruppe | abfallend | waagerecht | stark abfallend · abfallend · mittel · fast waagerecht · waagerecht |
| `muskel` | Bemuskelung (Ist-Wert) | schwach | kräftig | sehr schwach · schwach · normal · kräftig · sehr kräftig |
| `fundament` | Röhrbein / Gelenke | fein | stark | sehr fein · fein · mittel · stark · sehr stark |
| `fessel` | Fesselung | steil | weich | sehr steil · steil · mittel · weich · sehr weich |
| `stV` | Stellung vorne | zeheneng | zehenweit | stark zeheneng · zeheneng · gerade · zehenweit · stark zehenweit |
| `stH` | Stellung hinten | fassbeinig | kuhhessig | stark fassbeinig · fassbeinig · gerade · kuhhessig · stark kuhhessig |
| `huf` | Huf (Ist-Wert) | steil (Bockhuf) | flach (Flachhuf) | sehr steil · steil · normal · flach · sehr flach |

Stufenwort aus dem Vorzeichen und der Größe von `(Wert − Ziel) / BAU_S`: bis −2 und darunter 1. Wort, −2 bis −0,7 2. Wort, ±0,7 3. Wort, +0,7 bis +2 4. Wort, darüber 5. Wort. Das Wort sagt, wo das Pferd liegt, die Stufe daneben („ideal“, „leichte Abweichung“, „deutlicher Fehler“, „starker Fehler“) sagt, wie weit vom Zuchtziel.

**Zeile „Typ“ und „Gesamteindruck“** sind Noten (kein Balken). **Zeile „Hals“** zeigt Länge und Aufsatz als zwei Balken untereinander.

## 2. Zuchtziel je Rassengruppe (Mitte in Punkten; Streuung `BAU_S = 15` für alle)
`stV` und `stH` sind bei allen Rassen 50 (gerade). Einzelne Abweichungen stehen unter der Tabelle.

| Gruppe (Rassen) | rahmen | halsL | halsA | schulter | ruecken | kruppe | muskel | fundament | fessel | huf |
|---|---|---|---|---|---|---|---|---|---|---|
| Edel (araber, shagya, angloaraber, vollblut, tekke, marwari) | 62 | 62 | 64 | 62 | 45 | 62 | 45 | 42 | 55 | 50 |
| Warmblut (hannoveraner, trakehner) | 55 | 60 | 58 | 65 | 55 | 55 | 55 | 55 | 55 | 50 |
| Barock (friese, andalusier, lipizzaner, barockpinto, knabstrupper) | 42 | 55 | 70 | 55 | 50 | 38 | 58 | 55 | 58 | 50 |
| Western (quarter, paint, appaloosa) | 42 | 42 | 38 | 58 | 48 | 45 | 72 | 55 | 50 | 50 |
| Kaltblut (shire, clydesdale, noriker) | 45 | 42 | 55 | 48 | 50 | 40 | 68 | 72 | 48 | 55 |
| Cob und kräftige Ponys (tinker, welshcob, fell, dales, haflinger, lewitzer, fjord) | 38 | 42 | 52 | 50 | 48 | 40 | 62 | 62 | 48 | 55 |
| Isländer (isi) | 42 | 50 | 58 | 55 | 50 | 42 | 60 | 62 | 48 | 55 |
| Kleinpony (shetty) | 38 | 38 | 50 | 45 | 48 | 40 | 60 | 60 | 45 | 55 |

Einzelne Abweichungen: Vollblut `halsA` 50, `halsL` 58, `fundament` 45 · Araber `ruecken` 38 (kurzer Rücken, in echt oft ein Wirbel weniger) · Friese `fundament` 58, `fessel` 60 · Andalusier/Lipizzaner `muskel` 60 · Quarter `kruppe` 42 · Tinker/Fell/Dales `fundament` 66 · Fjord `halsL` 38.
Mischlinge: Mitte als gewichteter Schnitt der Zuchtziele nach Rasseanteil. Im Adminmodus nur angezeigt; ein Pferd bekommt seine Werte dort über „Merkmale selbst wählen“ (Anhang B).

## 3. Disziplin-Gewichte (Summe 1 je Disziplin; Wirkung höchstens ±4 %)
| Disziplin (`DISZ`-Schlüssel) | Gewichte |
|---|---|
| `dressur` | halsL .15 · halsA .15 · schulter .20 · ruecken .15 · kruppe .15 · fessel .10 · muskel .10 |
| `springen` | kruppe .20 · schulter .15 · ruecken .15 · fundament .15 · muskel .15 · stV .10 · stH .10 |
| `vielseitigkeit` | ruecken .15 · fundament .20 · schulter .15 · kruppe .15 · muskel .15 · stV .10 · stH .10 |
| `galopprennen` | schulter .20 · kruppe .20 · muskel .20 · fundament .20 · rahmen .10 · fessel .10 |
| `trabrennen` | kruppe .20 · fundament .25 · stV .15 · stH .15 · schulter .15 · rahmen .10 |
| `passrennen` | rahmen .20 · kruppe .20 · fundament .20 · ruecken .15 · fessel .10 · stV .075 · stH .075 |
| `toelt` | halsL .15 · halsA .20 · schulter .20 · ruecken .20 · kruppe .15 · fessel .10 |
| `reining` | kruppe .25 · muskel .25 · ruecken .15 · stH .15 · fundament .10 · schulter .10 |
| `pleasure` | schulter .25 · ruecken .20 · halsA .15 · fessel .15 · stV .15 · stH .10 |
| `trail` | fundament .25 · stV .20 · stH .20 · huf .20 · fessel .15 |
| `distanz` | fundament .25 · huf .20 · stV .15 · stH .15 · fessel .15 · ruecken .10 |
Weitere Disziplinen in `DISZ`, die hier fehlen: Gewichte wie die ähnlichste Disziplin übernehmen.

## 4. Sätze „Stärken / Schwächen“ (Anfänger, und als Zeile im Gesamteindruck für alle)
Stärken = die zwei Merkmale mit dem kleinsten `d` (nur wenn `d` < 0,5), Schwächen = die zwei mit dem größten `d` (nur wenn deutlicher oder starker Fehler; „leichte Abweichung“ wird nicht genannt). Satz:
- Beides vorhanden: „Stärken: gute Schulter und gute Kruppe. Schwächen: zu steiler Rücken und zu kurzer Hals.“
- Keine Schwäche: „Stärken: … Keine auffälligen Schwächen.“
- Keine Stärke: „Keine besonderen Stärken. Schwächen: …“
- Weder noch: „Ein durchschnittliches Pferd ohne auffällige Stärken oder Schwächen.“

Wörter für **Stärken** (Merkmal → Wortgruppe): rahmen „guter Rahmen“, halsL „gut proportionierter Hals“, halsA „guter Halsaufsatz“, schulter „gute Schulter“, ruecken „guter Rücken“, kruppe „gute Kruppe“, muskel „gute Bemuskelung“, fundament „gutes Fundament“, fessel „gute Fesselung“, stV „gerade Stellung vorne“, stH „gerade Stellung hinten“, huf „gute Hufe“.
Wörter für **Schwächen**: „zu“ + Wort des Pols, in dessen Richtung das Pferd abweicht, z. B. „zu steile Schulter“, „zu kurzer Hals“, „zu tief aufgesetzter Hals“, „zu weiche Fesselung“, „zeheneng vorne“, „kuhhessig hinten“, „zu flache Hufe“, „durchhängender Rücken“, „zu schwache Bemuskelung“, „zu feines Fundament“, „abfallende Kruppe“, „zu gestreckter Rahmen“.

Rassemerkmale (Anfänger): „Passt gut zur Rasse.“ oder „Nicht typisch für die Rasse: <Zeilen mit ✗ oder untypisch>.“ Besonderheiten (Anfänger): „Auffälliger Fehler: bitte vom Tierarzt ansehen lassen.“ (nur bei bekannten Besonderheiten).

## 5. Rassemerkmale-Zeilen (Aufklappbereich Fortgeschritten und Experte)
| Zeile | Quelle im Code | ✓ | untypisch, aber erlaubt | ✗ Verstoß | schwerer Verstoß (nicht zuchtbuchfähig) |
|---|---|---|---|---|---|
| Größe im Rahmen | Stockmaß gegen `h` der Rasse | im Bereich | bis 3 cm außerhalb | mehr als 3 cm außerhalb | – |
| Farbe erlaubt | `R.farben` (sichtbare Farbe; Gene erst nach Gentest) | erlaubt | – | – | nicht zugelassen |
| Abzeichen | `WEISS_RASSE`, `fjordWeissFehler` | im Standard | etwas viel Weiß | zu viel Weiß | strenge Rassen (Friese, Fell, Fjord, Dales) mit großem Abzeichen oder Beinweiß |
| Kopfform | `KOPFFORM_RASSE` | typisch | andere gerade/leichte Form | Schafs-/Schweinskopf | – |
| Ohren | `OHR_RASSE` | typisch | abweichend | – | – |
| Behang | Rassenwert `feather` | typisch | – | fehlt bei Rassen, die ihn verlangen | – |
| Gangart | Tölt/Pass bei Islandpferden | Viergänger/Fünfgänger je Rasse | – | Tölt fehlt | – |
| Besonderheiten | Metallglanz (Tekkiner), Marwari-Ohren | vorhanden | – | fehlt | – |
| Exterieur insgesamt | Schnitt der zwölf `d` | Schnitt unter 1 | Schnitt 1–1,5 | Schnitt über 1,5 | – |

Wirkung: ✗ Typnote −0,5 und Marktwert −5 %; schwerer Verstoß: Marktwert −15 % (ersetzt die 5 %), Typnote −0,5 je Verstoß, höchstens −1,5 insgesamt. Mischlinge (unter 99 % Rassenanteil): „Mischling – keine Rassenprüfung“.

## 6. Besonderheiten
| Besonderheit | Häufigkeit | Sichtbar | Vererbung | Wirkung |
|---|---|---|---|---|
| Gebissfehler (Ober-/Unterbiss), gibt es schon (`biss`) | wie bisher | erst wenn `p.gebissFehler` bekannt | wie bisher | Zahnbehandlung 2× im Jahr, Marktwert −3 % |
| Hahnentritt (neu) | 0,3 % | sofort | 10 % mit einem betroffenen Elternteil, 30 % mit zwei | Bewegung −1, Marktwert −15 % |
| Kryptorchismus (neu, nur Hengste) | 1 % | ab 2 Jahren, bei Ankaufsuntersuchung oder Tierarzt | 15 % / 40 % | Zuchtausschluss, Marktwert −20 %; nach Kastration kein Abzug |
| Zwergwuchs (gibt es) | wie bisher | sofort | wie bisher | wie bisher |

## 7. Zuchtbuch-Klasse (Stuten ab 3 Jahren, Rasse mit Zuchtbuch, kein Mischling)
| Gesamtnote | Klasse | Marktwert |
|---|---|---|
| ab 8,0 | Hauptstutbuch | +5 % |
| ab 7,0 | Stutbuch I | +2 % |
| ab 6,0 | Stutbuch II | ±0 |
| darunter | Vorbuch | −3 % |
Hengste: „Körung kommt später“.
