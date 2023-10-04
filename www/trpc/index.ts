//

import type { AppRouter } from ":api/trpc/[trpc]/route";
import { createTRPCReact } from "@trpc/react-query";

// function getBaseUrl() {
//   if (typeof window !== "undefined")
//     // browser should use relative path
//     return "";

//   if (process.env["VERCEL_URL"])
//     // reference for vercel.com
//     return `https://${process.env["VERCEL_URL"]}`;

//   // assume localhost
//   return `http://localhost:${process.env["PORT"] ?? 3000}`;
// }

export const trpc = createTRPCReact<AppRouter>();

/*
export const trpc = createTRPCNext<AppRouter>({
  config(opts) {
    const { ctx } = opts;
    if (typeof window !== "undefined") {
      // during client requests
      return {
        transformer: SuperJSON,

        links: [
          httpBatchLink({
            url: "/api/trpc",
          }),
        ],
      };
    }

    return {
      transformer: SuperJSON,
      links: [
        httpBatchLink({
          // The server needs to know your app's full url
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            if (!ctx?.req?.headers) {
              return {};
            }
            // To use SSR properly, you need to forward client headers to the server
            // This is so you can pass through things like cookies when we're server-side rendering
            return {
              cookie: ctx.req.headers.cookie,
            };
          },
        }),
      ],
    };
  },
  ssr: true,
});
*/
