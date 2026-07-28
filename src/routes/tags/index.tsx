import { A } from "@solidjs/router";
import { For, Show } from "solid-js";

import PageMeta from "~/components/PageMeta";
import { allTags } from "~/lib/content";

export default function TagsIndex() {
  const tags = allTags();

  return (
    <>
      <PageMeta title="Tags" description="Browse posts by topic." />

      <header class="not-prose mb-8">
        <h1 class="font-serif text-3xl font-semibold tracking-tight">Tags</h1>
        <p class="mt-2 text-muted dark:text-muted-dark">Browse posts by topic.</p>
      </header>

      <Show
        when={tags.length}
        fallback={<p class="not-prose text-muted dark:text-muted-dark">No tags yet.</p>}
      >
        <ul class="not-prose flex flex-wrap gap-2">
          <For each={tags}>
            {(t) => (
              <li>
                <A
                  href={`/tags/${t.slug}`}
                  class="inline-flex items-center gap-2 rounded-full border border-rule px-4 py-1.5 text-sm transition-colors hover:border-accent hover:text-accent dark:border-rule-dark dark:hover:border-accent-dark dark:hover:text-accent-dark"
                >
                  {t.tag}
                  <span class="font-mono text-xs text-muted dark:text-muted-dark">{t.count}</span>
                </A>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </>
  );
}
