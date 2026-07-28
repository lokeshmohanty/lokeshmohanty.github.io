import { A } from "@solidjs/router";
import { For, Show } from "solid-js";

import { featured } from "~/lib/projects";

/**
 * Masthead for a project detail page. Takes the slug and reads the rest from
 * `~/lib/projects`, so the card on `/projects` and the page it links to can
 * never drift apart.
 */
export default function ProjectHeader(props: { slug: string }) {
  const project = () => featured.find((p) => p.slug === props.slug);

  return (
    <Show when={project()}>
      {(p) => (
        <header class="not-prose mb-10">
          <A
            href="/projects"
            class="font-mono text-xs text-muted hover:text-accent dark:text-muted-dark dark:hover:text-accent-dark"
          >
            ← Projects
          </A>

          <img
            src={p().cover}
            alt=""
            width="600"
            height="400"
            class="mt-4 aspect-[3/2] w-full rounded-2xl border border-rule object-cover dark:border-rule-dark"
          />

          <h1 class="mt-6 font-display text-3xl font-semibold tracking-tight text-balance">
            {p().title}
          </h1>
          <p class="mt-1 text-lg text-muted dark:text-muted-dark">{p().tagline}</p>

          <dl class="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted dark:text-muted-dark">
            <div class="flex gap-2">
              <dt class="sr-only">Period</dt>
              <dd>{p().period}</dd>
            </div>
            <div class="flex gap-2">
              <dt class="sr-only">Affiliation</dt>
              <dd>{p().affiliation}</dd>
            </div>
          </dl>

          <ul class="mt-4 flex flex-wrap gap-2">
            <For each={p().tags}>
              {(tag) => (
                <li class="rounded-full border border-rule px-2.5 py-0.5 font-mono text-xs text-muted dark:border-rule-dark dark:text-muted-dark">
                  {tag}
                </li>
              )}
            </For>
          </ul>
        </header>
      )}
    </Show>
  );
}
