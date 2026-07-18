# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

GoToRecipe strips the ads and life-story preamble off recipe pages. Paste a URL, get
clean structured ingredients + instructions. No account. Installable PWA. Hosted on
Cloudflare Pages; extraction runs in a Pages Function.

## Commands

```bash
npm run dev          # Vite + HMR only — /api/* 404s (Functions need Cloudflare runtime)
npm run dev:cf       # wrangler proxy: HMR AND /api Function. Use this to test extraction.
                     #   Serves :8788. First request may 502 ~1s while Vite boots — reload.
npm run build        # vue-tsc -b && vite build  ->  dist/
npm run typecheck    # vue-tsc app + tsc functions/tsconfig.json (both must pass)
npm run lint         # eslint --fix   (lint:check = no fix)
npm run format       # prettier --write   (format:check = verify)
```

No test framework is configured.

## Working agreement

- **Committing:** You may commit, but only after explicitly asking "OK to commit?" and
  receiving explicit approval. Never commit without that back-and-forth.
- **Commit messages:** Conventional Commits format. Body is one paragraph at most (omit it
  when the subject says enough). Do NOT append "Co-Authored-By: Claude" or any trailer.
- **Iteration size:** Keep changes small and committable. Get approval, commit, keep moving.
- **Larger changes:** Plan in slices/phases and work through them together — no big-bang diffs.

## Architecture

The core value is a shared, pure parser that runs in two environments.

**Extraction flow:**
```
client  UrlInput -> store.load(url) -> src/lib/api.ts
            |  GET /api/extract?url=...
functions/api/extract.ts        (Cloudflare Pages Function)
            |  server-side fetch(url)  — bypasses browser CORS
            |  HTMLRewriter grabs every <script type="application/ld+json">
            |  src/lib/jsonld.ts normalizes first schema.org Recipe found
            v
client  <- { ok: true, recipe } | { ok: false, error }  (ExtractResult)
```

**Key boundary:** `src/lib/jsonld.ts` is pure (no DOM, no network) so the Worker and any
client code share it. The Function imports it via a relative path across the `functions/` ↔
`src/` boundary — `functions/` has its own `tsconfig.json` and is type-checked separately.
When touching parsing, update `jsonld.ts` only; both callers get it.

**Function specifics (`functions/api/extract.ts`):**
- SSRF guard (`validTarget`) blocks localhost + private IP ranges. Keep it if editing.
- Streams with a `byteLimiter` (3MB cap) + 8s fetch timeout — a page can't exhaust the worker.
- Returns typed `ExtractResult`; all shapes live in `src/lib/types.ts` (single source of truth for `Recipe`).

**State (`src/stores/recipes.ts`, Pinia):**
- Two lists: `history` (auto-recorded on every successful load, capped 25, deduped by
  sourceUrl) and `saved` (curated, kept until removed).
- Backed by localForage (IndexedDB). Writes go through `persist()`, which
  `JSON.parse(JSON.stringify(...))` snapshots first — IndexedDB structured-clone chokes on
  Vue reactive proxies. Do the same for any new persisted list.
- Reads are async: lists hydrate after store creation, not seeded inline.

**Routing:** two routes only — `/` (HomeView) and `/recipe` (RecipeView, lazy-loaded to
keep the landing bundle small). Vue Router web history.

## Conventions

- `@/` aliases `src/` (vite + tsconfig). Prefer it in `src/`; the Function uses relative paths.
- Tailwind v4 (`@tailwindcss/vite`, no config file). Design is a thick-line graphic style:
  ink borders, hard shadows. Theme color `#DB512B` (tomato), bg `#FBF4E6`. Match existing
  components rather than introducing new visual patterns.
- PWA via `vite-plugin-pwa` (autoUpdate). `/api/extract` uses NetworkFirst runtime caching;
  navigation fallback denies `/api/`. Service worker is production-only (`npm run dev` has none).

## Deploy notes

Cloudflare Pages, repo-connected. Build command `npm run build`, output `dist`. `functions/`
and `public/_routes.json` (routes `/api/*` to the Function) deploy automatically.
`wrangler.toml` intentionally omits `pages_build_output_dir` — it conflicts with `dev:cf`'s
proxy mode; the output dir is set in the Cloudflare dashboard instead.
