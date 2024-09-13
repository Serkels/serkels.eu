"use client";

import { MarkAsRead } from ":components/button/MarkAsRead";
import { Loading_Placeholder } from ":components/placeholder/Loading_Placeholder";
import { TRPC_React } from ":trpc/client";
import type { RouterOutput } from "@1.infra/trpc";
import { ExchangeCompletedMessage } from "@1.modules/notification.ui/card/ExchangeCompletedMessage";
import { ExchangeNewMessage } from "@1.modules/notification.ui/card/ExchangeNewMessage";
import { ProfileAdded } from "@1.modules/notification.ui/card/ProfileAdded";
import { Button } from "@1.ui/react/button";
import type { InfiniteQueryObserverSuccessResult } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { P, match } from "ts-pattern";
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
  const session = useSession();
  if (!session.data) return null;
  const {
    data: { profile },
  } = session;
  return match(notification)
    .with({ type: "INBOX_NEW_MESSAGE" }, (notification) => (
      <InboxNewMessage notification={notification} />
    ))
    .with(
      {
        type: "EXCHANGE_COMPLETED",
        exchange_message: {
          exchange: P.nonNullable,
          message: P.nonNullable,
        },
      },
      (notification) => {
        const {
          id: notification_id,
          exchange_message: {
            exchange: { id: exchange_id },
          },
        } = notification;
        return (
          <MarkAsRead
            notification_id={notification_id}
            redirect_to={`/@~/history/?since=${exchange_id}`}
          >
            <ExchangeCompletedMessage
              notification={notification}
              profile={profile}
            />
          </MarkAsRead>
        );
      },
    )
    .with({ type: "EXCHANGE_NEW_PARTICIPANT" }, (notification) => (
      <ExchangeNewParticipant notification={notification} />
    ))
    .with(
      {
        type: "EXCHANGE_NEW_MESSAGE",
        exchange_message: {
          exchange: P.nonNullable,
          message: P.nonNullable,
        },
      },
      (notification) => (
        <ExchangeNewMessage notification={notification} profile={profile} />
      ),
    )
    .with({ type: "FORUM_NEW_AWNSER" }, (notification) => (
      <ForumNewAnswer notification={notification} />
    ))
    .with(
      { type: "PROFILE_ADDED", profile_added: { profile: P.nonNullable } },
      (notification) => {
        const {
          id: notification_id,
          profile_added: {
            profile: { id: profile_id },
          },
        } = notification;
        return (
          <MarkAsRead
            notification_id={notification_id}
            redirect_to={`/@${profile_id}`}
          >
            <ProfileAdded notification={notification} />
          </MarkAsRead>
        );
      },
    )
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
