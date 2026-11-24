import test from 'node:test';
import assert from 'node:assert/strict';
import {PIZZERIA_BOOK} from '../src/content/pizzeria-book.ts';
import {PIZZERIA_TYPESCRIPT_BOOK,getTypeScriptChapter,validateTypeScriptBook} from '../src/content/pizzeria-typescript-book.ts';
import {PIZZERIA_TYPESCRIPT_LESSONS} from '../src/content/pizzeria-typescript-lessons.ts';

test('der TypeScript-Fahrplan hat dieselben 37 Kapitel und Stufen wie das Java-Buch',()=>{
 assert.deepEqual(validateTypeScriptBook(),[]);
 assert.equal(PIZZERIA_TYPESCRIPT_BOOK.chapters.length,37);
 assert.equal(PIZZERIA_TYPESCRIPT_BOOK.stages.length,11);
 assert.deepEqual(PIZZERIA_TYPESCRIPT_BOOK.chapters.map(chapter=>chapter.id),
  PIZZERIA_BOOK.chapters.map(chapter=>chapter.id));
 assert.deepEqual(PIZZERIA_TYPESCRIPT_BOOK.stages.map(stage=>stage.id),
  PIZZERIA_BOOK.stages.map(stage=>stage.id));
 assert.equal(PIZZERIA_TYPESCRIPT_BOOK.chapters[0].id,'first-guest');
 assert.equal(PIZZERIA_TYPESCRIPT_BOOK.chapters[36].id,'pizzeria-api');
 assert.equal(PIZZERIA_TYPESCRIPT_LESSONS.length,33);
 for(const chapter of PIZZERIA_TYPESCRIPT_BOOK.chapters){
  assert.ok(chapter.problem.length>40,chapter.id+' needs a real-life scene');
  assert.ok(chapter.objectives.length>=2,chapter.id);
  assert.ok(chapter.rule.natural.includes('WENN'),chapter.id+' needs the natural rule');
  assert.ok(chapter.rule.pseudo.trim().length>5,chapter.id);
  assert.ok(chapter.minutes>=5&&chapter.minutes<=15,chapter.id);
  assert.ok(chapter.sourceUrl.startsWith('https://'),chapter.id);
 }
});

test('alle 37 Kapitel sind vollstaendig ausgeformuliert',()=>{
 for(const chapter of PIZZERIA_TYPESCRIPT_BOOK.chapters){
  assert.ok(chapter.explain.length>=2,chapter.id);
  assert.ok(chapter.wordbank.length>=2,chapter.id);
  assert.ok(chapter.tryIt.length>30&&chapter.misconception.length>30&&chapter.solution.length>30,chapter.id);
  if(chapter.code)assert.ok(chapter.code.split('\n').length<=8,chapter.id+' must stay short');
 }
 const rain=getTypeScriptChapter('rain-rule');
 assert.match(rain.rule.natural,/WENN es regnet/);
 assert.match(rain.code??'',/const regnet: boolean = true/);
 assert.match(rain.code??'',/console\.log/);
});

test('die Java-Konzepte sind fachlich sauber nach TypeScript uebersetzt',()=>{
 const code=(id:string):string=>getTypeScriptChapter(id).code??'';
 assert.match(code('name-for-stock'),/let bestand: number = 3/);
 assert.match(code('ingredient-card'),/interface Zutat/);
 assert.match(code('same-dough'),/readonly/);
 assert.match(code('two-equal-doughs'),/a\.mehl === b\.mehl/);
 assert.match(code('ingredient-box'),/interface Box<T>/);
 assert.match(code('many-kinds'),/T extends Belag/);
 assert.match(code('salami-gone'),/string \| null/);
 assert.match(code('salami-gone'),/\?\?/);
 assert.match(code('polite-error'),/new Error/);
 assert.match(code('first-junit'),/node:test/);
 assert.match(code('label-shelf'),/new Map<string, number>/);
 assert.match(code('sum-prices'),/reduce\(/);
 assert.match(code('first-http'),/res\.json/);
 const all=PIZZERIA_TYPESCRIPT_BOOK.chapters.map(chapter=>JSON.stringify(chapter)).join('\n');
 for(const javaism of ['System.out','public static void','mvn ','@RestController','JpaRepository','Optional<'])
  assert.ok(!all.includes(javaism),'no Java API should remain: '+javaism);
});

test('Generics, readonly und Tests stehen bewusst spaet im Fahrplan',()=>{
 const index=(id:string):number=>PIZZERIA_TYPESCRIPT_BOOK.chapters.findIndex(chapter=>chapter.id===id);
 assert.ok(index('same-dough')>=12);
 assert.ok(index('ingredient-box')>=14);
 assert.ok(index('first-junit')>=26);
 assert.ok(index('restaurant-leader')>=32);
 assert.ok(index('pizzeria-api')===36);
});

test('manipulierte Kapitel scheitern an den Qualitätsregeln',()=>{
 const chapter=getTypeScriptChapter('rain-rule');
 assert.ok(validateTypeScriptBook({...PIZZERIA_TYPESCRIPT_BOOK,chapters:[{...chapter,rule:{natural:'',pseudo:''}}]}).length>0);
 assert.ok(validateTypeScriptBook({...PIZZERIA_TYPESCRIPT_BOOK,chapters:[{...chapter,explain:[],wordbank:[],sourceUrl:'http://example.org'}]}).length>0);
 assert.ok(validateTypeScriptBook({...PIZZERIA_TYPESCRIPT_BOOK,chapters:[{...chapter,code:'a();\nb();\nc();\nd();\ne();\nf();\ng();\nh();\ni();'}]}).length>0);
 assert.ok(validateTypeScriptBook({...PIZZERIA_TYPESCRIPT_BOOK,chapters:[{...chapter,conceptIds:['does-not-exist']}]}).length>0);
 assert.throws(()=>getTypeScriptChapter('gibt-es-nicht'),/Unbekanntes TypeScript-Einsteigerkapitel/);
});
