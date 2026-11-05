// @ts-check
import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [clerk()],
  vite: {
    plugins: [tailwindcss()]
  }
});
