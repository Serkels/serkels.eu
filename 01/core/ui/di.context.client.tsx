"use client";

import debug from "debug";
import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import { Id, type UID } from "rich-domain";
import { container, type DependencyContainer } from "../di";
import { register, type Registrations } from "./register";

//

const log = debug("~:core:di.context");

//

export const ContainerContext = createContext<
  DependencyContainer & { _id?: UID }
>(container);

export function DI_Container_Provider({
  children,
  registrations = [],
}: PropsWithChildren<{
  registrations?: Registrations;
}>) {
  const parent = useContext(ContainerContext);
  const parent_id = parent._id?.value() ?? "root";
  console.log("DI_Container_Provider", { registrations });
  const child_container = useMemo(() => {
    const child = register(registrations, parent) as DependencyContainer & {
      _id?: UID;
    };
    child._id = Id();

    log(`💉 ${child._id.value()} (${parent_id})`);

    return child;
  }, [parent_id, registrations]);

  return (
    <ContainerContext.Provider value={child_container}>
      {children}
    </ContainerContext.Provider>
  );
}
