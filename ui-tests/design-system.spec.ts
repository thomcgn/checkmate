import {test,expect} from '@playwright/test';

test('1920×1080 desktop shell uses Checkmate colors, deliberate scrolling and keyboard navigation',async({page})=>{
 await page.goto('/');
 await expect(page.getByRole('heading',{name:/Code verstehen/})).toBeVisible();
 await expect(page.getByRole('button',{name:/Originaldokumentationen/})).toBeVisible();
 const properties=await page.evaluate(()=>{
  const shell=document.querySelector('.shell');
  const sidebar=document.querySelector('.sidebar');
  const main=document.querySelector('.main');
  const reader=document.querySelector('.reader');
  const root=document.documentElement;
  return{
   shellHeight:shell?.getBoundingClientRect().height,
   viewportHeight:window.innerHeight,
   documentScroll:root.scrollHeight>window.innerHeight+1,
   sidebarWidth:sidebar?.getBoundingClientRect().width,
   sidebarScroll:sidebar?getComputedStyle(sidebar).overflowY:'',
   mainWidth:main?.getBoundingClientRect().width,
   readerScroll:reader?getComputedStyle(reader).overflowY:'',
   bodyBackground:getComputedStyle(document.body).backgroundColor,
   violet:getComputedStyle(root).getPropertyValue('--cm-violet').trim(),
   theme:root.getAttribute('data-theme')
  };
 });
 expect(properties.shellHeight).toBe(properties.viewportHeight);
 expect(properties.documentScroll).toBe(false);
 expect(properties.sidebarWidth).toBeGreaterThanOrEqual(260);
 expect(properties.sidebarWidth).toBeLessThanOrEqual(300);
 expect(properties.mainWidth).toBeGreaterThanOrEqual(1600);
 expect(properties.mainWidth).toBeLessThanOrEqual(1700);
 expect(['auto','scroll']).toContain(properties.sidebarScroll);
 expect(['auto','scroll']).toContain(properties.readerScroll);
 expect(properties.violet).toBe('#c18af9');
 expect(['dark','light']).toContain(properties.theme);
 const toggle=page.getByRole('button',{name:'Heller Modus'});
 await expect(toggle).toBeVisible();
 await expect(toggle).toBeEnabled();
 const palette=page.getByRole('button',{name:/Schnellnavigation öffnen/});
 const toggleBox=await toggle.boundingBox();
 const paletteBox=await palette.boundingBox();
 expect(toggleBox).not.toBeNull();
 expect(paletteBox).not.toBeNull();
 expect(toggleBox!.x+toggleBox!.width).toBeLessThanOrEqual(paletteBox!.x);
 await page.keyboard.press('Control+k');
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('textbox',{name:'Bereiche durchsuchen'}).fill('Originaldokumentationen');
 await page.getByRole('dialog').getByRole('button',{name:/Originaldokumentationen/}).click();
 await expect(page.getByRole('heading',{name:'Offizielle Referenzdokumentationen'})).toBeVisible();
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.keyboard.press('Control+k');
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
});
