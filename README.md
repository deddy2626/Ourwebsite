# Our Little Universe 💖

A tiny, very cute website made for Appu. Built with Next.js, Tailwind CSS and Framer Motion.

## What's inside

- **Loading screen**: a heart that fills up with love while the bear and bunny scoot closer (it really waits for the photos and fonts to load).
- **Starting animation**: a heart-shaped wipe reveals a love letter in an envelope. Tap the wax seal, the letter slides out and types itself.
- **Hero**: bouncy letter-by-letter title, 3D-tilting polaroids that follow your mouse, and a bear and bunny you can poke.
- **Together For**: a flip-clock counter since the day we got together, plus the next monthsary and anniversary countdowns.
- **Our Love Story**: a timeline that draws itself as you scroll.
- **Memory Lane**: polaroid gallery with a swipeable lightbox (photos and videos).
- **Open When...**: sealed letters that flip open.
- **Catch the Hearts**: a little 30 second mini-game.
- **World's Best Girlfriend**: certificate, stats, reasons, and one last question (try clicking "No").
- Hearts, petals and sparkles falling everywhere, a sparkle trail behind the cursor, confetti, fireworks, a night mode with stars, and a built-in music box lullaby (synthesised in the browser, no audio files).

Everything respects `prefers-reduced-motion`.

## Make it yours

All the words, dates and photo lists live in **`src/data/content.ts`**: her name, the start date, the story, the letters, the reasons, the stats and the gallery.

- **Photos and videos**: drop them in `public/images/gallery/` and list them in `GALLERY` (`src/data/content.ts`).
- **Your own song**: put an mp3 in `public/audio/`, then set `OUR_SONG` in `src/data/content.ts`. Without it the site plays its own music box.

## Run it

```bash
yarn install
yarn dev        # http://localhost:3000
yarn build      # production build
yarn lint
```

## Deploy

**GitHub Pages**: `.github/workflows/deploy-pages.yml` builds a static export and publishes it every time `main` is pushed (or run it by hand from the **Actions** tab). One-time setup: **Settings → Pages → Source → GitHub Actions**.

To try the Pages build locally:

```bash
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/<repo-name> yarn build   # writes the site to ./out
```

**Vercel**: just import the repo, nothing to configure.

Reference any file under `public/` with `asset("/images/...")` from `@/lib/asset` so it still loads when the site is served from `/<repo-name>/`.
