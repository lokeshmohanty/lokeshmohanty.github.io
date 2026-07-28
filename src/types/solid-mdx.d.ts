/**
 * solid-mdx ships types at `types/index.d.ts` but its package.json "exports"
 * map doesn't point at them, so TypeScript can't resolve them under
 * moduleResolution: bundler. Declared here instead.
 */
declare module "solid-mdx" {
  import type { Component, JSX } from "solid-js";

  export const MDXContext: import("solid-js").Context<Record<string, Component<any>>>;

  export const MDXProvider: Component<{
    components?: Record<string, Component<any>>;
    children?: JSX.Element;
  }>;

  export function useMDXComponents(): Record<string, Component<any>>;
}

/** Compiled MDX modules, including the exports our remark plugins add. */
declare module "*.mdx" {
  import type { Component } from "solid-js";

  const MDXComponent: Component<Record<string, unknown>>;
  export default MDXComponent;

  export const frontmatter: {
    title: string;
    date?: string;
    description?: string;
    tags?: string[];
    draft?: boolean;
  };
  export const readingTime: number;
  export const excerpt: string;
}
