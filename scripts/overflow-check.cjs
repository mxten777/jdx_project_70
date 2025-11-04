const puppeteer = require('puppeteer');

async function scan(viewport) {
  const browser = await puppeteer.launch({args: ['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

  await page.waitForTimeout(500);

  const results = await page.evaluate(() => {
    const out = [];
    const all = Array.from(document.querySelectorAll('body *'));
    for (const el of all) {
      try {
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) continue;
        const cw = el.clientWidth || 0;
        const sw = el.scrollWidth || 0;
        const r = el.getBoundingClientRect();
        const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
        const overflowX = Math.max(0, sw - cw);
        const outOfViewportRight = Math.max(0, r.right - viewportWidth);
        if (overflowX > 2 || outOfViewportRight > 2) {
          out.push({
            tag: el.tagName.toLowerCase(),
            id: el.id || null,
            className: el.className ? el.className.toString().slice(0,200) : null,
            clientWidth: cw,
            scrollWidth: sw,
            overflowX,
            rect: { left: r.left, right: r.right, width: r.width, top: r.top, bottom: r.bottom, height: r.height },
            outerHTML: el.outerHTML ? el.outerHTML.slice(0,300) : null
          });
        }
      } catch (e) {
        // ignore
      }
    }
    return out;
  });

  await browser.close();
  return results;
}

(async () => {
  const viewports = [
    { width: 360, height: 800, deviceScaleFactor: 2 },
    { width: 375, height: 812, deviceScaleFactor: 2 }
  ];

  for (const vp of viewports) {
    console.log('\n\n=== Scanning viewport:', vp.width, 'x', vp.height, '===');
    try {
      const res = await scan(vp);
      if (!res || res.length === 0) {
        console.log('No overflowing elements found.');
        continue;
      }
      console.log('Found', res.length, 'potential overflow elements. Showing top 30:');
      console.log(JSON.stringify(res.slice(0,30), null, 2));
    } catch (err) {
      console.error('Error scanning:', err);
    }
  }
})();
