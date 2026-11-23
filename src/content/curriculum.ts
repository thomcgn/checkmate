import {CONCEPTS} from './concepts.ts';
import {TEXTBOOK} from './textbook.ts';
import type {Stage} from '../shared/types';

/**
 * Editorial curriculum, not generated filler articles. A topic is only "written"
 * when an independently reviewed, taught chapter exists. Never infer coverage
 * from a title, a language example or a documentation link.
 */
export type CurriculumModule={
 readonly id:string; readonly title:string;readonly level:Stage;
 readonly topics:readonly string[];
};
export type CurriculumTopic={
 readonly id:string;readonly moduleId:string;readonly title:string;
 readonly level:Stage;readonly chapterId:string|null;
 readonly status:'written'|'not-written';
};
const module=(id:string,title:string,level:Stage,topics:string):CurriculumModule=>({
 id,title,level,topics:topics.split('|').map(t=>t.trim()).filter(Boolean)
});
export const CURRICULUM:readonly CurriculumModule[]=[
 module('first-steps','Einstieg, Denkmodelle & Werkzeuge','basics',
 'Was ist ein Programm?|Ausführen vs. Kompilieren|Interpreter, Runtime & VM|Quellcode und Maschinencode|IDE und Editor|Terminal und Shell|Projektstruktur verstehen|Variablen & Bindungen|Primitive Typen und Objekte|Typinferenz und Typannotationen|Operatoren und Ausdrücke|Boolesche Logik|Bedingungen|Switch, Match & Pattern Matching|Schleifen und Iteration|Break, Continue und Return|Gültigkeitsbereiche|Kommentare und Dokumentation|Ein- und Ausgabe|Debugging und Breakpoints'),
 module('functions','Funktionen & Abstraktion','basics',
 'Funktionen & Parameter|Rückgabewerte|Funktionsüberladung|Optionale Parameter & Defaults|Named Arguments|Referenzen und Wertübergabe|Funktionen als Werte|Lambdas und Closures|Rekursion|Tail Recursion|Reine Funktionen|Seiteneffekte|Immutabilität|Higher-Order Functions|Currying|Komposition|Fehler in Funktionen|Design by Contract'),
 module('collections','Datenstrukturen & Collections','basics',
 'Sequenzen & Listen|Arrays vs. dynamische Listen|Tupel|Schlüssel-Wert-Zuordnungen|Mengen & Eindeutigkeit|Deque & Queue|Stack und LIFO|Linked Lists|Hashing und Kollisionen|Equality vs. Identity|Sortieren und Comparator|Tree Maps und geordnete Maps|Iteratoren|Slicing und Views|Deep vs. Shallow Copy|Mutable vs. Immutable Collections|Collection Complexity|Null- und Fehlwerte|Option und Optional|Records & Dataclasses'),
 module('oop','Objektorientierung & Typmodelle','intermediate',
 'Klassen und Instanzen|Konstruktoren & Invarianten|Kapselung|Properties & Getter|Vererbung|Komposition statt Vererbung|Polymorphie|Interfaces & Traits|Abstrakte Klassen|Strukturelle vs. nominale Typisierung|Generics|Typgrenzen und Wildcards|Kovarianz und Kontravarianz|Type Erasure|Sealed Types & Unions|Enums & Algebraic Data Types|Records und Value Objects|Entity Identity|Dependency Injection|SOLID im Kontext'),
 module('functional','Datenverarbeitung & funktionale Muster','intermediate',
 'Pipelines: Filter, Map, Reduce|Mapping und Transformation|Filter und Prädikate|Fold und Reduce|FlatMap|Lazy vs. Eager Evaluation|Java Streams|Rust Iteratoren|Python Generatoren|JavaScript Array-Methoden|LINQ|Kotlin Sequences|Grouping & Aggregation|Partitionieren|Short-Circuiting|Collector und Materialisierung|Nebenwirkungen in Pipelines|Parallel Streams|Infinite Sequences|Function Pipelines testen'),
 module('errors','Fehler, Sicherheit & Robustheit','intermediate',
 'Exceptions und Fehlerfälle|Try, Catch und Finally|Checked vs. Unchecked Exceptions|Result und Error Returns|Custom Error Types|Null-Sicherheit|Input Validation|Boundary Validation|Fehlerpropagation|Ressourcenfreigabe und RAII|Timeouts und Retry|Idempotenz|Rate Limiting|Authentifizierung und Autorisierung|Passwort-Hashing|Secrets Management|SQL Injection|XSS und CSRF|Deserialisierung und Trust Boundaries|Sicheres Logging'),
 module('algorithms','Algorithmen & Komplexität','intermediate',
 'Big O und Speicherkomplexität|Lineare und binäre Suche|Sortierverfahren|Stabile Sortierung|Zweizeigerverfahren|Sliding Window|Hashbasierte Algorithmen|Divide and Conquer|Greedy Algorithms|Backtracking|Dynamische Programmierung|Memoization|Bäume und Traversierung|Graphen und Wege|BFS und DFS|Topologische Sortierung|Heaps und Priority Queues|Rekursive vs. iterative Lösungen|Algorithmische Grenzen|Benchmarking richtig verstehen'),
 module('testing','Testing, Qualität & Debugging','intermediate',
 'Unit Tests|Arrange Act Assert|JUnit und Testläufe|Pytest|Jest und Vitest|Test-Doubles: Stub, Mock & Fake|Integrationstests|End-to-End Tests|UI-Automation|Regressionstests|Parametrisierte Tests|Property-Based Testing|Test-Driven Development|Code Coverage|Mutation Testing|Fixtures und Testdaten|Deterministische Tests|Fehleranalyse & Stacktraces|Profiling|Refactoring und Code Smells'),
 module('data','Datenbanken, Dateien & Persistenz','intermediate',
 'Dateien und Streams|CSV, JSON und YAML|Serialisierung|SQL Grundlagen|Datenmodellierung|Primär- und Fremdschlüssel|Normalisierung|Joins|Indizes und Query Plans|Transaktionen und ACID|Isolation Levels|Optimistic Locking|Migrationen und Schemaversionierung|ORMs und Entity Lifecycle|Repositories und DAOs|Connection Pooling|NoSQL vs. SQL|Caching und Invalidation|Pagination|Suchindizes'),
 module('web','Web, APIs & verteilte Systeme','intermediate',
 'HTTP Request und Response|HTTP Methoden & Semantik|Statuscodes|REST und Ressourcen|OpenAPI Verträge|JSON Schema|Routing & Controller|Middleware und Filter|Session vs. Token|OAuth & OpenID Connect|JWT Claims und Lebensdauer|CORS|Cookies und SameSite|WebSockets|Server-Sent Events|API Pagination|Versionsstrategien|Fehlerverträge|Resilience Patterns|Message Queues'),
 module('concurrency','Nebenläufigkeit, Async & Speicher','advanced',
 'Async und Futures|Threads und Prozesse|Concurrency vs. Parallelism|Race Conditions|Deadlocks|Mutex und Lock|Atomare Operationen|Memory Model|Thread Pools|Executors und Scheduling|Structured Concurrency|Cancellation und Context|Promises und Event Loop|Go Goroutines & Channels|Rust Async/Await & Tokio|Java Virtual Threads|Backpressure|Ownership und Borrowing|Lebensdauern und Lifetimes|Garbage Collection'),
 module('architecture','Architektur & Softwaredesign','advanced',
 'Schichtenarchitektur|Ports and Adapters|Hexagonal Architecture|Domain-Driven Design|Bounded Contexts|Entities & Value Objects|Aggregates & Invariants|CQRS|Event-Driven Architecture|Monolith vs. Microservices|Modular Monolith|Dependency Inversion|Factory und Builder|Strategy Pattern|Observer Pattern|State Pattern|Adapter Pattern|Decorator Pattern|Architekturentscheidungen (ADR)|Technical Debt'),
 module('devtools','Entwicklungsprozess & Betrieb','intermediate',
 'Git: Commits und Branches|Merge und Rebase|Pull Requests und Reviews|Semantische Versionierung|Build-Systeme|Dependency Management|Lockfiles|Packaging und Releases|CI Quality Gates|Docker und Container|Konfiguration je Umgebung|Observability|Logs, Metriken & Traces|Performance-Budgets|Feature Flags|Backwards Compatibility|Datenbank-Deployments|Rollback Strategien|SBOM und Supply Chain|Lizenz- und Dokumentationspflichten'),
 module('language-internals','Sprachspezifische Tiefe','advanced',
 'Java JVM Bytecode|Java Reflection & Annotation Processing|Java ClassLoader & Modules|Python Descriptors & Decorators|Python GIL & Multiprocessing|Python Metaclasses|TypeScript Conditional Types|TypeScript Mapped Types|TypeScript Declaration Files|JavaScript Prototypes|JavaScript Event Loop Internals|Rust Ownership & Borrow Checker|Rust Traits & Associated Types|Rust Macros|C++ Templates & Concepts|C++ Move Semantics|C++ RAII und Smart Pointer|Go Interfaces & Method Sets|Go Generics & Escape Analysis|C# LINQ & Expression Trees|PHP Attributes & Composer|Kotlin Coroutines & Flow')
];

