import { A, useParams } from "@solidjs/router";

import PageMeta from "~/components/PageMeta";
import PostList from "~/components/PostList";
import { allTags, posts, tagSlug } from "~/lib/content";

export default function TagPage() {
  const params = useParams();

  // Match on the slug so /tags/machine-learning resolves "Machine Learning".
  const label = () => allTags().find((t) => t.slug === params.tag)?.tag ?? params.tag;
  const matching = () => posts.filter((p) => p.tags.some((t) => tagSlug(t) === params.tag));

  return (
    <>
      <PageMeta title={`#${label()}`} description={`Posts tagged ${label()}.`} />

      <header class="not-prose mb-8">
        <A
          href="/tags"
          class="text-sm text-muted transition-colors hover:text-accent dark:text-muted-dark dark:hover:text-accent-dark"
        >
          ← All tags
        </A>
        <h1 class="mt-2 font-display text-3xl font-semibold tracking-tight">#{label()}</h1>
      </header>

      <PostList posts={matching()} empty="No posts with this tag." />
    </>
  );
}
