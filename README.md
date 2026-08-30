# Sujay Kumar — Portfolio (v2.0)

Machine learning researcher & engineer. A minimal, monochrome portfolio built to
present research interests, selected work, and writing.

- Portfolio: https://kumarsujay.dev
- GitHub: https://github.com/Kumarsujay03
- Email: mr.sujaykumar03@gmail.com

## What's new in v2.0

- **Monochrome redesign** — grayscale palette, Geist + Geist Mono typography, and
  a single restrained accent used only for live/status indicators.
- **New brand mark** — a minimal neural-network glyph (also the favicon), reading
  as both a constellation and a graph.
- **Neural-field background** — a lightweight, theme-aware canvas of drifting
  nodes and connections that react to the cursor (reduced-motion safe).
- **Particle cursor** — a minimal dot/ring cursor that leaves a soft particle
  trail as it moves (pointer-fine devices only).
- **Researcher framing** — hero, about (focus areas), skills, work, and writing
  reworked around machine learning.
- **API-driven blog** — publish posts from anywhere via a token-protected API,
  with Markdown support and a graceful fallback to bundled content.

## Tech

- React, TypeScript, Vite
- Tailwind CSS, shadcn/ui
- React Router, Framer Motion, Lenis
- Vercel serverless functions (`/api`)

## Run locally

```sh
bun install && bun run dev
# or
npm install && npm run dev
```

## Environment

Add these in your deployment platform (and optionally in a local `.env`). See
`.env.example` for the full list.

- `VITE_SITE_URL=https://kumarsujay.dev` — canonical URLs and sitemap.
- Visit counter (optional — the counter shows `--` without them):
  - `COUNTERAPI_WORKSPACE` — your CounterAPI workspace slug.
  - `COUNTERAPI_TOKEN` — CounterAPI token (server-only, never exposed to the browser).
- Blog (optional — the site falls back to `src/data/blogs.json` without them):
  - `WAREHOUSE_API_URL` + `WAREHOUSE_API_KEY` — primary blog source. When set,
    posts are served from Warehouse and blog routes are server-prerendered for
    crawlers. Server-only.
  - `VITE_BLOG_API_URL` — where the client reads posts (defaults to `/api/blog`).
  - `BLOG_API_TOKEN` — secret bearer token required to publish.
  - `KV_REST_API_URL` + `KV_REST_API_TOKEN` (Vercel KV) **or**
    `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (Upstash) for storage.
  - `BLOG_UPSTREAM_URL` — optional external JSON feed to proxy instead of KV.
  - `BLOG_ALLOWED_ORIGIN` — optional CORS origin (defaults to `*`).

## Blog API

`GET /api/blog` returns `{ posts: [...] }`. Publish or update posts by POSTing
from your other website with the bearer token:

```sh
curl -X POST https://kumarsujay.dev/api/blog \
  -H "Authorization: Bearer $BLOG_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "my-post",
    "title": "My Post",
    "date": "2026-03-01",
    "readTime": "5 min",
    "tags": ["deep-learning"],
    "summary": "A short summary.",
    "content": "# Heading\n\nMarkdown body with **bold**, `code`, and [links](https://example.com)."
  }'
```

Remove a post with `DELETE /api/blog?slug=my-post` (also token-protected).

## Media

- The hero/about portrait loads from `public/sujay.png`. If it fails to load, a
  monogram placeholder is shown.
- `npm run generate:sitemap` → `public/sitemap.xml`
- `npm run generate:og-image` → `public/og-image.png` (1200×630) from
  `public/og-image.svg`
- `npm run build` runs sitemap + OG generation, then the production build.

## Highlights

- Route-based code splitting and prefetching for fast navigation
- Per-page SEO metadata, Open Graph / Twitter cards, sitemap + robots
- WebP-first images with fallbacks
