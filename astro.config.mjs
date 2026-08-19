// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Both are overridable by env var so the same build can go to a temporary
 * GitHub Pages URL now and to the real domain later without a code change.
 *
 *   real domain      : no env vars needed
 *   GitHub Pages     : ASTRO_SITE=https://user.github.io ASTRO_BASE=/bmes
 */
const SITE = process.env.ASTRO_SITE || 'https://bmes.lv';
const BASE = process.env.ASTRO_BASE || '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',

  i18n: {
    locales: ['lv', 'en'],
    defaultLocale: 'lv',
    routing: {
      prefixDefaultLocale: false, // Latvian lives at the root, English at /en/
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'lv',
        locales: { lv: 'lv-LV', en: 'en-GB' },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  // Self-hosted, subsetted, with metric-matched fallbacks generated at build time.
  // `latin-ext` is what carries ā č ē ģ ī ķ ļ ņ š ū ž — without it Latvian breaks mid-word.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Archivo',
      cssVariable: '--font-display',
      weights: ['400 800'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
      display: 'swap',
    },
    {
      provider: fontProviders.google(),
      name: 'Instrument Sans',
      cssVariable: '--font-body',
      weights: ['400 700'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      display: 'swap',
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400, 500, 600],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['ui-monospace', 'Consolas', 'monospace'],
      display: 'swap',
    },
  ],

  build: {
    inlineStylesheets: 'auto',
  },
});
