import {promises as fs} from 'node:fs';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
import type {StudyChapterStatus,StudyChapterRecord} from '../shared/repository.ts';

type StudyFile={version:1;chapters:StudyChapterRecord[]};
const LIMIT_BYTES=5_000_000;
const LIMIT_RECORDS=50_000;
const validId=(value:string):boolean=>/^[a-f0-9-]{36}$/.test(value);
const validStatus=(value:unknown):value is StudyChapterStatus=>
 value==='unread'||value==='learning'||value==='understood';
const validRecord=(value:unknown):value is StudyChapterRecord=>{
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const item=value as Record<string,unknown>;
 return typeof item.bookId==='string'&&validId(item.bookId)&&
 typeof item.chapterIndex==='number'&&Number.isSafeInteger(item.chapterIndex)&&
 item.chapterIndex>=0&&item.chapterIndex<10000&&validStatus(item.status)&&
 typeof item.updatedAt==='string'&&!Number.isNaN(Date.parse(item.updatedAt))&&
 item.updatedAt.length<=40;
};
/** Local only: per-book and per-chapter mastery state, serialized and committed atomically. */
export class StudyProgressStore{
 private readonly file:string;
 private queue:Promise<void>=Promise.resolve();
 constructor(directory:string){this.file=path.join(directory,'book-study-progress.json');}
 private async read():Promise<StudyFile>{
  let data:string;
  try{
   const stat=await fs.lstat(this.file);
   if(!stat.isFile()||stat.size>LIMIT_BYTES)throw Error('Ungültige Lernfortschrittsdatei.');
   data=await fs.readFile(this.file,'utf8');
  }catch(error){
   if((error as NodeJS.ErrnoException).code==='ENOENT')return {version:1,chapters:[]};
   throw error;
  }
  const parsed:unknown=JSON.parse(data);
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw Error('Ungültiger Lernfortschritt.');
  const value=parsed as Record<string,unknown>;
  if(value.version!==1||!Array.isArray(value.chapters)||value.chapters.length>LIMIT_RECORDS||
   !value.chapters.every(validRecord))throw Error('Beschädigte Lernfortschrittsdaten.');
  const unique=new Set(value.chapters.map((item:StudyChapterRecord)=>item.bookId+':'+item.chapterIndex));
  if(unique.size!==value.chapters.length)throw Error('Lernfortschritt enthält doppelte Kapitel.');
  return {version:1,chapters:value.chapters as StudyChapterRecord[]};
 }
 async list(bookId:string):Promise<StudyChapterRecord[]>{
  if(!validId(bookId))throw Error('Ungültige Lernbuch-ID.');
  await this.queue;
  return (await this.read()).chapters.filter(item=>item.bookId===bookId)
   .sort((a,b)=>a.chapterIndex-b.chapterIndex);
 }
 async set(bookId:string,chapterIndex:number,status:StudyChapterStatus,chapterCount:number):Promise<StudyChapterRecord>{
  if(!validId(bookId)||!Number.isSafeInteger(chapterIndex)||chapterIndex<0||
   !Number.isSafeInteger(chapterCount)||chapterCount<1||chapterCount>10000||chapterIndex>=chapterCount||
   !validStatus(status))throw Error('Ungültiger Lernfortschritt oder unbekanntes Kapitel.');
  const operation=this.queue.then(async()=>{
   const data=await this.read();
   const record:StudyChapterRecord={bookId,chapterIndex,status,updatedAt:new Date().toISOString()};
   const chapters=data.chapters.filter(item=>!(item.bookId===bookId&&item.chapterIndex===chapterIndex));
   chapters.push(record);
   if(chapters.length>LIMIT_RECORDS)throw Error('Zu viele gespeicherte Lernstände.');
   const serialized=JSON.stringify({version:1,chapters});
   if(Buffer.byteLength(serialized)>LIMIT_BYTES)throw Error('Lernfortschrittsdaten überschreiten das Speicherlimit.');
   await fs.mkdir(path.dirname(this.file),{recursive:true,mode:0o700});
   const temporary=this.file+'.'+randomUUID()+'.tmp';
   try{
    await fs.writeFile(temporary,serialized,{encoding:'utf8',mode:0o600,flag:'wx'});
    await fs.rename(temporary,this.file);
   }finally{await fs.rm(temporary,{force:true});}
   return record;
  });
  this.queue=operation.then(()=>{},()=>{});
  return operation;
 }
}
