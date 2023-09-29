"use client";

import { createChildContainer, type InjectionToken } from "@1/core/di";
import { ContainerContext, useContainer } from "@1/core/ui/di.context.client";
import debug from "debug";
import { useMemo, type PropsWithChildren } from "react";

//

const log = debug("~:core:react:client");

//

//
//
//

/**
 *
 * @deprecated ${@link DI_Container_Provider}
 */
export function Hydrate_Container_Provider({
  children,
  registerAll: initialFn,
}: PropsWithChildren<{
  registerAll: { registerInstance?: [InjectionToken, any] }[];
}>) {
  const parent = useContainer();
  const container = useMemo(() => {
    log("🌲");

    const child = createChildContainer(parent);
    // for (const args of initialFn) {
    //   if (Array.isArray(args.registerInstance)) {
    //     log(...args.registerInstance);
    //     child.registerInstance(...args.registerInstance);
    //   }
    // }
    return child;
  }, [parent, initialFn]);

  return (
    <ContainerContext.Provider value={container}>
      {children}
    </ContainerContext.Provider>
  );
}
