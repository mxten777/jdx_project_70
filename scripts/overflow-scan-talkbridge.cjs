'use strict';
const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
  const base = process.argv[2] || 'http://localhost:5173';
  const targetPath = '/talkbridge';
  const url = base.replace(/\/$/, '') + targetPath;
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

      // give animations/time to settle
      await page.waitForTimeout(800);

      // Inject long sample conversation into textarea if present
      const injected = await page.evaluate(() => {
        const ta = document.querySelector('textarea');
        if (!ta) return false;
        const sample = `민지: 아 오늘 진짜 힘들었어 ㅠㅠ\n성호: 무슨 일이 있었나요? 괜찮으신가요?\n민지: 과제가 너무 많아서요... 갑분싸 됐나?\n성호: 아니에요, 충분히 힘들 수 있죠. 도움이 필요하면 언제든 말씀하세요.\n민지: 그리고 다음주 발표 준비도 있고.. 시간이 너무 없다 ㅜㅜ\n성호: 일정을 같이 조정해볼까요?\n민지: 그럼 고마울 것 같아요.\n`.repeat(8);
        ta.focus();
        ta.value = sample;
        const ev = new Event('input', { bubbles: true });
        ta.dispatchEvent(ev);
        return true;
      });

      if (injected) await page.waitForTimeout(600);

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
                  const parts = [];
                  let node = el;
                  let depth = 0;
                  while (node && node.nodeType === 1 && depth < 8) {
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
        return { nodes, docScrollWidth: document.documentElement.scrollWidth, docClientWidth: document.documentElement.clientWidth };
      });

      const screenshotPath = `${outDir}/talkbridge-screenshot-${vp.name}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      report.screenshot = screenshotPath;
      report.viewport = vp;
      finalReport.push(report);
    }

    const outPath = `${outDir}/report-talkbridge.json`;
    fs.writeFileSync(outPath, JSON.stringify(finalReport, null, 2));
    console.log('REPORT_PATH=' + outPath);
    console.log(JSON.stringify(finalReport, null, 2));
  } catch (err) {
    console.error('Script error', err);
  } finally {
    await browser.close();
  }
})();
