//

import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Children,
  Fragment,
  StrictMode,
  cloneElement,
  isValidElement,
  type PropsWithChildren,
} from "react";
import type { PageContextBuiltIn } from "vite-plugin-ssr/types";
import type { PageContext } from "./PageContext";

//

export function createPageApp(
  pageContext: Partial<PageContextBuiltIn> & PageContext
) {
  const { Page, pageProps, dehydratedState, queryClient } = pageContext;

  const App = () => {
    return (
      <>
        <Page {...pageProps} />
        <ReactQueryDevtools />
      </>
    );
  };

  return (
    <StrictMode>
      <Nest>
        <QueryClientProvider client={queryClient} />
        <Hydrate state={dehydratedState} />
        <App />
      </Nest>
    </StrictMode>
  );
}

// from https://github.com/reaktivo/react-nest/blob/8bd1b885a9c1d2fc9fcd2a0c7c0c96a0a7063ea1/src/index.tsx

function Nest(props: PropsWithChildren) {
  return (
    <Fragment>
      {Children.toArray(props.children)
        .reverse()
        .reduce((child, parent) => {
          return isValidElement(parent)
            ? cloneElement(parent, parent.props, child)
            : child;
        }, <Fragment />)}
    </Fragment>
  );
}
