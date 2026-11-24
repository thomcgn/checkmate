/**
 * Band 1 der TypeScript-Einsteigerreihe: derselbe Pizzeria-Fall wie im Java-Band,
 * aber mit TypeScript-Werkzeugen erzählt. Die Kapitelzahl, die Stufen und die
 * didaktischen Felder bleiben gleich; Kapitel 5–37 liegen in
 * pizzeria-typescript-lessons.ts.
 */
import {validateBeginnerBook} from './pizzeria-book.ts';
import type {BeginnerBook,BeginnerChapter,BeginnerWord} from './pizzeria-book.ts';
import {PIZZERIA_TYPESCRIPT_LESSONS} from './pizzeria-typescript-lessons.ts';

export type TypeScriptBeginnerBook=BeginnerBook;
export type TypeScriptBeginnerChapter=BeginnerChapter;
export type TypeScriptBeginnerWord=BeginnerWord;

const stage=(id:string,title:string,goal:string)=>({id,title,goal});
const plan=(id:string,stageId:string,title:string,minutes:number,problem:string,natural:string,pseudo:string,
  objectives:readonly string[],conceptIds:readonly string[],sourceUrl='https://www.typescriptlang.org/docs/'):BeginnerChapter=>
  ({id,stage:stageId,title,minutes,problem,rule:{natural,pseudo},objectives,conceptIds,explain:[],tryIt:'',
   misconception:'',solution:'',wordbank:[],sourceUrl});
const detailed=(chapter:BeginnerChapter,explain:readonly string[],wordbank:readonly BeginnerWord[],
  options:{code?:string;output?:string;tryIt:string;misconception:string;solution:string}):BeginnerChapter=>
  ({...chapter,explain,wordbank,...options});

