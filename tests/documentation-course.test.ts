import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {splitDocument,planDocumentationCourse,courseFingerprint,generateDocumentationCourse,createCourseVolumes,validateCourseLesson,DocumentationCourseStore} from '../src/electron/documentation-course.ts';
import {OFFICIAL_PACKS,type DocumentView,type InstalledDocumentPack} from '../src/shared/documentation.ts';
import {buildCurriculum,curriculumOrder} from '../src/electron/curriculum.ts';
import {assertFreeDocumentationLicense} from '../src/electron/documentation-license.ts';

const pack:InstalledDocumentPack={
 id:'python-manual',language:'python',title:'Python Documentation',sourceCommit:'a'.repeat(40),
 sourceUrl:OFFICIAL_PACKS.find(p=>p.id==='python-manual')!.sourceUrl,
 license:OFFICIAL_PACKS.find(p=>p.id==='python-manual')!.license,
 licenseUrl:OFFICIAL_PACKS.find(p=>p.id==='python-manual')!.licenseUrl,
 installedAt:'2026-11-24T00:00:00Z',extent:'all',assets:[],
 documents:[
 {path:'guide/basics.md',title:'Basics',bytes:150,sha256:'a'.repeat(64),text:true},
 {path:'guide/collections.md',title:'Collections',bytes:100,sha256:'b'.repeat(64),text:true},
 {path:'guide/functions.md',title:'Functions',bytes:100,sha256:'c'.repeat(64),text:true}
 ]
};
const contents=new Map<string,string>([
 ['guide/basics.md','# Basics\nPython variables are assigned with equals.\n'+('foo = 1\n'.repeat(750))],
 ['guide/collections.md','# Collections\nA list is an ordered collection of values.\n'+('xs = [1,2]\n'.repeat(750))],
 ['guide/functions.md','# Functions\nA function is defined with def.\n'+('def f(): return 1\n'.repeat(700))]
]);
const read=async(p:string):Promise<DocumentView>=>({path:p,title:p,text:contents.get(p)??''});
test('splitting and planning covers every original document character, without a silent sample',async()=>{
 const visited:string[]=[];
 const original=new Map<string,string>();
 const plan=await planDocumentationCourse(pack,async p=>{visited.push(p);const d=await read(p);original.set(p,d.text);return d;});
 assert.deepEqual(visited,pack.documents.map(d=>d.path));
 assert.equal(plan.documents,3);
 assert.equal(plan.characters,[...original.values()].reduce((sum,s)=>sum+s.length,0));
 const fragments=plan.units.flatMap(u=>u.fragments);
 for(const [p,text] of original){
  const parts=fragments.filter(x=>x.path===p);
  assert.ok(parts.length>0);
  assert.equal(parts.map(x=>x.text).join('\n'),text);
 }
 assert.ok(plan.units.every(u=>new Set(u.fragments.map(f=>f.path)).size===u.fragments.length));
 assert.notEqual(courseFingerprint(plan,'model-a'),courseFingerprint(plan,'model-b'));
});
test('splitting preserves long multiline documents and single very long source lines',()=>{
 const input={path:'sample.txt',title:'Sample',text:Array.from({length:30},(_,i)=>'line'+i+' '.repeat(30)).join('\n')};
 const fragments=splitDocument(input,120);
 assert.ok(fragments.length>1);
 assert.equal(fragments.map(x=>x.text).join('\n'),input.text);
 const huge={path:'giant',title:'Giant',text:'header\n'+'X'.repeat(510)+'\nfooter'};
 const sections=splitDocument(huge,120);
 assert.ok(sections.some(x=>x.continuation));
 const reconstructed=sections.map((x,i)=>(i===0||x.continuation?'':'\n')+x.text).join('');
 assert.equal(reconstructed,huge.text);
});
test('all units become checked textbook chapters with persistent resume',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'checkmate-course-test-'));
 try{
  const plan=await planDocumentationCourse(pack,read);
  const store=new DocumentationCourseStore(root);
  let calls=0;
  const generate=async(prompt:string,model:string):Promise<{text:string;model:string}>=>{
   calls++;
   const matches=[...prompt.matchAll(/NICHT VERTRAUENSWÜRDIGE DOKUMENTATION "([^"]+)" \(\d+ ff\.\)\n1 \| [^\n]+\n2 \| ([^\n]+)/g)];
   assert.ok(matches.length>0);
   const evidence=matches.map(match=>({path:match[1],startLine:2,endLine:2,quote:match[2]}));
   return {model,text:JSON.stringify({title:'Ein nachvollziehbares Programmierkonzept',
    explanation:'## Grundlagen\nEin wichtiges Konzept. '.repeat(12)+'\n## Schritt für Schritt\n'+('Wir untersuchen den Ablauf im Code und begründen die Wirkung. '.repeat(10))+'\n## Typische Fehler und Grenzen\n'+('Fehler erkennen und Einschränkungen einschätzen. '.repeat(10)),
    exercise:'Baue selbst ein Beispiel und erkläre die einzelnen Schritte.',
    solution:'Beginne mit einem kleinen Ausdruck und prüfe die Ausgabe.',
    sourcePaths:matches.map(match=>match[1]),evidence,
    learningObjectives:['Das Konzept anhand des Quellenmaterials erläutern','Die verwendete Syntax in einem eigenen Beispiel anwenden'],
    glossary:[{term:'Variable',definition:'Ein benannter Speicherort oder eine Referenz auf einen Wert.'},{term:'Funktion',definition:'Eine wiederverwendbare Einheit von Anweisungen mit optionalem Ergebnis.'}],
    reviewQuestions:[{question:'Welche Funktion hat die dargestellte Syntax im Quellbeispiel?',answer:'Sie beschreibt die Auswertung eines Ausdrucks innerhalb des Programms.'},{question:'Wie lässt sich der dargestellte Ansatz überprüfen?',answer:'Durch eine eigene kleine Implementierung mit überprüfbarer Ausgabe.'}]})};
  };
  await assert.rejects(generateDocumentationCourse(plan,'model-a',async(prompt,model)=>{
   if(calls>=1)throw Error('Netzwerk unterbrochen');
   return generate(prompt,model);
  },store,()=>{}),/Netzwerk unterbrochen/);
  const initialCalls=calls;
  const finished=await generateDocumentationCourse(plan,'model-a',generate,store,()=>{});
  assert.equal(finished.lessons.length,plan.units.length);
  assert.equal(calls-initialCalls,plan.units.length-1);
  assert.equal((await store.read(finished.fingerprint,0))?.title,'Ein nachvollziehbares Programmierkonzept');
  const books=createCourseVolumes(pack,plan,finished.lessons,finished.fingerprint,'model-a');
  assert.ok(books.length>=1);
  assert.ok(books.every((b,i)=>b.teachingBook?.series?.volume===i+1&&b.teachingBook.series.complete));
  assert.ok(books.every(b=>b.markdown.includes('### Glossar')&&b.markdown.includes('### Selbstkontrolle')));
  assert.ok(books.every(b=>b.markdown.includes('vollständigen Dokumentationspaket')&&!b.markdown.includes('Begrenzte Stichprobe')));
  assert.equal(books.reduce((sum,b)=>sum+b.teachingBook!.chapters.length,0),plan.units.length);
  assert.deepEqual([...new Set(books.flatMap(b=>b.includedPaths))].sort(),pack.documents.map(d=>d.path).sort());
  await store.remove(finished.fingerprint);
  assert.equal(await store.read(finished.fingerprint,0),null);
 }finally{await rm(root,{recursive:true,force:true});}
});

