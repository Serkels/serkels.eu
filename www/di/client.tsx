"use client";

import {
  ContainerContext,
  create_container_provider,
  root_container,
} from "@1/next-tsyringe";
import { TRPC_REACT } from "@1/strapi-trpc-router";
import debug from "debug";

import type { PropsWithChildren } from "react";
import { Lifecycle } from "tsyringe";

//

const log = debug("~:di/client.tsx");

//

// @NextTsyringe.module({})
// export class RootModule {
//   static Provider = NextTsyringeProvider;
//   static register: RegistrationFn = async () => {
//     return [{ token: "foo", useToken: "bar" }];
//   };
// }
const AppContainer = create_container_provider(() => {
  return [
    { token: "foo", useValue: "bar" },
    {
      token: TRPC_REACT,
      useFactory: TRPC_REACT,
      options: { lifecycle: Lifecycle.ContainerScoped },
    },
  ];
});

export function NextTsyringeProvider({ children }: PropsWithChildren) {
  // log(`<NextTsyringeProvider> 🌱 ${root_container.id}`);
  // const foo = useInject("foo");
  // console.log({ foo });
  return (
    <ContainerContext.Provider value={root_container}>
      <AppContainer>{children}</AppContainer>
    </ContainerContext.Provider>
  );
}
