"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { type PropsWithChildren } from "react";

//

const queryClient = new QueryClient({
  // defaultOptions: { queries: { staleTime: ms("5s") } },
});

export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
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
