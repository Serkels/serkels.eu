//

import {
  create_async_container_provider,
  create_container_provider,
} from "@1/core/ui/registry";
import type { PropsWithChildren } from "react";
import Nest from "react-nest";
import { Exchange_Repository } from "~/modules/exchange/Exchange_Repository";
import { get_api_session } from "../api/auth/[...nextauth]/route";
import { JWT_TOKEN } from "../api/v1/OpenAPI.repository";
import { Bar, Register_OpenAPI } from "./layout.client";

//

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <Nest>
      <Register_JWT />
      <Register_OpenAPI />
      <Register_EXCHANGE_ID />
      <Bar />
      {children}
    </Nest>
  );
}

//

const Register_JWT = create_async_container_provider(async () => {
  const seesion = await get_api_session();
  console.log("Register_JWT", { seesion });
  return [
    {
      token: JWT_TOKEN,
      useValue: seesion?.user?.jwt ?? "dodo",
    },
  ];
});

const Register_EXCHANGE_ID = create_container_provider(() => {
  return [
    {
      token: Exchange_Repository.EXCHANGE_ID_TOKEN,
      useValue: 666,
    },
  ];
});
