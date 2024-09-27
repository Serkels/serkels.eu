//

import type { Router } from "@1.infra/trpc";
import { NEXTAUTH_TRPCENV } from "@douglasduteil/nextauth...trpc.prisma/config";
import { create_nextauth_header } from "@douglasduteil/nextauth...trpc.prisma/jwt";
import { createTRPCProxyClient, httpLink, loggerLink } from "@trpc/client";
import type { JWT } from "next-auth/jwt";
import SuperJSON from "superjson";
import { z } from "zod";

//

const ENV = z
  .object({ API_URL: z.string().url() })
  .merge(NEXTAUTH_TRPCENV)
  .parse(process.env);

//

export const trpc = createTRPCProxyClient<Router>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpLink({
      url: `${ENV.API_URL}/trpc`,
      headers: async () => {
        const nexaut_header = await create_nextauth_header({
          secret: ENV.NEXTAUTH_SECRET,
          token: {
            from: "@1.modules/auth.next.legacy",
            profile: { id: "SSR", image: "", name: "", role: "ADMIN", bio: "" },
          } satisfies JWT,
          maxAge: 60,
        });
        return nexaut_header;
      },
    }),
  ],
  transformer: SuperJSON,
});
