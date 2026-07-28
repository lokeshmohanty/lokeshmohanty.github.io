import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

import { remarkMermaid } from "./src/lib/remark-mermaid.js";
import { remarkReadingTime } from "./src/lib/remark-reading-time.js";

const mdxPlugin = mdx({
  // Emit raw JSX rather than automatic-runtime calls: Solid compiles JSX with
  // vite-plugin-solid and has no `solid-js/jsx-runtime` jsx/jsxs exports.
  jsx: true,
  providerImportSource: "solid-mdx",
  remarkPlugins: [
    [remarkFrontmatter, ["yaml"]],
    remarkMdxFrontmatter,
    remarkReadingTime,
    remarkGfm,
    remarkMath,
    // Must precede shiki so mermaid fences are not highlighted as code.
    remarkMermaid,
  ],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: "wrap", properties: { class: "heading-anchor" } }],
    [rehypeKatex, { strict: false }],
    [
      rehypeShiki,
      {
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false,
      },
    ],
  ],
});

export default defineConfig({
  // Additive to the js/jsx/ts/tsx defaults. solid-start also feeds this list to
  // vite-plugin-solid, so it compiles the JSX that MDX emits.
  extensions: ["mdx"],
  server: {
    preset: "static",
    prerender: {
      // crawlLinks picks up blog posts and tag pages; the explicit list
      // guarantees every top-level page and endpoint is emitted even if
      // nothing happens to link to it.
      crawlLinks: true,
      routes: [
        "/",
        "/about",
        "/projects",
        "/publications",
        "/data-science",
        "/blog",
        "/tags",
        "/search",
        "/rss.xml",
        "/404",
      ],
      failOnError: true,
    },
  },
  vite: {
    plugins: [{ enforce: "pre", ...mdxPlugin }, tailwindcss()],
  },
});
