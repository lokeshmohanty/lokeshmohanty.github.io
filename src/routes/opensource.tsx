import PageMeta from "~/components/PageMeta";
import RepoCards from "~/components/RepoCards";
import { repos } from "~/lib/opensource";
import { site } from "~/lib/site";

export default function OpenSource() {
  return (
    <>
      <PageMeta
        title="Open source"
        description="Public repositories: an experiment manager, a mail client, a NixOS configuration, browser games and a Zola theme."
      />

      <h1 class="font-display text-3xl font-semibold tracking-tight">Open source</h1>

      <p class="mt-4 text-muted dark:text-muted-dark">
        Things I build in the open and keep using — tools, a mail client, the
        machine configuration everything else runs on. Each card links to the
        repository; the rest is on{" "}
        <a href={site.social.github} target="_blank" rel="noopener">
          GitHub
        </a>
        .
      </p>

      <RepoCards repos={repos} />
    </>
  );
}
