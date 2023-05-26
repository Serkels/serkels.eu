//

import type { DehydratedState, QueryClient } from "@tanstack/react-query";

//

export type PageContext = {
  csrfToken: string;
  dehydratedState: DehydratedState;
  is404: boolean;
  pageProps: Record<string, unknown>;
  queryClient: QueryClient;
  cookies: Map<string, string>;
};
