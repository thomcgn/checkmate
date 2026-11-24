import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('documentation cannot invoke model generation from renderer or Electron IPC',async()=>{
 const [main,preload,reference,bridge]=await Promise.all([
  readFile('src/electron/main.ts','utf8'),
  readFile('src/electron/preload.ts','utf8'),
  readFile('src/renderer/documentation-library.tsx','utf8'),
  readFile('src/shared/repository.ts','utf8')
 ]);
 for(const source of [main,preload,reference,bridge]){
  assert.doesNotMatch(source,/docs:course-generate|docs:course-preview|docs:course-cancel/);
 }
 assert.doesNotMatch(reference,/chatgpt\.analyze|generateCourse\(|Lehrbuchreihe jetzt generieren/);
 assert.match(main,/handle\('repo:analyze'/);
 assert.match(main,/chatgpt\.analyze\(prompt,chosen,onProgress\)/);
});
