"use client";

import { Spinner } from "@1/ui/components/Spinner";
import { P, match } from "ts-pattern";
import { Exchange_InfiniteList } from "~/app/(main)/exchange/ExchangeList";
import { useInject } from "~/core/react";
import { Get_Owned_Exchanges_UseCase } from "~/modules/exchange/application/get_owned_exchanges.use-case";

//

export function Owned_ExchangeList() {
  const info = useInject(Get_Owned_Exchanges_UseCase).execute({
    pageSize: 12,
  });

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "success" }, () => <Exchange_InfiniteList info={info} />)
    .exhaustive();
}

function Loading() {
  return (
    <figure className="mt-28 min-h-screen text-center">
      <Spinner />
    </figure>
  );
}
