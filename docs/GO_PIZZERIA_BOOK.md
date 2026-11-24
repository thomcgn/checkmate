# Die Pizzeria auf Go – redaktionelle und technische Entscheidungen

Die beiden Java-Einsteigerbücher (`pizzeria-book.ts`, `pizzeria-lessons.ts`,
`pizzeria-operations.ts`) bleiben unverändert. Die Go-Ausgabe liegt parallel in
`pizzeria-go-book.ts`, `pizzeria-go-lessons.ts` und `pizzeria-go-operations.ts`.
Didaktik, Kapitelzahl (37 + 25), Stufen (11 + 6), Reihenfolge, Lernziele und alle
Felder (Alltagsszene, WENN/DANN/SONST-Regel, Pseudocode, Erklärung, Mini-Code,
Ausgabe, Aufgabe, typischer Fehler, Auflösung, Wortschatz, Quelle) sind gleich.
Nur Sprache und Technik wechseln. Stufe 9 heißt in der Go-Ausgabe
„Verdrahten von Hand" statt „Spring-Praxis" (Stufen-ID `wiring` statt `spring`);
die Position im Fahrplan ist identisch.

## Übersetzung der Konzepte (Band 1)

| Java-Vorlage | Go-Entsprechung | Begründung |
| --- | --- | --- |
| `record Zutat(String name, int gramm)` | `type Zutat struct { Name string; Gramm int }` | Go hat keine Records; ein Struct ist die einfache Datenkarte. Exportierte Felder beginnen groß. |
| Unveränderlicher Teig | unexportierte Felder + `func Standard() Teig` | Go kennt keine `final`-Felder. Kapselung über Paketgrenzen plus eine Erzeugfunktion ist die idiomatische, ehrliche Variante. |
| `a.equals(b)` bei Records | `a == b` bei vergleichbaren Structs | Go vergleicht Struct-Werte inhaltlich. Bei Slices/Maps geht das nicht – darauf weist das Buch hin. |
| `Box<T>`, `Box<T extends Belag>` | `type Box[T any]`, `type Box[T Belag]` | Go-Typparameter seit 1.18; Constraints sind kleine Interfaces. |
| `implements Belag` | Methoden einfach definieren | Go-Interfaces werden implizit erfüllt, ohne Schlüsselwort. |
| `class Azubi extends Chef` | `type Azubi struct{ Chef }` | Go hat keine Klassenvererbung; Einbetten übernimmt Methoden. |
| `Optional<Salami>`, `orElse` | `menge, ok := regal["Salami"]` und Zero-Value | Das Zwei-Werte-Muster macht „fehlt" explizit, ohne zusätzlichen Typ. |
| `throw new IllegalArgumentException` | `func bestellen(...) error` mit `fmt.Errorf`, `nil` = kein Fehler | Fehler sind normale Rückgabewerte und werden vom Aufrufer geprüft. |
| Streams/Lambdas | `range`-Schleife, `func(preis int) int` | Eine kurze Schleife ist in Go lesbarer als eine nachgebaute Stream-Kette. |
| `System.out.println` | `fmt.Println` | Standardbibliothek, keine Fremdabhängigkeit. |
| `Scanner` | `fmt.Scan(&wunsch)` | Die Adresse wird übergeben, weil Go Call-by-Value hat. |

## Übersetzung der Betriebskonzepte (Band 2)

Gewählte Variante: **Go-Standardbibliothek zuerst, eine bewusst kleine Anzahl
bewährter Fremdbibliotheken nur dort, wo die Stdlib nichts anbietet.**

| Spring/Java | Go-Variante im Buch |
| --- | --- |
| `@RestController`, `@GetMapping`, `@PostMapping` | `net/http`, `http.ServeMux`, `HandleFunc` mit Methoden-Patterns (Go 1.22+) |
| Jackson/JSON-Bindung | `encoding/json` mit Struct-Tags |
| Spring Data JPA, H2, `@Entity`, `@Id` | `database/sql`, SQL mit `?`-Platzhaltern, Struct + `Row.Scan`, Primary Key in SQL |
| Flyway-Migrationen | nummerierte SQL-Dateien, Versionen in `schema_migration`; als fertiges Werkzeug `golang-migrate` genannt |
| BCrypt-PasswordEncoder | `golang.org/x/crypto/bcrypt` (die einzige fachlich notwendige externe Dependency) |
| `@PreAuthorize` | Middleware `func(next http.Handler) http.Handler`, Rollen im `context.Context` |
| HTTP-Session, `Set-Cookie` | `http.SetCookie`, Session-Map auf dem Server; `HttpOnly` und `MaxAge: -1` beim Logout |
| `@ExceptionHandler` | eigener `error`-Typ mit `Error() string`, zentrales JSON-Fehlerformat |
| Bean Validation | kurze Prüfung im Handler, `http.StatusBadRequest` |
| `@Async`/Retry | `time.Sleep` in einer dreimaligen Schleife, `context.Context` zum Abbrechen |
| Logback/SLF4J | `log/slog` (seit Go 1.21) |
| Actuator `/actuator/health` | selbst geschriebener `GET /health`-Handler |
| JUnit, MockMvc | `testing`, Tabellentests, `net/http/httptest` |
| Maven, `mvn test` | `go mod init`, `go run .`, `go test ./...` |
| GitHub Actions mit Maven | GitHub Actions mit `actions/setup-go@v5` und `go test ./...` |
| `eclipse-temurin` + JAR | mehrstufiges Dockerfile: `golang:1.22` baut statisch (`CGO_ENABLED=0`), `scratch` enthält nur die Binary |
| Spring Profiles | `APP_ENV` und `DB_DSN` via `os.Getenv` |
| `application.properties` mit `${DB_PASSWORD}` | `os.Getenv("DB_PASSWORD")` mit bewusstem Abbruch per `log.Fatal` |
| Thymeleaf/Frontend | unverändert HTML + `fetch`; die API liefert JSON |

Der SQLite-Treiber `modernc.org/sqlite` ist reines Go und passt damit zum
statischen Build; `database/sql` selbst registriert keinen Treiber, das Buch
sagt das ausdrücklich. Wer einen CGO-Treiber nutzt, muss das `scratch`-Image
durch ein schlankes Debian-Image ersetzen – das ist bewusst als offener Punkt
markiert, statt eine erfundene API zu zeigen.

## Quellen

Alle `sourceUrl`-Werte beginnen mit `https://`. Verwendet werden u. a.:

- https://go.dev/tour/ und https://go.dev/doc/tutorial/
- https://go.dev/blog/intro-generics und https://go.dev/doc/effective_go
- https://pkg.go.dev/fmt, https://pkg.go.dev/net/http, https://pkg.go.dev/encoding/json
- https://pkg.go.dev/database/sql, https://pkg.go.dev/modernc.org/sqlite
- https://pkg.go.dev/log/slog, https://pkg.go.dev/net/http/httptest, https://pkg.go.dev/testing
- https://pkg.go.dev/golang.org/x/crypto/bcrypt
- https://github.com/golang-migrate/migrate
- https://docs.github.com/en/actions, https://docs.docker.com/get-started/
- https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API, https://www.json.org/json-de.html

## Lernstand

Die Go-Bände haben eigene localStorage-Schlüssel:
`checkmate:pizzeria-go-book:v1` und `checkmate:pizzeria-go-operations:v1`.
Ein Wechsel zwischen Java- und Go-Band verändert daher keinen fremden
Lernstand.
