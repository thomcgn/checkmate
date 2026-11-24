import type {TypeScriptBeginnerBook,TypeScriptBeginnerChapter,TypeScriptBeginnerWord} from './pizzeria-typescript-book.ts';
import {validateTypeScriptBook} from './pizzeria-typescript-book.ts';

/**
 * Band 2: aus dem Übungsprogramm wird eine Anwendung, die man anderen geben kann.
 *
 * Framework-Entscheidung: Wir nehmen Node.js mit Express und TypeScript.
 * Express ist ein kleiner, weit verbreiteter HTTP-Server: Eine Route wie
 * app.get('/pizzen', ...) ist direkt lesbar – gut für Einsteiger. Für Daten
 * nutzen wir das in Node eingebaute node:sqlite, für Passwörter bcryptjs,
 * für Sessions express-session, für Tests node:test und supertest. NestJS wäre
 * die größere Alternative (namentlich für Dependency Injection), aber es würde
 * für dieses Buch mehr Framework als Pizzeria erklären. Quellen:
 * https://nodejs.org/api/ , https://expressjs.com/en/5x/api.html ,
 * https://docs.nestjs.com/introduction
 */
const stage=(id:string,title:string,goal:string)=>({id,title,goal});
const word=(term:string,definition:string):TypeScriptBeginnerWord=>({term,definition});
const chapter=(id:string,stageId:string,title:string,minutes:number,problem:string,natural:string,pseudo:string,
  objectives:readonly string[],conceptIds:readonly string[],explain:readonly string[],code:string,output:string,
  tryIt:string,misconception:string,solution:string,wordbank:readonly TypeScriptBeginnerWord[],sourceUrl:string):TypeScriptBeginnerChapter=>
  ({id,stage:stageId,title,minutes,problem,rule:{natural,pseudo},objectives,conceptIds,explain,code,output,tryIt,
   misconception,solution,wordbank,sourceUrl});

