// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  vite: {
    optimizeDeps: {
      exclude: ['react-compiler-runtime']
    }
  },
  site: 'https://alcanzaship.com',
  base: '/',
});