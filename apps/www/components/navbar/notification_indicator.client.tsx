"use client";

import { TRPC_React } from ":trpc/client";
import { NotificationGroup } from "@1.modules/notification.domain";
import { DotIndicator } from "@1.modules/notification.ui/DotIndicator";
import { badge } from "@1.ui/react/badge/atom";
import { useAsync, useUpdateEffect } from "@react-hookz/web";

//

export function Notification_DotIndicator() {
  const utils = TRPC_React.useUtils();
  const { data: count_unread } = TRPC_React.notification.count_unread.useQuery(
    {},
    { refetchInterval: 1_000 * 30 },
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
  const utils = TRPC_React.useUtils();
  const { data: count_unread, dataUpdatedAt } =
    TRPC_React.notification.count_unread.useQuery({
      type: NotificationGroup.Enum.INBOX,
    });

  useUpdateEffect(() => {
    utils.inbox.find.invalidate();
  }, [dataUpdatedAt]);

  if (!count_unread) return null;
  if (count_unread <= 0) return null;

  return <DotIndicator />;
}

export function ExchangeNews_DotIndicator() {
  const utils = TRPC_React.useUtils();
  const { data: count_unread, dataUpdatedAt } =
    TRPC_React.notification.count_unread.useQuery({
      type: NotificationGroup.Enum.EXCHANGE,
    });

  useUpdateEffect(() => {
    utils.exchanges.me.find.invalidate();
  }, [dataUpdatedAt]);

  if (!count_unread) return null;
  if (count_unread <= 0) return null;

  return <DotIndicator />;
}

export function NewsInMessage_Indicator() {
  const { data: count_unread } = TRPC_React.notification.count_unread.useQuery({
    type: NotificationGroup.Enum.INBOX,
  });
  return <Notification_CountIndicator count={count_unread} />;
}

export function NewsInExchange_Indicator() {
  const { data: count_unread } = TRPC_React.notification.count_unread.useQuery({
    type: NotificationGroup.Enum.EXCHANGE,
  });
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
