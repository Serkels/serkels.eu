//

import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";
import { appRouter } from "..";
import { handlers } from "../mocks/index.mjs";

//

export function given_a_mocked_server() {
  const proxyServer = setupServer(...handlers);
  const { server, listen } = createHTTPServer({
    router: appRouter,
    createContext() {
      return { session: null, strapi_api: "http://__/api" };
    },
  });
  const { port } = listen(0);

  beforeAll(() => proxyServer.listen());
  afterEach(() => proxyServer.resetHandlers());
  afterAll(() => {
    proxyServer.close();
    server.close();
  });

  return { baseUrl: "http://localhost:" + port };
}

export type Ctx = {
  server: ReturnType<typeof setupServer>;
};

//
