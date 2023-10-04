"use client";

import type { AppRouter } from ":api/trpc/[trpc]/route";
import { fromServer } from ":api/v1";
import { OpenAPI_Repository } from "@1/core_";
import {
  DefaultProvider,
  NextTsyringe,
  root_container,
} from "@1/next-tsyringe";
import { createTRPCReact } from "@trpc/react-query";
import debug from "debug";
import { cache } from "react";

//

export const trpc = createTRPCReact<AppRouter>();
//

@NextTsyringe.module({
  root_container: cache(() => {
    ClientRoot_Module.log(`🌱💉 ${root_container.id}`);
    return root_container;
  })(),
})
export class ClientRoot_Module {
  static log = debug("~:trpc/client.ts");
  static Provider = DefaultProvider;
  static async register() {
    console.log("ClientRoot_Module register !!!!!!!!!!!!!!");
    return [
      {
        token: OpenAPI_Repository.TOKEN.CLIENT,
        useValue: fromServer,
      },
    ];
  }
}
