import test from 'node:test';
import assert from 'node:assert/strict';
import {PIZZERIA_BOOK,getBeginnerChapter,validateBeginnerBook} from '../src/content/pizzeria-book.ts';

test('der Fahrplan ist vollständig, altersgerecht und quellenbelegt',()=>{
 assert.deepEqual(validateBeginnerBook(),[]);
 assert.equal(PIZZERIA_BOOK.chapters.length,37);
 assert.equal(PIZZERIA_BOOK.stages.length,11);
 assert.equal(PIZZERIA_BOOK.chapters[0].id,'first-guest');
 assert.equal(PIZZERIA_BOOK.chapters[36].id,'pizzeria-api');
 for(const chapter of PIZZERIA_BOOK.chapters){
  assert.ok(chapter.problem.length>40,chapter.id+' needs a real-life scene');
  assert.ok(chapter.objectives.length>=2,chapter.id);
  assert.ok(chapter.rule.natural.includes('WENN'),chapter.id+' needs the natural rule');
  assert.ok(chapter.minutes<=15,chapter.id);
 }
});

test('die ersten vier Kapitel sind vollständig ausgeformuliert',()=>{
 for(const id of ['first-guest','name-for-stock','rain-rule','enough-salami']){
  const chapter=getBeginnerChapter(id);
  assert.ok(chapter.explain.length>=2,id);
  assert.ok(chapter.wordbank.length>=2,id);
  assert.ok(chapter.tryIt.length>30&&chapter.misconception.length>30&&chapter.solution.length>30,id);
  assert.ok(chapter.rule.pseudo.trim().length>10,id);
  if(chapter.code)assert.ok(chapter.code.split('\n').length<=8,id+' must stay short');
 }
 const rain=getBeginnerChapter('rain-rule');
 assert.match(rain.rule.natural,/WENN es regnet/);
 assert.match(rain.code??'',/boolean regnet/);
});

test('Records und Generics stehen bewusst spät im Fahrplan',()=>{
 const index=(id:string):number=>PIZZERIA_BOOK.chapters.findIndex(chapter=>chapter.id===id);
 assert.ok(index('same-dough')>=12);
 assert.ok(index('ingredient-box')>=14);
 assert.ok(index('restaurant-leader')>=32);
 assert.ok(index('pizzeria-api')===36);
});

test('manipulierte Kapitel scheitern an den Qualitätsregeln',()=>{
 const chapter=getBeginnerChapter('rain-rule');
 assert.ok(validateBeginnerBook({...PIZZERIA_BOOK,chapters:[{...chapter,rule:{natural:'',pseudo:''}}]}).length>0);
 assert.ok(validateBeginnerBook({...PIZZERIA_BOOK,chapters:[{...chapter,explain:[],wordbank:[],sourceUrl:'http://example.org'}]}).length>0);
 assert.ok(validateBeginnerBook({...PIZZERIA_BOOK,chapters:[{...chapter,code:'a();\nb();\nc();\nd();\ne();\nf();\ng();\nh();\ni();'}]}).length>0);
 assert.ok(validateBeginnerBook({...PIZZERIA_BOOK,chapters:[{...chapter,conceptIds:['does-not-exist']}]}).length>0);
});
