import {mapChatGPTQuotaError} from './chatgpt-quota.ts';
const asObject=(value:unknown):Record<string,unknown>=>value!==null&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
const string=(value:unknown):string=>typeof value==='string'?value:'';
export type Model={slug:string;display_name:string};
export function parseModelCatalog(input:unknown):Model[]{
 const collection=asObject(input).models;
 if(!Array.isArray(collection))throw Error('Ungültige ChatGPT-Modellliste.');
 return collection.filter(x=>{
  const model=asObject(x);return model.visibility==='list'&&typeof model.slug==='string'&&model.slug.length>0&&typeof model.display_name==='string';
 }).map(x=>({slug:string(asObject(x).slug),display_name:string(asObject(x).display_name)}));
}
export type StreamEvent={type:string;delta?:string;response?:{error?:{code?:string;message?:string}}};
export class ResponseStreamParser{
 private buffer='';
 push(input:string):StreamEvent[]{
  this.buffer+=input;
  if(this.buffer.length>2_000_000)throw Error('Antwort-Stream ist zu groß.');
  const result:StreamEvent[]=[];
  let separator=this.buffer.indexOf('\n\n');
  while(separator>=0){
   const block=this.buffer.slice(0,separator);this.buffer=this.buffer.slice(separator+2);
   const data=block.split('\n').filter(s=>s.startsWith('data:')).map(s=>s.slice(5).trim()).join('\n');
   if(data&&data!=='[DONE]'){
    let value:unknown;
    try{value=JSON.parse(data);}catch{throw Error('Ungültiges ChatGPT-Stream-Ereignis.');}
    const event=asObject(value);
    if(typeof event.type==='string')result.push(value as StreamEvent);
   }
   separator=this.buffer.indexOf('\n\n');
  }
  return result;
 }
}

/**
 * Validate a response before parsing. Never expose raw bodies or credentials in diagnostics:
 * a 200 HTML login/challenge page is not a successful models request.
 */
export async function readApiJSON(response:Response,expectedOrigin='https://api.openai.com'):Promise<Record<string,unknown>>{
 const type=(response.headers.get('content-type')??'').split(';')[0].trim().toLowerCase();
 const requestId=response.headers.get('x-request-id');
 const trace=requestId&&/^[A-Za-z0-9_-]{1,100}$/.test(requestId)?' · Request-ID: '+requestId:'';
 let origin='';
 try{origin=new URL(response.url).origin;}catch{/* Synthetic responses may omit a URL. */}
 if(origin&&origin!==expectedOrigin){
  throw Error('Unerwartetes API-Ziel ('+new URL(response.url).hostname+'). Die Anmeldung wurde nicht geändert.'+trace);
 }
 const raw=await response.text();
 if(raw.length>1_000_000)throw Error('ChatGPT-Antwort überschreitet das Größenlimit (HTTP '+response.status+').'+trace);
 const trimmed=raw.replace(/^\uFEFF/,'').trimStart();
 if(type==='text/html'||/^<!doctype html|^<html[\s>]/i.test(trimmed)){
  throw Error('ChatGPT lieferte eine HTML-Seite statt der Modellliste (HTTP '+response.status+', Typ '+(type||'unbekannt')+'). Mögliche Weiterleitung, Proxy- oder Schutzseite.'+trace);
 }
 let value:unknown;
 try{value=JSON.parse(trimmed);}catch{
  throw Error('ChatGPT lieferte kein gültiges JSON (HTTP '+response.status+', Typ '+(type||'unbekannt')+'). Bitte Verbindung oder Proxy prüfen.'+trace);
 }
 if(!value||typeof value!=='object'||Array.isArray(value))
  throw Error('ChatGPT-Antwort hat eine unerwartete JSON-Struktur (HTTP '+response.status+').'+trace);
 const data=value as Record<string,unknown>;
 if(!response.ok){
  const error=asObject(data.error);
  const code=string(error.code)||string(data.code);
  const message=string(error.message)||string(data.detail)||'HTTP '+response.status;
  const quota=mapChatGPTQuotaError(code,message,response.status);
  if(quota)throw Error(quota+trace);
  const safeCode=/^[a-zA-Z0-9_.-]{1,100}$/.test(code)?' ['+code+']':'';
  throw Error('ChatGPT-Anfrage abgelehnt (HTTP '+response.status+')'+safeCode+': '+message.slice(0,300)+trace);
 }
 return data;
}
