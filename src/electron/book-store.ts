import {promises as fs} from 'node:fs';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
import type {RepositoryAnalysis} from '../shared/repository';

const MAX_BOOKS=2000;
const MAX_BOOK_BYTES=700_000;
const MAX_LEGACY_BYTES=16_000_000;
const validId=(id:string):boolean=>/^[a-f0-9-]{36}$/.test(id);
const allowed=(x:unknown):x is RepositoryAnalysis=>{
 if(!x||typeof x!=='object'||Array.isArray(x))return false;
 const o=x as Record<string,unknown>;
 return typeof o.id==='string'&&validId(o.id)&&typeof o.repository==='string'&&
  typeof o.head==='string'&&typeof o.title==='string'&&typeof o.markdown==='string'&&
  typeof o.createdAt==='string'&&Array.isArray(o.includedPaths)&&
  o.includedPaths.every(p=>typeof p==='string')&&typeof o.files==='number'&&typeof o.model==='string';
};
const isNotFound=(e:unknown):boolean=>(e as NodeJS.ErrnoException).code==='ENOENT';

/** Atomic per-book storage, with a one-time non-destructive migration from repo-books.json. */
export class BookStore{
 private initialization:Promise<void>|null=null;
 private readonly directory:string;
 constructor(directory:string){this.directory=directory;}
 private get legacy():string{return path.join(this.directory,'repo-books.json');}
 private get folder():string{return path.join(this.directory,'repo-books');}
 private get marker():string{return path.join(this.folder,'migration-complete.json');}
 private bookFile(id:string):string{
  if(!validId(id))throw Error('Ungültige Buch-ID');
  return path.join(this.folder,id+'.json');
 }
 private async atomicWrite(target:string,contents:string):Promise<void>{
  const temp=target+'.'+randomUUID()+'.tmp';
  try{
   await fs.writeFile(temp,contents,{encoding:'utf8',mode:0o600,flag:'wx'});
   await fs.rename(temp,target);
  }finally{await fs.rm(temp,{force:true});}
 }
 private async migrate():Promise<void>{
  await fs.mkdir(this.folder,{recursive:true,mode:0o700});
  try{await fs.access(this.marker);return;}catch(e){if(!isNotFound(e))throw e;}
  let legacyBooks:RepositoryAnalysis[]=[];
  try{
   const stat=await fs.stat(this.legacy);
   if(stat.size>MAX_LEGACY_BYTES)throw Error('Alte Lehrbuchbibliothek überschreitet die Migrationsgrenze.');
   const data:unknown=JSON.parse(await fs.readFile(this.legacy,'utf8'));
   if(!Array.isArray(data))throw Error('Ungültige alte Lehrbuchbibliothek.');
   legacyBooks=data.filter(allowed);
   if(legacyBooks.length>MAX_BOOKS)throw Error('Alte Lehrbuchbibliothek enthält zu viele Bücher.');
  }catch(e){if(!isNotFound(e))throw e;}
  for(const book of legacyBooks){
   const dest=this.bookFile(book.id);
   try{await fs.access(dest);continue;}catch(e){if(!isNotFound(e))throw e;}
   const serialized=JSON.stringify(book);
   if(Buffer.byteLength(serialized)>MAX_BOOK_BYTES)throw Error('Altes Lehrbuch ist für die Migration zu groß.');
   await this.atomicWrite(dest,serialized);
  }
  await this.atomicWrite(this.marker,JSON.stringify({version:1,migratedAt:new Date().toISOString()}));
  // The original repo-books.json deliberately remains as an untouched backup.
 }
 private async ready():Promise<void>{
  if(!this.initialization){
   this.initialization=this.migrate().catch(e=>{this.initialization=null;throw e;});
  }
  await this.initialization;
 }
 async list():Promise<RepositoryAnalysis[]>{
  await this.ready();
  const filenames=(await fs.readdir(this.folder)).filter(name=>/^[a-f0-9-]{36}\.json$/.test(name));
  if(filenames.length>MAX_BOOKS)throw Error('Lehrbuchbibliothek überschreitet die erlaubte Buchanzahl.');
  const books:RepositoryAnalysis[]=[];
  for(const filename of filenames){
   const file=path.join(this.folder,filename);
   const stat=await fs.lstat(file);
   if(!stat.isFile()||stat.size>MAX_BOOK_BYTES)throw Error('Ungültige Buchdatei: '+filename);
   const book:unknown=JSON.parse(await fs.readFile(file,'utf8'));
   if(!allowed(book)||book.id+'.json'!==filename)throw Error('Beschädigtes Lehrbuch: '+filename);
   books.push(book);
  }
  return books.sort((a,b)=>{
   const left=a.teachingBook?.series,right=b.teachingBook?.series;
   if(left&&right&&a.repository===b.repository&&a.head===b.head&&left.title===right.title)
    return left.volume-right.volume;
   return b.createdAt.localeCompare(a.createdAt)||a.id.localeCompare(b.id);
  });
 }
 async add(book:RepositoryAnalysis):Promise<void>{
  if(!allowed(book)||book.markdown.length>250_000)throw Error('Ungültiges Lernbuch');
  const serialized=JSON.stringify(book);
  if(Buffer.byteLength(serialized)>MAX_BOOK_BYTES)throw Error('Lernbuch überschreitet die Speichergrenze.');
  const existing=await this.list();
  if(existing.length>=MAX_BOOKS)throw Error('Maximal 2000 Lehrbücher. Bitte zuerst alte Bücher entfernen.');
  if(existing.some(b=>b.id===book.id))throw Error('Lernbuch-ID bereits vorhanden.');
  await this.atomicWrite(this.bookFile(book.id),serialized);
 }
 async remove(id:string):Promise<void>{
  await this.ready();
  await fs.rm(this.bookFile(id),{force:true});
 }
}
