import test from 'node:test';
import assert from 'node:assert/strict';
import {importOfficialPack} from '../src/electron/documentation-store.ts';
import {OFFICIAL_PACKS} from '../src/shared/documentation.ts';

test('actual Rust Book official documentation import is complete and byte-verified', {skip:process.env.CHECKMATE_DOCS_INTEGRATION!=='1',timeout:240000},async()=>{
 const requested=process.env.CHECKMATE_DOCS_PACK??'rust-book';
 const def=OFFICIAL_PACKS.find(p=>p.id===requested);
 assert.ok(def);
 const updates:{phase:string;done:number;total:number}[]=[];
 const result=await importOfficialPack(def,p=>updates.push(p));
 assert.match(result.pack.sourceCommit,/^[a-f0-9]{40}$/);
 assert.ok(result.pack.documents.length>20,'Expected substantial source publication for '+requested);
 assert.ok(result.files.size>=result.pack.documents.length);
 assert.ok(result.pack.documents.every(x=>x.text&&x.bytes>0&&/^[a-f0-9]{64}$/.test(x.sha256)));
 if(requested==='rust-book')assert.ok(result.pack.documents.some(x=>x.path.endsWith('SUMMARY.md')));
 assert.ok(updates.some(x=>x.phase==='extracting'&&x.done>0));
 assert.ok(result.files.size===result.pack.documents.length+result.pack.assets.length);
});
