"use client";

import { TRPC_React } from ":trpc/client";
import type { Message } from "@1.modules/inbox.domain";
import { Timeline } from "@1.modules/inbox.ui/conversation/Timeline";
import { Spinner } from "@1.ui/react/spinner";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { P, match } from "ts-pattern";
import { z } from "zod";

//

export default function Infinite_Thread_Timeline({
  profile_id,
}: {
  profile_id: string;
}) {
  const scroll_target_ref = useRef<HTMLDivElement>(null);
  const params = z
    .object({ thread_id: z.string() })
    .parse(useParams(), { path: ["useParams()"] });
  const { thread_id } = params;

  const thread_update = TRPC_React.inbox.thread_update.useMutation();
  const query_info = TRPC_React.inbox.thread.messages.useInfiniteQuery(
    {
      thread_id,
    },
    {
      getPreviousPageParam: (d) => d.prevCursor,
    },
  ) as UseInfiniteQueryResult<{ data: Message }>;

  useLayoutEffect(() => {
    if (!scroll_target_ref.current) {
      return;
    }
    thread_update.mutate({ thread_id });
    scroll_target_ref.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [query_info.isFetching, scroll_target_ref]);

  const utils = TRPC_React.useUtils();
  const { data: session, status } = useSession();

  TRPC_React.inbox.thread.on_new_message.useSubscription(
    { token: session?.header.NEXTAUTH_TOKEN!, thread_id },
    {
      enabled: status === "authenticated",
      onData() {
        utils.inbox.thread.messages.invalidate({ thread_id });
      },
      onError(err) {
        console.error(
          "TRPC_React.inbox.thread.on_new_message > Subscription error:",
          err,
        );
        // we might have missed a message - invalidate cache
        utils.inbox.thread.messages.invalidate({ thread_id });
      },
    },
  );

  return match(query_info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => {
      return <Spinner />;
    })
    .with({ status: "success" }, () => (
      <>
        <Timeline query_info={query_info} profile_id={profile_id} />
        <div ref={scroll_target_ref}></div>
      </>
    ))
    .exhaustive();
}
