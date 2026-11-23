import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {resolve} from 'node:path';
export default defineConfig({
 plugins:[react(),tailwindcss()],
 base:'./',
 build:{
  outDir:'dist-renderer',
  rollupOptions:{input:{main:resolve(__dirname,'index.html'),splash:resolve(__dirname,'splash.html')}}
 }
});
