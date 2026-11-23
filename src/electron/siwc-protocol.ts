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
