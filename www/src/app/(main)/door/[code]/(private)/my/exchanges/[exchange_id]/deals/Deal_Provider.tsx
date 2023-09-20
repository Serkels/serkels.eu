"use client";

//

import { Exchange_ItemSchemaToDomain } from "@1/modules/exchange/infra/strapi";
import type { PropsWithChildren } from "react";
import { P, match } from "ts-pattern";
import { useInject } from "~/core/react";
import { useExchange_item_controller } from "~/modules/exchange";
import { Get_Deal_ById_UseCase } from "~/modules/exchange/application/get_deal_byid.use-case";
import { Exchange_ValueProvider } from "../../Exchange.context";
import { Deal_ValueProvider } from "./Deal.context";

//

export function Deal_Provider({
  children,
  id,
}: PropsWithChildren<{ id: number }>) {
  const query_info = useInject(Get_Deal_ById_UseCase).execute(id);

  return match(query_info)
    .with({ status: "error", error: P.select() }, (error) => {
      console.error(error);
      return null;
    })
    .with({ status: "loading" }, () => {
      return null;
    })
    .with({ status: "success", data: P.select() }, (data) => (
      <Deal_ValueProvider initialValue={data}>{children}</Deal_ValueProvider>
    ))
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
