import type {Concept,LanguageId,LanguageVariant,ComparisonKind} from './concepts.ts';
import type {Stage} from '../shared/types';

/** Weitere konzeptuelle Lektionen, eigenständig aus den hinterlegten Referenzen formuliert. */
const v=(language:LanguageId,name:string,code:string,explanation:string,differences:string,docs:string,equivalence:ComparisonKind='similar'):LanguageVariant=>
 ({language,name,code,explanation,differences,docs,equivalence});
const c=(id:string,title:string,area:Concept['area'],stage:Stage,question:string,intuition:string,mentalModel:string,
 walkthrough:string[],tradeoffs:string[],prerequisiteIds:string[],tags:string[],exercise:string,hint:string,solution:string,
 variants:LanguageVariant[]):Concept=>
 ({id,title,area,stage,question,intuition,mentalModel,walkthrough,tradeoffs,prerequisiteIds,tags,exercise,hint,solution,variants});

export const EXPANDED_CONCEPTS:readonly Concept[]=[
 c('ownership','Besitz & Lebensdauer','abstraction','advanced',
  'Wer darf einen Wert wann benutzen und aufräumen?',
  'Besitz regelt die Verantwortung für einen Wert. Andere dürfen ihn leihen, aber nicht beliebig lange festhalten.',
  'Ein Schlüsselbund: Wer den Schlüssel besitzt, entscheidet, wann er weitergegeben oder zurückgegeben wird.',
  ['Ein Wert wird erzeugt und einer klaren Verantwortung zugeordnet.',
   'Andere Codebereiche leihen ihn nur für einen begrenzten Zeitraum.',
   'Nach Ende der Lebensdauer darf niemand mehr auf den Wert zugreifen.',
   'Bei Ressourcen wie Dateien oder Sockets ist die Freigabe oft wichtiger als der Speicher selbst.'],
  ['Explizites Besitzmodell verhindert viele Fehler, verlangt aber mehr Nachdenken beim Entwerfen.',
   'Automatische Speicherbereinigung erleichtert den Alltag, beantwortet aber nicht, wann Ressourcen freigegeben werden.'],
  ['variables','functions','records'],
  ['ownership','borrowing','lifetime','raii','garbage-collection','memory','resource'],
  'Erkläre, warum eine Funktion keine Referenz auf eine lokal erzeugte Variable zurückgeben sollte.',
  'Frage dich, was nach dem Ende des Funktionsaufrufs noch gültig ist.',
  'Die lokale Variable existiert nur während des Aufrufs. Eine Referenz darauf wäre danach ungültig; Rust lehnt das ab, GC-Sprachen lösen es über Heap-Objekte, aber auch dort bleibt die Lebensdauer eine fachliche Frage.',
  [
   v('rust','move & borrow','fn len(text: String) -> usize { text.len() }\nlet name = String::from("Ada");\nlet n = len(name);','Die Übergabe bewegt den String; danach ist name nicht mehr verfügbar.','Referenzen mit & leihen den Wert nur aus; das Borrow-Checker-Modell prüft Lebensdauer und Mutierbarkeit zur Compilezeit.','https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html'),
   v('cpp','RAII & unique_ptr','auto file = std::make_unique<std::ifstream>("data.txt");\n// Destruktor gibt die Ressource am Scope-Ende frei','Besitz wird an einen Smart Pointer übertragen; der Destruktor räumt automatisch auf.','Rohes new/delete ist fehleranfällig; bei kopierbaren Objekten muss die Besitzstrategie explizit gewählt werden.','https://en.cppreference.com/w/cpp/memory/unique_ptr'),
   v('java','GC & try-with-resources','try (var stream = Files.lines(Path.of("data.txt"))) {\n  stream.forEach(System.out::println);\n}','Der Garbage Collector räumt Speicher auf; try-with-resources schließt die Ressource deterministisch.','GC befreit keinen Speicher sofort und kümmert sich nicht um Dateihandles; finalize ist kein verlässlicher Ersatz.','https://dev.java/learn/','related'),
   v('python','Referenzen & with','with open("data.txt", encoding="utf-8") as handle:\n    text = handle.read()','Namen halten Objekte am Leben; with ruft beim Verlassen des Blocks __exit__ auf.','Reference Counting plus zyklischer GC geben keine feste Freigabezeit; Schließen bleibt explizit nötig.','https://docs.python.org/3/reference/datamodel.html','related'),
   v('typescript','Referenzwerte','const item = { amount: 2 };\nconst alias = item;\nalias.amount = 3;','Beide Namen zeigen auf dasselbe Objekt; die Zuweisung kopiert keine Inhalte.','TypeScript prüft Typen, nicht Besitz; es gibt keine automatische Freigabe und keine Borrow-Prüfung.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects','related'),
   v('go','GC & Escape-Analyse','func makeItem() *Item { return &Item{Amount: 2} }\nitem := makeItem()','Der Compiler entscheidet, ob ein Wert auf dem Stack oder Heap lebt; der GC räumt Heap-Objekte auf.','Go hat keine Ownership-Annotationen; Ressourcen wie Dateien müssen trotzdem aktiv geschlossen werden.','https://go.dev/doc/effective_go','related'),
   v('csharp','GC & IDisposable','using var reader = new StreamReader("data.txt");\nvar text = reader.ReadToEnd();','Der Garbage Collector verwaltet Speicher; using beendet die Lebensdauer einer Ressource kontrolliert.','IDisposable muss vom Typ korrekt implementiert sein; Finalizer sind kein Ersatz für using.','https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/fundamentals','related'),
   v('kotlin','GC & use','File("data.txt").useLines { lines -> println(lines.count()) }','Objekte bleiben über Referenzen erreichbar; use schließt Closeable-Ressourcen am Blockende.','val schützt nur vor Neuzuweisung, nicht vor dem Fortbestehen eines Objekts über eine Referenz.','https://kotlinlang.org/docs/basic-syntax.html','related')
  ]),

 c('iterators','Iteratoren & Generatoren','flow','intermediate',
  'Wie erzeugen wir Werte erst dann, wenn sie gebraucht werden?',
  'Statt eine fertige Liste anzulegen, liefert ein Iterator das nächste Element auf Anfrage.',
  'Ein Förderband: Jede Anfrage liefert genau ein Element; nichts wird vorab gestapelt.',
  ['Eine Folge wird als Iterator oder Generator beschrieben.',
   'next beziehungsweise yield liefert ein Element und behält den Zustand.',
   'Die Folge endet mit einem expliziten Abschluss.',
   'Konsumenten können früh abbrechen und damit Arbeit einsparen.'],
  ['Lazy Auswertung spart Speicher, aber mehrfaches Durchlaufen kann teuer oder unmöglich sein.',
   'Zustand im Iterator erleichtert das Erzeugen, erschwert aber Debuggen und Parallelisierung.'],
  ['sequences','functions','stream-pipelines'],
  ['iterator','generator','lazy','yield','iteration','sequence','stream'],
  'Schreibe eine unendliche Folge von Quadratzahlen, die nur die ersten drei Werte ausgibt.',
  'Erzeuge Werte erst bei der Anfrage und brich nach drei Schritten ab.',
  'Ein Generator liefert 1, 4 und 9; danach wird der Iterator nicht weiter abgefragt, sodass die unendliche Folge nicht materialisiert wird.',
  [
   v('python','Generatorfunktion','def squares():\n    n = 1\n    while True:\n        yield n * n\n        n += 1','yield unterbricht die Funktion und liefert bei der nächsten Anfrage den fortgesetzten Zustand.','Ein Generator ist einmalig und zustandsbehaftet; eine List-Comprehension ist dagegen eager.','https://docs.python.org/3/howto/functional.html#generators'),
   v('javascript','Generatorfunktion','function* squares() {\n  let n = 1;\n  while (true) yield n * n, n++;\n}','function* erzeugt ein Iterator-Objekt; yield liefert jeweils einen Wert.','Generatoren sind langsam pro Element als ein einfacher Array-Zugriff, dafür aber speichereffizient bei großen Folgen.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator'),
   v('rust','Iterator & collect','let squares: Vec<i32> = (1..).map(|n| n * n).take(3).collect();','Iterator-Adapter sind lazy; collect konsumiert genau die drei benötigten Werte.','Rust-Iteratoren besitzen einen konkreten Typ und werden oft monomorphisiert; das unterscheidet sich von dynamischen Java-Iteratoren.','https://doc.rust-lang.org/book/ch13-02-iterators.html'),
   v('java','Iterator & Stream','Iterator<Integer> squares = Stream.iterate(1, n -> n + 1)\n    .map(n -> n * n).iterator();\nsquares.next();','Stream.iterate beschreibt eine unendliche Folge; der Iterator liefert Elemente einzeln.','Streams sind nicht wiederverwendbar; ein unbegrenzter Stream ohne limit terminiert nie.','https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html'),
   v('typescript','Iterable & Generator','function* squares(): Generator<number> {\n  for (let n = 1; ; n++) yield n * n;\n}','Der Generator erfüllt das Iterable-Protokoll und kann in for...of verwendet werden.','Typen beschreiben die Folge, erzwingen aber keine Endlichkeit; Laufzeitprüfung bleibt nötig.','https://www.typescriptlang.org/docs/handbook/2/generators.html'),
   v('csharp','yield return','IEnumerable<int> Squares() {\n  for (int n = 1; ; n++) yield return n * n;\n}','yield return erzeugt eine verzögerte Folge; LINQ kann sie weiter verarbeiten.','LINQ-Abfragen können mehrfach ausgewertet werden; Materialisierung mit ToList ändert das Verhalten.','https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/iterators'),
   v('kotlin','Sequence','val squares = generateSequence(1) { it + 1 }.map { it * it }\nsquares.take(3).toList()','Sequence ist lazy; take(3) verarbeitet nur drei Elemente.','Eine Liste wird eager erzeugt; Sequence und Iterable haben unterschiedliche Auswertungszeitpunkte.','https://kotlinlang.org/docs/sequences.html'),
   v('php','Generatoren','function squares(): Generator {\n  for ($n = 1; ; $n++) yield $n * $n;\n}','yield erzeugt einen Generator, der foreach ohne vollständiges Array bedient.','Generator lässt sich nicht zurücksetzen; eine erneute Iteration braucht eine neue Instanz.','https://www.php.net/manual/en/language.generators.overview.php')
  ]),

 c('closures','Closures & Funktionswerte','abstraction','intermediate',
  'Wie greift eine Funktion auf Werte zugreifen, die aus ihrer Erzeugungsumgebung stammen?',
  'Eine Funktion kann ihren Kontext mitnehmen und später weiterverwenden.',
  'Ein Notizzettel im Rucksack: Die Funktion kommt später mit damals gespeicherten Werten zurück.',
  ['Eine Funktion wird innerhalb eines Gültigkeitsbereichs erzeugt.',
   'Sie referenziert Werte aus diesem Bereich.',
   'Nach Ende des Bereichs bleibt der benötigte Zustand erreichbar.',
   'Der eingeschlossene Zustand kann absichtlich verändert werden – oder ungewollt überraschen.'],
  ['Closures eignen sich für Rückrufe und Konfiguration, können aber große Objekte unnötig am Leben halten.',
   'Veränderlicher eingeschlossener Zustand erschwert Tests und Nebenläufigkeit.'],
  ['functions'],
  ['closure','lambda','capture','callback','function-value','higher-order'],
  'Baue einen Zähler, der bei jedem Aufruf um eins erhöht wird, ohne eine globale Variable zu verwenden.',
  'Der Zustand muss im Funktionswert selbst leben.',
  'Eine Funktion erzeugt eine lokale Zahl und gibt eine zweite Funktion zurück, die genau diese Zahl verändert. Jeder Aufruf der inneren Funktion liefert einen höheren Wert.',
  [
   v('javascript','Closure','function counter() {\n  let n = 0;\n  return () => ++n;\n}\nconst next = counter();','Die innere Funktion behält Zugriff auf n, obwohl counter schon beendet ist.','Arrow Functions binden this lexikalisch; normale Funktionen können ein eigenes this haben.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures'),
   v('typescript','getippte Closure','function counter(): () => number {\n  let n = 0;\n  return () => ++n;\n}','Der Rückgabetyp beschreibt die Funktion, der eingeschlossene Zustand bleibt implizit.','Typen schützen nicht davor, dass ein ungewollt großer Wert eingeschlossen wird.','https://www.typescriptlang.org/docs/handbook/2/functions.html'),
   v('python','Closure','def counter():\n    n = 0\n    def next_value():\n        nonlocal n\n        n += 1\n        return n\n    return next_value','nonlocal erlaubt das Verändern der eingeschlossenen Variable.','Ohne nonlocal würde eine neue lokale Variable entstehen; closures greifen auf Namesbindungen zu.','https://docs.python.org/3/tutorial/controlflow.html#defining-functions'),
   v('rust','Closure & move','let offset = 2;\nlet add = |x| x + offset;\nassert_eq!(add(3), 5);','Eine Closure erfasst Werte aus ihrer Umgebung und implementiert Fn/FnMut/FnOnce.','move zwingt zum Übernehmen des Besitzes; ohne move wird nur geliehen.','https://doc.rust-lang.org/book/ch13-01-closures.html'),
   v('java','Lambda & effective final','int offset = 2;\njava.util.function.IntUnaryOperator add = x -> x + offset;','Lambdas greifen auf lokal unveränderliche Variablen zu, solange diese effektiv unveränderlich sind.','Java erfasst Variablen als Werte; eine Neuzuweisung danach ist nicht erlaubt.','https://dev.java/learn/lambdas/'),
   v('csharp','Lambda','int offset = 2;\nFunc<int,int> add = x => x + offset;','Die Lambda-Funktion erfasst offset und kann später aufgerufen werden.','Bei asynchronen Rückrufen kann sich der erfasste Wert in der Zwischenzeit ändern.','https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/lambda-expressions'),
   v('kotlin','Lambda & Receiver','val offset = 2\nval add: (Int) -> Int = { it + offset }','Lambda greift auf offset aus dem umgebenden Scope zu.','Ein Receiver-Lambda hat zusätzlich this; das kann Namenskonflikte erzeugen.','https://kotlinlang.org/docs/lambdas.html'),
   v('go','Closure','func counter() func() int {\n  n := 0\n  return func() int { n++; return n }\n}','Die zurückgegebene Funktion teilt sich n mit der äußeren Funktion.','Go erfasst Variablen üblicherweise als Referenz; in Schleifen wurde das historisch oft falsch verstanden.','https://go.dev/tour/moretypes/25')
  ]),

 c('equality','Gleichheit & Hashbarkeit','data','intermediate',
  'Wann sind zwei Werte gleich – und warum reicht derselbe Inhalt nicht immer?',
  'Gleichheit kann Identität oder Inhalt bedeuten. Hashbasierte Strukturen verlangen zusätzlich einen konsistenten Hash.',
  'Zwei Tickets mit identischem Aufdruck: fachlich gleichwertig, aber physisch zwei verschiedene Zettel.',
  ['Wir legen fest, ob Identität oder Inhalt verglichen wird.',
   'Für Inhaltsvergleich definieren wir equals beziehungsweise PartialEq.',
   'Bei Hash-Strukturen müssen gleiche Werte zwingend denselben Hash liefern.',
   'Mutierbare Felder können die Gleichheit nach dem Einfügen in eine Map zerstören.'],
  ['Referenzgleichheit ist schnell, aber für Fachobjekte meist die falsche Antwort.',
   'Inhaltsvergleich muss alle relevanten Felder berücksichtigen und mit Unveränderlichkeit einhergehen.'],
  ['records','key-value','uniqueness'],
  ['equality','hash','identity','equals','comparable','hashcode'],
  'Begründe, warum ein als Map-Schlüssel verwendetes Objekt nachträglich nicht verändert werden darf.',
  'Der Hash basiert meist auf Feldern des Objekts.',
  'Wenn sich ein Feld ändert, ändert sich der Hash. Die Map sucht am alten Hash-Platz und findet das Objekt nicht wieder, obwohl es noch gespeichert ist.',
  [
   v('java','equals & hashCode','record Item(String id) {}\nvar set = new java.util.HashSet<Item>();\nset.add(new Item("A7"));','Records erzeugen equals und hashCode aus allen Komponenten.','Bei selbst geschriebenen Klassen müssen equals und hashCode übereinstimmen; veränderliche Felder als Schlüssel sind gefährlich.','https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html'),
   v('python','__eq__ & __hash__','from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Item:\n    id: str\n\na, b = Item("A7"), Item("A7")\nprint(a == b, hash(a) == hash(b))','frozen dataclasses liefern Wertgleichheit und einen passenden Hash.','Eine veränderliche Klasse mit __eq__ verliert standardmäßig __hash__; == ist nicht identisch mit is.','https://docs.python.org/3/reference/datamodel.html'),
   v('rust','PartialEq & Eq','#[derive(PartialEq, Eq, Hash)]\nstruct Item { id: String }\nlet a = Item { id: "A7".into() };\nlet b = Item { id: "A7".into() };\nassert_eq!(a, b);','Gleichheit und Hash werden explizit über Traits eingeschaltet.','PartialEq erlaubt partielle Gleichheit (etwa NaN); Eq verlangt Reflexivität. Hash braucht konsistente Felder.','https://doc.rust-lang.org/std/cmp/trait.Eq.html'),
   v('typescript','=== & Referenz','const a = { id: "A7" };\nconst b = { id: "A7" };\nconsole.log(a === b); // false','=== vergleicht Objekte über Referenzidentität, nicht über Inhalt.','Es gibt keinen eingebauten Wertvergleich und keine Hash-Struktur im Standard; Library-Helper können das ändern.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality','related'),
   v('javascript','Object.is','console.log(Object.is(0, -0)); // false\nconsole.log(Object.is(NaN, NaN)); // true','Object.is behandelt NaN als gleich und unterscheidet +0 von -0.','=== behandelt NaN nie als gleich; für Objekte bleibt es bei Referenzvergleich.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is','related'),
   v('csharp','Equals & GetHashCode','public record Item(string Id);\nvar a = new Item("A7");\nvar b = new Item("A7");\nConsole.WriteLine(a.Equals(b));','Records erzeugen wertbasierte Gleichheit und einen passenden Hashcode.','Bei Klassen müssen Equals und GetHashCode gemeinsam überschrieben werden; Mutable Schlüssel sind riskant.','https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/objects'),
   v('go','comparable','type Item struct { ID string }\na := Item{"A7"}\nb := Item{"A7"}\nfmt.Println(a == b)','Vergleichbare Strukturen werden Feld für Feld verglichen.','Slices, Maps und Functions sind nicht vergleichbar;.maps brauchen eigene Strategien.','https://go.dev/ref/spec#Comparison_operators'),
   v('kotlin','data class','data class Item(val id: String)\nprintln(Item("A7") == Item("A7"))','data class erzeugt equals, hashCode und copy aus allen primary-Konstruktor-Parametern.','var-Felder oder Collections können die hashCode-Stabilität gefährden.','https://kotlinlang.org/docs/data-classes.html')
  ])
];
