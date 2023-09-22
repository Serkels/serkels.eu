"use client";

import { useInject } from "~/core/react";
import { Exchange_InfiniteList } from "~/modules/exchange/Exchange_InfiniteList";
import { Get_Owned_Exchanges_UseCase } from "~/modules/exchange/application/get_owned_exchanges.use-case";

//

export function Owned_ExchangeList() {
  const info = useInject(Get_Owned_Exchanges_UseCase).execute({
    pagination: { pageSize: 12 },
    sort: ["createdAt:desc"],
  });

  return <Exchange_InfiniteList info={info} />;
}
