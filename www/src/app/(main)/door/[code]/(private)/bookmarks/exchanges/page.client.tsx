"use client";

import { useInject } from "@1/core/ui/di.context.client";
import { Get_Exchange_Bookmarks_UseCase } from "~/modules/bookmarks/application/get_exchange_bookmarks.use-case";
import { Exchange_InfiniteList } from "~/modules/exchange/Exchange_InfiniteList";

//

export function Bookmark_ExchangeList() {
  const info = useInject(Get_Exchange_Bookmarks_UseCase).execute({
    pageSize: 12,
  });

  return <Exchange_InfiniteList info={info} />;
}