const map=new Map<string,string>([
 ['Variablen & Bindungen','variables'],['Bedingungen','conditionals'],['Sequenzen & Listen','sequences'],
 ['Schlüssel-Wert-Zuordnungen','key-value'],['Mengen & Eindeutigkeit','uniqueness'],['Funktionen & Parameter','functions'],
 ['Records & Dataclasses','records'],['Generics','generics'],['Pipelines: Filter, Map, Reduce','stream-pipelines'],
 ['Null- und Fehlwerte','absence'],['Exceptions und Fehlerfälle','errors'],['Interfaces & Traits','contracts'],
 ['Async und Futures','async']
]);
const slug=(x:string):string=>x.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
 .replace(/&/g,'-und-').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const written=new Set(TEXTBOOK.map(x=>x.conceptId));
export const CURRICULUM_TOPICS:readonly CurriculumTopic[]=CURRICULUM.flatMap(m=>m.topics.map(title=>{
 const chapterId=map.get(title)??null;
 return {id:m.id+'/'+slug(title),moduleId:m.id,title,level:m.level,chapterId,
  status:chapterId&&written.has(chapterId)?'written' as const:'not-written' as const};
}));
export const CURRICULUM_COVERAGE={
 planned:CURRICULUM_TOPICS.length,
 written:CURRICULUM_TOPICS.filter(x=>x.status==='written').length,
 missing:CURRICULUM_TOPICS.filter(x=>x.status!=='written').length
} as const;
export function findCurriculum(query:string,moduleId:string='all'):readonly CurriculumTopic[]{
 const norm=(s:string)=>s.toLocaleLowerCase('de').normalize('NFKD').replace(/[\u0300-\u036f]/g,'');
 const q=norm(query.trim());
 return CURRICULUM_TOPICS.filter(t=>(moduleId==='all'||t.moduleId===moduleId)&&norm(t.title+' '+t.moduleId).includes(q));
}
export function validateCurriculum():readonly string[]{
 const errors:string[]=[];
 const ids=new Set<string>(),known=new Set(CONCEPTS.map(c=>c.id));
 for(const topic of CURRICULUM_TOPICS){
  if(ids.has(topic.id))errors.push('Doppelter Lehrplantitel: '+topic.id);
  ids.add(topic.id);
  if(topic.chapterId&&!known.has(topic.chapterId))errors.push('Falsche Kapitelzuordnung: '+topic.id);
  if(topic.status==='written'&&(!topic.chapterId||!written.has(topic.chapterId)))errors.push('Falscher Fertigstatus: '+topic.id);
 }
 for(const chapter of TEXTBOOK)if(!CURRICULUM_TOPICS.some(t=>t.chapterId===chapter.conceptId))errors.push('Kapitel im Lehrplan fehlt: '+chapter.conceptId);
 return errors;
}
