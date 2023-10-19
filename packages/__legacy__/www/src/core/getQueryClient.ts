//

import { QueryClient, type DefaultOptions } from "@tanstack/react-query";
import { cache } from "react";

//

const options: DefaultOptions = {
  // from https://openapi-ts.pages.dev/openapi-fetch/examples/#further-optimization
  queries: {
    networkMode: "offlineFirst", // keep caches as long as possible
    refetchOnWindowFocus: false, // don’t refetch on window focus
  },
};

export const query_client = new QueryClient({
  defaultOptions: {
    ...options,
    queries: {
      ...options.queries,
      staleTime: Infinity,
    },
  },
});

export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: options,
    }),
);
