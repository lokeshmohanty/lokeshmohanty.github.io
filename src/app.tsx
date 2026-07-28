import { MetaProvider, Meta, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { MDXProvider } from "solid-mdx";

import Layout from "~/components/Layout";
import { mdxComponents } from "~/components/mdx";
import { site } from "~/lib/site";

import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>{site.title}</Title>
          <Meta name="description" content={site.description} />
          <Meta name="author" content={site.author.name} />
          <link rel="alternate" type="application/rss+xml" title={site.title} href="/rss.xml" />
          <MDXProvider components={mdxComponents}>
            <Layout>
              <Suspense>{props.children}</Suspense>
            </Layout>
          </MDXProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
