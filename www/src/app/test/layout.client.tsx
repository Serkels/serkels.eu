"use client";

import { Lifecycle } from "@1/core/di";
import { ContainerContext } from "@1/core/ui/di.context.client";
import { create_container_provider } from "@1/core/ui/registry";
import { useContext, useState, type PropsWithChildren } from "react";
import { useEffectOnce } from "react-use";
import { API_TOKEN, OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";
import { Deal_Repository } from "~/modules/exchange/Deal.repository";

//

export const Register_OpenAPI = create_container_provider(() => {
  return [
    {
      token: OpenAPI_Repository,
      useClass: OpenAPI_Repository,
      options: { lifecycle: Lifecycle.Singleton },
    },
    {
      token: API_TOKEN,
      useValue: {} as any,
    },
  ];
});

export function Bar({ children }: PropsWithChildren) {
  const container = useContext(ContainerContext);
  const [debug, set_debug] = useState({ container_id: "" });
  useEffectOnce(() => {
    set_debug({ container_id: container._id?.value() } as any);
  });
  try {
    console.log("Bar container", container._id?.value());

    // const id = container.resolve(Exchange_Repository.EXCHANGE_ID_TOKEN);
    // console.log("Bar id", id);
    const repository = container.resolve(Deal_Repository);
    console.log("Bar repository", repository);
    // return <code>/test Foo {id}</code>;
  } catch (error) {
    console.error(error);
    // return null;
  }
  return (
    <>
      {children}
      <br />
      <code>{JSON.stringify(debug, null, 2)}</code>
    </>
  );
}
