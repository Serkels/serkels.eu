"use client";

//

import { Exchange_DealSchemaToDomain } from "@1/modules/deal/infra/strapi/DealSchema.mapper";
import { useSession } from "next-auth/react";
import type { PropsWithChildren } from "react";
import { match } from "ts-pattern";
import { fromClient } from "~/app/api/v1";
import { Deal_Controller } from "~/modules/exchange/Deal.controller";
import { Deal_Repository } from "~/modules/exchange/Deal.repository";
import { Deal_ValueProvider } from "./Deal.context";

//

export function Deal_Provider({
  children,
  id,
}: PropsWithChildren<{ id: number }>) {
  const { data: session } = useSession();
  const repository = new Deal_Repository(fromClient, session?.user?.jwt);
  const {
    by_id: { useQuery },
  } = new Deal_Controller(repository);

  const query_info = useQuery(id);

  return match(query_info.status)
    .with("error", () => {
      console.error(query_info.error);
      return null;
    })
    .with("loading", () => {
      return null;
    })
    .with("success", () => {
      const { data } = query_info;
      if (!data) return null;
      const deal = new Exchange_DealSchemaToDomain().build(data);
      if (deal.isFail()) {
        console.error(deal.error());
        return null;
      }
      return (
        <Deal_ValueProvider initialValue={deal.value()}>
          {children}
        </Deal_ValueProvider>
      );
    })
    .exhaustive();
}
