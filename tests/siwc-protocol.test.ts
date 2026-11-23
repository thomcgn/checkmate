import test from 'node:test';
import assert from 'node:assert/strict';
import {parseModelCatalog,readApiJSON,ResponseStreamParser} from '../src/electron/siwc-protocol.ts';

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

test('200 HTML instead of models JSON is diagnosed without leaking content',async()=>{
 const response=new Response('<!doctype html><html><body>secret-token</body></html>',{
  status:200,headers:{'content-type':'text/html; charset=utf-8','x-request-id':'req_safe_42'}
 });
 await assert.rejects(readApiJSON(response),error=>{
  assert.ok(error instanceof Error);
  assert.match(error.message,/HTML-Seite/);
  assert.match(error.message,/HTTP 200/);
  assert.match(error.message,/Request-ID: req_safe_42/);
  assert.doesNotMatch(error.message,/secret-token/);
  return true;
 });
});
test('JSON with a BOM, whitespace and standard MIME type works',async()=>{
 const response=new Response('\uFEFF  {"models":[{"slug":"gpt-test","display_name":"Test","visibility":"list"}]}',{
  status:200,headers:{'content-type':'application/json'}
 });
 assert.deepEqual(parseModelCatalog(await readApiJSON(response)),[{slug:'gpt-test',display_name:'Test'}]);
});
test('non-JSON success responses are not interpreted as authentication success',async()=>{
 await assert.rejects(readApiJSON(new Response('gateway ok',{status:200,headers:{'content-type':'text/plain'}})),/kein gültiges JSON/);
});
test('API errors preserve status and safe code but not untrusted secrets',async()=>{
 const body=JSON.stringify({error:{code:'authorization_failed',message:'Account has no permission'}});
 const response=new Response(body,{status:403,headers:{'content-type':'application/json'}});
 await assert.rejects(readApiJSON(response),/HTTP 403.*authorization_failed.*Account has no permission/);
});
