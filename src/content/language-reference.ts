import {CONCEPTS,LANGUAGES,type Concept,type LanguageId,type LanguageVariant} from './concepts';

export interface LanguageSpec{
 readonly id:LanguageId;readonly name:string;readonly version:string;readonly platform:string;
 readonly typeSystem:string;readonly learningAdvice:string;readonly bestPractices:readonly string[];
 readonly officialSource:string;readonly updatedAt:string;
}
const spec=(id:LanguageId,name:string,version:string,platform:string,typeSystem:string,
 learningAdvice:string,bestPractices:readonly string[],officialSource:string):LanguageSpec=>
 ({id,name,version,platform,typeSystem,learningAdvice,bestPractices,officialSource,updatedAt:'2026-11-23'});
/** A deliberately educational selection, not a claim to a particular popularity top-ten ranking. */
export const LANGUAGE_SPECS:readonly LanguageSpec[]=[
 spec('python','Python','3.15','CPython 3.15','Dynamisch; Typannotationen optional',
  'Python bindet Namen an Objekte. Konzentriere dich zuerst auf Datentypen, Funktionen, Iteratoren und Exceptions, dann auf dataclasses, Typannotationen und async.',
  ['Vier Leerzeichen pro Einrückungsstufe; sprechende Namen verwenden.','Keine veränderlichen Standardparameter wie items=[].','Exceptions gezielt behandeln und nicht mit nacktem except verschlucken.','Für Projekte virtuelle Umgebungen und reproduzierbare Abhängigkeiten verwenden.'],
  'https://docs.python.org/3.15/'),
 spec('javascript','JavaScript','ECMAScript 2026','ECMA-262 (ES2026), Browser oder Node.js','Dynamisch; prototypbasierte Objekte',
  'Trenne die eigentliche JavaScript-Sprache von Browser- oder Node.js-APIs. Übe zuerst Werte, Funktionen, Objekte und Promises.',
  ['const bevorzugen; let nur bei nötiger Neuzuweisung.','=== statt == für nachvollziehbare Gleichheit.','Externe Eingaben validieren, nicht mit eval ausführen.','Promise-Fehler mit await/try oder catch behandeln.'],
  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'),
 spec('typescript','TypeScript','7.0','TypeScript-Compiler auf ECMAScript-Zielruntime','Statisch, strukturell; Typen entfallen zur Laufzeit',
  'TypeScript hilft dem Compiler, gültige Formen zu erkennen. Es ist kein Laufzeit-Schutzschild gegen falsches JSON.',
  ['strict aktivieren und any vermeiden.','Externe Daten zur Laufzeit validieren.','Uniontypen mit einem Diskriminator statt unkontrollierter Type Assertions.','Generische Parameter nur einsetzen, wenn sie einen echten Typzusammenhang ausdrücken.'],
  'https://www.typescriptlang.org/docs/'),
 spec('java','Java','25 LTS','JDK 25 LTS; Java 27 existiert, wird hier bewusst nicht vorausgesetzt','Statisch, nominal',
  'Baue erst Sicherheit bei Klassen, Methoden und Collections auf. Danach kommen Records, Generics, Streams und nebenläufige Abläufe.',
  ['Domänenregeln bei Konstruktion und Methoden prüfen.','Unveränderliche Daten wo sinnvoll bevorzugen.','Money nicht mit double modellieren, wenn exakte Dezimalbeträge nötig sind.','Streams nur einsetzen, wenn sie gegenüber Schleifen wirklich klarer sind.'],
  'https://dev.java/learn/'),
 spec('csharp','C#','15','C# 15 / .NET 11','Statisch, nominal; Nullable-Analyse',
  'Unterscheide Wert- und Referenztypen. Übe Interfaces, LINQ und async/await, bevor du größere .NET-Anwendungen entwirfst.',
  ['Nullable-Reference-Types aktiviert lassen.','IDisposable mit using freigeben.','Asynchrone Methoden nicht mit .Result blockieren.','LINQ-Mehrfachauswertung bewusst vermeiden.'],
  'https://learn.microsoft.com/en-us/dotnet/csharp/'),
 spec('cpp','C++','C++23','Veröffentlichter Standard C++23; C++26 nicht pauschal vorausgesetzt','Statisch; manuelle Kontrolle und RAII',
  'Erlerne Werttypen, Referenzen, Besitz und Lebensdauern zuerst. Moderne Standardbibliothek und RAII sind wichtiger als manuelle new/delete-Beispiele.',
  ['RAII und Container/Smart Pointer vor rohem new/delete.','Variablen direkt initialisieren.','const-Korrektheit und Lebensdauer von Referenzen prüfen.','Aktuelle Warnungen und Sanitizer im Entwicklungsprozess aktivieren.'],
  'https://en.cppreference.com/w/cpp/23'),
 spec('php','PHP','8.6','PHP 8.6, veröffentlicht November 2026','Dynamisch; skalare Typsignaturen möglich',
  'PHP-Arrays vereinen Listen- und Map-Funktionalität. Lerne erst die Datenformen, dann OOP, Exceptions, Namespaces und Composer.',
  ['strict_types und klare Typdeklarationen verwenden.','SQL nur parametrisiert abfragen.','Passwörter nur mit geeigneten Hashing-APIs speichern.','Abhängigkeiten und unterstützte PHP-Version dokumentieren.'],
  'https://www.php.net/manual/en/'),
 spec('go','Go','1.27','Go 1.27 stable','Statisch; Interfaces implizit',
  'Go nutzt explizite Fehlerwerte und einfache Sprachmittel. Baue erst ein Gefühl für Slices, Maps und Interfaces auf, dann Goroutinen.',
  ['Zurückgegebene errors behandeln.','Goroutinen mit Context oder anderen Abbruchmechanismen kontrollieren.','Shared State gegen Datenrennen schützen.','Kleine Interfaces dort definieren, wo sie genutzt werden.'],
  'https://go.dev/doc/'),
 spec('rust','Rust','1.100','Rust 1.100 stable, November 2026','Statisch; Ownership und Borrowing',
  'Rust fordert Wissen über Besitz, Mutierbarkeit und Lebensdauer. Erst danach wirken Traits, Iteratoren und Async verständlich.',
  ['Clippy und rustfmt nutzen.','Result/Option statt vermeidbarem unwrap.','Ownership vor blindem clone verstehen.','Panic nicht als normale Fehlerbehandlung nutzen.'],
  'https://doc.rust-lang.org/book/'),
 spec('kotlin','Kotlin','2.4.21','Kotlin 2.4 stable; 2.5 RC wird nicht vorausgesetzt','Statisch; Nullsicherheit',
  'Kotlin kombiniert kompakte Syntax mit Nullsicherheit und funktionalen Operationen. Vergleiche data classes bewusst mit Java records.',
  ['val vor var bevorzugen.','!! möglichst vermeiden und null bewusst behandeln.','Read-only-Collections nicht mit tief unveränderlichen Collections verwechseln.','Coroutines strukturiert starten statt globale Jobs zu verlieren.'],
  'https://kotlinlang.org/docs/home.html'),
];
export type LanguageStudyPage={readonly language:LanguageSpec;readonly concept:Concept;readonly variant:LanguageVariant};
export function languagePages(id:LanguageId):readonly LanguageStudyPage[]{
 const language=LANGUAGE_SPECS.find(l=>l.id===id);
 if(!language)throw Error('Nicht unterstützte Sprache');
 return CONCEPTS.flatMap(concept=> {
  const variant=concept.variants.find(v=>v.language===id)??EXTRA_VARIANTS.find(v=>v.language===id&&v.conceptId===concept.id);
  return variant?[{language,concept,variant}]:[];
 });
}
export function searchLanguagePages(text:string,id?:LanguageId):readonly LanguageStudyPage[]{
 const normalized=text.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('de').trim();
 const words=normalized.split(/\s+/).filter(Boolean);
 return LANGUAGE_SPECS.filter(l=>!id||l.id===id).flatMap(l=>languagePages(l.id)).filter(({language,concept,variant})=>{
  const combined=[language.name,language.version,concept.title,concept.question,concept.intuition,
   ...concept.tags,variant.name,variant.explanation,variant.differences,variant.code]
   .join(' ').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('de');
  return words.every(word=>combined.includes(word));
 });
}
export function validateLanguageDocumentation():readonly string[]{
 const problems:string[]=[];
 if(LANGUAGE_SPECS.length!==10||new Set(LANGUAGE_SPECS.map(x=>x.id)).size!==10)problems.push('Es müssen genau zehn eindeutige Sprachen vorhanden sein.');
 for(const language of LANGUAGE_SPECS){
  if(LANGUAGES[language.id]!==language.name)problems.push('Sprachregister stimmt nicht: '+language.id);
  if(!language.version||language.bestPractices.length<3||!language.officialSource.startsWith('https://'))problems.push('Metadaten unvollständig: '+language.id);
  const pages=languagePages(language.id);
  if(pages.length<8)problems.push('Zu wenige Lehrseiten: '+language.id);
  if(new Set(pages.map(p=>p.concept.id)).size!==pages.length)problems.push('Doppelte Lehrseite: '+language.id);
  for(const {concept,variant} of pages){
   if(!variant.differences||!variant.code||!variant.docs.startsWith('https://'))problems.push('Unvollständig: '+language.id+'/'+concept.id);
  }
 }
 return problems;
}

type SupplementalVariant=LanguageVariant&{readonly conceptId:string};
const add=(language:LanguageId,conceptId:string,name:string,code:string,explanation:string,differences:string,docs:string):SupplementalVariant=>
 ({language,conceptId,name,code,explanation,differences,docs,equivalence:'related'});
/** Bespoke examples: only use APIs available in the pinned language edition. */
export const EXTRA_VARIANTS:readonly SupplementalVariant[]=[
 add('javascript','variables','const und let','const stock = 3;\nlet remaining = stock;\nremaining += 2;','const kann nicht neu gebunden werden; let schon.','const schützt nicht vor Mutation eines enthaltenen Objekts.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types'),
 add('javascript','conditionals','if / else','const stock = 3;\nif (stock >= 2) console.log("Verkauf");\nelse console.log("Fehlt");','Nur der zum Wahrheitswert passende Zweig wird ausgeführt.','=== ist normalerweise vorzuziehen; Truthiness ist nicht identisch mit boolean.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else'),
 add('javascript','sequences','Array','const names = ["Ada", "Kim"];\nconsole.log(names[1]);','Index 1 liefert das zweite Element Kim.','Arrays sind veränderlich und typisieren Inhalte nicht zur Laufzeit.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array'),
 add('javascript','key-value','Map','const stock = new Map([["cola", 12]]);\nstock.set("cola", 10);\nconsole.log(stock.get("cola"));','Map ist eine echte Schlüssel-Wert-Datenstruktur.','Map erhält die Einfügereihenfolge, get kann undefined ergeben; Object ist kein 1:1-Ersatz.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map'),
 add('javascript','uniqueness','Set','const ids = new Set(["A", "A", "B"]);\nconsole.log(ids.size);','Set speichert jeden primitiven Wert einmal; Ergebnis ist 2.','Objekte werden nach Identität verglichen, nicht nach Inhalt.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set'),
 add('javascript','functions','Closure','function counter(){ let n=0; return () => ++n; }\nconst next=counter();\nconsole.log(next());','Das Closure bewahrt n zwischen Aufrufen.','Arrow Functions binden this anders als normale Funktionen.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures'),
 add('javascript','records','Plain Object','const item = {name: "Cola", amount: 2};\nconsole.log(item.amount);','Objektliterale bündeln benannte Werte.','Keine automatische Record-Wertgleichheit wie bei Java; === prüft Objektidentität.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects'),
 add('javascript','stream-pipelines','Array.filter / map','const result=[1,2,3,4].filter(n=>n%2===0).map(n=>n*n);\nconsole.log(result);','filter wählt, map transformiert; Ergebnis ist [4,16].','Array.filter und map sind eager, anders als Java-Stream-Zwischenoperationen.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter'),
 add('javascript','absence','null und undefined','const found = undefined;\nconsole.log(found ?? "fehlt");','?? liefert nur bei null oder undefined den Ersatz.','Der Operator || verwendet auch bei 0, false oder leerem String einen Ersatz.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing'),
 add('javascript','errors','throw / catch','try { throw new Error("Fehler"); }\ncatch (error) { console.log(error.message); }','Exceptions unterbrechen den normalen Ablauf.','Fange nicht pauschal ab, ohne sinnvoll zu reagieren.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch'),
 add('javascript','async','Promise','async function answer(){return 42;}\nanswer().then(console.log);','Eine async-Funktion liefert ein Promise.','await parallelisiert keinen CPU-lastigen Code.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function'),
 add('csharp','variables','var und Nullable','var stock = 3;\nstring? label = null;\nstock += 2;','var leitet int ab; string? zeigt einen möglichen Nullwert.','Nullable-Warnungen ersetzen keine Prüfung eingehender Laufzeitdaten.','https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/nullable-reference-types'),
 add('csharp','conditionals','if / else','int stock=3;\nif(stock>=2) Console.WriteLine("Ja");\nelse Console.WriteLine("Nein");','Der passende Zweig wird ausgeführt.','C# verlangt bool, keine implizite Zahl-zu-bool-Konvertierung.','https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/selection-statements'),
 add('csharp','sequences','List<T>','var drinks = new List<string>{"Cola","Tee"};\nConsole.WriteLine(drinks[1]);','Dynamische Liste mit Indexzugriff.','Nicht identisch mit einem Array fester Länge.','https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1'),
 add('csharp','uniqueness','HashSet<T>','var ids = new HashSet<string>{"A","A","B"};\nConsole.WriteLine(ids.Count);','Doppelte Werte werden anhand des Comparers entfernt.','Die Reihenfolge ist nicht garantiert.','https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.hashset-1'),
 add('csharp','functions','Methoden','static int Remaining(int stock,int sold)=>stock-sold;','Kompakte Methode mit typisiertem Rückgabewert.','Werte müssen fachlich validiert werden; knappe Syntax ersetzt keine Regeln.','https://learn.microsoft.com/en-us/dotnet/csharp/methods'),
 add('csharp','generics','Generics','var names = new List<string>{"Ada"};\nConsole.WriteLine(names[0]);','Generische Collections sichern Elementtypen.','C#-Generics unterscheiden sich in Runtime-Repräsentation von Java-Type-Erasure.','https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/generics'),
 add('csharp','stream-pipelines','LINQ','var even=new[]{1,2,3,4}.Where(x=>x%2==0).Select(x=>x*x).ToList();','Where filtert, Select wandelt um, ToList materialisiert.','LINQ kann verzögert ausgewertet werden; ein Query über Datenbanken kann anders arbeiten.','https://learn.microsoft.com/en-us/dotnet/csharp/linq/'),
 add('csharp','absence','Nullable<T>','int? stock = null;\nConsole.WriteLine(stock ?? 0);','Nullfähige Werte und Ersatzwertoperator.','Nullable Value Types und nullable Referenzen haben unterschiedliche Laufzeitregeln.','https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/nullable-value-types'),
 add('csharp','async','Task und await','async Task<int> Answer(){ await Task.Delay(1); return 42; }','Eine Task stellt ein späteres Ergebnis bereit.','Vermeide .Result oder .Wait() in asynchronem Code wegen möglicher Blockaden.','https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/'),
 add('kotlin','variables','val und var','var stock=3\nval name="Cola"\nstock+=2','val verhindert Neuzuweisung, var erlaubt sie.','val ist keine Zusage tiefer Unveränderlichkeit.','https://kotlinlang.org/docs/basic-syntax.html'),
 add('kotlin','conditionals','if-Ausdruck','val stock=3\nval result=if(stock>0) "Ja" else "Nein"','if kann direkt einen Wert liefern.','Alle Zweige müssen zu einem kompatiblen Typ führen.','https://kotlinlang.org/docs/control-flow.html'),
 add('kotlin','sequences','List und MutableList','val items=listOf("Cola","Tee")\nprintln(items[1])','Eine schreibgeschützte Liste bietet Indexzugriff.','Read-only ist nicht zwingend tief unveränderlich.','https://kotlinlang.org/docs/collections-overview.html'),
 add('kotlin','uniqueness','Set','val ids=setOf("A","A","B")\nprintln(ids.size)','Ein Set bewahrt eindeutige Werte.','Equality der Elemente entscheidet über Duplikate.','https://kotlinlang.org/docs/collections-set.html'),
 add('kotlin','functions','Funktionen','fun remaining(stock:Int,sold:Int)=stock-sold','Typisierte Funktion mit Ausdrucksbody.','Die Mengen müssen fachlich geprüft werden.','https://kotlinlang.org/docs/functions.html'),
 add('kotlin','generics','Generische Typen','class Box<T>(val value:T)\nval item=Box("Cola")','Ein Typparameter verknüpft Container und Elementtyp.','Kotlin unterscheidet in/out-Varianz und reified-Typen in inline-Funktionen.','https://kotlinlang.org/docs/generics.html'),
 add('kotlin','absence','Nullable und Elvis','val name:String?=null\nprintln(name ?: "fehlt")','Der Elvis-Operator ?? existiert in Kotlin nicht; ?: liefert den Ersatz.','!! löst bei null einen Fehler aus und sollte selten nötig sein.','https://kotlinlang.org/docs/null-safety.html'),
 add('kotlin','errors','Exceptions','require(3>=0) {"Menge ungültig"}','require prüft Vorbedingungen und wirft bei Verstoß.','Kotlin hat keine checked Exceptions wie Java.','https://kotlinlang.org/docs/exceptions.html'),
 add('kotlin','async','Coroutines','suspend fun answer():Int = 42','suspend-Funktionen können innerhalb eines Coroutine-Kontexts suspendieren.','Eine suspend-Funktion startet nicht automatisch einen eigenen Thread.','https://kotlinlang.org/docs/coroutines-guide.html'),
 add('cpp','variables','const und auto','auto stock = 3;\nconst int limit=10;\nstock += 2;','auto leitet int ab; const verhindert Änderung von limit.','Uninitialisierte primitive lokale Variablen vermeiden.','https://en.cppreference.com/w/cpp/language/auto'),
 add('cpp','conditionals','if / else','int stock=3;\nif(stock>=2){ /* erlaubt */ } else { /* leer */ }','Die Bedingung entscheidet den Kontrollpfad.','C++ besitzt implizite Konvertierung zu bool, die zu Fehlern führen kann.','https://en.cppreference.com/w/cpp/language/if'),
 add('cpp','sequences','std::vector','std::vector<int> values{1,2,3};\nstd::cout << values.at(1);','vector ist eine dynamische Sequenz.','at prüft Grenzen; operator[] führt bei ungültigem Index nicht automatisch eine Ausnahmeprüfung durch.','https://en.cppreference.com/w/cpp/container/vector'),
 add('cpp','key-value','std::unordered_map','std::unordered_map<std::string,int> stock{{"Cola",12}};\nstd::cout << stock.at("Cola");','Hashbasierte Schlüssel-Wert-Struktur.','operator[] kann fehlende Schlüssel einfügen; at wirft bei fehlendem Schlüssel.','https://en.cppreference.com/w/cpp/container/unordered_map'),
 add('cpp','uniqueness','std::unordered_set','std::unordered_set<int> ids{1,1,2};\nstd::cout << ids.size();','Eindeutige Werte, Größe 2.','Keine stabile Iterationsreihenfolge.','https://en.cppreference.com/w/cpp/container/unordered_set'),
 add('cpp','functions','const-Referenzen','void show(const std::string& value){std::cout<<value;}','Lesender Zugriff ohne zusätzliche String-Kopie.','Niemals Referenzen auf bereits zerstörte Objekte zurückgeben.','https://en.cppreference.com/w/cpp/language/reference'),
 add('cpp','records','struct','struct Item {std::string name; int amount;};','Ein struct bündelt Felder.','Keine automatische Java-Record-Wertgleichheit, abhängig von definierten Operatoren.','https://en.cppreference.com/w/cpp/language/classes'),
 add('cpp','generics','Templates','template<class T> T twice(T value){return value+value;}','Ein generischer Algorithmus wird für passende Typen instanziiert.','Templates sind nicht identisch mit Java-Generics; Fehlermeldungen können komplex sein.','https://en.cppreference.com/w/cpp/language/templates'),
 add('cpp','absence','std::optional','std::optional<int> stock=std::nullopt;\nstd::cout<<stock.value_or(0);','Ein Optional enthält einen Wert oder ist leer.','value() wirft bad_optional_access, wenn der Wert fehlt.','https://en.cppreference.com/w/cpp/utility/optional'),
 add('cpp','errors','Exceptions und RAII','auto value=std::make_unique<int>(42);','unique_ptr gibt Speicher beim Scope-Ende frei, auch bei Exceptions.','Rohes new/delete ist selten nötig; RAII sorgt für Ausnahme-Sicherheit.','https://en.cppreference.com/w/cpp/memory/unique_ptr'),
 add('php','variables','Variablen und strict_types','declare(strict_types=1);\n$stock=3;\n$stock+=2;','Die Datei entscheidet über strikte Skalarargumenttypen bei Funktionsaufrufen.','strict_types ersetzt keine Validierung von Formular- oder JSON-Daten.','https://www.php.net/manual/en/language.types.declarations.php'),
 add('php','conditionals','if','if ($stock>=2) { echo "Ja"; } else { echo "Nein"; }','Bedingte Ausführung.','Loose comparison == kann unerwartete Typumwandlungen auslösen; === bevorzugen.','https://www.php.net/manual/en/control-structures.if.php'),
 add('php','sequences','Indizierte Arrays','$names=["Ada","Kim"];\necho $names[1];','Ein PHP-array kann eine Sequenz abbilden.','PHP-array ist zugleich eine geordnete Map, anders als Java-Arrays.','https://www.php.net/manual/en/language.types.array.php'),
 add('php','key-value','Assoziatives Array','$stock=["Cola"=>12];\n$stock["Cola"]=10;','Der String-Schlüssel Cola zeigt auf den Wert 10.','Schlüssel können automatisch typkonvertiert werden; fehlende Schlüssel sorgfältig behandeln.','https://www.php.net/manual/en/language.types.array.php'),
 add('php','uniqueness','array_unique','$ids=array_unique(["A","A","B"]);\necho count($ids);','Duplikate werden entfernt.','array_unique erhält ursprüngliche Schlüssel und ist kein echter Set-Typ.','https://www.php.net/manual/en/function.array-unique.php'),
 add('php','functions','Parametertypen','function remaining(int $a,int $b):int{return $a-$b;}','Parametertypen und Rückgabewert werden deklariert.','Auch typisierte Funktionen benötigen fachliche Validierung.','https://www.php.net/manual/en/functions.arguments.php'),
 add('php','records','Readonly-Klasse','readonly class Item {public function __construct(public string $name) {}}','Readonly verhindert spätere Änderung der Eigenschaft.','Nicht tief unveränderlich; PHP-Objekte haben keine automatische Java-Record-Wertgleichheit.','https://www.php.net/manual/en/language.oop5.properties.php'),
 add('php','generics','DocBlock-Generics','/** @template T */\nclass Box {}','Tools wie PHPStan können Generics aus DocBlocks prüfen.','PHP selbst hat keine native generische Typ-Parameter-Syntax wie Java.','https://phpstan.org/blog/generics-in-php-using-phpdocs'),
 add('php','absence','null-Coalescing','$name=null;\necho $name ?? "fehlt";','?? wählt nur bei null oder nicht gesetztem Wert den Ersatz.','Es behandelt false und 0 nicht als fehlend.','https://www.php.net/manual/en/language.operators.comparison.php'),
 add('php','errors','Exceptions','if ($amount<0) throw new InvalidArgumentException();','Fachlich ungültige Werte werden per Exception gemeldet.','try/catch sollte konkrete Fehler angemessen behandeln.','https://www.php.net/manual/en/language.exceptions.php'),
];
