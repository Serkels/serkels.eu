//

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { router } from "..";
import { context } from "../context";

//

const handler = (req: Request) =>
  fetchRequestHandler({
    router,
    req,
    endpoint: "/api/trpc",
    createContext: () => context,
    onError({ error }) {
      if (error.code === "INTERNAL_SERVER_ERROR") {
        // send to bug reporting
        console.error("Something went wrong", error);
      }
    },
  });

export const handlers = { GET: handler, POST: handler };