const BASE_BOOK:TypeScriptBeginnerBook={
  title:'Die Pizzeria – von der Regel zum Programm',
  subtitle:'Band 1: TypeScript für Neulinge, erklärt an echten Alltagsproblemen',
  audience:'Für Schülerinnen und Schüler ab Klasse 7 – noch nie programmiert? Genau richtig.',
  scenario:'Du eröffnest eine Pizzeria. In jedem Kapitel löst du ein echtes Problem deines Ladens – vom ersten Gast bis zur kleinen Bestell-App.',
  stages:[
   stage('thinking','Stufe 0 · Ohne Computer denken','Regeln, Zustände und Reihenfolge zuerst – ganz in Deutsch.'),
   stage('first','Stufe 1 · Erste Befehle','Dein erster Code. Kurz, lesbar, sofort ausprobiert.'),
   stage('repeat','Stufe 2 · Wiederholen','Für jede Zutat und immer wieder – Schleifen und Listen.'),
   stage('values','Stufe 3 · Dinge bündeln','Zutatenkarten, readonly-Felder und Wertgleichheit.'),
   stage('typed','Stufe 4 · Box mit Etikett','Generics: eine Box für Salami, Käse und Pilze.'),
   stage('recipes','Stufe 5 · Rezepte & Rollen','Funktionen, Klassen und Arbeitsteilung in der Küche.'),
   stage('shelves','Stufe 6 · Regal & Gäste','Maps, Sets und Ketten für Bestand und Preise.'),
   stage('errors','Stufe 7 · Wenn schiefgeht','Fehlende Zutaten, höfliche Fehler und erste Tests.'),
   stage('app','Stufe 8 · Vom Programm zur Anwendung','Dateien, npm, HTTP – dein Laden bekommt eine Struktur.'),
   stage('spring','Stufe 9 · Express-Praxis','Der Restaurantleiter verteilt die Rollen: deine erste Web-App.'),
   stage('capstone','Abschluss · Die Pizzeria-API','Alles zusammen in einem kleinen Projekt.')
  ],
  chapters:[
   detailed(plan('first-guest','thinking','Der erste Gast',8,
    'Mia kommt in deine Pizzeria und sagt: „Eine Pizza bitte." Du musst drei Dinge in der richtigen Reihenfolge tun – was passiert, wenn du einfach losbackst?',
    'WENN ein Gast bestellt, DANN schreibe die Bestellung auf, DANN prüfe die Zutaten, DANN backe. SONST weißt du nicht, was du backen sollst.',
    'WENN Gast bestellt: Bestellung aufschreiben → Zutaten prüfen → Pizza backen',
    ['Du kannst Schritte in eine sinnvolle Reihenfolge bringen.','Du erkennst, warum eine Regel vor der Arbeit stehen muss.'],
    ['variables']),[
    'Eine Pizzeria ist wie ein Kochrezept: Erst liest du, was gebraucht wird, dann holst du die Zutaten, dann gehst du an den Ofen. Wenn du die Schritte vertauschst, backst du am Ende vielleicht etwas, das niemand bestellt hat.',
    'Computer arbeiten genauso. Sie machen brav, was du ihnen sagst – aber in der Reihenfolge, die du vorgibst. Deshalb ist das wichtigste Werkzeug am Anfang kein schwieriger Befehl, sondern eine gute Regel auf Deutsch.',
    'Schritt für Schritt heißt: ein Gedanke nach dem anderen. Genau das üben wir heute, noch ohne Programmiersprache.'
   ],[
    {term:'Reihenfolge',definition:'Die Ordnung, in der Schritte ausgeführt werden. Vertauscht man sie, kommt etwas anderes heraus.'},
    {term:'Bestellung',definition:'Die Information, was ein Gast möchte. Ohne sie weiß die Küche nicht, was sie tun soll.'}
   ],{tryIt:'Schreibe die drei Schritte für einen Gast auf, der ein Wasser bestellt. Welche Schritte sind anders als bei einer Pizza?',
    misconception:'Viele denken, man kann einfach losbacken. Der Computer braucht aber zuerst die Information, was er überhaupt backen soll.',
    solution:'1. Wasser notieren. 2. Ein Glas nehmen. 3. Wasser eingießen. Erst danach servieren.'}),

   detailed(plan('name-for-stock','thinking','Ein Namensschild für den Bestand',9,
    'Im Regal liegen drei Käsepakete. Du willst sie dir merken, ohne ständig neu zu zählen. Du sagst: „bestand ist 3." Dieses Wort ist ein Namensschild.',
    'WENN du dir eine Zahl merken willst, DANN gib ihr einen Namen. SONST musst du sie immer wieder neu zählen.',
    'bestand = 3',
    ['Du kannst einem Wert einen Namen geben.','Du verstehst, dass der Name etwas anderes ist als die Zahl selbst.'],
    ['variables'],'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html'),[
    'Stell dir ein Regal vor. An jedem Fach klebt ein Zettel: „Käse: 3". Der Zettel ist der Name, die Zahl darauf ist der Wert. Wenn du morgen nachschaust, liest du den Zettel statt neu zu zählen.',
    'In TypeScript heißt so ein Zettel eine Variable. Mit `let` darf der Wert später wechseln: heute 3 Käsepakete, morgen 2. Das `: number` dahinter ist nur ein Etikett für die Art des Wertes.',
    'Wir schreiben das so: `let bestand: number = 3;`. TypeScript prüft beim Schreiben, ob wirklich eine Zahl hineinkommt – und warnt dich, wenn du versehentlich Text hineingibst.'
   ],[
    {term:'Variable',definition:'Ein Name für einen Wert, den du später wiederfinden und verändern kannst.'},
    {term:'Typ',definition:'Das Etikett am Namen. Es sagt, welche Art von Wert erlaubt ist – hier eine Zahl.'}
   ],{code:'let bestand: number = 3;\nconsole.log(bestand);',output:'3',
    tryIt:'Ändere die 3 in eine 5. Was gibt das Programm jetzt aus?',
    misconception:'`let` erlaubt einen neuen Wert, `const` bindet den Namen fest. Das `: number` ist kein Wert, sondern nur die Beschriftung des Zettels.',
    solution:'Das Programm gibt dann 5 aus. Der Name bleibt `bestand`, nur der Wert hinter dem Namen hat sich geändert.'}),

   detailed(plan('rain-rule','thinking','WENN es regnet, DANN Schirm',10,
    'Du verlässt das Haus. Es regnet. WENN es regnet, nimmst du den Schirm. SONST wirst du nass. Diese Regel kennst du schon – jetzt schreiben wir sie für den Computer auf.',
    'WENN es regnet, DANN nimm den Regenschirm, SONST wirst du halt nass.',
    'WENN regnet: Schirm nehmen\nSONST: nass werden',
    ['Du kannst eine Alltagsregel als WENN/DANN/SONST schreiben.','Du verstehst, dass nur ein Zweig ausgeführt wird.'],
    ['conditionals'],'https://www.typescriptlang.org/docs/handbook/2/narrowing.html'),[
    'Diese Regel ist der wichtigste Satz in diesem Buch. Alles andere baut darauf auf. Es gibt eine Bedingung („regnet?"), einen ersten Weg („Schirm nehmen") und einen zweiten Weg („nass werden").',
    'Der Computer prüft die Bedingung. Ist sie wahr, geht er den DANN-Weg. Ist sie falsch, geht er den SONST-Weg. Beide gleichzeitig geht nicht – genau wie im echten Leben.',
    'In TypeScript heißt „WENN" einfach `if`. Das `else` ist das „SONST". Das `: boolean` bei `regnet` sagt: hier darf nur wahr oder falsch stehen.'
   ],[
    {term:'Bedingung',definition:'Eine Frage, die nur mit wahr oder falsch beantwortet wird – hier: Regnet es?'},
    {term:'Zweig',definition:'Einer der Wege, die ein Programm nehmen kann. Bei if/else ist es genau einer von zwei.'}
   ],{code:"const regnet: boolean = true;\nif (regnet) {\n    console.log('Schirm nehmen');\n} else {\n    console.log('Nass werden');\n}",output:'Schirm nehmen',
    tryIt:'Setze `regnet` auf `false`. Welcher Satz erscheint jetzt?',
    misconception:'`else` gehört immer zum letzten `if` davor – nicht zu irgendeiner anderen Zeile. Und die Bedingung muss wahr oder falsch sein, nicht „vielleicht".',
    solution:'Bei `false` erscheint „Nass werden". Der erste Zweig wird übersprungen.'}),

   detailed(plan('enough-salami','thinking','Sind genug Zutaten da?',9,
    'Du hast drei Salami-Portionen im Regal. Ein Gast will zwei. Reicht das? Du sagst: „3 ist größer oder gleich 2 – ja." Genau so fragt der Computer.',
    'WENN der Bestand mindestens so groß ist wie die Bestellung, DANN verkaufen, SONST nachbestellen.',
    'WENN bestand >= gewuenscht: verkaufen\nSONST: nachbestellen',
    ['Du kannst Zahlen vergleichen.','Du verstehst das Zeichen >= und warum es die Gleichheit einschließt.'],
    ['conditionals','equality'],'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html'),[
    'Vergleiche sind überall im Alltag: Reicht das Geld? Passt der Stuhl? Ist genug Platz im Bus? Der Computer benutzt dafür Zeichen wie `>`, `<` und `>=`.',
    '`>=` heißt „größer oder gleich". Bei 3 Salami und 2 gewünscht ist die Antwort wahr. Bei genau 2 ist sie auch wahr – der Gast darf alles haben.',
    'Zusammen mit `if` wird daraus eine fachliche Regel für deine Pizzeria. `console.log` zeigt dir das Ergebnis auf dem Bildschirm, und du kannst dich auf das Backen konzentrieren.'
   ],[
    {term:'Vergleich',definition:'Eine Prüfung, die wahr oder falsch ergibt – zum Beispiel 3 >= 2.'},
    {term:'>=',definition:'Größer oder gleich. Bei 2 >= 2 ist die Aussage wahr.'}
   ],{code:'const bestand: number = 3;\nconst gewuenscht: number = 2;\nconsole.log(bestand >= gewuenscht);',output:'true',
    tryIt:'Ändere `gewuenscht` auf 4. Was gibt das Programm aus?',
    misconception:'`=` ist eine Zuweisung, keine Vergleichsfrage. Zum Vergleichen benutzt du `===`, `>` oder `>=`.',
    solution:'Bei 4 ist 3 >= 4 falsch, also erscheint `false`. Deine Regel würde jetzt „nachbestellen" sagen.'}),

   plan('greeting','first','Der Gast sieht die Antwort',7,
    'Dein Laden hat einen Bildschirm an der Tür. Der erste Gast soll begrüßt werden. Wie sagst du dem Computer, dass er etwas anzeigen soll?',
    'WENN der Gast kommt, DANN zeige einen Begrüßungstext auf dem Bildschirm.',
    'AUSGABE: "Willkommen in der Pizzeria"',
    ['Du kennst den Befehl für eine Ausgabe.','Du kannst einen Text in Anführungszeichen schreiben.'],['variables']),
   plan('guest-input','first','Der Gast sagt, was er will',8,
    'Der Gast ruft seine Bestellung. Du musst sie aufschreiben, damit du sie später noch weißt.',
    'WENN der Gast etwas sagt, DANN speichere es unter einem Namen.',
    'wunsch = Eingabe vom Gast',
    ['Du kannst eine Eingabe entgegennehmen.','Du verstehst, dass gespeicherte Daten später wieder verwendet werden.'],['variables'],'https://nodejs.org/api/readline.html'),
   plan('salami-and-cheese','first','Salami UND Käse',9,
    'Ein Gast will Salami und Käse. Zwei Bedingungen müssen gleichzeitig wahr sein.',
    'WENN Salami da ist UND Käse da ist, DANN Pizza backen, SONST nichts.',
    'WENN salami && kaese: backen\nSONST: warten',
    ['Du kannst zwei Bedingungen mit && verbinden.','Du verstehst, dass beide wahr sein müssen.'],['conditionals']),
   plan('forgot-else','first','Wenn else vergessen geht',7,
    'Du sagst dem Computer, was er bei Regen tun soll – vergisst aber den anderen Fall. Der Gast steht nass da.',
    'WENN eine Bedingung falsch ist, DANN braucht es einen SONST-Weg.',
    'WENN regnet: Schirm\nSONST: Sonnenbrille',
    ['Du erkennst fehlende SONST-Zweige.','Du schreibst Regeln mit zwei vollständigen Wegen.'],['conditionals','errors']),
   plan('for-each-ingredient','repeat','Für jede Zutat',9,
    'Du hast eine Liste mit vier Zutaten und willst jede einmal prüfen. Statt viermal dasselbe zu schreiben, sagst du es nur einmal.',
    'WENN Zutaten in einer Liste liegen, DANN mache für jede Zutat dasselbe.',
    'FÜR JEDE zutat in zutaten: prüfen',
    ['Du verstehst eine Schleife als „für jedes Element".','Du erkennst, dass eine Schleife Wiederholungen erspart.'],['sequences']),
   plan('count-along','repeat','Mitzählen',8,
    'Du willst wissen, wie viele Pizzen heute verkauft wurden. Bei jeder Bestellung zählst du um eins weiter.',
    'WENN eine Pizza verkauft wird, DANN erhöhe den Zähler um eins.',
    'zaehler = zaehler + 1',
    ['Du kannst einen Zähler Schritt für Schritt erhöhen.','Du siehst, warum der alte Wert im neuen wieder vorkommt.'],['sequences']),
   plan('ingredient-list','repeat','Die Zutatenliste',10,
    'Die Zutaten stehen in einer Liste. Du willst die zweite Zutat wissen – dafür brauchst du eine Position.',
    'WENN du eine Zutat brauchst, DANN frage nach ihrer Position in der Liste.',
    'zutat = liste[1]',
    ['Du verstehst Indexe als Positionen.','Du weißt, dass die Zählung bei 0 beginnt.'],['sequences']),
   plan('ingredient-card','values','Die Zutatenkarte',9,
    'Salami hat einen Namen, ein Gewicht und einen Preis. Du schreibst alles auf eine Karte.',
    'WENN zusammengehörige Daten dazugehören, DANN bündele sie auf einer Karte.',
    'type Zutat = { name; gramm; preis }',
    ['Du kannst mehrere Werte zu einem Ding zusammenfassen.','Du verstehst, warum das übersichtlicher ist als drei einzelne Variablen.'],['records']),
   plan('same-dough','values','Der Teig ist immer gleich',10,
    'Dein Teig hat immer Mehl, Wasser, Salz und Hefe. Du willst, dass niemand die Menge heimlich ändert.',
    'WENN ein Teig immer gleich bleibt, DANN schreibe ihn mit readonly-Feldern auf.',
    'type Teig = { readonly mehl; wasser; salz; hefe }',
    ['Du lernst readonly als feste Datenkarte kennen.','Du verstehst, warum feste Werte die Arbeit erleichtern.'],['records']),
   plan('two-equal-doughs','values','Zwei gleiche Teige',9,
    'Zwei Teige haben dieselben Zahlen. Sind sie gleich – obwohl es zwei Zettel sind?',
    'WENN alle Felder übereinstimmen, DANN sind die Teige inhaltlich gleich.',
    'felderGleich(teig1, teig2) // Inhalt vergleichen',
    ['Du unterscheidest Identität und Inhalt.','Du verstehst, warum du bei Objekten Felder einzeln vergleichst.'],['records','equality']),
   plan('ingredient-box','typed','Die Zutatenbox',11,
    'Du baust eine Box, in die nur Zutaten dürfen – aber mal Salami, mal Käse.',
    'WENN eine Box für verschiedene Inhalte gedacht ist, DANN gib ihr einen Typplatzhalter.',
    'Box<T> mit T = Salami oder Käse',
    ['Du verstehst Generics als „Box mit Etikett".','Du erkennst, dass die Box mehrfach benutzt werden kann.'],['generics']),
   plan('salami-not-cheese','typed','Salami ist nicht Käse',10,
    'Eine Salami-Box und eine Käse-Box sehen gleich aus – dürfen aber nicht verwechselt werden.',
    'WENN der Inhalt unterschiedlich ist, DANN gib den Sorten eigene Markierungen.',
    'Box<Salami> != Box<Kaese>',
    ['Du verstehst, warum TypeScript Sorten mit Markierungen trennt.','Du erkennst Invarianz ohne Fachbegriff.'],['generics','equality']),
   plan('many-kinds','typed','Mehrere Sorten erlauben',11,
    'Du willst eine Box, die alle Beläge aufnimmt, aber keine Nudeln.',
    'WENN mehrere Sorten erlaubt sind, DANN benenne die gemeinsame Grenze.',
    'Box<T extends Belag>',
    ['Du lernst Bounds als gemeinsame Grenze kennen.','Du verstehst, warum eine Regel für alle Sorten gilt.'],['generics','contracts']),
   plan('recipe-card','recipes','Das Rezept als Karte',10,
    'Du schreibst ein Rezept auf und benutzt es zehnmal, statt zehnmal neu nachzudenken.',
    'WENN du etwas oft brauchst, DANN gib dem Rezept einen Namen.',
    'function teigMachen(): void',
    ['Du verstehst eine Funktion als wiederverwendbares Rezept.','Du erkennst, dass ein Name die Arbeit erspart.'],['functions']),
   plan('pass-ingredients','recipes','Zutaten übergeben',10,
    'Das Rezept braucht Mehl und Wasser. Du gibst sie beim Aufruf mit.',
    'WENN ein Rezept Zutaten braucht, DANN übergib sie beim Aufruf.',
    'preis(anzahl: number): number',
    ['Du verstehst Parameter als übergebene Werte.','Du verstehst den Rückgabewert als Ergebnis.'],['functions']),
   plan('kitchen-job','recipes','Die Küche hat eine Aufgabe',10,
    'Küche, Kasse und Regal machen nicht dasselbe. Jede Stelle bekommt eine eigene Klasse.',
    'WENN eine Aufgabe groß ist, DANN teile sie in Rollen auf.',
    'class Kueche { backen(): void }',
    ['Du verstehst Klassen als Rollen mit Aufgaben.','Du erkennst Kapselung als „Details bleiben in der Rolle".'],['contracts']),
   plan('chef-and-apprentice','recipes','Chef und Azubi',9,
    'Der Azubi kann alles, was der Chef kann – und macht noch etwas dazu.',
    'WENN eine Rolle die andere erweitert, DANN darf sie die Aufgaben übernehmen.',
    'class Azubi extends Chef',
    ['Du verstehst Vererbung als „mehr derselben Aufgabe".','Du erkennst, wann Wiederverwendung sinnvoll ist.'],['contracts']),
   plan('label-shelf','shelves','Das Regal mit Etikett',10,
    'Du willst die Zutat schnell finden – über den Namen statt über die Position.',
    'WENN du etwas über einen Namen findest, DANN benutze eine Map.',
    'regal.get("Salami")',
    ['Du verstehst Schlüssel und Wert.','Du kannst einen Bestand über Namen abfragen.'],['key-value']),
   plan('no-duplicates','shelves','Keine doppelten Zutaten',9,
    'Zwei Mitarbeiter tragen dieselbe Zutat ein. Das Regal soll sie nur einmal zählen.',
    'WENN etwas nur einmal vorkommen darf, DANN nimm eine Menge.',
    'set.add("Salami")',
    ['Du verstehst Sets als Sammlungen ohne Doppelte.','Du erkennst, warum Gleichheit wichtig ist.'],['uniqueness','equality']),
   plan('sum-prices','shelves','Alle Preise aufsummieren',11,
    'Am Ende des Tages willst du die Summe aller Pizza-Preise wissen.',
    'WENN du viele Zahlen zu einer Summe machen willst, DANN benutze eine Verarbeitungskette.',
    'preise.reduce((summe, preis) => summe + preis, 0)',
    ['Du verstehst map und reduce als Schritte.','Du erkennst, dass eine Kette lesbarer sein kann als eine Schleife.'],['stream-pipelines']),
   plan('rule-lambda','shelves','Regeln sammeln',10,
    'Die Rabattregel soll wie ein Zettel sein, den du weitergeben kannst.',
    'WENN du eine Regel weitergeben willst, DANN schreibe sie als kleine Funktion.',
    'rabatt = (preis: number) => preis / 10',
    ['Du verstehst Pfeilfunktionen als kleine Regeln.','Du kannst eine Regel an eine andere Stelle übergeben.'],['closures']),
   plan('salami-gone','errors','Die Salami ist alle',10,
    'Ein Gast will Salami, das Regal ist leer. Du sagst lieber „fehlt" als eine falsche Zahl.',
    'WENN etwas fehlen kann, DANN zeige das mit null oder undefined an.',
    'salami: Salami | null',
    ['Du verstehst optionale Werte.','Du behandelst den fehlenden Fall bewusst.'],['absence']),
   plan('polite-error','errors','Höflich „geht nicht" sagen',10,
    'Die Zutat fehlt. Der Gast soll freundlich erfahren, was los ist – statt dass der Bildschirm schwarz wird.',
    'WENN etwas schiefgeht, DANN gib eine klare Meldung oder einen Fehler zurück.',
    'throw new Error("Salami fehlt im Regal")',
    ['Du verstehst Fehler als verständliche Meldungen.','Du kannst einen Fehler beschreiben, statt still zu scheitern.'],['errors']),
   plan('first-junit','errors','Erste Prüfung mit node:test',10,
    'Du willst morgens schnell wissen, ob deine Regel noch stimmt. Ein Test prüft es automatisch.',
    'WENN du eine Regel änderst, DANN prüfe sie mit einem Test.',
    'assert.equal(5, rabatt(50))',
    ['Du kennst einen einfachen Automatentest.','Du verstehst, warum Grenzfälle wichtig sind.'],['errors','contracts'],'https://nodejs.org/api/test.html'),
   plan('one-file-not-enough','app','Eine Datei reicht nicht',9,
    'Deine Pizzeria hat 1.000 Zeilen in einer Datei. Du findest nichts mehr wieder.',
    'WENN eine Datei zu groß wird, DANN teile sie in Rollen auf.',
    'Controller / Service / Repository',
    ['Du verstehst Schichten als Arbeitsplätze.','Du erkennst den Nutzen von Ordnung im Code.'],['contracts']),
   plan('one-job','app','Jeder Raum hat eine Aufgabe',9,
    'Die Kassiererin kocht nicht, der Regalmeister bedient keine Gäste. Jede Rolle hat genau eine Aufgabe.',
    'WENN eine Klasse zwei Aufgaben hat, DANN teile sie.',
    'Eine Klasse – eine Aufgabe',
    ['Du verstehst das Prinzip „eine Aufgabe pro Rolle".','Du kannst Verantwortlichkeiten trennen.'],['contracts']),
   plan('project-order','app','Das Projekt in Ordnung halten',9,
    'Du willst dein Projekt bauen, starten und Fehler sehen können.',
    'WENN du ein Projekt öfter baust, DANN brauchst du Werkzeuge und Einstellungen.',
    'npm run dev / npm test',
    ['Du kennst npm als Werkzeug für Skripte und Pakete.','Du verstehst Konfiguration als „Zettel für später".'],['contracts','errors'],'https://docs.npmjs.com/cli/v11/using-npm/scripts'),
   plan('first-http','app','Der erste HTTP-Weg',10,
    'Ein Gast soll deine Pizzeria vom Handy aus ansehen können. Dazu braucht es eine Adresse.',
    'WENN jemand eine Adresse aufruft, DANN antworte mit einer Liste.',
    'GET /pizzen',
    ['Du verstehst, was eine URL und eine Antwort sind.','Du kennst JSON als Textformat für Daten.'],['contracts'],'https://expressjs.com/en/5x/api.html'),
   plan('restaurant-leader','spring','Der Restaurantleiter',10,
    'Jemand muss Küche, Regal und Kasse miteinander bekannt machen. In TypeScript übernimmt das dein Startcode – oder ein Framework wie NestJS.',
    'WENN Rollen zusammenarbeiten, DANN übergib ihnen ihre Werkzeuge.',
    'new BestellungController(service)',
    ['Du verstehst Dependency Injection als „Rollen gereicht bekommen".','Du siehst, dass Verdrahten eine eigene Aufgabe ist.'],['contracts'],'https://docs.nestjs.com/providers'),
   plan('cashier','spring','Die Kassiererin',10,
    'Die Kassiererin nimmt die Bestellung an der Adresse /bestellung entgegen.',
    'WENN ein Gast Bestellung schickt, DANN nimmt der Controller sie an.',
    'app.post("/bestellung", ...)',
    ['Du kennst einen Controller als Eingang zur Anwendung.','Du kannst eine JSON-Antwort zurückgeben.'],['contracts'],'https://expressjs.com/en/guide/routing.html'),
   plan('kitchen','spring','Der Küchenchef',10,
    'Der Chef entscheidet, was mit der Bestellung passiert – er weiß nichts vom Bildschirm.',
    'WENN die Bestellung angekommen ist, DANN arbeite sie im Service weiter.',
    'class KuechenService { backen() }',
    ['Du verstehst den Service als Ort der Regeln.','Du hältst Eingabe und Verarbeitung getrennt.'],['contracts','functions']),
   plan('shelf','spring','Das Regal',10,
    'Das Regal merkt sich Zutaten – vorerst im Speicher, später in einer Datenbank.',
    'WENN Daten nachgeschlagen werden, DANN frag das Regal.',
    'bestand(name): number | null',
    ['Du verstehst ein Repository als Datenzugriff.','Du erkennst, warum die Küche nicht selbst im Regal wühlt.'],['key-value','contracts']),
   plan('pizzeria-api','capstone','Die Pizzeria-API',15,
    'Jetzt baust du den ganzen Laden: Gast bestellt, Küche prüft, Regal antwortet, der Bildschirm zeigt das Ergebnis.',
    'WENN alle Rollen zusammenarbeiten, DANN entsteht eine echte kleine Anwendung.',
    'Alles von Kapitel 1–36 zusammen',
    ['Du wendest alle Konzepte des Bandes in einem Projekt an.','Du kannst deine Pizzeria einem anderen Menschen zeigen.'],
    ['variables','conditionals','sequences','records','generics','functions','contracts','key-value','stream-pipelines','errors','absence'],'https://expressjs.com/en/starter/hello-world.html')
  ]
};

/** Alle 37 Kapitel sind ausformuliert; die Lektionen 5–37 liegen in pizzeria-typescript-lessons.ts. */
export const PIZZERIA_TYPESCRIPT_BOOK:TypeScriptBeginnerBook={
  ...BASE_BOOK,
  chapters:BASE_BOOK.chapters.map(chapter=>{
   const additional=PIZZERIA_TYPESCRIPT_LESSONS.find(lesson=>lesson.id===chapter.id);
   return additional?{...chapter,...additional}:chapter;
  })
};
export const TYPESCRIPT_BOOK_BY_ID:ReadonlyMap<string,TypeScriptBeginnerChapter>=
  new Map(PIZZERIA_TYPESCRIPT_BOOK.chapters.map(chapter=>[chapter.id,chapter]));
export function getTypeScriptChapter(id:string):TypeScriptBeginnerChapter{
  const chapter=TYPESCRIPT_BOOK_BY_ID.get(id);
  if(!chapter)throw Error('Unbekanntes TypeScript-Einsteigerkapitel: '+id);
  return chapter;
}
export function validateTypeScriptBook(book:TypeScriptBeginnerBook=PIZZERIA_TYPESCRIPT_BOOK):readonly string[]{
  return validateBeginnerBook(book);
}
