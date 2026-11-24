import test from 'node:test';
import assert from 'node:assert/strict';
import {validateBeginnerBook} from '../src/content/pizzeria-book.ts';
import {PIZZERIA_OPERATIONS_BOOK} from '../src/content/pizzeria-operations.ts';
import {PIZZERIA_RUST_OPERATIONS_BOOK} from '../src/content/pizzeria-rust-operations.ts';

const JAVA_TOKENS=/@Entity|JpaRepository|@SpringBootApplication|SpringApplication|mvn |application\.properties|IllegalArgumentException|throw new|BCrypt|actuator|@PreAuthorize|MockMvc/;
const byId=(id:string)=>{
 const chapter=PIZZERIA_RUST_OPERATIONS_BOOK.chapters.find(item=>item.id===id);
 assert.ok(chapter,'fehlendes Kapitel '+id);
 return chapter;
};

test('Rust-Band 2 ist vollständig, altersgerecht und quellenbelegt',()=>{
 assert.deepEqual(validateBeginnerBook(PIZZERIA_RUST_OPERATIONS_BOOK),[]);
 assert.equal(PIZZERIA_RUST_OPERATIONS_BOOK.chapters.length,25);
 assert.equal(PIZZERIA_RUST_OPERATIONS_BOOK.stages.length,6);
 assert.deepEqual(PIZZERIA_RUST_OPERATIONS_BOOK.stages.map(stage=>stage.id),PIZZERIA_OPERATIONS_BOOK.stages.map(stage=>stage.id));
 assert.deepEqual(PIZZERIA_RUST_OPERATIONS_BOOK.chapters.map(chapter=>chapter.id),PIZZERIA_OPERATIONS_BOOK.chapters.map(chapter=>chapter.id));
 for(const chapter of PIZZERIA_RUST_OPERATIONS_BOOK.chapters){
  assert.ok(chapter.problem.length>40,chapter.id);
  assert.ok(chapter.objectives.length>=2,chapter.id);
  assert.ok(chapter.explain.length>=2,chapter.id);
  assert.ok(chapter.wordbank.length>=2,chapter.id);
  assert.ok(chapter.tryIt.length>30&&chapter.misconception.length>30&&chapter.solution.length>30,chapter.id);
  assert.ok(chapter.rule.natural.includes('WENN'),chapter.id);
  assert.ok(chapter.sourceUrl.startsWith('https://'),chapter.id);
  assert.ok(chapter.code&&chapter.code.split('\n').length<=8,chapter.id);
  assert.doesNotMatch(chapter.code??'',JAVA_TOKENS,chapter.id+' still uses the Spring stack');
 }
});

test('der Rust-Stack ist fachlich abgebildet und dokumentiert',()=>{
 assert.match(byId('after-restart').code??'',/std::fs/);
 assert.match(byId('json-file').code??'',/Serialize, Deserialize/);
 assert.match(byId('database').code??'',/Connection::open/);
 assert.match(byId('database').code??'',/SELECT menge FROM zutat WHERE name = \?1/);
 assert.match(byId('jpa-entity').code??'',/FromRow/);
 assert.match(byId('repository').code??'',/OptionalExtension/);
 assert.match(byId('migration').code??'',/Migrations::new/);
 assert.match(byId('password').code??'',/Argon2/);
 assert.match(byId('password').code??'',/SaltString/);
 assert.match(byId('roles').code??'',/matches!\(rolle, Rolle::Chef\)/);
 assert.match(byId('session').code??'',/tower|Cookie::new/);
 assert.match(byId('error-contract').code??'',/IntoResponse/);
 assert.match(byId('validation').code??'',/fn pruefen/);
 assert.match(byId('retry').code??'',/tokio::time::sleep/);
 assert.match(byId('logging').code??'',/tracing::|info!/);
 assert.match(byId('health').code??'',/Router::new\(\)\.route\("\/health"/);
 assert.match(byId('ci').code??'',/cargo test/);
 assert.match(byId('ci').code??'',/cargo clippy/);
 assert.match(byId('docker').code??'',/FROM rust:1 AS build/);
 assert.match(byId('profiles').code??'',/APP_ENV/);
 assert.match(byId('secrets').code??'',/std::env::var/);
 assert.match(byId('frontend').code??'',/fetch\("\/pizzen"\)/);
 assert.match(byId('go-live').code??'',/curl -s localhost:3000\/health/);
});

test('Band 2 deckt die betrieblichen Themen in sinnvoller Reihenfolge ab',()=>{
 const ids=PIZZERIA_RUST_OPERATIONS_BOOK.chapters.map(chapter=>chapter.id);
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
 assert.ok(ids.indexOf('ci')<ids.indexOf('docker'));
});
