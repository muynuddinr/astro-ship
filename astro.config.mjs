// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

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
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  base: '/',
});