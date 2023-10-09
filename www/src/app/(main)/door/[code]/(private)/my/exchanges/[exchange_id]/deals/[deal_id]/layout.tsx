///

import type { PropsWithChildren } from "react";
import { Deal_Route_Provider } from "../layout.client";

//

export default function Layout({
  children,
  params,
}: PropsWithChildren<{ params: { deal_id: string } }>) {
  const deal_id = Number(params.deal_id);
  console.log();
  console.log(
    "src/app/(main)/door/[code]/(private)/my/exchanges/[exchange_id]/deals/[deal_id]/layout.tsx",
  );
  console.log({ deal_id });
  console.log();
  return (
    <Deal_Route_Provider initialValue={{ deal_id }}>
      {children}
    </Deal_Route_Provider>
  );
}
