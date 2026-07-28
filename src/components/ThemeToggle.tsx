import { createSignal, onMount } from "solid-js";

export default function ThemeToggle() {
  const [dark, setDark] = createSignal(false);

  onMount(() => setDark(document.documentElement.classList.contains("dark")));

  const toggle = () => {
    const next = !dark();
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* private mode — fall back to per-session theming */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle colour theme"
      title="Toggle colour theme"
      class="rounded-md p-2 text-muted transition-colors hover:bg-rule/50 hover:text-ink dark:text-muted-dark dark:hover:bg-rule-dark/50 dark:hover:text-ink-dark"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        {dark() ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </>
        ) : (
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        )}
      </svg>
    </button>
  );
}
