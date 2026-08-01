---
name: visual-post
description: >
  Write blog posts for this site whose explanation is carried by visuals —
  diagrams, screenshots, plots, interactive components — rather than by prose.
  Use when drafting, revising or reviewing any post under src/routes/blog/,
  when choosing what figure a section needs, when adding a mermaid diagram or a
  Figure, when captioning or compressing an image, or when a post reads as a
  wall of text.
---

# Visual-first posts

A post here is a record of something Lokesh built. The reader has to *see* the
thing to care about it, so the visuals are the argument and the prose is the
connective tissue — not the other way round.

## Working rules

1. **Name the question before choosing the form.** Every visual answers one
   question the prose would otherwise spend a paragraph on. If you cannot state
   that question in a sentence, the figure is decoration — cut it.
2. **Never ship a text-only post, and never invent artwork.** Screenshots come
   from running the real thing; diagrams describe the real structure; numbers
   come from the live system. No stock imagery, no mocked-up UI, no illustrative
   fabrications. See `memory/post-shape.md`.
3. **One visual per section, roughly.** Two adjacent figures compete; the reader
   reads neither. If a section needs two, it is two sections.
4. **Place the figure after the sentence that makes it necessary**, before the
   explanation of what it shows. The reader should arrive at it already wanting it.
5. **Caption and alt are different strings.** `alt` describes the image for
   someone who cannot see it. `caption` says what the reader should *notice* —
   never "Screenshot of the dashboard".
6. **Verify by loading the page, not by reading the source.** Mermaid fails only
   at runtime and a green build proves nothing (`AGENTS.md` gotcha 5). Procedure:
   `memory/render-verification.md`.
7. **Voice is first person, his own experience.** The visuals do not exempt the
   prose — `memory/voice.md` lists the tells that made earlier drafts read as
   generated.

## Choosing the form

| The question the reader has | Form |
|---|---|
| How do these pieces fit together / what flows where? | ` ```mermaid ` fence — no import needed |
| What does it actually look like when it runs? | `<Figure>` with a real screenshot |
| Did the numbers move? | a plot generated from real data, committed as an asset |
| What does this expression mean? | KaTeX display math — never a picture of math |
| What happens if I change this? | a Solid component imported into the MDX |
| What did the terminal say? | a fenced code block, not a screenshot of a terminal |

Mechanics of each — props, sizing, compression, naming, the mermaid theme
observer — are in `memory/visual-forms.md`. Read it before adding any asset.

## Memory

| File | Owns |
|---|---|
| `memory/visual-forms.md` | mechanics: `Figure` props, `wide`, mermaid behaviour, asset naming, compression |
| `memory/post-shape.md` | what a post must contain, its narrative arc, how it is dated, drafts |
| `memory/voice.md` | first-person voice, and the LLM tells to strip out |
| `memory/render-verification.md` | how to prove a post renders when `npm run build` is unavailable |

Site-wide type, colour and dark-mode conventions live in the sibling `ui` skill
(`.agents/skills/ui/`); do not restate them here.

## Capture-back (binding — before you finish)

Whenever Lokesh corrects something, states a preference, or rejects a draft
while this skill is in play:

1. Pick the memory that owns it from the table above; create a new one if none
   does, and add its row.
2. Write it **in his words**, with an absolute date, and a `**Why:**` line — the
   reason is what makes it applicable to the next post.
3. If it contradicts something already written, **edit that line**. Never leave
   two versions of a rule in the tree.
4. Cross-reference with `[[name]]`, never by path. Check with
   `harness-memory-links --check`.

Do this in the same session, before reporting the work done. A session that
took feedback and shipped no memory edit has thrown the feedback away.
