"use client";

import { TRPC_React } from ":trpc/client";
import type { Message } from "@1.modules/inbox.domain";
import { Timeline } from "@1.modules/inbox.ui/conversation/Timeline";
import { Spinner } from "@1.ui/react/spinner";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
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

    scroll_target_ref.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [query_info.status, scroll_target_ref]);

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
