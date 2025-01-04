"use client";

import { trpc_client } from "@1.infra/trpc/react-query/client";
import { useSession } from "@1.modules/auth.next/react";
import { NotificationGroup } from "@1.modules/notification.domain";
import { DotIndicator } from "@1.modules/notification.ui/DotIndicator";
import { badge } from "@1.ui/react/badge/atom";
import { useAsync, useUpdateEffect } from "@react-hookz/web";

//

export function Notification_DotIndicator() {
  const { status } = useSession();
  const utils = trpc_client.useUtils();
  const { data: count_unread } = trpc_client.notification.count_unread.useQuery(
    {},
    {
      enabled: status === "authenticated",
      refetchInterval: 1_000 * 30,
    },
  );

  const [, { execute }] = useAsync(() =>
    Promise.all([
      utils.notification.count_unread.invalidate({
        type: NotificationGroup.Enum.EXCHANGE,
      }),
      utils.notification.count_unread.invalidate({
        type: NotificationGroup.Enum.INBOX,
      }),
    ]),
  );

  useUpdateEffect(() => {
    execute();
  }, [count_unread]);

  if (!count_unread) return null;
  if (count_unread <= 0) return null;

  return <DotIndicator />;
}

export function MessageNews_DotIndicator() {
  const { status } = useSession();
  const utils = trpc_client.useUtils();
  const { data: count_unread, dataUpdatedAt } =
    trpc_client.notification.count_unread.useQuery(
      {
        type: NotificationGroup.Enum.INBOX,
      },
      { enabled: status === "authenticated" },
    );

  useUpdateEffect(() => {
    utils.inbox.find.invalidate();
  }, [dataUpdatedAt]);

  if (!count_unread) return null;
  if (count_unread <= 0) return null;

  return <DotIndicator />;
}

export function ExchangeNews_DotIndicator() {
  const { status } = useSession();
  const utils = trpc_client.useUtils();
  const { data: count_unread, dataUpdatedAt } =
    trpc_client.notification.count_unread.useQuery(
      {
        type: NotificationGroup.Enum.EXCHANGE,
      },
      { enabled: status === "authenticated" },
    );

  useUpdateEffect(() => {
    utils.exchanges.me.find.invalidate();
  }, [dataUpdatedAt]);

  if (!count_unread) return null;
  if (count_unread <= 0) return null;

  return <DotIndicator />;
}

export function NewsInMessage_Indicator() {
  const { status } = useSession();
  const { data: count_unread } = trpc_client.notification.count_unread.useQuery(
    {
      type: NotificationGroup.Enum.INBOX,
    },
    { enabled: status === "authenticated" },
  );
  return <Notification_CountIndicator count={count_unread} />;
}

export function NewsInExchange_Indicator() {
  const { status } = useSession();
  const { data: count_unread } = trpc_client.notification.count_unread.useQuery(
    {
      type: NotificationGroup.Enum.EXCHANGE,
    },
    { enabled: status === "authenticated" },
  );
  return <Notification_CountIndicator count={count_unread} />;
}

export function Notification_CountIndicator({
  count,
}: {
  count: number | undefined;
}) {
  if (!count) return null;
  if (count <= 0) return null;

  return (
    <span className={badge({ className: "text-sm", color: "danger" })}>
      {count}
    </span>
  );
}
