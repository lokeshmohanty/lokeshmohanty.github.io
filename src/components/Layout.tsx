import { A, useLocation } from "@solidjs/router";
import { For, type JSX } from "solid-js";

import Prose from "~/components/Prose";
import ThemeToggle from "~/components/ThemeToggle";
import { site } from "~/lib/site";

function NavLink(props: { href: string; name: string }) {
  const location = useLocation();
  const active = () =>
    location.pathname === props.href || location.pathname.startsWith(`${props.href}/`);

  return (
    <A
      href={props.href}
      class="transition-colors hover:text-ink dark:hover:text-ink-dark"
      classList={{
        "text-ink dark:text-ink-dark font-medium": active(),
        "text-muted dark:text-muted-dark": !active(),
      }}
    >
      {props.name}
    </A>
  );
}

export default function Layout(props: { children: JSX.Element }) {
  return (
    <div class="flex min-h-screen flex-col">
      <header class="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-sm dark:border-rule-dark dark:bg-paper-dark/85">
        <div class="mx-auto flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4">
          <A href="/" class="font-serif text-lg font-semibold tracking-tight">
            {site.title}
          </A>
          <nav class="ml-auto flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
            <For each={site.nav}>{(item) => <NavLink href={item.href} name={item.name} />}</For>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main class="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        {/* MDX content pages get prose typography for free; list/search
            routes opt out with `not-prose` on their own containers. */}
        <Prose>{props.children}</Prose>
      </main>

      <footer class="border-t border-rule dark:border-rule-dark">
        <div class="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-2 px-6 py-8 text-sm text-muted dark:text-muted-dark">
          <p>
            © {new Date().getFullYear()} {site.author.name}
          </p>
          <div class="ml-auto flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href={site.social.github}
              target="_blank"
              rel="noopener"
              class="transition-colors hover:text-ink dark:hover:text-ink-dark"
            >
              GitHub
            </a>
            <a
              href={site.social.email}
              class="transition-colors hover:text-ink dark:hover:text-ink-dark"
            >
              Email
            </a>
            <A href="/search" class="transition-colors hover:text-ink dark:hover:text-ink-dark">
              Search
            </A>
            <a href="/rss.xml" class="transition-colors hover:text-ink dark:hover:text-ink-dark">
              RSS
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
