import test from 'node:test';
import assert from 'node:assert/strict';
import {parseModelCatalog,ResponseStreamParser} from '../src/electron/siwc-protocol.ts';

test('model catalog includes only visible allowed models',()=>{
 const models=parseModelCatalog({models:[
  {slug:'gpt-check',display_name:'Check',visibility:'list'},
  {slug:'hidden',display_name:'Hidden',visibility:'internal'},
  {slug:'bad',display_name:5,visibility:'list'}
 ]});
 assert.deepEqual(models,[{slug:'gpt-check',display_name:'Check'}]);
 assert.throws(()=>parseModelCatalog({data:[]}));
});
test('SSE handles chunk boundaries, successful completion and model text',()=>{
 const parser=new ResponseStreamParser();
 assert.deepEqual(parser.push('event: response.output_text.delta\ndata: {"type":"response.output_text.delta","delta":"Ha'),[]);
 const result=parser.push('llo"}\n\ndata: {"type":"response.completed"}\n\n');
 assert.deepEqual(result.map(x=>x.type),['response.output_text.delta','response.completed']);
 assert.equal(result[0].delta,'Hallo');
});
test('malformed events fail visibly rather than fabricating success',()=>{
 const parser=new ResponseStreamParser();
 assert.throws(()=>parser.push('data: {invalid-json}\n\n'));
});
