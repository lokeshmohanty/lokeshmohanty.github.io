# lokeshmohanty.github.io — Agent Index

> Minimal index. `STATUS.md` is on demand, not by default: read it (or grep the section you need) only when the task turns on current state. Full documentation in
> `docs/` (start at `docs/index.md`). Global harness rules: `~/.agents/AGENTS.md`.

## What this is

Personal site and research blog for Lokesh Mohanty, statically generated with
SolidStart 1.3 (Vinxi/Vite/Nitro, `preset: "static"`) and authored in MDX. Pages
and posts are `.mdx` files under `src/routes/` that are themselves routes;
styling is Tailwind v4 configured entirely in `src/app.css`. `npm run build`
generates content metadata, prerenders every route to `.output/public`, then
verifies the output. Deployed to GitHub Pages by GitHub Actions on push to `main`.

## Map

| path | what |
|---|---|
| `STATUS.md` | volatile: current focus, next actions, obligations |
| `docs/` | full documentation — answer questions from here first |
| `docs/architecture.md` | stack, MDX pipeline, prerendering, styling |
| `docs/authoring.md` | how to add a page or post |
| `docs/decisions.md` | why the stack is configured this way — read before changing it |
| `app.config.ts` | SolidStart + MDX pipeline + prerender routes |
| `src/routes/` | pages and posts (`.mdx` content, `.tsx` routes) |
| `src/lib/` | site config, content helpers, remark plugins |
| `scripts/` | content generation, post scaffolding, build verification |
| `.agents/skills/` | project skills + memories (invoke on demand) |

## Gotchas

These are load-bearing; `docs/decisions.md` has the full reasoning.

1. **`jsx: true`** in the MDX options is required — Solid has no JSX runtime, so
   the automatic runtime breaks the client build.
2. **MathML tags** must stay registered in `src/components/mdx.tsx`; without them
   every page containing math renders as an SSR 500.
3. **New top-level pages** must be added to `prerender.routes` in
   `app.config.ts` — `crawlLinks` only finds linked pages.
4. **Don't read post frontmatter via `import.meta.glob`** in app code; use the
   generated `src/lib/posts.generated.json`.
5. **A green build is not proof.** Nitro reports success for pages that threw
   during SSR; `scripts/check-build.mjs` is what actually catches it. And that
   check reads static HTML only — client-side runtime and hydration errors leave
   healthy-looking markup behind, so load changed pages in a browser too.
6. **Don't `fetch` a relative URL in `createResource`.** It runs during SSR,
   where Node rejects the URL; the error is serialised and rethrown on
   hydration, killing the route. Use `onMount` for client-only fetches.
7. **Head tags must use `@solidjs/meta` components** — `<Title>`, `<Meta>`,
   `<Link>`. A lowercase `<link>`/`<meta>` inside the app renders in the *body*
   and is silently ignored by crawlers and feed readers.
8. **Setting `--font-mono` is not enough for code.** Preflight reads
   `--default-mono-font-family`, which Tailwind does not derive from it; both
   must be set in `@theme` or every code block falls back to `ui-monospace`.
   Type tokens are `--font-display` / `--font-body` / `--font-mono`.

## Project skills

*(none yet — create with the `harness-ops` skill when durable knowledge accumulates)*

Global `ui` skill (`~/.agents/skills/ui/`) owns the cross-project type roles.

## Binding rules

1. Significant changes update `docs/` in the same session (`docs-sync` skill).
2. Durable knowledge → a skill's `memory/`; volatile state → `STATUS.md`; never bloat this file.
3. Summaries in main context; exploration in sub-agents.
