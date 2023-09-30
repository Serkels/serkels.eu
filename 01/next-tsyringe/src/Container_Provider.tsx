"use client";

import debug from "debug";
import { useContext, useMemo, type PropsWithChildren } from "react";
import { ContainerContext } from "./context";
import type { Registration } from "./dependency-container";

//

const log = debug("~:core:di.context");

//

export function Container_Provider({
  children,
  name = Container_Provider.name ?? "",
  registrations = [],
}: PropsWithChildren<{
  registrations?: Registration[];
  name?: string;
}>) {
  const parent = useContext(ContainerContext);

  const child_container = useMemo(() => {
    const container = parent.createNamedChildContainer(name);
    log(`⏭️💉 ${name} ${container.id} (${parent.id})`);
    container.registerAll(registrations);
    return container;
  }, [parent.id, registrations]);

  return (
    <ContainerContext.Provider value={child_container}>
      {children}
    </ContainerContext.Provider>
  );
}

export function create_container_provider(
  registrationsFn: () => Registration[],
  name = Container_Provider.name ?? "",
) {
  return function container_provider({ children }: PropsWithChildren) {
    const registrations = useMemo(registrationsFn, [registrationsFn]);
    return (
      <Container_Provider name={name} registrations={registrations}>
        {children}
      </Container_Provider>
    );
  };
}
