---
name: ui
description: >
  How this site looks and why — type roles, the colour tokens, class-based dark
  mode, the prose container, and the Tailwind v4 traps that have actually bitten
  here. Use when touching src/app.css, any component's classes, the Prose or
  Figure styling, a Shiki or KaTeX rule, adding a colour or a face, or checking
  whether a change reads right in both themes.
---

# UI — lokeshmohanty.github.io

Extends the global `ui` skill (`~/.agents/skills/ui/`), which owns the
cross-project decisions: the three type roles, the naming-by-role rule,
self-hosted Fontsource webfonts, and verifying in a browser rather than in the
stylesheet. **Read that first; this skill records only what is specific to this
site, or what the global rules turned into here.**

Everything visual is configured in `src/app.css`. There is no `tailwind.config`
— Tailwind v4 is configured in CSS, so `@theme` in that one file is the whole
design system.

## Working rules

1. **A new colour goes in `@theme` as a `--color-*` token with a `-dark`
   twin, or it does not go in.** Every token here is paired
   (`--color-rule` / `--color-rule-dark`); a component that hard-codes a hex or
   a Tailwind palette class will be wrong in one of the two themes.
   Tokens: `memory/tokens.md`.
2. **Dark mode is a class on `<html>`, not a media query.** `@custom-variant
   dark (&:where(.dark, .dark *))`. Style it with the `dark:` variant, and
   remember the class is set before first paint — anything reading the theme at
   runtime must handle both. `src/components/ThemeToggle.tsx` owns the toggle.
3. **Every visual change is checked in both themes, at 1280px and 390px, with
   the console open.** The 2026-07-28 visual pass caught four bugs that the
   HTML build checks could not see at all (see `STATUS.md` notes).
4. **MDX content is styled by the `Prose` container, not by the MDX.** Never put
   layout or type classes in a `.mdx` file; change `src/components/Prose.tsx` or
   `app.css` so every post gets it. Details: `memory/prose-and-code.md`.
5. **Wide content scrolls inside itself, never the body** — tables, KaTeX
   displays and code blocks each have their own `overflow-x` rule in `app.css`.
   Anything new that can be wide needs one too.
6. **Verify from a loaded page.** `getComputedStyle(el).fontFamily`, and
   `[...document.fonts].filter(f => f.status === "loaded")`. A correct-looking
   `@theme` block routinely fails to reach `code` — that exact bug is why
   `--default-mono-font-family` is set explicitly here.

## Memory

| File | Owns |
|---|---|
| `memory/tokens.md` | this site's colour tokens, dark-mode mechanism, and how they differ from the global palette |
| `memory/prose-and-code.md` | the `Prose` container, Shiki dual-theme, heading anchors, overflow rules, base font size |

Type stacks and the two Tailwind v4 font traps: [[typography]] (global).
Figures and diagrams inside posts belong to the sibling `visual-post` skill.

## Capture-back (binding — before you finish)

Whenever Lokesh corrects a visual decision, rejects a look, or states a
preference while this skill is in play:

1. Pick the memory that owns it; create a new one if none does, and add its row.
2. Write it in his words, with an absolute date and a `**Why:**` line.
3. If it contradicts an existing line, **edit that line** — never leave two
   versions of a rule in the tree.
4. If the decision is cross-project rather than about this site, it belongs in
   the **global** `ui` skill instead; put it there and link it from here.
5. Cross-reference with `[[name]]`, never by path; check with
   `harness-memory-links --check`.

Do this in the same session, before reporting the work done.
