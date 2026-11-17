// Exercise the camera in a real browser: the zoom buttons, a mouse drag, Ctrl and the wheel, and on a phone
// width a two-finger pinch and a one-finger slide sent through the browser's own touch input.
//
//   python3 tools/build_page.py . dist/peoples-of-the-world.html
//   node tools/zoom_check.js "$PWD/dist/peoples-of-the-world.html" /some/folder/for/screenshots
//
// It needs Playwright and a Chromium it can launch; see tools/ux_check.js. Read the output: "tf=" is the
// transform on the canvas, which should be set in the middle of a gesture and gone after it.
const { chromium } = require('playwright');
(async () => {
  const [pg, out] = process.argv.slice(2);
  const b = await chromium.launch(); const errs = [];
  const st = p => p.evaluate(() => { const s = window.__atlas.state(); const c = document.getElementById('map'); return 'W' + s.W + ' H' + s.H + ' tf=' + (c.style.transform || '-') + ' zoom=' + Array.from(document.querySelectorAll('.zoom button')).map(x => x.disabled ? 'off' : 'on').join('/'); });
  // desktop
  const d = await b.newContext({ viewport: { width: 1400, height: 900 }, reducedMotion: 'reduce' }); const p = await d.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + pg + '#y=1000&v=africa'); await p.waitForTimeout(1000);
  console.log('1 start        ', await st(p));
  await p.locator('.zoom button').nth(0).click(); await p.waitForTimeout(300);
  console.log('2 plus button  ', await st(p));
  const box = await p.locator('.mapscroll').boundingBox();
  await p.mouse.move(box.x + 700, box.y + 350); await p.mouse.down(); await p.mouse.move(box.x + 500, box.y + 250, { steps: 6 });
  console.log('3 mid drag     ', await st(p));
  await p.mouse.up(); await p.waitForTimeout(300);
  console.log('4 after drag   ', await st(p), 'card', await p.evaluate(() => !document.getElementById('detail').hidden));
  await p.keyboard.down('Control'); await p.mouse.wheel(0, -300); await p.keyboard.up('Control'); await p.waitForTimeout(400);
  console.log('5 ctrl wheel   ', await st(p));
  await p.screenshot({ path: out + '/zoom-desk.png' });
  await p.mouse.click(box.x + 650, box.y + 380); await p.waitForTimeout(300);
  console.log('6 tap after    ', await p.evaluate(() => { const dd = document.getElementById('detail'); return dd.hidden ? (window.__atlas.state().open || '(nothing)') : dd.querySelector('h3').textContent; }));
  await p.evaluate(() => window.__atlas.setView('africa')); await p.locator('.zoom button').nth(0).click(); await p.waitForTimeout(200); await p.locator('.zoom button').nth(2).click(); await p.waitForTimeout(300);
  console.log('7 home         ', await st(p));
  // phone, with a real two-finger pinch through the browser's touch input
  const m = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, reducedMotion: 'reduce' }); const q = await m.newPage(); q.on('pageerror', e => errs.push(e.message));
  await q.goto('file://' + pg); await q.waitForTimeout(1000);
  console.log('8 phone start  ', await st(q));
  await q.screenshot({ path: out + '/zoom-phone-0.png' });
  const mb = await q.locator('.mapscroll').boundingBox(); const cx = mb.x + mb.width / 2, cy = mb.y + mb.height / 2;
  const cdp = await m.newCDPSession(q);
  const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map((t, i) => ({ x: t[0], y: t[1], id: i })) });
  await touch('touchStart', [[cx - 30, cy], [cx + 30, cy]]);
  for (let i = 1; i <= 8; i++) await touch('touchMove', [[cx - 30 - i * 10, cy], [cx + 30 + i * 10, cy]]);
  console.log('9 mid pinch    ', await st(q));
  await touch('touchEnd', []); await q.waitForTimeout(400);
  console.log('10 after pinch ', await st(q));
  await q.screenshot({ path: out + '/zoom-phone-1.png' });
  await touch('touchStart', [[cx + 80, cy]]);
  for (let i = 1; i <= 8; i++) await touch('touchMove', [[cx + 80 - i * 15, cy]]);
  console.log('11 mid slide   ', await st(q));
  await touch('touchEnd', []); await q.waitForTimeout(400);
  console.log('12 after slide ', await st(q));
  await touch('touchStart', [[cx - 90, cy], [cx + 90, cy]]);
  for (let i = 1; i <= 8; i++) await touch('touchMove', [[cx - 90 + i * 10, cy], [cx + 90 - i * 10, cy]]);
  await touch('touchEnd', []); await q.waitForTimeout(400);
  console.log('13 pinched out ', await st(q), 'errors', JSON.stringify(errs));
  await b.close();
})();
