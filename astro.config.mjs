import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  i18n: {
    defaultLocale: 'ca',
    locales: ['ca', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  output: 'static',
  // Update after creating the Cloudflare Pages project
  site: 'https://escola-musica.pages.dev',
});
