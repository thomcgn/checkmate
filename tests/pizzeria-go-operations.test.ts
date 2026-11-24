import test from 'node:test';
import assert from 'node:assert/strict';
import {PIZZERIA_OPERATIONS_BOOK} from '../src/content/pizzeria-operations.ts';
import {PIZZERIA_GO_OPERATIONS_BOOK,getGoOperationsChapter,validateGoOperationsBook} from '../src/content/pizzeria-go-operations.ts';

const JAVA_ONLY:readonly string[]=[
 'System.out','java.','new Scanner','Optional<','public static','class ','extends ',
 '@SpringBoot','@Service','@Repository','@Entity','@RestController','JpaRepository',
 '.stream()','throw new','assertEquals','implements ','mvn ','spring.'
];

test('Go-Band 2 ist vollständig und spiegelt den Java-Fahrplan',()=>{
 assert.deepEqual(validateGoOperationsBook(),[]);
 assert.equal(PIZZERIA_GO_OPERATIONS_BOOK.chapters.length,25);
 assert.equal(PIZZERIA_GO_OPERATIONS_BOOK.stages.length,6);
 assert.deepEqual(PIZZERIA_GO_OPERATIONS_BOOK.chapters.map(chapter=>chapter.id),
  PIZZERIA_OPERATIONS_BOOK.chapters.map(chapter=>chapter.id));
 assert.deepEqual(PIZZERIA_GO_OPERATIONS_BOOK.stages.map(stage=>stage.id),
  PIZZERIA_OPERATIONS_BOOK.stages.map(stage=>stage.id));
 for(const chapter of PIZZERIA_GO_OPERATIONS_BOOK.chapters){
  assert.ok(chapter.problem.length>40,chapter.id);
  assert.ok(chapter.objectives.length>=2,chapter.id);
  assert.ok(chapter.explain.length>=2,chapter.id);
  assert.ok(chapter.wordbank.length>=2,chapter.id);
  assert.ok(chapter.tryIt.length>30&&chapter.misconception.length>30&&chapter.solution.length>30,chapter.id);
  assert.ok(chapter.rule.natural.includes('WENN'),chapter.id);
  assert.ok(chapter.sourceUrl.startsWith('https://'),chapter.id);
  assert.ok((chapter.code??'').split('\n').length<=8,chapter.id+' must stay short');
 }
});

test('Go-Band 2 bildet Spring durch die Standardbibliothek ab',()=>{
 const code=(id:string):string=>getGoOperationsChapter(id).code??'';
 assert.match(code('after-restart'),/os\.WriteFile/);
 assert.match(code('json-file'),/json:"zutat"/);
 assert.match(code('json-file'),/json\.Marshal/);
 assert.match(code('database'),/sql\.Open\("sqlite"/);
 assert.match(code('database'),/QueryRow/);
 assert.match(code('jpa-entity'),/Scan\(&z\.Name, &z\.Menge\)/);
 assert.match(code('repository'),/type Regal interface/);
 assert.match(code('migration'),/os\.ReadFile\("migrations\/001_preis\.sql"\)/);
 assert.match(code('login'),/r\.FormValue/);
 assert.match(code('password'),/bcrypt\.GenerateFromPassword/);
 assert.match(code('roles'),/http\.Handler/);
 assert.match(code('session'),/http\.SetCookie/);
 assert.match(code('logout'),/delete\(sessions, cookie\.Value\)/);
 assert.match(code('error-contract'),/func \(f Fehler\) Error\(\) string/);
 assert.match(code('validation'),/http\.StatusBadRequest/);
 assert.match(code('retry'),/time\.Sleep/);
 assert.match(code('logging'),/slog\.Info/);
 assert.match(code('health'),/GET \/health/);
 assert.ok(getGoOperationsChapter('unit-repeat').rule.pseudo.includes('go test ./...'));
 assert.match(code('integration'),/httptest\.NewServer/);
 assert.match(code('edge-cases'),/cases := \[\]struct/);
 assert.match(code('ci'),/actions\/checkout@v4/);
 assert.match(code('ci'),/actions\/setup-go@v5/);
 assert.match(code('docker'),/FROM golang:1\.22/);
 assert.match(code('profiles'),/os\.Getenv\("APP_ENV"\)/);
 assert.match(code('secrets'),/os\.Getenv\("DB_PASSWORD"\)/);
 assert.match(code('frontend'),/fetch\("\/pizzen"\)/);
 assert.match(code('go-live'),/curl localhost:8080\/health/);
});

test('kein Java-API in Go-Code und sinnvolle Reihenfolge der Themen',()=>{
 for(const chapter of PIZZERIA_GO_OPERATIONS_BOOK.chapters){
  for(const token of JAVA_ONLY)assert.ok(!(chapter.code??'').includes(token),chapter.id+' contains '+token);
 }
 const ids=PIZZERIA_GO_OPERATIONS_BOOK.chapters.map(chapter=>chapter.id);
 assert.equal(ids[0],'after-restart');
 assert.equal(ids[24],'go-live');
 for(const id of ['database','jpa-entity','repository','login','password','roles','error-contract',
  'validation','retry','logging','unit-repeat','integration','edge-cases','ci','docker',
  'profiles','secrets','frontend','go-live'])assert.ok(ids.includes(id),id);
 assert.ok(ids.indexOf('database')<ids.indexOf('jpa-entity'));
 assert.ok(ids.indexOf('jpa-entity')<ids.indexOf('repository'));
 assert.ok(ids.indexOf('login')<ids.indexOf('password'));
 assert.ok(ids.indexOf('login')<ids.indexOf('roles'));
 assert.ok(ids.indexOf('unit-repeat')<ids.indexOf('ci'));
 assert.ok(ids.indexOf('docker')<ids.indexOf('secrets'));
});

test('Go-Betriebsbuch ist eigenständig und validiert Fehler',()=>{
 assert.notEqual(PIZZERIA_GO_OPERATIONS_BOOK,PIZZERIA_OPERATIONS_BOOK);
 assert.throws(()=>getGoOperationsChapter('nicht-da'),/Unbekanntes Go-Betriebskapitel/);
 const chapter=getGoOperationsChapter('health');
 assert.ok(validateGoOperationsBook({...PIZZERIA_GO_OPERATIONS_BOOK,chapters:[{...chapter,explain:[],sourceUrl:'http://example.org'}]}).length>0);
 assert.ok(validateGoOperationsBook({...PIZZERIA_GO_OPERATIONS_BOOK,chapters:[{...chapter,wordbank:[]}]}).length>0);
 assert.ok(validateGoOperationsBook({...PIZZERIA_GO_OPERATIONS_BOOK,chapters:[{...chapter,rule:{natural:'',pseudo:''}}]}).length>0);
});
