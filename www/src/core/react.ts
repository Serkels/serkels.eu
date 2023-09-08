//

import { createContext, useContext } from "react";
import "reflect-metadata";
import {
  container,
  type DependencyContainer,
  type InjectionToken,
} from "tsyringe";

//

export const ContainerContext = createContext<DependencyContainer>(container);

export const useContainer = () => {
  return useContext(ContainerContext);
};
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
