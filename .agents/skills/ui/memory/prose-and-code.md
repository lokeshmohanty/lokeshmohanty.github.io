# Prose, code and the unlayered rules

*Built 2026-07-28 during the SolidStart migration; recorded here 2026-08-01.
Source: `src/app.css` and `src/components/Prose.tsx`.*

Every MDX route renders inside `Prose`, a single `@tailwindcss/typography`
container (`prose prose-neutral max-w-none dark:prose-invert`) carrying the
site's overrides: headings on `--font-display` with tight tracking, links on the
accent with underline-on-hover, and no backtick pseudo-elements around inline
code. **Change content styling there or in `app.css`, never in a `.mdx` file.**

## Base size is a percentage, deliberately

```css
html { font-size: 112.5%; }
```

Not a px value — it scales the reader's own browser default instead of
overriding it, and every rem-based utility plus the typography plugin's whole
scale follows from that one line. Changing type size site-wide means changing
this number, not adding `text-lg` anywhere.

## Three rules are unlayered on purpose

Tailwind's `@layer` ordering would let the typography plugin win, so these sit
outside any layer to outrank it. Do not move them into `@layer components` to
tidy up; each will silently stop working.

1. **Shiki dual-theme.** Both themes are baked in at build time as CSS
   variables; `.shiki`/`.shiki span` pick `--shiki-light`, `.dark` picks
   `--shiki-dark`. **The background belongs on the `<pre>` only** — putting it
   on the token spans too paints a ragged stripe behind every line, which is
   exactly the bug the 2026-07-28 visual pass caught.
2. **`.prose pre.shiki`** carries the background, border, radius, padding,
   `overflow-x: auto`, `0.875em` and `1.7` line-height.
3. **`.heading-anchor`.** `rehype-autolink-headings` wraps heading text in an
   anchor, which would otherwise inherit `prose-a`'s accent and make every
   heading look like a link. The rule forces `color: inherit`, no decoration,
   inherited weight — and restores an accent underline on hover only.

## Overflow

Wide content scrolls inside itself; the body never scrolls sideways.
`.katex-display` and `.prose table` each get their own `overflow-x: auto` in
`@layer components` (the table is `display: block; white-space: nowrap` to make
that work). Anything new that can exceed the measure needs the same treatment —
including a `<Figure>`, which handles it by staying `w-full` and using `wide`
rather than by overflowing.

## Fonts

Stacks and the two Tailwind v4 traps are global: [[typography]]. Both traps are
live in this file and load-bearing — `--font-sans: var(--font-body)` and
`--default-mono-font-family: var(--font-mono)`. The second one is repeated as
gotcha 8 in `AGENTS.md` because without it every code block on the site falls
back to `ui-monospace` while the `@theme` block still looks correct.

**Why:** the content is the product here, so the prose container is the most
load-bearing component on the site, and three of its rules only work because of
where they sit relative to Tailwind's layers.
