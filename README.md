# CHECKMATE ♚

**Understand the code. Master the craft.**

Checkmate ist eine eigenständige Desktop-Lernsoftware, mit der man Programmierkonzepte verstehen, selbst anwenden und dauerhaft verinnerlichen kann.

## Heute im Entwicklungsstand vorhanden

- **Sprachübergreifende Konzeptbibliothek:** Von Variablen, Listen und Maps bis Generics, Records, Streams, Ownership, Fehlerbehandlung und Nebenläufigkeit.
- **Offline-Sprachenhandbücher:** Bereits importierte Originalreferenzen für Python, JavaScript, TypeScript, Java, C#, C++, PHP, Go, Rust und Kotlin erscheinen in der Handbuchbibliothek. Dort sind sie ohne Browserwechsel lesbar und durchsuchbar.
- **Vergleich statt bloßer Syntaxübersetzung:** Beispielsweise Java `HashMap`, Python `dict`, Rust `HashMap` und JavaScript `Map` – mit ausdrücklichen Unterschieden bei Semantik und Laufzeitverhalten.
- **Suche und Lernpfad:** Konzeptfilter, Suchbegriffe, Voraussetzungen und Lernstufen.
- **Offline-Nachschlagen:** Die benötigten Erklärungen stehen in Checkmate selbst. Externe Dokumentationen sind nur redaktionelle Quellen, keine Voraussetzung zum Lernen.
- **Eigene Notizen und Lernstand:** Werden in der Desktop-Anwendung lokal gespeichert.
- **Repository Lab:** Öffentliche GitHub-Repositories gezielt prüfen, per ChatGPT-Login begrenzt analysieren und die didaktischen Ergebnisse als lokale Lernbücher wieder öffnen. Die Übertragung erfolgt ausschließlich nach sichtbarer Zustimmung.

**Konzeptlektionen** und **importierte Originaldokumentationen** sind getrennte Inhaltsarten. Die Originalreferenzen werden vollständig pro definiertem Quellpaket offline übernommen; zusätzliche Sprach- und Standardbibliothekspakete lassen sich im Einrichtungsbereich installieren. Die inhaltliche Vollständigkeit je Sprache muss paketübergreifend geprüft werden.

## Installation aus dem Quellcode

Voraussetzung: **Node.js 22 LTS** und npm. Unter Arch Linux gegebenenfalls über `fnm` auf Node 22 wechseln. Für die ChatGPT-Anmeldung wird ein sicherer Betriebssystem-Schlüsselbund benötigt.

```bash
npm install
npm run desktop
```

`npm run desktop` baut die Electron-Anwendung und startet sie lokal. Die Bedienoberfläche und die gebündelten Lehrtexte benötigen keinen laufenden Webserver und keine Cloud-KI.

## Offline-Dokumentationsbibliothek

Unter **Dokumentationen einrichten** verwaltest du ausschließlich Downloads und Aktualisierungen. Erfolgreich installierte Dokumentationspakete erscheinen automatisch unter **Sprachenhandbücher**. Die Handbuchansicht gruppiert sie nach Sprache und bietet Kapitel-Navigation sowie Suche im lokal gespeicherten Volltext. Der Import speichert Quellstände und prüft Dateien mit SHA-256. Zum Installieren ist Git für Quellarchive und einmalig eine Netzwerkverbindung nötig; die Handbücher sind danach offline nutzbar.

## Repository Lab mit ChatGPT

Das Repository Lab öffnest du in der Seitenleiste. Die Integration verwendet **Sign in with ChatGPT** direkt. Du benötigst keine Codex-CLI und keinen API-Schlüssel. Im Systembrowser meldest du dich an und erlaubst bei entsprechender Berechtigung ausdrücklich die ChatGPT-Plannutzung. Die KI läuft in der Cloud, **keine lokalen KI-Modelle** werden benutzt. Der Zugriff auf Quellcode ist auf öffentliche GitHub-Repositories begrenzt und bleibt lesend; vor dem Versenden siehst du die Auswahl und bestätigst ausdrücklich die Übertragung.

Die erste Version analysiert pro Anfrage eine begrenzte Stichprobe statt alle Commit-Historien. Der Umfang wird sichtbar ausgewiesen. Die Teaching Engine erstellt zuerst Lernziele und einen Lehrplan, danach mehrere Kapitel mit Aufgaben und Musterlösungen. Quellpfade werden gegen die übermittelten Dateien geprüft; eine inhaltliche Verifikation jeder einzelnen Behauptung ist noch nicht implementiert. Lernbücher werden lokal als einzelne, atomar gespeicherte Dateien im App-Datenordner abgelegt. Bestehende Bücher aus `repo-books.json` werden beim ersten Zugriff automatisch übernommen; die alte Datei bleibt als Backup erhalten.

