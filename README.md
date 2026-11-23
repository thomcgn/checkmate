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

Die erste Version analysiert pro Anfrage eine begrenzte Stichprobe statt alle Commit-Historien. Der Umfang wird sichtbar ausgewiesen. Die Teaching Engine erstellt zuerst Lernziele und einen Lehrplan, danach mehrere Kapitel mit Aufgaben und Musterlösungen. Quellpfade werden gegen die übermittelten Dateien geprüft; eine inhaltliche Verifikation jeder einzelnen Behauptung ist noch nicht implementiert. Lernbücher werden lokal im App-Datenordner gespeichert.

Mehr Details zu Anmeldung, Datenschutz und Grenzen: [Repository Lab](docs/REPOSITORY_LAB.md).

## Lehrbücher aus Offline-Dokumentationen

In **Sprachenhandbücher** lässt sich aus dem jeweils geöffneten Referenzkapitel ein deutsches Lehrbuch erstellen. Vor dem Übermitteln von bis zu 12.000 Zeichen an ChatGPT wird eine ausdrückliche Bestätigung abgefragt. Das Original bleibt unverändert; das generierte Lehrbuch erscheint im Repository Lab und ist anschließend offline lesbar. Für Generierung und spätere Neugenerierung ist ein verbundenes ChatGPT-Konto mit Freigabe erforderlich. Umfangreiche Originalhandbücher werden hier noch nicht vollständig als Lehrbuch neu strukturiert.

## Entwicklung und Qualität

```bash
npm run check
```

Dieser Aufruf prüft TypeScript, die Inhaltstests und den Renderer-/Electron-Build. Die CI führt diese Prüfungen auf **Linux, Windows und macOS** aus.

Technologie: **Electron · React · TypeScript**, streng typisiert. Die Handbuchinhalte sind versionierte Projektdateien, persönliche Notizen und Lernstände liegen derzeit im lokalen App-Speicher. Eine zusätzliche Datenbank ist für die gebündelte Wissensbasis nicht nötig.

## Weitere Entwicklung

Das Repository Lab speichert seine ersten KI-Lernbücher lokal; eine erweiterte Bibliothek mit Kapitelversionen, eine robuste SQLite-Datenbank, ein interaktiver Code-Editor und weitergehende KI-gestützte Lernpfade sind weitere Ausbaustufen. Diese sind noch nicht vollständig implementiert.

Mehr zum redaktionellen Anspruch: [Sprachversionen und Abdeckung](docs/LANGUAGE_COVERAGE.md) · [Qualität und Quellen](docs/CONTENT_REVIEW.md).
