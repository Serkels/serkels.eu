//

import { app_router, createContext } from ":api/trpc/[trpc]/route";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";

//

export async function get_trpc() {
  return createServerSideHelpers({
    router: app_router,
    ctx: await createContext(),
    transformer: SuperJSON,
  });
}
