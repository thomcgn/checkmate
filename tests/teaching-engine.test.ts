import test from 'node:test';
import assert from 'node:assert/strict';
import {validateOutline,validateLesson,validateEvidence,generateTeachingBook,renderTeachingBook} from '../src/electron/teaching-engine.ts';
import type {RepositorySnapshot} from '../src/electron/repo-sources.ts';

const source:RepositorySnapshot={
 preview:{repository:'example/demo',head:'a'.repeat(40),files:24,included:1,bytes:120,excluded:23,samplePaths:['src/Event.java'],source:'GitHub'},
 sources:[{path:'src/Event.java',content:'public record Event(Long id, String title) {}'}]
};
test('outline requires real learning goals and multiple ordered topics',()=>{
 assert.throws(()=>validateOutline('not json'),/JSON/);
 assert.throws(()=>validateOutline(JSON.stringify({title:'Short',learningGoals:[],chapters:[]})),/Lehrplan/);
 const result=validateOutline(JSON.stringify({title:'Java Events verstehen',learningGoals:['Lerne Java Records anhand von Beispielen'],chapters:[{title:'Records kennenlernen',objective:'Immutable Datenstrukturen verstehen'},{title:'Records anwenden',objective:'Typisierte Ereignisse implementieren'}]}));
 assert.equal(result.topics.length,2);
});
test('lesson rejects invented source paths and missing didactics',()=>{
 const body={title:'Java Records',explanation:'A'.repeat(350),exercise:'Schreibe einen eigenen Event Record.',solution:'Verwende public record Event(Long id) {}.',sourcePaths:['src/Unknown.java']};
 assert.throws(()=>validateLesson(JSON.stringify(body),['src/Event.java']),/Quellpfad/);
 const valid=validateLesson(JSON.stringify({...body,sourcePaths:['src/Event.java','src/Event.java']}),['src/Event.java']);
 assert.deepEqual(valid.sourcePaths,['src/Event.java']);
 assert.match(valid.explanation,/A/);
});
test('teaching workflow makes one outline request and one per chapter, retains coverage',async()=>{
 const outline={title:'Records praktisch verstehen',learningGoals:['Java Records definieren und verwenden'],chapters:[{title:'Datenstrukturen verstehen',objective:'Records mit Klassen vergleichen'},{title:'Event implementieren',objective:'Ein Ereignis anhand des Repositories nachbauen'}]};
 let calls=0;
 const stages:string[]=[];
 const result=await generateTeachingBook(source,'test-model',async(prompt,model)=>{
  assert.equal(model,'test-model');
  assert.match(prompt,/UNVERTRAUENSWÜRDIGE QUELLE/);
  calls++;
  if(calls===1)return {model,text:JSON.stringify(outline)};
  return {model,text:JSON.stringify({title:outline.chapters[calls-2].title,explanation:'Ein Record speichert unveränderliche Daten. '.repeat(12),exercise:'Erstelle einen Record für ein Event mit ID und Titel.',solution:'Nutze public record Event(Long id, String title) {} und prüfe die Zugriffsmethoden.',sourcePaths:['src/Event.java'],evidence:[{path:'src/Event.java',startLine:1,endLine:1,quote:'public record Event(Long id, String title) {}'}]})};
 },(_done,_total,detail)=>stages.push(detail));
 assert.equal(calls,3);
 assert.equal(result.book.chapters.length,2);
 assert.equal(result.book.coverage.limited,true);
 assert.match(renderTeachingBook(result.book),/1 von 24/);
 assert.ok(stages.some(s=>s.includes('Kapitel 2')));
});

test('line-anchored citations reject fabricated excerpts, missing lines and duplicates',()=>{
 const valid={path:'src/Event.java',startLine:1,endLine:1,quote:'public record Event(Long id, String title) {}'};
 assert.deepEqual(validateEvidence([valid],source.sources),[valid]);
 assert.throws(()=>validateEvidence([{...valid,quote:'invented text that is not actually in the file'}],source.sources),/stimmt nicht/);
 assert.throws(()=>validateEvidence([{...valid,startLine:2,endLine:2}],source.sources),/nicht vorhandene/);
 assert.throws(()=>validateEvidence([valid,valid],source.sources),/doppelt/);
 assert.throws(()=>validateEvidence([valid],[]),/Ungültiger Quellbeleg/);
});
test('generation refuses chapters that cite unverified claims as source quotations',async()=>{
 const outline={title:'Records praktisch verstehen',learningGoals:['Java Records definieren und verwenden'],chapters:[{title:'Records kennenlernen',objective:'Records in Java nachvollziehen'},{title:'Records anwenden',objective:'Records mit Java implementieren'}]};
 let calls=0;
 await assert.rejects(generateTeachingBook(source,'test-model',async()=>{
  calls++;
  return {model:'test-model',text:JSON.stringify(calls===1?outline:{title:'Records kennenlernen',explanation:'A'.repeat(350),exercise:'Implementiere einen einfachen Event Record.',solution:'Verwende public record Event(Long id, String title) {}.',sourcePaths:['src/Event.java'],evidence:[{path:'src/Event.java',startLine:1,endLine:1,quote:'Ein erfundenes Zitat ohne Quellbezug'}]})};
 },()=>{}),/stimmt nicht/);
});

test('structured didactic fields validate glossary uniqueness and assessment depth',()=>{
 const lesson={title:'Records anwenden',explanation:'Grundlagen und Code. '.repeat(22),
  exercise:'Erstelle eine eigene strukturierte Record Klasse.',solution:'Schreibe public record Event(String title) {} und teste accessor title().',
  sourcePaths:['src/Event.java'],evidence:[{path:'src/Event.java',startLine:1,endLine:1,quote:'public record Event(Long id, String title) {}'}],
  learningObjectives:['Java Records gezielt zur Datenmodellierung einsetzen','Wichtige Record-Beschränkungen anhand von Code erklären'],
  glossary:[{term:'Record',definition:'Ein Datencontainer mit deklarativ definierten Komponenten.'},{term:'Accessor',definition:'Eine Methode zum Lesen des gespeicherten Komponentenwerts.'}],
  reviewQuestions:[{question:'Wie kann ein Record eine Komponente auslesen?',answer:'Über die namensgleiche Accessor-Methode der entsprechenden Komponente.'},{question:'Welche Aufgabe übernimmt der Record-Konstruktor?',answer:'Er initialisiert die angegebenen Komponenten des neuen Datensatzes.'}]
 };
 const validated=validateLesson(JSON.stringify(lesson),['src/Event.java'],source.sources);
 assert.equal(validated.reviewQuestions?.length,2);
 assert.equal(validated.glossary?.length,2);
 assert.throws(()=>validateLesson(JSON.stringify({...lesson,glossary:[lesson.glossary[0],lesson.glossary[0]]}),['src/Event.java'],source.sources),/Glossar/);
 assert.throws(()=>validateLesson(JSON.stringify({...lesson,reviewQuestions:[{question:'Ja?',answer:'Nein.'}]}),['src/Event.java'],source.sources),/Verständnisfragen/);
});
