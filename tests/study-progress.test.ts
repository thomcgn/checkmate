import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {StudyProgressStore} from '../src/electron/study-progress.ts';
const bookA='11111111-1111-4111-8111-111111111111';
const bookB='22222222-2222-4222-8222-222222222222';

test('learning milestones persist offline and remain isolated by book/version ID',async()=>{
 const directory=await mkdtemp(path.join(os.tmpdir(),'checkmate-mastery-'));
 try{
  const store=new StudyProgressStore(directory);
  await store.set(bookA,0,'learning',3);
  await store.set(bookA,1,'understood',3);
  await store.set(bookB,0,'unread',1);
  const reloaded=new StudyProgressStore(directory);
  assert.deepEqual((await reloaded.list(bookA)).map(x=>x.status),['learning','understood']);
  assert.deepEqual((await reloaded.list(bookB)).map(x=>x.status),['unread']);
  assert.equal((await readFile(path.join(directory,'book-study-progress.json'),'utf8')).includes('"version":1'),true);
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('concurrent updates are serialized instead of losing completed chapters',async()=>{
 const directory=await mkdtemp(path.join(os.tmpdir(),'checkmate-mastery-'));
 try{
  const store=new StudyProgressStore(directory);
  await Promise.all(Array.from({length:20},(_,index)=>store.set(bookA,index,'understood',20)));
  const list=await new StudyProgressStore(directory).list(bookA);
  assert.equal(list.length,20);
  assert.ok(list.every(x=>x.status==='understood'));
  await store.set(bookA,3,'learning',20);
  assert.equal((await store.list(bookA)).filter(x=>x.chapterIndex===3).length,1);
  assert.equal((await store.list(bookA)).find(x=>x.chapterIndex===3)?.status,'learning');
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('invalid statuses, missing chapters and corrupt files fail closed',async()=>{
 const directory=await mkdtemp(path.join(os.tmpdir(),'checkmate-mastery-'));
 try{
  const store=new StudyProgressStore(directory);
  await assert.rejects(store.set(bookA,2,'understood',2),/Ungültiger/);
  await assert.rejects(store.set(bookA,0,'understood' as never,0),/Ungültiger/);
  await assert.rejects(store.set('../bad',0,'learning',1),/Ungültiger/);
  await writeFile(path.join(directory,'book-study-progress.json'),JSON.stringify({
   version:1,chapters:[{bookId:bookA,chapterIndex:0,status:'made-up',updatedAt:new Date().toISOString()}]
  }));
  await assert.rejects(store.list(bookA),/Beschädigte/);
 }finally{await rm(directory,{recursive:true,force:true});}
});
