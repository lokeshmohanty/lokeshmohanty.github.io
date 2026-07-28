import { A } from "@solidjs/router";
import { For } from "solid-js";

import type { FeaturedProject } from "~/lib/projects";

/**
 * One group of project cards on `/projects`.
 *
 * Cards are text only. Not every project has an image of its own and none are
 * invented, so showing them here made the grid uneven — a card with a cover
 * towering over the text card beside it. The images that do exist appear on the
 * detail pages instead, via `ProjectHeader`.
 */
export default function ProjectCards(props: {
  projects: readonly FeaturedProject[];
}) {
  return (
    <ul class="not-prose mt-4 grid gap-6 sm:grid-cols-2">
      <For each={props.projects}>
        {(project) => (
          <li class="h-full">
            <A
              href={`/projects/${project.slug}`}
              class="group flex h-full flex-col rounded-2xl border border-rule p-5 transition-colors hover:border-accent dark:border-rule-dark dark:hover:border-accent-dark"
            >
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
              {/* mt-auto pins the tags to the bottom, so equal-height cards in
                  a row line their tag rows up instead of floating mid-card. */}
              <ul class="mt-auto flex flex-wrap gap-2 pt-4">
                <For each={project.tags}>
                  {(tag) => (
                    <li class="rounded-full border border-rule px-2.5 py-0.5 font-mono text-xs text-muted dark:border-rule-dark dark:text-muted-dark">
                      {tag}
                    </li>
                  )}
                </For>
              </ul>
            </A>
          </li>
        )}
      </For>
    </ul>
  );
}
