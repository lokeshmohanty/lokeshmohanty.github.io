# Verifying a post renders

*Established 2026-07-29, when `npm run build` was blocked by the permission
classifier and post rendering had to be verified another way. This chain works
and is faster than a full build anyway. Migrated from Claude auto-memory into
this skill 2026-08-01.*

1. **Drafts are skipped by the content generator**, so `generate-content.mjs`
   proves nothing about a `draft: true` post. Compile it directly instead: a
   scratch script importing `@mdx-js/mdx` with the exact plugin list from
   `app.config.ts`, resolving modules from the project root via `createRequire`.
   Include a known-good existing post as a control.
2. **To preview drafts, use the repo's own switch:** `just dev-with-drafts` (or
   `INCLUDE_DRAFTS=true npm run dev`), added 2026-07-29 — it makes
   `generate-content.mjs` keep drafts so they appear in listings too. A draft
   `.mdx` under `src/routes/blog/` is a route regardless of the flag, so
   `/blog/<slug>` also renders directly without it.
3. **Dev is `PORT=3001`** since 2026-07-29. It silently falls back to another
   port when 3001 is taken — which happens when a second session is running —
   so read the server output for the real port before pointing a browser at it,
   and check for someone else's server before killing anything by process name.
4. **Screenshot with headless Chrome**, not Playwright: the playwright MCP is
   configured for `/opt/google/chrome/chrome`, which does not exist here.
   `google-chrome-stable --headless --disable-gpu --no-sandbox
   --window-size=1280,3000 --virtual-time-budget=20000 --screenshot=out.png URL`
   works, and the virtual-time budget is what lets client-rendered mermaid settle.
5. **Mermaid only fails at runtime**, so validate diagrams by rendering them
   against `node_modules/mermaid/dist/mermaid.min.js` in a scratch HTML page
   before trusting them.

Check every figure on the loaded page, not just that the page loads: an asset
404 shows as a broken image, a mermaid syntax error shows as a raw `<pre>`, and
neither fails the build. Check both themes — mermaid re-renders on toggle
([[visual-forms]]).

**Why:** `scripts/check-build.mjs` reads static HTML only, and the project's own
gotcha 5 says a green build is not proof — client-side and hydration errors
leave healthy markup behind. Actually loading the page is the check.

**How to apply:** compress screenshots before committing (see [[visual-forms]]);
`STATUS.md` already flags oversized assets in `public/assets/`. See
[[post-shape]] for what a post must contain.
