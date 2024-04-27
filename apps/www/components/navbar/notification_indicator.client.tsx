"use client";

import { TRPC_React } from ":trpc/client";
import { DotIndicator } from "@1.modules/notification.ui/DotIndicator";
import { badge } from "@1.ui/react/badge/atom";

//

export function Notification_DotIndicator() {
  const { data: count_unread } = TRPC_React.notification.count_unread.useQuery(
    {},
    { refetchInterval: 10_000 },
  );

  if (!count_unread) return null;
  if (count_unread <= 0) return null;

  return <DotIndicator />;
}

export function NewMessage_Indicator() {
  const { data: count_unread } = TRPC_React.notification.count_unread.useQuery(
    {
      type: "INBOX_NEW_MESSAGE",
    },
    { refetchInterval: 10_000 },
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
