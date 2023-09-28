"use client";

import debug from "debug";
import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import {
  container,
  type DependencyContainer,
  type InjectionToken,
} from "~/core/di";

//

const log = debug("~:core:react:client");

//

export const ContainerContext = createContext<DependencyContainer>(container);

export const useContainer = () => {
  return useContext(ContainerContext);
};

//
//
//

export function Hydrate_Container_Provider({
  children,
  registerAll: initialFn,
}: PropsWithChildren<{
  registerAll: { registerInstance?: [InjectionToken, any] }[];
}>) {
  const parent = useContainer();
  const container = useMemo(() => {
    log("🌲");

    const child = parent.createChildContainer();
    for (const args of initialFn) {
      if (Array.isArray(args.registerInstance)) {
        log(...args.registerInstance);
        child.registerInstance(...args.registerInstance);
      }
    }
    return child;
  }, [parent, initialFn]);

  return (
    <ContainerContext.Provider value={container}>
      {children}
    </ContainerContext.Provider>
  );
}

export const useInject = <T extends unknown>(token: InjectionToken<T>) => {
  const container = useContainer();
  return container.resolve(token) as T;
};
