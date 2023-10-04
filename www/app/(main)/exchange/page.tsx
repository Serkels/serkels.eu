//

import { NextTsyringe } from "@1/next-tsyringe";
import { Root_Module } from "app/Root_Module";
import debug from "debug";

//

@NextTsyringe.module({
  parent: Root_Module,
})
export class Exchange_PageModule {
  static log = debug("~:app/(index)/(main)/exchange/page.tsx");
  static Provider = Root_Module.Provider;
  static async register() {
    console.log("Exchange_Module register");
    return [];
  }
}

export default async function Page() {
  const injector = NextTsyringe.injector(Exchange_PageModule);
  Exchange_PageModule.log(`${injector.id}`);
  return <Exchange_PageModule.Provider>exchange</Exchange_PageModule.Provider>;
}
