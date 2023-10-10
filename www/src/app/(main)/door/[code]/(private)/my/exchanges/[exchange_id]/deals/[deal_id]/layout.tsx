///

import type { PropsWithChildren } from "react";
import { Deal_Route_Provider } from "../layout.client";

//

export default function Layout({
  children,
  params,
}: PropsWithChildren<{ params: { deal_id: string } }>) {
  const deal_id = Number(params.deal_id);

  return (
    <Deal_Route_Provider initialValue={{ deal_id }}>
      {children}
    </Deal_Route_Provider>
  );
}