Mehr Details zu Anmeldung, Datenschutz und Grenzen: [Repository Lab](docs/REPOSITORY_LAB.md).

## Lehrbücher aus vollständigen Offline-Dokumentationen

Unter **Sprachenhandbücher** lässt sich ein installiertes **gesamtes Referenzpaket** in eine deutschsprachige didaktische Lehrbuchreihe aufbereiten, nicht nur ein einzeln geöffnetes Kapitel. Checkmate liest den vollständigen lokal installierten Textbestand, bildet daraus begrenzte Quelleneinheiten, erstellt für jede Einheit ein Lehrbuchkapitel mit Erklärungen, Beispielen, Übungen und Lösungen und bündelt diese in nummerierte Bände in der lokalen Lernbuchbibliothek. Die Originaldokumentation wird dabei nicht verändert. Zeilenbelege werden gegen die tatsächlich gelesenen Ausschnitte geprüft. Der globale, deterministische Lehrplan sortiert den gesamten Quellenindex didaktisch nach Grundlagen, Sprachkonzepten, Anwendungen und weiterführendem Wissen, ohne Quelldokumente auszulassen. Kapitel müssen ausführliche Erklärungen, Beispiele, typische Fehler, Übungen, Lösungen, individuelle Lernziele, ein Glossar mit Begriffserklärungen, Verständnisfragen samt Antworten und Originalbelege enthalten; oberflächliche Zusammenfassungen werden zurückgewiesen. Die neuen Bausteine werden als strukturierte, validierte Daten gespeichert und bleiben bei älteren Büchern optional.

**Lizenzvoraussetzung:** Die KI-Verarbeitung ist nur für bekannte, in den offiziellen Paketdefinitionen hinterlegte freie Lizenzfamilien freigegeben. Pakete mit eingeschränkter Nutzung oder unklaren, seiten- bzw. dateibezogenen Ausnahmen werden vorsorglich blockiert. Bücher tragen Quell- und Lizenzhinweise; die automatische Prüfung ersetzt keine rechtliche Bewertung individueller Inhalte.

**Vor jeder Generierung** zeigt Checkmate die Gesamtzahl der Originaldokumente und zu verarbeitenden Einheiten an. Erst nach ausdrücklicher Freigabe werden diese Quelltexte über den bereits vorhandenen ChatGPT-Login übertragen. Für sehr große Handbücher können zahlreiche separate Modellaufrufe und erhebliche Laufzeiten entstehen; es gibt keine pauschale Kosten- oder Laufzeitzusage. Fertig geprüfte Einheiten bleiben als lokale Checkpoints erhalten, falls eine Generierung unterbrochen wird, und werden beim nächsten Start desselben Quellstands und Modells wiederverwendet. Gespeicherte Bände sind offline lesbar. Der Lernfortschritt wird pro Buch-ID und Kapitel lokal und atomar gespeichert; du kannst jedes Kapitel im bestehenden Reader als „offen“, „in Bearbeitung“ oder „verstanden“ markieren. Die Fortschrittsdaten werden nicht an ChatGPT übermittelt. Verändert sich der installierte Quellstand, muss die Generierung neu überprüft werden.

**Grenze:** Ein vollständig *eingelesener* Quellenbestand bedeutet nicht, dass jede Originalaussage in ein einziges Kompendium ohne Abstraktion übernommen wird. Die erzeugten Lehrbuchkapitel sind didaktische Darstellungen mit überprüften Textzitaten; ihre Interpretation wird noch nicht automatisch semantisch verifiziert.

## Entwicklung und Qualität

```bash
npm run check
```

Dieser Aufruf prüft TypeScript, die Inhaltstests und den Renderer-/Electron-Build. Die CI führt diese Prüfungen auf **Linux, Windows und macOS** aus.

Technologie: **Electron · React · TypeScript**, streng typisiert. Die Handbuchinhalte sind versionierte Projektdateien, persönliche Notizen und Lernstände liegen derzeit im lokalen App-Speicher. Eine zusätzliche Datenbank ist für die gebündelte Wissensbasis nicht nötig.

## Weitere Entwicklung

Das Repository Lab speichert seine ersten KI-Lernbücher lokal; eine erweiterte Bibliothek mit Kapitelversionen, eine robuste SQLite-Datenbank, ein interaktiver Code-Editor und weitergehende KI-gestützte Lernpfade sind weitere Ausbaustufen. Diese sind noch nicht vollständig implementiert.

Mehr zum redaktionellen Anspruch: [Sprachversionen und Abdeckung](docs/LANGUAGE_COVERAGE.md) · [Qualität und Quellen](docs/CONTENT_REVIEW.md).
