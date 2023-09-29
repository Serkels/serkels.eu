//

import { DI_Container_Provider } from "@1/core/ui/di.context.client";
import type { PropsWithChildren } from "react";
import Nest from "react-nest";
import { API_TOKEN, JWT_TOKEN } from "~/app/api/v1/OpenAPI.repository";
import { Exchange_Repository } from "~/modules/exchange/Exchange_Repository";
import { Foo } from "./layout.client";

//

export default async function Layout({
  children,
  aside,
}: PropsWithChildren<{ aside: React.ReactNode }>) {
  return (
    <Nest>
      <DI_Container_Provider
        registrations={[
          { token: Exchange_Repository.EXCHANGE_ID_TOKEN, useValue: 321 },
          { token: API_TOKEN, useValue: {} as any },
          { token: JWT_TOKEN, useValue: "JWT TEST FOO" },
        ]}
      />
      <Foo />
      <_layout />
    </Nest>
  );

  function _layout() {
    return (
      <>
        {children}
        {aside}
      </>
    );
  }
}
