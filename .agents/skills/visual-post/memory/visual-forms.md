# Visual forms — mechanics

*Established 2026-08-01, from the figure work across the five drafts written
2026-07-29 to 2026-07-31 (haskell, expman-rs, litgraph, harness-ops,
blog-migrations).*

`Figure` and `Mermaid` are registered in `src/components/mdx.tsx` and need **no
import** in an `.mdx` file. Everything else you use must be imported.

## Screenshots — `<Figure>`

```mdx
<Figure
  src="/assets/expman-dashboard-metrics.jpg"
  alt="Six runs compared on a metrics grid, three of them diverging after step 4k"
  caption="What the reader should notice here."
  wide
/>
```

Source: `src/components/Figure.tsx`. Props are `src`, `alt`, `caption?`,
`wide?`. It handles lazy loading, the rounded border and caption styling, and
renders a plain `<img>` rather than a link — deliberately, so the router's
global anchor handler stays out of it (`AGENTS.md` gotcha 9).

- **`wide` only for genuinely wide images** (a ~1600px dashboard or a
  full-window UI). It breaks the figure out of the prose measure with
  `lg:-mx-16`; on a narrow image that just leaves it stranded.
- **Never a raw `<img>` when the image deserves a caption.** A raw tag is fine
  for a small inline diagram, but then set `width` and `height` to avoid layout
  shift.
- **Asset naming is `<subject>-<what-it-shows>.jpg`** — the live set is
  `expman-dashboard-metrics.jpg`, `litgraph-viewer.jpg`,
  `haskell-toggle-game.jpg`, `blog-solidstart.jpg`. Keep it; the directory is
  flat and the prefix is what groups a post's assets.
- **Compress before committing:** `magick in.png -resize 1600x -strip -quality
  82 out.jpg` — this took the expman dashboard captures from ~600 KB to ~65 KB
  each. JPEG for screenshots; PNG only for line art or real transparency.
  `scripts/check-build.mjs` fails the build if HTML points at a missing asset,
  but nothing catches an uncompressed one, so `STATUS.md` tracks the offenders.

## Diagrams — mermaid

A ` ```mermaid ` fence becomes a diagram via `src/lib/remark-mermaid.js` →
`src/components/Mermaid.tsx`. Facts that change how you should write one:

- **It renders on the client only.** The prerendered HTML contains the raw
  source in a `<pre>`, which is replaced when mermaid loads. So it is invisible
  to `check-build.mjs`, and a syntax error shows up as a code block on the live
  page rather than as a build failure.
- **It re-renders on theme toggle** — a `MutationObserver` on
  `documentElement.class` re-runs `mermaid.render` with theme `dark` or
  `neutral`. Do not hard-code colours in a diagram; they will be wrong in one
  of the two themes. `fontFamily: "inherit"` means the site's faces already apply.
- **Validate before trusting it**: render the source against
  `node_modules/mermaid/dist/mermaid.min.js` in a scratch HTML page. See
  [[render-verification]] step 5.
- Keep diagrams to one idea and under about a dozen nodes. A mermaid graph that
  needs a legend should have been a table.

## Math

KaTeX renders at build time, no client JS. Inline `$…$`, display `$$…$$`.
`.katex-display` is set to scroll rather than overflow (`src/app.css`). A
screenshot of an equation is never correct here.

## Interactive components

Import any Solid component into the MDX and use it inline. Two constraints from
`AGENTS.md`:

- **No `fetch` of a relative URL in `createResource`** (gotcha 6) — it runs
  during SSR, Node rejects the URL, and the rethrow on hydration kills the
  route. Client-only work goes in `onMount`.
- The component ships in the client bundle for every reader of that post.
  Something that only demonstrates a static structure should be a diagram.

## Dark mode

Mermaid and KaTeX follow the theme; **screenshots do not**. Capture a post's
screenshots in one theme consistently, and match the theme the surrounding
posts used, so a reader scrolling the blog does not get alternating flashes.

**Why:** the visuals are the argument of a post ([[post-shape]]), so a figure
that fails silently on the live page — mermaid syntax error, missing asset,
dark-on-dark screenshot — costs more than a prose mistake.
