// Packs each built page (dist/index.html = Arabic, dist/en.html = English) into
// one self-contained HTML file that opens by double-click: CSS, JS, fonts,
// photo and music are all inlined. Run via `npm run build:single`.
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../src/config.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const outDir = path.join(root, 'single-file');
const PAGES = [
  { src: 'index.html', out: 'ahmed-asmaa-invitation-arabic.html', fonts: /-(arabic)-\d/ , families: /Amiri|Aref Ruqaa|Reem Kufi/ },
  { src: 'en.html', out: 'ahmed-asmaa-invitation-english.html', fonts: /-(latin)-\d/, families: /Cormorant Garamond|Parisienne|Reem Kufi/ },
];

const MIME = { '.woff2': 'font/woff2', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
const dataUri = async (file) =>
  `data:${MIME[path.extname(file).toLowerCase()]};base64,${(await readFile(file)).toString('base64')}`;

const media = [config.photo.src, config.music.src, config.card.art, config.card.background].filter((p) => p && existsSync(path.join(dist, p)));
const inlineMedia = async (text) => {
  for (const p of media) text = text.replaceAll(p, await dataUri(path.join(dist, p)));
  return text;
};

await mkdir(outDir, { recursive: true });

for (const page of PAGES) {
  let html = await readFile(path.join(dist, page.src), 'utf8');

  // CSS: keep only the font faces this language uses (woff2); fonts and images inlined.
  const cssTags = [...html.matchAll(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/g)];
  for (const [tag, href] of cssTags) {
    let css = await readFile(path.join(dist, href), 'utf8');
    css = css.replace(/@font-face\{[^}]*\}/g, (face) => {
      const family = face.match(/font-family:\s*["']?([^;"']+)/)?.[1] ?? '';
      // Reem Kufi is kept in both so the language-switch label renders well.
      const keep = page.families.test(family) && (page.fonts.test(face) || (/Reem Kufi/.test(family) && /-(arabic|latin)-\d/.test(face)));
      return keep ? face : '';
    });
    css = css.replace(/,\s*url\([^)]+\.woff\)\s*format\(["']?woff["']?\)/g, '');
    for (const [, ref] of [...css.matchAll(/url\((\.\/[^)]+\.(?:woff2|jpe?g|png|webp))\)/g)]) {
      css = css.replaceAll(ref, await dataUri(path.join(dist, 'assets', ref)));
    }
    html = html.replace(tag, () => `<style>${css}</style>`);
  }

  // JS: inline the module bundle (and drop modulepreload hints).
  html = html.replace(/<link rel="modulepreload"[^>]*>/g, '');
  const jsTags = [...html.matchAll(/<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>/g)];
  for (const [tag, src] of jsTags) {
    let js = await readFile(path.join(dist, src), 'utf8');
    if (/^import\s|\bimport\(/m.test(js)) throw new Error(`${src} imports other chunks; cannot inline`);
    js = (await inlineMedia(js)).replace(/<\/script/gi, '<\\/script');
    html = html.replace(tag, () => `<script type="module">${js}</script>`);
  }

  // Body media, favicon, and the language switch pointing at the sibling file.
  const [head, body] = html.split('</head>');
  html = `${head}</head>${await inlineMedia(body)}`;
  html = html.replace('href="./favicon.svg"', `href="${await dataUri(path.join(dist, 'favicon.svg'))}"`);
  html = html.replace('href="en.html"', `href="${PAGES[1].out}"`).replace('href="./"', `href="${PAGES[0].out}"`);

  await writeFile(path.join(outDir, page.out), html);
  console.log(`single-file/${page.out} (${(html.length / 1024).toFixed(0)} KB)`);
}
