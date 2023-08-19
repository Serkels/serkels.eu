//

import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        // from https://openapi-ts.pages.dev/openapi-fetch/examples/#further-optimization
        queries: {
          networkMode: "offlineFirst", // keep caches as long as possible
          refetchOnWindowFocus: false, // don’t refetch on window focus
        },
      },
    }),
);
