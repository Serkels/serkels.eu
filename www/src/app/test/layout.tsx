//

import { register, type Registrations } from "@1/core/ui/register";
import {
  create_async_container_provider,
  create_container_provider,
} from "@1/core/ui/registry";
import type { PropsWithChildren } from "react";
import Nest from "react-nest";
import { container, type DependencyContainer } from "tsyringe";
import { Exchange_Repository } from "~/modules/exchange/Exchange_Repository";
import { get_api_session } from "../api/auth/[...nextauth]/route";
import { JWT_TOKEN } from "../api/v1/OpenAPI.repository";
import { Bar, Register_OpenAPI } from "./layout.client";

//

// @$1.registrations(async ({ params }: { params: Record<string, string> }) => {
//   const seesion = await Promise.resolve("doudu");
//   console.log({ params });
//   return [
//     {
//       token: JWT_TOKEN,
//       useValue: seesion,
//     },
//   ];
// })
// @$1.context_injection(class {})
class Layout_Module {
  static async Layout({ children }: PropsWithChildren) {
    return <>{children}</>;
  }
}
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

const registerrr = async () => {
  const seesion = await get_api_session();

  return [
    {
      token: JWT_TOKEN,
      useValue: seesion?.user?.jwt ?? "dodo",
    },
  ];
};

async function sub_injector(
  registrationsFn: () => Promise<Registrations>,
  parent: DependencyContainer,
) {
  // const child_container = parent.createChildContainer();
  const registrations = await registrationsFn();
  const child_container = register(registrations, parent);
  return child_container;
}
const i = sub_injector(registerrr, container);

const Register_JWT = create_async_container_provider(registerrr);

const Register_EXCHANGE_ID = create_container_provider(() => {
  return [
    {
      token: Exchange_Repository.EXCHANGE_ID_TOKEN,
      useValue: 666,
    },
  ];
});
