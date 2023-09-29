///

import type { PropsWithChildren } from "react";
import Nest from "react-nest";
import { Hydrate_Container_Provider } from "~/core/react.client";
import { Deal_Message_Repository } from "~/modules/exchange/Deal_Message.repository";
import { Deal_Route_Provider } from "../layout.client";

//

export default function Layout({
  children,
  params,
}: PropsWithChildren<{ params: { deal_id: string } }>) {
  const deal_id = Number(params.deal_id);

  return (
    <Nest>
      <Hydrate_Container_Provider
        registerAll={[
          {
            registerInstance: [Deal_Message_Repository.DEAL_ID_TOKEN, deal_id],
          },
        ]}
      />
      <Deal_Route_Provider initialValue={{ deal_id }} />
      {children}
    </Nest>
  );
}
