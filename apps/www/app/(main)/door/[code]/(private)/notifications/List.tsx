"use client";

import { Loading_Placeholder } from ":components/placeholder/Loading_Placeholder";
import { TRPC_React } from ":trpc/client";
import type { RouterOutput } from "@1.infra/trpc";
import { Button } from "@1.ui/react/button";
import type { InfiniteQueryObserverSuccessResult } from "@tanstack/react-query";
import { P, match } from "ts-pattern";
import { ExchangeCompletedMessage } from "./ExchangeCompletedMessage";
import { ExchangeNewMessage } from "./ExchangeNewMessage";
import { ExchangeNewParticipant } from "./ExchangeNewParticipant";
import { ForumNewAnswer } from "./ForumNewAnswer";
import { InboxNewMessage } from "./InboxNewMessage";
import type { Notification } from "./type";

//

type FindNotification = RouterOutput["notification"]["find"];
export function AsyncListInfinite() {
  const query_info = TRPC_React.notification.find.useInfiniteQuery(
    {},
    {
      getPreviousPageParam: (d) => d.prevCursor,
      refetchInterval: 10_000,
    },
  );

  return match(query_info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => {
      return <Loading_Placeholder />;
    })
    .with({ status: "success" }, (success_info) => (
      <List query_info={success_info} />
    ))
    .exhaustive();
}

function List({
  query_info,
}: {
  query_info: InfiniteQueryObserverSuccessResult<FindNotification, unknown>;
}) {
  const { data, isFetchingPreviousPage, hasPreviousPage, fetchPreviousPage } =
    query_info;
  const flatten_pages = data.pages
    .map((page) => page.data)
    .reverse()
    .flat();

  return (
    <>
      <ul className="space-y-6">
        {flatten_pages.map((notification) => (
          <li key={notification.id}>
            <Card notification={notification} />
          </li>
        ))}
      </ul>
      {match({ isFetchingPreviousPage, hasPreviousPage })
        .with({ isFetchingPreviousPage: true }, () => <Loading_Placeholder />)
        .with({ hasPreviousPage: true }, () => (
          <LoadMore onClick={fetchPreviousPage} />
        ))
        .otherwise(() => null)}
    </>
  );
}

function Card({ notification }: { notification: Notification }) {
  return match(notification)
    .with({ type: "INBOX_NEW_MESSAGE" }, (notification) => (
      <InboxNewMessage notification={notification} />
    ))
    .with({ type: "EXCHANGE_COMPLETED" }, (notification) => (
      <ExchangeCompletedMessage notification={notification} />
    ))
    .with({ type: "EXCHANGE_NEW_PARTICIPANT" }, (notification) => (
      <ExchangeNewParticipant notification={notification} />
    ))
    .with({ type: "EXCHANGE_NEW_MESSAGE" }, (notification) => (
      <ExchangeNewMessage notification={notification} />
    ))
    .with({ type: "FORUM_NEW_AWNSER" }, (notification) => (
      <ForumNewAnswer notification={notification} />
    ))
    .otherwise(() => {
      console.error(`Unknown notification type ${notification.type}`);
      return null;
    });
}

function LoadMore({ onClick }: { onClick: () => void }) {
  return (
    <Button
      className="mx-auto my-6 block"
      state="ghost"
      intent="light"
      onPress={onClick}
    >
      Charger plus de notifications.
    </Button>
  );
}
