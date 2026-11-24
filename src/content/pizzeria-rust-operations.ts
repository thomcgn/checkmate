import type {BeginnerBook,BeginnerChapter,BeginnerStage,BeginnerWord} from './pizzeria-rust-book.ts';

/**
 * Band 2 in der Rust-Fassung: aus dem Übungsprogramm wird eine Anwendung, die man anderen geben kann.
 *
 * Stack-Entscheidung (pragmatisch, real und ohne erfundene APIs):
 * - Axum + Tokio für HTTP und Async-Laufzeit (statt Spring Boot / Tomcat)
 * - serde + serde_json für JSON (statt Jackson)
 * - rusqlite mit SQLite-Datei als H2-Analog (eingebettet, keine Serverinstallation)
 * - rusqlite_migration für geplante Schema-Änderungen (statt Flyway)
 * - argon2 + password-auth für Passwort-Hashes (statt BCrypt)
 * - tower-cookies + cookie für signierte Session-Cookies (statt Spring Session)
 * - tracing + tracing-subscriber für Logs (statt Logback)
 * - cargo test / tower oneshot / GitHub Actions / multi-stage Dockerfile für Prüfung und Auslieferung
 *
 * Die Kapitel, Stufen und didaktischen Felder entsprechen exakt der Java-Fassung.
 * Firefox/Chrome-Seiten und Rust-APIs sind über https-Quellen belegt.
 */
const stage=(id:string,title:string,goal:string):BeginnerStage=>({id,title,goal});
const word=(term:string,definition:string):BeginnerWord=>({term,definition});
const chapter=(id:string,stageId:string,title:string,minutes:number,problem:string,natural:string,pseudo:string,
 objectives:readonly string[],conceptIds:readonly string[],explain:readonly string[],code:string,output:string,
 tryIt:string,misconception:string,solution:string,wordbank:readonly BeginnerWord[],sourceUrl:string):BeginnerChapter=>
 ({id,stage:stageId,title,minutes,problem,rule:{natural,pseudo},objectives,conceptIds,explain,code,output,tryIt,
  misconception,solution,wordbank,sourceUrl});

