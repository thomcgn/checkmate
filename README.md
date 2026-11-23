# CHECKMATE ♚

**Understand the code. Master the craft.**

Checkmate ist eine eigenständige Desktop-Lernsoftware, mit der man Programmierkonzepte verstehen, selbst anwenden und dauerhaft verinnerlichen kann.

## Heute im Entwicklungsstand vorhanden

- **Sprachübergreifende Konzeptbibliothek:** Von Variablen, Listen und Maps bis Generics, Records, Streams, Ownership, Fehlerbehandlung und Nebenläufigkeit.
- **Zehn offline lesbare Sprachhandbücher:** Python, JavaScript, TypeScript, Java, C#, C++, PHP, Go, Rust und Kotlin – jeweils mit festgelegter Sprachversion, Erklärung, Beispielcode, Fallstricken, Best Practices und Übung.
- **Vergleich statt bloßer Syntaxübersetzung:** Beispielsweise Java `HashMap`, Python `dict`, Rust `HashMap` und JavaScript `Map` – mit ausdrücklichen Unterschieden bei Semantik und Laufzeitverhalten.
- **Suche und Lernpfad:** Konzeptfilter, Suchbegriffe, Voraussetzungen und Lernstufen.
- **Offline-Nachschlagen:** Die benötigten Erklärungen stehen in Checkmate selbst. Externe Dokumentationen sind nur redaktionelle Quellen, keine Voraussetzung zum Lernen.
- **Eigene Notizen und Lernstand:** Werden in der Desktop-Anwendung lokal gespeichert.
- **Repository Lab:** Öffentliche GitHub-Repositories gezielt prüfen, per ChatGPT-Login begrenzt analysieren und die didaktischen Ergebnisse als lokale Lernbücher wieder öffnen. Die Übertragung erfolgt ausschließlich nach sichtbarer Zustimmung.

Die Kapiteltexte sind eigenständig für Checkmate geschrieben und keine vollständigen Kopien fremder Sprachreferenzen. Das erste Release bildet einen wachsenden, **kuratierten Lehrbuchkern**, noch nicht jede Standardbibliothek und jeden Spezialfall jeder Sprache ab.

## Installation aus dem Quellcode

Voraussetzung: Node.js 22 oder höher und npm.

```bash
npm install
npm run desktop
```

`npm run desktop` baut die Electron-Anwendung und startet sie lokal. Die Bedienoberfläche und die gebündelten Lehrtexte benötigen keinen laufenden Webserver und keine Cloud-KI.

## Repository Lab mit ChatGPT

Das Repository Lab öffnest du in der Seitenleiste. Die Integration benötigt die **offizielle Codex-CLI** (`codex app-server`) und ein ChatGPT-Konto, über das du dich per Browser anmeldest. Die KI läuft in der Cloud, **keine lokalen KI-Modelle** werden benutzt. Der Zugriff auf Quellcode ist auf öffentliche GitHub-Repositories begrenzt und bleibt lesend; vor dem Versenden siehst du die Auswahl und bestätigst ausdrücklich die Übertragung.

Die erste Version analysiert pro Anfrage eine begrenzte Stichprobe statt alle Commit-Historien. Der Umfang wird sichtbar ausgewiesen. Lernbücher werden lokal im App-Datenordner gespeichert.

Mehr Details zu Anmeldung, Datenschutz und Grenzen: [Repository Lab](docs/REPOSITORY_LAB.md).

## Entwicklung und Qualität

```bash
npm run check
```

Dieser Aufruf prüft TypeScript, die Inhaltstests und den Renderer-/Electron-Build. Die CI führt diese Prüfungen auf **Linux, Windows und macOS** aus.

Technologie: **Electron · React · TypeScript**, streng typisiert. Die Handbuchinhalte sind versionierte Projektdateien, persönliche Notizen und Lernstände liegen derzeit im lokalen App-Speicher. Eine zusätzliche Datenbank ist für die gebündelte Wissensbasis nicht nötig.

## Weitere Entwicklung

Das Repository Lab speichert seine ersten KI-Lernbücher lokal; eine erweiterte Bibliothek mit Kapitelversionen, eine robuste SQLite-Datenbank, ein interaktiver Code-Editor und eine langfristig direkt integrierte Sign-in-with-ChatGPT-Verbindung sind weitere Ausbaustufen. Diese sind noch nicht vollständig implementiert.

Mehr zum redaktionellen Anspruch: [Sprachversionen und Abdeckung](docs/LANGUAGE_COVERAGE.md) · [Qualität und Quellen](docs/CONTENT_REVIEW.md).
