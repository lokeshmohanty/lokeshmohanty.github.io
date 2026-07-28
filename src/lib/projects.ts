/**
 * Project listing for `/projects`.
 *
 * Card projects are grouped by who the work was for: `research` covers work
 * done with a lab, a company or a collaborator, `personal` covers work that is
 * mine alone. Both render as cards and have a detail page at
 * `/projects/<slug>`; `featured` is their concatenation, used to resolve a slug
 * back to its entry.
 *
 * `other` entries are smaller pieces of work that a full page would only pad
 * out, so they render as a plain list.
 */

export type FeaturedProject = {
  slug: string;
  title: string;
  tagline: string;
  blurb: string;
  /** Only when the project has a real image of its own; no covers are invented. */
  cover?: string;
  affiliation: string;
  period: string;
  tags: readonly string[];
};

export type SmallProject = {
  title: string;
  blurb: string;
};

export const research: readonly FeaturedProject[] = [
  {
    slug: "dsdg",
    title: "DSDG",
    tagline: "Distributed synthetic data generation",
    blurb:
      "A distributed generator that produces synthetic training data by orchestrating multi-turn model conversations, then materialises each run as a reviewable candidate record for SFT and RLFT.",
    affiliation: "ZenteiQ AiTech Innovations · IndiaAI Mission",
    period: "Mar 2026 – present",
    tags: ["LLM post-training", "Distributed systems", "JAX/TPU"],
  },
  {
    slug: "caesar",
    title: "CAESAR",
    tagline: "Combat aircraft engagement and strategic AI response",
    blurb:
      "A machine-learning framework for electronic support measures: detecting radar pulses, sorting them into emitters, classifying and localising those emitters, and fusing multiple sensors into one picture for the pilot.",
    affiliation: "Defence R&D Organisation (DRDO) — collaboration",
    period: "Mar 2024 – Mar 2026",
    tags: ["Electronic warfare", "Sensor fusion", "Real-time ML"],
  },
  {
    slug: "scirex",
    title: "SciREX",
    tagline: "Scientific research and engineering excellence",
    blurb:
      "An open-source scientific ML framework in JAX, built jointly by the AiREX Lab at IISc and ZenteiQ, covering diffusion, training and transformer modules with reproducibility built in.",
    affiliation: "AiREX Lab, IISc · ZenteiQ · open source (Apache 2.0)",
    period: "2024 – present",
    tags: ["Open source", "JAX", "Scientific ML"],
  },
  {
    slug: "siminhale",
    title: "SimInhale",
    tagline: "Particle deposition in the human airway",
    blurb:
      "Turbulent flow through human airway geometry, coupled with Lagrangian particle tracking to find where inhaled particles deposit and in what fraction. GPU-accelerated with OpenMP and CUDA.",
    cover: "/assets/project-siminhale.jpg",
    affiliation: "Indian Institute of Science",
    period: "Sep 2022 – Mar 2023",
    tags: ["CFD", "CUDA", "Turbulence modelling"],
  },
];

export const personal: readonly FeaturedProject[] = [
  {
    slug: "expman",
    title: "ExpMan",
    tagline: "Experiment manager written in Rust",
    blurb:
      "A high-performance experiment tracker: logging that never blocks your training loop, a live SSE dashboard for comparing runs, and a single binary that serves it all. Published on crates.io and PyPI.",
    cover: "/assets/project-expman.jpg",
    affiliation: "Open source (MIT)",
    period: "Feb 2026 – present",
    tags: ["Rust", "Open source", "Tooling"],
  },
];

/** Every card project, for resolving a slug on a detail page. */
export const featured: readonly FeaturedProject[] = [...research, ...personal];

export const other: readonly SmallProject[] = [
  {
    title: "Semi-autonomous, gesture-controlled maze-solving robot",
    blurb:
      "Built around an ATmega16, with gestures resolved from an accelerometer and magnetometer, omni drive for movement, and a servo-mounted sonar for wall detection.",
  },
  {
    title: "Uncovering the nucleus of large networks",
    blurb:
      "A Python/NetworkX implementation of Dumba and Zhang's method, tested across several datasets and compared against degree, eigenvector, betweenness and closeness centrality.",
  },
  {
    title: "Coal outsourcing price calculator for e-reverse-auctioning",
    blurb:
      "Calculates the minimum sustainable price at which a project can be fulfilled, accounting for potential hazards and the cost of closure, so companies avoid bidding at unsustainable values.",
  },
];
