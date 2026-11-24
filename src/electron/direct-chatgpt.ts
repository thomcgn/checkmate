import {createHash,randomBytes,randomUUID,timingSafeEqual} from 'node:crypto';
import {createServer,type Server} from 'node:http';
import {promises as fs} from 'node:fs';
import path from 'node:path';
import {safeStorage,shell} from 'electron';
import {createRemoteJWKSet,jwtVerify} from 'jose';
import type {ChatGPTStatus} from '../shared/repository';
import {parseModelCatalog,readApiJSON,ResponseStreamParser,type Model,type StreamEvent} from './siwc-protocol';

const AUTH='https://auth.openai.com';
const RESOURCE='https://api.openai.com/v1';
const SCOPES='openid profile email offline_access resource.invoke chatgpt.tokens.use.direct';
const SCOPE='chatgpt.tokens.use.direct';
const JWKS=createRemoteJWKSet(new URL(AUTH+'/.well-known/jwks.json'));
const asObject=(value:unknown):Record<string,unknown>=>value!==null&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
const string=(value:unknown):string=>typeof value==='string'?value:'';
const secureCompare=(a:string,b:string):boolean=>{
 const x=Buffer.from(a);const y=Buffer.from(b);
 return x.length===y.length&&timingSafeEqual(x,y);
};
const pkce=():string=>randomBytes(32).toString('base64url');
const challenge=(v:string):string=>createHash('sha256').update(v).digest('base64url');
type Credentials={
 clientId:string;subject:string;email:string|null;accessToken:string;refreshToken:string;idToken:string;
 expiresAt:number;scopes:string[];
};
type Persisted={hostId:string;credentials:Credentials|null};
async function readJSON(response:Response):Promise<Record<string,unknown>>{
 return readApiJSON(response,AUTH);
}

