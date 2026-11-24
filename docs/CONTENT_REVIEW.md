# Editorial Quality Gate

## Maßstab

Die Anwendung soll eigenständiges Programmieren fördern. Auswendig gelernte Syntax genügt nicht. Jedes Konzept muss ein fachliches Teilproblem, eine zugängliche Erklärung, Beispielcode, Grenzfälle und eine Aufgabe enthalten.

## Versionen

Jede Sprache besitzt ein explizites `version`-Feld. Beispiele dürfen nur APIs der festgelegten Sprachlinie verwenden. Unterschiede zwischen Sprachversionen sollen später als eigene versionsgebundene Artikel gepflegt werden.

## Quervergleiche

Der Katalog erlaubt ähnliche Implementierungen, ohne semantische Identität zu behaupten. Für jeden Beispielvergleich müssen Unterschiede genannt werden. Typische Prüfpunkte: Wert- oder Referenzgleichheit, Fehlwerte und Exceptions, Mutierbarkeit, Concurrency, Besitz, Auswertungsstrategie und Iterationsreihenfolge.

## Tests

`validateConceptGraph` prüft Voraussetzungsgraf, doppelte Sprachvarianten und Quellenfelder. `validateConceptCatalog` prüft zusätzlich den Katalog, den die Anwendung tatsächlich anzeigt: vollständige didaktische Felder, gültige Vergleichsarten, https-Quellen, eindeutige Sprachen über Basis- und Handbuchvarianten hinweg sowie bekannte Querverweise. Jedes Lehrbuchkapitel besitzt mindestens eine https-Quelle, zwei erläuterte Begriffe und gültige Querverweise; `validateTextbook` prüft diese Felder. `validateLanguageDocumentation` prüft zehn Sprachprofile, Versionsdaten, Seitenabdeckung, Quellen-URLs und Fallstricke. CI führt TypeScript, Tests und Build auf Linux, Windows und macOS aus.

## Quellen

Originaldokumentationen werden als Quellen angegeben, aber nicht komplett in der Anwendung reproduziert. Jede didaktische Formulierung ist eigens geschrieben. Verlinkte Quellen werden zur redaktionellen Kontrolle verwendet, nicht als Lernpflicht.
