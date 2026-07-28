# Decisions

Rationale for choices that are not obvious from the code, recorded during the
2026-07-28 migration from Zola/Hakyll to SolidStart.

## `@mdx-js/rollup`, not `@vinxi/plugin-mdx`

The SolidStart docs point at `@vinxi/plugin-mdx`, but it peer-depends on
`@mdx-js/mdx <3` and vendors `unified@9`. The remark/rehype plugins this site
needs (`remark-gfm` 4, `remark-math` 6, `rehype-katex` 7, `remark-frontmatter`
5) are all unified-11 / MDX-3. Mixing the two generations breaks.

`@mdx-js/rollup` v3 works directly as a Vite plugin at `enforce: "pre"` and
keeps the whole toolchain on one generation.

## `jsx: true` in the MDX options

Not optional. Without it MDX emits automatic-runtime calls importing `jsx` and
`jsxs` from `solid-js/jsx-runtime`, which Solid does not export — Solid compiles
JSX rather than providing a runtime. The client build fails with
`"jsxs" is not exported by node_modules/solid-js/dist/solid.js`.

With `jsx: true`, MDX emits raw JSX and `vite-plugin-solid` compiles it.
SolidStart passes its merged `extensions` list to `vite-plugin-solid`, so adding
`"mdx"` to `extensions` is enough to have `.mdx` compiled; an explicit
`solid.extensions` is overwritten and has no effect.

## MathML tags registered in the MDX component map

`providerImportSource: "solid-mdx"` routes every element name through the
provider's component map. That map covers HTML and SVG but not MathML, so
KaTeX's MathML output resolves to `undefined` components and throws during SSR.

The alternative was `katex: { output: "html" }` to suppress MathML entirely.
Registering the tags was preferred because it keeps MathML for screen readers.

## Listing metadata is generated JSON, not `import.meta.glob`

Reading frontmatter by eagerly globbing the MDX modules makes every page that
lists posts import every post's compiled component, coupling listing pages to
post count and to the MDX pipeline.

`scripts/generate-content.mjs` parses the frontmatter directly and emits plain
JSON. `readingTime` remains an MDX export because only a post's own page uses it.

Cost: frontmatter is parsed in two places (the script for listings, the remark
pipeline for in-page use). They must agree on field names.

## Search index is a static file, not an API route

It was first written as `src/routes/search-index.json.ts` reading post bodies via
`import.meta.glob(..., { query: "?raw" })`. That does not work: the MDX plugin
runs at `enforce: "pre"` and matches ids regardless of query — it must, so
SolidStart's `?pick=$css` variants still compile — so it claims `?raw` first and
returns a compiled component instead of source text. A private query plus a
dedicated plugin also failed, because SolidStart's own pre-plugins resolve the
id first.

The content generator now writes `public/search-index.json` directly. Simpler,
and it keeps post bodies out of the client bundles.

## The search index is fetched in `onMount`, not `createResource`

`createResource` also runs during SSR, where `fetch("/search-index.json")` is
invalid — Node needs an absolute URL. The resulting error is serialised into the
prerendered page and rethrown during hydration, which took down the entire
`/search` route with *Uncaught Client Exception*.

The prerendered HTML looked perfectly healthy, so `check-build.mjs` did not
catch this; only loading the page in a browser did. `onMount` runs on the client
only, which is what this needs.

## Head tags go through `@solidjs/meta` components

The RSS autodiscovery tag was originally a lowercase `<link rel="alternate">`
inside the router root. `@solidjs/meta` only hoists its own components into
`<head>`; a plain `link` element renders wherever it sits — in this case inside
`<div id="app">`. The feed was reachable at `/rss.xml` and valid, but no reader
or browser extension could discover it from the site URL, which is what "RSS
not working" looked like from the outside.

`check-build.mjs` now asserts the autodiscovery tag appears before `</head>` on
every page, and that `rss.xml` is well-formed with at least one item. The same
trap applies to `<meta>`: use `<Meta>`.

Note that `src/entry-server.tsx` is exempt — the tags there are written directly
into the document template's `<head>`, so plain elements are correct.

## `404.html` is copied to the output root

GitHub Pages serves `/404.html` for unknown paths, but the prerenderer emits the
route as `404/index.html`. Without the copy in `scripts/finalize-output.mjs`,
visitors to a bad URL get GitHub's default page rather than the site's.

## Shiki backgrounds go on the `<pre>`, not the token spans

Setting `background-color` on `.shiki span` as well as `.shiki` paints a ragged
stripe behind each line, because the spans only cover their own text. Combined
with `prose-pre:bg-transparent` — which left the `<pre>` itself unpainted — code
blocks rendered as uneven bands. The background now sits on `pre.shiki` alone.

Both this rule and the heading-anchor rule are deliberately **unlayered**: they
must outrank Tailwind Typography's own utilities, and in the CSS cascade
unlayered styles beat layered ones.

## Fonts are self-hosted, and `--default-mono-font-family` is set by hand

The three faces (Space Grotesk / Nunito / Cascadia Code) come from Fontsource
variable packages rather than a Google Fonts `<link>`: no third-party request per
visitor, offline dev works, Vite fingerprints the files, and Cascadia Code is not
on Google Fonts at all. Each package's subsets carry a `unicode-range`, so a
latin page downloads three woff2 files and ignores the rest.

Tailwind's Preflight styles `code, kbd, samp, pre` from
`var(--default-mono-font-family, ui-monospace, …)` and does **not** derive that
variable from `--font-mono`. Without the explicit
`--default-mono-font-family: var(--font-mono)` in `@theme`, every code block
silently renders in the `ui-monospace` fallback while the theme block looks
correct. Verify by reading `getComputedStyle(el).fontFamily` on a real `<code>`
in a browser, not by reading `app.css`.

Theme tokens are named `--font-display` / `--font-body` / `--font-mono` after
their role. The previous names (`--font-serif` holding a serif for headings) went
stale the moment the display face became a grotesque; role names do not.

## `check-build.mjs` exists because `failOnError` is not enough

Nitro's `prerender.failOnError` only catches non-2xx responses. A component that
throws during SSR still returns 200 with `500 | Internal Server Error` as the
body. During this migration the KaTeX/MathML bug shipped exactly that way with
`Build EXIT=0`. The post-build check closes that gap and was verified by
reintroducing the bug.

## Static assets moved `static/` → `public/`

Zola serves `static/` at the root; SolidStart serves `public/`. URLs are
unchanged (`/assets/…`). Note the old `.gitignore` ignored `public/` because it
was Zola's *output* directory — that entry had to be removed or the assets would
have been silently untracked.

## `public/.nojekyll`

The build output contains `_build/`. GitHub Pages runs Jekyll by default, which
drops underscore-prefixed directories, so without this file every stylesheet and
script 404s.

## Archived rather than deleted

The `zola` and `hakyll` branches are kept as history. The `zola` branch also
received a commit of previously staged-but-uncommitted content
(`publications.md`, `research/`, `templates/home.html`, `scripts/new_post.sh`,
`shell.nix`) so that work was not lost in the switch.
