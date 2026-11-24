import type {TypeScriptBeginnerChapter,TypeScriptBeginnerWord} from './pizzeria-typescript-book.ts';

/**
 * Ausformulierte Lektionen für Kapitel 5–37 des TypeScript-Bandes. Jede Lektion
 * bleibt bewusst kurz: eine Idee, höchstens acht Codezeilen, eine Aufgabe und
 * ein typischer Fehler. Fachlich gilt: record → readonly interface/type,
 * Generics → Box<T>, Optional → T | null, Exceptions → Error/Fehlerrückgabe.
 */
type Lesson=Pick<TypeScriptBeginnerChapter,'id'|'explain'|'wordbank'|'code'|'output'|'tryIt'|'misconception'|'solution'>;
const lesson=(id:string,explain:readonly string[],wordbank:readonly TypeScriptBeginnerWord[],
  options:{code?:string;output?:string;tryIt:string;misconception:string;solution:string}):Lesson=>
  ({id,explain,wordbank,...options});
const word=(term:string,definition:string):TypeScriptBeginnerWord=>({term,definition});

export const PIZZERIA_TYPESCRIPT_LESSONS:readonly Lesson[]=[
  lesson('greeting',[
   'Dein Laden hat einen Bildschirm an der Tür. Als Erstes soll dort stehen: „Willkommen in der Pizzeria!" Computer können Text ausgeben – das heißt: sie schreiben ihn auf den Bildschirm.',
   'In TypeScript benutzen wir dafür `console.log`. Das klingt kompliziert, ist aber nur der lange Name für „schreib mir etwas auf den Bildschirm". Alles zwischen den Anführungszeichen ist Text und wird genau so angezeigt.',
   'Du siehst: Programmieren heißt oft nur, dem Computer ganz genau zu sagen, was er tun soll. Heute sagst du ihm: „Gib diesen Text aus."'
  ],[
   word('Ausgabe','Das, was der Computer auf den Bildschirm schreibt, damit du es lesen kannst.'),
   word('Text','Eine Zeichenfolge in Anführungszeichen, zum Beispiel "Willkommen".')
  ],{code:"console.log('Willkommen in der Pizzeria!');",
   output:'Willkommen in der Pizzeria!',
   tryIt:'Ändere den Text in deinen eigenen Begrüßungssatz. Was steht jetzt auf dem Bildschirm?',
   misconception:'Ohne Anführungszeichen denkt TypeScript an einen Namen, den es kennt – und den gibt es vielleicht nicht. Text immer in "..." oder \'...\' schreiben.',
   solution:"Zum Beispiel: console.log('Hallo, ich bin Mia!'); Es erscheint genau dieser Satz."}),

  lesson('guest-input',[
   'Ein Gast ruft: „Ich möchte Salami!" Du willst das aufschreiben. Dazu brauchst du eine Eingabe – dein Programm liest, was der Gast tippt.',
   'In Node.js holst du dir mit `createInterface` aus `node:readline/promises` ein Werkzeug für die Tastatur. `frage.question(...)` wartet auf die Antwort und gibt sie als Text zurück.',
   'Du speicherst sie unter dem Namen `wunsch` – wie ein Namensschild an einer Kiste. Danach kannst du den Wunsch weiterverwenden, zum Beispiel auf den Bildschirm schreiben.'
  ],[
   word('Eingabe','Das, was ein Mensch in das Programm hineintippt.'),
   word('readline','Ein Werkzeug in Node.js, das Zeilen von der Tastatur liest.')
  ],{code:"import { createInterface } from 'node:readline/promises';\nconst frage = createInterface({ input: process.stdin, output: process.stdout });\nconst wunsch: string = await frage.question('Dein Wunsch: ');\nconsole.log(wunsch);",
   output:'Salami (wenn der Gast Salami tippt)',
   tryIt:'Lass den Gast „Käse" tippen. Was speichert dein Programm jetzt?',
   misconception:'`question` gibt immer einen Text zurück – auch wenn der Gast nichts tippt. Du musst selbst prüfen, ob der Wunsch leer ist.',
   solution:'Der Name `wunsch` enthält jetzt „Käse". Die Ausgabe zeigt genau dieses Wort.'}),

  lesson('salami-and-cheese',[
   'Ein Gast will Salami und Käse. Das sind zwei Wünsche gleichzeitig. Beide müssen wahr sein, sonst backst du die falsche Pizza.',
   'In TypeScript verbindest du zwei Bedingungen mit `&&`. Das liest sich wie „UND". Nur wenn links und rechts wahr sind, gehst du in den DANN-Zweig.',
   'WENN Salami da ist UND Käse da ist, DANN backen. SONST wartest du, bis die Zutaten da sind.'
  ],[
   word('&&','Das Zeichen für „und". Beide Bedingungen müssen wahr sein.'),
   word('Bedingung','Eine Frage mit der Antwort wahr oder falsch.')
  ],{code:"const salami: boolean = true;\nconst kaese: boolean = true;\nif (salami && kaese) {\n    console.log('Pizza backen');\n}",
   output:'Pizza backen',
   tryIt:'Setze kaese auf false. Was passiert jetzt?',
   misconception:'`&&` ist nicht dasselbe wie `||`. Bei `||` reicht schon eine wahre Bedingung; bei `&&` brauchst du beide.',
   solution:'Bei kaese = false ist die ganze Bedingung falsch. Der DANN-Zweig wird übersprungen und es gibt keine Ausgabe.'}),

  lesson('forgot-else',[
   'Du sagst dem Computer nur, was er bei Regen tun soll. Es ist aber sonnig. Der Computer weiß nicht, was jetzt gilt – und der Gast steht nass da.',
   'Ein guter WENN-Satz braucht einen SONST-Satz. In TypeScript ist das `else`. Damit gibt es für jede Situation einen Weg.',
   'WENN es regnet, DANN Schirm nehmen. SONST Sonnenbrille aufsetzen. Beide Fälle sind jetzt geregelt.'
  ],[
   word('else','Der SONST-Teil: Was passiert, wenn die Bedingung falsch ist?'),
   word('Zweig','Ein Weg, den das Programm nehmen kann.')
  ],{code:"const regnet: boolean = false;\nif (regnet) {\n    console.log('Schirm nehmen');\n} else {\n    console.log('Sonnenbrille');\n}",
   output:'Sonnenbrille',
   tryIt:'Setze regnet auf true. Welcher Satz erscheint jetzt?',
   misconception:'`else` gehört zum letzten `if` davor. Und es darf nur genau ein `else` zu einem `if` geben.',
   solution:'Bei true erscheint „Schirm nehmen". Der SONST-Zweig wird dann übersprungen.'}),

  lesson('for-each-ingredient',[
   'Vier Zutaten liegen auf dem Tisch. Du könntest viermal fast dasselbe schreiben. Oder du sagst einmal: „Mach das für jede Zutat."',
   'Genau das ist eine Schleife. In TypeScript schreibst du `for (const zutat of zutaten)`. Lies es als: „Für jede Zutat in der Liste zutaten …"',
   'Der Name `zutat` wechselt bei jedem Durchlauf. Beim ersten Mal ist er „Salami", beim nächsten „Käse" – und dein Code bleibt trotzdem kurz.'
  ],[
   word('Schleife','Ein Weg, Schritte mehrfach auszuführen, ohne sie mehrfach hinzuschreiben.'),
   word('Element','Ein einzelner Eintrag in einer Liste.')
  ],{code:"const zutaten: string[] = ['Salami', 'Käse', 'Pilze'];\nfor (const zutat of zutaten) {\n    console.log(zutat);\n}",
   output:'Salami\nKäse\nPilze',
   tryIt:'Füge „Tomate" zur Liste hinzu. Wie viele Zeilen gibt das Programm jetzt aus?',
   misconception:'Die Schleife läuft so oft, wie es Elemente gibt – nicht viermal, nur weil du vier Zutaten hingeschrieben hast. Neue Zutat = ein weiterer Durchlauf.',
   solution:'Vier Zeilen: Salami, Käse, Pilze und Tomate. Der Code selbst bleibt gleich.'}),

  lesson('count-along',[
   'Du willst wissen, wie viele Pizzen heute verkauft wurden. Bei jeder Bestellung sagst du: „Eine mehr."',
   'Im Computer geht das mit einem Zähler. Du legst ihn bei 0 an und schreibst bei jeder Pizza: `zaehler = zaehler + 1;` Das liest sich komisch, ist aber logisch: Nimm den alten Wert, addiere eins, speichere ihn wieder unter demselben Namen.',
   'Dafür brauchst du `let` statt `const`: Der Zähler darf sich ändern. Nach drei Pizzen steht dort 3.'
  ],[
   word('Zähler','Eine Zahl, die bei jedem Ereignis um eins weitergeht.'),
   word('let','Ein Namensschild, dessen Wert später geändert werden darf.')
  ],{code:'let zaehler: number = 0;\nzaehler = zaehler + 1;\nzaehler = zaehler + 1;\nconsole.log(zaehler);',
   output:'2',
   tryIt:'Füge eine dritte Zeile `zaehler = zaehler + 1;` ein. Was steht jetzt auf dem Bildschirm?',
   misconception:'`zaehler = zaehler + 1` ist keine Mathematikstunde mit unbekanntem x. Rechts steht der alte Wert, links wird der neue gespeichert.',
   solution:'Es steht 3. Der Zähler war 2, dann kam eins dazu.'}),

  lesson('ingredient-list',[
   'Die Zutaten liegen in einer Liste: Salami, Käse, Pilze. Du willst die zweite Zutat wissen. Dafür fragst du nach einer Position.',
   'Diese Position heißt Index. Er beginnt bei 0 – nicht bei 1. `zutaten[0]` ist Salami, `zutaten[1]` ist Käse, `zutaten[2]` sind Pilze.',
   'WENN du eine Zutat brauchst, DANN fragst du mit `[Position]` danach. Das ist wie ein Regal mit Nummern an den Fächern.'
  ],[
   word('Index','Die Nummer einer Position in einer Liste. Sie beginnt bei 0.'),
   word('Liste','Eine Sammlung mit fester Reihenfolge.')
  ],{code:"const zutaten = ['Salami', 'Käse', 'Pilze'];\nconsole.log(zutaten[1]);",
   output:'Käse',
   tryIt:'Ändere die 1 in eine 2. Welche Zutat erscheint jetzt?',
   misconception:'Viele denken, zutaten[2] sei das zweite Element. Es ist das dritte, weil bei 0 gezählt wird.',
   solution:'Bei [2] erscheinen „Pilze". Die Position 2 ist das dritte Fach im Regal.'}),

  lesson('ingredient-card',[
   'Salami hat einen Namen, ein Gewicht und einen Preis. Drei einzelne Variablen wären unübersichtlich. Du schreibst alles auf eine Karte.',
   'In TypeScript kannst du dafür ein `interface` benutzen. Du sagst nur, welche Felder die Karte hat und welche Art von Wert in jedes Feld darf. TypeScript prüft das für dich.',
   'WENN mehrere Werte zusammengehören, DANN bündele sie auf einer Karte. Dein Code wird kürzer und du findest die Zutat schneller wieder.'
  ],[
   word('Interface','Eine Beschreibung, welche Felder eine Datenkarte hat.'),
   word('Feld','Ein benannter Platz auf der Karte, zum Beispiel das Gewicht.')
  ],{code:'interface Zutat {\n    readonly name: string;\n    readonly gramm: number;\n}\nconst salami: Zutat = { name: \'Salami\', gramm: 30 };\nconsole.log(salami);',
   output:"{ name: 'Salami', gramm: 30 }",
   tryIt:'Erzeuge eine zweite Karte für Käse mit 40 Gramm. Wie sieht die Ausgabe aus?',
   misconception:'Ein Interface ist nur eine Beschreibung für TypeScript. Es erzeugt selbst keine Karte – du schreibst das Objekt trotzdem hin.',
   solution:"{ name: 'Käse', gramm: 40 }. Die Karte zeigt beide Felder."}),

  lesson('same-dough',[
   'Dein Teig besteht immer aus denselben vier Zahlen: Mehl, Wasser, Salz, Hefe. Du willst nicht, dass jemand heimlich das Wasser ändert.',
   'Darum schreibst du `readonly` vor jedes Feld. Wenn jemand später `standard.wasser = 400` schreiben will, meldet TypeScript einen Fehler – wie ein ausgedrucktes Rezept statt einer löschbaren Notiz.',
   'WENN etwas immer gleich bleiben soll, DANN nimm readonly-Felder. Das schützt deinen Teig, ohne dass du jedes Mal nachdenken musst.'
  ],[
   word('readonly','Ein Feld, das nach dem Erzeugen nicht mehr beschrieben werden darf.'),
   word('Rezept','Hier: die feste Liste der Zutaten und Mengen für den Teig.')
  ],{code:'interface Teig { readonly mehl: number; readonly wasser: number;\n  readonly salz: number; readonly hefe: number; }\nconst standard: Teig = { mehl: 500, wasser: 350, salz: 10, hefe: 5 };\nconsole.log(standard.wasser);',
   output:'350',
   tryIt:'Frage das Salz ab statt das Wasser. Welche Zahl erscheint?',
   misconception:'`readonly` ist eine Prüfung von TypeScript beim Schreiben. Es ist kein magisches Schloss: Du liest das Feld ganz normal mit `standard.wasser`.',
   solution:'Es erscheint 10. Mit `standard.salz` liest du ein anderes Feld derselben Karte.'}),

  lesson('two-equal-doughs',[
   'Zwei Teigkarten haben dieselben Zahlen. Es sind zwei Zettel – aber der Teig ist gleich. Willst du das prüfen, fragst du nach dem Inhalt.',
   'Wichtig: `a === b` ist bei Objekten nur wahr, wenn es derselbe Zettel ist. Für den Inhalt vergleichst du die Felder: `a.mehl === b.mehl && a.wasser === b.wasser`.',
   'WENN alle Felder übereinstimmen, DANN sind die Teige inhaltlich gleich. So unterscheidest du Inhalt von Identität – wie zwei Zettel mit demselben Rezept.'
  ],[
   word('Wertgleichheit','Zwei Dinge sind gleich, weil ihr Inhalt übereinstimmt.'),
   word('Identität','Zwei Dinge sind dasselbe Objekt – auch wenn der Inhalt anders ist.')
  ],{code:'interface Teig { readonly mehl: number; readonly wasser: number; }\nconst a: Teig = { mehl: 500, wasser: 350 };\nconst b: Teig = { mehl: 500, wasser: 350 };\nconsole.log(a.mehl === b.mehl && a.wasser === b.wasser);',
   output:'true',
   tryIt:'Ändere bei b die 350 in 400. Was gibt das Programm jetzt aus?',
   misconception:'`a === b` wäre hier falsch, obwohl beide Karten gleich aussehen. TypeScript vergleicht Objekte über die Referenz, nicht über die Felder.',
   solution:'Bei 400 ist ein Feld anders, also erscheint false. Die Teige sind nicht mehr gleich.'}),

  lesson('ingredient-box',[
   'Du baust eine Box, in die eine Zutat hineinkommt. Mal ist es Salami, mal Käse. Du schreibst die Box nur einmal – mit einem Platzhalter `T`.',
   'Dieser Platzhalter heißt Typparameter. Beim Benutzen sagst du, was `T` diesmal ist: `Box<string>` für Text, `Box<number>` für eine Zahl.',
   'WENN eine Box für verschiedene Inhalte gedacht ist, DANN gib ihr einen Typplatzhalter. So brauchst du keine zweite Box für jeden Belag.'
  ],[
   word('Generics','Eine Box mit Typplatzhalter, die für verschiedene Inhalte benutzt werden kann.'),
   word('Typparameter','Der Platzhalter T, der später durch einen echten Typ ersetzt wird.')
  ],{code:'interface Box<T> { readonly inhalt: T; }\nconst salami: Box<string> = { inhalt: \'Salami\' };\nconsole.log(salami.inhalt);',
   output:'Salami',
   tryIt:'Baue eine zweite Box für den Text "Käse". Wie heißt der Typ?',
   misconception:'`T` ist kein geheimer Wert. Es ist nur ein Platzhalter für einen Typ – wie ein leeres Etikett an der Box.',
   solution:'Auch sie ist eine Box<string>. Der Inhalt ist anders, der Typ bleibt Text.'}),

  lesson('salami-not-cheese',[
   'Eine Salami-Box und eine Käse-Box sehen gleich aus. Du darfst sie aber nicht verwechseln – sonst liegt plötzlich Käse im Salami-Fach.',
   'TypeScript prüft Strukturen. Damit die Sorten getrennt bleiben, gibst du ihnen eine Markierung: `type Salami = { readonly art: \'Salami\' }`. Der Text \'Salami\' ist jetzt ein eigener Typ.',
   'WENN der Inhalt unterschiedlich ist, DANN sind es verschiedene Boxen. TypeScript meldet einen Fehler, bevor du die Fächer verwechselst.'
  ],[
   word('Markierung','Ein Feld mit einem festen Wert, das eine Sorte eindeutig macht.'),
   word('Typprüfung','TypeScript kontrolliert beim Schreiben, welche Box wohin passt.')
  ],{code:"type Salami = { readonly art: 'Salami' };\ntype Kaese = { readonly art: 'Kaese' };\ninterface Box<T> { readonly inhalt: T; }\nconst fach1: Box<Salami> = { inhalt: { art: 'Salami' } };\nconst fach2: Box<Kaese> = { inhalt: { art: 'Kaese' } };",
   output:'(zwei getrennte Fächer)',
   tryIt:'Versuche, fach1 eine Kaese hineinzugeben. Was sagt TypeScript?',
   misconception:'Zwei Karten mit demselben Feldnamen sind nicht automatisch gleich. Der feste Wert im Feld entscheidet mit.',
   solution:'TypeScript meldet einen Fehler: In eine Box<Salami> passt kein Kaese. Genau das wolltest du.'}),

  lesson('many-kinds',[
   'Jetzt willst du eine Box, die alle Beläge aufnimmt – Salami, Käse und Pilze. Aber keine Nudeln, bitte.',
   'Dafür benennst du eine gemeinsame Grenze: `interface Belag`. Dann schreibst du `Box<T extends Belag>`. Das heißt: T darf jeder Typ sein, der zu dieser Grenze passt.',
   'WENN mehrere Sorten erlaubt sind, DANN benenne die gemeinsame Regel. SONST darf alles hinein – auch Nudeln.'
  ],[
   word('Bound','Eine Grenze für einen Typplatzhalter, zum Beispiel "muss Belag sein".'),
   word('Interface','Ein Vertrag, den ein Objekt erfüllen kann.')
  ],{code:"interface Belag { readonly name: string; }\ninterface Box<T extends Belag> { readonly inhalt: T; }\nconst fach: Box<Belag> = { inhalt: { name: 'Salami' } };",
   output:'(Salami passt, Nudeln nicht)',
   tryIt:'Erfinde eine Nudel ohne das Feld name. Darf sie in die Box?',
   misconception:'`extends` heißt hier nicht Vererbung einer Klasse, sondern „muss zu dieser Grenze passen". Das ist bei Generics ein häufiger Stolperstein.',
   solution:'Nein. Die Nudel erfüllt den Vertrag Belag nicht, also weist TypeScript sie ab.'}),

  lesson('recipe-card',[
   'Du machst jeden Tag denselben Teig. Statt die Schritte immer wieder neu zu schreiben, gibst du dem Rezept einen Namen.',
   'Eine Funktion ist genau so ein benanntes Rezept. Du schreibst sie einmal und rufst sie bei Bedarf auf. Das `: void` sagt nur: Hier kommt kein Ergebnis zurück.',
   'WENN du dieselbe Arbeit oft brauchst, DANN schreibe eine Funktion. Das spart Tipparbeit und verhindert, dass du beim zweiten Mal etwas vergisst.'
  ],[
   word('Funktion','Ein benanntes Rezept mit Schritten, das du mehrfach aufrufen kannst.'),
   word('Aufruf','Der Moment, in dem du das Rezept benutzt.')
  ],{code:"function teigMachen(): void {\n    console.log('Mehl, Wasser, Salz, Hefe');\n}\nteigMachen();",
   output:'Mehl, Wasser, Salz, Hefe',
   tryIt:'Rufe teigMachen() zweimal auf. Was siehst du auf dem Bildschirm?',
   misconception:'Das Rezept wird erst beim Aufruf ausgeführt. Nur hinschreiben reicht nicht – du musst den Namen auch aufrufen.',
   solution:'Die Zutatenzeile erscheint zweimal. Jeder Aufruf führt das Rezept erneut aus.'}),

  lesson('pass-ingredients',[
   'Dein Teigrezept braucht Mehl und Wasser. Diese Werte gibst du beim Aufruf mit – wie Zutaten, die du dem Koch reichst.',
   'Diese übergebenen Werte heißen Parameter. Das Rezept benutzt sie im Inneren. Am Ende gibt es mit `return` ein Ergebnis zurück: den fertigen Preis.',
   'WENN ein Rezept Zutaten braucht, DANN übergib sie beim Aufruf. SONST müsste das Rezept immer dieselbe Menge backen.'
  ],[
   word('Parameter','Ein Wert mit Typ, den du einer Funktion beim Aufruf mitgibst.'),
   word('Rückgabewert','Das Ergebnis, das die Funktion zurückgibt.')
  ],{code:'function preis(anzahl: number): number {\n    return anzahl * 8;\n}\nconsole.log(preis(2));',
   output:'16',
   tryIt:'Rufe preis(3) auf. Was kommt heraus?',
   misconception:'Die Zahl in der Klammer beim Aufruf ist nicht dieselbe wie die in der Funktionszeile. Dort steht nur der Platzhalter.',
   solution:'Bei 3 Pizzen kommt 24 heraus. Der Platzhalter anzahl wurde durch 3 ersetzt.'}),

  lesson('kitchen-job',[
   'Dein Laden hat viele Aufgaben. Wenn eine Klasse alles macht – kochen, kassieren, aufräumen –, verlierst du den Überblick.',
   'Du teilst die Arbeit in Rollen. Eine Klasse ist so eine Rolle: Sie hat Aufgaben (Methoden) und Daten (Felder). Die Küche backt, die Kasse nimmt Geld.',
   'WENN eine Aufgabe groß ist, DANN teile sie in Rollen. Jede Klasse kennt nur ihre eigenen Details – das nennt man Kapselung.'
  ],[
   word('Klasse','Eine Bauanleitung für eine Rolle mit Aufgaben und Daten.'),
   word('Kapselung','Details bleiben in der Klasse und stören andere Teile nicht.')
  ],{code:"class Kueche {\n    backen(): void {\n        console.log('Pizza ist fertig');\n    }\n}\nnew Kueche().backen();",
   output:'Pizza ist fertig',
   tryIt:'Gib der Küche eine zweite Aufgabe namens aufraeumen(). Wie sieht die Klasse jetzt aus?',
   misconception:'Eine Klasse ist kein Objekt. Sie ist die Bauanleitung; mit `new Kueche()` erzeugst du eine konkrete Küche.',
   solution:'Du ergänzt eine zweite Methode `aufraeumen(): void` mit eigener Ausgabe. Beide Methoden stehen in derselben Klasse.'}),

  lesson('chef-and-apprentice',[
   'Der Azubi soll alles können, was der Chef kann – und zusätzlich den Boden putzen. Du schreibst die Koch-Aufgaben nicht zweimal.',
   'Mit `extends` übernimmt eine Klasse die Aufgaben einer anderen. Der Azubi „erbt" `backen()` und fügt `putzen()` hinzu.',
   'WENN eine Rolle die Aufgaben einer anderen braucht, DANN darf sie sie übernehmen. SONST schreibst du dieselben Methoden zweimal.'
  ],[
   word('Vererbung','Eine Klasse übernimmt Aufgaben und Daten einer anderen Klasse.'),
   word('extends','Das TypeScript-Wort für „erbt von".')
  ],{code:"class Chef {\n    backen(): void { console.log('Backen'); }\n}\nclass Azubi extends Chef {\n    putzen(): void { console.log('Putzen'); }\n}\nnew Azubi().backen();",
   output:'Backen',
   tryIt:'Rufe putzen() auf dem Azubi auf. Was erscheint?',
   misconception:'Der Chef kann nicht automatisch putzen – nur der Azubi. Vererbung geht von oben nach unten, nicht umgekehrt.',
   solution:'Es erscheint „Putzen". Der Azubi hat beide Aufgaben.'}),

  lesson('label-shelf',[
   'Dein Regal hat viele Fächer. Du willst die Salami über ihren Namen finden, nicht über eine Nummer. Dafür klebst du Etiketten.',
   'In TypeScript heißt so ein Etikett Schlüssel. Die Map verbindet Schlüssel und Wert: `regal.set("Salami", 3)`. Mit `get` fragst du danach.',
   'WENN du etwas über einen Namen finden willst, DANN nimm eine Map. SONST musst du alle Fächer einzeln durchsuchen.'
  ],[
   word('Map','Eine Sammlung, in der ein Schlüssel zu einem Wert führt.'),
   word('Schlüssel','Der Name, über den du etwas in der Map wiederfindest.')
  ],{code:"const regal = new Map<string, number>();\nregal.set('Salami', 3);\nconsole.log(regal.get('Salami'));",
   output:'3',
   tryIt:'Lege einen zweiten Schlüssel "Käse" mit 5 an. Was gibt regal.get("Käse") aus?',
   misconception:'`get` kann auch undefined liefern, wenn es den Schlüssel nicht gibt. TypeScript sagt dir das – du musst den Fall behandeln.',
   solution:'Es erscheint 5. Der Schlüssel "Käse" führt direkt zu diesem Wert.'}),

  lesson('no-duplicates',[
   'Zwei Mitarbeiter schreiben „Salami" ins Zutatenbuch. Du willst sie nur einmal zählen.',
   'Eine Set ist eine Sammlung, die Doppelte automatisch weg lässt. `add("Salami")` zum zweiten Mal verändert nichts – die Größe bleibt gleich.',
   'WENN etwas nur einmal vorkommen darf, DANN nimm eine Set. Das ist wie eine Gästeliste: Dieselbe Person steht nicht zweimal drauf.'
  ],[
   word('Set','Eine Sammlung ohne doppelte Einträge.'),
   word('Duplikat','Ein zweiter Eintrag mit demselben Wert.')
  ],{code:"const zutaten = new Set<string>();\nzutaten.add('Salami');\nzutaten.add('Salami');\nconsole.log(zutaten.size);",
   output:'1',
   tryIt:'Füge "Käse" hinzu. Wie groß ist die Set jetzt?',
   misconception:'Bei einer Liste wären jetzt zwei Salami-Einträge. Bei einer Set bleibt es bei einem – deshalb ist die Ausgabe 1.',
   solution:'Die Set hat dann zwei Einträge: Salami und Käse. Die Ausgabe ist 2.'}),

  lesson('sum-prices',[
   'Am Ende des Tages willst du wissen, wie viel Geld du eingenommen hast. Du hast eine Liste mit Preisen.',
   'Statt eine Schleife zu schreiben, kannst du eine Kette benutzen: `reduce` nimmt nacheinander jeden Preis und addiert ihn zu einer laufenden Summe. Die 0 am Ende ist der Startwert.',
   'WENN du viele Zahlen zu einer Summe machen willst, DANN benutze eine Kette. Jeder Schritt hat eine klare Aufgabe.'
  ],[
   word('reduce','Eine Methode, die viele Werte zu einem Ergebnis zusammenfasst.'),
   word('Summe','Das Ergebnis des Addierens.')
  ],{code:'const preise: readonly number[] = [8, 8, 12];\nconst summe = preise.reduce((total, preis) => total + preis, 0);\nconsole.log(summe);',
   output:'28',
   tryIt:'Füge eine 5 zur Liste hinzu. Was ist die neue Summe?',
   misconception:'Die Kette verändert die Liste nicht. `readonly` sagt sogar: Hier darf gar nichts umgebaut werden.',
   solution:'Die neue Summe ist 33. Die Liste selbst bleibt unverändert.'}),

  lesson('rule-lambda',[
   'Deine Rabattregel ist ein kleiner Satz: „Vom Preis geht ein Zehntel ab." Du willst sie wie einen Zettel weitergeben.',
   'Eine Pfeilfunktion ist genau so ein Zettel: `(preis: number): number => preis / 10`. Du schreibst keine Klasse, sondern nur die Regel selbst.',
   'WENN du eine Regel weitergeben willst, DANN schreibe sie als Pfeilfunktion. Das ist kürzer als eine ganze Klasse.'
  ],[
   word('Pfeilfunktion','Eine kleine Funktion ohne Namen, die du übergeben kannst.'),
   word('Rabatt','Ein Betrag, der vom Preis abgezogen wird.')
  ],{code:'const rabatt = (preis: number): number => preis / 10;\nconsole.log(rabatt(50));',
   output:'5',
   tryIt:'Was gibt rabatt(100) aus? Rechne kurz im Kopf nach.',
   misconception:'Die Pfeilfunktion wird nicht sofort ausgeführt. Erst mit `rabatt(...)` benutzt du die Regel.',
   solution:'Bei 100 ist ein Zehntel 10. Die Regel wurde mit dem neuen Wert angewendet.'}),

  lesson('salami-gone',[
   'Ein Gast will Salami. Im Regal ist nichts mehr. Du willst nicht einfach 0 schreiben – du willst sagen: „Hier fehlt etwas."',
   'In TypeScript zeigst du das mit `string | null` an. Das liest sich: „Ein Text oder gar nichts." Mit `??` sagst du, was stattdessen gilt: `salami ?? "Käse"`.',
   'WENN etwas fehlen kann, DANN zeige das ausdrücklich im Typ. Der Gast weiß dann, was los ist – statt eine falsche Zahl zu sehen.'
  ],[
   word('null','Ein Wert, der ausdrücklich bedeutet: hier ist nichts.'),
   word('Ersatzwert','Ein Wert, der benutzt wird, wenn nichts gefunden wurde.')
  ],{code:"const salami: string | null = null;\nconsole.log(salami ?? 'Käse');",
   output:'Käse',
   tryIt:'Setze stattdessen const salami: string | null = "Salami". Was erscheint jetzt?',
   misconception:'`??` greift nur bei null oder undefined. Ein leerer Text "" bleibt ein leerer Text – den musst du selbst prüfen.',
   solution:'Es erscheint „Salami". Der Wert ist da, darum wird der Ersatz nicht gebraucht.'}),

  lesson('polite-error',[
   'Die Salami fehlt. Du könntest das Programm einfach abbrechen lassen. Besser ist eine klare Meldung: „Salami fehlt im Regal."',
   'Mit `throw new Error(...)` erzeugst du einen Fehler mit Text. Du kannst auch bewusst einen Wert zurückgeben, zum Beispiel `{ ok: false, fehler: "..." }`. Wichtig ist: Der Fehler darf nicht einfach verschwinden.',
   'WENN etwas schiefgeht, DANN gib eine verständliche Meldung zurück. SONST rät der Gast, was passiert ist.'
  ],[
   word('Error','Ein Objekt, das sagt: Hier ist etwas schiefgelaufen.'),
   word('Fehlerrückgabe','Ein Ergebnis, das ausdrücklich meldet, dass etwas nicht geklappt hat.')
  ],{code:"const bestand: number = 0;\nif (bestand < 1) {\n    throw new Error('Salami fehlt im Regal');\n}",
   output:'Fehler: Salami fehlt im Regal',
   tryIt:'Setze bestand auf 2. Was passiert jetzt?',
   misconception:'Ein `throw` unterbricht den Ablauf, bis jemand den Fehler behandelt. Für kleine Fälle reicht oft eine einfache Fehlerrückgabe.',
   solution:'Bei 2 ist die Bedingung falsch. Es wird kein Fehler geworfen und das Programm läuft normal weiter.'}),

  lesson('first-junit',[
   'Du willst morgens schnell wissen, ob deine Rabattregel noch stimmt. Ein Test prüft das automatisch – schneller als jedes Mal neu nachzurechnen.',
   'Node.js bringt einen Testläufer mit: `node:test` für den Test, `node:assert/strict` für die Erwartung. `assert.equal(5, rabatt(50))` ist grün, wenn beides übereinstimmt.',
   'WENN du eine Regel änderst, DANN prüfe sie mit einem Test. Besonders Grenzfälle wie 0 oder 1 sind wichtig.'
  ],[
   word('Test','Eine automatische Prüfung, ob etwas das richtige Ergebnis liefert.'),
   word('Grenzfall','Ein besonderer Wert ganz am Rand, zum Beispiel 0.')
  ],{code:"import test from 'node:test';\nimport assert from 'node:assert/strict';\ntest('rabatt bei 50', () => { assert.equal(5, rabatt(50)); });",
   output:'Test bestanden',
   tryIt:'Schreibe einen zweiten Test für rabatt(0). Was erwartest du?',
   misconception:'Ein Test prüft nur das, was du hinschreibst. Wenn du den Grenzfall vergisst, findet der Test ihn auch nicht.',
   solution:'Bei 0 ist ein Zehntel 0. Der Test `assert.equal(0, rabatt(0))` sollte bestehen.'}),

  lesson('one-file-not-enough',[
   'Deine Pizzeria steht in einer Datei mit 1.000 Zeilen. Du suchst die Preisregel und findest sie erst nach fünf Minuten.',
   'Du teilst den Laden in Rollen auf: Die Kassiererin nimmt Bestellungen an, der Küchenchef entscheidet, das Regal liefert Zutaten. Jede Rolle bekommt eine eigene Datei und exportiert ihre Klasse.',
   'WENN eine Datei zu groß wird, DANN teile sie in Schichten. Das ist wie ein Laden mit getrennten Arbeitsplätzen statt einem überfüllten Raum.'
  ],[
   word('Modul','Eine Datei, die Code und Klassen an andere Dateien abgeben kann.'),
   word('Schicht','Eine Gruppe von Modulen mit derselben Aufgabe, zum Beispiel Eingabe oder Daten.')
  ],{code:'// bestellung-controller.ts\nclass BestellungController {}\n// kuechen-service.ts\nclass KuechenService {}\n// zutaten-regal.ts\nclass ZutatenRegal {}',
   output:'(drei getrennte Arbeitsplätze)',
   tryIt:'Welche Klasse wäre zuständig, wenn ein Gast die Rechnung will?',
   misconception:'Schichten sind keine extra Arbeit um der Schichten willen. Sie helfen erst, wenn der Laden größer wird.',
   solution:'Die Kassiererin beziehungsweise der Controller. Die Küche kocht, das Regal liefert Zutaten.'}),

  lesson('one-job',[
   'Wenn die Kassiererin gleichzeitig kocht und im Regal steht, verliert sie den Überblick. Jede Rolle soll genau eine Aufgabe haben.',
   'Diese Regel heißt: eine Klasse – eine Aufgabe. Wenn du merkst, dass eine Klasse „und" im Namen braucht, teile sie.',
   'WENN eine Klasse zwei Aufgaben hat, DANN teile sie. SONST wird sie schwer veränderbar.'
  ],[
   word('Aufgabe','Die Sache, für die eine Klasse zuständig ist.'),
   word('Verantwortung','Die Arbeit, die eine Rolle übernimmt.')
  ],{code:'class Regal {\n    bestand(zutat: string): number { return 3; }\n}\nclass Kueche {\n    backen(): void { console.log(\'Fertig\'); }\n}',
   output:'(Regal speichert, Küche backt)',
   tryIt:'Finde eine dritte Aufgabe und gib ihr eine eigene Klasse.',
   misconception:'Eine Klasse darf ruhig mehrere kleine Methoden haben – aber sie sollten alle zu derselben Aufgabe gehören.',
   solution:'Zum Beispiel eine Kasse, die den Preis berechnet. Sie gehört nicht in die Küche.'}),

  lesson('project-order',[
   'Du baust deinen Laden jeden Tag neu. Du willst einen Knopf, der alles erledigt: Code prüfen, starten und Fehler anzeigen.',
   'In `package.json` stehen Skripte: `npm run dev` startet die Anwendung, `npm test` prüft alle Regeln. In `tsconfig.json` sagt TypeScript, wie streng es deinen Code kontrolliert.',
   'WENN du ein Projekt öfter baust, DANN brauchst du Werkzeuge und Einstellungen. SONST machst du alles von Hand.'
  ],[
   word('npm','Ein Werkzeug, das Pakete verwaltet und Skripte für dein Projekt startet.'),
   word('Konfiguration','Einstellungen, die du außerhalb des Codes änderst.')
  ],{code:'// package.json\n"scripts": { "dev": "vite --host", "test": "node --test tests/*.test.ts" }',
   output:'npm run dev startet die App · npm test prüft die Regeln',
   tryIt:'Ändere den Port in deinem Startskript auf 8081. Wo erreichst du jetzt deine Pizzeria?',
   misconception:'Konfiguration ist kein Code. Du änderst sie in einer eigenen Datei, ohne das Programm umzuschreiben.',
   solution:'Unter http://localhost:8081. Die Anwendung startet mit den neuen Einstellungen.'}),

  lesson('first-http',[
   'Ein Gast soll deine Pizzeria vom Handy ansehen können. Dazu braucht er eine Adresse, die er im Browser eintippt.',
   'Mit Express schreibst du `app.get("/pizzen", ...)`. Eine solche Adresse heißt URL. Dein Programm wartet dort auf Anfragen und antwortet mit JSON, einem einfachen Textformat.',
   'WENN jemand die Adresse aufruft, DANN antworte mit einer Liste. Das ist der erste Schritt vom Programm zur Web-Anwendung.'
  ],[
   word('GET','Eine Anfrage, die nur Daten anzeigen soll.'),
   word('JSON','Ein Textformat, mit dem Programme Daten austauschen.')
  ],{code:"app.get('/pizzen', (_req, res) => {\n    res.json(['Salami', 'Käse']);\n});",
   output:'["Salami", "Käse"]',
   tryIt:'Füge „Pilze" zur Liste hinzu. Was sieht der Gast jetzt?',
   misconception:'`GET` bedeutet nur „zeig mir Daten". Um etwas zu bestellen, brauchst du später `POST`.',
   solution:'Die Antwort enthält dann drei Pizzen: Salami, Käse und Pilze.'}),

  lesson('restaurant-leader',[
   'Küche, Regal und Kasse müssen zusammenarbeiten. Jemand muss sie miteinander bekannt machen. In deinem Laden übernimmt das der Startcode.',
   'Du gibst dem Controller seinen Service im Konstruktor: `new BestellungController(service)`. Das nennt man Dependency Injection – die Rollen werden gereicht, statt sich selbst zu bauen. Ein Framework wie NestJS macht das automatisch.',
   'WENN Rollen zusammenarbeiten, DANN lass sie sich ihre Werkzeuge übergeben. Du baust die Küche nicht mehr überall neu.'
  ],[
   word('Dependency Injection','Ein Objekt bekommt das, was es braucht, von außen übergeben.'),
   word('Konstruktor','Die Stelle, an der ein neues Objekt mit seinen Werkzeugen ausgestattet wird.')
  ],{code:'class KuechenService {\n    backen(pizza: string): string { return pizza + \' ist fertig\'; }\n}\nclass BestellungController {\n    constructor(private readonly service: KuechenService) {}\n    bestellen(pizza: string): string { return this.service.backen(pizza); }\n}',
   output:'Die Rollen sind verbunden.',
   tryIt:'Starte die App und öffne die Adresse, die in der Konsole steht.',
   misconception:'Dependency Injection ist keine Magie. Es ist nur das, was du vorher von Hand mit `new` gemacht hast – an einer zentralen Stelle.',
   solution:'Du siehst in der Konsole eine Adresse wie http://localhost:8080. Dort ist dein Laden erreichbar.'}),

  lesson('cashier',[
   'Die Kassiererin sitzt am Eingang. Sie nimmt die Bestellung entgegen und gibt eine Antwort zurück. Im Code heißt sie Controller.',
   'Mit Express schreibst du `app.post("/bestellung", ...)`. Vorher sagst du `app.use(express.json())`, damit `req.body` die Daten des Gastes enthält.',
   'WENN ein Gast eine Bestellung schickt, DANN nimmt der Controller sie an. Er kocht nicht selbst – er gibt die Arbeit weiter.'
  ],[
   word('Controller','Der Eingang der Anwendung: Er nimmt Anfragen an.'),
   word('POST','Eine Anfrage, die neue Daten schickt – hier eine Bestellung.')
  ],{code:"app.post('/bestellung', (req, res) => {\n    res.json({ meldung: 'Bestellung angekommen', pizza: req.body?.pizza ?? '' });\n});",
   output:'{"meldung":"Bestellung angekommen","pizza":"Salami"}',
   tryIt:'Ändere den Text der Antwort in deinen eigenen Satz.',
   misconception:'Der Controller soll keine Preise berechnen. Er nimmt nur an und antwortet – die Regeln kommen in den Service.',
   solution:'Die Antwort zeigt jetzt deinen neuen Text. Die Adresse /bestellung bleibt gleich.'}),

  lesson('kitchen',[
   'Der Küchenchef entscheidet, was mit der Bestellung passiert. Er weiß nichts vom Bildschirm oder vom Handy – er bekommt nur die Bestellung.',
   'In deinem Code ist das der Service. Er trägt die fachlichen Regeln: genug Zutaten? Welcher Preis? Darum gehört er in eine eigene Klasse mit klarer Typangabe.',
   'WENN die Bestellung angekommen ist, DANN arbeite sie im Service weiter. Eingabe und Verarbeitung bleiben getrennt.'
  ],[
   word('Service','Die Klasse, in der die fachlichen Regeln stehen.'),
   word('Trennung','Eingabe und Verarbeitung liegen in verschiedenen Klassen.')
  ],{code:'class KuechenService {\n    backen(pizza: string): string {\n        return pizza + \' ist fertig\';\n    }\n}',
   output:'Salami ist fertig',
   tryIt:'Rufe backen("Käse") auf. Was kommt zurück?',
   misconception:'Ein Service ist keine Website. Er ist nur eine Klasse mit Regeln – der Controller ruft ihn auf.',
   solution:'Es kommt „Käse ist fertig" zurück. Die Regel wurde mit einem anderen Namen angewendet.'}),

  lesson('shelf',[
   'Das Regal merkt sich, wie viele Zutaten da sind. Es kümmert sich nicht um Gäste oder Preise. Es kennt nur Fächer und Bestände.',
   'Darum steckt der Datenzugriff in einer kleinen Funktion. Sie gibt `number | null` zurück: eine Zahl, wenn die Zutat da ist, sonst null. Später tauscht du sie gegen eine Datenbank aus.',
   'WENN Daten nachgeschlagen werden, DANN frag das Regal. SONST wühlt die Küche selbst im Bestand.'
  ],[
   word('Repository','Eine Funktion oder Klasse, die den Zugriff auf Daten übernimmt.'),
   word('Bestand','Die Menge, die von einer Zutat vorhanden ist.')
  ],{code:"const faecher = new Map<string, number>([['Salami', 3]]);\nfunction bestand(name: string): number | null {\n    return faecher.get(name) ?? null;\n}",
   output:'Fehlende Zutat → null',
   tryIt:'Lege "Salami" mit 3 an und frage den Bestand ab. Was erhältst du?',
   misconception:'Ein Repository ist noch keine Datenbank. Im Speicher vergisst es alles beim Neustart – das kommt in Band 2.',
   solution:'Du erhältst 3. Die Map im Regal enthält jetzt den Schlüssel "Salami" mit dem Wert 3.'}),

  lesson('pizzeria-api',[
   'Jetzt arbeitet alles zusammen: Der Gast schickt eine Bestellung, der Controller nimmt sie an, die Küche prüft sie, das Regal liefert die Zutaten.',
   'Du hast in diesem Band gelernt, wie man Regeln in Code übersetzt – von der ersten WENN-DANN-SONST-Idee bis zur kleinen Web-App. Kein Hello World war nötig.',
   'WENN alle Rollen zusammenarbeiten, DANN entsteht eine echte kleine Anwendung. Zeige sie einem Freund – und erkläre dabei die Regel, nicht die Syntax.'
  ],[
   word('Zusammenspiel','Mehrere Rollen, die jeweils ihre Aufgabe erledigen.'),
   word('Projekt','Eine Anwendung, in der viele gelernte Konzepte zusammenkommen.')
  ],{code:"app.post('/bestellen', (req, res) => {\n    const pizza = String(req.body?.pizza ?? '');\n    res.json({ meldung: `${pizza}: Bestellung angenommen` });\n});",
   output:'{"meldung":"Salami: Bestellung angenommen"}',
   tryIt:'Erkläre einem Freund, was Controller, Service und Regal machen – ganz ohne Fachbegriffe.',
   misconception:'Ein Projekt ist fertig, wenn es läuft – aber nicht, wenn du es nicht mehr erklären kannst. Verständlichkeit gehört zum Ergebnis.',
   solution:'Der Controller nimmt an, der Service entscheidet, das Regal liefert Zutaten. Genau die Rollenteilung aus Stufe 8 und 9.'})
];
