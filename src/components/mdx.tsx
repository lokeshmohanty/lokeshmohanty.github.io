import { A } from "@solidjs/router";
import type { Component, JSX } from "solid-js";
import { Dynamic } from "solid-js/web";

import Mermaid from "~/components/Mermaid";

/**
 * Internal links go through the router; external ones open in a new tab.
 *
 * A site-relative link to a *file* — `/assets/cv.pdf`, an image, a video — is
 * not a route, and must not reach the router. A plain `<a>` is not enough:
 * `Router` installs a global click handler that hijacks *every* same-origin
 * anchor, so the click would still resolve to the 404 route and the file would
 * never be fetched. The handler skips anchors carrying `target`, `download` or
 * `rel="external"`, so file links get all three signals and open in a new tab.
 * Routes on this site never carry a file extension.
 */
const FILE_HREF = /\.[a-z0-9]{2,5}(?:[?#]|$)/i;

function MdxLink(props: JSX.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }) {
  const href = props.href ?? "";
  const siteRelative = href.startsWith("/") && !href.startsWith("//");
  const file = siteRelative && FILE_HREF.test(href);

  if (siteRelative && !file) return <A href={href}>{props.children}</A>;

  const newTab = file || /^https?:\/\//.test(href);
  return (
    <a
      {...props}
      {...(newTab
        ? { target: "_blank", rel: file ? "noopener noreferrer external" : "noopener noreferrer" }
        : {})}
    >
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
