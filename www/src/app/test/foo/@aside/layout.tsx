//

import { DI_Container_Provider } from "@1/core/ui/di.context.client";
import type { PropsWithChildren } from "react";
import { Exchange_Repository } from "~/modules/exchange/Exchange_Repository";

//

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <DI_Container_Provider
      registrations={[
        { token: Exchange_Repository.EXCHANGE_ID_TOKEN, useValue: 654 },
      ]}
    >
      {children}
    </DI_Container_Provider>
  );
}
