# STATUS — volatile state

*Update in place; keep short; absolute dates. History lives in git log.*

## Current focus (2026-07-28)

Migrated the site from Zola (and the older Hakyll setup) to SolidStart SSG on
the `solid` branch. Build is green: 12 routes prerendered, typecheck clean,
post-build verification passing. Visual pass done in Chromium — every route in
light and dark, at 1280px and 390px, console clean.

## Next actions

- [ ] Review the `solid` branch, then merge it into `main` (replaces Hakyll).
- [ ] In GitHub repo settings, set Pages source to **GitHub Actions** — the
      workflow deploys an artifact, not the stale `gh-pages` branch.
- [ ] Decide what to do with the `articles/` and `research/` sections that
      existed in Zola but were empty — not carried over.
- [ ] Fill in `/publications` (currently a placeholder).
- [ ] `public/assets/profile-pic.png` is 1.9 MB and `siminhale-50K.mp4` is 32 MB;
      worth compressing.

## Open obligations / blockers

- (none)

## Notes

- Bugs the visual pass caught that the HTML checks could not: `/search` crashed
  on hydration (SSR `fetch` of a relative URL), code blocks rendered as striped
  bands, headings were accent-coloured by the autolink anchor, and `404.html`
  was missing from the output root for GitHub Pages.

- `zola` branch has a new commit (`56bad28`) capturing content that was staged
  but never committed — publications, research/articles sections, home template,
  `new_post.sh`, `shell.nix`.
- The HackerEarth link on the one migrated blog post pointed at spoj.com in the
  original; corrected during migration.
