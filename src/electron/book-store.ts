import {promises as fs} from 'node:fs';
import path from 'node:path';
import type {RepositoryAnalysis} from '../shared/repository';
const allowed=(x:unknown):x is RepositoryAnalysis=>{
 if(!x||typeof x!=='object')return false;
 const o=x as Record<string,unknown>;
 return typeof o.id==='string'&&/^[a-f0-9-]{36}$/.test(o.id)&&typeof o.repository==='string'&&typeof o.head==='string'&&typeof o.title==='string'&&typeof o.markdown==='string'&&typeof o.createdAt==='string'&&Array.isArray(o.includedPaths)&&typeof o.files==='number'&&typeof o.model==='string';
};
export class BookStore{
 constructor(private readonly directory:string){}
 private get location():string{return path.join(this.directory,'repo-books.json');}
 async list():Promise<RepositoryAnalysis[]>{
  try{
   const text=await fs.readFile(this.location,'utf8');
   if(text.length>5_000_000)throw Error('Bibliotheksdatei ist zu groß.');
   const data:unknown=JSON.parse(text);
   return Array.isArray(data)?data.filter(allowed):[];
  }catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return [];throw error;}
 }
 private async write(data:RepositoryAnalysis[]):Promise<void>{
  await fs.mkdir(this.directory,{recursive:true,mode:0o700});
  const target=this.location+'.tmp';
  await fs.writeFile(target,JSON.stringify(data),{encoding:'utf8',mode:0o600});
  await fs.rename(target,this.location);
 }
 async add(book:RepositoryAnalysis):Promise<void>{
  if(!allowed(book)||book.markdown.length>250_000)throw Error('Ungültiges Lernbuch');
  const existing=await this.list();
  if(existing.length>=40)throw Error('Maximal 40 Analysebücher. Bitte zuerst alte Bücher entfernen.');
  await this.write([book,...existing]);
 }
 async remove(id:string):Promise<void>{if(!/^[a-f0-9-]{36}$/.test(id))throw Error('Ungültige Buch-ID');await this.write((await this.list()).filter(x=>x.id!==id));}
}
