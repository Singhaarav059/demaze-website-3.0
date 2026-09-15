import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\singh\\.gemini\\antigravity-ide\\brain\\8a3d42f3-0279-4438-bc06-9ad4ba70e082';

async function main() {
  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const pages = await listRes.json();
  const targetPage = pages.find(p => p.type === 'page' && p.url.includes('localhost:5173')) || pages.find(p => p.type === 'page');

  if (!targetPage) {
    console.error('No suitable page found');
    return;
  }

  console.log('Connecting to target page:', targetPage.title, targetPage.url);
  const ws = new WebSocket(targetPage.webSocketDebuggerUrl);

  let msgId = 1;
  const pending = new Map();
  const consoleMessages = [];

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
    if (data.method === 'Runtime.consoleAPICalled') {
      consoleMessages.push({
        type: data.params.type,
        text: data.params.args.map(a => a.value || JSON.stringify(a)).join(' ')
      });
    }
    if (data.method === 'Log.entryAdded') {
      consoleMessages.push(data.params.entry);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise(res => ws.onopen = res);
  console.log('Connected to CDP WebSocket');

  await send('Page.enable');
  await send('Runtime.enable');

  const pagesToTest = [
    { name: 'homepage_desktop', url: 'http://localhost:5173/' },
    { name: 'services_desktop', url: 'http://localhost:5173/services.html' },
    { name: 'projects_desktop', url: 'http://localhost:5173/projects.html' },
    { name: 'about_desktop', url: 'http://localhost:5173/about-us.html' },
    { name: 'blog_desktop', url: 'http://localhost:5173/blog.html' },
    { name: 'contact_desktop', url: 'http://localhost:5173/contact-us.html' },
  ];

  for (const pageItem of pagesToTest) {
    console.log(`Navigating to ${pageItem.url}...`);
    await send('Page.navigate', { url: pageItem.url });
    await new Promise(r => setTimeout(r, 1500)); // wait for renders and animations

    // Capture screenshot
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const screenshotPath = path.join(ARTIFACTS_DIR, `${pageItem.name}.png`);
    fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
    console.log(`Saved screenshot to ${screenshotPath}`);

    // Check title and h1
    const evalResult = await send('Runtime.evaluate', {
      expression: `({
        title: document.title,
        h1: document.querySelector('h1')?.innerText?.replace(/\\s+/g, ' '),
        cardsCount: document.querySelectorAll('.pricing-card, .blog-card, .how-card').length,
        hasKontra: document.body.innerText.toLowerCase().includes('kontra'),
        hasDemaze: document.body.innerText.toLowerCase().includes('demaze')
      })`,
      returnByValue: true
    });
    console.log(`Status for ${pageItem.name}:`, JSON.stringify(evalResult.result.value));
  }

  // Test mobile viewport on homepage
  console.log('Testing mobile viewport (390x844)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 1500));

  const mobileScreenshot = await send('Page.captureScreenshot', { format: 'png' });
  const mobileScreenshotPath = path.join(ARTIFACTS_DIR, 'homepage_mobile.png');
  fs.writeFileSync(mobileScreenshotPath, Buffer.from(mobileScreenshot.data, 'base64'));
  console.log(`Saved mobile screenshot to ${mobileScreenshotPath}`);

  // Test horizontal overflow on mobile
  const overflowCheck = await send('Runtime.evaluate', {
    expression: `({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    })`,
    returnByValue: true
  });
  console.log('Mobile overflow check:', JSON.stringify(overflowCheck.result.value));

  // Reset viewport
  await send('Emulation.clearDeviceMetricsOverride');

  console.log('Console messages logged during tests:', consoleMessages.length);
  if (consoleMessages.length > 0) {
    console.log(JSON.stringify(consoleMessages.slice(-10), null, 2));
  }

  ws.close();
  console.log('CDP audit completed successfully!');
}

main().catch(console.error);
