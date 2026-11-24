import {test,expect} from '@playwright/test';

test('10-inch desktop app uses Checkmate colors, deliberate scrolling and keyboard navigation',async({page})=>{
 await page.goto('/');
 await expect(page.getByRole('heading',{name:/Code verstehen/})).toBeVisible();
 await expect(page.getByRole('button',{name:/Originaldokumentationen/})).toBeVisible();
 const properties=await page.evaluate(()=>{
  const shell=document.querySelector('.shell');
  const sidebar=document.querySelector('.sidebar');
  const reader=document.querySelector('.reader');
  const root=document.documentElement;
  return{
   shellHeight:shell?.getBoundingClientRect().height,
   viewportHeight:window.innerHeight,
   documentScroll:root.scrollHeight>window.innerHeight+1,
   sidebarScroll:sidebar?getComputedStyle(sidebar).overflowY:'',
   readerScroll:reader?getComputedStyle(reader).overflowY:'',
   bodyBackground:getComputedStyle(document.body).backgroundColor,
   violet:getComputedStyle(root).getPropertyValue('--cm-violet').trim()
  };
 });
 expect(properties.shellHeight).toBe(properties.viewportHeight);
 expect(properties.documentScroll).toBe(false);
 expect(['auto','scroll']).toContain(properties.sidebarScroll);
 expect(['auto','scroll']).toContain(properties.readerScroll);
 expect(properties.violet).toBe('#c18af9');
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
