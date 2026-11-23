import {app,BrowserWindow,shell} from 'electron';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
let window:BrowserWindow|null=null;
function createWindow():void{
 window=new BrowserWindow({
  width:1280,height:800,minWidth:800,minHeight:540,
  title:'Checkmate – Programmieren wirklich verstehen',
  backgroundColor:'#100f18',
  webPreferences:{contextIsolation:true,sandbox:true,nodeIntegration:false,
   webSecurity:true}
 });
 window.webContents.setWindowOpenHandler(({url})=>{
  if(url.startsWith('https://'))void shell.openExternal(url);
  return {action:'deny'};
 });
 window.webContents.on('will-navigate',(event,url)=>{
  if(!url.startsWith('file://')&&!url.startsWith('http://localhost:')){
   event.preventDefault();
   if(url.startsWith('https://'))void shell.openExternal(url);
  }
 });
 if(!app.isPackaged&&process.env.CHECKMATE_DEV_URL){
  void window.loadURL(process.env.CHECKMATE_DEV_URL);
 }else{
  void window.loadURL(pathToFileURL(path.join(__dirname,'../../dist-renderer/index.html')).href);
 }
 window.on('closed',()=>{window=null;});
}
app.whenReady().then(()=>{
 createWindow();
 app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
}).catch(error=>{console.error('Checkmate could not start',error);app.quit();});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
