import {test,expect} from '@playwright/test';

test('standalone splash is bundled, responsive and does not contact external hosts',async({page})=>{
 const external:string[]=[];
 page.on('request',request=>{if(!request.url().startsWith('http://127.0.0.1:5173/'))external.push(request.url());});
 await page.goto('/splash.html');
 const image=page.getByRole('img',{name:/Pixel-Art-Bibliothek/});
 await expect(image).toBeVisible();
 await expect(page.getByRole('status')).toContainText('CHECKMATE wird gestartet');
 const layout=await image.evaluate(img=>{
  const image=img as HTMLImageElement;
  const css=getComputedStyle(image);
  return{complete:image.complete,naturalWidth:image.naturalWidth,fit:css.objectFit,position:css.objectPosition};
 });
 expect(layout.complete).toBe(true);
 expect(layout.naturalWidth).toBeGreaterThan(0);
 expect(layout.fit).toBe('contain');
 expect(external).toEqual([]);
});
