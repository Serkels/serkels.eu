"use client";

import { Loading_Placeholder } from ":components/placeholder/Loading_Placeholder";
import type { Params } from ":pipes/exchange_by_id";
import { TRPC_React } from ":trpc/client";
import { Exchange_Card } from ":widgets/exchanges/card";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import { match, P } from "ts-pattern";

//

export function Card({ exchange_id }: Params) {
  const { data: session } = useSession();
  const { data: exchange, status } =
    TRPC_React.exchanges.by_id.useQuery(exchange_id);
  console.log({ session, exchange, status });
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
