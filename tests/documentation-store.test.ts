import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {DocumentationStore} from '../src/electron/documentation-store.ts';
import {OFFICIAL_PACKS} from '../src/shared/documentation.ts';

const hash=(data:Buffer):string=>createHash('sha256').update(data).digest('hex');

test('Every supported language has an actual offline-source package entry',()=>{
 const languages=new Set(OFFICIAL_PACKS.map(x=>x.language));
 assert.deepEqual([...languages].sort(),['csharp','cpp','go','java','javascript','kotlin','php','python','rust','typescript']);
 for(const p of OFFICIAL_PACKS){
  assert.match(p.id,/^[a-z0-9-]+$/);
  assert.ok(p.extensions.length>0,p.id);
  assert.ok(p.prefix.length>0);
 }
});

test('Local documents are readable, searchable and verified against SHA-256',async()=>{
 const home=await mkdtemp(path.join(tmpdir(),'checkmate-doc-test-'));
 try{
  const folder=path.join(home,'rust-book');
  const docpath='src/chapter-one.md';
  const content=Buffer.from('# Ownership\n\nDer Besitzer hält einen Wert.\n','utf8');
  await mkdir(path.join(folder,'files','src'),{recursive:true});
  await writeFile(path.join(folder,'files',docpath),content);
  const manifest={
   id:'rust-book',language:'rust',title:'Rust',sourceCommit:'a'.repeat(40),
   sourceUrl:'offline',license:'MIT',licenseUrl:'offline',extent:'test',
   installedAt:'2026-11-23T00:00:00.000Z',
   documents:[{path:docpath,title:'Ownership',bytes:content.length,sha256:hash(content),text:true}],
   assets:[]
  };
  await writeFile(path.join(folder,'index.json'),JSON.stringify(manifest),'utf8');
  const store=new DocumentationStore(home);
  const result=await store.readDocument('rust-book',docpath);
  assert.match(result.text,/Besitzer/);
  assert.deepEqual(await store.searchPack('rust-book','besitzer'),[docpath]);
  const status=await store.statuses();
  assert.equal(status.find(x=>x.id==='rust-book')?.count,1);
  await writeFile(path.join(folder,'files',docpath),'verfälschter Text');
  await assert.rejects(store.readDocument('rust-book',docpath),/beschädigt/);
 }finally{await rm(home,{recursive:true,force:true});}
});
test('Unlisted files and directory traversal are never accessible',async()=>{
 const home=await mkdtemp(path.join(tmpdir(),'checkmate-doc-test-'));
 try{
  const store=new DocumentationStore(home);
  await assert.rejects(store.readDocument('rust-book','../../secret'),/nicht installiert/);
  await assert.rejects(store.load('../../secret'),/Unbekanntes Dokumentationspaket/);
 }finally{await rm(home,{recursive:true,force:true});}
});