export class DirectChatGPT{
 private current:Persisted|null=null;
 private busy=false;
 private renewing:Promise<void>|null=null;
 constructor(private readonly directory:string){}
 private get hostFile():string{return path.join(this.directory,'siwc-host.json');}
 private get secretFile():string{return path.join(this.directory,'siwc-credentials.bin');}
 private assertEncryption():void{
  if(!safeStorage.isEncryptionAvailable())throw Error('Betriebssystem-Schlüsselbund nicht verfügbar. Ohne sichere Verschlüsselung speichert Checkmate keine ChatGPT-Tokens.');
  if(process.platform==='linux'&&safeStorage.getSelectedStorageBackend()==='basic_text')
   throw Error('Unsicheres Linux-Keyring-Backend basic_text. Bitte KWallet oder GNOME Keyring aktivieren.');
 }
 private async load():Promise<Persisted>{
  if(this.current)return this.current;
  await fs.mkdir(this.directory,{recursive:true,mode:0o700});
  let hostId='';
  try{
   const raw=JSON.parse(await fs.readFile(this.hostFile,'utf8')) as unknown;
   hostId=string(asObject(raw).hostId);
  }catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error;}
  if(!/^urn:uuid:[a-f0-9-]{36}$/.test(hostId)){
   hostId='urn:uuid:'+randomUUID();
   await fs.writeFile(this.hostFile,JSON.stringify({hostId}),{encoding:'utf8',mode:0o600,flag:'wx'}).catch(async error=>{
    if((error as NodeJS.ErrnoException).code!=='EEXIST')throw error;
    hostId=string(asObject(JSON.parse(await fs.readFile(this.hostFile,'utf8')) as unknown).hostId);
   });
  }
  let credentials:Credentials|null=null;
  try{
   const encrypted=await fs.readFile(this.secretFile);
   this.assertEncryption();
   const data=JSON.parse(safeStorage.decryptString(encrypted)) as unknown;
   const obj=asObject(data);
   if(typeof obj.clientId==='string'&&typeof obj.accessToken==='string'&&typeof obj.refreshToken==='string'){
    credentials=obj as Credentials;
   }else throw Error('Ungültiger gespeicherter ChatGPT-Zugang.');
  }catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error;}
  this.current={hostId,credentials};
  return this.current;
 }
 private async persist():Promise<void>{
  if(!this.current)throw Error('Fehlender Anmeldestatus');
  await fs.mkdir(this.directory,{recursive:true,mode:0o700});
  this.assertEncryption();
  const destination=this.secretFile;
  if(!this.current.credentials){await fs.rm(destination,{force:true});return;}
  const encrypted=safeStorage.encryptString(JSON.stringify(this.current.credentials));
  const tmp=destination+'.'+randomUUID()+'.tmp';
  await fs.writeFile(tmp,encrypted,{mode:0o600,flag:'wx'});
  await fs.rename(tmp,destination);
 }
 async status():Promise<ChatGPTStatus>{
  try{
   const state=await this.load();const account=state.credentials;
   if(!account)return{available:true,connected:false,sharing:false,email:null,plan:null,detail:'Direkte ChatGPT-Anmeldung verfügbar. Keine zusätzliche CLI erforderlich.'};
   return {available:true,connected:true,sharing:account.scopes.includes(SCOPE),email:account.email,plan:null,
    detail:account.scopes.includes(SCOPE)?'ChatGPT verbunden · Plannutzung freigegeben':'ChatGPT verbunden · Plannutzung nicht freigegeben'};
  }catch(error){return{available:false,connected:false,sharing:false,email:null,plan:null,detail:error instanceof Error?error.message:'ChatGPT-Anmeldung nicht verfügbar'};}
 }
 async signIn():Promise<ChatGPTStatus>{
  if(this.busy)throw Error('Eine ChatGPT-Anmeldung läuft bereits.');
  this.busy=true;
  let server:Server|null=null;
  try{
   this.assertEncryption();
   const state=await this.load();
   const verifier=pkce(),nonce=pkce(),csrf=pkce();
   const prior=state.credentials;
   const callback=await new Promise<{server:Server;url:string;result:Promise<URL>}>( (resolve,reject)=>{
    const listener=createServer();
    let finish:(value:URL)=>void=()=>{};
    let fail:(reason:Error)=>void=()=>{};
    const result=new Promise<URL>((ok,no)=>{finish=ok;fail=no;});
    listener.on('request',(req,res)=>{
     const host=req.headers.host;
     if(host!==('127.0.0.1:'+String((listener.address() as {port:number}).port))||!req.url?.startsWith('/auth/callback?')){
      res.writeHead(404);res.end('Not found');return;
     }
     const url=new URL(req.url,'http://127.0.0.1');
     if(!secureCompare(url.searchParams.get('state')??'',csrf)){
      res.writeHead(400);res.end('Invalid state');fail(Error('OAuth-Status stimmt nicht überein.'));return;
     }
     res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'"});
     res.end('<!doctype html><html lang="de"><meta charset="utf-8"><title>Checkmate</title><body>ChatGPT-Anmeldung empfangen. Du kannst dieses Fenster schließen und zu Checkmate zurückkehren.</body></html>');
     finish(url);
    });
    listener.once('error',reject);
    listener.listen(0,'127.0.0.1',()=>{
     const address=listener.address();
     if(!address||typeof address==='string'){reject(Error('OAuth-Port fehlt'));return;}
     resolve({server:listener,url:'http://127.0.0.1:'+address.port+'/auth/callback',result});
    });
   });
   server=callback.server;
   const login=new URL(AUTH+'/api/accounts/authorize');
   login.searchParams.set('client_id',prior?.clientId??'dynamic_agent_client');
   login.searchParams.set('response_type','code');
   login.searchParams.set('redirect_uri',callback.url);
   login.searchParams.set('resource',RESOURCE);
   login.searchParams.set('scope',SCOPES);
   login.searchParams.set('ext_agent_host_id',state.hostId);
   login.searchParams.set('state',csrf);login.searchParams.set('nonce',nonce);
   login.searchParams.set('code_challenge_method','S256');login.searchParams.set('code_challenge',challenge(verifier));
   if(!prior)login.searchParams.set('agent_name_hint','Checkmate');
   else {login.searchParams.set('id_token_hint',prior.idToken);if(prior.email)login.searchParams.set('login_hint',prior.email);}
   await shell.openExternal(login.href);
   let timeout:NodeJS.Timeout|undefined;
   let received:URL;
   try{
    received=await Promise.race([callback.result,new Promise<never>((_,reject)=>{
     timeout=setTimeout(()=>reject(Error('ChatGPT-Anmeldung wurde nach fünf Minuten beendet.')),300_000);
    })]);
   }finally{if(timeout)clearTimeout(timeout);}
   const rejected=received.searchParams.get('error');
   if(rejected)throw Error('ChatGPT-Anmeldung abgelehnt: '+rejected);
   const code=received.searchParams.get('code');
   const issued=received.searchParams.get('client_id');
   const clientId=prior?.clientId??issued;
   if(!code||!clientId||clientId==='dynamic_agent_client')throw Error('OAuth-Registrierung ist unvollständig.');
   if(prior&&issued&&prior.clientId!==issued)throw Error('OAuth-Client-ID hat sich unerwartet geändert.');
   const tokenResponse=await fetch(AUTH+'/api/accounts/oauth/token',{
    method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({grant_type:'authorization_code',client_id:clientId,code,code_verifier:verifier,redirect_uri:callback.url,resource:RESOURCE}),
    signal:AbortSignal.timeout(25000)
   });
   const token=await readJSON(tokenResponse);
   const idToken=string(token.id_token);
   if(!idToken)throw Error('OpenAI lieferte kein ID-Token.');
   const verified=await jwtVerify(idToken,JWKS,{issuer:AUTH,audience:clientId});
   if(verified.payload.nonce!==nonce)throw Error('OAuth-Nonce ungültig.');
   if(typeof verified.payload.sub!=='string'||!verified.payload.sub)throw Error('Verifizierte Konto-ID fehlt.');
   if(prior&&verified.payload.sub!==prior.subject)throw Error('Ein anderes ChatGPT-Konto wurde angemeldet.');
   const accessToken=string(token.access_token),refreshToken=string(token.refresh_token);
   if(!accessToken||!refreshToken)throw Error('OpenAI lieferte unvollständige Zugangsdaten.');
   const scopes=string(token.scope).split(/\s+/).filter(Boolean);
   state.credentials={clientId,subject:verified.payload.sub,
    email:typeof verified.payload.email==='string'?verified.payload.email:null,
    accessToken,refreshToken,idToken,scopes,
    expiresAt:Date.now()+Math.max(1,Number(token.expires_in)||3600)*1000};
   await this.persist();
   return this.status();
  }finally{if(server)await new Promise<void>(done=>server?.close(()=>done()));this.busy=false;}
 }
 private async token():Promise<string>{
  const state=await this.load(),c=state.credentials;
  if(!c)throw Error('Bitte zuerst mit ChatGPT anmelden.');
  if(!c.scopes.includes(SCOPE))throw Error('ChatGPT-Plannutzung wurde nicht freigegeben. Bitte erneut anmelden und die Berechtigung erteilen.');
  if(c.expiresAt>Date.now()+90_000)return c.accessToken;
  if(!this.renewing)this.renewing=this.refresh().finally(()=>{this.renewing=null;});
  await this.renewing;
  if(!state.credentials)throw Error('ChatGPT-Konto wurde getrennt.');
  return state.credentials.accessToken;
 }
 private async refresh():Promise<void>{
  const state=await this.load(),c=state.credentials;
  if(!c)throw Error('ChatGPT-Anmeldung fehlt.');
  const response=await fetch(AUTH+'/api/accounts/oauth/token',{method:'POST',
   headers:{'Content-Type':'application/x-www-form-urlencoded'},
   body:new URLSearchParams({grant_type:'refresh_token',client_id:c.clientId,refresh_token:c.refreshToken,resource:RESOURCE}),
   signal:AbortSignal.timeout(25000)});
  const next=await readJSON(response);
  const newAccess=string(next.access_token),newRefresh=string(next.refresh_token);
  if(!newAccess||!newRefresh)throw Error('Token-Erneuerung war unvollständig. Erneut anmelden.');
  const idToken=string(next.id_token)||c.idToken;
  if(next.id_token){
   const verified=await jwtVerify(idToken,JWKS,{issuer:AUTH,audience:c.clientId});
   if(verified.payload.sub!==c.subject)throw Error('ChatGPT-Konto beim Erneuern verändert.');
  }
  state.credentials={...c,accessToken:newAccess,refreshToken:newRefresh,idToken,
   scopes:typeof next.scope==='string'?next.scope.split(/\s+/):c.scopes,
   expiresAt:Date.now()+Math.max(1,Number(next.expires_in)||3600)*1000};
  await this.persist();
 }
 async models():Promise<Model[]>{
  const access=await this.token();
  const response=await fetch(RESOURCE+'/models',{
   headers:{Authorization:'Bearer '+access,Accept:'application/json'},
   redirect:'error',
   signal:AbortSignal.timeout(20000)
  });
  const catalog=await readApiJSON(response,'https://api.openai.com');
  return parseModelCatalog(catalog);
 }
 async analyze(prompt:string,model:string,progress:(message:string)=>void,signal?:AbortSignal):Promise<{text:string;model:string}>{
  if(signal?.aborted)throw Error('Lehrbuchgenerierung abgebrochen.');
  const access=await this.token();
  const models=await this.models();
  if(!models.some(m=>m.slug===model))throw Error('Gewähltes Modell ist für dieses ChatGPT-Konto nicht freigegeben.');
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),300_000);
  try{
   const response=await fetch(RESOURCE+'/responses',{
    redirect:'error',
    method:'POST',headers:{Authorization:'Bearer '+access,'Content-Type':'application/json'},
    body:JSON.stringify({model,input:[{role:'user',content:prompt}],store:false,stream:true}),
    signal:signal?AbortSignal.any([signal,controller.signal]):controller.signal
   });
   if(!response.ok){await readApiJSON(response,'https://api.openai.com');throw Error('ChatGPT-Anfrage fehlgeschlagen.');}
   if(!response.body)throw Error('ChatGPT hat keinen Antwortstream geliefert.');
   const reader=response.body.getReader(),decoder=new TextDecoder(),parser=new ResponseStreamParser();
   let output='',completed=false;
   progress('ChatGPT erstellt das Lernkapitel …');
   const process=(items:StreamEvent[]):void=>{
    for(const event of items){
     if(event.type==='response.output_text.delta'){output+=event.delta??'';if(output.length>250_000)throw Error('Maximale Kapitellänge erreicht.');}
     if(event.type==='response.failed'||event.type==='response.incomplete')throw Error(event.response?.error?.message??event.response?.error?.code??'ChatGPT hat die Antwort nicht abgeschlossen.');
     if(event.type==='response.completed')completed=true;
    }
   };
   while(true){if(signal?.aborted)throw Error('Lehrbuchgenerierung abgebrochen.');const {done,value}=await reader.read();if(done)break;process(parser.push(decoder.decode(value,{stream:true}).replace(/\r\n/g,'\n')));}
   process(parser.push(decoder.decode().replace(/\r\n/g,'\n')));
   if(!completed)throw Error('ChatGPT hat keine vollständige Antwort bestätigt.');
   if(output.trim().length<80)throw Error('ChatGPT hat kein ausreichendes Lernkapitel geliefert.');
   return{text:output.trim(),model};
  }finally{clearTimeout(timer);}
 }
 async signOut():Promise<void>{
  const state=await this.load();
  const old=state.credentials;
  state.credentials=null;
  await this.persist();
  if(!old)return;
  try{
   const configuration=await fetch(AUTH+'/.well-known/openid-configuration',{signal:AbortSignal.timeout(10000)});
   const metadata=await readJSON(configuration);
   const endpoint=string(metadata.revocation_endpoint);
   const url=new URL(endpoint);
   if(url.protocol!=='https:'||url.hostname!=='auth.openai.com')throw Error('Ungültiger Revocation-Endpunkt.');
   const result=await fetch(url,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({token:old.refreshToken,token_type_hint:'refresh_token',client_id:old.clientId}),
    signal:AbortSignal.timeout(10000)});
   if(!result.ok)throw Error('OpenAI hat den Widerruf nicht bestätigt.');
  }catch{
   throw Error('Lokal abgemeldet. Der serverseitige Widerruf konnte nicht bestätigt werden. Trenne Checkmate bei Bedarf zusätzlich in den ChatGPT-Einstellungen.');
  }
 }
}
