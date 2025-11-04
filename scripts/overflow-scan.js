const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
  const url = process.argv[2] || 'http://localhost:5173/';
  const outDir = 'scripts/overflow-report';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    const viewports = [ {width:360, height:800, name:'360x800'}, {width:375, height:812, name:'375x812'} ];
    const finalReport = [];
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      } catch (err) {
        console.error('Failed to load', url, err.message);
        break;
      }
      await page.waitForTimeout(600); // allow any animations to settle
      const report = await page.evaluate(() => {
        const nodes = [];
        const all = Array.from(document.querySelectorAll('*'));
        for (const el of all) {
          try {
            const sw = el.scrollWidth || 0;
            const cw = el.clientWidth || 0;
            if (sw > cw + 1) {
              const r = el.getBoundingClientRect();
              nodes.push({
                tag: el.tagName,
                class: el.className || null,
                id: el.id || null,
                scrollWidth: sw,
                clientWidth: cw,
                bbox: { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) },
                path: (() => {
                  // build a short CSS path
                  const parts = [];
                  let node = el;
                  let depth = 0;
                  while (node && node.nodeType === 1 && depth < 6) {
                    let part = node.tagName.toLowerCase();
                    if (node.id) part += `#${node.id}`;
                    else if (node.className) part += `.${String(node.className).split(/\s+/).filter(Boolean).slice(0,2).join('.')}`;
                    parts.unshift(part);
                    node = node.parentElement;
                    depth++;
                  }
                  return parts.join(' > ');
                })(),
                snippet: (el.outerHTML || '').slice(0,300)
              });
            }
          } catch (e) {
            // ignore
          }
        }
        // Also check body overflow sizes
        const doc = document.documentElement || document.body;
        return { nodes, docScrollWidth: document.documentElement.scrollWidth, docClientWidth: document.documentElement.clientWidth };
      });
      const screenshotPath = `${outDir}/screenshot-${vp.name}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      report.screenshot = screenshotPath;
      report.viewport = vp;
      finalReport.push(report);
    }
    const outPath = `${outDir}/report.json`;
    fs.writeFileSync(outPath, JSON.stringify(finalReport, null, 2));
    console.log('REPORT_PATH=' + outPath);
    console.log(JSON.stringify(finalReport, null, 2));
  } catch (err) {
    console.error('Script error', err);
  } finally {
    await browser.close();
  }
})();
