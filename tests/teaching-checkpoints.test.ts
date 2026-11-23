import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {TeachingCheckpointStore,teachingFingerprint} from '../src/electron/teaching-checkpoints.ts';
import {generateTeachingBook} from '../src/electron/teaching-engine.ts';
import type {RepositorySnapshot} from '../src/electron/repo-sources.ts';

const snapshot:RepositorySnapshot={
 preview:{repository:'demo/project',head:'b'.repeat(40),files:30,included:1,bytes:100,excluded:29,samplePaths:['src/Event.java'],source:'GitHub'},
 sources:[{path:'src/Event.java',content:'public record Event(Long id, String title) {}'}]
};
const outline={title:'Lerne Java Records',learningGoals:['Das Record-Konzept verstehen'],chapters:[{title:'Records verstehen',objective:'Unveränderliche Datenobjekte erläutern'},{title:'Records anwenden',objective:'Ein Ereignis modellieren'}]};
const lesson=(name:string)=>({title:name,explanation:'Ein Record in Java ist eine kompakte Datenklasse. '.repeat(10),exercise:'Baue einen Event Record mit den nötigen Komponenten.',solution:'Benutze public record Event(Long id, String title) {}.',sourcePaths:['src/Event.java'],evidence:[{path:'src/Event.java',startLine:1,endLine:1,quote:'public record Event(Long id, String title) {}'}]});
test('source fingerprint binds exact content, model and commit',()=>{
 const original=teachingFingerprint(snapshot,'model-a');
 assert.match(original,/^[0-9a-f]{64}$/);
 assert.notEqual(original,teachingFingerprint(snapshot,'model-b'));
 assert.notEqual(original,teachingFingerprint({...snapshot,sources:[{...snapshot.sources[0],content:'modified'}]},'model-a'));
 assert.notEqual(original,teachingFingerprint({...snapshot,preview:{...snapshot.preview,head:'c'.repeat(40)}},'model-a'));
});
test('completed chapters survive failure and resume without repeat model calls',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'checkmate-checkpoint-test-'));
 try{
  const store=new TeachingCheckpointStore(root);
  const fingerprint=teachingFingerprint(snapshot,'model-a');
  let calls=0;
  await assert.rejects(generateTeachingBook(snapshot,'model-a',async()=>{
   calls++;
   if(calls===1)return {model:'model-a',text:JSON.stringify(outline)};
   if(calls===2)return {model:'model-a',text:JSON.stringify(lesson('Records verstehen'))};
   throw Error('Model offline');
  },()=>{},{saveCheckpoint:c=>store.save(c)}),/Model offline/);
  const partial=await store.load(fingerprint);
  assert.equal(partial?.chapters.length,1);
  let resumeCalls=0;
  const result=await generateTeachingBook(snapshot,'model-a',async()=>{
   resumeCalls++;
   return {model:'model-a',text:JSON.stringify(lesson('Records anwenden'))};
  },()=>{},{resume:partial,saveCheckpoint:c=>store.save(c)});
  assert.equal(resumeCalls,1);
  assert.equal(result.book.chapters.length,2);
  assert.equal((await store.load(fingerprint))?.chapters.length,2);
  await store.remove(fingerprint);
  assert.equal(await store.load(fingerprint),null);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('corrupted checkpoint file and invalid key do not silently pass',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'checkmate-checkpoint-test-'));
 try{
  const store=new TeachingCheckpointStore(root);
  await assert.rejects(store.load('../escape'),/Schlüssel/);
  await assert.rejects(store.save({version:1,fingerprint:'x',model:'test',outline:{title:'t',goals:[],topics:[]},chapters:[],savedAt:'now'}),/Ungültiger/);
 }finally{await rm(root,{recursive:true,force:true});}
});
