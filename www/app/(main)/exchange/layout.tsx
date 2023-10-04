//

import { NextTsyringe } from "@1/next-tsyringe";
import { Root_Module } from "app/Root_Module";
import debug from "debug";
import { type PropsWithChildren } from "react";

//

@NextTsyringe.module({
  parent: Root_Module,
})
export class Exchange_LayoutModule {
  static log = debug("~:app/(index)/(main)/exchange/layout.tsx");
  static Provider = Root_Module.Provider;
  static async register() {
    console.log("Exchange_LayoutModule register");
    return [];
  }
}

export default async function Layout({
  children,
  filter,
  see_also,
}: PropsWithChildren<{ filter: React.ReactNode; see_also: React.ReactNode }>) {
  const injector = await NextTsyringe.injector(Exchange_LayoutModule);
  Exchange_LayoutModule.log(`${injector.id}`);
  return (
    <Exchange_LayoutModule.Provider>
      {filter}
      {children}
      {see_also}
    </Exchange_LayoutModule.Provider>
  );
}
