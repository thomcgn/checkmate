import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('splash contains a bundled offline illustration derived from the approved artwork',async()=>{
 const document=await readFile('splash.html','utf8');
 const image=await readFile('public/assets/checkmate-splash.svg','utf8');
 const improved=await readFile('public/assets/checkmate-splash-hq.svg','utf8');
 assert.match(document,/\.\/assets\/checkmate-splash-hq\.svg/);
 assert.match(document,/url\('\.\/assets\/checkmate-splash\.svg'\)/);
 assert.match(document,/object-fit:contain/);
 assert.match(document,/image-rendering:pixelated/);
 assert.doesNotMatch(document,/<script\b/i);
 const data=/data:image\/webp;base64,([A-Za-z0-9+/=]+)/.exec(image)?.[1];
 assert.ok(data,'image data is included in repository; splash cannot depend on a network connection');
 const bytes=Buffer.from(data,'base64');
 assert.ok(bytes.length>4000,'a complete raster source is bundled');
 assert.equal(bytes.toString('ascii',0,4),'RIFF');
 assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.match(image,/viewBox="0 0 256 144"/);
 const avif=/data:image\/avif;base64,([A-Za-z0-9+/=]+)/.exec(improved)?.[1];
 assert.ok(avif,'higher-quality embedded original poster required');
 const hq=Buffer.from(avif,'base64');
 assert.ok(hq.length>6000);
 assert.equal(hq.toString('ascii',4,8),'ftyp');
 assert.match(improved,/viewBox="0 0 512 288"/);
});
test('desktop palette and Tailwind classes are locally defined',async()=>{
 const css=await readFile('src/renderer/checkmate-theme.css','utf8');
 assert.match(css,/@import "tailwindcss\/utilities"/);
 for(const variable of ['--cm-ink','--cm-panel','--cm-violet','--cm-cyan','--cm-gold','--cm-border'])
  assert.ok(css.includes(variable),variable);
 assert.match(css,/--cm-violet: #c18af9/);
 const shell=await readFile('src/renderer/checkmate-desktop.css','utf8');
 assert.match(shell,/height:100dvh/);
 assert.match(shell,/scrollbar-width:none/);
 assert.match(shell,/prefers-reduced-motion/);
});

test('desktop-first shell uses a wide sidebar, centred content and flexible scroll owners',async()=>{
 const shell=await readFile('src/renderer/checkmate-desktop.css','utf8');
 assert.match(shell,/grid-template-columns:clamp\(248px,15vw,292px\)/);
 assert.match(shell,/min-width:1500px/);
 assert.match(shell,/grid-template-columns:288px minmax\(0,1fr\)/);
 assert.match(shell,/min-height:0/);
 const base=await readFile('src/renderer/style.css','utf8');
 assert.match(base,/max-width:1700px/);
 for(const file of ['src/renderer/academy.css','src/renderer/published-library.css',
  'src/renderer/documentation-library.css','src/renderer/repository-workspace.css']){
  const source=await readFile(file,'utf8');
  assert.doesNotMatch(source,/calc\(100vh - \d+px\)/,file);
  assert.match(source,/min-height:0/,file);
 }
});

test('dark and light themes expose semantic tokens with persisted system-aware switching',async()=>{
 const css=await readFile('src/renderer/checkmate-theme.css','utf8');
 for(const token of ['--cm-background','--cm-foreground','--cm-panel','--cm-raised',
  '--cm-border','--cm-muted','--cm-accent','--cm-accent-foreground','--cm-code-bg'])
  assert.ok(css.includes(token),token);
 assert.match(css,/data-theme="light"/);
 assert.match(css,/color-scheme: light/);
 const theme=await readFile('src/renderer/theme.ts','utf8');
 assert.match(theme,/checkmate:theme:v1/);
 assert.match(theme,/matchMedia\('\(prefers-color-scheme: light\)'\)/);
 assert.match(theme,/dataset\.theme=theme/);
 const light=await readFile('src/renderer/theme-light.css','utf8');
 assert.match(light,/\[data-theme="light"\]/);
 assert.match(light,/var\(--cm-accent\)/);
 const toggle=await readFile('src/renderer/ui/theme-toggle.tsx','utf8');
 assert.match(toggle,/aria-label="Heller Modus"/);
 assert.match(toggle,/aria-pressed=\{light\}/);
 const main=await readFile('src/renderer/main.tsx','utf8');
 assert.match(main,/ThemeToggle/);
 assert.match(main,/import '\.\/theme-light\.css'/);
});
