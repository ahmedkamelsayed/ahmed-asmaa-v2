# Ahmed & Asmaa — Engagement Invitation

Two versions of a one-page engagement invitation (Vite + React):

- **Arabic** — `index.html` → https://ahmedkamelsayed.github.io/ahmed-asmaa-v2/
- **English** — `en.html` → https://ahmedkamelsayed.github.io/ahmed-asmaa-v2/en.html

Each page links to the other. The production build is prerendered to static
HTML, so the invitation shows even without JavaScript.

## Commands

```bash
npm install          # first time only
npm run dev          # http://localhost:5173  (English: /en.html)
npm test             # date / time-zone / countdown / wording checks
npm run build        # production build → dist/
npm run build:single # also creates single-file/*.html (open by double-click)
```

## Change event details

Everything event-specific is in **`src/config.js`**:

| What | Where |
| --- | --- |
| Start time (provisional) | `event.time` — 24h `"HH:MM"`, Cairo time, e.g. `'19:30'` |
| Date | `event.date` — `"YYYY-MM-DD"` |
| Maps link | `venue.mapsUrl` |
| All wording (Arabic / English) | `content.ar` / `content.en` |
| English spelling of the venue | `content.en.venue.name` |
| Photo | `photo.src` (+ `width`, `height`, `objectPosition` for the crop) |
| Music | `music.src` |
| Live address (link previews) | `siteUrl` |

The date/time text, countdown and link-preview tags update automatically.

### Replace the photo
1. Put the new image in `public/images/` (e.g. `public/images/new-photo.jpg`).
2. Set `photo.src: 'images/new-photo.jpg'` and its real `width`/`height`.
3. Adjust `photo.objectPosition` (e.g. `'50% 30%'`) if faces are cropped.

### Add music
1. Put a properly licensed audio file in `public/audio/` (e.g. `our-song.mp3`).
2. Set `music.src: 'audio/our-song.mp3'`.
The play/pause button appears only when `music.src` is set; music never autoplays.

## Publishing

Pushing to `main` runs `.github/workflows/deploy.yml`, which tests, builds and
deploys to GitHub Pages (repo **Settings → Pages → Source: GitHub Actions**).
Asset paths are relative, so the site works under any repository sub-path.
