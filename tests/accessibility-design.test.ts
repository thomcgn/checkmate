import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('barrier-free responsive foundation is wired into the renderer',async()=>{
 const main=await readFile('src/renderer/main.tsx','utf8');
 assert.match(main,/import '\.\/a11y-responsive\.css'/);
 assert.match(main,/cm-skip-link/);
 assert.match(main,/id="main-content" tabIndex=\{?-1/);
 assert.match(main,/role="tablist"/);
 assert.match(main,/role="progressbar"/);
});

test('accessibility stylesheet covers focus, targets, contrast and reflow',async()=>{
 const css=await readFile('src/renderer/a11y-responsive.css','utf8');
 for(const rule of [':focus-visible','min-height:44px','.sr-only','scrollbar-width:none',
  'prefers-reduced-motion:reduce','prefers-contrast:more','forced-colors:active',
  'max-width:520px','max-height:520px','top-chip small'])
  assert.ok(css.includes(rule),'fehlende Regel: '+rule);
 assert.match(css,/clip-path:inset\(50%\)/);
 assert.match(css,/\.shell\{display:grid\}/);
});

test('touch targets and focus rings survive component overrides',async()=>{
 const primitives=await readFile('src/renderer/ui/primitives.tsx','utf8');
 assert.match(primitives,/h-11/);
 assert.doesNotMatch(primitives,/h-9 w-9/);
 const desktop=await readFile('src/renderer/checkmate-desktop.css','utf8');
 assert.match(desktop,/min-height:44px/);
 assert.match(desktop,/focus-within|cm-command-search/);
});

test('documentation, textbooks and repository expose their scroll regions to keyboards',async()=>{
 for(const file of ['src/renderer/published-textbook-library.tsx','src/renderer/documentation-library.tsx',
  'src/renderer/repository-workspace.tsx','src/renderer/main.tsx']){
  const source=await readFile(file,'utf8');
  assert.match(source,/cm-scroll-region/,file);
  assert.match(source,/tabIndex=\{0\}/,file);
 }
});
