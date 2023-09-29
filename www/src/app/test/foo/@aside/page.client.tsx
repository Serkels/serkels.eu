"use client";

import { ContainerContext } from "@1/core/ui/di.context.client";
import { useContext } from "react";
import { JWT_TOKEN } from "~/app/api/v1/OpenAPI.repository";
import { Deal_Repository } from "~/modules/exchange/Deal.repository";
import { Exchange_Repository } from "~/modules/exchange/Exchange_Repository";

//

function Foo() {
  try {
    const container = useContext(ContainerContext);
    const id = container.resolve(Exchange_Repository.EXCHANGE_ID_TOKEN);
    console.log("Foo id", id);

    const repository = container.resolve(Deal_Repository);
    console.log("Foo repository", repository);

    return <>/test/foo Foo {id}</>;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//

function Bar() {
  try {
    const container = useContext(ContainerContext);
    const id = container.resolve(JWT_TOKEN);
    console.log("Bar id", id);

    const repository = container.resolve(Deal_Repository);
    console.log("Bar repository", repository);

    return <>/test/foo Bar {id}</>;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//

export function Page_Foo() {
  //
  return (
    <div className="border border-y-teal-950">
      <h1 className="opacity-50">src/app/test/foo/@aside/page.client.tsx</h1>
      <Foo />
      <Bar />
    </div>
  );
}
