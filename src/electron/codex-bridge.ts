import {spawn,type ChildProcessWithoutNullStreams} from 'node:child_process';
import {createInterface} from 'node:readline';
import {mkdtemp,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import type {ChatGPTStatus} from '../shared/repository';

type Pending={resolve:(value:unknown)=>void;reject:(error:Error)=>void;timer:NodeJS.Timeout};
type Notification=(method:string,params:Record<string,unknown>)=>void;
const obj=(value:unknown):Record<string,unknown>=>value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
const str=(value:unknown):string=>typeof value==='string'?value:'';
export class CodexBridge{
 private proc:ChildProcessWithoutNullStreams|null=null;
 private directory:string|null=null;
 private counter=0;
 private pending=new Map<number,Pending>();
 private listeners=new Set<Notification>();
 private init:Promise<void>|null=null;
 private stopping=false;
 on(listener:Notification):()=>void{this.listeners.add(listener);return ()=>this.listeners.delete(listener);}
 private send(message:unknown):void{
  if(!this.proc||!this.proc.stdin.writable)throw Error('Codex App Server ist nicht gestartet.');
  this.proc.stdin.write(JSON.stringify(message)+'\n');
 }
 private request(method:string,params:unknown={},ms=12000):Promise<unknown>{
  const id=++this.counter;
  return new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>{this.pending.delete(id);reject(Error('Codex-Anfrage überschritt das Zeitlimit: '+method));},ms);
   this.pending.set(id,{resolve,reject,timer});
   try{this.send({id,method,params});}catch(err){clearTimeout(timer);this.pending.delete(id);reject(err);}
  });
 }
 private consume(line:string):void{
  if(line.length>2_000_000)return;
  let raw:unknown;
  try{raw=JSON.parse(line);}catch{return;}
  const data=obj(raw);
  if(typeof data.id==='number'){
   const pending=this.pending.get(data.id);
   if(!pending)return;
   clearTimeout(pending.timer);this.pending.delete(data.id);
   if(data.error){pending.reject(Error(str(obj(data.error).message)||'Unbekannter Codex-Fehler'));}
   else pending.resolve(data.result);
   return;
  }
  const method=str(data.method);
  if(!method)return;
  const params=obj(data.params);
  // The learning workspace never grants execution, editing or permission escalation.
  if(typeof data.id==='string'||typeof data.id==='number'){
   this.send({id:data.id,error:{code:-32601,message:'Checkmate erlaubt keine Werkzeuge oder Dateizugriffe.'}});
   return;
  }
  for(const listener of this.listeners)listener(method,params);
 }
 private async start():Promise<void>{
  if(this.proc)return;
  this.directory=await mkdtemp(path.join(os.tmpdir(),'checkmate-readonly-'));
  const proc=spawn('codex',['app-server'],{cwd:this.directory,stdio:['pipe','pipe','pipe'],shell:false,windowsHide:true,env:{...process.env,OPENAI_API_KEY:'',CODEX_API_KEY:''}});
  this.proc=proc;this.stopping=false;
  createInterface({input:proc.stdout}).on('line',line=>this.consume(line));
  proc.stderr.on('data',()=>{}); // Never forward authentication traces into the UI.
  proc.on('error',error=>this.fail('Codex CLI nicht startbar: '+error.message));
  proc.on('exit',(code)=>{if(!this.stopping)this.fail('Codex wurde beendet (Code '+code+').');});
  await this.request('initialize',{clientInfo:{name:'checkmate',title:'Checkmate',version:'0.2.0'}},15000);
  this.send({method:'initialized',params:{}});
 }
 private fail(reason:string):void{
  for(const pending of this.pending.values()){clearTimeout(pending.timer);pending.reject(Error(reason));}
  this.pending.clear();this.proc=null;this.init=null;
 }
 async ensure():Promise<void>{
  if(!this.init)this.init=this.start();
  try{await this.init;}catch(error){await this.stop();throw error;}
 }
 async status():Promise<ChatGPTStatus>{
  try{
   await this.ensure();
   const info=obj(await this.request('account/read',{refreshToken:false}));
   const account=obj(info.account);
   return {available:true,connected:account.type==='chatgpt',
    email:account.type==='chatgpt'?str(account.email)||null:null,
    plan:account.type==='chatgpt'?str(account.planType)||null:null,
    detail:account.type==='chatgpt'?'ChatGPT verbunden · Nutzung über Codex-App-Server':'ChatGPT ist noch nicht angemeldet.'};
  }catch(error){return {available:false,connected:false,email:null,plan:null,detail:error instanceof Error?error.message:'Codex ist nicht verfügbar.'};}
 }
 async signIn(open:(url:string)=>Promise<void>):Promise<ChatGPTStatus>{
  await this.ensure();
  const login=obj(await this.request('account/login/start',{type:'chatgpt',useHostedLoginSuccessPage:true,appBrand:'chatgpt'},20000));
  const url=str(login.authUrl);
  const target=new URL(url);
  if(target.protocol!=='https:'||!['chatgpt.com','auth.openai.com'].includes(target.hostname))throw Error('Unerwartetes OAuth-Ziel');
  await open(url);
  return {available:true,connected:false,email:null,plan:null,detail:'Der Browser wurde zur ChatGPT-Anmeldung geöffnet. Danach Status aktualisieren.'};
 }
 async analyze(prompt:string,progress:(message:string)=>void):Promise<{text:string;model:string}>{
  await this.ensure();
  const account=await this.status();
  if(!account.connected)throw Error('Bitte zuerst mit ChatGPT anmelden (nicht per API-Key).');
  // Do not guess a plan-entitled model: use Codex's own default.
  const started=obj(await this.request('thread/start',{cwd:this.directory,approvalPolicy:'never',sandbox:'read-only',ephemeral:true,serviceName:'checkmate'},30000));
  const threadId=str(obj(started.thread).id);
  if(!threadId)throw Error('Kein Codex-Thread erstellt.');
  let text='';
  let messageFromItem='';
  let turnId='';
  let done:(error?:Error)=>void=()=>{};
  const finished=new Promise<void>((resolve,reject)=>{done=error=>error?reject(error):resolve();});
  const unsubscribe=this.on((method,params)=>{
   if(str(params.threadId)!==threadId)return;
   if(method==='item/agentMessage/delta'){
    const delta=str(params.delta);
    if(delta)text+=delta;
    if(text.length>250_000)done(Error('Die Modellantwort überschreitet das Größenlimit.'));
   }else if(method==='item/completed'){
    const item=obj(params.item);
    if(item.type==='agentMessage')messageFromItem=str(item.text);
   }else if(method==='turn/completed'){
    const turn=obj(params.turn);
    if(turnId&&str(turn.id)!==turnId)return;
    if(turn.status==='completed')done();
    else done(Error(str(obj(turn.error).message)||'Die Analyse wurde nicht erfolgreich abgeschlossen.'));
   }else if(method==='turn/started'){progress('ChatGPT analysiert die ausgewählten Quelldateien …');}
  });
  const timeout=setTimeout(()=>done(Error('Analysezeitlimit nach fünf Minuten erreicht.')),300000);
  try{
   const turn=obj(await this.request('turn/start',{
    threadId,input:[{type:'text',text:prompt}],approvalPolicy:'never',
    sandboxPolicy:{type:'readOnly',access:{type:'restricted',includePlatformDefaults:false,readableRoots:[this.directory]}},
   },30000));
   turnId=str(obj(turn.turn).id);
   progress('Modell erstellt Architektur- und Lernkapitel …');
   await finished;
   const output=(messageFromItem||text).trim();
   if(output.length<80)throw Error('ChatGPT hat keine vollständige Lerneinheit geliefert.');
   return {text:output.slice(0,250_000),model:'ChatGPT über Codex'};
  }finally{clearTimeout(timeout);unsubscribe();}
 }
 async stop():Promise<void>{
  this.stopping=true;
  this.proc?.kill();this.proc=null;this.init=null;
  if(this.directory){await rm(this.directory,{recursive:true,force:true}).catch(()=>{});this.directory=null;}
 }
}
