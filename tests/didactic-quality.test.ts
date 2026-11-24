import test from 'node:test';
import assert from 'node:assert/strict';
import {auditDidacticChapter} from '../src/electron/didactic-quality.ts';
import type {LessonSection} from '../src/shared/repository.ts';
const example:LessonSection={
 title:'Records und Datenmodelle',
 explanation:'## Grundlagen\n'+('Ein Record beschreibt ein unveränderliches Datenmodell. '.repeat(8))+
 '\n## Schritt für Schritt\n'+('Wir beginnen mit einer einfachen Definition und prüfen ihre Semantik. '.repeat(7))+
 '\n## Typische Fehler und Grenzen\n'+('Records sind nicht in jedem Anwendungsfall geeignet und haben Einschränkungen. '.repeat(7)),
 exercise:'Definiere einen Record und überprüfe seine Zugriffsmethoden anhand eigener Werte.',
 solution:'Nutze public record Event(String title) {} und rufe title() auf einer Instanz auf.',
 sourcePaths:['src/Event.java'],evidence:[{path:'src/Event.java',startLine:1,endLine:1,quote:'public record Event(String title) {}'}]
};
test('professional textbook chapter must contain multiple explained sections and checked evidence',()=>{
 const audit=auditDidacticChapter(example);
 assert.ok(audit.sections>=3);
 assert.equal(audit.hasPitfalls,true);
 assert.equal(audit.hasWalkthrough,true);
});
test('shallow summaries, unsupported claims and missing exercises fail deterministic gates',()=>{
 assert.throws(()=>auditDidacticChapter({...example,explanation:'Only a short summary.'}),/Qualitätsminimum/);
 assert.throws(()=>auditDidacticChapter({...example,evidence:[]}),/Qualitätsminimum/);
 assert.throws(()=>auditDidacticChapter({...example,exercise:'Do it.'}),/Qualitätsminimum/);
 assert.throws(()=>auditDidacticChapter({...example,explanation:example.explanation.replace('## Typische Fehler und Grenzen','## Noch mehr Details')}),/Qualitätsminimum/);
});
