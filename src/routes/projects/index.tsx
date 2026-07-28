import { For } from "solid-js";

import PageMeta from "~/components/PageMeta";
import ProjectCards from "~/components/ProjectCards";
import { other, personal, research } from "~/lib/projects";

const eyebrow =
  "font-mono text-xs font-semibold tracking-wider text-muted uppercase dark:text-muted-dark";

export default function Projects() {
  return (
    <>
      <PageMeta
        title="Projects"
        description="Research, industry and personal projects."
      />

      <h1 class="font-display text-3xl font-semibold tracking-tight">Projects</h1>

      <h2 class={`mt-10 ${eyebrow}`}>Research &amp; industry</h2>
      <ProjectCards projects={research} />

      <h2 class={`mt-14 ${eyebrow}`}>Personal</h2>
      <ProjectCards projects={personal} />

      <h2 class={`mt-14 ${eyebrow}`}>Also</h2>
      <ul class="not-prose mt-4 divide-y divide-rule dark:divide-rule-dark">
        <For each={other}>
          {(project) => (
            <li class="py-5">
              <h3 class="font-display text-lg font-medium tracking-tight">
                {project.title}
              </h3>
              <p class="mt-1.5 text-sm leading-relaxed text-muted dark:text-muted-dark">
                {project.blurb}
              </p>
            </li>
          )}
        </For>
      </ul>
    </>
  );
}
