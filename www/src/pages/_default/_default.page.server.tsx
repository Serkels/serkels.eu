//

import { QueryClient, dehydrate } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import { dangerouslySkipEscape, escapeInject } from "vite-plugin-ssr/server";
import type { PageContextBuiltInClientWithServerRouting } from "vite-plugin-ssr/types";
import type { PageContext } from "./PageContext";
import { createPageApp } from "./createPageApp";

//

type Context = PageContextBuiltInClientWithServerRouting & PageContext;

const queryClientPageServer = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0, // cacheTime value need to be 0 here if you want to use prerendering
      staleTime: Infinity,
      retryDelay: 2_000,
    },
  },
});

//

export const passToClient: Array<keyof Context> = [
  "pageProps",
  "urlPathname",
  "dehydratedState",
];

export async function render(pageContext: Context) {
  await prefetchPageQueries(pageContext.exports["prefetchQueries"]);
  pageContext.queryClient = queryClientPageServer;
  pageContext.dehydratedState = dehydrate(queryClientPageServer);

  const ReactRootComponent = createPageApp(pageContext);

  const body = pageContext.Page ? await renderToString(ReactRootComponent) : "";
  const title = pageContext.exports["title"]
    ? String(pageContext.exports["title"]) + " / "
    : "";
  const description = pageContext.exports["description"]
    ? String(pageContext.exports["description"])
    : "";
  const faviconUrl = import.meta.env.BASE_URL + "favicon.svg";

  return documentTemplate({ body, title, description, faviconUrl });
}

//

function documentTemplate(
  props: Record<"title" | "description" | "faviconUrl" | "body", string>
) {
  const { title, description, faviconUrl, body } = props;
  return escapeInject`
  <!DOCTYPE html>
  <html lang="en">
    <head>

      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">

      <title>${title}Toc-Toc</title>
      <meta name="description" content="${description}" />
      <link rel="icon" href="${faviconUrl}">

    </head>
    <body un-m="0" un-font="sans">

    <div id="page-view">${dangerouslySkipEscape(body)}</div>

    </body>
  </html>
`;
}

async function prefetchPageQueries(
  prefetchQueries: Array<Parameters<QueryClient["prefetchQuery"]>> | unknown
) {
  if (!Array.isArray(prefetchQueries)) return;
  console.log("⚡ PreFetching ⚡", prefetchQueries);
  await Promise.all(
    prefetchQueries.map(([queryKey, queryFn, options]) => {
      return queryClientPageServer.prefetchQuery(queryKey, queryFn, options);
    })
  );
}
