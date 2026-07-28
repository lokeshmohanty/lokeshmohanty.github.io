import { A } from "@solidjs/router";
import { For, Show } from "solid-js";

import PageMeta from "~/components/PageMeta";
import PostList from "~/components/PostList";
import { allTags, posts } from "~/lib/content";

export default function BlogIndex() {
  const tags = allTags();

  return (
    <>
      <PageMeta title="Blog" description="Research notes, technical posts and paper summaries." />

      <header class="not-prose mb-8">
        <h1 class="font-serif text-3xl font-semibold tracking-tight">Blog</h1>
        <p class="mt-2 text-muted dark:text-muted-dark">
          Research notes, technical posts and paper summaries.
        </p>
        <Show when={tags.length}>
          <ul class="mt-4 flex flex-wrap gap-2">
            <For each={tags}>
              {(t) => (
                <li>
                  <A
                    href={`/tags/${t.slug}`}
                    class="rounded-full border border-rule px-3 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent dark:border-rule-dark dark:text-muted-dark dark:hover:border-accent-dark dark:hover:text-accent-dark"
                  >
                    {t.tag} ({t.count})
                  </A>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </header>

      <PostList posts={posts} empty="No posts published yet." />
    </>
  );
}
