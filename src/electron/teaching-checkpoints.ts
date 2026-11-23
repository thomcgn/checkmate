import {createHash,randomUUID} from 'node:crypto';
import {promises as fs} from 'node:fs';
import path from 'node:path';
import type {RepositorySnapshot} from './repo-sources';
import type {LessonSection} from '../shared/repository';

export type TeachingOutline={title:string;goals:string[];topics:{title:string;objective:string}[]};
export type TeachingCheckpoint={
 version:1;fingerprint:string;model:string;outline:TeachingOutline;chapters:LessonSection[];savedAt:string;
};

/** Hash the exact provided source excerpts, not just the repository HEAD. */
export function teachingFingerprint(snapshot:RepositorySnapshot,model:string):string{
 return createHash('sha256').update(JSON.stringify({repository:snapshot.preview.repository,head:snapshot.preview.head,
  model,sources:snapshot.sources.map(s=>({path:s.path,content:s.content}))})).digest('hex');
}
const isObject=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const isValid=(v:unknown):v is TeachingCheckpoint=>{
 if(!isObject(v)||v.version!==1||typeof v.fingerprint!=='string'||!/^[0-9a-f]{64}$/.test(v.fingerprint)||
  typeof v.model!=='string'||!isObject(v.outline)||typeof v.outline.title!=='string'||
  !Array.isArray(v.outline.goals)||!v.outline.goals.every(x=>typeof x==='string')||
  !Array.isArray(v.outline.topics)||!v.outline.topics.every(x=>isObject(x)&&typeof x.title==='string'&&typeof x.objective==='string')||
  !Array.isArray(v.chapters)||v.chapters.length>4||typeof v.savedAt!=='string')return false;
 return v.chapters.every(x=>isObject(x)&&typeof x.title==='string'&&typeof x.explanation==='string'&&
   typeof x.exercise==='string'&&typeof x.solution==='string'&&Array.isArray(x.sourcePaths)&&
   x.sourcePaths.every(p=>typeof p==='string'));
};
export class TeachingCheckpointStore{
 constructor(private readonly root:string){}
 private location(key:string):string{
  if(!/^[0-9a-f]{64}$/.test(key))throw Error('Ungültiger Checkpoint-Schlüssel.');
  return path.join(this.root,key+'.json');
 }
 async load(key:string):Promise<TeachingCheckpoint|null>{
  try{
   const filename=this.location(key);
   const stats=await fs.stat(filename);
   if(stats.size>260_000)throw Error('Lehrbuch-Checkpoint überschreitet Größenlimit.');
   const raw:unknown=JSON.parse(await fs.readFile(filename,'utf8'));
   if(!isValid(raw)||raw.fingerprint!==key)throw Error('Beschädigter Lehrbuch-Checkpoint.');
   return raw;
  }catch(error){
   if((error as NodeJS.ErrnoException).code==='ENOENT')return null;
   throw error;
  }
 }
 async save(checkpoint:TeachingCheckpoint):Promise<void>{
  if(!isValid(checkpoint))throw Error('Ungültiger Lehrbuch-Checkpoint.');
  const content=JSON.stringify(checkpoint);
  if(Buffer.byteLength(content)>260_000)throw Error('Checkpoint überschreitet Größenlimit.');
  await fs.mkdir(this.root,{recursive:true,mode:0o700});
  const destination=this.location(checkpoint.fingerprint);
  const tmp=path.join(this.root,checkpoint.fingerprint+'.'+randomUUID()+'.tmp');
  try{
   await fs.writeFile(tmp,content,{encoding:'utf8',flag:'wx',mode:0o600});
   await fs.rename(tmp,destination);
  }finally{await fs.rm(tmp,{force:true});}
 }
 async remove(key:string):Promise<void>{await fs.rm(this.location(key),{force:true});}
}
