import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\singh\\.gemini\\antigravity-ide\\brain\\8a3d42f3-0279-4438-bc06-9ad4ba70e082';

async function run() {
  const r = await fetch('http://127.0.0.1:9222/json/list');
  const pages = await r.json();
  const page = pages.find(p => p.url.includes('localhost:5173'));
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve } = pending.get(data.id);
      pending.delete(data.id);
      resolve(data.result);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, { resolve });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise(res => ws.onopen = res);

  const targets = [
    { file: 'fresh_services.png', url: 'http://localhost:5173/services.html' },
    { file: 'fresh_about.png', url: 'http://localhost:5173/about-us.html' },
    { file: 'fresh_blog.png', url: 'http://localhost:5173/blog.html' },
    { file: 'fresh_contact.png', url: 'http://localhost:5173/contact-us.html' }
  ];

  for (const t of targets) {
    await send('Page.navigate', { url: t.url });
    await send('Page.reload', { ignoreCache: true });
    await new Promise(r => setTimeout(r, 1200));
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const dest = path.join(ARTIFACTS_DIR, t.file);
    fs.writeFileSync(dest, Buffer.from(ss.data, 'base64'));
    console.log('Saved:', t.file);
  }

  ws.close();
}

run().catch(console.error);
