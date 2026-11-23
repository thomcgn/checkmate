import test from 'node:test';
import assert from 'node:assert/strict';
import {decodeDocumentationText} from '../src/electron/documentation-encoding.ts';

test('preserves UTF-8 German accents',()=>{
 assert.equal(decodeDocumentationText(Buffer.from('Größe, Beiträge','utf8')),'Größe, Beiträge');
});
test('decodes legacy Windows-1252 without corrupting original file bytes',()=>{
 const data=Buffer.from([0x47,0x72,0xf6,0xdf,0x65]);
 assert.equal(decodeDocumentationText(data),'Größe');
});
test('handles UTF-16 with a BOM',()=>{
 assert.equal(decodeDocumentationText(Buffer.from([0xff,0xfe,0x41,0x00,0xf6,0x00])),'Aö');
});
test('never misclassifies binary files containing NUL as text',()=>{
 assert.throws(()=>decodeDocumentationText(Buffer.from([0x01,0x00,0xff])),/binär/);
});
