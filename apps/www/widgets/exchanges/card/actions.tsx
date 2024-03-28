//

import { TRPC_React } from ":trpc/client";
import type { Exchange } from "@1.modules/exchange.domain";
import { useExchange } from "@1.modules/exchange.ui/Card/context";
import { Button } from "@1.ui/react/button";
import { Spinner } from "@1.ui/react/spinner";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { match, P } from "ts-pattern";
import { Ask } from "./ask";

//

export function Exchange_Actions() {
  const exchange = useExchange();
  const { data: session } = useSession();
  const my_profile_id = session?.profile.id ?? "";

  return match(exchange.owner.profile.id)
    .with(my_profile_id, () => (
      <Link href={`/@~/exchanges/inbox/${exchange.id}`}>
        <Button>Voir mes échanges</Button>
      </Link>
    ))
    .otherwise(() => <Exchange_Action_Ask {...exchange} />);
}

function Exchange_Action_Ask(exchange: Exchange) {
  const query = TRPC_React.exchanges.me.deal_by_exchange_id.useQuery(
    exchange.id,
  );
  return match(query)
    .with({ status: "error", error: P.select() }, (error) => {
      console.error(error);
      return null;
    })
    .with({ status: "loading" }, () => <Spinner className="size-4" />)
    .with({ status: "success", data: P.nullish }, () => (
      <Ask exchange={exchange}>
        <Ask.Trigger>
          {exchange.return ? (
            <Button intent="warning">Échanger</Button>
          ) : (
            <Button>Demander</Button>
          )}
        </Ask.Trigger>
      </Ask>
    ))
    .with({ status: "success", data: P.select() }, function (deal) {
      const thread_id = deal?.exchange_threads.at(0)?.thread_id ?? "";
      return (
        <Link href={`/@~/exchanges/inbox/${exchange.id}/${thread_id}`}>
          <Button intent={exchange.return ? "warning" : "primary"}>
            Voir l'échange
          </Button>
        </Link>
      );
    })
    .exhaustive();
}
