import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [],
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
