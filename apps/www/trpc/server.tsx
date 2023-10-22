//

import type { Router } from "@1.infra/trpc";
import { getServerSession } from "@1.modules/auth.next";
import type { Profile } from "@1.modules/profile.domain";
import { NEXTAUTH_TRPCENV } from "@douglasduteil/nextauth...trpc.prisma/config";
import type { JWT } from "@douglasduteil/nextauth...trpc.prisma/jwt";
import { create_nexauth_header } from "@douglasduteil/nextauth...trpc.prisma/jwt";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { createTRPCProxyClient, httpLink, loggerLink } from "@trpc/client";
import { createServerSideHelpers } from "@trpc/react-query/server";
import type { ComponentProps } from "react";
import SuperJSON from "superjson";

//

const proxyClient = createTRPCProxyClient<Router>({
  links: [
    loggerLink({
      enabled: (opts) =>
        (process.env.NODE_ENV === "development" &&
          typeof window !== "undefined") ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpLink({
      url: `${process.env["API_URL"]}/trpc`,
      headers: async ({}) => {
        const session = await getServerSession();
        const profile = session?.profile
          ? ({
              id: session.profile.id,
              name: "",
              image: "",
              role: session.profile.role,
              bio: "",
            } satisfies Profile)
          : undefined;

        const nexaut_header = await create_nexauth_header({
          secret: NEXTAUTH_TRPCENV.NEXTAUTH_SECRET,
          token: {
            from: "www",
            profile,
          } satisfies JWT,
        });
        return nexaut_header;
      },
    }),
  ],
  transformer: SuperJSON,
});

export const TRPC_SSR = createServerSideHelpers({
  client: proxyClient,
});

export function TRPC_Hydrate(props: ComponentProps<typeof Hydrate>) {
  const dehydratedState = dehydrate(TRPC_SSR.queryClient);
  return <Hydrate state={dehydratedState}>{props.children}</Hydrate>;
}
