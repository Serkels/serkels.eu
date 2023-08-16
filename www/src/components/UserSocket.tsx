//

"use client";
import { type PropsWithChildren } from "react";

export function UserSocker({ children }: PropsWithChildren) {
  // const s = useRef<Unsubscribable>();
  // useMount(() => {
  //   s.current = trpc.notifications.subscribe(undefined, {});
  // });

  // useUnmount(() => {
  //   if (!s.current) return;
  //   s.current.unsubscribe();
  // });

  return children;
  // const { data, isLoading } = trpc.lol.useQuery("1");
  // console.log({ trpc, data, isLoading });
  // const queryClient = useQueryClient();
  // const [trpcClient] = useState(() =>
  //   trpc.createClient({
  //     links: [
  //       httpBatchLink({
  //         url: "http://localhost:3000/trpc",
  //       }),
  //     ],
  //   }),
  // );

  // return (
  //   <trpc.Provider client={trpcClient} queryClient={queryClient}>
  //     {children}
  //   </trpc.Provider>
  // );
}

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { httpBatchLink, loggerLink , createWSClient} from "@trpc/client";
// import { createTRPCReact } from "@trpc/react-query";
// import { useState } from "react";
// import superjson from "superjson";
// import { createContext, useEffect, type PropsWithChildren } from "react";

// //

// const SocketDataContext = createContext({});

// export const trpc = createTRPCReact({
//   unstable_overrides: {
//     useMutation: {
//       async onSuccess(opts) {
//         await opts.originalFn();
//         await opts.queryClient.invalidateQueries();
//       },
//     },
//   },
// });
// const wsClient = createWSClient({
//   url: `ws://localhost:1337`,
// });

// export const trpc = createTRPCReact();
// console.log({ trpc });

// // const trpcClient = trpc.createClient({
// //   links: [
// //     wsLink({
// //       client: wsClient,
// //     }),
// //   ],
// // });
// export function UserSocker({ children }: PropsWithChildren) {
//   useEffect(() => {
//     console.log("UserSocker");
//   }, []);

//   return (
//     <SocketDataContext.Provider value={{}}>
//       {children}
//     </SocketDataContext.Provider>
//   );
// }
