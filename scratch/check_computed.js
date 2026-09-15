async function run() {
  const r = await fetch('http://127.0.0.1:9222/json/list');
  const pages = await r.json();
  const page = pages.find(p => p.url.includes('projects.html')) || pages.find(p => p.url.includes('localhost:5173'));
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  ws.onopen = async () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Page.navigate',
      params: { url: 'http://localhost:5173/projects.html' }
    }));
    setTimeout(() => {
      ws.send(JSON.stringify({
        id: 2,
        method: 'Runtime.evaluate',
        params: {
          expression: '(() => { const el = document.querySelector(".hero-section"); const cs = window.getComputedStyle(el); return { paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, marginTop: cs.marginTop, offsetTop: el.offsetTop, clientHeight: el.clientHeight }; })()',
          returnByValue: true
        }
      }));
    }, 1000);
  };
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.id === 2) {
      console.log('Computed result:', JSON.stringify(data.result));
      process.exit(0);
    }
  };
}
run();
