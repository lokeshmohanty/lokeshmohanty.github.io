import { A } from "@solidjs/router";
import { For, Show } from "solid-js";

import PageMeta from "~/components/PageMeta";
import { formatDate, tagSlug } from "~/lib/content";

/**
 * Title block for a blog post. Used at the top of each post's MDX:
 * `<PostHeader {...frontmatter} readingTime={readingTime} />`
 */
export default function PostHeader(props: {
  title: string;
  date?: string;
  description?: string;
  tags?: string[];
  readingTime?: number;
}) {
  return (
    <>
      <PageMeta title={props.title} description={props.description} />
      <header class="mb-10 border-b border-rule pb-6 dark:border-rule-dark">
        <h1 class="mb-3 font-display text-3xl font-semibold tracking-tight text-balance">
          {props.title}
        </h1>
        <div class="not-prose flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted dark:text-muted-dark">
          <Show when={props.date}>
            <time datetime={props.date}>{formatDate(props.date)}</time>
          </Show>
          <Show when={props.readingTime}>
            <span aria-hidden="true">·</span>
            <span>{props.readingTime} min read</span>
          </Show>
          <Show when={props.tags?.length}>
            <span aria-hidden="true">·</span>
            <ul class="flex flex-wrap gap-2">
              <For each={props.tags}>
                {(tag) => (
                  <li>
                    <A
                      href={`/tags/${tagSlug(tag)}`}
                      class="text-accent hover:underline dark:text-accent-dark"
                    >
                      #{tag}
                    </A>
                  </li>
                )}
              </For>
            </ul>
          </Show>
        </div>
      </header>
    </>
  );
}
