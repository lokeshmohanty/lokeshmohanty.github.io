/**
 * Public repositories listed on `/opensource`.
 *
 * Hand-maintained rather than fetched: the page is prerendered to static HTML,
 * so a runtime call to the GitHub API would either not run at build time or
 * would burn an unauthenticated rate limit on every visitor. Descriptions here
 * track each repo's GitHub description; `language` is its dominant language and
 * `tags` its topics, both trimmed to what reads well on a card.
 *
 * `project` points at the detail page for a repo that also has one, so the two
 * listings link to each other instead of competing.
 */

export type Repo = {
  name: string;
  tagline: string;
  blurb: string;
  /** Dominant language, shown as the card eyebrow. */
  language: string;
  repo: string;
  /** Live demo, docs or landing page, when the repo publishes one. */
  demo?: string;
  /** Path of the matching `/projects/<slug>` page, when there is one. */
  project?: string;
  /** Omitted when the repo ships no licence file. */
  license?: string;
  tags: readonly string[];
};

export const repos: readonly Repo[] = [
  {
    name: "expman-rs",
    tagline: "Experiment manager written in Rust",
    blurb:
      "Logging that never blocks the training loop, a live web dashboard for comparing runs, and a friendly CLI — with a Python wrapper so it drops into an existing training script.",
    language: "Rust",
    repo: "https://github.com/lokeshmohanty/expman-rs",
    demo: "https://lokeshmohanty.github.io/expman-rs/",
    project: "/projects/expman",
    license: "MIT",
    tags: ["Rust", "Python", "Experiment tracking", "Dashboard"],
  },
  {
    name: "ecr",
    tagline: "Keyboard-driven mail client for notmuch",
    blurb:
      "Reads an existing notmuch maildir rather than owning your mail: a Rust server and a single SolidJS interface that ships to the browser, the desktop and Android.",
    language: "Rust",
    repo: "https://github.com/lokeshmohanty/ecr",
    demo: "https://www.lokeshmohanty.in/ecr",
    license: "MIT / GPL-3.0",
    tags: ["Rust", "SolidJS", "Tauri", "notmuch"],
  },
  {
    name: "nix",
    tagline: "NixOS configuration and dotfiles",
    blurb:
      "The whole machine as one flake — NixOS hosts, Home Manager, Neovim and the agent harness — plus an installer that falls back to APT and upstream tarballs on a box where Nix is not wanted.",
    language: "Nix",
    repo: "https://github.com/lokeshmohanty/nix",
    tags: ["Nix", "NixOS", "Home Manager", "Dotfiles"],
  },
  {
    name: "games",
    tagline: "Client-side web games with P2P multiplayer",
    blurb:
      "Every game is multiplayer and every game seats bots, so a table never needs a second person. Peer-to-peer, no server, no build step — open the HTML file and play.",
    language: "JavaScript",
    repo: "https://github.com/lokeshmohanty/games",
    demo: "https://www.lokeshmohanty.in/games/",
    license: "MIT",
    tags: ["JavaScript", "WebRTC", "No build step", "Games"],
  },
  {
    name: "reticle",
    tagline: "An opinionated Zola theme",
    blurb:
      "An instrument-reading design system for Zola: a fixed type trio, semantic state accents, and the margin-tape signature element, across docs (with versioning), e-books, blogs and landing pages.",
    language: "SCSS",
    repo: "https://github.com/lokeshmohanty/reticle",
    demo: "https://www.lokeshmohanty.in/reticle/",
    license: "MIT",
    tags: ["Zola", "SCSS", "Design system", "Theme"],
  },
];
