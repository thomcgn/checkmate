import {promises as fs} from 'node:fs';
import path from 'node:path';
import {unzipSync} from 'fflate';
import {OFFICIAL_PACKS,type PackDefinition,type DocumentPackStatus,type PackProgress,type InstalledDocumentPack,type DocumentEntry} from '../shared/documentation';

const ZIP_LIMIT=60*1024*1024;
const UNPACK_LIMIT=180*1024*1024;
const FILE_LIMIT=10*1024*1024;
const TEXT=/\.(md|mdx|rst|txt)$/i;
const safePath=(s:string):boolean=>s.length<=380&&!s.startsWith('/')&&!s.includes('\\')&&!s.includes('\0')&&!s.split('/').includes('..');
const definition=(id:string):PackDefinition=>{
 const item=OFFICIAL_PACKS.find(p=>p.id===id);
 if(!item)throw Error('Unbekanntes Dokumentationspaket.');
 return item;
};
const shaValid=(s:unknown):s is string=>typeof s==='string'&&/^[a-f0-9]{40}$/.test(s);
const decoder=new TextDecoder('utf-8',{fatal:true});
type Fetcher=(url:string,options?:RequestInit)=>Promise<Response>;
export async function fetchOfficialPack(def:PackDefinition,progress:(p:PackProgress)=>void,
 fetcher:Fetcher=fetch):Promise<InstalledDocumentPack>{
 const api='https://api.github.com/repos/'+def.repo+'/commits/'+encodeURIComponent(def.ref);
 const meta=await fetcher(api,{redirect:'error',headers:{Accept:'application/vnd.github+json','User-Agent':'Checkmate-Documentation'},signal:AbortSignal.timeout(25000)});
 if(!meta.ok)throw Error('Offizieller Commit nicht erreichbar (HTTP '+meta.status+').');
 const result:unknown=await meta.json();
 const sha=result&&typeof result==='object'&&'sha' in result?result.sha:null;
 if(!shaValid(sha))throw Error('GitHub hat keinen gültigen Commit geliefert.');
 const url='https://codeload.github.com/'+def.repo+'/zip/'+sha;
 const response=await fetcher(url,{redirect:'error',signal:AbortSignal.timeout(120000)});
 if(!response.ok||!response.body)throw Error('Quellarchiv konnte nicht geladen werden (HTTP '+response.status+').');
 const declared=Number(response.headers.get('content-length')??'0');
 if(declared>ZIP_LIMIT)throw Error('Archiv überschreitet 60 MB.');
 const parts:Uint8Array[]=[];let size=0;
 for await(const part of response.body){
  const data=part instanceof Uint8Array?part:new Uint8Array(part);
  size+=data.length;
  if(size>ZIP_LIMIT)throw Error('Archiv überschreitet 60 MB.');
  parts.push(data);
  progress({id:def.id,phase:'downloading',detail:'Offizielles Archiv herunterladen',done:size,total:declared||ZIP_LIMIT});
 }
 const archive=new Uint8Array(size);let offset=0;
 for(const part of parts){archive.set(part,offset);offset+=part.length;}
 progress({id:def.id,phase:'extracting',detail:'Dokumentation überprüfen',done:0,total:1});
 let unpacked=0,matched=0;
 const extracted=unzipSync(archive,{filter:file=>{
  if(!safePath(file.name))throw Error('Unsicherer Archivpfad.');
  const i=file.name.indexOf('/');
  const relative=i<0?'':file.name.slice(i+1);
  if(!relative.startsWith(def.prefix)||file.name.endsWith('/'))return false;
  if(file.originalSize>FILE_LIMIT)throw Error('Offizielle Datei größer als 10 MB.');
  unpacked+=file.originalSize;
  if(unpacked>UNPACK_LIMIT)throw Error('Quelltext überschreitet 180 MB.');
  if(TEXT.test(relative)){matched++;return true;}
  return false;
 }});
 const documents:DocumentEntry[]=[];
 for(const [name,bytes] of Object.entries(extracted)){
  const relative=name.slice(name.indexOf('/')+1);
  if(!relative.startsWith(def.prefix))continue;
  const docPath=relative.slice(def.prefix.length);
  if(!safePath(docPath)||!docPath)throw Error('Unsicherer Dokumentpfad.');
  const text=decoder.decode(bytes);
  const heading=/^#{1,2}\s+(.+)$/m.exec(text);
  const title=heading?heading[1].replace(/[*\`]/g,'').trim():path.posix.basename(docPath).replace(/\.[^.]+$/,'').replace(/[-_]/g,' ');
  documents.push({path:docPath,title,text});
 }
 if(!matched||documents.length!==matched)throw Error('Dokumentationsarchiv unvollständig.');
 documents.sort((a,b)=>a.path.localeCompare(b.path,'en'));
 if(new Set(documents.map(x=>x.path)).size!==documents.length)throw Error('Dokumentationspfade sind nicht eindeutig.');
 return {id:def.id,language:def.language,title:def.title,sourceCommit:sha,
  sourceUrl:def.sourceUrl,license:def.license,licenseUrl:def.licenseUrl,
  extent:def.extent,installedAt:new Date().toISOString(),documents};
}
export class DocumentationStore{
 private busy=new Set<string>();
 constructor(private readonly directory:string){}
 private file(id:string):string{return path.join(this.directory,definition(id).id+'.json');}
 async load(id:string):Promise<InstalledDocumentPack|null>{
  definition(id);
  try{
   const data:unknown=JSON.parse(await fs.readFile(this.file(id),'utf8'));
   if(!data||typeof data!=='object')throw Error('Dokumentationspaket beschädigt.');
   const pack=data as InstalledDocumentPack;
   if(pack.id!==id||!shaValid(pack.sourceCommit)||!Array.isArray(pack.documents)||
     pack.documents.some(d=>!safePath(d.path)||typeof d.text!=='string'||typeof d.title!=='string'))
    throw Error('Dokumentationspaket beschädigt.');
   return pack;
  }catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return null;throw e;}
 }
 async statuses():Promise<DocumentPackStatus[]>{
  return Promise.all(OFFICIAL_PACKS.map(async item=>{
   const pack=await this.load(item.id);
   return {id:item.id,installed:pack!==null,count:pack?.documents.length??0,
    sourceCommit:pack?.sourceCommit??null,installedAt:pack?.installedAt??null};
  }));
 }
 async install(id:string,report:(v:PackProgress)=>void):Promise<DocumentPackStatus>{
  if(this.busy.has(id))throw Error('Import wird bereits ausgeführt.');
  this.busy.add(id);
  try{
   const pack=await fetchOfficialPack(definition(id),report);
   report({id,phase:'saving',detail:pack.documents.length+' Dokumente lokal speichern',done:0,total:1});
   await fs.mkdir(this.directory,{recursive:true,mode:0o700});
   const tmp=path.join(this.directory,id+'.'+pack.sourceCommit+'.tmp');
   await fs.writeFile(tmp,JSON.stringify(pack),{encoding:'utf8',mode:0o600,flag:'wx'});
   await fs.rename(tmp,this.file(id));
   report({id,phase:'finished',detail:'Kompletter Quelltextbestand dieses Pakets gespeichert',done:1,total:1});
   return {id,installed:true,count:pack.documents.length,sourceCommit:pack.sourceCommit,installedAt:pack.installedAt};
  }finally{this.busy.delete(id);}
 }
}
