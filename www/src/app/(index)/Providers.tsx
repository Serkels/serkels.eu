"use client";

import { UserSocker } from "@/components/UserSocket";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { useState, type PropsWithChildren } from "react";

//

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <UserSocker>{children}</UserSocker>
      </SessionProvider>

      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
  // return (
  //   <Nest>
  //     <QueryClientProvider client={client} />
  //     <ReactQueryDevtools initialIsOpen={false} />
  //   </Nest>
  // );
}
