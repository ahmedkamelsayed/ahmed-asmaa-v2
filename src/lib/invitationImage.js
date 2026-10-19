// Draws a 1080×1920 invitation card on a canvas that mirrors the site's cover:
// the Bismillah-and-rings artwork (config.card.background) with the names in
// its open centre, and the date, time and venue in a framed panel where the
// cover has its "Open invitation" button.
// Runs entirely in the browser; no external services.
import { config } from '../config.js';
import { dateFull, timeText } from './format.js';

const W = 1080;
const H = 1920;

const FONTS = {
  ar: {
    names: (s) => `700 ${s}px "Aref Ruqaa", "Amiri", serif`,
    joiner: (s) => `400 ${s}px "Aref Ruqaa", "Amiri", serif`,
    label: (s) => `500 ${s}px "Reem Kufi", "Amiri", sans-serif`,
    title: (s) => `700 ${s}px "Amiri", serif`,
    body: (s) => `400 ${s}px "Amiri", serif`,
  },
  en: {
    names: (s) => `400 ${s}px "Parisienne", cursive`,
    joiner: (s) => `400 ${s}px "Parisienne", cursive`,
    label: (s) => `500 ${s}px "Cormorant Garamond", Georgia, serif`,
    title: (s) => `600 ${s}px "Cormorant Garamond", Georgia, serif`,
    body: (s) => `500 italic ${s}px "Cormorant Garamond", Georgia, serif`,
  },
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = src;
  });
}

function cssVar(name, fallback) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

/** Sets font at `size`, shrinking until `text` fits `maxWidth`. */
function fitFont(ctx, fontFn, size, text, maxWidth) {
  let s = size;
  ctx.font = fontFn(s);
  while (ctx.measureText(text).width > maxWidth && s > 16) {
    s -= 2;
    ctx.font = fontFn(s);
  }
  return s;
}

/** Splits `text` into lines no wider than `maxWidth` with the current font. */
function wrapLines(ctx, text, maxWidth) {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Wraps `text` into the fewest lines that fit `maxWidth`, with lines of similar length. */
function balancedLines(ctx, text, maxWidth) {
  const count = wrapLines(ctx, text, maxWidth).length;
  let lo = maxWidth * 0.3;
  let hi = maxWidth;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (wrapLines(ctx, text, mid).length <= count) hi = mid;
    else lo = mid;
  }
  return wrapLines(ctx, text, hi);
}

