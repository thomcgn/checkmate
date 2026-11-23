import {app,BrowserWindow,shell,ipcMain} from 'electron';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {fetchRepository,parseRepo,buildLearningPrompt,type RepositorySnapshot} from './repo-sources';
import {DirectChatGPT} from './direct-chatgpt';
import {BookStore} from './book-store';
import {DocumentationStore} from './documentation-store';
import type {PackProgress} from '../shared/documentation';
import type {RepositoryAnalysis,RepoProgress} from '../shared/repository';
let window:BrowserWindow|null=null;
let chatgpt:DirectChatGPT;
let store:BookStore;
let documentation:DocumentationStore;
let busy=false;
let snapshot:RepositorySnapshot|null=null;
const startedAt=()=>Date.now();
function publish(progress:RepoProgress):void{
 if(window&&!window.isDestroyed())window.webContents.send('checkmate:repo-progress',progress);
}
function guard(event:Electron.IpcMainInvokeEvent):void{
 if(!window||event.sender!==window.webContents||event.senderFrame!==window.webContents.mainFrame)
  throw Error('Unerlaubter Zugriff auf die Desktop-Schnittstelle.');
 const url=event.senderFrame.url;
 const trustedFile=pathToFileURL(path.join(__dirname,'../../dist-renderer/index.html')).href;
 const trustedDev=process.env.CHECKMATE_DEV_URL??'http://localhost:5173/';
 if(url!==trustedFile&&(app.isPackaged||url!==trustedDev))
  throw Error('Ungültige Renderer-Herkunft');
}
function handle(name:string,action:(...args:unknown[])=>unknown):void{
 ipcMain.handle('checkmate:'+name,(event,...args:unknown[])=>{guard(event);return action(...args);});
}
function createWindow():void{
 window=new BrowserWindow({
  width:1360,height:850,minWidth:800,minHeight:540,
  title:'CHECKMATE · Understand the code',
  backgroundColor:'#100f18',
  show:false,
  webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,sandbox:true,nodeIntegration:false,webSecurity:true}
 });
 window.once('ready-to-show',()=>window?.show());
 window.webContents.setWindowOpenHandler(({url})=>{
  if(url.startsWith('https://'))void shell.openExternal(url);
  return {action:'deny'};
 });
 window.webContents.on('will-navigate',(event,url)=>{
  const allowed=url===pathToFileURL(path.join(__dirname,'../../dist-renderer/index.html')).href||
   (!app.isPackaged&&url===(process.env.CHECKMATE_DEV_URL??'http://localhost:5173/'));
  if(!allowed){event.preventDefault();if(url.startsWith('https://'))void shell.openExternal(url);}
 });
 if(!app.isPackaged&&process.env.CHECKMATE_DEV_URL){
  void window.loadURL(process.env.CHECKMATE_DEV_URL);
 }else{
  void window.loadURL(pathToFileURL(path.join(__dirname,'../../dist-renderer/index.html')).href);
 }
 window.on('closed',()=>{window=null;});
}
app.whenReady().then(()=>{
 store=new BookStore(app.getPath('userData'));
 documentation=new DocumentationStore(path.join(app.getPath('userData'),'offline-documentation'));
 chatgpt=new DirectChatGPT(path.join(app.getPath('userData'),'chatgpt'));
 handle('docs:status',()=>documentation.statuses());
 handle('docs:load',(id)=>{if(typeof id!=='string')throw Error('Ungültiges Dokumentationspaket');return documentation.load(id);});
 handle('docs:install',(id)=>{if(typeof id!=='string')throw Error('Ungültiges Dokumentationspaket');return documentation.install(id,(progress:PackProgress)=>{
  if(window&&!window.isDestroyed())window.webContents.send('checkmate:docs-progress',progress);
 });});
 handle('repo:preview',async(url)=>{
  if(typeof url!=='string'||url.length>220)throw Error('Ungültige Repository-Adresse');
  const start=startedAt();
  snapshot=await fetchRepository(url,(done,total,detail)=>publish({phase:'fetching',done,total,detail,startedAt:start}));
  return snapshot.preview;
 });
 handle('repo:status',()=>chatgpt.status());
 handle('repo:signin',()=>chatgpt.signIn());
 handle('repo:signout',async()=>{await chatgpt.signOut();return chatgpt.status();});
 handle('repo:models',()=>chatgpt.models());
 handle('repo:saved',()=>store.list());
 handle('repo:remove',async(id)=>{
  if(typeof id!=='string')throw Error('Ungültige Buch-ID');
  if(busy)throw Error('Analyse läuft bereits');
  await store.remove(id);
 });
 handle('repo:analyze',async(url,consent,model)=>{
  if(typeof url!=='string'||url.length>220||consent!==true||typeof model!=='string'||model.length>150)throw Error('Repository, ChatGPT-Modell und ausdrückliche Codeübermittlungsfreigabe erforderlich.');
  if(busy)throw Error('Eine Analyse läuft bereits');
  if(!snapshot||snapshot.preview.repository!==parseRepo(url))throw Error('Bitte Repository zuerst prüfen.');
  busy=true;
  const start=startedAt();
  try{
   const selected=snapshot;
   publish({phase:'analyzing',done:0,total:1,detail:'ChatGPT erstellt dein Lernbuch',startedAt:start});
   const result=await chatgpt.analyze(buildLearningPrompt(selected),model,detail=>publish({phase:'analyzing',done:0,total:1,detail,startedAt:start}));
   const book:RepositoryAnalysis={id:randomUUID(),repository:selected.preview.repository,head:selected.preview.head,
    title:'Code verstehen: '+selected.preview.repository,createdAt:new Date().toISOString(),model:result.model,
    files:selected.preview.included,includedPaths:[...selected.preview.samplePaths],markdown:result.text};
   publish({phase:'saving',done:0,total:1,detail:'Lernbuch wird lokal gespeichert',startedAt:start});
   await store.add(book);
   publish({phase:'done',done:1,total:1,detail:'Lernbuch gespeichert',startedAt:start});
   return book;
  }catch(error){
   publish({phase:'failed',done:0,total:1,detail:error instanceof Error?error.message:'Analyse fehlgeschlagen',startedAt:start});
   throw error;
  }finally{busy=false;}
 });
 createWindow();
 app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
}).catch(error=>{console.error('Checkmate konnte nicht gestartet werden',error);app.quit();});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});

