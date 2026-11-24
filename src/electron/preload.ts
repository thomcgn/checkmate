import {contextBridge,ipcRenderer} from 'electron';
import type {DocumentationBridge,PackProgress} from '../shared/documentation';
import type {RepoBridge,RepoProgress,RepositoryPreview,RepositoryAnalysis,ChatGPTStatus,StudyChapterRecord,StudyChapterStatus} from '../shared/repository';
const api:RepoBridge={
 preview:(url:string):Promise<RepositoryPreview>=>ipcRenderer.invoke('checkmate:repo:preview',url),
 chatgptStatus:():Promise<ChatGPTStatus>=>ipcRenderer.invoke('checkmate:repo:status'),
 signIn:():Promise<ChatGPTStatus>=>ipcRenderer.invoke('checkmate:repo:signin'),
 signOut:():Promise<ChatGPTStatus>=>ipcRenderer.invoke('checkmate:repo:signout'),
 models:()=>ipcRenderer.invoke('checkmate:repo:models'),
 analyze:(url:string,consent:boolean,model:string):Promise<RepositoryAnalysis>=>ipcRenderer.invoke('checkmate:repo:analyze',url,consent,model),
 previewCourse:(packId:string)=>ipcRenderer.invoke('checkmate:docs:course-preview',packId),
 generateCourse:(packId:string,sourceCommit:string,consent:boolean,model:string)=>ipcRenderer.invoke('checkmate:docs:course-generate',packId,sourceCommit,consent,model),
 cancelCourse:():Promise<boolean>=>ipcRenderer.invoke('checkmate:docs:course-cancel'),
 saved:():Promise<RepositoryAnalysis[]>=>ipcRenderer.invoke('checkmate:repo:saved'),
 studyProgress:(bookId:string):Promise<StudyChapterRecord[]>=>ipcRenderer.invoke('checkmate:repo:study',bookId),
 setStudyProgress:(bookId:string,chapterIndex:number,status:StudyChapterStatus):Promise<StudyChapterRecord>=>ipcRenderer.invoke('checkmate:repo:study-set',bookId,chapterIndex,status),
 remove:(id:string):Promise<void>=>ipcRenderer.invoke('checkmate:repo:remove',id),
 onProgress:(callback:(progress:RepoProgress)=>void):(()=>void)=>{
  const listener=(_event:Electron.IpcRendererEvent,value:RepoProgress):void=>callback(value);
  ipcRenderer.on('checkmate:repo-progress',listener);
  return ()=>ipcRenderer.removeListener('checkmate:repo-progress',listener);
 },
};
contextBridge.exposeInMainWorld('checkmateRepos',api);

const docs:DocumentationBridge={
 packs:()=>ipcRenderer.invoke('checkmate:docs:status'),
 loadPack:(id:string)=>ipcRenderer.invoke('checkmate:docs:load',id),
 installPack:(id:string)=>ipcRenderer.invoke('checkmate:docs:install',id),
 readDocument:(id:string,documentPath:string)=>ipcRenderer.invoke('checkmate:docs:read',id,documentPath),
 searchPack:(id:string,query:string)=>ipcRenderer.invoke('checkmate:docs:search',id,query),
 readAsset:(id:string,assetPath:string)=>ipcRenderer.invoke('checkmate:docs:asset',id,assetPath),
 onPackProgress:(callback:(p:PackProgress)=>void)=>{
  const listener=(_event:Electron.IpcRendererEvent,p:PackProgress):void=>callback(p);
  ipcRenderer.on('checkmate:docs-progress',listener);
  return ()=>ipcRenderer.removeListener('checkmate:docs-progress',listener);
 }
};
contextBridge.exposeInMainWorld('checkmateDocs',docs);
