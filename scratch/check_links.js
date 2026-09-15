import fs from 'fs';
import path from 'path';

const htmlFiles = [
  'index.html',
  'services.html',
  'projects.html',
  'about-us.html',
  'blog.html',
  'contact-us.html',
  'privacy-policy.html',
  'terms-of-use.html'
];

const validInternalRoutes = new Set([
  '/',
  '#',
  '/services.html',
  '/projects.html',
  '/about-us.html',
  '/blog.html',
  '/contact-us.html',
  '/privacy-policy.html',
  '/terms-of-use.html',
  '/services.html#ai-ml',
  '/services.html#web-mobile',
  '/services.html#ecommerce',
  '/services.html#cloud',
  '/services.html#technologies',
  '/services.html#industries',
  '#ai-ml',
  '#web-mobile',
  '#ecommerce',
  '#cloud',
  '#technologies',
  '#industries',
  '#services',
  '#contact',
  '#openings',
  '#apply-section'
]);

let issues = [];

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const hrefRegex = /href="([^"]+)"/g;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      continue;
    }
    if (!validInternalRoutes.has(href)) {
      issues.push({ file, href });
    }
  }
}

if (issues.length === 0) {
  console.log('SUCCESS: All internal links across all HTML pages are 100% valid!');
} else {
  console.log('Found link issues:', JSON.stringify(issues, null, 2));
}
