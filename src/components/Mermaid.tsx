import { createSignal, onCleanup, onMount, Show } from "solid-js";

let counter = 0;

/**
 * Renders a mermaid diagram on the client. During prerender this emits the raw
 * source inside a <pre>, which is replaced once mermaid loads in the browser.
 */
export default function Mermaid(props: { chart: string }) {
  const [svg, setSvg] = createSignal<string>("");
  const [failed, setFailed] = createSignal(false);
  const id = `mermaid-${++counter}`;

  onMount(() => {
    let disposed = false;

    const render = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        const dark = document.documentElement.classList.contains("dark");

        mermaid.initialize({
          startOnLoad: false,
          theme: dark ? "dark" : "neutral",
          securityLevel: "strict",
          fontFamily: "inherit",
        });

        const { svg: out } = await mermaid.render(`${id}-${dark ? "d" : "l"}`, props.chart);
        if (!disposed) setSvg(out);
      } catch (err) {
        console.error("[mermaid] failed to render diagram", err);
        if (!disposed) setFailed(true);
      }
    };

    void render();

    // Re-render with matching colours when the theme is toggled.
    const observer = new MutationObserver(() => void render());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    onCleanup(() => {
      disposed = true;
      observer.disconnect();
    });
  });

  return (
    <Show
      when={svg() && !failed()}
      fallback={
        <pre class="overflow-x-auto rounded-lg border border-rule p-4 text-sm dark:border-rule-dark">
          <code>{props.chart}</code>
        </pre>
      }
    >
      <figure class="my-6 overflow-x-auto text-center" innerHTML={svg()} />
    </Show>
  );
}
