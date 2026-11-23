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
 const shell=await readFile('src/renderer/checkmate-desktop.css','utf8');
 assert.match(shell,/height:100dvh/);
 assert.match(shell,/scrollbar-width:none/);
 assert.match(shell,/prefers-reduced-motion/);
});
