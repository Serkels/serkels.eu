import { OpenAPI_Repository } from "@1/core_";
import {
  DefaultProvider,
  NextTsyringe,
  root_container,
} from "@1/next-tsyringe";
import debug from "debug";
import { cache } from "react";
import { fromServer } from "./api/v1";

//

const log = debug("~:app:Root_Module");

//

@NextTsyringe.module({
  root_container: cache(() => {
    log(`🌱💉 ${root_container.id}`);
    return root_container;
  })(),
  scope: "server-only",
})
export class Root_Module {
  static log = debug("~:app/Root_Module.tsx");
  static Provider = DefaultProvider;
  static async register() {
    console.log("Root_Module register !!!!!!!!!!!!!!");
    return [
      {
        token: OpenAPI_Repository.TOKEN.CLIENT,
        useValue: fromServer,
      },
    ];
  }
}
