import { A } from "@solidjs/router";
import { createMemo, createSignal, For, onMount, Show } from "solid-js";

import PageMeta from "~/components/PageMeta";
import { formatDate } from "~/lib/content";

interface IndexedPost {
  title: string;
  href: string;
  date: string;
  tags: string[];
  excerpt: string;
  body: string;
}

/** Snippet of `body` around the first match, for result context. */
function snippet(body: string, term: string): string {
  const at = body.toLowerCase().indexOf(term);
  if (at === -1) return body.slice(0, 160);
  const start = Math.max(0, at - 60);
  return `${start > 0 ? "…" : ""}${body.slice(start, start + 180).trim()}…`;
}

export default function Search() {
  const [query, setQuery] = createSignal("");
  const [index, setIndex] = createSignal<IndexedPost[]>([]);
  const [failed, setFailed] = createSignal(false);

  // Fetched in onMount rather than createResource: a resource also runs during
  // SSR, where the relative URL is not valid input to Node's fetch. That error
  // is serialised into the page and rethrown on hydration, killing the route.
  onMount(async () => {
    try {
      const res = await fetch("/search-index.json");
      if (!res.ok) throw new Error(`search index unavailable (${res.status})`);
      setIndex(await res.json());
    } catch (err) {
      console.error("[search] could not load the index", err);
      setFailed(true);
    }
  });

  const results = createMemo(() => {
    const term = query().trim().toLowerCase();
    if (term.length < 2) return [];

    return index()
      .map((post) => {
        const haystack = `${post.title} ${post.tags.join(" ")} ${post.body}`.toLowerCase();
        if (!haystack.includes(term)) return null;
        // Title hits rank above body hits.
        const score = post.title.toLowerCase().includes(term) ? 0 : 1;
        return { post, score };
      })
      .filter((r): r is { post: IndexedPost; score: number } => r !== null)
      .sort((a, b) => a.score - b.score || b.post.date.localeCompare(a.post.date))
      .map((r) => r.post);
  });

  return (
    <>
      <PageMeta title="Search" description="Search posts on this site." />

      <header class="not-prose mb-6">
        <h1 class="font-display text-3xl font-semibold tracking-tight">Search</h1>
      </header>

      <div class="not-prose">
        <input
          type="search"
          value={query()}
          onInput={(e) => setQuery(e.currentTarget.value)}
          placeholder="Search posts…"
          autofocus
          aria-label="Search posts"
          class="w-full rounded-lg border border-rule bg-transparent px-4 py-2.5 text-base outline-none transition-colors placeholder:text-muted focus:border-accent dark:border-rule-dark dark:placeholder:text-muted-dark dark:focus:border-accent-dark"
        />

        <Show when={failed()}>
          <p class="mt-4 text-sm text-muted dark:text-muted-dark">
            Could not load the search index.
          </p>
        </Show>

        <Show when={query().trim().length >= 2}>
          <p class="mt-4 text-sm text-muted dark:text-muted-dark">
            {results().length} {results().length === 1 ? "result" : "results"}
          </p>

          <ul class="mt-2 divide-y divide-rule dark:divide-rule-dark">
            <For each={results()}>
              {(post) => (
                <li class="py-5">
                  <A href={post.href} class="group block">
                    <div class="flex flex-wrap items-baseline gap-x-3">
                      <h2 class="font-display text-lg font-medium group-hover:text-accent dark:group-hover:text-accent-dark">
                        {post.title}
                      </h2>
                      <Show when={post.date}>
                        <time class="ml-auto shrink-0 font-mono text-xs text-muted dark:text-muted-dark">
                          {formatDate(post.date)}
                        </time>
                      </Show>
                    </div>
                    <p class="mt-1.5 text-sm leading-relaxed text-muted dark:text-muted-dark">
                      {snippet(post.body, query().trim().toLowerCase())}
                    </p>
                  </A>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </div>
    </>
  );
}
