import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about-us.html'),
        services: resolve(__dirname, 'services.html'),
        projects: resolve(__dirname, 'projects.html'),
        contact: resolve(__dirname, 'contact-us.html'),
        privacy: resolve(__dirname, 'privacy-policy.html'),
        terms: resolve(__dirname, 'terms-of-use.html'),
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
