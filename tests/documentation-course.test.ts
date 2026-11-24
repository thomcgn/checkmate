import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {splitDocument,planDocumentationCourse,courseFingerprint,generateDocumentationCourse,createCourseVolumes,DocumentationCourseStore} from '../src/electron/documentation-course.ts';
import type {DocumentView,InstalledDocumentPack} from '../src/shared/documentation.ts';

const pack:InstalledDocumentPack={
 id:'python-manual',language:'python',title:'Python Documentation',sourceCommit:'a'.repeat(40),
 sourceUrl:'https://example.org/docs',license:'PSF',licenseUrl:'https://example.org/license',
 installedAt:'2026-11-24T00:00:00Z',extent:'all',assets:[],
 documents:[
 {path:'guide/basics.md',title:'Basics',bytes:150,sha256:'a'.repeat(64),text:true},
 {path:'guide/collections.md',title:'Collections',bytes:100,sha256:'b'.repeat(64),text:true},
 {path:'guide/functions.md',title:'Functions',bytes:100,sha256:'c'.repeat(64),text:true}
 ]
};
const contents=new Map<string,string>([
 ['guide/basics.md','# Basics\nPython variables are assigned with equals.\n'+('foo = 1\n'.repeat(75))],
 ['guide/collections.md','# Collections\nA list is an ordered collection of values.\n'+('xs = [1,2]\n'.repeat(75))],
 ['guide/functions.md','# Functions\nA function is defined with def.\n'+('def f(): return 1\n'.repeat(90))]
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
test('splitting preserves long multiline documents and refuses unsplittable giant lines',()=>{
 const input={path:'sample.txt',title:'Sample',text:Array.from({length:30},(_,i)=>'line'+i+' '.repeat(30)).join('\n')};
 const fragments=splitDocument(input,120);
 assert.ok(fragments.length>1);
 assert.equal(fragments.map(x=>x.text).join('\n'),input.text);
 assert.throws(()=>splitDocument({path:'giant',title:'giant',text:'X'.repeat(130)},120),/einzelne Zeile/);
});
test('all units become checked textbook chapters with persistent resume',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'checkmate-course-test-'));
 try{
  const plan=await planDocumentationCourse(pack,read);
  const store=new DocumentationCourseStore(root);
  let calls=0;
  const generate=async(prompt:string,model:string):Promise<{text:string;model:string}>=>{
   calls++;
   const match=/NICHT VERTRAUENSWÜRDIGE DOKUMENTATION "([^"]+)" \\(\\d+ ff\\.\\)\\n1 \\| [^\\n]+\\n2 \\| ([^\\n]+)/.exec(prompt);
   assert.ok(match);
   const evidence={path:match[1],startLine:2,endLine:2,quote:match[2]};
   return {model,text:JSON.stringify({title:'Ein nachvollziehbares Programmierkonzept',explanation:'Du lernst Grundlagen schrittweise mit Erklärung und Praxis. '.repeat(10),
    exercise:'Baue selbst ein Beispiel und erkläre die einzelnen Schritte.',
    solution:'Beginne mit einem kleinen Ausdruck und prüfe die Ausgabe.',sourcePaths:[match[1]],evidence:[evidence]})};
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
  assert.equal(books.reduce((sum,b)=>sum+b.teachingBook!.chapters.length,0),plan.units.length);
  assert.deepEqual([...new Set(books.flatMap(b=>b.includedPaths))].sort(),pack.documents.map(d=>d.path).sort());
  await store.remove(finished.fingerprint);
  assert.equal(await store.read(finished.fingerprint,0),null);
 }finally{await rm(root,{recursive:true,force:true});}
});
