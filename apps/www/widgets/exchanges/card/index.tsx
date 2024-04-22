"use client";

import { TRPC_React } from ":trpc/client";
import type { Exchange } from "@1.modules/exchange.domain";
import { Card } from "@1.modules/exchange.ui/Card/Card";
import { Card_Deleting } from "@1.modules/exchange.ui/Card/Card_Deleting";
import { Card_Idle } from "@1.modules/exchange.ui/Card/Card_Idle";
import { Exchange_Date } from "@1.modules/exchange.ui/Card/Date";
import {
  Provider,
  useExchange,
  useExchangeMeta,
  useOutletState,
} from "@1.modules/exchange.ui/Card/context";
import type { Profile } from "@1.modules/profile.domain";
import { StudientAvatarMedia } from "@1.modules/profile.ui/avatar";
import { button } from "@1.ui/react/button/atom";
import { Pen } from "@1.ui/react/icons";
import { useTimeoutEffect } from "@react-hookz/web";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { match } from "ts-pattern";
import { Exchange_Actions } from "./actions";
import { Exchange_Bookmark } from "./bookmark";
import { Exchange_Delete_Button } from "./delete.button";
import { Exchange_Share } from "./share";

//

// TODO(douglasduteil): remove hard links on widgets
// TODO(douglasduteil): remove next connection

//

export function Exchange_Card({
  exchange,
  profile,
  children,
}: PropsWithChildren<{ exchange: Exchange; profile: Pick<Profile, "id"> }>) {
  return (
    <Provider
      exchange={exchange}
      is_yours={exchange.owner.profile.id === profile.id}
    >
      <Card_Outlet>{children}</Card_Outlet>
    </Provider>
  );
}

function Card_Outlet({ children }: PropsWithChildren) {
  const [outlet] = useOutletState();

  return match(outlet)
    .with({ state: "deleting" }, () => <Deleting>{children}</Deleting>)
    .otherwise(() => <Idle />);
}

//

function Deleting({ children }: PropsWithChildren) {
  const { id: exchange_id } = useExchange();
  const utils = TRPC_React.useUtils();
  const delete_exchange = TRPC_React.exchanges.me.delete.useMutation();

  useTimeoutEffect(async () => {
    await delete_exchange.mutateAsync(exchange_id);

    await Promise.all([
      utils.exchanges.by_id.invalidate(exchange_id),
      utils.exchanges.find.invalidate(),
    ]);
  }, 1_111);

  return <Card_Deleting>{children}</Card_Deleting>;
}

function Idle() {
  const exchange = useExchange();
  const { is_yours } = useExchangeMeta();

  return (
    <Card_Idle>
      <Card.Header.Left>
        <Link href={`/@${exchange.owner.profile.id}`}>
          <StudientAvatarMedia studient={exchange.owner} />
        </Link>
      </Card.Header.Left>
      <Card.Header.Right>
        <div className=" flex flex-row items-center space-x-2">
          {is_yours ? (
            <>
              <Link
                className={button({
                  intent: "light",
                  size: "sm",
                  state: "ghost",
                  className: "box-content h-4 py-2",
                })}
                // className="h-4 text-Dove_Gray hover:text-Dove_Gray/50"
                href={`/@~/exchanges/${exchange.id}/edit`}
              >
                <Pen className="h-4" />
              </Link>
              <Exchange_Delete_Button />
            </>
          ) : null}
          <Exchange_Date />
        </div>
      </Card.Header.Right>
      <Card.Footer.Left>
        <Exchange_Bookmark />
      </Card.Footer.Left>
      <Card.Footer.Center>
        <Exchange_Actions />
      </Card.Footer.Center>
      <Card.Footer.Right>
        <Exchange_Share />
      </Card.Footer.Right>
    </Card_Idle>
  );
}
