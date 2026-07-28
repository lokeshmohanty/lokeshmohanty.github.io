# lokeshmohanty.github.io

Personal site and research blog of Lokesh Mohanty — a statically generated
[SolidStart](https://start.solidjs.com/) site, deployed to GitHub Pages.

## Quick start

```bash
nix develop        # or bring your own Node 20+
npm ci
npm run dev        # http://localhost:3000
```

With [`just`](https://github.com/casey/just):

```bash
just dev           # dev server
just build         # static output in .output/public
just serve         # build, then serve the static output
just new "Title"   # new draft post
just check         # type check
```

## Writing

Content is MDX under `src/routes/`. Files there are routes, so
`src/routes/about.mdx` is `/about` and `src/routes/blog/my-post.mdx` is
`/blog/my-post`.

A post looks like this:

```mdx
---
title: "Post title"
date: "2026-07-28"
description: "One-line summary, used for listings, RSS and meta tags."
tags:
  - reinforcement-learning
draft: false
---

import PostHeader from "~/components/PostHeader";

<PostHeader {...frontmatter} readingTime={readingTime} />

Body text…
```

`frontmatter` and `readingTime` are exports the MDX pipeline adds automatically.
Posts with `draft: true` are excluded from every build.

Supported in content: GitHub-flavoured markdown, `$…$` / `$$…$$` math (KaTeX,
rendered at build time), ` ```mermaid ` diagrams (rendered in the browser),
syntax-highlighted code (Shiki, light + dark), and any Solid component you import.

Standalone pages use `<PageMeta {...frontmatter} />` instead of `PostHeader`.
New top-level pages should also be added to `site.nav` in `src/lib/site.ts` and
to `prerender.routes` in `app.config.ts`.

## How the build works

`npm run build` runs four steps:

1. `scripts/generate-content.mjs` reads `src/routes/blog/*.mdx` and writes
   `src/lib/posts.generated.json` (listing metadata) and
   `public/search-index.json` (full-text search index). Both are gitignored.
2. `vinxi build` prerenders every route to static HTML in `.output/public`.
3. `scripts/finalize-output.mjs` copies `404/index.html` to `404.html`, which is
   what GitHub Pages serves for unknown paths.
4. `scripts/check-build.mjs` verifies the output — no page rendered as an SSR
   error, every page has a title, and every referenced local asset exists.

Step 4 exists because Nitro's `failOnError` only catches non-2xx responses: a
component that throws during SSR still "succeeds", producing a page whose body
reads *500 | Internal Server Error*.

Note that these checks read static HTML only, so they cannot catch client-side
runtime errors. Open changed pages in a browser and check the console too.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes `.output/public` to GitHub Pages. Set Pages to the **GitHub Actions**
source in the repository settings.

## Layout

| path | what |
| --- | --- |
| `src/routes/` | pages and posts — `.mdx` content and `.tsx` routes |
| `src/components/` | layout, MDX component map, post header/list, theme toggle |
| `src/lib/` | site config, content helpers, remark plugins |
| `public/` | static assets, served from the site root |
| `templates/` | starting points for `npm run new` |
| `scripts/` | content generation, post scaffolding, build verification |
