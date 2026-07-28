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

      {/* Portrait sits beside the name from `sm` up and stacks above it on
          phones, where a side-by-side split would leave the text too narrow. */}
      <section class="not-prose flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <img
          src={site.author.avatar}
          alt={site.author.name}
          width="640"
          height="640"
          class="aspect-square w-36 shrink-0 rounded-2xl object-cover ring-1 ring-rule sm:w-44 dark:ring-rule-dark"
        />
        <div class="sm:flex-1 sm:text-center">
          <h1 class="font-display text-4xl font-semibold tracking-tight text-balance">
            {site.author.name}
          </h1>
          <p class="mt-3 text-lg leading-relaxed text-muted dark:text-muted-dark text-pretty">
            PhD researcher at {site.author.affiliation} working on{" "}
            <strong class="font-medium text-ink dark:text-ink-dark">
              end-to-end planning for autonomous systems
            </strong>
          </p>
        </div>
      </section>

      <section class="not-prose mt-12">
        <h2 class="font-mono text-xs font-semibold tracking-wider text-muted uppercase dark:text-muted-dark">
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
            <h2 class="font-mono text-xs font-semibold tracking-wider text-muted uppercase dark:text-muted-dark">
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
