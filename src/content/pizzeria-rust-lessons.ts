import type {BeginnerChapter,BeginnerWord} from './pizzeria-rust-book.ts';

/**
 * Ausformulierte Rust-Lektionen für Kapitel 5–37. Jede Lektion bleibt bewusst kurz:
 * eine Idee, höchstens acht Codezeilen, eine Aufgabe und ein typischer Fehler.
 * Die Java-Lektionen liegen unverändert in pizzeria-lessons.ts.
 */
type Lesson=Pick<BeginnerChapter,'id'|'explain'|'wordbank'|'code'|'output'|'tryIt'|'misconception'|'solution'>;
const lesson=(id:string,explain:readonly string[],wordbank:readonly BeginnerWord[],
 options:{code?:string;output?:string;tryIt:string;misconception:string;solution:string}):Lesson=>
 ({id,explain,wordbank,...options});
const word=(term:string,definition:string):BeginnerWord=>({term,definition});

export const PIZZERIA_RUST_LESSONS:readonly Lesson[]=[
 lesson('greeting',[
  'Dein Laden hat einen Bildschirm an der Tür. Als Erstes soll dort stehen: „Willkommen in der Pizzeria!" Computer können Text ausgeben – das heißt: sie schreiben ihn auf den Bildschirm.',
  'In Rust benutzen wir dafür `println!`. Das Ausrufezeichen zeigt: Das ist ein Makro, also ein kleines Werkzeug, das Rust für dich einsetzt. Wichtig sind die Anführungszeichen: Alles darin ist Text und wird genau so angezeigt.',
  'Du siehst: Programmieren heißt oft nur, dem Computer ganz genau zu sagen, was er tun soll. Heute sagst du ihm: „Gib diesen Text aus."'
 ],[
  word('Ausgabe','Das, was der Computer auf den Bildschirm schreibt, damit du es lesen kannst.'),
  word('Makro','Ein Werkzeug, das du mit ! aufrufst. println! schreibt Text in die Konsole.')
 ],{code:'println!("Willkommen in der Pizzeria!");',
  output:'Willkommen in der Pizzeria!',
  tryIt:'Ändere den Text in deinen eigenen Begrüßungssatz. Was steht jetzt auf dem Bildschirm?',
  misconception:'Ohne Anführungszeichen denkt Rust an einen Namen, den es kennt – und den gibt es vielleicht nicht. Text immer in "..." schreiben.',
  solution:'Zum Beispiel: println!("Hallo, ich bin Mia!"); Es erscheint genau dieser Satz.'}),

 lesson('guest-input',[
  'Ein Gast ruft: „Ich möchte Salami!" Du willst das aufschreiben. Dazu brauchst du eine Eingabe – der Computer liest, was der Gast tippt.',
  'Mit `std::io` holst du dir ein Werkzeug für die Tastatur. `read_line` liest bis zum Enter und schreibt den Text in deine `String`-Variable. Das `&mut` davor bedeutet: Die Variable darf beim Lesen verändert werden.',
  'Danach kannst du den Wunsch weiterverwenden, zum Beispiel mit `trim()` den Druck auf Enter entfernen. Der Computer merkt sich also, was der Gast gesagt hat.'
 ],[
  word('Eingabe','Das, was ein Mensch in das Programm hineintippt.'),
  word('String','Ein Text, der wachsen kann. Mit &mut darf eine Funktion ihn füllen.')
 ],{code:`use std::io;
let mut wunsch = String::new();
io::stdin().read_line(&mut wunsch).expect("Eingabe fehlgeschlagen");
println!("{}", wunsch.trim());`,
  output:'Salami (wenn der Gast Salami tippt)',
  tryIt:'Lass den Gast „Käse" tippen. Was speichert dein Programm jetzt?',
  misconception:'`read_line` liest eine ganze Zeile, auch das Enter am Ende. Mit trim() entfernst du diese unsichtbaren Zeichen wieder.',
  solution:'Der Name `wunsch` enthält jetzt „Käse\\n". Die Ausgabe zeigt mit trim() genau dieses Wort.'}),

 lesson('salami-and-cheese',[
  'Ein Gast will Salami und Käse. Das sind zwei Wünsche gleichzeitig. Beide müssen wahr sein, sonst backst du die falsche Pizza.',
  'In Rust verbindest du zwei Bedingungen mit `&&`. Das liest sich wie „UND". Nur wenn links und rechts wahr sind, gehst du in den DANN-Zweig.',
  'WENN Salami da ist UND Käse da ist, DANN backen. SONST wartest du, bis die Zutaten da sind.'
 ],[
  word('&&','Das Zeichen für „und" in Rust. Beide Bedingungen müssen wahr sein.'),
  word('Bedingung','Eine Frage mit der Antwort wahr oder falsch.')
 ],{code:`let salami = true;
let kaese = true;
if salami && kaese {
    println!("Pizza backen");
}`,
  output:'Pizza backen',
  tryIt:'Setze kaese auf false. Was passiert jetzt?',
  misconception:'`&&` ist nicht dasselbe wie `||`. Bei `||` reicht schon eine wahre Bedingung; bei `&&` brauchst du beide.',
  solution:'Bei kaese = false ist die ganze Bedingung falsch. Der DANN-Zweig wird übersprungen und es gibt keine Ausgabe.'}),

 lesson('forgot-else',[
  'Du sagst dem Computer nur, was er bei Regen tun soll. Es ist aber sonnig. Der Computer weiß nicht, was jetzt gilt – und der Gast steht nass da.',
  'Ein guter WENN-Satz braucht einen SONST-Satz. In Rust ist das `else`. Damit gibt es für jede Situation einen Weg.',
  'WENN es regnet, DANN Schirm nehmen. SONST Sonnenbrille aufsetzen. Beide Fälle sind jetzt geregelt.'
 ],[
  word('else','Der SONST-Teil: Was passiert, wenn die Bedingung falsch ist?'),
  word('Zweig','Ein Weg, den das Programm nehmen kann.')
 ],{code:`let regnet = false;
if regnet {
    println!("Schirm nehmen");
} else {
    println!("Sonnenbrille");
}`,
  output:'Sonnenbrille',
  tryIt:'Setze regnet auf true. Welcher Satz erscheint jetzt?',
  misconception:'`else` gehört zum letzten `if` davor. Und es darf nur genau ein `else` zu einem `if` geben.',
  solution:'Bei true erscheint „Schirm nehmen". Der SONST-Zweig wird dann übersprungen.'}),

 lesson('for-each-ingredient',[
  'Vier Zutaten liegen auf dem Tisch. Du könntest viermal fast dasselbe schreiben. Oder du sagst einmal: „Mach das für jede Zutat."',
  'Genau das ist eine Schleife. In Rust schreibst du `for zutat in zutaten`. Lies es als: „Für jede Zutat im Array zutaten …"',
  'Der Name `zutat` wechselt bei jedem Durchlauf. Beim ersten Mal ist er „Salami", beim nächsten „Käse" – und dein Code bleibt trotzdem nur drei Zeilen lang.'
 ],[
  word('Schleife','Ein Weg, Schritte mehrfach auszuführen, ohne sie mehrfach hinzuschreiben.'),
  word('Array','Eine Sammlung mit fester Länge, zum Beispiel ["Salami", "Käse"].')
 ],{code:`let zutaten = ["Salami", "Käse", "Pilze"];
for zutat in zutaten {
    println!("{zutat}");
}`,
  output:'Salami\nKäse\nPilze',
  tryIt:'Füge „Tomate" zum Array hinzu. Wie viele Zeilen gibt das Programm jetzt aus?',
  misconception:'Die Schleife läuft so oft, wie es Elemente gibt – nicht viermal, nur weil du vier Zutaten hingeschrieben hast. Neue Zutat = ein weiterer Durchlauf.',
  solution:'Vier Zeilen: Salami, Käse, Pilze und Tomate. Der Code selbst bleibt gleich.'}),

 lesson('count-along',[
  'Du willst wissen, wie viele Pizzen heute verkauft wurden. Bei jeder Bestellung sagst du: „Eine mehr."',
  'Im Computer geht das mit einem Zähler. In Rust legst du ihn mit `let mut` an – `mut` erlaubt das Verändern. Bei jeder Pizza schreibst du `zaehler += 1;`.',
  'WENN eine Pizza verkauft wird, DANN erhöhe den Zähler um eins. Nach drei Pizzen steht dort 3.'
 ],[
  word('mut','Das Wort, das eine Bindung veränderbar macht. Ohne mut ist sie fest.'),
  word('Zähler','Eine Zahl, die bei jedem Ereignis um eins weitergeht.')
 ],{code:`let mut zaehler = 0;
zaehler += 1;
zaehler += 1;
println!("{zaehler}");`,
  output:'2',
  tryIt:'Füge eine dritte Zeile `zaehler += 1;` ein. Was steht jetzt auf dem Bildschirm?',
  misconception:'`let zaehler = 0;` wäre fest. Rust meldet einen Fehler, sobald du ohne `mut` etwas zuweisen willst – das schützt dich vor Versehen.',
  solution:'Es steht 3. Der Zähler war 2, dann kam eins dazu.'}),

 lesson('ingredient-list',[
  'Die Zutaten liegen in einer Liste: Salami, Käse, Pilze. Du willst die zweite Zutat wissen. Dafür fragst du nach einer Position.',
  'Diese Position heißt Index. Auch in Rust beginnt sie bei 0 – nicht bei 1. `zutaten[0]` ist Salami, `zutaten[1]` ist Käse, `zutaten[2]` sind Pilze.',
  'WENN du eine Zutat brauchst, DANN frage mit `[Position]` danach. Das ist wie ein Regal mit Nummern an den Fächern.'
 ],[
  word('Index','Die Nummer einer Position in einer Liste. Sie beginnt bei 0.'),
  word('Array','Eine Sammlung mit fester Reihenfolge und fester Länge.')
 ],{code:`let zutaten = ["Salami", "Käse", "Pilze"];
println!("{}", zutaten[1]);`,
  output:'Käse',
  tryIt:'Ändere die 1 in eine 2. Welche Zutat erscheint jetzt?',
  misconception:'Viele denken, [2] sei das zweite Element. Es ist das dritte, weil bei 0 gezählt wird. Eine zu große Nummer lässt Rust abstürzen – später lernst du mit get() eine sanfte Variante.',
  solution:'Bei [2] erscheinen „Pilze". Die Position 2 ist das dritte Fach im Regal.'}),

 lesson('ingredient-card',[
  'Salami hat einen Namen und ein Gewicht. Zwei einzelne Variablen wären unübersichtlich. Du schreibst alles auf eine Karte.',
  'In Rust kannst du dafür eine `struct` benutzen. Du sagst nur, welche Felder die Karte hat. Mit `#[derive(Debug)]` kann Rust sie für dich lesbar ausgeben – und mit Clone, PartialEq und Eq kannst du sie kopieren und vergleichen.',
  'WENN mehrere Werte zusammengehören, DANN bündele sie in einer Struct. Dein Code wird kürzer und du findest die Zutat schneller wieder.'
 ],[
  word('Struct','Eine Datenkarte mit fest benannten Feldern in Rust.'),
  word('derive','Ein Attribut, mit dem Rust nützliche Traits wie Debug oder PartialEq automatisch ergänzt.')
 ],{code:`#[derive(Debug, Clone, PartialEq, Eq)]
struct Zutat { name: String, gramm: u32 }
let salami = Zutat { name: String::from("Salami"), gramm: 30 };
println!("{salami:?}");`,
  output:'Zutat { name: "Salami", gramm: 30 }',
  tryIt:'Erzeuge eine zweite Karte für Käse mit 40 Gramm. Wie sieht die Ausgabe aus?',
  misconception:'Ein derive ist keine Zauberei ohne Regel: Du musst trotzdem angeben, welche Felder die Struct hat. Rust schreibt nur die lästigen Teile für dich.',
  solution:'Zutat { name: "Käse", gramm: 40 }. Die Karte zeigt beide Felder.'}),

 lesson('same-dough',[
  'Dein Teig besteht immer aus denselben vier Zahlen: Mehl, Wasser, Salz, Hefe. Du willst nicht, dass jemand heimlich das Wasser ändert.',
  'Eine Rust-Struct ist standardmäßig unveränderlich: Ohne `mut` an der Variablen kannst du kein Feld überschreiben. Das ist wie ein ausgedrucktes Rezept statt einer löschbaren Notiz.',
  'WENN etwas immer gleich bleiben soll, DANN nimm eine Struct ohne mut. Der Wert bleibt das, was du beim Erzeugen hingeschrieben hast.'
 ],[
  word('Unveränderlich','Ein Wert, der nach dem Erzeugen nicht mehr geändert werden kann.'),
  word('Feld','Ein benannter Platz auf der Karte, zum Beispiel das Wasser.')
 ],{code:`#[derive(Debug, Clone, PartialEq, Eq)]
struct Teig { mehl: u32, wasser: u32, salz: u32, hefe: u32 }
let standard = Teig { mehl: 500, wasser: 350, salz: 10, hefe: 5 };
println!("{}", standard.wasser);`,
  output:'350',
  tryIt:'Frage das Salz ab statt das Wasser. Welche Zahl erscheint?',
  misconception:'`standard.wasser` liest das Feld – es ändert es nicht. Mit `let mut standard = ...` könntest du es verändern, aber das willst du hier ja gerade nicht.',
  solution:'Es erscheint 10. Mit `standard.salz` liest du ein anderes Feld derselben Karte.'}),

 lesson('two-equal-doughs',[
  'Zwei Teigkarten haben dieselben Zahlen. Es sind zwei Werte – aber der Teig ist gleich. Willst du das prüfen, fragst du nach dem Inhalt.',
  'In Rust bekommst du das mit `#[derive(PartialEq, Eq)]`. Danach vergleicht `a == b` alle Felder. `Eq` sagt zusätzlich: Diese Gleichheit ist sauber und immer gültig.',
  'WENN alle Felder übereinstimmen, DANN sind die Teige gleich. Das unterscheidet Inhalt von Identität – wie zwei Zettel mit demselben Rezept.'
 ],[
  word('Wertgleichheit','Zwei Werte sind gleich, weil ihr Inhalt übereinstimmt.'),
  word('PartialEq','Das Trait, das == für einen eigenen Typ möglich macht. Eq ergänzt es.')
 ],{code:`#[derive(Debug, Clone, PartialEq, Eq)]
struct Teig { mehl: u32, wasser: u32 }
let a = Teig { mehl: 500, wasser: 350 };
let b = Teig { mehl: 500, wasser: 350 };
println!("{}", a == b);`,
  output:'true',
  tryIt:'Ändere bei b die 350 in 400. Was gibt das Programm jetzt aus?',
  misconception:'Ohne `#[derive(PartialEq, Eq)]` kennt Rust kein == für deine Struct. Der Vergleich ist kein Geschenk, sondern ein bewusst gewähltes Trait.',
  solution:'Bei 400 ist ein Feld anders, also erscheint false. Die Teige sind nicht mehr gleich.'}),

 lesson('ingredient-box',[
  'Du baust eine Kiste, in die eine Zutat hineinkommt. Mal ist es Salami, mal Käse. Du schreibst die Kiste nur einmal – mit einem Platzhalter `T`.',
  'Rust nennt so einen Typparameter `T`. Beim Benutzen legt der Compiler fest, was `T` diesmal ist: `Kiste<&str>` für Text, `Kiste<i32>` für eine Zahl.',
  'WENN eine Kiste für verschiedene Inhalte gedacht ist, DANN gib ihr einen Typplatzhalter. So brauchst du keine zweite Kiste für jeden Belag.'
 ],[
  word('Generics','Eine Kiste mit Typplatzhalter, die für verschiedene Inhalte benutzt werden kann.'),
  word('Kiste','Unser Name für die Box. Rust hat selbst ein Box<T> für den Heap, darum wählen wir einen anderen Namen.')
 ],{code:`struct Kiste<T> { inhalt: T }
let salami = Kiste { inhalt: "Salami" };
println!("{}", salami.inhalt);`,
  output:'Salami',
  tryIt:'Baue eine zweite Kiste für den Text "Käse". Wie heißt der Typ?',
  misconception:'`T` ist kein geheimer Wert. Es ist nur ein Platzhalter für einen Typ – wie ein leeres Etikett an der Box.',
  solution:'Auch sie ist eine Kiste<&str>. Der Inhalt ist anders, der Typ bleibt Text.'}),

 lesson('salami-not-cheese',[
  'Eine Salami-Kiste und eine Käse-Kiste sehen gleich aus. Du darfst sie aber nicht verwechseln – sonst liegt plötzlich Käse im Salami-Fach.',
  'Rust prüft das streng: `Kiste<Salami>` und `Kiste<Kaese>` sind zwei verschiedene Typen. Der Compiler unterscheidet sie, auch wenn beide Structs dieselben Felder haben.',
  'WENN der Inhalt unterschiedlich ist, DANN sind es verschiedene Kisten. Der Compiler hilft dir, die Fächer sortiert zu halten.'
 ],[
  word('Typsicherheit','Der Compiler verhindert, dass ein Wert in das falsche Fach gelegt wird.'),
  word('Compiler','Das Werkzeug, das deinen Rust-Code prüft, bevor er läuft.')
 ],{code:`#[derive(Debug, Clone, PartialEq, Eq)]
struct Salami { name: String }
#[derive(Debug, Clone, PartialEq, Eq)]
struct Kaese { name: String }
let fach1 = Kiste { inhalt: Salami { name: "Salami".into() } };
let fach2 = Kiste { inhalt: Kaese { name: "Käse".into() } };`,
  output:'(zwei getrennte Fächer)',
  tryIt:'Versuche, fach1 eine Kaese hineinzugeben. Was sagt der Compiler?',
  misconception:'Weil beide Karten Felder haben, heißt das nicht, dass sie gleich sind. Der Typ in der Kiste bleibt entscheidend.',
  solution:'Der Compiler meldet einen Fehler: In eine Kiste<Salami> passt kein Kaese. Genau das wolltest du.'}),

 lesson('many-kinds',[
  'Jetzt willst du eine Kiste, die alle Beläge aufnimmt – Salami, Käse und Pilze. Aber keine Nudeln, bitte.',
  'Dafür benennst du eine gemeinsame Regel: `trait Belag`. Dann schreibst du `struct Kiste<T: Belag>`. Das heißt: T darf jeder Typ sein, der dieses Trait implementiert.',
  'WENN mehrere Sorten erlaubt sind, DANN benenne die gemeinsame Grenze. SONST darf alles hinein – auch Nudeln.'
 ],[
  word('Trait','Ein Vertrag mit Aufgaben, den ein Typ erfüllen kann.'),
  word('Trait Bound','Die Grenze T: Belag – der Typ muss das Trait implementieren.')
 ],{code:`trait Belag {}
#[derive(Debug, Clone, PartialEq, Eq)]
struct Salami { name: String }
impl Belag for Salami {}
struct Kiste<T: Belag> { inhalt: T }`,
  output:'(Salami passt, Nudeln nicht)',
  tryIt:'Erfinde eine Struct Nudel ohne impl Belag. Darf sie in die Kiste?',
  misconception:'`T: Belag` ist keine Klassenvererbung. Auch ganz unabhängige Structs können das Trait implementieren – sie müssen nur die vereinbarten Aufgaben anbieten.',
  solution:'Nein. Nudel erfüllt den Vertrag Belag nicht, also weist der Compiler sie ab.'}),

 lesson('recipe-card',[
  'Du machst jeden Tag denselben Teig. Statt die Schritte immer wieder neu zu schreiben, gibst du dem Rezept einen Namen.',
  'Eine Funktion ist genau so ein benanntes Rezept. Du schreibst sie einmal mit `fn` und rufst sie bei Bedarf auf. Der Computer führt dann alle Schritte aus.',
  'WENN du dieselbe Arbeit oft brauchst, DANN schreibe eine Funktion. Das spart Tipparbeit und verhindert, dass du beim zweiten Mal etwas vergisst.'
 ],[
  word('Funktion','Ein benanntes Rezept mit Schritten, das du mehrfach aufrufen kannst.'),
  word('Aufruf','Der Moment, in dem du das Rezept benutzt.')
 ],{code:`fn teig_machen() {
    println!("Mehl, Wasser, Salz, Hefe");
}
teig_machen();`,
  output:'Mehl, Wasser, Salz, Hefe',
  tryIt:'Rufe teig_machen() zweimal auf. Was siehst du auf dem Bildschirm?',
  misconception:'Das Rezept wird erst beim Aufruf ausgeführt. Nur hinschreiben reicht nicht – du musst den Namen auch aufrufen.',
  solution:'Die Zutatenzeile erscheint zweimal. Jeder Aufruf führt das Rezept erneut aus.'}),

 lesson('pass-ingredients',[
  'Dein Teigrezept braucht Mehl und Wasser. Diese Werte gibst du beim Aufruf mit – wie Zutaten, die du dem Koch reichst.',
  'Diese übergebenen Werte heißen Parameter. In Rust stehen Typ und Name zusammen: `anzahl: i32`. Der letzte Ausdruck ohne Semikolon ist der Rückgabewert.',
  'WENN ein Rezept Zutaten braucht, DANN übergib sie beim Aufruf. SONST müsste das Rezept immer dieselbe Menge backen.'
 ],[
  word('Parameter','Ein Wert mit Typ, den du einer Funktion beim Aufruf mitgibst.'),
  word('Rückgabewert','Der letzte Ausdruck der Funktion – hier das Ergebnis der Rechnung.')
 ],{code:`fn preis(anzahl: i32) -> i32 {
    anzahl * 8
}
println!("{}", preis(2));`,
  output:'16',
  tryIt:'Rufe preis(3) auf. Was kommt heraus?',
  misconception:'Ein Semikolon hinter `anzahl * 8` würde den Ausdruck zu einer Anweisung machen und die Funktion gäbe nichts zurück. Gerade beim Rückgabewert steht es also nicht.',
  solution:'Bei 3 Pizzen kommt 24 heraus. Der Parameter anzahl wurde durch 3 ersetzt.'}),

 lesson('kitchen-job',[
  'Dein Laden hat viele Aufgaben. Wenn alles in einer Struct passiert – kochen, kassieren, aufräumen –, verlierst du den Überblick.',
  'Du teilst die Arbeit in Rollen. Eine `struct` hält die Daten, ein `impl`-Block die Aufgaben. Die Küche backt, die Kasse nimmt Geld.',
  'WENN eine Aufgabe groß ist, DANN teile sie in Rollen. Jede Rolle kennt nur ihre eigenen Details – das nennt man Kapselung.'
 ],[
  word('impl','Der Block, in dem du Methoden für eine Struct schreibst.'),
  word('Kapselung','Details bleiben in der Rolle und stören andere Teile nicht.')
 ],{code:`struct Kueche;
impl Kueche {
    fn backen(&self) { println!("Pizza ist fertig"); }
}
Kueche.backen();`,
  output:'Pizza ist fertig',
  tryIt:'Gib der Küche eine zweite Aufgabe namens aufraeumen(). Wie sieht der impl-Block jetzt aus?',
  misconception:'`&self` leiht die Struct nur aus, statt sie zu verbrauchen. Ohne & müsste die Struct nach dem Aufruf neu erzeugt werden.',
  solution:'Du ergänzt `fn aufraeumen(&self)` mit einer eigenen Ausgabe. Beide Methoden stehen im selben impl-Block.'}),

 lesson('chef-and-apprentice',[
  'Der Azubi soll alles können, was der Chef kann – und zusätzlich den Boden putzen. In Rust schreibst du die Koch-Aufgaben nicht zweimal.',
  'Rust kennt keine Klassenvererbung. Stattdessen teilen Chef und Azubi das Trait `Backen`. Der Azubi ruft in seiner eigenen Methode einfach `Chef.backen()` auf und ergänzt das Putzen.',
  'WENN eine Rolle die Aufgaben einer anderen braucht, DANN gib beiden dasselbe Trait. SONST schreibst du dieselben Schritte zweimal.'
 ],[
  word('Trait','Ein Vertrag, den mehrere Typen erfüllen können – hier: backen.'),
  word('Delegation','Eine Rolle ruft eine andere Rolle auf, statt deren Code zu kopieren.')
 ],{code:`trait Backen { fn backen(&self); }
struct Chef;
impl Backen for Chef { fn backen(&self) { println!("Backen"); } }
struct Azubi;
impl Backen for Azubi { fn backen(&self) { Chef.backen(); println!("Putzen"); } }`,
  output:'Backen\nPutzen',
  tryIt:'Rufe backen() auf dem Azubi auf. Was erscheint?',
  misconception:'Der Chef kann nicht automatisch putzen – nur der Azubi. Es gibt kein `extends`; gemeinsames Verhalten kommt aus dem Trait.',
  solution:'Es erscheinen „Backen" und „Putzen". Der Azubi hat beide Aufgaben.'}),

 lesson('label-shelf',[
  'Dein Regal hat viele Fächer. Du willst die Salami über ihren Namen finden, nicht über eine Nummer. Dafür klebst du Etiketten.',
  'In Rust heißt so ein Etikett Schlüssel. Die `HashMap` verbindet Schlüssel und Wert: `"Salami"` zeigt auf die Zahl 3.',
  'WENN du etwas über einen Namen finden willst, DANN nimm eine HashMap. SONST musst du alle Fächer einzeln durchsuchen.'
 ],[
  word('HashMap','Eine Sammlung, in der ein Schlüssel zu einem Wert führt.'),
  word('Option','Der Rückgabetyp von get(): Some(3), wenn es den Schlüssel gibt, sonst None.')
 ],{code:`use std::collections::HashMap;
let mut regal = HashMap::new();
regal.insert("Salami", 3);
println!("{:?}", regal.get("Salami"));`,
  output:'Some(3)',
  tryIt:'Lege einen zweiten Schlüssel "Käse" mit 5 an. Was gibt regal.get("Käse") aus?',
  misconception:'Die HashMap hat keine Reihenfolge, die du dir merken kannst. Und get() liefert Some(3), nicht einfach 3 – der Fund ist bewusst als Option markiert.',
  solution:'Es erscheint Some(5). Der Schlüssel "Käse" führt direkt zu diesem Wert.'}),

 lesson('no-duplicates',[
  'Zwei Mitarbeiter schreiben „Salami" ins Zutatenbuch. Du willst sie nur einmal zählen.',
  'Ein `HashSet` ist eine Sammlung, die Doppelte automatisch weg lässt. `insert("Salami")` zum zweiten Mal verändert nichts – die Länge bleibt gleich.',
  'WENN etwas nur einmal vorkommen darf, DANN nimm ein HashSet. Das ist wie eine Gästeliste: Dieselbe Person steht nicht zweimal drauf.'
 ],[
  word('HashSet','Eine Sammlung ohne doppelte Einträge.'),
  word('Duplikat','Ein zweiter Eintrag mit demselben Wert.')
 ],{code:`use std::collections::HashSet;
let mut zutaten = HashSet::new();
zutaten.insert("Salami");
zutaten.insert("Salami");
println!("{}", zutaten.len());`,
  output:'1',
  tryIt:'Füge "Käse" hinzu. Wie groß ist das HashSet jetzt?',
  misconception:'Bei einem Array wären jetzt zwei Salami-Einträge. Beim HashSet bleibt es bei einem – deshalb ist die Ausgabe 1.',
  solution:'Das HashSet hat dann zwei Einträge: Salami und Käse. Die Ausgabe ist 2.'}),

 lesson('sum-prices',[
  'Am Ende des Tages willst du wissen, wie viel Geld du eingenommen hast. Du hast eine Liste mit Preisen.',
  'Statt eine Schleife zu schreiben, kannst du eine Kette benutzen: `iter()` geht die Werte durch, `copied()` macht Zahlen daraus, `sum()` addiert alles.',
  'WENN du viele Zahlen zu einer Summe machen willst, DANN benutze eine Iterator-Kette. Jeder Schritt hat eine klare Aufgabe.'
 ],[
  word('Iterator','Eine Kette von Schritten, die Werte nacheinander liefert.'),
  word('Summe','Das Ergebnis des Addierens.')
 ],{code:`let preise = [8i32, 8, 12];
let summe: i32 = preise.iter().copied().sum();
println!("{summe}");`,
  output:'28',
  tryIt:'Füge eine 5 zum Array hinzu. Was ist die neue Summe?',
  misconception:'Die Kette verändert das Array nicht. `iter()` leiht nur die Werte, `sum()` erzeugt ein neues Ergebnis.',
  solution:'Die neue Summe ist 33. Das Array selbst bleibt unverändert.'}),

 lesson('rule-lambda',[
  'Deine Rabattregel ist ein kleiner Satz: „Vom Preis geht ein Zehntel ab." Du willst sie wie einen Zettel weitergeben.',
  'Ein Closure ist genau so ein Zettel: `|preis| preis / 10`. Du schreibst keine Struct, sondern nur die Regel selbst – und kannst sie in einer Variablen speichern.',
  'WENN du eine Regel weitergeben willst, DANN schreibe eine Closure. Das ist kürzer als eine ganze Methode.'
 ],[
  word('Closure','Eine kleine Funktion ohne Namen, die du übergeben kannst.'),
  word('Rabatt','Ein Betrag, der vom Preis abgezogen wird.')
 ],{code:`let rabatt = |preis: i32| preis / 10;
println!("{}", rabatt(50));`,
  output:'5',
  tryIt:'Was gibt rabatt(100) aus? Und was passiert bei rabatt(9) – warum ist das anders als du vielleicht erwartest?',
  misconception:'Die Closure wird nicht sofort ausgeführt. Erst mit rabatt(50) benutzt du die Regel.',
  solution:'Bei 100 ist ein Zehntel 10. Bei 9 wäre es 0,9 – mit ganzen Zahlen kommt aber 0 heraus, weil der Rest wegfällt. Die Regel wurde mit dem neuen Wert angewendet.'}),

 lesson('salami-gone',[
  'Ein Gast will Salami. Im Regal ist nichts mehr. Du willst nicht einfach 0 schreiben – du willst sagen: „Salami fehlt."',
  '`Option<T>` ist ein Enum mit zwei Fällen: `Some(T)` enthält einen Wert, `None` ist leer. `unwrap_or("Käse")` liefert den Ersatz, falls nichts drin ist.',
  'WENN etwas fehlen kann, DANN zeige das ausdrücklich an. Der Gast weiß dann, was los ist – statt eine falsche Zahl zu sehen.'
 ],[
  word('Option<T>','Ein Typ, der einen Wert enthalten kann – oder auch leer sein.'),
  word('Ersatzwert','Ein Wert, der benutzt wird, wenn nichts gefunden wurde.')
 ],{code:`let salami: Option<&str> = None;
println!("{}", salami.unwrap_or("Käse"));`,
  output:'Käse',
  tryIt:'Setze stattdessen Some("Salami"). Was erscheint jetzt?',
  misconception:'Option ist nicht dasselbe wie null. Rust zwingt dich, den leeren Fall aktiv zu behandeln – genau das macht unwrap_or für dich.',
  solution:'Es erscheint „Salami". Die Option ist gefüllt, darum wird der Ersatz nicht gebraucht.'}),

 lesson('polite-error',[
  'Die Salami fehlt. Du könntest das Programm einfach abstürzen lassen. Besser ist eine klare Meldung: „Salami fehlt im Regal."',
  'In Rust nutzen wir `Result<T, E>`: `Ok(T)` für den Erfolg, `Err(E)` für den Fehler. Das Programm bricht nicht einfach ab – der Fehler ist ein ganz normaler Rückgabewert.',
  'WENN etwas schiefgeht, DANN gib ein verständliches Err zurück. SONST rät der Gast, was passiert ist.'
 ],[
  word('Result<T, E>','Ein Typ mit Erfolgs- und Fehlerzweig. Das E steht für den Fehlertyp.'),
  word('?','Das Zeichen, das einen Fehler nach oben weitergibt, statt ihn hier zu behandeln.')
 ],{code:`fn bestellen(bestand: i32) -> Result<(), String> {
    if bestand < 1 {
        return Err("Salami fehlt im Regal".into());
    }
    Ok(())
}`,
  output:'Err("Salami fehlt im Regal") bei bestand = 0',
  tryIt:'Setze bestand auf 2. Was passiert jetzt?',
  misconception:'`unwrap()` würde bei Err abstürzen. Für Gäste ist eine höfliche Meldung besser – behandle den Fehler also mit match, ? oder einer Antwortfunktion.',
  solution:'Bei 2 ist die Bedingung falsch. Die Funktion liefert Ok(()) und das Programm läuft normal weiter.'}),

 lesson('first-junit',[
  'Du willst morgens schnell wissen, ob deine Rabattregel noch stimmt. Ein Test prüft das automatisch – schneller als jedes Mal neu nachzurechnen.',
  'In Rust schreibst du `#[test]` über eine Funktion. `cargo test` findet sie und führt sie aus. `assert_eq!` vergleicht Erwartung und Ergebnis.',
  'WENN du eine Regel änderst, DANN prüfe sie mit einem Test. Besonders Grenzfälle wie 0 oder 1 sind wichtig.'
 ],[
  word('Test','Eine automatische Prüfung, ob etwas das richtige Ergebnis liefert.'),
  word('Grenzfall','Ein besonderer Wert ganz am Rand, zum Beispiel 0.')
 ],{code:`fn rabatt(preis: i32) -> i32 { preis / 10 }
#[test]
fn rabatt_bei_null() { assert_eq!(0, rabatt(0)); }`,
  output:'Test bestanden (1 passed)',
  tryIt:'Schreibe einen zweiten Test für rabatt(50). Was erwartest du?',
  misconception:'Ein Test prüft nur das, was du hinschreibst. Wenn du den Grenzfall vergisst, findet der Test ihn auch nicht.',
  solution:'Bei 50 ist ein Zehntel 5. Der Test assert_eq!(5, rabatt(50)) sollte bestehen.'}),

 lesson('one-file-not-enough',[
  'Deine Pizzeria steht in einer Datei mit 1.000 Zeilen. Du suchst die Preisregel und findest sie erst nach fünf Minuten.',
  'Du teilst den Laden in Module auf: `mod bestellung;` für den Eingang, `mod kueche;` für die Regeln, `mod regal;` für die Daten. Jedes Modul liegt in einer eigenen Datei.',
  'WENN eine Datei zu groß wird, DANN teile sie in Module. Das ist wie ein Laden mit getrennten Arbeitsplätzen statt einem überfüllten Raum.'
 ],[
  word('Modul','Ein eigener Bereich für zusammengehörigen Code, oft eine eigene Datei.'),
  word('Struktur','Die Ordnung, in der du deinen Code aufteilst.')
 ],{code:`mod bestellung;
mod kueche;
mod regal;
fn main() { /* Rollen werden hier verdrahtet */ }`,
  output:'(drei getrennte Arbeitsplätze)',
  tryIt:'Welches Modul wäre zuständig, wenn ein Gast die Rechnung will?',
  misconception:'Module sind keine extra Arbeit um der Module willen. Sie helfen erst, wenn der Laden größer wird.',
  solution:'Das Modul bestellung. Die Küche kocht, das Regal liefert Zutaten.'}),

 lesson('one-job',[
  'Wenn die Kassiererin gleichzeitig kocht und im Regal steht, verliert sie den Überblick. Jede Rolle soll genau eine Aufgabe haben.',
  'Diese Regel heißt: eine Struct – eine Aufgabe. Wenn du merkst, dass ein Name „und" braucht, teile die Rolle.',
  'WENN eine Struct zwei Aufgaben hat, DANN teile sie. SONST wird sie schwer veränderbar.'
 ],[
  word('Aufgabe','Die Sache, für die eine Struct zuständig ist.'),
  word('Verantwortung','Die Arbeit, die eine Rolle übernimmt.')
 ],{code:`struct Regal { bestand: i32 }
impl Regal { fn menge(&self) -> i32 { self.bestand } }
struct Kueche;
impl Kueche { fn backen(&self) { println!("Fertig"); } }`,
  output:'(Regal speichert, Küche backt)',
  tryIt:'Finde eine dritte Aufgabe und gib ihr eine eigene Struct.',
  misconception:'Eine Struct darf ruhig mehrere kleine Methoden haben – aber sie sollten alle zu derselben Aufgabe gehören.',
  solution:'Zum Beispiel eine Kasse, die den Preis berechnet. Sie gehört nicht in die Küche.'}),

 lesson('project-order',[
  'Du baust deinen Laden jeden Tag neu. Du willst einen Knopf, der alles erledigt: Code prüfen, starten und Fehler anzeigen.',
  'Cargo ist so ein Baumeister. In `Cargo.toml` stehen Name, Version und Abhängigkeiten. `cargo run` startet die Anwendung, `cargo test` prüft, `cargo clippy` gibt Hinweise.',
  'WENN du ein Projekt öfter baust, DANN brauchst du Werkzeuge und Einstellungen. SONST machst du alles von Hand.'
 ],[
  word('Cargo','Das Werkzeug, das ein Rust-Projekt baut, testet und startet.'),
  word('Konfiguration','Einstellungen, die du außerhalb des Codes änderst.')
 ],{code:`[package]
name = "pizzeria"
version = "0.1.0"
edition = "2024"
# danach: cargo run · cargo test · cargo clippy`,
  output:'cargo run startet die Pizzeria',
  tryIt:'Ändere den Namen auf "pizzeria-mia". Wie heißt das Programm nach cargo build?',
  misconception:'Cargo.toml ist keine Programmdatei. Du beschreibst darin das Projekt; den Code schreibst du in src/main.rs.',
  solution:'Die fertige Datei heißt pizzeria-mia. Der Paketname bestimmt den Namen des gebauten Programms.'}),

 lesson('first-http',[
  'Ein Gast soll deine Pizzeria vom Handy ansehen können. Dazu braucht er eine Adresse, die er im Browser eintippt.',
  'Mit Axum legst du eine Route an: `Router::new().route("/pizzen", get(..))`. `Json` verwandelt deine Liste in das Textformat JSON, das der Browser versteht.',
  'WENN jemand die Adresse aufruft, DANN antworte mit einer Liste. Das ist der erste Schritt vom Programm zur Web-Anwendung.'
 ],[
  word('Route','Eine Adresse, die zu einer bestimmten Aufgabe in deiner Anwendung gehört.'),
  word('JSON','Ein Textformat, mit dem Programme Daten austauschen.')
 ],{code:`use axum::{routing::get, Json, Router};
let app = Router::new().route("/pizzen", get(|| async {
    Json(vec!["Salami", "Käse"])
}));`,
  output:'["Salami", "Käse"]',
  tryIt:'Füge „Pilze" zur Liste hinzu. Was sieht der Gast jetzt?',
  misconception:'`get` bedeutet nur „zeig mir Daten". Um etwas zu bestellen, brauchst du später `post`.',
  solution:'Die Antwort enthält dann drei Pizzen: Salami, Käse und Pilze.'}),

 lesson('restaurant-leader',[
  'Küche, Regal und Kasse müssen zusammenarbeiten. Jemand muss sie miteinander bekannt machen. In Rust übernimmst du das in der Funktion main selbst.',
  'Du legst ein `AppState` an, das deine Rollen enthält, und gibst es Axum mit `with_state`. Das ist kein magischer Container: Du schreibst die Verdrahtung selbst und siehst sie an einer Stelle.',
  'WENN Rollen zusammenarbeiten, DANN verdrahte sie an einer zentralen Stelle. Du bekommst sie nicht gereicht – du reichst sie selbst weiter.'
 ],[
  word('AppState','Deine eigene Struct mit den Diensten, die alle Handler brauchen.'),
  word('tokio','Die Laufzeit, die Async-Aufgaben in Rust ausführt. Axum braucht sie.')
 ],{code:`#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let state = AppState::new(); // Regal + Küche
    let app = Router::new().route("/pizzen", get(pizzen)).with_state(state);
    let listener = TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app).await?;
    Ok(())
}`,
  output:'Die Pizzeria-App horcht auf Port 3000.',
  tryIt:'Starte die App und öffne http://localhost:3000/pizzen.',
  misconception:'Hier passiert keine Magie: Mit with_state gibst du dem Router deinen Zustand. Das ? gibt Fehler nach oben, statt sie zu verstecken.',
  solution:'Du siehst im Browser eine JSON-Liste mit deinen Pizzen. Dort ist dein Laden erreichbar.'}),

 lesson('cashier',[
  'Die Kassiererin sitzt am Eingang. Sie nimmt die Bestellung entgegen und gibt eine Antwort zurück. Im Code heißt sie Handler.',
  'Mit `post(bestellen)` sagst du Axum: „Hier kommen Bestellungen an." Der Handler bekommt den Zustand mit `State` und antwortet mit JSON.',
  'WENN ein Gast eine Bestellung schickt, DANN nimmt der Handler sie an. Er kocht nicht selbst – er gibt die Arbeit weiter.'
 ],[
  word('Handler','Eine Funktion, die eine Anfrage annimmt und antwortet.'),
  word('POST','Eine Anfrage, die neue Daten schickt – hier eine Bestellung.')
 ],{code:`async fn bestellen(State(st): State<AppState>) -> Json<Antwort> {
    Json(Antwort { text: "Bestellung angekommen".into() })
}
let app = Router::new().route("/bestellung", post(bestellen)).with_state(st);`,
  output:'{"text":"Bestellung angekommen"}',
  tryIt:'Ändere den Text der Antwort in deinen eigenen Satz.',
  misconception:'Der Handler soll keine Preise berechnen. Er nimmt nur an und antwortet – die Regeln kommen in eine eigene Funktion.',
  solution:'Die Antwort zeigt jetzt deinen neuen Text. Die Adresse /bestellung bleibt gleich.'}),

 lesson('kitchen',[
  'Der Küchenchef entscheidet, was mit der Bestellung passiert. Er weiß nichts vom Bildschirm oder vom Handy – er bekommt nur die Bestellung und das Regal.',
  'In Rust ist das eine normale Funktion mit `Result`. Sie trägt die fachlichen Regeln: genug Zutaten? Welcher Preis? Darum steht sie in einem eigenen Modul.',
  'WENN die Bestellung angekommen ist, DANN arbeite sie in der Küche weiter. Eingabe und Verarbeitung bleiben getrennt.'
 ],[
  word('Service','Der Ort, an dem die fachlichen Regeln stehen.'),
  word('Trennung','Eingabe und Verarbeitung liegen in verschiedenen Funktionen.')
 ],{code:`fn backen(pizza: &str, regal: &Regal) -> Result<String, Fehler> {
    if regal.menge(pizza) < 1 { return Err(Fehler::Fehlt); }
    Ok(format!("{pizza} ist fertig"))
}`,
  output:'Ok("Salami ist fertig")',
  tryIt:'Rufe backen("Käse", regal) auf. Was kommt zurück?',
  misconception:'Ein Service ist keine Website. Er ist nur eine Funktion mit Regeln – der Handler ruft sie auf.',
  solution:'Es kommt Ok("Käse ist fertig") zurück. Die Regel wurde mit einem anderen Namen angewendet.'}),

 lesson('shelf',[
  'Das Regal merkt sich, wie viele Zutaten da sind. Es kümmert sich nicht um Gäste oder Preise. Es kennt nur Fächer und Bestände.',
  'In dieser Fassung fragt das Regal eine SQLite-Datei. In Band 2 kommt eine echte Datenbank hinzu – der Rest der App merkt kaum etwas, weil nur diese Funktion angepasst wird.',
  'WENN Daten nachgeschlagen werden, DANN frag das Regal. SONST wühlt die Küche selbst im Bestand.'
 ],[
  word('Repository','Eine Funktion oder Struct, die den Zugriff auf Daten übernimmt.'),
  word('rusqlite','Eine Rust-Bibliothek für SQLite. Die Datenbank läuft im Programm.')
 ],{code:`use rusqlite::OptionalExtension;
fn menge(conn: &Connection, name: &str) -> Result<Option<i32>, rusqlite::Error> {
    conn.query_row("SELECT menge FROM zutat WHERE name = ?1", [name], |row| row.get(0)).optional()
}`,
  output:'Ok(Some(3)) oder Ok(None)',
  tryIt:'Lege "Salami" mit 3 an und frage den Bestand ab. Was erhältst du?',
  misconception:'Ein Repository ist noch keine vollständige Datenbank-Schicht. Wichtig ist die Grenze: Nur hier steht SQL, die Küche kennt keine Abfragen.',
  solution:'Du erhältst Ok(Some(3)). Die Tabelle enthält den Datensatz mit dem Wert 3.'}),

 lesson('pizzeria-api',[
  'Jetzt arbeitet alles zusammen: Der Gast schickt eine Bestellung, der Handler nimmt sie an, die Küche prüft sie, das Regal liefert die Zutaten.',
  'Du hast in diesem Band gelernt, wie man Regeln in Rust-Code übersetzt – von der ersten WENN-DANN-SONST-Idee bis zur kleinen Web-App. Kein Hello World war nötig.',
  'WENN alle Rollen zusammenarbeiten, DANN entsteht eine echte kleine Anwendung. Zeige sie einem Freund – und erkläre dabei die Regel, nicht die Syntax.'
 ],[
  word('Zusammenspiel','Mehrere Rollen, die jeweils ihre Aufgabe erledigen.'),
  word('Projekt','Eine Anwendung, in der viele gelernte Konzepte zusammenkommen.')
 ],{code:`async fn bestellen(State(st): State<AppState>, Json(b): Json<Bestellung>)
    -> Result<Json<Antwort>, ApiError> {
    if st.regal.menge(&b.pizza)?.unwrap_or(0) == 0 { return Err(ApiError::Fehlt); }
    Ok(Json(Antwort { text: format!("{}: angenommen", b.pizza) }))
}`,
  output:'{"text":"Salami: angenommen"}',
  tryIt:'Erkläre einem Freund, was Handler, Küche und Regal machen – ganz ohne Fachbegriffe.',
  misconception:'Ein Projekt ist fertig, wenn es läuft – aber nicht, wenn du es nicht mehr erklären kannst. Verständlichkeit gehört zum Ergebnis.',
  solution:'Der Handler nimmt an, die Küche entscheidet, das Regal liefert Zutaten. Genau die Rollenteilung aus Stufe 8 und 9.'})
];
