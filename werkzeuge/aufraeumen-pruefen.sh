#!/bin/bash
# Aufräum-Prüfung (Dome 2.11.2026: „das Aufräumen sollten wir regelmäßig machen“). Nur LESEN, löscht nichts. Aufruf im Projektordner: bash werkzeuge/aufraeumen-pruefen.sh
cd "$(dirname "$0")/.." || exit 1
echo "== Größe des Verlaufs (.git):"; du -sh .git | cut -f1; git count-objects -vH | grep -E "size-pack|garbage"
echo "== Freier Platz auf C:"; df -h /c | tail -1 | awk '{print $4 " frei von " $2}'
echo "== Blender-Sicherungsdateien (.blend1), unnötig:"; ls blender/*.blend1 2>/dev/null | wc -l
echo "== Dateien im Repository über 50 MB (GitHub warnt ab 50, lehnt ab 100):"; git ls-files -z | xargs -0 -I{} sh -c 'printf "%s %s\n" "$(stat -c %s "{}" 2>/dev/null)" "{}"' | awk '$1>50000000 {printf "%.0f MB  %s\n",$1/1e6,$2}' | sort -rn
echo "== Summe .blend im Repository:"; git ls-files -z | grep -z "\.blend$" | xargs -0 -I{} stat -c %s "{}" | awk '{s+=$1} END {printf "%.2f GB\n", s/1e9}'
echo "== Lokale Ansichtsdaten (nicht im Repository, neu erzeugbar):"; du -sh blender/testseiten/boxenboden 2>/dev/null | cut -f1
echo "== Sicherungsordner (nach ein paar Tagen löschbar):"; ls -d ../domes-design-test-git-SICHERUNG-* 2>/dev/null
echo "== Branches auf GitHub:"; git branch -r | wc -l
echo "== Gelegentlich ansehen: tests/ -> Screenshots im Projektordner? (sollen nur im Scratchpad liegen)"; git ls-files | grep -iE "screenshot|\.(png|jpg)$" | grep -v -E "^(werte|zeichnungen|entwuerfe|pdfs)/" | head -5
