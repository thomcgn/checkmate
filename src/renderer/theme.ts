import {useEffect,useState} from 'react';

/** Theme state shared by the shell. The markup attribute is the single source of truth for CSS. */
export type Theme='dark'|'light';
export const THEME_STORAGE_KEY='checkmate:theme:v1';

export function storedTheme():Theme|null{
 try{
  const value=localStorage.getItem(THEME_STORAGE_KEY);
  return value==='dark'||value==='light'?value:null;
 }catch{return null;}
}
export function systemTheme():Theme{
 return typeof window!=='undefined'&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
}
export function initialTheme():Theme{return storedTheme()??systemTheme();}
export function applyTheme(theme:Theme):void{
 if(typeof document!=='undefined')document.documentElement.dataset.theme=theme;
}
// Set the attribute before React paints so the first frame already uses the correct palette.
applyTheme(initialTheme());

export function useTheme():readonly [Theme,()=>void]{
 const [theme,setTheme]=useState<Theme>(initialTheme);
 useEffect(()=>{applyTheme(theme);},[theme]);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-color-scheme: light)');
  const followSystem=():void=>{if(storedTheme()===null)setTheme(systemTheme());};
  media.addEventListener('change',followSystem);
  return()=>media.removeEventListener('change',followSystem);
 },[]);
 const toggle=():void=>{
  const next:Theme=theme==='dark'?'light':'dark';
  setTheme(next);
  try{localStorage.setItem(THEME_STORAGE_KEY,next);}catch{/* Private mode: theme still works for this session. */}
 };
 return [theme,toggle] as const;
}
