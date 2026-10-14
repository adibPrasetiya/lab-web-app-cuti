import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// SvelteKit 3: konfigurasi (dulu svelte.config.js) diberikan langsung ke plugin sveltekit().
export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      // Client-side rendering murni (SPA): semua URL dilayani index.html, routing di browser.
      adapter: adapter({ fallback: 'index.html' }),
    }),
  ],
  server: {
    host: true,
    port: 5176,
    // Di development request /api & /uploads diteruskan ke backend.
    proxy: {
      '/api': 'http://localhost:3200',
      '/uploads': 'http://localhost:3200',
      '/health': 'http://localhost:3200',
    },
  },
});
