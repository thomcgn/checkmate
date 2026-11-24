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
 sourcePaths:['src/Event.java'],evidence:[{path:'src/Event.java',startLine:1,endLine:1,quote:'public record Event(String title) {}'}],
 learningObjectives:['Einen Java Record anhand des Quellcodes erklären','Den Unterschied zu einer klassischen Datenklasse benennen'],
 glossary:[{term:'Record',definition:'Eine kompakte Schreibweise für einen unveränderlichen Datencontainer.'},{term:'Accessor',definition:'Eine Zugriffsmethode für eine Komponente eines Records.'}],
 reviewQuestions:[{question:'Welche Zugriffsmethode erzeugt ein Record für seine Komponente?',answer:'Eine gleichnamige Methode gibt den Wert der Komponente zurück.'},{question:'Worin liegt der Unterschied zwischen Record und veränderlicher Klasse?',answer:'Ein Record hat unveränderliche Komponenten und generierte Methoden.'}]
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

test('mandatory didactic metadata rejects chapters without self-check or glossary',()=>{
 assert.throws(()=>auditDidacticChapter({...example,learningObjectives:[]}),/Qualitätsminimum/);
 assert.throws(()=>auditDidacticChapter({...example,glossary:[]}),/Qualitätsminimum/);
 assert.throws(()=>auditDidacticChapter({...example,reviewQuestions:[]}),/Qualitätsminimum/);
});
