import {test,expect} from '@playwright/test';

function rgb(value:string):readonly [number,number,number]{
 const parts=value.match(/[\d.]+/g)?.map(Number)??[];
 return [parts[0]??0,parts[1]??0,parts[2]??0];
}
function relativeLuminance(value:string):number{
 const [r,g,b]=rgb(value).map(channel=>{
  const c=channel/255;
  return c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4;
 });
 return 0.2126*r+0.7152*g+0.0722*b;
}
function contrast(background:string,foreground:string):number{
 const a=relativeLuminance(background),b=relativeLuminance(foreground);
 return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
}

test('theme can be switched by mouse and keyboard, persists and keeps readable contrast',async({page})=>{
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto('/');
 const html=page.locator('html');
 const toggle=page.getByRole('button',{name:'Heller Modus'});
 await expect(html).toHaveAttribute('data-theme','dark');
 await expect(toggle).toHaveAttribute('aria-pressed','false');
 await expect(page.locator('.reader')).toBeVisible();

 await toggle.click();
 await expect(html).toHaveAttribute('data-theme','light');
 await expect(toggle).toHaveAttribute('aria-pressed','true');
 const light=await page.evaluate(()=>({
  background:getComputedStyle(document.body).backgroundColor,
  foreground:getComputedStyle(document.body).color,
  readerBackground:getComputedStyle(document.querySelector('.reader')!).backgroundColor,
  readerForeground:getComputedStyle(document.querySelector('.reader')!).color,
  scheme:getComputedStyle(document.documentElement).colorScheme,
  accent:getComputedStyle(document.documentElement).getPropertyValue('--cm-accent').trim(),
  stored:localStorage.getItem('checkmate:theme:v1')
 }));
 expect(light.stored).toBe('light');
 expect(light.scheme).toBe('light');
 expect(light.background).toBe('rgb(247, 244, 251)');
 expect(light.readerBackground).toBe('rgb(255, 255, 255)');
 expect(light.accent).toBe('#7b3fd4');
 expect(contrast(light.background,light.foreground)).toBeGreaterThan(7);
 expect(contrast(light.readerBackground,light.readerForeground)).toBeGreaterThan(7);

 await toggle.focus();
 await page.keyboard.press('Enter');
 await expect(html).toHaveAttribute('data-theme','dark');
 await expect(toggle).toHaveAttribute('aria-pressed','false');
 const dark=await page.evaluate(()=>({
  background:getComputedStyle(document.body).backgroundColor,
  foreground:getComputedStyle(document.body).color,
  scheme:getComputedStyle(document.documentElement).colorScheme,
  stored:localStorage.getItem('checkmate:theme:v1')
 }));
 expect(dark.stored).toBe('dark');
 expect(dark.background).toBe('rgb(17, 11, 32)');
 expect(dark.scheme).toBe('dark');
 expect(contrast(dark.background,dark.foreground)).toBeGreaterThan(7);

 await page.keyboard.press('Control+k');
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await toggle.focus();
 await page.keyboard.press('Space');
 await expect(html).toHaveAttribute('data-theme','light');
 await page.reload();
 await expect(html).toHaveAttribute('data-theme','light');
 await expect(page.getByRole('button',{name:'Heller Modus'})).toHaveAttribute('aria-pressed','true');
});

test('light mode keeps long-form headings readable in concepts and textbooks',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Heller Modus'}).click();
 const contrastOf=async(selector:string):Promise<number>=>page.evaluate((query)=>{
  const element=document.querySelector(query);
  if(!element)return 0;
  const foreground=getComputedStyle(element).color;
  let node:Element|null=element;
  let background='rgb(255, 255, 255)';
  while(node){
   const value=getComputedStyle(node).backgroundColor;
   const channels=(value.match(/[\d.]+/g)??[]).map(Number);
   if(channels.length>=3&&(channels[3]??1)>0.5){background=value;break;}
   node=node.parentElement;
  }
  const parse=(value:string):readonly [number,number,number]=>{
   const parts=(value.match(/[\d.]+/g)??[]).map(Number);
   return [parts[0]??0,parts[1]??0,parts[2]??0];
  };
  const luminance=(value:string):number=>{
   const [r,g,b]=parse(value).map(channel=>{
    const c=channel/255;
    return c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4;
   });
   return 0.2126*r+0.7152*g+0.0722*b;
  };
  const a=luminance(foreground),b=luminance(background);
  return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
 },selector);
 expect(await contrastOf('.textbook-review h3')).toBeGreaterThan(4.5);
 await page.getByRole('button',{name:'Lehrbücher'}).click();
 expect(await contrastOf('.published-article h5')).toBeGreaterThan(4.5);
});

test('system color scheme is the default until a manual choice overrides it',async({browser})=>{
 const context=await browser.newContext({colorScheme:'light'});
 const page=await context.newPage();
 await page.goto('/');
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await expect(page.getByRole('button',{name:'Heller Modus'})).toHaveAttribute('aria-pressed','true');
 expect(await page.evaluate(()=>localStorage.getItem('checkmate:theme:v1'))).toBeNull();
 await context.close();
});
