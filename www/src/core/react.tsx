//

import debug from "debug";
import { type PropsWithChildren } from "react";
import { childInjector, type InjectionToken } from "~/core/di";
import { Hydrate_Container_Provider, useContainer } from "./react.client";

//

//

//

const log = debug("~:core:react");

export async function Container_Provider({
  children,
  registerAll,
}: PropsWithChildren<{
  registerAll: { registerInstance?: [InjectionToken<unknown>, unknown] }[];
}>) {
  childInjector(async (container) => {
    log("🌲");
    for (const args of registerAll) {
      if (Array.isArray(args.registerInstance)) {
        log(...args.registerInstance);
        container.registerInstance(...args.registerInstance);
      }
    }
  });

  return (
    <Hydrate_Container_Provider registerAll={registerAll}>
      {children}
    </Hydrate_Container_Provider>
  );
}

export const useInject = <T extends unknown>(token: InjectionToken<T>) => {
  const container = useContainer();
  return container.resolve(token) as T;
};

// export interface CoreContext {
//   container
//   repositories: WeakMap<Class, RepositoryPort>;

//   inject: () => {

//   }
// }

// export const context = createContext<CoreContext>({
//   repositories: new WeakMap(),
//   container: container
// });

// export const CoreProvider = context.Provider;

// export function useCoreContext() {
//   const core_context = useContext(context);
//   if (!core_context) {
//     throw new Error("useCoreContext must be used within a CoreProvider");
//   }
//   return core_context;
// }

// //

// type Class = {
//   new (...args: any[]): any;
// };
