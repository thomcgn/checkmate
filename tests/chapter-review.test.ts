import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewChapter,validateChapterReview} from '../src/electron/chapter-review.ts';
import type {LessonSection} from '../src/shared/repository.ts';
const source=[{path:'src/records.md',startLine:1,text:'# Records\nA record declares immutable data components.\nAccessors return the corresponding component value.'}];
const chapter:LessonSection={
 title:'Records nutzen',
 explanation:'## Grundlagen\nA record declares immutable data components.\n## Beispiel\nRecord als benannter Wert nutzen.\n## Grenzen\nEin Record löst nicht jede Aufgabe.',
 exercise:'Erstelle einen eigenen Record und erkläre die Zugriffsmethode.',
 solution:'Definiere einen Record und rufe die namensgleiche Accessor-Methode auf.',
 sourcePaths:['src/records.md']
};
const evidence={claim:'A record declares immutable data components.',path:'src/records.md',quote:'A record declares immutable data components.'};
test('source-grounded review validates a literal chapter claim and its original quote',()=>{
 const review=validateChapterReview(JSON.stringify({verdict:'pass',findings:[],claims:[evidence]}),chapter,source);
 assert.equal(review.verdict,'pass');
 assert.equal(review.claims.length,1);
});
test('review fails closed for unsupported approvals and invented citations',()=>{
 assert.throws(()=>validateChapterReview(JSON.stringify({verdict:'pass',findings:[],claims:[]}),chapter,source),/keine belastbare Freigabe/);
 assert.throws(()=>validateChapterReview(JSON.stringify({verdict:'pass',findings:[],claims:[{...evidence,quote:'A fictional declaration that is not sourced.'}]}),chapter,source),/nicht.*nachweisbar/);
 assert.throws(()=>validateChapterReview(JSON.stringify({verdict:'pass',findings:[],claims:[{...evidence,claim:'A claim that does not occur in the chapter.'}]}),chapter,source),/nicht.*nachweisbar/);
 assert.throws(()=>validateChapterReview(JSON.stringify({verdict:'pass',findings:[{severity:'major',description:'Die Ausführung ist fachlich widersprüchlich.'}],claims:[evidence]}),chapter,source),/keine belastbare Freigabe/);
 assert.throws(()=>validateChapterReview(JSON.stringify({verdict:'fail',findings:[],claims:[]}),chapter,source),/konkreten Review-Befund/);
});
test('a failed reviewer blocks publication and exposes a concrete finding',async()=>{
 let calls=0;
 await assert.rejects(reviewChapter(chapter,source,'review-model',async prompt=>{
  calls++;
  assert.ok(prompt.includes('KAPITEL-REVIEW:'));
  return {model:'review-model',text:JSON.stringify({
   verdict:'fail',findings:[{severity:'critical',description:'Beispiel behauptet ungültige Record-Syntax.'}],claims:[]
  })};
 }),/Fachreview.*abgelehnt/);
 assert.equal(calls,1);
});
