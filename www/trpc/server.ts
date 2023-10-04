//

import { app_router, createContext } from ":api/trpc/[trpc]/route";
import { fromServer } from ":api/v1";
import { OpenAPI_Repository } from "@1/core_";
import {
  DefaultProvider,
  NextTsyringe,
  root_container,
} from "@1/next-tsyringe";
import { createServerSideHelpers } from "@trpc/react-query/server";
import debug from "debug";
import { cache } from "react";
import SuperJSON from "superjson";

//

export async function get_trpc() {
  return createServerSideHelpers({
    router: app_router,
    ctx: await createContext(),
    transformer: SuperJSON,
  });
}

@NextTsyringe.module({
  root_container: cache(() => {
    ServerRoot_Module.log(`🌱💉 ${root_container.id}`);
    return root_container;
  })(),
  scope: "server-only",
})
export class ServerRoot_Module {
  static log = debug("~:trpc/server.ts");
  static Provider = DefaultProvider;
  static async register() {
    console.log("ServerRoot_Module register !!!!!!!!!!!!!!");
    return [
      {
        token: OpenAPI_Repository.TOKEN.CLIENT,
        useValue: fromServer,
      },
      {
        token: OpenAPI_Repository.TOKEN.CLIENT,
        useValue: fromServer,
      },
    ];
  }
}
