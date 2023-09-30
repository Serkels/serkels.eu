//

import { useMemo, type PropsWithChildren } from "react";
import { DI_Container_Provider } from "./di.context.client";
import type { Registrations } from "./register";

//

export function create_async_container_provider(
  registrationsFn: () => Promise<Registrations>,
) {
  return async function container_provider({ children }: PropsWithChildren) {
    const registrations = await registrationsFn();
    return (
      <DI_Container_Provider registrations={registrations}>
        {children}
      </DI_Container_Provider>
    );
  };
}

export function create_container_provider(
  registrationsFn: () => Registrations,
) {
  return function container_provider({ children }: PropsWithChildren) {
    const registrations = useMemo(registrationsFn, [registrationsFn]);
    return (
      <DI_Container_Provider registrations={registrations}>
        {children}
      </DI_Container_Provider>
    );
  };
}
