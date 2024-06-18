"use client";

import InfoBox from ":components/InfoBox";
import { TRPC_React } from ":trpc/client";
import type { Exchange } from "@1.modules/exchange.domain";
import { Card } from "@1.modules/exchange.ui/Card/Card";
import { Card_Deleting } from "@1.modules/exchange.ui/Card/Card_Deleting";
import { Card_Idle } from "@1.modules/exchange.ui/Card/Card_Idle";
import {
  Provider,
  useExchange,
  useExchangeMeta,
  useOutletState,
} from "@1.modules/exchange.ui/Card/context";
import { exchange_card } from "@1.modules/exchange.ui/Card/exchange_card";
import type { Profile } from "@1.modules/profile.domain";
import { StudentAvatarMedia } from "@1.modules/profile.ui/avatar";
import { button } from "@1.ui/react/button/atom";
import { Pen } from "@1.ui/react/icons";
import { useTimeoutEffect } from "@react-hookz/web";
import Link from "next/link";
import {
  useCallback,
  useState,
  type MouseEventHandler,
  type PropsWithChildren,
} from "react";
import { P, match } from "ts-pattern";
import { Exchange_Actions } from "./actions";
import { Exchange_Bookmark } from "./bookmark";
import { Exchange_Delete_Button } from "./delete.button";
import { Exchange_Share } from "./share";

import { Exchange as ExchangeIcon } from "@1.ui/react/icons";

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
  const alreadyPopulated = exchange.deals.length > 0;

  const { is_yours } = useExchangeMeta();

  const [showInfoBox, setShowInfoBox] = useState(false);

  const [, reset] = useTimeoutEffect(() => {
    setShowInfoBox(false);
  }, 1_000 * 5);

  const on_edit_click = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (event) => {
      if (!alreadyPopulated) return;
      event.preventDefault();
      reset();
      setShowInfoBox(true);
    },
    [alreadyPopulated],
  );
  const { exchange_icon } = exchange_card({
    type: exchange.type,
  });
  return (
    <Card_Idle>
      <Card.Header.Left>
        <Link href={`/@${exchange.owner.profile.id}`}>
          <StudentAvatarMedia
            className="h-full items-center"
            student={exchange.owner}
          />
        </Link>
      </Card.Header.Left>
      <Card.Header.Right>
        <div className="flex flex-row items-center gap-4">
          {is_yours ? (
            <>
              <Link
                className={button({
                  intent: "light",
                  size: "sm",
                  state: "ghost",
                  className: "box-content h-4 py-2",
                })}
                href={
                  alreadyPopulated ? "" : `/@~/exchanges/${exchange.id}/edit`
                }
                onClick={on_edit_click}
              >
                <Pen className="h-4" />
              </Link>
              {showInfoBox && (
                <InfoBox message="Les échanges comprenant déjà des participants ne peuvent pas être édités" />
              )}
              <Exchange_Delete_Button />
            </>
          ) : null}
          <div className="hidden items-center justify-between text-[#707070] md:flex">
            <span className="whitespace-nowrap font-bold uppercase">
              {exchange.category.name}
            </span>
            <ExchangeIcon
              className={exchange_icon({
                with_return: Boolean(exchange.return),
              })}
            />
            <span className="whitespace-nowrap font-bold uppercase">
              {match(exchange.return)
                .with(null, () => "Sans échange")
                .with(P._, (category) => category.name)
                .exhaustive()}
            </span>
          </div>
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
