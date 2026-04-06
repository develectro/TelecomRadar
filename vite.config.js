import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      '/api/opencellid': {
        target: 'https://opencellid.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/opencellid/, '')
      }
    }
  }
});
