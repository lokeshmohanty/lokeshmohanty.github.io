export const site = {
  title: "Lokesh Mohanty",
  description:
    "Research notes on end-to-end planning for autonomous driving, reinforcement learning and simulation.",
  url: "https://lokeshmohanty.github.io",
  author: {
    name: "Lokesh Mohanty",
    email: "lokeshm@iisc.ac.in",
    avatar: "/assets/profile-pic.jpg",
    summary: "PhD researcher working on end-to-end planning for autonomous driving.",
    affiliation: "Indian Institute of Science, Bangalore",
  },
  nav: [
    { name: "Blog", href: "/blog" },
    { name: "Projects", href: "/projects" },
    { name: "Open source", href: "/opensource" },
    { name: "Publications", href: "/publications" },
    { name: "About", href: "/about" },
  ],
  social: {
    github: "https://github.com/lokeshmohanty",
    email: "mailto:lokeshm@iisc.ac.in",
  },
} as const;

export type Site = typeof site;
