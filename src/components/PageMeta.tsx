import { Meta, Title } from "@solidjs/meta";
import { Show } from "solid-js";

import { site } from "~/lib/site";

/**
 * Sets per-page document metadata. MDX pages call this with their own
 * frontmatter, which remark-mdx-frontmatter puts in scope: `<PageMeta {...frontmatter} />`.
 */
export default function PageMeta(props: { title?: string; description?: string }) {
  const title = () => (props.title ? `${props.title} · ${site.title}` : site.title);
  const description = () => props.description ?? site.description;

  return (
    <>
      <Title>{title()}</Title>
      <Meta name="description" content={description()} />
      <Meta property="og:title" content={title()} />
      <Meta property="og:description" content={description()} />
      <Meta property="og:type" content="website" />
      <Show when={props.title}>
        <Meta name="twitter:card" content="summary" />
      </Show>
    </>
  );
}
