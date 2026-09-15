import http from 'http';

const routes = [
  '/',
  '/index.html',
  '/services.html',
  '/projects.html',
  '/about-us.html',
  '/blog.html',
  '/contact-us.html',
  '/privacy-policy.html',
  '/terms-of-use.html'
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    http.get(`http://localhost:5173${route}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          route,
          statusCode: res.statusCode,
          hasKontra: data.toLowerCase().includes('kontra'),
          hasDemaze: data.toLowerCase().includes('demaze'),
          length: data.length
        });
      });
    }).on('error', (err) => {
      resolve({ route, error: err.message });
    });
  });
}

async function run() {
  console.log('Auditing dev server routes...');
  for (const r of routes) {
    const res = await checkRoute(r);
    console.log(JSON.stringify(res));
  }
}

run();
