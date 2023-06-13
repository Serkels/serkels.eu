"use client";

//

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ms from "ms";
import { SessionProvider } from "next-auth/react";
import { useState, type PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren) {
  const [client] = useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: ms("5s") } } })
  );
  return (
    <QueryClientProvider client={client}>
      <SessionProvider>{children}</SessionProvider>

      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
  // return (
  //   <Nest>
  //     <QueryClientProvider client={client} />
  //     <ReactQueryDevtools initialIsOpen={false} />

  //     <App />
  //   </Nest>
  // );
}