export const PIZZERIA_RUST_OPERATIONS_BOOK:BeginnerBook={
 title:'Die Pizzeria geht in Betrieb – mit Rust',
 subtitle:'Band 2: Datenbank, Anmeldung, Fehler, Tests und Auslieferung mit Axum, SQLite und Cargo',
 audience:'Für alle, die Band 1 gelesen haben und ihren Laden jetzt wirklich betreiben wollen.',
 scenario:'Deine Pizzeria läuft auf deinem Rechner. Jetzt soll sie auch nach dem Neustart funktionieren, Gäste erkennen und Fehler verständlich melden.',
 stages:[
  stage('persist','Stufe 1 · Der Laden bleibt offen','Daten überleben den Neustart – von der Datei bis zur Datenbank.'),
  stage('auth','Stufe 2 · Wer darf was?','Anmeldung, Passwörter, Rollen und ein sicheres Armband.'),
  stage('robust','Stufe 3 · Wenn etwas schiefgeht','Fehler, Prüfung, Wiederholung und ein Tagebuch für den Laden.'),
  stage('testing','Stufe 4 · Automatisch prüfen','Tests, die jeden Morgen laufen – auch ohne dich.'),
  stage('delivery','Stufe 5 · Ausliefern','Die Pizzeria in einer Kiste, mit Geheimnissen außerhalb des Codes.'),
  stage('frontend','Stufe 6 · Das Gesicht','Ein kleines Fenster für Gäste und der erste echte Gast.')
 ],
 chapters:[
  chapter('after-restart','persist','Nach dem Neustart ist das Regal leer',10,
   'Du machst den Rechner aus und wieder an. Die Pizzen sind weg. Im Speicher war alles nur vorübergehend.',
   'WENN Daten auch morgen noch da sein sollen, DANN schreibe sie auf die Festplatte. SONST sind sie nach dem Neustart weg.',
   'SPEICHERE bestand → Datei',
   ['Du verstehst den Unterschied zwischen Speicher und Festplatte.','Du kannst einen Wert mit std::fs in eine Datei schreiben.'],
   ['errors','ownership'],[
    'Band 1 hat alles im Arbeitsspeicher gehalten. Das ist wie ein Zettel, den du nach Ladenschluss wegwirfst. Am nächsten Morgen weißt du nichts mehr.',
    'Rust kann Text mit `std::fs::write` in eine Datei schreiben. Das `?` am Ende bedeutet: Wenn etwas schiefgeht, gib den Fehler nach oben statt ihn zu verstecken.',
    'Für echte Anwendungen reicht eine Textdatei bald nicht mehr. Aber sie zeigt das Grundprinzip: Zustand muss irgendwo dauerhaft liegen.'
   ],`use std::fs;
fs::write("bestand.txt", "Salami=3")?;
let text = fs::read_to_string("bestand.txt")?;
println!("{text}");`,'Datei bestand.txt mit Salami=3',
   'Schreibe eine zweite Zeile für Käse in dieselbe Datei. Was steht dann drin?',
   'Ein Programm merkt sich Variablen nur, solange es läuft. Die Festplatte bleibt auch nach dem Ausschalten erhalten.',
   'Die Datei enthält zwei Zeilen: Salami=3 und Käse=5 – genau das, was du hingeschrieben hast.',
   [word('Persistenz','Daten speichern, sodass sie auch nach dem Neustart vorhanden sind.'),word('Datei','Ein gespeicherter Zettel auf der Festplatte.')],
   'https://doc.rust-lang.org/std/fs/'),

  chapter('json-file','persist','Ein Zettel, den der Computer lesen kann',10,
   'Deine Datei hat "Salami=3" drin. Ein anderes Programm kann das nicht gut lesen. Du brauchst ein gemeinsames Format.',
   'WENN Programme Daten austauschen, DANN benutzen sie ein gemeinsames Format wie JSON.',
   '{"zutat":"Salami","menge":3}',
   ['Du kennst JSON als lesbares Datenformat.','Du verstehst, warum Strukturen besser sind als freier Text.'],
   ['contracts','records'],[
    'JSON sieht aus wie ein kleiner Zettel mit Beschriftung: `"zutat": "Salami"` und `"menge": 3`. Der Name steht immer neben dem Wert.',
    'Mit `serde` sagst du deiner Struct: „Du kannst in JSON übersetzt werden." `#[derive(Serialize, Deserialize)]` ergänzt die nötigen Fähigkeiten – du baust den Text nicht selbst zusammen.',
    'WENN ein anderes Programm deine Daten lesen soll, DANN gib ihnen feste Namen. SONST rät es, was "3" bedeutet.'
   ],`#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
struct Bestand { zutat: String, menge: i32 }
let json = serde_json::to_string(&Bestand { zutat: "Salami".into(), menge: 3 })?;
println!("{json}");`,'{"zutat":"Salami","menge":3}',
   'Ändere die Menge auf 4. Wie sieht das JSON aus?',
   'JSON ist kein Rust-Code. Es ist nur Text – den dein Programm lesen und schreiben kann.',
   '{"zutat":"Salami","menge":4}. Nur der Wert hinter menge hat sich geändert.',
   [word('JSON','Ein Textformat mit benannten Feldern für den Datenaustausch.'),word('serde','Die Rust-Bibliothek, die Daten zwischen Structs und Formaten wie JSON übersetzt.')],
   'https://docs.rs/serde/latest/serde/'),

  chapter('database','persist','Ein Regal, das nicht vergisst',11,
   'Deine Datei wird größer und du suchst eine einzelne Zutat ewig. Du brauchst ein Regal mit schneller Suche.',
   'WENN du viele Daten schnell finden willst, DANN benutze eine Datenbank.',
   'SELECT menge FROM zutat WHERE name = "Salami"',
   ['Du verstehst eine Datenbank als durchsuchbares Regal.','Du kennst eine einfache SQL-Abfrage.'],
   ['key-value'],[
    'Eine Datenbank ist wie ein sehr ordentliches Regal mit einem Register. Du fragst nicht „Zeig mir alle Fächer", sondern „Gib mir Salami".',
    'Diese Frage heißt SQL. `SELECT` bedeutet „zeige mir", `WHERE` bedeutet „nur wo …". Das `?1` ist ein Platzhalter für deinen Wert – so kann er nicht zu SQL-Code werden.',
    'Wir nehmen SQLite mit `rusqlite`: Eine Datei, die im Programm mitläuft. So eine Datenbank läuft direkt in deinem Programm – du installierst keinen Datenbankserver.'
   ],`let conn = Connection::open("pizzeria.db")?;
conn.execute("CREATE TABLE IF NOT EXISTS zutat (name TEXT PRIMARY KEY, menge INTEGER NOT NULL)", [])?;
let menge: i32 = conn.query_row("SELECT menge FROM zutat WHERE name = ?1", ["Salami"], |row| row.get(0))?;
println!("{menge}");`,'Gibt 3 zurück',
   'Schreibe eine Abfrage für Käse. Was änderst du?',
   'SQL ist keine Rust-Methode. Du schreibst eine Frage an die Datenbank, nicht eine Anweisung an dein Programm.',
   'Du ersetzt "Salami" durch "Käse". Alles andere bleibt gleich.',
   [word('Datenbank','Ein dauerhaftes Regal, in dem du Daten schnell wiederfindest.'),word('SQL','Die Sprache, in der man Datenbanken fragt.')],
   'https://docs.rs/rusqlite/latest/rusqlite/'),

  chapter('jpa-entity','persist','Eine Karte für die Datenbank',11,
   'Du willst in Rust mit Zutaten arbeiten, nicht mit SQL-Zeilen. Es wäre schön, wenn eine Struct die Zeilen selbst annimmt.',
   'WENN du Datenbankzeilen als Struct lesen willst, DANN leite FromRow ab.',
   '#[derive(FromRow)] struct Zutat { name, menge }',
   ['Du verstehst eine Entität als Datenkarte mit Ausweis.','Du erkennst, dass der Primärschlüssel der Schlüssel ist.'],
   ['records','key-value'],[
    'Eine Datenkarte entspricht genau einem Datenbankfach. In Rust schreibst du eine ganz normale Struct und ergänzt `#[derive(FromRow)]` aus `rusqlite`.',
    'In der Tabelle ist `name` der `PRIMARY KEY`, also der Ausweis. Zwei Salami-Karten darf es nicht geben. Es gibt keine versteckte Magie: Das Trait siehst du direkt an der Struct.',
    'Du schreibst weiterhin Rust. `FromRow` übersetzt die Spalte `menge` in dein Feld `menge` – wie ein Übersetzer zwischen zwei Sprachen.'
   ],`use rusqlite::FromRow;
#[derive(Debug, Clone, PartialEq, Eq, FromRow)]
struct Zutat { name: String, menge: i32 }
let zutaten = stmt.query_map([], Zutat::from_row)?.collect::<Result<Vec<_>, _>>()?;`,'Eine Tabelle zutat mit name und menge',
   'Welches Feld ist der Ausweis deiner Karte?',
   'Ohne PRIMARY KEY weiß die Datenbank nicht, wie sie zwei Karten unterscheiden soll. Ein derive ersetzt kein Datenbankdesign.',
   'Das Feld `name` ist der Ausweis. Über den Namen findest du die Zutat wieder.',
   [word('Entität','Eine Struct, die eine Datenbankzeile darstellt.'),word('FromRow','Ein Trait, das eine SQL-Zeile in deine Struct überführt.')],
   'https://docs.rs/rusqlite/latest/rusqlite/'),

  chapter('repository','persist','Der Regalmeister fragt die Datenbank',10,
   'Du willst nach Salami fragen, ohne SQL überall im Code zu verteilen. Der Regalmeister soll das für dich erledigen.',
   'WENN du Daten aus der Datenbank holen willst, DANN frag eine eigene Funktion im Regal.',
   'finde(&conn, "Salami") → Some(..)',
   ['Du verstehst ein Repository als Datenzugriff.','Du kannst fehlende Daten als Option erkennen.'],
   ['key-value','contracts'],[
    'In Band 1 war das Regal eine HashMap. Jetzt übernimmt eine Funktion den Zugriff: Sie kennt die Tabelle und das SQL, die Küche kennt nur die Funktion.',
    'Mit `OptionalExtension::optional()` wird „keine Zeile" zu `None`. Der leere Fall gehört zum Typ dazu – du musst aktiv an ihn denken.',
    'WENN die Küche Zutaten braucht, DANN ruft sie `finde` auf – nie direkt SQL. So bleibt die Arbeit geteilt.'
   ],`use rusqlite::{Connection, OptionalExtension};
fn finde(conn: &Connection, name: &str) -> Result<Option<Zutat>, rusqlite::Error> {
    conn.query_row("SELECT name, menge FROM zutat WHERE name = ?1", [name], Zutat::from_row).optional()
}`,'Ok(Some(Zutat { name: "Salami", .. })) oder Ok(None)',
   'Was passiert, wenn es die Zutat nicht gibt?',
   'Eine Datenbankabfrage ist keine Liste. Du bekommst eine Option zurück, weil etwas fehlen kann.',
   'Du erhältst Ok(None) und kannst mit unwrap_or einen Ersatz wählen oder höflich antworten.',
   [word('Repository','Eine Stelle, die dir Daten aus der Datenbank holt.'),word('optional()','Ein Helfer, der „keine Zeile" in None übersetzt.')],
   'https://docs.rs/rusqlite/latest/rusqlite/struct.OptionalExtension.html'),

  chapter('migration','persist','Neues Fach im Regal',10,
   'Du willst später auch den Preis einer Zutat speichern. Die alte Tabelle hat dafür kein Fach.',
   'WENN sich die Daten ändern, DANN schreibe eine Migration – keine handwerkliche Änderung zwischendurch.',
   'M::up("ALTER TABLE zutat ADD COLUMN preis ...")',
   ['Du verstehst Migrationen als geplante Umbauten.','Du erkennst, warum alte Daten erhalten bleiben.'],
   ['contracts','errors'],[
    'Stell dir vor, das Regal hat schon 20 Zutaten. Du kannst es nicht einfach wegwerfen. Du baust ein neues Fach ein – die alten Zettel bleiben liegen.',
    'Mit `rusqlite_migration` schreibst du die Schritte als Liste. Beim Start führt `to_latest` genau die Migrationen aus, die noch fehlen.',
    'WENN du ein Feld hinzufügst, DANN schreibst du eine neue Migration. SONST weiß dein Rechner von gestern nichts mehr.'
   ],`use rusqlite_migration::{Migrations, M};
let migrationen = Migrations::new(vec![
    M::up("CREATE TABLE zutat (name TEXT PRIMARY KEY, menge INTEGER NOT NULL);"),
    M::up("ALTER TABLE zutat ADD COLUMN preis INTEGER NOT NULL DEFAULT 0;"),
]);
migrationen.to_latest(&mut conn)?;`,'Neues Feld preis mit 0 bei alten Zutaten',
   'Warum ist der Standardwert 0 wichtig?',
   'Alte Datensätze haben das neue Feld noch nicht. Ohne Standardwert bleiben sie leer und alles könnte kaputtgehen.',
   'Weil alte Zutaten sonst keinen Preis hätten. Mit 0 kannst du trotzdem rechnen.',
   [word('Migration','Ein geplanter Umbau der Datenbank, der alte Daten erhält.'),word('Standardwert','Der Wert, den neue Felder am Anfang bekommen.')],
   'https://docs.rs/rusqlite_migration/latest/rusqlite_migration/'),

  chapter('login','auth','Der Gast meldet sich an',10,
   'Dein Laden soll wissen, wer gerade bestellt. Dazu gibt der Gast seinen Namen und ein Passwort ein.',
   'WENN ein Gast sich anmeldet, DANN prüfe Name und Passwort. SONST bleibt er ein Unbekannter.',
   'POST /login {name, passwort}',
   ['Du verstehst Anmeldung als Identitätsprüfung.','Du kennst den Unterschied zwischen Gast und Unbekanntem.'],
   ['contracts','errors'],[
    'Anmelden heißt: Der Gast sagt, wer er ist, und beweist es mit einem Passwort. Dein Programm sucht den Namen und prüft den Hash.',
    'Solange niemand angemeldet ist, darf die Anwendung nur öffentliche Seiten zeigen – zum Beispiel die Speisekarte.',
    'WENN die Prüfung klappt, DANN bekommst du ein Armband für die nächsten Anfragen. SONST bleibt der Gast auf der Gästeseite.'
   ],`async fn login(State(st): State<AppState>, Json(cred): Json<Login>) -> Result<StatusCode, ApiError> {
    let hash = st.users.hash_fuer(&cred.name).ok_or(ApiError::Unbekannt)?;
    if !pruefe_passwort(&cred.passwort, &hash)? { return Err(ApiError::Unbekannt); }
    Ok(StatusCode::OK)
}`,'200 OK oder 401 Unauthorized',
   'Welche Seite darf ein unbekannter Gast sehen?',
   'Anmelden ist nicht dasselbe wie registrieren. Hier prüfst du einen schon bekannten Gast.',
   'Nur öffentliche Seiten wie die Speisekarte. Bestellen darf er erst nach der Anmeldung.',
   [word('Anmeldung','Das Prüfen, ob ein Gast wirklich der ist, der er vorgibt.'),word('Identität','Wer eine Person wirklich ist.')],
   'https://docs.rs/axum/latest/axum/'),

  chapter('password','auth','Das Passwort darf nicht auf einem Zettel stehen',11,
   'Du willst Passwörter speichern. Wenn du sie einfach in die Datenbank schreibst, kann jeder sie lesen.',
   'WENN du ein Passwort speicherst, DANN speichere nur einen verschlüsselten Abdruck. SONST kann es jeder lesen.',
   'hash = Argon2::hash(passwort, salt)',
   ['Du verstehst, warum Passwörter nie im Klartext stehen.','Du kennst einen Hash als Einweg-Abdruck.'],
   ['errors','contracts'],[
    'Ein Hash ist wie ein Fingerabdruck: Du kannst ihn prüfen, aber nicht daraus das Original nachbauen. Bei jeder Anmeldung wird das eingegebene Passwort neu gehasht und verglichen.',
    'Argon2 erzeugt für jedes Passwort ein neues Salz (`SaltString`). Zwei gleiche Passwörter haben deshalb verschiedene Hashes – das erschwert das Raten.',
    'WENN du ein Passwort speicherst, DANN benutze eine bewährte Bibliothek. SONST machst du einen gefährlichen Fehler.'
   ],`use argon2::password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString};
use argon2::{password_hash::rand_core::OsRng, Argon2};
let salt = SaltString::generate(&mut OsRng);
let hash = Argon2::default().hash_password(b"geheim", &salt)?.to_string();
let ok = Argon2::default().verify_password(b"geheim", &PasswordHash::new(&hash)?).is_ok();
println!("{ok}");`,'true',
   'Warum speicherst du nicht das Passwort selbst?',
   'Ein Hash ist kein Verschlüsseln mit Schlüssel. Du kannst ihn nicht wieder zurückverwandeln – genau das ist der Punkt.',
   'Weil sonst jeder, der die Datenbank liest, das Passwort kennt. Der Hash verrät es nicht.',
   [word('Hash','Ein Einweg-Abdruck eines Passworts.'),word('Klartext','Ein Text, den jeder direkt lesen kann.')],
   'https://docs.rs/argon2/latest/argon2/'),

  chapter('roles','auth','Gast, Küche, Chef',11,
   'Ein Gast darf bestellen, die Küche darf kochen, nur der Chef darf Preise ändern. Alle drei nutzen dieselbe Anwendung.',
   'WENN eine Aufgabe gefährlich ist, DANN darf sie nur eine bestimmte Rolle ausführen.',
   'if !matches!(rolle, Rolle::Chef) → Fehler',
   ['Du verstehst Rollen als Rechtebündel.','Du kannst eine Funktion mit einer Rolle schützen.'],
   ['contracts','errors'],[
    'Eine Rolle ist wie ein Abzeichen: Gast, Küche oder Chef. Die Anwendung schaut auf das Abzeichen, bevor sie eine Aufgabe erlaubt.',
    'In Rust steht die Prüfung direkt in der Funktion – oder in einem Extractor, der die Rolle aus der Session liest. Es gibt keine Annotation, die einfach „zaubert".',
    'WENN jemand eine geschützte Aufgabe aufruft, DANN prüft deine Funktion die Rolle. SONST wird die Anfrage abgelehnt.'
   ],`enum Rolle { Gast, Kueche, Chef }
fn preis_aendern(rolle: &Rolle, neu: i32) -> Result<(), ApiError> {
    if !matches!(rolle, Rolle::Chef) { return Err(ApiError::Verboten); }
    Ok(())
}`,'Nur für Chef aufrufbar',
   'Was passiert, wenn ein Gast diese Funktion aufruft?',
   'Eine Rolle schützt nicht nur die Oberfläche. Die Prüfung sitzt an der Funktion selbst.',
   'Die Anfrage wird abgelehnt. Der Preis bleibt unverändert.',
   [word('Rolle','Ein Abzeichen, das bestimmte Rechte erlaubt.'),word('Autorisierung','Das Prüfen, ob jemand etwas darf.')],
   'https://doc.rust-lang.org/book/ch06-02-match.html'),

  chapter('session','auth','Der Gast bekommt ein Armband',10,
   'Nach der Anmeldung vergisst die Anwendung den Gast bei jeder neuen Anfrage wieder. Du brauchst ein Armband, das ihn erkennt.',
   'WENN ein Gast angemeldet ist, DANN merke es dir für die nächsten Anfragen.',
   'Set-Cookie: session=abc123; HttpOnly',
   ['Du verstehst eine Session als Merkzettel für den Besuch.','Du kennst ein Cookie als kleines Armband im Browser.'],
   ['contracts'],[
    'Der Browser bekommt ein kleines Armband – ein Cookie. Bei jeder neuen Anfrage zeigt er es vor, und die Anwendung weiß wieder, wer da ist.',
    'Die Session selbst liegt auf dem Server. Im Cookie steht nur eine zufällige Nummer, die darauf verweist – wie eine Garderobenmarke. Mit `HttpOnly` kann JavaScript sie nicht lesen.',
    'WENN der Gast etwas bestellen will, DANN prüft die Anwendung das Armband. SONST gilt er als unbekannt.'
   ],`use cookie::{Cookie, SameSite};
let mut session = Cookie::new("session", "abc123");
session.set_http_only(true);
session.set_same_site(SameSite::Lax);
cookies.add(session);`,'Set-Cookie: session=abc123; HttpOnly; SameSite=Lax',
   'Wo liegt der Name des Gastes – im Browser oder auf dem Server?',
   'Ein Cookie ist kein Passwort und keine Datenbank. Es ist nur die Marke für die Garderobe.',
   'Auf dem Server in der Session. Der Browser trägt nur die Nummer dazu.',
   [word('Session','Ein Merkzettel auf dem Server für die Dauer eines Besuchs.'),word('Cookie','Ein kleines Armband im Browser mit der Session-Nummer.')],
   'https://docs.rs/tower-cookies/latest/tower_cookies/'),

  chapter('logout','auth','Am Ende geht das Armband zurück',9,
   'Der Gast geht nach Hause. Der nächste Mensch am selben Rechner soll nicht seine Bestellungen sehen.',
   'WENN ein Gast sich abmeldet, DANN ungültig mache seine Session. SONST kann jemand anderes sie benutzen.',
   'POST /logout → session entfernen',
   ['Du verstehst Abmelden als Aufräumen.','Du erkennst, warum Session-Daten nicht ewig leben dürfen.'],
   ['contracts','ownership'],[
    'Abmelden klingt unwichtig, ist aber sicherheitstechnisch entscheidend. Du gibst das Armband zurück und der Server wirft den Zettel weg.',
    'Danach darf der Browser die alte Nummer noch zeigen – sie führt aber zu nichts mehr. Der Gast ist wieder unbekannt.',
    'WENN ein Gast geht, DANN räume auf. SONST wird sein Platz von jemandem übernommen.'
   ],`use cookie::Cookie;
cookies.remove(Cookie::named("session"));
state.sessions.entfernen(&session_id);`,'Session ist ungültig',
   'Was passiert nach dem Abmelden bei einer alten Anfrage?',
   'Abmelden löscht nicht die Datenbank. Es beendet nur die Zugehörigkeit des Gastes.',
   'Die alte Session gilt nicht mehr. Die Anwendung behandelt die Anfrage als unbekannt.',
   [word('Abmelden','Die Session beenden, damit niemand sie weiterbenutzen kann.'),word('ungültig','Nicht mehr erlaubt oder gültig.')],
   'https://docs.rs/cookie/latest/cookie/'),

  chapter('error-contract','robust','Höfliche Fehler für alle',10,
   'Die Salami fehlt. Der Gast sieht eine technische Fehlerseite mit Rust-Wörtern. Das versteht niemand.',
   'WENN etwas schiefgeht, DANN antworte mit einer klaren, festen Meldung. SONST rät der Gast.',
   '{"fehler":"Salami fehlt im Regal"}',
   ['Du verstehst einen Fehlervertrag als feste Antwortform.','Du kannst einen Fehler in eine verständliche Meldung übersetzen.'],
   ['errors','contracts'],[
    'Ein Fehlervertrag ist wie ein einheitliches Formular: Immer steht dort, was passiert ist – in Alltagssprache und im selben Format.',
    'Intern hast du in Rust einen Fehlertyp, zum Beispiel `enum ApiError`. Mit `impl IntoResponse` übersetzt du ihn an einer zentralen Stelle in Status und JSON. Der Gast sieht keinen Rust-Code.',
    'WENN intern etwas schiefgeht, DANN fange es ab und antworte höflich. SONST sieht der Gast den Fehler direkt.'
   ],`enum ApiError { Fehlt(String), Verboten }
impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (code, text) = match self { Self::Fehlt(m) => (400, m), Self::Verboten => (403, "Nicht erlaubt".into()) };
        (code, Json(json!({ "fehler": text }))).into_response()
    }
}`,'{"fehler":"Salami fehlt im Regal"}',
   'Warum solltest du die technische Meldung nicht direkt zeigen?',
   'Ein Fehlervertrag ändert nicht den Fehler, sondern nur die Art, wie du ihn nach außen zeigst.',
   'Weil sie für Gäste unverständlich und manchmal sogar gefährlich ist. Die höfliche Meldung sagt das Nötige.',
   [word('Fehlervertrag','Eine feste Form für Fehlermeldungen, die alle verstehen.'),word('IntoResponse','Ein Trait, das deinen Fehlertyp in eine HTTP-Antwort übersetzt.')],
   'https://docs.rs/axum/latest/axum/response/trait.IntoResponse.html'),

  chapter('validation','robust','Prüfen, bevor es in die Küche geht',10,
   'Ein Gast bestellt „minus drei Pizzen". Die Küche weiß nicht, was sie tun soll. Du musst die Bestellung vorher prüfen.',
   'WENN Daten in die Anwendung kommen, DANN prüfe sie zuerst. SONST arbeitet die Küche mit Unsinn.',
   'WENN anzahl < 1 ODER name leer → Fehler',
   ['Du verstehst Validierung als Eingangskontrolle.','Du kannst Regeln wie "mindestens 1" festlegen.'],
   ['errors','contracts'],[
    'Validierung ist wie ein Türsteher: Er lässt nur gültige Bestellungen hinein. Negativzahlen oder leere Namen kommen gar nicht erst in die Küche.',
    'In Rust prüfst du die Werte in einer eigenen Funktion – oder nutzt das `validator`-Crate mit Attributen. Wichtig ist: Die Prüfung sitzt vor der Verarbeitung.',
    'WENN die Prüfung scheitert, DANN antwortest du mit einem klaren Fehler. SONST gibst du ungültige Daten weiter.'
   ],`#[derive(Deserialize)]
struct Bestellung { pizza: String, anzahl: i32 }
fn pruefen(b: &Bestellung) -> Result<(), ApiError> {
    if b.anzahl < 1 { return Err(ApiError::Fehlt("anzahl muss >= 1 sein".into())); }
    if b.pizza.trim().is_empty() { return Err(ApiError::Fehlt("pizza darf nicht leer sein".into())); }
    Ok(())
}`,'Ungültige Bestellung wird abgelehnt',
   'Welche Regel brauchst du für den Pizza-Namen?',
   'Validierung prüft die Form der Daten, nicht ob die Pizza im Regal ist. Das kommt danach.',
   'Der Name darf nicht leer sein. Zusammen mit anzahl >= 1 ist die Bestellung gültig.',
   [word('Validierung','Das Prüfen von Daten, bevor sie weiterverarbeitet werden.'),word('Eingangskontrolle','Die Stelle, an der Daten die Anwendung betreten.')],
   'https://docs.rs/validator/latest/validator/'),

  chapter('retry','robust','Der Lieferant ist gerade nicht erreichbar',11,
   'Deine Anwendung fragt einen Lieferanten. Kurz ist das Netz weg. Beim ersten Fehler willst du nicht gleich aufgeben.',
   'WENN eine Anfrage kurz scheitert, DANN versuche es noch einmal mit einer Pause. SONST bricht der Laden ab.',
   'WENN Fehler: warte 200 ms, versuche erneut',
   ['Du verstehst Wiederholung als Schutz vor vorübergehenden Fehlern.','Du kennst eine Pause zwischen Versuchen.'],
   ['errors','async'],[
    'Nicht jeder Fehler ist dauerhaft. Wenn der Lieferant gerade telefoniert, hilft eine zweite Anfrage nach kurzer Zeit.',
    'Du schreibst eine kleine Schleife: probieren, kurz warten, noch mal probieren. In Async-Code wartest du mit `tokio::time::sleep`, statt den ganzen Server zu blockieren.',
    'WENN der Fehler verschwindet, DANN läuft alles weiter. SONST bekommst du eine verständliche Meldung.'
   ],`for versuch in 1..=3 {
    match lieferant.fragen().await {
        Ok(antwort) => return Ok(antwort),
        Err(_) if versuch < 3 => tokio::time::sleep(Duration::from_millis(200)).await,
        Err(e) => return Err(e),
    }
}`,'Nach maximal drei Versuchen eine Antwort',
   'Warum nicht unendlich oft versuchen?',
   'Wiederholen ist kein Heilmittel für falsche Daten. Wenn etwas dauerhaft kaputt ist, musst du es melden.',
   'Sonst hängt die Anwendung für immer. Nach drei Versuchen ist die Information „nicht erreichbar" ehrlicher.',
   [word('Wiederholung','Ein Fehler wird noch einmal versucht, meist nach einer kurzen Pause.'),word('vorübergehend','Nur kurzzeitig – nicht für immer.')],
   'https://docs.rs/tokio/latest/tokio/time/fn.sleep.html'),

  chapter('logging','robust','Ein Tagebuch für den Laden',10,
   'Am Morgen sagt jemand: „Gestern um 18 Uhr war die Bestellung falsch." Du weißt nichts mehr – es gab kein Tagebuch.',
   'WENN etwas im Betrieb passiert, DANN schreibe eine kurze Notiz mit Zeitpunkt. SONST kannst du es später nicht nachvollziehen.',
   'info!(pizza = %name, "Bestellung angenommen")',
   ['Du verstehst Logging als Tagebuch der Anwendung.','Du kannst eine Information mit Zeitstempel festhalten.'],
   ['errors','contracts'],[
    'Ein Log ist ein Tagebuch für den Computer. Statt „ich hab da mal was gesehen" steht dort: Uhrzeit, was passiert ist, welche Pizza bestellt wurde.',
    'Mit `tracing` schreibst du `info!` an wichtigen Stellen: Anmeldung, Bestellung, Fehler. `tracing_subscriber` formatiert die Ausgabe; mit `RUST_LOG` wählst du die Stufe.',
    'WENN du später etwas suchen willst, DANN hilft dir ein gutes Log. SONST rätst du wieder.'
   ],`use tracing::{info, warn};
info!(pizza = %name, "Bestellung angenommen");
warn!("Salami fehlt im Regal");`,'Zwei Zeilen im Tagebuch',
   'Schreibe eine Log-Zeile für eine abgelehnte Bestellung.',
   'Logging ist nicht dasselbe wie eine Ausgabe an den Gast. Der Gast soll höfliche Meldungen sehen, das Log ist für dich.',
   'Zum Beispiel: warn!(grund = %grund, "Bestellung abgelehnt").',
   [word('Log','Ein Tagebuch mit Notizen aus der laufenden Anwendung.'),word('Stufe','Ein Log-Eintrag kann info, warn oder error sein.')],
   'https://docs.rs/tracing/latest/tracing/'),

  chapter('health','robust','Ist der Laden noch offen?',9,
   'Du willst von außen schnell wissen, ob deine Anwendung noch läuft oder schon umgefallen ist.',
   'WENN jemand nach dem Zustand fragt, DANN antworte mit einem kurzen Statusbericht.',
   'GET /health → {"status":"UP"}',
   ['Du kennst einen Health-Check als kurzen Puls.','Du verstehst, dass "UP" so viel wie „läuft" bedeutet.'],
   ['contracts'],[
    'Ein Health-Check ist wie ein Blick auf die Tür: Ist sie offen? Dann antwortet die Anwendung mit `UP`.',
    'Axum hat keinen eingebauten Actuator. Du schreibst selbst eine kleine Route und kannst dort zusätzlich `SELECT 1` an die Datenbank schicken.',
    'WENN ein Überwachungswerkzeug fragt, DANN antwortet dein Laden mit seinem Zustand. SONST weiß niemand, ob er noch da ist.'
   ],`async fn health() -> Json<Value> {
    Json(json!({ "status": "UP" }))
}
let app = Router::new().route("/health", get(health));`,'{"status":"UP"}',
   'Was würde eine kaputte Anwendung antworten?',
   'Ein Health-Check ersetzt keine Fehlerbehandlung. Er sagt nur, ob die Anwendung erreichbar ist.',
   'Gar nichts oder eine Fehlermeldung. Genau das ist das Signal für den Betrieb.',
   [word('Health-Check','Eine kurze Anfrage, die fragt: Läuft die Anwendung noch?'),word('UP','Der Zustand „läuft" beim Health-Check.')],
   'https://docs.rs/axum/latest/axum/'),

  chapter('unit-repeat','testing','Jeden Morgen dieselbe Prüfung',10,
   'Du hast in Band 1 einen Test geschrieben. Du willst ihn nicht mehr von Hand starten.',
   'WENN du eine Regel änderst, DANN lasse alle Tests automatisch laufen.',
   'cargo test',
   ['Du verstehst automatisierte Tests als Sicherheitsnetz.','Du kannst mehrere Prüfungen mit einem Befehl starten.'],
   ['errors','contracts'],[
    'Ein Test, den du nur manuell startest, wird bald vergessen. Mit `cargo test` laufen alle Prüfungen nacheinander.',
    'Du schreibst für jede wichtige Regel einen Test: Preis, Rabatt, Grenzfälle. `#[cfg(test)]` sorgt dafür, dass der Test nur beim Testlauf übersetzt wird.',
    'WENN grün, DANN ist alles wie erwartet. SONST weißt du, welche Regel kaputt ist.'
   ],`#[cfg(test)]
mod tests {
    #[test]
    fn rabatt_bei_null() { assert_eq!(0, 0 / 10); }
}`,'1 passed',
   'Warum testest du auch den Wert 0?',
   'Ein Test prüft nur, was du hinschreibst. Das ist der Grund, warum du Grenzfälle aktiv ergänzen musst.',
   'Weil dort oft Fehler entstehen – zum Beispiel eine Division oder ein leeres Feld.',
   [word('Automatisiert','Läuft von selbst, ohne dass du jedes Mal daran denken musst.'),word('Sicherheitsnetz','Tests, die dich auffangen, wenn du etwas kaputt machst.')],
   'https://doc.rust-lang.org/book/ch11-00-testing.html'),

  chapter('integration','testing','Zusammen statt einzeln',11,
   'Alle Einzelteile funktionieren – aber bestellt die Anwendung am Ende auch wirklich? Du musst sie zusammen prüfen.',
   'WENN du die ganze Anwendung prüfen willst, DANN schicke im Test eine echte Anfrage an den Router.',
   'app.oneshot(Request..).await?',
   ['Du verstehst einen Integrationstest als Prüfung des Zusammenspiels.','Du kennst eine Anfrage ohne echten Browser.'],
   ['contracts','errors'],[
    'Ein Unit-Test prüft eine kleine Regel. Ein Integrationstest prüft, ob Handler, Küche und Regal zusammenarbeiten.',
    'Mit `tower::ServiceExt::oneshot` rufst du den Axum-Router direkt im Test auf. Du brauchst keinen laufenden Server und keinen Browser.',
    'WENN die Antwort stimmt, DANN funktioniert das Zusammenspiel. SONST ist eine Verbindung kaputt.'
   ],`let app = Router::new().route("/bestellung", post(bestellen));
let antwort = app.oneshot(Request::builder().uri("/bestellung").method("POST").body(Body::empty())?).await?;
assert_eq!(antwort.status(), StatusCode::OK);`,'Zusammenspiel geprüft',
   'Was prüft ein Integrationstest, was ein Unit-Test nicht prüft?',
   'Ein Integrationstest ist langsamer als ein Unit-Test. Deshalb benutzt du beide – nicht nur einen.',
   'Ob die Rollen miteinander sprechen. Der Unit-Test prüft nur eine Regel für sich.',
   [word('Integrationstest','Ein Test, der mehrere Teile zusammen prüft.'),word('oneshot','Ein Helfer, der eine Anfrage ohne echten Server an den Router schickt.')],
   'https://docs.rs/tower/latest/tower/trait.ServiceExt.html'),

  chapter('edge-cases','testing','Die fiesen Fälle',10,
   'Der Test mit drei Pizzen klappt. Mit null Pizzen oder einer leeren Bestellung nicht. Du musst die Ränder prüfen.',
   'WENN du einen Test schreibst, DANN denke auch an die extremen Werte.',
   '0, -1, leer, doppelt',
   ['Du kannst Grenzfälle gezielt als Tests formulieren.','Du verstehst, warum "normal" nicht genug ist.'],
   ['errors','uniqueness'],[
    'Grenzfälle sind die Ränder: 0 statt 3, -1 statt 1, ein leerer Name, dieselbe Zutat zweimal. Genau dort passieren die meisten Fehler.',
    'Du schreibst für jeden Rand einen eigenen Test mit `#[test]`. Das klingt viel, ist aber nur eine Liste kleiner Regeln.',
    'WENN alle Grenzfälle bestehen, DANN kannst du dem Laden eher trauen. SONST bleibt ein Risiko.'
   ],`#[test] fn keine_pizza() { assert_eq!(0, "".len()); }
#[test] fn negativ() { assert!(ungueltig(-1)); }
#[test] fn doppelt() { assert_eq!(1, eindeutig(["Salami", "Salami"]).len()); }`,'Drei weitere grüne Tests',
   'Finde einen dritten Grenzfall für die Zutatenliste.',
   'Grenzfälle sind keine seltenen Wünsche. Sie kommen im echten Betrieb überraschend oft vor.',
   'Zum Beispiel dieselbe Zutat zweimal in einer Bestellung – das HashSet darf sie nur einmal zählen.',
   [word('Grenzfall','Ein extremer Wert am Rand des erlaubten Bereichs.'),word('Erwartung','Das Ergebnis, das du von einem Test erwartest.')],
   'https://doc.rust-lang.org/book/ch11-00-testing.html'),

  chapter('ci','testing','Der Prüfer nach jedem Speichern',10,
   'Du willst nicht daran denken müssen, Tests zu starten. Jeder Speichervorgang soll sie automatisch prüfen.',
   'WENN du Code speicherst, DANN lasse einen Automaten alle Tests laufen.',
   'on: push → cargo test',
   ['Du verstehst CI als automatischen Prüfer.','Du kennst eine einfache Workflow-Datei.'],
   ['errors','contracts'],[
    'CI heißt: Die Prüfung läuft auf einem anderen Rechner, sobald du deinen Code hochlädst. Du bekommst grün oder rot zurück.',
    'Die Regeln stehen in einer kleinen Datei unter `.github/workflows/`. Sie sagt: „Bei jedem Push: Rust installieren, Format und Lints prüfen, Tests starten."',
    'WENN alles grün ist, DANN darf der Code weiter. SONST siehst du sofort, welcher Test scheitert.'
   ],`name: pruefen
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: cargo clippy -- -D warnings
      - run: cargo test --all-targets`,'Automatisches Testergebnis',
   'Was passiert bei einem roten Test?',
   'CI ist nicht die Auslieferung selbst. Sie ist nur die automatische Prüfung vor der Auslieferung.',
   'Der Code wird nicht weitergegeben. Du musst den Fehler beheben und erneut speichern.',
   [word('CI','Automatische Prüfung von Code nach jedem Speichern.'),word('Workflow','Eine Datei mit den Schritten für den Automaten.')],
   'https://doc.rust-lang.org/cargo/'),

  chapter('docker','delivery','Die Pizzeria in einer Kiste',11,
   'Du willst deine Anwendung einem Freund geben. Bei ihm fehlt Rust oder die Einstellungen sind anders.',
   'WENN du eine Anwendung übergeben willst, DANN packe sie mit ihrer Umgebung in eine Kiste.',
   'FROM rust:1 AS build → debian:bookworm-slim',
   ['Du verstehst einen Container als fertige Kiste.','Du kennst ein Dockerfile als Bauanleitung.'],
   ['ownership','contracts'],[
    'Ein Container ist wie eine Umzugskiste: Die Anwendung und alles, was sie braucht, sind drin. Dein Freund muss nur die Kiste öffnen.',
    'Bei Rust baust du mehrstufig: In `rust:1` wird das Programm kompiliert, in `debian:bookworm-slim` läuft nur noch das fertige Binary. So bleibt die Kiste klein.',
    'WENN die Kiste gebaut ist, DANN läuft sie überall gleich. SONST heißt es „bei mir geht es, bei dir nicht".'
   ],`FROM rust:1 AS build
WORKDIR /app
COPY . .
RUN cargo build --release
FROM debian:bookworm-slim
COPY --from=build /app/target/release/pizzeria /usr/local/bin/
CMD ["pizzeria"]`,'Ein lauffähiges Image',
   'Was wäre ohne Container anders?',
   'Ein Container enthält die Laufzeitumgebung, aber keine Geheimnisse. Die kommen später dazu.',
   'Du müsstest Rust und Einstellungen auf jedem Rechner neu einrichten – und hättest mehr Fehlerquellen.',
   [word('Container','Eine fertige Kiste mit Anwendung und Umgebung.'),word('Dockerfile','Die Bauanleitung für so eine Kiste.')],
   'https://docs.docker.com/get-started/'),

  chapter('profiles','delivery','Zwei Küchen: zu Hause und im Betrieb',10,
   'Zu Hause benutzt du SQLite im Speicher. Im Betrieb soll eine echte Datei oder ein Datenbankserver laufen. Du willst den Code nicht ändern.',
   'WENN Umgebungen verschieden sind, DANN gib ihnen eigene Einstellungen.',
   'APP_ENV=dev|prod',
   ['Du verstehst Profile als verschiedene Einstellungssätze.','Du kannst zwischen dev und prod umschalten.'],
   ['contracts'],[
    'Cargo kennt keine fertigen Umgebungsprofile. Du liest stattdessen eine Umgebungsvariable und baust daraus eine kleine `Config`-Struct – eine Schublade mit Einstellungen.',
    'In `dev` nutzt du `:memory:`, in `prod` eine Datei. Der Code bleibt gleich. Für Unterschiede zur Compilezeit gibt es zusätzliche Cargo-Features mit `#[cfg(feature = "...")]`.',
    'WENN du die Umgebung wechselst, DANN änderst du nur die Einstellung. SONST baust du zwei Versionen.'
   ],`let env = std::env::var("APP_ENV").unwrap_or_else(|_| "dev".into());
let db = if env == "prod" { "pizzeria.db" } else { ":memory:" };
let conn = Connection::open(db)?;`,'dev → Speicher, prod → Datei',
   'Welche Umgebung nutzt du zum Entwickeln?',
   'Ein Profil ersetzt keine Geheimnisse. Passwörter gehören nicht in die Konfigurationsdatei.',
   'Die Umgebung `dev`. Für den echten Betrieb wird `prod` gesetzt.',
   [word('Profil','Ein Satz Einstellungen für eine Umgebung.'),word('Umgebungsvariable','Ein Wert, den du dem Programm beim Start von außen gibst.')],
   'https://doc.rust-lang.org/cargo/reference/features.html'),

  chapter('secrets','delivery','Geheimnisse gehören nicht in den Code',10,
   'Das Zugangstoken für deinen Lieferanten steht in deiner Datei. Du willst die Anwendung an einen Freund geben – ohne ihm das Token zu verraten.',
   'WENN etwas geheim ist, DANN lies es aus der Umgebung. SONST steht es im Code.',
   'LIEFERANT_TOKEN=${...}',
   ['Du verstehst Umgebungsvariablen als externe Geheimnisse.','Du erkennst, warum Tokens nicht ins Repository gehören.'],
   ['errors','ownership'],[
    'Ein Geheimnis ist wie ein Schlüssel, den du nicht auf die Tür schreibst. Du gibst ihn der Anwendung beim Start – von außen.',
    'Mit `std::env::var` liest du den Wert. Das `?` ist wichtig: Wenn niemand den Wert setzt, startet die Anwendung nicht. Das ist gewollt, denn ein stiller Ersatz wäre gefährlich.',
    'WENN du die Anwendung weiter gibst, DANN bleiben deine Geheimnisse bei dir. SONST hat sie jeder.'
   ],`let token = std::env::var("LIEFERANT_TOKEN")?;
let client = reqwest::Client::new();
let antwort = client.get(url).bearer_auth(token).send().await?;`,'Geheimnis kommt von außen',
   'Was passiert, wenn die Variable fehlt?',
   'Ein Platzhalter ist kein Standardwert. Wenn niemand den Wert gibt, startet die Anwendung nicht – das ist gewollt.',
   'Die Anwendung meldet einen Fehler. Du merkst sofort, dass etwas fehlt.',
   [word('Geheimnis','Ein Wert, den niemand außer der Anwendung sehen soll.'),word('Umgebungsvariable','Ein Wert, den du dem Programm beim Start von außen gibst.')],
   'https://docs.rs/reqwest/latest/reqwest/'),

  chapter('frontend','frontend','Ein Fenster für Gäste',11,
   'Deine Pizzeria antwortet mit JSON. Gäste wollen aber etwas ansehen, ohne JSON zu lesen.',
   'WENN ein Gast die Anwendung nutzen will, DANN zeige ihm eine einfache Seite.',
   'fetch("/pizzen").then(...)',
   ['Du verstehst, dass eine Seite Daten vom Server holen kann.','Du kennst fetch als Anfrage aus dem Browser.'],
   ['contracts','async'],[
    'Ein kleines HTML-Fenster kann deine Axum-API fragen: „Gib mir die Pizzen." Der Browser holt das JSON und zeigt es als Liste.',
    'Das macht deine Anwendung nicht komplizierter – sie bekommt nur ein Gesicht. Die Regeln bleiben im Server.',
    'WENN der Gast die Seite öffnet, DANN fragt sie die Daten ab. SONST sieht er eine leere Liste.'
   ],`fetch("/pizzen")
  .then(r => r.json())
  .then(p => document.body.innerText = p.join(", "));`,'Salami, Käse, Pilze',
   'Wo stehen die Regeln für die Pizzen?',
   'Das Frontend soll keine Preise berechnen. Es zeigt nur, was der Server ihm gibt.',
   'Auf dem Server. Die Seite zeigt nur das Ergebnis.',
   [word('Frontend','Der Teil, den der Gast im Browser sieht.'),word('fetch','Eine Anfrage aus dem Browser an den Server.')],
   'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API'),

  chapter('go-live','frontend','Der erste echte Gast',12,
   'Die Anwendung läuft, die Tests sind grün, die Daten bleiben gespeichert. Jetzt darf sie jemand anderes benutzen.',
   'WENN alles geprüft ist, DANN kannst du deine Pizzeria veröffentlichen. SONST behebe zuerst die offenen Punkte.',
   'Checkliste: Tests grün · prod · Geheimnisse extern · Health-Check OK',
   ['Du kannst eine Veröffentlichungs-Checkliste anwenden.','Du verstehst, dass Betrieb mehr ist als "es läuft".'],
   ['contracts','errors','ownership'],[
    'Geh die Liste durch: Tests grün, richtige Einstellungen, keine Passwörter im Code, Health-Check erreichbar. Dann ist dein Laden bereit.',
    'Band 1 hat dir beigebracht, wie man Regeln in Rust übersetzt. Band 2 hat gezeigt, was ein Programm braucht, um für andere zu funktionieren.',
    'WENN ein echter Gast kommt, DANN beobachtest du erst einmal. SONST übersiehst du, was er wirklich braucht.'
   ],`cargo fmt --check
cargo clippy -- -D warnings
cargo test
curl -s localhost:3000/health
curl -s localhost:3000/pizzen`,'{"status":"UP"} · ["Salami","Käse"]',
   'Was würdest du als erstes beobachten, wenn ein Gast den Laden nutzt?',
   'Veröffentlichen ist kein Endpunkt, sondern ein Übergang. Du darfst weiter lernen und verbessern.',
   'Ob er die Speisekarte findet und versteht, was passiert. Danach kommen neue Wünsche – und Band 3.',
   [word('Veröffentlichung','Die Anwendung anderen Menschen zugänglich machen.'),word('Checkliste','Eine Liste mit Punkten, die du vorher prüfst.')],
   'https://doc.rust-lang.org/book/')
 ]
};
