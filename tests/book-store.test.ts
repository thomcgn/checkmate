import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,mkdir,readFile,writeFile,stat} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {BookStore} from '../src/electron/book-store.ts';
import type {RepositoryAnalysis} from '../src/shared/repository.ts';

const makeBook=(id:string,createdAt='2026-11-23T12:00:00.000Z'):RepositoryAnalysis=>({
 id,repository:'example/demo',head:'a'.repeat(40),title:'Records verstehen',
 createdAt,model:'test-model',files:1,includedPaths:['src/Event.java'],
 markdown:'# Records\n'+('Ein Record ist ein Datenträger. '.repeat(30)),
 teachingBook:{version:1,title:'Records verstehen',learningGoals:['Java Records definieren'],chapters:[],
  coverage:{included:1,total:1,limited:false}}
});
const a='11111111-1111-4111-8111-111111111111';
const b='22222222-2222-4222-8222-222222222222';

test('library migrates legacy books once and preserves original backup',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'checkmate-book-store-'));
 try{
  const old=JSON.stringify([makeBook(a)]);
  await writeFile(path.join(root,'repo-books.json'),old);
  const store=new BookStore(root);
  assert.deepEqual((await store.list()).map(b=>b.id),[a]);
  assert.equal(await readFile(path.join(root,'repo-books.json'),'utf8'),old);
  assert.ok((await stat(path.join(root,'repo-books',a+'.json'))).isFile());
  await store.add(makeBook(b,'2026-11-24T12:00:00.000Z'));
  assert.deepEqual((await store.list()).map(x=>x.id),[b,a]);
  await store.remove(a);
  assert.deepEqual((await new BookStore(root).list()).map(x=>x.id),[b]);
  assert.equal(await readFile(path.join(root,'repo-books.json'),'utf8'),old);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('large combined collections remain readable beyond previous five-megabyte file limit',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'checkmate-book-store-'));
 try{
  const store=new BookStore(root);
  for(let i=0;i<24;i++){
   const id=i.toString(16).padStart(8,'0')+'-1111-4111-8111-111111111111';
   await store.add({...makeBook(id),markdown:'# '.padEnd(245000,'x')});
  }
  const all=await new BookStore(root).list();
  assert.equal(all.length,24);
  assert.ok(all.reduce((total,x)=>total+x.markdown.length,0)>5_000_000);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('books with invalid or mismatched IDs fail closed',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'checkmate-book-store-'));
 try{
  const store=new BookStore(root);
  await assert.rejects(store.add({...makeBook(a),id:'../../bad'}),/Ungültiges/);
  await store.add(makeBook(a));
  await assert.rejects(store.add(makeBook(a)),/bereits vorhanden/);
  await mkdir(path.join(root,'repo-books'),{recursive:true});
  await writeFile(path.join(root,'repo-books',b+'.json'),JSON.stringify(makeBook(a)));
  await assert.rejects(store.list(),/Beschädigtes Lehrbuch/);
 }finally{await rm(root,{recursive:true,force:true});}
});

test('textbook volumes are ordered in reading order, not by random document UUIDs',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'checkmate-course-library-'));
 try{
  const store=new BookStore(root);
  const series=(volume:number)=>({
   title:'Python Programming',volume,totalVolumes:2,documentsInVolume:4,totalDocuments:8,totalUnits:16,complete:true
  });
  await store.add({...makeBook(a),teachingBook:{...makeBook(a).teachingBook!,series:series(2)}});
  await store.add({...makeBook(b),teachingBook:{...makeBook(b).teachingBook!,series:series(1)}});
  assert.deepEqual((await store.list()).map(b=>b.teachingBook?.series?.volume),[1,2]);
 }finally{await rm(root,{recursive:true,force:true});}
});
