import { A } from "@solidjs/router";

import PageMeta from "~/components/PageMeta";

export default function NotFound() {
  return (
    <div class="not-prose py-12 text-center">
      <PageMeta title="Page not found" />
      <p class="font-mono text-sm text-muted dark:text-muted-dark">404</p>
      <h1 class="mt-3 font-serif text-3xl font-semibold tracking-tight">Page not found</h1>
      <p class="mt-3 text-muted dark:text-muted-dark">
        That page doesn't exist — it may have moved when this site was rebuilt.
      </p>
      <A
        href="/"
        class="mt-6 inline-block text-accent hover:underline dark:text-accent-dark"
      >
        ← Back home
      </A>
    </div>
  );
}
