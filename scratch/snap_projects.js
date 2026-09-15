import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\singh\\.gemini\\antigravity-ide\\brain\\8a3d42f3-0279-4438-bc06-9ad4ba70e082';

async function run() {
  const r = await fetch('http://127.0.0.1:9222/json/list');
  const pages = await r.json();
  const page = pages.find(p => p.url.includes('localhost:5173'));
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  
  ws.onopen = () => {
    ws.send(JSON.stringify({ id: 1, method: 'Page.navigate', params: { url: 'http://localhost:5173/projects.html' } }));
    setTimeout(() => {
      ws.send(JSON.stringify({ id: 2, method: 'Page.reload', params: { ignoreCache: true } }));
    }, 1000);
    setTimeout(() => {
      ws.send(JSON.stringify({ id: 3, method: 'Page.captureScreenshot', params: { format: 'png' } }));
    }, 2500);
  };

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.id === 3) {
      const p = path.join(ARTIFACTS_DIR, 'fresh_projects_desktop.png');
      fs.writeFileSync(p, Buffer.from(data.result.data, 'base64'));
      console.log('Saved fresh screenshot to:', p);
      process.exit(0);
    }
  };
}
run();
