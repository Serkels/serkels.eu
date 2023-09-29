"use client";

import { DI_Container_Provider } from "@1/core/ui/di.context.client";

import { type PropsWithChildren } from "react";
import { Lifecycle } from "tsyringe";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";

export function Foo({ children }: PropsWithChildren) {
  return (
    <DI_Container_Provider
      registrations={[
        {
          token: OpenAPI_Repository,
          useClass: OpenAPI_Repository,
          options: { lifecycle: Lifecycle.Singleton },
        },
      ]}
    >
      {children}
    </DI_Container_Provider>
  );
}
