"use client";

import { Id } from "@1/core/domain";
import type { PropsWithChildren } from "react";
import { P, match } from "ts-pattern";
import { useInject } from "~/core/react.client";
import { Exchange_ValueProvider } from "~/modules/exchange/Exchange.context";
import { Get_Deal_ById_UseCase } from "~/modules/exchange/application/get_deal_byid.use-case";
import { Get_Exchange_ById_UseCase } from "~/modules/exchange/application/get_exchange_byid.use-case";
import { ROUTE_EXCHANGE_ID_TOKEN } from "../register";
import { Deal_ValueProvider } from "./Deal.context";

//

export function Deal_Provider({
  children,
  id,
}: PropsWithChildren<{ id: number }>) {
  const exchange_id = useInject(ROUTE_EXCHANGE_ID_TOKEN);

  console.log(
    "src/app/(main)/door/[code]/(private)/my/exchanges/[exchange_id]/deals/Deal_Provider.tsx",
    { exchange_id },
  );
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
