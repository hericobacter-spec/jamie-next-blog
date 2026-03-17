const { chromium } = require('playwright');
(async ()=>{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3001/');
  // check default theme
  const initialBg = await page.evaluate(()=>getComputedStyle(document.body).backgroundColor);
  // toggle dark if toggle exists
  const toggle = await page.$('button#theme-toggle');
  if(toggle){
    await toggle.click();
    await page.waitForTimeout(200);
  }
  const afterToggleBg = await page.evaluate(()=>getComputedStyle(document.body).backgroundColor);
  // refresh
  await page.reload();
  await page.waitForTimeout(200);
  const afterReloadBg = await page.evaluate(()=>getComputedStyle(document.body).backgroundColor);
  console.log('initialBg:', initialBg);
  console.log('afterToggleBg:', afterToggleBg);
  console.log('afterReloadBg:', afterReloadBg);
  await browser.close();
})();
