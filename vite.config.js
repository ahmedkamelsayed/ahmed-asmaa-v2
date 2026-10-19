import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { config } from './src/config.js';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Fills each page's title, description and link-preview (Open Graph) tags from src/config.js.
function invitationMeta() {
  return {
    name: 'invitation-meta',
    transformIndexHtml(html, ctx) {
      const lang = /en\.html$/.test(ctx.filename || ctx.path) ? 'en' : 'ar';
      const { meta, photoAlt } = config.content[lang];
      const { photo } = config;
      const base = config.siteUrl ? config.siteUrl.replace(/\/*$/, '/') : '';
      const tags = [
        ['og:type', 'website'],
        ['og:title', meta.title],
        ['og:description', meta.description],
        ['og:image', base + photo.src],
        ['og:image:width', photo.width],
        ['og:image:height', photo.height],
        ['og:image:alt', photoAlt],
        ['og:locale', lang === 'en' ? 'en_US' : 'ar_EG'],
        ...(base ? [['og:url', base + (lang === 'en' ? 'en' : '')]] : []),
      ].map(([p, v]) => `<meta property="${p}" content="${esc(v)}" />`);
      tags.push('<meta name="twitter:card" content="summary_large_image" />');
      return html
        .replace('%%TITLE%%', esc(meta.title))
        .replace('%%DESCRIPTION%%', esc(meta.description))
        .replace('<!--social-meta-->', tags.join('\n    '));
    },
  };
}

export default defineConfig({
  // Relative base: works at any GitHub Pages sub-path without knowing the repo name.
  base: './',
  plugins: [react(), invitationMeta()],
  build: {
    rollupOptions: {
      input: {
        ar: resolve(import.meta.dirname, 'index.html'),
        en: resolve(import.meta.dirname, 'en.html'),
      },
    },
  },
});
