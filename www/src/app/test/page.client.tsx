"use client";

import {
  ContainerContext,
  DI_Container_Provider,
} from "@1/core/ui/di.context.client";
import { useContext } from "react";
import { Deal_Repository } from "~/modules/exchange/Deal.repository";
import { Exchange_Repository } from "~/modules/exchange/Exchange_Repository";
import { API_TOKEN, JWT_TOKEN } from "../api/v1/OpenAPI.repository";

//

function Foo() {
  try {
    const container = useContext(ContainerContext);
    // console.log("Foo container", container._id?.value(), container);
    const id = container.resolve(Exchange_Repository.EXCHANGE_ID_TOKEN);
    // console.log("Foo id", id);
    const jwt = container.resolve(JWT_TOKEN);
    // console.log("Foo jwt", jwt);

    const repository = container.resolve(Deal_Repository);
    console.log("Foo repository", repository);

    return <>{JSON.stringify({ id, jwt }, null, 2)}</>;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//

//

export function Page_Foo() {
  //
  // const root = useContext(ContainerContext);
  // root.registerInstance(Exchange_Repository.EXCHANGE_ID_TOKEN, 1293);
  // root.registerInstance(API_TOKEN, {} as any);
  // root.registerInstance(JWT_TOKEN, "");

  //

  // return (
  //   <>
  //     <Foo />
  //     <Bar />
  //   </>
  // );
  return (
    <DI_Container_Provider
      registrations={[
        { token: Exchange_Repository.EXCHANGE_ID_TOKEN, useValue: 222 },
        { token: API_TOKEN, useValue: {} as any },
        { token: JWT_TOKEN, useValue: "token 111" },
      ]}
    >
      <Foo />
    </DI_Container_Provider>
  );
}
