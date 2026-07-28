import { A } from "@solidjs/router";
import type { Component, JSX } from "solid-js";
import { Dynamic } from "solid-js/web";

import Mermaid from "~/components/Mermaid";

/** Internal links go through the router; external ones open in a new tab. */
function MdxLink(props: JSX.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }) {
  const href = props.href ?? "";
  const internal = href.startsWith("/") && !href.startsWith("//");

  if (internal) return <A href={href}>{props.children}</A>;

  const external = /^https?:\/\//.test(href);
  return (
    <a {...props} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {props.children}
    </a>
  );
}

/**
 * MathML elements emitted by rehype-katex.
 *
 * With `providerImportSource` set, MDX resolves every element name through the
 * components map. solid-mdx's default map covers HTML and SVG but not MathML,
 * so without these entries KaTeX output renders `undefined` as a component and
 * throws during SSR.
 */
const MATHML_TAGS = [
  "math",
  "semantics",
  "annotation",
  "annotation-xml",
  "maction",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mglyph",
  "mi",
  "mlabeledtr",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mprescripts",
  "mroot",
  "mrow",
  "ms",
  "mspace",
  "msqrt",
  "mstyle",
  "msub",
  "msubsup",
  "msup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
  "none",
] as const;

const mathmlComponents = Object.fromEntries(
  MATHML_TAGS.map((tag) => [
    tag,
    (props: Record<string, unknown>) => <Dynamic component={tag} {...props} />,
  ]),
) as Record<string, Component<Record<string, unknown>>>;

export const mdxComponents = {
  ...mathmlComponents,
  a: MdxLink,
  Mermaid,
};
