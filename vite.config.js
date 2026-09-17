import { resolve } from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';

function cleanRoutesPlugin() {
  return {
    name: 'clean-routes-rewriter',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url.split('?')[0];
        if (url === '/about') {
          req.url = '/about.html';
        } else if (url === '/pricing') {
          req.url = '/pricing.html';
        } else if (url === '/contact') {
          req.url = '/contact.html';
        } else if (url === '/blog') {
          req.url = '/blog.html';
        } else if (url === '/privacy-policy/privacy-policy' || url === '/privacy-policy') {
          req.url = '/privacy-policy/privacy-policy.html';
        } else if (url === '/404') {
          req.url = '/404.html';
        } else if (url.startsWith('/blog/')) {
          const slug = url.replace('/blog/', '');
          const postFile = resolve(__dirname, `blog/${slug}.html`);
          if (fs.existsSync(postFile)) {
            req.url = `/blog/${slug}.html`;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [cleanRoutesPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        pricing: resolve(__dirname, 'pricing.html'),
        contact: resolve(__dirname, 'contact.html'),
        blog: resolve(__dirname, 'blog.html'),
        notfound: resolve(__dirname, '404.html'),
        privacy: resolve(__dirname, 'privacy-policy/privacy-policy.html'),
        // Blog articles
        blog1: resolve(__dirname, 'blog/master-marketing-automation-for-faster-business-growth.html'),
        blog2: resolve(__dirname, 'blog/explore-smart-automation-insights-for-better-business-decisions.html'),
        blog3: resolve(__dirname, 'blog/automate-growth-workflows-to-scale-your-business-faster.html'),
        blog4: resolve(__dirname, 'blog/manage-all-your-campaigns-from-one-powerful-hub.html'),
        blog5: resolve(__dirname, 'blog/make-smarter-decisions-with-data-driven-marketing.html'),
        blog6: resolve(__dirname, 'blog/unlock-actionable-axnix-insights-to-drive-growth.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: false,
    watch: {
      ignored: ['**/*.rar', '**/*.zip', '**/.git/**'],
    },
  },
});
