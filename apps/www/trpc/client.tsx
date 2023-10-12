"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { AppRouter } from "@toctocorg/api";
import { Context } from "@toctocorg/api/src/context";
import {
  TRPCClient,
  createTRPCReact,
  createWSClient,
  httpBatchLink,
  loggerLink,
  splitLink,
  wsLink,
} from "@trpc/react-query";
import { useEffect, useState, type PropsWithChildren } from "react";

//

export const TRPC_React = createTRPCReact<AppRouter, Context>({
  abortOnUnmount: true,
});

// function useTRPCWebSocketClient() {
//   const [webSocketClient, setTRPCWebSocketClient] = useState<CreateClient>();

//   useEffect(() => {
//     const client = createWSClient({
//       url: "ws://localhost:2022/socket",
//       onClose() {
//         console.log("onClose");
//       },
//       onOpen() {
//         console.log("onOpen");
//       },
//     });

//     setTRPCWebSocketClient(client);

//     return () => {
//       client.close();
//     };
//   }, []);

//   return webSocketClient;
// }

function useTRPCClient() {
  const [trpc_client, set_trpc_client] = useState<TRPCClient<any>>();

  useEffect(() => {
    const client = createWSClient({
      url: "ws://localhost:2022/socket",
      onClose() {
        console.log("onClose");
      },
      onOpen() {
        console.log("onOpen");
      },
    });

    const _trpc_client = TRPC_React.createClient({
      //     // transformer: SuperJSON,
      links: [
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === "development" &&
              typeof window !== "undefined") ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        // httpBatchLink({
        //   url: "http://localhost:2022",
        // }),
        splitLink({
          condition(op) {
            return op.type === "subscription";
          },
          true: wsLink({
            client,
          }),
          false: httpBatchLink({
            url: "http://localhost:2022",
          }),
        }),
      ],
    });

    //

    set_trpc_client(_trpc_client);

    return () => {
      client.close();
    };
  }, []);

  return trpc_client;
}
export function TrpcProvider({ children }: PropsWithChildren) {
  // const session = useSession();

  const query_client = useQueryClient();
  const trpc_client = useTRPCClient();

  // const ws_client = useMemo(() => {
  //   console.log("createWSClient");
  //   return createWSClient({
  //     url: "ws://localhost:2022/socket",
  //     onClose() {
  //       console.log("onClose");
  //     },
  //     onOpen() {
  //       console.log("onOpen");
  //     },
  //   });
  // }, []);
  // useEffect(() => {
  //   console.log({ ws_client });
  //   return function teardown() {
  //     console.log("createWSClient close");
  //     ws_client.close();
  //   };
  // }, [ws_client]);

  // const [trpc_client] = useState(() =>
  //   TRPC_React.createClient({
  //     // transformer: SuperJSON,
  //     links: [
  //       loggerLink({
  //         enabled: (opts) =>
  //           (process.env.NODE_ENV === "development" &&
  //             typeof window !== "undefined") ||
  //           (opts.direction === "down" && opts.result instanceof Error),
  //       }),
  //       // httpBatchLink({
  //       //   url: "http://localhost:2022",
  //       // }),
  //       splitLink({
  //         condition(op) {
  //           return op.type === "subscription";
  //         },
  //         true: wsLink({
  //           client: webSocket_client,
  //         }),
  //         false: httpBatchLink({
  //           url: "http://localhost:2022",
  //         }),
  //       }),
  //     ],
  //   }),
  // );

  if (!trpc_client) return;

  return (
    <TRPC_React.Provider client={trpc_client} queryClient={query_client}>
      {children}
    </TRPC_React.Provider>
  );
}
