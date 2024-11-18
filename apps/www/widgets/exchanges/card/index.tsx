"use client";

import { ReactMarkdown } from ":components/markdown";
import { AppToastOptions } from ":components/toast";
import { trpc_client } from "@1.infra/trpc/react-query/client";
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
import { PROFILE_ROLES, type Profile } from "@1.modules/profile.domain";
import { StudentAvatarMedia } from "@1.modules/profile.ui/avatar";
import { button } from "@1.ui/react/button/atom";
import { Exchange as ExchangeIcon, Pen } from "@1.ui/react/icons";
import { useTimeoutEffect } from "@react-hookz/web";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
  type MouseEventHandler,
  type PropsWithChildren,
} from "react";
import { toast } from "react-toastify";
import { P, match } from "ts-pattern";
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
}: PropsWithChildren<{
  exchange: Exchange;
  profile: Pick<Profile, "id" | "role"> | undefined;
}>) {
  return (
    <Provider
      exchange={exchange}
      is_yours={exchange.owner.profile.id === profile?.id}
      is_studient={profile && profile.role === PROFILE_ROLES.Enum.STUDENT}
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
  const utils = trpc_client.useUtils();
  const delete_exchange = trpc_client.exchanges.me.delete.useMutation();

  useTimeoutEffect(async () => {
    await delete_exchange.mutateAsync({ exchange_id });

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

  const { exchange_icon } = exchange_card({
    type: exchange.type,
  });
  return (
    <Card_Idle>
      <Card.Header.Left>
        <div className="flex h-full w-full justify-between gap-2">
          <Link href={`/@${exchange.owner.profile.id}`}>
            <StudentAvatarMedia
              className="h-full items-center"
              student={exchange.owner}
            />
          </Link>
          <div className="mr-2 flex items-end gap-2 md:hidden">
            {is_yours ? <Edit_Buttons /> : null}
          </div>
        </div>
      </Card.Header.Left>

      <Card.Header.Right>
        <div className="flex flex-col items-end ">
          {is_yours ? <Edit_Buttons /> : null}
          <div className="flex flex-row items-center gap-4">
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
        </div>
      </Card.Header.Right>

      <Card.Body>
        <div className="prose max-w-full">
          <ReactMarkdown components={{ h1: "h3", h2: "h3", h3: "h4" }}>
            {exchange.description}
          </ReactMarkdown>
        </div>
      </Card.Body>

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

export function Edit_Buttons() {
  return (
    <div className="flex gap-3 md:gap-1">
      <Exchange_Modify_Button />
      <Exchange_Delete_Button />
    </div>
  );
}

function Exchange_Modify_Button() {
  const exchange = useExchange();
  const [showWarning, setShowWarning] = useState(false);

  const alreadyPopulated = exchange.deals.length > 0;

  const on_edit_click = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (event) => {
      if (!alreadyPopulated) return;
      event.preventDefault();

      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 1_000 * 5);
    },
    [alreadyPopulated],
  );

  useEffect(() => {
    if (showWarning) {
      toast.info(
        "Les échanges comprenant déjà des participants ne peuvent pas être édités",
        AppToastOptions,
      );
    }
  }, [showWarning]);
  return (
    <>
      <Link
        className={button({
          intent: "light",
          size: "xs",
          state: "ghost",
          className: "box-content h-4 text-gray-500 md:h-7 md:p-2",
        })}
        href={alreadyPopulated ? "" : `/@~/exchanges/${exchange.id}/edit`}
        onClick={on_edit_click}
      >
        <Pen className="h-4 md:h-7" />
      </Link>
    </>
  );
}

export default Exchange_Modify_Button;
