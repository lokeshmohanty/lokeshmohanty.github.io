import type { JSX } from "solid-js";

/** Shared typographic container for all MDX-rendered content. */
export default function Prose(props: { children: JSX.Element; class?: string }) {
  return (
    <div
      class={`prose prose-neutral max-w-none dark:prose-invert
        prose-headings:font-display prose-headings:tracking-tight
        prose-a:text-accent prose-a:no-underline hover:prose-a:underline
        prose-a:underline-offset-4 dark:prose-a:text-accent-dark
        prose-code:before:content-none prose-code:after:content-none
        prose-img:rounded-lg ${props.class ?? ""}`}
    >
      {props.children}
    </div>
  );
}
