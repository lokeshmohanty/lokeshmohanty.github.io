import { A } from "@solidjs/router";
import { For, Show } from "solid-js";

import type { Repo } from "~/lib/opensource";

/**
 * Leaves-the-site marker. Drawn rather than typed: U+2197 has emoji
 * presentation in the fallback stack here and rendered as a blue glyph box
 * beside the repo name.
 */
function ExternalArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="ml-1 inline-block h-[0.72em] w-[0.72em] shrink-0 opacity-60"
    >
      <path d="M5.5 10.5 10.5 5.5" />
      <path d="M6 5.5h4.5V10" />
    </svg>
  );
}

/**
 * The repository grid on `/opensource`.
 *
 * Shaped like `ProjectCards` — same border, radius, eyebrow and tag row — but a
 * card here can carry more than one destination (the repo, a live demo, a
 * project page), so it cannot be one big `<A>`: nesting those anchors is
 * invalid HTML. The repo name is the link and a stretched `::after` makes the
 * whole card its hit area; the secondary links sit in a `relative` footer so
 * they stack above that overlay and stay clickable.
 *
 * These are cross-origin URLs, so `Router` leaves them alone — no `external`
 * rel needed, unlike a same-origin file link.
 */
export default function RepoCards(props: { repos: readonly Repo[] }) {
  return (
    <ul class="not-prose mt-4 grid gap-6 sm:grid-cols-2">
      <For each={props.repos}>
        {(repo) => (
          <li class="group relative flex h-full flex-col rounded-2xl border border-rule p-5 transition-colors hover:border-accent dark:border-rule-dark dark:hover:border-accent-dark">
            <p class="font-mono text-xs tracking-wider text-muted uppercase dark:text-muted-dark">
              {repo.language}
              <Show when={repo.license}>
                {(license) => <span> · {license()}</span>}
              </Show>
            </p>
            <h3 class="mt-2 font-display text-xl font-semibold tracking-tight group-hover:text-accent dark:group-hover:text-accent-dark">
              <a
                href={repo.repo}
                target="_blank"
                rel="noopener"
                class="after:absolute after:inset-0 after:content-['']"
              >
                {repo.name}
                <ExternalArrow />
              </a>
            </h3>
            <p class="mt-1 text-sm text-muted dark:text-muted-dark">{repo.tagline}</p>
            <p class="mt-3 text-sm leading-relaxed">{repo.blurb}</p>

            <ul class="mt-auto flex flex-wrap gap-2 pt-4">
              <For each={repo.tags}>
                {(tag) => (
                  <li class="rounded-full border border-rule px-2.5 py-0.5 font-mono text-xs text-muted dark:border-rule-dark dark:text-muted-dark">
                    {tag}
                  </li>
                )}
              </For>
            </ul>

            <Show when={repo.demo || repo.project}>
              <p class="relative mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <Show when={repo.demo}>
                  {(demo) => (
                    <a
                      href={demo()}
                      target="_blank"
                      rel="noopener"
                      class="text-accent hover:underline dark:text-accent-dark"
                    >
                      Live demo
                      <ExternalArrow />
                    </a>
                  )}
                </Show>
                <Show when={repo.project}>
                  {(project) => (
                    <A
                      href={project()}
                      class="text-accent hover:underline dark:text-accent-dark"
                    >
                      Write-up
                    </A>
                  )}
                </Show>
              </p>
            </Show>
          </li>
        )}
      </For>
    </ul>
  );
}
