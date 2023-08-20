//

import { createContext, useContext } from "react";
import type { RepositoryPort } from "./repository";

//

export interface CoreContext {
  repositories: WeakMap<Class, RepositoryPort>;
}

export const context = createContext<CoreContext>({
  repositories: new WeakMap(),
});

export const CoreProvider = context.Provider;

export function useCoreContext() {
  const core_context = useContext(context);
  if (!core_context) {
    throw new Error("useCoreContext must be used within a CoreProvider");
  }
  return core_context;
}

//

type Class = {
  new (...args: any[]): any;
};
