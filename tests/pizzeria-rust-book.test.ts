import test from 'node:test';
import assert from 'node:assert/strict';
import {PIZZERIA_BOOK} from '../src/content/pizzeria-book.ts';
import {PIZZERIA_RUST_BOOK,getRustBeginnerChapter,validateRustBeginnerBook} from '../src/content/pizzeria-rust-book.ts';

const JAVA_TOKENS=/System\.out|public class|new Scanner|@RestController|@SpringBootApplication|mvn |throw new|Optional<|IllegalArgumentException|JpaRepository|extends Chef/;

test('Rust-Band 1 spiegelt Fahrplan und Stufen der Java-Fassung',()=>{
 assert.deepEqual(validateRustBeginnerBook(),[]);
 assert.equal(PIZZERIA_RUST_BOOK.chapters.length,37);
 assert.equal(PIZZERIA_RUST_BOOK.stages.length,11);
 assert.deepEqual(PIZZERIA_RUST_BOOK.stages.map(stage=>stage.id),PIZZERIA_BOOK.stages.map(stage=>stage.id));
 assert.deepEqual(PIZZERIA_RUST_BOOK.chapters.map(chapter=>chapter.id),PIZZERIA_BOOK.chapters.map(chapter=>chapter.id));
 assert.deepEqual(PIZZERIA_RUST_BOOK.chapters.map(chapter=>chapter.minutes),PIZZERIA_BOOK.chapters.map(chapter=>chapter.minutes));
 assert.deepEqual(PIZZERIA_RUST_BOOK.chapters.map(chapter=>chapter.conceptIds),PIZZERIA_BOOK.chapters.map(chapter=>chapter.conceptIds));
 assert.equal(PIZZERIA_RUST_BOOK.chapters[0].id,'first-guest');
 assert.equal(PIZZERIA_RUST_BOOK.chapters[36].id,'pizzeria-api');
 for(const chapter of PIZZERIA_RUST_BOOK.chapters){
  assert.ok(chapter.problem.length>40,chapter.id+' needs a real-life scene');
  assert.ok(chapter.objectives.length>=2,chapter.id);
  assert.ok(chapter.rule.natural.includes('WENN'),chapter.id+' needs the natural rule');
  assert.ok(chapter.rule.pseudo.trim().length>5,chapter.id);
  assert.ok(chapter.minutes<=15,chapter.id);
  assert.ok(chapter.sourceUrl.startsWith('https://'),chapter.id);
 }
});

test('alle 37 Rust-Kapitel sind vollständig und kurz genug ausgeformuliert',()=>{
 for(const chapter of PIZZERIA_RUST_BOOK.chapters){
  assert.ok(chapter.explain.length>=2,chapter.id);
  assert.ok(chapter.wordbank.length>=2,chapter.id);
  assert.ok(chapter.tryIt.length>30&&chapter.misconception.length>30&&chapter.solution.length>30,chapter.id);
  if(chapter.code){
   assert.ok(chapter.code.split('\n').length<=8,chapter.id+' must stay short');
   assert.doesNotMatch(chapter.code,JAVA_TOKENS,chapter.id+' still uses Java syntax');
  }
  for(const paragraph of chapter.explain)assert.doesNotMatch(paragraph,JAVA_TOKENS,chapter.id);
 }
 const rain=getRustBeginnerChapter('rain-rule');
 assert.match(rain.rule.natural,/WENN es regnet/);
 assert.match(rain.code??'',/if regnet \{/);
 assert.match(rain.output??'',/Schirm nehmen/);
});

test('Fachbegriffe sind nach Rust übersetzt – ohne erfundene Java-Reste',()=>{
 const code=(id:string):string=>getRustBeginnerChapter(id).code??'';
 assert.match(code('name-for-stock'),/let bestand: i32 = 3;/);
 assert.match(code('rain-rule'),/println!/);
 assert.match(code('enough-salami'),/bestand >= gewuenscht/);
 assert.match(code('guest-input'),/std::io/);
 assert.match(code('for-each-ingredient'),/for zutat in zutaten/);
 assert.match(code('count-along'),/let mut zaehler/);
 assert.match(code('ingredient-card'),/#\[derive\(Debug, Clone, PartialEq, Eq\)\]/);
 assert.match(code('ingredient-card'),/struct Zutat/);
 assert.match(code('same-dough'),/struct Teig/);
 assert.match(code('two-equal-doughs'),/a == b/);
 assert.match(code('ingredient-box'),/struct Kiste<T>/);
 assert.match(code('many-kinds'),/T: Belag/);
 assert.match(code('chef-and-apprentice'),/impl Backen for/);
 assert.match(code('label-shelf'),/HashMap::new\(\)/);
 assert.match(getRustBeginnerChapter('label-shelf').output??'',/Some\(3\)/);
 assert.match(code('no-duplicates'),/HashSet::new\(\)/);
 assert.match(code('sum-prices'),/\.iter\(\)\.copied\(\)\.sum\(\)/);
 assert.match(code('rule-lambda'),/\|preis: i32\|/);
 assert.match(code('salami-gone'),/Option<&str>/);
 assert.match(code('polite-error'),/Result<\(\), String>/);
 assert.match(code('first-junit'),/#\[test\]/);
 assert.match(code('project-order'),/edition = "2024"/);
 assert.match(code('first-http'),/axum::/);
 assert.match(code('restaurant-leader'),/with_state\(state\)/);
 assert.match(code('pizzeria-api'),/Json<Antwort>/);
});

test('Records, Traits und Web-Schichten stehen bewusst spät im Fahrplan',()=>{
 const index=(id:string):number=>PIZZERIA_RUST_BOOK.chapters.findIndex(chapter=>chapter.id===id);
 assert.ok(index('same-dough')>=12);
 assert.ok(index('ingredient-box')>=14);
 assert.ok(index('many-kinds')>=16);
 assert.ok(index('restaurant-leader')>=32);
 assert.ok(index('pizzeria-api')===36);
});

test('manipulierte Kapitel scheitern an den Qualitätsregeln',()=>{
 const chapter=getRustBeginnerChapter('rain-rule');
 assert.ok(validateRustBeginnerBook({...PIZZERIA_RUST_BOOK,chapters:[{...chapter,rule:{natural:'',pseudo:''}}]}).length>0);
 assert.ok(validateRustBeginnerBook({...PIZZERIA_RUST_BOOK,chapters:[{...chapter,explain:[],wordbank:[],sourceUrl:'http://example.org'}]}).length>0);
 assert.ok(validateRustBeginnerBook({...PIZZERIA_RUST_BOOK,chapters:[{...chapter,code:'a();\nb();\nc();\nd();\ne();\nf();\ng();\nh();\ni();'}]}).length>0);
 assert.ok(validateRustBeginnerBook({...PIZZERIA_RUST_BOOK,chapters:[{...chapter,conceptIds:['does-not-exist']}]}).length>0);
 assert.throws(()=>getRustBeginnerChapter('gibt-es-nicht'),/Unbekanntes Rust-Einsteigerkapitel/);
});
