import type {BeginnerChapter,BeginnerWord} from './pizzeria-book.ts';

/**
 * Ausformulierte Go-Lektionen für Kapitel 5–37 des Pizzeria-Bands.
 * Jede Lektion bleibt bewusst kurz: eine Idee, höchstens acht Codezeilen,
 * eine Aufgabe und ein typischer Fehler. Die Java-Lektionen bleiben unberührt.
 */
type Lesson=Pick<BeginnerChapter,'id'|'explain'|'wordbank'|'code'|'output'|'tryIt'|'misconception'|'solution'>;
const lesson=(id:string,explain:readonly string[],wordbank:readonly BeginnerWord[],
 options:{code?:string;output?:string;tryIt:string;misconception:string;solution:string}):Lesson=>
 ({id,explain,wordbank,...options});
const word=(term:string,definition:string):BeginnerWord=>({term,definition});

export const GO_LESSONS:readonly Lesson[]=[
 lesson('greeting',[
  'Dein Laden hat einen Bildschirm an der Tür. Als Erstes soll dort stehen: „Willkommen in der Pizzeria!" Go kann Text ausgeben – das heißt: es schreibt ihn auf den Bildschirm.',
  'In Go benutzen wir dafür `fmt.Println`. Das `fmt` gehört zur Standardbibliothek und ist zuständig für Ein- und Ausgabe. Wichtig sind die Anführungszeichen: Alles darin ist Text und wird genau so angezeigt.',
  'In einer echten Datei stehen darüber `package main` und `import "fmt"`. Wir lassen das hier weg, damit du nur den Austausch mit dem Gast siehst.'
 ],[
  word('Ausgabe','Das, was das Programm auf den Bildschirm schreibt, damit du es lesen kannst.'),
  word('Text','Eine Zeichenfolge in Anführungszeichen, zum Beispiel "Willkommen".')
 ],{code:'fmt.Println("Willkommen in der Pizzeria!")',
  output:'Willkommen in der Pizzeria!',
  tryIt:'Ändere den Text in deinen eigenen Begrüßungssatz. Was steht jetzt auf dem Bildschirm?',
  misconception:'Ohne Anführungszeichen sucht Go nach einem Namen, den es kennt – und den gibt es vielleicht nicht. Text immer in "..." schreiben.',
  solution:'Zum Beispiel: fmt.Println("Hallo, ich bin Mia!"). Es erscheint genau dieser Satz.'}),

 lesson('guest-input',[
  'Ein Gast ruft: „Ich möchte Salami!" Du willst das aufschreiben. Dazu brauchst du eine Eingabe – Go liest, was der Gast tippt.',
  'Mit `fmt.Scan` holst du dir ein Werkzeug, das Tastatureingaben liest. Das `&` vor `wunsch` ist wichtig: Du gibst Go die Adresse des Zettels, damit es ihn füllen kann.',
  'Danach kannst du den Wunsch weiterverwenden, zum Beispiel auf den Bildschirm schreiben. Das Programm merkt sich also, was der Gast gesagt hat.'
 ],[
  word('Eingabe','Das, was ein Mensch in das Programm hineintippt.'),
  word('Adresse','Mit & zeigst du Go, wo die Variable liegt, damit sie gefüllt werden kann.')
 ],{code:'var wunsch string\nfmt.Print("Was möchtest du? ")\nfmt.Scan(&wunsch)\nfmt.Println(wunsch)',
  output:'Salami (wenn der Gast Salami tippt)',
  tryIt:'Lass den Gast „Käse" tippen. Was speichert dein Programm jetzt?',
  misconception:'Das & ist kein Druckfehler. Ohne die Adresse kann fmt.Scan deine Variable nicht füllen; Go würde eine andere Eingabe erwarten.',
  solution:'Der Name `wunsch` enthält jetzt „Käse". Die Ausgabe zeigt genau dieses Wort.'}),

 lesson('salami-and-cheese',[
  'Ein Gast will Salami und Käse. Das sind zwei Wünsche gleichzeitig. Beide müssen wahr sein, sonst backst du die falsche Pizza.',
  'In Go verbindest du zwei Bedingungen mit `&&`. Das liest sich wie „UND". Nur wenn links und rechts wahr sind, gehst du in den DANN-Zweig.',
  'WENN Salami da ist UND Käse da ist, DANN backen. SONST wartest du, bis die Zutaten da sind.'
 ],[
  word('&&','Das Zeichen für „und" in Go. Beide Bedingungen müssen wahr sein.'),
  word('Bedingung','Eine Frage mit der Antwort wahr oder falsch.')
 ],{code:'salami := true\nkaese := true\nif salami && kaese {\n    fmt.Println("Pizza backen")\n}',
  output:'Pizza backen',
  tryIt:'Setze kaese auf false. Was passiert jetzt?',
  misconception:'`&&` ist nicht dasselbe wie `||`. Bei `||` reicht schon eine wahre Bedingung; bei `&&` brauchst du beide.',
  solution:'Bei kaese = false ist die ganze Bedingung falsch. Der DANN-Zweig wird übersprungen und es gibt keine Ausgabe.'}),

 lesson('forgot-else',[
  'Du sagst dem Computer nur, was er bei Regen tun soll. Es ist aber sonnig. Der Computer weiß nicht, was jetzt gilt – und der Gast steht nass da.',
  'Ein guter WENN-Satz braucht einen SONST-Satz. In Go ist das `else`. Damit gibt es für jede Situation einen Weg.',
  'WENN es regnet, DANN Schirm nehmen. SONST Sonnenbrille aufsetzen. Beide Fälle sind jetzt geregelt.'
 ],[
  word('else','Der SONST-Teil: Was passiert, wenn die Bedingung falsch ist?'),
  word('Zweig','Ein Weg, den das Programm nehmen kann.')
 ],{code:'regnet := false\nif regnet {\n    fmt.Println("Schirm nehmen")\n} else {\n    fmt.Println("Sonnenbrille")\n}',
  output:'Sonnenbrille',
  tryIt:'Setze regnet auf true. Welcher Satz erscheint jetzt?',
  misconception:'In Go muss `else` direkt hinter der schließenden Klammer des `if` stehen. Sonst findet Go die Zusammengehörigkeit nicht.',
  solution:'Bei true erscheint „Schirm nehmen". Der SONST-Zweig wird dann übersprungen.'}),

 lesson('for-each-ingredient',[
  'Vier Zutaten liegen auf dem Tisch. Du könntest viermal fast dasselbe schreiben. Oder du sagst einmal: „Mach das für jede Zutat."',
  'Genau das ist eine Schleife. In Go schreibst du `for _, zutat := range zutaten`. Lies es als: „Für jede Zutat in der Liste zutaten …"',
  'Der Name `zutat` wechselt bei jedem Durchlauf. Beim ersten Mal ist er „Salami", beim nächsten „Käse" – und dein Code bleibt trotzdem nur drei Zeilen lang.'
 ],[
  word('range','Das Go-Wort für „gehe die Reihe durch".'),
  word('Element','Ein einzelner Eintrag in einer Liste.')
 ],{code:'zutaten := []string{"Salami", "Käse", "Pilze"}\nfor _, zutat := range zutaten {\n    fmt.Println(zutat)\n}',
  output:'Salami\nKäse\nPilze',
  tryIt:'Füge „Tomate" zur Liste hinzu. Wie viele Zeilen gibt das Programm jetzt aus?',
  misconception:'`range` liefert zwei Werte: die Position und das Element. Das `_` wirft die Position weg, weil wir sie heute nicht brauchen.',
  solution:'Vier Zeilen: Salami, Käse, Pilze und Tomate. Der Code selbst bleibt gleich.'}),

 lesson('count-along',[
  'Du willst wissen, wie viele Pizzen heute verkauft wurden. Bei jeder Bestellung sagst du: „Eine mehr."',
  'Im Computer geht das mit einem Zähler. Du legst ihn bei 0 an und schreibst bei jeder Pizza `zaehler++`. Das ist Go-Kurzschreibweise für „nimm den alten Wert und addiere eins".',
  'WENN eine Pizza verkauft wird, DANN erhöhe den Zähler um eins. Nach drei Pizzen steht dort 3.'
 ],[
  word('Zähler','Eine Zahl, die bei jedem Ereignis um eins weitergeht.'),
  word('Inkrement','Das Erhöhen einer Zahl um genau eins, in Go geschrieben als ++.')
 ],{code:'zaehler := 0\nzaehler++\nzaehler++\nfmt.Println(zaehler)',
  output:'2',
  tryIt:'Füge eine dritte Zeile `zaehler++` ein. Was steht jetzt auf dem Bildschirm?',
  misconception:'`zaehler = zaehler + 1` ginge auch. Wichtig ist, dass rechts der alte Wert steht und links der neue gespeichert wird.',
  solution:'Es steht 3. Der Zähler war 2, dann kam eins dazu.'}),

 lesson('ingredient-list',[
  'Die Zutaten liegen in einer Liste: Salami, Käse, Pilze. Du willst die zweite Zutat wissen. Dafür fragst du nach einer Position.',
  'Diese Position heißt Index. In Go beginnt sie bei 0 – nicht bei 1. `zutaten[0]` ist Salami, `zutaten[1]` ist Käse, `zutaten[2]` sind Pilze.',
  'WENN du eine Zutat brauchst, DANN fragst du mit der Nummer in eckigen Klammern. Das ist wie ein Regal mit Nummern an den Fächern.'
 ],[
  word('Index','Die Nummer einer Position in einer Liste. Sie beginnt bei 0.'),
  word('Slice','Eine Go-Liste mit fester Reihenfolge, geschrieben als []string oder []int.')
 ],{code:'zutaten := []string{"Salami", "Käse", "Pilze"}\nfmt.Println(zutaten[1])',
  output:'Käse',
  tryIt:'Ändere die 1 in eine 2. Welche Zutat erscheint jetzt?',
  misconception:'Viele denken, [2] sei das zweite Element. Es ist das dritte, weil bei 0 gezählt wird. Fragst du zu weit, meldet Go einen Fehler.',
  solution:'Bei [2] erscheinen „Pilze". Die Position 2 ist das dritte Fach im Regal.'}),

 lesson('ingredient-card',[
  'Salami hat einen Namen, ein Gewicht und einen Preis. Drei einzelne Variablen wären unübersichtlich. Du schreibst alles auf eine Karte.',
  'In Go heißt so eine Karte `struct`. Du sagst nur, welche Felder sie hat – und erzeugst dann eine konkrete Zutat daraus. Ein großgeschriebenes Feld ist für andere Pakete sichtbar.',
  'WENN mehrere Werte zusammengehören, DANN bündele sie in einem Struct. Dein Code wird kürzer und du findest die Zutat schneller wieder.'
 ],[
  word('Struct','Eine Datenkarte mit festen, benannten Feldern in Go.'),
  word('Feld','Ein benannter Platz auf der Karte, zum Beispiel das Gewicht.')
 ],{code:'type Zutat struct {\n    Name  string\n    Gramm int\n}\nsalami := Zutat{Name: "Salami", Gramm: 30}\nfmt.Println(salami)',
  output:'{Salami 30}',
  tryIt:'Erzeuge eine zweite Karte für Käse mit 40 Gramm. Wie sieht die Ausgabe aus?',
  misconception:'Ein Struct ist kein Java-Record: Go zeigt keine Feldnamen von selbst. Für eine hübschere Ausgabe nutzt du fmt.Printf mit %+v.',
  solution:'Zutat{Name: "Käse", Gramm: 40} ergibt {Käse 40}. Die Karte zeigt beide Felder in ihrer Reihenfolge.'}),

 lesson('same-dough',[
  'Dein Teig besteht immer aus denselben vier Zahlen: Mehl, Wasser, Salz, Hefe. Du willst nicht, dass jemand heimlich das Wasser ändert.',
  'Go hat kein `record` und keine magische Unveränderlichkeit. Wir schreiben die Felder klein – dann sind sie nur im eigenen Paket sichtbar – und geben den Teig nur über eine Erzeugfunktion heraus.',
  'WENN etwas immer gleich bleiben soll, DANN verstecke die Felder und biete nur eine Lesemöglichkeit an. Das ist wie ein ausgedrucktes Rezept statt einer löschbaren Notiz.'
 ],[
  word('unexportiert','Ein kleingeschriebenes Feld, das nur im eigenen Paket sichtbar ist.'),
  word('Rezept','Hier: die feste Liste der Zutaten und Mengen für den Teig.')
 ],{code:'type Teig struct{ mehl, wasser, salz, hefe int }\nfunc Standard() Teig { return Teig{500, 350, 10, 5} }\nfmt.Println(Standard().wasser)',
  output:'350',
  tryIt:'Frage das Salz ab statt das Wasser. Welche Zahl erscheint?',
  misconception:'Klein geschrieben heißt nicht „geheim für immer", sondern „nur in diesem Paket". Genau deshalb kann niemand von außen das Wasser verändern.',
  solution:'Es erscheint 10. Mit `.salz` liest du ein anderes Feld derselben Karte.'}),

 lesson('two-equal-doughs',[
  'Zwei Teigkarten haben dieselben Zahlen. Es sind zwei Zettel – aber der Teig ist gleich. Willst du das prüfen, fragst du nach dem Inhalt.',
  'Bei Structs mit einfachen Feldern vergleicht Go mit `==` den Inhalt, nicht die Adresse. Zwei neue Zettel mit gleichen Zahlen sind also gleich.',
  'WENN alle Felder übereinstimmen, DANN sind die Teige gleich. Das unterscheidet Inhalt von Identität – wie zwei Zettel mit demselben Rezept.'
 ],[
  word('Wertgleichheit','Zwei Dinge sind gleich, weil ihr Inhalt übereinstimmt.'),
  word('vergleichbar','Ein Typ, den Go mit == prüfen kann. Zahlen und Strings sind es, Slices und Maps nicht.')
 ],{code:'a := Teig{500, 350, 10, 5}\nb := Teig{500, 350, 10, 5}\nfmt.Println(a == b)',
  output:'true',
  tryIt:'Ändere bei b die 350 in 400. Was gibt das Programm jetzt aus?',
  misconception:'Bei `==` vergleicht Go den Inhalt, weil der Teig ein Wert ist. Anders als bei Java brauchst du hier kein equals.',
  solution:'Bei 400 ist ein Feld anders, also erscheint false. Die Teige sind nicht mehr gleich.'}),

 lesson('ingredient-box',[
  'Du baust eine Box, in die eine Zutat hineinkommt. Mal ist es Salami, mal Käse. Du schreibst die Box nur einmal – mit einem Platzhalter `T`.',
  'Dieser Platzhalter heißt Typparameter. Seit Go 1.18 schreibst du `type Box[T any]`. Beim Benutzen sagst du, was `T` diesmal ist: `Box[string]` für Text.',
  'WENN eine Box für verschiedene Inhalte gedacht ist, DANN gib ihr einen Typplatzhalter. So brauchst du keine zweite Box für jeden Belag.'
 ],[
  word('Typparameter','Der Platzhalter T, der später durch einen echten Typ ersetzt wird.'),
  word('any','Die Grenze „jeder Typ ist erlaubt". Sie steht im eckigen Klammerausdruck.')
 ],{code:'type Box[T any] struct{ Inhalt T }\nsalami := Box[string]{Inhalt: "Salami"}\nfmt.Println(salami.Inhalt)',
  output:'Salami',
  tryIt:'Baue eine zweite Box für den Text "Käse". Wie heißt der Typ?',
  misconception:'`T` ist kein geheimer Wert. Es ist nur ein Platzhalter für einen Typ – wie ein leeres Etikett an der Box.',
  solution:'Auch sie ist eine Box[string]. Der Inhalt ist anders, der Typ bleibt Text.'}),

 lesson('salami-not-cheese',[
  'Eine Salami-Box und eine Käse-Box sehen gleich aus. Du darfst sie aber nicht verwechseln – sonst liegt plötzlich Käse im Salami-Fach.',
  'Go prüft das streng: `Box[Salami]` und `Box[Kaese]` sind zwei verschiedene Typen. Man sagt: Typparameter bleiben getrennt.',
  'WENN der Inhalt unterschiedlich ist, DANN sind es verschiedene Boxen. Der Compiler hilft dir, die Fächer sortiert zu halten.'
 ],[
  word('Typsicherheit','Der Compiler verhindert, dass ein Wert ins falsche Fach gelegt wird.'),
  word('Compiler','Das Werkzeug, das deinen Go-Code prüft, bevor er läuft.')
 ],{code:'salami := Box[Salami]{Inhalt: Salami{Name: "Salami"}}\nkaese := Box[Kaese]{Inhalt: Kaese{Name: "Käse"}}\nfmt.Println(salami.Inhalt.Name, kaese.Inhalt.Name)',
  output:'Salami Käse',
  tryIt:'Versuche, in fach1 eine Kaese zu legen. Was sagt der Compiler?',
  misconception:'Weil beide Karten ein Feld haben, heißt das nicht, dass sie gleich sind. Der Typ in der Box bleibt entscheidend.',
  solution:'Der Compiler meldet einen Fehler: In eine Box[Salami] passt kein Kaese. Genau das wolltest du.'}),

 lesson('many-kinds',[
  'Jetzt willst du eine Box, die alle Beläge aufnimmt – Salami, Käse und Pilze. Aber keine Nudeln, bitte.',
  'Dafür benennst du eine gemeinsame Grenze: ein kleines Interface mit der Aufgabe `Liefern()`. Dann schreibst du `Box[T Belag]`.',
  'WENN mehrere Sorten erlaubt sind, DANN benenne die gemeinsame Regel. SONST darf alles hinein – auch Nudeln.'
 ],[
  word('Interface','Ein Vertrag aus Methoden. In Go erfüllt ihn jeder Typ, der diese Methoden hat – ohne implements.'),
  word('Constraint','Die Grenze für einen Typplatzhalter, hier „muss Belag sein".')
 ],{code:'type Belag interface{ Liefern() string }\ntype Box[T Belag] struct{ Inhalt T }\n// Salami und Kaese liefern; Nudel nicht.',
  output:'(Salami passt, Nudeln nicht)',
  tryIt:'Erfinde einen Typ Nudel ohne Liefern(). Darf er in die Box?',
  misconception:'Go-Interfaces werden still erfüllt: Wer die Methode hat, passt. Es gibt kein Schlüsselwort implements wie in Java.',
  solution:'Nein. Nudel erfüllt den Vertrag Belag nicht, also weist der Compiler sie ab.'}),

 lesson('recipe-card',[
  'Du machst jeden Tag denselben Teig. Statt die Schritte immer wieder neu zu schreiben, gibst du dem Rezept einen Namen.',
  'Eine Funktion ist genau so ein benanntes Rezept. Du schreibst sie einmal mit `func` und rufst sie bei Bedarf auf. Go führt dann alle Schritte aus.',
  'WENN du dieselbe Arbeit oft brauchst, DANN schreibe eine Funktion. Das spart Tipparbeit und verhindert, dass du beim zweiten Mal etwas vergisst.'
 ],[
  word('Funktion','Ein benanntes Rezept mit Schritten, das du mehrfach aufrufen kannst.'),
  word('Aufruf','Der Moment, in dem du den Namen des Rezepts hinschreibst.')
 ],{code:'func teigMachen() {\n    fmt.Println("Mehl, Wasser, Salz, Hefe")\n}\nteigMachen()',
  output:'Mehl, Wasser, Salz, Hefe',
  tryIt:'Rufe teigMachen() zweimal auf. Was siehst du auf dem Bildschirm?',
  misconception:'Das Rezept wird erst beim Aufruf ausgeführt. Nur hinschreiben reicht nicht – du musst den Namen auch aufrufen.',
  solution:'Die Zutatenzeile erscheint zweimal. Jeder Aufruf führt das Rezept erneut aus.'}),

 lesson('pass-ingredients',[
  'Dein Teigrezept braucht Mehl und Wasser. Diese Werte gibst du beim Aufruf mit – wie Zutaten, die du dem Koch reichst.',
  'Diese übergebenen Werte heißen Parameter. In Go steht der Typ direkt danach: `anzahl int`. Nach der Parameterliste kommt der Rückgabetyp.',
  'WENN ein Rezept Zutaten braucht, DANN übergib sie beim Aufruf. SONST müsste das Rezept immer dieselbe Menge backen.'
 ],[
  word('Parameter','Ein Wert mit Typ, den du einer Funktion beim Aufruf mitgibst.'),
  word('Rückgabewert','Das Ergebnis, das die Funktion nach dem Parameterklammern zurückgibt.')
 ],{code:'func preis(anzahl int) int { return anzahl * 8 }\nfmt.Println(preis(2))',
  output:'16',
  tryIt:'Rufe preis(3) auf. Was kommt heraus?',
  misconception:'Die Zahl in der Klammer beim Aufruf ist nicht dieselbe wie die in der Funktionszeile. Dort steht nur der Platzhalter.',
  solution:'Bei 3 Pizzen kommt 24 heraus. Der Platzhalter anzahl wurde durch 3 ersetzt.'}),

 lesson('kitchen-job',[
  'Dein Laden hat viele Aufgaben. Wenn ein Typ alles macht – kochen, kassieren, aufräumen –, verlierst du den Überblick.',
  'Du teilst die Arbeit in Rollen. Ein Struct ist so eine Rolle: Er hat Daten und Methoden. Die Küche backt, die Kasse nimmt Geld.',
  'WENN eine Aufgabe groß ist, DANN teile sie in Rollen. Jeder Typ kennt nur seine eigenen Details – das nennt man Kapselung.'
 ],[
  word('Methode','Eine Funktion, die an einen Typ gebunden ist. Sie steht mit Empfänger in der Klammer.'),
  word('Kapselung','Details bleiben im Typ und stören andere Teile nicht.')
 ],{code:'type Kueche struct{}\nfunc (k Kueche) Backen() { fmt.Println("Pizza ist fertig") }\nKueche{}.Backen()',
  output:'Pizza ist fertig',
  tryIt:'Gib der Küche eine zweite Aufgabe namens Aufraeumen(). Wie sieht der Typ jetzt aus?',
  misconception:'Ein Struct ist kein Objekt mit new. Mit `Kueche{}` erzeugst du einen Wert, und die Methode hängt am Typ.',
  solution:'Du ergänzt `func (k Kueche) Aufraeumen()` mit einer eigenen Ausgabe. Beide Methoden gehören zu demselben Typ.'}),

 lesson('chef-and-apprentice',[
  'Der Azubi soll alles können, was der Chef kann – und zusätzlich den Boden putzen. Du schreibst die Koch-Aufgaben nicht zweimal.',
  'Go hat keine Vererbung wie Java. Stattdessen bettest du den Chef im Azubi ein: `struct{ Chef }`. Dadurch übernimmt der Azubi dessen Methoden.',
  'WENN eine Rolle die Aufgaben einer anderen braucht, DANN bette sie ein. SONST schreibst du dieselben Methoden zweimal.'
 ],[
  word('Einbetten','Ein Typ enthält einen anderen und übernimmt dadurch dessen Methoden.'),
  word('Delegation','Die Arbeit bleibt beim eingebetteten Typ – du rufst sie einfach weiter auf.')
 ],{code:'type Chef struct{}\nfunc (Chef) Backen() { fmt.Println("Backen") }\ntype Azubi struct{ Chef }\nfunc (Azubi) Putzen() { fmt.Println("Putzen") }\nAzubi{}.Backen()',
  output:'Backen',
  tryIt:'Rufe Putzen() auf dem Azubi auf. Was erscheint?',
  misconception:'Der Chef kann nicht automatisch putzen – nur der Azubi. Einbetten geht vom Azubi zum Chef, nicht umgekehrt.',
  solution:'Es erscheint „Putzen". Der Azubi hat beide Aufgaben: die eingebetteten und seine eigenen.'}),

 lesson('label-shelf',[
  'Dein Regal hat viele Fächer. Du willst die Salami über ihren Namen finden, nicht über eine Nummer. Dafür klebst du Etiketten.',
  'In Go heißt so ein Etikett Schlüssel. Eine Map verbindet Schlüssel und Wert: `"Salami"` zeigt auf die Zahl 3.',
  'WENN du etwas über einen Namen finden willst, DANN nimm eine Map. SONST musst du alle Fächer einzeln durchsuchen.'
 ],[
  word('Map','Eine Sammlung, in der ein Schlüssel zu einem Wert führt.'),
  word('Schlüssel','Der Name, über den du etwas in der Map wiederfindest.')
 ],{code:'regal := map[string]int{"Salami": 3}\nfmt.Println(regal["Salami"])',
  output:'3',
  tryIt:'Lege einen zweiten Schlüssel "Käse" mit 5 an. Was gibt regal["Käse"] aus?',
  misconception:'Die Map hat keine Reihenfolge, die du dir merken kannst. Du fragst immer über den Schlüssel, nicht über Position 1 oder 2.',
  solution:'Es erscheint 5. Der Schlüssel "Käse" führt direkt zu diesem Wert.'}),

 lesson('no-duplicates',[
  'Zwei Mitarbeiter schreiben „Salami" ins Zutatenbuch. Du willst sie nur einmal zählen.',
  'Go hat keinen eigenen Set-Typ. Du nimmst eine Map mit `bool` als Wert: `zutaten["Salami"] = true`. Ein zweiter Eintrag überschreibt nur denselben Schlüssel.',
  'WENN etwas nur einmal vorkommen darf, DANN nimm eine Map als Menge. Das ist wie eine Gästeliste: Dieselbe Person steht nicht zweimal drauf.'
 ],[
  word('Menge','Eine Sammlung ohne doppelte Einträge, in Go oft map[T]bool.'),
  word('Duplikat','Ein zweiter Eintrag mit demselben Wert.')
 ],{code:'zutaten := map[string]bool{}\nzutaten["Salami"] = true\nzutaten["Salami"] = true\nfmt.Println(len(zutaten))',
  output:'1',
  tryIt:'Füge "Käse" hinzu. Wie groß ist die Menge jetzt?',
  misconception:'Bei einer Liste wären jetzt zwei Salami-Einträge. Bei der Map bleibt es bei einem – deshalb ist die Ausgabe 1.',
  solution:'Die Menge hat dann zwei Einträge: Salami und Käse. Die Ausgabe ist 2.'}),

 lesson('sum-prices',[
  'Am Ende des Tages willst du wissen, wie viel Geld du eingenommen hast. Du hast eine Liste mit Preisen.',
  'Go hat keine Stream-Kette wie Java. Eine kleine `range`-Schleife ist die übliche und gut lesbare Lösung: `summe += preis` addiert jeden Wert.',
  'WENN du viele Zahlen zu einer Summe machen willst, DANN gehe sie Schritt für Schritt durch. Jeder Schritt hat eine klare Aufgabe.'
 ],[
  word('Summe','Das Ergebnis des Addierens.'),
  word('+=','Kurzschreibweise für „nimm den alten Wert und addiere".')
 ],{code:'preise := []int{8, 8, 12}\nsumme := 0\nfor _, preis := range preise {\n    summe += preis\n}\nfmt.Println(summe)',
  output:'28',
  tryIt:'Füge eine 5 zur Liste hinzu. Was ist die neue Summe?',
  misconception:'Die Schleife verändert die Liste nicht. Sie liest nur die Werte und baut ein neues Ergebnis auf.',
  solution:'Die neue Summe ist 33. Die Liste selbst bleibt unverändert.'}),

 lesson('rule-lambda',[
  'Deine Rabattregel ist ein kleiner Satz: „Vom Preis geht ein Zehntel ab." Du willst sie wie einen Zettel weitergeben.',
  'In Go schreibst du eine kleine Funktion ohne Namen: `func(preis int) int { ... }`. Du kannst sie in einer Variable speichern und später aufrufen.',
  'WENN du eine Regel weitergeben willst, DANN schreibe sie als Funktionswert. Das ist kürzer als ein eigener Typ.'
 ],[
  word('Funktionswert','Eine Funktion, die du wie einen Wert in einer Variable ablegen kannst.'),
  word('Rabatt','Ein Betrag, der vom Preis abgezogen wird.')
 ],{code:'rabatt := func(preis int) int { return preis / 10 }\nfmt.Println(rabatt(50))',
  output:'5',
  tryIt:'Was gibt rabatt(100) aus? Begründe deine Antwort mit der Regel vom Zehntel.',
  misconception:'Die kleine Funktion wird nicht sofort ausgeführt. Erst mit rabatt(...) benutzt du die Regel.',
  solution:'Bei 100 ist ein Zehntel 10. Die Regel wurde mit dem neuen Wert angewendet.'}),

 lesson('salami-gone',[
  'Ein Gast will Salami. Im Regal ist nichts mehr. Du willst nicht einfach 0 schreiben – du willst sagen: „Salami fehlt."',
  'Go hat kein `Optional`. Beim Map-Zugriff bekommst du zwei Werte: den Wert und `ok`. Ist `ok` falsch, war der Schlüssel nicht da.',
  'WENN etwas fehlen kann, DANN frage das zweite Ergebnis ab. Der Gast weiß dann, was los ist – statt eine falsche Zahl zu sehen.'
 ],[
  word('Zwei-Werte-Muster','Ein Aufruf liefert Wert und Zustand, zum Beispiel (menge, ok).'),
  word('Zero-Value','Der leere Standardwert eines Typs, bei int zum Beispiel 0.')
 ],{code:'regal := map[string]int{"Käse": 5}\nmenge, ok := regal["Salami"]\nif !ok { menge = 5 }\nfmt.Println(menge)',
  output:'5',
  tryIt:'Setze stattdessen "Salami" mit 3 in die Map. Was erscheint jetzt?',
  misconception:'Eine fehlende Map-Schlüssel liefert 0 und false. Wer nur die 0 ansieht, verwechselt „leer" mit „null Stück".',
  solution:'Es erscheint 3. Die Box ist gefüllt, darum wird der Ersatzwert nicht gebraucht.'}),

 lesson('polite-error',[
  'Die Salami fehlt. Du könntest das Programm einfach abbrechen lassen. Besser ist eine klare Meldung: „Salami fehlt im Regal."',
  'In Go gibt eine Funktion einen `error` als letzten Rückgabewert zurück. `nil` heißt: alles gut. Mit `fmt.Errorf` baust du eine verständliche Meldung.',
  'WENN etwas schiefgeht, DANN gib einen klaren error zurück. SONST rät der Gast, was passiert ist.'
 ],[
  word('error','Ein Go-Wert mit der Methode Error(), der sagt: Hier ist etwas schiefgelaufen.'),
  word('nil','Der Wert für „kein Fehler" und „kein Wert".')
 ],{code:'func bestellen(bestand int) error {\n    if bestand < 1 {\n        return fmt.Errorf("Salami fehlt im Regal")\n    }\n    return nil\n}\nfmt.Println("Fehler:", bestellen(0))',
  output:'Fehler: Salami fehlt im Regal',
  tryIt:'Setze bestand auf 2. Was passiert jetzt?',
  misconception:'Ein error ist kein normales Ergebnis wie 0. Er wird bewusst zurückgegeben und vom Aufrufer geprüft.',
  solution:'Bei 2 ist die Bedingung falsch. Die Funktion gibt nil zurück, und es gibt keine Fehlermeldung.'}),

 lesson('first-junit',[
  'Du willst morgens schnell wissen, ob deine Rabattregel noch stimmt. Ein Test prüft das automatisch – schneller als jedes Mal neu nachzurechnen.',
  'Go braucht dafür kein JUnit. Eine Datei namens `rabatt_test.go` enthält eine Funktion `TestRabatt(t *testing.T)`; `go test ./...` führt sie aus.',
  'WENN du eine Regel änderst, DANN prüfe sie mit einem Test. Besonders Grenzfälle wie 0 oder 1 sind wichtig.'
 ],[
  word('go test','Der Go-Befehl, der alle Tests eines Projekts ausführt.'),
  word('Grenzfall','Ein besonderer Wert ganz am Rand, zum Beispiel 0.')
 ],{code:'func TestRabatt(t *testing.T) {\n    if got := rabatt(50); got != 5 {\n        t.Fatalf("erwartet 5, bekommen %d", got)\n    }\n}',
  output:'Test bestanden (go test)',
  tryIt:'Schreibe einen zweiten Test für rabatt(0). Was erwartest du?',
  misconception:'Ein Test prüft nur das, was du hinschreibst. Wenn du den Grenzfall vergisst, findet der Test ihn auch nicht.',
  solution:'Bei 0 ist ein Zehntel 0. Der Test mit erwartet 0 für rabatt(0) sollte bestehen.'}),

 lesson('one-file-not-enough',[
  'Deine Pizzeria steht in einer Datei mit 1.000 Zeilen. Du suchst die Preisregel und findest sie erst nach fünf Minuten.',
  'Du teilst den Laden in Pakete auf: `handler` nimmt Anfragen an, `kueche` entscheidet, `regal` liefert Zutaten. Jedes Paket bekommt eigene Dateien.',
  'WENN eine Datei zu groß wird, DANN teile sie in Pakete. Das ist wie ein Laden mit getrennten Arbeitsplätzen statt einem überfüllten Raum.'
 ],[
  word('Paket','Eine Gruppe von Go-Dateien, die zusammen gehören. Oben steht package name.'),
  word('Struktur','Die Ordnung, in der du deinen Code aufteilst.')
 ],{code:'// handler/handler.go  – Eingabe\n// kueche/kueche.go    – Regeln\n// regal/regal.go      – Daten\n// main.go             – Verdrahtung',
  output:'(vier getrennte Arbeitsplätze)',
  tryIt:'Welches Paket wäre zuständig, wenn ein Gast die Rechnung will?',
  misconception:'Pakete sind keine extra Arbeit um der Pakete willen. Sie helfen erst, wenn der Laden größer wird.',
  solution:'Das Handler-Paket. Die Küche kocht, das Regal liefert Zutaten, der Rechner steht in der Mitte.'}),

 lesson('one-job',[
  'Wenn die Kassiererin gleichzeitig kocht und im Regal steht, verliert sie den Überblick. Jede Rolle soll genau eine Aufgabe haben.',
  'Diese Regel heißt: ein Typ – eine Aufgabe. Wenn du merkst, dass ein Typ „und" im Namen braucht, teile ihn.',
  'WENN ein Typ zwei Aufgaben hat, DANN teile ihn. SONST wird er schwer veränderbar.'
 ],[
  word('Aufgabe','Die Sache, für die ein Typ zuständig ist.'),
  word('Verantwortung','Die Arbeit, die eine Rolle übernimmt.')
 ],{code:'type Regal struct{ bestand map[string]int }\nfunc (r Regal) Menge(zutat string) int { return r.bestand[zutat] }\ntype Kueche struct{}\nfunc (Kueche) Backen() { fmt.Println("Fertig") }',
  output:'(Regal speichert, Küche backt)',
  tryIt:'Finde eine dritte Aufgabe und gib ihr einen eigenen Typ.',
  misconception:'Ein Typ darf ruhig mehrere kleine Methoden haben – aber sie sollten alle zu derselben Aufgabe gehören.',
  solution:'Zum Beispiel eine Kasse, die den Preis berechnet. Sie gehört nicht in die Küche.'}),

 lesson('project-order',[
  'Du baust deinen Laden jeden Tag neu. Du willst einen Knopf, der alles erledigt: Code prüfen, starten und Fehler anzeigen.',
  'In Go übernimmt das `go`-Werkzeug. `go mod init pizzeria` legt die Moduldatei an, `go run .` startet, `go test ./...` prüft. Einstellungen kommen aus Umgebungsvariablen.',
  'WENN du ein Projekt öfter baust, DANN brauchst du Werkzeuge und Einstellungen. SONST machst du alles von Hand.'
 ],[
  word('go.mod','Die Datei, in der Go den Namen des Moduls und seine Versionen merkt.'),
  word('Umgebungsvariable','Ein Wert, den du dem Programm beim Start von außen gibst.')
 ],{code:'go mod init pizzeria\ngo run .\ngo test ./...',
  output:'Die App läuft – und Fehler siehst du sofort.',
  tryIt:'Ändere den Port über eine Umgebungsvariable. Wo erreichst du jetzt deine Pizzeria?',
  misconception:'Konfiguration ist kein Code. Du änderst sie in der Umgebung, ohne das Programm neu zu schreiben.',
  solution:'Zum Beispiel unter http://localhost:8081, wenn du PORT=8081 setzt und dein Server das liest.'}),

 lesson('first-http',[
  'Ein Gast soll deine Pizzeria vom Handy ansehen können. Dazu braucht er eine Adresse, die er im Browser eintippt.',
  'Eine solche Adresse heißt URL. Mit `net/http` wartet dein Programm dort auf Anfragen und antwortet mit Daten – meist als JSON, einem einfachen Textformat aus `encoding/json`.',
  'WENN jemand die Adresse aufruft, DANN antworte mit einer Liste. Das ist der erste Schritt vom Programm zur Web-Anwendung.'
 ],[
  word('URL','Die Adresse, unter der eine Anwendung im Browser erreichbar ist.'),
  word('JSON','Ein Textformat mit benannten Feldern, mit dem Programme Daten austauschen.')
 ],{code:'http.HandleFunc("/pizzen", func(w http.ResponseWriter, r *http.Request) {\n    json.NewEncoder(w).Encode([]string{"Salami", "Käse"})\n})\nhttp.ListenAndServe(":8080", nil)',
  output:'["Salami","Käse"]',
  tryIt:'Füge „Pilze" zur Liste hinzu. Was sieht der Gast jetzt?',
  misconception:'`GET` bedeutet nur „zeig mir Daten". Um etwas zu bestellen, brauchst du später `POST`.',
  solution:'Die Antwort enthält dann drei Pizzen: Salami, Käse und Pilze.'}),

 lesson('restaurant-leader',[
  'Küche, Regal und Kasse müssen zusammenarbeiten. Jemand muss sie miteinander bekannt machen. In Go bist du das – in der Funktion `main`.',
  'Es gibt keinen Spring-Container und keine Annotationen. Du erzeugst das Regal, gibst es der Küche und die Küche dem Handler. Das nennt man explizites Verdrahten.',
  'WENN Rollen zusammenarbeiten, DANN übergib sie beim Erzeugen. Du bekommst sie nicht gereicht – du reichst sie selbst weiter.'
 ],[
  word('Verdrahten','Das Verbinden der Rollen, in Go meist ein paar Zeilen in main.'),
  word('explizit','Hinsichtlich der Abhängigkeiten: Du schreibst sie selbst hin, statt sie zu verstecken.')
 ],{code:'regal := NewRegal()\nkueche := NewKueche(regal)\nhandler := NewHandler(kueche)\nhttp.ListenAndServe(":8080", handler)',
  output:'Die Pizzeria-App startet.',
  tryIt:'Starte die App und öffne die Adresse, die du in main gewählt hast.',
  misconception:'Go macht keine Magie. Das Verdrahten ein paar Zeilen in main ist kurz, aber du siehst genau, was passiert.',
  solution:'Du siehst zum Beispiel http://localhost:8080. Dort ist dein Laden erreichbar.'}),

 lesson('cashier',[
  'Die Kassiererin sitzt am Eingang. Sie nimmt die Bestellung entgegen und gibt eine Antwort zurück. In Go heißt das Handler.',
  'Mit `mux.HandleFunc("POST /bestellung", ...)` sagst du: „Hier kommen Bestellungen an." Seit Go 1.22 gehört die HTTP-Methode zum Muster.',
  'WENN ein Gast eine Bestellung schickt, DANN nimmt der Handler sie an. Er kocht nicht selbst – er gibt die Arbeit weiter.'
 ],[
  word('Handler','Eine Funktion, die eine HTTP-Anfrage annimmt und antwortet.'),
  word('POST','Eine Anfrage, die neue Daten schickt – hier eine Bestellung.')
 ],{code:'mux := http.NewServeMux()\nmux.HandleFunc("POST /bestellung", func(w http.ResponseWriter, r *http.Request) {\n    fmt.Fprintln(w, "Bestellung angekommen")\n})',
  output:'Bestellung angekommen',
  tryIt:'Ändere den Text der Antwort in deinen eigenen Satz.',
  misconception:'Der Handler soll keine Preise berechnen. Er nimmt nur an und antwortet – die Regeln kommen in die Küche.',
  solution:'Die Antwort zeigt jetzt deinen neuen Text. Die Adresse /bestellung bleibt gleich.'}),

 lesson('kitchen',[
  'Der Küchenchef entscheidet, was mit der Bestellung passiert. Er weiß nichts vom Bildschirm oder vom Handy – er bekommt nur die Bestellung.',
  'In Go ist das ein Service-Typ mit Methoden. Er trägt die fachlichen Regeln: genug Zutaten? Welcher Preis? Darum gehört er in ein eigenes Paket.',
  'WENN die Bestellung angekommen ist, DANN arbeite sie im Service weiter. Eingabe und Verarbeitung bleiben getrennt.'
 ],[
  word('Service','Der Typ, in dem die fachlichen Regeln stehen.'),
  word('Trennung','Eingabe und Verarbeitung liegen in verschiedenen Paketen.')
 ],{code:'type Kueche struct{ regal *Regal }\nfunc (k Kueche) Backen(pizza string) string {\n    return pizza + " ist fertig"\n}',
  output:'Salami ist fertig',
  tryIt:'Rufe Backen("Käse") auf. Was kommt zurück?',
  misconception:'Ein Service ist keine Website. Er ist nur ein Typ mit Methoden – der Handler ruft ihn auf.',
  solution:'Es kommt „Käse ist fertig" zurück. Die Regel wurde mit einem anderen Namen angewendet.'}),

 lesson('shelf',[
  'Das Regal merkt sich, wie viele Zutaten da sind. Es kümmert sich nicht um Gäste oder Preise. Es kennt nur Fächer und Bestände.',
  'In Go beschreibst du das über ein kleines Interface mit einer Methode. Der Küchen-Service kennt nur dieses Interface – egal ob dahinter eine Map oder eine Datenbank steckt.',
  'WENN Daten nachgeschlagen werden, DANN frag das Regal. SONST wühlt die Küche selbst im Bestand.'
 ],[
  word('Interface','Eine kleine Liste von Methoden, die ein Typ erfüllen muss.'),
  word('Bestand','Die Menge, die von einer Zutat vorhanden ist.')
 ],{code:'type Regal interface {\n    Menge(name string) (int, error)\n}',
  output:'(Salami → 3, fehlt → error)',
  tryIt:'Lege "Salami" mit 3 an und frage den Bestand ab. Was erhältst du?',
  misconception:'Ein Interface ist noch keine Datenbank. Es beschreibt nur, welche Frage du stellen kannst – die Antwort kommt später.',
  solution:'Du erhältst 3 und einen nil-error. Die Map im Regal enthält den Schlüssel "Salami" mit dem Wert 3.'}),

 lesson('pizzeria-api',[
  'Jetzt arbeitet alles zusammen: Der Gast schickt eine Bestellung, der Handler nimmt sie an, die Küche prüft sie, das Regal liefert die Zutaten.',
  'Du hast in diesem Band gelernt, wie man Regeln in Go übersetzt – von der ersten WENN-DANN-SONST-Idee bis zur kleinen Web-App mit der Standardbibliothek.',
  'WENN alle Rollen zusammenarbeiten, DANN entsteht eine echte kleine Anwendung. Zeige sie einem Freund – und erkläre dabei die Regel, nicht die Syntax.'
 ],[
  word('Zusammenspiel','Mehrere Rollen, die jeweils ihre Aufgabe erledigen.'),
  word('Projekt','Eine Anwendung, in der viele gelernte Konzepte zusammenkommen.')
 ],{code:'mux.HandleFunc("GET /pizzen", handler.Liste)\nmux.HandleFunc("POST /bestellen", handler.Bestellen)\nhttp.ListenAndServe(":8080", mux)',
  output:'Salami: Bestellung angenommen',
  tryIt:'Erkläre einem Freund, was Handler, Service und Regal machen – ganz ohne Fachbegriffe.',
  misconception:'Ein Projekt ist fertig, wenn es läuft – aber nicht, wenn du es nicht mehr erklären kannst. Verständlichkeit gehört zum Ergebnis.',
  solution:'Der Handler nimmt an, der Service entscheidet, das Regal liefert Zutaten. Genau die Rollenteilung aus Stufe 8 und 9.'})
];