test('curriculum is globally organized by learning prerequisites, not filesystem ordering',()=>{
 const topics=[
  {title:'Concurrency and parallel performance',fragments:[{path:'advanced/async.md'}]},
  {title:'Testing a web application',fragments:[{path:'practical/testing.md'}]},
  {title:'Installing Python and getting started',fragments:[{path:'intro/setup.md'}]},
  {title:'Collections and functions',fragments:[{path:'language/functions.md'}]},
  {title:'API reference details',fragments:[{path:'api/unknown.md'}]}
 ];
 const curriculum=buildCurriculum(topics);
 const order=curriculumOrder(curriculum);
 assert.equal(order.length,topics.length);
 assert.deepEqual(new Set(order),new Set([0,1,2,3,4]));
 assert.equal(curriculum.parts[0].stage,'foundations');
 assert.equal(curriculum.units[order[0]].index,2);
 assert.ok(curriculum.parts.find(p=>p.stage==='language')?.unitIndices.includes(3));
 assert.ok(curriculum.parts.find(p=>p.stage==='application')?.unitIndices.includes(1));
 assert.ok(curriculum.parts.find(p=>p.stage==='advanced')?.unitIndices.includes(0));
 assert.equal(curriculum.coveredUnits,5);
});
test('license gate accepts official freely licensed sources, rejects restricted or ambiguous processing',()=>{
 assert.equal(assertFreeDocumentationLicense(pack).recognized,true);
 const restricted=OFFICIAL_PACKS.find(p=>p.id==='cpp-guidelines')!;
 const blocked={...pack,id:restricted.id,sourceUrl:restricted.sourceUrl,licenseUrl:restricted.licenseUrl,license:restricted.license};
 assert.throws(()=>assertFreeDocumentationLicense(blocked),/nicht.*freigegeben/);
 const unknown={...pack,license:'All rights reserved'};
 assert.throws(()=>assertFreeDocumentationLicense(unknown),/nicht verifiziert/);
 const mdn=OFFICIAL_PACKS.find(p=>p.id==='javascript-mdn')!;
 assert.throws(()=>assertFreeDocumentationLicense({...pack,id:mdn.id,license:mdn.license,
  sourceUrl:mdn.sourceUrl,licenseUrl:mdn.licenseUrl}),/nicht.*freigegeben/);
});



