import test from 'node:test';
import assert from 'node:assert/strict';
import {PIZZERIA_BOOK} from '../src/content/pizzeria-book.ts';
import {PIZZERIA_GO_BOOK,getGoChapter,validateGoBook} from '../src/content/pizzeria-go-book.ts';

const JAVA_ONLY:readonly string[]=[
 'System.out','java.','new Scanner','Optional<','public static','class ','extends ',
 '@SpringBoot','@Service','@Repository','@Entity','@RestController','JpaRepository',
 '.stream()','throw new','assertEquals','implements ','mvn ','spring.'
];

test('Go-Band 1 hat denselben Fahrplan wie das Java-Buch',()=>{
 assert.deepEqual(validateGoBook(),[]);
 assert.equal(PIZZERIA_GO_BOOK.chapters.length,37);
 assert.equal(PIZZERIA_GO_BOOK.stages.length,11);
 assert.deepEqual(PIZZERIA_GO_BOOK.stages.slice(0,9).map(stage=>stage.id),
  PIZZERIA_BOOK.stages.slice(0,9).map(stage=>stage.id));
 assert.equal(PIZZERIA_GO_BOOK.stages[9].id,'wiring');
 assert.equal(PIZZERIA_GO_BOOK.stages[10].id,PIZZERIA_BOOK.stages[10].id);
 assert.deepEqual(PIZZERIA_GO_BOOK.chapters.map(chapter=>chapter.id),PIZZERIA_BOOK.chapters.map(chapter=>chapter.id));
 assert.deepEqual(PIZZERIA_GO_BOOK.chapters.map(chapter=>chapter.minutes),PIZZERIA_BOOK.chapters.map(chapter=>chapter.minutes));
 assert.equal(PIZZERIA_GO_BOOK.chapters[0].id,'first-guest');
 assert.equal(PIZZERIA_GO_BOOK.chapters[36].id,'pizzeria-api');
});

test('alle 37 Go-Kapitel sind vollständig ausgeformuliert',()=>{
 for(const chapter of PIZZERIA_GO_BOOK.chapters){
  assert.ok(chapter.problem.length>40,chapter.id+' needs an everyday scene');
  assert.ok(chapter.objectives.length>=2,chapter.id);
  assert.ok(chapter.rule.natural.includes('WENN'),chapter.id);
  assert.ok(chapter.explain.length>=2,chapter.id);
  assert.ok(chapter.wordbank.length>=2,chapter.id);
  assert.ok(chapter.tryIt.length>30&&chapter.misconception.length>30&&chapter.solution.length>30,chapter.id);
  assert.ok(chapter.rule.pseudo.trim().length>5,chapter.id);
  assert.ok(chapter.sourceUrl.startsWith('https://'),chapter.id);
  if(chapter.code)assert.ok(chapter.code.split('\n').length<=8,chapter.id+' must stay short');
 }
});

test('Mini-Code ist echtes Go und enthält keine Java-API',()=>{
 for(const chapter of PIZZERIA_GO_BOOK.chapters){
  const code=chapter.code??'';
  for(const token of JAVA_ONLY)assert.ok(!code.includes(token),chapter.id+' contains '+token);
 }
 assert.match(getGoChapter('name-for-stock').code??'',/bestand := 3/);
 assert.match(getGoChapter('name-for-stock').code??'',/fmt\.Println\(bestand\)/);
 assert.match(getGoChapter('rain-rule').code??'',/if regnet \{/);
 assert.match(getGoChapter('rain-rule').code??'',/\} else \{/);
 assert.ok(!(getGoChapter('rain-rule').code??'').includes('if (regnet)'));
 assert.match(getGoChapter('guest-input').code??'',/fmt\.Scan\(&wunsch\)/);
 assert.match(getGoChapter('for-each-ingredient').code??'',/range zutaten/);
});

test('Go-Mittel werden fachlich korrekt und bewusst spät eingeführt',()=>{
 const index=(id:string):number=>PIZZERIA_GO_BOOK.chapters.findIndex(chapter=>chapter.id===id);
 assert.match(getGoChapter('ingredient-card').code??'',/type Zutat struct/);
 assert.match(getGoChapter('same-dough').code??'',/type Teig struct\{ mehl, wasser, salz, hefe int \}/);
 assert.match(getGoChapter('two-equal-doughs').code??'',/a == b/);
 assert.match(getGoChapter('ingredient-box').code??'',/type Box\[T any\]/);
 assert.match(getGoChapter('many-kinds').code??'',/type Box\[T Belag\]/);
 assert.match(getGoChapter('chef-and-apprentice').code??'',/type Azubi struct\{ Chef \}/);
 assert.match(getGoChapter('salami-gone').code??'',/menge, ok := regal\["Salami"\]/);
 assert.match(getGoChapter('polite-error').code??'',/func bestellen\(bestand int\) error/);
 assert.match(getGoChapter('polite-error').code??'',/fmt\.Errorf/);
 assert.match(getGoChapter('first-junit').code??'',/func TestRabatt\(t \*testing\.T\)/);
 assert.match(getGoChapter('first-http').code??'',/http\.HandleFunc/);
 assert.match(getGoChapter('shelf').code??'',/interface \{/);
 assert.ok(index('ingredient-card')>=10);
 assert.ok(index('ingredient-box')>=14);
 assert.ok(index('first-junit')>=27);
 assert.ok(index('pizzeria-api')===36);
});

test('Go-Buch ist eigenständig und weist manipulationsversuche zurück',()=>{
 assert.notEqual(PIZZERIA_GO_BOOK,PIZZERIA_BOOK);
 assert.throws(()=>getGoChapter('gibt-es-nicht'),/Unbekanntes Go-Einsteigerkapitel/);
 const rain=getGoChapter('rain-rule');
 assert.ok(validateGoBook({...PIZZERIA_GO_BOOK,chapters:[{...rain,rule:{natural:'',pseudo:''}}]}).length>0);
 assert.ok(validateGoBook({...PIZZERIA_GO_BOOK,chapters:[{...rain,explain:[],wordbank:[],sourceUrl:'http://example.org'}]}).length>0);
 assert.ok(validateGoBook({...PIZZERIA_GO_BOOK,chapters:[{...rain,sourceUrl:'http://example.org'}]}).length>0);
 assert.ok(validateGoBook({...PIZZERIA_GO_BOOK,chapters:[{...rain,code:'fmt.Println(1);\nSystem.out.println(2);'}]}).length>0);
});
