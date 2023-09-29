"use client";

import { ContainerContext } from "@1/core/ui/di.context.client";
import { register } from "@1/core/ui/register";
import { useContext, type PropsWithChildren } from "react";
import { Exchange_Repository } from "~/modules/exchange/Exchange_Repository";

export function Foo({ children }: PropsWithChildren) {
  const parent = useContext(ContainerContext);
  const container = register([
    { token: Exchange_Repository.EXCHANGE_ID_TOKEN, useValue: 957 },
  ], parent);

  return (
    <div className="border border-rose-900">
      <code className="opacity-50">
        src/app/test/foo/[slug]/layout.client.tsx
      </code>
      <ContainerContext.Provider value={container}>
        {children}
      </ContainerContext.Provider>
    </div>
  );
}
