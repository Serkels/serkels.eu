"use client";

import { Id } from "@1/core/domain";
import { useInject } from "@1/core/ui/di.context.client";
import type { PropsWithChildren } from "react";
import { P, match } from "ts-pattern";
import {
  Exchange_ValueProvider,
  useExchange_Value,
} from "~/modules/exchange/Exchange.context";
import { Get_Deal_ById_UseCase } from "~/modules/exchange/application/get_deal_byid.use-case";
import { Get_Exchange_ById_UseCase } from "~/modules/exchange/application/get_exchange_byid.use-case";
import { Deal_ValueProvider } from "./Deal.context";

//

export function Deal_Provider({
  children,
  id,
}: PropsWithChildren<{ id: number }>) {
  const [exchange] = useExchange_Value();
  const exchange_id = Number(exchange.id.value());

  const deal_id = id;

  const query_info = useInject(Get_Deal_ById_UseCase).execute(
    exchange_id,
    deal_id,
  );

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
  const query_info = useInject(Get_Exchange_ById_UseCase).execute(Id(id));

  return match(query_info)
    .with({ status: "error" }, () => {
      console.error(query_info.error);
      return null;
    })
    .with({ status: "loading" }, () => {
      return null;
    })
    .with({ status: "success", data: P.select() }, (exchange) => {
      return (
        <Exchange_ValueProvider initialValue={exchange}>
          {children}
        </Exchange_ValueProvider>
      );
    })
    .exhaustive();
}
