//

import { createContext } from ":api/trpc/[trpc]/route";
import { app_router as router } from "@1/strapi-trpc-router";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";

//

export async function get_trpc() {
  return createServerSideHelpers({
    router,
    ctx: (await createContext()) as any,
    transformer: SuperJSON,
  });
}
