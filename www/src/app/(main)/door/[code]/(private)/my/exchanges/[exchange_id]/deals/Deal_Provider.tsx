"use client";

//

import { Exchange_DealSchemaToDomain } from "@1/modules/deal/infra/strapi";
import { Exchange_ItemSchemaToDomain } from "@1/modules/exchange/infra/strapi";
import { useSession } from "next-auth/react";
import type { PropsWithChildren } from "react";
import { match } from "ts-pattern";
import { fromClient } from "~/app/api/v1";
import { useExchange_item_controller } from "~/modules/exchange";
import { Deal_Controller } from "~/modules/exchange/Deal.controller";
import { Deal_Repository } from "~/modules/exchange/Deal.repository";
import { Exchange_ValueProvider } from "../../Exchange.context";
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

export function Exchange_Provider({
  children,
  id,
}: PropsWithChildren<{ id: number }>) {
  const {
    item: { useQuery },
  } = useExchange_item_controller(id);

  const query_info = useQuery();

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
      const exchange = new Exchange_ItemSchemaToDomain().build(data);
      if (exchange.isFail()) {
        console.error(exchange.error());
        return null;
      }
      return (
        <Exchange_ValueProvider initialValue={exchange.value()}>
          {children}
        </Exchange_ValueProvider>
      );
    })
    .exhaustive();
}
