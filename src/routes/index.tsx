import { A } from "@solidjs/router";
import { For, Show } from "solid-js";

import PageMeta from "~/components/PageMeta";
import PostList from "~/components/PostList";
import { posts } from "~/lib/content";
import { site } from "~/lib/site";

const interests = [
  "End-to-end planning for autonomous systems",
  "Reinforcement learning",
  "Diffusion models for planning",
  "Multi-agent systems and game theory",
  "Simulation for autonomous systems",
];

export default function Home() {
  const recent = () => posts.slice(0, 5);

  return (
    <>
      <PageMeta />

      <section class="not-prose">
        <img
          src={site.author.avatar}
          alt={site.author.name}
          width="88"
          height="88"
          class="mb-6 size-22 rounded-full object-cover ring-1 ring-rule dark:ring-rule-dark"
        />
        <h1 class="font-serif text-4xl font-semibold tracking-tight text-balance">
          {site.author.name}
        </h1>
        <p class="mt-4 text-lg leading-relaxed text-muted dark:text-muted-dark text-pretty">
          PhD researcher at {site.author.affiliation} working on{" "}
          <strong class="font-medium text-ink dark:text-ink-dark">
            end-to-end planning for autonomous systems
          </strong>
        </p>
      </section>

      <section class="not-prose mt-12">
        <h2 class="font-serif text-sm font-semibold tracking-widest text-muted uppercase dark:text-muted-dark">
          Research interests
        </h2>
        <ul class="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          <For each={interests}>
            {(item) => (
              <li class="flex gap-2.5 text-sm leading-relaxed">
                <span class="mt-2 size-1 shrink-0 rounded-full bg-accent dark:bg-accent-dark" />
                {item}
              </li>
            )}
          </For>
        </ul>
      </section>

      <Show when={recent().length}>
        <section class="not-prose mt-12">
          <div class="flex items-baseline justify-between gap-4">
            <h2 class="font-serif text-sm font-semibold tracking-widest text-muted uppercase dark:text-muted-dark">
              Writing
            </h2>
            <A
              href="/blog"
              class="text-sm text-accent hover:underline dark:text-accent-dark"
            >
              All posts →
            </A>
          </div>
          <div class="mt-2">
            <PostList posts={recent()} />
          </div>
        </section>
      </Show>
    </>
  );
}
