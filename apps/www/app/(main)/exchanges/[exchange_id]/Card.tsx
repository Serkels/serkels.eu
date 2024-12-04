"use client";

import { Loading_Placeholder } from ":components/placeholder/Loading_Placeholder";
import type { Params } from ":pipes/exchange_by_id";
import { Exchange_Card } from ":widgets/exchanges/card";
import { trpc_client } from "@1.infra/trpc/react-query/client";
import { useSession } from "@1.modules/auth.next/react";
import { notFound } from "next/navigation";
import { match, P } from "ts-pattern";

//

export function Card({ exchange_id }: Params) {
  const { data: session } = useSession();
  const { data: exchange, status } =
    trpc_client.exchanges.by_id.useQuery(exchange_id);

  return match({ exchange, status })
    .with({ status: "error" }, () => notFound())
    .with(
      {
        exchange: P.select("exchange", P.nonNullable),
      },
      ({ exchange }) => (
        <Exchange_Card exchange={exchange} profile={session?.profile} />
      ),
    )
    .otherwise(() => <Loading_Placeholder />);
}
