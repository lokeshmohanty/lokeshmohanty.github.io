import { A } from "@solidjs/router";
import { For } from "solid-js";

import type { FeaturedProject } from "~/lib/projects";

/** One group of project cards on `/projects`. */
export default function ProjectCards(props: {
  projects: readonly FeaturedProject[];
}) {
  return (
    <ul class="not-prose mt-4 grid gap-6 sm:grid-cols-2">
      <For each={props.projects}>
        {(project) => (
          <li>
            <A
              href={`/projects/${project.slug}`}
              class="group flex h-full flex-col overflow-hidden rounded-2xl border border-rule transition-colors hover:border-accent dark:border-rule-dark dark:hover:border-accent-dark"
            >
              <img
                src={project.cover}
                alt=""
                width="600"
                height="400"
                class="aspect-[3/2] w-full object-cover"
              />
              <div class="flex flex-1 flex-col p-5">
                <p class="font-mono text-xs tracking-wider text-muted uppercase dark:text-muted-dark">
                  {project.period}
                </p>
                <h3 class="mt-2 font-display text-xl font-semibold tracking-tight group-hover:text-accent dark:group-hover:text-accent-dark">
                  {project.title}
                </h3>
                <p class="mt-1 text-sm text-muted dark:text-muted-dark">
                  {project.tagline}
                </p>
                <p class="mt-3 text-sm leading-relaxed">{project.blurb}</p>
                <ul class="mt-4 flex flex-wrap gap-2 pt-1">
                  <For each={project.tags}>
                    {(tag) => (
                      <li class="rounded-full border border-rule px-2.5 py-0.5 font-mono text-xs text-muted dark:border-rule-dark dark:text-muted-dark">
                        {tag}
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            </A>
          </li>
        )}
      </For>
    </ul>
  );
}
