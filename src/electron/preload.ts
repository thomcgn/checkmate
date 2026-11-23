import {contextBridge,ipcRenderer} from 'electron';
import type {RepoBridge,RepoProgress,RepositoryPreview,RepositoryAnalysis,ChatGPTStatus} from '../shared/repository';
const api:RepoBridge={
 preview:(url:string):Promise<RepositoryPreview>=>ipcRenderer.invoke('checkmate:repo:preview',url),
 chatgptStatus:():Promise<ChatGPTStatus>=>ipcRenderer.invoke('checkmate:repo:status'),
 signIn:():Promise<ChatGPTStatus>=>ipcRenderer.invoke('checkmate:repo:signin'),
 signOut:():Promise<ChatGPTStatus>=>ipcRenderer.invoke('checkmate:repo:signout'),
 models:()=>ipcRenderer.invoke('checkmate:repo:models'),
 analyze:(url:string,consent:boolean,model:string):Promise<RepositoryAnalysis>=>ipcRenderer.invoke('checkmate:repo:analyze',url,consent,model),
 saved:():Promise<RepositoryAnalysis[]>=>ipcRenderer.invoke('checkmate:repo:saved'),
 remove:(id:string):Promise<void>=>ipcRenderer.invoke('checkmate:repo:remove',id),
 onProgress:(callback:(progress:RepoProgress)=>void):(()=>void)=>{
  const listener=(_event:Electron.IpcRendererEvent,value:RepoProgress):void=>callback(value);
  ipcRenderer.on('checkmate:repo-progress',listener);
  return ()=>ipcRenderer.removeListener('checkmate:repo-progress',listener);
 },
};
contextBridge.exposeInMainWorld('checkmateRepos',api);
