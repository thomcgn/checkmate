import test from 'node:test';
import assert from 'node:assert/strict';
import {PIZZERIA_OPERATIONS_BOOK} from '../src/content/pizzeria-operations.ts';
import {PIZZERIA_TYPESCRIPT_OPERATIONS_BOOK,validateTypeScriptOperationsBook} from '../src/content/pizzeria-typescript-operations.ts';

test('TypeScript-Band 2 ist vollstaendig, altersgerecht und quellenbelegt',()=>{
 assert.deepEqual(validateTypeScriptOperationsBook(),[]);
 assert.equal(PIZZERIA_TYPESCRIPT_OPERATIONS_BOOK.chapters.length,25);
 assert.equal(PIZZERIA_TYPESCRIPT_OPERATIONS_BOOK.stages.length,6);
 assert.deepEqual(PIZZERIA_TYPESCRIPT_OPERATIONS_BOOK.chapters.map(chapter=>chapter.id),
  PIZZERIA_OPERATIONS_BOOK.chapters.map(chapter=>chapter.id));
 for(const chapter of PIZZERIA_TYPESCRIPT_OPERATIONS_BOOK.chapters){
  assert.ok(chapter.problem.length>40,chapter.id);
  assert.ok(chapter.objectives.length>=2,chapter.id);
  assert.ok(chapter.rule.natural.includes('WENN'),chapter.id);
  assert.ok(chapter.rule.pseudo.trim().length>5,chapter.id);
  assert.ok(chapter.explain.length>=2,chapter.id);
  assert.ok(chapter.wordbank.length>=2,chapter.id);
  assert.ok(chapter.tryIt.length>30&&chapter.misconception.length>30&&chapter.solution.length>30,chapter.id);
  assert.ok(chapter.sourceUrl.startsWith('https://'),chapter.id);
  if(chapter.code)assert.ok(chapter.code.split('\n').length<=8,chapter.id);
 }
});

test('die betrieblichen Themen bleiben in derselben Reihenfolge',()=>{
 const ids=PIZZERIA_TYPESCRIPT_OPERATIONS_BOOK.chapters.map(chapter=>chapter.id);
 assert.equal(ids[0],'after-restart');
 assert.equal(ids[24],'go-live');
 for(const id of ['database','jpa-entity','repository','login','password','roles',
  'error-contract','validation','retry','logging','unit-repeat','integration','ci',
  'docker','profiles','secrets','frontend','go-live'])assert.ok(ids.includes(id),id);
 assert.ok(ids.indexOf('database')<ids.indexOf('jpa-entity'));
 assert.ok(ids.indexOf('jpa-entity')<ids.indexOf('repository'));
 assert.ok(ids.indexOf('login')<ids.indexOf('roles'));
 assert.ok(ids.indexOf('unit-repeat')<ids.indexOf('ci'));
 assert.ok(ids.indexOf('docker')<ids.indexOf('secrets'));
});

test('Node.js und Express ersetzen Spring – ohne erfundene APIs',()=>{
 const all=PIZZERIA_TYPESCRIPT_OPERATIONS_BOOK.chapters.map(chapter=>JSON.stringify(chapter)).join('\n');
 for(const expected of ['express','node:sqlite','bcryptjs','express-session','node:test','supertest',
  'npm ci','FROM node:','fetch(','process.env','node:fs/promises','console.'])
  assert.ok(all.includes(expected),'should teach: '+expected);
 for(const javaism of ['SpringBootApplication','@Service','@Repository','@PreAuthorize','JpaRepository',
  'mvn ','System.out','IllegalArgumentException','@GetMapping','@PostMapping','MockMvc'])
  assert.ok(!all.includes(javaism),'no Spring/Java API should remain: '+javaism);
});

test('Typen, Fehler und Werkzeuge sind im Text sauber abgebildet',()=>{
 const code=(id:string):string=>PIZZERIA_TYPESCRIPT_OPERATIONS_BOOK.chapters
  .find(chapter=>chapter.id===id)?.code??'';
 assert.match(code('after-restart'),/node:fs\/promises/);
 assert.match(code('json-file'),/interface Bestand/);
 assert.match(code('database'),/node:sqlite/);
 assert.match(code('repository'),/Zutat \| null/);
 assert.match(code('password'),/bcrypt\.hash/);
 assert.match(code('error-contract'),/class Fehler extends Error/);
 assert.match(code('validation'),/string \| null/);
 assert.match(code('retry'),/<T>/);
 assert.match(code('ci'),/npm ci/);
 assert.match(code('docker'),/node:24-alpine/);
 assert.match(code('frontend'),/Promise<void>/);
 assert.match(PIZZERIA_TYPESCRIPT_OPERATIONS_BOOK.subtitle,/TypeScript/);
});