export const PIZZERIA_TYPESCRIPT_OPERATIONS_BOOK:TypeScriptBeginnerBook={
  title:'Die Pizzeria geht in Betrieb',
  subtitle:'Band 2: TypeScript, Datenbank, Anmeldung, Fehler, Tests und Auslieferung',
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
    ['Du verstehst den Unterschied zwischen Speicher und Festplatte.','Du kannst einen Wert mit Node.js in eine Datei schreiben.'],
    ['errors','ownership'],[
    'Band 1 hat alles im Arbeitsspeicher gehalten. Das ist wie ein Zettel, den du nach Ladenschluss wegwirfst. Am nächsten Morgen weißt du nichts mehr.',
    'Node.js kann Text mit `writeFile` aus `node:fs/promises` in eine Datei schreiben. Das kleine Wort `await` bedeutet: Warte kurz, bis der Zettel wirklich in der Schublade liegt.',
    'Für echte Anwendungen reicht eine Textdatei bald nicht mehr. Aber sie zeigt das Grundprinzip: Zustand muss irgendwo dauerhaft liegen.'
   ],"import { writeFile } from 'node:fs/promises';\nawait writeFile('bestand.txt', 'Salami=3');",'Datei bestand.txt mit Salami=3',
    'Schreibe eine zweite Zeile für Käse in dieselbe Datei. Was steht dann drin?',
    'Ein Programm merkt sich Variablen nur, solange es läuft. Die Festplatte bleibt auch nach dem Ausschalten erhalten.',
    'Die Datei enthält zwei Zeilen: Salami=3 und Käse=5 – genau das, was du hingeschrieben hast.',
    [word('Persistenz','Daten speichern, sodass sie auch nach dem Neustart vorhanden sind.'),word('Datei','Ein gespeicherter Zettel auf der Festplatte.')],
    'https://nodejs.org/api/fs.html'),

   chapter('json-file','persist','Ein Zettel, den der Computer lesen kann',10,
    'Deine Datei hat "Salami=3" drin. Ein anderes Programm kann das nicht gut lesen. Du brauchst ein gemeinsames Format.',
    'WENN Programme Daten austauschen, DANN benutzen sie ein gemeinsames Format wie JSON.',
    '{"zutat":"Salami","menge":3}',
    ['Du kennst JSON als lesbares Datenformat.','Du verstehst, warum benannte Felder besser sind als freier Text.'],
    ['contracts','records'],[
    'JSON sieht aus wie ein kleiner Zettel mit Beschriftung: `"zutat": "Salami"` und `"menge": 3`. Der Name steht immer neben dem Wert.',
    'Ein TypeScript-`interface` passt perfekt dazu: Es beschreibt dieselben Felder. Mit `JSON.stringify` machst du aus deiner Datenkarte genau solchen Text.',
    'WENN ein anderes Programm deine Daten lesen soll, DANN gib ihnen feste Namen. SONST rät es, was "3" bedeutet.'
   ],"interface Bestand { readonly zutat: string; readonly menge: number; }\nconst salami: Bestand = { zutat: 'Salami', menge: 3 };\nconsole.log(JSON.stringify(salami));",'{"zutat":"Salami","menge":3}',
    'Ändere die Menge auf 4. Wie sieht das JSON aus?',
    'JSON ist kein TypeScript-Code. Es ist nur Text – den dein Programm lesen und schreiben kann.',
    '{"zutat":"Salami","menge":4}. Nur der Wert hinter menge hat sich geändert.',
    [word('JSON','Ein Textformat mit benannten Feldern für den Datenaustausch.'),word('Format','Eine feste Art, Daten aufzuschreiben.')],
    'https://www.json.org/json-de.html'),

   chapter('database','persist','Ein Regal, das nicht vergisst',11,
    'Deine Datei wird größer und du suchst eine einzelne Zutat ewig. Du brauchst ein Regal mit schneller Suche.',
    'WENN du viele Daten schnell finden willst, DANN benutze eine Datenbank.',
    'SELECT menge FROM zutat WHERE name = "Salami"',
    ['Du verstehst eine Datenbank als durchsuchbares Regal.','Du kennst eine einfache SQL-Abfrage in Node.js.'],
    ['key-value'],[
    'Eine Datenbank ist wie ein sehr ordentliches Regal mit einem Register. Du fragst nicht „Zeig mir alle Fächer", sondern „Gib mir Salami".',
    'Diese Frage heißt SQL. `SELECT` bedeutet „zeige mir", `WHERE` bedeutet „nur wo …". Das ist eine Regel in einer eigenen kleinen Sprache.',
    'Seit Node.js 22 ist `node:sqlite` eingebaut: `DatabaseSync` öffnet die Datenbank, `db.exec` legt die Tabelle an und `prepare(...).get(...)` sucht eine Zeile. Du musst nichts zusätzlich installieren.'
   ],"import { DatabaseSync } from 'node:sqlite';\nconst db = new DatabaseSync('pizzeria.db');\ndb.exec('CREATE TABLE IF NOT EXISTS zutat (name TEXT, menge INTEGER)');\nconsole.log(db.prepare('SELECT menge FROM zutat WHERE name = ?').get('Salami'));",'{ menge: 3 }',
    'Schreibe eine Abfrage für Käse. Was änderst du?',
    'SQL ist keine JavaScript-Methode. Du schreibst eine Frage an die Datenbank, nicht eine Anweisung an dein Programm.',
    'Du ersetzt "Salami" durch "Käse". Alles andere bleibt gleich.',
    [word('Datenbank','Ein dauerhaftes Regal, in dem du Daten schnell wiederfindest.'),word('SQL','Die Sprache, in der man Datenbanken fragt.')],
    'https://nodejs.org/api/sqlite.html'),

   chapter('jpa-entity','persist','Eine Karte für die Datenbank',11,
    'Du willst in TypeScript mit Zutaten arbeiten, nicht mit SQL-Zeilen. Es wäre schön, wenn deine Datenkarte genau einem Datenbankfach entspricht.',
    'WENN du Datenkarten in einer Datenbank speichern willst, DANN beschreibe sie als Typ mit einem eindeutigen Schlüssel.',
    'type Zutat = { readonly name; readonly menge }',
    ['Du verstehst eine Datenkarte als Entität mit Ausweis.','Du erkennst, dass name der Schlüssel ist.'],
    ['records','key-value'],[
    'Eine Entität ist eine Datenkarte, die genau einem Datenbankfach entspricht. In TypeScript schreibst du sie als `interface` mit `readonly`-Feldern.',
    'Das Feld `name` ist wie ein Ausweis: Es macht jede Karte eindeutig. Zwei Salami-Karten darf es nicht geben. Anders als bei Spring schreibst du den Weg in die Datenbank selbst – im Repository.',
    'Du schreibst weiterhin TypeScript. Das `interface` beschreibt nur die Form; deine Abfrage holt die Werte in genau dieser Form zurück.'
   ],'interface Zutat {\n    readonly name: string;\n    readonly menge: number;\n}\n// name ist der Ausweis: eine Zutat pro Name','Eine Tabelle zutat mit name und menge',
    'Welches Feld ist der Ausweis deiner Karte?',
    'Ohne eindeutigen Schlüssel weiß die Datenbank nicht, wie sie zwei Karten unterscheiden soll.',
    'Das Feld `name` ist der Ausweis. Über den Namen findest du die Zutat wieder.',
    [word('Entität','Eine Datenkarte, die in der Datenbank gespeichert wird.'),word('Schlüssel','Das Feld, das eine Karte eindeutig macht.')],
    'https://www.typescriptlang.org/docs/handbook/2/objects.html'),

   chapter('repository','persist','Der Regalmeister fragt die Datenbank',10,
    'Du willst nach Salami fragen, ohne jedes Mal SQL zu schreiben. Der Regalmeister soll das für dich erledigen.',
    'WENN du Daten aus der Datenbank holen willst, DANN frag das Repository.',
    'findByName("Salami"): Zutat | null',
    ['Du verstehst ein Repository als Datenzugriff.','Du kannst eine Funktion aufrufen, statt SQL zu schreiben.'],
    ['key-value','contracts'],[
    'In Band 1 war das Regal eine Map. Jetzt steckt der Datenzugriff in einer Funktion. Du gibst ihr den Namen, sie liefert die Karte – oder `null`, wenn es sie nicht gibt.',
    'Die SQL-Abfrage steht nur an einer Stelle. Wenn sich die Datenbank ändert, musst du nicht die ganze Anwendung umbauen.',
    'WENN die Küche Zutaten braucht, DANN fragt sie das Repository – nie die Datenbank direkt. So bleibt die Arbeit geteilt.'
   ],"function findByName(name: string): Zutat | null {\n    const row = db.prepare('SELECT name, menge FROM zutat WHERE name = ?').get(name) as Zutat | undefined;\n    return row ?? null;\n}",'Die Zutat Salami oder null',
    'Was passiert, wenn es die Zutat nicht gibt?',
    'Ein Repository ist keine Liste. Du bekommst `Zutat | null` zurück, weil etwas fehlen kann – genau wie im Band 1.',
    'Du erhältst null und kannst mit `??` einen Ersatz wählen oder höflich melden, dass die Zutat fehlt.',
    [word('Repository','Die Funktion, die dir Daten aus der Datenbank holt.'),word('findByName','Suche nach dem eindeutigen Namen.')],
    'https://nodejs.org/api/sqlite.html'),

   chapter('migration','persist','Neues Fach im Regal',10,
    'Du willst später auch den Preis einer Zutat speichern. Die alte Tabelle hat dafür kein Fach.',
    'WENN sich die Daten ändern, DANN schreibe eine Migration – keine handwerkliche Änderung zwischendurch.',
    'ALTER TABLE zutat ADD COLUMN preis INT',
    ['Du verstehst Migrationen als geplante Umbauten.','Du erkennst, warum alte Daten erhalten bleiben.'],
    ['contracts','errors'],[
    'Stell dir vor, das Regal hat schon 20 Zutaten. Du kannst es nicht einfach wegwerfen. Du baust ein neues Fach ein – die alten Zettel bleiben liegen.',
    'So eine Änderung heißt Migration. Sie ist ein kleiner, beschriebener Schritt in einer Datei, den dein Programm beim Start mit `db.exec(...)` ausführt.',
    'WENN du ein Feld hinzufügst, DANN schreibst du eine neue Migration. SONST weiß dein Rechner von gestern nichts mehr.'
   ],"import { readFileSync } from 'node:fs';\n// 002_preis.sql\nALTER TABLE zutat ADD COLUMN preis INTEGER DEFAULT 0;\ndb.exec(readFileSync('002_preis.sql', 'utf8'));",'Neues Feld preis mit 0 bei alten Zutaten',
    'Warum ist der Standardwert 0 wichtig?',
    'Alte Datensätze haben das neue Feld noch nicht. Ohne Standardwert bleiben sie leer und alles könnte kaputtgehen.',
    'Weil alte Zutaten sonst keinen Preis hätten. Mit 0 kannst du trotzdem rechnen.',
    [word('Migration','Ein geplanter Umbau der Datenbank, der alte Daten erhält.'),word('Standardwert','Der Wert, den neue Felder am Anfang bekommen.')],
    'https://www.sqlite.org/lang_altertable.html'),

   chapter('login','auth','Der Gast meldet sich an',10,
    'Dein Laden soll wissen, wer gerade bestellt. Dazu gibt der Gast seinen Namen und ein Passwort ein.',
    'WENN ein Gast sich anmeldet, DANN prüfe Name und Passwort. SONST bleibt er ein Unbekannter.',
    'POST /login {name, passwort}',
    ['Du verstehst Anmeldung als Identitätsprüfung.','Du kennst den Unterschied zwischen Gast und Unbekanntem.'],
    ['contracts','errors'],[
    'Anmelden heißt: Der Gast sagt, wer er ist, und beweist es mit einem Passwort. Dein Programm sucht die Karte und vergleicht den Hash. Damit `req.body` die Daten enthält, steht vorher `app.use(express.json())`.',
    'Solange niemand angemeldet ist, darf die Anwendung nur öffentliche Seiten zeigen – zum Beispiel die Speisekarte. Die Prüfung sitzt im Service, nicht in der Oberfläche.',
    'WENN die Prüfung klappt, DANN darf der Gast bestellen. SONST bleibt er auf der Gästeseite.'
   ],"app.post('/login', async (req, res) => {\n    const gast = await findByName(req.body.name);\n    const ok = gast && await bcrypt.compare(req.body.passwort, gast.passwortHash);\n    res.json({ angemeldet: Boolean(ok) });\n});",'{"angemeldet":true}',
    'Welche Seite darf ein unbekannter Gast sehen?',
    'Anmelden ist nicht dasselbe wie registrieren. Hier prüfst du einen schon bekannten Gast.',
    'Nur öffentliche Seiten wie die Speisekarte. Bestellen darf er erst nach der Anmeldung.',
    [word('Anmeldung','Das Prüfen, ob ein Gast wirklich der ist, der er vorgibt.'),word('Identität','Wer eine Person wirklich ist.')],
    'https://github.com/kelektiv/node.bcrypt.js'),

   chapter('password','auth','Das Passwort darf nicht auf einem Zettel stehen',11,
    'Du willst Passwörter speichern. Wenn du sie einfach in die Datenbank schreibst, kann jeder sie lesen.',
    'WENN du ein Passwort speicherst, DANN speichere nur einen Hash. SONST kann es jeder lesen.',
    'hash = await bcrypt.hash(passwort, 10)',
    ['Du verstehst, warum Passwörter nie im Klartext stehen.','Du kennst einen Hash als Einweg-Abdruck.'],
    ['errors','contracts'],[
    'Ein Hash ist wie ein Fingerabdruck: Du kannst ihn prüfen, aber nicht daraus das Original nachbauen. Bei jeder Anmeldung wird das eingegebene Passwort neu gehasht und verglichen.',
    '`bcryptjs` macht das für dich: `hash` erzeugt den Abdruck, `compare` prüft ihn. Zwei gleiche Passwörter können verschiedene Hashes haben – das erschwert das Raten.',
    'WENN du ein Passwort speicherst, DANN benutze eine bewährte Bibliothek. SONST machst du einen gefährlichen Fehler.'
   ],"import bcrypt from 'bcryptjs';\nconst hash = await bcrypt.hash('geheim', 10);\nconst ok = await bcrypt.compare('geheim', hash);",'true',
    'Warum speicherst du nicht das Passwort selbst?',
    'Ein Hash ist kein Verschlüsseln mit Schlüssel. Du kannst ihn nicht wieder zurückverwandeln – genau das ist der Punkt.',
    'Weil sonst jeder, der die Datenbank liest, das Passwort kennt. Der Hash verrät es nicht.',
    [word('Hash','Ein Einweg-Abdruck eines Passworts.'),word('Klartext','Ein Text, den jeder direkt lesen kann.')],
    'https://github.com/kelektiv/node.bcrypt.js'),

   chapter('roles','auth','Gast, Küche, Chef',11,
    'Ein Gast darf bestellen, die Küche darf kochen, nur der Chef darf Preise ändern. Alle drei nutzen dieselbe Anwendung.',
    'WENN eine Aufgabe gefährlich ist, DANN darf sie nur eine bestimmte Rolle ausführen.',
    'app.put("/preis", nurChef, preisAendern)',
    ['Du verstehst Rollen als Rechtebündel.','Du kannst eine Route mit einer Rolle schützen.'],
    ['contracts','errors'],[
    'Eine Rolle ist wie ein Abzeichen: Gast, Küche oder Chef. Die Anwendung schaut auf das Abzeichen, bevor sie eine Aufgabe erlaubt.',
    'In Express ist das eine Middleware. Sie prüft `req.session.rolle`, antwortet mit 403 bei falscher Rolle und ruft sonst `next()` – erst dann läuft die Route weiter. Die Typen `Request`, `Response` und `NextFunction` importierst du aus `express`.',
    'WENN jemand eine geschützte Aufgabe aufruft, DANN prüft die Middleware die Rolle. SONST wird die Anfrage abgelehnt.'
   ],"function nurChef(req, res, next) {\n    if (req.session?.rolle !== 'CHEF') {\n        res.status(403).json({ fehler: 'Nur für Chef' }); return;\n    }\n    next();\n}\napp.put('/preis', nurChef, preisAendern);",'Nur für Chef aufrufbar',
    'Was passiert, wenn ein Gast diese Methode aufruft?',
    'Eine Rolle schützt nicht nur die Oberfläche. Die Prüfung sitzt vor der Route – ein Gast kann sie nicht überspringen.',
    'Express antwortet mit 403 und der Preis bleibt unverändert.',
    [word('Rolle','Ein Abzeichen, das bestimmte Rechte erlaubt.'),word('Middleware','Eine kleine Funktion vor der Route, die Anfragen prüft.')],
    'https://expressjs.com/en/guide/using-middleware.html'),

   chapter('session','auth','Der Gast bekommt ein Armband',10,
    'Nach der Anmeldung vergisst die Anwendung den Gast bei jeder neuen Anfrage wieder. Du brauchst ein Armband, das ihn erkennt.',
    'WENN ein Gast angemeldet ist, DANN merke es dir für die nächsten Anfragen.',
    'Set-Cookie: connect.sid=abc123',
    ['Du verstehst eine Session als Merkzettel für den Besuch.','Du kennst ein Cookie als kleines Armband im Browser.'],
    ['contracts'],[
    'Der Browser bekommt ein kleines Armband – ein Cookie mit der Nummer `connect.sid`. Bei jeder neuen Anfrage zeigt er es vor, und die Anwendung weiß wieder, wer da ist.',
    '`express-session` legt die Session auf dem Server ab. Im Cookie steht nur die Nummer dazu – wie eine Garderobenmarke. Der geheime Schlüssel kommt später aus der Umgebung.',
    'Damit TypeScript die Felder `gast` und `rolle` kennt, erweiterst du den Session-Typ einmal: `declare module "express-session" { interface SessionData { gast?: string; rolle?: string } }`. Das ist nur eine Beschreibung – der Server speichert die Daten weiterhin.',
    'WENN der Gast etwas bestellen will, DANN prüft die Anwendung das Armband. SONST gilt er als unbekannt.',
    'Im Beispiel steht `?? ""` nur, damit du es ausprobieren kannst. Im echten Laden darf das Geheimnis nicht leer sein – darum kümmert sich das Kapitel „Geheimnisse gehören nicht in den Code".'
   ],"import session from 'express-session';\nconst secret = process.env.SESSION_SECRET ?? '';\napp.use(session({ secret, resave: false, saveUninitialized: false }));\napp.get('/wer', (req, res) => res.json({ gast: req.session.gast ?? null }));",'{"gast":"Mia"}',
    'Wo liegt der Name des Gastes – im Browser oder auf dem Server?',
    'Ein Cookie ist kein Passwort und keine Datenbank. Es ist nur die Marke für die Garderobe.',
    'Auf dem Server in der Session. Der Browser trägt nur die Nummer dazu.',
    [word('Session','Ein Merkzettel auf dem Server für die Dauer eines Besuchs.'),word('Cookie','Ein kleines Armband im Browser mit der Session-Nummer.')],
    'https://github.com/expressjs/session'),

   chapter('logout','auth','Am Ende geht das Armband zurück',9,
    'Der Gast geht nach Hause. Der nächste Mensch am selben Rechner soll nicht seine Bestellungen sehen.',
    'WENN ein Gast sich abmeldet, DANN ungültig mache seine Session. SONST kann jemand anderes sie benutzen.',
    'POST /logout → Session ungültig',
    ['Du verstehst Abmelden als Aufräumen.','Du erkennst, warum Session-Daten nicht ewig leben dürfen.'],
    ['contracts','ownership'],[
    'Abmelden klingt unwichtig, ist aber sicherheitstechnisch entscheidend. Du gibst das Armband zurück und die Garderobe wirft den Zettel weg.',
    'Mit `req.session.destroy(...)` löscht du die Daten auf dem Server. `clearCookie` nimmt dem Browser die alte Nummer weg – sie führt dann zu nichts mehr.',
    'WENN ein Gast geht, DANN räume auf. SONST wird sein Platz von jemandem übernommen.'
   ],"app.post('/logout', (req, res) => {\n    req.session.destroy(err => {\n        if (err) { res.status(500).json({ fehler: 'Abmelden fehlgeschlagen' }); return; }\n        res.clearCookie('connect.sid').json({ abgemeldet: true });\n    });\n});",'{"abgemeldet":true}',
    'Was passiert nach dem Abmelden bei einer alten Anfrage?',
    'Abmelden löscht nicht die Datenbank. Es beendet nur die Zugehörigkeit des Gastes.',
    'Die alte Session gilt nicht mehr. Die Anwendung behandelt die Anfrage als unbekannt.',
    [word('Abmelden','Die Session beenden, damit niemand sie weiterbenutzen kann.'),word('ungültig','Nicht mehr erlaubt oder gültig.')],
    'https://github.com/expressjs/session'),

   chapter('error-contract','robust','Höfliche Fehler für alle',10,
    'Die Salami fehlt. Der Gast sieht eine technische Fehlerseite mit JavaScript-Wörtern. Das versteht niemand.',
    'WENN etwas schiefgeht, DANN antworte mit einer klaren, festen Meldung. SONST rät der Gast.',
    '{"fehler":"Salami fehlt im Regal"}',
    ['Du verstehst einen Fehlervertrag als feste Antwortform.','Du kannst eine Error-Klasse in eine verständliche Meldung übersetzen.'],
    ['errors','contracts'],[
    'Ein Fehlervertrag ist wie ein einheitliches Formular: Immer steht dort, was passiert ist – in Alltagssprache und im selben Format.',
    'Intern wirfst du `new Fehler("Salami fehlt im Regal")`. Eine Error-Klasse mit einem `status` landet in der Express-Fehler-Middleware (vier Argumente!) und wird dort zu `{ fehler: ... }`. Die Typen der Argumente importierst du aus `express`. Der Gast sieht keinen Code.',
    'WENN intern etwas schiefgeht, DANN fange es ab und antworte höflich. SONST sieht der Gast den Fehler direkt.'
   ],"class Fehler extends Error {\n    constructor(meldung: string, readonly status = 400) { super(meldung); }\n}\napp.use((err: Fehler, _req: Request, res: Response, _next: NextFunction) => {\n    res.status(err.status ?? 500).json({ fehler: err.message });\n});",'{"fehler":"Salami fehlt im Regal"}',
    'Warum solltest du die technische Meldung nicht direkt zeigen?',
    'Ein Fehlervertrag ändert nicht den Fehler, sondern nur die Art, wie du ihn nach außen zeigst.',
    'Weil sie für Gäste unverständlich und manchmal sogar gefährlich ist. Die höfliche Meldung sagt das Nötige.',
    [word('Fehlervertrag','Eine feste Form für Fehlermeldungen, die alle verstehen.'),word('Fehler-Middleware','Eine Stelle in Express, die Fehler sammelt und übersetzt.')],
    'https://expressjs.com/en/guide/error-handling.html'),

   chapter('validation','robust','Prüfen, bevor es in die Küche geht',10,
    'Ein Gast bestellt „minus drei Pizzen". Die Küche weiß nicht, was sie tun soll. Du musst die Bestellung vorher prüfen.',
    'WENN Daten in die Anwendung kommen, DANN prüfe sie zuerst. SONST arbeitet die Küche mit Unsinn.',
    'pruefen(b): string | null',
    ['Du verstehst Validierung als Eingangskontrolle.','Du kannst Regeln wie "mindestens 1" als Funktion schreiben.'],
    ['errors','contracts'],[
    'Validierung ist wie ein Türsteher: Er lässt nur gültige Bestellungen hinein. Negativzahlen oder leere Namen kommen gar nicht erst in die Küche.',
    'In TypeScript schreibst du die Erwartung als Typ und die Prüfung als Funktion. `null` bedeutet „alles gut", ein Text bedeutet „hier ist das Problem".',
    'WENN die Prüfung scheitert, DANN antwortest du mit einem klaren Fehler. SONST gibst du ungültige Daten weiter.'
   ],"type Bestellung = { readonly pizza: string; readonly anzahl: number };\nfunction pruefen(b: Bestellung): string | null {\n    if (!b.pizza.trim()) return 'Pizza fehlt';\n    if (!Number.isInteger(b.anzahl) || b.anzahl < 1) return 'Anzahl muss mindestens 1 sein';\n    return null;\n}",'Ungültige Bestellung wird abgelehnt',
    'Welche Regel brauchst du für den Pizza-Namen?',
    'Validierung prüft die Form der Daten, nicht ob die Pizza im Regal ist. Das kommt danach.',
    'Der Name darf nicht leer sein. Zusammen mit „mindestens 1" ist die Bestellung gültig.',
    [word('Validierung','Das Prüfen von Daten, bevor sie weiterverarbeitet werden.'),word('Gültig','Ein Wert, der allen Regeln entspricht.')],
    'https://www.typescriptlang.org/docs/handbook/2/basic-types.html'),

   chapter('retry','robust','Der Lieferant ist gerade nicht erreichbar',11,
    'Deine Anwendung fragt einen Lieferanten. Kurz ist das Netz weg. Beim ersten Fehler willst du nicht gleich aufgeben.',
    'WENN eine Anfrage kurz scheitert, DANN versuche es noch einmal mit einer Pause. SONST bricht der Laden ab.',
    'WENN Fehler: warte kurz, versuche erneut',
    ['Du verstehst Wiederholung als Schutz vor vorübergehenden Fehlern.','Du kennst eine Pause zwischen Versuchen.'],
    ['errors','async'],[
    'Nicht jeder Fehler ist dauerhaft. Wenn der Lieferant gerade telefoniert, hilft eine zweite Anfrage nach kurzer Zeit.',
    'Du schreibst eine kleine Funktion mit `for`, `try/catch` und `await new Promise(r => setTimeout(r, 200))`. Der Typparameter `T` erlaubt verschiedene Antworten – Zutaten oder Preise.',
    'WENN der Fehler verschwindet, DANN läuft alles weiter. SONST bekommst du nach drei Versuchen eine verständliche Meldung.'
   ],"async function mitWiederholung<T>(frage: () => Promise<T>, versuche = 3): Promise<T> {\n    for (let i = 0; i < versuche; i++) {\n        try { return await frage(); } catch { await new Promise(r => setTimeout(r, 200)); }\n    }\n    throw new Fehler('Lieferant nicht erreichbar', 503);\n}",'Nach maximal drei Versuchen eine Antwort',
    'Warum nicht unendlich oft versuchen?',
    'Wiederholen ist kein Heilmittel für falsche Daten. Wenn etwas dauerhaft kaputt ist, musst du es melden.',
    'Sonst hängt die Anwendung für immer. Nach drei Versuchen ist die Information „nicht erreichbar" ehrlicher.',
    [word('Wiederholung','Ein Fehler wird noch einmal versucht, meist nach einer kurzen Pause.'),word('vorübergehend','Nur kurzzeitig – nicht für immer.')],
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch'),

   chapter('logging','robust','Ein Tagebuch für den Laden',10,
    'Am Morgen sagt jemand: „Gestern um 18 Uhr war die Bestellung falsch." Du weißt nichts mehr – es gab kein Tagebuch.',
    'WENN etwas im Betrieb passiert, DANN schreibe eine kurze Notiz mit Zeitpunkt. SONST kannst du es später nicht nachvollziehen.',
    'console.info("[INFO]", zeit, meldung)',
    ['Du verstehst Logging als Tagebuch der Anwendung.','Du kannst eine Information mit Zeitstempel festhalten.'],
    ['errors','contracts'],[
    'Ein Log ist ein Tagebuch für den Computer. Statt „ich hab da mal was gesehen" steht dort: Uhrzeit, was passiert ist, welche Pizza bestellt wurde.',
    'Node.js schreibt mit `console.info` und `console.warn` auf die Konsole. `new Date().toISOString()` liefert den Zeitpunkt. In großen Anwendungen kann später ein Werkzeug wie pino daraus werden.',
    'WENN du später etwas suchen willst, DANN hilft dir ein gutes Log. SONST rätst du wieder.'
   ],"console.info('[INFO]', new Date().toISOString(), 'Bestellung angenommen:', pizza);\nconsole.warn('[WARN]', new Date().toISOString(), 'Salami fehlt im Regal');",'Zwei Zeilen im Tagebuch',
    'Schreibe eine Log-Zeile für eine abgelehnte Bestellung.',
    'Logging ist nicht dasselbe wie eine Ausgabe an den Gast. Der Gast soll höfliche Meldungen sehen, das Log ist für dich.',
    'Zum Beispiel: console.warn("[WARN]", new Date().toISOString(), "Bestellung abgelehnt").',
    [word('Log','Ein Tagebuch mit Notizen aus der laufenden Anwendung.'),word('Zeitstempel','Die Uhrzeit, die zu einer Notiz gespeichert wird.')],
    'https://nodejs.org/api/console.html'),

   chapter('health','robust','Ist der Laden noch offen?',9,
    'Du willst von außen schnell wissen, ob deine Anwendung noch läuft oder schon umgefallen ist.',
    'WENN jemand nach dem Zustand fragt, DANN antworte mit einem kurzen Statusbericht.',
    'GET /health → {"status":"UP"}',
    ['Du kennst einen Health-Check als kurzen Puls.','Du verstehst, dass "UP" = läuft bedeutet.'],
    ['contracts'],[
    'Ein Health-Check ist wie ein Blick auf die Tür: Ist offen? Dann antwortet die Anwendung mit `UP`.',
    'Bei Spring Boot gibt es dafür Actuator. In Express schreibst du einfach eine kleine Route – genau die Adresse, die dein Überwachungswerkzeug aufruft.',
    'WENN ein Überwachungswerkzeug fragt, DANN antwortet dein Laden mit seinem Zustand. SONST weiß niemand, ob er noch da ist.'
   ],"app.get('/health', (_req, res) => {\n    res.json({ status: 'UP' });\n});",'{"status":"UP"}',
    'Was würde eine kaputte Anwendung antworten?',
    'Ein Health-Check ersetzt keine Fehlerbehandlung. Er sagt nur, ob die Anwendung erreichbar ist.',
    'Gar nichts oder eine Fehlermeldung. Genau das ist das Signal für den Betrieb.',
    [word('Health-Check','Eine kurze Anfrage, die fragt: Läuft die Anwendung noch?'),word('UP','Der Zustand „läuft" beim Health-Check.')],
    'https://expressjs.com/en/guide/routing.html'),

   chapter('unit-repeat','testing','Jeden Morgen dieselbe Prüfung',10,
    'Du hast in Band 1 einen Test geschrieben. Du willst ihn nicht mehr von Hand starten.',
    'WENN du eine Regel änderst, DANN lasse alle Tests automatisch laufen.',
    'npm test → node --test',
    ['Du verstehst automatisierte Tests als Sicherheitsnetz.','Du kannst mehrere Prüfungen mit einem Befehl starten.'],
    ['errors','contracts'],[
    'Ein Test, den du nur manuell startest, wird bald vergessen. Mit `npm test` und dem eingebauten `node:test`-Läufer laufen alle Prüfungen nacheinander.',
    'Du schreibst für jede wichtige Regel einen Test: Preis, Rabatt, Grenzfälle. Wenn einer scheitert, siehst du sofort, wo.',
    'WENN grün, DANN ist alles wie erwartet. SONST weißt du, welche Regel kaputt ist.'
   ],"import test from 'node:test';\nimport assert from 'node:assert/strict';\ntest('rabatt bei null', () => { assert.equal(0, rabatt(0)); });",'Test bestanden',
    'Warum testest du auch den Wert 0?',
    'Ein Test prüft nur, was du hinschreibst. Das ist der Grund, warum du Grenzfälle aktiv ergänzen musst.',
    'Weil dort oft Fehler entstehen – zum Beispiel eine Division oder ein leeres Feld.',
    [word('Automatisiert','Läuft von selbst, ohne dass du jedes Mal daran denken musst.'),word('Sicherheitsnetz','Tests, die dich auffangen, wenn du etwas kaputt machst.')],
    'https://nodejs.org/api/test.html'),

   chapter('integration','testing','Zusammen statt einzeln',11,
    'Alle Einzelteile funktionieren – aber bestellt die Anwendung am Ende auch wirklich? Du musst sie zusammen prüfen.',
    'WENN du die ganze Anwendung prüfen willst, DANN schicke im Test echte Anfragen an sie.',
    'request(app).post("/bestellung")',
    ['Du verstehst einen Integrationstest als Prüfung des Zusammenspiels.','Du kennst eine Anfrage ohne echten Browser.'],
    ['contracts','errors'],[
    'Ein Unit-Test prüft eine kleine Regel. Ein Integrationstest prüft, ob Controller, Service und Regal zusammenarbeiten.',
    'Du exportierst deine Express-App und gibst sie an `supertest`. Das Werkzeug schickt Anfragen an die App, ohne dass ein Browser oder ein Port nötig ist.',
    'WENN die Antwort stimmt, DANN funktioniert das Zusammenspiel. SONST ist eine Verbindung kaputt.'
   ],"import request from 'supertest';\nawait request(app).post('/bestellung').send({ pizza: 'Salami', anzahl: 1 }).expect(200);",'Zusammenspiel geprüft',
    'Was prüft ein Integrationstest, was ein Unit-Test nicht prüft?',
    'Ein Integrationstest ist langsamer als ein Unit-Test. Deshalb benutzt du beide – nicht nur einen.',
    'Ob die Rollen miteinander sprechen. Der Unit-Test prüft nur eine Regel für sich.',
    [word('Integrationstest','Ein Test, der mehrere Teile zusammen prüft.'),word('supertest','Ein Werkzeug, das HTTP-Anfragen an eine App simuliert.')],
    'https://github.com/ladjs/supertest'),

   chapter('edge-cases','testing','Die fiesen Fälle',10,
    'Der Test mit drei Pizzen klappt. Mit null Pizzen oder einer leeren Bestellung nicht. Du musst die Ränder prüfen.',
    'WENN du einen Test schreibst, DANN denke auch an die extremen Werte.',
    '0, -1, leer, doppelt',
    ['Du kannst Grenzfälle gezielt als Tests formulieren.','Du verstehst, warum "normal" nicht genug ist.'],
    ['errors','uniqueness'],[
    'Grenzfälle sind die Ränder: 0 statt 3, -1 statt 1, ein leerer Name, dieselbe Zutat zweimal. Genau dort passieren die meisten Fehler.',
    'Du schreibst für jeden Rand einen eigenen Test mit `node:test`. Das klingt viel, ist aber nur eine Liste kleiner Regeln.',
    'WENN alle Grenzfälle bestehen, DANN kannst du dem Laden eher trauen. SONST bleibt ein Risiko.'
   ],"test('keine Pizza', () => { assert.equal(0, anzahl('')); });\ntest('negativ', () => { assert.equal(true, ungueltig(-1)); });\ntest('doppelt', () => { assert.equal(1, new Set(['Salami', 'Salami']).size); });",'Drei weitere grüne Tests',
    'Finde einen dritten Grenzfall für die Zutatenliste.',
    'Grenzfälle sind keine seltenen Wünsche. Sie kommen im echten Betrieb überraschend oft vor.',
    'Zum Beispiel dieselbe Zutat zweimal in einer Bestellung – die Set darf sie nur einmal zählen.',
    [word('Grenzfall','Ein extremer Wert am Rand des erlaubten Bereichs.'),word('Erwartung','Das Ergebnis, das du von einem Test erwartest.')],
    'https://nodejs.org/api/test.html'),

   chapter('ci','testing','Der Prüfer nach jedem Speichern',10,
    'Du willst nicht daran denken müssen, Tests zu starten. Jeder Speichervorgang soll sie automatisch prüfen.',
    'WENN du Code speicherst, DANN lasse einen Automaten alle Tests laufen.',
    'on: push → npm test',
    ['Du verstehst CI als automatischen Prüfer.','Du kennst eine einfache Workflow-Datei.'],
    ['errors','contracts'],[
    'CI heißt: Die Prüfung läuft auf einem anderen Rechner, sobald du deinen Code hochlädst. Du bekommst grün oder rot zurück.',
    'Die Regeln stehen in einer kleinen Datei unter `.github/workflows/`. `actions/setup-node` installiert Node.js, `npm ci` nutzt die eingecheckte `package-lock.json`, dann laufen `npx tsc --noEmit` und `npm test`.',
    'WENN alles grün ist, DANN darf der Code weiter. SONST siehst du sofort, welcher Test scheitert.'
   ],'name: pruefen\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm ci && npx tsc --noEmit\n      - run: npm test','Automatisches Testergebnis',
    'Was passiert bei einem roten Test?',
    'CI ist nicht die Auslieferung selbst. Sie ist nur die automatische Prüfung vor der Auslieferung.',
    'Der Code wird nicht weitergegeben. Du musst den Fehler beheben und erneut speichern.',
    [word('CI','Automatische Prüfung von Code nach jedem Speichern.'),word('Workflow','Eine Datei mit den Schritten für den Automaten.')],
    'https://docs.github.com/en/actions'),

   chapter('docker','delivery','Die Pizzeria in einer Kiste',11,
    'Du willst deine Anwendung einem Freund geben. Bei ihm fehlt Node.js oder die Einstellungen sind anders.',
    'WENN du eine Anwendung übergeben willst, DANN packe sie mit ihrer Umgebung in eine Kiste.',
    'FROM node:22-alpine\nCMD ["node", "dist/server.js"]',
    ['Du verstehst einen Container als fertige Kiste.','Du kennst ein Dockerfile als Bauanleitung.'],
    ['ownership','contracts'],[
    'Ein Container ist wie eine Umzugskiste: Die Anwendung und alles, was sie braucht, sind drin. Dein Freund muss nur die Kiste öffnen.',
    'Die Bauanleitung heißt Dockerfile. Das Bild `node:24-alpine` bringt die Laufzeit mit; `npm ci` installiert die Pakete. `npm run build` erzeugt vorher aus TypeScript JavaScript, `CMD` startet den Server.',
    'WENN die Kiste gebaut ist, DANN läuft sie überall gleich. SONST heißt es „bei mir geht es, bei dir nicht".'
   ],'FROM node:24-alpine\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY dist/ ./dist/\nCMD ["node", "dist/server.js"]','Ein lauffähiges Image',
    'Was wäre ohne Container anders?',
    'Ein Container enthält die Laufzeitumgebung, aber keine Geheimnisse. Die kommen später dazu.',
    'Du müsstest Node.js und Einstellungen auf jedem Rechner neu einrichten – und hättest mehr Fehlerquellen.',
    [word('Container','Eine fertige Kiste mit Anwendung und Umgebung.'),word('Dockerfile','Die Bauanleitung für so eine Kiste.')],
    'https://docs.docker.com/get-started/'),

   chapter('profiles','delivery','Zwei Küchen: zu Hause und im Betrieb',10,
    'Zu Hause benutzt du eine Datenbank im Speicher. Im Betrieb soll eine echte Datei oder ein Server laufen. Du willst den Code nicht ändern.',
    'WENN Umgebungen verschieden sind, DANN gib ihnen eigene Profile.',
    'NODE_ENV=dev|prod',
    ['Du verstehst Profile als verschiedene Einstellungssätze.','Du kannst zwischen dev und prod umschalten.'],
    ['contracts'],[
    'Ein Profil ist wie eine Schublade mit Einstellungen. In `dev` nutzt du `node:sqlite` mit `:memory:`, in `prod` eine Datei oder einen echten Datenbankserver.',
    'Der Code bleibt gleich. Du sagst nur beim Start mit `NODE_ENV=prod npm start`, welche Schublade gilt. `process.env.NODE_ENV` liest den Wert.',
    'WENN du die Umgebung wechselst, DANN änderst du nur das Profil. SONST baust du zwei Versionen.'
   ],"const profil = process.env.NODE_ENV ?? 'dev';\nconst config = profil === 'prod'\n    ? { db: 'pizzeria.db' }\n    : { db: ':memory:' };\nconsole.log('Profil:', profil, config.db);",'Passende Einstellungen pro Profil',
    'Welches Profil nutzt du zum Entwickeln?',
    'Profile ersetzen keine Geheimnisse. Passwörter gehören nicht in den Code.',
    'Das Profil `dev`. Für den echten Betrieb wird `prod` aktiviert.',
    [word('Profil','Ein Satz Einstellungen für eine Umgebung.'),word('dev','Die Umgebung, in der du entwickelst.')],
    'https://nodejs.org/api/process.html'),

   chapter('secrets','delivery','Geheimnisse gehören nicht in den Code',10,
    'Das Passwort für deine Anwendung steht in einer Datei. Du willst sie einem Freund geben – ohne ihm das Passwort zu verraten.',
    'WENN etwas geheim ist, DANN lies es aus der Umgebung. SONST steht es im Code.',
    'SESSION_SECRET=${...}',
    ['Du verstehst Umgebungsvariablen als externe Geheimnisse.','Du erkennst, warum Passwörter nicht ins Repository gehören.'],
    ['errors','ownership'],[
    'Ein Geheimnis ist wie ein Schlüssel, den du nicht auf die Tür schreibst. Du gibst ihn der Anwendung beim Start – von außen.',
    '`process.env.SESSION_SECRET` liest den Wert. Fehlt er, beendest du den Start mit einem klaren Fehler. Eine lokale `.env`-Datei bleibt durch `.gitignore` außen vor.',
    'WENN du die Anwendung weitergibst, DANN bleiben deine Geheimnisse bei dir. SONST hat sie jeder.'
   ],"const secret = process.env.SESSION_SECRET;\nif (!secret) {\n    throw new Error('SESSION_SECRET fehlt – App startet nicht');\n}\napp.use(session({ secret, resave: false, saveUninitialized: false }));",'Geheimnis kommt von außen',
    'Was passiert, wenn die Variable fehlt?',
    'Ein Platzhalter ist kein Standardwert. Wenn niemand den Wert gibt, startet die Anwendung nicht – das ist gewollt.',
    'Die Anwendung startet nicht oder meldet einen Fehler. Du merkst sofort, dass etwas fehlt.',
    [word('Geheimnis','Ein Wert, den niemand außer der Anwendung sehen soll.'),word('Umgebungsvariable','Ein Wert, den du dem Programm beim Start von außen gibst.')],
    'https://nodejs.org/api/process.html'),

   chapter('frontend','frontend','Ein Fenster für Gäste',11,
    'Deine Pizzeria antwortet mit JSON. Gäste wollen aber etwas ansehen, ohne JSON zu lesen.',
    'WENN ein Gast die Anwendung nutzen will, DANN zeige ihm eine einfache Seite.',
    'fetch("/pizzen").then(...)',
    ['Du verstehst, dass eine Seite Daten vom Server holen kann.','Du kennst fetch als Anfrage aus dem Browser.'],
    ['contracts','async'],[
    'Ein kleines HTML-Fenster kann deine API fragen: „Gib mir die Pizzen." Der Browser holt das JSON und zeigt es als Liste.',
    'In TypeScript sagst du `const pizzen: string[] = await res.json()`. Das ist nur eine Zusatzinformation für dich – beim Ausführen wird daraus ganz normales JavaScript.',
    'WENN der Gast die Seite öffnet, DANN fragt sie die Daten ab. SONST sieht er eine leere Liste.'
   ],"async function ladePizzen(): Promise<void> {\n    const res = await fetch('/pizzen');\n    const pizzen: string[] = await res.json();\n    document.body.innerText = pizzen.join(', ');\n}",'Salami, Käse, Pilze',
    'Wo stehen die Regeln für die Pizzen?',
    'Das Frontend soll keine Preise berechnen. Es zeigt nur, was der Server ihm gibt.',
    'Auf dem Server. Die Seite zeigt nur das Ergebnis.',
    [word('Frontend','Der Teil, den der Gast im Browser sieht.'),word('fetch','Eine Anfrage aus dem Browser an den Server.')],
    'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API'),

   chapter('go-live','frontend','Der erste echte Gast',12,
    'Die Anwendung läuft, die Tests sind grün, die Daten bleiben gespeichert. Jetzt darf sie jemand anderes benutzen.',
    'WENN alles geprüft ist, DANN kannst du deine Pizzeria veröffentlichen. SONST behebe zuerst die offenen Punkte.',
    'Checkliste: Tests grün · Profil prod · Geheimnisse extern · Health-Check OK',
    ['Du kannst eine Veröffentlichungs-Checkliste anwenden.','Du verstehst, dass Betrieb mehr ist als "es läuft".'],
    ['contracts','errors','ownership'],[
    'Geh die Liste durch: Tests grün, richtige Einstellungen, keine Passwörter im Code, Health-Check erreichbar. Dann ist dein Laden bereit.',
    'Band 1 hat dir beigebracht, wie man Regeln in TypeScript übersetzt. Band 2 hat gezeigt, was ein Programm braucht, um für andere zu funktionieren: Node.js, Express, SQLite, Tests und eine Kiste zum Ausliefern.',
    'WENN ein echter Gast kommt, DANN beobachtest du erst einmal. SONST übersiehst du, was er wirklich braucht.'
   ],"GET /health → {\"status\":\"UP\"}\nGET /pizzen → [\"Salami\",\"Käse\"]\nnpm test → grün\nNODE_ENV=prod · Geheimnisse extern",'Deine Pizzeria ist erreichbar',
    'Was würdest du als erstes beobachten, wenn ein Gast den Laden nutzt?',
    'Veröffentlichen ist kein Endpunkt, sondern ein Übergang. Du darfst weiter lernen und verbessern.',
    'Ob er die Speisekarte findet und versteht, was passiert. Danach kommen neue Wünsche – und Band 3.',
    [word('Veröffentlichung','Die Anwendung anderen Menschen zugänglich machen.'),word('Checkliste','Eine Liste mit Punkten, die du vorher prüfst.')],
    'https://expressjs.com/en/advanced/best-practice-security.html')
  ]
};

export function validateTypeScriptOperationsBook(book:TypeScriptBeginnerBook=PIZZERIA_TYPESCRIPT_OPERATIONS_BOOK):readonly string[]{
  return validateTypeScriptBook(book);
}
