# Die Pizzeria auf Rust – Band 1 und Band 2

Die beiden Java-Einsteigerbücher (`src/content/pizzeria-book.ts`,
`src/content/pizzeria-lessons.ts`, `src/content/pizzeria-operations.ts`) bleiben unverändert.
Die Rust-Fassung liegt parallel in:

- `src/content/pizzeria-rust-book.ts` – Band 1, 37 Kapitel, Kapitel 1–4 direkt dort
- `src/content/pizzeria-rust-lessons.ts` – Band 1, Kapitel 5–37
- `src/content/pizzeria-rust-operations.ts` – Band 2, 25 Kapitel

Kapitel-IDs, Reihenfolge, Stufen, Lernzeiten und Konzeptverknüpfungen sind identisch.
Damit lassen sich die Fassungen Kapitel für Kapitel vergleichen. Die Lernstände liegen in
eigenen `localStorage`-Schlüsseln (`checkmate:pizzeria-rust-book:v1` und
`checkmate:pizzeria-rust-operations:v1`); die Java-Bände behalten ihre alten Schlüssel.

## Fachliche Übersetzung

| Java | Rust | Hinweis |
| --- | --- | --- |
| `record Zutat(String name, int gramm)` | `#[derive(Debug, Clone, PartialEq, Eq)] struct Zutat { name: String, gramm: u32 }` | Derives machen Ausgabe, Kopieren und Wertgleichheit sichtbar statt automatisch. |
| `Optional<T>` | `Option<T>` (`Some` / `None`) | `HashMap::get` liefert `Option<&V>`; `OptionalExtension::optional()` übersetzt „keine Zeile". |
| Exception / `throw` | `Result<T, E>` mit `Ok` / `Err`, `?` zur Weitergabe | Ein Fehler ist ein Rückgabewert, kein Stack-Unwinding. |
| `Box<T>`-Beispiel (Generics) | `Kiste<T>` | Rust besitzt bereits `std::boxed::Box<T>`; der Beispielname weicht bewusst aus. |
| `T extends Belag` | `struct Kiste<T: Belag>` | Trait Bound statt Klassengrenze. |
| `class Azubi extends Chef` | `trait Backen` + `impl` für beide, Delegation an `Chef` | Rust hat keine Klassenvererbung; gemeinsames Verhalten kommt aus Traits. |
| `for (String z : zutaten)` | `for zutat in zutaten` | Array-Iteration liefert hier kopierbare `&str`. |
| Stream / Lambda | Iterator-Kette / Closure | `iter()`, `copied()`, `sum()` und `|preis| ...`. |
| JUnit `assertEquals` | `#[test]` + `assert_eq!`, `cargo test` | Integrationstest mit `tower::ServiceExt::oneshot`. |

## Stack-Entscheidung für Band 2

Statt Spring Boot wird ein realistischer, kleiner Rust-Stack verwendet. Alle APIs in den
Codebeispielen stammen aus offiziell dokumentierten Crates; die Quellen-Felder verweisen
auf https-Dokumentation.

| Aufgabe | Java-Vorlage | Rust-Wahl | Warum |
| --- | --- | --- | --- |
| HTTP / Routing | Spring MVC | **Axum** (`Router`, `State`, `Json`, Handler) | Gängiger, typsicherer Web-Stack im Rust-Ökosystem. |
| Async-Laufzeit | Tomcat-Threads | **Tokio** (`#[tokio::main]`, `time::sleep`) | Axum baut auf Tower/Tokio auf; keine blockierenden Pausen. |
| JSON | Jackson | **serde / serde_json** | Der Standard für Serialisierung; Derives statt Annotationen. |
| Datenbank | H2 | **rusqlite + SQLite-Datei** | Eingebettet wie H2, keine Serverinstallation; für Unterricht und Prototypen ideal. |
| Schema-Änderungen | Flyway | **rusqlite_migration** (`M::up`, `to_latest`) | Migrationen als simple, versionierte SQL-Schritte. |
| Datenzugriff | `@Repository`, `JpaRepository` | eigene Funktionen mit `FromRow` + `OptionalExtension` | SQL bleibt an einer Stelle, ohne ORM-Magie. |
| Passwörter | BCrypt | **argon2** (`SaltString`, `PasswordHasher`, `PasswordVerifier`) | Moderne, empfohlene Hash-Funktion. |
| Session / Rollen | Spring Session, `@PreAuthorize` | **tower-cookies / cookie** + `enum Rolle`, `matches!` | `HttpOnly`/`SameSite` sind sichtbar; Rechteprüfung sitzt in der Funktion. |
| Logging | Logback / SLF4J | **tracing / tracing-subscriber** | Strukturierte Felder (`info!(pizza = %name, ...)`), `RUST_LOG` zur Steuerung. |
| Build / Tests | Maven | **Cargo**, `cargo test`, `cargo clippy`, GitHub Actions | Ein Werkzeug für Build, Lints und Tests. |
| Auslieferung | `Dockerfile` mit JRE | mehrstufiges `Dockerfile` (`rust:1` → `debian:bookworm-slim`) | Kompiliertes Binary, kleine Laufzeit-Kiste. |
| Konfiguration | `application.properties`, Profile | `Config` aus Umgebungsvariablen, `APP_ENV=dev|prod`, Cargo-Features für Compile-Zeit | Keine zweite Datei pro Umgebung nötig. |
| Frontend | `fetch` | `fetch` (unverändert) | Der Browser spricht mit dem Axum-Server, nicht mit Java. |

## Bewusste Vereinfachungen / offene Punkte

- Die Mini-Codeblöcke sind Lehrausschnitte, keine kompilierbaren Gesamtprojekte. Sie zeigen
  echte API-Namen, lassen aber `use`-Zeilen und Typdefinitionen aus vorherigen Kapiteln weg.
- SQLite ist das H2-Analog. Für einen echten Produktionsbetrieb mit mehreren Schreibern wäre
  `sqlx` + PostgreSQL sinnvoll; das würde den Lernaufwand in diesem Band deutlich erhöhen.
- Sessions werden im Beispiel gezeigt, aber nicht vollständig gegen Session-Fixation gehärtet;
  dafür eine Signatur mit `cookie::Key` und Rotation nach Login nötig.
- Der Health-Check prüft im Grundbeispiel nur die Erreichbarkeit, nicht die Datenbankverbindung.
- Die Rust-Bücher sind nicht in `published-books.ts` eingetragen: Sie sind ein eigenes
  Academy-Lernbuch und keine Erweiterung der veröffentlichten Sprachlehrbücher.

## Prüfung

- `npm run check` – Typprüfung, alle `node:test`-Tests (inklusive der beiden neuen
  Pizzeria-Rust-Tests) und Vite-Build. Der vorhandene Rust-Dokumentimport bleibt skip-bar.
- `npm run test:ui` – Playwright, inklusive `ui-tests/academy-rust.spec.ts` für
  Volume-Wechsel, vollständige Rust-Lektionen und getrennte Lernstände.
