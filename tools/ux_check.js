// Exercise the viewer in a real browser: hover, tap, search, slider keys, event marks, succession buttons
// and the address. It prints what it found, one numbered line per step, and writes three screenshots.
//
//   python3 tools/build_page.py . dist/peoples-of-the-world.html
//   node tools/ux_check.js "$PWD/dist/peoples-of-the-world.html" /some/folder/for/screenshots
//
// It needs Playwright and a Chromium it can launch. Neither is a dependency of the atlas: ask before
// installing them. Read the output; the script does not judge it.
const { chromium } = require('playwright');
(async () => {
  const [pg, out] = process.argv.slice(2);
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 1400, height: 900 }, reducedMotion: 'reduce' }); const p = await c.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const st = () => p.evaluate(() => { const s = window.__atlas.state(); return s.view + ' y' + s.year + ' open=' + s.open + ' hash=' + location.hash; });
  const card = () => p.evaluate(() => { const d = document.getElementById('detail'); return d.hidden ? '(no card)' : d.querySelector('h3').textContent + ' | ' + Array.from(d.querySelectorAll('.acts button')).map(x => x.textContent).join(' ; '); });
  await p.goto('file://' + pg); await p.waitForTimeout(1000);
  console.log('1 start      ', await st());
  const box = await p.locator('#map').boundingBox();
  // hover over central Africa and over open sea
  await p.mouse.move(box.x + box.width * 0.545, box.y + box.height * 0.56); await p.waitForTimeout(200);
  console.log('2 hover land ', JSON.stringify(await p.evaluate(() => { const t = document.querySelector('.tip'); return t.hidden ? null : t.textContent; })), 'cursor', await p.evaluate(() => document.getElementById('map').style.cursor));
  await p.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5); await p.waitForTimeout(200);
  console.log('3 hover sea  ', JSON.stringify(await p.evaluate(() => { const t = document.querySelector('.tip'); return t.hidden ? null : t.textContent; })));
  await p.mouse.click(box.x + box.width * 0.545, box.y + box.height * 0.56); await p.waitForTimeout(400);
  console.log('4 click land ', await st(), '|', await card());
  // search
  await p.fill('#search', 'mali'); await p.waitForTimeout(150);
  console.log('5 search mali', JSON.stringify(await p.evaluate(() => Array.from(document.querySelectorAll('#found button')).map(x => x.textContent))));
  await p.press('#search', 'Enter'); await p.waitForTimeout(500);
  console.log('6 chose first', await st(), '|', await card());
  await p.screenshot({ path: out + '/ux-search.png' });
  await p.fill('#search', 'west sax'); await p.waitForTimeout(150); await p.press('#search', 'Enter'); await p.waitForTimeout(500);
  console.log('7 west saxons', await st(), '|', await card());
  const link = p.locator('#detail .acts button', { hasText: 'Continues as' });
  if (await link.count()) { await link.first().click(); await p.waitForTimeout(500); console.log('8 followed   ', await st(), '|', await card()); } else console.log('8 no succession button');
  await p.fill('#search', 'qqqq'); await p.waitForTimeout(150);
  console.log('9 no match   ', JSON.stringify(await p.evaluate(() => document.getElementById('found').textContent)));
  await p.press('#search', 'Escape');
  // slider keys
  await p.focus('#year');
  const y0 = (await p.evaluate(() => window.__atlas.state().year));
  await p.keyboard.press('ArrowRight'); const y1 = await p.evaluate(() => window.__atlas.state().year);
  await p.keyboard.press('Shift+ArrowLeft'); const y2 = await p.evaluate(() => window.__atlas.state().year);
  await p.keyboard.press(']'); const y3 = await p.evaluate(() => window.__atlas.state().year);
  await p.keyboard.press('PageUp'); const y4 = await p.evaluate(() => window.__atlas.state().year);
  console.log('10 keys      ', y0, '-> right', y1, '-> shift-left', y2, '-> ]', y3, JSON.stringify(await p.evaluate(() => document.getElementById('markname').textContent)), '-> PageUp', y4);
  // marks and periods
  console.log('11 marks     ', await p.locator('#marks button').count(), 'periods', await p.locator('#erastrip button').count());
  await p.locator('#marks button').nth(3).click(); await p.waitForTimeout(200);
  console.log('12 mark click', await st(), JSON.stringify(await p.evaluate(() => document.getElementById('markname').textContent)));
  await p.locator('#erastrip button').nth(1).click(); await p.waitForTimeout(200);
  console.log('13 period    ', await st());
  // address round trip
  await p.waitForTimeout(500);
  const hash = await p.evaluate(() => location.hash);
  const p2 = await c.newPage(); await p2.goto('file://' + pg + '#y=1350&v=westafrica&s=mali-empire'); await p2.waitForTimeout(1200);
  console.log('14 by address', await p2.evaluate(() => { const s = window.__atlas.state(); const d = document.getElementById('detail'); return s.view + ' y' + s.year + ' open=' + s.open + ' card=' + (d.hidden ? '-' : d.querySelector('h3').textContent); }));
  await p2.screenshot({ path: out + '/ux-address.png' });
  console.log('15 last hash ', hash, 'errors', JSON.stringify(errs));
  // phone
  const c3 = await b.newContext({ viewport: { width: 390, height: 800 }, reducedMotion: 'reduce', hasTouch: true, isMobile: true }); const p3 = await c3.newPage();
  await p3.goto('file://' + pg + '#y=1500&v=africa'); await p3.waitForTimeout(1000);
  await p3.fill('#search', 'maya'); await p3.waitForTimeout(200);
  await p3.screenshot({ path: out + '/ux-phone.png' });
  await b.close();
})();
