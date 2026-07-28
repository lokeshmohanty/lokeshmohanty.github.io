# Architecture

## Stack

SolidStart 1.3 on Vinxi 0.5 (Vite 6 + Nitro). `app.config.ts` sets
`server.preset: "static"` with `prerender.crawlLinks: true`, so `vinxi build`
emits a fully static site to `.output/public`. There is no server at runtime.

## Content model

MDX files under `src/routes/` **are** routes — `extensions: ["mdx"]` in
`app.config.ts` adds `.mdx` to the file-system router's default
`js/jsx/ts/tsx`. So:

| file | URL |
| --- | --- |
| `src/routes/about.mdx` | `/about` |
| `src/routes/blog/2021-02-27-programming.mdx` | `/blog/2021-02-27-programming` |
| `src/routes/blog/index.tsx` | `/blog` |
| `src/routes/tags/[tag].tsx` | `/tags/:tag` |

### The MDX pipeline

Configured once in `app.config.ts` as a Vite plugin (`@mdx-js/rollup`, at
`enforce: "pre"`), in this order:

**remark** — `remark-frontmatter` → `remark-mdx-frontmatter` (exports
`frontmatter`) → `remark-reading-time` (local; exports `readingTime`) →
`remark-gfm` → `remark-math` → `remark-mermaid` (local).

**rehype** — `rehype-slug` → `rehype-autolink-headings` → `rehype-katex` →
`@shikijs/rehype`.

Two constraints drive this ordering and configuration:

- **`jsx: true` is required.** MDX must emit raw JSX for `vite-plugin-solid` to
  compile. Solid has no usable `solid-js/jsx-runtime` `jsx`/`jsxs` exports, so
  the automatic runtime fails the client build outright.
- **`remark-mermaid` must precede Shiki.** It rewrites ` ```mermaid ` fences
  into `<Mermaid chart={…} />` elements so they reach the browser renderer
  instead of being highlighted as code.

### MathML and the component provider

`providerImportSource: "solid-mdx"` means MDX resolves *every* element name
through the components map from `MDXProvider`. `solid-mdx`'s default map covers
HTML and SVG but **not MathML**, so KaTeX's `<semantics>`, `<mrow>`, `<mi>` …
would resolve to `undefined` and throw during SSR. `src/components/mdx.tsx`
therefore registers all MathML tags explicitly. Removing them regresses every
page containing math to a 500.

## Listing metadata

`scripts/generate-content.mjs` parses `src/routes/blog/*.mdx` frontmatter at
build time and writes `src/lib/posts.generated.json`, which `src/lib/content.ts`
imports. Both generated files are gitignored and produced by the `prebuild`,
`predev` and `pretypecheck` npm hooks.

This is deliberately *not* `import.meta.glob` over the MDX modules: globbing
them eagerly to read frontmatter makes every page that lists posts depend on
every post's compiled component. Plain JSON keeps listing pages independent of
post count and of the MDX pipeline.

`readingTime` is the exception — it stays an MDX export because only a post's
own page uses it, so it costs nothing elsewhere.

## Prerendering

`crawlLinks` discovers post and tag pages by following links. `prerender.routes`
additionally lists every top-level page and `/rss.xml` explicitly, so a page
survives even if nothing links to it. **Add new top-level routes there.**

`/rss.xml` is an API route (`src/routes/rss.xml.ts`) rendered at prerender time.
`search-index.json` is not a route — it is written directly into `public/` by
the content generator and fetched by `/search` at runtime.

## Build verification

`scripts/check-build.mjs` runs as `postbuild` and fails the build on: a missing
required route, a page whose body contains an SSR error, a page with no
`<title>`, or an HTML reference to a local asset that isn't in the output.

Nitro's `failOnError` does not cover this: a component that throws during SSR
still returns HTTP 200, with `500 | Internal Server Error` as the page body.
That shipped silently once during the migration, which is why the check exists.

## Styling

Tailwind v4 via `@tailwindcss/vite`, configured entirely in `src/app.css` — no
`tailwind.config.js`. Design tokens are `@theme` custom properties
(`--color-paper`, `--color-ink`, `--color-accent`, …, each with a `-dark`
variant). Dark mode is a `.dark` class on `<html>`, applied by an inline script
in `src/entry-server.tsx` before first paint to avoid a flash, and toggled by
`ThemeToggle`.

`Layout` wraps all page content in `Prose` (`@tailwindcss/typography`), so MDX
pages get typography for free; list and search routes opt out with `not-prose`.

Shiki emits both themes as CSS variables (`defaultColor: false`); `src/app.css`
selects between `--shiki-light` and `--shiki-dark`.

## Deployment

`.github/workflows/deploy.yml` builds on push to `main` and uploads
`.output/public` via `actions/upload-pages-artifact`. `public/.nojekyll` is
required — the build output contains `_build/`, and Jekyll would otherwise drop
underscore-prefixed directories.
