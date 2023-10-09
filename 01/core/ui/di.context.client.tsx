"use client";

import debug from "debug";
import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import {
  createChildContainer,
  root_container,
  type InjectionToken,
} from "../di";
import { type Registration } from "./register";

//

const log = debug("~:core:di.context");

//

export const ContainerContext = createContext(root_container);

export function DI_Container_Provider({
  children,
  name = DI_Container_Provider.name ?? "",
  registrations = [],
}: PropsWithChildren<{
  registrations?: Registration[];
  name?: string;
}>) {
  const parent = useContext(ContainerContext);

  const child_container = useMemo(() => {
    const container = createChildContainer(parent);
    log(`⏭️💉 |${name}| ${container.id.value()} (${parent.id.value()})`);
    for (const { token, options, ...provider } of registrations) {
      log(`⏺️ ${name}`, token, provider, options);
      container.register(token, provider as any, options);
    }
    return container;
  }, [parent.id, registrations]);

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

export function create_container_provider(
  registrationsFn: () => Registration[],
  name = DI_Container_Provider.name ?? "",
) {
  return function container_provider({ children }: PropsWithChildren) {
    const registrations = useMemo(registrationsFn, [registrationsFn]);
    return (
      <DI_Container_Provider name={name} registrations={registrations}>
        {children}
      </DI_Container_Provider>
    );
  };
}
