# What a post must contain

*Stated 2026-07-29 while reviewing the first drafts of the harness-ops, litgraph
and expman-rs posts. Migrated from Claude auto-memory into this skill 2026-08-01.*

**Never ship a text-only post.** Every post needs screenshots, diagrams and a
references section. Mechanics of each form are in [[visual-forms]]. Put a
`## References` section at the end with links to source repos, the tools
involved, and related posts on the site.

**Date a post when the thing was first created, not when the post is written.**
Take the date from the project's first commit — e.g. expman-rs is `2026-02-18`
("revamp lokeshmohanty/expman using rust"), litgraph `2026-07-03`, the agent
harness `2026-07-18`. The filename must match: `YYYY-MM-DD-slug.mdx`.

**Arc: motivation → how I got it done → current status → my inference.** Open
with the itch that led to the project, not with technical detail. Keep it subtle
— these are the shape of the narrative, never literal section headings.

**Why:** the posts are a record of how his own tools came to exist, so the
personal reason for building each one is the point, and a reader needs to see
the thing to care about it.

**How to apply:** write drafts (`draft: true`) so he reviews before publishing.
Gather real material first — read the actual repo, git log, and docs; run the
tool and screenshot it rather than describing it. Real numbers from the live
system beat approximations. See [[render-verification]] for how to check a post
renders when the full build is unavailable, and [[voice]] for how it should read.
