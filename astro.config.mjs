import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import technique from './src/data/technique.json' with { type: 'json' };

const pagesExclues = ['/mentions-legales', '/confidentialite', '/merci', '/404'];

export default defineConfig({
  site: technique.url,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    sitemap({ filter: (page) => !pagesExclues.some((p) => new URL(page).pathname.startsWith(p)) }),
  ],
});
