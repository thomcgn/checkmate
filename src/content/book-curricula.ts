/** Editorial roadmaps, not generated chapters. Each published ID must resolve to real bundled writing. */
export type BookChapterPlan={readonly id:string;readonly title:string;readonly prerequisites:readonly string[]};
export type BookPartPlan={readonly id:string;readonly title:string;readonly goal:string;readonly chapters:readonly BookChapterPlan[]};
export type BookCurriculum={readonly language:'java'|'typescript'|'rust';readonly edition:1;readonly parts:readonly BookPartPlan[]};
type ChapterTuple=readonly [id:string,title:string,prerequisites?:readonly string[]];
const part=(id:string,title:string,goal:string,chapters:readonly ChapterTuple[]):BookPartPlan=>({
 id,title,goal,chapters:chapters.map(([chapterId,chapterTitle,prerequisites=[]])=>({
  id:chapterId,title:chapterTitle,prerequisites
 }))
});
export const BOOK_CURRICULA:readonly BookCurriculum[]=[
 {language:'java',edition:1,parts:[
  part('fundamentals','Teil I · Java von Grund auf','Ein lauffähiges Programm schreiben und die Grundbausteine sicher erklären.',[
   ['java-project-setup','JDK, IDE, Quelltexte und der erste Build'],
   ['variables','Variablen, Werte und Gültigkeitsbereiche'],
   ['java-primitive-types','Primitive Typen, Konvertierung und Zahlen'],
   ['java-operators','Operatoren, Ausdrücke und String-Verkettung'],
   ['conditionals','Bedingungen und Entscheidungen',['variables']],
   ['java-loops','Schleifen und Kontrollfluss',['conditionals']],
   ['functions','Methoden, Parameter und Rückgabewerte',['variables']]
  ]),
  part('data','Teil II · Objektorientierung und Datenmodelle','Daten sicher modellieren und die richtige Abstraktion wählen.',[
   ['java-class-design','Klassen, Objekte, Konstruktoren und Kapselung',['functions']],
   ['records','Records und wertorientierte Modelle',['functions']],
   ['java-inheritance','Vererbung, Interfaces und Polymorphie',['java-class-design']],
   ['java-enums','Enums und Fachzustände'],
   ['sequences','Arrays und Listen'],
   ['key-value','Maps und Zuordnungen'],
   ['uniqueness','Sets, Identität und Gleichheit'],
   ['absence','Null, Optional und fehlende Werte'],
   ['errors','Exceptions und Fehlerverträge']
  ]),
  part('collections','Teil III · Generics, Collections und Streams','Typbeziehungen verstehen, Werte transformieren und Seiteneffekte beherrschen.',[
   ['generics','Generische Grundlagen',['sequences']],
   ['java-type-relationships','Invarianz, Bounds, Wildcards und PECS',['generics']],
   ['java-collection-design','Collections, Hashcodes und stabile Schlüssel',['uniqueness']],
   ['java-lambdas','Lambdas und funktionale Interfaces',['functions']],
   ['stream-pipelines','Stream-Grundlagen und Transformation',['sequences']],
   ['java-stream-reasoning','Filterreihenfolge, Collector und Dubletten',['stream-pipelines']]
  ]),
  part('platform','Teil IV · Plattform und praktische Software','Mit Dateien, Netzwerk, Datenbanken und nebenläufigen Abläufen arbeiten.',[
   ['java-file-io','Dateien, Pfade und Streams',['errors']],
   ['java-date-time','Datum, Uhrzeit und Zeitzonen'],
   ['java-http-client','HTTP-Client und JSON-Daten',['errors']],
   ['java-jdbc','SQL und JDBC-Grundlagen'],
   ['async','Nebenläufigkeit und asynchrone Arbeit'],
   ['java-virtual-threads','Virtual Threads und strukturierte Aufgaben',['async']],
   ['java-jvm-memory','JVM, Garbage Collection und Diagnose']
  ]),
  part('engineering','Teil V · Verlässliche Anwendungen','Qualitätskriterien praktisch überprüfen und nachvollziehbar deployen.',[
   ['contracts','Schnittstellenverträge und testbare Regeln'],
   ['java-test-boundaries','JUnit 5 und Grenzfalltests',['contracts']],
   ['java-maven','Maven, Abhängigkeiten und reproduzierbare Builds'],
   ['java-spring-boot','REST-Dienste mit Spring Boot',['java-http-client']],
   ['java-persistence','Persistenz und Transaktionen',['java-jdbc']],
   ['java-architecture','Schichten, Clean Code und Architekturentscheidungen',['contracts']],
   ['java-capstone','Projekt: EventService vom Entwurf zum Test',['java-test-boundaries','java-architecture']]
  ])
 ]},
 {language:'typescript',edition:1,parts:[
  part('fundamentals','Teil I · JavaScript verstehen','Laufzeit, Werte und Kontrolle vor dem Typsystem verstehen.',[
   ['ts-runtime-setup','JavaScript-Laufzeit, Node.js und TypeScript-Compiler'],
   ['variables','Variablen, Bindungen und Immutabilität'],
   ['ts-primitives','Werte, primitive Typen und Konvertierung'],
   ['conditionals','Bedingungen und Kontrollfluss'],
   ['functions','Funktionen, Closures und this'],
   ['sequences','Arrays und Iteration'],
   ['key-value','Objekte und Maps'],
   ['uniqueness','Sets und Wertgleichheit'],
   ['ts-modules','ES Modules und Paketgrenzen']
  ]),
  part('typing','Teil II · Das TypeScript-Typsystem','Beziehungen statt Behauptungen modellieren.',[
   ['ts-inference','Typinferenz, Widening und Literaltypen'],
   ['ts-unions','Unions, Intersections und Narrowing'],
   ['ts-object-model','Object Types, Interfaces und strukturelle Typisierung'],
   ['generics','Generics und Typbeziehungen',['functions']],
   ['ts-generics-advanced','Constraints, keyof und indizierte Typen',['generics']],
   ['ts-utility-types','Utility Types, Mapped und Conditional Types',['ts-generics-advanced']],
   ['records','Records und strukturierte Daten'],
   ['absence','undefined, null und optionale Werte'],
   ['errors','Fehler und explizite Ergebnisverträge']
  ]),
  part('boundaries','Teil III · Sicherheit an Systemgrenzen','Laufzeitdaten validieren und Benutzerzustände konsistent halten.',[
   ['ts-unknown-boundaries','unknown, Type Guards und externe Daten',['ts-object-model']],
   ['contracts','API-Verträge und Runtime-Schemas'],
   ['ts-discriminated-ui','Discriminated Unions und UI-Zustände',['ts-unions']],
   ['stream-pipelines','map, filter und Datenpipelines'],
   ['async','Promise-Grundlagen und Nebenläufigkeit'],
   ['ts-react-async','React-Effekte, Abbruch und Race Conditions',['async']]
  ]),
  part('desktop','Teil IV · React, Node.js und Electron','Robuste Anwendungen mit klarer Prozess- und Datenaufteilung bauen.',[
   ['ts-react-components','React-Komponenten und State'],
   ['ts-hooks','Hooks, Effects und kontrollierte Eingaben',['ts-react-components']],
   ['ts-node-fs','Dateizugriff, Pfade und Fehler in Node.js'],
   ['ts-electron-ipc','Electron-Prozesse, Preload und sichere IPC',['ts-unknown-boundaries']],
   ['ts-storage','Lokale Persistenz, Schema-Versionierung und Migration'],
   ['ts-testing','Vitest, UI- und Integrationstests'],
   ['ts-build','Bundling, Packaging und CI']
  ]),
  part('capstone','Teil V · Praxisprojekt und Architektur','Eine Desktop-Anwendung reproduzierbar entwickeln, prüfen und ausliefern.',[
   ['ts-design','Struktur, Module, SOLID und Fehlergrenzen'],
   ['ts-performance','Profiling, Rendering und Performance'],
   ['ts-security','Sicherheit, Abhängigkeiten und Eingabesanitizing'],
   ['ts-capstone','Projekt: Checkmate-Leser als sichere Desktop-App',['ts-electron-ipc','ts-testing']]
  ])
 ]},
 {language:'rust',edition:1,parts:[
  part('fundamentals','Teil I · Rust von Anfang an','Cargo, Ausdrücke und das Compiler-Feedback verstehen.',[
   ['rust-setup','rustup, Cargo, Editionen und das erste Programm'],
   ['variables','Bindings, Mutabilität und Shadowing'],
   ['rust-types','Skalare Typen, Tupel und Arrays'],
   ['conditionals','if, match und Kontrollfluss'],
   ['functions','Funktionen, Ausdrücke und Rückgaben'],
   ['sequences','Slices, Vec und String'],
   ['rust-patterns','Pattern Matching, Destructuring und Enums']
  ]),
  part('ownership','Teil II · Ownership und Typmodelle','Besitz, Referenzen und wiederverwendbare API-Verträge systematisch nachvollziehen.',[
   ['rust-ownership-traces','Ownership, Copy, Clone und Moves',['variables']],
   ['rust-borrowing-lifetimes','Borrowing, &mut und Lifetimes',['rust-ownership-traces']],
   ['records','Structs, Implementierungen und Methoden'],
   ['rust-enums','Enums und Zustandsmodelle',['rust-patterns']],
   ['absence','Option und nicht vorhandene Werte'],
   ['errors','Result, Fehlerpfade und ?'],
   ['generics','Generische Typen und Funktionen'],
   ['rust-traits','Traits, Bounds und impl Trait',['generics']],
   ['rust-lifetimes-advanced','Referenzbeziehungen und Lifetime-Design',['rust-borrowing-lifetimes']]
  ]),
  part('collections','Teil III · Collections und funktionale Verarbeitung','Daten ohne versteckte Besitzfehler transformieren.',[
   ['key-value','HashMaps und Zuordnungen'],
   ['uniqueness','HashSets und Gleichheit'],
   ['stream-pipelines','Iteratoren, Adapter und Collectors'],
   ['rust-results-iterators','Result, Option und Iteratoren im Projekt',['errors','stream-pipelines']],
   ['rust-smart-pointers','Box, Rc, Arc und RefCell'],
   ['rust-closures','Closures, Fn-Traits und Captures'],
   ['rust-modules','Module, Crates und Sichtbarkeit']
  ]),
  part('systems','Teil IV · Systeme und Nebenläufigkeit','Dateien, Threads und asynchrone Abläufe kontrolliert verwenden.',[
   ['rust-file-io','Dateien, I/O und Fehlerkontext'],
   ['contracts','API-Verträge und Invarianten'],
   ['async','Threads, Channels und Nebenläufigkeit'],
   ['rust-sync','Mutex, RwLock und Sync-Strategien',['async']],
   ['rust-async-await','Futures, async/await und Laufzeit',['async']],
   ['rust-memory','Speicherlayout und Performance'],
   ['rust-unsafe','Unsafe-Randbereiche und Sicherheitsinvarianten']
  ]),
  part('engineering','Teil V · Robuste Rust-Projekte','Tests, Paketierung und sichere Fehlerschnittstellen praktisch anwenden.',[
   ['rust-testing','Unit-, Integrations- und Property-Tests'],
   ['rust-serde','Serde, Datenformate und Validierung'],
   ['rust-cli','CLI-Programme und Konfiguration'],
   ['rust-workspaces','Cargo Workspaces, CI und Lints'],
   ['rust-capstone','Projekt: offline nutzbares Analyse-CLI',['rust-testing','rust-file-io']]
  ])
 ]}
];
export function bookCurriculum(language:string):BookCurriculum|undefined{
 return BOOK_CURRICULA.find(item=>item.language===language);
}
export function validateBookCurricula():string[]{
 const errors:string[]=[];
 for(const curriculum of BOOK_CURRICULA){
  const seen=new Set<string>();
  for(const part of curriculum.parts){
   if(part.chapters.length<3)errors.push(curriculum.language+' / '+part.title+': zu wenig geplante Kapitel');
   for(const chapter of part.chapters){
    if(seen.has(chapter.id))errors.push(curriculum.language+': doppelte Kapitel-ID '+chapter.id);
    seen.add(chapter.id);
    if(!chapter.title.trim())errors.push(curriculum.language+': leerer Kapiteltitel');
   }
  }
  for(const part of curriculum.parts)for(const chapter of part.chapters)
   for(const prerequisite of chapter.prerequisites)
    if(!seen.has(prerequisite))errors.push(curriculum.language+': unbekannte Voraussetzung '+prerequisite);
 }
 return errors;
}
