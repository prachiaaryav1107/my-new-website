// @ts-check
import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://somashiva.com',
  output: 'server',
  adapter: vercel(),
  integrations: [clerk()],
  vite: {
    plugins: [tailwindcss()]
  }
});