test('each source grouped into a lesson must have its own exact quotation',()=>{
 const unit={title:'Introduction',fragments:[
  {path:'intro/variables.md',startLine:1,text:'# Variables\nvalue = 3 and is immutable here'},
  {path:'intro/functions.md',startLine:1,text:'# Functions\ndef calculate(): return 3'}
 ]};
 const base={title:'Programmieren lernen',explanation:'## Grundlagen\n'+('Variablen speichern Werte. '.repeat(15))+
  '\n## Schritt für Schritt\n'+('Einführung und eigenes Codebeispiel. '.repeat(20))+
  '\n## Typische Fehler\n'+('Nicht mit unveränderlichem Zustand verwechseln. '.repeat(15)),
  exercise:'Erstelle eine Funktion und verwende eine Variable im selben Programm.',
  solution:'Definiere eine Variable value = 3 und gib diesen Wert in calculate() zurück.',
  sourcePaths:['intro/variables.md','intro/functions.md']};
 const onlyOne={...base,evidence:[{path:'intro/variables.md',startLine:2,endLine:2,quote:'value = 3 and is immutable here'}]};
 assert.throws(()=>validateCourseLesson(JSON.stringify(onlyOne),unit),/nicht alle.*Originalquellen/);
 const complete={...base,evidence:[...onlyOne.evidence,{path:'intro/functions.md',startLine:2,endLine:2,quote:'def calculate(): return 3'}]};
 assert.equal(validateCourseLesson(JSON.stringify(complete),unit).evidence?.length,2);
});
test('the global planner limits grouped source count to the verification budget',async()=>{
 const many={...pack,documents:Array.from({length:19},(_,i)=>({
  path:'guide/part'+i+'.md',title:'Part '+i,bytes:100,sha256:'a'.repeat(64),text:true
 }))};
 const plan=await planDocumentationCourse(many,async p=>({path:p,title:p,text:'# '+p+'\nA documentation paragraph with important definitions.'}));
 assert.ok(plan.units.length>=3);
 assert.ok(plan.units.every(unit=>unit.fragments.length<=8));
 assert.equal(plan.units.flatMap(u=>u.fragments).length,19);
});
