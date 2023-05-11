//

import type { DehydratedState, QueryClient } from "@tanstack/react-query";

//

export type PageContext = {
  pageProps: Record<string, unknown>;
  is404: boolean;
  dehydratedState: DehydratedState;
  queryClient: QueryClient;
};
