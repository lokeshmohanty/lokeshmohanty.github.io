# Colour tokens and dark mode

*Built 2026-07-28 during the SolidStart migration; recorded here 2026-08-01.
Source of truth is the `@theme` block in `src/app.css` — this memory records the
intent and the rules, not a second copy to drift out of sync.*

**This site does not use the global palette.** The global `ui` skill's
`memory/palette.md` describes the Thesis "instrument reading" scheme — blueprint
paper, petrol ink, and three *semantic* accents (`--proved`, `--obligation`,
`--blocking`). This is a personal site and a blog: nothing here has a state to
report, so it has no semantic accents at all. Do not import them.

What it has instead is **warm paper in light, cool slate in dark**, one accent
used purely for interaction, and five roles:

| Role | Light | Dark |
|---|---|---|
| page ground | `--color-paper` | `--color-paper-dark` |
| body text | `--color-ink` | `--color-ink-dark` |
| secondary text, captions, dates | `--color-muted` | `--color-muted-dark` |
| borders and separators | `--color-rule` | `--color-rule-dark` |
| links, focus, selection | `--color-accent` | `--color-accent-dark` |

All are `oklch()`. Keep new values in oklch — the light and dark pairs were
chosen by holding hue and chroma and moving lightness, which is only legible as
an edit in that space.

## Rules

1. **Five roles, and a sixth means the hierarchy is wrong.** There is no third
   ink weight and no second border weight. If something needs to recede further
   than `--color-muted`, it probably should not be on the page.
2. **Every token is paired.** Adding `--color-x` without `--color-x-dark` is the
   bug, not an omission — the dark theme rebinds everything.
3. **Name by role, never by hue** (global rule). `--color-rule`, not
   `--color-grey-300`.
4. **The accent is interaction, not decoration.** Links (`prose-a:text-accent`),
   heading-anchor hover underline, and `::selection` at 25% via `color-mix`.
   A coloured thing that is not interactive should be `--color-muted`.

## Dark mode is class-based, not `prefers-color-scheme`

```css
@custom-variant dark (&:where(.dark, .dark *));
```

The `.dark` class is set on `<html>` **before first paint**, so there is no
flash. Consequences worth remembering:

- Style with the `dark:` variant, or with a `.dark ` prefixed selector for the
  unlayered rules (`app.css` uses `.dark .prose pre.shiki` etc. deliberately, to
  outrank the typography plugin).
- Anything that reads the theme at runtime reads
  `document.documentElement.classList.contains("dark")` — that is what
  `src/components/Mermaid.tsx` does, and it re-renders on a `MutationObserver`
  watching that class.
- A `prefers-color-scheme` media query in this codebase is a mistake; it will
  disagree with the toggle.

**Why:** the palette is small on purpose — the site is text, and the restraint
is what makes a screenshot or a diagram the only strong colour on a page.
