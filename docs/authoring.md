# Authoring content

This page is the mechanics — the commands, the frontmatter, the components.
*How* a post should be written (what it must contain, its voice, which visual
answers which question, how to prove the figures render) is the `visual-post`
skill in `.agents/skills/visual-post/`. Invoke it before drafting.

## A new blog post

```bash
npm run new -- "Sampling strategies for diffusion planners"
# or: just new "Sampling strategies for diffusion planners"
# paper summary template: just paper "Title"
```

That creates `src/routes/blog/YYYY-MM-DD-slug.mdx` from `templates/post.md`,
marked `draft: true`. Set `draft: false` to publish. The URL is the filename
without the extension.

## Post frontmatter

```yaml
---
title: "Post title"          # required
date: "2026-07-28"           # quote it — keeps it a string, not a YAML date
description: "One line."     # used for listings, RSS and meta tags
tags:
  - reinforcement-learning
draft: false
---
```

Every post then needs its header component:

```mdx
import PostHeader from "~/components/PostHeader";

<PostHeader {...frontmatter} readingTime={readingTime} />
```

`frontmatter` and `readingTime` are in scope automatically — the MDX pipeline
exports them. `PostHeader` renders the title, date, reading time and tag links,
and sets the page metadata.

## A standalone page

Add `src/routes/<name>.mdx`, using `PageMeta` rather than `PostHeader`:

```mdx
---
title: Talks
description: Invited talks and seminars.
---

import PageMeta from "~/components/PageMeta";

<PageMeta {...frontmatter} />

# Talks
```

Then, for a top-level page, do both of these:

1. Add it to `site.nav` in `src/lib/site.ts` so it appears in the header.
2. Add its path to `prerender.routes` in `app.config.ts`.

Step 2 matters: `crawlLinks` only finds pages that something links to.

## A new project

Projects are data plus a page, not just a page.

1. Add an entry to `research` or `personal` in `src/lib/projects.ts` — `slug`,
   `title`, `tagline`, `blurb`, `cover`, `affiliation`, `period`, `tags`. Work
   done with a lab, a company or a collaborator goes in `research`; work that is
   yours alone goes in `personal`. This alone makes the card appear on
   `/projects`, under that group's heading.
2. Add `src/routes/projects/<slug>.mdx` with `PageMeta` and
   `<ProjectHeader slug="<slug>" />`. The header reads title, cover, period,
   affiliation and tags back out of `projects.ts`, so a detail page never
   restates what the card already says.
3. Add `/projects/<slug>` to `prerender.routes` in `app.config.ts` and to
   `REQUIRED` in `scripts/check-build.mjs`.

`cover` is optional, and **only set it when the project has a real image of its
own** — a render, a screenshot, a photograph. Do not invent artwork for a
project that has none. It appears on the detail page only; the cards on
`/projects` are text, so a project with an image never towers over one without.
Real covers are 3:2, composited onto a `#151922 → #1e2534` panel so the ones
that exist read as a set.

Smaller work that does not warrant a page goes in `other` in the same module
and renders as a plain list under *Also* — no slug, no cover, no route.

## What you can write

Standard GFM — tables, task lists, strikethrough, footnotes — plus:

**Math** (KaTeX, rendered at build time, no client JS):

```
Inline $\pi_\theta(a \mid s)$, and display:

$$
J(\theta) = \mathbb{E}_{\tau \sim \pi_\theta}\!\left[\sum_t \gamma^t r_t\right]
$$
```

**Diagrams** — a ` ```mermaid ` fence becomes a diagram rendered in the browser.
It re-renders when the theme is toggled, and degrades to the raw source in a
`<pre>` if mermaid fails to load.

**Code** — fenced blocks are highlighted by Shiki at build time, with both light
and dark themes baked in as CSS variables.

**Components** — import any Solid component and use it inline.

## Images and assets

Put files in `public/` and reference them from the site root:

```mdx
<img src="/assets/diagram.png" alt="…" width="600" height="400" loading="lazy" />
```

`public/assets/…` is served as `/assets/…`. Always set `alt`; set `width` and
`height` to avoid layout shift. `check-build.mjs` fails the build if an HTML
reference points at a file that isn't in the output.

## Tags

Tags come from post frontmatter. `/tags` and `/tags/<slug>` are generated
automatically, and slugs are lowercased with non-alphanumerics collapsed to `-`
(`"Reinforcement Learning"` → `reinforcement-learning`).

## Checking your work

```bash
npm run dev      # live preview
npm run build    # full static build + verification
```

The build fails if a page throws during SSR, lacks a title, or references a
missing asset.