/** Thin gold rule with a small blush diamond and dots, centred on (cx, y). */
function ornamentAt(ctx, cx, y, half, c) {
  ctx.save();
  ctx.strokeStyle = c.gold;
  ctx.fillStyle = c.gold;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(cx - half, y);
  ctx.lineTo(cx - 30, y);
  ctx.moveTo(cx + 30, y);
  ctx.lineTo(cx + half, y);
  ctx.stroke();
  for (const dx of [-half - 8, half + 8, -42, 42]) {
    ctx.beginPath();
    ctx.arc(cx + dx, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(cx, y - 12);
  ctx.lineTo(cx + 12, y);
  ctx.lineTo(cx, y + 12);
  ctx.lineTo(cx - 12, y);
  ctx.closePath();
  ctx.fillStyle = c.blushLight;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/** Rounded-rectangle path. */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Renders the invitation card and resolves with a PNG Blob. */
export async function renderInvitationImage(lang, t) {
  const f = FONTS[lang];
  const c = {
    paper: '#f4eee5',
    blushLight: cssVar('--blush-light', '#f6e3de'),
    rose: cssVar('--rose', '#c48b86'),
    roseDeep: cssVar('--rose-deep', '#9a5c58'),
    gold: cssVar('--gold', '#b39062'),
    goldDeep: cssVar('--gold-deep', '#85653c'),
    ink: '#2f221d',
    inkSoft: '#5e4b43',
  };

  await Promise.all(
    Object.values(f).map((fn) => document.fonts?.load(fn(40), 'أحمد Ahmed 0123').catch(() => null)),
  );
  const art = config.card.background ? await loadImage(config.card.background).catch(() => null) : null;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.direction = lang === 'ar' ? 'rtl' : 'ltr';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  drawCoverCard(ctx, lang, t, f, c, art);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'),
  );
}

/**
 * The cover, as a card. The artwork is 9:16 like the card: the Bismillah sits
 * around y 290–330 and the hands start around y 1320, so everything is laid
 * out in between.
 */
function drawCoverCard(ctx, lang, t, f, c, art) {
  const cx = W / 2;
  const ar = lang === 'ar';
  const spacing = (px) => {
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${px}px`;
  };
  const text = (s, y, color) => {
    ctx.fillStyle = color;
    ctx.fillText(s, cx, y);
  };

  // Background: the artwork, or plain paper if it could not be loaded.
  ctx.fillStyle = c.paper;
  ctx.fillRect(0, 0, W, H);
  if (art) ctx.drawImage(art, 0, 0, W, H);

  // The same faint ivory glow the site puts behind the cover text.
  const glow = ctx.createRadialGradient(cx, 820, 60, cx, 820, 560);
  glow.addColorStop(0, 'rgba(251, 247, 241, 0.85)');
  glow.addColorStop(0.7, 'rgba(251, 247, 241, 0.55)');
  glow.addColorStop(1, 'rgba(251, 247, 241, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 250, W, 1150);

  // Eyebrow
  spacing(ar ? 0 : 6);
  ctx.font = f.label(ar ? 38 : 30);
  const eyebrow = ar ? t.cover.eyebrow : t.cover.eyebrow.toUpperCase();
  const eyebrowLines = balancedLines(ctx, eyebrow, 640);
  let y = eyebrowLines.length > 1 ? 410 : 430;
  for (const line of eyebrowLines) {
    text(line, y, c.goldDeep);
    y += ar ? 56 : 46;
  }
  spacing(0);

  // Names, stacked like the cover
  const nameSize = ar ? 128 : 150;
  fitFont(ctx, f.names, nameSize, t.names.first, 760);
  text(t.names.first, ar ? 590 : 600, c.ink);
  ctx.font = f.joiner(Math.round(nameSize * (ar ? 0.62 : 0.55)));
  text(t.names.joiner, ar ? 680 : 690, c.rose);
  fitFont(ctx, f.names, nameSize, t.names.second, 760);
  text(t.names.second, 810, c.ink);

  // Occasion
  spacing(ar ? 0 : 5);
  fitFont(ctx, f.label, ar ? 46 : 42, t.cover.type, 720);
  text(t.cover.type, 895, c.roseDeep);
  spacing(0);

  ornamentAt(ctx, cx, 950, 150, c);

  // Details panel — takes the place of the cover's "Open invitation" button,
  // in the same ivory-and-gold language as the site's cards.
  const px = 170;
  const pw = W - px * 2;
  const top = 995;
  const bottom = 1285;
  ctx.save();
  ctx.shadowColor = 'rgba(91, 58, 44, 0.18)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  roundRect(ctx, px, top, pw, bottom - top, 34);
  ctx.fillStyle = 'rgba(255, 253, 249, 0.82)';
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = 'rgba(179, 144, 98, 0.75)';
  roundRect(ctx, px, top, pw, bottom - top, 34);
  ctx.stroke();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = 'rgba(196, 139, 134, 0.5)';
  roundRect(ctx, px + 9, top + 9, pw - 18, bottom - top - 18, 26);
  ctx.stroke();
  ctx.restore();

  const inner = pw - 90;
  fitFont(ctx, f.title, ar ? 48 : 46, dateFull(lang), inner);
  text(dateFull(lang), top + 72, c.ink);

  spacing(ar ? 0 : 3);
  fitFont(ctx, f.label, ar ? 40 : 38, timeText(lang), inner);
  text(timeText(lang), top + 128, c.goldDeep);
  spacing(0);

  // short rule between "when" and "where"
  ctx.save();
  ctx.strokeStyle = 'rgba(179, 144, 98, 0.6)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(cx - 70, top + 160);
  ctx.lineTo(cx + 70, top + 160);
  ctx.stroke();
  ctx.restore();

  fitFont(ctx, f.title, ar ? 50 : 46, t.venue.name, inner);
  text(t.venue.name, top + 212, c.roseDeep);
  fitFont(ctx, f.body, ar ? 31 : 31, t.venue.location, inner);
  text(t.venue.location, top + 254, c.inkSoft);
}
