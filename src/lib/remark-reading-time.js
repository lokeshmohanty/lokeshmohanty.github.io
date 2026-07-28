import { valueToEstree } from "estree-util-value-to-estree";
import { toString } from "mdast-util-to-string";
import { define } from "unist-util-mdx-define";
import { visit } from "unist-util-visit";

const WORDS_PER_MINUTE = 220;

/**
 * Exports `readingTime` (minutes) from every MDX file, for the post header to
 * display in-page. Listing metadata comes from scripts/generate-content.mjs
 * instead, so nothing here is needed outside a post's own chunk.
 */
export function remarkReadingTime() {
  return (tree, file) => {
    // Prose only: skip frontmatter, code fences and generated JSX elements.
    const parts = [];
    visit(tree, (node) => {
      if (node.type === "paragraph" || node.type === "heading") {
        parts.push(toString(node));
        return "skip";
      }
    });

    const words = parts.join(" ").split(/\s+/).filter(Boolean).length;

    define(tree, file, {
      readingTime: valueToEstree(Math.max(1, Math.round(words / WORDS_PER_MINUTE))),
    });
  };
}

export default remarkReadingTime;
