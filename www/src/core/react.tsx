//

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

//

//

const log = debug("~/core/react");

//

//

//

export const ContainerContext = createContext<DependencyContainer>(container);

export const useContainer = () => {
  return useContext(ContainerContext);
};

export function Container_Provider<T>({
  children,
  initialFn,
}: PropsWithChildren<{
  initialFn: { registerInstance: [InjectionToken<T>, T] }[];
}>) {
  const parent = useContainer();
  const container = useMemo(() => {
    const child = parent.createChildContainer();
    log("🌲");
    for (const args of initialFn) {
      child.registerInstance(...args.registerInstance);
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
