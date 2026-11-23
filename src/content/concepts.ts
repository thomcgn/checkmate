import type {Stage} from '../shared/types';

/**
 * Konzept zuerst, Syntax danach. Ein Vergleich kann analog sein, ohne äquivalent zu sein:
 * die Caveats sind verpflichtende Bestandteile der Anzeige.
 */
export type LanguageId='java'|'python'|'rust'|'typescript'|'javascript'|'go'|'csharp'|'kotlin';
export type ConceptArea='fundamentals'|'data'|'abstraction'|'flow'|'errors'|'architecture'|'concurrency';
export type ComparisonKind='equivalent'|'similar'|'related';
export interface LanguageVariant {
 readonly language:LanguageId;
 readonly name:string;
 readonly code:string;
 readonly explanation:string;
 readonly differences:string;
 readonly equivalence:ComparisonKind;
 readonly docs:string;
}
export interface Concept {
 readonly id:string;
 readonly title:string;
 readonly area:ConceptArea;
 readonly stage:Stage;
 readonly question:string;
 readonly intuition:string;
 readonly mentalModel:string;
 readonly walkthrough:readonly string[];
 readonly tradeoffs:readonly string[];
 readonly prerequisiteIds:readonly string[];
 readonly tags:readonly string[];
 readonly exercise:string;
 readonly hint:string;
 readonly solution:string;
 readonly variants:readonly LanguageVariant[];
 readonly lessonId?:string;
}
export const LANGUAGES:Readonly<Record<LanguageId,string>>={
 java:'Java',python:'Python',rust:'Rust',typescript:'TypeScript',
 javascript:'JavaScript',go:'Go',csharp:'C#',kotlin:'Kotlin',
};
export const AREAS:Readonly<Record<ConceptArea,string>>={
 fundamentals:'Grundlagen',data:'Daten & Collections',abstraction:'Abstraktion',
 flow:'Datenverarbeitung',errors:'Fehler & Sicherheit',
 architecture:'Softwaredesign',concurrency:'Nebenläufigkeit',
};
const v=(language:LanguageId,name:string,code:string,explanation:string,differences:string,docs:string,equivalence:ComparisonKind='similar'):LanguageVariant=>({language,name,code,explanation,differences,docs,equivalence});
const c=(id:string,title:string,area:ConceptArea,stage:Stage,question:string,intuition:string,mentalModel:string,walkthrough:string[],tradeoffs:string[],prerequisiteIds:string[],tags:string[],exercise:string,hint:string,solution:string,variants:LanguageVariant[],lessonId?:string):Concept=>({id,title,area,stage,question,intuition,mentalModel,walkthrough,tradeoffs,prerequisiteIds,tags,exercise,hint,solution,variants,lessonId});
export const CONCEPTS:readonly Concept[]=[
c('variables','Variablen & Bindungen','fundamentals','basics','Wie merkt sich ein Programm Werte?','Wir geben einem Wert einen Namen, damit wir später mit ihm arbeiten können.','Ein Namensschild an einem Wert – nicht zwingend eine feste Schublade im Speicher.',[
 'Ein Programm erhält oder berechnet einen Wert.',
 'Ein Name verweist auf diesen Wert oder Speicherort.',
 'Bei einer Änderung ist wichtig, ob Name oder Wert neu gebunden oder mutiert wird.'
],['Sprachen unterscheiden Typprüfung, Bindung und Veränderbarkeit.'],[],['state','type','mutable'],
 'Lege einen Namen für den Bestand an und erhöhe ihn um zwei.','Unterscheide Zuweisung und Mutation.','Ein Ausgangswert 3 wird durch die entsprechende Operation zu 5.',[
 v('java','Lokale Variable','int stock = 3;\nstock += 2;','Eine typisierte lokale Variable wird neu zugewiesen.','Der Typ ist statisch; final verhindert eine erneute Zuweisung.', 'https://dev.java/learn/language-basics/'),
 v('python','Namensbindung','stock = 3\nstock += 2','stock wird zunächst an 3 und danach an 5 gebunden.','Python-Namen haben keinen festgeschriebenen Typ; int-Objekte sind unveränderlich.','https://docs.python.org/3/tutorial/introduction.html'),
 v('rust','Veränderliche Bindung','let mut stock = 3;\nstock += 2;','mut macht die Bindung explizit veränderbar.','Ohne mut wäre die zweite Zuweisung ein Compilerfehler.','https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html'),
 v('typescript','let und const','let stock: number = 3;\nstock += 2;','Typannotation und let machen die Absicht sichtbar.','const verbietet Neuzuweisung, aber nicht jede innere Objektmutation.','https://www.typescriptlang.org/docs/handbook/2/everyday-types.html'),
 v('go','Kurze Variablendeklaration','stock := 3\nstock += 2','Go leitet hier den Typ ab.','Die Kurzform := funktioniert nur innerhalb von Funktionen.','https://go.dev/tour/basics/8')
],'variables'),
c('conditionals','Bedingungen','fundamentals','basics','Wie entscheidet Code, welche Anweisung ausgeführt wird?','Eine Bedingung führt bei wahr und falsch zu unterschiedlichen Abläufen.','Eine Weggabelung: Der Ausdruck entscheidet, welcher Pfad gewählt wird.',[
 'Der Ausdruck liefert einen Wahrheitswert.',
 'Nur der passende Zweig wird ausgeführt.',
 'Das Ergebnis beeinflusst spätere Programmschritte.'
],['Viele verschachtelte Zweige werden unübersichtlich.'],['variables'],['if','boolean','control-flow'],
 'Prüfe, ob zwei Getränke verkauft werden dürfen.','Der Bestand muss mindestens 2 sein.','Bei stock = 3 ist die Bedingung wahr.',[
 v('java','if / else','if (stock >= 2) {\n    System.out.println("Verkauf");\n} else {\n    System.out.println("Zu wenig");\n}','Ausführung abhängig vom boolean-Ausdruck.','Klammern um die Bedingung sind erforderlich.','https://dev.java/learn/language-basics/'),
 v('python','if / else','if stock >= 2:\n    print("Verkauf")\nelse:\n    print("Zu wenig")','Einrückung begrenzt die Blöcke.','Es gibt keine geschweiften Klammern als Blockmarker.','https://docs.python.org/3/tutorial/controlflow.html'),
 v('rust','if als Ausdruck','let message = if stock >= 2 { "Verkauf" } else { "Zu wenig" };','if kann einen Wert zurückliefern.','Beide Zweige müssen bei Wertausdrücken kompatible Typen liefern.','https://doc.rust-lang.org/book/ch03-05-control-flow.html'),
 v('typescript','if / else','const message = stock >= 2 ? "Verkauf" : "Zu wenig";','Der bedingte Ausdruck gibt einen Wert zurück.','Der ?: Operator ist ein Ausdruck; if existiert daneben als Anweisung.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator')
],'conditions'),
c('sequences','Sequenzen & Listen','data','basics','Wie speichern wir mehrere Elemente in einer Reihenfolge?','Eine Liste bewahrt Elemente in einer festgelegten Reihenfolge.','Eine Einkaufsliste mit Positionen. Mehrere gleiche Einträge sind erlaubt.',[
 'Drei Einträge werden hinzugefügt.',
 'Der Index bestimmt die Position.',
 'Ein Element wird über seinen Index gelesen.'
],['Indexzugriffe außerhalb des gültigen Bereichs schlagen fehl.','Array und dynamische Liste sind nicht in jeder Sprache gleich.'],['variables'],['array','list','vector','sequence'],
 'Speichere drei Namen und lies den zweiten.','In den meisten gezeigten Sprachen beginnt der Index bei 0.','Bei ["Cola","Wasser","Saft"] ist Index 1 Wasser.',[
 v('java','ArrayList','List<String> drinks = new ArrayList<>();\ndrinks.add("Cola");\ndrinks.add("Wasser");\nSystem.out.println(drinks.get(1));','Eine dynamische, indexbasierte Liste.','String[] ist ein separates Array mit fester Länge; ArrayList wächst dynamisch.','https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayList.html'),
 v('python','list','drinks = ["Cola", "Wasser"]\nprint(drinks[1])','Eine veränderliche Python-Sequenz.','Python list ist keine HashMap und kein statisch typisiertes Array.','https://docs.python.org/3/tutorial/datastructures.html','similar'),
 v('rust','Vec<T>','let drinks = vec!["Cola", "Wasser"];\nprintln!("{}", drinks[1]);','Ein dynamischer zusammenhängender Vektor.','Ein Rust-Array [T; N] hat dagegen eine zur Compilezeit bekannte feste Länge.','https://doc.rust-lang.org/book/ch08-01-vectors.html'),
 v('typescript','Array<T>','const drinks: string[] = ["Cola", "Wasser"];\nconsole.log(drinks[1]);','Ein JavaScript-Array mit TypeScript-Typprüfung.','JS-Arrays können zur Laufzeit beliebige Werte enthalten; TypeScript-Typen schützen nicht zur Laufzeit.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array'),
 v('go','Slice','drinks := []string{"Cola", "Wasser"}\nfmt.Println(drinks[1])','Slice ist eine Sicht auf ein zugrunde liegendes Array.','Slice-Kapazität und append unterscheiden sich von Java ArrayList.','https://go.dev/blog/slices-intro')
],'lists'),
c('key-value','Schlüssel-Wert-Zuordnungen','data','intermediate','Wie finden wir einen Wert über einen eindeutigen Schlüssel?','Eine Map verbindet Schlüssel und Werte. Statt zu suchen, geben wir den Schlüssel an.','Eine Garderobenmarke: Die Nummer zeigt direkt auf das passende Fach.',[
 'Ein Schlüssel wird mit einem Wert verknüpft.',
 'Ein Lookup liefert den zugehörigen Wert oder signalisiert Abwesenheit.',
 'Ein erneutes Einfügen zum selben Schlüssel ersetzt üblicherweise die Zuordnung.'
],['Reihenfolge ist meist nicht verlässlich.','Schlüssel müssen nach sprachspezifischen Regeln geeignet sein.'],['sequences'],['map','hashmap','dict','dictionary','lookup'],
 'Speichere den Lagerbestand für cola und water und ändere cola auf 10.','Ordne jedem Namen eine Zahl zu.','Die Abfrage für cola liefert anschließend 10.',[
 v('java','HashMap<K,V>','Map<String,Integer> stock = new HashMap<>();\nstock.put("cola", 12);\nstock.put("cola", 10);\nSystem.out.println(stock.get("cola"));','Die HashMap ordnet Strings ganzen Zahlen zu.','get liefert bei fehlendem Schlüssel null; die Reihenfolge ist nicht garantiert.','https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html'),
 v('python','dict','stock = {"cola": 12}\nstock["cola"] = 10\nprint(stock.get("cola"))','dict ist eine Schlüssel-Wert-Struktur.','dict behält die Einfügereihenfolge; d["missing"] wirft KeyError, get liefert standardmäßig None.','https://docs.python.org/3/library/stdtypes.html#mapping-types-dict'),
 v('rust','HashMap<K,V>','use std::collections::HashMap;\nlet mut stock = HashMap::new();\nstock.insert("cola", 12);\nstock.insert("cola", 10);\nprintln!("{:?}", stock.get("cola"));','Ein insert ersetzt den Wert zum gleichen Schlüssel.','get liefert Option<&V>, nicht null; Besitz- und Referenzregeln gelten.','https://doc.rust-lang.org/std/collections/struct.HashMap.html'),
 v('typescript','Map<K,V>','const stock = new Map<string, number>();\nstock.set("cola", 12);\nstock.set("cola", 10);\nconsole.log(stock.get("cola"));','Map ist eine eigene Schlüssel-Wert-Datenstruktur.','Map hält Einfügereihenfolge ein; get kann undefined liefern. Ein plain object ist keine 1:1-HashMap.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map'),
 v('go','map[K]V','stock := map[string]int{"cola":12}\nstock["cola"] = 10\nvalue, ok := stock["cola"]\nfmt.Println(value, ok)','Das zweite Ergebnis zeigt, ob der Schlüssel existiert.','Fehlender Schlüssel liefert den Nullwert des Typs; Map-Iteration hat keine garantierte Reihenfolge.','https://go.dev/blog/maps'),
 v('csharp','Dictionary<TKey,TValue>','var stock = new Dictionary<string, int>();\nstock["cola"] = 12;\nstock["cola"] = 10;\nConsole.WriteLine(stock["cola"]);','Dictionary bietet Lookup über Schlüssel.','Fehlende Schlüssel beim Indexer werfen KeyNotFoundException; TryGetValue ist der sichere Zugriff.','https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2')
],'maps'),
c('uniqueness','Mengen & Eindeutigkeit','data','intermediate','Wie verhindern wir doppelte Einträge?','Ein Set speichert jedes Element nur einmal.','Eine Gästeliste: Dieselbe Person zweimal eintragen ergibt trotzdem nur einen Eintrag.',[
 'Ein Wert wird eingefügt.',
 'Beim zweiten identischen Wert verändert sich die Menge nicht.',
 'Die Suche testet nur Zugehörigkeit, keine Position.'
],['Viele Mengen garantieren keine Reihenfolge.','Gleichheit und Hashbarkeit sind relevante Sprachunterschiede.'],['sequences'],['set','dedup','collection'],
 'Prüfe, ob eine ID schon verarbeitet wurde.','Ein Set kann Wiederholungen verhindern.','Beim zweiten Einfügen von "A7" bleibt die Menge unverändert.',[
 v('java','HashSet','Set<String> seen = new HashSet<>();\nSystem.out.println(seen.add("A7")); // true\nSystem.out.println(seen.add("A7")); // false','add zeigt, ob sich die Menge verändert hat.','HashSet erhält keine verlässliche Einfügereihenfolge.','https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashSet.html'),
 v('python','set','seen = set()\nseen.add("A7")\nseen.add("A7")\nprint(len(seen)) # 1','Doppelte Werte werden automatisch eliminiert.','Elemente müssen hashbar sein; set.add liefert None statt Erfolgsmeldung.','https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset'),
 v('rust','HashSet','use std::collections::HashSet;\nlet mut seen = HashSet::new();\nprintln!("{}", seen.insert("A7"));\nprintln!("{}", seen.insert("A7"));','insert signalisiert, ob der Wert neu war.','Wie HashMap gelten Ownership, Eq und Hash.','https://doc.rust-lang.org/std/collections/struct.HashSet.html'),
 v('typescript','Set','const seen = new Set<string>();\nseen.add("A7");\nseen.add("A7");\nconsole.log(seen.size); // 1','Set speichert eindeutige Werte.','Objekte werden nach Referenzidentität statt strukturellem Inhalt verglichen.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set')
],'sets'),
c('functions','Funktionen & Parameter','abstraction','basics','Wie machen wir einen Rechenschritt wiederverwendbar?','Wir geben einer Berechnung einen Namen und beschreiben ihre Eingaben.','Ein Rezept wird mit Zutaten aufgerufen und liefert ein Ergebnis.',[
 'Die Funktion nimmt Parameter entgegen.',
 'Ein Ausdruck berechnet einen Wert.',
 'return liefert das Ergebnis zurück.'
],['Nebeneffekte machen Wiederverwendung und Tests komplizierter.'],['variables'],['function','method','parameter','return'],
 'Schreibe eine Funktion, die verkaufte Flaschen vom Bestand abzieht.','Eine Funktion erhält stock und sold.','Für 10 und 3 wird 7 zurückgegeben.',[
 v('java','Statische Methode','static int remaining(int stock, int sold) {\n    return stock - sold;\n}','Eine Methode mit expliziten Parametertypen.','Java hat keine freien Funktionen außerhalb von Klassen.','https://dev.java/learn/methods/'),
 v('python','def','def remaining(stock: int, sold: int) -> int:\n    return stock - sold','Die Annotation dokumentiert erwartete Typen.','Python erzwingt Typannotationen zur Laufzeit nicht.','https://docs.python.org/3/tutorial/controlflow.html#defining-functions'),
 v('rust','fn','fn remaining(stock: i32, sold: i32) -> i32 {\n    stock - sold\n}','Der letzte Ausdruck ohne Semikolon ist der Rückgabewert.','Rust unterscheidet Ausdruck und Anweisung; Ownership kann Parametertypen beeinflussen.','https://doc.rust-lang.org/book/ch03-03-how-functions-work.html'),
 v('typescript','function','function remaining(stock: number, sold: number): number {\n  return stock - sold;\n}','TypeScript prüft die Funktion zur Entwicklungszeit.','Zur Laufzeit ist es JavaScript; der Rückgabetyp wird nicht überprüft.','https://www.typescriptlang.org/docs/handbook/2/functions.html')
],'methods'),
c('records','Unveränderliche Datenträger & Records','abstraction','intermediate','Wie bündeln wir zusammengehörige Daten ohne viel Boilerplate?','Ein Datenträger gruppiert Werte unter sprechenden Namen.','Ein ausgefülltes Formular: Felder ergeben zusammen einen Datensatz.',[
 'Wir definieren Felder eines Artikels.',
 'Wir erzeugen einen Wert mit konkreten Daten.',
 'Wir lesen Felder und vergleichen gegebenenfalls zwei Werte.'
],['Immutability, Gleichheit, Kopieren und Laufzeitprüfung unterscheiden sich stark.','Diese Formen sind bewusst nur ähnlich, nicht identisch.'],['functions'],['record','dataclass','struct','tuple','immutable','value-object'],
 'Modelliere eine Bestellposition mit ID und Menge und erkläre, ob zwei gleiche Instanzen als gleich gelten.','Achte auf Wertgleichheit und Mutierbarkeit.','Java record und Python frozen dataclass bieten Wertgleichheit; Rust benötigt entsprechende Derives.',[
 v('java','record','record Item(String id, int amount) {}\nItem item = new Item("A7", 2);\nSystem.out.println(item.id());','Automatisch generierter Konstruktor, Zugriffsmethoden, equals, hashCode und toString.','Record-Komponenten sind final, aber enthaltene veränderliche Objekte werden nicht tief eingefroren.','https://docs.oracle.com/en/java/javase/21/language/records.html'),
 v('python','@dataclass(frozen=True)','from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Item:\n    id: str\n    amount: int\n\nitem = Item("A7", 2)','Dataclass generiert Konstruktor und Wertvergleich; frozen verhindert übliche Feldzuweisungen.','Keine vollständig erzwungene Unveränderlichkeit; Typannotationen sind nicht automatisch Laufzeitvalidierung.','https://docs.python.org/3/library/dataclasses.html','similar'),
 v('rust','struct + derive','#[derive(Debug, PartialEq, Eq)]\nstruct Item { id: String, amount: i32 }\nlet item = Item { id: "A7".into(), amount: 2 };','Struct bündelt Felder; Derives liefern explizit gewünschte Traits.','Rust-Structs sind nicht automatisch unveränderlich; mut entscheidet über Bindung/Borrows. Gleichheit wird nicht automatisch erzeugt.','https://doc.rust-lang.org/book/ch05-01-defining-structs.html','related'),
 v('typescript','Readonly-Objekttyp','type Item = Readonly<{ id: string; amount: number }>;\nconst item: Item = {id: "A7", amount: 2};','Readonly schützt Eigenschaften bei der TypeScript-Prüfung.','Kein Java-Record: keine automatische Wertgleichheit und keine Laufzeit-Unveränderlichkeit.','https://www.typescriptlang.org/docs/handbook/2/objects.html','related'),
 v('csharp','record','public record Item(string Id, int Amount);\nvar item = new Item("A7", 2);','C#-Records liefern wertbasierte Gleichheit und eine prägnante Deklaration.','C# record class und record struct unterscheiden Referenz-/Wertsemantik; Inhalte sind nicht tief unveränderlich.','https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/record','similar'),
 v('kotlin','data class','data class Item(val id: String, val amount: Int)\nval item = Item("A7", 2)','data class generiert equals, hashCode, toString und copy.','val schützt eine Referenz, garantiert keine tiefe Unveränderlichkeit der enthaltenen Objekte.','https://kotlinlang.org/docs/data-classes.html','similar')
]),
c('generics','Generische Typen','abstraction','intermediate','Wie bleibt ein Container für verschiedene Typen sicher nutzbar?','Ein Typparameter beschreibt die Art des Inhalts, ohne die ganze Klasse zu kopieren.','Eine Kiste bekommt ein Typenschild, bevor wir etwas hineinlegen.',[
 'Eine Containerform wird einmal definiert.',
 'Der Typparameter steht für einen konkreten Typ.',
 'Der Compiler beziehungsweise Typechecker erkennt unpassende Werte.'
],['Generics sind keine universell identische Laufzeitfunktion.','Manche Sprachen prüfen Typen statisch, andere bieten nur optionale Annotationen.'],['functions','sequences'],['generic','type-parameter','template'],
 'Entwirf einen Behälter für einen Wert, der sowohl Strings als auch Ganzzahlen halten kann.','Verwende T als Typparameter.','Ein generischer Container kann für Box<String> und Box<Integer> verwendet werden.',[
 v('java','Generics / Type Erasure','class Box<T> {\n  final T value;\n  Box(T value) { this.value = value; }\n}\nBox<String> box = new Box<>("Cola");','Statische Prüfung parametrischer Typen.','Java verwendet meist Type Erasure: T ist nicht in derselben Form zur Laufzeit verfügbar.','https://dev.java/learn/generics/'),
 v('python','Generic / TypeVar','from typing import Generic, TypeVar\nT = TypeVar("T")\nclass Box(Generic[T]):\n    def __init__(self, value: T): self.value = value','Typprüfer können Box[str] prüfen.','Typannotationen erzwingen den Typ zur Laufzeit nicht; Python bleibt dynamisch typisiert.','https://docs.python.org/3/library/typing.html','related'),
 v('rust','Generics / Monomorphisierung','struct Boxed<T> { value: T }\nlet box_value = Boxed { value: String::from("Cola") };','Generische Typen werden statisch geprüft.','Rust monomorphisiert häufig konkrete Typkombinationen; das unterscheidet sich von Javas Erasure.','https://doc.rust-lang.org/book/ch10-01-syntax.html'),
 v('typescript','Type Parameters','type Box<T> = { value: T };\nconst box: Box<string> = { value: "Cola" };','Generische Typen schützen bei der statischen Analyse.','Die generische TypeScript-Information existiert zur Laufzeit nicht.','https://www.typescriptlang.org/docs/handbook/2/generics.html'),
 v('go','Type Parameters','type Box[T any] struct { Value T }\nbox := Box[string]{Value: "Cola"}','Generische Strukturen verwenden Typ-Parameter.','Go-Constraints und Methodenregeln unterscheiden sich von Java und Rust.','https://go.dev/doc/tutorial/generics')
],'generics'),
c('stream-pipelines','Pipelines: Filter, Map, Reduce','flow','intermediate','Wie verwandeln wir viele Elemente nachvollziehbar in ein Ergebnis?','Eine Verarbeitungskette wählt Elemente aus und formt sie um.','Ein Fließband: prüfen, bearbeiten, einsammeln.',[
 'Ausgangsdaten: [1, 2, 3, 4, 5].',
 'filter behält nur gerade Zahlen: [2, 4].',
 'map quadriert: [4, 16].',
 'Das Ergebnis wird eingesammelt.'
],['Lazy oder eager Ausführung und Zwischenspeicherung sind je nach Sprache verschieden.','Pipelines mit Seiteneffekten erschweren das Verständnis.'],['sequences','functions'],['stream','iterator','filter','map','reduce'],
 'Filtere gerade Zahlen und quadriere sie.','Erst filtern, dann umwandeln.','Das Ergebnis ist [4, 16].',[
 v('java','Stream API','List<Integer> result = List.of(1, 2, 3, 4, 5).stream()\n    .filter(n -> n % 2 == 0)\n    .map(n -> n * n)\n    .toList();','Zwischenoperationen sind lazy, toList ist terminal.','Java-Streams sind nur einmal verwendbar; toList liefert eine nicht modifizierbare Liste.','https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html'),
 v('python','Generatorausdruck / Comprehension','nums = [1, 2, 3, 4, 5]\nresult = [n * n for n in nums if n % 2 == 0]','Eine List-Comprehension erstellt direkt eine Ergebnisliste.','Die List-Comprehension ist eager; Generatorausdrücke sind lazy und semantisch näher an Iteratoren.','https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions','similar'),
 v('rust','Iterator-Kette','let result: Vec<i32> = (1..=5)\n    .filter(|n| n % 2 == 0)\n    .map(|n| n * n)\n    .collect();','Iterator-Adapter sind lazy, collect konsumiert.','Rusts Iterator-Typen, Besitz und Borrowing unterscheiden sich von Java-Streams.','https://doc.rust-lang.org/book/ch13-02-iterators.html'),
 v('typescript','Array.filter/map','const result = [1, 2, 3, 4, 5]\n  .filter(n => n % 2 === 0)\n  .map(n => n * n);','Methoden erzeugen schrittweise neue Arrays.','Array.filter und map sind eager; nicht dasselbe Ausführungsmodell wie Java-Stream.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map','similar'),
 v('go','Explizite Schleife','var result []int\nfor _, n := range []int{1, 2, 3, 4, 5} {\n  if n % 2 == 0 { result = append(result, n*n) }\n}','Eine Schleife bildet dieselbe Datenverarbeitung ab.','Die Standardbibliothek bietet keine direkt gleichwertige eingebaute Stream-Kette.','https://go.dev/tour/flowcontrol/1','related')
],'streams'),
c('absence','Fehlende Werte','errors','intermediate','Wie machen wir sichtbar, dass etwas nicht gefunden wurde?','Eine Suche kann erfolgreich sein oder keinen Wert liefern.','Ein Paket: entweder liegt etwas drin oder es ist leer.',[
 'Eine Funktion sucht nach einem Artikel.',
 'Die Funktion liefert einen Wert oder zeigt Abwesenheit.',
 'Der Aufrufer muss den fehlenden Fall behandeln.'
],['null, None, undefined, Option und Komma-ok sind unterschiedliche Vertragsmodelle.'],['functions'],['optional','null','none','option','undefined'],
 'Lies einen möglicherweise nicht vorhandenen Bestand sicher aus.','Behandle Abwesenheit explizit.','Gib bei fehlendem Eintrag einen Ersatzwert aus.',[
 v('java','Optional<T>','Optional<String> item = Optional.ofNullable(findName());\nString name = item.orElse("Unbekannt");','Optional modelliert einen möglicherweise fehlenden Wert.','Optional ist häufig für Rückgaben gedacht; orElse berechnet seinen Parameter eager.','https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Optional.html'),
 v('python','None','name = find_name()\nshown = name if name is not None else "Unbekannt"','None repräsentiert fehlenden Inhalt.','Optionale Typen (str | None) werden normalerweise nur vom Typechecker geprüft.','https://docs.python.org/3/library/constants.html#None','related'),
 v('rust','Option<T>','let name: Option<&str> = None;\nlet shown = name.unwrap_or("Unbekannt");','Some(T) oder None erzwingen ein Matching des Falls.','Rust Option ist ein Enum mit statischer Typprüfung, keine Nullable-Referenz.','https://doc.rust-lang.org/std/option/enum.Option.html'),
 v('typescript','undefined / union','const name: string | undefined = undefined;\nconst shown = name ?? "Unbekannt";','Eine Union zeigt an, dass ein Wert fehlen kann.','strictNullChecks sollte aktiv sein; Laufzeitdaten brauchen Validierung.','https://www.typescriptlang.org/docs/handbook/2/everyday-types.html','related'),
 v('go','Komma-ok','stock := map[string]int{}\nvalue, ok := stock["cola"]\nfmt.Println(value, ok)','ok trennt fehlenden Schlüssel vom Nullwert.','Nicht jede Go-Funktion folgt dem Komma-ok-Muster; fehlende Werte sind kein einheitlicher Option-Typ.','https://go.dev/blog/maps','related')
],'optional'),
c('errors','Fehler als Kontrollfluss oder Wert','errors','intermediate','Wie geben wir Fehlschläge verständlich an den Aufrufer weiter?','Fehler sind erwartbare Zustände, für die wir einen klaren Vertrag brauchen.','Ein Lieferschein markiert entweder erfolgreich oder meldet einen konkreten Fehler.',[
 'Die Operation kann erfolgreich sein oder fehlschlagen.',
 'Ein Fehler wird signalisiert oder zurückgegeben.',
 'Der Aufrufer entscheidet, ob er reagiert, weiterleitet oder abbricht.'
],['Exceptions und Result-Werte können denselben Zweck haben, ändern aber den Kontrollfluss.'],['conditionals','functions'],['exception','result','error','try'],
 'Prüfe, dass eine Menge nicht negativ sein darf.','Entscheide, ob du wirfst oder einen Fehlerwert lieferst.','Der Vertrag muss den Fehler sichtbar machen.',[
 v('java','Exception','if (amount < 0) {\n    throw new IllegalArgumentException("amount");\n}','Eine Exception unterbricht den normalen Ablauf.','Checked und unchecked Exceptions unterscheiden sich; try/catch fängt nur passende Typen.','https://dev.java/learn/exceptions/'),
 v('python','raise / except','if amount < 0:\n    raise ValueError("amount")','Fehler werden durch Exceptions signalisiert.','Python unterscheidet keine checked Exceptions.','https://docs.python.org/3/tutorial/errors.html'),
 v('rust','Result<T,E>','fn validate(amount: i32) -> Result<i32, String> {\n  if amount < 0 { Err("amount".into()) } else { Ok(amount) }\n}','Result ist ein Typ mit expliziten Erfolgs- und Fehlerzweigen.','Kein automatisches Stack-Unwinding bei jedem Err; ? propagiert den Fehlerwert.','https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html','related'),
 v('typescript','throw / catch','if (amount < 0) {\n  throw new RangeError("amount");\n}','JavaScript unterstützt Exceptions.','TypeScript hat keine standardmäßig checked Exceptiontypen; ein expliziter Result-Uniontyp ist alternativ möglich.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw'),
 v('go','error-Rückgabe','func validate(amount int) (int, error) {\n  if amount < 0 { return 0, errors.New("amount") }\n  return amount, nil\n}','Fehler sind typischerweise explizite Rückgabewerte.','Es gibt daneben panic/recover für andere Fehlerklassen.','https://go.dev/blog/error-handling-and-go','related')
],'exceptions'),
c('contracts','Verträge & Polymorphie','abstraction','intermediate','Wie können verschiedene Implementierungen austauschbar sein?','Ein Vertrag beschreibt, was ein Objekt können muss, nicht wie.','Ein Stecker: Unterschiedliche Geräte erfüllen dieselbe Schnittstelle.',[
 'Ein Client benennt benötigte Operationen.',
 'Verschiedene Implementierungen erfüllen diese Operationen.',
 'Der Client arbeitet mit dem Vertrag statt mit konkreten Klassen.'
],['Vererbung ist nicht die einzige Form von Polymorphie.','Duck Typing und Traits unterscheiden sich von nominalen Interfaces.'],['functions','records'],['interface','trait','protocol','duck-typing'],
 'Entwirf zwei Zahlungsarten mit einer gemeinsamen pay-Operation.','Trenne Vertrag und Implementierung.','Der aufrufende Code kann beide über dieselbe Schnittstelle bedienen.',[
 v('java','Interface','interface Payment { boolean pay(int cents); }\nclass Cash implements Payment {\n  public boolean pay(int cents) { return cents >= 0; }\n}','Nominaler Vertrag mit implements.','Ein Interface kann Default-Methoden haben; dynamischer Dispatch erfolgt über Referenztyp und Laufzeittyp.','https://dev.java/learn/interfaces/'),
 v('python','Protocol','from typing import Protocol\nclass Payment(Protocol):\n    def pay(self, cents: int) -> bool: ...','Ein Protocol beschreibt strukturelle Typkompatibilität für Typechecker.','Python erzwingt Protocol-Typen standardmäßig nicht zur Laufzeit.','https://docs.python.org/3/library/typing.html#typing.Protocol','related'),
 v('rust','trait','trait Payment { fn pay(&self, cents: i32) -> bool; }','Ein Trait benennt benötigtes Verhalten.','Generics mit Trait Bounds nutzen häufig statischen Dispatch; dyn Trait erlaubt dynamischen Dispatch.','https://doc.rust-lang.org/book/ch10-02-traits.html'),
 v('typescript','interface','interface Payment { pay(cents: number): boolean }','Strukturelle Kompatibilität statt verpflichtendem implements.','Interfaces verschwinden zur Laufzeit; das Verhalten wird nicht automatisch validiert.','https://www.typescriptlang.org/docs/handbook/2/everyday-types.html')
],'interfaces'),
c('async','Asynchronität & Nebenläufigkeit','concurrency','advanced','Wie warten wir auf Arbeit, ohne alles zu blockieren?','Lange Aufgaben sollen die restliche Anwendung möglichst wenig aufhalten.','Während ein Kaffee brüht, kannst du eine Bestellung notieren – statt reglos zu warten.',[
 'Eine Operation beginnt und liefert zunächst einen Platzhalter oder Handle.',
 'Während sie wartet, kann andere Arbeit stattfinden.',
 'Ein await oder anderes Warteverfahren liefert später das Ergebnis.'
],['async ist nicht automatisch parallel oder multithreaded.','Blockierende und nichtblockierende Laufzeitmodelle unterscheiden sich.'],['functions','errors'],['async','await','future','promise','thread'],
 'Warum kann eine Oberfläche während einer Netzwerkabfrage weiter reagieren?','Denke an asynchrone I/O statt CPU-Parallelität.','Die Arbeit wird später fortgesetzt; die Ereignisverarbeitung kann andere Aufgaben erledigen.',[
 v('java','CompletableFuture','CompletableFuture<Integer> result =\n    CompletableFuture.supplyAsync(() -> 42);\nSystem.out.println(result.join());','Ein Future repräsentiert einen später verfügbaren Wert.','join blockiert den aktuellen Thread; CompletableFuture ist nicht dasselbe wie JavaScript async/await.','https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html','related'),
 v('python','asyncio','import asyncio\nasync def answer():\n    await asyncio.sleep(1)\n    return 42\nprint(asyncio.run(answer()))','await gibt bei wartender I/O die Kontrolle an die Eventloop ab.','Eine CPU-intensive Funktion blockiert die Eventloop, wenn sie nicht ausgelagert wird.','https://docs.python.org/3/library/asyncio.html'),
 v('rust','Future / async','async fn answer() -> i32 { 42 }\n// Eine Runtime muss den Future ausführen.','async erzeugt einen Future, der von einem Executor gepollt wird.','Rust std allein startet keine komplette Async-Runtime; tokio ist eine mögliche Runtime.','https://doc.rust-lang.org/book/ch17-01-futures-and-syntax.html','related'),
 v('typescript','Promise / async-await','async function answer(): Promise<number> {\n  return 42;\n}\nanswer().then(console.log);','async liefert ein Promise.','await blockiert normalerweise nicht den JS-Eventloop-Thread, CPU-lastiger synchroner Code dagegen schon.','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function')
])
];
export const CONCEPT_BY_ID:ReadonlyMap<string,Concept>=new Map(CONCEPTS.map(concept=>[concept.id,concept]));
export function getConcept(id:string):Concept {const concept=CONCEPT_BY_ID.get(id);if(!concept)throw Error('Unbekanntes Konzept: '+id);return concept;}
