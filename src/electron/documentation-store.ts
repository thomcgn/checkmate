import {promises as fs} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawn} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import {unzipSync} from 'fflate';
import {extract as extractTar} from 'tar';
import {NodeHtmlMarkdown} from 'node-html-markdown';
import {decodeDocumentationText} from './documentation-encoding.ts';
import {OFFICIAL_PACKS,type PackDefinition,type DocumentPackStatus,type PackProgress,type InstalledDocumentPack,type DocumentEntry,type DocumentView} from '../shared/documentation.ts';

const MAX_FILES=40_000;
const MAX_FILE=128*1024*1024;
const MAX_TOTAL=2*1024*1024*1024;
const digest=(data:Buffer):string=>createHash('sha256').update(data).digest('hex');
const valid=(s:string):boolean=>!!s&&s.length<440&&!s.includes('\0')&&!s.includes('\\')&&!s.startsWith('/')&&!s.split('/').includes('..');
const lookup=(id:string):PackDefinition=>{
 const found=OFFICIAL_PACKS.find(p=>p.id===id);
 if(!found)throw Error('Unbekanntes Dokumentationspaket.');
 return found;
};
const securePath=(root:string,relative:string):string=>{
 if(!valid(relative))throw Error('Unsicherer Pfad.');
 const target=path.resolve(root,relative);
 if(!target.startsWith(path.resolve(root)+path.sep))throw Error('Pfad verlässt den Dokumentationsordner.');
 return target;
};
const sha=(v:unknown):v is string=>typeof v==='string'&&/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(v);
const decode=decodeDocumentationText;
const plain=(value:string):string=>value.replace(/<!--[\s\S]*?-->/g,'')
 .replace(/<\?xml[\s\S]*?\?>/g,'')
 .replace(/<\/?(?:para|section|chapter|refsect\d|title|listitem|programlisting|screen|simpara|example|varlistentry|entry|row)\b[^>]*>/gi,'\n')
 .replace(/<[^>]+>/g,' ')
 .replace(/&(lt|gt|amp|quot|apos);/g,(_match,name:string)=>({lt:'<',gt:'>',amp:'&',quot:'"',apos:"'"} as Record<string,string>)[name])
 .replace(/\n{3,}/g,'\n\n');
