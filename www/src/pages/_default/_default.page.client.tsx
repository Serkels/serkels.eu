//

import { QueryClient } from "@tanstack/react-query";
import ms from "ms";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import type { PageContextBuiltInClientWithClientRouting } from "vite-plugin-ssr/types";
import { createPageApp } from "./createPageApp";
import type { PageContext } from "./PageContext";

//

import "virtual:uno.css";

//

type Context = PageContextBuiltInClientWithClientRouting & PageContext;

const queryClientPageClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: ms("10 min"),
      staleTime: ms("30 s"),
      retryDelay: ms("2 s"),
    },
  },
});

//

let root: Root;
let dehydratedState: unknown;

//

export async function render(pageContext: Context) {
  pageContext.queryClient = queryClientPageClient;
  if (!dehydratedState && pageContext.dehydratedState) {
    dehydratedState = pageContext.dehydratedState;
  }
  const ReactRootComponent = createPageApp(pageContext);

  const container = document.getElementById("page-view")!;
  if (pageContext.isHydration) {
    root = hydrateRoot(container, ReactRootComponent);
  } else {
    if (!root) {
      root = createRoot(container);
    }
    root.render(ReactRootComponent);
  }
}
