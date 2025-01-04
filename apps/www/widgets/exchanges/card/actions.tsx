//

import { trpc_client } from "@1.infra/trpc/react-query/client";
import { useSession } from "@1.modules/auth.next/react";
import { Exchange_TypeSchema, type Exchange } from "@1.modules/exchange.domain";
import { Exchange_Ask_Modal } from "@1.modules/exchange.ui/ask/modal";
import {
  useExchange,
  useExchangeMeta,
} from "@1.modules/exchange.ui/Card/context";
import { Button } from "@1.ui/react/button";
import { Spinner } from "@1.ui/react/spinner";
import Link from "next/link";
import { P, match } from "ts-pattern";
import { Ask } from "./ask";
import { LoginDialog } from "./login";

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
  const { is_studient } = useExchangeMeta();
  const query = trpc_client.exchanges.me.deal_by_exchange_id.useQuery(
    exchange.id,
    { enabled: is_studient },
  );
  if (!is_studient)
    return (
      <LoginDialog>
        <Exchange_Ask_Modal.Trigger>
          <Button_FirstExchange exchange={exchange} />
        </Exchange_Ask_Modal.Trigger>
      </LoginDialog>
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
          <Button_FirstExchange exchange={exchange} />
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

//

function Button_FirstExchange({ exchange }: { exchange: Exchange }) {
  const { is_studient } = useExchangeMeta();
  return match(exchange)
    .with(
      { return_id: P.nullish, type: Exchange_TypeSchema.Enum.PROPOSAL },
      () => <Button isDisabled={!is_studient}>Demander</Button>,
    )
    .with(
      { return_id: P.nullish, type: Exchange_TypeSchema.Enum.RESEARCH },
      () => <Button isDisabled={!is_studient}>Répondre</Button>,
    )
    .otherwise(() => (
      <Button intent="warning" isDisabled={!is_studient}>
        Échanger
      </Button>
    ));
}
