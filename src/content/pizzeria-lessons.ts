import type {BeginnerChapter,BeginnerWord} from './pizzeria-book.ts';

/**
 * Ausformulierte Lektionen für Kapitel 5–37. Jede Lektion bleibt bewusst kurz:
 * eine Idee, höchstens acht Codezeilen, eine Aufgabe und ein typischer Fehler.
 */
type Lesson=Pick<BeginnerChapter,'id'|'explain'|'wordbank'|'code'|'output'|'tryIt'|'misconception'|'solution'>;
const lesson=(id:string,explain:readonly string[],wordbank:readonly BeginnerWord[],
 options:{code?:string;output?:string;tryIt:string;misconception:string;solution:string}):Lesson=>
 ({id,explain,wordbank,...options});
const word=(term:string,definition:string):BeginnerWord=>({term,definition});

export const PIZZERIA_LESSONS:readonly Lesson[]=[
 lesson('greeting',[
  'Dein Laden hat einen Bildschirm an der Tür. Als Erstes soll dort stehen: „Willkommen in der Pizzeria!" Computer können Text ausgeben – das heißt: sie schreiben ihn auf den Bildschirm.',
  'In Java benutzen wir dafür `System.out.println`. Das klingt kompliziert, ist aber nur der lange Name für „schreib mir etwas auf den Bildschirm". Wichtig sind die Anführungszeichen: Alles darin ist Text und wird genau so angezeigt.',
  'Du siehst: Programmieren heißt oft nur, dem Computer ganz genau zu sagen, was er tun soll. Heute sagst du ihm: „Gib diesen Text aus."'
 ],[
  word('Ausgabe','Das, was der Computer auf den Bildschirm schreibt, damit du es lesen kannst.'),
  word('Text','Eine Zeichenfolge in Anführungszeichen, zum Beispiel "Willkommen".')
 ],{code:'System.out.println("Willkommen in der Pizzeria!");',
  output:'Willkommen in der Pizzeria!',
  tryIt:'Ändere den Text in deinen eigenen Begrüßungssatz. Was steht jetzt auf dem Bildschirm?',
  misconception:'Ohne Anführungszeichen denkt der Computer an einen Namen, den er kennt – und den gibt es vielleicht nicht. Text immer in "..." schreiben.',
  solution:'Zum Beispiel: System.out.println("Hallo, ich bin Mia!"); Es erscheint genau dieser Satz.'}),

 lesson('guest-input',[
  'Ein Gast ruft: „Ich möchte Salami!" Du willst das aufschreiben. Dazu brauchst du eine Eingabe – der Computer liest, was der Gast tippt.',
  'Mit `Scanner` holst du dir ein Werkzeug, das Tastatureingaben liest. `scan.next()` nimmt das nächste Wort. Du speicherst es unter dem Namen `wunsch` – wie ein Namensschild an einer Kiste.',
  'Danach kannst du den Wunsch weiterverwenden, zum Beispiel auf den Bildschirm schreiben. Der Computer merkt sich also, was der Gast gesagt hat.'
 ],[
  word('Eingabe','Das, was ein Mensch in das Programm hineintippt.'),
  word('Scanner','Ein Werkzeug in Java, das Eingaben von der Tastatur liest.')
 ],{code:'import java.util.Scanner;\nScanner scan = new Scanner(System.in);\nString wunsch = scan.next();\nSystem.out.println(wunsch);',
  output:'Salami (wenn der Gast Salami tippt)',
  tryIt:'Lass den Gast „Käse" tippen. Was speichert dein Programm jetzt?',
  misconception:'`scan.next()` liest nur ein Wort. Für einen ganzen Satz brauchst du `nextLine()` – das kommt später.',
  solution:'Der Name `wunsch` enthält jetzt „Käse". Die Ausgabe zeigt genau dieses Wort.'}),

 lesson('salami-and-cheese',[
  'Ein Gast will Salami und Käse. Das sind zwei Wünsche gleichzeitig. Beide müssen wahr sein, sonst backst du die falsche Pizza.',
  'In Java verbindest du zwei Bedingungen mit `&&`. Das liest sich wie „UND". Nur wenn links und rechts wahr sind, gehst du in den DANN-Zweig.',
  'WENN Salami da ist UND Käse da ist, DANN backen. SONST wartest du, bis die Zutaten da sind.'
 ],[
  word('&&','Das Zeichen für „und" in Java. Beide Bedingungen müssen wahr sein.'),
  word('Bedingung','Eine Frage mit der Antwort wahr oder falsch.')
 ],{code:'boolean salami = true;\nboolean kaese = true;\nif (salami && kaese) {\n    System.out.println("Pizza backen");\n}',
  output:'Pizza backen',
  tryIt:'Setze kaese auf false. Was passiert jetzt?',
  misconception:'`&&` ist nicht dasselbe wie `||`. Bei `||` reicht schon eine wahre Bedingung; bei `&&` brauchst du beide.',
  solution:'Bei kaese = false ist die ganze Bedingung falsch. Der DANN-Zweig wird übersprungen und es gibt keine Ausgabe.'}),

 lesson('forgot-else',[
  'Du sagst dem Computer nur, was er bei Regen tun soll. Es ist aber sonnig. Der Computer weiß nicht, was jetzt gilt – und der Gast steht nass da.',
  'Ein guter WENN-Satz braucht einen SONST-Satz. In Java ist das `else`. Damit gibt es für jede Situation einen Weg.',
  'WENN es regnet, DANN Schirm nehmen. SONST Sonnenbrille aufsetzen. Beide Fälle sind jetzt geregelt.'
 ],[
  word('else','Der SONST-Teil: Was passiert, wenn die Bedingung falsch ist?'),
  word('Zweig','Ein Weg, den das Programm nehmen kann.')
 ],{code:'boolean regnet = false;\nif (regnet) {\n    System.out.println("Schirm nehmen");\n} else {\n    System.out.println("Sonnenbrille");\n}',
  output:'Sonnenbrille',
  tryIt:'Setze regnet auf true. Welcher Satz erscheint jetzt?',
  misconception:'`else` gehört zum letzten `if` davor. Und es darf nur genau ein `else` zu einem `if` geben.',
  solution:'Bei true erscheint „Schirm nehmen". Der SONST-Zweig wird dann übersprungen.'}),

 lesson('for-each-ingredient',[
  'Vier Zutaten liegen auf dem Tisch. Du könntest viermal fast dasselbe schreiben. Oder du sagst einmal: „Mach das für jede Zutat."',
  'Genau das ist eine Schleife. In Java schreibst du `for (String zutat : zutaten)`. Lies es als: „Für jede Zutat in der Liste zutaten …"',
  'Der Name `zutat` wechselt bei jedem Durchlauf. Beim ersten Mal ist er „Salami", beim nächsten „Käse" – und dein Code bleibt trotzdem nur dreimal lang.'
 ],[
  word('Schleife','Ein Weg, Schritte mehrfach auszuführen, ohne sie mehrfach hinzuschreiben.'),
  word('Element','Ein einzelner Eintrag in einer Liste.')
 ],{code:'String[] zutaten = {"Salami", "Käse", "Pilze"};\nfor (String zutat : zutaten) {\n    System.out.println(zutat);\n}',
  output:'Salami\nKäse\nPilze',
  tryIt:'Füge „Tomate" zur Liste hinzu. Wie viele Zeilen gibt das Programm jetzt aus?',
  misconception:'Die Schleife läuft so oft, wie es Elemente gibt – nicht viermal, nur weil du vier Zutaten hingeschrieben hast. Neue Zutat = ein weiterer Durchlauf.',
  solution:'Vier Zeilen: Salami, Käse, Pilze und Tomate. Der Code selbst bleibt gleich.'}),

 lesson('count-along',[
  'Du willst wissen, wie viele Pizzen heute verkauft wurden. Bei jeder Bestellung sagst du: „Eine mehr."',
  'Im Computer geht das mit einem Zähler. Du legst ihn bei 0 an und schreibst bei jeder Pizza: `zaehler = zaehler + 1;` Das liest sich komisch, ist aber logisch: Nimm den alten Wert, addiere eins, speichere ihn wieder unter demselben Namen.',
  'WENN eine Pizza verkauft wird, DANN erhöhe den Zähler um eins. Nach drei Pizzen steht dort 3.'
 ],[
  word('Zähler','Eine Zahl, die bei jedem Ereignis um eins weitergeht.'),
  word('Inkrement','Das Erhöhen einer Zahl um genau eins.')
 ],{code:'int zaehler = 0;\nzaehler = zaehler + 1;\nzaehler = zaehler + 1;\nSystem.out.println(zaehler);',
  output:'2',
  tryIt:'Füge eine dritte Zeile `zaehler = zaehler + 1;` ein. Was steht jetzt auf dem Bildschirm?',
  misconception:'`zaehler = zaehler + 1` ist keine Mathematikstunde mit unbekanntem x. Rechts steht der alte Wert, links wird der neue gespeichert.',
  solution:'Es steht 3. Der Zähler war 2, dann kam eins dazu.'}),

 lesson('ingredient-list',[
  'Die Zutaten liegen in einer Liste: Salami, Käse, Pilze. Du willst die zweite Zutat wissen. Dafür fragst du nach einer Position.',
  'Diese Position heißt Index. In Java beginnt sie bei 0 – nicht bei 1. `get(0)` ist Salami, `get(1)` ist Käse, `get(2)` sind Pilze.',
  'WENN du eine Zutat brauchst, DANN frage mit `get(Position)` danach. Das ist wie ein Regal mit Nummern an den Fächern.'
 ],[
  word('Index','Die Nummer einer Position in einer Liste. Sie beginnt bei 0.'),
  word('Liste','Eine Sammlung mit fester Reihenfolge.')
 ],{code:'var zutaten = List.of("Salami", "Käse", "Pilze");\nSystem.out.println(zutaten.get(1));',
  output:'Käse',
  tryIt:'Ändere die 1 in eine 2. Welche Zutat erscheint jetzt?',
  misconception:'Viele denken, get(2) sei das zweite Element. Es ist das dritte, weil bei 0 gezählt wird.',
  solution:'Bei get(2) erscheinen „Pilze". Die Position 2 ist das dritte Fach im Regal.'}),

 lesson('ingredient-card',[
  'Salami hat einen Namen, ein Gewicht und einen Preis. Drei einzelne Variablen wären unübersichtlich. Du schreibst alles auf eine Karte.',
  'In Java kannst du dafür ein `record` benutzen. Du sagst nur, welche Felder die Karte hat – Java macht den Rest: Konstruktor, lesbare Ausgabe und Vergleich.',
  'WENN mehrere Werte zusammengehören, DANN bündele sie auf einer Karte. Dein Code wird kürzer und du findest die Zutat schneller wieder.'
 ],[
  word('Record','Eine kurze Datenkarte mit festen Feldern in Java.'),
  word('Feld','Ein benannter Platz auf der Karte, zum Beispiel das Gewicht.')
 ],{code:'record Zutat(String name, int gramm) {}\nZutat salami = new Zutat("Salami", 30);\nSystem.out.println(salami);',
  output:'Zutat[name=Salami, gramm=30]',
  tryIt:'Erzeuge eine zweite Karte für Käse mit 40 Gramm. Wie sieht die Ausgabe aus?',
  misconception:'Ein Record ist keine Zauberei: Du musst trotzdem angeben, welche Felder er hat. Java schreibt nur die lästigen Teile für dich.',
  solution:'Zutat[name=Käse, gramm=40]. Die Karte zeigt beide Felder.'}),

 lesson('same-dough',[
  'Dein Teig besteht immer aus denselben vier Zahlen: Mehl, Wasser, Salz, Hefe. Du willst nicht, dass jemand heimlich das Wasser ändert.',
  'Ein `record` speichert diese Werte fest. Es gibt keine Methode, um ein Feld später zu verändern. Der Teig bleibt das, was du beim Erzeugen hingeschrieben hast.',
  'WENN etwas immer gleich bleiben soll, DANN nimm ein Record. Das ist wie ein ausgedrucktes Rezept statt einer löschbaren Notiz.'
 ],[
  word('Unveränderlich','Ein Wert, der nach dem Erzeugen nicht mehr geändert werden kann.'),
  word('Rezept','Hier: die feste Liste der Zutaten und Mengen für den Teig.')
 ],{code:'record Teig(int mehl, int wasser, int salz, int hefe) {}\nTeig standard = new Teig(500, 350, 10, 5);\nSystem.out.println(standard.wasser());',
  output:'350',
  tryIt:'Frage das Salz ab statt das Wasser. Welche Zahl erscheint?',
  misconception:'`standard.wasser()` liest den Wert – er ändert ihn nicht. Es gibt keine Methode `setWasser` bei einem Record.',
  solution:'Es erscheint 10. Mit `salz()` liest du ein anderes Feld derselben Karte.'}),

 lesson('two-equal-doughs',[
  'Zwei Teigkarten haben dieselben Zahlen. Es sind zwei Zettel – aber der Teig ist gleich. Willst du das prüfen, fragst du nach dem Inhalt.',
  'Records vergleichen automatisch alle Felder. `a.equals(b)` ist wahr, wenn alle vier Zahlen übereinstimmen. Zwei neue Zettel mit gleichen Zahlen sind also inhaltlich gleich.',
  'WENN alle Felder übereinstimmen, DANN sind die Teige gleich. Das unterscheidet Inhalt von Identität – wie zwei Zettel mit demselben Rezept.'
 ],[
  word('Wertgleichheit','Zwei Dinge sind gleich, weil ihr Inhalt übereinstimmt.'),
  word('Identität','Zwei Dinge sind dasselbe Objekt – auch wenn der Inhalt anders ist.')
 ],{code:'record Teig(int mehl, int wasser) {}\nTeig a = new Teig(500, 350);\nTeig b = new Teig(500, 350);\nSystem.out.println(a.equals(b));',
  output:'true',
  tryIt:'Ändere bei b die 350 in 400. Was gibt das Programm jetzt aus?',
  misconception:'`==` prüft bei Objekten nur, ob es derselbe Zettel ist. Für den Inhalt benutzt du `equals`.',
  solution:'Bei 400 ist ein Feld anders, also erscheint false. Die Teige sind nicht mehr gleich.'}),

 lesson('ingredient-box',[
  'Du baust eine Box, in die eine Zutat hineinkommt. Mal ist es Salami, mal Käse. Du schreibst die Box nur einmal – mit einem Platzhalter `T`.',
  'Dieser Platzhalter heißt Typparameter. Beim Benutzen sagst du, was `T` diesmal ist: `Box<String>` für Text, `Box<Integer>` für eine Zahl.',
  'WENN eine Box für verschiedene Inhalte gedacht ist, DANN gib ihr einen Typplatzhalter. So brauchst du keine zweite Box für jeden Belag.'
 ],[
  word('Generics','Eine Box mit Typplatzhalter, die für verschiedene Inhalte benutzt werden kann.'),
  word('Typparameter','Der Platzhalter T, der später durch einen echten Typ ersetzt wird.')
 ],{code:'class Box<T> {\n    T inhalt;\n    Box(T inhalt) { this.inhalt = inhalt; }\n}\nBox<String> salami = new Box<>("Salami");',
  output:'(keine Ausgabe – die Box ist gefüllt)',
  tryIt:'Baue eine zweite Box für den Text "Käse". Wie heißt der Typ?',
  misconception:'`T` ist kein geheimer Wert. Es ist nur ein Platzhalter für einen Typ – wie ein leeres Etikett an der Box.',
  solution:'Auch sie ist eine Box<String>. Der Inhalt ist anders, der Typ bleibt Text.'}),

 lesson('salami-not-cheese',[
  'Eine Salami-Box und eine Käse-Box sehen gleich aus. Du darfst sie aber nicht verwechseln – sonst liegt plötzlich Käse im Salami-Fach.',
  'Java prüft das streng: `Box<Salami>` und `Box<Kaese>` sind zwei verschiedene Typen. Man sagt: Generics sind invariant. Das klingt schwer, bedeutet aber nur „Sie bleiben getrennt".',
  'WENN der Inhalt unterschiedlich ist, DANN sind es verschiedene Boxen. Der Compiler hilft dir, die Fächer sortiert zu halten.'
 ],[
  word('Invarianz','Generics werden nicht automatisch ineinander umgewandelt. Die Sorten bleiben getrennt.'),
  word('Compiler','Das Werkzeug, das deinen Java-Code prüft, bevor er läuft.')
 ],{code:'record Salami(String name) {}\nrecord Kaese(String name) {}\nBox<Salami> fach1 = new Box<>(new Salami("Salami"));\nBox<Kaese> fach2 = new Box<>(new Kaese("Käse"));',
  output:'(zwei getrennte Fächer)',
  tryIt:'Versuche, fach1 eine Kaese hineinzugeben. Was sagt der Compiler?',
  misconception:'Weil beide Karten Felder haben, heißt das nicht, dass sie gleich sind. Der Typ in der Box bleibt entscheidend.',
  solution:'Der Compiler meldet einen Fehler: In eine Box<Salami> passt kein Kaese. Genau das wolltest du.'}),

 lesson('many-kinds',[
  'Jetzt willst du eine Box, die alle Beläge aufnimmt – Salami, Käse und Pilze. Aber keine Nudeln, bitte.',
  'Dafür benennst du eine gemeinsame Grenze: `interface Belag`. Dann schreibst du `Box<T extends Belag>`. Das heißt: T darf jeder Typ sein, der Belag ist.',
  'WENN mehrere Sorten erlaubt sind, DANN benenne die gemeinsame Regel. SONST darf alles hinein – auch Nudeln.'
 ],[
  word('Bound','Eine Grenze für einen Typplatzhalter, zum Beispiel "muss Belag sein".'),
  word('Interface','Ein Vertrag, den eine Klasse erfüllen kann.')
 ],{code:'interface Belag {}\nrecord Salami() implements Belag {}\nclass Box<T extends Belag> {}\nBox<Salami> fach = new Box<>();',
  output:'(Salami passt, Nudeln nicht)',
  tryIt:'Erfinde eine Klasse Nudel ohne implements Belag. Darf sie in die Box?',
  misconception:'`extends` heißt hier nicht Vererbung einer Klasse, sondern „muss zu dieser Grenze passen". Das ist bei Generics ein häufiger Stolperstein.',
  solution:'Nein. Nudel erfüllt den Vertrag Belag nicht, also weist der Compiler sie ab.'}),

 lesson('recipe-card',[
  'Du machst jeden Tag denselben Teig. Statt die Schritte immer wieder neu zu schreiben, gibst du dem Rezept einen Namen.',
  'Eine Funktion ist genau so ein benanntes Rezept. Du schreibst sie einmal und rufst sie bei Bedarf auf. Der Computer führt dann alle Schritte aus.',
  'WENN du dieselbe Arbeit oft brauchst, DANN schreibe eine Funktion. Das spart Tipparbeit und verhindert, dass du beim zweiten Mal etwas vergisst.'
 ],[
  word('Funktion','Ein benanntes Rezept mit Schritten, das du mehrfach aufrufen kannst.'),
  word('Aufruf','Der Moment, in dem du das Rezept benutzt.')
 ],{code:'static void teigMachen() {\n    System.out.println("Mehl, Wasser, Salz, Hefe");\n}\nteigMachen();',
  output:'Mehl, Wasser, Salz, Hefe',
  tryIt:'Rufe teigMachen() zweimal auf. Was siehst du auf dem Bildschirm?',
  misconception:'Das Rezept wird erst beim Aufruf ausgeführt. Nur hinschreiben reicht nicht – du musst den Namen auch aufrufen.',
  solution:'Die Zutatenzeile erscheint zweimal. Jeder Aufruf führt das Rezept erneut aus.'}),

 lesson('pass-ingredients',[
  'Dein Teigrezept braucht Mehl und Wasser. Diese Werte gibst du beim Aufruf mit – wie Zutaten, die du dem Koch reichst.',
  'Diese übergebenen Werte heißen Parameter. Das Rezept benutzt sie im Inneren. Am Ende gibt es mit `return` ein Ergebnis zurück: den fertigen Teig.',
  'WENN ein Rezept Zutaten braucht, DANN übergib sie beim Aufruf. SONST müsste das Rezept immer dieselbe Menge backen.'
 ],[
  word('Parameter','Ein Wert, den du einer Funktion beim Aufruf mitgibst.'),
  word('Rückgabewert','Das Ergebnis, das die Funktion zurückgibt.')
 ],{code:'static int preis(int anzahl) {\n    return anzahl * 8;\n}\nSystem.out.println(preis(2));',
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
 ],{code:'class Kueche {\n    void backen() {\n        System.out.println("Pizza ist fertig");\n    }\n}\nnew Kueche().backen();',
  output:'Pizza ist fertig',
  tryIt:'Gib der Küche eine zweite Aufgabe namens aufraeumen(). Wie sieht die Klasse jetzt aus?',
  misconception:'Eine Klasse ist kein Objekt. Sie ist die Bauanleitung; mit new Kueche() erzeugst du eine konkrete Küche.',
  solution:'Du ergänzt eine zweite Methode void aufraeumen() mit einer eigenen Ausgabe. Beide Methoden stehen in derselben Klasse.'}),

 lesson('chef-and-apprentice',[
  'Der Azubi soll alles können, was der Chef kann – und zusätzlich den Boden putzen. Du schreibst die Koch-Aufgaben nicht zweimal.',
  'Mit `extends` übernimmt eine Klasse die Aufgaben einer anderen. Der Azubi „erbt" backen() und fügt putzen() hinzu.',
  'WENN eine Rolle die Aufgaben einer anderen braucht, DANN darf sie sie übernehmen. SONST schreibst du dieselben Methoden zweimal.'
 ],[
  word('Vererbung','Eine Klasse übernimmt Aufgaben und Daten einer anderen Klasse.'),
  word('extends','Das Java-Wort für „erbt von".')
 ],{code:'class Chef {\n    void backen() { System.out.println("Backen"); }\n}\nclass Azubi extends Chef {\n    void putzen() { System.out.println("Putzen"); }\n}\nnew Azubi().backen();',
  output:'Backen',
  tryIt:'Rufe putzen() auf dem Azubi auf. Was erscheint?',
  misconception:'Der Chef kann nicht automatisch putzen – nur der Azubi. Vererbung geht von oben nach unten, nicht umgekehrt.',
  solution:'Es erscheint „Putzen". Der Azubi hat beide Aufgaben.'}),

 lesson('label-shelf',[
  'Dein Regal hat viele Fächer. Du willst die Salami über ihren Namen finden, nicht über eine Nummer. Dafür klebst du Etiketten.',
  'In Java heißt so ein Etikett Schlüssel. Die Map verbindet Schlüssel und Wert: `"Salami"` zeigt auf die Zahl 3.',
  'WENN du etwas über einen Namen finden willst, DANN nimm eine Map. SONST musst du alle Fächer einzeln durchsuchen.'
 ],[
  word('Map','Eine Sammlung, in der ein Schlüssel zu einem Wert führt.'),
  word('Schlüssel','Der Name, über den du etwas in der Map wiederfindest.')
 ],{code:'var regal = new java.util.HashMap<String, Integer>();\nregal.put("Salami", 3);\nSystem.out.println(regal.get("Salami"));',
  output:'3',
  tryIt:'Lege einen zweiten Schlüssel "Käse" mit 5 an. Was gibt regal.get("Käse") aus?',
  misconception:'Die Map hat keine Reihenfolge, die du dir merken kannst. Du fragst immer über den Schlüssel, nicht über Position 1 oder 2.',
  solution:'Es erscheint 5. Der Schlüssel "Käse" führt direkt zu diesem Wert.'}),

 lesson('no-duplicates',[
  'Zwei Mitarbeiter schreiben „Salami" ins Zutatenbuch. Du willst sie nur einmal zählen.',
  'Eine Set ist eine Sammlung, die Doppelte automatisch weg lässt. `add("Salami")` zum zweiten Mal verändert nichts – die Größe bleibt gleich.',
  'WENN etwas nur einmal vorkommen darf, DANN nimm eine Set. Das ist wie eine Gästeliste: Dieselbe Person steht nicht zweimal drauf.'
 ],[
  word('Set','Eine Sammlung ohne doppelte Einträge.'),
  word('Duplikat','Ein zweiter Eintrag mit demselben Wert.')
 ],{code:'var zutaten = new java.util.HashSet<String>();\nzutaten.add("Salami");\nzutaten.add("Salami");\nSystem.out.println(zutaten.size());',
  output:'1',
  tryIt:'Füge "Käse" hinzu. Wie groß ist die Set jetzt?',
  misconception:'Bei einer Liste wären jetzt zwei Salami-Einträge. Bei einer Set bleibt es bei einem – deshalb ist die Ausgabe 1.',
  solution:'Die Set hat dann zwei Einträge: Salami und Käse. Die Ausgabe ist 2.'}),

 lesson('sum-prices',[
  'Am Ende des Tages willst du wissen, wie viel Geld du eingenommen hast. Du hast eine Liste mit Preisen.',
  'Statt eine Schleife zu schreiben, kannst du eine Kette benutzen: `stream()` startet, `mapToInt` macht Zahlen daraus, `sum()` addiert alles.',
  'WENN du viele Zahlen zu einer Summe machen willst, DANN benutze eine Verarbeitungskette. Jeder Schritt hat eine klare Aufgabe.'
 ],[
  word('Stream','Eine Kette von Schritten, die Daten nacheinander verarbeitet.'),
  word('Summe','Das Ergebnis des Addierens.')
 ],{code:'var preise = java.util.List.of(8, 8, 12);\nint summe = preise.stream().mapToInt(Integer::intValue).sum();\nSystem.out.println(summe);',
  output:'28',
  tryIt:'Füge eine 5 zur Liste hinzu. Was ist die neue Summe?',
  misconception:'Die Kette verändert die Liste nicht. Sie liest nur die Werte und erzeugt ein neues Ergebnis.',
  solution:'Die neue Summe ist 33. Die Liste selbst bleibt unverändert.'}),

 lesson('rule-lambda',[
  'Deine Rabattregel ist ein kleiner Satz: „Vom Preis geht ein Zehntel ab." Du willst sie wie einen Zettel weitergeben.',
  'Ein Lambda ist genau so ein Zettel: `(preis) -> preis / 10`. Du schreibst keine Klasse, sondern nur die Regel selbst.',
  'WENN du eine Regel weitergeben willst, DANN schreibe sie als Lambda. Das ist kürzer als eine ganze Klasse.'
 ],[
  word('Lambda','Eine kleine Funktion ohne Namen, die du übergeben kannst.'),
  word('Rabatt','Ein Betrag, der vom Preis abgezogen wird.')
 ],{code:'var rabatt = (java.util.function.Function<Integer,Integer>) (p -> p / 10);\nSystem.out.println(rabatt.apply(50));',
  output:'5',
  tryIt:'Was gibt rabatt.apply(100) aus?',
  misconception:'Das Lambda wird nicht sofort ausgeführt. Erst mit apply(...) benutzt du die Regel.',
  solution:'Bei 100 ist ein Zehntel 10. Die Regel wurde mit dem neuen Wert angewendet.'}),

 lesson('salami-gone',[
  'Ein Gast will Salami. Im Regal ist nichts mehr. Du willst nicht einfach 0 schreiben – du willst sagen: „Features fehlt."',
  '`Optional` ist eine Box, die entweder einen Wert enthält oder leer ist. `orElse("Käse")` liefert den Ersatz, falls nichts drin ist.',
  'WENN etwas fehlen kann, DANN zeige das ausdrücklich an. Der Gast weiß dann, was los ist – statt eine falsche Zahl zu sehen.'
 ],[
  word('Optional','Eine Box, die einen Wert enthalten kann – oder auch leer sein.'),
  word('Ersatzwert','Ein Wert, der benutzt wird, wenn nichts gefunden wurde.')
 ],{code:'var salami = java.util.Optional.<String>empty();\nSystem.out.println(salami.orElse("Käse"));',
  output:'Käse',
  tryIt:'Setze stattdessen Optional.of("Salami"). Was erscheint jetzt?',
  misconception:'Optional ist nicht dasselbe wie null. Du musst den leeren Fall aktiv behandeln – genau das macht orElse für dich.',
  solution:'Es erscheint „Salami". Die Box ist gefüllt, darum wird der Ersatz nicht gebraucht.'}),

 lesson('polite-error',[
  'Die Salami fehlt. Du könntest das Programm einfach abstürzen lassen. Besser ist eine klare Meldung: „Salami fehlt im Regal."',
  'In Java wirfst du dafür eine Exception. Das ist wie ein Zettel mit einer Fehlermeldung, den du weitergibst. Jemand anderes kann ihn lesen und höflich antworten.',
  'WENN etwas schiefgeht, DANN gib eine verständliche Meldung zurück. SONST rät der Gast, was passiert ist.'
 ],[
  word('Exception','Eine Meldung, die sagt: Hier ist etwas schiefgelaufen.'),
  word('Validierung','Das Prüfen, ob ein Wert erlaubt ist.')
 ],{code:'int bestand = 0;\nif (bestand < 1) {\n    throw new IllegalArgumentException("Salami fehlt im Regal");\n}',
  output:'Fehler: Salami fehlt im Regal',
  tryIt:'Setze bestand auf 2. Was passiert jetzt?',
  misconception:'Eine Exception ist kein normales Ergebnis wie 0. Sie unterbricht den Ablauf, bis jemand sie behandelt.',
  solution:'Bei 2 ist die Bedingung falsch. Es wird keine Exception geworfen und das Programm läuft normal weiter.'}),

 lesson('first-junit',[
  'Du willst morgens schnell wissen, ob deine Rabattregel noch stimmt. Ein Test prüft das automatisch – schneller als jedes Mal neu nachzurechnen.',
  'In JUnit schreibst du eine Erwartung und ein Ergebnis: `assertEquals(5, rabatt(50))`. Wenn beides übereinstimmt, ist der Test grün.',
  'WENN du eine Regel änderst, DANN prüfe sie mit einem Test. Besonders Grenzfälle wie 0 oder 1 sind wichtig.'
 ],[
  word('Test','Eine automatische Prüfung, ob etwas das richtige Ergebnis liefert.'),
  word('Grenzfall','Ein besonderer Wert ganz am Rand, zum Beispiel 0.')
 ],{code:'import static org.junit.jupiter.api.Assertions.assertEquals;\nassertEquals(5, rabatt(50));',
  output:'Test bestanden',
  tryIt:'Schreibe einen zweiten Test für rabatt(0). Was erwartest du?',
  misconception:'Ein Test prüft nur das, was du hinschreibst. Wenn du den Grenzfall vergisst, findet der Test ihn auch nicht.',
  solution:'Bei 0 ist ein Zehntel 0. Der Test assertEquals(0, rabatt(0)) sollte bestehen.'}),

 lesson('one-file-not-enough',[
  'Deine Pizzeria steht in einer Datei mit 1.000 Zeilen. Du suchst die Preisregel und findest sie erst nach fünf Minuten.',
  'Du teilt den Laden in Rollen auf: Die Kassiererin nimmt Bestellungen an, der Küchenchef entscheidet, das Regal liefert Zutaten. Jede Rolle bekommt eine eigene Klasse.',
  'WENN eine Datei zu groß wird, DANN teile sie in Schichten. Das ist wie ein Laden mit getrennten Arbeitsplätzen statt einem überfüllten Raum.'
 ],[
  word('Schicht','Eine Gruppe von Klassen mit derselben Aufgabe, zum Beispiel Eingabe oder Daten.'),
  word('Struktur','Die Ordnung, in der du deinen Code aufteilst.')
 ],{code:'class BestellungController {}\nclass KuechenService {}\nclass ZutatenRegal {}',
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
 ],{code:'class Regal {\n    int bestand(String zutat) { return 3; }\n}\nclass Kueche {\n    void backen() { System.out.println("Fertig"); }\n}',
  output:'(Regal speichert, Küche backt)',
  tryIt:'Finde eine dritte Aufgabe und gib ihr eine eigene Klasse.',
  misconception:'Eine Klasse darf ruhig mehrere kleine Methoden haben – aber sie sollten alle zu derselben Aufgabe gehören.',
  solution:'Zum Beispiel eine Kasse, die den Preis berechnet. Sie gehört nicht in die Küche.'}),

 lesson('project-order',[
  'Du baust deinen Laden jeden Tag neu. Du willst einen Knopf, der alles erledigt: Code prüfen, starten und Fehler anzeigen.',
  'Maven ist so ein Baumeister. Mit `mvn spring-boot:run` startest du die Anwendung. In einer Datei namens `application.properties` stehen Einstellungen.',
  'WENN du ein Projekt öfter baust, DANN brauchst du Werkzeuge und Einstellungen. SONST machst du alles von Hand.'
 ],[
  word('Maven','Ein Werkzeug, das ein Java-Projekt baut und startet.'),
  word('Konfiguration','Einstellungen, die du außerhalb des Codes änderst.')
 ],{code:'server.port=8080\nlogging.level.root=INFO',
  output:'Die App läuft auf Port 8080 und protokolliert Meldungen.',
  tryIt:'Ändere den Port auf 8081. Wo erreichst du jetzt deine Pizzeria?',
  misconception:'Konfiguration ist kein Code. Du änderst sie in einer eigenen Datei, ohne das Programm umzuschreiben.',
  solution:'Unter http://localhost:8081. Die Anwendung startet mit den neuen Einstellungen.'}),

 lesson('first-http',[
  'Ein Gast soll deine Pizzeria vom Handy ansehen können. Dazu braucht er eine Adresse, die er im Browser eintippt.',
  'Eine solche Adresse heißt URL. Dein Programm wartet dort auf Anfragen und antwortet mit Daten – meist als JSON, einem einfachen Textformat.',
  'WENN jemand die Adresse aufruft, DANN antworte mit einer Liste. Das ist der erste Schritt vom Programm zur Web-Anwendung.'
 ],[
  word('URL','Die Adresse, unter der eine Anwendung im Browser erreichbar ist.'),
  word('JSON','Ein Textformat, mit dem Programme Daten austauschen.')
 ],{code:'@GetMapping("/pizzen")\nList<String> pizzen() {\n    return List.of("Salami", "Käse");\n}',
  output:'["Salami", "Käse"]',
  tryIt:'Füge „Pilze" zur Liste hinzu. Was sieht der Gast jetzt?',
  misconception:'`GET` bedeutet nur „zeig mir Daten". Um etwas zu bestellen, brauchst du später `POST`.',
  solution:'Die Antwort enthält dann drei Pizzen: Salami, Käse und Pilze.'}),

 lesson('restaurant-leader',[
  'Küche, Regal und Kasse müssen zusammenarbeiten. Jemand muss sie miteinander bekannt machen. In deinem Laden übernimmt das der Restaurantleiter.',
  'Bei Spring Boot übernimmt das der Container. Du sagst nur: „Dieser Service braucht das Regal." Spring reicht es dir automatisch. Das nennt man Dependency Injection.',
  'WENN Rollen zusammenarbeiten, DANN lass ein Werkzeug sie verbinden. Du baust die Küche nicht mehr selbst – du bekommst sie gereicht.'
 ],[
  word('Dependency Injection','Ein Werkzeug gibt einer Klasse das, was sie braucht.'),
  word('Container','Der „Restaurantleiter", der Rollen erzeugt und verbindet.')
 ],{code:'@SpringBootApplication\nclass PizzeriaApp {\n    public static void main(String[] args) {\n        SpringApplication.run(PizzeriaApp.class, args);\n    }\n}',
  output:'Die Pizzeria-App startet.',
  tryIt:'Starte die App und öffne die Adresse, die in der Konsole steht.',
  misconception:'Spring macht keine Magie. Es macht nur das, was du vorher von Hand mit new gemacht hast – automatisch und an einer zentralen Stelle.',
  solution:'Du siehst in der Konsole eine Adresse wie http://localhost:8080. Dort ist dein Laden erreichbar.'}),

 lesson('cashier',[
  'Die Kassiererin sitzt am Eingang. Sie nimmt die Bestellung entgegen und gibt eine Antwort zurück. Im Code heißt sie Controller.',
  'Mit `@RestController` sagst du Spring: „Das ist unser Eingang." Mit `@PostMapping` sagst du: „Hier kommen Bestellungen an."',
  'WENN ein Gast eine Bestellung schickt, DANN nimmt der Controller sie an. Er kocht nicht selbst – er gibt die Arbeit weiter.'
 ],[
  word('Controller','Der Eingang der Anwendung: Er nimmt Anfragen an.'),
  word('POST','Eine Anfrage, die neue Daten schickt – hier eine Bestellung.')
 ],{code:'@RestController\nclass BestellungController {\n    @PostMapping("/bestellung")\n    String bestellen() { return "Bestellung angekommen"; }\n}',
  output:'Bestellung angekommen',
  tryIt:'Ändere den Text der Antwort in deinen eigenen Satz.',
  misconception:'Der Controller soll keine Preise berechnen. Er nimmt nur an und antwortet – die Regeln kommen später in den Service.',
  solution:'Die Antwort zeigt jetzt deinen neuen Text. Die Adresse /bestellung bleibt gleich.'}),

 lesson('kitchen',[
  'Der Küchenchef entscheidet, was mit der Bestellung passiert. Er weiß nichts vom Bildschirm oder vom Handy – er bekommt nur die Bestellung.',
  'In Spring ist das der Service. Er trägt die fachlichen Regeln: genug Zutaten? Welcher Preis? Darum gehört er in eine eigene Klasse.',
  'WENN die Bestellung angekommen ist, DANN arbeite sie im Service weiter. Eingabe und Verarbeitung bleiben getrennt.'
 ],[
  word('Service','Der Ort, an dem die fachlichen Regeln stehen.'),
  word('Trennung','Eingabe und Verarbeitung liegen in verschiedenen Klassen.')
 ],{code:'@Service\nclass KuechenService {\n    String backen(String pizza) {\n        return pizza + " ist fertig";\n    }\n}',
  output:'Salami ist fertig',
  tryIt:'Rufe backen("Käse") auf. Was kommt zurück?',
  misconception:'Ein Service ist keine Website. Er ist nur eine Klasse mit Regeln – der Controller ruft ihn auf.',
  solution:'Es kommt „Käse ist fertig" zurück. Die Regel wurde mit einem anderen Namen angewendet.'}),

 lesson('shelf',[
  'Das Regal merkt sich, wie viele Zutaten da sind. Es kümmert sich nicht um Gäste oder Preise. Es kennt nur Fächer und Bestände.',
  'In Spring ist das ein Repository. Vorerst speichern wir die Werte im Speicher; später könnte daraus eine Datenbank werden – der Rest der App merkt kaum etwas.',
  'WENN Daten nachgeschlagen werden, DANN frag das Regal. SONST wühlt die Küche selbst im Bestand.'
 ],[
  word('Repository','Eine Klasse, die den Zugriff auf Daten übernimmt.'),
  word('Bestand','Die Menge, die von einer Zutat vorhanden ist.')
 ],{code:'@Repository\nclass ZutatenRegal {\n    java.util.Map<String,Integer> faecher = new java.util.HashMap<>();\n    int bestand(String zutat) { return faecher.getOrDefault(zutat, 0); }\n}',
  output:'Fehlende Zutat → 0',
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
 ],{code:'@RestController\nclass PizzeriaApi {\n    @PostMapping("/bestellen")\n    String bestellen(@RequestBody String pizza) {\n        return pizza + ": Bestellung angenommen";\n    }\n}',
  output:'Salami: Bestellung angenommen',
  tryIt:'Erkläre einem Freund, was Controller, Service und Regal machen – ganz ohne Fachbegriffe.',
  misconception:'Ein Projekt ist fertig, wenn es läuft – aber nicht, wenn du es nicht mehr erklären kannst. Verständlichkeit gehört zum Ergebnis.',
  solution:'Der Controller nimmt an, der Service entscheidet, das Regal liefert Zutaten. Genau die Rollenteilung aus Stufe 8 und 9.'})
];
