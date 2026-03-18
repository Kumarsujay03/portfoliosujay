# Sujay Kumar

Frontend developer focused on building clean, fast, and responsive web experiences.

- Portfolio: (add your live site link here)
- GitHub: https://github.com/Kumarsujay03
- Email: mr.sujaykumar03@gmail.com
## About Me

I enjoy turning ideas into polished UIs and product-ready pages, with attention to performance, accessibility, and good UX.

## What’s Inside This Portfolio

- Featured projects with screenshots
- Skills, experience, and certifications
- Blog posts (slug-based routes) with search and tag filtering
- Dark mode + smooth page interactions/animations

## Tech I Work With

- React, TypeScript, Vite
- Tailwind CSS, shadcn/ui
- React Router
- Framer Motion

## Highlights

- Performance-minded: route-based code splitting and prefetching for snappy navigation
- SEO-ready: per-page metadata and sitemap/robots generation
- Optimized media: WebP-first images with fallbacks

## Let’s Connect

If you’d like to collaborate, discuss an opportunity, or just say hi:

- Email: sujayjaiswal03@gmail.com
- GitHub: https://github.com/Kumarsujay03

---

## Run Locally (optional)

This repo uses Vite + React. You can run it with Bun (recommended) or npm.

```sh
bun install
bun run dev
```

```sh
npm install
npm run dev
```

## SEO + Search Setup

Add these environment variables in your deployment platform (and optionally in local `.env`):

- `VITE_SITE_URL=https://kumarsujay.dev`
- `VITE_BING_SITE_VERIFICATION=<bing-meta-code>`
- `INDEXNOW_KEY=<your-indexnow-key>`
- `INDEXNOW_AUTO_NOTIFY=true` (only in CI/deploy environments)

Useful scripts:

- `npm run generate:sitemap` generates `public/sitemap.xml`
- `npm run generate:og-image` generates `public/og-image.png` (1200x630) from SVG for social previews
- `npm run indexnow:key` creates `public/<INDEXNOW_KEY>.txt`
- `npm run indexnow:notify` posts changed URLs to IndexNow

`npm run build` now performs sitemap generation, IndexNow key file generation, and optional IndexNow ping.

Social sharing is configured using Open Graph + Twitter tags and works across major platforms (WhatsApp, LinkedIn, Facebook, Telegram, Discord, X/Twitter).
