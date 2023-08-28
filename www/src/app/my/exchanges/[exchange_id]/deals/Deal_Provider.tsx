"use client";

//

import { Exchange_DealSchemaToDomain } from "@1/modules/deal/infra/strapi/DealSchema.mapper";
import { useSession } from "next-auth/react";
import type { PropsWithChildren } from "react";
import { match } from "ts-pattern";
import { fromClient } from "~/app/api/v1";
import { Exchange_Item_Controller } from "~/modules/exchange/Item.controller";
import { Exchange_Repository } from "~/modules/exchange/infrastructure";
import { Deal_ValueProvider } from "./Deal.context";

//

export function Deal_Provider({
  children,
  id,
}: PropsWithChildren<{ id: number }>) {
  const { data: session } = useSession();
  const repository = new Exchange_Repository(fromClient, session?.user?.jwt);
  const {
    deal: { useQuery },
  } = new Exchange_Item_Controller(repository);

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
  // return (
  //   <Deal_ValueProvider initialValue={deal}>{children}</Deal_ValueProvider>
  // );
  // return (<Deal_ValueProvider>value) = {} >
  //   <>/Deal_ValueProvider>);
}