function titleFor(relative:string,text:string):string{
 const xml=/<title(?:\s[^>]*)?>([^<]{2,180})<\/title>/i.exec(text);
 const md=/^#{1,3}\s+(.+)$/m.exec(text);
 const match=xml?.[1]??md?.[1];
 return match?match.replace(/[*\`]/g,'').trim():path.posix.basename(relative).replace(/\.[^.]+$/,'').replace(/[-_]/g,' ');
}
type Reporter=(p:PackProgress)=>void;
function runGit(args:string[],cwd:string,timeoutMs:number,maxOutput=100_000):Promise<string>{
 return new Promise((resolve,reject)=>{
  const child=spawn('git',args,{cwd,shell:false,windowsHide:true,
   env:{...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'never',GIT_CONFIG_NOSYSTEM:'1'},
   stdio:['ignore','pipe','pipe']});
  let stdout='',stderr='';
  child.stdout.setEncoding('utf8');child.stderr.setEncoding('utf8');
  child.stdout.on('data',(part:string)=>{stdout+=part.slice(0,100_000);if(stdout.length>maxOutput){child.kill();reject(Error('Git-Dateiliste überschreitet das Größenlimit.'));}});
  child.stderr.on('data',(part:string)=>{stderr+=part.slice(0,100_000);if(stderr.length>100_000)stderr=stderr.slice(-100_000);});
  const timer=setTimeout(()=>child.kill(),timeoutMs);
  child.once('error',error=>{clearTimeout(timer);reject(Error('Git konnte nicht gestartet werden: '+error.message));});
  child.once('close',code=>{
   clearTimeout(timer);
   if(code===0)resolve(stdout.trim());
   else reject(Error('Git-Import fehlgeschlagen ('+String(code)+'): '+stderr.slice(-300)));
  });
 });
}
async function walk(root:string,directory:string,result:string[]):Promise<void>{
 for(const entry of await fs.readdir(directory,{withFileTypes:true})){
  if(entry.isSymbolicLink()||entry.name==='.git')continue;
  const target=path.join(directory,entry.name);
  if(entry.isDirectory()){await walk(root,target,result);continue;}
  if(!entry.isFile())continue;
  const relative=path.relative(root,target).replace(/\\/g,'/');
  if(!valid(relative))throw Error('Unsicherer Dokumentationspfad');
  result.push(relative);
  if(result.length>MAX_FILES)throw Error('Mehr als 40.000 Dokumentationsdateien; Import abgebrochen.');
 }
}
/** Import every entry of a publisher-provided full HTML manual, including images. */
export async function importCompiledTarPack(def:PackDefinition,report:Reporter):Promise<{pack:InstalledDocumentPack;files:Map<string,Buffer>}>{
 if(!def.archiveUrl||def.archiveFormat!=='tar.gz')throw Error('Ungültiges Dokumentationsarchiv.');
 const staging=await fs.mkdtemp(path.join(os.tmpdir(),'checkmate-tar-'));
 try{
  const response=await fetch(def.archiveUrl,{signal:AbortSignal.timeout(150_000)});
  if(!response.ok||!response.body)throw Error('PHP-Offline-Handbuch nicht erreichbar (HTTP '+response.status+').');
  const reader=response.body.getReader();
  const chunks:Buffer[]=[];let received=0;
  try{
   while(true){
    const next=await reader.read();if(next.done)break;
    const chunk=Buffer.from(next.value);received+=chunk.length;
    if(received>75*1024*1024)throw Error('Offizielles Archiv überschreitet 75 MB.');
    chunks.push(chunk);
    report({id:def.id,phase:'downloading',detail:'Komplettes HTML-Handbuch herunterladen',done:received,total:Number(response.headers.get('content-length')??0)||75*1024*1024});
   }
  }finally{reader.releaseLock();}
  const bytes=Buffer.concat(chunks,received);
  const revision=digest(bytes);
  const archiveFile=path.join(staging,'manual.tar.gz');
  await fs.writeFile(archiveFile,bytes,{mode:0o600});
  let count=0,total=0;
  await extractTar({file:archiveFile,cwd:staging,strict:true,preservePaths:false,
   filter:(name,entry)=>{
    if(!valid(name)&&name!=='./')throw Error('Unsicherer Pfad im Originalhandbuch.');
    const entryType='type' in entry?entry.type:(entry.isDirectory()?'Directory':entry.isFile()?'File':'Other');
    if(entryType==='Directory')return true;
    if(entryType!=='File')throw Error('Nicht unterstützter Dateityp im Archiv: '+entryType);
    if(entry.size>MAX_FILE)throw Error('Dokumentationsdatei überschreitet 128 MB.');
    total+=entry.size;
    if(total>MAX_TOTAL)throw Error('PHP-Handbuch überschreitet 2 GB entpackt.');
    if(++count>MAX_FILES)throw Error('PHP-Handbuch enthält zu viele Dateien.');
    return true;
   }});
  await fs.rm(archiveFile);
  const paths:string[]=[];await walk(staging,staging,paths);
  if(paths.length!==count)throw Error('PHP-Handbuch nicht vollständig entpackt ('+paths.length+'/'+count+').');
  paths.sort();
  const files=new Map<string,Buffer>(),documents:DocumentEntry[]=[],assets:DocumentEntry[]=[];
  for(let i=0;i<paths.length;i++){
   const relative=paths[i],data=await fs.readFile(securePath(staging,relative));
   const text=def.extensions.some(ext=>relative.toLowerCase().endsWith(ext));
   const contents=text?decode(data):'';
   const entry:DocumentEntry={path:relative,title:text?titleFor(relative,contents):path.posix.basename(relative),
    bytes:data.length,sha256:digest(data),text};
   files.set(relative,data);
   (text?documents:assets).push(entry);
   if(i%200===0)report({id:def.id,phase:'extracting',detail:'HTML und Medien überprüfen',done:i+1,total:paths.length});
  }
  if(documents.length<100)throw Error('Das Offline-Handbuch enthält unerwartet wenige HTML-Kapitel.');
  return{pack:{id:def.id,language:def.language,title:def.title,sourceCommit:revision,
   sourceUrl:def.sourceUrl,license:def.license,licenseUrl:def.licenseUrl,extent:def.extent,
   installedAt:new Date().toISOString(),documents,assets},files};
 }finally{await fs.rm(staging,{recursive:true,force:true}).catch(()=>{});}
}

/** Official, version-pinned C++ HTML-book release; every document and asset is preserved. */
export async function importArchivePack(def:PackDefinition,report:Reporter):Promise<{pack:InstalledDocumentPack;files:Map<string,Buffer>}>{
 if(!def.archiveUrl)throw Error('Kein vollständiges Archiv für diese Publikation hinterlegt.');
 const tag=await fetch('https://api.github.com/repos/'+def.repo+'/git/ref/tags/'+def.ref,{
  headers:{Accept:'application/vnd.github+json','User-Agent':'Checkmate-Documentation',...(process.env.GITHUB_TOKEN?{Authorization:'Bearer '+process.env.GITHUB_TOKEN}:{})},signal:AbortSignal.timeout(20000)});
 if(!tag.ok)throw Error('Archiv-Version kann nicht bestätigt werden (HTTP '+tag.status+').');
 const metadata:unknown=await tag.json();
 const object=metadata&&typeof metadata==='object'&&'object'in metadata?metadata.object:null;
 const id=object&&typeof object==='object'&&'sha'in object?object.sha:null;
 if(!sha(id))throw Error('Archiv-Quellversion ist nicht prüfbar.');
 const response=await fetch(def.archiveUrl,{signal:AbortSignal.timeout(150_000)});
 if(!response.ok||!response.body)throw Error('Offline-Archiv kann nicht geladen werden (HTTP '+response.status+').');
 let received=0;
 const parts:Uint8Array[]=[];
 const reader=response.body.getReader();
 try{
  while(true){
   const next=await reader.read();
   if(next.done)break;
   const item=next.value;
   received+=item.length;
   if(received>75*1024*1024)throw Error('Offline-Archiv größer als 75 MB.');
   parts.push(item);
   report({id:def.id,phase:'downloading',detail:'Vollständiges C++-Offline-Archiv herunterladen',done:received,total:Number(response.headers.get('content-length')??0)||75*1024*1024});
  }
 }finally{reader.releaseLock();}
 const buffer=new Uint8Array(received);let cursor=0;
 for(const part of parts){buffer.set(part,cursor);cursor+=part.length;}
 let total=0,count=0;
 report({id:def.id,phase:'extracting',detail:'Originalkapitel und Ressourcen prüfen',done:0,total:1});
 const archive=unzipSync(buffer,{filter:file=>{
  if(!valid(file.name))throw Error('Archiv enthält ungültige Pfade.');
  if(file.name.endsWith('/'))return false;
  if(file.originalSize>MAX_FILE)throw Error('Ein Archivbestandteil überschreitet 128 MB.');
  total+=file.originalSize;
  if(total>MAX_TOTAL)throw Error('Entpacktes Archiv überschreitet 2 GB.');
  if(++count>MAX_FILES)throw Error('Archiv enthält mehr als 40.000 Dateien.');
  return true;
 }});
 const files=new Map<string,Buffer>();
 const documents:DocumentEntry[]=[],assets:DocumentEntry[]=[];
 let done=0;
 for(const [relative,raw] of Object.entries(archive)){
  const data=Buffer.from(raw);
  const isText=def.extensions.some(ext=>relative.toLowerCase().endsWith(ext));
  const content=isText?decode(data):'';
  const entry:DocumentEntry={path:relative,title:isText?titleFor(relative,content):path.posix.basename(relative),bytes:data.length,sha256:digest(data),text:isText};
  files.set(relative,data);
  if(isText)documents.push(entry);else assets.push(entry);
  if(++done%250===0)report({id:def.id,phase:'extracting',detail:'Archivkapitel erfassen',done,total:count});
 }
 if(!documents.length||files.size!==count)throw Error('Offline-Archiv konnte nicht vollständig übernommen werden.');
 documents.sort((a,b)=>a.path.localeCompare(b.path));
 return{pack:{id:def.id,language:def.language,title:def.title,sourceCommit:id,
  sourceUrl:def.sourceUrl,license:def.license,licenseUrl:def.licenseUrl,
  extent:def.extent,installedAt:new Date().toISOString(),documents,assets},files};
}

/** Sparse git fetch downloads the complete requested source subtree, NOT a small preview. */
export async function importOfficialPack(def:PackDefinition,report:Reporter):Promise<{pack:InstalledDocumentPack;files:Map<string,Buffer>}>{
 if(def.archiveFormat==='tar.gz')return importCompiledTarPack(def,report);
 if(def.archiveUrl)return importArchivePack(def,report);
 const staging=await fs.mkdtemp(path.join(os.tmpdir(),'checkmate-docs-'));
 try{
  report({id:def.id,phase:'downloading',detail:'Offizielle Dokumentationsquelle vorbereiten',done:0,total:1});
  await runGit(['clone','--filter=blob:none','--depth=1','--single-branch','--sparse','--no-checkout','--branch',def.ref,
   '--','https://github.com/'+def.repo+'.git',staging],os.tmpdir(),120_000);
  const folder=def.prefix==='.'?'.':def.prefix.replace(/\/$/,'');
  if(folder==='.'){
   // A root-scoped publication must materialize every tracked directory;
   // cone mode with "." alone only checks out root-level files.
   await runGit(['-C',staging,'sparse-checkout','disable'],staging,180_000);
  }else{
   await runGit(['-C',staging,'sparse-checkout','set','--cone',folder],staging,90_000);
  }
  await runGit(['-C',staging,'checkout','--force'],staging,180_000);
  const commit=await runGit(['-C',staging,'rev-parse','HEAD'],staging,15000);
  if(!sha(commit))throw Error('Git hat keinen verifizierbaren Commit geliefert.');
  const directory=folder==='.'?staging:path.join(staging,folder);
  const selected:string[]=[];
  await walk(staging,directory,selected);
  // Cross-check the materialized directory against Git's tracked source tree;
  // a sparse checkout must never silently omit documentation.
  const listed=await runGit(['-C',staging,'ls-files','-z','--',folder],staging,40_000,16_000_000);
  const tracked=listed.split('\0').filter(Boolean);
  const materialized=new Set(selected);
  if(tracked.length!==selected.length||tracked.some(file=>!materialized.has(file)))
   throw Error('Der ausgecheckte Dokumentationsbestand ist unvollständig ('+selected.length+'/'+tracked.length+' Dateien).');
  if(!selected.length)throw Error('Keine Dokumentationskapitel in der ausgewählten Originalquelle gefunden.');
  selected.sort();
  const files=new Map<string,Buffer>();
  const documents:DocumentEntry[]=[];
  const assets:DocumentEntry[]=[];let used=0;
  for(let i=0;i<selected.length;i++){
   const relative=selected[i];
   const full=securePath(staging,relative);
   const stat=await fs.stat(full);
   if(stat.size>MAX_FILE)throw Error('Originaldatei überschreitet 128 MB: '+relative);
   used+=stat.size;if(used>MAX_TOTAL)throw Error('Quellpublikation überschreitet 2 GB Text.');
   const data=await fs.readFile(full);
   const isText=def.extensions.some(ext=>relative.toLowerCase().endsWith(ext));
   const contents=isText?decode(data):'';
   files.set(relative,data);
   const entry:DocumentEntry={path:relative,title:isText?titleFor(relative,contents):path.posix.basename(relative),bytes:data.length,sha256:digest(data),text:isText};
   if(isText)documents.push(entry);else assets.push(entry);
   if(i%25===0||i===selected.length-1)report({id:def.id,phase:'extracting',detail:'Kapitel erfassen: '+relative,done:i+1,total:selected.length});
  }
  if(!documents.length)throw Error('Keine lesbaren Dokumentationskapitel im Originalbestand gefunden.');
  const pack:InstalledDocumentPack={id:def.id,title:def.title,language:def.language,sourceCommit:commit,
   sourceUrl:def.sourceUrl,license:def.license,licenseUrl:def.licenseUrl,extent:def.extent,
   installedAt:new Date().toISOString(),documents,assets};
  return {pack,files};
 }finally{await fs.rm(staging,{recursive:true,force:true}).catch(()=>{});}
}
export class DocumentationStore{
 private active=new Set<string>();
 private readonly directory:string;
 constructor(directory:string){this.directory=directory;}
 private directoryFor(id:string):string{return path.join(this.directory,lookup(id).id);}
 private index(id:string):string{return path.join(this.directoryFor(id),'index.json');}
 async load(id:string):Promise<InstalledDocumentPack|null>{
  lookup(id);
  try{
   const data:unknown=JSON.parse(await fs.readFile(this.index(id),'utf8'));
   if(!data||typeof data!=='object')throw Error('Dokumentationsindex beschädigt.');
   const pack=data as InstalledDocumentPack;
   if(pack.id!==id||!sha(pack.sourceCommit)||!Array.isArray(pack.documents)||
    !pack.documents.length||pack.documents.some(d=>!valid(d.path)||typeof d.title!=='string'||typeof d.bytes!=='number'||! /^[a-f0-9]{64}$/.test(d.sha256))||
    !Array.isArray(pack.assets)||pack.assets.some(a=>!valid(a.path)||! /^[a-f0-9]{64}$/.test(a.sha256)))
    throw Error('Dokumentationsindex beschädigt.');
   return pack;
  }catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return null;throw error;}
 }
 async statuses():Promise<DocumentPackStatus[]>{
  return Promise.all(OFFICIAL_PACKS.map(async item=>{
   const existing=await this.load(item.id);
   return{id:item.id,installed:existing!==null,count:existing?.documents.length??0,
    sourceCommit:existing?.sourceCommit??null,installedAt:existing?.installedAt??null};
  }));
 }
 async readDocument(id:string,relative:string):Promise<DocumentView>{
  const pack=await this.load(id);
  const entry=pack?.documents.find(d=>d.path===relative);
  if(!entry)throw Error('Dokumentationseintrag ist nicht installiert.');
  const file=securePath(path.join(this.directoryFor(id),'files'),relative);
  const raw=await fs.readFile(file);
  if(raw.length!==entry.bytes||digest(raw)!==entry.sha256)throw Error('Offline-Dokumentation beschädigt: '+entry.path);
  const content=decode(raw);
  return{path:entry.path,title:entry.title,text:/\.html?$/i.test(entry.path)?NodeHtmlMarkdown.translate(content):entry.path.endsWith('.xml')?plain(content):content};
 }
 async readAsset(id:string,relative:string):Promise<string>{
  const pack=await this.load(id);
  const entry=pack?.assets.find(d=>d.path===relative);
  if(!entry)throw Error('Begleitdatei ist nicht im Offline-Paket enthalten.');
  const ext=path.extname(entry.path).toLowerCase();
  const types:Record<string,string>={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.svg':'image/svg+xml'};
  const type=types[ext];
  if(!type)throw Error('Dieser Dateityp darf nicht im Viewer dargestellt werden.');
  const data=await fs.readFile(securePath(path.join(this.directoryFor(id),'files'),entry.path));
  if(data.length!==entry.bytes||digest(data)!==entry.sha256)throw Error('Offline-Bild beschädigt.');
  if(data.length>2*1024*1024)throw Error('Bild ist für die Vorschau zu groß.');
  // SVG may embed remote resources or script content; block it instead of executing XML.
  if(ext==='.svg')throw Error('SVG wird aus Sicherheitsgründen nicht direkt angezeigt.');
  return 'data:'+type+';base64,'+data.toString('base64');
 }
 async searchPack(id:string,query:string):Promise<readonly string[]>{
  const pack=await this.load(id);
  if(!pack)return [];
  const words=query.trim().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().split(/\s+/).filter(Boolean);
  if(!words.length)return pack.documents.map(d=>d.path);
  const matches:string[]=[];
  for(const doc of pack.documents){
   const text=(doc.path+' '+doc.title+' '+await fs.readFile(securePath(path.join(this.directoryFor(id),'files'),doc.path),'utf8'))
    .normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
   if(words.every(w=>text.includes(w)))matches.push(doc.path);
  }
  return matches;
 }
 async install(id:string,report:Reporter):Promise<DocumentPackStatus>{
  if(this.active.has(id))throw Error('Installation bereits aktiv.');
  this.active.add(id);
  let temp:string|null=null;
  try{
   const {pack,files}=await importOfficialPack(lookup(id),report);
   await fs.mkdir(this.directory,{recursive:true,mode:0o700});
   temp=path.join(this.directory,id+'.'+randomUUID()+'.tmp');
   await fs.mkdir(temp,{recursive:true,mode:0o700});
   for(const [relative,text] of files){
    const file=securePath(path.join(temp,'files'),relative);
    await fs.mkdir(path.dirname(file),{recursive:true});
    await fs.writeFile(file,text);
   }
   report({id,phase:'saving',detail:'Vollständigkeit der lokalen Dateisammlung prüfen',done:0,total:1});
   for(const doc of [...pack.documents,...pack.assets]){
    const bytes=await fs.readFile(securePath(path.join(temp,'files'),doc.path));
    if(bytes.length!==doc.bytes||digest(bytes)!==doc.sha256)throw Error('Unvollständige importierte Datei: '+doc.path);
   }
   await fs.writeFile(path.join(temp,'index.json'),JSON.stringify(pack),{mode:0o600});
   const dest=this.directoryFor(id);
   const old=dest+'.old-'+randomUUID();
   let existed=false;
   try{await fs.rename(dest,old);existed=true;}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
   try{await fs.rename(temp,dest);temp=null;}catch(e){if(existed)await fs.rename(old,dest);throw e;}
   if(existed)await fs.rm(old,{recursive:true,force:true});
   report({id,phase:'finished',detail:pack.documents.length+' Kapitel und '+pack.assets.length+' Begleitdateien verifiziert',done:1,total:1});
   return{id,installed:true,count:pack.documents.length,sourceCommit:pack.sourceCommit,installedAt:pack.installedAt};
  }finally{if(temp)await fs.rm(temp,{recursive:true,force:true}).catch(()=>{});this.active.delete(id);}
 }
}
