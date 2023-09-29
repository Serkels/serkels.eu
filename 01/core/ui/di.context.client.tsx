"use client";

import debug from "debug";
import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import { root_container, type InjectionToken } from "../di";
import { register_branch, type Registrations } from "./register";

//

const log = debug("~:core:di.context");

//

export const ContainerContext = createContext(root_container);

export function DI_Container_Provider({
  children,
  registrations = [],
}: PropsWithChildren<{
  registrations?: Registrations;
}>) {
  const parent = useContext(ContainerContext);

  const child_container = useMemo(() => {
    const container = register_branch(registrations, parent);
    log("⏭️💉", container.id.value());
    return container;
  }, [parent.id.value(), registrations]);

  return (
    <ContainerContext.Provider value={child_container}>
      {children}
    </ContainerContext.Provider>
  );
}
export const useContainer = () => {
  return useContext(ContainerContext);
};
export const useInject = <T extends unknown>(token: InjectionToken<T>) => {
  const container = useContainer();
  return container.resolve(token) as T;
};
