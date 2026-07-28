import { A } from "@solidjs/router";
import { For, Show } from "solid-js";

import { formatDate, type Post } from "~/lib/content";

export default function PostList(props: { posts: Post[]; empty?: string }) {
  return (
    <Show
      when={props.posts.length}
      fallback={
        <p class="not-prose text-muted dark:text-muted-dark">
          {props.empty ?? "Nothing here yet."}
        </p>
      }
    >
      <ul class="not-prose divide-y divide-rule dark:divide-rule-dark">
        <For each={props.posts}>
          {(post) => (
            <li class="py-5">
              <A href={post.href} class="group block">
                <div class="flex flex-wrap items-baseline gap-x-3">
                  <h3 class="font-display text-lg font-medium tracking-tight group-hover:text-accent dark:group-hover:text-accent-dark">
                    {post.title}
                  </h3>
                  <Show when={post.date}>
                    <time
                      datetime={post.date}
                      class="ml-auto shrink-0 font-mono text-xs text-muted dark:text-muted-dark"
                    >
                      {formatDate(post.date)}
                    </time>
                  </Show>
                </div>
                <Show when={post.excerpt}>
                  <p class="mt-1.5 text-sm leading-relaxed text-muted dark:text-muted-dark">
                    {post.excerpt}
                  </p>
                </Show>
              </A>
            </li>
          )}
        </For>
      </ul>
    </Show>
  );
}
