//

import { ID, USER_PROFILE_ID_TOKEN, type UID } from "@1/core/domain";
import { useInject } from "@1/next-tsyringe";
import { Button } from "@1/ui/components/ButtonV";
import * as UI from "@1/ui/domains/exchange/Card";
import { OnlineOrLocation } from "@1/ui/domains/exchange/OnlineOrLocation";
import { Exchange as ExchangeIcon } from "@1/ui/icons";
import clsx from "clsx";
import Link from "next/link";
import ContentLoader from "react-content-loader";
import { P, match } from "ts-pattern";
import { AvatarMediaHorizontal } from "~/components/Avatar";
import { BookmarkButton } from "~/components/BookmarkButton";
import {
  Exchange_ValueProvider,
  useExchange_Value,
} from "~/modules/exchange/Exchange.context";
import { Get_Exchange_ById_UseCase } from "~/modules/exchange/application/get_exchange_byid.use-case";
import { Ask_Action } from "./Ask_Action";
import { trpc } from ":trpc/client";
//

export function ExchangeCard({ id }: { id: UID }) {
  const query_info = trpc.exchange.all.useInfiniteQuery(
    {
      pagination: { pageSize: 1 },
    },
    {
      getNextPageParam,
      getPreviousPageParam,
    },
  );

  return match(query_info)
    .with({ status: "error" }, ({ error }) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loader />)
    .with({ status: "success", data: P.select() }, (exchange) => (
      <Exchange_ValueProvider initialValue={exchange}>
       {JSON.stringify({ exchange }, null, 2)}
      </Exchange_ValueProvider>
    ))
    .exhaustive();
}
