//

import { TRPC_React } from ":trpc/client";
import { sendGAEvent } from "@next/third-parties/google";
import { useRouter } from "next/navigation";
import { useCallback, type PropsWithChildren } from "react";

//

export function useMarkAsRead({
  notification_id,
  redirect_to,
}: {
  notification_id: string;
  redirect_to: string;
}) {
  const route = useRouter();
  const utils = TRPC_React.useUtils();
  const { mutateAsync } = TRPC_React.notification.mark_as_read.useMutation();

  const mark_as_read = useCallback(async () => {
    await mutateAsync({ notification_id });
    sendGAEvent({
      event: "mark_as_read",
      value: notification_id,
    });
    await utils.notification.count_unread.invalidate();
    await route.push(redirect_to);
  }, [notification_id, mutateAsync]);

  return { mark_as_read };
}

export function MarkAsRead(
  props: PropsWithChildren<{ notification_id: string; redirect_to: string }>,
) {
  const { children, notification_id, redirect_to } = props;
  const { mark_as_read } = useMarkAsRead({ notification_id, redirect_to });
  return (
    <button className="w-full text-left" onClick={mark_as_read}>
      {children}
    </button>
  );
}
