# lokeshmohanty.github.io — Documentation

*Last synced: 2026-07-28 (SolidStart migration).*

Personal site and research blog for Lokesh Mohanty. Statically generated with
SolidStart, authored in MDX, deployed to GitHub Pages.

## Contents

- [Architecture](architecture.md) — stack, build pipeline, content model
- [Authoring content](authoring.md) — writing pages and posts
- [Decisions](decisions.md) — why the stack looks the way it does

## At a glance

| | |
| --- | --- |
| Framework | SolidStart 1.3 (Vinxi + Vite + Nitro) |
| Rendering | Full static prerender (`preset: "static"`) |
| Content | MDX 3 files that are themselves routes |
| Styling | Tailwind CSS v4 + `@tailwindcss/typography` |
| Output | `.output/public` |
| Deploy | GitHub Actions → GitHub Pages, on push to `main` |

## Commands

| command | what |
| --- | --- |
| `npm run dev` | dev server |
| `npm run build` | generate content → prerender → verify |
| `npm run content` | regenerate post metadata + search index only |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run new -- "Title"` | scaffold a draft post |

`just` wraps all of these; see the `justfile`.

## History

The repository previously held two other generators, both now replaced:

- `main` — a Hakyll (Haskell) site; `site.hs`, `templates/`, cabal config.
- `zola` branch — a Zola site with the `tanuki` theme, `content/`, `config.toml`.

Both branches are retained as an archive. The live site is built from `main`.
The `gh-pages` branch holds stale HTML from 2023 and is no longer the deploy
target — Pages now serves the GitHub Actions artifact.

## Honest gaps

- No automated tests beyond `check-build.mjs` and `tsc`; there is no test runner.
- Browser verification is manual. A visual pass on 2026-07-28 covered every
  route in light and dark at 1280px and 390px, but nothing guards against
  regressions — `check-build.mjs` reads static HTML and cannot see client-side
  failures.
