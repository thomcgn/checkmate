import type {ChapterSection,TextbookChapter} from './textbook.ts';

const section=(id:string,title:string,paragraphs:string[],code?:string,annotation?:string):ChapterSection=>
 ({id,title,paragraphs,code,annotation});
const chapter=(conceptId:string,readingMinutes:number,objectives:string[],sections:ChapterSection[],
 checkpoints:{question:string;answer:string;reason:string}[],transfer:{prompt:string;answer:string}):TextbookChapter=>
 ({conceptId,readingMinutes,objectives,sections,checkpoints,transfer});

export const EXPANDED_TEXTBOOK:readonly TextbookChapter[]=[
 chapter('ownership',19,[
  'Besitz, Leihen und Lebensdauer als zusammenhängendes Modell erklären.',
  'Den Unterschied zwischen Speicherbereinigung und deterministischer Ressourcenfreigabe benennen.',
  'Typische Fehler wie dangling references und doppelte Freigabe vorhersagen.'
 ],[
  section('why','Warum Besitz überhaupt eine Frage ist',[
   'Jeder Wert in einem Programm muss irgendwann erzeugt, benutzt und wieder freigegeben werden. Wer das nicht regelt, entstehen entweder Speicherlöcher, Zugriffe auf bereits freigegebene Werte oder zwei Stellen, die denselben Wert gleichzeitig verändern. Besitz ist die Antwort auf die Frage, wer diese Verantwortung trägt.',
   'In Sprachen mit Garbage Collector wirkt die Frage oft unsichtbar, weil die Laufzeit den Speicher automatisch aufräumt. Sie verschwindet dadurch aber nicht: Eine Datei, ein Socket oder eine Datenbankverbindung muss trotzdem zu einem festgelegten Zeitpunkt geschlossen werden. Genau dafür gibt es neben der Speicherbereinigung zusätzliche Besitzkonzepte.'
  ]),
  section('borrow','Werte bewegen oder nur ausleihen',[
   'Wenn ein Wert bewegt wird, übernimmt die empfangende Stelle die Verantwortung. Die alte Stelle darf ihn danach nicht mehr verwenden. Das klingt einschränkend, verhindert aber, dass zwei Teile eines Programms denselben veränderbaren Wert gleichzeitig besitzen und einander überschreiben.',
   'Häufig reicht es jedoch, einen Wert nur vorübergehend zu leihen. Eine Referenz erlaubt lesenden Zugriff, ohne den Besitz zu übertragen. In Rust prüft der Borrow-Checker zur Compilezeit, dass eine solche Referenz nicht länger lebt als der Wert selbst und dass nicht gleichzeitig eine veränderliche und mehrere unveränderliche Referenzen existieren.',
  ],'let name = String::from("Ada");\nlet len = measure(&name);\nprintln!("{} {}", name, len);','Die Funktion leiht name über eine Referenz, gibt den Besitz aber nicht zurück. Nach dem Aufruf kann name weiterverwendet werden, weil nur ausgeliehen wurde.'),
  section('lifetime','Lebensdauer ist keine Software-Eigenschaft',[
   'Ein Wert existiert nur innerhalb eines bestimmten Zeitraums. Eine lokale Variable lebt vom Beginn ihres Blocks bis zu dessen Ende; ein Heap-Objekt in GC-Sprachen so lange, wie es erreichbar ist. Eine Referenz, die über diesen Zeitraum hinaus benutzt wird, zeigt auf etwas, das es nicht mehr gibt.',
   'Rust macht diese Beziehung im Typsystem sichtbar und lehnt nicht haltbare Referenzen ab. C++ verlässt sich stärker auf Disziplin und Werkzeuge wie Sanitizer. Java, Python und TypeScript verhindern dangling Speicherreferenzen weitgehend durch gc, erlauben aber weiterhin logisch veraltete Objekte, etwa in einer zwischengespeicherten Liste.'
  ]),
  section('resources','Ressourcen sind wichtiger als Speicher',[
   'Der Garbage Collector gibt Speicher irgendwann frei, aber nicht notwendigerweise sofort. Für Dateien, Netzwerkverbindungen und Transaktionen ist „irgendwann“ zu spät: Betriebssysteme begrenzen die Anzahl offener Dateien, und eine offene Transaktion blockiert andere Arbeitslasten.',
   'Deshalb gibt es in fast allen Sprachen ein explizites Ende der Lebensdauer: try-with-resources in Java, with in Python, using in C# und Rust, defer in Go, useLines in Kotlin. Diese Konstrukte koppeln die Freigabe an einen Gültigkeitsbereich, statt sie dem Zufall der Speicherbereinigung zu überlassen.',
  ],'try (var lines = Files.lines(Path.of("data.txt"))) {\n  lines.forEach(System.out::println);\n}','Der Block öffnet die Ressource und schließt sie am Ende zuverlässig – auch wenn im Inneren eine Exception geworfen wird.'),
  section('practice','Besitz im Code lesen',[
   'Stelle beim Lesen einer Funktion drei Fragen: Welche Werte nimmt sie, gibt sie zurück oder leiht sie nur? Welcher Wert darf nach dem Aufruf noch benutzt werden? Gibt es eine Ressource, die geschlossen werden muss? Diese Fragen sind unabhängig von der Syntax und bleiben auch in unbekannten Sprachen nützlich.',
   'In Reviews ist ein häufiger Fehler, einen Wert nach einer move-Operation weiter zu verwenden oder eine Ressource nur im Erfolgsfall zu schließen. Beides fällt sofort auf, wenn Besitz und Lebensdauer als eigenes Thema gelesen werden.'
  ])
 ],[
  {question:'Warum darf Rust eine Referenz auf eine lokale Variable nicht aus einer Funktion zurückgeben?',answer:'Die Variable lebt nur bis zum Ende der Funktion.',reason:'Die Referenz würde danach auf einen nicht mehr existierenden Wert zeigen; der Borrow-Checker lehnt das ab.'},
  {question:'Räumt der Garbage Collector eine Datei sofort auf?',answer:'Nein.',reason:'Er verwaltet Speicher, nicht die zeitgerechte Freigabe von Ressourcen; dafür gibt es try-with-resources, with oder using.'},
  {question:'Was bedeutet es, einen Wert zu leihen?',answer:'Die empfangende Stelle darf ihn vorübergehend nutzen, besitzt ihn aber nicht.',reason:'Der Besitzer bleibt verantwortlich; nach Ende der Ausleihe kann er den Wert weiterverwenden.'}
 ],{prompt:'Du liest eine Funktion, die eine Datei öffnet und bei einem Fehler früh zurückkehrt. Beschreibe zwei Wege, wie die Datei trotzdem geschlossen wird.',answer:'Entweder ein try-with-resources/with/using-Block, der auch bei früher Rückkehr schließt, oder eine explizite Freigabe vor jeder Rückgabe. Der erste Weg ist weniger fehleranfällig, weil er alle Pfade abdeckt.'}),

 chapter('iterators',18,[
  'Den Unterschied zwischen einer materialisierten Sammlung und einer lazy Folge erklären.',
  'Das Iterator-Protokoll und das Fortbestehen des Zustands zwischen Aufrufen nachvollziehen.',
  'Typische Fehler bei mehrfachem Durchlaufen und unendlichen Folgen benennen.'
 ],[
  section('problem','Listen sind nicht immer die richtige Form',[
   'Eine Liste enthält alle Elemente gleichzeitig. Das ist praktisch, wenn die Daten klein und mehrfach gebraucht sind. Für große oder unendliche Folgen ist es jedoch verschwenderisch oder unmöglich, alle Werte vorab zu speichern. Ein Iterator erzeugt jedes Element erst dann, wenn jemand danach fragt.',
   'Der Unterschied ist fachlich, nicht nur technisch: Eine Liste beantwortet „Was ist alles vorhanden?“, ein Iterator beantwortet „Was kommt als Nächstes?“. Wer diesen Unterschied kennt, wählt bewusst zwischen Speicherverbrauch und wiederholbarer Auswertung.'
  ]),
  section('protocol','Das Protokoll hinter der Schleife',[
   'Ein Iterator hält eine Position oder einen Zustand. Bei jeder Anfrage liefert er das nächste Element und verändert seinen Zustand. Irgendwann meldet er das Ende. for-Schleifen in vielen Sprachen sind nur eine bequeme Schreibweise für dieses Protokoll.',
   'In Python und JavaScript erzeugt yield einen Generator: Die Funktion wird unterbrochen und später an genau dieser Stelle fortgesetzt. In Rust und Java ist der Iterator ein Objekt oder Trait mit einer next-Methode. In C# liefert yield return eine IEnumerable, die LINQ verzögert weiterverarbeitet.',
  ],'def squares():\n    n = 1\n    while True:\n        yield n * n\n        n += 1\n\nfor value in squares():\n    if value > 20: break\n    print(value)','Der Generator bleibt nach jedem yield stehen und erzeugt genau so viele Werte wie die Schleife tatsächlich braucht.'),
  section('lazy','Verzögerte Auswertung als Werkzeug',[
   'Lazy Auswertung bedeutet, dass Operationen wie filter und map erst beim Konsumieren ausgeführt werden. Das spart Arbeit, wenn ein Konsument früh abbricht, und erlaubt unendliche Quellen. Der Preis ist, dass ein Iterator zustandsbehaftet und meist nur einmal durchlaufbar ist.',
   'Wer dieselbe Folge zweimal benötigt, muss sie materialisieren oder neu erzeugen. Das gilt insbesondere für Generatoren: Nach dem ersten Durchlauf sind sie erschöpft. Ein häufiger Fehler ist, einen Generator an zwei Stellen zu verwenden und sich zu wundern, warum die zweite Stelle keine Werte mehr sieht.',
  ],'let sum: i32 = (1..)\n  .map(|n| n * n)\n  .take(3)\n  .sum();','take begrenzt die unendliche Folge auf drei Werte; sum konsumiert genau diese drei Elemente.'),
  section('pitfalls','Zustand, Kosten und Abbruch',[
   'Ein Iterator merkt sich, wo er gerade steht. Das ist hilfreich, aber es bedeutet auch, dass Ausnahmen oder ein früher Abbruch den Zustand nicht zurücksetzen. In parallelen Abläufen darf derselbe Iterator nicht von mehreren Stellen gleichzeitig benutzt werden.',
   'Außerdem ist „lazy“ nicht automatisch „schneller“. Wer eine kleine Liste zehnmal durchläuft, bezahlt zehnmal die Erzeugung. Wer eine große Datei zehnmal filtert, bezahlt zehnmal die Ein- und Ausgabe. Die passende Wahl hängt vom konkreten Zugriffsmuster ab.'
  ]),
  section('composition','Iteratoren composieren',[
   'Der eigentliche Nutzen entsteht durch das Kombinieren mehrerer Schritte: auswählen, umformen, begrenzen, sammeln. Jeder Schritt beschreibt eine Regel, nicht eine Schleife mit verstecktem Zustand. Das macht Datenverarbeitung lesbar und testbar.',
   'Achte jedoch auf die Reihenfolge: Filtern vor dem Map ist etwas anderes als Map vor dem Filtern, wenn die Umformung Fehler oder neue Werte erzeugt. Eine explizite Zwischenliste kann die Reihenfolge sichtbar machen, kostet aber Speicher.'
  ])
 ],[
  {question:'Warum liefert ein Generator beim zweiten Durchlauf keine Werte mehr?',answer:'Er ist zustandsbehaftet und nach dem ersten Durchlauf erschöpft.',reason:'Die Position im Generator bleibt erhalten; eine neue Iteration braucht eine neue Instanz.'},
  {question:'Was bewirkt take(3) bei einer unendlichen Folge?',answer:'Es begrenzt die Konsumation auf drei Elemente.',reason:'Erst danach terminiert die Kette; ohne Begrenzung würde die Auswertung nie enden.'},
  {question:'Ist lazy Auswertung immer schneller als eine Liste?',answer:'Nein.',reason:'Bei mehrfachem Durchlauf wird die Erzeugung mehrfach bezahlt; die Wahl hängt vom Zugriffsmuster ab.'}
 ],{prompt:'Du sollst die ersten fünf geraden Quadratzahlen aus einer unendlichen Zahlenfolge ausgeben. Beschreibe die Reihenfolge der Schritte und begründe sie.',answer:'Zuerst gerade Zahlen filtern, dann quadrieren, dann fünf nehmen und schließlich sammeln oder ausgeben. Das Begrenzen vor dem Sammeln verhindert, dass unendlich viele Werte materialisiert werden.'}),

 chapter('closures',17,[
  'Erklären, wie eine Funktion Werte aus ihrer Erzeugungsumgebung mitnimmt.',
  'Den Unterschied zwischen erfasstem Wert und erfasster Referenz benennen.',
  'Risiken durch langlebige Closures und veränderlichen Zustand erkennen.'
 ],[
  section('capture','Funktionen mit Rucksack',[
   'Eine Closure ist eine Funktion zusammen mit den Variablen, auf die sie zugreift. Sie kann erzeugt, gespeichert und später aufgerufen werden – auch dann, wenn die Funktion, die sie erzeugt hat, längst beendet ist. Die eingeschlossenen Werte bleiben so lange verfügbar, wie die Closure existiert.',
   'Das ist die Grundlage für Rückrufe, Sortierkriterien, Event-Handler und viele Bibliotheks-APIs. Statt bei jedem Aufruf alle Parameter neu zu übergeben, trägt die Funktion einen Teil ihrer Konfiguration mit sich.',
  ],'function counter() {\n  let n = 0;\n  return () => ++n;\n}\nconst next = counter();\nconsole.log(next(), next());','Die innere Funktion greift auf n zu, obwohl counter schon beendet ist. Jeder Aufruf erhöht denselben eingeschlossenen Wert.'),
  section('state','Eingeschlossener Zustand',[
   'Ob die Closure einen Wert kopiert oder eine Referenz hält, ist sprachabhängig und fachlich entscheidend. JavaScript und Go erfassen Variablen üblicherweise als Referenz. Rust unterscheidet mit move explizit zwischen Ausleihen und Übernehmen des Besitzes. Java verlangt, dass erfasste lokale Variablen effektiv unveränderlich sind.',
   'Python benötigt nonlocal, um eine Variable aus der äußeren Funktion zu verändern. Ohne diese Anweisung entsteht eine neue lokale Variable, und der Zähler bleibt bei jedem Aufruf beim selben Wert. Solche Details sind keine Syntax-Kleinigkeit, sondern bestimmen das Verhalten.'
  ]),
  section('escape','Wann die Umgebung länger lebt',[
   'Eine Closure kann die Lebensdauer ihrer Umgebung verlängern. Wenn ein großes Objekt in einer Variablen gehalten wird, die eine langlebige Callback-Funktion erfasst, bleibt dieses Objekt im Speicher, obwohl es fachlich längst nicht mehr gebraucht wird. Das ist ein häufiger Grund für unerwartet hohen Speicherverbrauch.',
   'In Rust macht das Typsystem die Beziehung sichtbar: Eine Closure implementiert Fn, FnMut oder FnOnce, je nachdem, ob sie nur liest, verändert oder den Besitz verbraucht. move zwingt dazu, Werte in die Closure hineinzunehmen und damit ihre Lebensdauer bewusst festzulegen.',
  ],'let offset = String::from("A7");\nlet label = move || println!("{offset}");\nlabel();','move übernimmt den Besitz von offset. Die Variable ist danach außerhalb der Closure nicht mehr verfügbar.'),
  section('pitfalls','Typische Fehler',[
   'Ein klassischer Fehler entsteht in Schleifen: Mehrere erzeugte Closures greifen auf dieselbe Schleifenvariable zu und sehen am Ende alle den letzten Wert. Moderne Sprachen und Werkzeuge haben dafür Regeln, aber das Grundproblem bleibt: Erfasster Zustand wird geteilt.',
   'Ein zweiter Fehler ist die Annahme, eine Closure sei automatischthreadsicher. Ein veränderlicher Zähler in einer Closure ist gerade nicht sicher, wenn mehrere Threads ihn gleichzeitig aufrufen. Hier helfen Synchronisation oder unveränderlicher Zustand.'
  ])
 ],[
  {question:'Warum verändert Python eine erfasste Variable ohne nonlocal nicht?',answer:'Weil eine neue lokale Variable entsteht.',reason:'Ohne nonlocal wird die Zuweisung im inneren Scope als neue Bindung interpretiert.'},
  {question:'Was bedeutet move bei einer Rust-Closure?',answer:'Die Closure übernimmt den Besitz der erfassten Werte.',reason:'Danach kann die äußere Variable nicht mehr verwendet werden; die Lebensdauer ist explizit geregelt.'},
  {question:'Kann eine Closure ein großes Objekt unnötig am Leben halten?',answer:'Ja.',reason:'Solange die Closure erreichbar ist, bleibt auch ihr erfasster Zustand erreichbar.'}
 ],{prompt:'Du registrierst zehn callbacks in einer Schleife und alle geben am Ende denselben Index aus. Erkläre die Ursache und eine mögliche Lösung.',answer:'Alle Closures teilen sich dieselbe erfasste Schleifenvariable. Lösung: den aktuellen Wert pro Iteration in eine neue Variable kopieren beziehungsweise als Parameter an die Closure übergeben.'}),

 chapter('equality',18,[
  'Zwischen Identitätsvergleich und Wertvergleich unterscheiden.',
  'Die Beziehung zwischen equals, hashCode und unveränderlichen Schlüsseln erklären.',
  'Sprachspezifische Fallstricke bei NaN, ±0 und veränderlichen Feldern benennen.'
 ],[
  section('identity','Identität ist nicht Inhalt',[
   'Zwei Objekte können exakt gleich aussehen und trotzdem verschiedene Objekte sein. Ein Referenzvergleich beantwortet nur die Frage, ob zwei Namen auf dasselbe Objekt zeigen. Für fachliche Entscheidungen – etwa ob zwei Bestellungen dieselbe Bestellung sind – ist meist der Inhalt entscheidend.',
   'JavaScript und TypeScript vergleichen Objekte mit === ausschließlich über Referenzidentität. Python hat zusätzlich is für Identität und == für Inhalt. Java und C# verwenden == für Referenzen beziehungsweise primitive Werte und Equals für den Wertvergleich. Diese Werkzeuge darf man nicht verwechseln.'
  ]),
  section('content','Wertvergleich definieren',[
   'Ein Wertvergleich legt fest, welche Felder zur Gleichheit gehören. Java Records und Kotlin Data Classes erzeugen das automatisch aus allen Komponenten. Python dataclasses tun dasselbe, solange die Klasse unveränderlich ist. Rust verlangt ein explizites derive von PartialEq und Eq, was die Entscheidung sichtbar macht.',
   'Wichtig ist die Vollständigkeit: Wenn ein Feld fachlich zur Identität gehört, aber im Vergleich fehlt, werden zwei verschiedene Dinge als gleich behandelt. Umgekehrt kann ein zu strenger Vergleich dazu führen, dass logisch gleiche Werte in einer Map nicht gefunden werden.',
  ],'@dataclass(frozen=True)\nclass Item:\n    id: str\n\na = Item("A7")\nb = Item("A7")\nprint(a == b, a is b)','a und b sind inhaltlich gleich, aber verschiedene Objekte. == liefert True, is liefert False.'),
  section('hash','Gleichheit und Hash gehören zusammen',[
   'Hashbasierte Strukturen wie HashMap und HashSet nutzen einen Hashwert, um den Suchbereich klein zu halten. Die zentrale Regel lautet: Wenn zwei Werte gleich sind, müssen sie denselben Hash liefern. Die Umkehrung gilt nicht – gleiche Hashes dürfen auf ungleiche Werte treffen.',
   'Verletzt man die Regel, findet die Map einen gespeicherten Wert nicht wieder, obwohl er vorhanden ist. Deshalb erzeugen die meisten Sprachen equals und hashCode gemeinsam oder verlangen, dass man beide überschreibt. In Rust gehören Eq und Hash zu den Traits, die gemeinsam abgeleitet werden müssen.',
  ],'#[derive(PartialEq, Eq, Hash)]\nstruct Item { id: String }\nlet mut set = std::collections::HashSet::new();\nset.insert(Item { id: "A7".into() });\nassert!(set.contains(&Item { id: "A7".into() }));','Der gleiche Inhalt erzeugt denselben Hash, deshalb findet contains den neu erzeugten Wert in der Menge.'),
  section('mutation','Veränderliche Schlüssel sind gefährlich',[
   'Wenn ein Objekt als Schlüssel in einer Map dient und danach verändert wird, ändert sich meist sein Hash. Die Map sucht am alten Platz, der Eintrag ist aber am neuen – für den Nutzer wirkt der Wert verschwunden. Aus diesem Grund sollten Schlüssel unveränderlich sein.',
   'In Python verliert eine veränderliche Klasse mit __eq__ automatisch ihr __hash__. In Java und C# ist es Aufgabe des Entwicklers, beide Methoden konsistent zu halten. Kotlin data classes mit var-Feldern und Collections können ebenfalls die Hash-Stabilität gefährden.'
  ]),
  section('edges','Grenzfälle, die überraschen',[
   'NaN ist nicht gleich NaN, obwohl beide Werte denselben Namen tragen. JavaScript Object.is behandelt NaN dagegen als gleich und unterscheidet +0 von -0, während === das nicht tut. Solche Regeln sind selten intuitiv, aber in Numerik und Serialisierung relevant.',
   'Bei Zeichenketten ist zusätzlich zu klären, ob Groß- und Kleinschreibung oder Unicode-Normalisierung zur Gleichheit gehören. Eine fachlich korrekte Lösung benennt diese Entscheidung explizit, statt sie einer Bibliothek stillschweigend zu überlassen.'
  ])
 ],[
  {question:'Warum darf ein Map-Schlüssel nach dem Einfügen nicht verändert werden?',answer:'Weil sich sonst sein Hash ändert und die Map ihn nicht mehr findet.',reason:'Die Struktur sucht am alten Hash bucket; der Eintrag ist dort nicht mehr erreichbar.'},
  {question:'Was ist der Unterschied zwischen == und is in Python?',answer:'== vergleicht den Inhalt, is die Objektidentität.',reason:'Zwei verschieden erzeugte dataclass-Instanzen können gleich, aber nicht identisch sein.'},
  {question:'Warum liefert NaN == NaN üblicherweise false?',answer:'Weil der IEEE-754-Standard NaN als nicht gleich zu sich selbst definiert.',reason:'Object.is weicht davon bewusst ab und behandelt NaN als gleich.'}
 ],{prompt:'Du sollst Produkte nach SKU in einer Map speichern. Das Produkt besitzt zusätzlich ein veränderliches Feld amount. Beschreibe eine sichere Gestaltung des Schlüssels.',answer:'Als Schlüssel nur die unveränderliche SKU verwenden oder ein unveränderliches Value-Objekt mit equals/hashCode aus der SKU. Das veränderliche amount gehört in den Wert, nicht in den Schlüssel.'})
];
