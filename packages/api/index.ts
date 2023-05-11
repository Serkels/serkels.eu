//

import { createTRPCProxyClient, httpLink } from "@trpc/client";
import createClient from "openapi-fetch";
import SuperJSON from "superjson";

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { opportunitiesRouter } from "./router/opportunities";
import { createTRPCRouter } from "./trpc";
import type { paths } from "./v1";

//

export const appRouter = createTRPCRouter({
  opportunities: opportunitiesRouter,
});
export const edgeHandler = (baseUrl: string) => (request: any) =>
  fetchRequestHandler({
    endpoint: baseUrl,
    router: appRouter,
    req: request,
    createContext() {
      return { session: null, strapi_api: "" };
    },
  });
export const createApiClient = (baseUrl: string) =>
  createTRPCProxyClient<AppRouter>({
    links: [
      httpLink({
        url: baseUrl,
      }),
    ],
    transformer: SuperJSON,
  });
export type AppRouter = typeof appRouter;

//

export const fetcher = createClient<paths>;
